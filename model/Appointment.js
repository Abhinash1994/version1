/**
 * Appointment.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;
var request = require('request');
var async = require('async');
var MarketingUserNew = require('../model/MarketingUsersNew');


var appointmentSchema = new Schema({

    parlorId: { type: Schema.ObjectId, ref: 'parlor', required: true },

    parlorAppointmentId: { type: 'number', required: true },

    invoiceId: { type: 'number', default: 0 },

    parlorName: { type: 'String', default: 'test' },

    parlorTax: {type : 'number', default : 0},

    homeServiceOnly: {type : 'Boolean', default : false},
    
    address1: {type : 'String', default : null},

    salonExtraDiscountCoupon: {type : 'String', default : null}, // Extra discount given to salon relatives

    address2: {type : 'String', default : null},

    addressLatitude: {type : 'number', default : null},

    isSubscriptionAppointment : {type : 'Boolean', default : false},

    addressLongitude: {type : 'number', default : null},

    appRevenueDiscountPercentage: {type : 'number', default : 0},

    parlorAddress: { type: 'String' },

    facebookId: { type: 'String' },

    parlorAddress2: { type: 'String' },

    contactNumber: { type: 'String' },

    mode: { type: 'number', default: 3 }, // 1- android, 2 - ios, 3 - web, 4 - phone call, 5- website, 6- Billing App , 7- facebookChat, 9- website

    client: {

        id: { type: Schema.Types.ObjectId, ref: 'User' },
        customerId: { type: 'number' },
        name: { type: 'String', required: true },
        phoneNumber: { type: 'String', required: true },
        emailId: { type: 'String' },
        gender: { type: 'String' },
        subscriptionLoyality: { type: 'number', default: 0 },
        creditsLeft: { type: 'number' },
        noOfAppointments: { type: 'number', default: 0 }
    },

    review: {

        userImage: { type: 'string', default: '' },

        text: { type: 'string' },

        reply: { type: 'string' },

        replyDate : {type : 'date'},

        isHelpful: { type: 'number', default: 0 },

        notHelpful: { type: 'number', default: 0 },

        isFeatured: { type: 'Boolean', default: false },

        employees: [{

            employeeId: { type: Schema.Types.ObjectId },

            rating: { type: 'number' },

            text: { type: 'string' },
        }],

        rating: { type: 'number' },

        createdAt: { type: 'date' }

    },

    receptionist: {
        userId: { type: Schema.ObjectId },
        name: { type: 'String' },
        phoneNumber: { type: 'String' },
        gender: { type: 'String' }
    },

    freeLoyalityPoints: { type: 'number', default: 0 },

    parlorType: { type: 'number', default: 0 },

    loyalityOffer: { type: 'number', default: 0 },

    parlorOffer: { type: 'Boolean', default: false },

    loyalitySubscription: { type: 'number', default: 0 },

    couponLoyalityPoints: { type: 'number', default: 0 },

    couponLoyalityCode: { type: 'string' },

    couponError: { type: 'String', default: '' },

    couponCodeId: { type: Schema.ObjectId, default: null },

    noOfTimeOtpSend: { type: 'number', default: 0 },

    onlinePaymentDiscount: { type: 'number', default: 0 },

    editedByCrm: { type: 'number', default: 0 },

    cashbackUsed: { type: 'Boolean', default: false },

    latitude: { type: 'number', default: null },

    longitude: { type: 'number', default: null },

    appointmentStartTime: { type: 'date', required: true },

    appointmentOriginalStartTime: { type: 'date', required: true },

    appointmentEndTime: { type: 'date' },

    status: { type: 'number', default: 1 }, // 1 - appointment pending, 2 - declined, 3 - finished, 4 - started

    appointmentType: { type: 'number', default: 1 }, // 1 - walkin , 2 - call, 3 - online

    paymentMethod: { type: 'number', default: 1 }, //1 - cash, 2 - card, 3 - advance cash, 4 - advance online, 5 - razor pay, 6 - paytm, 12- multiple , 13 - nearby , 8 - amex card, 11 - nearby, 10 - beu

    notificationSent: { type: 'number', default: 0 },

    estimatedTime: { type: 'number', default: 0, required: true },

    membersipCreditsLeft: { type: 'number', default: 0 },

    personalCouponCode : {type : 'string', default : null},

    comment: { type: 'string', default: '' },

    cancelComment: { type: 'string' },

    superSetServices: { type: [], defaultsTo: [] },

    services: {

        type: [{

            id: { type: 'number' },

            categoryId: { type: Schema.ObjectId },

            serviceId: { type: Schema.ObjectId },

            isFlashSale: { type: 'Boolean', default : false },

            serviceCode: { type: 'number' },

            expiryDate: { type: 'date' },

            serviceDiscount : {type : 'number', default : 0},

            newAdditions : {type : 'number', default : 0},

            name: { type: 'String', required: true },

            serviceName: { type: 'String', required: true },

            type: { type: 'String' },

            quantity: { type: 'number', required: true },

            discount: { type: 'number', default: 0 },

            frequencyDiscountUsed: { type: 'Boolean', default: false },

            membershipDiscount: { type: 'number', default: 0 },

            loyalityPoints: { type: 'number', default: 0 },

            discountMedium: { type: 'string' },

            additions: { type: 'Number' },

            gstNumber: { type: 'string' },

            gstDescription: { type: 'string' },

            revenue: { type: 'Number' },

            typeIndex: { type: 'number', default: null },

            productId: { type: Schema.ObjectId, default: null },

            brandProductDetail: { type: 'String', default: '' },

            productRatio: { type: 'number', default: 1 },

            brandId: { type: Schema.ObjectId, default: null },

            brandRatio: { type: 'number', default: null },

            creditsUsed: { type: 'number', default: 0 },

            employees: {
                type: [{
                    employeeId: { type: Schema.ObjectId },
                    getPercentageCashback: { type: 'String' },
                    name: { type: 'String' },
                    commission: { type: 'number' },
                    distribution: { type: 'number' }
                }]
            },

            employeeId: { type: Schema.ObjectId },

            creditsSource: {
                type: [{
                    parlorId: { type: Schema.ObjectId },
                    credits: { type: 'number' }
                }],
                defaultsTo: []
            },

            estimatedTime: { type: 'number' },

            price: { type: 'number', required: true },

            dealDiscount: { type: 'number', default: 0 }, // discount given by deal 2+1 per service

            subtotal: { type: 'number', required: true },

            additionIndex: { type: 'number', default: 0 },

            tax: { type: 'number', required: true },

            dealId: { type: Schema.ObjectId },

            originalDealId: { type: Schema.ObjectId },

            frequencyDealFreeService: { type: 'number' },

            frequencyPrice: { type: 'number' },

            dealPriceUsed: { type: 'Boolean', default: false },

            actualPrice: { type: 'number', required: true },

            actualDealPrice: { type: 'number', default: 0 },

            clientFirstAppointment: { type: 'Boolean', default: false },

        }],
        defaultsTo: []
    },

    products: {
        type: [{
            productId: { type: 'number' },
            code: { type: 'number' },
            name: { type: 'String' },
            quantity: { type: 'number' },
            price: { type: 'number' },
            tax: { type: 'number' },
            discount: { type: 'number' },
            costPrice: { type: 'number' },
            commission: { type: 'number' },
            employeeId: { type: Schema.ObjectId },
            employee: { type: 'String' }
        }],
        defaultsTo: []
    },

    productsFromApp: {
        type: [{
            itemId: { type: 'number' },
            name: { type: 'String' },
            quantity: { type: 'number' },
            price: { type: 'number' },
            tax: { type: 'number' },
        }],
        defaultsTo: []
    },

    departmentRevenue: {
        type: [{
            departmentId: { type: Schema.ObjectId },
            revenue: { type: 'number', default: 0 },
            noOfService: { type: 'number', default: 0 },
        }],
        defaultsTo: []
    },

    noOfService: { type: 'number', default: 0 },

    serviceRevenue: { type: 'number', default: 0 },

    serviceRedeemRevenue: { type: 'number', default: 0 },

    productRevenue: { type: 'number', default: 0 },

    freebiesThreading: { type: 'number', default: 0 },

    employees: {
        type: [{
            employeeId: { type: Schema.ObjectId },
            name: { type: 'string', required: true },
            estimatedTime: { type: 'number' },
            commission: { type: 'number' },
            revenue: { type: 'number' }
        }],
        defaultsTo: []
    },

    errorMessage : {type : 'string', default : ""},

    marketingSource : {type : {}, default : null},

    /*    chair : {

        },
    */
    allPaymentMethods: {
        type: [{
            value: { type: 'number', required: true },
            name: { type: 'string' },
            amount: { type: 'number', required: true }
        }],
        defaultsTo: []
    },

    otherCharges: { type: 'number', required: true },

    productPrice: { type: 'number', required: true, default: 0 },

    subtotal: { type: 'number', required: true },

    tax: { type: 'number', required: true },

    discount: { type: 'number', required: true, default: 0 },

    couponCode: { type: 'string', default: null },
    
    flashCouponCode: { type: 'string', default: null },

    discountOnOnlinePayment: { type: 'Boolean', default: false },

    discountMedium: { type: 'string', default: 'none' },

    creditUsed: { type: 'number', default: 0 },

    membershipSaleId: { type: Schema.Types.ObjectId },

    membershipDiscount: { type: 'number', required: true, default: 0 },

    loyalityPoints: { type: 'number', default: 0 },

    membershipId: { type: Schema.Types.ObjectId, ref: 'Membership' },

    buyMembershipId: { type: Schema.Types.ObjectId, ref: 'Membership' },

    buySubscriptionId: { type: 'number', default: null },

    subscriptionReferralCode: { type: 'string', default: null },

    useMembershipCredits: { type: Schema.Types.ObjectId, ref: 'Membership' },

    membershipAmount: { type: 'number', default: 0 },

    subscriptionAmount: { type: 'number', default: 0 },

    productAmount: { type: 'number', default: 0 },

    closedBy: { type: Schema.Types.ObjectId, default: null },

    membershipType: { type: 'number', required: true, default: 0 },

    cashback: { type: 'number', required: true, default: 0 },

    payableAmount: { type: 'number', required: true, default: 0 },

    advanceCredits: { type: 'number', default: 0 },

    oldCredits: { type: 'number', default: 0 },

    useAdvanceCredits: { type: 'Boolean', default: false },

    isPaid: { type: 'Boolean', default: false },

    appBooking: { type: 'number', default: 1 }, // 1 - crm, 2 - app

    bookingMethod: { type: 'number', default: 1 }, // 1 - crm, 2 - app, 3 - android, 4 - ios , 5- website, 

    useOldCredits: { type: 'Boolean', default: false },

    otp: { type: 'string', required: false, default: 0 },

    createdAt: { type: 'date' },

    updatedAt: { type: 'date' },

    razorPayCaptureResponse: {},

    razorPayObj: {},

    paytmResponse: {},

    ePayLaterResponse : {},

    paytmObj: {},

    razorRefundObj: {},

    salonEmailId: { type: 'string' },

    facebookCheckIn: { type: "Boolean", default: false },

    clientFirstAppointment: { type: 'Boolean', default: false },

    employeeFromApp: { type: 'Boolean', default: false },

    source: { type: 'string' },

    userSource: { type: 'number' },

});

var RAZORPAY_KEY = localVar.getRazorKey();
var RAZORPAY_APP_SECRET = localVar.getRazorAppSecret();

var PAYTM_MERCHANT_MID = 'GINGER36609910776955';
var PAYTM_MERCHANT_KEY = 'gmf&pcrs26t!!dzS';
var PAYTM_INDUSTRY_TYPE = 'Retail';

appointmentSchema.statics.refundPayment = function(req, callback) {
    var Razorpay = require('razorpay');
    var url='';
    var message='';
    var instance = new Razorpay({
        key_id: RAZORPAY_KEY,
        key_secret: RAZORPAY_APP_SECRET
    });
    Appointment.findOne({ _id: req.body.appointmentId, status: 1 }, function(err, appointment) {
        if (!appointment) {
            return callback(CreateObjService.response(true, 'Invalid appointment Id'));
        } else {
            var phoneNumber=appointment.client.phoneNumber;
            if(appointment.paymentMethod==5 && appointment.bookingMethod == 2){
                var now=new Date();
            if( appointment.appointmentStartTime.getTime() - now.getTime() >= (1000 * 3600)){
                instance.payments.refund(appointment.razorPayObj.id, appointment.payableAmount, function(error, response) {
                console.log("razor error",error);
                if(error){
                    console.log("in error",error.error.description)
                    return callback(CreateObjService.response(true,error.error.description));
                }else{
                     console.log("razor response",response);

                    Appointment.update({ _id: req.body.appointmentId }, { razorRefundObj: response,status:2 }, function(e, a) {
                        if (appointment.loyalitySubscription > 0 && (new Date() - appointment.appointmentStartTime < 1)) {
                            User.update({ _id: req.body.userId }, { $pull: { subscriptionRedeemHistory: { appointmentId: appointment._id } } }, function(err, subscriptionRefund) {
                                console.log(err)
                            })
                        }
                     message="Your appointment has been cancelled & we have initiated your refund, which will reflect in your account within 5-7 business days.";
                    url=getSmsUrl('BEUSLN', message, [phoneNumber], 'T');
                    Appointment.sendSMS(url, function(e) {
                        return callback(CreateObjService.response(false, 'Your appointment has been cancelled & we have initiated your refund, which will reflect in your account within 5-7 business days.'));
                    });
                });
                }

               
            });
            }else{
                 // Appointment.update({ _id: req.body.appointmentId }, { status:1 }, function(e, a) {
                    message="Your appointment has been cancelled, please email us your details at customercare@beusalons.com to process your refund.";
                        url=getSmsUrl('BEUSLN', message, [phoneNumber], 'T');
                        Appointment.sendSMS(url, function(e) {
                            return callback(CreateObjService.response(false,"Your appointment has been cancelled, please email us your details at customercare@beusalons.com to process your refund."));
                        });
                // });
                 

            }
            console.log("refund payment in else");

            }else{
                Appointment.update({ _id: req.body.appointmentId }, {status:2 }, function(e, a) {
                     if (appointment.loyalitySubscription > 0 && (new Date() - appointment.appointmentStartTime < 1)) {
                            User.update({ _id: req.body.userId }, { $pull: { subscriptionRedeemHistory: { appointmentId: appointment._id } } }, function(err, subscriptionRefund) {
                                console.log(err)
                            })
                        }
                    message="Your appointment has been cancelled successfully.";
                    url=getSmsUrl('BEUSLN', message, [phoneNumber], 'T');
                    Appointment.sendSMS(url, function(e) {
                        return callback(CreateObjService.response(false, 'Your appointment has been cancelled successfully.'));
                    });
                     
                });
               
            }
            
            
        }
    });
};


appointmentSchema.statics.refundSubscription = function(data, callback) {
    var Razorpay = require('razorpay');
    var url='';
    var message='';
    var instance = new Razorpay({
        key_id: RAZORPAY_KEY,
        key_secret: RAZORPAY_APP_SECRET
    });
    console.log("data" , data)

            var phoneNumber=data.phoneNumber;
            var amount = (data.referUserId == 2) ? 10000 : 20000;
            var messageAmount = (data.referUserId == 2) ? 100 :200;
            var oName = data.clientName.substring(0,data.clientName.indexOf(' '));
            var name  = oName.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}); 

            var data1 = { type: "nikita", title: "Referral amount initiated", body: ""+name+" just used your referral code, hence we have initiated your referral amount of Rs "+messageAmount+", which will reflect in your account within 5-7 business days." }

            console.log("amount" , amount)
                instance.payments.refund(data.razorPayId, {amount}, function(error, response) {
                if(error){
                    console.log("in error",error.error.description)
                    return callback(CreateObjService.response(true,error.error.description));
                }else{
                     console.log("razor response",response);

                    SubscriptionSale.update({ userId : data.userId }, {$push:{referralRefunds: response} }, function(e, a) {
                       
                        message=""+name+" just used your referral code, hence we have initiated your referral amount of Rs "+messageAmount+", which will reflect in your account within 5-7 business days.";

                        url=getSmsUrl('BEUSLN', message, [phoneNumber], 'T');
                        Appointment.sendSMS(url, function(e) {
                            if (data.firebaseId) {
                                Appointment.sendAppNotificationAdmin([data.firebaseId], data1, function(err3, resp) {
                                    console.log(err3)
                                })
                            } else if (data.firebaseIdIOS) {
                                Appointment.sendAppNotificationIOSAdmin([data.firebaseIdIOS], data1, function(err3, resp) {
                                    console.log(err3)
                                })
                            } else {
                                console.log("No Firebase Id")
                            }
                            return callback(CreateObjService.response(false, 'done'));
                        });
                    });
                }   
            });
       
};


appointmentSchema.statics.captureSubscriptionPayment = function(paymentId, amount, callback) {
    var Razorpay = require('razorpay');
    var instance = new Razorpay({
        key_id: RAZORPAY_KEY,
        key_secret: RAZORPAY_APP_SECRET
    });
    instance.payments.capture(paymentId, amount, function(error, response) {
        console.log("response", error)
        if(!error){
            AuthorizedPayment.update({appointmentId : response.notes.appointmentId}, {captured : true, updatedAt : new Date()}, function(er, f){
                return callback(error, response);
            })
        }
    });
};



appointmentSchema.statics.capturePaytmPayment = function(appointmentId, response, callback) {
            Appointment.findOne({ _id: appointmentId, status: { $in: [0, 1, 4] } }, function(err2, app) {
                    if (!err2) {
                        if (app) {
                            Parlor.findOne({ _id: app.parlorId }, { tax: 1,phoneNumber:1 ,parlorType:1}, function(err, parlor) {
                                app.payableAmount = Math.ceil(( app.subtotal - app.loyalityPoints - app.creditUsed / (1 + parlor.tax / 100) - app.membershipDiscount) * (1 + parlor.tax / 100));
                                console.log(app.payableAmount)
                                
                                var appointmentAmount = parseInt(app.payableAmount+ app.productAmount + app.membershipAmount + app.subscriptionAmount)
                                
                                if(parseInt(response.TXNAMOUNT) - appointmentAmount == 1){
                                    appointmentAmount = appointmentAmount + 1;
                                } 
                                else if( appointmentAmount - parseInt(response.TXNAMOUNT)  == 1){
                                    appointmentAmount = appointmentAmount - 1;
                                }
                                if (appointmentAmount == parseInt(response.TXNAMOUNT)) {
                                    response.id = "paytm" + response.TXNID;
                                    Appointment.paymentCapturedSucessEvent(app, null, null, response, null, parlor, function(re){
                                        return callback(re);
                                    });
                                } else {
                                    return callback(CreateObjService.response(true, 'Invalid amount'));
                                }
                            });
                        } else {
                            return callback(CreateObjService.response(true, 'Invalid appointment id captured - '));
                        }
                    } else {
                        return callback(CreateObjService.response(true, 'Invalid appointment Id'));
                    }
            });
};

appointmentSchema.statics.captureEPayLaterPayment = function(appointmentId, response, callback) {
            Appointment.findOne({ _id: appointmentId, status: { $in: [0, 1, 4] } }, function(err2, app) {
                    if (!err2) {
                        if (app) {
                            Parlor.findOne({ _id: app.parlorId }, { tax: 1,phoneNumber:1 ,parlorType:1}, function(err, parlor) {
                                app.payableAmount = Math.ceil(( app.subtotal - app.loyalityPoints - app.creditUsed / (1 + parlor.tax / 100) - app.membershipDiscount) * (1 + parlor.tax / 100));
                                console.log(app.payableAmount)
                                if (parseInt(app.payableAmount+ app.productAmount + app.membershipAmount + app.subscriptionAmount) == parseInt(response.amount)/100) {
                                    response.id = "epaylater" + response.eplOrderId;
                                    Appointment.paymentCapturedSucessEvent(app, null, null, null, response, parlor, function(re){
                                        return callback(re);
                                    });
                                } else {
                                    return callback(CreateObjService.response(true, 'Invalid amount'));
                                }
                            });
                        } else {
                            return callback(CreateObjService.response(true, 'Invalid appointment id captured - '));
                        }
                    } else {
                        return callback(CreateObjService.response(true, 'Invalid appointment Id'));
                    }
            });
};

appointmentSchema.statics.captureRazorPaymentLink = function(instance, obj, callback) {
    var auth = new Buffer(localVar.getRazorKey() + ':' + localVar.getRazorAppSecret()).toString('base64');
    var uri='https://api.razorpay.com/v1/invoices?payment_id='+ obj.payment_id
                
                request({
                    uri:uri ,
                    method: 'GET',
                    headers: {
                         'Authorization' : 'Basic ' + auth,
                      "Content-type": "application/json"
                    }
                    
                  }, function (err, response, body) {

        var appointment = JSON.parse(body)
        console.log(appointment)
        // appointment.items[0].receipt = "5cf0b5891b403b791c41641b"
            Appointment.findOne({ _id: appointment.items[0].receipt, status: { $in: [0, 1, 4] } }, function(err2, app) {
                console.log(app)
                if(app){
                    Parlor.findOne({ _id: app.parlorId }, { tax: 1 , phoneNumber:1}, function(err, parlor) {
                        app.payableAmount = Math.ceil((app.subtotal - app.loyalityPoints - app.creditUsed / (1 + parlor.tax / 100) - app.membershipDiscount) * (1 + parlor.tax / 100));
                        console.log(app.payableAmount)
                        if (parseInt(app.payableAmount + app.productAmount + app.membershipAmount + app.subscriptionAmount) * 100 == parseInt(appointment.items[0].amount)) {
                                    Appointment.paymentCapturedSucessEvent(app, appointment.items[0], appointment.items[0], null, null, parlor, function(re){
                                        return callback(re);
                                    });
                               
                        } else {
                            return callback(CreateObjService.response(true, 'Invalid amount'));
                        }
                    });
                }else{
                    return callback(CreateObjService.response(true, 'Invalid payment Link'));
                }
            })
    })
}

appointmentSchema.statics.captureRazorPayment = function(instance, obj, callback) {
    instance.payments.fetch(obj.razorpay_payment_id, function(err, appointment) {
        console.log("app",appointment);
        console.log(err)
        if (!err && appointment.notes.appointmentId) {
               // appointment.notes.appointmentId="5cfaa2c0d74ed76eb3fd035a"
            Appointment.findOne({ _id: appointment.notes.appointmentId, status: { $in: [0, 1, 4] } }, function(err2, app) {
                    if (!err2) {
                        if (app) {
                            Parlor.findOne({ _id: app.parlorId }, { tax: 1 , phoneNumber:1}, function(err, parlor) {
                                app.payableAmount = Math.ceil((app.subtotal - app.loyalityPoints - app.creditUsed / (1 + parlor.tax / 100) - app.membershipDiscount) * (1 + parlor.tax / 100));
                                console.log(app.payableAmount)
                                if (parseInt(app.payableAmount + app.productAmount + app.membershipAmount + app.subscriptionAmount) * 100 == parseInt(appointment.amount)) {
                                    instance.payments.capture(obj.razorpay_payment_id, obj.amount, function(error, response) {
                                        if (1) {
                                            AuthorizedPayment.update({appointmentId : appointment.notes.appointmentId}, {captured : true, updatedAt : new Date()}, function(er, f){
                                                Appointment.paymentCapturedSucessEvent(app, appointment, response, null, null, parlor, function(re){
                                                    return callback(re);
                                                 });    
                                            })
                                        } else {
                                            return callback(CreateObjService.response(true, 'Unable to capture transaction'));
                                        }
                                    });
                                } else {
                                    return callback(CreateObjService.response(true, 'Invalid amount'));
                                }
                            });
                        } else {
                            return callback(CreateObjService.response(true, 'Invalid appointment id captured - ' + appointment.notes.appointmentId));
                        }
                    } else {
                        return callback(CreateObjService.response(true, 'Invalid appointment Id'));
                    }
            });
        } else {
            return callback(CreateObjService.response(true, 'Invalid razor payment Id'));
        }

    });
};

appointmentSchema.statics.paymentCapturedSucessEvent = function(app, razorPayObj, razorPayCaptureResponse, paytmResponse, ePayLaterResponse, parlor, callback) {
    var status = 1;
    if (app.subscriptionAmount > 0 && app.services.length == 0) status = 3;
    User.findOne({ _id: app.client.id }, function(err, user) {
        Appointment.update({ _id: app.id, status: { $in: [0, 1, 4] } }, {
            appBooking: 2,
            paymentMethod: 5,
            status: status,
            razorPayObj: razorPayObj,
            razorPayCaptureResponse: razorPayCaptureResponse,
            paytmResponse : paytmResponse,
            ePayLaterResponse : ePayLaterResponse,
            isPaid: true,
            payableAmount: app.payableAmount,
            loyalityOffer: app.loyalityOffer,
            bookingMethod: 2,
            allPaymentMethods: [{ value: 10, name: 'beu', amount: app.payableAmount }]
        }, function(err, resp) {
            var message = { type: "A", name: app.client.name, amount: app.payableAmount, appointmentId: app.parlorAppointmentId };
            var socketD = 'newOrder';
            if (app.appointmentType != 3) {
                message = { type: "P", name: app.client.name, amount: app.payableAmount, appointmentId: app.parlorAppointmentId };
                socketD = 'payment';
            }

            // io.sockets.in(app.parlorId + "").emit(socketD, { data: message });
            Appointment.findOne({ _id: app.id }, function(err, newAppointmentObj) {
                /*if (newAppointmentObj.buyMembershipId) {
                    Appointment.addMembershipToUser(user.id, user.phoneNumber, user.firstName, newAppointmentObj.buyMembershipId, newAppointmentObj.membershipAmount, newAppointmentObj.creditUsed, newAppointmentObj.id);
                }*/
                if (newAppointmentObj.buySubscriptionId) {
                    console.log("inside buy subscription")
                    var paymentResponse = razorPayObj ? razorPayCaptureResponse : paytmResponse ? paytmResponse : ePayLaterResponse;
                    Appointment.addSubscriptionToUserv4(newAppointmentObj.parlorId, newAppointmentObj, user.id, user.createdAt, paymentResponse, newAppointmentObj.subscriptionAmount, newAppointmentObj.subscriptionReferralCode, 'default', function(r) {

                    });
                }
                Appointment.count({ 'client.id': user.id, status: { $in: [3] }, paymentMethod: 5, cashbackUsed: true }, function(err, cashbackCount) {

                    var getFreebies = Appointment.getFreebiesPoints(5, newAppointmentObj, cashbackCount, false, user.isCorporateUser);
                    sendCashbackReferal(getFreebies.loyality, user.id, user.firstName, user.firebaseId, user.firebaseIdIOS, 0);
                    Appointment.useLoyalityAndFreeServices(newAppointmentObj, user, function(sss) {
                        if (sss)
                            return callback(CreateObjService.response(false, 'Appointment Booked'));
                        else
                            return callback(CreateObjService.response(true, 'Freebies Not present'));
                    });
                });

                app.paymentMethod = 5;
                        var usermessage = Appointment.appointmentBookedSms(app, user.firstName, user.phoneNumber,parlor.phoneNumber, parlor.tax , true);
                        if(newAppointmentObj.services.length > 0){
                            Appointment.sendSMS(usermessage, function(e) {
                            });
                            Appointment.sendAppointmentMail(app, user.emailId, function() {
                            });
                        }
                        
                        Admin.findOne({parlorIds :{$in : [parlor.id]} , parlorType: 4},{firebaseId : 1}, function(err , owner){
                            console.log("ownerrrrr" , owner)
                            var date = app.appointmentStartTime.toDateString();
                            var title = "New Appointment" , body = "New Appointment has been booked in your salons of amount "+app.payableAmount+" for "+date+"." , type = "appointment";
                            if(owner){
                                ParlorService.sendIonicNotification(owner.firebaseId, title, body, type, app.id, function(){
                                    
                                })
                            }
                        })

            })

        });
        
                // return callback(CreateObjService.response(false, 'Appointment Booked'));
    });
};

appointmentSchema.statics.addSubscriptionToUserv4 = function(parlorId, newAppointmentObj, userId, userCreatedAt, razor, amount, subscriptionReferralCode, source, callback) {
    var actualPricePaid = amount;
    console.log(razor)
    AppointmentHelperService.getSubscriptionAmountv4(userId, amount, newAppointmentObj, subscriptionReferralCode, function(amt){
        console.log(amt, "amt")
    amount = amt;
    var subscriptionId = (amount >= 1699) ? 1 : 2;
    var subscriptionLoyality = (amount >= 1699) ? 500 : 200;
    var obj = {
        userId: userId,
        subscriptionId: subscriptionId,
        price: amount,
        actualPricePaid : actualPricePaid,
        response: razor,
        createdAt: new Date(),
        razorPayId: razor.id,
        source: source,
        couponCode : subscriptionReferralCode,
        parlorId : subscriptionReferralCode == "SALON" ? parlorId : null
    };
    var subscriptionOffer = HelperService.getSubscriptionOfferValidity(userCreatedAt);
    var extraMonthOffer = 0;
    if (subscriptionOffer.offerApplicable) {
        extraMonthOffer = 1;
    }
    var msgAmount = (amount >= 1699) ? 500 : 200;
    var type = (amount >= 1699) ? "Gold" : "Silver";
    var data1 = { type: "loginBased", title: "Refer & earn Rs 200 on each referral", body: "Refer subscription to your friends & earn Rs 200 on each referral every time your friend uses your referral code to subscribe." }
    // var message2 = "Hi "+name+", Your number ("+phoneNumber+") has been registered for Be U Salons' annual subscription (SalonPass). Download the app and start enjoying free services worth Rs 500/month for next 12 months, at outlets near you. https://appurl.io/7eqzdGL5v";
    var message2 = "Thank you for purchasing Be U Salons " + type + " Subscription. Avail services worth Rs " + msgAmount + "/month free for 1 year. ."
    SubscriptionSale.findOne({ razorPayId: razor.id }, function(err, ss) {
        if (!ss) {
            SubscriptionSale.create(obj, function(err, f) {
                console.log(err)
                console.log("-----------------------------------------------------------")
                Parlor.updateEarlyBirdData(parlorId , f.subscriptionId);

                console.log("created subscription")
                if (!subscriptionReferralCode) subscriptionReferralCode = "dassD&*%FVV";
                User.findOne({ _id: userId }, { firebaseId: 1, firebaseIdIOS: 1, phoneNumber: 1 , firstName:1, subscriptionId : 1, subscriptionBuyDate : 1, subscriptionValidity : 1}, function(err2, user) {
                    User.findOne({ referCode: subscriptionReferralCode }, { subscriptionValidity: 1 , phoneNumber:1, firebaseIdIOS:1, firebaseId:1}, function(err, u) {
                        if (u) {
                            User.update({ _id: u.id }, { $push: { subscriptionReferalHistory: { createdAt: new Date(), userId: userId } } }, function(err, d) {
                                SubscriptionSale.findOne({userId: u.id} , function(err , subscriber){
                                    let subscriptionBuyDate = new Date();
                                    let subscriptionValidity = 12
                                    var subscriptionDate = subscriptionBuyDate.getDate()
                                    var endDate = subscriptionDate > 28 ? 28 : subscriptionDate

                                    message2 = "Thank you for purchasing Be U Salon Gold Subscription. Your monthly cycle starts every "+HelperService.getNumberInString(subscriptionDate)+" of month and ends every "+HelperService.getNumberInString(endDate)+" of the following month, for next 12 months."

                                    if(subscriber){
                                    var sendData = {
                                        clientName: user.firstName, 
                                        userId: subscriber.userId , 
                                        subscriptionId : subscriber.subscriptionId, 
                                        razorPayId: subscriber.razorPayId, 
                                        phoneNumber : u.phoneNumber, 
                                        referUserId : f.subscriptionId,
                                        firebaseId : u.firebaseId, 
                                        firebaseIdIOS: u.firebaseIdIOS
                                    }

                                    if((subscriptionReferralCode != "BEUREF" || subscriptionReferralCode != "EARLYBIRD") && subscriber.response.notes){
                                        Appointment.refundSubscription(sendData, function(d) {
                                        }); 
                                    }
                                    else if(!subscriber.response.notes){
                                        var messageAmount = (sendData.referUserId == 2) ? 100 :200;
                                        var oName = sendData.clientName.substring(0,sendData.clientName.indexOf(' '));
                                        var name  = oName.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}); 

                                        var data1 = { type: "nikita", title: "Referral amount initiated", body: ""+name+" just used your referral code, hence we have initiated your referral amount of Rs "+messageAmount+", which will reflect in your account within 5-7 business days." }
                                        var message=""+name+" just used your referral code, hence we have initiated your referral amount of Rs "+messageAmount+", which will reflect in your account within 5-7 business days.";

                                        url=getSmsUrl('BEUSLN', message, [sendData.phoneNumber], 'T');
                                        Appointment.sendSMS(url, function(e) {
                                            if (sendData.firebaseId) {
                                                Appointment.sendAppNotificationAdmin([sendData.firebaseId], data1, function(err3, resp) {
                                                })
                                            } else if (sendData.firebaseIdIOS) {
                                                Appointment.sendAppNotificationIOSAdmin([sendData.firebaseIdIOS], data1, function(err3, resp) {
                                                })
                                            } else {
                                                console.log("No Firebase Id")
                                            }
                                            // return callback(CreateObjService.response(false, 'done'));
                                        });
                                    }
                                }


                                   
                                    console.log("here", d);
                                    console.log("here", err);
                                    console.log("----------------------------------------------------------------------");
                                    let updateObjSubscription = {subscriptionId: subscriptionId, subscriptionLoyality: subscriptionLoyality}
                                    if(user.subscriptionId && user.subscriptionValidity != 1){
                                        updateObjSubscription.subscriptionRenewDate = new Date()
                                        message2 = "Thank you for purchasing Be U Salon Gold Subscription. Your subscription has been renewed."
                                    }else{
                                        updateObjSubscription.subscriptionValidity = subscriptionValidity
                                        updateObjSubscription.subscriptionBuyDate = subscriptionBuyDate
                                    }
                                    User.update({ _id: userId }, updateObjSubscription, function(e, f) {
                                console.log(e);
                                        if (f) {
                                            if (user.firebaseId) {
                                                Appointment.sendAppNotificationAdmin([user.firebaseId], data1, function(err3, resp) {
                                                })
                                            } else if (user.firebaseIdIOS) {
                                                Appointment.sendAppNotificationIOSAdmin([user.firebaseIdIOS], data1, function(err3, resp) {
                                                })
                                            } else {
                                                console.log("No Firebase Id")
                                            }
                                            Appointment.msg91Sms(user.phoneNumber, message2, function(e) {
                                                return callback(CreateObjService.response(false, 'Done'));
                                            })
                                        } else {
                                            return callback(CreateObjService.response(true, 'Not Done'));
                                        }

                                    });
                                });
                            })
                        } else {

                             let subscriptionBuyDate = new Date();
                            let subscriptionValidity = 12
                            
                            var subscriptionDate = subscriptionBuyDate.getDate()
                            var endDate = subscriptionDate > 28 ? 28 : subscriptionDate

                            message2 = "Thank you for purchasing Be U Salon Gold Subscription. Your monthly cycle starts every "+HelperService.getNumberInString(subscriptionDate)+" of month and ends every "+HelperService.getNumberInString(endDate)+" of the following month, for next 12 months."
                            console.log("yeh to else mai aagyaa")
                            let updateObjSubscription = {subscriptionId: subscriptionId, subscriptionLoyality: subscriptionLoyality}
                            if(user.subscriptionId && user.subscriptionValidity != 1){
                                updateObjSubscription.subscriptionRenewDate = new Date()
                                message2 = "Thank you for purchasing Be U Salon Gold Subscription. Your subscription has been renewed."
                            }else{
                                updateObjSubscription.subscriptionValidity = subscriptionValidity
                                updateObjSubscription.subscriptionBuyDate = subscriptionBuyDate
                            }
                            User.update({ _id: userId }, updateObjSubscription, function(e, f) {
                                console.log(e);
                                if (f) {
                                    if (user.firebaseId) {
                                        Appointment.sendAppNotificationAdmin([user.firebaseId], data1, function(err3, resp) {
                                        })
                                    } else if (user.firebaseIdIOS) {
                                        Appointment.sendAppNotificationIOSAdmin([user.firebaseIdIOS], data1, function(err3, resp) {
                                        })
                                    } else {
                                        console.log("No Firebase Id")
                                    }
                                    Appointment.msg91Sms(user.phoneNumber, message2, function(e) {
                                        return callback(CreateObjService.response(false, 'Done'));
                                    })
                                } else {
                                    return callback(CreateObjService.response(true, 'Not Done'));
                                }
                            });
                        }
                    });
                });
            });
        } else {
            console.log("err in subsctiption");
            return callback(CreateObjService.response(true, 'Already Captured'));
        }
    });
    });
};


// appointmentSchema.statics.addSubscriptionToUser = function(parlorId, userId, userCreatedAt, razor, amount, subscriptionReferralCode, name, phoneNumber, source, callback) {
appointmentSchema.statics.addSubscriptionToUser = function(parlorId, userId, userCreatedAt, razor, amount, subscriptionReferralCode, source, callback) {
    var actualPricePaid = amount;
    AppointmentHelperService.getSubscriptionAmount(amount, subscriptionReferralCode, function(amt){
    amount = amt;
    var subscriptionId = (amount >= 1699) ? 1 : 2;
    var subscriptionLoyality = (amount >= 1699) ? 500 : 200;
    var obj = {
        userId: userId,
        subscriptionId: subscriptionId,
        price: amount,
        actualPricePaid : actualPricePaid,
        response: razor,
        createdAt: new Date(),
        razorPayId: razor.id,
        source: source,
        couponCode : subscriptionReferralCode,
        parlorId : subscriptionReferralCode == "SALON" ? parlorId : null
    };
    var subscriptionOffer = HelperService.getSubscriptionOfferValidity(userCreatedAt);
    var extraMonthOffer = 0;
    if (subscriptionOffer.offerApplicable) {
        extraMonthOffer = 1;
    }
    var msgAmount = (amount >= 1699) ? 500 : 200;
    var type = (amount >= 1699) ? "Gold" : "Silver";
    let subscriptionBuyDate = new Date();
    let subscriptionValidity = AppointmentHelperService.getSubscriptionValidity(amount, subscriptionReferralCode)
    var data1 = { type: "loginBased", title: "Refer & earn Rs 200 on each referral", body: "Refer subscription to your friends & earn Rs 200 on each referral every time your friend uses your referral code to subscribe." }
    // var message2 = "Hi "+name+", Your number ("+phoneNumber+") has been registered for Be U Salons' annual subscription (SalonPass). Download the app and start enjoying free services worth Rs 500/month for next 12 months, at outlets near you. https://appurl.io/7eqzdGL5v";
    var message2 = "Thank you for purchasing Be U Salons " + type + " Subscription. Avail services worth Rs " + msgAmount + "/month free for 1 year. Refer and earn Rs 200 on each subscription referral."
    SubscriptionSale.findOne({ razorPayId: razor.id }, function(err, ss) {
        console.log(obj)
        if (!ss) {
            SubscriptionSale.create(obj, function(err, f) {
                console.log(err)
                console.log("-----------------------------------------------------------")
                Parlor.updateEarlyBirdData(parlorId , f.subscriptionId);

                console.log("created subscription")
                if (!subscriptionReferralCode) subscriptionReferralCode = "dassD&*%FVV";
                User.findOne({ _id: userId }, { firebaseId: 1, firebaseIdIOS: 1, phoneNumber: 1 , firstName:1, subscriptionId : 1, subscriptionBuyDate : 1}, function(err2, user) {
                    User.findOne({ referCode: subscriptionReferralCode }, { subscriptionValidity: 1 , phoneNumber:1, firebaseIdIOS:1, firebaseId:1}, function(err, u) {
                        if (u) {
                            User.update({ _id: u.id }, { $push: { subscriptionReferalHistory: { createdAt: new Date(), userId: userId } } }, function(err, d) {
                                SubscriptionSale.findOne({userId: u.id} , function(err , subscriber){
                                    if(subscriber){
                                    var sendData = {
                                        clientName: user.firstName, 
                                        userId: subscriber.userId , 
                                        subscriptionId : subscriber.subscriptionId, 
                                        razorPayId: subscriber.razorPayId, 
                                        phoneNumber : u.phoneNumber, 
                                        referUserId : f.subscriptionId,
                                        firebaseId : u.firebaseId, 
                                        firebaseIdIOS: u.firebaseIdIOS
                                    }

                                    
                                    
                                    var subscriptionDate = subscriptionBuyDate.getDate()
                                    var endDate = subscriptionDate > 28 ? 28 : subscriptionDate

                                    message2 = "Thank you for purchasing Be U Salon Gold Subscription. Your monthly cycle starts every "+HelperService.getNumberInString(subscriptionDate)+" of month and ends every "+HelperService.getNumberInString(endDate)+" of the following month, for next 12 months."

                                    if((subscriptionReferralCode != "BEUREF" || subscriptionReferralCode != "EARLYBIRD") && subscriber.response.notes){
                                        Appointment.refundSubscription(sendData, function(d) {
                                        }); 
                                    }
                                    else if(!subscriber.response.notes){
                                        var messageAmount = (sendData.referUserId == 2) ? 100 :200;
                                        var oName = sendData.clientName.substring(0,sendData.clientName.indexOf(' '));
                                        var name  = oName.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}); 

                                        var data2 = { type: "nikita", title: "Referral amount initiated", body: ""+name+" just used your referral code, hence we have initiated your referral amount of Rs "+messageAmount+", which will reflect in your account within 5-7 business days." }
                                        var message=""+name+" just used your referral code, hence we have initiated your referral amount of Rs "+messageAmount+", which will reflect in your account within 5-7 business days.";

                                        url=getSmsUrl('BEUSLN', message, [sendData.phoneNumber], 'T');
                                        Appointment.sendSMS(url, function(e) {
                                            if (sendData.firebaseId) {
                                                Appointment.sendAppNotificationAdmin([sendData.firebaseId], data2, function(err3, resp) {
                                                })
                                            } else if (sendData.firebaseIdIOS) {
                                                Appointment.sendAppNotificationIOSAdmin([sendData.firebaseIdIOS], data2, function(err3, resp) {
                                                })
                                            } else {
                                                console.log("No Firebase Id")
                                            }
                                            // return callback(CreateObjService.response(false, 'done'));
                                        });
                                    }
                                }


                                    let updateObjSubscription = {subscriptionId: subscriptionId, subscriptionLoyality: subscriptionLoyality}
                                    if(user.subscriptionId){
                                        updateObjSubscription.subscriptionRenewDate = new Date()
                                        updateObjSubscription.subscriptionRenewValidity = subscriptionValidity
                                        message2 = "Thank you for purchasing Be U Salon Gold Subscription. Your subscription has been renewed."
                                    }else{
                                        updateObjSubscription.subscriptionValidity = subscriptionValidity
                                        updateObjSubscription.subscriptionBuyDate = subscriptionBuyDate
                                    }

                                    console.log("here", d);
                                    console.log("here", err);
                                    console.log("----------------------------------------------------------------------");
                                    User.update({ _id: userId }, updateObjSubscription, function(e, f) {
                                console.log(e);
                                        if (f) {
                                            if (user.firebaseId) {
                                                Appointment.sendAppNotificationAdmin([user.firebaseId], data1, function(err3, resp) {
                                                })
                                            } else if (user.firebaseIdIOS) {
                                                Appointment.sendAppNotificationIOSAdmin([user.firebaseIdIOS], data1, function(err3, resp) {
                                                })
                                            } else {
                                                console.log("No Firebase Id")
                                            }
                                            Appointment.msg91Sms(user.phoneNumber, message2, function(e) {
                                                return callback(CreateObjService.response(false, 'Done'));
                                            })
                                        } else {
                                            return callback(CreateObjService.response(true, 'Not Done'));
                                        }

                                    });
                                });
                            })
                        } else {
                             let subscriptionBuyDate = new Date();
                            let subscriptionValidity = AppointmentHelperService.getSubscriptionValidity(amount, subscriptionReferralCode)
                            
                            var subscriptionDate = subscriptionBuyDate.getDate()
                            var endDate = subscriptionDate > 28 ? 28 : subscriptionDate

                            message2 = "Thank you for purchasing Be U Salon Gold Subscription. Your monthly cycle starts every "+HelperService.getNumberInString(subscriptionDate)+" of month and ends every "+HelperService.getNumberInString(endDate)+" of the following month, for next 12 months."
                            let updateObjSubscription = {subscriptionId: subscriptionId, subscriptionLoyality: subscriptionLoyality}

                            console.log("yeh to else mai aagyaa")
                             if(user.subscriptionId){
                                updateObjSubscription.subscriptionRenewDate = new Date()
                                updateObjSubscription.subscriptionRenewValidity = subscriptionValidity
                                message2 = "Thank you for purchasing Be U Salon Gold Subscription. Your subscription has been renewed."
                            }else{
                                updateObjSubscription.subscriptionValidity = subscriptionValidity
                                updateObjSubscription.subscriptionBuyDate = subscriptionBuyDate
                            }

                            User.update({ _id: userId }, updateObjSubscription, function(e, f) {
                                console.log(e);
                                if (f) {
                                    if (user.firebaseId) {
                                        Appointment.sendAppNotificationAdmin([user.firebaseId], data1, function(err3, resp) {
                                        })
                                    } else if (user.firebaseIdIOS) {
                                        Appointment.sendAppNotificationIOSAdmin([user.firebaseIdIOS], data1, function(err3, resp) {
                                        })
                                    } else {
                                        console.log("No Firebase Id")
                                    }
                                    Appointment.msg91Sms(user.phoneNumber, message2, function(e) {
                                        return callback(CreateObjService.response(false, 'Done'));
                                    })
                                } else {
                                    return callback(CreateObjService.response(true, 'Not Done'));
                                }
                            });
                        }
                    });
                });
            });
        } else {
            console.log("err in subsctiption");
            return callback(CreateObjService.response(true, 'Already Captured'));
        }
    });
    });
};

appointmentSchema.statics.addSubscriptionToUserForOneMonth = function(parlorId, userId, userCreatedAt, razor, amount, subscriptionReferralCode, source,ap, sv, name,  callback) {
    var actualPricePaid = ap;
    amount = 1699;
    var subscriptionId = 1;
    var subscriptionLoyality = 500;
    var obj = {
        userId: userId,
        subscriptionId: subscriptionId,
        price: amount,
        actualPricePaid : actualPricePaid,
        response: razor,
        createdAt: new Date(),
        razorPayId: razor.id,
        source: source,
        couponCode : source+subscriptionReferralCode,
        parlorId : subscriptionReferralCode == "SALON" ? parlorId : null
    };
    
    var msgAmount = (amount >= 1699) ? 500 : 200;
    var type = (amount >= 1699) ? "Gold" : "Silver";
    var message2 = "Welcome to free trial of Be U Salons Gold Subscription. Avail free services worth Rs 500 within next 30 days."
    if(name!=""){
        message2 = "Hi "+name+", Be U Salon Subscription has been added to your account as a corporate ID benefit. Now enjoy free services worth Rs 500/month, for next "+(sv == 1 ? " month." : " months.")
    }
    SubscriptionSale.findOne({ razorPayId: razor.id }, function(err, ss) {
        if (!ss) {
            SubscriptionSale.create(obj, function(err, f) {
                if (!subscriptionReferralCode) subscriptionReferralCode = "dassD&*%FVV";
                User.findOne({ _id: userId }, { firebaseId: 1, firebaseIdIOS: 1, phoneNumber: 1 , firstName:1, subscriptionId : 1, subscriptionBuyDate : 1}, function(err2, user) {
                            let subscriptionBuyDate = new Date();
                            User.update({ _id: userId }, {subscriptionBuyDate: subscriptionBuyDate, subscriptionId: subscriptionId, subscriptionLoyality: subscriptionLoyality, subscriptionValidity: sv}, function(e, f) {
                                console.log(e);
                                if (f) {
                                    if (user.firebaseId) {
                                       /* Appointment.sendAppNotificationAdmin([user.firebaseId], data1, function(err3, resp) {
                                        })*/
                                    } else if (user.firebaseIdIOS) {
                                        /*Appointment.sendAppNotificationIOSAdmin([user.firebaseIdIOS], data1, function(err3, resp) {
                                        })*/
                                    } else {
                                        console.log("No Firebase Id")
                                    }
                                    Appointment.msg91Sms(user.phoneNumber, message2, function(e) {
                                        return callback(CreateObjService.response(false, 'Done'));
                                    })
                                } else {
                                    return callback(CreateObjService.response(true, 'Not Done'));
                                }
                            });
                });
            });
        } else {
            console.log("err in subsctiption");
            return callback(CreateObjService.response(true, 'Already Captured'));
        }
    });
};

appointmentSchema.statics.addMembershipToUser = function(userId, phoneNumber, firstName, membershipId, membershipAmount, creditUsed, appointmentId) {
    Membership.findOne({ _id: membershipId }, function(err, membership) {
        var allMemberships = ConstantService.getMembershipDetails();
        var welcomeOffer = ConstantService.welcomeOffer();
        var currentMembership = _.filter(allMemberships, function(m) { return m.membershipId == membershipId })[0];
        var obj = {
            parlorId: localVar.getMembershipParlorId(),
            taxIncluded: membership.membershipWithTax,
            membershipId: membership.id,
            userId: userId,
            menuDiscountString: currentMembership.menuDiscountString,
            dealDiscountString: currentMembership.dealDiscountString,
            // menuDiscount: currentMembership.normalPercentage,
            menuDiscount: 0,
            // dealDiscount: currentMembership.dealPercentage,
            dealDiscount: 0,
            name: membership.name,
            credits: membership.credits,
            creditsLeft: membership.credits,
            members: [{
                userId: userId,
                name: firstName,
                phoneNumber: phoneNumber,
                createdAt: new Date(),
                status: "Added",
            }],
            freeHairCut: currentMembership.noOfFreeHairCut,
            freeThreading: currentMembership.freeThreading,
            noOfMembersAllowed: currentMembership.noOfMembersAllowed,
            freeServices: currentMembership.freeServices,
            validFor: HelperService.addMonthsToDate(membership.validFor),
            expiryDate: HelperService.addMonthsToDate(membership.validFor),
            discountPercentage: membership.discountPercentage,
            price: membership.price,
            paymentMethods: [{ value: 10, name: 'beu', amount: membershipAmount }],

        };
        MembershipSale.create(obj, function(err, r) {
            ActiveMembership.findOne({ "members.userId": userId }, { creditsLeft: 1, noOfMembersAllowed: 1, freeThreading: 1, freeHairCut: 1 }, function(err, mem) {
                if (mem) {
                    var updateObj = { creditsLeft: mem.creditsLeft + membership.credits, expiryDate: HelperService.addMonthsToDate(membership.validFor) };
                    if (mem.noOfMembersAllowed < currentMembership.noOfMembersAllowed) updateObj.noOfMembersAllowed = currentMembership.noOfMembersAllowed;
                    if (mem.noOfMembersAllowed < currentMembership.noOfMembersAllowed) updateObj.freeHairCut = currentMembership.noOfMembersAllowed;
                    updateObj.freeThreading = mem.freeThreading + currentMembership.freeThreading;
                    ActiveMembership.update({ _id: mem.id }, updateObj, function(err, d) {
                        console.log(err);
                        console.log("----------captured");
                        User.update({ _id: userId }, { activeMembershipId: mem.id }, function(er, f) {
                            if (creditUsed > 0) {
                                Appointment.update({ _id: appointmentId }, { membershipSaleId: mem.id }, function(e, f) {
                                    console.log("membership updated");
                                });
                            }
                        })
                    });
                } else {
                    ActiveMembership.create(obj, function(err1, r1) {
                        User.update({ _id: userId }, { activeMembershipId: r1.id }, function(er, f) {
                            if (creditUsed > 0) {
                                Appointment.update({ _id: appointmentId }, { membershipSaleId: r1.id }, function(e, f) {
                                    console.log("membership updated");
                                });
                            }
                        });
                    });
                }
            });
        });
    });
};





appointmentSchema.statics.registerAppAppointmentv4 = function(req, callback) {
    var oldLoyalityPoints = 0,pastSubscription,
        u, t = 0,
        redeemableLoyality = 0, couponError  = "",
        mem, appt, membership, subscription, parlor, allServices, slabs, doc, deals, flashCoupons = [];
    var buyMembershipId = req.body.buyMembershipId || null;
    var buySubscriptionId = req.body.buySubscriptionId || null;
    var useMembershipCredits = req.body.useMembershipCredits;
    var useSubscriptionCredits = req.body.useSubscriptionCredits;
    var errorMessage = "";
    var serviceCodes = [];
    var parlorCoupon = false, parlorCouponLimit = 0, parlorCouponOff = 0;
    var productsFromApp = [], productAmount = 0;
    _.forEach(req.body.services, function(s){
        if(s.type != "combo" && s.type != "newCombo")
            serviceCodes.push(s.serviceCode);
        else{
            _.forEach(s.services, function(se){
                serviceCodes.push(se.serviceCode);
            });
        }
    });
    var appRevenueDiscountPercentage = 0;
    Async.parallel([
            function(callback) {
                console.time("user");
                User.findOne({ _id: req.body.userId }, {
                    "parlors.parlorId": 1,
                    "parlors.noOfAppointments": 1,
                    "parlors.lastAppointmentDate": 1,
                    activeMembership: 1,
                    couponCodeHistory: 1,
                    firstName: 1,
                    lastName: 1,
                    customerId: 1,
                    freeHairCutBar: 1,
                    emailId: 1,
                    allow100PercentDiscount: 1,
                    gender: 1,
                    freeMembershipServiceAvailed: 1,
                    loyalityPoints: 1,
                    phoneNumber: 1,
                    subscriptionRedeemMonth: 1,
                    freeServices: 1,
                    subscriptionLoyality: 1,
                    subscriptionId: 1,
                    appRegistrationDate: 1,
                    createdAt: 1
                }).exec(function(err, user1) {
                    var parlorFound = _.some(user1.parlors, function(p) { return p.parlorId + "" == req.body.parlorId; });
                    var updateObj = { lastCartActivity: new Date() };
                    if (!parlorFound) {
                        var newP = { parlorId: req.body.parlorId, createdBy: req.body.userId, noOfAppointments: 0, createdAt: new Date(), updatedAt: new Date() };
                        user1.parlors.push(newP);
                        updateObj.$push = { 'parlors': newP };
                    }
                    User.update({ _id: user1.id }, updateObj, function(err, updte) {
                        u = user1;
                        console.timeEnd("user");
                        User.getSubscriptionLeftByMonthv4(user1.id, req.body.datetime, user1.subscriptionLoyality, function(ree) {
                            redeemableLoyality = ree;
                            callback(null);
                        });
                    });
                });
            },
            function(callback) {
                console.time("usercredit");
                Appointment.aggregate([{
                        $match: { status: { $in: [1, 4] }, 'client.id': ObjectId(req.body.userId), creditUsed: { $gt: 0 } }
                    },
                    {
                        $project: { creditUsed: 1 }
                    },
                    {
                        $group: {
                            _id: null,
                            creditUsed: { $sum: "$creditUsed" },
                        }
                    }
                ]).exec(function(err, data) {
                    if (data.length > 0) {
                        t = data[0].creditUsed;
                        console.timeEnd("usercredit");
                        callback(null);
                    } else {
                        callback(null);
                    }
                });
            },function(callback){
                let productIds = [];
                _.forEach(req.body.products, function(p){
                    productIds.push(parseInt(p.itemId));
                });
                if(productIds.length > 0){
                    InventoryItem.find({itemId : {$in : productIds}}, function(er, items){
                        _.forEach(req.body.products, function(product){
                            let item = _.filter(items, function(i){return i.itemId == product.itemId})[0];
                            if(item){
                                productAmount += (parseInt(item.sellingPrice * 1.18) * product.quantity);
                                productsFromApp.push({
                                    itemId : product.itemId,
                                    name : item.name,
                                    quantity : product.quantity,
                                    price : parseInt(item.sellingPrice),
                                    tax : parseInt(item.sellingPrice*0.18),
                                })    
                            }
                        });
                        callback();
                    });    
                }else{
                    callback();
                }
                
            },
            function(callback) {
                console.time("activeMemberships");
                ActiveMembership.findOne({ "members.userId": req.body.userId }, { creditsLeft: 1, name: 1, parlorId: 1, membershipId: 1, menuDiscount: 1, dealDiscount: 1, freeHairCut: 1, freeThreading: 1 }, function(e, mem1) {
                    mem = mem1;
                    console.timeEnd("activeMemberships");
                    callback(null);
                });
            },
            function(callback) {
                console.time("appointmentDetailPre");
                Appointment.findOne({ _id: req.body.appointmentId }, { loyalityPoints: 1, subtotal: 1, "services.price": 1, "services.serviceCode": 1, "services.brandId": 1, couponLoyalityCode: 1 }, function(err, appt1) {
                    appt = appt1;
                    console.timeEnd("appointmentDetailPre");
                    callback(null);
                });
            },
            function(callback) {
                console.time("subscriptionbuydetail");
                var  subscriptionReferralCode = req.body.subscriptionReferralCode;
                var  subscriptionReferralCode2 = req.body.subscriptionReferralCode;
                if (!subscriptionReferralCode2) subscriptionReferralCode2 = "dassD&*%FVV";
                User.findOne({referCode : subscriptionReferralCode2.toUpperCase(), _id : {$ne : req.body.userId}, subscriptionId : {$in : [1,2]}}, {referCode : 1}, function(err, subscriptionReferUser){
                    Subscription.findOne({ subscriptionId: buySubscriptionId }, { price: 1, subscriptionId: 1, loyality: 1 }, function(err, s) {
                        if(s){
                            if(subscriptionReferUser){
                                s.price = s.price == 1699 ? 1499 : 799;
                            }else{
                                if(subscriptionReferralCode && subscriptionReferralCode != "EARLYBIRD")errorMessage += "Invalid Subscription Referal Code.";
                                s.price = s.price == 1699 ? 1699 : 899;
                            }
                            subscription = s;
                        }
                        if(subscriptionReferralCode == "toi" || subscriptionReferralCode == "TOI")errorMessage = "";
                        console.timeEnd("subscriptionbuydetail");
                        callback(null);
                    });
                });
            },
            function(callback) {
                console.time("parlordetail");
                console.log(serviceCodes);
                // services: {$elemMatch: {serviceCode: {$in : serviceCodes}}}
                Parlor.findOne({ _id: req.body.parlorId }, {createdAt: 1, parlorType : 1, earlyBirdOfferType: 1, earlyBirdOfferPresent : 1, appRevenuePercentage : 1, revenueDiscountAvailable : 1, isAvailableForHomeService : 1, homeServiceFactor : 1, revenueDiscountSlabDown : 1, extraDiscountCouponAvailable:1 , tax: 1, name: 1, address: 1, address2: 1, phoneNumber: 1, "services.serviceCode": 1, "services.serviceId": 1, "services.prices.estimatedTime": 1, "services.prices.additions": 1, "services.prices.price": 1, "services.prices.tax": 1, "services.prices.brand": 1, "services.serviceId": 1, "services.categoryId": 1, "services.name": 1, "services.priceId": 1 }, function(err, parlor1) {
                    parlor = parlor1;
                    console.timeEnd("parlordetail");
                    callback(null);
                });
            },
            function(callback) {
                console.time("servicedetail");
                Service.find({ serviceCode: { $in: serviceCodes } }, { gstDescription: 1, gstNumber: 1, prices: 1, serviceCode: 1, name: 1, estimatedTime : 1 }, function(err, allServices1) {
                    allServices = allServices1;
                    console.timeEnd("servicedetail");
                    callback(null);
                });
            },
            function(callback){
                FlashCoupon.findOne({ code: req.body.couponCode, starts_at : {$lt : new Date(req.body.datetime)}, expires_at : {$gt : new Date(req.body.datetime)}, parlors : { $elemMatch: { parlorId: req.body.parlorId, currentCount: { $gt: 0 } } } }, {serviceCodes : 1, cityPrice : 1}, function(err, flashCoupons2) {
                    console.log("-------90909090990--------")
                        if(flashCoupons2){
                            var cityId = ConstantService.getCityId(req.query.latitude, req.query.longitude);
                            flashCoupons = FlashCoupon.getServiceCodeAndPrice(flashCoupons2, cityId);    
                        }
                        callback(null);
                });
            },
            function(callback) {
                console.time("slabs");
                Slab.find({}, function(err, slabs1) {
                    slabs = slabs1;
                    console.timeEnd("slabs");
                    callback(null);
                });
            },
            function(callback) {
                console.time("apppointmentcount");
                Appointment.findOne({ parlorId: req.body.parlorId }, { parlorAppointmentId: 1 }).sort({ parlorAppointmentId: -1 }).exec(function(err, doc1) {
                    doc = doc1;
                    console.timeEnd("apppointmentcount");
                    callback(null);
                });
            },
            function(callback) {
                console.time("dealsall");
                Deals.getActiveDeals3(req.body.parlorId, req.body.datetime, serviceCodes, function(deals1) {
                    deals = deals1;
                    console.timeEnd("dealsall");
                    callback(null);
                });
            },
            function(callback) {
                SubscriptionSale.findOne({userId : req.body.userId}).sort({createdAt : -1}).exec(function(err2, pastSubscription2){
                    pastSubscription = pastSubscription2;
                    callback(null);
                })
            }
        ],
        function(err, results) {
            console.timeEnd("completed");
            console.time("dbsave");
            if(flashCoupons.length > 0)errorMessage = "";
          /*  if(flashCoupons.length > 0 && !u.subscriptionId && !(subscription && req.body.paymentMethod ==5) && req.body.buildNo){
                // errorMessage += "Flash Coupon Valid For Subscriber Only!";
                flashCoupons = [];
            }*/
            if (mem) {
                mem.creditsLeft = mem.creditsLeft.toFixed(2);
                u.activeMemberships = [];
                var newObj = {
                    membershipSaleId: mem.id,
                    name: mem.name,
                    credits: mem.creditsLeft - t < 0 ? 0 : mem.creditsLeft - t,
                    parlorId: mem.parlorId,
                    membershipId: mem.membershipId,
                    creditsLeft: mem.creditsLeft - t < 0 ? 0 : mem.creditsLeft - t,
                    menuDiscount: mem.menuDiscount,
                    dealDiscount: mem.dealDiscount,
                    noOfFreeHairCut: mem.freeHairCut,
                    freeThreading: mem.freeThreading,
                };
                u.activeMemberships.push(newObj);
            };
            if (buySubscriptionId && parseInt(req.body.paymentMethod) == 1) useSubscriptionCredits = 0;
            var membershipAmount = 0,
                subscriptionAmount = 0;
            var couponCodeObj = {};
            u.couponCodeHistory.push(HelperService.get24HrsCouponCode());
            if (u.couponCodeHistory && u.couponCodeHistory.length > 0) {
                var couponObjInUser = _.filter(u.couponCodeHistory, function(uc) { return uc._id + "" == req.body.couponCodeId })[0];
                if(!couponObjInUser)couponObjInUser = _.filter(u.couponCodeHistory, function(uc) { return uc.code + "" == req.body.couponCode })[0];
                if (couponObjInUser) {
                    if(couponObjInUser.couponType == 2)couponError = "Select your appointment date after 24 hrs to apply this coupon!"
                    if ((couponObjInUser.couponType == 2 && HelperService.getNoOfHrsDiff(new Date(req.body.datetime), new Date()) >= 24) || (couponObjInUser.couponType != 2 && couponObjInUser.couponType != 7 && couponObjInUser.couponType != 13 && couponObjInUser.couponType != 14)) {
                        couponError = ""
                        couponCodeObj = ConstantService.couponCodeDetails(couponObjInUser.couponType, couponObjInUser.code, null);

                        if(couponObjInUser.couponType == 13)couponCodeObj = ConstantService.couponCodeDetailsForSalon(couponObjInUser);
                        couponCodeObj.code = couponObjInUser.code;
                        couponCodeObj.couponId = couponObjInUser.id;
                        if(couponObjInUser.parlorId){
                            if(couponObjInUser.parlorId + "" != req.body.parlorId){
                                couponCodeObj = {}
                            }
                        }
                    } else if (couponObjInUser.couponType == 7) {
                        _.forEach(appt.services, function(ser) {
                            if (ser.serviceCode == 96 && ser.brandId == "5935646e00868d2da81bb91c") {
                                var percentage = ((ser.price - appt.loyalityPoints * (ser.price/ appt.subtotal) - (1500 / 1.18)) / (appt.subtotal - appt.loyalityPoints)) * 100;
                                couponCodeObj = ConstantService.couponCodeDetails(couponObjInUser.couponType, couponObjInUser.code, percentage);
                                couponCodeObj.code = couponObjInUser.code;
                                couponCodeObj.couponId = couponObjInUser.id;
                            }
                        })
                    } else if ((couponObjInUser.couponType == 13 && couponObjInUser.parlorId + "" == req.body.parlorId) || (couponObjInUser.couponType == 14 && parlor.extraDiscountCouponAvailable)) {
                        parlorCoupon = true;
                        parlorCouponOff = couponObjInUser.offPercentage;
                        parlorCouponLimit = couponObjInUser.limit;
                        parlorCouponId = couponObjInUser.id;
                        couponCodeObj = {};
                    }
                }else if(req.body.couponCode){
                    couponError = "Invalid coupon code!"
                }
            }
            
            var newCouponCode = ConstantService.couponCodeUnavailableOnApp2(req.body.couponCode, parseInt(req.body.homeServiceOnly));
            if (newCouponCode) {
                couponCodeObj = newCouponCode;
            }
            var firstTimeSubscriptionBuyer = false;
            if (subscription) {
                firstTimeSubscriptionBuyer = true;
                subscriptionAmount = subscription.price;
                u.subscriptionId = subscription.subscriptionId;
                u.subscriptionLoyality = (subscription.loyality) * 1/(1 + parlor.tax/100);
                redeemableLoyality = parseInt(u.subscriptionLoyality);
                u.subscriptionRedeemMonth = { amount: subscription.loyality, month: -1 };
            } else {
                u.subscriptionLoyality = u.subscriptionLoyality || 0;
                redeemableLoyality = (redeemableLoyality * 1/(1 + parlor.tax/100))
                // redeemableLoyality = parseInt(u.subscriptionLoyality);
            }
            if(parlor.parlorType == 4 && parlor.createdAt < new Date(2018, 11, 1)){
                if(redeemableLoyality>200)
                    redeemableLoyality = redeemableLoyality/1;
                else
                    redeemableLoyality = 0;
            }
            if(ConstantService.getAppRevenueDiscountCouponCode() == req.body.couponCode2){
                // appRevenueDiscountPercentage = !u.subscriptionId || firstTimeSubscriptionBuyer ?  Parlor.getAppRevenueDiscountPercentange(parlor.appRevenuePercentage, parlor.revenueDiscountAvailable, parlor.revenueDiscountSlabDown) : 0;
                appRevenueDiscountPercentage = Parlor.getAppRevenueDiscountPercentange(parlor.appRevenuePercentage, parlor.revenueDiscountAvailable, parlor.revenueDiscountSlabDown);
                redeemableLoyality = 0;
            }
            if(parlorCoupon){
                redeemableLoyality = 0;
            }
            // if(flashCoupons.length > 0)redeemableLoyality = 0;

            var user = User.parse(u, req.body.parlorId);
            user.id = user.userId;
            var count = doc ? doc.parlorAppointmentId : 0;

            /*Appointment.createAppointmentForAppUser(user, req, oldLoyalityPoints, function(response) {
                return callback(response);
            });*/
            let homeServiceFactor = 1;
            if(parseInt(req.body.homeServiceOnly) && parlor.isAvailableForHomeService){
                homeServiceFactor = parlor.homeServiceFactor;
            }
            var obj = Appointment.getServiceObjv4(parlor.tax, parlor.services, req.body.services, deals, user, req.body.parlorId, req.body.useLoyalityPoints, oldLoyalityPoints, req, slabs, useMembershipCredits, allServices, parlor.twoPLusOneDealAvailable, req.body.datetime, req.body.adjustFreeService, couponCodeObj, useSubscriptionCredits, redeemableLoyality, flashCoupons, appRevenueDiscountPercentage, errorMessage, homeServiceFactor);
            if(parlorCoupon){
                appRevenueDiscountPercentage = (obj.subtotal*(parlorCouponOff/100)) > parlorCouponLimit ? (parlorCouponLimit/obj.subtotal)*100 : parlorCouponOff;
                couponCodeObj.code = req.body.couponCode;
                couponCodeObj.couponId = parlorCouponId;
                obj = Appointment.getServiceObjv4(parlor.tax, parlor.services, req.body.services, deals, user, req.body.parlorId, req.body.useLoyalityPoints, oldLoyalityPoints, req, slabs, useMembershipCredits, allServices, parlor.twoPLusOneDealAvailable, req.body.datetime, req.body.adjustFreeService, couponCodeObj, useSubscriptionCredits, redeemableLoyality, flashCoupons, appRevenueDiscountPercentage, errorMessage, homeServiceFactor);
            }
            if(parlor.earlyBirdOfferPresent && subscription){
                if(parseInt(obj.subtotal * (1 + parlor.tax/100)) >= ConstantService.getEarlyBirdOfferMinimumServiceAmount(parlor.parlorType) && subscription.subscriptionId == 1){
                    subscriptionAmount = ConstantService.getEarlyBirdOfferGlodSubscriptionPrice(parlor.earlyBirdOfferType);
                }
            }
            if(subscriptionAmount>0 && !req.body.subscriptionReferralCode){
                let newAmount = obj.subtotal * (1 + parlor.tax/100)
                let priceRange = ConstantService.getPriceRangeForSubscriptionPrice()
                _.forEach(priceRange, function(p){
                    if(p.subtotal<newAmount){
                        subscriptionAmount = p.price
                        if(p.price != 1699)req.body.subscriptionReferralCode = ConstantService.getSubscriptionPriceLessCoupon()
                        return false;
                    }
                })
            }
            if(req.body.subscriptionReferralCode == "JBFKPS" || req.body.subscriptionReferralCode == "GHNLVL"|| req.body.subscriptionReferralCode == "BCCL"){
                obj.errorMessage = "";
                if(req.body.subscriptionReferralCode == "JBFKPS"){
                    subscriptionAmount = ConstantService.getEarlyBirdOfferGlodSubscriptionPrice(1);
                }else if(req.body.subscriptionReferralCode == "BCCL"){
                    subscriptionAmount = ConstantService.getEarlyBirdOfferGlodSubscriptionPrice(2);
                }else if(req.body.subscriptionReferralCode == "GHNLVL"){
                    subscriptionAmount = ConstantService.getEarlyBirdOfferGlodSubscriptionPrice(2);
                }
            }
            if(req.body.subscriptionReferralCode == "BEURENEW600" || req.body.subscriptionReferralCode == "BEURENEW500"|| req.body.subscriptionReferralCode == "BEURENEW200"){
                let pastImageObj = HelperService.getNewSubscriptionPriceAfterExpire(pastSubscription)
                if(pastImageObj.offReferCode == req.body.subscriptionReferralCode){
                    subscriptionAmount = 1699 - pastImageObj.offValue
                    obj.errorMessage = ""
                }
            }

            var appointmentObj = {
                paymentMethod: req.body.paymentMethod,
                parlorName: parlor.name,
                parlorTax: parlor.tax,
                parlorType : parlor.parlorType,
                comment: req.body.comment,
                parlorAddress: parlor.address,
                parlorAddress2: parlor.address2,
                latitude: req.body.latitude || 0,
                longitude: req.body.longitude || 0,
                contactNumber: parlor.phoneNumber,
                appointmentType: 3,
                parlorId: req.body.parlorId,
                homeServiceOnly : parseInt(req.body.homeServiceOnly) ? true : false,
                address1 : req.body.address1,
                address2 : req.body.address2,
                addressLatitude : req.body.addressLatitude || 0,
                addressLongitude : req.body.addressLongitude || 0,
                marketingSource : req.body.marketingSource,
                errorMessage : obj.errorMessage,
                appRevenueDiscountPercentage : appRevenueDiscountPercentage,
                subscriptionReferralCode: req.body.subscriptionReferralCode,
                client: user,
                loyalitySubscription: obj.redeemableLoyality,
                membershipSaleId: obj.membershipSaleId,
                receptionist: null,
                couponCode: null,
                flashCouponCode: flashCoupons.length>0 ? req.body.couponCode :  null,
                appointmentStartTime: req.body.datetime || new Date(),
                appointmentOriginalStartTime: req.body.datetime || new Date(),
                status: req.body.isBillingApp ? 1 : 0,
                estimatedTime: obj.estimatedTime,
                freebiesThreading: obj.freebiesThreading,
                loyalityOffer: obj.loyalityOffer,
                services: obj.services,
                tax: obj.tax,
                parlorOffer : parlorCoupon,
                products: [],
                employees: [],
                buyMembershipId: null,
                buySubscriptionId: buySubscriptionId,
                membershipAmount: membershipAmount,
                productsFromApp : productsFromApp,
                productAmount: productAmount,
                subscriptionAmount: subscriptionAmount,
                membersipCreditsLeft: obj.membershipCreditsLeft,
                creditUsed: obj.creditUsed,
                membershipId: obj.membershipId,
                membershipType: obj.membershipType,
                membershipDiscount: obj.membershipDiscount,
                otherCharges: 0,
                couponError : couponError,
                loyalityPoints: obj.loyalityPoints,
                couponLoyalityPoints: obj.couponLoyalityPoints,
                couponLoyalityCode: couponCodeObj.code,
                couponCodeId: couponCodeObj.couponId,
                subtotal: obj.subtotal,
                discount: 0,
                cashback: 0,
                mode: req.body.mode || 3,
                otp: Math.floor(Math.random() * 9000) + 1000,
                productPrice: 0,
                payableAmount: Math.ceil(obj.payableAmount),
                parlorAppointmentId: ++count
            };
            console.timeEnd("dbsave");
            console.time("----------------------------time");
            if (obj.cancelRequest) {
                return callback(CreateObjService.response(true, 'Invalid quantity'));
            } else if (!req.body.appointmentId) {
                Appointment.create(appointmentObj, function(err, appointment) {
                    console.timeEnd("----------------------------time");
                    console.log(err)
                    if (err) return callback(CreateObjService.response(true, 'Data error'));
                    else return callback(CreateObjService.response(false, { appointmentId: appointment.id }));
                });
            } else {
                Appointment.update({ _id: req.body.appointmentId }, appointmentObj, function(err, appointment) {
                    if (err) return callback(CreateObjService.response(true, 'Data error'));
                    else return callback(CreateObjService.response(false, Appointment.parseSingleAppointmentForApp(appointmentObj, false, parlor.tax)));
                });
            }
        });
};


appointmentSchema.statics.getServiceObjv4 = function(tax, originalServices, appointmentServices, deals, user, parlorId, useLoyalityPoints, oldLoyalityPoints, req, slabs, useMembershipCredits, allServices, twoPLusOneDealAvailable, datetime, adjustFreeService, couponCodeObj, useSubscriptionCredits, redeemableLoyality, flashCoupons, appRevenueDiscountPercentage, errorMessage, homeServiceFactor) {
    console.log("appointmentServices");
    console.log("-----------------------------------------------------------------");
    // appointmentServices = JSON.parse(appointmentServices);
    var estimatedTime = 0,
        services = [],
        subtotal = 0,
        flashSaleSubtotal = 0,
        loyalityPointsUsed = 0,
        cancelRequest = false,
        freebiesThreading = 0,
        couponLoyalityPoints = 0;
    var threadingServices = _.filter(originalServices, function(s) { return s.serviceCode == 271 || s.serviceCode == 274 });
    // if (req.body.useFreeThreading) Appointment.addThreadingService(threadingServices, appointmentServices);
    var freeServiceDealPrices = [],
        newPackageServices = [];
    var isNewPackage2 = false;
    _.forEach(appointmentServices, function(service) {
        service.quantity = parseInt(service.quantity);
        service.serviceCode = parseInt(service.serviceCode);
        // if(service.serviceCode == 502 && (service.brandId=="" || !service.brandId))service.brandId = "594b99fcb2c790205b8b7d93";
        if (service.quantity != 1) twoPLusOneDealAvailable = false;
        if (service.type == "serviceAvailable") service.type = "newPackage";
        if (service.type != "combo" && service.type != "newCombo" && service.type != "newPackage" && service.type != "newPackage2") {
            console.log("here for 1 service ---------!")
            _.forEach(originalServices, function(pService) {
                var oService = pService.prices[0];
                oService.estimatedTime = oService.estimatedTime || 30;
                // _.forEach(pService.prices, function (oService) {
                // if (service.code == oService.priceId || pService.serviceCode == service.serviceCode){
                if (pService.serviceCode == service.serviceCode) {
                    var offerThreading = _.filter(threadingServices, function(th) { return pService.serviceCode == th.serviceCode });
                    service.additions = service.typeIndex != 100 && service.typeIndex ? oService.additions[0].types[service.typeIndex].additions : 0;
                    var tempAdditions = 0;
                    var oSer = _.filter(allServices, function(aser) { return aser.id + "" == pService.serviceId + "" })[0];
                    var objAfterDeal = applyOthersDeal(oService, service, pService, deals, user, parlorId, [], req.body.useFreeThreading, offerThreading, oSer, tax);
                    loyalityPointsUsed += objAfterDeal.loyalityPoints;
                    freebiesThreading += objAfterDeal.freebiesThreading;
                    subtotal += objAfterDeal.serviceSubtotal;
                    estimatedTime += (oService.estimatedTime) * service.quantity;
                    if (service.quantity <= 0) cancelRequest = true;

                    if (objAfterDeal.loyalityPoints == 0) freeServiceDealPrices.push(objAfterDeal.serviceSubtotal);
                    services.push({
                        id: service.code,
                        serviceId: pService.serviceId,
                        serviceCode: pService.serviceCode,
                        categoryId: pService.categoryId,
                        estimatedTime: oSer.estimatedTime * service.quantity,
                        name: objAfterDeal.name,
                        serviceName: pService.name,
                        quantity: service.quantity,
                        tax: tax,
                        type: service.type,
                        additions: service.additions,
                        gstNumber: oSer.gstNumber,
                        gstDescription: oSer.gstDescription,
                        typeIndex: service.typeIndex,
                        employees: [],
                        loyalityPoints: objAfterDeal.loyalityPoints,
                        brandProductDetail: objAfterDeal.brandProductDetail,
                        frequencyDiscountUsed: objAfterDeal.frequencyDiscountUsed,
                        price: objAfterDeal.priceUsed,
                        discount: objAfterDeal.discount,
                        discountMedium: objAfterDeal.discountMedium,
                        frequencyDealFreeService: objAfterDeal.frequencyDealFreeService,
                        frequencyPrice: objAfterDeal.frequencyPrice,
                        priceUsed: objAfterDeal.priceUsed,
                        dealPrice: oService.dealPrice,
                        dealId: objAfterDeal.dealId,
                        dealPriceUsed: objAfterDeal.dealPriceUsed,
                        actualPrice: objAfterDeal.menuPrice,
                        actualDealPrice: objAfterDeal.menuPrice,
                        subtotal: objAfterDeal.serviceSubtotal,
                    });
                }
                // });
            });
        } else if (service.type == "newPackage" || service.type == "newPackage2") {
            if (service.type == "newPackage2") isNewPackage2 = true;
            newPackageServices.push(service);
        } else {
            var dealComb = _.filter(deals, function(d) { return d.id + "" == service.serviceId; });
            if (dealComb.length > 0) {

                var comboServices = Appointment.getComboServices(dealComb[0], originalServices, service.quantity, service, deals, slabs, allServices, false, tax, isNewPackage2, [], 0);
                estimatedTime += (comboServices.estimatedTime || 30);
                subtotal += comboServices.serviceSubtotal;
                freeServiceDealPrices.push(comboServices.serviceSubtotal);
                _.forEach(comboServices.services, function(cs) {
                    var oSer = _.filter(allServices, function(aser) { return aser.id + "" == cs.serviceId + "" })[0];
                    services.push({
                        id: cs.code,
                        serviceId: cs.serviceId,
                        categoryId: cs.categoryId,
                        estimatedTime: cs.estimatedTime * service.quantity,
                        name: comboServices.name,
                        serviceName: cs.serviceName,
                        type: service.type,
                        gstNumber: oSer.gstNumber,
                        gstDescription: oSer.gstDescription,
                        loyalityPoints: 0,
                        brandId: cs.brandId,
                        productId: cs.productId,
                        serviceCode: cs.serviceCode,
                        quantity: service.quantity,
                        tax: tax,
                        brandProductDetail: cs.brandProductDetail,
                        additions: 0,
                        price: Appointment.calculateComboPrice(cs.price, comboServices.realPrice, comboServices.priceUsed),
                        subtotal: Appointment.calculateComboPrice(cs.price, comboServices.realPrice, comboServices.serviceSubtotal),
                        employees: cs.employees,
                        dealPriceUsed: comboServices.dealPriceUsed,
                        actualDealPrice: Appointment.calculateComboPrice(cs.price, comboServices.realPrice, comboServices.priceUsed),
                        actualPrice: cs.price,
                        dealId: cs.dealId,
                        originalDealId : comboServices.dealId
                    });
                });
            }
        }


    });

    //calculating new Package Price
    if (newPackageServices.length > 0) {
        var newPackageSer = Appointment.getComboServices({}, originalServices, 1, newPackageServices, deals, slabs, allServices, true, tax, isNewPackage2, flashCoupons, appRevenueDiscountPercentage);
        subtotal += (newPackageSer.serviceSubtotal*homeServiceFactor);
        freeServiceDealPrices.push(newPackageSer.serviceSubtotal);
        _.forEach(newPackageSer.services, function(cs) {
            var oSer = _.filter(allServices, function(aser) { return aser.id + "" == cs.serviceId + "" })[0];
            cs.estimatedTime = cs.estimatedTime || 30;
            estimatedTime += (cs.estimatedTime || 30);
            if(cs.isFlashSale){
                flashSaleSubtotal += cs.serviceSubtotal;
            }
            services.push({
                id: cs.code,
                serviceId: cs.serviceId,
                categoryId: cs.categoryId,
                estimatedTime: cs.estimatedTime * cs.quantity,
                name: oSer.name,
                serviceName: cs.serviceName,
                type: "newPackage",
                gstNumber: oSer.gstNumber,
                gstDescription: oSer.gstDescription,
                loyalityPoints: 0,
                brandId: cs.brandId == "" ? null : cs.brandId,
                productId: cs.productId == "" ? null : cs.productId,
                serviceCode: cs.serviceCode,
                quantity: cs.quantity,
                expiryDate: cs.expiryDate,
                tax: tax,
                isFlashSale : cs.isFlashSale,
                brandProductDetail: cs.brandProductDetail,
                additions: 0,
                price: Appointment.calculateComboPrice(cs.price, newPackageSer.realPrice, newPackageSer.priceUsed)*homeServiceFactor,
                subtotal: Appointment.calculateComboPrice(cs.serviceSubtotal, newPackageSer.realPrice, newPackageSer.serviceSubtotal)*homeServiceFactor,
                employees: cs.employees,
                dealPriceUsed: newPackageSer.dealPriceUsed,
                actualDealPrice: (cs.menuPrice - (cs.price - Appointment.calculateComboPrice(cs.price, newPackageSer.realPrice, newPackageSer.priceUsed)))*homeServiceFactor,
                actualPrice: cs.menuPrice*homeServiceFactor,
                dealId: cs.dealId
            });
        });
    }

    var totalSum = 0;
    _.forEach(services, function(s) {
        if (s.subtotal != s.loyalityPoints) {
            totalSum += s.subtotal;
        }
    });

    var freeServicePrice = _.filter(services, function(se) { return se.subtotal == se.loyalityPoints })[0];
    if (adjustFreeService && freeServicePrice) {
        services = _.filter(services, function(se) { return se.subtotal != se.loyalityPoints });
        subtotal -= freeServicePrice.loyalityPoints;
    }
    // if(flashCoupons.length>0)useSubscriptionCredits = false;
    var subtotalWithoutFlashSale = subtotal - flashSaleSubtotal;
    _.forEach(services, function(s) {
        if(s.serviceCode == ConstantService.getFreeThreadingServiceCode()){
            loyalityPointsUsed += (s.price * s.quantity);
            totalSum -= (s.price * s.quantity);
            s.subtotal = 0;
            s.loyalityPoints =  (s.price * s.quantity);
        }
    });
    if (user.subscriptionId && useSubscriptionCredits) {
        //subscriptionLoyality
        console.log(subtotalWithoutFlashSale)
        redeemableLoyality = subtotalWithoutFlashSale - loyalityPointsUsed > redeemableLoyality ? redeemableLoyality : subtotalWithoutFlashSale - loyalityPointsUsed;
        loyalityPointsUsed += redeemableLoyality;
    } else {
        redeemableLoyality = 0;
    }
    

    if (user.loyalityPoints) {
        var appointmentObj = {
            subtotal: subtotalWithoutFlashSale,
            loyalityOffer: loyalityPointsUsed,
            tax: tax,
        };
        user.loyalityPoints = Appointment.maximumLoyalityRedeemtion(user, appointmentObj, oldLoyalityPoints, req.body.paymentMethod);
    }
    if (!useLoyalityPoints) {
        user.loyalityPoints = 0;
    }
    if (couponCodeObj.offPercentage) {
        if(!couponCodeObj.minimumLimit){
            couponCodeObj.minimumLimit = 0;
        }
        if(couponCodeObj.minimumLimit <= parseInt(subtotal * (1 + tax/100))){
            couponLoyalityPoints = parseInt((subtotal - loyalityPointsUsed - user.loyalityPoints) * couponCodeObj.offPercentage / 100);
            if (couponLoyalityPoints > couponCodeObj.limit) couponLoyalityPoints = couponCodeObj.limit;
            user.loyalityPoints += couponLoyalityPoints;
        }
    }
    if (user.loyalityPoints > 0) useLoyalityPoints = 1;

    _.forEach(services, function(s) {
        if (s.subtotal != 0 && s.subtotal != s.loyalityPoints) {
            s.loyalityPoints = (s.subtotal / totalSum) * (user.loyalityPoints + redeemableLoyality);
        }
    });
    estimatedTime = estimatedTime || 60;

    var membershipDiscount = User.getMembershipDiscount(user.membership.length > 0 ? user.membership[0].creditsLeft : 0, user.membership, services, [], parseInt(useMembershipCredits), user.loyalityPoints, useLoyalityPoints, tax);
    return { services: services, estimatedTime: estimatedTime, subtotal: subtotal, tax: membershipDiscount.tax, payableAmount: membershipDiscount.payableAmount, loyalityPoints: membershipDiscount.loyalityPoints + loyalityPointsUsed, cancelRequest: cancelRequest, loyalityOffer: loyalityPointsUsed, freebiesThreading: freebiesThreading, membershipCreditsLeft: membershipDiscount.creditsLeft, creditUsed: membershipDiscount.creditsUsed, membershipId: membershipDiscount.membershipId, membershipType: membershipDiscount.membershipType, membershipDiscount: membershipDiscount.discount, membershipSaleId: membershipDiscount.membershipSaleId, couponLoyalityPoints: couponLoyalityPoints, redeemableLoyality: redeemableLoyality, errorMessage : errorMessage };

};




appointmentSchema.statics.registerAppAppointment = function(req, callback) {
    var oldLoyalityPoints = 0,
        u, t = 0,
        redeemableLoyality = 0,
        mem, appt, membership, subscription, parlor, allServices, slabs, doc, deals, flashCoupons = [];
    var buyMembershipId = req.body.buyMembershipId || null;
    var buySubscriptionId = req.body.buySubscriptionId || null;
    var useMembershipCredits = req.body.useMembershipCredits;
    var useSubscriptionCredits = req.body.useSubscriptionCredits;
    var serviceCodes = _.map(req.body.services, function(s) { return s.serviceCode; });
    var appRevenueDiscountPercentage = 0;

    console.time("completed");
    Async.parallel([
            function(callback) {
                console.time("user");
                User.findOne({ _id: req.body.userId }, {
                    "parlors.parlorId": 1,
                    "parlors.noOfAppointments": 1,
                    "parlors.lastAppointmentDate": 1,
                    activeMembership: 1,
                    couponCodeHistory: 1,
                    firstName: 1,
                    lastName: 1,
                    customerId: 1,
                    freeHairCutBar: 1,
                    emailId: 1,
                    allow100PercentDiscount: 1,
                    gender: 1,
                    freeMembershipServiceAvailed: 1,
                    loyalityPoints: 1,
                    phoneNumber: 1,
                    subscriptionRedeemMonth: 1,
                    freeServices: 1,
                    subscriptionLoyality: 1,
                    subscriptionId: 1,
                    appRegistrationDate: 1,
                    createdAt: 1
                }).exec(function(err, user1) {
                    var parlorFound = _.some(user1.parlors, function(p) { return p.parlorId + "" == req.body.parlorId; });
                    var updateObj = { lastCartActivity: new Date() };
                    if (!parlorFound) {
                        var newP = { parlorId: req.body.parlorId, createdBy: req.body.userId, noOfAppointments: 0, createdAt: new Date(), updatedAt: new Date() };
                        user1.parlors.push(newP);
                        updateObj.$push = { 'parlors': newP };
                    }
                    User.update({ _id: user1.id }, updateObj, function(err, updte) {
                        u = user1;
                        console.timeEnd("user");
                        User.getSubscriptionLeftByMonth(user1.id, req.body.datetime, user1.subscriptionLoyality, function(ree) {
                            redeemableLoyality = ree;
                            callback(null);
                        });
                    });
                });
            },
            function(callback) {
                console.time("usercredit");
                Appointment.aggregate([{
                        $match: { status: { $in: [1, 4] }, 'client.id': ObjectId(req.body.userId), creditUsed: { $gt: 0 } }
                    },
                    {
                        $project: { creditUsed: 1 }
                    },
                    {
                        $group: {
                            _id: null,
                            creditUsed: { $sum: "$creditUsed" },
                        }
                    }
                ]).exec(function(err, data) {
                    if (data.length > 0) {
                        t = data[0].creditUsed;
                        console.timeEnd("usercredit");
                        callback(null);
                    } else {
                        callback(null);
                    }
                });
            },
            function(callback) {
                console.time("activeMemberships");
                ActiveMembership.findOne({ "members.userId": req.body.userId }, { creditsLeft: 1, name: 1, parlorId: 1, membershipId: 1, menuDiscount: 1, dealDiscount: 1, freeHairCut: 1, freeThreading: 1 }, function(e, mem1) {
                    mem = mem1;
                    console.timeEnd("activeMemberships");
                    callback(null);
                });
            },
            function(callback) {
                console.time("appointmentDetailPre");
                Appointment.findOne({ _id: req.body.appointmentId }, { loyalityPoints: 1, subtotal: 1, "services.price": 1, "services.serviceCode": 1, "services.brandId": 1, couponLoyalityCode: 1 }, function(err, appt1) {
                    appt = appt1;
                    console.timeEnd("appointmentDetailPre");
                    callback(null);
                });
            },
            function(callback) {
                console.time("membershipDetailBuy");
                Membership.findOne({ _id: buyMembershipId }, { price: 1, tax: 1, name: 1, credits: 1, menuDiscount: 1, dealDiscount: 1, freeThreading: 1, freeHairCut: 1 }, function(err, membership1) {
                    // membership = membership1;
                    console.timeEnd("membershipDetailBuy");
                    callback(null);
                });
            },
            function(callback) {
                console.time("subscriptionbuydetail");
                var  subscriptionReferralCode = req.body.subscriptionReferralCode;
                if (!subscriptionReferralCode) subscriptionReferralCode = "dassD&*%FVV";
                User.findOne({referCode : subscriptionReferralCode}, {referCode : 1}, function(err, subscriptionReferUser){
                    Subscription.findOne({ subscriptionId: buySubscriptionId }, { price: 1, subscriptionId: 1, loyality: 1 }, function(err, s) {
                        if(s){
                            console.log(subscriptionReferUser);
                            console.log("subscriptionReferUser");
                            if(subscriptionReferUser){
                                s.price = s.price == 1699 ? 1499 : 799;
                            }else{
                                s.price = s.price == 1699 ? 1699 : 899;
                            }
                            subscription = s;
                        }
                        console.timeEnd("subscriptionbuydetail");
                        callback(null);
                    });
                });
            },
            function(callback) {
                console.time("parlordetail");
                console.log(serviceCodes);
                // services: {$elemMatch: {serviceCode: {$in : serviceCodes}}}
                Parlor.findOne({ _id: req.body.parlorId }, { appRevenuePercentage : 1, revenueDiscountAvailable : 1, revenueDiscountSlabDown : 1, parlorType : 1, tax: 1, name: 1, address: 1, address2: 1, phoneNumber: 1, "services.serviceCode": 1, "services.serviceId": 1, "services.prices.estimatedTime": 1, "services.prices.additions": 1, "services.prices.price": 1, "services.prices.tax": 1, "services.prices.brand": 1, "services.serviceId": 1, "services.categoryId": 1, "services.name": 1, "services.priceId": 1 }, function(err, parlor1) {
                    parlor = parlor1;
                    console.timeEnd("parlordetail");
                    callback(null);
                });
            },
            function(callback) {
                console.time("servicedetail");
                Service.find({ serviceCode: { $in: serviceCodes } }, { gstDescription: 1, gstNumber: 1, prices: 1, serviceCode: 1, name: 1, estimatedTime : 1 }, function(err, allServices1) {
                    allServices = allServices1;
                    console.timeEnd("servicedetail");
                    callback(null);
                });
            },
            function(callback){
                FlashCoupon.findOne({ code: req.body.couponCode, starts_at : {$lt : new Date(req.body.datetime)}, expires_at : {$gt : new Date(req.body.datetime)}, parlors : { $elemMatch: { parlorId: req.body.parlorId, currentCount: { $gt: 0 } } } }, {serviceCodes : 1, cityPrice : 1}, function(err, flashCoupons2) {
                    console.log("-------90909090990--------")
                    console.log(flashCoupons2);
                        if(flashCoupons2){
                            var cityId = ConstantService.getCityId(req.query.latitude, req.query.longitude);
                            flashCoupons = FlashCoupon.getServiceCodeAndPrice(flashCoupons2, cityId);    
                        }
                        callback(null);
                });
            },
            function(callback) {
                console.time("slabs");
                Slab.find({}, function(err, slabs1) {
                    slabs = slabs1;
                    console.timeEnd("slabs");
                    callback(null);
                });
            },
            function(callback) {
                console.time("apppointmentcount");
                Appointment.findOne({ parlorId: req.body.parlorId }, { parlorAppointmentId: 1 }).sort({ parlorAppointmentId: -1 }).exec(function(err, doc1) {
                    doc = doc1;
                    console.timeEnd("apppointmentcount");
                    callback(null);
                });
            },
            function(callback) {
                console.time("dealsall");
                Deals.getActiveDeals3(req.body.parlorId, req.body.datetime, serviceCodes, function(deals1) {
                    deals = deals1;
                    console.timeEnd("dealsall");
                    callback(null);
                });
            }
        ],
        function(err, results) {
            console.timeEnd("completed");
            console.time("dbsave");
            console.log(serviceCodes);
            if (mem) {
                mem.creditsLeft = mem.creditsLeft.toFixed(2);
                u.activeMemberships = [];
                var newObj = {
                    membershipSaleId: mem.id,
                    name: mem.name,
                    credits: mem.creditsLeft - t < 0 ? 0 : mem.creditsLeft - t,
                    parlorId: mem.parlorId,
                    membershipId: mem.membershipId,
                    creditsLeft: mem.creditsLeft - t < 0 ? 0 : mem.creditsLeft - t,
                    menuDiscount: mem.menuDiscount,
                    dealDiscount: mem.dealDiscount,
                    noOfFreeHairCut: mem.freeHairCut,
                    freeThreading: mem.freeThreading,
                };
                u.activeMemberships.push(newObj);
            };
            if (buySubscriptionId && parseInt(req.body.paymentMethod) == 1) useSubscriptionCredits = 0;
            var membershipAmount = 0,
                subscriptionAmount = 0;
            var couponCodeObj = {};
            u.couponCodeHistory.push(HelperService.get24HrsCouponCode());
            if (u.couponCodeHistory && u.couponCodeHistory.length > 0) {
                var couponObjInUser = _.filter(u.couponCodeHistory, function(uc) { return uc._id + "" == req.body.couponCodeId })[0];
                if(!couponObjInUser)couponObjInUser = _.filter(u.couponCodeHistory, function(uc) { return uc.code + "" == req.body.couponCode })[0];
                if (couponObjInUser) {
                    if ((couponObjInUser.couponType == 2 && HelperService.getNoOfHrsDiff(new Date(req.body.datetime), new Date()) >= 24) || (couponObjInUser.couponType != 2 && couponObjInUser.couponType != 7)) {
                        couponCodeObj = ConstantService.couponCodeDetails(couponObjInUser.couponType, couponObjInUser.code, null);
                        couponCodeObj.code = couponObjInUser.code;
                        couponCodeObj.couponId = couponObjInUser.id;
                    } else if (couponObjInUser.couponType == 7) {
                        _.forEach(appt.services, function(ser) {
                            if (ser.serviceCode == 96 && ser.brandId == "5935646e00868d2da81bb91c") {
                                var percentage = ((ser.price - appt.loyalityPoints * (ser.price / appt.subtotal) - (1500 / 1.18)) / (appt.subtotal - appt.loyalityPoints)) * 100;
                                couponCodeObj = ConstantService.couponCodeDetails(couponObjInUser.couponType, couponObjInUser.code ,percentage);
                                couponCodeObj.code = couponObjInUser.code;
                                couponCodeObj.couponId = couponObjInUser.id;
                            }
                        })
                    }
                }
            }

            var newCouponCode = ConstantService.couponCodeUnavailableOnApp(req.body.couponCode);
            if (newCouponCode) {
                couponCodeObj = newCouponCode;
            }

            
            if (subscription) {
                subscriptionAmount = subscription.price;
                u.subscriptionId = subscription.subscriptionId;
                u.subscriptionLoyality = subscription.loyality;
                redeemableLoyality = parseInt(subscription.loyality);
                u.subscriptionRedeemMonth = { amount: subscription.loyality, month: -1 };
            } else {
                u.subscriptionLoyality = u.subscriptionLoyality || 0;
            }
            if(parlor.parlorType == 4){
                if(redeemableLoyality>200)
                    redeemableLoyality = redeemableLoyality/1;
                else
                    redeemableLoyality = 0;
            }
            if(ConstantService.getAppRevenueDiscountCouponCode() == req.body.couponCode2){
                appRevenueDiscountPercentage = !u.subscriptionId ? Parlor.getAppRevenueDiscountPercentange(parlor.appRevenuePercentage, parlor.revenueDiscountAvailable, parlor.revenueDiscountSlabDown) : 0;
            }
            var user = User.parse(u, req.body.parlorId);
            user.id = user.userId;
            var count = doc ? doc.parlorAppointmentId : 0;

            /*Appointment.createAppointmentForAppUser(user, req, oldLoyalityPoints, function(response) {
                return callback(response);
            });*/
            var obj = Appointment.getServiceObj(parlor.tax, parlor.services, req.body.services, deals, user, req.body.parlorId, req.body.useLoyalityPoints, oldLoyalityPoints, req, slabs, useMembershipCredits, allServices, parlor.twoPLusOneDealAvailable, req.body.datetime, req.body.adjustFreeService, couponCodeObj, useSubscriptionCredits, redeemableLoyality, flashCoupons, appRevenueDiscountPercentage);
            var appointmentObj = {
                paymentMethod: req.body.paymentMethod,
                parlorName: parlor.name,
                parlorType : parlor.parlorType,
                parlorTax : parlor.tax,
                comment: req.body.comment,
                parlorAddress: parlor.address,
                appRevenueDiscountPercentage : appRevenueDiscountPercentage,
                parlorAddress2: parlor.address2,
                latitude: req.body.latitude || 0,
                longitude: req.body.longitude || 0,
                contactNumber: parlor.phoneNumber,
                appointmentType: 3,
                parlorId: req.body.parlorId,
                subscriptionReferralCode: req.body.subscriptionReferralCode,
                client: user,
                loyalitySubscription: obj.redeemableLoyality,
                membershipSaleId: obj.membershipSaleId,
                receptionist: null,
                couponCode: null,
                flashCouponCode: flashCoupons.length>0 ? req.body.couponCode :  null,
                appointmentStartTime: req.body.datetime,
                appointmentOriginalStartTime: req.body.datetime,
                status: req.body.isBillingApp ? 1 : 0,
                estimatedTime: obj.estimatedTime,
                freebiesThreading: obj.freebiesThreading,
                loyalityOffer: obj.loyalityOffer,
                services: obj.services,
                tax: obj.tax,
                products: [],
                employees: [],
                buyMembershipId: null,
                buySubscriptionId: buySubscriptionId,
                membershipAmount: membershipAmount,
                subscriptionAmount: subscriptionAmount,
                membersipCreditsLeft: obj.membershipCreditsLeft,
                creditUsed: obj.creditUsed,
                membershipId: obj.membershipId,
                membershipType: obj.membershipType,
                membershipDiscount: obj.membershipDiscount,
                otherCharges: 0,
                loyalityPoints: obj.loyalityPoints,
                couponLoyalityPoints: obj.couponLoyalityPoints,
                couponLoyalityCode: couponCodeObj.code,
                couponCodeId: couponCodeObj.couponId,
                subtotal: obj.subtotal,
                discount: 0,
                cashback: 0,
                mode: req.body.mode || 3,
                otp: Math.floor(Math.random() * 9000) + 1000,
                productPrice: 0,
                payableAmount: Math.ceil(obj.payableAmount),
                parlorAppointmentId: ++count
            };
            console.timeEnd("dbsave");
            console.time("----------------------------time");
            if (obj.cancelRequest) {
                return callback(CreateObjService.response(true, 'Invalid quantity'));
            } else if (!req.body.appointmentId) {
                Appointment.create(appointmentObj, function(err, appointment) {
                    console.timeEnd("----------------------------time");
                    if (err) return callback(CreateObjService.response(true, 'Data error'));
                    else return callback(CreateObjService.response(false, { appointmentId: appointment.id }));
                });
            } else {
                Appointment.update({ _id: req.body.appointmentId }, appointmentObj, function(err, appointment) {
                    if (err) return callback(CreateObjService.response(true, 'Data error'));
                    else return callback(CreateObjService.response(false, Appointment.parseSingleAppointmentForApp(appointmentObj, false, parlor.tax)));
                });
            }

        });
};

appointmentSchema.statics.registerAppointment = function(req, callback) {
    var registerAppointment = 0;
    User.getOldLoyalityPoints(req.body.userId, function(oldLoyalityPoints) {
        User.findOne({ _id: req.body.userId }, {
            "parlors.parlorId": 1,
            "parlors.noOfAppointments": 1,
            "parlors.lastAppointmentDate": 1,
            activeMembership: 1,
            couponCodeHistory: 1,
            firstName: 1,
            lastName: 1,
            customerId: 1,
            freeHairCutBar: 1,
            emailId: 1,
            allow100PercentDiscount: 1,
            gender: 1,
            freeMembershipServiceAvailed: 1,
            loyalityPoints: 1,
            phoneNumber: 1,
            subscriptionRedeemMonth: 1,
            freeServices: 1,
            subscriptionLoyality: 1,
            subscriptionId: 1,
            appRegistrationDate: 1,
            createdAt: 1
        }).exec(function(err, user) {
            User.update({ _id: req.body.userId }, { lastCartActivity: new Date() }, function(err, obj) {
                var parlorFound = _.some(user.parlors, function(p) { return p.parlorId + "" == req.body.parlorId; });
                if (parlorFound) {
                    Appointment.find({ 'client.id': user.id, status: { $in: [1, 4] }, creditUsed: { $gt: 0 } }, { creditUsed: 1 }, function(err, appts) {
                        var t = 0;
                        _.forEach(appts, function(a) {
                            t += a.creditUsed;
                        });
                        ActiveMembership.findOne({ "members.userId": req.body.userId }, { creditsLeft: 1, name: 1, parlorId: 1, membershipId: 1, menuDiscount: 1, dealDiscount: 1, freeHairCut: 1, freeThreading: 1 }, function(e, mem) {
                            if (mem) {
                                mem.creditsLeft = mem.creditsLeft.toFixed(2);
                                user.activeMemberships = [];
                                var newObj = {
                                    membershipSaleId: mem.id,
                                    name: mem.name,
                                    credits: mem.creditsLeft - t < 0 ? 0 : mem.creditsLeft - t,
                                    parlorId: mem.parlorId,
                                    membershipId: mem.membershipId,
                                    creditsLeft: mem.creditsLeft - t < 0 ? 0 : mem.creditsLeft - t,
                                    menuDiscount: mem.menuDiscount,
                                    dealDiscount: mem.dealDiscount,
                                    noOfFreeHairCut: mem.freeHairCut,
                                    freeThreading: mem.freeThreading,
                                };
                                user.activeMemberships.push(newObj);
                            };
                            Appointment.createAppointmentIdForUser(user, req, oldLoyalityPoints, function(response) {
                                return callback(response);
                            });
                        });
                    });
                } else {
                    var newP = { parlorId: req.body.parlorId, createdBy: req.body.userId, noOfAppointments: 0, createdAt: new Date(), updatedAt: new Date() };
                    User.update({ _id: user.id }, { $push: { 'parlors': newP } }, function(err, updte) {
                        user.parlors.push(newP);
                        Appointment.createAppointmentIdForUser(user, req, oldLoyalityPoints, function(response) {
                            return callback(response);
                        });
                    });
                }
            });
        });
    });
}

appointmentSchema.statics.maximumLoyalityRedeemtion = function(user, appointment, oldLoyalityPoints, paymentMethod) {
    var loyalityPointCanBeUsed = 0;
    var redemption = (ParlorService.getFreebiesRedeemedPercentage(appointment.subtotal - appointment.loyalityOffer, paymentMethod, appointment.tax)) / 100;
    var loyalityLimit = redemption;
    var loyalityPointCanBeUsedOldUser = Math.floor(1 * (appointment.subtotal - appointment.loyalityOffer));
    if (oldLoyalityPoints > 0) {
        /*if (oldLoyalityPoints >= loyalityPointCanBeUsedOldUser) {
            loyalityPointCanBeUsed = loyalityPointCanBeUsedOldUser;
            appointment.subtotal = appointment.loyalityOffer;
        } else {
            loyalityPointCanBeUsed = oldLoyalityPoints;
            appointment.subtotal = appointment.subtotal - parseInt(oldLoyalityPoints);
        }*/
    }
    if(user.allow100PercentDiscount && paymentMethod == 5)loyalityLimit = 1;
    loyalityPointCanBeUsed += Math.ceil(loyalityLimit * (appointment.subtotal - appointment.loyalityOffer));
    // loyalityPointCanBeUsed = loyalityPointCanBeUsed < 6800 ? loyalityPointCanBeUsed : 6800;
    loyalityPointCanBeUsed = loyalityPointCanBeUsed < 500 ? loyalityPointCanBeUsed : 500;
    return user.loyalityPoints > loyalityPointCanBeUsed ? loyalityPointCanBeUsed : user.loyalityPoints;
};


appointmentSchema.statics.captureAppointment = function(req, callback) {
    if (req.body.paymentMethod == 5) {
        console.log("razer");
        var Razorpay = require('razorpay');
        var instance = new Razorpay({
            key_id: RAZORPAY_KEY,
            key_secret: RAZORPAY_APP_SECRET
        });
        var obj = {
            razorpay_payment_id: req.body.razorpay_payment_id,
            bookByApp: req.body.bookByApp,
            amount: req.body.amount,
            bookByNewApp: req.body.bookByNewApp,
        };
        if (req.body.razorpay_payment_id) {
            Appointment.captureRazorPayment(instance, obj, function(response) {
                return callback(response);
            });
        } else {

        }
    } else {
            console.log("in code method")
        Appointment.captureCodPayment(req, function(response) {
            return callback(response);
        });
    }
};

appointmentSchema.statics.appointmentDetailsForApp = function(req, newLoyalityPoints, callback) {
    var mem, count = 0,
        user, t = 0,
        reed = 0,
        appointment, parlor;
    Async.parallel([
            function(callback) {
                ActiveMembership.findOne({ "members.userId": req.body.userId }, { creditsLeft: 1, name: 1 }, function(e, mem1) {
                    mem = mem1;
                    callback(null);
                });
            },
            function(callback) {
                Appointment.count({ 'client.id': req.body.userId, status: { $in: [3] }, appointmentType: 3, cashbackUsed: true }, function(err, count1) {
                    count = count1;
                    callback(null);
                });
            },
            function(callback) {
                User.findOne({ _id: req.body.userId }, { createdAt: 1, subscriptionId: 1, subscriptionRedeemMonth: 1, subscriptionLoyality: 1, loyalityPoints: 1, isCorporateUser: 1,allow100PercentDiscount : 1}, function(err, user1) {
                    user = user1;
                    User.getSubscriptionLeftByMonthv4(req.body.userId, req.body.datetime, user1.subscriptionLoyality, function(reed2) {
                        reed = reed2;
                        console.log(reed);
                        console.log("reed");
                        console.log("-----------------------");
                        callback(null);
                    });
                });
            },
            function(callback) {
                Appointment.find({ 'client.id': req.body.userId, status: { $in: [1, 4] }, creditUsed: { $gt: 0 } }, { creditUsed: 1 }, function(err, appts) {
                    _.forEach(appts, function(a) {
                        t += a.creditUsed;
                    });
                    callback(null);
                });
            },
            function(callback) {
                Appointment.findOne({ _id: req.body.appointmentId, 'client.id': req.body.userId }).exec(function(err, appointment1) {
                    appointment = appointment1;
                    console.log(appointment1);
                    Parlor.findOne({ _id: appointment.parlorId }, {createdAt : 1  ,address2 : 1, homeServiceRange : 1, parlorType : 1, tax: 1, latitude: 1, longitude: 1, openingTime: 1, closingTime: 1, earlyBirdOfferPresent : 1, earlyBirdOfferType : 1 }, function(err, parlor1) {
                        parlor = parlor1;
                        callback(null);
                    });
                });
            }
        ],
        function(err, results) {
            if (appointment) {
                if(parlor.parlorType == 4 && parlor.createdAt < new Date(2018, 11, 1)){
                    if(reed>200)
                        reed = Math.ceil(reed/1);
                    else
                        reed = 0;
                }
                return callback(false, AppointmentHelperService.populateAppointmentDetailForApp(false, req.body.paymentMethod, mem, count, user, t, appointment, parlor, reed, req.body.couponCode));
            } else {
                return callback(true, 'Invalid appointment id');
            }
        });
};


appointmentSchema.statics.appointmentDetailsForAppv4 = function(req, newLoyalityPoints, callback) {
    var mem, count = 0,
        user, t = 0,
        reed = 0,
        appointment, parlor;
    Async.parallel([
            function(callback) {
                ActiveMembership.findOne({ "members.userId": req.body.userId }, { creditsLeft: 1, name: 1 }, function(e, mem1) {
                    mem = mem1;
                    callback(null);
                });
            },
            function(callback) {
                Appointment.count({ 'client.id': req.body.userId, status: { $in: [3] }, appointmentType: 3, cashbackUsed: true }, function(err, count1) {
                    count = count1;
                    callback(null);
                });
            },
            function(callback) {
                User.findOne({ _id: req.body.userId }, { createdAt: 1, subscriptionId: 1, subscriptionRedeemMonth: 1, subscriptionLoyality: 1, loyalityPoints: 1, isCorporateUser: 1,allow100PercentDiscount : 1 }, function(err, user1) {
                    user = user1;
                    User.getSubscriptionLeftByMonthv4(req.body.userId, req.body.datetime, user1.subscriptionLoyality, function(reed2) {
                        reed = reed2;
                        callback(null);
                    });
                });
            },
            function(callback) {
                Appointment.find({ 'client.id': req.body.userId, status: { $in: [1, 4] }, creditUsed: { $gt: 0 } }, { creditUsed: 1 }, function(err, appts) {
                    _.forEach(appts, function(a) {
                        t += a.creditUsed;
                    });
                    callback(null);
                });
            },
            function(callback) {
                Appointment.findOne({ _id: req.body.appointmentId, 'client.id': req.body.userId }).exec(function(err, appointment1) {
                    appointment = appointment1;
                    console.log(appointment1);
                    Parlor.findOne({ _id: appointment.parlorId }, {parlorType : 1, tax: 1, latitude: 1, longitude: 1, openingTime: 1, closingTime: 1, earlyBirdOfferPresent : 1, homeServiceRange : 1, address2 : 1, earlyBirdOfferType : 1 }, function(err, parlor1) {
                        parlor = parlor1;
                        callback(null);
                    });
                });
            }
        ],
        function(err, results) {
            if (appointment) {
                if(parlor.parlorType == 4){
                    if(reed>200)
                        reed = Math.ceil(reed/1);
                    else
                        reed = 0;
                }
                return callback(false, AppointmentHelperService.populateAppointmentDetailForApp(true ,req.body.paymentMethod, mem, count, user, t, appointment, parlor, reed, req.body.couponCode));
            } else {
                return callback(true, 'Invalid appointment id');
            }
        });
};

appointmentSchema.statics.appointmentDetails = function(req, newLoyalityPoints, callback) {
    ActiveMembership.findOne({ "members.userId": req.body.userId }, { creditsLeft: 1, name: 1 }, function(e, mem) {
        Appointment.count({
            'client.id': req.body.userId,
            status: { $in: [3] },
            appointmentType: 3,
            cashbackUsed: true,
        }, function(err, count) {
            console.log(count);
            var redeemableSubscriptionLoyality = 0;
            var currentMonth = HelperService.getCurrentMonthNo();
            User.findOne({ _id: req.body.userId }, function(err, user) {
                if (user.subscriptionId) {
                    if (user.subscriptionRedeemMonth.month <= currentMonth) {
                        if (user.subscriptionRedeemMonth.month == currentMonth) {
                            redeemableSubscriptionLoyality = user.subscriptionLoyality - user.subscriptionRedeemMonth.amount;
                        } else {
                            redeemableSubscriptionLoyality = user.subscriptionLoyality;
                        }
                    }
                }
                Appointment.find({ 'client.id': user.id, status: { $in: [1, 4] }, creditUsed: { $gt: 0 } }, { creditUsed: 1 }, function(err, appts) {
                    var t = 0;
                    _.forEach(appts, function(a) {
                        t += a.creditUsed;
                    });
                    Appointment.findOne({
                        _id: req.body.appointmentId,
                        'client.id': req.body.userId
                    }).exec(function(err, appointment) {
                        Parlor.findOne({ _id: appointment.parlorId }, { tax: 1, latitude: 1, longitude: 1, openingTime: 1, closingTime: 1. }, function(err, parlor) {
                            appointment.parlorId = {};
                            appointment.parlorId.id = parlor.id;
                            appointment.parlorId.latitude = parlor.latitude;
                            appointment.parlorId.longitude = parlor.longitude;
                            appointment.parlorId.openingTime = parlor.openingTime;
                            appointment.parlorId.closingTime = parlor.closingTime;
                            if (appointment) {
                                var obj = Appointment.parseSingleAppointmentForApp(appointment, true, parlor.tax);
                                var ll = appointment.loyalityPoints - appointment.loyalityOffer;
                                if (appointment.buySubscriptionId && req.body.paymentMethod == 5) {
                                    redeemableSubscriptionLoyality = appointment.subscriptionAmount == 1699 ? 500 : 200;
                                }
                                if (mem) {
                                    mem.creditsLeft = mem.creditsLeft.toFixed(2);
                                    var activeMemberships = [];
                                    activeMemberships.push({
                                        name: mem.name,
                                        credits: mem.creditsLeft - t < 0 ? 0 : mem.creditsLeft - t,
                                    });
                                } else {
                                    obj.membershipSuggestion = HelperService.getMembershipSuggestionObj(obj.subtotal);

                                }
                                if (!user.subscriptionId && !appointment.buySubscriptionId) {
                                    obj.subscriptionSuggestion = HelperService.getSubscriptionSuggestionObj(obj.subtotal);
                                }
                                obj.usableMembership = activeMemberships;
                                obj.redeemableSubscriptionLoyality = redeemableSubscriptionLoyality;
                                obj.usableLoyalityPoints = appointment.status == 1 ? user.loyalityPoints + ll : user.loyalityPoints;
                                if (appointment.status == 1 || appointment.status == 4) {
                                    obj.loyalityPoints = newLoyalityPoints;
                                    obj.tax = Math.ceil((appointment.subtotal - obj.loyalityPoints - obj.loyalityOffer) * (parlor.tax / 100));
                                    obj.payableAmount = Math.ceil((appointment.subtotal - obj.loyalityPoints - obj.loyalityOffer) * (1 + parlor.tax / 100) - obj.creditUsed);
                                    console.log("here----", obj.payableAmount);
                                }
                                var percentage = ParlorService.getPercentageCashback(req.body.paymentMethod, count, user.isCorporateUser);
                                obj.discountMessage = "Get " + percentage + "% Cashback On Your" + (percentage == 100 ? " Ist" : " ") + " " + (req.body.paymentMethod == 5 ? "Digital " : "Cash ") + " Payment!";
                                obj.threadingDiscountAvailable = true;
                                var freebie = Math.ceil(ParlorService.getFreebiesRedeemedPercentage(appointment.subtotal - appointment.loyalityOffer - appointment.couponLoyalityPoints, req.body.paymentMethod, appointment.tax) / 100 * (appointment.subtotal - appointment.loyalityOffer))
                                obj.freebiesTerms = ((freebie > 0) ? "Use & Save Rs" + freebie + "" : "");
                                obj.suggestion = ParlorService.getFreebiesRedeemedPercentageSuggestion(appointment.subtotal - appointment.loyalityOffer - appointment.couponLoyalityPoints, req.body.paymentMethod, appointment.tax);
                                var getFreebies = Appointment.getFreebiesPoints(req.body.paymentMethod, appointment, count, true, user.isCorporateUser);
                                if (getFreebies.loyality > 0) {
                                    obj.alertMessage = ('Hey ' + appointment.client.name + ', Rs ' + getFreebies.loyality + ' B-Cash') + ' will be credited to your account post appointment.';
                                } else {
                                    obj.alertMessage = ('Hey ' + appointment.client.name + '') + ' thank you for your appointment.';
                                }
                                obj.membershipTax = parseInt(parseInt(appointment.membershipAmount / (1 + parlor.tax / 100)) * (parlor.tax / 100))
                                return callback(false, obj);
                                // return res.json(CreateObjService.response(false, obj));
                            } else {
                                return callback(true, 'Invalid appointment id');
                                // return res.json(CreateObjService.response(true, 'Invalid appointment id'));
                            }

                        });
                    });
                });
            });
        });

    });
}

appointmentSchema.statics.captureCodPayment = function(req, callback) {
    Appointment.findOne({ _id: req.body.appointmentId }, function(err, appt) {
        Parlor.findOne({ _id: appt.parlorId }, { tax: 1, phoneNumber : 1 }, function(err, parlor) {
            appt.payableAmount = Math.ceil(Math.floor(appt.subtotal - appt.loyalityPoints - appt.creditUsed / (1 + parlor.tax / 100) - appt.membershipDiscount) * (1 + parlor.tax / 100));
            User.findOne({ _id: appt.client.id }, function(err, user2) {
                Appointment.useLoyalityAndFreeServices(appt, user2, function(status) {
                    console.log("status", status)
                    if (status) {
                        console.log({ _id: req.body.appointmentId, status: { $in: [0, 1, 4] } })
                        Appointment.update({ _id: req.body.appointmentId, status: { $in: [0, 1, 4] } }, { buySubscriptionId: null, subscriptionAmount: 0, appBooking: 2, allPaymentMethods: [], paymentMethod: 1, status: 1, isPaid: false, bookingMethod: 2, payableAmount: appt.payableAmount }, function(err, resp) {
                            console.log("sdsadsda--------------------------------------", err)
                            console.log("sdsadsda--------------------------------------", resp)
                            Appointment.findOne({ _id: req.body.appointmentId }, function(err, appointment) {
                                User.findOne({ _id: appointment.client.id }, function(err, user) {
                                    var message = { type: "A", name: appointment.client.name, amount: appointment.payableAmount, appointmentId: appointment.parlorAppointmentId };
                                    // io.sockets.in(appointment.parlorId + "").emit('newOrder', { data: message });
                                    // appt, userName, phoneNumber,salonPhoneNumber, tax, onlinePaid
                                    var usermessage = Appointment.appointmentBookedSms(appointment, user.firstName, user.phoneNumber, parlor.phoneNumber ,parlor.tax , false);
                                    Appointment.sendSMS(usermessage, function(e) {
                                        Appointment.sendAppointmentMail(appointment, user.emailId, function() {
                                            UserCart.remove({ userId: req.body.userId }, function(Err, f) {
                                                Admin.findOne({parlorIds :{$in : [parlor.id]} , parlorType: 4},{firebaseId : 1}, function(err , owner){
                                                    console.log("ownerrrrr" , owner)
                                                    var date = appointment.appointmentStartTime.toDateString();
                                                    var title = "New Appointment" , body = "New Appointment has been booked in your salon of amount "+appointment.payableAmount+" for "+date+"." , type = "appointment";
                                                    if(owner){
                                                        ParlorService.sendIonicNotification(owner.firebaseId, title, body, type, req.body.appointmentId, function(){
                                                            
                                                        })
                                                    }
                                                })

                                            });
                                            // return callback(CreateObjService.response(false, 'Appointment Booked'));
                                        });
                                    });
                                    return callback(CreateObjService.response(false, 'Appointment Booked'));

                                });
                            });
                        });
                    } else
                        return callback(CreateObjService.response(true, 'Freebies Not present'));
                });
            });
        });
        if (appt.buySubscriptionId) {
            var apptm = Appointment.getNewObjForSubscripton(appt);
            Appointment.create(apptm, function(err, d) {
                console.log(err)
            });
        }
    });
};

appointmentSchema.statics.getNewObjForSubscripton = function(a) {

    return {
        paymentMethod: 1,
        parlorName: a.parlorName,
        comment: a.comment,
        parlorAddress: a.parlorAddress,
        parlorAddress2: a.parlorAddress2,
        latitude: a.latitude,
        longitude: a.longitude,
        contactNumber: a.contactNumber,
        appointmentType: a.appointmentType,
        parlorId: a.parlorId,
        client: a.client,
        loyalitySubscription: 0,
        membershipSaleId: null,
        receptionist: a.receptionist,
        couponCode: a.couponCode,
        appointmentStartTime: a.appointmentStartTime,
        appointmentOriginalStartTime: a.appointmentOriginalStartTime,
        status: 1,
        estimatedTime: a.estimatedTime,
        freebiesThreading: a.freebiesThreading,
        subscriptionReferralCode: a.subscriptionReferralCode,
        loyalityOffer: 0,
        services: [],
        tax: 0,
        products: [],
        employees: [],
        buyMembershipId: null,
        buySubscriptionId: a.buySubscriptionId,
        membershipAmount: 0,
        subscriptionAmount: a.subscriptionAmount,
        membersipCreditsLeft: a.membersipCreditsLeft,
        creditUsed: a.creditUsed,
        membershipId: a.membershipId,
        membershipType: a.membershipType,
        membershipDiscount: a.membershipDiscount,
        otherCharges: a.otherCharges,
        loyalityPoints: 0,
        couponLoyalityPoints: a.couponLoyalityPoints,
        couponLoyalityCode: a.couponLoyalityCode,
        couponCodeId: a.couponCodeId,
        subtotal: 0,
        discount: 0,
        cashback: 0,
        mode: a.mode,
        otp: a.otp,
        productPrice: 0,
        payableAmount: 0,
        parlorAppointmentId: a.parlorAppointmentId
    };
}

appointmentSchema.statics.useLoyalityAndFreeServices = function(appointment, user, callback) {
    var updateObj = {},
        updateObj2 = {},
        allCheck = true,
        hundredPercentRedeemableLoyalityPoints = user.hundredPercentRedeemableLoyalityPoints;
    if(appointment.flashCouponCode){
        FlashCoupon.update({code : appointment.flashCouponCode, "parlors.parlorId" : appointment.parlorId}, { $inc: { currentCount: -1, "parlors.$.currentCount": -1 } }, function(err, fc){
        });
    }
    if (appointment.loyalitySubscription > 0) {
        if (!updateObj2.$push) updateObj2.$push = {};
        updateObj2.$push.subscriptionRedeemHistory = {
            createdAt: new Date(),
            appointmentStartTime: appointment.appointmentStartTime,
            appointmentId: appointment.id,
            amount: appointment.loyalitySubscription,
        };

        User.update({ _id: appointment.client.id }, updateObj2, function(err, d) {

        });
    }

    UserCart.remove({ userId: user.id }, function(Err, f) {

    });

    if(appointment.parlorType == 4){
        Admin.find({ $and: [{ $or: [{ parlorIds: appointment.parlorId }, { parlorId: appointment.parlorId }] }, { role: { $in: [2, 7] } }] }, { firebaseId: 1 }, function(err, empl) {
            let firebaseIds = [], firebaseIdIOS = []
            _.forEach(empl, function(e) {
                firebaseIds.push(e.firebaseId);
            })
            _.forEach(empl, function(e) {
                firebaseIdIOS.push(e.firebaseIdIOS);
            })
            var title = 'Appointment has been booked';
            var body = 'Total Payable Amount is: ' + appointment.payableAmount;
            var type = 'appointmentRevenue';
            _.forEach(firebaseIds, function(firebaseId) {
                ParlorService.sendIonicNotification(firebaseId, title, body, type, appointment.id, function() {
                    // callback();
                });
                ParlorService.sendIOSNotificationOnEmployeeApp(firebaseIdIOS, title, body, type, function(){

                })
            })
        });
    }
    
    if ((appointment.loyalityPoints - appointment.loyalityOffer> 0)|| (appointment.parlorOffer)) {
        var loyalityPoints = user.loyalityPoints - (appointment.loyalityPoints - appointment.loyalityOffer - appointment.loyalitySubscription - appointment.couponLoyalityPoints);
        if (loyalityPoints < 0) allCheck = false;
        if (hundredPercentRedeemableLoyalityPoints > 0) {
            hundredPercentRedeemableLoyalityPoints = hundredPercentRedeemableLoyalityPoints - (appointment.loyalityPoints - appointment.loyalityOffer - appointment.couponLoyalityPoints);
            if (hundredPercentRedeemableLoyalityPoints < 0) hundredPercentRedeemableLoyalityPoints = 0;
        }
        updateObj.loyalityPoints = loyalityPoints;
        updateObj.hundredPercentRedeemableLoyalityPoints = hundredPercentRedeemableLoyalityPoints;
        if ((appointment.couponLoyalityPoints != 0 && (appointment.couponCodeId + "" != ConstantService.beforBookingCouponId())) || (appointment.parlorOffer)) {

            if (appointment.couponLoyalityCode == "APP10") {
                User.update({ _id: appointment.client.id, "couponCodeHistory._id": appointment.couponCodeId }, { "couponCodeHistory.$.active": false, "couponCodeHistory.$.appointmentId": appointment._id }, function(e, f) {
                    // if (f) {
                    //     var now_date = new Date();
                    //     now_date.setMonth(now_date.getMonth() + 1);
                    //     User.update({ _id: appointment.client.id }, { $push: { couponCodeHistory: { $each: [{ active: true, createdAt: new Date(), code: "APP10", couponType: 4, expires_at: now_date }] } } }, function(er2, f2) {
                    //         console.log("coupon updated");
                    //     })
                    // }

                });
            } else {
                User.update({ _id: appointment.client.id, "couponCodeHistory._id": appointment.couponCodeId }, { "couponCodeHistory.$.active": false, "couponCodeHistory.$.appointmentId": appointment._id }, function(e, f) {
                    console.log("coupon updated");
                });
            }
        }
        if (!updateObj.$push) updateObj.$push = {};
        updateObj.$push.creditsHistory = { $each: [{ createdAt: new Date(), amount: -1 * (appointment.loyalityPoints - appointment.couponLoyalityPoints - appointment.loyalityOffer), balance: loyalityPoints, source: appointment.id, reason: 'Used for appointment' }] };
    }
    var noOfFreeHairCut = 0,
        freeThreading = 0;
    _.forEach(appointment.services, function(s) {
        if (s.type == 'deal') {
            var reimbursed = false;
            allCheck = false;
            user.freeServices = _.forEach(user.freeServices, function(free) {
                if (free.serviceId + "" == s.serviceId + "") {
                    if ((free.parlorId + "" == appointment.parlorId + "" || free.parlorId == null) && !reimbursed) {
                        free.noOfService -= s.quantity;
                        reimbursed = true;
                        if (free.noOfService < 0) {
                            allCheck = false;
                        } else allCheck = true;
                    }
                }
            });
            user.freeServices = _.filter(user.freeServices, function(s) {
                return s.noOfService > 0;
            });
            updateObj.freeServices = user.freeServices;
        }
        if (s.type == "membership" && ConstantService.getFreeHairWaxServiceDetail(user.gender).serviceCode == s.serviceCode) {
            noOfFreeHairCut = 1;
        }
        if (s.type == "membership" && ConstantService.getThreadingServiceDetail().serviceCode == s.serviceCode) {
            freeThreading = s.quantity;
        }
    });

    if (noOfFreeHairCut) {
        updateObj.freeMembershipServiceAvailed = true;
    }

    if (allCheck) {
        User.update({ _id: appointment.client.id }, updateObj, function(err, d) {
            if (noOfFreeHairCut || freeThreading) {
                var incObj2 = {};
                if (noOfFreeHairCut) {
                    incObj2.noOfFreeHairCut = -1;
                }
                if (freeThreading) {
                    incObj2.freeThreading = -1 * freeThreading;
                }
                ActiveMembership.update({ "members.userId": appointment.client.id }, { $inc: incObj2 }, function(er, d) {
                    return callback(true);
                });
            } else {
                return callback(true);
            }
        });
    } else
        return callback(false);
}

appointmentSchema.statics.dailyReport = function(query, date, callback) {
    var data = {
        reports: [],
        payment: [{ mode: "Cash", amount: 0 }, { mode: "Card", amount: 0 }, { mode: "Affiliate", amount: 0 }, { mode: "BeU", amount: 0 }, { mode: "AMEX", amount: 0 }, { mode: "Others", amount: 0 }, { mode: "Total", amount: 0 }],
        customers: [{ type: "New Customers", number: 0, services: 0, amount: 0 }, { type: "Old Customers", number: 0, services: 0, amount: 0 }],
        totalMembershipSale: 0,
        avgInvoiceSale: 0,
        avgServiceSale: 0,
        status: [{ type: "Cancelled", number: 0, value: 2 }, { type: "Completed", number: 0, value: 3 }],
        employee: [],
        attendance: [{ type: "On Time", number: 0 }, { type: "Late", number: 0 }, { type: "No Show", number: 0 }],
        totalEmployees: 0,
        totalRevenueToday: 0,
        totalServiceRevenue: 0,
        totalCollectionToday: 0,
        totalSalesToday: 0,
        totalTaxToday: 0,
        totalProductSale: 0,
        totalServiceSale: 0,
        totalMembershipRedeem: 0,
        totalLoyalityPoints: 0,
        totalAdvanceUsed: 0,
        totalAdvanceAdded: 0,
        payableAmount: 0,
        avgServicesPerInvoice: 0,
        totalAppointments: 0,
        totalRedemptionToday: 0,
        redemption: [{ mode: "Membership", amount: 0 }, { mode: "Advance", amount: 0 }, { mode: "Loyalty Redemption", amount: 0 }, { mode: "Total", amount: 0 }],
        subscriptionSales: [{ mode: "Cash", amount: 0 }, { mode: "Card", amount: 0 }, { mode: "Online", amount: 0 } , { mode: "Total", amount: 0 }],
        salesService: 0
    };
    var parlorTax = 0;
    console.log(query)
    Parlor.findOne(query).exec(function(err, parlor) {
        SuperCategory.find({}, function(err, supercategories) {
            _.forEach(supercategories, function(s) {
                data.reports.push({
                    unit: s.name,
                    service: 0,
                    package: 0,
                    product: 0,
                    membership: 0,
                    advance: 0,
                    totalRevenue: 0,
                    totalSale: 0,
                    totalTax: 0,
                    membershipCredits: 0,
                    totalCollection: 0,
                    parlorName: parlor.name,
                    parlorAddress: parlor.address2
                });
            });

            Admin.find({ parlorId: query._id, active: true, position: { $exists: true } }, function(err, employees) {
                _.forEach(employees, function(e) {
                    data.employee.push({
                        employeeId: e.id,
                        name: e.firstName + " " + e.lastName,
                        totalRevenueEmp: 0
                    });
                });
                
                ServiceCategory.find({}, function(err, categories) {
                    Appointment.find({
                        parlorId: query._id,
                        status: 3,
                        appointmentStartTime: { $gte: HelperService.getDayStart(date), $lt: HelperService.getDayEnd(date) }
                    }, function(err, appointments) {
                        console.log(HelperService.getDayStart(date))
                    SubscriptionSale.find({createdAt: { $gte: HelperService.getDayStart(date), $lte: HelperService.getDayEnd(date) }, 
                        razorPayId: { $regex: query._id }} ,{paymentMethod :1, actualPricePaid:1}, function(err, salonSubs){
                            
                            if(salonSubs.length>0){
                                
                                _.forEach(salonSubs , function(sub){

                                    if(sub.paymentMethod == 1){
                                        data.subscriptionSales[0].amount += sub.actualPricePaid
                                        data.subscriptionSales[3].amount += sub.actualPricePaid
                                        console.log(data.subscriptionSales)
                                    }
                                    else if(sub.paymentMethod == 2){
                                        data.subscriptionSales[1].amount += sub.actualPricePaid;
                                        data.subscriptionSales[3].amount += sub.actualPricePaid;
                                    }
                                })
                            }
                        
                        // console.log('appointments------------' , appointments.length)
                        data.totalAppointments = appointments.length;
                        _.forEach(appointments, function(appointment) {
                            if(appointment.subscriptionAmount > 0){
                                // console.log("subssssssssssssss-------------------" , appointment.paymentMethod)
                                if(appointment.paymentMethod == 1 || appointment.paymentMethod == 2 || appointment.paymentMethod == 12 ){
                                    _.forEach(appointment.allPaymentMethods , function(pay){
                                        if(pay.value == 1){
                                            data.subscriptionSales[0].amount += (pay.amount == 0) ? appointment.subscriptionAmount : pay.amount;
                                            data.subscriptionSales[3].amount += (pay.amount == 0) ? appointment.subscriptionAmount : pay.amount;
                                        }
                                        else if(pay.value == 2){
                                            data.subscriptionSales[1].amount += (pay.amount == 0) ? appointment.subscriptionAmount : pay.amount;
                                            data.subscriptionSales[3].amount += (pay.amount == 0) ? appointment.subscriptionAmount : pay.amount;
                                        };
                                    })
                                    
                                }
                                else if(appointment.paymentMethod == 5 || appointment.paymentMethod == 10){
                                    data.subscriptionSales[2].amount += appointment.subscriptionAmount
                                    data.subscriptionSales[3].amount += appointment.subscriptionAmount
                                };
                                }
                            _.forEach(appointment.products, function(prd) {
                                data.totalProductSale += (prd.price * prd.quantity);
                                for (var i = 0; i < data.employee.length; i++) {
                                    if (data.employee[i].employeeId == prd.employeeId) {
                                        data.employee[i].totalRevenueEmp += (prd.price * prd.quantity);
                                    }
                                }
                            });

                            data.totalRevenueToday += appointment.serviceRevenue;
                            data.totalRevenueToday += appointment.productRevenue;
                            data.totalMembershipRedeem += appointment.creditUsed;
                            data.totalLoyalityPoints += appointment.loyalityPoints;
                            if (appointment.paymentMethod != 4) {
                                if (!_.filter(appointment.allPaymentMethods, function(a) { return a.value == 4 })[0])
                                    data.payableAmount += appointment.payableAmount;
                            }
                            data.totalAdvanceUsed += appointment.useAdvanceCredits ? appointment.advanceCredits : 0;

                            if (appointment.allPaymentMethods.length > 0) {
                                _.forEach(appointment.allPaymentMethods, function(pay) {
                                    if (pay.value == 1) {
                                        data.payment[0].amount += pay.amount;
                                        data.payment[6].amount += pay.amount;
                                    } else if (pay.value == 2) {
                                        data.payment[1].amount += pay.amount;
                                        data.payment[6].amount += pay.amount;
                                    } else if (pay.value == 4) {
                                        data.redemption[1].amount += pay.amount;
                                        data.redemption[3].amount += pay.amount;
                                        // data.payment[6].amount += pay.amount;
                                    } else if (pay.value == 11) {
                                        data.payment[2].amount += pay.amount;
                                        data.payment[6].amount += pay.amount;
                                    } else if (pay.value == 10 || pay.value == 5) {
                                        data.payment[3].amount += pay.amount;
                                        data.payment[6].amount += pay.amount;
                                    } else if (pay.value == 8) {
                                        data.payment[4].amount += pay.amount;
                                        data.payment[6].amount += pay.amount;
                                    } else {
                                        data.payment[5].amount += pay.amount;
                                        data.payment[6].amount += pay.amount;
                                    }
                                });
                            } else {
                                if (appointment.paymentMethod == 1) {
                                    data.payment[0].amount += appointment.payableAmount;
                                    data.payment[6].amount += appointment.payableAmount;
                                } else if (appointment.paymentMethod == 2) {
                                    data.payment[1].amount += appointment.payableAmount;
                                    data.payment[6].amount += appointment.payableAmount;
                                } else if (appointment.paymentMethod == 4) {
                                    data.payment[2].amount += appointment.payableAmount;
                                    // data.payment[6].amount += appointment.payableAmount;
                                } else if (appointment.paymentMethod == 11) {
                                    data.payment[2].amount += appointment.payableAmount;
                                    data.payment[6].amount += appointment.payableAmount;
                                } else if (appointment.paymentMethod == 10 || appointment.paymentMethod == 5) {
                                    data.payment[3].amount += appointment.payableAmount;
                                    data.payment[6].amount += appointment.payableAmount;
                                } else if (appointment.paymentMethod == 8) {
                                    data.payment[4].amount += appointment.payableAmount;
                                    data.payment[6].amount += appointment.payableAmount;
                                } else {
                                    data.payment[5].amount += appointment.payableAmount;
                                    data.payment[6].amount += appointment.payableAmount;
                                }
                            }

                            if (appointment.client.noOfAppointments == 0) {
                                data.customers[0].number++;
                                data.customers[0].services += appointment.services.length;
                                data.customers[0].amount += appointment.payableAmount;
                            } else {
                                data.customers[1].number++;
                                data.customers[1].services += appointment.services.length;
                                data.customers[1].amount += appointment.payableAmount;
                            }
                            if (appointment.status == 2) {
                                data.status[0].number++;
                            } else if (appointment.status == 3) {
                                data.status[1].number++;
                            }
                            // appointment.services.forEach(function(service){
                            if (appointment.loyalityPoints) {
                                data.redemption[2].amount += (appointment.loyalityPoints * 0.5);
                                data.redemption[3].amount += (appointment.loyalityPoints * 0.5);
                            }
                            // });
                            Appointment.populateDepartmentValue(appointment.createdAt, data.reports, categories, parlor.services, appointment, parlor.tax, data.employee);
                            if (appointment.creditUsed != undefined) {
                                data.redemption[0].amount += appointment.creditUsed;
                                data.redemption[3].amount += appointment.creditUsed;
                            }
                            if (appointment.useAdvanceCredits) {
                                data.redemption[1].amount += appointment.advanceCredits;
                                data.redemption[3].amount += appointment.advanceCredits;
                            }

                            parlorTax = ConstantService.getParlorTax(parlor.tax, appointment.createdAt);
                        });
                        data.reports.forEach(function(dep) {
                            data.totalTaxToday += dep.totalTax;
                            // data.totalRevenueToday += dep.totalRevenue ;
                            data.totalServiceSale += dep.totalSale;
                        });

                        MembershipSale.find({ parlorId: query._id, createdAt: { $gt: HelperService.getDayStart(date), $lt: HelperService.getDayEnd(date) } }, function(err, ms) {
                            ActiveMembership.find({
                                'history.0.parlorId': query._id,
                                'history.0.appointmentDate': { $gt: HelperService.getDayStart(date), $lt: HelperService.getDayEnd(date) },
                                "paymentMethods.value": 10
                            }, function(err, aMSales) {
                                Advance.find({ parlorId: query._id, createdAt: { $gt: HelperService.getDayStart(date), $lt: HelperService.getDayEnd(date) } }, function(err, advance) {
                                    _.forEach(advance, function(adv) {
                                        data.totalAdvanceAdded += adv.amount;
                                        data.payment[0].amount += adv.amount;
                                        data.payment[6].amount += adv.amount;
                                    });
                                    _.forEach(ms, function(m) {

                                        data.totalMembershipSale += m.price ;
                                        data.totalTaxToday += m.price * 0.18;
                                        m.paymentMethods.forEach(function(method) {
                                            if (method.value == 1) {
                                                data.payment[0].amount += method.amount;
                                                data.payment[6].amount += method.amount;
                                            } else if (method.value == 10 || method.value == 5) {
                                                data.payment[3].amount += method.amount;
                                                data.payment[6].amount += method.amount;
                                            } else {
                                                data.payment[1].amount += method.amount;
                                                data.payment[6].amount += method.amount;
                                            }
                                        })
                                    });

                                    console.log(aMSales)
                                    _.forEach(aMSales, function(am) {

                                        data.totalMembershipSale += am.price;
                                        data.totalTaxToday += am.price * 0.18;
                                        am.paymentMethods.forEach(function(method) {
                                            if (method.value == 10 || method.value == 5) {
                                                data.payment[3].amount += method.amount;
                                                data.payment[6].amount += method.amount;
                                            } else {
                                                data.payment[1].amount += method.amount;
                                                data.payment[6].amount += method.amount;
                                            }
                                        })


                                    });
                                    data.totalSalesToday += data.totalServiceSale + data.totalMembershipSale + data.totalProductSale;
                                    // data.totalRevenueToday+=data.totalProductSale;
                                    data.avgInvoiceSale = (data.totalRevenueToday) / appointments.length;
                                    data.numberOfInvoice = appointments.length;
                                    data.avgServiceSale = (data.customers[0].amount + data.customers[1].amount) / (data.customers[0].services + data.customers[1].services);
                                    data.totalServiceRevenue += data.totalRevenueToday - data.totalProductSale
                                    data.totalCollectionToday = data.payableAmount + (data.totalMembershipSale *1.18) + data.totalAdvanceAdded;
                                    return callback(err, data);
                                });
                            })
                        });
                    });
                    });
                    console.log(data.subscriptionSales)
                });
                data.totalEmployees = employees.length;
                var min = new Date();
                Attendance.find({ employeeId: { $regex: employees.id }, createdAt: { $gte: HelperService.getDayStart(date), $lt: HelperService.getDayEnd(date) } }, function(err, attendance) {
                    _.forEach(attendance, function(a) {
                        if (a.createdAt <= min) {
                            min = a.createdAt;
                        }
                    });
                    var time = new Date();
                    min = HelperService.getDayEnd(date);
                    employees.createdAt = min;
                    if (employees.createdAt <= time) {
                        data.attendance[0].number++;
                    } else if (employees.createdAt > time) {
                        data.attendance[1].number++;
                    } else {
                        data.attendance[2].number++;
                    }
                })
            });

        });
    });
};

appointmentSchema.statics.weeklyReport = function(parlor, month, year, callback) {
    var data = {
        emp: [],
        weekData: [],
        parlorName: parlor.name,
        parlorAddress: parlor.address2
    };
    var parlorId = parlor.id;
    Appointment.find({ parlorId: parlorId, status: 3 }, {
        serviceRevenue: 1,
        appointmentStartTime: 1,
        'services.discountMedium': 1,
        'services.frequencyDiscountUsed': 1,
        'services.price': 1,
        'services.additions': 1,
        'services.quantity': 1,
        'services.discount': 1,
        'services.membershipDiscount': 1,
        'services.loyalityPoints': 1,
        'products.quantity': 1,
        'products.price': 1
    }, function(err, appointments) {
        var date = new Date();
        var y = year;
        var dates = [{ startDate: new Date(y, month, 1, 0, 0, 0), endDate: new Date(y, month, 7, 23, 59, 59) },
            { startDate: new Date(y, month, 8, 0, 0, 0), endDate: new Date(y, month, 14, 23, 59, 59) },
            { startDate: new Date(y, month, 15, 0, 0, 0), endDate: new Date(y, month, 21, 23, 59, 59) },
            { startDate: new Date(y, month, 22, 0, 0, 0), endDate: new Date(y, month, 28, 23, 59, 59) }
        ];
        if ((month != 1)) {
            dates.push({ startDate: new Date(y, month, 29, 0, 0, 0), endDate: HelperService.getLastDateOfMonth(y, month) });
        }
        async.each(dates, function(date, call) {
            Appointment.aggregate([{
                    $match: {
                        appointmentStartTime: { $gt: HelperService.getDayStart(date.startDate), $lt: HelperService.getDayEnd(date.endDate) },
                        loyalitySubscription: { $gt: 0 },
                        status: 3,
                        parlorId: ObjectId(parlorId)
                    }
                },
                { $group: { _id: '$client.id', subtotal: { $sum: "$subtotal" } } },
                { $group: { _id: null, subtotal: { $sum: "$subtotal" }, count: { $sum: 1 } } },
                { $project: { totalRevenue: '$subtotal', count: '$count', avgBill: { $divide: ['$subtotal', '$count'] } } }
            ], function(err, subscriber) {
                var mon = HelperService.getDayStart(date.startDate),
                    mon1 = HelperService.getDayEnd(date.endDate);
                var d1 = mon.getDate() + "/" + (mon.getMonth() + 1) + "/" + y,
                    d2 = mon1.getDate() + "/" + (mon.getMonth() + 1) + "/" + y;
                var objTobe = {
                    weekNumber: HelperService.getWeekNumber(date.startDate),
                    startDate: d1,
                    endDate: d2,
                    productSale: 0,
                    serviceSale: 0,
                    totalSale: 0,
                    subscriptionRevenue: 0,
                    subscribers: 0,
                    avgValueOfSubscriber: 0
                };
                _.forEach(appointments, function(app) {
                    if (app.appointmentStartTime.getTime() >= date.startDate.getTime() && app.appointmentStartTime.getTime() < date.endDate.getTime()) {
                        // _.forEach(app.services , function(service){
                        // service.employees = [];
                        // var serviceRevenue = Appointment.serviceFunction(service, data.emp);
                        // objTobe.serviceSale += serviceRevenue.totalSale;
                        // objTobe.totalSale += serviceRevenue.totalSale;

                        objTobe.serviceSale += app.serviceRevenue;
                        objTobe.totalSale += app.serviceRevenue

                        // });
                        _.forEach(app.products, function(prd) {
                            objTobe.productSale += (prd.price * prd.quantity);
                            objTobe.totalSale += (prd.price * prd.quantity);
                        });
                    }
                });
                if (subscriber.length > 0) {
                    objTobe.subscriptionRevenue = subscriber[0].totalRevenue;
                    objTobe.subscribers = subscriber[0].count;
                    objTobe.avgValueOfSubscriber = subscriber[0].avgBill;
                }
                data.weekData.push(objTobe);
                call();
            });
        }, function allTaskCompleted() {
            return callback(err, data);
        });
    })

};


// appointmentSchema.statics.weeklyReport = function (parlor,month,callback) {
//     var data={
//         emp:[],
//         weekData:[],
//         parlorName:parlor.name,
//         parlorAddress:parlor.address2
//     };
//     var parlorId = parlor.id;
//         var date=new Date();
//         var y = date.getFullYear();
//         var dates=[{startDate:new Date(y,month,1, 0, 0, 0), endDate:new Date(y,month,7, 23, 59, 59)},
//             {startDate:new Date(y,month,8, 0, 0, 0), endDate:new Date(y,month,14, 23, 59, 59)},
//             {startDate:new Date(y,month,15, 0, 0, 0), endDate:new Date(y,month,21, 23, 59, 59)},
//             {startDate:new Date(y,month,22, 0, 0, 0), endDate:new Date(y,month,28, 23, 59, 59)}];
//         if((month!=1)){
//             dates.push({startDate:new Date(y,month,29, 0, 0, 0),endDate:HelperService.getLastDateOfMonth(y,month)});
//         }
//             var async = require('async');
//             async.each(dates,function(date, callback){
//             var query = {
//                     parlorId:ObjectId(parlorId) ,
//                     status:3,
//                     appointmentStartTime :{$gte : HelperService.getDayStart(date.startDate) ,$lt : HelperService.getDayEnd(date.endDate)}
//                 };

//             var mon = HelperService.getDayStart(date.startDate);
//             var mon1 = HelperService.getDayEnd(date.endDate);
//             var d1 = mon.getDate() +"/"+ (mon.getMonth()+1) +"/"+ y;
//             var d2 = mon1.getDate() +"/"+ (mon.getMonth()+1) +"/"+ y;
//             var objTobe={
//                 startDate: d1,
//                 endDate:d2,
//                 productSale:0,
//                 serviceSale :0,
//                 totalSale:0
//             };
//             Appointment.aggregate([
//                 {$match : query},
//                 {$project :
//                     {
//                         serviceRevenue :1 , productRevenue:1,date: {'$dateToString': {format: '%m/%d/%Y', date: '$appointmentStartTime'}},
//                         totalRevenue : {$add :["$serviceRevenue" , "$productRevenue"]}
//                     }
//                 },
//                 {$group :
//                     {_id:
//                         {_id:null},date:{$first :"$date"},serviceRevenue : {$sum : "$serviceRevenue"} ,
//                         productRevenue :{$sum :"$productRevenue"},totalRevenue : {$sum : "$totalRevenue"}
//                      }
//                  }
//                 ]).exec(function(err, weekly){
//                     console.log(weekly)
//                     objTobe.serviceSale = weekly[0].serviceRevenue;
//                     objTobe.totalSale = weekly[0].totalRevenue;
//                     objTobe.productSale = weekly[0].productRevenue;
//                 })

//             data.weekData.push(objTobe);
//             callback();
//             },
//             function (err) {
//               return(data)
//             });
// };




appointmentSchema.statics.monthlyReport = function(parlor, startDate, endDate, callback) {
    var data = {
        parlorId: parlor._id,
        reports: [{ unit: "others", totalRevenue: 0, totalSale: 0, totalTax: 0 }],
        parlorName: parlor.name,
        parlorAddress: parlor.address2,
        totalProductSale: 0,
        newRevenue: 0,
        employee: []
    };
    var parlorId = parlor.id;
    Parlor.findOne({ _id: parlorId }, { _id: 1, services: 1, tax: 1 }, function(err, parlor) {
        SuperCategory.find({}).sort({ sortOrder: 1 }).exec(function(err, supercategories) {
            _.forEach(supercategories, function(s) {
                data.reports.push({
                    unit: s.name,
                    service: 0,
                    totalRevenue: 0,
                    totalSale: 0,
                    totalTax: 0,
                    membershipCredits: 0,
                    totalCollection: 0,
                    totalMembershipSale: 0,
                    totalSales: 0,
                    totalServiceSale: 0,
                    totalMembershipRedeem: 0,
                    totalAdvanceAdded: 0,
                    totalLoyalityPoints: 0,
                    payableAmount: 0,
                    totalAppointments: 0,
                    totalRedemption: 0,

                });
            });
            ServiceCategory.find({}, function(err, categories) {
                Appointment.find({
                    parlorId: parlorId,
                    status: 3,
                    appointmentStartTime: { $gte: HelperService.getDayStart(startDate), $lt: HelperService.getDayEnd(endDate) }
                }, { products: 1, loyalityPoints: 1, payableAmount: 1, services: 1, serviceRevenue: 1, createdAt: 1 }, function(err, appointments) {

                    data.reports.totalAppointments = appointments.length;
                    _.forEach(appointments, function(appointment) {
                        data.newRevenue += appointment.serviceRevenue;
                        _.forEach(appointment.products, function(prd) {
                            data.totalProductSale += (prd.price * prd.quantity);
                        });
                        data.reports.totalLoyalityPoints += appointment.loyalityPoints;
                        if (appointment.paymentMethod != 11) {
                            data.reports.payableAmount += appointment.payableAmount;
                        }

                        Appointment.populateDepartmentValue(appointment.createdAt, data.reports, categories, parlor.services, appointment, parlor.tax, data.employee);
                    });
                    // data.reports.forEach(function (dep) {
                    //     data.reports.totalTax += dep.totalTax;
                    //     data.reports.totalRevenue += dep.totalRevenue;
                    //     data.reports.totalServiceSale += dep.totalSale;
                    // });
                    // MembershipSale.find({parlorId: parlorId, createdAt: {$gt: HelperService.getDayStart(startDate), $lt: HelperService.getDayEnd(endDate)}
                    // }, function (err, ms) {
                    //     Advance.find({parlorId: parlorId, createdAt: {$gt: HelperService.getDayStart(startDate), $lt: HelperService.getDayEnd(endDate)}
                    //     }, function (err, advance) {
                    //         _.forEach(advance,function(adv){
                    //             data.reports.totalAdvanceAdded += adv.amount;
                    //         });
                    //         _.forEach(ms, function (m) {
                    //             data.reports.totalMembershipSale += m.price;
                    //         });
                    //         data.reports.totalSales += data.reports.totalServiceSale + data.reports.totalMembershipSale + data.totalProductSale;
                    //         data.reports.totalRevenue += data.totalProductSale;
                    //         data.reports.totalCollection +=data.reports.payableAmount + data.reports.totalMembershipSale*1.18 + data.reports.totalAdvanceAdded ;
                    return callback(err, data);
                    //     });
                    // });
                });

            });
        });
    })
};


// appointmentSchema.statics.otherServicesWithfreeServices =function(date, callback2){
//         Appointment.aggregate
//             ([
//                 {$match : {
//                     appointmentStartTime: {$gte: date.date, $lt: HelperService.getDayEnd(date.date)},
//                     status : 3,
//                     "services.discountMedium" :"frequency",
//                     "services.dealId":null,
//                     "services.dealPriceUsed" : true,
//                 }},
//                 ]).exec(function(err, appt){
//                     var clientIds = _.map(appt, function(a){ return a.client.id; });
//                     parlor.freeHairCutCount = appt.length;
//                     Appointment.aggregate(
//                       {"$match" : {'client.id' : {$in : clientIds}, status : 3}
//                       },
//                       {
//                            "$project": {
//                                 "services": { "$size": "$services" },
//                                 subtotal : 1,
//                                 loyalityPoints : 1,

//                             }
//                       },
//                       { $group : {
//                             '_id': null,
//                             total: { $sum : {$subtract: [ "$subtotal", "$loyalityPoints" ] }},
//                             count: { $sum: "$services"}
//                         }
//                         }
//             ).exec(function(err, response){
//                 if(response.length == 0)response = [{total : 0, count : 0}];
//                 parlor.otherServicesRevenue = response[0].total;
//                 parlor.otherServicesCount = response[0].count - parlor.freeHairCutCount;
//                 return callback2();
//             });
//         });
// };


appointmentSchema.statics.recommendationScheduler = function(e, callback) {
    var nodemailer = require('nodemailer');
    var date = new Date();
    var cDate = new Date((date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear());
    Notification.find({ action: 'recommendation', sent: false }).exec(function(err, recommend) {
        _.forEach(recommend, function(rc) {
            var rcDate = rc.sendingDate;
            var rDate = new Date((rcDate.getMonth() + 1) + "/" + rcDate.getDate() + "/" + rcDate.getFullYear());
            if (cDate == rDate) {
                var d = [];
                var data1 = { type: "recommendation", title: rc.title, body: rc.body };
                var dataSms = rc.smsContent;
                var async = require('async');
                User.findOne({ _id: rc.userId }).exec(function(err, users) {
                    var fbId = [],
                        fbIos = [],
                        emails = [],
                        phone = [];
                    _.forEach(users, function(user) {
                        if (user.firebaseId) fbId.push(user.firebaseId);
                        if (user.firebaseIdIOS) fbIos.push(user.firebaseIdIOS);
                        if (user.emailId) emails.push(user.emailId);
                        if (user.phoneNumber) phone.push(user.phoneNumber)
                    });
                    async.parallel([
                        function(done) {
                            async.each([1, 2], function(p, callback) {
                                if (p == 1) {
                                    Appointment.sendAppNotificationAdmin(fbId, data1, function(err, data) {
                                        d.push(data);
                                        callback();
                                    })
                                }
                                if (p == 2) {
                                    Appointment.sendAppNotificationIOSAdmin(fbIos, data1, function(err, data) {
                                        d.push(data);
                                        callback();
                                    })
                                }

                            }, done);
                        }
                    ], function allTaskCompleted() {
                        return res.json(d);
                    });
                    var recommSms = Appointment.recommSms(phone, dataSms);
                    Appointment.sendSMS(recommSms, function(e) {});

                    function sendEmail() {
                        var transporter = nodemailer.createTransport('smtps://info@beusalons.com:beusalons@123@smtp.gmail.com');
                        var mailOptions = {
                            from: 'info@beusalons.com', // sender address
                            to: "nikita@beusalons.com",
                            // to: [emails], // list of receivers
                            html: '',
                            subject: 'Be U Salons' // Subject line
                        };
                        // transporter.sendMail(mailOptions, function (error, info) {
                        //     if (error)
                        //         console.log(error);
                        //     else
                        //     // console.log('Message sent: ' + info.response);
                        //         return res.json(CreateObjService.response(false, "Mail sent successfully!"));
                        // });
                    }

                    sendEmail();
                })
            }
        })
    });

    User.find({ lastActiveTime: { $lt: new Date((new Date()) - 1000 * 60 * 60 * 720) } }).exec(function(err, users) {
        var data1 = { type: "loginBased", title: 'We Miss You!', body: 'Itâ€™s been a while since we treated you with our nourishing and pampering treatments. Come, say a hi and experience heavenly services at unbelievable prices!' }
        var async = require('async');
        var d = [];
        var fbId = [],
            fbIos = [],
            emails = [];
        _.forEach(users, function(user) {
            if (user.firebaseId) fbId.push(user.firebaseId);
            if (user.firebaseIdIOS) fbIos.push(user.firebaseIdIOS);
            if (user.emailId) emails.push(user.emailId);
        })
        async.parallel([
            function(done) {
                async.each([1, 2], function(p, callback) {
                    if (p == 1) {
                        Appointment.sendAppNotificationAdmin(fbId, data1, function(err, data) {
                            d.push(data);
                            callback();
                        })
                    }
                    if (p == 2) {
                        Appointment.sendAppNotificationIOSAdmin(fbIos, data1, function(err, data) {
                            d.push(data);
                            callback();
                        })
                    }

                }, done);
            }
        ], function allTaskCompleted() {
            // return res.json(d);
        });

        function sendEmail() {
            var transporter = nodemailer.createTransport('smtps://info@beusalons.com:beusalons@123@smtp.gmail.com');
            var mailOptions = {
                from: 'info@beusalons.com', // sender address
                to: "nikita@beusalons.com",
                // to: [emails], // list of receivers
                html: '',
                subject: 'Be U Salons' // Subject line
            };
            // transporter.sendMail(mailOptions, function (error, info) {
            //     if (error)
            //         console.log(error);
            //     else
            //     // console.log('Message sent: ' + info.response);
            //         return res.json(CreateObjService.response(false, "Mail sent successfully!"));
            // });
        }
        sendEmail();
        var number = user.phoneNumber;
        var usermessage = Appointment.ownerSms(number, data);
        Appointment.sendSMS(usermessage, function(e) {});
    })
}
appointmentSchema.statics.secondVisitRevenue = function(r, callback) {
    Appointment.findOne({ 'client.id': r._id, appointmentStartTime: { $gt: HelperService.addDaysToDate(r.date, 1) } }, { serviceRevenue: 1, appointmentStartTime: 1 }).sort({ 'appointmentStartTime': -1 }).exec(function(err, appointment) {
        if (appointment) {
            r.secondVisitDate = appointment.appointmentStartTime;
            r.secondVisitRevenue = appointment.serviceRevenue;
        } else {}
        callback();
    });
};

appointmentSchema.statics.otherServicesWithfreeServices = function(date, callback2) {

    Async.each(date.parlors, function(parlor, callback) {

        var query = { parlorId: parlor.parlorId, status: 3, appointmentStartTime: { $gte: HelperService.getDayStart(date.date), $lt: HelperService.getDayEnd(date.date) } }
            // console.log(query)
        Appointment.find(query, { services: 1 }, function(err, appt) {
            // console.log(appt)
            if (appt) {
                _.forEach(appt, function(app) {
                    _.forEach(app.services, function(ser) {
                        if (ser.discountMedium == "frequency") {
                            console.log("aaya")
                            if (ser.serviceId == "58707eda0901cc46c44af2eb" || ser.serviceId == "58707eda0901cc46c44af417" || ser.serviceId == "58707eda0901cc46c44af40f") {
                                parlor.serviceCount[0].number++;
                                parlor.serviceCount[0].amount += ser.loyalityPoints
                            }
                            // if (ser.serviceId == "58707eda0901cc46c44af417") {
                            //     parlor.serviceCount[1].number++;
                            //     parlor.serviceCount[1].amount += ser.loyalityPoints
                            // }
                            if (ser.serviceId == "59520f3b64cd9509caa273ec") {
                                parlor.serviceCount[1].number++;
                                parlor.serviceCount[1].amount += ser.loyalityPoints
                            }
                            // if(ser.serviceId == "58707eda0901cc46c44af40f" ) {
                            //     parlor.serviceCount[3].number++;
                            //     parlor.serviceCount[3].amount += ser.loyalityPoints
                            // }
                        } else {
                            console.log("aayaaaaaaaaaaaaaaaaaaaaaaa")
                            if (ser.serviceId == "58707eda0901cc46c44af4a7" || ser.serviceId == "58707eda0901cc46c44af4a1") {
                                if (ser.price == ser.loyalityPoints) {
                                    console.log("ser.loyalityPoints", ser.loyalityPoints)
                                    parlor.serviceCount[2].number++;
                                    parlor.serviceCount[2].amount += ser.loyalityPoints
                                }
                            } else {
                                // console.log("else")
                                parlor.serviceCount[3].number++;
                                parlor.serviceCount[3].amount += (ser.price - ser.loyalityPoints)
                            }
                            // console.log("amount"+parlor.amount)
                            // console.log(parlor)
                        }
                    });
                })
                callback();
            } else {
                callback();
            }
        });

    }, function allTaskCompleted() {
        return callback2();
    });
};

appointmentSchema.statics.freeServiceReport = function(parlor, startDate, endDate, callback) {
    var data = {
        parlorName: parlor.name,
        parlorAddress: parlor.address2,
        amount: 0,
        freeServices: 0,
        serviceCount: [{ type: "Male Hair Cut", number: 0 }, { type: "Female Hair Cut", number: 0 }, { type: "Classic Express Wax", number: 0 }, { type: "Blow Dry", number: 0 }]
    };
    Appointment.find({
        parlorId: parlor.id,
        "services.discountMedium": "frequency",
        "services.dealId": null,
        "services.dealPriceUsed": true,
        status: 3,
        appointmentStartTime: { $gte: HelperService.getDayStart(startDate), $lt: HelperService.getDayEnd(endDate) }
    }, function(err, appt) {
        if (appt) {
            data.freeServices = appt.length;
            _.forEach(appt, function(app) {
                _.forEach(app.services, function(ser) {
                    if (ser.serviceId == "58707eda0901cc46c44af2eb" && ser.dealId == null && ser.discountMedium == "frequency" && ser.dealPriceUsed == true) {
                        data.serviceCount[0].number++;
                        data.amount += ser.loyalityPoints
                    }
                    if (ser.serviceId == "58707eda0901cc46c44af417" && ser.dealId == null && ser.discountMedium == "frequency" && ser.dealPriceUsed == true) {
                        data.serviceCount[1].number++;
                        data.amount += ser.loyalityPoints
                    }
                    if (ser.serviceId == "59520f3b64cd9509caa273ec" && ser.dealId == null && ser.discountMedium == "frequency" && ser.dealPriceUsed == true) {
                        data.serviceCount[2].number++;
                        data.amount += ser.loyalityPoints
                    } else if (ser.serviceId == "58707eda0901cc46c44af40f" && ser.dealId == null && ser.discountMedium == "frequency" && ser.dealPriceUsed == true) {
                        data.serviceCount[3].number++;
                        data.amount += ser.loyalityPoints
                    }
                });
            })
            return callback(err, data);
        }
    });
};

appointmentSchema.statics.oldNewAvgVisit = function(parlor, startDate, endDate, callback) {
    var data = {
        parlorName: parlor.name,
        parlorAddress: parlor.address2,
        customers: [{ type: "New Guest", serviceNo: 0, revenue: 0, tickectNo: 0, avgTicketSize: 0 },
            { type: "Old Guest", serviceNo: 0, revenue: 0, tickectNo: 0, avgTicketSize: 0 },
            { type: "Total Guest", serviceNo: 0, revenue: 0, tickectNo: 0, avgTicketSize: 0 }
        ],
        employee: []
    };
    var parlorId = parlor.id;
    Appointment.find({
        parlorId: parlorId,
        status: 3,
        appointmentStartTime: { $gte: HelperService.getDayStart(startDate), $lt: HelperService.getDayEnd(endDate) }
    }, { services: 1, client: 1, createdAt: 1 }, function(err, appointments) {
        _.forEach(appointments, function(app) {
            data.customers[2].tickectNo++;
            if (app.client.noOfAppointments == 0) {
                data.customers[0].tickectNo++;
                _.forEach(app.services, function(s) {
                    var servicer = Appointment.serviceFunction(app.createdAt, s, data.employee);
                    data.customers[0].serviceNo += s.quantity;
                    data.customers[0].revenue += servicer.totalRevenue;
                    data.customers[2].serviceNo += s.quantity;
                    data.customers[2].revenue += servicer.totalRevenue;
                })
            } else if (app.client.noOfAppointments > 0) {
                data.customers[1].tickectNo++;
                _.forEach(app.services, function(s) {
                    var servicer = Appointment.serviceFunction(app.createdAt, s, data.employee);
                    data.customers[1].serviceNo += s.quantity;
                    data.customers[1].revenue += servicer.totalRevenue;
                    data.customers[2].serviceNo += s.quantity;
                    data.customers[2].revenue += servicer.totalRevenue;
                })
            }
        });
        return callback(err, data);
    })
};

appointmentSchema.statics.oldNewBranchSeg = function(parlor, startDate, endDate, callback) {
    var data = {
        reports: [],
        parlorName: parlor.name,
        parlorAddress: parlor.address2,
        employee: []
    };
    var parlorId = parlor.id;
    Parlor.findOne({ _id: parlorId }, { _id: 1, services: 1, tax: 1 }, function(err, parlor) {
        SuperCategory.find({}).sort({ sortOrder: 1 }).exec(function(err, supercategories) {
            _.forEach(supercategories, function(s) {
                data.reports.push({
                    unit: s.name,
                    service: 0,
                    totalRevenue: 0,
                    customers: [{ type: "New Guest", serviceNo: 0, revenue: 0 },
                        { type: "Old Guest", serviceNo: 0, revenue: 0 },
                        { type: "Total Guest", serviceNo: 0, revenue: 0 }
                    ]
                });
            });
            ServiceCategory.find({}, function(err, categories) {
                Appointment.find({
                    parlorId: parlorId,
                    status: 3,
                    appointmentStartTime: { $gte: HelperService.getDayStart(startDate), $lt: HelperService.getDayEnd(endDate) }
                }, { payableAmount: 1, services: 1, client: 1, createdAt: 1 }, function(err, appointments) {
                    _.forEach(appointments, function(appointment) {
                        Appointment.populateDepartmentValueCustomer(appointment.createdAt, data.reports, categories, parlor.services, appointment, parlor.tax, data.employee);
                    });
                    return callback(err, data);
                })
            })
        });
    })
};

appointmentSchema.statics.populateDepartmentValueCustomer = function(createdAt, reports, categories, services, appointment, tax, employee) {
    _.forEach(services, function(s) {
        _.forEach(s.prices, function(p) {
            _.forEach(appointment.services, function(ser) {
                if (p.priceId == ser.id) {
                    var category = categories.filter(function(el) {
                        return el.id == s.categoryId;
                    })[0];
                    _.forEach(reports, function(report) {
                        if (report.unit == category.superCategory) {
                            report.service += ser.quantity;
                            var serviceRevenue = Appointment.serviceFunction(createdAt, ser, employee);
                            if (appointment.client.noOfAppointments == 0) {
                                report.customers[0].serviceNo += ser.quantity;
                                report.customers[0].revenue += serviceRevenue.totalRevenue;
                                report.customers[2].serviceNo += ser.quantity;
                                report.customers[2].revenue += serviceRevenue.totalRevenue;
                            } else if (appointment.client.noOfAppointments > 0) {
                                report.customers[1].serviceNo += ser.quantity;
                                report.customers[1].revenue += serviceRevenue.totalRevenue;
                                report.customers[2].serviceNo += ser.quantity;
                                report.customers[2].revenue += serviceRevenue.totalRevenue;
                            }
                            report.totalRevenue += serviceRevenue.totalRevenue;
                        }
                    });
                }
            });
        });
    });
};

appointmentSchema.statics.monthlyVitalReport = function(parlor, startDate, endDate, callback) {
    var data = {
        reports: [],
        customers: [{ type: "New Customers", number: 0, services: 0, amount: 0 }, { type: "Old Customers", number: 0, services: 0, amount: 0 }],
        totalMembershipSale: 0,
        categories: [],
        totalRevenue: 0,

        appRevenue: 0,
        nonAppRevenue: 0,
        projectedRevenue: 0,
        cashbackToSalon: 0,

        totalServiceRevenue: 0,
        totalCollection: 0,
        totalProductSale: 0,
        totalServiceSale: 0,
        totalMembershipRedeem: 0,
        totalLoyalityPoints: 0,
        totalAdvanceAdded: 0,
        payableAmount: 0,
        avgServicesPerInvoice: 0,
        totalAppointments: 0,
        totalRedemption: 0,
        parlorName: parlor.name,
        parlorAddress: parlor.address2,
        repeatedCustomer: 0,
        employee: [],
        totalNoServices: 0
    };
    var parlorId = parlor.id,
        parlorTax = 0;
    Appointment.find({
        parlorId: parlorId,
        status: 3,
        appointmentStartTime: { $gte: HelperService.getDayStart(startDate), $lt: HelperService.getDayEnd(endDate) }
    }, function(err, appointments) {
        data.totalAppointments = appointments.length;
        _.forEach(appointments, function(appointment) {
            _.forEach(appointment.products, function(prd) { data.totalProductSale += (prd.price * prd.quantity); });
            data.totalLoyalityPoints += appointment.loyalityPoints;
            if (appointment.paymentMethod != 11) {
                data.payableAmount += appointment.payableAmount;
            }
            if (appointment.client.noOfAppointments == 0) {
                data.customers[0].number++;
                if(appointment.services){

                    data.customers[0].services += appointment.services.length;
                }
                data.customers[0].amount += appointment.payableAmount;
            } else {
                data.customers[1].number++;
                data.customers[1].services += appointment.services.length;
                data.customers[1].amount += appointment.payableAmount;
            }
            _.forEach(appointment.services, function(s) {
                // var servicer = Appointment.serviceFunction(s,data.employee);

                data.totalNoServices += s.quantity;

            })
            data.totalServiceRevenue += appointment.serviceRevenue;

            parlorTax = ConstantService.getParlorTax(parlor.tax, appointment.createdAt)
        });
        MembershipSale.find({
            parlorId: parlorId,
            createdAt: { $gt: HelperService.getDayStart(startDate), $lt: HelperService.getDayEnd(endDate) }
        }, function(err, ms) {
            Advance.find({
                parlorId: parlorId,
                createdAt: { $gt: HelperService.getDayStart(startDate), $lt: HelperService.getDayEnd(endDate) }
            }, function(err, advance) {
                var query = [
                    { $match: { status: 3, parlorId: ObjectId(parlorId), appointmentStartTime: { $gte: HelperService.getDayStart(startDate), $lt: HelperService.getDayEnd(endDate) } } },
                    { $group: { _id: "$client.id", count: { $sum: 1 } } },
                    { $match: { count: { $gt: 1 } } },
                    { $group: { _id: null, count: { $sum: 1 } } }
                ]
                Appointment.aggregate(query).exec(function(err, clients) {
                    if (clients.length > 0) {
                        data.repeatedCustomer = clients[0].count;
                    }
                    _.forEach(advance, function(adv) {
                        data.reports.totalAdvanceAdded += adv.amount;
                    });
                    _.forEach(ms, function(m) {
                        data.reports.totalMembershipSale += m.price;
                    });
                    data.totalSales += data.totalServiceSale + data.totalMembershipSale + data.totalProductSale;
                    data.totalRevenue += data.totalProductSale + data.totalServiceRevenue;
                    data.totalCollection += data.payableAmount + data.totalMembershipSale + data.totalAdvanceAdded;

                    return callback(err, data);
                })
            });
        });
    });
};


appointmentSchema.statics.employeeSegmentReport = function(employee, startDate, endDate, callback) {
    var data = {
        employeeId: employee.id,
        name: employee.firstName + " " + employee.lastName,
        position: employee.position,
        totalRevenueEmp: 0,
        parlorName: "",
        parlorAddress: "",
        totalAppointments: 0,
        productSale: {
            productNo: 0,
            productRevenue: 0
        },
        totalProductRevenueEmp: 0,
        dep: []
    };
    var parlorId = employee.parlorId;
    Parlor.findOne({ _id: parlorId }, { name: 1, address2: 1 }, function(err, parlor) {
        if (parlor) {
            data.parlorAddress = parlor.address2;
            data.parlorName = parlor.name;
        }
        ServiceCategory.find({}).sort({ sort: 1 }).exec(function(err, categories) {
            _.forEach(categories, function(c) {
                data.dep.push({
                    unit: c.name,
                    serviceNo: 0,
                    totalRevenue: 0
                });
            });
            Appointment.find({
                parlorId: parlorId,
                "services.employees.employeeId": employee.id,
                status: 3,
                appointmentStartTime: { $gte: HelperService.getDayStart(startDate), $lt: HelperService.getDayEnd(endDate) }
            }, function(err, appointments) {
                Appointment.find({
                    parlorId: parlorId,
                    $where: "this.products.length>0",
                    status: 3,
                    appointmentStartTime: { $gte: HelperService.getDayStart(startDate), $lt: HelperService.getDayEnd(endDate) }
                }, function(err, productAppoint) {
                    _.forEach(productAppoint, function(prdApp) {
                            _.forEach(prdApp.products, function(prd) {
                                if (prd.employeeId == employee.id) {
                                    // _.forEach(data.product, function (product) {
                                    data.totalProductRevenueEmp += (prd.price * prd.quantity);

                                    data.productSale.productNo += prd.quantity;
                                    data.productSale.productRevenue += (prd.price * prd.quantity);

                                    // });
                                }
                            });
                        })
                        // if(appointments) {
                        //     data.totalAppointments = appointments.length;
                        // }
                    _.forEach(appointments, function(appointment) {
                        data.totalAppointments++;
                        // _.forEach(appointment.products, function (prd) {
                        //     if(prd.employeeId == data.employeeId) {
                        //         data.productSale.productNo += prd.quantity;
                        //         data.productSale.productRevenue += (prd.price * prd.quantity);
                        //         data.totalProductRevenueEmp += data.productSale.productRevenue
                        //     }
                        // });
                        _.forEach(appointment.services, function(ser) {
                            var category = categories.filter(function(el) {
                                return el.id == ser.categoryId;
                            })[0];
                            _.forEach(data.dep, function(report) {
                                if (category && report.unit == category.name) {
                                    report.serviceNo += ser.quantity;
                                    // _.forEach(ser.employees, function (emp) {
                                    var empObj = [{
                                        employeeId: employee.id,
                                        totalRevenueEmp: 0,
                                    }];
                                    var serviceRevenue = Appointment.serviceFunction(appointment.createdAt, ser, empObj);
                                    if(serviceRevenue.employees[0].totalRevenueEmp){
                                        
                                        report.totalRevenue += serviceRevenue.employees[0].totalRevenueEmp;
                                        data.totalRevenueEmp += serviceRevenue.employees[0].totalRevenueEmp;
                                    }
                                    // })
                                }
                            })
                        })
                    });
                    data.totalRevenueEmp += data.totalProductRevenueEmp;
                    return callback(err, data);
                })
            })
        })
    })
};

appointmentSchema.statics.employeePerformanceReport = function(employee, month, callback) {
    var data = {
        employeeId: employee.id,
        name: employee.firstName + " " + employee.lastName,
        position: employee.position,
        empSalary: employee.salary,
        empTarget: employee.salary * 5,
        month: [],
        totalProductRevenueEmp: 0,
        totalRevenueEmp: 0,
        parlorName: "",
        parlorAddress: "",
        dep: []
    };
    var appointmentCount = 0;
    var serviceCount = 0;
    var parlorId = employee.parlorId;
    Parlor.findOne({ _id: parlorId }, { name: 1, address2: 1 }, function(err, parlor) {
        if (parlor) {
            data.parlorAddress = parlor.address2;
            data.parlorName = parlor.name;
        }
        Appointment.find({ parlorId: parlorId, "services.employees.employeeId": employee.id, status: 3 }, function(err, appointments) {
            var date = new Date();
            var y = date.getFullYear();

            _.forEach(month, function(m) {
                var dates = { startDate: HelperService.getFirstDateOfMonth(y, m), endDate: HelperService.getLastDateOfMonth(y, m) }

                data.month.push({
                    month: m,
                    serviceNo: 0,
                    totalRevenue: 0,

                });
                _.forEach(appointments, function(app) {
                    if (app.appointmentStartTime.getTime() >= dates.startDate.getTime() && app.appointmentStartTime.getTime() < dates.endDate.getTime()) {

                        _.forEach(app.products, function(prd) {
                            _.forEach(data.month, function(report) {
                                if (report.month == dates.startDate.getMonth()) {
                                    data.totalProductSale += (prd.price * prd.quantity);
                                    if (data.employeeId == prd.employeeId) {
                                        data.totalProductRevenueEmp += (prd.price * prd.quantity);
                                    }
                                }
                            });
                        });

                        _.forEach(app.services, function(ser) {
                            serviceCount++;
                            _.forEach(data.month, function(report) {
                                if (report.month == dates.startDate.getMonth()) {
                                    report.serviceCount += serviceCount;
                                    report.appointmentCount = appointments.length;
                                    report.serviceNo += ser.quantity;
                                    var empObj = [{
                                        employeeId: employee.id,
                                        totalRevenueEmp: 0
                                    }];
                                    var serviceRevenue = Appointment.serviceFunction(app.createdAt, ser, empObj);
                                    report.totalRevenue += serviceRevenue.employees[0].totalRevenueEmp;
                                    data.totalRevenueEmp += serviceRevenue.employees[0].totalRevenueEmp;
                                }
                            })
                        });
                    }
                });

            });
            data.totalRevenueEmp += data.totalProductRevenueEmp;
            data.averageTicektSize += data.totalRevenueEmp / appointmentCount;
            data.averageServiceSize += appointmentCount / serviceCount;
            return callback(err, data);
        })
    })
};


appointmentSchema.statics.employeeIncentiveReport = function(employee, startDate, endDate, callback) {
    var data = {
        employeeId: employee.id,
        phoneNumber : employee.phoneNumber,
        name: employee.firstName + " " + employee.lastName,
        position: employee.position,
        totalRevenueEmp: 0,
        empSalary: employee.salary,
        parlorName: "",
        parlorAddress: "",
        totalAppointments: 0,
        product: {
            productNo: 0,
            productRevenue: 0,
            productIncentive: 0
        },
        totalProductRevenueEmp: 0,
        totalIncentive: 0,
        parlorId: employee.parlorId,
        dep: []
    };
    var parlorId = employee.parlorId;
    Parlor.findOne({ _id: parlorId }, { name: 1, address2: 1, parlorType: 1 }, function(err, parlor) {
        // console.log("name" +parlor.name)
        if (parlor) {
            data.parlorAddress = parlor.address2;
            data.parlorName = parlor.name;

            ServiceCategory.find({}).sort({ sort: 1 }).exec(function(err, categories) {
                _.forEach(categories, function(c) {
                    data.dep.push({
                        unit: c.name,
                        unitId: c.id,
                        serviceNo: 0,
                        totalRevenue: 0,
                        totalIncentive: 0
                    });
                });
                Appointment.find({
                    parlorId: parlorId,
                    "services.employees.employeeId": employee.id,
                    status: 3,
                    appointmentStartTime: { $gte: HelperService.getDayStart(startDate), $lt: HelperService.getDayEnd(endDate) }
                }, function(err, appointments) {
                    Appointment.find({
                        parlorId: parlorId,
                        $where: "this.products.length>0",
                        status: 3,
                        appointmentStartTime: { $gte: HelperService.getDayStart(startDate), $lt: HelperService.getDayEnd(endDate) }
                    }, function(err, productAppoint) {
                        _.forEach(productAppoint, function(prdApp) {
                            _.forEach(prdApp.products, function(prd) {
                                if (prd.employeeId == employee.id) {
                                    // _.forEach(data.product, function (product) {
                                    data.totalProductRevenueEmp += (prd.price * prd.quantity);

                                    data.product.productNo += prd.quantity;
                                    data.product.productRevenue += (prd.price * prd.quantity);

                                    data.product.productIncentive = Appointment.productIncentiveFunction(data.totalProductRevenueEmp);
                                    // });
                                }
                            });
                        })
                        Incentive.find({ parlorId: parlorId }, function(err, incentive) {

                            data.totalAppointments = appointments.length;
                            _.forEach(appointments, function(appointment) {
                                _.forEach(appointment.services, function(ser) {
                                    var category = categories.filter(function(el) {
                                        return el.id == ser.categoryId;
                                    })[0];
                                    _.forEach(data.dep, function(report) {
                                        if (report.unit == category.name) {
                                            report.serviceNo += ser.quantity;
                                            var empObj = [{
                                                employeeId: "" + employee.id,
                                                totalRevenueEmp: 0
                                            }];
                                            var serviceRevenue = Appointment.serviceFunction(appointment.createdAt, ser, empObj);
                                            report.totalRevenue += Math.ceil(serviceRevenue.employees[0].totalRevenueEmp);
                                            data.totalRevenueEmp += Math.ceil(serviceRevenue.employees[0].totalRevenueEmp);
                                            var incentiveRevenue = Appointment.incentiveFunction(incentive, ser, employee, report, parlor.parlorType);
                                            report.totalIncentive = Math.ceil(incentiveRevenue.totalIncentive);

                                        }
                                    })
                                })
                            });

                            data.totalRevenueEmp += Math.ceil(data.totalProductRevenueEmp);
                            // console.log(data)
                            return callback(err, data);
                        })
                    })
                })
            })
        } else {
            return callback(err, data);
        }
    })
};

appointmentSchema.statics.serviceReportForAdmin = function(services, parlors, startDate, endDate, callback) {
    var data = _.map(services, function(service) {
        return {
            serviceName: service.name,
            serviceId: service.id,
            categoryId: service.categoryId,
            gender: service.gender,
            revenue: 0,
            count: 0,
            parlors: _.map(parlors, function(p) {
                return {
                    name: p.name +'-'+p.address2,
                    parlorId: p.id,
                    revenue: 0,
                    count: 0
                };
            })
        }
    });


    // var query = {status : 3};
    // if(startDate)query.appointmentStartTime = { $gte : startDate, $lt : endDate};
    // if(parlors)query = {status : 3 , appointmentStartTime : { $gte : startDate, $lt : endDate} , parlorId:parlors[0]._id}
    // console.log(parlors)
    // console.log(query)
    // console.log(startDate)
    // console.log(endDate)
    // console.log("***********************")
    var parl = []
    _.forEach(parlors, function(p) {
            parl.push(ObjectId(p._id))
        })
        // Appointment.find(query, {services: 1, parlorId : 1 , serviceRevenue:1}).sort({appointmentStartTime: -1}).exec(function(err, appointments){

    Appointment.aggregate([
        { $match: { status: 3, parlorId: { $in: parl }, appointmentStartTime: { $gte: HelperService.getDayStart(startDate), $lt: HelperService.getDayEnd(endDate) } } },
        { $project: { services: 1, parlorId: 1, serviceRevenue: 1, appointmentStartTime: 1, createdAt: 1 } },
        { $sort: { appointmentStartTime: 1 } }
    ]).exec(function(err, appointments) {

        console.log(err)
        console.log(appointments.length)

        _.forEach(appointments, function(appt, key) {

            _.forEach(data, function(d) {
                _.forEach(d.parlors, function(par) {
                    if (par.parlorId + "" == appt.parlorId + "") {
                        _.forEach(appt.services, function(service) {
                            if (service.serviceId + "" == d.serviceId + "") {
                                var serviceRevenue = Appointment.serviceFunction(appt.createdAt, service, []);
                                par.revenue += serviceRevenue.totalRevenue;
                                par.count += service.quantity;
                                d.revenue += serviceRevenue.totalRevenue;
                                d.count += service.quantity;
                            }
                        });
                    }
                });
            });
        });
        return callback(null, data);
    });
};


appointmentSchema.statics.couponCodeListing = function(app, callback) {
    var data = {
        parlorName: app.parlorName,
        parlorAddress: app.parlorAddress,
        couponCode: app.couponCode,
        amount: app.payableAmount,
        clientName: app.client.name,
        clientNumber: app.client.phoneNumber,
        services: [],
        appointmentStartTime: (app.appointmentStartTime).toDateString()
    };
    _.forEach(app.services, function(ser) {
        data.services.push({ service: ser.name })
    });
    return callback(null, data);
};

appointmentSchema.statics.populateDepartmentValue = function(createdAt, reports, categories, services, appointment, tax, employee) {
    _.forEach(appointment.services, function(ser) {
        var found = false;
        _.forEach(services, function(s) {
            // _.forEach(Appointment.parseServiceForReport(appointment.services), function(ser){
            if (s.serviceId + "" == ser.serviceId + "") {
                found = true;
                var category = categories.filter(function(el) {
                    return el.id + "" == s.categoryId + "";
                })[0];
                _.forEach(reports, function(report) {
                    if (report.unit == category.superCategory) {
                        report.service += ser.quantity;
                        // report.membershipCredits += ser.creditsUsed ;
                        report.totalTax += ((ser.subtotal) * ser.tax) / 100;
                        var serviceRevenue = Appointment.serviceFunction(createdAt, ser, employee);
                        report.totalRevenue += serviceRevenue.totalRevenue;
                        report.totalSale += serviceRevenue.totalSale;
                        // report.totalCollection += ((ser.subtotal) * ser.tax )/100 + ser.subtotal;
                    }
                });
            }
        });
        if (!found) {
            console.log("serviceId" , ser.serviceId)
            reports[0].service += ser.quantity;
            reports[0].totalTax += ((ser.subtotal) * ser.tax) / 100;
            var serviceRevenue = Appointment.serviceFunction(createdAt, ser, employee);
            reports[0].totalRevenue += serviceRevenue.totalRevenue;
            reports[0].totalSale += serviceRevenue.totalSale;
        }
    });
};

appointmentSchema.statics.incentiveFunction = function(incentive, ser, empl, report, parlorType) {
    var totalIncentive = 0;
    _.forEach(incentive, function(inc) {
        _.forEach(inc.categories, function(par) {

            if (report.unitId == par.categoryId) {

                _.forEach(par.incentives, function(incentive) {
                    if (report.totalRevenue >= incentive.range) {
                        totalIncentive = report.totalRevenue * (incentive.incentive) / 100;
                        // totalIncentive += incentive.incentive;
                    }
                })
            }

        });
    });

    return { totalIncentive: totalIncentive };
};


appointmentSchema.statics.productIncentiveFunction = function(revenue) {
    var incentive = 0;
    if (revenue == 5000 || revenue < 15000) {
        return incentive = revenue * (5 / 100);
    } else if (revenue == 15000 || revenue < 25000) {
        return incentive = revenue * (10 / 100);
    } else if (revenue > 25000) {
        return incentive = revenue * (15 / 100);
    } else {
        return incentive;
    }
};

appointmentSchema.statics.sendAppNotification = function(firebaseId, title, body, data, notificationId, callback) {
    var FCM = require('fcm-push');
    var serverKey = 'AAAArI-Kg28:APA91bEu8Chz7RTT1yQsoHluOVZd5h16YsGtvfBz_xqLBzxy0vreu6PjaTNovMHoN0PzE0WWbYWUZEvHKU8bEwPYn9qz8ITmR81Gej1T5JIrzRpH8n12QE68Kvb5IBjOHEs7lJ65CQvglsn64qzDFH5Q5QgNDvzflA';
    var fcm = new FCM(serverKey);

    data.title = title;
    data.body = body;
    data.notificationId = notificationId;

    var message = {
        to: firebaseId, // required fill with device token or topics
        collapse_key: 'your_collapse_key',
        data: data
            // notification: {
            //     title: title,
            //     body: body
            // }
    };
    //callback style
    fcm.send(message, function(err, response) {

        if (err) {
            return callback(err, null)
        } else {
            return callback(null, response);
        }
    });
};

appointmentSchema.statics.sendAppNotificationMulti = function(firebaseIds, data, callback) {
    var FCM = require('fcm-push');
    var serverKey = 'AAAArI-Kg28:APA91bEu8Chz7RTT1yQsoHluOVZd5h16YsGtvfBz_xqLBzxy0vreu6PjaTNovMHoN0PzE0WWbYWUZEvHKU8bEwPYn9qz8ITmR81Gej1T5JIrzRpH8n12QE68Kvb5IBjOHEs7lJ65CQvglsn64qzDFH5Q5QgNDvzflA';

    var fcm = new FCM(serverKey);
    var message = {
        registration_ids: firebaseIds, // required fill with device token or topics
        collapse_key: 'your_collapse_key',
        data: data
    };
    fcm.send(message, function(err, response) {
        console.log("android " + err)
        console.log("android " + response)
        if (err) {
            return callback(err, null)
        } else {
            return callback(null, 'SuccessAndroid');
        }
    });
};

appointmentSchema.statics.sendAppNotificationNew = function(id, data, callback) {
    var FCM = require('fcm-push');
    var serverKey = 'AAAArI-Kg28:APA91bEu8Chz7RTT1yQsoHluOVZd5h16YsGtvfBz_xqLBzxy0vreu6PjaTNovMHoN0PzE0WWbYWUZEvHKU8bEwPYn9qz8ITmR81Gej1T5JIrzRpH8n12QE68Kvb5IBjOHEs7lJ65CQvglsn64qzDFH5Q5QgNDvzflA';
    var fcm = new FCM(serverKey);
    var message = {
        to: id, // required fill with device token or topics
        collapse_key: 'your_collapse_key',
        data: data
    };
    fcm.send(message, function(err, response) {
        console.log("android error" + err)
        console.log("android response" + response)
        if (err) {
            return callback(err, null)
        } else {
            return callback(null, 'SuccessAndroid');
        }
    });
};

appointmentSchema.statics.sendAppNotificationIOSMulti = function(ids, data, callback) {
    console.log(data)
    var FCM = require('fcm-push');
    var serverKey = 'AAAArI-Kg28:APA91bEu8Chz7RTT1yQsoHluOVZd5h16YsGtvfBz_xqLBzxy0vreu6PjaTNovMHoN0PzE0WWbYWUZEvHKU8bEwPYn9qz8ITmR81Gej1T5JIrzRpH8n12QE68Kvb5IBjOHEs7lJ65CQvglsn64qzDFH5Q5QgNDvzflA';
    var fcm = new FCM(serverKey);
    var message = {
        registration_ids: id, // required fill with device token or topics
        priority: "high",
        notification: {
            title: data.title,
            body: data.body,
            type: data.type,
            notificationId: data.notificationId,
            sound: "default"
        }
    };
    fcm.send(message, function(err, response) {
        console.log("ios " + err)
        console.log("ios " + response)
        if (err) {
            return callback(err, null)
        } else {
            return callback(null, 'SucessIOS');
        }
    });
};



appointmentSchema.statics.sendAppNotificationIOS = function(firebaseId, title, body, appointmentId, type, notificationId, callback) {
    var FCM = require('fcm-push');
    var serverKey = 'AAAArI-Kg28:APA91bEu8Chz7RTT1yQsoHluOVZd5h16YsGtvfBz_xqLBzxy0vreu6PjaTNovMHoN0PzE0WWbYWUZEvHKU8bEwPYn9qz8ITmR81Gej1T5JIrzRpH8n12QE68Kvb5IBjOHEs7lJ65CQvglsn64qzDFH5Q5QgNDvzflA';
    var fcm = new FCM(serverKey);
    var message = {
        to: firebaseId, // required fill with device token or topics
        // data: data,
        priority: "high",
        notification: {
            title: title,
            body: body,
            type: type,
            appointmentId: appointmentId,
            notificationId: notificationId,
            sound: "default"
        }
    };
    //callback style
    fcm.send(message, function(err, response) {
        console.log("ios error" + err);
        console.log("ios response" + response);
        if (err) {
            return callback(err, null)
        } else {
            return callback(null, response);
        }
    });
};


appointmentSchema.statics.sendAppNotificationCheckIn = function(firebaseId, title, body, type, parlorId, callback) {
    var FCM = require('fcm-push');
    var serverKey = 'AAAArI-Kg28:APA91bEu8Chz7RTT1yQsoHluOVZd5h16YsGtvfBz_xqLBzxy0vreu6PjaTNovMHoN0PzE0WWbYWUZEvHKU8bEwPYn9qz8ITmR81Gej1T5JIrzRpH8n12QE68Kvb5IBjOHEs7lJ65CQvglsn64qzDFH5Q5QgNDvzflA';
    var fcm = new FCM(serverKey);
    var data = {};
    data.title = title;
    data.type = type;
    data.body = body;
    data.parlorId = parlorId;

    var message = {
        to: firebaseId, // required fill with device token or topics
        collapse_key: 'your_collapse_key',
        data: data
            // notification: {
            //     title: title,
            //     body: body
            // }
    };
    //callback style
    fcm.send(message, function(err, response) {

        if (err) {
            return callback(err, null)
        } else {
            return callback(null, response);
        }
    });
};
appointmentSchema.statics.sendAppNotificationIOSCheckIn = function(firebaseId, title, body, type, parlorId, callback) {
    var FCM = require('fcm-push');
    var serverKey = 'AAAArI-Kg28:APA91bEu8Chz7RTT1yQsoHluOVZd5h16YsGtvfBz_xqLBzxy0vreu6PjaTNovMHoN0PzE0WWbYWUZEvHKU8bEwPYn9qz8ITmR81Gej1T5JIrzRpH8n12QE68Kvb5IBjOHEs7lJ65CQvglsn64qzDFH5Q5QgNDvzflA';
    var fcm = new FCM(serverKey);
    var message = {
        to: firebaseId, // required fill with device token or topics
        // data: data,
        priority: "high",
        notification: {
            title: title,
            body: body,
            type: type,
            parlorId: parlorId,
            sound: "default"
        }
    };
    //callback style
    fcm.send(message, function(err, response) {
        console.log(err);
        console.log(response);
        if (err) {
            return callback(err, null)
        } else {
            return callback(null, response);
        }
    });
};



appointmentSchema.statics.sendAppNotificationAdmin = function(id, data, callback) {
    var FCM = require('fcm-push');
    var serverKey = 'AAAArI-Kg28:APA91bEu8Chz7RTT1yQsoHluOVZd5h16YsGtvfBz_xqLBzxy0vreu6PjaTNovMHoN0PzE0WWbYWUZEvHKU8bEwPYn9qz8ITmR81Gej1T5JIrzRpH8n12QE68Kvb5IBjOHEs7lJ65CQvglsn64qzDFH5Q5QgNDvzflA';
    var fcm = new FCM(serverKey);
    var message = {
        registration_ids: id, // required fill with device token or topics
        collapse_key: 'your_collapse_key',
        data: data
    };
    fcm.send(message, function(err, response) {
        console.log("android " + err)
        console.log("android " + response)
        if (err) {
            return callback(err, null)
        } else {
            return callback(null, 'SuccessAndroid');
        }
    });
};

appointmentSchema.statics.sendMirrorNotification = function(id, data, callback) {
    var FCM = require('fcm-push');
    var serverKey = 'AAAARUZ5Ykk:APA91bEM-TbvWizO4S0S95gStllwNONV6X3W_NCiHTpvEgusxAd0C4dCc8eHOI6izN-xhKvgB1AyjW2cjyNX34DAQs8bPq6Ve1Z63gc2wuOt7xOXxE9DGeRJp0OfIecZNE_z1jYSvQmf';
    var fcm = new FCM(serverKey);
    var message = {
        registration_ids: id, // required fill with device token or topics
        collapse_key: 'your_collapse_key',
        data: data
    };
    fcm.send(message, function(err, response) {
        console.log("android " + err)
        console.log("android " + response)
        if (err) {
            return callback(err, null)
        } else {
            return callback(null, 'SuccessAndroid');
        }
    });
};


appointmentSchema.statics.sendAppNotificationIOSAdmin = function(id, data, callback) {
    console.log(data)
    var FCM = require('fcm-push');
    var serverKey = 'AAAArI-Kg28:APA91bEu8Chz7RTT1yQsoHluOVZd5h16YsGtvfBz_xqLBzxy0vreu6PjaTNovMHoN0PzE0WWbYWUZEvHKU8bEwPYn9qz8ITmR81Gej1T5JIrzRpH8n12QE68Kvb5IBjOHEs7lJ65CQvglsn64qzDFH5Q5QgNDvzflA';
    var fcm = new FCM(serverKey);
    var message = {
        registration_ids: id, // required fill with device token or topics
        priority: "high",
        notification: {
            title: data.title,
            body: data.body,
            type: data.type,
            notificationId: data.notificationId,
            sound: "default"
        }
    };
    fcm.send(message, function(err, response) {
        console.log("ios " + err)
        console.log("ios " + response)
        if (err) {
            return callback(err, null)
        } else {
            return callback(null, 'SucessIOS');
        }
    });
};


appointmentSchema.statics.serviceFunction = function(createdAt, service, employee) {
    if (new Date(createdAt) > new Date(2017, 9, 7, 0, 0, 0)) {
        var totalRevenue = 0,
            totalSale = 0,
            totalCount = 0,
            serviceLoyalityRevenue = service.loyalityPoints * 0.5;
    } else {
        var totalRevenue = 0,
            totalSale = 0,
            totalCount = 0,
            serviceLoyalityRevenue = service.loyalityPoints * 0.75;
    }
    if (service.discountMedium == "frequency" && !service.frequencyDiscountUsed) {
        totalRevenue += 0;
        // totalSale += (service.price+service.additions)*service.quantity  - service.discount;
        totalSale += (service.price) * service.quantity;
    } else if (service.discountMedium == "frequency" && service.frequencyDiscountUsed) {
        // totalRevenue += ((service.price + service.additions)*service.quantity - (service.membershipDiscount ? service.membershipDiscount : 0));
        totalRevenue += ((service.price) * service.quantity - (service.membershipDiscount ? service.membershipDiscount : 0));
        // totalSale += (service.price + service.additions)*service.quantity;
        totalSale += (service.price) * service.quantity;
        if (service.loyalityPoints) {
            if (new Date(createdAt) > new Date(2017, 9, 7, 0, 0, 0)) {
                totalRevenue -= service.price * 0.5;
                totalSale -= service.loyalityPoints * 0.5;
            } else {
                totalRevenue -= service.price * 0.75;
                totalSale -= service.loyalityPoints * 0.75;
            }

        }
    } else {
        if (0) {
            // totalRevenue += (service.price - service.discount +service.additions)*service.quantity;
            totalRevenue += (service.price - service.discount) * service.quantity;
            // totalSale += (service.price - service.discount + service.additions)*service.quantity;
            totalSale += (service.price - service.discount) * service.quantity;
        } else {
            totalRevenue += (service.price) * service.quantity;
            // totalRevenue += (service.price + service.additions)*service.quantity;
            totalSale += (service.price) * service.quantity;
            // totalSale += (service.price + service.additions)*service.quantity;
        }
        if (service.membershipDiscount) {
            totalRevenue -= service.membershipDiscount;
            totalSale -= service.membershipDiscount;
        }
        if (service.loyalityPoints) {
            if (new Date(createdAt) > new Date(2017, 9, 7, 0, 0, 0)) {
                totalRevenue -= service.loyalityPoints * 0.5;
                totalSale -= service.loyalityPoints * 0.5;
            } else {
                totalRevenue -= service.loyalityPoints * 0.25;
                totalSale -= service.loyalityPoints * 0.25;
            }
        }
    }
    service.employees.forEach(function(emp) {
        
        for (var i = 0; i < employee.length; i++) {
            if (employee[i].employeeId == emp.employeeId) {
                if (service.discountMedium == "frequency" && !service.frequencyDiscountUsed) {
                    employee[i].totalRevenueEmp += 0;
                } else if (service.discountMedium == "frequency" && service.frequencyDiscountUsed) {
                    employee[i].totalRevenueEmp += (((service.price + service.additions) * service.quantity - (service.membershipDiscount ? service.membershipDiscount : 0)) * (emp.distribution / 100));
                } else {
                    if (0) {
                        employee[i].totalRevenueEmp += ((service.price - service.discount + service.additions) * service.quantity) * (emp.distribution / 100);
                    } else {
                        employee[i].totalRevenueEmp += ((service.price + service.additions) * service.quantity) * (emp.distribution / 100);
                    }
                    if (service.membershipDiscount) {
                        employee[i].totalRevenueEmp -= service.membershipDiscount;
                    }
                }
            }
        }
    });
    return { totalRevenue: totalRevenue, totalSale: totalSale, employees: employee, serviceLoyalityRevenue: serviceLoyalityRevenue };
};


appointmentSchema.statics.sendSMS = function(url, callback) {
    console.log("urllllll", url)
        /*    var http = require("http"), response;
           http.get(url, function(res2) {
                  res2.on("data", function(chunk) {
                      response = chunk;
                  });
                  res2.on("end", function() {
                        return callback(true);
                  });
                  }).on('error', function(e) {
                      return callback(false);
                  });*/
    var request = require("request");
    request({
        uri: url,
        method: "GET",
        timeout: 7000,
        followRedirect: true,
        maxRedirects: 1
    }, function(error, response, body) {
        if (error)
            return callback(false);
        else return callback(true);
    });
}


appointmentSchema.statics.employeeAttendance = function(req, callback) {
    var data = {
        date: req.body.date,
        parlorName: "",
        openingTime: "",
        closingTime: "",
        shifts: []
    };
    var emp = req.body.employeeId;
    Attendance.find({ employeeId: { $regex: emp }, time: { $gte: HelperService.getDayStart(req.body.date), $lt: HelperService.getDayEnd(req.body.date) } }).exec(function(err, attendance) {
        Admin.findOne({ _id: emp }, { parlorId: 1 }, function(err, admin) {
            Parlor.findOne({ _id: admin.parlorId }, { openingTime: 1, closingTime: 1, name: 1, address2: 1 }, function(err, parlor) {
                data.parlorName += parlor.name + "-" + parlor.address2;
                data.openingTime += parlor.openingTime;
                data.closingTime += parlor.closingTime;
                var obj = {};
                if (attendance.length > 0) {
                    for (var i = 0; i < attendance.length; i++) {
                        if (i == 0) {
                            obj = { "from": attendance[i].time };
                            data.shifts.push(obj);
                        } else if ([i + 1] <= attendance.length) {
                            obj = { "to": attendance[i].time };
                            data.shifts.push(obj);
                        }
                    }
                } else {
                    obj = { "from": attendance.time };
                    data.shifts.push(obj);
                }
                return callback(err, data);
            })

        })
    })
};

appointmentSchema.statics.collectionReport = function(query, req, callback) {
    var query1 = { status: 3, parlorId: query._id };
    if (req.body.startDate) query1.appointmentStartTime = { $gte: req.body.startDate, $lt: req.body.endDate };
    var query2 = { parlorId: query._id };
    if (req.body.startDate) query2.createdAt = { $gte: req.body.startDate, $lt: req.body.endDate };
    Appointment.find(query1).sort({ appointmentStartTime: -1 }).exec(function(err, data) {
        MembershipSale.find(query2).exec(function(err2, ms) {
                ActiveMembership.find({
                    'history.0.parlorId': query._id,
                    'history.0.appointmentDate': { $gte: req.body.startDate, $lt: req.body.endDate }
                }, function(err, mSales) {
                    console.log(mSales)
                    Advance.find(query2).exec(function(err, advance) {
                        var appointments = [],
                            noOfAppointments = 0,
                            totalCollection = 0,
                            totalMemberships = 0,
                            totalAdvance = 0,
                            advanceUsed = 0,
                            membershipUsed = 0,
                            walletSoldBySalon = 0,
                            walletSoldByBeu = 0,
                            totalLoyaltyPoints = 0,
                            loyaltyUsed = 0,
                            cardPayment = 0,
                            cashPayment = 0,
                            totalOthers = 0,
                            totalProducts = 0,
                            totalRedemption = 0,
                            beU = 0,
                            amex = 0,
                            affiliates = 0;
                        var previousDate = null;
                        _.forEach(data, function(d) {
                            if (!HelperService.compareTodayDate(previousDate, d.appointmentStartTime) && noOfAppointments > 0) {

                                _.forEach(advance, function(adv) {
                                    if (HelperService.compareTodayDate(previousDate, adv.createdAt)) {
                                        totalAdvance += adv.amount;
                                        if (adv.allPaymentMethods.length > 0) {
                                            _.forEach(adv.allPaymentMethods, function(advn) {
                                                if (advn.value == 1) cashPayment += advn.amount;
                                                else cardPayment += advn.amount;
                                            })
                                        } else cashPayment += adv.amount;
                                    }
                                });
                                _.forEach(ms, function(m) {
                                    if (HelperService.compareTodayDate(previousDate, m.createdAt) && noOfAppointments > 0) {
                                        if(m.taxIncluded == true){
                                            membershipUsed = Math.ceil(membershipUsed*1.18);
                                        }
                                        totalMemberships += m.price;
                                        walletSoldBySalon += m.price * 1.18;
                                        // totalCollection += m.price;
                                        _.forEach(m.paymentMethods, function(method) {
                                            if (method.value == 1)
                                                cashPayment += method.amount;
                                            else
                                                cardPayment += method.amount;
                                        })
                                    }
                                });
                                _.forEach(mSales, function(adv) {
                                    if (HelperService.compareTodayDate(previousDate, adv.history[0].appointmentDate)) {
                                        if (adv.paymentMethods[0].value == 10) {
                                            walletSoldByBeu += adv.price;
                                            totalMemberships += adv.price;
                                        } else {
                                            walletSoldBySalon += adv.price;
                                            totalMemberships += adv.price;
                                        }
                                    }
                                });
                                console.log(totalMemberships * 1.18, totalAdvance, totalCollection, totalOthers)
                                appointments.push({
                                    date: previousDate,
                                    noOfAppointments: noOfAppointments,
                                    totalCollection: totalMemberships + totalAdvance + totalCollection - totalOthers,
                                    serviceCollection: totalCollection - totalProducts - totalOthers,
                                    productCollection: totalProducts,
                                    totalMemberships: totalMemberships,
                                    totalAdvance: totalAdvance,
                                    advanceUsed: advanceUsed,
                                    membershipUsed: membershipUsed,
                                    totalLoyaltyPoints: totalLoyaltyPoints,
                                    loyaltyUsed: loyaltyUsed,
                                    cardPayment: cardPayment,
                                    cashPayment: cashPayment,
                                    totalProducts: totalProducts,
                                    totalRedemption: totalRedemption,
                                    beU: beU + walletSoldByBeu,
                                    amex: amex,
                                    affiliates: affiliates,
                                    walletSoldBySalon: walletSoldBySalon,
                                    walletSoldByBeu: walletSoldByBeu
                                });
                                noOfAppointments = 0;
                                totalCollection = 0;
                                totalMemberships = 0;
                                totalAdvance = 0;
                                advanceUsed = 0;
                                membershipUsed = 0;
                                totalLoyaltyPoints = 0;
                                loyaltyUsed = 0;
                                cardPayment = 0;
                                cashPayment = 0;
                                totalProducts = 0;
                                totalRedemption = 0;
                                beU = 0;
                                amex = 0;
                                affiliates = 0;
                                totalOthers = 0;
                                walletSoldBySalon = 0;
                                walletSoldByBeu = 0;
                            }
                            noOfAppointments++;
                            totalCollection += d.payableAmount;
                            totalLoyaltyPoints += parseInt(d.loyalityPoints);
                            previousDate = d.appointmentStartTime;
                            if (d.creditUsed != undefined) {
                                membershipUsed += d.creditUsed;
                                totalRedemption += d.creditUsed;
                            }
                            if (d.useAdvanceCredits) {
                                advanceUsed += d.advanceCredits;
                                totalRedemption += d.advanceCredits;
                            }
                            if (d.allPaymentMethods.length > 0) {
                                _.forEach(d.allPaymentMethods, function(pay) {
                                    if (pay.value == 1) {
                                        console.log("pay.amount", pay.amount)
                                        cashPayment += pay.amount;
                                    } else if (pay.value == 2)
                                        cardPayment += pay.amount;
                                    else if (pay.value == 10 || pay.value == 5)
                                        beU += pay.amount;
                                    else if (pay.value == 8) {
                                        amex += pay.amount;
                                    } else if (pay.value == 11 || pay.value == 13) {
                                        affiliates += pay.amount;
                                    } else if (pay.value == 4) {
                                        advanceUsed += pay.amount;
                                        totalRedemption += pay.amount;
                                    } else {
                                        totalOthers += pay.amount;
                                    }
                                });
                            } else {
                                if (d.paymentMethod == 1) cashPayment += d.payableAmount;
                                else if (d.paymentMethod == 2) cardPayment += d.payableAmount;
                                else if (d.paymentMethod == 10 || d.paymentMethod == 5 || d.paymentMethod == 11) beU += d.payableAmount;
                                else if (d.paymentMethod == 8) amex += d.payableAmount;
                                else if (d.paymentMethod == 3 || d.paymentMethod == 4) {
                                    advanceUsed += d.payableAmount;
                                    totalRedemption += d.payableAmount;
                                } else {
                                    totalOthers += d.payableAmount;
                                }
                            }
                            _.forEach(d.products, function(product) {
                                totalProducts += product.price + product.tax;
                            });
                            d.services.forEach(function(service) {
                                if (service.loyalityPoints) {
                                    loyaltyUsed += (service.loyalityPoints * 0.5);
                                    totalRedemption += (service.loyalityPoints * 0.5);
                                }
                            });

                        });
                        totalCollection += totalMemberships * 1.18 + totalAdvance;
                        _.forEach(advance, function(adv) {
                            if (HelperService.compareTodayDate(previousDate, adv.createdAt)) {
                                totalAdvance += adv.amount;
                                if (adv.allPaymentMethods.length > 0) {
                                    _.forEach(adv.allPaymentMethods, function(advn) {
                                        if (advn.value == 1) cashPayment += advn.amount;
                                        else cardPayment += advn.amount;
                                    })
                                } else cashPayment += adv.amount;
                            }
                        });

                        _.forEach(ms, function(m) {
                            if (HelperService.compareTodayDate(previousDate, m.createdAt) && noOfAppointments > 0) {

                                totalMemberships += (m.price);
                                _.forEach(m.paymentMethods, function(method) {
                                    if (method.value == 1)
                                        cashPayment += method.amount;
                                    else
                                        cardPayment += method.amount;
                                })
                            }
                        });
                        _.forEach(mSales, function(adv) {
                            if (HelperService.compareTodayDate(previousDate, adv.history[0].appointmentDate)) {
                                if (adv.paymentMethods[0].value == 10) {
                                    walletSoldByBeu += adv.price;
                                    totalMemberships += adv.price;
                                } else {
                                    walletSoldBySalon += adv.price;
                                    totalMemberships += adv.price;
                                }
                            }
                        });
                        console.log(totalOthers);

                        appointments.push({
                            date: previousDate,
                            noOfAppointments: noOfAppointments,
                            totalCollection: totalMemberships * 1.18 + totalAdvance + totalCollection - totalOthers,
                            serviceCollection: totalCollection - (totalProducts) - totalOthers,
                            productCollection: totalProducts,
                            totalMemberships: totalMemberships * 1.18,
                            totalAdvance: totalAdvance,
                            totalOthers: totalOthers,
                            advanceUsed: advanceUsed,
                            membershipUsed: membershipUsed,
                            totalLoyaltyPoints: totalLoyaltyPoints,
                            loyaltyUsed: loyaltyUsed,
                            cardPayment: cardPayment,
                            cashPayment: cashPayment,
                            totalProducts: totalProducts,
                            totalRedemption: totalRedemption,
                            beU: beU + walletSoldByBeu,
                            amex: amex,
                            affiliates: affiliates,
                            walletSoldBySalon: walletSoldBySalon,
                            walletSoldByBeu: walletSoldByBeu,
                            data: data
                        });
                        return callback(err, appointments);
                    });
                })

        })
    });
};


appointmentSchema.statics.parseServiceForReport = function(services) {
    return _.map(services, function(s) {
        var revenue = getRevenueSubtotal(s.subtotal, s.type, s.frequencyPrice, s.quantity);
        return {
            id: s.id,
            categoryId: s.categoryId,
            serviceId: s.serviceId,
            name: s.name,
            type: s.type,
            quantity: s.quantity,
            additions: s.additions,
            typeIndex: s.typeIndex,
            creditsUsed: s.creditsUsed,
            employees: s.employees,
            employeeId: s.employeeId,
            estimatedTime: s.estimatedTime,
            price: s.price,
            subtotal: revenue.subtotal,
            additionIndex: s.additionIndex,
            tax: revenue.tax,
            dealId: s.dealId,
            frequencyDealFreeService: s.frequencyDealFreeService,
            frequencyPrice: s.frequencyPrice,
            dealPriceUsed: s.dealPriceUsed,
            actualPrice: s.actualPrice
        };
    })
};

function getRevenueSubtotal(subtotal, type, frequencyPrice, quantity) {
    var revenue = 0;
    if (type == 'frequency') {
        if (subtotal == 0) revenue = frequencyPrice * quantity;
        else revenue = 0;
    } else revenue = subtotal;
    tax = parseInt((revenue * 15) / 100);
    return { revenue: revenue, tax: tax };
}

appointmentSchema.statics.employeeReport = function(query, req, callback) {
    var query1 = { status: 3, parlorId: query._id };
    if (req.body.startDate) query1.appointmentStartTime = { $gte: req.body.startDate, $lt: req.body.endDate };
    if (req.body.clientIds) query1.clientId = req.body.clientId;
    Parlor.findOne({ _id: query._id }, function(err, parlor) {
        var dailyParlorHour = parlor.dailyParlorHour ? parlor.dailyParlorHour : 0;
        Admin.find({ parlorId: query._id, active: true }, function(err, employees) {
            var data = [];
            _.forEach(employees, function(e) {
                if (!e.breakHr) e.breakHr = 0;
                data.push({
                    employeeId: e.id,
                    name: e.firstName + " " + e.lastName,
                    appointments: 0,
                    totalCustomers: 0,
                    customers: [],
                    returningCustomers: 0,
                    totalRevenue: 0,
                    employeeCommission: 0,
                    leaves: 0,
                    unproductiveHours: (HelperService.getDaysBetweenTwoDates(new Date(req.body.startDate), new Date(req.body.endDate)) * (dailyParlorHour - e.breakHr)) * 60,
                });
            });
            Appointment.find(query1).sort({ appointmentStartTime: -1 }).exec(function(err, appointments) {
                _.forEach(appointments, function(appointment) {
                    _.forEach(appointment.employees, function(emp) {
                        Appointment.populateEmployeeForReport(appointment.createdAt, appointment.client.id, emp, data, appointment.services);
                    });
                    _.forEach(appointment.products, function(prd) {
                        for (var i = 0; i < data.length; i++) {
                            if (prd.employeeId == data[i].employeeId) {
                                data[i].totalRevenue += (prd.price * prd.quantity);

                            }
                        }
                    })
                });
                return callback(err, data);
            });
        });
    });
};

appointmentSchema.statics.populateEmployeeForReport = function(createdAt, clientId, emp, data, services) {
    _.forEach(data, function(r) {
        if (emp.employeeId == r.employeeId) {
            var result = _.some(r.customers, function(c) {
                return c + "" == clientId + "";
            });
            if (result) r.returningCustomers++;
            else {
                r.customers.push(clientId);
                r.totalCustomers++;
            }
            r.appointments++;
            _.forEach(services, function(s) {
                var empObj = [{
                    employeeId: "" + emp.employeeId,
                    totalRevenueEmp: 0
                }];
                var serviceRevenue = Appointment.serviceFunction(createdAt, s, empObj);
                r.totalRevenue += serviceRevenue.employees[0].totalRevenueEmp;

                // console.log("service" , s.price , s.serviceCode , r.totalRevenue ,r.employeeId)
            });
            // r.totalRevenue += emp.revenue;
            r.employeeCommission += emp.commission;
            r.unproductiveHours -= emp.estimatedTime;


        }
    });
};

appointmentSchema.statics.revenueReport = function(query, req, callback) {
    var query1 = { status: 3, parlorId: query._id };
    if (req.body.startDate) query1.appointmentStartTime = { $gt: req.body.startDate, $lt: req.body.endDate };
    if (req.body.clientIds) query1.clientId = req.body.clientId;
    var query2 = { parlorId: query._id };
    var employeeIds = req.body.employees ? req.body.employees : [];
    if (req.body.startDate) query2.createdAt = { $gt: req.body.startDate, $lt: req.body.endDate };
    Appointment.find(query1).sort({ appointmentStartTime: -1 }).exec(function(err, data) {
        // console.log(data)
        MembershipSale.find(query2).exec(function(err2, ms) {
            var appointments = [],
                noOfAppointments = 0,
                totalRevenue = 0,
                totalServices = 0,
                totalProducts = 0,
                totalTax = 0,
                totalDeals = 0,
                totalMemberships = 0,
                totalLoyalityPoints = 0;
            var previousDate = null;
            _.forEach(data, function(d) {
                if (Appointment.empPresent(employeeIds, d.employees) || Appointment.empPresentInProducts(employeeIds, d.products)) {
                    if (!HelperService.compareTodayDate(previousDate, d.appointmentStartTime) && noOfAppointments > 0) {
                        appointments.push({
                            date: previousDate,
                            noOfAppointments: noOfAppointments,
                            totalRevenue: totalRevenue,
                            totalServices: totalServices,
                            totalProducts: totalProducts,
                            totalTax: totalTax,
                            totalDeals: totalDeals,
                            totalMemberships: totalMemberships,
                            totalLoyalityPoints: totalLoyalityPoints
                        });
                        noOfAppointments = 0;
                        totalRevenue = 0;
                        totalServices = 0;
                        totalProducts = 0;
                        totalTax = 0;
                        totalMemberships = 0;
                        totalDeals = 0;
                        totalLoyalityPoints = 0;
                    }
                    noOfAppointments++;
                    _.forEach(d.services, function(ser) {
                        var empRevenue = 0;
                        var serviceRevenue = Appointment.serviceFunction(d.createdAt, ser, Appointment.getEmployeeList(employeeIds));
                        _.forEach(serviceRevenue.employees, function(e) {
                            if (e.totalRevenueEmp) {
                                empRevenue += e.totalRevenueEmp;
                            }
                        });
                        totalRevenue += empRevenue;
                        totalServices += empRevenue;
                    });
                    totalTax += d.tax;
                    totalLoyalityPoints += parseInt(d.loyalityPoints);
                    _.forEach(d.products, function(product) {
                        if (_.filter(employeeIds, function(e) { return e + "" == product.employeeId + ""; })[0]) {
                            totalProducts += (product.price * product.quantity);
                            totalRevenue += (product.price * product.quantity);
                        }
                    });
                    previousDate = d.appointmentStartTime;
                    _.forEach(ms, function(m) {
                        if (!HelperService.compareTodayDate(previousDate, m.createdAt) && noOfAppointments > 0) {
                            totalMemberships += m.price;
                        }
                    });
                }

            });
            appointments.push({
                date: previousDate,
                noOfAppointments: noOfAppointments,
                totalRevenue: totalRevenue,
                totalServices: totalServices,
                totalProducts: totalProducts,
                totalTax: totalTax,
                totalMemberships: totalMemberships,
                totalLoyalityPoints: totalLoyalityPoints,
                totalDeals: totalDeals,
                data: data
            });
            return callback(err, appointments);
        });
    });
};


appointmentSchema.statics.dayWiseAdminReport = function(parlors, date, callback) {
    var data = {
        totalAppointments: 0,
        totalRevenue: 0
    };
    data.parlorName = parlors.name;
    data.parlorAddress = parlors.address2;
    Appointment.find({
        parlorId: parlors._id,
        appointmentStartTime: { $gte: HelperService.getDayStart(date.startDate), $lt: HelperService.getDayEnd(date.endDate) },
        status: 3
    }).exec(function(err, appoint) {
        data.totalAppointments = appoint.length;
        _.forEach(appoint, function(app) {
            _.forEach(app.services, function(s) {
                var servicer = Appointment.serviceFunction(app.createdAt, s, []);
                data.totalRevenue += servicer.totalRevenue;
            });
            _.forEach(app.products, function(prd) {
                data.totalRevenue += (prd.price * prd.quantity)
            });
        })
        console.log(data)
        return callback(err, data);
    })
};


appointmentSchema.statics.timeWiseAdminReport = function() {

};

appointmentSchema.statics.serviceRepetitionReport = function() {

};

appointmentSchema.statics.employeeRepetitionReport = function() {

};

appointmentSchema.statics.getEmployeeList = function(empIds) {
    var d = [];
    _.forEach(empIds, function(e) {
        d.push({ employeeId: e, totalRevenueEmp: 0 });
    });
    return d;
};

appointmentSchema.statics.empPresent = function(empIds, empPre) {
    var present = false;
    _.forEach(empIds, function(e) {
        _.forEach(empPre, function(emp) {
            if (emp.employeeId == e) present = true;
        });
    });
    return present;
};

appointmentSchema.statics.empPresentInProducts = function(empIds, products) {
    var present = false;
    _.forEach(empIds, function(e) {
        _.forEach(products, function(product) {
            if (product.employeeId == e) present = true;
        });
    });
    return present;
};

appointmentSchema.statics.checkMembership = function(req, callback) {
    Appointment.checkCoupon(req, function(err, couponResponse) {
        User.getActiveMembership(req.body.data.user.phoneNumber, function(user) {
            var originalServices = [],
                services = [],
                subtotal = 0;
            Deals.getActiveDeals(req.session.parlorId, req.body.data.appointmentTime, function(deals) {
                Parlor.findOne({ _id: req.session.parlorId }, function(err, parlor) {
                    originalServices = parlor.services;
                    _.forEach(req.body.data.services, function(service) {
                        if (service.type != "combo") {
                            _.forEach(originalServices, function(pService) {
                                    if (service.code == pService.serviceCode) {
                                        let oService = pService.prices[0];
                                        var subtotal = oService.price * service.quantity;
                                        var type = 'service';
                                        subtotal += service.additions ? service.additions * service.quantity : 0;
                                        if (service.type != "service") {
                                            var d = _.filter(deals, function(d) { return d.id + "" == service.serviceId + ""; });
                                            if (d.length > 0) {
                                                var dealService = d[0];
                                                var newSubtotal = service.type != "chooseOnePer" ? dealService.dealType.price * service.quantity : (subtotal * dealService.dealType.price) / 100;
                                                if (service.type == "frequency") {
                                                    newSubtotal = dealService.dealType.frequencyRequired * oService.price;
                                                    newSubtotal += service.additions ? service.additions * service.quantity : 0;
                                                }
                                                subtotal = newSubtotal;
                                                type = 'deal';
                                            }
                                        }
                                        services.push({
                                            categoryId: pService.categoryId,
                                            tax: oService.tax,
                                            subtotal: subtotal,
                                            loyalityPoints: 0,
                                            type: type
                                        });
                                    }
                            });
                        } else {
                            var dealComb = _.filter(deals, function(d) { return d.id + "" == service.serviceId; });
                            if (dealComb.length > 0) {
                                var dealCombo = dealComb[0];
                                _.forEach(dealCombo.services, function(ser) {
                                    _.forEach(originalServices, function(pService) {
                                        if (pService.serviceCode == ser.serviceCode) {
                                            var oService = pService.prices[0];
                                            services.push({
                                                categoryId: pService.categoryId,
                                                serviceId: pService.serviceId,
                                                tax: oService.tax,
                                                loyalityPoints: 0,
                                                subtotal: dealCombo.dealType.price / dealCombo.services.length,
                                            });
                                        }
                                    });
                                });
                            }
                        }
                    });
                    var active = User.compressMembership2(user.activeMembership);
                    user.membership = active;

                    user.membership = _.filter(user.membership, function(m) {
                        return m.membershipId+"" == req.body.data.user.membershipId;
                    }); 
                    console.log(active);
                    console.log("active");
                    return callback(null, User.getMembershipDiscount(user.membership.length > 0 ? user.membership[0].creditsLeft : 0, user.membership, services, [], true, user.loyalityPoints, req.body.data.useLoyalityPoints, parlor.tax));
                });
            });
        });
    });
};



appointmentSchema.statics.checkCoupon = function(req, callback) {
    Parlor.findOne({ _id: req.session.parlorId }, function(err, parlor) {
        Deals.getActiveDeals(req.session.parlorId, req.body.data.appointmentTime, function(deals) {
            console.log("coupon code", req.body.data.couponCode);
            Offer.findOne({ code: req.body.data.couponCode, startDate: { $lt: new Date() }, active: true, endDate: { $gt: new Date() } }, function(err, c) {
                console.log(c);
                if (c) {
                    var date = new Date();
                    var day = date.getDay();
                    var parlorDealId = 0;
                    /* var result = _.some(c.validDays, function (d) {
                         console.log(d);
                         console.log(day);
                         return d === day;
                     });*/
                    var result = 1;
                    if (result) {
                        var services = req.body.data.services,
                            total = 0;
                        _.forEach(services, function(s) {
                            console.log(s.serviceId);
                            // s.serviceId = "5c2e0a05f6cdd27c0cdf1540";
                            if (s.type != "combo") {
                                parlor.services.forEach(function(parlorServices) {
                                    // _.forEach(parlorServices.prices, function(ser) {
                                        if (s.serviceCode == parlorServices.serviceCode) {
                                            console.log("here");
                                            s.newServiceId = parlorServices.serviceId;
                                            var subtotal = parlorServices.prices[0].price * s.quantity;
                                            subtotal += s.additions * s.quantity || 0;
                                            if (s.type != "service") {
                                                console.log("s.serviceId", s.serviceId)
                                                var d = _.filter(deals, function(de) { return de.id + "" == s.serviceId; });

                                                if (d.length > 0) {
                                                    console.log("d.length")
                                                    s.parlorDealId = d[0].dealId
                                                    var dealService = d[0];
                                                    var newSubtotal = s.type != "chooseOnePer" ? dealService.dealType.price * s.quantity : (subtotal * dealService.dealType.price) / 100;
                                                    if (s.type == "frequency") {
                                                        newSubtotal = dealService.dealType.frequencyRequired * parlorServices.prices[0].price;
                                                        newSubtotal += s.additions ? s.additions * s.quantity : 0;
                                                    }
                                                    subtotal = newSubtotal;
                                                    console.log(subtotal);
                                                    console.log("-----------------------------------");
                                                }
                                            }

                                            total += subtotal;
                                        }
                                    // });
                                });
                            } else {
                                var dealComb = _.filter(deals, function(d) { return d.id + "" == s.serviceId; });
                                if (dealComb.length > 0) {
                                    var dealCombo = dealComb[0];
                                    // parlorDealId = dealCombo.dealId;
                                    total += (s.quantity * dealCombo.dealType.price);
                                }

                            }
                        });
                        if (total >= c.minAmountReq) {
                            var message = "Coupon applied Successfully, ",
                                discount = 0,
                                cashback = 0;
                            var discountServices = [];
                            if (c.offerType == "fixed") {
                                if (c.offerMethod == "cash") {
                                    discount = c.discountAmount;
                                    message += "Discount of Rs " + discount + " applied";
                                } else {
                                    cashback = c.discountAmount;
                                    message += "Loyalty Points of worth " + cashback + " will be credited in your account after appointment.";

                                }
                            } else if (c.offerType == "percentage") {
                                if (c.offerMethod == "cash") {
                                    discount = (c.discountAmount * total) / 100;
                                    message += "Discount of Rs " + discount + " applied";
                                } else {
                                    cashback = (c.discountAmount * total) / 100;
                                    message += "Loyalty Points of worth " + cashback + " will be credited in your account after appointment.";
                                }
                            } else if (c.offerType == "groupon") {
                                console.log(services[0].parlorDealId)
                                if (isNaN(services[0].parlorDealId)) {
                                    services[0].parlorDealId = _.filter(deals, function(d) { return d._id + "" == services[0].dealId })[0].dealId;
                                }
                                var present = _.filter(services, function(s) { return s.parlorDealId + "" == c.dealId + ""; })[0];
                                // var present = parlorDealId == c.dealId ? true : false;
                                if (present) {
                                    console.log("inside present");
                                    if (c.parlorType == 1 && parlor.parlorType != 1) {
                                        console.log("first if");
                                        return callback(true, { discount: discount, cashback: cashback, message: 'Invalid coupon', discountServices: [] });
                                    } else if (c.parlorType == 2 && parlor.parlorType != 2) {
                                        console.log("second if");
                                        return callback(true, { discount: discount, cashback: cashback, message: 'Invalid coupon', discountServices: [] });
                                    } else {
                                        // var s = _.forEach(present[0].services, function(f){ })
                                        discount = c.discountAmount;
                                        discountServices.push({ serviceId: present.newServiceId, amount: c.discountAmount, discountMedium: 'groupon' });
                                        message += "Discount of Rs " + discount + "applied";
                                    }

                                } else {
                                    return callback(true, { discount: discount, cashback: cashback, message: 'Invalid coupon', discountServices: [] });
                                }
                            }
                            return callback(true, { discount: discount, cashback: cashback, message: message, discountServices: discountServices });
                        } else {
                            return callback(true, { discount: 0, cashback: 0, message: 'Offer not valid on this amount. Minimum amount shoulb be Rs' + c.minAmountReq, discountServices: [] });
                        }
                    } else {
                        return callback(true, { discount: 0, cashback: 0, message: 'Invalid Day, offer not valid on this day', discountServices: [] });
                    }

                } else {
                    console.log(deals)
                    return callback(true, { discount: 0, cashback: 0, message: 'Invalid Coupon', discountServices: [] });
                }
            });
        });
    });
};


appointmentSchema.statics.addMainEmployee = function(employees, emp, revenue, estimatedTime) {
        var present = false;
        _.forEach(employees, function(e) {
            if (e.employeeId == emp.employeeId) {
                present = true;
                e.revenue += revenue;
                e.estimatedTime += estimatedTime;
            }
        });
        if (!present) {
            employees.push({
                employeeId: emp.employeeId,
                name: emp.name,
                estimatedTime: estimatedTime,
                commission: 0,
                revenue: revenue,
            });
        }
    },


    appointmentSchema.statics.addEmployeeToAppointmentServiceFromBillingApp = function(appointmentId, parlorId, services, callback) {
        console.log(appointmentId);
        console.log("appointmentId");
        var employees1 = [];
        Admin.find({ parlorId: parlorId, active: true }, { firstName: 1 }, function(err, employees) {
            Appointment.findOne({ _id: appointmentId }, { services: 1, paymentMethod: 1, payableAmount: 1 }, function(err, appt) {
                _.forEach(appt.services, function(s) {
                    _.forEach(services, function(service) {
                        if (s.serviceCode == service.serviceCode && s.type == service.type) {
                            service.employee1 = [];
                            _.forEach(service.employees, function(semp){
                            var e = _.filter(employees, function(el) { return el.id + "" == semp.employeeId })[0];
                                service.employee1.push({ userId: e.id, name: e.firstName, dist: semp.dist });
                            })
                            s.employees = getEmployeeData(employees1, s, service.employee1);
                        }else if(service.type == "newCombo" && s.type == "newCombo" && service.serviceId == s.originalDealId + ""){
                            _.forEach(service.services, function(ser){
                                if(ser.serviceCode == s.serviceCode){
                                    service.employee1 = [];
                                    _.forEach(ser.employees, function(semp){
                                        var e = _.filter(employees, function(el) { return el.id + "" == semp.employeeId })[0];
                                        service.employee1.push({ userId: e.id, name: e.firstName, dist: semp.dist });
                                    })
                                    
                                    s.employees = getEmployeeData(employees1, s, service.employee1);
                                }
                            });
                        }
                    });
                });


                Appointment.update({ _id: appt.id }, { allPaymentMethods: [{ value: appt.paymentMethod, name: HelperService.getPaymentMethod(appt.paymentMethod), amount: appt.payableAmount }], employees: employees1, services: appt.services,}, function(err, s) {
                    return callback();
                });
            });
        });
    };

appointmentSchema.statics.addEmployeeToAppointment = function(req, appointment, callback) {
    var employees = [];
    var preService = {},
        prevName = "";
    _.forEach(appointment.services, function(s) {
        if (prevName != s.name) {
            _.forEach(req.body.services, function(service) {
                if (s.serviceId + "" == service.serviceId && s.type == service.type && s.dealId == service.dealId) {
                    if (s.type != 'combo' && s.type != 'newCombo') {
                        s.employees = getEmployeeData(employees, s, service.employee1);
                    } else {
                        var dis = _.filter(service.services, function(c) { return c.serviceCode == s.serviceCode })[0];
                        if (dis) {
                            s.employees = getEmployeeData(employees, s, dis.employees);
                        }
                    }
                    preService = service;
                }
            });
        } else {
            var dis = null;
            _.forEach(req.body.services, function(service) {
                if (!dis)
                    dis = _.filter(service.services, function(c) { return c.serviceCode == s.serviceCode })[0];
            });
            if (dis) {
                s.employees = getEmployeeData(employees, s, dis.employees);
            }
        }
        if (s.type == "combo" || s.type == "newCombo")
            prevName = s.name;
        else prevName = "asdasd";
    });
    console.log(employees);
    console.log(appointment.services);
    Appointment.update({ _id: appointment.id }, { employees: employees, services: appointment.services}, function(err, s) {
        return callback(CreateObjService.response(false, 'Updated'));
    });
};


function getEmployeeData(employees, service, serviceEmployees) {
    var e = [];
    _.forEach(serviceEmployees, function(employee) {
        employee.employeeId = employee.userId;
        employee.commission = 0;
        var found = false;
        var distributedPrice = (service.subtotal * employee.dist) / 100;
        _.forEach(employees, function(emp) {
            if (emp.employeeId + "" == employee.employeeId + "") {
                found = true;
                emp.estimatedTime += service.estimatedTime;
                emp.commission += (employee.commission * distributedPrice) / 100;
                emp.revenue += distributedPrice;
            }
        });
        if (!found) {
            employees.push({
                employeeId: employee.employeeId,
                name: employee.name,
                estimatedTime: service.estimatedTime,
                commission: (employee.commission * distributedPrice) / 100,
                revenue: distributedPrice,
            });
        }
        e.push({
            employeeId: employee.employeeId,
            name: employee.name,
            commission: (employee.commission * distributedPrice) / 100,
            distribution: employee.dist
        });
    });
    return e;
};

//function to find the most visited grade of salons after passing salon types array e.g [0,0,1,1] based on appointments
var mostFrequentSalonType = function(obj) {

        var highestKey = "";

        var highestValue = 0;

        for (key in obj) {
            if (obj[key] >= highestValue) {
                highestValue = obj[key];
                highestKey = key;
            }
        }

        return highestKey;

    }
    //function to find the most visited grade of salons ends

//update favParlor function begins
var updateFavParlor = function(userId) {
        Parlor.find({}, { parlorType: 1 }, function(err, salonTypeArray) {

          /*  var salonAndType = salonTypeArray; //this array is used to get the type of salon 0,1,2

            var numOfAppointmentsSalonWise = { "0": 0, "1": 0, "2": 0 };

            User.findOne({ "_id": userId }, { "parlors": 1 }, function(err, userParlors) {
                //for loop to get salon type 0,1,2
                for (var j = 0; j < userParlors.parlors.length; j++) {
                    for (var k = 0; k < salonAndType.length; k++) {
                        if (userParlors.parlors[j]["parlorId"] == salonAndType[k]["_id"]) {

                            numOfAppointmentsSalonWise[salonAndType[k]["parlorType"]] += userParlors.parlors[j]["noOfAppointments"];
                        }
                    }
                }

                User.update({ "_id": userId }, { $set: { "favParlor": mostFrequentSalonType(numOfAppointmentsSalonWise) } }, function(err, data) {
                    console.log("Favorite parler updated");
                });

            });*/
        });
    }
    //update favParlor function ends

appointmentSchema.statics.createNewAppointment = function(req, callback) {
    Appointment.createNew(req, function(err, newObj, user) {
        if (req.body.data.addAdvanceCredits) {
            Advance.create(Advance.createNew(req, newObj.client.id), function(err, advance) {
                var updateObj = { $set: { 'parlors.$.advanceCredits': user.advanceCredits ? user.advanceCredits + parseInt(req.body.data.addAdvanceCredits) : parseInt(req.body.data.addAdvanceCredits) } };
                var whereOb = { _id: newObj.client.id, 'parlors.parlorId': "" + newObj.parlorId };
                //                        sendAppNotification(user, newObj);
                User.update(whereOb, updateObj, function(err, doc) {
                    if (err) return callback({ error: err });
                    updateFavParlor(user.userId);
                    return callback(CreateObjService.response(false, Appointment.parse(newObj)));
                });


            });
        } else {
            //                        sendAppNotification(user, newObj);
            updateFavParlor(user.userId);
            return callback(CreateObjService.response(false, Appointment.parse(newObj)));
        }
    });
};

appointmentSchema.statics.sendPayNotification = function(req, callback) {
    Appointment.findOne({ _id: req.body.appointmentId }, function(err, appointment) {
        User.findOne({ _id: appointment.client.id }, function(err, user) {
            sendAppNotification(user, appointment);
            return callback();
        });
    });
};

function sendAppNotification(user, appt) {
    Appointment.count({
        'client.id': user.id,
        status: { $in: [3] },
        appointmentType: 3,
        cashbackUsed: true,
    }, function(err, count) {
        var percentage = (count == 0 ? 100 : 10)
        var title = 'Get ' + (count == 0 ? '100%' : '10%') + '  Cashback On Digital Payment.';
        var body = 'Get ' + percentage + '% Cashback On Your Digital Payment & ' + (percentage / 2) + '% Cashback On Cash Payment Through The App. Check Out Other Exciting Freebies Too.*T&C Apply';
        Notification.create({ userId: user.id, action: 'started', title: title, body: body, appointmentId: appt.id }, function(err, n) {
            User.findOne({ _id: user.id, $or: [{ firebaseId: { $ne: null } }, { firebaseIdIOS: { $ne: null } }] }).exec(function(err, user) {
                if (user) {
                    Appointment.sendAppNotification(user.firebaseId, title, body, { appointmentId: appt.id, type: 'started' }, n.id, function(err, response) {});
                    Appointment.sendAppNotificationIOS(user.firebaseIdIOS, title, body, appt.id, 'started', n.id, function(err, response) {
                        console.log(err)
                        console.log(response)
                    });
                }
            })
        });
    });
}

appointmentSchema.statics.createNew = function(req, callback) {
    var user = {},
        obj = {};
    ParlorItem.items(req.session.parlorId, function(err, parlorItems) {
        Slab.find({}, function(err, slabs) {
            Service.find({}, { gstDescription: 1, gstNumber: 1, prices: 1, serviceCode: 1 }, function(err, allServices) {
                Deals.getActiveDeals(req.session.parlorId, req.body.data.appointmentTime, function(deals) {
                    Appointment.checkCoupon(req, function(err, couponResponse) {
                        Admin.findOne({ _id: req.session.userId }, function(err, recp) {
                            var receptionist = {
                                name: recp.firstName + " " + recp.lastName,
                                userId: recp.id,
                                phoneNumber: recp.phoneNumber,
                                gender: recp.gender,
                            };
                            User.findOne({ phoneNumber: req.body.data.user.phoneNumber, 'parlors.parlorId': req.session.parlorId }).populate('activeMembership.membershipId').exec(function(err, u) {
                                var servicesId = _.map(req.body.data.services, function(s) { return s.code; });
                                var originalServices = [];
                                var products = req.body.data.products || [];
                                Appointment.findOne({ parlorId: req.session.parlorId }).sort({ parlorAppointmentId: -1 }).exec(function(err, doc) {
                                    var count = doc ? doc.parlorAppointmentId : 0;
                                    Parlor.findOne({ _id: req.session.parlorId }, function(err, parlor) {
                                        originalServices = parlor.services;
                                        if (u) {
                                            user = User.parse(u, req.session.parlorId);
                                            if (u.activeMembership.length > 0) {
                                                user.membership = User.compressMembership2(u.activeMembership);
                                            }
                                            user.id = user.userId;
                                            obj = Appointment.createNewObj(req, user, receptionist, originalServices, products, parlor, couponResponse.discount, couponResponse, deals, parlorItems, slabs, allServices);

                                            if (req.body.data.appointmentId) {
                                                Appointment.findOne({ _id: req.body.data.appointmentId }, function(err, appointment) {
                                                    if (appointment) {
                                                        obj.isPaid = appointment.isPaid;
                                                        obj.paymentMethod = appointment.paymentMethod;
                                                        obj.allPaymentMethods = appointment.allPaymentMethods;
                                                        obj.editedByCrm = 1;
                                                        Appointment.update({ _id: req.body.data.appointmentId }, obj, function(err, newObj) {
                                                            if (err) console.log("error in creating appointment ", err);
                                                            return callback(err, obj, user);
                                                        });
                                                    }
                                                });

                                            } else {
                                                obj.parlorAppointmentId = ++count;
                                                Appointment.create(obj, function(err, newObj) {
                                                    if (err) console.log("error in creating appointment ", err);
                                                    return callback(err, newObj, user);
                                                });
                                            }
                                        } else {
                                            User.findOne({ phoneNumber: req.body.data.user.phoneNumber }).populate('activeMembership.membershipId').exec(function(err, userFound) {
                                                if (!userFound) {
                                                    var parlors = [];
                                                    parlors.push({ parlorId: req.session.parlorId, createdBy: req.session.userId, noOfAppointments: 0, createdAt: new Date() });
                                                    User.find().count(function(err, count) {
                                                        var newUser = { gender: req.body.data.user.gender, emailId: req.body.data.user.emailId, firstName: req.body.data.user.name, phoneNumber: req.body.data.user.phoneNumber, parlors: parlors };
                                                        newUser.customerId = ++count;
                                                        User.create(newUser, function(err, doc) {
                                                            if (err) console.log(err);
                                                            var user = {
                                                                id: doc._id,
                                                                name: doc.firstName,
                                                                noOfAppointments: 0,
                                                                emailId: doc.emailId,
                                                                gender: doc.gender,
                                                                phoneNumber: doc.phoneNumber,
                                                                customerId: doc.customerId,
                                                                membership: [],
                                                                subscriptionId : 0,
                                                                loyalityPoints: 0,
                                                                subscriptionLoyality: 0,
                                                            }
                                                            obj = Appointment.createNewObj(req, user, receptionist, originalServices, products, parlor, couponResponse.discount, couponResponse, deals, parlorItems, slabs, allServices);
                                                            obj.parlorAppointmentId = ++count;
                                                            Appointment.create(obj, function(err, newObj) {
                                                                return callback(err, newObj, user);
                                                            });
                                                        });
                                                    });
                                                } else {
                                                    var newP = { parlorId: req.session.parlorId, createdBy: req.session.userId, noOfAppointments: 0, createdAt: new Date(), updatedAt: new Date() };
                                                    userFound.parlors.push(newP);
                                                    userFound.save(function(err) {
                                                        var user = {
                                                            id: userFound._id,
                                                            name: userFound.firstName,
                                                            gender: userFound.gender,
                                                            emailId: userFound.emailId,
                                                            noOfAppointments: 0,
                                                            phoneNumber: userFound.phoneNumber,
                                                            customerId: userFound.customerId,
                                                            membership: [],
                                                            subscriptionId : userFound.subscriptionId,
                                                            loyalityPoints: 0,
                                                            subscriptionLoyality: 0,
                                                        }
                                                        obj = Appointment.createNewObj(req, user, receptionist, originalServices, products, parlor, couponResponse.discount, couponResponse, deals, parlorItems, slabs, allServices);
                                                        obj.parlorAppointmentId = ++count;
                                                        Appointment.create(obj, function(err, newObj) {
                                                            return callback(err, newObj, user);
                                                        });
                                                    });
                                                }
                                            });
                                        }
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
};

appointmentSchema.statics.getServiceHome = function(req, callback) {
    var timePeriod = req.query.timePeriod;
    var startTime = HelperService.getLastWeekStart(),
        endTime = HelperService.getLastWeekEnd();
    if (timePeriod == 1) {
        // startTime = HelperService.getLastDayStart();
        startTime = HelperService.getTodayStart();
        endTime = HelperService.getTodayEnd();
    } else if (timePeriod == 3) {
        startTime = HelperService.getLastMonthStart();
    }
    Admin.getParlorIds(req, function(parlorIds) {
        Appointment.find({ parlorId: { $in: parlorIds }, appointmentStartTime: { $gt: startTime, $lt: endTime } }, function(err, appointments) {
            ServiceCategory.find({}, function(err, categories) {
                Parlor.find({ _id: { $in: parlorIds } }, function(err, parlors) {
                    var data = [];
                    _.forEach(parlors, function(parlor) {
                        var newCategories = [];
                        var services = _.map(parlor.services, function(s) {
                            Appointment.populateCategories(newCategories, categories, s);
                            return {
                                categoryId: s.categoryId,
                                prices: [s.prices[0].priceId, s.prices[1].priceId, s.prices[2].priceId],
                                serviceId: s.serviceId,
                                name: s.name,
                                gender: s.gender,
                                total: 0,
                                revenue: 0
                            };
                        });
                        var newAppointments = _.filter(appointments, function(a) { return a.parlorId == parlor.id; });
                        data.push(Appointment.parseServiceAnalytics(newAppointments, newCategories, services));
                    });
                    if (data.length == 1) return callback(false, data[0]);
                    else {
                        return callback(false, Appointment.populateForMultipleParlors(data));
                    }
                });
            });
        });
    });
};

appointmentSchema.statics.populateForMultipleParlors = function(data) {
    var averageService = 0,
        popularService = "",
        popularSubService = "",
        leastPopularService = "";

    _.forEach(data, function(d) {
        averageService += d.averageService;
    });
    return {
        averageService: averageService.toFixed(2),
        popularService: popularService,
        popularSubService: popularSubService,
        leastPopularService: leastPopularService,
        revenueCluster: data[0].revenueCluster,
        // revenueCluster: Appointment.parseCluster(data),
        // numberCluster: Appointment.parseCluster(data)
        numberCluster: data[0].numberCluster,
    };
};

appointmentSchema.statics.parseCluster = function(data) {

};



appointmentSchema.statics.getOrderHistory = function(clientId, callback) {
    Appointment.find({"client.id" : clientId, status : 3}, function(err, appointments){
        var data = [];
        _.forEach(appointments, function(appointment){
            data.push({
                orderId : appointment.id,
                amount : parseInt(appointment.payableAmount + appointment.subscriptionAmount)*100,
                currencyCode : "INR",
                data : appointment.appointmentStartTime,
                category : "CARE",
                paymentMethod : appointment.paymentMethod != 5 || appointment.paymentMethod != 6 ? "COD" : "NET BANKING",
                returned : false,
                returnReason : "",
            });
        });
        return callback(data);
    });
};

appointmentSchema.statics.parseServiceAnalytics = function(appointments, categories, services) {
    var averageService = 0,
        popularService = "",
        popularSubService = "",
        leastPopularService = "",
        totalService = 0;
    _.forEach(appointments, function(appointment) {
        if (appointment.status != 2) {
            totalService += appointment.services.length;
            _.forEach(appointment.services, function(ser) {
                _.forEach(services, function(service) {
                    _.forEach(service.prices, function(p) {
                        if (ser.id == p) {
                            _.forEach(categories, function(cat) {
                                if (cat.categoryId == service.categoryId) cat.total++;
                            });
                            service.total++;
                            service.revenue += ser.price * ser.quantity;
                        }
                    });
                });
            });
        }
    });
    averageService = appointments.length === 0 ? 0 : totalService / appointments.length;
    var maxService = -1,
        minService = 9999999,
        maxSubservice = -1;
    _.forEach(services, function(service) {
        if (maxSubservice < service.total) {
            maxSubservice = service.total;
            popularSubService = service.name;
        }
    });
    _.forEach(categories, function(cat) {
        if (maxService < cat.total) {
            maxService = cat.total;
            popularService = cat.name;
        }
        if (minService >= cat.total) {
            minService = cat.total;
            leastPopularService = cat.name;
        }
    });
    return { averageService: averageService, popularService: popularService, popularSubService: popularSubService, leastPopularService: leastPopularService, revenueCluster: Appointment.createCluster(2, categories, services), numberCluster: Appointment.createCluster(1, categories, services) };
};

appointmentSchema.statics.parlorHomeData = function(req, callback) {
    Admin.getParlorIds(req, function(parlorIds) {
        Appointment.find({ parlorId: { $in: parlorIds }, appointmentStartTime: { $gt: HelperService.getTodayStart(), $lt: HelperService.getTodayEnd() }, }, function(err, appointments) {
            var totalRevenue = 0,
                averageTime = 0,
                totalCollection = 0,
                totalTax = 0,
                totalLoyalityPoints = 0,
                openAppointments = 0,
                totalAppointments = 0;
            _.forEach(appointments, function(a) {
                if (a.status == 3) {
                    console.log(a.status)
                    totalAppointments++
                    totalTax += a.tax;
                    totalCollection += a.payableAmount;
                    totalLoyalityPoints += (a.loyalityPoints * 0.5);
                }

                if (a.status == 1 || a.status == 4) {
                    openAppointments++
                }
                // averageTime += a.estimatedTime;
            });
            if (appointments.length != 0) averageTime = averageTime / appointments.length;
            return callback(false, {
                totalAppointments: totalAppointments,
                totalRevenue: (totalCollection - totalTax + totalLoyalityPoints),
                totalCollection: totalCollection,
                openAppointments: openAppointments
                    // averageTime : averageTime
            });
        });

    });

};

appointmentSchema.statics.populateCategories = function(newCategories, categories, service) {
    var found = false,
        name = "";
    _.forEach(newCategories, function(cat) {
        if (cat.categoryId == "" + service.categoryId) {
            found = true;
        }
    });
    _.forEach(categories, function(cat) {
        if (cat.id == service.categoryId) name = cat.name;
    });

    if (!found) {
        newCategories.push({
            categoryId: service.categoryId,
            total: 0,
            name: name
        });
    }
};

appointmentSchema.statics.createCluster = function(type, categories, services) {
    var cluster = [{ "name": "Services", "children": [{ "name": "Male", "children": [] }, { "name": "Female", "children": [] }] }];
    Appointment.populateClusterByGender("M", type, cluster[0].children[0].children, services, categories);
    Appointment.populateClusterByGender("F", type, cluster[0].children[1].children, services, categories);
    return cluster;
};

appointmentSchema.statics.populateClusterByGender = function(gender, type, children, services, categories) {
    var newServices = services.filter(function(s) { return s.gender == gender; });
    _.forEach(categories, function(cat) {
        var obj = { "name": cat.name, children: [] };
        _.forEach(newServices, function(s) {
            if (s.categoryId + "" == cat.categoryId) {
                if (type == 1 && s.total > 0)
                    obj.children.push({
                        "name": s.name,
                        "size": s.total,
                    });
                if (type == 2 && s.revenue > 0)
                    obj.children.push({
                        "name": s.name,
                        "size": s.revenue,
                    });
            }
        });
        if (obj.children.length > 0) children.push(JSON.parse(JSON.stringify(obj)));
    });
};

appointmentSchema.statics.getAppointmentHome = function(req, callback) {
    // var start = new Date(y, m, 1);
    // var end = new Date(y, m, HelperService.getDaysInMonth(m+1, y), 23, 59, 59, 0);
    var userId = req.session.userId;
    if (!userId) callback(null, "Please Login Again !");
    var parlorId = [];
    Admin.findOne({ _id: userId }, function(err, user) {
        if (err) console.log(err);
        else {
            if (user.role == 7) {
                _.forEach(user.parlorIds, function(pid) {
                    parlorId.push(pid);
                });
            } else {
                parlorId.push(user.parlorId);
            }
        }
        Appointment.find({ parlorId: { $in: parlorId }, appointmentStartTime: { $gt: HelperService.getTodayStart(), $lt: HelperService.getTodayEnd() }, status: 3 }, function(err, appointments) {
            var todayTotalAppointments = 0,
                todayTotalBilling = 0,
                lastWeekBilling = 0,
                lastWeekAppointments = 0;
            _.forEach(appointments, function(appt) {
                if (appt.status == 3) todayTotalBilling += appt.payableAmount;
                if (appt.status != 2) todayTotalAppointments++;
            });
            Appointment.find({ parlorId: { $in: parlorId }, appointmentStartTime: { $gt: HelperService.getLastWeekStart(), $lt: HelperService.getLastWeekEnd() } }, function(err, appointmentLastWeek) {
                _.forEach(appointmentLastWeek, function(appt) {
                    if (appt.status == 3) lastWeekBilling += appt.payableAmount;
                    if (appt.status != 2) lastWeekAppointments++;
                });
                Appointment.find({ parlorId: { $in: parlorId }, appointmentStartTime: { $gt: HelperService.getLastMonthStart(), $lt: HelperService.getTodayEnd() } }, function(err, allAppt) {
                    var billingValues = [],
                        appointmentsValues = [];
                    var currentDay = 0,
                        currenDate, tempBilling = 0,
                        tempAppointments = 0;
                    _.forEach(allAppt, function(appt) {
                        if (currentDay === 0) {
                            currenDate = appt.appointmentStartTime;
                            currentDay = appt.appointmentStartTime.getDate();
                        }
                        if (appt.appointmentStartTime.getDate() != currentDay) {
                            if (tempBilling !== 0 || tempAppointments !== 0) {
                                billingValues.push([currenDate.getTime(), tempBilling]);
                                appointmentsValues.push([currenDate.getTime(), tempAppointments]);
                                tempBilling = 0;
                                tempAppointments = 0;
                            }
                            currentDay = appt.appointmentStartTime.getDate();
                            currenDate = appt.appointmentStartTime;
                        }
                        if (appt.status == 3) tempBilling += appt.payableAmount;
                        if (appt.status != 2) tempAppointments++;
                    });
                    if (tempBilling !== 0 || tempAppointments !== 0) {
                        billingValues.push([currenDate.getTime(), tempBilling]);
                        appointmentsValues.push([currenDate.getTime(), tempAppointments]);
                    }
                    return callback(null, { todayTotalBilling: todayTotalBilling, todayTotalAppointments: todayTotalAppointments, lastWeekTotalBilling: lastWeekBilling, lastWeekTotalAppointments: lastWeekAppointments, billingValues: billingValues, appointmentsValues: appointmentsValues });
                });
            });
        });
    });
};


appointmentSchema.statics.parseArray = function(appointments , tax) {
    return _.map(appointments, function(a) {
        var newSubtotal = parseFloat(parseFloat(parseFloat(a.subtotal) - parseFloat(a.loyalityPoints) - parseFloat(a.creditUsed / (1 + tax / 100)) - parseFloat(a.membershipDiscount / (1 + tax / 100))).toFixed(2));
        var payableAmount = Math.ceil(newSubtotal * (1 + tax / 100));
        var loyalityPoints = parseInt((newSubtotal * 0) / 100);
        var obj = Appointment.parse(a);
        obj.parlorName = a.parlorName;
        obj.superSetServices = [];
        obj.closedByName = a.closedByName;
        obj.parlorAddress = a.parlorAddress;
        obj.payableAmountForOnlineDiscount = payableAmount;
        obj.onlineDiscount = loyalityPoints;
        obj.payableAmount = payableAmount;
        obj.freebiesUsed = a.loyalityPoints - a.loyalityOffer;
        obj.creditUsed = parseFloat(parseFloat(a.creditUsed).toFixed(2));
        var totalSavings = 0;
        var menuPrice = 0;
        _.forEach(obj.services, function(s) {
            var sav = s.actualDealPrice ? s.actualDealPrice : s.actualPrice;
            if (s.type != 'frequency') totalSavings += (sav - (s.price));
            else totalSavings += s.discount;
            menuPrice += s.actualPrice;
        });
        obj.totalSaved = parseInt(totalSavings);
        obj.packageDiscount = parseInt((menuPrice - totalSavings) - obj.subtotal);
        obj.loyalitySubscription = a.loyalitySubscription;
        obj.subscriptionAmount = a.subscriptionAmount;
        obj.couponLoyalityPoints = a.couponLoyalityPoints;
        obj.subscriptionId = a.buySubscriptionId;
        return obj;
    });
};


appointmentSchema.statics.parseArray2 = function(appointments) {
    return _.map(appointments, function(a) {
        var obj = Appointment.parse(a);
        obj.parlorName = a.parlorName;
        obj.homeServiceOnly = a.homeServiceOnly;
        obj.address1 = a.address1;
        obj.address2 = a.address2;
        obj.isSubscriptionAppointment = a.isSubscriptionAppointment;
        obj.closedByName = a.closedByName;
        obj.parlorAddress = a.parlorAddress;
        obj.freebiesUsed = a.loyalityPoints - a.loyalityOffer;
        obj.creditUsed = parseFloat(parseFloat(a.creditUsed).toFixed(2));
        var totalSavings = 0;
        var menuPrice = 0;
        _.forEach(obj.services, function(s) {
            var sav = s.actualDealPrice ? s.actualDealPrice : s.actualPrice;
            if (s.type != 'frequency') totalSavings += (sav - (s.price));
            else totalSavings += s.discount;
            menuPrice += s.actualPrice;
        });
        obj.totalSaved = parseInt(totalSavings);
        obj.packageDiscount = parseInt((menuPrice - totalSavings) - obj.subtotal);
        obj.loyalitySubscription = a.loyalitySubscription;
        obj.subscriptionAmount = a.subscriptionAmount;
        obj.couponLoyalityPoints = a.couponLoyalityPoints;
        obj.serviceRevenue = a.serviceRevenue;
        obj.productRevenue = a.productRevenue;
        obj.createdAt = a.createdAt;
        return obj;
    });
};

appointmentSchema.statics.parseArrayForBillingApp = function(appointments) {
    return _.map(appointments, function(a) {
        var obj = Appointment.parseForBillingApp(a);
        obj.parlorName = a.parlorName;
        obj.superSetServices = [];
        obj.closedByName = a.closedByName;
        obj.parlorAddress = a.parlorAddress;
        return obj;
    });
};

appointmentSchema.statics.parseForApp = function(appointments, upcomming, tax) {
    return _.map(appointments, function(a) {
        return Appointment.parseSingleAppointmentForApp(a, upcomming, a.tax > 0 ? 18 : 0);
    });
};


appointmentSchema.statics.parseForAppUpcomingAppointment = function(appointments, upcomming, tax) {
    return _.map(appointments, function(a) {
        // Parlor.findOne({ _id: a.parlorId }, { tax: 1, latitude: 1, longitude: 1, openingTime: 1, closingTime: 1 }, function(err, parlor) {
        //  console.log("parlorsssssssssss",parlor)
        return Appointment.parseSingleAppointmentForApp(a, upcomming, a.parlorTax);
        // })
    });
};


appointmentSchema.statics.parseForMirrorUpcomingAppointment = function(appointments, upcomming, tax) {
    return _.map(appointments, function(a) {
        return{
            appointment : a.id,
            parlorName : a.parlorName,
            appointmentStartTime : a.appointmentStartTime,
            subtotal : a.subtotal,
            payableAmount : a.payableAmount,
            services : _.map(a.services, function(s){ return {serviceName : s.name, employee : s.employees}})
        }
    });
};

appointmentSchema.statics.parseSingleAppointmentForApp = function(a, upcomming, tax) {
    var newSubtotal = parseFloat(parseFloat(parseFloat(a.subtotal) - parseFloat(a.loyalityPoints) - parseFloat(a.creditUsed / (1 + tax / 100)) - parseFloat(a.membershipDiscount / (1 + tax / 100))).toFixed(2));
    var payableAmount = Math.ceil(newSubtotal * (1 + tax / 100));
    var loyalityPoints = parseInt((newSubtotal * 0) / 100);
    var obj = Appointment.parseForUser(a);
    obj.appointmentId = a.id;
    obj.parlorName = a.parlorName;
    obj.membershipSuggestion = {};
    obj.onlineTax = parseFloat((newSubtotal - loyalityPoints) * tax / 100).toFixed(2);
    obj.payableAmountForOnlineDiscount = payableAmount;
    obj.onlineDiscount = loyalityPoints;
    obj.payableAmount = payableAmount;
    obj.freebiesUsed = a.loyalityPoints - a.loyalityOffer;
    obj.parlorAddress = a.parlorAddress;
    obj.review = a.review;
    obj.creditUsed = parseFloat(parseFloat(a.creditUsed).toFixed(2));
    obj.parlorId = upcomming ? a.parlorId.id : a.parlorId;
    var totalSavings = 0;
    var menuPrice = 0;
    _.forEach(obj.services, function(s) {
        var sav = s.actualDealPrice ? s.actualDealPrice : s.actualPrice;
        if (s.type != 'frequency') totalSavings += (sav - (s.price));
        else totalSavings += s.discount;
        menuPrice += s.actualPrice;
    });
    obj.totalSaved = parseInt(totalSavings);
    obj.packageDiscount = parseInt((menuPrice - totalSavings) - obj.subtotal);
    obj.loyalitySubscription = tax ? Math.ceil(a.loyalitySubscription * (1 + tax/100)) : a.loyalitySubscription,
    obj.subscriptionAmount = a.subscriptionAmount * tax;
    obj.tax = tax ? a.tax + (a.loyalitySubscription * (tax/100)) : a.tax,
    obj.couponLoyalityPoints = a.couponLoyalityPoints;
    if (upcomming) {
        obj.parlorLatitude = a.parlorId.latitude;
        obj.parlorLongitude = a.parlorId.longitude;
        obj.openingTime = a.parlorId.openingTime;
        obj.closingTime = a.parlorId.closingTime;
        obj.latitude = a.parlorId.latitude;
        obj.currentTime = new Date();
        obj.longitude = a.parlorId.longitude;
    }
    return obj;
};

appointmentSchema.statics.parseForUser = function(a) {
    var pro = _.forEach(a.products, function(p) {
        p.employee = p.employeeId;
    });
    var discountFrequency = 0;
    _.forEach(a.services, function(s) {
        if (s.type == 'frequency') discountFrequency += s.discount;
    });
    return {
        appointmentId: a.id,
        appBooking: a.appBooking,
        otherCharges: a.otherCharges || 0,
        subtotal: a.subtotal - discountFrequency,
        discount: a.discount,
        appointmentType: a.appointmentType,
        paymentMethod: a.paymentMethod,
        couponCode: a.couponCode,
        couponLoyalityPoints: a.couponLoyalityPoints,
        comment: a.comment,
        homeServiceOnly : a.homeServiceOnly,
        address1 : a.address1,
        address2 : a.address2,
        addressLatitude : a.addressLatitude,
        addressLongitude : a.addressLongitude,
        membershipAmount: a.membershipAmount,
        subscriptionAmount: a.subscriptionAmount,
        loyalitySubscription: parseInt(a.loyalitySubscription),
        bookingMethod: a.bookingMethod,
        allPaymentMethods: getAllPaymentMethod(a.allPaymentMethods, a.advanceCredits, a.useAdvanceCredits, a.paymentMethod, a.payableAmount),
        membershipDiscount: a.membershipDiscount.toFixed(2),
        membersipCreditsLeft: parseInt(a.membersipCreditsLeft.toFixed(2)),
        payableAmount: a.payableAmount,
        productPrice: a.productPrice,
        appointmentId: a.id,
        parlorId: a.parlorId,
        loyalityOffer: parseInt(a.loyalityOffer),
        parlorAppointmentId: a.invoiceId,
        appointmentStatus: HelperService.getAppointmnetStatusValue(a.status),
        creditUsed: a.creditUsed.toFixed(2),
        tax: a.tax,
        status: a.status,
        isPaid: a.isPaid ? a.isPaid : false,
        startsAt: a.appointmentStartTime,
        appointmentEndTime: a.appointmentEndTime,
        estimatedTime: a.estimatedTime,
        loyalityPoints: a.loyalityPoints != null ? parseInt(a.loyalityPoints) : 0,
        services: Appointment.populateServices(a.services),
        products: pro,
        advanceCredits: a.useAdvanceCredits ? a.advanceCredits : 0,
    };
};

function getAllPaymentMethod(all, advanceCredits, useAdvanceCredits, paymentMethod, payableAmount) {
    if (advanceCredits && useAdvanceCredits) {
        all.push({
            value: 3,
            name: 'Advance',
            amount: advanceCredits,
        });
    }
    /*if(all.length == 0 && paymentMethod != 1){
        all.push({
            value : paymentMethod,
            name : HelperService.getPaymentMethod(paymentMethod),
            amount : payableAmount,
        });
    }*/
    return all;
}

appointmentSchema.statics.populateServices = function(services) {
    var data = [],
        prevName = "";
    _.forEach(services, function(s) {
        if (prevName != s.name) {
            var price = s.price + s.additions;
            var actualDealPrice = (s.actualDealPrice ? s.actualDealPrice : s.actualPrice) * s.quantity
            var obj = {
                name: s.name,
                serviceName: s.serviceName,
                price: s.type != 'frequency' ? parseInt(price) : parseInt(price * (s.quantity - 1)),
                actualPrice: s.type != 'frequency' ? parseInt(s.actualPrice) : parseInt(s.frequencyPrice * s.quantity),
                employees: s.employees.slice(),
                estimatedTime: s.estimatedTime,
                additions: s.additions,
                quantity: s.quantity,
                count: s.quantity,
                gstNumber: s.gstNumber,
                serviceDiscount : s.serviceDiscount ? s.serviceDiscount: 0,
                gstDescription: s.gstDescription,
                typeIndex: s.typeIndex,
                brandId: s.brandId,
                productId: s.productId,
                brandProductDetail: s.brandProductDetail,
                code: s.serviceCode,
                serviceCode: s.serviceCode,
                actualDealPrice: parseInt(actualDealPrice),
                discount: s.discount,
                tax: s.tax,
                comboServices: s.type == 'newCombo' || s.type == 'combo' ? [{
                    name: s.serviceName,
                    serviceCode: s.serviceCode,
                    brandProductDetail: s.brandProductDetail,
                    brandId: s.brandId,
                    productId: s.productId,
                    employees: s.employees,
                }] : [],
                membershipDiscount: s.membershipDiscount,
                creditsUsed: s.creditsUsed,
                dealId: s.dealId,
                serviceId: s.serviceId,
                categoryId: s.categoryId,
                type: s.type,
                dealPriceUsed: s.dealPriceUsed
            };
            data.push(obj);
        } else {
            Appointment.populateUniqueEmployee(data[data.length - 1].employees, s.employees);
            data[data.length - 1].price += s.price;
            data[data.length - 1].comboServices.push({
                name: s.serviceName,
                serviceCode: s.serviceCode,
                brandProductDetail: s.brandProductDetail,
                brandId: s.brandId,
                productId: s.productId,
                employees: s.employees,
            });
            data[data.length - 1].actualPrice += s.actualPrice;
            data[data.length - 1].actualDealPrice += s.actualPrice;
        }
        if (s.type == "combo" || s.type == "newCombo")
            prevName = s.name;
        else prevName = "asdasd";
    });
    return data;
};

appointmentSchema.statics.populateUniqueEmployee = function(employees, serviceEmployees) {
        _.forEach(serviceEmployees, function(s) {
            if (!_.filter(employees, function(emp) { return emp.employeeId + "" == s.employeeId + "" })[0])
                employees.push(s);
        });
    },

    appointmentSchema.statics.parse = function(a) {
        var obj = Appointment.parseForUser(a);
        obj.appointmentId = obj.appointmentId;
        obj.parlorName = a.parlorName;
        obj.status = a.status;
        obj.otp = a.otp;
        obj.client = a.client;
        obj.receptionist = a.receptionist.name;     
        obj.employees = _.map(a.employees, function(e) { return e.employeeId; });
        return obj;
    };

appointmentSchema.statics.parseForBillingApp = function(a) {
    var obj = Appointment.parseForUser(a);
    obj.appointmentId = obj.appointmentId;
    obj.parlorName = a.parlorName;
    obj.status = a.status;
    obj.otp = a.otp;
    obj.client = a.client;
    obj.receptionist = a.receptionist.name;
    obj.employees = _.map(a.employees, function(e) { return e.employeeId; });
    return obj;
};



appointmentSchema.statics.changePaymentMethod = function(req, callback) {
    Appointment.update({ _id: req.body.appointmentId }, { updatedAt: new Date(), allPaymentMethods: getPaymentMethodObj(req.body.paymentMethod), paymentMethod: checkPaymentMethod(req.body.paymentMethod) }, function(err, status) {
        return callback(err, status);
    });
};

function getPaymentMethodObj(methods) {
    return _.map(methods, function(m) {
        return {
            value: m.value,
            name: m.name,
            amount: m.amount,
        }
    });
}

function checkPaymentMethod(methods) {
    if (methods.length > 1) return 12;
    else return methods[0].value;
}

appointmentSchema.statics.changeStatus = function(req, callback) {
    console.log("change statusssssssssssssssssssssss")
    console.log(req.body.appointmentId);
    var now_date = HelperService.addDaysToDate2(45);
    // now_date.setMonth(now_date.getMonth() + 1);

    Service.find({ownerId : null}, { isDeleted: 1, id: 1, inventoryItemId : 1, inventoryItemQunatity:1 }, function(err, realBeUServices) {
        var itemIds = [], productsUsedInService = [];
        _.forEach(realBeUServices, function(s){if(s.inventoryItemId)itemIds.push(s.inventoryItemId)});
        Appointment.findOne({ _id: req.body.appointmentId, status: { $in: [1, 4] } }, function(err, appointment) {
            ParlorItem.find({parlorId : appointment.parlorId, inventoryItemId : {$in : itemIds}}, {actualUnits : 1, inventoryItemId : 1}, function(er, pItems){
                _.forEach(appointment.services, function(s){
                    var rService = _.filter(realBeUServices, function(rs){ return rs.id + "" == s.serviceId + ""})[0];
                    if(rService && rService.inventoryItemId){
                        var pI = _.filter(pItems, function(p){return p.inventoryItemId + "" == rService.inventoryItemId + ""})[0];
                        if(pI){
                            productsUsedInService.push({
                                inventoryItemId : pI.inventoryItemId,
                                inventoryItemQunatity : rService.inventoryItemQunatity,
                                serviceQuantity : s.quantity
                            });
                        }
                    }
                });
                Parlor.findOne({ _id: appointment.parlorId }, { rating: 1, tax: 1 }, function(er, par) {
                    Appointment.findOne({ parlorId: appointment.parlorId, status: 3 }, {}, { sort: { 'invoiceId': -1 } }, function(err, s) {
                        var newInvoiceId = s ? s.invoiceId + 1 : 1;
                        var employeesID = _.map(appointment.employees, function(emp) { return emp.employeeId });

                        User.findOne({ _id: appointment.client.id }, function(err, user) {
                            Appointment.count({ 'client.id': req.body.userId, status: { $in: [3] }, appointmentType: 3, cashbackUsed: true }, function(err, cashbackCount) {
                                var query = { _id: appointment.client.id, 'parlors.parlorId': "" + appointment.parlorId };
                                var loyalityPoints = user.loyalityPoints ? user.loyalityPoints : 0;
                                var allCheck = true;
                                var incObj = { 'parlors.$.noOfAppointments': 0 };
                                var updateObj = {};
                                var noOfFreeHairCut = 0;
                                var freeThreading = 0;
                                var cashbackUsed = cashbackCount == 0 ? false : true;
                                updateObj.$set = { 'parlors.$.lastAppointmentDate': new Date() };
                                var productRevenue = 0;
                                if (req.body.status == 3) {
                                    incObj = appointment.services.length > 0 ?  { 'parlors.$.noOfAppointments': 1 } : {};
                                    if (appointment.creditUsed != 0 && !appointment.membershipSaleId) {
                                        updateObj.activeMembership = getNewActiveMembership(user.activeMembership, appointment.creditUsed, appointment.membershipId);
                                    }else if(appointment.creditUsed != 0 && appointment.membershipSaleId +"" == "594a359d9856d3158171ea4f"){
                                        var cUsed = appointment.creditUsed * (1 + par.tax/100);
                                        updateObj.activeMembership = getNewActiveMembership(user.activeMembership, cUsed, appointment.membershipId);
                                    }

                                    if (appointment.allPaymentMethods.length == 0 && appointment.payableAmount > 0 && appointment.paymentMethod != 5)
                                        allCheck = false;
                                    console.log("allCheck1", allCheck);
                                    if ((appointment.allPaymentMethods.length > 0) && (_.sum(_.map(appointment.allPaymentMethods, function(pay) { return pay.amount })) != appointment.payableAmount))
                                        allCheck = false;
                                    console.log("allCheck2", allCheck);

                                    if (appointment.useAdvanceCredits) {
                                        var pac = _.find(user.parlors, { parlorId: "" + appointment.parlorId });
                                        var advanceCredits = pac.advanceCredits - appointment.advanceCredits;
                                        if (advanceCredits < 0) allCheck = false;
                                        if(appointment.services.length > 0){
                                            incObj = { 'parlors.$.noOfAppointments': 1, 'parlors.$.advanceCredits': -1 * appointment.advanceCredits };
                                        }else{
                                            incObj = {'parlors.$.advanceCredits': -1 * appointment.advanceCredits };
                                        }
                                    }
                                    var appBooking = appointment.appBooking == 2 ? true : false;
                                    var getFreebies = Appointment.getFreebiesPoints(appointment.paymentMethod, appointment, cashbackCount, appBooking, user.isCorporateUser);
                                    console.log("getFreebies---------------------------------------------------------------");
                                    console.log(getFreebies);
                                    if (getFreebies.loyality > 0) {

                                        cashbackUsed = getFreebies.cashbackUsed;
                                        loyalityPoints += getFreebies.loyality;
                                        updateObj.loyalityPoints = loyalityPoints;
                                        if (!updateObj.$push) updateObj.$push = {};
                                        if (!updateObj.$push.creditsHistory) updateObj.$push.creditsHistory = {};
                                        if (!updateObj.$push.creditsHistory.$each) updateObj.$push.creditsHistory.$each = [];
                                        updateObj.$push.creditsHistory.$each.push({ createdAt: new Date(), amount: getFreebies.loyality, balance: loyalityPoints, source: appointment.id, reason: getFreebies.reason });
                                        updateObj.freebieExpiry = now_date;
                                    }
                                    var totalServicePrice = 0,
                                        appointmentLoyalityPoints = appointment.loyalityPoints - appointment.loyalityOffer + (appointment.loyalitySubscription || 0);

                                    var loyalityOffer4 = appointment.loyalityOffer;
                                    var allServiceOfAppointments = [],
                                        realServices = [];
                                    /*if (appointment.superSetServices && appointment.superSetServices.length != 0) {
                                        allServiceOfAppointments = JSON.parse(JSON.stringify(appointment.superSetServices));
                                    } else {*/
                                        allServiceOfAppointments = JSON.parse(JSON.stringify(appointment.services));
                                    // }
                                    _.forEach(allServiceOfAppointments, function(s) {
                                        if (s.discountMedium == "frequency" && s.subtotal == 0 && loyalityOffer4 > 0) {
                                            loyalityOffer4 -= s.price;
                                        }
                                    });

                                    _.forEach(allServiceOfAppointments, function(s) {
                                        /*if (_.filter([271, 274], function(th) { return s.serviceCode == th })[0] && appointment.paymentMethod == 5 && loyalityOffer4 > 0) {
                                            totalServicePrice += 0;
                                        } else {*/
                                            if (s.subtotal != 0) totalServicePrice += (s.subtotal);
                                        // }
                                    });

                                    _.forEach(appointment.products, function(p) {
                                        productRevenue += (p.price * p.quantity);
                                    });
                                    _.forEach(allServiceOfAppointments, function(s) {
                                        if (s.subtotal != 0) {
                                            /*if (_.filter([271, 274], function(th) { return s.serviceCode == th })[0] && appointment.paymentMethod == 5) {

                                            } else {*/
                                                s.loyalityPoints = ((s.subtotal - s.creditsUsed - s.membershipDiscount) / totalServicePrice) * appointmentLoyalityPoints;
                                            // }
                                        }
                                        if (s.frequencyDealFreeService) {
                                            if (!updateObj.$push) updateObj.$push = {};
                                            updateObj.$push.freeServices = { expires_at: now_date, createdAt: new Date(), categoryId: s.categoryId, serviceId: s.serviceId, code: s.id, dealId: s.dealId, parlorId: appointment.parlorId, noOfService: s.frequencyDealFreeService, price: s.frequencyPrice, discount: s.discount / s.frequencyDealFreeService };
                                            // }else if(s.type == 'deal' && (s.serviceId + ""  != "58707eda0901cc46c44af2eb") && (s.serviceId + ""  != "58707eda0901cc46c44af417" ) && (s.serviceId + ""  != "59520f3b64cd9509caa273ec" ) ){
                                        } else if (s.type == 'deal' && (s.serviceId + "" != "58707eda0901cc46c44af2eb") && (s.serviceId + "" != "58707eda0901cc46c44af417") && (s.serviceId + "" != "59520f3b64cd9509caa273ec")) {
                                            var reimbursed = false;
                                            allCheck = false;
                                            user.freeServices = _.forEach(user.freeServices, function(free) {
                                                if (free.serviceId + "" == s.serviceId + "") {
                                                    if ((free.parlorId + "" == appointment.parlorId + "") && !reimbursed) {
                                                        free.noOfService -= s.quantity;
                                                        reimbursed = true;
                                                        if (free.noOfService < 0) {
                                                            allCheck = false;
                                                        } else allCheck = true;
                                                    }
                                                }
                                            });
                                            user.freeServices = _.filter(user.freeServices, function(s) {
                                                return s.noOfService > 0;
                                            });
                                            updateObj.freeServices = user.freeServices;
                                        }
                                    });
                                    /* if(appointment.loyalityPoints-appointment.loyalityOffer > 0){
                                         loyalityPoints = user.loyalityPoints - (appointment.loyalityPoints - appointment.loyalityOffer);
                                         console.log(loyalityPoints);
                                         if(loyalityPoints < 0)allCheck = false;
                                         updateObj.loyalityPoints = loyalityPoints;
                                         if(!updateObj.$push) updateObj.$push = {};
                                             updateObj.$push.creditsHistory = { $each : [ {expires_at: now_date, createdAt: new Date(), amount: -1 * (appointment.loyalityPoints - appointment.loyalityOffer), balance : loyalityPoints, source : appointment.id , reason : 'Used for appointment'} ]} ;
                                     }*/
                                }
                                updateObj.$inc = incObj;
                                console.log(allCheck, "allcheck");
                                if (allCheck) {
                                    var servicesAvailable = [];
                                    /*if (appointment.superSetServices && appointment.superSetServices.length != 0) {
                                        _.forEach(allServiceOfAppointments, function(as) {
                                            var de = _.filter(appointment.services, function(se) { return se._id + "" == as._id + "" })[0]
                                            if (de) {
                                                realServices.push(Appointment.reinitAppointmentService(as, de.quantity));
                                                if (de.quantity != as.quantity) {
                                                    servicesAvailable.push(Appointment.reinitAppointmentService(as, as.quantity - de.quantity));
                                                }
                                            } else {
                                                servicesAvailable.push(as);
                                            }
                                        });
                                    } else {*/
                                        _.forEach(allServiceOfAppointments, function(as) {
                                            realServices.push(as);
                                        });
                                    // }

                                    user.servicesAvailable = user.servicesAvailable ? user.servicesAvailable : [];
                                    if (servicesAvailable.length > 0) {
                                        user.servicesAvailable.push({ services: servicesAvailable, parlorId: appointment.parlorId, expiryDate: servicesAvailable[0].expiryDate, rating: par.rating, parlorName: appointment.parlorName, appointmentId: appointment.id, parlorAddress: appointment.parlorAddress, parlorId: appointment.parlorId });
                                    }

                                    updateObj.servicesAvailable = user.servicesAvailable;
                                    var appointmentUpdateObj = { cashbackUsed: cashbackUsed, superSetServices: [], services: realServices, productRevenue: productRevenue, facebookId: user.facebookId, status: req.body.status, appointmentEndTime: new Date(), closedBy: ObjectId.isValid(req.session.userId) ? req.session.userId : null, updatedAt: new Date() };
                                    if (req.body.status == 3) appointmentUpdateObj.invoiceId = newInvoiceId;
                                    if(req.body.status == 2){
                                        console.log("sahiiiiiiiii------------------->>>>>>>>>>>" , user.phoneNumber)
                                        message="Your appointment has been cancelled successfully.";
                                        url=getSmsUrl('BEUSLN', message, [user.phoneNumber], 'T');
                                        Appointment.sendSMS(url, function(e) {
                                            
                                        });
                                    }

                                    Appointment.update({ _id: req.body.appointmentId, status: { $in: [1, 4] } }, appointmentUpdateObj, function( err, status) {
                                        Admin.updateMany({ _id: { $in: employeesID } }, { $inc: { clientServed: 1 } }, function(err, employee) {
                                            if (req.body.status == 3) {
                                                Appointment.recentTenRatingAvg(appointment.parlorId);
                                                if(productsUsedInService.length > 0){
                                                    console.log("productsUsedInService-----------------------------");
                                                    ParlorItem.consumeParlorProducts(productsUsedInService, appointment.parlorId, function(){
                                                        console.log("done consume products")
                                                    });
                                                }
                                                if(appointment.personalCouponCode){
                                                    SalonPersonalCoupon.update({couponCode : appointment.personalCouponCode, active : true}, {active : false, appointmentId : appointment.id}, function(er, ap){
                                                        console.log("done salon personal couponcode update")
                                                    })
                                                }
                                                // Appointment.appRevenuePercentage(appointment.parlorId);
                                                Appointment.averageNoOfClientsPerDay(appointment.parlorId);
                                                Appointment.addMarketingNotification(0, new Date(), appointment.services, appointment.client.id, function() {

                                                });
                                                console.log("req.body.statussssss")
                                                if (user.subscriptionId) {
                                                    
                                                    LuckyDrawDynamic.onSubscription(ObjectId(req.body.appointmentId), user.subscriptionId);
                                                }
                                                if ((appointment.paymentMethod == 5 || appointment.paymentMethod == 10) && appointment.payableAmount>=2000){
                                                    
                                                    LuckyDrawDynamic.incentiveOnlinePayment(ObjectId(req.body.appointmentId));
                                                }

                                                Offer.update({ code: appointment.couponCode }, { active: false }, function(err, d) {
                                                    console.log(updateObj);
                                                    updateObj.recent = { createdAt: new Date(), parlorId: appointment.parlorId };
                                                    User.update(query, updateObj, function(err, newItem) {
                                                        console.log(newItem);
                                                        if (appointment.creditUsed != 0 && appointment.membershipSaleId) {
                                                            var membershipHistoryObj = {
                                                                userId: user.id,
                                                                parlorId: appointment.parlorId,
                                                                appointmentId: appointment.id,
                                                                parlorName: appointment.parlorName,
                                                                parlorAddress: appointment.parlorAddress,
                                                                name: user.firstName,
                                                                appointmentDate: appointment.appointmentStartTime,
                                                                phoneNumber: user.phoneNumber,
                                                                createdAt: new Date(),
                                                                creditUsed: appointment.creditUsed,
                                                            };
                                                            var incObj2 = { creditsLeft: -1 * appointment.creditUsed };
                                                            ActiveMembership.update({ _id: appointment.membershipSaleId }, { $inc: incObj2, $push: { history: membershipHistoryObj } }, function(err, d) {
                                                                console.log("updated activeMembership");
                                                            });
                                                        }
                                                        Appointment.sendAppointmentMail(appointment, user.emailId, function() {})

                                                        if (appointment.buySubscriptionId && appointment.paymentMethod != 5) {
                                                            // var subscriptionAmount = appointment.subscriptionAmount >= 1699 ? 1699 : 899;

                                                            Appointment.addSubscriptionToUser(appointment.parlorId, user.id, user.createdAt, { id: "cash" + (new Date().getTime()) }, appointment.subscriptionAmount, appointment.subscriptionReferralCode, 'default', function(r) {

                                                            });
                                                        }


                                                        if (appointment.products.length > 0 && parseInt(req.body.status) == 3) { 
                                                            var items = _.map(appointment.products, function(p) { return { amount: -1 * p.quantity, itemId: p.productId }; });
                                                            ParlorItem.consumeItem(req, items, true, function(err, newItems) {
                                                                updateLoyalityToReferer(getFreebies.loyality, user.referCodeBy, user.id, user.firstName, user.firebaseId, user.firebaseIdIOS, req.body.appointmentId, function() {
                                                                    return callback(err, { items: newItems });
                                                                });
                                                            });
                                                        } else {
                                                            updateLoyalityToReferer(getFreebies.loyality, user.referCodeBy, user.id, user.firstName, user.firebaseId, user.firebaseIdIOS, req.body.appointmentId, function() {
                                                                return callback(err, status);
                                                            });
                                                        }
                                                    });
                                                });

                                            } else {
                                                Appointment.refundLoyality(appointment, appointment.client.id, function(err, done) {
                                                    return callback(err, status);
                                                });
                                            }
                                        });
                                    });
                                } else {
                                    return callback(true, 'Undefined Credits');
                                }
                            });
                        });
                    });
                });
                });
        });
    });
};


appointmentSchema.statics.addMarketingNotification = function(previousDate, appointmentDate, appointmentServices, userId, cb) {
    var serviceCodes = _.map(appointmentServices, function(s) { return s.serviceCode });
    var serviceIds = _.map(appointmentServices, function(s) { return s.serviceId });
    User.findOne({ _id: userId }, { phoneNumber: 1, firebaseId: 1, firebaseIdIOS: 1, emailId: 1 }, function(err, d) {
        Service.find({ serviceCode: { $in: serviceCodes } }, { smsContent: 1, notificationTitle: 1, notificationContent: 1, serviceRepeatDay: 1, repeatDaysInterval: 1, serviceCode: 1 }, function(err, services) {
            var data = [];
            _.forEach(services, function(s, key) {
                var sendTime = HelperService.addDaysToDate(new Date(), s.serviceRepeatDay + key);
                if (previousDate) {
                    sendTime = HelperService.addDaysToDate(appointmentDate, s.serviceRepeatDay + key);
                    if (HelperService.getNoOfDaysDiff(new Date(), sendTime) > 0) {
                        sendTime = HelperService.addDaysToDate(new Date(), 1 + key);
                    }
                }
                data.push({
                    userId: userId,
                    type: 3,
                    serviceId: s._id,
                    sendTime: sendTime,
                    phoneNumber: d.phoneNumber,
                    firebaseId: d.firebaseId,
                    firebaseIdIOS: d.firebaseIdIOS,
                    repeatDaysInterval: s.repeatDaysInterval,
                    emailId: d.emailId,
                    smsContent: s.smsContent,
                    notificationTitle: s.notificationTitle,
                    notificationContent: s.notificationContent
                });
            });
            MarketingSchedular.remove({ userId: userId, serviceId: { $in: serviceIds } }, function(er, f) {
                MarketingSchedular.create(data, (err, created) => {
                    return cb();
                });
            });
        });
    });
};


appointmentSchema.statics.reinitAppointmentService = function(service, quantity) {
    var s = JSON.parse(JSON.stringify(service));
    var realQuantity = service.quantity;
    s.quantity = quantity;
    s.loyalityPoints = (s.loyalityPoints / realQuantity) * quantity;
    s.subtotal = (s.subtotal / realQuantity) * quantity;

    return s;
};

appointmentSchema.statics.recentTenRatingAvg = function(parlorId){
    Appointment.aggregate([{$match : {parlorId:ObjectId(parlorId), status:3, 'review.rating' :{$gt:0} }},
            {$sort: {appointmentStartTime:-1}} , 
            {$limit :10} , 
            {$group :{_id: '$parlorId',rating :{$sum : '$review.rating'} , count: {$sum:1}}},
            {$project: {recentTenRatingAvg : {$divide :['$rating' , "$count"]}}}] , function(err, agg){
                console.log(agg)
                if(agg.length>0){
                    var recentTenRatingAvg = agg[0].recentTenRatingAvg.toFixed(1)
                    Parlor.update({_id : agg[0]._id} ,{recentTenRatingAvg : recentTenRatingAvg} , function(err, update){
                        if(!err)
                            console.log('recentTenRatingAvg done');
                        else
                            console.log('recentTenRatingAvg error');
                    });
                }else
                    console.log('recentTenRatingAvg else');
            });
};

appointmentSchema.statics.averageNoOfClientsPerDay = function(parlorId){
    Parlor.findOne({_id: parlorId}, {services: 0 , packages :0}, function(err, parl){
        Appointment.aggregate([{$match : {parlorId:ObjectId(parlorId), status:3 , appointmentStartTime :{$gte :HelperService.getLastMonthStart()}}},
                                {$group : {_id: '$parlorId' , totalRevenue :{$sum : '$serviceRevenue'}}}], function(err, appts){
            Appointment.find({parlorId:ObjectId(parlorId), status:3 , appointmentStartTime :{$gte :HelperService.getLastMonthStart()}},
                {services: 0}, function(err, distanceAppts){
                   if(appts && appts.length>0){
                        var totalRevenue = appts[0].totalRevenue, averageRevenue = 0, distanceRevenue = 0 , appDistanceRevenueFirstTime= 0;
                        if(distanceAppts && distanceAppts.length>0){

                            _.forEach(distanceAppts , function(a){
                                if(a.latitude == null)a.latitude = 0;
                                if(a.longitude == null)a.longitude = 0;

                                if ( a.appointmentType == 3 || a.couponCode || a.mode==5) {
                                    var distance = HelperService.getDistanceBtwCordinates1(parl.geoLocation[1] , parl.geoLocation[0] , a.latitude , a.longitude)

                                    if ((distance >= 0.05 && a.appointmentType == 3) || a.mode == 5 || a.couponCode) {
                                        distanceRevenue += a.serviceRevenue;
                                        if (parl.parlorType != 4 && (a.client.noOfAppointments == 0 || a.couponCode || a.mode == 5)) {
                                            appDistanceRevenueFirstTime += a.serviceRevenue;
                                        }else if(parl.parlorType == 4){
                                            appDistanceRevenueFirstTime += a.serviceRevenue;
                                        }
                                    }
                                }
                            })
                        }
                        if(distanceRevenue >0 && totalRevenue >0){
                            averageRevenue = (distanceRevenue/totalRevenue).toFixed(2);
                        }
                        var finalAmount = (appDistanceRevenueFirstTime / parl.avgRoyalityAmount);
                        console.log(finalAmount, appDistanceRevenueFirstTime ,parl.avgRoyalityAmount)
                    Parlor.update({_id: parl._id} ,{averageNoOfClientsPerDay: finalAmount } , function(err, update){
                        if(!err)
                        console.log('recentTenRatingAvg done');
                    else
                        console.log('recentTenRatingAvg error');
                });
            }else
                console.log('recentTenRatingAvg else');
            });
        });
    });
};

//Current Happy Hour
appointmentSchema.statics.appRevenuePercentage = function(parlorId ){
    Parlor.findOne({_id: parlorId}, {services: 0 , packages :0}, function(err, parl){
        Appointment.aggregate([{$match : {parlorId:ObjectId(parlorId), status:3 , appointmentStartTime :{$gte :HelperService.getLastMonthStart()}}},
                                {$group : {_id: '$parlorId' , totalRevenue :{$sum : '$serviceRevenue'}}}], function(err, appts){
            Appointment.find({parlorId:ObjectId(parlorId), status:3 , appointmentStartTime :{$gte :HelperService.getLastMonthStart()}},
                {services: 0}, function(err, distanceAppts){
                   if(appts && appts.length>0){
                        var totalRevenue = appts[0].totalRevenue, averageRevenue = 0, distanceRevenue = 0 , appDistanceRevenueFirstTime= 0;
                        if(distanceAppts && distanceAppts.length>0){

                            _.forEach(distanceAppts , function(a){
                                if(a.latitude == null)a.latitude = 0;
                                if(a.longitude == null)a.longitude = 0;

                                if ( a.appointmentType == 3 || a.couponCode || a.mode==5) {
                                    var distance = HelperService.getDistanceBtwCordinates1(parl.geoLocation[1] , parl.geoLocation[0] , a.latitude , a.longitude)

                                    if ((distance >= 0.05 && a.appointmentType == 3) || a.mode == 5 || a.couponCode) {
                                        distanceRevenue += a.serviceRevenue;
                                        if (a.client.noOfAppointments == 0 || a.couponCode || a.mode == 5) appDistanceRevenueFirstTime += a.serviceRevenue;
                                    }
                                }
                            })
                        }
                        if(distanceRevenue >0 && totalRevenue >0){
                            averageRevenue = (distanceRevenue/totalRevenue).toFixed(2);
                        }
                        var finalAmount = (appDistanceRevenueFirstTime / parl.avgRoyalityAmount);

                    Parlor.update({_id: parl._id} ,{appRevenuePercentage : finalAmount, appDistanceRevenue : distanceRevenue, appDistanceRevenueFirstTime: appDistanceRevenueFirstTime } , function(err, update){
                        if(!err)
                        console.log('recentTenRatingAvg done');
                    else
                        console.log('recentTenRatingAvg error');
                });
            }else
                console.log('recentTenRatingAvg else');
            });
        });
    });
};


appointmentSchema.statics.refundLoyality = function(appointment, userId, callback) {
    var now_date = new Date();
    now_date.setMonth(now_date.getMonth() + 1);
    var loyalityPointUsed = appointment.loyalityPoints - appointment.loyalityOffer - appointment.loyalitySubscription;
    _.forEach(appointment.services, function(ser) {

        if (ser.discountMedium == "frequency" && ser.dealPriceUsed == true && ser.serviceCode == 502) {
            User.update({ _id: userId }, { $push: { freeServices: { expires_at: now_date, createdAt: new Date(), categoryId: "58707ed90901cc46c44af279", serviceId: "59520f3b64cd9509caa273ec", code: 502, dealId: null, parlorId: null, noOfService: 1, price: 600, name: "Classic Express Wax", description: "Full Arms + Full Legs + Underarms", discount: 300, source: "download", brandId: "594b99fcb2c790205b8b7d93", priceId: 502 } } }, function(err, freeService) {
                console.log(err);

            });
        }
        if (ser.discountMedium == "frequency" && ser.dealPriceUsed == true && ser.serviceCode == 52) {
            User.update({ _id: userId }, { $push: { freeServices: { expires_at: now_date, createdAt: new Date(), categoryId: "58707ed90901cc46c44af27b", serviceId: "58707eda0901cc46c44af2eb", code: 52, dealId: null, parlorId: null, noOfService: 1, price: 300, name: "Male Hair Cut", description: "Includes blowdry, shampoo and conditioner", discount: 150, source: "download", brandId: "", priceId: 52 } } }, function(err, freeService) {
                console.log(err);

            });
        }
        if (ser.discountMedium == "frequency" && ser.dealPriceUsed == true && ser.serviceCode == 202) {
            User.update({ _id: userId }, { $push: { freeServices: { expires_at: now_date, createdAt: new Date(), categoryId: ser.categoryId, serviceId: ser.serviceId, code: 202, dealId: null, parlorId: null, noOfService: 1, price: 600, name: ser.name, discount: 300, description: "Includes blowdry, shampoo and conditioner", source: "download", brandId: "", priceId: 202 } } }, function(err, freeService) {
                console.log(err);

            });
        }
        
        if (loyalityPointUsed > 0) {
            Appointment.refundLoyalityPoints(userId, appointment, 0, function(err, response) {
                return callback(err, response);
            })
        } else {
            return callback(null, 'done');
        }
    })
};

appointmentSchema.statics.refundLoyalityPoints = function(userId, appointment, amount, callback) {
    var loyalityPointUsed = appointment.loyalityPoints - appointment.loyalityOffer;
    if (amount > 0) loyalityPointUsed = -1 * loyalityPointUsed;
    User.find({ _id: userId, 'creditsHistory.reason': amount > 0 ? 'Used for Appointment' : 'Refunded for Appointment', 'creditsHistory.reason': appointment.id }, function(err, found) {
        if (found.length < 2 && loyalityPointUsed != 0) {
            User.findOne({ _id: userId }, function(err, newUserObj) {
                var userLoyalityPoints = newUserObj.loyalityPoints + loyalityPointUsed;
                User.update({ _id: userId }, { loyalityPoints: userLoyalityPoints, $push: { creditsHistory: { createdAt: new Date(), amount: loyalityPointUsed, balance: userLoyalityPoints, source: appointment.id, reason: 'Refunded for Appointment' } } }, function(err, d) {
                    return callback(err, d);
                });
            });
        } else {
            return callback(false, null);
        }
    });
};

function updateLoyalityToReferer(loyalityCredited, referal, userId, firstName, firebaseId, firebaseIdIOS, appointmentId, callback) {
    var referCode = referal ? referal : '9045^&dsGJpCGKOP';
    var loyalityPoints = 0,
        corporateReferralCount = 0;
    var now_date = new Date();
    now_date.setMonth(now_date.getMonth() + 1);
    User.findOne({ referCode: referCode }, function(err, user2) {
        if (user2) {
            Appointment.count({ 'client.id': userId, status: 3 }, function(err, count) {
                if (count == 1) {
                    if (user2.isCorporateUser) corporateReferralCount = 1;
                    // var loyalityPoints2 = user2.loyalityPoints ? user2.loyalityPoints + loyalityPoints : loyalityPoints;
                    // User.update({_id : user2.id}, { $inc : {corporateReferralCount : corporateReferralCount}, loyalityPoints : loyalityPoints2, $push :{creditsHistory :  {  createdAt: new Date(), amount: loyalityPoints, balance : loyalityPoints2, source : appointmentId, reason : 'Referal Service'   }}}, function(e, u){
                    User.update({ _id: user2.id }, { $inc: { corporateReferralCount: corporateReferralCount }, $push: { couponCodeHistory: { active: true, code: "REFER25", createdAt: new Date(), couponType: 5, expires_at: now_date } } }, function(e, u) {
                        sendReviewNotification(loyalityCredited, userId, firstName, firebaseId, firebaseIdIOS, appointmentId);
                        sendReferalNotification(user2);
                        sendEmployeeNotification(appointmentId);
                        return callback();
                    });
                } else {
                    sendReviewNotification(loyalityCredited, userId, firstName, firebaseId, firebaseIdIOS, appointmentId);
                    sendEmployeeNotification(appointmentId);
                    return callback();
                }
            });
        } else {
            sendReviewNotification(loyalityCredited, userId, firstName, firebaseId, firebaseIdIOS, appointmentId);
            sendEmployeeNotification(appointmentId);
            return callback();
        }
    });
}


function sendEmployeeNotification(appointmentId) {

    // LuckyDrawDynamic.onProductPurchase(appointmentId);
    // LuckyDrawDynamic.onServiceBill(appointmentId);
     //LuckyDrawDynamic.onAvgBill(appointmentId);
    // LuckyDrawDynamic.onTransaction(appointmentId);
    // LuckyDrawDynamic.onMembershipSold(appointmentId);
    //LuckyDrawDynamic.employeeSelection(appointmentId);
    
    Appointment.findOne({ _id: appointmentId }, { _id: 1, employees: 1, services: 1, parlorId: 1, serviceRevenue: 1, createdAt: 1 , mode : 1}, function(err, appointment) {
        //if(appointment.mode == 6)LuckyDrawDynamic.billingApp(appointmentId);
        var async = require('async');
        async.each(appointment.employees, function(emp, callback) {
                var firebaseIds = []
                Admin.findOne({ _id: emp.employeeId }, { firebaseId: 1 }, function(err, employee) {
                    var revenue = 0;
                    _.forEach(appointment.services, function(s) {
                        var obj = [{
                            employeeId: "" + emp.employeeId,
                            totalRevenueEmp: 0,
                        }];
                        var serviceRevenue = Appointment.serviceFunction(appointment.createdAt, s, obj);
                        revenue += serviceRevenue.employees[0].totalRevenueEmp;
                    });
                    var title = 'Appointment has been completed';
                    var body = 'You have earned Revenue of: ' + revenue;
                    var type = 'appointmentRevenue';
                    // sendIonicNotification : function(firebaseId, title, body, type, callback){
                    ParlorService.sendIonicNotification(employee.firebaseId, title, body, type, appointmentId, function() {

                        //Owner and Manager Notification
                        
                    });
                })

            },
            function(err) {
                Admin.find({ $and: [{ $or: [{ parlorIds: appointment.parlorId }, { parlorId: appointment.parlorId }] }, { role: { $in: [2, 7] } }] }, { firebaseId: 1 }, function(err, empl) {
                        _.forEach(empl, function(e) {
                            firebaseIds.push(e.firebaseId);
                        })
                        var title = 'Appointment has been completed';
                        var body = 'Total Revenue Earned by Salon is: ' + appointment.serviceRevenue;
                        var type = 'appointmentRevenue';
                        _.forEach(firebaseIds, function(firebaseId) {
                            ParlorService.sendIonicNotification(firebaseId, title, body, type, appointmentId, function() {
                                // callback();
                            });
                        })
                    });
            });
    });
}


function sendReferalNotification(user) {
    User.findOne({ _id: user.id, $or: [{ firebaseId: { $ne: null } }, { firebaseIdIOS: { $ne: null } }] }).exec(function(err, user) {
        if (user) {
            // var title = '200 Freebie credited';
            var title = 'Received Coupon Code';
            var body = 'Your friend has completed appointment at Be U';
            Notification.create({ userId: user.id, action: 'freebie', title: title, body: body }, function(err, n) {
                Appointment.sendAppNotification(user.firebaseId, title, body, { type: 'freebie' }, n.id, function(err, response) {

                    //empty
                });
                Appointment.sendAppNotificationIOS(user.firebaseIdIOS, title, body, null, 'freebie', n.id, function(err, response) {

                });
            });
        }
    });
}

function createRecommendation(appId) {
    var title = "Recommended for You";
    Appointment.findOne({ _id: appId }, { "services.serviceId": 1, "services.name": 1, "client": 1, appointmentStartTime: 1 }).exec(function(err, appointment) {
        var appServiceId = [];
        _.forEach(appointment.services, function(serv) {
            appServiceId.push(serv.serviceId);
        });
        Recommendation.find({ "services.serviceId": { $in: appServiceId } }).exec(function(err, recomm) {
            _.forEach(recomm, function(r) {
                var serviceName = "";
                _.forEach(r.services, function(service) {
                    var f = _.filter(appointment.services, function(appService) { return appService.serviceId + "" == service.serviceId + "" })[0];
                    if (f) serviceName = f.name;
                })
                var str = r.descriptionNotification,
                    desc1 = str.replace(/%name%/i, '' + appointment.client.name + ''),
                    desc = desc1.replace(/%service%/i, '' + serviceName + '');
                var smsStr = r.descriptionSMS,
                    desc2 = smsStr.replace(/%name%/i, '' + appointment.client.name + ''),
                    smsDesc = desc2.replace(/%service%/i, '' + serviceName + '');
                var date = (appointment.appointmentStartTime);
                var sDate = HelperService.addDaysToDate(date, r.days);

                Notification.create({ userId: appointment.client.id, action: 'recommendation', title: title, body: desc, sent: false, sendingDate: sDate, sendSms: true, smsContent: smsDesc }, function(err, object) {
                    if (object)
                        console.log("done")
                })
            })
        })
    })
}

function sendReviewNotification(loyalityCredited, userId, firstName, firebaseId, firebaseIdIOS, appointmentId) {
    var title = "We're all ears";
    var message = 'Earn Rs 25 B-Cash On Reviewing Our Services.*';
    var serviceRevenue = 0;
    Appointment.findOne({ _id: appointmentId }, { services: 1, createdAt: 1 }, function(err, appt) {
        _.forEach(appt.services, function(s) {
            serviceRevenue += Appointment.serviceFunction(appt.createdAt, s, []).totalRevenue;
        });
        Appointment.update({ _id: appointmentId }, { serviceRevenue: serviceRevenue }, function(err, d) {
            if (loyalityCredited > 0) sendCashbackReferal(loyalityCredited, userId, firstName, firebaseId, firebaseIdIOS, 1);
            Notification.update({ appointmentId: appointmentId, action: 'started' }, { active: false }, function(err, u) {
                Notification.create({ userId: userId, action: 'review', title: title, body: message, appointmentId: appointmentId }, function(err, n) {
                    console.log(err);
                    Appointment.sendAppNotification(firebaseId, title, message, { appointmentId: appointmentId, type: 'review' }, n.id, function(err, response) {

                    });
                    Appointment.sendAppNotificationIOS(firebaseIdIOS, title, message, appointmentId, 'review', n.id, function(err, response) {

                    });
                    createRecommendation(appointmentId, function(err, response) {

                    });

                });
            });
        });
    });
}


function sendCashbackReferal(loyalityCredited, userId, firstName, firebaseId, firebaseIdIOS, type) {
    var title = 'Freebies Points';
    var body = ('Hey ' + firstName + ', ') + (type ? ' your Rs ' + loyalityCredited + ' B-Cash has been successfully credited to your freebie account.' : ' you have earned Rs ' + loyalityCredited + ' B-Cash which will be credited to your freebie account post appointment');
    if (loyalityCredited > 0) {
        Notification.create({ userId: userId, action: 'freebie', title: title, body: body }, function(err, n) {
            Appointment.sendAppNotification(firebaseId, title, body, { type: 'freebie' }, n.id, function(err, response) {
                //empty
            });
            Appointment.sendAppNotificationIOS(firebaseIdIOS, title, body, null, 'freebie', n.id, function(err, response) {

            });
        });
    }
}


appointmentSchema.statics.getFreebiesPoints = function(paymentMethod, appointment, count, type, isCorporate) {
    var percentage = ParlorService.getPercentageCashback(paymentMethod, count, isCorporate);
    var loyality = 0,
        cashbackUsed = false;
    var reason = '';
    var newSubtotal = parseInt(appointment.subtotal - appointment.loyalityPoints - appointment.membershipDiscount - appointment.creditUsed);
    var loyality = parseInt((newSubtotal * percentage) / 100);
    loyality = loyality > 500 ? 500 : loyality;
    reason = count == 0 ? (percentage + '% cashback') : (percentage + '% cashback');
    /*if (paymentMethod == 1) newSubtotal = parseInt((newSubtotal * percentage) / 100);
    if (appointment.razorPayCaptureResponse || type) {
        if (type || appointment.razorPayCaptureResponse.status == "captured") {
            loyality = count == 0 ? newSubtotal > 10000 ? 10000 : newSubtotal : loyalityPoints;
            reason = count == 0 ? (percentage + '% cashback') : (percentage + '% cashback');
            if (appointment.membershipAmount > 0) loyality = parseInt(appointment.membershipAmount / 1.18);
        }
    }*/
    loyality = parseFloat(loyality.toFixed(2));
    if (percentage>0) cashbackUsed = true;
    return { loyality: loyality, reason: reason, cashbackUsed: cashbackUsed };
}





function getNewActiveMembership(activeMembership, creditsUsed, membershipId) {
    var data = [];
    _.forEach(activeMembership, function(a) {
        if (a.membershipId.equals(membershipId)) {
            var left = a.creditsLeft - creditsUsed;
            if (left <= 0) {
                creditsUsed -= a.creditsLeft;
            } else {
                a.creditsLeft -= creditsUsed;
                creditsUsed = 0;
                data.push(a);
            }
        } else {
            data.push(a);
        }

    });
    return data;
}

appointmentSchema.statics.createAppointmentIdForUser = function(u, req, oldLoyalityPoints, callback) {
    Appointment.findOne({ _id: req.body.appointmentId }, { loyalityPoints: 1, subtotal: 1, "services.price": 1, "services.serviceCode": 1, "services.brandId": 1, couponLoyalityCode: 1 }, function(err, appt) {
        // u.activeMembership = [];
        var buyMembershipId = req.body.buyMembershipId || null;
        var buySubscriptionId = req.body.buySubscriptionId || null;
        var useMembershipCredits = req.body.useMembershipCredits;
        var useSubscriptionCredits = req.body.useSubscriptionCredits;

        if (buySubscriptionId && parseInt(req.body.paymentMethod) == 1) useSubscriptionCredits = 0;
        var membershipAmount = 0,
            subscriptionAmount = 0;
        var couponCodeObj = {};
        u.couponCodeHistory.push(HelperService.get24HrsCouponCode());
        if (u.couponCodeHistory && u.couponCodeHistory.length > 0) {
            var couponObjInUser = _.filter(u.couponCodeHistory, function(uc) { return uc._id + "" == req.body.couponCodeId })[0];
            if (couponObjInUser) {
                if ((couponObjInUser.couponType == 2 && HelperService.getNoOfHrsDiff(new Date(req.body.datetime), new Date()) >= 24) || (couponObjInUser.couponType != 2 && couponObjInUser.couponType != 7)) {
                    couponCodeObj = ConstantService.couponCodeDetails(couponObjInUser.couponType, couponObjInUser.code, null);
                    couponCodeObj.code = couponObjInUser.code;
                    couponCodeObj.couponId = couponObjInUser.id;
                } else if (couponObjInUser.couponType == 7) {
                    _.forEach(appt.services, function(ser) {
                        if (ser.serviceCode == 96 && ser.brandId == "5935646e00868d2da81bb91c") {
                            var percentage = ((ser.price - appt.loyalityPoints * (ser.price / appt.subtotal) - (1500 / 1.18)) / (appt.subtotal - appt.loyalityPoints)) * 100;
                            couponCodeObj = ConstantService.couponCodeDetails(couponObjInUser.couponType, couponObjInUser.code, percentage);
                            couponCodeObj.code = couponObjInUser.code;
                            couponCodeObj.couponId = couponObjInUser.id;
                        }
                    })
                }
            }
        }
        var newCouponCode = ConstantService.couponCodeUnavailableOnApp(req.body.couponCode);
        if (newCouponCode) {
            couponCodeObj = newCouponCode;
        }

        Membership.findOne({ _id: buyMembershipId }, { price: 1, tax: 1, name: 1, credits: 1, menuDiscount: 1, dealDiscount: 1, freeThreading: 1, freeHairCut: 1 }, function(err, membership) {
            if (membership) {
                membershipAmount = parseInt(membership.price + (membership.price * membership.tax) / 100);
                u.activeMemberships = [{
                    name: membership.name,
                    credits: membership.credits,
                    parlorId: localVar.getMembershipParlorId(),
                    membershipId: membership.id,
                    amount: membership.price,
                    menuDiscount: membership.menuDiscount,
                    dealDiscount: membership.dealDiscount,
                    creditsLeft: membership.credits,
                    freeThreading: membership.freeThreading,
                    noOfFreeHairCut: membership.freeHairCut,
                    membershipSaleId: localVar.getMembershipParlorId(),
                }];
            }

            Subscription.findOne({ subscriptionId: buySubscriptionId }, { price: 1, subscriptionId: 1, loyality: 1 }, function(err, subscription) {
                if (subscription) {
                    subscriptionAmount = subscription.price;
                    u.subscriptionId = subscription.subscriptionId;
                    u.subscriptionLoyality = subscription.loyality;
                    u.subscriptionRedeemMonth = { amount: subscription.loyality, month: -1 };
                } else {
                    u.subscriptionLoyality = u.subscriptionLoyality || 0;
                }
                var user = User.parse(u, req.body.parlorId);
                user.id = user.userId;
                var redeemableLoyality = 0;
                User.getSubscriptionLeftByMonthv4(user.id, req.body.datetime, user.subscriptionLoyality, function(reed) {
                    redeemableLoyality = reed;
                    Parlor.findOne({ _id: req.body.parlorId }, { parlorType : 1, tax: 1, name: 1, address: 1, address2: 1, phoneNumber: 1, "services.serviceCode": 1, "services.serviceId": 1, "services.prices.estimatedTime": 1, "services.prices.additions": 1, "services.prices.price": 1, "services.prices.tax": 1, "services.prices.brand": 1, "services.serviceId": 1, "services.categoryId": 1, "services.name": 1, "services.priceId": 1 }, function(err, parlor) {
                        Service.find({}, { gstDescription: 1, estimatedTime : 1 , gstNumber: 1, prices: 1, serviceCode: 1, name: 1 }, function(err, allServices) {
                            Slab.find({}, function(err, slabs) {
                                Appointment.findOne({ parlorId: req.body.parlorId }, { parlorAppointmentId: 1 }).sort({ parlorAppointmentId: -1 }).exec(function(err, doc) {
                                    var count = doc ? doc.parlorAppointmentId : 0;
                                    Deals.getActiveDeals2(req.body.parlorId, req.body.datetime, function(deals) {
                                        var obj = Appointment.getServiceObj(parlor.tax, parlor.services, req.body.services, deals, user, req.body.parlorId, req.body.useLoyalityPoints, oldLoyalityPoints, req, slabs, useMembershipCredits, allServices, parlor.twoPLusOneDealAvailable, req.body.datetime, req.body.adjustFreeService, couponCodeObj, useSubscriptionCredits, redeemableLoyality, [], null);
                                        var appointmentObj = {
                                            paymentMethod: req.body.paymentMethod,
                                            parlorName: parlor.name,
                                            parlorTax: parlor.tax,
                                            parlorType : parlor.parlorType,
                                            comment: req.body.comment,
                                            parlorAddress: parlor.address,
                                            parlorAddress2: parlor.address2,
                                            latitude: req.body.latitude || 0,
                                            longitude: req.body.longitude || 0,
                                            contactNumber: parlor.phoneNumber,
                                            appointmentType: req.body.isBillingApp ? 1 : 3,
                                            parlorId: req.body.parlorId,
                                            subscriptionReferralCode: req.body.subscriptionReferralCode,
                                            client: user,
                                            loyalitySubscription: obj.redeemableLoyality,
                                            membershipSaleId: obj.membershipSaleId,
                                            receptionist: null,
                                            couponCode: null,
                                            appointmentStartTime: req.body.datetime,
                                            appointmentOriginalStartTime: req.body.datetime,
                                            status: req.body.isBillingApp ? 1 : 0,
                                            estimatedTime: obj.estimatedTime,
                                            freebiesThreading: obj.freebiesThreading,
                                            loyalityOffer: obj.loyalityOffer,
                                            services: obj.services,
                                            tax: obj.tax,
                                            products: [],
                                            employees: [],
                                            buyMembershipId: null,
                                            buySubscriptionId: buySubscriptionId,
                                            membershipAmount: membershipAmount,
                                            subscriptionAmount: subscriptionAmount,
                                            membersipCreditsLeft: obj.membershipCreditsLeft,
                                            creditUsed: obj.creditUsed,
                                            membershipId: obj.membershipId,
                                            membershipType: obj.membershipType,
                                            membershipDiscount: obj.membershipDiscount,
                                            otherCharges: 0,
                                            loyalityPoints: obj.loyalityPoints,
                                            couponLoyalityPoints: obj.couponLoyalityPoints,
                                            couponLoyalityCode: couponCodeObj.code,
                                            couponCodeId: couponCodeObj.couponId,
                                            subtotal: obj.subtotal,
                                            discount: 0,
                                            cashback: 0,
                                            mode: req.body.mode || 3,
                                            otp: Math.floor(Math.random() * 9000) + 1000,
                                            productPrice: 0,
                                            payableAmount: Math.ceil(obj.payableAmount),
                                            parlorAppointmentId: ++count
                                        };
                                        if (obj.cancelRequest) {
                                            return callback(CreateObjService.response(true, 'Invalid quantity'));
                                        } else if (!req.body.appointmentId) {
                                            Appointment.create(appointmentObj, function(err, appointment) {
                                                console.log(err);
                                                console.log("err");
                                                if (err) return callback(CreateObjService.response(true, 'Data error'));
                                                else return callback(CreateObjService.response(false, { appointmentId: appointment.id, parlorId: req.body.parlorId }));
                                            });
                                        } else {
                                            Appointment.update({ _id: req.body.appointmentId }, appointmentObj, function(err, appointment) {
                                                appointmentObj.id = req.body.appointmentId;
                                                if (err) return callback(CreateObjService.response(true, 'Data error'));
                                                else return callback(CreateObjService.response(false, Appointment.parseSingleAppointmentForApp(appointmentObj, false, parlor.tax)));
                                            });
                                        }

                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    })
};

appointmentSchema.statics.addThreadingService = function(threadingServices, appointmentServices) {
    _.forEach(threadingServices, function(th) {
        if (!_.filter(appointmentServices, function(s) { return th.prices[0].priceId == s.code })[0]) {
            appointmentServices.push({
                serviceCode: th.serviceCode,
                code: th.prices[0].priceId,
                serviceId: th.serviceId,
                type: 'service',
                quantity: 1,
                addition: 0,
                typeIndex: 0,
                frequencyUsed: false,
            });
        }
    });
};


appointmentSchema.statics.getServiceObj = function(tax, originalServices, appointmentServices, deals, user, parlorId, useLoyalityPoints, oldLoyalityPoints, req, slabs, useMembershipCredits, allServices, twoPLusOneDealAvailable, datetime, adjustFreeService, couponCodeObj, useSubscriptionCredits, redeemableLoyality, flashCoupons, appRevenueDiscountPercentage) {
    console.log("appointmentServices");
    // appointmentServices = JSON.parse(appointmentServices);
    var estimatedTime = 0,
        services = [],
        subtotal = 0,
        loyalityPointsUsed = 0,
        cancelRequest = false,
        freebiesThreading = 0,
        couponLoyalityPoints = 0;
    var threadingServices = _.filter(originalServices, function(s) { return s.serviceCode == 271 || s.serviceCode == 274 });
    if (req.body.useFreeThreading) Appointment.addThreadingService(threadingServices, appointmentServices);
    var freeServiceDealPrices = [],
        newPackageServices = [];
    var isNewPackage2 = false;
    _.forEach(appointmentServices, function(service) {
        service.quantity = parseInt(service.quantity);
        service.serviceCode = parseInt(service.serviceCode);
        // if(service.serviceCode == 502 && (service.brandId=="" || !service.brandId))service.brandId = "594b99fcb2c790205b8b7d93";
        if (service.quantity != 1) twoPLusOneDealAvailable = false;
        if (service.type == "serviceAvailable") service.type = "newPackage";
        if (service.type != "combo" && service.type != "newCombo" && service.type != "newPackage" && service.type != "newPackage2") {
            _.forEach(originalServices, function(pService) {
                var oService = pService.prices[0];
                oService.estimatedTime = oService.estimatedTime || 30;
                // _.forEach(pService.prices, function (oService) {
                // if (service.code == oService.priceId || pService.serviceCode == service.serviceCode){
                if (pService.serviceCode == service.serviceCode) {
                    var offerThreading = _.filter(threadingServices, function(th) { return pService.serviceCode == th.serviceCode });
                    service.additions = service.typeIndex != 100 && service.typeIndex ? oService.additions[0].types[service.typeIndex].additions : 0;
                    var tempAdditions = 0;
                    var oSer = _.filter(allServices, function(aser) { return aser.id + "" == pService.serviceId + "" })[0];
                    var objAfterDeal = applyOthersDeal(oService, service, pService, deals, user, parlorId, [], req.body.useFreeThreading, offerThreading, oSer, tax);
                    loyalityPointsUsed += objAfterDeal.loyalityPoints;
                    freebiesThreading += objAfterDeal.freebiesThreading;
                    subtotal += objAfterDeal.serviceSubtotal;
                    estimatedTime += (oService.estimatedTime) * service.quantity;
                    if (service.quantity <= 0) cancelRequest = true;

                    if (objAfterDeal.loyalityPoints == 0) freeServiceDealPrices.push(objAfterDeal.serviceSubtotal);
                    services.push({
                        id: service.code,
                        serviceId: pService.serviceId,
                        serviceCode: pService.serviceCode,
                        categoryId: pService.categoryId,
                        estimatedTime: oService.estimatedTime * service.quantity,
                        name: objAfterDeal.name,
                        serviceName: pService.name,
                        quantity: service.quantity,
                        tax: tax,
                        type: service.type,
                        additions: service.additions,
                        gstNumber: oSer.gstNumber,
                        gstDescription: oSer.gstDescription,
                        typeIndex: service.typeIndex,
                        employees: [],
                        loyalityPoints: objAfterDeal.loyalityPoints,
                        brandProductDetail: objAfterDeal.brandProductDetail,
                        frequencyDiscountUsed: objAfterDeal.frequencyDiscountUsed,
                        price: objAfterDeal.priceUsed,
                        discount: objAfterDeal.discount,
                        discountMedium: objAfterDeal.discountMedium,
                        frequencyDealFreeService: objAfterDeal.frequencyDealFreeService,
                        frequencyPrice: objAfterDeal.frequencyPrice,
                        priceUsed: objAfterDeal.priceUsed,
                        dealPrice: oService.dealPrice,
                        dealId: objAfterDeal.dealId,
                        dealPriceUsed: objAfterDeal.dealPriceUsed,
                        actualPrice: objAfterDeal.menuPrice,
                        actualDealPrice: objAfterDeal.menuPrice,
                        subtotal: objAfterDeal.serviceSubtotal,
                    });
                }
                // });
            });
        } else if (service.type == "newPackage" || service.type == "newPackage2") {
            if (service.type == "newPackage2") isNewPackage2 = true;
            newPackageServices.push(service);
        } else {
            var dealComb = _.filter(deals, function(d) { return d.id + "" == service.serviceId; });
            if (dealComb.length > 0) {
                var comboServices = Appointment.getComboServices(dealComb[0], originalServices, service.quantity, service, deals, slabs, allServices, false, tax, isNewPackage2, [], 0);
                estimatedTime += (comboServices.estimatedTime || 30);
                subtotal += comboServices.serviceSubtotal;
                freeServiceDealPrices.push(comboServices.serviceSubtotal);
                _.forEach(comboServices.services, function(cs) {
                    var oSer = _.filter(allServices, function(aser) { return aser.id + "" == cs.serviceId + "" })[0];
                    services.push({
                        id: cs.code,
                        serviceId: cs.serviceId,
                        categoryId: cs.categoryId,
                        estimatedTime: cs.estimatedTime * service.quantity,
                        name: comboServices.name,
                        serviceName: cs.serviceName,
                        type: service.type,
                        gstNumber: oSer.gstNumber,
                        gstDescription: oSer.gstDescription,
                        loyalityPoints: 0,
                        brandId: cs.brandId,
                        productId: cs.productId,
                        serviceCode: cs.serviceCode,
                        quantity: service.quantity,
                        tax: tax,
                        brandProductDetail: cs.brandProductDetail,
                        additions: 0,
                        price: Appointment.calculateComboPrice(cs.price, comboServices.realPrice, comboServices.priceUsed),
                        subtotal: Appointment.calculateComboPrice(cs.price, comboServices.realPrice, comboServices.serviceSubtotal),
                        employees: cs.employees,
                        dealPriceUsed: comboServices.dealPriceUsed,
                        actualDealPrice: Appointment.calculateComboPrice(cs.price, comboServices.realPrice, comboServices.priceUsed),
                        actualPrice: cs.price,
                        dealId: cs.dealId,
                        originalDealId : comboServices.dealId
                    });
                });
            }
        }


    });

    //calculating new Package Price
    if (newPackageServices.length > 0) {
        var newPackageSer = Appointment.getComboServices({}, originalServices, 1, newPackageServices, deals, slabs, allServices, true, tax, isNewPackage2, flashCoupons, appRevenueDiscountPercentage);
        console.log(newPackageSer);
        console.log("newPackageSer");
        subtotal += newPackageSer.serviceSubtotal;
        freeServiceDealPrices.push(newPackageSer.serviceSubtotal);
        _.forEach(newPackageSer.services, function(cs) {
            var oSer = _.filter(allServices, function(aser) { return aser.id + "" == cs.serviceId + "" })[0];
            cs.estimatedTime = cs.estimatedTime || 30;
            estimatedTime += (cs.estimatedTime || 30);
            services.push({
                id: cs.code,
                serviceId: cs.serviceId,
                categoryId: cs.categoryId,
                estimatedTime: cs.estimatedTime * cs.quantity,
                name: oSer.name,
                serviceName: cs.serviceName,
                type: "newPackage",
                gstNumber: oSer.gstNumber,
                gstDescription: oSer.gstDescription,
                loyalityPoints: 0,
                brandId: cs.brandId == "" ? null : cs.brandId,
                productId: cs.productId == "" ? null : cs.productId,
                serviceCode: cs.serviceCode,
                quantity: cs.quantity,
                expiryDate: cs.expiryDate,
                tax: tax,
                brandProductDetail: cs.brandProductDetail,
                additions: 0,
                price: Appointment.calculateComboPrice(cs.price, newPackageSer.realPrice, newPackageSer.priceUsed),
                subtotal: Appointment.calculateComboPrice(cs.serviceSubtotal, newPackageSer.realPrice, newPackageSer.serviceSubtotal),
                employees: cs.employees,
                dealPriceUsed: newPackageSer.dealPriceUsed,
                actualDealPrice: cs.menuPrice - (cs.price - Appointment.calculateComboPrice(cs.price, newPackageSer.realPrice, newPackageSer.priceUsed)),
                actualPrice: cs.menuPrice,
                dealId: cs.dealId
            });
        });
    }

    var totalSum = 0;
    _.forEach(services, function(s) {
        if (s.subtotal != s.loyalityPoints) {
            totalSum += s.subtotal;
        }
    });

    // if(twoPLusOneDealAvailable && HelperService.isOfferDay(datetime)){
    if (false) {
        var totalDiscount = 0;
        freeServiceDealPrices = _.sortBy(freeServiceDealPrices);
        var noOfServiceForFreeDeal = parseInt(freeServiceDealPrices.length / 3);
        _.forEach(freeServiceDealPrices, function(p, key) {
            if ((key + 1) % 3 == 0) totalDiscount += p;
        });
    }
    var freeServicePrice = _.filter(services, function(se) { return se.subtotal == se.loyalityPoints })[0];
    if (adjustFreeService && freeServicePrice) {
        services = _.filter(services, function(se) { return se.subtotal != se.loyalityPoints });
        subtotal -= freeServicePrice.loyalityPoints;
    }
    if(flashCoupons.length>0)useSubscriptionCredits = false;
    if (user.subscriptionId && useSubscriptionCredits) {
        //subscriptionLoyality
        redeemableLoyality = subtotal - loyalityPointsUsed > redeemableLoyality ? redeemableLoyality : subtotal - loyalityPointsUsed;
        loyalityPointsUsed += redeemableLoyality;
    } else {
        redeemableLoyality = 0;
    }

    if (user.loyalityPoints) {
        var appointmentObj = {
            subtotal: subtotal,
            loyalityOffer: loyalityPointsUsed,
            tax: tax,
        };
        user.loyalityPoints = Appointment.maximumLoyalityRedeemtion(user, appointmentObj, oldLoyalityPoints, req.body.paymentMethod);
    }
    if (!useLoyalityPoints) {
        user.loyalityPoints = 0;
    }
    if (couponCodeObj.offPercentage) {
        couponLoyalityPoints = parseInt((subtotal - loyalityPointsUsed - user.loyalityPoints) * couponCodeObj.offPercentage / 100);
        if (couponLoyalityPoints > couponCodeObj.limit) couponLoyalityPoints = couponCodeObj.limit;
        user.loyalityPoints += couponLoyalityPoints;
    }
    if (user.loyalityPoints > 0) useLoyalityPoints = 1;

    _.forEach(services, function(s) {
        if (s.subtotal != 0 && s.subtotal != s.loyalityPoints) {
            s.loyalityPoints = (s.subtotal / totalSum) * (user.loyalityPoints + redeemableLoyality);
        }
    });
    estimatedTime = estimatedTime || 60;

    var membershipDiscount = User.getMembershipDiscount(user.membership.length > 0 ? user.membership[0].creditsLeft : 0, user.membership, services, [], parseInt(useMembershipCredits), user.loyalityPoints, useLoyalityPoints, tax);
    return { services: services, estimatedTime: estimatedTime, subtotal: subtotal, tax: membershipDiscount.tax, payableAmount: membershipDiscount.payableAmount, loyalityPoints: membershipDiscount.loyalityPoints + loyalityPointsUsed, cancelRequest: cancelRequest, loyalityOffer: loyalityPointsUsed, freebiesThreading: freebiesThreading, membershipCreditsLeft: membershipDiscount.creditsLeft, creditUsed: membershipDiscount.creditsUsed, membershipId: membershipDiscount.membershipId, membershipType: membershipDiscount.membershipType, membershipDiscount: membershipDiscount.discount, membershipSaleId: membershipDiscount.membershipSaleId, couponLoyalityPoints: couponLoyalityPoints, redeemableLoyality: redeemableLoyality };

};


appointmentSchema.statics.createNewObj = function(req, user, receptionist, originalServices, products, parlor, dist, couponResponse, deals, parlorItems, slabs, allServices) {
    var employeeData = {};
    var estimatedTime = 0,
        services = [],
        payableAmount = 0,
        employees = [],
        subtotal = 0,
        discount = dist,
        cashback = couponResponse.cashback,
        membershipDiscount = 0,
        loyalityPointsUsed = 0,
        paymentMethod = 1,
        discountMedium = null,
        bookAppointmnet = true;
    _.forEach(req.body.data.services, function(service) {
        if (service.type != "combo" && service.type != "newCombo") {
            _.forEach(originalServices, function(pService) {
                _.forEach(pService.prices, function(oService) {
                    if (pService.serviceCode == service.serviceCode) {
                        service.additions = service.typeIndex != 100 && service.typeIndex ? oService.additions[0].types[service.typeIndex].additions : service.additions;
                        var tempAdditions = service.additions;
                        console.log(pService);
                        console.log("pService");
                        var oSer = _.filter(allServices, function(aser) { return aser.id + "" == pService.serviceId + "" })[0];
                        console.log(oSer);
                        console.log("oSer");
                        var objAfterDeal = applyOthersDeal(oService, service, pService, deals, user, req.session.parlorId, couponResponse.discountServices, false, [], oSer, parlor.tax);
                        if (objAfterDeal.discountMedium == "groupon") discountMedium = objAfterDeal.discountMedium;
                        if (services.length != 0 && discountMedium == "groupon") bookAppointmnet = false;
                        paymentMethod = objAfterDeal.paymentMethod;
                        loyalityPointsUsed += objAfterDeal.loyalityPoints;
                        subtotal += objAfterDeal.serviceSubtotal;
                        estimatedTime += oService.estimatedTime * service.quantity;
                        var employees1 = [];
                        _.forEach(service.employee1, function(e) {
                            var found = false;
                            _.forEach(oService.employees, function(emp) {
                                employeeData[emp.userId] = emp.name;
                                if (emp.userId == e.userId && !found) {
                                    found = true;
                                    var employee = {};
                                    employee.employeeId = emp.userId;
                                    employee.name = emp.name;
                                    employee.distribution = e.dist;
                                    employee.commission = 0;
                                    employees1.push(employee);
                                }
                            });
                        });
                        Appointment.populateEmployee(employees, employees1, oService.estimatedTime, objAfterDeal.serviceSubtotal);
                        services.push({
                            id: service.code,
                            serviceId: pService.serviceId,
                            serviceCode: pService.serviceCode,
                            categoryId: pService.categoryId,
                            estimatedTime: oService.estimatedTime * service.quantity,
                            name: objAfterDeal.name,
                            serviceName: objAfterDeal.name,
                            type: service.type,
                            quantity: service.quantity,
                            tax: objAfterDeal.tax,
                            newAdditions : objAfterDeal.newAdditions,
                            gstNumber: oSer.gstNumber,
                            serviceDiscount : objAfterDeal.serviceDiscount,
                            gstDescription: oSer.gstDescription,
                            loyalityPoints: objAfterDeal.loyalityPoints,
                            additions: service.additions,
                            productId: objAfterDeal.productId,
                            brandProductDetail: objAfterDeal.brandProductDetail,
                            productRatio: objAfterDeal.productRatio,
                            brandId: objAfterDeal.brandId,
                            brandRatio: objAfterDeal.brandRatio,
                            typeIndex: service.typeIndex,
                            employees: employees1,
                            discount: objAfterDeal.discount,
                            discountMedium: objAfterDeal.discountMedium,
                            price: objAfterDeal.priceUsed,
                            dealPriceUsed: objAfterDeal.dealPriceUsed,
                            actualPrice: objAfterDeal.menuPrice,
                            actualDealPrice: objAfterDeal.menuPrice,
                            subtotal: objAfterDeal.serviceSubtotal,
                            frequencyDiscountUsed: objAfterDeal.frequencyDiscountUsed,
                            frequencyPrice: objAfterDeal.frequencyPrice,
                            frequencyDealFreeService: objAfterDeal.frequencyDealFreeService,
                            dealId: objAfterDeal.dealId
                        });
                    }
                });
            });
        } else {
            var dealComb = _.filter(deals, function(d) { return d.id + "" == service.serviceId; });
            if (dealComb.length > 0)
                var comboServices = Appointment.getComboServices(dealComb[0], originalServices, service.quantity, service, deals, slabs, allServices, false, parlor.tax, false, [], 0);
            estimatedTime += comboServices.estimatedTime;
            subtotal += comboServices.serviceSubtotal;
            _.forEach(comboServices.services, function(cs) {
                Appointment.populateEmployee(employees, cs.employees, cs.estimatedTime, cs.serviceSubtotal);
                var oSer = _.filter(allServices, function(aser) { return aser.id + "" == cs.serviceId + "" })[0];
                services.push({
                    id: cs.code,
                    serviceId: cs.serviceId,
                    serviceCode: cs.serviceCode,
                    categoryId: cs.categoryId,
                    estimatedTime: cs.estimatedTime * service.quantity,
                    name: comboServices.name,
                    serviceName: cs.serviceName,
                    type: service.type,
                    quantity: service.quantity,
                    tax: cs.tax,
                    gstNumber: oSer.gstNumber,
                    gstDescription: oSer.gstDescription,
                    loyalityPoints: 0,
                    additions: 0,
                    brandId: cs.brandId,
                    price: Appointment.calculateComboPrice(cs.price, comboServices.realPrice, comboServices.priceUsed),
                    employees: cs.employees,
                    productId: cs.productId,
                    brandProductDetail: cs.brandProductDetail,
                    dealPriceUsed: comboServices.dealPriceUsed,
                    actualPrice: cs.price,
                    subtotal: Appointment.calculateComboPrice(cs.price, comboServices.realPrice, comboServices.serviceSubtotal),
                    dealId: cs.dealId,
                    originalDealId : comboServices.dealId
                });
            });

        }
    });

    var apptProducts = [];
    var productPrice = 0;
    var productTax = 0;
    _.forEach(products, function(product) {
        var p = _.filter(parlorItems, function(parlorItem) { return parlorItem.itemId == product.code });
        if (p.length > 0) {
            var parlorProduct = p[0];
            var productDiscount = 1;
            console.log(user);
            if(user.subscriptionId){
                productDiscount = 0.9;
            }
            console.log(productDiscount);
            console.log("productDiscount");
            if (product.code == parlorProduct.itemId) {
                productPrice += parseInt(parlorProduct.sellingPrice * product.quantity * productDiscount);
                productTax += (parlorProduct.sellingPrice * productDiscount * parlorProduct.tax * product.quantity) / 100;
                apptProducts.push({
                    productId: product.code,
                    code: product.code,
                    costPrice: parlorProduct.costPrice,
                    name: parlorProduct.name,
                    price: parseInt(parlorProduct.sellingPrice * productDiscount),
                    tax: (parlorProduct.sellingPrice * productDiscount * parlorProduct.tax) / 100,
                    discount : parlorProduct.sellingPrice * (1 - productDiscount),
                    commission: parlorProduct.commission,
                    quantity: product.quantity,
                    employeeId: product.employee,
                    employee: employeeData[product.employee] || ""
                });
            }
        }
    });
    
    user.membership = _.filter(user.membership, function(m) {
        return m.membershipId+"" == req.body.data.user.membershipId;
    });

    membershipDiscount = User.getMembershipDiscount(user.membership.length > 0 ? user.membership[0].creditsLeft : 0, user.membership, services, couponResponse, req.body.data.useMembershipCredits, user.loyalityPoints, req.body.data.useLoyalityPoints, parlor.tax);

    payableAmount = membershipDiscount.payableAmount;
    user.creditsLeft = membershipDiscount.creditsLeft;
    payableAmount += (productPrice + productTax);
    subtotal += productPrice;
    payableAmount -= req.body.data.useAdvanceCredits && req.body.data.advanceCredits ? req.body.data.advanceCredits : 0;
    return {
        paymentMethod: paymentMethod,
        allPaymentMethods: getPaymentMethodObj(req.body.allPaymentMethods),
        appointmentType: req.body.appointmentType,
        parlorId: req.session.parlorId,
        parlorName: parlor.name,
        parlorTax : parlor.tax,
        parlorType : parlor.parlorType,
        parlorAddress: parlor.address,
        parlorAddress2: parlor.address2,
        contactNumber: parlor.phoneNumber,
        client: user,
        receptionist: receptionist,
        personalCouponCode : req.body.data.personalCouponCode,
        appointmentStartTime: req.body.data.appointmentTime ? req.body.data.appointmentTime : new Date(),
        appointmentOriginalStartTime: req.body.data.appointmentTime ? req.body.data.appointmentTime : new Date(),
        status: 1,
        advanceCredits: req.body.data.advanceCredits ? req.body.data.advanceCredits : 0,
        oldCredits: req.body.data.oldCredits ? req.body.data.oldCredits : 0,
        useAdvanceCredits: req.body.data.useAdvanceCredits ? req.body.data.useAdvanceCredits : 0,
        useOldCredits: req.body.data.useOldCredits ? req.body.data.useOldCredits : 0,
        estimatedTime: estimatedTime,
        services: services,
        tax: parseFloat((parseFloat(membershipDiscount.tax) + parseFloat(productTax)).toFixed(2)),
        products: apptProducts,
        isSubscriptionAppointment : req.body.data.isSubscriptionAppointment || false,
        productPrice: productPrice,
        employees: employees,
        otherCharges: req.body.otherCharges || 0,
        subtotal: subtotal,
        discount: discount + membershipDiscount.normalDiscount,
        couponCode: discount ? req.body.data.couponCode : null,
        discountMedium: membershipDiscount.discountMedium,
        cashback: cashback,
        membershipSaleId: membershipDiscount.membershipSaleId,
        otp: req.body.data.otp,
        membersipCreditsLeft: membershipDiscount.creditsLeft,
        creditUsed: membershipDiscount.creditsUsed,
        loyalityPoints: membershipDiscount.loyalityPoints + loyalityPointsUsed,
        loyalityOffer: loyalityPointsUsed,
        membershipId: membershipDiscount.membershipId,
        membershipType: membershipDiscount.membershipType,
        membershipDiscount: membershipDiscount.discount,
        payableAmount: Math.ceil(payableAmount),
    };
};

function applyComboDeal(oService, service, pService, deals, user) {

}


function nearByPresent(services, couponResponse, serviceId) {
    var nearByPresent = false;
    _.forEach(services, function(s) {
        var checkingDiscount = _.filter(couponResponse.discountServices, function(o) { return o.serviceId + "" == serviceId + "" && o.discountMedium == "groupon" })[0];
        if (checkingDiscount) {
            nearByPresent = true;
            if (serviceId + "" == checkingDiscount.serviceId) nearByPresent = false;
        }
    });
    return nearByPresent;
}

appointmentSchema.statics.calculateComboPrice = function(price, realPrice, finalPrice) {
    return (price / realPrice) * finalPrice;
}

appointmentSchema.statics.calculatePriceAfterBrandProduct = function(serviceSubtotal, oService, service, oSer) {
    console.log(service);
    var realServiceBrand = oSer.prices[0].brand;
    var subtotal = serviceSubtotal,
        productId = null,
        brandProductDetail = "",
        productRatio = null,
        brandId = null,
        brandRatio = null;
    _.forEach(oService.brand.brands, function(brand) {
        if (brand.brandId + "" == "" + service.brandId) {
            if (oService.brand.brands.length > 1) brandProductDetail += (realServiceBrand.title + ": " + brand.name + ", ");
            brandId = brand.brandId;
            subtotal = subtotal * brand.ratio;
            brandRatio = brand.ratio;
            var realServiceProduct = _.filter(oSer.prices[0].brand.brands, function(realB) { return realB.brandId + "" == service.brandId + "" })[0];
            _.forEach(brand.products, function(product) {
                if (service.productId + "" == product.productId + "") {
                    brandProductDetail += (((realServiceProduct ? realServiceProduct.productTitle : " Product ") + ": ") + product.name);
                    subtotal = subtotal * product.ratio;
                    productRatio = product.ratio;
                    productId = product.productId;
                }
            });
        }
    });
    return {
        subtotal: Math.ceil(subtotal),
        productId: productId,
        brandProductDetail: brandProductDetail,
        productRatio: productRatio,
        brandId: brandId,
        brandRatio: brandRatio,
    };
}

function applyOthersDeal(oService, service, pService, deals, user, parlorId, discountServices, useFreeThreading, offerThreading, oSer, parlorTax) {
    var dealPriceUsed = false;
    var frequencyDiscountUsed = false;
    var dealId = null;
    var priceUsed = oService.price;
    var name = pService.name;
    var frequencyDealFreeService = 0;
    var frequencyPrice = 0;
    var freebiesThreading = 0;
    var discount = 0;
    var discountMedium = "";
    var loyalityPoints = 0;
    var tax = parlorTax;
    var paymentMethod = 1;
    var menuPrice = oService.price + (service.additions ? service.additions : 0);
    var productId = null,
        brandProductDetail = "",
        productRatio = null,
        brandId = null,
        brandRatio = null;
        var erpDiscountService = service.serviceDiscount ? service.serviceDiscount : 0;

    var checkingDiscount = _.filter(discountServices, function(o) { return o.serviceId + "" == pService.serviceId + "" && o.discountMedium == "groupon" })[0];
    var serviceSubtotal = checkingDiscount ? Math.round(checkingDiscount.amount * 1 / 1.18) : oService.price * service.quantity;
    var tempAdditions = 0;
    serviceSubtotal += service.additions ? service.additions * service.quantity : 0;
    if (useFreeThreading && offerThreading[0]) {
        // serviceSubtotal -= oService.price * 1;
        freebiesThreading += oService.price;
        loyalityPoints = oService.price;
    }

    var newPrice = Appointment.calculatePriceAfterBrandProduct(serviceSubtotal, oService, service, oSer);
    if(erpDiscountService)newPrice.subtotal -= (erpDiscountService/100 * newPrice.subtotal);
    serviceSubtotal = newPrice.subtotal;
    priceUsed = newPrice.subtotal / service.quantity;
    menuPrice = newPrice.subtotal / service.quantity;
    if (service.type != "service") {
        var d = _.filter(deals, function(d) { return d.id + "" == service.serviceId; });
        var applyDeal = true;
        if (d[0]) {
            var dealService = JSON.parse(JSON.stringify(d[0]));
            _.forEach(dealService.brands, function(brand) {
                if (brand.brandId + "" == newPrice.brandId + "") {
                    applyDeal = true;
                    var price1 = dealService.dealType.price;
                    var price2 = dealService.menuPrice;
                    dealService.menuPrice = price2 * brand.ratio;
                    dealService.dealType.price = price1 * brand.ratio;
                    _.forEach(brand.products, function(product) {
                        if (product.productId + "" == productId + "") {
                            dealService.menuPrice = price2 * product.ratio;
                            dealService.dealType.price = price1 * product.ratio;
                        }
                    });
                }
            });
        }
        menuPrice = Math.ceil(menuPrice);
        if (d.length > 0 && applyDeal && service.type != "deal") {
            dealService.dealType.price = Math.ceil(dealService.dealType.price);
            menuPrice = dealService.menuPrice;
            var newSubtotal = service.type != "chooseOnePer" ? dealService.dealType.price * service.quantity : (serviceSubtotal * (100 - dealService.dealType.price)) / 100;
            dealPriceUsed = true;
            tempAdditions = service.additions;
            service.additions = 0;
            dealId = dealService._id;
            priceUsed = service.type != "chooseOnePer" ? dealService.dealType.price : ((serviceSubtotal * (100 - dealService.dealType.price)) / (100 * service.quantity));


            if(erpDiscountService)priceUsed -= (erpDiscountService/100 * priceUsed);
                serviceSubtotal = priceUsed * service.quantity;
                newSubtotal = serviceSubtotal;
                console.log(erpDiscountService);
                console.log(priceUsed);
                console.log("priceUsed");
                console.log("-----------------------------------------------------------------------");
            if (checkingDiscount) {
                priceUsed = Math.ceil(checkingDiscount.amount * 1 / 1.18);
                newSubtotal = priceUsed;
                discount = 0;
                if (checkingDiscount.discountMedium == "groupon") {
                    tax = 0;
                    paymentMethod = 11;
                }
                checkingDiscount.amount = 0;
                discountMedium = checkingDiscount.discountMedium;
                service.discount = 0;
            }
            if (service.type == "frequency") {
                var totalService = dealService.dealType.frequencyRequired + dealService.dealType.frequencyFree;
                priceUsed = oService.price;
                dealPriceUsed = false;
                service.quantity = totalService;
                service.additions = tempAdditions;
                newSubtotal = (priceUsed + service.additions) * totalService;
                discount = (oService.price + service.additions) * dealService.dealType.frequencyFree;
                frequencyDealFreeService = totalService;
                frequencyPrice = Math.round(newSubtotal / totalService);
                discountMedium = "frequency";
                tempAdditions = (oService.price + service.additions) * (dealService.dealType.frequencyFree + dealService.dealType.frequencyRequired)
            } else if (service.type == "chooseOne" || service.type == "dealPrice") {
                tempAdditions = oService.price
                if (oService.additions.length > 0) {
                    tempAdditions += oService.additions[0].types[oService.additions[0].types.length - 1].additions;
                }
            } else if (service.type == "chooseOnePer") {
                tempAdditions = (priceUsed / (1 - (dealService.dealType.price / 100)))
            }
            serviceSubtotal = newSubtotal;
            name = dealService.name;
        } else if (service.type == "deal") {
            if (user.freeServices.length > 0 && service.frequencyUsed) {
                d = _.filter(user.freeServices, function(free) { return (free.priceId + "" == pService.serviceCode + "") && (free.parlorId + "" == parlorId + "" || free.parlorId == null); });
                    console.log("here0---++++");

                if (d.length > 0) {
                    console.log("here1---++++")
                    var dealFrequencyService = d[0];
                    if (service.quantity <= dealFrequencyService.noOfService) {
                    console.log("here2---++++")

                        var freeHairCutPrice = 0;
                        menuPrice = oService.price;
                        var serviceDealId;
                        var dealObjectId;
                        if (dealFrequencyService.parlorId == null) {
                    console.log("here3---++++")

                            var frequencyDealsAvailable = ConstantService.getStaticDealIdForFrequencyService();
                            var dealFoundForFrequency = false,
                                frequencyDealForThisService = null;
                            _.forEach(deals, function(dea) {
                                var r = _.filter(dea.services, function(dese) { return dese.serviceCode == service.serviceCode && (dea.dealType.name == "dealPrice" || dea.dealType.name == "chooseOne") })[0];
                                if (r) {
                                    serviceDealId = dea.dealId;
                                }
                            });

                            var d = _.filter(frequencyDealsAvailable, function(fd) { return fd == serviceDealId })[0];
                            _.forEach(deals, function(de) {
                                if (d && de.dealId == serviceDealId) {
                                    frequencyDealForThisService = JSON.parse(JSON.stringify(de));
                                    dealObjectId = de._id
                                }
                            });
                            if (frequencyDealForThisService && frequencyDealForThisService.brands && frequencyDealForThisService.brands.length > 0) {
                                var brandInFreeService = _.filter(frequencyDealForThisService.brands, function(ba) { return ba.brandId + "" == service.brandId })[0];
                                if (brandInFreeService) {
                                    frequencyDealForThisService.dealType.price = parseInt(brandInFreeService.ratio * frequencyDealForThisService.dealType.price);
                                }
                            }
                            console.log(brandInFreeService);
                            if (frequencyDealForThisService) {
                                freeHairCutPrice = frequencyDealForThisService.dealType.price;
                                menuPrice = frequencyDealForThisService.menuPrice;
                            }
                        }
                        dealPriceUsed = true;
                        service.additions = 0;
                        // if()
                        dealId = dealObjectId;
                        priceUsed = dealFrequencyService.parlorId != null ? (dealFrequencyService.price - (dealFrequencyService.discount ? dealFrequencyService.discount : 0)) : freeHairCutPrice;
                        discount = priceUsed;
                        discountMedium = "frequency";
                        frequencyDiscountUsed = true;
                        frequencyPrice = dealFrequencyService.price;
                        serviceSubtotal = priceUsed;
                        tempAdditions = oService.price;
                        if (dealFrequencyService.parlorId == null) {
                            loyalityPoints = priceUsed;
                            frequencyPrice = priceUsed;
                        }
                    }
                }
            }
        }
    } else {
        tempAdditions = serviceSubtotal;
    }
    if (service.type == "membership" && user.membership.length > 0) {
        var quantityAvailable = 0;
        if (service.serviceCode == ConstantService.getThreadingServiceDetail().serviceCode && user.membership[0].freeThreading >= service.quantity) {
            quantityAvailable = 1;
        } else if (service.serviceCode == ConstantService.getFreeHairWaxServiceDetail(user.gender).serviceCode && user.membership[0].noOfFreeHairCut >= service.quantity && !user.freeMembershipServiceAvailed) {
            quantityAvailable = 1;
        } else {
            service.type = "service";
        }
        if (quantityAvailable > 0) {
            discount = priceUsed * service.quantity;
            discountMedium = "membership";
            frequencyDiscountUsed = true;
            frequencyPrice = priceUsed * service.quantity;
            serviceSubtotal = priceUsed * service.quantity;
            loyalityPoints = priceUsed * service.quantity;
        }
    }
    if(service.newAdditions){
        serviceSubtotal += (service.newAdditions * service.quantity);
        priceUsed += service.newAdditions;
    }
    return {
        serviceSubtotal: serviceSubtotal,
        dealPriceUsed: dealPriceUsed,
        dealId: dealId,
        priceUsed: priceUsed,
        name: name,
        discount: discount,
        newAdditions : service.newAdditions,
        loyalityPoints: loyalityPoints,
        serviceDiscount : erpDiscountService,
        frequencyDiscountUsed: frequencyDiscountUsed,
        discountMedium: discountMedium,
        paymentMethod: paymentMethod,
        freebiesThreading: freebiesThreading,
        frequencyDealFreeService: frequencyDealFreeService,
        frequencyPrice: frequencyPrice,
        tax: tax,
        menuPrice: menuPrice,
        tempAdditions: tempAdditions,
        productId: newPrice.productId,
        brandProductDetail: newPrice.brandProductDetail,
        productRatio: newPrice.productRatio,
        brandId: newPrice.brandId,
        brandRatio: newPrice.brandRatio,
    };
}

appointmentSchema.statics.getFlashSalePrice = function(s, flashCoupons) {
    var price;
    _.forEach(flashCoupons, function(f){
        if(f.serviceCode == s.serviceCode){
            if(s.brandId){
                if(s.brandId + "" == f.brandId + ""){
                    /*if(s.projectId){
                        if(s.productId + "" == f.productId + ""){
                            price . f.price;
                        }
                    }else{*/
                        price = f.price;
                    // }
                }
            }else{
                price = f.price;
            }
        }
    });
    return price;
};

appointmentSchema.statics.getComboServices = function(dealCombo, parlorServices, quantity, service, deals, slabs, allServices, isNewPackage, tax, isNewPackage2, flashCoupons, appRevenueDiscountPercentage) {
    var comboServices = isNewPackage ? service : service.services || dealCombo.services;
    var services = [],
        estimatedTime = 0,
        employees = [];
    var name = dealCombo.name || "";
    var realPrice = 0,
        totalQuantity = 0, slabId = 1;
    _.forEach(comboServices, function(s) {
        _.forEach(parlorServices, function(ps) {
            if (ps.serviceCode == s.serviceCode) {
                estimatedTime += ps.prices[0].estimatedTime;
                console.log(s);
                var temp = Appointment.getServiceRealPrice(ps.prices[0], s, deals, allServices);
                console.log(temp);
                console.log("temp");
                var price = temp.price;
                if(appRevenueDiscountPercentage>0){
                    price = price*(1 - appRevenueDiscountPercentage/100);
                    slabId = 100;
                }
                if(flashCoupons.length > 0)
                var flashPrice = Appointment.getFlashSalePrice(s, flashCoupons);
                var isFlashSale = false;
                if(flashPrice){
                    price = flashPrice/(1 + tax/100);
                    isFlashSale = true;
                }
                realPrice += (price * (s.quantity || quantity));
                totalQuantity += (s.quantity || quantity);
                services.push({
                    code: ps.prices[0].priceId,
                    serviceId: ps.serviceId,
                    serviceCode: ps.serviceCode,
                    serviceName: ps.name,
                    dealId: temp.dealId,
                    menuPrice: temp.menuPrice,
                    isFlashSale: isFlashSale,
                    categoryId: ps.categoryId,
                    brandId: s.brandId,
                    quantity: s.quantity || quantity,
                    expiryDate: new Date(),
                    serviceSubtotal: price * (s.quantity || quantity),
                    productId: s.productId,
                    estimatedTime: temp.estimatedTime,
                    tax: ps.prices[0].tax,
                    price: price,
                    employees: _.map(s.employees || [], function(emp) {
                        return {
                            employeeId: emp.employeeId,
                            name: emp.name,
                            commission: 0,
                            distribution: emp.dist,
                        }
                    }),
                    brandProductDetail: temp.brandProductDetail,
                });
            };
        });
    });
    if(dealCombo.name){
        realPrice = realPrice/quantity;
    }
    if (!isNewPackage)
        dealCombo.dealType.price = service.services ? Appointment.getComboServicePrice(dealCombo.slabId, realPrice, slabs, 5, isNewPackage, isNewPackage2).price : dealCombo.dealType.price;
    else {
        dealCombo = {};
        dealCombo.id = null,
            dealCombo.dealType = {};
        var priceAfterSlab = Appointment.getComboServicePrice(slabId, realPrice, ConstantService.slabsFoPackage(), totalQuantity, isNewPackage, isNewPackage2);
        dealCombo.dealType.price = priceAfterSlab.price;
        if (priceAfterSlab.price != realPrice) {
            _.forEach(services, function(s) {
                s.expiryDate = HelperService.addMonthsToDate(priceAfterSlab.validityNoOfMonth);
            });
        }
    }
    var serviceSubtotal = dealCombo.dealType.price * quantity;
    var dealPriceUsed = true;
    var dealId = dealCombo.id;
    var priceUsed = dealCombo.dealType.price;
    return { services: services, realPrice: realPrice, estimatedTime: estimatedTime, employees: employees, serviceSubtotal: serviceSubtotal, dealPriceUsed: dealPriceUsed, dealId: dealId, name: name, priceUsed: priceUsed };
};

appointmentSchema.statics.getServiceRealPrice = function(parlorPrice, service, deals, allServices) {
    var price = parlorPrice.price;
    var dealId = null;
    var estimatedTime = 30;
    var menuPrice = parlorPrice.price;
    var brandProductDetail = "";
    var oSer = _.filter(allServices, function(aser) { return aser.serviceCode + "" == service.serviceCode + "" })[0];
    var realServiceBrand = oSer.prices[0].brand;
    estimatedTime = oSer.estimatedTime;
    var deals = JSON.parse(JSON.stringify(_.filter(deals, function(obj) { return obj.dealType.name == 'dealPrice' || obj.dealType.name == 'chooseOne' || obj.dealType.name == 'chooseOnePer'; })));
    _.forEach(deals, function(s) {
        if (_.some(s.services, function(ser) { return ser.serviceCode === service.serviceCode; })) {
            var obj = ParlorService.getDealObj3(s);
            if (s.menuPrice > 0) {
                price = ParlorService.populateDealRatio(parlorPrice.brand.brands, obj, true, parlorPrice.price);
                dealId = obj.dealId;
                menuPrice = s.menuPrice;
                // price = parlorPrice.brand.brands.length == 0 ? obj.dealType.price : parlorPrice.price;
            }
        }
    });
    if (service.brandId) {
        _.forEach(parlorPrice.brand.brands, function(brand) {
            if (brand.brandId + "" == service.brandId) {
                var realServiceProduct = _.filter(oSer.prices[0].brand.brands, function(realB) { return realB.brandId + "" == service.brandId + "" })[0];
                brandProductDetail += (realServiceBrand.title + ": " + brand.name + ", ")
                price = brand.price || brand.ratio * parlorPrice.price;
                menuPrice = brand.ratio * menuPrice;
                /*_.forEach(brand.products, function(product) {
                    if (product.productId + "" == service.productId) {
                        price = product.price || product.ratio * parlorPrice.price;
                        menuPrice = product.ratio * parlorPrice.price;
                        brandProductDetail += (realServiceProduct.productTitle + ": " + product.name);
                    }
                });*/
            }
        });
    }
    return {estimatedTime : estimatedTime, price: price, brandProductDetail: brandProductDetail, menuPrice: menuPrice, dealId: dealId };
};

appointmentSchema.statics.getComboServicePrice = function(slabId, totalPrice, slabs, totalNoOfService, isNewPackage, isNewPackage2) {
    var validityNoOfMonth = 0;
    var slab = _.filter(slabs, function(s) {
        return s.id + "" == slabId + "";
    })[0];
    if (totalPrice < ConstantService.excludeNoOfServiceAmountForNewPackage(isNewPackage2) && isNewPackage && (ConstantService.minimumServiceValueForNewPackage(isNewPackage2) > totalPrice || ConstantService.minimumNoOfServiceForNewPackage(isNewPackage2) > totalNoOfService)) slab = null;
    var discount = 0;
    console.log(totalPrice);
    console.log("totalPrice");
    if (slab) {
        _.forEach(slab.ranges, function(r) {
            if (totalPrice > r.range1) {
                discount = r.discount;
                validityNoOfMonth = r.validityNoOfMonth;
            }
        });
    }
    return { price: Math.ceil(totalPrice - (totalPrice * discount) / 100), validityNoOfMonth: validityNoOfMonth };
};

appointmentSchema.statics.populateEmployee = function(employees, serviceEmployees, estimatedTime, price) {
    _.forEach(serviceEmployees, function(employee) {
        var found = false;
        var distributedPrice = (price * employee.distribution) / 100;
        _.forEach(employees, function(emp) {
            if (emp.employeeId + "" == employee.employeeId + "") {
                found = true;
                emp.estimatedTime += estimatedTime;
                emp.commission += (employee.commission * distributedPrice) / 100;
                emp.revenue += distributedPrice;
            }
        });
        if (!found) {
            employees.push({
                employeeId: employee.employeeId,
                name: employee.name,
                estimatedTime: estimatedTime,
                commission: (employee.commission * distributedPrice) / 100,
                revenue: distributedPrice,
            });
        }
    });
};

appointmentSchema.statics.sendAppointmentMail = function(appt, emailId, callback) {
    if (emailId) {
        var nodemailer = require('nodemailer');
        var transporter = nodemailer.createTransport('smtps://customercare@beusalons.com:beusalons@123@smtp.gmail.com');
        var mailOptions = {
            from: 'customercare@beusalons.com', // sender address
            to: [emailId], // list of receivers
            html: Appointment.appointmentBookedMailBody(appt, emailId),
            subject: 'Summary of your order with Be U Salons - ' + appt.parlorName // Subject line
        };
        transporter.sendMail(mailOptions, function(error, info) {
            if (error)
                return console.log(error);
            else
                callback();
        });
    } else {
        callback();
    }
}


appointmentSchema.statics.appointmentBookedSms = function(appt, userName, phoneNumber, salonPhoneNumber, tax, onlinePaid) {
    var d = appt.appointmentStartTime;
    // d.setHours(d.getHours() + 5); // set Hours to 5 hours later
    // d.setMinutes(d.getMinutes() + 30);
    var timeOfAppointment = (d.getHours() < 10 ? ('0' + d.getHours()) : d.getHours()) + ':' + (d.getMinutes() < 10 ? ('0' + d.getMinutes()) : d.getMinutes())
    var calculatedMonth = parseInt(d.getMonth()) + 1
    var dateOfAppointmnet = d.getDate() + "/" + calculatedMonth + "/" + d.getFullYear();
    let payableText = (onlinePaid == true) ? "amount paid" : "services payable";

    var message = "Hi " + userName + ", Your appointment is successfully booked at  " + appt.parlorName + " on " + dateOfAppointmnet + " for " + timeOfAppointment + " and "+payableText+" is INR " + appt.payableAmount + ". In case of any issue, reach out to the salon at "+salonPhoneNumber+"/appointments@beusalons.com for further assistance.";
    return getSmsUrl('BEUSLN', message, [phoneNumber], 'T');
};

appointmentSchema.statics.ownerSms = function(num, data) {
    var result = data.reports;
    var date2 = new Date().toDateString();
    for (var i = 0; i < result.length; i++) {
        var parName = '';
        parName += result[i].parlorName + ' | ' + result[i].parlorAddress;
    }
    var records = data.payment,
        cash = records[0].amount,
        card = records[1].amount,
        aff = records[2].amount;
    var message = "Register Closure for " + date2 + ": " + parName + " Cash:" + cash + " CC:" + card + " Aff:" + aff + " Total:" + Math.round(data.totalCollectionToday) + " Srv:" + Math.round(data.totalServiceRevenue) + " Prd:" + Math.round(data.totalProductSale) + " Mem:" + data.totalMembershipSale + " Adv:" + data.totalAdvanceAdded + "";
    return getSmsUrl('BEUSLN', message, num, 'T');
};

appointmentSchema.statics.recommSms = function(num, message) {

    return getSmsUrl('BEUSLN', message, num, 'T');
};

appointmentSchema.statics.giftSms = function(num, message) {

    return getSmsUrl('BEUSLN', message, num, 'T');
};


appointmentSchema.statics.newUserSms = function(num, message) {

    return getSmsUrl('BEUSLN', message, num, 'T');
};

appointmentSchema.statics.settlementSms = function(num, message) {

    return getSmsUrl('BEUSLN', message, num, 'T');
};

function getSmsUrl(messageId, message, phoneNumbers, type) {
    return ParlorService.getSMSUrl(messageId, message, phoneNumbers, type);
};

appointmentSchema.statics.msg91Sms = function(phoneNumber, message, callback) {
    var url = "http://api.msg91.com/api/sendhttp.php?sender=BEUSLN&route=4&mobiles=" + phoneNumber + "&authkey=164034A93iTmJcMu595dd01d&country=91&message=" + message + "";
    request.post(url, function(error, response, body) {
        console.log(error)
        if (error == null) {
            return callback(false);
            // console.log("done sms")
        } else {
            // console.log(error)

            return callback(true);
        }
    });
};


appointmentSchema.statics.appointmentBookedMailBody = function(appt, email) {
    var d = appt.appointmentStartTime;
    var d2 = appt.createdAt;
    var calculatedMonth = parseInt(d.getMonth()) + 1;
    var calculatedMonth2 = parseInt(d2.getMonth()) + 1;
    var dateOfAppointmnet = d.getUTCDate() + "/" + calculatedMonth + "/" + d.getFullYear();
    var todaysDate = d2.getUTCDate() + "/" + calculatedMonth2 + "/" + d2.getFullYear();
    var timeApptConvert = appt.appointmentStartTime;
    // timeApptConvert.setHours(timeApptConvert.getHours() - 5); // set Hours to 5 hours later
    // timeApptConvert.setMinutes(timeApptConvert.getMinutes() - 30);
    var appointmnetTime = (timeApptConvert.getHours() < 10 ? ('0' + timeApptConvert.getHours()) : timeApptConvert.getHours()) + ':' + (timeApptConvert.getMinutes() < 10 ? ('0' + timeApptConvert.getMinutes()) : timeApptConvert.getMinutes());
    /*if(timeApptConvert.getHours()>=12){
                appointmnetTime=appointmnetTime+'PM';
            }else{
                appointmnetTime=appointmnetTime+'AM';
            }*/
    var paymentMethodName = '';
    // client.name , client.phoneNumber , client.emailId
    if (appt.paymentMethod == 1) {
        paymentMethodName = 'Cash';
    } else if (appt.paymentMethod == 5 || appt.paymentMethod == 6) {
        paymentMethodName = 'Online';
    }
    //console.log(appt.parlorAppointmentId+" "+dateOfAppointmnet+" "+appt.parlorName+" "+appt.parlorAddress+" "+appt.paymentMethod+" "+appt.services[0].name+"("+appt.services[0].price+" "+appt.services[0].price*appt.services[0].quantity+" "+appt.subtotal+" "+appt.tax+" "+appt.payableAmount)

    // var mailBody='<body style="font-size:14px; font-family:helveltica Neue, helveltica,arial, sans-serif; color:#58595b;"><table style="width:100%;"  height="854" cellpadding="0" cellspacing="0">';

    // //image part of beusalons + parlorAppointmentId + currentDate + appointmentDate
    // mailBody +='<tr><td width="378" height="91"><img src="https://www.monsoonsalon.com/emailler/images/beu-logo.png" width="150" alt="Beu salons" /></td><td width="127">&nbsp;</td> <td width="100">&nbsp;</td><td width="193" align="center"><strong>Invoice #:'+appt.parlorAppointmentId+'&nbsp;&nbsp;</strong><br />Created:'+todaysDate+'<strong>&nbsp;&nbsp;</strong><br /> Due: '+dateOfAppointmnet+'<br/><span>Appointment time:</span>'+appointmnetTime+'</td> </tr>';

    // //empty
    // mailBody +='<tr> <td height="33">&nbsp;</td>  <td>&nbsp;</td><td>&nbsp;</td> <td>&nbsp;</td></tr>';

    // //parlorName + parlorAddress +client(name,email,phoneNumber)
    // mailBody +='<tr> <td height="83" style="font-size: 14px;color:#58595b"><strong>&nbsp;&nbsp;</strong>'+appt.parlorName+'<br /><strong>&nbsp;&nbsp;</strong>'+appt.parlorAddress+'<br /><strong>&nbsp;&nbsp;</strong>'+appt.parlorAddress2+'<br/><strong>&nbsp;&nbsp;</strong><span>Contact No.</span>'+appt.contactNumber+'</td> <td>&nbsp;</td> <td>&nbsp;</td><td align="center" ><span style="text-transform: capitalize">'+appt.client.name+'</span><strong>&nbsp;&nbsp;</strong><br />'+appt.client.phoneNumber+'<strong> &nbsp;&nbsp;</strong><br />'+email+'<strong>&nbsp;&nbsp;</strong></td>  </tr>';

    // //empty
    // mailBody +='<tr><td height="30">&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>';

    // //payment method heading thats all which is static (data in the next row)
    // mailBody +='<tr><td height="41" style="border-bottom-color: #ddd;border-bottom-style: solid;border-bottom-width: 1px;background-color: #eee;"><strong>&nbsp;&nbsp;Payment Method</strong></td><td style="border-bottom-color: #ddd;border-bottom-style: solid;border-bottom-width: 1px;background-color: #eee;">&nbsp;</td><td style="border-bottom-color: #ddd;border-bottom-style: solid;border-bottom-width: 1px;background-color: #eee;">&nbsp;</td><td align="center" style="border-bottom-color: #ddd;border-bottom-style: solid;border-bottom-width: 1px;background-color: #eee;"><strong>Amount #&nbsp;&nbsp;</strong></td></tr>';

    // //payment method-COD , Online and the grandtotal(app.payableAmount)
    // mailBody +='<tr><td height="62"><strong>&nbsp;&nbsp;</strong>'+paymentMethodName+'</td><td>&nbsp;</td><td>&nbsp;</td><td align="center">'+appt.payableAmount+'&nbsp;&nbsp;</td></tr>';

    // //This is again just the HEADING (services, Unit prices , You save% , Price)
    // mailBody +='<tr><td height="51" align="left" style="border-bottom-color: #ddd;border-bottom-style: solid;border-bottom-width: 1px;background-color: #eee;"><strong>Services</strong></td><td align="center" style="border-bottom-color: #ddd;border-bottom-style: solid;border-bottom-width: 1px;background-color: #eee;"><strong>Unit Price</strong></td><td align="center" style="border-bottom-color: #ddd;border-bottom-style: solid;border-bottom-width: 1px;background-color: #eee;"><strong>You Save%</strong></td> <td align="center" style="border-bottom-color: #ddd;border-bottom-style: solid;border-bottom-width: 1px;background-color: #eee;"><strong>Price&nbsp;&nbsp; </strong></td></tr>';

    // //Dynamically services rows are made depending upon the services bought by the user
    // var rowIndex=0;
    // var discount = 0;
    // appt.services = Appointment.populateServices(appt.services);
    // while(rowIndex<appt.services.length){
    //     var percentageDiscountPerUnit=(1-(parseInt(appt.services[rowIndex].price)/parseInt(appt.services[rowIndex].actualDealPrice ? appt.services[rowIndex].actualDealPrice : appt.services[rowIndex].actualPrice )))*100;
    //     discount += (appt.services[rowIndex].discount ? appt.services[rowIndex].discount : 0);
    //     mailBody +='<tr><td height="105" style="border-bottom-color: #ddd;color:#58595b;border-bottom-style: solid;border-bottom-width: 1px;font-size: 14px;">'+appt.services[rowIndex].name+'</td><td align="center" style="border-bottom-color: #ddd;border-bottom-style: solid;border-bottom-width: 1px;">INR '+appt.services[rowIndex].price+'</td><td align="center" style="border-bottom-color: #ddd;border-bottom-style: solid;border-bottom-width: 1px;">'+ Math.ceil(percentageDiscountPerUnit)+'%</td><td align="center" style="border-bottom-color: #ddd;border-bottom-style: solid;border-bottom-width: 1px;">INR '+appt.services[rowIndex].price*appt.services[rowIndex].quantity+'</td></tr>';
    //     rowIndex++;
    // }

    // //this shows the subtotal
    // mailBody +='<tr><td height="45" >&nbsp;</td><td >&nbsp;</td><td >&nbsp;</td><td align="center" style="border-bottom-color: #ddd;border-bottom-style: solid;border-bottom-width: 1px;">Total : INR '+appt.subtotal+'</td></tr>';

    // //this shows the tax
    // mailBody +='<tr><td height="41" >&nbsp;</td><td >&nbsp;</td><td >&nbsp;</td><td align="center" style="border-bottom-color: #ddd;border-bottom-style: solid;border-bottom-width: 1px;">CGST/CGST Tax 18% : INR '+appt.tax+'</td></tr>';

    // //this shows the tax
    // mailBody +='<tr><td height="41" >&nbsp;</td><td >&nbsp;</td><td >&nbsp;</td><td align="center" style="border-bottom-color: #ddd;border-bottom-style: solid;border-bottom-width: 1px;">Discount (-) : INR '+discount+'</td></tr>';

    // //this shows the GRAND TOTAL
    // mailBody +='<tr><td height="54" >&nbsp;</td><td >&nbsp;</td><td >&nbsp;</td><td align="center" style="border-bottom-color: #ddd;border-bottom-style: solid;border-bottom-width: 1px;"><strong>Grand Total: INR '+appt.payableAmount+'</strong></td></tr>';

    // //End
    // mailBody +='<tr><td >&nbsp;</td><td >&nbsp;</td><td >&nbsp;</td><td >&nbsp;</td></tr></table></body>';


    var mailBody = '<body style="-moz-box-sizing:border-box;-ms-text-size-adjust:100%;-webkit-box-sizing:border-box;-webkit-text-size-adjust:100%;Margin:0;box-sizing:border-box;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;min-width:100%;padding:0;text-align:left;width:100%!important">';

    //Style Part
    mailBody += '<style>@media only screen{html{min-height: 100%; background: #f3f3f3}}@media only screen and (max-width:596px){.small-float-center{margin: 0 auto!important; float: none!important; text-align: center!important}.small-text-center{text-align: center!important}.small-text-left{text-align: left!important}.small-text-right{text-align: right!important}}@media only screen and (max-width:596px){.hide-for-large{display: block!important; width: auto!important; overflow: visible!important; max-height: none!important; font-size: inherit!important; line-height: inherit!important}}@media only screen and (max-width:596px){table.body table.container .hide-for-large, table.body table.container .row.hide-for-large{display: table!important; width: 100%!important}}@media only screen and (max-width:596px){table.body table.container .callout-inner.hide-for-large{display: table-cell!important; width: 100%!important}}@media only screen and (max-width:596px){table.body table.container .show-for-large{display: none!important; width: 0; mso-hide: all; overflow: hidden}}@media only screen and (max-width:596px){table.body img{width: auto; height: auto}table.body center{min-width: 0!important}table.body .container{width: 95%!important}table.body .column, table.body .columns{height: auto!important; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; box-sizing: border-box; padding-left: 16px!important; padding-right: 16px!important}table.body .column .column, table.body .column .columns, table.body .columns .column, table.body .columns .columns{padding-left: 0!important; padding-right: 0!important}table.body .collapse .column, table.body .collapse .columns{padding-left: 0!important; padding-right: 0!important}td.small-1, th.small-1{display: inline-block!important; width: 8.33333%!important}td.small-2, th.small-2{display: inline-block!important; width: 16.66667%!important}td.small-3, th.small-3{display: inline-block!important; width: 25%!important}td.small-4, th.small-4{display: inline-block!important; width: 33.33333%!important}td.small-5, th.small-5{display: inline-block!important; width: 41.66667%!important}td.small-6, th.small-6{display: inline-block!important; width: 50%!important}td.small-7, th.small-7{display: inline-block!important; width: 58.33333%!important}td.small-8, th.small-8{display: inline-block!important; width: 66.66667%!important}td.small-9, th.small-9{display: inline-block!important; width: 75%!important}td.small-10, th.small-10{display: inline-block!important; width: 83.33333%!important}td.small-11, th.small-11{display: inline-block!important; width: 91.66667%!important}td.small-12, th.small-12{display: inline-block!important; width: 100%!important}.column td.small-12, .column th.small-12, .columns td.small-12, .columns th.small-12{display: block!important; width: 100%!important}table.body td.small-offset-1, table.body th.small-offset-1{margin-left: 8.33333%!important; Margin-left: 8.33333%!important}table.body td.small-offset-2, table.body th.small-offset-2{margin-left: 16.66667%!important; Margin-left: 16.66667%!important}table.body td.small-offset-3, table.body th.small-offset-3{margin-left: 25%!important; Margin-left: 25%!important}table.body td.small-offset-4, table.body th.small-offset-4{margin-left: 33.33333%!important; Margin-left: 33.33333%!important}table.body td.small-offset-5, table.body th.small-offset-5{margin-left: 41.66667%!important; Margin-left: 41.66667%!important}table.body td.small-offset-6, table.body th.small-offset-6{margin-left: 50%!important; Margin-left: 50%!important}table.body td.small-offset-7, table.body th.small-offset-7{margin-left: 58.33333%!important; Margin-left: 58.33333%!important}table.body td.small-offset-8, table.body th.small-offset-8{margin-left: 66.66667%!important; Margin-left: 66.66667%!important}table.body td.small-offset-9, table.body th.small-offset-9{margin-left: 75%!important; Margin-left: 75%!important}table.body td.small-offset-10, table.body th.small-offset-10{margin-left: 83.33333%!important; Margin-left: 83.33333%!important}table.body td.small-offset-11, table.body th.small-offset-11{margin-left: 91.66667%!important; Margin-left: 91.66667%!important}table.body table.columns td.expander, table.body table.columns th.expander{display: none!important}table.body .right-text-pad, table.body .text-pad-right{padding-left: 10px!important}table.body .left-text-pad, table.body .text-pad-left{padding-right: 10px!important}table.menu{width: 100%!important}table.menu td, table.menu th{width: auto!important; display: inline-block!important}table.menu.small-vertical td, table.menu.small-vertical th, table.menu.vertical td, table.menu.vertical th{display: block!important}table.menu[align=center]{width: auto!important}table.button.small-expand, table.button.small-expanded{width: 100%!important}table.button.small-expand table, table.button.small-expanded table{width: 100%}table.button.small-expand table a, table.button.small-expanded table a{text-align: center!important; width: 100%!important; padding-left: 0!important; padding-right: 0!important}table.button.small-expand center, table.button.small-expanded center{min-width: 0}}</style>';

    //Gif part
    mailBody += '<table class="body" data-made-with-foundation="" style="Margin:0;background:#f3f3f3;border-collapse:collapse;border-spacing:0;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;height:100%;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;width:100%"> <tbody> <tr style="padding:0;text-align:left;vertical-align:top"> <td class="float-center" align="center" valign="top" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0 auto;border-collapse:collapse!important;color:#0a0a0a;float:none;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0 auto;padding:0;text-align:center;vertical-align:top;word-wrap:break-word"> <center data-parsed="" style="min-width:580px;width:100%"> <table bgcolor="#8a8a8a" align="center" class="wrapper header float-center" style="Margin:0 auto;background:#FFF;border-collapse:collapse;border-spacing:0;float:none;margin:0 auto;padding:0;text-align:center;vertical-align:top;width:100%"> <tbody> <tr style="padding:0;text-align:left;vertical-align:top"> <td style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;padding-top:2%!important;text-align:left;vertical-align:top;word-wrap:break-word"> <table align="center" class="container" style="Margin:0 auto;background:#fff;border-collapse:collapse;border-spacing:0;margin:0 auto;padding:0;text-align:inherit;vertical-align:top;width:580px"> <tbody> <tr style="padding:0;text-align:left;vertical-align:top"> <td style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word"> <table class="row collapse" style="border-collapse:collapse;border-spacing:0;display:table;padding:0;position:relative;text-align:left;vertical-align:top;width:100%"> <tbody> <tr style="padding:0;text-align:left;vertical-align:top"> <th class="small-5 large-6 columns first" valign="middle" style="Margin:0 auto;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;padding-bottom:0;padding-left:0;padding-right:0;text-align:left;width:298px"> <table style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%"> <tbody> <tr style="padding:0;text-align:left;vertical-align:top"> <th style="Margin:0;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left"><img src="http://res.cloudinary.com/dyqcevdpm/image/upload/v1491484496/beu-logo_srvetg.png" style="-ms-interpolation-mode:bicubic;clear:both;display:block;max-width:100%;outline:0;text-decoration:none;width:44%!important"></th> </tr></tbody> </table> </th> <th class="small-7 large-6 columns last" valign="middle" style="Margin:0 auto;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;padding-bottom:0;padding-left:0;padding-right:0;text-align:left;width:298px"> <table style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%"> <tbody> <tr style="padding:0;text-align:left;vertical-align:top"> <th style="Margin:0 auto;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;padding-bottom:0;padding-left:0!important;padding-right:0!important;text-align:left;width:50%" class="small-6 large-6 columns last"> <p style="Margin:0;Margin-bottom:10px;color:#000;font-family:Lato,sans-serif;font-size:.8em;font-weight:400;line-height:1.3;margin:0;margin-bottom:0;padding:0;text-align:left">Download App</p></th> <th class="small-6 large-6 columns last" style="Margin:0 auto;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;padding-bottom:0;padding-left:0!important;padding-right:0!important;text-align:left;width:50%"> <p style="Margin:0;Margin-bottom:10px;color:#000;font-family:Lato,sans-serif;font-size:.8em;font-weight:400;line-height:1.3;margin:0;margin-bottom:0;padding:0;text-align:left">Avail Freebies</p></th> </tr><tr style="padding:0;text-align:left;vertical-align:top"> <th style="Margin:0;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left"> <table style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%"> <tbody> <tr style="padding:0;text-align:left;vertical-align:top"> <th class="small-4 large-4 columns last" style="Margin:0 auto;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;padding-bottom:0;padding-left:0!important;padding-right:0!important;padding-top:4%!important;text-align:left;width:33.33333%"><span><a href="onelink.to/bf45qf" style="Margin:0;color:#2199e8;font-family:Helvetica,Arial,sans-serif;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left;text-decoration:none"><img src="http://res.cloudinary.com/dyqcevdpm/image/upload/v1491484496/ICON_3_g5skqb.png" style="-ms-interpolation-mode:bicubic;border:none;clear:both;display:block;max-width:100%;outline:0;text-decoration:none;width:50%!important"></a></span></th> <th class="small-8 large-8 columns last" style="Margin:0 auto;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;padding-bottom:0;padding-left:0!important;padding-right:0!important;padding-top:4%!important;text-align:left;width:66.66667%"><span><a href="onelink.to/bf45qf" style="Margin:0;color:#2199e8;font-family:Helvetica,Arial,sans-serif;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left;text-decoration:none"><img src="http://res.cloudinary.com/dyqcevdpm/image/upload/v1491484496/ICON_2_abyddu.png" style="-ms-interpolation-mode:bicubic;border:none;clear:both;display:block;max-width:100%;outline:0;text-decoration:none;width:25%!important"></a></span></th> </tr></tbody> </table> </th> <th class="small-6 large-6 columns last" style="Margin:0 auto;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;padding-bottom:0;padding-left:0!important;padding-right:0!important;text-align:left;width:50%"><span><img src="http://res.cloudinary.com/dyqcevdpm/image/upload/v1491484496/ICON_hjnl1h.png" style="-ms-interpolation-mode:bicubic;clear:both;display:block;max-width:100%;outline:0;padding-left:17%!important;padding-top:6%!important;text-decoration:none;width:16%!important"></span></th> </tr></tbody> </table> </th> </tr></tbody> </table> </td></tr><tr style="padding:0;text-align:left;vertical-align:top"> <td style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;padding-top:7%!important;text-align:left;vertical-align:top;word-wrap:break-word"> </td></tr></tbody> </table> </td></tr></tbody> </table> <table align="center" class="container float-center" style="Margin:0 auto;background:#fefefe;border-collapse:collapse;border-spacing:0;float:none;margin:0 auto;padding:0;text-align:center;vertical-align:top;width:580px"> <tbody> <tr style="padding:0;text-align:left;vertical-align:top"> <td style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word"> <table class="row" style="border-collapse:collapse;border-spacing:0;display:table;padding:0;position:relative;text-align:left;vertical-align:top;width:100%"> <tbody> <tr style="padding:0;text-align:left;vertical-align:top"> <th class="small-12 large-12 columns first last" style="Margin:0 auto;background-color:#e2e584;background-image:url(http://res.cloudinary.com/dyqcevdpm/image/upload/c_scale,h_60,w_800/v1491832546/GREEN_PANEL_xny9tl.png);background-repeat:no-repeat;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;padding-bottom:16px;padding-left:16px;padding-right:16px;text-align:left;width:564px"> <table style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%"> <tbody> <tr style="padding:0;text-align:left;vertical-align:top"> <th style="Margin:0;color:#fff;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:center"> <h3 style="Margin:0;Margin-bottom:10px;color:#fff;font-family:"Open Sans",sans-serif;font-size:1.3em;font-weight:400;line-height:1.3;margin:0;margin-bottom:10px;padding:0;padding-bottom:4%;padding-top:2%;text-align:center!important;word-wrap:normal">GET YOUR ADRENALINE RUSHING</h3> <p class="lead" style="Margin:0;Margin-bottom:10px;color:#000!important;font-family:"Open Sans",sans-serif;font-size:20px;font-weight:400;line-height:1.6;margin:0;margin-bottom:10px;padding:0;padding-top:1%!important;text-align:center!important"><p style="color:#000!important;">‘Coz we got you booked!</p></p><p class="lead" style="Margin:0;Margin-bottom:10px;color:#000!important;font-family:"Open Sans",sans-serif;font-size:20px;font-weight:400;line-height:1.6;margin:0;margin-bottom:10px;padding:0;text-align:center!important"><b style="color:#000!important">Dear Customer,</b></p><p class="lead" style="Margin:0;Margin-bottom:10px;color:#000!important;font-family:"Open Sans",sans-serif;font-size:.9em;font-weight:400;line-height:1.6;margin:0;margin-bottom:10px;padding:0;text-align:center!important;font-weight:600;"><p style="color:#000!important">Thank you for choosing Be U Salon. We’re glad to treat <br>you with our exquisite beauty services. Here is your <br>confirmation receipt for the services below.</p></p><table class="callout" style="Margin-bottom:16px;border-collapse:collapse;border-spacing:0;margin-bottom:16px;padding:0;text-align:left;vertical-align:top;width:100%"> <tbody> <tr style="padding:0;text-align:left;vertical-align:top"> <th style="Margin:0;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left"> <p style="Margin:0;Margin-bottom:10px;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:auto;margin-bottom:10px;padding:0;text-align:left;width:60%"><img src="http://i.amz.mshcdn.com/ZzPk8XAA1KBZ8jpc-DL0RzaXwbc=/fit-in/850x850/http%3A%2F%2Fmashable.com%2Fwp-content%2Fgallery%2Fbeyonces-hair-gifs%2Fhair-fix.gif" style="-ms-interpolation-mode:bicubic;clear:both;display:block;max-width:100%;outline:0;text-decoration:none;width:100%"></p></th> </tr><tr style="padding:0;text-align:left;vertical-align:top"></tr><tr> <th class="expander" style="Margin:0;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0!important;text-align:left;visibility:hidden;width:0"></th> </tr></tbody> </table> </th> <th class="expander" style="Margin:0;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0!important;text-align:left;visibility:hidden;width:0"></th> </tr><tr style="padding:0;text-align:left;vertical-align:top"></tr></tbody> </table> </th> </tr></tbody> </table> </td></tr></tbody> </table>';


    //image part of beusalons + parlorAppointmentId + currentDate + appointmentDate
    mailBody += '<table align="center" class="container float-center" style="Margin:0 auto;background:#fefefe;border-collapse:collapse;border-spacing:0;float:none;margin:0 auto;padding:0;text-align:center;vertical-align:top;width:580px"> <tbody> <tr style="padding:0;text-align:left;vertical-align:top"> <td style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word"> <table class="row" style="border-collapse:collapse;border-spacing:0;display:table;padding:0;position:relative;text-align:left;vertical-align:top;width:100%"> <tbody> <tr style="padding:0;text-align:left;vertical-align:top"> <th class="small-12 large-12 columns first last" style="Margin:0 auto;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;padding-bottom:16px;padding-left:16px;padding-right:16px;text-align:left;width:564px"> <table style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%"></table> <table style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%"> <tbody> <tr style="padding:0;text-align:left;vertical-align:top"> <th style="Margin:0;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0;padding-top:3%!important;text-align:left"> <table class="callout" style="Margin-bottom:16px;border-collapse:collapse;border-spacing:0;margin-bottom:16px;padding:0;text-align:left;vertical-align:top;width:100%"> <tbody> <tr style="padding:0;text-align:left;vertical-align:top"> <td width="378" height="91" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word"><img src="http://res.cloudinary.com/dyqcevdpm/image/upload/v1491484496/beu-logo_srvetg.png" width="150" height="60" alt="Beu salons" style="-ms-interpolation-mode:bicubic;clear:both;display:block;max-width:100%;outline:0;text-decoration:none;width:auto"></td><td width="127" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word"></td><td width="100" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word"></td><td width="300" align="center" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:.8em;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word"><strong>Invoice #: ' + appt.parlorAppointmentId + '&nbsp;&nbsp;</strong> <br>Created: ' + todaysDate + '<strong></strong> <br>Due: ' + dateOfAppointmnet + '<strong></strong><br>Appointment time: ' + appointmnetTime + '<strong></strong></td></tr>';

    //empty
    mailBody += '<tr style="padding:0;text-align:left;vertical-align:top">';

    //parlorName + parlorAddress +client(name,email,phoneNumber)
    mailBody += '<td height="83" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:.8em;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word"><strong></strong> <br><strong></strong>' + appt.parlorName + ' <br><strong></strong>' + appt.parlorAddress + '<br><strong></strong>' + appt.parlorAddress2 + '<br><strong></strong>' + appt.contactNumber + '</td><td style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word"></td><td style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word"></td><td align="center" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:.8em;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">Acme Corp.<strong></strong> <br>' + appt.client.name + '<strong> </strong> <br>' + appt.client.phoneNumber + '<strong></strong><br>' + email + '<strong></strong></td></tr>';

    //empty
    mailBody += '<tr style="padding:0;text-align:left;vertical-align:top"> <td height="30" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word"></td><td style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word"></td><td style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word"></td><td style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word"></td></tr>';

    //payment method heading thats all which is static (data in the next row)
    mailBody += '<tr style="padding:0;text-align:left;vertical-align:top"> <td height="40" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;background-color:#eee;border-bottom-color:#ddd;border-bottom-style:solid;border-bottom-width:1px;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:.8em;font-weight:400;hyphens:auto;line-height:40px;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word"><strong>Payment Method</strong></td><td style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;background-color:#eee;border-bottom-color:#ddd;border-bottom-style:solid;border-bottom-width:1px;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word"></td><td style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;background-color:#eee;border-bottom-color:#ddd;border-bottom-style:solid;border-bottom-width:1px;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word"></td><td height="40" align="center" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;background-color:#eee;border-bottom-color:#ddd;border-bottom-style:solid;border-bottom-width:1px;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:.8em;font-weight:400;hyphens:auto;line-height:40px;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word"><strong>Amount </strong></td></tr>';

    //payment method-COD , Online and the grandtotal(app.payableAmount)
    mailBody += '<tr style="padding:0;text-align:left;vertical-align:top"> <td height="62" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:.8em;font-weight:400;hyphens:auto;line-height:62px;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word"><strong></strong>' + paymentMethodName + '</td><td style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word"></td><td style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word"></td><td align="center" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:.8em;font-weight:400;hyphens:auto;line-height:62px;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">₹ ' + appt.payableAmount + '</td></tr>';

    //This is again just the HEADING (services, Unit prices , You save% , Price)
    mailBody += '<tr style="padding:0;text-align:left;vertical-align:top"> <td height="40" align="left" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;background-color:#eee;border-bottom-color:#ddd;border-bottom-style:solid;border-bottom-width:1px;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:.8em;font-weight:400;hyphens:auto;line-height:40px;margin:0;padding:0;padding-left:2%;text-align:left;vertical-align:top;word-wrap:break-word"><strong>Services</strong></td><td align="center" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;background-color:#eee;border-bottom-color:#ddd;border-bottom-style:solid;border-bottom-width:1px;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:.8em;font-weight:400;hyphens:auto;line-height:40px;margin:0;padding:0;text-align:left;vertical-align:top;white-space:nowrap;word-wrap:break-word"><strong></strong></td><td align="center" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;background-color:#eee;border-bottom-color:#ddd;border-bottom-style:solid;border-bottom-width:1px;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:.8em;font-weight:400;hyphens:auto;line-height:40px;margin:0;padding:0;text-align:left;vertical-align:top;white-space:nowrap;word-wrap:break-word"><strong>You save%</strong></td><td align="center" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;background-color:#eee;border-bottom-color:#ddd;border-bottom-style:solid;border-bottom-width:1px;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:.8em;font-weight:400;hyphens:auto;line-height:40px;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word"><strong>Price </strong></td></tr>';

    //Dynamically services rows are made depending upon the services bought by the user
    var rowIndex = 0;
    var discount = 0;
    appt.services = Appointment.populateServices(appt.services);
    while (rowIndex < appt.services.length) {
        var percentageDiscountPerUnit = (1 - (parseInt(appt.services[rowIndex].price) / parseInt(appt.services[rowIndex].actualDealPrice ? appt.services[rowIndex].actualDealPrice : appt.services[rowIndex].actualPrice))) * 100;
        discount += (appt.services[rowIndex].discount ? appt.services[rowIndex].discount : 0);
        mailBody += '<tr style="padding:0;text-align:left;vertical-align:top"> <td align="left" height="60" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-bottom-color:#ddd;border-bottom-style:solid;border-bottom-width:1px;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:.8em;font-weight:400;hyphens:auto;line-height:60px;margin:0;padding:0;padding-left:2%;text-align:left;vertical-align:top;word-wrap:break-word">' + appt.services[rowIndex].name + '</td><td align="center" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-bottom-color:#ddd;border-bottom-style:solid;border-bottom-width:1px;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:.8em;font-weight:400;hyphens:auto;line-height:60px;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word"></td><td align="center" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-bottom-color:#ddd;border-bottom-style:solid;border-bottom-width:1px;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:.8em;font-weight:400;hyphens:auto;line-height:60px;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">' + Math.ceil(percentageDiscountPerUnit) + '%</td><td align="center" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-bottom-color:#ddd;border-bottom-style:solid;border-bottom-width:1px;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:.8em;font-weight:400;hyphens:auto;line-height:60px;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">₹ ' + Math.ceil(appt.services[rowIndex].price * appt.services[rowIndex].quantity) + '</td></tr>';
        rowIndex++;
    }
    // if(appt.subscriptionAmount > 0){
    //     var subsType = (appt.subscriptionAmount==1699) ? "Gold Subscription" : "Silver Subscription"
    //     mailBody += '<tr style="padding:0;text-align:left;vertical-align:top"> <td align="left" height="60" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-bottom-color:#ddd;border-bottom-style:solid;border-bottom-width:1px;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:.8em;font-weight:400;hyphens:auto;line-height:60px;margin:0;padding:0;padding-left:2%;text-align:left;vertical-align:top;word-wrap:break-word">' + subsType + '</td><td align="center" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-bottom-color:#ddd;border-bottom-style:solid;border-bottom-width:1px;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:.8em;font-weight:400;hyphens:auto;line-height:60px;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word"></td><td align="center" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-bottom-color:#ddd;border-bottom-style:solid;border-bottom-width:1px;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:.8em;font-weight:400;hyphens:auto;line-height:60px;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word"></td><td align="center" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-bottom-color:#ddd;border-bottom-style:solid;border-bottom-width:1px;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:.8em;font-weight:400;hyphens:auto;line-height:60px;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">₹ ' + appt.subscriptionAmount + '</td></tr>';
    // }
    //this shows the subtotal
    mailBody += '<tr style="padding:0;text-align:left;vertical-align:top"> <td height="45" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word"></td><td style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word"></td><td style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word"></td><td align="center" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-bottom-color:#ddd;border-bottom-style:solid;border-bottom-width:1px;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:.8em;font-weight:400;hyphens:auto;line-height:45px;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">Total : ₹ ' + appt.subtotal + '</td></tr>';

    //this shows the tax
    mailBody += '<tr style="padding:0;text-align:left;vertical-align:top"> <td height="41" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word"></td><td style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word"></td><td style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word"></td><td align="center" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-bottom-color:#ddd;border-bottom-style:solid;border-bottom-width:1px;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:.8em;font-weight:400;hyphens:auto;line-height:41px;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">CGST/SGST Tax 18% : ₹ ' + appt.tax + '</td></tr>';

    //this shows the tax
    mailBody += '<tr style="padding:0;text-align:left;vertical-align:top"> <td height="41" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word"></td><td style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word"></td><td style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word"></td><td align="center" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-bottom-color:#ddd;border-bottom-style:solid;border-bottom-width:1px;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:.8em;font-weight:400;hyphens:auto;line-height:41px;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">Discount (-) : ₹ ' + discount + '</td></tr>';

    //this shows the GRAND TOTAL
    mailBody += '<tr style="padding:0;text-align:left;vertical-align:top"> <td height="54" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word"></td><td style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word"></td><td style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word"></td><td align="center" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-bottom-color:#ddd;border-bottom-style:solid;border-bottom-width:1px;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:.8em;font-weight:400;hyphens:auto;line-height:54px;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word"><strong>Grand Total: ₹ ' + appt.payableAmount + '</strong></td></tr>';

    //End
    mailBody += '<tr style="padding:0;text-align:left;vertical-align:top"> <td style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word"></td><td style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word"></td><td style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word"></td><td style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word"></td></tr></tbody> </table> </th> </tr></tbody> </table> </th> </tr></tbody> </table> </td></tr><tr style="padding:0;text-align:left;vertical-align:top"> <th style="Margin:0;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left"> <p style="Margin:0;Margin-bottom:10px;background:#e2e584;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;margin-bottom:10px;padding:0;padding-bottom:6%;padding-top:6%;text-align:center">Keep your eyes glued for special offers from us!</p></th> </tr></tbody> </table> </center> </td></tr></tbody> </table> <table align="center" class="container float-center" style="Margin:0 auto;background:#fefefe;border-collapse:collapse;border-spacing:0;float:none;margin:0 auto;padding:0;text-align:center;vertical-align:top;width:580px"> <tbody> <tr style="padding:0;text-align:left;vertical-align:top"> <td style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word"> <table class="row" style="border-collapse:collapse;border-spacing:0;display:table;padding:0;position:relative;text-align:left;vertical-align:top;width:100%"> <tbody> <tr style="padding:0;text-align:left;vertical-align:top"> <th class="small-12 large-12 columns first last" style="Margin:0 auto;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;padding-bottom:16px;padding-left:16px;padding-right:16px;text-align:left;width:564px"> <table style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%"> <tbody> <tr style="padding:0;text-align:left;vertical-align:top"> <th style="Margin:0;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0;padding-top:4%!important;text-align:left"> <table class="callout" style="Margin-bottom:16px;border-collapse:collapse;border-spacing:0;margin:auto;margin-bottom:16px;padding:0;text-align:left;vertical-align:top;width:30%!important"> <tbody> <tr style="padding:0;text-align:left;vertical-align:top"> <th style="Margin:0 auto;color:#0a0a0a;float:none;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;text-align:left" class="menu-item float-center"> <a href="https://www.facebook.com/BeUSalons/" style="Margin:0;color:#2199e8;font-family:Helvetica,Arial,sans-serif;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left;text-decoration:none"><img src="http://res.cloudinary.com/dyqcevdpm/image/upload/v1291284496/social__ICON_2_dsofvy.png" alt="facebook" width="30" height="30" style="-ms-interpolation-mode:bicubic;border:none;clear:both;display:block;max-width:100%;outline:0;text-decoration:none;width:auto"></a> </th> <th style="Margin:0 auto;color:#0a0a0a;float:none;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;text-align:left" class="menu-item float-center"> <a href="https://plus.google.com/100683126750126363126" style="Margin:0;color:#2199e8;font-family:Helvetica,Arial,sans-serif;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left;text-decoration:none"><img src="http://res.cloudinary.com/dyqcevdpm/image/upload/v1291284496/social__ICON_3_qdqnsk.png" alt="facebook" width="30" height="30" style="-ms-interpolation-mode:bicubic;border:none;clear:both;display:block;max-width:100%;outline:0;text-decoration:none;width:auto"></a> </th> <th style="Margin:0 auto;color:#0a0a0a;float:none;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;text-align:left" class="menu-item float-center"> <a href="https://www.instagram.com/beusalons/" style="Margin:0;color:#2199e8;font-family:Helvetica,Arial,sans-serif;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left;text-decoration:none"><img src="http://res.cloudinary.com/dyqcevdpm/image/upload/v1291284496/social__ICON_4_twk3mc.png" alt="facebook" width="30" height="30" style="-ms-interpolation-mode:bicubic;border:none;clear:both;display:block;max-width:100%;outline:0;text-decoration:none;width:auto"></a> </th> </tr></tbody> </table> </th> <th class="expander" style="Margin:0;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0!important;text-align:left;visibility:hidden;width:0"></th> </tr><tr style="padding:0;text-align:left;vertical-align:top"> <th style="Margin:0;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left"> <table class="callout" style="Margin-bottom:16px;border-collapse:collapse;border-spacing:0;margin-bottom:16px;padding:0;text-align:left;vertical-align:top;width:100%!important"> <tbody> <tr style="padding:0;text-align:left;vertical-align:top"> <td style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word"> <p style="Margin:0;Margin-bottom:10px;color:#58595b!important;font-family:"Open Sans",sans-serif;font-size:.8em!important;font-weight:400;line-height:1.3;margin:0;margin-bottom:10px;padding:0;text-align:left"></p></td></tr></tbody> </table> </th> <th class="expander" style="Margin:0;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0!important;text-align:left;visibility:hidden;width:0"></th> </tr></tbody> </table> </th> </tr></tbody> </table> </td></tr></tbody> </table></body>';

    return mailBody;
}


appointmentSchema.statics.updateNewUsersInMarketingUsers = function(){
    var counter = 0;
    var premiumCustomer = false,
        maximumBill = 0,
        totalRevenue = 0;
    let arr = []
    for(skipLim=17;skipLim<=30;skipLim++){
        arr.push(skipLim)
    }
    async.eachSeries(arr,(skipLim,cb1)=>{
        User.find({},{firstName:1,lastName:1,emailId:1,phoneNumber:1,gender:1,loyalityPoints:1,latitude:1,longitude:1,firebaseId:1,firebaseIdIOS:1,iosVersion:1,subscriptionId:1,androidVersion:1,cityId:1}).sort({$natural:-1}).skip((skipLim - 1) * 100).limit(100).exec((err,users)=>{
            if(err){
                console.log('Server error')
                cb1()
            }else{
                async.eachSeries(users,(user,cb)=>{
                    //console.log(users)
                    Appointment.aggregate([
                        { $match: {'client.id': user._id,status:3,services:{$gt:[]}}},
                             //tdo.getDate()), $lt: new Date(tdo.getFullYear(), tdo.getMonth(), (tdo.getDate()+1)) }, //status: 3 } },
                        // { $sort: { appointmentStartTime: 1 } },
                        //{$project:{parlorName:1,parlorId:1,productRevenue:1,serviceRevenue:1,/subtotal:1,appointmentStartTime:1,services:1}},
                        {
                            $project:{
                                payableAmount: 1,
                                serviceRevenue: 1,
                                productRevenue :1,
                                subtotal :1,
                                parlorName:1,
                                parlorId:1,
                                "services.serviceCode":1,
                                "services.serviceId":1,
                                "services.serviceName":1,
                                "services.name":1,
                                "services.isFlashSale":1,
                                "services.categoryId":1,
                                appointmentStartTime: 1
                            }
                        },
                        {
                            $group:{
                                "_id":null,
                                payableAmount:{$last:"$payableAmount"},
                                totalRevenue:{$sum:{$add:["$serviceRevenue","$productRevenue"]}},
                                maximumBill:{$max:"$subtotal"},
                                lastAppointmentDate:{$last:"$appointmentStartTime"},
                                lastParlor:{$last:"$parlorName"},
                                lastParlorId:{$last:"$parlorId"},
                                appointmentCount:{$sum:1},
                                allServices:{$push:{services:"$services",appointmentStartTime:"$appointmentStartTime"}}
                            }
                        },
                        { $unwind: "$allServices" },
                        { $unwind: "$allServices.services"},
                        { $sort : {"allServices.services.id":1,"allServices.appointmentStartTime":1}},

                        {
                            $group: {
                                "_id":"$allServices.services.serviceId",
                                serviceLastAppointmentDate:               {$last:"$allServices.appointmentStartTime"},
                                serviceCode:{$last:"$allServices.services.serviceCode"},
                                serviceId:{$first:"$allServices.services.serviceId"}, 
                                serviceName:{$last:"$allServices.services.serviceName"}, 
                                name:{$last:"$allServices.services.name"}, 
                                isFlashSale:{$last:"$allServices.services.isFlashSale"}, 
                                categoryId:{$last:"$allServices.services.categoryId"},
                                totalRevenue : {$first:"$totalRevenue"},
                                maximumBill : {$first:"$maximumBill"},
                                lastAppointmentDate : {$first:"$lastAppointmentDate"},
                                lastParlor : {$first:"$lastParlor"},
                                count: {$sum:1},
                                lastParlorId : {$first:"$lastParlorId"},
                                payableAmount : {$first:"$payableAmount"}
                            }
                        }
                    ]).exec((err, apps) => {
                        let servicesTaken = [];
                        let marketingCategories = [];
                        
                        if (err) {
                            console.log('{message:"Server Error."}');
                            cb()
                        } else {    
                            //console.log('Not found')
                            //console.log(servicesTaken)
                            if(apps.length>0){
                                apps.forEach(element => { servicesTaken.push(
                                    {serviceLastAppointmentDate:element.serviceLastAppointmentDate,
                                    serviceCode:element.serviceCode,
                                    serviceId:element.serviceId, 
                                    serviceName:element.serviceName, 
                                    name:element.name, 
                                    isFlashSale:element.isFlashSale, 
                                    categoryId:element.categoryId})
                                });
                            }
                            var userDetails = {
                                "userId": user._id,
                                "firstName": user.firstName == undefined ? "" : user.firstName,
                                "lastName": user.lastName == undefined ? "" : user.lastName,
                                "emailId": user.emailId == undefined ? "" : user.emailId,
                                "phoneNumber": user.phoneNumber == undefined ? "" : user.phoneNumber,
                                "lastAppointmentDate": apps[0] == undefined ? "" : apps[0].lastAppointmentDate,
                                "lastParlor": apps[0] == undefined ? "":apps[0].lastParlor,
                                "lastParlorId": apps[0] == undefined ? null : apps[0].lastParlorId,
                                "appointmentCount": apps[0] == undefined ? 0 : apps[0].count,
                                "gender": ((user.gender).trim() === "" || user.gender == undefined) ? "M" : user.gender,
                                "loyalityPoints": user.loyalityPoints == undefined ? "" : user.loyalityPoints,
                                "latitude": user.latitude,
                                "longitude": user.longitude,
                                "firebaseId": user.firebaseId,
                                "firebaseIdIOS": user.firebaseIdIOS,
                                "iosVersion": user.iosVersion,
                                "subscriptionId": user.subscriptionId == undefined ? null : user.subscriptionId,
                                "androidVersion": user.androidVersion,
                                "marketingCategories": marketingCategories,
                                "servicesTaken": servicesTaken,
                                'premiumCustomer': premiumCustomer,
                                'maximumBill': apps[0] == undefined ? 0 : apps[0].maximumBill,
                                'totalRevenue': apps[0] == undefined ? 0 : apps[0].totalRevenue,
                                'cityId': (user.latitude != 0 && user.longitude != 0) ? ConstantService.getCityId(user.latitude, user.longitude) : 1
                            }
                            //console.log(userDetails)
                            MarketingUserNew.create(userDetails,(err,createduser)=>{
                                if(err){
                                    console.log(err)
                                    console.log('Error in creating user')
                                    cb()
                                }else{
                                    cb()
                                }
                            })
                        }
                    })
                },()=>{
                    console.log(skipLim*100)
                    cb1()
                })
            }
        })
    },()=>{
        console.log('Process end')
    })
}    

appointmentSchema.statics.updateUsersInMarketingUsers = function(){
    var counter = 0;
    var premiumCustomer = false,
        maximumBill = 0,
        totalRevenue = 0;
    
    async.eachSeries([1,2,3,4,5],(skipLim,cb1)=>{
        User.find({updatedAt:{$gte:HelperService.getLastDayStart()}},{firstName:1,lastName:1,emailId:1,phoneNumber:1,gender:1,loyalityPoints:1,latitude:1,longitude:1,firebaseId:1,firebaseIdIOS:1,iosVersion:1,subscriptionId:1,androidVersion:1,cityId:1}).sort({$natural:-1}).skip((skipLim - 1) * 100).limit(100).exec((err,users)=>{
            if(err){
                console.log('Server error')
                cb1()
            }else{
                async.eachSeries(users,(user,cb)=>{
                    //console.log(users)
                    Appointment.aggregate([
                        { $match: {'client.id': user._id,status:3,services:{$gt:[]}}},
                        {
                            $project:{
                                payableAmount: 1,
                                serviceRevenue: 1,
                                productRevenue :1,
                                subtotal :1,
                                parlorName:1,
                                parlorId:1,
                                "services.serviceCode":1,
                                "services.serviceId":1,
                                "services.serviceName":1,
                                "services.name":1,
                                "services.isFlashSale":1,
                                "services.categoryId":1,
                                appointmentStartTime: 1
                            }
                        },
                        {
                            $group:{
                                "_id":null,
                                payableAmount:{$last:"$payableAmount"},
                                totalRevenue:{$sum:{$add:["$serviceRevenue","$productRevenue"]}},
                                maximumBill:{$max:"$subtotal"},
                                lastAppointmentDate:{$last:"$appointmentStartTime"},
                                lastParlor:{$last:"$parlorName"},
                                lastParlorId:{$last:"$parlorId"},
                                appointmentCount:{$sum:1},
                                allServices:{$push:{services:"$services",appointmentStartTime:"$appointmentStartTime"}}
                            }
                        },
                        { $unwind: "$allServices" },
                        { $unwind: "$allServices.services"},
                        { $sort : {"allServices.services.id":1,"allServices.appointmentStartTime":1}},
                        {
                            $group: {
                                "_id":"$allServices.services.serviceId",
                                serviceLastAppointmentDate:               {$last:"$allServices.appointmentStartTime"},
                                serviceCode:{$last:"$allServices.services.serviceCode"},
                                serviceId:{$first:"$allServices.services.serviceId"}, 
                                serviceName:{$last:"$allServices.services.serviceName"}, 
                                name:{$last:"$allServices.services.name"}, 
                                isFlashSale:{$last:"$allServices.services.isFlashSale"}, 
                                categoryId:{$last:"$allServices.services.categoryId"},
                                totalRevenue : {$first:"$totalRevenue"},
                                maximumBill : {$first:"$maximumBill"},
                                lastAppointmentDate : {$first:"$lastAppointmentDate"},
                                lastParlor : {$first:"$lastParlor"},
                                count: {$sum:1},
                                lastParlorId : {$first:"$lastParlorId"},
                                payableAmount : {$first:"$payableAmount"}
                            }
                        }
                    ]).exec((err, apps) => {
                        let servicesTaken = [];
                        let marketingCategories = [];
                        if (err) {
                            console.log('{message:"Server Error."}');
                            cb()
                        } else {  
                            console.log(apps)
                            if(apps.length>0){
                                apps.forEach(element => { servicesTaken.push(
                                    {serviceLastAppointmentDate:element.serviceLastAppointmentDate,
                                    serviceCode:element.serviceCode,
                                    serviceId:element.serviceId, 
                                    serviceName:element.serviceName, 
                                    name:element.name, 
                                    isFlashSale:element.isFlashSale, 
                                    categoryId:element.categoryId})
                                });
                            } 
                            MarketingUserNew.findOne({userId:user._id},(err,MkUser)=>{
                                if(MkUser){
                                    //servicesTaken = MkUser.servicesTaken.push(servicesTaken)
                                    console.log(servicesTaken)
                                    MarketingUserNew.updateOne({userId:user._id},{servicesTaken:servicesTaken,updatedAt: new Date()},(err,updated)=>{
                                        console.log('updated')
                                    })
                                    cb()
                                }else{
                                    var userDetails = {
                                        "userId": user._id,
                                        "firstName": user.firstName == undefined ? "" : user.firstName,
                                        "lastName": user.lastName == undefined ? "" : user.lastName,
                                        "emailId": user.emailId == undefined ? "" : user.emailId,
                                        "phoneNumber": user.phoneNumber == undefined ? "" : user.phoneNumber,
                                        "lastAppointmentDate": apps[0] == undefined ? "" : apps[0].lastAppointmentDate,
                                        "lastParlor": apps[0] == undefined ? "":apps[0].lastParlor,
                                        "lastParlorId": apps[0] == undefined ? null : apps[0].lastParlorId,
                                        "appointmentCount": apps[0] == undefined ? 0 : apps[0].count,
                                        "gender": ((user.gender).trim() === "" || user.gender == undefined) ? "M" : user.gender,
                                        "loyalityPoints": user.loyalityPoints == undefined ? "" : user.loyalityPoints,
                                        "latitude": user.latitude,
                                        "longitude": user.longitude,
                                        "firebaseId": user.firebaseId,
                                        "firebaseIdIOS": user.firebaseIdIOS,
                                        "iosVersion": user.iosVersion,
                                        "subscriptionId": user.subscriptionId == undefined ? null : user.subscriptionId,
                                        "androidVersion": user.androidVersion,
                                        "marketingCategories": marketingCategories,
                                        "servicesTaken": servicesTaken,
                                        'premiumCustomer': premiumCustomer,
                                        'maximumBill': apps[0] == undefined ? 0 : apps[0].maximumBill,
                                        'totalRevenue': apps[0] == undefined ? 0 : apps[0].totalRevenue,
                                        'cityId': (user.latitude != 0 && user.longitude != 0) ? ConstantService.getCityId(user.latitude, user.longitude) : 1
                                    }
                                    //console.log(userDetails)
                                    MarketingUserNew.create(userDetails,(err,createduser)=>{
                                        if(err){
                                            console.log(err)
                                            console.log('Error in creating user')
                                            cb()
                                        }else{
                                            console.log('created')
                                            cb()
                                        }
                                    })
                                }
                            }) 
                        }
                    })
                },()=>{
                    console.log('Done')
                    cb1()
                })
            }
        })
    },()=>{
        console.log('Process end')
    })   
}

// on every save, add the date
appointmentSchema.pre('save', function(next) {
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


appointmentSchema.pre('update', function(next) {
  this.update({},{ $set: { updatedAt: new Date() } });
  next();
});
// appointmentSchema.plugin(autoIncrement.plugin, 'appointment');
var Appointment = mongoose.model('appointment', appointmentSchema);

// make this available to our users in our Node applications
module.exports = Appointment;