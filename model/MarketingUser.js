/**
 * Created by ginger on 12/01/2018.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var marketingUserSchema = new Schema({

    createdAt: { type: 'date' },

    updatedAt: { type: 'date' },

    userId : { type: Schema.Types.ObjectId, ref: 'users'},

    firstName : {type: 'String'},

    lastName : {type: 'String'},

    emailId : {type: 'String'},

    firebaseIdIOS : { type: 'string', default: null },

    firebaseId : { type: 'string', default: null },

    longitude : {type: 'number', default: null},

    latitude : {type: 'number', default: null},

    loyalityPoints : { type: 'number', default: 0 },

    phoneNumber : {type: 'String' , unique: true},

    gender : { type: 'string', enum: ["M", "F"], size: 1, default: "M" },

    lastAppointmentDate : { type: 'date' },

    lastParlor : {type: 'String'},

    lastParlorId : { type: Schema.Types.ObjectId, ref: 'parlors'},

    appointmentCount : { type: 'number', default: 0 },

    androidVersion: { type: 'string', default: null },

    iosVersion: { type: 'string', default: null },

    subscriptionId : { type : 'number', default: 0 },

    premiumCustomer : {type :'boolean' , default : false},

    maximumBill : {type :'number' , default : 0},

    totalRevenue : {type :'number' , default : 0},

    marketingCategories : {
      type : []
    },
    
    servicesTaken : {
        type : []
    },
    
    cityId: {type: 'number' , default :1},
})

marketingUserSchema.pre('save', function(next) {
    var currentDate = new Date();
    this.updatedAt = currentDate;
    if (!this.createdAt)
        this.createdAt = currentDate;
    next();
});

marketingUserSchema.pre('update', function(next) {
  this.update({},{ $set: { updatedAt: new Date() } });
  next();
});

var MarketingUser = mongoose.model('marketingusers', marketingUserSchema);
module.exports = MarketingUser;
