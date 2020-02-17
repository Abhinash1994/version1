var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var webhookobjectSchema = new Schema({

    obj : {},

    createdAt : {type : 'date'}

});

var WebhookObject = mongoose.model('webhookobject', webhookobjectSchema);
module.exports = WebhookObject;