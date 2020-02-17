var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var salonCouponSmsSchema = new Schema({
   
    phoneNumber : { type: "string" },
    message: {type: 'string'},
    createdAt : {type : 'date'},
    parlorId : {type :  Schema.ObjectId}
});


salonCouponSmsSchema.pre('save', function (next) {
    var currentDate = new Date();
    this.role = parseInt(this.role);
    this.updatedAt = currentDate;
    if (!this.createdAt)
        this.createdAt = currentDate;

    next();
});
var SalonCouponSms = mongoose.model('saloncouponsms', salonCouponSmsSchema);
module.exports = SalonCouponSms;