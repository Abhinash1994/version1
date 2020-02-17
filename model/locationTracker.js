/**
 * Created by ginger on 7/28/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var trackerSchema = new Schema({

    userId: { type: Schema.Types.ObjectId, ref: 'owner' },

    latitude: 'Number',

    longitude: "Number",

    time: { type: 'date' },

    createdAt: { type: 'date' },

    timeInInteger : {type : 'Number'},

    forceCheckIn : {type : 'Boolean', default : false},

    VisitId: { type: Schema.Types.ObjectId, ref: 'salonCheckin' },

    parlorId: { type: Schema.Types.ObjectId, ref: 'parlor', default: null },

    macAddress: 'String',

    uniqueHash: { type: 'string', default : null },

    updatedAt: { type: 'date' },

    count: { type: Number, default: 1 },

    checkInCheckout: { type: 'number', enum: [0, 1, 2], size: 1, default: 0 }

});



trackerSchema.statics.getNewObj = function(userId, location) {
    return {
        userId : userId,
        latitude : location.latitude,
        longitude : location.longitude,
        time : new Date(location.time),
        createdAt : new Date(),
        uniqueHash : new Date(location.time).getTime()+userId,
        timeInInteger : new Date(location.time).getTime(),
        forceCheckIn : location.forceCheckIn,
    };
};

trackerSchema.statics.updateVisitWithCheckInCheckOut = function(userId, cb) {
    var parlors, locations;
    Async.parallel([
        function(callback) {
            Parlor.find({active : localVar.isServer()}, {latitude : 1, longitude : 1, name :1}, function(err, parlors1){
                parlors = parlors1;
                callback(null);
            })
        },
        function(callback) {
            LocationTracker.find({timeInInteger : {$gt : 0}, userId : userId, time : {$gt : HelperService.getTodayStart(), $lt : HelperService.getDayEnd(new Date()) }}, {latitude : 1, longitude : 1, time : 1}).sort({time : 1}).exec(function(err, locations1){
                locations = locations1;
                callback(null);
            });
        }
    ],
    function(err, results) {
        var visits = [];
        _.forEach(locations, function(location){
            var nearBySalon = LocationTracker.checkNearbySalon(location, parlors);
            if(nearBySalon.parlorId){
                var found = false, key = 0; 
                _.forEach(visits, function(v, k){
                   if(v.parlorId + "" == nearBySalon.parlorId + ""){
                        found = true;
                        key = k;
                   }
                });
                if(found){
                    var length = visits[key].checkIncheckOuts.length-1;
                    console.log(location.time.getTime() - visits[key].checkIncheckOuts[length].timeInInteger);
                    if(location.time.getTime() - visits[key].checkIncheckOuts[length].timeInInteger > 400000){
                        visits[key].checkIncheckOuts.push({
                            checkIn : location.time,
                            checkOut : location.time,
                            timeInInteger : location.time.getTime(),
                            noOfTime : location.forceCheckIn ? 3 : 1,
                            createdAt : new Date(),
                            updatedAt : new Date(),
                        });
                    }else{
                        visits[key].checkIncheckOuts[length].timeInInteger = location.time.getTime();
                        visits[key].checkIncheckOuts[length].noOfTime += 1;
                        visits[key].checkIncheckOuts[length].checkOut = location.time;
                    }
                }else{
                    visits.push(LocationTracker.getNewVisitObj(nearBySalon, location, userId));
                }
            }
        });
        SalonCheckin.updateVisitAndCreateForm(visits, userId, function(){
            cb();
        });
    });
};

trackerSchema.statics.getNewVisitObj = function(nearBySalon, location, userId) {
    return {
        userId : userId,
        checkIncheckOuts : [{
            checkIn : location.time,
            checkOut : location.time,
            timeInInteger : location.time.getTime(),
            noOfTime : location.forceCheckIn ? 3 : 1,
            createdAt : new Date(),
            updatedAt : new Date(),
        }],
        firstCheckInLocationId : location.id,
        uniqueHash : location.id,
        parlorId : nearBySalon.parlorId,
        parlorName : nearBySalon.parlorName,
    };
};

trackerSchema.statics.checkNearbySalon = function(location, parlors) {
    var nearBySalon = {parlorId : null, parlorName : null};
    _.forEach(parlors, function(p){
        var distance = parseInt(HelperService.getDistanceBtwCordinates1(p.latitude, p.longitude, location.latitude, location.longitude) * 100);
        if (distance <= 20) {
            nearBySalon.parlorId = p.id;
            nearBySalon.parlorName = p.name;
        }
    });
    return nearBySalon;
};

trackerSchema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();
    // change the updated_at field to current date
    this.updatedAt = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.createdAt)
        this.createdAt = currentDate;

    next();
});
var LocationTracker = mongoose.model('locationTracker', trackerSchema);
module.exports = LocationTracker;