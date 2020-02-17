
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var salonPersonalCouponSchema = new Schema({
    couponCode : { type: 'string', required: true }, 
    description : { type: 'string', required: true },
    active : { type: 'boolean', required: true, default : true },
    percentOff : { type: 'number', required: true },
    maxOff : { type: 'number', required: true },
    endDate : {type : 'date', required : true},
    startDate : {type : 'date', required : true},
	parlorId: { type: Schema.Types.ObjectId, ref: '' },
	appointmentId: { type: Schema.Types.ObjectId, ref: '' },
    createdAt : { type: 'date', default: Date.now() },
});


var SalonPersonalCoupon = mongoose.model('salonpersonalcoupon', salonPersonalCouponSchema);
module.exports = SalonPersonalCoupon;