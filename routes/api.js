'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var request = require('request');
var nodemailer = require('nodemailer');


const fs = require('fs');
const Guid = require('guid');
const bodyParser = require("body-parser");
const Mustache = require('mustache');
const Request = require('request');
const Querystring = require('querystring');
const app = express();

var csrf_guid = Guid.raw();
const account_kit_api_version = 'v1.0';
const app_id = '332716867100293';
const app_secret = 'cb129f0de55a44e17756bf30bd8b5415';
const me_endpoint_base_url = 'https://graph.accountkit.com/v1.0/me';
const token_exchange_base_url = 'https://graph.accountkit.com/v1.0/access_token';
var PAYTM_MERCHANT_MID = 'GinSwa65124226602132';
var PAYTM_MERCHANT_KEY = 'YxIwf0X&_nsXCR8O';
var PAYTM_INDUSTRY_TYPE = 'Retail109';
var MERCHANT_GUID = 'e50c9619-34af-42c6-bb58-d7ef2274b496';
var RAZORPAY_KEY = localVar.getRazorKey();
var RAZORPAY_APP_SECRET = localVar.getRazorAppSecret();
var request = require('request');
var Razorpay = require('razorpay');





// middleware that is specific to this router

router.post("/updateArtistId", function(req, res) {
    Admin.findOne({ phoneNumber: req.body.phoneNumber }, { _id: 1 }, function(err, adminId) {
        if (err) {
            res.json({ success: false, data: "Error in finding employee." })
        } else {
            Admin.update({ _id: adminId }, { $set: { artistId: req.body.artistId } }, function(err, updated) {
                if (err) {
                    res.json({ success: false, data: "Error in updating artist Id" })
                } else {
                    res.json({ success: true, data: "Artist Id updated successfully" });
                }
            });
        }
    });
});

router.get('/addGiftToCorporate', function(req, res, next) {
    console.log(req.query.emailId)
    User.findOne({corporateEmailId : req.query.email, subscriptionId : {$nin : [1,2]}, isCorporateUser : true}, function(err, d){
        if(d){
              let name = d.firstName
              if(d.subscriptionId != 1 && (extension == "@beusalons.com" || extension == "@maxposuremedia.in")){
                  Appointment.addSubscriptionToUserForOneMonth("594a359d9856d3158171ea4f", d.id, new Date(), {id : "CORPORATE"+d.id}, 1699, "BEU", "CORPORATEEMAIL", 1, 12, name, function(er){
                    return res.json(CreateObjService.response(false, 'done'));
                  });
              }else if(d.subscriptionId != 1){
                  Appointment.addSubscriptionToUserForOneMonth("594a359d9856d3158171ea4f", d.id, new Date(), {id : "CORPORATE"+d.id}, 1699, "BEU", "CORPORATEEMAIL", 0, 1, name, function(er){
                    return res.json(CreateObjService.response(false,  'done'));
                  });
              }else{
                  User.update({_id : d.id}, {$inc : {subscriptionValidity : 1}}, function(er, f){
                      return res.json(CreateObjService.response(false, 'done'));
                  })
              }
        }else{
            return res.json(CreateObjService.response(true, 'Email Id not Registered'));
        }
    });
});

router.get("/ePayLaterSubscriptionSold", function(req, res) {
    SubscriptionSale.aggregate([{$match : {source : "epaylater"}},
            {$project : {userId : 1, createdAt : 1}},
            {
                $lookup : {
                    from : "users",
                    localField : "userId",
                    foreignField : "_id",
                    as : "user",
                }
            },
            {$project : {_id : 0, soldAt : "$createdAt", phoneNumber : { $arrayElemAt: [ "$user.phoneNumber", 0 ] }, name : { $arrayElemAt: [ "$user.firstName", 0 ] }}}
        ])
    .exec(function(err, users){
        users = _.map(users, function(u){
            return{
                "Sold at": u.soldAt.toString(),
                "Phone Number" : u.phoneNumber,
                name : u.name
            }
        })
        res.json(users)
    })
});

router.get("/appointmentDetailById", function(req, res) {
    Appointment.findOne({_id : req.query.appointmentId}, function(err, a){
        req.body = {
            userId : a.client.id,
            datetime : a.appointmentStartTime,
            appointmentId : a.id,
            paymentMethod : a.paymentMethod,
            couponCode : a.couponLoyalityCode
        }
        User.findOne({_id : req.body.userId}, {accesstoken : 1, phoneNumber : 1, emailId : 1}, function(er, user){
            Appointment.appointmentDetailsForAppv4(req, 0, function (err, result) {
                result.accessToken = user.accesstoken
                result.userId = user.id
                result.phoneNumber = user.phoneNumber
                result.emailId = user.emailId
                return res.json(CreateObjService.response(false, result));
            });    
        })
    })
});

router.get("/appointmentDetailParlorNameById", function(req, res) {
    Appointment.findOne({_id : req.query.appointmentId}, {parlorName : 1, parlorAddress : 1}, function(err, a){
        return res.json(CreateObjService.response(false, a));
    });    
});

router.get("/renewUserAppointments", (req, res) => {
    User.find({subscriptionId : 1, subscriptionBuyDate : {$gt : new Date(2019, 0, 1)}}, {subscriptionBuyDate : 1, firstName : 1, phoneNumber : 1}, function(err, users){
        let data = [];
        Async.each(users, function(user, callback){

            Appointment.find({appointmentStartTime : {$lt : new Date(2018, 11, 31)}, status : 3, loyalitySubscription : {$gt : 0}, "client.id" : user.id}, {subtotal : 1}, function(err, appointments){
                if(appointments.length > 0){
                    SubscriptionSale.find({userId : user.id}, {userId : 1}, function(er, ss){
                        if(ss.length<2){
                            data.push({
                                phoneNumber : user.phoneNumber,
                                name : user.firstName,
                                subscriptionBuyDate : user.subscriptionBuyDate
                            })        
                        }
                        callback()       
                    })
                }
                else
                    callback()
            })
        }, function allDone(){
            res.json(data);
        })
    })
});




router.get('/generateSalonPersonalCoupons', function(req, res){
    Parlor.find({_id : "5cb7024a28fc7c3e8df4b1cc", active : true, parlorType : {$in : [0,1,2]}}, {name: 1}, function(err, parlors){
        Async.each(parlors, function(p, callback){
            let data = [];
            for(var i=0; i<10; i++){
                let emptyString = "";
                let alphabet = "ABCDEFGHIJKLMNPQRSTUVWX";
                while (emptyString.length < 5) {
                    emptyString += alphabet[Math.floor(Math.random() * alphabet.length)];
                }
                data.push({
                    couponCode : "SAL"+emptyString,
                    description : "Flat 75% off",
                    percentOff : 75,
                    maxOff : 100000,
                    endDate : new Date(2019, 6, 31),
                    startDate : new Date(),
                    parlorId : p.id,
                })
            }
            SalonPersonalCoupon.create(data, function(err, f){
                console.log("done" )
                callback()
            })
        }, function allDone(){
            res.json('done');

        })
    })
})

/*router.get("/removeServiceCode", function(req, res){
    var serviceCodes = [781,782,783,784,785,786,787,788,789,790,791,792,694,699,704,709,724,729];
        var services = [];

    Parlor.findOne({_id : ObjectId("5bf8f48f40fdce4d68d83771")}, {services : 1}, function(er, p){
        _.forEach(p.services, function(s){
            if(!(_.filter(services, function(sc){return sc.serviceCode == s.serviceCode})[0])){
                services.push(s);
            }
        });
        Parlor.update({_id : ObjectId("5bf8f48f40fdce4d68d83771")}, {services : services}, function(e, f){
            console.log(f);
            res.json(f);
        });
    });
});*/


router.get("/updateProducts", function(req, res){
    var ar = [[775,1,2136],[776,1,2136],[777,1,2137],[778,1,2137],[779,1,2138],[780,1,2138],[781,1,2150],[782,1,2150],[783,1,2152],[784,1,2152],[785,1,2150],[786,1,2150],[787,1,2152],[788,1,2152],[789,2,2150],[790,2,2150],[791,1,2152],[792,1,2152]];
    console.log(ar.length);
   /* _.forEach(ar, function(a, key){
        InventoryItem.findOne({itemId : a[2]}, function(er, i){
            Service.update({serviceCode : a[0]}, {inventoryItemId : i.id, inventoryItemQunatity : a[1]}, function(e, d){
                console.log(d);
                console.log("done " + key);
            });
        });
    });*/
   /* _.forEach(ar, function(a, key){
        InventoryItem.findOne({itemId : a[2]}, function(er, i){
            ParlorItem.find({itemId : a[2]}, function(er, parlorItems){
                _.forEach(parlorItems, function(p, k2){
                    ParlorItem.update({_id : p.id}, {actualUnits : i.oneUnitQuantity * p.quantity}, function(er, df){
                        console.log("done - " + key + " - " + k2);
                    });
                });
            });
        });
    });*/
})


router.get("/opsapplocationdistance", function(req, res){
    SalonCheckin.aggregate([
            {
                $match : {createdAt : {$gt: new Date(2018, 9, 11), $lt: new Date(2018, 9, 12)}, firstCheckInLocationId : {$ne : null}},
            },
            {
                $project : {
                    userId : 1,
                    firstCheckInLocationId : 1,
                    createdAt : 1,
                }
            },
            {
                $sort : { createdAt : -1},
            },
            {
                $group : {
                    _id : "$userId",
                    userId : {$first : "$userId"},
                    checkins : {$push : {locationId : "$firstCheckInLocationId"}}
                }
            }
        ]).exec(function(err, data){
            console.log(err);
            _.forEach(data, function(d){
                let latitude1, longitude1, latitude2, longitude2, distance = 0;
                LocationTracker.findOne({_id : d.checkins[0].locationId}, function(er, loc){
                    latitude1 = loc.latitude;
                    longitude1 = loc.longitude;
                    Beu.findOne({_id : d.userId}, function(err, user){
                        if(user.latitude){
                            latitude2 = user.latitude;longitude2 = user.longitude;
                            SalonCheckin.getDistanceByRoad(latitude1, longitude1, latitude2, longitude2, function(dd){
                                SalonCheckin.update({firstCheckInLocationId : d.checkins[0].locationId}, {distanceTravelledSalonToHome : dd}, function(er, da){
                                    console.log("done! location salon home");
                                });
                            });
                        }else{
                            console.log("user location not found");
                        }
                    });
                });
            });
        });
});

router.get("/distanceByRoad", function(req, res){
    SalonCheckin.getDistanceByRoad(28.58818, 77.400363, 28.6399719513112, 77.0755765171506, function(dd){
        res.json(dd);
    });
});

router.get("/locationLogs", function(req, res){
    Beu.findOne({phoneNumber : req.query.phoneNumber}, function(er, u){
        LocationTracker.find({timeInInteger : {$gt : 0},userId : u.id, time : {$gt : HelperService.getTodayStart()}}).sort({time : 1}).exec( function(err, f){
            var dt = _.map(f, function(d){
                return{
                    time : d.time.toString(),
                    distance : (HelperService.getDistanceBtwCordinates(d.latitude, d.longitude,28.6288779, 77.3042244)) * 1000
                }
            });
            return res.json(dt);
        });
    });
});

router.get('/appointmentDetail', function(req, res){
    Appointment.find({_id : req.query.appointmentId}, function(er, data){
        return res.json(CreateObjService.response(false, Appointment.parseArray2(data, data[0].parlorTax)[0]));
    });
});

router.get('/prioritySalon', function(req, res) {
    Parlor.find({}, {appDistanceRevenue : 1,avgRoyalityAmount: 1, name : 1, appRevenuePercentage : 1, revenueDiscountAvailable : 1}, function(err, data){
        var newData = [];
        _.forEach(data, function(p){
            if(p.avgRoyalityAmount > p.appDistanceRevenue){
                newData.push(p);
            }
        });
        res.json(newData);
    });
});

router.get('/getSalonListByLatituteLongitute', function(req, res) {
    var cityId = ConstantService.getCityId(req.query.latitude, req.query.longitude);
    Parlor.find({cityId : cityId}, {latitude : 1,longitude: 1}, function(err, data){
        var newData = [];
        _.forEach(data, function(p){
            newData.push({
                latitude : p.latitude,
                longitude : p.longitude,
                parlorId : p.id,
            })
        });
                return res.json(CreateObjService.response(false, newData));
    });
});

router.get('/kabiUser', function(req, res) {
    Appointment.aggregate([
    {
        $match : {status : 3, appointmentStartTime : {$gt : new Date(2018, 6, 1), $lt : new Date(2018, 7, 1)}}
    },
    {
        $project : {
            clientId : "$client.id",
            serviceRevenue : 1,
        }
    },
    {
        $lookup : {
            from : "users",
            localField : "clientId",
            foreignField : "_id",
            as : "user",
        }
    },
    {
        $project : {
            subscriptionId : {$arrayElemAt: [ "$user.subscriptionId", 0 ] },
            clientId : 1,
            serviceRevenue : 1,
        }
    },
    {
        $match : {
            subscriptionId : {$in : [1, 2]}
        }
    },
    {
        $group : {
            _id : "$clientId",
            revenueByClient : {$sum : "$serviceRevenue"},
            totalAppointmentByClient : {$sum : 1},
        }
    },
    {
        $group : {
            _id : null,
            totalClient : {$sum : 1},
            totalRevenue : {$sum : "$revenueByClient"},
            totalAppointments : {$sum : "$totalAppointmentByClient"},
        }
    }

        ]).exec(function(er, f){
            res.json(f);
    });
});

router.get('/checkopsapp', function(req, res){

    Parlor.find({active : true}, {latitude : 1, longitude : 1, name :1}, function(err, parlors){
        var data = [];
        console.log(new Date(2018, 6, 24));
        console.log(new Date(2018, 6, 25));
     LocationTracker.find({userId : "5a0027db7ad54245c950737b", time : {$gt : new Date(2018, 6, 26), $lt : new Date(2018, 6, 27)}}).sort({time : 1}).exec(function(err, f){
            _.forEach(f, function(e){
                var obj = {
                    distance : [],
                    id : e.id,
                    time : e.time.toString(),
                }
                _.forEach(parlors, function(p){
                 var  l =  parseInt(HelperService.getDistanceBtwCordinates1(p.latitude, p.longitude, e.latitude, e.longitude) * 100)
                    if(l<=20)obj.distance.push({d : l, name : p.name, parlorId : p.id});
                });
                data.push(obj)
            });

            LocationTracker.updateVisitWithCheckInCheckOut("5a0027db7ad54245c950737b", function(d){
                res.json(data);
            });

        });
            });
})

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


router.get('/copyservice', function(req, res) {
    Parlor.findOne({ _id: ObjectId("5c11108c21b2f86fd95ad281") }, function(err, data) {
        Parlor.findOne({ _id: ObjectId("5c236251c3f2cf6c82c8bfb7") }, function(err, parlor) {
            var services = [];
            _.forEach(data.services, function(service) {
                _.forEach(service.prices, function(p) {
                    p.employees = [];
                });
                services.push(service);
            });
            Parlor.update({ _id: ObjectId("5c236251c3f2cf6c82c8bfb7") }, { services: services }, function(err, response) {
                return res.json(response);
            });
        })
    });
});

router.get('/userdd', function(req, res) {
    User.getSubscriptionLeftByMonth("5b0a9422e79862510f656cbd", new Date(), 500, function(reed) {
        res.json(reed);
    });
});

router.get('/updateMarketingUser', function(req, res) {
    var query = { status: 3, appointmentStartTime: { $gt: new Date(2018, 0, 1) } };
    Appointment.count(query, function(err, fetchedUsers) {
        var loopCounter = Math.ceil(fetchedUsers / 1000);
        var loopsCount = [];
        for (var i = 0; i < loopCounter; i++) {
            var last = loopCounter - (i + 1);
            loopsCount.push(last);
        }
        async.eachSeries(loopsCount, function(lop, cbr) {
            var limi = 1000;
            var ski = 1000 * lop;
            // MarketingUser.find(queryForSegemet, { phoneNumber: 1 }, function(err, fetchedUsers) {
            Appointment.find(query, { services: 1, "client.id": 1, appointmentStartTime: 1 }, function(err, appointments) {
                console.log(appointments.length);
                _.forEach(appointments, function(appointment, key) {
                    Appointment.addMarketingNotification(1, appointment.appointmentStartTime, appointment.services, appointment.client.id, function(d) {
                        console.log("done" + key);
                    });
                });
                cbr();
            }).skip(ski).limit(limi)
        }, function() {
            console.log(" Tasks Complted")
        })
    });
});

router.get('/comboReport', function(req, res) {
    Appointment.aggregate([
        { $match: { "services.type": { $in: ["combo", "newCombo"] }, status: 3, appointmentStartTime: { $gt: new Date(2017, 5, 25) } } },
        { $unwind: "$services" },
        { $match: { "services.type": { $in: ["combo", "newCombo"] } } },
        {
            $group: {
                _id: { appointmentId: "$_id", name: "$services.name" },
                name: { $first: "$services.name" },
                type: { $first: "$services.type" }
            }
        },
        {
            $group: {
                _id: { name: "$name" },
                name: { $first: "$name" },
                type: { $first: "$type" },
                count: { $sum: 1 },
            }
        },
        { $sort: { count: -1 } }
    ]).exec(function(er, d) {
        res.json(d);
    });
});

router.post('/newWebsiteQuery', function(req, res){
    WebsiteQuery.create({name : req.body.name, phoneNumber : req.body.phoneNumber}, function(err, d){
         var emailIds = ['shailendra@beusalons.com', 'poonamahuja@beusalons.com', 'ashisharora@beusalons.com']
         // console.log(d)
         // var emailIds = ['nikitachauhan@beusalons.com']

                function sendEmail() {
                    var transporter = nodemailer.createTransport('smtps://reports@beusalons.com:wx2t2Tr7pMrqnK2CIqwd3g@smtp.mandrillapp.com');
                    var mailOptions = {
                        from: 'info@beusalons.com', // sender address
                        to: emailIds, // list of receivers
                        html: '<div>Hi, There is a new subscription request on website. Name- <b>'+d.name+'</b>, Phonenumber- <b>'+d.phoneNumber+'</ b>.</div>',
                        subject: 'New Subscription Request on Website' // Subject line
                    };
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error)
                            console.log(error);
                        else
                            console.log('Message sent: ' + info.response);
                    });
                }
                sendEmail();
        return res.json(CreateObjService.response(false, 'Successfully Sent!'));
    });
});

router.post('/fbLoginSuccess', function(req, res) {
    // CSRF check

    console.log("csrf_guid------------", csrf_guid);
    console.log("req.body.csrf------------", req.body.code)
        // if (req.body.csrf === csrf_guid) {
    if (1) {
        var app_access_token = ['AA', app_id, app_secret].join('|');
        var params = {
            grant_type: 'authorization_code',
            code: req.body.code,
            access_token: app_access_token
        };

        // exchange tokens
        var token_exchange_url = token_exchange_base_url + '?' + Querystring.stringify(params);
        Request.get({ url: token_exchange_url, json: true }, function(err, resp, respBody) {
            // get account details at /me endpoint
            res.json(respBody);

            var me_endpoint_url = me_endpoint_base_url + '?access_token=' + respBody.access_token;
            Request.get({ url: me_endpoint_url, json: true }, function(err, resp, respBody) {
                // send login_success.html
                res.json(respBody);

            });
        });
    } else {
        // login failed
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end("Something went wrong. :( ");
    }

});

router.post('/homePage', function(req, res, next) {
    Parlor.find({ active: true }, { _id: 1, name: 1, address: 1, address2: 1, parlorType: 1, images: 1, rating: 1, latitude: 1, longitude: 1 }, function(err, parlors) {
        console.log("parlors");
        var parlors = _.map(parlors, function(p) {
            return {
                name: p.name,
                parlorId: p.id,
                address1: p.address,
                parlorType: p.parlorType,
                address2: p.address2,
                image: p.images[0] ? p.images[0].imageUrl : '',
                rating: parseInt(p.rating),
                favourite: false,
                recent: false,
                distance: HelperService.getDistanceBtwCordinates(req.body.latitude, req.body.longitude, p.latitude, p.longitude),
            };
        });
        var deals = ConstantService.getDeals();
        var packages = [];
        ParlorService.getPackages(function(pack) {
            packages = pack;
            var obj = {
                deals: deals,
                carousels: ConstantService.getCarousel(),
                discountRules: ConstantService.getDiscountRules(),
                notificationCount: 0,
                referCode: null,
                packages: packages,
                popularSalons: _.slice(_.sortBy(parlors, 'rating'), 0, 8),
                favouriteSalons: _.filter(parlors, function(p) { return p.favourite || p.recent }),
                nearBySalons: _.slice(_.filter(_.sortBy(parlors, 'distance'), function(p) { return p.distance < 500; }), 0, 6),
                freebies: ConstantService.getFreeBies(null, null),
            };

            return res.json(CreateObjService.response(false, obj));
        });
    });
});


router.post('/loyalityPoints', function(req, res, next) {
    var newFreebies = ConstantService.getFreeBiesNewObject("");
    var obj = { newFreebies: newFreebies };
    return res.json(CreateObjService.response(false, obj));
});

//Deals parlor types discount correction
/*router.get('/updateDealParlorType', function(req, res){
    AllDeals.find({}, {parlorTypes : 1, parlorTypesDetail : 1}, function(err, deals){
        console.log(deals.length);
        _.forEach(deals, function(d, key){
            var tempObj = _.map(d.parlorTypes, function(p){
                return {
                    type : p,
                };
            });
            AllDeals.update({_id : d.id}, {parlorTypesDetail : tempObj}, function(err, d){
                console.log(key);
            });
        })
    });
});*/

router.get('/updateAppointment', function(req, res) {
    Appointment.find({ _id: { $in: ["5a2a3bc90ef9d607aa6ed1a9"] } }, { services: 1, createdAt: 1 }, function(err, appointments) {
        console.log(appointments.length);
        _.forEach(appointments, function(appt, key) {
            var serviceRevenue = 0;
            _.forEach(appt.services, function(s) {
                s.employees = [];
                s.membershipDiscount /= 1.18;
                var s2 = Appointment.serviceFunction(appt.createdAt, s, []);
                serviceRevenue += s2.totalRevenue;
            });

            Appointment.update({ _id: appt.id }, { services: appt.services, serviceRevenue: serviceRevenue }, function(e, u) {
                console.log("done " + key);
            });
        });
    });
});

router.get('/sett', function(req, res) {
// , 
    Appointment.find({ status: 3, appointmentStartTime: { $gt: new Date(2019, 5,1 ), $lt: new Date(2019, 5, 2, 23, 59, 59) } }, { parlorName: 1, createdAt: 1, serviceRevenue: 1, subtotal: 1, loyalityPoints: 1, productRevenue: 1, services: 1, membershipDiscount: 1 }, function(err, appointments) {


        var data = [];
        console.log(appointments.length);
        _.forEach(appointments, function(appt) {
            var realRevenue = (appt.subtotal - appt.loyalityPoints) + appt.loyalityPoints * 0.5 - appt.membershipDiscount;
            console.log(realRevenue);
            console.log(appt.serviceRevenue);
            var serviceRevenue = 0;
            _.forEach(appt.services, function(s) {
                s.employees = [];
                var s2 = Appointment.serviceFunction(appt.createdAt, s, []);
                serviceRevenue += s2.totalRevenue;
            });

            if ((((serviceRevenue - realRevenue) >= 3 || (serviceRevenue - realRevenue) <= -3) && appt.productRevenue == 0)) {
                data.push({
                    id: appt.id,
                    parlorName: appt.parlorName,
                    realRevenue: realRevenue,
                    revenue: appt.serviceRevenue,
                    diff: realRevenue - appt.serviceRevenue,
                    realDif: serviceRevenue - realRevenue,

                });
            }
        });
        res.json(data);
    });
});


router.get('/employeeReport', function(req, res) {
    Appointment.aggregate([
        { $match: { status: 3, appointmentStartTime: { $gt: new Date(2017, 6, 1) } } },
        { $unwind: "$services" },
        {
            $project: {
                name: "$services.name",
                serviceId: "$services.serviceId",
                size: { $size: "$services.employees" },
            }
        },
        {
            $match: { size: { $gt: 1 } }
        },
        {
            $sort: { size: -1 }
        },
        {
            $group: {
                _id: {
                    serviceId: "$serviceId",
                    size: "$size",
                },
                name: { $first: "$name" },
                serviceId: { $first: "$serviceId" },
                size: { $first: "$size" },
                count: { $sum: 1 },
            }
        },
        {
            $sort: { count: 1 },
        },
        {
            $group: {
                _id: {
                    serviceId: "$serviceId",
                },
                name: { $first: "$name" },
                size: { $push: { size: "$size", count: "$count" } },
            }
        },

    ]).exec(function(er, d) {
        console.log(er);
        res.json(d);
    });
});

router.get('/userLoyalityCredit', function(req, res) {
    User.aggregate([{
            $unwind: "$creditsHistory"
        },
        {
            $project: {
                _id: 1,
                loyalityPoints: 1,
                'creditsHistory.amount': 1
            }
        },
        {
            $group: {
                _id: {
                    userId: '$_id'
                },
                loyalityPoints: { $first: "$loyalityPoints" },
                amount: { $sum: "$creditsHistory.amount" },
            }
        },

    ]).exec(function(err, results) {
        var data = [];
        _.forEach(results, function(r) {
            if (r.amount != r.loyalityPoints) data.push({ userId: r._id.userId, loyalityPoints: r.loyalityPoints, amount: r.amount });
        });
        console.log(data.length);
        res.json(data);
    });
});

router.post('/createBeacon', function(req, res) {
    Beacon.create(Beacon.getNewBeaconObj(req), function(err, beacon) {
        if (err) {
            console.log(err);
            return res.json(CreateObjService.response(true, 'Error'));
        } else {
            return res.json(CreateObjService.response(false, 'successfully created'));
        }
    });
});

router.get('/revenue2', function(req, res) {
    Appointment.aggregate([{
            $match: { appointmentStartTime: { $gte: new Date(2017, 4, 1), $lt: new Date(2017, 4, 31, 23, 59, 59) }, status: 3 },
        },
        {
            $project: {
                parlorId: 1,
                parlorName: 1,
                serviceRevenue: 1,
                productRevenue: 1,
            }
        },
        {
            $group: {
                _id: {
                    parlorName: "$parlorName",
                },
                parlorId: { $first: "$parlorId" },
                noOfAppointments: { $sum: 1 },
                serviceRevenue: { $sum: "$serviceRevenue" },
                productRevenue: { $sum: "$productRevenue" },
            }
        },
    ]).exec(function(err, d) {
        console.log(err);
        res.json(d);
    });
})


router.get('/revenue3', function(req, res) {
    Appointment.find({ parlorId: "587088445c63a33c0af62727", appointmentStartTime: { $gte: new Date(2017, 8, 15), $lt: new Date(2017, 8, 17, 23, 59, 59) }, status: 3 }, { createdAt: 1, 'parlorAppointmentId': 1, 'services.discountMedium': 1, 'services.categoryId': 1, 'services.frequencyDiscountUsed': 1, 'services.price': 1, 'services.additions': 1, 'services.quantity': 1, 'services.discount': 1, 'services.membershipDiscount': 1, 'services.loyalityPoints': 1, 'products.quantity': 1, 'products.price': 1, 'serviceRevenue': 1 }, function(err, appointments) {
        _.forEach(appointments, function(appt) {
            var serviceRevenue = 0;
            _.forEach(appt.services, function(s) {
                s.employees = [];
                var s2 = Appointment.serviceFunction(appt.createdAt, s, []);
                serviceRevenue += s2.totalRevenue;
            });
            if (serviceRevenue != appt.serviceRevenue) {
                console.log(serviceRevenue);
                console.log(appt.serviceRevenue);
                console.log("found");
                console.log(appt.id);
            }
        });
        res.json("done");
    });
});


router.get('/updateRevenue', function(req, res) {
    SuperCategory.find({}, function(err, supercategories) {
        ServiceCategory.find({}, function(err, categories) {
            Appointment.find({ serviceRevenue: 0, status: 3 }, { _id: 1 }, function(err, ids) {
                console.log(ids.length)
                console.log("foud22");
                Async.forEach(ids, function(id, callback) {
                    Appointment.findOne({ _id: id.id }, { createdAt: 1, 'parlorAppointmentId': 1, 'services.discountMedium': 1, 'services.categoryId': 1, 'services.frequencyDiscountUsed': 1, 'services.price': 1, 'services.additions': 1, 'services.quantity': 1, 'services.discount': 1, 'services.membershipDiscount': 1, 'services.loyalityPoints': 1, 'products.quantity': 1, 'products.price': 1 }, function(err, appointment) {
                        var serviceRevenue = 0,
                            productRevenue = 0;
                        if (appointment.products) {
                            _.forEach(appointment.products, function(p) {
                                productRevenue += (p.price * p.quantity);
                            });
                        }
                        console.log("foudn2");
                        var revenue = getDepartmentRevenue(appointment.createdAt, appointment.services, categories, supercategories);
                        Appointment.update({ _id: id.id }, { noOfService: revenue.noOfService, departmentRevenue: revenue.departmentRevenue, serviceRevenue: revenue.serviceRevenue, productRevenue: productRevenue }, function(err, e) {
                            console.log('done   ' + appointment.parlorAppointmentId);
                            callback();
                        });
                    });
                });
            }, function allTaskCompleted() {
                res.json('done');
            });
        });
    });
});

function getDepartmentRevenue(createdAt, services, categories, supercategories) {
    var sr = 0,
        departmentRevenue = [],
        noOfService = 0;
    _.forEach(services, function(s) {
        s.employees = [];
        noOfService += s.quantity;
        var serviceRevenue = Appointment.serviceFunction(createdAt, s, []);
        sr += serviceRevenue.totalRevenue;
        var category = _.filter(categories, function(c) { return c.id + "" == s.categoryId + ""; })[0];
        var superCategory = _.filter(supercategories, function(sc) { return sc.name == category.superCategory })[0];
        populateDepartment(departmentRevenue, superCategory, serviceRevenue.totalRevenue, s.quantity);
    });
    return { serviceRevenue: sr, departmentRevenue: departmentRevenue, noOfService: noOfService };
}

function populateDepartment(departmentRevenue, superCategory, revenue, noOfService) {
    var found = false;
    _.forEach(departmentRevenue, function(dr) {
        if (dr.departmentId + "" == superCategory.id + "") {
            found = true;
            dr.revenue += revenue;
            dr.noOfService += noOfService;
        }
    });
    if (!found) {
        departmentRevenue.push({
            departmentId: superCategory.id,
            revenue: revenue,
            noOfService: noOfService,
        });
    }
}


router.get('/beaconEnter', function(req, res) {
    var songName = req.query.song || "Hona Tha Pyar.mp3";
    console.log('beacon enter');
    io.sockets.emit("newSong", { data: songName });
    // io.sockets.in('587088445c63a33c0af62727').emit('newSong', {data: songName});
    res.json(CreateObjService.response(false, 'successfully entered'));
});

router.get('/createOffer', function(req, res) {
    FreebiesOffer.create({ active: true, loyalityPoints: 50, code: 'TEST' }, function(err, beacon) {
        if (err) {
            console.log(err);
            return res.json(CreateObjService.response(true, 'Error'));
        } else {
            return res.json(CreateObjService.response(false, 'successfully created'));
        }
    });
});

router.get('/freebies', function(req, res, next) {
    /*Appointment.sendAppNotificationIOS('cD6DN6kT4vo:APA91bGLAm5ylp4A4WfWydEIUQnO4L_aJzKmmMRoYxgsigqVh4vTVmVksVoere0x69l38BuNA3FkJKEAfNIBCJGwW2YwUFZvAnPJ66ej4Ig7FKzvbhLBSCJQI7whepMwbZoQLhZRw6A3', 'sdasdasad', 'adssdaasdsda', 'sdadsadsa', function(err, dd){
     res.json({err : err, d : dd});

     });*/
    return res.json(CreateObjService.response(false, ConstantService.getFreeBies()));
});


router.get('/newFreebies', function(req, res, next) {
    return res.json(CreateObjService.response(false, ConstantService.getFreeBiesNewObject()));
});



router.get('/sendNotification', function(req, res, next) {
    //sendIonicNotification : function(firebaseId, title, body, type, callback){
    ParlorService.sendIonicNotification("duJX7IylrqA:APA91bEg5T6iNZDtgS8AMxzyrebHfqULr4Vz6nw0TSZ6p3ZIJJ98ldQYZPoUF3sgWfTM_H-xaRAmdtLGANA7xRJBsbWUUjfaP0uEF9ZvuD8JXLYbTo53BgflSKLtqRkwnDaNUcoG0_oz", "Titlgh45689654jghje", "dffdsfdsfdsfdsfdsBodkjggjhjkhjghjhhjghg767867vghhjgy", "type", 'sdadsasaddsa', function() {

    });

});


/*
 // Function to capture uncaptured razor payments
 router.get('/razor', function(req, res){
 var request = require('request');
 var RAZORPAY_KEY = localVar.getRazorKey();
 var RAZORPAY_APP_SECRET = localVar.getRazorAppSecret();
 var Razorpay = require('razorpay');
 var instance = new Razorpay({
 key_id: RAZORPAY_KEY,
 key_secret: RAZORPAY_APP_SECRET
 });
 var async = require('async');
 instance.payments.all({
 from: parseInt(HelperService.get30MinBefore().getTime()/1000),
 }).then((response) => {
 console.log(HelperService.get30MinBefore());
 console.log(parseInt(HelperService.get30MinBefore().getTime()/1000));
 async.parallel([
 function (done) {
 async.each(response.items, function (item, callback) {
 console.log(item);
 if(item.status == "authorized"){
 Appointment.findOne({_id : item.notes.appointmentId}, function(err, appointment){
 var obj = {
 razorpay_payment_id : item.id,
 bookByApp : appointment.discountOnOnlinePayment ? appointment.discountOnOnlinePayment : false,
 amount : item.amount,
 };
 Appointment.captureRazorPayment(instance, obj, function(response1){
 console.log("authorized payment" + response1);
 callback();
 });
 });
 }

 }, done);
 }
 ], function allTaskCompleted() {
 console.log('done');
 return res.json(d);
 });
 }).catch((error) => {
 console.log(error);
 });
 });
 */

router.get('/nearBySalons', function(req, res, next) {
    Parlor.aggregate([{
        $geoNear: {
            near: { type: "Point", coordinates: [28.5552602, 77.2736233] },
            distanceField: "geo.distance",
            maxDistance: 2000,
            query: { type: "public" },
            num: 5,
            spherical: true
        }
    }]).exec(function(err, a) {
        console.log(err);
        console.log(a);
    });
});

router.get('/deleteUsers', function(req, res) {
    if (localVar.getInstanceId() == 3) {
        User.remove({ phoneNumber: req.query.phone }, function(err, data) {
            return res.json(CreateObjService.response(false, data));
        })
    }
});

router.get('/addCorporateFreebie', function(req, res) {
    User.update({ phoneNumber: req.query.phone }, { corporateReferralCount: req.query.count }, function(err, users) {
        return res.json(CreateObjService.response(false, users));
    })
});

router.get('/serviceName', function(req, res) {
    console.log(req.query)
    Service.find({ serviceCode: req.query.serviceCode }, { _id: 1, gender: 1, name: 1, serviceCode: 1 }, function(err, data) {
        return res.json(CreateObjService.response(false, data));
    })
})


router.get('/deleteFreeService', function(req, res) {
    User.update({ phoneNumber: req.query.phone }, { $set: { freeServices: [] } }, function(err, update) {
        if (err) {
            return res.json(CreateObjService.response(true, err));
        } else {
            return res.json(CreateObjService.response(false, update));
        }
    })
})

/*router.get('/updateHairService' , function(req,res){
 Parlor.find({_id: {$in : [ObjectId("5b77f9fd33b466647f155369"),ObjectId("5b7ac6f81461444996afbcbf"),ObjectId("5b9ca4ad79efa417ae4beb5a"),ObjectId("5b9ccc9bea820945123e3ea6"),ObjectId("5bb4b518953042634f76dde2"),ObjectId("5c10c0fa0a260d18626b6cbb"),ObjectId("5c124bac535bcc05d4c5c4b0"),ObjectId("5c125482c998992de393289f"),ObjectId("5c125874535bcc05d4c5c4f2"),ObjectId("5c125f08831e2c6ee51e5066"),ObjectId("5c1264fc535bcc05d4c5c53c"),ObjectId("5c1382fec9407421a4c1b7f9"),ObjectId("5c17404d5daf4d3abe2d1fbf"),ObjectId("5c19f52a0a849106e2c21a46"),ObjectId("5c1a35571e460454bd61fa80"),ObjectId("5c1b4cdf0674230e0c4a556f"),ObjectId("5c1b789d58a64b3f0e42fce3"),ObjectId("5c1ba24dcfbad75b090047a7"),ObjectId("5c1cb87d994e8c1753705328"),ObjectId("5c21f3168517951c26e7f38c"),ObjectId("5c238d76ebc5762dfcd0b8c7"),ObjectId("5c24b8994e4e37547c718e18"),ObjectId("5c262be4fc627c320c004ec3"),ObjectId("5c27352eb39f5c70d6da18b5"),ObjectId("5c277306b39f5c70d6da27de"),ObjectId("5c288c59fc627c320c00a6ae"),ObjectId("5c2a16f0e748485e71ca3162"),ObjectId("5c2a1be6e748485e71ca31a0"),ObjectId("5c2de0b1d4a24421534d9a8a"),ObjectId("5c3b1da4ca2b301f7a8fb3aa"),ObjectId("5c3ee6ab6c40b83dd0df3954"),ObjectId("5c407863674e92323b7b2131"),ObjectId("5c49899d388a2874f89c49b4"),ObjectId("5c50302c14eda87b01f5b9a2"),ObjectId("5c513ab60e8c70186f7599a6"),ObjectId("5c518aefa6de9f19ec93b60b"),ObjectId("5c52d3326b70ff671c299f94"),ObjectId("5c54565c47abed6b0e457122"),ObjectId("5c556fd44360a939524827a0"),ObjectId("5c55787f39ecbf4639d4a07b"),ObjectId("5c5eb09a532f90496b0b3248"),ObjectId("5c612fb5ae58076320cb4134")]}} , function (err,parlors){
 _.forEach(parlors, function(parlor){
 _.forEach(parlor.services , function(ser){
 _.forEach(ser.prices , function (pri){
 _.forEach(pri.additions , function(add){
 if(add.name == "Length"){
 _.forEach(add.types , function (type){
 if(type.name == "Normal - Short")type.name = "Normal - Short (Upto Chin)";
 if(type.name == "Normal - Medium")type.name = "Normal - Medium (Upto Shoulder)";
 if(type.name == "Normal - Long")type.name = "Normal - Long (Upto Mid Back)";
 if(type.name == "Normal - Extra Long")type.name = "Normal - Extra Long (Upto Waist)";
 if(type.name == "Normal - XXL")type.name = "Normal - XXL (Upto Knees)";
 if(type.name == "Thick - Short")type.name = "Thick - Short (Upto Chin)";
 if(type.name == "Thick - Medium")type.name = "Thick - Medium (Upto Shoulder)";
 if(type.name == "Thick - Long")type.name = "Thick - Long (Upto Mid Back)";
 if(type.name == "Thick - Extra Long")type.name = "Thick - Extra Long (Upto Waist)";
 if(type.name == "Thick - XXL")type.name = "Thick - XXL (Upto Knees)";
 })
 }
 })
 })
 })

 Parlor.update({_id:parlor.id},{services:parlor.services} , function(err,data){
 console.log(err)
 console.log(data)
 })
 })
})
});*/



// router.get('/updateHairServiceNames' , function(req,res){
//     Service.find({"prices.additions.name":"Length"  }, function (err,parlor){
//         _.forEach(parlor.prices , function (pri){
//             _.forEach(pri.additions , function(add){
//                 if(add.name == "Length"){
//                     add.types = [
//                     "Short (Upto Chin)",
//                     "Medium (Upto Shoulder)",
//                     "Long (Upto Mid Back)",
//                     "Extra Long (Upto Waist)",
//                     "XXL (Upto Knees)",
//                     "Short (Upto Chin)","Medium (Upto Shoulder)","Long (Upto Mid Back)","Extra Long (Upto Waist)","XXL (Upto Knees)"]
//                 }
//             })
//         })
//         Service.update({categoryId:"58707ed90901cc46c44af27d"},{prices:parlor.prices} , function(err,data){
//             console.log(err)
//             console.log(data)
//             return res.json(CreateObjService.response(false, "done"));
//         })
//     })
// });



router.get('/updateDeals1', function(req, res) {
    Deals.find({ parlorId: "596f03f0f49c8a201ceb1d3b" }, { dealId: 1 }, function(err, deals) {
        console.log(deals.length);
        _.forEach(deals, function(d, key) {
            Deals.findOne({ dealId: d.dealId, parlorId: "595ca30144e0ad780f74f313" }, { genders: 1, categoryIds: 1 }, function(err, deal) {
                Deals.update({ _id: d.id }, { categoryIds: deal.categoryIds, genders: deal.genders }, function(err, d) {
                    console.log("done", key);
                });
            })
        })
    });
});


router.post('/dealsDetailApp', function(req, res) {
    var dealIds = _.map(JSON.parse(req.body.dealIds), function(deal) { console.log(deal); return deal.dealId });
    var noOfDeals = dealIds.length;
    User.findOne({ _id: req.query.userId }, { favourites: 1, recent: 1 }, function(err, user) {
        if (!user) user = {};
        Deals.find({ dealId: { $in: dealIds }, active: 1, showOnApp: true }).populate('parlorId', { active: 1, name: 1, id: 1, images: 1, address: 1, address2: 1, closingTime: 1, parlorType: 1, link: 1, openingTime: 1, rating: 1, budget: 1, latitude: 1, longitude: 1, 'services.serviceCode': 1, 'service.name': 1, 'service.price': 1, 'service.basePrice': 1 }).exec(function(err, deals) {
            var data = _.map(deals, function(deal) {
                var dealInfo = getDealInfo(deal, JSON.parse(req.body.dealIds));
                if (deal.parlorId && deal.parlorId.active) {
                    return {
                        menuPrice: parseInt(deal.menuPrice),
                        dealPrice: parseInt(dealInfo.price),
                        deals: [dealInfo],
                        parlorName: deal.parlorId.name,
                        parlorId: deal.parlorId.id,
                        parlorImage: deal.parlorId.images,
                        parlorAddress1: deal.parlorId.address,
                        parlorAddress2: deal.parlorId.address2,
                        closingTime: deal.parlorId.closingTime,
                        parlorType: parseInt(deal.parlorId.parlorType),
                        link: deal.parlorId.link,
                        openingTime: deal.parlorId.openingTime,
                        rating: deal.parlorId.rating,
                        favourite: _.filter(user.favourites, function(f) { return f.parlorId == deal.parlorId.id; })[0] ? true : false,
                        recent: user.recent ? user.recent.parlorId == deal.parlorId.id ? true : false : false,
                        price: deal.parlorId.budget,
                        distance: HelperService.getDistanceBtwCordinates(req.body.latitude, req.body.longitude, deal.parlorId.latitude, deal.parlorId.longitude)
                    };
                } else return null;
            });
            data = _.filter(data, function(d) { return !_.isEmpty(d); });
            if (req.query.sort == 1) data = _.sortBy(data, 'rating').reverse();
            else if (req.query.sort == 2) data = _.sortBy(data, 'price'); //price low to high
            else if (req.query.sort == 3) data = _.sortBy(data, 'price').reverse(); //price high to low
            else
                data = _.sortBy(data, 'distance');
            var dealsData = [];
            _.forEach(data, function(d) {
                var found = false;
                _.forEach(dealsData, function(s) {
                    if (s.parlorId + "" == d.parlorId + "") {
                        found = true;
                        s.deals.push(d.deals[0]);
                        s.menuPrice += d.menuPrice;
                        s.dealPrice += d.dealPrice;
                    }
                });
                if (!found && d.dealPrice != 0) {
                    dealsData.push(d);
                }
            });
            dealsData = _.filter(dealsData, function(d) { return d.deals.length == noOfDeals });
            return res.json(CreateObjService.response(false, dealsData));
        });
    });
});


router.post('/dealsDetail', function(req, res) {
    var dealIds = _.map(req.body.dealIds, function(deal) { return deal.dealId });
    var noOfDeals = dealIds.length;
    User.findOne({ _id: req.query.userId }, { favourites: 1, recent: 1 }, function(err, user) {
        if (!user) user = {};
        Deals.find({ dealId: { $in: dealIds }, active: 1, showOnApp: true }).populate('parlorId', { active: 1, name: 1, id: 1, images: 1, address: 1, address2: 1, closingTime: 1, parlorType: 1, link: 1, openingTime: 1, budget: 1, rating: 1, latitude: 1, longitude: 1, 'services.serviceCode': 1, 'service.name': 1, 'service.price': 1, 'service.basePrice': 1 }).exec(function(err, deals) {
            var data = _.map(deals, function(deal) {
                var dealInfo = getDealInfo(deal, req.body.dealIds);
                if (deal.parlorId && dealInfo.price != 0 && deal.parlorId.active) {
                    return {
                        menuPrice: parseInt(deal.menuPrice),
                        dealPrice: parseInt(dealInfo.price),
                        deals: [dealInfo],
                        parlorName: deal.parlorId.name,
                        parlorId: deal.parlorId.id,
                        parlorImage: deal.parlorId.images,
                        parlorAddress1: deal.parlorId.address,
                        parlorAddress2: deal.parlorId.address2,
                        closingTime: deal.parlorId.closingTime,
                        parlorType: parseInt(deal.parlorId.parlorType),
                        link: deal.parlorId.link,
                        favourite: _.filter(user.favourites, function(f) { return f.parlorId == deal.parlorId.id; })[0] ? true : false,
                        recent: user.recent ? user.recent.parlorId == deal.parlorId.id ? true : false : false,
                        openingTime: deal.parlorId.openingTime,
                        rating: parseInt(deal.parlorId.rating),
                        price: deal.parlorId.budget,
                        distance: HelperService.getDistanceBtwCordinates(req.body.latitude, req.body.longitude, deal.parlorId.latitude, deal.parlorId.longitude)
                    };
                } else return null;
            });
            data = _.filter(data, function(d) { return !_.isEmpty(d); });
            if (req.query.sort == 1) data = _.sortBy(data, 'rating').reverse();
            else if (req.query.sort == 2) data = _.sortBy(data, 'price'); //price low to high
            else if (req.query.sort == 3) data = _.sortBy(data, 'price').reverse(); //price high to low
            else
                data = _.sortBy(data, 'distance');
            var dealsData = [];
            _.forEach(data, function(d) {
                var found = false;
                _.forEach(dealsData, function(s) {
                    if (s.parlorId + "" == d.parlorId + "") {
                        found = true;
                        s.deals.push(d.deals[0]);
                        s.menuPrice += d.menuPrice;
                        s.dealPrice += d.dealPrice;
                    }
                });
                if (!found && d.dealPrice != 0) {
                    dealsData.push(d);
                }
            });
            dealsData = _.filter(dealsData, function(d) { return d.deals.length == noOfDeals });
            return res.json(CreateObjService.response(false, dealsData));
        });
    });
});



function getDealInfo(deal, dealIds) {
    var dealId = _.filter(dealIds, function(d) { return d.dealId + "" == deal.dealId + "" })[0];
    if (dealId && deal.parlorId) {
        var service = _.filter(deal.parlorId.services, function(s) { return s.serviceCode == dealId.serviceCode })[0];
        if (service || deal.dealType.name == 'combo')
            return {
                name: deal.dealType.name != 'combo' ? service.name : deal.name,
                price: dealId.quantity * (deal.dealType.name != 'chooseOnePer' ? deal.dealType.price : parseInt(service.basePrice - (service.basePrice * deal.dealType.price) / 100)),
                menuPrice: dealId.quantity * deal.menuPrice,
                quantity: dealId.quantity,
                weekDay: deal.weekDay,
                serviceCode: deal.dealType.name != 'combo' ? service.serviceCode : '',
                detail: deal.description,
                serviceId: deal.dealType.name != 'combo' ? service.serviceId : '',
                dealId: deal.id,
            };
        else return { name: '', price: 0, menuPrice: 0 };
    } else return { name: '', price: 0, menuPrice: 0 };
}


/*
cityId: { type : 'number'},
            parlorPrice : {
              type : [{
                  type : {type : 'number'},
                  startAt : {type : 'number', default : 800},
                  percent : {type :'number', default : 50}
              }]
            }

            */
router.get('/updateServiceLowestPrice', function(req, res) {
    Service.find({ serviceCode: 379, subCategoryId: { $ne: null } }, { prices: 1 }, function(err, services) {
        _.forEach(services, function(s) {
            Deals.find({ serviceCode: 379, isDeleted: false, active: 1, "dealType.name": { $in: ["dealPrice", "chooseOne"] } }, { brands: 1, dealType: 1, parlorId: 1 }, function(err, deals) {
                if (deals.length > 0) {
                    var obj = {
                        cityId: 1,
                        parlorPrice: []
                    };
                    obj.parlorPrice.push({
                        type: 0,
                        startAt: 200,
                        percent: 20
                    });
                    obj.parlorPrice.push({
                        type: 1,
                        startAt: 400,
                        percent: 20
                    });
                    obj.parlorPrice.push({
                        type: 2,
                        startAt: 300,
                        percent: 20
                    });
                    Service.update({ _id: s.id }, { parlorTypesDetail: obj }, function(err, d) {
                        console.log("done");
                    });
                }
            });
        });
    });
});

router.post('/newDealsDetail', function(req, res) {
    var d = [];
    var serviceCodes = [],
        dealIds = [],
        selectedDeals = req.body.selectedDeals,
        latitude = req.body.latitude,
        longitude = req.body.longitude,
        parlors = [],
        deals = [],
        selectedDealsType = [],
        slabs = [],
        newComboDeals = [];
        console.log(selectedDeals)
    _.forEach(selectedDeals, function(s) {
        dealIds.push(s.dealId);
        _.forEach(s.services, function(service) {
            serviceCodes.push(service.serviceCode);
        });
    });
    serviceCodes = _.uniqBy(serviceCodes, function(e) { return e; });
    
    User.findOne({ _id: req.query.userId }, { favourites: 1, recent: 1 }, function(err, user) {
        if (!user) user = {};
        Async.parallel([
                function(callback) {
                    AggregateService.allParlorServiceByCode(serviceCodes, req.body.parlorId, function(results) {
                        
                        parlors = results;
                        callback(null);
                    });
                },
                function(callback) {
                    AggregateService.allDealsServiceByCode(serviceCodes, req.body.parlorId, function(results) {
                        deals = results;
                        callback(null);
                    });
                },
                function(callback) {
                    AllDeals.find({ dealId: { $in: dealIds }, active: 1 }, { dealId: 1, 'dealType.name': 1 }, function(err, alldeals) {
                        selectedDealsType = _.map(alldeals, function(d) {
                            return {
                                dealId: d.dealId,
                                dealType: d.dealType.name,
                            }
                        });
                        callback(null);
                    });
                },
                function(callback) {
                    Slab.find({}, function(err, sa) {
                        slabs = sa;
                        callback(null);
                    });
                },
                function(callback) {
                    AggregateService.comboNewComboParlors(dealIds, req.body.parlorId, function(comb) {
                        newComboDeals = comb;
                        callback(null);
                    });
                }
            ],
            function(err, results) {

                _.forEach(parlors, function(parlor) {
                    populateDealPrice(parlor.parlorId, parlor.services, deals);
                    parlor.deals = [];
                    _.forEach(selectedDealsType, function(selectedDealType) {
                        if (selectedDealType.dealType == "combo" || selectedDealType.dealType == "newCombo") {
                            var comboDeal = _.filter(newComboDeals, function(d) { return d.dealId == selectedDealType.dealId })[0];
                            var parlorPresent = _.filter(comboDeal.parlors, function(p) { return p.parlorId + "" == parlor.parlorId + "" })[0];
                            if (parlorPresent) {
                                populateComboDeal(selectedDeals, parlor, selectedDealType, parlorPresent.dealId, slabs, comboDeal.slabId, req.body.parlorId);
                            }
                        } else {
                            // console.log("selectedDeal", selectedDeals)
                            // console.log("selectedDeal", parlor)
                            populateGeneralDeal(selectedDeals, parlor, selectedDealType);
                        }
                    });
                });
                // console.log("11111111111111111",parlors)
                parlors = _.map(parlors, function(p) {
                    return {
                        parlorId: p.parlorId,
                        deals: p.deals,
                    }
                });
                // console.log("222222222222222222222",parlors)
                parlors = _.filter(parlors, function(p) { return p.deals.length == selectedDeals.length});
                
                populateParlor(parlors, latitude, longitude, function(requiredResult) {
                        if (!req.body.parlorId) {
                        let cityId = ConstantService.getCityId(req.body.latitude, req.body.longitude);
                        if(req.body.couponCode){
                            FlashCoupon.findOne({active : true, code : req.body.couponCode}, function(err, flashCoupon) {
                                if (flashCoupon) {
                                    _.forEach(flashCoupon.parlors, function(p) {
                                        if (p.currentCount > 0){
                                            _.forEach(requiredResult, function(rr) {
                                                if(rr.parlorId + "" == p.parlorId + ""){
                                                    rr.isFlashSaleAvailable = true
                                                    _.forEach(rr.deals, function(d){
                                                        if(d.serviceId + "" == flashCoupon.serviceCodes[0].serviceId + ""){
                                                            let price = _.filter(flashCoupon.cityPrice, function(cp) { return cp.cityId == cityId })[0];
                                                            d.dealPrice = price.price
                                                        }
                                                    })
                                                }                                                     
                                            })
                                        }
                                    });
                                }
                                return res.json(CreateObjService.response(false, { parlors: requiredResult }))
                            })
                        }else{
                            return res.json(CreateObjService.response(false, { parlors: requiredResult }))
                        }
                    } else {
                        Service.find({ serviceCode: { $in: serviceCodes } }, { serviceCode: 1, nameOnApp: 1 }, function(er, services) {
                            _.forEach(requiredResult, function(rr) {
                                _.forEach(rr.deals, function(deal) {
                                    _.forEach(deal.servicePrices, function(service) {
                                        var rs = _.filter(services, function(s) { return s.serviceCode == service.serviceCode })[0];
                                        if (rs) {
                                            service.name = rs.nameOnApp;
                                        }
                                    });
                                });
                            });
                            return res.json(CreateObjService.response(false, { parlors: requiredResult }))
                        });
                    }
                });
            });
    });
});

function populateParlor(parlors, latitude, longitude, callback) {
    // console.log("ayaaaaaaaaaaaaaaaaaaaaaa" ,parlors)
    var parlorIds = _.map(parlors, function(p) { return p.parlorId });
    // console.log("parlorIds" ,parlorIds)
    Parlor.find({ _id: { $in: parlorIds } }, { cityId: 1, tax: 1, earlyBirdOfferPresent: 1, dayClosed: 1, active: 1, name: 1, gender: 1, images: 1, address: 1, address2: 1, closingTime: 1, parlorType: 1, link: 1, openingTime: 1, rating: 1, budget: 1, latitude: 1, longitude: 1, noOfUsersRated : 1, ambienceRating:1, appRevenuePercentage: 1, revenueDiscountAvailable:1, revenueDiscountSlabDown : 1}, function(err, realParlors) {

        parlors = _.map(parlors, function(p) {

            var rP = _.filter(realParlors, function(rp) { return rp.id + "" == p.parlorId + "" })[0];
            var menuPrice = 0,
                dealPrice = 0;
            _.forEach(p.deals, function(deal) {
                menuPrice += deal.menuPrice;
                dealPrice += deal.dealPrice;
            });
            return {
                name: rP.name,
                gender: rP.gender,
                parlorId: p.parlorId,
                menuPrice: parseInt(menuPrice),
                dealPrice: parseInt(dealPrice),
                deals: p.deals,
                images: rP.images,
                address1: rP.address,
                address2: rP.address2,
                isFlashSaleAvailable : false,
                closingTime: rP.closingTime,
                // earlyBirdOfferPresent : rP.earlyBirdOfferPresent && !isSubscribed ? true : false,
                earlyBirdOfferPresent : rP.earlyBirdOfferPresent,
                reviewCount : rP.noOfUsersRated,
                ambienceRating : rP.ambienceRating || 3,
                appRevenueDiscountPercentage:Parlor.getAppRevenueDiscountPercentange(rP.appRevenuePercentage, rP.revenueDiscountAvailable, rP.revenueDiscountSlabDown),
                dayClosed: rP.dayClosed,
                parlorType: rP.parlorType,
                link: rP.link,
                openingTime: rP.openingTime,
                rating: rP.rating,
                price: rP.budget,
                distance: HelperService.getDistanceBtwCordinates(latitude, longitude, rP.latitude, rP.longitude),
                favourite: false,
                tax: rP.tax,
                cityId: rP.cityId,
            };
        });
        parlors = _.filter(_.sortBy(parlors, 'distance'), function(p){ return p.distance < 20});
        return callback(parlors);
    });
}

function populateComboDeal(selectedDeals, parlor, selectedDealType, parlorDealId, slabs, slabId, parlorId) {
    var menuPrice = 0,
        dealPrice = 0,
        dealId = null,
        count = 0,
        eligible = true;
    var servicePrices = [];
    var dealToBeChecked = _.filter(selectedDeals, function(de) { return de.dealId == selectedDealType.dealId })[0];
    if (dealToBeChecked) {
        if (!dealToBeChecked.quantity) dealToBeChecked.quantity = 1;
        _.forEach(dealToBeChecked.services, function(s) {
            var service = _.filter(parlor.services, function(se) { return se.serviceCode == s.serviceCode })[0];
            if (service) {
                count++;
                var brandDeal = _.filter(service.brands, function(ba) { return ba.brandId + "" == s.brandId + "" })[0];
                if (brandDeal) {
                    var productDeal = _.filter(brandDeal.products, function(po) { return po.productId + "" == s.productId + "" })[0];
                    menuPrice += dealToBeChecked.quantity * (productDeal ? productDeal.price : brandDeal.price);
                    servicePrices.push({ serviceCode: s.serviceCode, price: parseInt((parlor.tax / 100 + 1) * ((productDeal ? productDeal.price : brandDeal.price))), menuPrice: parseInt((parlor.tax / 100 + 1) * (dealToBeChecked.quantity * (productDeal ? productDeal.price : brandDeal.price))) });
                    if (eligible && (productDeal ? productDeal.price : brandDeal.price) == 0) eligible = false;
                } else {
                    menuPrice += dealToBeChecked.quantity * (service.price);
                    servicePrices.push({ serviceCode: s.serviceCode, price: parseInt((parlor.tax / 100 + 1) * (service.price)), menuPrice: parseInt((parlor.tax / 100 + 1) * (dealToBeChecked.quantity * (service.price))) });
                }
            }
        });
        dealId = parlorDealId;
        dealPrice = Appointment.getComboServicePrice(slabId, menuPrice, slabs, 5, false).price;
        if (count == dealToBeChecked.services.length && menuPrice > 0 && dealPrice > 0 && eligible) {
            var pushObj = {
                parlorDealId: dealId,
                quantity: dealToBeChecked.quantity,
                dealId: selectedDealType.dealId,
                menuPrice: parseInt(menuPrice * (parlor.tax / 100 + 1)),
                dealPrice: parseInt(dealPrice * (parlor.tax / 100 + 1)),
            };
            if (parlorId) {
                pushObj.servicePrices = servicePrices;
            }
            parlor.deals.push(pushObj);
        }
    }
}

function populateGeneralDeal(selectedDeals, parlor, selectedDealType) {

    var dealToBeChecked = _.filter(selectedDeals, function(de) { return de.dealId == selectedDealType.dealId })[0];
    if (dealToBeChecked) {
        if (!dealToBeChecked.quantity) dealToBeChecked.quantity = 1;
        var dealPresent = _.filter(parlor.services, function(s) { return s.serviceCode == dealToBeChecked.services[0].serviceCode })[0];
        var isPresent = false,
            menuPrice = 0,
            dealPrice = 0,
            dealId = null,
            serviceId = "";
        if (dealToBeChecked.services[0].brandId && dealToBeChecked.services[0].brandId != "") {

            serviceId = dealPresent.serviceId
// console.log("dealToBeChecked" , dealToBeChecked)
            var brandDeal = _.filter(dealPresent.brands, function(ba) {
                // console.log("ba" , ba)

                return ba.dealId == dealToBeChecked.dealId && (ba.brandId).toString() == (dealToBeChecked.services[0].brandId).toString()

            })[0];


            if (brandDeal) {
                isPresent = true;
                menuPrice = parseInt(brandDeal.menuPrice);
                dealPrice = parseInt(brandDeal.price);
                dealId = brandDeal.dealParlorId;
                if (dealToBeChecked.services[0].productId && dealToBeChecked.services[0].productId != "") {
                    var productDeal = _.filter(brandDeal.products, function(po) { return po.dealId == dealToBeChecked.dealId && po.productId == dealToBeChecked.services[0].productId })[0];
                    if (productDeal) {
                        isPresent = true;
                        menuPrice = parseInt(productDeal.menuPrice);
                        dealPrice = parseInt(productDeal.price);
                        dealId = productDeal.dealParlorId;
                    }
                }
            }
        } else if (dealPresent.dealId) {
            isPresent = true;
            serviceId = dealPresent.serviceId
            menuPrice = parseInt(dealPresent.menuPrice);
            dealPrice = parseInt(dealPresent.price);
            dealId = dealPresent.dealParlorId;
        }

        if (isPresent && menuPrice > 0 && dealPrice > 0) {
            parlor.deals.push({
                parlorDealId: dealId,
                dealId: selectedDealType.dealId,
                menuPrice: dealToBeChecked.quantity * parseInt(menuPrice * (parlor.tax / 100 + 1)),
                dealPrice: dealToBeChecked.quantity * parseInt(dealPrice * (parlor.tax / 100 + 1)),
                serviceId: serviceId,
                quantity: dealToBeChecked.quantity,
            });
        }
    }
}

function populateDealPrice(parlorId, services, deals) {
    var reqDeals = _.filter(deals, function(d) { return d.dealType != "combo" && d.dealType != "newCombo" });
    _.forEach(services, function(s) {
        _.forEach(s.brands, function(b) {
            b.price = parseInt(s.price * b.ratio);
            _.forEach(b.products, function(product) {
                product.price = parseInt(product.ratio * s.price);
            });
        });
        _.forEach(reqDeals, function(deal) {
            if (deal.serviceCode == s.serviceCode) {
                var parlorDeal = _.filter(deal.parlors, function(p) { return p.parlorId + "" == parlorId + "" })[0];
                if (parlorDeal) {
                    if (parlorDeal.brands.length > 0) {
                        _.forEach(s.brands, function(parlorServiceBrand) {
                            var dealByBrand = _.filter(parlorDeal.brands, function(dealB) { return dealB.brandId + "" == parlorServiceBrand.brandId + "" })[0];
                            if (dealByBrand) {
                                // console.log("dealByBrand" , dealByBrand)
                                parlorServiceBrand.price = parseInt(dealByBrand.ratio * parlorDeal.dealPrice);
                                parlorServiceBrand.menuPrice = parseInt(dealByBrand.ratio * parlorDeal.menuPrice);
                                parlorServiceBrand.dealParlorId = parlorDeal.dealId;
                                parlorServiceBrand.dealId = deal.dealId;
                                _.forEach(parlorServiceBrand.products, function(parlorServiceProduct) {
                                    var dealByProduct = _.filter(dealByBrand.products, function(dealP) { return dealP.productId + "" == parlorServiceProduct.productId + "" })[0];
                                    if (dealByProduct) {
                                        parlorServiceProduct.price = parseInt(dealByProduct.ratio * parlorDeal.dealPrice);
                                        parlorServiceProduct.menuPrice = parseInt(dealByProduct.ratio * parlorDeal.menuPrice);
                                        parlorServiceProduct.dealParlorId = parlorDeal.dealId;
                                        parlorServiceProduct.dealId = deal.dealId;
                                    }
                                })
                            }
                        });
                    } else {
                        s.price = parseInt(parlorDeal.dealPrice);
                        s.menuPrice = parseInt(parlorDeal.menuPrice);
                        s.dealId = deal.dealId;
                        s.dealParlorId = parlorDeal.dealId;

                    }
                }
            }
        });
    });
};

/*function calculatePrice(r,callback){
    var dPrice=0;
    r.deals.forEach(function(deal){
        var dealData={name : deal.dealName,menuPrice : deal.menuPrice,quantity : deal.quantity,weekDay : deal.weekDay,detail : deal.detail}
        if(deal.dealName=="dealPrice" || deal.dealName=="chooseOne"){
            if(deal.brands.length==0)
                dPrice = dPrice + (deal.dealPrice)*deal.quantity;
            else if(deal.brands.length>0 && deal.brands[0].product.length == 0)
                dPrice = dPrice + (deal.dealPrice)*deal.quantity*deal.brands[0].brand.ratio;
            else if(deal.brands.length>0 && deal.brands[0].product.length >0)
                dPrice = dPrice + (deal.dealPrice)*deal.quantity*deal.brands[0].product.ratio;

            return callback({dPrice : dPrice, dealId : deal.id, dealParlorId:deal.parlorId , menuPrice : deal.menuPrice})

        }else if(deal.dealName=="chooseOnePer"){

            if(deal.brands.length==0)
                dPrice = dPrice + (1-(deal.dealPrice)/100)*deal.services[0].price*deal.quantity;
            else if(deal.brands.length>0 && deal.brands[0].product.length == 0)
                dPrice = dPrice + (1-(deal.dealPrice)/100)*deal.services[0].price*deal.quantity*deal.brands[0].brand.ratio;
            else if(deal.brands.length>0 && deal.brands[0].product.length >0)
                dPrice = dPrice + (1-(deal.dealPrice)/100)*deal.services[0].price*deal.quantity*deal.brands[0].product.ratio;

            return callback({dPrice : dPrice, dealId : deal.id, dealParlorId:deal.parlorId , menuPrice : deal.menuPrice})
        }
        else if(deal.dealName=="combo" || deal.dealName=="newCombo") {
            var dP=0;
            _.forEach(deal.services,function(dealSr){
                if(dealSr){
                    var price = deal.dealPrice;
                    if(dealSr.brand.ratio && !dealSr.product.ratio)
                        dP=dP + price*dealSr.brand.ratio;
                    else if(dealSr.brand.ratio && dealSr.product.ratio)
                        dP=dP + price*dealSr.product.ratio;
                }
            })
            if(deal.slabId){
                Slab.findOne({_id:deal.slabId} , function(err,slab){
                    _.forEach(slab.ranges,function(ran){
                        if(dP>ran.range1 && dP<=ran.range2){
                            dP = dP*(1-(ran.discount)/100)
                        }
                    })
                    dPrice = dPrice + dP;
                    return callback({dPrice : dPrice, dealId : deal.id, dealParlorId:deal.parlorId ,menuPrice : deal.menuPrice})
                })
            }
        }else return callback({dPrice : o , dealId : "", dealParlorId : "" , menuPrice : ""})

    })

}*/


router.post('/checkServicesInParlor', function(req, res) {
    var parlorIds = req.body.parlorIds,
        d = [];
    Async.each(parlorIds, function(parlorId, callback) {
        Parlor.aggregate([{
                $unwind: "$services"
            },
            {
                $match: { _id: parlorId }
            },

        ])
    }, function allTaskCompleted() {

    });
})


router.get('/serverTime', function(req, res, next) {
    return res.json(CreateObjService.response(false, new Date()));
});

router.get('/time', function(req, res, next) {
    return res.json(CreateObjService.response(false, new Date().toString()));
});

router.post('/serverTime2', function(req, res, next) {
    return res.json(CreateObjService.response(false, new Date()));
});


router.get('/alldeals', function(req, res) {

    var r = 12345;
    Service.find({}, function(err, services) {
        AllDeals.find({ showOnApp: true }).sort({ sort: 1, dealSort: 1 }).exec(function(err, data) {
            if (err) {
                console.log(err);
                return res.json(CreateObjService.response(true, 'Error in getting deals'));
            } else {
                var ion = -1;
                var data = _.map(data, function(d) { return Deals.parseForApp(d); });
                var d = _.chain(data)
                    .groupBy('category')
                    .map(function(val, key) {
                        return {
                            categoryId: ++r,
                            type: (++ion % 5),
                            name: key,
                            services: _.map(val, function(v) {
                                var obj = v;
                                obj.type = (ion % 5);
                                return obj;
                            }),
                        };
                    })
                    .value();
                _.forEach(d, function(del) {
                    _.forEach(del.services, function(s) {
                        s.services = ParlorService.getServiceDetail2(s.services, services);
                        s.gender = ParlorService.getDealGender(s.services);
                    });
                });
                return res.json(CreateObjService.response(false, d));
            }
        });
    });
});

router.get('/deals', function(req, res) {
    var r = 12345;
    var query = {};
    if (req.query.parlorLink) query.link = req.query.parlorLink;
    else query._id = req.query.parlorId;
    Parlor.findOne(query, function(err, parlor) {
        Deals.find({ parlorId: parlor.id, active: 1, showOnApp: true }).sort({ sort: 1, dealSort: 1 }).exec(function(err, data) {
            if (err) {
                console.log(err);
                return res.json(CreateObjService.response(true, 'Error in getting deals'));
            } else {
                var data = _.map(data, function(d) { return Deals.parseForApp(d); });
                var d = _.chain(data)
                    .groupBy('category')
                    .map(function(val, key) {
                        return {
                            categoryId: ++r,
                            name: key,
                            services: val
                        };
                    })
                    .value();
                _.forEach(d, function(del) {
                    _.forEach(del.services, function(s) {
                        s.services = ParlorService.getServiceDetail2(s.services, parlor.services);
                        s.gender = ParlorService.getDealGender(s.services);
                    });
                });
                return res.json(CreateObjService.response(false, d));
            }
        });
    });
});


router.get('/parlorDeals', function(req, res) {
    var r = 12345;
    var query = {};
    if (req.query.parlorLink) query.link = req.query.parlorLink;
    else query._id = req.query.parlorId;
    Parlor.findOne(query, function(err, parlor) {
        Deals.find({ parlorId: parlor.id, active: 1 }).sort({ sort: 1, dealSort: 1 }).exec(function(err, data) {
            if (err) {
                console.log(err);
                return res.json(CreateObjService.response(true, 'Error in getting deals'));
            } else {
                var data = _.map(data, function(d) { return Deals.parseForParlor(d); });
                var d = _.chain(data)
                    .groupBy('category')
                    .map(function(val, key) {
                        return {
                            categoryId: ++r,
                            name: key,
                            services: val
                        };
                    })
                    .value();
                _.forEach(d, function(del) {
                    _.forEach(del.services, function(s) {
                        s.services = ParlorService.getServiceDetail2(s.services, parlor.services);
                        s.gender = ParlorService.getDealGender(s.services);
                    });
                });
                return res.json(CreateObjService.response(false, d));
            }
        });
    });
});


function getServiceDetail(ser, parlorServices) {
    return _.map(ser, function(s) {
        var parlorService = _.filter(parlorServices, function(ps) { return ps.serviceCode == s.serviceCode })[0];
        return {
            serviceCode: s.serviceCode,
            name: parlorService ? parlorService.name : s.name,
            gender: parlorService ? parlorService.gender : null,
        };
    });
}

router.get('/attendance', function(req, res, next) {
    Attendance.find({}, function(err, data) {
        if (!err) {
            return res.json(CreateObjService.response(false, Attendance.parseArray(data)));
        } else {
            return res.json(CreateObjService.response(true, 'db error'));
        }
    });
});

// router.post('/sendcode', function(request, response){
//     // console.log(response)
//     console.log(request.body.csrf_nonce)
//     console.log('code: ' + request.body.code);
//
//     var Guid = require('guid');
//     // var Tokens = require('csrf')
//     // var secret = tokens.secretSync()
//     // var token = tokens.create(secret)
//     var csrf_guid = Guid.raw();
//     var api_version = "{{v2.8}}";
//     var app_id = "{{332716867100293}}";
//     var app_secret = '{{cb129f0de55a44e17756bf30bd8b5415}}';
//     var me_endpoint_base_url = 'https://graph.accountkit.com/{{v1.0}}/me';
//     var token_exchange_base_url = 'https://graph.accountkit.com/{{v1.0}}/access_token';
//     // CSRF check
//     if (request.body.csrf_nonce === csrf_guid) {
//         console.log("SDsda");
//         var app_access_token = ['AA', app_id, app_secret].join('|');
//         var params = {
//             grant_type: 'authorization_code',
//             code: request.body.code,
//             access_token: app_access_token
//         };
//
//         // exchange tokens
//         var token_exchange_url = token_exchange_base_url + '?' + Querystring.stringify(params);
//         Request.get({url: token_exchange_url, json: true}, function(err, resp, respBody) {
//             var view = {
//                 user_access_token: respBody.access_token,
//                 expires_at: respBody.expires_at,
//                 user_id: respBody.id
//             };
//
//             // get account details at /me endpoint
//             var me_endpoint_url = me_endpoint_base_url + '?access_token=' + respBody.access_token;
//             Request.get({url: me_endpoint_url, json:true }, function(err, resp, respBody) {
//                 // send login_success.html
//                 if (respBody.phone) {
//                     view.phone_num = respBody.phone.number;
//                 } else if (respBody.email) {
//                     view.email_addr = respBody.email.address;
//                 }
//                 var html = Mustache.to_html(loadLoginSuccess(), view);
//                 response.send(html);
//             });
//         });
//     }
//     else {
//         // login failed
//         response.writeHead(200, {'Content-Type': 'text/html'});
//         response.end("Something went wrong. :( ");
//     }
// });


router.post('/attendance', function(req, res, next) {

    var createObj = Attendance.getNewObj(req);

    if (createObj != {}) {
        Attendance.create(createObj, function(err, data) {
            console.log(req.body.time);
            console.log(err);
            if (!err) {
                return res.json(CreateObjService.response(false, 'Attendance Recorded'));
            } else {
                return res.json(CreateObjService.response(true, 'Invalid data'));
            }
        });
    } else
        return res.json(CreateObjService.response(true, 'Invalid Time'));
});

router.get('/fingerPrint', function(req, res, next) {
    FingerPrint.find({}, function(err, data) {
        Admin.find({}, function(err, employees) {
            if (!err) {
                var o2x = require('object-to-xml');
                data = _.map(data, function(d) {
                    var name = _.filter(employees, function(e) { return e.id + "" == d.employeeId + "" })[0];
                    console.log(name);
                    return {
                        employeeId: d.employeeId + "",
                        centerId: d.centerId,
                        time: d.time,
                        printCode: d.printCode,
                        name: name ? name.firstName : 'name',
                    };
                });
                res.set('Content-Type', 'text/xml');
                res.send(o2x({
                    '?xml version="1.0" encoding="utf-8"?': null,
                    data: {
                        fingerPrints: data
                    }
                }));
            } else {
                return res.json(CreateObjService.response(true, 'db error'));
            }
        });
    });
});

router.post('/fingerPrint', function(req, res, next) {
    FingerPrint.findOne({ printCode: req.body.printCode }, function(err, d) {
        if (d) {
            return res.json(CreateObjService.response(true, 'Print Code already registered'));
        } else {
            FingerPrint.create(FingerPrint.getNewObj(req), function(err, data) {
                console.log(err);
                if (!err) {
                    return res.json(CreateObjService.response(false, 'Successfully registered'));
                } else {
                    return res.json(CreateObjService.response(true, 'Invalid data or already registered'));
                }
            });
        }
    });
});

router.get('/blog', function(req, res, next) {
    var blogs = [];
    blogs.push({
        imagePath: '/images/left_above_khnaij_w1_H3KMx.jpg',
        heading: 'All Time Best Indian Bridal Hair Style Ideas',
        link: 'http://www.beusalons.com/blog/all-time-best-indian-bridal-hair-style-ideas/',
        date: 'January 19, 2017'
    });
    blogs.push({
        imagePath: '/images/middle_u66bfo.jpg',
        heading: 'Reasons Why To Choose Keratin Hair Treatment',
        link: 'http://www.beusalons.com/blog/reasons-why-to-choose-keratin-hair-treatment/',
        date: 'January 19, 2017'
    });
    blogs.push({
        imagePath: '/images/left_below_rrl6nw.jpg',
        heading: 'Hair Secrets Of Bollywood Divas Revealed',
        link: 'http://www.beusalons.com/blog/hair-secrets-of-bollywood-divas-revealed/',
        date: 'January 19, 2017'
    });
    blogs.push({
        imagePath: '/images/right_c2hauu.jpg',
        heading: 'Hair Colour Ideas for This Summer',
        link: 'http://www.beusalons.com/blog/hair-colour-ideas-for-this-summer/',
        date: 'January 19, 2017'
    });
    return res.json(CreateObjService.response(false, blogs));
});

router.get('/updatehttps', function(req, res, next) {
    Parlor.find({}, { images: 1 }, function(err, p) {
        console.log(p.length);
        _.forEach(p, function(pa, key) {
            _.forEach(pa.images, function(img) {
                if (img.imageUrl != "") {
                    img.imageUrl = img.imageUrl.replace("httpss:", "https:");
                    img.appImageUrl = img.appImageUrl.replace("httpss:", "https:");
                }

            });
            Parlor.update({ _id: pa.id }, { images: pa.images }, function(er, d) {
                console.log("done " + key);
            });
        });
    });
});

router.get('/parlorReviews', function(req, res, next) {
    var page = req.query.page || 1;
    var sort = req.query.sort || 2; // 1- featured review,  2 - most Recent, 3 - highest rated, 
    var perPage = 15;
    var query = { parlorId: req.query.parlorId, review: { $ne: null }, 'review.rating': { $exists: true } };
    if(sort == 1){
        // query["review.isFeatured"] = true;
        query = { parlorId: req.query.parlorId, review: { $ne: null }, 'review.rating': { $exists: true } };
    }
    if(sort == 3){
        query["review.rating"] = {$eq : 5};
    }
    console.log(query)
    Appointment.find(query).sort({ $natural: -1 }).limit(perPage).skip(perPage * (page - 1)).exec(function(err, data) {
        if (data) {
            return res.json(CreateObjService.response(false, _.map(data, function(r) { return Parlor.review(r); })));
        } else {
            console.log(err)
            return res.json(CreateObjService.response(true, 'Parlor id invalid'));
        }
    });
});

router.get('/parlorImages', function(req, res, next) {
    Parlor.findOne({ _id: req.query.parlorId }, function(err, data) {
        var images = ['http://gendersexualityfeminist.duke.edu/uploads/media_items/blue-parlor-2.440.294.s.jpg', 'http://static.wynnlasvegas.com/~/media/WLV/Rooms%20and%20Suites/Wynn%20Tower%20Suites/Parlor%20Suite/4_152_wynn_parlor_suite_desk.jpg?h=540&la=en&w=1001&vs=1&d=20141205T181812', 'http://gendersexualityfeminist.duke.edu/uploads/media_items/blue-parlor-1.440.294.s.jpg', 'https://static.mgmresorts.com/content/dam/MGM/bellagio/hotel/executive-parlor-suite/architecture/bellagio-hotel-executive-parlor-suite-media-room.tif.image.960.540.high.jpg'];
        if (data) {
            return res.json(CreateObjService.response(true, 'Invalid Request'));
        } else {
            return res.json(CreateObjService.response(false, images));
        }
    });
});


router.get('/dealsNearYou', function(req, res, next) {
    var images = [{
        imagePath: '/images/deal1.jpg'
    }, {
        imagePath: '/images/deal3.jpg'
    }, {
        imagePath: '/images/deal2.jpg'
    }, {
        imagePath: '/images/deal4.jpg'
    }];

    return res.json(CreateObjService.response(false, images));
});

router.get('/trends', function(req, res, next) {
    var images = [];
    var b = {
        imagePath: 'http://res.cloudinary.com/dyqcevdpm/image/upload/c_scale,h_310,w_460/v1484302600/Aalenes%20Gurgaon.jpg'
    };
    images.push(b);
    images.push(b);
    images.push(b);
    images.push(b);
    return res.json(CreateObjService.response(false, images));

});


router.get('/homeSlider', function(req, res, next) { 
    var images = [
        // {
        //     imagePath: '/images/newBanner.png'
        // },
        // {
        //     imagePath: '/images/banner2.jpg'
        // },
        {
            imagePath: '/images/banner3.jpg'
        },
        {
            imagePath: '/images/banner4.jpg'
        },
        {
            imagePath: '/images/banner5.jpg'
        },
        {
            imagePath: '/images/banner6.jpg'
        },
        {
            imagePath: '/images/banner7.jpg'
        },
        {
            imagePath: '/images/banner8.jpg'
        },
        {
            imagePath: '/images/banner9.jpg'
        },
        {
            imagePath: '/images/banner10.png'
        },
        {
            imagePath: '/images/banner11.jpg'
        },
        {
            imagePath: '/images/banner12.png'
        },
        {
            imagePath: '/images/banner13.png'
        }
    ];


    return res.json(CreateObjService.response(false, images));
});

router.get('/homeSliderApp', function(req, res, next) {
    var images = [{
        imagePath: 'http://res.cloudinary.com/dyqcevdpm/image/upload/v1487163137/low_15_feb_header_resize_1080x5002_zdrxts.jpg'
    }, {
        imagePath: 'http://res.cloudinary.com/dyqcevdpm/image/upload/v1487163137/low_15_feb_header_resize_1080x500_efpiu3.jpg'
    }];
    return res.json(CreateObjService.response(false, images));
});



router.get('/customer', function(req, res, next) {
    CustomerPhone.create({ phoneNumber: req.query.phoneNumber }, function(err, s) {
        return res.json(CreateObjService.response(false, 'Successfully created'));
    });
});

router.get('/parlors', function(req, res, next) {
    var serviceCode = req.query.serviceCodes ? JSON.parse(req.query.serviceCodes) : [];
    getParlorListForWebsite(req, serviceCode, function(d) {
        console.log("website");
        return res.json(d);
    });
});

router.get('/updateBrands', function(req, res, next) {
    Parlor.find({}, { name: 1, brands: 1 }, function(er, parlors) {
        console.log(parlors.length);
        _.forEach(parlors, function(parlor, key) {
            var newBrands = parlor.brands ? parlor.brands.split(',') : [];
            var newBrands2 = [];
            _.forEach(newBrands, function(b) {
                var newGender = b.replace(/^[ ]+|[ ]+$/g, '');
                if (newGender.length > 0) {
                    newBrands2.push(newGender);
                }
            });
            Parlor.update({ _id: parlor.id }, { brandsArray: newBrands2 }, function(er, o) {
                console.log("done " + key);
            });
        });
    });
});

router.get('/newHomePage', function(req, res, next) {
    console.log(req.query.userId)
    if(req.query.page > 3)req.query.page = 100;
    Parlor.getNewHomePage(req, [], function(d) {
        return res.json(d);
    });
});

router.get('/newHomePagev2', function(req, res, next) {
    if(req.query.page > 3)req.query.page = 100;
    Parlor.getNewHomePage2(req, [], function(d) {
        return res.json(d);
    });
});


router.get('/getNonAppUsersDetails', function(req, res, next) {
    User.find({ $and: [{ firebaseId: null }, { firebaseIdIOS: null }] }, { phoneNumber: 1, _id: 0 }).exec(function(err, users) {
        // User.find({loyalityPoints:{$gt:0}} ,{loyalityPoints:1 ,_id:0}).exec(function(err,users){
        return res.json(CreateObjService.response(false, users));
    })
})

router.get('/parlorScore', function(req, res, next){
    Parlor.getParlorsListForApp([], req, function(parlors){
        res.json(parlors);
    });
})

router.get('/parlorsListForWebsite', function(req, res, next) {
    var serviceCode = req.query.serviceCodes ? JSON.parse(req.query.serviceCodes) : [202, 52, 368, 365, 293, 131];
    getParlorListForWebsite(req, serviceCode, function(d) {
        console.log("website");
        return res.json(d);
    });
});

function getParlorListForWebsite(req, serviceCode, callback) {
    var queryobj = {};
    User.findOne({ _id: req.query.userId }, { favourites: 1, recent: 1 }, function(err, user) {
        if (!user) user = {};

        if (req.query.couponCode) {
            console.log("req.query.couponCode", req.query.couponCode)
            FlashCoupon.findOne({ code: req.query.couponCode }, function(err, flashCoupons) {
                console.log("flashCoupons", flashCoupons);
                if (!err) {
                    var parlorIds = _.map(flashCoupons.parlors, function(fc) {
                        if (fc.maximumCount > fc.currentCount) {
                            return ObjectId(fc.parlorId);
                        }
                    });
                    var parlorsIdss = [];
                    parlorIds.forEach(function(p) {
                            parlorsIdss.push(ObjectId(p))
                        })
                        // Parlor.find({ _id: { $in: parlorIds } }, { name: 1, address2: 1, address: 1 }, function(err, parlors) {

                    //     return callback(CreateObjService.response(false, { parlors: parlors }));
                    // })
                    console.log(parlorIds)
                    var project = { dayClosed: 1, id: 1, name: 1, images: 1, gender: 1, address: 1, parlorType: 1, link: 1, address2: 1, closingTime: 1, openingTime: 1, rating: 1, budget: 1, latitude: 1, longitude: 1, distance: "$geo.distance" };

                    Parlor.aggregate([{
                        $geoNear: {
                            near: { type: "Point", coordinates: [parseFloat(req.query.longitude), parseFloat(req.query.latitude)] },
                            distanceField: "geo.distance",
                            spherical: true,
                            query: { _id: { $in: parlorsIdss } },
                            maxDistance: 100000,
                            distanceMultiplier: 0.001

                        }
                    }, { $project: project }], function(err, parl) {

                        console.log("---------------", parl)

                        var mapped_parlors = _.map(parl, function(parlor) {
                            return {
                                name: parlor.name,
                                parlorId: parlor._id,
                                images: parlor.images,
                                gender: HelperService.getGenderName(parlor.gender),
                                address1: parlor.address,
                                parlorType: parseInt(parlor.parlorType),
                                link: parlor.link,
                                address2: parlor.address2,
                                latitude: parlor.latitude,
                                longitude: parlor.longitude,
                                closingTime: parlor.closingTime,
                                openingTime: parlor.openingTime,
                                rating: parlor.rating ? parlor.rating : 0,
                                price: parlor.budget ? parlor.budget : 1,
                                distance: parseFloat(parlor.distance.toFixed(1))
                            }
                        })
                        return callback(CreateObjService.response(false, { parlors: mapped_parlors }));
                    });


                } else {
                    return res.json(CreateObjService.response('This Coupon Code does not exist'));
                }
            })
        } else {
            Parlor.getParlorsListForApp(serviceCode, req, function(parlors) {
                Deals.find({ showOnApp: true, 'services.serviceCode': { $in: serviceCode }, 'dealType.name': { $in: ['dealPrice', 'chooseOne', 'chooseOnePer'] }, active: 1, weekDay: { $in: HelperService.getDealActiveDayCode(null) }, startDate: { $lt: new Date() }, endDate: { $gt: new Date() } }, { name: 1, 'dealType.name': 1, 'dealType.price': 1, 'menuPrice': 1, "brands.ratio": 1, "brands.brandId": 1, 'services.serviceCode': 1, 'parlorId': 1 }).sort('sort').exec(function(err, deals) {
                    var data = _.map(parlors, function(parlor) {
                        if (!parlor.services) parlor.services = [];
                        if (parlor.gender && parlor.latitude && parlor.openingTime) {
                            var parlorservices = _.filter(deals, function(s) { return parlor.id + "" == s.parlorId + "" });
                            return {
                                name: parlor.name,
                                parlorId: parlor._id,
                                images: parlor.images,
                                gender: HelperService.getGenderName(parlor.gender),
                                address1: parlor.address,
                                parlorType: parseInt(parlor.parlorType),
                                link: parlor.link,
                                address2: parlor.address2,
                                latitude: parlor.latitude,
                                longitude: parlor.longitude,
                                closingTime: parlor.closingTime,
                                openingTime: parlor.openingTime,
                                rating: parlor.rating ? parlor.rating : 0,
                                price: parlor.budget ? parlor.budget : 1,
                                distance: parseFloat(parlor.distance.toFixed(1)),
                                favourite: _.filter(user.favourites, function(f) { return f.parlorId + "" == parlor.id; })[0] ? true : false,
                                recent: user.recent ? user.recent.parlorId + "" == parlor.id ? true : false : false,

                                parlorservices: _.filter(_.map(serviceCode, function(s) {
                                    return getDealPriceObj(s, parlorservices, parlor.services);
                                }), function(ser) { return !_.isEmpty(ser); })
                            };
                        }
                    });
                    if (req.query.favourite == 1) data = _.filter(data, function(d) { return d.favourite || d.recent; });
                    return callback(CreateObjService.response(false, { parlors: _.compact(data) }));
                });
            });
        }

    });
}

router.get("/parlorRatings", function(req, res) {
    var parlorId = req.query.parlorId;
    var data = {};

    var counts = [0, 0, 0, 0, 0, 0];

    var ratingTotal = 0;
    var revCount = 0;

    Appointment.aggregate({ $match: { "parlorId": ObjectId(parlorId), "review.rating": { $gt: 0 } } }, { $group: { "_id": "$review.rating", rating: { $first: "$review.rating" }, count: { $sum: 1 } } }, { $project: { rating: 1, count: 1, _id: 0 } }, function(err, reviews) {

        if (reviews) {

            async.each(reviews, function(rev, cb) {

                console.log(rev.count);

                counts[rev.rating] = rev.count;
                revCount += rev.count;
                ratingTotal += (rev.count * rev.rating);
                cb();
            });

            var avgRating = (ratingTotal / revCount).toFixed(1);
            data.total = revCount;
            counts.shift();
            data.counts = counts;
            data.avgRating = avgRating;

            return res.json({ success: true, data });

        } else {
            return res.json({ success: false, data: "No Data." });
        }

    });

});

router.get('/parlorsForDeals', function(req, res, next) {
    var queryobj = {};
    if (req.query.gender) queryobj.gender = req.query.gender;
    if (req.query.budget) queryobj.budget = req.query.budget;
    if (req.query.rating) queryobj.rating = req.query.rating;
    Parlor.find(queryobj, function(err, parlors) {
        var serviceCode = req.query.serviceCodes ? JSON.parse(req.query.serviceCodes) : [202, 52, 368, 365, 293, 131];
        Deals.find({ showOnApp: true, 'services.serviceCode': { $in: serviceCode }, 'dealType.name': { $in: ['dealPrice', 'chooseOne', 'chooseOnePer'] }, active: 1, weekDay: { $in: HelperService.getDealActiveDayCode(null) }, startDate: { $lt: new Date() }, endDate: { $gt: new Date() } }).sort('sort').exec(function(err, deals) {
            var data = _.map(parlors, function(parlor) {
                if (parlor.gender && parlor.latitude) {
                    var parlorservices = _.filter(deals, function(s) { return parlor.id == s.parlorId });
                    return {
                        menuPrice: 0,
                        dealPrice: 0,
                        parlorName: parlor.name,
                        parlorId: parlor.id,
                        parlorImage: parlor.images,
                        parlorAddress1: parlor.address,
                        parlorAddress2: parlor.address2,
                        closingTime: parlor.closingTime,
                        openingTime: parlor.openingTime,
                        parlorType: parseInt(parlor.parlorType),
                        link: parlor.link,
                        rating: parseInt(parlor.rating),
                        distance: HelperService.getDistanceBtwCordinates(req.query.latitude, req.query.longitude, parlor.latitude, parlor.longitude),
                        deals: _.filter(_.map(serviceCode, function(s) {
                            return getDealPriceObj(s, parlorservices, parlor.services);
                        }), function(ser) { return !_.isEmpty(ser); })
                    };
                }
            });
            data = _.filter(data, function(d) { return !_.isEmpty(d); });
            data = _.sortBy(data, 'distance');
            _.forEach(data, function(d) {
                _.forEach(d.deals, function(s) {
                    d.menuPrice += s.menuPrice ? s.menuPrice : 0;
                    d.dealPrice += s.price ? s.price : 0;
                });
            });

            return res.json(CreateObjService.response(false, data));
        });
    });
});


function getDealPriceObj(serviceCode, deals, services) {
    var d = _.filter(deals, function(deal) { return _.some(deal.services, function(ser) { return ser.serviceCode == serviceCode }); })[0];
    var service = _.filter(services, function(s) { return s.serviceCode == serviceCode })[0];
    if (service) {
        if (serviceCode == 502) {
            var ratio = _.filter(d.brands, function(brand) { return brand.brandId + "" == "594b99fcb2c790205b8b7d93" })[0];
            d.dealType.price = parseInt(d.dealType.price * (ratio ? ratio.ratio : 1));
        }
        if (d) {
            return {
                name: d.name,
                price: parseInt(d.dealType.name != 'chooseOnePer' ? d.dealType.price : parseInt(service.basePrice - (service.basePrice * d.dealType.price) / 100)),
                serviceCode: serviceCode,
                menuPrice: d.menuPrice,
                quantity: 1,
            };
        } else {
            return {
                name: service.name,
                serviceCode: serviceCode,
                price: parseInt(service.basePrice),
                menuPrice: service.basePrice,
                quantity: 1,
            }
        }
    } else return null;
}



router.get('/allParlor', function(req, res, next) {
    Parlor.find({ active: true }, { gender: 1, name: 1, _id: 1, parlorType: 1, link: 1, images: 1, address: 1, address2: 1 }, function(err, parlors) {
        // var data = _.filter(parlors, function(parlor){ return !_.isEmpty(parlor.latitude); });
        var data = _.map(parlors, function(parlor) {
            if (parlor.gender) {
                return {
                    name: parlor.name + "-" + parlor.address2,
                    parlorId: parlor.id,
                    parlorType: parseInt(parlor.parlorType),
                    link: parlor.link,
                    images: parlor.images,
                    address1: parlor.address,
                    address2: parlor.address2
                };
            }

        });
        data = _.filter(data, function(d) { return !_.isEmpty(d); });
        return res.json(CreateObjService.response(false, data));
    });
});

router.get('/allParlorsWithActiveInactive', function(req, res, next) {
    Parlor.find({ active: localVar.isServer() }, { gender: 1, name: 1, _id: 1, parlorType: 1, link: 1, images: 1, address: 1, address2: 1 }, function(err, parlors) {
        // var data = _.filter(parlors, function(parlor){ return !_.isEmpty(parlor.latitude); });
        var data = _.map(parlors, function(parlor) {
            if (parlor.gender) {
                return {
                    name: parlor.name + "-" + parlor.address2,
                    parlorId: parlor.id,
                    parlorType: parseInt(parlor.parlorType),
                    link: parlor.link,
                    images: parlor.images,
                    address1: parlor.address,
                    address2: parlor.address2
                };
            }
        });
        data = _.filter(data, function(d) { return !_.isEmpty(d); });
        return res.json(CreateObjService.response(false, data));
    });
});



router.get('/inactiveAllParlor', function(req, res, next) {
    Parlor.find({ active: false }, { gender: 1, name: 1, _id: 1, parlorType: 1, link: 1, images: 1, address: 1, address2: 1 }, function(err, parlors) {
        // var data = _.filter(parlors, function(parlor){ return !_.isEmpty(parlor.latitude); });
        var data = _.map(parlors, function(parlor) {
            if (parlor.gender) {
                return {
                    name: parlor.name + "-" + parlor.address2,
                    parlorId: parlor.id,
                    parlorType: parseInt(parlor.parlorType),
                    link: parlor.link,
                    images: parlor.images,
                    address1: parlor.address,
                    address2: parlor.address2
                };
            }

        });
        data = _.filter(data, function(d) { return !_.isEmpty(d); });
        return res.json(CreateObjService.response(false, data));
    });
});


router.get('/allParlorWebsite', function(req, res, next) {
    Parlor.find({ active: true }, { gender: 1, name: 1, _id: 1, parlorType: 1, link: 1, images: 1, address: 1, address2: 1 }, function(err, parlors) {
        // var data = _.filter(parlors, function(parlor){ return !_.isEmpty(parlor.latitude); });
        var data = _.map(parlors, function(parlor) {
            if (parlor.gender) {
                return {
                    name: parlor.name,
                    parlorId: parlor.id,
                    parlorType: parseInt(parlor.parlorType),
                    link: parlor.link,
                    images: parlor.images,
                    address1: parlor.address,
                    address2: parlor.address2
                };
            }

        });
        data = _.filter(data, function(d) { return !_.isEmpty(d); });
        return res.json(CreateObjService.response(false, data));
    });
});


router.get('/home', function(req, res, next) {
    Parlor.find({}, function(err, parlors) {
        // var data = _.filter(parlors, function(parlor){ return !_.isEmpty(parlor.latitude); });
        var data = _.map(parlors, function(parlor) {
            if (parlor.gender) {
                return {
                    name: parlor.name,
                    parlorId: parlor.id,
                    parlorType: parseInt(parlor.parlorType),
                    link: parlor.link,
                };
            }
        });
        data = _.filter(data, function(d) { return !_.isEmpty(d); });
        return res.json(CreateObjService.response(false, { parlors: data, images: ["https://s-media-cache-ak0.pinimg.com/originals/52/8a/9f/528a9f89a62ceba33c2694dd422722be.jpg", "http://www.historicnewengland.org/historic-properties/homes/roseland-cottage/photographic-tour/South%20parlor/image_preview", "http://gendersexualityfeminist.duke.edu/uploads/media_items/blue-parlor-2.440.294.s.jpg"] }));
    });
});


router.get('/offerNotification', function(req, res, next) {
    User.findOne({ phoneNumber: req.query.phoneNumber }, function(Errm, user) {
        Appointment.sendAppNotification(user.firebaseId, 'New Offer title', 'Offer description', { type: 'offer', smallImage: 'https://s3.amazonaws.com/gp.cdn.images/assets/deals/flipkart-electronics-offer-deals-1480393382.jpg', largeImage: 'https://s3.amazonaws.com/gp.cdn.images/assets/deals/snapdeal-axis-bank-discount-offer-1479877881.jpg' }, function(err, response) {
            console.log(err);
            return res.json(response)
                //empty
        });
    });
});

router.get('/homePage', function(req, res, next) {
    Parlor.find({ active: true }, { _id: 1, name: 1, address: 1, address2: 1, parlorType: 1, images: 1, rating: 1, latitude: 1, longitude: 1 }, function(err, parlors) {
        console.log("parlors");
        var parlors = _.map(parlors, function(p) {
            return {
                name: p.name,
                parlorId: p.id,
                address1: p.address,
                parlorType: p.parlorType,
                address2: p.address2,
                image: p.images[0] ? p.images[0].imageUrl : '',
                rating: parseInt(p.rating),
                distance: HelperService.getDistanceBtwCordinates(req.body.latitude, req.body.longitude, p.latitude, p.longitude),
            };
        });
        var deals = ConstantService.getDeals();
        var packages = [];
        ParlorService.getPackages(function(pack) {
            packages = pack;
            var obj = {
                deals: deals,
                packages: packages,
                popularSalons: _.slice(_.sortBy(parlors, 'rating'), 0, 6),
                nearBySalons: _.filter(_.sortBy(parlors, 'distance'), function(p) { return p.distance < 50; }),
                freebies: ConstantService.getFreeBies(),
            };
            return res.json(CreateObjService.response(false, obj));
        });
    });
});

router.get('/search', function(req, res, next) {
    var request = require("request");
    var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + req.query.lat + "," + req.query.lng + "&key=AIzaSyDvS7vSQ3GyiwLAOaXooTUWJKwBoxrMK6A",
        response;
    request({
        url: url,
        json: true
    }, function(error, response, body) {
        console.log(error);
        if (!error && response.statusCode === 200) {
            return res.json(CreateObjService.response(false, response.body.results));
        }
    })
});


router.get('/autocomplete', function(req, res, next) {
    var request = require("request");
    var url = "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" + req.query.input + "&location=28.636129,77.212702&radius=300000&regions=locality&key=AIzaSyDvS7vSQ3GyiwLAOaXooTUWJKwBoxrMK6A",
        response;
    request({
        url: url,
        json: true
    }, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var data = _.map(response.body.predictions, function(p){
                return{
                    placeId : p.place_id,
                    name : p.terms[0].value + ", " +(p.terms.length>1 ? p.terms[1].value : ""),
                }
            });
            return res.json(CreateObjService.response(false, data));
        }
    })
});


router.get('/placeDetail', function(req, res, next) {
    var request = require("request");
    var url = "https://maps.googleapis.com/maps/api/place/details/json?placeid=" + req.query.placeId + "&key=AIzaSyDvS7vSQ3GyiwLAOaXooTUWJKwBoxrMK6A",
        response;
    request({
        url: url,
        json: true
    }, function(error, response, body) {
        console.log(error);
        console.log(response.body);
        if (!error && response.statusCode === 200) {
            return res.json(CreateObjService.response(false, response.body));
        }
    })
});

router.get('/services', function(req, res, next) {
    Service.find({}, function(err, services) {
        getParlorServiceAll(services, false, [], function(reqServices) {
            return res.json(CreateObjService.response(false, { services: reqServices }));
        });
    });
});

router.get('/allServices', function(req, res, next) {
    SuperCategory.find({}, {name : 1}, function(err, supers){
        ServiceCategory.find({}, {superCategory : 1}, function(err, serviceCategories){
            Service.find({}, {nameOnApp :1, gender : 1, name : 1, serviceCode : 1, categoryId : 1, "prices.brand.brands" : 1, "prices.brand.brands" : 1}, function(err, services) {
                    var newServices = _.map(services, function(service){
                        var category = _.filter(serviceCategories, function(sc){ return sc._id + "" == service.categoryId + ""})[0];
                        if(!category)category = {};
                        var superCategory = _.filter(supers, function(su){ return su.name == category.superCategory})[0];
                        return{
                            name : service.name,
                            serviceId : service.id,
                            serviceCode : service.serviceCode,
                            categoryId : service.categoryId,
                            prices : service.prices,
                            gender : service.gender,
                            nameOnApp : service.nameOnApp,
                            departmentId : superCategory ? superCategory.id : "",
                            departmentName : superCategory ? superCategory.name : "",
                        }

                    });
                    return res.json(CreateObjService.response(false, { services: newServices }));
                });
        });
    });
});



router.get('/parlorHomeDepartmentv21', function(req, res, next) {
    var text = "",
        parlor, playlistCount = 0,
        recentRatings = [],
        reqServices, noOfAppointments = 0,
        noOfReviews = 0,
        parlorId = req.query.parlorId,
        user, flashSale = false, count = 0;
    Parlor.findOne({link : req.query.parlorLink}, {name : 1}, function(er, p){
        if(p){
            parlorId = p.id;
        }

    Async.parallel([
            function(callback) {
                User.findFBFriends(parlorId, req.query.userId, function(text1) {
                    text = text1;
                    callback(null);
                });
            },
            function(callback) {
                User.findOne({ _id: req.query.userId }, { favourites: 1, gender: 1, subscriptionId : 1 }, function(err, user1) {
                    if (!user1) {
                        user = {};
                    } else {

                        user = user1;

                    }
                    callback(null);
                });
            },
            function(callback) {
                Parlor.findOne({ _id: parlorId }, {earlyBirdOfferType : 1, earlyBirdOfferPresent: 1, appRevenuePercentage: 1, revenueDiscountAvailable: 1, tax: 1, brands: 1, wifiName: 1, wifiPassword: 1, dayClosed: 1, id: 1, name: 1, images: 1, gender: 1, address: 1, address2: 1, landmark: 1, rating: 1, phoneNumber: 1, latitude: 1, longitude: 1, closingTime: 1, ambienceRating : 1, parlorType: 1, link: 1, openingTime: 1, revenueDiscountSlabDown: 1 }).exec(function(err, parlor1) {
                    parlor = parlor1;
                    callback(null);
                });
            },
            function(callback) {

                var query = { parlors: { $elemMatch: { parlorId: parlorId, currentCount: { $gt: 0 } } } };
                if (localVar.isServer()) query.active = true;
                else query.active = false;

                FlashCoupon.findOne(query, function(err, flashCoupons2) {
                    if (flashCoupons2) {
                        flashSale = true;
                    }
                    callback(null);
                });
            },
            function(callback) {
                Playlist.count({ parlorId: parlorId }, function(err, count1) {
                    playlistCount = count1;
                    callback(null);
                });
            },

            function(callback) {
                Appointment.find({ parlorId: parlorId, review: { $ne: null }, 'review.rating': { $exists: true } }, { 'review.rating': 1 }).sort({ $natural: -1 }).limit(10).exec(function(err, ratings) {
                    recentRatings = _.map(ratings, function(e) { return e.review.rating });
                    callback(null);
                });
            },
            function(callback) {
                Appointment.find({ status: 3, parlorId: parlorId }).count().exec(function(err, noOfAppointments1) {
                    noOfAppointments = noOfAppointments1;
                    callback(null);
                });
            },
            function(callback) {
                Appointment.find({ status: 3, parlorId: parlorId, "review.rating": { $ne: null } }).count().exec(function(err, noOfReviews1) {
                    noOfReviews = noOfReviews1;
                    callback(null);
                });
            },
            function(callback) {
                Parlor.parlorDepartments(true, parlorId, function(reqServices1) {
                    reqServices = reqServices1;
                    callback(null);
                });
            },
            function(callback){
            SubscriptionSale.find({}).count().exec(function(err, count1) {
                count = count1;
                callback(null);
            });
            }
        ],
        function(err, results) {
            var parlorType = parseInt(parlor.parlorType);
            var parlorDepBrand = ParlorService.getDepartmentString(parlor.gender, reqServices);
            if (!parlor.images) parlor.images = [{ appImageUrl: "http://www.parlorwayzata.com/images/salon-wide.jpg" }];

            var earlyBirdOfferText = '<div><b>Subscribe For ₹1699 & Enjoy Services Worth ₹'+(parlorType == 4 ? '500' : '500')+'/Month, For 1 Year.</b>';
            if(parlor.earlyBirdOfferPresent)earlyBirdOfferText = '<div><b>Early Bird Offer: Spend Above ₹ 1000 </b><span>At This Outlet &amp; Get</span><b> SalonPass@₹'+ConstantService.getEarlyBirdOfferGlodSubscriptionPrice(parlor.earlyBirdOfferType)+'<strike> (₹1699)</strike></b></div>';
            if(user.subscriptionId){
                earlyBirdOfferText = parlorType == 4 ? '<div>Redeem services Worth ₹300/Month at Affiliates<br> <b>Or</b> ₹500/Month at Be U Outlets</div>' : '<div>Redeem services Worth ₹500/Month at any Be U Outlets</div>';
            }
            var data = {
                name: parlor.name,
                parlorId: parlor.id,
                rating: parlor.rating ? parseFloat(parlor.rating + 0.0) : 3.0,
                images: parlor.images,
                flashSale: flashSale,
                flashExpiryDate: "5 May",
                imagesCount: parlor.images.length,
                gender: HelperService.getGenderName(parlor.gender),
                address1: parlor.address,
                address2: parlor.address2,
                ambienceRating : parlor.ambienceRating,
                landmark: parlor.landmark,
                price: 2,
                phoneNumber: parlor.phoneNumber,
                subscriptions: ConstantService.getHomePageSubscriptions(parlor.earlyBirdOfferType, "F", count, parlor.parlorType),
                appRevenueDiscountPercentage: !user.subscriptionId ? Parlor.getAppRevenueDiscountPercentange(parlor.appRevenuePercentage, parlor.revenueDiscountAvailable, parlor.revenueDiscountSlabDown) : 0,
                appRevenueDiscountCouponCode: ConstantService.getAppRevenueDiscountCouponCode(),
                realPhoneNumber: parlor.phoneNumber,
                latitude: parlor.latitude,
                recentRatings: recentRatings,
                longitude: parlor.longitude,
                closingTime: parlor.closingTime,
                freeWifi: parlor.wifiName != "" ? true : false,
                noOfAppointments: noOfAppointments,
                noOfReviews: noOfReviews,
                dayClosed: parlor.dayClosed,
                wifiName: parlor.wifiName,
                earlyBirdOfferText : earlyBirdOfferText,
                wifiPassword: parlor.wifiPassword,
                parlorType: parlorType,
                favourite: _.filter(user ? user.favourites : [], function(f) { return f.parlorId == parlor.id; })[0] ? true : false,
                openingTime: parlor.openingTime,
                tax: (parlor.tax / 100) + 1,
                music: playlistCount > 0 ? true : false,
                departmentsString: parlorDepBrand.departments,
                brandsString: parlor.brands,
                userFbFriendString: text,
                currentTime: new Date(),

            };
            data.earlyBirdOfferPresent = parlor.earlyBirdOfferPresent;
            data.earlyBirdOfferGlodSubscriptionPrice = ConstantService.getEarlyBirdOfferGlodSubscriptionPrice(parlor.earlyBirdOfferType);
            data.realGlodSubscriptionPrice = ConstantService.getRealGlodSubscriptionPrice();
            data.earlyBirdOfferMinimumServiceAmount = ConstantService.getEarlyBirdOfferMinimumServiceAmount(parlor.parlorType);
            return res.json(CreateObjService.response(false, data));
        });
    });
});

router.get('/changeCouponCodeType', function(req, res, next) {
    var obj = {parlorType : req.query.parlorType};
    if(req.query.dealId)obj.dealId = req.query.dealId;
    Offer.update({code : req.query.code}, obj, function(err, offer){
        Offer.findOne({code : req.query.code},{dealId : 1, parlorType : 1, code : 1, name : 1, discountAmount : 1}, function(err, o){
            res.json(o);
        });
    });
});

router.get('/parlorHomeDepartmentv22', function(req, res, next) {
    var parlor, recentRatings = [],
        reqServices, noOfAppointments = 0,
        noOfReviews = 0,
        user, m, flashCouponsServiceCode = [];
    Async.parallel([
            function(callback) {
                User.findOne({ _id: req.query.userId }, { gender: 1, servicesAvailable: 1, freeMembershipServiceAvailed: 1 }, function(err, user1) {
                    if (!user1) {
                        user = {};
                        user.servicesAvailable = [];
                    } else {
                        user = user1;
                    }
                    callback(null);
                });
            },
            function(callback) {
                Parlor.findOne({ _id: req.query.parlorId }, { tax: 1 }).exec(function(err, parlor1) {
                    parlor = parlor1;
                    callback(null);
                });
            },
            function(callback) {
                var query = {currentCount : {$gt : 0}, parlors: { $elemMatch: { parlorId: req.query.parlorId, currentCount: { $gt: 0 } } } };
                if (localVar.isServer()) query.active = true;
                else query.active = false;
                FlashCoupon.find(query, function(err, flashCoupons2) {
                    _.forEach(flashCoupons2, function(f) {
                        _.forEach(f.serviceCodes, function(s) {
                            flashCouponsServiceCode.push({ gender: f.gender, categoryId: s.categoryId });
                        });
                    });
                    callback(null);
                });
            },
            function(callback) {
                Parlor.parlorServicesDepartmentWise(true, req.query.parlorId, function(reqServices1) {
                    reqServices = reqServices1;
                    callback(null);
                });
            },
            function(callback) {
                ActiveMembership.findOne({ "members.userId": req.query.userId, active: true, expiryDate: { $gt: new Date() } }, function(err, m1) {
                    m = m1;
                    callback(null);
                });
            }
        ],
        function(err, results) {
            SubscriptionSale.find({}).count().exec(function(err, count) {
                var data = {
                    parlorId: parlor.id,
                    // memberships: ConstantService.getMembershipDetails(false),
                    subscriptions: ConstantService.getHomePageSubscriptions(0, "F", count, parlor.parlorType),
                    welcomeOffer: ConstantService.welcomeOffer(),
                    tax: (parlor.tax / 100) + 1,
                };
                data.subscriptions.isSubscribed = (user.subscriptionId) ? true : false;
                var membershipServices = [];
                if (m) {
                    membershipServices = ActiveMembership.parseForUser(m, user.gender, user.freeMembershipServiceAvailed).freeServices;
                }
                var servicesAvailable = getUserServiceAvailable(user, req.query.parlorId);
                _.forEach(membershipServices, function(s) {
                    s.type = 'membership';
                    s.quantity = s.quantityRemaining;
                    servicesAvailable[0].services.push(s);

                });
                Parlor.parlorServicesDepartmentWise(true, req.query.parlorId, function(reqServices) {
                    data.departments = reqServices;
                    _.forEach(data.departments, function(d) {
                        _.forEach(d.departments, function(de) {
                            var flashSale = false;
                            _.forEach(de.categories, function(dc) {
                                var flashSale2 = false;
                                _.forEach(flashCouponsServiceCode, function(ds) {
                                    if (dc.categoryId + "" == ds.categoryId + "" && ds.gender == d.gender) {
                                        flashSale2 = true;
                                        flashSale = true;
                                    }
                                });
                                dc.flashSale = flashSale2;
                            });
                            de.flashSale = flashSale;
                        })
                    });
                    data.flashCouponsServiceCode = flashCouponsServiceCode;
                    data.servicesAvailable = servicesAvailable;
                    return res.json(CreateObjService.response(false, data));
                });
            });
        })
});


router.get('/parlorHomeDepartment', function(req, res, next) {
    User.findOne({ _id: req.query.userId }, { favourites: 1, recent: 1, servicesAvailable: 1, freeMembershipServiceAvailed: 1, gender: 1 }, function(err, user) {
        if (!user) {
            user = {};
            user.servicesAvailable = [];
        }
        User.findFBFriends(req.query.parlorId, user.id, function(text) {
            Parlor.findOne({ _id: req.query.parlorId }, { tax: 1, brands: 1, wifiName: 1, wifiPassword: 1, dayClosed: 1, id: 1, name: 1, images: 1, gender: 1, address: 1, address2: 1, landmark: 1, rating: 1, phoneNumber: 1, latitude: 1, longitude: 1, closingTime: 1, parlorType: 1, link: 1, openingTime: 1 }).exec(function(err, parlor) {
                Playlist.find({ parlorId: req.query.parlorId }, function(err, playList) {
                    Appointment.find({ parlorId: req.query.parlorId, review: { $ne: null }, 'review.rating': { $exists: true } }, { 'review.rating': 1 }).sort({ $natural: -1 }).limit(10).exec(function(err, ratings) {
                        Appointment.find({ status: 3, parlorId: req.query.parlorId }).count().exec(function(err, noOfAppointments) {
                            Appointment.find({ status: 3, parlorId: req.query.parlorId, "review.rating": { $ne: null } }).count().exec(function(err, noOfReviews) {
                                SubscriptionSale.find({}).count().exec(function(err, count) {
                                    var recentRatings = _.map(ratings, function(e) { return e.review.rating });
                                    var data = {
                                        name: parlor.name,
                                        parlorId: parlor.id,
                                        rating: parlor.rating ? parseFloat(parlor.rating + 0.0) : 3.0,
                                        images: parlor.images ? parlor.images : ["http://www.parlorwayzata.com/images/salon-wide.jpg"],
                                        gender: HelperService.getGenderName(parlor.gender),
                                        address1: parlor.address,
                                        address2: parlor.address2,
                                        landmark: parlor.landmark,
                                        price: 2,
                                        phoneNumber: '8690291910',
                                        latitude: parlor.latitude,
                                        recentRatings: recentRatings,
                                        longitude: parlor.longitude,
                                        closingTime: parlor.closingTime,
                                        freeWifi: parlor.wifiName != "" ? true : false,
                                        departmentsString: "",
                                        brandsString: "",
                                        noOfAppointments: noOfAppointments,
                                        noOfReviews: noOfReviews,
                                        dayClosed: parlor.dayClosed,
                                        wifiName: parlor.wifiName,
                                        wifiPassword: parlor.wifiPassword,
                                        parlorType: parseInt(parlor.parlorType),
                                        link: parlor.link,
                                        favourite: _.filter(user ? user.favourites : [], function(f) { return f.parlorId == parlor.id; })[0] ? true : false,
                                        recent: user.recent ? user.recent.parlorId == parlor.id ? true : false : false,
                                        openingTime: parlor.openingTime,
                                        info: ConstantService.getInfoDetails(parlor.parlorType),
                                        memberships: ConstantService.getMembershipDetails(false),
                                        subscriptions: ConstantService.getHomePageSubscriptions(0, "F", count, parlor.parlorType),
                                        welcomeOffer: ConstantService.welcomeOffer(),
                                        tax: (parlor.tax / 100) + 1,
                                        music: (playList.length > 0) ? true : false,
                                    };

                                    ActiveMembership.findOne({ "members.userId": req.query.userId, active: true, expiryDate: { $gt: new Date() } }, function(err, m) {
                                        var membershipServices = [];
                                        if (m) {
                                            membershipServices = ActiveMembership.parseForUser(m, user.gender, user.freeMembershipServiceAvailed).freeServices;
                                        }
                                        var servicesAvailable = getUserServiceAvailable(user, req.query.parlorId);
                                        _.forEach(membershipServices, function(s) {
                                            s.type = 'membership';
                                            s.quantity = s.quantityRemaining;
                                            servicesAvailable[0].services.push(s);

                                        });
                                        Parlor.parlorServicesDepartmentWise(true, req.query.parlorId, function(reqServices) {
                                            data.departments = reqServices;
                                            var parlorDepBrand = ParlorService.getDepartmentString(parlor.gender, reqServices);
                                            data.departmentsString = parlorDepBrand.departments;
                                            data.brandsString = parlor.brands;
                                            data.userFbFriendString = text;
                                            data.currentTime = new Date();
                                            data.servicesAvailable = servicesAvailable;
                                            return res.json(CreateObjService.response(false, data));
                                        });
                                    });
                                });
                            });
                        });
                    });
                })
            });
        });
    });
});

function getUserServiceAvailable(user, parlorId) {
    var servicesAvailable = _.filter(user.servicesAvailable, function(sa) {
        return sa.parlorId + "" == parlorId;
    });
    if (servicesAvailable.length > 0) {
        servicesAvailable = _.map(servicesAvailable, function(s) {
            return ParlorService.parseUserServiceAvailable(s);
        });
    }
    if (servicesAvailable.length == 0) {
        servicesAvailable = [{
            services: [],
        }];
    }
    return servicesAvailable;
}

router.get('/memberships', function(req, res, next) {
    return res.json(CreateObjService.response(false, { memberships: ConstantService.getMembershipDetails(true), welcomeOffer: ConstantService.welcomeOffer() }));
});

router.get('/dealsDepartment', function(req, res, next) {
    User.findOne({ _id: req.query.userId }, { subscriptionId: 1 }, function(err, user) {
        AggregateService.serviceByDepartment(2, null, function(results) {
            _.forEach(results, function(r) {
                _.forEach(r.departments, function(d) {
                    d.categories.push(ConstantService.getPackagesObj());
                });
            });
            var data = _.map(results, function(r) {
                return {
                    gender: r.gender,
                    departments: r.departments
                };
            });
            FlashCoupon.getFlashCarousel(function(coupons) {
                if (user && user.subscriptionId) {
                    coupons = [];
                }
                return res.json(CreateObjService.response(false, { deals: data, coupons: coupons }));
            });
        });
    });
});


//315, 316, 317, 322 , 323 ,324, 325
router.get('/updateLatLong', function(req, res, next){
    let dealId = 324;
    AllDeals.findOne({dealId : dealId  }, function(err, alldeal){

        Async.each(alldeal.brands, function(b, callback2) {
            Parlor.find({"services.prices.brand.brands.brandId" : b.brandId, active : true}, {latitude : 1, longitude : 1, cityId : 1}, function(err, parlors){
                var parlorLatLongs = [{
                    cityId : 1,
                    latlongs : []
                },
                {
                    cityId : 2,
                    latlongs : []
                },
                {
                    cityId : 3,
                    latlongs : []
                }];
                _.forEach(parlors, function(p){
                    parlorLatLongs[p.cityId - 1].latlongs.push({latitude : p.latitude, longitude : p.longitude});
                });
                b.parlorLatLongs = parlorLatLongs;
                callback2();
                });
            }, function allTaskCompleted() {

                AllDeals.update({dealId : dealId  }, {brands : alldeal.brands}, function(rtt, f){

                    res.json(alldeal);
                })
            });
        });

});

router.get('/dealsDepartmentWise', function(req, res, next) {
    if (!req.query.package) req.query.package = 1;
    var cityId = ConstantService.getCityId(req.query.latitude, req.query.longitude);
    var packageRequired = parseInt(req.query.package);
    SuperCategory.findOne({ _id: req.query.departmentId }, function(err, superCategory) {
        ServiceCategory.find({ superCategory: superCategory.name }, function(err, serviceCategories) {
            var categoryIds = _.map(serviceCategories, function(s) { return ObjectId(s.id) });
            AggregateService.dealsByDepartment(req.query.gender, categoryIds, null, null, function(results) {
                _.forEach(results, function(re){
                    _.forEach(re.deals, function(deal){
                        var brandsToPresent = [];
                        _.forEach(deal.brands, function(brand){
                            if(brand.parlorLatLongs && brand.parlorLatLongs.length>0){
                                _.forEach(brand.parlorLatLongs, function(city){
                                    if(city.cityId == cityId){
                                        _.forEach(city.latlongs, function(l){
                                            if(HelperService.getDistanceBtwCordinates(l.latitude, l.longitude, req.query.latitude, req.query.longitude)<5){
                                                    if(!_.filter(brandsToPresent, function(b){ return b + "" == brand.brandId + ""})[0]){
                                                        brandsToPresent.push(brand.brandId);
                                                    }
                                                }
                                        });
                                    }
                                });
                            }
                        });
                        if(brandsToPresent.length>0){
                            _.forEach(deal.services, function(ser){
                                if(ser.brand.brands && ser.brand.brands.length>0){
                                    if(!_.filter(brandsToPresent, function(bb){ return bb + "" == ser.brand.brands[0].brandId + ""})[0]){
                                        ser.removeThisService = true;
                                    }
                                }
                            })
                            deal.services = _.filter(deal.services, function(ser){ return !ser.removeThisService});
                        }
                    });
                    re.deals = _.filter(re.deals, function(de){ return de.services.length > 0});
                });
                // res.json(results)
                if (!packageRequired) results = _.filter(results, function(r) { return r.name != "Packages" });
                results = ParlorService.parseDealsHomePage(results, false, cityId);
                _.forEach(results, function(r) {
                    _.forEach(r.deals, function(d) {
                        if (d.parlorTypes) {
                            d.parlorTypes = _.filter(d.parlorTypes, function(pt) { return pt.save != 0 });
                        }
                        var l = getLowestPrice(d.parlorTypes);
                        if (l) {
                            d.startAt = l.startAt;
                            d.save = l.save;
                        }
                        if (parseInt(req.query.brandType)) {
                            if (d.type == 'subCategory') {
                                var newData = [];
                                d.services = d.selectors[0].services;
                                ParlorService.populateSelectorByBrands(d, newData, true, null, false, []);
                                d.selectors[0].brands = newData.length > 0 ? newData[0].selectors[0].brands : [];
                                d.selectors[0].type = "subCategory";
                                d.selectors[0].services = [];
                                d.services = [];
                            }
                        } else {
                            d.type = "service";
                        }
                    });
                });
                return res.json(CreateObjService.response(false, { categories: results }));
            });
        });
    });
});


function getLowestPrice(parlorTypes) {
    var d = null,
        lowest = 99999;
    _.forEach(parlorTypes, function(p) {
        if (p.startAt < lowest) {
            lowest = p.startAt;
            d = p;
        }
    });
    return d;
}


router.get('/dealDetailById', function(req, res, next) {
    var parlorTypesDetail = [];
    var cityId = ConstantService.getCityId(req.query.latitude, req.query.longitude);
    Deals.find({ parlorId: req.query.parlorId, 'dealType.name': { $nin: ['combo', 'newCombo'] } }).sort('dealId').exec(function(err, deals) {
        ServiceCategory.find({}, function(err, categories) {
            var categoryIds = _.map(categories, function(c) { return ObjectId(c.id); });
            AggregateService.parlorService(req.query.parlorId, categoryIds, null, null, function(results) {
                AggregateService.newComboDeals(req.query.dealId, req.query.parlorId, function(combo) {
                    var selectors = _.map(combo, function(c) {
                        parlorTypesDetail = c.parlorTypesDetail
                        return ParlorService.getServiceSelectors(c.services, 'newCombo', c.title, c.type, 'Select Service',parlorTypesDetail, cityId);
                    });
                    var deal = { dealId: combo[0].dealId, selectors: selectors };
                    var data = ParlorService.populatePackagePrice(deal, deals, results);
                    _.forEach(data.selectors, function(d) {
                        if (d.type == 'subCategory') {
                            var newData = [];
                            ParlorService.populateSelectorByBrands(d, newData, true, null, true, parlorTypesDetail);
                            d.brands = newData.length > 0 ? newData[0].selectors[0].brands : [];
                            d.services = [];
                        }
                    });
                    data.selectors = _.sortBy(data.selectors, [function(o) { return o.showToUser; }]);
                    return res.json(CreateObjService.response(false, data));
                });
            });
        });
    });
});

router.get('/departments', function(req, res, next) {
    Parlor.parlorServicesDepartmentWise(false, null, function(services) {
        return res.json(CreateObjService.response(false, { services: services }));
    });
});


router.get('/changePasswordsofOwners', function(req, res) {
    Admin.find({}, { _id: 1 }, function(err, owners) {
        for (var i = 0; i < owners.length; i++) {
            var password = "" + Math.floor(Math.random() * 90) + 10 + "";
            console.log(owners[i]._id + "   " + password + "   " + i)
            Admin.update({ _id: owners[i]._id }, { password: password }, function(err, update) {
                console.log(update + "  " + i)
            })
        }
    })
})

router.get('/parlorDetail', function(req, res, next) {
    User.findOne({ _id: req.query.userId }, { favourites: 1, recent: 1 }, function(err, user) {
        if (!user) user = {};
        Parlor.findOne({ _id: req.query.parlorId }, { dayClosed: 1, id: 1, name: 1, images: 1, gender: 1, address: 1, address2: 1, landmark: 1, rating: 1, phoneNumber: 1, latitude: 1, longitude: 1, closingTime: 1, parlorType: 1, link: 1, openingTime: 1, 'services.name': 1, 'services.subTitle': 1, 'services.subTitle': 1, 'services.serviceId': 1, 'services.categoryId': 1, 'services.serviceCode': 1, 'services.basePrice': 1, 'services.gender': 1, 'services.prices.priceId': 1, 'services.prices.name': 1, 'services.prices.price': 1, 'services.prices.tax': 1, 'services.prices.estimatedTime': 1, 'services.prices.additions': 1 }).populate('services.serviceId', { sort: 1, dontShowInApp: 1, subTitle: 1, nameOnApp: 1 }).exec(function(err, parlor) {
            Playlist.find({ parlorId: req.query.parlorId }, function(err, playList) {
                Deals.find({ showOnApp: true, parlorId: req.query.parlorId }).sort('dealId').exec(function(err, deals) {
                    Appointment.find({ parlorId: req.query.parlorId, review: { $ne: null }, 'review.rating': { $exists: true } }, { 'review.rating': 1 }).sort({ $natural: -1 }).limit(10).exec(function(err, ratings) {
                        var recentRatings = _.map(ratings, function(e) { return e.review.rating });
                        var data = {
                            name: parlor.name,
                            parlorId: parlor.id,
                            images: parlor.images ? parlor.images : ["http://www.parlorwayzata.com/images/salon-wide.jpg"],
                            gender: HelperService.getGenderName(parlor.gender),
                            address1: parlor.address,
                            address2: parlor.address2,
                            landmark: parlor.landmark,
                            rating: parlor.rating ? parseInt(parlor.rating) : 2.5,
                            price: 2,
                            recentRatings: recentRatings,
                            phoneNumber: parlor.phoneNumber,
                            latitude: parlor.latitude,
                            longitude: parlor.longitude,
                            closingTime: parlor.closingTime,
                            dayClosed: parlor.dayClosed,
                            parlorType: parseInt(parlor.parlorType),
                            link: parlor.link,
                            favourite: _.filter(user ? user.favourites : [], function(f) { return f.parlorId == parlor.id; })[0] ? true : false,
                            recent: user.recent ? user.recent.parlorId == parlor.id ? true : false : false,
                            openingTime: parlor.openingTime,
                            info: ConstantService.getInfoDetails(parlor.parlorType),
                            music: (playList.length > 0) ? true : false,
                        };
                        getParlorService(parlor.services, true, deals, function(reqServices) {
                            data.categories = reqServices;
                            return res.json(CreateObjService.response(false, data));
                        });
                    });
                });
            });
        });
    });
});



router.get('/updateDeals4', function(req, res) {
    AllDeals.find({ "dealType.name": { $in: ["dealPrice", "chooseOnePer", "chooseOne"] } }, { services: 1 }, function(err, deals) {
        console.log(deals.length);
        _.forEach(deals, function(d, key) {
            _.forEach(d.services, function(s) {
                s.parlorTypesDetail = [];
                getServiceLowestPrice(s.serviceCode, 1, function(parlorPrice) {
                    s.parlorTypesDetail.push({
                        cityId: 1,
                        parlorPrice: parlorPrice,
                    })
                    AllDeals.update({ _id: d.id }, { services: d.services }, function(err, d) {
                        console.log("done" + key);
                    });
                });
            })
        })
    });
});



function getServiceLowestPrice(serviceCode, cityId, callback) {
    var parlorTypes = [0, 1, 2];
    var data = [];
    Service.find({ serviceCode: serviceCode }, function(err, allServices) {
        Async.each(parlorTypes, function(parlorType, callback2) {
            Parlor.find({ parlorType: parlorType, cityId: cityId, "services.serviceCode": serviceCode, active: true }, { 'services.$': 1, tax: 1 }, function(err, parlors) {
                var parlorIds = _.map(parlors, function(p) { return p.id });
                Deals.find({ parlorId: { $in: parlorIds }, "dealType.name": { $in: ["dealPrice", "chooseOne", "chooseOnePer"] }, "services.serviceCode": serviceCode }, function(err, deals) {
                    var lowest = 999999,
                        percent = 0;
                    _.forEach(parlors, function(ps) {
                        var s = {
                            serviceCode: serviceCode,
                        };
                        if (ps.services[0].prices[0].brand.brands.length > 0) {
                            s.brandId = ps.services[0].prices[0].brand.brands[0].brandId;
                            if (ps.services[0].prices[0].brand.brands[0].products > 0) {
                                s.productId = ps.services[0].prices[0].brand.brands[0].products[0].productId;
                            }
                        }
                        var currentDeals = _.filter(deals, function(deal) { return deal.parlorId == ps.id });
                        var temp = Appointment.getServiceRealPrice(ps.services[0].prices[0], s, currentDeals, allServices);
                        if (temp.price * (ps.tax / 100 + 1) < lowest) {
                            lowest = Math.floor(temp.price * (ps.tax / 100 + 1));
                            percent = parseInt(((temp.menuPrice - temp.price) / temp.menuPrice) * 100);
                        }
                    })

                    if (lowest != 999999) {
                        data.push({
                            type: parlorType,
                            startAt: lowest,
                            percent: percent,
                        });
                    }
                    callback2();

                });
            })
        }, function allTaskCompleted() {
            console.log("done");
            // return _.sortBy(data, 'rating').reverse();
            return callback(_.sortBy(data, 'type'));
        });
    });
}


router.get('/homeDealDetailById', function(req, res, next) {
    var parlorTypesDetail = [];
    var cityId = ConstantService.getCityId(req.query.latitude, req.query.longitude);
    AggregateService.newComboDeals(req.query.dealId, req.query.parlorId, function(combo) {
        var selectors = _.map(combo, function(c) {
            parlorTypesDetail = c.parlorTypesDetail
            return ParlorService.getServiceSelectors(c.services, 'newCombo', c.title, c.type, 'Select Service', parlorTypesDetail, cityId);
        });
        _.forEach(selectors, function(d) {
            if (d.type == 'subCategory') {
                var newData = [];
                ParlorService.populateSelectorByBrands(d, newData, true, null, false, parlorTypesDetail);
                d.brands = newData.length > 0 ? newData[0].selectors[0].brands : [];
                d.services = [];
            }
        });
        selectors = _.sortBy(selectors, [function(o) { return o.showToUser; }]);
        return res.json(CreateObjService.response(false, { dealId: combo[0].dealId, selectors: selectors }));
    });
});

router.get('/parlorPackages', function(req, res, next) {
    Deals.find({ parlorId: req.query.parlorId, 'dealType.name': { $nin: ['combo', 'newCombo'] } }).sort('dealId').exec(function(err, deals) {
        ServiceCategory.find({}, function(err, categories) {
            var categoryIds = _.map(categories, function(c) { return ObjectId(c.id); });
            AggregateService.parlorService(req.query.parlorId, categoryIds, null, null, function(results) {
                AggregateService.newComboDeals(null, req.query.parlorId, function(combos) {
                    var data = [];
                    _.forEach(combos, function(combo) {
                        combo.selectors = _.map(combo.selectors, function(c) {
                            return ParlorService.getServiceSelectors(c.services, 'newCombo', c.title, c.type, 'Select Service', c.parlorTypesDetail);
                        });
                        data.push(ParlorService.populatePackagePrice(combo, deals, results));
                    });
                    data = _.map(data, function(d) {
                        return {
                            dealId: d.dealId,
                            dealType: d.dealType,
                            slabId: d.slabId,
                            name: d.name,
                            description: d.description,
                            menuPrice: d.menuPrice,
                            dealPrice: d.dealPrice,
                            weekDay: d.weekDay,
                            dealsCategory: d.dealsCategory,
                            selectors: d.selectors,
                        };
                    });

                    AggregateService.dealsByDepartment(["M", "F"], categoryIds, req.query.parlorId, true, function(comboDeals) {
                        comboDeals = ParlorService.parseDealsHomePage(comboDeals, true);
                        _.forEach(comboDeals, function(c) {
                            _.forEach(c.deals, function(d) {
                                data.push(ParlorService.populatePackagePrice(d, deals, results))
                            });
                        });
                        return res.json(CreateObjService.response(false, data));
                    });

                });
            });
        });
    });
});

router.get('/parlorChairStatus', function(req, res) {
    var date = req.query.datetime ? new Date(req.query.datetime) :  new Date();
    console.log(date);
    ParlorChair.getCurrentStatus(date, req.query.parlorId, function(d) {
        res.json(CreateObjService.response(false, d))
    })
});

router.post('/saveSalonLayout', function(req, res) {
    SalonLayout.findOne({ parlorId: req.body.parlorId }, function(err, d) {
        if (!d) {
            SalonLayout.create({ layout: req.body.data, parlorId: req.body.parlorId }, function(err, d) {
                return res.json('Done');
            });
        } else {
            SalonLayout.update({ parlorId: req.body.parlorId }, { layout: req.body.data }, function(err, d) {
                return res.json('Updated ');
            });
        }
    });
});


router.get('/parlorLayout', function(req, res) {
    SalonLayout.findOne({parlorId : req.query.parlorId}, function(err, d) {
        res.json(CreateObjService.response(false, d))
    })
});

router.get('/parlorServiceByDepartmentv2', function(req, res, next) {
    var cityId = ConstantService.getCityId(req.query.latitude, req.query.longitude);
    var slabs = [],
        categories = [],
        categoryIds = [],
        flashCouponsServiceCode = [],
        user, tax, parlor = {};
    Async.parallel([
            function(callback2) {
                Slab.find({}, function(err, slabs1) {
                    slabs = slabs1;
                    callback2(null);
                });
            },
            function(callback2) {
                Parlor.findOne({ _id: req.query.parlorId }, { tax: 1, earlyBirdOfferType : 1, earlyBirdOfferPresent: 1 }, function(err, parlor1) {
                    console.log("parlor1" , parlor1)
                    tax = parlor1.tax;
                    parlor = parlor1;
                    callback2(null);
                });
            },
            function(callback2) {
                SuperCategory.findOne({ _id: req.query.departmentId }, function(err, superCategory) {
                    ServiceCategory.find({ superCategory: superCategory.name }, function(err, categories1) {
                        categories = categories1;
                        categoryIds = _.map(categories, function(c) { return ObjectId(c.id); });
                        callback2(null);
                    });
                });
            }
        ],
        function(err, result) {
            var realServices = [],
                results = [],
                deals = [],
                comboDeals = [];

            Async.parallel([
                    function(callback) {
                        Service.find({ categoryId: { $in: categoryIds } }, { "prices.brand": 1, id: 1 }, function(s, realServices1) {
                            realServices = realServices1;
                            callback(null);
                        });
                    },
                    function(callback) {
                        AggregateService.parlorService(req.query.parlorId, categoryIds, req.query.gender, req.query.isBillingApp, function(results1) {
                            results = results1;
                            callback(null);
                        });
                    },
                    function(callback) {
                        var query = {currentCount : {$gt : 0}, parlors: { $elemMatch: { parlorId: req.query.parlorId, currentCount: { $gt: 0 } } } };
                        if (localVar.isServer()) query.active = true;
                        else query.active = false;
                        FlashCoupon.find(query, function(err, coupons2) {
                            _.forEach(coupons2, function(c) {
                                _.forEach(c.serviceCodes, function(sc) {
                                    var price = _.filter(c.cityPrice, function(cp) { return cp.cityId == cityId })[0];
                                    var par = _.filter(c.parlors, function(cp) { return cp.parlorId + "" == "" + req.query.parlorId })[0];
                                    flashCouponsServiceCode.push({
                                        serviceCode: sc.serviceCode,
                                        brandId: sc.brandId,
                                        productId: sc.productId,
                                        price: price ? price.price : 5000,
                                        flashCouponRemaining: par.currentCount,
                                        flashCouponExpiry: c.expires_at,
                                        code: c.code,
                                    });
                                });
                            });
                            callback(null);
                        });
                    },
                    function(callback) {
                        Deals.find({ parlorId: req.query.parlorId, isDeleted: false, active: 1, 'dealType.name': { $nin: ['combo', 'newCombo'] } }).sort('dealSort').exec(function(err, deals1) {
                            deals = deals1;
                            callback(null);
                        });
                    },
                    function(callback) {
                        AggregateService.dealsByDepartment(req.query.gender, categoryIds, req.query.parlorId, null, function(comboDeals1) {
                            comboDeals = comboDeals1;
                            callback(null);
                        });
                    },
                    function(callback) {
                        User.findOne({ _id: req.query.userId }, function(err, user1) {
                            if (!user1) {
                                user = {};
                            } else {
                                user = user1;
                            }
                            callback(null);
                        });
                    }

                ],
                function(err, result2) {
                    SubscriptionSale.find({}).count().exec(function(err, count) {
                        comboDeals = ParlorService.parseDealsHomePage(comboDeals, true, cityId);
                        _.forEach(results, function(r) {
                            _.forEach(r.services, function(s) {
                                var flashSale = _.filter(flashCouponsServiceCode, function(f) { return f.serviceCode == s.serviceCode })[0];

                                var rservice = _.filter(realServices, function(resv) { return resv.id + "" == s.serviceId + "" })[0];
                                ParlorService.populateServiceDeals(req.query.gender, results, s, deals, rservice);
                                s.packages = [];
                                if (s.prices[0].brand.brands.length > 0) {
                                    _.forEach(s.prices[0].brand.brands, function(brand) {
                                        brand.products = [];
                                    });
                                }
                                if (flashSale) {
                                    var flashPrice = parseInt(flashSale.price / (1 + tax / 100));
                                    s.flashSalePrice = flashPrice;
                                    s.couponCode = flashSale.code;
                                    s.expiryDate = flashSale.flashCouponExpiry;
                                    s.couponLeft = flashSale.flashCouponRemaining;
                                    s.flashSale = true;
                                    if (s.flashSale) {
                                        if (s.prices[0].brand.brands.length > 0) {
                                            _.forEach(s.prices[0].brand.brands, function(brand) {
                                                if (brand.brandId + "" == flashSale.brandId) {
                                                    brand.originalRatio = JSON.parse(JSON.stringify(brand.dealRatio));
                                                    console.log("here ------------------")
                                                    brand.dealRatio = flashPrice / s.dealPrice;
                                                }
                                                if (brand.products.length > 0) {
                                                    _.forEach(brand.products, function(product) {
                                                        product.dealRatio = flashPrice / s.dealPrice;
                                                        product.originalRatio = JSON.parse(JSON.stringify(product.dealRatio));
                                                    });
                                                }

                                            })
                                        }
                                    }
                                }
                            });
                        });
                        _.forEach(results, function(r) {
                            var packageDeals = [];
                            r.packages = [];
                            _.forEach(r.services, function(s) {
                                s.upgrades = ParlorService.getServiceUpgrades(results, s);
                                packageDeals = ParlorService.populateAllPackages(s, comboDeals, deals, results);
                                _.forEach(packageDeals, function(p) { p.newCombo = [] });
                                s.packages = req.query.removePackage ? [] : packageDeals;
                                _.forEach(packageDeals, function(d) {
                                    if (!_.filter(r.packages, function(pac) { return pac.dealId == d.dealId })[0])
                                        r.packages.push(d)
                                });
                            });
                            /*r.packages = _.map(_.sortBy(r.packages, [function(o) { return o.dealSort; }]), function(pak){
                                return ParlorService.getFinalPackageObj(pak);
                            });*/
                            r.packages = _.sortBy(r.packages, [function(o) { return o.dealSort; }]);
                        });

                        var categories = _.map(results, function(r) {
                            return {
                                name: r.name,
                                services: r.services,
                                packages: req.query.removePackage ? [] : r.packages,
                            }
                        });
                        var slabs1 = _.map(slabs, function(slab) {
                            return {
                                slabId: slab.id,
                                ranges: _.map(slab.ranges, function(range) {
                                    return {
                                        range1: range.range1,
                                        range2: range.range2,
                                        discount: range.discount,
                                    };
                                })
                            };
                        });
                        return res.json(CreateObjService.response(false, { categories: categories, slabs: { slabs: slabs1 }, subscriptions: ConstantService.getHomePageSubscriptions(parlor.earlyBirdOfferType, "F", count, parlor.parlorType), subscriptionFeatures : {heading : "<div style='color: #cc0000'>Subscriber Only Features<div>",features : '<ul><li style="float:left;list-style:none">&#x20B9;500 FREE/Month</li><li style="float:left;margin-left: 2%;">FLASH SALE</li><li style="float:left;margin-left: 2%;">10% Product Discount WiFi</li><li style="float:left;margin-left: 2%;">Music</li></ul>'}}));
                    });
                });
        });
});


router.get('/parlorServiceByDepartment', function(req, res, next) {
    var cityId = ConstantService.getCityId(req.query.latitude, req.query.longitude);
    Slab.find({}, function(err, slabs) {
        SubscriptionSale.find({}).count().exec(function(err, count) {
            SuperCategory.findOne({ _id: req.query.departmentId }, function(err, superCategory) {
                ServiceCategory.find({ superCategory: superCategory.name }, function(err, categories) {
                    var categoryIds = _.map(categories, function(c) { return ObjectId(c.id); });
                    Service.find({ categoryId: { $in: categoryIds } }, { "prices.brand": 1, id: 1 }, function(s, realServices) {
                        AggregateService.parlorService(req.query.parlorId, categoryIds, req.query.gender, null, function(results) {
                            Deals.find({ parlorId: req.query.parlorId, isDeleted: false, active: 1, 'dealType.name': { $nin: ['combo', 'newCombo'] } }).sort('dealSort').exec(function(err, deals) {
                                AggregateService.dealsByDepartment(req.query.gender, categoryIds, req.query.parlorId, null, function(comboDeals) {
                                    comboDeals = ParlorService.parseDealsHomePage(comboDeals, true, cityId);
                                    _.forEach(results, function(r) {
                                        _.forEach(r.services, function(s) {
                                            var rservice = _.filter(realServices, function(resv) { return resv.id + "" == s.serviceId + "" })[0];
                                            ParlorService.populateServiceDeals(req.query.gender, results, s, deals, rservice);
                                            s.packages = [];
                                        });
                                    });
                                    _.forEach(results, function(r) {
                                        var packageDeals = [];
                                        r.packages = [];
                                        _.forEach(r.services, function(s) {
                                            s.upgrades = ParlorService.getServiceUpgrades(results, s);
                                            packageDeals = ParlorService.populateAllPackages(s, comboDeals, deals, results);
                                            _.forEach(packageDeals, function(p) { p.newCombo = [] });
                                            s.packages = packageDeals;
                                            _.forEach(packageDeals, function(d) {
                                                if (!_.filter(r.packages, function(pac) { return pac.dealId == d.dealId })[0])
                                                    r.packages.push(d)
                                            });
                                        });
                                        /*r.packages = _.map(_.sortBy(r.packages, [function(o) { return o.dealSort; }]), function(pak){
                                            return ParlorService.getFinalPackageObj(pak);
                                        });*/
                                        r.packages = _.sortBy(r.packages, [function(o) { return o.dealSort; }]);
                                    });

                                    var categories = _.map(results, function(r) {
                                        return {
                                            name: r.name,
                                            services: r.services,
                                            packages: r.packages,
                                        }
                                    });
                                    var slabs1 = _.map(slabs, function(slab) {
                                        return {
                                            slabId: slab.id,
                                            ranges: _.map(slab.ranges, function(range) {
                                                return {
                                                    range1: range.range1,
                                                    range2: range.range2,
                                                    discount: range.discount,
                                                };
                                            })
                                        };
                                    });
                                    return res.json(CreateObjService.response(false, { categories: categories, slabs: { slabs: slabs1 }, subscriptions: ConstantService.getHomePageSubscriptions(0, "F", count, parlor.parlorType) }));
                                });
                            });
                        });
                    });
                });
            });
        });
    })
});


router.post('/contactUsMail', function(req, res, next) {
    var emailId = req.body.emailId,
        name = req.body.name,
        phoneNo = req.body.phoneNumber,
        message = req.body.message;
    if (emailId) {
        // var nodemailer = require('nodemailer');
        // var transporter = nodemailer.createTransport('smtps://customercare@beusalons.com:beusalons@123@smtp.gmail.com');
        // var mailOptions = {
        //     from: 'info@beusalons.com', // sender address
        //     to: "customercare@beusalons.com", // list of receivers
        //     html: '<h1>' + name + ' - ' + phoneNo + ' - ' + message + '</h1>',
        //     subject: 'Contact Be U Salons' // Subject line
        // };

        var options = {
        url: ' https://api.elasticemail.com/v2/email/send',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        "form": {
            "apikey": "670ce84e-6c56-4424-b3aa-282fbeb642ce",
            "from": 'info@beusalons.com',
            "to": 'customercare@beusalons.com',
            "bodyHtml": '<h1>' + name + ' - ' + phoneNo + ' - ' + message + '</h1>',
            "subject": 'Contact Be U Salons'
            }
        };
        request.post(options, function(err, res1, body) {
            if (err) {
                console.log(err)
                res.json('error')
                    // cb();
            } else {
                var json = JSON.parse(body);
                var options = {
                url: ' https://api.elasticemail.com/v2/email/send',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                "form": {
                    "apikey": "670ce84e-6c56-4424-b3aa-282fbeb642ce",
                    "from": 'customercare@beusalons.com',
                    "to": emailId,
                    "bodyHtml": '<h1>Hi ' + name + ' thank you for contacting Be U salons.</h1>',
                    "subject": 'Contact Be U Salons'
                    }
                };
                request.post(options, function(err2, res2, body2) {
                    if (err2) {
                        console.log(err2)
                        res.json('error')
                            // cb();
                    } else {
                        var json = JSON.parse(body);
                       console.log(json)
                       res.json('send')
                        // cb();
                    }
                });
            }
        });
        // transporter.sendMail(mailOptions, function(error, info) {
        //     if (error)
        //         return console.log(error);
        //     else
        //         var transporter = nodemailer.createTransport('smtps://customercare@beusalons.com:beusalons@123@smtp.gmail.com');
        //     var mailOptions = {
        //         from: 'customercare@beusalons.com', // sender address
        //         to: emailId, // list of receivers
        //         html: '<h1>Hi ' + name + ' thank you for contacting Be U salons.</h1>',
        //         subject: 'Contact Be U Salons' // Subject line
        //     };
        //     transporter.sendMail(mailOptions, function(error, info) {
        //         if (error)
        //             return console.log(error);
        //         else
        //             console.log('Message sent: ' + info.response);
        //     });
        // });
    }
});


function sendElasticMail(emails, html, subject) {
    var options = {
        url: ' https://api.elasticemail.com/v2/email/send',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        "form": {
            "apikey": "670ce84e-6c56-4424-b3aa-282fbeb642ce",
            "from": from,
            "fromName": "Be U Salons",
            "to": emails,
            "bodyHtml": html,
            "subject": subject
        }
    };
    request.post(options, function(err, res1, body) {
        if (err) {
            console.log(err)
                // cb();
        } else {
            var json = JSON.parse(body);
            console.log(json)
            // cb();
        }
    });
};

router.get('/sendMailByEjs', function(req, res, next) {
    console.log("aaya")
    var nodemailer = require('nodemailer');
    var html = ejs.renderFile('views/mails/mailerVandana.ejs', { text: 'Welcome to test' }, function(err, html) {
        console.log(err)
        var transporter = nodemailer.createTransport('smtps://info@beusalons.com:beu%$#@!@smtp.gmail.com');
        var mailOptions = {
            from: 'info@beusalons.com', // sender address
            to: ["nikita@beusalons.com", "manoj@beusalons.com", "vandna@beusalons.com"], // list of receivers
            html: html,
            subject: 'Test' // Subject line
        };
        transporter.sendMail(mailOptions, function(error, info) {
            console.log(error)
            res.json('done');
        });
    });
});

router.get('/sendMail', function(req, res, next) {
    var emailId = 'robbin@beusalons.com';
    if (emailId) {
        var nodemailer = require('nodemailer');
        var transporter = nodemailer.createTransport('smtps://appointments@beusalons.com:wx2t2Tr7pMrqnK2CIqwd3g@smtp.mandrillapp.com');
        var mailOptions = {
            from: 'appointments@beusalons.com', // sender address
            to: "nikita@beusalons.com", // list of receivers
            html: '<h1><img src= "https://ramen-files.s3.amazonaws.com/charturl-images/2017-07-06/5596f242-3e16-4363-a0e5-bd1a8ea41ae5.png"></h1>',
            subject: 'Summary of your order with Beu Salons - ' // Subject line
        };
        transporter.sendMail(mailOptions, function(error, info) {
            if (error)
                return console.log(error);
            else
                console.log(info);
        });
    } else {
        console.log("sdfhuiwehf")
    }
});

router.get('/parlorHome', function(req, res, next) {
    var query = {};
    if (req.query.parlorLink) query.link = req.query.parlorLink;
    else query._id = req.query.parlorId;
    Parlor.findOne(query).exec(function(err, parlor) {
        Deals.find({ parlorId: parlor.id, active: 1 }).exec(function(err, deals) {
            ServiceCategory.find({}).sort('sort').exec(function(err, categories) {
                var data = [];
                _.forEach(categories, function(category) {
                    var serviceByCategory = _.filter(parlor.services, { 'categoryId': category._id });
                    var cat = ServiceCategory.parse(category);
                    var parsedService = Parlor.parseServiceForParlorHome(serviceByCategory);
                    cat.services = parsedService;
                    if (serviceByCategory.length > 0) data.push(cat);
                });
                var reqData = [];
                SuperCategory.find({}).sort('sortOrder').exec(function(err, supercategories) {
                    _.forEach(supercategories, function(s) {
                        var categoryBySuper = _.map(_.filter(data, { 'superCategory': s.name }), function(s) {
                            s.services = _.map(s.services, function(service) {
                                service.deals = populateDeals(service, deals);
                                _.forEach(service.prices, function(pr) {
                                    pr.name = pr.name == '' ? "Creative Stylist" : pr.name;
                                });
                                return service;
                            });
                            return s;
                        });

                        if (categoryBySuper.length > 0) reqData.push({ name: s.name, categories: categoryBySuper });
                    });
                    var parlorDetail = {
                        name: parlor.name,
                        parlorId: parlor.id,
                        parlorType: parseInt(parlor.parlorType),
                        link: parlor.link,
                        images: parlor.images ? parlor.images : ["http://www.parlorwayzata.com/images/salon-wide.jpg"],
                        gender: HelperService.getGenderName(parlor.gender),
                        address1: parlor.address,
                        address2: parlor.address2,
                        landmark: parlor.landmark,
                        rating: parlor.rating ? parseInt(parlor.rating) : 2.5,
                        price: 2,
                        services: reqData,
                        phoneNumber: "8690291910",
                        latitude: parlor.latitude,
                        longitude: parlor.longitude,
                        closingTime: parlor.closingTime,
                        openingTime: parlor.openingTime,
                        info: ["Credit Card Accepted", "Car Parking Available", "Air Condition"],
                    };
                    return res.json(parlorDetail);
                });
            });
        });
    });
});

router.post('/verifyOtpForWebUser', function(req, res) {
    var phoneNumber = req.body.phoneNumber;
    Otp.find({ phoneNumber: phoneNumber, otp: req.body.otp, used: 0, createdAt: { $gt: HelperService.get5minBefore() } }, function(err, otps) {
        if (otps.length >= 1) {
            var eligible = false;
            Otp.update({ phoneNumber: phoneNumber, used: 0 }, { used: 1, verifiedAt: new Date() }, function(err, update) {
                var accessToken = require('crypto').createHash('sha1').update('sadd%^^^^sdasdsd3423F$TTTGGasd' + (new Date()).valueOf().toString()).digest('hex');
                var updateObj = { phoneVerification: 1, accesstoken: accessToken, messageSent: 1, firstTimeVerified: 1 };
                updateObj.password = require('crypto').createHash('sha1').update("sad89" + req.body.phoneNumber).digest('base64');
                User.findOne({ phoneNumber: phoneNumber }, function(err, user1) {
                    if (user1) {
                        User.update({ _id: user1.id }, updateObj, function(err, no) {
                            User.findOne({ _id: user1.id }, function(err, user2) {
                                return res.json(CreateObjService.response(false, User.getUserObjApp(user2)));
                            });
                        });
                    } else {
                        updateObj.phoneNumber = req.body.phoneNumber;
                        updateObj.firstName = req.body.name;
                        updateObj.gender = "F";
                        User.create(updateObj, function(err, us) {
                            return res.json(CreateObjService.response(false, User.getUserObjApp(us)));
                        });
                    }
                });
            });
        } else {
            return res.json(CreateObjService.response(true, 'Invalid otp'));
        }
    });
});

router.post('/verifyOtp', function(req, res) {
    var now_date = new Date();
    now_date.setMonth(now_date.getMonth() + 1);
    var phoneNumber = req.body.phoneNumber;
    Otp.find({ phoneNumber: phoneNumber, otp: req.body.otp, used: 0, createdAt: { $gt: HelperService.get5minBefore() } }, function(err, otps) {
        if (otps.length >= 1) {
            var eligible = false;
            Otp.update({ phoneNumber: phoneNumber, used: 0 }, { used: 1, verifiedAt: new Date() }, function(err, update) {
                var accessToken = require('crypto').createHash('sha1').update('sadd%^^^^sdasdsd3423F$TTTGGasd' + (new Date()).valueOf().toString()).digest('hex');
                var updateObj = { phoneVerification: 1, accesstoken: accessToken, messageSent: 1, firstTimeVerified: 1,marketingSource:req.body.marketingSource };
                if (req.body.newPassword) updateObj.password = require('crypto').createHash('sha1').update(req.body.newPassword).digest('base64');
                User.findOne({ phoneNumber: phoneNumber }, function(err, user1) {
                    var mobile = 0;
                    if (!user1.firstTimeVerified) eligible = true;
                    if (user1.mobile && !user1.messageSent) mobile = 1;
                    getSocialDetails(req.body.socialLoginType, req.body.accessToken, function(userData) {
                        if (userData) {
                            updateObj.name = userData.name;
                            updateObj.gender = req.body.socialLoginType == 1 ? userData.gender : req.body.gender;
                            updateObj.emailId = userData.emailId;
                            updateObj.profilePic = userData.profilePic;
                            if (req.body.socialLoginType == 2)
                                updateObj.googleId = userData.id;
                            else
                                updateObj.facebookId = userData.id;
                            updateObj.password = req.body.accessToken.substring(0, 10);
                        }
                        if(eligible){
                            updateObj.allow100PercentDiscount = true;
                            // updateObj.loyalityPoints = 100;
                        }
                        User.update({ phoneNumber: phoneNumber }, updateObj, function(err, u) {
                            User.findOne({ phoneNumber: phoneNumber }, function(err, user) {
                                var usermessage = getUserRegistrationUrl(user.firstName, user.phoneNumber, user.freeServices, mobile);
                                if (mobile) {
                                    Appointment.sendSMS(usermessage, function(e) {

                                    });
                                }
                                user1.referCodeBy = user1.referCodeBy ? user1.referCodeBy : 'DASDAS%^&@#@!#543543';
                                User.findOne({ referCode: user1.referCodeBy }, function(err, user2) {
                                    if (user2 && eligible) {

                                        // if (user2.referalLoyalityPoints < 2000) {
                                        // var loyalityPoints = 100;
                                        // var loyalityPoints2 = user2.loyalityPoints ? user2.loyalityPoints + loyalityPoints : loyalityPoints;
                                        // var referalLoyalityPoints = user.referalLoyalityPoints ? user.referalLoyalityPoints + loyalityPoints : loyalityPoints;

                                        // User.update({ _id: user2.id }, { referalLoyalityPoints: referalLoyalityPoints, loyalityPoints: loyalityPoints2, $push: { creditsHistory: { createdAt: new Date(), amount: loyalityPoints, balance: loyalityPoints2, source: user.id, reason: 'Referal' } } }, function(e, u) {
                                        User.update({ _id: user2.id }, { $push: { couponCodeHistory: { createdAt: new Date(), active: true, couponType: 5, expires_at: now_date, code: 'REFER25' } } }, function(e, u) {

                                            sendReferalNotification(user2, 1);
                                            return res.json(CreateObjService.response(false, User.getUserObjApp(user)));
                                        });
                                        // } else {
                                        //     sendReferalNotification(user2, 0);
                                        // }
                                    } else {
                                        return res.json(CreateObjService.response(false, User.getUserObjApp(user)));
                                    }
                                });
                            });
                        });

                    });

                });
            });
        } else {
            return res.json(CreateObjService.response(true, 'Invalid otp'));
        }
    });
});


router.get('/fb', function(req, res) {
    var FB = require('fb');
    FB.api('me?fields=picture.width(800).height(800)', { fields: ['id', 'name', 'email', 'picture', 'gender'], access_token: 'EAACEdEose0cBAFwSDO6HAtDsxXt71cGPOvelbQqfuN9vZAYpQQLxNhHeZCWsXbCjdJYyr3fygYOtgu2x6OqKTb7iH0oWa4PQQMRInrLyu5ZBSc8ZAmFVZBGz8uXBp1CBLE4xz7qeh2gjbsYOTgb0j79xdW27wlZBah5ZBVSZAKVW9oKPcnu7Kn8oKnGSDXJHZBa0ZD' }, function(response) {
        return res.json(response);
    });
});


//red = 587088445c63a33c0af62727
//blue = 594cdd793c61904155d48595
//green = 594df14dc5be5d6c0e79eaf8

router.get('/updateDeals', function(req, res) {
    Parlor.find({ parlorType: 2, _id: { $nin: ["58e727cf14328a4b2f3b637c"] } }, { _id: 1 }, function(err, parlors) {
        var parlorIds = _.map(parlors, function(p) { return p.id });
        console.log(parlorIds.length);
        _.forEach(parlorIds, function(dealsToBeUpdated, key) {
            console.log("herer");
            Deals.find({ parlorId: "58e727cf14328a4b2f3b637c" }, function(err, deals) {
                Deals.find({ parlorId: dealsToBeUpdated }, function(err, parlorDeals) {
                    _.forEach(deals, function(deal) {
                        var s = _.filter(parlorDeals, function(p) { return p.dealId == deal.dealId })[0];
                        if (s) {
                            Deals.update({ _id: s.id }, { menuPrice: deal.menuPrice, dealPrice: deal.dealPrice, slabId: deal.slabId, newCombo: deal.newCombo, brands: deal.brands, "dealType.price": deal.dealType.price }, function(err, d) {
                                console.log("abd updated" + key);
                            });
                        } else {
                            Deals.create(Deals.newDealObjUpdate(deal, dealsToBeUpdated), function(D, d) {
                                console.log("done" + key);
                            });
                        }
                    });
                });
            });
        });
    });
});

router.get('/updateParlorServices', function(req, res) {
    Parlor.findOne({ _id: "58e727cf14328a4b2f3b637c" }, { services: 1 }, function(err, selectedParlor) {
        _.forEach(selectedParlor.services, function(s) {
            _.forEach(s.prices, function(p) {
                p.employees = [];
            });
        });
        Parlor.find({ parlorType: 2, _id: { $nin: ["58e727cf14328a4b2f3b637c"] } }, { services: 1, gender: 1 }, function(err, parlors) {
            console.log(err);
            console.log("Total Parlors", parlors.length);
            _.forEach(parlors, function(parlor, key) {
                _.forEach(selectedParlor.services, function(realService) {
                    var found = false;
                    _.forEach(parlor.services, function(service) {
                        if (service.serviceId + "" == realService.serviceId + "") {
                            found = true;
                            _.forEach(realService.prices, function(p) {
                                _.forEach(service.prices, function(price) {
                                    if (price.priceId == p.priceId) {
                                        price.price = p.price;
                                        price.brand = p.brand;
                                    }
                                });
                            });
                        }
                    });
                    if (!found) {

                        // 1 - unisex , 2 - male, 3 - female
                        if (parlor.gender == 1)
                            parlor.services.push(realService);
                        else if (parlor.gender == 2 && realService.gender == "M")
                            parlor.services.push(realService);
                        else if (parlor.gender == 3 && realService.gender == "F")
                            parlor.services.push(realService);

                    }
                });
                Parlor.update({ _id: parlor.id }, { services: parlor.services }, function(err, data) {
                    console.log("update " + key);
                    console.log(err);
                });
            });
            return res.json(CreateObjService.response(false, 'Successfully updated'));
        });
    });
});


router.post('/sendOtpWeb', function(req, res) {
    var phoneNumber = req.body.phoneNumber;
    var resetPassword = req.body.resetPassword;
    Otp.find({ phoneNumber: phoneNumber, createdAt: { $gt: HelperService.get60secBefore() } }, function(err, otps) {
        if (otps.length > 1)
            return res.json(CreateObjService.response(true, 'Please wait for 45 sec'));
        else {
            Otp.find({ phoneNumber: phoneNumber, createdAt: { $gt: HelperService.get24HrsBefore() } }, function(err, data) {
                if (data.length > 1000)
                    return res.json(CreateObjService.response(true, 'Maximum limit exceed for your number'));
                else {
                    User.findOne({ phoneNumber: req.body.phoneNumber }, function(err, user) {
                        var otp = Math.floor(Math.random() * 9000) + 1000;
                        if (phoneNumber == "9501551079") otp = 1234;
                        if(phoneNumber == "8826345311"  || phoneNumber == "7289819231" || phoneNumber == "9695748822")otp = 4321;
                        var retry = 0;
                        if (parseInt(req.body.retry)) {
                            if (parseInt(req.body.retry) == 2) retry = 0;
                            else retry = 1;
                        }
                        var message = Otp.getMessage(otp);
                        Otp.create({ used: 0, otp: otp, userId: null, phoneNumber: phoneNumber, message: message }, function(err, newOtp) {
                            if(newOtp.otp == 4321){
                                return res.json(CreateObjService.response(false, 'Otp has been sent to your number'));
                            }else{
                                var url = getSmsUrlForOtp('BEUSLN', message, [phoneNumber], 'T', otp, retry);
                                var request = require("request");
                                console.log(otp);
                                request({
                                    uri: url,
                                    method: "GET",
                                    timeout: 7000,
                                    followRedirect: true,
                                    maxRedirects: 1
                                }, function(error, response, body) {
                                    if (error)
                                        return res.json(CreateObjService.response(true, 'Error sending OTP'));
                                    else {
                                        return res.json(CreateObjService.response(false, 'Otp has been sent to your number'));
                                    }


                                });
                            }
                            
                        });
                    });
                }
            });
        }
    });
});


router.post('/sendOtp', function(req, res) {
    var phoneNumber = req.body.phoneNumber;
    var resetPassword = req.body.resetPassword;
    Otp.find({ phoneNumber: phoneNumber, createdAt: { $gt: HelperService.get60secBefore() } }, function(err, otps) {
        if (otps.length > 1)
            return res.json(CreateObjService.response(true, 'Please wait for 45 sec'));
        else {
            Otp.find({ phoneNumber: phoneNumber, createdAt: { $gt: HelperService.get24HrsBefore() } }, function(err, data) {
                if (data.length > 1000)
                    return res.json(CreateObjService.response(true, 'Maximum limit exceed for your number'));
                else {
                    User.findOne({ phoneNumber: req.body.phoneNumber }, function(err, user) {
                        if (user) {
                            var otp = Math.floor(Math.random() * 9000) + 1000;
                            if (phoneNumber == "9501551079" || phoneNumber == "9695748822" || phoneNumber == "8826345311" || phoneNumber == "9929977668") otp = 1234;
                            var retry = 0;
                            if (parseInt(req.body.retry)) {
                                otp = user.realOtp;
                                if (parseInt(req.body.retry) == 2) retry = 0;
                                else retry = 1;
                            }
                            var message = Otp.getMessage(otp);
                            Otp.create({ used: 0, otp: otp, userId: user.id, phoneNumber: phoneNumber, message: message }, function(err, newOtp) {
                                var url = getSmsUrlForOtp('BEUSLN', message, [phoneNumber], 'T', otp, retry);
                                var request = require("request");
                                console.log(otp);
                                if(phoneNumber != "9695748822" && phoneNumber != "8826345311" && phoneNumber != "9929977668"){
                                    request({
                                        uri: url,
                                        method: "GET",
                                        timeout: 7000,
                                        followRedirect: true,
                                        maxRedirects: 1
                                    }, function(error, response, body) {
                                        if (error)
                                            return res.json(CreateObjService.response(true, 'Error sending OTP'));
                                        else {
                                            User.update({ phoneNumber: phoneNumber }, { realOtp: otp, phoneVerification: 0 }, function(err, u) {
                                                return res.json(CreateObjService.response(false, 'Otp has been sent to your number'));
                                            });
                                        }


                                    });
                                }else{
                                    return res.json(CreateObjService.response(false, 'Otp has been sent to your number'));
                                }
                            });
                        } else {
                            return res.json(CreateObjService.response(true, 'User not registered'));
                        }
                    });
                }
            });
        }
    });
});

router.post('/socialLogin', function(req, res) {
    getSocialDetails(req.body.socialLoginType, req.body.accessToken, function(userData) {
        if (userData) {
            var query = { facebookId: userData.id };
            if (req.body.socialLoginType == 2) query = { googleId: userData.id };
            User.findOne(query, function(err, user) {
                if (user) {
                        User.update({ _id: user.id }, {marketingSource:req.body.marketingSource}, function(err, update) {
                        
                            if (req.body.socialLoginType == 1) {
                            getFacebookFriendList(req.body.accessToken, user.id, function(friends) {
                                updateUserFriends(friends, user.id, function() {
                                    return res.json(CreateObjService.response(false, User.getUserObjApp(user)));
                                })
                            });
                        } else {
                            return res.json(CreateObjService.response(false, User.getUserObjApp(user)));
                        }
                    });
                } else {
                    var obj = {
                        userId: null,
                        firstName: userData.name,
                        emailId: userData.email,
                        phoneNumber: null,
                        gender: userData.gender,
                        accessToken: null,
                        phoneVerification: 0,
                        profilePic: userData.profilePic
                    };
                    return res.json(CreateObjService.response(false, obj));
                }
            });
        } else {
            return res.json(CreateObjService.response(true, 'Invalid accessToken'));
        }
    });
});

function updateUserFriends(friends, userId, callback) {
    UserFbFriend.remove({ userId: userId }, function(erm, d) {
        UserFbFriend.create(friends, function(err, d) {
            console.log(err);
            console.log(d);
            return callback();
        });
    });
}

router.get('/ss', function(req, res) {
    getFacebookFriendList("EAAEumq6snoUBAFEGJ5ysHXgqgZADFwSenHCQSN0ucaZAHX7UtZBsfTBKdlNfbZBXs3DAqccEHLlKZCB0ypktRPQEOdZBT2srrgNtTPwDRxf0kxVEwBddVxMzguJBv2puM6rTDlR5eBtxVNaCwAdpZBxbXMciPA7YMdHLdWPl0fpvuB1pJZCnW5svZC0KEXUO6zZB8MGbltD07PVG3BBddmhulJwZBSUAHP0Nk0ZD", "sda", function(e) {
        if (e.data) {
            var data = _.map(e.data, function(e) {
                return {
                    name: e.name,
                    facebookId: e.id,
                    userId: "userId",
                }
            });
            res.json(data);
        }
    });
})

function getFacebookFriendList(accesstoken, userId, callback) {
    var FB = require('fb');
    FB.api('me/friends', { limit: 100, access_token: accesstoken }, function(e) {
        if (e.data) {
            var data = _.map(e.data, function(e) {
                return {
                    name: e.name,
                    facebookId: e.id,
                    userId: userId,
                }
            });
            return callback(data);
        } else {
            return callback([]);
        }
    });
}

function getSocialDetails(socialLoginType, accessToken, callback) {
    if (socialLoginType == 1) {
        var FB = require('fb'),
            fb = new FB.Facebook({});
        // https://graph.facebook.com/me?access_token=EAAEumq6snoUBAKBZACtpSZAcLFibOZAW3tEhiwlRRo9CcOiIfBGDcl0tpQHJbp0CRhZBZA70M1vkT8fF6rha0nZCGRdMzFBMDGYdeU9F9NfBORZAUDyisZAdWT3DYaqkmeDZAwIi6y0gwZCMIAwjOZBJlvYZCHTo9uyE02OEbZCpDnDls8J6cn1ZCZAOVo7exXGl19FkbteQfU8zHmupBH1zPCDZBaCoZBJSOw78cXZAgZD&fields=id,name,email,picture,gender,timezone
        FB.api('me', { fields: ['id', 'name', 'email', 'picture', 'gender'], access_token: accessToken }, function(res) {
            console.log(res);
            if (!res.error) {
                return callback({
                    id: res.id,
                    name: res.name,
                    emailId: res.email,
                    gender: res.gender == 'male' ? 'M' : 'F',
                    profilePic: "https://graph.facebook.com/" + res.id + "/picture?type=large",
                });
            } else return callback(null);
        });
    } else {
        var request = require("request");
        request({ url: 'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' + accessToken, json: true }, function(error, res) {
            console.log(res.body);

            if (res.body.sub) {
                return callback({
                    id: res.body.sub,
                    name: res.body.name,
                    emailId: res.body.email,
                    gender: null,
                    profilePic: res.body.picture,
                });
            } else return callback(null);
        });
    }
}


router.get('/parlorPrice', function(req, res) {
    Appointment.find({ parlorId: "587088445c63a33c0af62727", status: 3, appointmentStartTime: { $gt: new Date(2017, 7, 11), $lt: new Date(2017, 7, 13, 23, 59, 59) } }, { serviceRevenue: 1, services: 1, productRevenue: 1, createdAt: 1 }, function(err, appointments) {
        var totalServiceRevenue = 0;
        var totalRevenueERP = 0;
        var productRevenueERP = 0;
        _.forEach(appointments, function(app) {
            totalRevenueERP += app.serviceRevenue;
            productRevenueERP += app.productRevenue;
            var tempR = 0;
            _.forEach(app.services, function(s) {
                var ser = Appointment.serviceFunction(app.createdAt, s, []);
                tempR += ser.totalRevenue;
            });
            console.log(tempR);
            totalServiceRevenue += tempR;
            console.log(app.serviceRevenue);
            console.log(app.id);
            console.log("---------------------------");
        });
        return res.json({ totalRevenueERP: totalRevenueERP, totalServiceRevenue: totalServiceRevenue, productRevenueERP: productRevenueERP });
    });
});

router.post('/user', function(req, res) {
    if (req.body.phoneNumber && !req.body.accessToken) {
        registerNewUser(req, function(response) {
            return res.json(response);
        });
    }else if (req.body.phoneNumber && req.body.accessToken && req.body.socialLoginType == 1) { // Facebook
        getSocialDetails(req.body.socialLoginType, req.body.accessToken, function(userData) {
            if (userData) {
                req.body.name = userData.name;
                req.body.gender = userData.gender;
                req.body.emailId = userData.emailId;
                req.body.profilePic = userData.profilePic;
                req.body.facebookId = userData.id;
                req.body.password = req.body.accessToken.substring(0, 10);
                registerNewUser(req, function(response) {
                    User.findOne({ phoneNumber: req.body.phoneNumber }, { name: 1 }, function(Err, newUser) {
                        getFacebookFriendList(req.body.accessToken, newUser.id, function(friends) {
                            updateUserFriends(friends, newUser.id, function() {
                                return res.json(response);
                            });
                        });
                    });
                });
            } else {
                res.json(CreateObjService.response(true, 'Invalid Fb access Token'));
            }
        });
    } else if (req.body.phoneNumber && req.body.accessToken && req.body.socialLoginType == 2) {
        getSocialDetails(req.body.socialLoginType, req.body.accessToken, function(userData) {
            if (userData) {
                req.body.name = userData.name;
                req.body.gender = req.body.gender;
                req.body.emailId = userData.emailId;
                req.body.profilePic = userData.profilePic;
                req.body.googleId = userData.id;
                req.body.password = req.body.accessToken.substring(0, 10);
                registerNewUser(req, function(response) {
                    return res.json(response);
                });
            } else {
                res.json(CreateObjService.response(true, 'Invalid google access Token'));
            }
        });
    } else {
        res.json(CreateObjService.response(true, 'Phone Number Required'));
    }
});


function getUserRegistrationUrl(name, phoneNumber, freeServices, mobile) {
    if (!mobile)
        return getSmsUrl('BEUSLN', 'Hi ' + name + ', Welcome to the world of Beauty Ninjas. Treat yourself with incredible beauty treatments and much more like never before.', [phoneNumber], 'T');
    else {
        return getSmsUrl('BEUSLN', 'Welcome to Be U Salons. As a welcome gift, avail 50% discount coupon (max Rs 500) on any services of your choice (Coupon expires in 24 hours).', [phoneNumber], 'T');
    }
}


function registerNewUser(req, callback) {
    var accessToken = require('crypto').createHash('sha1').update(req.body.firstName + (new Date()).valueOf().toString() + "dassda687%%^^").digest('base64');
    var now_date = new Date();
    now_date.setMonth(now_date.getMonth() + 1);
    var weekCoupon = now_date.setMonth(now_date.getMonth() + 2);
    if (req.body.phoneNumber.length == 10) {
        
        var password = require('crypto').createHash('sha1').update(req.body.password).digest('base64');
        
        User.findOne({ phoneNumber: req.body.phoneNumber }, function(err, user) {
            req.body.referCode = req.body.referCode ? req.body.referCode : '9045^&dsGJpC';
            User.findOne({ referCode: req.body.referCode }, function(err, user2) {
               
                var loyalityPoints = 0;
                
                if (user && user.password) {
                    return callback(CreateObjService.response(true, 'User already Registered'));
                } else if (user && !user.password) {
                    var updateObj = {
                        firstName: req.body.name,
                        emailId: req.body.emailId,
                        password: password,
                        profilePic: req.body.profilePic,
                        gender: req.body.gender,
                        accesstoken: accessToken,
                        facebookId: req.body.facebookId,
                        loyalityPoints: 0,
                        firstTimeVerified: 0,
                        referCodeBy: req.body.referCode,
                        googleId: req.body.googleId,
                        referCode: getReferCode(req.body.phoneNumber),
                        mobile: req.body.mobile ? req.body.mobile : 0,
                        freeHairCutBar: 0,
                    };
                    var mobile = req.body.mobile;
                    if (mobile) {
                        updateObj.$push = {};
                        // updateObj.loyalityPoints = 500;
                        // updateObj.freebieExpiry = now_date;
                        // updateObj.$push.creditsHistory = { createdAt: new Date(), amount: updateObj.loyalityPoints, balance: updateObj.loyalityPoints, source: null, reason: 'New Registration' };
                        if(req.body.referCode == "SSSEC70"  || req.body.referCode == "SSSBI"  || req.body.referCode == "SSSEC7" || req.body.referCode == "KKD7" || req.body.referCode == "VGH3" || req.body.referCode == "SSSEC57" || req.body.referCode == "SSCRS" || req.body.referCode == "SSMNH" || req.body.referCode == "SSSEC56" || req.body.referCode == "SSSBI"){
                          updateObj.$push.freeServices = { expires_at: now_date, createdAt: new Date(), categoryId: req.body.gender == "F" ? "58707ed90901cc46c44af279" : "58707ed90901cc46c44af27b", serviceId: user.gender == "F" ? "59520e3264cd9509caa273d2" : "58707eda0901cc46c44af2eb", code: req.body.gender == "F" ? 489 : 52, dealId: null, parlorId: null, noOfService: 1, price: req.body.gender == "F" ? 600 : 300, name: req.body.gender == "F" ? "Full Arms Waxing" : "Male Hair Cut", description: req.body.gender == "F" ? "Full Arms Waxing" : "Includes blowdry, shampoo and conditioner", discount: req.body.gender == "F" ? 300 : 150, source: "saloncard", brandId: req.body.gender == "F" ? "594b99fcb2c790205b8b7d93" : "", priceId: req.body.gender == "F" ? 489 : 52 };  
                          updateObj.freeHairCutBar = 0;
                        }
                        
                        /*updateObj.$push.couponCodeHistory = {$each : [{"active" : true,"offPercentage" : 50,"limit" : 500,"code" : "APP50","couponTitle" : "Get 50% Off","couponDescription" : "Use code APP50 for 50% flat","createdAt" : new Date(),"couponType" : 27,"expires_at" : HelperService.addDaysToDate2(1)}]};*/

                        // updateObj.$push.couponCodeHistory = { "active": true, "expires_at": weekCoupon, "couponType": 1, "code": "WEEK15", "createdAt": new Date() };
                    }
                    User.update({ phoneNumber: req.body.phoneNumber }, updateObj, function(err, update) {
                        if (update) {
                            return callback(CreateObjService.response(false, 'User registered'));
                        } else return callback(CreateObjService.response(true, 'Form Validation error'));
                    });

                } else {
                    var newUserObj = {
                        firstName: req.body.name,
                        gender: req.body.gender,
                        emailId: req.body.emailId,
                        phoneNumber: req.body.phoneNumber,
                        password: password,
                        profilePic: req.body.profilePic,
                        facebookId: req.body.facebookId,
                        googleId: req.body.googleId,
                        referCodeBy: req.body.referCode,
                        firstTimeVerified: 0,
                        accesstoken: accessToken,
                        freeServices: [],
                        customerId: 0,
                        referCode: getReferCode(req.body.phoneNumber),
                        mobile: req.body.mobile ? req.body.mobile : 0,
                        freeHairCutBar: 0,
                        // freebieExpiry: now_date,
                        // loyalityPoints: 500,
                        // creditsHistory: [{ createdAt: new Date(), amount: 500, balance: 500, source: null, reason: 'New Registration' }],
                        // couponCodeHistory: [{ "active": true, "expires_at": now_date, "couponType": 4, "code": "APP10", "createdAt": new Date() }, { "active": true, "expires_at": weekCoupon, "couponType": 1, "code": "WEEK15", "createdAt": new Date() }]
                        couponCodeHistory: []
                    };
                    var mobile = req.body.mobile;

                    if (mobile) {
                        newUserObj.couponCodeHistory.push({"active" : true,"offPercentage" : 50,"limit" : 500,"code" : "APP50","couponTitle" : "Get 50% Off","couponDescription" : "Use code APP50 for 50% flat","createdAt" : new Date(),"couponType" : 27,"expires_at" : HelperService.addDaysToDate2(1)});

                        if(req.body.referCode == "SSSEC70" || req.body.referCode == "SSSBI"   || req.body.referCode == "SSSEC7" || req.body.referCode == "KKD7" || req.body.referCode == "VGH3" || req.body.referCode == "SSSEC57" || req.body.referCode == "SSCRS" || req.body.referCode == "SSMNH" || req.body.referCode == "SSSEC56" || req.body.referCode == "SSSBI"){
                          newUserObj.freeServices = { expires_at: now_date, createdAt: new Date(), categoryId: req.body.gender == "F" ? "58707ed90901cc46c44af279" : "58707ed90901cc46c44af27b", serviceId: req.body.gender == "F" ? "59520e3264cd9509caa273d2" : "58707eda0901cc46c44af2eb", code: req.body.gender == "F" ? 489 : 52, dealId: null, parlorId: null, noOfService: 1, price: req.body.gender == "F" ? 600 : 300, name: req.body.gender == "F" ? "Full Arms Waxing" : "Male Hair Cut", description: req.body.gender == "F" ? "Full Arms Waxing" : "Includes blowdry, shampoo and conditioner", discount: req.body.gender == "F" ? 600 : 150, source: "saloncard", brandId: req.body.gender == "F" ? "594b99fcb2c790205b8b7d93" : "", priceId: req.body.gender == "F" ? 489 : 52 };  
                          newUserObj.freeHairCutBar = 0;
                        }

                        /*newUserObj.freeServices.push({ expires_at: now_date, createdAt: new Date(), categoryId: req.body.gender == "F" ? "58707ed90901cc46c44af279" : "58707ed90901cc46c44af27b", serviceId: req.body.gender == "F" ? "59520f3b64cd9509caa273ec" : "58707eda0901cc46c44af2eb", code: req.body.gender == "F" ? 502 : 52, dealId: null, parlorId: null, noOfService: 1, price: req.body.gender == "F" ? 600 : 300, name: req.body.gender == "F" ? "Classic Express Wax" : "Male Hair Cut", description: req.body.gender == "F" ? "Full Arms + Full Legs + Underarms" : "Includes blowdry, shampoo and conditioner", discount: req.body.gender == "F" ? 300 : 150, source: "download", brandId: req.body.gender == "F" ? "594b99fcb2c790205b8b7d93" : "", priceId: req.body.gender == "F" ? 502 : 52 });*/

                    }
                    User.findOne({}, {}, { sort: { 'customerId': -1 } }, function(err, s) {
                        if (!s) {
                            s = {};
                            s.customerId = 1;
                        }
                        newUserObj.customerId = s.customerId + 1;
                        var usermessage = getUserRegistrationUrl(req.body.name, req.body.phoneNumber, mobile);
                        User.create(newUserObj, function(err, newUser) {
                            
                            if (newUser) {
                                return callback(CreateObjService.response(false, 'User registered'));
                            } else
                                return callback(CreateObjService.response(true, 'Form Validation error'));
                        });
                    });

                }
            });
        });
    } else
        return callback(CreateObjService.response(true, 'Invalid Phone Number'));
};


function sendReferalNotification(user, type) {
    // var title = type == 1 ? '100 Freebie credited' : 'Loyality Points limit exceed';
    var title = type == 1 ? 'Referral Coupon Added' : 'Loyality Points limit exceed';
    var message = type == 1 ? 'Your friend has registered at Be U' : 'Referal Loyality Points limit exceed';
    User.findOne({ _id: user.id, $or: [{ firebaseId: { $ne: null } }, { firebaseIdIOS: { $ne: null } }] }).exec(function(err, user) {
        if (user) {
            Appointment.sendAppNotification(user.firebaseId, title, message, { type: 'freebie' }, function(err, response) {
                console.log("response from user registration");
                console.log(response);
                //empty
            });

            Appointment.sendAppNotificationIOS(user.firebaseIdIOS, title, message, null, 'freebie', function(err, response) {

            });
        }
    });
};


router.get('/convert', function(req, res) {
    return res.json(getReferCode(req.query.phoneNumber));
});

router.post('/createSalonMangerIncentive', function(req, res) {
    SalonManagerIncentive.create(SalonManagerIncentive.createManagerIncentiveObj(req), function(err, create) {
        if (err) {
            return res.json(CreateObjService.response(true, "Error"));
        } else {
            return res.json(CreateObjService.response(false, "Successfully Created"));
        }
    })
});

router.get('/createReferal', function(req, res) {
    User.find({}, function(err, users) {
        _.forEach(users, function(user) {
            User.update({ _id: user.id }, { referCode: getReferCode(user.phoneNumber) }, function(err, d) {
                console.log(err);
                console.log(d);
                console.log('user saved' + user.phoneNumber);
            });
        });
    });
});

router.get('/getUserDetailByPhoneNumber', function(req, res) {
    User.findOne({ phoneNumber: req.query.phoneNumber }, function(er, user) {
        if(!user){
            // User.create({firstName : "Unknown", source : "phone", gender : "F", phoneNumber : req.query.phoneNumber,emailId : "",  password : "dasdsadsadsadsa", accesstoken : "accesstokenasddsasdadsa&fffff21345" , phoneVerification: 1}, function(err, us){
                // return res.json(CreateObjService.response(false, User.getUserObjApp(us)));
                return res.json(CreateObjService.response(true, "User not registered"));
            // })

        }else{
            user.phoneVerification = 1;
            return res.json(CreateObjService.response(false, User.getUserObjApp(user)));
        }
    });
});

// Pofo
router.post('/createUserByPofo', function(req, res) {
    User.findOne({ phoneNumber: req.body.phoneNumber }, function(er, user) {
        if(!user){
            var accessToken = require('crypto').createHash('sha1').update(req.body.name + (new Date()).valueOf().toString() + "dassda687%%^^").digest('base64');
            User.create({firstName : req.body.name, gender : "F", phoneNumber : req.body.phoneNumber, emailId : req.body.emailId,  password : "dasdsadsadsadsa", accesstoken : accessToken, phoneVerification: 1}, function(err, us){
                return res.json(CreateObjService.response(false, User.getUserObjPofoApp(us)));
            })
        }else{
            return res.json(CreateObjService.response(false, User.getUserObjPofoApp(user)));
        }
    });
});


function getReferCode(phoneNumber) {
    phoneNumber = parseInt(phoneNumber);
    var reqString = '';
    var beuValue = 36;
    while (parseInt(phoneNumber / beuValue) != 0) {
        reqString += getCodeByPlace(phoneNumber % beuValue);
        phoneNumber = parseInt(phoneNumber / beuValue);
    }
    reqString += phoneNumber % beuValue;
    return reverseString(reqString);
}

function getCodeByPlace(index) {
    var o = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    // var o = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'];
    return o[index];
}

function reverseString(str) {
    var strArray = str.split("");
    strArray.reverse();
    var strReverse = strArray.join("");
    return strReverse;
}

router.post('/login', function(req, res) {
    if (req.body.phoneNumber && req.body.password) {
        var password = require('crypto').createHash('sha1').update(req.body.password).digest('base64');
        User.findOne({ phoneNumber: req.body.phoneNumber }, function(err, user) {
            if (user) {
                if (user.password == password && user.password != '' && user.password)
                    return res.json(CreateObjService.response(false, User.getUserObjApp(user)));
                else
                    return res.json(CreateObjService.response(true, 'Invalid password'));
            } else {
                return res.json(CreateObjService.response(true, 'Phone number not registered '));
            }
        });
    } else if (req.body.socialLoginType == 1 && req.body.fbAccessToken) {
        var facebookUrl = "https://graph.facebook.com/me?access_token=" + req.body.fbAccessToken;
        console.log(facebookUrl);
        var request = require("request");
        request({ url: facebookUrl, json: true }, function(error, data) {
            console.log(data);
            var facebookId = data.body.id;
            if (data) {
                // var query = {};
                // if (req.body.facebookId)
                //     query.facebookId = req.body.facebookId;
                // if (req.body.googleId) query.googleId = req.body.googleId;
                User.findOne({ facebookId: facebookId }, function(err, user1) {
                    console.log(user1);
                    if (user1) {
                        if (user1.facebookId == facebookId)
                            return res.json(CreateObjService.response(false, User.getUserObjApp(user1)));
                        else
                            return res.json(CreateObjService.response(true, 'User Not Registered'));
                    } else {
                        return res.json(CreateObjService.response(true, 'Phone Number Not Verified'));
                    }
                });
            }
        })
    } else if ((req.body.phoneNumber == '') && (req.body.password == '') && (req.body.accessToken != '')) {
        User.findOne({ accesstoken: req.body.accessToken }, function(err, user2) {
            if (user2) {
                return res.json(CreateObjService.response(false, User.getUserObjApp(user2)));
            } else {
                return res.json(CreateObjService.response(true, 'User not registered'));
            }
        });
    } else {
        res.json(CreateObjService.response(true, 'Phone Number and password Required'));
    }
});

function getSmsUrl(messageId, message, phoneNumbers, type) {
    return ParlorService.getSMSUrl(messageId, message, phoneNumbers, type);
}

function getSmsUrlForOtp(messageId, message, phoneNumbers, type, otp, retry) {
    return ParlorService.getSMSUrlForOtp(messageId, message, phoneNumbers, type, otp, retry);
}

function populateDeals(service, deals) {
    var d = [];
    _.forEach(deals, function(s) {
        if (_.some(s.services, function(ser) { return ser.serviceCode === service.serviceCode; })) {
            s.dealType.price = parseInt(s.dealType.price);
            var obj = {
                dealId: s.id,
                parlorDealId: s.dealId,
                name: s.name,
                category: s.category,
                description: s.description,
                menuPrice: parseInt(s.menuPrice),
                dealPrice: parseInt(s.dealPrice),
                tax: s.tax,
                dealPercentage: s.dealPercentage,
                weekDay: s.weekDay,
                dealType: s.dealType,
                couponCode: s.couponCode
            };
            if (s.menuPrice > 0) {
                d.push(obj);
            }
        }
    });
    return d;
}

function getParlorServiceAll(services, priceReq, deals, cb) {
    ServiceCategory.find({}).sort('sort').exec(function(err, categories) {
        var data = [];
        _.forEach(categories, function(category) {
            var fil = _.filter(services, function(s) { return s.categoryId == category.id && !s.dontShowInApp });
            fil = _.sortBy(fil, [function(o) { return o.sort; }]);
            var serviceByCategory = _.map(fil, function(s) {
                return {
                    name: s.name,
                    subTitle: s.subTitle,
                    nameOnApp: s.nameOnApp,
                    serviceId: s.serviceId,
                    subTitle: s.subTitle,
                    serviceCode: s.serviceCode,
                    deals: populateDeals(s, deals),
                    gender: s.gender,
                    prices: _.map(s.prices, function(p) {
                        return {
                            priceId: p.priceId,
                            name: p.name,
                            additions: _.map(p.additions, function(add) {
                                return {
                                    name: add.name,
                                    types: _.map(add.types, function(t) {
                                        return {
                                            name: t,
                                            percentageDifference: 0,
                                            additions: 0
                                        };
                                    })
                                }
                            })
                        };
                    })
                }
            });
            var cat = { name: category.name };
            cat.services = serviceByCategory;
            if (serviceByCategory.length > 0) data.push(cat);
        });
        return cb(data);
    });
}

function getParlorService(services, priceReq, deals, cb) {
    ServiceCategory.find({}).sort('sort').exec(function(err, categories) {
        var data = [];
        _.forEach(categories, function(category) {
            // var fil = _.filter(services, function(s) { return s.categoryId ==  category.id && s.serviceId && s.basePrice > 0});
            var fil = _.filter(services, function(s) { return s.categoryId == category.id && s.serviceId && !s.serviceId.dontShowInApp && s.basePrice > 0 });
            fil = _.sortBy(fil, [function(o) { return o.serviceId.sort; }]);
            var serviceByCategory = _.map(fil, function(s) {
                return {
                    name: s.name,
                    nameOnApp: s.serviceId.nameOnApp,
                    subTitle: s.serviceId.subTitle,
                    serviceId: s.serviceId.id,
                    serviceCode: s.serviceCode,
                    deals: populateDeals(s, deals),
                    gender: s.gender,
                    prices: _.map(s.prices, function(p) {
                        if (priceReq) {
                            return {
                                priceId: p.priceId,
                                name: p.name == "" ? "Creative Stylist" : p.name,
                                price: parseInt(p.price),
                                tax: p.tax,
                                estimatedTime: p.estimatedTime,
                                additions: p.additions
                            };
                        } else {
                            return {
                                priceId: p.priceId,
                                name: p.name == "" ? "Creative Stylist" : p.name,
                                additions: p.additions
                            };
                        }

                    })
                }
            });
            var cat = { name: category.name };
            cat.services = serviceByCategory;
            if (serviceByCategory.length > 0) data.push(cat);
        });
        return cb(data);
    });
}

function getThicknessObj(t) {
    return _.map(t, function(th) {
        return {
            name: th.name,
            lengths: _.map(th.lengths, function(l) {
                return {
                    name: l
                };
            })
        };
    });
}

var async = require('async');
router.post('/detectedFaces', function(req, res) {

    console.log(req.body.parlorId, req.body.faces)

    var temp = [];
    _.forEach(req.body.faces, function(r) {
        temp.push(r.id)
    });
    io.sockets.emit("detectedFace", { data: req.body });

    console.log("temp", temp)

    async.each(temp, function(s, callback) {

        DetectedFaces.aggregate([{ $unwind: "$faces" }, { $match: { "faces.id": s } }], function(err, result2) {
            console.log(result2)

            if (result2.length > 0) {
                console.log("found")
                callback();
            } else {
                console.log("not found")
                io.sockets.emit("detectedFace", { data: req.body });
                DetectedFaces.create({
                    parlorId: req.body.parlorId,
                    faces: req.body.faces
                }, function(err, result) {
                    if (err) console.log(err)
                    console.log("created", result)

                    callback();
                })


            }

        })

    }, function(done) {

        return res.json(CreateObjService.response(false, "done"));


    })




});





router.get('/sendFinalSettlement', function(req, res) {
    var nodemailer = require('nodemailer');
    var x = (req.query.period) - 1
    SettlementReport.findOne({ period: x }, { period: 1, createdAt: 1, endDate: 1 }).exec(function(err, settlement) {
        var startDate = settlement.endDate;
        var period = req.query.period;
        SettlementReport.find({ period: req.query.period, isMailSent: true }).exec(function(err, setts) {
            var endDate = setts[0].endDate
            async.each(setts, function(set, cb) {
                // SettlementReport.update({ _id: set._id }, { $set: { paidDate: new Date() } }, function(err, paiddate) {

                // })
                var totalCollectionByParlor = Math.floor(set.totalCollectionByParlor),
                    collectedByApp = Math.floor(set.collectedByApp),
                    collectedByAffiliates = Math.floor(set.collectedByAffiliates),
                    collectedByLoyalityPoints = Math.floor(set.collectedByLoyalityPoints)
                var labels = [
                    "Freebies Benefit : " + Math.floor(set.collectedByLoyalityPoints) + "",
                    "Cashback on App Transaction : " + Math.floor(set.refundFirstAppDigital + set.refundAppDigitalCash + set.refundAppDigitalOnline) + "",
                ]
                if (set.refundOnErp > 0) {
                    labels.push("Cashback on ERP : " + Math.floor(set.refundOnErp) + "")
                }
                if (set.discountOnPurchase > 0) {
                    labels.push("Product Discount : " + Math.floor(set.discountOnPurchase) + "")
                }
                var body1 = JSON.stringify({
                    "template": 'settlement-pie-chart',
                    "options": {
                        "data": {
                            "datasets": [{
                                    "data": [
                                        Math.floor(set.collectedByLoyalityPoints),
                                        Math.floor(set.refundOnErp),
                                        Math.floor(set.refundFirstAppDigital + set.refundAppDigitalCash + set.refundAppDigitalOnline),
                                        Math.floor(set.discountOnPurchase),
                                    ],
                                    "backgroundColor": [
                                        "#F7464A",
                                        "#46BFBD",
                                        "#FDB45C",
                                    ],
                                    "label": "Dataset 1"
                                }

                            ],
                            "labels": labels
                        },
                    }
                });

                var options = {
                    "url": 'https://charturl.com/short-urls.json?api_key=pak-fdbb1e17-e6a4-4646-bc68-8eb5785f1ff7',
                    "method": 'POST',
                    "headers": {
                        "Content-Type": "application/json",
                    },
                    "body": body1
                };

                request(options, function(err, response, body3) {
                    var resultImage2 = JSON.parse(body3)

                    var body = JSON.stringify({
                        "template": 'settlement-pie-chart',
                        "options": {
                            "data": {
                                "datasets": [{
                                        "data": [
                                            totalCollectionByParlor,
                                            collectedByApp,
                                            collectedByAffiliates,
                                            collectedByLoyalityPoints
                                        ],
                                        "backgroundColor": [
                                            "#F7464A",
                                            "#46BFBD",
                                            "#FDB45C",
                                            "#4D5360"
                                        ],
                                        "label": "Dataset 1"
                                    }

                                ],
                                "labels": [
                                    "Collected by Salon : " + totalCollectionByParlor + "",
                                    "Collected by Be U App : " + collectedByApp + "",
                                    "Collected by Be U Affiliates : " + collectedByAffiliates + "",
                                    "Collected by Be U Freebies : " + collectedByLoyalityPoints + ""
                                ]
                            }
                        }
                    });
                    var options = {
                        "url": 'https://charturl.com/short-urls.json?api_key=pak-fdbb1e17-e6a4-4646-bc68-8eb5785f1ff7',
                        "method": 'POST',
                        "headers": {
                            "Content-Type": "application/json",
                        },
                        "body": body
                    };
                    request(options, function(err, response, body2) {
                        var resultImage1 = JSON.parse(body2)
                        var number = ["8826345311"];
                        var serviceTax = set.amountPayableToBeuAfterDiscount * 0.15,
                            grossTax = set.amountPayableToBeuAfterDiscount * 1.15,
                            totalServiceTax = set.totalCollectionByBeu * 0.15,
                            totalGrossTax = set.totalCollectionByBeu * 1.15;
                        var d = set.endDate,
                            dateEnd = d.toDateString();
                        var periodDate = new Date(set.startDate.getTime() + 1000 * 60 * 5).toString().slice(0, 10) + " - " + set.endDate.toString().slice(0, 10);
                        var royalityPercentageService = 0;
                        var payableAmount = 0,
                            parlorEntityName = ""
                        if (set.royalityPercentageService == null) royalityPercentageService = "As per slab";
                        else royalityPercentageService = set.royalityPercentageService + "%";
                        if (set.netPayable > 0) {
                            payableAmount = "Payable to Be U Rs." + Math.floor(set.netPayable)
                        } else {
                            payableAmount = "Receivable from Be U Rs." + Math.floor(set.netPayable * -1)
                        }
                        if (set.parlorEntityName) {
                            parlorEntityName = set.parlorEntityName
                        } else {
                            parlorEntityName = "-"
                        }
                        var emailId = [],
                            beuEmail = [];
                        Admin.find({ parlorIds: set.parlorId, role: 7 }, { emailId: 1, phoneNumber: 1, otherEmailId: 1, otherPhoneNumber: 1 , firebaseId:1, role: 1, firebaseIdIOS :1}, function(err, admin) {
                            async.each(admin, function(ad, cb2) {
                                if (ad.otherEmailId && ad.otherPhoneNumber) {
                                    emailId.push(ad.emailId);
                                    emailId.push(ad.otherEmailId);
                                    number.push(ad.phoneNumber)
                                    number.push(ad.otherPhoneNumber)
                                    cb2();
                                } else {
                                    emailId.push(ad.emailId);
                                    number.push(ad.phoneNumber);
                                    cb2();
                                }
                            }, function() {


                                Beu.find({ parlorIds: set.parlorId, role: { $in: [1, 3, 5, 8, 11] } }, { emailId: 1, phoneNumber: 1 }, function(err, beu) {
                                        async.each(beu, function(b, cb3) {
                                            beuEmail.push(b.emailId);
                                            cb3();
                                        }, function() {


                                            Parlor.findOne({ _id: set.parlorId }, function(err, parlor) {
                                                    var rupee = 'http://res.cloudinary.com/dyqcevdpm/image/upload/c_scale,h_10,w_10/v1501864561/nGbfO_jsm94v.png'

                                                    var hideHtml = '  <tr>  ' +
                                                        '               <td style="width:70%;border:1px solid gray;padding-left: 20px;font-size:10px"><i> -Cash Back on ERP Revenue</i></td>  ' +
                                                        '               <td style="width:30%;border:1px solid gray;text-align:right;">' + Math.floor(set.refundOnErp) + '</td>' + '  ' +
                                                        '             </tr> '
                                                    if (set.refundOnErp == 0) {
                                                        hideHtml = '';
                                                    }
                                                    var hideHtml2 = '<tr>  ' +
                                                        '               <td style="width:70%;border:1px solid gray">Discount, if any</td>  ' +
                                                        '               <td style="width:30%;border:1px solid gray;text-align:right;">' + Math.floor(set.lessDiscount) + '</td>  ' +
                                                        '             </tr>'
                                                    if (set.lessDiscount == 0) {
                                                        hideHtml2 = '';
                                                    }
                                                    var hideHtml3 = '<tr> ' +
                                                        '                <td style="border-bottom:1px solid gray;">' +
                                                        '                <b>Cash Back on ERP</b>' +
                                                        '                <br>' +
                                                        '                 <b><img src=' + rupee + '>' + Math.floor(set.refundOnErp) + '</b></td>' +
                                                        '            </tr>'
                                                    if (set.refundOnErp == 0) {
                                                        hideHtml3 = '';
                                                    }
                                                    var comm = ' <tr>' +
                                                        '       <td style="width:50%;border:1px solid gray;padding-top:3%;padding-bottom:3%;"><b>Be Us Commission</b><br>' +
                                                        '           <b><img src=' + rupee + '> ' + Math.floor(set.amountPayableToBeu) + '</b></td>' +
                                                        '       <td style="width:50%;border:1px solid gray;padding-top:3%;padding-bottom:3%;"><b>Net Payout to Salon</b><br>' +
                                                        '            <b><img src=' + rupee + '>' + Math.floor(set.netPayable) + '</b></td>' +
                                                        '       </tr>'

                                                    if (set.serviceRevenue < set.amountPayableToBeu) {
                                                        comm = '';
                                                    }
                                                    var disOnPurchase = '<tr>' +
                                                        '<td style="width:70%;border:1px solid gray;padding-left:10px;text-align:center">c) PRODUCT DISCOUNT</td>' +
                                                        '<td style="width:30%;border:1px solid gray;text-align:center">' +
                                                        '<img src="https://ci5.googleusercontent.com/proxy/KG_gbYRhfobN9CREI2___Vkofs1POrINBFbPjKChtPyldRMCdeFvqcr8nhu3GqkYOSbUU3N4U5Jek4zq_R3CGEFBj9Q6EWRFr-ejYs_p8PnxshvTIBvG8b_wXPRaK9WgcyEz9fMzL-vh-Zlfj8OyzQhTSFK_=s0-d-e1-ft#http://res.cloudinary.com/dyqcevdpm/image/upload/c_scale,h_10,w_10/v1501864561/nGbfO_jsm94v.png" class="CToWUd">' +
                                                        Math.floor(set.discountOnPurchase) +
                                                        '<td></tr>'
                                                    if (set.discountOnPurchase < 1) {
                                                        disOnPurchase = '';
                                                    }
                                                    var disOnPurchase2 = '  <tr>' +
                                                        '                                                   <td style="">' +
                                                        '                                                   <b>Product Discount</b>' +
                                                        '                                                   <br>' +
                                                        '                                                   <b><img src=' + rupee + '>' + Math.floor(set.discountOnPurchase) + '</b>' +
                                                        '                                                   </td>' +
                                                        '                                               </tr>'
                                                    if (set.discountOnPurchase < 1) {
                                                        disOnPurchase2 = '';
                                                    }

                                                    //         emailId.push(parlorEmail.email)
                                                    if (set.status == 1) {
                                                        function sendEmail1() {
                                                            var transporter = nodemailer.createTransport('smtps://reports@beusalons.com:wx2t2Tr7pMrqnK2CIqwd3g@smtp.mandrillapp.com');
                                                            var mailOptions = {
                                                                from: 'reports@beusalons.com', // sender address
                                                                // to: ["nikitachauhan@beusalons.com"],
                                                                to: emailId,
                                                                cc: beuEmail,
                                                                html: '   <!DOCTYPE html>  ' +
                                                                    '   <html lang=en>  ' +
                                                                    '     ' +
                                                                    '   <head>  ' +
                                                                    '       <meta charset=UTF-8>  ' +
                                                                    '       <title>Settlement Mailer</title>  ' +
                                                                    '   </head>' + '  ' +
                                                                    '     ' +
                                                                    '   <body>  ' +
                                                                    '       <div style=width:80%;margin:auto>  ' +
                                                                    '           <div style=height:120px>  ' +
                                                                    '               <div style=float:left;width:200px;margin-top:2%;margin-left:2%;margin-bottom:2%;zoom:1.2><img alt="Beu salons" src="http://res.cloudinary.com/dyqcevdpm/image/upload/v1499860471/Master_BeU_Logo_June2017_zmsfwt.png" width=150></div>' + '  ' +
                                                                    '           </div><h3 style=width:100%;text-align:center>Settlement Report for ' + set.parlorName + ' for period ' + periodDate + '</h3>  ' + ' ' +
                                                                    '           <div style=" box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);transition: 0.3s;width: 98%;padding:10px;">' + '  ' +
                                                                    '               <table style="width:100%;border:2px solid gray;border-collapse:collapse;text-align:center">  ' +
                                                                    '                   <tr>  ' +
                                                                    '                       <th style="width:100%;border:1px solid gray;text-align:center;background-color: #bfbfbf;padding-top: 1%;padding-bottom: 1%;" colspan="2">Settlement Report</th>' + '  ' +
                                                                    '                   </tr>  ' +
                                                                    '                   <tr>  ' +
                                                                    '                       <td style="width:50%;border:1px solid gray"><b>Name of salon</b></td>  ' +
                                                                    '                       <td style="width:50%;border:1px solid gray"><b>' + set.parlorName + '</b></td>' + '  ' +
                                                                    '                   </tr>  ' +
                                                                    '                   <tr>  ' +
                                                                    '                       <td style="width:50%;border:1px solid gray">Entity name</td>  ' +
                                                                    '                       <td style="width:50%;border:1px solid gray">' + parlorEntityName + '</td>' + '  ' +
                                                                    '                   </tr>  ' +
                                                                    '                   <tr>  ' +
                                                                    '                       <td style="width:50%;border:1px solid gray">Address</td>  ' +
                                                                    '                       <td style="width:50%;border:1px solid gray">' + set.parlorAddress + '</td>' + '  ' +
                                                                    '                   </tr>  ' +
                                                                    '                   <tr>' + '  ' +
                                                                    '                       <td style="width:50%;border:1px solid gray">Period of Settlement</td>  ' +
                                                                    '                       <td style="width:50%;border:1px solid gray">' + periodDate + '</td>  ' +
                                                                    '                   </tr>' + '  ' +
                                                                    '               </table>  ' +
                                                                    '           </div>  ' +
                                                                    '           <!--Start of Graph Table-->' +
                                                                    '            <div style=" box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2)!important;transition: 0.3s!important;width:98%;padding:10px;">' +
                                                                    '            <div>' +
                                                                    '               <table style="width:100%;border:2px solid gray;border-collapse:collapse;text-align:center">' +
                                                                    '                   <tr>' +
                                                                    '                       <th  style="width:100%;border:1px solid gray;background-color: #bfbfbf;padding-top: 1%;padding-bottom: 1%;" colspan="2">Settlement Summary</th>' +
                                                                    '                   </tr>' +
                                                                    '                   <tr>' +
                                                                    '                       <td style="width:50%;">' +
                                                                    '                           <table style="width:100%;border:1px solid gray;border-collapse:collapse;text-align:center;margin-left: 3%;margin-top: 3%;margin-bottom: 3%;">' +
                                                                    '                               <tr>' +
                                                                    '                                   <th style="text-align:center;padding-top:3%;padding-bottom:3%;" colspan="2">' +
                                                                    '                                   <b>Settlement Period_Salon Revenue</b>' +
                                                                    '                                   <br>' +
                                                                    '                                   <b><img src=' + rupee + '>' + Math.floor(set.totalRevenue) + '</b>' +
                                                                    '                                   </th>' +
                                                                    '                               </tr>' +
                                                                    '                               <tr>' +
                                                                    '                                   <td style="width:50%;border:1px solid gray;padding-top:3%;padding-bottom:3%;"><b>Service Revenue</b><br>' +
                                                                    '                                       <b><img src=' + rupee + '>' + Math.floor(set.serviceRevenue) + '</b></td>' +
                                                                    '                                   <td style="width:50%;border:1px solid gray;padding-top:3%;padding-bottom:3%;"><b>Product Revenue</b><br>' +
                                                                    '                                       <b><img src=' + rupee + '>' + Math.floor(set.productRevenue) + '</b></td>' +
                                                                    '                               </tr>' + comm +
                                                                    '                           </table>' +
                                                                    '                       </td>' +
                                                                    '                       <td style="width:50%;"><img  src=' + resultImage1.short_url + ' alt="img" style="width:80%"></td>' +
                                                                    '                  </tr>' +
                                                                    '               </table>' +
                                                                    '           </div>' +
                                                                    '           </div>' +
                                                                    '                 ' +
                                                                    // '           <div style=" box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2)!important;transition: 0.3s!important;width:98%;padding:10px;">' +
                                                                    // '           <div>' +
                                                                    // '               <table style="width:100%;border:2px solid gray;border-collapse:collapse;text-align:center">' +
                                                                    // '                   <tr>' +
                                                                    // '                       <th  style="width:100%;border:1px solid gray;background-color: #bfbfbf;padding-top: 1%;padding-bottom: 1%;" colspan="2">Benefits To Salon</th>' +
                                                                    // '                   </tr>' +
                                                                    // '                   <tr>' +
                                                                    // '                       <td style="width:50%;"><img src=' + resultImage2.short_url + ' alt="img" style="width:100%"></td>' +
                                                                    // '                           <td style="width:50%;">' +
                                                                    // '                               <table style="width:94%;border:1px solid gray;border-collapse:collapse;text-align:center;margin-left: 3%;margin-top: 3%;margin-bottom: 3%;">' +
                                                                    // '                                   <tr>' +
                                                                    // '                                       <td style="width:50%;border:1px solid gray;padding-top:3%;padding-bottom:3%;">' +
                                                                    // '                                           <table style="width:100%;border-collapse:collapse;text-align:center">' +
                                                                    // '                                               <tr>' +
                                                                    // '                                                   <td style="border-bottom:1px solid gray;">' +
                                                                    // '                                                   <b>Freebies Benefit</b>' +
                                                                    // '                                                   <br>' +
                                                                    // '                                                   <b><img src=' + rupee + '>' + Math.floor(set.collectedByLoyalityPoints) + '</b>' +
                                                                    // '                                                   </td>' +
                                                                    // '                                               </tr>' +
                                                                    // '                                               <tr>' +
                                                                    // '                                                   <td style="border-bottom:1px solid gray;">' +
                                                                    // '                                                   <b>Cash Back on ERP</b>' +
                                                                    // '                                                   <br>' +
                                                                    // '                                                   <b><img src=' + rupee + '>' + Math.floor(set.refundOnErp) + '</b></td>' +
                                                                    // '                                               </tr>' +
                                                                    // '                                               <tr>' +
                                                                    // '                                                   <td style="">' +
                                                                    // '                                                   <b>Cash Back on App Transaction</b>' +
                                                                    // '                                                   <br>' +
                                                                    // '                                                   <b><img src=' + rupee + '>' + Math.floor(set.refundFirstAppDigital + set.refundAppDigitalCash + set.refundAppDigitalOnline) + '</b>' +
                                                                    // '                                                   </td>' +
                                                                    // '                                               </tr>' + disOnPurchase2 +

                                                                    // '                                            </table>' +
                                                                    // '                                       </td>' +
                                                                    // '                                       <td style="width:50%;border:1px solid gray;padding-top:3%;padding-bottom:3%;">' +
                                                                    // '                                           <b>Total Benefits</b>' +
                                                                    // '                                           <br>' +
                                                                    // '                                           <b><img src=' + rupee + '>' + Math.floor(set.discountOnPurchase + set.refundOnErp + set.refundFirstAppDigital + set.refundAppDigitalCash + set.refundAppDigitalOnline + set.collectedByLoyalityPoints) + '</b>' +
                                                                    // '                                       </td>' +
                                                                    // '                                   </tr>' +
                                                                    // '                               </table>' +
                                                                    // '                           </td>' +
                                                                    // '                       </tr>' +
                                                                    // '                   </table>' +
                                                                    // '               </div>' +
                                                                    // '           </div>' +
                                                                    '           <!--Start of right table-->  ' +
                                                                    '           <div style="width:46%;padding:10px;float:left">  ' +
                                                                    '               <div style=" box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);transition: 0.3s;margin-top:10px;">' + '  ' +
                                                                    '                   <table style="width:100%;border:2px solid gray;border-collapse:collapse;text-align:center">  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:100%;border:1px solid gray;background-color: #bfbfbf;padding-top: 1%;padding-bottom: 1%;" colspan=2>  ' + '  ' +
                                                                    '                               <b>Revenue Summary</b></tr>  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <th style="width:70%;border:1px solid gray">Particulars</th>  ' +
                                                                    '                           <th style="width:30%;border:1px solid gray">Amount</th>  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:70%;border:1px solid gray">Service Revenue</td>' + '  ' +
                                                                    '                           <td style="width:30%;border:1px solid gray"><img src=' + rupee + '>' + Math.floor(set.serviceRevenue) + '</td>  ' +
                                                                    '                           <tr>  ' +
                                                                    '                               <td style="width:70%;border:1px solid gray">Product Revenue</td>' + '  ' +
                                                                    '                               <td style="width:30%;border:1px solid gray"><img src=' + rupee + '>' + Math.floor(set.productRevenue) + '</td>  ' +
                                                                    '                               <tr>  ' +
                                                                    '                                   <td style="width:70%;border:1px solid gray"><b>Total Revenue</b></td>' + '  ' +
                                                                    '                                   <td style="width:30%;border:1px solid gray"><b><img src=' + rupee + '>' + Math.floor(set.totalRevenue) + '</b></td>  ' +
                                                                    '                   </table>  ' +
                                                                    '               </div>  ' +
                                                                    '               <div style=" box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);transition: 0.3s;margin-top:25px;">' + '  ' +
                                                                    '                   <table style="width:100%;border:2px solid gray;border-collapse:collapse;text-align:center">  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:100%;border:1px solid gray;background-color: #bfbfbf;padding-top: 1%;padding-bottom: 1%;" colspan="2"><b>Collection Summary</b></td>' + '  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <th style="width:70%;border:1px solid gray">Particulars</th>  ' +
                                                                    '                           <th style="width:30%;border:1px solid gray">Amount</th>  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:70%;border:1px solid gray;text-align:center;">Collected By Salon</td>' + '  ' +
                                                                    '                           <td style="width:30%;border:1px solid gray;text-align:center;"><img src=' + rupee + '>' + Math.floor(set.totalCollectionByParlor) + '</td>  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:70%;border:1px solid gray;text-align:center;">Collected by Be U</td>' + '  ' +
                                                                    '                           <td style="width:30%;border:1px solid gray;text-align:center;"><img src=' + rupee + '>' + Math.floor(set.totalCollectionByBeu) + '</td>  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:70%;border:1px solid gray;text-align:right;padding-right:12px;font-size:10px;"><i>Through App/Website<i></td>' + '  ' +
                                                                    '                           <td style="width:30%;border:1px solid gray;text-align:center;"><img src=' + rupee + '>' + Math.floor(set.collectedByApp) + '</td>  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:70%;border:1px solid gray;text-align:right;padding-right:37px;font-size:10px;"><i>Through Affiliates</i></td>' + '  ' +
                                                                    '                           <td style="width:30%;border:1px solid gray;text-align:center;"><img src=' + rupee + '>' + Math.floor(set.collectedByAffiliates) + '</td>  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:70%;border:1px solid gray;text-align:right;padding-right:41px;font-size:10px;"><i>Through Loyality</i></td>' + '  ' +
                                                                    '                           <td style="width:30%;border:1px solid gray;text-align:center;"><img src=' + rupee + '>' + Math.floor(set.collectedByLoyalityPoints) + '</td>  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:70%;border:1px solid gray;text-align:center;"><b>Total Collection</b></td>' + '  ' +
                                                                    '                           <td style="width:30%;border:1px solid gray;text-align:center;"><b><img src=' + rupee + '>' + Math.floor(set.totalCollection) + '</b></td>  ' +
                                                                    '                       </tr>  ' +
                                                                    '                   </table>  ' +
                                                                    '               </div>  ' +

                                                                    '           </div>  ' +
                                                                    '           <!--End of right table-->  ' +
                                                                    '           <!--start of right table-->  ' +
                                                                    '           <div style="width:50%;float:left;margin-top:19px;padding-left: 0.5%;">  ' +
                                                                    '               <div style=" box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);transition: 0.3s;">' + '  ' +
                                                                    '                   <table style="width:100%;border:2px solid gray;border-collapse:collapse;text-align:left">  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:100%;border:1px solid gray;text-align:center;background-color: #bfbfbf;padding-top: 1%;padding-bottom: 1%;" colspan=2>' + '  ' +
                                                                    '                               <b>Be U Payout</b></tr>  ' +
                                                                    '                        <tr>  ' +
                                                                    '                           <th style="width:70%;border:1px solid gray;text-align:center">Particulars</th>  ' +
                                                                    '                           <th style="width:30%;border:1px solid gray;text-align:center">Amount</th>  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <tr>    ' +
                                                                    '                       <td style="width:70%;border:1px solid gray;text-align:center">Amount Collected by Be U</td>  ' +
                                                                    '                       <td style="width:30%;border:1px solid gray;text-align:center;"><img src=' + rupee + '>' + Math.floor(set.collectedByAffiliates + set.collectedByApp - set.onlinePaymentFee - set.onlinePaymentFeeTax) + '</td>' + '  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <tr>  ' +
                                                                    '                       <td style="width:70%;border:1px solid gray;text-align:center">Online Payment Fee</td>  ' +
                                                                    '                       <td style="width:30%;border:1px solid gray;text-align:center;"><img src=' + rupee + '>' + Math.floor(set.onlinePaymentFee) + '</td>' + '  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <tr>  ' +
                                                                    '                       <td style="width:70%;border:1px solid gray;text-align:center">Online Payment Fee Tax</td>  ' +
                                                                    '                       <td style="width:30%;border:1px solid gray;text-align:center;"><img src=' + rupee + '>' + Math.floor(set.onlinePaymentFeeTax) + '</td>' + '  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <tr>  ' +
                                                                    '                       <td style="width:70%;border:1px solid gray;text-align:center">Total Amount Collected by Be U</td>  ' +
                                                                    '                       <td style="width:30%;border:1px solid gray;text-align:center;"><img src=' + rupee + '>' + Math.floor(set.collectedByAffiliates + set.collectedByApp - set.onlinePaymentFee - set.onlinePaymentFeeTax) + '</td>' + '  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:70%;border:1px solid gray;text-align:center;padding-right:6%;">Salon Benefits by Be U</td>  ' +
                                                                    '                           <td style="width:30%;border:1px solid gray;text-align:center;"></td>' + '  ' +
                                                                    '                       </tr>  ' +
                                                                    // '                       <tr>  ' +
                                                                    // '                           <td style="width:70%;border:1px solid gray;padding-right:15%;text-align:center"> a)Cash Back</td>  ' +
                                                                    // '                           <td style="width:30%;border:1px solid gray;text-align:center;"></td>' + '  ' +
                                                                    // '                       </tr>  ' +
                                                                    // '                       <tr>  ' +
                                                                    // '                           <td style="width:70%;border:1px solid gray;padding-left: 31px;text-align:center;font-size:10px;"> <i>-Cash Back on ERP_Revenue</i></td>  ' +
                                                                    // '                           <td style="width:30%;border:1px solid gray;text-align:center;text-align:center"><img src=' + rupee + '>' + Math.floor(set.refundOnErp) + '</td>' + '  ' +
                                                                    // '                       </tr>  ' +
                                                                    // '                       <tr>  ' +
                                                                    // '                           <td style="width:70%;border:1px solid gray;padding-left: 39px;text-align:center;font-size:10px;"><i>-Cash Back on App_Transaction</i></td>  ' +
                                                                    // '                           <td style="width:30%;border:1px solid gray;text-align:center;"><img src=' + rupee + '>' + Math.floor(set.refundFirstAppDigital + set.refundAppDigitalCash + set.refundAppDigitalOnline) + '</td>  ' +
                                                                    // '                       </tr>' + '  ' +
                                                                    // '                       <!--<tr>-->  ' +
                                                                    // '                           <!--<td style="width:70%;border:1px solid gray;text-align:center">b) Be U Purcahse Scheme Benefits</td>-->  ' +
                                                                    // '                           <!--<td style="width:30%;border:1px solid gray;text-align:center;">&#45;&#45;&#45;&#45;</td>' + '-->  ' +
                                                                    // '                       <!--</tr>-->  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:70%;border:1px solid gray;padding-left: 10px;text-align:center;">Freebies Benefits</td>  ' +
                                                                    '                           <td style="width:30%;border:1px solid gray;text-align:center;"><img src=' + rupee + '>' + Math.floor(set.collectedByLoyalityPoints) + '</td>  ' +
                                                                    '                       </tr>' + disOnPurchase +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:70%;border:1px solid gray;text-align:center;"><b>Total Salon Benefits by Be U </b></td>  ' +
                                                                    '                           <td style="width:30%;border:1px solid gray;text-align:center;"><img src=' + rupee + '>' + Math.floor(set.discountOnPurchase + set.collectedByLoyalityPoints + set.refundFirstAppDigital + set.refundAppDigitalCash + set.refundAppDigitalOnline + set.refundOnErp) + '</td>' + '  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <!--<tr>-->  ' +
                                                                    '                           <!--<td style="width:70%;border:1px solid gray;text-align:center;"><b>Grand Total {A+B}</b></td>-->  ' +
                                                                    '                           <!--<td style="width:30%;border:1px solid gray;text-align:center;">&#45;&#45;&#45;&#45;</td>' + '-->  ' +
                                                                    '                       <!--</tr>-->  ' +
                                                                    '                   </table>  ' +
                                                                    '               </div>  ' +
                                                                    '               <div style=" box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);transition: 0.3s;margin-top:21px;">  ' +
                                                                    '                   <table style="width:100%;border:2px solid gray;border-collapse:collapse;text-align:left">' + '  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:100%;border:1px solid gray;text-align:center;background-color: #bfbfbf;padding-top: 1%;padding-bottom: 1%;" colspan="2"><b>Salons Payout</b></td>  ' +
                                                                    '                       </tr>  ' +
                                                                    '                        <tr>  ' +
                                                                    '                           <th style="width:70%;border:1px solid gray;text-align:center">Particulars</th>  ' +
                                                                    '                           <th style="width:30%;border:1px solid gray;text-align:center">Amount</th>  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:70%;border:1px solid gray;text-align:center">Amount payable to Be U</td>' + '  ' +
                                                                    '                           <td style="width:30%;border:1px solid gray;text-align:center;"><img src=' + rupee + '>' + Math.floor(set.amountPayableToBeu) + '</td>  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:70%;border:1px solid gray;font-size:12px;"><b>Final Amount Payable to Salon/(Be U)</b></td>' + '  ' +
                                                                    '                           <td style="width:30%;border:1px solid gray;text-align:center;"><b><img src=' + rupee + '>' + Math.floor(set.netPayable) + '</b></td>  ' +
                                                                    '                       </tr>  ' +
                                                                    // '                       <td style="width:70%;border:1px solid gray">Less: Discount</td>  '  +
                                                                    // '                       <td style="width:30%;border:1px solid gray;text-align:center;">'+Math.floor(set.lessDiscount)+'</td>' + '  '  +
                                                                    // '                       <tr>  '  +
                                                                    // '                           <td style="width:70%;border:1px solid gray">Amount payable to Be U(After Discount)</td>  '  +
                                                                    // '                           <td style="width:30%;border:1px solid gray;text-align:center;">'+Math.floor(set.amountPayableToBeuAfterDiscount)+'</td>' + '  '  +
                                                                    // '                       </tr>  '  +
                                                                    // '                       <tr>  '  +
                                                                    // '                           <td style="width:50%;border:1px solid gray">Add: CGST @ 9%</td>  '  +
                                                                    // '                           <td style="border:1px solid gray;text-align:center;">'+Math.floor(set.amountPayableToBeuAfterDiscount*.09)+'</td>  '  +
                                                                    // '                       </tr>  '  +
                                                                    // '                       <tr>  '  +
                                                                    // '                           <td style="width:70%;border:1px solid gray">Add: SGST @ 9%</td>' + '  '  +
                                                                    // '                           <td style="width:30%;border:1px solid gray;text-align:center;">'+Math.floor(set.amountPayableToBeuAfterDiscount*.09)+'</td>  '  +
                                                                    // '                       </tr>  '  +
                                                                    // '                       <tr>  '  +
                                                                    // '                           <td style="width:70%;border:1px solid gray"><b>Total Amount Payable to Be U(Incl. Taxes)</b></td>' + '  '  +
                                                                    // '                           <td style="width:30%;border:1px solid gray;text-align:center;">'+Math.floor(set.amountPayableToBeuAfterTax)+'</td>  '  +
                                                                    // '                       </tr>  '  +
                                                                    '                   </table>  ' +
                                                                    '               </div>  ' +
                                                                    // '               <div style=" box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);transition: 0.3s;margin-top:5px;">' + '  '  +
                                                                    // '                   <table style="width:100%;border:1px solid gray;border-collapse:collapse;text-align:left">  '  +
                                                                    // // '                       <tr>  '  +
                                                                    // // '                           <td style="width:70%;border:1px solid gray">Net amount payable to Salon</td>' + '  '  +
                                                                    // // '                           <td style="width:30%;border:1px solid gray">'+Math.floor(set.netPayable)+'</td>  '  +
                                                                    // // '                       </tr>  '  +
                                                                    // // '                       <tr>  '  +
                                                                    // // '                           <td style="width:70%;border:1px solid gray">Previous balance outstanding </td>  '  +
                                                                    // // '                           <td style="width:30%;border:1px solid gray;text-align:center;">'+Math.floor(set.amountPayableToBeuAfterTax)+'</td>' + '  '  +
                                                                    // // '                       </tr>  '  +
                                                                    // '                       <tr>  '  +
                                                                    // '                           <td style="width:50%;border:1px solid gray">Final Amount Payable to Salon/(Be U)</td>  '  +
                                                                    // '                           <td style="border:1px solid gray;text-align:center;">'+Math.floor(set.netPayable)+'</td>  '  +
                                                                    // '                       </tr>  '  +
                                                                    // '                   </table>' + '  '  +
                                                                    // '               </div>  '  +
                                                                    '           </div>  ' +
                                                                    '               <div style="width:98%; box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);transition: 0.3s;margin-top:35%;padding: 10px;">' + '  ' +
                                                                    '                   <table style="width:100%;border:2px solid gray;border-collapse:collapse;text-align:left">  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:100%;border:1px solid gray;text-align:center;background-color: #bfbfbf;padding-top: 1%;padding-bottom: 1%;" colspan="2"><b>Final Settlement Terms</b></td>' + '  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <th style="width:70%;border:1px solid gray;text-align:center;">Particulars</th>  ' +
                                                                    '                           <th style="width:30%;border:1px solid gray;text-align:center;">Amount</th>' + '  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:70%;border:1px solid gray;text-align:center;">Royalty %age_Service Revenue</td>  ' +
                                                                    '                           <td style="width:30%;border:1px solid gray;text-align:center;">' + set.royalityPercentageService + '%</td>' + '  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:70%;border:1px solid gray;text-align:center;">Royalty %age_Product Sale</td>  ' +
                                                                    '                           <td style="width:30%;border:1px solid gray;text-align:center;">' + set.royalityPercentageProduct + '%</td>' + '  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:70%;border:1px solid gray;text-align:center;">Discount, if any</td>  ' +
                                                                    '                           <td style="width:30%;border:1px solid gray;text-align:center;">' + Math.floor(set.lessDiscount) + '%</td>  ' +
                                                                    '                       </tr>' + '  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:70%;border:1px solid gray;text-align:center;">Minimum Guarantee</td>  ' +
                                                                    '                           <td style="width:30%;border:1px solid gray;text-align:center;"><img src=' + rupee + '>' + parlor.minimumGuarantee + '</td>  ' +
                                                                    '                       </tr>' + '  ' +
                                                                    '                   </table>  ' +
                                                                    '               </div>  ' +
                                                                    // '           <div style=" box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);transition: 0.3s;width:98%;margin-top:1%;padding: 10px;">  ' +
                                                                    // '               <table style="width:100%;border:2px solid gray;border-collapse:collapse;text-align:center">' + '  ' +
                                                                    // '                   <tr>  ' +
                                                                    // '                       <th style="width:100%;border:1px solid gray;background-color: #bfbfbf;padding-top: 1%;padding-bottom: 1%;" colspan="2">Benefits to Salon by Be U - Summary</th>  ' +
                                                                    // '                   </tr>  ' +
                                                                    // '                        <tr>  ' +
                                                                    // '                           <th style="width:70%;border:1px solid gray">Particulars</th>  ' +
                                                                    // '                           <th style="width:30%;border:1px solid gray">Amount</th>  ' +
                                                                    // '                       </tr>  ' +
                                                                    // '                   <tr>  ' +
                                                                    // '                       <td style="width:70%;border:1px solid gray">Freebies_Payout_July 2017_Till Date</td>' + '  ' +
                                                                    // '                       <td style="width:30%;border:1px solid gray"><img src=' + rupee + '>' + Math.floor(set.freebiesPayoutJulyTillDate) + '</td>  ' +
                                                                    // '                   </tr>  ' +
                                                                    // '                   <td style="width:50%;border:1px solid gray">Freebies_Payout_Since Joining</td>  '  +
                                                                    // '                   <td style="width:50%;border:1px solid gray">'+Math.floor(set.freebiesPayoutSinceJoining)+'</td>  '  +
                                                                    // '                   <tr>' + '  ' +
                                                                    // '                       <td style="width:70%;border:1px solid gray">Cash Back on ERP & App_Payout_July 2017_Till Date</td>  ' +
                                                                    // '                       <td style="width:30%;border:1px solid gray"><img src=' + rupee + '>' + Math.floor(set.cashBackErpAndAppPayoutJulyTillDate) + '</td>' + '  ' +
                                                                    // '                   </tr>    <tr>  ' +
                                                                    // '                       <td style="width:70%;border:1px solid gray"><b>Grand Total_Benefits_July 17_Till Date</b></td>' + '  ' +
                                                                    // '                       <td style="width:30%;border:1px solid gray"><b><img src=' + rupee + '>' + Math.floor(set.freebiesPayoutJulyTillDate + set.cashBackErpAndAppPayoutJulyTillDate) + '</b></td>  ' +
                                                                    // '                   </tr>  ' +
                                                                    // '                   <tr>  '  +
                                                                    // '                       <td style="width:50%;border:1px solid gray">Grand Total_Benefits_Since Joining</td>  '  +
                                                                    // '                       <td style="width:50%;border:1px solid gray">'+Math.floor(set.freebiesPayoutSinceJoining+set.cashBackErpAndAppPayoutSinceJoining)+'</td>' + '  '  +
                                                                    // '                   </tr>  '  +
                                                                    // '               </table>  ' +
                                                                    // '           </div>  ' +
                                                                    // '            end right table  '  +
                                                                    '       </div>  ' +
                                                                    '   </body>  ' +
                                                                    '     ' +
                                                                    '  </html>  ',
                                                                // to: emailId,
                                                                // cc: beuEmail,// list of receivers
                                                                // html:'<!DOCTYPE html><html lang=en><meta charset=UTF-8><title>Settlement Mailer</title><div style=width:60%;margin:auto><div style=background-color:#dfdfdf;height:120px><div style=float:left;width:200px;margin-top:2%;margin-left:2%;margin-bottom:2%;zoom:1.2><img alt="Beu salons"src=http://res.cloudinary.com/dyqcevdpm/image/upload/v1491484496/beu-logo_srvetg.png width=150></div></div><div><h3 style=width:100%;text-align:center>Settlement Report for '+set.parlorName+' for period '+periodDate+'</h3><table style="width:100%;border:1px solid gray;border-collapse:collapse;text-align:center"><tr><td style="width:50%;border:1px solid gray">Name of salon<td style="width:50%;border:1px solid gray">'+set.parlorName+'<tr><td style="width:50%;border:1px solid gray">Entity name<td style="width:50%;border:1px solid gray">'+parlorEntityName+'<tr><td style="width:50%;border:1px solid gray">Address<td style="width:50%;border:1px solid gray">'+set.parlorAddress+'<tr><td style="width:50%;border:1px solid gray">Date of Settlement<td style=width:50%>'+dateEnd+'<tr><td style="width:50%;border:1px solid gray">Period of Settlement<td style="width:50%;border:1px solid gray">'+periodDate+'</table></div><div><h3 style=width:100%;text-align:center>Service Revenue</h3><table style="width:100%;border:1px solid gray;border-collapse:collapse;text-align:center"><tr><td style="width:50%;border:1px solid gray">Service Revenue<td style="width:50%;border:1px solid gray">'+Math.floor(set.serviceRevenue)+'<tr><td style="width:50%;border:1px solid gray">Product Revenue<td style="width:50%;border:1px solid gray">'+Math.floor(set.productRevenue)+'<tr><td style="width:50%;border:1px solid gray">Total Revenue<td style="width:50%;border:1px solid gray">'+Math.floor(set.totalRevenue)+'</table></div><div><h3 style=width:100%;text-align:center>Membership Revenue</h3><table style="width:100%;border:1px solid gray;border-collapse:collapse;text-align:center"><tr><td style="width:50%;border:1px solid gray">Membership Sold<td style="width:50%;border:1px solid gray">'+set.membershipSold+'</table></div><div><h3 style=width:100%;text-align:center>Collection Summary</h3><table style="width:100%;border:1px solid gray;border-collapse:collapse;text-align:center"><tr><td style="width:50%;border:1px solid gray;text-align:left;padding-left:5%">Collected By Salon<td style="width:50%;border:1px solid gray">'+Math.floor(set.totalCollectionByParlor)+'<tr><td style="width:50%;border:1px solid gray;text-align:left;padding-left:5%">Collected by Be U<td style="width:50%;border:1px solid gray">'+Math.floor(set.totalCollectionByBeu)+'<tr><td style="width:50%;border:1px solid gray">Through App/Website<td style="width:50%;border:1px solid gray;padding-left:4%">'+Math.floor(set.collectedByApp)+'<tr><td style="width:50%;border:1px solid gray;padding-right:3%">Through Affiliates<td style="width:50%;border:1px solid gray;padding-left:4%">'+Math.floor(set.collectedByAffiliates)+'<tr><td style="width:50%;border:1px solid gray;padding-right:4%">Through Loyality<td style="width:50%;border:1px solid gray;padding-left:4%">'+Math.floor(set.collectedByLoyalityPoints)+'<tr><td style="width:50%;border:1px solid gray;text-align:left;padding-left:5%">Total Collection<td style="width:50%;border:1px solid gray">'+Math.floor(set.totalCollection)+'</table></div><div><h3 style=width:100%;text-align:center>Model Summary</h3><table style="width:100%;border:1px solid gray;border-collapse:collapse;text-align:center"><tr><td style="width:50%;border:1px solid gray">Royalty Percentage-Service<td style="width:50%;border:1px solid gray">'+royalityPercentageService+'<tr><td style="width:50%;border:1px solid gray">Royalty Percentage-Product<td style="width:50%;border:1px solid gray">'+set.royalityPercentageProduct+'%<tr><td style="width:50%;border:1px solid gray">Discount Percentage<td style="width:50%;border:1px solid gray">'+set.discountPercentage+'%</table></div><div><h3 style=width:100%;text-align:center>Final Settlement Summary</h3><table style="width:100%;border:1px solid gray;border-collapse:collapse;text-align:center"><tr><td style="width:100%;border:1px solid gray"colspan=2><b>Be U Payout</b>' +
                                                                // '<tr><td style="width:50%;border:1px solid gray">Amount Payable to Be U (incl GST)<td style="width:50%;border:1px solid gray">'+Math.floor(set.amountPayableToBeu)+'' +
                                                                // '<tr><td style="width:50%;border:1px solid gray">Amount Payable to Be U(After Discount)<td style="width:50%;border:1px solid gray">'+Math.floor(set.amountPayableToBeu-set.refundAppDigitalCash-set.refundAppDigitalOnline-set.refundOnErp )+
                                                                // '<tr><td style="width:100%;border:1px solid gray"colspan=2><b>Salon Payout</b>' +
                                                                // '<tr><td style="width:50%;border:1px solid gray">' + 'Amount Collected by Be U<td style="width:50%;border:1px solid gray">'+Math.floor(set.totalCollectionByBeu)+
                                                                // '<tr><td style="width:50%;border:1px solid gray">' + 'Amount Refund on App Digital transaction<td style="width:50%;border:1px solid gray">'+Math.floor(set.refundAppDigitalCash+set.refundAppDigitalOnline)+
                                                                // '<tr><td style="width:50%;border:1px solid gray">' + 'Amount Refund on Erp transaction<td style="width:50%;border:1px solid gray">'+Math.floor(set.refundOnErp)+
                                                                // '<tr><td style="width:50%;border:1px solid gray">Gross Amount(Recevable from BeU)<td style="border:1px solid gray">'+Math.floor(set.totalCollectionByBeu+set.refundOnErp+set.refundAppDigitalCash+set.refundAppDigitalOnline)+'</table></div><div style=padding-top:2%><table style="width:100%;border:1px solid gray;border-collapse:collapse;text-align:center"><tr><td style="width:50%;border:1px solid gray">Net Amount Payable to BeU/(Receivable from BeU)<td style="width:50%;border:1px solid gray">'+Math.floor(set.netPayable)+'</table></div></div><div style=padding-top:2%><table style="width:100%;border:1px solid gray;border-collapse:collapse;text-align:center"><tr><td style="width:50%;border:1px solid gray">Previous balance outstanding - Payable to Be U<td style="width:50%;border:1px solid gray">'+set.previousPendingAmount+'<tr><td style="width:50%;border:1px solid gray">Less: Adjusted against current period dues<td style="width:50%;border:1px solid gray">'+((set.previousPendingAmount - set.pendingAmount) <0 ? 0 : (set.previousPendingAmount-set.pendingAmount))+'<tr><td style="width: 50%;border: 1px solid gray;"> Add: Current Period dues payable to Be U<td style="width: 50%;border: 1px solid gray;">'+set.pendingAmount+'<tr><td style="width:50%;border:1px solid gray">Balance outstanding<td style="width:50%;border:1px solid gray">'+set.pendingAmount+'</table></div><div style=padding-top:2%><table style="width:100%;border:1px solid gray;border-collapse:collapse;text-align:center"><tr><td style="width:50%;border:1px solid gray">Net Amount to be transferred<td style="width:50%;border:1px solid gray">'+Math.floor(set.netAmountTransferred)+'</table></div>',
                                                                subject: 'Settlement Report' // Subject line
                                                            };
                                                            transporter.sendMail(mailOptions, function(error, info) {
                                                                if (error)
                                                                    console.log(error);
                                                                else {
                                                                    console.log('Message sent: ' + info.response);
                                                                    SettlementReport.update({ _id: set.id }, { paidDate: new Date() }, function(err, settleUpdate) {
                                                                        if (!err)
                                                                            console.log('paidDate Updated')
                                                                        else
                                                                            console.log('there is some error')
                                                                    })
                                                                }
                                                                // return res.json(CreateObjService.response(false, "Mail sent successfully!"));
                                                            });
                                                        }

                                                        sendEmail1();


                                                        var date2 = new Date().toDateString();


                                                        var message= "Dear " + set.parlorName + ", Your settlement report for the period " + periodDate + " has been generated successfully. Please check your email. Gross amount receivable- Rs." + Math.floor(set.totalCollectionByBeu) + " , Amount Payable (Inclusive of taxes)- Rs." + Math.floor(grossTax) + ", Net Amount " + payableAmount + ".";
                                                        var firebaseId = [];
                                                        var firebaseIdIOS = [];
                                                        _.forEach(admin, function(ad) { firebaseId.push({fId : ad.firebaseId, ownerId : ad._id}) } );
                                                        _.forEach(admin, function(ad) { firebaseIdIOS.push({fId : ad.firebaseIdIOS, ownerId : ad._id}) } );
                                                       

                                                        if(firebaseId.length>0){
                                                            _.forEach(firebaseId, function (f){
                                                                 var notiData = {
                                                                    type: "settlementReport",
                                                                    title: "Settlement Report",
                                                                    body: message,
                                                                    parlorId : set.parlorId,
                                                                    ownerId : f.ownerId,
                                                                    firebaseId : f.fId,
                                                                    role : 7,
                                                                    sendingDate : new Date(),
                                                                }
                                                                
                                                                OwnerNotifications.createNotificationObj( notiData , function (err, response) {
                                                                    OwnerNotifications.sendOwnerNotification(notiData.firebaseId , notiData.title, notiData.body, notiData.type , function(err , e){
                                                
                                                                    })
                                                                });
                                                            })
                                                        }
                                                        if(firebaseIdIOS.length >0){
                                                                _.forEach(firebaseIdIOS , function(f){
                                                                    var notiData = {
                                                                            type: "settlementReport",
                                                                            title: "Settlement Report",
                                                                            body: message,
                                                                            parlorId : parlorId,
                                                                            ownerId : f.ownerId,
                                                                            firebaseId :f.fId,
                                                                            role :7,
                                                                            sendingDate :new Date(),
                                                                        };
                                                                    OwnerNotifications.createNotificationObj( notiData , function (d) {
                                                                            OwnerNotifications.sendIOSNotificationOnEmployeeApp(notiData.firebaseId , notiData.title, notiData.body, notiData.type , function(err , e){
                                                                                
                                                                            })
                                                                    });
                                                                }) 
                                                            }


                                                        var data1 = "Dear " + set.parlorName + ", Your settlement report for the period " + periodDate + " has been generated successfully. Please check your email. Gross amount receivable- Rs." + Math.floor(set.totalCollectionByBeu) + " , Amount Payable (Inclusive of taxes)- Rs." + Math.floor(grossTax) + ", Net Amount " + payableAmount + ".For any queries please call on 9873341506."
                                                        var usermessage1 = Appointment.settlementSms(number, data1);
                                                        // Appointment.sendSMS(usermessage1, function (e) {
                                                        //     cb();
                                                        //     return console.log('SMS sent successfully');
                                                        // });
                                                    } else {
                                                        function sendEmail() {
                                                            var transporter = nodemailer.createTransport('smtps://reports@beusalons.com:wx2t2Tr7pMrqnK2CIqwd3g@smtp.mandrillapp.com');
                                                            var rupee = 'http://res.cloudinary.com/dyqcevdpm/image/upload/c_scale,h_10,w_10/v1501864561/nGbfO_jsm94v.png'
                                                            var mailOptions = {
                                                                from: 'reports@beusalons.com', // sender address
                                                                // to: ["nikitachauhan@beusalons.com"],
                                                                to: emailId,
                                                                cc: beuEmail,
                                                                html: '   <!DOCTYPE html>  ' +
                                                                    '   <html lang=en>  ' +
                                                                    '     ' +
                                                                    '   <head>  ' +
                                                                    '       <meta charset=UTF-8>  ' +
                                                                    '       <title>Settlement Mailer</title>  ' +
                                                                    '   </head>' + '  ' +
                                                                    '     ' +
                                                                    '   <body>  ' +
                                                                    '       <div style=width:80%;margin:auto>  ' +
                                                                    '           <div style=height:120px>  ' +
                                                                    '               <div style=float:left;width:200px;margin-top:2%;margin-left:2%;margin-bottom:2%;zoom:1.2><img alt="Beu salons" src="http://res.cloudinary.com/dyqcevdpm/image/upload/v1499860471/Master_BeU_Logo_June2017_zmsfwt.png" width=150></div>' + '  ' +
                                                                    '           </div><h3 style=width:100%;text-align:center>Settlement Report for ' + set.parlorName + ' for period ' + periodDate + '</h3>  ' + ' ' +
                                                                    '           <div style=" box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);transition: 0.3s;width: 98%;padding:10px;">' + '  ' +
                                                                    '               <table style="width:100%;border:2px solid gray;border-collapse:collapse;text-align:center">  ' +
                                                                    '                   <tr>  ' +
                                                                    '                       <th style="width:100%;border:1px solid gray;text-align:center;background-color: #bfbfbf;padding-top: 1%;padding-bottom: 1%;" colspan="2">Settlement Report</th>' + '  ' +
                                                                    '                   </tr>  ' +
                                                                    '                   <tr>  ' +
                                                                    '                       <td style="width:50%;border:1px solid gray"><b>Name of salon</b></td>  ' +
                                                                    '                       <td style="width:50%;border:1px solid gray"><b>' + set.parlorName + '</b></td>' + '  ' +
                                                                    '                   </tr>  ' +
                                                                    '                   <tr>  ' +
                                                                    '                       <td style="width:50%;border:1px solid gray">Entity name</td>  ' +
                                                                    '                       <td style="width:50%;border:1px solid gray">' + parlorEntityName + '</td>' + '  ' +
                                                                    '                   </tr>  ' +
                                                                    '                   <tr>  ' +
                                                                    '                       <td style="width:50%;border:1px solid gray">Address</td>  ' +
                                                                    '                       <td style="width:50%;border:1px solid gray">' + set.parlorAddress + '</td>' + '  ' +
                                                                    '                   </tr>  ' +
                                                                    '                   <tr>' + '  ' +
                                                                    '                       <td style="width:50%;border:1px solid gray">Period of Settlement</td>  ' +
                                                                    '                       <td style="width:50%;border:1px solid gray">' + periodDate + '</td>  ' +
                                                                    '                   </tr>' + '  ' +
                                                                    '               </table>  ' +
                                                                    '           </div>  ' +
                                                                    '           <!--Start of Graph Table-->' +
                                                                    '            <div style=" box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2)!important;transition: 0.3s!important;width:98%;padding:10px;">' +
                                                                    '            <div>' +
                                                                    '               <table style="width:100%;border:2px solid gray;border-collapse:collapse;text-align:center">' +
                                                                    '                   <tr>' +
                                                                    '                       <th  style="width:100%;border:1px solid gray;background-color: #bfbfbf;padding-top: 1%;padding-bottom: 1%;" colspan="2">Settlement Summary</th>' +
                                                                    '                   </tr>' +
                                                                    '                   <tr>' +
                                                                    '                       <td style="width:50%;">' +
                                                                    '                           <table style="width:100%;border:1px solid gray;border-collapse:collapse;text-align:center;margin-left: 3%;margin-top: 3%;margin-bottom: 3%;">' +
                                                                    '                               <tr>' +
                                                                    '                                   <th style="text-align:center;padding-top:3%;padding-bottom:3%;" colspan="2">' +
                                                                    '                                   <b>Settlement Period_Salon Revenue</b>' +
                                                                    '                                   <br>' +
                                                                    '                                   <b><img src=' + rupee + '>' + Math.floor(set.totalRevenue) + '</b>' +
                                                                    '                                   </th>' +
                                                                    '                               </tr>' +
                                                                    '                               <tr>' +
                                                                    '                                   <td style="width:50%;border:1px solid gray;padding-top:3%;padding-bottom:3%;"><b>Service Revenue</b><br>' +
                                                                    '                                       <b><img src=' + rupee + '>' + Math.floor(set.serviceRevenue) + '</b></td>' +
                                                                    '                                   <td style="width:50%;border:1px solid gray;padding-top:3%;padding-bottom:3%;"><b>Product Revenue</b><br>' +
                                                                    '                                       <b><img src=' + rupee + '>' + Math.floor(set.productRevenue) + '</b></td>' +
                                                                    '                               </tr>' + comm +
                                                                    '                           </table>' +
                                                                    '                       </td>' +
                                                                    '                       <td style="width:50%;"><img  src=' + resultImage1.short_url + ' alt="img" style="width:80%"></td>' +
                                                                    '                  </tr>' +
                                                                    '               </table>' +
                                                                    '           </div>' +
                                                                    '           </div>' +
                                                                    '                 ' +
                                                                    // '           <div style=" box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2)!important;transition: 0.3s!important;width:98%;padding:10px;">' +
                                                                    // '           <div>' +
                                                                    // '               <table style="width:100%;border:2px solid gray;border-collapse:collapse;text-align:center">' +
                                                                    // '                   <tr>' +
                                                                    // '                       <th  style="width:100%;border:1px solid gray;background-color: #bfbfbf;padding-top: 1%;padding-bottom: 1%;" colspan="2">Benefits To Salon</th>' +
                                                                    // '                   </tr>' +
                                                                    // '                   <tr>' +
                                                                    // '                       <td style="width:50%;"><img src=' + resultImage2.short_url + ' alt="img" style="width:100%"></td>' +
                                                                    // '                           <td style="width:50%;">' +
                                                                    // '                               <table style="width:94%;border:1px solid gray;border-collapse:collapse;text-align:center;margin-left: 3%;margin-top: 3%;margin-bottom: 3%;">' +
                                                                    // '                                   <tr>' +
                                                                    // '                                       <td style="width:50%;border:1px solid gray;padding-top:3%;padding-bottom:3%;">' +
                                                                    // '                                           <table style="width:100%;border-collapse:collapse;text-align:center">' +
                                                                    // '                                               <tr>' +
                                                                    // '                                                   <td style="border-bottom:1px solid gray;">' +
                                                                    // '                                                   <b>Freebies Benefit</b>' +
                                                                    // '                                                   <br>' +
                                                                    // '                                                   <b><img src=' + rupee + '>' + Math.floor(set.collectedByLoyalityPoints) + '</b>' +
                                                                    // '                                                   </td>' +
                                                                    // '                                               </tr>' +
                                                                    // '                                               <tr>' +
                                                                    // '                                                   <td style="border-bottom:1px solid gray;">' +
                                                                    // '                                                   <b>Cash Back on ERP</b>' +
                                                                    // '                                                   <br>' +
                                                                    // '                                                   <b><img src=' + rupee + '>' + Math.floor(set.refundOnErp) + '</b></td>' +
                                                                    // '                                               </tr>' +
                                                                    // '                                               <tr>' +
                                                                    // '                                                   <td style="">' +
                                                                    // '                                                   <b>Cash Back on App Transaction</b>' +
                                                                    // '                                                   <br>' +
                                                                    // '                                                   <b><img src=' + rupee + '>' + Math.floor(set.refundFirstAppDigital + set.refundAppDigitalCash + set.refundAppDigitalOnline) + '</b>' +
                                                                    // '                                                   </td>' +
                                                                    // '                                               </tr>' + disOnPurchase2 +
                                                                    // '                                            </table>' +
                                                                    // '                                       </td>' +
                                                                    // '                                       <td style="width:50%;border:1px solid gray;padding-top:3%;padding-bottom:3%;">' +
                                                                    // '                                           <b>Total Benefits</b>' +
                                                                    // '                                           <br>' +
                                                                    // '                                           <b><img src=' + rupee + '>' + Math.floor(set.discountOnPurchase + set.refundOnErp + set.refundFirstAppDigital + set.refundAppDigitalCash + set.refundAppDigitalOnline + set.collectedByLoyalityPoints) + '</b>' +
                                                                    // '                                       </td>' +
                                                                    // '                                   </tr>' +
                                                                    // '                               </table>' +
                                                                    // '                           </td>' +
                                                                    // '                       </tr>' +
                                                                    // '                   </table>' +
                                                                    // '               </div>' +
                                                                    // '           </div>' +
                                                                    '           <!--Start of right table-->  ' +
                                                                    '           <div style="width:46%;padding:10px;float:left">  ' +
                                                                    '               <div style=" box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);transition: 0.3s;margin-top:10px;">' + '  ' +
                                                                    '                   <table style="width:100%;border:2px solid gray;border-collapse:collapse;text-align:center">  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:100%;border:1px solid gray;background-color: #bfbfbf;padding-top: 1%;padding-bottom: 1%;" colspan=2>  ' + '  ' +
                                                                    '                               <b>Revenue Summary</b></tr>  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <th style="width:70%;border:1px solid gray">Particulars</th>  ' +
                                                                    '                           <th style="width:30%;border:1px solid gray">Amount</th>  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:70%;border:1px solid gray">Service Revenue</td>' + '  ' +
                                                                    '                           <td style="width:30%;border:1px solid gray"><img src=' + rupee + '>' + Math.floor(set.serviceRevenue) + '</td>  ' +
                                                                    '                           <tr>  ' +
                                                                    '                               <td style="width:70%;border:1px solid gray">Product Revenue</td>' + '  ' +
                                                                    '                               <td style="width:30%;border:1px solid gray"><img src=' + rupee + '>' + Math.floor(set.productRevenue) + '</td>  ' +
                                                                    '                               <tr>  ' +
                                                                    '                                   <td style="width:70%;border:1px solid gray"><b>Total Revenue</b></td>' + '  ' +
                                                                    '                                   <td style="width:30%;border:1px solid gray"><b><img src=' + rupee + '>' + Math.floor(set.totalRevenue) + '</b></td>  ' +
                                                                    '                   </table>  ' +
                                                                    '               </div>  ' +
                                                                    '               <div style=" box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);transition: 0.3s;margin-top:25px;">' + '  ' +
                                                                    '                   <table style="width:100%;border:2px solid gray;border-collapse:collapse;text-align:center">  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:100%;border:1px solid gray;background-color: #bfbfbf;padding-top: 1%;padding-bottom: 1%;" colspan="2"><b>Collection Summary</b></td>' + '  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <th style="width:70%;border:1px solid gray">Particulars</th>  ' +
                                                                    '                           <th style="width:30%;border:1px solid gray">Amount</th>  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:70%;border:1px solid gray;text-align:center;">Collected By Salon</td>' + '  ' +
                                                                    '                           <td style="width:30%;border:1px solid gray;text-align:center;"><img src=' + rupee + '>' + Math.floor(set.totalCollectionByParlor) + '</td>  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:70%;border:1px solid gray;text-align:center;">Collected by Be U</td>' + '  ' +
                                                                    '                           <td style="width:30%;border:1px solid gray;text-align:center;"><img src=' + rupee + '>' + Math.floor(set.totalCollectionByBeu) + '</td>  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:70%;border:1px solid gray;text-align:right;padding-right:12px;font-size:10px;"><i>Through App/Website<i></td>' + '  ' +
                                                                    '                           <td style="width:30%;border:1px solid gray;text-align:center;"><img src=' + rupee + '>' + Math.floor(set.collectedByApp) + '</td>  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:70%;border:1px solid gray;text-align:right;padding-right:37px;font-size:10px;"><i>Through Affiliates</i></td>' + '  ' +
                                                                    '                           <td style="width:30%;border:1px solid gray;text-align:center;"><img src=' + rupee + '>' + Math.floor(set.collectedByAffiliates) + '</td>  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:70%;border:1px solid gray;text-align:right;padding-right:41px;font-size:10px;"><i>Through Loyality</i></td>' + '  ' +
                                                                    '                           <td style="width:30%;border:1px solid gray;text-align:center;"><img src=' + rupee + '>' + Math.floor(set.collectedByLoyalityPoints) + '</td>  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:70%;border:1px solid gray;text-align:center;"><b>Total Collection</b></td>' + '  ' +
                                                                    '                           <td style="width:30%;border:1px solid gray;text-align:center;"><b><img src=' + rupee + '>' + Math.floor(set.totalCollection) + '</b></td>  ' +
                                                                    '                       </tr>  ' +
                                                                    '                   </table>  ' +
                                                                    '               </div>  ' +

                                                                    '           </div>  ' +
                                                                    '           <!--End of right table-->  ' +
                                                                    '           <!--start of right table-->  ' +
                                                                    '           <div style="width:50%;float:left;margin-top:19px;padding-left: 0.5%;">  ' +
                                                                    '               <div style=" box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);transition: 0.3s;">' + '  ' +
                                                                    '                   <table style="width:100%;border:2px solid gray;border-collapse:collapse;text-align:left">  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:100%;border:1px solid gray;text-align:center;background-color: #bfbfbf;padding-top: 1%;padding-bottom: 1%;" colspan=2>' + '  ' +
                                                                    '                               <b>Be U Payout</b></tr>  ' +
                                                                    '                        <tr>  ' +
                                                                    '                           <th style="width:70%;border:1px solid gray;text-align:center">Particulars</th>  ' +
                                                                    '                           <th style="width:30%;border:1px solid gray;text-align:center">Amount</th>  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <td style="width:70%;border:1px solid gray;text-align:center">Amount Collected by Be U</td>  ' +
                                                                    '                       <td style="width:30%;border:1px solid gray;text-align:center;"><img src=' + rupee + '>' + Math.floor(set.collectedByAffiliates + set.collectedByApp) + '</td>' + '  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:70%;border:1px solid gray;text-align:center;padding-right:6%;">Salon Benefits by Be U</td>  ' +
                                                                    '                           <td style="width:30%;border:1px solid gray;text-align:center;"></td>' + '  ' +
                                                                    '                       </tr>  ' +
                                                                    // '                       <tr>  ' +
                                                                    // '                           <td style="width:70%;border:1px solid gray;padding-right:15%;text-align:center"> a)Cash Back</td>  ' +
                                                                    // '                           <td style="width:30%;border:1px solid gray;text-align:center;"></td>' + '  ' +
                                                                    // '                       </tr>  ' +
                                                                    // '                       <tr>  ' +
                                                                    // '                           <td style="width:70%;border:1px solid gray;padding-left: 31px;text-align:center;font-size:10px;"> <i>-Cash Back on ERP_Revenue</i></td>  ' +
                                                                    // '                           <td style="width:30%;border:1px solid gray;text-align:center;text-align:center"><img src=' + rupee + '>' + Math.floor(set.refundOnErp) + '</td>' + '  ' +
                                                                    // '                       </tr>  ' +
                                                                    // '                       <tr>  ' +
                                                                    // '                           <td style="width:70%;border:1px solid gray;padding-left: 39px;text-align:center;font-size:10px;"><i>-Cash Back on App_Transaction</i></td>  ' +
                                                                    // '                           <td style="width:30%;border:1px solid gray;text-align:center;"><img src=' + rupee + '>' + Math.floor(set.refundFirstAppDigital + set.refundAppDigitalCash + set.refundAppDigitalOnline) + '</td>  ' +
                                                                    // '                       </tr>' + '  ' +
                                                                    // '                       <!--<tr>-->  ' +
                                                                    // '                           <!--<td style="width:70%;border:1px solid gray;text-align:center">b) Be U Purcahse Scheme Benefits</td>-->  ' +
                                                                    // '                           <!--<td style="width:30%;border:1px solid gray;text-align:center;">&#45;&#45;&#45;&#45;</td>' + '-->  ' +
                                                                    // '                       <!--</tr>-->  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:70%;border:1px solid gray;padding-left: 10px;text-align:center;">Freebies Benefits</td>  ' +
                                                                    '                           <td style="width:30%;border:1px solid gray;text-align:center;"><img src=' + rupee + '>' + Math.floor(set.collectedByLoyalityPoints) + '</td>  ' +
                                                                    '                       </tr>' + disOnPurchase +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:70%;border:1px solid gray;text-align:center;"><b>Total Salon Benefits by Be U </b></td>  ' +
                                                                    '                           <td style="width:30%;border:1px solid gray;text-align:center;"><img src=' + rupee + '>' + Math.floor(set.discountOnPurchase + set.collectedByLoyalityPoints + set.refundFirstAppDigital + set.refundAppDigitalCash + set.refundAppDigitalOnline + set.refundOnErp) + '</td>' + '  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <!--<tr>-->  ' +
                                                                    '                           <!--<td style="width:70%;border:1px solid gray;text-align:center;"><b>Grand Total {A+B}</b></td>-->  ' +
                                                                    '                           <!--<td style="width:30%;border:1px solid gray;text-align:center;">&#45;&#45;&#45;&#45;</td>' + '-->  ' +
                                                                    '                       <!--</tr>-->  ' +
                                                                    '                   </table>  ' +
                                                                    '               </div>  ' +
                                                                    '               <div style=" box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);transition: 0.3s;margin-top:21px;">  ' +
                                                                    '                   <table style="width:100%;border:2px solid gray;border-collapse:collapse;text-align:left">' + '  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:100%;border:1px solid gray;text-align:center;background-color: #bfbfbf;padding-top: 1%;padding-bottom: 1%;" colspan="2"><b>Salons Payout</b></td>  ' +
                                                                    '                       </tr>  ' +
                                                                    '                        <tr>  ' +
                                                                    '                           <th style="width:70%;border:1px solid gray;text-align:center">Particulars</th>  ' +
                                                                    '                           <th style="width:30%;border:1px solid gray;text-align:center">Amount</th>  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:70%;border:1px solid gray;text-align:center">Amount payable to Be U</td>' + '  ' +
                                                                    '                           <td style="width:30%;border:1px solid gray;text-align:center;"><img src=' + rupee + '>' + Math.floor(set.amountPayableToBeu) + '</td>  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:70%;border:1px solid gray;font-size:12px;"><b>Final Amount Payable to Salon/(Be U)</b></td>' + '  ' +
                                                                    '                           <td style="width:30%;border:1px solid gray;text-align:center;"><b><img src=' + rupee + '>' + Math.floor(set.netPayable) + '</b></td>  ' +
                                                                    '                       </tr>  ' +
                                                                    // '                       <td style="width:70%;border:1px solid gray">Less: Discount</td>  '  +
                                                                    // '                       <td style="width:30%;border:1px solid gray;text-align:center;">'+Math.floor(set.lessDiscount)+'</td>' + '  '  +
                                                                    // '                       <tr>  '  +
                                                                    // '                           <td style="width:70%;border:1px solid gray">Amount payable to Be U(After Discount)</td>  '  +
                                                                    // '                           <td style="width:30%;border:1px solid gray;text-align:center;">'+Math.floor(set.amountPayableToBeuAfterDiscount)+'</td>' + '  '  +
                                                                    // '                       </tr>  '  +
                                                                    // '                       <tr>  '  +
                                                                    // '                           <td style="width:50%;border:1px solid gray">Add: CGST @ 9%</td>  '  +
                                                                    // '                           <td style="border:1px solid gray;text-align:center;">'+Math.floor(set.amountPayableToBeuAfterDiscount*.09)+'</td>  '  +
                                                                    // '                       </tr>  '  +
                                                                    // '                       <tr>  '  +
                                                                    // '                           <td style="width:70%;border:1px solid gray">Add: SGST @ 9%</td>' + '  '  +
                                                                    // '                           <td style="width:30%;border:1px solid gray;text-align:center;">'+Math.floor(set.amountPayableToBeuAfterDiscount*.09)+'</td>  '  +
                                                                    // '                       </tr>  '  +
                                                                    // '                       <tr>  '  +
                                                                    // '                           <td style="width:70%;border:1px solid gray"><b>Total Amount Payable to Be U(Incl. Taxes)</b></td>' + '  '  +
                                                                    // '                           <td style="width:30%;border:1px solid gray;text-align:center;">'+Math.floor(set.amountPayableToBeuAfterTax)+'</td>  '  +
                                                                    // '                       </tr>  '  +
                                                                    '                   </table>  ' +
                                                                    '               </div>  ' +
                                                                    // '               <div style=" box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);transition: 0.3s;margin-top:5px;">' + '  '  +
                                                                    // '                   <table style="width:100%;border:1px solid gray;border-collapse:collapse;text-align:left">  '  +
                                                                    // // '                       <tr>  '  +
                                                                    // // '                           <td style="width:70%;border:1px solid gray">Net amount payable to Salon</td>' + '  '  +
                                                                    // // '                           <td style="width:30%;border:1px solid gray">'+Math.floor(set.netPayable)+'</td>  '  +
                                                                    // // '                       </tr>  '  +
                                                                    // // '                       <tr>  '  +
                                                                    // // '                           <td style="width:70%;border:1px solid gray">Previous balance outstanding </td>  '  +
                                                                    // // '                           <td style="width:30%;border:1px solid gray;text-align:center;">'+Math.floor(set.amountPayableToBeuAfterTax)+'</td>' + '  '  +
                                                                    // // '                       </tr>  '  +
                                                                    // '                       <tr>  '  +
                                                                    // '                           <td style="width:50%;border:1px solid gray">Final Amount Payable to Salon/(Be U)</td>  '  +
                                                                    // '                           <td style="border:1px solid gray;text-align:center;">'+Math.floor(set.netPayable)+'</td>  '  +
                                                                    // '                       </tr>  '  +
                                                                    // '                   </table>' + '  '  +
                                                                    // '               </div>  '  +
                                                                    '           </div>  ' +
                                                                    '               <div style="width:98%; box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);transition: 0.3s;margin-top:35%;padding: 10px;">' + '  ' +
                                                                    '                   <table style="width:100%;border:2px solid gray;border-collapse:collapse;text-align:left">  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:100%;border:1px solid gray;text-align:center;background-color: #bfbfbf;padding-top: 1%;padding-bottom: 1%;" colspan="2"><b>Final Settlement Terms</b></td>' + '  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <th style="width:70%;border:1px solid gray;text-align:center;">Particulars</th>  ' +
                                                                    '                           <th style="width:30%;border:1px solid gray;text-align:center;">Amount</th>' + '  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:70%;border:1px solid gray;text-align:center;">Royalty %age_Service Revenue</td>  ' +
                                                                    '                           <td style="width:30%;border:1px solid gray;text-align:center;">' + set.royalityPercentageService + '%</td>' + '  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:70%;border:1px solid gray;text-align:center;">Royalty %age_Product Sale</td>  ' +
                                                                    '                           <td style="width:30%;border:1px solid gray;text-align:center;">' + set.royalityPercentageProduct + '%</td>' + '  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:70%;border:1px solid gray;text-align:center;">Discount, if any</td>  ' +
                                                                    '                           <td style="width:30%;border:1px solid gray;text-align:center;">' + Math.floor(set.lessDiscount) + '%</td>  ' +
                                                                    '                       </tr>' + '  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:70%;border:1px solid gray;text-align:center;">Minimum Guarantee</td>  ' +
                                                                    '                           <td style="width:30%;border:1px solid gray;text-align:center;"><img src=' + rupee + '>' + parlor.minimumGuarantee + '</td>  ' +
                                                                    '                       </tr>' + '  ' +
                                                                    '                   </table>  ' +
                                                                    '               </div>  ' +
                                                                    // '           <div style=" box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);transition: 0.3s;width:98%;margin-top:1%;padding: 10px;">  ' +
                                                                    // '               <table style="width:100%;border:2px solid gray;border-collapse:collapse;text-align:center">' + '  ' +
                                                                    // '                   <tr>  ' +
                                                                    // '                       <th style="width:100%;border:1px solid gray;background-color: #bfbfbf;padding-top: 1%;padding-bottom: 1%;" colspan="2">Benefits to Salon by Be U - Summary</th>  ' +
                                                                    // '                   </tr>  ' +
                                                                    // '                        <tr>  ' +
                                                                    // '                           <th style="width:70%;border:1px solid gray">Particulars</th>  ' +
                                                                    // '                           <th style="width:30%;border:1px solid gray">Amount</th>  ' +
                                                                    // '                       </tr>  ' +
                                                                    // '                   <tr>  ' +
                                                                    // '                       <td style="width:70%;border:1px solid gray">Freebies_Payout_July 2017_Till Date</td>' + '  ' +
                                                                    // '                       <td style="width:30%;border:1px solid gray"><img src=' + rupee + '>' + Math.floor(set.freebiesPayoutJulyTillDate) + '</td>  ' +
                                                                    // '                   </tr>  ' +
                                                                    // '                   <td style="width:50%;border:1px solid gray">Freebies_Payout_Since Joining</td>  '  +
                                                                    // '                   <td style="width:50%;border:1px solid gray">'+Math.floor(set.freebiesPayoutSinceJoining)+'</td>  '  +
                                                                    // '                   <tr>' + '  ' +
                                                                    // '                       <td style="width:70%;border:1px solid gray">Cash Back on ERP & App_Payout_July 2017_Till Date</td>  ' +
                                                                    // '                       <td style="width:30%;border:1px solid gray"><img src=' + rupee + '>' + Math.floor(set.cashBackErpAndAppPayoutJulyTillDate) + '</td>' + '  ' +
                                                                    // '                   </tr>    <tr>  ' +
                                                                    // '                       <td style="width:70%;border:1px solid gray"><b>Grand Total_Benefits_July 17_Till Date</b></td>' + '  ' +
                                                                    // '                       <td style="width:30%;border:1px solid gray"><b><img src=' + rupee + '>' + Math.floor(set.freebiesPayoutJulyTillDate + set.cashBackErpAndAppPayoutJulyTillDate) + '</b></td>  ' +
                                                                    // '                   </tr>  ' +
                                                                    // '                   <tr>  '  +
                                                                    // '                       <td style="width:50%;border:1px solid gray">Grand Total_Benefits_Since Joining</td>  '  +
                                                                    // '                       <td style="width:50%;border:1px solid gray">'+Math.floor(set.freebiesPayoutSinceJoining+set.cashBackErpAndAppPayoutSinceJoining)+'</td>' + '  '  +
                                                                    // '                   </tr>  '  +
                                                                    // '               </table>  ' +
                                                                    // '           </div>  ' +
                                                                    // '            end right table  '  +
                                                                    '       </div>  ' +
                                                                    '   </body>  ' +
                                                                    '     ' +
                                                                    '  </html>  ',
                                                                // to: emailId,
                                                                // cc: beuEmail,// list of receivers
                                                                // html:'<!DOCTYPE html><html lang=en><meta charset=UTF-8><title>Settlement Mailer</title><div style=width:60%;margin:auto><div style=background-color:#dfdfdf;height:120px><div style=float:left;width:200px;margin-top:2%;margin-left:2%;margin-bottom:2%;zoom:1.2><img alt="Beu salons"src=http://res.cloudinary.com/dyqcevdpm/image/upload/v1491484496/beu-logo_srvetg.png width=150></div></div><div><h3 style=width:100%;text-align:center>Settlement Report for '+set.parlorName+' for period '+periodDate+'</h3><table style="width:100%;border:1px solid gray;border-collapse:collapse;text-align:center"><tr><td style="width:50%;border:1px solid gray">Name of salon<td style="width:50%;border:1px solid gray">'+set.parlorName+'<tr><td style="width:50%;border:1px solid gray">Entity name<td style="width:50%;border:1px solid gray">'+parlorEntityName+'<tr><td style="width:50%;border:1px solid gray">Address<td style="width:50%;border:1px solid gray">'+set.parlorAddress+'<tr><td style="width:50%;border:1px solid gray">Date of Settlement<td style=width:50%>'+dateEnd+'<tr><td style="width:50%;border:1px solid gray">Period of Settlement<td style="width:50%;border:1px solid gray">'+periodDate+'</table></div><div><h3 style=width:100%;text-align:center>Service Revenue</h3><table style="width:100%;border:1px solid gray;border-collapse:collapse;text-align:center"><tr><td style="width:50%;border:1px solid gray">Service Revenue<td style="width:50%;border:1px solid gray">'+Math.floor(set.serviceRevenue)+'<tr><td style="width:50%;border:1px solid gray">Product Revenue<td style="width:50%;border:1px solid gray">'+Math.floor(set.productRevenue)+'<tr><td style="width:50%;border:1px solid gray">Total Revenue<td style="width:50%;border:1px solid gray">'+Math.floor(set.totalRevenue)+'</table></div><div><h3 style=width:100%;text-align:center>Membership Revenue</h3><table style="width:100%;border:1px solid gray;border-collapse:collapse;text-align:center"><tr><td style="width:50%;border:1px solid gray">Membership Sold<td style="width:50%;border:1px solid gray">'+set.membershipSold+'</table></div><div><h3 style=width:100%;text-align:center>Collection Summary</h3><table style="width:100%;border:1px solid gray;border-collapse:collapse;text-align:center"><tr><td style="width:50%;border:1px solid gray;text-align:left;padding-left:5%">Collected By Salon<td style="width:50%;border:1px solid gray">'+Math.floor(set.totalCollectionByParlor)+'<tr><td style="width:50%;border:1px solid gray;text-align:left;padding-left:5%">Collected by Be U<td style="width:50%;border:1px solid gray">'+Math.floor(set.totalCollectionByBeu)+'<tr><td style="width:50%;border:1px solid gray">Through App/Website<td style="width:50%;border:1px solid gray;padding-left:4%">'+Math.floor(set.collectedByApp)+'<tr><td style="width:50%;border:1px solid gray;padding-right:3%">Through Affiliates<td style="width:50%;border:1px solid gray;padding-left:4%">'+Math.floor(set.collectedByAffiliates)+'<tr><td style="width:50%;border:1px solid gray;padding-right:4%">Through Loyality<td style="width:50%;border:1px solid gray;padding-left:4%">'+Math.floor(set.collectedByLoyalityPoints)+'<tr><td style="width:50%;border:1px solid gray;text-align:left;padding-left:5%">Total Collection<td style="width:50%;border:1px solid gray">'+Math.floor(set.totalCollection)+'</table></div><div><h3 style=width:100%;text-align:center>Model Summary</h3><table style="width:100%;border:1px solid gray;border-collapse:collapse;text-align:center"><tr><td style="width:50%;border:1px solid gray">Royalty Percentage-Service<td style="width:50%;border:1px solid gray">'+royalityPercentageService+'<tr><td style="width:50%;border:1px solid gray">Royalty Percentage-Product<td style="width:50%;border:1px solid gray">'+set.royalityPercentageProduct+'%<tr><td style="width:50%;border:1px solid gray">Discount Percentage<td style="width:50%;border:1px solid gray">'+set.discountPercentage+'%</table></div><div><h3 style=width:100%;text-align:center>Final Settlement Summary</h3><table style="width:100%;border:1px solid gray;border-collapse:collapse;text-align:center"><tr><td style="width:100%;border:1px solid gray"colspan=2><b>Be U Payout</b>' +
                                                                // '<tr><td style="width:50%;border:1px solid gray">Amount Payable to Be U (incl GST)<td style="width:50%;border:1px solid gray">'+Math.floor(set.amountPayableToBeu)+'' +
                                                                // '<tr><td style="width:50%;border:1px solid gray">Amount Payable to Be U(After Discount)<td style="width:50%;border:1px solid gray">'+Math.floor(set.amountPayableToBeu-set.refundAppDigitalCash-set.refundAppDigitalOnline-set.refundOnErp )+
                                                                // '<tr><td style="width:100%;border:1px solid gray"colspan=2><b>Salon Payout</b>' +
                                                                // '<tr><td style="width:50%;border:1px solid gray">' + 'Amount Collected by Be U<td style="width:50%;border:1px solid gray">'+Math.floor(set.totalCollectionByBeu)+
                                                                // '<tr><td style="width:50%;border:1px solid gray">' + 'Amount Refund on App Digital transaction<td style="width:50%;border:1px solid gray">'+Math.floor(set.refundAppDigitalCash+set.refundAppDigitalOnline)+
                                                                // '<tr><td style="width:50%;border:1px solid gray">' + 'Amount Refund on Erp transaction<td style="width:50%;border:1px solid gray">'+Math.floor(set.refundOnErp)+
                                                                // '<tr><td style="width:50%;border:1px solid gray">Gross Amount(Recevable from BeU)<td style="border:1px solid gray">'+Math.floor(set.totalCollectionByBeu+set.refundOnErp+set.refundAppDigitalCash+set.refundAppDigitalOnline)+'</table></div><div style=padding-top:2%><table style="width:100%;border:1px solid gray;border-collapse:collapse;text-align:center"><tr><td style="width:50%;border:1px solid gray">Net Amount Payable to BeU/(Receivable from BeU)<td style="width:50%;border:1px solid gray">'+Math.floor(set.netPayable)+'</table></div></div><div style=padding-top:2%><table style="width:100%;border:1px solid gray;border-collapse:collapse;text-align:center"><tr><td style="width:50%;border:1px solid gray">Previous balance outstanding - Payable to Be U<td style="width:50%;border:1px solid gray">'+set.previousPendingAmount+'<tr><td style="width:50%;border:1px solid gray">Less: Adjusted against current period dues<td style="width:50%;border:1px solid gray">'+((set.previousPendingAmount - set.pendingAmount) <0 ? 0 : (set.previousPendingAmount-set.pendingAmount))+'<tr><td style="width: 50%;border: 1px solid gray;"> Add: Current Period dues payable to Be U<td style="width: 50%;border: 1px solid gray;">'+set.pendingAmount+'<tr><td style="width:50%;border:1px solid gray">Balance outstanding<td style="width:50%;border:1px solid gray">'+set.pendingAmount+'</table></div><div style=padding-top:2%><table style="width:100%;border:1px solid gray;border-collapse:collapse;text-align:center"><tr><td style="width:50%;border:1px solid gray">Net Amount to be transferred<td style="width:50%;border:1px solid gray">'+Math.floor(set.netAmountTransferred)+'</table></div>',
                                                                subject: 'Settlement Report' // Subject line
                                                            };
                                                            transporter.sendMail(mailOptions, function(error, info) {
                                                                if (error)
                                                                    console.log(error);
                                                                else {
                                                                    console.log('Message sent: ' + info.response);
                                                                    SettlementReport.update({ _id: set.id }, { paidDate: new Date() }, function(err, settleUpdate) {
                                                                        if (!err)
                                                                            console.log('paidDate Updated')
                                                                        else
                                                                            console.log('there is some error')
                                                                    })
                                                                }
                                                                // return res.json(CreateObjService.response(false, "Mail sent successfully!"));
                                                            });
                                                        }

                                                        sendEmail();

                                                        var data = "Dear " + set.parlorName + ", Your settlement report for the period " + periodDate + " has been generated successfully with " + set.reason.toLowerCase() + ". Please check your email. To get your settlement processed please close the open appointments. For any queries please call on 9873341506."
                                                        var usermessage = Appointment.settlementSms(number, data);
                                                        // Appointment.sendSMS(usermessage, function (e) {
                                                        //     cb();
                                                        //     return console.log('SMS sent successfully');
                                                        // });
                                                    }
                                                }) //this one ends here
                                        }); // console.log(emailId,beuEmail)
                                    }) //ends here
                            }); //here it ends
                        })
                    });
                })
            }, function() {
                res.json("Sent Successfully");
            });
        });
    });
});




router.get('/sendOneFinalSettlement', function(req, res) {
    // var settlementMain = schedule.scheduleJob('00 00 17 * * *', function(req,res) {
    var nodemailer = require('nodemailer');
    //     if(localVar.isServer()) {
    //         var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], day = days[new Date().getDay()];
    //         if (day == 'Monday' || day == 'Wednesday' || day == 'Friday') {
    //             console.log(day)

    var id = req.query.id
    SettlementReport.findOne({ _id: id }, { period: 1, createdAt: 1, endDate: 1 }).exec(function(err, settlement) {
        var startDate = settlement.startDate;
        var endDate = settlement.endDate;
        var period = settlement.period
        console.log(period)
            // Parlor.createSettlementReportv2(startDate, endDate, period,{} ,function (err, report) {
        SettlementReport.find({ _id: id }).exec(function(err, setts) {

            console.log(setts)
            async.each(setts, function(set, cb) {
                var totalCollectionByParlor = Math.floor(set.totalCollectionByParlor),
                    collectedByApp = Math.floor(set.collectedByApp),
                    collectedByAffiliates = Math.floor(set.collectedByAffiliates),
                    collectedByLoyalityPoints = Math.floor(set.collectedByLoyalityPoints)
                var labels = [
                    "Freebies Benefit : " + Math.floor(set.collectedByLoyalityPoints) + "",
                    "Cashback on App Transaction : " + Math.floor(set.refundFirstAppDigital + set.refundAppDigitalCash + set.refundAppDigitalOnline) + "",
                ]
                if (set.refundOnErp > 0) {
                    labels.push("Cashback on ERP : " + Math.floor(set.refundOnErp) + "")
                }
                if (set.discountOnPurchase > 0) {
                    labels.push("Product Discount : " + Math.floor(set.discountOnPurchase) + "")
                }
                var body1 = JSON.stringify({
                    "template": 'settlement-pie-chart',
                    "options": {
                        "data": {
                            "datasets": [{
                                    "data": [
                                        Math.floor(set.collectedByLoyalityPoints),
                                        Math.floor(set.refundOnErp),
                                        Math.floor(set.refundFirstAppDigital + set.refundAppDigitalCash + set.refundAppDigitalOnline),
                                        Math.floor(set.discountOnPurchase),
                                    ],
                                    "backgroundColor": [
                                        "#F7464A",
                                        "#46BFBD",
                                        "#FDB45C",
                                    ],
                                    "label": "Dataset 1"
                                }

                            ],
                            "labels": labels
                        },
                    }
                });

                var options = {
                    "url": 'https://charturl.com/short-urls.json?api_key=pak-fdbb1e17-e6a4-4646-bc68-8eb5785f1ff7',
                    "method": 'POST',
                    "headers": {
                        "Content-Type": "application/json",
                    },
                    "body": body1
                };

                request(options, function(err, response, body3) {
                    var resultImage2 = JSON.parse(body3)

                    var body = JSON.stringify({
                        "template": 'settlement-pie-chart',
                        "options": {
                            "data": {
                                "datasets": [{
                                        "data": [
                                            totalCollectionByParlor,
                                            collectedByApp,
                                            collectedByAffiliates,
                                            collectedByLoyalityPoints
                                        ],
                                        "backgroundColor": [
                                            "#F7464A",
                                            "#46BFBD",
                                            "#FDB45C",
                                            "#4D5360"
                                        ],
                                        "label": "Dataset 1"
                                    }

                                ],
                                "labels": [
                                    "Collected by Salon : " + totalCollectionByParlor + "",
                                    "Collected by Be U App : " + collectedByApp + "",
                                    "Collected by Be U Affiliates : " + collectedByAffiliates + "",
                                    "Collected by Be U Freebies : " + collectedByLoyalityPoints + ""
                                ]
                            }
                        }
                    });
                    var options = {
                        "url": 'https://charturl.com/short-urls.json?api_key=pak-fdbb1e17-e6a4-4646-bc68-8eb5785f1ff7',
                        "method": 'POST',
                        "headers": {
                            "Content-Type": "application/json",
                        },
                        "body": body
                    };
                    request(options, function(err, response, body2) {
                        var resultImage1 = JSON.parse(body2)
                        var number = ["8826345311"];
                        var firebaseId = [];
                        var serviceTax = set.amountPayableToBeuAfterDiscount * 0.15,
                            grossTax = set.amountPayableToBeuAfterDiscount * 1.15,
                            totalServiceTax = set.totalCollectionByBeu * 0.15,
                            totalGrossTax = set.totalCollectionByBeu * 1.15;
                        var d = set.endDate,
                            dateEnd = d.toDateString();
                        var periodDate = new Date(set.startDate.getTime() + 1000 * 60 * 5).toString().slice(0, 10) + " - " + set.endDate.toString().slice(0, 10);
                        var royalityPercentageService = 0;
                        var payableAmount = 0,
                            parlorEntityName = ""
                        if (set.royalityPercentageService == null) royalityPercentageService = "As per slab";
                        else royalityPercentageService = set.royalityPercentageService + "%";
                        if (set.netPayable > 0) {
                            payableAmount = "Payable to Be U Rs." + Math.floor(set.netPayable)
                        } else {
                            payableAmount = "Receivable from Be U Rs." + Math.floor(set.netPayable * -1)
                        }
                        if (set.parlorEntityName) {
                            parlorEntityName = set.parlorEntityName
                        } else {
                            parlorEntityName = "-"
                        }
                        var emailId = [],
                            beuEmail = [];
                        Admin.find({ parlorIds: set.parlorId, role: 7 }, { emailId: 1, phoneNumber: 1, otherEmailId: 1, otherPhoneNumber: 1, firebaseId: 1 }, function(err, admin) {
                            async.each(admin, function(ad, cb2) {
                                if (ad.otherEmailId && ad.otherPhoneNumber) {
                                    emailId.push(ad.emailId);
                                    emailId.push(ad.otherEmailId);
                                    number.push(ad.phoneNumber)
                                    number.push(ad.otherPhoneNumber)
                                    firebaseId.push(ad.firebaseId)
                                    cb2();
                                } else {
                                    emailId.push(ad.emailId);
                                    number.push(ad.phoneNumber);
                                    firebaseId.push(ad.firebaseId)
                                    cb2();
                                }
                            }, function() {


                                Beu.find({ parlorIds: set.parlorId, role: { $in: [1, 3, 5, 8, 11] } }, { emailId: 1, phoneNumber: 1, firebaseId: 1 }, function(err, beu) {
                                        async.each(beu, function(b, cb3) {
                                            beuEmail.push(b.emailId);
                                            firebaseId.push(b.firebaseId);
                                            cb3();
                                        }, function() {


                                            Parlor.findOne({ _id: set.parlorId }, function(err, parlor) {
                                                    var rupee = 'http://res.cloudinary.com/dyqcevdpm/image/upload/c_scale,h_10,w_10/v1501864561/nGbfO_jsm94v.png'

                                                    var hideHtml = '  <tr>  ' +
                                                        '               <td style="width:70%;border:1px solid gray;padding-left: 20px;font-size:10px"><i> -Cash Back on ERP Revenue</i></td>  ' +
                                                        '               <td style="width:30%;border:1px solid gray;text-align:right;">' + Math.floor(set.refundOnErp) + '</td>' + '  ' +
                                                        '             </tr> '
                                                    if (set.refundOnErp == 0) {
                                                        hideHtml = '';
                                                    }
                                                    var hideHtml2 = '<tr>  ' +
                                                        '               <td style="width:70%;border:1px solid gray">Discount, if any</td>  ' +
                                                        '               <td style="width:30%;border:1px solid gray;text-align:right;">' + Math.floor(set.lessDiscount) + '</td>  ' +
                                                        '             </tr>'
                                                    if (set.lessDiscount == 0) {
                                                        hideHtml2 = '';
                                                    }
                                                    var hideHtml3 = '<tr> ' +
                                                        '                <td style="border-bottom:1px solid gray;">' +
                                                        '                <b>Cash Back on ERP</b>' +
                                                        '                <br>' +
                                                        '                 <b><img src=' + rupee + '>' + Math.floor(set.refundOnErp) + '</b></td>' +
                                                        '            </tr>'
                                                    if (set.refundOnErp == 0) {
                                                        hideHtml3 = '';
                                                    }
                                                    var comm = ' <tr>' +
                                                        '       <td style="width:50%;border:1px solid gray;padding-top:3%;padding-bottom:3%;"><b>Be Us Commission</b><br>' +
                                                        '           <b><img src=' + rupee + '> ' + Math.floor(set.amountPayableToBeu) + '</b></td>' +
                                                        '       <td style="width:50%;border:1px solid gray;padding-top:3%;padding-bottom:3%;"><b>Net Payout to Salon</b><br>' +
                                                        '            <b><img src=' + rupee + '>' + Math.floor(set.netPayable) + '</b></td>' +
                                                        '       </tr>'

                                                    if (set.serviceRevenue < set.amountPayableToBeu) {
                                                        comm = '';
                                                    }
                                                    var disOnPurchase = '<tr>' +
                                                        '<td style="width:70%;border:1px solid gray;padding-left:10px;text-align:center">c) PRODUCT DISCOUNT</td>' +
                                                        '<td style="width:30%;border:1px solid gray;text-align:center">' +
                                                        '<img src="https://ci5.googleusercontent.com/proxy/KG_gbYRhfobN9CREI2___Vkofs1POrINBFbPjKChtPyldRMCdeFvqcr8nhu3GqkYOSbUU3N4U5Jek4zq_R3CGEFBj9Q6EWRFr-ejYs_p8PnxshvTIBvG8b_wXPRaK9WgcyEz9fMzL-vh-Zlfj8OyzQhTSFK_=s0-d-e1-ft#http://res.cloudinary.com/dyqcevdpm/image/upload/c_scale,h_10,w_10/v1501864561/nGbfO_jsm94v.png" class="CToWUd">' +
                                                        Math.floor(set.discountOnPurchase) +
                                                        '<td></tr>'
                                                    if (set.discountOnPurchase < 1) {
                                                        disOnPurchase = '';
                                                    }
                                                    var disOnPurchase2 = '  <tr>' +
                                                        '                                                   <td style="">' +
                                                        '                                                   <b>Product Discount</b>' +
                                                        '                                                   <br>' +
                                                        '                                                   <b><img src=' + rupee + '>' + Math.floor(set.discountOnPurchase) + '</b>' +
                                                        '                                                   </td>' +
                                                        '                                               </tr>'
                                                    if (set.discountOnPurchase < 1) {
                                                        disOnPurchase2 = '';
                                                    }

                                                    //         emailId.push(parlorEmail.email)
                                                    if (set.status == 1) {
                                                        function sendEmail1() {
                                                            var transporter = nodemailer.createTransport('smtps://reports@beusalons.com:wx2t2Tr7pMrqnK2CIqwd3g@smtp.mandrillapp.com');
                                                            var mailOptions = {
                                                                from: 'reports@beusalons.com', // sender address
                                                                // to:["nikitachauhan@beusalons.com"],
                                                                to: emailId,
                                                                cc: beuEmail,
                                                                html: '   <!DOCTYPE html>  ' +
                                                                    '   <html lang=en>  ' +
                                                                    '     ' +
                                                                    '   <head>  ' +
                                                                    '       <meta charset=UTF-8>  ' +
                                                                    '       <title>Settlement Mailer</title>  ' +
                                                                    '   </head>' + '  ' +
                                                                    '     ' +
                                                                    '   <body>  ' +
                                                                    '       <div style=width:80%;margin:auto>  ' +
                                                                    '           <div style=height:120px>  ' +
                                                                    '               <div style=float:left;width:200px;margin-top:2%;margin-left:2%;margin-bottom:2%;zoom:1.2><img alt="Beu salons" src="http://res.cloudinary.com/dyqcevdpm/image/upload/v1499860471/Master_BeU_Logo_June2017_zmsfwt.png" width=150></div>' + '  ' +
                                                                    '           </div><h3 style=width:100%;text-align:center>Settlement Report for ' + set.parlorName + ' for period ' + periodDate + '</h3>  ' + ' ' +
                                                                    '           <div style=" box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);transition: 0.3s;width: 98%;padding:10px;">' + '  ' +
                                                                    '               <table style="width:100%;border:2px solid gray;border-collapse:collapse;text-align:center">  ' +
                                                                    '                   <tr>  ' +
                                                                    '                       <th style="width:100%;border:1px solid gray;text-align:center;background-color: #bfbfbf;padding-top: 1%;padding-bottom: 1%;" colspan="2">Settlement Report</th>' + '  ' +
                                                                    '                   </tr>  ' +
                                                                    '                   <tr>  ' +
                                                                    '                       <td style="width:50%;border:1px solid gray"><b>Name of salon</b></td>  ' +
                                                                    '                       <td style="width:50%;border:1px solid gray"><b>' + set.parlorName + '</b></td>' + '  ' +
                                                                    '                   </tr>  ' +
                                                                    '                   <tr>  ' +
                                                                    '                       <td style="width:50%;border:1px solid gray">Entity name</td>  ' +
                                                                    '                       <td style="width:50%;border:1px solid gray">' + parlorEntityName + '</td>' + '  ' +
                                                                    '                   </tr>  ' +
                                                                    '                   <tr>  ' +
                                                                    '                       <td style="width:50%;border:1px solid gray">Address</td>  ' +
                                                                    '                       <td style="width:50%;border:1px solid gray">' + set.parlorAddress + '</td>' + '  ' +
                                                                    '                   </tr>  ' +
                                                                    '                   <tr>' + '  ' +
                                                                    '                       <td style="width:50%;border:1px solid gray">Period of Settlement</td>  ' +
                                                                    '                       <td style="width:50%;border:1px solid gray">' + periodDate + '</td>  ' +
                                                                    '                   </tr>' + '  ' +
                                                                    '               </table>  ' +
                                                                    '           </div>  ' +
                                                                    '           <!--Start of Graph Table-->' +
                                                                    '            <div style=" box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2)!important;transition: 0.3s!important;width:98%;padding:10px;">' +
                                                                    '            <div>' +
                                                                    '               <table style="width:100%;border:2px solid gray;border-collapse:collapse;text-align:center">' +
                                                                    '                   <tr>' +
                                                                    '                       <th  style="width:100%;border:1px solid gray;background-color: #bfbfbf;padding-top: 1%;padding-bottom: 1%;" colspan="2">Settlement Summary</th>' +
                                                                    '                   </tr>' +
                                                                    '                   <tr>' +
                                                                    '                       <td style="width:50%;">' +
                                                                    '                           <table style="width:100%;border:1px solid gray;border-collapse:collapse;text-align:center;margin-left: 3%;margin-top: 3%;margin-bottom: 3%;">' +
                                                                    '                               <tr>' +
                                                                    '                                   <th style="text-align:center;padding-top:3%;padding-bottom:3%;" colspan="2">' +
                                                                    '                                   <b>Settlement Period_Salon Revenue</b>' +
                                                                    '                                   <br>' +
                                                                    '                                   <b><img src=' + rupee + '>' + Math.floor(set.totalRevenue) + '</b>' +
                                                                    '                                   </th>' +
                                                                    '                               </tr>' +
                                                                    '                               <tr>' +
                                                                    '                                   <td style="width:50%;border:1px solid gray;padding-top:3%;padding-bottom:3%;"><b>Service Revenue</b><br>' +
                                                                    '                                       <b><img src=' + rupee + '>' + Math.floor(set.serviceRevenue) + '</b></td>' +
                                                                    '                                   <td style="width:50%;border:1px solid gray;padding-top:3%;padding-bottom:3%;"><b>Product Revenue</b><br>' +
                                                                    '                                       <b><img src=' + rupee + '>' + Math.floor(set.productRevenue) + '</b></td>' +
                                                                    '                               </tr>' + comm +
                                                                    '                           </table>' +
                                                                    '                       </td>' +
                                                                    '                       <td style="width:50%;"><img  src=' + resultImage1.short_url + ' alt="img" style="width:80%"></td>' +
                                                                    '                  </tr>' +
                                                                    '               </table>' +
                                                                    '           </div>' +
                                                                    '           </div>' +
                                                                    '                 ' +
                                                                    // '           <div style=" box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2)!important;transition: 0.3s!important;width:98%;padding:10px;">' +
                                                                    // '           <div>' +
                                                                    // '               <table style="width:100%;border:2px solid gray;border-collapse:collapse;text-align:center">' +
                                                                    // '                   <tr>' +
                                                                    // '                       <th  style="width:100%;border:1px solid gray;background-color: #bfbfbf;padding-top: 1%;padding-bottom: 1%;" colspan="2">Benefits To Salon</th>' +
                                                                    // '                   </tr>' +
                                                                    // '                   <tr>' +
                                                                    // '                       <td style="width:50%;"><img src=' + resultImage2.short_url + ' alt="img" style="width:100%"></td>' +
                                                                    // '                           <td style="width:50%;">' +
                                                                    // '                               <table style="width:94%;border:1px solid gray;border-collapse:collapse;text-align:center;margin-left: 3%;margin-top: 3%;margin-bottom: 3%;">' +
                                                                    // '                                   <tr>' +
                                                                    // '                                       <td style="width:50%;border:1px solid gray;padding-top:3%;padding-bottom:3%;">' +
                                                                    // '                                           <table style="width:100%;border-collapse:collapse;text-align:center">' +
                                                                    // '                                               <tr>' +
                                                                    // '                                                   <td style="border-bottom:1px solid gray;">' +
                                                                    // '                                                   <b>Freebies Benefit</b>' +
                                                                    // '                                                   <br>' +
                                                                    // '                                                   <b><img src=' + rupee + '>' + Math.floor(set.collectedByLoyalityPoints) + '</b>' +
                                                                    // '                                                   </td>' +
                                                                    // '                                               </tr>' +
                                                                    // '                                               <tr>' +
                                                                    // '                                                   <td style="border-bottom:1px solid gray;">' +
                                                                    // '                                                   <b>Cash Back on ERP</b>' +
                                                                    // '                                                   <br>' +
                                                                    // '                                                   <b><img src=' + rupee + '>' + Math.floor(set.refundOnErp) + '</b></td>' +
                                                                    // '                                               </tr>' +
                                                                    // '                                               <tr>' +
                                                                    // '                                                   <td style="">' +
                                                                    // '                                                   <b>Cash Back on App Transaction</b>' +
                                                                    // '                                                   <br>' +
                                                                    // '                                                   <b><img src=' + rupee + '>' + Math.floor(set.refundFirstAppDigital + set.refundAppDigitalCash + set.refundAppDigitalOnline) + '</b>' +
                                                                    // '                                                   </td>' +
                                                                    // '                                               </tr>' + disOnPurchase2 +

                                                                    // '                                            </table>' +
                                                                    // '                                       </td>' +
                                                                    // '                                       <td style="width:50%;border:1px solid gray;padding-top:3%;padding-bottom:3%;">' +
                                                                    // '                                           <b>Total Benefits</b>' +
                                                                    // '                                           <br>' +
                                                                    // '                                           <b><img src=' + rupee + '>' + Math.floor(set.discountOnPurchase + set.refundOnErp + set.refundFirstAppDigital + set.refundAppDigitalCash + set.refundAppDigitalOnline + set.collectedByLoyalityPoints) + '</b>' +
                                                                    // '                                       </td>' +
                                                                    // '                                   </tr>' +
                                                                    // '                               </table>' +
                                                                    // '                           </td>' +
                                                                    // '                       </tr>' +
                                                                    // '                   </table>' +
                                                                    // '               </div>' +
                                                                    // '           </div>' +
                                                                    '           <!--Start of right table-->  ' +
                                                                    '           <div style="width:46%;padding:10px;float:left">  ' +
                                                                    '               <div style=" box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);transition: 0.3s;margin-top:10px;">' + '  ' +
                                                                    '                   <table style="width:100%;border:2px solid gray;border-collapse:collapse;text-align:center">  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:100%;border:1px solid gray;background-color: #bfbfbf;padding-top: 1%;padding-bottom: 1%;" colspan=2>  ' + '  ' +
                                                                    '                               <b>Revenue Summary</b></tr>  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <th style="width:70%;border:1px solid gray">Particulars</th>  ' +
                                                                    '                           <th style="width:30%;border:1px solid gray">Amount</th>  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:70%;border:1px solid gray">Service Revenue</td>' + '  ' +
                                                                    '                           <td style="width:30%;border:1px solid gray"><img src=' + rupee + '>' + Math.floor(set.serviceRevenue) + '</td>  ' +
                                                                    '                           <tr>  ' +
                                                                    '                               <td style="width:70%;border:1px solid gray">Product Revenue</td>' + '  ' +
                                                                    '                               <td style="width:30%;border:1px solid gray"><img src=' + rupee + '>' + Math.floor(set.productRevenue) + '</td>  ' +
                                                                    '                               <tr>  ' +
                                                                    '                                   <td style="width:70%;border:1px solid gray"><b>Total Revenue</b></td>' + '  ' +
                                                                    '                                   <td style="width:30%;border:1px solid gray"><b><img src=' + rupee + '>' + Math.floor(set.totalRevenue) + '</b></td>  ' +
                                                                    '                   </table>  ' +
                                                                    '               </div>  ' +
                                                                    '               <div style=" box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);transition: 0.3s;margin-top:25px;">' + '  ' +
                                                                    '                   <table style="width:100%;border:2px solid gray;border-collapse:collapse;text-align:center">  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:100%;border:1px solid gray;background-color: #bfbfbf;padding-top: 1%;padding-bottom: 1%;" colspan="2"><b>Collection Summary</b></td>' + '  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <th style="width:70%;border:1px solid gray">Particulars</th>  ' +
                                                                    '                           <th style="width:30%;border:1px solid gray">Amount</th>  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:70%;border:1px solid gray;text-align:center;">Collected By Salon</td>' + '  ' +
                                                                    '                           <td style="width:30%;border:1px solid gray;text-align:center;"><img src=' + rupee + '>' + Math.floor(set.totalCollectionByParlor) + '</td>  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:70%;border:1px solid gray;text-align:center;">Collected by Be U</td>' + '  ' +
                                                                    '                           <td style="width:30%;border:1px solid gray;text-align:center;"><img src=' + rupee + '>' + Math.floor(set.totalCollectionByBeu) + '</td>  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:70%;border:1px solid gray;text-align:right;padding-right:12px;font-size:10px;"><i>Through App/Website<i></td>' + '  ' +
                                                                    '                           <td style="width:30%;border:1px solid gray;text-align:center;font-size:10px;"><img src=' + rupee + '>' + Math.floor(set.collectedByApp) + '</td>  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:70%;border:1px solid gray;text-align:right;padding-right:37px;font-size:10px;"><i>Through Affiliates</i></td>' + '  ' +
                                                                    '                           <td style="width:30%;border:1px solid gray;text-align:center;font-size:10px;"><img src=' + rupee + '>' + Math.floor(set.collectedByAffiliates) + '</td>  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:70%;border:1px solid gray;text-align:right;padding-right:41px;font-size:10px;"><i>Through Loyality</i></td>' + '  ' +
                                                                    '                           <td style="width:30%;border:1px solid gray;text-align:center;font-size:10px;"><img src=' + rupee + '>' + Math.floor(set.collectedByLoyalityPoints) + '</td>  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:70%;border:1px solid gray;text-align:center;"><b>Total Collection</b></td>' + '  ' +
                                                                    '                           <td style="width:30%;border:1px solid gray;text-align:center;"><b><img src=' + rupee + '>' + Math.floor(set.totalCollection) + '</b></td>  ' +
                                                                    '                       </tr>  ' +
                                                                    '                   </table>  ' +
                                                                    '               </div>  ' +

                                                                    '           </div>  ' +
                                                                    '           <!--End of right table-->  ' +
                                                                    '           <!--start of right table-->  ' +
                                                                    '           <div style="width:50%;float:left;margin-top:19px;padding-left: 0.5%;">  ' +
                                                                    '               <div style=" box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);transition: 0.3s;">' + '  ' +
                                                                    '                   <table style="width:100%;border:2px solid gray;border-collapse:collapse;text-align:left">  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:100%;border:1px solid gray;text-align:center;background-color: #bfbfbf;padding-top: 1%;padding-bottom: 1%;" colspan=2>' + '  ' +
                                                                    '                               <b>Be U Payout</b></tr>  ' +
                                                                    '                        <tr>  ' +
                                                                    '                           <th style="width:70%;border:1px solid gray;text-align:center">Particulars</th>  ' +
                                                                    '                           <th style="width:30%;border:1px solid gray;text-align:center">Amount</th>  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <td style="width:70%;border:1px solid gray;text-align:center">Amount Collected by Be U</td>  ' +
                                                                    '                       <td style="width:30%;border:1px solid gray;text-align:center;"><img src=' + rupee + '>' + Math.floor(set.collectedByAffiliates + set.collectedByApp) + '</td>' + '  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:70%;border:1px solid gray;padding-left: 31px;text-align:center;font-size:10px;"> <i>-Online Payment Fee</i></td>  ' +
                                                                    '                           <td style="width:30%;border:1px solid gray;text-align:center;text-align:center"><img src=' + rupee + '>' + Math.floor(set.onlinePaymentFee) + '</td>' + '  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:70%;border:1px solid gray;text-align:center;padding-right:6%;">Salon Benefits by Be U</td>  ' +
                                                                    '                           <td style="width:30%;border:1px solid gray;text-align:center;"></td>' + '  ' +
                                                                    '                       </tr>  ' +
                                                                    // '                       <tr>  ' +
                                                                    // '                           <td style="width:70%;border:1px solid gray;padding-right:15%;text-align:center"> a)Cash Back</td>  ' +
                                                                    // '                           <td style="width:30%;border:1px solid gray;text-align:center;"></td>' + '  ' +
                                                                    // '                       </tr>  ' +
                                                                    // '                       <tr>  ' +
                                                                    // '                           <td style="width:70%;border:1px solid gray;padding-left: 31px;text-align:center;font-size:10px;"> <i>-Cash Back on ERP_Revenue</i></td>  ' +
                                                                    // '                           <td style="width:30%;border:1px solid gray;text-align:center;text-align:center"><img src=' + rupee + '>' + Math.floor(set.refundOnErp) + '</td>' + '  ' +
                                                                    // '                       </tr>  ' +
                                                                    // '                       <tr>  ' +
                                                                    // '                           <td style="width:70%;border:1px solid gray;padding-left: 39px;text-align:center;font-size:10px;"><i>-Cash Back on App_Transaction</i></td>  ' +
                                                                    // '                           <td style="width:30%;border:1px solid gray;text-align:center;"><img src=' + rupee + '>' + Math.floor(set.refundFirstAppDigital + set.refundAppDigitalCash + set.refundAppDigitalOnline) + '</td>  ' +
                                                                    // '                       </tr>' + '  ' +
                                                                    // '                       <!--<tr>-->  ' +
                                                                    // '                           <!--<td style="width:70%;border:1px solid gray;text-align:center">b) Be U Purcahse Scheme Benefits</td>-->  ' +
                                                                    // '                           <!--<td style="width:30%;border:1px solid gray;text-align:center;">&#45;&#45;&#45;&#45;</td>' + '-->  ' +
                                                                    // '                       <!--</tr>-->  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:70%;border:1px solid gray;padding-left: 10px;text-align:center;">Freebies Benefits</td>  ' +
                                                                    '                           <td style="width:30%;border:1px solid gray;text-align:center;"><img src=' + rupee + '>' + Math.floor(set.collectedByLoyalityPoints) + '</td>  ' +
                                                                    '                       </tr>' + disOnPurchase +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:70%;border:1px solid gray;text-align:center;"><b>Total Salon Benefits by Be U </b></td>  ' +
                                                                    '                           <td style="width:30%;border:1px solid gray;text-align:center;"><img src=' + rupee + '>' + Math.floor(set.discountOnPurchase + set.collectedByLoyalityPoints + set.refundFirstAppDigital + set.refundAppDigitalCash + set.refundAppDigitalOnline + set.refundOnErp) + '</td>' + '  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <!--<tr>-->  ' +
                                                                    '                           <!--<td style="width:70%;border:1px solid gray;text-align:center;"><b>Grand Total {A+B}</b></td>-->  ' +
                                                                    '                           <!--<td style="width:30%;border:1px solid gray;text-align:center;">&#45;&#45;&#45;&#45;</td>' + '-->  ' +
                                                                    '                       <!--</tr>-->  ' +
                                                                    '                   </table>  ' +
                                                                    '               </div>  ' +
                                                                    '               <div style=" box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);transition: 0.3s;margin-top:21px;">  ' +
                                                                    '                   <table style="width:100%;border:2px solid gray;border-collapse:collapse;text-align:left">' + '  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:100%;border:1px solid gray;text-align:center;background-color: #bfbfbf;padding-top: 1%;padding-bottom: 1%;" colspan="2"><b>Salons Payout</b></td>  ' +
                                                                    '                       </tr>  ' +
                                                                    '                        <tr>  ' +
                                                                    '                           <th style="width:70%;border:1px solid gray;text-align:center">Particulars</th>  ' +
                                                                    '                           <th style="width:30%;border:1px solid gray;text-align:center">Amount</th>  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:70%;border:1px solid gray;text-align:center">Amount payable to Be U</td>' + '  ' +
                                                                    '                           <td style="width:30%;border:1px solid gray;text-align:center;"><img src=' + rupee + '>' + Math.floor(set.amountPayableToBeu) + '</td>  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:70%;border:1px solid gray;font-size:12px;"><b>Final Amount Payable to Salon/(Be U)</b></td>' + '  ' +
                                                                    '                           <td style="width:30%;border:1px solid gray;text-align:center;"><b><img src=' + rupee + '>' + Math.floor(set.netPayable) + '</b></td>  ' +
                                                                    '                       </tr>  ' +
                                                                    // '                       <td style="width:70%;border:1px solid gray">Less: Discount</td>  '  +
                                                                    // '                       <td style="width:30%;border:1px solid gray;text-align:center;">'+Math.floor(set.lessDiscount)+'</td>' + '  '  +
                                                                    // '                       <tr>  '  +
                                                                    // '                           <td style="width:70%;border:1px solid gray">Amount payable to Be U(After Discount)</td>  '  +
                                                                    // '                           <td style="width:30%;border:1px solid gray;text-align:center;">'+Math.floor(set.amountPayableToBeuAfterDiscount)+'</td>' + '  '  +
                                                                    // '                       </tr>  '  +
                                                                    // '                       <tr>  '  +
                                                                    // '                           <td style="width:50%;border:1px solid gray">Add: CGST @ 9%</td>  '  +
                                                                    // '                           <td style="border:1px solid gray;text-align:center;">'+Math.floor(set.amountPayableToBeuAfterDiscount*.09)+'</td>  '  +
                                                                    // '                       </tr>  '  +
                                                                    // '                       <tr>  '  +
                                                                    // '                           <td style="width:70%;border:1px solid gray">Add: SGST @ 9%</td>' + '  '  +
                                                                    // '                           <td style="width:30%;border:1px solid gray;text-align:center;">'+Math.floor(set.amountPayableToBeuAfterDiscount*.09)+'</td>  '  +
                                                                    // '                       </tr>  '  +
                                                                    // '                       <tr>  '  +
                                                                    // '                           <td style="width:70%;border:1px solid gray"><b>Total Amount Payable to Be U(Incl. Taxes)</b></td>' + '  '  +
                                                                    // '                           <td style="width:30%;border:1px solid gray;text-align:center;">'+Math.floor(set.amountPayableToBeuAfterTax)+'</td>  '  +
                                                                    // '                       </tr>  '  +
                                                                    '                   </table>  ' +
                                                                    '               </div>  ' +
                                                                    // '               <div style=" box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);transition: 0.3s;margin-top:5px;">' + '  '  +
                                                                    // '                   <table style="width:100%;border:1px solid gray;border-collapse:collapse;text-align:left">  '  +
                                                                    // // '                       <tr>  '  +
                                                                    // // '                           <td style="width:70%;border:1px solid gray">Net amount payable to Salon</td>' + '  '  +
                                                                    // // '                           <td style="width:30%;border:1px solid gray">'+Math.floor(set.netPayable)+'</td>  '  +
                                                                    // // '                       </tr>  '  +
                                                                    // // '                       <tr>  '  +
                                                                    // // '                           <td style="width:70%;border:1px solid gray">Previous balance outstanding </td>  '  +
                                                                    // // '                           <td style="width:30%;border:1px solid gray;text-align:center;">'+Math.floor(set.amountPayableToBeuAfterTax)+'</td>' + '  '  +
                                                                    // // '                       </tr>  '  +
                                                                    // '                       <tr>  '  +
                                                                    // '                           <td style="width:50%;border:1px solid gray">Final Amount Payable to Salon/(Be U)</td>  '  +
                                                                    // '                           <td style="border:1px solid gray;text-align:center;">'+Math.floor(set.netPayable)+'</td>  '  +
                                                                    // '                       </tr>  '  +
                                                                    // '                   </table>' + '  '  +
                                                                    // '               </div>  '  +
                                                                    '           </div>  ' +
                                                                    '               <div style="width:98%; box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);transition: 0.3s;margin-top:35%;padding: 10px;">' + '  ' +
                                                                    '                   <table style="width:100%;border:2px solid gray;border-collapse:collapse;text-align:left">  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:100%;border:1px solid gray;text-align:center;background-color: #bfbfbf;padding-top: 1%;padding-bottom: 1%;" colspan="2"><b>Final Settlement Terms</b></td>' + '  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <th style="width:70%;border:1px solid gray;text-align:center;">Particulars</th>  ' +
                                                                    '                           <th style="width:30%;border:1px solid gray;text-align:center;">Amount</th>' + '  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:70%;border:1px solid gray;text-align:center;">Royalty %age_Service Revenue</td>  ' +
                                                                    '                           <td style="width:30%;border:1px solid gray;text-align:center;">' + set.royalityPercentageService + '%</td>' + '  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:70%;border:1px solid gray;text-align:center;">Royalty %age_Product Sale</td>  ' +
                                                                    '                           <td style="width:30%;border:1px solid gray;text-align:center;">' + set.royalityPercentageProduct + '%</td>' + '  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:70%;border:1px solid gray;text-align:center;">Discount, if any</td>  ' +
                                                                    '                           <td style="width:30%;border:1px solid gray;text-align:center;">' + Math.floor(set.lessDiscount) + '%</td>  ' +
                                                                    '                       </tr>' + '  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:70%;border:1px solid gray;text-align:center;">Minimum Guarantee</td>  ' +
                                                                    '                           <td style="width:30%;border:1px solid gray;text-align:center;"><img src=' + rupee + '>' + parlor.minimumGuarantee + '</td>  ' +
                                                                    '                       </tr>' + '  ' +
                                                                    '                   </table>  ' +
                                                                    '               </div>  ' +
                                                                    // '           <div style=" box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);transition: 0.3s;width:98%;margin-top:1%;padding: 10px;">  ' +
                                                                    // '               <table style="width:100%;border:2px solid gray;border-collapse:collapse;text-align:center">' + '  ' +
                                                                    // '                   <tr>  ' +
                                                                    // '                       <th style="width:100%;border:1px solid gray;background-color: #bfbfbf;padding-top: 1%;padding-bottom: 1%;" colspan="2">Benefits to Salon by Be U - Summary</th>  ' +
                                                                    // '                   </tr>  ' +
                                                                    // '                        <tr>  ' +
                                                                    // '                           <th style="width:70%;border:1px solid gray">Particulars</th>  ' +
                                                                    // '                           <th style="width:30%;border:1px solid gray">Amount</th>  ' +
                                                                    // '                       </tr>  ' +
                                                                    // '                   <tr>  ' +
                                                                    // '                       <td style="width:70%;border:1px solid gray">Freebies_Payout_July 2017_Till Date</td>' + '  ' +
                                                                    // '                       <td style="width:30%;border:1px solid gray"><img src=' + rupee + '>' + Math.floor(set.freebiesPayoutJulyTillDate) + '</td>  ' +
                                                                    // '                   </tr>  ' +
                                                                    // '                   <td style="width:50%;border:1px solid gray">Freebies_Payout_Since Joining</td>  '  +
                                                                    // '                   <td style="width:50%;border:1px solid gray">'+Math.floor(set.freebiesPayoutSinceJoining)+'</td>  '  +
                                                                    // '                   <tr>' + '  ' +
                                                                    // '                       <td style="width:70%;border:1px solid gray">Cash Back on ERP & App_Payout_July 2017_Till Date</td>  ' +
                                                                    // '                       <td style="width:30%;border:1px solid gray"><img src=' + rupee + '>' + Math.floor(set.cashBackErpAndAppPayoutJulyTillDate) + '</td>' + '  ' +
                                                                    // '                   </tr>    <tr>  ' +
                                                                    // '                       <td style="width:70%;border:1px solid gray"><b>Grand Total_Benefits_July 17_Till Date</b></td>' + '  ' +
                                                                    // '                       <td style="width:30%;border:1px solid gray"><b><img src=' + rupee + '>' + Math.floor(set.freebiesPayoutJulyTillDate + set.cashBackErpAndAppPayoutJulyTillDate) + '</b></td>  ' +
                                                                    // '                   </tr>  ' +
                                                                    // '                   <tr>  '  +
                                                                    // '                       <td style="width:50%;border:1px solid gray">Grand Total_Benefits_Since Joining</td>  '  +
                                                                    // '                       <td style="width:50%;border:1px solid gray">'+Math.floor(set.freebiesPayoutSinceJoining+set.cashBackErpAndAppPayoutSinceJoining)+'</td>' + '  '  +
                                                                    // '                   </tr>  '  +
                                                                    // '               </table>  ' +
                                                                    // '           </div>  ' +
                                                                    // '            end right table  '  +
                                                                    '       </div>  ' +
                                                                    '   </body>  ' +
                                                                    '     ' +
                                                                    '  </html>  ',
                                                                // to: emailId,
                                                                // cc: beuEmail,// list of receivers
                                                                // html:'<!DOCTYPE html><html lang=en><meta charset=UTF-8><title>Settlement Mailer</title><div style=width:60%;margin:auto><div style=background-color:#dfdfdf;height:120px><div style=float:left;width:200px;margin-top:2%;margin-left:2%;margin-bottom:2%;zoom:1.2><img alt="Beu salons"src=http://res.cloudinary.com/dyqcevdpm/image/upload/v1491484496/beu-logo_srvetg.png width=150></div></div><div><h3 style=width:100%;text-align:center>Settlement Report for '+set.parlorName+' for period '+periodDate+'</h3><table style="width:100%;border:1px solid gray;border-collapse:collapse;text-align:center"><tr><td style="width:50%;border:1px solid gray">Name of salon<td style="width:50%;border:1px solid gray">'+set.parlorName+'<tr><td style="width:50%;border:1px solid gray">Entity name<td style="width:50%;border:1px solid gray">'+parlorEntityName+'<tr><td style="width:50%;border:1px solid gray">Address<td style="width:50%;border:1px solid gray">'+set.parlorAddress+'<tr><td style="width:50%;border:1px solid gray">Date of Settlement<td style=width:50%>'+dateEnd+'<tr><td style="width:50%;border:1px solid gray">Period of Settlement<td style="width:50%;border:1px solid gray">'+periodDate+'</table></div><div><h3 style=width:100%;text-align:center>Service Revenue</h3><table style="width:100%;border:1px solid gray;border-collapse:collapse;text-align:center"><tr><td style="width:50%;border:1px solid gray">Service Revenue<td style="width:50%;border:1px solid gray">'+Math.floor(set.serviceRevenue)+'<tr><td style="width:50%;border:1px solid gray">Product Revenue<td style="width:50%;border:1px solid gray">'+Math.floor(set.productRevenue)+'<tr><td style="width:50%;border:1px solid gray">Total Revenue<td style="width:50%;border:1px solid gray">'+Math.floor(set.totalRevenue)+'</table></div><div><h3 style=width:100%;text-align:center>Membership Revenue</h3><table style="width:100%;border:1px solid gray;border-collapse:collapse;text-align:center"><tr><td style="width:50%;border:1px solid gray">Membership Sold<td style="width:50%;border:1px solid gray">'+set.membershipSold+'</table></div><div><h3 style=width:100%;text-align:center>Collection Summary</h3><table style="width:100%;border:1px solid gray;border-collapse:collapse;text-align:center"><tr><td style="width:50%;border:1px solid gray;text-align:left;padding-left:5%">Collected By Salon<td style="width:50%;border:1px solid gray">'+Math.floor(set.totalCollectionByParlor)+'<tr><td style="width:50%;border:1px solid gray;text-align:left;padding-left:5%">Collected by Be U<td style="width:50%;border:1px solid gray">'+Math.floor(set.totalCollectionByBeu)+'<tr><td style="width:50%;border:1px solid gray">Through App/Website<td style="width:50%;border:1px solid gray;padding-left:4%">'+Math.floor(set.collectedByApp)+'<tr><td style="width:50%;border:1px solid gray;padding-right:3%">Through Affiliates<td style="width:50%;border:1px solid gray;padding-left:4%">'+Math.floor(set.collectedByAffiliates)+'<tr><td style="width:50%;border:1px solid gray;padding-right:4%">Through Loyality<td style="width:50%;border:1px solid gray;padding-left:4%">'+Math.floor(set.collectedByLoyalityPoints)+'<tr><td style="width:50%;border:1px solid gray;text-align:left;padding-left:5%">Total Collection<td style="width:50%;border:1px solid gray">'+Math.floor(set.totalCollection)+'</table></div><div><h3 style=width:100%;text-align:center>Model Summary</h3><table style="width:100%;border:1px solid gray;border-collapse:collapse;text-align:center"><tr><td style="width:50%;border:1px solid gray">Royalty Percentage-Service<td style="width:50%;border:1px solid gray">'+royalityPercentageService+'<tr><td style="width:50%;border:1px solid gray">Royalty Percentage-Product<td style="width:50%;border:1px solid gray">'+set.royalityPercentageProduct+'%<tr><td style="width:50%;border:1px solid gray">Discount Percentage<td style="width:50%;border:1px solid gray">'+set.discountPercentage+'%</table></div><div><h3 style=width:100%;text-align:center>Final Settlement Summary</h3><table style="width:100%;border:1px solid gray;border-collapse:collapse;text-align:center"><tr><td style="width:100%;border:1px solid gray"colspan=2><b>Be U Payout</b>' +
                                                                // '<tr><td style="width:50%;border:1px solid gray">Amount Payable to Be U (incl GST)<td style="width:50%;border:1px solid gray">'+Math.floor(set.amountPayableToBeu)+'' +
                                                                // '<tr><td style="width:50%;border:1px solid gray">Amount Payable to Be U(After Discount)<td style="width:50%;border:1px solid gray">'+Math.floor(set.amountPayableToBeu-set.refundAppDigitalCash-set.refundAppDigitalOnline-set.refundOnErp )+
                                                                // '<tr><td style="width:100%;border:1px solid gray"colspan=2><b>Salon Payout</b>' +
                                                                // '<tr><td style="width:50%;border:1px solid gray">' + 'Amount Collected by Be U<td style="width:50%;border:1px solid gray">'+Math.floor(set.totalCollectionByBeu)+
                                                                // '<tr><td style="width:50%;border:1px solid gray">' + 'Amount Refund on App Digital transaction<td style="width:50%;border:1px solid gray">'+Math.floor(set.refundAppDigitalCash+set.refundAppDigitalOnline)+
                                                                // '<tr><td style="width:50%;border:1px solid gray">' + 'Amount Refund on Erp transaction<td style="width:50%;border:1px solid gray">'+Math.floor(set.refundOnErp)+
                                                                // '<tr><td style="width:50%;border:1px solid gray">Gross Amount(Recevable from BeU)<td style="border:1px solid gray">'+Math.floor(set.totalCollectionByBeu+set.refundOnErp+set.refundAppDigitalCash+set.refundAppDigitalOnline)+'</table></div><div style=padding-top:2%><table style="width:100%;border:1px solid gray;border-collapse:collapse;text-align:center"><tr><td style="width:50%;border:1px solid gray">Net Amount Payable to BeU/(Receivable from BeU)<td style="width:50%;border:1px solid gray">'+Math.floor(set.netPayable)+'</table></div></div><div style=padding-top:2%><table style="width:100%;border:1px solid gray;border-collapse:collapse;text-align:center"><tr><td style="width:50%;border:1px solid gray">Previous balance outstanding - Payable to Be U<td style="width:50%;border:1px solid gray">'+set.previousPendingAmount+'<tr><td style="width:50%;border:1px solid gray">Less: Adjusted against current period dues<td style="width:50%;border:1px solid gray">'+((set.previousPendingAmount - set.pendingAmount) <0 ? 0 : (set.previousPendingAmount-set.pendingAmount))+'<tr><td style="width: 50%;border: 1px solid gray;"> Add: Current Period dues payable to Be U<td style="width: 50%;border: 1px solid gray;">'+set.pendingAmount+'<tr><td style="width:50%;border:1px solid gray">Balance outstanding<td style="width:50%;border:1px solid gray">'+set.pendingAmount+'</table></div><div style=padding-top:2%><table style="width:100%;border:1px solid gray;border-collapse:collapse;text-align:center"><tr><td style="width:50%;border:1px solid gray">Net Amount to be transferred<td style="width:50%;border:1px solid gray">'+Math.floor(set.netAmountTransferred)+'</table></div>',
                                                                subject: 'Settlement Report' // Subject line
                                                            };
                                                            transporter.sendMail(mailOptions, function(error, info) {
                                                                if (error)
                                                                    console.log(error);
                                                                else {
                                                                    console.log('Message sent: ' + info.response);
                                                                    SettlementReport.update({ _id: set.id }, { paidDate: new Date() }, function(err, settleUpdate) {
                                                                        if (!err)
                                                                            return res.json(CreateObjService.response(false, "Mail sent successfully!"));
                                                                        else
                                                                            return res.json(CreateObjService.response(false, "there is some error!"));
                                                                    })
                                                                }
                                                            });
                                                        }

                                                        sendEmail1();

                                                        // var data1 = "Dear " + set.parlorName + ", Your settlement report for the period " + periodDate + " has been generated successfully. Please check your email. Gross amount receivable- Rs." + Math.floor(set.totalCollectionByBeu) + " , Amount Payable (Inclusive of taxes)- Rs." + Math.floor(grossTax) + ", Net Amount " + payableAmount + ".For any queries please call on 9873341506."
                                                        // var usermessage1 = Appointment.settlementSms(number, data1);
                                                        // Appointment.sendSMS(usermessage1, function (e) {
                                                        //     cb();
                                                        //     return console.log('SMS sent successfully');
                                                        // });
                                                    } else {
                                                        function sendEmail() {
                                                            var transporter = nodemailer.createTransport('smtps://reports@beusalons.com:wx2t2Tr7pMrqnK2CIqwd3g@smtp.mandrillapp.com');
                                                            var rupee = 'http://res.cloudinary.com/dyqcevdpm/image/upload/c_scale,h_10,w_10/v1501864561/nGbfO_jsm94v.png'
                                                            var mailOptions = {
                                                                from: 'reports@beusalons.com', // sender address
                                                                // to:["nikitachauhan@beusalons.com"],
                                                                to: emailId,
                                                                cc: beuEmail,
                                                                html: '   <!DOCTYPE html>  ' +
                                                                    '   <html lang=en>  ' +
                                                                    '     ' +
                                                                    '   <head>  ' +
                                                                    '       <meta charset=UTF-8>  ' +
                                                                    '       <title>Settlement Mailer</title>  ' +
                                                                    '   </head>' + '  ' +
                                                                    '     ' +
                                                                    '   <body>  ' +
                                                                    '       <div style=width:80%;margin:auto>  ' +
                                                                    '           <div style=height:120px>  ' +
                                                                    '               <div style=float:left;width:200px;margin-top:2%;margin-left:2%;margin-bottom:2%;zoom:1.2><img alt="Beu salons" src="http://res.cloudinary.com/dyqcevdpm/image/upload/v1499860471/Master_BeU_Logo_June2017_zmsfwt.png" width=150></div>' + '  ' +
                                                                    '           </div><h3 style=width:100%;text-align:center>Settlement Report for ' + set.parlorName + ' for period ' + periodDate + '</h3>  ' + ' ' +
                                                                    '           <div style=" box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);transition: 0.3s;width: 98%;padding:10px;">' + '  ' +
                                                                    '               <table style="width:100%;border:2px solid gray;border-collapse:collapse;text-align:center">  ' +
                                                                    '                   <tr>  ' +
                                                                    '                       <th style="width:100%;border:1px solid gray;text-align:center;background-color: #bfbfbf;padding-top: 1%;padding-bottom: 1%;" colspan="2">Settlement Report</th>' + '  ' +
                                                                    '                   </tr>  ' +
                                                                    '                   <tr>  ' +
                                                                    '                       <td style="width:50%;border:1px solid gray"><b>Name of salon</b></td>  ' +
                                                                    '                       <td style="width:50%;border:1px solid gray"><b>' + set.parlorName + '</b></td>' + '  ' +
                                                                    '                   </tr>  ' +
                                                                    '                   <tr>  ' +
                                                                    '                       <td style="width:50%;border:1px solid gray">Entity name</td>  ' +
                                                                    '                       <td style="width:50%;border:1px solid gray">' + parlorEntityName + '</td>' + '  ' +
                                                                    '                   </tr>  ' +
                                                                    '                   <tr>  ' +
                                                                    '                       <td style="width:50%;border:1px solid gray">Address</td>  ' +
                                                                    '                       <td style="width:50%;border:1px solid gray">' + set.parlorAddress + '</td>' + '  ' +
                                                                    '                   </tr>  ' +
                                                                    '                   <tr>' + '  ' +
                                                                    '                       <td style="width:50%;border:1px solid gray">Period of Settlement</td>  ' +
                                                                    '                       <td style="width:50%;border:1px solid gray">' + periodDate + '</td>  ' +
                                                                    '                   </tr>' + '  ' +
                                                                    '               </table>  ' +
                                                                    '           </div>  ' +
                                                                    '           <!--Start of Graph Table-->' +
                                                                    '            <div style=" box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2)!important;transition: 0.3s!important;width:98%;padding:10px;">' +
                                                                    '            <div>' +
                                                                    '               <table style="width:100%;border:2px solid gray;border-collapse:collapse;text-align:center">' +
                                                                    '                   <tr>' +
                                                                    '                       <th  style="width:100%;border:1px solid gray;background-color: #bfbfbf;padding-top: 1%;padding-bottom: 1%;" colspan="2">Settlement Summary</th>' +
                                                                    '                   </tr>' +
                                                                    '                   <tr>' +
                                                                    '                       <td style="width:50%;">' +
                                                                    '                           <table style="width:100%;border:1px solid gray;border-collapse:collapse;text-align:center;margin-left: 3%;margin-top: 3%;margin-bottom: 3%;">' +
                                                                    '                               <tr>' +
                                                                    '                                   <th style="text-align:center;padding-top:3%;padding-bottom:3%;" colspan="2">' +
                                                                    '                                   <b>Settlement Period_Salon Revenue</b>' +
                                                                    '                                   <br>' +
                                                                    '                                   <b><img src=' + rupee + '>' + Math.floor(set.totalRevenue) + '</b>' +
                                                                    '                                   </th>' +
                                                                    '                               </tr>' +
                                                                    '                               <tr>' +
                                                                    '                                   <td style="width:50%;border:1px solid gray;padding-top:3%;padding-bottom:3%;"><b>Service Revenue</b><br>' +
                                                                    '                                       <b><img src=' + rupee + '>' + Math.floor(set.serviceRevenue) + '</b></td>' +
                                                                    '                                   <td style="width:50%;border:1px solid gray;padding-top:3%;padding-bottom:3%;"><b>Product Revenue</b><br>' +
                                                                    '                                       <b><img src=' + rupee + '>' + Math.floor(set.productRevenue) + '</b></td>' +
                                                                    '                               </tr>' + comm +
                                                                    '                           </table>' +
                                                                    '                       </td>' +
                                                                    '                       <td style="width:50%;"><img  src=' + resultImage1.short_url + ' alt="img" style="width:80%"></td>' +
                                                                    '                  </tr>' +
                                                                    '               </table>' +
                                                                    '           </div>' +
                                                                    '           </div>' +
                                                                    '                 ' +
                                                                    // '           <div style=" box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2)!important;transition: 0.3s!important;width:98%;padding:10px;">' +
                                                                    // '           <div>' +
                                                                    // '               <table style="width:100%;border:2px solid gray;border-collapse:collapse;text-align:center">' +
                                                                    // '                   <tr>' +
                                                                    // '                       <th  style="width:100%;border:1px solid gray;background-color: #bfbfbf;padding-top: 1%;padding-bottom: 1%;" colspan="2">Benefits To Salon</th>' +
                                                                    // '                   </tr>' +
                                                                    // '                   <tr>' +
                                                                    // '                       <td style="width:50%;"><img src=' + resultImage2.short_url + ' alt="img" style="width:100%"></td>' +
                                                                    // '                           <td style="width:50%;">' +
                                                                    // '                               <table style="width:94%;border:1px solid gray;border-collapse:collapse;text-align:center;margin-left: 3%;margin-top: 3%;margin-bottom: 3%;">' +
                                                                    // '                                   <tr>' +
                                                                    // '                                       <td style="width:50%;border:1px solid gray;padding-top:3%;padding-bottom:3%;">' +
                                                                    // '                                           <table style="width:100%;border-collapse:collapse;text-align:center">' +
                                                                    // '                                               <tr>' +
                                                                    // '                                                   <td style="border-bottom:1px solid gray;">' +
                                                                    // '                                                   <b>Freebies Benefit</b>' +
                                                                    // '                                                   <br>' +
                                                                    // '                                                   <b><img src=' + rupee + '>' + Math.floor(set.collectedByLoyalityPoints) + '</b>' +
                                                                    // '                                                   </td>' +
                                                                    // '                                               </tr>' +
                                                                    // '                                               <tr>' +
                                                                    // '                                                   <td style="border-bottom:1px solid gray;">' +
                                                                    // '                                                   <b>Cash Back on ERP</b>' +
                                                                    // '                                                   <br>' +
                                                                    // '                                                   <b><img src=' + rupee + '>' + Math.floor(set.refundOnErp) + '</b></td>' +
                                                                    // '                                               </tr>' +
                                                                    // '                                               <tr>' +
                                                                    // '                                                   <td style="">' +
                                                                    // '                                                   <b>Cash Back on App Transaction</b>' +
                                                                    // '                                                   <br>' +
                                                                    // '                                                   <b><img src=' + rupee + '>' + Math.floor(set.refundFirstAppDigital + set.refundAppDigitalCash + set.refundAppDigitalOnline) + '</b>' +
                                                                    // '                                                   </td>' +
                                                                    // '                                               </tr>' + disOnPurchase2 +
                                                                    // '                                            </table>' +
                                                                    // '                                       </td>' +
                                                                    // '                                       <td style="width:50%;border:1px solid gray;padding-top:3%;padding-bottom:3%;">' +
                                                                    // '                                           <b>Total Benefits</b>' +
                                                                    // '                                           <br>' +
                                                                    // '                                           <b><img src=' + rupee + '>' + Math.floor(set.discountOnPurchase + set.refundOnErp + set.refundFirstAppDigital + set.refundAppDigitalCash + set.refundAppDigitalOnline + set.collectedByLoyalityPoints) + '</b>' +
                                                                    // '                                       </td>' +
                                                                    // '                                   </tr>' +
                                                                    // '                               </table>' +
                                                                    // '                           </td>' +
                                                                    // '                       </tr>' +
                                                                    // '                   </table>' +
                                                                    // '               </div>' +
                                                                    // '           </div>' +
                                                                    '           <!--Start of right table-->  ' +
                                                                    '           <div style="width:46%;padding:10px;float:left">  ' +
                                                                    '               <div style=" box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);transition: 0.3s;margin-top:10px;">' + '  ' +
                                                                    '                   <table style="width:100%;border:2px solid gray;border-collapse:collapse;text-align:center">  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:100%;border:1px solid gray;background-color: #bfbfbf;padding-top: 1%;padding-bottom: 1%;" colspan=2>  ' + '  ' +
                                                                    '                               <b>Revenue Summary</b></tr>  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <th style="width:70%;border:1px solid gray">Particulars</th>  ' +
                                                                    '                           <th style="width:30%;border:1px solid gray">Amount</th>  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:70%;border:1px solid gray">Service Revenue</td>' + '  ' +
                                                                    '                           <td style="width:30%;border:1px solid gray"><img src=' + rupee + '>' + Math.floor(set.serviceRevenue) + '</td>  ' +
                                                                    '                           <tr>  ' +
                                                                    '                               <td style="width:70%;border:1px solid gray">Product Revenue</td>' + '  ' +
                                                                    '                               <td style="width:30%;border:1px solid gray"><img src=' + rupee + '>' + Math.floor(set.productRevenue) + '</td>  ' +
                                                                    '                               <tr>  ' +
                                                                    '                                   <td style="width:70%;border:1px solid gray"><b>Total Revenue</b></td>' + '  ' +
                                                                    '                                   <td style="width:30%;border:1px solid gray"><b><img src=' + rupee + '>' + Math.floor(set.totalRevenue) + '</b></td>  ' +
                                                                    '                   </table>  ' +
                                                                    '               </div>  ' +
                                                                    '               <div style=" box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);transition: 0.3s;margin-top:25px;">' + '  ' +
                                                                    '                   <table style="width:100%;border:2px solid gray;border-collapse:collapse;text-align:center">  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:100%;border:1px solid gray;background-color: #bfbfbf;padding-top: 1%;padding-bottom: 1%;" colspan="2"><b>Collection Summary</b></td>' + '  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <th style="width:70%;border:1px solid gray">Particulars</th>  ' +
                                                                    '                           <th style="width:30%;border:1px solid gray">Amount</th>  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:70%;border:1px solid gray;text-align:center;">Collected By Salon</td>' + '  ' +
                                                                    '                           <td style="width:30%;border:1px solid gray;text-align:center;"><img src=' + rupee + '>' + Math.floor(set.totalCollectionByParlor) + '</td>  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:70%;border:1px solid gray;text-align:center;">Collected by Be U</td>' + '  ' +
                                                                    '                           <td style="width:30%;border:1px solid gray;text-align:center;"><img src=' + rupee + '>' + Math.floor(set.totalCollectionByBeu) + '</td>  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:70%;border:1px solid gray;text-align:right;padding-right:12px;font-size:10px;"><i>Through App/Website<i></td>' + '  ' +
                                                                    '                           <td style="width:30%;border:1px solid gray;text-align:center;font-size:10px; "><img src=' + rupee + '>' + Math.floor(set.collectedByApp) + '</td>  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:70%;border:1px solid gray;text-align:right;padding-right:37px;font-size:10px;"><i>Through Affiliates</i></td>' + '  ' +
                                                                    '                           <td style="width:30%;border:1px solid gray;text-align:center;font-size:10px;"><img src=' + rupee + '>' + Math.floor(set.collectedByAffiliates) + '</td>  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:70%;border:1px solid gray;text-align:right;padding-right:41px;font-size:10px;"><i>Through Loyality</i></td>' + '  ' +
                                                                    '                           <td style="width:30%;border:1px solid gray;text-align:center;font-size:10px;"><img src=' + rupee + '>' + Math.floor(set.collectedByLoyalityPoints) + '</td>  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:70%;border:1px solid gray;text-align:center;"><b>Total Collection</b></td>' + '  ' +
                                                                    '                           <td style="width:30%;border:1px solid gray;text-align:center;"><b><img src=' + rupee + '>' + Math.floor(set.totalCollection) + '</b></td>  ' +
                                                                    '                       </tr>  ' +
                                                                    '                   </table>  ' +
                                                                    '               </div>  ' +

                                                                    '           </div>  ' +
                                                                    '           <!--End of right table-->  ' +
                                                                    '           <!--start of right table-->  ' +
                                                                    '           <div style="width:50%;float:left;margin-top:19px;padding-left: 0.5%;">  ' +
                                                                    '               <div style=" box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);transition: 0.3s;">' + '  ' +
                                                                    '                   <table style="width:100%;border:2px solid gray;border-collapse:collapse;text-align:left">  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:100%;border:1px solid gray;text-align:center;background-color: #bfbfbf;padding-top: 1%;padding-bottom: 1%;" colspan=2>' + '  ' +
                                                                    '                               <b>Be U Payout</b></tr>  ' +
                                                                    '                        <tr>  ' +
                                                                    '                           <th style="width:70%;border:1px solid gray;text-align:center">Particulars</th>  ' +
                                                                    '                           <th style="width:30%;border:1px solid gray;text-align:center">Amount</th>  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <td style="width:70%;border:1px solid gray;text-align:center">Amount Collected by Be U</td>  ' +
                                                                    '                       <td style="width:30%;border:1px solid gray;text-align:center;"><img src=' + rupee + '>' + Math.floor(set.collectedByAffiliates + set.collectedByApp) + '</td>' + '  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:70%;border:1px solid gray;text-align:center;padding-right:6%;">Salon Benefits by Be U</td>  ' +
                                                                    '                           <td style="width:30%;border:1px solid gray;text-align:center;"></td>' + '  ' +
                                                                    '                       </tr>  ' +
                                                                    // '                       <tr>  ' +
                                                                    // '                           <td style="width:70%;border:1px solid gray;padding-right:15%;text-align:center"> a)Cash Back</td>  ' +
                                                                    // '                           <td style="width:30%;border:1px solid gray;text-align:center;"></td>' + '  ' +
                                                                    // '                       </tr>  ' +
                                                                    // '                       <tr>  ' +
                                                                    // '                           <td style="width:70%;border:1px solid gray;padding-left: 31px;text-align:center;font-size:10px;"> <i>-Cash Back on ERP_Revenue</i></td>  ' +
                                                                    // '                           <td style="width:30%;border:1px solid gray;text-align:center;text-align:center"><img src=' + rupee + '>' + Math.floor(set.refundOnErp) + '</td>' + '  ' +
                                                                    // '                       </tr>  ' +
                                                                    // '                       <tr>  ' +
                                                                    // '                           <td style="width:70%;border:1px solid gray;padding-left: 39px;text-align:center;font-size:10px;"><i>-Cash Back on App_Transaction</i></td>  ' +
                                                                    // '                           <td style="width:30%;border:1px solid gray;text-align:center;"><img src=' + rupee + '>' + Math.floor(set.refundFirstAppDigital + set.refundAppDigitalCash + set.refundAppDigitalOnline) + '</td>  ' +
                                                                    // '                       </tr>' + '  ' +
                                                                    // '                       <!--<tr>-->  ' +
                                                                    // '                           <!--<td style="width:70%;border:1px solid gray;text-align:center">b) Be U Purcahse Scheme Benefits</td>-->  ' +
                                                                    // '                           <!--<td style="width:30%;border:1px solid gray;text-align:center;">&#45;&#45;&#45;&#45;</td>' + '-->  ' +
                                                                    // '                       <!--</tr>-->  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:70%;border:1px solid gray;padding-left: 10px;text-align:center;">Freebies Benefits</td>  ' +
                                                                    '                           <td style="width:30%;border:1px solid gray;text-align:center;"><img src=' + rupee + '>' + Math.floor(set.collectedByLoyalityPoints) + '</td>  ' +
                                                                    '                       </tr>' + disOnPurchase +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:70%;border:1px solid gray;text-align:center;"><b>Total Salon Benefits by Be U</b></td>  ' +
                                                                    '                           <td style="width:30%;border:1px solid gray;text-align:center;"><img src=' + rupee + '>' + Math.floor(set.discountOnPurchase + set.collectedByLoyalityPoints + set.refundFirstAppDigital + set.refundAppDigitalCash + set.refundAppDigitalOnline + set.refundOnErp) + '</td>' + '  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <!--<tr>-->  ' +
                                                                    '                           <!--<td style="width:70%;border:1px solid gray;text-align:center;"><b>Grand Total {A+B}</b></td>-->  ' +
                                                                    '                           <!--<td style="width:30%;border:1px solid gray;text-align:center;">&#45;&#45;&#45;&#45;</td>' + '-->  ' +
                                                                    '                       <!--</tr>-->  ' +
                                                                    '                   </table>  ' +
                                                                    '               </div>  ' +
                                                                    '               <div style=" box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);transition: 0.3s;margin-top:21px;">  ' +
                                                                    '                   <table style="width:100%;border:2px solid gray;border-collapse:collapse;text-align:left">' + '  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:100%;border:1px solid gray;text-align:center;background-color: #bfbfbf;padding-top: 1%;padding-bottom: 1%;" colspan="2"><b>Salons Payout</b></td>  ' +
                                                                    '                       </tr>  ' +
                                                                    '                        <tr>  ' +
                                                                    '                           <th style="width:70%;border:1px solid gray;text-align:center">Particulars</th>  ' +
                                                                    '                           <th style="width:30%;border:1px solid gray;text-align:center">Amount</th>  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:70%;border:1px solid gray;text-align:center">Amount payable to Be U</td>' + '  ' +
                                                                    '                           <td style="width:30%;border:1px solid gray;text-align:center;"><img src=' + rupee + '>' + Math.floor(set.amountPayableToBeu) + '</td>  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:70%;border:1px solid gray;font-size:12px;"><b>Final Amount Payable to Salon/(Be U)</b></td>' + '  ' +
                                                                    '                           <td style="width:30%;border:1px solid gray;text-align:center;"><b><img src=' + rupee + '>' + Math.floor(set.netPayable) + '</b></td>  ' +
                                                                    '                       </tr>  ' +
                                                                    // '                       <td style="width:70%;border:1px solid gray">Less: Discount</td>  '  +
                                                                    // '                       <td style="width:30%;border:1px solid gray;text-align:center;">'+Math.floor(set.lessDiscount)+'</td>' + '  '  +
                                                                    // '                       <tr>  '  +
                                                                    // '                           <td style="width:70%;border:1px solid gray">Amount payable to Be U(After Discount)</td>  '  +
                                                                    // '                           <td style="width:30%;border:1px solid gray;text-align:center;">'+Math.floor(set.amountPayableToBeuAfterDiscount)+'</td>' + '  '  +
                                                                    // '                       </tr>  '  +
                                                                    // '                       <tr>  '  +
                                                                    // '                           <td style="width:50%;border:1px solid gray">Add: CGST @ 9%</td>  '  +
                                                                    // '                           <td style="border:1px solid gray;text-align:center;">'+Math.floor(set.amountPayableToBeuAfterDiscount*.09)+'</td>  '  +
                                                                    // '                       </tr>  '  +
                                                                    // '                       <tr>  '  +
                                                                    // '                           <td style="width:70%;border:1px solid gray">Add: SGST @ 9%</td>' + '  '  +
                                                                    // '                           <td style="width:30%;border:1px solid gray;text-align:center;">'+Math.floor(set.amountPayableToBeuAfterDiscount*.09)+'</td>  '  +
                                                                    // '                       </tr>  '  +
                                                                    // '                       <tr>  '  +
                                                                    // '                           <td style="width:70%;border:1px solid gray"><b>Total Amount Payable to Be U(Incl. Taxes)</b></td>' + '  '  +
                                                                    // '                           <td style="width:30%;border:1px solid gray;text-align:center;">'+Math.floor(set.amountPayableToBeuAfterTax)+'</td>  '  +
                                                                    // '                       </tr>  '  +
                                                                    '                   </table>  ' +
                                                                    '               </div>  ' +
                                                                    // '               <div style=" box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);transition: 0.3s;margin-top:5px;">' + '  '  +
                                                                    // '                   <table style="width:100%;border:1px solid gray;border-collapse:collapse;text-align:left">  '  +
                                                                    // // '                       <tr>  '  +
                                                                    // // '                           <td style="width:70%;border:1px solid gray">Net amount payable to Salon</td>' + '  '  +
                                                                    // // '                           <td style="width:30%;border:1px solid gray">'+Math.floor(set.netPayable)+'</td>  '  +
                                                                    // // '                       </tr>  '  +
                                                                    // // '                       <tr>  '  +
                                                                    // // '                           <td style="width:70%;border:1px solid gray">Previous balance outstanding </td>  '  +
                                                                    // // '                           <td style="width:30%;border:1px solid gray;text-align:center;">'+Math.floor(set.amountPayableToBeuAfterTax)+'</td>' + '  '  +
                                                                    // // '                       </tr>  '  +
                                                                    // '                       <tr>  '  +
                                                                    // '                           <td style="width:50%;border:1px solid gray">Final Amount Payable to Salon/(Be U)</td>  '  +
                                                                    // '                           <td style="border:1px solid gray;text-align:center;">'+Math.floor(set.netPayable)+'</td>  '  +
                                                                    // '                       </tr>  '  +
                                                                    // '                   </table>' + '  '  +
                                                                    // '               </div>  '  +
                                                                    '           </div>  ' +
                                                                    '               <div style="width:98%; box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);transition: 0.3s;margin-top:35%;padding: 10px;">' + '  ' +
                                                                    '                   <table style="width:100%;border:2px solid gray;border-collapse:collapse;text-align:left">  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:100%;border:1px solid gray;text-align:center;background-color: #bfbfbf;padding-top: 1%;padding-bottom: 1%;" colspan="2"><b>Final Settlement Terms</b></td>' + '  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <th style="width:70%;border:1px solid gray;text-align:center;">Particulars</th>  ' +
                                                                    '                           <th style="width:30%;border:1px solid gray;text-align:center;">Amount</th>' + '  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:70%;border:1px solid gray;text-align:center;">Royalty %age_Service Revenue</td>  ' +
                                                                    '                           <td style="width:30%;border:1px solid gray;text-align:center;">' + set.royalityPercentageService + '%</td>' + '  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:70%;border:1px solid gray;text-align:center;">Royalty %age_Product Sale</td>  ' +
                                                                    '                           <td style="width:30%;border:1px solid gray;text-align:center;">' + set.royalityPercentageProduct + '%</td>' + '  ' +
                                                                    '                       </tr>  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:70%;border:1px solid gray;text-align:center;">Discount, if any</td>  ' +
                                                                    '                           <td style="width:30%;border:1px solid gray;text-align:center;">' + Math.floor(set.lessDiscount) + '%</td>  ' +
                                                                    '                       </tr>' + '  ' +
                                                                    '                       <tr>  ' +
                                                                    '                           <td style="width:70%;border:1px solid gray;text-align:center;">Minimum Guarantee</td>  ' +
                                                                    '                           <td style="width:30%;border:1px solid gray;text-align:center;"><img src=' + rupee + '>' + parlor.minimumGuarantee + '</td>  ' +
                                                                    '                       </tr>' + '  ' +
                                                                    '                   </table>  ' +
                                                                    '               </div>  ' +
                                                                    // '           <div style=" box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);transition: 0.3s;width:98%;margin-top:1%;padding: 10px;">  ' +
                                                                    // '               <table style="width:100%;border:2px solid gray;border-collapse:collapse;text-align:center">' + '  ' +
                                                                    // '                   <tr>  ' +
                                                                    // '                       <th style="width:100%;border:1px solid gray;background-color: #bfbfbf;padding-top: 1%;padding-bottom: 1%;" colspan="2">Benefits to Salon by Be U - Summary</th>  ' +
                                                                    // '                   </tr>  ' +
                                                                    // '                        <tr>  ' +
                                                                    // '                           <th style="width:70%;border:1px solid gray">Particulars</th>  ' +
                                                                    // '                           <th style="width:30%;border:1px solid gray">Amount</th>  ' +
                                                                    // '                       </tr>  ' +
                                                                    // '                   <tr>  ' +
                                                                    // '                       <td style="width:70%;border:1px solid gray">Freebies_Payout_July 2017_Till Date</td>' + '  ' +
                                                                    // '                       <td style="width:30%;border:1px solid gray"><img src=' + rupee + '>' + Math.floor(set.freebiesPayoutJulyTillDate) + '</td>  ' +
                                                                    // '                   </tr>  ' +
                                                                    // '                   <td style="width:50%;border:1px solid gray">Freebies_Payout_Since Joining</td>  '  +
                                                                    // '                   <td style="width:50%;border:1px solid gray">'+Math.floor(set.freebiesPayoutSinceJoining)+'</td>  '  +
                                                                    // '                   <tr>' + '  ' +
                                                                    // '                       <td style="width:70%;border:1px solid gray">Cash Back on ERP & App_Payout_July 2017_Till Date</td>  ' +
                                                                    // '                       <td style="width:30%;border:1px solid gray"><img src=' + rupee + '>' + Math.floor(set.cashBackErpAndAppPayoutJulyTillDate) + '</td>' + '  ' +
                                                                    // '                   </tr>    <tr>  ' +
                                                                    // '                       <td style="width:70%;border:1px solid gray"><b>Grand Total_Benefits_July 17_Till Date</b></td>' + '  ' +
                                                                    // '                       <td style="width:30%;border:1px solid gray"><b><img src=' + rupee + '>' + Math.floor(set.freebiesPayoutJulyTillDate + set.cashBackErpAndAppPayoutJulyTillDate) + '</b></td>  ' +
                                                                    // '                   </tr>  ' +
                                                                    // '                   <tr>  '  +
                                                                    // '                       <td style="width:50%;border:1px solid gray">Grand Total_Benefits_Since Joining</td>  '  +
                                                                    // '                       <td style="width:50%;border:1px solid gray">'+Math.floor(set.freebiesPayoutSinceJoining+set.cashBackErpAndAppPayoutSinceJoining)+'</td>' + '  '  +
                                                                    // '                   </tr>  '  +
                                                                    // '               </table>  ' +
                                                                    // '           </div>  ' +
                                                                    // '            end right table  '  +
                                                                    '       </div>  ' +
                                                                    '   </body>  ' +
                                                                    '     ' +
                                                                    '  </html>  ',
                                                                // to: emailId,
                                                                // cc: beuEmail,// list of receivers
                                                                // html:'<!DOCTYPE html><html lang=en><meta charset=UTF-8><title>Settlement Mailer</title><div style=width:60%;margin:auto><div style=background-color:#dfdfdf;height:120px><div style=float:left;width:200px;margin-top:2%;margin-left:2%;margin-bottom:2%;zoom:1.2><img alt="Beu salons"src=http://res.cloudinary.com/dyqcevdpm/image/upload/v1491484496/beu-logo_srvetg.png width=150></div></div><div><h3 style=width:100%;text-align:center>Settlement Report for '+set.parlorName+' for period '+periodDate+'</h3><table style="width:100%;border:1px solid gray;border-collapse:collapse;text-align:center"><tr><td style="width:50%;border:1px solid gray">Name of salon<td style="width:50%;border:1px solid gray">'+set.parlorName+'<tr><td style="width:50%;border:1px solid gray">Entity name<td style="width:50%;border:1px solid gray">'+parlorEntityName+'<tr><td style="width:50%;border:1px solid gray">Address<td style="width:50%;border:1px solid gray">'+set.parlorAddress+'<tr><td style="width:50%;border:1px solid gray">Date of Settlement<td style=width:50%>'+dateEnd+'<tr><td style="width:50%;border:1px solid gray">Period of Settlement<td style="width:50%;border:1px solid gray">'+periodDate+'</table></div><div><h3 style=width:100%;text-align:center>Service Revenue</h3><table style="width:100%;border:1px solid gray;border-collapse:collapse;text-align:center"><tr><td style="width:50%;border:1px solid gray">Service Revenue<td style="width:50%;border:1px solid gray">'+Math.floor(set.serviceRevenue)+'<tr><td style="width:50%;border:1px solid gray">Product Revenue<td style="width:50%;border:1px solid gray">'+Math.floor(set.productRevenue)+'<tr><td style="width:50%;border:1px solid gray">Total Revenue<td style="width:50%;border:1px solid gray">'+Math.floor(set.totalRevenue)+'</table></div><div><h3 style=width:100%;text-align:center>Membership Revenue</h3><table style="width:100%;border:1px solid gray;border-collapse:collapse;text-align:center"><tr><td style="width:50%;border:1px solid gray">Membership Sold<td style="width:50%;border:1px solid gray">'+set.membershipSold+'</table></div><div><h3 style=width:100%;text-align:center>Collection Summary</h3><table style="width:100%;border:1px solid gray;border-collapse:collapse;text-align:center"><tr><td style="width:50%;border:1px solid gray;text-align:left;padding-left:5%">Collected By Salon<td style="width:50%;border:1px solid gray">'+Math.floor(set.totalCollectionByParlor)+'<tr><td style="width:50%;border:1px solid gray;text-align:left;padding-left:5%">Collected by Be U<td style="width:50%;border:1px solid gray">'+Math.floor(set.totalCollectionByBeu)+'<tr><td style="width:50%;border:1px solid gray">Through App/Website<td style="width:50%;border:1px solid gray;padding-left:4%">'+Math.floor(set.collectedByApp)+'<tr><td style="width:50%;border:1px solid gray;padding-right:3%">Through Affiliates<td style="width:50%;border:1px solid gray;padding-left:4%">'+Math.floor(set.collectedByAffiliates)+'<tr><td style="width:50%;border:1px solid gray;padding-right:4%">Through Loyality<td style="width:50%;border:1px solid gray;padding-left:4%">'+Math.floor(set.collectedByLoyalityPoints)+'<tr><td style="width:50%;border:1px solid gray;text-align:left;padding-left:5%">Total Collection<td style="width:50%;border:1px solid gray">'+Math.floor(set.totalCollection)+'</table></div><div><h3 style=width:100%;text-align:center>Model Summary</h3><table style="width:100%;border:1px solid gray;border-collapse:collapse;text-align:center"><tr><td style="width:50%;border:1px solid gray">Royalty Percentage-Service<td style="width:50%;border:1px solid gray">'+royalityPercentageService+'<tr><td style="width:50%;border:1px solid gray">Royalty Percentage-Product<td style="width:50%;border:1px solid gray">'+set.royalityPercentageProduct+'%<tr><td style="width:50%;border:1px solid gray">Discount Percentage<td style="width:50%;border:1px solid gray">'+set.discountPercentage+'%</table></div><div><h3 style=width:100%;text-align:center>Final Settlement Summary</h3><table style="width:100%;border:1px solid gray;border-collapse:collapse;text-align:center"><tr><td style="width:100%;border:1px solid gray"colspan=2><b>Be U Payout</b>' +
                                                                // '<tr><td style="width:50%;border:1px solid gray">Amount Payable to Be U (incl GST)<td style="width:50%;border:1px solid gray">'+Math.floor(set.amountPayableToBeu)+'' +
                                                                // '<tr><td style="width:50%;border:1px solid gray">Amount Payable to Be U(After Discount)<td style="width:50%;border:1px solid gray">'+Math.floor(set.amountPayableToBeu-set.refundAppDigitalCash-set.refundAppDigitalOnline-set.refundOnErp )+
                                                                // '<tr><td style="width:100%;border:1px solid gray"colspan=2><b>Salon Payout</b>' +
                                                                // '<tr><td style="width:50%;border:1px solid gray">' + 'Amount Collected by Be U<td style="width:50%;border:1px solid gray">'+Math.floor(set.totalCollectionByBeu)+
                                                                // '<tr><td style="width:50%;border:1px solid gray">' + 'Amount Refund on App Digital transaction<td style="width:50%;border:1px solid gray">'+Math.floor(set.refundAppDigitalCash+set.refundAppDigitalOnline)+
                                                                // '<tr><td style="width:50%;border:1px solid gray">' + 'Amount Refund on Erp transaction<td style="width:50%;border:1px solid gray">'+Math.floor(set.refundOnErp)+
                                                                // '<tr><td style="width:50%;border:1px solid gray">Gross Amount(Recevable from BeU)<td style="border:1px solid gray">'+Math.floor(set.totalCollectionByBeu+set.refundOnErp+set.refundAppDigitalCash+set.refundAppDigitalOnline)+'</table></div><div style=padding-top:2%><table style="width:100%;border:1px solid gray;border-collapse:collapse;text-align:center"><tr><td style="width:50%;border:1px solid gray">Net Amount Payable to BeU/(Receivable from BeU)<td style="width:50%;border:1px solid gray">'+Math.floor(set.netPayable)+'</table></div></div><div style=padding-top:2%><table style="width:100%;border:1px solid gray;border-collapse:collapse;text-align:center"><tr><td style="width:50%;border:1px solid gray">Previous balance outstanding - Payable to Be U<td style="width:50%;border:1px solid gray">'+set.previousPendingAmount+'<tr><td style="width:50%;border:1px solid gray">Less: Adjusted against current period dues<td style="width:50%;border:1px solid gray">'+((set.previousPendingAmount - set.pendingAmount) <0 ? 0 : (set.previousPendingAmount-set.pendingAmount))+'<tr><td style="width: 50%;border: 1px solid gray;"> Add: Current Period dues payable to Be U<td style="width: 50%;border: 1px solid gray;">'+set.pendingAmount+'<tr><td style="width:50%;border:1px solid gray">Balance outstanding<td style="width:50%;border:1px solid gray">'+set.pendingAmount+'</table></div><div style=padding-top:2%><table style="width:100%;border:1px solid gray;border-collapse:collapse;text-align:center"><tr><td style="width:50%;border:1px solid gray">Net Amount to be transferred<td style="width:50%;border:1px solid gray">'+Math.floor(set.netAmountTransferred)+'</table></div>',
                                                                subject: 'Settlement Report' // Subject line
                                                            };
                                                            transporter.sendMail(mailOptions, function(error, info) {
                                                                if (error)
                                                                    console.log(error);
                                                                else {
                                                                    console.log('Message sent: ' + info.response);
                                                                    SettlementReport.update({ _id: set.id }, { paidDate: new Date() }, function(err, settleUpdate) {
                                                                        if (!err)
                                                                            return res.json(CreateObjService.response(false, "Mail sent successfully!"));
                                                                        else
                                                                            return res.json(CreateObjService.response(false, "there is some error!"));
                                                                    })
                                                                }
                                                            });
                                                        }

                                                        sendEmail();

                                                        // var data = "Dear " + set.parlorName + ", Your settlement report for the period " + periodDate + " has been generated successfully with " + set.reason.toLowerCase() + ". Please check your email. To get your settlement processed please close the open appointments. For any queries please call on 9873341506."
                                                        // var usermessage = Appointment.settlementSms(number, data);
                                                        // Appointment.sendSMS(usermessage, function (e) {
                                                        //     cb();
                                                        //     return console.log('SMS sent successfully');
                                                        // });
                                                    }
                                                }) //this one ends here
                                        }); // console.log(emailId,beuEmail)
                                    }) //ends here
                            }); //here it ends
                        })
                    });
                })
            }, function() {
                res.json("Sent Successfully");
            });
        });
    });
});




router.get('/getparlor', function(req, res) {

    SettlementReport.find({ period: 44 }, function(err, result) {

        var temp = [];

        result.forEach(function(f) {
            temp.push(f.parlorId)

        })

        res.json(temp)

    })

})

// router.get('/updateSettlement', function(req, res) {
//     var temp = [];
//     for (var i = 44; i < 48; i++) {
//         temp.push(i);
//     }
//     var fData = [];
//     var parlor = [
//         "5954cfdcbb6e1a7dae60feb6",
//         "58cb9545cfd3553fa1d0dc68",
//         "58847c934a1a8735093f1b7e",
//         "58eb783534b17264d444c5df",
//         "592bc403c5fa213f89e8621a",
//         "58e090ddb81c313ad0c84bba",
//         "59267d599617606d79a7b899",
//         "58e09a57b81c313ad0c85275",
//         "58a2f5e13443ec15576228fe",
//         "587088445c63a33c0af62727",
//         "592c15bee52b257687e8d998",
//         "593aa37c4769976f38246cfb",
//         "5931115b1cf42f1af3fd76a9",
//         "58ded4eb57a5140f302bb4d8",
//         "58e727cf14328a4b2f3b637c",
//         "58fdb21486377a619caa18bb",
//         "588998adf8169604955dcd3b",
//         "58ec79be34b17264d444ce22",
//         "592fb98c1eccf327a862f894",
//         "59119eb9f5941e5aadde5336",
//         "5926b7579617606d79a7ccda",
//         "588a0cc3f8169604955dce8d",
//         "591418339a12f11bd6a6e548",
//         "590468e49a02b04d81ac0a35",
//         "5905c3732f004c7cad24c3ee",
//         "590da3214a8649164ba2fb30",
//         "5940eb7d547ca363e25888c1",
//         "5909c14d4abd267a81dba99a",
//         "58e4b018c0d6ca73d3be53f3",
//         "592ff5ed8a9b5c12369a7d0e",
//         "5923e21de61af441506f14ef",
//         "58ded8be57a5140f302bb555",
//         "592a8690c5fa213f89e81f7e",
//         "594a27e8aa96ec738f58908c",
//         "5954c092bb6e1a7dae60f99f",
//         "59241a94e61af441506f2171",
//         "58ecc85cce692377f31cf20e"
//     ];

//     console.log("foound")
//     async.each(parlor, function(p, cb1) {
//         console.log(p)
//         async.each(temp, function(s, callback) {
//             console.log(s, '---------', ObjectId(p.toString()))
//             SettlementReport.findOne({ period: s, "parlorId": ObjectId(p.toString()) }, function(err, old) {
//                 console.log(old)
//                 if (old) {
//                     console.log(old)
//                     var cash = old.refundAppDigitalOnline + old.refundAppDigitalCash + old.refundFirstAppDigital + old.refundOnErp
//                     fData.push({ period: s, points: old.collectedByLoyalityPoints, cash: cash })
//                     callback();
//                 } else {
//                     callback();
//                 }

//             })

//         }, function(done) {



//             console.log(fData)


//             var sData = _.sortBy(fData, function(k) {
//                 return k.period;
//             })
//             var temp = 0;
//             var temp2 = 0;
//             var nData = _.map(sData, function(l) {
//                 temp = temp + l.points;
//                 temp2 = temp2 + l.cash;

//                 return {
//                     "period": l.period,
//                     "points": l.points,
//                     "fpoints": temp,
//                     "cash": temp2
//                 }
//             });

//             // res.json(nData)


//             async.each(nData, function(d, cb) {

//                 SettlementReport.update({ period: d.period, "parlorId": ObjectId(p.toString()) }, {

//                     $set: {
//                         "freebiesPayoutJulyTillDate": d.fpoints,
//                         "cashBackErpAndAppPayoutJulyTillDate": d.cash
//                     }
//                 }, function(err, result) {
//                     if (err) console.log(err)

//                     cb();

//                 })


//             }, function(done) {

//                 cb1();
//                 fData = [];

//             })

//         })

//     }, function(done) {

//         res.json("done2")
//     })
// })





router.get('/dummyData', function(req, res) {

    var data = [{
        "formType": "Basic",
        "subheading": [{
                "subtitle": "employee",
                "questions": [{
                        "heading": "employee",
                        "type": "radio",
                        "question": "How is Ramesh?"
                    },
                    {
                        "heading": "employee",
                        "type": "checkbox",
                        "question": "sdjcjdgckdsgcsdgkcg?"
                    }
                ]
            },
            {
                "subtitle": "MGR",
                "questions": [{
                        "heading": "employee",
                        "type": "radio",
                        "question": "How is the owner?"
                    },
                    {
                        "heading": "employee",
                        "type": "checkbox",
                        "question": "sdjcjdgckdsgcsdgkcg?"
                    }
                ]
            },
            {
                "subtitle": "employee",
                "questions": [{
                        "heading": "employee",
                        "type": "radio",
                        "question": "How is Ramesh?"
                    },
                    {
                        "heading": "employee",
                        "type": "checkbox",
                        "question": "sdjcjdgckdsgcsdgkcg?"
                    }
                ]
            }
        ]
    }, {
        "formType": "employee",
        "subheading": [{
                "subtitle": "employee",
                "questions": [{
                        "heading": "employee",
                        "type": "radio",
                        "question": "How is Ramesh?"
                    },
                    {
                        "heading": "employee",
                        "type": "checkbox",
                        "question": "sdjcjdgckdsgcsdgkcg?"
                    }
                ]
            },
            {
                "subtitle": "MGR",
                "questions": [{
                        "heading": "employee",
                        "type": "radio",
                        "question": "How is the owner?"
                    },
                    {
                        "heading": "employee",
                        "type": "checkbox",
                        "question": "sdjcjdgckdsgcsdgkcg?"
                    }
                ]
            },
            {
                "subtitle": "employee",
                "questions": [{
                        "heading": "employee",
                        "type": "radio",
                        "question": "How is Ramesh?"
                    },
                    {
                        "heading": "employee",
                        "type": "checkbox",
                        "question": "sdjcjdgckdsgcsdgkcg?"
                    }
                ]
            }
        ]
    }]

    res.json(data)
});


// router.post('/updateUserAppointmentCount' , function(req,res){
//     User.find({},{ "parlors.parlorId" : 1} , function(err,users) {
//         _.forEach(users , function(u){
//             _.forEach(u.parlors , function(p){
//                 Appointment.find({"client.id" : u._id , status:3 , parlorId: p.parlorId}).count().exec(function(err,count){
//                     console.log(count)
//                     if(count){
//                         User.update({_id : u._id , "parlors.parlorId" : p.parlorId} ,{$set : {"parlors.$.noOfAppointments" : count}}).exec(function(err ,update){
//                             console.log(update)
//                             res.json("done")
//                         });
//                     }else{
//                          User.update({_id : u._id , "parlors.parlorId" : p.parlorId} ,{$set : {"parlors.$.noOfAppointments" : 0 }}).exec(function(err ,update){
//                             console.log(update)
//                             res.json("done")
//                         });
//                     }
//                 })

//             })
//         })
//     })
// });


// router.post('/emailOctopus' , function(req,res){
// var request = require('request');
//                 // {
//                 //     "api_key"= "5b148e51-2683-11e7-b170-0244cade5e89",
//                 //     "email_address": "nikita@beusalons.com",
//                 //     "first_name": "Nikita",
//                 //     "last_name": "Chauhan",
//                 //     "subscribed": true
//                 // }

//     var options = {
//                       "url": 'https://emailoctopus.com/5b148e51-2683-11e7-b170-0244cade5e89/1.2/lists/:listId/contacts',
//                       "method": 'POST',
//                       // "headers": {
//                       //   "Content-Type": "application/json",
//                       // },
//                       //   "body": body1
//                     };

//                     request(options,function(err, response, body3){
//                         console.log(response)
// })
// });


router.post('/zohobooks', function(req, res) {

    Appointment.findOne({ _id: ObjectId("59c23e31e0da9c764aa02895"), status: 3 }, function(err, appt) {
        // var formData = {"customer_id":"949129000000062007","date":"2017-09-20","due_date":"2017-09-20","line_items":[{"item_order":"0","item_id":"949129000000062021","rate":100,"name":"Test","quantity":"1.00","discount":"0%","unit":"","account_id":"949129000000000388"}]}
        var formData = {};
        if (appt) {

            var date = new Date(appt.appointmentStartTime);
            date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

            formData.customer_id = "949129000000064085",
                formData.invoice_number = "" + appt.invoiceId + "",
                //    formData.contact_persons= [
                //     "949129000000064085",
                // ],
                // formData.date = date,
                formData.discount = appt.discount,
                formData.custom_fields = [
                    { appointmentId: appt._id }
                ],
                formData.rate = appt.payableAmount,
                formData.payment_gateways = appt.allPaymentMethods
            formData.line_items = _.map(appt.services, function(ser) {
                return {
                    item_id: parseInt(ser._id),
                    // product_type : "goods",
                    name: ser.name,
                    description: ser.description,
                    rate: ser.price,
                    quantity: ser.quantity,
                    discount_amount: ser.discount,
                    tax_percentage: ser.tax,
                    item_total: (ser.price * ser.quantity) - ser.loyalityPoints
                }
            })

        }
        var request = require('request');
        var options = {
            "url": 'https://books.zoho.com/api/v3/invoices?organization_id=653644076',
            "headers": {
                'Content-Type': ' application/json;charset=UTF-8',
                'Authorization': 'Zoho-authtoken ef4095b9f5b6b58195217a537830860d'
            },
            "form": {
                'JSONString': JSON.stringify(formData)

            },
            "method": 'POST'

        };
        var info = {}
        console.log(options)
        request(options, function(err, response, body1) {
            console.log(err)
            console.log(response)
            if (!err && response.statusCode == 200) {
                info = JSON.parse(body1);
                console.log(info.body)
            }
            res.json(info)
        })
    })
});


router.post('/createIemZohobooks', function(req, res) {


    var formData = {};
    formData.name = "Upper Lips",
        formData.rate = 30;
    // formData.tax_percentage = "18%"

    var request = require('request');
    var options = {
        "url": 'https://books.zoho.com/api/v3/items?organization_id=653644076',
        "headers": {
            'Content-Type': ' application/json;charset=UTF-8',
            'Authorization': 'Zoho-authtoken ef4095b9f5b6b58195217a537830860d'
        },
        "form": {
            'JSONString': JSON.stringify(formData)

        },
        "method": 'POST'

    };
    var info = {}
    console.log(options)
    request(options, function(err, response, body1) {
        console.log(err)
        console.log(response)
        if (!err && response.statusCode == 200) {
            info = JSON.parse(body1);
            console.log(info.body)
        }
        res.json(info)
    })

});


router.get('/cashdddd', function(req, res) {
    Appointment.aggregate([{
            $match: {
                status: 3,
                appointmentStartTime: { $gte: new Date(2017, 7, 1, 0, 0, 0), $lt: new Date(2017, 9, 15, 23, 59, 59) },
                appointmentType: { $in: [1, 2] }
            }
        },
        { $project: { subtotal: 1 } }
    ]).exec(function(err, agg) {
        res.json(agg)
    })
})


// router.post("/editServicesTwoPrices" , function(req,res){

// // Parlor.aggregate([{$match:{"name" : "Beu Test"}} , {$unwind:"$services"} ,
// //                 {$project : {name: 1, serviceName : "$services.name" , serviceCode:"$services.serviceCode" , price: {$size :"$services.prices"} , address2:1}},
// //                 {$match :{price:{$gt:1}}},
// //                 {$group :{_id:{_id:"$id" , name:"$name" , address :"$address2"} ,
// //                 services :{$push :{serviceName:"$serviceName" , serviceCode :"$serviceCode" , price :"$price"}}}
// //             }
// //         ]).exec(function(err,aggr){

//     Parlor.find({active:true} , function(err,parlors){
//             _.forEach(parlors , function(parlor){
//                 var services = parlor.services;

//             _.forEach(parlor.services, function(serv) {
//                 if(serv.prices.length == 2){
//                     serv.prices = serv.prices[0]
//                 }
//             });

//             Parlor.update({ _id: parlor._id}, { services: services }, function(err, d) {
//                 res.json(d);
//             });
//         })
//     })
// })
// });


router.post('/test', function(req, res) {
    var d = [];
    Parlor.find({ active: true }, { _id: 1 }, function(err, parlors) {
        async.each(parlors, function(p, cb) {
            Appointment.aggregate([{ $match: { parlorId: p._id, status: 3, appointmentStartTime: { $gte: new Date(2016, 11, 1, 0, 0, 0), $lt: new Date(2017, 3, 30, 23, 59, 59) } } },
                { $group: { _id: { clientId: "$client.id" }, count: { $sum: 1 } } },
                { $match: { count: 1 } },
                { $group: { _id: null, count: { $sum: 1 } } }
            ]).exec(function(err, agg) {
                console.log(agg)
                var count = 0;
                if (agg.length > 0) {
                    count += agg[0].count
                }

                d.push(count)
                cb();
            })
        }, function allTaskCompleted() {
            res.json(d)
        })
    })
});

router.get('/testing', function(req, res) {
    Appointment.find({status : 3, appointmentStartTime : {$gt : new Date(2018, 7, 1)}},{"services" : 1}, function(err, appointments){
        console.log(appointments.length);
        _.forEach(appointments, function(appt, key){
            var employees = [];
            _.forEach(appt.services, function(ser){
                var employeeIds = [];
                _.forEach(ser.employees, function(emp){
                    if(!_.filter(employeeIds, function(e){return e.employeeId + "" == emp.employeeId + ""})[0]){
                        employeeIds.push(emp);
                        if(!_.filter(employees, function(e){ return e.employeeId + "" == emp.employeeId + ""})[0]){
                            employees.push({
                                employeeId : emp.employeeId,
                                name : emp.name,
                                estimatedTime : ser.estimatedTime,
                                commission : 0,
                                revenue : parseInt((emp.distribution/100) * ser.price),
                            });
                        }else{
                            _.forEach(employees, function(e){
                                if(e.employeeId + "" == emp.employeeId +""){
                                    e.estimatedTime += ser.estimatedTime;
                                    e.revenue += parseInt((emp.distribution/100) * ser.price);
                                }
                            });
                        }                   
                    }
                });
                ser.employees = JSON.parse(JSON.stringify(employeeIds));
            });
            Appointment.update({_id : appt.id}, {services : appt.services, employees : employees}, function(err, u){
                console.log(key);
            });
        });
    LuckyDrawDynamic.subscriptionAmount(new Date(2018, 8, 1), new Date(2018, 8, 2), function(data){
        res.json(data);
    });
});
});


router.post('/avgRepeat', function(req, res) {

    var k = [];

    for (var i = 0; i < 365; i++) {
        var object = {};
        object[i] = 0;
        k.push(object);
    }

    console.log(k);

    var arr = [];
    // console.log(d)
    Appointment.aggregate([{ $match: { status: 3, appointmentStartTime: { $lt: new Date(2017, 9, 1, 0, 0, 50) } } },
        { $project: { date: { '$dateToString': { format: '%m/%d/%Y', date: '$appointmentStartTime' } }, client: 1 } },
        { $group: { _id: { clientId: "$client.id" }, dates: { $push: "$date" } } }
    ]).exec(function(err, agg) {

        _.forEach(agg, function(a) {
            if (a.dates.length > 0) {
                var date1 = new Date(a.dates[0]);
                var date2 = new Date(a.dates[1]);
                var timeDiff = Math.abs(date2.getTime() - date1.getTime());
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                if (diffDays <= 365) {

                    k[(diffDays)][(diffDays).toString()] = k[(diffDays)][(diffDays).toString()] + 1;
                }

            }

        })

        res.json(k)
    })
})


// router.post('/getFbId' , function(req,res) {
//     FB.api('me', { fields: ['id', 'name', 'email', 'picture', 'gender'], access_token: accessToken }, function (res) {
//             console.log(res);
//             if(!res.error){
//                 return callback({
//                     id : res.id,
//                     name : res.name,
//                     emailId : res.email,
//                     gender : res.gender == 'male' ? 'M' : 'F',
//                     profilePic : "https://graph.facebook.com/"+res.id+"/picture?type=large",
//                 });
//             }else return callback(null);
//         });
// })


// router.get('/fbSalonId', function(req, res){
//     var data =[];
//     var FB = require('fb');
//     Parlor.find({} ,{latitude:1,longitude:1 ,name:1},function(err,parlors){
//         async.each(parlors,function(p , cb){
//             FB.api('search?type=place&q=salon&center= '+p.latitude+', '+p.longitude+'&distance=100', { fields: ['name', 'checkins', 'picture'], access_token: 'EAACEdEose0cBAK0ycmLVADAuUnUVoPpZCaTZCap10zJzhAadvZAFn6nOMzEBSuiSokAszZCZAUVBvlZAhDeqZCzf2icrqkwjZBIW73Q2eLWELHy1gMV50XD6jQDbqCNeZBHl2e1PZBZBTf5zJtBoA6vOJCueboLpW0UYcXp8ZBZBAffKxzAz0GzFuk0ZAiTezEPKYa1qIZD' }, function (response) {
//                 if(response.data.length>0){
//                     _.forEach(response.data , function(r){
//                         var string = r.name , substring = "Be U Salons"
//                         if(string.indexOf(substring) !== -1){
//                         data.push({
//                                 salonId : p._id,
//                                 parlorName : p.name,
//                                 salonName : r.name,
//                                 fbId : r.id
//                             })
//                         }
//                     })
//                 };
//                 cb();
//             });
//         },function(done){
//             console.log("all done");
//             res.json(data);
//         });
//     })

// });



router.get('/getCashBack', function(req, res) {

    Parlor.find({}, { onErp: 1, appDigital: 1, appCash: 1 }, function(err, data) {

        res.json(data)

    })

});

router.post('/userCreditsUsed', function(req, res) {
    var count = 0;
    var amount = 0;
    User.find({ "creditsHistory.reason": "New Registration", "creditsHistory.1.createdAt": { $gte: new Date(2017, 7, 1, 0, 0, 0), $lt: new Date(2017, 7, 31, 23, 59, 59) }, $where: "this.creditsHistory.length>1" }, { creditsHistory: 1 }, function(err, users) {
        _.forEach(users, function(u) {
            // _.forEach(u.creditsHistory,function(ch){
            if (u.creditsHistory[0].reason == "New Registration" && u.creditsHistory[1].reason == "Used for appointment") {
                count++;
                amount += 200
            }
            // })
        });

        res.json(amount)
    });
});



router.get('/firstappDigitalSettlement', function(req, res) {
    var arr = [];
    var d = [];

    var query = [{ $unwind: "$creditsHistory" }, {
            $match: { $or: [{ "creditsHistory.reason": "100% cashback" }, { "creditsHistory.reason": "50% cashback" }] }
        },
        {
            $lookup: {
                from: "appointments",
                localField: "creditsHistory.source",
                foreignField: "_id",
                as: "appt"
            }
        },
        { $unwind: "$appt" },

        { $match: { "appt.status": 3, "appt.appointmentStartTime": { $gte: new Date(2018,6, 6), $lt: new Date(2018, 6, 8, 23, 59, 59) } } }
    ]

    User.aggregate(query, function(err, agg) {
        async.each(agg, function(a, cb) {
            console.log(a.appt._id)
            Appointment.update({ _id: a.appt._id }, { $set: { clientFirstAppointment: true } }, function(err, update) {
                console.log("done")
                d.push(update)
                cb()
            })
        }, function allTaskCompleted() {
            console.log("done")
            return res.json(d)
        })
    })
});


router.get('/corporateNotification', function(req, res) {

    var data = {
        type: "jhgjg",
        title: "Corporate Email ID is back!",
        body: "Login into the App again and add your corporate email ID to enjoy our corporate benefits.",
        sImage: "",
        lImage: ""
    };

    User.find({ isCorporateUser: false, corporateOtp: { $exists: true } }, { phoneNumber: 1, firebaseId: 1, firebaseIdIOS: 1 }, function(err, users) {
        // User.find({phoneNumber :"9582874993"},{firebaseId:1,firebaseIdIOS:1},function(err,users){
        // var d = [];
        // var async = require('async');
        console.log(users.length)
            // for (var i = 0; i < users.length; i++) {

        console.log(users)
        var fbId = [],
            fbIos = [],
            numbers = [];
        _.forEach(users, function(user) {

            if (user.firebaseId) fbId.push(user.firebaseId);
            if (user.firebaseIdIOS) fbIos.push(user.firebaseIdIOS);
            numbers.push(user.phoneNumber)
        })

        var usermessage = "Dear Corporates, our corporate email ID feature has been revived. To enjoy your 3 Free Haircuts* and 200% Cashback*, login to your Be U app again and add your corporate email ID. For further queries call us on - 8690291910.";
        _.forEach(numbers, function(number) {
            var param = usermessage.replace(/&/g, "%26");
            var enc = encodeURI(param)
            var request = require("request");
            var url = "http://www.myvaluefirst.com/smpp/sendsms?username=%20shailendrabeu&password=%20shailn567&to=" + number + "&from=BEUSLN&text=" + enc + "";
            console.log("url", url)
            request({
                // agent:false,
                url: url,
                json: true
            }, function(error, response, body) {
                console.log(error);
                if (!error) {
                    // console.log(response.body)
                }
            })

        })
        return res.json(CreateObjService.response(false, "SMS Sent Successfully"));
        // User.update({_id:i.id},{$unset:{companyId:1,corporateEmailId:1,corporateCompanyId:1}},function(err,updateUser){
        // async.parallel([
        //     function(done) {
        //         async.each([1, 2], function(p, callback) {
        //             if (p == 1) {
        //                 Appointment.sendAppNotificationAdmin(fbId, data, function(err, data) {
        //                     d.push(data);
        //                     callback();
        //                 })
        //                 console.log("android")
        //             }
        //             if (p == 2) {
        //                 Appointment.sendAppNotificationIOSAdmin(fbIos, data, function(err, data) {
        //                     d.push(data);
        //                     callback();
        //                 })
        //                 console.log("ios")
        //             }
        //         }, done);
        //     }
        // ], function allTaskCompleted() {
        //     console.log('done');
        //     return res.json(d);
        // });
        // })
        // }
    })

});

router.get('/phoneCorp', function(req, res) {

    User.find({ isCorporateUser: false, corporateOtp: { $exists: true }, corporateCompanyId: { $exists: false } }, { phoneNumber: 1, firstName: 1 }, function(err, users) {
        console.log(users.length)
        return res.json(users);
    })
})



// router.get('/maximumRefundOnApp' , function(req,res) {
//     var d=[];
//     Parlor.find({active:true} ,{maximumRefundOnErp :1},function(err,parlors) {
//         async.each(parlors , function(p,cb){
//             Parlor.update({_id:p.id},{maximumRefundOnAppCash:p.maximumRefundOnErp},function(err,update){
//                 d.push(update)
//                 cb();
//             })
//         },function allTaskCompleted(){
//                 console.log('done');
//                 return res.json(d);
//         })
//     })
// })

router.get('/paidFunction', function(req, res) {
    SettlementReport.find({ period: 100 }, function(err, data) {
        async.each(data, function(set, cbs) {
            SettlementReport.update({ _id: set._id }, {
                $set: {
                    previousDue: 0,
                    paidToSalon: set.netPayable,
                    balance: 0,
                    paid: true
                }
            }, function(err, dones) {
                cbs();
            })
        }, function(done) {
            res.json("done")
        })
    })
});


router.get('/corporateCount', function(req, res) {
    User.find({ isCorporateUser: true }).count().exec(function(err, count) {
        res.json(count)
    })
});

// router.get('/createCouponCodes', function(req, res) {
//     for (var i = 0; i <1000 ; i++) {
//         var emptyString = "";
//         var alphabet = "ABCDEFGHIJKLMNPQRSTUVWX";

//         while (emptyString.length < 5) {
//             emptyString += alphabet[Math.floor(Math.random() * alphabet.length)];
//         }
//         var string = emptyString;
//         var couponCode = "BEUS" + string;

//         console.log(couponCode)
//         Offer.create({ active: true, code: couponCode ,offerType: 'subscription' ,name :"Sold At Nearbuy" ,createdAt:new Date() ,discountAmount :899}, function(err, created) {

//             if (err) {
//                 console.log(err);
//                 return res.json(CreateObjService.response(true, 'Error'));
//             } else {
//                 return res.json(CreateObjService.response(false, 'successfully created'));
//             }
//         });
//     }
// });


router.get('/sendCustomizeSms', function(req, res) {
    var number = "";
    var usermessage = "Dear Customer, You have purchased Membership Card 5000 for Rs 5900. Membership validity is 1 year.";
    var param = usermessage.replace(/&/g, "%26");
    var enc = encodeURI(param)
    var request = require("request");
    var url = "http://www.myvaluefirst.com/smpp/sendsms?username=%20shailendrabeu&password=%20shailn567&to=" + number + "&from=BEUSLN&text=" + enc + "";
    console.log("url", url)
    request({
        // agent:false,
        url: url,
        json: true
    }, function(error, response, body) {
        console.log(error);
        if (!error) {

            console.log(response.body)
        }
    })
    return res.json(CreateObjService.response(false, "SMS Sent Successfully"));
});

router.get('/removeFreebieCondition', function(req, res) {
    User.update({ phoneNumber: req.query.phone }, { allow100PercentDiscount: true }, function(err, update) {
        if (update) {
            return res.json(CreateObjService.response(false, "Updated Successfully"));
        } else {
            return res.json(CreateObjService.response(true, err));
        }
    })
});

router.get('/servicesName', function(req, res) {
    Service.find({}, { name: 1, _id: 0, gender: 1 }, function(err, services) {
        if (services) {
            return res.json(services);
        }
    })
})

router.get('/getCouponCodes', function(req, res) {
    FreebiesOffer.find({ createdAt: { $gte: new Date(2017, 10, 16) } }, { code: 1, _id: 0 }).exec(function(err, codes) {
        return res.json(codes);
    })
})

router.get('/packageDiscount', function(req, res) {
    var arr = [];
    Appointment.find({ appointmentStartTime: { $gte: new Date(2017, 10, 1), $lt: new Date(2017, 10, 15) }, status: 3, paymentMethod: { $in: [5, 10] }, appointmentType: 3, payableAmount: { $gt: 800 }, $where: "this.services.length>3" }, function(err, appts) {
        console.log(appts.length)
        _.forEach(appts, function(appt) {
            var data = {
                apptId: appt._id,
                totalSavings: 0,
                packageDiscount: 0,
                menuPrice: 0
            };

            _.forEach(appt.services, function(s) {
                data.menuPrice = s.actualPrice

                var sav = s.actualDealPrice ? s.actualDealPrice : s.actualPrice;
                if (s.type != 'frequency') data.totalSavings += (sav - (s.price));
                else data.totalSavings += s.discount;
                data.packageDiscount = parseInt((data.menuPrice - data.totalSavings) - appt.subtotal);
            })

            arr.push(data)
        })
        console.log(arr.length)
        return res.json(arr);
    })
})

router.get('/getP', function(req, res) {

    Parlor.aggregate([{
        $geoNear: {
            near: { type: "Point", coordinates: [parseFloat(28.5497), parseFloat(77.2674)] },
            distanceField: "geo.distance",
            spherical: true,

            query: {
                'services.serviceCode': { '$in': [202, 52, 368, 365, 293, 131] }
                //                     ,   active: true
            },
            distanceMultiplier: 0.001
        }
    }, { $project: { name: 1, active: 1, latitude: 1, longitude: 1 } }], function(err, data) {


        res.json(data);

    })


})

router.get('/isMailSent', function(req, res) {

    var isTrue = req.query.isTrue;
    var settlementId = req.query.settlementId;
    // var flag ;
    // if(isTrue == true){
    //     flag = true
    // }else {flag =false}

    SettlementReport.update({ _id: settlementId }, { isMailSent: isTrue }, function(err, settle) {
        res.json("done")
    })

})




router.get('/createCouponCodeHistory', function(req, res) {
    var d = [];
    for (var i = 0; i < 5; i++) {
        User.find({ 'couponCodeHistory.code': { $ne: "APP10" } }).skip(1000 * i).limit(1000).exec(function(err, users) {
            console.log(users.length)

            // User.find({"couponCodeHistory.code" :{$ne:"APP10"}}).skip(1000 * i).limit(1000).exec(function(err, users) {
            // var alphabet = u._id.toString();
            // console.log(alphabet)
            // var string = alphabet.substring(20);;
            // var couponCode = "BU" + string;
            // var cc = couponCode.toUpperCase();
            console.log(users.length)
            var now_date = new Date();
            now_date.setMonth(now_date.getMonth() + 1)
            var obj = [{
                    active: true,
                    createdAt: new Date(),
                    code: "APP10", //"CORPID15"
                    couponType: 4,
                    expires_at: now_date
                }
                // {
                //     active: true,
                //     createdAt: new Date(),
                //     code: "APP10", //"CORPID15"
                //     couponType: 4,
                //     expires_at: now_date
                // }
            ];;
            async.each(users, function(u, cb) {

                    // if (u.isCorporateUser && u.isCorporateUser == true) {
                    //     obj.push({ active: true, createdAt: new Date(), code: "CORPID15", couponType: 3, expires_at: now_date })
                    // }

                    User.update({ _id: u._id }, { $push: { couponCodeHistory: { $each: obj } } }, function(err, updated) {
                        console.log(updated)
                        d.push(updated)
                        cb();
                    })
                }, function allTaskCompleted() {
                    res.json(d.length);
                })
                // })
        })
    }
});


router.get('/updateAllDeals', function(req, res) {
    var dd = [];
    Service.find({}, { serviceCode: 1, 'prices': 1 }, function(err, services) {
        // dealId:{$in:[276,278,279,281,277]}
        // dealId:{$in:[1,2,3,4,5,6]}
        // dealId: { $in: [322, 315,316, 317, 324, 323, 325] }
        AllDeals.find({}, function(err, allDeals) {
            // console.log(allDeals.length)
            async.each(allDeals, function(aD, cb) {
                var selectedDeals = [];

                if (aD.dealType.name == 'combo') {
                    selectedDeals = comboObj(aD, services)
                } else if (aD.dealType.name == 'newCombo') {
                    selectedDeals = newComboObj(aD, services)
                } else {
                    selectedDeals = dealPriceObj(aD)
                }
                // console.log(selectedDeals[0].services)
                var serviceCodes = [],
                    dealIds = [],
                    selectedDeals = selectedDeals,
                    latitude = 20,
                    longitude = 20,
                    parlors = [],
                    deals = [],
                    selectedDealsType = [],
                    slabs = [],
                    newComboDeals = [];
                _.forEach(selectedDeals, function(s) {
                        dealIds.push(s.dealId);
                        _.forEach(s.services, function(service) {
                            serviceCodes.push(service.serviceCode);

                        });
                        // console.log(dealIds)
                        // console.log(serviceCodes)
                        serviceCodes = _.uniqBy(serviceCodes, function(e) { return e; });
                        User.findOne({ _id: req.query.userId }, { favourites: 1, recent: 1 }, function(err, user) {
                            if (!user) user = {};
                            Async.parallel([
                                    function(callback) {
                                        AggregateService.allParlorServiceByCode(serviceCodes, req.body.parlorId, function(results) {
                                            parlors = results;
                                            callback(null);
                                        });
                                    },
                                    function(callback) {
                                        AggregateService.allDealsServiceByCode(serviceCodes, req.body.parlorId, function(results) {
                                            deals = results;
                                            callback(null);
                                        });
                                    },
                                    function(callback) {
                                        AllDeals.find({ dealId: { $in: dealIds }, active: 1 }, { dealId: 1, 'dealType.name': 1 }, function(err, alldeals) {
                                            selectedDealsType = _.map(alldeals, function(d) {
                                                return {
                                                    dealId: d.dealId,
                                                    dealType: d.dealType.name,
                                                }
                                            });
                                            callback(null);
                                        });
                                    },
                                    function(callback) {
                                        Slab.find({}, function(err, sa) {
                                            slabs = sa;
                                            callback(null);
                                        });
                                    },
                                    function(callback) {
                                        AggregateService.comboNewComboParlors(dealIds, req.body.parlorId, function(comb) {
                                            newComboDeals = comb;
                                            callback(null);
                                        });
                                    }
                                ],
                                function(err, results) {

                                    _.forEach(parlors, function(parlor) {

                                        populateDealPrice(parlor.parlorId, parlor.services, deals);

                                        parlor.deals = [];
                                        _.forEach(selectedDealsType, function(selectedDealType) {
                                            if (selectedDealType.dealType == "combo" || selectedDealType.dealType == "newCombo") {
                                                var comboDeal = _.filter(newComboDeals, function(d) { return d.dealId == selectedDealType.dealId })[0];
                                                var parlorPresent = _.filter(comboDeal.parlors, function(p) { return p.parlorId + "" == parlor.parlorId + "" })[0];
                                                if (parlorPresent) {
                                                    populateComboDeal(selectedDeals, parlor, selectedDealType, parlorPresent.dealId, slabs, comboDeal.slabId, req.body.parlorId);
                                                }
                                            } else {
                                                // console.log(selectedDealType.dealType)
                                                populateGeneralDeal(selectedDeals, parlor, selectedDealType);
                                            }
                                        });

                                    });
                                    parlors = _.map(parlors, function(p) {
                                        return {
                                            parlorId: p.parlorId,
                                            deals: p.deals,
                                        }
                                    });
                                    parlors = _.filter(parlors, function(p) { return p.deals.length == selectedDeals.length });
                                    populateParlor(parlors, latitude, longitude, function(requiredResult) {
                                        // console.log(requiredResult)
                                        if (!req.body.parlorId) {

                                            var updateFinalObj = [];

                                            var redParlors = [{ cityId: 1, parlorPrice: [] }, { cityId: 2, parlorPrice: [] } ,  { cityId: 3, parlorPrice: [] }],
                                                blueParlors = [{ cityId: 1, parlorPrice: [] }, { cityId: 2, parlorPrice: [] } , { cityId: 3, parlorPrice: [] }],
                                                greenParlors = [{ cityId: 1, parlorPrice: [] }, { cityId: 2, parlorPrice: [] } , { cityId: 3, parlorPrice: [] }];
                                            _.forEach(requiredResult, function(rr) {
                                                    var redObj = {},
                                                        blueObj = {},
                                                        greeObj = {};
                                                    if (rr.parlorType == 0) {
                                                        // redObj.parlorType = 0,
                                                        redObj.dealPrice = rr.dealPrice;
                                                        redObj.menuPrice = rr.menuPrice;

                                                        // console.log("redParlors" ,redParlors)
                                                        if (rr.cityId == 1) {
                                                            redParlors[0].parlorPrice.push(redObj)
                                                            console.log(redObj.dealPrice + "----" + rr.name)
                                                        } else if(rr.cityId == 2)redParlors[1].parlorPrice.push(redObj)
                                                        else redParlors[2].parlorPrice.push(redObj)

                                                    }
                                                    if (rr.parlorType == 1) {
                                                        // blueObj.parlorType = 1,
                                                        blueObj.dealPrice = rr.dealPrice;
                                                        blueObj.menuPrice = rr.menuPrice;

                                                        if (rr.cityId == 1) blueParlors[0].parlorPrice.push(blueObj)
                                                        else if(rr.cityId == 2)blueParlors[1].parlorPrice.push(blueObj)
                                                        else blueParlors[2].parlorPrice.push(blueObj)
                                                    }
                                                    if (rr.parlorType == 2) {
                                                        // greeObj.parlorType = 2,
                                                        greeObj.dealPrice = rr.dealPrice;
                                                        greeObj.menuPrice = rr.menuPrice;

                                                        if (rr.cityId == 1) greenParlors[0].parlorPrice.push(greeObj)
                                                        else if(rr.cityId == 2)greenParlors[1].parlorPrice.push(greeObj)
                                                        else greenParlors[2].parlorPrice.push(greeObj)
                                                    }
                                                })
                                                // console.log(redParlors[0].parlorPrice)
                                                // console.log(blueParlors[0].parlorPrice)
                                                // console.log(greenParlors[0].parlorPrice)

                                            redParlors.forEach(function(city) {
                                                if (city.parlorPrice.length > 0) city.parlorPrice = city.parlorPrice.sort(function(a, b) { return a.dealPrice - b.dealPrice; })[0];
                                            })
                                            blueParlors.forEach(function(city) {
                                                if (city.parlorPrice.length > 0) city.parlorPrice = city.parlorPrice.sort(function(a, b) { return a.dealPrice - b.dealPrice; })[0];
                                            })
                                            greenParlors.forEach(function(city) {
                                                if (city.parlorPrice.length > 0) city.parlorPrice = city.parlorPrice.sort(function(a, b) { return a.dealPrice - b.dealPrice; })[0];
                                            })


                                            redParlors.forEach(function(city) {
                                                // console.log("city" , city.parlors)
                                                var newObj = [];
                                                if (city.parlorPrice.dealPrice == null) {

                                                }
                                                // if(city.parlorPrice.length > 0){
                                                // city.parlorPrice =[]
                                                var arr = {
                                                        type: 0,
                                                        startAt: Math.round(city.parlorPrice.dealPrice) || 0,
                                                        percent: Math.round(((city.parlorPrice.menuPrice - city.parlorPrice.dealPrice) / city.parlorPrice.menuPrice) * 100) || 0
                                                    }
                                                    //
                                                newObj.push(arr)
                                                city.parlorPrice = newObj;

                                                // }
                                            })
                                            blueParlors.forEach(function(city) {
                                                // if(city.parlorPrice.length > 0){
                                                // city.parlorPrice =[]
                                                var newObj = []
                                                    // if(city.parlorPrice.length > 0){
                                                    // city.parlorPrice =[]
                                                var arr = {
                                                        type: 1,
                                                        startAt: Math.round(city.parlorPrice.dealPrice) || 0,
                                                        percent: Math.round(((city.parlorPrice.menuPrice - city.parlorPrice.dealPrice) / city.parlorPrice.menuPrice) * 100) || 0
                                                    }
                                                    //
                                                newObj.push(arr)
                                                city.parlorPrice = arr;
                                                // }
                                            })
                                            greenParlors.forEach(function(city) {
                                                    // city.parlorPrice =[]
                                                    var newObj = []
                                                        // if(city.parlorPrice.length > 0){
                                                        // city.parlorPrice =[]
                                                    var arr = {
                                                            type: 2,
                                                            startAt: Math.round(city.parlorPrice.dealPrice) || 0,
                                                            percent: Math.round(((city.parlorPrice.menuPrice - city.parlorPrice.dealPrice) / city.parlorPrice.menuPrice) * 100) || 0
                                                        }
                                                        //
                                                    newObj.push(arr)
                                                    city.parlorPrice = arr;
                                                })
                                                // console.log("reddddddddddddddddddddd" , redParlors[0].parlorPrice)

                                            redParlors.forEach(function(city) {
                                                    var greenObj = { type: 2, startAt: 0, percent: 0 }
                                                    var blueObj = { type: 1, startAt: 0, percent: 0 }
                                                    greenObj = _.filter(greenParlors, function(gP) { return gP.cityId == city.cityId })[0];
                                                    blueObj = _.filter(blueParlors, function(gP) { return gP.cityId == city.cityId })[0];

                                                    var arr = {
                                                            type: 0,
                                                            startAt: Math.round(city.parlorPrice.dealPrice) || 0,
                                                            percent: Math.round(((city.parlorPrice.menuPrice - city.parlorPrice.dealPrice) / city.parlorPrice.menuPrice) * 100) || 0
                                                        }
                                                        // console.log("greenObj " ,greenObj)
                                                    city.parlorPrice.push(greenObj.parlorPrice)
                                                    city.parlorPrice.push(blueObj.parlorPrice)
                                                })
                                                // console.log(redParlors[0].parlorPrice)
                                            AllDeals.update({ _id: aD._id }, { parlorTypesDetail: redParlors }, function(err, update) {
                                                    console.log(err)
                                                    dd.push(selectedDeals)

                                                    cb();
                                                })
                                                // return res.json(CreateObjService.response(false, { parlors: updateFinalObj }))
                                                // cb();
                                        } else {
                                            cb();
                                        }

                                    });
                                });
                        });
                    }, function allTaskCompleted() {
                        res.json(dd.length)
                        console.log("done")
                    })
                    // res.json("done")
            })
        })
    });
})


router.get('/updateAllDealsForRed', function(req, res) {
    var dd = [];
    Service.find({}, { serviceCode: 1, 'prices': 1 }, function(err, services) {
        // dealId:{$in:[276,278,279,281,277]}
        // dealId:{$in:[1,2,3,4,5,6]}
        AllDeals.find({ dealId: { $in: [20] } }, function(err, allDeals) {
            // console.log(allDeals.length)
            async.each(allDeals, function(aD, cb) {
                var selectedDeals = [];

                if (aD.dealType.name == 'combo') {
                    selectedDeals = comboObj(aD, services)
                } else if (aD.dealType.name == 'newCombo') {
                    selectedDeals = newComboObj(aD, services)
                } else {
                    selectedDeals = dealPriceObj2(aD)
                }
                // console.log(selectedDeals[0].services)
                var serviceCodes = [],
                    dealIds = [],
                    selectedDeals = selectedDeals,
                    latitude = 20,
                    longitude = 20,
                    parlors = [],
                    deals = [],
                    selectedDealsType = [],
                    slabs = [],
                    newComboDeals = [];
                _.forEach(selectedDeals, function(s) {
                        dealIds.push(s.dealId);
                        _.forEach(s.services, function(service) {
                            serviceCodes.push(service.serviceCode);

                        });
                        // console.log(dealIds)
                        // console.log(serviceCodes)
                        serviceCodes = _.uniqBy(serviceCodes, function(e) { return e; });
                        User.findOne({ _id: req.query.userId }, { favourites: 1, recent: 1 }, function(err, user) {
                            if (!user) user = {};
                            Async.parallel([
                                    function(callback) {
                                        AggregateService.allParlorServiceByCode(serviceCodes, req.body.parlorId, function(results) {
                                            parlors = results;
                                            callback(null);
                                        });
                                    },
                                    function(callback) {
                                        AggregateService.allDealsServiceByCode(serviceCodes, req.body.parlorId, function(results) {
                                            deals = results;
                                            callback(null);
                                        });
                                    },
                                    function(callback) {
                                        AllDeals.find({ dealId: { $in: dealIds }, active: 1 }, { dealId: 1, 'dealType.name': 1 }, function(err, alldeals) {
                                            selectedDealsType = _.map(alldeals, function(d) {
                                                return {
                                                    dealId: d.dealId,
                                                    dealType: d.dealType.name,
                                                }
                                            });
                                            callback(null);
                                        });
                                    },
                                    function(callback) {
                                        Slab.find({}, function(err, sa) {
                                            slabs = sa;
                                            callback(null);
                                        });
                                    },
                                    function(callback) {
                                        AggregateService.comboNewComboParlors(dealIds, req.body.parlorId, function(comb) {
                                            newComboDeals = comb;
                                            callback(null);
                                        });
                                    }
                                ],
                                function(err, results) {

                                    _.forEach(parlors, function(parlor) {

                                        populateDealPrice(parlor.parlorId, parlor.services, deals);

                                        parlor.deals = [];
                                        _.forEach(selectedDealsType, function(selectedDealType) {
                                            if (selectedDealType.dealType == "combo" || selectedDealType.dealType == "newCombo") {
                                                var comboDeal = _.filter(newComboDeals, function(d) { return d.dealId == selectedDealType.dealId })[0];
                                                var parlorPresent = _.filter(comboDeal.parlors, function(p) { return p.parlorId + "" == parlor.parlorId + "" })[0];
                                                if (parlorPresent) {
                                                    populateComboDeal(selectedDeals, parlor, selectedDealType, parlorPresent.dealId, slabs, comboDeal.slabId, req.body.parlorId);
                                                }
                                            } else {
                                                // console.log(selectedDealType.dealType)
                                                populateGeneralDeal(selectedDeals, parlor, selectedDealType);
                                            }
                                        });

                                    });
                                    parlors = _.map(parlors, function(p) {
                                        return {
                                            parlorId: p.parlorId,
                                            deals: p.deals,
                                        }
                                    });
                                    parlors = _.filter(parlors, function(p) { return p.deals.length == selectedDeals.length });
                                    populateParlor(parlors, latitude, longitude, function(requiredResult) {
                                        // console.log(requiredResult)
                                        if (!req.body.parlorId) {

                                            var updateFinalObj = [];

                                            var redParlors = [{ cityId: 1, parlorPrice: [] }, { cityId: 2, parlorPrice: [] }],
                                                blueParlors = [{ cityId: 1, parlorPrice: [] }, { cityId: 2, parlorPrice: [] }],
                                                greenParlors = [{ cityId: 1, parlorPrice: [] }, { cityId: 2, parlorPrice: [] }];
                                            _.forEach(requiredResult, function(rr) {
                                                    var redObj = {},
                                                        blueObj = {},
                                                        greeObj = {};
                                                    if (rr.parlorType == 0) {
                                                        // redObj.parlorType = 0,
                                                        redObj.dealPrice = rr.dealPrice;
                                                        redObj.menuPrice = rr.menuPrice;

                                                        // console.log("redParlors" ,redParlors)
                                                        if (rr.cityId == 1) {
                                                            redParlors[0].parlorPrice.push(redObj)
                                                            console.log(redObj.dealPrice + "----" + rr.name)
                                                        } else redParlors[1].parlorPrice.push(redObj)

                                                    }
                                                    if (rr.parlorType == 1) {
                                                        // blueObj.parlorType = 1,
                                                        blueObj.dealPrice = rr.dealPrice;
                                                        blueObj.menuPrice = rr.menuPrice;

                                                        if (rr.cityId == 1) blueParlors[0].parlorPrice.push(blueObj)
                                                        else blueParlors[1].parlorPrice.push(blueObj)
                                                    }
                                                    if (rr.parlorType == 2) {
                                                        // greeObj.parlorType = 2,
                                                        greeObj.dealPrice = rr.dealPrice;
                                                        greeObj.menuPrice = rr.menuPrice;

                                                        if (rr.cityId == 1) greenParlors[0].parlorPrice.push(greeObj)
                                                        else greenParlors[1].parlorPrice.push(greeObj)
                                                    }
                                                })
                                                // console.log(redParlors[0].parlorPrice)
                                                // console.log(blueParlors[0].parlorPrice)
                                                // console.log(greenParlors[0].parlorPrice)

                                            redParlors.forEach(function(city) {
                                                if (city.parlorPrice.length > 0) city.parlorPrice = city.parlorPrice.sort(function(a, b) { return a.dealPrice - b.dealPrice; })[0];
                                            })
                                            blueParlors.forEach(function(city) {
                                                if (city.parlorPrice.length > 0) city.parlorPrice = city.parlorPrice.sort(function(a, b) { return a.dealPrice - b.dealPrice; })[0];
                                            })
                                            greenParlors.forEach(function(city) {
                                                if (city.parlorPrice.length > 0) city.parlorPrice = city.parlorPrice.sort(function(a, b) { return a.dealPrice - b.dealPrice; })[0];
                                            })


                                            redParlors.forEach(function(city) {
                                                // console.log("city" , city.parlors)
                                                var newObj = [];
                                                if (city.parlorPrice.dealPrice == null) {

                                                }
                                                // if(city.parlorPrice.length > 0){
                                                // city.parlorPrice =[]
                                                var arr = {
                                                        type: 0,
                                                        startAt: Math.round(city.parlorPrice.dealPrice) || 0,
                                                        percent: Math.round(((city.parlorPrice.menuPrice - city.parlorPrice.dealPrice) / city.parlorPrice.menuPrice) * 100) || 0
                                                    }
                                                    //
                                                newObj.push(arr)
                                                city.parlorPrice = newObj;

                                                // }
                                            })
                                            blueParlors.forEach(function(city) {
                                                // if(city.parlorPrice.length > 0){
                                                // city.parlorPrice =[]
                                                var newObj = []
                                                    // if(city.parlorPrice.length > 0){
                                                    // city.parlorPrice =[]
                                                var arr = {
                                                        type: 1,
                                                        startAt: Math.round(city.parlorPrice.dealPrice) || 0,
                                                        percent: Math.round(((city.parlorPrice.menuPrice - city.parlorPrice.dealPrice) / city.parlorPrice.menuPrice) * 100) || 0
                                                    }
                                                    //
                                                newObj.push(arr)
                                                city.parlorPrice = arr;
                                                // }
                                            })
                                            greenParlors.forEach(function(city) {
                                                    // city.parlorPrice =[]
                                                    var newObj = []
                                                        // if(city.parlorPrice.length > 0){
                                                        // city.parlorPrice =[]
                                                    var arr = {
                                                            type: 2,
                                                            startAt: Math.round(city.parlorPrice.dealPrice) || 0,
                                                            percent: Math.round(((city.parlorPrice.menuPrice - city.parlorPrice.dealPrice) / city.parlorPrice.menuPrice) * 100) || 0
                                                        }
                                                        //
                                                    newObj.push(arr)
                                                    city.parlorPrice = arr;
                                                })
                                                // console.log("reddddddddddddddddddddd" , redParlors[0].parlorPrice)

                                            redParlors.forEach(function(city) {
                                                    var greenObj = { type: 2, startAt: 0, percent: 0 }
                                                    var blueObj = { type: 1, startAt: 0, percent: 0 }
                                                    greenObj = _.filter(greenParlors, function(gP) { return gP.cityId == city.cityId })[0];
                                                    blueObj = _.filter(blueParlors, function(gP) { return gP.cityId == city.cityId })[0];

                                                    var arr = {
                                                            type: 0,
                                                            startAt: Math.round(city.parlorPrice.dealPrice) || 0,
                                                            percent: Math.round(((city.parlorPrice.menuPrice - city.parlorPrice.dealPrice) / city.parlorPrice.menuPrice) * 100) || 0
                                                        }
                                                        // console.log("greenObj " ,greenObj)
                                                    city.parlorPrice.push(greenObj.parlorPrice)
                                                    city.parlorPrice.push(blueObj.parlorPrice)
                                                })
                                                // console.log(redParlors[0].parlorPrice)
                                            AllDeals.findOne({ _id: aD._id }, { parlorTypesDetail: 1 }, function(err, dealFind) {

                                                    _.forEach(dealFind.parlorTypesDetail, function(dpp) {
                                                        var temp = _.filter(redParlors, function(gP) { return gP.cityId == dpp.cityId })[0];
                                                        var temp2 = _.filter(temp.parlorPrice, function(gP1) { return gP1.type == 0 })[0];

                                                        _.forEach(dpp.parlorPrice, function(pri) {
                                                            if (pri.type == 0 && pri.startAt == 0) {
                                                                console.log(temp2)
                                                                pri.percent = temp2.percent;
                                                                pri.startAt = temp2.startAt;
                                                            }
                                                        })
                                                    });

                                                    AllDeals.update({ _id: aD._id }, { parlorTypesDetail: dealFind.parlorTypesDetail }, function(err, update) {
                                                        console.log(update)
                                                        console.log(err)
                                                        dd.push(selectedDeals)

                                                        cb();
                                                    })
                                                })
                                                // return res.json(CreateObjService.response(false, { parlors: updateFinalObj }))
                                                // cb();
                                        } else {
                                            cb();
                                        }

                                    });
                                });
                        });
                    }, function allTaskCompleted() {
                        res.json(dd.length)
                        console.log("done")
                    })
                    // res.json("done")
            })
        })
    });
})

function comboObj(allDeals, serviceIds) {
    console.log("Combo")
    var selectedDeals = [],
        selectObj = {},
        service = [];

    selectObj.dealId = allDeals.dealId;
    _.forEach(allDeals.services, function(aa) {
        var serviceObj = {};

        var serCode = _.filter(serviceIds, function(p) { return aa.serviceCode + "" == p.serviceCode + "" })[0];
        serviceObj.serviceCode = aa.serviceCode;
        var minRatio = 1;
        if (allDeals.brands.length > 0) {
            _.forEach(allDeals.brands , function(br){
                if(br.ratio <= minRatio){
                    serviceObj.brandId = br.brandId;
                }
                if (br.products.length > 0){
                    _.forEach(br.products , function(pr){
                        if(pr.ratio <= minRatio)
                            serviceObj.productId = pr.productId;
                    })
                }
            })
        }
        // _.forEach(serCode.prices, function(price) {
        //     if (price.brand.brands.length > 0) {
        //         _.forEach(price.brand.brands, function(br) {
        //             // if(br.ratio <= minRatio){
        //             serviceObj.brandId = br.brandId;
        //             // }
        //             if (br.products.length > 0) {
        //                 _.forEach(br.products, function(pr) {
        //                     // if(pr.ratio <= minRatio)
        //                     serviceObj.productId = pr.productId;
        //                 })
        //             }
        //         })
        //     }
        // })

        service.push(serviceObj);
    })
    selectObj.services = service;
    selectedDeals.push(selectObj)

    if (selectedDeals.length > 0) {
        return selectedDeals;

    }
};

function newComboObj(allDeals, serviceIds) {
    console.log("newCombo")
    var selectedDeals = [],
        selectObj = {},
        service = [];
    selectObj.dealId = allDeals.dealId;
    _.forEach(allDeals.newCombo, function(aa) {
        // _.forEach(aa.serviceIds , function(ser){
        var serviceObj = {};
        var serCode = _.filter(serviceIds, function(p) { return p.id + "" == aa.serviceIds[0] + "" })[0];
        // console.log(serCode)
        serviceObj.serviceCode = serCode.serviceCode;
        var minRatio = 1;
        _.forEach(serCode.prices, function(price) {
            if (price.brand.brands.length > 0) {
                _.forEach(price.brand.brands, function(br) {
                    // if(br.ratio <= minRatio){
                    serviceObj.brandId = br.brandId;
                    // }
                    if (br.products.length > 0) {
                        _.forEach(br.products, function(pr) {
                            // if(pr.ratio <= minRatio)
                            serviceObj.productId = pr.productId;
                        })
                    }
                })
            }
        })
        service.push(serviceObj);

        // })
    })

    selectObj.services = service;
    selectedDeals.push(selectObj)

    if (selectedDeals.length > 0) {
        return selectedDeals;
    }
}

function dealPriceObj(allDeals) {
    console.log("dealPrice")
    var selectedDeals = [],
        selectObj = {},
        service = [];

    selectObj.dealId = allDeals.dealId;
    _.forEach(allDeals.services, function(ser) {
        var serviceObj = {};
        serviceObj.serviceCode = ser.serviceCode;
        // if (allDeals.brands.length > 0) {
        //     _.forEach(allDeals.brands, function(br) {
        //         serviceObj.brandId = br.brandId;
        //         if (br.products.length > 0) {
        //             _.forEach(br.products, function(pr) {
        //                 serviceObj.productId = pr.productId;
        //             })
        //         }
        //     })
        // }
        if (allDeals.dealType.name == "dealPrice") {
            if (allDeals.dealId == 17) {
                serviceObj.serviceCode = 503;
                serviceObj.brandId = "59520f9364cd9509caa273f2";
            } else if (allDeals.dealId == 2) {
                serviceObj.serviceCode = 92;
                // serviceObj.brandId = "59520f9364cd9509caa273f2";

            } else if (allDeals.dealId == 4) {
                serviceObj.brandId = "5935644800868d2da81bb91b";
                // serviceObj.brandId = "5935646e00868d2da81bb91c";
                serviceObj.serviceCode = 98;
            } else if (allDeals.dealId == 5) {
                serviceObj.brandId = "5935644800868d2da81bb91b";
                // serviceObj.brandId = "5935646e00868d2da81bb91c";
                serviceObj.serviceCode = 100;
            } else if (allDeals.dealId == 23) {
                // serviceObj.brandId = "5935644800868d2da81bb91b";
                // serviceObj.brandId = "5935646e00868d2da81bb91c";
                serviceObj.serviceCode = 31;
            } else {
                serviceObj.serviceCode = ser.serviceCode;
                if (allDeals.brands.length > 0) {
                    _.forEach(allDeals.brands, function(br) {
                        serviceObj.brandId = br.brandId;
                        if (br.products.length > 0) {
                            _.forEach(br.products, function(pr) {
                                serviceObj.productId = pr.productId;
                            })
                        }
                    })
                }
            }
        }

        if (allDeals.dealType.name == "chooseOne") {
            if (allDeals.dealId == 13) {

                serviceObj.serviceCode = 395;
                serviceObj.brandId = "594ccb763c61904155d48535";
            } else if (allDeals.dealId == 14) {
                serviceObj.serviceCode = 244;
                serviceObj.brandId = "594ccb763c61904155d48535";
            } else if (allDeals.dealId == 20) {
                // serviceObj.serviceCode = 415;
                serviceObj.serviceCode = 415;
                // serviceObj.brandId = "594ccb763c61904155d48535";
            } else if (allDeals.dealId == 22) {
                serviceObj.serviceCode = 413;
                // serviceObj.brandId = "594ccb763c61904155d48535";
            } else if (allDeals.dealId == 47) {

                serviceObj.serviceCode = 233;
                serviceObj.brandId = "5935646e00868d2da81bb91c";
            } else if (allDeals.dealId == 48) {
                serviceObj.serviceCode = 258;
                serviceObj.brandId = "5935646e00868d2da81bb91c";
            } else if (allDeals.dealId == 1) {
                serviceObj.serviceCode = 89;
                serviceObj.brandId = "5935646e00868d2da81bb91c";
            } else if (allDeals.dealId == 12) {
                serviceObj.brandId = "594ccab23c61904155d4852a";
                serviceObj.serviceCode = 379;
            } else if (allDeals.dealId == 97) {
                serviceObj.brandId = "594b9a09b2c790205b8b7d94";
                serviceObj.productId = "594b97eab2c790205b8b7d7b";
                serviceObj.serviceCode = 255;
            } else if (allDeals.dealId == 100) {
                serviceObj.brandId = "594b9a13b2c790205b8b7d95";
                serviceObj.productId = "594b97eab2c790205b8b7d7b";
                serviceObj.serviceCode = 253;
            } else if (allDeals.dealId == 130) {
                serviceObj.brandId = "5935644800868d2da81bb91b";
                serviceObj.serviceCode = 302;
            } else if (allDeals.dealId == 131) {
                serviceObj.brandId = "5935644800868d2da81bb91b";
                serviceObj.serviceCode = 304;
            } else if (allDeals.dealId == 131) {
                serviceObj.brandId = "5935644800868d2da81bb91b";
                serviceObj.serviceCode = 304;
            } else if (allDeals.dealId == 3) {
                serviceObj.brandId = "5935644800868d2da81bb91b";
                serviceObj.productId = "593565a500868d2da81bb921";
                serviceObj.serviceCode = 96;
            } else if (allDeals.dealId == 153) {
                serviceObj.brandId = "5935644800868d2da81bb91b";
                serviceObj.serviceCode = 230;
            } else if (allDeals.dealId == 154) {
                serviceObj.brandId = "594b99fcb2c790205b8b7d93";
                serviceObj.serviceCode = 502;
            } else if (allDeals.dealId == 6) {
                serviceObj.brandId = "5935644800868d2da81bb91b";
                serviceObj.serviceCode = 101;
            } else if (allDeals.dealId == 40) {
                serviceObj.serviceCode = 65;
                serviceObj.brandId = "5935646e00868d2da81bb91c";
            } else if (allDeals.dealId == 39) {
                serviceObj.serviceCode = 305;
                serviceObj.brandId = "5935646e00868d2da81bb91c";
            } else if (allDeals.dealId == 292) {
                serviceObj.serviceCode = 47;
            } else if (allDeals.dealId == 293) {
                serviceObj.serviceCode = 211;
            } else if (allDeals.dealId == 294) {
                serviceObj.serviceCode = 227;
            } else if (allDeals.dealId == 39) {
                serviceObj.serviceCode = 305;
                serviceObj.brandId = "5935646e00868d2da81bb91c";
            } //new deALS
            else if (allDeals.dealId == 322) {
                serviceObj.serviceCode = 305;
                serviceObj.brandId = "5935646e00868d2da81bb91c";
            }else if (allDeals.dealId == 315) {
                serviceObj.serviceCode = 305;
                serviceObj.brandId = "5935646e00868d2da81bb91c";
            }else if (allDeals.dealId == 316) {
                serviceObj.serviceCode = 305;
                serviceObj.brandId = "5935646e00868d2da81bb91c";
            }else if (allDeals.dealId == 317) {
                serviceObj.serviceCode = 305;
                serviceObj.brandId = "5935646e00868d2da81bb91c";
            }else if (allDeals.dealId == 324) {
                serviceObj.serviceCode = 305;
                serviceObj.brandId = "5935646e00868d2da81bb91c";
            }else if (allDeals.dealId == 323) {
                serviceObj.serviceCode = 305;
                serviceObj.brandId = "5935646e00868d2da81bb91c";
            }else if (allDeals.dealId == 325) {
                serviceObj.serviceCode = 305;
                serviceObj.brandId = "5935646e00868d2da81bb91c";
            }//new deALS
            else {
                serviceObj.serviceCode = ser.serviceCode;
            }
        }
        var minRatio = 1;
        // if (allDeals.brands.length > 0) {
        //     _.forEach(allDeals.brands , function(br){
        //         if(br.ratio <= minRatio){
        //             serviceObj.brandId = br.brandId;
        //         }
        //         if (br.products.length > 0){
        //             _.forEach(br.products , function(pr){
        //                 if(pr.ratio <= minRatio)
        //                     serviceObj.productId = pr.productId;
        //             })
        //         }
        //     })
        // }
        service.push(serviceObj);
    })
    selectObj.services = service;
    selectedDeals.push(selectObj)

    if (selectedDeals.length > 0) {
        return selectedDeals;
    }
};


function dealPriceObj2(allDeals) {
    console.log("dealPrice")
    var selectedDeals = [],
        selectObj = {},
        service = [];

    selectObj.dealId = allDeals.dealId;
    _.forEach(allDeals.services, function(ser) {
        var serviceObj = {};
        serviceObj.serviceCode = ser.serviceCode;
        // if (allDeals.brands.length > 0) {
        //     _.forEach(allDeals.brands, function(br) {
        //         serviceObj.brandId = br.brandId;
        //         if (br.products.length > 0) {
        //             _.forEach(br.products, function(pr) {
        //                 serviceObj.productId = pr.productId;
        //             })
        //         }
        //     })
        // }
        if (allDeals.dealType.name == "dealPrice") {
            if (allDeals.dealId == 17) {
                serviceObj.serviceCode = 503;
                serviceObj.brandId = "594b99fcb2c790205b8b7d93";
            } else if (allDeals.dealId == 2) {
                serviceObj.serviceCode = 92;
                serviceObj.brandId = "5935646e00868d2da81bb91c";

            } else if (allDeals.dealId == 4) {
                serviceObj.brandId = "5935646e00868d2da81bb91c";
                serviceObj.serviceCode = 98;
            } else if (allDeals.dealId == 5) {
                serviceObj.brandId = "5935646e00868d2da81bb91c";
                serviceObj.serviceCode = 100;
            } else {
                serviceObj.serviceCode = ser.serviceCode;
                if (allDeals.brands.length > 0) {
                    _.forEach(allDeals.brands, function(br) {
                        serviceObj.brandId = br.brandId;
                        if (br.products.length > 0) {
                            _.forEach(br.products, function(pr) {
                                serviceObj.productId = pr.productId;
                            })
                        }
                    })
                }
            }
        }

        if (allDeals.dealType.name == "chooseOne") {
            if (allDeals.dealId == 13) {

                serviceObj.serviceCode = 395;
                serviceObj.brandId = "594ccb763c61904155d48535";
            } else if (allDeals.dealId == 14) {
                serviceObj.serviceCode = 244;
                serviceObj.brandId = "594ccb763c61904155d48535";
            } else if (allDeals.dealId == 20) {
                serviceObj.serviceCode = 227;
                // serviceObj.brandId = "594ccb763c61904155d48535";
            } else if (allDeals.dealId == 22) {
                serviceObj.serviceCode = 413;
                // serviceObj.brandId = "594ccb763c61904155d48535";
            } else if (allDeals.dealId == 47) {

                serviceObj.serviceCode = 233;
                serviceObj.brandId = "5935646e00868d2da81bb91c";
            } else if (allDeals.dealId == 48) {
                serviceObj.serviceCode = 258;
                serviceObj.brandId = "5935646e00868d2da81bb91c";
            } else if (allDeals.dealId == 1) {
                serviceObj.serviceCode = 89;
                serviceObj.brandId = "5935646e00868d2da81bb91c";
            } else if (allDeals.dealId == 12) {
                serviceObj.brandId = "594ccab23c61904155d4852a";
                serviceObj.serviceCode = 379;
            } else if (allDeals.dealId == 97) {
                serviceObj.brandId = "594b9a09b2c790205b8b7d94";
                serviceObj.productId = "594b97eab2c790205b8b7d7b";
                serviceObj.serviceCode = 255;
            } else if (allDeals.dealId == 100) {
                serviceObj.brandId = "594b9a13b2c790205b8b7d95";
                serviceObj.productId = "594b97eab2c790205b8b7d7b";
                serviceObj.serviceCode = 253;
            } else if (allDeals.dealId == 130) {
                serviceObj.brandId = "5935644800868d2da81bb91b";
                serviceObj.serviceCode = 302;
            } else if (allDeals.dealId == 131) {
                serviceObj.brandId = "5935644800868d2da81bb91b";
                serviceObj.serviceCode = 304;
            } else if (allDeals.dealId == 131) {
                serviceObj.brandId = "5935644800868d2da81bb91b";
                serviceObj.serviceCode = 304;
            } else if (allDeals.dealId == 3) {
                serviceObj.brandId = "5935646e00868d2da81bb91c";
                serviceObj.productId = "593564a100868d2da81bb91d";
                serviceObj.serviceCode = 96;
            } else if (allDeals.dealId == 153) {
                serviceObj.brandId = "5935644800868d2da81bb91b";
                serviceObj.serviceCode = 230;
            } else if (allDeals.dealId == 154) {
                serviceObj.brandId = "594b99fcb2c790205b8b7d93";
                serviceObj.serviceCode = 502;
            } else if (allDeals.dealId == 6) {
                serviceObj.brandId = "5935646e00868d2da81bb91c";
                serviceObj.serviceCode = 101;
            } else if (allDeals.dealId == 40) {
                serviceObj.serviceCode = 65;
                serviceObj.brandId = "5935646e00868d2da81bb91c";
            } else if (allDeals.dealId == 39) {
                serviceObj.serviceCode = 305;
                serviceObj.brandId = "5935646e00868d2da81bb91c";
            } else {
                serviceObj.serviceCode = ser.serviceCode;
            }
        }
        var minRatio = 1;
        // if (allDeals.brands.length > 0) {
        //     _.forEach(allDeals.brands , function(br){
        //         if(br.ratio <= minRatio){
        //             serviceObj.brandId = br.brandId;
        //         }
        //         if (br.products.length > 0){
        //             _.forEach(br.products , function(pr){
        //                 if(pr.ratio <= minRatio)
        //                     serviceObj.productId = pr.productId;
        //             })
        //         }
        //     })
        // }
        service.push(serviceObj);
    })
    selectObj.services = service;
    selectedDeals.push(selectObj)

    if (selectedDeals.length > 0) {
        return selectedDeals;
    }
};


function getbrandParlorTypes(brand, cityId) {
    var parlorTypes = [];

    _.forEach(brand.products, function(product) {


        var cityPrice = _.filter(product.parlorTypes, function(par) { return par.cityId == cityId })[0];
        product.parlorTypes = cityPrice;
    })

    var redLowest = {},
        redStartAt = 999999,
        redPercent = 0;
    var blueLowest = {},
        blueStartAt = 999999,
        bluePercent = 0;
    var greenLowest = {},
        greenStartAt = 999999,
        greenPercent = 0;
    var parlorPrice = [];

    // console.log("brand.products" ,brand.products)
    _.forEach(brand.products, function(par) {
        // console.log("par.parlorTypes" ,par.parlorTypes)
        _.forEach(par.parlorTypes.parlorPrice, function(pt) {
            // console.log("ptttttttttttttt" ,pt)
            if (pt.type == 0 && redStartAt >= pt.startAt && redPercent < pt.percent) {
                redLowest.type = 0;
                redLowest.percent = pt.percent;
                redLowest.startAt = pt.startAt;

                // console.log("redLowest" ,redLowest)

            }
            if (pt.type == 1 && blueStartAt >= pt.startAt && bluePercent < pt.percent) {
                blueLowest.type = 1;
                blueLowest.percent = pt.percent;
                blueLowest.startAt = pt.startAt;



            }
            if (pt.type == 2 && greenStartAt >= pt.startAt && greenPercent < pt.percent) {
                greenLowest.type = 2
                greenLowest.percent = pt.percent;
                greenLowest.startAt = pt.startAt;


            }
        })

    })
    parlorPrice.push(greenLowest)
    parlorPrice.push(blueLowest)
    parlorPrice.push(redLowest)

    console.log("parlorTypes", parlorPrice)

    parlorTypes.push({ cityId: cityId, parlorPrice: parlorPrice })

    return parlorTypes
};

router.post('/updateBrandParlorType', function(req, res) {
    var d = [];
    Service.find({ $or: [{ 'prices.brand.brands.products': { $size: 1 } }, { 'prices.brand.brands.products': { $size: 2 } }] }, { serviceCode: 1, prices: 1 }, function(err, services) {
        async.each(services, function(s, callback) {
            if (s.prices[0].brand.brands.length > 0) {
                _.forEach(s.prices[0].brand.brands, function(brand) {
                    if (brand.products.length > 0) {
                        var dd = [];
                        async.each([1, 2 , 3], function(cityId, call) {
                            // _.forEach(brand.products ,function(product){
                            //     var cityPrice =  _.filter(product.parlorTypes ,function(par){return par.cityId ==cityId })[0];
                            //         product.parlorTypes=cityPrice;
                            // })
                            var parlorTypes = [];
                            var redLowest = {},
                                redStartAt = 999999,
                                redPercent = 0;
                            var blueLowest = {},
                                blueStartAt = 999999,
                                bluePercent = 0;
                            var greenLowest = {},
                                greenStartAt = 999999,
                                greenPercent = 0;
                            var parlorPrice = [];

                            _.forEach(brand.products, function(par) {

                                _.forEach(par.parlorTypes, function(ptypes) {

                                    _.forEach(ptypes.parlorPrice, function(pt) {
                                        console.log("pt---------------", pt)
                                        if (pt) {
                                            if (ptypes.cityId == cityId && pt.type == 0 && redStartAt >= pt.startAt && redPercent <= pt.percent) {
                                                redLowest.type = 0;
                                                redLowest.percent = pt.percent;
                                                redLowest.startAt = pt.startAt;

                                                console.log(redLowest)
                                            }
                                            if (ptypes.cityId == cityId && pt.type == 1 && blueStartAt >= pt.startAt && bluePercent <= pt.percent) {
                                                blueLowest.type = 1;
                                                blueLowest.percent = pt.percent;
                                                blueLowest.startAt = pt.startAt;

                                            }
                                            if (ptypes.cityId == cityId && pt.type == 2 && greenStartAt >= pt.startAt && bluePercent <= pt.percent) {
                                                greenLowest.type = 2
                                                greenLowest.percent = pt.percent;
                                                greenLowest.startAt = pt.startAt;
                                            }
                                        }
                                    })
                                })
                            })
                            if (blueLowest.startAt != 999999) parlorPrice.push(blueLowest)
                            if (redLowest.startAt != 999999) parlorPrice.push(redLowest)
                            if (greenLowest.startAt != 999999) parlorPrice.push(greenLowest)

                            console.log("parlorTypes", parlorPrice)

                            dd.push({ cityId: cityId, parlorPrice: parlorPrice })

                            // dd.push(parlorTypes)

                            call();
                        }, function allTaskCompleted() {
                            brand.parlorTypes = dd;
                            var cities = [1, 2 ,3];
                            var final1 = [],
                                final2 = [];
                            cities.forEach(function(city) {

                                var cityLowest = {},
                                    saveUpto = {};
                                var lowestPrice = 999999,
                                    maxPercent = 100;
                                var cityPrice = _.filter(brand.parlorTypes, function(par) { return par.cityId == city })[0];
                                cityPrice.parlorPrice.forEach(function(category) {
                                    // if(category.startAt<lowestPrice && category.percent<maxPercent && category.startAt>0){

                                    console.log(category)
                                    if (category.startAt < lowestPrice && category.startAt > 0) {
                                        maxPercent = category.percent;
                                        lowestPrice = category.startAt
                                    }

                                })
                                cityLowest = { cityId: city, startAt: lowestPrice }
                                saveUpto = { cityId: city, percent: maxPercent }

                                final1.push(cityLowest);
                                final2.push(saveUpto);
                            })
                            brand.lowest = final1;
                            brand.saveUpto = final2;
                            Service.update({ serviceCode: s.serviceCode }, { prices: s.prices }, function(err, updated) {
                                d.push(updated)
                                callback()
                            })
                        })
                    } else {
                        callback();
                    }
                })
            } else {
                callback();
            }
        }, function allTaskCompleted() {
            res.json(d)
        });
    })
});


router.post('/updateServiceParlorType', function(req, res) {
    // var serviceCode , brandId , productId;

    var dd = [];
    Service.find({}, { serviceCode: 1, prices: 1 }, function(err, services) {
        async.each(services, function(s, call) {
            var serviceCode = s.serviceCode;
            dd.push(serviceCode)
            if (s.prices[0].brand.brands.length > 0) {
                _.forEach(s.prices[0].brand.brands, function(brand) {
                    // var lowestPrice=0,maxPercent=0;
                    var brandId = brand.brandId;
                    if (brand.products.length > 0) {
                        _.forEach(brand.products, function(pro) {
                            var productId = pro.productId;
                            var d = [];
                            // var finalProduct=[]
                            async.each([1, 2 , 3], function(cityId, cb) {
                                if (cityId == 1) {
                                    getServiceBrandLowestPrice(serviceCode, cityId, brandId, productId, function(parlorTypes) {
                                        // console.log(parlorTypes)
                                        d.push({ cityId: 1, parlorPrice: parlorTypes })
                                        cb()
                                    })
                                }
                                if (cityId == 2) {
                                    getServiceBrandLowestPrice(serviceCode, cityId, brandId, productId, function(parlorTypes) {
                                        d.push({ cityId: 2, parlorPrice: parlorTypes })
                                        cb()
                                    })
                                }
                                if (cityId == 3) {
                                    getServiceBrandLowestPrice(serviceCode, cityId, brandId, productId, function(parlorTypes) {
                                        d.push({ cityId: 3, parlorPrice: parlorTypes })
                                        cb()
                                    })
                                }

                            }, function allTaskCompleted() {
                                pro.parlorTypes = d;

                                // brand.parlorTypes =brandParlorType;
                                // if(serviceCode==101){console.log(d)}
                                Service.update({ serviceCode: serviceCode }, { prices: s.prices }, function(err, serviceUpdate) {
                                    if (err) console.log(err);
                                    else console.log(serviceUpdate)
                                    call()
                                })

                            })


                            //
                        })
                    } else {
                        var d = [];
                        var lowest = {};
                        async.each([1, 2, 3], function(cityId, cb) {
                                if (cityId == 1) {
                                    getServiceBrandLowestPrice(serviceCode, cityId, brandId, null, function(parlorTypes) {
                                        d.push({ cityId: 1, parlorPrice: parlorTypes })

                                        cb()
                                    })
                                }
                                if (cityId == 2) {
                                    getServiceBrandLowestPrice(serviceCode, cityId, brandId, null, function(parlorTypes) {
                                        d.push({ cityId: 2, parlorPrice: parlorTypes })
                                        cb()
                                    })
                                }
                                if (cityId == 3) {
                                    getServiceBrandLowestPrice(serviceCode, cityId, brandId, null, function(parlorTypes) {
                                        d.push({ cityId: 3, parlorPrice: parlorTypes })
                                        cb()
                                    })
                                }

                            }, function allTaskCompleted() {
                                // dd.push(d)
                                brand.parlorTypes = d;
                                var cities = [1, 2 , 3];
                                var final1 = [],
                                    final2 = [];
                                cities.forEach(function(city) {

                                    var cityLowest = {},
                                        saveUpto = {};
                                    var lowestPrice = 999999,
                                        maxPercent = 100;
                                    var cityPrice = _.filter(brand.parlorTypes, function(par) { return par.cityId == city })[0];
                                    cityPrice.parlorPrice.forEach(function(category) {
                                        // if(category.startAt<lowestPrice && category.percent<maxPercent && category.startAt>0){
                                        if (category.startAt < lowestPrice && category.startAt > 0) {
                                            maxPercent = category.percent;
                                            lowestPrice = category.startAt
                                        }

                                    })
                                    cityLowest = { cityId: city, startAt: lowestPrice }
                                    saveUpto = { cityId: city, percent: maxPercent }

                                    final1.push(cityLowest);
                                    final2.push(saveUpto);
                                })
                                brand.lowest = final1;
                                brand.saveUpto = final2;

                                if (serviceCode == 101) { console.log(d) }
                                Service.update({ serviceCode: serviceCode }, { prices: s.prices }, function(err, serviceUpdate) {
                                    if (err) console.log(err);
                                    else console.log(serviceUpdate)
                                    call()
                                })

                            })
                            // call()
                    }
                })

            } else {
                var d = [];
                async.each([1, 2,3], function(cityId, cb) {
                    if (cityId == 1) {
                        getServiceBrandLowestPrice(serviceCode, cityId, null, null, function(parlorTypes) {
                            d.push({ cityId: 1, parlorPrice: parlorTypes })
                            cb()
                        })

                    }
                    if (cityId == 2) {
                        getServiceBrandLowestPrice(serviceCode, cityId, null, null, function(parlorTypes) {
                            d.push({ cityId: 2, parlorPrice: parlorTypes })
                            cb()
                        })

                    }
                    if (cityId == 3) {
                        getServiceBrandLowestPrice(serviceCode, cityId, null, null, function(parlorTypes) {
                            d.push({ cityId: 3, parlorPrice: parlorTypes })
                            cb()
                        })

                    }

                }, function allTaskCompleted() {
                    // dd.push(d)
                    console.log(d)

                    s.prices[0].parlorTypes = d;
                    console.log(s.prices[0].parlorTypes)
                    console.log(s.prices[0])
                    Service.update({ serviceCode: serviceCode }, { prices: s.prices }, function(err, serviceUpdate) {
                        if (err) console.log(err);
                        else console.log(serviceUpdate)
                        call()
                    })


                })
            }
        }, function allTaskCompleted() {
            res.json(dd)
        })

    })

});

function getServiceBrandLowestPrice(serviceCode, cityId, brandId, productId, callback) {
    var parlorTypes = [0, 1, 2];
    var data = [];
    Service.find({ serviceCode: serviceCode }, function(err, allServices) {
        Async.each(parlorTypes, function(parlorType, callback2) {
            Parlor.find({ parlorType: parlorType, cityId: cityId, "services.serviceCode": serviceCode, active: true }, { 'services.$': 1, tax: 1 }, function(err, parlors) {
                var parlorIds = _.map(parlors, function(p) { return p.id });
                Deals.find({ parlorId: { $in: parlorIds }, "dealType.name": { $in: ["dealPrice", "chooseOne", "chooseOnePer"] }, "services.serviceCode": serviceCode }, function(err, deals) {
                    var lowest = 999999,
                        percent = 0;
                    _.forEach(parlors, function(ps) {
                        var s = {
                            serviceCode: serviceCode,
                            brandId: brandId,
                            productId: productId,
                        };

                        var currentDeals = _.filter(deals, function(deal) { return deal.parlorId == ps.id });
                        var temp = Appointment.getServiceRealPrice(ps.services[0].prices[0], s, currentDeals, allServices);
                        if (temp.price * (ps.tax / 100 + 1) < lowest) {
                            lowest = Math.floor(temp.price * (ps.tax / 100 + 1));
                            percent = parseInt(((temp.menuPrice - temp.price) / temp.menuPrice) * 100);
                        }
                    })

                    if (lowest != 999999 && lowest > 0) {
                        data.push({
                            type: parlorType,
                            startAt: lowest,
                            percent: percent,
                        });
                    }
                    callback2();

                });
            })
        }, function allTaskCompleted() {
            // console.log("done");
            // return _.sortBy(data, 'rating').reverse();
            return callback(_.sortBy(data, 'type'));
        });
    });
}

router.get('/mydeals', function(req, res) {
    var dd = []
    Service.find({}, { serviceCode: 1, prices: 1 }, function(err, services) {
        AllDeals.find({ dealId: 261 }, {}, function(err, allDeals) {

            async.each(allDeals, function(aD, cb) {
                var selectedDeals = [];
                if (aD.dealType.name == 'combo') {
                    selectedDeals = comboObj(aD, services)
                } else if (aD.dealType.name == 'newCombo') {
                    selectedDeals = newComboObj(aD, services)
                } else {
                    selectedDeals = dealPriceObj(aD)
                }

                // selectObj.services = service;
                // selectedDeals.push(selectObj)

                console.log(selectedDeals)
                dd.push(selectedDeals)
                cb();
            }, function allTaskCompleted() {
                res.json(dd)
                console.log("done")
            })
        })
    })
});


router.get('/getInactiveEmployees', function(req, res) {
    Admin.find({ active: false, role: { $nin: [7] } }, { firstName: 1, lastName: 1, phoneNumber: 1, emailId: 1, role: 1, position: 1 }, function(err, employees) {
        res.json(employees)
    })
});

router.get('/getServicesForWebsite', function(req, res) {
    Service.aggregate({ $project: { name: 1, serviceCode: 1, serviceId: "$_id", _id: 0, subTitle: 1 } },
        function(err, services) {
            if (agg) {
                return res.json(CreateObjService.response(false, agg));
            } else {
                return res.json(CreateObjService.response(true, 'Error'));
            }
        })
});


router.get('/getAllDealsForWebsite', function(req, res) {
    AllDeals.aggregate([{ $match: { showOnApp: true, $and: [{ 'dealType.name': { $ne: "combo" } }, { 'dealType.name': { $ne: "newCombo" } }] } },
        { $unwind: "$services" },
        { $unwind: "$categoryIds" },
        { $lookup: { from: "servicecategories", localField: "categoryIds", foreignField: "_id", as: "department" } },
        {
            $project: {
                departmentName: { $arrayElemAt: ["$department.superCategory", 0] },
                mainId: "$_id",
                categoryIds: 1,
                genders: 1,
                dealId: 1,
                menuPrice: 1,
                dealPrice: 1,
                description: 1,
                dealName: "$name",
                'serviceName': "$services.name",
                serviceCode: '$services.serviceCode'
            }
        },
        {
            $group: {
                _id: "$mainId",
                departmentName: { $first: "$departmentName" },
                categoryIds: { $first: "$categoryIds" },
                genders: { $first: "$genders" },
                menuPrice: { $first: "$menuPrice" },
                dealPrice: { $first: "$dealPrice" },
                dealId: { $first: "$dealId" },
                description: { $first: "$description" },
                dealName: { $first: "$dealName" },
                services: { $push: { serviceName: "$serviceName", serviceCode: "$serviceCode" } }
            }
        }
    ], function(err, agg) {
        if (agg) {
            return res.json(CreateObjService.response(false, agg));
        } else {
            return res.json(CreateObjService.response(true, 'Error'));
        }
    })
});

router.get('/luckydrawcorrection', function(req, res) {

    LuckyDrawDynamic.aggregate([{
            $match: {
                createdAt: { $gte: new Date(2017, 11, 8), $lt: new Date(2017, 11, 8, 23, 59, 59) }
            }
        },
        { $group: { _id: "$employeeId" } }
    ], function(err, draw) {

        var idForRemove = [];
        async.each(draw, function(d, cbs) {

            LuckyDrawDynamic.find({
                categoryId: { $nin: [7, 8, 9] },
                employeeId: d._id,
                status: 0,
                createdAt: { $gte: new Date(2017, 11, 8), $lt: new Date(2017, 11, 8, 23, 59, 59) }
            }, { amount: 1 }, function(err, single) {
                for (var i = 5; i < single.length; i++) {
                    idForRemove.push(single[i]._id)
                }
                if (idForRemove.length > 0) {
                    // console.log(idForRemove)

                }
                cbs();

            })


        }, function() {


            // LuckyDrawDynamic.remove({ _id: { $in: idForRemove } }, function(err, deleted) {


            // console.log(deleted)
            res.json({ length: idForRemove.length, data: idForRemove })
                // })

            // var query = [
            //     { $match: { _id: { $in: idForRemove } } },
            //     { $group: { _id: null, amount: { $sum: "$amount" } } }
            // ]
            // LuckyDrawDynamic.aggregate(query, function(err, whole) {

            //     res.json(whole)

            // })


        })

    })

});

router.get('/orderImages', function(req, res) {
    ReOrder.find({ createdAt: { $gte: new Date(2017, 11, 1), $lt: new Date(2017, 11, 31) } }, function(err, order) {
        var data = [];
        console.log(order.length)
        for (var i = 0; i < order.length; i++) {
            for (var j = 0; j < order[i].imageUrl.length; j++) {
                data.push({ item: order[i].imageUrl[j].image })
            }

        }
        res.json(data)

    })
})

router.get('/getBangaloreUser', function(req, res) {
    var d = [];
    var dd = [];
    User.find({ createdAt: { $gt: new Date(2017, 10, 1) }, gender: "F", 'couponCodeHistory.code': { $ne: "GBCOL" } }, { latitude: 1, longitude: 1, createdAt: 1 }, function(err, users) {
        console.log(users.length)
        async.each(users, function(u, callback) {
            var cityId = ConstantService.getCityId(u.latitude, u.longitude)

            if (cityId == 2) {
                d.push(u)

                callback()
            } else {
                callback()
            }
        }, function allTaskCompleted() {
            // res.json(d)
            console.log(d.length)
            console.log(users.length)
            var now_date = new Date(2018, 0, 31, 23, 59, 59);
            now_date.setMonth(now_date.getMonth() + 6);
            async.each(d, function(uu, cb) {
                var obj = [{
                    active: true,
                    createdAt: new Date(),
                    code: "GBCOL", //"CORPID15"
                    couponType: 7,
                    expires_at: now_date
                }];

                User.update({ _id: uu._id }, { $push: { couponCodeHistory: { $each: obj } } }, function(err, updated) {
                    // console.log(updated)
                    dd.push(updated)
                    cb();
                })
            }, function allTaskCompleted() {
                res.json(dd.length);
            })
        })
    })
});


function sendElasticMail(emails, html, subject) {
    var options = {
        url: ' https://api.elasticemail.com/v2/email/send',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        "form": {
            "apikey": "670ce84e-6c56-4424-b3aa-282fbeb642ce",
            "from": "customercare@beusalons.com",
            "fromName": "Be U Salons",
            "to": emails,
            "bodyHtml": html,
            "subject": subject
        }
    };
    request.post(options, function(err, res1, body) {
        if (err) {
            console.log(err)
                // cb(true, "error")
        } else {
            var json = JSON.parse(body);
            // console.log(json)

            // cb(false, json)
        }
    });
};




router.get('/email', function(req, res) {
    var d = [];
    var today = new Date();
    var fiveMonths = HelperService.getLastMonthStartDate(today, 150)
    var html = '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"><html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"></head><body data-brackets-id="1163"><div data-brackets-id="1164" style="Margin:0;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;min-width:100%;padding:0;text-align:left;width:100%!important"><table data-brackets-id="1165" style="Margin:0;background:#f3f3f3;border-collapse:collapse;border-spacing:0;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;height:100%;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;width:100%"><tbody data-brackets-id="1166"><tr data-brackets-id="1167" style="padding:0;text-align:left;vertical-align:top"><td data-brackets-id="1168" align="center" valign="top" style="Margin:0 auto;border-collapse:collapse!important;color:#0a0a0a;float:none;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;text-align:center;vertical-align:top;word-wrap:break-word"><center data-brackets-id="1169" style="min-width:580px;width:100%"><table data-brackets-id="1170" bgcolor="#8a8a8a" align="center" class="wrapper header float-center" style="Margin:0 auto;background:#FFF;border-collapse:collapse;border-spacing:0;float:none;margin:0 auto;padding:0;text-align:center;vertical-align:top;width:100%"><tbody data-brackets-id="1171"><tr data-brackets-id="1172" style="padding:0;text-align:left;vertical-align:top"><td data-brackets-id="1173" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;padding-top: 1%!important;text-align:left;vertical-align:top;word-wrap:break-word;background-color: #f3f3f3;"><table data-brackets-id="1174" align="center" class="container" style="Margin:0 auto;background: #d2232a;border-collapse:collapse;border-spacing:0;margin:0 auto;padding:0;text-align:inherit;vertical-align:top;width:580px;"><tbody data-brackets-id="1175"><tr data-brackets-id="1176" style="padding:0;text-align:left;vertical-align:top"><td data-brackets-id="1177" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word"><table data-brackets-id="1178" class="row collapse" style="border-collapse:collapse;border-spacing:0;display:table;padding:0;position:relative;text-align:left;vertical-align:top;width:100%"><tbody data-brackets-id="1179"><tr data-brackets-id="1180" style="padding:0;text-align:left;vertical-align:top"><th data-brackets-id="1181" class="small-8 large-8 columns first" valign="middle" style="Margin:0 auto;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;padding-bottom:0;padding-left:0;padding-right:0;text-align:left;width:298px"><table data-brackets-id="1182" style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%">' +
        '<tbody data-brackets-id="1183"><tr data-brackets-id="1184" style="padding:0;text-align:left;vertical-align:top"><th data-brackets-id="1185" style="Margin:0;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left"><img data-brackets-id="1186" src="http://res.cloudinary.com/dyqcevdpm/image/upload/v1513088859/logoWhite_1_otqqfh.png" style="-ms-interpolation-mode:bicubic;clear:both;display:block;max-width:100%;outline:0;text-decoration:none;width:44%!important;padding-left: 2%;padding-top: 2%;"></th></tr></tbody></table></th><th data-brackets-id="1187" class="small-4 large-4 columns last" valign="middle" style="Margin:0 auto;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;padding-bottom:0;padding-left:0;padding-right:0;text-align:left;width:298px"><p data-brackets-id="1188" style="Margin:0;Margin-bottom:10px;color: #fff;font-family:Lato,sans-serif;font-size:.8em;font-weight:400;line-height:1.3;margin:0;margin-bottom:0;padding:0;text-align: right;padding-right: 4%;padding-top: 3%;">Download App</p><span data-brackets-id="1189" style=""><a data-brackets-id="1190" href="https://play.google.com/store/apps/details?id=com.beusalons.android&amp;amp;hl=en" style="Margin:0;color:#2199e8;font-family:Helvetica,Arial,sans-serif;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left;text-decoration:none"><img data-brackets-id="1191" src="http://res.cloudinary.com/dyqcevdpm/image/upload/v1513147617/android_ju6eid.png" style="-ms-interpolation-mode:bicubic;border:none;clear:both;max-width:100%;outline:0;text-decoration:none;width: 6%!important;padding-top: 1%;"></a></span><span data-brackets-id="1192" style="padding-left: 8%;"><a data-brackets-id="1193" href="https://itunes.apple.com/app/id1206326408?mt=8" style="Margin:0;color:#2199e8;font-family:Helvetica,Arial,sans-serif;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left;text-decoration:none"><img data-brackets-id="1194" src="http://res.cloudinary.com/dyqcevdpm/image/upload/v1513147617/apple_icon_umb9z8.png" style="-ms-interpolation-mode:bicubic;border:none;clear:both;max-width:100%;outline:0;text-decoration:none;width: 6%!important;"></a></span></th></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table><table data-brackets-id="1195" align="center" style="Margin:0 auto;background:#fefefe;border-collapse:collapse;border-spacing:0;float:none;margin:0 auto;padding:0;text-align:center;vertical-align:top;width:580px"><tbody data-brackets-id="1196"><tr data-brackets-id="1197" style="padding:0;text-align:left;vertical-align:top"><td data-brackets-id="1198" style="Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word"><table data-brackets-id="1199" style="border-collapse:collapse;border-spacing:0;display:table;padding:0;position:relative;text-align:left;vertical-align:top;width:100%"><tbody data-brackets-id="1200" style="width: 100%;"><tr data-brackets-id="1201" style="padding:0;text-align:left;vertical-align:top">' +
        '<th data-brackets-id="1202" style="Margin:0 auto;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;text-align:left;"><a href="http://onelink.to/bf45qf"><img data-brackets-id="1203" src="http://res.cloudinary.com/dyqcevdpm/image/upload/v1513248866/flat_price_emailer_lo0ebz.png" alt="text" style="width: 100%;/* padding-bottom: 6%; */"></a></th></tr><tr data-brackets-id="1204" style="padding:0;text-align:left;vertical-align:top"><th data-brackets-id="1205" style="Margin:0 auto;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;text-align:left;"><a href="http://onelink.to/bf45qf"><img data-brackets-id="1206" src="http://res.cloudinary.com/dyqcevdpm/image/upload/v1513248721/family_wallet_mn61tb.png" alt="text" style="width: 100%;/* padding-bottom: 6%; */"></a></th></tr><tr data-brackets-id="1207" style="padding:0;text-align:left;vertical-align:top"><th data-brackets-id="1208" style="Margin:0 auto;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;text-align:left;"><a href="http://onelink.to/bf45qf"><img data-brackets-id="1209" src="http://res.cloudinary.com/dyqcevdpm/image/upload/v1513248719/customise_package_fukzqp.png" alt="text" style="width: 100%;/* padding-bottom: 6%; */"></a></th></tr></tbody></table><table data-brackets-id="1210" style="border-collapse:collapse;border-spacing:0;display:table;padding:0;position:relative;text-align:left;vertical-align:top;width:100%"><tbody data-brackets-id="1211"><tr data-brackets-id="1212" style="padding:0;text-align:left;vertical-align:top"><th data-brackets-id="1213" style="Margin:0 auto;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;padding-bottom:16px;padding-left:16px;padding-right:16px;text-align:left;width:564px"><table data-brackets-id="1214" style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%"><tbody data-brackets-id="1215"><tr data-brackets-id="1216" style="padding:0;text-align:left;vertical-align:top"><td data-brackets-id="1217" height="32px" style="Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:32px;font-weight:400;line-height:32px;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word"></td></tr><tr data-brackets-id="1218" style="padding:0;text-align:left;vertical-align:top"><th data-brackets-id="1219" style="Margin:0;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left"><table data-brackets-id="1220" class="callout" style="Margin-bottom:16px;border-collapse:collapse;border-spacing:0;margin:auto;margin-bottom:16px;padding:0;text-align:left;vertical-align:top;width:30%!important"><tbody data-brackets-id="1221"><tr data-brackets-id="1222" style="padding:0;text-align:left;vertical-align:top"><th data-brackets-id="1223" style="Margin:0 auto;color:#0a0a0a;float:none;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;text-align:left" class="menu-item float-center">' +
        '<a data-brackets-id="1224" href="https://www.facebook.com/BeUSalons/" style="Margin:0;color:#2199e8;font-family:Helvetica,Arial,sans-serif;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left;text-decoration:none"><img data-brackets-id="1225" src="http://res.cloudinary.com/dyqcevdpm/image/upload/v1291284496/social__ICON_2_dsofvy.png" alt="facebook" width="30" height="30" style="-ms-interpolation-mode:bicubic;border:none;clear:both;display:block;max-width:100%;outline:0;text-decoration:none;width:auto"></a></th><th data-brackets-id="1226" style="Margin:0 auto;color:#0a0a0a;float:none;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;text-align:left" class="menu-item float-center"><a data-brackets-id="1227" href="https://plus.google.com/100683126750126363146" style="Margin:0;color:#2199e8;font-family:Helvetica,Arial,sans-serif;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left;text-decoration:none"><img data-brackets-id="1228" src="http://res.cloudinary.com/dyqcevdpm/image/upload/v1291284496/social__ICON_3_qdqnsk.png" alt="facebook" width="30" height="30" style="-ms-interpolation-mode:bicubic;border:none;clear:both;display:block;max-width:100%;outline:0;text-decoration:none;width:auto"></a></th><th data-brackets-id="1229" style="Margin:0 auto;color:#0a0a0a;float:none;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;text-align:left" class="menu-item float-center"><a data-brackets-id="1230" href="https://www.instagram.com/beusalons/" style="Margin:0;color:#2199e8;font-family:Helvetica,Arial,sans-serif;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left;text-decoration:none"><img data-brackets-id="1231" src="http://res.cloudinary.com/dyqcevdpm/image/upload/v1291284496/social__ICON_4_twk3mc.png" alt="facebook" width="30" height="30" style="-ms-interpolation-mode:bicubic;border:none;clear:both;display:block;max-width:100%;outline:0;text-decoration:none;width:auto"></a></th></tr></tbody></table></th><th data-brackets-id="1232" style="Margin:0;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0!important;text-align:left;width:0"></th></tr><tr data-brackets-id="1233" style="padding:0;text-align:left;vertical-align:top"><th data-brackets-id="1234" style="Margin:0;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left"><table data-brackets-id="1235" style="Margin-bottom:16px;border-collapse:collapse;border-spacing:0;margin-bottom:16px;padding:0;text-align:left;vertical-align:top;width:100%!important"><tbody data-brackets-id="1236"><tr data-brackets-id="1237" style="padding:0;text-align:left;vertical-align:top"><td data-brackets-id="1238" style="Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word"><p data-brackets-id="1239" style="Margin:0;Margin-bottom:10px;color:#58595b!important;font-family:"Open Sans",sans-serif;font-size:.8em!important;font-weight:400;line-height:1.3;margin:0;margin-bottom:10px;padding:0;text-align:left;word-wrap:normal"></p></td></tr></tbody>' +
        '</table></th><th data-brackets-id="1240" style="Margin:0;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0!important;text-align:left;width:0"></th></tr></tbody></table></th></tr></tbody></table></td></tr></tbody></table></center></td></tr></tbody></table></div></body></html>'
    MarketingUser.find({ emailId: { $ne: null } }, function(err, marketingUsers) {
        async.each(marketingUsers, function(mUser, callback) {
            if (mUser.marketingCategories[0].lastAppointmentDate != null) {
                var five = fiveMonths.getTime();
                var lastAppointmentTime = mUser.marketingCategories[0].lastAppointmentDate.getTime();
                if (lastAppointmentTime < five) {
                    sendElasticMail(mUser.emailId, html, "Long time, No Hair Service !! Check out latest HAIR DEALS");

                    mUser.marketingCategories[0].lastDate.mail = today;

                    MarketingUser.update({ _id: mUser._id }, { marketingCategories: mUser.marketingCategories }, function(err, update) {
                        console.log(update)
                        d.push(update)
                        callback();
                    })

                }
            } else {
                sendElasticMail(mUser.emailId, html, "4 Hair Deals to try in 2018!");

                mUser.marketingCategories[0].lastDate.mail = today;

                MarketingUser.update({ _id: mUser._id }, { marketingCategories: mUser.marketingCategories }, function(err, update) {
                    console.log(update)

                    d.push(update)
                    callback();
                })
            }
        }, function allTaskCompleted() {
            res.json(d.length)
        })
    })
})


router.get('/categoryIdAdmin', function(req, res) {
    var d = [];
    Admin.find({ active: true, parlorId: { $ne: null } }, { parlorId: 1 }, function(err, users) {
        async.each(users, function(u, cb) {
            Parlor.aggregate({ $match: { "_id": ObjectId(u.parlorId) } }, { $unwind: "$services" }, { $unwind: "$services.prices" }, { $unwind: "$services.prices.employees" }, { $match: { "services.prices.employees.userId": u._id } }, { $group: { "_id": "$services.categoryId" } }, { $project: { "categoryId": "$_id", "_id": 0 } }, { $group: { _id: null, categoryIds: { $push: "$categoryId" } } }, { $project: { _id: 0 } }, function(err, agg) {

                if (agg && agg[0].categoryIds.length > 0) {
                    console.log(agg[0].categoryIds.length)
                    Admin.update({ _id: u._id }, { categoryIds: agg[0].categoryIds }, function(err, update) {
                        console.log(err)
                        console.log(update)
                        d.push(update)
                        cb();
                    })
                } else {
                    cb();
                }
            })
        }, function allTaskCompleted() {
            res.json(d.length)
        })
    })
});

router.get('/razorpayPaymentLink', function(req, res) {
    var request = require('request');
    
    var Razorpay = require('razorpay');
    var instance = new Razorpay({
        key_id: RAZORPAY_KEY,
        key_secret: RAZORPAY_APP_SECRET
    })


    var reqObj = {
        "customer": {
            "name": "Be U Salons",
            "contact": "9695748822"
        },
        "type": "link",
        "amount": 1500,
        "currency": "INR",
        "description": "Pay Using Be U",
        // "sms_notify" : 0,
        "email_notify": 0
    };
    request({
        url: "https://api.razorpay.com/v1/invoices/", //URL to hit
        method: 'POST',
        headers :{
            'Content-Type':'application/json',
        },
        'auth': {
            'user': RAZORPAY_KEY,
            'pass' : RAZORPAY_APP_SECRET
          },
        body : JSON.stringify(reqObj)
    }, function(error, response, body) {
        console.log(response)
        console.log(response.id)
        var invoiceId = response.id;
        var paymentUrl = response.short_url;
        res.json('done')
        // sendSMSValueFirst(reqObj.customer.contact, paymentUrl)
    });
});


function sendSMSValueFirst(phoneNumber, url) {
    var userMessage = "Hi This is my customised URL ₹ 50" + url + ""
        // var url = "http://www.myvaluefirst.com/smpp/sendsms?username=%20shailendrabeu&password=%20shailn567&to=" + phoneNumber + "&from=BEUSLN&text=" + userMessage + "";
    var url = "https://control.msg91.com/api/sendotp.php?authkey=164034A93iTmJcMu595dd01d&mobile=91" + phoneNumber + "&message=" + message + "&sender=BEUSLN";
    console.log("url", url)
    request(url, function(error, response, body) {
        if (error == null) {
            return res.json(CreateObjService.response(false, 'Otp has been sent to your number'));
        } else {
            return res.json(CreateObjService.response(true, 'Error in sending sms'));
        }
    });
};


router.post('/fetchAndCapturePaymentLinks', function(req, res) {

    var instance = new Razorpay({
        key_id: RAZORPAY_KEY,
        key_secret: RAZORPAY_APP_SECRET
    })

    instance.invoices.all({}, function(error, response) {
        console.log(response.items[0].status)
        async.each(response.items, function(item, callback) {
            if (item != paid) {}
        }, function allTaskCompleted() {

        })
    });

})
//1652
router.post('/checkCouponCode', function(req, res) {

    AppointmentHelperService.getSubscriptionAmountByReferalCode(req.body.amount, req.body.couponCode, function(amt){
        console.log("server console",amt)
        if((amt!= 1699 && amt != 899) || req.body.couponCode == "PAYTM"){
            return res.json(CreateObjService.response(false, {amount : amt}));
        }else{
            if(req.body.couponCode == "toi" || req.body.couponCode == "TOI"){
                return res.json(CreateObjService.response(false, {amount : amt}));
            }else if(req.body.couponCode == "JBFKPS" || req.body.couponCode == "GHNLVL"|| req.body.couponCode == "BCCL"){
                if(req.body.couponCode == "JBFKPS"){
                    amt = ConstantService.getEarlyBirdOfferGlodSubscriptionPrice(1);
                }else if(req.body.couponCode == "BCCL"){
                    amt = ConstantService.getEarlyBirdOfferGlodSubscriptionPrice(2);
                }else if(req.body.couponCode == "GHNLVL"){
                    amt = ConstantService.getEarlyBirdOfferGlodSubscriptionPrice(2);
                }
                return res.json(CreateObjService.response(false, {amount : amt}));
            }else{
                return res.json(CreateObjService.response(true, {amount : amt}));
            }
        }
    });
});


router.post('/captureSubscriptionPayment', function(req, res) {
    Appointment.captureSubscriptionPayment(req.body.paymentId, req.body.amount, function(error, re) {
        console.log(req.body)
        if (!error && re.status == "captured") {
            var source = req.body.source ? req.body.source : 'default';
            console.log("re.amount", re.amount)
            console.log("source", source)
            var amount = parseInt(re.amount / 100) >= 1000 ? 1699 : 899;
            var msgAmount = (amount >= 1000) ? 500 : 200;
            var type = (amount >= 1000) ? "Gold" : "Silver";
            var message = "Thank you for purchasing Be U Salons " + type + " Subscription. Avail services worth Rs " + msgAmount + "/month free for 1 year. Refer your friends and earn Rs 200 on each referral."
            var phoneNumber = HelperService.parsePhoneNumber(re.contact);
            console.log("phoneNumber", phoneNumber)
            var data1 = { type: "loginBased", title: "Add Free Months to Your Subscription", body: "Refer it to your friend, every time they use your referral code while subscribing, you both get 1 Month Free Extension. Start Referring Now!" }
            User.findOne({ phoneNumber: phoneNumber }, { firstName: 1, accesstoken: 1, phoneNumber: 1, gender: 1, firebaseId: 1, firebaseIdIOS: 1 }, function(err, user) {

                if (user) {

                    Appointment.addSubscriptionToUser(null, user.id, user.createdAt, re, amount, req.body.couponCode, source, function(response) {
                        response.userId = user.id;
                        response.accessToken = user.accesstoken;

                        res.json(response);
                    });
                } else {
                    console.log("no user")
                    User.create({ phoneNumber: phoneNumber, emailId: re.email, firstName: "subscribedUser" }, function(err2, userCreated) {

                        User.findOne({ phoneNumber: phoneNumber }, {createdAt:1, firstName: 1, accesstoken: 1, phoneNumber: 1, gender: 1, firebaseId: 1, firebaseIdIOS: 1 }, function(err, newUser) {
                            Appointment.addSubscriptionToUser(null, newUser.id, newUser.createdAt, re, amount, req.body.couponCode, source, function(response) {
                                response.userId = newUser.id;
                                response.accessToken = newUser.accesstoken;

                                res.json(response);
                            });
                        })
                    })
                }
            });
        } else {
            console.log("else")
            return res.json(CreateObjService.response(true, 'Not Captured'));
        }
    });
})

router.post('/showSubscription1', function(req, res) {
    var data = ConstantService.getSubscriptionCard("F");
    return res.json(CreateObjService.response(false, data));
});


router.get('/showSubscription', function(req, res) {
    User.findOne({ _id: req.query.userId }, { latitude: 1, longitude: 1, gender: 1 }, function(err, user) {
        var data = ConstantService.getSubscriptionCard(user ? user.gender : "F");
        return res.json(CreateObjService.response(false, data));
    })
});

router.get('/sendsms', function(req, res) {
    var amount = 899;
    var msgAmount = (amount == 1699) ? 500 : 200;
    var type = (amount == 1699) ? "Gold" : "Silver";
    var message = "Be U Salons' Subscription @Rs 1699 and enjoy free services of Rs 500/ month for 1 year. Buy at - https://goo.gl/sFBTt6 or call to know more- 9582242000"
    Appointment.msg91Sms(9811413528, message, function(e) {
        console.log(e)
    })
})

router.post('/initPaytmPayment', function(req, res, next) {
    User.findOne({ phoneNumber: req.body.phoneNumber }, function(err, user) {
        if (user) {
            var params = getPaytmParams(user, req.body.amount);
            var obj = {
                userId: user.id,
                phoneNumber: user.phoneNumber,
                orderId: params.ORDER_ID,
                status: 0,
                amount: req.body.amount,
                couponCode : req.body.couponCode,
                createdAt: new Date(),
            };
            PaytmPayment.create(obj, function(err, f) {
                console.log(obj);
                console.log(err);
                PaytmService.genchecksum(params, PAYTM_MERCHANT_KEY, function(err, newParams) {
                    return res.json(CreateObjService.response(false, newParams));
                });
            });
        } else {
            return res.json(CreateObjService.response(true, 'Invalid User id'));
        }
    });
});




function getPaytmTransactionStatusUrl(orderId, checksum) {
    var param = {};
    var request = "";
    param.MID = PAYTM_MERCHANT_MID;
    param.ORDERID = orderId;
    param.CHECKSUMHASH = encodeURI(checksum);
    return "https://secure.paytm.in/oltp/HANDLER_INTERNAL/getTxnStatus?JsonData=" + JSON.stringify(param);
}

function getPaytmParams(user, amount) {
    var orderId = user.phoneNumber + new Date().getTime();
    return {
        REQUEST_TYPE: "DEFAULT",
        MOBILE_NO: user.phoneNumber,
        EMAIL: 'info@beusalons.com',
        CALLBACK_URL: 'http://www.beusalons.com/api/capturePaytmPayment?ORDER_ID=' + orderId,
        MID: PAYTM_MERCHANT_MID,
        ORDER_ID: orderId,
        CUST_ID: user.id,
        INDUSTRY_TYPE_ID: PAYTM_INDUSTRY_TYPE,
        CHANNEL_ID: "WEB",
        TXN_AMOUNT: parseInt(amount),
        WEBSITE: 'GinSwaWEB'
    };

}


router.get('/updateuser', function(req, res) {
    User.find({}, { _id: 1 }).limit(4000).exec(function(err, users) {
        _.forEach(users, function(user) {
            User.update({ _id: user.id }, { sendSubscriptionSms: true }, function(err, updates) {
                res.json("done")
            })
        })
    })
});


router.post('/showSubscriptionForWebsite', function(req, res) {
    console.log(req.body)
    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var subscribedData = { name: "", subscriptionType: "", validFrom: 0, validTill: 0, annualBalance: 0, monthlyBalance: 0, currentMonth: "", profilePic: "" };
    User.findOne({ _id: req.body.userId }, { referCode: 1, profilePic: 1, latitude: 1, longitude: 1, gender: 1, firstName: 1, lastName: 1, subscriptionId: 1, subscriptionOtp: 1, subscriptionLoyality: 1, subscriptionRedeemMonth: 1 }, function(err, user) {
        if (user) {
            var obj = ConstantService.getSubscriptionCard(user ? user.gender : "F");
            if (user.subscriptionId) {
                SubscriptionSale.findOne({ userId: req.body.userId }, function(err2, subscription) {
                    var valid = new Date(subscription.createdAt);
                    valid.setMonth(valid.getMonth() + 11);
                    var validTill = valid.getMonth(),
                        validTillYear = valid.getFullYear(),
                        validFrom = monthNames[subscription.createdAt.getMonth()];
                    var validFromYear = subscription.createdAt.getFullYear(),
                        currentDate = new Date(),
                        currentMonth = currentDate.getMonth();
                    var monthlyBalance = 0;
                    var subPrice = (user.gender == "F") ? 1699 : 899;
                    var subAmount = (user.gender == "F") ? 500 : 200;
                    if (user.subscriptionId) {
                        if (currentMonth == user.subscriptionRedeemMonth.month) monthlyBalance = user.subscriptionRedeemMonth.amount;
                        else monthlyBalance = user.subscriptionLoyality
                    }
                    subscribedData.name = user.firstName + " " + user.lastName;
                    subscribedData.subscriptionType = (user.subscriptionId == 1) ? "Gold" : "Silver";
                    subscribedData.validFrom = validFrom + " " + validFromYear;
                    subscribedData.validTill = monthNames[validTill] + " " + validTillYear;
                    subscribedData.annualBalance = (user.subscriptionId == 1) ? 6000 : 2400;
                    subscribedData.monthlyBalance = monthlyBalance;
                    subscribedData.currentMonth = monthNames[currentMonth];
                    subscribedData.profilePic = user.profilePic;
                    subscribedData.referCode = user.referCode;
                    subscribedData.referMessage = "Use my code @@ to get your Be U Salon's Subscription (Pay@" + subPrice + " and enjoy free services of ₹ " + subAmount + " per month for 1 year) and earn Rs 200 on each referral.";

                    obj.selectSubscription.isSubscribed = true;
                    obj.selectSubscription.subscribedData = subscribedData;

                    return res.json(CreateObjService.response(false, obj));
                })
            } else {
                return res.json(CreateObjService.response(false, obj));
            }
        } else {
            return res.json(CreateObjService.response(true, "User does not exist."));
        }
    })
})


router.get('/reviewssss', function(req, res) {
    Appointment.find({ "buySubscriptionId": { $in: [1, 2] }, status: { $ne: 3 } }, { "client.phoneNumber": 1, "client.name": 1, "client.id": 1 }).exec(function(err, agg) {
        console.log(agg.length, "length")


        var d = [];

        _.forEach(agg, function(a) {
            var obj = {};
            obj.name = a.client.name,
                obj.number = a.client.phoneNumber,
                obj.userId = a.client.id,

                d.push(obj)
        })
        res.json(d)
    })
});


router.get('/sendSubscriptionSms', function(req, res) {
    var counter = 0;
    var sendSubscribeSMS = function(skipLim, totalRounds) {
        var skipLim = skipLim;
        var d = [];
        MarketingUser.find({lastAppointmentDate: {$gte : new Date(2017,10,1) , $lte : new Date(2018, 3,30)} , subscriptionId : 0}, {phoneNumber:1}).skip(300 * (skipLim - 1)).limit(300).exec(function(err, users) {
            // User.find({phoneNumber : "8010178215"}).exec(function(err, users) {
            console.log(users.length)
            async.each(users, function(user, callback) {

                var message = "Save 200 on Be U Subscription(pay 1699 and enjoy free services worth 500/month, for 1 full year) purchase by using referral  BEUREF Chat https://bit.ly/2Lp3JHi"
                var url = "http://api.msg91.com/api/sendhttp.php?sender=BEUSLN&route=4&mobiles=" +user.phoneNumber+ "&authkey=164034A93iTmJcMu595dd01d&country=91&message=" + message + "";
                request(url, function(error, response, body) {
                    console.log(error)
                    if (error == null) {
                        counter++
                        console.log(counter)
                        callback();
                    } else {
                        callback();
                    }
                });
                // }
            }, function allTaskCompleted() {

                skipLim++;
                if (skipLim <= totalRounds) {
                    sendSubscribeSMS(skipLim, totalRounds);
                } else {
                    console.log("All done");
                    res.json("done")
                }

            })
        })
    }

    MarketingUser.find({}).count(function(err, count) {
        var totalUsers = count;
        var totalRounds = Math.round(totalUsers / 300);
        sendSubscribeSMS(1, totalRounds);
    })
});



router.get('/countUser', function(req, res) {
    var d = [];
    for (var i = 0; i < 251; i++) {
        //     var skip = 200*i
        // Appointment.aggregate([{$match :{status:3 , paymentMethod:{$in:[5,10]} ,buySubscriptionId :{$eq:null}}},
        //     {$project :{clientId :"$client.id", phoneNumber :"$client.phoneNumber"}},
        //     {$group:{_id:"$clientId" , clientId : {$first:"$clientId"} , phoneNumber :{$first:"$phoneNumber"}}},{$skip : skip },{$limit :200}
        //     ],function(err,agg){
        // MarketingUser.find({lastAppointmentDate :{$gte: new Date(2017,10,10) , $lte: new Date(2018,0,10)}},{phoneNumber :1}).skip(skip).limit(200).exec(function(err,agg){
        // MarketingUser.aggregate([
        //                         {$match:{lastAppointmentDate:{$gt:new Date(2017,8,1)}}},
        //                         {$project:{userId:1, phoneNumber :1}},
        //                         {$lookup : {from:"users" , localField:"userId" , foreignField:"_id" , as:"user"}},
        //                         {$match:{'user.subscriptionId' : {$exists:false}}},
        //                         {$project:{phoneNumber : "$phoneNumber"}}]).exec(function(err,agg){
        // User.find({$and:[{firebaseId:{$eq:null}} , {firebaseIdIOS:{$eq:null}}], gender :"F"},{phoneNumber:1}).skip(200*i).limit(200).exec(function(err,agg) {
        User.find({ subscriptionId: { $exists: false } }, { phoneNumber: 1 }).skip(200 * i).limit(200).exec(function(err, agg) {
            // Appointment.aggregate([{$match :{status:3,'services.discountMedium' :"frequency"}},{$skip :(i*200) },{$limit :200},{$project : {clientId : '$client.id' , phoneNumber :'$client.phoneNumber' }},{$group:{_id:"$clientId" , phoneNumber :{$first:"$phoneNumber"}}}],function(err,agg){
            var evenArray = [],
                oddArray = [];
            for (var i = 0; i < agg.length; i++) {
                if ((i % 2) == 0) {
                    evenArray.push(agg[i].phoneNumber);
                } else {
                    oddArray.push(agg[i].phoneNumber);
                }
            }
            // var message1 ="Be U Salon's Subscription, Just Pay@1699 and enjoy free services of Rs 500 per month for 1 year. Buy at https://goo.gl/v4eero or call to know more 8690254275.";
            var message1 = "Be U Salon Subscription, Pay@1699 and enjoy free services of Rs500/month for 1 year. Buy @ https://goo.gl/6Jfonn or ask query on whatsapp https://goo.gl/q2vFa7";
            // var message2 ="Be U Salon's Subscription, Just Pay@1699 and enjoy free services of Rs 500 per month for 1 year. Buy at https://goo.gl/VJHqCP or call to know more 8690291910";
            console.log(agg.length)
            async.parallel([
                function(done) {

                    async.each([1, 2], function(p, callback) {
                        if (p == 1) {
                            console.log("P111111111111", evenArray.length)
                            var url = "http://api.msg91.com/api/sendhttp.php?sender=BEUSLN&route=4&mobiles=" + evenArray + "&authkey=164034A93iTmJcMu595dd01d&country=91&message=" + message1 + "";
                            request.post(url, function(error, response, body) {
                                console.log(error)
                                d.push(error)
                                callback();
                            });
                            // ParlorService.getSMSUrl('BEUSLN', message1, ["8010178215"], 'T')
                            // callback();
                        }

                        if (p == 2) {
                            console.log("P222222222222", oddArray.length)
                            var url = "http://api.msg91.com/api/sendhttp.php?sender=BEUSLN&route=4&mobiles=" + oddArray + "&authkey=164034A93iTmJcMu595dd01d&country=91&message=" + message1 + "";
                            request.post(url, function(error, response, body) {
                                d.push(p)
                                callback();
                            });
                        } else {
                            callback();
                        }
                    }, done);
                }
            ], function allTaskCompleted() {
                console.log('done');
                return res.json(d.length);
            });

        })
    }
});


router.get('/getDepartmentAndServiceWebsite', function(req, res) {
    Service.aggregate([{ $project: { categoryId: 1, name: 1, serviceCode: 1, serviceDesc: "$description" } },
        { $lookup: { from: "servicecategories", localField: "categoryId", foreignField: "_id", as: "category" } },
        { $unwind: "$category" },
        {
            $group: {
                _id: "$category._id",
                catName: { $first: "$category.name" },
                superCategory: { $first: "$category.superCategory" },
                catMaleImage: { $first: "$category.maleImage" },
                catFemaleImage: { $first: "$category.femaleImage" },
                services: { $push: { serviceName: "$name", serviceCode: "$serviceCode", serviceDesc: "$serviceDesc" } }
            }
        },
        { $lookup: { from: "supercategories", localField: "superCategory", foreignField: "name", as: "dept" } },
        { $unwind: "$dept" },
        {
            $group: {
                _id: "$dept._id",
                deptFimg: { $first: "$dept.femaleImage" },
                deptMimg: { $first: "$dept.maleImage" },
                deptName: { $first: "$dept.name" },
                category: { $push: { catName: "$catName", catMaleImage: "$catMaleImage", catFemaleImage: "$catFemaleImage", services: "$services" } }
            }
        }
    ], function(err, agg) {
        if (agg) {
            return res.json(CreateObjService.response(false, agg));
        } else {
            return res.json(CreateObjService.response(true, "Error"));
        }
    })
});

router.get('/subscriptionDuplicate', function(req, res) {
    SubscriptionSale.aggregate([{ $project: { userId: 1, createdAt: 1, price: 1, razorPayId: 1 } },
        { $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "user" } },
        { $unwind: "$user" },
        {
            $group: {
                _id: "$userId",
                price: { $push: { createdAt: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, price: "$price", razorPayId: "$razorPayId" } },
                userName: { $first: "$user.firstName" },
                phoneNumber: { $first: "$user.phoneNumber" }
            }
        },
        { $match: { price: { $size: 2 } } }
    ], function(err, agg) {
        res.json(agg)
    })

});


router.post('/authorizedWebhook', function(req, res) {
    console.log(req.body.payload.payment)
    var status = 200;
    var obj = { razorPaymentId: req.body.payload.payment.entity.id, amount: req.body.payload.payment.entity.amount, appointmentId: req.body.payload.payment.entity.notes.appointmentId }

    Appointment.findOne({ _id: obj.appointmentId }, { razorPayCaptureResponse: 1 }, function(err, appt) {
        if (appt) {
            if (!appt.razorPayCaptureResponse) {
                AuthorizedPayment.create(obj, function(err, authCreated) {
                    if (!err) {
                        console.log("created")
                        res.json({ status: status, message: "authorized payment created" })
                    } else {

                        res.json({ status: status, message: "error found" })
                    }
                })
            } else {
                console.log("captured")
                res.json({ status: status, message: "already captured" })
            }
        } else {
            res.json({ status: status, message: "appointment id not found" })
        }
    })

});


router.get('/test12', function(req, res) {
    LuckyDrawDynamic.aggregate([
        { $match: { categoryId: "13", parlorId: { $ne: ObjectId("594a359d9856d3158171ea4f") } } },
        { $group: { _id: "$appointmentId", count: { $sum: 1 } } },
        { $lookup: { from: "appointments", localField: "_id", foreignField: "_id", as: "appt" } },
        { $match: { "appt.appointmentStartTime": { $gt: new Date(2018, 1, 14), $lt: new Date(2018, 1, 15, 23, 59, 59) } } }
    ], function(err, data) {

        res.json(data.length)

    })
})


router.get('/getImagesOfUpdate', function(req, res) {
    var newObj = ConstantService.getUpdateImagesBottomSheet();

    res.json(CreateObjService.response(false, newObj.data))
})

router.get('/getSalonFilter', function(req, res) {
    var obj = {
        categories: [{
                parlorType: 0,

                text: "L'Oreal, Forest Essential, Lotus, O3+ "
            },
            {
                parlorType: 1,

                text: "L'Oreal, Matrix, Sara Lemon, Lotus, O3+ ,Cheryl's"
            },
            {
                parlorType: 2,

                text: "L'Oreal, Matrix, Sara Lemon, Lotus, O3+ , Nature's"
            }
        ],

        brands: [
            ["L'Oreal", "Matrix"],
            ['Forest Essential', 'Lotus', "O3", "Cheryl's"],
            ["Lotus", 'Forest Essential', 'O3']
        ]
    }
    res.json(CreateObjService.response(false, obj))
});


router.post('/getUserCart', function(req, res) {

    UserCart.findOne({ userId: req.body.userId }, { services: 1, lastServiceAddTime: 1 }, function(err, data) {

        res.json(CreateObjService.response(false, data))

    })

})


router.post('/addFreeService', function(req, res) {

    var newDealObj =
        Appointment.findOne({ _id: req.body.appointmentId }, { services: 1, parlorId: 1 }, function(err, appt) {

        })
});


router.post('/onAppClose', function(req, res) {
    console.log('started')
    var today = new Date();

    UserCart.findOne({ userId: req.body.userId }, function(err, cart) {
        console.log("cart", cart);
        if (cart != null) {
            console.log(cart.lastNotificationDate)
            var notificationDate = new Date(cart.lastNotificationDate)
            var cartDate = new Date(cart.lastServiceAddTime)
            User.findOne({ _id: req.body.userId }, { firebaseId: 1, firebaseIdIOS: 1, firstName: 1 }, function(err, user) {
                var serviceCodes = _.map(cart.services, function(ser) { return ser.code });

                Service.aggregate([{ $match: { serviceCode: { $in: serviceCodes } } }, { $lookup: { from: 'servicecategories', localField: 'categoryId', foreignField: '_id', as: "category" } },
                    { $project: { category: { $arrayElemAt: ["$category.superCategory", 0] } } }, { $group: { _id: null, name: { $push: "$category" } } }
                ], function(err, agg) {

                    var services = agg[0].name[0].toString();
                    var serv = (agg[0].name.length > 1) ? "& other services" : "service"
                    var message = "You can't afford to miss our " + services + " " + serv + " lying in your cart. What are you waiting for? Check it now & complete your appointment with us."

                    if (!cart.lastNotificationDate || notificationDate <= cartDate) {

                        var data1 = { type: 'cartBased', title: 'Your cart is feeling abandoned!', body: message, sImage: '', lImage: '' }
                        var minutes = 1,
                            the_interval = minutes * 60 * 1000;

                        setTimeout(function() {

                            console.log("I am doing my 5 minutes check");
                            if (user.firebaseId) {
                                Appointment.sendAppNotification(user.firebaseId, data1.title, data1.body, data1, '', function(err, response) {
                                    UserCart.update({ userId: req.body.userId }, { lastNotificationDate: new Date() }, function(err, update) {
                                        if (update)
                                            return res.json(CreateObjService.response(false, 'Successfully Sent'));
                                        else
                                            return res.json(CreateObjService.response(true, 'error'));
                                    })
                                })
                            } else if (user.firebaseIdIOS) {
                                Appointment.sendAppNotificationIOS(user.firebaseIdIOS, data1.title, data1.body, '', data1.type, '', function(err, response) {
                                    UserCart.update({ userId: req.body.userId }, { lastNotificationDate: new Date() }, function(err, update) {
                                        if (update)
                                            return res.json(CreateObjService.response(false, 'Successfully Sent'));
                                        else
                                            return res.json(CreateObjService.response(true, 'error'));
                                    })

                                })
                            } else {
                                return res.json(CreateObjService.response(true, 'notification'));
                            }


                        }, the_interval);
                    } else {
                        return res.json(CreateObjService.response(true, 'Notification already sent'));
                    }
                })
            })
        } else {
            return res.json(CreateObjService.response(true, 'No user cart'));
        }
    })
});





router.get("/updateParlorImages", (req, res) => {

    Parlor.find({active: true }, { images: 1 }, (err, parlors) => {

        if (err) {
            console.log("error in fetching parlors");
        } else {
            async.each(parlors, (p, cb) => {

                var imagesToUpdate = [];

                Parlor.findOne({ _id: p._id }, { images: 1 }, (err, parlor) => {
                    if (err) {
                        cb();
                    } else if (parlor) {

                        (parlor.images).forEach(function(i) {
                            var i = i.toJSON();
                            if (i.hasOwnProperty('appImageUrl') && (i.appImageUrl).trim() !== "") {
                                imagesToUpdate.push(i);
                            }
                        })

                        console.log(imagesToUpdate);
                        console.log("-------------");

                        Parlor.update({ _id: p._id }, { $set: { images: imagesToUpdate } }, (err, updated) => {
                            cb();
                        });

                    } else {
                        console.log("do nothing");
                        cb();
                    }

                })

            }, () => {
                res.json('done')
                console.log("All done");
            })
        }

    });

});




router.get('/changeIncentives', function(req, res) {
    var d = [];
    Incentive.aggregate([{ $group: { _id: "$parlorId" } }], function(err, existingIncentive) {

        Parlor.find({ _id: { $nin: existingIncentive } }, { parlorType: 1, name: 1, address2: 1, active: 1 }, function(err, parlors) {
            async.each(parlors, function(parlor, callback) {
                IncentiveCopy.find({}, { categoryId: 1, name: 1, sort: 1, parlors: 1 }).sort({ sort: 1 }).exec(function(err, oldIncentives) {
                    var obj = { parlorName: "", parlorAddress2: "", parlorType: "", parlorId: "", categories: [] };
                    obj.parlorName = parlor.name,
                        obj.parlorAddress = parlor.address2,
                        obj.parlorType = parlor.parlorType,
                        obj.parlorActive = parlor.active,
                        obj.parlorId = parlor._id,
                        obj.categories = _.map(oldIncentives, function(oI) {
                            var newIncentive = _.filter(oI.parlors, function(inc) { return inc.parlorType == parlor.parlorType })
                            return {
                                categoryId: oI.categoryId,
                                categoryName: oI.name,
                                sort: oI.sort,
                                incentives: newIncentive[0].incentives
                            }
                        });

                    Incentive.create(obj, function(err, incentive) {
                        callback();

                        d.push(obj)
                    })
                })
            }, function allTaskCompleted() {
                res.json(d)
            })
        })
    })
});

router.get("/updateClientServed", function(req, res) {

    console.log("called")

    Admin.find({}, { _id: 1 }, (err, emps) => {

        console.log(emps);

        async.each(emps, (e, cb) => {

            Appointment.find({ status: 3, "employees.employeeId": e._id }).count(function(err, count) {

                console.log(err)

                Admin.update({ "_id": e._id }, { $set: { clientServed: count } }, (err, updated) => {
                    console.log(err);
                    console.log("successfully updated");
                    cb();
                })

            })

        }, () => {
            console.log("All done");
        })

    })

});


router.get("/updateEmployeeRating", function(req, res) {

    Admin.find({}, { _id: 1 }, (err, emps) => {
        async.each(emps, (e, cb) => {

            Appointment.aggregate([
                { $match: { status: 3, "review.rating": { $exists: true }, "review.employees.employeeId": e._id } },
                { $group: { "_id": null, count: { $sum: 1 }, reviewTotal: { $sum: "$review.rating" } } },
                { $project: { avgRating: { $divide: ["$reviewTotal", "$count"] } } }
            ], (err, avgRating) => {
                if (err) {
                    cb();
                } else if (avgRating.length == 0) {

                    console.log("coming here");

                    Admin.update({ "_id": e._id }, { $set: { rating: null } }, (err, updated) => {
                        console.log("successfully updated null");
                        cb();
                    })

                } else {

                    Admin.update({ "_id": e._id }, { $set: { rating: avgRating[0].avgRating } }, (err, updated) => {
                        console.log("successfully updated successfully");
                        cb();
                    })

                }

            })

        }, () => {
            console.log("All done");
        })
    });

});


router.get('/getUserCart', function(req, res) {
    UserCart.aggregate([{ $unwind: "$services" },
        { $project: { createTime: "$lastServiceAddTime", userId: 1, serviceCode: "$services.code" } },
        { $lookup: { from: 'services', localField: "serviceCode", foreignField: 'serviceCode', as: "serviceName" } },
        { $project: { createTime: "$createTime", userId: "$userId", serviceName: { $arrayElemAt: ['$serviceName.name', 0] } } },
        { $group: { _id: "$userId", createTime: { $first: "$createTime" }, services: { $push: "$serviceName" } } },
        { $lookup: { from: 'users', localField: "_id", foreignField: '_id', as: "user" } },
        { $project: { services: "$services", date: { '$dateToString': { format: '%m/%d/%Y', date: '$createTime' } }, userName: { $arrayElemAt: ['$user.firstName', 0] }, phoneNumber: { $arrayElemAt: ['$user.phoneNumber', 0] } } }
    ], function(err, userCart) {
        res.json(userCart)
    })
});


router.get('/settlementDifference', function(req, res) {
    SettlementReport.aggregate([{ $match: { createdAt: { $gte: new Date(2018, 2, 14) } } },
        {
            $project: {
                parlorName: 1,
                period: 1,
                createdAt: 1,
                totalCollectionByBeu: 1,
                startDate: 1,
                endDate: 1,
                collectedByMembershipCredits: 1,
                actualSum: { $add: ["$collectedByLoyalityPoints", "$collectedByApp", "$collectedByAffiliates"] }
            }
        },
        {
            $project: {
                collectedByMembershipCredits: "$collectedByMembershipCredits",
                startDate: "$startDate",
                endDate: "$endDate",
                parlorName: "$parlorName",
                period: "$period",
                createdAt: "$createdAt",
                totalCollectionByBeu: "$totalCollectionByBeu",
                actualSum: "$actualSum",
                difference: { $subtract: ["$totalCollectionByBeu", "$actualSum"] }
            }
        },
        { $match: { $or: [{ difference: { $gt: 10 } }, { difference: { $lt: -10 } }] } },
        { $project: { startDate: "$startDate", endDate: "$endDate", parlorName: "$parlorName", period: "$period", createdAt: "$createdAt", totalCollectionByBeu: "$totalCollectionByBeu", actualSum: "$actualSum", difference: "$difference" } }
    ], function(err, agg) {
        res.json(agg)
    })
});


router.get('/noSubscriptionPastUsers', function(req, res) {
    Appointment.aggregate([{ $match: { status: 3, paymentMethod: { $ne: [10, 5] } } },
        { $group: { _id: '$client.id', clientId: { $first: "$client.id" }, count: { $sum: 1 }, lastApptDate: { $last: "$appointmentStartTime" }, appointmentDate: { $push: '$appointmentStartTime' } } },
        { $lookup: { from: "users", localField: "clientId", foreignField: '_id', as: 'user' } },
        {
            $project: {
                lastApptDate: "$lastApptDate",
                clientId: "$clientId",
                name: { $arrayElemAt: ['$user.firstName', 0] },
                phoneNumber: { $arrayElemAt: ['$user.phoneNumber', 0] },
                appointmentDate: "$appointmentDate",
                count: "$count",
                userSubscription: { $arrayElemAt: ['$user.subscriptionId', 0] }
            }
        },
        { $match: { count: { $gte: 3 }, userSubscription: { $exists: false }, appointmentDate: { $gte: new Date(2018, 0, 1) } } },
        { $group: { _id: null, count: { $sum: 1 }, client: { $push: { clientName: '$name', phoneNumber: '$phoneNumber', lastApptDate: { '$dateToString': { format: '%m/%d/%Y', date: '$lastApptDate' } } } } } }
    ], function(err, agg) {
        res.json(agg)
    });
});
router.get('/forceSubscriptionDraw', function(req, res) {
    LuckyDrawDynamic.onSubscription(ObjectId("5b4f2e8830f3a41e41b44f3c"),1 )
});




router.get('/expiryDateCoupon', function(req, res) {
    var d = [];
    for (var i = 0; i < 5; i++) {
        User.find({ createdAt: { $gt: new Date(2018, 2, 1) } }, { couponCodeHistory: 1 }).skip(1000 * i).limit(1000).exec(function(err, users) {
            // User.find({phoneNumber :"8826345311"},{couponCodeHistory :1} , function(err, users) {
            async.each(users, function(u, callback) {

                _.forEach(u.couponCodeHistory, function(code) {
                    var now_date = code.createdAt;
                    now_date.setMonth(now_date.getMonth() + 1);

                    code.expires_at = now_date;
                })
                User.update({ _id: u._id }, { couponCodeHistory: u.couponCodeHistory }, function(err, update) {
                    d.push(u)
                    callback();
                })
            }, function allTaskCompleted() {
                res.json(d.length)
                console.log(d.length)
            })

        })
    }
});


router.post("/subscriptionDate", (req, res) => {
    SubscriptionSale.find({}, { _id: 0, userId: 1, createdAt: 1 }, (err, users) => {
        if (err) {

        } else {

            async.each(users, (u, cb) => {
                User.update({ _id: u.userId }, { $set: { subscriptionBuyDate: u.createdAt } }, (err, updated) => {

                    if (err) {
                        console.log(err);
                    }

                    cb();
                })
            }, () => {
                console.log("All done");
                res.json("All done");
            })

        }
    })
})


router.post("/updateFreebieExpiry", (req, res) => {

    console.log("called");

    Appointment.aggregate([
        { $match: { status: 3 } },
        { $sort: { "appointmentStartTime": 1 } },
        { $group: { "_id": "$client.id", lastAppointmentDate: { $last: "$appointmentStartTime" } } }
    ], (err, users) => {

        async.each(users, (u, cb) => {

            console.log(u);

            var lastAppointmentDate = new Date(u.lastAppointmentDate);

            var d = lastAppointmentDate.setDate(lastAppointmentDate.getDate() + 60);

            var compareDate = new Date(2018, 3, 15);

            if (d > compareDate) {
                User.update({ _id: u._id }, { $set: { freebieExpiry: d } }, (err, updated) => {
                    console.log("coming here");
                    cb();
                })

            } else {

                User.update({ _id: u._id }, { $set: { freebieExpiry: compareDate } }, (err, updated) => {
                    console.log("coming there");
                    cb();
                })

            }

        }, () => {
            console.log("All done");
            res.json("All done");
        });

    })
});

router.post("/updateExpiryDownload", (req, res) => {

    console.log("called");

    var upto = [];

    for (var i = 0; i < 44; i++) {
        upto.push(i);
    }

    var counter = 0;

    async.each(upto, (up, cb) => {



        User.aggregate([
            { $match: { "freeServices.0": { $exists: true } } },
            { $skip: (up * 1000) },
            { $limit: 1000 },
            { $project: { _id: 1, freeServices: 1 } }
        ], (err, users) => {


            console.log(users.length, up);

            async.each(users, (u, cb2) => {


                u.freeServices.forEach(function(f) {
                    if (f.source == 'download') {
                        var createdAt = new Date(f.createdAt);
                        f.expires_at = new Date(createdAt.setDate(createdAt.getDate() + 30));
                    }
                });

                User.update({ _id: u._id }, { $set: { freeServices: u.freeServices } }, (err, updated) => {
                    counter++;
                    console.log(counter);
                    cb2();
                })


            }, () => {
                cb();
            });


        })


    }, () => {
        console.log("ALL DONE");
    })

})


router.post("/updateRemainingFreebieExpiry", (req, res) => {

    console.log("called.....");

    Appointment.aggregate([
        { $match: { status: 3 } },
        { $sort: { "appointmentStartTime": 1 } },
        { $group: { "_id": "$client.id" } }
    ], (err, users) => {
        console.log(users.length)
        var userIds = users.map((u) => {
            return u._id;
        })

        console.log(userIds.length);

        User.updateMany({ _id: { $nin: userIds } }, { $set: { freebieExpiry: new Date(2018, 3, 15) } }, (err, updated) => {
            if (err) {

            } else {
                res.json("All updated");
            }
        })
    })
})



router.get('/subscriptionExpirySchedular', function(req, res) {
    var d = [];
    // var todayDate = new Date();
    // var monthEnd = HelperService.getCurrentMonthLastDate();
    // var number = HelperService.getNoOfDaysDiff(monthEnd, todayDate)
    for(var i=0 ; i<= 134; i++){


        User.find({$and : [{$or : [{firebaseId: {$exists: true}} , {firebaseIdIOS: {$exists: true}}]} , {$or : [{firebaseId: {$ne: null}} , {firebaseIdIOS: {$ne: null}}]}]}, { subscriptionBuyDate: 1, firebaseId: 1, firebaseIdIOS: 1, phoneNumber: 1, firstName: 1, 'subscriptionRedeemMonth': 1 }).limit(1000).skip(i*1000).exec(function(err, users) {
            console.log(users.length)
            // User.find({ subscriptionId: { $in: [1, 2] }}, { subscriptionBuyDate: 1, firebaseId: 1, firebaseIdIOS: 1, phoneNumber: 1, firstName: 1, 'subscriptionRedeemMonth': 1 }, function(err, users) {
            var fbId = [],
                fbIos = [];
            // var data1 = { type: "subscription", title: "Your Be U Subscription Balance", body: "Your Be U subscription balance for this month expires in " + number + " days, so hurry up and book now.", sImage: "", lImage: "" };

            // var data2 = { type: "subscription", title: "Your Be U Subscription Balance", body: "Your Be U subscription balance for this month expires in " + number + " days, so hurry up and book now.", sImage: "", lImage: "" };
            var data1 = { type: "default", title: "Free Threading For Lifetime", body: "Book through app and get free threading always!", sImage: "", lImage: "" };

            var data2 = { type: "default", title: "Free Threading For Lifetime", body: "Book through app and get free threading always!", sImage: "", lImage: "" };

            _.forEach(users, function(user) {
                if (user.firebaseId) fbId.push(user.firebaseId);
                if (user.firebaseIdIOS) fbIos.push(user.firebaseIdIOS);
            })

            async.parallel([
                function(done) {
                    async.each([1, 2], function(p, callback) {
                        if (p == 1) {
                            Appointment.sendAppNotificationAdmin(fbId, data1, function(err, data) {
                                d.push(data);
                                callback();
                            })
                            console.log("android")
                        }
                        if (p == 2) {
                            Appointment.sendAppNotificationIOSAdmin(fbIos, data2, function(err, data) {
                                d.push(data);
                                callback();
                            })
                            console.log("ios")
                        }
                    }, done);
                }
            ], function allTaskCompleted() {
                console.log('done');
                return res.json(d.length);
            });
        })
    }
});


router.post('/couponExpirySchedular', function(req, res) {
    var d = [];
    var todayDate = new Date();
    var nextWeekDate = HelperService.addOneWeekDate(7, todayDate)
    console.log(nextWeekDate)
    for (var i = 0; i < 144; i++) {
        User.find({ 'couponCodeHistory.expires_at': { $lte: new Date(2018, 3, 1) } },
            // User.find({phoneNumber :{$in: ["8010178215", "8826345311"]}},
            { firebaseId: 1, firebaseIdIOS: 1, phoneNumber: 1, firstName: 1 }).skip(1000 * i).limit(1000).exec(function(err, users) {
            console.log(users.length)
            var fbId = [],
                fbIos = [];

            var data1 = { type: "", title: "Coupon Code Expiry", body: "Your Referral Discount Coupon for 30% discount is about to expire in 5 days, so hurry up and book now.", sImage: "", lImage: "" };

            var data2 = { type: "", title: "Coupon Code Expiry", body: "Your Referral Discount Coupon for 30% discount is about to expire in 5 days, so hurry up and book now.", sImage: "", lImage: "" };

            _.forEach(users, function(user) {
                if (user.firebaseId) fbId.push(user.firebaseId);
                if (user.firebaseIdIOS) fbIos.push(user.firebaseIdIOS);
            })

            async.parallel([
                function(done) {
                    async.each([1, 2], function(p, callback) {
                        if (p == 1) {
                            Appointment.sendAppNotificationAdmin(fbId, data1, function(err, data) {
                                d.push(data);
                                callback();
                            })
                            console.log("android")
                        }
                        if (p == 2) {
                            Appointment.sendAppNotificationIOSAdmin(fbIos, data2, function(err, data) {
                                d.push(data);
                                callback();
                            })
                            console.log("ios")
                        }
                    }, done);
                }
            ], function allTaskCompleted() {
                console.log('done');
                return res.json(d);
            });
        })
    }
});


router.get('/freebieExpirySchedular', function(req, res) {
    var d = [];
    var todayDate = new Date();
    User.find({loyalityPoints :{$gt: 0}}, { firebaseId: 1, firebaseIdIOS: 1, phoneNumber: 1, firstName: 1, loyalityPoints: 1 }).exec(function(err, users) {
            console.log(users.length)
            // var fbId = [],
                // fbIos = [];

            // _.forEach(users, function(user) {
            //     if (user.firebaseId) fbId.push(user.firebaseId);
            //     if (user.firebaseIdIOS) fbIos.push(user.firebaseIdIOS);
            // })
                async.each(users, function(u, callback) {
                    var data = { type: "freebie", title: "Your B-Cash Is About To Expire", body: "Your " + u.loyalityPoints + " B-Cash would expire on 31st December 2018, so hurry up and book now.", sImage: "", lImage: "" };
                    if (u.firebaseId) {

                        Appointment.sendAppNotificationNew(u.firebaseId, data, function(err, data) {
                            d.push(data);
                            callback();
                        })
                        console.log("android")
                    }
                    if (u.firebaseIdIOS) {
                        Appointment.sendAppNotificationIOS(u.firebaseIdIOS, data.title, data.body, "", data.type, "", function(err, data) {
                            d.push(data);
                            callback();
                        })
                        console.log("ios")
                    }
            }, function allTaskCompleted() {
                console.log('done');
                return res.json(d);
            });
        })
        // }
});



router.get('/updateSubscriptionHistory', function(req, res) {
    var d = [];
    SubscriptionSale.aggregate([
        { $lookup: { from: "appointments", localField: "userId", foreignField: "client.id", as: "appts" } },
        { $project: { userId: "$userId", appts: "$appts" } },
        { $unwind: "$appts" },
        { $match: { "appts.status": 3, "appts.loyalitySubscription": { $gt: 0 } } },
        {
            $group: {
                _id: "$userId",
                appts: {
                    $push: {
                        amount: '$appts.loyalitySubscription',
                        appointmentStartTime: "$appts.appointmentStartTime",
                        appointmentId: "$appts._id",
                        createdAt: new Date()
                    }
                },
                userId: { $first: "$userId" }
            }
        },
    ], function(err, appointments) {
        console.log(appointments)
        async.each(appointments, function(appt, callback) {

            User.update({ _id: appt.userId }, { $push: { subscriptionRedeemHistory: { $each: appt.appts } } }, function(err, updated) {
                console.log(err)
                if (updated) {
                    d.push(updated)
                    callback();
                } else
                    callback();

            })
        }, function allTaskCompleted() {
            res.json(d.length)
        })
    })
});





router.get('/salonSubscription', function(req, res) {
    console.log(req.body)
    var finalObject = {};
    var d = []
    SubscriptionSale.aggregate([{ $match: { createdAt: { $gte: new Date(2018, 2, 20) } } },
        { $lookup: { from: "appointments", localField: "userId", foreignField: "client.id", as: "appts" } },
        { $project: { userId: 1, response: 1, razorPayId: 1, price: 1, appts: "$appts", createdAt: 1, subscriptionDate: { '$dateToString': { format: '%m/%d/%Y', date: '$createdAt' } }, } },
        { $unwind: "$appts" },
        { $match: { "appts.status": 3, "appts.subscriptionAmount": { $gt: 0 }, $or: [{ 'appts.subscriptionReferralCode': { $eq: null } }, { 'appts.subscriptionReferralCode': { $eq: "" } }] } },
        { $group: { _id: "$userId", appts: { $first: "$appts" }, price: { $first: "$price" }, createdAt: { $first: "$createdAt" }, subscriptionDate: { $first: "$subscriptionDate" }, razorPayId: { $first: "$razorPayId" }, userId: { $first: "$userId" } } },
        {
            $project: {
                userId: "$userId",
                subscriptionDate: "$subscriptionDate",
                price: "$price",
                razorPayId: "$razorPayId",
                apptStatus: "$appts.status",
                clientPhoneNumber: "$appts.client.phoneNumber",
                loyalty: '$appts.loyalitySubscription',
                payableAmount: "$appts.payableAmount",
                createdAt: "$createdAt",
                clientName: "$appts.client.name"
            }
        }
    ], function(err, subscriptions) {
        console.log(subscriptions)
        async.each(subscriptions, function(subs, callback) {

            var apptDate = HelperService.getCustomStart(subs.createdAt)

            Appointment.find({ status: 3, loyalitySubscription: { $gt: 0 }, 'client.id': subs.userId }, { payableAmount: 1, loyalitySubscription: 1, 'services.name': 1, parlorName: 1, parlorAddress2: 1, appointmentStartTime: 1 }, function(err, appt) {
                var str = subs.razorPayId;
                var res = str.substring(0, 4);
                var apptsDetail = []

                subs.subscriptionType = (subs.price == '1699') ? "Gold" : "Silver";
                subs.paymentMethod = (res == "cash") ? "Cash Payment" : "Online Payment";
                subs.gender = (subs.gender == "M") ? "Male" : "Female";
                var firstApptDate;
                if (appt && appt.length > 0) {
                    _.forEach(appt, function(a) {
                        var arr = {}
                        arr.parlorname = a.parlorName + " - " + a.parlorAddress2;
                        arr.payableAmount = a.payableAmount;
                        arr.subscriptionAmountUsed = a.loyalitySubscription;
                        arr.appointmentDate = a.appointmentStartTime.toDateString();
                        arr.services = _.map(a.services, function(s) {
                            return s.name;
                        });

                        apptsDetail.push(arr)
                    })
                    firstApptDate = appt[0].appointmentStartTime;
                }
                subs.apptsDetail = apptsDetail;
                if (res != "cash") {
                    if (appt && appt.length > 0 && subs.createdAt.getDate() == firstApptDate.getDate()) {
                        d.push(subs);
                    }
                } else
                    d.push(subs);

                callback();
            });

        }, function allTaskCompleted() {

            return res.json(CreateObjService.response(false, d));
        })
    })
})


router.get('/extraSubscription', function(req, res) {
    Appointment.aggregate([{ $match: { status: 3, loyalitySubscription: { $gt: 0 } } },
        { $project: { loyalitySubscription: 1, _id: 1, month: { $month: "$appointmentStartTime" }, appointmentStartTime: 1, clientId: '$client.id', name: '$client.name', phoneNumber: '$client.phoneNumber' } },
        { $match: { month: 4 } },
        { $group: { _id: '$clientId', name: { $first: '$name' }, phoneNumber: { $first: "$phoneNumber" }, count: { $sum: 1 }, loyalitySubscription: { $sum: '$loyalitySubscription' } } },
        { $match: { loyalitySubscription: { $gt: 500 } } },
        { $project: { name: "$name", phoneNumber: "$phoneNumber", loyalitySubscription: "$loyalitySubscription", _id: 0 } }
    ], function(err, agg) {
        res.json(agg)
    })
});


router.get('/updateMarketing', function(req, res) {

    Appointment.count({}, function(err, fetchedUsers) {

        var loopCounter = Math.ceil(fetchedUsers / 1000);
        var loopsCount = [];
        for (var i = 0; i < loopCounter; i++) {
            var last = loopCounter - (i + 1);
            loopsCount.push(last);
        }
        async.eachSeries(loopsCount, function(lop, cbr) {
            var limi = 1000;
            var ski = 1000 * lop;

            Appointment.aggregate([
                { $match: { status: 3 } },
                {
                    $group: {
                        "_id": "$client.id",
                        appointmentCount: { $sum: 1 },
                        subtotal: { $push: '$subtotal' },
                        payableAmount: { $push: "$payableAmount" },
                        serviceRevenue: { $sum: '$serviceRevenue' },
                        productRevenue: { $sum: '$productRevenue' }
                    }
                },
                { $skip: ski },
                { $limit: limi },
                { $project: { appointmentCount: 1, clientId: "$_id", subtotal: { $max: "$subtotal" }, payableAmount: { $max: "$payableAmount" }, totalRevenue: { $add: ['$serviceRevenue', '$productRevenue'] } } },
            ], function(err, appointments) {
                console.log("apptLength", appointments.length);
                var premiumCustomer = false;
                _.forEach(appointments, function(appointment, key) {

                    if (appointment.payableAmount > 3000 || appointment.appointmentCount > 3) premiumCustomer = true;

                    MarketingUser.update({ userId: appointment.clientId }, { premiumCustomer: premiumCustomer, maximumBill: appointment.subtotal, totalRevenue: appointment.totalRevenue }, function(err, updated) {
                        console.log("done" + key);
                    });
                })
            });
            cbr();
        })

    }, function() {
        console.log(" Tasks Complted")

    })

});

router.get('/updateMarketing', function(req, res) {
    console.log("chala")
        // Appointment.aggregate([
        //     { $match: { status: 3 } },
        //     {
        //         $group: {
        //             "_id": "$client.id",
        //             appointmentCount: { $sum: 1 },
        //             subtotal: { $push: '$subtotal' },
        //             payableAmount: { $push: "$payableAmount" },
        //             serviceRevenue: { $sum: '$serviceRevenue' },
        //             productRevenue: { $sum: '$productRevenue' }
        //         }
        //     },
        //     { $project: { appointmentCount: 1, clientId: "$_id", subtotal: { $max: "$subtotal" }, payableAmount: { $max: "$payableAmount" }, totalRevenue: { $add: ['$serviceRevenue', '$productRevenue'] } } },

    for (var i = 140; i < 160; i++) {
        MarketingUser.find({ updatedAt: { $lt: new Date(2018, 4, 17) } }).skip(1000 * i).limit(1000).exec(function(err, marketing) {
            var mark = _.map(marketing, function(mar) { return mar.userId })
            console.log('markLength', mark)

            User.find({ _id: { $in: mark } }, { firebaseIdIOS: 1, firebaseId: 1, subscriptionId: 1, latitude: 1, longitude: 1 }).exec(function(err, users) {
                // ], function(err, appointments) {

                console.log("userb Length", users.length);

                async.each(users, function(user, cbr) {
                    var cityId = ConstantService.getCityId(user.latitude, user.longitude);
                    MarketingUser.findOne({ userId: user.id }, function(err, markUser) {
                        if (markUser) {
                            //         if (appointment.payableAmount > 3000 || appointment.appointmentCount > 3) markUser.premiumCustomer = true;

                            MarketingUser.update({ userId: user.id }, { firebaseIdIOS: user.firebaseIdIOS, firebaseId: user.firebaseId, subscriptionId: user.subscriptionId, cityId: cityId }, function(err, updated) {

                                console.log("done");
                                cbr();
                            });
                        } else {
                            console.log("else");
                            cbr();
                        }
                    })

                }, function() {
                    res.json(" Tasks Complted")
                });
            })
        })
    }
});


router.get('/frequencyData', function(req, res) {
    User.aggregate([{ $match: { subscriptionId: { $in: [1, 2] } } },
        { $lookup: { from: 'appointments', localField: '_id', foreignField: "client.id", as: 'appts' } },
        { $project: { _id: 1, subscriptionId: 1, appts: 1, subscriptionBuyDate: 1 } },
        { $unwind: '$appts' },
        { $match: { 'appts.status': 3, 'appts.appointmentStartTime': { $gte: new Date('$subscriptionBuyDate') }, 'appts.loyalitySubscription': { $gt: 0 } } },
        { $project: { clientId: "$appts.client.id", _id: 1, serviceRevenue: "$appts.serviceRevenue" } },
        { $group: { '_id': '$clientId', count: { $sum: 1 }, serviceRevenue: { $sum: "$serviceRevenue" } } },
        {
            $bucket: {
                groupBy: "$count",
                boundaries: [0, 1, 2, 3, 4, 7, 10, 13],
                default: "Other",
                output: {
                    "count": { $sum: 1 },
                    'serviceRevenue': { $sum: '$serviceRevenue' },
                    'clientId': { $first: "$_id" }
                }
            }
        },
        { $project: { _id: 1, count: 1, serviceRevenue: 1, clientId: 1 } }
    ], function(err, agg) {
        res.json(agg)
    })
});

router.get('/recentTenRatingAvg', function(req, res) {
    var d = [];
    Parlor.find({}, { _id: 1 }, function(err, parlors) {

        async.each(parlors, function(parl, call) {

            Appointment.aggregate([{ $match: { parlorId: ObjectId(parl._id), status: 3, 'review.rating': { $gt: 0 } } },
                { $sort: { appointmentStartTime: -1 } },
                { $limit: 10 },
                { $group: { _id: '$parlorId', rating: { $sum: '$review.rating' }, count: { $sum: 1 } } },
                { $project: { recentTenRatingAvg: { $divide: ['$rating', "$count"] } } }
            ], function(err, agg) {
                console.log(agg)
                if (agg.length > 0) {
                    var recentTenRatingAvg = agg[0].recentTenRatingAvg.toFixed(1)
                    Parlor.update({ _id: agg[0]._id }, { recentTenRatingAvg: recentTenRatingAvg }, function(err, update) {
                        d.push(update)
                        call();
                    });
                } else
                    call();
            });
        }, function allTaskCompleted() {
            console.log('allDone')
            res.json(d.length)
        });
    });
});

router.get('/removeOneService', function(req, res) {
    Parlor.find({_id : ""}, {services : 1}, function(err, parlors){
        console.log(parlors.length);
        _.forEach(parlors, function(p, key){
            var t = _.filter(parlor.services, function(s){ return s.serviceCode == 669});
            if(t.length>0){
                let f = _.filter(parlor.services, function(s){return s.serviceCode != 669});
                f.push(t[0]);
                Parlor.update({_id : parlor.id}, {services : f}, function(er, d){
                    console.log("done" + key);
                })
            }
        })
    });
});


router.get('/appRevenuePercentage', function(req, res) {
    var d = [];
    Parlor.find({}, { _id: 1, geoLocation: 1, name: 1, parlorType:1, parlorLiveDate: 1, avgRoyalityAmount:1 }, function(err, parlors) {

        async.each(parlors, function(parl, call) {

            Appointment.aggregate([{ $match: { parlorId: ObjectId(parl._id), status: 3, appointmentStartTime: { $gte: HelperService.getLastMonthStart() } } },
                { $group: { _id: '$parlorId', totalRevenue: { $sum: '$serviceRevenue' } } }

            ], function(err, appts) {
                Appointment.find({ parlorId: ObjectId(parl._id), status: 3, appointmentStartTime: { $gte: HelperService.getLastMonthStart() } },
                    { services:0}, function(err, distanceAppts) {

                    if (appts && appts.length > 0) {

                        var totalRevenue = appts[0].totalRevenue;
                        var distanceRevenue = 0;
                        var averageRevenue = 0;
                        var appDistanceRevenueFirstTime = 0;

                        if (distanceAppts && distanceAppts.length > 0) {
                            _.forEach(distanceAppts, function(a) {
                                if(a.latitude == null)a.latitude = 0;
                                if(a.longitude == null)a.longitude = 0;
                                if (a.appointmentType == 3 || a.couponCode || a.mode==5) {
                                    var distance = HelperService.getDistanceBtwCordinates1(parl.geoLocation[1], parl.geoLocation[0], a.latitude, a.longitude)
                                    if ((distance >= 0.05 && a.appointmentType == 3) || a.mode == 5 || a.couponCode) {
                                        distanceRevenue += a.serviceRevenue
                                        if (parl.parlorType != 4 && (a.client.noOfAppointments == 0 || a.couponCode || a.mode == 5)) {appDistanceRevenueFirstTime += a.serviceRevenue
                                        }else if(parl.parlorType == 4){
                                            appDistanceRevenueFirstTime += a.serviceRevenue;
                                        }
                                    }
                                }
                            })
                        }


                        if (distanceRevenue > 0 && totalRevenue > 0) {
                            averageRevenue = (distanceRevenue / totalRevenue).toFixed(2);
                        }
                        var finalAmount = (appDistanceRevenueFirstTime / parl.avgRoyalityAmount)
                        console.log(averageRevenue, parl.name , distanceRevenue , appDistanceRevenueFirstTime , finalAmount , parl.avgRoyalityAmount)
                        Parlor.update({ _id: parl._id }, { averageNoOfClientsPerDay : finalAmount}, function(err, update) {
                            call();
                        })
                    } else
                        call();
                })
            })

        }, function allTaskCompleted() {
            console.log('allDone')
            res.json(d)
        });
    });
});


router.get('/averageNoOfClientsPerDay', function(req, res) {
    var d = [];
    Parlor.find({}, { _id: 1, geoLocation: 1, name: 1, parlorLiveDate: 1 }, function(err, parlors) {

        async.each(parlors, function(parl, call) {

            Appointment.aggregate([{ $match: { parlorId: ObjectId(parl._id), status: 3, appointmentStartTime: { $gte: HelperService.getLastMonthStart() } } },
                { $project: { longitude: 1, latitude: 1, appointmentDate: "$appointmentStartTime"  , bookingMethod: 1 , couponCode : 1, mode:1 , appointmentType: 1} }
            ], function(err, agg) {
                if (agg && agg.length > 0) {
                    var countOfPeople = 0;
                     _.forEach(agg , function(a){
                                if(a.latitude == null)a.latitude = 0;
                                if(a.longitude == null)a.longitude = 0;
                            if ( a.appointmentType == 3 || a.couponCode || a.mode==5) {
                                var distance = HelperService.getDistanceBtwCordinates1(parl.geoLocation[1] , parl.geoLocation[0] , a.latitude , a.longitude)
                                if((distance >= 0.05 && a.appointmentType == 3) || a.mode == 5 || a.couponCode)countOfPeople++;
                            }
                        })
                    var averageNoOfClientsPerDay = 0;
                    var parlorLiveDifference;
                    if (parl.parlorLiveDate) parlorLiveDifference = HelperService.getDaysBetweenTwoDates(parl.parlorLiveDate, new Date())
                    else parlorLiveDifference = HelperService.getDaysBetweenTwoDates(agg[0].appointmentDate, new Date());

                    if (parlorLiveDifference < 30) averageNoOfClientsPerDay = countOfPeople / parlorLiveDifference;
                    else averageNoOfClientsPerDay = countOfPeople / 30;
                    var average = averageNoOfClientsPerDay.toFixed(2);
                    console.log(average)
                    Parlor.update({ _id: parl._id }, { averageNoOfClientsPerDay: average }, function(err, update) {
                        d.push(update)
                        call();
                    });
                } else
                    call();
            });
        }, function allTaskCompleted() {
            console.log('allDone')
            res.json(d.length)
        });
    });
});


router.get('/getFlashCouponBanners', function(req, res) {
    var images = ConstantService.getFlashCouponBanners();
    var flashCouponsBanner = [];

    var query = {};
    if (localVar.isServer()) query.active = true;
    else query.active = false;
    FlashCoupon.find(query, function(err, flashCoupons2) {
        if (flashCoupons2.length > 0) {
            _.forEach(flashCoupons2, function(f) {
                var arr = {};
                arr.couponCode = f.code;
                arr.expires_at = f.expires_at;
                arr.serviceCodes = f.serviceCodes;
                arr.menuPrice = f.menuPrice;
                arr.imageUrl = f.imageUrl;

                flashCouponsBanner.push(arr)
            });
            return res.json(CreateObjService.response(false, flashCouponsBanner));
        } else
            return res.json(CreateObjService.response(true, 'No active flash coupons'));
    });
})


router.get('/getFlashCouponAppointments', function(req, res) {
    Parlor.aggregate([{ $match: { active: true } }, { $group: { _id: null, parlorIds: { $push: "$_id" } } }], function(err, parlors) {
        Appointment.find({ appointmentStartTime: { $lt: HelperService.getDayEnd(new Date()) }, parlorId: { $in: parlors[0].parlorIds }, flashCouponCode: { $ne: null }, status: 1 }, { flashCouponCode: 1, appointmentStartTime: 1, parlorName: 1, 'client.phoneNumber': 1, 'client.name': 1, status: 1, address2: 1, serviceRevenue: 1, 'services.name': 1 }, function(err, appts) {
            if (appts) {
                var d = [];
                _.forEach(appts, function(a) {
                    var arr = {
                        appointmentId: a._id,
                        appointmentDate: a.appointmentStartTime.toDateString(),
                        clientName: a.client.name,
                        phoneNumber: a.client.phoneNumber,
                        flashCouponCode: a.flashCouponCode,
                        parlorName: a.parlorName + "-" + a.address2,
                        serviceRevenue: a.serviceRevenue,
                        services: a.services

                    };
                    if (a.status = 1) arr.status = 'Pending';
                    else if (a.status = 2) arr.status = 'Cancelled';
                    else if (a.status = 3) arr.status = 'Completed';

                    d.push(arr)
                })
                return res.json(CreateObjService.response(false, d));
            } else
                return res.json(CreateObjService.response(true, 'No active flash coupons'));
        });
    });
});


var AWS = require('aws-sdk');


AWS.config.loadFromPath('./config.json');

// load AWS SES

var s3Bucket = new AWS.S3({ params: { Bucket: 'portfolioappbeu1' } })

function imagesUrl(img, cb) {

    var imagesUrl = [];

    var params = {
        Bucket: 'portfolioappbeu1',
        Key: 'diagnosisreport/' + img,
        Expires: 31536000
    };

    s3Bucket.getSignedUrl('getObject', params, function(err, url) {
        // imagesName.push(img);
        console.log('the url of the image is', url);
        cb(url)
    })




};

router.post('/uploadDiagnosisReport', function(req, res) {

    var images = req.body.data;
    var userId = req.body.userId;
    var uploads = [];
    async.each(images, function(d, cb) {
        var imagesUrls = [];
        async.each(d.images, function(img, cbs) {

            var params = {
                Bucket: 'portfolioappbeu1',
                Key: 'diagnosisreport/' + img,
                Expires: 31536000
            };

            s3Bucket.getSignedUrl('getObject', params, function(err, url) {
                imagesUrls.push(url);
                cbs();
            })
        }, function() {

            uploads.push({
                "type": { type: 'number' },

                "imageName": d.images,

                "imageUrls": imagesUrls,
            })
            cb()
        })
    }, function() {



        User.findOne({ _id: userId }, { firstName: 1, lastName: 1 }, function(err, user) {


            var obj = {

                userName: user.firstName + " " + user.lastName,

                userId: userId,

                // employeeId: { type: 'string', },

                uploads: uploads
            }
            DiagnosisReport.create(obj, function(err, created) {

                if (err) {
                    res.json(HelperService.response(true, "error"))
                } else {
                    res.json(HelperService.response(false, "Success"))

                }

            })
        })

    })
});



router.get('/updateMarketingSchedular', function(req, res) {
    MarketingSchedular.aggregate([{ $match: { sendTime: { $lt: new Date(2018, 4, 17) } } }, { $group: { _id: null, marketingId: { $push: '$_id' } } }]).exec(function(err, marketing) {
        // var marketingId = _.map(marketing , function(mar){ return mar.id});
        var marketingId = marketing[0].marketingId;
        var date = HelperService.addDaysToDate(new Date(), 2)
        MarketingSchedular.updateMany({ _id: { $in: marketingId } }, { sendTime: date }, function(err, updated) {
            if (!err)
                res.json('updated')
            else
                res.json('error')
        })
        console.log(marketingId.length)
        console.log(date)
    })
});


router.get('/updateReviews', function(req, res) {

    Appointment.aggregate([
        { $match: { review: { $exists: true }, 'review.rating': { $gt: 0 }, status: 3 } },
        { $group: { _id: '$parlorId', count: { $sum: 1 }, rating: { $sum: "$review.rating" } } },
        { $project: { parlorId: "$_id", count: "$count", avgRating: { $divide: ['$rating', '$count'] } } }
    ], function(err, agg) {
        async.each(agg, function(parlor, call) {
            var rating = (parlor.avgRating.toFixed(1) > 1) ? parlor.avgRating.toFixed(1) : 4;
            var count = (parlor.count > 0) ? parlor.count : 1;
            console.log("rating", rating)
            Parlor.update({ _id: parlor.parlorId }, { rating: rating, noOfUsersRated: parlor.count }, function(err, data) {
                call();
            })

        }, function allTaskCompleted() {
            res.json('done')
        });
    })

})


router.get('/updateReviewUsers', function(req, res) {
    Parlor.find({}, { _id: 1 }, function(err, parlor) {
        async.each(parlor, function(par, call) {

            Appointment.find({ parlorId: par._id, 'review.rating': { $exists: true }, status: 3 }).count().exec(function(err, appt) {

                Parlor.update({ _id: par._id }, { noOfUsersRated: appt }, function(err, data) {
                    call();
                });
            });
        }, function allTaskCompleted() {
            res.json('done')
        });
    });
});

router.get('/parlorHomeForWebsite', function(req, res, next) {
    var query = {};
    if (req.query.parlorLink) query.link = req.query.parlorLink;
    else query._id = req.query.parlorId;
    Parlor.findOne(query, {
        name: 1,
        link: 1,
        images: 1,
        parlorId: 1,
        parlorType: 1,
        gender: 1,
        address1: 1,
        address2: 1,
        landmark: 1,
        rating: 1,
        price: 1,
        latitude: 1,
        longitude: 1,
        closingTime: 1,
        openingTime: 1,
        websiteBanner : 1,
        noOfUsersRated :1,
        recentTenRatingAvg:1,
    }).exec(function(err, parlor) {
        Appointment.find({parlorId: parlor.id, status: 3 , $and: [{'review.text' : {$ne: ""}} , {'review.text' : {$ne: null}}]} , {review: 1, client : 1 , appointmentStartTime:1}).sort({$natural:-1}).limit(5).exec(function(err , reviews){
            var parlorDetail = {
                name: parlor.name,
                parlorId: parlor.id,
                parlorType: parseInt(parlor.parlorType),
                link: parlor.link,
                images: parlor.images ? parlor.images : ["http://www.parlorwayzata.com/images/salon-wide.jpg"],
                gender: HelperService.getGenderName(parlor.gender),
                address1: parlor.address,
                address2: parlor.address2,
                landmark: parlor.landmark,
                rating: parlor.rating ? parseInt(parlor.rating) : 3.5,
                price: 2,
                websiteBanner: parlor.websiteBanner ? parlor.websiteBanner : "http://www.parlorwayzata.com/images/salon-wide.jpg",
                votes : parlor.noOfUsersRated,
                recentTenRatingAvg : parlor.recentTenRatingAvg,
                // services: reqData,
                phoneNumber: "8690291910",
                latitude: parlor.latitude,
                longitude: parlor.longitude,
                closingTime: parlor.closingTime,
                openingTime: parlor.openingTime,
                reviews : _.map(reviews , function(rev){ return {clientName: rev.client.name , rating : rev.review.rating , review : rev.review.text , appointmentDate : rev.appointmentStartTime}}),
                info: ["Credit Card Accepted", "Car Parking Available", "Air Condition"],
            };
            return res.json(parlorDetail);
        })
    });
});


router.get('/createSalonSupport', function(req, res) {
    var d = [];
    Parlor.find({}, { name: 1, active: 1, avgRoyalityAmount: 1, geoLocation: 1 , cityId: 1}, function(err, parlors) {
        async.each(parlors, function(parlor, call) {
            var dd = [];
            var date = new Date(2018, 7, 2);
            var arr = [7]
            async.each(arr, function(aa, callback) {

                var monthDate=new Date(date.setMonth(date.getMonth()));
                var monthStart= HelperService.getCurrentMonthStart(monthDate);
                var monthEnd= HelperService.getMonthLastDate(monthDate);
                var sellerName = HelperService.getMonthName(monthStart.getMonth())+" Closing Balance";
                
                console.log("sellerName" , sellerName)
                console.log("monthStart" , monthStart)
                console.log( "monthEnd", HelperService.getDayEnd(monthEnd))

                    DisountOnPurchase.findOne({ parlorId: parlor._id, sellerName: sellerName }, function(err, productDiscount) {
                        Appointment.aggregate([{ $match: { parlorId: ObjectId(parlor._id), status: 3, appointmentStartTime: { $gte: monthStart, $lt: HelperService.getDayEnd(monthEnd) } } },
                            { $group: { _id: null, loyalityRevenue: { $sum: '$loyalityPoints' } } }
                        ], function(err, appts) {
                            Appointment.find({ parlorId: ObjectId(parlor._id), status: 3, appointmentStartTime: { $gte: monthStart, $lt:  HelperService.getDayEnd(monthEnd) } },

                                {productRevenue:1, bookingMethod: 1, latitude: 1, longitude: 1, serviceRevenue: 1, mode: 1, appBooking: 1, appointmentStartTime: 1, client: 1, couponCode: 1 }, function(err, distanceAppts) {

                                    SubscriptionSale.find({firstParlorId : parlor._id ,actualPricePaid:{$in : [1199, 699]}, createdAt: { $gte: monthStart, $lt:  HelperService.getDayEnd(monthEnd) }}, {actualPricePaid : 1}, function(err , earlyBird){
                                        var fiveHundredCount = 0, oneThousandCount = 0;
                                        if(earlyBird.length> 0 ){
                                            _.forEach(earlyBird , function(eB){
                                                if(eB.actualPricePaid == 1199)fiveHundredCount++
                                                else if(eB.actualPricePaid == 699)oneThousandCount++
                                            })
                                        }
                                        var earlyBirdLoyalty = (500*fiveHundredCount) + (1000*oneThousandCount);

                                        HrSupportData.find({parlorId : parlor._id, month : monthStart.getMonth()}).count(function(err , hrData){
                                            var hrSupport = 3000 * hrData;

                                            TrainingSession.find({parlorId : parlor._id , trainingDate: { $gte: monthStart, $lt:  HelperService.getDayEnd(monthEnd) }}).count(function(err , trainingData){

                                                var trainingSupport = 3000 * trainingData ;

                                                var product = (productDiscount != null) ? productDiscount.discountPaid : 0;

                                                if (appts && appts.length > 0) {

                                                    var loyalityRevenue = appts[0].loyalityRevenue / 2;
                                                    var distanceRevenue = 0;

                                                    if (distanceAppts && distanceAppts.length > 0) {

                                                        _.forEach(distanceAppts, function(a) {

                                                            if (a.bookingMethod == 2 || a.couponCode || a.mode == 5 ) {
                                                                var distance = HelperService.getDistanceBtwCordinates1(parlor.geoLocation[1], parlor.geoLocation[0], a.latitude, a.longitude)

                                                                if (((distance >= 0.05 || distance == 0 ) && a.bookingMethod == 2 && a.client.noOfAppointments == 0) || a.couponCode || a.mode == 5) {
                                                                    distanceRevenue += (a.serviceRevenue + a.productRevenue);
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
                                                    supportCategoryName: "Be U Driven Support",
                                                    percentage: 100,
                                                    totalUsageAllowed: parlor.avgRoyalityAmount,
                                                    previousBalance: 0,
                                                    usageThisMonth: (loyalityRevenue + earlyBirdLoyalty + hrSupport + trainingSupport),
                                                    refundable: true,
                                                }
                                            ];

                                            var obj = {
                                                cityId: parlor.cityId,
                                                parlorId: parlor.id,
                                                parlorName: parlor.name,
                                                active: parlor.active,
                                                usageMonth: monthStart.getMonth(),
                                                usageYear: monthStart.getFullYear(),
                                                startDate: monthStart,
                                                royalityAmount: parlor.avgRoyalityAmount ? parlor.avgRoyalityAmount : 0,
                                                supportTypes: [],
                                                projectedRevenue: 0,
                                                supportProvided: (loyalityRevenue + product + distanceRevenue + earlyBirdLoyalty + hrSupport + trainingSupport),
                                                currentMonthUsageAllowed: (3 * parlor.avgRoyalityAmount),
                                                currentAmountUsage: (loyalityRevenue + product + distanceRevenue + earlyBirdLoyalty + hrSupport + trainingSupport),
                                                earlyBirdSupport : earlyBirdLoyalty,
                                                hrSupport : hrSupport,
                                                trainingSupport : trainingSupport,

                                            }
                                            obj.supportTypes = supportTypes;
                                            // console.log(obj)
                                            SalonSupportData.create(obj, function(err, created) {
                                                if (!err) {
                                                    d.push(aa)
                                                    callback();
                                                } else
                                                    callback();
                                            });

                                        });
                                    });
                                });
                            });
                        });
                    });

                }, function allTaskCompleted() {
                    d.push(dd)
                    call();
                })
        }, function allTaskCompleted() {
            res.json('done')
        });
    });
});


router.get('/generateTokenCashfreeApi' , function(req , res){
    var data = {};
      data.beneId = "1234";
      data.name = "Shailendra";
      data.phone = "8826345311";
      data.email = "shailendra@beusalons.com";
      data.address1 = "hgfhfghfgh";

     var options = {
        url: 'https://payout­-gamma.cashfree.com/payout/v1/authorize',
        method : 'post',
        // body : JSON.stringify(data),
        headers: {
          'X-Client-Id': 'CF1014D2QO7Q0Z87EE6MY',
          'X-Client-Secret': '4ad869fb93bb06d5be3fbba1481f340422d89bac'
      }
        };
        request.post(options, function(err, res1, body) {
            console.log(body)
                res.json(body)
        });
})

router.get('/addBeneficiary' , function(req , res){
    var data = {};
      data.beneId = "5678",
      data.name = "Shailendra";
      data.phone = "8826345311";
      data.email = "shailendra@beusalons.com";
      data.address1 = "hgfhfghfgh";
      data.bankAccount = "026291800001191";
      data.ifsc  = "YESB0000262";

     var options = {
        url: 'https://payout­-gamma.cashfree.com/payout/v1/addBeneficiary',
        method : 'post',
        body : JSON.stringify(data),
        headers: {
          'Authorization' : 'Bearer Hh9JCN4MzUIJiOicGbhJCLiQ1VKJiOiAXe0Jye.XN0XM3QTMxQTOyUTM6ICc4VmIsISM2EjLykjL3AjMukDNiojIwlmIsAjOis2Ylh2QlJXd0Fmbnl2ciwSM3gDMxQTOyUTM6ICdhlmIsISWNZTRFdDOaBTU38UUyQENxATMGNkI6ICZJRnbllGbjJye.7vj1-NLaarzqs4Xzbh-vU1YWEoYHTyDenPIvltu4QqwrMUD6m0UN1R8lOuPXgRMdrE'
      }
        };
        request.post(options, function(err, res1, body) {
            console.log(body)
            if (body && body.subCode == '200') {
                console.log(res1)
                res.json('successfully added')
                    // cb();
            } else {
                console.log(err)
                res.json('error')
            }
        });
})


router.get('/requestTransfer' , function(req , res){
    var data = {};
      data.beneId = "5678";
      data.amount = "1.00";
      data.transferId = "abcd4";
      // data.name = "Shailendra";
      // data.phone = "8826345311";
      // data.email = "shailendra@beusalons.com";
      // data.address1 = "hgfhfghfgh";
      // data.bankAccount = 50100146985484;
      // data.ifsc  = "HDFC0000503";

     var options = {
        url: 'https://payout­-gamma.cashfree.com/payout/v1/requestTransfer',
        method : 'post',
        body : JSON.stringify(data),
        headers: {
          'Authorization' : 'Bearer Hh9JCN4MzUIJiOicGbhJCLiQ1VKJiOiAXe0Jye.XN0XM3QTMxQTOyUTM6ICc4VmIsISM2EjLykjL3AjMukDNiojIwlmIsAjOis2Ylh2QlJXd0Fmbnl2ciwSM3gDMxQTOyUTM6ICdhlmIsISWNZTRFdDOaBTU38UUyQENxATMGNkI6ICZJRnbllGbjJye.7vj1-NLaarzqs4Xzbh-vU1YWEoYHTyDenPIvltu4QqwrMUD6m0UN1R8lOuPXgRMdrE'
      }
        };
        request.post(options, function(err, res1, body) {
            console.log(body)
            if (body && body.subCode == '200') {
                console.log(res1)
                res.json('successfully added')
                    // cb();
            } else {
                console.log(err)
                res.json('error')
            }
        });
})


router.get('/updateAppointmentData' , function(req, res){

    Appointment.find({status: 3, appointmentStartTime : {$gte: new Date(2018,4,1),$lte: new Date(2018,4,31,23,59,59)} , bookingMethod : 2},
        {status: 1, parlorId:1, serviceRevenue:1, 'client.id':1,appointmentStartTime:1 , productRevenue:1}, function(err , appts){

        var data=[];
        // var data={newClientServiceRevenue : 0 , newClientCount : 0 , newClientProductRevenue:0};
            console.log(appts.length)
        async.each(appts , function(ap , call){
            var d = ap.appointmentStartTime.getDay();
            var m = ap.appointmentStartTime.getMonth();
            var y = ap.appointmentStartTime.getFullYear();
            Appointment.find({status: 3, parlorId : ap.parlorId, serviceRevenue:{$gt: 0}, 'client.id': ap.client.id, appointmentStartTime:{$lt: new Date(y , m , d)} }, function(err, app){
                console.log(app.length)
                Appointment.update({_id: ap.id , 'client.id': ap.client.id},{'client.noOfAppointments' : app.length} , function(err , updated){
                    if(updated){
                        // data.push(updated);
                        call();
                    }
                    else{
                        data.push(err)
                        call();
                    }
                })

            })
        }, function allTaskCompleted(){
            res.json(data)
        })

    })
});


router.get('/updateMarketingDuplicateUser' , function(req, res){

    MarketingUser.count({}, function(err, fetchedUsers) {
        var loopCounter = Math.ceil(fetchedUsers / 1000);
        var loopsCount = [];
        for (var i = 0; i < loopCounter; i++) {
            var last = loopCounter - (i + 1);
            loopsCount.push(last);
        }
        async.eachSeries(loopsCount, function(lop, cbr) {
            var limi = 1000;
            var ski = 1000 * lop;

            MarketingUser.find({}, { phoneNumber : 1 , updatedAt: 1}, function(err, users) {

                _.forEach(users, function(user) {
                    var compareDate = user.updatedAt;
                   MarketingUser.find({phoneNumber : user.phoneNumber} , {updatedAt: 1 , createdAt: 1} , function(err , findUser){
                    console.log(findUser.length)
                        if(findUser.length > 1){
                            _.forEach(findUser , function(u){
                                if(compareDate > u.updatedAt){
                                    console.log(u)
                                    MarketingUser.remove({_id: u._id} , function(err , deleted){

                                    })
                                }else if(compareDate < u.updatedAt){
                                    console.log("else" , u)
                                    MarketingUser.remove({_id: user._id}, function(err , deleted){

                                    })
                                }
                            })
                        }
                   })
                });
                cbr();
            }).skip(ski).limit(limi)
        }, function() {
            console.log(" Tasks Complted")
        })
    });
});





router.get('/userlatLong' , function(req , res){
    var timePeriod = req.body.month ? HelperService.getCustomMonthStart(req.body.month) : new Date(2018,0,1)
    Appointment.aggregate([
                {$match : {appointmentStartTime : {$gte : timePeriod} , status: 3 , serviceRevenue : {$gt: 0} , latitude : {$gt : 0} , longitude : {$gt : 0}}},
                {$project : {latitude : 1, longitude : 1, _id: 0}}] , function(err , userData){

            return res.json(CreateObjService.response(false , userData))
    })
});


router.get('/salonLatLong' , function(req , res){
    Parlor.aggregate([  {$project : {geoLocation: 1, name: 1 , active: 1}},
                        {$unwind: "$geoLocation"},
                        {$group : {_id: "$_id", longitude : {$first : "$geoLocation"}, latitude : {$last : "$geoLocation"} ,
                            name:{$first : "$name"} , active: {$first: "$active"}}},
                        {$group : {_id: "$active" , salons :{$push : {name: "$name", longitude: "$longitude" , latitude:"$latitude"}}}}
                    ], function(err , salonData){
                         return res.json(CreateObjService.response(false , salonData))
                  })
});


router.get('/addAllBeneficiary' , function(req , res){
    var options = {
        url: 'https://payout­-gamma.cashfree.com/payout/v1/authorize',
        method : 'post',
        // body : JSON.stringify(data),
        headers: {
          'X-Client-Id': 'CF1014D2QO7Q0Z87EE6MY',
          'X-Client-Secret': '4ad869fb93bb06d5be3fbba1481f340422d89bac'
      }
        };
        request.post(options, function(err, res1, token) {
            console.log(token)

            Parlor.find({active: true} , {services : 0}, function(err , parlors){
                async.each(parlors , function(parlor , callback){
                    Admin.findOne({role: 7 , parlorIds : parlor._id},{emailId : 1, phoneNumber : 1} , function(err, owner){
                        var data = {};
                          data.beneId = parlor._id,
                          data.name = parlor.name;
                          data.phone = parlor.phoneNumber;
                          data.email = owner.emailId;
                          data.address1 = parlor.address+','+ parlor.address2;
                          data.bankAccount = parlor.accountNo;
                          data.ifsc  = parlor.ifscCode;

                        var options = {
                        url: 'https://payout­-gamma.cashfree.com/payout/v1/addBeneficiary',
                        method : 'post',
                        body : JSON.stringify(data),
                        headers: {
                          'Authorization' : 'Bearer '+token.data.token+''
                      }
                        };
                        request.post(options, function(err, res1, body) {
                            console.log(body)
                            if (body && body.subCode == '200') {
                                console.log(res1)
                                 callback();
                            } else {
                                console.log(err)
                                callback();
                            }
                        });

                    })
            }, function allTaskCompleted(){
                res.json('done')
            })
        })
    });
})


router.get('/updateSubscription' , function(req, res){
    var d= [];
    SubscriptionSale.aggregate([{$lookup : {from : "appointments" , localField :"userId" , foreignField :"client.id" , as : "appt"}},
            {$unwind: '$appt'},
            {$match : {'appt.status' :3 , 'appt.loyalitySubscription' :{$gt : 0}}},
            {$project : {parlorId : '$appt.parlorId', apptDate : '$appt.appointmentStartTime',apptId : '$appt._id' ,userId: 1, subsId: "$_id"}},
            {$sort: {apptDate : 1}},
            {$group : {_id: "$userId" ,  subsId:{$first : '$subsId'},date : {$first : "$apptDate"} , parlorId: {$first : '$parlorId'}}}
            ] , function(err , agg){
                async.each(agg , function(a, call){
                    SubscriptionSale.update({_id: a.subsId} , {firstApptDate : a.date , firstParlorId : a.parlorId} ,function(err , subsUpdate){
                        d.push(subsUpdate)
                        call();
                    })
                }, function allTaskCompleted(){
                    res.json(d.length)
                })
            })
});


router.get('/getUserData' , function(req, res){

 Appointment.count({status:3}, function(err, fetchedAppts) {
        var loopCounter = Math.ceil(fetchedAppts / 1000);
        var loopsCount = [];

        for (var i = 160; i < 166; i++) {
            var last = loopCounter - (i + 1);
            loopsCount.push(last);
        }
        var d= []
        console.log(loopCounter)
        async.eachSeries(loopsCount, function(lop, cbr) {
        // var d= [];

            var limi = 1000;
            var ski = 1000 * lop;
            console.log(lop)
            Appointment.find({status: 3}, {'client.id' :1},function(err , appts){
                async.each(appts , function(ap , call){
                    User.findOne({_id: ap.client.id , $or: [{'subscriptionId' : {$exists : false}} , {'subscriptionId' :0}]}, {emailId: 1, phoneNumber:1, latitude:1, longitude:1 ,gender:1, facebookId:1, firstName:1, lastName:1} ,
                        function(err , a){
                            if(a){
                                var obj = {fn : (a.firstName== null) ? "" : a.firstName , ln : a.lastName ? a.lastName : "", email : a.emailId ? a.emailId : "", phone : a.phoneNumber, country : "India", uid : a.facebookId ? a.facebookId : "" , gender: a.gender ? a.gender : ""}

                                var cityId = ConstantService.getCityId(a.latitude , a.longitude);
                                if(cityId ==1){obj.city = 'New Delhi'; obj.state = 'New Delhi'}
                                else if(cityId ==2){obj.city = 'Bangalore'; obj.state = 'Karnataka'}

                                d.push(obj);
                                call();
                            }
                            else
                                call();

                    })
                }, function allTaskCompleted(){

                    // console.log(d)

                    cbr();
                })
            }).skip(ski).limit(limi)

            }, function allTaskCompleted2() {
                return res.json( d);
            });
        })
})


router.post('/beuappointmentquery' , function(req, res){
    WebsiteQuery.create({name : req.body.name , phoneNumber : req.body.phoneNumber , createdAt : req.body.date} , function(err , websiteQuery){
        if(websiteQuery){
            var emailIds = ['shailendra@beusalons.com', 'aprajita.singh@beusalons.com' , 'komalraikwar@beusalons.com' , 'ashisharora@beusalons.com']
                function sendEmail() {
                    var transporter = nodemailer.createTransport('smtps://reports@beusalons.com:wx2t2Tr7pMrqnK2CIqwd3g@smtp.mandrillapp.com');
                    var mailOptions = {
                        from: 'info@beusalons.com', // sender address
                        to: emailIds, // list of receivers
                        html: '<div>Hi, There is a new appointment request on website. Name- <b>'+websiteQuery.name+'</b>, Phonenumber- <b>'+websiteQuery.phoneNumber+'</b>.</div>',
                        subject: 'New Appointment Request on Website' // Subject line
                    };
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error)
                            console.log(error);
                        else
                            console.log('Message sent: ' + info.response);
                    });
                }
                sendEmail();
        return res.json(CreateObjService.response(false, 'Successfully Sent!'));
        }
    })
});


router.post('/captureSalonPassPayment' , function(req , res){
    console.log(req.body)
     Appointment.captureSubscriptionPayment(req.body.paymentId.razorpay_payment_id, req.body.amount*100, function(err, response) {
        if(!err && response.status == "captured"){
            var phoneNumber = response.contact.slice(3), emailId = response.email;
            var otp = Math.floor(Math.random() * 9000) + 1000;
            SalonPassPayments.create({phoneNumber : phoneNumber , emailId : emailId , paymentObj : response , amount : req.body.amount, status :0 , otp: otp} , function(err , salonPassUser){
                if(salonPassUser){
                    var message = "Thanks for registering your salon with SalonPass. Please use OTP "+otp+" to log into our app to register your outlet details and menu of your salon http://onelink.to/f9fwcj Or call 9821886522."

                    Otp.create({used: 0, otp: otp, phoneNumber: phoneNumber, message: message}, function(err, newOtp) {
                        Appointment.msg91Sms(phoneNumber, message, function(e) {
                            return res.json(CreateObjService.response(false , "You are a SalonPass member"));
                        });
                    });
                }
                else
                    return res.json(CreateObjService.response(true , "Error in adding SalonPass member"));
            });
        }
        else
           return res.json(CreateObjService.response(true , "Payment was not captured"));
     });
});


router.post('/registerNewUserSwitchApp' , function(req , res){
    // var now_date = new Date();
    // now_date.setMonth(now_date.getMonth() + 1);
    // var creditsHistory = { createdAt: new Date(), amount: 500, balance: 500, source: null, reason: 'New Registration' };

    User.create({firstName : req.body.name, source : "phone", gender : req.body.gender, phoneNumber : req.body.phoneNumber, emailId : "",  password : "dasdsadsadsadsa", accesstoken : "accesstokenasddsasdadsa&fffff21345" , phoneVerification: 1}, function(err, us){
               return res.json(CreateObjService.response(false, User.getUserObjApp(us)));
    })
})

router.get('/sendSmsXML' , function(req, res){
    // MarketingUser.aggregate([{$match :
    //             {lastAppointmentDate: {$gte : new Date(2017,10,1) , $lte : new Date(2018, 3,30)} , subscriptionId : 0}},
    //             {$skip : 10},
    //             {$group: {_id: null , phoneNumber :{$push : '$phoneNumber'}}}
    // WebsiteQuery.aggregate([{$match :{isConverted : false}},
    //                         {$skip : 13768},
    //                         {$group: {_id: null , phoneNumbers :{$push : '$phoneNumber'}}}
    //         ],function(err , users){
    // Appointment.aggregate([
    //     {
    //         $match : {
    //             status : 3,
    //             parlorId: ObjectId("5b49c81f5045c72d8301b45d")    
    //         },
    //     },
    //     {$project :{clientNumber :'$client.phoneNumber' }},
    //     {$group :{_id: "$clientNumber" , phoneNumber :{$first :"$clientNumber"}}},
    //     {$group :{_id: null , phoneNumbers :{$push :"$phoneNumber"}}}    
    // ], function( err , appt){
        // "couponCodeHistory.couponType": 14
        User.aggregate([{$match : {"couponCodeHistory.couponType": 14}}, {$group :{_id: null, phoneNumbers:{$push : "$phoneNumber"}}}], function(err , appt){
            console.log(appt[0])
                var message = "Be U misses you. A special FLAT 25% OFF for your next visit. Valid on ongoing deals too. At select salons through coupon section. Code FLATOFFBEU http://onelink.to/bf45qf"
        User.sendSmsToUsers(appt[0].phoneNumbers, message);
    })
});


router.post('/editOwnerDetails' , function(req, res) {

    if(!req.body.edit){
        var ownerDetail ={};
        Admin.findOne({phoneNumber : "9717279878"},{phoneNumber :1, emailId : 1 , firstName: 1, lastName:1, parlorIds :1}, function(err , owner){
            // ownerDetail = owner
            Parlor.find({_id: {$in  : owner.parlorIds}} , {name: 1 , address2 :1} , function(err , parlors){
                console.log(parlors)
                if(parlors){
                    var parlor = _.map(parlors , function(pa){ return pa.name +"-"+ pa.address2});
                    ownerDetail.parlorIds = parlor
                    return res.json(CreateObjService.response(false , ownerDetail));
                }
            })
        })
    } else {
        Owner.update({phoneNumber : req.body.phoneNumber}, {password : req.body.password, parlorId : req.body.parlorId, parlorIds : req.body.parlorIds, role: req.body.role, position: req.body.position, emailId: req.body.emailId} , function(err , update){
            if(update){
                return res.json(CreateObjService.response(false , 'Successfully Updated'));
            }

        })
    }
});

router.get('/facebookMessenger' , function(req, res) {
    console.log("facebook webhook get api")

  let VERIFY_TOKEN = "token123"

  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

       // Checks if a token and mode is in the query string of the request
  if (mode && token) {
  
    // Checks the mode and token sent is correct
    if ( token === VERIFY_TOKEN) {
      
      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);      
    }
  }
});

router.post('/facebookMessenger' , function(req, res) {
    console.log("facebook webhook post api");

    let body = req.body;
    console.log(body.entry)
    if (body.entry[0] && body.entry[0].changes && body.entry[0].changes[0] && body.entry[0].changes[0].field === 'leadgen') {
        let request_body = {}
              let leadgen_id = parseInt(body.entry[0].changes[0].value.leadgen_id)
              console.log(leadgen_id)
              request({
                "uri": "https://graph.facebook.com/v2.8/"+leadgen_id,
                "qs": { "access_token": "EAAEumq6snoUBALvr2YZBfvBZAUc6mTX42RwM5xtm7SPh9HDVLoHGzZCiiRz1fSRo3n2I7KCj7ZA5CBDGvrvVVN77Qm0UUPPIRZBweZAagFb4tyqrA5XDbL7DOz7uW3IS0O62vtFPRZBtEtQO0jFKwa196ZAKMflqZAvAL2SJgkNx3eZBHrnkNkZBfOF" },
                "method": "GET",
                "json": request_body
              }, (err, res2, body2) => {
                if (!err && body2.field_data) {
                        let phoneNumber = "";
                        let name = "";
                        let city = "";
                        _.forEach(body2.field_data, function(d){
                            if(d.name == 'full_name')name = d.values[0]
                            if(d.name == 'phone_number')phoneNumber = d.values[0].slice(-10)
                            if(d.name == 'select_your_state')city = d.values[0]
                        })
                        let whastappLink = 'https://tinyurl.com/y6z2xkr8'
                        let formObj = body.entry[0].changes[0].value
                        if(formObj){
                            if(formObj.form_id && city == ""){
                                if(formObj.form_id == "1233594770143231"){city = "Dehradun", whastappLink='https://tinyurl.com/y6z2xkr8'}
                                else if(formObj.form_id == "646504429177576"){city = "Pune",whastappLink='https://tinyurl.com/y6xh9afo'}
                                else if(formObj.form_id == "2074299459325167"){city = "Banglore",whastappLink='https://tinyurl.com/y6z2xkr8'}
                                else if(formObj.form_id == "439431366868249"){city = "Delhi",whastappLink='https://tinyurl.com/y6xh9afo'}
                                else if(formObj.form_id == "319775095360342"){city = "Delhi",whastappLink='https://tinyurl.com/y6xh9afo'}
                                else if(formObj.form_id == "2332174120209561"){city = "Monsoon",whastappLink='https://bit.ly/2GjZr09'}
                                else if(formObj.form_id == "909007829444527"){city = "Monsoon Patna",whastappLink='https://bit.ly/2GjZr09'}
                            }
                        }
                        FacebookQuery.findOne({phoneNumber : phoneNumber}, function(err, f){
                            if(f){
                                res.status(200).send('EVENT_RECEIVED');
                            }else{
                                FacebookQuery.create({name : name, phoneNumber : phoneNumber,city : city ,value : body.entry[0].changes[0], detail : body2, source : 'facebook'}, function(er, wb){
                                        let usermessage = getSmsUrl('BEUSLN', 'Thanks for inquiring, we shall get back to you shortly over a call (11 am-6 pm) or chat with us now on WhatsApp click here '+whastappLink, [phoneNumber], 'T')
                                        Appointment.sendSMS(usermessage, function (e) {
                                            console.log('message sent!')
                                            res.status(200).send('EVENT_RECEIVED');
                                        });
                                })
                            }
                        })
                } else if(body2.error){
                    let usermessage = getSmsUrl('BEUSLN', 'Facebook Leads Weebhook Broken!', ["8826345311","9695748822","9811413528"], 'T')
                    Appointment.sendSMS(usermessage, function (e) {
                        console.log('message sent!')
                        res.status(200).send('EVENT_RECEIVED');
                    });
                }else {
                  console.log(body2)
                    res.status(200).send('EVENT_RECEIVED');
                }
              });
      }
      else if (body.object === 'page') {

        body.entry.forEach(function(entry) {

          let webhook_event = entry.messaging[0];
          console.log(webhook_event);
          

          let sender_psid = webhook_event.sender.id;
          console.log('Sender PSID: ' + sender_psid);
            FacebookChat.findOne({senderId : sender_psid , date : {$exists : true}} , function(err , apptdate){
                var date = null;
                if(apptdate)date = apptdate.date;

              if (webhook_event.message) {
                handleMessage(sender_psid, webhook_event.message , date);
              } else if (webhook_event.postback) {
                handlePostback(sender_psid, webhook_event.postback);
              } 
            })
        });

        res.status(200).send('EVENT_RECEIVED');
      }else {
        res.sendStatus(404);
      }
});

// Handles messages events
function handleMessage(sender_psid, received_message , date) {
    console.log("handleMessage")
    console.log(received_message)
    var receiveAmPmText = received_message.text ? received_message.text.substring(1,3) : "";
    let response;

        if(received_message.quick_reply){
                response = FacebookChat.getResponseFromPayload(sender_psid , received_message.quick_reply.payload)
                callSendAPI(sender_psid, response);
        }else if(received_message.attachments){
                console.log(received_message.attachments)
                let loc = received_message.attachments[0].payload.coordinates
                FacebookChat.getParlors({latitude : loc.lat, longitude : loc.long} , "" , function(response){
                    callSendAPI(sender_psid, response);
                })
        }
      else if (received_message.text == "Want to make an appointment." ) {
            response = {
                "attachment":{
              "type":"template",
              "payload":{
                "template_type":"button",
                "text":"Select one of the available options below to continue.",
                "buttons":[
                  {
                      "type": "postback",
                      "title": "Book an Appointment",
                      "payload": "1_1"
                    },
                    {
                      "type": "postback",
                      "title": "Send us a message",
                      "payload": "1_2"
                    }
                ]
              }
            }
          }
        
        callSendAPI(sender_psid, response);

    } else if(received_message.nlp && received_message.nlp.entities.location){
        FacebookChat.typingApi(sender_psid , "typing_on")
        FacebookChat.getLocality(sender_psid, received_message.text , function(d){
            if(d){

                response = d
            
                FacebookChat.typingApi(sender_psid , "typing_off")
                callSendAPI(sender_psid, response);
            }
        })
        
    }
    else if (received_message.text == "Keratin" || received_message.text == "Global Color" || received_message.text == "Smoothening|Straightening|Rebonding") {
        var payload = "";
        if(received_message.text == "Keratin")payload = "3_1_4";
        if(received_message.text == "Global Color")payload = "3_1_5";
        if(received_message.text == "Smoothening|Straightening|Rebonding")payload = "3_1_6";

            FacebookChat.createNewObj(sender_psid , payload)

            response = FacebookChat.getResponseFromPayload(sender_psid , payload);
        
        callSendAPI(sender_psid, response);

    } else if(received_message.nlp && received_message.nlp.entities.phone_number){
        console.log("right place")
        // FacebookChat.typingApi(sender_psid , "typing_on") 
        // response = { "text" : "Your appointment will be booked shortly."}
        //     var phoneNumber = received_message.nlp.entities.phone_number[0].value;
        //     FacebookChat.createFinalDetails(sender_psid ,phoneNumber , function(f){
        //         if(f){
        //             FacebookChat.typingApi(sender_psid , "typing_off")
        //             callSendAPI(sender_psid, f.message1);
        //             callSendAPI(sender_psid, f.message2);
        //         }
        //     });

        response = {
            "text": "Select Location",
            "quick_replies":[
             /* {
                "content_type":"location",
                "title":"Give Location",
                "payload":"1_1",
                // "image_url":"http://example.com/img/red.png"
              },*/
               {
                "content_type":"text",
                "title":"Type Locality",
                "payload":"5_0",
                // "image_url":"http://example.com/img/red.png"
              }
            ]
          }
        var phoneNumber = received_message.nlp.entities.phone_number[0].value;
        FacebookChat.createAppointmentDetails(sender_psid , null, phoneNumber  , null , null , null);
        callSendAPI(sender_psid, response);

    } else if( received_message.nlp && received_message.nlp.entities.datetime && received_message.nlp.entities.datetime[0].grain == "day"){


        response = { "text" : "Time of Appointment in am or pm (e.g. 6pm)"}
            var date = new Date(received_message.nlp.entities.datetime[0].value);
            FacebookChat.createAppointmentDetails(sender_psid , date, null , null , null , null);

        callSendAPI(sender_psid, response);
    }
    else if(receiveAmPmText == "" && Number.isInteger(parseInt(received_message.text))){
        console.log("aayaa")
        FacebookChat.findOne({senderId : sender_psid , level : "8_1"}, function(err , found){
            if(found){
                response = { "text" : "Time of Appointment in am or pm (e.g. 6pm)"}
                    var myDate = new Date();
                    var date = new Date(myDate.getFullYear(), myDate.getMonth(), received_message.text , myDate.getHours(),  myDate.getMinutes(),  myDate.getSeconds() )
                    FacebookChat.createAppointmentDetails(sender_psid , date, null , null , null , null);
            } else{
                response = {}

            }
            callSendAPI(sender_psid, response);
        })
    } 

    else if(received_message.nlp && received_message.nlp.entities.datetime && (received_message.nlp.entities.datetime[0].grain == "hour" || received_message.nlp.entities.datetime[0].grain == "minute")){
        // response = { "text" : "Please give your Phone Number from which you wish to create the Appointment."}

            var time = new Date(received_message.nlp.entities.datetime[0].value);
            var apptDate = HelperService.mixDateAndTime(date , time);

        // FacebookChat.createAppointmentDetails(sender_psid , null ,apptDate , null , null, null);

        // callSendAPI(sender_psid, response);



        FacebookChat.typingApi(sender_psid , "typing_on") 
        response = { "text" : "Your appointment will be booked shortly."}
            
            FacebookChat.createFinalDetails(sender_psid ,apptDate , function(f){
                if(f){
                    FacebookChat.typingApi(sender_psid , "typing_off")
                    callSendAPI(sender_psid, f.message1);
                    callSendAPI(sender_psid, f.message2);
                }
            });
    }  
    else {
        FacebookChat.findOne({senderId : sender_psid , query : true}, function(err , f){
            if(f){
                 callSendAPI(sender_psid, {}); 
            }else{
                response = {
                        "attachment":{
                      "type":"template",
                      "payload":{
                        "template_type":"button",
                        "text":"Sorry, we didn't understand that. Right now we can only help you with booking an appointment. Select one of the available options below to continue.",
                        "buttons":[
                          {
                              "type": "postback",
                              "title": "Book an Appointment",
                              "payload": "1_1"
                            },
                            {
                              "type": "postback",
                              "title": "Send us a message",
                              "payload": "1_2"
                            }
                        ]
                      }
                    }
                  }
                  FacebookChat.createNewObj(sender_psid , '1_2')
                callSendAPI(sender_psid, response);
            }
        })

         
    }

};

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {
    console.log("handlePostback")
     let response;

      let payload = received_postback.payload;
      var payloadStr = payload.substring(0, 3);
      if(payload == "get_started"){
            console.log("here")
        FacebookChat.createNewObj(sender_psid, payload)
      }
      else if ( payloadStr == "5_1" || payloadStr == "5_2") {
        var city = (payloadStr == "5_1" ) ? "Delhi" : "Bengaluru";
        console.log("city--------------" , city)
        FacebookChat.createAppointmentDetails(sender_psid , "" , "" , city , "" , "")

    }else if(payloadStr == "7_1"){
        console.log("do nothing")
    } else
        FacebookChat.createNewObj(sender_psid , payload)
    
    if(payload == "get_started"){
            response = {'text' : 'Woooohoo.. looks like someone is new around here  Welcome to Be U Salons'}
            callSendAPI(sender_psid, response);
            setTimeout(function(){
 /*       response = {
                "attachment":{
              "type":"template",
              "payload":{
                "template_type":"button",
                "text":"Select one of the available options below to continue.",
                "buttons":[
                  {
                      "type": "postback",
                      "title": "Book an Appointment",
                      "payload": "1_1"
                    },
                    {
                      "type": "postback",
                      "title": "Send us a message",
                      "payload": "1_2"
                    }
                ]
              }
            }
          }*/
          response = {
            "text": "Please select",
            "quick_replies":[
              {
                "content_type":"text",
                "title":"Book Appointment",
                "payload":"1_1",
                // "image_url":"http://example.com/img/red.png"
              },
               {
                "content_type":"text",
                "title":"Send message",
                "payload":"1_2",
                // "image_url":"http://example.com/img/red.png"
              }
            ]
          }
        
        callSendAPI(sender_psid, response);
      }, 5000);
      }
      response = FacebookChat.getResponseFromPayload(sender_psid , payload);

      callSendAPI(sender_psid, response);


      
};

function callSendAPI(sender_psid, response) {

  let request_body = {
    "recipient": {
      "id": sender_psid
    },

    "message": response
  }
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": "EAAEumq6snoUBALvr2YZBfvBZAUc6mTX42RwM5xtm7SPh9HDVLoHGzZCiiRz1fSRo3n2I7KCj7ZA5CBDGvrvVVN77Qm0UUPPIRZBweZAagFb4tyqrA5XDbL7DOz7uW3IS0O62vtFPRZBtEtQO0jFKwa196ZAKMflqZAvAL2SJgkNx3eZBHrnkNkZBfOF" },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  });
};



router.get("/addEmployeeAccounts", function(req, res) {
    console.log("sdkjkhfkjdshf")
     // role:{$ne:7},"accountNumber": { "$nin": [ null, "" ] },"ifscCode": { "$nin": [ null, "" ] } 
    // Admin.find({$and: [{ifscCode: {$exists: true}} ,  {ifscCode: {$nin:[ "" , null, "."]}}],
                // $and: [{accountNo: {$exists: true}} , {accountNo: {$nin:[ "" , null, "."]}}], active: true, razorPayAccountId:{$exists: false}}, { _id: 1,ifscCode:1, firstName:1, accountNo:1, lastName:1 , parlorId:1}, function(err, employees) {
    Admin.find({parlorId: {$in : [ ObjectId("5b5b1dde715b6407d175c383"), ObjectId("5bf8f48f40fdce4d68d83771"), ObjectId("5c063348b0fb9e4f4dec97e5"),ObjectId("5c08cda133e7d52c0b67c922") , ]}, active : true , $and : [{ifscCode: {$exists : true}} , {ifscCode: {$ne : "."}}] , razorPayAccountId: {$exists: false}}, { _id: 1,ifscCode:1, firstName:1, accountNo:1, lastName:1 , parlorId:1, accountNumber:1}, function(err, employees) {
            var d = [];
            async.each(employees , function(employee , callback){
                var accountNo = employee.accountNo ? employee.accountNo : employee.accountNumber;
                var Razorpay = require('razorpay');
                var auth = new Buffer(localVar.getRazorKey() + ':' + localVar.getRazorAppSecret()).toString('base64');

                if(employee.lastName == "." || employee.lastName == " " || employee.lastName == null)employee.lastName = "";
                    var employeeName = employee.firstName + " " +employee.lastName;

                var uri='https://api.razorpay.com/v1/beta/accounts'
                var employeeData={
                    "name": employeeName,
                    "email":employee.firstName.slice(0,3)+"monsoon@gmail.com",
                    "tnc_accepted":1,
                    "account_details":{
                        "business_name":employeeName,
                        "business_type":"individual"
                    },
                    "bank_account":{
                        "ifsc_code":employee.ifscCode,
                        "beneficiary_name":employeeName,
                        "account_type":"saving",
                        "account_number": accountNo
                    } ,
                    "notes" :{
                        employeeId : employee.id
                    }
                }
                request({
                    uri:uri ,
                    form: employeeData,
                    method: 'POST',
                    headers: {

                         'Authorization' : 'Basic ' + auth,
                      
                      "Content-type": "application/json"
                    }
                    
                  }, function (err, response, body) {
                    
                    if(!err){
                        var myObj = JSON.parse(response.body);
                        if(myObj.error && myObj.error.code === "BAD_REQUEST_ERROR"){
                            d.push({employeeId : employee.id, employeeName : employeeName , parlorId : employee.parlorId})
                            callback();
                        }else{
                            Admin.update({_id: employee.id}, {razorPayAccountId : myObj.id , paymentMode: 1} , function(err , update){
                                if(update)
                                    callback();
                                else
                                    callback();
                            })
                        }
                    }else{
                        d.push({employeeId : employee.id, employeeName : employeeName , parlorId : employee.parlorId , employeeData: employeeData})
                        callback();
                    }
                  });
            }, function allTaskCompleted(){
                res.json(d);
            })
    });
})


router.get('/settlementWebhook', function(req, res) {

            var Razorpay = require('razorpay');
            var auth = new Buffer(localVar.getRazorKey() + ':' + localVar.getRazorAppSecret()).toString('base64');
                var uri='https://api.razorpay.com/v1/transfers?recipient_settlement_id=setl_BiCxKW5MLK0Kt6'
                request({
                    uri:uri ,
                    method: 'GET',
                    headers: {

                         'Authorization' : 'Basic ' + auth, 
                      
                      "Content-type": "application/json"
                    }
                    
                  }, function (err, response, body) {
                    console.log("reponse", response.body);
                    var data = JSON.parse(response.body);
                    
                        return res.json(data)
                  });

});


router.post('/transferLuckyDrawWebhook', function(req, res) {
    var Razorpay = require('razorpay');
    console.log("hit");
    // WebhookObject.create({obj  : req.body.payload , createdAt : new Date()});
    if(req.body.event == "settlement.processed"){
    var obj = { 
                settlementId: req.body.payload.settlement.entity.id, 
                amount: req.body.payload.settlement.entity.amount, 
                status: req.body.payload.settlement.entity.status,
                account_id: req.body.account_id
            }
            console.log("webhook" , obj.account_id)
        var auth = new Buffer(localVar.getRazorKey() + ':' + localVar.getRazorAppSecret()).toString('base64');
        var uri='https://api.razorpay.com/v1/transfers?recipient_settlement_id='+obj.settlementId+''
        request({
            uri:uri ,
            method: 'GET',
            headers: {
                    'Authorization' : 'Basic ' + auth,
                    "Content-type": "application/json"
            }
           
          }, function (err, response, body) { 
            console.log("response-----------" , response.body)
            console.log("body-----------" , body)
            if(!err ){
                var settlement = JSON.parse(response.body);
                if(settlement.items.length>0){
                    console.log("settlement", settlement)
                    LuckyDrawDynamic.findOne({status : 2 , 'transferObj.id' : settlement.items[0].id} , function(err , thisLuckyDraw){
                    var thisLuckyDrawDate = new Date();

                    async.each(settlement.items , function(item , call){
                        
                        Admin.findOne({ razorPayAccountId : obj.account_id}, {phoneNumber :1} , function(err , employee){
                            LuckyDrawDynamic.findOne({status : 2 , 'transferObj.id' : item.id} , function(err , lucky){
                                
                                if(lucky){
                                        LuckyDrawDynamic.update({ _id : lucky._id}, {status : 3, updatedAt : new Date()} , function(err , luckyDraw){
                                            let message = 'Congratulation! Your lucky draw of amount Rs '+(obj.amount/100)+' has been successfully transferred to your account from Be U. ';
                                            // Appointment.msg91Sms(employee.phoneNumber, message, function(e) {
                                            //     if(e)
                                            //         call();
                                            //     else
                                                    call();
                                            // });

                                        })
                                    
                                }else
                                    call();
                            })
                        })
                    }, function all(){
                        res.status(200);
                        res.send();    
                    })
                    
                  });
                }else {
                    res.status(200);
                    res.send();
                }
            } else {
                res.status(200);
                res.send();
            }
        })
    }else if(req.body.event == "payment.authorized"){

        var obj = { razorPaymentId: req.body.payload.payment.entity.id, amount: req.body.payload.payment.entity.amount, appointmentId: req.body.payload.payment.entity.notes.appointmentId }


        Appointment.findOne({ _id: obj.appointmentId }, { razorPayCaptureResponse: 1 , parlorId:1}, function(err, appt) {
            // Admin.findOne({parlorIds : appt.parlorId , role: 7} , {emailId :1}, function(err, owner){
               
                if (appt) {
                    if (!appt.razorPayCaptureResponse) {
                        AuthorizedPayment.create(obj, function(err, authCreated) {
                            if (!err) {
                                res.status(200);
                                res.send();
                            } else {

                                res.status(200);
                                res.send();
                            }
                        })
                    } else {
                        res.status(200);
                        res.send();
                    }
                } else {
                    res.status(200);
                    res.send();
                }
            })
        // })
    }else if(req.body.event == "invoice.paid"){
        console.log("event received")
        req.body.paymentId = req.body.payload.payment.entity.id
        SubscriptionSale.paymentLinkSubscription(req, function(obj){
        console.log("done")
            res.status(200);
            res.send();
        })
        // })
    }else if(req.body.event == "payout.processed"){
        let obj1 = {settlementId : req.body.payload.payout.entity.notes.settlementId}
        SettlementReport.findOne({ _id: obj1.settlementId }, { parlorId:1, period : 1}, function(err, sett) {
            if(sett){
                SettlementReport.update({_id : obj1.settlementId}, {transactionProcessedObj : req.body.payload}, function(erm, f){
                    let utrNumber = req.body.payload.payout.entity.utr
                    SettlementLedger.update({parlorId : sett.parlorId, "monthWiseDetail.period" : sett.period}, {$set : { 'monthWiseDetail.$.utrNumber': utrNumber, 'monthWiseDetail.$.moneySentTime' : new Date() } }, function(er,m){
                            res.status(200);
                            res.send();   
                    })
                })
            }else{
                res.status(200);
                res.send();
            }
        });
    }
    else {
        res.status(200);
        res.send();
    }
});


router.get('/createLuckyDraw' , function(req, res){
    Appointment.aggregate([{$match: {appointmentStartTime : {$gte :new Date(2018,8,1)} , status:3}},
            {$lookup :{from:"users" , localField : "client.id" , foreignField :"_id" , as : "user"}},
            {$project: { apptId : "$_id" ,_id: 0 ,subscriptionId :{$arrayElemAt :['$user.subscriptionId' ,0]}}},
            {$match :{subscriptionId :{$in: [1,2]}}}
        ], function(err , agg){
            console.log(agg.length)
            _.forEach(agg , function(a){
                console.log(a)
                LuckyDrawDynamic.onSubscription(a.apptId , a.subscriptionId);
            })
        })
});


router.get('/dealPriceEmpApp' , function( req , res){
    AllDeals.aggregate([
        {$match : {dealId : {$in : [12,1,36,13]}}},
                        {$unwind: '$services'},
                        {$lookup : {
                            from: "services" , 
                            localField :"services.serviceCode" , 
                            foreignField : "serviceCode" , 
                            as : "service"
                        }},
                        {$project : {
                            categoryId : {$arrayElemAt : ['$service.categoryId' ,0]} ,  
                            gender :{$arrayElemAt : ['$service.gender' ,0]},
                            name :{$arrayElemAt : ['$service.name' ,0]},
                            serviceCode :{$arrayElemAt : ['$service.serviceCode' ,0]},
                            subCategoryId :{$arrayElemAt : ['$service.subCategoryId' ,0]},
                        }},
                        {$lookup : {
                            from : 'servicecategories' , 
                            localField : "categoryId" , 
                            foreignField :'_id', 
                            as : 'category'
                        }},
                        {$project : {
                            categoryId : '$categoryId' , 
                            gender :'$gender',
                            name :'$name' ,
                            serviceCode :'$serviceCode',
                            // subCategoryId :'$subCategoryId',
                            categoryName :{$arrayElemAt : ['$category.name' , 0]} 
                        }},
                        {$lookup : {
                            from : 'subcategories' , 
                            localField : "subCategoryId" , 
                            foreignField :'_id', 
                            as : 'subCategory'
                        }},
                        {$group : {
                            _id: "$categoryId" , 
                            categoryName :{$first : "$categoryName"},  
                            services :{$push : {name: "$name", gender: "$gender", serviceCode: "$serviceCode" ,  subCategoryName : {$arrayElemAt : ['$subCategory.name',0]}} }
                        }
                    }
        ], function( err , deals) {
            console.log(deals.length)
            _.forEach(deals , function(d){
                console.log(d._id)
                if(d._id == "58707ed90901cc46c44af278"){
                    d.services =  _.chain(d.services)
                        .groupBy('subCategoryName')
                        .map(function(val, key) {
                            // console.log(val)
                            console.log(key)
                            return {
                                // subCategoryId: key,
                                subCategoryName: key,
                                services: val,
                               
                            };
                        })
                        .value(); 
                }
            })
                    return res.json(deals)
        })
});


router.get("/updatePofoArtistId", function(req, res) {
    Admin.find({}, { _id: 1 , phoneNumber :1}, function(err, employees) {
        var d = [];
        async.each(employees , function(emp , callback){

            Admin.updatePofoArtistId(emp.phoneNumber , function(data){
               
                    console.log("artistId" , data)
                    let profilePic = data.profilePic ? data.profilePic : "https://res.cloudinary.com/dyqcevdpm/image/upload/v1537437326/Profile-icon-9_ghpfvf.png"
                    Admin.update({ _id: emp._id }, { $set: { artistId: ObjectId(data._id) , myProfilePic : profilePic } }, function(err, updated) {
                        if (err) {
                        console.log(err)
                            callback();
                        } else {
                            callback();
                        }
                    });
                
                
            })
            
        }, function completedTask(){
            console.log('done')
            res.json('done');
        })
    });
})


router.post('/franchiseEnquiry' , function( req, res){
    FranchiseEnquiry.create({name: req.body.name , source : req.body.source, phoneNumber : req.body.phoneNumber, selectLocation : req.body.selectLocation, emailId : req.body.emailId, message : req.body.message, keyword : req.body.keyword, time : req.body.time} , function( err , created){
        if(created){
            var emailIds = ['shailendra@beusalons.com', 'vjohari@beusalons.com' , 'geetikasaluja@beusalons.com', 'rajnijajorea@beusalons.com', 'ashisharora@beusalons.com', 'alok@maxposuremedia.com']
            function sendEmail() {
                var transporter = nodemailer.createTransport('smtps://reports@beusalons.com:wx2t2Tr7pMrqnK2CIqwd3g@smtp.mandrillapp.com');
                var mailOptions = {
                    from: 'info@beusalons.com', // sender address
                    to: emailIds, // list of receivers
                    html: '<div>Hi, There is a new Franchise request on website. Name- <b>'+created.name+'</b>, Phonenumber- <b>'+created.phoneNumber+'</b>. <br>Location - '+created.selectLocation+'<br> Email ID-'+created.emailId+'<br> Message :'+         created.message+'<br> Source :'+created.source+'<br> Keyword :'+created.keyword+'<br> Time :'+created.time+'</div>',
                    subject: 'New Franchise Request on Website' // Subject line
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error)
                        console.log(error);
                    else
                        console.log('Message sent: ' + info.response);
                });
            }
            sendEmail();
            res.json(CreateObjService.response(false, "Query Submitted Successfully"));
        }else
            res.json(CreateObjService.response(true , "Oops! There is some error"));
    })
});



router.get('/getRazoyPayAccounts' , function(req, res) {
    Admin.find({active: true , parlorId: {$exists : true}} , {razorPayAccountId :1, firstName :1, lastName :1, parlorId:1 , accountNo :1, accountNumber :1, ifscCode :1, phoneNumber :1} , function(err , employees){
        var d = [];
        async.each(employees, function(emp , call){
            if(emp.parlorId){
                Parlor.findOne({_id: emp.parlorId , active: true} , {name: 1, address2 :1} , function(err , parlor){
                    if(parlor){
                        var arr = {
                            employeeId : emp._id,
                            employeeName : emp.firstName +' '+ emp.lastName,
                            parlor : parlor.name +'-'+ parlor.address2,
                            razorPayAccountId : emp.razorPayAccountId ? emp.razorPayAccountId : '',
                            accountNumber : emp.accountNumber,
                            otherAccountNumber : emp.accountNo,
                            ifscCode : emp.ifscCode,
                            phoneNumber : emp.phoneNumber,
                        }
                        d.push(arr);
                        call();
                    }else 
                        call();
                })
            }else call();
            
        }, function allTaskCompleted(){
            res.json(d);
        })
    })
})


router.get('/updateRazorPayId' , function(req, res){
    Admin.update({_id: req.query.employeeId} , {razorPayAccountId : req.query.razorPayAccountId} , function(err , update){
        if(!err)
            res.json(CreateObjService.response(false , 'Updated'));
        else
            res.json(CreateObjService.response(true , 'Error'));
    })
});


router.post('/updateCommentInAppointment' , function(req, res){
    Appointment.update({_id: req.body.appointmentId}, {cancelComment : req.body.comment} , function( err , update){
        if(!err)
            res.json(CreateObjService.response(false , 'Updated'));
        else
            res.json(CreateObjService.response(true , 'Error'));
    })
});

router.get('/deleteDupsInMark' , function(req, res){
    var d= [];
    MarketingUser.aggregate([
        {"$group" : { "_id": "$phoneNumber", "count": { "$sum": 1 } , updatedAt: {$push : '$updatedAt'} } },
        {"$match": {"_id" :{ "$ne" : null } , "count" : {"$gt": 1} } }, 
        ]
    ).exec(function(err , users){
        async.each(users , function(u, call){
            console.log( "updatedAt", u._id , u.updatedAt[0])
            MarketingUser.remove({phoneNumber : u._id , updatedAt : u.updatedAt[0]}, function( err , updated){
                d.push(updated)
                call();
            })
        } , function all(){
            console.log("done")
            res.json(CreateObjService.response(false , d.length));
        })
    })
});

router.get('/updateSettlementForNewCode' , function(req , res) {
    SettlementReport.find({period:  243 , amountCollectedTillDate: 0}, function(err , settlements) {
        async.each(settlements , function(set , call){
            Parlor.findOne({_id: set.parlorId} , {minimumGuarantee : 1} , function(err , mG){
                if(mG){
                    var updateField = (mG.minimumGuarantee / 31) * 16;
                    console.log(updateField)
                    SettlementReport.update({_id: set.id} , {amountCollectedTillDateBeforeDiscount : updateField} , function(err , setUpdated){
                        call();
                    })
                }else {
                    call();
                }
            })
        }, function allTaskCompleted(){
            res.json('done')
        })
    })
})



router.get('/copyDiscountStructure' , function(req, res){
    DiscountStructure.find({} , function(err , ds){
        async.each(ds , function(d, call){
           
            DiscountStructure.update({_id: d._id}, {newSlab : d.slabs} , function(err , update){
                call();
            })

        }, function all(){
            res.json('done')
        })
    })
})


router.get('/getApptsData' , function(req, res){

    Appointment.aggregate([ {$match : {status:3 , appointmentStartTime: {$gte: new Date(2018,9,1)}}}, 
                            {$group : {
                                _id: '$client.id' , 
                                parlors :{
                                    $push  : {
                                        parlorId :"$parlorId" , 
                                        apptId: "$_id",
                                        mode : "$mode" , 
                                        appointmentType : "$appointmentType", 
                                        latitude:"$latitude" , 
                                        longitude:"$longitude" , 
                                        paymentMethod:"$paymentMethod", 
                                        date :{ $dateToString: { format: "%Y-%m-%d", date: "$appointmentStartTime" } }, 
                                        revenue : {$sum : ["$serviceRevenue" , "$productRevenue"]}
                                    }
                                }
                            }},
                        {$unwind : "$parlors"},
                        {$group : {
                            _id: {
                                parlorId : "$parlors.parlorId" , 
                                clientId : "$_id"
                            } , 
                            appts :{
                                $push : {
                                    apptId: "$parlors.apptId" ,
                                    date : "$parlors.date" , 
                                    revenue : "$parlors.revenue" , 
                                    mode: "$parlors.mode" , 
                                    appointmentType: "$parlors.appointmentType", 
                                    latitude: "$parlors.latitude" , 
                                    longitude: "$parlors.longitude", 
                                    paymentMethod: "$parlors.paymentMethod"}
                                }
                            }
                        },
                        {$group : {
                            _id: "$_id.clientId" , 
                            parlors :{
                                $push : {
                                    parlorId: "$_id.parlorId",
                                    appts : "$appts"}
                                }
                            }
                        }              
                ] , function(err , agg){
                            var d = [];
                async.each(agg , function(ad , c){
                    var checkArray = [], data = [];
                    async.each(ad.parlors , function(parlor, cb){
                        var 
                            distanceRevenue = 0,
                            countOfPeople = 0,
                            days = 0,
                            distanceRevenueFirstTime = 0,
                            appRevenue = 0,
                            appRevenueFirstTime = 0, 
                            distanceRevenuelessThan100 = 0,
                            revenureFromNearBuy = 0;
                        var arr = {};

                        Parlor.findOne({_id: parlor.parlorId}, {geoLocation:1, avgRoyalityAmount:1, parlorLiveDate:1, name:1, address2:1}, function(err, parl){
                                _.forEach(parlor, function(a) {

                                    if ( a.appointmentType == 3 || a.couponCode || a.mode==5) {

                                            var distance = HelperService.getDistanceBtwCordinates1(parl.geoLocation[1], parl.geoLocation[0], a.latitude, a.longitude)

                                            if ((distance >= 0.05 && a.appointmentType == 3) || a.mode == 5 || a.couponCode) {
                                                distanceRevenue += a.serviceRevenue
                                                countOfPeople++;
                                                if (a.client.noOfAppointments == 0 || a.couponCode) distanceRevenueFirstTime += a.serviceRevenue
                                            } 
                                            else if ((distance < 0.05 && a.bookingMethod == 2)) {
                                                distanceRevenuelessThan100 += a.serviceRevenue
                                                countOfPeople++;
                                            }
                                            appRevenue += a.serviceRevenue;
                                            if (a.client.noOfAppointments == 0 || a.couponCode) appRevenueFirstTime += a.serviceRevenue;
                                            if(a.couponCode)revenureFromNearBuy += a.serviceRevenue;
                                        }

                                    var parlorLiveDifference;
                                    if (parl.parlorLiveDate) parlorLiveDifference = HelperService.getDaysBetweenTwoDates(parl.parlorLiveDate, new Date())
                                    else parlorLiveDifference = HelperService.getDaysBetweenTwoDates(distanceAppts[0].appointmentStartTime, new Date());
                                    if (parlorLiveDifference < 30) days = parlorLiveDifference;
                                    else days = 30;

                                    arr.salonName = parl.name + "-" + parl.address2;
                                    arr.distanceRevenue = distanceRevenue;
                                    // arr.totalRevenue = totalRevenue;
                                    arr.countOfPeople = countOfPeople;
                                    arr.distanceRevenueFirstTime = distanceRevenueFirstTime;
                                    arr.days = days;
                                    // arr.startDate = HelperService.getDayStart(req.body.startDate);
                                    // arr.endDate = HelperService.getDayEnd(req.body.endDate);
                                })
                                console.log(arr)
                            _.forEach(parlor.appts , function(a){
                                if(checkArray.indexOf(a.date)){
                                    checkArray.push(a.date);
                                    data.push({revenue : 0 , date : a.date , parlorId: parlor.parlorId});
                                }
                            })
                            cb();
                        });
                    }, function a1 (){
                            var mainData = []
                        if(data.length > 0){
                            _.forEach(data , function(d){
                                _.forEach(ad.parlors, function(parl){
                                    console.log(parl)
                                    _.forEach(parl.appts , function(ap){
                                        if(d.date == ap.date)
                                        {
                                            d.revenue += ap.revenue;
                                        }
                                    })
                                })
                             mainData.push(d)
                            })
                        }
                    d.push({clientId : ad._id , apptDate : mainData })
                        c();

                    })
                    
                }, function all(){
                    res.json(d)
                })
            })
});


router.get("/testMail" , function(req, res){
    function sendEmail() {
            var transporter = nodemailer.createTransport('smtps://info@beusalons.com:wx2t2Tr7pMrqnK2CIqwd3g@smtp.mandrillapp.com');
            var mailOptions = {
                from: 'info@beusalons.com', // sender address
                to: ['nikitachauhan@beusalons.com'], // list of receivers
                cc: ['bhriguraj@beusalons.com' , 'shailendra@beusalons.com'],
                text: 'hi test',
                subject: 'Hi', // Subject line
                // preserve_recipients : true

            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error){
                    console.log(error);
                    // call();
                    res.json("done")
                }
                else{
                    console.log('Message sent: ' + info.response);
                    // call();
                    res.json("done")
                }
            });
        }
        sendEmail();
});


router.get('/fetchRazorPayPayment', function(req, res){
    
    var instance = new Razorpay({
        key_id: RAZORPAY_KEY,
        key_secret: RAZORPAY_APP_SECRET
    })

    var razorPayId = req.query.razorpayId;

    instance.payments.fetch(razorPayId, function(error, response) {
        res.json(response)
    });
});



router.get('/fetchAccountDetails', function(req, res) {
    Admin.find({razorPayAccountId :{$exists : true}} , function(err , employees){
        var finalData = [];
        async.each(employees , function(emp, call){
            var Razorpay = require('razorpay');
                var auth = new Buffer(localVar.getRazorKey() + ':' + localVar.getRazorAppSecret()).toString('base64');
                    var uri='https://api.razorpay.com/v1/beta/accounts/'+emp.razorPayAccountId+''
                    request({
                        uri:uri ,
                        method: 'GET',
                        headers: {

                             'Authorization' : 'Basic ' + auth, 
                          
                          "Content-type": "application/json"
                        }
                        
                      }, function (err, response, body) {
                        console.log("reponse", response.body);
                        var data = JSON.parse(response.body);
                        finalData.push(data);
                        
                            call();
                      });
        }, function all(){
            res.json(finalData)
        })
    })       
});


router.get('/reverseTransfers', function(req, res) {
    LuckyDrawDynamic.find({status:2 , transferObj : {$exists : true} , createdAt : {$gte: new Date(2019,1,15),$lte: new Date(2019,1,15,23,59,59) }} , function(err , luckyDraw){
        var finalData = []
        var settlementData = [];
        var Razorpay = require('razorpay');
        var auth = new Buffer(localVar.getRazorKey() + ':' + localVar.getRazorAppSecret()).toString('base64');
        async.each(luckyDraw , function(emp, call){
            var uri='https://api.razorpay.com/v1/transfers/'+emp.transferObj.id+''
            request({
                uri:uri ,
                method: 'GET',
                headers: {

                     'Authorization' : 'Basic ' + auth, 
                  
                  "Content-type": "application/json"
                }
                
              }, function (err, response, body) {
                console.log("reponse", response.body);
                var data = JSON.parse(response.body);
                if(data.recipient_settlement_id != null){
                    call();
                }
                else{
                    finalData.push(data);
                    call();
                }
              });
        }, function all(){
            res.json(finalData)
           // async.each(finalData , function(fD , callback){
           //      LuckyDrawDynamic.update({ 'transferObj.id' : fD.id}, {status : 3}, function(err , updated){
           //          callback();
           //      })
           // }, function allDone(){
           //      res.json("done")
           // })
        })
    })       
});


// async.each(settlementData , function(fD , callback){
                

//                 var uri='https://api.razorpay.com/v1/transfers?recipient_settlement_id='+fD.recipient_settlement_id+''
//                     request({
//                         uri:uri ,
//                         method: 'GET',
//                         headers: {

//                              'Authorization' : 'Basic ' + auth, 
                          
//                           "Content-type": "application/json"
//                         }
                        
//                       }, function (err, response, body) {
//                         console.log("reponse", response.body);
//                         var data = JSON.parse(response.body);
//                         finalData.push(data);
                        
//                             callback();
//                       });
//             }, function allDone(){
//                     res.json(finalData)
//             })


router.get('/fetchTransferDetails', function(req, res) {
    LuckyDrawDynamic.find({transferObj :{$exists: true} , status : {$ne : 3}} , function(err , luckyDraws){
        console.log(luckyDraws.length)
        var finalData = [];
        
        async.each(luckyDraws , function(lucky, call){
             console.log(lucky.transferObj.id)
             var instance = new Razorpay({
                key_id: localVar.getRazorKey(),
                key_secret: localVar.getRazorAppSecret()
            });
               instance.transfers.fetch(lucky.transferObj.id, function(err, detail) {
                    console.log(err)
                    console.log(detail)
                    if(detail){
                      finalData.push(detail)
                        call();  
                    }
                        call();                    

                });
        }, function all(){
            res.json(finalData)
        })
    })       
});

router.get('/sendUnsetteledAmount' , function(req, res) {

    var Razorpay = require('razorpay');
   var RAZORPAY_KEY = localVar.getRazorKey();
    var RAZORPAY_APP_SECRET = localVar.getRazorAppSecret();
    var instance = new Razorpay({
        key_id: RAZORPAY_KEY,
        key_secret: RAZORPAY_APP_SECRET
    });

    var data = {};

       data.account = "acc_C9DswtQDfgeYd0"; //test
       data.amount = 1800 * 100; //test
      data.currency = "INR";
      console.log(data)
     
      instance.transfers.create(data, function(error, response) {
        if(response){
            res.json(response)
        }else{
            res.json(error)
        }
        
    });
})

router.get('/updateUserKey' , function(req, res){
var d = [];
    Parlor.find({}, { _id: 1, geoLocation: 1, parlorLiveDate: 1 }, function(err, parlors) {

        async.each(parlors, function(parl, call) {

            Appointment.aggregate([{$match : {status:3 , parlorId: ObjectId(parl._id) }} ,
                {$group:{_id: '$client.phoneNumber' , appointmentType:{$first : "$appointmentType"},bookingMethod:{$first : "$bookingMethod"}, latitude:{$first : "$latitude"}, 
                longitude: {$first : "$longitude"}, mode: {$first : "$mode"}, appBooking: {$first : "$appBooking"}, 
                appointmentStartTime: {$first : "$appointmentStartTime"}, client: {$first : "$client"}, couponCode: {$first : "$couponCode"}}}
            ], function(err , agg){
            console.log(agg)
            if(agg && agg.length > 0){
                async.each(agg, function(a , cb) {
                    var firstAppointmentSource = 0;

                    if(a.latitude == null)a.latitude = 0;
                    if(a.longitude == null)a.longitude = 0;
                    if ( a.appointmentType == 3 || a.couponCode || a.mode==5 || a.mode == 7 || a.mode == 9) {
                        var distance = HelperService.getDistanceBtwCordinates1(parl.geoLocation[1], parl.geoLocation[0], a.latitude, a.longitude)

                        if ((distance >= 0.05  && a.appointmentType == 3 && a.client.noOfAppointments == 0) || a.couponCode || a.mode == 5 || a.mode == 7 || a.mode == 9) {
                            firstAppointmentSource =1;
                        }
                    }
                    User.update({phoneNumber : a._id}, {firstAppointmentSource : firstAppointmentSource} , function(err , update){
                        d.push(update)
                        cb();
                    })

                }, function alll(){
                    call();
                })
            }
               else
                call();

            })

        }, function all(){
            return res.json( d.length)
        })
    })
})



router.post('/dialogFlowMessenger' , function(req, res){
    console.log("hiiiii" , req.body.queryResult.parameters)
    var text ="";
    if(req.body.queryResult.parameters == {}){
        text = "Where would you like to book the appointment?"
    }
    if(req.body.queryResult.parameters.booking == 'appointment'){
        text = "Where would you like to book the appointment?"
           
    }else{
        var m =req.body.queryResult.parameters["geo-city"]
        text = "Where in "+m+"?"
           
    }

    var obj = {
          "fulfillmentText": "string",
          "fulfillmentMessages": [
            {
              "text" :{"text" : [text]}
            }
          ],"payload": { "attachment":{
              "type":"template",
              "payload":{
                "template_type":"button",
                "text":"Select Gender",
                "buttons":[
                    {
                      "type": "postback",
                      "title": "Female",
                      "payload": "2_1"
                    },
                    {
                      "type": "postback",
                      "title": "Male",
                      "payload": "2_2"
                    }
                    
                ]
              }
            }
        }
         
        }
    // if(req.body.queryResult.action == 'city'){
    //     console.log("done")
    // }
    // if(req.body.queryResult.action == 'phoneNumber'){
    //     console.log("done")
    // }
    // if(req.body.queryResult.action == 'appointment'){
    //     console.log("done")
    // }
    
    console.log(obj)
    return res.json(obj);
    // res.sendStatus(200);
});



router.get('/getDataUser' , function( req, res){

    User.aggregate([{$match : {subscriptionId: {$nin: [1,2]}, $or: [{$and: [{emailId: {$exists: true}},{emailId: {$ne: null}} ,{emailId: {$ne: ""}}]} , {facebookId: {$exists : true}}]} },{$limit : 10000},{$project : {phoneNumber : 1, gender:1, firstName:1 , emailId:1}}], function(err , users){
        console.log(err)
        res.json(users);
    });
});



router.get('/updateSkinCoServices' , function(req, res){
    Parlor.findOne({_id: ObjectId("5a4b44b736669b1eb672900e")}, function(err , refParlor){
            var pushService = [];
            console.log(refParlor.services.length)
        async.each(refParlor.services , function(ser , call){

            if(ser.serviceCode == 775 || ser.serviceCode == 776 || ser.serviceCode == 777 || ser.serviceCode == 778 || ser.serviceCode == 779 || ser.serviceCode == 780 || ser.serviceCode == 781 || ser.serviceCode == 782 || ser.serviceCode == 783 || ser.serviceCode == 784 || ser.serviceCode == 785 || ser.serviceCode == 786 || ser.serviceCode == 787 || ser.serviceCode == 788 || ser.serviceCode == 789 || ser.serviceCode == 790 || ser.serviceCode == 791 || ser.serviceCode == 792 || ser.serviceCode == 694 || ser.serviceCode == 699 || ser.serviceCode == 704 || ser.serviceCode == 709 || ser.serviceCode == 724 || ser.serviceCode == 729  ){
                console.log("aay")
                _.forEach(ser.prices , function(pr){
                    pr.employees =[];
                })
                pushService.push(ser);
                call();
            }else
                call();
        }, function all(){
            // Parlor.updateMany({parlorType: 2 }, {$push : {services : {$each : pushService}}} , function(err , parlUpdate){

                res.json(pushService)
            // })
        })

    })
});



router.get('/hairServiceClients' , function(req, res){
    Appointment.aggregate([{$match :{ status:3 , appointmentStartTime: {$gte: new Date(2018,0,1)},'client.noOfAppointments' :0,
                    $and :[{$or :[{appointmentType : 3},{couponCode : {$exists : true}},{mode:5},{mode : 7},{mode : 9}]}, 
                    {'services.serviceCode' :{$in : [90, 96]}}]}
                },
                {$group : {_id: null, phoneNumber : {$push : "$client.phoneNumber"}}}
                 ], function(err , beuClient){
                    var d = [];
           async.each(beuClient[0].phoneNumber , function(ph , cb){

                Appointment.find({'client.phoneNumber' : ph, status:3}, {'services.name':1, client:1 }, function(err ,appts){
                    if(appts && appts.length>1){
                        var arr = {services : appts[1].services , client : appts[1].client.name, phoneNumber : appts[1].client.phoneNumber}
                        d.push(arr)
                        cb();
                    }else
                        cb();
                })
           }, function all(){

                res.json(d)
           })
        })
})



router.get('/getNonRepeatingClientsData' , function(req , res){
    var getThreeMonthBefore = HelperService.getLastThreeMonthStartFromDate(new Date());
    Parlor.findOne({_id: req.query.parlorId}, {parlorLiveDate :1} , function(err , parlor){

    })
})

router.get('/gk2Clients' , function(req, res){
    Appointment.aggregate([{$match : {status: 3, parlorId: ObjectId("5bf8f48f40fdce4d68d83771") }},
        {$project : {client:1}},
    ], function(err , agg){
        var d = [];
        async.each(agg , function(a, cb){
            Appointment.find({'client.phoneNumber' : a.client.phoneNumber , status:3, parlorId :{$ne : ObjectId("5bf8f48f40fdce4d68d83771")}},{client:1, parlorName:1} , function(err, appts){
                if(appts.length >0){
                    d.push(appts)
                    cb();
                }else cb();
            })
        }, function all(){
            res.json(d)
        })
    })
})


// router.get('/changeKeraToSpa' , function(req, res){
//     Parlor.findOne({_id : "5c063348b0fb9e4f4dec97e5"}, {services:1} , function(err, parlor){
//         _.forEach(parlor.services , function(ser){
//             if(ser.categoryId + ""== "5bff9e6b116e4549543aac40"){
//                 ser.categoryId = ObjectId("58707ed90901cc46c44af27c")
//             }
//         })
//         Parlor.update({_id: "5c063348b0fb9e4f4dec97e5"}, {services: parlor.services}, function(err, update){
//             res.json('done')
//         })
//     })
// })


router.get('/getNonRenewalSubscribers' , function(req, res){
    var parlorId  = req.query.parlorId;
    
})

router.get('/changeCouponParlor',(req,res)=>{
    User.findOne({phoneNumber:req.query.phoneNumber},{couponCodeHistory:1},(err,user)=>{
        console.log(user)
        user.couponCodeHistory.forEach((c)=>{
            c.parlorId = null
            console.log(c.parlorId)
        })
        user.save()
        console.log(user)
        res.send('done')
    })
})

router.get('/epayAppointments',(req,res)=>{
    Appointment.find({couponCode:'EPAY50',status:{$in:[1,3]}},{'client.name':1,'client.phoneNumber':1,'payableAmount':1,'status':1,appointmentStartTime:1,createdAt:1},(err,appointments)=>{
        if(err)console.log(err)
        res.json(appointments)
    })
})


module.exports = router;
