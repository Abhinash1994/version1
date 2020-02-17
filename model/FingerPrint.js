var mongoose = require('mongoose');
var Schema = mongoose.Schema;

 var fingerPrintSchema = new Schema({
    employeeId : { type: 'string', required: true },    
    centerId : { type: 'string', required: true },    
    time : { type: 'string' },
    // post : { type: 'string' },
    printCode: { type : 'string'},
    createdAt : { type: 'date', defaultsTo: Date.now() },
  });

    fingerPrintSchema.statics.getNewObj = function(req){
      return {
          employeeId : req.body.employeeId,
          centerId : req.body.centerId,
          time : req.body.time,
          printCode : req.body.printCode,
          createdAt : new Date(),
      };
  };

    fingerPrintSchema.statics.parseArray = function(data){
      return _.map(data, function(d){
      		return {
      			employeeId : d.employeeId,
            centerId : d.centerId,
            time : d.time,
            printCode : d.printCode,
            createdAt : new Date(),
      		}
      });
  };

 var FingerPrint = mongoose.model('fingerPrint', fingerPrintSchema);
 module.exports = FingerPrint;