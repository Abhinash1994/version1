var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var subscriptionSchema = new Schema({

    price : { type: 'string', required: true },

    loyality : { type: 'string', required: true },

   	subscriptionId : { type: 'number', required: true },    

    createdAt : { type: 'date', defaultsTo: Date.now() },

});

var Subscription = mongoose.model('subscription', subscriptionSchema);
module.exports = Subscription;