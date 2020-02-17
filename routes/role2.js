'use strict'

var express = require('express');
var router = express.Router();
var request = require('request');
var mongoose = require('mongoose');
var async = require('async');
var twitterAPI = require('node-twitter-api');
var CryptoJS = require("crypto-js");
var TW_BASE_URL = 'https://api.twitter.com';
var FB_BASE_URL = 'https://graph.facebook.com';
var FB_AUTH_URL = 'https://www.facebook.com/dialog/oauth?';
var REDIRECT_URI = 'http://localhost:1337/role2/facebook/authResponse';
var TOKEN_URI = 'https://graph.facebook.com/v2.3/oauth/access_token?';
var ACCESS_TOKEN = "";
var TOKEN_VALIDITY = 0;
var CLIENT_ID = '1094584120619064';
var CLIENT_SECRET = '47cd16cf65bda307986d0b636d58e1e4';
var TW_CONSUMER_KEY = "h9jgKQeKzMDCVj68K148NcVoL";
var TW_CONSUMER_SECRET = "PyCQA9NouV8rY3daIvcTmIxu2vCqb7CYb0ge46hs1hhoqOpw8O";
var TW_REQUEST_TOKEN = "";
var TW_REQUEST_SECRET = "";
var TW_OAUTH_TOKEN = "";
var TW_OAUTH_VERIFIER = "";
var TW_ACCESS_TOKEN = "";
var TW_ACCESSTOKEN_SECRET = "";

/** Facebook **/

router.get('/facebook/consent', function(req, res) {
    res.redirect(FB_AUTH_URL + 'client_id=' + CLIENT_ID + '&redirect_uri=' + REDIRECT_URI + '&scope=manage_pages,publish_pages,pages_show_list&response_type=code&state=jenit');
});



router.post('/parlorChair', function(req, res) {
    ParlorChair.findOne({ parlorId: req.body.parlorId }, function(er, d) {
        if (d) {
            ParlorChair.update({ parlorId: req.body.parlorId }, { chairsPosition: req.body.chairsPosition }, function(er, d) {
                return res.json(CreateObjService.response(false, "Updated"));
            });
        } else {
            ParlorChair.create({ parlorId: req.body.parlorId, chairsPosition: req.body.chairsPosition }, function(er, d) {
                console.log(er);
                return res.json(CreateObjService.response(false, "Done"));
            });
        }
    });
});

router.get('/userForMarketing', function(req, res){
    if(req.query.customerType == 1){
        User.getUsersForMarketing(req, function(users){
            return res.json(CreateObjService.response(false, {count : users.length, phoneNumbers : users}));
        })
    }else{
        console.log("here");
        AggregateService.customersNoShow3MonthsByParlor(req, function(results) {
            var users = _.map(results, function(r){return {phoneNumber : r.phoneNumber}});
            return res.json(CreateObjService.response(false, {count : users.length, phoneNumbers : users}));
        });
    }
});

router.get('/salonRecommendations', function(req, res){
    var data = [];
    var query = {active : true};
    if(!req.query.allParlors)query._id = req.query.parlorId;
    Parlor.find(query, {name : 1, address : 1}, function(er, parlors){
        Async.each(parlors, function(parlor, callback) {
            AggregateService.parlorRecommendation(parlor.id, function(result) {
                data.push({
                    name : parlor.name,
                    address : parlor.address,
                    data : req.query.allParlors ? result.otherReports : result,
                });
                callback();
            }, parlor)
        }, function allTaskCompleted() {
            return res.json(data);
        });
    });
});

router.post('/getSignUpSettlementInvoice' , function(req , res) {
    SignupYearlyInvoice.find({parlorId : req.body.parlorId}, function(err, data){
        res.json(data)
    });
});

router.get('/smsCountRemaining', function(req, res){
    var currentMonthStart = HelperService.getCurrentMonthStart(new Date());
    SalonCouponSms.find({parlorId : req.session.parlorId , createdAt : {$gte : currentMonthStart , $lte : new Date()}}).count(function(err, count){
            return res.json(CreateObjService.response(false, {smsCrediteleft : 1000 - count }));
    })
});

router.get("/salonKpiForApp", function(req, res){
    Parlor.getReportForApp(ObjectId(req.session.parlorId), function(data){
        return res.json(CreateObjService.response(false, data));
    });
});

router.get("/subscriberReportLastMonth", function(req, res){
    Parlor.subscriberReportLastMonth(ObjectId(req.session.parlorId), function(data){
        return res.json(CreateObjService.response(false, data));
    });
});

router.get('/parlorServiceByCategoryIds', function(req, res, next) {
    Parlor.aggregate([
        {
            $match : {
                _id : ObjectId(req.query.parlorId)
            }
        },
        {
            $unwind : "$services"
        },
        {
            $project : {
                "services.categoryId" : 1
            }
        },
        {
            $group : {
                _id : "$services.categoryId",
                categoryId : {$first : "$services.categoryId"}
            }
        }
    ]).exec(function(err, data){
            var categoryIds = _.map(data, function(d){return d.categoryId});
            ApiHelperService.getServiceByCategory(req, categoryIds, function(categories){
                return res.json(CreateObjService.response(false, categories));
            });
        });
    
});

router.post('/redeemNearBySubscription', function(req, res) {
    Offer.findOne({ code: req.body.couponCode, active: true }, function(err, offer) {
        console.log(req.body.couponCode);
        if (offer.offerType == "subscription") {
            User.findOne({ phoneNumber: req.body.phoneNumber }, function(err, user) {
                if (user) {
                    Appointment.addSubscriptionToUser(null, user.id, user.createdAt, { id: "nearby" + req.body.couponCode }, offer.discountAmount, null, 'nearbuy',  function(r) {
                        Offer.update({ code: req.body.couponCode, active: true }, { active: false }, function(err, offer) {
                            return res.json(CreateObjService.response(false, 'Done'));
                        });
                    });
                } else {
                    var newUser = User.getUserObj2(req);
                    User.find().count(function(err, count) {
                        newUser.customerId = ++count;
                        User.create(newUser, function(err, newUser) {
                            if (err) return res.json(CreateObjService.response(false, 'Form Validation!'));
                            else {
                                Appointment.addSubscriptionToUser(null, newUser.id, newUser.createdAt, { id: "nearby" + req.body.couponCode }, offer.discountAmount, null, 'nearbuy',function(r) {
                                    Offer.update({ code: req.body.couponCode, active: true }, { active: false }, function(err, offer) {
                                        return res.json(CreateObjService.response(false, 'Done'));
                                    });
                                });
                            }
                        });
                    });
                }
            });
        } else {
            return res.json(CreateObjService.response(true, 'Invalid Coupon'));
        }
    })

});

router.get('/report/subscriberCountRevenue', function(req, res) {
    let parlorId = req.query.parlorId;
    if(!parlorId)parlorId = req.session.parlorId;
    Async.parallel([
        function(callback) {
            AggregateService.monthWiseSubscriptionSoldBySalon(parlorId, function(result) {
                callback(null, result);
            });
        },
        function(callback) {
            AggregateService.noOfActiveVisitsRevenueOfSubscriber(parlorId, function(result) {
                callback(null, result);
            });
        }
    ],
    function(err, results) {
        res.json(AggregateService.parseResultForSubscriberCountRevenueSalon(results));
    });
});

router.get('/report/customersNoShow3MonthsByParlor', function(req, res, next) {
    AggregateService.customersNoShow3MonthsByParlor(req, function(results) {
        res.json(results);
    });
});


router.get('/parlorReviews', function(req, res, next) {
     var page = req.query.page || 1;
    var perPage = 15;
    var query = { parlorId: req.session.parlorId, review: { $ne: null }, 'review.rating': { $lte: 3 } };
    Appointment.find(query).sort({ $natural: -1 }).limit(perPage).skip(perPage * (page - 1)).exec(function(err, data) {
        if (data) {
            return res.json(CreateObjService.response(false, _.map(data, function(r) { return Parlor.review(r); })));
        } else {
            return res.json(CreateObjService.response(true, 'Parlor id invalid'));
        }
    });
});

router.get('/replyReview', function(req, res, next) {
    console.log("params",req.query.appointmentId,req.query.reply)
    Appointment.update({_id : req.query.appointmentId}, {"review.reply" : req.query.reply, "review.replyDate" : new Date()}, function(er, f){
        return res.json(CreateObjService.response(false, 'Done'));
    });
});

router.post('/allParlors', function(req, res) {
    Admin.findOne({_id : req.session.userId}, {parlorIds : 1}, function(er, owner){
        Parlor.find({_id : {$in : owner.parlorIds}, active : true}, {name : 1, address : 1, address2 : 1}, function(er, parlors){
            var data = _.map(parlors, function( p){
                return{
                    parlorId : p.id,
                    name : p.name,
                    address1 : p.address,
                    address2 : p.address2,
                }
            });
            return res.json(CreateObjService.response(false, data));
        });
    });
});

router.post('/report/branchReport', function(req, res) {
    console.log("branch report")

    var startDate = req.body.startDate;
    var endDate = req.body.endDate;
    var d = [];
    // var parlorIds = req.body.parlorIds ? req.body.parlorIds : [];
    // var query = { _id: { $in: parlorIds } };
    // if (parlorIds.length == 0) query = {};
    var todayDate = new Date()
    var query = { active: req.body.active };
    var async = require('async');
    Admin.findOne({_id : req.session.userId}, {parlorIds : 1}, function(er, owner){
        query._id = {$in : owner.parlorIds};
        Parlor.find(query, { _id: 1, name: 1, address2: 1, parlorLiveDate: 1 }).sort({ parlorLiveDate: 1 }).exec(function(err, parlors) {
            async.parallel([
                function(done) {
                    async.each(parlors, function(parlor, callback) {
                        console.log(parlor.name);
                        Appointment.monthlyReport(parlor, startDate, endDate, function(err, data) {
                            data.parlorLiveDate = parlor.parlorLiveDate ? parlor.parlorLiveDate : todayDate;
                            d.push(data);
                            console.log("getting data success for " + parlor.name);
                            callback();
                        })
                    }, done);
                }
            ], function allTaskCompleted() {
                console.log('done');
                return res.json(d);
            });
        });
    });
});


router.post('/report/monthlyVitalReport', function(req, res) {
    console.log(req.body)
    var startDate = req.body.startDate;
    var endDate = req.body.endDate;
    var d = [];
    // var parlorIds = req.body.parlorIds ? req.body.parlorIds : [];
    // var query = { _id: { $in: parlorIds } };
    // if (parlorIds.length == 0) query = { active: true };
    // var async = require('async');
    // Parlor.find(query, function(err, parlors) {
    var todayDate = new Date();
    var query = { active: req.body.active };
    var async = require('async');
    Admin.findOne({_id : req.session.userId}, {parlorIds : 1}, function(er, owner){
    query._id = {$in : owner.parlorIds};
        Parlor.find(query).sort({ parlorLiveDate: 1 }).exec(function(err, parlors) {
            async.parallel([
                function(done) {
                    async.each(parlors, function(parlor,
                        callback) {
                        Appointment.monthlyVitalReport(parlor, startDate, endDate, function(err, data) {
                            data.parlorLiveDate = parlor.parlorLiveDate ? parlor.parlorLiveDate : todayDate;
                            d.push(data);
                            console.log("getting data success for " + parlor.name);
                            callback();
                        })
                    }, done);
                }
            ], function allTaskCompleted() {
                console.log('done');
                return res.json(d);
            });
        });
    });

});

router.get('/report/employeeRepeatCustomerReport', function(req, res, next) {
    Admin.find({parlorId : req.session.parlorId, active : true}, {firstName : 1}, function(err, owners){
        var data = [];
        Async.each(owners, function(owner, callback){
            Appointment.aggregate([
                {
                    $match : {
                        parlorId : ObjectId(req.session.parlorId),
                        status : 3, 
                        "employees.employeeId" : ObjectId(owner.id),
                        appointmentStartTime : {$gt : new Date(2018, 6, 1), $lt : new Date(2018, 8, 1)} 
                    } 
                },
                {
                    $group : 
                        {
                            _id : "$client.id", 
                            clientId : {$first: "$client.id"},
                        }
                }
                ]).exec(function(er, clientIds){
                    let cids = _.map(clientIds, function(c){return ObjectId(c.clientId)});
                    Appointment.aggregate([
                        {
                            $match : {
                                parlorId : ObjectId(req.session.parlorId),
                                status : 3, 
                                "client.id" : {$in : cids},
                                appointmentStartTime : {$gt : new Date(2018, 8, 1)} 
                            } 
                        },
                        {
                            $group : 
                                {
                                    _id : "$client.id", 
                                    clientId : {$first: "$client.id"},
                                }
                        }
                        ]).exec(function(er, clientIds2){
                            var repeatCustomerCounts = clientIds2.length;
                            data.push({
                                name : owner.firstName,
                                employeeId : owner.id,
                                repeatCustomerCounts : clientIds2.length,
                                oldCustomerCounts : clientIds.length
                            });
                            callback();
                    });
            });
        }, function allTaskCompleted(c){
            res.json(data);
        });
    });
});


router.get('/report/clientFirstAppointmentAndSubscriptionBuyDate', function(req, res) {
    let parlorId = req.query.parlorId;
    if(!parlorId)parlorId = req.session.parlorId;
    Async.parallel([
        function(callback) {
            AggregateService.clientFirstAppointment(parlorId, function(result) {
                callback(null, result);
            });
        },
        function(callback) {
            AggregateService.clientSubscriptionBuyDate(parlorId, function(result) {
                callback(null, result);
            });
        }
    ],
    function(err, results) {
        res.json(AggregateService.parseClientFirstAppointmentAndSubscriptionBuyDate(results));
        // res.json(results);
    });
});


router.post('/changeAppointmentChair', function(req, res) {
    res.json(CreateObjService.response(false, 'Done'));
});

router.post('/createDealJpeg', function(req, res) {
    CreateDealJpeg.findOne({ parlorId: req.session.parlorId }, function(err, d) {
        if (!d) {
            CreateDealJpeg.create({ data: req.body.data, parlorId: req.session.parlorId }, function(err, d) {
                return res.json(d);
            });
        } else {
            CreateDealJpeg.update({ parlorId: req.session.parlorId }, { data: req.body.data }, function(err, d) {
                return res.json(d);
            });
        }

    });
});

router.post('/settlementInvoice', function(req, res) {
    var data = {
        parlorName: "",
        parlorAddress: "",
        legalEntity: "",
        panNo: "",
        bankName: "",
        branchName: "",
        accountNo: "",
        ifscCode: "",
        startDate: "",
        endDate: "",
        serviceTax: 0,
        sbcTax: 0,
        kkcTax: 0,
        totalAmount: 0,
        invoiceNo: ""
    };
    if (req.body.invoiceType == "beu") {
        SettlementReport.findOne({ period: req.body.period, parlorId: req.session.parlorId }, {
            parlorId: 1,
            period: 1,
            startDate: 1,
            endDate: 1,
            amountPayableToBeuAfterDiscount: 1,
            totalCollectionByBeu: 1,
            invoiceId: 1
        }, function(err, settle) {
            Parlor.findOne({ _id: settle.parlorId }, {
                accountDetails: 1,
                name: 1,
                address: 1,
                panNo: 1,
                bankName: 1,
                branchName: 1,
                accountNo: 1,
                ifscCode: 1,
                legalEntity: 1
            }).exec(function(err, parlor) {
                data.parlorName = parlor.name,
                    data.parlorAddress = parlor.address,
                    data.legalEntity = parlor.legalEntity,
                    data.panNo = parlor.panNo,
                    data.bankName = parlor.bankName,
                    data.branchName = parlor.branchName,
                    data.accountNo = parlor.accountNo,
                    data.ifscCode = parlor.ifscCode,
                    data.startDate = settle.startDate,
                    data.endDate = settle.endDate,
                    data.serviceTax = settle.amountPayableToBeuAfterDiscount * 0.14,
                    data.sbcTax = settle.amountPayableToBeuAfterDiscount * 0.005,
                    data.kkcTax = settle.amountPayableToBeuAfterDiscount * 0.005,
                    data.totalAmount = settle.amountPayableToBeuAfterDiscount,
                    data.invoiceNo = "BEU" + settle.invoiceId;

                return res.json(CreateObjService.response(true, data));
            })

        })
    } else if (req.body.invoiceType == "salon") {
        SettlementReport.findOne({ period: req.body.period, parlorId: req.session.parlorId }, {
            parlorId: 1,
            period: 1,
            startDate: 1,
            endDate: 1,
            amountPayableToBeuAfterDiscount: 1,
            totalCollectionByBeu: 1,
            invoiceId: 1
        }, function(err, settle) {
            Parlor.findOne({ _id: settle.parlorId }, {
                accountDetails: 1,
                name: 1,
                address: 1,
                panNo: 1,
                bankName: 1,
                branchName: 1,
                accountNo: 1,
                ifscCode: 1,
                legalEntity: 1
            }).exec(function(err, parlor) {
                var str = parlor.name,
                    inv = str.substring(0, 2);
                data.parlorName = parlor.name,
                    data.parlorAddress = parlor.address,
                    data.panNo = parlor.panNo,
                    data.bankName = parlor.bankName,
                    data.legalEntity = parlor.legalEntity,
                    data.branchName = parlor.branchName,
                    data.accountNo = parlor.accountNo,
                    data.ifscCode = parlor.ifscCode,
                    data.startDate = settle.startDate,
                    data.endDate = settle.endDate,
                    data.serviceTax = settle.amountPayableToBeuAfterDiscount * 0.14,
                    data.sbcTax = settle.amountPayableToBeuAfterDiscount * 0.005,
                    data.kkcTax = settle.amountPayableToBeuAfterDiscount * 0.005,
                    data.totalAmount = settle.amountPayableToBeuAfterDiscount,
                    data.invoiceNo = inv.toUpperCase() + settle.invoiceId.toString();

                return res.json(CreateObjService.response(true, data));
            })

        })
    }
});


router.get('/reGenerateReport', function(req, res) {
    SettlementReport.findOne({ _id: req.query.settlementId }, function(err, settlementReport) {
        if (settlementReport) {
            SettlementReport.remove({ _id: req.query.settlementId }, function(err, data) {
                Parlor.createSettlementReportv2(settlementReport.startDate, settlementReport.endDate, settlementReport.period, { _id: settlementReport.parlorId }, function(err, data) {
                    console.log(data)
                    res.json(data);
                });
            });
        } else {
            res.json('Invalid');
        }
    });

});

router.post('/getSettlementAppointments', function(req, res) {
    SettlementReport.find({ parlorId: req.session.parlorId, period: req.body.period }, {
        startDate: 1,
        endDate: 1
    }).exec(function(err, settle) {
        Appointment.find({
            parlorId: req.session.parlorId,
            appointmentStartTime: { $gte: settle[0].startDate, $lt: settle[0].endDate },
            status: 3
        }, function(err, appt) {
            return res.json(CreateObjService.response(false, Appointment.parseArray(appt)));
        })
    })
})

router.get('/createDealJpeg', function(req, res) {
    Parlor.findOne({ _id: req.session.parlorId }, { parlorType: 1 }, function(err, parlor) {
        CreateDealJpeg.findOne({ parlorId: req.session.parlorId }, function(err, d) {
            d.parlorType = parlor.parlorType;
            return res.json(JSON.parse(d.data));
        });
    });
});

router.get('/settlementReport', function(req, res) {

    console.log(req.query);

    var parlorId = req.query.parlorId;
    var date = new Date(req.query.date)
    var startDate = new Date(date.getFullYear(), parseInt(date.getMonth()), 1);
    var endDate = new Date(date.getFullYear(), parseInt(date.getMonth() + 1), 1);

    SettlementReport.find({ "parlorId": parlorId, "startDate": { $gte: startDate, $lt: endDate } }, function(err, data) {

        console.log("data is :");
        console.log(data);

        return res.json(CreateObjService.response(false, data));
    });
});


router.get('/membership', function(req, res) {
    Parlor.findOne({_id : req.session.parlorId}, {name : 1}, function(er, parlor){
        var query = { active: false };
        let isMonsoon = parlor.name.indexOf("Monsoon") !=-1 ? true : false;
        if(parlor.id + "" == "594cdd793c61904155d48595")isMonsoon = true
        if(isMonsoon){
            query.$or = [ { isForMonsoonOnly : true }, { isForAll : true } ]
        }else{
            query.$or = [ { isForMonsoonOnly : false }, { isForAll : true } ]
        }
        Membership.find(query, function(err, data) {
            if (err) {
                return res.json(CreateObjService.response(true, 'Error in getting memberships'));
            } else
                return res.json(CreateObjService.response(false, _.map(data, function(d) {
                    return Membership.parse(d);
                })));
        });
    })
});

router.get('/deals', function(req, res) {
    Deals.find({ parlorId: req.session.parlorId, active: 1 }).sort('sort').exec(function(err, data) {
        if (err) {
            return res.json(CreateObjService.response(true, 'Error in getting deals'));
        } else
            return res.json(CreateObjService.response(false, _.map(data, function(d) {
                return Deals.parse(d);
            })));
    });
});


router.get('/updateServicePriceId', function(req, res) {
    var priceId = 1000;
    var serviceCodes = [412, 413, 414, 415, 420, 421, 378, 379, 393, 392, 382, 383, 388, 389, 409, 384, 385, 386, 387, 429, 430, 431, 432, 410, 411, 433, 434, 436, 437, 438, 439, 440, 441, 442, 443, 425, 426, 427, 428];
    _.forEach(serviceCodes, function(serviceCode) {
        Service.findOne({ serviceCode: serviceCode }, function(err, service) {
            _.forEach(service.prices, function(price) {
                ++priceId;
                price.priceId = priceId;
            });
            service.save(function(err) {});
        });
    });
});

router.get('/updateServiceParlorPriceId', function(req, res) {
    var serviceCodes = [412, 413, 414, 415, 420, 421, 378, 379, 393, 392, 382, 383, 388, 389, 409, 384, 385, 386, 387, 429, 430, 431, 432, 410, 411, 433, 434, 436, 437, 438, 439, 440, 441, 442, 443, 425, 426, 427, 428];
    Service.find({ serviceCode: { $in: serviceCodes } }, function(err, services) {
        Parlor.find({ 'services.serviceCode': { $in: serviceCodes } }, function(err, parlors) {
            _.forEach(parlors, function(p) {
                _.forEach(services, function(service) {
                    _.forEach(p.services, function(parlorService) {
                        if (parlorService.serviceCode == service.serviceCode) {
                            _.forEach(parlorService.prices, function(price, key) {
                                price.priceId = service.prices[key].priceId;
                            });
                        }
                    });
                    Parlor.update({ _id: p.id }, { services: p.services }, function(err, d) {});
                });
            });
        });
    });
});

// router.get('/updateTax', function(req, res) {
//     Parlor.find({}, function(err, parlors){
//         _.forEach(parlors, function(par){
//                 Parlor.findOne({_id : par.id}, function(err, p){
//                 _.forEach(p.services, function(ser){
//                     _.forEach(ser.prices, function(price){
//                             console.log(price);
//                             price.tax = 15;
//                     });
//                 });
//                 p.save(function (err, u) {
//                     console.log("tax updated for " + p.name);
//                     console.log(err);
//                 });
//             });
//         });
//     });
// });

/*router.get('/updateparlorpriceid', function(req, res) {
 Service.find({}, function(err, services){
 Parlor.find({}, function(err, parlors){
 _.forEach(parlors, function(par){
 Parlor.findOne({_id : par.id}, function(err, parlor){
 _.forEach(services, function(ser){
 _.forEach(parlor.services, function(parlorService){
 if(parlorService.serviceCode == ser.serviceCode){
 _.forEach(parlorService.prices, function(p, key){
 if(p.priceId == 377){
 console.log("found");
 p.priceId = ser.prices[key].priceId;
 }
 });
 }
 });
 });
 Parlor.update({_id : par.id}, {services : parlor.services}, function(err, update){
 console.log('saved');
 console.log(err);
 console.log(update);
 });

 });
 });
 });
 });
 });
 */
/*router.get('/updateparlorpricelength', function(req, res) {
 Parlor.find({}, function(err, parlors){
 _.forEach(parlors, function(par){
 Parlor.findOne({_id : par.id}, function(err, parlor){
 _.forEach(parlor.services, function(service){
 _.forEach(service.prices, function(price){
 _.forEach(price.additions, function(a){
 _.forEach(a.types, function(type, k){
 type.percentageDifference =  type.percentageDifference * 10 ;
 if(type.percentageDifference == 0) type.additions = 0;
 else
 type.additions = calculateNewPrice(service.basePrice, type.percentageDifference) - service.basePrice;
 });
 });
 });
 });
 Parlor.update({_id : parlor.id}, {services : parlor.services}, function(err, o){
 console.log(o);
 return res.json(o);
 });
 });
 });
 });
 });
 */

router.get('/updateAdditions', function(req, res) {
    Parlor.findOne({ _id: '587088445c63a33c0af62727' }, function(err, parlor) {
        var async = require('async');
        async.series([
            function(done) {
                async.each(parlor.services, function(service, callback) {
                    Service.findOne({ serviceCode: service.serviceCode }, function(err, s) {
                        if (service.prices[0].additions.length > 0) {
                            var data = [];
                            _.forEach(service.prices[0].additions, function(add) {
                                data.push({ name: add.name, types: [] });
                                _.forEach(add.types, function(type) {
                                    data[0].types.push(type.name);
                                });
                            });
                            _.forEach(s.prices, function(ser) {
                                ser.additions = data;
                            });
                            s.save(function(err, u) {
                                callback();
                            });
                        } else callback();
                    });
                }, done);
            },
        ], function allTaskCompleted() {
            return res.json({ status: "done" });
        });

    });
});

function calculateNewPrice(price, percentage) {
    return nearest(parseInt((price * percentage) / 100), 50);
}

function nearest(n, v) {
    n = n / v;
    n = Math.round(n) * v;
    return n;
}

router.get('/updatedeals', function(req, res) {
    Deals.update({}, { tax: 15 }, { multi: true }, function(err, data) {
        return res.json(err, data);
    });
});

router.get('/resetUser', function(req, res) {
    User.update({ phoneNumber: '9695748822' }, {
        activeMembership: [],
        loyalityPoints: 10000,
        freeServices: [],
        advanceCredits: 10000,
        credits: 0,
        creditsHistory: []
    }, function(err, d) {
        return res.json(d);
    });
});

router.get('/resetAppointment', function(req, res) {
    Appointment.remove({ _id: '58578f2f481574b36ca26719' }, function(err, m) {
        return res.json(m);
    });
});


router.get('/resetAppointment', function(req, res) {
    Appointment.update({ parlorId: req.session.parlorId }, { status: 2 }, function(err, d) {
        return res.json(d);
    });
});

router.get('/updateparlorService', function(req, res) {
    Parlor.findOne({ _id: "588338df51cbc72b34ddba2e" }, function(err, parlor) {
        var services = parlor.services;
        _.forEach(services, function(s) {
            _.forEach(s.prices, function(p) {
                p.employees = [];
            });
        });
        Parlor.update({ _id: { $in: ["58cb9545cfd3553fa1d0dc68"] } }, { services: services }, { multi: true }, function(err, data) {
            return res.json(data);
        });
    });
});


router.get('/updateparlordeals', function(req, res) {
    var dealsToBeUpdatedParlorId = "58ca7349def56f322e3f8eae";
    Deals.find({ parlorId: "588338df51cbc72b34ddba2e" }, function(err, deals) {
        var data = [];
        _.forEach(deals, function(s) {
            data.push({
                name: s.name,
                description: s.description,
                menuPrice: s.menuPrice,
                category: s.category,
                dealId: s.dealId,
                sort: s.sort,
                dealPrice: s.dealPrice,
                dealPercentage: s.dealPercentage,
                startDate: s.startDate,
                endDate: s.endDate,
                hours: s.hours,
                gender: s.gender, // WM - unisex , M - male, F - female
                tax: s.tax,
                weekDay: s.weekDay, // 1- all days, 2 = weekday , 3 = weekend
                dealType: s.dealType,
                couponCode: s.couponCode,
                parlorId: dealsToBeUpdatedParlorId,
                services: s.services,
                active: 1,
            });
        });
        Deals.create(data, function(err, d) {
            return res.json(d);
        });
    });
});


router.get('/deleteServiceFromParlor', function(req, res) {
    Parlor.update({}, { services: [] }, function(err, data) {
        return res.json(data);
    });
});


router.get('/facebookpages', function(req, res) {
    Admin.findOne({ _id: req.session.userId }, function(err, data) {
        Admin.update({ _id: req.session.userId }, { pages: [] }, function(argument) {
            return res.json(CreateObjService.response(false, data.pages));
        })
    });
});

router.get('/updateid', function(req, res) {
    Admin.find({}, function(err, data) {
        data.forEach(function(d, key) {
            var user = {
                firstName: d.firstName,
                lastName: d.lastName,
                emailId: d.emailId,
                phoneNumber: d.phoneNumber,
                password: d.password,
                gender: d.gender,
                breakHr: d.breakHr,
                age: d.age,
                parlorId: d.parlorId,
                parlorIds: d.parlorIds,
                salary: d.salary,
                role: d.role,
                active: d.active,
                position: d.position,
                services: d.services,
                type: d.type,
                commission: d.commission,
                employeeFixedCommission: d.employeeFixedCommission,
                joiningDate: d.joiningDate,
                streetLine1: d.streetLine1,
                streetLine2: d.streetLine2,
                city: d.city,
            };
            Owner.create(user, function(err, data) {

            });
        });
    });
});

router.get('/facebook/authResponse', function(req, res) {
    if (req.query.access_token) {
        receivedAccessToken(req.query);
    } else {
        var code = req.query.code;
        request.get(TOKEN_URI + 'redirect_uri=' + REDIRECT_URI + '&code=' + code + '&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET,
            function(error, response, body) {
                var access_token = JSON.parse(body).access_token || undefined;
                if (!error && response.statusCode == 200 && access_token) {
                    return retrieve_pages(access_token);
                } else {
                    res.json({
                        status: 'failure',
                        error: 'Status Code:' + response.statusCode,
                        error_desc: JSON.parse(body)
                    });
                }

                function retrieve_pages(access_token) {
                    request.get(FB_BASE_URL + '/me/accounts?access_token=' + access_token, function(error, response, body) {
                        var pages = JSON.parse(body);
                        Admin.update({ _id: req.session.userId }, { pages: pages }, function(err, data) {
                            return res.redirect('/crm');
                        });
                    });
                }
            });
    }
});

router.get('/facebook/checkLoggedin', function(req, res) {
    Admin.findOne({ _id: req.session.userId }, function(err, user) {
        if (!user.facebookPageToken || user.facebookPageToken == "") return res.json(CreateObjService.response(false, 'Login Required'));
        else return res.json(CreateObjService.response(true, 'Login not Required'));
    });
    /*Admin.update({_id : req.session.userId}, {facebookPageToken : ""}, function(err, user){
     console.log(user);

     });*/
});

router.post('/facebook/pageDetails', function(req, res) {
    var pageName = req.body.name;
    var pageId = req.body.id;
    var pageToken = req.body.access_token;
    Admin.update({ _id: req.session.userId }, {

        facebookPageId: pageId,
        facebookPageName: pageName,
        facebookPageToken: pageToken
    }, function(err, admin) {
        if (err) return res.json(CreateObjService.response(true, 'Please try again!'));
        else {
            return res.json(CreateObjService.response(false, 'success'));
        }
    });
});

router.post('/facebook/postContent', function(req, res) {
    var content = req.body.content;
    var userId = req.session.userId;

    Admin.findOne({ _id: userId }, function(err, admin) {
        if (err) return res.json(CreateObjService.response(true, 'Please try again!'));
        else {
            var pageId = admin.facebookPageId;
            var pageToken = admin.facebookPageToken;
            request.post(FB_BASE_URL + '/' + pageId + '/feed?message=' + content + '&access_token=' + pageToken,
                function(error, response, body) {
                    var resp = JSON.parse(body);
                    res.json(resp);
                });
        }
    })
});

/** Twitter **/
var twitter = new twitterAPI({
    consumerKey: TW_CONSUMER_KEY,
    consumerSecret: TW_CONSUMER_SECRET,
    callback: 'http://127.0.0.1:1337/role2/twitter/authResponse'
});

router.get('/twitter/consent', function(req, res) {
    twitter.getRequestToken(function(error, requestToken, requestTokenSecret, results) {
        if (error) {
            console.log("Error getting OAuth request token : " + error);
        } else {
            TW_REQUEST_TOKEN = requestToken;
            TW_REQUEST_SECRET = requestTokenSecret;
            res.redirect("https://twitter.com/oauth/authenticate?oauth_token=" + TW_REQUEST_TOKEN);
        }
    });
});

router.get('/twitter/authResponse', function(req, res) {
    if (req.query.oauth_token) {
        TW_OAUTH_TOKEN = req.query.oauth_token;
        TW_OAUTH_VERIFIER = req.query.oauth_verifier;
        twitter.getAccessToken(TW_REQUEST_TOKEN, TW_REQUEST_SECRET, TW_OAUTH_VERIFIER, function(error, accessToken, accessTokenSecret, results) {
            if (error) {} else {
                TW_ACCESS_TOKEN = accessToken;
                TW_ACCESSTOKEN_SECRET = accessTokenSecret;

                //TODO : replace user id with session.req.userId below
                Admin.update({ _id: '5781aafe4e850d253b103c75' }, {
                    '$set': {
                        twitterAccessToken: TW_ACCESS_TOKEN,
                        twitterSecret: TW_ACCESSTOKEN_SECRET
                    }
                }, function(err, admin) {
                    if (err) res.send("error");
                    else res.send("Access token updated !");
                });
            }
        });
    }
});

router.post('/twitter/postContent', function(req, res) {
    var userId = req.body.userId;
    var content = req.body.content;
    Admin.findOne({ _id: userId }, function(err, admin) {
        var accessToken = admin.twitterAccessToken;
        var accessTokenSecret = admin.twitterSecret;
        twitter.statuses("update", {
                status: content
            },
            accessToken,
            accessTokenSecret,
            function(error, data, response) {
                if (error) return res.json(CreateObjService.response(true, error));
                else return res.json(CreateObjService.response(false, data));
            });
    });
});

router.get('/changeAppointmentStatus', function(req, res) {
    Appointment.update({ parlorId: req.session.parlorId, _id: req.query.appointmentId }, { status: 4 }, function(err, d) {
        ParlorService.sendCheckInNotification(req.query.appointmentId)
        Appointment.findOne({ _id: req.query.appointmentId }, function(err, appt) {
            return res.json(CreateObjService.response(false, 'Successfully Changed'));
        });
    });
});


router.post('/createTeamMember', function(req, res) {
    Admin.getUserObj(req, function(user) {
        console.log(user);
        if (user) {
            Admin.create(user, function(err, newUser) {
                console.log(err);
                if (err) return res.json(CreateObjService.response(true, 'Form Validation!'));
                else {
                    Admin.find({ parlorId: req.session.parlorId }).sort({ role: -1 }).exec(function(err, users) {
                        if (err) return res.json(CreateObjService.response(true, 'Error in connecting database'));
                        else return res.json(CreateObjService.response(false, _.map(users, function(u) {
                            var obj = Admin.parse(u);
                            obj.userId = u.id;
                            return obj;
                        })));
                    });
                }
            });
        } else {
            return res.json(CreateObjService.response(true, 'Invalid role'));
        }
    })
});

router.post('/teamMembers', function(req, res) {

    Admin.findOne({$or : [{parlorIds : req.session.parlorId, role : 7}, {parlorId : req.session.parlorId, role : {$ne : 7}}] , _id: req.session.userId} , function(err , user){
        var query = {role : 1000};
        console.log({parlorIds : req.session.parlorId , _id: req.session.userId})
        if(user && user.role == 7){
            query = {parlorId:{$in : user.parlorIds} }  
        }else if(user) {
            query = { parlorId: req.session.parlorId }
        }
        console.log(query)
        Admin.find(query).sort({ role: -1 }).exec(function(err, users) {
            if (err) return res.json(CreateObjService.response(true, 'Error in connecting database'));
            else {
                var empIds = _.map(users, function(u) {
                    return u.id;
                });
                Attendance.find({
                    employeeId: { $in: empIds },
                    time: { $gt: HelperService.getTodayStart(), $lt: HelperService.getTodayEnd() }
                }, function(err, attendances) {
                    return res.json(CreateObjService.response(false, _.map(users, function(u) {
                        var obj = Admin.parse(u);
                        obj.userId = u.id;
                        var p = populateWorkHr(attendances, u.id);
                        obj.checkInTime = p.checkInTime;
                        obj.todayWorkingHours = p.todayWorkingHours;
                        return obj;
                    })));
                });

            }
        });
        
    })
    
});

function populateWorkHr(attendances, empId) {
    var todayWorkingHours = 0.0,
        checkInTime = null;
    var a = _.filter(attendances, function(argument) {
        return argument.employeeId + "" == empId + "";
    });
    if (a.length > 0) {
        checkInTime = a[0].time;
        if (a.length % 2 != 0) a.push({ time: new Date() });
        _.forEach(a, function(att, key) {
            if (key % 2 != 0) {
                console.log(HelperService.getHoursBetweenTwoDates(a[key - 1].time, att.time));
                todayWorkingHours += HelperService.getHoursBetweenTwoDates(a[key - 1].time, att.time);
            }
        });
    }
    return { checkInTime: checkInTime, todayWorkingHours: todayWorkingHours.toFixed(2) };
}


router.post('/changeActiveOfTeam', function(req, res) {
    Admin.update({
        parlorId: req.session.parlorId,
        _id: req.body.userId
    }, { active: req.body.active }, function(err, users) {
        if (err) return res.json(CreateObjService.response(true, 'Error in connecting database'));
        else return res.json(CreateObjService.response(false, 'Success'));
    });
    /*Admin.find({parlorId : req.session.parlorId}).sort({role : -1}).exec(function(err, users){
     if(err) return res.json(CreateObjService.response(true, 'Error in connecting database'));
     else return res.json(CreateObjService.response(false, _.map(users, function(u){ var obj = Admin.parse(u);obj.userId = u.id; return obj; })));
     });*/
});



router.post('/changeSalonIncentiveOfTeam', function(req, res) {
    Admin.update({
        _id: req.body.userId
    }, { salonIncentive: req.body.salonIncentive }, function(err, users) {
        if (err) return res.json(CreateObjService.response(true, 'Error in connecting database'));
        else return res.json(CreateObjService.response(false, 'Success'));
    });
    /*Admin.find({parlorId : req.session.parlorId}).sort({role : -1}).exec(function(err, users){
     if(err) return res.json(CreateObjService.response(true, 'Error in connecting database'));
     else return res.json(CreateObjService.response(false, _.map(users, function(u){ var obj = Admin.parse(u);obj.userId = u.id; return obj; })));
     });*/
});
// ProductCategories.find({},function (err,categories) {
//
//
//
//
// })


var ObjectId = require('mongodb').ObjectID;


router.get('/inventoryP', function(req, res) {
    InventoryItem.items(function(err, items) {
        ParlorItem.find({ parlorId: req.session.parlorId, active: true }, function(err, parlorItems) {
            items = _.map(items, function(item) {
                var newItem = item;
                _.forEach(parlorItems, function(parlorItem) {
                    if (parlorItem.itemId == item.itemId) {
                        newItem.quantity = parlorItem.quantity;
                        newItem.costPrice = parlorItem.costPrice;
                        newItem.commission = parlorItem.commission;
                        newItem.minimumQuantity = parlorItem.minimumQuantity;
                    }
                });
                return newItem;
            });

            InventoryItem.aggregate([{
                    $match: {
                        "inventoryCategoryId": {
                            $in: [ObjectId("590304252d566f08d890c3d8"), ObjectId("59033f1a3d538d1310c3cec8")]
                        }
                    }
                },
                {
                    $group: {
                        "_id": "$inventoryCategoryId",
                        "sellingPrices": { $push: { "sellingPrice": "$sellingPrice", "itemId": "$_id" } }
                    }
                }

            ], function(err, response) {



                // res.json(response)


                var result = _.map(items, function(item) {
                    var Items = item;
                    _.map(response, function(category) {

                        _.forEach(category.sellingPrices, function(t) {
                            console.log(t.itemId, item.Id)
                            if ((t.itemId).toString() == (item.Id).toString()) {
                                console.log("entered")
                                Items.sellingPrices = []
                                Items.sellingPrices.push(category.sellingPrices)

                            }

                        })

                    })

                    return Items


                })

                res.json(result)

            })

            //
            // if (err) return res.json(CreateObjService.response(true, 'Error in getting parlor list'));
            // else return res.json(CreateObjService.response(false, items));
        });
    });
});

router.get('/inventory', function(req, res) {
    InventoryItem.items(function(err, items) {
        ParlorItem.find({ parlorId: req.session.parlorId, active: true }, function(err, parlorItems) {
            Parlor.findOne({ _id: req.session.parlorId }, { parlorType: 1 }, function(err, parlor) {


                items = _.map(items, function(item) {

                    if (item.salonType.indexOf(parlor.parlorType) > -1 || item.salonType.indexOf(3) > -1) {
                        return item;
                    } else {
                        return null
                    }

                })

                items = _.filter(items, null)

                items = _.map(items, function(item) {
                    var newItem = item;
                    _.forEach(parlorItems, function(parlorItem) {
                        if (parlorItem.itemId == item.itemId) {
                            newItem.quantity = parlorItem.quantity;
                            newItem.sellerId = parlorItem.sellerId;
                            newItem.parlorItemId = parlorItem._id;
                            newItem.costPrice = parlorItem.costPrice;
                            newItem.commission = parlorItem.commission;
                            newItem.minimumQuantity = parlorItem.minimumQuantity;
                        }
                    });
                    return newItem;
                });


                if (err) return res.json(CreateObjService.response(true, 'Error in getting parlor list'));
                else return res.json(CreateObjService.response(false, items));
            })
        });
    });
});

router.get('/logo', function(req, res) {
    Parlor.findOne({ _id: req.session.parlorId }, {editPriceAtBooking:1, editDiscountFromCrmPermission : 1, tax: 1, logo: 1, name: 1, address: 1, address2: 1, landmark: 1, legalEntity: 1, serviceTaxNumber: 1, gstNumber: 1, tinNumber: 1, openingTime: 1, closingTime: 1, parlorType: 1, phoneNumber: 1, googleRateLink: 1, branchCode : 1 }, function(err, data) {
        SettlementReport.findOne({parlorId : req.session.parlorId}, {endDate :1}).sort({$natural:-1}).exec(function(err , settle){
            if (data) {
                return res.json(CreateObjService.response(false, {
                    logo: data.logo ? data.logo : "http://careerjobsindia.in/assets/img/logo-google.png",
                    name: data.name,
                    address1: data.address,
                    address2: data.address2,
                    branchCode : data.branchCode,
                    landmark: data.landmark,
                    editPriceAtBooking: data.editPriceAtBooking,
                    legalEntity: data.legalEntity,
                    parlorAddress: data.address + " " + data.address2,
                    parlorRegisteredAddress: "",
                    serviceTaxNumber: data.serviceTaxNumber,
                    gstNumber: data.gstNumber,
                    tinNumber: data.tinNumber,
                    openingTime: data.openingTime,
                    closingTime: data.closingTime,
                    parlorType: data.parlorType,
                    contactNumber: data.phoneNumber,
                    parlorTax: data.tax,
                    editDiscountFromCrmPermission : data.editDiscountFromCrmPermission,
                    googleRateLink: data.googleRateLink,
                    latestSettelment : settle ? settle.endDate  : new Date(),
                }));
            } else {
                return res.json(CreateObjService.response(true, null));
            }
        })
    });
});

router.get('/createCoupons', function(req, res) {
    var data = [];
    Offer.find().count(function(err, n) {
        // n = 118000;
        n += 1;
        var deal = {
            couponCount: parseInt(req.query.couponCount),
            offerType: req.query.offerType,
            price: parseInt(req.query.price),
            dealId: parseInt(req.query.dealId),
            parlorType: parseInt(req.query.parlorType),
        };
        for (var i = 0; i < deal.couponCount; i++) {
            data.push(getCouponObj(n + i + 1, deal));
        }
        Offer.create(data, function(err, d) {
            return res.json(data);
        });
    });
});

function getCouponObj(i, deal) {
    return {
        offerType: 'groupon',
        name: deal.offerType, //NearBy, LittleApp
        code: "BEU" + "" + i, //code for normal, groupon - BEU
        discountAmount: deal.price,
        // discountAmount: 230,
        dealId: deal.dealId,
        parlorType: deal.parlorType, // b grade only
        minAmountReq: 0,
        offerMethod: "online",
        active: true,
        startDate: new Date(),
        endDate: new Date(2038, 12, 31),
    };
}


router.post('/allParlors', function(req, res) {
    Admin.findOne({_id : req.session.userId}, {parlorIds : 1}, function(er, owner){
        Parlor.find({_id : {$in : owner.parlorIds}, active : true}, {name : 1, address : 1, address2 : 1}, function(er, parlors){
            var data = _.map(parlors, function( p){
                return{
                    parlorId : p.id,
                    name : p.name,
                    address1 : p.address,
                    address2 : p.address2,
                }
            });
            return res.json(CreateObjService.response(false, data));
        });
    });
});

router.get('/inventoryInStock', function(req, res) {
    InventoryItem.items(function(err, items) {
        ParlorItem.findOne({ parlorId: req.session.parlorId }, function(err, parlorItems) {
            items = _.map(items, function(item) {
                var newItem = item;
                _.forEach(parlorItems, function(parlorItem) {
                    if (parlorItem.itemId == item.itemId) {
                        newItem.quantity = parlorItem.quantity;
                        newItem.minimumQuantity = parlorItem.minimumQuantity;
                    }
                });
                return newItem;
            });
            items = _.filter(items, function(i) {
                return i.quantity > 0;
            });
            if (err) return res.json(CreateObjService.response(true, 'Error in getting parlor list'));
            else return res.json(CreateObjService.response(false, items));
        });
    });
});

router.post('/inventory', function(req, res) {
    console.log("item for addition",req.body)
    ParlorItem.addItemToInventory(req, req.body.itemId, function(err, item) {
        console.log(err);
        if (err) return res.json(CreateObjService.response(true, 'Error in adding item'));
        else return res.json(CreateObjService.response(false, item));
    });
});

router.put('/consumeItem', function(req, res) {
    var items = [{ amount: req.body.amount, itemId: req.body.itemId, Id: req.body.Id }];
    console.log(items);
    ParlorItem.consumeItem(req, items, false, function(err, item) {
        if (err) return res.json(CreateObjService.response(true, 'Error in adding item'));
        else return res.json(CreateObjService.response(false, item));
    });
});
router.post('/editMinimumQuantity', function(req, res) {

    var itemId = req.body.itemId;
    var parlorId = req.session.parlorId;
    var quantity = req.body.quantity;
    ParlorItem.update({ parlorId: parlorId, itemId: itemId }, { $set: { minimumQuantity: quantity } }, function(err, item) {
        if (!err) {
            return res.json(CreateObjService.response(false, item));

        }
    })

});



router.delete('/inventory', function(req, res) {
    ParlorItem.remove({ parlorId: req.session.parlorId, itemId: req.body.itemId }, function(err, parlor) {
        if (err) return res.json(CreateObjService.response(true, 'Error'));
        else if (parlor) {
            return res.json(CreateObjService.response(false, true));
        }
    });
});


router.post('/package', function(req, res) {
    Parlor.addPackage(req, function(err, data) {
        if (err) return res.json(CreateObjService.response(true, 'Error in creating new package'));
        else return res.json(CreateObjService.response(false, data));
    });
});


router.post('/updateEmployeeService', function(req, res) {
    Parlor.updateServiceEmployee(req, function(err, data) {
        if (err) return res.json(CreateObjService.response(true, 'Error in updating'));
        else return res.json(CreateObjService.response(false, data));
    });
});

router.get('/membershipCustomer', function(req, res) {
    console.log("hey I am called");
    User.find({
        parlors: {
            $elemMatch: {
                'parlorId': req.session.parlorId,
                'membership.membershipId': req.query.membershipId
            }
        }
    }, function(err, users) {
        if (err) return res.json(CreateObjService.response(true, 'Error'));
        else return res.json(CreateObjService.response(false, _.map(users, function(u) {
            return User.parse(u, req.session.parlorId);
        })));
    });
});

router.put('/package', function(req, res) {
    Parlor.updatePackage(req, function(err, data) {
        if (err) return res.json(CreateObjService.response(true, 'Error in updating membership'));
        else return res.json(CreateObjService.response(false, data));
    });
});


router.get('/package', function(req, res) {
    Parlor.findOne({ _id: req.session.parlorId }, function(err, data) {
        if (err) return res.json(CreateObjService.response(true, 'Error'));
        else return res.json(CreateObjService.response(false, _.map(data.packages, function(u) {
            return Parlor.parsePackage(u);
        })));
    });
});

router.post('/editCustomer', function(req, res) {
    var newUser = User.parseEditUser(req);
    User.update({ _id: req.body.userId, 'parlors.parlorId': req.session.parlorId }, newUser, function(err, data) {
        if (err) return res.json(CreateObjService.response(true, 'Error'));
        else return res.json(CreateObjService.response(false, 'Successfully updated'));
    });
});

router.post('/editEmployee', function(req, res) {
    console.log("lhkhgkj", req.body)
    var newUser = Admin.parseEditEmployee(req);
    Admin.update({ _id: req.body.userId }, newUser, function(err, data) {
        if (err) return res.json(CreateObjService.response(true, 'Error'));
        else {
            // Admin.createRazorPayAccountId(req.body.userId);
            return res.json(CreateObjService.response(false, 'Successfully updated'))
        };
    });
});

router.post('/membershipCustomer', function(req, res) {
    console.log(req.body.userId);
    User.findOne({ _id: req.body.userId, 'parlors.parlorId': req.session.parlorId }, function(err, user) {

        if (err) return res.json(CreateObjService.response(true, 'Error'));
        else if (user) {
            var key = 0;
            console.log("user2", "saddsdsasd");
            _.forEach(user.parlors, function(p, index) {
                if (p.parlorId == req.session.parlorId) key = index;
            });
            console.log("user3", "saddsdsasd");
            // if (user.parlors[key].parlorId == req.session.parlorId) {
            Membership.findOne({
                _id: req.body.membershipId
            }, function(err, membership) {
                console.log("here 45453");
                if (membership) {
                    console.log("here 454535666666");
                    MembershipSale.create(MembershipSale.createObj(req, membership), function(err, r) {
                        console.log(err);
                        MembershipSale.find({}).count(function(err, count) {
                            console.log("err");
                            console.log(err);
                            var newCredits = user.credits ? user.credits + membership.credits : membership.credits;
                            var newObj = {
                                parlors: user.parlors,
                                $push: {
                                    "activeMembership": {
                                        createdAt: new Date(),
                                        amount: membership.credits,
                                        creditsLeft: membership.credits,
                                        type: membership.type,
                                        name: membership.name,
                                        parlorId: req.session.parlorId,
                                        membershipId: membership.id,
                                        membershipSaleId : r.id,
                                        membershipWithTax : membership.membershipWithTax,
                                        validTo: HelperService.addMonthsToDate(membership.validFor)
                                    }
                                }
                            };
                            var present = false;
                            _.forEach(user.activeMembership, function(um){
                                if((um.membershipId + "" == membership.id + "") && (um.parlorId + "" == req.session.parlorId + "")){
                                    um.creditsLeft = membership.credits + um.creditsLeft;
                                    um.type = membership.type;
                                    um.membershipId = membership.id;
                                    um.membershipWithTax = membership.membershipWithTax;
                                    um.membershipSaleId =  r.id;
                                    um.validTo = HelperService.addMonthsToDate(membership.validFor);
                                    present = true
                                }
                            });
                            if(present){
                                newObj = {parlors : user.parlors, activeMembership : user.activeMembership};
                            }
                            User.update({ _id: user.id }, newObj, function(err, data) {
                                return res.json(CreateObjService.response(false, {
                                    membership: user.parlors[key].membership,
                                    credits: newCredits,
                                    printObj: getMembershipAsAppointmentObj(membership, 1, 'm' + count, req, user)
                                }));
                            });
                        });
                    });
                } else {
                    console.log("membership not found bug");
                }
            });
            /* }else{
                 console.log("user not found bug");
             }*/
        }
    });
});

function getMembershipAsAppointmentObj(mem, paymentMethod, id, req, user) {
    var client = {
        customerId: user.customerId,
        name: user.firstName + ' ' + (user.lastName ? user.lastName : ''),
        phoneNumber: user.phoneNumber,
        emailId: user.emailId,
        gender: user.gender,
        creditsLeft: 0
    };
    return {
        otherCharges: 0,
        subtotal: mem.price,
        discount: 0,
        appointmentType: 1,
        paymentMethod: paymentMethod,
        allPaymentMethods: [],
        membershipDiscount: 0,
        payableAmount: parseInt(mem.price + (mem.price * mem.tax) / 100),
        appointmentId: id,
        parlorAppointmentId: id,
        appointmentStatus: 1,
        creditUsed: 0,
        client: client,
        memberships: {
            name: mem.name,
            credits: mem.credits,
            price: mem.price,
            validFor: mem.validFor,
            code: mem.code,
            type: mem.type,
        },
        parlorName: req.session.parlorName,
        tax: (mem.price * mem.tax) / 100,
        startsAt: new Date(),
        estimatedTime: 0,
        receptionist: req.session.userName,
        loyalityPoints: 0,
        employees: [],
        services: [],
        products: [],
    };
};

router.delete('/membershipCustomer', function(req, res) {
    User.findOne({ _id: req.body.userId, 'parlors.parlorId': req.session.parlorId }, function(err, user) {
        if (err) return res.json(CreateObjService.response(true, 'Error'));
        else if (user) {
            var key = 0;
            _.each(user.parlors, function(p, index) {
                if (p.parlorId == req.session.parlorId) key = index;
                return;
            });
            if (user.parlors[key].parlorId == req.session.parlorId) {
                Membership.findOne({
                    _id: req.body.membershipId,
                    parlorId: req.session.parlorId
                }, function(err, membership) {
                    if (membership) {
                        user.parlors[key].membership = {};
                        var newCredits = user.credits ? user.credits + membership.credits : membership.credits;
                        User.update({ _id: user.id }, { credits: newCredits, parlors: user.parlors }, function(err, data) {
                            return res.json(CreateObjService.response(false, {}));
                        });
                    }
                });
            }
        }
    });
});
/*
 router.get('/membership', function (req, res) {
 console.log(req.session.parlorId);
 Membership.find({parlorId: req.session.parlorId}, function (err, data) {
 if (err) return res.json(CreateObjService.response(true, 'Error'));
 else {
 User.find({
 parlors: {
 $elemMatch: {
 'parlorId': req.session.parlorId,
 'membership.membershipId': {$ne: null}
 }
 }
 }, function (err, users) {
 data = _.map(data, function (d) {
 return Membership.parse(d);
 });
 _.each(users, function (u) {
 u.parlors = _.filter(u.parlors, function (p) {
 return p.parlorId == req.session.parlorId;
 });
 _.each(data, function (d) {
 if (u.parlors[0].membership.membershipId == d.membershipId) d.noOfCustomers++;
 });
 });
 return res.json(CreateObjService.response(false, data));
 });
 }
 });
 });
 */


router.post('/addHoliday', function(req, res) {
    var empId = req.body.empId;
    var date = req.body.date;
    Admin.findOne({ _id: empId }, function(err, doc) {
        var holidays = doc.holidays || [];
        holidays.push(date);
        Admin.update({ _id: empId }, { '$set': { holidays: holidays } }, function(err, updated) {
            if (err) return res.json(CreateObjService.response(true, err));
            else return res.json(CreateObjService.response(false, updated));
        });
    });
});

router.get('/getHolidays', function(req, res) {
    var empId = req.query.empId;
    Admin.findOne({ _id: empId }, function(err, doc) {
        var hld = doc.holidays || [];
        if (err) return res.json(CreateObjService.response(true, err));
        else return res.json(CreateObjService.response(false, hld));
    });
});

router.post('/addLeave', function(req, res) {
    var data = {};
    data.user_id = req.body.empId;
    data.date = req.body.date;
    data.leave_type = req.body.type; // half | full
    data.status = req.body.status; // paid | unpaid
    data.reason = req.body.reason;
    data.createdAt = new Date().toISOString();
    Leave.create(data, function(err, docs) {
        if (err) return res.json(CreateObjService.response(true, err));
        else return res.json(CreateObjService.response(false, docs));
    });
});


router.get('/employeeDetail', function(req, res) {
    var resp = {};
    var userId = req.query.userId;
    Admin.find({ _id: userId }, function(err, employees) {
        var totalComission = 0;
        var comission = employees[0].commission;
        for (var i = 0; i < comission.length; i++) {
            totalComission += comission[i].amount;
        }
        if (err) return res.json(CreateObjService.response(true, err));
        else {
            resp = employees[0];
            var dt = new Date();
            var firstDay = new Date(dt.getFullYear(), dt.getMonth(), 1);
            var lastDay = new Date(dt.getFullYear(), dt.getMonth() + 1, 0);
            lastDay.setDate(lastDay.getDate() + 1);

            //lastDay = lastDay.toISOString();
            Leave.find({
                user_id: userId,
                status: 'unpaid',
                date: { '$gte': firstDay, '$lt': lastDay }
            }, function(err, leaves) {
                if (err) return res.json(CreateObjService.response(true, err));
                else {
                    /** Leaves */
                    var leaveCount = 0;
                    for (l of leaves) {
                        if (l.leave_type == "half") leaveCount += 0.5;
                        else if (l.leave_type == "full") leaveCount += 1;
                    }

                    /** Holidays */
                    var holidays = employees[0].holidays || [];
                    var holidayCount = 0;
                    for (h of holidays) {
                        if (dates.inRange(h, firstDay, lastDay)) holidayCount++;
                    }

                    /** Salary */
                    var baseSalary = employees[0].salary || 0;
                    var payableSalary = baseSalary + totalComission;
                    var perDaySalary = employees[0].salary / 30;
                    payableSalary = payableSalary - (leaveCount * perDaySalary) - (holidayCount * perDaySalary);
                    if (payableSalary < 0 || payableSalary === null) payableSalary = 0;
                    /** Age */
                    var bdate = employees[0].date_of_birth;
                    var age = 0;
                    if (bdate) age = getAge(bdate);
                    employees[0].commission = [];
                    Appointment.find({
                        'employees.id': userId,
                        parlorId: req.session.parlorId
                    }).limit(10).sort({ createdAt: -1 }).exec(function(err, appointments) {
                        var apps = Appointment.parseArray(appointments);
                        return res.json(CreateObjService.response(false, {
                            employee: employees[0],
                            appointments: apps,
                            leaveCnt: leaveCount,
                            holidayCnt: holidayCount,
                            age: age,
                            totalComission: totalComission,
                            payableSalary: payableSalary
                        }));
                    });
                }
            });
        }
    });
});

router.post('/employeeHomeDetail', function(req, res) {
    var parlorIds = [];
    if (req.session.role == 7) {
        Admin.findOne({ _id: req.session.userId }, function(err, doc) {
            var par = doc.parlorIds || [];
            for (p of par) parlorIds.push(mongoose.Types.ObjectId(p));
            proceed();
        });
    } else {
        parlorIds.push(mongoose.Types.ObjectId(req.session.parlorId));
        proceed();
    }

    function proceed() {
        Admin.find({ parlorId: { '$in': parlorIds } }, '_id', function(err, docs) {
            var userIds = docs || [];

            var opCount = 0;
            var resp = {};
            var working_hrs = 0;

            function doRespond() {
                opCount++;
                if (opCount >= 3) {
                    res.json(resp);
                }
            }

            // Attendance
            var today = new Date();
            var yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            today.setHours(0, 0, 0, 0);
            yesterday.setHours(0, 0, 0, 0);
            Leave.count({
                date: { "$gte": yesterday.toISOString(), "$lt": today.toISOString() },
                user_id: { '$in': userIds }
            }, function(err, leaveCount) {
                resp.attendance = userIds.length - leaveCount;
                doRespond();
            });

            var period = req.body.period || "one";
            var fromDate = new Date();
            fromDate.setHours(0, 0, 0, 0);

            if (period == "one") { // Yesterday
                fromDate.setDate(fromDate.getDate() - 1);
                working_hrs = 10;
            } else if (period == "two") { // This week
                fromDate.setDate(fromDate.getDate() - 7);
                working_hrs = 70;
            } else if (period == "three") { // This month
                fromDate.setDate(fromDate.getDate() - 30);
                working_hrs = 300;
            }

            var workData = {};
            var countData = {};
            var unproductive_hrs = {};
            var serviceCount = 0;
            var employeeCnt = 0;
            var admin_data = {};
            Admin.find({}, function(err, admins) {
                if (err) console.log(err);
                for (var n = 0; n < admins.length; n++) {
                    var id = admins[n]._id;
                    admin_data[id] = admins[n].firstName;
                }
                Appointment.find({
                    appointmentStartTime: { "$gte": fromDate.toISOString() },
                    parlorId: { '$in': parlorIds }
                }, function(err, appointments) {
                    for (var i = 0; i < appointments.length; i++) {
                        serviceCount += appointments[i].services.length;
                        employeeCnt += appointments[i].employees.length;
                        if (appointments[i].employees && appointments[i].employees.length > 0) {
                            var emp = appointments[i].employees;
                            for (var j = 0; j < emp.length; j++) {
                                var empName = admin_data[emp[j].firstName];
                                var empId = emp[j].id;

                                if (workData[empId] === undefined) {
                                    workData[empId] = 0;
                                }
                                workData[empId] += emp[j].estimatedTime;

                                if (countData[empId] === undefined) {
                                    countData[empId] = 0;
                                }
                                countData[empId]++;

                                if (unproductive_hrs[empId] === undefined) {
                                    unproductive_hrs[empId] = working_hrs;
                                }
                            }
                            unproductive_hrs[empId] -= (emp[j].estimatedTime / 60);
                        }

                    }
                    // }
                    resp.unproductive_hrs = [];
                    for (id in unproductive_hrs) {
                        resp.unproductive_hrs.push({
                            name: admin_data[id],
                            hrs: unproductive_hrs[id]
                        });
                    }

                    resp.appointment_trend = [];
                    for (id in countData) {
                        resp.appointment_trend.push({
                            name: admin_data[id],
                            appointments: countData[id]
                        });
                    }

                    resp.avg_services_per_emp = 0;
                    resp.avg_services_per_emp = serviceCount / employeeCnt;

                    var minTime = Number.MAX_VALUE;
                    var maxTime = Number.MIN_VALUE;
                    var mostProductive = "";
                    var minProductive = "";

                    for (var id in workData) {
                        if (workData[id] < minTime) {
                            minProductive = id;
                            minTime = workData[id];
                        }
                        if (workData[id] > maxTime) {
                            mostProductive = id;
                            maxTime = workData[id];
                        }
                    }

                    Admin.findOne({ _id: minProductive }, function(err, minProductiveRecord) {
                        if (err) resp.leastProductiveEmployee = "N/A";
                        else resp.leastProductiveEmployee = minProductiveRecord.firstName;
                        doRespond();
                    });

                    Admin.findOne({ _id: mostProductive }, function(err, mostProductiveRecord) {
                        if (err) resp.mostProductiveEmployee = "N/A";
                        else resp.mostProductiveEmployee = mostProductiveRecord.firstName;
                        doRespond();
                    });
                });
            });
        });
    }
});


router.post('/expenseProfitLoss', function(req, res) {
    var today = new Date()
    var d = []
    var parlorId = req.session.parlorId
    var month = req.body.month
    var year = req.body.year
    var startDate = HelperService.getFirstDateOfMonth(year, month)
    var endDate = HelperService.getLastDateOfMonth(year, month)

    console.log(startDate, endDate)

    Admin.find({ parlorId: req.session.parlorId, active: true }).exec(function(err, employees) {
        async.series([
            function(done) {
                async.each(employees, function(employee, callback) {
                    console.log(employee.firstName);
                    Appointment.employeeIncentiveReport(employee, startDate, endDate, function(err, data) {
                        d.push(data);
                        console.log("getting data success for " + employee.firstName);
                        callback();
                    })
                }, done);
            }
        ], function allTaskCompleted() {
            var salary = 0
            var incentive = 0
            _.map(d, function(k) {
                salary += k.empSalary
                _.map(k.dep, function(o) {
                    incentive += o.totalIncentive
                })
            })


            Appointment.aggregate({
                    "$match": {
                        parlorId: ObjectId(req.session.parlorId),
                        "createdAt": { "$gte": startDate, "$lt": endDate }
                    }
                }, {
                    "$group": {
                        "_id": null,
                        "service": { $sum: "$serviceRevenue" },
                        "product": { $sum: "$productRevenue" }
                    }
                }
                // ,
                // { "$project": { "revenue": { "$add": [ "$service", "$product" ] } } }

                ,
                function(err, rev) {
                    console.log("----------------", rev)
                    SettlementReport.aggregate({
                        $match: {
                            parlorId: ObjectId(req.session.parlorId),
                            createdAt: { $gte: startDate, $lt: endDate }
                        }
                    }, {
                        $group: {
                            _id: null,
                            beushare: { $sum: "$amountPayableToBeu" }

                        }
                    }, function(err, pay2beu) {

                        if (err) console.log(err)
                        console.log(rev)
                        console.log(pay2beu)
                        var beushare = 0;

                        ParlorItem.aggregate({ $unwind: "$addHistory" }, {
                            $match: {
                                parlorId: ObjectId(req.session.parlorId),
                                "addHistory.quantity": { $lt: 0 },
                                "addHistory.addedOn": { $gte: startDate, $lt: endDate }
                            }
                        }, {
                            $group: {
                                _id: null,
                                sum: { $sum: "$addHistory.quantity" },
                                cost: { $sum: "$addHistory.costPrice" }
                            }
                        }, function(err, consumed) {

                            if (pay2beu.length > 0) {
                                beushare = pay2beu[0].beushare
                            }


                            Expense.aggregate({
                                $match: {
                                    createdAt: {
                                        $gte: startDate,
                                        $lt: endDate
                                    }
                                }
                            }, { $group: { _id: "$name", sum: { $sum: "$amount" } } }, function(err, indirectExp) {
                                ParlorItem.aggregate({ $unwind: "$addHistory" }, {
                                    $match: {
                                        parlorId: ObjectId(req.session.parlorId),
                                        "addHistory.quantity": { $gt: 0 },
                                        "addHistory.addedOn": { $lt: startDate }
                                    }
                                }, {
                                    $group: {
                                        _id: null,
                                        positive: { $sum: "$addHistory.quantity" },
                                        positivePrice: { $sum: "$addHistory.costPrice" }
                                    }
                                }, function(err, positive) {
                                    console.log
                                    ParlorItem.aggregate({ $unwind: "$addHistory" }, {
                                        $match: {
                                            parlorId: ObjectId(req.session.parlorId),
                                            "addHistory.quantity": { $lt: 0 },
                                            "addHistory.addedOn": { $lt: startDate }
                                        }
                                    }, {
                                        $group: {
                                            _id: null,
                                            negetive: { $sum: "$addHistory.quantity" },
                                            negetiveCost: { $sum: "$addHistory.costPrice" }
                                        }
                                    }, function(err, negetive) {


                                        // consosle.log()
                                        ParlorItem.aggregate({ $unwind: "$addHistory" }, {
                                            $match: {
                                                parlorId: ObjectId(req.session.parlorId),
                                                "addHistory.quantity": { $gt: 0 },
                                                "addHistory.addedOn": { $gte: startDate, $lt: endDate }
                                            }
                                        }, {
                                            $group: {
                                                _id: null,
                                                sum: { $sum: "$addHistory.quantity" },
                                                cost: { $sum: "$addHistory.costPrice" }
                                            }
                                        }, function(err, monthPurchase) {

                                            var pos = 0;
                                            var neg = 0;
                                            var service = 0;
                                            var cost = 0;
                                            var sum = 0;
                                            var product = 0;
                                            var monthPurchase1 = 0;
                                            console.log(positive)
                                            if (positive.length > 0) {
                                                pos = positive[0].positivePrice
                                            }
                                            if (negetive.length > 0) {
                                                neg = negetive[0].negetiveCost
                                            }
                                            if (rev.length > 0) {
                                                service = rev[0].service
                                                product = rev[0].product
                                            }
                                            if (consumed.length > 0) {
                                                cost = consumed[0].cost
                                                sum = consumed[0].sum


                                            }
                                            if (monthPurchase.length > 0) {
                                                monthPurchase1 = monthPurchase[0].cost

                                            }
                                            console.log("monthpurchase", monthPurchase1)

                                            var itemOnFirstDay = pos + neg;
                                            var closeStock = itemOnFirstDay + (monthPurchase1 + cost)
                                            console.log("----------->>>>", neg, pos, consumed)
                                            return res.json({
                                                "cog": {
                                                    itemOnFirstDay: itemOnFirstDay,
                                                    monthPurchase: monthPurchase1,
                                                    consumed: cost,
                                                    closeStock: closeStock
                                                },
                                                "salary": salary,
                                                "incentive": incentive,
                                                "service": service,
                                                "product": product,
                                                "beushare": beushare,
                                                "consumed": (service) * .2,
                                                indirect: indirectExp
                                            });



                                        })
                                    })
                                })


                            })


                        })


                    })

                })


            console.log('done');

        });
    });
});


router.post('/expense', function(req, res) {
    var obj = Expense.getNewObj(req);
    Expense.create(obj, function(err, data) {
        if (err) return res.json(CreateObjService.response(true, 'Unable to create'));
        else return res.json(CreateObjService.response(false, data));
    });
});


router.get('/expense', function(req, res) {
    var page = req.query.page ? req.query.page : 1;
    var perPage = 10;
    Expense.find({}).sort({ createdAt: 1 }).limit(perPage).skip(perPage * (page - 1)).exec(function(err, data) {
        if (err) return res.json(CreateObjService.response(true, 'Error in getting previous expenses'));
        else return res.json(CreateObjService.response(false, Expense.parseArray(data)));
    });
});


router.get('/parlorHomeData', function(req, res) {
    Appointment.parlorHomeData(req, function(err, data) {
        return res.json(CreateObjService.response(false, data));
    });
});


router.post('/chart', function(req, res) {
    var schemaMapping = ChartService.schemaMapping;
    var preqMapping = ChartService.preqMapping;
    var columnMapping = ChartService.columnMapping;
    var operationMapping = ChartService.operationMapping;
    var filterMapping = ChartService.filterMapping;
    var cond = {
        or: '$or',
        and: '$and'
    };
    /** Read data from request body */
    var x = req.body.x_axis; // appointment
    var y = req.body.y_axis ? req.body.y_axis : req.body.z_axis; // service | employee | client | membership | date | offer | branch | week
    var z = req.body.y_axis ? req.body.z_axis || undefined : undefined; // service | employee | client | membership | date | offer | branch | week [optional] (y != z)
    var op = req.body.op; // count | revenue
    var filters = req.body.filters; // service | employee | client | membership | date | offer | branch [optional]
    var sort = req.body.sort; // asc | desc [optional]
    var condition = req.body.condition;

    /** Unwind Required Arrays */
    var unwinded = {};
    var collection = schemaMapping[x];
    var query = [];
    if (x == 'profit') {
        Parlor.getProfitGraphData(req, function(err, data) {
            if (err) return res.json(CreateObjService.response(true, 'Error in creating new membership'));
            else return res.json(CreateObjService.response(false, data));
        });
    } else {
        var pre = preqMapping[x][op][y];
        if (pre && pre.length > 0) {
            for (let p of pre) {
                query.push(p);
                console.log("dasdsadsa");
                unwinded[p['$unwind']] = true;
            }
            console.log("error in this");
        }
        if (z) {
            var pre_z = preqMapping[x][op][z];
            if (pre_z) {
                for (let p of pre_z) {
                    if (!(unwinded[p['$unwind']])) {
                        query.push(p);
                        unwinded[p['$unwind']] = true;
                    }
                }
            }
            console.log("error in z");
        }
        if (filters && filters.length > 0) {
            for (let f of filters) {
                var pre_f = preqMapping[x]['count'][f['key']];
                if (pre_f) {
                    for (let p of pre_f) {
                        if (!unwinded[p['$unwind']]) {
                            query.push(p['$unwind']);
                            unwinded[p['$unwind']] = true;
                        }
                    }
                }
            }
        }

        var parlorIds = [];
        Admin.findOne({ _id: req.session.userId }, function(err, docs) {
            //Admin.findOne({_id: '57863fba2377bf5a72a51a0b'}, function (err, docs) {
            if (docs.role != 7) {
                parlorIds.push(mongoose.Types.ObjectId(docs.parlorId));
            } else {
                parlorIds = docs.parlorIds;
            }
            //parlorIds.push(mongoose.Types.ObjectId('57863fba2377bf5a72a51a0a'));
            var fil = {};
            fil['$match'] = {};
            fil['$match']['parlorId'] = { '$in': parlorIds };

            /** Adding Filters */
            var branchFilter = [];
            var hoursFilter = [];
            if (filters && filters.length > 0) {
                fil['$match'][cond[condition]] = [];
                for (f of filters) {
                    var key = f['key'];
                    var value = f['value'];
                    if (key == 'branch') {
                        branchFilter = value;
                        continue;
                    }
                    if (key == 'hour') {
                        hoursFilter = value;
                        continue;
                    }
                    if (key == 'date') {
                        var fromDate = value[0];
                        var toDate = value[1];
                        fil['$match'][filterMapping[key]] = { '$gte': new Date(fromDate), '$lt': new Date(toDate) };
                    } else {
                        var fkey = new Object();
                        fkey[filterMapping[key]] = { '$in': value };
                        fil['$match'][cond[condition]].push(fkey)
                    }
                }
            }
            /*if(req.body.date){

             }*/
            query.push(fil);

            /** Adding Group */

            if (z) {
                query.push({
                    '$group': {
                        '_id': {
                            'y': columnMapping[x][op][y],
                            'z': columnMapping[x][op][z]
                        },
                        'aggregate': operationMapping[x][op][z]
                    },
                });
                if (sort) {
                    if (sort == 'asc') query.push({ '$sort': { 'aggregate': 1 } });
                    else query.push({ '$sort': { 'aggregate': -1 } });
                }
                query.push({
                    '$group': {
                        '_id': '$_id.y',
                        'data': {
                            '$push': {
                                '_id': '$_id.z',
                                'data': '$aggregate'
                            }
                        }
                    },
                });
                if (sort) {
                    if (sort == 'asc') query.push({ '$sort': { 'data.data': 1 } });
                    else query.push({ '$sort': { 'data.data': -1 } });
                }
            } else {
                query.push({
                    '$group': {
                        '_id': columnMapping[x][op][y],
                        'data': operationMapping[x][op][y]
                    }
                });
                if (sort) {
                    if (sort == 'asc') query.push({ '$sort': { 'data': 1 } });
                    else query.push({ '$sort': { 'data': -1 } });
                }
            }
            collection.aggregate(query, function(err, data) {
                if (err) return res.json(CreateObjService.response(true, err));
                else {
                    if (y == 'branch' || y == 'week' || y == 'hour' || z == 'branch' || z == 'week' || z == 'hour') {
                        if (y == 'branch') {
                            var branchName = {};
                            Parlor.find({}, function(err, allParlors) {
                                for (var i = 0; i < allParlors.length; i++) {
                                    branchName[allParlors[i].id] = allParlors[i].address;
                                }

                                for (var j = 0; j < data.length; j++) {
                                    var id = data[j]._id;
                                    data[j]._id = branchName[id];
                                }
                                if (branchFilter.length > 0) {

                                    data = _.filter(data, function(d) {
                                        if (branchFilter.indexOf(d._id) > -1) return true;
                                        else {
                                            return false;
                                        }
                                    });
                                }
                                checkZ();
                            });
                        } else if (y == 'week') {
                            for (var j = 0; j < data.length; j++) {
                                var weeknum = data[j]._id;
                                data[j]._id = getDateOfWeek(weeknum, new Date().getFullYear());
                            }
                            checkZ();
                        } else if (y == 'hour') {
                            if (hoursFilter.length > 0) {
                                data = _.filter(data, function(d) {
                                    if (hoursFilter.indexOf(d._id) > -1) return true;
                                    else {
                                        return false;
                                    }
                                });
                            }
                            checkZ();
                        } else {
                            checkZ();
                        }

                        function checkZ() {
                            if (z == 'branch') {
                                var branchName = {};
                                Parlor.find({}, function(err, allParlors) {
                                    for (var i = 0; i < allParlors.length; i++) {
                                        branchName[allParlors[i].id] = allParlors[i].address;
                                    }

                                    for (var i = 0; i < data.length; i++) {
                                        for (var j = 0; j < data[i].data.length; j++) {
                                            data[i].data[j]._id = branchName[data[i].data[j]._id];
                                        }
                                    }

                                    /** Apply filters */
                                    if (branchFilter.length > 0) {
                                        var respData = [];
                                        for (var i = 0; i < data.length; i++) {
                                            var subdata = data[i]['data'];

                                            var validBranch = [];
                                            for (var j = 0; j < subdata.length; j++) {
                                                if (branchFilter.indexOf(subdata[j]._id) > -1) {
                                                    validBranch.push({ '_id': subdata[j]._id, 'data': subdata[j].data })
                                                }
                                            }
                                            if (validBranch.length > 0) {
                                                respData.push({ '_id': data[i]._id, 'data': validBranch });
                                            }
                                        }
                                        data = respData;
                                    }
                                    return res.json(CreateObjService.response(false, data));
                                });
                            } else if (z == 'week') {
                                _.forEach(data, function(d) {
                                    _.forEach(d.data, function(dt) {
                                        dt._id = getDateOfWeek(dt._id, new Date().getFullYear());
                                    });
                                });
                                return res.json(CreateObjService.response(false, data));
                            } else if (z == 'hour') {
                                if (hoursFilter.length > 0) {
                                    var respData = [];
                                    for (var i = 0; i < data.length; i++) {
                                        var subdata = data[i]['data'];
                                        var validData = [];
                                        for (var j = 0; j < subdata.length; j++) {
                                            if (hoursFilter.indexOf(subdata[j]._id) > -1) {
                                                validData.push({ '_id': subdata[j]._id, 'data': subdata[j].data })
                                            }
                                        }
                                        if (validData.length > 0) {
                                            respData.push({ '_id': data[i]._id, 'data': validData });
                                        }
                                    }
                                    data = respData;
                                }
                                return res.json(CreateObjService.response(false, data));
                            } else {
                                return res.json(CreateObjService.response(false, parseChartData(data)));
                            }
                        }
                    } else {
                        return res.json(CreateObjService.response(false, parseChartData(data)));
                    }
                }
            });
        });
    }
});

function parseChartData(data) {
    if (data.length == 0) return d;
    if (data[0].data.constructor === Array) {
        var values = [];
        _.forEach(data, function(d) {
            _.forEach(d.data, function(v) {
                var result = _.some(values, function(t) {
                    return t === v._id;
                });
                if (!result) values.push(v._id);
            });
        });

        _.forEach(data, function(d) {
            _.forEach(values, function(v) {
                var result = _.some(d.data, function(t) {
                    return t._id === v;
                });
                if (!result) d.data.push({ _id: v, data: 0 });
            });
        });
        _.forEach(data, function(d) {
            d.data = _.sortBy(d.data, '_id').reverse();
        });
        return data;
    } else return data;
    // _.forEach
}

router.post('/membership', function(req, res) {
    Membership.create(Membership.getMembershipObj(req), function(err, data) {
        if (err) return res.json(CreateObjService.response(true, 'Error in creating new membership'));
        else return res.json(CreateObjService.response(false, Membership.parse(data, req.session.parlorId)));
    });
});


router.put('/membership', function(req, res) {
    Membership.update({ _id: req.body.membershipId }, Membership.getMembershipObj(req), function(err, data) {
        if (err) return res.json(CreateObjService.response(true, 'Error in updating membership'));
        else return res.json(CreateObjService.response(false, 'Updated'));
    });
});


router.get('/offers', function(req, res) {
    Offer.find({ isDeleted: 0 }, function(err, data) {
        if (err) return res.json(CreateObjService.response(true, 'Error'));
        else return res.json(CreateObjService.response(false, _.map(data, function(u) {
            return Offer.parse(u);
        })));
    });
});

router.post('/offers', function(req, res) {
    Offer.create(Offer.getOfferObj(req), function(err, data) {
        if (err) return res.json(CreateObjService.response(true, 'Error in creating new offer'));
        else return res.json(CreateObjService.response(false, 'Created'));
    });
});

router.put('/offer', function(req, res) {
    Offer.update({ _id: req.body.offerId }, Offer.getOfferObj(req), function(err, data) {
        if (err) return res.json(CreateObjService.response(true, 'Error in updating offer'));
        else return res.json(CreateObjService.response(false, 'Updated'));
    });
});

router.post('/memberServicesDetail', function(req, res) {
    var userId = req.body.userId;
    Parlor.findOne({ _id: req.session.parlorId }).exec(function(err, parlor) {
        ServiceCategory.find({ superCategory: { $nin: ["Hair", "Makeup", "Makeup Service"] } }, function(err, categories) {
            var newCategories = _.map(categories, function(category) {
                var serviceByCategory = _.filter(parlor.services, { 'categoryId': category._id });
                var present = false;
                serviceByCategory.forEach(function(ser) {
                    ser.prices.forEach(function(p) {
                        p.employees = p.employees.filter(function(e) {
                            return e.userId + "" == req.body.userId;
                        });
                        if (p.employees.length > 0) present = true;
                    });
                });

                return {
                    name: category.name,
                    superCategory: category.superCategory,
                    id: category.id,
                    isPresent: present,
                };
            });
            var result = _.chain(newCategories)
                .groupBy("superCategory")
                .toPairs()
                .map(function(currentItem) {
                    return _.zipObject(["superCategory", "categories"], currentItem);
                })
                .value();

            var finalResult = _.map(result, function(superCategory) {
                var serviceByCategory = _.filter(superCategory.categories, { 'isPresent': true });
                return {
                    superCategory: superCategory.superCategory,
                    categories: superCategory.categories,
                    isPresent: serviceByCategory.length > 0 ? true : false,
                };
            });
            return res.json(CreateObjService.response(false, finalResult));
        });
    });
});

router.post('/updateMemberServicesDetail', function(req, res) {
    var userId = req.body.userId;
    var categoryId = req.body.categoryId;
    ServiceCategory.findOne({ _id: categoryId }).exec(function(err, category) {
        if (category) {
            Admin.findOne({ _id: userId, parlorId: req.session.parlorId }).exec(function(err, user) {
                if (user) {
                    var services = req.body.services;
                    services = _.map(services, function(s) {
                        return { categoryId: categoryId, serviceId: s.serviceId, isSpecialist: s.isSpecialist };
                    });
                    user.services = _.filter(user.services, function(s) {
                        return s.categoryId != categoryId;
                    });
                    _.map(services, function(s) {
                        user.services.push(s);
                    });
                    Admin.update({ _id: userId }, { services: user.services }).exec(function(err, data) {
                        if (!err) return res.json(CreateObjService.response(false, null));
                    });
                } else return res.json(CreateObjService.response(true, 'Invalid user'));
            });
        } else return res.json(CreateObjService.response(true, 'Invalid categoryId'));
    });
});

router.post('/updateTeamMember', function(req, res) {
    var teamMemberId = req.body.teamMemberId;
    var user = Admin.getUserObj(req);
    if (user) {
        Admin.update({
            parlorId: req.session.parlorId,
            id: teamMemberId
        }, Admin.getUserObj(req)).exec(function(err, data) {
            if (err) return res.json(true, 'Error in updating');
            else return res.json(false, null);
        });
    } else {
        return res.json(CreateObjService.response(true, 'Invalid role'));
    }
});

router.post('/categoryList', function(req, res) {
    ServiceCategory.categories(function(err, categories) {
        return res.json(CreateObjService.response(false, categories));
    });
});

router.post('/categoryListBySuperCategory', function(req, res) {
    ServiceCategory.categories(function(err, data) {
        var result = _.chain(data)
            .groupBy("superCategory")
            .toPairs()
            .map(function(currentItem) {
                return _.zipObject(["superCategory", "categories"], currentItem);
            })
            .value();


        return res.json(CreateObjService.response(false, result));
    });
});


router.post('/serviceList', function(req, res) {
    Service.serviceByCategoryId(req.body.categoryId, function(err, services) {
        Parlor.findOne({ _id: req.session.parlorId }).exec(function(err, parlor) {
            _.forEach(services, function(service) {
                var servicePresent = {};
                parlor.services.forEach(function(s) {
                    if (s.serviceId == service.serviceId) servicePresent = s;
                });
                if (servicePresent.prices) {
                    service.prices = _.map(service.prices, function(ser) {
                        var present = false,
                            index = 0,
                            serviceBrand = {};
                        _.forEach(servicePresent.prices, function(parlorPrice, key) {
                            if (parlorPrice.priceId == ser.priceId) {
                                present = true;
                                if (parlorPrice.additions.length == 0 && ser.additions.length > 0) {
                                    parlorPrice.additions = Service.getNewAdditionObj(ser.additions);
                                }
                                serviceBrand = Service.getNewBrandsObj(ser.brand, parlorPrice.brand);
                                index = key;
                            }
                        });
                        if (present) {
                            return {
                                priceId: servicePresent.prices[index].priceId,
                                employees: servicePresent.prices[index].employees,
                                name: servicePresent.prices[index].name,
                                estimatedTime: servicePresent.prices[index].estimatedTime,
                                price: servicePresent.prices[index].price,
                                percentageDifference: servicePresent.prices[index].percentageDifference,
                                tax: servicePresent.prices[index].tax,
                                additions: servicePresent.prices[index].additions,
                                brand: serviceBrand
                            };
                        } else {
                            return {
                                priceId: ser.priceId,
                                employees: [],
                                name: ser.name,
                                additions: Service.getNewAdditionObj(ser.additions),
                                brand: Service.getNewBrandsObj(ser.brand, []),
                            };
                        }
                    });
                } else {
                    service.prices = _.map(service.prices, function(ser) {
                        return {
                            priceId: ser.priceId,
                            employees: [],
                            name: ser.name,
                            additions: Service.getNewAdditionObj(ser.additions),
                            brand: Service.getNewBrandsObj(ser.brand, []),
                        };
                    });
                }
            });
            services.sort(function(a, b) {
                return b.name - a.name;
            });
            return res.json({ error: false, data: services });
        });
    });
});

router.post('/updateService', function(req, res) {
    var deleteService = req.body.delete,
        categoryId = req.body.categoryId,
        serviceId = req.body.serviceId,
        prices = req.body.prices;
    Service.findOne({ _id: serviceId }).exec(function(err, service) {
        if (service) {
            var serviceName = service.name,
                categoryId = service.categoryId,
                gender = service.gender;
            Parlor.findOne({ _id: req.session.parlorId }).exec(function(err, parlor) {
                if (parlor) {
                    var index = -1;
                    _.forEach(parlor.services, function(s, key) {
                        if (s.serviceId == serviceId) index = key;
                    });
                    if (index != -1 && deleteService) {
                        parlor.services.splice(index, 1);
                        Parlor.update({ _id: parlor.id }, { services: parlor.services }).exec(function(err) {
                            return res.json(CreateObjService.response(false, Parlor.serviceObject(serviceId, serviceName, gender, prices, service, true, req.session.userId, [])));
                        });
                    } else if (!deleteService) {
                        Admin.find({
                            parlorId: req.session.parlorId,
                            role: { $gt: 1 }
                        }).sort({ role: -1 }).exec(function(err, employees) {
                            if (err) return res.json(CreateObjService.response(true, 'Error in connecting database'));
                            else {
                                employees = _.map(employees, function(u) {
                                    var obj = Admin.parse(u);
                                    obj.userId = u.id;
                                    return obj;
                                });
                                var newService = Parlor.serviceObject(serviceId, serviceName, gender, prices, service, false, req.session.userId, employees);
                                console.log(newService.prices[0].brand.brands);
                                console.log("----------------------------------------");
                                if (index != -1) parlor.services[index] = newService;
                                else parlor.services.push(newService);
                                Parlor.update({ _id: parlor.id }, { services: parlor.services }).exec(function(err) {
                                    return res.json(CreateObjService.response(false, newService));
                                });
                            }

                        });

                    } else {
                        return res.json(CreateObjService.response(true, 'Invalid data'));
                    }
                } else {
                    return res.json(CreateObjService.response(true, 'Invalid parlor'));
                }
            });
        } else return res.json(CreateObjService.response(true, 'Invalid service id'));
    });
});

function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

function getDateOfWeek(weekNumber, year) {
    var res = [];
    var start = new Date(year, 0, 1 + ((weekNumber - 1) * 7));
    var end = new Date(start);
    end.setDate(start.getDate() + 6);
    return start.getDate() + '/' + start.getMonth() + '/' + start.getFullYear() + " To " + end.getDate() + '/' + end.getMonth() + '/' + end.getFullYear();
}

var dates = {
    convert: function(d) {
        return (
            d.constructor === Date ? d :
            d.constructor === Array ? new Date(d[0], d[1], d[2]) :
            d.constructor === Number ? new Date(d) :
            d.constructor === String ? new Date(d) :
            typeof d === "object" ? new Date(d.year, d.month, d.date) :
            NaN
        );
    },
    compare: function(a, b) {
        return (
            isFinite(a = this.convert(a).valueOf()) &&
            isFinite(b = this.convert(b).valueOf()) ?
            (a > b) - (a < b) :
            NaN
        );
    },
    inRange: function(d, start, end) {
        return (
            isFinite(d = this.convert(d).valueOf()) &&
            isFinite(start = this.convert(start).valueOf()) &&
            isFinite(end = this.convert(end).valueOf()) ?
            start <= d && d < end :
            NaN
        );
    }
};


// ------------------------------------------------new Inventory Api---------------------------------------


function sendMailByChimp(arr, seller, qNo, pNo) {
    var emailid_new = [];
    var emailid_newCc = [];
    var emailid_newtemp = _.find(seller.seller.emailId1, { cityId: seller.parlor.cityId })
    var emailid_newCcTemp = _.find(seller.seller.emailIdcc1, {
        cityId: seller.parlor.cityId
    })
    var seller_phoneNum = (_.find(seller.seller.contactNumber1, {
        cityId: seller.parlor.cityId
    })).phoneNumbers;
    console.log(emailid_newtemp)
    console.log(emailid_newCcTemp)
    emailid_new = emailid_newtemp.ids;
    emailid_newCc = emailid_newCcTemp.ids;


    Beu.find({ role: 3, parlorIds: seller.parlor._id }, { emailId: 1 }, function(err, allMail) {
        Admin.find({ role: 7, parlorIds: seller.parlor._id }, { emailId: 1 }, function(err, parlosOwner) {
            allMail.forEach(function(s) {
                emailid_new.push(s.emailId)

            })

            var nodemailer = require('nodemailer');
            var qtyTotal = 0
            var td = new Date();
            var date = "" + td.getDate() + "-" + (td.getMonth() + 1) + "-" + td.getFullYear();
            var emailString = '';
            for (var i = 0; i < seller.parlor.email.length; i++) {
                emailString += seller.parlor.email[i] + ",";
            }
            console.log(seller)
            var sentMail = "<div style='margin:auto;width:90%;'>Dear Vendor,<br><br>Please find below the Purchase Order from Be U Salons outlet. Outlet details and terms and conditions are mentioned in the PO for your perusal. <br><br><b>We recommend you to reconfirm the order with the salon outlet immediately over a call for additional details before processing the order for a smooth order processing.</b><br><br>  </div>" +
                "<div style='margin:auto;width:90%;' > <div><img src='http://res.cloudinary.com/dyqcevdpm/image/upload/v1491484496/" +
                "beu-logo_srvetg.png' width='150' alt='Beu salons'/></div><h2 style='text-align:center;'>Purchase Order</h2> " +
                "<div class='jk'> <table border='1' style='width:100%;border-collapse: collapse;border:1px solid gray;text-align: " +
                "left;text-align: left'><tr><td style='text-align:center;font-size: 15px;font-weight: bold;padding-top:2%;padding-bottom: 2%;' colspan='6'><span style='text-transform:uppercase;font-size: 15px;font-weight: bold'>" + seller.parlor.name + "(" + seller.parlor.legalEntity + ")" +
                "<br>" + seller.parlor.address + " " + seller.parlor.address2 + "<br></span>Tel.:" + seller.parlor.phoneNumber + ", E-mail : " + emailString + " " +
                "</td></tr><tr><td rowspan='4' colspan='4'>" +
                "  Vendor Name & Address:" + seller.seller.name + "<br>Off:" + seller.seller.address + " <br>Ph:- " + seller_phoneNum + "</td>" +
                "</tr><tr><td style='padding-top: 1%;padding-bottom: 1%;'>Salon GST No. : " + seller.parlor.gstNumber + "</td></tr><tr><td>  P.O. No. : " + pNo + "</td></tr><tr><td>  Date :- " + date + "</td>" +
                "</tr><tr><td colspan='6'style='padding-top: 1%;padding-bottom: 1%;' >  Shipping Address :" + seller.parlor.address + "," + seller.parlor.address2 + "</td></tr>" +
                "<tr><td colspan='6' style='text-align:center;font-size: 12px;font-weight: bold;padding-top: 1%;padding-bottom: 1%;'>" +
                "Please supply the following in accordance with the terms and conditions contained hereunder & overleaf :</td></tr><tr><td style='text-align:center;font-size: 14px;font-weight: bold'>S.No.</td>" +
                "<td colspan='3' style='text-align:center;font-size: 14px;font-weight: bold;padding-top: 1%;padding-bottom: 1%;'>Specification and Description of Item</td><td  style='text-align:center;font-size: 14px;font-weight: bold'>Quantity</td></tr>"


            for (var i = 0; i < arr.length; i++) {
                var method = arr[i].data[0];
                sentMail += "<tr>";
                sentMail += "<td style='text-align:center;padding-top: 1%;padding-bottom: 1%;'>" + (i + 1) + "</td>" +
                    "<td colspan='3' style='text-align: center;padding-top: 1%;padding-bottom: 1%;'>" + method.productCategoryName + "</td>" +
                    "<td style='text-align: center;padding-top: 1%;padding-bottom: 1%;'>" + method.orderedQuantity + "</td>";
                sentMail += "</tr>";
                qtyTotal += parseInt(method.orderedQuantity)

            }
            sentMail += "<tr><td colspan='4'  style='text-align:center;font-size: 13px;font-weight:bold;padding-top: 1%;padding-bottom: 1%;'>" +
                "  Total </td>" +
                "<td style='text-align:center;font-size: 13px;font-weight: bold;padding-top: 1%;padding-bottom: 1%;'>" + qtyTotal + " </td></tr>" +
                "<tr><td colspan='6' rowspan='2' style='text-align:center;font-size: 12px;font-weight: bold;padding-top: 1%;padding-bottom: 1%;'>" +
                "   T&C: Payment terms will be as per the policy of product distributor/company.</td></tr></table> </div></div>";

            seller.parlor.email.forEach(function(s) {
                emailid_newCc.push(s)

            })
            parlosOwner.forEach(function(s) {
                emailid_newCc.push(s.emailId)

            })

            emailid_newCc.push('inventory@beusalons.com')
            emailid_newCc.push('ranjankumar@beusalons.com')
            // emailid_newCc.push('amitrana@beusalons.com')
            var transporter = nodemailer.createTransport('smtps://appointments@beusalons.com:wx2t2Tr7pMrqnK2CIqwd3g@smtp.mandrillapp.com');
            var mailOptions = {
                from: 'inventory@beusalons.com', // sender address
                to: emailid_new, // list of receivers
                cc: emailid_newCc,
                html: sentMail,
                subject: 'Purchase Order' // Subject line
            };

            transporter.sendMail(mailOptions, function(error, info) {
                if (error)
                    return console.log(error);
                else
                    console.log(info);
            });
        })
    })
}


function sendMailByChimp1(arr, seller, qNo, pNo, sendTo) {

    var emailid_new = [];
    var emailid_newCc = [];
    var emailid_newtemp = _.find(seller.seller.emailId1, { cityId: seller.parlor.cityId })
    var emailid_newCcTemp = _.find(seller.seller.emailIdcc1, {
        cityId: seller.parlor.cityId
    })
    var seller_phoneNum = (_.find(seller.seller.contactNumber1, {
        cityId: seller.parlor.cityId
    })).phoneNumbers;
    console.log(emailid_newtemp)
    console.log(emailid_newCcTemp)
    emailid_new = emailid_newtemp.ids;
    emailid_newCc = emailid_newCcTemp.ids;



    Beu.find({ role: 3, parlorIds: seller.parlor._id }, { emailId: 1 }, function(err, allMail) {
        Admin.find({ role: 7, parlorIds: seller.parlor._id }, { emailId: 1 }, function(err, parlosOwner) {

            allMail.forEach(function(s) {
                emailid_newCc.push(s.emailId)

            })

            var nodemailer = require('nodemailer');
            var qtyTotal = 0
            var td = new Date();
            var date = "" + td.getDate() + "-" + (td.getMonth() + 1) + "-" + td.getFullYear();
            var emailString = '';
            for (var i = 0; i < seller.parlor.email.length; i++) {
                emailString += seller.parlor.email[i] + ",";
            }

            var sentMail = "<div style='margin:auto;width:90%;'>Dear Vendor,<br><br>Please find below the Purchase Order from Be U Salons outlet. Outlet details and terms and conditions are mentioned in the PO for your perusal.<br><br><b>We recommend you to reconfirm the order with the salon outlet immediately over a call for additional details before processing the order for a smooth order processing.</b><br><br>  </div>" +
                "<div style='margin:auto;width:90%;' > <div><img src='http://res.cloudinary.com/dyqcevdpm/image/upload/v1491484496/" +
                "beu-logo_srvetg.png' width='150' alt='Beu salons'/></div><h2 style='text-align:center;'>Updated Purchase Order</h2> " +
                "<div class='jk'> <table border='1' style='width:100%;border-collapse: collapse;border:1px solid gray;text-align: " +
                "left;text-align: left'><tr><td style='text-align:center;font-size: 15px;font-weight: bold;padding-top:2%;padding-bottom: 2%;' colspan='6'><span style='text-transform:uppercase;font-size: 15px;font-weight: bold'>" + seller.parlor.name + "(" + seller.parlor.legalEntity + ")" +
                "<br>" + seller.parlor.address + " " + seller.parlor.address2 + "<br></span>Tel.:" + seller.parlor.phoneNumber + ", E-mail : " + emailString + " " +
                "</td></tr><tr><td rowspan='4' colspan='4' style='padding-top: 1%;padding-bottom: 1%;'>" +
                "Vendor Name & Address:" + seller.seller.name + "<br>Off:" + seller.seller.address + " <br>Ph:- " + seller_phoneNum + "</td>" +
                "</tr><tr><td style='padding-top: 1%;padding-bottom: 1%;'>Salon GST No. : " + seller.parlor.gstNumber + "</td></tr><tr><td style='padding-top: 1%;padding-bottom: 1%;'>P.O. No. : " + pNo + "</td></tr><tr><td style='padding-top: 1%;padding-bottom: 1%;'>Date :- " + date + "</td>" +
                "</tr><tr><td colspan='6' style='padding-top: 1%;padding-bottom: 1%;' >Shipping Address :" + seller.parlor.address + "," + seller.parlor.address2 + "</td></tr>" +
                "<tr><td colspan='6' style='text-align:center;font-size: 12px;font-weight: bold;padding-top: 1%;padding-bottom: 1%;'>" +
                "Please supply the following in accordance with the terms and conditions contained hereunder & overleaf :</td></tr><tr><td style='text-align:center;font-size: 14px;font-weight: bold'>S.No.</td>" +
                "<td colspan='3' style='text-align:center;font-size: 14px;font-weight: bold;padding-top: 1%;padding-bottom: 1%;'>Specification and Description of Item</td><td  style='text-align:center;font-size: 14px;font-weight: bold'>Quantity</td></tr>"

            for (var i = 0; i < arr.length; i++) {
                // if(arr[i].data[0].currentItem==undefined){
                //
                //     arr[i].data[0].currentItem=arr[i].data[0].orderedQuantity;
                // }
                var method = arr[i];
                sentMail += "<tr>";
                sentMail += "<td style='text-align:center;padding-top: 1%;padding-bottom: 1%;' >" + (i + 1) + "</td>" +
                    "<td colspan='3' style='text-align: center; padding-top: 1%;padding-bottom: 1%;'>" + method.categoryName + "</td>" +
                    "<td style='text-align: center; padding-top: 1%;padding-bottom: 1%;'>" + method.orderedQuantity + "</td>";
                sentMail += "</tr>";
                qtyTotal += parseInt(method.orderedQuantity)
            }

            sentMail += "<tr><td colspan='4'  style='text-align:center;font-size: 13px;font-weight: bold'>" +
                "  Total </td>" +
                "<td style='text-align:center;font-size: 13px;font-weight: bold'>" + qtyTotal + " </td></tr>" +
                "<tr><td colspan='6' rowspan='2' style='text-align:center;font-size: 12px;font-weight: bold'>" +
                "   T&C: Payment terms will be as per the policy of product distributor/company.</td></tr></table> </div></div>";

            var transporter = nodemailer.createTransport('smtps://info@beusalons.com:wx2t2Tr7pMrqnK2CIqwd3g@smtp.mandrillapp.com');


            seller.parlor.email.forEach(function(s) {
                emailid_newCc.push(s)

            })
            parlosOwner.forEach(function(s) {
                emailid_newCc.push(s.emailId)

            })
            emailid_newCc.push('inventory@beusalons.com')
            emailid_newCc.push('ranjankumar@beusalons.com')
            // emailid_newCc.push('amitrana@beusalons.com')

            var mailOptions = {
                from: 'inventory@beusalons.com', // sender address
                to: emailid_new, // list of receivers
                cc: emailid_newCc,
                html: sentMail,
                subject: 'Purchase Order' // Subject line
            };
            transporter.sendMail(mailOptions, function(error, info) {
                if (error)
                    return console.log(error);
                else
                    console.log(info);
            });
        })
    })
}


// function sendEmailToSeller(arr,seller,sendTo) {
//
//
//     console.log("----------------->>>>>>>>>>>>>>>>>>>>>",arr)
//     var nodemailer=require('nodemailer');
//     // seller.poNumber=142;
//     // seller.conactNumber=678;
//     // seller.name="my mail"
//
//
//
//     var td=new Date();
//     var date=""+td.getFullYear()+""+(td.getMonth()+1)+""+td.getDate();
//
//     var sentMail ="<div style='margin:auto;width:90%;' > <div><img src='https://www.monsoonsalon.com/emailler/images/beu-logo.png' width='150' alt='Beu salons'/></div><h3 style='text-align:center;'>Invoice</h3> <div class='jk'> <table border='1' style='width:100%;border-collapse: collapse;border:1px solid gray;text-align: left;text-align: left'><tr><td style='text-align:center;' colspan='6'>MONSOON SALON & SPA PVT. LTD.<br>(Formerly Known as Rod Anker Hair Stylists Pvt.Ltd.)<br>Plot-62, Three Hand Building, Okhla Phase-3, New Delhi-110020<br>Tel. : 9999922586, E-mail : yogender@monsoonsalon.com </td></tr><tr><td style='text-align:center;' colspan='6'>PURCHASE ORDER</td></tr><tr><td rowspan='4' colspan='4'>Vendor Name & Address:"+seller.name+"<br>Off:"+seller.address+" <br>Ph:- "+seller.conactNumber+"</td></tr><tr><td>Tin NO. :07660444563</td></tr><tr><td>P.O. No. : "+seller.poNumber+"</td></tr><tr><td>Date :- "+date+"</td></tr><tr><td colspan='4'>Shipping Address : 184, Siddharth Enclave, Aashram Delhi-14</td><td>Your Quotation No. :</td></tr><tr><td colspan='4'>Requision No. :</td><td>Date :-</td></tr><tr><td colspan='6' style='text-align:center;'>Please supply the following in accordance with the terms and conditions contained hereunder & overleaf :</td></tr><tr><td>S.N.</td><td colspan='3'>Specification and Description of Item</td><td>Quantity</td></tr>"
//     for (var i = 0; i < arr.length; i++) {
//
//         if(arr[i].currentItem==undefined){
//
//             arr[i].currentItem=arr[i].quantity;
//         }else{
//
//             var method = arr[i];
//             sentMail += "<tr>";
//             sentMail += "<td >" + (i+1) + "</td>"+
//                 "<td colspan='3'>" + method.name + "</td>"+
//                 "<td>"+ method.currentItem + "</td>";
//             sentMail += "</tr>";
//
//         }
//
//     }
//     sentMail += "<tr><td colspan='6' style='text-align:center;'>Purchase Order No. must be quoted on all challans/Invoices and any other correspondance in connection with the same.</td></tr><tr><td colspan='6' style='text-align:center;'> Inspection :</td></tr><tr><td colspan='6' style='text-align:center;'>Sales Tax/Excise : Inclusive of all taxes</td></tr><tr><td colspan='6' style='text-align:center;'>Terms of Payment : 30 days after delivery</td></tr><tr><td colspan='2' style='text-align:center;'>Delivery Date : </td><td style='text-align:center;' colspan='3'>Delivery at :</td></tr><tr><td colspan='2' style='text-align:center;'>Dispatch Through :</td><td style='text-align:center;' colspan='3'>Freight : Paid/ TO Pay :</td></tr><tr><td colspan='2' style='text-align:center;'>Order Accepted : </td><td style='text-align:center;'colspan='3' >For MONSOON SALON & SPA PVT. LTD.</td></tr><tr><td colspan='2' style='text-align:center;height: 57px;padding-top: 20px;'>Signature & Seal of Supplier</td><td colspan='2' style='text-align:center;height: 57px;padding-top: 20px;'>Purchase Manager </td><td style='text-align:center;height: 57px;padding-top: 20px;'>Authorised Signatory</td></tr></table> </div></div>";
//
//
//
//        var transporter = nodemailer.createTransport('smtps://avdhesh@beusalons.com:samsungginger@smtp.gmail.com');
//     var mailOptions = {
//         from: 'avdhesh@beusalons.com', // sender address
//         to: 'avdhesh@beusalons.com', // list of receivers
//         html:sentMail,
//         subject: 'Be U Salons' // Subject line
//     };
//     transporter.sendMail(mailOptions, function (error, info) {
//         if (error)
//             console.log(error);
//         else
//
//             console.log("mail sent")
//     });
// }


router.get('/sendMail', function(req, res) {


    console.log("logged")
    sendEmailToSeller("avdhesh@beusalons.com")
        // res.send("mail Sent")

});

router.post('/insertSellerToParlorItem', function(req, res) {
    var itemId = req.body.itemId;
    var sellerId = req.body.sellerId;
    var query = { parlorId: req.session.parlorId, _id: itemId };
    ParlorItem.update(query, { sellerId: sellerId }, function(err, result) {
        res.json(CreateObjService.response(false, result));
    })
});

router.post('/getParlorItems', function(req, res) {
    var pid = req.body.parlorId;
    ParlorItem.find({ parlorId: pid }).exec(function(err, dat) {
        Sellers.find({}).exec(function(err, sellData) {
            console.log(dat)
            var dataToSend = {
                sellerIds: _.map(sellData, function(p) {

                    return {
                        id: p._id,
                        name: p.name
                    }
                }),
                parlorItems: _.map(dat, function(r) {
                    return {
                        id: r._id,
                        name: r.name

                    }

                })
            }
            res.json(CreateObjService.response(false, dataToSend));
        })

    })
})

router.post("/sellerContact", function(req, res) {
    console.log("been called");
    var parlorId = req.session.parlorId;
    console.log(req.body)
    Parlor.findOne({ _id: parlorId }, { services: 0 }, function(err, parlor) {



        Sellers.findOne({ "_id": req.body.id }, { contactNumber1: 1 }, function(err, response) {
            console.log(response);
            if (err) {
                res.json({ success: false, data: "Something went wrong please try again." });
            } else {

                console.log(JSON.stringify(response));
                var filtered = _.find(response.contactNumber1, { cityId: parlor.cityId })
                console.log(filtered)

                res.json({ success: true, data: { contactNumber: filtered.phoneNumbers } });
            }
        });
    });
})

router.post('/addOrder', function(req, res) {
    console.log("----------------body", req.body)
    var parlorId = req.session.parlorId;

    var data = req.body.data;


    console.log("----------------sum", data)

    var id = req.body._id;
    var id = data[0].data[0].sellerId;

    console.log("sellerId", id)
    if(parlorId=="5c19f52a0a849106e2c21a46" || parlorId=="5c67ed1c1a3b245f02199779" || parlorId=="5c73bfc365f45c4a44b7a1bf" || parlorId=="5ca0bb2daab04e6597aa56b5")
     {
        parlorId="594a359d9856d3158171ea4f" 
     }
     console.log("parlorId",parlorId)
    //
    Parlor.findOne({ _id: parlorId }, { services: 0 }).exec(function(err, parlor) {

        Sellers.findOne({ _id: id }).exec(function(err, sell) {
            //

            var filtered = _.find(sell.emailId1, { cityId: parlor.cityId })
            var query = {
                "sellerId": sell._id,
                "name": sell.name,
                "parlorId": req.session.parlorId,

                "items": _.map(data, function(e) {
                    return {
                        "itemId": e.data[0].itemId,
                        "status": e.data[0].status,
                        "categorySum": data[0].sum,
                        "categoryName": e.data[0].productCategoryName,
                        // "quantity":e.quantity,
                        "productCategoryName": e.data[0].productCategoryName,
                        "productCategoryId": e.data[0].productCategoryId,
                        "orderedQuantity": e.data[0].orderedQuantity,
                        "actualQuantity": e.data[0].actualQuantity
                    }
                }),
                "emailId": filtered.ids,
                "status": 1,
            };
            //

            async.parallel([
                function(call2) {
                    async.each(data, function(item, callback22) {
                        ParlorItem.update({ inventoryItemId: item.data[0].itemId, parlorId: req.session.parlorId }, {
                            $set: {
                                "orderedStatus": 1

                            }
                        }).exec(function(err, result) {
                            if (err) {
                                res.json(CreateObjService.response(true, "error in sending query"))
                            } else {
                                callback22()
                            }


                        })

                    }, call2);
                }
            ], function processDone(err, done) {

                // console.log("query data",query)
                //
                ReOrder.findOne({ "parlorId": req.session.parlorId, poNumber: { $exists: true } }, {}, { sort: { 'poNumber': -1 } }, function(err, p) {
                    ReOrder.findOne({ quotationNumber: { $exists: true } }, {}, { sort: { 'quotationNumber': -1 } }, function(err, q) {

                        var qNo = q ? q.quotationNumber + 1 : 1;
                        var pNo = p ? p.poNumber + 1 : 1;
                        query.quotationNumber = qNo;
                        query.poNumber = pNo;

                        console.log("---------------------->", query)
                        ReOrder.create(query, function(err, result1) {
                            if (err) {
                                res.json(CreateObjService.response(true, err))
                                console.log(err)
                            } else {
                                var mailData = { seller: sell, parlor: parlor }

                                OwnerNotifications.sendNotifications(req.session.parlorId, result1.name ,result1.items, null , null ,false, false , false);
                                if (localVar.isServer) {

                                    sendMailByChimp(data, mailData, qNo, pNo);
                                }
                                // console.log("oredered created", result1)


                                // console.log("pppppppppppppppppppppppppppppppppppp",parlor)
                                res.json(CreateObjService.response(false, result1))
                            }
                        })

                    });
                })
            });
        })

    })

});

router.post('/getPurchaseHistory', function(req, res) {
    // .sort({updatedAt:-1})
    var parlorId = req.session.parlorId;


    var startDate = HelperService.getDayStart(req.body.startDate) ? HelperService.getDayStart(req.body.startDate) : HelperService.getDayStart(new Date());
    var endDate = HelperService.getDayEnd(req.body.endDate) ? HelperService.getDayEnd(req.body.endDate) : HelperService.getDayEnd(new Date());
    // createdAt:{$gte:startDate,$lt:endDate}
    ReOrder.find({
        parlorId: parlorId,
        createdAt: { $gte: startDate, $lt: endDate }
    }).sort({ updatedAt: -1 }).exec(function(err, done) {

        var parsedData = ReOrder.parseGetPurchase(done).data;

        var fData = _.map(parsedData, function(s) {
            var t = new Date()
            if ((t.getDate() - s.date.getDate()) > 3) {

                s.editStatus = false;
            } else {
                s.editStatus = true;
            }
            return s
        })

            async.each(parsedData , function(par , call){

                var arr = par;

                DiscountStructure.findOne({sellerId : par.sellerId}, {slabs :1} , function(err , ds){
                    par.directDiscount = ds.slabs[0].directDiscount;

                    call();
                })

            }, function all(){
                res.send(CreateObjService.response(false, parsedData));
            })

    })

});

router.post('/editPurchase', function(req, res) {

    var orderId = req.body.orderId;
    var sellerId = req.body.sellerId;
    var parlorId = req.body.parlorId;
    var itemIds = req.body.itemIds;
    // var items=req.body.items;


    console.log("-------------------------", itemIds);
    ReOrder.findOne({ _id: orderId }).exec(function(err, result) {

        if (result) {
            async.parallel([
                function(call) {
                    async.each(itemIds, function(item, callback) {


                        ReOrder.update({ _id: orderId, "items._id": item.editId }, {
                            $set: {
                                "items.$.orderedQuantity": item.orderedQuantity

                            }
                        }).exec(function(err, result) {
                            console.log(result)
                            if (err) {
                                res.json(CreateObjService.response(true, "error in sending query"))
                                callback()
                            } else {
                                callback()
                            }


                        })

                    }, call);
                }
            ], function processDone(err, done) {


                Sellers.findOne({ _id: sellerId }).exec(function(err, getData) {
                    Parlor.findOne({ _id: parlorId }, { services: 0 }, function(err, getData2) {


                        ReOrder.findOne({ poNumber: { $exists: true } }, {}, { sort: { 'poNumber': -1 } }, function(err, p) {

                            ReOrder.findOne({ quotationNumber: { $exists: true } }, {}, { sort: { 'quotationNumber': -1 } }, function(err, q) {
                                ReOrder.findOne({ _id: orderId }, function(err, newOrder) {


                                    var sendDetails = { seller: getData, parlor: getData2 }

                                    console.log("qqqqqqqqqqqqqqqqqqq", getData)
                                    if (localVar.isServer) {

                                        sendMailByChimp1(newOrder.items, sendDetails, q.quotationNumber, p.poNumber, "avdhesh@beusalons.com");
                                    }
                                    if (err) {
                                        res.json(CreateObjService.response(true, "error in sending query"));
                                    }
                                    res.json(CreateObjService.response(false, "done"));
                                })
                            })

                        })

                    })
                })


            });

        } else {

        }
    })

});

router.post('/recievePurchase', function(req, res) {

    var parlorId = req.session.parlorId;
    var orderId = req.body.orderId;
    var item = req.body.itemIds[0];
    var items = req.body.itemIds;
    var orderAmount = req.body.totalAmountSellingPrices;
    var oldOrderAmount = req.body.total;
    console.log(orderId)
    console.log(items)
    ReOrder.findOne({ _id: orderId }).exec(function(err, result) {
        if (result) {

            async.each(items, function(item, callback) {

                InventoryItem.findOne({_id: item.itemId }).exec(function(err, inventoryitem) {

                ParlorItem.findOne({ parlorId: parlorId, inventoryItemId: item.itemId }).exec(function(err, fetching) {

                    ReOrder.update({ _id: orderId, "items._id": item.editId }, {
                        $set: {
                            "items.$.subTotal": (parseInt(fetching.quantity) + parseInt(item.orderedQuantity)),
                            "items.$.recieveQuantity": item.orderedQuantity,
                            "receivedAt": new Date()
                        }
                    }).exec(function(err, reorder) {
                        let quantityAfterOrder = (parseInt(fetching.quantity) + parseInt(item.orderedQuantity));
                        ParlorItem.update({ parlorId: parlorId, inventoryItemId: item.itemId }, {
                            $set: {
                                quantity: quantityAfterOrder,
                                orderedStatus: 0,
                                actualUnits : inventoryitem.oneUnitQuantity * quantityAfterOrder

                            },
                            $push: {
                                "addHistory": {
                                    "addedOn": new Date(),
                                    "quantity": (parseInt(fetching.quantity) + parseInt(item.orderedQuantity)),
                                    "costPrice": fetching.costPrice,
                                    "sellingPrice": fetching.sellingPrice
                                }

                            }
                        }).exec(function(err, parlorUpdate) {

                            // console.log(parlorUpdate)
                            console.log("item updated")
                            console.log(orderId)

                            ReOrder.update({ _id: orderId }, {
                                $set: {
                                    "status": 0,
                                    "orderAmount": req.body.total,
                                    receivedAt: new Date()
                                }
                            }).exec(function(err, reorderupdated) {
                                if (err) {
                                    res.json(CreateObjService.response(true, "error in sending query"));
                                }
                                callback()

                            })
                        })



                    })

                })
                })


            }, function(err, done) {

                console.log(req.body.allId)
                OwnerNotifications.sendNotifications(req.session.parlorId, result.name ,[], req.body.total ,null ,true, false, false);
                ParlorItem.update({
                    parlorId: parlorId,
                    inventoryItemId: { $in: req.body.allId }
                }, { $set: { orderedStatus: 0 } }, { multi: true }, function(err, resulting) {

                    if (err) console.log(err)
                    var queryAgg = [
                        { $match: { _id: ObjectId(orderId), createdAt: { $gte: new Date(2017, 7, 1) } } },
                        { $unwind: "$items" },
                        {
                            $lookup: {
                                from: "inventoryitems",
                                localField: "items.itemId",
                                foreignField: "_id",
                                as: "new"
                            }
                        },
                        { $unwind: "$new" },
                        { $project: { parlorId: 1, purchaseSum: { $multiply: ["$items.recieveQuantity", "$new.sellingPrice"] } } },
                        { $group: { _id: "$parlorId", sum: { $sum: "$purchaseSum" } } }
                    ];
                    ReOrder.aggregate(queryAgg, function(err, reorder) {
                        console.log("reorder", reorder)
                        DisountOnPurchase.find({ parlorId: parlorId }, function(err, dop) {

                            var DOP = dop[0];

                            if (DOP) {

                                DiscountStructure.findOne({ sellerId: result.sellerId }, function(err, stu) {
                                    var slabDiscount = stu.slabs[0].totalDiscount - stu.slabs[0].directDiscount;

                                    var newPurchase = reorder[0].sum;
                                    var PurchaseTillDate = DOP.purchaseTillDate + reorder[0].sum;
                                    var discountBucket = DOP.discountBucket + (reorder[0].sum * slabDiscount) / 100;
                                    var factor = slabDiscount ? 5 : 0;
                                    var targetRevenue = DOP.targetRevenue + ((reorder[0].sum) * factor)
                                    let month = (result.receivedAt).getMonth() + 1;
                                    let year = (result.receivedAt).getFullYear();
                                    console.log("result.sellerId", result.sellerId);
                                    console.log("slabDiscount", slabDiscount);
                                    console.log("newPurchase", newPurchase);
                                    console.log("discountBucket", discountBucket);
                                    console.log("targetRevenue", targetRevenue);
                                    DisountOnPurchase.create({

                                        "parlorId": parlorId,

                                        "purchase": newPurchase,

                                        "purchaseTillDate": PurchaseTillDate,

                                        "targetRevenue": targetRevenue,

                                        "upFrontDiscount": ((oldOrderAmount * (stu.slabs[0].directDiscount)) / 100),

                                        "sellerId": result.sellerId,

                                        "sellerName": result.name,

                                        "orderId": result._id,

                                        "time": result.receivedAt,

                                        "discount": slabDiscount,

                                        "discountBucket": discountBucket,

                                        "closing" : false,

                                        "opening" : false,

                                        "month" : month,

                                        "year" : year

                                    }, function(err, disUp) {
                                        if (err) console.log("discount On Structure", err)
                                        console.log("discount On Structure", disUp)
                                        res.json(CreateObjService.response(false, "done"));


                                    })


                                })

                            } else {
                                console.log("Else")
                                console.log("result.sellerId", result.sellerId);

                                DiscountStructure.findOne({ sellerId: result.sellerId }, function(err, stu) {
                                    console.log("stu", stu);
                                    var slabDiscount = stu.slabs[0].totalDiscount - stu.slabs[0].directDiscount;
                                    var newPurchase = reorder[0].sum;
                                    var PurchaseTillDate = reorder[0].sum;
                                    var discountBucket = (reorder[0].sum * slabDiscount) / 100;
                                    
                                    var factor = slabDiscount ? 5 : 0;
                                    var targetRevenue = ((reorder[0].sum) * factor)

                                    console.log("slabDiscount", slabDiscount);
                                    console.log("newPurchase", newPurchase);
                                    console.log("discountBucket", discountBucket);
                                    console.log("targetRevenue", targetRevenue);

                                    DisountOnPurchase.create({

                                        "parlorId": parlorId,

                                        "purchase": newPurchase,

                                        "purchaseTillDate": PurchaseTillDate,

                                        "sellerId": result.sellerId,

                                        "sellerName": result.name,

                                        "targetRevenue": targetRevenue,

                                        "upFrontDiscount": ((oldOrderAmount * (stu.slabs[0].directDiscount)) / 100),

                                        "discount": slabDiscount,

                                        "orderId": result._id,

                                        "time": result.receivedAt,

                                        "discountBucket": discountBucket

                                    }, function(err, disUp) {
                                        if (err) console.log("discount On Structure", err)
                                        console.log("discount On Structure", disUp)

                                        res.json(CreateObjService.response(false, "done"));


                                    })


                                })





                            }





                        }).sort({ $natural: -1 }).limit(1)
                    })
                })


            })
        } else {

            // find result else

        }
    })


})

router.post('/recievePurchaseCorrect', function(req, res) {


    // var item = req.body.itemIds[0];
    ReOrder.find({ _id: req.body.orderId }, function(err, orders) {

        async.each(orders, function(ord, cbs) {
            var parlorId = ord.parlorId;
            var orderId = ord._id;
            var allId = [];
            console.log("Started")
            console.log("OrderId", orderId)
            console.log("OrderId", parlorId)
            ReOrder.findOne({ _id: orderId }).exec(function(err, result) {
                if (result) {
                    for (var i = 0; i < result.items.length; i++) {
                        allId.push(result.items[i].itemId)
                    }
                    var items = result.items;

                    async.each(items, function(item, callback) {

                        ParlorItem.findOne({ parlorId: parlorId, inventoryItemId: item.itemId }).exec(function(err, fetching) {

                            ReOrder.update({ _id: orderId, "items._id": item.itemId }, {
                                $set: {
                                    "items.$.subTotal": 0,
                                    "items.$.recieveQuantity": 0
                                }
                            }).exec(function(err, reorder) {

                                console.log("reorder added")
                                ParlorItem.update({ parlorId: parlorId, inventoryItemId: item.itemId }, {
                                    $set: {
                                        quantity: (parseInt(fetching.quantity) - parseInt(item.orderedQuantity)),
                                        orderedStatus: 1
                                    },
                                    $pop: {
                                        "addHistory": 1,

                                    }
                                }).exec(function(err, parlorUpdate) {

                                    // console.log(parlorUpdate)
                                    console.log("item updated")
                                    console.log(orderId)

                                    ReOrder.update({ _id: orderId }, {
                                        $set: {
                                            "status": 1,
                                            "orderAmount": 0
                                        }
                                    }).exec(function(err, reorderupdated) {
                                        if (err) {
                                            res.json(CreateObjService.response(true, "error in sending query"));
                                        }
                                        callback()

                                    })
                                })



                            })

                        })


                    }, function(err, done) {

                        ParlorItem.update({
                            parlorId: parlorId,
                            inventoryItemId: { $in: allId }
                        }, { $set: { orderedStatus: 1 } }, { multi: true }, function(err, resulting) {

                            if (err) console.log(err)
                            cbs();
                        })


                    })
                } else {
                    cbs();


                    // find result else

                }
            })

        }, function() {

            res.json(CreateObjService.response(false, "opened"))

        })

    })

})

router.post('/editReceivedPurchase', function(req, res) {

    var body = req.body;
    console.log(JSON.stringify(body));
    var newOrderAmount = body.orderAmount
    var newItems = body.items.items;
    var id = body.items._id;

    ReOrder.update({ _id: id }, { newOrderAmount: newOrderAmount, newItems: newItems, ApprovalStatus: true }, function(err, updated) {
        if (err) {
            res.json(CreateObjService.response(true, err))

        } else {
            ReOrder.findOne({_id: id}, {parlorId: 1 , orderAmount :1, name:1, receivedAt:1}, function(err , reorder){
                OwnerNotifications.sendNotifications(reorder.parlorId, reorder.name, [], newOrderAmount , reorder.receivedAt, true,  false , true);
                res.json(CreateObjService.response(false, "Updated"))
            })
            

        }


    })






})


router.post('/getPriceList', function(req, res) {

    var itemIds = req.body.itemsIds;
    var parlorId = req.session.parlorId

    // console.log("PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP", req.body.itemsIds, parlorId)

    ParlorItem.find({
        inventoryItemId: { $in: itemIds },
        parlorId: parlorId
    }, { productCategoryId: 1 }, function(err, dataa) {
        console.log("list data", dataa)
        var catArray = [];
        dataa.forEach(function(l) {
            catArray.push(ObjectId(l.productCategoryId))
        })

        // console.log("my array", catArray)

        // var catId=(dataa.productCategoryId).toString();
        //   console.log(ObjectId(catId))
        ParlorItem.aggregate([{
                $match: {
                    active: true,
                    "parlorId": ObjectId(parlorId),
                    "productCategoryId": {
                        $in: catArray
                    }
                }
            },
            {
                $group: {
                    "_id": "$productCategoryId",
                    "sellingPrices": { $push: { "sellingPrice": "$sellingPrice", "itemId": "$inventoryItemId" } }
                }
            }
        ], function(err, response) {
            // console.log(JSON.stringify(response))
            if (err) {
                console.log(err)
            }
            res.json(CreateObjService.response(false, response))

        })

    })
})


router.post('/getReorder', function(req, res) {

    var pid = req.session.parlorId;
    console.log(req.session.parlorId)


    ParlorItem.aggregate([{
            $match: {
                active: true,
                "parlorId": ObjectId(pid)
            }
        },
        {
            $group: {
                "_id": "$productCategoryId",
                sum: { $sum: "$quantity" },
                sellerId: { $first: "$sellerId" },
                sellerName: { $first: "$sellerName" },
                data: {
                    $push: {

                        "itemId": "$inventoryItemId",
                        "productCategoryId": "$productCategoryId",
                        "productCategoryName": "$productCategoryName",
                        "sellerId": "$sellerId",
                        "sellerName": "$sellerName",
                        "name": "$name",
                        "quantity": "$quantity",
                        "actualQuantity": "$quantity",
                        "status": "$orderedStatus",
                        "minimumQuantity": "$minimumQuantity",
                        "itemIdd": "$itemId",
                        "costPrice": "$costPrice"


                    }
                }
            }
        }, {
            $project: {
                _id: 1,
                "data": 1,
                "sum": 1,
                "sellerId": 1,
                "sellerName": 1
            }

        }, {
            $group: {
                "_id": "$sellerId",
                "sellerName": { $first: "$sellerName" },
                "data": {
                    $push: {
                        sum: "$sum",
                        data: "$data"
                    }
                }


            }
        }
    ]).exec(function(err, resData) {




        res.json(CreateObjService.response(false, resData));

    })


})


router.get('/getSellerForDs', function(req, res) {



    Parlor.findOne({ _id: req.session.parlorId }, function(err, parlor) {

        var type = parlor.parlorType
        console.log(type)
        DiscountStructure.find({ salonType: { $in: [type, 3] } }, { sellerId: 1, sellerName: 1 }).exec(function(err, response) {

            res.json(CreateObjService.response(false, response));


        })


    })



})


router.post('/getDiscountStructure', function(req, res) {

    console.log("get structure")
    Parlor.findOne({ _id: req.session.parlorId }, function(err, parlor) {

        var type = parlor.parlorType
        console.log(type)
        var cityId = parlor.cityId;

        DiscountStructure.find({ sellerId: req.body.sellerId, salonType: { $in: [type, 3] } }, function(err, result) {
            Sellers.findOne({ _id: req.body.sellerId }, function(err, seller) {
                console.log("seller", seller.contactNumber)

                var a = _.filter(seller.contactNumber1, function(argument) {
                    return argument.cityId == cityId;
                });

                console.log(a);

                var data = {
                    seller: a[0].phoneNumbers,
                    result: result,

                }
                console.log(data)
                res.json(CreateObjService.response(false, data));

            })

        })

    })




});




// ---------------------------------gst--------------------------------


router.post('/createGst', function(req, res) {
    console.log(req.body)
    console.log(req.session.parlorId)

    Parlor.update({ _id: req.session.parlorId }, { $set: { gstNumber: req.body.gstNumber, wifiName: req.body.wifiName, wifiPassword: req.body.wifiPassword } }, function(err, result) {

        if (err) {
            res.json(CreateObjService.response(true, err));


        } else {
            res.json(CreateObjService.response(false, result));

        }

    })


})
router.get('/getParlorGst', function(req, res) {

    Parlor.find({ _id: req.session.parlorId }, { gstNumber: 1, wifiName: 1, wifiPassword: 1 }, function(err, result) {

        if (err) {
            res.json(CreateObjService.response(true, err));


        } else {
            res.json(CreateObjService.response(false, result));

        }

    })


})

router.get('/geTallParlorGst', function(req, res) {

    var data = [];

    Parlor.find({}, {
        gstNumber: 1,
        name: 1,
        wifiName: 1,

        wifiPassword: 1
    }, function(err, result) {

        if (err) {
            res.json(CreateObjService.response(false, "Something went wrong try again."));
        }

        if (result.length > 0) {
            async.each(result, function(r, cb) {
                Admin.find({ "parlorId": r._id, "active": true }, { firstName: 1, lastName: 1, accountNo: 1, "_id": 0 }, function(err, empWithoutAccounts) {

                    if (empWithoutAccounts.length > 0) {

                        var empWithout = [];

                        for (var i = 0; i < empWithoutAccounts.length; i++) {
                            if (empWithoutAccounts[i].accountNo == undefined || isNaN(parseInt(empWithoutAccounts[i].accountNo)) || empWithoutAccounts[i].accountNo.length < 6) {
                                empWithout.push(empWithoutAccounts[i].firstName + " " + (empWithoutAccounts[i].lastName === undefined ? "" : empWithoutAccounts[i].lastName));
                                console.log(empWithoutAccounts[i].accountNo + " " + empWithoutAccounts[i].firstName);
                            } else {
                                console.log(empWithoutAccounts[i].accountNo + " " + empWithoutAccounts[i].firstName);
                            }
                        }

                        data.push({ gstNumber: r.gstNumber, name: r.name, wifiName: r.wifiName, wifiPassword: r.wifiPassword, "empWithoutAccounts": empWithout });
                    } else {
                        data.push({ gstNumber: r.gstNumber, name: r.name, wifiName: r.wifiName, wifiPassword: r.wifiPassword, "empWithoutAccounts": empWithout });
                    }

                    cb();
                })
            }, function(done) {

                res.json(CreateObjService.response(false, data));

            });
        }

    })
})

router.get('/getParlorDetails', function(req, res) {

    Parlor.find({}, { name: 1, parlorLiveDate: 1, active: 1 }, function(err, data) {

        res.json(data)

    })
})

router.post('/changeItemStatus', function(req, res) {

    console.log(req.body)
    var itemId = req.body.Id;
    var active = req.body.active;
    InventoryItem.update({ _id: itemId }, { $set: { active: active } }, function(err, updatedd) {
        console.log(updatedd)
        ParlorItem.update({ inventoryItemId: itemId }, { $set: { active: active } }, { multi: true }, function(err, updated) {
            console.log(updated)
            console.log(err)

            res.json("updated")
        })
    });
});


// -------------------------------adhaar-------------------------

router.post('/getItemsToAdd', function(req, res) {

    var pid = req.session.parlorId;
    console.log(req.session.parlorId)
    console.log(ObjectId(req.body.sellerId))


    ParlorItem.aggregate([{
            $match: {
                // active: true,
                sellerId: ObjectId(req.body.sellerId),
                "parlorId": ObjectId(pid)
            }
        },
        {
            $group: {
                "_id": "$productCategoryId",
                sum: { $sum: "$quantity" },
                sellerId: { $first: "$sellerId" },
                sellerName: { $first: "$sellerName" },
                data: {
                    $push: {

                        "itemId": "$inventoryItemId",
                        "productCategoryId": "$productCategoryId",
                        "productCategoryName": "$productCategoryName",
                        "sellerId": "$sellerId",
                        "sellerName": "$sellerName",
                        "name": "$name",
                        "quantity": "$quantity",
                        "actualQuantity": "$quantity",
                        "status": "$orderedStatus",
                        "minimumQuantity": "$minimumQuantity",
                        "itemIdd": "$itemId",
                        "costPrice": "$costPrice"


                    }
                }
            }
        }, {
            $project: {
                _id: 1,
                "data": 1,
                "sum": 1,
                "sellerId": 1,
                "sellerName": 1
            }

        }
    ]).exec(function(err, resData) {




        res.json(CreateObjService.response(false, resData));

    })


})

router.post('/addItemToOrder', function(req, res) {
    console.log(req.body.data)

    async.each(req.body.data, function(e, cb) {
        var obj = {
            "itemId": e.itemId,
            "status": e.status,
            "categorySum": e.sum,
            "categoryName": e.productCategoryName,
            // "quantity":e.quantity,
            "productCategoryName": e.productCategoryName,
            "productCategoryId": e.productCategoryId,
            "orderedQuantity": e.orderedQuantity,
            "actualQuantity": e.actualQuantity
        }
        console.log(obj)
        ReOrder.update({ _id: req.body.orderId }, { $push: { items: obj } }, function(err, order) {
            if (err) {
                console.log(err)
                cb();

            } else {
                cb();
            }
        })
    }, function() {
        res.json(CreateObjService.response(false, "done"))
    })

});



router.post('/createCustomCouponCodeSalonWise' , function(req, res){
    var currentMonthStart = HelperService.getCurrentMonthStart(new Date());
    SalonCouponSms.find({parlorId : req.session.parlorId , createdAt : {$gte : currentMonthStart , $lte : new Date()}} , function(err , totalSms){

    if(totalSms.length < 1000){

            var phoneNumbers;
            if(req.body.phoneNumbers.length >= 1000) phoneNumbers = req.body.phoneNumbers.slice(0,999);
            else phoneNumbers = req.body.phoneNumbers;
            var message = req.body.message;
            var now_date = new Date();
                 now_date.setMonth(now_date.getMonth() + 1);
            var couponObj = {
                    "active" : true,
                    "expires_at" : now_date,
                    "couponType" : 13,
                    "createdAt" : new Date(),
                    "limit" : 300,
                    "offPercentage" : 20,
                    "couponDescription" : "Use code BACK for 20% flat",
                    "couponTitle" : "Get 20% Off",
                    "parlorId" : req.body.parlorId,
                }
                var newString = "", alphabet = "ABCDEFGHIJKLMNPQRSTUVWX";   
                while (newString.length < 5) {
                    newString += alphabet[Math.floor(Math.random() * alphabet.length)];
                }

                couponObj.code = "BACK";
            async.each(phoneNumbers , function(phoneNumber , cb){
                User.update({phoneNumber : phoneNumber}, {$push : {couponCodeHistory :{$each : [couponObj]}}}, function(err , updated){
                    SalonCouponSms.create({parlorId: req.session.parlorId , createdAt : new Date() , phoneNumber : phoneNumber}, function(err , smsCreated){
                        cb();
                    })    
                })
            }, function all(){
                // message = message.replace(/'/g, "%27")
                User.sendSmsToUsers(phoneNumbers, message);
                res.json('Coupon Codes Sent Successfully')
            })
        }else{
            res.json('Your SMS limit for this month has exceeded');
        }
    })
})


module.exports = router;