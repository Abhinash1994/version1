// On Transactions
// 1	-App Transaction	Every 5th App Transaction
// 2-Salon Transaction	Every 50th Transaction (Both App and ERP)
// 3	-Customer Review	Above 3 Star Rating
// 4	-Bill Value Above 4000	Bill Value lies in  top 1% Salon Bill Value and Above 4000
// 5	-Bill Service Above 6	Bill Services lies in  top 1%  and Above6 Services per Bill
// 6	-Membership Sold	First Bill after the membership sold via app
//
//
// On Achieving Targets
//
// 7	-Achieved L1 Target	L1 of each and each category employee is touched
// 8-	Achieved L2 Target	L2 of each and each category employee is touched
// 9	-Achieved L3 Target	L3 of each and each category employee is touched
// 10	-Bill Shared Ratio	Maximum Bill Shared Ratio
// 11	-Best Rated Employee	Best Rated Employee


/**
 * Created by ginger on 5/8/2017.
 */



var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;


var luckyDrawSchema = new Schema({

    parlorId: { type: Schema.Types.ObjectId, required: true, ref: 'parlors', unique: true },
    activeCategories : [],
    appTransaction: {
        value: { type: 'number', default: 0 },
        amount: { type: 'number', default: 0 },
        employeeMessage: { type: 'string', default: '' },
        salonMessage: { type: 'string', default: '' },

    },

    subsTransaction: {
        type: [{
                value: { type: 'number', default: 0 },
                amount: { type: 'number', default: 0 },
                employeeMessage: { type: 'string', default: '' },
                salonMessage: { type: 'string', default: '' },

            }] //v
    },
    subsRevenue: {
        type: [{
                upperLimit: { type: 'number', default: 0 },
                lowerLimit: { type: 'number', default: 0 },
                amount: { type: 'number', default: 0 },
                employeeMessage: { type: 'string', default: '' },
                salonMessage: { type: 'string', default: '' },

            }] //v
    },
    salonTransaction: {
        value: { type: 'number', default: 0 },
        amount: { type: 'number', default: 0 },
        employeeMessage: { type: 'string', default: '' },
        salonMessage: { type: 'string', default: '' },
    },
    customerReview: {
        value: { type: 'number', default: 0 },
        amount: { type: 'number', default: 0 },
        employeeMessage: { type: 'string', default: '' },
        salonMessage: { type: 'string', default: '' },
    },
    billValue: {
        value: { type: 'number', default: 0 },
        amount: { type: 'number', default: 0 },
        employeeMessage: { type: 'string', default: '' },
        salonMessage: { type: 'string', default: '' },
    },
    billServices: {
        value: { type: 'number', default: 0 },
        amount: { type: 'number', default: 0 },
        employeeMessage: { type: 'string', default: '' },
        salonMessage: { type: 'string', default: '' },
    },
    checkIn: {
        value: { type: 'number', default: 0 },
        amount: { type: 'number', default: 0 },
        employeeMessage: { type: 'string', default: '' },
        salonMessage: { type: 'string', default: '' },
    },
    newMemberShip: {
        value: { type: 'number', default: 0 },
        amount: { type: 'number', default: 0 },
        employeeMessage: { type: 'string', default: '' },
        salonMessage: { type: 'string', default: '' },
    },
    packages: {
        value: { type: 'number', default: 0 },
        amount: { type: 'number', default: 0 },
        employeeMessage: { type: 'string', default: '' },
        salonMessage: { type: 'string', default: '' },
    },

    membershipSold: {
        // value:{type:'number',default:0},
        amount: { type: 'number', default: 0 },
        employeeMessage: { type: 'string', default: '' },
        salonMessage: { type: 'string', default: '' },
    },
    retailProduct: {
        value: { type: 'number', default: 0 },
        amount: { type: 'number', default: 0 },
        employeeMessage: { type: 'string', default: '' },
        salonMessage: { type: 'string', default: '' },
    },
    incentiveTargets: [],
    sharedBillRatio: {
        value: { type: 'number', default: 0 },
        amount: { type: 'number', default: 0 },
        employeeMessage: { type: 'string', default: '' },
        salonMessage: { type: 'string', default: '' },
    },
    bestRatedEmployee: {
        value: { type: 'number', default: 0 },
        amount: { type: 'number', default: 0 },
        employeeMessage: { type: 'string', default: '' },
        salonMessage: { type: 'string', default: '' },
    },
    employeeSection: {
        value: { type: 'number', default: 0 },
        amount: { type: 'number', default: 0 },
        employeeMessage: { type: 'string', default: '' },
        salonMessage: { type: 'string', default: '' },
    },
    nonSubsAppTransaction: {
        type: [{
            upperLimit: { type: 'number', default: 0 },
            lowerLimit: { type: 'number', default: 0 },
            amount :{type :'number'},
            employeeMessage :{type :'string'},
            salonMessage :{type :'string'},
        }]
    },
    beuIncentiveModel: {
        type: [{
            upperLimit: { type: 'number', default: 0 },
            lowerLimit: { type: 'number', default: 0 },
            amount :{type :'number'},
            employeeMessage :{type :'string'},
            salonMessage :{type :'string'},
        }]
    },
    onProductRevenue: {
        type: [{
            upperLimit: { type: 'number', default: 0 },
            lowerLimit: { type: 'number', default: 0 },
            amount :{type :'number'},
            employeeMessage :{type :'string'},
            salonMessage :{type :'string'},
        }]
    },
    onServiceRevenue: {
        type: [{
            upperLimit: { type: 'number', default: 0 },
            lowerLimit: { type: 'number', default: 0 },
            amount :{type :'number'},
            employeeMessage :{type :'string'},
            salonMessage :{type :'string'},
        }]
    },
    skinCoServices: {
        amount: { type: 'number', default: 0 },
        employeeMessage: { type: 'string', default: '' },
        salonMessage: { type: 'string', default: '' },
    },
    onlinePayment: {
        type: [{
            upperLimit: { type: 'number', default: 0 },
            lowerLimit: { type: 'number', default: 0 },
            amount :{type :'number'},
            employeeMessage :{type :'string'},
            salonMessage :{type :'string'},
        }]
    },
    salonSubscription: {
        type: [{
            upperLimit: { type: 'number', default: 0 },
            lowerLimit: { type: 'number', default: 0 },
            amount :{type :'number'},
            employeeMessage :{type :'string'},
            salonMessage :{type :'string'},
        }]
    },

    createdAt: { type: 'date' },

    updatedAt: { type: 'date' }

});




luckyDrawSchema.statics.createNew = function(req, cb) {
    console.log(req)
    LuckyDrawModel.create(req, function(err, done) {
        if (err) {
            // console.log(err)
            cb(true, err);
        } else {
            cb(false, done);
        }
    })
}

luckyDrawSchema.statics.editModel = function(req, cb) {
    console.log(req.body)
    var data = {}
    data.appTransaction = req.body.appTransaction;
    data.salonTransaction = req.body.salonTransaction;
    data.customerReview = req.body.customerReview;
    data.billValue = req.body.billValue;
    data.billServices = req.body.billServices;
    data.membershipSold = req.body.membershipSold;
    data.retailProduct = req.body.retailProduct;
    data.incentiveTargets = req.body.incentiveTargets;
    data.sharedBillRatio = req.body.sharedBillRatio;
    data.bestRatedEmployee = req.body.bestRatedEmployee;
    console.log(data)
    LuckyDrawModel.update({ _id: req.body._id }, data, function(err, done) {
        if (err) {
            cb(true, err);
        } else {
            cb(false, done);
        }
    })
}

luckyDrawSchema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();
    // change the updated_at field to current date
    this.updatedAt = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.createdAt)
        this.createdAt = currentDate;

    next();
});

var LuckyDrawModel = mongoose.model('luckyDrawModel', luckyDrawSchema);

module.exports = LuckyDrawModel;