var mongoose = require('mongoose');
var Schema = mongoose.Schema;

 var attendanceSchema = new Schema({
    employeeId : { type: 'string', required: true },    
    centerId : { type: 'string', required: true },    
    time : { type: 'date' },
    // machineTime : { type: 'date' },
    machineTime2 : { type: 'string' },
    createdAt : { type: 'date', defaultsTo: Date.now() },
  });

    attendanceSchema.statics.getNewObj = function(req){
       var today = new Date();
       var attendanceTime = new Date(req.body.time);
          return {
              employeeId : req.body.employeeId.replace(/ /g,''),
              centerId : req.body.centerId,
              time : new Date(),
              machineTime2 : req.body.time,
              createdAt : new Date(),
          };
  };

    attendanceSchema.statics.parseArray = function(data){
     
        return _.map(data, function(d){
            return {
              employeeId : d.employeeId,
              centerId : d.centerId,
              time : d.time,
              createdAt : d.createdAt,
            }
        });
  };

 var Attendance = mongoose.model('attendance', attendanceSchema);
 module.exports = Attendance;