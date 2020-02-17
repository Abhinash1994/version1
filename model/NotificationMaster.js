var mongoose = require('mongoose');
var Schema = mongoose.Schema;

 var notificationSchema = new Schema({
      clientId : {type : Schema.ObjectId, default : null},

      cityId : {type : 'number', default : 1}, //1- NCR

      action : {type : 'string', default : 'offer'}, // offer, started, review,  freebie, recommendation

      appointmentId : {type : Schema.ObjectId, default : null}, 

      imageUrl1 : {type : 'string', default : null},

      imageUrl2 : {type : 'string', default : null}, 

      title : {type : 'string'}, 

      body : {type : 'string'}, 

      typeOfNotification : {type : 'string'},

      categoryId : {type : Schema.ObjectId},

      sendingDate : { type: 'date',default:new Date()},

      sent : {type : 'boolean', default : true}, 

      active : {type : 'boolean', default : true},

      createdAt : { type: 'date', default:new Date() }
  });