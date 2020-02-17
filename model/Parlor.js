/**
 * Parlor.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
// -ve (salon se lena hai amount)
// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var parlorSchema = new Schema({

    name: { type: 'string', required: true },

    parlorIdNumeric : {type : 'number',},

    branchCode: { type: 'string', default : null },

    legalEntity: { type: 'string' },

    phoneNumber: { type: 'string' },

    socketId: { type: 'array', defaultsTo: [] },

    link: { type: 'string', },

    isAvailableForHomeService: { type: 'boolean', default: false },

    homeServiceRange: { type: 'number', default: 10000 },

    homeServiceMinimumOrderAmount: { type: 'number', default: 10 },

    editPriceAtBooking: { type: 'boolean', default: false }, // edit price on crm

    extraDiscountCouponAvailable: { type: 'boolean', default: false }, // Discount given to particular user only

    cashPaymentAvailable: { type: 'boolean', default: true },

    address: { type: 'string', required: true },

    editDiscountFromCrmPermission: { type: 'boolean', default: false },

    twoPLusOneDealAvailable: { type: 'boolean', default: false },

    earlyBirdOfferPresent: { type: 'boolean', default: false },

    earlyBirdOfferType: { type: 'number', default: 0 },  // 1- price is 699, 2 - price is 1199

    earlyBirdOfferTypeOneSold: { type: 'number', default: 1000000 }, //20 -2

    subscriptionsSold: { type: 'number', default: 0 }, 

    landmark: { type: 'string' },

    address2: { type: 'string', required: true },

    brands: { type: 'string', default: "LOreal, Sara, O3 Plus" },

    brandsArray: { type: [] },

    dailyParlorHour: { type: 'number', required: true, default: 0 },

    recentTenRatingAvg: { type: 'number', default: 0 },

    homeServiceFactor: { type: 'number', default: 1 },

    averageNoOfClientsPerDay: { type: 'number', default: 0 },

    appRevenuePercentage: { type: 'number', default: 0 },

    appDistanceRevenue: { type: 'number', default: 0 },

    appDistanceRevenueFirstTime: { type: 'number', default: 0 },

    revenueDiscount: { type: 'number', default: 0 },

    revenueDiscountAvailable: { type: 'boolean', default: false },

    revenueDiscountSlabDown: { type: 'boolean', default: false },

    parlorType: { type: 'number', default: 0 }, // 0 -red, 1 - blue , 2 - green, 4 - Affilliate

    ambienceRating: {type : 'number', default: 3 },

    serviceCommission: { type: 'number', default: 0 }, //

    dayClosed: { type: 'number', default: 0 }, // 0 -none, 1 - 7  days  1-Sunday 2- MOnday ....

    productCommission: { type: 'number', default: 0 }, // 0-normal, 1 slab based

    commissionType: { type: 'number', default: 0 }, // 0 -normal, 1 - threshold required

    thresholdAmount1: { type: 'number', default: 0 },

    thresholdAmount1Commission: { type: 'number', default: 0 },

    thresholdAmount2: { type: 'number', default: 0 },

    thresholdAmount2Commission: { type: 'number', default: 0 },

    thresholdAmount3: { type: 'number', default: 0 },

    thresholdAmount3Commission: { type: 'number', default: 0 },

    centerId: { type: 'number', defaultsTo: 0 },

    images: {
        type: [{

            imageUrl: { type: 'string' },

            appImageUrl: { type: 'string' },

            createdAt: { type: 'date' },

        }]
    },

    email: Array,

    emails: {
        type: [{

            name: { type: 'string' },

            number: { type: 'number' },

            emailId: { type: 'string' }

        }]
    },

    discountEndTime: { type: 'date' },

    realDiscountEndTime: { type: 'date' },

    services: {
        type: [{

            gender: { type: 'String' },

            name: { type: 'String' },

            serviceDiscount : {type : 'number', default : 0},

            subTitle: { type: 'String' },

            categoryId: { type: Schema.Types.ObjectId, ref: 'ServiceCategory' },

            serviceId: { type: Schema.Types.ObjectId, ref: 'service' },

            serviceCode: { type: 'number', required: true },

            basePrice: { type: 'number', required: true },

            actualUnits: { type: 'number', default : 0 },

            productCheckRequired: { type: 'boolean', default : false },

            prices: [{

                priceId: { type: 'number', required: true },

                brand: {

                    title: { type: 'String' },

                    brands: {
                        type: [{

                            name: { type: 'String' },

                            brandId: { type: Schema.ObjectId },

                            productTitle: { type: 'String', default: null },

                            ratio: { type: 'number', default: 1 },

                            products: {

                                type: [{

                                    name: { type: 'String' },

                                    ratio: { type: 'number', default: 1 },

                                    productId: { type: Schema.Types.ObjectId, ref: 'ServiceProduct' },

                                }],
                                defaultsTo: []
                            },
                        }],
                        defaultsTo: []
                    },
                },
                
                homeRatio: { type: 'number', default: 1 },

                percentageDifference: { type: 'number', required: true },

                name: { type: 'String', required: true },

                price: { type: 'number', required: true },

                tax: { type: 'number', required: true },

                estimatedTime: { type: 'number', required: true },

                additions: [{

                    name: { type: 'String' },

                    types: [{
                        name: { type: 'String' },
                        percentageDifference: { type: 'number' },
                        additions: { type: 'number' },
                    }]

                }],

                employees: [{

                    userId: { type: Schema.Types.ObjectId, ref: 'Admin' },

                    name: { type: 'string', required: true },

                    commission: { type: 'number', default: 0 },

                }],

                createdAt: { type: 'date' },

                updatedAt: { type: 'date' },

                addedBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
            }]

        }],
        defaultsTo: []
    },

    packages: {
        type: [{

            packageId: { type: 'Number' },

            name: { type: 'String' },

            price: { type: 'Number' },

            services: [{

                serviceId: { type: Schema.Types.ObjectId, ref: 'Service' },

                name: { type: 'string', required: true },
            }],

            createdAt: { type: 'date' },

            updatedAt: { type: 'date' },

            addedBy: { type: Schema.Types.ObjectId, ref: 'Admin' },

        }],
        defaultsTo: []
    },

    tax: { type: 'number', default: 0 },

    smscode: { type: 'string' },

    logo: { type: 'string' },

    serviceTaxNumber: { type: 'string' },

    tinNumber: { type: 'string' },

    latitude: { type: 'number' },

    longitude: { type: 'number' },

    geoLocation: {

        type: [Number], // [<longitude>, <latitude>]

        index: '2dsphere' // create the geospatial index
    },

    gender: { type: 'number', default: 1 }, // 1 - unisex , 2 - male, 3 - female

    budget: { type: 'number', default: 1 }, // 1 - lowest  --- 5

    smsRemaining: { type: 'number', default: 0 },

    timing: { type: 'array', defaultsTo: [] },

    isMirrorAvailable : {type : 'boolean', default : false},

    wifiName: { type: 'string', default: "" },

    wifiPassword: { type: 'string', default: "" },

    closingTime: { type: 'string' },

    openingTime: { type: 'string' },

    createdAt: { type: 'date' },

    updatedAt: { type: 'date' },

    rating: { type: 'number' },

    panNo: { type: 'string' },


//  Razor Pay Account
// -------------------------------
    bankName: { type: 'string' },

    contactIdRazorPay: { type: 'string' },

    branchName: { type: 'string' },

    bankBeneficiaryName: { type: 'string' },

    accountNo: { type: 'string' },

    ifscCode: { type: 'string' },

    fundAccountIdRazorPay : {type : 'string'},

    fundAccountHistory : {type: 'array', defaultsTo: [] },
// -------------------------------

    noOfUsersRated: { type: 'number', default: 0 },

    attendanceWorking: { type: 'number', default: 0 },

    active: { type: 'boolean', default: true },

    salonEmailId: { type: 'string' },

    minimumGuarantee: { type: 'number', default: 0 },

    gstNumber: { type: 'string' },

    appDigital: { type: 'number', max: 15, default: 0 },

    refundOnErpLimit: { type: 'number', default: 0 },

    firstAppDigital: { type: 'number', max: 15, default: 0 },

    firstAppCash: { type: 'number', max: 15, default: 0 },

    onErp: { type: 'number', max: 15, default: 0 },

    unsignedMou: { type: 'string' },

    unsignedMouStatus: { type: 'boolean' },

    maximumRefundOnErp: { type: 'number' },

    maximumRefundOnAppCash: { type: 'number' },

    parlorLiveDate: { type: 'date' },

    refundEffectiveDate: { type: 'date' },

    appCash: { type: 'number', default: 0 },

    topBills: [],

    avgBillValue: { type: 'number', default: 0 },

    topServiceBills: [],

    avgServiceBill: { type: 'number', default: 0 },

    refundByOtp: { type: 'Boolean', default: true },

    breakEven: { type: 'number', default: 0 },

    L1: { type: 'number', default: 0 },
    L2: { type: 'number', default: 0 },
    L3: { type: 'number', default: 0 },

    cityId: { type: 'number', default: 1 }, //1- Delhi, 2- Bengaluru, 3- Pune, 4 - Patna, 5 - Dehradun

    googleRateLink: { type: 'string' },

    salonDelayTime: { type: 'number', default: 60 },

    showSalonSupportData: { type: 'boolean', default: false },
    
    isCrmDashbord: { type: 'boolean', default: true },

    threeXModel: { type: 'boolean', default: true },
    
    threeXModelStartDate: { type: 'date'},

    modelType: {type : 'number'}, //1-yearly, 2-half-yearly, 3- quarterly,

    modelTypeLiveDate : {type : 'date'},

    stateName : { type : 'string' },

    avgRoyalityAmount : { type : 'number'},  

    mainMinimumGuarantee : { type : 'number' },

    reLiveOpenDate : { type : 'date'},

    reLiveCloseDate : { type : 'date'},

    previousPerDayMg : { type : 'number'},

    signUpFees : { type : 'number', default : 0},

    reverseChargeMultiple : { type : 'number', default : 0},

    signUpFeesReceivedOn : { type : 'date', default : new Date()},

    holdPayment : { type : 'boolean', default : false},

    p1p2 : {
         type: [{

        categoryId: { type: Schema.Types.ObjectId, ref: 'ServiceCategory' },

        categoryName: { type: 'string', required: true },

        male : {type : 'number', default : 0},

        female : {type : 'number', default : 0},
    }],
    defaultsTo : []
    }

    // (1- avgDistanceRevenue)/avgRoyalityAmount

});


var RAZORPAY_KEY = localVar.getRazorKey();
var RAZORPAY_APP_SECRET = localVar.getRazorAppSecret();
var request = require('request');

parlorSchema.statics.checkIfMonsoonSalon = function(parlorId , call){
      Parlor.find({_id: parlorId , name: {$regex : "Monsoon"}},{name:1} , function(err, parlor){
        if(parlor.length>0)return call(true);
        else return call(false);
      })
};

parlorSchema.statics.addFundAccount = function(req, parlor, updateObj, callback){
    if(req.body.bankName != parlor.bankName || req.body.accountNo != parlor.accountNo || req.body.bankBeneficiaryName != parlor.bankBeneficiaryName || req.body.ifscCode != parlor.ifscCode || !parlor.fundAccountIdRazorPay){
        Parlor.addFundAccountToContactId(parlor.contactIdRazorPay, req.body.bankBeneficiaryName, req.body.ifscCode, req.body.accountNo, req.body.bankName, function(data){
            updateObj.fundAccountIdRazorPay = data.id
            updateObj.$push  = {fundAccountHistory : data};
            updateObj.bankName = req.body.bankName;
            updateObj.accountNo = req.body.accountNo;
            updateObj.bankBeneficiaryName = req.body.bankBeneficiaryName;
            updateObj.ifscCode = req.body.ifscCode;
            Parlor.update({_id: req.body.parlorId}, updateObj, function(err , update){
                console.log(err)
                callback()
            });
        });
    }else{
        Parlor.update({_id: req.body.parlorId}, updateObj, function(err , update){
                console.log(err)
            callback()
        });
    }

},

parlorSchema.statics.processSettlement = function(s, callback){
    SettlementReport.findOne({_id : s.id, isProcessed : false, netPayable : {$gt : 0}}, {period:1, parlorId : 1, holdPayment : 1, netPayable : 1 }, function(er, sett){
        if(sett){
            if(sett.holdPayment){
                SettlementReport.update({_id : s.id}, {isProcessed : true}, function(er, f){
                    callback()
                })
            }else{
                SettlementReport.update({_id : s.id}, {isProcessed : true}, function(er, f){
                    Parlor.findOne({_id : sett.parlorId}, {fundAccountIdRazorPay: 1}, function(er, parlor){
                        if(parlor.fundAccountIdRazorPay && sett.netPayable > 0){
                            let finalAmount = sett.netPayable
                            var reqObj ={
                                "account_number" : "7878780061253674",
                                "fund_account_id" : parlor.fundAccountIdRazorPay,
                                "amount" : finalAmount * 100,
                                "currency" : "INR",
                                "mode" : "IMPS",
                                "purpose" : "payout",
                                "narration": "Be U Salons",
                                "notes": {
                                    "settlementId": sett.id,
                                    "parlorId": parlor.id,
                                    "period": sett.period,
                                }
                              };
                              console.log(reqObj)
                              request({
                                    url: "https://api.razorpay.com/v1/payouts", //URL to hit
                                    method: 'POST',
                                    headers :{
                                        'Content-Type':'application/json',
                                    },
                                    'auth': {
                                        'user': RAZORPAY_KEY,
                                        'pass' : RAZORPAY_APP_SECRET
                                      },
                                    body : JSON.stringify(reqObj)
                                }, function(error, re, body) {
                                    console.log(body)
                                    let data = JSON.parse(body);
                                    if(!data.error){
                                        SettlementReport.update({_id : s.id}, {isProcessed : true, transactionObj: data, amountSent : sett.netPayable, transactionReference : data.id}, function(er, f){
                                            callback()
                                        })  
                                    }else{
                                        SettlementReport.update({_id : s.id}, {isProcessed : false}, function(er, f){
                                            callback()
                                        }) 
                                    }
                                });
                        }else{
                            SettlementReport.update({_id : s.id}, {isProcessed : false}, function(er, f){
                                callback()
                            }) 
                        }
                    })
                })
            }
        }else{
            callback()
        }
    })
};

parlorSchema.statics.addFundAccountToContactId = function(contactIdRazorPay , bankBeneficiaryName, ifscCode, accountNo, bankName, callback){
    var reqObj ={
                "contact_id" : contactIdRazorPay,
                account_type : 'bank_account',
                "details": {
                    "name": bankBeneficiaryName,
                    "ifsc": ifscCode,
                    "account_number": accountNo,
                    // "bank_name" : bankName
                }
              };
     request({
            url: "https://api.razorpay.com/v1/fund_accounts", //URL to hit
            method: 'POST',
            headers :{
                'Content-Type':'application/json',
            },
            'auth': {
                'user': RAZORPAY_KEY,
                'pass' : RAZORPAY_APP_SECRET
              },
            body : JSON.stringify(reqObj)
        }, function(error, re, body) {
            console.log(body)
            let data = JSON.parse(body);
            return callback(data)
        });
};

parlorSchema.statics.createRazorPayContactId = function(parlorId , address1, address2, parlorName, callback){
     request({
            url: "https://api.razorpay.com/v1/contacts", //URL to hit
            method: 'POST',
            headers :{
                'Content-Type':'application/json',
            },
            'auth': {
                'user': RAZORPAY_KEY,
                'pass' : RAZORPAY_APP_SECRET
              },
            body : JSON.stringify({
                name : parlorName,
                type : 'vendor',
                reference_id : parlorId,
                notes : {
                    address1 : address1,
                    address2 : address2,
                }
              })
        }, function(error, re, body) {
            console.log(error)
            console.log(body)
            let b = JSON.parse(body);
            return callback(b.id)
        });
};


parlorSchema.statics.updateEarlyBirdData = function(parlorId , subscriptionId){
    if(parlorId != null && subscriptionId != 2){
        Parlor.findOne({_id: parlorId} , {earlyBirdOfferPresent : 1, earlyBirdOfferType : 1, earlyBirdOfferTypeOneSold : 1}, function(err, parlor){
            if(parlor.earlyBirdOfferPresent == true ){
                var updateObj ={};
                if(parlor.earlyBirdOfferTypeOneSold >= 69 ){
                    updateObj.earlyBirdOfferType = 0;
                    updateObj.earlyBirdOfferPresent = false;
                 }
                  else if(parlor.earlyBirdOfferTypeOneSold >= 9){

                    updateObj.earlyBirdOfferType = 2;
                    updateObj.earlyBirdOfferTypeOneSold = parlor.earlyBirdOfferTypeOneSold + 1;

                 }
                 else if(parlor.earlyBirdOfferTypeOneSold < 10){

                    updateObj.earlyBirdOfferType = 1;
                    updateObj.earlyBirdOfferTypeOneSold = parlor.earlyBirdOfferTypeOneSold + 1;

                 }
                Parlor.update({_id : parlorId}, updateObj, function(err, parlor){
                    if(!err)
                        console.log(parlor)
                    else
                        console.log(err)
                })
            }else{
                console.log("offer not present in this salon")
            }
        })
    }else{
        console.log("parlorId was null proof-" , parlorId)
    }
};

parlorSchema.statics.parlorServicesDepartmentWise = function(parlorService, parlorId, cb) {
    AggregateService.serviceByDepartment(1, parlorId, function(results) {
        var data = _.map(results, function(r) {
            return {
                gender: r.gender,
                departments: r.departments
            };
        });
        return cb(data);
    });
};

parlorSchema.statics.updateSalonRating = function(parlorId) {

    Appointment.aggregate([
        { $match: { parlorId: parlorId, review: { $exists: true }, 'review.rating': { $gt: 1 }, status: 3 } },
        { $group: { _id: '$parlorId', count: { $sum: 1 }, rating: { $sum: "$review.rating" } } },
        { $project: { parlorId: "$_id", count: "$count", avgRating: { $divide: ['$rating', '$count'] } } }
    ], function(err, agg) {

        var rating = (agg[0].avgRating.toFixed(1) > 1) ? agg[0].avgRating.toFixed(1) : 4;
        var count = (agg[0].count > 0) ? agg[0].count : 1;

        Parlor.update({ _id: agg[0].parlorId }, { rating: rating, noOfUsersRated: count }, function(err, data) {
            console.log('rating of parlor updated')
        });
    });
};


parlorSchema.statics.getAppRevenueDiscountPercentange = function(appRevenuePercentage, revenueDiscountAvailable, revenueDiscountSlabDown) {
    var discount = 0, inTime = false;
    if (revenueDiscountAvailable) {
        /*if (appRevenuePercentage < 0.2) discount = revenueDiscountSlabDown ? 15 : 20;
        else if (appRevenuePercentage < 0.4) discount = revenueDiscountSlabDown ? 10 : 15;
        else if (appRevenuePercentage < 0.6) discount = revenueDiscountSlabDown ? 0 : 10;
        else discount = 0;*/ 
        discount = appRevenuePercentage;
    }
    let d = new Date();
    let day = d.getDay();
    let hr = d.getHours();
    if(day == 1 || day == 2 || day == 3 || day==4){
    // if(1){
        if(hr >= 12 && hr <= 16)inTime = true;
    }
    if(!inTime)discount = 0;
    return discount;
};

parlorSchema.statics.getAppRevenueDiscountPercentangeIgnoreHr = function(appRevenuePercentage, revenueDiscountAvailable) {
    var discount = 0, inTime = false;
    if (revenueDiscountAvailable) {
        discount = appRevenuePercentage;
    }
    let d = new Date();
    let day = d.getDay();
    let hr = d.getHours();
    if(day == 1 || day == 2 || day == 3 || day==4){
    // if(1){
        inTime = true;
    }
    if(!inTime)discount = 0;
    return discount == 0 ? "" : "Happy Hour Flat "+discount+"% OFF Between 12 and 4 PM";
};

parlorSchema.statics.parlorDepartments = function(parlorService, parlorId, cb) {
    AggregateService.parlorDepartment(parlorId, function(results) {
        var data = _.map(results, function(r) {
            return {
                gender: r.gender,
                departments: r.departments
            };
        });
        return cb(data);
    });
};

parlorSchema.statics.subscriberReportLastMonth = function(parlorId, cb) {
    var data = {totalSubscriberAppointment : 0};
    Async.parallel([
        function(callback){
            Appointment.aggregate([
                {$match : {status : 3,"client.subscriptionLoyality" : {$gt : 0},"appointmentStartTime" : {$gt : new Date(2018, 0, 1)},"serviceRevenue" : {$gt : 0},}},
                {$project : {parlorId : 1,parlorName : 1,parlorAddress : 1,clientId : "$client.id",appointmentStartTime : 1,}},
                {$sort : {appointmentStartTime : 1},},
                {$group : {_id : {clientId : "$clientId"},parlorId : {$first : "$parlorId"},parlorName : {$first : "$parlorName"},parlorAddress : {$first : "$parlorAddress"},clientId : {$first : "$clientId"},}},
                {$group : {_id : "$parlorId",noOfSubscriptionSold : {$sum : 1},parlorId : {$first : "$parlorId"},parlorName : {$first : "$parlorName"},parlorAddress : {$first : "$parlorAddress"}}},
                {$match : {parlorId : parlorId}},
                ]).exec(function(err, f){
                    if(f.length > 0){
                        data.totalSubscriberAppointment = f[0].noOfSubscriptionSold;
                    }
                    callback();
                });
        },
        function(callback) {
            Appointment.aggregate([
                {$match : {parlorId : parlorId, appointmentStartTime : {$gt : HelperService.getLastMonthStart()}, status : 3, "client.subscriptionLoyality" : {$gt : 0}}},
                {$project : {serviceRevenue : 1, clientId : "$client.id", loyalityPoints : 1, loyalityOffer: 1}},
                {$group : {_id : "$clientId", clientId : {$first : "$clientId"}, serviceRevenue : {$sum : "$serviceRevenue"}, loyalityPoints : {$sum : "$loyalityPoints"}, loyalityOffer : {$sum : "$loyalityOffer"} }},
                {$group : {_id : null, totalServiceRevenue : {$sum : "$serviceRevenue"}, loyalityPoints : {$sum : "$loyalityPoints"}, loyalityOffer : {$sum : "$loyalityOffer"}, count : {$sum : 1}}}
            ]).exec(function(er, r){
                var totalSubscriberAppointment = 0, averageRevenueSubscriber = 0;
                if(r[0]){
                    totalSubscriberAppointment = r[0].count;
                    averageRevenueSubscriber = (r[0].totalServiceRevenue-((r[0].loyalityPoints-r[0].loyalityOffer)/2)) + r[0].loyalityOffer/2;
                    averageRevenueSubscriber /= r[0].count;
                }
                data.totalSubscriberAppointmentLast30Days = totalSubscriberAppointment;
                data.averageRevenueSubscriber = parseInt(averageRevenueSubscriber);
                callback();
            });  
        },
        function(callback) {
           Appointment.aggregate([
                {$match : {parlorId : parlorId, appointmentStartTime : {$gt : HelperService.getLastMonthStart()}, status : 3, "client.subscriptionLoyality" : {$gt : 0}}},
                {$project : {serviceRevenue : 1, clientId : "$client.id", name : "$client.name", appointmentStartTime : 1, phoneNumber : "$client.phoneNumber", loyalityPoints : 1, loyalityOffer: 1}},
                {$sort : {appointmentStartTime : 1}},
                {$group : {_id : "$clientId", clientId : {$first : "$clientId"},appointmentStartTime : {$push : "$appointmentStartTime"}, phoneNumber : {$first : "$phoneNumber"}, name : {$first : "$name"}, clientId : {$first : "$clientId"}, serviceRevenue : {$sum : "$serviceRevenue"}, loyalityPoints : {$sum : "$loyalityPoints"}, loyalityOffer : {$sum : "$loyalityOffer"} }},
            ]).exec(function(er, r){
                data.customers = _.map(r, function(re){
                    return{
                        name : re.name,
                        clientId : re.clientId,
                        revenue : parseInt((re.serviceRevenue-((re.loyalityPoints-re.loyalityOffer)/2)) + re.loyalityOffer/2),
                        appointmentStartTime : re.appointmentStartTime,
                    }
                });
                callback();
            });  
        }
    ],
    function(err, results) {
        return cb(data);
    });    
};

parlorSchema.statics.getReportForApp = function(parlorId, cb) {
    var data = {}, uniqueClient90Days = 0, uniqueClientTillDate = 0, uniqueClient90DaysAbove2000 = 0, facialCount = 0, facialRevenue = 0, hairColorCount = 0, hairColorRevenue = 0;
    // getLastMonthStart
// getLastThreeMonthStart
    Async.parallel([
        function(callback) {
            Parlor.findOne({_id : parlorId}, {name : 1, address : 1}, function(err, parlor){
                data.name = parlor.name;
                data.address = parlor.address;
                callback();
            });          
        },
        function(callback) {
            Appointment.aggregate([
                { $match : {parlorId : parlorId,status : 3} },
                {$project : {"clientId" : "$client.id"} },
                {$group: { _id : "$clientId"}},
                {$group: { _id : null, footFall : {$sum : 1}}},
            ]).exec(function(err, d){
                uniqueClientTillDate = d[0].footFall;
                callback();
            });
        },
        function(callback) {
            Appointment.aggregate([
                { $match : {appointmentStartTime : {$gt : HelperService.getLastThreeMonthStart()},parlorId : parlorId,status : 3} },
                {$project : {"clientId" : "$client.id"} },
                {$group: { _id : "$clientId"}},
                {$group: { _id : null, footFall : {$sum : 1}}},
            ]).exec(function(err, d){
                uniqueClient90Days = d[0].footFall;
                callback();
            });
        },
        function(callback) {
            Appointment.aggregate([
                { $match : {appointmentStartTime : {$gt : HelperService.getLastThreeMonthStart()},parlorId : parlorId,status : 3} },
                {$project : {"clientId" : "$client.id", "serviceRevenue" : 1, "productRevenue" : 1, year : { $year: "$appointmentStartTime" }, month : { $month: "$appointmentStartTime" }, day : { $dayOfMonth: "$appointmentStartTime" } } },
                {
                    $group : {
                        _id : {
                            year : "$year",
                            month : "$month",
                            day : "$day",
                            clientId : "$clientId",
                        },
                        clientId : {$first : "$clientId"},
                        serviceRevenue : {$sum : "$serviceRevenue"},
                        productRevenue : {$sum : "$productRevenue"},
                    }},
                {$project : {clientId : 1, revenue : { $sum: [ "$serviceRevenue", "$productRevenue" ] }}},
                {$match : {revenue : {$gt : 2000}},},
                {$group: { _id : "$clientId"}},
                {$group: { _id : null, footFall : {$sum : 1}}},
            ]).exec(function(err, dd){
                uniqueClient90DaysAbove2000 = dd[0] ? dd[0].footFall : 0;
                callback();
            });
        },
        function(callback) {
            Appointment.aggregate([
            { $match : {appointmentStartTime : {$gt : HelperService.getLastMonthStart()},parlorId : parlorId,status : 3} },
            {$project : {"services.categoryId" : 1, "services.price" : 1, "services.loyalityPoints" : 1}},
            {$unwind : "$services"},
            {$project : {categoryId : "$services.categoryId", revenue  : { $sum :[ "$services.price", { $multiply: [ "$services.loyalityPoints", -0.5 ] } ]}  } },
            {$match : {categoryId : {$in : [ObjectId("58707ed90901cc46c44af27d"), ObjectId("58707ed90901cc46c44af27e"), ObjectId("58707ed90901cc46c44af278")]}}},
            {$group : {
                _id : "$categoryId",
                categoryId : {$first : "$categoryId"},
                revenue : {$sum : "$revenue"},
                count : {$sum : 1},
            }}
            ]).exec(function(err, d){
                _.forEach(d, function(cat){
                    if(cat.categoryId + "" == "58707ed90901cc46c44af278"){
                        facialCount += cat.count;
                        facialRevenue += cat.revenue;
                    }else{
                        hairColorCount += cat.count;
                        hairColorRevenue += cat.revenue;
                    }
                });
                callback();
            });
        },
        function(callback) {
            Appointment.aggregate([
            { $match : {appointmentStartTime : {$gt : HelperService.getLastMonthStart()},parlorId : parlorId,status : 3} },
            {$project : {"clientId" : "$client.id",serviceRevenue : 1, productRevenue : 1,productRevenuePresent : {$cond: { if: { $gt: ["$productRevenue", 0] }, then: 1, else: 0 }}} },
            {
                $group : {
                    _id : "$clientId",
                    serviceRevenue : {$sum : "$serviceRevenue"},
                    productRevenue : {$sum : "$productRevenue"},
                    productRevenuePresent : {$first : "$productRevenuePresent"},
                }
            },
            {
                $group : {
                    _id : null,
                    footFall : {$sum : 1},
                    serviceRevenue : {$sum : "$serviceRevenue"},
                    productRevenue : {$sum : "$productRevenue"},
                    productCount : {$sum : "$productRevenuePresent"},
                }
            }
            ]).exec(function(err, d){
                data.productCountLast30Days = d[0].productCount;
                data.productRevenueLast30Days = d[0].productRevenue;
                data.footFallLast30Days = d[0].footFall;
                data.averageBillValueLast30Days = parseInt((d[0].serviceRevenue+d[0].productRevenue)/d[0].footFall);
                callback();
            });
        }
    ],
    function(err, results) {
        data.uniqueClient90Days = uniqueClient90Days;
        data.uniqueClientTillDate = uniqueClientTillDate;
        data.uniqueClient90DaysAbove2000 = uniqueClient90DaysAbove2000;
        data.facialCount = facialCount;
        data.facialRevenue = facialRevenue;
        data.hairColorCount = hairColorCount;
        data.hairColorRevenue = hairColorRevenue;

        data.productSalePercentage = parseFloat(((data.productCountLast30Days/data.footFallLast30Days)*100).toFixed(2)); 
        data.hairServicePercentage = parseFloat(((hairColorCount/data.footFallLast30Days)*100).toFixed(2));
        data.facialServicePercentage = parseFloat(((facialCount/data.footFallLast30Days)*100).toFixed(2));
        data.repeatClientPercentage =parseFloat(((uniqueClient90Days/uniqueClientTillDate)*100).toFixed(2));
        data.uniqueClient90DaysRevenue2000Percentage =parseFloat(((uniqueClient90DaysAbove2000/uniqueClient90Days)*100).toFixed(2));
        return cb(data);
    });
};

parlorSchema.statics.getParlorListOnly = function(req, cb) {
        var user = {},
            parlors = [],
            parlorIdswithFlashCoupons = [],
            isSubscribed = false;
        Async.parallel([
                function(callback) {
                    User.findOne({ _id: req.query.userId }, { subscriptionValidity: 1, subscriptionBuyDate: 1, freebieExpiry: 1, favourites: 1, recent: 1, gender: 1, couponCodeHistory: 1, freeServices: 1, loyalityPoints: 1, subscriptionRedeemMonth: 1, subscriptionId: 1, subscriptionLoyality: 1 }, function(err, user1) {
                        if (user1) {
                            user = user1;
                            isSubscribed = user.subscriptionId ? true : false
                            
                            User.getSubscriptionLeftByMonthv4(req.query.userId, new Date(), user.subscriptionLoyality, function(reed) {
                                subscriptionAmount = reed;
                                callback(null);
                            });
                        } else {

                            callback(null);
                        }
                    });
                },
                function(callback) {
                    var query = {};
                    if (localVar.isServer()) query.active = true;
                    else query.active = false;
                    FlashCoupon.find(query, {code : 1, parlors: 1}, function(err, flashCoupons2) {
                        var serviceFlashCoupon = _.filter(flashCoupons2, function(f) { return f.code == req.query.couponCode })[0];
                        if (flashCoupons2.length > 0) {
                            _.forEach(flashCoupons2, function(f) {
                                _.forEach(f.parlors, function(p) {
                                    if (p.currentCount > 0)
                                        parlorIdswithFlashCoupons.push(ObjectId(p.parlorId));
                                });
                            });
                        }
                        callback(null);
                    });
                },
                function(callback) {
                    Parlor.getParlorsListForApp([], req, function(parlors1) {
                        parlors = parlors1;
                        if (req.query.page == 6) parlors = [];
                        callback(null);
                    });
                }
            ],
            function(err, results) {
                var parlorIdsForHairCut = _.map(parlors, function(parlor){return ObjectId(parlor._id)});
                Parlor.getHairCutPrice(parlorIdsForHairCut, function(hairCutPrices){
                var data = _.map(parlors, function(parlor) {
                    if (!parlor.services) parlor.services = [];
                    if (parlor.gender && parlor.latitude && parlor.openingTime) {
                        var flashCouponAvailable = false;
                        if (_.filter(parlorIdswithFlashCoupons, function(par) { return par + "" == parlor._id + "" })[0] ) flashCouponAvailable = true;

                        let hairCutGender = parlor.gender == 1 ? user.gender == "M" ? "Male" : "Female" : parlor.gender == 2 ? "Male" : "Female";
                        var hairCutPrice = 0;var dealId = 37;
                        if(hairCutGender == "Female")dealId = 36;
                        hairCutPrice = _.filter(hairCutPrices, function(h){ return h.parlorId + "" == parlor._id + "" && h.dealId == dealId})[0];
                        if(hairCutPrice)hairCutPrice = parseInt(hairCutPrice.dealPrice * (1 + parlor.tax/100));
                        else hairCutPrice = 300;
                        return {
                            name: parlor.name,
                            type : "parlor",
                            parlorId: parlor._id,
                            image: parlor.images.length > 0 ? parlor.images[0].appImageUrl : "",
                            address1: parlor.address,
                            address2: parlor.address2,
                            flashCouponAvailable: flashCouponAvailable,
                            parlorType: parseInt(parlor.parlorType),
                            link : parlor.link || "",
                            hairCutPrice : hairCutPrice,
                            hairCutGender : "For " + (hairCutGender) + " Hair Cut",
                            reviewCount : parlor.noOfUsersRated,
                            ambienceRating : parlor.ambienceRating || 3,
                            earlyBirdOfferPresent : parlor.earlyBirdOfferPresent && !isSubscribed ? true : false,
                            appRevenueDiscountPercentage: isSubscribed ? 0 : Parlor.getAppRevenueDiscountPercentange(parlor.appRevenuePercentage, parlor.revenueDiscountAvailable, parlor.revenueDiscountSlabDown),
                            rating: parlor.rating ? parseFloat(parlor.rating.toFixed(2)) : 0,
                            price: parlor.budget ? parlor.budget : 1,
                            distance: parseFloat(parlor.distance.toFixed(1)),
                            // favourite: _.filter(user.favourites, function(f) { return f.parlorId + "" == parlor.id; })[0] ? true : false,
                        };
                    }
                });
                            return cb(_.compact(data));
                });
                });
    },


parlorSchema.statics.getNewHomePage2 = function(req, serviceCode, callback) {

        var user = {},subscription1,
            parlors = [],
            deals = [],
            activeMem, parlorIdswithFlashCoupons = [],
            flashCouponsBanner = [{
                                    imageUrl: "https://res.cloudinary.com/dyqcevdpm/image/upload/v1551445625/App_banners_-_20195_yp0eoa.jpg",
                                    action: "dealPage"
                                }],
            flashCouponServiceCodes = {};
        var subscriptionAmount = 0,
            isSubscribed = false;
        Async.parallel([
                function(callback) {
                    User.findOne({ _id: req.query.userId }, { subscriptionValidity: 1, subscriptionBuyDate: 1, freebieExpiry: 1, favourites: 1, recent: 1, gender: 1, couponCodeHistory: 1, freeServices: 1, subscriptionGiftHistory : 1 , loyalityPoints: 1, subscriptionRedeemMonth: 1, subscriptionId: 1, subscriptionLoyality: 1 }, function(err, user1) {
                        if (user1) {
                            SubscriptionSale.findOne({userId : req.query.userId}).sort({createdAt : -1}).exec(function(err2, subscription){
                                user = user1;
                                subscription1 = subscription
                                isSubscribed = user.subscriptionId ? true : false
                                if(isSubscribed && user.subscriptionGiftHistory.length<5){
                                    if(subscription && subscription.actualPricePaid !=0){
                                        flashCouponsBanner.unshift({
                                            imageUrl: "https://res.cloudinary.com/dyqcevdpm/image/upload/v1556534849/gift-and-earn-banner-app_187_jhuot8.png",
                                            action: "subscription"
                                        })
                                    }else if(subscription && subscription.actualPricePaid == 0){
                                        flashCouponsBanner.unshift({
                                            imageUrl: "https://res.cloudinary.com/dyqcevdpm/image/upload/v1556534849/gift-and-earn-banner-app_188_mtwn9d.png",
                                            action: "subscription"
                                        })
                                    }
                                }else if(!isSubscribed){
                                    flashCouponsBanner.unshift({
                                        imageUrl: "https://res.cloudinary.com/dyqcevdpm/image/upload/v1555594131/subscribe-and-enjoy-banner-app_l0zcat.png",
                                        action: "subscription"
                                    })
                                }
                                User.getSubscriptionLeftByMonthv4(req.query.userId, new Date(), user.subscriptionLoyality, function(reed) {
                                    subscriptionAmount = reed;
                                    callback(null);
                                });
                            });
                        } else {

                            callback(null);
                        }
                    });
                },
                function(callback) {
                    var query = {};
                    if (localVar.isServer()) query.active = true;
                    else query.active = false;
                    FlashCoupon.find(query, function(err, flashCoupons2) {
                        var serviceFlashCoupon = _.filter(flashCoupons2, function(f) { return f.code == req.query.couponCode })[0];
                        if (flashCoupons2.length > 0) {
                            _.forEach(flashCoupons2, function(f) {
                                if(f.imageUrl != ""){
                                    flashCouponsBanner.push({
                                        imageUrl: f.imageUrl,
                                        action: "coupons",
                                        couponCode: f.code,
                                    }); 
                                }
                                
                                _.forEach(f.parlors, function(p) {
                                    if (p.currentCount > 0)
                                        parlorIdswithFlashCoupons.push(ObjectId(p.parlorId));
                                });
                            });
                            /*flashCouponsBanner.splice(1, 0, {imageUrl : (user.gender=="M") ? "http://res.cloudinary.com/dyqcevdpm/image/upload/v1522317509/male-subscription---march_e184fw.png" : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1522317436/female-subscription---march_vovqhn.png",*/

                             // flashCouponsBanner.splice(1, 0, {imageUrl : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1535524495/subscription--in-1199-early-bird-offer-banner-app_ocrcbx.png",
                             //    action : "subscription"});
                        }

                        if (serviceFlashCoupon) {
                            _.forEach(serviceFlashCoupon.serviceCodes, function(s) {
                                s.price = FlashCoupon.getPriceByCityId(serviceFlashCoupon.cityPrice, ConstantService.getCityId(req.query.latitude, req.query.longitude));
                            });
                            flashCouponServiceCodes.couponCode = serviceFlashCoupon.code;
                            flashCouponServiceCodes.expires_at = serviceFlashCoupon.expires_at;
                            flashCouponServiceCodes.serviceCodes = serviceFlashCoupon.serviceCodes;
                            flashCouponServiceCodes.menuPrice = serviceFlashCoupon.menuPrice;
                            flashCouponServiceCodes.dealPrice = serviceFlashCoupon.dealPrice;

                            console.log("flashCouponServiceCodes", flashCouponServiceCodes)

                        }
                        callback(null);
                    });
                },
                function(callback) {
                    Parlor.getParlorsListForApp(serviceCode, req, function(parlors1) {
                        parlors = parlors1;
                        if (req.query.page == 6) parlors = [];
                        callback(null);
                    });
                },
                function(callback) {

                    ActiveMembership.findOne({ userId: user.id }, { creditsLeft: 1 }, function(err2, activeMem1) {
                        activeMem = activeMem1;
                        callback(null);
                    });
                },
                function(callback) {
                    Deals.find({ showOnApp: true, 'services.serviceCode': { $in: serviceCode }, 'dealType.name': { $in: ['dealPrice', 'chooseOne', 'chooseOnePer'] }, active: 1, weekDay: { $in: HelperService.getDealActiveDayCode(null) }, startDate: { $lt: new Date() }, endDate: { $gt: new Date() } }, { name: 1, 'dealType.name': 1, 'dealType.price': 1, 'menuPrice': 1, "brands.ratio": 1, "brands.brandId": 1, 'services.serviceCode': 1, 'parlorId': 1 }).sort('sort').exec(function(err, deals1) {
                        deals = deals1;
                        callback(null);
                    });

                }
            ],
            function(err, results) {
                var parlorIdsForHairCut = _.map(parlors, function(parlor){return ObjectId(parlor._id)});
                Parlor.getHairCutPrice(parlorIdsForHairCut, function(hairCutPrices){
                var data = _.map(parlors, function(parlor) {
                    if (!parlor.services) parlor.services = [];
                    if (parlor.gender && parlor.latitude && parlor.openingTime) {
                        var parlorservices = _.filter(deals, function(s) { return parlor.id + "" == s.parlorId + "" });
                        var flashCouponAvailable = false;
                        if (_.filter(parlorIdswithFlashCoupons, function(par) { return par + "" == parlor._id + "" })[0] ) flashCouponAvailable = true;
                        let hairCutGender = parlor.gender == 1 ? user.gender == "M" ? "Male" : "Female" : parlor.gender == 2 ? "Male" : "Female";
                        var hairCutPrice = 0;var dealId = 37;
                        if(hairCutGender == "Female")dealId = 36;
                        hairCutPrice = _.filter(hairCutPrices, function(h){ return h.parlorId + "" == parlor._id + "" && h.dealId == dealId})[0];
                        if(hairCutPrice)hairCutPrice = parseInt(hairCutPrice.dealPrice * (1 + parlor.tax/100));
                        else hairCutPrice = 300;
                        return {
                            name: parlor.name,
                            parlorId: parlor._id,
                            image: parlor.images.length > 0 ? parlor.images[0].appImageUrl : "",
                            gender: HelperService.getGenderName(parlor.gender),
                            address1: parlor.address,
                            address2: parlor.address2,
                            flashCouponAvailable: flashCouponAvailable,
                            parlorType: parseInt(parlor.parlorType),
                            closingTime: parlor.closingTime,
                            dayClosed: parlor.dayClosed,
                            openingTime: parlor.openingTime,
                            averageNoOfClientsPerDay : parlor.averageNoOfClientsPerDay,
                            avgRoyalityAmount : parlor.avgRoyalityAmount,
                            hairCutPrice : hairCutPrice,
                            hairCutGender : "For " + (hairCutGender) + " Hair Cut",
                            reviewCount : parlor.noOfUsersRated,
                            ambienceRating : parlor.ambienceRating || 3,
                            earlyBirdOfferPresent : parlor.earlyBirdOfferPresent && !isSubscribed ? true : false,
                            appRevenueDiscountPercentage: Parlor.getAppRevenueDiscountPercentange(parlor.appRevenuePercentage, parlor.revenueDiscountAvailable, parlor.revenueDiscountSlabDown),
                            rating: parlor.rating ? parseFloat(parlor.rating.toFixed(2)) : 0,
                            price: parlor.budget ? parlor.budget : 1,
                            distance: parseFloat(parlor.distance.toFixed(1)),
                            type: 'parlor',
                            favourite: _.filter(user.favourites, function(f) { return f.parlorId + "" == parlor.id; })[0] ? true : false,
                            isSubscribed: isSubscribed,
                            relevanceScore: parlor.relevanceScore.toFixed(1),
                        };
                    }
                });
                var p1 = _.compact(data);

                var data2 = [];
                var parlorIds = _.map(p1, function(pp) { return pp.parlorId });
                console.log("parlorIds", parlorIds)
                User.findAppointmentsByParlor(parlorIds, user.id, function(appointments) {
                    SubscriptionSale.find({}).count().exec(function(err, count) {
                        _.forEach(p1, function(pp) {
                            pp.appointments = _.filter(appointments, function(appt) { return appt.parlorId + "" == pp.parlorId + "" });
                        });
                        if (req.query.page == 1) {
                            if (p1[0]) data2.push(p1[0]);
                            if (p1[1]) data2.push(p1[1]);
                            if (p1[2]) data2.push(p1[2]);
                            if ((!req.query.couponCode || !req.query.extraDiscountCouponCode) && !parseInt(req.query.onlyParlors)){
                                console.log("herer 433343")
                                if(!isSubscribed){
                                     data2.push(ConstantService.getHomePageSubscriptions(0, user.gender, count));
                                }else if(parseInt(req.query.version) == 2){
                                console.log("herer insied version")
                                    let newCard = ConstantService.getGiveSubscriptionDetail(subscription1, user.subscriptionGiftHistory.length)
                                    if(newCard)data2.push(newCard);
                                    else{
                                         data2.push(ConstantService.getHomePageSubscriptions(0, user.gender, count));
                                    }
                                }
                            }
                            if (p1[3]) data2.push(p1[3]);
                            if (p1[4]) data2.push(p1[4]);
                            if (p1[5]) data2.push(p1[5]);
                            if ((!req.query.couponCode || !req.query.extraDiscountCouponCode) && !parseInt(req.query.onlyParlors)) data2.push(ConstantService.getSecondAdBanner(user.gender));
                            for (var i = 6; i < 10; i++) {
                                if (p1[i]) {
                                    data2.push(p1[i]);
                                }
                            }

                        } else if (req.query.page == 2) {

                            // if (p1.length > 3) {
                            if (p1[0]) data2.push(p1[0]);
                            if (p1[1]) data2.push(p1[1]);
                            if (p1[2]) data2.push(p1[2]);

                            // }
                            if ((!req.query.couponCode || !req.query.extraDiscountCouponCode) && !req.query.onlyParlors) data2.push(ConstantService.getThirdAdBanner(user.gender));
                            for (var i = 3; i < 10; i++) {
                                if (p1[i]) {
                                    data2.push(p1[i]);
                                }

                            }

                        }
                        if (req.query.page > 2) {
                            for (var i = 0; i < 10; i++) {
                                if (p1[i]) {
                                    data2.push(p1[i]);
                                }
                            }
                        }
                        if (req.query.favourite == 1) data = _.filter(data, function(d) { return d.favourite || d.recent; });
                        if (user.subscriptionId) {
                            var d = new Date(),
                                currentMonth = d.getMonth();
                            /*if (currentMonth == user.subscriptionRedeemMonth.month) subscriptionAmount = user.subscriptionRedeemMonth.amount;
                            else subscriptionAmount = user.subscriptionLoyality*/
                        }
                        var objReq = { homeData: data2 };
                        if (p1.length == 0) objReq = { homeData: [] };
                        if (req.query.page == 1 && (!req.query.couponCode || !req.query.extraDiscountCouponCode )) {
                            objReq.serverTime = new Date();
                            objReq.discountRules = ConstantService.getDiscountRules();
                            objReq.scorecard = ConstantService.getFreebieScoreCard(user.gender, user.loyalityPoints, user.couponCodeHistory, user.freeServices, activeMem, subscriptionAmount, user.freebieExpiry, user.subscriptionValidity, user.subscriptionBuyDate);
                            objReq.banner = ConstantService.getFirstAdBanner(user.gender , isSubscribed);
                            objReq.flashCouponsBanner = flashCouponsBanner;
                        }
                        if (req.query.couponCode) {
                            if (!user.subscriptionId) objReq.flashCouponServiceCodes = flashCouponServiceCodes;
                        }
                        if (p1.length == 0 && req.query.page > 1) {
                            return callback(CreateObjService.response(true, objReq));
                        } else {
                            return callback(CreateObjService.response(false, objReq));
                        }
                    });
                })
            });
            });
    },

    
    parlorSchema.statics.getHairCutPrice = function(parlorIds, callback) {
        Deals.find({parlorId : {$in : parlorIds}, dealId : {$in : [36,37]}}, {dealPrice : 1, parlorId : 1, dealId : 1}, function(err, deals){
            return callback(deals);
        });
    },

    parlorSchema.statics.getNewHomePage = function(req, serviceCode, callback) {
        var queryobj = {};
        User.findOne({ _id: req.query.userId }, { favourites: 1, recent: 1, gender: 1, couponCodeHistory: 1, freeServices: 1, loyalityPoints: 1, subscriptionRedeemMonth: 1, subscriptionId: 1, subscriptionLoyality: 1 }, function(err, user) {
            if (!user) user = {};
            Parlor.getParlorsListForApp(serviceCode, req, function(parlors) {
                console.log("parlors.length", parlors.length)
                Deals.find({ showOnApp: true, 'services.serviceCode': { $in: serviceCode }, 'dealType.name': { $in: ['dealPrice', 'chooseOne', 'chooseOnePer'] }, active: 1, weekDay: { $in: HelperService.getDealActiveDayCode(null) }, startDate: { $lt: new Date() }, endDate: { $gt: new Date() } }, { name: 1, 'dealType.name': 1, 'dealType.price': 1, 'menuPrice': 1, "brands.ratio": 1, "brands.brandId": 1, 'services.serviceCode': 1, 'parlorId': 1 }).sort('sort').exec(function(err, deals) {
                    var data = _.map(parlors, function(parlor) {
                        if (!parlor.services) parlor.services = [];
                        if (parlor.gender && parlor.latitude && parlor.openingTime) {
                            var parlorservices = _.filter(deals, function(s) { return parlor.id + "" == s.parlorId + "" });
                            return {
                                name: parlor.name,
                                parlorId: parlor._id,
                                image: parlor.images.length > 0 ? parlor.images[0].appImageUrl : "",
                                gender: HelperService.getGenderName(parlor.gender),
                                address1: parlor.address,
                                address2: parlor.address2,
                                parlorType: parseInt(parlor.parlorType),
                                // latitude: parlor.latitude,
                                // longitude: parlor.longitude,
                                closingTime: parlor.closingTime,
                                dayClosed: parlor.dayClosed,
                                openingTime: parlor.openingTime,
                                rating: parlor.rating ? parseInt(parlor.rating) : 0,
                                price: parlor.budget ? parlor.budget : 1,
                                distance: parseFloat(parlor.distance.toFixed(1)),
                                // distance: HelperService.getDistanceBtwCordinates( req.query.latitude , req.query.longitude , parlor.latitude , parlor.longitude),
                                type: 'parlor',
                                favourite: _.filter(user.favourites, function(f) { return f.parlorId + "" == parlor.id; })[0] ? true : false,
                                // recent: user.recent ? user.recent.parlorId + "" == parlor.id ? true : false : false,
                            };
                        }
                    });
                    var p1 = _.compact(data);
                    var data2 = [];
                    var parlorIds = _.map(p1, function(pp) { return pp.parlorId });
                    User.findAppointmentsByParlor(parlorIds, user.id, function(appointments) {
                        SubscriptionSale.find({}).count().exec(function(err, count) {
                            ActiveMembership.findOne({ userId: user.id }, { creditsLeft: 1 }, function(err2, activeMem) {
                                _.forEach(p1, function(pp) {
                                    pp.appointments = _.filter(appointments, function(appt) { return appt.parlorId + "" == pp.parlorId + "" });
                                });
                                if (req.query.page == 1) {
                                    if (p1.length > 5) {
                                        data2.push(p1[0]);
                                        data2.push(p1[1]);
                                        data2.push(p1[2]);
                                    }
                                    data2.push(ConstantService.getHomePageSubscriptions(0, user.gender, count));
                                    if (p1.length > 5) {
                                        data2.push(p1[3]);
                                        data2.push(p1[4]);
                                        data2.push(p1[5]);
                                    }
                                    data2.push(ConstantService.getSecondAdBanner(user.gender));
                                    for (var i = 6; i < 10; i++) {
                                        if (p1[i]) {
                                            data2.push(p1[i]);
                                        }
                                    }
                                } else if (req.query.page == 2) {
                                    if (p1.length > 3) {
                                        data2.push(p1[0]);
                                        data2.push(p1[1]);
                                        data2.push(p1[2]);
                                    }
                                    data2.push(ConstantService.getThirdAdBanner(user.gender));
                                    for (var i = 3; i < 10; i++) {
                                        if (p1[i]) {
                                            data2.push(p1[i]);
                                        }
                                    }
                                }

                                if (req.query.page > 2) {
                                    for (var i = 0; i < 10; i++) {
                                        if (p1[i]) {
                                            data2.push(p1[i]);
                                        }
                                    }
                                }
                                if (req.query.favourite == 1) data = _.filter(data, function(d) { return d.favourite || d.recent; });
                                var subscriptionAmount = 0;
                                if (user.subscriptionId) {
                                    var d = new Date(),
                                        currentMonth = d.getMonth();
                                    if (currentMonth == user.subscriptionRedeemMonth.month) subscriptionAmount = user.subscriptionRedeemMonth.amount;
                                    else subscriptionAmount = user.subscriptionLoyality
                                }
                                var objReq = { homeData: data2 };
                                if (req.query.page == 1) {
                                    objReq.serverTime = new Date();
                                    objReq.discountRules = ConstantService.getDiscountRules();
                                    objReq.scorecard = ConstantService.getFreebieScoreCard(user.gender, user.loyalityPoints, user.couponCodeHistory, user.freeServices, activeMem, subscriptionAmount);
                                    objReq.banner = ConstantService.getFirstAdBanner(user.gender , isSubscribed);
                                }
                                return callback(CreateObjService.response(false, objReq));
                            });
                        })
                    });
                });
            });
        });
    },

//     parlorSchema.statics.createSettlementReport = function(startDate, endDate, period, parlorQuery, cb) {
//         var async = require('async');
//         // SettlementReport.find({}).sort({ period: -1 }).exec(function(err, latestPeriod) {
//         // console.log("length is " + latestPeriod.length);
//         SettlementReport.findOne({}).sort({ invoiceId: -1 }).limit(1).exec(function(err, settlementCount) {
//             console.log("one")
//             var count = settlementCount ? settlementCount.invoiceId : 0;
//             parlorQuery.active = true;
//             Parlor.find(parlorQuery, { services: 0 }, function(err, parlors) {

//                 async.each(parlors, function(parlor, callback) {
//                     console.log("Parlor is " + parlor.name);
//                     // console.log({

//                     //     'history.0.appointmentDate ': { $gte: startDate, $lt: endDate },

//                     // })
//                     ActiveMembership.find({
//                         'history.0.parlorId': parlor.id,
//                         'history.0.appointmentDate': { $gte: startDate, $lt: endDate },
//                         "paymentMethods.value": 10
//                     }, function(err, mSales) {
//                         // var userIds=[]
//                         // _.forEach(mSales , function(u){
//                         //     userIds.push(ObjectId(u.userId))
//                         // })
//                         // console.log(userIds)
//                         // // MembershipSale.find({userId : {$in :[userIds]} ,  createdAt: { $gte: HelperService.getDayStart(startDate), $lt: HelperService.getDayEnd(endDate)}},function(err,secondSales){
//                         // MembershipSale.aggregate([{$match:{userId:{$in:[userIds]},createdAt: { $gte: new Date(2017,10,1), $lt: new Date(2018,0,25,23,59,59)}}},
//                         //             {$project:{userId:1,  price:1}},{$group:{_id:"$userId" , userId:{$push:{userId :"$userId" , price:"$price"}}}}]).exec(function(err,secondSales){
//                         // console.log("secondSales" , secondSales.length)
//                         SubscriptionSale.aggregate([{ $match: { 'response.id': { $regex: "cash" }, createdAt: { $gte: startDate, $lt: endDate } } },
//                                 { $lookup: { from: "appointments", localField: "userId", foreignField: "client.id", as: "appts" } },
//                                 { $project: { userId: 1, response: 1, razorPayId: 1, price: 1, appts: "$appts" } },
//                                 { $unwind: "$appts" },
//                                 { $match: { "appts.parlorId": ObjectId(parlor.id), "appts.status": 3, "appts.subscriptionAmount": { $gt: 0 } } },
//                                 { $group: { _id: "$userId", price: { $first: "$price" }, appts: { $first: "$appts" } } },
//                                 {
//                                     $project: {
//                                         price: 1,
//                                         razorPayId: 1,
//                                         apptStatus: "$appts.status",
//                                         parlorId: "$appts.parlorId",
//                                         parlorName: "$appts.parlorName",
//                                         payableAmount: "$appts.payableAmount",
//                                         subscriptionAmount: "$appts.subscriptionAmount",
//                                         clientName: "$appts.client.name"
//                                     }
//                                 }
//                             ],
//                             function(err, subscription) {

//                                 Appointment.find({
//                                     'services.creditsSource.parlorId': parlor.id,
//                                     parlorId: { $ne: parlor.id },
//                                     status: 3,
//                                     appointmentStartTime: { $gte: startDate, $lt: endDate }
//                                 }, function(err, parlorNotappointments) {
//                                     Appointment.find({
//                                         parlorId: parlor.id,
//                                         status: { $in: [1, 4] },
//                                         appointmentStartTime: { $gte: startDate, $lt: endDate }
//                                     }).count(function(err, pendingAppointments) {

//                                         console.log({
//                                             parlorId: parlor.id,
//                                             status: 3,
//                                             appointmentStartTime: { $gte: startDate, $lt: endDate }
//                                         })
//                                         Appointment.find({
//                                             parlorId: parlor.id,
//                                             status: 3,
//                                             appointmentStartTime: { $gte: startDate, $lt: endDate }
//                                         }, function(err, appointments) {
//                                             var query = {
//                                                 parlorId: parlor.id,
//                                                 status: 3,
//                                                 appointmentStartTime: {
//                                                     $gte: HelperService.getFirstDateOfMonth(2018, endDate.getMonth()),
//                                                     $lt: startDate
//                                                 }
//                                             };
//                                             Appointment.find(query, {
//                                                 services: 1,
//                                                 products: 1,
//                                                 freeLoyalityPoints: 1,
//                                                 createdAt: 1
//                                             }, function(err, parlorPastAppts) {
//                                                 SettlementReport.findOne({
//                                                     parlorId: parlor.id,
//                                                     period: period - 1
//                                                 }, function(err, pastsettlement) {
//                                                     var pendingAmount = 0;
//                                                     var actualCommissionTillDate = 0;
//                                                     var amountCollectedTillDate = 0;
//                                                     var refundOnErpTillDate = 0;
//                                                     var freebiesPayoutJulyTillDate = 0;
//                                                     var cashBackErpAndAppPayoutJulyTillDate = 0;
//                                                     var preNetPayable = 0;
//                                                     var balance = 0;
//                                                     var paidToSalon = 0;
//                                                     var previousDue = 0;
//                                                     var refundAppDigitalOnlineMTD = 0;
//                                                     var refundAppDigitalCashMTD = 0;
//                                                     if (pastsettlement) {
//                                                         if (pastsettlement.amountCollectedTillDate) amountCollectedTillDate = pastsettlement.amountCollectedTillDate;
//                                                         if (pastsettlement.actualCommissionTillDate) actualCommissionTillDate = pastsettlement.actualCommissionTillDate;
//                                                         if (pastsettlement.freebiesPayoutJulyTillDate) freebiesPayoutJulyTillDate = pastsettlement.freebiesPayoutJulyTillDate;
//                                                         if (pastsettlement.cashBackErpAndAppPayoutJulyTillDate) cashBackErpAndAppPayoutJulyTillDate = pastsettlement.cashBackErpAndAppPayoutJulyTillDate;
//                                                         if (pastsettlement.refundOnErpTillDate) refundOnErpTillDate = pastsettlement.refundOnErpTillDate;
//                                                         if (pastsettlement.refundAppDigitalOnlineMTD) refundAppDigitalOnlineMTD = pastsettlement.refundAppDigitalOnlineMTD;
//                                                         if (pastsettlement.refundAppDigitalCashMTD) refundAppDigitalCashMTD = pastsettlement.refundAppDigitalCashMTD;
//                                                         if (pastsettlement.pendingAmount) pendingAmount = pastsettlement.pendingAmount;
//                                                         if (pastsettlement.netPayable) preNetPayable = pastsettlement.netPayable;
//                                                         if (pastsettlement.balance) balance = pastsettlement.balance;
//                                                         if (pastsettlement.paidToSalon) paidToSalon = pastsettlement.paidToSalon;
//                                                         if (pastsettlement.previousDue) previousDue = pastsettlement.previousDue;
//                                                     }
//                                                     var appointmentsData = appointments;
//                                                     appointments = [];
//                                                     async.each(appointmentsData, function(app, cb1) {
//                                                         Admin.findOne({ _id: app.closedBy }, function(err, exists) {
//                                                             if (exists) {
//                                                                 app.exist = true
//                                                             } else {
//                                                                 app.exist = false;
//                                                             }
//                                                             appointments.push(app);
//                                                             cb1();
//                                                         })

//                                                     }, function(done) {
//                                                         var calculatedData = Parlor.generateReportForParlor(balance, previousDue, paidToSalon, preNetPayable, appointments, actualCommissionTillDate, amountCollectedTillDate, refundOnErpTillDate, refundAppDigitalOnlineMTD, refundAppDigitalCashMTD, freebiesPayoutJulyTillDate, cashBackErpAndAppPayoutJulyTillDate, parlor, startDate, endDate, period, mSales, parlorNotappointments, parlorPastAppts, pendingAmount, pendingAppointments, count + parlors.indexOf(parlor) + 1, subscription)
//                                                         if (calculatedData == null) {
//                                                             callback();
//                                                         } else {
//                                                             SettlementReport.create(calculatedData, function(err, done) {
//                                                                 console.log(err);
//                                                                 callback();
//                                                             });
//                                                         }
//                                                     })
//                                                 });
//                                             });
//                                         });
//                                     });
//                                 });
//                             });
//                     });
//                 }, function allTaskCompleted() {
//                     console.log('done');
//                     return cb(null, 'Done');
//                 });
//             });
//         });
//         // })
//     };
// /*
//  parlorSchema.statics.createSettlementReportForModelB = function(req, cb){
//  var startDate = new Date(2017, 00, 1, 0, 0, 0);
//  var endDate = new Date(2017, 00, 15, 23, 59, 59);
//  var period = 1;
//  async = require('async');
//  Parlor.find({}, function(err, parlors){
//  async.series([
//  function(done) {
//  async.each(parlors, function(parlor, callback) {
//  console.log(parlor.name);
//  if(parlor.commissionType){
//  Advance.find({parlorId: parlor.id, createdAt: {$gt: startDate, $lt: endDate}}, function (err, advances) {
//  Appointment.find({parlorId : parlor.id, status: 3, appointmentStartTime: {$gte: startDate, $lt: endDate}}, function(err, appointments){
//  SettlementReport.create(Parlor.generateReportForParlor(appointments, parlor, startDate, endDate, period, advances), function(err){
//  callback();
//  });
//  });
//  });
//  }else callback();

//  }, done);
//  },
//  ], function allTaskCompleted() {
//  console.log('done');
//  return cb(null, 'Done');
//  });
//  });
//  };*/




// parlorSchema.statics.generateReportForParlor = function(balance, previousDue, paidToSalon, preNetPayable, appointments, actualCommissionTillDate, amountCollectedTillDate, refundOnErpTillDate, refundAppDigitalOnlineMTD, refundAppDigitalCashMTD, freebiesPayoutJulyTillDate, cashBackErpAndAppPayoutJulyTillDate, parlor, startDate, endDate, period, mSales, parlorNotappointments, parlorPastAppts, pendingAmount, pendingAppointments, invoiceId, subscription) {
//     var totalPastRevenueService = 0,
//         totalPastRevenueProduct = 0,
//         subscriptionSoldBySalon = 0,
//         subscriptionLoyalty = 0,
//         membershipSoldByBeu = 0
//     activeMembershipSold = [];

//     _.forEach(parlorPastAppts, function(appt) {
//         _.forEach(appt.services, function(s) {
//             var ser = Appointment.serviceFunction(appt.createdAt, s, []);
//             totalPastRevenueService += ser.totalRevenue;
//         });
//         _.forEach(appt.products, function(product) {
//             totalPastRevenueProduct += (product.price * product.quantity);
//         });
//         if (appt.freeLoyalityPoints) {
//             totalPastRevenueService -= (parseInt(appt.freeLoyalityPoints / 1.15) * 0.25);
//         }
//     });
//     _.forEach(mSales, function(adv) {
//         if (adv.paymentMethods[0].value == 10) {
//             membershipSoldByBeu += adv.price;
//             activeMembershipSold.push((adv.history[0].appointmentId).toString())

//         }

//     });
//     _.forEach(subscription, function(subs) {
//         // console.log("subs" , subs)
//         subscriptionSoldBySalon += subs.subscriptionAmount;
//     });

//     console.log("subssssssssssssssssssssss", subscriptionSoldBySalon)
//         // if(secondSales){
//         //     _.forEach(secondSales , function(ss){
//         //         if(ss.userId.length>1){
//         //             var memLength = ss.length; var startRange = memLength+1;
//         //             for(var i=startRange;i<memLength;i++){
//         //                     membershipSoldByBeu += ss[i].price;
//         //                     // activeMembershipSold.push((adv.history[0].appointmentId).toString())
//         //             }
//         //         }
//         //     })  
//         // }

//     var report = calculateSettlementReport(activeMembershipSold, membershipSoldByBeu, balance, previousDue, paidToSalon, appointments, actualCommissionTillDate, amountCollectedTillDate, refundOnErpTillDate, refundAppDigitalOnlineMTD, refundAppDigitalCashMTD, freebiesPayoutJulyTillDate, cashBackErpAndAppPayoutJulyTillDate, parlor, startDate, endDate, totalPastRevenueService, totalPastRevenueProduct, subscriptionSoldBySalon, subscriptionLoyalty);
//     if (report == null) {
//         return null;
//     }
//     var diffMs = (endDate.getTime() - startDate.getTime());
//     var membershipSold = 0;
//     collectedByMembershipCreditsForOtherParlor = 0;
//     _.forEach(mSales, function(adv) {

//         membershipSold += adv.price;
//     });
//     // if(secondSales){
//     //     _.forEach(secondSales , function(ss){
//     //         if(ss.userId.length>1){
//     //             var memLength = ss.length; var startRange = memLength+1;
//     //             for(var i=startRange;i<memLength;i++){
//     //                     membershipSold += ss[i].price;
//     //             }
//     //         }
//     //     })  
//     // }
//     _.forEach(parlorNotappointments, function(appt) {
//         _.forEach(appt.services, function(s) {
//             if (s.creditsUsed) {
//                 _.forEach(s.creditsSource, function(cs) {
//                     if (cs.parlorId + "" == parlor.id + "") {
//                         collectedByMembershipCreditsForOtherParlor += cs.credits;
//                     }
//                 });
//             }
//         });
//     });

//     return {
//         parlorName: parlor.name,
//         parlorEntityName: parlor.legalEntity,
//         period: period,
//         invoiceId: invoiceId,
//         parlorAddress: parlor.address + ' ' + parlor.address2,
//         startDate: startDate,
//         endDate: endDate,
//         periodOfSettlement: Math.round(diffMs / 86400000),
//         serviceRevenue: report.serviceRevenue,
//         productRevenue: report.productRevenue,
//         totalRevenue: report.totalRevenue,
//         activeMembershipSold: report.activeMembershipSold,
//         membershipSold: membershipSold,
//         membershipSoldByBeu: membershipSoldByBeu,
//         collectedByMembershipCredits: report.collectedByMembershipCredits,
//         membershipPurchased: report.membershipPurchased,
//         totalCollectionByParlor: report.totalCollectionByParlor,
//         totalCollectionByBeu: report.totalCollectionByBeu,
//         totalCollection: report.totalCollection,
//         collectedByLoyalityPoints: report.collectedByLoyalityPoints,
//         collectedByApp: report.collectedByApp,
//         collectedByMembershipCreditsForOtherParlor: collectedByMembershipCreditsForOtherParlor,
//         collectedByAffiliates: report.collectedByAffiliates,
//         revenueModel: parlor.commissionType,
//         royalityPercentageService: parlor.serviceCommission,
//         royalityPercentageProduct: parlor.productCommission,
//         status: pendingAppointments > 0 ? 0 : 1,
//         reason: pendingAppointments > 0 ? (pendingAppointments + " pending Appointments") : 'Successfully Generated',
//         totalPastRevenueService: report.totalPastRevenueService,
//         thresholdAmount1: parlor.commissionType ? parlor.thresholdAmount1 : 0,
//         thresholdAmount1Commission: parlor.commissionType ? parlor.thresholdAmount1Commission : 0,
//         thresholdAmount2: parlor.commissionType ? parlor.thresholdAmount2 : 0,
//         thresholdAmount2Commission: parlor.commissionType ? parlor.thresholdAmount2Commission : 0,
//         thresholdAmount3: parlor.commissionType ? parlor.thresholdAmount3 : 0,
//         thresholdAmount3Commission: parlor.commissionType ? parlor.thresholdAmount3Commission : 0,
//         discountPercentage: report.discountPercentage,
//         amountPayableToBeu: report.amountPayableToBeu,
//         lessDiscount: report.lessDiscount,
//         amountPayableToBeuAfterDiscount: report.amountPayableToBeuAfterDiscount,
//         serviceTax: report.serviceTax,
//         amountPayableToBeuAfterTax: report.amountPayableToBeuAfterTax,
//         advancePaid: 0,
//         previousPendingAmount: pendingAmount,
//         pendingAmount: pendingAmount > 0 ? pendingAmount + report.netPayable : (preNetPayable + report.netPayable) > 0 ? preNetPayable + report.netPayable : 0,
//         pendingAmountBuffer: pendingAmount > 0 ? pendingAmount + report.netPayable : (preNetPayable + report.netPayable) > 0 ? preNetPayable + report.netPayable : 0,
//         netAmountTransferred: ((report.netPayable * -1) - pendingAmount) > 0 ? ((report.netPayable * -1) - pendingAmount) : 0,
//         netPayable: report.netPayable,
//         parlorId: parlor.id,
//         finalRemaining: report.finalRemaining,
//         // refundAppDigital:report.refundAppDigital,
//         refundAppDigitalOnline: report.refundAppDigitalOnline,
//         refundAppDigitalCash: report.refundAppDigitalCash,
//         refundFirstAppDigital: report.refundFirstAppDigital,
//         refundOnErp: report.refundOnErp,
//         actualCommissionTillDate: report.actualCommissionTillDate,
//         amountCollectedTillDate: report.amountCollectedTillDate,
//         refundOnErpTillDate: report.refundOnErpTillDate,
//         refundAppDigitalOnlineMTD: report.refundAppDigitalOnlineMTD,
//         refundAppDigitalCashMTD: report.refundAppDigitalCashMTD,
//         actualCommission: report.actualCommission,
//         freebiesPayoutJulyTillDate: report.freebiesPayoutJulyTillDate,
//         cashBackErpAndAppPayoutJulyTillDate: report.cashBackErpAndAppPayoutJulyTillDate,
//         higherValue: report.higherValue,
//         previousDue: report.previousDue,
//         paidToSalon: report.paidToSalon,
//         balance: report.balance,
//         onlinePaymentFee: report.onlinePaymentFee,
//         onlinePaymentFeeTax: report.onlinePaymentFeeTax,
//         collectedByAppCash: report.collectedByAppCash,
//         refundFirstAppCash: report.refundFirstAppCash,
//         firstAppCashPercent: report.firstAppCash,
//         appCashPercent: report.appCash,
//         firstAppDigitalPercent: report.firstAppDigital,
//         appDigitalPercent: report.appDigital,
//         onErpPercent: report.onErp,
//         subscriptionSoldBySalon: report.subscriptionSoldBySalon,
//         subscriptionLoyalty: report.subscriptionLoyalty,

//     };
// };


// function calculateSettlementReport(activeMembershipSold, membershipSoldByBeu, balance, previousDue, paidToSalon, appointments, actualCommissionTillDate, amountCollectedTillDate, refundOnErpTillDate, refundAppDigitalOnlineMTD, refundAppDigitalCashMTD, freebiesPayoutJulyTillDate, cashBackErpAndAppPayoutJulyTillDate, parlor, startDate, endDate, totalPastRevenueService, totalPastRevenueProduct, subscriptionSoldBySalon, subscriptionLoyalty) {
//     var serviceRevenue = 0,
//         higherValue = 0,
//         collectedByApp2 = 0,
//         gstAmount = 0,
//         refundAppDigital = 0,
//         refundAppDigitalOnline = 0,
//         refundAppDigitalCash = 0,
//         refundFirstAppDigital = 0,
//         refundFirstAppCash = 0,
//         refundOnErp = 0,
//         collectedByAppCash = 0,
//         productRevenue = 0,
//         totalRevenue = 0,
//         onlinePaymentFee = 0,
//         onlinePaymentFeeTax = 0,
//         membershipSold = 0,
//         membershipPurchased = 0,
//         totalCollectionByParlor = 0,
//         totalCollectionByBeu = 0,
//         totalCollection = 0,
//         collectedByApp = 0,
//         collectedByAffiliates = 0,
//         discountPercentage = 0,
//         amountPayableToBeu = 0,
//         lessDiscount = 0,
//         amountPayableToBeuAfterDiscount = 0,
//         serviceTax = 0,
//         amountPayableToBeuAfterTax = 0,
//         advancePaid = 0,
//         netPayable = 0,
//         finalRemaining = 0,
//         collectedByLoyalityPoints = 0,
//         collectedByMembershipCredits = 0,
//         freeServiceRevenue = 0,
//         freeProductRevenue = 0,
//         collectedByMembershipCreditsForOtherParlor = 0,
//         realServiceRevenue = 0,
//         freeServiceRevenueVr = 0;
//     var i = 0,
//         totalx = 0,
//         male = 0,
//         female = 0,
//         others = 0;
        
//     _.forEach(appointments, function(appt) {
//         console.log("apptId|||||||||||||||||||||||||", appt._id)
//         var serviceRevenueTotal = 0,
//             serviceRevenueTotalPaidOnline = 0,
//             productRevenueTotal = 0,
//             discount = 0,
//             loyalityRevenue = 0,
//             membershipCreditsForBeu = 0,
//             membershipCreditsForParlor = 0;

//         console.log("membershipSoldByBeu ---------------------", membershipSoldByBeu)
//         if (appt.loyalitySubscription) {
//             subscriptionLoyalty += appt.loyalitySubscription;
//         }

//         _.forEach(appt.services, function(service) {
//             var ser = Appointment.serviceFunction(appt.createdAt, service, []);

//             serviceRevenue += ser.totalRevenue;

//             if (parlor.discountEndTime.getTime() > appt.appointmentStartTime.getTime()) {
//                 freeServiceRevenue += ser.totalRevenue;
//             }

//             if (service.loyalityPoints) {
//                 collectedByLoyalityPoints += (ser.serviceLoyalityRevenue);
//                 loyalityRevenue += (ser.serviceLoyalityRevenue);
//                 totalx += loyalityRevenue;
//             }
//             if (service.creditsUsed) {
//                 _.forEach(service.creditsSource, function(cs) {
//                     if (cs.parlorId + "" != parlor.id + "") {
//                         membershipCreditsForBeu += cs.credits;
//                         collectedByMembershipCredits += cs.credits;
//                     }
//                 });
//             }
//             if (service.discountMedium == "groupon") discount++;
//             serviceRevenueTotal += ser.totalRevenue;
//         });
//         if (appt.freeLoyalityPoints) {
//             collectedByLoyalityPoints += (parseInt(appt.freeLoyalityPoints / 1.15) * 0.75);
//             loyalityRevenue += (parseInt(appt.freeLoyalityPoints / 1.15) * 0.75);
//             serviceRevenue -= (parseInt(appt.freeLoyalityPoints / 1.15) * 0.25);
//             if (parlor.discountEndTime.getTime() > appt.appointmentStartTime.getTime()) {
//                 freeServiceRevenue -= (parseInt(appt.freeLoyalityPoints / 1.15) * 0.25);
//                 addMgCollectedTillDate = false

//             }
//             serviceRevenueTotal -= (parseInt(appt.freeLoyalityPoints / 1.15) * 0.25);
//         }
//         _.forEach(appt.products, function(product) {
//             productRevenue += (product.price * product.quantity);
//             if (parlor.discountEndTime.getTime() > appt.appointmentStartTime.getTime()) {
//                 freeProductRevenue += (product.price * product.quantity);
//             }
//             productRevenueTotal += (product.price * product.quantity);
//         });
//         if (appt.couponCode == '0') appt.couponCode = null;
//         if (appt.paymentMethod != 5 && !appt.couponCode) {
//             totalCollectionByParlor += (serviceRevenueTotal + productRevenueTotal - loyalityRevenue);
//             // console.log("parlor", serviceRevenueTotal + productRevenueTotal - loyalityRevenue)
//             totalCollectionByBeu += loyalityRevenue;
//             // totalCollectionByBeu += membershipCreditsForBeu;

//         } else {
//             totalCollectionByBeu += serviceRevenueTotal;
//             if (appt.couponCode && discount > 0) {
//                 collectedByAffiliates += serviceRevenueTotal;
//             } else {
//                 if (activeMembershipSold.indexOf((appt._id).toString()) >= 0) {
//                     console.log("right place")

//                     collectedByApp += (serviceRevenueTotal + productRevenueTotal) - (loyalityRevenue) - appt.creditUsed / (1 + parlor.tax / 100)
//                     totalCollectionByBeu -= appt.creditUsed / (1 + parlor.tax / 100);
//                     totalCollectionByParlor += appt.creditUsed / (1 + parlor.tax / 100);
//                 } else {

//                     collectedByApp += (serviceRevenueTotal + productRevenueTotal) - (loyalityRevenue) - appt.creditUsed / (1 + parlor.tax / 100);
//                     totalCollectionByBeu -= appt.creditUsed / (1 + parlor.tax / 100);
//                     totalCollectionByParlor += appt.creditUsed / (1 + parlor.tax / 100);
//                     console.log("collectedByApp22222222222222222", collectedByApp)

//                 }

//                 if (appt.appointmentType == 3 && appt.paymentMethod != 5) {
//                     collectedByAppCash += (serviceRevenueTotal + productRevenueTotal) - (loyalityRevenue);
//                 }
//                 // collectedByApp += (appt.razorPayCaptureResponse.amount/118);
//             }
//         }

//         console.log("collection by beu", totalCollectionByBeu)
//         console.log("collectedByApp", collectedByApp)
//             //     var liveDate=new Date(parlor.parlorLiveDate)
//             //     var currentMonth=new Date();
//             //     console.log((currentMonth.getMonth()-liveDate.getMonth()))
//             // if((currentMonth.getMonth()-liveDate.getMonth())<=3){

//         if ((appt.exist || !parlor.refundByOtp) && (appt.couponCode == null)) {
//             // if(collectedByAffiliates == 0){
//             // console.log("refundOnErp", refundOnErp)
//             if (appt.paymentMethod != 5 && appt.paymentMethod != 10 && appt.appBooking == 2 && appt.appointmentType == 3) {
//                 console.log("Booked On App cash")

//                 if (appt.clientFirstAppointment && parlor.firstAppDigital > 0) {
//                     refundFirstAppCash += parlor.firstAppCash * (serviceRevenueTotal - loyalityRevenue) / 100;
//                 } else {
//                     refundAppDigitalCash += parlor.appCash * serviceRevenueTotal / 100;
//                 }

//             } else if (appt.razorPayCaptureResponse && appt.razorPayCaptureResponse.status == 'captured') {
//                 console.log("Booked On App")
//                 console.log("feessssssss", (appt.razorPayCaptureResponse.fee) / 100);
//                 console.log("amount", serviceRevenueTotal)
//                 if (appt.clientFirstAppointment && parlor.firstAppDigital > 0) {

//                     refundFirstAppDigital += (parlor.firstAppDigital * (appt.razorPayCaptureResponse.amount / 118)) / 100;
//                 } else {
//                     refundAppDigitalOnline += (parlor.appDigital * (appt.razorPayCaptureResponse.amount / 118)) / 100;
//                 }
//                 if (appt.subscriptionAmount > 0) {
//                     onlinePaymentFee += (appt.razorPayCaptureResponse.fee * (appt.payableAmount / (appt.payableAmount + appt.subscriptionAmount))) / 100;
//                     onlinePaymentFeeTax += (appt.razorPayCaptureResponse.tax * (appt.payableAmount / (appt.payableAmount + appt.subscriptionAmount))) / 100;
//                 } else {
//                     onlinePaymentFee += (appt.razorPayCaptureResponse.fee) / 100;
//                     onlinePaymentFeeTax += (appt.razorPayCaptureResponse.tax) / 100;
//                 }

//             } else {
//                 console.log("Booked On Erp")
//                 console.log("amount", serviceRevenueTotal)

//                 refundOnErp += parlor.onErp * serviceRevenueTotal / 100;
//                 // console.log("refundOnErp", refundOnErp)

//             }
//             // }
//         }
//         // }
//     });


//     totalRevenue = serviceRevenue + productRevenue;
//     totalCollection = totalRevenue;
//     realServiceRevenue = serviceRevenue;
//     freeServiceRevenueVr = freeServiceRevenue;
//     console.log("amountPayableToBeuu1111111111111111111111", amountPayableToBeu)
//     if (parlor.commissionType) {
//         var tempRevenue = 0;
//         var dis = 0;
//         // console.log("totalPastRevenueService", totalPastRevenueService + serviceRevenue)
//         // console.log("thresholdAmount2", parlor.thresholdAmount2)
//         if ((serviceRevenue + totalPastRevenueService - parlor.thresholdAmount2) > 0) {
//             console.log("sahi aayaaaaaaaaaaaaaaaaaaaaaaaa")
//             // if ((serviceRevenue - parlor.thresholdAmount2) > 0) {
//             tempRevenue = totalPastRevenueService < parlor.thresholdAmount2 ? serviceRevenue + totalPastRevenueService - parlor.thresholdAmount2 : serviceRevenue;
//             totalPastRevenueService = 0;
//             amountPayableToBeu += (tempRevenue * parlor.thresholdAmount3Commission) / 100;

//             serviceRevenue -= tempRevenue;
//             if (freeServiceRevenueVr > 0) {
//                 dis = freeServiceRevenueVr - tempRevenue < 0 ? freeServiceRevenueVr : tempRevenue;
//                 lessDiscount = (dis * parlor.thresholdAmount3Commission) / 100;
//                 freeServiceRevenueVr -= dis;
//             }

//         }
//         else if ((serviceRevenue + totalPastRevenueService - parlor.thresholdAmount1) > 0) {
//             // if ((serviceRevenue - parlor.thresholdAmount1) > 0) {
//             tempRevenue = totalPastRevenueService < parlor.thresholdAmount1 ? serviceRevenue + totalPastRevenueService - parlor.thresholdAmount1 : serviceRevenue;
//             totalPastRevenueService = 0;
//             amountPayableToBeu += (tempRevenue * parlor.thresholdAmount2Commission) / 100;
//             serviceRevenue -= tempRevenue;
//             if (freeServiceRevenueVr > 0) {
//                 dis = freeServiceRevenueVr - tempRevenue < 0 ? freeServiceRevenueVr : tempRevenue;
//                 lessDiscount = (dis * parlor.thresholdAmount2Commission) / 100;
//                 freeServiceRevenueVr -= dis;
//             }
//             console.log("thresholdAmount1111", amountPayableToBeu)
//             console.log("thresholdAmount1", parlor.thresholdAmount1)
//         }
//         amountPayableToBeu += (serviceRevenue * parlor.thresholdAmount1Commission) / 100;
//         amountPayableToBeu += (productRevenue * parlor.productCommission) / 100;
//         console.log("##################", (serviceRevenue * parlor.thresholdAmount1Commission))
//         console.log("$$$$$$$$$$$$$$$$$$$", (productRevenue * parlor.productCommission))
//         console.log("productCommission", parlor.productCommission)
//         console.log("productRevenue", parlor.productRevenue)
//         console.log("amountPayableToBeuuuuuuuuuuuuuuuuuuu", amountPayableToBeu)

//         lessDiscount = (freeServiceRevenueVr * parlor.thresholdAmount1Commission) / 100;

//         lessDiscount += (freeProductRevenue * parlor.productCommission) / 100;
//         amountPayableToBeuAfterDiscount = amountPayableToBeu;
//     } else {
//         amountPayableToBeu = (serviceRevenue * parlor.serviceCommission) / 100;
//         amountPayableToBeu += (productRevenue * parlor.productCommission) / 100;
//         lessDiscount = (freeServiceRevenue * parlor.serviceCommission) / 100;
//         lessDiscount += (freeProductRevenue * parlor.productCommission) / 100;
//         amountPayableToBeuAfterDiscount = amountPayableToBeu;
//         console.log("serviceRevenue", parlor.serviceCommission)
//         console.log("productRevenue", parlor.productCommission)
//         console.log("amountPayableToBeuuuuuuu  22222222", amountPayableToBeu)

//     }
//     lessDiscount = lessDiscount * (1 + parlor.tax / 100)
//     if (lessDiscount > 0) {
//         amountPayableToBeuAfterDiscount = amountPayableToBeu - lessDiscount;
//         discountPercentage = 100;
//     }
//     var isLastDate = HelperService.isTodayLastDate(new Date())
//     var numberOfDay = HelperService.getNoOfDaysInMonth(endDate.getFullYear(), endDate.getMonth())
//     var perDayMg = parlor.minimumGuarantee / parseInt(numberOfDay)
//     var actualCommission = amountPayableToBeu;
//     if (startDate != undefined && endDate != undefined && parlor.discountEndTime != undefined) {
//         console.log("datessssssssssssssssssssssss", startDate, endDate, parlor.discountEndTime)
//         var days1 = ParlorService.getDiffForSettlement(startDate, endDate, parlor.discountEndTime);
//         console.log("days11", days1)
//     } else {
//         return null;
//     }

//     if (days1 == 0) {

//         amountPayableToBeuAfterDiscount = 0;
//         actualCommission = 0;
//     }
//     if (false) { //newMonth
//         actualCommissionTillDate = 0;
//         amountCollectedTillDate = 0;
//         refundOnErpTillDate = 0;
//         refundAppDigitalOnlineMTD = 0;
//         refundAppDigitalCashMTD = 0;

//     }
//     console.log("actualCommissionTillDate 1111", actualCommissionTillDate)
//     var actualCommissionTillDate = actualCommission + actualCommissionTillDate

//     console.log("actualCommissionTillDate 2222222222", actualCommissionTillDate)
//     console.log("amountPayableToBeu 3333333333333", amountPayableToBeu)

//     var settlementMg = perDayMg * days1;
//     console.log("settlementMg", settlementMg)
//     console.log("perDayMg", perDayMg)
//     console.log("days1", days1)
//     if (amountPayableToBeu < settlementMg) {
//         amountPayableToBeu = settlementMg;
//         amountPayableToBeuAfterDiscount = amountPayableToBeu;
//         amountPayableToBeu -= lessDiscount;
//     }

//     var i = amountCollectedTillDate;
//     var prevAmountCollectedTillDate = parseInt(amountCollectedTillDate);
//     // var prevAmountCollectedTillDate = 0;
//     console.log("amountCollectedTillDate", i)
//     var monthMg = parlor.minimumGuarantee
//     var maximumRefundOnErp = parlor.maximumRefundOnErp
//     var maximumRefundOnApp = parlor.maximumRefundOnAppCash


//     if ((refundOnErpTillDate + refundOnErp) > maximumRefundOnErp) {
//         refundOnErp = refundOnErp - (refundOnErpTillDate + refundOnErp - maximumRefundOnErp)
//     }
//     if ((refundAppDigitalOnlineMTD + refundAppDigitalCashMTD + refundAppDigitalCash + refundAppDigitalOnline) > maximumRefundOnApp) {
//         if (refundAppDigitalOnline > refundAppDigitalCash) {

//             refundAppDigitalOnline = refundAppDigitalOnline - (refundAppDigitalOnlineMTD + refundAppDigitalCashMTD + refundAppDigitalCash + refundAppDigitalOnline - maximumRefundOnApp)

//         } else {
//             refundAppDigitalCash = refundAppDigitalCash - (refundAppDigitalOnlineMTD + refundAppDigitalCashMTD + refundAppDigitalOnline + refundAppDigitalCash - maximumRefundOnApp)

//         }

//     }

//     refundOnErpTillDate += refundOnErp;
//     refundAppDigitalOnlineMTD += refundAppDigitalOnline;
//     refundAppDigitalCashMTD += refundAppDigitalCash;
//     // var td = new Date(2018,5,8);
    
//     if(new Date().getDate()-endDate.getDate()==1){
//         var td = new Date();
//     }else{
//         var td = new Date(endDate.getTime());
//         td.setDate(td.getDate() + 1);
//     }
//     var prevDate = td.getDate() - 1;
//     // var prevDate = 2;//(Beauty Lounge  16 April onwards)
//     if(td > parlor.discountEndTime && td.getMonth()== parlor.discountEndTime.getMonth() && td.getFullYear()== parlor.discountEndTime.getFullYear() ){
//          prevDate = td.getDate() - parlor.discountEndTime.getDate() -1;
//           // prevDate = HelperService.getNoOfDaysDiff(parlor.discountEndTime , td ); -1;

//     }
    
//     else if(td < parlor.discountEndTime && td.getMonth() <= parlor.discountEndTime.getMonth() && td.getFullYear() == parlor.discountEndTime.getFullYear() ){
//        console.log("------------YYYYYYYYYYYYYYYYYYY---------------")
//        console.log("parlor.parlorLiveDate" , parlor.discountEndTime)
//        console.log("td" , td)


//         var monthStart = HelperService.getCurrentMonthStart(td);
//         if(monthStart > parlor.parlorLiveDate){
//             prevDate = td.getDate() - monthStart.getDate();
//         }else {
//             prevDate = td.getDate() - parlor.parlorLiveDate.getDate();
//         }
       
//         // prevDate = HelperService.getNoOfDaysDiff(parlor.parlorLiveDate , td );
//     }

//     console.log("prevDate2222222222222222222222" ,prevDate)
//     var refundEffectiveDate = new Date(parlor.refundEffectiveDate);

//     console.log("refund Effective", refundEffectiveDate)
//     if (refundEffectiveDate.getMonth() == td.getMonth()) {
//         console.log("refund Effective", refundEffectiveDate.getDate())
//         if (refundEffectiveDate.getDate() == td.getDate()) {
//             prevDate = 1;
//         } else {
//             prevDate = td.getDate() - refundEffectiveDate.getDate();
//         }
//     }

//     if (prevDate == 0) {
//         var tempDate = new Date(td.getFullYear(), td.getMonth(), 0)
//         console.log("fdsfg----------------------")
//         if (td.getMonth() - refundEffectiveDate.getMonth() == 1) {
//             console.log(refundEffectiveDate.getDate())
//             console.log("==============")
//             prevDate = tempDate.getDate() - refundEffectiveDate.getDate() + 1;
//         } else {
//             console.log("hjgdsfsdjfgjs=================" ,tempDate)
//             prevDate = tempDate.getDate()
//         }

//     }

//     console.log("perDayMg", perDayMg)
//     console.log("prevDate555555", prevDate)
//     var perSettlementMg = perDayMg * prevDate;
//     if (days1 == 0) {
//         perSettlementMg = 0;
//     }
//     console.log("prevAmountCollectedTillDate", prevAmountCollectedTillDate)
//     console.log("perSettlementMg", perSettlementMg)
//     console.log("actualCommissionTillDate", actualCommissionTillDate)
//     console.log("amountCollectedTillDate", amountCollectedTillDate)

//     if (actualCommissionTillDate >= perSettlementMg) {

//         amountPayableToBeu = prevAmountCollectedTillDate - actualCommissionTillDate
        
//     } else {

//         amountPayableToBeu = prevAmountCollectedTillDate - perSettlementMg
       
//     }
    

//     var amountCollectedTillDate = parseInt(amountCollectedTillDate - amountPayableToBeu); // fluctuates
//         console.log("amountCollectedTillDate", amountCollectedTillDate)

//     gstAmount = (amountPayableToBeu * 18) / 100
//     amountPayableToBeu = amountPayableToBeu + gstAmount - subscriptionSoldBySalon
    
    
//     amountPayableToBeuAfterDiscount = amountPayableToBeu;

// console.log("amountPayableToBeu", amountPayableToBeu)
//     console.log("-----------------------------", amountPayableToBeu)
//     console.log("--------->totalCollectionByBeu ", totalCollectionByBeu)

//     console.log("--------->amountPayableToBeuAfterDiscount ", amountPayableToBeuAfterDiscount)


//     netPayable = Math.ceil(totalCollectionByBeu + refundOnErp + refundAppDigitalOnline + refundAppDigitalCash + refundFirstAppDigital + refundFirstAppCash + amountPayableToBeuAfterDiscount - onlinePaymentFee);

//     console.log("--------->netPayable ", netPayable)
//     console.log("--------->=----------------- ", totalCollectionByBeu, refundOnErp, refundAppDigitalOnline, refundAppDigitalCash, refundFirstAppDigital, refundFirstAppCash, amountPayableToBeuAfterDiscount, onlinePaymentFee)


//     freebiesPayoutJulyTillDate = freebiesPayoutJulyTillDate + collectedByLoyalityPoints;
//     cashBackErpAndAppPayoutJulyTillDate = cashBackErpAndAppPayoutJulyTillDate + refundOnErp + refundAppDigitalOnline + refundAppDigitalCash + refundFirstAppDigital;
//     console.log("-------------------net payable--------------------", netPayable)
//     console.log("membership ", membershipSoldByBeu)
//     console.log("subscriptionSoldBySalon ", subscriptionSoldBySalon)
//     var newPaid = (netPayable <=0) ? 0 :  netPayable + balance;
//     var oldPreviousDue=balance;
//     // new code
//     var newPaid = netPayable + balance;
//     if(newPaid<=0){
//         newPaid=0
//     }
//     balance=netPayable + balance;
//     return {

//         serviceRevenue: realServiceRevenue,
//         productRevenue: productRevenue,
//         totalRevenue: totalRevenue,
//         membershipSold: membershipSold,
//         membershipSoldByBeu: membershipSoldByBeu,
//         membershipPurchased: membershipPurchased,
//         totalCollectionByParlor: totalCollectionByParlor,
//         // totalCollectionByBeu: totalCollectionByBeu + membershipSoldByBeu,
//         totalCollectionByBeu: totalCollectionByBeu,
//         totalCollection: totalCollection,
//         collectedByApp: collectedByApp,
//         collectedByMembershipCredits: collectedByMembershipCredits,
//         collectedByAffiliates: collectedByAffiliates,
//         collectedByLoyalityPoints: collectedByLoyalityPoints,
//         discountPercentage: discountPercentage,
//         amountPayableToBeu: amountPayableToBeu,
//         collectedByMembershipCreditsForOtherParlor: collectedByMembershipCreditsForOtherParlor,
//         lessDiscount: lessDiscount,
//         amountPayableToBeuAfterDiscount: amountPayableToBeuAfterDiscount,
//         serviceTax: serviceTax,
//         amountPayableToBeuAfterTax: amountPayableToBeuAfterTax,
//         netPayable: netPayable,
//         finalRemaining: finalRemaining,
//         actualCommission: actualCommission,
//         // refundAppDigital:refundAppDigital,
//         refundFirstAppCash: refundFirstAppCash,
//         refundAppDigitalOnline: refundAppDigitalOnline,
//         refundAppDigitalCash: refundAppDigitalCash,
//         refundFirstAppDigital: refundFirstAppDigital,
//         refundOnErp: refundOnErp,
//         refundAppDigitalOnlineMTD: refundAppDigitalOnlineMTD,
//         refundAppDigitalCashMTD: refundAppDigitalCashMTD,
//         actualCommissionTillDate: actualCommissionTillDate,
//         amountCollectedTillDate: amountCollectedTillDate,
//         refundOnErpTillDate: refundOnErpTillDate,
//         freebiesPayoutJulyTillDate: freebiesPayoutJulyTillDate,
//         cashBackErpAndAppPayoutJulyTillDate: cashBackErpAndAppPayoutJulyTillDate,
//         previousDue: oldPreviousDue,
//         paidToSalon: newPaid,
//         balance: newPaid == 0 ? balance : 0,
//         onlinePaymentFee: onlinePaymentFee,
//         onlinePaymentFeeTax: onlinePaymentFeeTax,
//         collectedByAppCash: collectedByAppCash,
//         subscriptionSoldBySalon: subscriptionSoldBySalon,
//         subscriptionLoyalty: subscriptionLoyalty,
//         totalPastRevenueService: totalPastRevenueService


//     };

// };


//New Code Settlement


parlorSchema.statics.createSettlementReportv2 = function(startDate, endDate, period, parlorQuery, cb) {
        var firstSettlementofMonth = startDate.getDate() == 1 ? true : false;
        // var firstSettlementofMonth = false;
        var thisMonthStartDate = HelperService.getCurrentMonthStart(new Date());
        //if(startDate.getDate() == thisMonthStartDate.getDate())firstSettlementofMonth = false;
        console.log("firstSettlementofMonth" , firstSettlementofMonth)

        var async = require('async');
        
        SettlementReport.findOne({}).sort({ invoiceId: -1 }).limit(1).exec(function(err, settlementCount) {
            var count = settlementCount ? settlementCount.invoiceId : 0;
            // parlorQuery.active = true;
            // parlorQuery.createdAt = {$gt : new Date(2018,6,1)}
            Parlor.find(parlorQuery, { services: 0 }, function(err, parlors) {
                

                async.each(parlors ,  function(parlor, callback) {
                   
                   console.log("Parlor is " + parlor.name);
                   SettlementMonthlyTdsTcs.findOne({parlorId: parlor._id, month : new Date().getMonth(), year : new Date().getFullYear() } , function(err , tdsTcs){

                        ActiveMembership.find({
                            'history.0.parlorId': parlor.id,
                            'history.0.appointmentDate': { $gte: startDate, $lte: endDate },
                            "paymentMethods.value": 10
                        }, function(err, mSales) {
                            
                        LuckyDrawDynamic.find({parlorId : parlor.id, settlementPeriod : period-1 , status : {$in : [0,2]} , categoryId:{$in : ["20","21","22"]}}, function(err , luckyDrawData){
                            
                            SubscriptionSale.aggregate([{ $match: { 'response.id': { $regex: "cash" }, createdAt: { $gte: startDate, $lte: endDate } } },
                                    { $lookup: { from: "appointments", localField: "userId", foreignField: "client.id", as: "appts" } },
                                    { $project: { userId: 1, response: 1, razorPayId: 1, price: 1, appts: "$appts" } },
                                    { $unwind: "$appts" },
                                    { $match: { "appts.parlorId": ObjectId(parlor.id), "appts.status": 3, "appts.subscriptionAmount": { $gt: 0 } } },
                                    { $group: { _id: "$userId", price: { $first: "$price" }, appts: { $first: "$appts" } } },
                                    { $project: { price: 1, razorPayId: 1, apptStatus: "$appts.status", parlorId: "$appts.parlorId", parlorName: "$appts.parlorName",
                                            payableAmount: "$appts.payableAmount", subscriptionAmount: "$appts.subscriptionAmount", clientName: "$appts.client.name"
                                        }
                                    }
                                ],
                                function(err, subscription) {
                                SubscriptionSale.aggregate([{$match : {razorPayId: {$regex : parlor.id} , createdAt : { $gte: startDate, $lte: endDate }}},{$group : {_id: null , count:{$sum :1}}}], 
                                        function(err, salonSubscription){

                                        Appointment.find({
                                            'services.creditsSource.parlorId': parlor.id,
                                            parlorId: { $ne: parlor.id },
                                            status: 3,
                                            appointmentStartTime: { $gte: startDate, $lte: endDate }
                                        }, function(err, parlorNotappointments) {
                                            Appointment.find({
                                                parlorId: parlor.id,
                                                status: { $in: [1, 4] },
                                                appointmentStartTime: { $gte: startDate, $lte: endDate }
                                            }).count(function(err, pendingAppointments) {

                                                console.log({
                                                    parlorId: parlor.id,
                                                    status: 3,
                                                    appointmentStartTime: { $gte: startDate, $lte: endDate }
                                                })
                                                Appointment.find({
                                                    parlorId: parlor.id,
                                                    status: 3,
                                                    appointmentStartTime: { $gte: startDate, $lte: endDate }
                                                }, function(err, appointments) {
                                                    var year = new Date().getFullYear()
                                                    var query = {
                                                        parlorId: parlor.id,
                                                        status: 3,
                                                        appointmentStartTime: {
                                                            $gte: HelperService.getFirstDateOfMonth(year, endDate.getMonth()),
                                                            $lt: startDate
                                                        }
                                                    };
                                                    Appointment.find(query, {
                                                        services: 1,
                                                        products: 1,
                                                        freeLoyalityPoints: 1,
                                                        createdAt: 1
                                                    }, function(err, parlorPastAppts) {
                                                        SettlementReport.findOne({
                                                            parlorId: parlor.id,
                                                            period: period - 1
                                                        }, function(err, pastsettlement) {
                                                            var pendingAmount = 0;
                                                            var actualCommissionTillDate = 0;
                                                            var amountCollectedTillDate = 0;
                                                            var amountCollectedTillDateBeforeDiscount = 0;
                                                            var refundOnErpTillDate = 0;
                                                            var freebiesPayoutJulyTillDate = 0;
                                                            var cashBackErpAndAppPayoutJulyTillDate = 0;
                                                            var preNetPayable = 0;
                                                            var balance = 0;
                                                            var paidToSalon = 0;
                                                            var previousDue = 0;
                                                            var refundAppDigitalOnlineMTD = 0;
                                                            var refundAppDigitalCashMTD = 0;
                                                            var pastCommissionMgAfterDiscount = 0;
                                                             var quarterSettlementAmount = 0;
                                                            if (pastsettlement) {
                                                                if (pastsettlement.amountCollectedTillDate) amountCollectedTillDate = pastsettlement.amountCollectedTillDate;
                                                                if (pastsettlement.commissionMgAfterDiscount) pastCommissionMgAfterDiscount = pastsettlement.commissionMgAfterDiscount;
                                                                if (pastsettlement.amountCollectedTillDateBeforeDiscount) amountCollectedTillDateBeforeDiscount = pastsettlement.amountCollectedTillDateBeforeDiscount;
                                                                if (pastsettlement.actualCommissionTillDate) actualCommissionTillDate = pastsettlement.actualCommissionTillDate;
                                                                if (pastsettlement.freebiesPayoutJulyTillDate) freebiesPayoutJulyTillDate = pastsettlement.freebiesPayoutJulyTillDate;
                                                                if (pastsettlement.cashBackErpAndAppPayoutJulyTillDate) cashBackErpAndAppPayoutJulyTillDate = pastsettlement.cashBackErpAndAppPayoutJulyTillDate;
                                                                if (pastsettlement.pendingAmount) pendingAmount = pastsettlement.pendingAmount;
                                                                if (pastsettlement.netPayable) preNetPayable = pastsettlement.netPayable;
                                                                if (pastsettlement.balance) balance = pastsettlement.balance;
                                                                if (pastsettlement.paidToSalon) paidToSalon = pastsettlement.paidToSalon;
                                                                if (pastsettlement.previousDue) previousDue = pastsettlement.previousDue;
                                                                if (pastsettlement.previousDue) previousDue = pastsettlement.previousDue;
                                                                if (pastsettlement.specialPreviousDue != null && pastsettlement.specialPreviousDue != 'undefined') previousDue = pastsettlement.specialPreviousDue; //for settlements after product discount and GST
                                                                if (pastsettlement.quarterSettlementAmount != null && pastsettlement.quarterSettlementAmount != 'undefined') quarterSettlementAmount = pastsettlement.quarterSettlementAmount; //for quater settlement amount
                                                            }
                                                            var appointmentsData = appointments;
                                                            appointments = [];
                                                            async.each(appointmentsData, function(app, cb1) {
                                                                Admin.findOne({ _id: app.closedBy }, function(err, exists) {
                                                                    if (exists) {
                                                                        app.exist = true
                                                                    } else {
                                                                        app.exist = false;
                                                                    }
                                                                    appointments.push(app);
                                                                    cb1();
                                                                })

                                                            }, function(done) {
                                                                var calculatedData = Parlor.generateReportForParlorv2( tdsTcs , firstSettlementofMonth , balance, previousDue, paidToSalon, preNetPayable, appointments, actualCommissionTillDate, amountCollectedTillDate,amountCollectedTillDateBeforeDiscount,refundOnErpTillDate, refundAppDigitalOnlineMTD, refundAppDigitalCashMTD, freebiesPayoutJulyTillDate, cashBackErpAndAppPayoutJulyTillDate, parlor, startDate, endDate, period, mSales, parlorNotappointments, parlorPastAppts, pendingAmount, pendingAppointments, count + parlors.indexOf(parlor) + 1, subscription , pastCommissionMgAfterDiscount , salonSubscription , luckyDrawData ,quarterSettlementAmount)
                                                                if (calculatedData == null) {
                                                                    callback();
                                                                } else {

                                                                    //CReate Settlement
                                                                    console.log("data",calculatedData)
                                                                    SettlementReport.create(calculatedData, function(err, done) {
                                                                        //console.log("error",err)
                                                                    if(firstSettlementofMonth == true){
                                                                        if(calculatedData.ledgerBoolean == true){
                                                                            calculatedData.ledgerNewObj.period = period;
                                                                            SettlementLedger.create(calculatedData.ledgerNewObj , function(err, created){
                                                                                    console.log("Ledger Created")   

                                                                                    callback();
                                                                            })
                                                                            
                                                                        }
                                                                    }else{
                                                                        
                                                                        let thisMonth = (startDate.getMonth()+1) , thisYear = startDate.getFullYear();
                                                                        let ledgerName = (startDate.getDate())+' - '+endDate.getDate()+" Settlement";

                                                                        console.log("calculatedData.netPayableOfThisSettlement-------" ,calculatedData. netPayableOfThisSettlement , calculatedData.amountAdjustedInThisSettlement, calculatedData.amountPaidToSalon)
                                                                        
                                                                        let ledgerUpdateObj = {
                                                                                name : ledgerName,
                                                                                amountAdjustedInThisSettlement : calculatedData.amountAdjustedInThisSettlement,
                                                                                amountPaidToSalon : calculatedData.amountPaidToSalon, 
                                                                                moreAmountToBeAdjusted:  calculatedData.previousDue, 
                                                                                netPayableOfThisSettlement : calculatedData.netPayableOfThisSettlement,
                                                                                period : period
                                                                            };
                                                                                           
                                                                            SettlementLedger.update({parlorId : parlor.id , month : thisMonth , year :thisYear , period : period-1}, {$set : {updateAt : new Date() , period : period, currentDue : calculatedData.previousDue , totalRecoverable :calculatedData.previousDue}, $push : {monthWiseDetail :{$each : [ledgerUpdateObj]}}} , function(err, updated){
                                                                                console.log("Ledger Updated")   
                                                                                callback();
                                                                            })
                                                                        }
                                                                    }); // Create Settlement
                                                                }
                                                            })
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            })
                        })
                    });
                }, function allTaskCompleted() {
                        console.log('done');
                    return cb(null, 'Done');
                });
            });
            
                    
        });
    };



parlorSchema.statics.generateReportForParlorv2 = function( tdsTcs , firstSettlementofMonth, balance, previousDue, paidToSalon, preNetPayable, appointments, actualCommissionTillDate, amountCollectedTillDate, amountCollectedTillDateBeforeDiscount,refundOnErpTillDate, refundAppDigitalOnlineMTD, refundAppDigitalCashMTD, freebiesPayoutJulyTillDate, cashBackErpAndAppPayoutJulyTillDate, parlor, startDate, endDate, period, mSales, parlorNotappointments, parlorPastAppts, pendingAmount, pendingAppointments, invoiceId, subscription , pastCommissionMgAfterDiscount , salonSubscription , luckyDrawData ,quarterSettlementAmount) {

    var totalPastRevenueService = 0,
        totalPastRevenueProduct = 0,
        subscriptionSoldBySalon = 0,
        subscriptionLoyalty = 0,
        membershipSoldByBeu = 0
        activeMembershipSold = [],
        luckyDrawThroughBeu = 0;

    _.forEach(parlorPastAppts, function(appt) {
        _.forEach(appt.services, function(s) {
            var ser = Appointment.serviceFunction(appt.createdAt, s, []);
            totalPastRevenueService += ser.totalRevenue;
        });
        _.forEach(appt.products, function(product) {
            totalPastRevenueProduct += (product.price * product.quantity);
        });
        if (appt.freeLoyalityPoints) {
            totalPastRevenueService -= (parseInt(appt.freeLoyalityPoints / 1.15) * 0.25);
        }
    });
    _.forEach(mSales, function(adv) {
        if (adv.paymentMethods[0].value == 10) {
            membershipSoldByBeu += adv.price;
            activeMembershipSold.push((adv.history[0].appointmentId).toString())

        }

    });

    _.forEach(subscription, function(subs) { subscriptionSoldBySalon += subs.subscriptionAmount });

    _.forEach(luckyDrawData, function(draw) { luckyDrawThroughBeu += draw.amount });


    if(salonSubscription.length>0)subscriptionSoldBySalon += salonSubscription[0].count *1699;

    var report = calculateSettlementReportv2( tdsTcs, firstSettlementofMonth, activeMembershipSold, membershipSoldByBeu, balance, previousDue, paidToSalon, appointments, actualCommissionTillDate, amountCollectedTillDate, amountCollectedTillDateBeforeDiscount,refundOnErpTillDate, refundAppDigitalOnlineMTD, refundAppDigitalCashMTD, freebiesPayoutJulyTillDate, cashBackErpAndAppPayoutJulyTillDate, parlor, startDate, endDate, totalPastRevenueService, totalPastRevenueProduct, subscriptionSoldBySalon, subscriptionLoyalty, pastCommissionMgAfterDiscount, luckyDrawThroughBeu ,period ,quarterSettlementAmount);
    if (report == null) {
        return null;
    }
    var diffMs = (endDate.getTime() - startDate.getTime());
    var membershipSold = 0;
    collectedByMembershipCreditsForOtherParlor = 0;
    _.forEach(mSales, function(adv) {

        membershipSold += adv.price;
    });
    
    _.forEach(parlorNotappointments, function(appt) {
        _.forEach(appt.services, function(s) {
            if (s.creditsUsed) {
                _.forEach(s.creditsSource, function(cs) {
                    if (cs.parlorId + "" == parlor.id + "") {
                        collectedByMembershipCreditsForOtherParlor += cs.credits;
                    }
                });
            }
        });
    });

    return {
        holdPayment : parlor.holdPayment,
        parlorName: parlor.name,
        parlorEntityName: parlor.legalEntity,
        period: period,
        invoiceId: invoiceId,
        parlorAddress: parlor.address + ' ' + parlor.address2,
        startDate: startDate,
        endDate: endDate,
        periodOfSettlement: Math.round(diffMs / 86400000),
        serviceRevenue: report.serviceRevenue,
        productRevenue: report.productRevenue,
        totalRevenue: report.totalRevenue,
        activeMembershipSold: report.activeMembershipSold,
        membershipSold: membershipSold,
        membershipSoldByBeu: membershipSoldByBeu,
        collectedByMembershipCredits: report.collectedByMembershipCredits,
        membershipPurchased: report.membershipPurchased,
        totalCollectionByParlor: report.totalCollectionByParlor,
        totalCollectionByBeu: report.totalCollectionByBeu,
        totalCollection: report.totalCollection,
        collectedByLoyalityPoints: report.collectedByLoyalityPoints,
        collectedByApp: report.collectedByApp,
        collectedByMembershipCreditsForOtherParlor: collectedByMembershipCreditsForOtherParlor,
        collectedByAffiliates: report.collectedByAffiliates,
        revenueModel: parlor.commissionType,
        royalityPercentageService: parlor.serviceCommission,
        royalityPercentageProduct: parlor.productCommission,
        status: pendingAppointments > 0 ? 0 : 1,
        reason: pendingAppointments > 0 ? (pendingAppointments + " pending Appointments") : 'Successfully Generated',
        totalPastRevenueService: report.totalPastRevenueService,
        thresholdAmount1: parlor.commissionType ? parlor.thresholdAmount1 : 0,
        thresholdAmount1Commission: parlor.commissionType ? parlor.thresholdAmount1Commission : 0,
        thresholdAmount2: parlor.commissionType ? parlor.thresholdAmount2 : 0,
        thresholdAmount2Commission: parlor.commissionType ? parlor.thresholdAmount2Commission : 0,
        thresholdAmount3: parlor.commissionType ? parlor.thresholdAmount3 : 0,
        thresholdAmount3Commission: parlor.commissionType ? parlor.thresholdAmount3Commission : 0,
        discountPercentage: report.discountPercentage,
        amountPayableToBeu: report.amountPayableToBeu,
        lessDiscount: report.lessDiscount,
        amountPayableToBeuAfterDiscount: report.amountPayableToBeuAfterDiscount,
        amountPayableToBeuBeforeDiscount: report.amountPayableToBeuBeforeDiscount,
        serviceTax: report.serviceTax,
        amountPayableToBeuAfterTax: report.amountPayableToBeuAfterTax,
        advancePaid: 0,
        previousPendingAmount: pendingAmount,
        pendingAmount: pendingAmount > 0 ? pendingAmount + report.netPayable : (preNetPayable + report.netPayable) > 0 ? preNetPayable + report.netPayable : 0,
        pendingAmountBuffer: pendingAmount > 0 ? pendingAmount + report.netPayable : (preNetPayable + report.netPayable) > 0 ? preNetPayable + report.netPayable : 0,
        netAmountTransferred: ((report.netPayable * -1) - pendingAmount) > 0 ? ((report.netPayable * -1) - pendingAmount) : 0,
        netPayable: report.netPayable,
        newNetPayable : report.newNetPayable,
        parlorId: parlor.id,
        finalRemaining: report.finalRemaining,
        // refundAppDigital:report.refundAppDigital,
        refundAppDigitalOnline: report.refundAppDigitalOnline,
        refundAppDigitalCash: report.refundAppDigitalCash,
        refundFirstAppDigital: report.refundFirstAppDigital,
        refundOnErp: report.refundOnErp,
        actualCommissionTillDate: report.actualCommissionTillDate,
        amountCollectedTillDate: report.amountCollectedTillDate,
        amountCollectedTillDateBeforeDiscount: report.amountCollectedTillDateBeforeDiscount,
        refundOnErpTillDate: report.refundOnErpTillDate,
        refundAppDigitalOnlineMTD: report.refundAppDigitalOnlineMTD,
        refundAppDigitalCashMTD: report.refundAppDigitalCashMTD,
        actualCommission: report.actualCommission,
        freebiesPayoutJulyTillDate: report.freebiesPayoutJulyTillDate,
        cashBackErpAndAppPayoutJulyTillDate: report.cashBackErpAndAppPayoutJulyTillDate,
        higherValue: report.higherValue,
        previousDue: report.previousDue,
        paidToSalon: report.paidToSalon,
        balance: report.balance,
        onlinePaymentFee: report.onlinePaymentFee,
        onlinePaymentFeeTax: report.onlinePaymentFeeTax,
        collectedByAppCash: report.collectedByAppCash,
        refundFirstAppCash: report.refundFirstAppCash,
        firstAppCashPercent: report.firstAppCash,
        appCashPercent: report.appCash,
        firstAppDigitalPercent: report.firstAppDigital,
        appDigitalPercent: report.appDigital,
        onErpPercent: report.onErp,
        subscriptionSoldBySalon: report.subscriptionSoldBySalon,
        subscriptionLoyalty: report.subscriptionLoyalty,
        commissionMgBeforeDiscount: report.commissionMgBeforeDiscount,
        commissionMgAfterDiscount: report.commissionMgAfterDiscount,
        previousMonthRoyalty: report.previousMonthRoyalty,
        luckyDrawThroughBeu: report.luckyDrawThroughBeu,
        ledgerBoolean : report.ledgerBoolean,
        ledgerUpdateBoolean :  report.ledgerUpdateBoolean,
        // ledgerUpdateObj:  report.ledgerUpdateObj,
        ledgerNewObj:  report.ledgerNewObj,

        amountAdjustedInThisSettlement : report.amountAdjustedInThisSettlement,
        amountPaidToSalon : report.amountPaidToSalon, 
        netPayableOfThisSettlement : report.netPayableOfThisSettlement,


    };
};


function calculateSettlementReportv2( tdsTcs, firstSettlementofMonth, activeMembershipSold, membershipSoldByBeu, balance, previousDue, paidToSalon, appointments, actualCommissionTillDate, amountCollectedTillDate, amountCollectedTillDateBeforeDiscount,refundOnErpTillDate, refundAppDigitalOnlineMTD, refundAppDigitalCashMTD, freebiesPayoutJulyTillDate, cashBackErpAndAppPayoutJulyTillDate, parlor, startDate, endDate, totalPastRevenueService, totalPastRevenueProduct, subscriptionSoldBySalon, subscriptionLoyalty , pastCommissionMgAfterDiscount, luckyDrawThroughBeu , period ,quarterSettlementAmount) {
    var serviceRevenue = 0,
        higherValue = 0,
        collectedByApp2 = 0,
        gstAmount = 0,
        refundAppDigital = 0,
        refundAppDigitalOnline = 0,
        refundAppDigitalCash = 0,
        refundFirstAppDigital = 0,
        refundFirstAppCash = 0,
        refundOnErp = 0,
        collectedByAppCash = 0,
        productRevenue = 0,
        totalRevenue = 0,
        onlinePaymentFee = 0,
        onlinePaymentFeeTax = 0,
        membershipSold = 0,
        membershipPurchased = 0,
        totalCollectionByParlor = 0,
        totalCollectionByBeu = 0,
        totalCollection = 0,
        collectedByApp = 0,
        collectedByAffiliates = 0,
        discountPercentage = 0,
        amountPayableToBeu = 0,
        lessDiscount = 0,
        amountPayableToBeuAfterDiscount = 0,
        amountPayableToBeuBeforeDiscount = 0,
        serviceTax = 0,
        amountPayableToBeuAfterTax = 0,
        advancePaid = 0,
        netPayable = 0,
        newNetPayable = 0,
        finalRemaining = 0,
        collectedByLoyalityPoints = 0,
        collectedByMembershipCredits = 0,
        freeServiceRevenue = 0,
        freeProductRevenue = 0,
        collectedByMembershipCreditsForOtherParlor = 0,
        realServiceRevenue = 0,
        freeServiceRevenueVr = 0;
        commissionMgBeforeDiscount=0;
        commissionMgAfterDiscount=0;
    var i = 0,
        totalx = 0,
        male = 0,
        female = 0,
        others = 0;
    _.forEach(appointments, function(appt) {
        var serviceRevenueTotal = 0,
            serviceRevenueTotalPaidOnline = 0,
            productRevenueTotal = 0,
            discount = 0,
            loyalityRevenue = 0,
            membershipCreditsForBeu = 0,
            membershipCreditsForParlor = 0;

        if (appt.loyalitySubscription) {
            subscriptionLoyalty += appt.loyalitySubscription;
        }

        _.forEach(appt.services, function(service) {
            var ser = Appointment.serviceFunction(appt.createdAt, service, []);

            serviceRevenue += ser.totalRevenue;

            if (parlor.discountEndTime.getTime() > appt.appointmentStartTime.getTime()) {
                freeServiceRevenue += ser.totalRevenue;
            }

            if (service.loyalityPoints) {
                collectedByLoyalityPoints += (ser.serviceLoyalityRevenue);
                loyalityRevenue += (ser.serviceLoyalityRevenue);
                totalx += loyalityRevenue;
            }
            if (service.creditsUsed) {
                _.forEach(service.creditsSource, function(cs) {
                    if (cs.parlorId + "" != parlor.id + "") { 
                        membershipCreditsForBeu += cs.credits;
                        collectedByMembershipCredits += cs.credits;
                    }
                });
            }
            if (service.discountMedium == "groupon") discount++;
            serviceRevenueTotal += ser.totalRevenue;
        });
        if (appt.freeLoyalityPoints) {
            collectedByLoyalityPoints += (parseInt(appt.freeLoyalityPoints / 1.15) * 0.75);
            loyalityRevenue += (parseInt(appt.freeLoyalityPoints / 1.15) * 0.75);
            serviceRevenue -= (parseInt(appt.freeLoyalityPoints / 1.15) * 0.25);
            if (parlor.discountEndTime.getTime() > appt.appointmentStartTime.getTime()) {
                freeServiceRevenue -= (parseInt(appt.freeLoyalityPoints / 1.15) * 0.25);
                addMgCollectedTillDate = false

            }
            serviceRevenueTotal -= (parseInt(appt.freeLoyalityPoints / 1.15) * 0.25);
        }
        _.forEach(appt.products, function(product) {
            productRevenue += (product.price * product.quantity);
            if (parlor.discountEndTime.getTime() > appt.appointmentStartTime.getTime()) {
                freeProductRevenue += (product.price * product.quantity);
            }
            productRevenueTotal += (product.price * product.quantity);
        });
        if (appt.couponCode == '0') appt.couponCode = null;
        if (appt.paymentMethod != 5 && !appt.couponCode) {
            totalCollectionByParlor += (serviceRevenueTotal + productRevenueTotal - loyalityRevenue);
            // console.log("parlor", serviceRevenueTotal + productRevenueTotal - loyalityRevenue)
            totalCollectionByBeu += loyalityRevenue;
            // totalCollectionByBeu += membershipCreditsForBeu;

        } else {
            totalCollectionByBeu += serviceRevenueTotal;
            if (appt.couponCode && discount > 0) {
                collectedByAffiliates += serviceRevenueTotal;
            } else {
                if (activeMembershipSold.indexOf((appt._id).toString()) >= 0) {

                    collectedByApp += (serviceRevenueTotal + productRevenueTotal) - (loyalityRevenue) - appt.creditUsed / (1 + parlor.tax / 100)
                    totalCollectionByBeu -= appt.creditUsed / (1 + parlor.tax / 100);
                    totalCollectionByParlor += appt.creditUsed / (1 + parlor.tax / 100);
                } else {

                    collectedByApp += (serviceRevenueTotal + productRevenueTotal) - (loyalityRevenue) - appt.creditUsed / (1 + parlor.tax / 100);
                    totalCollectionByBeu -= appt.creditUsed / (1 + parlor.tax / 100);
                    totalCollectionByParlor += appt.creditUsed / (1 + parlor.tax / 100);

                }

                if (appt.appointmentType == 3 && appt.paymentMethod != 5) {
                    collectedByAppCash += (serviceRevenueTotal + productRevenueTotal) - (loyalityRevenue);
                }
                // collectedByApp += (appt.razorPayCaptureResponse.amount/118);
            }
        }

        
            //     var liveDate=new Date(parlor.parlorLiveDate)
            //     var currentMonth=new Date();
            //     console.log((currentMonth.getMonth()-liveDate.getMonth()))
            // if((currentMonth.getMonth()-liveDate.getMonth())<=3){

        if ((appt.exist || !parlor.refundByOtp) && (appt.couponCode == null)) {
            // if(collectedByAffiliates == 0){
            // console.log("refundOnErp", refundOnErp)
            if (appt.paymentMethod != 5 && appt.paymentMethod != 10 && appt.appBooking == 2 && appt.appointmentType == 3) {
                
                if (appt.clientFirstAppointment && parlor.firstAppDigital > 0) {
                    refundFirstAppCash += parlor.firstAppCash * (serviceRevenueTotal - loyalityRevenue) / 100;
                } else {
                    refundAppDigitalCash += parlor.appCash * serviceRevenueTotal / 100;
                }

            } else if (appt.razorPayCaptureResponse && appt.razorPayCaptureResponse.status == 'captured') {
                
                if (appt.clientFirstAppointment && parlor.firstAppDigital > 0) {

                    refundFirstAppDigital += (parlor.firstAppDigital * (appt.razorPayCaptureResponse.amount / 118)) / 100;
                } else {
                    refundAppDigitalOnline += (parlor.appDigital * (appt.razorPayCaptureResponse.amount / 118)) / 100;
                }
                if (appt.subscriptionAmount > 0) {
                    onlinePaymentFee += (appt.razorPayCaptureResponse.fee * (appt.payableAmount / (appt.payableAmount + appt.subscriptionAmount))) / 100;
                    onlinePaymentFeeTax += (appt.razorPayCaptureResponse.tax * (appt.payableAmount / (appt.payableAmount + appt.subscriptionAmount))) / 100;
                } else {
                    onlinePaymentFee += (appt.razorPayCaptureResponse.fee) / 100;
                    onlinePaymentFeeTax += (appt.razorPayCaptureResponse.tax) / 100;
                }

            } else {
                

                refundOnErp += parlor.onErp * serviceRevenueTotal / 100;
                // console.log("refundOnErp", refundOnErp)

            }
            // }
        }
        // }
    });


    totalRevenue = serviceRevenue + productRevenue;
    totalCollection = totalRevenue;
    realServiceRevenue = serviceRevenue;
    freeServiceRevenueVr = freeServiceRevenue;
    console.log("amountPayableToBeu------------>" , amountPayableToBeu)
    if (parlor.commissionType) {
        console.log("ayyyaaaaaaaaaa")
        var tempRevenue = 0;
        var dis = 0;
        // console.log("totalPastRevenueService", totalPastRevenueService + serviceRevenue)
        // console.log("thresholdAmount2", parlor.thresholdAmount2)
        if ((serviceRevenue + totalPastRevenueService - parlor.thresholdAmount2) > 0) {
           
            // if ((serviceRevenue - parlor.thresholdAmount2) > 0) {
            tempRevenue = totalPastRevenueService < parlor.thresholdAmount2 ? serviceRevenue + totalPastRevenueService - parlor.thresholdAmount2 : serviceRevenue;
            totalPastRevenueService = 0;
            amountPayableToBeu += (tempRevenue * parlor.thresholdAmount3Commission) / 100;

            serviceRevenue -= tempRevenue;
            if (freeServiceRevenueVr > 0) {
                dis = freeServiceRevenueVr - tempRevenue < 0 ? freeServiceRevenueVr : tempRevenue;
                lessDiscount = (dis * parlor.thresholdAmount3Commission) / 100;
                freeServiceRevenueVr -= dis;
            }

        }
        else if ((serviceRevenue + totalPastRevenueService - parlor.thresholdAmount1) > 0) {
            // if ((serviceRevenue - parlor.thresholdAmount1) > 0) {
            tempRevenue = totalPastRevenueService < parlor.thresholdAmount1 ? serviceRevenue + totalPastRevenueService - parlor.thresholdAmount1 : serviceRevenue;
            totalPastRevenueService = 0;
            amountPayableToBeu += (tempRevenue * parlor.thresholdAmount2Commission) / 100;
            serviceRevenue -= tempRevenue;
            if (freeServiceRevenueVr > 0) {
                dis = freeServiceRevenueVr - tempRevenue < 0 ? freeServiceRevenueVr : tempRevenue;
                lessDiscount = (dis * parlor.thresholdAmount2Commission) / 100;
                freeServiceRevenueVr -= dis;
            }
            
        }
        amountPayableToBeu += (serviceRevenue * parlor.thresholdAmount1Commission) / 100;
        amountPayableToBeu += (productRevenue * parlor.productCommission) / 100;
        

        lessDiscount = (freeServiceRevenueVr * parlor.thresholdAmount1Commission) / 100;

        lessDiscount += (freeProductRevenue * parlor.productCommission) / 100;
        amountPayableToBeuAfterDiscount = amountPayableToBeu;

    } else {
        amountPayableToBeu = (serviceRevenue * parlor.serviceCommission) / 100;
        amountPayableToBeu += (productRevenue * parlor.productCommission) / 100;
        lessDiscount = (freeServiceRevenue * parlor.serviceCommission) / 100;
        lessDiscount += (freeProductRevenue * parlor.productCommission) / 100;
        amountPayableToBeuAfterDiscount = amountPayableToBeu;

    }
    lessDiscount = lessDiscount * (1 + parlor.tax / 100)
    if (lessDiscount > 0) {
        amountPayableToBeuAfterDiscount = amountPayableToBeu - lessDiscount;
        discountPercentage = 100;
    }
    var isLastDate = HelperService.isTodayLastDate(new Date())
    console.log("endDate" , endDate)
    var numberOfDay = HelperService.getNoOfDaysInMonth(endDate.getFullYear(), endDate.getMonth())
    var perDayMg = parlor.minimumGuarantee / parseInt(numberOfDay)
    var actualCommission = amountPayableToBeu;
    console.log("actualCommission" , actualCommission)
    if (startDate != undefined && endDate != undefined && parlor.discountEndTime != undefined) {
        var days1 = ParlorService.getDiffForSettlement(startDate, endDate, parlor.discountEndTime);
        console.log("days1", days1)
    } else {
        return null;
    }

    if (days1 == 0) {
        amountPayableToBeuAfterDiscount = 0;
        actualCommission = 0;
    }
    if (firstSettlementofMonth) { //newMonth
        actualCommissionTillDate = 0;
        amountCollectedTillDate = 0;
        pastCommissionMgAfterDiscount =0;
    }
    var actualCommissionTillDate = actualCommission + actualCommissionTillDate
    console.log("actualCommissionTillDate 1111", actualCommissionTillDate)

    // var settlementMg = perDayMg * days1;

    var monthMg = parlor.minimumGuarantee
    var perSettlementMg =0;
    
    if(new Date().getDate()-endDate.getDate()==1){
        var td = new Date();
    }else{
        var td = new Date(endDate.getTime());
        td.setDate(td.getDate() + 1);
    }
    var td = HelperService.addDaysToDate(endDate , 1)
    var monthStart = HelperService.getCurrentMonthStart(td);
    var x = 0
    var prevDate = td.getDate() - 1;
    
    if(startDate <= parlor.discountEndTime && endDate >= parlor.discountEndTime && endDate.getFullYear()== parlor.discountEndTime.getFullYear() ){
        prevDate =  parlor.discountEndTime.getDate() - monthStart.getDate();
        perSettlementMg = perDayMg * prevDate;
       console.log("conditions 111111")

    } else if(parlor.reLiveCloseDate && endDate.getMonth() == parlor.reLiveCloseDate.getMonth() &&  endDate.getFullYear() == parlor.reLiveCloseDate.getFullYear() && endDate.getMonth() == parlor.reLiveOpenDate.getMonth() &&  endDate.getFullYear() == parlor.reLiveOpenDate.getFullYear() ){
         prevDate = endDate.getDate() - parlor.reLiveOpenDate.getDate();
         perSettlementMg = perDayMg * prevDate + parlor.previousPerDayMg*(parlor.reLiveCloseDate.getDate() - monthStart.getDate())
         x =perSettlementMg;
         console.log("conditions 22222222222")
    } else if(endDate > parlor.discountEndTime && endDate.getMonth()== parlor.discountEndTime.getMonth() && endDate.getFullYear()== parlor.discountEndTime.getFullYear() ){
        prevDate =   endDate.getDate() - monthStart.getDate();
        perSettlementMg = perDayMg * prevDate;
        console.log("conditions 333333333")
    }   else if(endDate <= parlor.discountEndTime && endDate.getMonth() <= parlor.discountEndTime.getMonth() && endDate.getFullYear() == parlor.discountEndTime.getFullYear() ){
        console.log("conditions 4444444444")
        
        if(monthStart > parlor.parlorLiveDate){
            prevDate = td.getDate() - monthStart.getDate();
             console.log("conditions 66")
            perSettlementMg = perDayMg * prevDate;
        }else {
            prevDate = endDate.getDate() - parlor.parlorLiveDate.getDate();
            perSettlementMg = perDayMg * prevDate;
             console.log("conditions 77777777")
        }

    } else if(endDate > parlor.discountEndTime){
             prevDate =   endDate.getDate() - monthStart.getDate() +1;
             console.log("conditions 5555555555555555")
            perSettlementMg = perDayMg * prevDate;
    }

    

   // var perSettlementMg = perDayMg * prevDate;
    if (days1 == 0) {
        perSettlementMg = 0;
    }

    // If discount ends in middle of the month

    if(td >  parlor.discountEndTime){
        console.log("1")
        
        commissionMgBeforeDiscount = Math.max(perSettlementMg , actualCommission);
        commissionMgAfterDiscount = Math.max(perSettlementMg , actualCommission);
    }else {
        if(!x){
            console.log("2")
            commissionMgBeforeDiscount = perDayMg * prevDate;
            commissionMgAfterDiscount = perSettlementMg;
        }else{
            console.log("3")
            commissionMgBeforeDiscount = x;
            commissionMgAfterDiscount = perSettlementMg;
        }
        
    }
    var i = amountCollectedTillDate;
    var prevAmountCollectedTillDate = parseInt(amountCollectedTillDate);
    console.log("amountPayableToBeu11111111,",amountPayableToBeu)

    if (amountPayableToBeu < perSettlementMg) {
        console.log("4")
       amountPayableToBeu = prevAmountCollectedTillDate - perSettlementMg
        amountPayableToBeuAfterDiscount = amountPayableToBeu;
        console.log("lessDiscount" , lessDiscount)
        amountPayableToBeu -= lessDiscount;
    }

    if (actualCommissionTillDate >= perSettlementMg) {
       
        amountPayableToBeu = prevAmountCollectedTillDate - actualCommissionTillDate
        
    } else {

        amountPayableToBeu = prevAmountCollectedTillDate - perSettlementMg
       
    }
    console.log("amountPayableToBeu22,",amountPayableToBeu)

    var amountCollectedTillDate = parseInt(amountCollectedTillDate - amountPayableToBeu); // fluctuates

    gstAmount = (amountPayableToBeu * 18) / 100
    amountPayableToBeu = amountPayableToBeu + gstAmount - subscriptionSoldBySalon ;
    
    
    // amountPayableToBeuAfterDiscount = amountPayableToBeu;
    amountPayableToBeuAfterDiscount = amountPayableToBeu;

    amountPayableToBeuBeforeDiscount = commissionMgBeforeDiscount - amountCollectedTillDateBeforeDiscount;

    amountCollectedTillDateBeforeDiscount = amountCollectedTillDateBeforeDiscount + amountPayableToBeuBeforeDiscount;

    netPayable = Math.round(totalCollectionByBeu + amountPayableToBeuAfterDiscount - onlinePaymentFee - luckyDrawThroughBeu);

console.log("srrrrrrrrrrrrrrrrrrrrrr--------------" , totalCollectionByBeu)
    newNetPayable = netPayable;
console.log("sdfsdfgsgfsdagfjsd--------------" , netPayable)

   
    freebiesPayoutJulyTillDate = freebiesPayoutJulyTillDate + collectedByLoyalityPoints;
    cashBackErpAndAppPayoutJulyTillDate = cashBackErpAndAppPayoutJulyTillDate ;
   
    var newPaid = (netPayable <=0) ? 0 :  netPayable + balance;
    var oldPreviousDue= balance ;
    // var oldPreviousDue= previousDue ;
    // new code
    var newPaid = netPayable + balance;
    if(newPaid<=0){
        newPaid=0
    }
    balance= netPayable + balance;
    console.log("parlor.holdPayment" ,parlor.holdPayment)
var netPayableOfThisSettlement = netPayable;
var amountPaidToSalon = 0;
var amountAdjustedInThisSettlement = 0;


    // New Model Type
    var ledgerBoolean = false , ledgerNewObj = {} ,  ledgerUpdateBoolean = false , previousMonthRoyalty =0;

            var monthlyTDS = tdsTcs ? tdsTcs.monthlyTDS : 0;
            var monthlyTCS = tdsTcs ? tdsTcs.monthlyTCS : 0
        
        if(firstSettlementofMonth == true){ //FirstDay Of Month
                ledgerBoolean = true;
               
                ledgerNewObj = {
                        createdAt : new Date(),
                        parlorId : parlor.id,
                        parlorName : parlor.name,
                        previousDues : previousDue,
                        month : new Date().getMonth() +1,
                        year : new Date().getFullYear(),
                        monthlyTDS : monthlyTDS,
                        monthlyTCS : monthlyTCS
                    }

                var thisMonth = new Date().getMonth();
            if(parlor.modelType == 1){ 
                var amountToBeChargedFromSalon = 0;
                parlor.modelTypeLiveDate=new Date(parlor.modelTypeLiveDate.getFullYear(), parlor.modelTypeLiveDate.getMonth(), parlor.modelTypeLiveDate.getDate())
                var effectiveDays = 1+ HelperService.getDaysBetweenTwoDates((parlor.modelTypeLiveDate) , HelperService.getLastMonthEndDate(new Date()));
                console.log("effectiveDays", effectiveDays)
                var liveDateMonth = parlor.modelTypeLiveDate.getMonth();
                
                var daysInMonth = HelperService.getDaysInMonth(thisMonth - 1, new Date().getFullYear())
                daysInMonth = 30
                
                console.log("daysInMonth", daysInMonth)
                var diff=0;
                if(thisMonth-liveDateMonth<0)diff=thisMonth-liveDateMonth+12
                else  diff=thisMonth-liveDateMonth
                    console.log("daysInMonth", daysInMonth,diff)
                if(diff==0){
                    amountToBeChargedFromSalon = 0
                    previousMonthRoyalty =  0;
                }else if(diff==1){
                    amountToBeChargedFromSalon = (parlor.minimumGuarantee/2) * effectiveDays / daysInMonth;
                    previousMonthRoyalty =  amountToBeChargedFromSalon;
                }else{
                    amountToBeChargedFromSalon = (parlor.minimumGuarantee/2);
                    previousMonthRoyalty =  amountToBeChargedFromSalon;
                }
                if(parlor.id=="588a0cc3f8169604955dce8d" || parlor.id=="59a54dfd46f4a7494eac6f2f" || parlor.id == "5aec5864e5c9e748727c69f7" || parlor.id== '5c0a78877e191b343246018f'){
                    amountToBeChargedFromSalon = 0;
                    previousMonthRoyalty =  amountToBeChargedFromSalon;
                }

                    console.log("variables diff",diff)
                    
                    console.log("variables monthlyTDS",monthlyTDS)
                    console.log("variables monthlyTCS",monthlyTCS)
                    console.log("variables quarterSettlementAmount of salon",quarterSettlementAmount,parlor.id)
                   

                    amountToBeChargedFromSalon = -Math.round(amountToBeChargedFromSalon * 1.18) + monthlyTDS + monthlyTCS + quarterSettlementAmount
                    newNetPayable = previousDue + amountToBeChargedFromSalon  + netPayable;
                
                amountAdjustedInThisSettlement =0 , amountPaidToSalon =0 , moreAmountToBeAdjusted= 0;
                netPayableOfThisSettlement = netPayable

                netPayable = (previousDue + amountToBeChargedFromSalon  + netPayable);
                console.log("variables netPayable",netPayable)
                console.log("variables diff",amountToBeChargedFromSalon)
                if (netPayable == 0){
                    console.log("if 11111111111")
                    amountAdjustedInThisSettlement = 0
                    amountPaidToSalon = netPayable;
                    previousDue = 0;
                }else if(netPayable > 0){
                    console.log("else if 11111111111")

                    // if(netPayable < amountToBeChargedFromSalon ){
                    //     console.log("if 222222222222")
                    //     amountAdjustedInThisSettlement = netPayable
                    //     amountPaidToSalon = 0
                    //     moreAmountToBeAdjusted = amountToBeChargedFromSalon - netPayable
                    //     previousDue = moreAmountToBeAdjusted;
                    // }else{
                        console.log("else 222222222222")
                        amountAdjustedInThisSettlement = amountToBeChargedFromSalon 
                        if(parlor.holdPayment == true){
                            amountPaidToSalon = 0 
                            previousDue =  netPayable
                            moreAmountToBeAdjusted = previousDue
                            netPayable = 0

                        }else{
                            amountPaidToSalon =  netPayable 
                            moreAmountToBeAdjusted = 0
                            previousDue = 0;

                        }
                        
                    // }
                    
                }else {
                    if(netPayableOfThisSettlement > 0){
                        amountAdjustedInThisSettlement = netPayableOfThisSettlement + Math.max(0, previousDue)
                        amountPaidToSalon = 0 
                        moreAmountToBeAdjusted = netPayable
                        previousDue = moreAmountToBeAdjusted;
                    }else{
                        amountAdjustedInThisSettlement = 0
                        amountPaidToSalon = 0 
                        moreAmountToBeAdjusted = netPayable
                        previousDue = moreAmountToBeAdjusted;
                    }
                    console.log("else 11111111111111")
                    
                }
                    ledgerNewObj.yearlyModel =  true,
                    ledgerNewObj.previousMonthRoyalty = Math.round(previousMonthRoyalty * 1.18),
                    ledgerNewObj.totalRecoverable = moreAmountToBeAdjusted, //Math.round((amountToBeChargedFromSalon * 1.18) + previousDue),
                    ledgerNewObj.quarterSettlementAmount=quarterSettlementAmount;
                    ledgerNewObj.currentDue = moreAmountToBeAdjusted , //Math.round((amountToBeChargedFromSalon * 1.18) + previousDue),
                    ledgerNewObj.monthWiseDetail = [{
                        name : startDate.getDate()+' - '+endDate.getDate()+" Settlement",
                        amountAdjustedInThisSettlement : amountAdjustedInThisSettlement ,
                        amountPaidToSalon : amountPaidToSalon,
                        moreAmountToBeAdjusted: moreAmountToBeAdjusted, 
                        netPayableOfThisSettlement : netPayableOfThisSettlement,
                        period: period
                    }]
                    
                    
                } else{ // Non- Yearly Model - First 
                    netPayable = netPayable + monthlyTDS + monthlyTCS;
                        if(previousDue + netPayable >0){
                            
                            if(parlor.holdPayment == true){
                                previousDue = previousDue + netPayable
                                netPayable = 0;
                            }else{
                                netPayable = previousDue + netPayable
                            previousDue = 0;
                            }

                        }else if(previousDue + netPayable == 0){
                            previousDue = 0;
                            netPayable = 0

                        }else if(previousDue + netPayable < 0){
                            previousDue = previousDue + netPayable
                            netPayable = 0
                        }
                    
                    ledgerNewObj.monthWiseDetail = [{
                        name : startDate.getDate()+' - '+endDate.getDate()+" Settlement",
                        amountAdjustedInThisSettlement : 0 ,
                        amountPaidToSalon : Math.max(0, netPayable) ,
                        netPayableOfThisSettlement : netPayable,
                        moreAmountToBeAdjusted : previousDue + netPayable,
                        period: period
                    }]
                    // previousDue = previousDue + netPayable
                }
        } else{                                                       

        // second time ledger


            ledgerUpdateBoolean = true; 
            newNetPayable = netPayable;


                netPayableOfThisSettlement = netPayable; //Settlement Amount
                 amountPaidToSalon = 0;
                 amountAdjustedInThisSettlement = 0;
                

                netPayable = netPayableOfThisSettlement + previousDue; 

                console.log("netPayable----------->" , netPayable)
                console.log("netPayableOfThisSettlement----------->" , netPayableOfThisSettlement)
                console.log("previousDue----------->" , previousDue)

                if(previousDue < 0 && netPayable <= 0){
                    console.log("1111111111")
                    previousDue = netPayable;
                    amountPaidToSalon = 0;
                    amountAdjustedInThisSettlement = Math.max(0, netPayableOfThisSettlement);

                }else if(previousDue < 0 && netPayable > 0){
                    console.log("2222222222")

                    amountAdjustedInThisSettlement = -previousDue;
                    amountPaidToSalon = netPayable;
                    previousDue = 0;

                }else if(previousDue >= 0 && netPayable <= 0){
                    console.log("3333333333")

                    previousDue = netPayable;
                    amountPaidToSalon = 0;
                    amountAdjustedInThisSettlement = previousDue;

                }else if(previousDue >= 0 && netPayable > 0){

                     console.log("44444444444")
                   previousDue = 0;
                    amountPaidToSalon = netPayable;
                    amountAdjustedInThisSettlement = 0;

                }else{
                    console.log("else 555555555555")
                }
                
                if(parlor.holdPayment == true && netPayable >= 0){
                    console.log("In hold payment" , netPayable ,previousDue)
                    previousDue = previousDue + netPayable;
                     amountPaidToSalon = 0;
                    netPayable = 0;
                }

            }

    return {

        amountAdjustedInThisSettlement : amountAdjustedInThisSettlement,
        amountPaidToSalon : amountPaidToSalon, 
        netPayableOfThisSettlement : netPayableOfThisSettlement,

        holdPayment: parlor.holdPayment,
        previousDue:  previousDue,
        previousMonthRoyalty: previousMonthRoyalty * 1.18,
        ledgerBoolean : ledgerBoolean,
        ledgerUpdateBoolean : ledgerUpdateBoolean,
        // ledgerUpdateObj: ledgerUpdateObj,
        ledgerNewObj: ledgerNewObj,
        serviceRevenue: realServiceRevenue,
        productRevenue: productRevenue,
        totalRevenue: totalRevenue,
        membershipSold: membershipSold,
        membershipSoldByBeu: membershipSoldByBeu,
        membershipPurchased: membershipPurchased,
        totalCollectionByParlor: totalCollectionByParlor,
        // totalCollectionByBeu: totalCollectionByBeu + membershipSoldByBeu,
        totalCollectionByBeu: totalCollectionByBeu,
        totalCollection: totalCollection,
        collectedByApp: collectedByApp,
        collectedByMembershipCredits: collectedByMembershipCredits,
        collectedByAffiliates: collectedByAffiliates,
        collectedByLoyalityPoints: collectedByLoyalityPoints,
        discountPercentage: discountPercentage,
        amountPayableToBeu: amountPayableToBeu,
        collectedByMembershipCreditsForOtherParlor: collectedByMembershipCreditsForOtherParlor,
        lessDiscount: lessDiscount,
        amountPayableToBeuAfterDiscount: amountPayableToBeuAfterDiscount,
        amountPayableToBeuBeforeDiscount: amountPayableToBeuBeforeDiscount,
        serviceTax: serviceTax,
        amountPayableToBeuAfterTax: amountPayableToBeuAfterTax,
        netPayable: netPayable,
        newNetPayable: newNetPayable,
        finalRemaining: finalRemaining,
        actualCommission: actualCommission,
        // refundAppDigital:refundAppDigital,
        refundFirstAppCash: refundFirstAppCash,
        refundAppDigitalOnline: refundAppDigitalOnline,
        refundAppDigitalCash: refundAppDigitalCash,
        refundFirstAppDigital: refundFirstAppDigital,
        refundOnErp: refundOnErp,
        refundAppDigitalOnlineMTD: refundAppDigitalOnlineMTD,
        refundAppDigitalCashMTD: refundAppDigitalCashMTD,
        actualCommissionTillDate: actualCommissionTillDate,
        amountCollectedTillDate: amountCollectedTillDate,
        amountCollectedTillDateBeforeDiscount: amountCollectedTillDateBeforeDiscount,
        refundOnErpTillDate: refundOnErpTillDate,
        freebiesPayoutJulyTillDate: freebiesPayoutJulyTillDate,
        cashBackErpAndAppPayoutJulyTillDate: cashBackErpAndAppPayoutJulyTillDate,
        paidToSalon: newPaid,
        balance: newPaid == 0 ? balance : 0,
        onlinePaymentFee: onlinePaymentFee,
        onlinePaymentFeeTax: onlinePaymentFeeTax,
        collectedByAppCash: collectedByAppCash,
        subscriptionSoldBySalon: subscriptionSoldBySalon,
        subscriptionLoyalty: subscriptionLoyalty,
        totalPastRevenueService: totalPastRevenueService,
        commissionMgBeforeDiscount: commissionMgBeforeDiscount,
        commissionMgAfterDiscount: commissionMgAfterDiscount,
        luckyDrawThroughBeu : luckyDrawThroughBeu 

    };

};


parlorSchema.statics.settlementMgFuntion = function(){

};

parlorSchema.statics.deleteSettlement = function(req, callback) {
    var parlorId = req.body.parlorId;
    var period = req.body.period;
}

parlorSchema.statics.getParlorsListForApp = function(serviceCode, req, callback) {
    var parlorIdswithFlashCoupons = [];
    var query = { code: req.query.couponCode };
    if (localVar.isServer()) query.active = true;
    else query.active = false;
    FlashCoupon.findOne(query, function(err, flashCoupons2) {
        if (flashCoupons2) {
            _.forEach(flashCoupons2.parlors, function(f) {
                if (f.currentCount > 0) parlorIdswithFlashCoupons.push(ObjectId(f.parlorId));
            });

        }
        var match = {
            'services.serviceCode': { $in: serviceCode }
        };
        var page = req.query.page || 1;
        var limit = req.query.page ? 10 : 100;
        if (serviceCode.length == 0) match = {};
        console.log(parlorIdswithFlashCoupons);
        console.log("parlorIdswithFlashCoupons");
        if (req.query.couponCode) match._id = { $in: parlorIdswithFlashCoupons };
        var parlorType = [],
            gender = [];
        if (req.query.gender == 1) gender = [1];
        else if (req.query.gender == 2) gender = [2, 1];
        else if (req.query.gender == 3) gender = [3, 1];
        else gender = [1, 2, 3];
        if(req.query.extraDiscountCouponCode)match.extraDiscountCouponAvailable = true;
        var sort = { distance: 1 };
        if (req.query.sort == 4) sort = { relevanceScore: -1 };
        if (req.query.sort == 2) sort = { budget: 1 };
        if (req.query.sort == 1) sort = { budget: -1 };
        if (req.query.sort == 3) sort = { rating: -1 };
        if (req.query.sort == 5) sort = { ambienceRating: -1 };

        if (parseInt(req.query.rating)) match.rating = { $gte: parseInt(req.query.rating) };
        if (parseInt(req.query.ambience)) match.ambienceRating = { $gte: parseInt(req.query.ambience) };
        if (req.query.price == 1) parlorType = [1];
        else if (req.query.price == 2) parlorType = [2];
        else if (req.query.price == 0) parlorType = [0];
        else if (req.query.price == 4) parlorType = [4];
        else parlorType = [1, 2, 0, 4];
        if(req.query.affiliateParlor)parlorType.push(4);
        match.gender = { $in: gender };
        match.parlorType = { $in: parlorType };
        if (req.query.brands && req.query.brands.length > 0) {
            match.brandsArray = { $in: JSON.parse(req.query.brands) };
        }
        console.log(match);
        var project = {link : 1, appRevenuePercentage:1, tax : 1, revenueDiscountSlabDown:1 , earlyBirdOfferPresent : 1, dayClosed: 1, id: 1, name: 1, images: 1, gender: 1, address: 1, parlorType: 1, link: 1, address2: 1, closingTime: 1, openingTime: 1, rating: 1, budget: 1, latitude: 1, longitude: 1, distance: "$geo.distance", recentTenRatingAvg: 1, averageNoOfClientsPerDay: 1, appRevenuePercentage: 1, revenueDiscountAvailable: 1, revenueDiscountSlabDown: 1, ambienceRating: 1, noOfUsersRated : 1,avgRoyalityAmount :1};

        var project2 = JSON.parse(JSON.stringify(project));
        project2.distance = 1;
        var project3 = JSON.parse(JSON.stringify(project));
        project3.distance = 1;

        project3.distanceScore = 1;
        project3.ratingScore = 1;
        project3.noOfClientScore = 1;
        project3.appRevenueScore = 1;

        var project4 = { name: 1, distanceScore: 1, noOfClientScore: 1, appRevenueScore: 1, ratingScore: 1, distance: 1 };

        // project.distanceSlab = { $cond: { if: { $gte: [ "$geo.distance", 15 ] }, then: -10, else: { $cond: { if: { $gte: [ "$geo.distance", 7 ] }, then: -5, else: {$cond: { if: { $gte: [ "$geo.distance", 5 ] }, then: 0, else: { $cond: { if: { $gte: [ "$geo.distance", 3 ] }, then: 4, else: { $cond: { if: { $gte: [ "$geo.distance", 1 ] }, then: 6, else: { $cond: { if: { $gte: [ "$geo.distance", .5 ] }, then: 8, else: 20 } } } } } }} } } } } };

        project.distanceSlab = { $cond: { if: { $gte: ["$geo.distance", 15] }, then: { $add: [-50, { $multiply: ["$geo.distance", -1.11] }] }, else: { $cond: { if: { $gte: ["$geo.distance", 7] }, then: { $add: [-8, { $multiply: ["$geo.distance", -1.11] }] }, else: { $cond: { if: { $gte: ["$geo.distance", 5] }, then: { $add: [0, { $multiply: ["$geo.distance", -1.11] }] }, else: { $cond: { if: { $gte: ["$geo.distance", 3] }, then: { $add: [4, { $multiply: ["$geo.distance", 1.11] }] }, else: { $cond: { if: { $gte: ["$geo.distance", 1] }, then: { $add: [6, { $multiply: ["$geo.distance", 1.11] }] }, else: { $cond: { if: { $gte: ["$geo.distance", .5] }, then: { $add: [15, { $multiply: ["$geo.distance", 1.11] }] }, else:  { $cond: { if: { $gte: ["$geo.distance", .3] }, then: { $add: [35, { $multiply: ["$geo.distance", 1.11] }] }, else: { $add: [50, { $multiply: ["$geo.distance", 1.11] }] } } } } } } } } } } } } } } };

        project.ratingSlab = { $cond: { if: { $gte: ["$recentTenRatingAvg", 4.5] }, then: 10, else: { $cond: { if: { $gte: ["$recentTenRatingAvg", 4] }, then: 8, else: { $cond: { if: { $gte: ["$recentTenRatingAvg", 3] }, then: 6, else: 4 } } } } } };

        project.averageNoOfClientsPerDaySlab = { $cond : {if : {$gte : ["$averageNoOfClientsPerDay", 2] }, then : -2, else : { $cond: { if: { $gte: ["$averageNoOfClientsPerDay", .75] }, then: 1, else: { $cond: { if: { $gte: ["$averageNoOfClientsPerDay", .5] }, then: 3, else: { $cond: { if: { $gte: ["$averageNoOfClientsPerDay", .3] }, then: 6, else: { $cond: { if: { $gte: ["$averageNoOfClientsPerDay", .1] }, then: 8, else: 10 } } } } } } } } } };

        // project.appDistanceRevenueSlab = { $cond: { if: { $gte: ["$appRevenuePercentage", 1] }, then: 1, else: { $cond: { if: { $gte: ["$appRevenuePercentage", .5] }, then: 5, else: { $cond: { if: { $gte: ["$appRevenuePercentage", .1] }, then: 10, else: 20 } } } } } };
        project.appDistanceRevenueSlab = { $cond: { if: { $gte: ["$appRevenuePercentage", 1] }, then: 1, else: { $cond: { if: { $gte: ["$appRevenuePercentage", .5] }, then: 1, else: { $cond: { if: { $gte: ["$appRevenuePercentage", .1] }, then: 1, else: 1 } } } } } };

        project2.distanceScore = { $multiply: ["$distanceSlab", 0.35] };
        project2.ratingScore = { $multiply: ["$ratingSlab", 0.05] };
        project2.noOfClientScore = { $multiply: ["$averageNoOfClientsPerDaySlab", { $cond: { if: { $eq: ["$parlorType", 4] }, then: 1, else: 1 } }] };
        project2.appRevenueScore = { $multiply: ["$appDistanceRevenueSlab", { $cond: { if: { $eq: ["$parlorType", 4] }, then: 0.3, else: 0.3 } }] };

        project3.relevanceScore = { $add: ["$distanceScore", "$ratingScore", "$noOfClientScore"] };
        if (localVar.isServer()) match.active = true;
        else match.active = false;
        Parlor.aggregate([{
                $geoNear: {
                    near: { type: "Point", coordinates: [parseFloat(req.query.longitude), parseFloat(req.query.latitude)] },
                    distanceField: "geo.distance",
                    spherical: true,
                    query: match,
                    maxDistance: 100000,
                    distanceMultiplier: 0.001
                }
            },
            {
                $match: match,
            },

            // {
            //     $match : {_id : ObjectId("594a359d9856d3158171ea4f")}
            // },

            {
                $project: project
            },
            {
                $project: project2
            },
            {
                $project: project3
            },
            {
                $sort: sort,
            },
            {
                $skip: ((page - 1) * limit)
            },
            {
                $limit: limit
            }
            /*,
                            {
                                $project : project4
                            }*/
        ]).exec(function(err, parlors) {
            console.log(err)
            return callback(parlors);
        });
    });
};

parlorSchema.statics.parseParlor = function(p) {
    return {
        name: p.name,
        legalEntity: p.legalEntity,
        tax: p.tax,
        centerId: p.centerId,
        address: p.address,
        address2: p.address2,
        ambienceRating : p.ambienceRating,
        appRevenuePercentage : p.appRevenuePercentage,
        revenueDiscountAvailable : p.appRevenuePercentage == 0 ? false : true,
        images: getImageArray(p.images),
        smscode: p.smscode,
        logo: p.logo,
        phoneNumber: p.phoneNumber,
        parlorType: p.parlorType ? p.parlorType : 0,
        link: p.link ? p.link : p.name.toLowerCase(),
        dailyParlorHour: p.dailyParlorHour,
        serviceTaxNumber: p.serviceTaxNumber,
        tinNumber: p.tinNumber,
        latitude: p.latitude,
        longitude: p.longitude,
        gender: p.gender,
        budget: p.budget,
        brands: p.brands,
        openingTime: p.openingTime,
        closingTime: p.closingTime,
        rating: p.rating,
        landmark: p.landmark,
        dayClosed: p.dayClosed,
        thresholdAmount1: p.thresholdAmount1,
        thresholdAmount2: p.thresholdAmount2,
        thresholdAmount3: p.thresholdAmount3,
        thresholdAmount1Commission: p.thresholdAmount1Commission,
        thresholdAmount2Commission: p.thresholdAmount2Commission,
        thresholdAmount3Commission: p.thresholdAmount3Commission,
        serviceCommission: p.serviceCommission,
        discountEndTime: p.discountEndTime,
        productCommission: p.productCommission,
        commissionType: p.commissionType,
        attendanceWorking: p.attendanceWorking,
        panNo: p.panNo,
        bankName: p.bankName,
        branchName: p.branchName,
        bankBeneficiaryName: p.bankBeneficiaryName,
        accountNo: p.accountNo,
        ifscCode: p.ifscCode,
        salonEmailId: p.salonEmailId,
        active: p.active,
        minimumGuarantee: p.minimumGuarantee,
        appDigital: p.appDigital,
        firstAppDigital: p.firstAppDigital,
        firstAppCash: p.firstAppCash,
        onErp: p.onErp,
        maximumRefundOnErp: p.maximumRefundOnErp,
        maximumRefundOnAppCash: p.maximumRefundOnAppCash,
        parlorLiveDate: p.parlorLiveDate,
        refundEffectiveDate: p.refundEffectiveDate,
        refundByOtp: p.refundByOtp,
        appCash: p.appCash,
        breakEven: p.breakEven,
        L1: p.L1,
        L2: p.L2,
        L3: p.L3,
        cityId: p.cityId,
        googleRateLink : p.googleRateLink,
        salonDelayTime : p.salonDelayTime,
        showSalonSupportData : p.showSalonSupportData,
        stateName : p.stateName,
        reLiveOpenDate : p.reLiveOpenDate,
        reLiveCloseDate : p.reLiveCloseDate,
        previousPerDayMg : p.previousPerDayMg,
        threeXModelStartDate: p.threeXModelStartDate,
        modelType : p.modelType,
        modelTypeLiveDate : p.modelTypeLiveDate,
        reverseChargeMultiple : p.reverseChargeMultiple,
    };
};


function getImageArray(images) {
    var more = 5 - images.length;
    for (var i = 0; i < more; i++) {
        // images.push({ imageUrl: "", appImageUrl: "" });
    }
    return images;
};

parlorSchema.statics.review = function(r) {
    return {
        userName: r.client.name,
        appointmentId: r.id,
        userImage: r.review.userImage,
        text: r.review.text,
        reply : r.review.reply ? r.review.reply : "",
        replyDate : r.review.replyDate ? r.review.replyDate : HelperService.addDaysToDate(r.review.createdAt, 2),
        rating: r.review.rating,
        time: HelperService.getTimeFromToday(r.review.createdAt),
        createAt: r.review.createdAt,
    };
};

parlorSchema.statics.employeeReview = function(r, employeeId) {
    let emp = _.filter(r.review.employees, function(e){ return e.employeeId + "" == employeeId})[0]
    let empRating = emp ? emp.rating : r.review.rating
    return {
        userName: r.client.name,
        appointmentId: r.id,
        userImage: r.review.userImage,
        text: r.review.text,
        reply : r.review.reply ? r.review.reply : "",
        replyDate : r.review.replyDate ? r.review.replyDate : HelperService.addDaysToDate(r.review.createdAt, 2),
        rating: empRating,
        time: HelperService.getTimeFromToday(r.review.createdAt),
        createAt: r.review.createdAt,
    };
};

parlorSchema.statics.parseServiceForParlorHome = function(services) {
    var data = [];
    _.forEach(services, function(service) {
        var s = {
            name: service.name,
            gender: service.gender,
            serviceId: service.serviceId,
            prices: [],
            serviceCode: service.serviceCode,
        };
        _.forEach(service.prices, function(p) {
            s.prices.push({
                name: p.name,
                code: p.priceId,
                price: p.price,
                additions: p.additions,
                estimatedTime: p.estimatedTime,
                tax: p.tax,
            });
        });
        data.push(s);
    });
    return data;
};


parlorSchema.statics.serviceReport = function(query, callback) {
    Parlor.findOne(query).exec(function(err, parlor) {
        ServiceCategory.find().exec(function(err, categories) {
            var data = [];
            _.map(categories, function(category) {
                var serviceByCategory = _.filter(parlor.services, { 'categoryId': category._id });
                var services = [];
                _.forEach(serviceByCategory, function(e) {
                    _.forEach(e.prices, function(p) {
                        if (p.employees.length > 0) {
                            services.push({
                                serviceId: p.priceId,
                                name: e.name + " " + p.name,
                                count: 0,
                                revenue: 0,
                                popularEmployee: "",
                                streak1: 0,
                                streak2: 0,
                                streak5: 0,
                                streak10: 0,
                                employees: [],
                                clients: [],
                            });
                        }
                    });
                });
                var cat = { name: category.name, values: services, count: 0, revenue: 0 };
                if (serviceByCategory.length > 0) data.push(cat);
            });

            var query1 = { status: 3, parlorId: query._id };
            if (req.body.startDate) query1.appointmentStartTime = { $gt: req.body.startDate, $lt: req.body.endDate };
            Appointment.find(query1).sort({ appointmentStartTime: -1 }).exec(function(err, appointments) {
                var employeeIds = req.body.employees ? req.body.employees : [];
                _.forEach(appointments, function(appointment) {
                    if (Appointment.empPresent(employeeIds, appointment.employees)) {
                        _.forEach(appointment.services, function(service) {
                            Parlor.populateServices(appointment.createdAt, appointment.client.id, service, data, employeeIds);
                        });
                    }

                });

                _.forEach(data, function(d) {
                    d.values.forEach(function(v) {
                        v.clients.forEach(function(c) {
                            if (c.count < 2) v.streak1++;
                            else if (c.count < 5) v.streak2++;
                            else if (c.count < 10) v.streak5++;
                            else if (c.count >= 10) v.streak10++;
                        });
                    });
                });
                return callback(err, data);
            });
        });
    });
};

parlorSchema.statics.populateServices = function(createdAt, clientId, service, data, employeeIds) {
    _.forEach(data, function(d) {
        _.forEach(d.values, function(v) {
            if (v.serviceId + "" == service.id + "") {
                var considered = false;
                _.forEach(service.employees, function(emp) {
                    if (_.filter(employeeIds, function(e) { return e + "" == emp.employeeId + ""; })[0] && !considered) {
                        d.count += service.quantity;
                        v.count += service.quantity;
                        considered = true;
                    }
                });

                var serviceRevenue = Appointment.serviceFunction(createdAt, service, Appointment.getEmployeeList(employeeIds));
                _.forEach(serviceRevenue.employees, function(e) {
                    v.revenue += e.totalRevenueEmp;
                    d.revenue += e.totalRevenueEmp;
                });

                // v.revenue += service.quantity * service.price;
                var result = false;
                _.forEach(v.employees, function(c) {
                    if (c.employeeId + "" == service.employeeId + "") {
                        result = true;
                        c.count += service.quantity;
                    }
                });
                if (!result) {
                    v.employees.push({ name: service.employee, employeeId: service.employeeId, count: service.quantity });
                }


                var result = false;
                _.forEach(v.clients, function(c) {
                    if (c.clientId + "" == clientId + "") {
                        result = true;
                        c.count++;
                    }
                });
                if (!result) {
                    v.clients.push({ clientId: clientId, count: 1 });
                }

                var emp = _.max(v.employees, function(emp) { return emp.count; });
                v.popularEmployee = emp.name;
            }
        });
    });
};

parlorSchema.statics.getProfitGraphData = function(req, callback) {
    return callback(false, [{
            data: 200,
            '_id': HelperService.getLastWeekStart().toDateString()
        },
        {
            data: 400,
            '_id': HelperService.getLastDayStart().toDateString()
        },
        {
            data: 700,
            '_id': new Date().toDateString()
        },
    ])
};



parlorSchema.statics.reorderItems = function(req, callback) {
    Parlor.findOne({ _id: req.session.parlorId, items: { $where: function() { return (this.quantity < this.minimumQuantity); } } }, function(err, items) {
        items = _.map(items, function(item) { return Parlor.parseInventoryItem(item); });
        return callback(null, items);
    });
};

parlorSchema.statics.getNewParlorObj = function(req) {
    return {
        name: req.body.name,
        address: req.body.address,
        dailyParlorHour: req.body.dailyParlorHour,
        address2: req.body.address2,
        smscode: req.body.smscode,
        logo: req.body.logo,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        geoLocation: [req.body.longitude, req.body.latitude],
        gender: req.body.parlorGender,
        smsRemaining: req.body.smsCredits,
        images: req.body.images,
        cityId: req.body.cityId,
        earlyBirdOfferPresent : false,
        earlyBirdOfferType : 1,
        earlyBirdOfferTypeOneSold : 0,
        modelType : 1,
        modelTypeLiveDate : new Date(),
    };

};

parlorSchema.statics.serviceObject = function(serviceId, serviceName, gender, prices, s, empty, addedBy, employees) {
    var service = {
        name: serviceName,
        gender: gender,
        subTitle: s.subTitle,
        serviceCode: s.serviceCode,
        basePrice: s.basePrice,
        serviceId: serviceId,
        categoryId: s.categoryId,
        prices: []
    };
    var basePrice = 0;
    if (empty) return service;
    _.forEach(s.prices, function(price, key) {
        var newObj = {};
        prices.forEach(function(p, key) {
            if (p.priceId == price.priceId) {
                if (key == 0) {
                    basePrice = p.price;
                    service.basePrice = p.price;
                }
                newObj.priceId = p.priceId;
                newObj.price = key == 0 ? p.price : calculateNewPrice(basePrice, p.percentageDifference);
                newObj.estimatedTime = p.estimatedTime;
                newObj.additions = p.additions;
                newObj.name = price.name;
                newObj.brand = {
                    title: p.brand.title,
                    brands: _.map(p.brand.brands, function(brand) {
                        return {
                            brandId: brand.brandId,
                            ratio: parseFloat(brand.ratio),
                            productTitle: brand.productTitle,
                            name: brand.name,
                            products: _.map(brand.products, function(pro) {
                                return {
                                    productId: pro.productId,
                                    ratio: parseFloat(pro.ratio),
                                    name: pro.name,
                                };
                            }),
                        };
                    }),
                };
                newObj.percentageDifference = p.percentageDifference;
                newObj.addedBy = addedBy;
                newObj.employees = [];
                newObj.tax = p.tax;
                p.employees.forEach(function(emp) {
                    var original = {};
                    employees.forEach(function(originalEmp) {
                        if (originalEmp.userId == emp.userId) original = originalEmp;
                    });
                    if (original.userId) {
                        newObj.employees.push({
                            userId: emp.userId,
                            name: original.name
                        });
                    }
                });
            }
        });
        if (newObj.price && key == 0) service.prices.push(newObj);
        else if (newObj.percentageDifference) service.prices.push(newObj);
    });
    return service;
};

function calculateNewPrice(price, percentage) {
    if (percentage)
        return nearest(parseInt(parseInt(price) + (price * percentage) / 100), 10);
    else return 0;
}

function nearest(n, v) {
    n = n / v;
    n = Math.round(n) * v;
    return n;
}

parlorSchema.statics.createPriceObj = function(obj) {
    return {
        price: obj.price,
        name: obj.name,
        employees: _.map(obj.employees, function(o) { return { id: o.id, isSpecialist: o.isSpecialist }; }),
    };
};

parlorSchema.statics.addPackage = function(req, callback) {
    Parlor.findOne({ _id: req.session.parlorId }, function(err, parlor) {
        var newPackage = Parlor.createPackageObj(req, parlor.services, parlor.packages.length);
        console.log(newPackage);
        Parlor.update({ _id: req.session.parlorId }, { $push: { packages: newPackage } }, function(err, updatedItem) {
            console.log(err);
            return callback(null, newPackage);
        });
    });
};


parlorSchema.statics.updatePackage = function(req, callback) {
    Parlor.findOne({ _id: req.session.parlorId }, function(err, parlor) {
        var newPackage = Parlor.createPackageObj(req, parlor.services, req.body.packageId - 1);
        console.log(newPackage);
        Parlor.update({ _id: req.session.parlorId, 'packages.packageId': req.body.packageId }, { $set: { 'packages.$.name': newPackage.name, 'packages.$.price': newPackage.price, 'packages.$.services': newPackage.services, 'packages.$.updatedAt': new Date() } }, function(err, newItem) {
            return callback(null, newPackage);
        });
    });
};

parlorSchema.statics.updateServiceEmployee = function(req, callback) {
    var hairCategories = ["58707ed90901cc46c44af27b", "58707ed90901cc46c44af27d", "58707ed90901cc46c44af27e", "58707ed90901cc46c44af27c", "58707ed90901cc46c44af27f"];
    var makeupCategories = ["58707ed90901cc46c44af273", "58707ed90901cc46c44af272", "58707ed90901cc46c44af274"];
    console.log(req.body);
    Parlor.findOne({ _id: req.session.parlorId }, function(err, parlor) {
        Admin.findOne({ _id: req.body.employeeId }, function(err, emp) {
            var categoryIds = req.body.otherServices;
            if (req.body.hair && req.body.hair != 3) {
                _.forEach(hairCategories, function(hair) {
                    categoryIds.push(hair)
                })
            };
            if (req.body.makeup && req.body.makeup  != 3) {
                _.forEach(makeupCategories, function(mak) {
                    categoryIds.push(mak)
                })
            };
            Admin.update({ _id: req.body.employeeId }, { hairPost: req.body.hair, makeupPost: req.body.makeup, categoryIds: categoryIds }, function(err, updatedResponse) {
                ServiceCategory.find({ superCategory: { $in: ["Hair", "Makeup", "Makeup Service"] } }, function(err, categories) {
                    parlor.services.forEach(function(s) {
                        s.prices.forEach(function(p) {
                            p.employees = p.employees.filter(function(e) {
                                return e.userId + "" != req.body.employeeId;
                            });
                        });
                    });
                    parlor.services.forEach(function(service) {
                        var present = _.some(req.body.otherServices, function(o) {
                            return o == service.categoryId;
                        });
                        var notUpdated = true;
                        _.forEach(categories, function(category) {
                            if (category.superCategory == "Hair" && category.id == service.categoryId) {
                                if (req.body.hair < service.prices.length) {
                                    service.prices[req.body.hair].employees.push(Parlor.createEmpPriceObj(req, emp));
                                    notUpdated = false;
                                } else if (req.body.hair == 4) {
                                    service.prices.forEach(function(p) {
                                        p.employees.push(Parlor.createEmpPriceObj(req, emp));
                                        notUpdated = false;
                                    });
                                }
                            } else if ((category.superCategory == "Makeup" || category.superCategory == "Makeup Service") && category.id == service.categoryId) {
                                if (req.body.makeup < service.prices.length) {
                                    service.prices[req.body.makeup].employees.push(Parlor.createEmpPriceObj(req, emp));
                                    notUpdated = false;
                                } else if (req.body.hair == 4) {
                                    service.prices.forEach(function(p) {
                                        p.employees.push(Parlor.createEmpPriceObj(req, emp));
                                        notUpdated = false;
                                    });
                                }
                            }
                        });

                        if (present && notUpdated) {
                            service.prices.forEach(function(price) {
                                price.employees.push(Parlor.createEmpPriceObj(req, emp));
                            });
                        }
                    });
                    Parlor.update({ _id: parlor.id }, { services: parlor.services }, function(err, update) {
                        console.log(update);
                        return callback(err, update);
                    });
                });
            });
        });
    });
};

parlorSchema.statics.createEmpPriceObj = function(req, emp) {
    return {
        userId: req.body.employeeId,
        name: emp.firstName + " " + emp.lastName,
        isSpecialist: false,
        commission: 0,
    };
};

parlorSchema.statics.createPackageObj = function(req, services, size) {
    var newPackage = req.body.package;
    var packageServices = [];
    console.log(newPackage.services);
    _.forEach(services, function(s) {
        _.forEach(newPackage.services, function(service) {
            if (service == s.serviceId + "") packageServices.push({ name: s.name, serviceId: s.serviceId });
        });
    });
    return {
        packageId: size + 1,
        name: newPackage.name,
        price: newPackage.price,
        services: packageServices,
        createdAt: new Date(),
        updatedAt: new Date(),
        addedBy: req.session.userId,
    };
};



parlorSchema.statics.parsePackage = function(obj) {
    return {
        packageId: obj.packageId,
        name: obj.name,
        services: obj.services,
        price: obj.price
    };
};


parlorSchema.statics.parsePackage = function(parlorId) {
    Appointment.aggregate([{ $match: { parlorId: ObjectId(parlorId), status: 3, 'review.rating': { $gt: 0 } } },
        { $group: { _id: '$parlorId', rating: { $sum: '$review.rating' }, parlorName: { $first: "$parlorName" }, count: { $sum: 1 } } },
        { $project: { parlorName: 1, count: 1, parlorRating: { $divide: ['$rating', "$count"] } } }
    ], function(err, agg) {
        if (agg && agg.length > 0) {
            var parlorRating = agg[0].parlorRating.toFixed(2);
            Parlor.update({ _id: agg[0].parlorId }, { rating: parlorRating, $inc: { noOfUsersRated: 1 } }, function(err, updated) {
                d.push(updated)
                console.log("updated");
            })
        } else {
            Parlor.update({ _id: par._id }, { rating: 4, $inc: { noOfUsersRated: 1 } }, function(err, updated) {
                d.push(updated)
                console.log("updated");
            })
        }

    })
};


parlorSchema.statics.createParlorNameData = function (parlorId){
     Parlor.aggregate([ {$match : {_id : ObjectId(parlorId)}},
            {$project : {
                _id: 0, 
                parlorId: "$_id", 
                parlorName: "$name", 
                parlorAddress1: "$address", 
                parlorAddress2 :"$address2", 
                geoLocation: 1, 
                tax:1, 
                active: 1, 
                parlorType: 1, 
                latitude: 1, 
                longitude: 1, 
                cityId: 1
            }
        }], function(err, parlor){
            ParlorNameData.create(parlor[0] , function(err , created){
                console.log('parlor name data created')
            })
        });
}

parlorSchema.statics.createPaymentLink = function(amount, name , callback){
    var request = require('request');
    var RAZORPAY_KEY = localVar.getRazorKey();
    var RAZORPAY_APP_SECRET = localVar.getRazorAppSecret();
    var Razorpay = require('razorpay');
    var instance = new Razorpay({
        key_id: RAZORPAY_KEY,
        key_secret: RAZORPAY_APP_SECRET
    })

    var reqObj = {
        "customer": {
            "name": "name"
        },
        "type": "link",
        "amount": amount * 100,
        "currency": "INR",
        "description": "Royalty Amount",
    };
    instance.invoices.create(reqObj, function(error, response) {

        var invoiceId = response.id;
        var paymentUrl = response.short_url;

        return callback(paymentUrl);
    });
}

//  on every save, add the date
parlorSchema.pre('save', function(next) {
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

var Parlor = mongoose.model('parlor', parlorSchema);

// make this available to our users in our Node applications
module.exports = Parlor;