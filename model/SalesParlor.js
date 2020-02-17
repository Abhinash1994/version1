var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var salesParlorSchema = new Schema({
      name : { type : 'string', required : true},
      ownerName : { type : 'string'},
      ownerMobileNo : { type : 'string'},
      landLineNo : { type : 'string'},
      alternateMobileNo : { type : 'string'},
      managerName : { type : 'string'},
      managerPhoneNumber : { type : 'string'},
      address : { type : 'string'},
      city : { type : 'string'},
      zone : { type : 'string'},
      locality : { type : 'string'},
      ambienceRating : { type : 'number'},
      emailId : { type : 'string'},
      address2 : { type : 'string'},
      landmark : { type : 'string'},
      parlorGender : { type : 'string'},
      latitude : { type : 'string'},
      longitude : { type : 'string'},
      currentStatus : { type : 'string'},
      floor : {type : 'string'},
      parlorType : {type : 'string'},
      size : {type : 'string'},
      shampoo : {type : 'string'},
      beauty : {type : 'string'},
      whatsAppNumber : {type : 'string'},
      pedi : {type : 'string'},
      createdAt : { type: 'date', defaultsTo: Date.now() },
});

salesParlorSchema.statics.getParlorObj = function(req){
  req.body.city = req.body.city1
  req.body.zone = req.body.zone1
  return req.body;
      /*return {
          name : req.body.name,
          ownerName :req.body.ownerName ,
          ownerMobileNo : req.body.ownerMobileNo,
          landLineNo : req.body.landLineNo,
          alternateMobileNo :req.body.alternateMobileNo,
          managerName : req.body.managerName,
          address : req.body.address,
          city : req.body.city,
          emailId : req.body.emailId,
          address2 : req.body.address2,
          landmark : req.body.landmark,
          parlorGender : req.body.parlorGender,
          latitude : req.body.latitude,
          longitude : req.body.longitude,
          createdAt : new Date(),
      };*/
  };

 var SalesParlor = mongoose.model('salesparlor', salesParlorSchema);
 module.exports = SalesParlor;