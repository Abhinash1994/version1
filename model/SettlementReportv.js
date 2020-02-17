/**
 * Admin.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
// -ve (salon se lena hai amount)
// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var settlementReportvSchema = new Schema({

    parlorName: { type: 'string' },

    parlorEntityName: { type: 'string' },

    invoiceId: { type: 'number', default: 0 },

    parlorAddress: { type: 'string' },

    dateOfSettlement: { type: 'date' },

    startDate: { type: 'date' },

    endDate: { type: 'date' },

    periodOfSettlement: { type: 'number' },

    serviceRevenue: { type: 'number', default: 0 },

    previousPendingAmount: { type: 'number', default: 0 },

    amountPaid: { type: 'number', default: 0 },

    balanceAmount: { type: 'number', default: 0 },

    period: { type: 'number', default: 0 },

    actualCommission: { type: 'number', default: 0 },

    // refundAppDigital : { type: 'number',default : 0},

    refundAppDigitalOnline: { type: 'number', default: 0 },

    refundAppDigitalCash: { type: 'number', default: 0 },

    refundAppDigitalOnlineMTD: { type: 'number', default: 0 },

    refundAppDigitalCashMTD: { type: 'number', default: 0 },

    refundFirstAppDigital: { type: 'number', default: 0 },

    refundFirstAppCash: { type: 'number', default: 0 },

    refundOnErp: { type: 'number', default: 0 },

    refundOnErpTillDate: { type: 'number', default: 0 },

    actualCommissionTillDate: { type: 'number', default: 0 },

    amountCollectedTillDate: { type: 'number', default: 0 },
    
    amountCollectedTillDateBeforeDiscount: { type: 'number', default: 0 },

    productRevenue: { type: 'number', default: 0 },

    totalRevenue: { type: 'number', default: 0 },

    membershipSold: { type: 'number', default: 0 },

    membershipPurchased: { type: 'number', default: 0 },

    totalCollectionByParlor: { type: 'number', default: 0 },

    totalCollectionByBeu: { type: 'number', default: 0 },

    collectedByLoyalityPoints: { type: 'number', default: 0 },

    collectedByMembershipCredits: { type: 'number', default: 0 },

    collectedByMembershipCreditsForOtherParlor: { type: 'number', default: 0 },

    totalCollection: { type: 'number', default: 0 },

    finalRemaining: { type: 'number', default: 0 },

    pendingAmount: { type: 'number', default: 0 },

    pendingAmountBuffer: { type: 'number', default: 0 },

    netAmountTransferred: { type: 'number', default: 0 },

    collectedByApp: { type: 'number', default: 0 },

    collectedByAffiliates: { type: 'number', default: 0 },

    revenueModel: { type: 'number', default: 0 },

    totalPastRevenueService: { type: 'number', default: 0 },

    thresholdAmount1: { type: 'number', default: 0 },

    thresholdAmount1Commission: { type: 'number', default: 0 },

    thresholdAmount2: { type: 'number', default: 0 },

    thresholdAmount2Commission: { type: 'number', default: 0 },

    thresholdAmount3: { type: 'number', default: 0 },

    thresholdAmount3Commission: { type: 'number', default: 0 },

    royalityPercentageService: { type: 'number', default: 0 },

    royalityPercentageProduct: { type: 'number', default: 0 },

    discountPercentage: { type: 'number', default: 0 },

    amountPayableToBeu: { type: 'number', default: 0 },

    lessDiscount: { type: 'number', default: 0 },

    status: { type: 'number', default: 1 },

    reason: { type: 'string', default: 'successfully generated' },

    amountPayableToBeuAfterDiscount: { type: 'number', default: 0 },

    amountPayableToBeuBeforeDiscount: { type: 'number', default: 0 },

    serviceTax: { type: 'number', default: 0 },

    amountPayableToBeuAfterTax: { type: 'number', default: 0 },

    advancePaid: { type: 'number', default: 0 },

    netPayable: { type: 'number', default: 0 }, // -ve (salon se lena hai amount)

    parlorId: { type: Schema.ObjectId, ref: 'parlor' },

    createdAt: { type: 'date' },

    updatedAt: { type: 'date' },

    freebiesPayoutJulyTillDate: { type: 'number' },

    freebiesPayoutSinceJoining: { type: 'number' },

    cashBackErpAndAppPayoutJulyTillDate: { type: 'number' },

    cashBackErpAndAppPayoutSinceJoining: { type: 'number' },

    discountOnPurchase: { type: 'number', default: 0 },

    higherValue: { type: 'number', default: 0 },

    collectedByAppCash: { type: 'number', default: 0 },

    paid: { type: 'boolean', default: true }, // true

    previousDue: { type: 'number', default: 0 }, // netPayable

    paidToSalon: { type: 'number', default: 0 }, // 0 

    balance: { type: 'number', default: 0 }, //  previousDue +  netPayable

    onlinePaymentFee: { type: 'number', default: 0 },

    onlinePaymentFeeTax: { type: 'number', default: 0 },

    membershipSoldByBeu: { type: 'number', default: 0 },

    firstAppCashPercent: { type: 'number', default: 0 },

    appCashPercent: { type: 'number', default: 0 },

    firstAppDigitalPercent: { type: 'number', default: 0 },

    appDigitalPercent: { type: 'number', default: 0 },

    onErpPercent: { type: 'number', default: 0 },

    subscriptionSoldBySalon: { type: 'number', default: 0 },

    isMailSent: { type: 'boolean', default: true },

    subscriptionLoyalty: { type: 'number', default: 0 },

    paidDate: { type: 'date' },

    commissionMgBeforeDiscount : { type: 'number' , default : 0},

    commissionMgAfterDiscount : { type: 'number' , default : 0},

});




// on every save, add the date
settlementReportvSchema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();
    this.role = parseInt(this.role);

    // change the updated_at field to current date
    this.updatedAt = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.createdAt)
        this.createdAt = currentDate;
    next();
});
// settlementReportSchema.plugin(autoIncrement.plugin, 'admin');

var SettlementReportv = mongoose.model('settlementReportv', settlementReportvSchema);

// make this available to our users in our Node applications
module.exports = SettlementReportv;