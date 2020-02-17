//Strictly for Faltu Apis

'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var request = require('request');
var nodemailer = require('nodemailer');
var async = require('async');

const fs = require('fs');
const Guid = require('guid');
const bodyParser = require("body-parser");
const Mustache = require('mustache');
const Request = require('request');
const Querystring = require('querystring');
const app = express();


/*
router.get('/checkVoice' , function(req, res){
    let plivo = require('plivo');
    var client = new plivo.Client('MAZGE1NWMZOTFLMJC0NW', 'ZGMyZDk5NGYyM2FkNGZiODUzYWVjZjFjMTVmZjQx');
    client.calls.create(
        "9695748822", // from
        "919929977668", // to
        "https://s3.amazonaws.com/plivosamplexml/speak_url.xml", // answer url
        {
            answerMethod: "GET",
        },
    ).then(function (response) {
        res.json(response);
    }, function (err) {
        console.error(err);
    });

})
*/

//11 am


router.get('/checkDate', function(req, res){
    res.json(HelperService.getCustomMonthStartDate(2019,5))
})

router.get('/subscriptionDataReport', function(req, res){
    
})


router.get('/reportYearly2', function(req, res){
    let startDate = new Date(2017, 2, 1)
    let endDate = new Date(2017, 3, 1)
    Appointment.aggregate([
    {
        $match : {
            status : 3,
            appointmentStartTime : {$gt : startDate, $lt : endDate},
        }
    },
    {
        $project : {
            "clientId" : "$client.id",
            appointmentType : 1,
            loyalitySubscription : "$client.subscriptionLoyality",
            noOfServices : {$size: "$services"},
            serviceRevenue : 1
        }
    },
    {
        $group:{
            _id : null,
            clientIds : {$push : "$clientId"},
            totalTransaction : {$sum : 1},
            totalServiceRevenue : {$sum : "$serviceRevenue"},
            noOfServices : {$sum : "$noOfServices"},
            totalAppTransaction : {$sum : {$cond: { if: { $eq: [ "$appointmentType", 3 ] } , then: 1, else: {$cond: { if: { $gt: [ "$loyalitySubscription", 0 ] } , then: 1, else: 0 } } } } },
            totalAppServiceRevenue : {$sum : {$cond: { if: { $eq: [ "$appointmentType", 3 ] } , then: "$serviceRevenue", else: {$cond: { if: { $gt: [ "$loyalitySubscription", 0 ] } , then: "$serviceRevenue", else: 0 } } } } }
        }
    }
    ]).exec(function(err, data){
        let clientIds = _.map(data[0].clientIds, function(c){return ObjectId(c)})
        Appointment.aggregate([
        {
            $match : {
                status : 3,
                "client.id": {$in : clientIds},
                appointmentStartTime : {$lt : endDate}
            },
        },
        {
            $group:{
                _id: "$client.id",
                noOfAppointments : {$sum : 1}
            }
        },
        {
            $project:{
                clientId : "$_id",
                repeatClient : {$cond: { if: { $eq: [ "$noOfAppointments", 1 ] } , then: 0, else: 1 } },
                newClient : {$cond: { if: { $eq: [ "$noOfAppointments", 1 ] } , then: 1, else: 0 } },
            }
        },
        {
            $group : {
                _id : null,
                repeatCustomers : {$sum : "$repeatClient"},
                newClient : {$sum : "$newClient"}
            }
        }
        ]).exec(function(er, repeatData){
            res.json({newClients : repeatData[0].newClient, repeatClients : repeatData[0].repeatCustomers})

    })
})
})

router.get('/reportYearly', function(req, res){
    let startDate = new Date(2019, 5, 1)
    let endDate = new Date(2019, 6, 1)
    Appointment.aggregate([
    {
        $match : {
            status : 3,
            appointmentStartTime : {$gt : startDate, $lt : endDate},
            serviceRevenue : {$gt : 0},
        }
    },
    {
        $project : {
            "clientId" : "$client.id",
            appointmentType : 1,
            loyalitySubscription : "$client.subscriptionLoyality",
            noOfServices : {$size: "$services"},
            serviceRevenue : 1
        }
    },
    {
        $group:{
            _id : null,
            clientIds : {$push : "$clientId"},
            totalTransaction : {$sum : 1},
            totalServiceRevenue : {$sum : "$serviceRevenue"},
            noOfServices : {$sum : "$noOfServices"},
            totalAppTransaction : {$sum : {$cond: { if: { $eq: [ "$appointmentType", 3 ] } , then: 1, else: {$cond: { if: { $gt: [ "$loyalitySubscription", 0 ] } , then: 1, else: 0 } } } } },
            totalAppServiceRevenue : {$sum : {$cond: { if: { $eq: [ "$appointmentType", 3 ] } , then: "$serviceRevenue", else: {$cond: { if: { $gt: [ "$loyalitySubscription", 0 ] } , then: "$serviceRevenue", else: 0 } } } } }
        }
    }
    ]).exec(function(err, data){
        let clientIds = _.map(data[0].clientIds, function(c){return ObjectId(c)})
        Appointment.aggregate([
        {
            $match : {
                status : 3,
                "client.id": {$in : clientIds},
                appointmentStartTime : {$lt : endDate}
            },
        },
        {
            $group:{
                _id: "$client.id",
                noOfAppointments : {$sum : 1}
            }
        },
        {
            $match :{noOfAppointments : {$gt : 1}}
        },
        {
            $group : {
                _id : null,
                repeatCustomers : {$sum : 1}
            }
        }
        ]).exec(function(er, repeatData){
            Appointment.aggregate([
        {
            $match : {
                status : 3,
                "client.id": {$in : clientIds},
                appointmentStartTime : {$gt : startDate, $lt : endDate},
            },
        },
        {
            $group:{
                _id: "$client.id",
                noOfAppointments : {$sum : 1}
            }
        },
        {
            $match :{noOfAppointments : {$gt : 1}}
        },
        {
            $group : {
                _id : null,
                repeatTransactions : {$sum : "$noOfAppointments"}
            }
        }
        ]).exec(function(er, repeatTransactions){
            res.json({repeatClients : repeatData[0].repeatCustomers, totalTransaction : data[0].totalTransaction, totalAppTransaction : data[0].totalAppTransaction, noOfServices : data[0].noOfServices, totalAppServiceRevenue : data[0].totalAppServiceRevenue, totalServiceRevenue : data[0].totalServiceRevenue, repeatTransactions : repeatTransactions[0].repeatTransactions})
        })
        })
    })
})


router.get('/monsoonVivekReport', function(req, res){
    LuckyDrawDynamic.aggregate([
        {$match : {parlorId : {$in : [ObjectId("5b5b1dde715b6407d175c383"),ObjectId("5bf8f48f40fdce4d68d83771"),ObjectId("5c063348b0fb9e4f4dec97e5"),ObjectId("5c08cda133e7d52c0b67c922"),ObjectId("5c0f56505e63ee63d6edd9a3"),ObjectId("5c11108c21b2f86fd95ad281"),ObjectId("5c236251c3f2cf6c82c8bfb7"),ObjectId("5cb7024a28fc7c3e8df4b1cc"),ObjectId("5ccafc18787e1142a79a4e48")]}, settlementPeriod: {$gte : 350}},
        },
        {$project : {amount : 1, period : 1, parlorId : 1, employeeId : 1, employeeName : 1, settlementPeriod : 1, settlementDate : 1, status : 1, paid : 1}},
        {
            $lookup : {
                from : "owners",
                localField : "employeeId",
                foreignField : "_id",
                as : "employee",
            }
        },
        {
            $project : {
                employeeId : 1,
                razorPayId : { $arrayElemAt: [ "$employee.razorPayAccountId", 0 ] },
                amount : 1, period : 1, parlorId : 1, employeeId : 1, employeeName : 1, settlementPeriod : 1, settlementDate : 1, status : 1, paid : 1
            }
        },
        {$sort : {settlementPeriod : 1}}
    ]).exec(function(err, data){
        console.log(err)
        res.json(data)
    })
})
// ObjectId("5b03fff617062537784015b6")
router.get('/parlorCustomers', function(req, res){
    Appointment.aggregate([
        {$match : {"parlorId" :ObjectId("5971dc4760925c726cfb420e"), status : 3} },
        {$project : {"client.id" : 1, "client.phoneNumber" : 1, "client.name" : 1}},
        {$group : {_id : "$client.id", phoneNumber : {$first : "$client.phoneNumber"}, name : {$first : "$client.name"}}}
        ])
    .exec(function(err, phoneNumbers){
        res.json(phoneNumbers)
    })
})


router.get('/updateCustomerCareFacebookQuerySubscription', function(req, res){
    FacebookQuery.updateConversionsSubscription(req, function(){
        res.json('done')
    })
})

router.get('/updateCustomerCareFacebookQueryAppointment', function(req, res){
    FacebookQuery.updateConversionsAppointment(req, function(){
        res.json('done')
    })
})

router.get('/checkSubscriptionUsedByGift', function(req, res){
    SubscriptionSale.find({source : "GIFT"}, {userId : 1}, function(err, ss){
        console.log(ss.length)
        var userIds = _.map(ss, function(s){return ObjectId(s.userId)})
        Appointment.aggregate([
        {
            $match : {
                "client.id" : {$in : userIds},
                status : 3,
                loyalitySubscription : {$gt : 0}
            }
        },
        {
            $group : {
                _id : "$client.id",
                clientId : {$first : "$client.id"},
                count : {$sum : 1}
            }
        }/*,
        {
            $group :{
                _id : null,
                count : {$sum : 1}
            }
        }*/
        ]).exec(function(err, d){
            res.json(d)
        })
    })
})

router.get('/getCorporateDetails', function(req, res){
    CorporateCompanyRequest.find({}, {userId  :1,companyName : 1, hrEmail : 1, createdAt : 1}, function(err, corporates){
        var data = []
        Async.each(corporates, function(c, cb){
            User.findOne({_id : c.userId}, {firstName : 1, phoneNumber : 1, emailId : 1}, function(err, u){
                data.push({
                    name : u.firstName,
                    phoneNumber : u.phoneNumber,
                    emailId : u.emailId,
                    companyName : c.companyName,
                    hrEmail : c.hrEmail,
                    createdAt : c.createdAt,
                })
                cb()
            })
        },  function allDone(){
            res.json(data)
        })
    })
})


/*router.get('/couponReminder', function(req, res){
    let startDate =  HelperService.getBeforeByDayStart(1), endDate = HelperService.getBeforeByDayStart(0)
    User.aggregate([
        {
            $match : {"couponCodeHistory.code" : "APP50",
                createdAt : {$gt : startDate,  $lt : endDate}}
        },
        {
            $project : {userId : "$_id", phoneNumber : 1}
        },
        {
            $lookup : {
                from : "appointments",
                localField : "userId",
                foreignField : "client.id",
                as : "user",
            }
        },
        {
            $project : {
                userId : 1,
                phoneNumber : 1,
                status : { $arrayElemAt: [ "$appointments.status", 0 ] },
            }
        },
        {
            $match : {status : {$nin : [1,3, null]}}
        }
    ]).exec(function(err, users){
        res.json(users)
    })
});*/

router.get('/checkNewUserAppointment', function(req, res){
    let startDate = new Date(2019, 3, 21)
    let endDate = new Date(2019, 3, 27, 23, 59)
    let totalUser = 0, totalUserAppointmentCompleted = 0, subscriberCount = 0
    User.find({ $or : [{firebaseId : {$ne : null}}, {firebaseIdIOS : {$ne :null}}], createdAt : {$gt : startDate, $lt : endDate} }, {phoneNumber : 1, subscriptionId : 1}).exec(function(err, users){
        Async.each(users, function(user, cb){
            if(user.subscriptionId)subscriberCount ++
            Appointment.find({appointmentStartTime : {$gt : startDate, $lt : endDate}, "client.id" : user.id, appointmentType : 3, status : 3}).count(function(err, count){
                if(count>0)totalUserAppointmentCompleted++
                totalUser ++
                cb()
            })
        }, function allDone(){
            res.json({totalUser : totalUser, totalUserAppointmentCompleted : totalUserAppointmentCompleted, percentage : (totalUserAppointmentCompleted/totalUser)*100, subscriberCount : subscriberCount})
        })
    })
})

router.get('/sendSmsXml', function(req, res){
    console.log(HelperService.getTimeInMsgFormate(new Date(2019, 3, 17, 15, 10)))
    ParlorService.sendSmsAfterminutes(["9695748822", "8826345311"], new Date(2019, 3, 17, 15, 10), 'Welcome to Be U Salons. As a welcome gift, we have added a 50% discount coupon (max Rs 500) on your account, which you can redeemed on any services of your choice, within next 24 hours.')
})

router.get('/salonSubscriptionAverage', function(req, res){
    SubscriptionSale.find({createdAt : {$gt : new Date(2019, 3, 1)}, actualPricePaid : {$gt : 0}}, {actualPricePaid : 1, userId : 1}, function(er, sales){
        let totalAmount = 0, totalUser = 0;
        Async.each(sales, function(s, callback){
            User.findOne({_id : s.userId}, function(er, user){
                if(user){
                    totalUser ++
                    totalAmount += s.actualPricePaid
                }
                callback()
            })
        }, function allDone(){
            res.json({totalAmount : totalAmount, totalUser : totalUser})
        })
    })
})


// EMINDER - Your 100 B-Cash expires tonight, so book now https://beusalons.app.link/Gc7HfpfrXV
router.get('/bCashReminder200', function(req, res){
    let phoneNumbers = []
    User.aggregate([
        {
            $match : {
                createdAt : {$gt : HelperService.getBeforeByDayStart(8),  $lt : HelperService.getBeforeByDayStart(7)},
                loyalityPoints : 200
            },
        },
        {
            $project : {
                phoneNumber : "$phoneNumber",
                userId : "$_id"
            },
        }
    ]).exec(function(err, clients){
        let numbers = _.map(clients, function(c){return c.phoneNumber})
        ParlorService.sendSmsAfterminutes(numbers, HelperService.addHrsAfter(1), 'REMINDER - Your 200 B-Cash expires tonight, so book now https://beusalons.app.link/Gc7HfpfrXV')
        res.json('done')
    })
})

router.get('/addLoyalityPointsToNewUser', function(req, res){
    let numbers = []
    User.aggregate([
        {
            $match : {
                createdAt : {$gt : HelperService.getBeforeByDay(2),  $lt : HelperService.getBeforeByDay(1)},
            },
        },
        {
            $project : {
                phoneNumber : "$phoneNumber",
                userId : "$_id"
            },
        }
    ]).exec(function(err, clients){
        Async.forEach(clients, function(c, callback){
            Appointment.findOne({"client.phoneNumber" : c.phoneNumber, status : 3}, {parlorId : 1}, function(erm, appointment){
                if(!appointment){
                    User.update({phoneNumber : c.phoneNumber}, {loyalityPoints : 200, freebieExpiry : HelperService.addDaysToDate2(5)}, function(er, f){
                        numbers.push(c.phoneNumber)
                        callback()
                    })    
                }else{
                    callback()
                }
            })
        }, function allDone(){
            ParlorService.sendSmsAfterminutes(numbers, HelperService.addHrsAfter(13), 'Second Chance for you - 200 B-Cash (100% redeemable) have been added to your account. Book within next 7 days. https://beusalons.app.link/Gc7HfpfrXV')
            res.json('done')
        })
    })
})



router.get('/addLoyalityPointsToNewUser2', function(req, res){
    let numbers = []
    User.aggregate([
        {
            $match : {
                _id : ObjectId("5cade2d2a1440a6a8a286304"),
                createdAt : {$gt : HelperService.getBeforeByDay(8),  $lt : HelperService.getBeforeByDay(7)}
            },
        },
        {
            $project : {
                phoneNumber : "$phoneNumber",
                userId : "$_id"
            },
        }
    ]).exec(function(err, clients){
        Async.forEach(clients, function(c, callback){
            Appointment.findOne({"client.phoneNumber" : c.phoneNumber, status : 3}, {parlorId : 1}, function(erm, appointment){
                if(!appointment){
                    User.update({phoneNumber : c.phoneNumber}, {loyalityPoints : 100, freebieExpiry : HelperService.addDaysToDate2(30)}, function(er, f){
                        numbers.push(c.phoneNumber)
                        callback()
                    })
                }else{
                    callback()
                }
            })
        }, function allDone(){
            ParlorService.sendSmsAfterminutes(numbers, HelperService.addHrsAfter(13), 'Third Chance for you - 200 B-Cash (100% redeemable) have been added to your account. Book within next 30 days. https://beusalons.app.link/Gc7HfpfrXV')
            res.json('done')
        })
    })
})

router.get('/checkSubscriptionUsed' , function(req, res){
    Appointment.aggregate([
    {
        $match : {
            loyalitySubscription : {$gt : 0},
            status : 3,
            appointmentStartTime : {$gt : new Date(2019, 6, 1), $lt : new Date(2019, 6, 30, 23)}
        }
    },
    {
        $project :{
            clientId : "$client.id",
            loyalitySubscription : "$loyalitySubscription",
            parlorName : 1,
            appointmentStartTime : 1,
        }
    },
    {
        $sort : {appointmentStartTime : 1}
    },
    {
        $group :{
            _id : "$clientId",
            subscriptionAmount : {$sum : "$loyalitySubscription"},
            appointmentStartTime : {$push : "$appointmentStartTime"},
            clientId : {$first: "$clientId"},
            parlorName : {$first: "$parlorName"}
        }
    },
    {
        $match : {
            subscriptionAmount : {$gt : 500}
        }
    }
    ]).exec(function(err, appointments){
        let data = []
        Async.each(appointments, function(a, cb){
            SubscriptionSale.findOne({userId : a.clientId}).sort({createdAt : -1}).exec(function(err, subscriptionsSold){
                if(a.appointmentStartTime.length>1){
                    a.subscriptionsSold = subscriptionsSold.createdAt
                    if(subscriptionsSold.createdAt.getDate()>a.appointmentStartTime[0].getDate() && subscriptionsSold.createdAt.getDate()<a.appointmentStartTime[1].getDate()){

                    }else{
                        data.push(a)
                    }
                }
                
                cb()
            })
        }, function allDone(){
            res.json(data)
        })
    })
})


router.get('/sendSubscriptionGiftSms' , function(req, res){
    let rounds = []
    for(var i = 0; i<54; i++){
        rounds.push(i)
    }
    Async.eachSeries(rounds, function(r, cb){
        User.find({subscriptionId : 1, firebaseId : {$ne : null}}, {phoneNumber : 1}).sort({$natural : -1}).skip(r*100).limit(100).exec(function(err, users){
                console.log("round - ", r)
                console.log(users.length)
                    let phoneNumbers = []
                    _.forEach(users, function(user){
                        phoneNumbers.push(user.phoneNumber)
                    })
                    var usermessage = Appointment.giftSms(phoneNumbers, "Dear Subscriber, Now gift 1 month free subscriptions trial to 5 loved ones (yes, they can use Rs 500 worth service for 1 month for free). Refer now: https://beusalons.app.link/Usi8tFyHLK");
                    if(phoneNumbers.length>0){
                        Appointment.sendSMS(usermessage, function (e) {
                            cb();
                        });  
                    }else{
                        cb();
                    }
                })
    }, function allDone2(){
        console.log('done all');
        res.json('done all')
    })
})

router.get('/sendNotificationToUserApp', function(req, res){
    let number = 42896;
    let rounds = []
    for(var i = 0; i<429; i++){
        rounds.push(i)
    }
    Async.eachSeries(rounds, function(r, cb){
        User.find({_id : ObjectId("5cac76f6cf6b3266c7e7ac0a"), subscriptionId : 1, $or : [{firebaseId : {$ne : null}}, {firebaseIdIOS : {$ne :null}}]}, {firebaseId : 1, firebaseIdIOS : 1}).sort({$natural : -1}).skip(r*100).limit(100).exec(function(err, users){
                console.log(users.length)
                var data1 = { type: 'subscription', title: "Gift subscription", body: "Gift subscription for FREE", sImage: "http://res.cloudinary.com/dyqcevdpm/image/upload/v1484301569/aalenes%20EOK.jpg", lImage: "http://res.cloudinary.com/dyqcevdpm/image/upload/v1484301569/aalenes%20EOK.jpg" };
                let firebaseIds = [], firebaseIdsIOS = []
                _.forEach(users, function(user){
                    if(user.firebaseId){
                        firebaseIds.push(user.firebaseId)
                    }
                    if(user.firebaseIdIOS){
                        firebaseIdsIOS.push(user.firebaseIdIOS)
                    }
                })
                Async.parallel([
                        function(callback){
                            if(firebaseIds.length>0){
                                Appointment.sendAppNotificationMulti(firebaseIds, data1, function(err, response) {
                                    callback()
                                });      
                            }else{
                                callback()
                            }
                        },
                        function(callback){
                            if(firebaseIdsIOS.length>0){
                                Appointment.sendAppNotificationIOSMulti(firebaseIdsIOS, data1, function(err, response) {
                                    callback()
                                });
                            }else{
                                callback()
                            }
                        }
                    ], function done(){
                        cb()
                    })
                })
    }, function allDone2(){
        console.log('done all');
        res.json('done all')
    })
})


// router.get('/luckyDrawFail', function(req, res){
//      LuckyDrawDynamic.find({createdAt : {$gte : HelperService.getDayStart(thisLuckyDrawDate) , $lte: HelperService.getDayEnd(thisLuckyDrawDate)} , status:2}, function(err , nonUpdated){
//             if(nonUpdated.length > 0){
//                 async.each(nonUpdated , function(np , cb){
//                     LuckyDrawDynamic.update({ _id : np._id}, {status : 4, updatedAt : new Date()} , function(err , luckyDraw){
//                         let message = 'Your lucky draw of amount Rs '+np.amount+' has failed. Please check your account deatils. ';
//                         Appointment.msg91Sms(employee.phoneNumber, message, function(e) {
//                             if(e)
//                                 cb();
//                             else
//                                 cb();
//                         });
//                     })
//                 }, function all(){
//                     res.status(200);
//                     res.send();
//                 })
//             }else{
//                 res.status(200);
//                 res.send();
//             }   
//         })
// })
router.get('/emplo', function(req, res){


            SettlementReport.find({period:334}, { period: 1, createdAt: 1, endDate: 1 }).sort({ $natural: -1 }).limit(1).exec(function(err, settlement) {
                var tempStartDate = HelperService.addDaysToDate(settlement[0].endDate , 1)
                var startDate = HelperService.getDayStart(tempStartDate);
                var date2 = new Date();
                var yesterday = date2.setDate(date2.getDate() - 1);
                var endDate = HelperService.getDayEnd(yesterday);
                var period = settlement[0].period + 1;
                console.log(period);
                console.log("startDate" , startDate);
                console.log("endDate" ,endDate);
                
                var daysToBeCalculated = HelperService.getDaysBetweenTwoDates(startDate, endDate)
                if(daysToBeCalculated == 1 || daysToBeCalculated == 2 || daysToBeCalculated == 3){
                    // LuckyDrawDynamic.subscriptionAmount(startDate, endDate); 
                    // LuckyDrawDynamic.onNonSubscriberAppTransaction(startDate, endDate); 
                    // LuckyDrawDynamic.luckyDrawOnFacial(startDate, endDate); 
                    LuckyDrawDynamic.findIncentiveType( startDate, endDate , period)
                }
            })
        
})

router.get('/sendLuckyDrawAPI', function(req, res){
    
    
    SettlementReport.findOne({period:368}, {startDate:1, endDate:1, period:1}).sort({$natural:-1}).exec(function(err , sett){
        
        let query = {settlementPeriod : sett.period, status:0, categoryId : {$in : ["20" , "21" , "22"]}, transferObj: {$exists : false},manualTransfer: {$exists : false}}
        LuckyDrawDynamic.sendLuckyDrawSchedular(query);
    })
    // SettlementReport.findOne({period:312}, {startDate:1, endDate:1}).sort({$natural:-1}).exec(function(err , sett){
        
    //     let query = {createdAt :{$gte: sett.startDate , $lte:sett.endDate}, status:0, categoryId : {$in : ["13" , "23" , "24"]},transferObj: {$exists : false}, manualTransfer: {$exists : false}}
    //     LuckyDrawDynamic.sendLuckyDrawSchedular(query);
    // })
            
})
router.get('/sendNormalLuckyDrawAPI', function(req, res){
    let query ={createdAt:{$lt:new Date(2019,6,12),$gt:new Date(2019,4,1)},transferObj: {$exists : false},status:0,parlorId:{$in:[ObjectId("5b5b1dde715b6407d175c383"),ObjectId("5bf8f48f40fdce4d68d83771"),ObjectId("5c063348b0fb9e4f4dec97e5"),
    ObjectId("5c08cda133e7d52c0b67c922"),ObjectId("5c0f56505e63ee63d6edd9a3"),ObjectId("5c0fbf220a260d18626b6b82"),ObjectId("5c11108c21b2f86fd95ad281"),ObjectId("5c236251c3f2cf6c82c8bfb7"),ObjectId("5cb7024a28fc7c3e8df4b1cc"),ObjectId("5ccaed9f34c66330d14fd6a3"),ObjectId("5ccafc18787e1142a79a4e48")]},categoryId:{$in:["13","23","24"]}
    }
    LuckyDrawDynamic.sendLuckyDrawSchedular(query);
            
})

router.get('/activeOwners', function(req, res){
    let data = [];
    Parlor.find({active : true}, {name : 1}, function(err, parlors){
        Async.each(parlors, function(p, callback){
            Admin.find({$or : [{parlorId : p.id}, {parlorIds : p.id}]}, {phoneNumber : 1}, function(err, admins){
                _.forEach(admins, function(a){
                    data.push(a.phoneNumber)
                })
                callback()
            })
        }, function allDone(){
            res.json(data);
        })
    })
})

router.get('/zarikaUser', function(req, res){
   MarketingUser.find({lastParlorId : ObjectId("588998adf8169604955dcd3b")}, {phoneNumber : 1}, function(err, users){
        _.forEach(users, function(u){
            Appointment.findOne({parlorId : { $neq: ObjectId("588998adf8169604955dcd3b")}, "client.phoneNumber" : u.phoneNumber, status : 3}, function(er, a){
                if(a)console.log("true")
                    else console.log("false")
            })
        })
   })
})

router.get('/febSubscriptionCouponCode', function(req, res){
    SubscriptionSale.aggregate(
[{$match : {createdAt : {$gt : new Date(2019, 1, 1)}}}, 
{$group : {_id : "$couponCode", couponcode : {$first : "$couponCode"}, count : {$sum : 1}}}, 
{$sort : {count : -1}}]).exec(function(err, data){
    res.json(data)
})
})

router.get('/checkNotification', function(req, res){
    Appointment.findOne({_id : ObjectId("5c99df96e37d7052e8c54261")}, function(err, appointment){
        Admin.find({ $and: [{ $or: [{ parlorIds: appointment.parlorId }, { parlorId: appointment.parlorId }] }, { role: { $in: [2, 7] } }] }, { firebaseId: 1 }, function(err, empl) {
            let firebaseIds = []
            _.forEach(empl, function(e) {
                firebaseIds.push(e.firebaseId);
            })
            var title = 'Appointment has been booked';
            var body = 'Total Payable Amount is: ' + appointment.payableAmount;
            var type = 'appointmentRevenue';
            _.forEach(firebaseIds, function(firebaseId) {
                ParlorService.sendIonicNotification(firebaseId, title, body, type, appointment.id, function() {
                    console.log('done')
                });
            })
        });
    })
})

//24 May
router.get('/updateUserSource', function(req, res){
    let number = 50000;
    let rounds = []
    for(var i = 0; i<500; i++) {
        rounds.push(i)
    }
    Parlor.find({}, {latitude : 1, longitude : 1}, function(er, parlors){
        Async.eachSeries(rounds, function(r, cb){
            Appointment.find({$or : [{appointmentType:3,status:3, "client.noOfAppointments" : 0}, {"client.noOfAppointments" : 0, status : 3,couponCode : {$ne : null}}]}, {"client.id" : 1, latitude : 1, longitude : 1, parlorId : 1}).sort({appointmentStartTime : 1}).skip(r*100).limit(100).exec(function(err, users){
                        Async.each(users, function(a, callback){
                            if(!a.latitude){
                                a.latitude= 0
                                a.longitude= 0
                            }
                            let p = _.filter(parlors, function(par){ return par.id + "" == a.parlorId + ""})[0]
                            if(p && HelperService.getDistanceBtwCordinates(a.latitude, a.longitude, p.latitude, p.longitude) > .05){
                                Appointment.update({"client.id" : a.client.id, parlorId : a.parlorId, status : 3}, {userSource : 1}, {multi: true}, function(er, f){
                                    callback()
                                })
                            }else{
                                Appointment.update({"client.id" : a.client.id, parlorId : a.parlorId, status : 3}, {userSource : 2}, {multi: true}, function(er, f){
                                    callback()
                                })
                            }
                        }, function allDone(){
                            console.log('done' + r)
                            cb()
                        })
                    })
        }, function allDone2(){
            console.log('done all');
            res.json('done all')
        })
    })
})



router.get('/naukriNumber', function(req, res){
    let data = [];
    let naukridata = [{"name":"Nishtha","title":"Urgently looking for job for day shift","isPremium":false,"isFeatured":false,"isNew":false,"employement":{"current":{"designation":"Inside Sales Executive","organization":"iYogi"},"previous":{"designation":null,"organization":null}},"salary":{"type":"INR","ctc":"0.0 Lacs"},"experience":{"years":1,"months":0},"location":"Delhi","education":{"ppg":null,"pg":null,"ug":{"course":"B.Com","institute":"school of open learning (DU)","year":"2013"}},"preferredLocation":"Delhi","imageId":null,"keySkills":"e-commerce, Banking, Accounting, , Backend, Front End, Day shifts,Banking,Accounting,Backend,Front End,Day shifts","activeDate":1545503400,"modifyDate":1544985000,"phoneStatus":2,"isEmailVerified":true,"uniqueId":"cbf5e978a047f3702a5334cf94f4112b5d550807431000100611135f0858591e14080202144459580a534a16096","userId":"84022784","numberOfViews":"14","numberOfDownloads":"1","isCVAttached":true,"similarCVsCount":0,"commentsCount":0,"viewDate":0,"viewDateOtherSubUser":1548095400,"activeTag":null,"uname":"6aedd4b7ac5cf8febd752ba5b2fa5bc806044a090e4b580f5a5219585f79061742504d1d421e056","key":"046cc960072d182b64ee78c15d5d05e206044a090e4b580f5a5219585f79061742504d1d421e051145594e130b130419456","certifiedFlag":null,"mobileVerifiedDate":1356978600,"focusSkills":"Back Office,Inside Sales,Bcom,Sales Executive Activities,Administration Work,Lead Generation","interestedIn":null,"isPhone":true,"isMobile":true,"resdexFlag":"a","contactedDate":0,"downloadDate":0,"viewDateEarliest":1548095400,"downloadDateOther":0,"contactedDateOther":1550773800,"smsDate":0,"isFresher":false,"isNotDisclosed":false}];
    Async.each(naukridata, function(n, callback){
        var url = "https://resdex.naukri.com/v2/ajax/getContactNumber?sid=3240577975&key="+n.key+"&src=SRP"
        console.log(url)
        Request.get({ url: url, json: true }, function(err, resp, respBody) {
            console.log(respBody)
            data.push({
                name : n.name,
                phoneNumber : respBody.mobNo
            })
            console.log("done",  respBody.mobNo);
            callback()
        });
    }, function alldone(){
        res.json(data)
    });
});

router.get('/yesMadamApi', function(req, res){
    // https://api-live.yesmadam.com/userapi/register
    let responsed = [] 
    var phoneNumbers = []
    for(var i=0; i<1000; i++){
        let phoneNumber = 8826345311 + i
        phoneNumbers.push(phoneNumber)
    }

    async.each(phoneNumbers, function(p, callback) {
        let options = {
        url: 'https://api-live.yesmadam.com/userapi/register',
        headers: {
            'Content-Type': 'application/json'
        },
        "json": {
           mobile : p
        }
    }
        request.post(options, function(err, res1, body) {
                if (err) {
                    console.log(err)
                        // cb();
                } else {
                    // var json = JSON.parse(body);
                    console.log("done" + p)
                    if(body.message=="Mobile number already exist"){
                        console.log("found")
                        responsed.push({phoneNumber : p});
                    }
                    callback()
                    // cb();
                }
            });
    }, function allDone(){
        console.log(responsed)
        // res.json(responsed)
    });    
})

router.get('/getDuplicateServicesFromSalon' , function(req, res){
    var d= [];
    Parlor.find({} , {"services.serviceCode":1 ,'services._id' :1, name:1} , function(err , parlors){
        async.each(parlors , function(parl , callback){
            var serviceCodes =[];
            _.forEach(parl.services , function(ser){
                serviceCodes.push(ser.serviceCode)
            });

            const object = {};
            const duplicates = [];

            serviceCodes.forEach(item => {
              if(!object[item])
                  object[item] = 0;
                object[item] += 1;
            })

            for (const prop in object) {
               if(object[prop] >= 2) {
                   duplicates.push(prop);
               }
            }

             if(duplicates.length>0){
                console.log("dupli" , serviceCodes.length, duplicates , parl.name)
                d.push(parl.name);
             }
                callback();
        }, function all(){
            res.json(d)
        })
    })
})


router.get('/salonSubs' , function(req, res) {
    Parlor.find({} , {name:1, address2 :1} , function (err , parlors) {
        var data =[];
        async.each(parlors , function (parl , callback){
            console.log(parl)
            SubscriptionSale.aggregate([{$match : {razorPayId: {$regex : parl._id+ ""} , createdAt : {$lte : new Date(2018,11,30,23,59,59)}}}, 
                    {$project : {userId:1 , createdAt :1}},
                    {$lookup :{from : "users" , localField : "userId" , foreignField :"_id" , as : "users"}},
                    {$project :{clientName : {$arrayElemAt :['$users.firstName' , 0]} ,phoneNumber : {$arrayElemAt :['$users.phoneNumber' , 0]} , date :{'$dateToString': {format: '%m/%d/%Y', date: '$createdAt'}}}}
                    ], function(err, subs){
                
                    if(subs.length> 0){
                        console.log(subs)
                        data.push({parlorName: parl.name, address2 : parl.address2 , count : subs.length , parlorId: parl.id , amount : subs.length*1699 , clientData : subs})
                        callback();
                    }else callback();
                
            })
        }, function all(){
            res.json(data)
        })

    })
});



// router.get('/dropDuplicateSubscriptions' , function(req, res){
//     SubscriptionSale.aggregate([
//         {$group : {_id : "$userId" , count:{$sum :1}, subsId:{$last : '$_id'} }} ,
//         {$match : {count:{$gte: 2}}},
//         ], function (err, subscriptions) {
//             var d= [];
//             async.each(subscriptions , function (sub , callback) {
//                 SubscriptionSale.remove({_id: sub.subsId} , function(err , deleted){
//                     if(deleted)d.push(deleted)
//                     else console.log("error");
//                     callback();
//                 })
//             }, function all(){
//                 res.json('done')
//             })
//         })
// })


router.get('/sansaLuckyDraw' , function(req, res){
    var employees=[{userId:ObjectId("5a37b2a8b076ee589bd80615")}]
    var parlorId=ObjectId("588a0cc3f8169604955dce8d");
    var clientName="Pawan Kumar"
    LuckyDrawDynamic.onSalonSubscription(employees, parlorId, clientName)
})

router.get('/updateLoyaltyPoints' , function(req, res){
    Appointment.find({appointmentStartTime :{$gte: new Date(2018,11,1) , $lte : new Date(2018,11,31,23,59,59)} , status:3 , appointmentType: 3, serviceRevenue :{$gt : 0}}, {'client.phoneNumber' : 1, subtotal:1, paymentMethod:1, appointmentStartTime :1 } , function(err, appointments){
        async.each(appointments , function(appt , callback){
            var updatedLoyalty=0;
            var expiry_date = new Date(appt.appointmentStartTime);
            expiry_date.setMonth(expiry_date.getMonth() + 1);
            if(appt.paymentMethod == 1 || appt.paymentMethod == 2){
                updatedLoyalty = (((appt.subtotal - appt.loyalityPoints) * 0.075) > 500) ? 500 : Math.round((appt.subtotal - appt.loyalityPoints) * 0.075)
            }else if(appt.paymentMethod == 5 || appt.paymentMethod == 10){
                updatedLoyalty = (((appt.subtotal - appt.loyalityPoints) * 0.15) > 500) ? 500 : Math.round((appt.subtotal - appt.loyalityPoints) * 0.15)
            }
            User.update({phoneNumber : appt.client.phoneNumber}, {loyalityPoints : updatedLoyalty , freebieExpiry : expiry_date}, function(err , updated){
                d.push(updated)
                callback();
            })
        }, function all(){
            res.json(d.length)
        });
    });
});


router.get('/updateLedger' , function(req, res){
    SettlementLedger.find({}, function(err , ledgers){
        async.each(ledgers , function(le , c){
            SettlementLedger.update({_id :  le._id} , {previousMonthRoyalty : le.previousMonthRoyalty*1.18} , function(err , update){
                c();
            })
        }, function all(){
            res.json('done')
        })
    })
})



// router.get('/checkReorders' , function(req, res){
//     ReOrder.find({parlorId: ObjectId("5c0a78877e191b343246018f")} , function(err, reorders){
//         async.each(reorders , function(reo , call){
//             async.each( )
//         }, function all(){

//         })
//     })
// })



router.get('/reviveData' , function(req, res){
    Parlor.findOne({_id : ObjectId("5af2ae186a18c414d1cdb03f")},{services:0}, function(err , parl){
    var d = [];
    Appointment.aggregate([
                {$match :{parlorId: ObjectId("5af2ae186a18c414d1cdb03f") , appointmentStartTime:{$gte: new Date(2018,7,1) , $lte: new Date(2018,10,11)} , status:3 , 'client.noOfAppointments' :0}},
                {$project : {year : {"$year" : "$appointmentStartTime"},
                             month : {"$month" : "$appointmentStartTime"},
                             day : {"$dayOfMonth" : "$appointmentStartTime"},
                             clientId : "$client.id", productRevenue:1, appointmentType: 1,bookingMethod:1, latitude: 1, longitude: 1, 
                             serviceRevenue: 1, mode: 1, appBooking: 1, appointmentStartTime: 1, client: 1, couponCode: 1 , totalLoyality:{$divide : ["$loyalityPoints" , 1]},
                             }
                    },
                {$group: {_id: {year : "$year" , month : "$month" , day : "$day" , clientId : "$clientId"},clientId: {$first : "$clientId"} , 
                        appointmentType:{$first : "$appointmentType"},bookingMethod:{$first : "$bookingMethod"}, latitude:{$first : "$latitude"}, 
                        longitude: {$first : "$longitude"}, mode: {$first : "$mode"}, appBooking: {$first : "$appBooking"}, 
                        appointmentStartTime: {$first : "$appointmentStartTime"}, client: {$first : "$client"}, couponCode: {$first : "$couponCode"},
                        totalRevenue: {$sum : {$add :["$serviceRevenue" , "$productRevenue" , "$totalLoyality"]}} , totalLoyality : {$sum : "$totalLoyality"}}},
                {$sort: {appointmentStartTime:1 }},
                {$group : {_id: "$_id.clientId", serviceRevenue : {$sum : "$totalRevenue" } , totalLoyality:{$sum : '$totalLoyality'},
                        appointmentType:{$first : "$appointmentType"},bookingMethod:{$first : "$bookingMethod"}, latitude:{$first : "$latitude"}, 
                        longitude: {$first : "$longitude"}, mode: {$first : "$mode"}, appBooking: {$first : "$appBooking"}, 
                        appointmentStartTime: {$first : "$appointmentStartTime"}, clientName: {$first : "$client.name"},client: {$first : "$client"}, phoneNumber: {$first : "$client.phoneNumber"}, couponCode: {$first : "$couponCode"},
                }},
        ], function(err , appts){
            async.each(appts, function(a, cb) {
                 var arr = {
                    distanceRevenue : 0,
                    totalRevenue : a.totalRevenue,
                    totalLoyaltyPoints : a.totalLoyality,
                    distanceRevenueFirstTime : 0,
                    appRevenue : 0,
                    appRevenueFirstTime : 0,
                    name: a.clientName,
                    phoneNumber: a.phoneNumber,
                };
                    if(a.latitude == null)a.latitude = 0;
                    if(a.longitude == null)a.longitude = 0;

                    if ( a.appointmentType == 3 || a.couponCode || a.mode==5 || a.mode == 7 || a.mode == 9) {

                        Appointment.find({ 'client.phoneNumber' : a.phoneNumber, status: 3, appointmentStartTime: { $gte: new Date(2018,9,7)}}, function(err, repeatAppts) {
                            var distance = HelperService.getDistanceBtwCordinates1(parl.geoLocation[1], parl.geoLocation[0], a.latitude, a.longitude)
                            if ((distance >= 0.05 && a.appointmentType == 3) || a.mode == 5 || a.couponCode || a.mode == 7 || a.mode == 9) {
                                arr.distanceRevenue += a.serviceRevenue  
                                if (a.client.noOfAppointments == 0 || a.couponCode) arr.distanceRevenueFirstTime += a.serviceRevenue
                            } 
                            arr.appRevenue += a.serviceRevenue;
                            if (a.client.noOfAppointments == 0 || a.couponCode) arr.appRevenueFirstTime += a.serviceRevenue;
                            if(a.couponCode)arr.revenureFromNearBuy += a.serviceRevenue;
                            
                            if(repeatAppts.length > 1){
                                arr.distanceRevenueFirstTime += repeatAppts[1].serviceRevenue;
                                if(repeatAppts.length>2){
                                    arr.distanceRevenueFirstTime += repeatAppts[2].serviceRevenue;
                                }
                            }
                            d.push(arr)
                            cb();
                        })
                    }
                    else cb();

            }, function all(){
                res.json(d)
            })                   
        })
    })
});

router.get('/noRepeatClients' , function(req, res){
    Appointment.aggregate([{$match :{ $or :[{appointmentType : 3},{couponCode : {$exists : true}},{mode:5},{mode : 7},{mode : 9}] ,status:3 , appointmentStartTime: {$gte: new Date(2018,0,1)}}},
        {$project : {'services.serviceCode' :1,'services.name' :1,'client.id':1}},
        {$group : {_id: '$client.id' , count: {$sum :1} , services :{$first : '$services'} }},
        {$match : {'count' : 1}},
        {$unwind: "$services"},
        {$group : {_id: '$services.serviceCode', name: {$first : "$services.name"}, count: {$sum: 1}}}], function(err , nonRepeated){
           
                res.json(nonRepeated)

        })
})



router.get('/subscriptionClientsServices' , function(req, res){

    Appointment.aggregate([
            {$match : {status: 3 , "client.subscriptionLoyality":{$gt: 0}}},
            {$project : {'services.serviceCode' :1,'services.name' :1}},
            {$unwind: "$services"},
            {$match : {"services.type" : {$ne : "frequency"}}},
            {$group : {_id: '$services.serviceCode', name: {$first : "$services.name"}, count: {$sum: 1}}},{$sort : {count : -1}}], function(err , nonRepeated){
           
                res.json(subscriptionClients)
        })
})



router.get('/turningHeadSubscriptions' , function(req, res){
    var parlorId = ObjectId("5aec5864e5c9e748727c69f7");
	var match = { "appts.status": 3, "appts.subscriptionAmount": { $gt: 0 }, $or: [{ 'appts.subscriptionReferralCode': { $eq: null } }, { 'appts.subscriptionReferralCode': { $eq: "" }},{ 'appts.subscriptionReferralCode': { $eq: "EARLYBIRD" } }] };

    SubscriptionSale.aggregate([{ $match: { createdAt: { $gte: HelperService.getDayStart(new Date(2018,9,1)), $lt: HelperService.getDayEnd(new Date()) }, razorPayId: { $not: /^near.*/ } } },
        { $lookup: { from: "appointments", localField: "userId", foreignField: "client.id", as: "appts" } },
        { $project: { userId: 1, response: 1, razorPayId: 1, actualPricePaid: 1, appts: "$appts", createdAt: 1, paymentMethod :1,subscriptionDate: { '$dateToString': { format: '%m/%d/%Y', date: '$createdAt' } } } },
        { $unwind: "$appts" },
        { $match: match },
        { $group: { _id: "$userId", appts: { $first: "$appts" }, price: { $first: "$actualPricePaid" },paymentMethod:{$first : "$paymentMethod"}, createdAt: { $first: "$createdAt" }, subscriptionDate: { $first: "$subscriptionDate" }, razorPayId: { $first: "$razorPayId" }, userId: { $first: "$userId" } } },
        {
            $project: {
                userId: "$userId",
                subscriptionDate: "$subscriptionDate",
                price: "$price",
                razorPayId: "$razorPayId",
                createdAt: "$createdAt",
                purchaseSalon: { $concat: ['$appts.parlorName', '-', '$appts.parlorAddress2'] },
                paymentMethod : "$paymentMethod"
            }
        }
    ], function(err, subscriptions) {
        var d= [];
        Async.each(subscriptions, function(subs, call) {
            var str = subs.razorPayId;
            var res = str.substring(0, 4);

            var queryB = { 'client.id': subs.userId, status: 3, loyalitySubscription: { $gt: 0 } , parlorId : parlorId };

            // if (userTypeBeu == 0) queryB.parlorId = parlorId;

            Appointment.findOne(queryB, { 'client.name': 1, payableAmount: 1, 'client.phoneNumber': 1, 'client.gender': 1, parlorName: 1, parlorAddress2: 1, loyalitySubscription: 1, appointmentStartTime: 1 }, function(err, app) {
        console.log(app)

                if (app) {
                    // _.forEach(appoint, function(app) {
                    if (app.loyalitySubscription > 0 && HelperService.compareTodayDate(app.appointmentStartTime, subs.createdAt) && parseInt(subs.price) >= 1000) {
                        // if ( HelperService.compareTodayDate(app.appointmentStartTime , subs.createdAt) && parseInt(subs.price) >= 1000) {
                        var subsData = {};
                        subsData.subscriptionType = (parseInt(subs.price) >= 1000) ? "Gold" : "Silver";
                        // subsData.paymentMethod = (res == "cash") ? "Cash Payment" : "Online Payment";
                        
                        
                        subsData.purchaseSalon = app.parlorName + " - " + app.parlorAddress2;
                        subsData.clientName = app.client.name;
                        subsData.clientPhoneNumber = app.client.phoneNumber;
                        subsData.subscriptionDate = subs.createdAt.toDateString();
                        subsData.price = subs.price;
                        

                        d.push(subsData);
                    }
                    // })
                    call();

                } else {
                    call()
                }
            })
        }, function allTaskCompleted() {
                return res.json(d )
        })
    })
})



router.post('/salonSubscription', function(req, res) {
    
    Parlor.find({_id: "5aec5864e5c9e748727c69f7"} , {name: 1,address2 :1, address :1}, function( err , parlors){
        console.log(parlors.length)
            let data = []
            let other =[];
            let apptSubs = [];
            async.each(parlors , function(parlor , cb){
            
                  async.parallel([
                        function(callback){
                            SubscriptionSale.getSubscriptionSoldBySalon(new Date(2018,9,1), new Date(2018,11,31) ,parlor.id, function(err , subscriptions){
                                other = subscriptions;
                                callback(null);
                            })
                        },
                        function(callback){
                            // console.log("userType" ,req.session.userTypeBeu)
                            SubscriptionSale.getSubscriptionSoldBySalonWithAppt(new Date(2018,9, 1), new Date(2018,11,31) , parlor.id, 1, function(err , subsAppt){
                                apptSubs = subsAppt;
                                callback(null);
                            })
                        }
                    ], function(err , results){
             
                        _.forEach(other , function(o){
                            o.purchaseSalon = parlor.name +' - '+ parlor.address2
                            data.push(o)
                        })
                        _.forEach(apptSubs , function(a){
                            data.push(a)
                        })

                        // var count = d.length;
                        cb()
                        
                    })
              }, function allDone(){
                    return res.json(CreateObjService.response(false, {subscriptions : data , count : data.length}));
              })
  
    })
});

router.get('/checkAalenesSubscription', function(req, res){
    SubscriptionSale.find({createdAt : {$gt : new Date(2018, 1, 1), $lt : new Date(2018, 5, 30)}}, {userId : 1}, function(err, subscriptionSales){
        let noOfSubscriber = 0, renew = 0
        Async.each(subscriptionSales, function(s, cb){
            Appointment.findOne({"client.id" : s.userId, parlorId : ObjectId("587088445c63a33c0af62727"), status : 3, loyalitySubscription : {$gt : 0}, appointmentStartTime : {$lt : new Date(2018, 5, 30)}}, function(er, a){
                if(a){
                    noOfSubscriber += 1
                    SubscriptionSale.find({userId : s.userId}, {userId : 1}, function(er, d){
                        if(d.length==2)renew += 1
                        cb()
                    })
                }else{
                    cb()
                }
            })
        }, function allDone(){
            res.json({noOfSubscriber : noOfSubscriber, renew : renew})
        })
    })
})


router.get('/aalenesData' , function(req, res) {
    Appointment.aggregate([{$match : {appointmentStartTime : {$gt : new Date(2018, 4, 1)}, parlorId: ObjectId("587088445c63a33c0af62727") , status:3 , appointmentType:3}},
            {$project : {
                appDigitalCount :{$cond: [{$eq: ['$paymentMethod' , 5]} , 1 , 0]},
                appCashCount :{$cond: [{$ne: ['$paymentMethod' , 5]} , 1 , 0]},
                appDigitalRevenue :{$cond: [{$eq: ['$paymentMethod' , 5]} , '$serviceRevenue' , 0]},
                noOfSubscriber :{$cond: [{$eq: ['$subscriptionLoyality' , 0]} , 0 , 1]},
                appCashRevenue :{$cond: [{$ne: ['$paymentMethod' , 5]} , '$serviceRevenue' , 0]},
                appDigitalPayableAmount :{$cond: [{$eq: ['$paymentMethod' , 5]} , '$payableAmount' , 0]},
                appCashPayableAmount :{$cond: [{$ne: ['$paymentMethod' , 5]} , '$payableAmount' , 0]}, 
                month: { $month: "$appointmentStartTime" }, year: { $year: "$appointmentStartTime" } }
            },
            {$group : {_id: {month :'$month' , year: "$year"}, month : {$first : "$month"} , year : {$first: "$year"},
            appDigitalRevenue: {$sum : {$ceil : "$appDigitalRevenue"}}, 
            appCashRevenue: {$sum : {$ceil : "$appCashRevenue"}},
            appDigitalPayableAmount: {$sum : {$ceil : "$appDigitalPayableAmount"}}, 
            appCashPayableAmount: {$sum : {$ceil : "$appCashPayableAmount"}},
            appDigitalCount: {$sum : "$appDigitalCount"},
            appCashCount: {$sum : "$appCashCount"},
            noOfSubscriber: {$sum : "$noOfSubscriber"}
            }},
            {$sort : { year: 1 ,month :1}}
            ] , function(err , agg){
                res.json(agg)
            })
})


router.get('/facearchIssue' , function(req, res){
    // ReOrder.find({_id: ObjectId("5c18d723bf59e14efb3dc33f")}, function(err , reorders){
    ReOrder.find({parlorId: ObjectId("5c0a78877e191b343246018f") , receivedAt: { $gte: new Date(2019,0,1), $lte: new Date(2019,0,31) }}, function(err , reorders){
        var d = [];
        async.each(reorders , function(reorder , callback){
            var reorderItems = reorder.items;
            async.each(reorderItems , function(item , call){
                InventoryItem.findOne({_id: item.itemId} , function(err , inevntory){
                    if(inevntory){
                        call();
                    }else{
                        ParlorItem.findOne({_id: item.itemId} , function(err , parlorItem){
                            if(parlorItem){
                                item.itemId = parlorItem.inventoryItemId;
                                d.push(item.itemId);
                                call();
                            }else{
                                call();
                            }
                        })
                    }
                })
            }, function allDone(){
                ReOrder.update({_id : reorder.id} , {items: reorderItems}, function(err , update){
                    callback();
                })
            })
        }, function all (){
            res.json(d)
        })
    })
})


router.get('/createParlorItem', function(req, res){
    ParlorItem.find({inventoryItemId: {$in : [   ObjectId("5a0d577939e8d57680cb762b") , ObjectId("591ebadb1d1a3f0c705bbe8d"), ObjectId("5b34b7a2e3550257608b244a"),ObjectId("5b34b93fe3550257608b247b") ,  ObjectId("5ad074b08a258c1f9f013b48") , ObjectId("5acded2c8fe9613b674791a9"), ObjectId("5adf6109c582ca7446d301e6"),ObjectId("5b34b761e3550257608b2440") , ObjectId("5ad076118a258c1f9f013b97"),ObjectId("5b34b4c7f691873e71f0d462"), ObjectId("5b34b506f691873e71f0d467"),ObjectId("5b34b85ef691873e71f0d4c4"), ObjectId("5acdf59c9c015f7a9ca0879b")]} , parlorId: ObjectId("5ab4e65992dd435320b6aba3")} , function(err , parlorItems){
        async.each(parlorItems , function(item , call){
            item.parlorId = ObjectId("5c0a78877e191b343246018f");
            _.forEach(item.addHistory , function(history){
                history.manufactureMonth = item.manufactureMonth
            })
            ParlorItem.create(item , function(err, created){
                console.log(err)
                console.log(created)
                call();
            })
        }, function all(){
            res.json('done')
        })
    })
})


// router.get('/updateMembershipAppointments' , function(req, res){
//     Appointment.find({_id: {$in : [ObjectId("5c3ef0fa6c40b83dd0df3d94"),ObjectId("5c3f0fe36c40b83dd0df429a"),ObjectId("5c3f1a646c40b83dd0df4507"),ObjectId("5c3f28bc6c40b83dd0df49a0"),ObjectId("5c3f39c06c40b83dd0df4e29"),ObjectId("5c3f41976c40b83dd0df5004"),ObjectId("5c40488de4aa72466dd9f7d4"),ObjectId("5c40608cf893d54b37bd26e9"),ObjectId("5c40764ee4aa72466dda01a4"),ObjectId("5c40791b88ca1f2d302e0c87"),ObjectId("5c40824088ca1f2d302e0fef"),ObjectId("5c4083ec88ca1f2d302e1085"),ObjectId("5c40915ae266c6536750632f"),ObjectId("5c4092b888ca1f2d302e1343")]}} , function(err , appointments){
//         async.each(appointments , function(appt , call){
//             if(appt.services.length)
//             var services = _.forEach(appt.services , function(ser){ 
//                 ser.creditsUsed = appt.membershipDiscount
//             });
//             Appointment.update({_id: appt._id},{membershipDiscount : 0 , services : services} , function(err , update){
//                 call();
//             })
//         })
//     })
// })


router.get('/updateSubscriptionInSalons' , function(req , res){
    Appointment.aggregate([{$match : {loyalitySubscription: {$gt:0} , status:3}},
        {$project : {parlorId: 1 , 'client.id' :1 }},
        {$group : {_id: '$client.id' , parlorId: {$first :'$parlorId'}}},
        {$group : {_id: '$parlorId' , clients :{$push : '$_id'}}}
        ], function(err , clients){
        async.each(clients , function(c, callback){
            var updateObj ={ subscriptionsSold : c.clients.length }

            Parlor.update({_id : c._id}, updateObj, function(err, parlor){
                if(!err){
                    console.log(parlor)
                    callback();
                }
                else{
                    console.log(err)
                    callback();
                }
            })
        }, function allTaskCompleted(){
            res.json('done')
        })
    })
});

router.get('/luckyDrawsd' , function(req, res){
    Appointment.find({appointmentStartTime :{$gte : new Date(2019, 1,7) , $lte : new Date(2019,1,7,23,59,59)} , status:3 , loyalitySubscription :{$gt: 0}}, function(err , appointments){
        async.each(appointments , function(appt , callback){
            User.findOne({phoneNumber : appt.client.phoneNumber}, {subscriptionId : 1} , function(err , user){

            LuckyDrawDynamic.onSubscription(appt._id, user.subscriptionId)
            callback();
            })
        }, function all(){
            res.json("alldone")
        })
    })
})


router.get('/revivaData' , function(req, res){
   Appointment.aggregate([
        {$match : {parlorId: ObjectId("5b2784444fc6411a140252f8") , status:3 , loyalitySubscription :{$gt : 0}}},
        {$group : {_id: "$client.id" , name: {$first :'$client.name'} , phoneNumber: {$first :'$client.phoneNumber'}}},
        {$lookup : {from : "users" , localField : "_id" , foreignField : "_id" , as : "user"}},
        {$project : {name:1, phoneNumber :1, subscriptionBuyDate :
            {$dateToString: {format : "%Y-%m-%d", date:{$arrayElemAt :['$user.subscriptionBuyDate' , 0]}}}}}

        ], function(err , appt){
            res.json(appt)
        })
})



router.get('/sssffff' , function(req, res){
SubscriptionSale.aggregate([
            {$group : {_id: '$userId' , count:{$sum :1} , createdAt :{$first : "$createdAt"}}},
            {$match : {count: {$gt :1} , createdAt :{$gte: new Date(2018,1,1) }}},
            {$lookup : {from : "users" , localField : "_id" , foreignField : "_id" , as : "user"}},
            {$project : {phoneNumber : {$arrayElemAt : ['$user.phoneNumber' , 0]} ,firebaseId : {$arrayElemAt : ['$user.firebaseId' , 0]},
            firebaseIdIOS : {$arrayElemAt : ['$user.firebaseIdIOS' , 0]}}},
            
            ], function(err , agg){
                res.json(agg)
            })
})


router.get('/testNotification' , function(req, res){
    var data1 = { type: req.query.type, title: "Testing Notification", body: "This notification is only for testing purpose. This notification is only for testing purpose. This notification is only for testing purpose. This notification is only for testing purpose. ", sImage: "http://res.cloudinary.com/dyqcevdpm/image/upload/v1484301569/aalenes%20EOK.jpg", lImage: "http://res.cloudinary.com/dyqcevdpm/image/upload/v1484301569/aalenes%20EOK.jpg" };
    if(req.query.android == 1){
        Appointment.sendAppNotificationAdmin([req.query.firebaseId], data1, function(err, data) {
            res.json(data)
        })
    }else{
        Appointment.sendAppNotificationIOSAdmin([req.query.firebaseId], data2, function(err, data) {             
            res.json(data)
        })
    }  
});


router.get('/sendSubscriptionSms' , function(req, res){
    let expiryStartDate = HelperService.getCustomMonthStartDate(new Date().getFullYear() -1 , new Date().getMonth()-1);
    let expiryEndDate = HelperService.getMonthEndDate(new Date().getFullYear() -1 , new Date().getMonth()-1);
    let lastDay = HelperService.getDateFormatForNotification(expiryEndDate)
    SubscriptionSale.aggregate([
                {$group : {_id: '$userId' , count:{$sum :1} , createdAt :{$first : "$createdAt"}}},
                {$match : {count: {$eq :1} , createdAt :{$gte: expiryStartDate , $lte :expiryEndDate}}},
                {$lookup : {from : "users" , localField : "_id" , foreignField : "_id" , as : "user"}},
                {$project : {phoneNumber : {$arrayElemAt : ['$user.phoneNumber' , 0]} ,firebaseId : {$arrayElemAt : ['$user.firebaseId' , 0]},
                firebaseIdIOS : {$arrayElemAt : ['$user.firebaseIdIOS' , 0]}}}
    ], function(err, users) {
        // User.find({phoneNumber : {$in : ["8010178215" , "8826345311"]}}, function(err , users){
        console.log(users.length)
        var data ="Your subscription expired on "+lastDay+". Renew your subscription and get 1 month extension."
        async.each(users, function(user , callback){
            var usermessage = Appointment.recommSms(user.phoneNumber, data);
            Appointment.sendSMS(usermessage, function (e) {
                callback();
            });

        }, function all(){
            res.json("done")
        })
    })
})


router.get('/testLuckyDraw' , function(req, res){
    LuckyDrawDynamic.findIncentiveType( new Date(2019, 6,19 ), new Date(2019, 6, 21, 23, 59, 59) , 371)
    res.json('done')
});



router.get('/regenerateLedger' , function(req, res){

    SettlementLedger.find({} , function(err , ledgers){

        async.each(ledgers , function(ledger , callback){

            var ledgerTotalRecoverable = ledger.monthWiseDetail[ledger.monthWiseDetail.length-1].moreAmountToBeAdjusted
            var ledgerCurrentDue = ledger.monthWiseDetail[ledger.monthWiseDetail.length-1].moreAmountToBeAdjusted

            SettlementLedger.update({_id: ledger._id} , {totalRecoverable : ledgerTotalRecoverable , currentDue : ledgerCurrentDue}, function(err , update){
                    
                callback();
            })
        }, function all(){
            res.json("done")
        })
    })
})


// router.get('/updateAppointmentLatLong', function(req, res){
//     Appointment.update({_id: req.body.appointmentId})
// })


router.get('/subscriberData' , function(req, res){
    SubscriptionSale.aggregate([
            {$group : {_id: "$userId" , count: {$sum :1} , userId : {$first : "$userId"}, createdAt : {$last : "$createdAt"}}},
            {$match :{createdAt : {$gte : new Date(2019,1,1)}}}
            // {$match : {count : 1}}
        ], function(err , subscribers){

            var d ={ 
                    totalSubscribers : 0,
                    newSubscribers : 0,
                    noOfAppointments : 0,
                    newSubscriberAppointment : 0,
                    newclientsWithDistance : 0,
                    newclientsInsideSalon : 0,
                    newclientsCrm : 0,
                    newSubscriberButOldAppointment:0,
                    renewAppointment :0,
                    faltu :0
                };

            async.each(subscribers , function(subs , callback){
                
                d.totalSubscribers++;
                if(subs.count == 1)d.newSubscribers++;

                Appointment.findOne({'client.id' : subs.userId ,  status:{$in : [1,3]} , serviceRevenue : {$gt : 0} , appointmentStartTime : {$gte : new Date(2019,1,1)}}, function(err , app){

                    Appointment.findOne({'client.id' : subs.userId ,  status:3, subscriptionAmount : {$gt : 0} , appointmentStartTime : {$gte : new Date(2019,1,1)}}, function(err , distanceAppt){
                    if(app){
                        if(subs.count == 1)d.newSubscriberAppointment++;
                        d.noOfAppointments++;
                        Parlor.findOne({_id: app.parlorId}, {geoLocation :1} , function(err , parl){

                        if ( app.appointmentType == 3 || app.couponCode || app.mode==5 || app.mode == 7 || app.mode == 9) {
                            
                            if(distanceAppt.latitude == null )distanceAppt.latitude = 0;
                            if(distanceAppt.longitude == null )distanceAppt.longitude = 0;
                            
                            var distance = HelperService.getDistanceBtwCordinates1(parl.geoLocation[1], parl.geoLocation[0], distanceAppt.latitude, distanceAppt.longitude)
                            
                            if ((distance >= 0.05 && app.appointmentType == 3) || app.mode == 5 || app.couponCode || app.mode == 7 || app.mode == 9) {
                                
                                if (app.client.noOfAppointments == 0 || app.couponCode) d.newclientsWithDistance++
                                    else{
                                         if(subs.count == 1)d.newSubscriberButOldAppointment++;
                                        else d.renewAppointment++;
                                    }
                            } 
                            else if(distance < 0.05 && app.appointmentType == 3){
                                d.newclientsInsideSalon++;
                            }
                        }else{
                            d.newclientsCrm++;
                        }

                        
                        })
                    }
                    callback()
                })
            })

            }, function all(){
                res.json(d)
            })
        })
})


//done till date 25 april 2019
router.get('/convertSubscribersFirstAppointment' , function(req, res){

    SubscriptionSale.find({razorPayId: { $not: /^salon.*/ }} ,{userId : 1,createdAt : 1}, function(err , subscriptions){
var d =[];
        console.log("donr getting subscriotions")
        async.each(subscriptions , function(subs , callback){  
            Appointment.findOne({'client.id' : subs.userId, 'client.noOfAppointments' : 0, appointmentStartTime:{$gte : subs.createdAt} , status:3 , serviceRevenue :{$gt : 0}} , {parlorId : 1} , function(err , appoint){
                // console.log(appoint)
                if(appoint){
                     Appointment.update({_id: appoint._id}, {$set : {appointmentType :3, bookingMethod : 2, appBooking :2 , latitude : 28.5508015 , longitude: 77.265895}}, function(err , updateAppt){

                        d.push(updateAppt) 
                        console.log('done')
                        callback();
                    })
                }else{
                    callback();
                }
            })                   
        }, function all(){
            res.json(d.length)
        })
    })
    
})

router.get('/updateSettlementQuaterly', function(req, res) {
    QuarterlySalonSupportData.find({createdAt : {$gt : new Date(2019, 6, 1)}}, {parlorId : 1, amountToBeCharged : 1}, function(err, setts){
        _.forEach(setts, function(s){
            SettlementReport.update({period : 362, parlorId : s.parlorId}, {quarterSettlementAmount : s.amountToBeCharged}, function(err, d){
                console.log('done')
            })
        })
    })
})

router.get('/updateLedgerNetPayable' , function(req, res){
    var d = []
   SettlementLedger.find({'monthWiseDetail.name' : "Product Discount" } , function(err , ledgers){
        async.each(ledgers , function(led , callback){
            SettlementLedger.findOne({_id: led._id} , function(err , ledger){
                var newMonthArray = ledger.monthWiseDetail;
                newMonthArray.length = 8;
                d.push(newMonthArray)
                console.log(newMonthArray)
                SettlementLedger.update({_id: led._id} , {monthWiseDetail : newMonthArray , period: 304} , function(err , update){

                    callback();
                })
            })
        }, function all(){
            res.json(d)
        })
   })
});

router.get('/checkLuckyDraw' , function(req, res){
    LuckyDrawDynamic.incentiveOnlinePayment("5ca5c101a4b351388627f636")
});


router.get('/updatePalorLiveDate' , function(req, res){
});


router.get('/createQuarterlySalonSupport', function(req, res) {
//or 15 oct to 15 novrmn

// {modelTypeLiveDate:{$lt : new Date(2018,9,15), $gt : new Date(2018,10,15)}}

    var d = [];
    Parlor.find({modelType:1, $or : [{modelTypeLiveDate:{$lt : new Date(2019,3,15), $gt : new Date(2019,2,15)}}, ]}, { name: 1, active: 1, avgRoyalityAmount: 1, geoLocation: 1 , cityId: 1, modelTypeLiveDate :1 , parlorType:1, reverseChargeMultiple:1}, function(err, parlors) {
        console.log(parlors.length)
        async.each(parlors, function(parlor, callback) {

            var totalUsageAllowed, effectiveDays =0, effectiveMonth, daysInMonth, startDate;
            if(parlor.modelTypeLiveDate.getTime() < new Date(2019,3,1).getTime() && parlor.modelTypeLiveDate.getTime() > new Date(2019,2,15).getTime()){
               
                effectiveDays = HelperService.getDaysBetweenTwoDates(HelperService.addDaysToDate(parlor.modelTypeLiveDate, -1) , HelperService.getDayEnd(new Date(2019,2,31)));
                effectiveMonth = parlor.modelTypeLiveDate.getMonth();
                startDate = parlor.modelTypeLiveDate;
                // daysInMonth = HelperService.getDaysInMonth(new Date().getMonth() - 1, new Date().getFullYear())
                daysInMonth = 31
                totalUsageAllowed = (parlor.avgRoyalityAmount ) * (3 + effectiveDays/daysInMonth);

            }else if(parlor.modelTypeLiveDate.getTime() < new Date(2019,3,15).getTime()) {
                
                effectiveDays = HelperService.getDaysBetweenTwoDates(HelperService.addDaysToDate(parlor.modelTypeLiveDate, -1) , HelperService.getDayEnd(new Date(2019,3,30)));
                effectiveMonth = parlor.modelTypeLiveDate.getMonth();
                startDate = parlor.modelTypeLiveDate;
                daysInMonth = 30
                totalUsageAllowed = (parlor.avgRoyalityAmount ) * (2+ effectiveDays/daysInMonth);
            }
            var endDate = new Date(2019,5,30);
            var startMonth = HelperService.getMonthName(startDate.getMonth());
            var endMonth = HelperService.getMonthName(endDate.getMonth());

            DisountOnPurchase.find({ parlorId: parlor._id, closing: true , month:{$in : [4,5,6]}, year :{$in : [2019]} }, function(err, productDiscount) {
                        
                Appointment.aggregate([{ $match: { parlorId: ObjectId(parlor._id), status: 3, appointmentStartTime: { $gte: startDate, $lt: HelperService.getDayEnd(endDate) } } },
                    { $group: { _id: null, loyalityRevenue: { $sum: '$loyalityPoints' } } }
                ], function(err, appts) {

                    Appointment.find({ parlorId: ObjectId(parlor._id), status: 3, appointmentStartTime: { $gte: startDate, $lt:  HelperService.getDayEnd(endDate) } },
                        {productRevenue:1, bookingMethod: 1, latitude: 1, longitude: 1, serviceRevenue: 1, mode: 1, appBooking: 1, appointmentStartTime: 1, client: 1, couponCode: 1, appointmentType:1 ,loyalityPoints:1}, function(err, distanceAppts) {
                                var loyalityRevenue = appts[0].loyalityRevenue / 2;
                                var distanceRevenue = 0;
                                var product = 0;
                                _.forEach(productDiscount , function(pro){
                                    if(effectiveDays > 0 && pro.month == (effectiveMonth+1)){
                                        product += (pro.upFrontDiscount+pro.discountPaid) * effectiveDays/daysInMonth;
                                    }else{
                                        product += (pro.upFrontDiscount + pro.discountPaid);
                                    }
                                })

                                if (appts && appts.length > 0) {

                                    
                                    
                                    if (distanceAppts && distanceAppts.length > 0) {

                                        _.forEach(distanceAppts, function(a) {

                                            if (a.appointmentType == 3 || a.couponCode || a.mode==5 || a.mode == 7 || a.mode == 9 ) {
                                                var distance = HelperService.getDistanceBtwCordinates1(parlor.geoLocation[1], parlor.geoLocation[0], a.latitude, a.longitude)
                                                if(parlor.parlorType == 4){
                                                    distanceRevenue += (a.serviceRevenue + a.productRevenue - (a.loyalityPoints/2));
                                                }else{
                                                    if (((distance >= 0.05 || distance == 0 ) && a.appointmentType == 3 && a.client.noOfAppointments == 0) || a.couponCode || a.mode == 5) {
                                                        distanceRevenue += (a.serviceRevenue + a.productRevenue);
                                                    }
                                                }
                                                
                                            }

                                        })

                                    }
                                }

                            var supportTypes = [
                                {
                                    supportCategoryId: "5b07c358885fca10041b35b6",
                                    supportTypeName: "Discount",
                                    supportCategoryName: "Salon Driven Support",
                                    percentage: 100,
                                    totalUsageAllowed: parlor.avgRoyalityAmount,
                                    previousBalance: 0,
                                    usageThisMonth: product,
                                    refundable: false,
                                },
                                {
                                    supportCategoryId: "5b07c343885fca10041b35b5",
                                    supportTypeName: "Be U Clients",
                                    supportCategoryName: "Be U Driven Support",
                                    percentage: 100,
                                    totalUsageAllowed: parlor.avgRoyalityAmount,
                                    previousBalance: 0,
                                    usageThisMonth: distanceRevenue,
                                    refundable: true,
                                },
                                {
                                    supportCategoryId: "5b07c343885fca10041b35b5",
                                    supportTypeName: "Loyality",
                                    supportCategoryName: "Salon Driven Support",
                                    percentage: 100,
                                    totalUsageAllowed: parlor.avgRoyalityAmount,
                                    previousBalance: 0,
                                    usageThisMonth: loyalityRevenue,
                                    refundable: true,
                                }
                            ];

                            var salonDrivenDiff= Math.min(totalUsageAllowed*2 - (loyalityRevenue + product) , 0) ;
                            var beuDrivenDiff = totalUsageAllowed - distanceRevenue;
                            var salonDrivenAmount=salonDrivenDiff/parlor.reverseChargeMultiple;
                            var beuDrivenAmount=beuDrivenDiff>0?(beuDrivenDiff/3):beuDrivenDiff/parlor.reverseChargeMultiple;
                            var amountToBeCharged = parseInt(parseInt(beuDrivenAmount+salonDrivenAmount)*1.18);
                            console.log(salonDrivenDiff , beuDrivenDiff,totalUsageAllowed ,distanceRevenue, amountToBeCharged , parlor._id)
                            var obj = {
                                cityId: parlor.cityId,
                                parlorId: parlor.id,
                                parlorName: parlor.name,
                                active: parlor.active,
                                quarterDate : startDate.getDate()+' '+startMonth+' - ' +endDate.getDate()+ ' '+endMonth+' Support',
                                usageMonth: startDate.getMonth(),
                                usageYear: startDate.getFullYear(),
                                startDate: startDate,
                                royalityAmount: parlor.avgRoyalityAmount ? parlor.avgRoyalityAmount : 0,
                                supportTypes: [],
                                projectedRevenue: 0,
                                supportProvided: Math.round(loyalityRevenue + product + distanceRevenue),
                                currentQuarterUsageAllowed: Math.round(totalUsageAllowed),
                                currentAmountUsage: Math.round(loyalityRevenue + product + distanceRevenue ),
                                differenceInSalonDriven : Math.round(salonDrivenDiff),                              
                                differenceInBeuDriven : Math.round(beuDrivenDiff),  
                                amountToBeCharged : Math.round(amountToBeCharged),                              

                            }
                            obj.supportTypes = supportTypes;
                            // console.log(obj)
                            QuarterlySalonSupportData.create(obj, function(err, created) {
                                if (!err) {
                                    // d.push(aa)
                                    callback();
                                } else
                                    callback();
                            });
                        });
                });
            });
        }, function allTaskCompleted() {
            res.json('done')
        });
    });
});

router.get('/createQuarterlySalonSupport6Months', function(req, res) {
//or 15 oct to 15 novrmn

// 

    var d = [];
    Parlor.find({modelType:1, $or : [{modelTypeLiveDate:{$lt : new Date(2019,0,15), $gt : new Date(2018,11,15)}}]}, { name: 1, active: 1, avgRoyalityAmount: 1, geoLocation: 1 , cityId: 1, modelTypeLiveDate :1 , parlorType:1, reverseChargeMultiple:1}, function(err, parlors) {
        console.log(parlors.length)
        async.each(parlors, function(parlor, callback) {

            var totalUsageAllowed, effectiveDays =0, effectiveMonth, daysInMonth, startDate;
            
            totalUsageAllowed = (parlor.avgRoyalityAmount ) * (3);
            startDate = new Date(2019, 3, 1);
            effectiveMonth = 3

            var endDate = new Date(2019,5,30);
            var startMonth = HelperService.getMonthName(startDate.getMonth());
            var endMonth = HelperService.getMonthName(endDate.getMonth());

            DisountOnPurchase.find({ parlorId: parlor._id, closing: true , month:{$in : [4,5,6]}, year :{$in : [2019]} }, function(err, productDiscount) {
                        
                Appointment.aggregate([{ $match: { parlorId: ObjectId(parlor._id), status: 3, appointmentStartTime: { $gte: startDate, $lt: HelperService.getDayEnd(endDate) } } },
                    { $group: { _id: null, loyalityRevenue: { $sum: '$loyalityPoints' } } }
                ], function(err, appts) {

                    Appointment.find({ parlorId: ObjectId(parlor._id), status: 3, appointmentStartTime: { $gte: startDate, $lt:  HelperService.getDayEnd(endDate) } },
                        {productRevenue:1, bookingMethod: 1, latitude: 1, longitude: 1, serviceRevenue: 1, mode: 1, appBooking: 1, appointmentStartTime: 1, client: 1, couponCode: 1, appointmentType:1 ,loyalityPoints:1}, function(err, distanceAppts) {
                                var loyalityRevenue = appts[0].loyalityRevenue / 2;
                                var distanceRevenue = 0;
                                var product = 0;
                                _.forEach(productDiscount , function(pro){
                                    if(effectiveDays > 0 && pro.month == (effectiveMonth+1)){
                                        product += (pro.upFrontDiscount+pro.discountPaid) * effectiveDays/daysInMonth;
                                    }else{
                                        product += (pro.upFrontDiscount + pro.discountPaid);
                                    }
                                })

                                if (appts && appts.length > 0) {

                                    
                                    
                                    if (distanceAppts && distanceAppts.length > 0) {

                                        _.forEach(distanceAppts, function(a) {

                                            if (a.appointmentType == 3 || a.couponCode || a.mode==5 || a.mode == 7 || a.mode == 9 ) {
                                                var distance = HelperService.getDistanceBtwCordinates1(parlor.geoLocation[1], parlor.geoLocation[0], a.latitude, a.longitude)
                                                if(parlor.parlorType == 4){
                                                    distanceRevenue += (a.serviceRevenue + a.productRevenue - (a.loyalityPoints/2));
                                                }else{
                                                    if (((distance >= 0.05 || distance == 0 ) && a.appointmentType == 3 && a.client.noOfAppointments == 0) || a.couponCode || a.mode == 5) {
                                                        distanceRevenue += (a.serviceRevenue + a.productRevenue);
                                                    }
                                                }
                                                
                                            }

                                        })

                                    }
                                }

                            var supportTypes = [
                                {
                                    supportCategoryId: "5b07c358885fca10041b35b6",
                                    supportTypeName: "Discount",
                                    supportCategoryName: "Salon Driven Support",
                                    percentage: 100,
                                    totalUsageAllowed: parlor.avgRoyalityAmount,
                                    previousBalance: 0,
                                    usageThisMonth: product,
                                    refundable: false,
                                },
                                {
                                    supportCategoryId: "5b07c343885fca10041b35b5",
                                    supportTypeName: "Be U Clients",
                                    supportCategoryName: "Be U Driven Support",
                                    percentage: 100,
                                    totalUsageAllowed: parlor.avgRoyalityAmount,
                                    previousBalance: 0,
                                    usageThisMonth: distanceRevenue,
                                    refundable: true,
                                },
                                {
                                    supportCategoryId: "5b07c343885fca10041b35b5",
                                    supportTypeName: "Loyality",
                                    supportCategoryName: "Salon Driven Support",
                                    percentage: 100,
                                    totalUsageAllowed: parlor.avgRoyalityAmount,
                                    previousBalance: 0,
                                    usageThisMonth: loyalityRevenue,
                                    refundable: true,
                                }
                            ];

                            var salonDrivenDiff= Math.min(totalUsageAllowed*2 - (loyalityRevenue + product) , 0) ;
                            var beuDrivenDiff = totalUsageAllowed - distanceRevenue;
                            var salonDrivenAmount=salonDrivenDiff/parlor.reverseChargeMultiple;
                            var beuDrivenAmount=beuDrivenDiff>0?(beuDrivenDiff/3):beuDrivenDiff/parlor.reverseChargeMultiple;
                            var amountToBeCharged = parseInt(parseInt(beuDrivenAmount+salonDrivenAmount)*1.18);
                            console.log(salonDrivenDiff , beuDrivenDiff,totalUsageAllowed ,distanceRevenue, amountToBeCharged , parlor._id)
                            var obj = {
                                cityId: parlor.cityId,
                                parlorId: parlor.id,
                                parlorName: parlor.name,
                                active: parlor.active,
                                quarterDate : startDate.getDate()+' '+startMonth+' - ' +endDate.getDate()+ ' '+endMonth+' Support',
                                usageMonth: startDate.getMonth(),
                                usageYear: startDate.getFullYear(),
                                startDate: startDate,
                                royalityAmount: parlor.avgRoyalityAmount ? parlor.avgRoyalityAmount : 0,
                                supportTypes: [],
                                projectedRevenue: 0,
                                supportProvided: Math.round(loyalityRevenue + product + distanceRevenue),
                                currentQuarterUsageAllowed: Math.round(totalUsageAllowed),
                                currentAmountUsage: Math.round(loyalityRevenue + product + distanceRevenue ),
                                differenceInSalonDriven : Math.round(salonDrivenDiff),                              
                                differenceInBeuDriven : Math.round(beuDrivenDiff),  
                                amountToBeCharged : Math.round(amountToBeCharged),                              

                            }
                            obj.supportTypes = supportTypes;
                            // console.log(obj)
                            QuarterlySalonSupportData.create(obj, function(err, created) {
                                if (!err) {
                                    // d.push(aa)
                                    callback();
                                } else
                                    callback();
                            });
                        });
                });
            });
        }, function allTaskCompleted() {
            res.json('done')
        });
    });
});

router.get('/createSubscriptionRenewalFacebookQuery', function(req,res){
    let arr = []
    SubscriptionSale.find({createdAt:{$gt:new Date(2018, 6, 1),$lt:new Date(2018, 7, 1)}},(err,foundsales)=>{
        if(err){
            console.log('err')
        } else{
            console.log(foundsales.length)
            async.eachSeries(foundsales,(sale,cb)=>{
                User.findOne({_id:sale.userId},{phoneNumber:1},(err,user)=>{
                    if(user){
                        let newObj = {name : user.firstName, phoneNumber : user.phoneNumber, source : "Renewal"}
                        newObj.subscriptionTeam = {allotDate : new Date(), customerCareName : "Poonam", customerCareId : ObjectId("5c25f3d1a94e5e7ebcdcafe7")}
                        FacebookQuery.findOne({phoneNumber:user.phoneNumber},(err,query)=>{
                            if(query){
                                if(!query.subscriptionTeam){
                                    console.log(query.subscriptionTeam)
                                    console.log('Appointment team')
                                    FacebookQuery.update({phoneNumber:user.phoneNumber},{subscriptionTeam:newObj},(err,updatedquery)=>{
                                        console.log('updated')
                                         cb()
                                    })
                                }else{
                                    console.log('Already alloted')
                                    arr.push(query.phoneNumber)
                                    //console.log(arr)
                                    cb();
                                }
                            }else{
                                console.log('created')
                                FacebookQuery.create(newObj,(err,created)=>{
                                    if(err){
                                        console.log('error in creating query') 
                                        cb()         
                                    }else{
                                        console.log('created')
                                        cb()
                                    }    
                                })
                            }
                        })
                    }     
                    else{
                        cb();
                    }                                                                
                })
            }, () => {
                console.log('Done')
                console.log(arr)
                res.json({message:'Already Alloted Users',phoneNumbers:arr})
            })
        }
    })
})

router.get('/createMarketingUsers', function(req,res){
    Appointment.updateNewUsersInMarketingUsers();
})

router.get('/createrazorPayContact', function(req,res){
    Admin.find({_id:"5d1aed91d9679d5a9ea2a81e"},{parlorId:1,firstName:1,phoneNumber:1,ifscCode:1,accountNumber:1},(err,owners)=>{
        async.eachSeries(owners,(owner,cb)=>{
            console.log(owner)
            Admin.createRazorPayXContactId(owner._id,owner.parlorId,owner.phoneNumber,owner.firstName,function(contactId){
                console.log('contactId :'+contactId)
                let contactIdRazorPay = contactId;
                owner.razorPayXContactId = contactId;
                Admin.addFundAccountToContactId(contactIdRazorPay,owner.firstName,owner.ifscCode,owner.accountNumber,function(data){
                    owner.razorPayXAccountId = data.id;
                    owner.save();
                    res.json({message:'done',data:data})
                })
            })
            cb()
        })
    })
})

function sendEmail(transporter,mailOptions){
    transporter.sendMail(mailOptions, function (error, info) {
        if (error){
            console.log(error);
        }
        else{
            console.log('Message sent: '); 
        }
    });
}

router.get('/sendEmail',(req,res)=>{
    var transporter = nodemailer.createTransport('smtps://reports@beusalons.com:wx2t2Tr7pMrqnK2CIqwd3g@smtp.mandrillapp.com');
    var mailOptions = {
        from: 'info@beusalons.com', // sender address
        to: ['meghaagrawal@beusalons.com' ] ,// list of receivers
        html: '<div>hi there</div>',
        subject: 'Payment for PaymentId : '// Subject line
    };   
    transporter.sendMail(mailOptions, function (error, info) {
        if (error){
            console.log(error);
            res.json({error:error})
        }
        else{
            console.log('Message sent: '); 
            res.json({message:'sent'})
        }
    })
})

router.get('/getGiftSummary', function(req,res){
    let subscriptionBought,appointmentTaken, data =[],ap=0,sb=0,newappt=0
    SubscriptionSale.find({actualPricePaid:0,createdAt:{$gt:new Date(2019,3,1),$lt:new Date(2019,5,1)}},{userId:1,createdAt:1}).exec((err,sales)=>{
        async.each(sales,(sale,cb)=>{
            Appointment.findOne({'client.id':sale.userId,createdAt:{$gt:sale.createdAt},status:{$in:[1,3]},loyalitySubscription:{$gt:0}},(err,appointments)=>{
                if(appointments){
                    ap++
                    if(appointments.client.noOfAppointments==0)newappt++
                }
                SubscriptionSale.find({userId:sale.userId,actualPricePaid:{$gt:0},createdAt:{$gt:sale.createdAt}},(err,subscriptions)=>{
                    if(subscriptions.length>0){sb++}
                    // data.push({userId:sale.userId,appointmentTaken:appointments.length,subscriptionBought:subscriptions.length})
                    cb()
                })
            })
        },()=>{
            data.push({total:sales.length,appointments:ap,subscriptions:sb,newAppointment:newappt})
            res.json(data)
        })
    })
})

router.get('/parlordata',(req,res)=>{
    Appointment.aggregate([
        {$match:{parlorId:{$in:[ObjectId("5a0ffcd301afd40ad4ba540a")]}}},
        {$group:{_id:'$client.phoneNumber',sum:{$sum:'$loyalitySubscription'}}}
    ],(err,appointments)=>{
        console.log(err)
        console.log(appointments.length)
        res.json(appointments)
    })
})

router.get('/apmarketingSummary',function(req,res){
    Appointment.aggregate([
        {$match:{marketingSource:{$exists:true},status:3}},
        {$group:{_id:{$toLower:'$marketingSource.source'},totalUsers:{$sum:1}}}
    ],(err,appointments)=>{
        console.log(err)
        //console.log(appointments.length)
        res.json(appointments)
    })
})

router.get('/userMarketingSummary',function(req,res){
    let data = {},obj = []
    User.aggregate([
        {$match:{marketingSource:{$exists:true}}},
        {$group:{_id:{$toLower:'$marketingSource.source'},totalUsers:{$sum:1}}}
    ],(err,sources)=>{
        console.log(err)
        async.each(sources,(source,cb1)=>{
            let ap1=0,ap2=0,ap3=0,ap4=0,ap=0,subscriber=0,sum=0,moreThan2000=0,lessThan500=0,lessThan1000=0,lessThan2000=0
            if(source._id!=''){
                User.find({'marketingSource.source':source._id,createdAt:{$gt:new Date(2019,3,1),$lt:new Date(2019,5,1)}},{marketingSource:1,subscriptionId:1},(err,users)=>{
                    if(err)console.log('errrr')
                    console.log(users.length)
                    async.each(users,(user,cb)=>{
                        if(user.subscriptionId!=0)subscriber++
                        Appointment.find({'client.id':user._id,appointmentStartTime:{$gt:new Date(2019,3,1)}},(err,appointments)=>{
                            if(err)console.log('err')
                            if(appointments.length==1)ap1++;
                            else if(appointments.length==2)ap2++;
                            else if(appointments.length==3)ap3++
                            else if(appointments.length==0)ap++
                            else ap4++
                            sum=0
                            async.each(appointments,(appointment,callback)=>{
                                sum =  sum + appointment.serviceRevenue
                                callback()
                            },()=>{
                                if(sum<500)lessThan500++
                                else if(sum<1000)lessThan1000++
                                else if(sum<2000)lessThan2000++
                                else moreThan2000++
                            })
                            cb()
                        })
                    },()=>{
                        data.source = source._id
                        data.totalUsers = users.length
                        data.subscriber = subscriber
                        data.appointments= {appointments0:ap,appointments1:ap1,appointments2:ap2,appointments3:ap3,appointmentsMoreThan3:ap4}
                        data.billingValue = {lessThan500:lessThan500,lessThan1000:lessThan1000,lessThan2000:lessThan2000,moreThan2000:moreThan2000}
                        obj.push(data)
                        data = {}
                        console.log(source._id)
                        console.log('ddddd')
                        cb1()
                    })
                })
            }else{
                cb1()
            }
        },()=>{
            console.log('complete')
            res.json(obj)
        })
    })
})




module.exports = router;