var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var parlorChairSchema = new Schema({

    parlorId : { type: Schema.Types.ObjectId, required: true },

    chairsPosition : {

    	type: [{

            chairId : {type : 'string', default : "0"},

            x: { type: 'number', default : 0 },

            y: { type: 'number', default : 0 },

            direction: { type: 'number', default : 0 },

            gender: { type: 'string', default : "F" },

            appointmentId : {type : Schema.ObjectId , default : null},

            isOccupied : { type : 'boolean', default : false},

            timeRemaining : { type : 'number', default : 0},

            isRoom : { type : 'boolean', default : false},

        }]
		, defaultsTo : [], required : true},
});

//type :  1 - add, 2- interchange, 3- remove, 4 - remove all

//{type : 1, songIds : [2,3,4,5], index : 0}


parlorChairSchema.statics.getCurrentStatus = function(date, parlorId, callback) {
    ParlorChair.findOne({ parlorId: parlorId }, function(er, d) {
       
        Appointment.aggregate([
                {
                    $match : {
                        parlorId : ObjectId(parlorId),
                        status : 1,
                    }
                },
                {
                    $project : {
                        appointmentId : "$_id",
                        appointmentStartTime : "$appointmentStartTime",
                        appointmentEndTime : { $add: [ "$appointmentStartTime", { $multiply: [ "$estimatedTime", 60000 ] }] },
                        estimatedTime : "$estimatedTime",
                        gender : "$client.gender",
                        services : 1
                    }
                },
                {
                    $match : {
                        appointmentStartTime : {$lte : date},
                        appointmentEndTime : {$gte : date},
                    }
                },
                {
                    $unwind : "$services",
                },
                {
                    $group : {
                        _id : "$appointmentId",
                        appointmentId : {$first : "$appointmentId"},
                        appointmentStartTime : {$first : "$appointmentStartTime"},
                        appointmentEndTime : {$first : "$appointmentEndTime"},
                        estimatedTime : {$first : "$estimatedTime"},
                        gender : {$first : "$gender"},
                        categoryIds : {$push : "$services.categoryId"},
                    },
                }
            ]).exec(function(err, appointments){
                _.forEach(appointments, function(appt, key){
                    var assigned = false;
                    var r = _.filter(appt.categoryIds, function(c){ return c +"" == "58707ed90901cc46c44af279" });
                    if(key%2 == 1)r = [1];
                    var requiredRoom = r.length > 0 ? true : false;
                    _.forEach(d.chairsPosition, function(fg, key){
                        if(!fg.isOccupied && !assigned && ((fg.isRoom && requiredRoom) || (!fg.isRoom && !requiredRoom))){
                            assigned = true;
                            fg.isOccupied = true;
                            fg.appointmentId = appt.appointmentId;
                            // fg.appointmentId = 2;
                            fg.gender = appt.gender,
                            // fg.gender = "F",
                            fg.timeRemaining = parseInt(HelperService.getMinutesBetweenTwoDates(date, appt.appointmentEndTime));    
                            // fg.timeRemaining = 22;    
                        }
                    });
                });
                return callback(d);
            });
    });
};

var ParlorChair = mongoose.model('parlorchair', parlorChairSchema);
module.exports = ParlorChair;
