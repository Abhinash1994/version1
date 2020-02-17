/**
 * Created by ginger on 7/28/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var salonCheckInSchema = new Schema({

    userId: { type: Schema.Types.ObjectId, ref: 'owner' },

    checkIn: { type: 'date', default: null },

    checkOut: { type: 'date', default: null },

    checkIncheckOuts : [{
        checkIn : {type : 'date'},
        checkOut : {type : 'date'},
        timeInInteger : {type : 'Number'},
        createdAt : {type : 'date'},
        updatedAt : {type : 'date'},
    }],

    parlorId: { type: Schema.Types.ObjectId, ref: 'parlor', default: null },

    firstCheckInLocationId: { type: Schema.Types.ObjectId},

    formSubmitted: { type: 'boolean', default : false},

    distanceTravelled : {type : 'Number', default : 0},

    distanceTravelledSalonToHome : {type : 'Number', default : 0},

    previousLatitude : {type : 'Number', default : 0},

    previousLongitude : {type : 'Number', default : 0},

    distanceType : {type : 'String', default : "home"}, //home, salon

    latitude: 'Number',

    longitude: 'Number',

    parlorName: 'String',

    createdAt: { type: 'date' },

    updatedAt: { type: 'date' },

    randomize: { type: 'string' },

    macAddress: 'String',

    checkinFlag: { type: 'boolean', default: false },

    uniqueHash: { type: 'string' },

    creationFlag: 'Number',

    checkInFormId: { type: Schema.Types.ObjectId},

    formStatus: 'String'

});


salonCheckInSchema.statics.updateVisitAndCreateForm = function(visits, userId, cb) {
    Async.each(visits, function(visit, callback) {
        SalonCheckin.findOne({firstCheckInLocationId : visit.firstCheckInLocationId, userId : userId}, {checkIncheckOuts : 1}, function(err, s){
            visit.checkIncheckOuts = _.filter(visit.checkIncheckOuts, function(ff){ return ff.noOfTime > 2});
            if(s){
                _.forEach(visit.checkIncheckOuts, function(ch){
                    var present = false;
                    _.forEach(s.checkIncheckOuts, function(c){
                        if(c.checkIn.getTime() == ch.checkIn.getTime()){
                            present = true;
                            c.checkOut = ch.checkOut;
                            c.timeInInteger = ch.timeInInteger;
                        }
                    });
                    if(!present){
                        s.checkIncheckOuts.push(ch);
                    }
                });
                SalonCheckin.update({_id : s.id}, {checkIncheckOuts : s.checkIncheckOuts}, function(er, f){
                    callback();
                });
            }else{
                if(visit.checkIncheckOuts.length>0 && visit.checkIncheckOuts[0].noOfTime > 2){
                    SalonCheckin.create(visit, function(err, f){
                        SubmitBeuForm.createCheckInForm(visit.parlorId, userId, function(err, formDetail){
                            SalonCheckin.update({_id : f.id}, {checkInFormId : formDetail.formId}, function(er, fo){
                                    SalonCheckin.updateLocationDistance(userId, f);
                                    callback();
                            });
                        });
                    });    
                }else{
                    callback();
                }
            }
        });
    }, function allTaskCompleted() {
        cb();
    });
};

salonCheckInSchema.statics.updateLocationDistance = function(userId, salonCheckinObj) {
    SalonCheckin.findOne({userId : userId, createdAt : {$gt : HelperService.getTodayStart()}, firstCheckInLocationId : {$ne : salonCheckinObj.firstCheckInLocationId}}).sort({createdAt : -1}).exec(function(err, s){
        var latitude1, longitude1, latitude2, longitude2, distance = 0;
        console.log(err);
        console.log(s);
        if(s){
            LocationTracker.find({_id : {$in : [s.firstCheckInLocationId, 
                salonCheckinObj.firstCheckInLocationId] }}, function(er, locs){
                var l1 = _.filter(locs, function(lo){return lo.id + "" == s.firstCheckInLocationId + ""})[0];
                var l2 = _.filter(locs, function(lo){return lo.id + "" == salonCheckinObj.firstCheckInLocationId + ""})[0];
                latitude1 = l1.latitude; longitude1 = l1.longitude;
                latitude2 = l2.latitude; longitude2 = l2.longitude;
                SalonCheckin.getDistanceByRoad(latitude1, longitude1, latitude2, longitude2, function(d){
                    SalonCheckin.update({_id : salonCheckinObj.id}, {distanceTravelled : d,previousLatitude: latitude1 ,previousLongitude : longitude1 ,distanceType : "salon"}, function(err, f){
                            console.log(f);                        
                        });
                });
            })
        }else{
            LocationTracker.findOne({_id : salonCheckinObj.firstCheckInLocationId}, function(er, loc){
                latitude2 = loc.latitude;longitude2 = loc.longitude;
                Beu.findOne({_id : userId}, function(er, user){
                    if(user.latitude){
                        latitude1 = user.latitude;longitude1 = user.longitude;
                        SalonCheckin.getDistanceByRoad(latitude1, longitude1, latitude2, longitude2, function(d){
                            SalonCheckin.update({_id : salonCheckinObj.id}, {distanceTravelled : d,previousLatitude: latitude1 ,previousLongitude : longitude1 ,distanceType : "home"}, function(er, d){
                                console.log(d);
                            });
                        });
                    }else{
                        SalonCheckin.update({_id : salonCheckinObj.id}, {distanceTravelled : 0}, function(err, d){
                                console.log(d);
                        });
                    }
                });
            });

        }
    });

};

salonCheckInSchema.statics.getDistanceByRoad = function(latitude1, longitude1, latitude2, longitude2, cb){
    var request = require("request");
    var url = "https://maps.googleapis.com/maps/api/distancematrix/json?origins=" + latitude1 + ","+longitude1 + "&destinations=" + latitude2 + "," + longitude2 + "&key=AIzaSyDvS7vSQ3GyiwLAOaXooTUWJKwBoxrMK6A&mode=driving",
        response;
    request({
        url: url,
        json: true
    }, function(error, response, body) {
        console.log(error);
        if (!error && response.statusCode === 200) {
            return cb(response.body.rows[0].elements[0].distance.value);
        }
    })
};

salonCheckInSchema.statics.checkInCheckOutByDate = function(date, cb) {
    var startDate = HelperService.getDayStart(date);
    var endDate = HelperService.getDayEnd(date);
    SalonCheckin.aggregate([
    {
        $match : {
            createdAt : {$gt : startDate, $lt : endDate},
            'checkIncheckOuts.0': {$exists: true},
        },
    },
    {
        $project : {
            userId : 1,
            "checkIncheckOuts.checkIn" : 1,
            "checkIncheckOuts.checkOut" : 1,
            parlorId : 1,
            distanceTravelled : 1,
            distanceTravelledSalonToHome : 1,
            distanceType : 1,
            parlorName : 1,
        }
    },
    {
        $group : {
            _id : "$userId",
            userId : {$first : "$userId"},
            checkInDetails : {$push : {distanceType : "$distanceType", distanceTravelled : "$distanceTravelled", distanceTravelledSalonToHome : "$distanceTravelledSalonToHome", parlorName : "$parlorName", parlorId : "$parlorId", checkIncheckOuts : "$checkIncheckOuts"} }
        }
    }, 
    {
        $lookup : {
            from : "beus",
            localField : "userId",
            foreignField : "_id",
            as : "user",
        }
    },
    {
        $project : {
            name : {$arrayElemAt: [ "$user.firstName", 0 ] },
            userId : 1,
            checkInDetails : 1,
        }
    },
    ]).exec(function(err, data){
        return cb(data);
    })
};

salonCheckInSchema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();
    // change the updated_at field to current date
    this.updatedAt = currentDate;
    this.randomize = this.uniqueHash + "" + (currentDate).toString();
    // if created_at doesn't exist, add to that field
    if (!this.createdAt)
        this.createdAt = currentDate;

    next();
});

var SalonCheckin = mongoose.model('salonCheckin', salonCheckInSchema);
module.exports = SalonCheckin;