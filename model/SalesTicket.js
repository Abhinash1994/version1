var mongoose = require('mongoose');
var Schema = mongoose.Schema;

 var salesTicketSchema = new Schema({
    date : {type : 'date'},
    parlorId : {type : Schema.ObjectId}, 
    actionType : {type : 'string'}, 
    nextAction : {type : 'string'},
    status : {type : 'string'},
    callMeeting : {type : 'string'},
    salesPersons : {type : [
    	{
    		personId : {type: Schema.ObjectId} ,
    		name : {type : 'string'},
    	}]
    },
    senior : {type : 'string'},
    comments : {type : 'string'},
    createdAt : { type: 'date', defaultsTo: Date.now() },
  });


    salesTicketSchema.statics.getNewTicket = function(req){
      return req.body;
  };

 var SalesTicket = mongoose.model('salesticket', salesTicketSchema);
 module.exports = SalesTicket;