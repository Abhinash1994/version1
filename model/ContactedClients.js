/**
 * Created by ginger on 10/27/2017.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var contactedClientSchema = new Schema({
    clientId:{ type: Schema.Types.ObjectId, ref: 'users'},
    createdAt: { type: 'date' },
    updatedAt: { type: 'date' },
    clientName: {type : 'String'},
    lastVisitedParlorName: {type : 'String'},
    lastVisitedParlorId:{ type: Schema.Types.ObjectId, ref : 'parlors'},
    clientPhoneNumber : {type : 'String'},
    lastVisited : { type: 'date' },
    toCompareDate : {type : 'date'},
    fromWhere : {type : 'number', default : 0}, //0 : three months, 1 : coupon,
    latestParlor : {type : 'String'},
    couponCode : {type : 'String'},
    latestParlorId : { type: Schema.Types.ObjectId, ref : 'parlors'},
    isConverted : { type: 'Boolean', default: false },
    couponUsedDate : { type : 'date' },
    contactHistory : {
        type: [{
            customerCareId : { type: Schema.ObjectId },
            customerCareName : {type : 'String'},
            remark: { type: 'String' },
            callStatus: { type: 'String'},
            contactedOn : { type: 'date' },
            expectedOn : { type : 'date'}
        }]
    },
});

contactedClientSchema.pre('save', function(next) {
    var currentDate = new Date();
    this.updatedAt = currentDate;
    if (!this.createdAt)
        this.createdAt = currentDate;
    next();
});

var ContactedClients = mongoose.model('contactedclients', contactedClientSchema);
module.exports = ContactedClients;
