
/**
 * Created by nikita on 8/02/2018.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var marketingSchedularSchema = new Schema({

    createdAt: { type : 'date' },

    updatedAt: { type : 'date' },

    userId : { type : Schema.Types.ObjectId, ref: 'users'},

    type : { type : 'number'} , //1- mail , 2- sms , 3- notification

    serviceId : { type : Schema.Types.ObjectId } ,

    sendTime : { type : 'date'},

    phoneNumber : { type : 'string'},

    smsContent : {type : 'string'},

    notificationTitle : {type : 'string'},

    notificationContent : {type : 'string'},

    firebaseId : { type : 'string'},

    firebaseIdIOS : { type : 'string'},

    emailId: { type : 'string', size: 50 },

    status : { type : 'number', default : 0}, //0 for not done 1 for done 

    repeatDaysInterval : {type : 'number', default : 0},

})

marketingSchedularSchema.pre('save', function(next) {

    var currentDate = new Date();

    this.updatedAt = currentDate;

    if (!this.createdAt)

        this.createdAt = currentDate;

    next();
});

marketingSchedularSchema.pre('update', function(next) {

  this.update({},{ $set: { updatedAt: new Date() } });

  next();

});

var MarketingSchedular = mongoose.model('marketingschedular', marketingSchedularSchema);
module.exports = MarketingSchedular;
