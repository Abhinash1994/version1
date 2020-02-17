/**
 * Created by ginger on 11/20/2017.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var websiteQuerySchema = new Schema({
    createdAt : { type: 'date' },
    updatedAt : { type: 'date' },
    name : {type : 'String'},
    phoneNumber : {type : 'String'},
    email : {type : 'String'},
    queryText : {type : 'String'},
    agentResponse : {type : 'String'},
    queryType : {type : 'number', default : 0}, //0 for website query 1 for subscription query entered by our customer care
    isConverted : {type: 'Boolean', default : false},
    value : {},
    detail : {},
    source : {type: 'String', default : ''},
    customerCareName : {type : 'string'},
    customerCareId : { type: Schema.ObjectId }

});

websiteQuerySchema.pre('save', function(next) {
    var currentDate = new Date();
    this.updatedAt = currentDate;
    if (!this.createdAt)
        this.createdAt = currentDate;
    next();
});

websiteQuerySchema.pre('update', function(next) {
  this.update({},{ $set: { updatedAt: new Date() } });
  next();
});

var WebsiteQuery = mongoose.model('websitequery', websiteQuerySchema);
module.exports = WebsiteQuery;
