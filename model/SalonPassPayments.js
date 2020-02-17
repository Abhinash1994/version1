
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var salonPassPaymentSchema = new Schema({
    
    createdAt : { type: 'date' },
    
    updatedAt : { type: 'date' },
    
    name : {type : 'String'},

    phoneNumber : {type : 'String', required: true},

    paymentObj : {},

    emailId: {type: 'String'},

    amount : {type: 'number'},

    otp : {type: 'number'},

    status : {type: 'number'} //0- unused, 1-used

});

salonPassPaymentSchema.pre('save', function(next) {
    var currentDate = new Date();
    this.updatedAt = currentDate;
    if (!this.createdAt)
        this.createdAt = currentDate;
    next();
});


// salonPassPaymentSchema.pre('update', function(next) {
//   this.update({},{ $set: { updatedAt: new Date() } });
//   next();
// });

var SalonPassPayments = mongoose.model('salonpasspayment', salonPassPaymentSchema);
module.exports = SalonPassPayments;
