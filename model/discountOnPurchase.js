/**
 * Created by ginger on 7/31/2017.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var discountInSchema = new Schema({

    "parlorId": { type: Schema.Types.ObjectId, ref: 'parlor' },

    "parlorName": { type: 'String' },

    "orderId": { type: Schema.Types.ObjectId, ref: 'parlor' },

    "sellerId": { type: Schema.Types.ObjectId, ref: 'sellers' },

    "sellerName": { type: 'String' },

    "purchase": { type: 'Number' },

    "purchaseTillDate": { type: 'Number' },

    "discount": { type: 'Number' },

    "targetRevenue": { type: 'Number' },

    upFrontDiscount : { type : 'number'},

    "discountBucket": { type: 'Number' },

    "revenueBookedInErp": { type: 'Number' },

    "discountPaid": { type: 'Number' },

    "paid": { type: 'boolean', default: false },

    "balanceInDiscountBucket": { type: 'Number' },

    "updatedAt": { "type": 'date' },

    "time": { "type": 'date' },

    "createdAt": { "type": 'date' }, 

    month : { type : 'number'},

    year : { type : 'number'},

    opening : { type: 'boolean' , default : false},

    closing : { type: 'boolean' , default : false},

    actualAmountPaid : {type : 'number' }

});


discountInSchema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();
    // change the updated_at field to current date
    this.updatedAt = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.createdAt)
        this.createdAt = currentDate;

    next();
});

var DisountOnPurchase = mongoose.model('disountOnPurchase', discountInSchema);
module.exports = DisountOnPurchase;