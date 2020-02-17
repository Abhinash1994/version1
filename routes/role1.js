'use strict'

var express = require('express');
var router = express.Router();

var multer = require('multer');
var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");
var async = require('async');
var ObjectId = require('mongodb').ObjectID;
var multer = require('multer');
var fs = require('fs');
var request = require('request');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var fse = require('fs-extra');
var PAYTM_MERCHANT_MID = 'GinSwa65124226602132';  //GINGER09142314726636 - GinSwa65124226602132
var PAYTM_MERCHANT_KEY = 'YxIwf0X&_nsXCR8O';  //n@ahY8JjRettBK@m - YxIwf0X&_nsXCR8O
var PAYTM_INDUSTRY_TYPE = 'Retail109';  //Retail - Retail109
var googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyAgyedh9I6sAbA77mAeGmXqNGNQxmqrfJk'
});



var storage = multer.diskStorage({ //multers disk storage settings
    destination: function(req, file, cb) {
        cb(null, '../uploads/')
    },
    filename: function(req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
    }
});
var upload = multer({ //multer settings
    storage: storage,
    fileFilter: function(req, file, callback) { //file filter
        if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length - 1]) === -1) {
            return callback(new Error('Wrong extension type'));
        }
        callback(null, true);
    }
}).single('file');


var updateServicesTaken = (userId, cb) => {
    Appointment.aggregate([
        { $match: { "client.id": ObjectId(userId), status: 3 } },
        { $unwind: "$services" },
        { $group: { "_id": { serviceId: "$services" }, lastAppointmentDate: { $last: "$appointmentStartTime" }, count: { $sum: 1 } } 
        }
    ], (err, services) => {
        if (err) {
            cb(1, null);
        } else {
            cb(null, services);
        }
    })
}

router.get('/updatemkusers',(req,res)=>{
    console.log('hiiiiiii')
    //console.log(localVar.getInstanceId())
//if (localVar.isServer() && localVar.getInstanceId() == 1) {
        var counter = 0;
        var premiumCustomer = false,
            maximumBill = 0,
            totalRevenue = 0;
        let d = new Date();
        let date = d.getDate();
        let month = d.getMonth();
        let year = d.getFullYear();
        let daysToGoBack = 1;
        let tdo = new Date(year, month, date - daysToGoBack);
        Appointment.aggregate([
            { $match: { "appointmentStartTime": { $gt: new Date(tdo.getFullYear(), tdo.getMonth(), tdo.getDate()), $lt: new Date(tdo.getFullYear(), tdo.getMonth(), tdo.getDate(), 23, 59, 59) }, status: 3 } },
            // { $match: { "appointmentStartTime": { $gte: new Date(2018,9,1), $lte: new Date(2018,11,31,23,59,59)}, status: 3 } },
            // { $match: { status: 3 , _id: ObjectId("5b9e3c3a987b255fa8275dfa")} },
            { $sort: { appointmentStartTime: 1 } },
            {
                $group: {
                    "_id": "$client.id",
                    appointmentCount: { $sum: 1 },
                    lastAppointmentDate: { $last: "$appointmentStartTime" },
                    lastParlor: { $last: "$parlorName" },
                    lastParlorId: { $last: "$parlorId" },
                    payableAmount: { $first: '$payableAmount' },
                    bill: { $first: '$subtotal' },
                    serviceRevenue: { $first: '$serviceRevenue' },
                    productRevenue: { $first: '$productRevenue' }
                }
            },
            {$limit: 2},
            { $project: { clientId: "$_id", "_id": 0, appointmentCount: 1, lastAppointmentDate: 1, lastParlor: 1, lastParlorId: 1, payableAmount: 1, bill: 1, totalRevenue: { $add: ['$serviceRevenue', '$productRevenue'] }, services: 1 } }
        ], (err, apps) => {
            console.log("came data");
            console.log(apps.length);

            if (err) {
                console.log('{message:"Server Error."}');
            } else {
                async.each(apps, (client, cb) => {
                    console.log(client)
                    MarketingUserNew.findOne({ userId: client.clientId }, { "userId": 1, updatedAt: 1, "_id": 0, marketingCategories: 1, premiumCustomer: 1, maximumBill: 1, totalRevenue: 1, appointmentCount: 1, latitude: 1, longitude: 1, cityId: 1 }, (err, user) => {
                        //console.log("user" , user)
                        if (err) {
                            counter++;
                            console.log(counter);
                            cb();
                        } else if (user) {
                            console.log("else if working")
                            var marketingCategories = user.marketingCategories == undefined ? [] : user.marketingCategories;
                            var servicesTaken = user.servicesTaken == undefined ? [] : user.servicesTaken;
                            console.log(client) 
                            console.log('1111111')

                                if (client.payableAmount > 3000 || user.appointmentCount > 3) premiumCustomer = true;

                                if (client.bill > user.maximumBill) user.maximumBill = client.bill;

                                if (user.totalRevenue) user.totalRevenue = client.totalRevenue + user.totalRevenue;

                                if (user.latitude != 0 && user.longitude != 0) user.cityId = ConstantService.getCityId(user.latitude, user.longitude);

                                // updateServicesTaken(client.clientId, (err,serviceArray)=>{
                                //     servicetaken = serviceArray
                                //     console.log(serviceArray)
                                // })

                                var setValues = {
                                    marketingCategories: marketingCategories,
                                    servicesTaken: servicesTaken,
                                    appointmentCount: client.appointmentCount + user.appointmentCount,
                                    lastAppointmentDate: client.lastAppointmentDate,
                                    lastParlor: client.lastParlor,
                                    lastParlorId: client.lastParlorId,
                                    premiumCustomer: premiumCustomer,
                                    maximumBill: user.maximumBill,
                                    totalRevenue: user.totalRevenue,
                                    cityId: user.cityId,
                                    latitude: user.latitude,
                                    longitude: user.longitude,
                                    subscriptionId: (user.subscriptionId == undefined) ? 0 : user.subscriptionId,
                                    androidVersion: user.androidVersion,
                                    iosVersion: user.iosVersion
                                };

                                console.log("setValues" , setValues)
                                console.log("userId" , client.clientId)

                                MarketingUserNew.update({ "userId": client.clientId },  setValues , (err, updated) => {
                                    if (err) {
                                        // console.log(err)
                                        console.log("update failed", err);
                                        counter++;
                                        console.log(counter);
                                        cb();
                                    } else {
                                        console.log("updated" , updated);
                                        counter++;
                                        console.log(counter);
                                        cb();
                                    }
                                })

                        } else {
                            console.log("else")
                            var marketingCategories = [];
                            var servicesTaken = [];
                            updateServicesTaken(client.clientId, (err, servicesArray) => {

                                if (!err) {
                                    servicesTaken = servicesArray;
                                   // marketingCategories = 
                                }
                                if (client.payableAmount > 3000) premiumCustomer = true;

                                User.findOne({ "_id": client.clientId }, { firstName: 1, lastName: 1, emailId: 1, iosVersion: 1, androidVersion: 1, subscriptionId: 1, phoneNumber: 1, gender: 1, loyalityPoints: 1, latitude: 1, longitude: 1, firebaseId: 1, firebaseIdIOS: 1 }, function(err, newUserDetails) {

                                    var userDetails = {
                                        "userId": client.clientId,
                                        "firstName": newUserDetails.firstName == undefined ? "" : newUserDetails.firstName,
                                        "lastName": newUserDetails.lastName == undefined ? "" : newUserDetails.lastName,
                                        "emailId": newUserDetails.emailId == undefined ? "" : newUserDetails.emailId,
                                        "phoneNumber": newUserDetails.phoneNumber == undefined ? "" : newUserDetails.phoneNumber,
                                        "lastAppointmentDate": client.lastAppointmentDate,
                                        "lastParlor": client.lastParlor,
                                        "lastParlorId": client.lastParlorId,
                                        "appointmentCount": client.appointmentCount,
                                        "gender": ((newUserDetails.gender).trim() === "" || newUserDetails.gender == undefined) ? "M" : newUserDetails.gender,
                                        "loyalityPoints": newUserDetails.loyalityPoints == undefined ? "" : newUserDetails.loyalityPoints,
                                        "latitude": newUserDetails.latitude,
                                        "longitude": newUserDetails.longitude,
                                        "firebaseId": newUserDetails.firebaseId,
                                        "firebaseIdIOS": newUserDetails.firebaseIdIOS,
                                        "iosVersion": newUserDetails.iosVersion,
                                        "subscriptionId": newUserDetails.subscriptionId == undefined ? 0 : newUserDetails.subscriptionId,
                                        "androidVersion": newUserDetails.androidVersion,
                                        "marketingCategories": marketingCategories,
                                        "servicesTaken": servicesTaken,
                                        'premiumCustomer': premiumCustomer,
                                        'maximumBill': client.bill,
                                        'totalRevenue': client.totalRevenue,
                                        'cityId': (newUserDetails.latitude != 0 && newUserDetails.longitude != 0) ? ConstantService.getCityId(newUserDetails.latitude, newUserDetails.longitude) : 1
                                    }

                                    MarketingUserNew.create(userDetails, (err, created) => {
                                        if (err) {
                                            console.log("creation failed");
                                            counter++;
                                            console.log(counter);
                                            cb();
                                        } else {
                                            console.log("created");
                                            counter++;
                                            console.log(counter);
                                            cb();
                                        }
                                    })
                                })
                            })
                            
                        }
                    })
                
                }, () => {
                    console.log("All done.");
                })
            }
        }) 
})

router.get('/generateReport', function(req, res) {

    //for all active salons


    Parlor.createSettlementReportv2(new Date(2019, 6,19 ), new Date(2019, 6,21, 23, 59, 59), 371, {active : true},  function(err, data) {

    //for single salon
    // Parlor.createSettlementReportv2(new Date(2019, 3, 19), new Date(2019, 3, 21, 23, 59, 59), 331, {_id: "5ca5fd67071bfe13d1169afb"},  function(err, data) {

    //for inactive salons
    // Parlor.createSettlementReportv2(new Date(2019, 1, 8), new Date(2019, 1, 10, 23, 59, 59), 301, {active: false , _id:{$in :["5954cfdcbb6e1a7dae60feb6" , "5c1b4cdf0674230e0c4a556f" , "5b936a4e20b1d65776812110" , "5b9616be20b1d657768131b2"]}},  function(err, data) {

        res.json(data);
    });
});


router.get('/generateReportApi', function(req, res) {
    let startDate = HelperServices.getDayStart(req.body.startDate)
    let endDate = HelperServices.getDayEnd(req.body.endDate)
    let period = req.body.period
    //for all active salons
    let query = {}
    if(req.body.parlorIds)query.parlorId = {_id : {$in : req.body.parlorIds}}
            res.json(CreateObjService.response(false, 'Done'))
    /*SettlementReport.findOne(query, {period : 1}).sort({period : -1}).exec(function(er, s){
        if(s.period + 1 == period){
            if(req.body.parlorIds){
                Parlor.createSettlementReportv2(startDate, endDate, period, {_id: {$in : req.body.parlorIds}},  function(err, data) {
                    res.json(CreateObjService.response(false, 'done'))
                })
            }else{
                Parlor.createSettlementReportv2(startDate, endDate, period, {active:true},  function(err, data) {
                    res.json(CreateObjService.response(false, 'don'))
                })
            }    
        }else{
            res.json(CreateObjService.response(true, 'Invalid Period'))
        }
        
    })*/
});

router.post('/deleteGenerateReportApi', function(req, res) {
    let period = req.body.period
    let query = {period : period};
    if(req.body.parlorIds)query.parlorId = {_id : {$in : req.body.parlorIds}}
                    res.json(CreateObjService.response(false, 'Done'))
    /*SettlementReport.findOne(query, {period : 1}).sort({period : -1}).exec(function(er, s){
        if(s.period + 1 == period){
            SettlementReport.find(query, {startDate : 1, parlorId : 1}, function(err, settlements) {
                Async.each(settlements, function(s, callback){
                         SettlementReport.remove({ _id: s.id }, function(err, data) {
                SettlementLedger.update({period : period , parlorId : s.parlorId} , {$pull : {monthWiseDetail : {period : period}}}, function(err , ledgerUpdate){
                        if(ledgerUpdate){
                            SettlementLedger.findOne({parlorId : s.parlorId , period : period} , function(err , ledger){
                                var ledgerTotalRecoverable = ledger.monthWiseDetail[ledger.monthWiseDetail.length-1].moreAmountToBeAdjusted
                                var ledgerCurrentDue = ledger.monthWiseDetail[ledger.monthWiseDetail.length-1].moreAmountToBeAdjusted

                                SettlementLedger.update({_id: ledger._id} , {totalRecoverable : ledgerTotalRecoverable , currentDue : ledgerCurrentDue , period : period-1}, function(err , updateLedger){ 
                                    callback()
                                   
                                })
                            })
                        }
                    })
                });
            }, function allDone(){
                    res.json(CreateObjService.response(false, 'Done'))
                })
            });
        }else{
            res.json(CreateObjService.response(true, 'Invalid period'))
        }
    });*/
});
 

router.get('/generateSettlementInactiveSalon', function(req, res) {

    var startDate = req.body.startDate, endDate = req.body.endDate, period = req.body.period, parlorId = req.body.parlorId;
    Parlor.createSettlementReportv2(HelperServices.getDayStart(startDate), HelperServices.getDayEnd(endDate), period, {_id : parlorId}, function(err, data) {

        res.json(data);
    });
});

router.get('/getUserDetail', function(req, res){
    User.findOne({phoneNumber : req.query.phoneNumber}, {activeMembership : 1, firstName : 1, gender : 1, subscriptionValidity: 1}, function(er, user){
        let memberships = _.map(user.activeMembership, function(c){
            return {
                creditsLeft : c.creditsLeft,
                name : c.name,
                validTo : c.validTo,
                membershipSaleId : c.membershipSaleId,
                id : c.id,
            }
        });
        return res.json(CreateObjService.response(false, {memberships : memberships, subscriptionValidity : user.subscriptionValidity, firstName : user.firstName, gender : user.gender}));
    })
})

router.post('/updateUserDetail', function(req, res){
    let obj = {firstName : req.body.firstName, gender : req.body.gender};
    if(req.body.subscriptionValidity && req.body.subscriptionValidity < 14){
        obj.subscriptionValidity = req.body.subscriptionValidity;
    }
    User.update({phoneNumber : req.body.phoneNumber}, obj, function(er, user){
        return res.json(CreateObjService.response(false, 'Done'));
    })
})

router.post('/updateMembership', function(req, res){
    User.findOne({phoneNumber : req.body.phoneNumber}, {activeMembership : 1}, function(er, user){
        if(req.body.creditsLeft != 0){
            _.forEach(user.activeMembership, function(m){
                if(m.id == req.body.id){
                    m.creditsLeft = req.body.creditsLeft;
                }
            })    
        }else{
            user.activeMembership = _.filter(user.activeMembership, function(a){ return a.id + "" != req.body.id});
        }
        User.update({phoneNumber : req.body.phoneNumber}, {activeMembership : user.activeMembership}, function(er, s){
            return res.json(CreateObjService.response(false, 'Done'));
        })
    })
})

router.post('/websiteAppointments', function(req, res){
    var startDate = req.body.startDate;
    var endDate = req.body.endDate;
    var query = { mode : 9, status : {$in : [1,3]} };
    var startTime = new Date(startDate);
    var endTime = new Date(endDate);
    query.createdAt = { $gt: startTime, $lt: endTime };
    Appointment.find(query).sort({ createdAt: -1 }).exec(function(err, data) {
        if (err) return res.json(CreateObjService.response(true, 'Error in getting previous appointments'));
        else return res.json(CreateObjService.response(false, Appointment.parseArray2(data, 18)));
    });
});

router.post('/deleteMembership', function(req, res){
    User.findOne({phoneNumber : req.body.phoneNumber}, {activeMembership : 1}, function(er, user){
        user.activeMembership = _.filter(user.activeMembership, function(a){ return a.id + "" != req.body.id});
        User.update({phoneNumber : req.body.phoneNumber}, {activeMembership : user.activeMembership}, function(er, s){
            MembershipSale.remove({_id : req.body.membershipSaleId}, function(er, f){
                return res.json(CreateObjService.response(false, 'Done'));
            })
        })
    })
});

router.get("/salonKpiForApp", function(req, res){
    var parlorIds = JSON.parse(req.query.parlorIds);
    var report =  [];
    Async.forEach(parlorIds, function(parlorId, callback) {
        Parlor.getReportForApp(ObjectId(parlorId), function(data){
            report.push(data);
            callback();
        });
    }, function allTaskCompleted() {
        return res.json(CreateObjService.response(false, report));
    });
});

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    if ((req.session.authenticated && req.session.role == 1) || req.session.userTypeBeu == '1') next();
    else return res.sendStatus(403);
});


router.post('/createSalesParlor', function(req, res) {
    SalesParlor.create(SalesParlor.getParlorObj(req), function(err, sp) {
        console.log(err)
        return res.json(CreateObjService.response(false, 'Created'));
    });
});

router.post('/createMultipleSalesParlor', function(req, res) {
    SalesParlor.create(req.body.salons, function(err, sp) {
        return res.json(CreateObjService.response(false, 'Created'));
    });
});

router.put('/createSalesParlor', function(req, res) {
    SalesParlor.update({ _id: req.body.parlorId }, SalesParlor.getParlorObj(req), function(err, sp) {
        return res.json(CreateObjService.response(false, 'Created'));
    });
});

router.get('/salsePerson', function(req, res) { 
    Beu.find({ role: 4 }, { firstName: 1, lastName: 1 }, function(err, data) {
        return res.json(CreateObjService.response(false, data));
    });
});
// db.getCollection('users').find({phoneNumber : "9716640147"})
router.get('/checkInCheckOutByDate', function(req, res) {
    var date =  req.query.date ? new Date(req.query.date) : new Date();
    console.log(date)
    SalonCheckin.checkInCheckOutByDate(date, function(data){
        return res.json(CreateObjService.response(false, data));
    });
});

router.get('/salesParlors', function(req, res) {
    var page = req.query.page || 1;
    var perPage = parseInt(req.query.count);
    var query = {};
    if(req.query.filter){
        if(req.query.filter.city){
            query.city = {$regex : decodeURI(req.query.filter.city), $options : 'i' }
        }
        if(req.query.filter.zone){
            query.zone = {$regex : decodeURI(req.query.filter.zone), $options : 'i' }
        }
        if(req.query.filter.locality){
            query.locality = {$regex : decodeURI(req.query.filter.locality) , $options : 'i'}
        }
        if(req.query.filter.name){
            query.name = {$regex : decodeURI(req.query.filter.name), $options : 'i' }
        } 
        if(req.query.filter.currentStatus){
            query.currentStatus = {$regex : decodeURI(req.query.filter.currentStatus), $options : 'i' }
        }       
    }
    console.log(query)
    SalesParlor.count(query, function(erm, count){
        let inlineCount = count
        SalesParlor.find(query).sort({ createdAt: -1 }).limit(perPage).skip(perPage * (page - 1)).exec(function(err, data) {
            return res.json(CreateObjService.response(false, {results : data, inlineCount : inlineCount}));
        });    
    })
});

router.get('/saleParlor', function(req, res) {
    SalesParlor.findOne({ parlorId: req.query.parlorId }, function(err, data) {
        return res.json(CreateObjService.response(false, data));
    });
});

router.get('/salesTicketByParlor', function(req, res) {
    SalesTicket.find({ parlorId: req.query.parlorId }).sort({ createdAt: -1 }).exec(function(err, data) {
        return res.json(CreateObjService.response(false, data));
    });
});

router.post('/salesTicketByParlor', function(req, res) {
    SalesTicket.create(SalesTicket.getNewTicket(req), function(err, sp) {
        console.log(err)
        return res.json(CreateObjService.response(false, 'Created'));
    });
});

router.post('/owner', function(req, res) {
    var user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        emailId: req.body.emailId,
        phoneNumber: req.body.phoneNumber,
        password: req.body.password,
        gender: req.body.gender
    };
    user.role = 7;
    Admin.create(user, function(err, newUser) {
        if (err) {
            console.log(err);
            return res.json(CreateObjService.response(true, 'Error in creating owner'));
        } else
            return res.json(CreateObjService.response(false, Admin.parse(newUser)));
    });
});

router.get('/deals', function(req, res) {
    AllDeals.find({}).exec(function(err, deals) {
        return res.json(CreateObjService.response(false, _.map(deals, function(d) {
            return Deals.parseForCrm(d)
        })));
    });
});

router.get('/updateDealPriceByP1P2', function(req, res) {
    let priceType = req.body.priceType || 1;
    Parlor.findOne({_id : req.body.parlorId}, {tax : 1, cityId : 1, parlorType : 1}, function(er, parlor){
        Deals.find({categoryIds : req.body.categoryId, genders : req.body.gender}, {dealId : 1}, function(er, deals){
            Async.each(deals, function(d, callback) {
                SalonMasterMenu.find({parlorType : parlor.parlorType, dealId : d.dealId}, function(err, sm){
                    let price =  parlor.cityId == 1 ? sm.cityId1["p"+priceType]  : sm.cityId2["p"+priceType];
                    Deal.update({_id : d.id}, {dealPrice : price, "dealType.price" : price}, function(er, f){
                        callback()
                    })
                })
            }, function allTaskCompleted(){
                ServiceCategory.findOne({_id :req.body.categoryId}, {name : 1}, function(err, category){
                    var present = false;
                    _.forEach(parlor.p1p2, function(p){
                        if(p.categoryId + "" == req.body.categoryId){
                            present = true;
                            if(req.body.gender == "M")p.male = priceType
                            if(req.body.gender == "F")p.female = priceType
                        }
                    })
                    if(!present){
                        parlor.p1p2.push({
                            categoryId : category.id,
                            categoryName : category.name,
                            male : priceType,
                            female : priceType
                        })
                    }
                    Parlor.update({_id : parlor.id}, {p1p2 : parlor.p1p2}, function(er, f){
                      res.json('done')
                    })
                })
            })
        })
    })
});

router.get('/getP1P2', function(req, res) {
    ServiceCategory.find({}, {name : 1}, function(err, categories){
        Parlor.findOne({_id : req.query.parlorId}, {p1p2 : 1}, function(er, parlor){
            _.forEach(categories, function(c){
                var p = _.filter(parlor.p1p2, function(p){return p.categoryId + "" == c.id + ""})[0]
                if(!p){
                    parlor.p1p2.push({
                        categoryId : c.id,
                        categoryName : c.name,
                        male : 0,
                        female : 0
                    })
                }
            })
            return res.json(CreateObjService.response(false, parlor.p1p2));
        })
    })
});

router.get('/updateDeals', function(req, res) {
    //parlorId, dealsCopyFrom, callback
    createDeals("5c236251c3f2cf6c82c8bfb7", "5c11108c21b2f86fd95ad281", function(s) {
        console.log("done");
        res.json('done');
    });
});

/*router.post('/marketing/target', function(req, res){
 User.aggregate([
 $match : {''}
 ]).exec(function(err, results){
 return res.json(results);
 });
 });
 */

router.post('/createSubCategory', function(req, res) {
    SubCategory.create(SubCategory.newSubCategory(req), function(err, subCat) {
        if (subCat)
            return res.json(CreateObjService.response(false, 'Successfully Created'));
        else
            return res.json(CreateObjService.response(true, 'There is some error'));
    })
});

// router.post('/getSubCategory',function(req,res){
//     SubCategory.subCategoryByCategoryId(req, function(err, subCat){
//         return res.json({error : false, data : subCat});
//     });
// })


router.get('/chapters', function(req, res) {
    Chapter.find({}, function(err, chapters) {
        return res.json(CreateObjService.response(false, _.map(chapters, function(c) { return { name: c.name, chapterId: c.id } })));
    });
});


router.get('/chapterTabs', function(req, res) {
    ChapterTab.find({ chapterId: req.query.chapterId }, function(err, chapterTabs) {
        return res.json(CreateObjService.response(false, _.map(chapterTabs, function(c) { return { title: c.title, tabId: c.id } })));
    });
});

router.get('/tabContent', function(req, res) {
    ChapterTab.findOne({ _id: req.query.tabId }, function(err, chapterTab) {
        return res.json(CreateObjService.response(false, { content: chapterTab.content, title: chapterTab.title }));
    });
});

router.put('/tabContent', function(req, res) {
    ChapterTab.update({ _id: req.body.tabId }, { content: req.body.content }, function(err, chapterTab) {
        return res.json(CreateObjService.response(false, 'Success'));
    });
});

router.post('/chapterTab', function(req, res) {
    Chapter.findOne({ _id: req.body.chapterId }, function(err, chapter) {
        var obj = {
            chapterName: chapter.name,
            chapterId: chapter.id,
            title: req.body.title,
        };
        ChapterTab.create(obj, function(err, done) {
            return res.json(CreateObjService.response(false, 'Successfully Created'));
        });
    });

});


router.post('/getSubCategory', function(req, res) {
    SubCategory.find({}, function(err, subCat) {
        return res.json({ error: false, data: subCat });
    });
})

router.post('/membership', function(req, res) {
    ServiceCategory.find({}, function(err, categories) {
        Membership.create(Membership.createNewMembership(req, categories), function(err, newM) {
            if (err) {
                console.log(err);
                return res.json(CreateObjService.response(true, 'Error in creating membership'));
            } else
                return res.json(CreateObjService.response(false, Membership.parse(newM)));
        });
    });

});

router.post('/serviceProduct', function(req, res) {
    ServiceProduct.create({ name: req.body.name }, function(err, product) {
        return res.json(CreateObjService.response(false, 'Created'));
    });
});

router.get('/serviceProduct', function(req, res) {
    ServiceProduct.find({}, function(err, products) {
        return res.json(CreateObjService.response(false, {
            products: _.map(products, function(p) {
                return { name: p.name, productId: p.id }
            })
        }));
    });
});

router.post('/serviceBrand', function(req, res) {
    ServiceBrand.create({ name: req.body.name }, function(err, product) {
        return res.json(CreateObjService.response(false, 'Created'));
    });
});

router.get('/serviceBrand', function(req, res) {
    ServiceBrand.find({}, function(err, brands) {
        return res.json(CreateObjService.response(false, {
            brands: _.map(brands, function(p) {
                return { name: p.name, brandId: p.id }
            })
        }));
    });
});

router.get('/periods', function(req, res) {
    SettlementReport.aggregate({ "$project": { id: 1, startDate: 1, endDate: 1, period: 1 } }, {
        $group: {
            '_id': '$period',
            'startDate': { $first: '$startDate' },
            'endDate': { $first: '$endDate' },
            'period': { $first: '$period' },
        }
    }, { $sort: { period: -1 } }, { $limit: 150 }).exec(function(err, data) {
        data = _.map(data, function(d) {
            return {
                value: d.period,
                startDate : d.startDate,
                endDate : d.endDate,
                date: new Date(d.startDate.getTime() + 1000 * 60 * 5).toString().slice(0, 10) + " - " + d.endDate.toString().slice(0, 10)
            };
        });
        return res.json(CreateObjService.response(false, data));
    });
});


router.get('/settlementReport', function(req, res) {
    SettlementReport.findOne({
        parlorId: req.query.parlorId,
        period: req.query.period
    }).sort({ period: 1 }).exec(function(err, data) {
        return res.json(CreateObjService.response(false, data));
    });
});

router.get('/verifySettlement', function(req, res) {
    var crypto = require('crypto');
    var hash = crypto.createHash('sha256');
    hash.update(req.query.password);
    var password = hash.digest('hex').toUpperCase();
    console.log(password)
    //qwerty123
    if(password == "A665A45920422F9D417E4867EFDC4FB8A04A1F3FFF1FA07E998E86F7F7A27AE3"){
        SettlementReport.update({ period: req.query.period }, {isVerified : true}, {multi: true}, function(er, f){
            return res.json(CreateObjService.response(false, 'Done'));
        })    
    }else{
        return res.json(CreateObjService.response(true, 'Invalid password'));
    }
});

router.get('/viewCurrentSettlementStatusToSend', function(req, res){
    SettlementReport.find({ period: req.query.period, netPayable : {$gt : 0}, holdPayment : false }, {transactionObj:1, transactionProcessedObj :1, isVerified : 1, isProcessed : 1, parlorId : 1, parlorName: 1, parlorAddress:1, netPayable : 1 }, function(er, settlements){
            var data = {parlorsToSendSettlement : [], isVerified : true};
            Async.each(settlements, function(s, callback) {
                Parlor.findOne({_id : s.parlorId}, {fundAccountIdRazorPay : 1}, function(erm, parlor){
                    if(parlor.fundAccountIdRazorPay){
                        if(!s.isVerified){
                            data.isVerified = false;
                        }
                        data.parlorsToSendSettlement.push({
                            parlorName : s.parlorName,
                            parlorId : s.parlorId,
                            parlorAddress : s.parlorAddress,
                            netPayable : s.netPayable,
                            isVerified : s.isVerified,
                            isProcessed : s.isProcessed,
                            status : s.transactionProcessedObj ? "Dispatched from Bank" : (s.transactionObj ? (s.transactionObj.error ? "Failed" : "Dispatched from Be U") : (s.isVerified ? "verified" : "Not Verified"))
                        });
                        callback();
                    }else{
                        callback();
                    }
                })
            }, function allTaskCompleted() {
                return res.json(CreateObjService.response(false, data));
            });
    })  
});


router.get('/viewCurrentSettlementStatus', function(req, res){
    SettlementReport.find({ period: req.query.period, isVerified : true, isProcessed : false, netPayable : {$gt : 0} }, {parlorId : 1, parlorName: 1, parlorAddress:1, holdPayment:1, netPayable : 1 }, function(er, settlements){
            var data = {parlorsWithSettlementHold : [], parlorsToSendSettlement : [], parlorsToSendSettlementButNoAccountDetail : []};
            Async.each(settlements, function(s, callback) {
                if(s.holdPayment){
                    data.parlorsWithSettlementHold.push({
                        parlorName : s.parlorName,
                        parlorId : s.parlorId,
                        parlorAddress : s.parlorAddress,
                        netPayable : s.netPayable,
                    });
                    callback();
                }else if(s.netPayable > 0){
                    Parlor.findOne({_id : s.parlorId}, {fundAccountIdRazorPay : 1}, function(erm, parlor){
                        if(parlor.fundAccountIdRazorPay){
                            data.parlorsToSendSettlement.push({
                                parlorName : s.parlorName,
                                parlorId : s.parlorId,
                                parlorAddress : s.parlorAddress,
                                netPayable : s.netPayable,
                            });
                            callback();
                        }else{
                            data.parlorsToSendSettlementButNoAccountDetail.push({
                                parlorName : s.parlorName,
                                parlorId : s.parlorId,
                                parlorAddress : s.parlorAddress,
                                netPayable : s.netPayable,
                            });
                            callback();
                        }
                    })
                }else{
                    callback()
                }
            }, function allTaskCompleted() {
                return res.json(CreateObjService.response(false, data));
            });
    })  
});

// http://www.beusalons.com/api/transferLuckyDrawWebhook
//isProcessed
router.post('/sendSettlement', function(req, res){
    console.log(req.body.period)
    console.log(req.body.password)
    SettlementReport.find({period: req.body.period, isVerified : true, isProcessed: false, netPayable : {$gt : 0} }, {parlorId : 1}, function(er, settlements){
        if(settlements.length > 0){
            console.log(settlements.length)
            var crypto = require('crypto');
            var hash = crypto.createHash('sha256');
            hash.update(req.body.password);
            var password = hash.digest('hex').toUpperCase();
            console.log(password)
            if(password == "A665A45920422F9D417E4867EFDC4FB8A04A1F3FFF1FA07E998E86F7F7A27AE3"){
                Async.eachSeries(settlements, function(s, callback) {
                    Parlor.processSettlement(s, function(data){
                            callback();
                    })
                }, function allTaskCompleted() {
                    return res.json(CreateObjService.response(false, 'Done'));
                });
            }else{
                return res.json(CreateObjService.response(true, 'Invalid password'));
            }
        }else{
            return res.json(CreateObjService.response(true, 'No Settlement Found'));
        }
    })  
});


router.get('/settlementReportAll', function(req, res) {
    SettlementReport.find({ period: req.query.period }).populate('parlorId', {
        id: 1,
        name: 1,
        address: 1,
        address2: 1
    }).sort({ period: 1 }).exec(function(err, data) {
        var startDate = new Date(),
            endDate = new Date();
        if (data.length > 0) {
            startDate = data[0].startDate;
            endDate = data[0].endDate;
        }
        Appointment.aggregate({
            $match: {
                status: { $in: [1, 4] },
                appointmentStartTime: { $gte: startDate, $lt: endDate }
            }
        }, { $project: { parlorId: 1 } }, {
            $group: {
                '_id': '$parlorId',
                'id': { $first: '$parlorId' },
                'count': { $sum: 1 },
            },
        }).exec(function(err, appts) {
            data = _.map(data, function(d) {
                var v = _.filter(appts, function(app) {
                    return d.parlorId && app.id + "" == d.parlorId._id + ""
                })[0];
                var obj = d;
                obj.reason = (v ? v.count > 0 ? v.count : '0' : '0') + ' Pending Apppointments';
                return obj;
            });
            return res.json(CreateObjService.response(false, data));
        });
    });
});






router.post('/refundPayment', function(req, res) {
    Appointment.refundPayment(req, function(response) {
        res.json(response);
    });
});

router.get('/deleteMember', function(req, res) {
    var id = req.query.id;
    Beu.remove({ _id: id }, function(err, rem) {
        if (err) {
            res.json(CreateObjService.response(true, "Error"))
        } else {
            res.json(CreateObjService.response(false, "Member Removed"))
        }
    })
})

router.post('/checkServiceDeal', function(req, res) {
    Deals.findOne({ _id: req.body.dealId }, { parlorId: 1 }, function(err, deal) {
        Service.find({}, { serviceCode: 1 }, function(err, services) {
            Parlor.find({}, { 'services.serviceCode': 1, 'services.serviceId': 1, 'services.prices.brand.brands.brandId': 1 }, function(err, parlors) {
                var parlor = _.filter(parlors, function(p) { return p.id + "" == deal.parlorId + "" })[0];
                Deals.checkDeals(req.body.dealId, parlor, services, function(s) {
                    return res.json(CreateObjService.response(false, s));
                })
            })
        })
    })
});

router.post('/runCheckOnAllDeals', function(req, res) {
    Service.find({}, { serviceCode: 1 }, function(err, services) {
        Parlor.find({}, { 'services.serviceCode': 1, 'services.serviceId': 1, 'services.prices.brand.brands.brandId': 1 }, function(err, parlors) {
            AllDeals.find({}, { dealId: 1 }, function(err, allDeals) {
                Async.each(allDeals, function(allDeal, callback) {
                    var checkPassed = true;
                    Deals.find({ dealId: allDeal.dealId }, { _id: 1, parlorId: 1 }, function(err, deals) {
                        console.log(deals.length);
                        Async.each(deals, function(deal, callback2) {
                            var parlor = _.filter(parlors, function(p) { return p.id + "" == deal.parlorId + "" })[0];
                            Deals.checkDeals(deal._id, parlor, services, function(s) {
                                if (!s.checkPassed) checkPassed = false;
                                callback2();
                            })
                        }, function allTaskCompleted2() {
                            AllDeals.update({ _id: allDeal.id }, { checkPassed: checkPassed }, function(err, u) {
                                callback();
                            });
                        });
                    });
                }, function allTaskCompleted() {
                    return res.json(CreateObjService.response(false, 'Script run Success'));
                });
            });
        });
    });
});

router.post('/onlinePaymentCancelledAppointment', function(req, res) {
    var page = req.query.page ? req.query.page : 1;
    var perPage = 1000;
    Appointment.find({
        status: 2,
        razorPayObj: { $ne: null },
        razorRefundObj: { $eq: null }
    }).sort({ appointmentStartTime: 1 }).limit(perPage).skip(perPage * (page - 1)).exec(function(err, data) {
        if (err) return res.json(CreateObjService.response(true, 'Error in getting cancelled appointments'));
        else return res.json(CreateObjService.response(false, Appointment.parseArray(data)));
    });
});

/*router.get('/appointmentSett', function(req, res) {
 Appointment.find({parlorId : { $in : ["58a2f5e13443ec15576228fe", "58e09a57b81c313ad0c85275", "58ca7349def56f322e3f8eae", "58cb9545cfd3553fa1d0dc68", "58e090ddb81c313ad0c84bba"]}, loyalityPoints : {$gt : 0}, "services.discountMedium" :"frequency" ,"services.dealId":null ,"services.dealPriceUsed" : true, status : 3, appointmentStartTime : {$gt : new Date(2017, 4, 5)} }, {services : 1, loyalityPoints : 1, parlorId : 1} , function(err, appointments){
 console.log(appointments.length);
 _.forEach(appointments, function(appt){
 Deals.getActiveDeals(appt.parlorId, req.body.datetime,  function(deals){
 _.forEach(appt.services, function(s){
 if(s.discountMedium == "frequency" && s.dealId == null && s.dealPriceUsed == true && (s.serviceId + "" == "58707eda0901cc46c44af417" || s.serviceId + "" == "58707eda0901cc46c44af2eb")){
 var femaleHairCut = _.filter(deals, function(d) {return d.dealId == 36 })[0];
 var maleHairCut = _.filter(deals, function(d) {return d.dealId == 37 })[0];
 var cut = s.serviceId + "" == "58707eda0901cc46c44af417" ? femaleHairCut : maleHairCut;
 var price = cut.dealType.price;
 appt.loyalityPoints = appt.loyalityPoints - s.loyalityPoints + price;
 s.discount = price
 s.loyalityPoints = price;
 s.actualPrice = price * 2;
 s.price = price;
 s.frequencyPrice = price * 2;
 }
 });
 Appointment.update({_id : appt.id}, {services : appt.services, loyalityPoints : appt.loyalityPoints}, function(err, s){
 console.log(err);
 console.log(s);
 console.log('don2');
 console.log('updated');
 });
 });
 });
 });
 });*/

router.get('/reGenerateReportManual', function(req, res) {


    Parlor.createSettlementReportv2(new Date(2018, 0, 5), new Date(2018, 0, 7), 127, {}, function(err, data) {
        return res.json(CreateObjService.response(false, data));
    });


});
router.get('/reGenerateReport', function(req, res) {
 
    SettlementReport.findOne({ _id: req.query.settlementId }, function(err, settlementReport) {
        if (settlementReport) {
            var sDate = settlementReport.startDate
            var eDate = HelperService.getDayEnd(settlementReport.endDate)
            var period = settlementReport.period;
            var parlorId = settlementReport.parlorId;
            SettlementReport.remove({ _id: req.query.settlementId }, function(err, data) {
                SettlementLedger.update({period : period , parlorId : parlorId} , {$pull : {monthWiseDetail : {period : period}}}, function(err , ledgerUpdate){
                    if(ledgerUpdate){
                        SettlementLedger.findOne({parlorId : parlorId , period : period} , function(err , ledger){
                            var ledgerTotalRecoverable = ledger.monthWiseDetail[ledger.monthWiseDetail.length-1].moreAmountToBeAdjusted
                            var ledgerCurrentDue = ledger.monthWiseDetail[ledger.monthWiseDetail.length-1].moreAmountToBeAdjusted

                            SettlementLedger.update({_id: ledger._id} , {totalRecoverable : ledgerTotalRecoverable , currentDue : ledgerCurrentDue , period : period-1}, function(err , updateLedger){ 
                                res.json('done')
                                Parlor.createSettlementReportv2(sDate, eDate, period, { _id: parlorId }, function(err, data) {
                                    return res.json(CreateObjService.response(false, data));
                                });
                            })
                        })
                    }
                })
            });

        } else {
            return res.json(CreateObjService.response(true, "Invalid"));
        }
    });

});

// Product Discount
router.get('/deleteGenerateReport', function(req, res) {
    SettlementReport.find({ period: req.query.period}, {startDate : 1, parlorId : 1}, function(err, settlements) {
        Async.each(settlements, function(s, callback){
                 SettlementReport.remove({ _id: s.id }, function(err, data) {
                    let period = req.query.period
        SettlementLedger.update({period : req.query.period , parlorId : s.parlorId} , {$pull : {monthWiseDetail : {period : period}}}, function(err , ledgerUpdate){
            if(ledgerUpdate){
                SettlementLedger.findOne({parlorId : s.parlorId , period : period} , function(err , ledger){
                    var ledgerTotalRecoverable = ledger.monthWiseDetail[ledger.monthWiseDetail.length-1].moreAmountToBeAdjusted
                    var ledgerCurrentDue = ledger.monthWiseDetail[ledger.monthWiseDetail.length-1].moreAmountToBeAdjusted

                    SettlementLedger.update({_id: ledger._id} , {totalRecoverable : ledgerTotalRecoverable , currentDue : ledgerCurrentDue , period : period-1}, function(err , updateLedger){ 
                        callback()
                       
                    })
                })
            }else{
                callback()
            }
        })
    });
        }, function allDone(){
            res.json('done')
        })
   
    });
});

router.get('/deleteGSTReport', function(req, res) {
    SettlementReport.find({ period: req.query.period}, {startDate : 1, parlorId : 1}, function(err, settlements) {
        Async.each(settlements, function(s, callback){
                    let period = req.query.period
        SettlementLedger.update({period :req.query.period, month : 6, "monthWiseDetail.name" : "GST Paid" , parlorId : s.parlorId} , {$pull : {monthWiseDetail : {"name" : "GST Paid"}}}, function(err , ledgerUpdate){
            if(ledgerUpdate){
                SettlementLedger.findOne({parlorId : s.parlorId , period : period} , function(err , ledger){
                    var ledgerTotalRecoverable = ledger.monthWiseDetail[ledger.monthWiseDetail.length-1].moreAmountToBeAdjusted
                    var ledgerCurrentDue = ledger.monthWiseDetail[ledger.monthWiseDetail.length-1].moreAmountToBeAdjusted

                    SettlementLedger.update({_id: ledger._id} , {totalRecoverable : ledgerTotalRecoverable , currentDue : ledgerCurrentDue , period : period}, function(err , updateLedger){ 
                        callback()
                       
                    })
                })
            }else{
                callback()
            }
        })
        }, function allDone(){
            res.json('done')
        })
   
    });
});

router.get('/deleteProductDiscountReport', function(req, res) {
    let month = 7
    SettlementReport.find({ period: req.query.period}, {startDate : 1, parlorId : 1}, function(err, settlements) {
        Async.each(settlements, function(s, callback){
                    let period = req.query.period
        SettlementLedger.update({period :req.query.period, month : month, "monthWiseDetail.name" : "Product Discount" , parlorId : s.parlorId} , {$pull : {monthWiseDetail : {"name" : "Product Discount"}}}, function(err , ledgerUpdate){
            if(ledgerUpdate){
                SettlementLedger.findOne({parlorId : s.parlorId , period : period} , function(err , ledger){
                    var ledgerTotalRecoverable = ledger.monthWiseDetail[ledger.monthWiseDetail.length-1].moreAmountToBeAdjusted
                    var ledgerCurrentDue = ledger.monthWiseDetail[ledger.monthWiseDetail.length-1].moreAmountToBeAdjusted

                    SettlementLedger.update({_id: ledger._id} , {totalRecoverable : ledgerTotalRecoverable , currentDue : ledgerCurrentDue , period : period}, function(err , updateLedger){ 
                        callback()
                       
                    })
                })
            }else{
                callback()
            }
        })
        }, function allDone(){
            res.json('done')
        })
   
    });
});


router.get('/reGenerateReportAll', function(req, res) {
    SettlementReport.findOne({ period: req.query.period }, function(err, settlementReport) {
        var sDate = settlementReport.startDate
        var eDate = HelperService.getDayEnd(settlementReport.endDate)
        var period = settlementReport.period;
        console.log(sDate)
        console.log(eDate)
        if (settlementReport) {
            SettlementReport.remove({ period: settlementReport.period }, function(err, data) {
                if(!err){
                    SettlementLedger.updateMany({period : period} , {$pull : {monthWiseDetail : {period : period}}}, function(err , ledgerUpdate){
                        if(ledgerUpdate){
                            SettlementLedger.find({period : period} , function(err , ledgers){

                                async.each(ledgers , function(ledger , callback){

                                    var ledgerTotalRecoverable = ledger.monthWiseDetail[ledger.monthWiseDetail.length-1].moreAmountToBeAdjusted
                                    var ledgerCurrentDue = ledger.monthWiseDetail[ledger.monthWiseDetail.length-1].moreAmountToBeAdjusted

                                    SettlementLedger.update({_id: ledger._id} , {totalRecoverable : ledgerTotalRecoverable , currentDue : ledgerCurrentDue , period : period-1}, function(err , update){
                                            
                                        callback();
                                    })
                                }, function all(){
                                    Parlor.createSettlementReportv2(sDate, eDate, settlementReport.period, {active: true}, function(err, data) {

                                        return res.json(CreateObjService.response(false, data));
                                    });
                                })
                            })
                        }else{
                            return res.json(CreateObjService.response(true, "Error in regenrating"));
                        }
                        
                    })
                }
                
            });
        } else {
            return res.json(CreateObjService.response(true, "Invalid"));
        }
    });
});


// router.get('/reGenerateReportAll', function(req, res) {
//     SettlementReport.findOne({ period: req.query.period }, function(err, settlementReport) {
//         var sDate = settlementReport.startDate
//         var eDate = HelperService.getDayEnd(settlementReport.endDate)
//         // var sDate = HelperService.getDayStart(new Date(2018,10,8))
//         // var eDate = HelperService.getDayEnd(new Date(2018,10,11))
//         console.log(sDate)
//         console.log(eDate)
//         if (settlementReport) {
//             SettlementReport.remove({ period: settlementReport.period }, function(err, data) {

//                 Parlor.createSettlementReportv2(sDate, eDate, settlementReport.period, {}, function(err, data) {

//                     return res.json(CreateObjService.response(false, data));
//                 });
//             });
//         } else {
//             return res.json(CreateObjService.response(true, "Invalid"));
//         }
//     });
// });

router.post('/uploadItems', function(req, res) {

    var exceltojson; //Initialization
    upload(req, res, function(err) {
        console.log(req.file);
        if (err) {
            res.json({ error_code: 1, err_desc: err });
            return;
        }
        /** Multer gives us file info in req.file object */
        if (!req.file) {
            res.json({ error_code: 1, err_desc: "No file passed" });
            return;
        }
        //start convert process
        /** Check the extension of the incoming file and
         *  use the appropriate module
         */
        if (req.file.originalname.split('.')[req.file.originalname.split('.').length - 1] === 'xlsx') {
            exceltojson = xlsxtojson;
        } else {
            exceltojson = xlstojson;
        }
        try {
            exceltojson({
                input: req.file.path, //the same path where we uploaded our file
                output: null, //since we don't need output.json
                lowerCaseHeaders: true,
            }, function(err, result) {
                if (err) {
                    return res.json({ error_code: 1, err_desc: err, data: null });
                }
                var items = [];
                _.forEach(result, function(r) {
                    items.push({
                        name: r.name,
                        sellingPrice: parseInt(r.mrp) ? parseInt(r.mrp) : 0,
                        tax: 12.5,
                        brand: r.brand,
                        itemId: r.itemid,
                        bestBefore: 12,
                        capacity: "n/a",
                    });
                });
                InventoryItem.create(items, function(err, data) {
                    return res.json({ error_code: 1, err_desc: err, data: items });
                })
            });
        } catch (e) {
            res.json({ error_code: 1, err_desc: "Corupted excel file" });
        }
    });

});

router.put('/deals', function(req, res) {
    console.log(req.body.data);
    Deals.update({ dealId: req.body.dealId }, req.body.data, function(err, data) {
        console.log(data);
        if (err) {
            console.log(err);
            return res.json(CreateObjService.response(true, 'Error in getting deals'));
        } else
            return res.json(CreateObjService.response(false, 'Updated Successfully'));
    });
});


/*router.get('/updateDealsCombo', function(req, res) {
 Deals.update({dealId : {$in : [32, 33, 34, 35] }, 'services.serviceCode' : 258 }, {'services.$.serviceCode' : 299}, {multi: true}, function(err, data){
 console.log(data);
 console.log(err);
 if(err){
 console.log(err);
 return res.json(CreateObjService.response(true, 'Error in getting deals'));
 }
 else
 return res.json(CreateObjService.response(false, 'Updated Successfully' ));
 });
 });*/

router.post('/uploadDeals', function(req, res) {
    // var parlors = ["5870828f5c63a33c0af62721", "587084715c63a33c0af62724", "587088445c63a33c0af62727", "58708d575c63a33c0af6272b"];
    /*var parlors = ["587088445c63a33c0af62727", "587084715c63a33c0af62724", "58708d575c63a33c0af6272b", "5870828f5c63a33c0af62721", "588a0cc3f8169604955dce8d", "5881d125eec0e54abc393dea"];*/
    // var parlors = ["588338df51cbc72b34ddba2e", "58847c934a1a8735093f1b7e", "588998adf8169604955dcd3b"];
    var exceltojson; //Initialization
    upload(req, res, function(err) {
        console.log(req.file);
        if (err) {
            res.json({ error_code: 1, err_desc: err });
            return;
        }
        /** Multer gives us file info in req.file object */
        if (!req.file) {
            res.json({ error_code: 1, err_desc: "No file passed" });
            return;
        }
        //start convert process
        /** Check the extension of the incoming file and
         *  use the appropriate module
         */
        if (req.file.originalname.split('.')[req.file.originalname.split('.').length - 1] === 'xlsx') {
            exceltojson = xlsxtojson;
        } else {
            exceltojson = xlstojson;
        }
        try {
            exceltojson({
                input: req.file.path, //the same path where we uploaded our file
                output: null, //since we don't need output.json
                lowerCaseHeaders: true,
            }, function(err, result) {
                if (err) {
                    return res.json({ error_code: 1, err_desc: err, data: null });
                }
                result = Deals.removeTrailingSpaces(result);

                Service.find({}, function(err, allServices) {
                    var deals = [];
                    _.forEach(parlors, function(parlor) {

                        _.forEach(result, function(r) {
                            var obj = {
                                name: r.name,
                                description: r.description,
                                menuPrice: r.menuPrice,
                                dealPrice: r.dealPrice,
                                dealPercentage: r.dealPercentage,
                                startDate: r.startDate,
                                endDate: r.endDate,
                                category: r.category,
                                dealId: r.dealId,
                                sort: r.sort,
                                hours: r.hours,
                                weekDay: r.day, // 1- all days, 2 = weekday , 3 = weekend
                                tax: 15,
                                dealType: {
                                    name: getDealType(r.frequency, r.combo, r.loyalityPoints, r.services, r.discountPercentage),
                                    frequencyRequired: getFrequencyRequired(r.frequency),
                                    frequencyFree: getFreeFrequency(r.frequency),
                                    loyalityPoints: r.loyalityPoints,
                                    price: r.frequency ? r.dealPrice : (r.flatPrice ? r.flatPrice : r.discountPercentage),
                                },
                                couponCode: r.couponCode,
                                parlorId: parlor,
                                services: getServices(r.services, allServices),
                                active: 1,
                            };
                            deals.push(obj);
                        });
                    });

                    Deals.create(deals, function(err, d) {
                        console.log(err);
                        res.json({ error_code: 0, err_desc: null, err: err, data: deals });
                    });
                });
            });
        } catch (e) {
            res.json({ error_code: 1, err_desc: "Corupted excel file" });
        }
    });

});

function getDealType(frequency, combo, loyalityPoints, services, discount) {
    if (frequency) return "frequency";
    if (combo) return "combo";
    if (loyalityPoints) return "loyalityPoints";
    if (services.indexOf('/') > -1 && discount) return "chooseOnePer";
    if (services.indexOf('/') > -1) return "chooseOne";
    return "dealPrice";
}

function getFrequencyRequired(f) {
    return f ? parseInt(f.substr(0, f.indexOf('+'))) : f;
}

function getFreeFrequency(f) {
    return f ? parseInt(f.substr(f.indexOf('+'), f.length)) : f;
}

function getServices(services, allServices) {
    var data = [];
    if (services.indexOf('+') > -1 || services.indexOf('/') > -1) {
        var splits;
        if (services.indexOf('+') > -1) {
            splits = services.split("+");
        } else splits = services.split("/");
        for (var i = 0; i < splits.length; i++) {
            data.push({
                serviceCode: splits[i],
                name: getServiceName(splits[i], allServices),
            });
        }
    } else {
        data.push({
            serviceCode: services,
            name: getServiceName(services, allServices),
        });
    }
    return data;
}

function getServiceName(service, allServices) {
    var name = "";
    _.forEach(allServices, function(s) {
        if (s.serviceCode == service) name = s.name;
    });
    return name;
}

router.get('/serviceByParlorId', function(req, res) {
    Parlor.findOne({ _id: req.query.parlorId }).exec(function(err, parlor) {
        ServiceCategory.find().exec(function(err, categories) {
            var data = [];
            _.map(categories, function(category) {
                var serviceByCategory = _.filter(parlor.services, { 'categoryId': category._id });
                var cat = ServiceCategory.parse(category);
                cat.services = serviceByCategory;
                if (serviceByCategory.length > 0) data.push(cat);
            });
            var reqData = [];
            SuperCategory.find({}, function(err, supercategories) {
                _.forEach(supercategories, function(s) {
                    var categoryBySuper = _.filter(data, { 'superCategory': s.name });
                    if (categoryBySuper.length > 0) reqData.push({ name: s.name, categories: categoryBySuper });
                });
                return res.json(CreateObjService.response(false, reqData));
            });
        });
    });
});


router.post('/addOwnerToParlor', function(req, res) {
    Admin.update({ _id: req.body.ownerId, role: 7 }, { $push: { parlorIds: req.body.parlorId } }, function() {
        return res.json(CreateObjService.response(false, 'Updated'));
    });
});


router.get('/supercategory', function(req, res) {
    SuperCategory.find({}, function(err, data) {
        return res.json(CreateObjService.response(false, SuperCategory.parse(data)));
    });
});

router.put('/supercategory', function(req, res) {
    SuperCategory.update({ _id: req.body.superCategoryId }, {
        maleImage: req.body.maleImage,
        femaleImage: req.body.femaleImage,
        maleDescription: req.body.maleDescription,
        femaleDescription: req.body.femaleDescription
    }, function(err, data) {
        return res.json(CreateObjService.response(false, SuperCategory.parse(data)));
    });
});

router.put('/category', function(req, res) {
    ServiceCategory.update({ _id: req.body.categoryId }, {
        femaleImage: req.body.femaleImage,
        maleImage: req.body.maleImage,
        sort: req.body.sort
    }, function(err, data) {
        return res.json(CreateObjService.response(false, 'renamed'));
    });
});

router.get('/parlorDetail', function(req, res) {
    var data = {
        parlor: {},
        salonManager: [],
        asstManager: [],
        salonHead: [],
        employee: []
    };
    Parlor.findOne({ _id: req.query.parlorId }, function(err, parlor) {
        data.parlor = Parlor.parseParlor(parlor);
        Admin.find({ $or: [{ parlorIds: { $in: [req.query.parlorId] } }, { parlorId: req.query.parlorId }], active: true }, { role: 1, firstName: 1 }, function(err, employees) {
            _.forEach(employees, function(empl) {
                if (empl.role == 2) {
                    data.salonManager.push(empl.id)
                }
                if (empl.role == 9) {
                    data.asstManager.push(empl.id)
                }
                if (empl.role == 8) {
                    data.salonHead.push(empl.id)
                }
                data.employee.push({ name: empl.firstName, id: empl.id })

            });
            console.log(data)
            return res.json(CreateObjService.response(false, data));

        })
    });
});

router.get('/updateinventory', function(req, res) {
    InventoryItem.update({}, { capacity: 'n/a' }, { multi: true }, function(err, d) {
        res.json(d);
    });
});

router.get('/salonLatLong' , function(req , res){
    Parlor.aggregate([ 
    {
        $match : {active : true},
    } ,
        {$project : 
            {geoLocation: 1, name: 1 , active: 1, averageNoOfClientsPerDay: 1}
        },
        {$unwind: "$geoLocation"},
        {$group : 
            {_id: "$_id", longitude : {$first : "$geoLocation"}, latitude : {$last : "$geoLocation"} ,
                            name:{$first : "$name"} , active: {$first: "$active"}, salonScore : {$first : "$averageNoOfClientsPerDay"}}
        },
        {
            $project : {
                _id : "$_id",
                longitude : "$longitude",
                latitude : "$latitude",
                salonScore : "$salonScore"
            }
        }
                    ], function(err , salonData){
                         return res.json(CreateObjService.response(false , salonData))
                  })
});

router.get('/subscriptionUserlatLong' , function(req , res){
    User.aggregate([
        {
            $match : {
                subscriptionId : {$in : [1, 2]}
            }
        },
        {
            $project : {
                latitude : 1,
                longitude : 1,
            }
        }
    ]).exec(function(err, data){
            return res.json(CreateObjService.response(false , data))
    });
});

router.get('/appointmentInLastSixMonthsnUserlatLong' , function(req , res){
    User.aggregate([
            {
                $match : {
                    "parlors.lastAppointmentDate" : {$gt : new Date(2018, 0, 1) },
                    latitude : {$nin : [null, 0]},
                }
            },
            {
                $project : {
                    latitude : 1,
                    longitude : 1,
                }
            }
        ]).exec(function(err, data){
                return res.json(CreateObjService.response(false , data))
        });
});



router.get('/aalenes' , function(req , res){
    User.aggregate([
            {
                $match : {
                    "parlors.parlorId": "587088445c63a33c0af62727",
                    "parlors.lastAppointmentDate" : {$gt : new Date(2018, 0, 1) },
                    latitude : {$nin : [null, 0]},
                }
            },
            {
                $project : {
                    latitude : 1,
                    longitude : 1,
                }
            }
        ]).exec(function(err, data){
                return res.json(CreateObjService.response(false , data))
        });
});

router.post('/updateParlor', function(req, res) {

    /*var updateObj = {};
     if(req.body.tax)updateObj.tax = req.body.tax;
     if(req.body.smscode)updateObj.smscode = req.body.smscode;
     if(req.body.logo)updateObj.logo = req.body.logo;
     if(req.body.latitude)updateObj.latitude = req.body.latitude;
     if(req.body.longitude)updateObj.longitude = req.body.longitude;
     if(req.body.gender)updateObj.gender = req.body.gender;*/
    if (req.body.salonHead) {
        _.forEach(req.body.salonHead, function(sH) {
            Admin.update({ _id: sH }, { $set: { role: 8 } }).exec(function(err, salHead) {})
        })
    }
    if (req.body.salonAsst) {
        _.forEach(req.body.salonAsst, function(asst) {
            Admin.update({ _id: asst }, { $set: { role: 9 } }).exec(function(err, asstMa) {})
        })

    }
    if (req.body.salonManager) {
        _.forEach(req.body.salonManager, function(mang) {
            Admin.update({ _id: mang }, { $set: { role: 2 } }).exec(function(err, salonMa) {})
        })

    }

    var date = req.body.data.discountEndTime;
    var nDate = HelperService.getDayEnd(date)
    // var img = req.body.data.images;
    // var newImage =[];
    // _.forEach( img, function(m){
    //         if(m.appImageUrl != "" || ma.appImageUrl != null){
    //             newImage.push(m);
    //         }
    // });
    // console.log(newImage)
    // req.body.data.images = newImage;
    req.body.data.discountEndTime = nDate;
    req.body.data.geoLocation = [req.body.data.longitude, req.body.data.latitude]
    Parlor.update({ _id: req.body.parlorId }, req.body.data, function(err, data) {
        // console.log(data)
        if (err) { console.log(err); return res.json(CreateObjService.response(true, 'Error in updating parlor')); } else {
            ParlorNameData.update({ parlorId: req.body.parlorId }, {stateName : req.body.data.stateName, latitude: req.body.data.latitude, longitude: req.body.data.longitude, active: req.body.data.active, tax: req.body.data.tax, parlorType: req.body.data.parlorType, parlorName: req.body.data.name, parlorAddress1: req.body.data.address, parlorAddress2: req.body.data.address2 }, function(err, parlornameData) {
                SalonSupportData.update({ parlorId: req.body.parlorId }, { active: req.body.data.active }, function(err, salonSupport) {

                    if (req.body.data.active == false) {
                        Admin.updateMany({ $or: [{ parlorId: req.body.parlorId }, { parlorIds: req.body.parlorId }] }, { password: "" + Math.floor(Math.random() * 9000) + 1000 + "" }, function(err, update) {
                            return res.json(CreateObjService.response(false, 'Updated'));
                        })
                    } else return res.json(CreateObjService.response(false, 'Updated'))
                })
            })
        };
    });

});


router.post('/addSmsCredit', function(req, res) {
    Parlor.findOne({ _id: req.body.parlorId }, function(err, parlor) {
        var smsCredits = parlor.smsRemaining ? parlor.smsRemaining + req.body.credit : req.body.credit;
        Parlor.update({ _id: req.body.parlorId }, { smsRemaining: smsCredits }, function(err, data) {
            return res.json(CreateObjService.response(false, { smsCredits: smsCredits }));
        });
    });
});

router.get('/oldNewClientCount', function(req, res) {
    var data = {
        customers: [{ type: "New Guest", count: 0 },
            { type: "Old Guest", count: 0 }
        ]
    };
    Appointment.find({
        status: 3,
        appointmentStartTime: {
            $gte: HelperService.getDayStart(req.query.startDate),
            $lt: HelperService.getDayEnd(req.query.endDate)
        }
    }, { client: 1 }, function(err, appoint) {
        _.forEach(appoint, function(app) {
            if (app.client.noOfAppointments == 0) data.customers[0].count++;
            else if (app.client.noOfAppointments > 0) data.customers[1].count++;
        })
        return res.json(CreateObjService.response(false, data));
    })
})



router.post('/addReviewInCancelled' , function(req, res){
    Appointment.update({_id : req.body.appointmentId}, {review : {
              text : req.body.text,
              rating : parseFloat(req.body.rating),
              createdAt : new Date()
         }}, function(err, updated){
            return res.json(CreateObjService.response(false , "Review Added Successfully"));
         })
});

router.post('/viewReferalDetails', function(req, res) {
    var d = [];
    var async = require('async');
    User.findOne({ phoneNumber: req.body.phoneNumber }, { firstName: 1, referCodeBy: 1, creditsHistory: 1 }, function(err, user) {
        async.parallel([
            function(done) {
                async.each(user.creditsHistory, function(cR, cb) {
                    if (cR.reason == "Referal") {
                        User.findOne({ _id: cR.source }, { firstName: 1, referCodeBy: 1 }, function(err, referUser) {
                            d.push({ referFriend: referUser.firstName, friendReferCode: referUser.referCodeBy })
                            cb();
                        })
                    } else {
                        cb();
                    }

                }, done);
            }
        ], function allTaskCompleted() {
            console.log(d)
            return res.json(d);
        })
    })
})


// router.post('/cashBackDetails' , function(req,res){
//     var query = {};
//     if (req.body.phoneNumber) {
//         query = {phoneNumber: req.body.phoneNumber, "creditsHistory.reason" : {$regex : "cashback" , $options: "i"}}
//     } else if (req.body.name) {
//         query = {firstName: {$regex: req.body.name, "creditsHistory.reason" : {$regex : "cashback" , $options: "i"}}}
//     }
//     // var phoneNumber = req.body.phoneNumber;
//     var data = {};
//     User.find(query , {creditsHistory:1, firstName:1, phoneNumber:1}).exec(function(err,user){
//         data.name = user[0].firstName,
//         data.phoneNumber = user[0].phoneNumber,
//         data.cashBack = [];
//        _.forEach(user[0].creditsHistory , function(cH){
//             if(cH.reason == "100% cashback" || cH.reason == "50% cashback" || cH.reason == "10% cashback"){
//                 data.cashBack.push({reason : cH.reason , balance : cH.balance , amount : cH.amount , date : (cH.createdAt).toDateString()})
//             }
//        })
//             return res.json(CreateObjService.response(false, data));
//     })
// })


router.get('/owners', function(req, res) {
    Admin.find({ role: 7 }, {firstName : 1,lastName : 1,emailId : 1,active : 1,phoneNumber : 1,role : 1,password : 1,position : 1,createdAt : 1}).exec(function(err, data) {
        return res.json(CreateObjService.response(false, _.map(data, function(u) {
            var obj = Admin.parse(u);
            obj.userId = u.id;
            obj.password = u.password;
            return obj;
        })));
    });
});


router.post('/changeAppointmentStatus', function(req, res) {
    Appointment.changeStatus(req, function(err, status) {
        return res.json(CreateObjService.response(false, status));
    });
});

router.get('/appointmentList', function(req, res) {
    var today = new Date();
    var page = req.query.page ? req.query.page : 1;
    var perPage = 1000;
    SettlementReport.findOne({}, { createdAt: 1, startDate: 1, endDate: 1 }).sort({ $natural: -1 }).exec(function(err, settlement) {
        Parlor.find({ active: true }, { _id: 1 }, function(err, parlors) {
            var parlorIds = _.map(parlors, function(p) { return p._id })
                if (settlement.createdAt.getTime() <= today.getTime()) {
console.log("settlement.createdAt" , settlement.createdAt)
            Appointment.find({ status: { $in: [1, 4] }, parlorId: { $in: parlorIds }, appointmentStartTime: { $gte: settlement.startDate } }).sort({ appointmentStartTime: 1 }).limit(perPage).skip(perPage * (page - 1)).exec(function(err, data) {
                if (err) return res.json(CreateObjService.response(true, 'Error in getting appointments'));
                else return res.json(CreateObjService.response(false, Appointment.parseArray(data)));
            });
            }
        })
    })
});


router.post('/dealsBrand', function(req, res) {
    var obj = {
        brands: _.map(req.body.data.brands || [], function(brand) {
            return {
                brandId: brand.brandId,
                ratio: brand.ratio,
                name: brand.name,
                products: _.map(brand.products || [], function(p) {
                    return {
                        productId: p.productId,
                        name: p.name,
                        ratio: p.ratio
                    }
                })
            }
        }),
    };
    AllDeals.update({ dealId: req.body.data.dealId }, obj, function(err, d) {
        console.log(err);
        console.log(d);
        Deals.update({ dealId: req.body.data.dealId }, obj, { multi: true }).exec(function(err, update) {
            console.log(err);
            return res.json(CreateObjService.response(false, update));
        });
    });
});


router.post('/deals', function(req, res) {

    var obj = {
        name: req.body.data.name,
        category: req.body.data.category,
        description: req.body.data.description,
        shortDescription: req.body.data.shortDescription,
        sort: req.body.data.sort,
        categoryIds: req.body.data.categoryIds,
        parlorTypes: req.body.data.parlorTypes,
        genders: req.body.data.genders,
        active: req.body.data.active,
        isDeleted: req.body.data.isDeleted,
        slabId: "5952477f74f0e22c6c11a26f",
        // slabId : req.body.data.slabId,
        dealSort: req.body.data.dealSort,
        allHairLength: req.body.data.allHairLength,
        weekDay: parseInt(req.body.data.weekDay),
        parlorTypesDetail: _.map(req.body.data.parlorTypesDetail, function(pD) {
            return {
                cityId: pD.cityId,
                parlorPrice: _.map(pD.parlorPrice, function(price) {
                    return {
                        type: price.type,
                        startAt: price.startAt,
                        percent: price.percent
                    }
                })
            }
        }),
        services: _.map(req.body.data.services, function(s) {
            return {
                serviceCode: s.serviceCode,
                name: s.name,
            };
        }),
    };
    // console.log(req.body.data.parlorTypesDetail[0].parlorPrice)
    // console.log(obj);
    AllDeals.update({ dealId: req.body.data.dealId }, obj, function(err, d) {
        // console.log(err);
        // console.log(d);
        Deals.update({ dealId: req.body.data.dealId }, obj, { multi: true }).exec(function(err, update) {
            console.log(err);
            return res.json(CreateObjService.response(false, update));
        });
    });
});

router.post('/selectAppointment', function(req, res) {
    console.log(req.body)
    var phoneN = req.body.parlorAppointmentId;
    var today = new Date();
    SettlementReport.findOne({}, { createdAt: 1, startDate: 1, endDate: 1 }).sort({ $natural: -1 }).exec(function(err, settlement) {
        if (settlement.createdAt.getTime() <= today.getTime()) {

            Appointment.find({ "client.phoneNumber": phoneN , appointmentStartTime: { $gte: settlement.startDate } , status:{$in : [1,3]} },{'client' :1, status:1, payableAmount:1, appointmentStartTime:1, parlorName:1, parlorAppointmentId:1 , invoiceId:1}).exec(function(err, appointments) {

                if(appointments) {
                    return res.json(CreateObjService.response(false, _.map(appointments, function(r) { return {
                                      _id: r._id,
                                      appointmentStartTime : r.appointmentStartTime,
                                      parlorName : r.parlorName,
                                      status : r.status,
                                      settlementDate : settlement.endDate,
                                      payableAmount : r.payableAmount,
                                      client : r.client,
                                      parlorAppointmentId: r.parlorAppointmentId,
                                      invoiceId: r.invoiceId
                                    } })));
                }
                else 
                    return res.json(CreateObjService.response(true,  "Not in Current Settlement "));
            })
        }
        else {
            return res.json(CreateObjService.response(true, "Not in Current Settlement "));
        }
    })
});

router.post('/selectParlor', function(req, res) {
    console.log(req.body.appointmentId)
    Appointment.findOne({ _id: req.body.appointmentId }).exec(function(err, appointment) {
        return res.json(CreateObjService.response(false, appointment));
    })
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
        SettlementReport.findOne({ period: req.body.period, parlorId: req.body.parlorId }, {
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
        SettlementReport.findOne({ period: req.body.period, parlorId: req.body.parlorId }, {
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

router.post('/updateEditedAppointment', function(req, res) {
    console.log(req.body)
    var appointmentObj = {};
            if (req.body.paymentMethodsOld.length > 0) {
                 console.log("11111111111111")
                    appointmentObj = {
                        paymentMethod : req.body.paymentMethodsSelected[0].value,
                        appointmentStartTime: req.body.dateChanged,
                        status: req.body.statusChanged,
                        allPaymentMethods : [] 
                    };
                    if(req.body.paymentMethodsSelected.length > 1){
                        console.log("2222222222")
                        appointmentObj.paymentMethod =  12;
                        for (var i = 0; i < req.body.paymentMethodsSelected.length; i++) {
                            var paymentObj = {
                                "value": req.body.paymentMethodsSelected[i].value,
                                "name": req.body.paymentMethodsSelected[i].name,
                                "amount": req.body.paymentMethodsSelected[i].amount
                            };

                            appointmentObj.allPaymentMethods.push(paymentObj)
                        }
                    }else if(req.body.paymentMethodsSelected.length == 1){
                        console.log("333333333" )
                        var paymentObj = {
                            "value": req.body.paymentMethodsSelected[0].value,
                            "name": req.body.paymentMethodsSelected[0].name,
                            "amount": req.body.paymentMethodsSelected[0].amount
                        };
                        appointmentObj.allPaymentMethods.push(paymentObj)

                    }
                    console.log(appointmentObj)
                    Appointment.update({_id: req.body.appointmentId}, appointmentObj).exec(function(err, update) {
                        console.log(err)
                        console.log(update)
                        return res.json(CreateObjService.response(false, update));
                    })
            } else if (req.body.payableAmount == 0) {

                appointmentObj = {
                    appointmentStartTime: req.body.dateChanged,
                    status: req.body.statusChanged
                };
                console.log(appointmentObj)
                Appointment.update({ _id: req.body.appointmentId }, appointmentObj).exec(function(err, update) {

                    return res.json(CreateObjService.response(false, update));
                })
            } else {  
                appointmentObj = {
                    appointmentStartTime: HelperService.addTimeToDate(req.body.dateChanged),
                    status: req.body.statusChanged
                };
                Appointment.update({
                    _id: req.body.appointmentId
                }, appointmentObj).exec(function(err, update) {
                    // console.log(update)
                    return res.json(CreateObjService.response(false, update));
                })
            }
});

router.post('/freeServiceReport', function(req, res, next) {
    var startDate = req.body.startDate;
    var endDate = req.body.endDate;
    var parlorIds = req.body.parlorIds ? req.body.parlorIds : [];
    var query = { _id: { $in: parlorIds } };
    if (parlorIds.length == 0) query = {};
    var d = [];
    var async = require('async');
    Parlor.find(query, { id: 1, name: 1, address2: 1 }).exec(function(err, parlors) {
        async.parallel([
            function(done) {
                async.each(parlors, function(parlor, callback) {
                    Appointment.freeServiceReport(parlor, startDate, endDate, function(err, data) {
                        d.push(data);
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


router.post('/onlinePayment', function(req, res) {
    AggregateService.dailyOnlinePaymentReport(req, function(err, data) {
        return res.json(CreateObjService.response(true, data));
    })
});

router.get('/report/newclientServices', function(req, res, next) {
    AggregateService.newclientServices(req, function(results) {
        res.json(results);
    });
});

router.get('/report/repeatBeuClientSalonWise', function(req, res, next) {
    AggregateService.repeatBeuClientSalonWise(req, function(results) {
        res.json(results);
    });
});

router.get('/report/customersNoShow3Months', function(req, res, next) {
    AggregateService.customersNoShow3Months(req, function(results) {
        res.json(results);
    });
});

router.get('/report/getCustomerByParlorId', function(req, res, next) {
    AggregateService.getCustomerByParlorId(req, function(results) {
        res.json(results);
    });
});

router.get('/report/newclientSecondServices', function(req, res) {
     AggregateService.newclientSecondServices(req, function(results) {
        res.json(results);
    });
});


router.get('/report/subscribersPaymentTrends', function(req, res, next) {
    AggregateService.subscribersPaymentTrends(req, function(results) {
        res.json(AggregateService.parseResultForSubscribersPaymentTrends(results));
    });
});

router.get('/report/subscribersAttendanceTrends', function(req, res, next) {
    AggregateService.subscribersAttendanceTrends(req, function(results) {
        res.json(results);
    });
});

router.get('/report/lowSubscribersAttendanceUsers', function(req, res, next) {
    AggregateService.lowSubscribersAttendanceUsers(req, function(results) {
        res.json(results);
    });
});

router.get('/report/subscriberCountRevenueReport', function(req, res, next) {
    Async.parallel([
        function(callback) {
            AggregateService.noOfSubscriberAddedMonthWise(req, function(result) {
                callback(null, result);
            });
        },
        function(callback) {
            AggregateService.noOfActiveVisitsRevenueOfSubscriber(null, function(result) {
                callback(null, result);
            });
        }
    ],
    function(err, results) {
        res.json(AggregateService.parseResultForSubscriberCountRevenueReport(results));
    });
});

router.get('/report/salonWiseSubscriptionSold', function(req, res, next) {
    AggregateService.salonWiseSubscriptionSold(req, function(result) {
        res.json(result);
    });
});

// Investors report

router.post('/report/footFall', function(req, res, next) {
    AggregateService.appointmentReportParlorType(req, 'footFall', function(results) {
        res.json(AggregateService.parseResultForAppointmentReport(results));
    });
});

router.post('/report/salonRevenue', function(req, res, next) {
    AggregateService.appointmentReportParlorType(req, 'revenue', function(results) {
        res.json(AggregateService.parseResultForAppointmentReport(results));
    });
});

router.post('/report/salonRevenueZrika', function(req, res, next) {
    AggregateService.appointmentReportParlorType(req, 'revenue', function(results) {
        res.json(AggregateService.parseResultForAppointmentReport(results));
    });
});


router.post('/report/noOfService', function(req, res, next) {
    AggregateService.appointmentReportParlorType(req, 'noOfService', function(results) {
        res.json(AggregateService.parseResultForAppointmentReport(results));
    });
});

router.post('/report/oldNewClientReport', function(req, res, next) {
    AggregateService.oldNewClientReport(req, 'oldNewClient', function(results) {
        res.json(results);
    });
});

router.post('/report/freeHairCut', function(req, res, next) {
    AggregateService.appointmentReportParlorType(req, 'freeHairCut', function(results) {
        res.json(AggregateService.parseResultForAppointmentReport(results));
    });
});

router.post('/report/appTransaction', function(req, res, next) {
    AggregateService.appointmentReportParlorType(req, 'appTransaction', function(results) {
        res.json(AggregateService.parseResultForAppointmentReport(results));
    });
});

router.post('/report/departmentWiseReport', function(req, res, next) {
    AggregateService.appointmentReportDepartmentType(req, 'departmentWise', function(results) {
        res.json(results);
    });
});

router.post('/report/serviceFrequency', function(req, res, next) {
    AggregateService.serviceFrequencyReport(req, 'serviceFrequency', function(results) {
        res.json(results);
    });
});

router.post('/report/serviceComboReport', function(req, res, next) {
    var data = [];
    Service.find({}, { _id: 1 }, function(err, services) {
        Async.each(services, function(service, callback) {
            AggregateService.serviceComboReport(service.id, function(result) {
                if (result) data.push(result);
                callback();
            });
        }, function allTaskCompleted() {
            return res.json(data);
        });
    });
});


router.post('/report/clientWiseReport', function(req, res, next) {
    var data = [];
    var months = [0, 1, 2, 3, 4, 5];
    Async.each(months, function(month, callback) {
        AggregateService.appointmentReportParlorType(req, 'clientWise', function(results) {
            data.push(results[0]);
            callback();
        }, month)
    }, function allTaskCompleted() {
        return res.json(AggregateService.parseResultForAppointmentReport(data));
    });
});

router.post('/report/freebiesDistribution', function(req, res, next) {
    Async.parallel([
            function(callback) {
                AggregateService.freebiesHairCut(req, function(results) {
                    callback(null, results);
                });
            },
            function(callback) {
                AggregateService.freebiesOnlinePaymentThreading(req, function(results) {
                    callback(null, results);
                });
            },
            function(callback) {
                AggregateService.otherFreebies(req, function(results) {
                    callback(null, results);
                });
            }
        ],
        function(err, results) {
            res.json(AggregateService.parseResultForFreebiesReport(results));
        });
});

router.post('/report/cashOnlineReport', function(req, res, next) {
    Async.parallel([
            function(callback) {
                AggregateService.cashOnlineReport(req, 1, req.body.withFreeHair, function(results) {
                    callback(null, results);
                });
            },
            function(callback) {
                AggregateService.cashOnlineReport(req, 2, req.body.withFreeHair, function(results) {
                    callback(null, results);
                });
            },
            function(callback) {
                AggregateService.cashOnlineReport(req, 3, req.body.withFreeHair, function(results) {
                    callback(null, results);
                });
            },
        ],
        function(err, results) {
            res.json(AggregateService.parseResultForCashOnlineReport(results));
        });
});

router.post('/report/repeatCustomerPattern', function(req, res, next) {
    AggregateService.repeatCustomerPattern(function(results) {
        res.json(results);
    });
});

router.post('/report/thousandCashbackSpend', function(req, res, next) {
    AggregateService.thousandCashbackSpend(function(results) {
        var data = [],
            obj, objKey = "";
        _.forEach(results, function(r) {
            if (r.mod == 0) objKey = "0-499";
            else if (r.mod == 1) objKey = "500-999";
            else if (r.mod == 2) objKey = "1000-1499";
            else if (r.mod == 3) objKey = "1500-1999";
            else objKey = ">2000";
            if (r.mod == 4) obj = { key: objKey, count: 0 };
            if (r.mod < 4) {
                data.push({ key: objKey, count: r.count });
            } else {
                obj.count += r.count;
            }
        });
        data.push(obj);
        return res.json(data);
    });
});

router.post('/report/secondVisit', function(req, res, next) {
    AggregateService.appointmentFreeHairCutClients(req, function(results) {
        console.log(results.length)
        var clientIds = _.map(results, function(r) {
            return r.clientId
        });
        Appointment.find({ status: 3, 'client.id': { $in: clientIds } }, {
            'client.id': 1,
            serviceRevenue: 1,
            appointmentStartTime: 1
        }).exec(function(err, appointments) {
            _.forEach(appointments, function(appointment) {
                var client = _.filter(results, function(r) {
                    return r.clientId + "" == appointment.client.id + ""
                })[0];
                if (!client.secondVisitRevenue) {
                    if (!HelperService.compareTodayDate(client.date, appointment.appointmentStartTime) && appointment.appointmentStartTime.getTime() > client.date.getTime()) {
                        client.secondVisitRevenue = appointment.serviceRevenue;
                        client.secondVisitDate = appointment.appointmentStartTime;
                    }
                }
            });
            results = _.filter(results, function(r) {
                return r.secondVisitRevenue > 0
            });
            var monthArray = [0];
            var data = _.map(monthArray, function(m) {
                return {
                    month: HelperService.getMonthName(m),
                    monthNo: m,
                    year: 2017,
                    noOfClients: 0,
                    revenue: 0,
                };
            });
            /* var monthArray2 = [0, 1];
             _.forEach(monthArray2, function(m) {
                 data.push({
                     month: HelperService.getMonthName(m),
                     monthNo: m,
                     year: 2018,
                     noOfClients: 0,
                     revenue: 0,
                 });
             });*/

            _.forEach(data, function(d) {
                var revenue = 0;
                var filteredData = _.filter(results, function(r) {
                    if (r.secondVisitDate.getMonth() == d.monthNo) revenue += r.secondVisitRevenue;
                    return r.secondVisitDate.getMonth() == d.monthNo;
                });
                d.noOfClients = filteredData.length;
                d.revenue = revenue;
            });
            console.log(data)
            res.json(data);
        });
    });
});


router.post('/report/otherServicesWithfreeServices', function(req, res, next) {
    var startDate = req.body.startDate || new Date();
    var endDate = req.body.endDate || new Date();
    var query = req.body.parlorIds ? { _id: { $in: req.body.parlorIds } } : {};
    Parlor.find(query, { id: 1, name: 1, address2: 1 }).exec(function(err, parlors) {
        var dates = HelperService.getDailyDate(new Date(startDate), new Date(endDate));
        dates = _.map(dates, function(d) {
            return {
                date: d,
                parlors: _.map(parlors, function(p) {
                    return {
                        name: p.name,
                        address: p.address2,
                        parlorId: p.id,
                        // freeHairCutCount: 0,
                        // freeHairCutRevenue: 0,
                        // freeWaxCount: 0,
                        // freeWaxRevenue: 0,
                        // otherServicesCount: 0,
                        // otherServicesRevenue: 0,
                        serviceCount: [
                            { type: "Free Hair Cut", number: 0, amount: 0 },
                            // {type:"Female Hair Cut" , number :0, amount:0},
                            { type: "Free Waxing", number: 0, amount: 0 },
                            { type: "Free Threading", number: 0, amount: 0 },
                            // {type:"Blow Dry" , number : 0, amount:0},
                            { type: "Other Services", number: 0, amount: 0 }
                        ]
                    };
                })
            };
        });
        async.each(dates, function(date, callback) {
            Appointment.otherServicesWithfreeServices(date, function(err, data) {
                // console.log(data)
                callback();
            })
        }, function allTaskCompleted() {
            console.log('done');
            return res.json(dates);
        });
    });
});


// router.post('/report/membershipSold', function(req, res, next) {
//     var startDate = req.body.startDate;
//     var endDate = req.body.endDate;
//     var parlorIds = req.body.parlorIds ? req.body.parlorIds : [];
//     console.log(parlorIds)
//     var query = {
//         parlorId: { $in: parlorIds },
//         createdAt: { $gte: HelperService.getDayStart(startDate), $lt: HelperService.getDayEnd(endDate) }
//     };
//     if (parlorIds.length == 0) query = {
//         parlorId: req.session.parlorId,
//         createdAt: { $gte: HelperService.getDayStart(startDate), $lt: HelperService.getDayEnd(endDate) }
//     };
//     var d = [];
//     var async = require('async');
//     MembershipSale.find(query).exec(function(err, memberships) {
//         async.parallel([
//             function(done) {
//                 async.each(memberships, function(membership, callback) {
//                     MembershipSale.membershipsSold(membership, function(err, data) {
//                         d.push(data);
//                         callback();
//                     })
//                 }, done);
//             }
//         ], function allTaskCompleted() {
//             console.log('done');
//             return res.json(d);
//         });
//     });
// });

router.post('/paymentRazorPay', function(req, res, next) {
    var startDate = req.body.startDate;
    var endDate = req.body.endDate;
    var parlorIds = req.body.parlorId ? req.body.parlorId : [];
    var parlor = []
    _.forEach(parlorIds, function(par) {
        parlor.push(ObjectId(par))
    })
    console.log(parlor)
    var query = {
        parlorId: { $in: parlor },
        appointmentStartTime: { $gte: HelperService.getDayStart(startDate), $lt: HelperService.getDayEnd(endDate) },
        paymentMethod: 5,
        status: 3
    };
    if (parlorIds.length == 0) query = {
        parlorId: { $ne: null },
        appointmentStartTime: { $gte: HelperService.getDayStart(startDate), $lt: HelperService.getDayEnd(endDate) },
        paymentMethod: 5,
        status: 3
    };

    Appointment.aggregate([
            { $match: query },
            {
                $project: {
                    payableAmount: 1,
                    parlorAppointmentId: 1,
                    bookingMethod: 1,
                    allPaymentMethods: 1,
                    services: 1,
                    client: 1,
                    parlorName: 1,
                    parlorAddress: 1,
                    date: { '$dateToString': { format: '%m/%d/%Y', date: '$appointmentStartTime' } }
                }
            },
            {
                $group: {
                    _id: null,
                    data: {
                        $push: {
                            appointmentStartTime: "$date",
                            payableAmount: "$payableAmount",

                            parlorAppointmentId: "parlorAppointmentId",
                            bookingMethod: "$bookingMethod",
                            allPaymentMethods: "$allPaymentMethods",
                            services: "$services",
                            client: "$client",
                            parlorName: "$parlorName",
                            parlorAddress: "$parlorAddress",
                            employees: "$services.employees.name"
                        }
                    }
                }
            }
        ]).exec(function(err, data) {
            return res.json(CreateObjService.response(false, data[0].data));
        })
        // Appointment.find(query).sort({$natural: -1}).exec(function (err, appts) {
        //     var data = [];
        //     _.forEach(appts, function (appt) {
        //         var arr = {
        //             appointmentStartTime: (appt.appointmentStartTime).toDateString(),
        //             payableAmount: appt.payableAmount,
        //             parlorAppointmentId: appt.parlorAppointmentId,
        //             bookingMethod: appt.bookingMethod,
        //             allPaymentMethods: appt.allPaymentMethods,
        //             services: appt.services,
        //             client: appt.client,
        //             parlorName: appt.parlorName,
        //             parlorAddress: appt.parlorAddress2,
        //             employees: []
        //         };
        //         _.forEach(appt.services, function (ser) {
        //             _.forEach(ser.employees, function (emp) {
        //                 arr.employees.push(emp.name)
        //             })
        //         });
        //         data.push(arr)
        //     });
        //     return res.json(CreateObjService.response(false, data));
        // });
});

router.get('/paymentNearBy', function(req, res, next) {
    var startDate = req.body.startDate;
    var endDate = req.body.endDate;
    var parlorIds = req.body.parlorIds ? req.body.parlorIds : [];
    var query = {
        parlorId: { $in: parlorIds },
        appointmentStartTime: { $gte: HelperService.getDayStart(startDate), $lt: HelperService.getDayEnd(endDate) },
        couponCode: { $ne: null },
        "allPaymentMethods.value": 11,
        status: 3
    };
    if (parlorIds.length == 0) query = {
        parlorId: { $ne: null },
        appointmentStartTime: { $gte: HelperService.getDayStart(startDate), $lt: HelperService.getDayEnd(endDate) },
        couponCode: { $ne: null },
        "allPaymentMethods.value": 11,
        status: 3
    };
    Appointment.find(query, function(err, appts) {
        var data = [];
        _.forEach(appts, function(appt) {
            var arr = {
                appointmentStartTime: appt.appointmentStartTime,
                status: appt.status,
                tax: appt.tax,
                loyalityPoints: appt.loyalityPoints,
                couponCode: appt.couponCode,
                subtotal: appt.subtotal,
                discount: appt.discount,
                membersipCreditsLeft: appt.membersipCreditsLeft,
                creditUsed: appt.creditUsed,
                productPrice: appt.productPrice,
                membershipId: appt.membershipId,
                membershipDiscount: appt.membershipDiscount,
                payableAmount: appt.payableAmount,
                parlorAppointmentId: appt.parlorAppointmentId,
                bookingMethod: appt.bookingMethod,
                isPaid: appt.isPaid,
                allPaymentMethods: appt.allPaymentMethods,
                services: appt.services,
                client: appt.client
            };
            data.push(arr)
        });
        return res.json(CreateObjService.response(false, data));
    });
});


router.post('/deal', function(req, res) {
    Deals.aggregate({ $sort: { "dealId": -1 } }, { $limit: 1 }).exec(function(err, s) {
        console.log(err);
        console.log(req.body.newCombo);
        var count = s[0].dealId + 1;
        var deals = Deals.createNewObj(req, count);
        console.log(deals[0]);
        if (deals.length > 0) {
            Deals.create(deals, function(err, d) {
                console.log(err);
                AllDeals.create(deals[0], function(e, data) {
                    console.log(e);
                    if (err) return res.json(CreateObjService.response(true, 'Error creating new deals'));
                    else return res.json(CreateObjService.response(true, d));
                });
            });
        } else {
            return res.json(CreateObjService.response(true, 'No deals selected'));
        }
    });
});

router.post('/downloadDashboard', function(req, res, next) {
    var startDate = req.body.startDate;
    var endDate = req.body.endDate;
    var data = {
        weeklyMode: [{ type: 'Android', appt: 0, amount: 0, loyaltyPoints: 0 }, {
            type: 'IOS',
            appt: 0,
            amount: 0,
            loyaltyPoints: 0
        }, { type: 'Undefined', appt: 0, amount: 0, loyaltyPoints: 0 }],
        grandTotalWeekly: 0,
        totalMode: [{ type: 'Android', appt: 0, amount: 0 }, { type: 'IOS', appt: 0, amount: 0 }, {
            type: 'Undefined',
            appt: 0,
            amount: 0
        }],
        totalFreeServices: 0,
        grandTotal: 0
    };
    Appointment.find({
        "services.discountMedium": "frequency",
        "services.dealId": null,
        "services.dealPriceUsed": true,
        status: 3
    }).exec(function(err, app) {
        if (app) {
            data.totalFreeServices = app.length;
        }
        Appointment.find({
            status: 3,
            "razorPayCaptureResponse.status": "captured",
            appointmentStartTime: { $gte: HelperService.getDayStart(startDate), $lt: HelperService.getDayEnd(endDate) }
        }, { mode: 1, paymentMethod: 1, payableAmount: 1, allPaymentMethods: 1 }).exec(function(err, appt) {
            _.forEach(appt, function(ap) {
                if (ap.mode == 1) data.weeklyMode[0].appt++;
                else if (ap.mode == 2) data.weeklyMode[1].appt++;
                else data.weeklyMode[2].appt++;
                if (ap.allPaymentMethods > 0) {
                    _.forEach(ap.allPaymentMethods, function(pay) {
                        if (ap.mode == 1 && pay.value == 5) {
                            data.weeklyMode[0].amount += ap.payableAmount + (ap.loyalityPoints * 0.75);
                            data.grandTotalWeekly += ap.payableAmount + (ap.loyalityPoints * 0.75)
                        } else if (ap.mode == 2 && pay.value == 5) {
                            data.weeklyMode[1].amount += ap.payableAmount + (ap.loyalityPoints * 0.75);
                            data.grandTotalWeekly += ap.payableAmount + (ap.loyalityPoints * 0.75)
                        } else if (pay.value == 5) {
                            data.weeklyMode[2].amount += ap.payableAmount + (ap.loyalityPoints * 0.75);
                            data.grandTotalWeekly += ap.payableAmount + (ap.loyalityPoints * 0.75)
                        }
                    })
                } else {
                    if (ap.mode == 1 && ap.paymentMethod == 5) {
                        data.weeklyMode[0].amount += ap.payableAmount;
                        data.grandTotalWeekly += ap.payableAmount
                    } else if (ap.mode == 2 && ap.paymentMethod == 5) {
                        data.weeklyMode[1].amount += ap.payableAmount;
                        data.grandTotalWeekly += ap.payableAmount
                    } else if (ap.paymentMethod == 5) {
                        data.weeklyMode[2].amount += ap.payableAmount;
                        data.grandTotalWeekly += ap.payableAmount
                    }
                }
            });
            Appointment.find({ status: 3, "razorPayCaptureResponse.status": "captured" }, {
                mode: 1,
                paymentMethod: 1,
                payableAmount: 1,
                allPaymentMethods: 1
            }).exec(function(err, totalApp) {
                _.forEach(totalApp, function(t) {
                    if (t.mode == 1) data.totalMode[0].appt++;
                    else if (t.mode == 2) data.totalMode[1].appt++;
                    else data.totalMode[2].appt++;
                    if (t.allPaymentMethods > 0) {
                        _.forEach(t.allPaymentMethods, function(pay) {
                            if (t.mode == 1 && pay.value == 5) {
                                data.totalMode[0].amount += t.payableAmount;
                                data.grandTotal += t.payableAmount;
                            } else if (t.mode == 2 && pay.value == 5) {
                                data.totalMode[1].amount += t.payableAmount;
                                data.grandTotal += t.payableAmount;
                            } else if (pay.value == 5) {
                                data.totalMode[2].amount += t.payableAmount;
                                data.grandTotal += t.payableAmount;
                            }
                        })
                    } else {
                        if (t.mode == 1 && t.paymentMethod == 5) {
                            data.totalMode[0].amount += t.payableAmount;
                            data.grandTotal += t.payableAmount;
                        } else if (t.mode == 2 && t.paymentMethod == 5) {
                            data.totalMode[1].amount += t.payableAmount;
                            data.grandTotal += t.payableAmount;
                        } else if (t.paymentMethod == 5) {
                            data.totalMode[2].amount += t.payableAmount;
                            data.grandTotal += t.payableAmount;
                        }
                    }
                });
                return res.json(CreateObjService.response(false, data));
            })
        });
    });
});

router.post('/listReviews', function(req, res) {
    var parlorIds = req.body.parlorId ? req.body.parlorId : [];
    var query = { parlorId: { $in: parlorIds }, review: { $exists: true }, "review.rating": { $lte: 3 } };
    if (parlorIds.length == 0) query = { parlorId: { $ne: null }, review: { $exists: true }, "review.rating": { $lte: 3 } };
    Appointment.find(query, {
        parlorId: 1,
        parlorName: 1,
        parlorAddress: 1,
        "services.name": 1,
        "services.employees": 1,
        "client.name": 1,
        "client.phoneNumber": 1,
        appointmentStartTime: 1,
        review: 1
    }, function(err, reviews) {
        return res.json(CreateObjService.response(false, reviews));
    })
});

router.post('/editReviews', function(req, res) {
    console.log(req.body)
    Appointment.update({
        _id: req.body.apptId,
        review: { $exists: true },
        "client.clientNo": req.body.phoneNumber
    }, { "review.rating": req.body.rating }).exec(function(err, data) {
        console.log(data)
        return res.json(CreateObjService.response(false, data));
    })
});

router.get('/bankDetailsParlor', function(req, res, next) {
    SettlementReport.findOne({ period: req.body.period, parlorId: req.body.parlorId }, {
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
})

router.post('/notificationChanges', function(req, res, next) {
    var nodemailer = require('nodemailer');
    var data1 = "";
    var data2 = "";
    var d = [];
    if (req.body.text) {
        data1 = { type: req.body.type, title: req.body.title, body: req.body.text, sImage: req.body.sImage, lImage: req.body.lImage }
    }
    if (req.body.text1) {
        data2 = { type: req.body.type, title: req.body.title, body: req.body.text1, sImage: req.body.sImage, lImage: req.body.lImage }
    }
    if (req.body.type == 'update') {
        console.log("update")
        for (var i = 0; i < 130; i++) {
            User.find({ $or: [{ firebaseId: { $exists: true } }, { firebaseIdIOS: { $exists: true } }] }, {
                firebaseId: 1,
                firebaseIdIOS: 1,
                androidVersion: 1,
                iosVersion: 1,
            }).skip(1000 * i).limit(1000).exec(function(err, users) {
                console.log(users)
                var fbId = [],
                    fbIos = [];
                _.forEach(users, function(user) {
                    var versionAndroid = user.androidVersion,
                        versionIos = user.iosVersion;
                    var currentAndroidVersion = "1.1.1.2",
                        currentIosVersion = "1.18";
                    var showUpdateDialog = true;
                    if (versionAndroid == currentAndroidVersion) showUpdateDialog = false;
                    else if (versionIos == currentIosVersion) showUpdateDialog = false;
                    if (showUpdateDialog == true) {
                        if (user.firebaseId) fbId.push(user.firebaseId);
                        if (user.firebaseIdIOS) fbIos.push(user.firebaseIdIOS);
                    }
                })
                async.parallel([
                    function(done) {
                        // async.each([1, 2], function(p, callback) {
                        //     if (p == 1) {
                        //         Appointment.sendAppNotificationAdmin(fbId, data1, function(err, data) {
                        //             d.push(data);
                        //             callback();
                        //         })
                        //         console.log("android")
                        //     }
                        //     if (p == 2) {
                        //         Appointment.sendAppNotificationIOSAdmin(fbIos, data2, function(err, data) {
                        //             d.push(data);
                        //             callback();
                        //         })
                        //         console.log("ios")
                        //     }
                        // }, done);
                    }
                ], function allTaskCompleted() {
                    console.log('done');
                    return res.json(d);
                });
            })
        }
    } else if (req.body.testingNumber) {
        console.log("aaya")
        User.find({ phoneNumber: req.body.testingNumber }, { firebaseId: 1, firebaseIdIOS: 1, }).exec(function(err, users) {
            console.log(users)
            var fbId = [],
                fbIos = [];
            if (users[0].firebaseId) fbId.push(users[0].firebaseId);
            if (users[0].firebaseIdIOS) fbIos.push(users[0].firebaseIdIOS);

            async.parallel([
                function(done) {
                    async.each([1, 2, 3], function(p, callback) {
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
    } else {
        console.log("else")
        Notification.create(Notification.getNewObj(req), function(err, notify) {
            if (notify) {
                data1.notificationId = notify.id;
                data2.notificationId = notify.id;
            }

            for (var i = 0; i < 144; i++) {
                // User.find({ $or: [{ firebaseId: { $exists: true } }, { firebaseIdIOS: { $exists: true } }] }, {
                //     firebaseId: 1,
                //     firebaseIdIOS: 1
                // }).skip(1000 * i).limit(1000).exec(function(err, users) {
                var d = [];
                User.find({}, { firebaseId: 1, firebaseIdIOS: 1 }).skip(1000 * i).limit(1000).exec(function(err, users) {
                    // User.find({ createdAt: { $gt: new Date(2017, 10, 1) }, gender: "F" }, { latitude: 1, longitude: 1, createdAt: 1, firebaseId: 1, firebaseIdIOS: 1 }, function(err, users) {
                    //         async.each(users, function(u, call) {
                    //             var cityId = ConstantService.getCityId(u.latitude, u.longitude)

                    //             if (cityId == 2) {
                    //                 d.push(u)

                    //                 call()
                    //             } else {
                    //                 call()
                    //             }
                    //         }, function allTaskCompleted() {
                    // res.json(d)

                    var fbId = [],
                        fbIos = [];

                    _.forEach(users, function(user) {
                        if (user.firebaseId) fbId.push(user.firebaseId);
                        if (user.firebaseIdIOS) fbIos.push(user.firebaseIdIOS);
                    })
                    console.log(fbId.length)
                    console.log(fbIos.length)
                    async.parallel([
                        function(done) {
                            async.each([1, 2, 3], function(p, callback) {
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

                // })
            }
        })
    }
});

router.post('/createDailyOffers', function(req, res) {
    var dataRed = {},
        dataBlue = {},
        dataGreen = {},
        dataUndefined = {};
    if (req.body.titleRed) {
        DailyOffer.create({
            action: "offer",
            title: req.body.titleRed,
            body: req.body.textRed,
            type: 0,
            gender: req.body.gender,
            dealId: parseInt(req.body.dealId)
        }, function(err, offer) {
            if (offer)
                return res.json(CreateObjService.response(false, "Created Successfully"));
            else
                return res.json(CreateObjService.response(true, "There is some error"));
        })
    }
    if (req.body.titleBlue) {
        DailyOffer.create({
            action: "offer",
            title: req.body.titleBlue,
            body: req.body.textBlue,
            type: 1,
            gender: req.body.gender,
            dealId: parseInt(req.body.dealId)
        })
    }
    if (req.body.titleGreen) {
        DailyOffer.create({
            action: "offer",
            title: req.body.titleGreen,
            body: req.body.textGreen,
            type: 2,
            gender: req.body.gender,
            dealId: parseInt(req.body.dealId)
        })
    }
    if (req.body.titleUndefined) {
        DailyOffer.create({
            action: "offer",
            title: req.body.titleUndefined,
            body: req.body.textUndefined,
            type: 3,
            gender: req.body.gender,
            dealId: parseInt(req.body.dealId)
        })
    }

})

router.get('/deal', function(req, res) {
    Deals.find({ dealId: req.query.dealId }, function(err, deals) {
        AllDeals.find({ dealId: req.query.dealId }, { parlorTypesDetail: 1 }, function(err, allDeals) {
            var serviceCode = {
                $in: _.map(deals[0].services, function(s) {
                    return s.serviceCode
                })
            };
            Service.find({ serviceCode: serviceCode }, function(err, services) {
                if (deals.length > 0)
                    return res.json(CreateObjService.response(false, Deals.parseDealsForMultipleParlors(deals, services, allDeals)));
                else
                    return res.json(CreateObjService.response(true, 'Invalid dealId'));
            });
        });
    });
});

router.put('/deal', function(req, res) {
    req.body.dealParlorId = req.body.dealParlorId || 90000000000;
    console.log(req.body.dealParlorId)
    Deals.findOne({ dealId: req.body.dealParlorId }, function(err, deal) {
        console.log(err);
        // console.log(deal);
        var newBrands = _.map(req.body.brands || [], function(brand) {
            return {
                brandId: brand.brandId,
                ratio: brand.ratio,
                parlorLatLongs : brand.parlorLatLongs,
                name: brand.name,
                products: _.map(brand.products || [], function(p) {
                    return {
                        productId: p.productId,
                        name: p.name,
                        ratio: p.ratio
                    }
                })
            }
        });
        if (deal) {
            console.log("here");
            console.log("=--------------------------------=");
            Deals.create(Deals.createNewDealObjForParlor(req, deal), function(err, data) {
                console.log(err);
                if (err) return res.json(CreateObjService.response(true, 'Error in getting edditing deal'));
                else return res.json(CreateObjService.response(false, 'Created Deal'));
            });
        } else {
            Deals.update({ _id: req.body.dealId }, {
                menuPrice: req.body.menuPrice,
                dealPrice: req.body.dealPrice,
                dealPercentage: req.body.dealPercentage,
                'dealType.price': req.body.price,
                brands: newBrands
            }, function(err, data) {
                if (err) return res.json(CreateObjService.response(true, 'Error in getting edditing deal'));
                else return res.json(CreateObjService.response(false, 'updated'));
            });
        }
    })

});

router.post('/deletedeal', function(req, res) {
    console.log("SDAdsasda");
    console.log(req.body.dealId);
    Deals.remove({ _id: req.body.dealId }, function(err, data) {
        console.log(err);
        if (err) return res.json(CreateObjService.response(true, 'Error in deleting deal'));
        else return res.json(CreateObjService.response(false, 'deleted'));
    });
});

router.get('/allServices', function(req, res) {
    Service.find({}, function(err, services) {
        return res.json(CreateObjService.response(false, _.map(services, function(s) {
            return {
                serviceId: s._id,
                serviceCode: s.serviceCode,
                name: s.name,
                subTitle: s.subTitle,
                gender: s.gender,
            }
        })));
    });
});


router.get('/cancelledAppointments', function(req, res) {
    console.log(req.query)
    var page = req.query.page ? req.query.page : 1;
    var perPage = 2000;
    Appointment.find({ status: 2, appointmentType : 3 , appointmentStartTime:{$gte: HelperService.getDayStart(req.query.startDate) , $lte: HelperService.getDayEnd(req.query.endDate)} },{'client.name' :1, 'client.phoneNumber' :1, payableAmount :1, appointmentStartTime :1, 'services.name' :1, subtotal :1, appointmentType :1, status:1}).sort({ appointmentStartTime: -1 }).limit(perPage).skip(perPage * (page - 1)).exec(function(err, data) {
        var finalData =[];
        if(data.length>0){
            async.each(data , function (d , callback) {
                Appointment.find({status : 3 , appointmentType : {$ne : 3} , appointmentStartTime:{$gte: HelperService.getDayStart(req.query.startDate) , $lte: HelperService.getDayEnd(req.query.endDate)}, 'client.phoneNumber' : d.client.phoneNumber}, {'client.name' :1, 'client.phoneNumber' :1, payableAmount :1, appointmentStartTime :1, 'services.name' :1, subtotal :1, appointmentType :1, status:1} , function(err , appt){
                    if(appt.length>0){
                        console.log(appt)
                        appt.push(d)
                        finalData.push(appt);
                        callback();
                    } 
                    else{
                        finalData.push([d])
                        callback();
                    }
                })
            }, function all(){
                
                return res.json(CreateObjService.response(false, finalData));
            })
        }else return res.json(CreateObjService.response(true, 'Error in getting cancelled appointments'));
    });
});


router.get('/addServices', function(req, res) {
    Parlor.findOne({ _id: "5a4b44b736669b1eb672900e" }, function(err, parlor) {
        var services = parlor.services;
        console.log(err);
        console.log('parlor found');
        _.forEach(services, function(s) {
            _.forEach(s.prices, function(p) {
                p.employees = [];
            });
        });
        // var gender = req.body.gender;
        // services = _.filter(services, function(s) {
        //     return s.gender == "M";
        //     // if(gender == 2) return s.gender == "F";
        //     // else return true;
        // });
        Parlor.update({ _id: "5b76a033f4f2597f3b9a9494"}, { services: services }, function(err, d) {
            res.json(d);
        });
    });
});

router.post('/createParlor', function(req, res) {
    console.log(req.body)
    var response = { error: true };

    Parlor.findOne({ _id: req.body.serviceFrom }, function(err, parlor) {
        var services = parlor.services;
        console.log(err);
        console.log('parlor found');
        _.forEach(services, function(s) {
            _.forEach(s.prices, function(p) {
                p.employees = [];
            });
        });
        var gender = req.body.gender;
        services = _.filter(services, function(s) {
            if (gender == 3) return s.gender == "M";
            if (gender == 2) return s.gender == "F";
            else return true;
        });

        Parlor.create(Parlor.getNewParlorObj(req), function(err, parlor) {
            if (err) {
                console.log(err);
                console.log("error in creating new parlor");
                response.message = 'Error in creating new parlor';
                return res.json(response);
            } else {
                createLuckyDarw(parlor._id);
                createIncentives(parlor._id);
                Parlor.createParlorNameData(parlor._id);
                var user = {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    emailId: req.body.emailId,
                    phoneNumber: req.body.phoneNumber,
                    password: req.body.password,
                    gender: req.body.gender
                };
                user.parlorId = parlor._id;
                console.log(parlor._id);
                user.role = 2;
                Parlor.update({ _id: parlor._id }, { services: services }, function(err, updated) {
                    createDeals(parlor._id, req.body.dealsFrom, function(d) {
                        ParlorItem.copyItemToParlor(req.body.dealsFrom);
                        console.log("done creating deals");
                        if (user.firstName) {
                            Admin.create(user, function(err, user) {
                                console.log(err);
                                if (err) {
                                    console.log("sdsad");
                                    parlor.remove(function(err) {
                                        console.log(err);
                                        response.message = 'Error in creating managers account';
                                        return res.json(response);
                                    });
                                } else {
                                    response.error = false;
                                    if (req.body.ownerId != "0") {
                                        Admin.update({ _id: req.body.ownerId }, { $push: { parlorIds: parlor._id } }, function(err, updatedItem) {
                                            return res.json(response);
                                        });
                                    }
                                }
                                return res.json(response);
                            });
                        } else {
                            return res.json(response);
                        }

                    });
                });
            }
        });
    });
});

function createLuckyDarw(parlorId) {
    LuckyDrawModel.findOne({}, { createdAt: 0, _id: 0, updatedAt: 0, __v: 0, parlorId: 0 }, function(err, drawModel) {
        if (err) {
            console.log("Server Error");
        } else {

            var drawData = drawModel.toJSON();
            drawData.parlorId = parlorId;

            LuckyDrawModel.create(drawData, function(err, drawModelCreated) {
                if (err) {
                    console.log("Failed to create model");
                } else {
                    console.log("Model created");
                }
            })
        }
    })
};


function createIncentives(parlorId) {
    Parlor.findOne({ _id: parlorId }, { parlorType: 1, name: 1, address2: 1, active: 1 }, function(err, parlor) {
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
                if (err) {
                    console.log("Error in Creating Incentives");
                } else {
                    console.log("Incentives created");
                }
            })
        })
    })
};

function createDeals(parlorId, dealsCopyFrom, callback) {
    var dealsToBeUpdatedParlorId = parlorId;
    Deals.find({ parlorId: dealsCopyFrom }, function(err, deals) {
        var data = [];
        _.forEach(deals, function(s) {
            data.push({
                name: s.name,
                description: s.description,
                menuPrice: s.menuPrice,
                shortDescription: s.shortDescription,
                category: s.category,
                categoryIds: s.categoryIds,
                parlorTypes: s.parlorTypes,
                active: s.active,
                isDeleted: s.isDeleted,
                dealId: s.dealId,
                genders: s.genders,
                brands: s.brands,
                sort: s.sort,
                dealSort: s.dealSort,
                dealPrice: s.dealPrice,
                dealPercentage: s.dealPercentage,
                startDate: s.startDate,
                endDate: s.endDate,
                showOnApp: s.showOnApp,
                hours: s.hours,
                gender: s.gender, // WM - unisex , M - male, F - female
                tax: s.tax,
                weekDay: s.weekDay, // 1- all days, 2 = weekday , 3 = weekend
                dealType: s.dealType,
                couponCode: s.couponCode,
                parlorId: dealsToBeUpdatedParlorId,
                services: s.services,
                newCombo: s.newCombo,
                slabId: s.slabId,
                active: 1,
            });
        });
        Deals.create(data, function(err, d) {
            return callback();
        });
    });
}

router.post('/createIncentive', function(req, res) {
    IncentiveCopy.create(Incentive.getNewIncentiveObj(req), function(err, incentive) {
        if (err) {
            console.log(err);
            console.log("error in creating new object");
            // response.message = 'Error in creating new object';
            return res.json("can't create");
        } else {
            return res.json('successfully created');
        }
    });
});


router.post('/editIncentive', function(req, res) {
    if (req.body.parlorId) {
        Incentive.update({ parlorId: req.body.parlorId }, { categories: req.body.categories }, function(err, incentives) {
            if (incentives) {
                return res.json(CreateObjService.response(false, incentives));
            } else {
                return res.json(CreateObjService.response(true, incentives));

            }
        })
    } else {
        Incentive.find({}, function(err, incentives) {
            if (incentives) {
                return res.json(CreateObjService.response(false, incentives));
            } else {
                return res.json(CreateObjService.response(true, incentives));

            }
        })
    }
});

router.post('/editSalonIncentive', function(req, res) {
    if (req.body.id) {
        SalonManagerIncentive.update({ _id: req.body.id }, { levels: req.body.levels }, function(err, incentives) {
            if (incentives) {
                return res.json(CreateObjService.response(false, incentives));
            } else {
                return res.json(CreateObjService.response(true, incentives));

            }
        })
    } else {
        SalonManagerIncentive.find({}, function(err, incentives) {
            if (incentives) {
                return res.json(CreateObjService.response(false, incentives));
            } else {
                return res.json(CreateObjService.response(true, incentives));

            }
        })
    }
});

router.post('/report/empSegmentReport', function(req, res) {
    var startDate = req.body.startDate;
    var endDate = req.body.endDate;
    console.log(startDate, endDate);
    var parlorIds = req.body.parlorIds ? req.body.parlorIds : [];
    var query = {  parlorId: { $in: parlorIds } };
    if (parlorIds.length == 0) query = { parlorId: { $ne: null } };
    var d = [];
    var async = require('async');
    console.log(query)
    Admin.find(query).exec(function(err, employees) {
        async.parallel([
            function(done) {
                async.each(employees, function(employee, callback) {
                    console.log(employee.firstName + "-" + employee.id);
                    Appointment.employeeSegmentReport(employee, startDate, endDate, function(err, data) {
                        d.push(data);
                        console.log("getting data success for " + employee.firstName);
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

router.post('/report/empPerformanceReport', function(req, res) {
    var parlorIds = req.body.parlorIds ? req.body.parlorIds : [];
    var query = {parlorId: { $in: parlorIds } };
    if (parlorIds.length == 0) query = {parlorId: { $ne: null } };
    var d = [];
    var month = req.body.month;
    var async = require('async');
    Admin.find(query).exec(function(err, employees) {
        async.parallel([
            function(done) {
                async.each(employees, function(employee, callback) {
                    console.log(employee.firstName);
                    Appointment.employeePerformanceReport(employee, month, function(err, data) {
                        d.push(data);
                        console.log("getting data success for " + employee.firstName);
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


router.post('/report/branchReport', function(req, res) {
    console.log("branch report")
    console.log(req.body)

    var startDate = req.body.startDate;
    var endDate = req.body.endDate;
    var d = [];
    // var parlorIds = req.body.parlorIds ? req.body.parlorIds : [];
    // var query = { _id: { $in: parlorIds } };
    // if (parlorIds.length == 0) query = {};
    var todayDate = new Date()
    var query = { active: req.body.active };
    console.log(query);
    var async = require('async');
    console.log(query)
    Parlor.find(query, { _id: 1, name: 1, address2: 1, parlorLiveDate: 1 }).exec(function(err, parlors) {
        console.log(err)
        console.log("paaaa" ,parlors.length)
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

router.post('/report/oldNewAvgVisit', function(req, res) {
    var startDate = req.body.startDate;
    var endDate = req.body.endDate;
    var d = [];
    var parlorIds = req.body.parlorIds ? req.body.parlorIds : [];
    var query = { _id: { $in: parlorIds } };
    if (parlorIds.length == 0) query = {};
    var async = require('async');
    Parlor.find(query, { _id: 1, name: 1, address2: 1 }, function(err, parlors) {
        async.parallel([
            function(done) {
                async.each(parlors, function(parlor, callback) {
                    console.log(parlor.name);
                    Appointment.oldNewAvgVisit(parlor, startDate, endDate, function(err, data) {
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


router.post('/report/oldNewBranchSeg', function(req, res) {
    var startDate = req.body.startDate;
    var endDate = req.body.endDate;
    var d = [];
    var parlorIds = req.body.parlorIds ? req.body.parlorIds : [];
    var query = { _id: { $in: parlorIds } };
    if (parlorIds.length == 0) query = {};
    var async = require('async');
    Parlor.find(query, { _id: 1, name: 1, address2: 1 }, function(err, parlors) {
        async.parallel([
            function(done) {
                async.each(parlors, function(parlor, callback) {
                    console.log(parlor.name);
                    Appointment.oldNewBranchSeg(parlor, startDate, endDate, function(err, data) {
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

router.post('/report/empAttendance', function(req, res) {

    console.log([1 + 1])

    var sdate = HelperService.getDayStart(req.body.startDate);
    var edate = HelperService.getDayEnd(req.body.endDate);
    console.log(sdate)
    console.log(edate)
    var att = [];
    var data = { shifts: [] };

    var final = [];
    var shifts = [];
    var eid = req.body.eId;
    // var  query= {"centerId":"kabi122018","employeeId":"588a10ebf8169604955dce95","time":{$gte:sdate,$lt:edate}}
    var query = { "employeeId": eid, "time": { $gte: sdate, $lt: edate } }
        // Attendance.find(query).sort({time:1}).exec(function (err,result) {
        // { employeeId : "1111111111" }
        //     Attendance.aggregate( [ { $match : query },{ $sort : { time:1 } },{$group:{_id:"$centerId",data: { $push:  { time: "$time", centerId: "$centerId" } }}}]).exec(function (err,result) {
    Attendance.aggregate([{ $match: query }, { $sort: { time: 1 } }, {
        $group: {
            _id: {
                "cid": "$centerId",
                "date": { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }
            },
            data: { $push: { time: "$time", centerId: "$centerId" } }
        }
    }]).exec(function(err, result) {


        console.log(result.length)
        if (result.length > 0) {
            result.map(function(d) {
                var obj = { "from": '', "to": '', "centerName": '' };

                for (var i = 0; i < d.data.length; i++) {

                    if (i % 2 == 0) {
                        obj.from = d.data[i].time;
                        obj.centerName = d.data[i].centerId;
                        if ((i + 1) == d.data.length) {
                            att.push(obj);
                            obj = { "from": '', "to": '', "centerName": '' };
                        }
                        // att.push({"from":d.data[i].time}) ;
                    } else if (i % 2 == 1) {
                        obj.to = d.data[i].time;
                        // att.push({"to":d.data[i].time});
                        att.push(obj);
                        obj = { "from": '', "to": '', "centerName": '' };

                    }
                }

            });
            console.log(att)
                /* var grouped  = _.chain(data)
                 .groupBy('category')
                 .map(function(val, key) {


                 }*/
            var grouped = _.map(_.groupBy(att, function(item) {
                console.log(item.from.toString())
                return item.from.toString().slice(0, 15);
            }), function(i, key) {
                return {
                    date: new Date(key).toJSON(),
                    shifts: i
                }
            });
            res.json(grouped);
        } else {
            res.json("");
        }

    });


});


router.post('/createRecommendation', function(req, res) {
    Recommendation.create(Recommendation.getNewObjRecomm(req), function(err, data) {
        if (data) {
            return res.json(CreateObjService.response(false, "Success"));
        } else
            console.log(err)
    })
});

router.post('/getSettlementAppointments', function(req, res) {

    SettlementReport.find({ parlorId: req.body.parlorId, period: req.body.period }, {
        startDate: 1,
        endDate: 1
    }).exec(function(err, settle) {
        Appointment.find({
            parlorId: req.body.parlorId,
            appointmentStartTime: { $gte: settle[0].startDate, $lt: settle[0].endDate },
            status: 3
        }, function(err, appt) {
            console.log(appt)
            var allData = [];
            async.each(appt, function(a, cbs) {

                console.log(a)
                Beu.findOne({ _id: a.closedBy }, function(err, beu) {
                    var closedByName;
                    if (beu) {
                        closedByName = "Beu"
                    } else {
                        closedByName = "Salon"

                    }


                    var obj = Appointment.parse(a);
                    obj.appType = a.appointmentType == 1 ? "Walkin" : a.appointmentType == 2 ? "Call" : a.appointmentType == 3 ? "Online" : "";
                    obj.parlorName = a.parlorName;
                    obj.membershipCreditsUsed = a.creditUsed;
                    obj.clientFirstAppointment = a.clientFirstAppointment;
                    obj.superSetServices = Appointment.populateServices(a.superSetServices);
                    obj.closedByName = closedByName;
                    obj.parlorAddress = a.parlorAddress;
                    console.log(obj)
                    allData.push(obj)
                    cbs();

                })

            }, function(done) {
                console.log(allData)
                return res.json(CreateObjService.response(false, allData));


            })

        })
    })
})

router.post('/getSettlementAppointmentsAll', function(req, res) {
    SettlementReport.find({ parlorId: req.body.parlorId, period: req.body.period }, {
        startDate: 1,
        endDate: 1
    }).exec(function(err, settle) {
        Parlor.find({ active: true }, { name: 1 }, function(err, parlors) {

            var parlorsd = _.map(parlors, function(p) {
                return p._id
            })


            console.log("parlorsssssssssssssssssss", parlorsd)
            Appointment.find({
                parlorId: { $in: parlorsd },
                appointmentStartTime: { $gte: settle[0].startDate, $lt: settle[0].endDate },
                status: 3
            }, function(err, appt) {
                console.log(appt)
                var allData = [];
                async.each(appt, function(a, cbs) {

                    console.log(a)
                    Beu.findOne({ _id: a.closedBy }, function(err, beu) {
                        var closedByName;
                        if (beu) {
                            closedByName = "Beu"
                        } else {
                            closedByName = "Salon"

                        }


                        var obj = Appointment.parse(a);
                        obj.appType = a.appointmentType == 1 ? "Walkin" : a.appointmentType == 2 ? "Call" : a.appointmentType == 3 ? "Online" : "";
                        obj.parlorName = a.parlorName;
                        obj.membershipCreditsUsed = a.creditUsed;
                        obj.clientFirstAppointment = a.clientFirstAppointment;
                        obj.superSetServices = Appointment.populateServices(a.superSetServices);
                        obj.closedByName = closedByName;
                        obj.parlorAddress = a.parlorAddress;
                        console.log(obj)
                        allData.push(obj)
                        cbs();

                    })

                }, function(done) {
                    console.log(allData)
                    return res.json(CreateObjService.response(false, allData));


                })

            })
        })
    })
})

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
    Parlor.find(query, {services: 0}).exec(function(err, parlors) {
        console.log(parlors.length)
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


router.post('/report/weeklyReport', function(req, res) {
    var month = req.body.month;
    var year = req.body.year;
    console.log(year)
    var d = [];
    var parlorIds = req.body.parlorIds;
    var query = { _id: { $in: parlorIds } };
    Parlor.find(query, { name: 1, address2: 1, id: 1 }).exec(function(err, parlors) {
        async.each(parlors,
            function(parlor, callback) {
                console.time(parlor.name);
                Appointment.weeklyReport(parlor, month,year, function(err, data) {
                    d.push(data);
                    console.timeEnd(parlor.name);
                    callback();
                });
            },
            function(err) {
                console.timeEnd("time");
                d.forEach(function(dd) {
                    dd.weekData.sort(function(a, b) {
                        return a.weekNumber - b.weekNumber;
                    });
                })
                return res.json(d);
            });
    });
});


router.post('/incentiveModel', function(req, res) {
    console.log(req.body)
    Incentive.findOne({ parlorId: req.body.parlorId }).exec(function(err, incentive) {
        var categoryData = [];

        _.forEach(incentive.categories, function(category) {
            categoryData.push({
                categoryName: category.categoryName,
                categoryId: category.categoryId,
                categorySort: category.sort,
                incentive: _.map(category.incentives, function(i) {
                    var obj = {
                        range: i.range,
                        incentive: i.incentive
                    };
                    return obj;

                })
            });
        });

        return res.json(CreateObjService.response(false, categoryData));
    });

});


router.post('/report/empIncentiveReport', function(req, res) {

    var d = [];
    var startDate = req.body.startDate ? new Date(req.body.startDate) : new Date(2017, 0, 1, 23, 59, 59);
    var endDate = req.body.endDate ? new Date(req.body.endDate) : new Date(2017, 1, 22, 23, 59, 59);
    var startDate = HelperService.getCurrentMonthStart(startDate)
    var endDate = HelperService.getCustomMonthEndDate(endDate.getFullYear(), endDate.getMonth()+1)
    console.log(startDate)
    console.log(endDate)
    // var parlorIds = req.body.parlorId ? req.body.parlorId : [];
    // console.log(parlorIds)
    // var query = { active: true, parlorId: { $in: parlorIds } };
    // if (parlorIds.length == 0) query = { active: true, parlorId: { $ne: null } };
    var async = require('async');
    Admin.find({ parlorId: req.body.parlorId }).exec(function(err, employees) {
        async.parallel([
            function(done) {
                async.each(employees, function(employee, callback) {
                    // console.log(employee.firstName);
                    Appointment.employeeIncentiveReport(employee, startDate, endDate, function(err, data) {
                        d.push(data);
                        // console.log("getting data success for " + employee.firstName);
                        callback();
                    })
                }, done);
            }
        ], function allTaskCompleted() {
            return res.json(d);
        });
    });
});

router.post('/couponCodeListing', function(req, res) {
    var d = [];
    var c = req.body.couponCode;
    if (c) {
        Offer.findOne({ code: c }).exec(function(err, code) {
            if (code) {
                var query2 = { couponCode: c };
                Appointment.find(query2).exec(function(err, appt) {
                    if (appt.length > 0) {
                         var data = {};
                        _.forEach(appt, function(app){
                            if(app.status == 3){
                               
                                    data.parlorName = app.parlorName,
                                    data.parlorAddress= app.parlorAddress,
                                    data.couponCode= app.couponCode,
                                    data.status= app.status,
                                    data.active= code.active,
                                    data.amount= app.payableAmount,
                                    data.clientName= app.client.name,
                                    data.clientNumber= app.client.phoneNumber,
                                    data.services= [],
                                    data.appointmentStartTime= (app.appointmentStartTime).toDateString(),
                                    data.services = _.map(app.services, function(ser){return  ser.name })
                               
                            }
                        })
                        
                        return res.json(CreateObjService.response(false, data));
                    } else {
                        return res.json(CreateObjService.response(true, "Coupon exists but not used."))
                    }
                });
            } else
                return res.json(CreateObjService.response(true, "Coupon does not exist!"));
        })
    } else {
        var startDate = req.body.startDate;
        var endDate = req.body.endDate;
        var parlorIds = req.body.parlorId ? req.body.parlorId : [];
        var query = {};
        if (parlorIds.length == 0) query = {
            parlorId: { $ne: null },
            status: 3,
            couponCode: { $regex: "BEU" },
            appointmentStartTime: { $gte: HelperService.getDayStart(startDate), $lt: HelperService.getDayEnd(endDate) }
        };
        else query = {
            parlorId: { $in: parlorIds },
            status: 3,
            couponCode: { $regex: "BEU" },
            appointmentStartTime: { $gte: HelperService.getDayStart(startDate), $lt: HelperService.getDayEnd(endDate) }
        };
        var async = require('async');
        Appointment.find(query).sort({ $natural: -1 }).exec(function(err, appointments) {
            async.parallel([
                function(done) {
                    async.each(appointments, function(appointment, callback) {
                        Appointment.couponCodeListing(appointment, function(err, data) {
                            d.push(data);
                            callback();
                        })
                    }, done);
                }
            ], function allTaskCompleted() {
                if (d) return res.json(CreateObjService.response(false, d));
                else return res.json(CreateObjService.response(true, "Invalid Coupon"))
            });
        });
    }
});


router.post('/activateCoupon', function(req, res) {
    Offer.update({ code: req.body.couponCode }, { active: true }, function(err, updated) {
        if (!err)
            res.json("Activated")
        else
            res.json('there is some error')
    })
})

router.post('/report/dayWiseReport', function(req, res) {
    console.log("hello")
    var startDate = req.body.startDate ? req.body.startDate : new Date(2017, 5, 1, 23, 59, 59);
    var endDate = req.body.endDate ? req.body.endDate : new Date(2017, 5, 21, 23, 59, 59);
    var dates = { startDate: startDate, endDate: endDate };
    var d = [];
    // var employees=[];
    var async = require('async');
    Parlor.find({}, { _id: 1, name: 1 }).exec(function(err, parlors) {
        async.parallel([
            function(done) {
                async.each(parlors, function(parlor, callback) {
                    console.log(parlor.name);
                    Appointment.dayWiseAdminReport(parlor, dates, function(err, data) {
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


router.post('/report/timeWiseReport', function(req, res) {
    console.log("hello")
    var startDate = req.body.startDate ? req.body.startDate : new Date(2017, 1, 27, 23, 59, 59);
    var endDate = req.body.endDate ? req.body.endDate : new Date(2017, 3, 25, 23, 59, 59);
    var d = [];
    var employees = [];
    var async = require('async');
    Parlor.find({}, { _id: 1, name: 1 }).skip(5).limit(1).exec(function(err, parlors) {
        async.parallel([
            function(done) {
                async.each(parlors, function(parlor, callback) {
                    console.log(parlor.name);
                    Appointment.timeWiseAdminReport(parlor, startDate, endDate, employees, function(err, data) {
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


router.post('/report/serviceRepetitionReport', function(req, res) {
    console.log("hello")
    var startDate = req.body.startDate ? req.body.startDate : new Date(2017, 1, 27, 23, 59, 59);
    var endDate = req.body.endDate ? req.body.endDate : new Date(2017, 3, 25, 23, 59, 59);
    var d = [];
    var employees = [];
    var async = require('async');
    Parlor.find({}, { _id: 1, name: 1 }).skip(5).limit(1).exec(function(err, parlors) {
        async.parallel([
            function(done) {
                async.each(parlors, function(parlor, callback) {
                    console.log(parlor.name);
                    Appointment.serviceRepetitionReport(parlor, startDate, endDate, employees, function(err, data) {
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

router.post('/report/employeeRepetitionReport', function(req, res) {
    console.log("hello")
    var startDate = req.body.startDate ? req.body.startDate : new Date(2017, 1, 27, 23, 59, 59);
    var endDate = req.body.endDate ? req.body.endDate : new Date(2017, 3, 25, 23, 59, 59);
    var d = [];
    var employees = [];
    var async = require('async');
    Parlor.find({}, { _id: 1, name: 1 }).skip(5).limit(1).exec(function(err, parlors) {
        async.parallel([
            function(done) {
                async.each(parlors, function(parlor, callback) {
                    console.log(parlor.name);
                    Appointment.employeeRepetitionReport(parlor, startDate, endDate, employees, function(err, data) {
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


router.post('/report/serviceReport', function(req, res) {
    console.log(req.body)
    var query = {};
    var startDate = req.body.startDate;
    var endDate = req.body.endDate;
    var parlorIds = req.body.parlorIds ? req.body.parlorIds : [];
    if (parlorIds.length == 0) query = {};
    else query = { _id: { $in: parlorIds } };
    SuperCategory.find({}, function(err, superCat) {
        ServiceCategory.find({}).sort({ sort: 1 }).exec(function(err, categories) {
            Service.find({}, function(err, services) {
                Parlor.find(query, { _id: 1, name: 1 ,address2:1}, function(err, parlors) {
                    // console.log(parlors)
                    Appointment.serviceReportForAdmin(services, parlors, startDate, endDate, function(err, data) {
                        var objects = _.map(categories, function(ca) {
                            var categoriesObj = _.filter(data, function(d) {
                                return d.categoryId + "" == ca.id + ""
                            });
                            return {
                                category: ca.name,
                                superCategory: ca.superCategory,
                                categoryId: ca.id,
                                values: categoriesObj,
                                count: _.sum(_.map(categoriesObj, function(c) {
                                    return c.count
                                })),
                                revenue: _.sum(_.map(categoriesObj, function(c) {
                                    return c.revenue
                                })),
                                parlors: _.map(parlors, function(p) {
                                    return {
                                        parlorId: p.id,
                                        count: calculateByParlor(categoriesObj, p.id),
                                        revenue: calculateByParlorRevenue(categoriesObj, p.id)
                                    };
                                })
                            };
                        });
                        var reqData = _.chain(objects)
                            .groupBy('superCategory')
                            .map(function(val, key) {
                                return {
                                    name: key,
                                    values: val,
                                    parlors: _.map(parlors, function(p) {
                                        return {
                                            parlorId: p.id,
                                            count: calculateByParlorDept(val, p.id),
                                            revenue: calculateByParlorRevenueDept(val, p.id),
                                        };
                                    }),
                                    count: _.sum(_.map(val, function(v) {
                                        return v.count
                                    })),
                                    revenue: _.sum(_.map(val, function(v) {
                                        return v.revenue
                                    })),
                                };
                            })
                            .value();
                        return res.json(reqData);
                    });
                });
            });
        });
    });
});


function calculateByParlor(services, parlorId) {
    var count = 0;
    _.forEach(services, function(s) {
        var p = _.filter(s.parlors, function(sp) {
            return sp.parlorId + "" == parlorId + ""
        })[0];
        if (p) count += p.count;
    });
    return count;
};

function calculateByParlorDept(services, parlorId) {
    var count = 0;
    _.forEach(services, function(s) {
        var p = _.filter(s.parlors, function(sp) {
            return sp.parlorId + "" == parlorId + ""
        })[0];
        if (p) count += p.count;
    });
    return count;
};

function calculateByParlorRevenueDept(services, parlorId) {
    var count = 0;
    _.forEach(services, function(s) {
        var p = _.filter(s.parlors, function(sp) {
            return sp.parlorId + "" == parlorId + ""
        })[0];
        if (p) count += p.revenue;
    });
    return count;
};


function calculateByParlorRevenue(services, parlorId) {
    var count = 0;
    _.forEach(services, function(s) {
        var p = _.filter(s.parlors, function(sp) {
            return sp.parlorId + "" == parlorId + ""
        })[0];
        if (p) count += p.revenue;
    });
    return count;
};


router.post('/allParlors', function(req, res) {
    Parlor.find({}, { id: 1, name: 1, address: 1 ,  address2: 1 , active: 1, ambienceRating : 1}).exec(function(err, parlors) {
        parlors = _.map(parlors, function(m) {
            return {
                parlorId: m.id,
                name: m.name + '-' + m.address,
                address2 : m.address2,
                ambienceRating : m.ambienceRating,
                active : m.active
            };
        });
        return res.json({ error: false, data: parlors });
    });
});

router.get('/allParlorsUnderRedCategory', function(req, res) {
    Parlor.find({$or : [{averageNoOfClientsPerDay : {$lt : 1}}, {name : {$regex : "Monsoon"}}], active : true}, { id: 1, name: 1, address: 1 ,  address2: 1 , active: 1, ambienceRating : 1}).exec(function(err, parlors) {
        parlors = _.map(parlors, function(m) {
            return {
                parlorId: m.id,
                name: m.name + '-' + m.address,
                address2 : m.address2,
                ambienceRating : m.ambienceRating,
                active : m.active
            };
        });
        return res.json({ error: false, data: parlors });
    });
});

router.post('/allParlorsWithActive', function(req, res) {
    Parlor.find({active : true}, { id: 1, name: 1, address: 1 , active: 1}).exec(function(err, parlors) {
        parlors = _.map(parlors, function(m) {
            return {
                parlorId: m.id,
                name: m.name + '-' + m.address,
                active : m.active
            };
        });
        return res.json({ error: false, data: parlors });
    });
});

router.post('/allParlorsWithActiveInactive', function(req, res) {
    Parlor.find({active : localVar.isServer()}, { id: 1, name: 1, address: 1 , active: 1}).exec(function(err, parlors) {
        parlors = _.map(parlors, function(m) {
            return {
                parlorId: m.id,
                name: m.name + '-' + m.address,
                active : m.active
            };
        });
        return res.json({ error: false, data: parlors });
    });
});


router.post('/parlorList', function(req, res) {
    var async = require('async');
    console.time('dbstarted');
    Parlor.find({}, {
        id: 1,
        name: 1,
        tax: 1,
        smscode: 1,
        latitude: 1,
        longitude: 1,
        gender: 1,
        active: 1,
        address2: 1,
        smsRemaining: 1,
        logo: 1,
        address: 1,
        images: 1
    }, function(er, parlors) {
        Admin.find({ role: 2, active: true }, {
            id: 1,
            parlorId: 1,
            firstName: 1,
            phoneNumber: 1,
            emailId: 1,
            password: 1
        }).exec(function(err, managers) {
            _.forEach(parlors, function(parlor) {
                var mv = _.filter(managers, function(m) {
                    return m.parlorId == parlor.id;
                })[0];
                if (!mv) {
                    managers.push({
                        firstName: "",
                        phoneNumber: "",
                        emailId: "",
                        password: "",
                        parlorId: parlor.id,
                    });
                }
            });
            managers = _.map(managers, function(m) {
                m.parlorId = _.filter(parlors, function(p) {
                    return p.id == m.parlorId;
                })[0];
                if (m.parlorId) {
                    return {
                        id: m.parlorId.id,
                        name: m.parlorId.name,
                        tax: m.parlorId.tax,
                        smscode: m.parlorId.smscode,
                        latitude: m.parlorId.latitude,
                        longitude: m.parlorId.longitude,
                        images: m.parlorId.images,
                        gender: m.parlorId.gender,
                        smsCredits: m.parlorId.smsRemaining,
                        logo: m.parlorId.logo,
                        active: m.parlorId.active,
                        ownerName: "",
                        ownerPhoneNumber: "",
                        parlorId: m.parlorId.id,
                        address: m.parlorId.address + " " + m.parlorId.address2,
                        managerName: m.firstName,
                        managerPhone: m.phoneNumber,
                        managerEmail: m.emailId,
                        managerPassword: m.password,
                    };
                } else return null;

            });
            managers = _.filter(managers, function(d) {
                return !_.isEmpty(d);
            });
            managers = _.uniqBy(managers, function(e) {
                return e.parlorId;
            });


            Admin.find({ role: 7 }, {
                parlorIds: 1,
                firstName: 1,
                lastName: 1,
                emailId: 1,
                phoneNumber: 1,
                password: 1
            }, function(err, owners) {
                console.time('array');
                for (var i = 0; i < 10; i++) {
                    _.forEach(owners, function(owner) {
                        _.forEach(owner.parlorIds, function(parlorId) {
                            _.forEach(managers, function(m) {
                                if (m.parlorId == parlorId) {
                                    m.ownerName = owner.firstName + " " + owner.lastName;
                                    m.ownerPhoneNumber = owner.phoneNumber;
                                    m.ownerEmailId = owner.emailId,
                                        m.password = owner.password;
                                }
                            });
                        });
                    });
                }
                return res.json({ error: false, data: managers });
            });
        });
    });
});

router.post('/parlorListByCategory', function(req, res) {
    var type = req.body.parlorType;
    var query = {};
    if (type) {
        query = { parlorType: type }
    }
    Parlor.find(query, { name: 1, address: 1, address2: 1 }, function(err, parlors) {
        return res.json(CreateObjService.response(false, parlors))
    })
})

/*router.post('/parlorList', function(req, res) {
 var async = require('async');


 console.time('dbstarted');
 Admin.find({role : 2}, {id : 1, parlorId : 1, firstName : 1, phoneNumber : 1, emailId  : 1, password : 1}).populate('parlorId', { id: 1, name: 1, tax : 1, smscode : 1, latitude : 1, longitude : 1, gender : 1, smsRemaining : 1, logo : 1, address : 1}).exec(function(err, managers) {
 managers = _.map(managers, function(m){
 if(m.parlorId){
 return {
 name : m.parlorId.name,
 tax : m.parlorId.tax,
 smscode : m.parlorId.smscode,
 latitude : m.parlorId.latitude,
 longitude : m.parlorId.longitude,
 gender : m.parlorId.gender,
 smsCredits : m.parlorId.smsRemaining,
 logo : m.parlorId.logo,
 ownerName : "",
 ownerPhoneNumber : "",
 parlorId : m.parlorId.id,
 address : m.parlorId.address,
 managerName : m.firstName,
 managerPhone : m.phoneNumber,
 managerEmail : m.emailId,
 managerPassword : m.password,
 };
 }else return null;

 });
 managers = _.filter(managers, function(d){ return !_.isEmpty(d); });
 managers = _.uniqBy(managers, function (e) {
 return e.parlorId;
 });

 Admin.find({role : 7}, {parlorIds : 1, firstName : 1, lastName : 1, phoneNumber : 1}, function(err, owners){
 _.forEach(owners, function(owner){
 _.forEach(owner.parlorIds, function(parlorId){
 _.forEach(managers, function(m){
 if(m.parlorId == parlorId){
 m.ownerName = owner.firstName + " " + owner.lastName;
 m.ownerPhoneNumber = owner.phoneNumber;
 }
 });
 });
 });
 console.timeEnd('dbstarted');
 return res.json({error : false, data : managers});
 });
 });
 });
 */
router.get('/parlorList', function(req, res) {
    Parlor.find({}, { name: 1, address: 1, address2: 1, id: 1 , threeXModel: 1}, function(Err, parlors) {
        var data = _.map(parlors, function(p) {
            return {
                name: p.name + ' ' + p.address2,
                address: p.address + ' ' + p.address2,
                parlorId: p.id,
                threeXModel : p.threeXModel
            };
        });
        return res.json({ error: false, data: data });
    });
});

router.post('/serviceList', function(req, res) {
    Service.serviceByCategoryId(req.body.categoryId, function(err, services) {
        return res.json({ error: false, data: services });
    });
});

router.get('/inventory', function(req, res) {
    InventoryItem.items(function(err, items) {
        if (err) return res.json(CreateObjService.response(true, 'Error in getting items list'));
        else return res.json(CreateObjService.response(false, items));
    });
});

router.post('/inventory', function(req, res) {
    InventoryItem.addNewItem(req, function(err, item) {
        console.log(err)
        if (err) return res.json(CreateObjService.response(true, 'Error in add new items'));
        else return res.json(CreateObjService.response(false, item));
    });
});

router.put('/inventory', function(req, res) {
    InventoryItem.update({ itemId: req.body.itemId }, {
        capacity: req.body.capacity,
        sellingPrice: req.body.sellingPrice,
        bestBefore: req.body.bestBefore,
        name: req.body.name
    }, function(err, updated) {
        if (err) return res.json(CreateObjService.response(true, 'Error in updating new item'));
        else return res.json(CreateObjService.response(false, updated));
    });
});

router.post('/categoryList', function(req, res) {
    ServiceCategory.categories(function(err, categories) {
        console.log(err);
        console.log(categories);
        return res.json(CreateObjService.response(false, categories));
    });
});

router.post('/createCategory', function(req, res) {
    console.log("sdasda");
    ServiceCategory.create({ name: req.body.name, superCategory: req.body.supercategory }, function(err, newCat) {
        console.log(err);
        if (err) return res.json(CreateObjService.response(true, 'Error in creating new category'));
        else return res.json(CreateObjService.response(false, ServiceCategory.parse(newCat)));
    });
});

router.post('/createSuperCategory', function(req, res) {
    console.log("sdasda");
    SuperCategory.create({ name: req.body.name }, function(err, newCat) {
        if (err) return res.json(CreateObjService.response(true, 'Error in creating new super category'));
        else return res.json(CreateObjService.response(false, 'Successfully created'));
    });
});

router.delete('/service/:serviceId', function(req, res) {
    Service.remove({ _id: req.params.serviceId }, function(err, newCat) {
        Parlor.update({}, { $pull: { 'services': { serviceId: req.params.serviceId } } }, function(err, removed) {
            if (err) return res.json(CreateObjService.response(true, 'Error in removing service'));
            else return res.json(CreateObjService.response(false, 'Successfully removed'));
        });
    });
});

router.delete('/category/:categoryId', function(req, res) {
    ServiceCategory.remove({ _id: req.params.categoryId }, function(err, newCat) {
        Parlor.update({}, { $pull: { 'services': { categoryId: req.params.categoryId } } }, function(err, removed) {
            if (err) return res.json(CreateObjService.response(true, 'Error in removing category'));
            else return res.json(CreateObjService.response(false, 'Successfully removed'));
        });
    });
});


router.get('/updateServiceAppName', function(req, res) {
    Service.find({}, function(err, services) {
        _.forEach(services, function(s) {
            Service.update({ _id: s.id }, { nameOnApp: s.name }, function(err, d) {
                console.log(d);
            });
        });
    });
});

router.post('/updateTips', function(req, res){
    let serviceTips = [];
    if(req.body.tip1 != "")serviceTips.push({description : req.body.tip1, link : req.body.tip1Url, createdAt : new Date()});
    if(req.body.tip2 != "")serviceTips.push({description : req.body.tip2, link : req.body.tip2Url, createdAt : new Date()});
    if(req.body.tip3 != "")serviceTips.push({description : req.body.tip3, link : req.body.tip3Url, createdAt : new Date()});
    if(req.body.tip4 != "")serviceTips.push({description : req.body.tip4, link : req.body.tip4Url, createdAt : new Date()});
    if(req.body.tip5 != "")serviceTips.push({description : req.body.tip5, link : req.body.tip5Url, createdAt : new Date()});
    Service.update({_id : req.body.serviceId}, {serviceTips : serviceTips}, function(er, s){
        res.json('done');
    });
});

router.put('/service', function(req, res) {
    Service.aggregate({ $unwind: "$prices" }, { $sort: { "prices.priceId": -1 } }, { $limit: 1 }).exec(function(err, s) {
        var count = s[0].prices.priceId;
        var newService = Service.getNewService(req.body.service, count);
        console.log(newService);
        SubCategory.findOne({ _id: newService.subCategoryId }, function(err, subCat) {
            var subCategorySort = subCat ? subCat.sortOrder : 0;
            var subCategoryName = subCat ? subCat.name : "";

            Service.update({ _id: req.body.serviceId }, {
                upgrades: newService.upgrades,
                upgradeType: newService.upgradeType,
                subCategoryIdSort: subCategorySort,
                subCategoryId: newService.subCategoryId,
                name: newService.name,
                isDeleted: newService.isDeleted,
                subTitle: subCategoryName,
                tag: newService.tag,
                inventoryItemId : newService.inventoryItemId,
                gstNumber: newService.gstNumber,
                gstDescription: newService.gstDescription,
                sort: newService.sort,
                nameOnApp: newService.nameOnApp,
                dontShowInApp: newService.dontShowInApp,
                prices: newService.prices,
                description: newService.description,
                estimatedTime: newService.estimatedTime,
                serviceRepeatDay: newService.serviceRepeatDay,
                notificationContent: newService.notificationContent,
                notificationTitle: newService.notificationTitle,
                smsContent: newService.smsContent,
                repeatDaysInterval: newService.repeatDaysInterval,

            }, function(err, data) {
                console.log(err)
                return res.json(CreateObjService.response(false, 'Successfully created'));
                /*Parlor.find({}, {services: 1}, function (err, parlors) {
                 _.forEach(parlors, function (parlor) {
                 _.forEach(parlor.services, function (service) {
                 if (service.serviceId + "" == req.body.serviceId) {
                 service.name = newService.name;
                 }
                 });
                 Parlor.update({_id: parlor.id}, {services: parlor.services}, function (err, data) {
                 if (err) return res.json(CreateObjService.response(true, 'Error in updating service name'));
                 else return res.json(CreateObjService.response(false, 'Successfully created'));
                 });
                 });
                 });*/
            });
        });
    });
});


router.put('/serviceBrand', function(req, res) {
    Service.findOne({ _id: req.body.serviceId }, function(err, service) {
        _.forEach(service.prices, function(p) {
            var price = _.filter(req.body.prices, function(pr) {
                return pr.priceId == p.priceId
            })[0];
            if (price) {
                console.log(price);
                p.brand.brands = _.map(price.brands, function(brand) {
                    return {
                        name: brand.name,
                        maxSaving: brand.maxSaving,
                        popularChoice: brand.popularChoice,
                        brandId: brand.brandId,
                        productTitle: brand.productTitle,
                        products: _.map(brand.products, function(p) {
                            return {
                                name: p.name,
                                productId: p.productId,
                                popularChoice: p.popularChoice,
                            };
                        })
                    }
                });
            }
        });
        Service.update({ _id: req.body.serviceId }, { prices: service.prices }, function(err, d) {
            console.log(err);
            return res.json(CreateObjService.response(false, 'Successfully created'));
        });
    });
});
/*

 router.put('/service', function(req, res){
 Service.aggregate({ $unwind: "$prices" },{ $sort: {"prices.priceId" : -1} }, { $limit: 1 }).exec(function(err, s) {
 var count = s[0].prices.priceId;
 var newService = Service.getNewService(req.body.service, count);
 console.log(newService);
 Service.update({_id : req.body.serviceId}, {name : newService.name, prices : newService.prices, subTitle : newService.subTitle, tag : newService.tag, sort : newService.sort}, function(err, data){
 Parlor.find({}, function(err, parlors){
 _.forEach(parlors, function(parlor){
 _.forEach(parlor.services, function(service){
 if(service.serviceId + "" == req.body.serviceId){
 var prices = [];
 service.name = newService.name,
 service.subTitle = newService.subTitle,
 _.forEach(service.prices, function(p){
 var found = false;
 _.forEach(newService.prices, function(price){
 if(price.priceId == p.priceId) {
 found = true;
 p.name = price.name;
 // p.additions = Service.getNewAdditionObj(price.additions);
 }
 });
 if(found){
 console.log(p);
 prices.push(p);
 }
 });
 service.prices = prices;
 };
 });
 Parlor.update({_id : parlor.id }, {services : parlor.services},function(err, data){
 console.log(err);
 console.log(data);
 if(err) return res.json(CreateObjService.response(true, 'Error in updating service name'));
 else return res.json(CreateObjService.response(false, 'Successfully created'));
 });
 });

 });
 });
 });
 });*/

router.post('/createService', function(req, res) {
    var categoryId = req.body.categoryId;
    Service.aggregate({ $unwind: "$prices" }, { $sort: { "prices.priceId": -1 } }, { $limit: 1 }).exec(function(err, serviceCount) {
        var count = serviceCount[0].prices.priceId;
        ServiceCategory.find({ _id: categoryId }, function(err, cat) {
            if (cat) {
                Service.findOne({}, {}, { sort: { 'serviceCode': -1 } }, function(err, s) {
                    var priceId = 1;
                    if (s) {
                        priceId = count + 1;
                    }
                    var price = [{
                        priceId: priceId,
                        name: "",
                        additions: [],
                        createdAt: new Date()
                    }];
                    Service.create({
                        name: req.body.name,
                        nameOnApp: req.body.name,
                        serviceCode: ++s.serviceCode,
                        gender: req.body.gender == 1 ? "M" : "F",
                        categoryId: req.body.categoryId,
                        subTitle: req.body.subTitle ? req.body.subTitle : "",
                        prices: price,
                        tag: req.body.tag
                    }, function(err, newService) {
                        if (err) return res.json(CreateObjService.response(true, 'Error in creating service'));
                        else return res.json(CreateObjService.response(false, Service.parse(newService)));
                    });
                });

            } else {
                return res.json(CreateObjService.response(true, 'Invalid category Id'));
            }
        });
    });
});

// ---------------------------------------------------------new Inventory -----------------------------


// router.post('/getSellerAndItems',function (req,res) {
//     var temp=[];
//     var dataa=[];
//
//     Sellers.find({}).exec(function (err,resultSeller) {
//         if(resultSeller.length>0){
//
//
//             // console.log(resultSeller)
//             // sellerId: { $exists: false}
//             async.parallel([
//                 function (call) {
//                     async.each(resultSeller, function (item, callback) {
//
//                         InventoryItem.find({}).exec(function (err,resultInventory) {
//                             if(resultInventory.length>0){
//                                 // console.log(item.items)
//                                 var itemii=_.map(item.items,function (r) {
//
//                                     return{
//                                         id:r.itemId
//                                     }
//
//                                 })
//                                 console.log(itemii.length);
//                                 for(var i=0;i<resultInventory.length;i++){
//                                     for(var j=0;j<itemii.length;j++){
//
//                                         if((itemii[j].id).toString()==(resultInventory[i]._id).toString()){
//
//                                             console.log((itemii[j].id).toString(),(resultInventory[i]._id).toString())
//                                             temp.push({id:resultInventory[i]._id,name:resultInventory[i].name,isSelected:true})
//
//                                         }else{
//                                             temp.push({id:resultInventory[i]._id,name:resultInventory[i].name,isSelected:false})
//                                         }
//                                     }
//                                 }
//
//
//                                 var data={Sellers:item,items:temp}
//                                     temp=[];
//                                 dataa.push(data);
//
//                                 callback()
//
//
//
//                             }else{res.json(CreateObjService.response(true,"inventory items not found"))}
//
//                         })
//
//
//
//                     }, call);
//                 }
//             ], function processDone(err,done) {
//
//
//                 if(err){ res.json(CreateObjService.response(true, "error in sending query"));
//                 }
//                 res.json(CreateObjService.response(false,dataa))
//             });
//
// }else{res.json(CreateObjService.response(true,"sellers not found"))
//     }
//     })
// });

router.post('/addCategories', function(req, res) {


    var query = { name: req.body.name,url:req.body.url }
    console.log(query)
    ProductCategories.createNew(query, function(err, response) {

        if (err) {
            res.json(CreateObjService.response(true, "error in creating"))

        } else {


            ProductCategories.update({ _id: response._id }, { $pushAll: { salonType: req.body.salonType } }, function(err, update) {

                res.json(CreateObjService.response(false, update))


            })

        }

    })

})
router.post('/deleteCategories', function(req, res) {


    var query = { _id: req.body.Id };
    ProductCategories.findOne(query, function(err, response1) {

        ProductCategories.deleteMyData(query, function(err, response) {

            if (err) {
                res.json(CreateObjService.response(true, "error in deleting"))

            } else {

                InventoryItem.update({ productCategoryId: response1._id }, {
                    $set: {
                        productCategoryId: null,
                        productCategoryName: null
                    }
                }, { multi: true }).exec(function(err, responses3) {

                    res.json(CreateObjService.response(false, response))
                })


            }
        })

    })
})
router.get('/getSalonType', function(req, res) {
    res.json(CreateObjService.response(false, [0, 1, 2, 3]))
})
router.get('/getCategories', function(req, res) {

    console.log("hit")


    ProductCategories.find({}, function(err, response) {
        if (err) {
            res.json(CreateObjService.response(true, "error in deleting"))
        } else {
            res.json(CreateObjService.response(false, response))

        }
    })


})
router.post('/updateCategories', function(req, res) {

    console.log("mmmmmmmmmmmmmmmmmmmmmm", req.body)
    ProductCategories.findOne({ _id: req.body.categoriesId }, function(err, results) {
        InventoryItem.update({ _id: req.body.Id }, {
            $set: {
                "productCategoryId": req.body.categoriesId,
                "productCategoryName": results.name,
                "sellerId": results.sellerId,
                "oneUnitQuantity": req.body.oneUnitQuantity,
                "sellerName": results.sellerName,
                "salonType": results.salonType,
                "sellingPrice": req.body.sellingPrice,
            }
        }, { multi: true }, function(err, response1) {
            ParlorItem.update({ inventoryItemId: req.body.Id }, {
                $set: {
                    "productCategoryId": req.body.categoriesId,
                    "productCategoryName": results.name,
                    "sellerId": results.sellerId,
                    "sellerName": results.sellerName,
                    "salonType": results.salonType,
                    "sellingPrice": req.body.sellingPrice
                }
            }, { multi: true }, function(err, response2) {
                if (err) {
                    console.log(err)
                    res.json(CreateObjService.response(true, "error in deleting"))
                } else {
                    res.json(CreateObjService.response(false, response2))

                }
            })
        })

    })
})
router.post('/editCategories', function(req, res) {
        ProductCategories.findOne({ _id: req.body.categoriesId }, function(err, results) {
            console.log(results)
            ProductCategories.update({ _id: req.body.categoriesId }, { $unset: { salonType: [] } }, function(err, null1) {
                InventoryItem.update({ productCategoryId: req.body.categoriesId }, { $unset: { salonType: [] } }, { multi: true }, function(err, null2) {
                    ParlorItem.update({ productCategoryId: req.body.categoriesId }, { $unset: { salonType: [] } }, { multi: true }, function(err, null3) {
                        ProductCategories.update({ _id: req.body.categoriesId }, { $set: { salonType: req.body.salonType } }, function(err, results2) {
                                InventoryItem.update({ productCategoryId: req.body.categoriesId }, { $set: { salonType: req.body.salonType } }, { multi: true }, function(err, response1) {
                                    ParlorItem.update({ productCategoryId: req.body.categoriesId }, { $set: { salonType: req.body.salonType } }, { multi: true }, function(err, response2) {
                                        if (err) {
                                            res.json(CreateObjService.response(true, "error in deleting"))
                                        } else {
                                            res.json(CreateObjService.response(false, response2))

                                        }
                                    })
                                })

                            }) //3
                    })
                })
            })
        })
    })
    // -------------------->


router.post('/insertCategory', function(req, res) {


    InventoryItem.insertCategory(req, function(err, response) {

        if (err) {
            res.json(CreateObjService.response(true, "error in inserting category"))

        } else {
            res.json(CreateObjService.response(false, response))

        }

    })

})

router.post('/getInventoryItems', function(req, res) {
    ProductCategories.find({ $or: [{ sellerId: { $exists: false } }, { sellerId: null }] }).exec(function(err, result2) {
        console.log(result2)
        res.json(CreateObjService.response(false, result2))

    })

})

router.post('/getSellerAndItems1', function(req, res) {
    var seller = {};

    Sellers.find({}).exec(function(err, result) {

        InventoryItem.find({ sellerId: { $exists: false } }).exec(function(err, result2) {


            // console.log("----------->>>>>>>>>>>>>>",result[0].items[0])

            var data = _.map(result, function(t) {

                return {
                    "sellerId": t._id,
                    "name": t.name,
                    "contactNumber": t.contactNumber1,
                    "poNumber": t.poNumber,
                    "address": t.address,
                    "tinNumber": t.tinNumber,
                    "emailId": t.emailId1,
                    "emailIdcc": t.emailIdcc1,
                    "count": t.items.length,
                    "items": _.map(t.items, function(p) {
                        return {
                            itemId: p.itemId,
                            name: p.name,
                            isSelected: true
                        }
                    }).concat(_.map(result2, function(y) {
                        return {
                            itemId: y._id,
                            name: y.name,
                            isSelected: false
                        }

                    }))
                }
            })

            res.json(CreateObjService.response(false, data))


        })

    })

});

router.get('/customerCareTeamMembers', function(req, res){
    Beu.findOne({_id : req.session.userId}, function(erm , beuUser){
        res.json(beuUser.customerCareTeamMembers)
    })
})

router.post('/getSellerAndItems', function(req, res) {
    var seller = {};
    Sellers.find({}).exec(function(err, result) {
        ProductCategories.find({ sellerId: { $eq: null } }).exec(function(err, result2) {
            // console.log("nulll",result2)
            var data = _.map(result, function(t) {
                return {
                    "sellerId": t._id,
                    "name": t.name,
                    "contactNumber": t.contactNumber1,
                    "poNumber": t.poNumber,
                    "address": t.address,
                    "tinNumber": t.tinNumber,
                    "emailId": t.emailId1,
                    "emailIdcc": t.emailIdcc1,
                    "count": t.items.length,
                    "items": _.map(t.items, function(p) {
                        return {
                            itemId: p.itemId,
                            name: p.name,
                            isSelected: true
                        }
                    }).concat(_.map(result2, function(y) {
                        return {
                            itemId: y._id,
                            name: y.name,
                            isSelected: false
                        }

                    }))
                }
            })


            res.json(CreateObjService.response(false, data))


        })

    })

});

router.post('/createSellers1', function(req, res) { // req.body.emailId,req.body.name

    var data = {
        emailId: req.body.emailId,
        emailIdcc: req.body.emailIdcc,
        name: req.body.name,
        items: req.body.items,
        contactNumber: req.body.contactNumber,
        poNumber: req.body.poNumber,
        address: req.body.address,
        tinNumber: req.body.tinNumber

    };


    var itemIds = _.map(req.body.items, function(y) {

        return y.itemId
    })


    console.log("ooooooooooooooooooooooooooo", itemIds)

    Sellers.createNew(data, function(err, response) {
        InventoryItem.update({ _id: { $in: itemIds } }, {
            $set: {
                sellerName: req.body.name,
                sellerId: response._id
            }
        }, { multi: true }).exec(function(err, result2) {

            console.log(result2)

            ParlorItem.update({ inventoryItemId: { $in: itemIds } }, {
                $set: {
                    sellerName: req.body.name,
                    sellerId: response._id
                }
            }, { multi: true }).exec(function(err, result3) {
                console.log(result3)


                if (err) {

                    res.json(CreateObjService.response(true, "error in casting "))

                } else {
                    res.json(CreateObjService.response(false, "all item inserted"))
                }


            })


        })
    })
});
router.post('/createSellers', function(req, res) { // req.body.emailId,req.body.name

    var data = {
        emailId1: req.body.emailId,
        emailIdcc1: req.body.emailIdcc,
        name: req.body.name,
        items: req.body.items,
        address: req.body.address,
        contactNumber1: req.body.contactNumber,

    };

    console.log("00000000000000000000000000000", data);

    var itemIds = _.map(req.body.items, function(y) {

        return y.itemId
    })

    console.log("_____________________>>>", itemIds)

    var newIds = []
    _.map(itemIds, function(m) {

        newIds.push(ObjectId(m))
    })


    InventoryItem.find({ productCategoryId: { $in: newIds } }, function(err, newData) {


        // console.log(newData)

        var itemsIdss = []
        _.map(newData, function(d) {


            itemsIdss.push(d._id)

        })


        console.log("ooooooooooooooooooooooooooo", itemsIdss)

        Sellers.createNew(data, function(err, response) {
            ProductCategories.update({ "_id": { $in: itemIds } }, {
                $set: {
                    sellerId: response._id,
                    sellerName: req.body.name
                }
            }, { multi: true }, function(err, cat) {

                InventoryItem.update({ _id: { $in: itemsIdss } }, {
                    $set: {
                        sellerName: req.body.name,
                        sellerId: response._id
                    }
                }, { multi: true }).exec(function(err, result2) {

                    console.log("inventory item updated", result2)

                    ParlorItem.update({ inventoryItemId: { $in: itemsIdss } }, {
                        $set: {
                            sellerName: req.body.name,
                            sellerId: response._id
                        }
                    }, { multi: true }).exec(function(err, result3) {
                        console.log("parloritem  updated", result3)


                        if (err) {

                            res.json(CreateObjService.response(true, "error in casting "))

                        } else {
                            res.json(CreateObjService.response(false, "all item inserted"))
                        }


                    })


                })
            })
        })


    })

});

router.post('/editItemsToSellers', function(req, res) {

    Sellers.insertItems(req, function(err, result) {


        if (!err) {
            res.json(CreateObjService.response(false, result))
        } else {
            res.json(CreateObjService.response(true, "items  insertion failed"))
        }


    });
});

router.get('/getSellerForDs', function(req, res) {

    DiscountStructure.find({}, { sellerId: 1, sellerName: 1 }).exec(function(err, response) {

        res.json(CreateObjService.response(false, response));


    })
})

router.post('/getSeller', function(req, res) {
    var seller = {};

    Sellers.find({}, { name: 1, _id: 1 }).exec(function(err, result) {
        if (err) {
            res.json(CreateObjService.response(true, "no data found"))
        } else {

            var dataSend = _.map(result, function(m) {

                return {
                    sellerName: m.name,
                    sellerId: m._id
                }
            })

            res.json(CreateObjService.response(false, dataSend))
        }


    })

});

router.post('/createDiscountStructure', function(req, res) { //

    console.log("logssssssssssss", req.body[0].slabs)
    DiscountStructure.createNew(req.body, function(err, response) {
        if (err) {
            res.json(CreateObjService.response(true, err))
        }
        res.json(CreateObjService.response(false, response))
    })


});

router.post('/editDiscountStructure', function(req, res) {
    console.log(req.body)

    var data = {
        sellerId: req.body.sellerId,
        slabs: req.body.slabs
            // parlorId:req.body.parlorId
    };


    //
    DiscountStructure.updateSlab(data, function(err, response) {
        if (err) {
            console.log(err)
            res.json(CreateObjService.response(true, err))
        }
        res.json(CreateObjService.response(false, response))

    })

});

router.post('/getDiscountStructure', function(req, res) {


    DiscountStructure.getStructure(req, function(err, data) {

        res.json(CreateObjService.response(false, data));

    })


});


router.post('/getOrderedInventory', function(req, res) {


    var parlors = [];
    req.body.salons.forEach(function(k) {

        parlors.push(ObjectId(k.parlorId))
    })
    console.log(req.body.date.startDate)

    ReOrder.find({
        sellerId: req.body.seller,
        parlorId: { $in: parlors },
        updatedAt: { $gte: req.body.date.startDate, $lt: req.body.date.endDate }
    }, { name: 1, createdAt: 1, status: 1, orderAmount: 1, items: 1 }, function(err, response) {

        if (err) console.log(err)


        var sendMe = _.map(response, function(l) {
            var sum = 0
            _.map(l.items, function(p) {
                sum += p.orderedQuantity
            })

            if (l.status == 0) {
                var printStatus = "Completed"
            } else {
                var printStatus = "Pending"
            }

            return {
                date: l.createdAt,
                quantity: sum,
                salonName: l.name,
                amount: l.orderAmount,
                status: printStatus

            }

        })


        res.json(CreateObjService.response(false, sendMe));


    })

})


// ----------------------slabs------------------------------------------------


router.get('/getDealSlabs', function(req, res) {


    Slab.find({}, function(err, result) {

        if (err) {
            res.json(CreateObjService.response(true, err))
        } else {
            res.json(CreateObjService.response(false, result))

        }

    })


})

router.post('/createDealSlabs', function(req, res) {

    console.log("running")


    console.log(req.body)

    if (req.body.ranges.length > 0) {


        Slab.create({
            ranges: req.body.ranges
        }, function(err, result) {

            res.json(CreateObjService.response(false, "slab created"))

        })


    } else {

        res.json(CreateObjService.response(true, "empty array"))


    }

})

//----------------------------adhaar e signature-------------------------------------------

router.get('/getParlorList', function(req, res) {
    Parlor.find({}, { parlorType: 1, name: 1, address2: 1 }, function(err, parlor) {
        res.json(CreateObjService.response(false, parlor))

    })

})


// ----------------------------multer Settings--------------------------------
var storage = multer.diskStorage({ //multers disk storage settings
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
    }
});

var upload = multer({ //multer settings
    storage: storage
}).single('file');

// ----------------------------------------------------------------------------------

router.post('/uploadPdf', function(req, res) {
    upload(req, res, function(err) {
        console.log(req.body)

        if (err) {

            res.json(CreateObjService.response(false, err));
            return;
        }


        var dir = './uploads/aadhaar/' + req.body.parlorId
        fse.ensureDir(dir, function(err) {
            if (err)
                return console.log(err)
            var fileToSend = dir + "/" + req.file.filename;

            fse.move(req.file.path, fileToSend, function(err) {
                if (err) return console.error(err)
                console.log('success!')


                var options = {
                    url: 'https://persist.signzy.tech/api/files/upload',
                    method: 'POST',
                    headers: {
                        'Authorization': 'pnqm7s28X5cTBTG81RsVGN0tfyvxX7rk9lvKqpeLbu4IxhbjHDsfUcrEWNAAsUNO'
                    },
                    formData: {
                        file: fs.createReadStream(fileToSend),
                        ttl: '30 mins',
                        mimetype: "application/pdf"

                    }

                };

                request(options, function(err, res1, body) {
                    if (err)
                        return console.log(err)
                    var json = JSON.parse(body);

                    console.log(json);

                    Parlor.update({ _id: req.body.parlorId }, { $set: { unsignedMou: json.file.directURL, unsignedMouStatus: true } }, function(err, updated) {

                        res.json(CreateObjService.response(false, updated));


                    })

                });


            })


        })


    });
});


router.post('/aadhharSendOtp', function(req, res) {

    console.log(req.body)
    var uid = req.body.uid

    var options = {
        url: 'https://signzy.tech/api/v2/patrons/5904361015f127161175f3ee/aadhaaresigns',
        method: 'POST',
        headers: {
            'Authorization': 'pnqm7s28X5cTBTG81RsVGN0tfyvxX7rk9lvKqpeLbu4IxhbjHDsfUcrEWNAAsUNO',
            'Content-Type': 'application/json'
        },

        "form": {
            "request": "otp",

            "essentials": {

                "uid": uid

            }
        }

    };

    request(options, function(err, res1, body) {
        if (err)
            return console.log(err)
        var json = JSON.parse(body);


        console.log(json);
        res.json(CreateObjService.response(false, json));

    });


})

router.post('/aadhaarVerifyOtp', function(req, res) {


    Parlor.findOne({ _id: req.body.parlorId }, { name: 1, address: 1 }, function(err, parlor) {


        var filename = parlor.name + '@' + parlor.address + '$' + new Date().toDateString()
        console.log(filename)

        console.log("addhaar details", req.body)

        var options = {
            url: 'https://signzy.tech/api/v2/patrons/5904361015f127161175f3ee/aadhaaresigns',
            method: 'POST',
            headers: {
                'Authorization': 'pnqm7s28X5cTBTG81RsVGN0tfyvxX7rk9lvKqpeLbu4IxhbjHDsfUcrEWNAAsUNO'
            },
            form: {


                "request": "sign",

                "essentials": {

                    "uid": req.body.uid,

                    "reason": "to test esign feature",

                    "name": req.body.name,

                    "url": req.body.path,

                    "otp": req.body.otp

                }

            }

        };

        request(options, function(err, res1, body) {
            if (err)
                return console.log(err)
            var json = JSON.parse(body);
            console.log("console", json);
            console.log("consoleeeeeeeeeeeeeeeeeeeeeeeeee", json.result.result);

            request({ url: json.result.result }, function(err, response, body) {


                var file = fs.createReadStream('./uploads/doodle.pdf');
                var stat = fs.statSync('./uploads/doodle.pdf');
                console.log(stat.size)

                var options1 = {
                    url: 'https://www.googleapis.com/oauth2/v4/token',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    form: {
                        "client_id": "577956605134-7fei99avbe1264u4h9rd2hmp7u4qkfft.apps.googleusercontent.com",
                        "client_secret": 'HJrJRB2VjMidi1aCRQu0RQ5k',
                        "refresh_token": '1/SaRrhMSyzecWTqs2eIxSIeF8gX4YY-wNwVBomuVYu3_wZiQTsCUIgm3J4FXG5JJO',
                        "grant_type": 'refresh_token'
                    }

                };

                request(options1, function(err, res1, body) {
                    if (err)
                        return console.log(err)
                    var json = JSON.parse(body);

                    var accessToken = json.access_token
                    var options2 = {
                        'url': 'https://www.googleapis.com/upload/drive/v2/files?uploadType=multipart',

                        'method': 'POST',

                        'headers': {
                            'Authorization': 'Bearer ' + accessToken,
                            'Content-Type': 'application/pdf',
                            'Content-Length': stat
                        },
                        'multipart': [{
                                'Content-Type': 'application/json; charset=UTF-8',
                                'body': JSON.stringify({
                                    'name': filename,
                                    'title': filename,

                                })
                            },
                            {
                                'Content-Type': 'application/pdf',
                                'name': 'my.pdf',
                                'body': file
                            }
                        ]


                    };

                    request(options2, function(err, res1, body) {
                        if (err)
                            return console.log(err)
                        var json = JSON.parse(body);

                        ParlorMou.create({
                            fileUrl: json.webContentLink,
                            parlorId: parlor._id,
                        }, function(err, created) {
                            if (err) {
                                console.log(err)
                                res.json(CreateObjService.response(true, err));

                            } else {
                                var options3 = {
                                    'url': 'https://www.googleapis.com/drive/v3/files/' + json.id + '/permissions',

                                    'method': 'POST',

                                    'headers': {
                                        'Authorization': 'Bearer ' + accessToken,
                                        'Content-Type': 'application/json'

                                    },
                                    "body": JSON.stringify({
                                        "role": 'reader',
                                        "type": 'anyone'
                                    }),
                                    // "json": true,


                                };

                                request(options3, function(err, res1, body) {
                                    if (err)
                                        return console.log(err)
                                    var json = JSON.parse(body);
                                    console.log(json);
                                    fse.remove('./uploads/aadhaar', function() {
                                        if (err) return console.error(err)
                                        console.log('adhaar deleted success!')
                                        fse.remove('./uploads/doodle.pdf', function(err) {
                                            if (err) return console.error(err)
                                            console.log('doodle deleted')
                                            res.json(json)
                                        })
                                    })


                                });


                            }

                        })

                    });


                });


            }).pipe(fs.createWriteStream('./uploads/doodle.pdf'))


        });

    })
})


router.post('/getParlorMous', function(req, res) {

    var parlorId = req.body.parlorId

    ParlorMou.find({ parlorId: parlorId }).sort({ createdAt: -1 }).exec(function(err, mou) {
        if (err) {
            res.json(CreateObjService.response(true, err));

        } else {
            res.json(CreateObjService.response(false, mou));

        }

    })


});


router.post('/createParlorMous', function(req, res) {

    var url = req.body.url
    var parlorId = req.body.parlorId
    console.log(req.body)
    ParlorMou.create({
        fileUrl: url,
        parlorId: parlorId,
    }, function(err, created) {
        if (err) {
            res.json(CreateObjService.response(true, err));

        } else {
            res.json(CreateObjService.response(false, created));

        }

    })


})


router.post('/getEmployeeReport', function(req, res) {

    var month = req.body.month
    var parlorId = req.body.parlorId
    var startDate = HelperService.getFirstDateOfMonth(2017, month);
    var endDate = HelperService.getLastDateOfMonth1(2017, month);

    Admin.find({ "parlorId": parlorId, active: true }, function(err, employees) {
        var empData = _.map(employees, function(l) {

            return {
                id: l._id,
                name: l.firstName + ' ' + l.lastName,
                count: 0,
                position: l.position
            }
        })


        var empArray = _.map(employees, function(s) {
            return {

                id: s._id,
                name: s.firstName + ' ' + s.lastName,
                position: s.position,
                others: []

            }

        })


        _.forEach(empArray, function(dat, key) {
            _.forEach(empData, function(w) {

                if ((w.id).toString() != dat.id.toString()) {
                    dat.others.push(w)
                }

            })
        })


        Appointment.find({
            "parlorId": parlorId,
            "appointmentStartTime": { $gte: startDate, $lt: endDate }
        }, function(err, appointment) {


            _.forEach(empData, function(d) {

                _.forEach(appointment, function(app) {
                    var tempMe = []
                    _.forEach(app.employees, function(m) {


                        tempMe.push((m.employeeId).toString())
                    })

                    if (tempMe.indexOf((d.id).toString()) > -1) {
                        _.forEach(empArray, function(emp, key1) {

                            if ((emp.id).toString() == (d.id).toString()) {

                                _.forEach(empArray[key1].others, function(oth, key2) {
                                    _.forEach(tempMe, function(s) {
                                        if ((oth.id).toString() == s.toString()) {
                                            empArray[key1].others[key2].count += 1;
                                        }
                                    })
                                })
                            }

                        })

                    }

                })
            })

            var finalData = _.map(empArray, function(f) {

                return {
                    id: f.id,
                    name: f.name,
                    position: f.position,
                    others: _.sortBy(f.others, function(t) {

                        return t.count * -1
                    })
                }

            })

            res.json(finalData)

        })


    })


});

//Clients with appointment status 0
router.post('/appointmentStatusZero', function(req, res) {
    // db.getCollection('appointments').aggregate([

    // {$group : {_id:{clientId : "$client.id" ,name : "$client.name" , phoneNumber : "$client.phoneNumber"}, status :{$push : {status:"$status", appId: "$_id" }}}},

    // {$match : {"status.status" : {$nin : [1,2,3,4]}}},
    // {$project : {status:1, parlorId:1 , parlorName: 1 , parlorAddress:1}},
    // // {$group : {_id: {id:"$parlorId" , name : "$parlorName" , address : "$parlorAddress"}}}
    // ])
    var startDate = req.body.startDate;
    var endDate = req.body.endDate;
    var parlorIds = req.body.parlorIds ? req.body.parlorIds : [];
    var query = { parlorId: { $in: parlorIds }, status: 0, appointmentStartTime: { $gte: HelperService.getDayStart(startDate), $lt: HelperService.getDayEnd(endDate) } };
    if (parlorIds.length == 0) query = { status: 0, appointmentStartTime: { $gte: HelperService.getDayStart(startDate), $lt: HelperService.getDayEnd(endDate) } };
    var data = [];
    Appointment.find(query).exec(function(err, appointment) {
        _.forEach(appointment, function(appt) {
            var appoint = {};
            // if(appt.status == 0 ){
            appoint.clientName = appt.client.name,
                appoint.phoneNumber = appt.client.phoneNumber,
                appoint.parlorName = appt.parlorName + "|" + appt.parlorAddress2,
                appoint.appointmentDate = appt.appointmentStartTime.toDateString(),
                appoint.services = _.map(appt.services, function(ser) {
                    return ser.name
                });
            // }
            data.push(appoint)
        });

        console.log(data)
        res.json(CreateObjService.response(false, data));
    })
});


router.post('/sendSmsCustomer', function(req, res) {
    var data = [];
    var date = new Date();
    var query = {};
    console.log(req.body.appActivity)
    if (req.body.appActivity == "freeHairCutWithCondition") {
        query = { $and: [{ "freeServices.code": { $in: [52, 202] } }, { "freeHairCutBar": 100 }] }
    }
    if (req.body.appActivity == "freeHairCut") {
        query = { $and: [{ "freeServices.code": { $in: [52, 202] } }, { "freeHairCutBar": 0 }] }
    }
    if (req.body.appActivity == "cashBack100") {
        query = { "creditsHistory.reason": { $ne: "100% cashback" } }
    }
    if (req.body.appActivity == "apptOneMonth") {
        query = { "parlors.createdAt": { $lte: HelperService.getLastMonthStartDate(date, 30) } }
    }
    if (req.body.appActivity == "apptTwoMonths") {
        query = { "parlors.createdAt": { $lte: HelperService.getLastMonthStartDate(date, 60) } }
    }
    if (req.body.appActivity == "freebies1000") {
        query = { "loyalityPoints": { $lt: 1000 } }
    }
    if (req.body.appActivity == "freebies2000") {
        query = { "loyalityPoints": { $gte: 2000 } }
    }
    if (req.body.appActivity == "lastActiveOneMonth") {
        query = { "lastActiveTime": { $lt: HelperService.getLastMonthStartDate(date, 30) } }
    }
    if (req.body.appActivity == "male") {
        query = { "gender": "M" }
    }
    if (req.body.appActivity == "female") {
        query = { "gender": "F" }
    }
    if (req.body.appActivity == "nonAppUsers") {
        query = { $and: [{ firebaseId: { $eq: null } }, { firebaseIdIOS: { $eq: null } }] }
    } else {
        query
    }
    var parlorIds = req.body.parlorIds ? req.body.parlorIds : [];
    var query2 = { parlorId: { $in: parlorIds } };
    if (req.body.testingNumber) {
        var number = req.body.testingNumber;
        var usermessage = req.body.message;
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
    }
    if (!parlorIds.length) {
        console.log("NOOOOOOOOOOOOOOOOOOOOOOOO")
        console.log(query)
        User.find(query, { phoneNumber: 1, firstName: 1 }).exec(function(err, users) {
            _.forEach(users, function(u) { data.push(u.phoneNumber) })
            var usermessage = req.body.message;
            _.forEach(data, function(number) {
                var param = usermessage.replace(/&/g, "%26");
                var enc = encodeURI(param)
                var request = require("request");
                // var url = "http://www.myvaluefirst.com/smpp/sendsms?username=%20shailendrabeu&password=%20shailn567&to=" + number + "&from=BEUSLN&text=" + enc + "";
                // console.log("url", url)
                // request({
                //     // agent:false,
                //     url: url,
                //     json: true
                // }, function(error, response, body) {
                //     console.log(error);
                //     if (!error) {

                //         console.log(response.body)
                //     }
                // })

            })
            return res.json(CreateObjService.response(false, "SMS Sent Successfully"));
        })
    }
    // if(req.body.Bangalore){
    //     console.log("bangggggggggggggg")
    //     var dd=[];
    //     User.find({createdAt:{$gt:new Date(2017,10,1)} , gender:"F"} , {latitude:1,longitude:1 , createdAt:1,firstName:1, phoneNumber:1},function(err,users) {
    //         console.log(users.length)
    //         var bangaloreUsers = [];
    //         var usermessage = req.body.message;
    //         async.each(users,function(u , call) {
    //              var cityId = ConstantService.getCityId(u.latitude , u.longitude)
    //              if(cityId==2){

    //                 bangaloreUsers.push(u)

    //                 var number = u.phoneNumber;

    //                 var request = require("request");
    //                 var url = "http://www.myvaluefirst.com/smpp/sendsms?username=%20shailendrabeu&password=%20shailn567&to=" + number + "&from=BEUSLN&text=" + usermessage + "";
    //                 // console.log("url", url)
    //                 request({url: url , json: true}, function(error, response, body) {
    //                     // console.log(error);
    //                     if (!error) {
    //                          dd.push(u)
    //                     }
    //                 })

    //                 call()
    //              }
    //              else{
    //                 call()
    //              }
    //         },function allTaskCompleted(){
    //             // res.json(d) 
    //             return res.json(CreateObjService.response(false, "SMS Sent Successfully - "+dd.length+""));
    //         })
    //         console.log("dd.length" ,dd.length)
    //         console.log("bangaloreUsers" ,bangaloreUsers.length)
    //     })
    // } 
    else {
        console.log("elseeeeeeeeeee")
        Appointment.find(query2, { "client.name": 1, "client.phoneNumber": 1 }).exec(function(err, appointment) {
            var numbers = _.map(appointment, function(appt) { return appt.client.phoneNumber })
            query.phoneNumber = { $in: numbers };
            console.log(query)
            User.find(query, { phoneNumber: 1, firstName: 1 }).exec(function(err, users) {
                _.forEach(users, function(u) { data.push(u.phoneNumber) })
                var usermessage = req.body.message;
                console.log("elseeeeeeeee", data)
                _.forEach(data, function(number) {
                    var request = require("request");
                    var url = "http://www.myvaluefirst.com/smpp/sendsms?username=%20shailendrabeu&password=%20shailn567&to=" + number + "&from=BEUSLN&text=" + usermessage + "";
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
                })
                return res.json(CreateObjService.response(false, "SMS Sent Successfully"));
            })
        })
    }
});


router.post('/customerFrequency', function(req, res) {

    var query = [
        { $match: { status: 3 } },
        { $group: { _id: "$parlorId", client: { $push: { client: "$client" } } } },
        { $unwind: "$client" },
        { $group: { _id: "$client.client.id", parlorId: { "$first": "$_id" }, count: { $sum: 1 } } },
    ];

    Parlor.find({}, { name: 1 }, function(err, parlors) {

        console.log(parlors)

        function getParlorName(id) {

            var array = parlors;

            var name = _.filter(parlors, function(f) {
                return f._id == id;
            })
            console.log(name)
            if (name.length > 0) {
                var ret = name[0].name;
            } else {

                var ret = id;

            }
            return ret

        }

        var finalData = {};

        Appointment.aggregate(query, function(err, data1) {
            var data = _.groupBy(data1, function(g) {

                return g.parlorId;
            })

            var keys = [];
            for (var key in data) {
                keys.push(key);
            }
            var data2 = _.map(keys, function(k) {
                return {
                    parlorName: k,
                    data: _.groupBy(data[k], function(s) {
                        return s.count;

                    })
                }
            })



            var data3 = _.map(data2, function(d) {

                var keys = [];
                for (var key in d.data) {

                    keys.push(key)
                }

                return {
                    parlorName: getParlorName(d.parlorName),
                    data: _.map(keys, function(f) {

                        return {

                            [f]: d.data[f].length

                        }


                    })

                }

            })

            var query2 = [
                { $match: { status: 3 } },
                { $group: { _id: "$client.id", count: { $sum: 1 } } },
                { $group: { _id: "$count", client: { $sum: 1 } } }

            ];


            Appointment.aggregate(query2, function(err, data1) {



                var a = { parlorName: "Be U", one: 0, two: 0, three: 0, four: 0, five: 0, moreThanFive: 0, total: 0 }

                var d = 0;
                var h = 1;
                var b = 0;

                data1.forEach(function(m) {
                    console.log(m)
                    var key = m._id

                    if (key == 1) {
                        a.one = m.client
                    } else if (key == 2) {
                        a.two = m.client

                    } else if (key == 3) {
                        a.three = m.client

                    } else if (key == 4) {
                        a.four = m.client

                    } else if (key == 5) {
                        a.five = m.client

                    } else {
                        a.moreThanFive = a.moreThanFive + m.client
                    }


                });


                finalData.parlor = data3
                finalData.beu = a

                return res.json(CreateObjService.response(false, finalData));


            })





        })


    })


});

router.post('/loyaltyUsed', function(req, res) {

    var query = [
        { $unwind: "$creditsHistory" },
        { $match: { "creditsHistory.reason": { $ne: "New Registration" } } },
        { $match: { "creditsHistory.amount": { $lt: 0 } } },
        {
            $lookup: {
                from: "appointments",
                localField: "creditsHistory.source",
                foreignField: "_id",
                as: "appointments"
            }
        },
        { $unwind: "$appointments" },
        { $project: { creditsHistory: 1, status: "$appointments.status", subtotal: "$appointments.subtotal" } },
        { $match: { status: 3 } },
        { $group: { _id: "$_id", sum: { $push: "$subtotal" } } },
        { $unwind: "$sum" },
        {
            $project: {
                "range": {
                    $concat: [
                        { $cond: [{ $and: [{ $eq: ["$sum", 0] }] }, "0", ""] },
                        { $cond: [{ $and: [{ $gt: ["$sum", 0] }, { $lt: ["$sum", 500] }] }, "0-500", ""] },
                        { $cond: [{ $and: [{ $gte: ["$sum", 500] }, { $lt: ["$sum", 1000] }] }, "500-1000", ""] },
                        { $cond: [{ $and: [{ $gte: ["$sum", 1000] }, { $lt: ["$sum", 2000] }] }, "1000-2000", ""] },
                        { $cond: [{ $and: [{ $gte: ["$sum", 2000] }, { $lt: ["$sum", 5000] }] }, "2000-5000", ""] },
                        { $cond: [{ $gt: ["$sum", 5000] }, "Above 5000", ""] }
                    ]
                },
                sum: 1
            }
        },
        { $group: { _id: "$range", count: { $sum: 1 } } }
    ];



    User.aggregate(query, function(err, result) {

        var data = _.filter(result, function(r) {

            return r._id != "0"

        });
        var data1 = _.filter(data, function(r) {

            return r._id != ""

        });

        var data3 = _.sortBy(data1, function(d) {
            return d._id

        })


        return res.json(CreateObjService.response(false, data3));

    })


})

router.post('/loyaltyUsedFirst', function(req, res) {



    var query = [
        { $unwind: "$creditsHistory" },
        { $match: { "creditsHistory.reason": { $ne: "New Registration" } } },
        { $match: { "creditsHistory.amount": { $lt: 0 } } },
        {
            $lookup: {
                from: "appointments",
                localField: "creditsHistory.source",
                foreignField: "_id",
                as: "appointments"
            }
        },
        { $unwind: "$appointments" },
        { $project: { creditsHistory: 1, status: "$appointments.status", subtotal: "$appointments.subtotal" } },
        { $match: { status: 3 } },
        { $group: { _id: "$_id", sum: { $push: "$subtotal" } } },
        { $project: { _id: 1, sum: { "$arrayElemAt": ["$sum", 0] } } },
        {
            $project: {
                "range": {
                    $concat: [
                        { $cond: [{ $and: [{ $eq: ["$sum", 0] }] }, "0", ""] },
                        { $cond: [{ $and: [{ $gt: ["$sum", 0] }, { $lt: ["$sum", 500] }] }, "0-500", ""] },
                        { $cond: [{ $and: [{ $gte: ["$sum", 500] }, { $lt: ["$sum", 1000] }] }, "500-1000", ""] },
                        { $cond: [{ $and: [{ $gte: ["$sum", 1000] }, { $lt: ["$sum", 2000] }] }, "1000-2000", ""] },
                        { $cond: [{ $and: [{ $gte: ["$sum", 2000] }, { $lt: ["$sum", 5000] }] }, "2000-5000", ""] },
                        { $cond: [{ $gt: ["$sum", 5000] }, "Above 5000", ""] }
                    ]
                },
                sum: 1
            }
        },
        { $group: { _id: "$range", count: { $sum: 1 } } }

    ];



    User.aggregate(query, function(err, result) {

        var data = _.filter(result, function(r) {

            return r._id != "0"

        });
        var data1 = _.filter(data, function(r) {

            return r._id != ""

        });

        var data3 = _.sortBy(data1, function(d) {
            return d._id

        })


        return res.json(CreateObjService.response(false, data3));

    })

})
router.post('/loyaltyUsedSecond', function(req, res) {

    var query = [

        { $unwind: "$creditsHistory" },
        { $match: { "creditsHistory.reason": { $ne: "New Registration" } } },
        { $match: { "creditsHistory.amount": { $lt: 0 } } },
        {
            $lookup: {
                from: "appointments",
                localField: "creditsHistory.source",
                foreignField: "_id",
                as: "appointments"
            }
        },
        { $unwind: "$appointments" },
        { $project: { creditsHistory: 1, status: "$appointments.status", subtotal: "$appointments.subtotal" } },
        { $match: { status: 3 } },
        { $group: { _id: "$_id", subtotal: { $push: "$subtotal" } } },
        { $match: { 'subtotal.1': { $exists: true } } },





    ];

    User.aggregate(query, function(err, result) {



        var data2 = _.map(result, function(r) {
            return {
                id: r._id,
                data: (r.subtotal).splice(0, 1)

            }
        })


        var data3 = _.map(data2, function(s) {
            var sum = 0;


            for (var i = 0; i < s.data.length; i++) {
                console.log("s.data[i]", s.data[i])
                sum = sum + s.data[i];
            }

            console.log(sum)
            return {
                id: s.id,
                data: sum

            }
        });

        console.log(data3)
        var dataObj = [{
            label: "1-100",
            count: 0
        }, {
            label: "100-200",
            count: 0
        }, {
            label: "200-300",
            count: 0
        }, {
            label: "300-400",
            count: 0
        }, {
            label: "400-500",
            count: 0
        }, {
            label: "500-800",
            count: 0
        }, {
            label: "800-1000",
            count: 0
        }, {
            label: "1000-1200",
            count: 0
        }, {
            label: "1200-1500",
            count: 0
        }, {
            label: "1500-2000",
            count: 0
        }, {
            label: "2000-5000",
            count: 0
        }, {
            label: "above 5000",
            count: 0
        }];



        data3.forEach(function(s) {

            if (s.data > 0 && s.data < 100) {
                dataObj[0].count++;
            } else if (s.data >= 100 && s.data < 200) {
                dataObj[1].count++;
            } else if (s.data >= 200 && s.data < 300) {
                dataObj[2].count++;
            } else if (s.data >= 300 && s.data < 400) {
                dataObj[3].count++;
            } else if (s.data >= 400 && s.data < 500) {
                dataObj[4].count++;
            } else if (s.data >= 500 && s.data < 800) {
                dataObj[5].count++;
            } else if (s.data >= 800 && s.data < 1000) {
                dataObj[6].count++;
            } else if (s.data >= 1000 && s.data < 1200) {
                dataObj[7].count++;
            } else if (s.data >= 1200 && s.data < 1500) {
                dataObj[8].count++;
            } else if (s.data >= 1500 && s.data < 2000) {
                dataObj[9].count++;
            } else if (s.data > 2000 && s.data < 5000) {
                dataObj[10].count++;
            } else if (s.data < -5000) {

                dataObj[11].count++;

            }

        })



        return res.json(CreateObjService.response(false, dataObj));

    })


});

router.get('/loyalityOffered', function(req, res) {
    console.log("called")
    User.aggregate([
        { $match: { "creditsHistory.reason": "New Registration" } },
        { $group: { _id: null, count: { $sum: 1 } } }


    ], function(err, count) {
        console.log(err)
        console.log(count)
        return res.json(CreateObjService.response(false, count[0].count));


    })

})

router.post('/getLatLongFromUser', function(req, res) {
    console.log("lat Long")
    var typeLatitude = req.body.typeLatitude,
        typeLongitude = req.body.typeLongitude;
    var data = [];
    User.find({}, { longitude: 1, latitude: 1, registerLongitude: 1, registerLatitude: 1 }, function(err, users) {
        _.forEach(users, function(u) {
            // var arr= {};
            if (typeLatitude == "latitude" && typeLongitude == "longitude") {
                if (u.latitude > 0 && u.longitude > 0) {
                    data.push({ latitude: u.latitude, longitude: u.longitude })
                }
            }
            if (typeLatitude == "registerLatitude" && typeLongitude == "registerLongitude") {
                if (u.registerLatitude > 0 && u.registerLongitude > 0) {
                    data.push({ latitude: u.registerLatitude, longitude: u.registerLongitude })
                }
            }
        })
        return res.json(CreateObjService.response(false, data));
    })
});


router.post('/changeUserStatus', function(req, res) {
    var phoneNumber = req.body.phoneNumber
    var data = {};
    User.find({ phoneNumber: phoneNumber }, { createdAt: 1, firebaseId: 1, firebaseIdIOS: 1, firstName: 1, creditsHistory: 1, loyalityPoints: 1, freeHairCutBar: 1, allow100PercentDiscount: 1, freeServices: 1 }, function(err, users) {
        _.forEach(users, function(user) {
            data.created = user.createdAt.toDateString(),
                data.firstName = user.firstName,
                data.freeHairCutBar = user.freeHairCutBar,
                data.allow100PercentDiscount = user.allow100PercentDiscount,
                data.loyalityPoints = user.loyalityPoints,
                data.freeServices = _.map(user.freeServices, function(free) {
                    return {
                        name: free.name,
                    }
                }),
                data.creditsHistory = _.map(user.creditsHistory, function(cH) {
                    return {
                        reason: cH.reason,
                        amount: cH.amount,
                    }
                })
            if (user.firebaseId || user.firebaseIdIOS) {
                data.hasApp = true
            } else data.hasApp = false
        })
        return res.json(CreateObjService.response(false, data));
    })
});


router.post('/updateChangedUser', function(req, res) {
    var phoneNumber = req.body.phoneNumber;
    var updateQuery = {};
    // var creditObject = {
    //                     "createdAt" : new Date(),
    //                     "amount" : (req.body.newloyalityPoints - req.body.oldloyalityPoints),
    //                     "balance" : req.body.newloyalityPoints,
    //                     "source" : null,
    //                     "reason" : "Review"
    //                     };
    if (req.body.newloyalityPoints) {
        updateQuery = { loyalityPoints: req.body.newloyalityPoints }
    }
    if (req.body.newfreeHairCutBar) {
        updateQuery = { freeHairCutBar: req.body.newfreeHairCutBar }
    }
    if (req.body.newallow100PercentDiscount) {
        updateQuery = { allow100PercentDiscount: req.body.newallow100PercentDiscount }
    }
    User.update({ phoneNumber: req.body.phoneNumber }, updateQuery, function(err, updated) {
        if (err) {
            return res.json(CreateObjService.response(false, "Not Updated"));
        } else {
            return res.json(CreateObjService.response(false, "Successfully Updated"));
        }
    })
});

router.post('/appointmentClosingPattern', function(req, res) {
    var startDate = req.body.startDate,
        endDate = req.body.endDate;
    console.log(startDate)
    console.log(endDate)
    var parlorIds = req.body.parlorIds;
    var query2 = {};
    if (parlorIds.length == 0) {
        query2 = { appointmentStartTime: { $gte: HelperService.getDayStart(startDate), $lt: HelperService.getDayEnd(endDate) }, status: 3 }
    } else {
        var parl = [];
        _.forEach(parlorIds, function(p) {
            var pp = ObjectId(p);
            parl.push(pp)
        })
        query2 = { parlorId: { $in: parl }, appointmentStartTime: { $gte: HelperService.getDayStart(startDate), $lt: HelperService.getDayEnd(endDate) }, status: 3 }
    };
    var data = [],
        beuArray = [],
        salonArray = [];
    var query = [
        { $match: query2 },
        { $group: { _id: { id: "$parlorId", name: "$parlorName", address: "$parlorAddress" }, totalAppointments: { "$sum": 1 }, closedBy: { $push: { closedBy: "$closedBy", serviceRevenue: "$serviceRevenue" } } } }
    ]
    Appointment.aggregate(query).exec(function(err, pattern) {
        console.log(pattern)

        Beu.find({}, { _id: 1 }, function(err, beu) {

            beuArray = _.map(beu, function(b) { return b._id });

            _.forEach(pattern, function(p) {
                console.log(p)
                var arr = { closedBySalon: 0, closedByBeu: 0, totalAppointments: 0, closedByBeuAmount: 0, closedBySalonAmount: 0 }

                arr.totalAppointments = p.totalAppointments;
                arr.parlorName = p._id.name + "|" + p._id.address;

                _.forEach(p.closedBy, function(c) {

                    var filter = _.filter(beuArray, function(o) { return o + "" == c.closedBy + "" })

                    if (filter.length > 0 || c == null) {

                        arr.closedByBeu++,
                            arr.closedByBeuAmount += c.serviceRevenue;
                    } else {

                        arr.closedBySalon++,
                            arr.closedBySalonAmount += c.serviceRevenue;

                    }
                })
                data.push(arr)

            });
            return res.json(CreateObjService.response(false, data));

        })
    });
});


router.post('/corporateRequests', function(req, res) {
    var data = [];
    // CorporateCompanyRequest.find({} ,{userId:1,companyName:1,hrEmail:1,location:1}).exec(function(err,company){
    //     async.each(company,function(comp , cb){
    //         User.findOne({_id :comp.userId},{_id:1 , phoneNumber: 1 , firstName: 1,corporateEmailId:1} ,function(err,u) {
    //             if(u){
    //                 data.push({
    //                     "userName" : u.firstName,
    //                     "phoneNumber" : u.phoneNumber,
    //                     "userCorporateEmailId" :u.corporateEmailId,
    //                     "companyName" : comp.companyName,
    //                     "hrEmail" : comp.hrEmail,
    //                     "location" : comp.location
    //                 });
    //                      }
    //             cb();
    //         })
    //     },function(done){
    //         console.log("all done");
    //         res.json(data);
    //     });
    // })
    CorporateCompanyRequest.aggregate([{
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $project: {
                phoneNumber: { $arrayElemAt: ["$user.phoneNumber", 0] },
                firstName: { $arrayElemAt: ["$user.firstName", 0] },
                hrEmail: 1,
                userId: 1,
                companyName: 1,
                location: 1,
                createdAt: { '$dateToString': { format: '%m/%d/%Y', date: '$createdAt' } },
            }
        },
        { $sort: { createdAt: -1 } }
    ]).exec(function(err, agg) {
        return res.json(CreateObjService.response(false, agg));
    })
});

// router.post('/googleDrive',function (req,res) {
//
//
//
//     var SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];
//     var clientSecret ="MI1mSD9t-9MsVL3RkkPEj_2D" ;
//     var clientId = "730549865354-unkmveaup1qfq3hl69jj661hp950ul1f.apps.googleusercontent.com";
//     var redirectUrl = "https://developers.google.com/oauthplayground";
//     var auth = new googleAuth();
//     var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
//     function getNewToken(oauth2Client, callback) {
//         var authUrl = oauth2Client.generateAuthUrl({
//             access_type: 'offline',
//             scope: SCOPES
//         });
//         return authUrl
//     }
//
//
// res.json(getNewToken(oauth2Client))
//
//
//
//
//
//
//
// })




// function getParlor(id,cb){


// Parlor.find({},{parlorType:1},function(err,result){



//             })



// }

router.post('/setFavParlorForAll', function(req, res) {

    //function to find the most visited grade of salons after passing salon types array e.g [0,0,1,1] based on appointments
    var mostFrequentSalonType = function(obj) {

        var highestKey = "";

        var highestValue = 0;

        var o;

        for (o in obj) {
            if (obj[o] >= highestValue) {
                highestValue = obj[o];
                highestKey = o;
            }
        }

        return highestKey;

    }

    //function to find maximum went salon type ends

    Parlor.find({}, { parlorType: 1 }, function(err, salonTypeArray) {

        var salonAndType = salonTypeArray; //this array is used to get the type of salon 0,1,2
        User.find({}, { parlors: 1 }, function(err, userParlorsArray) {


            async.each(userParlorsArray, function(u, cb) {

                var numOfAppointmentsSalonWise = { "0": 0, "1": 0, "2": 0 };

                for (var j = 0; j < u.parlors.length; j++) {

                    for (var k = 0; k < salonAndType.length; k++) {
                        if (u.parlors[j]["parlorId"] == salonAndType[k]["_id"]) {
                            numOfAppointmentsSalonWise[salonAndType[k]["parlorType"]] += u.parlors[j]["noOfAppointments"];
                        }
                    }

                }

                console.log(u["_id"]);

                console.log("done");

                User.update({ "_id": u["_id"] }, { $set: { "favParlor": mostFrequentSalonType(numOfAppointmentsSalonWise) } }, function(err, data) {
                    console.log("Favorite parler updated");
                    cb();
                });

            }, function(done) {

                console.log("all done");

                res.json("Favourite Parlor of all updated.");


            });



        }); //limit to be removed in production

    });

});


router.get('/employeeReferral', function(req, res) {

    var toReturn = [];

    EmployeeReferral.find({}, { createdAt: 0, updatedAt: 0, _v: 0 }, function(err, data) {

        async.each(data, function(d, cb) {

            var d = d;

            Admin.findOne({ "_id": ObjectId(d.employeeId) }, { firstName: 1, lastName: 1, parlorId: 1, _id: 0 }, function(err, data1) {

                if (data1) {
                    d.name = data1.firstName + " " + data1.lastName;
                    Parlor.findOne({ "_id": ObjectId(data1.parlorId) }, { name: 1, _id: 0 }, function(err, data2) {
                        if (data2) {

                            d.parlorName = data2.name;

                            console.log(d.parlorName);

                            toReturn.push({
                                "parlorName": d.parlorName,
                                "name": d.name,
                                "department": d.department,
                                "experience": d.experience,
                                "salaryMax": d.salaryMax,
                                "salaryMin": d.salaryMin,
                                "city": d.city,
                                "area": d.area,
                                "distance": d.distance,
                                "address": d.address,
                                "gender": d.gender,
                                "_id": d._id,
                                "referredContactName": d.referredContactName,
                                "referredContactNumber": d.referredContactNumber
                            });
                            cb();
                        } else {
                            toReturn.push({
                                "name": d.name,
                                "department": d.department,
                                "experience": d.experience,
                                "salaryMax": d.salaryMax,
                                "salaryMin": d.salaryMin,
                                "city": d.city,
                                "area": d.area,
                                "distance": d.distance,
                                "address": d.address,
                                "gender": d.gender,
                                "_id": d._id,
                                "referredContactName": d.referredContactName,
                                "referredContactNumber": d.referredContactNumber
                            });
                            cb();
                        }
                    });
                } else {

                    toReturn.push({
                        "department": d.department,
                        "experience": d.experience,
                        "salaryMax": d.salaryMax,
                        "salaryMin": d.salaryMin,
                        "city": d.city,
                        "area": d.area,
                        "distance": d.distance,
                        "address": d.address,
                        "gender": d.gender,
                        "_id": d._id,
                        "referredContactName": d.referredContactName,
                        "referredContactNumber": d.referredContactNumber
                    });

                    cb();
                }
            });

        }, function() {
            res.json(toReturn);
        });

    });

});

router.post('/employeeReferral', function(req, res) {
    EmployeeReferral.update({ "_id": ObjectId(req.body._id) }, { $set: { gender: req.body.gender, address: req.body.address, distance: req.body.distance, area: req.body.area, city: req.body.city, salaryMin: req.body.salaryMin, salaryMax: req.body.salaryMax, experience: req.body.experience, department: req.body.department, latitude: req.body.lat, longitude: req.body.long } }, function(err, data) {
        return res.json(CreateObjService.response(false, data));
    })
});


router.post('/salonCashbackFreebies', function(req, res) {
    console.log(req.body)
    var period = req.body.period ? req.body.period : [];
    var query = { period: { $in: period } };
    var parlorIds = req.body.parlorIds ? req.body.parlorIds : []
        // if (period.length == 0) query = {};
    var data = [];
    console.log(query)
    SettlementReport.aggregate([
        { $match: query },
        {
            $project: {
                parlorName: 1,
                parlorAddress: 1,
                parlorId: 1,
                period: 1,
                cashBack: {
                    $add: ["$refundOnErp", "$refundFirstAppDigital", "$refundAppDigitalCash", "$refundAppDigitalOnline"]
                },
                collectedByLoyalityPoints: 1
            }
        }, {
            $group: {
                _id: {
                    parlorId: "$parlorId",
                    parlorName: "$parlorName",
                },
                parlorAddress: { $first: "$parlorAddress" },
                cashBack: { $sum: "$cashBack" },
                loyalityPoints: { $sum: "$collectedByLoyalityPoints" }
            }
        }
    ]).exec(function(err, settleMent) {
        _.forEach(settleMent, function(set) {
            var arr = {};
            arr.parlorId = set._id.parlorId,
                arr.parlorName = set._id.parlorName + " - " + set.parlorAddress,
                arr.cashBack = set.cashBack,
                arr.loyalityPoints = set.loyalityPoints,
                arr.purchaseScheme = set.purchaseScheme,

                data.push(arr);
        })
        return res.json(CreateObjService.response(false, data));
    })

});


//deal functions

router.get("/getDailyDeals", function(req, res) {

    DailyDeal.find({}, function(err, data) {
        if (err) return console.error(err)
        return res.json(CreateObjService.response(false, data));

    });

});

router.post("/createDailyDeal", function(req, res) {

    var dailyDeal = {
        dealDay: req.body.dealDay,
        dealId: req.body.dealId,
        offerName: req.body.offerName,
        offerGender: req.body.offerGender,
        offerTitle: req.body.offerTitle,
        offerText: req.body.offerText,
        alternateText: req.body.alternateText
    }

    DailyDeal.create(dailyDeal, function(err, response) {
        console.log(err)
        if (!err) {
            res.json({ "status": "success" });
        }
    });

});

router.post("/removeDailyDeal", function(req, res) {

    DailyDeal.remove({ "_id": req.body._id }, function(err, response) {
        console.log(err)
        if (!err) {
            res.json({ "status": "success" });
        }
    });

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
                Admin.find({ "parlorId": r._id, "active": true, $or: [{ "accountNumber": { $exists: false } }, { "accountNumber": { $eq: null } }] }, { firstName: 1, lastName: 1, "_id": 0 }, function(err, empWithoutAccounts) {

                    if (empWithoutAccounts) {

                        var empWithout = [];

                        for (var i = 0; i < empWithoutAccounts.length; i++) {
                            empWithout.push(empWithoutAccounts[i].firstName + " " + empWithoutAccounts[i].lastName)
                        }

                        data.push({ gstNumber: r.gstNumber, name: r.name, wifiName: r.wifiName, wifiPassword: r.wifiPassword, "empWithoutAccounts": empWithout });
                    }

                    cb();
                })
            }, function(done) {

                res.json(CreateObjService.response(false, data));

            });
        }



        // if(err){
        //     res.json(CreateObjService.response(true, err));
        //
        //
        // }else{
        //     res.json(CreateObjService.response(false, result));
        //
        // }

    })
})

router.post("/updateDailyDeal", function(req, res) {

    DailyDeal.update({ "_id": req.body._id }, { $set: { "dealDay": req.body.dealDay, "dealId": req.body.dealId, "offerName": req.body.offerName, "offerGender": req.body.offerGender, "offerTitle": req.body.offerTitle, "offerText": req.body.offerText, "alternateText": req.body.alternateText } }, function(err, response) {
        console.log(err)
        if (!err) {
            res.json({ "status": "success" });
        }
    });

});

var Fraction = require("fractional").Fraction;

router.post("/updateThisMonthAvg", function(req, res) {

    var updateThisMonthAverages = function() {

        var thisMonthStart = function() {
            var d = new Date();
            return new Date(d.getFullYear(), d.getMonth(), 1);
        }

        var thisMonthStart = thisMonthStart();

        var appointmentPeriod = { $gte: new Date(thisMonthStart.getFullYear(), thisMonthStart.getMonth(), thisMonthStart.getDate(), 0, 0, 0), $lte: new Date() };

        //{$divide : [{$multiply : ["$services.price", "$services.employees.distribution"]}, 100]}

        Admin.find({ role: { $nin: [7] }, active: true }, { _id: 1 }, function(err, employees) {

            async.eachSeries(employees, function(emp, cb) {

                var avgBillValueThisMonth = 0;
                var sharedBillRatioThisMonth = 0;
                var avgServicePerBillThisMonth = 0;
                var empId = emp._id;

                Appointment.aggregate([
                    { $match: { status: 3 } },
                    { $unwind: "$employees" },
                    { $match: { "employees.employeeId": ObjectId(empId), "appointmentStartTime": appointmentPeriod } },
                    { $group: { _id: "$employees.employeeId", revenueByEmployee: { $sum: "$employees.revenue" }, totalServices: { $sum: 1 } } }
                ], function(err, response1) {

                    if (err) {
                        console.log(err);
                        cb();
                    } else {
                        if (response1.length > 0) {

                            avgBillValueThisMonth = (response1[0].revenueByEmployee / response1[0].totalServices);

                            Appointment.aggregate([
                                { $match: { status: 3 } },
                                { $unwind: "$services" },
                                { $unwind: "$services.employees" },
                                { $match: { "services.employees.employeeId": ObjectId(empId), "appointmentStartTime": appointmentPeriod } },
                                { $group: { _id: "$services.employees.employeeId", count: { $sum: 1 }, app: { $push: "$_id" } } },
                                { $unwind: "$app" },
                                { $group: { _id: "$app", services: { "$first": "$count" } } },
                                { $group: { _id: null, services: { $first: "$services" }, appt: { $sum: 1 } } }
                            ], function(err, response2) {

                                if (err) {
                                    console.log(err);
                                    cb();
                                } else {

                                    if (response2.length > 0) {

                                        avgServicePerBillThisMonth = (response2[0].services / response2[0].appt);

                                        Appointment.aggregate([
                                            { $match: { status: 3 } },
                                            { $unwind: "$services" },
                                            { $match: { "services.employees.employeeId": ObjectId(empId), "appointmentStartTime": appointmentPeriod } }
                                        ], function(err, appts) {

                                            if (err) {
                                                console.log(err);
                                                cb();
                                            } else {

                                                if (appts.length > 0) {

                                                    var revenueByEmployee = 0;
                                                    var revenueByOthers = 0;

                                                    async.each(appts, function(appt, cb1) {

                                                        if (appt.services.loyalityPoints == undefined || appt.services.loyalityPoints == 0) {

                                                            async.each(appt.services.employees, function(emp, cb2) {

                                                                if ((emp.employeeId).toString() == (empId).toString()) {

                                                                    revenueByEmployee += (appt.services.price) * (emp.distribution / 100);
                                                                    cb2();
                                                                } else {
                                                                    revenueByOthers += (appt.services.price) * (emp.distribution / 100);
                                                                    cb2();
                                                                }

                                                            }, function() {
                                                                cb1();
                                                            });

                                                        } else {

                                                            async.each(appt.services.employees, function(emp, cb2) {

                                                                if ((emp.employeeId).toString() == (empId).toString()) {
                                                                    revenueByEmployee += (appt.services.price - appt.services.loyalityPoints) * 0.25 * (emp.distribution / 100);
                                                                    cb2();
                                                                } else {
                                                                    revenueByOthers += (appt.services.price - appt.services.loyalityPoints) * 0.25 * (emp.distribution / 100);
                                                                    cb2();
                                                                }

                                                            }, function() {
                                                                cb1();
                                                            });

                                                        }

                                                    }, function() {

                                                        if (revenueByOthers == 0) {
                                                            sharedBillRatioThisMonth = 1;
                                                        } else {
                                                            sharedBillRatioThisMonth = revenueByEmployee / revenueByOthers;

                                                            if (sharedBillRatioThisMonth == 0) {

                                                            } else {

                                                                var f = new Fraction(sharedBillRatioThisMonth.toFixed(2));

                                                                sharedBillRatioThisMonth = f.numerator + "/" + f.denominator;

                                                            }

                                                        }

                                                        Admin.update({ "_id": ObjectId(empId) }, { $set: { "avgBillValueThisMonth": avgBillValueThisMonth, "sharedBillRatioThisMonth": sharedBillRatioThisMonth, "avgServicePerBillThisMonth": avgServicePerBillThisMonth } }, function(err, updated) {
                                                            if (err) {
                                                                console.log(err);
                                                                cb();
                                                            }
                                                            if (updated) {
                                                                console.log("updated");
                                                                cb();
                                                            }
                                                        });

                                                    });
                                                } else {
                                                    cb();
                                                }
                                            }
                                        });
                                    } else {

                                        Admin.update({ "_id": ObjectId(empId) }, { $set: { "avgBillValueThisMonth": avgBillValueThisMonth, "sharedBillRatioThisMonth": sharedBillRatioThisMonth, "avgServicePerBillThisMonth": avgServicePerBillThisMonth } }, function(err, updated) {
                                            if (err) {
                                                console.log(err);
                                                cb();
                                            }
                                            if (updated) {
                                                console.log("updated");
                                                cb();
                                            }
                                        });
                                    }
                                }

                            });
                        } else {
                            Admin.update({ "_id": ObjectId(empId) }, { $set: { "avgBillValueThisMonth": avgBillValueThisMonth, "sharedBillRatioThisMonth": sharedBillRatioThisMonth, "avgServicePerBillThisMonth": avgServicePerBillThisMonth } }, function(err, updated) {
                                if (err) {
                                    console.log(err);
                                    cb();
                                }
                                if (updated) {
                                    console.log("updated");
                                    cb();
                                }
                            });
                        }
                    }
                });
            })
        });
    }

    updateThisMonthAverages();

});

router.post("/updateLastMonthAvg", function(req, res) {

    var updateLastMonthAverages = function() {

        var lastMonthStart = function() {
            var d = new Date();
            return (new Date(d.getFullYear(), d.getMonth() - 1, 1));

        }

        var lastMonthEnd = function() {
            var d = new Date(); // current date
            d.setDate(1); // going to 1st of the month
            d.setHours(-1);
            d.setMinutes(59);
            d.setSeconds(59);
            return d;
        }

        var lastMonthStart = lastMonthStart();
        var lastMonthEnd = lastMonthEnd();

        var appointmentPeriod = { $gte: new Date(lastMonthStart.getFullYear(), lastMonthStart.getMonth(), lastMonthStart.getDate(), 0, 0, 0), $lt: new Date(lastMonthEnd.getFullYear(), lastMonthEnd.getMonth(), lastMonthEnd.getDate(), 0, 0, 0) };

        Admin.find({ role: { $nin: [7] }, active: true }, { _id: 1 }, function(err, employees) {

            async.eachSeries(employees, function(emp, cb) {
                var avgBillValueLastMonth = 0;
                var sharedBillRatioLastMonth = 0;
                var avgServicePerBillLastMonth = 0;
                var empId = emp._id;

                Appointment.aggregate([
                    { $match: { status: 3 } },
                    { $unwind: "$employees" },
                    { $match: { "employees.employeeId": ObjectId(empId), "appointmentStartTime": appointmentPeriod } },
                    { $group: { _id: "$employees.employeeId", revenueByEmployee: { $sum: "$employees.revenue" }, totalServices: { $sum: 1 } } }
                ], function(err, response1) {
                    if (err) {
                        console.log(err);
                        cb();
                    } else {
                        if (response1.length > 0) {

                            avgBillValueLastMonth = (response1[0].revenueByEmployee / response1[0].totalServices);

                            Appointment.aggregate([
                                { $match: { status: 3 } },
                                { $unwind: "$services" },
                                { $unwind: "$services.employees" },
                                { $match: { "services.employees.employeeId": ObjectId(empId), "appointmentStartTime": appointmentPeriod } },
                                { $group: { _id: "$services.employees.employeeId", count: { $sum: 1 }, app: { $push: "$_id" } } },
                                { $unwind: "$app" },
                                { $group: { _id: "$app", services: { "$first": "$count" } } },
                                { $group: { _id: null, services: { $first: "$services" }, appt: { $sum: 1 } } }
                            ], function(err, response2) {

                                if (err) {
                                    console.log(err);
                                    cb();
                                } else {

                                    if (response2.length > 0) {

                                        avgServicePerBillLastMonth = (response2[0].services / response2[0].appt);

                                        Appointment.aggregate([
                                            { $match: { status: 3 } },
                                            { $unwind: "$services" },
                                            { $match: { "services.employees.employeeId": ObjectId(empId), "appointmentStartTime": appointmentPeriod } }
                                        ], function(err, appts) {

                                            if (err) {
                                                console.log(err);
                                                cb();
                                            } else {

                                                if (appts.length > 0) {

                                                    var revenueByEmployee = 0;
                                                    var revenueByOthers = 0;

                                                    async.each(appts, function(appt, cb1) {

                                                        if (appt.services.loyalityPoints == undefined || appt.services.loyalityPoints == 0) {

                                                            async.each(appt.services.employees, function(emp, cb2) {

                                                                if ((emp.employeeId).toString() == (empId).toString()) {

                                                                    revenueByEmployee += (appt.services.price) * (emp.distribution / 100);
                                                                    cb2();
                                                                } else {
                                                                    revenueByOthers += (appt.services.price) * (emp.distribution / 100);
                                                                    cb2();
                                                                }

                                                            }, function() {
                                                                cb1();
                                                            });

                                                        } else {

                                                            async.each(appt.services.employees, function(emp, cb2) {

                                                                if ((emp.employeeId).toString() == (empId).toString()) {
                                                                    revenueByEmployee += (appt.services.price - appt.services.loyalityPoints) * 0.25 * (emp.distribution / 100);
                                                                    cb2();
                                                                } else {
                                                                    revenueByOthers += (appt.services.price - appt.services.loyalityPoints) * 0.25 * (emp.distribution / 100);
                                                                    cb2();
                                                                }

                                                            }, function() {
                                                                cb1();
                                                            });

                                                        }

                                                    }, function() {

                                                        if (revenueByOthers == 0) {
                                                            sharedBillRatioLastMonth = 1;
                                                        } else {
                                                            sharedBillRatioLastMonth = revenueByEmployee / revenueByOthers;

                                                            if (sharedBillRatioLastMonth == 0) {

                                                            } else {

                                                                var f = new Fraction(sharedBillRatioLastMonth.toFixed(2));

                                                                sharedBillRatioLastMonth = f.numerator + "/" + f.denominator;

                                                            }


                                                        }

                                                        Admin.update({ "_id": ObjectId(empId) }, { $set: { "avgBillValueLastMonth": avgBillValueLastMonth, "sharedBillRatioLastMonth": sharedBillRatioLastMonth, "avgServicePerBillLastMonth": avgServicePerBillLastMonth } }, function(err, updated) {
                                                            if (err) {
                                                                console.log(err);
                                                                cb();
                                                            }
                                                            if (updated) {
                                                                console.log("updated");
                                                                cb();
                                                            }
                                                        });

                                                    });
                                                } else {
                                                    cb();
                                                }
                                            }
                                        });
                                    } else {

                                        Admin.update({ "_id": ObjectId(empId) }, { $set: { "avgBillValueLastMonth": avgBillValueLastMonth, "sharedBillRatioLastMonth": sharedBillRatioLastMonth, "avgServicePerBillLastMonth": avgServicePerBillLastMonth } }, function(err, updated) {
                                            if (err) {
                                                console.log(err);
                                                cb();
                                            }
                                            if (updated) {
                                                console.log("updated");
                                                cb();
                                            }
                                        });

                                    }
                                }

                            });
                        } else {

                            Admin.update({ "_id": ObjectId(empId) }, { $set: { "avgBillValueLastMonth": avgBillValueLastMonth, "sharedBillRatioLastMonth": sharedBillRatioLastMonth, "avgServicePerBillLastMonth": avgServicePerBillLastMonth } }, function(err, updated) {
                                if (err) {
                                    console.log(err);
                                    cb();
                                }
                                if (updated) {
                                    console.log("updated");
                                    cb();
                                }
                            });

                        }
                    }
                });
            })
        });
    }

    updateLastMonthAverages();

});

router.get('/deleteSettlementReport', function(req, res) {
    console.log(req.query.period)
    SettlementReport.find({ period: req.query.period }, function(err, settlementReports) {
        async.each(settlementReports, function(sett, cb) {
            SettlementReport.findOne({ _id: sett._id }, function(err, settlementReport) {
                if (settlementReport) {
                    DisountOnPurchase.findOne({ parlorId: settlementReport.parlorId }, function(err, discount) {
                        if (discount) {
                            console.log("settlementReport.discountOnPurchase ", settlementReport.discountOnPurchase)
                            console.log(" discount.discountBucket", discount.discountBucket)
                            console.log(" discount.targetRevenue", discount.targetRevenue)
                            console.log(" settlementReport.totalRevenue", settlementReport.totalRevenue)
                            var discountOnPurchase = settlementReport.discountOnPurchase ? settlementReport.discountOnPurchase : 0;
                            var discountBucket = discount.discountBucket + discountOnPurchase;
                            var targetRevenue = discount.targetRevenue + settlementReport.totalRevenue;
                            DisountOnPurchase.update({ _id: discount._id }, { $set: { discountBucket: discountBucket, targetRevenue: targetRevenue } }, function(err, done) {
                                SettlementReport.remove({ _id: req.query.settlementId }, function(err, data) {
                                    Parlor.createSettlementReportv2(settlementReport.startDate, settlementReport.endDate, settlementReport.period, { _id: settlementReport.parlorId }, function(err, data) {
                                        cb();
                                    });
                                });
                            })
                        } else {
                            SettlementReport.remove({ _id: req.query.settlementId }, function(err, data) {
                                Parlor.createSettlementReportv2(settlementReport.startDate, settlementReport.endDate, settlementReport.period, { _id: settlementReport.parlorId }, function(err, data) {
                                    cb();
                                });
                            });
                        }
                    }).sort({ "$natural": -1 })



                } else {
                    res.json('Invalid');
                }
            });

        }, function(done) {


            res.json("done")

        })

    })


});


router.post("/searchReferrals", function(req, res) {

    var lat = req.body.lat;
    var long = req.body.long;
    var department = req.body.department;
    var salaryMin = req.body.salaryMin;
    var salaryMax = req.body.salaryMax;
    var gender = req.body.gender;
    var distance = req.body.distance;
    var experience = req.body.experience;

    var peopleToReturn = [];

    var query = {};

    if (department) {
        query.department = department;
    }
    if (salaryMin) {
        query.salaryMin = { $gte: parseInt(salaryMin) };
    }
    if (salaryMax) {
        query.salaryMax = { $lte: parseInt(salaryMax) };
    }
    if (gender) {
        query.gender = gender;
    }
    if (experience) {
        query.experience = experience;
    }

    console.log(query);

    EmployeeReferral.find(query, { createdAt: 0, updatedAt: 0, _v: 0 }, function(err, people) {

        console.log("people are");
        console.log(people);

        async.each(people, function(peo, cb) {

            var dist = HelperService.getDistanceBtwCordinates(lat, long, peo.latitude, peo.longitude);

            console.log("dist is " + dist);

            if (dist <= distance) {
                peopleToReturn.push(peo);
            } else {
                if (peo.area == 1) {
                    peopleToReturn.push(peo);
                }
            }

            cb();
        }, function() {

            res.json(peopleToReturn);

        })
    });

});


router.post('/uploadCompanies', function(req, res) {
    console.log("chalaaaaaaaaa")
    var exceltojson; //Initialization
    upload(req, res, function(err) {
        console.log(req.file);
        console.log("badhiyaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
        if (err) {
            console.log(err)
            res.json({ error_code: 1, err_desc: err });
            return;
        }
        /** Multer gives us file info in req.file object */
        if (!req.file) {
            console.log("gadbadddddd")
            res.json({ error_code: 1, err_desc: "No file passed" });
            return;
        }
        //start convert process
        /** Check the extension of the incoming file and
         *  use the appropriate module
         */
        if (req.file.originalname.split('.')[req.file.originalname.split('.').length - 1] === 'xlsx') {
            console.log("xlsxxxxxxxxxxxxxxxxxxxxx")
            exceltojson = xlsxtojson;

        } else {
            console.log("xlssssssssssssssssssss")
            exceltojson = xlstojson;

        }
        try {
            console.log("try crossed")
            exceltojson({
                input: req.file.path, //the same path where we uploaded our file
                output: null, //since we don't need output.json
                lowerCaseHeaders: true,
            }, function(err, result) {
                console.log("mai chal gyaa")
                if (err) {
                    console.log(err)
                    return res.json({ error_code: 1, err_desc: err, data: null });
                }
                console.log(result)
                var items = [];
                _.forEach(result, function(r) {

                    items.push({
                        name: r.name,
                        extension: r.extension
                    });
                });
                CorporateCompany.create(items, function(err, data) {
                    return res.json({ error_code: 1, err_desc: err, data: items });
                })
            });
        } catch (e) {

            res.json({ error_code: 1, err_desc: "Corupted excel file" });
        }
    });
});


router.post('/discountOnPurchase', function(req, res) {
    DisountOnPurchase.find({ parlorId: req.body.parlorId }, function(err, result) {
        if (err) {
            console.log(err);
            res.json(CreateObjService.response(true, err))
        } else {
            console.log(result)
            res.json(CreateObjService.response(false, result))

        }


    })

})

router.get('/discountOnPurchaseAllSalonMontly', function(req, res) {
    DisountOnPurchase.find({ month: req.query.month, year : req.query.year }).sort({parlorId : 1, createdAt : 1}).exec( function(err, result) {
        if (err) {
            console.log(err);
            res.json(CreateObjService.response(true, err))
        } else {
            console.log(result)
            res.json(CreateObjService.response(false, result))

        }

    })

})


router.post('/createCompanies', function(req, res) {

    CorporateCompany.create(CorporateCompany.createNewCompany(req.body), function(err, company) {
        if (err) {
            return res.json(CreateObjService.response(false, "Error"));
        } else {
            return res.json(CreateObjService.response(false, "created"));
        }
    })
});

router.post('/listEditCompanies', function(req, res) {
    if (req.body.id) {
        CorporateCompany.remove({ _id: req.body.id }, function(err, companies) {
            if (err) {
                return res.json(CreateObjService.response(false, "Error"));
            } else {
                return res.json(CreateObjService.response(false, "Deleted"));
            }
        })
    } else {
        CorporateCompany.find({}, function(err, companies) {
            if (err) {
                return res.json(CreateObjService.response(false, "Error"));
            } else {
                return res.json(CreateObjService.response(false, companies));
            }
        })
    }
});

//
// router.post('/actual',function(req,res){
//
// Parlor.find({active : true}, {name : 1}, function(err, parlors){
//
// _.forEach(parlors, function(parlor){
// SettlementReport.find({parlorId : parlor.id , period : {$in : [58, 59, 60, 61]}}, {actualCommission : 1, actualCommissionTillDate : 1}, function(err, s){
//   if(s.length == 4){
//     var total = s[0].actualCommission;
//     var total2 = total + s[1].actualCommission;
//     var total3 =total2 + s[2].actualCommission;
//     var total4 = total3 + s[3].actualCommission;
//       SettlementReport.update({parlorId : parlor.id , period  : 58}, {actualCommissionTillDate : total}, function(err, d){
//           console.log("done1");
//       });
//       SettlementReport.update({parlorId : parlor.id , period  : 59}, {actualCommissionTillDate : total2}, function(err, d){
//           console.log("done1");
//       });
//       SettlementReport.update({parlorId : parlor.id , period  : 60}, {actualCommissionTillDate : total3}, function(err, d){
//           console.log("done1");
//       });
//       SettlementReport.update({parlorId : parlor.id , period  : 61}, {actualCommissionTillDate : total4}, function(err, d){
//           console.log("done1");
//       });
//
//
//   }else{
//     console.log("not found - " + parlor.name);
//   }
// });
// });
// })
//
//
//
// })



router.post('/dopPaid', function(req, res) {

    console.log(req.body)

    DisountOnPurchase.update({ _id: req.body.id }, {
        $set: {
            paid: req.body.paid
        }
    }, function(err, paid) {
        if (err) {
            console.log(err)
            res.json(CreateObjService.response(true, err))

        } else {
            console.log("Done")
            res.json(CreateObjService.response(false, paid))

        }

    })



})

router.post('/drawPaid', function(req, res) {

    LuckyDrawDynamic.update({ _id: req.body.id }, {
        $set: {
            paid: req.body.paid
        }
    }, function(err, paid) {
        if (err) res.json(CreateObjService.response(true, err))
        else
            res.json(CreateObjService.response(false, paid))
    })



})

router.get("/getSellers", function(req, res) {
    Sellers.find({}, { name: 1 }, function(err, sellers) {
        if (err) {
            return res.json(CreateObjService.response(true, "Something went wrong."));
        } else {
            return res.json(CreateObjService.response(false, sellers));
        }
    });
})

router.post("/fetchReorders", function(req, res) {
    var query = {}
    if (req.body.sellerIds.length > 0) {
        var sellerIdsToPass = [];
        _.forEach(req.body.sellerIds, function(sId) {
            sellerIdsToPass.push(ObjectId(sId));
        });

        query = { sellerId: { $in: sellerIdsToPass }, receivedAt: { $gte: new Date(req.body.date.startDate), $lte: new Date(req.body.date.endDate) } }

    } else {
        query = { parlorId: req.body.parlorId, receivedAt: { $gte: new Date(req.body.date.startDate), $lte: new Date(req.body.date.endDate) } }
    }
    console.log(query)


    InventoryItem.find({}, { sellingPrice: 1, tax: 1 }, function(err, itemsPrices) {
console.log("itemsPrices" , itemsPrices.length)
        ReOrder.find(query, function(err, reorders) {

            var data = [];

            if (err) {
                return res.json(CreateObjService.response(true, "Something went wrong."));
            } else {

                async.each(reorders, function(r, cb) {
                    console.log("rrrrrrrrrrrr" ,r._id)
                    Parlor.findOne({ "_id": ObjectId(r.parlorId) }, { "name": 1, "_id": 0 }, function(err, p) {
                        if (err) {
                            data.push(r);

                            console.log("coming here");

                            cb();
                        } else {
                            var d = {};
                            var itemsWithPrice = [];
                            // console.log()
                            r.items.forEach(function(s) {
                                var ss = s.itemId
                                var it = _.find(itemsPrices, {
                                    _id: ss

                                });
                                console.log("sssssssssss" ,s , ss)
                                console.log("ittttttttttttttttttt" ,it)
                                s.sellingPrice = it.sellingPrice;
                                itemsWithPrice.push(s);

                            })

                            d._id = r._id,
                                d.createdAt = r.createdAt
                            d.updatedAt = r.updatedAt
                            d.receivedAt = r.receivedAt
                            d.sellerId = r.sellerId
                            d.name = r.name
                            d.parlorId = r.parlorId
                            d.parlorName = p.name;
                            d.emailId = r.emailId
                            d.status = r.status
                            d.quotationNumber = r.quotationNumber
                            d.poNumber = r.poNumber
                            d.orderAmount = r.orderAmount
                            d.newOrderAmount = r.newOrderAmount
                            d.items = itemsWithPrice
                            d.imageUrl = r.imageUrl
                            d.ApprovalStatus = r.ApprovalStatus
                            d.billUploadDate = (r.billUploadDate == undefined) ? "N/A" : r.billUploadDate;

                            data.push(d);
                            cb();
                        }
                    })
                }, function() {
                    return res.json(CreateObjService.response(false, data))
                });

            }
        })
    })


});
router.post('/approveOrderBill', function(req, res) {

    var id = req.body.id;
    var approve = req.body.approve;
    ReOrder.update({ _id: id }, { ApprovalStatus: approve }, function(err, done) {
        if (err) {
            return res.json(CreateObjService.response(true, "Something went wrong."));
        } else {
            return res.json(CreateObjService.response(false, done));

        }
    })



})

// router.post("/getSettlementStatus", function(req, res){

// console.log("being called");

var sendSettlementMsg = function() {
    SettlementReport.find({}, { period: 1, _id: 0 }, function(err, per) {

        var period = per[0].period;

        console.log("period is " + period);

        SettlementReport.count({ "period": period }, function(err, periodCount) {
            if (err) {
                console.log(err);
            } else {

                var settlementSentCount = periodCount;

                Parlor.count({ "active": true }, function(err, activeParlorCount) {

                    if (err) {
                        console.log(err);
                    } else {
                        var activeParlorCount = activeParlorCount;

                        var message = "Settlement sent to " + settlementSentCount + " active parlors " + activeParlorCount;

                        var phoneNumbers = [8527372926];

                        var url = ParlorService.getSMSUrl('BEUSLN', message, phoneNumbers, "T");

                        Appointment.sendSMS(url, function(e) {
                            console.log(e);
                            console.log("Message Sent");

                        })

                    }

                });


            }

        });

    }).sort({ $natural: -1 }).limit(1);
}

// sendSettlementMsg();

// });



router.post('/paySettlementAmount', function(req, res) {

    var paid = req.body.paid;
    var id = req.body.id;
    console.log(paid)

    if (paid) {

        console.log("I am true")
        SettlementReport.findOne({ _id: id }, {
            previousDue: 1,
            paidToSalon: 1,
            balance: 1,
            netPayable: 1
        }, function(err, set1) {

            if (err) {
                res.json(CreateObjService.response(true, err))

            } else {

                var paidToSalon = set1.netPayable + set1.previousDue
                var balance = set1.netPayable + set1.previousDue - paidToSalon

                SettlementReport.update({ _id: id }, { $set: { paidToSalon: paidToSalon, balance: 0, paid: true, paidDate: new Date() } }, function(err, done) {

                    if (err) {
                        res.json(CreateObjService.response(true, err))
                    } else {
                        res.json(CreateObjService.response(false, done))

                    }
                })

            }

        })



    } else {
        console.log("I am false")

        SettlementReport.findOne({ _id: id }, {
            previousDue: 1,
            paidToSalon: 1,
            balance: 1,
            netPayable: 1
        }, function(err, set1) {
            console.log(set1)
            if (err) {
                res.json(CreateObjService.response(true, err))

            } else {
                var paidToSalon = 0
                var balance = set1.netPayable + set1.previousDue - paidToSalon
                SettlementReport.update({ _id: id }, { $set: { paidToSalon: paidToSalon, balance: balance, paid: false, paidDate: null } }, function(err, done) {

                    if (err) {
                        res.json(CreateObjService.response(true, err))
                    } else {
                        res.json(CreateObjService.response(false, done))

                    }

                })



            }

        })

    }




})


router.get('/getMyData', function(req, res) {


    LuckyDrawDynamic.find({ parlorId: ObjectId("58ded8be57a5140f302bb555") }, function(err, result) {

        var data = _.map(result, function(r) {

            return {
                Appointment_amount: r.billAmount,
                employeeName: r.employeeName,
                Category: r.reason,

                client_name: r.clientName,


            }
        })
        res.json(data)


    })
})






router.post('/monthlySettlement', function(req, res) {


    var date = new Date(req.body.date)
    var parlorId = req.body.parlorId;
    var startDate = new Date(date.getFullYear(), parseInt(date.getMonth()), 1);
    var endDate = new Date(date.getFullYear(), parseInt(date.getMonth() + 1), 1);
    console.log(startDate)
    console.log(endDate)
    console.log(parlorId)

    var query = [

        { $match: { "parlorId": ObjectId(parlorId), startDate: { $gte: startDate, $lt: endDate } } },
        { $sort: { period: 1 } },
        {
            $group: {
                _id: null,
                serviceRevenue: { $sum: "$serviceRevenue" },
                netPayable: { $sum: "$netPayable" },
                productRevenue: { $sum: "$productRevenue" },
                collectedByAffiliates: { $sum: "$collectedByAffiliates" },
                collectedByApp: { $sum: "$collectedByApp" },
                totalCollectionByParlor: { $sum: "$totalCollectionByParlor" },
                collectedByLoyalityPoints: { $sum: "$collectedByLoyalityPoints" },
                managementFee: { $last: "$amountCollectedTillDate" },
                "refundOnErp": { $sum: "$refundOnErp" },
                "refundFirstAppDigital": { $sum: "$refundFirstAppDigital" },
                "refundAppDigitalCash": { $sum: "$refundAppDigitalCash" },
                "refundAppDigitalOnline": { $sum: "$refundAppDigitalOnline" },
            }
        }
    ];
    SettlementReport.aggregate(query, function(err, sett) {



        if (err) {


            res.json(CreateObjService.response(true, err))


        } else {



            res.json(CreateObjService.response(false, sett))



        }



    })
})



router.get('/adjust', function(req, res) {

    LuckyDrawDynamic.find({ employeeId: null }, { employeeName: 1, parlorId: 1 }, function(err, data) {

        async.each(data, function(d, cb) {

            Admin.findOne({ firstName: d.employeeName, parlorId: d.parlorId }, { _id: 1 }, function(err, emp) {
                if (emp) {
                    LuckyDrawDynamic.update({ "_id": d._id }, { $set: { "employeeId": emp._id } }, function(err, updated) {
                        if (err) {
                            cb();
                        } else {
                            console.log("updated");
                            cb();
                        }
                    })

                } else {
                    cb();

                }

            })

        }, function(done) {
            res.json(data)

        })




    })


})


router.get('/getD', function(req, res) {

    Parlor.find({}, { services: 0, topServiceBills: 0, topBills: 0 }, function(err, parlors) {
        console.log(err)
        console.log(parlors)
        res.json(parlors);
    })

});


router.post('/editBloggerAppointment', function(req, res) {
    if (req.body.edit) {
        Appointment.find({ _id: req.body.apptId, status: { $in: [1, 4] } }, { status: 1, appointmentStartTime: 1, payableAmount: 1, subtotal: 1, allPaymentMethods: 1, services: 1, loyalityOffer: 1, loyalityPoints: 1, otp: 1 }, function(err, appointment) {
            if (appointment) {
                console.log("appointment", appointment)
                console.log("appointment", appointment[0].subtotal)
                var updateObj = {
                    payableAmount: 0,
                    allPaymentMethods: [],
                    loyalityOffer: 0,
                    loyalityPoints: appointment[0].subtotal,
                    services: []
                };
                _.forEach(appointment[0].services, function(appt) {
                    // appt.discount = appt.price,
                    appt.loyalityPoints = appt.price

                    updateObj.services.push(appt)
                })
                Appointment.update({ _id: req.body.apptId, status: appointment[0].status }, updateObj, function(err, update) {
                    if (update) {
                        res.json(CreateObjService.response(false, "Successfully Updated"))
                    }
                })

            }
        })
    } else {
        Appointment.find({ "client.phoneNumber": req.body.phoneNumber, status: { $in: [1, 4] }, appointmentStartTime: { $gte: HelperService.getDayStart(req.body.date), $lt: HelperService.getDayEnd(req.body.date) } }, { subtotal: 1, "services.name": 1, appointmentStartTime: 1, otp: 1, client: 1, parlorName: 1, parlorAddress: 1 }, function(err, appointment) {
            var data = {};
            if (appointment) {
                data.apptId = appointment[0].id,
                    data.appointmentStartTime = appointment[0].appointmentStartTime.toDateString(),
                    data.parlorName = appointment[0].parlorName + "-" + appointment[0].parlorAddress,
                    data.otp = appointment[0].otp,
                    data.clientName = appointment[0].client.name,
                    data.subtotal = appointment[0].subtotal,
                    data.services = _.map(appointment[0].services, function(ser) { return ser.name })
                res.json(CreateObjService.response(false, data))
            } else
                res.json(CreateObjService.response(true, "Something is wrong"))
        })
    }
});

router.post('/getBloggerAppointments', function(req, res) {
    Appointment.find({ status: 3, payableAmount: 0, allPaymentMethods: [], loyalityOffer: 0, "services.discount": 0, "services.loyalityPoints": { $gt: 0 } }, { client: 1, parlorName: 1, parlorAddress: 1, subtotal: 1, "services.name": 1 }).sort({ $natural: -1 }).exec(function(err, appts) {
        res.json(CreateObjService.response(false, appts))
    })
});


router.post('/changeFreeBarToZero', function(req, res) {
    User.update({ phoneNumber: req.body.phoneNumber }, { $set: { freeHairCutBar: 0 } }, function(err, update) {
        if (err) {
            return res.json(CreateObjService.response(true, "Something is Wrong"));
        } else {
            return res.json(CreateObjService.response(false, "Successfully Updated"));
        }
    })
});


router.post('/changeFreeBarToHundred', function(req, res) {
    User.update({ phoneNumber: req.body.phoneNumber }, { $set: { freeHairCutBar: 100 } }, function(err, update) {
        if (err) {
            return res.json(CreateObjService.response(true, "Something is Wrong "));
        } else {
            return res.json(CreateObjService.response(false, "Successfully Updated"));
        }
    })
})

router.post('/appCashDigitalPaymentAppointments', function(req, res) {
    var query = { $match: { status: 3, appointmentStartTime: { $gte: HelperService.getDayStart(req.body.startDate), $lt: HelperService.getDayEnd(req.body.endDate) }, appointmentType: 3, appBooking: 2 } };
    if (req.body.paymentMethod == 5) {
        query.paymentMethod = { $in: [5, 10] }
    }
    if (req.body.paymentMethod != 5) {
        query.paymentMethod = { $nin: [5, 10] }
    }
    if (req.body.minRange) {
        query.loyalityPoints = { $gte: req.body.minRange, $lt: req.body.maxRange }

    }

    Appointment.aggregate([query,
        {
            $project: {
                totalAmount: { $add: ["$subtotal", "$tax"] },
                date: { '$dateToString': { format: '%m/%d/%Y', date: '$appointmentStartTime' } },
                freePointsUsed: "$loyalityPoints",
                paymentMethod: { $cond: { if: 5, then: "Be U App", else: "Be U Cash" } },
                freePointsRedemeed: { $subtract: ["$loyalityPoints", "$loyalityOffer"] },
                freeServicePoints: "$loyalityOffer",
                allPaymentMethods: 1,
                clientName: "$client.name",
                parlorName: 1
            }
        }
    ]).exec(function(err, agg) {
        if (err) {
            return res.json(CreateObjService.response(true, "Something is Wrong "));
        } else {
            return res.json(CreateObjService.response(false, agg));
        }
    })
});

router.get('/getParlorVar', function(req, res) {
console.log(req.query)
    if(req.query.reportType == '1'){
        Parlor.find({active: true, parlorType : {$ne : 4}}, { name: 1, address2: 1, avgRoyalityAmount: 1, parlorType: 1, discountEndTime: 1,parlorLiveDate:1, appDistanceRevenueFirstTime:1,thresholdAmount1:1, thresholdAmount1Commission:1,thresholdAmount2:1,tax:1,appDistanceRevenue:1 }, function(err, parlors) {
            console.log(parlors)
            res.json(parlors)
        })
    }else if(req.query.reportType == '2' || req.query.reportType == '3'){
            
        Parlor.find({active : true}, {geoLocation:1, name: 1, address2: 1, avgRoyalityAmount: 1, parlorType: 1, discountEndTime: 1,parlorLiveDate:1, appDistanceRevenueFirstTime:1,thresholdAmount1:1, thresholdAmount1Commission:1,thresholdAmount2:1,tax:1,appDistanceRevenue:1 }, function(err, parlors) {
            var d = [];
            async.each(parlors, function(parl, call) {

                if(req.query.reportType == '2'){
                    var today = new Date();
                    var monthStart = HelperService.getCurrentMonthStart(today);
                    var monthEnd = HelperService.getCustomMonthEndDate(today.getFullYear(), today.getMonth()+1);
                    var avgRoyalityAmount = parl.avgRoyalityAmount;
                    var totalRoyaltyPaid = parl.avgRoyalityAmount*3;
                    
                }else if(req.query.reportType == '3'){

                    var monthStart = HelperService.getLastThreeMonthStart();
                    // var monthStart = HelperService.getLastThreeMonthStartFromDate(parl.discountEndTime);
                    // var monthEnd = parl.discountEndTime;
                    var monthEnd = new Date();
                    var daysDifference = HelperService.getDaysBetweenTwoDates(monthStart , new Date())
                    var avgRoyalityAmount = ((parl.avgRoyalityAmount/30 ) * daysDifference).toFixed(2);
                    var totalRoyaltyPaid = parl.avgRoyalityAmount*3;

                }
                    var daysLeft = HelperService.getDaysBetweenTwoDates(new Date() , monthEnd);

                Appointment.aggregate([{ $match: { parlorId: ObjectId(parl._id), status: 3, appointmentStartTime: { $gte: HelperService.getDayStart(monthStart), $lte : HelperService.getDayEnd(monthEnd)} } },
                    { $group: { _id: '$parlorId', totalRevenue: { $sum: '$serviceRevenue' } } }
                ], function(err, appts) {
                    console.log(appts.length)
                    Appointment.find({ parlorId: ObjectId(parl._id), status: 3, appointmentStartTime: { $gte: HelperService.getDayStart(monthStart), $lte : HelperService.getDayEnd(monthEnd) } }, 
                        {productRevenue:1, appointmentType: 1,bookingMethod:1, latitude: 1, longitude: 1, serviceRevenue: 1, mode: 1, appBooking: 1, appointmentStartTime: 1, client: 1, couponCode: 1 }, function(err, distanceAppts) {
                            console.log("appts length",distanceAppts.length)
                        if (appts && appts.length > 0) {

                            var distanceRevenueFirstTime = 0;
                                
                            var arr = {
                                _id : parl._id,
                            name : parl.name,
                            address2 : parl.address2,
                            avgRoyalityAmount : avgRoyalityAmount,
                            totalRoyaltyPaid : totalRoyaltyPaid,
                            parlorType : parl.parlorType,
                            parlorLiveDate : parl.parlorLiveDate,
                            tax : parl.tax,
                            discountEndTime : parl.discountEndTime,
                            thresholdAmount1 : parl.thresholdAmount1,
                            thresholdAmount1Commission : parl.thresholdAmount1Commission,
                            thresholdAmount2 : parl.thresholdAmount2,
                            appDistanceRevenue : parl.appDistanceRevenue,
                            startDate : HelperService.getDayStart(monthStart),
                            endDate : HelperService.getDayEnd(monthEnd),
                            appDistanceRevenueFirstTime : 0,
                            daysDifference : daysDifference,
                            daysLeft : daysLeft,
                            };

                            if (distanceAppts && distanceAppts.length > 0) {

                                _.forEach(distanceAppts, function(a) {
                                    if(a.latitude == null)a.latitude = 0;
                                    if(a.longitude == null)a.longitude = 0;

                                    if ( a.appointmentType == 3 || a.couponCode || a.mode==5 || a.mode == 7 || a.mode == 9) {

                                        var distance = HelperService.getDistanceBtwCordinates1(parl.geoLocation[1], parl.geoLocation[0], a.latitude, a.longitude)
                                        if ((distance >= 0.05 && a.appointmentType == 3) || a.mode == 5 || a.couponCode || a.mode == 7 || a.mode == 9){
                                            
                                            if (parl.parlorType != 4 && a.client.noOfAppointments == 0 || a.couponCode) {
                                                distanceRevenueFirstTime += a.serviceRevenue
                                            } else if(parl.parlorType == 4){
                                                distanceRevenueFirstTime += a.serviceRevenue;
                                            }
                                        } 
                                    }
                                });
                                arr.appDistanceRevenueFirstTime = distanceRevenueFirstTime;
                                arr.avgPerDayRevenue = ((totalRoyaltyPaid - arr.appDistanceRevenueFirstTime)).toFixed(0);
                            }
                            console.log(arr.name)
                            d.push(arr)
                            call();
                        } else
                            call();
                    })
                })

            }, function allTaskCompleted() {
                 d.sort(function(a, b){
                    var keyA = a.daysLeft,
                        keyB = b.daysLeft;
                    if(keyA < keyB) return 1;
                    if(keyA > keyB) return -1;
                    return 0;
                });
                res.json(d)
            });
        });
    }
})


var giveUniqueCount = function(c) {
    var uniqueArray = [];
    for (var i = 0; i < c.length; i++) {
        if (uniqueArray.indexOf(c[i]) > -1) {} else {
            uniqueArray.push(c[i]);
        }
    }
    return uniqueArray.length;
}


router.post('/cohortMonthlyReport', function(req, res) {
    var d = [];
    var parlorId = req.body.parlorId;
    // Parlor.find({active:true, "_id" : parlorId}, {_id:1} ,function(err,parlors){
    Parlor.find({ active: true }, { _id: 1 }, function(err, parlors) {
        console.log(parlors)
        var parlor = []
        _.forEach(parlors, function(par) {
            parlor.push(ObjectId(par._id))
        })
        Appointment.aggregate([{
                $match: {
                    status: 3,
                    "client.noOfAppointments": 0,
                    // "services.discountMedium" : "frequency",
                    // "services.dealPriceUsed" : true,
                    // payableAmount:{$gt:0},

                    parlorId: { $in: parlor }
                }
            },
            {
                $project: {
                    payableAmount: 1,
                    "client.id": 1,
                    month: { $month: "$appointmentStartTime" },
                    servicesLength: { $size: "$services" },
                }
            },
            {
                $group: {
                    _id: {
                        month: "$month"
                    },
                    month: { $first: '$month' },
                    clientId: { $push: "$client.id" },
                    count: { $sum: 1 },
                    payableAmount: { $sum: "$payableAmount" },
                    servicesLength: { $sum: "$servicesLength" },
                }
            },
            {
                $sort: {
                    month: 1
                }
            }
        ]).exec(function(err, agg) {
            async.each(agg, function(a, cb) {
                console.log(a.month)
                var arr = {
                    month: a.month,
                    uniqueClients: a.count,
                    uniqueRevenue: a.payableAmount,
                    servicesLength: a.servicesLength,
                    repeatedClients: []
                        // cl :[]
                };

                console.log("end", new Date(2017, a.month, 1))
                Appointment.aggregate([{
                        $match: {
                            status: 3,
                            "client.id": { $in: a.clientId },
                            // "client.noOfAppointments": 0,
                            appointmentStartTime: { $gte: new Date(2017, a.month, 1), $lt: new Date(2017, 11, 1, 23, 59, 59) },
                            payableAmount: { $gt: 0 },
                            parlorId: { $in: parlor }
                        }
                    },
                    {
                        $project: {
                            payableAmount: 1,
                            clientId: "$client.id",
                            month: { $month: "$appointmentStartTime" },
                            services: { $size: "$services" },
                        }
                    },
                    {
                        $group: {
                            _id: { month: "$month", clientId: "$clientId" },
                            month: { $first: '$month' },
                            count: { $sum: 1 },
                            clientId: { $push: "$clientId" },
                            payableAmount: { $sum: "$payableAmount" },
                            services: { $sum: "$services" },
                        }
                    },
                    {
                        $group: {
                            _id: "$_id.month",
                            month: { $first: '$month' },
                            count: { $sum: 1 },
                            clientId: { $push: "$clientId" },
                            payableAmount: { $sum: "$payableAmount" },
                            services: { $sum: "$services" }
                        }
                    },
                    { $sort: { month: 1 } }
                ]).exec(function(err, agg2) {
                    // console.log(err)
                    // var client = a.clientId;
                    // var filteredArray = client.filter(function(item, pos){
                    //   return client.indexOf(item)== pos;
                    // });

                    // console.log(giveUniqueCount(client))
                    //  console.log("start",HelperService.getFirstDateOfMonth(2017,(a.month+1)))

                    arr.repeatedClients.push(agg2)


                    cb()

                })
                d.push(arr)
            }, function allTaskCompleted() {

                return res.json(d)
            })
        })
    })
});


router.post('/googleReviewFreebies', function(req, res) {
    var updateObj = {};
    var now_date = new Date();
    now_date.setMonth(now_date.getMonth() + 1)
    console.log(req.body)
    if (req.body.amount > 0) {
        var newLoyalityPoints = req.body.loyalityPoints + req.body.amount;
        var creditObj = { reason: "Google Review", source: null, balance: newLoyalityPoints, amount: req.body.amount, createdAt: new Date() };
        updateObj = { loyalityPoints: newLoyalityPoints, $push: { creditsHistory: creditObj } }
    }
    if (req.body.freeService == "true") {
        var freeServiceObj = [];
        freeServiceObj.push({
            "brandId": (req.body.gender == "F") ? "594b99fcb2c790205b8b7d93" : "",
            "source": "download",
            "description": (req.body.gender == "F") ? "Full Arms + Full Legs + Underarms" : "Includes blowdry, shampoo and conditioner",
            "priceId": (req.body.gender == "F") ? 502 : 52,
            "discount": (req.body.gender == "F") ? 300 : 150,
            "name": (req.body.gender == "F") ? "Classic Express Wax" : "Male Hair Cut",
            "price": (req.body.gender == "F") ? 600 : 300,
            "noOfService": 1,
            "parlorId": null,
            "dealId": null,
            "code": (req.body.gender == "F") ? 502 : 52,
            "serviceId": (req.body.gender == "F") ? ObjectId("59520f3b64cd9509caa273ec") : ObjectId("58707eda0901cc46c44af2eb"),
            "categoryId": (req.body.gender == "F") ? ObjectId("58707ed90901cc46c44af279") : ObjectId("58707ed90901cc46c44af27b"),
            "createdAt": new Date(),
            "expires_at": now_date
        });
        console.log(freeServiceObj)
        updateObj = { $push: { freeServices: { $each: freeServiceObj } } }
    }
    User.update({ phoneNumber: req.body.phoneNumber }, updateObj, function(err, update) {
        console.log(err)
        if (update) {
            return res.json("Updated Successfully");
        } else {

            return res.json("There is some error");
        }
    })
});

router.post('/makeCorporateUser', function(req, res) {
    User.findOne({ phoneNumber: req.body.phoneNumber }, { gender: 1 }, function(err, user) {
        console.log(user != null)
        if (user) {
            // var freeService = [];
            var couponCodeHistory = [];

            for (var i = 1; i < 4; i++) {
                var now_date = new Date();
                // now_date.setMonth(now_date.getMonth() + i);
                now_date.setMonth(now_date.getMonth() + 6);
                // freeService.push({
                //     createdAt: new Date(),
                //     categoryId: "58707ed90901cc46c44af27b",
                //     serviceId: user.gender == "F" ? "58707eda0901cc46c44af417" : "58707eda0901cc46c44af2eb",
                //     code: user.gender == "F" ? 202 : 52,
                //     dealId: null,
                //     parlorId: null,
                //     noOfService: 1,
                //     price: user.gender == "F" ? 600 : 300,
                //     name: user.gender == "F" ? "Female Hair Cut" : "Male Hair Cut",
                //     discount: user.gender == "F" ? 300 : 150,
                //     source: "corporate",
                //     expires_at: now_date,
                //     enableUpgrade: true,
                //     availed: i == 1 ? true : false,
                //     priceId: user.gender == "F" ? 202 : 52
                // })
                couponCodeHistory.push({
                    active: true,
                    createdAt: new Date(),
                    code: "CORPID15",
                    couponType: 3,
                    expires_at: now_date
                })

            }
            User.update({ phoneNumber: req.body.phoneNumber, isCorporateUser: false }, { corporateReferralCount: 0, isCorporateUser: true, freeHairCutBarChangeDate: new Date(), corporateEmailId: req.body.corporateEmailId, freeHairCutBar: 0, $push: { couponCodeHistory: { $each: couponCodeHistory } } }, function(e, f) {
                return res.json('Account Verified and Free Services Added.');
            });
        } else {
            return res.json('User Already Registered.');
        }
    })
});

router.post('/freeBieCouponCodes', function(req, res) {
    FreebiesOffer.findOne({ code: req.body.couponCode }, function(err, coupon) {
        if (coupon) {
            return res.json(coupon);
        } else {
            return res.json("Coupon does not exist");
        }
    })
})



router.get('/bhasad', function(req, res) {

    Parlor.find({}, { refundEffectiveDate: 1, parlorLiveDate: 1, discountEndTime: 1 }, function(err, data) {
        res.json(data);


    })

})



router.post("/fetchParlorReviews", function(req, res) {
    var parlorId = req.body.parlorId;

    Appointment.aggregate([
        { $match: { "parlorId": ObjectId(parlorId), "review.rating": { $exists: true } } },
        { $project: { review: 1 } }
    ], function(err, reviews) {
        if (err) {
            res.json(CreateObjService.response(true, "Server Error"));
        } else {
            res.json(CreateObjService.response(false, reviews));
        }
    })
});

router.post("/updateFeaturedRatings", function(req, res) {

    var appointments = req.body.appointments;
    async.each(appointments, function(a, cb) {

        Appointment.update({ "_id": a._id }, { "$set": { "review.isFeatured": a.isFeatured } }, function(err, updated) {
            if (err) {
                cb();
            } else {
                cb();
            }
        });

    }, function() {
        res.json(CreateObjService.response(false, "Updated Successfully"));
    });

});

router.post("/getFeaturedReviews", function(req, res) {

    var parlorId = req.body.parlorId;
    Appointment.find({ "parlorId": ObjectId(parlorId), "review.isFeatured": true }, function(err, reviews) {
        if (err) {
            res.json(CreateObjService.response(true, "Server Error"));
        } else {
            res.json(CreateObjService.response(false, reviews));
        }
    })

});

router.post('/newClientreport', function(req, res) {

    console.log(req.body)
    var d = [];
    Parlor.find({}, { _id: 1 }, function(err, parlors) {
        var parl = []
        _.forEach(parlors, function(p) {
            parl.push(ObjectId(p._id));
        });
        Appointment.aggregate([{
                $match: {
                    status: 3,
                    appBooking: 2,
                    appointmentType: 3,
                    parlorId: { $in: parl }
                }
            },
            {
                $project: {
                    clientId: "$client.id",
                    apptId: "$_id",
                    appointmentStartTime: 1,
                    parlorId: 1,
                    parlorName: 1,
                    parlorAddress2: 1,
                    serviceRevenue: 1
                }
            },
            { $sort: { appointmentStartTime: -1 } },
            {
                $group: {
                    _id: {
                        clientId: "$clientId"
                    },
                    parlorId: { $first: "$parlorId" },
                    parlorName: { $first: "$parlorName" },
                    appointmentStartTime: { $first: "$appointmentStartTime" },
                    parlorAddress2: { $first: "$parlorAddress2" },
                    serviceRevenue: { $first: "$serviceRevenue" }

                }
            },
            {
                $match: {
                    appointmentStartTime: { $gte: HelperService.getDayStart(req.body.startDate), $lt: HelperService.getDayEnd(req.body.endDate) }
                }
            },
            {
                $group: {
                    _id: { parlorId: "$parlorId" },
                    count: { $sum: 1 },
                    parlorName: { $first: "$parlorName" },
                    parlorAddress2: { $first: "$parlorAddress2" },
                    serviceRevenue: { $sum: "$serviceRevenue" }
                }
            }
        ], function(err, agg) {
            async.each(agg, function(a, cb) {
                Appointment.aggregate([{
                        $match: {
                            status: 3,
                            parlorId: a._id.parlorId,
                            appointmentStartTime: { $gte: HelperService.getDayStart(req.body.startDate), $lt: HelperService.getDayEnd(req.body.endDate) }
                        }
                    },
                    { $project: { totalRevenue: { $add: ["$productRevenue", "$serviceRevenue"] }, parlorId: 1 } },
                    { $group: { _id: { parlorId: "$parlorId" }, totalRevenue: { $sum: "$totalRevenue" }, count: { $sum: 1 } } }
                ], function(err, agg2) {

                    a.totalSalonRevenue = agg2[0].totalRevenue;
                    a.totalSalonCustomers = agg2[0].count;

                    d.push(a);

                    cb();

                })

            }, function allTaskCompleted() {
                res.json(d)
            })

        })
    })
});



router.post('/couponCodeSms', function(req, res) {

    var d = [];
    var date = new Date();
    var activeParlors = [],
        inactiveParlors = [],
        query = {},
        cc = "";
    console.log("ayya")
    Parlor.find({ active: true }, { _id: 1 }, function(err, parlor) {

        Parlor.find({ active: false }, { _id: 1 }, function(err, parl) {

            _.forEach(parl, function(pa) { inactiveParlors.push(pa._id) })
            _.forEach(parlor, function(p) { activeParlors.push(p._id) })

            if (req.body.appActivity == "apptThreeMonthsMale") {
                query = { gender: "M", $and: [{ "parlors.parlorId": { $nin: inactiveParlors } }, { "parlors.parlorId": { $in: activeParlors } }, { "parlors.createdAt": { $lte: HelperService.getLastMonthStartDate(date, 90) } }] };
                cc = "OC"
            }
            if (req.body.appActivity == "apptThreeMonthsFemale") {
                query = { gender: "F", $and: [{ "parlors.parlorId": { $nin: inactiveParlors } }, { "parlors.parlorId": { $in: activeParlors } }, { "parlors.createdAt": { $lte: HelperService.getLastMonthStartDate(date, 90) } }] };

                // query = {gender :"F", "parlors.createdAt": { $lte: HelperService.getLastMonthStartDate(date, 90) } };
                cc = "OC"
            }
            if (req.body.appActivity == "inactiveMale") {
                query = { gender: "M", $and: [{ "parlors.parlorId": { $in: inactiveParlors } }, { "parlors.parlorId": { $nin: activeParlors } }, { "parlors.createdAt": { $lte: HelperService.getLastMonthStartDate(date, 90) } }] };
                cc = "IC"
            }
            if (req.body.appActivity == "inactiveFemale") {
                query = { gender: "F", $and: [{ "parlors.parlorId": { $in: inactiveParlors } }, { "parlors.parlorId": { $nin: activeParlors } }, { "parlors.createdAt": { $lte: HelperService.getLastMonthStartDate(date, 90) } }] };
                cc = "IC"
            } else {
                query
            }
            console.log(query)
            User.find(query, { firstName: 1, phoneNumber: 1 }, function(err, users) {
                console.log(users.length)
                async.each(users, function(u, cb) {

                    FreebiesOffer.findOne({ userId: u._id, active: true }, function(err, coupon) {
                        var couponCode = "";
                        if (coupon) {
                            couponCode = coupon.code
                            var now_date = new Date();
                            now_date.setMonth(now_date.getMonth() + 6);

                            var couponCodeHistoryObj = [];

                            couponCodeHistoryObj.push({
                                active: true,
                                createdAt: coupon.createdAt,
                                code: coupon.code,
                                couponType: 4,
                                expires_at: now_date,
                            })

                            User.update({ _id: u._id }, { $push: { couponCodeHistory: { $each: couponCodeHistoryObj } } }, function(err, userUpdated) {
                                console.log(userUpdated)
                                    // var usermessage ="Male Haircut@140, Shaving@80, Classic Facial@700. Use Coupon Code "+couponCode+" For Extra 15% Off On App. http://onelink.to/bf45qf Code Valid Till 6 Jan. "
                                var usermessage = "Smoothening@4000, Keratin@3500, Highlights@2500 and Global Color@2300 ANY LENGTH. Use Code " + couponCode + " For Extra 15% Off http://onelink.to/bf45qf Code Valid 6 Jan";
                                // console.log(usermessage)
                                var param = usermessage.replace(/&/g, "%26");
                                var enc = encodeURI(param)
                                var request = require("request");
                                var url = "http://www.myvaluefirst.com/smpp/sendsms?username=%20shailendrabeu&password=%20shailn567&to=" + u.phoneNumber + "&from=BEUSLN&text=" + enc + "";
                                console.log("url", url)
                                request({
                                    // agent:false,
                                    url: url,
                                    json: true
                                }, function(error, response, body) {
                                    console.log(error);
                                    if (!error) {
                                        d.push(response.body)


                                    } else {
                                        console.log(response.body)

                                    }
                                })
                                cb();
                            });
                        } else {
                            cb();
                        }
                    })

                }, function allTaskCompleted() {
                    return res.json(d.length);
                })

            })
        })
    })
});

router.post('/changeReceivedDate', function(req, res) {
    var body = req.body;
    var id = body.id;
    var date = new Date(body.date)
    ReOrder.update({ _id: id }, { receivedAt: date }, function(err, updated) {
        if (err) {
            res.json(CreateObjService.response(true, err))
        } else {
            res.json(CreateObjService.response(false, updated))
        }
    })
})

router.get('/updateEmails', function(req, res) {

    Sellers.find({}, function(err, sell) {

        _.forEach(sell, function(s) {

            Sellers.update({ _id: s._id }, {
                $set: {
                    emailId1: {
                        city: "Delhi/NCR",
                        cityId: 1,
                        ids: s.emailId
                    },
                    emailIdcc1: {
                        city: "Delhi/NCR",
                        cityId: 1,
                        ids: s.emailIdcc
                    }


                }
            }, function(err, update) {
                if (!err)
                    console.log(update)

            })

        })

    })


});

router.post('/getCouponClients', function(req, res) {

    var matchQuery = { $or: [{ "creditsHistory.reason": { $regex: "NY10" } }, { "creditsHistory.reason": { $regex: "APPBOOK10" } }, { "creditsHistory.reason": { $regex: "APP10" } }, { "creditsHistory.reason": { $regex: "BULF" } }, { "creditsHistory.reason": { $regex: "OC" } }, { "creditsHistory.reason": { $regex: "IC" } }, { "creditsHistory.reason": { $regex: "SPBU" } }] };
    var code = req.body.code;
    if (code !== undefined) {
        matchQuery = { "creditReason": { $regex: req.body.code } };
    }

    User.aggregate([
        { $group: { _id: "$_id", phoneNumber: { $first: "$phoneNumber" }, firstName: { $first: "$firstName" }, emailId: { $first: "$emailId" }, creditsHistory: { $first: "$creditsHistory" } } },
        { $unwind: "$creditsHistory" },
        { $project: { phoneNumber: 1, firstName: 1, emailId: 1, deservedLoyality: "$creditsHistory.amount", creditReason: "$creditsHistory.reason", creditSource: "$creditsHistory.source" } },
        { $match: matchQuery },
        { $lookup: { from: "appointments", localField: "creditSource", foreignField: "_id", as: "appt" } },
        {
            $lookup: {
                from: "contactedclients",
                localField: "phoneNumber",
                foreignField: "clientPhoneNumber",
                as: "clientData"
            }
        },
        {
            $project: {
                _id: 1,
                phoneNumber: 1,
                firstName: 1,
                emailId: 1,
                remark: {
                    $cond: {
                        if: { $eq: [{ $size: "$clientData" }, 1] },
                        then: { $arrayElemAt: ["$clientData.contactHistory", 0] },
                        else: []
                    }
                },
                deservedLoyality: "$deservedLoyality",
                couponCode: "$creditReason",
                creditSource: "$creditSource",
                apptStatus: { $arrayElemAt: ["$appt.status", 0] },
                apptAmount: { $arrayElemAt: ["$appt.payableAmount", 0] },
                apptCreditsOffered: { $arrayElemAt: ["$appt.loyalityPoints", 0] },
                apptServices: { $arrayElemAt: ["$appt.services", 0] },
                apptParlor: { $arrayElemAt: ["$appt.parlorName", 0] },
                apptDate: { $arrayElemAt: ["$appt.appointmentStartTime", 0] },
            }
        },
        {
            $project: {
                _id: 1,
                phoneNumber: 1,
                firstName: 1,
                emailId: 1,
                agentResponse: {
                    $cond: {
                        if: { $eq: [{ $size: "$remark" }, 0] },
                        then: "",
                        else: { $arrayElemAt: ["$remark.remark", { $subtract: [{ $size: "$remark" }, 1] }] }
                    }
                },
                deservedLoyality: 1,
                couponCode: 1,
                creditSource: 1,
                apptStatus: 1,
                apptAmount: 1,
                apptCreditsOffered: 1,
                apptServices: 1,
                apptParlor: 1,
                apptDate: 1,
            }
        },
        {
            $group: {
                _id: "$_id",
                phoneNumber: { $first: "$phoneNumber" },
                firstName: { $first: "$firstName" },
                emailId: { $first: "$emailId" },
                agentResponse: { $first: "$agentResponse" },
                deservedLoyality: { $first: "$deservedLoyality" },
                apptCreditsOffered: { $first: "$apptCreditsOffered" },
                couponCode: { $first: "$couponCode" },
                creditSource: { $first: "$creditSource" },
                apptStatus: { $first: "$apptStatus" },
                apptAmount: { $first: "$apptAmount" },
                apptServices: { $first: "$apptServices.name" },
                apptParlor: { $first: "$apptParlor" },
                apptDate: { $first: "$apptDate" },
            }
        },
        { $sort: { apptDate: -1 } }
    ], function(err, agg) {
        _.forEach(agg, function(a) {
            var str = a.couponCode;
            console.log(str)
            var code = str.substring(str.indexOf("-"));
            a.couponCode = code;
        })
        res.json(agg)
    })
});

router.post('/newCoupons', function(req, res) {

    var code = req.body.code;
    var matchQuery = { "couponLoyalityCode": { $regex: req.body.code } };

    Appointment.aggregate([
        { $match: { "couponLoyalityCode": { $ne: null } } },
        { $sort: { appointmentStartTime: 1 } },
        {
            $group: {
                "_id": "$client.id",
                couponLoyalityCode: { $last: "$couponLoyalityCode" },
                couponLoyalityPoints: { $last: "$couponLoyalityPoints" },
                servicesName: { $last: "$services.name" },
                payableAmount: { $last: "$payableAmount" },
                clientName: { $last: "$client.name" },
                clientPhoneNumber: { $last: "$client.phoneNumber" },
                count: { $sum: 1 },
                status: { $last: "$status" },
                parlorName: { $last: "$parlorName" },
                parlorAddress2: { $last: "$parlorAddress2" },
                apptDate: { $last: "$appointmentStartTime" }
            }
        },
        {
            $project: {
                couponLoyalityCode: 1,
                couponLoyalityPoints: 1,
                "services.name": "$servicesName",
                payableAmount: 1,
                "client.name": "$clientName",
                "client.phoneNumber": "$clientPhoneNumber",
                count: 1,
                status: 1,
                parlorName: 1,
                parlorAddress2: 1,
                apptDate: 1
            }
        },
        { $match: matchQuery },
        {
            $lookup: {
                from: "contactedclients",
                localField: "client.phoneNumber",
                foreignField: "clientPhoneNumber",
                as: "clientData"
            }
        },
        {
            $project: {
                couponLoyalityCode: 1,
                couponLoyalityPoints: 1,
                services: 1,
                payableAmount: 1,
                client: 1,
                remark: {
                    $cond: {
                        if: { $eq: [{ $size: "$clientData" }, 1] },
                        then: { $arrayElemAt: ["$clientData.contactHistory", 0] },
                        else: []
                    }
                },
                count: 1,
                status: 1,
                parlorName: 1,
                parlorAddress2: 1,
                apptDate: 1
            }
        },
        {
            $project: {
                couponLoyalityCode: 1,
                couponLoyalityPoints: 1,
                services: 1,
                payableAmount: 1,
                client: 1,
                agentResponse: {
                    $cond: {
                        if: { $eq: [{ $size: "$remark" }, 0] },
                        then: "",
                        else: { $arrayElemAt: ["$remark.remark", { $subtract: [{ $size: "$remark" }, 1] }] }
                    }
                },
                count: 1,
                status: 1,
                parlorName: 1,
                parlorAddress2: 1,
                apptDate: 1
            }
        },
        { $sort: { apptDate: -1 } }
    ], function(err, agg) {
        if (err) {
            res.json("There is some error")
        } else
            res.json(agg)
    })
});


router.get('/couponCodeList', function(req, res) {
    var coupons = ["WEEK15", "24HR", "CORPID15", "APP10", "WINT10", "GBCOL", "NY10", "REFER15", "VDAY", "HOLI15", "PROFILE15"]
    res.json(coupons)
});

router.get('/getSellersList', function(req, res) {


    Sellers.find({}, { name: 1 }, function(err, sellers) {

        if (err) {
            res.json(CreateObjService.response(true, err))
        } else {
            res.json(CreateObjService.response(false, sellers))

        }

    })


})

router.get('/getSellersItemsData', function(req, res) {

    var id = req.query.id;

    Sellers.findOne({ _id: id }, { name: 1, items: 1 }, function(err, sellers) {

        if (err) {
            res.json(CreateObjService.response(true, err))
        } else {
            res.json(CreateObjService.response(false, sellers))

        }

    })


})


router.get('/poItems', function(req, res) {

    ReOrder.find({ createdAt: { $gte: new Date(2017, 11, 1), $lt: new Date(2017, 11, 31) } }, function(err, order) {
        var data = [];
        console.log(order.length)
        for (var i = 0; i < order.length; i++) {
            for (var j = 0; j < order[i].items.length; j++) {
                data.push({ item: order[i].items[j].categoryName })
            }

        }
        res.json(data)

    })

});


router.post('/changeParlorForSubscription', function(req, res) {
    console.log(req.body)
    if (req.body.appointmentId) {
        Parlor.findOne({ _id: req.body.parlorId, active: true }, { name: 1, address: 1, address2: 2, phoneNumber: 1 }, function(err1, parlor) {
            if (parlor) {
                Appointment.update({ _id: req.body.appointmentId }, { parlorId: req.body.parlorId, parlorName: parlor.name, parlorAddress2: parlor.address2, parlorAddress: parlor.address, contactNumber: parlor.phoneNumber }, function(err, apptUpdate) {

                    if (err)
                        return res.json(CreateObjService.response(true, 'Error in updating parlor'));
                    else
                        return res.json(CreateObjService.response(false, 'Successfully Updated'));
                })
            } else
                return res.json(CreateObjService.response(true, 'This Parlor is Inactive'));
        })
    } else {
        Appointment.find({ status: { $in: [1, 4] }, buySubscriptionId: { $ne: null } }, { parlorId: 1, subscriptionAmount: 1, parlorName: 1, parlorAddress2: 1, buySubscriptionId: 1, 'client.name': 1, 'client.phoneNumber': 1 }).sort({ appointmentStartTime: -1 }).exec(function(err, appt) {

            if (err)
                return res.json(CreateObjService.response(true, 'No appointments found'));
            else
                return res.json(CreateObjService.response(false, appt));
        })
    }

});

router.post('/primeCustomerReport', function(req, res) {
    let query = { createdAt: { $gte: HelperService.getDayStart(req.body.startDate), $lt: HelperService.getDayEnd(req.body.endDate) }, "client.subscriptionLoyality" : 0, payableAmount : {$gt : 1000}, status : 3 }
    Appointment.aggregate([
    {
        $match : query
    },
    {
        $sort : {appointmentStartTime : -1}
    },
    {
        $project:{
            name : "$client.name",
            phoneNumber : "$client.phoneNumber",
            "services.name" : 1,
            parlorId : 1,
            appointmentId : "$_id",
            parlorId : 1,
            parlorName : 1,
            parlorAddress : 1,
            payableAmount : 1,
            appointmentStartTime : 1,
            subtotal : 1,
        }
    }
    ]).exec(function(err, appointments){
        return res.json(CreateObjService.response(false, appointments));
    })
})

router.post('/subscriptionSaleReport', function(req, res) {

    console.log(req.body)
    var finalObject = {};
    var d = []
    var query = {};
    if (req.body.paymentType == "cash") {
        query = { razorPayId: { $regex: "cash" }, createdAt: { $gte: HelperService.getDayStart(req.body.startDate), $lt: HelperService.getDayEnd(req.body.endDate) } }
    } else if (req.body.paymentType == "online") {
        query = { $or: [{ $and: [{ razorPayId: { $not: /^pay.*/ } },{ razorPayId: { $not: /^salon.*/ } }, { razorPayId: { $not: /^cash.*/ } }] }, { razorPayId: { $regex: "pay" } }], createdAt: { $gte: HelperService.getDayStart(req.body.startDate), $lt: HelperService.getDayEnd(req.body.endDate) } }
    } else {
        query = { createdAt: { $gte: HelperService.getDayStart(req.body.startDate), $lt: HelperService.getDayEnd(req.body.endDate) } }
    }
    console.log(req.body.isGiftedOnly)
    if(req.body.isGiftedOnly){
        query.couponCode = {$regex : "GIFT"}
    }else{
        query.$or = [{couponCode :  {$regex: '^((?!GIFT).)*$'  }}, {couponCode : null}]
    }
    SubscriptionSale.aggregate([
            { $match: query },
            { $project: { createdAt: 1, userId: 1, price: 1, response: '$response.id' ,subscriptionId:1 , actualPricePaid:1 , couponCode:1} },
            { $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "user" } },
            {
                $project: {
                    userId: 1,
                    response: 1,
                    price: 1,
                    source:1,
                    subscriptionId: 1,
                    actualPricePaid: 1,
                    clientName: { $arrayElemAt: ["$user.firstName", 0] },
                    phoneNumber: { $arrayElemAt: ["$user.phoneNumber", 0] },
                    gender: { $arrayElemAt: ["$user.gender", 0] },
                    createdAt: 1,
                    couponCode:1,
                    // { '$dateToString': { format: '%m/%d/%Y', date: '$createdAt' } }
                }
            },
            { $sort: { createdAt: 1 } }
        ],
        function(err, subscriptions) {
            console.log(err)
            var gold = 0, silver = 0, online = 0, cash = 0, male = 0, female = 0;

            async.each(subscriptions, function(subs, callback) {

                var apptDate = HelperService.getCustomStart(subs.createdAt)
                User.findOne({_id : subs.userId}, {subscriptionGiftHistory : 1}, function(err, user){
                Appointment.find({ status: 3, loyalitySubscription: { $gt: 0 }, 'client.id': subs.userId }, { payableAmount: 1, loyalitySubscription: 1, 'services.name': 1, parlorName: 1, parlorAddress2: 1, appointmentStartTime: 1 }, function(err, appt) {
                    Appointment.findOne({ status: 3, 'client.id': subs.userId, subscriptionAmount: { $gt: 0 } }, { parlorId: 1, parlorName: 1, parlorAddress2: 1 }, function(err2, cashAppt) {
                        Appointment.aggregate([{ $match: { 'client.id': ObjectId(subs.userId), status: 3, appointmentStartTime: { $gt: new Date(2017, 0, 1), $lt: HelperService.getDayStart(subs.createdAt) } } },
                            { $group: { _id: '$clientId', count: { $sum: 1 }, appt: { $push: { appointmentDate: { '$dateToString': { format: '%m/%d/%Y', date: '$appointmentStartTime' } }, revenue: { $add: ['$serviceRevenue', '$productRevenue'] }, payableAmount: "$payableAmount" } } } },
                            { $project: { count: 1, lastAppt: { $slice: ["$appt", -2] } } }
                        ], function(err, agg2) {
                            Appointment.aggregate([{ $match: { 'client.id': ObjectId(subs.userId), status: 3, appointmentStartTime: { $gt: new Date(2017, 0, 1), $lt: HelperService.getDayStart(subs.createdAt) } } },
                                { $unwind: "$services" },
                                { $project: { freeServiceTaken: { $cond: { if: { $eq: ["$services.discountMedium", 'frequency'] }, then: 1, else: 0 } } } },
                            ], function(err, freeServ) {
                                Appointment.aggregate([{ $match: {  appointmentStartTime: { $gte: HelperService.getDayStart(apptDate) }, 'client.id': ObjectId(subs.userId), status: 3 } },
                                    {
                                        $project: {
                                            revenue: { $add: ['$serviceRevenue', '$productRevenue'] },
                                            year: { $year: "$appointmentStartTime" },
                                            month: { $month: "$appointmentStartTime" },
                                            'clientId': "$client.id",
                                            loyalitySubsctiption: 1
                                        }
                                    },
                                    { $group: { _id: { clientId: '$clientId', month: "$month", year: "$year" }, year: { $first: "$year" }, month: { $first: "$month" }, revenue: { $sum: "$revenue" }, count: { $sum: 1 } } },
                                    { $project: { _id: 0, month: "$month", year: "$year", revenue: { $ceil: "$revenue" } } },
                                    { $sort: { year: 1, month: 1 } }
                                ], function(err, agg3) {
                                    var str = subs.response,
                                        clientRevenueTillNow = 0,
                                        clientAppointmentTillNow = 0;
                                    var res = str.substring(0, 4);
                                    subs.couponCode = subs.couponCode;
                                    subs.giftLeft = user ? (5 - (user.subscriptionGiftHistory ? user.subscriptionGiftHistory.length : 0)) : 0;
                                    subs.source = subs.source;
                                    subs.subscriptionType = (subs.subscriptionId == 1) ? "Gold" : "Silver";
                                    subs.paymentMethod = (res == "cash") ? "Cash Payment" :(res == "salo" ? "Salon Payment": "Online Payment");
                                    subs.cashSalon = (cashAppt) ? cashAppt.parlorName + " - " + cashAppt.parlorAddress2 : "";
                                    subs.cashSalonId = (cashAppt) ? cashAppt.parlorId : "";
                                    subs.createdAt = subs.createdAt.toDateString();
                                    if (subs.subscriptionId == 1) gold++;
                                    else silver++;
                                    subs.gender = (subs.gender == "M") ? "Male" : "Female";
                                    if (subs.gender == "Male") male++;
                                    else female++;
                                    if (res == "cash") cash++;
                                    else online++;
                                    if (agg3 && agg3.length > 0) subs.clientRevenueTillNow = agg3;
                                    if (agg2 && agg2.length > 0) {

                                        subs.clientAppointmentTillNow = agg2[0].count;
                                        subs.clientAppointments = agg2[0].lastAppt;
                                        subs.freeServiceTaken = (freeServ.length > 0) ? freeServ[0].freeServiceTaken : 0;
                                    }
                                    if (appt && appt.length > 0) {

                                        subs.parlorname = appt[0].parlorName + " - " + appt[0].parlorAddress2;
                                        subs.payableAmount = appt[0].payableAmount;
                                        subs.subscriptionAmountUsed = appt[0].loyalitySubscription;
                                        subs.appointmentDate = appt[0].appointmentStartTime.toDateString();
                                        subs.services = _.map(appt[0].services, function(s) {
                                            return s.name;
                                        });

                                    }
                                    d.push(subs);
                                    callback();
                                })
                            })
                        })
                    });
                });
                });

            }, function allTaskCompleted() {

                finalObject.subscriptions = d;
                finalObject.goldCount = gold;
                finalObject.silverCount = silver;
                finalObject.onlineCount = online;
                finalObject.cashCount = cash;
                finalObject.maleCount = male;
                finalObject.femaleCount = female;
                finalObject.totalCount = subscriptions.length;

                return res.json(CreateObjService.response(false, finalObject));
            })
        });
});



router.post('/pastAppointmentsForSettlement', function(req, res) {
    console.log(startDate)
    var startDate = req.body.startDate ? req.body.startDate : new Date(2017, 3, 27),
        endDate = req.body.endDate ? req.body.endDate : new Date(2017, 3, 27, 23, 59, 59);
    console.log(startDate)
    console.log(endDate)
    Appointment.find({
        appointmentStartTime: { $gte: startDate, $lt: endDate },
        status: 3
    }, function(err, appt) {
        console.log(appt.length)

        var allData = [];
        async.each(appt, function(a, cbs) {
            Beu.findOne({ _id: a.closedBy }, function(err, beu) {
                var closedByName;
                if (beu) {
                    closedByName = "Beu"
                } else {
                    closedByName = "Salon"

                }
                var obj = Appointment.parse(a);
                obj.appType = a.appointmentType == 1 ? "Walkin" : a.appointmentType == 2 ? "Call" : a.appointmentType == 3 ? "Online" : "";
                obj.parlorName = a.parlorName;
                obj.parlorAddress2 = a.parlorAddress2;
                obj.membershipCreditsUsed = a.creditUsed;
                obj.clientFirstAppointment = a.clientFirstAppointment;
                obj.superSetServices = Appointment.populateServices(a.superSetServices);
                obj.closedByName = closedByName;
                obj.subscriptionAmount = a.subscriptionAmount;
                console.log(obj)
                allData.push(obj)
                cbs();
            })
        }, function(done) {
            return res.json(CreateObjService.response(false, allData));
        })

    })
});



router.post('/createUserQuestionAnswer', function(req, res) {
    UserQuestionAnswers.create(UserQuestionAnswers.createNewQuesObj(req), function(err, questions) {
        if (err) {
            console.log(err)
            return res.json(CreateObjService.response(true, "error"));
        } else {
            return res.json(CreateObjService.response(false, 'success'))
        }
    })
});


router.post('/blockCouponCodes', function(req, res) {
    Offer.update({ code: req.body.code }, { active: false }, function(err, update) {
        if (err) {
            console.log(err)
            return res.json(CreateObjService.response(true, "error"));
        } else {
            return res.json(CreateObjService.response(false, 'success'))
        }
    })
});


router.post('/changeParlorEditAppointment', function(req, res) {
    console.log(req.body)
    var today = new Date();
    if (req.body.appointmentId) {
        Parlor.findOne({ _id: req.body.parlorId, active: true }, { name: 1, address: 1, address2: 2, phoneNumber: 1 }, function(err1, parlor) {
            if (parlor) {
                Appointment.update({ _id: req.body.appointmentId }, { parlorId: req.body.parlorId, parlorName: parlor.name, parlorAddress2: parlor.address2, parlorAddress: parlor.address, contactNumber: parlor.phoneNumber }, function(err, apptUpdate) {

                    if (err)
                        return res.json(CreateObjService.response(true, 'Error in updating parlor'));
                    else
                        return res.json(CreateObjService.response(false, 'Successfully Updated'));
                })
            } else
                return res.json(CreateObjService.response(true, 'This Parlor is Inactive'));
        })
    } else {
        SettlementReport.findOne({}, { createdAt: 1, startDate: 1, endDate: 1 }).sort({ $natural: -1 }).exec(function(err, settlement) {

            if (settlement.createdAt.getDate() <= today.getDate()) {

                Appointment.find({ status: { $in: [1, 4, 3] }, appointmentStartTime: { $gte: settlement.startDate }, 'client.phoneNumber': req.body.phoneNumber }, { parlorId: 1, parlorName: 1, parlorAddress2: 1, payableAmount: 1, subtotal: 1, status: 1, 'client.name': 1, 'client.phoneNumber': 1, appointmentStartTime: 1 }).sort({ appointmentStartTime: -1 }).exec(function(err, appt) {

                    if (err)
                        return res.json(CreateObjService.response(true, 'No appointments found'));
                    else
                        return res.json(CreateObjService.response(false, appt));
                })
            } else {
                return res.json(CreateObjService.response(false, 'Select only for current Settlement'));
            }
        })
    }

});



router.post('/updateSubscriptionBalance', function(req, res) {
    var today = new Date();
    var todayMonth = today.getMonth();
    SettlementReport.findOne({}, { createdAt: 1, startDate: 1, endDate: 1 }).sort({ $natural: -1 }).exec(function(err, settlement) {
        if (settlement.createdAt.getTime() <= today.getTime()) {
            User.findOne({ phoneNumber: req.body.phoneNumber, subscriptionId: { $in: [1, 2] } }, { phoneNumber: 1, subscriptionRedeemMonth: 1 }, function(err, user) {
                if (user) {
                    Appointment.find({ appointmentStartTime: { $gte: HelperService.getDayStart(settlement.createdAt) }, 'client.phoneNumber': req.body.phoneNumber, status: { $in: [1, 3, 2] } }, { 'client.name': 1, status: 1, loyalitySubscription: 1, payableAmount: 1, subtotal: 1, appointmentStartTime: 1, parlorName: 1, parlorAddress2: 1, 'client.id': 1 }, function(err, appts) {
                        return res.json(CreateObjService.response(false, appts))

                    })
                } else
                    return res.json(CreateObjService.response(true, 'No Subscription'))
            })
        }else
            return res.json(CreateObjService.response(true, 'Appointment not in this settlement'))
    })
});


router.post('/updatePreviousDues1', function(req, res) {
    console.log(req.body)
    SettlementReport.findOne({ _id: req.body.settlementId }, { createdAt: 1, period: 1, balance: 1, netPayable: 1, paidToSalon: 1 }).sort({ $natural: -1 }).exec(function(err, setttle) {
        if (setttle.period == req.body.period) {
            console.log(setttle.netPayable)
            if (req.body.previousDue < 0 && setttle.netPayable < 0) {
                var paid_salon = 0
                var bal = setttle.netPayable + req.body.previousDue
            } else {
                var paid_salon = setttle.netPayable + req.body.previousDue
                var bal = 0;
            }
            SettlementReport.update({ _id: req.body.settlementId }, { previousDue: req.body.previousDue, balance: bal, paidToSalon: paid_salon }, function(err, updated) {
                if (updated) return res.json(CreateObjService.response(false, 'Updated'))
                else return res.json(CreateObjService.response(true, 'There is some error'))
            })
        } else {
            return res.json(CreateObjService.response(true, 'Please select the right dates!'))
        }
    })
});

router.post('/reopenAppointments', function(req, res) {
    var today = new Date();
    var apptId = req.body.appointmentId
    if (apptId) {
        Appointment.findOne({ _id: apptId }, { bookingMethod: 1, appBooking: 1, services: 1 }, function(err, app) {
            if (app.bookingMethod == 2 && app.appBooking == 2) {
                _.forEach(app.services, function(ser) {
                    ser.employees = []
                })
                Appointment.update({ _id: apptId }, { status: 1, employees: [], services: app.services }, function(err, update) {
                    return res.json(CreateObjService.response(false, 'This appointment was booked from APP'));
                })
            } else {
                Appointment.update({ _id: apptId }, { status: 1 }, function(err, update) {
                    return res.json(CreateObjService.response(false, 'This appointment was from CRM'));
                })
            }
        })
    } else {
        SettlementReport.findOne({}, { createdAt: 1, startDate: 1, endDate: 1 }).sort({ $natural: -1 }).exec(function(err, settlement) {
            if (settlement.createdAt.getDate() <= today.getDate()) {
                Appointment.find({ appointmentStartTime: { $gte: settlement.startDate }, 'client.phoneNumber': req.body.phoneNumber, status: { $in: [2, 3] } }, { 'client.name': 1, 'client.phoneNumber': 1, status: 1, loyalitySubscription: 1, payableAmount: 1, subtotal: 1, appointmentStartTime: 1, parlorName: 1, parlorAddress2: 1, 'client.id': 1 }, function(err, appts) {
                    return res.json(CreateObjService.response(false, appts))
                })
            } else
                return res.json(CreateObjService.response(true, 'No Subscription'))
        })
    }
})


router.get('/getParlorsClientsFrequency', function(req, res) {
    var data = [];
    Parlor.find({}, { _id: 1, address2: 1, name: 1 }, function(err, parlors) {
        async.each(parlors, function(parlor, callback) {
            Appointment.aggregate([{ $match: { status: 3, parlorId: ObjectId(parlor.id) } },
                { $project: { clientId: "$client.id", _id: 1, serviceRevenue: 1 } },
                { $group: { '_id': '$clientId', count: { $sum: 1 }, serviceRevenue: { $sum: "$serviceRevenue" } } },
                {
                    $bucket: {
                        groupBy: "$count",
                        boundaries: [0, 1, 2, 3, 4, 7, 10, 13],
                        default: "Other",
                        output: {
                            "count": { $sum: 1 },
                            'serviceRevenue': { $sum: '$serviceRevenue' }
                        }
                    }
                },
                { $project: { _id: 1, count: 1, serviceRevenue: 1 } }
            ], function(err, agg) {

                var obj = {
                    parlorName: parlor.name + " - " + parlor.address2,
                    parlorId: parlor.id,
                    clientCount: agg
                }

                data.push(obj)
                callback();
            })
        }, function allTaskCompleted() {
            res.json(data)
        });
    });

});


router.post('/editSettlementBalances', function(req, res) {
    SettlementReport.update({ _id: req.body.settlementId, period: req.body.period }, { balance: req.body.newbalance }, function(err, updated) {
        if (updated) {
            return res.json(CreateObjService.response(false, "Updated Successfully"));
        } else {
            return res.json(CreateObjService.response(true, "There is some error"));
        }
    })
});


router.post('/subscriptionCohort', function(req, res) {
    var d = [];
    var match = {};
    if (req.body.type == 1) match = { subscriptionId: 1 }
    else if (req.body.type == 2) match = { subscriptionId: 2 }
    else match = { subscriptionId: { $in: [1, 2] } }
    User.aggregate([{ $match: match },
        { $project: { month: { $month: "$subscriptionBuyDate" }, userId: "$_id" } },
        { $group: { _id: "$month", month: { $first: "$month" }, count: { $sum: 1 }, users: { $push: "$userId" } } },
        { $sort: { month: 1 } }
    ], function(err, subscribers) {

        async.each(subscribers, function(a, callback) {
            var obj1 = {
                month: HelperService.getMonthName(a.month - 1),
                subcribers: a.count,
                repeatedSubscribers: []
            };

            Appointment.aggregate([
                { $match: { status: 3, loyalitySubscription: { $gt: 0 }, 'client.id': { $in: a.users }, appointmentStartTime: { $gte: new Date(2018, (a.month - 1), 1) } } },
                {
                    $project: {
                        month: { $month: "$appointmentStartTime" },
                        totalRevenue: { $add: ["$serviceRevenue", "$productRevenue"] },
                        clientId: "$client.id",
                        totalRedemption: "$loyalitySubscription"
                    }
                },
                { $group: { _id: { month: "$month", clientId: "$clientId" }, month: { $first: '$month' }, count: { $sum: 1 }, totalRevenue: { $sum: "$totalRevenue" }, totalRedemption: { $sum: "$totalRedemption" } } },
                { $group: { _id: "$_id.month", month: { $first: '$month' }, count: { $sum: 1 }, totalRevenue: { $sum: "$totalRevenue" }, totalRedemption: { $sum: "$totalRedemption" } } },
                { $sort: { month: 1 } }
            ], function(err, repeated) {
                _.forEach(repeated, function(af) {
                    af.month = HelperService.getMonthName(af.month - 1);
                })

                if (repeated.length < subscribers.length) {
                    for (var i = 0; i = (subscribers.length - repeated.length); i++) {
                        var spareObj = {};
                        spareObj._id = i;
                        spareObj.month = HelperService.getMonthName(i - 1);
                        spareObj.count = 0;
                        spareObj.totalRevenue = 0;
                        spareObj.totalRedemption = 0;

                        repeated.push(spareObj)
                    }
                }

                repeated.sort(function(a, b) {
                    return a._id - b._id;
                });


                obj1.repeatedSubscribers.push(repeated)
                callback();
            })

            d.push(obj1)

        }, function allTaskCompleted() {
            res.json(d)
        })
    })
});


router.post('/creditSubscriptionBalance', function(req, res) {
    Appointment.findOne({ 'client.phoneNumber': req.body.phoneNumber, loyalitySubscription: { $gt: 0 }, status: 2 }, { loyalitySubscription: 1, appointmentStartTime: 1 }, function(err, appointment) {
        if (appointment) {
            User.update({ phoneNumber: req.body.phoneNumber }, { $pull: { subscriptionRedeemHistory: { appointmentId: appointment._id } } }, function(err, userUpdate) {
                if (userUpdate) {
                    return res.json(CreateObjService.response(false, 'done'))
                } else
                    return res.json(CreateObjService.response(true, 'error'))
            })
        }
    })
})


router.get('/servicesInCart', function(req, res) {
    var today = new Date();

    today.setMinutes(today.getMinutes() - 15);

    var query = { lastServiceAddTime: { $gte: HelperService.getDayStart(today), $lt: today } }

    UserCart.aggregate([{ $match: query },
        { $lookup: { from: 'parlors', localField: 'parlorId', foreignField: '_id', as: 'parlor' } },
        { $project: { userId: 1, lastServiceAddTime: 1, userId: 1, parlorName: { $concat: [{ $arrayElemAt: ["$parlor.name", 0] }, '-', { $arrayElemAt: ["$parlor.address2", 0] }] }, services: 1 } },
        { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' } },
        {
            $project: {
                userId: "$userId",
                lastServiceAddTime: "$lastServiceAddTime",
                clientName: { $concat: [{ $arrayElemAt: ['$user.firstName', 0] }, { $arrayElemAt: ['$user.lastName', 0] }] },
                phoneNumber: { $arrayElemAt: ['$user.phoneNumber', 0] },
                parlorName: '$parlorName',
                services: '$services'
            }
        },
        { $unwind: '$services' },
        { $lookup: { from: "services", localField: 'services.code', foreignField: 'serviceCode', as: 'services' } },
        {
            $project: {
                userId: "$userId",
                lastServiceAddTime: "$lastServiceAddTime",
                clientName: "$clientName",
                phoneNumber: "$phoneNumber",
                parlorName: '$parlorName',
                service: { $arrayElemAt: ['$services.name', 0] }
            }
        },
        {
            $group: {
                _id: "$_id",
                userId: { $first: "$userId" },
                clientName: { $first: "$clientName" },
                phoneNumber: { $first: "$phoneNumber" },
                parlorName: { $first: "$parlorName" },
                services: { $push: "$service" },
                lastServiceAddTime: { $first: "$lastServiceAddTime" }
            }
        }, { $sort: { lastServiceAddTime: -1 } }
    ], function(err, agg) {
        console.log(agg.length)
        if (!err) {
            return res.json(CreateObjService.response(false, agg))
        } else {
            return res.json(CreateObjService.response(true, 'error'))
        }
    })
});


router.post('/relevanceReport', function(req, res) {

    var d = [];
    // HelperService.getLastMonthStart()
    var today = new Date();
    // var date =  new Date(req.query.date);
    
    // var monthDate=new Date(date.setMonth(date.getMonth()));
    // var monthStart= HelperService.getCurrentMonthStart(monthDate);
    // var monthEnd= HelperService.getMonthLastDate(monthDate);
    var parlorQuery = {active : true};
    console.log(req.body)
    if(req.body.parlorIds && req.body.parlorIds.length > 0){
        parlorQuery._id = {$in : req.body.parlorIds}
    }
console.log("parlorQuery" , parlorQuery)
    Parlor.find(parlorQuery, { _id: 1,parlorLiveDate:1, geoLocation: 1, name: 1, parlorLiveDate: 1, avgRoyalityAmount : 1, address2: 1, cityId: 1, parlorType : 1 }, function(err, parlors) {
        console.log(parlors.length)
        async.each(parlors, function(parl, call) {

            Appointment.aggregate([{ $match: { parlorId: ObjectId(parl._id), status: 3, appointmentStartTime: { $gte: HelperService.getDayStart(req.body.startDate), $lte : HelperService.getDayEnd(req.body.endDate)} } },
                { $group: { _id: '$parlorId', totalRevenue: { $sum: '$serviceRevenue' },totalLoyaltyPoints :{$sum : '$loyalityPoints'} } }
            ], function(err, appts) {

        
                Appointment.find({ parlorId: ObjectId(parl._id), status: 3,appointmentStartTime: { $gte: HelperService.getDayStart(req.body.startDate), $lte : HelperService.getDayEnd(req.body.endDate) } }, 

                    {appointmentType :1, productRevenue:1, bookingMethod: 1, latitude: 1, longitude: 1, serviceRevenue: 1, mode: 1, appBooking: 1, appointmentStartTime: 1, client: 1, userSource: 1, couponCode: 1 }, function(err, distanceAppts) {
                    if (appts && appts.length > 0) {

                        var totalRevenue = appts[0].totalRevenue,
                            totalLoyaltyPoints = appts[0].totalLoyaltyPoints/2,
                            distanceRevenue = 0,
                            countOfPeople = 0,
                            days = 0,
                            beuClientsRevenue = 0,
                            distanceRevenueFirstTime = 0,
                            appRevenue = 0,
                            appRevenueFirstTime = 0, 
                            distanceRevenuelessThan100 = 0,
                            revenureFromNearBuy = 0;
                        var arr = {};
                        console.log("loyality points",appts[0].totalLoyaltyPoints)
                        if (distanceAppts && distanceAppts.length > 0) {

                            _.forEach(distanceAppts, function(a) {
                                if(a.latitude == null)a.latitude = 0;
                                if(a.longitude == null)a.longitude = 0;

                                if ( a.appointmentType == 3 || a.couponCode || a.mode==5 || a.mode == 7 || a.mode == 9) {
                                    var distance = HelperService.getDistanceBtwCordinates1(parl.geoLocation[1], parl.geoLocation[0], a.latitude, a.longitude)
                                    if ((distance >= 0.05 && a.appointmentType == 3) || a.mode == 5 || a.couponCode || a.mode == 7 || a.mode == 9) {
                                        distanceRevenue += a.serviceRevenue
                                        countOfPeople++;
                                        if (a.client.noOfAppointments == 0 || a.couponCode) distanceRevenueFirstTime += a.serviceRevenue
                                    } 
                                    else if ((distance < 0.05 && a.appointmentType == 3)) {
                                        distanceRevenuelessThan100 += a.serviceRevenue
                                        countOfPeople++;
                                    }
                                    appRevenue += a.serviceRevenue;
                                    if (a.client.noOfAppointments == 0 || a.couponCode) appRevenueFirstTime += a.serviceRevenue;
                                    if(a.couponCode)revenureFromNearBuy += a.serviceRevenue;
                                }
                                if(a.userSource == 1){
                                    beuClientsRevenue += a.serviceRevenue
                                }

                            })


                            var parlorLiveDifference;
                            if (parl.parlorLiveDate) parlorLiveDifference = HelperService.getDaysBetweenTwoDates(parl.parlorLiveDate, new Date())
                            else parlorLiveDifference = HelperService.getDaysBetweenTwoDates(distanceAppts[0].appointmentStartTime, new Date());
                            if (parlorLiveDifference < 30) days = parlorLiveDifference;
                            else days = 30;
                            arr.liveDate = parl.parlorLiveDate;
                            arr.salonName = parl.name + "-" + parl.address2;
                            arr.distanceRevenue = distanceRevenue;
                            arr.totalRevenue = totalRevenue;
                            arr.countOfPeople = countOfPeople;
                            arr.beuClientsRevenue = parseInt(beuClientsRevenue);
                            arr.distanceRevenueFirstTime = distanceRevenueFirstTime;
                            arr.days = days;
                            arr.startDate = HelperService.getDayStart(req.body.startDate);
                            arr.endDate = HelperService.getDayEnd(req.body.endDate);
                           

                        }

                        arr.salonName = parl.name + "-" + parl.address2;
                        arr.cityId = parl.cityId;
                         arr.liveDate = parl.parlorLiveDate;
                        arr.parlorType = parl.parlorType;
                        arr.avgRoyalityAmount = parl.avgRoyalityAmount;
                        arr.distanceRevenue = distanceRevenue;
                        arr.totalRevenue = totalRevenue;
                        arr.beuClientsRevenue = parseInt(beuClientsRevenue);
                        arr.totalLoyaltyPoints = parseInt(totalLoyaltyPoints.toFixed(2));
                        console.log("loyality points", arr.totalLoyaltyPoints)
                        arr.distanceRevenueFirstTime = distanceRevenueFirstTime;
                        arr.countOfPeople = countOfPeople;
                        arr.appRevenue = appRevenue;
                        arr.appRevenueFirstTime = parseInt(appRevenueFirstTime.toFixed(2));
                        arr.days = days;
                        arr.startDate = HelperService.getDayStart(req.body.startDate);
                        arr.endDate = HelperService.getDayEnd(req.body.endDate);
                        arr.cityId = parl.cityId;
                        arr.revenureFromNearBuy = revenureFromNearBuy;
                        d.push(arr)

                        call();
                    } else{
                        let ar = {}
                         ar.salonName = parl.name + "-" + parl.address2;
                        ar.avgRoyalityAmount = parl.avgRoyalityAmount;
                        ar.distanceRevenue = 0;
                        ar.cityId = parl.cityId;
                        ar.parlorType = parl.parlorType;
                        ar.totalRevenue = 0;
                        ar.totalLoyaltyPoints = 0;
                        ar.distanceRevenueFirstTime = 0;
                        ar.countOfPeople = 0;
                        ar.appRevenue = 0;
                        ar.beuClientsRevenue = 0;
                        ar.appRevenueFirstTime =0;
                        ar.days = 0;
                        ar.startDate = HelperService.getDayStart(req.body.startDate);
                        ar.endDate = HelperService.getDayEnd(req.body.endDate);
                        ar.liveDate = parl.parlorLiveDate;
                        ar.cityId = parl.cityId;
                        ar.revenureFromNearBuy = 0;
                        d.push(ar)
                        call();
                    }
                })
            })

        }, function allTaskCompleted() {
            console.log('allDone')
            res.json(d)
        });
    });
});



router.post('/relevanceReportSalonWise', function(req, res) {
    var d = [];
    var today = new Date();
    var startDate = new Date(req.body.startDate)
    var endDate = new Date(req.body.endDate)
    Parlor.find({ active: true, _id: req.body.parlorId }, { _id: 1, geoLocation: 1, name: 1, parlorLiveDate: 1, address2: 1, cityId: 1 }, function(err, parlors) {

        async.each(parlors, function(parl, call) {

            Appointment.aggregate([{ $match: { parlorId: ObjectId(parl._id), status: 3, appointmentStartTime: { $gte: HelperService.getDayStart(req.body.startDate), $lte : HelperService.getDayEnd(req.body.endDate)} } },
                { $group: { _id: '$parlorId', totalRevenue: { $sum: '$serviceRevenue' } } }
            ], function(err, appts) {
                Appointment.find({ parlorId: ObjectId(parl._id), status: 3 , appointmentStartTime: { $gte: HelperService.getDayStart(req.body.startDate), $lte : HelperService.getDayEnd(req.body.endDate)}}, 
                    { latitude: 1, longitude: 1, serviceRevenue: 1, appBooking: 1, appointmentStartTime: 1, client: 1, bookingMethod:1, mode:1, couponCode:1, appointmentType:1 }, function(err, distanceAppts) {
                    if (appts && appts.length > 0) {

                        var totalRevenue = appts[0].totalRevenue,
                            distanceRevenue = 0,
                            countOfPeople = 0,
                            countOfPeopleFirstTime = 0,
                            days = 0,
                            distanceRevenueFirstTime = 0;
                        var arr = {};
                        var apps = [];
                       
                        if (distanceAppts && distanceAppts.length > 0) {

                            _.forEach(distanceAppts, function(a) {
                                if(a.latitude == null)a.latitude = 0;
                                if(a.longitude == null)a.longitude = 0;

                                if ( a.appointmentType == 3 || a.couponCode || a.mode==5) {
                                    var distance = HelperService.getDistanceBtwCordinates1(parl.geoLocation[1], parl.geoLocation[0], a.latitude, a.longitude)

                                    if ((distance >= 0.05 && a.appointmentType == 3) || a.mode == 5 || a.couponCode) {
                                        distanceRevenue += a.serviceRevenue
                                        countOfPeople++;
                                        if (a.client.noOfAppointments == 0 || a.couponCode){
                                            countOfPeopleFirstTime++;
                                            distanceRevenueFirstTime += a.serviceRevenue;
                                            apps.push({ clientName: a.client.name, serviceRevenue: a.serviceRevenue, appointmentStartTime: a.appointmentStartTime, phoneNumber: a.client.phoneNumber, previosVisits: a.client.noOfAppointments })

                                        }
                                    } 

                                }

                            })


                            var parlorLiveDifference;
                            if (parl.parlorLiveDate) parlorLiveDifference = HelperService.getDaysBetweenTwoDates(parl.parlorLiveDate, new Date())
                            else parlorLiveDifference = HelperService.getDaysBetweenTwoDates(distanceAppts[0].appointmentStartTime, new Date());
                            if (parlorLiveDifference < 30) days = parlorLiveDifference;
                            else days = 30;

                            arr.salonName = parl.name + "-" + parl.address2;
                            arr.distanceRevenue = distanceRevenue;
                            arr.totalRevenue = totalRevenue;
                            arr.countOfPeople = countOfPeople;
                            arr.countOfPeopleFirstTime = countOfPeopleFirstTime;
                            arr.distanceRevenueFirstTime = distanceRevenueFirstTime;
                            arr.days = days;
                            arr.startDate = startDate;
                            arr.endDate = endDate;

                        }

                        arr.salonName = parl.name + "-" + parl.address2;
                        arr.distanceRevenue = distanceRevenue;
                        arr.totalRevenue = totalRevenue;
                        arr.distanceRevenueFirstTime = distanceRevenueFirstTime;
                        arr.countOfPeople = countOfPeople;
                        arr.countOfPeopleFirstTime = countOfPeopleFirstTime;
                        arr.days = days;
                        arr.distanceApps = apps;
                        arr.startDate = startDate;
                        arr.endDate = endDate;
                        arr.cityId = parl.cityId;

                        d.push(arr)

                        call();
                    } else
                        call();
                })
            })

        }, function allTaskCompleted() {
          
            console.log('allDone')
             d[0].distanceApps.sort(function(a, b){
                var keyA = new Date(a.appointmentStartTime),
                    keyB = new Date(b.appointmentStartTime);
                // Compare the 2 dates
                if(keyA > keyB) return -1;
                if(keyA < keyB) return 1;
                return 0;
            });
            res.json(d)
        });
    });
});


router.post('/getFlashSaleAppointments', function(req, res) {
    console.log(req.body)
    var d = [];
    var query  = {};
    if(req.body.flashIds.length > 0){
        query = {_id: {$in : req.body.flashIds}}
    }
    FlashCoupon.find(query, function(err, coupons) {
        var couponNames = [];
        var coupon = _.map(coupons, function(c) { return c.code });
        if(req.body.flashIds.length > 0)couponNames = coupon.slice(-2);
        else couponNames = coupon;
        
        Appointment.find({ status: { $in: [1, 2, 3, 4] }, 'flashCouponCode': { $in: couponNames } }, function(err, appts) {
            async.each(appts, function(app, call) {
                Parlor.findOne({_id: app.parlorId}, {services: 0}, function(err, parl){
                    var arr = {
                        appointmentId: app._id,
                        appointmentDate: app.appointmentStartTime.toDateString(),
                        bookingDate: app.createdAt.toDateString(),
                        flashCouponCode: app.flashCouponCode,
                        payableAmount: app.payableAmount,
                        bookingMethod: (app.bookingMethod == 2) ? 'App' : ((app.bookingMethod == 5) ? 'WEBSITE' : 'CRM'),
                        status: (app.status == 1 || app.status == 4) ? 'BOOKED' : ((app.status == 3) ? 'COMPLETED' : 'CANCELLED'),
                        clientName: app.client.name,
                        clientPhoneNumber: app.client.phoneNumber,
                        parlorName: app.parlorName + "-" + app.parlorAddress2,
                        distanceData : "",
                        newClient : "No",
                        services: _.map(app.services, function(ser) { return ser.name })

                    };
                     if ((app.latitude > 0 && app.longitude > 0) || app.bookingMethod == 2) {
                                        
                        var distance = HelperService.getDistanceBtwCordinates1(parl.geoLocation[1], parl.geoLocation[0], app.latitude, app.longitude)

                        if ((distance >= 0.05 && app.bookingMethod == 2)) {
                            arr.distanceData = "More than 100"
                            if (app.client.noOfAppointments == 0)arr.newClient = "Yes";
                        } else if ((distance < 0.05 && app.bookingMethod == 2)) {
                            arr.distanceData = "Less than 100";
                        }
                       
                    }
                    d.push(arr);
                    call();
                });
            }, function allTaskCompleted() {
               
                res.json(d);
            });
        })

    })
});


router.get('/getSettlementMonthlyInvoice', function(req, res) {

        SettlementMonthlyInvoice.findOne({parlorId: req.query.parlorId , month : req.query.month, year: req.query.year}, function(err , invoice){
           
                return res.json(CreateObjService.response(false, invoice))
           
        })
    
});
router.get('/getSettlementMonthlyInvoiceForAll', function(req, res) {

        SettlementMonthlyInvoice.find({month : req.query.month ,year: req.query.year}, function(err , invoice){
           
                return res.json(CreateObjService.response(false, invoice))
           
        }).sort({parlorName :1})
    
});

router.get('/getParlorForLedger', function(req, res) {
   
    Parlor.find({ active: true }, { name: 1, address: 1, address2: 1 }, function(err, parlors) {
        res.json(CreateObjService.response(false, parlors))

    }).sort({ name: 1 })

})
router.get('/getParlorGstTransferAmount', function(req, res) {
    console.log("hit")
    Gsttransfer.find({ parlorId: req.query.parlorId }, function(err, transfer) {
        SubsTransfer.find({ parlorId: req.query.parlorId }, function(err, substransfer) {
            res.json(CreateObjService.response(false, { gst: transfer, subs: substransfer }))

        });
    });

});

router.post('/addGstAmount', function(req, res) {
    var parlorId = req.body.parlorId;
    var amount = req.body.amount;
    var type = req.body.type;
    if (type == 0) {

        Gsttransfer.create({

            parlorId: parlorId,

            amount: amount,

            time: req.body.date

        }, function(err, data) {
            if (err) {
                res.json(CreateObjService.response(true, err))
            } else {
                res.json(CreateObjService.response(false, data))

            }

        })
    } else if (type == 1) {
        SubsTransfer.create({

            parlorId: parlorId,

            amount: amount,

            time: req.body.date

        }, function(err, data) {
            if (err) {
                res.json(CreateObjService.response(true, err))
            } else {
                res.json(CreateObjService.response(false, data))

            }

        })
    }

});


router.post('/createFlashCoupon', function(req, res) {
    var data = req.body.flashObj;
    Service.findOne({_id: data.serviceCodes[0].serviceId}, {categoryId : 1, serviceCode : 1} , function(err , categoryId){
        ServiceCategory.findOne({_id: categoryId.categoryId}, {superCategory: 1} , function(err , spCat){
        AllDeals.findOne({"services.serviceCode": categoryId.serviceCode}, {dealId: 1} , function(err , deal){
            SuperCategory.findOne({name: spCat.superCategory} , {_id: 1} , function(err , deptId){
                data.serviceCodes[0].departmentId = deptId._id;
                data.maximumCount = 10;
                data.dealId = deal.dealId
                let ambience = []
                _.forEach(req.body.flashObj.ambience, function(f){
                    if(f.ambienceRating1)ambience.push(1)
                    if(f.ambienceRating2)ambience.push(2)
                    if(f.ambienceRating3)ambience.push(3)
                    if(f.ambienceRating4)ambience.push(4)
                    if(f.ambienceRating5)ambience.push(5)
                })
                data.ambience = ambience
                console.log(data)
                FlashCoupon.create(data, function(err, create) {
                    if (!err) {
                        res.json('done')
                    } else {
                        console.log(err)
                        res.json('error')
                    }
                })
            })
        })
        })
    })
    
});


router.post('/editFlashCoupon', function(req , res){
if(req.body.edit){
        FlashCoupon.update({_id: req.body.couponId} , {parlors : req.body.parlors}, function(err , update){
            res.json('updated')
        })
}else{
    var query = {};
    // if(req.body.flash.length > 0){
    //     query = {_id: {$in : req.body.flash}};
    // }
    FlashCoupon.find(query , function(err , flashCoupons){
        if(flashCoupons)
            res.json(CreateObjService.response(false , flashCoupons))
        else
            res.json(CreateObjService.response(true , 'No Coupons Found'))
    })
}
    
});


/*bankName
contactIdRazorPay
bankBeneficiaryName
accountNo
ifscCode
fundAccountIdRazorPay*/

router.post('/editRoyalityAmount' , function(req, res){
    console.log(req.body)
    if(req.body.edit){
        Parlor.findOne({_id: req.body.parlorId},{name: 1, address2: 1, address: 1, minimumGuarantee: 1, avgRoyalityAmount: 1, mainMinimumGuarantee:1 , threeXModel:1,  holdPayment :1, bankName : 1, contactIdRazorPay : 1,bankBeneficiaryName : 1,accountNo : 1,ifscCode : 1,fundAccountIdRazorPay : 1}, function(err, parlor){
            var updateObj = {avgRoyalityAmount : req.body.avgRoyalityAmount ,threeXModel  : req.body.threeXModel, signUpFees : req.body.signUpFees, signUpFeesReceivedOn : req.body.signUpFeesReceivedOn,  holdPayment :req.body.holdPayment,reverseChargeMultiple:req.body.reverseChargeMultiple};
            console.log(updateObj)
            if(req.body.bankName && req.body.accountNo && req.body.bankBeneficiaryName && req.body.ifscCode){
                if(parlor.contactIdRazorPay){
                    Parlor.addFundAccount(req, parlor, updateObj, function(){
                        res.json('done')
                    })
                }else{
                    Parlor.createRazorPayContactId(parlor.id, parlor.address, parlor.address2, parlor.name, function(contactId){
                        updateObj.contactIdRazorPay = contactId;
                        parlor.contactIdRazorPay = contactId;
                        Parlor.addFundAccount(req, parlor, updateObj, function(){
                            res.json('done')
                        })
                    });
                }
            }else{
                Parlor.update({_id: req.body.parlorId}, updateObj, function(err , update){
                    console.log(err);
                     res.json(update)
                });    
            }
        }).sort({name: 1})
    }else{
        Parlor.find({active : true},{name: 1, address2: 1, address: 1, minimumGuarantee: 1, avgRoyalityAmount: 1, mainMinimumGuarantee:1 , holdPayment :1,threeXModel:1, bankName : 1, contactIdRazorPay : 1,bankBeneficiaryName : 1,accountNo : 1,ifscCode : 1,fundAccountIdRazorPay : 1, signUpFees : 1, signUpFeesReceivedOn : 1,reverseChargeMultiple:1}, function(err, parlors){
            res.json(parlors)
        }) 
    }
});

router.get('/salonSupportReport', function(req, res) {
    var query = {};

    var array = JSON.parse("[" + req.query.month + "]");

    if (req.query.parlorId) query.parlorId = req.query.parlorId;
    if (req.query.month.length> 0) {
        query.usageMonth ={ $in : array }
    };

    if (req.query.year) query.usageYear = req.query.year;

    SalonSupportData.find(query, function(err, salonSupport) {

        if(salonSupport){
            var data = {currentAmountUsage: 0 , currentMonthUsageAllowed: 0, royalityAmount: 0 , supportProvided: 0, projectedRevenue: 0, earlyBirdSupport:0, hrSupport:0, trainingSupport:0, 
                supportTypes: [
                                
                                {
                                    supportCategoryId: "5b07c343885fca10041b35b5",
                                    supportTypeName: "Be U Clients",
                                    supportCategoryName: "Be U Driven Support",
                                    totalUsageAllowed: 0,
                                    previousBalance: 0,
                                    usageThisMonth: 0,
                                },
                                {
                                    supportCategoryId: "5b07c358885fca10041b35b6",
                                    supportTypeName: "Discount",
                                    supportCategoryName: "Salon Driven Support",
                                    totalUsageAllowed: 0,
                                    previousBalance: 0,
                                    usageThisMonth: 0,
                                },
                                 {
                                    supportCategoryId: "5b07c358885fca10041b35b6",
                                    supportTypeName: "Loyalty",
                                    supportCategoryName: "Salon Driven Support",
                                    totalUsageAllowed: 0,
                                    previousBalance: 0,
                                    usageThisMonth: 0,
                                }
                        ]};
            _.forEach(salonSupport , function(sal){
                data.currentAmountUsage += sal.currentAmountUsage;
                data.currentMonthUsageAllowed += sal.currentMonthUsageAllowed;
                data.royalityAmount += sal.royalityAmount;
                data.supportProvided += sal.supportProvided;
                data.projectedRevenue += sal.projectedRevenue;
                data.earlyBirdSupport += sal.earlyBirdSupport;
                data.hrSupport += sal.hrSupport;
                data.trainingSupport += sal.trainingSupport;

                _.forEach(sal.supportTypes , function(supp){
                        if(supp.supportTypeName == "Be U Clients"){
                            data.supportTypes[0].totalUsageAllowed += supp.totalUsageAllowed;
                            data.supportTypes[0].previousBalance += supp.previousBalance;
                            data.supportTypes[0].usageThisMonth += supp.usageThisMonth;
                        }
                        if(supp.supportTypeName == "Discount"){
                            data.supportTypes[1].totalUsageAllowed += supp.totalUsageAllowed;
                            data.supportTypes[1].previousBalance += supp.previousBalance;
                            data.supportTypes[1].usageThisMonth += supp.usageThisMonth;
                        }
                        if(supp.supportTypeName == "Loyalty"){
                            data.supportTypes[2].totalUsageAllowed += supp.totalUsageAllowed;
                            data.supportTypes[2].previousBalance += supp.previousBalance;
                            data.supportTypes[2].usageThisMonth += supp.usageThisMonth;
                        }
                })
            })

        res.json(CreateObjService.response(false, data));

        } else{
            res.json(CreateObjService.response(false, 'no data found'));
    
        }
    })

});


router.post('/newCustomersDetail' , function(req , res) {
    User.aggregate([
        {$match : {
            createdAt : {$gte: HelperService.getDayStart(req.body.startDate) , $lt : HelperService.getDayEnd(req.body.endDate)},
            phoneVerification:1
            }
        }] , function(err, users){
        var d= [];
        console.log("users length",users.length)
        async.each(users , function(u, call){
            var latitude = u.latitude , longitude = u.longitude;
            Appointment.findOne({'client.phoneNumber' : u.phoneNumber , status:3}, {parlorName : 1, 'services.name' : 1, appointmentStartTime:1, parlorId: 1},function(err , appt){
                var obj = {
                            userName : u.firstName,
                            userId : u._id,
                            isAllotedToSubscriptionTeam : u.isAllotedToSubscriptionTeam,
                            marketingSource : u.marketingSource,
                            phoneNumber : u.phoneNumber,
                            isAppUser : (u.firebaseId || u.firebaseIdIOS) ? 'Yes' : 'No',
                            firstApptDate : '',
                            userCreatedDate : u.createdAt.toDateString(),
                            originalDate : u.createdAt,
                            isSubscriber : (u.subscriptionId == 1 || u.subscriptionId == 2) ? (u.subscriptionId == 1 ? 'GOLD' : 'SILVER') : 'NO',
                            apptServices : [],
                            apptSalonName : '',
                            freeService : (u.freeServices.length > 0) ? u.freeServices[0].name : 'No Freeservice',
                        };
                if(appt){
                    var cityName = "";
                    Parlor.findOne({_id: appt.parlorId}, {geoLocation :1} , function(err , parlor){
                        if(latitude == 0 || latitude == null){
                            latitude = parlor.geoLocation[1];
                            longitude = parlor.geoLocation[0];
                        }
                        var cityId = ConstantService.getCityId(latitude , longitude);
                       if(cityId == 1){
                            var finalCityId = ConstantService.getGurgaonCityId(latitude , longitude);
                            if(finalCityId == 1) cityName = "Delhi";
                            else if(finalCityId == 12) cityName = "Ghaziabad";
                            else cityName = "Gurgaon"
                       } else if(cityId == 2){
                            var yehlankaCityId = ConstantService.getYehlankaCityId(latitude , longitude);
                            if(yehlankaCityId == 2) cityName = "Bengaluru";
                            else cityName = "Yelahanka";
                       } else if(cityId == 3){
                            cityName = "Pune"
                       } else if(cityId == 4){
                           cityName = "Patna"
                       }else {
                           cityName = "Dehradun"
                       }
                            obj.firstApptDate = appt.appointmentStartTime.toDateString() ,
                            obj.apptServices = _.map(appt.services , function(a){return a.name}),
                            obj.apptSalonName = appt.parlorName,
                            obj.city = cityName
                        d.push(obj);
                        call();
                    })
                }else{
                    var cityName = "";
                    var cityId = ConstantService.getCityId(latitude , longitude);
                        if(cityId == 1){
                            var finalCityId = ConstantService.getGurgaonCityId(latitude , longitude);
                            if(finalCityId == 1) cityName = "Delhi";
                            else if(finalCityId == 12) cityName = "Ghaziabad";
                            else cityName = "Gurgaon"
                       } else if(cityId == 2){
                            var yehlankaCityId = ConstantService.getYehlankaCityId(latitude , longitude);
                            if(yehlankaCityId == 2) cityName = "Bengaluru";
                            else cityName = "Yelahanka";
                       } else if(cityId == 3){
                            cityName = "Pune"
                       } else if(cityId == 4){
                            cityName = "Patna"
                        } else {
                            cityName = "Dehradun"
                        }
                        obj.city = cityName;
                         if(cityId == 1){
                        
                       }
                        d.push(obj);
                        call();
                }
            })
        }, function allTaskCompleted(){
             d.sort(function(a, b){
                var keyA = new Date(a.originalDate),
                    keyB = new Date(b.originalDate);
                // Compare the 2 dates
                if(keyA < keyB) return -1;
                if(keyA > keyB) return 1;
                return 0;
            });
            res.json(d)
        })
    })
});

router.post('/createWebsiteQueryByCustomerCare', function(req, res){
    Beu.findOne({_id : req.session.userId}, function(err, beu){
        WebsiteQuery.create({name : req.body.name, phoneNumber : req.body.phoneNumber, customerCareName : beu.firstName, customerCareId : beu.id}, function(err, w){
            res.json('done')
        })
    })
})

router.post('/latestAppointmentDetail' , function(req , res) {
        Parlor.find({active: true},{_id: 1}, function(err , parlors){
            var parlorIds = _.map(parlors, function(p){ return ObjectId(p._id)});
            Appointment.aggregate([{$match : {parlorId: {$in : parlorIds}, status : {$in :[1,3,4]} ,paymentMethod: {$ne : 5},$or: [{createdAt : {$gte: HelperService.getDayStart(req.body.startDate) , $lt : HelperService.getDayEnd(req.body.endDate)}} , 
                            {appointmentOriginalStartTime : {$gte: HelperService.getDayStart(req.body.startDate) , $lt : HelperService.getDayEnd(req.body.endDate)}}]}},
             {$project : {'services.name': 1, 'client.name' :1 , 'client.phoneNumber': 1, bookingMethod: 1, couponCode: 1, payableAmount: 1,subscriptionAmount: 1, loyalityPoints: 1, paymentMethod: 1, loyalitySubscription: 1,
               paymentMethod: 1, createdAt: 1, parlorName: 1, status:1, appointmentStartTime: 1,marketingSource:1 }}],function(err , appoitments){
                var d= [];
                async.each(appoitments , function(appt, call){
                    User.findOne({phoneNumber : appt.client.phoneNumber},{firebaseId: 1, firebaseIdIOS: 1, freeServices: 1, subscriptionId: 1} , function(err , u){
                        WebsiteQuery.findOne({phoneNumber : appt.client.phoneNumber}, function(err , contacted){
                            FacebookQuery.findOne({phoneNumber:appt.client.phoneNumber,subscriptionTeam:{$exists:true}},function(err,fq){
                                console.log(fq)
                                var date = appt.appointmentStartTime.toString();
                                var obj = {
                                    userName : appt.client.name,
                                    phoneNumber : appt.client.phoneNumber,
                                    isAppUser : ( u && (u.firebaseId == null || u.firebaseIdIOS == null)) ? 'No' : 'Yes',
                                    apptFrom : (appt.bookingMethod == 2) ? 'App Booking' : (appt.couponCode ? 'Nearbuy' : ((appt.bookingMethod == 1) ? 'CRM' : '')),
                                    payableAmount : appt.payableAmount,
                                    contacted : (contacted) ? 'Yes ('+contacted.createdAt.toDateString()+') '+contacted.customerCareName+'' : 'No',
                                    subscriptionAmount : appt.subscriptionAmount,
                                    totalLoyalty : appt.loyalityPoints,
                                    subscriptionLoyality : appt.loyalitySubscription,
                                    paymentmethod : (appt.paymentMethod == 5) ? 'Online' : ((appt.paymentMethod == 1) ? 'Cash' : 'Card'),
                                    apptDate :  date.substring(0, date.indexOf('GMT')),
                                    appointmentCreatedDate : appt.createdAt.toDateString(),
                                    originalDate : appt.createdAt,
                                    isSubscriber : ( u && (u.subscriptionId == 1 || u.subscriptionId == 2)) ? (u.subscriptionId == 1 ? 'GOLD' : 'SILVER') : 'NO',
                                    apptServices :  _.map(appt.services , function(a){return a.name}) ,
                                    apptSalonName :  appt.parlorName,
                                    source: appt.marketingSource?appt.marketingSource.source:"Static",
                                    freeService : ( u && (u.freeServices.length > 0)) ? u.freeServices[0].name : 'No Freeservice',
                                    apptStatus : (appt.status == 3) ? 'COMPLETED' : ((appt.status == 1 || appt.status == 4) ? 'BOOKED' : ((appt.status == 2) ? 'CANCELLED' : 'IN-CART')),
                                    alloted : fq ? true:false 
                                };
                                d.push(obj);
                                call();
                            })
                            
                        })
                    })
                }, function allTaskCompleted(){
                     d.sort(function(a, b){
                        var keyA = new Date(a.originalDate),
                            keyB = new Date(b.originalDate);
                        // Compare the 2 dates
                        if(keyA < keyB) return -1;
                        if(keyA > keyB) return 1;
                        return 0;
                    });
                    res.json(d)
                })
            })
        })
});


router.post('/regenerateSettlementInvoice' , function(req , res) {
    var invoiceNo = req.body.invoiceNumber;
    var month = req.body.month;
    SettlementMonthlyInvoice.remove({invoiceNumber : invoiceNo} , function(err , settle){
        SettlementMonthlyInvoice.createInvoice(invoiceNo , month);
    })
});

router.post('/generateSignUpSettlementInvoice' , function(req , res) {
    var type = req.body.type;
    var lastDate = new Date(req.body.date)
    let month = lastDate.getMonth();
    let year = lastDate.getFullYear();
    // month : month, year : year
    SignupYearlyInvoice.count({month : {$gt : 3}}, function(err, count){
        var invoiceNo = count + 1;
        SignupYearlyInvoice.createYearlyInvoice(req, invoiceNo, type, function(data){
            res.json(data)
        });
    })
});

router.post('/getSignUpSettlementInvoice' , function(req , res) {
    SignupYearlyInvoice.find({parlorId : req.body.parlorId}, function(err, data){
        res.json(data)
    });
});

router.post('/deleteSignUpSettlementInvoice' , function(req , res) {
    SignupYearlyInvoice.remove({_id : req.body.invoiceId}, function(data){
        res.json(data)
    });
});

router.post('/paymentLinkSubscription' , function(req, res) {
    SubscriptionSale.paymentLinkSubscription(req, function(obj){
        res.json(obj)
    })
});

router.post('/paymentLinkPaytmSubscription', function(req, res, next) {

    User.findOne({phoneNumber : req.body.phoneNumber}, function(err , user){
        if(user){
            subscriptionFromPaytmPaymentLink(user, req, function(data){
                return res.json(CreateObjService.response(data.status, data.message));
            })
        }else{
             User.find().count(function(err, count) {
                let user = SubscriptionSale.createUserForSubscription({phoneNumber : phoneNumber , emailId: response.email});
                user.customerId = ++count;
                User.create(user, function(err, newUser) {
                    if (err) return res.json(CreateObjService.response(true, 'There is some error'));
                    else {
                        subscriptionFromPaytmPaymentLink(newUser, req, function(data){
                            return res.json(CreateObjService.response(data.status, data.message));
                        })
                    }
                });
            });
        }
    })
});


function subscriptionFromPaytmPaymentLink(user, req, callback){
    console.log(req.body)
    var orderId = req.body.ORDER_ID;
    var checksum = require('../service/paytm/checksum');
    var paramList = {};
    paramList["MID"] = PAYTM_MERCHANT_MID;
    paramList["ORDER_ID"] = req.body.ORDER_ID;
    var returnData = {}
     User.findOne({phoneNumber : req.body.phoneNumber}, function(err , user){
        PaytmPayment.create({phoneNumber : req.body.phoneNumber, userId: user._id, orderId : orderId , status :0 , amount : req.body.amount} , function(err , paytmPayment){
            console.log(err);
            checksum.genchecksum(paramList, PAYTM_MERCHANT_KEY, function(err, result) {

                result["CHECKSUMHASH"] = encodeURIComponent(result["CHECKSUMHASH"]);
                var finalstring = "JsonData=" + JSON.stringify(result);
                
                var SERVER = "https://secure.paytm.in/oltp/HANDLER_INTERNAL/getTxnStatus?" + finalstring
                request({
                    url: SERVER, //URL to hit
                    method: 'POST',
                }, function(error, response, body) {
                    if (error) {
                        console.log(error);
                    } else {
                        var response = JSON.parse(body);
                        if (response.STATUS && response.STATUS == 'TXN_SUCCESS' && parseInt(response.TXNAMOUNT) >= 1) {
                            PaytmPayment.findOne({ orderId: response.ORDERID }, function(err, tr) {
                                if (tr) {
                                    var couponCode = ""
                                    if(req.body.code)couponCode = req.body.code
                                    PaytmPayment.update({ orderId: response.ORDERID }, { status: 1, paymentResponse: response }, function(er, f) {
                                        response.id = response.ORDERID;
                                        var subscriptionId = (response.amount == 899) ? 2: 1;
                                        SubscriptionSale.createSubscriptionAppointment("594a359d9856d3158171ea4f", subscriptionId, response.TXNAMOUNT, response, 2, user, 5, function(err , d){
                                            Appointment.addSubscriptionToUser(null, tr.userId, new Date(), response, parseInt(response.TXNAMOUNT), couponCode , 'default', function(re) {
                                                returnData.status = false; returnData.message = 'Successfully Activated'
                                                callback(returnData);
                                            });
                                        })
                                    });
                                } else {
                                    returnData.status = true; returnData.message ='Invalid Order Id'
                                    callback(returnData);
                                }
                            });
                        } else {
                            returnData.status = true; returnData.message = 'Invalid TXN'
                            callback(returnData);
                        }
                    }
                });
            });
        })
    })
}

router.post('/salonSupportMonthWise' , function(req, res){
    var match = {};
    
        if(req.body.cityId)match.cityId = req.body.cityId;
        if(req.body.active == 'true')match.active = true;
        else if(req.body.active == 'false')match.active = false;
    
        SalonSupportData.aggregate([{$match : match},
                    {$project : {parlorId:1, usageMonth : 1, usageYear:1 , parlorName:1, cityId: 1, royalityAmount: 1,trainingSupport:1, hrSupport:1,earlyBirdSupport:1,
                                'supportTypes.supportTypeName' : 1, 'supportTypes.usageThisMonth':1 , 'supportTypes.budget' : '$royalityAmount'}},
                    {$group: {_id: {month : '$usageMonth' , year : '$usageYear'} ,month : {$first : '$usageMonth'} ,year : {$first : '$usageYear'},
                                parlorIdData : {$push : {parlorId : "$parlorId" ,parlorName: "$parlorName" ,trainingSupport:"$trainingSupport", hrSupport:"$hrSupport",earlyBirdSupport:"$earlyBirdSupport",supportData : '$supportTypes'}}}},
                    {$sort : {month : -1}},
                    {$project:{month: 1 , year : 1, parlorIdData: 1 , _id: 0 , parlorName:1} },
                    {$unwind:'$parlorIdData' },
                    {$group : {_id: "$parlorIdData.parlorId" ,parlorName:{$first: '$parlorIdData.parlorName'},
                                monthData:{$push :{usageMonth : '$month',usageYear : '$year', supportData : '$parlorIdData.supportData',trainingSupport:"$parlorIdData.trainingSupport", hrSupport:"$parlorIdData.hrSupport",earlyBirdSupport:"$parlorIdData.earlyBirdSupport",}}}}
            ], function(err , agg){
               
                res.json( agg)
            })
})

router.post('/createHrSupportData' , function(req, res){
    var hrData = req.body;
    HrSupportData.create(hrData, function( err , data){
        return res.json(CreateObjService.response(false, 'Successfully Created'));
    });
});

router.post('/SettlementMonthlyInvoice' , function(req, res) {

    SettlementMonthlyInvoice.findOne( {month:req.body.month,parlorId:req.body.parlorId},function(err,invoice){
        var invoiceNumber = req.body.invoiceNumber;
        if(invoice){
             SettlementMonthlyInvoice.remove({ _id: invoice._id }, function(err, rem) {
             if (err) {
                res.json(CreateObjService.response(true, "Error"))
             } else {

             SettlementMonthlyInvoice.createInvoice( invoice.month, req.body.parlorId, req.body.managementFee, req.body.onlinePaymentFee, req.body.onlinePaymentFeeExempt,invoiceNumber, function(callback){
                    res.json('updated');
                });
            }
         })
        }else{
             SettlementMonthlyInvoice.createInvoice( req.body.month, req.body.parlorId, req.body.managementFee, req.body.onlinePaymentFee, req.body.onlinePaymentFeeExempt, null, function(callback){
                    res.json('updated');
                });
        }
    })

   
});


router.post('/getTrainingData' , function(req, res) {
    var query = {};
    if(req.body.parlorIds)query.parlorId = {$in : req.body.parlorIds}
    if(req.body.startDate)query.trainingDate = {$gte: HelperService.getDayStart(req.body.startDate) , $lt : HelperService.getDayEnd(req.body.endDate)};
    TrainingSession.find(query ,{trainerName: 1, parlorName: 1, trainingDate: 1, chapterName: 1, subCategoryName: 1, superCategoryName: 1}, function(err , data){
       return res.json(CreateObjService.response(false , data));
    })
});


router.post('/salonPassPayments' , function(req, res){
    SalonPassPayments.find({}, function(err , salonPassPayments){
        var data = []
        _.forEach(salonPassPayments, function(sp){
            var d= {
                phoneNumber : sp.phoneNumber,
                status : sp.status == 0 ? "Salon Not Created" : "Salon Created",
                createdAt : sp.createdAt.toDateString(),
                emailId : sp.emailId,
                otp : sp.otp,
            }
            data.push(d)
        })
        return res.json(CreateObjService.response(false , data))
    })
});


router.post('/affiliateSalonAppointments' , function(req, res){
    Parlor.find({active: true , parlorType : 4} , {_id: 1}, function(err , parlors){
        var parl = _.map(parlors , function(p){return p._id})
        Appointment.find({parlorId: {$in : parl},status:{$in:[1,3]} },{'client.name' :1, 'client.phoneNumber' :1, payableAmount :1, 'services.name' :1 , status : 1, loyalitySubscription :1, loyalityPoints : 1, appointmentStartTime:1, parlorName:1, paymentMethod:1 , serviceRevenue:1}).sort({appointmentStartTime :-1}).exec(function(err , appts){
            if(appts){
            var data = [];
            _.forEach(appts , function(a){
                 var arr = {
                    clientName : a.client.name,
                    clientPhoneNumber : a.client.phoneNumber,
                    payableAmount : a.payableAmount,
                    services : _.map(a.services , function(ser){return ser.name}),
                    parlorName : a.parlorName,
                    serviceRevenue : a.serviceRevenue ? a.serviceRevenue.toFixed(2) : 0,
                    apptDate : a.appointmentStartTime.toDateString(),
                    status : (a.status == 1 || a.status == 4) ? 'Booked' : (a.status ==2 ? 'Cancelled':(a.status == 0 ? 'In-Cart' : 'Completed')),
                    loyalitySubscription : a.loyalitySubscription.toFixed(2),
                    totalLoyalityPoints : a.loyalityPoints.toFixed(2),
                  
                 };
                 data.push(arr);
            })
                return res.json(CreateObjService.response(false , data));
            } else 
                return res.json(CreateObjService.response(true , "No Appointments found"));
        })
    })
});


router.post('/editOwnerDetails' , function(req, res) {

    if(!req.body.edit){
        Admin.findOne({phoneNumber : req.body.phoneNumber},{phoneNumber :1, emailId : 1 , firstName: 1, lastName:1, parlorIds :1}, function(err , owner){
            
            Parlor.find({_id: {$in  : owner.parlorIds}} , {name: 1 , address2 :1} , function(err , parlors){
                ownerDetail.parlors = _.map(parlors , function(pa){ return pa.name +"-"+ pa.address2});
                return res.json(CreateObjService.response(false , ownerDetail));
            })
        })
    } else {
        Admin.update({phoneNumber : req.body.phoneNumber} , data , function(err , ownerupdated){
            return res.json(CreateObjService.response(false , ownerDetail));
        })
    }
});


router.post('/sendLuckDrawSms' , function(req, res) {
    var luckyDrawDate = HelperService.addDaysToDate(req.body.endDate , 1);
    LuckyDrawDynamic.aggregate([{$match : {createdAt :{$gte: new Date(2018,8,5)}}},
                                {$project :{employeeId :1, status:1 , amount :1}},
                                {$lookup :{from : "owners" , localField :"employeeId" , foreignField : "_id" , as : "employee"}},
                                {$project :{employeeId :"$employeeId", status:"$status" , amount : "$amount" , employeeName :{$arrayElemAt :['$employee.firstName' , 0]},phoneNumber :{$arrayElemAt :['$employee.phoneNumber' , 0]}}}
        ]).exec(function(err , users){
        async.each(users, function(user, callback) {
                    if(user.status == 0){
                        var message = "Hi, "+user.employeeName+" your lucky draw of Rs "+user.amount+" has been processed from Be U. Please check your account details if the amount is not credited in the next 24 hours."
                    }else {
                        var message = "Hi, "+user.employeeName+" your lucky draw amount of Rs "+user.amount+" has been cancelled as it was not claimed on time."
                    }

            var url = "http://api.msg91.com/api/sendhttp.php?sender=BEUSLN&route=4&mobiles=" +user.phoneNumber+ "&authkey=164034A93iTmJcMu595dd01d&country=91&message=" + message + "";

            console.log(url);
            callback();
            // request(url, function(error, response, body) {
            //     console.log(error)
            //     if (error == null) {
                    
            //         callback();
            //     } else {
            //         callback();
            //     }
            // });
            // }
        }, function allTaskCompleted() {

                res.json("done")

        })
    })
});


router.post('/updateUserContacted' , function(req, res){
    User.update({phoneNumber : req.body.phoneNumber} , {contactedForUserQuestions : true}, function( err , contacted){
        return res.json(CreateObjService.response(false , "Updated Successfully"))
    });
})

router.get('/userQuestionAnswers' , function(req, res){

    UserQuestionAnswers.find({},{question:1,questionCategory:1, answers:1}, function(err , ques){
        let questions = ques.map(a => a.question);
        User.find({$and : [{contactedForUserQuestions : false},{questionAnswers : {$exists : true}} ,{questionAnswers : {$ne : []}}]},{firstName:1, phoneNumber:1, questionAnswers:1}, function(err , users){
            var userData  = [];
            _.forEach(users , function(user ){
                var userObj = {firstName: user.firstName , phoneNumber : user.phoneNumber , ques : []}
                _.forEach(ques , function(q){
                    let isAnswererd = false;
                    let indexValue;
                    let checkArray = q.answers.map(a => a._id.toString());
                    _.forEach(user.questionAnswers , function(uQues){
                        if(uQues.questionId.toString() == q._id.toString()){
                            isAnswererd = true;
                            _.forEach(uQues.answers , function(userAns){
                                if(checkArray.indexOf(userAns.toString()) > -1) indexValue = checkArray.indexOf(userAns.toString());
                            })
                        }
                    })
                    if(isAnswererd == true && indexValue > -1)userObj.ques.push(q.answers[indexValue].answer)
                    else userObj.ques.push('Not Answered')
                })
                userData.push(userObj)
            })
            var data  = {questions: questions , answerData : userData}
            return res.json(CreateObjService.response(false , data));
        })
    })

});


router.get('/beuClientAppointmentDetail' ,function(req, res){
    User.aggregate([
            {$match :{firstAppointmentSource:1}},
            {$project : {"phoneNumber" :1}},
            {$lookup : {from : "appointments" , localField : "phoneNumber" , foreignField : "client.phoneNumber", as : 'appts'}},
            {$unwind : '$appts'},
            {$match : {
                'appts.status' : 3, 
                'appts.appointmentStartTime' :{$gte: new Date(2018, 4,1)}
            }},
            {$project : {
                parlorId: '$appts.parlorId',
                parlorName: {$concat :['$appts.parlorName',' - ', '$appts.parlorAddress2']} , 
                appTime:"$appts.appointmentStartTime",
                year: { $year: "$appts.appointmentStartTime" },
                month :{$month : "$appts.appointmentStartTime"},
                revenue : {$add : ['$appts.serviceRevenue' , '$appts.productRevenue']}}},

            {$group: {_id: {month : "$month" , parlorId: "$parlorId"} , parlorName:{$first : "$parlorName"},revenue: {$sum : "$revenue"} , count:{$sum : 1}}},
            {$group : {_id: "$_id.parlorId" , parlorName:{$first : "$parlorName"},monthData : {$push : {month :"$_id.month" ,revenue:{$sum : "$revenue"} , count: {$sum :"$count"}}}}}
        ], function(err , agg){


            return res.json(agg)
        })
})


router.post('/relevanceReportRepeatWise', function(req, res) {

    var d = [];
    var today = new Date();
    var parlorQuery = {};
    console.log(req.body)
    if(req.body.parlorIds && req.body.parlorIds.length > 0){
        parlorQuery = {_id: {$in : req.body.parlorIds}}
    }
console.log("parlorQuery" , parlorQuery)
    Parlor.find(parlorQuery, { _id: 1, geoLocation: 1, name: 1, parlorLiveDate: 1, avgRoyalityAmount : 1, address2: 1, cityId: 1 }, function(err, parlors) {

        async.each(parlors, function(parl, call) {

            Appointment.aggregate([{ $match: { parlorId: ObjectId(parl._id), status: 3, appointmentStartTime: { $gte: HelperService.getDayStart(req.body.startDate), $lte : HelperService.getDayEnd(req.body.endDate)} } },
                { $group: { _id: '$parlorId', totalRevenue: { $sum: '$serviceRevenue' },totalLoyaltyPoints :{$sum : '$loyalityPoints'},subscriptionLoyality : {$sum : "$loyalitySubscription"} } }
            ], function(err, appts) {

        
                Appointment.find({ parlorId: ObjectId(parl._id), status: 3,appointmentStartTime: { $gte: HelperService.getDayStart(req.body.startDate), $lte : HelperService.getDayEnd(req.body.endDate) } }, 

                    {appointmentType :1, productRevenue:1, bookingMethod: 1, latitude: 1, longitude: 1, serviceRevenue: 1, mode: 1, appBooking: 1, appointmentStartTime: 1, client: 1, couponCode: 1,loyalitySubscription:1 }, function(err, distanceAppts) {
                    if (appts && appts.length > 0) {

                        var totalRevenue = appts[0].totalRevenue,
                            totalLoyaltyPoints = 0,
                            distanceRevenue = 0,
                            countOfPeople = 0,
                            days = 0,
                            distanceRevenueFirstTime = 0,
                            appRevenue = 0,
                            appRevenueFirstTime = 0, 
                            distanceRevenuelessThan100 = 0,
                            revenureFromNearBuy = 0;
                        var arr = {};
                        console.log("loyality points",appts[0].totalLoyaltyPoints)
                        if (distanceAppts && distanceAppts.length > 0) {

                            _.forEach(distanceAppts, function(a) {
                                if(a.latitude == null)a.latitude = 0;
                                if(a.longitude == null)a.longitude = 0;

                                if ( a.appointmentType == 3 || a.couponCode || a.mode==5 || a.mode == 7 || a.mode == 9) {

                                    var distance = HelperService.getDistanceBtwCordinates1(parl.geoLocation[1], parl.geoLocation[0], a.latitude, a.longitude)

                                    if ((distance >= 0.05 && a.appointmentType == 3) || a.mode == 5 || a.couponCode || a.mode == 7 || a.mode == 9) {
                                        if(a.loyalitySubscription >0){
                                            totalLoyaltyPoints += 250
                                        }
                                        else totalLoyaltyPoints += a.serviceRevenue
                                        countOfPeople++;
                                        if (a.client.noOfAppointments == 0 || a.couponCode) distanceRevenueFirstTime += a.serviceRevenue
                                    } 
                                    else if ((distance < 0.05 && a.appointmentType == 3)) {
                                        distanceRevenuelessThan100 += a.serviceRevenue
                                        countOfPeople++;
                                    }
                                    appRevenue += a.serviceRevenue;
                                    if (a.client.noOfAppointments == 0 || a.couponCode) appRevenueFirstTime += a.serviceRevenue;
                                    if(a.couponCode)revenureFromNearBuy += a.serviceRevenue;
                                }

                            })


                            var parlorLiveDifference;
                            if (parl.parlorLiveDate) parlorLiveDifference = HelperService.getDaysBetweenTwoDates(parl.parlorLiveDate, new Date())
                            else parlorLiveDifference = HelperService.getDaysBetweenTwoDates(distanceAppts[0].appointmentStartTime, new Date());
                            if (parlorLiveDifference < 30) days = parlorLiveDifference;
                            else days = 30;

                            arr.salonName = parl.name + "-" + parl.address2;
                            arr.distanceRevenue = distanceRevenue;
                            arr.totalRevenue = totalRevenue;
                            arr.countOfPeople = countOfPeople;
                            arr.distanceRevenueFirstTime = distanceRevenueFirstTime;
                            arr.days = days;
                            arr.startDate = HelperService.getDayStart(req.body.startDate);
                            arr.endDate = HelperService.getDayEnd(req.body.endDate);
                           

                        }

                        arr.salonName = parl.name + "-" + parl.address2;
                        arr.avgRoyalityAmount = parl.avgRoyalityAmount;
                        arr.distanceRevenue = distanceRevenue;
                        arr.totalRevenue = totalRevenue;
                        arr.totalLoyaltyPoints = parseInt(totalLoyaltyPoints.toFixed(2));
                        console.log("loyality points", arr.totalLoyaltyPoints)
                        arr.distanceRevenueFirstTime = distanceRevenueFirstTime;
                        arr.countOfPeople = countOfPeople;
                        arr.appRevenue = appRevenue;
                        arr.appRevenueFirstTime = parseInt(appRevenueFirstTime.toFixed(2));
                        arr.days = days;
                        arr.startDate = HelperService.getDayStart(req.body.startDate);
                        arr.endDate = HelperService.getDayEnd(req.body.endDate);
                        arr.cityId = parl.cityId;
                        arr.revenureFromNearBuy = revenureFromNearBuy;
                        d.push(arr)

                        call();
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


router.post('/claimedUnclaimedStatusSalonWiseReport' , function(req, res) {
    LuckyDrawDynamic.aggregate([{$match :{createdAt : {$gte: HelperService.getDayStart(req.body.startDate), $lte: HelperService.getDayStart(req.body.endDate)} }},
            {$group : {_id: "$parlorId" , status : {$push : {status : '$status' , amount : '$amount'}}}}
    ], function(err , luckyDraw){
        var finalData =[];
        async.each(luckyDraw , function(lucky , cb){
            Parlor.findOne({_id: lucky._id}, {name:1, address2 :1} , function(err , parl){
                var obj = {claimed : 0 , unclaimed : 0 , claimedAmount : 0 , unClaimedAmount : 0};
                obj.parlorName = parl.name +' - '+ parl.address2;
                _.forEach(lucky.status , function(ls){
                    if(ls.status == 0 || ls.status == 2 || ls.status == 3){
                        obj.claimed++;
                        obj.claimedAmount += ls.amount;
                    }
                    else {
                        obj.unclaimed++;
                        obj.unClaimedAmount += ls.amount;
                    }
                })

                finalData.push(obj);
                cb();
            })
        }, function all(){
            res.json(finalData)
        })
    })
});



router.post('/claimedUnclaimedStatusEmployeeWiseReport' , function(req, res) {
    console.log(req.body)
    LuckyDrawDynamic.aggregate([{$match :{createdAt : {$gte: HelperService.getDayStart(req.body.startDate), $lte: HelperService.getDayStart(req.body.endDate)} , parlorId: ObjectId(req.body.parlorId)}},
            {$lookup : {from : 'owners' , localField : "employeeId" , foreignField :"_id" , as :"emp"}},
            {$group : {_id: "$employeeId", employeeName : {$first : {$arrayElemAt : ["$emp.firstName",0] }} , 
            parlorId: {$first : "$parlorId"} , status : {$push : {status : '$status' , amount : '$amount'}}}},
            {$group :{_id: "$parlorId" , employees : {$push : {employeeId: "$employeeId" ,name  : '$employeeName',status: "$status"}}}}
    ], function(err , luckyDraw){
        var finalData =[];
        async.each(luckyDraw , function(lucky , cb){
            Parlor.findOne({_id: lucky._id}, {name:1, address2 :1} , function(err , parl){
                var obj = {emp : []};
                obj.parlorName = parl.name +' - '+ parl.address2;

                _.forEach(lucky.employees, function(emp){
                    var newObj ={claimed : 0 , unclaimed : 0, claimedAmount : 0 , unClaimedAmount : 0};
                    newObj.employeeName = emp.name
                    _.forEach(emp.status , function(ls){
                        if(ls.status == 0 || ls.status == 2 || ls.status == 3){
                            newObj.claimed++;
                            newObj.claimedAmount += ls.amount;
                        }
                        else {
                            newObj.unclaimed++;
                            newObj.unClaimedAmount += ls.amount;
                        }
                    })
                    finalData.push(newObj);
                })

                // finalData.push(obj);
                cb();
            })
        }, function all(){
            console.log(finalData)
            res.json(finalData)
        })
    })
});

router.post('/newClientReportOfGurgaonSalons' , function(req, res){
    Parlor.find({active: true , stateName: {$regex : "Haryana"}}, {_id :1, name: 1, address2 :1, parlorType:1}, function(err , parlors){
        var finalData = [];
        async.each(parlors  , function(parl , cb){
            Appointment.aggregate([
                {$match : {
                    parlorId : ObjectId(parl._id) , 
                    'client.noOfAppointments' : 0 , 
                    status :{$in : [1,3]},
                    appointmentType: 3, 
                    createdAt : {$gte: HelperService.getDayStart(req.body.startDate), $lte: HelperService.getDayStart(req.body.endDate)}}
                },
                {$project : {
                    clientName: '$client.name' , 
                    phoneNumber : '$client.phoneNumber' ,
                    payableAmount :1, 
                    status : {$cond: {if: {$eq: ['$status' , 1]} , then : 'Booked' , else : 'Completed'}}, 
                    loyalityPoints:1, 
                    parlorName : {$concat : ['$parlorName' , ' - ', '$parlorAddress2']} , 
                    createdAt : { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }} , 
                    appointmentStartTime : { $dateToString: { format: "%Y-%m-%d", date: "$appointmentStartTime" } }
                }
            }] , function(err, apptData){
                if(apptData.length > 0){
                    _.forEach(apptData, function(a){
                        a.parlorType = parl.parlorType;
                        finalData.push(a)
                    })
                    cb()
                }
                else{
                    finalData.push({
                        parlorName : parl.name+' - '+parl.address2,
                        "payableAmount": 0,
                        "loyalityPoints": 0,
                        "clientName": "-",
                        "phoneNumber": "-",
                        "status": "-",
                        "createdAt": "-",
                        "appointmentStartTime": "-",
                        "parlorType" : parl.parlorType,
                    })
                    cb();
                }
            })
        }, function allDone(){
            res.json(finalData)
        })
    })
})


router.post('/salonWiseCancelledApptDetail' , function(req, res){
    console.log(req.body)
    var match = {
        status:2 , 
        appointmentType :3, 
        appointmentStartTime: {$gte: HelperService.getDayStart(req.body.startDate), $lte : HelperService.getDayEnd(req.body.endDate)}
    };
    var group ={};
    if(req.body.parlorId){
        match.parlorId = ObjectId(req.body.parlorId);
        group = {
            _id: "$client.id" ,
            parlorName : {$first: "$parlorName"}, 
            clientName: {$first: '$client.name'},
            clientPhoneNumber: {$first: '$client.phoneNumber'},
            count: {$sum:1} , 
            revenue : {$sum : "$revenue"}}
    } else {
        group = {
            _id: "$parlorId" ,
            parlorName : {$first: "$parlorName"}, 
            count: {$sum:1} , 
            revenue : {$sum : "$revenue"}}
    }
console.log(match)
    Appointment.aggregate([
            {$match :match}, 
            {$project : {
                parlorId: 1, 
                parlorName : {$concat : ['$parlorName' , ' - ', '$parlorAddress2']} , 
                revenue: {$subtract : ['$subtotal' , {$divide :['$loyalityPoints' ,2]}]} , 
                'client.phoneNumber' :1, 
                'client.name' :1, 
                'client.id' :1}
            },
            {$group : group}
    ], function(err , finalData){
        res.json(finalData);
    });
});


router.post('/cancelledRebookedAppointment' , function(req, res){
    Appointment.aggregate([
            {$match :  {
                parlorId: ObjectId(req.body.parlorId),
                status:2 , 
                appointmentType :3, 
                appointmentStartTime: {$gte: HelperService.getDayStart(req.body.startDate), $lte : HelperService.getDayEnd(req.body.endDate)}}
            }, 
            {$project : {
                parlorId: 1, 
                parlorName : {$concat : ['$parlorName' , ' - ', '$parlorAddress2']} , 
                revenue: {$subtract : ['$subtotal' , {$divide :['$loyalityPoints' ,2]}]} , 
                'client.phoneNumber' : 1, 
                'client.name' : 1, 
                'client.id' : 1,
                appointmentStartTime : 1,
                createdAt :1}
            },
    ], function(err , agg){
        var finalData = [];
        async.each(agg , function(f , cb){
        
            Appointment.findOne({'client.phoneNumber' : f.client.phoneNumber , createdAt :{$gt : f.createdAt} , appointmentType: {$ne : 3}}, function(err, appt){

                if(appt && (appt.status == 1 || appt.status == 3)){
                    finalData.push({phoneNumber : appt.client.phoneNumber , name: appt.client.name , parlor : appt.parlorName , apptDate : appt.appointmentStartTime.toDateString(), rebookCreateDate : appt.createdAt.toDateString(),cancelCreateDate : f.createdAt.toDateString()});
                    cb();
                }
                else cb();
            })
        
        }, function allDone(){

            res.json(finalData);
        })
    });
});


router.post('/addOwnerToSalons' , function(req, res){

    if(req.body.phoneNumber){
        Admin.update({phoneNumber : req.body.phoneNumber, role:7}, {$push : {parlorIds : req.body.parlorId}}, function(err , admin){
            return res.json(CreateObjService.response(false , "Done"));
        })
    }else{
        Admin.find({active: true, role:7},{firstName:1, phoneNumber:1 , parlorIds:1} , function(err , owners){
            var d = [];
            async.each(owners , function(own , call){
                if(own.parlorIds.length>0){
                    var arr = {_id: own._id , phoneNumber: own.phoneNumber, firstName: own.firstName , parlor: []}
                    Parlor.find({_id: {$in : own.parlorIds}}, {name:1 , address2:1}, function(err, parlor){
                        _.forEach(parlor, function(pa){
                            arr.parlor.push(pa.name+' - '+pa.address2);
                        })
                        d.push(arr);
                        call();
                    })
                }else{
                    d.push(own)
                    call();
                }
            }, function all(){
                return res.json(CreateObjService.response(false , d));
            }) 
        })
    }
})


router.post('/changeManagerSalon' , function(req, res){
    if(req.body.phoneNumber){
        Admin.update({phoneNumber : req.body.phoneNumber , role:2}, {parlorId : req.body.parlorId}, function(err , admin){
            return res.json(CreateObjService.response(false , "Done"));
        })
    }else{
        Admin.find({active: true, role:2},{firstName:1, phoneNumber:1 , parlorId:1} , function(err , owners){
           return res.json(CreateObjService.response(false , owners));
        })
    }
})


router.post('/changeEmployeeeSalon' , function(req, res){
    if(req.body.phoneNumber){
        Admin.update({phoneNumber : req.body.phoneNumber}, {parlorId : req.body.parlorId}, function(err , admin){
            return res.json(CreateObjService.response(false , "Done"));
        })
    }else{
        Admin.find({active: true, role: {$nin : [2,7]}},{firstName:1, phoneNumber:1 , parlorId:1} , function(err , owners){
            console.log(err)
           return res.json(CreateObjService.response(false , owners));
        })
    }
})



router.get('/salonDetailsForFinance' , function(req, res) {
    Parlor.find({} , {name: 1, address: 1, address2: 1, active: 1, gstNumber: 1, } , function(err , parlors){
        var finalData = _.map(parlors , function(parl){
            return {
                _id: parl.id,
                name: parl.name+' - '+parl.address2,
                gstNumber: parl.gstNumber,
                status : parl.active == true ? 'ACTIVE' : "IN-ACTIVE"
            }
        });
        return res.json(CreateObjService.response(false, finalData));
    })
})



// router.post('/updateGSTInSettlement' , function(req, res){
//     var uploadData = req.body.data;
//     var d = []; 
//     SettlementReport.findOne({}, function(err , sett){
//         async.each(uploadData , function(data , callback){
//             var gstDeduction = parseInt(data.gstDeduction)
//             SettlementLedger.findOne({parlorId : data.parlorId , period: sett.period}, function(err , ledger){

//                 SettlementLedger.update({parlorId: data.parlorId, period : sett.period} , {gstDeduction : gstDeduction} , function(err , updated){
//                     d.push(updated)
//                     callback();
//                 })
//             })

//         }, function all(){
//             res.json(d.length)
//         })
//     }).sort({$natural:-1})
     
// });



router.post('/subscriptionSaleReportForResale', function(req, res) {
    var finalObject = {}, d = [];
    var query = { createdAt: { $gte: HelperService.getDayStart(req.body.startDate), $lt: HelperService.getDayEnd(req.body.endDate) } }
    
    SubscriptionSale.aggregate([
            { $match: query },
            { $project: { createdAt: 1, userId: 1, price: 1, response: '$response.id' ,subscriptionId:1 , actualPricePaid:1 , couponCode:1 , price:1} },
            { $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "user" } },
            {
                $project: {
                    userId: 1,
                    response: 1,
                    subscriptionId: 1,
                    actualPricePaid: 1,
                    price: 1,
                    clientName: { $arrayElemAt: ["$user.firstName", 0] },
                    phoneNumber: { $arrayElemAt: ["$user.phoneNumber", 0] },
                    gender: { $arrayElemAt: ["$user.gender", 0] },
                    createdAt: 1,
                }
            },
            { $sort: { createdAt: 1 } }
        ],
        function(err, subscriptions) {

            async.each(subscriptions, function(subs, callback) {
                SubscriptionSale.aggregate([
                            {$match :{userId : ObjectId(subs.userId)}},
                            {$group : {_id: '$userId' , count:{$sum :1} , createdAt :{$first : "$createdAt"}}},
                            {$match : {count: {$gt :1}, createdAt: { $gte: HelperService.getDayStart(req.body.startDate), $lt: HelperService.getDayEnd(req.body.endDate) }}}
                ], function(err , renewed){
                var apptDate = HelperService.getCustomStart(subs.createdAt)
                    Appointment.aggregate([{ $match: {  appointmentStartTime: { $gte: HelperService.getDayStart(apptDate) }, 'client.id': ObjectId(subs.userId), status: 3 , loyalitySubscription :{$gt: 0} } },
                        {
                            $project: {
                                tax : 1,
                                // revenue: { $add: ['$serviceRevenue', '$productRevenue'] },
                                year: { $year: "$appointmentStartTime" },
                                month: { $month: "$appointmentStartTime" },
                                date : { '$dateToString': { format: '%d/%m/%Y', date: '$appointmentStartTime' } },
                                'clientId': "$client.id",
                                loyalitySubscription: 1
                            }
                        },
                        { $group: { _id: { clientId: '$clientId', month: "$month", year: "$year" }, tax: { $first: "$tax" }, year: { $first: "$year" }, month: { $first: "$month" },date :{$push : '$date'}, loyalitySubscription: { $sum: "$loyalitySubscription" }, count: { $sum: 1 } } },
                        { $project: { _id: 0, month: "$month", date :"$date", tax :"$tax", year: "$year", loyalitySubscription: {$cond: [{$gt : ['$tax' , 0]}, {$min : [{$multiply : ['$loyalitySubscription' , 1.18]} , 500]}, { $ceil: "$loyalitySubscription" }]}} } ,
                        { $sort: { year: 1, month: 1 } }
                    ], function(err, agg3) {
                        var str = subs.response, clientRevenueTillNow = 0, clientAppointmentTillNow = 0;
                        var res = str.substring(0, 4);
                        
                        subs.subscriptionType = (subs.subscriptionId == 1) ? "Gold" : "Silver";
                        subs.paymentMethod = (res == "cash") ? "Cash Payment" : "Online Payment";
                        subs.totalRedemption = 0;
                        subs.actualPricePaid = subs.actualPricePaid ? subs.actualPricePaid : subs.price; 
                        subs.renewed = (renewed.length>0 && renewed[0].count >1) ? true : false;
                        
                        subs.createdAt = subs.createdAt.toDateString();
                        
                        if (agg3 && agg3.length > 0) subs.clientRevenueTillNow = agg3;
                            _.forEach(agg3 , function(a){ 

                                subs.totalRedemption += a.loyalitySubscription; 
                            })
                        d.push(subs);
                        callback();
                    })
                })
            }, function allTaskCompleted() {

                //d.sort((a, b) => (a.createdAt > b.createdAt) ? 1 : -1)
                finalObject.subscriptions = d;

                return res.json(CreateObjService.response(false, finalObject));
            })
        });
});


router.post('/addSubscriptionValidity' , function(req, res){
    User.findOne({phoneNumber : req.body.phoneNumber}, {subscriptionValidity :1} , function(err , user){
        var newValidity = user.subscriptionValidity + 1;
        if(newValidity == 13){
            User.update({phoneNumber : req.body.phoneNumber}, {subscriptionValidity : newValidity}, function(err , update){
                return res.json(CreateObjService.response(false , 'Validity Updated Successfully'));
            })
        }else{
            return res.json(CreateObjService.response(true , 'You cannot extend more than 13 months!'));
        }
    })
});


router.post('/changeGenderAndFreeService' , function(req, res){
    var now_date = new Date();
    now_date.setMonth(now_date.getMonth() + 3);
    console.log(req.body.phoneNumber)
    User.findOne({phoneNumber : req.body.phoneNumber}, {gender :1} , function(err , user){
        var newGender = "" , newFreeService =[];
        if(user.gender == "F"){
            newGender = "M",
            newFreeService = [{ expires_at: now_date, createdAt: new Date(), categoryId: "58707ed90901cc46c44af27b", serviceId: "58707eda0901cc46c44af2eb", code:  52, dealId: null, parlorId: null, noOfService: 1, price: 300, name:  "Male Hair Cut", description: "Includes blowdry, shampoo and conditioner", discount: 150, source: "download", brandId: "", priceId: 52 }]
        }else {
            newGender = "F",
            newFreeService = [{expires_at: now_date, createdAt: new Date(), categoryId: "58707ed90901cc46c44af279" , serviceId:"59520f3b64cd9509caa273ec" , code: 502, dealId: null, parlorId: null, noOfService: 1, price: 600 , name: "Classic Express Wax", description: "Full Arms + Full Legs + Underarms" , discount:  300, source: "download", brandId:"594b99fcb2c790205b8b7d93", priceId: 502}]
        }
        
        User.update({phoneNumber : req.body.phoneNumber}, {gender : newGender , freeServices : newFreeService}, function(err , update){
            return res.json(CreateObjService.response(false , 'Free-service Updated Successfully'));
        })
       
    })
})


router.post('/addCouponsToUsers', function(req, res){
    if(req.body.phone){
        var now_date = new Date();
        now_date.setMonth(now_date.getMonth() + 1);
            let couponCodeObj = {
                "active" : true,
                "code" : req.body.code,
                "expires_at" : now_date,
                "couponType" : req.body.couponType,
                "createdAt" : new Date()
            }
            if(req.body.parlorId)couponCodeObj.parlorId = req.body.parlorId
        User.update({phoneNumber: req.body.phone}, {$push : {couponCodeHistory : {$each : [couponCodeObj]}}}, function (err , update) {
            if(err)return res.json(CreateObjService.response(true , 'Invalid Input!'));
            else   return res.json(CreateObjService.response(false , ""+req.body.code+" Coupon Added Successfully"));
        })
    }else{
        var availableCoupons = ConstantService.getAvailableCoupons().filter((e)=>{return e.code!='EPAY50'});
        return res.json(CreateObjService.response(false , availableCoupons));
    }
});

router.post('/findAppointment', function (req, res) {
    var query ={}
    if(req.body.appointmentId)query._id = ObjectId(req.body.appointmentId)
    else if(req.body.phoneNumber)query={'client.phoneNumber': req.body.phoneNumber}
        console.log(query)
        Appointment.find(query , function (err, appointments) {
            var data = [];
            _.forEach(appointments, function(app) {
                var arr = {};
                    arr.otp = app.otp
                    arr.status = (app.status == 0) ? 'Not-Visible' : ((app.status == 1 || app.status == 4) ? 'Booked' : (app.status == 2 ? 'Cancelled' : 'Completed')),
                    arr.payableAmount = app.payableAmount,
                    arr.services = _.map(app.services , function(ser){return ser.name}),
                    arr.parlorName = app.parlorName + "-" + app.parlorAddress2,
                    arr.loyalityPoints = app.loyalityPoints,
                    arr.subscriptionLoyalityPoints = app.loyalitySubscription,
                    arr.appointmentStartTime = app.appointmentStartTime.toLocaleString(),
                    arr.subscriptionAmount = app.subscriptionAmount,
                    arr.clientPhoneNumber = app.client.phoneNumber,
                    arr.paymentMethod = (app.appointmentType == 3 && app.paymentMethod == 5) ? 'Online' : ((app.appointmentType == 3 && app.paymentMethod != 5)  ? 'App-cash' : 'Cash')

                data.push(arr)
            })
            return res.json(CreateObjService.response(false , data))
        })
})



router.post('/updatePreviousDue' , function(req, res){
    var uploadData = req.body.data;
    var d = [];
    async.each(uploadData , function(data , callback){
        var updatePreviousDue = parseInt(data.previousDue)
        SettlementReport.update({parlorId: data.parlorId , period : 362} , {previousDue : updatePreviousDue} , function(err , updated){
            d.push(updated)
            callback();
        })

    }, function all(){
        res.json(d.length)
    })
});



router.post('/updateTDSTCS' , function(req, res){
    var uploadData = req.body.data;
    var d = [];
    async.each(uploadData , function(data , callback){
        var updateTDS = parseFloat(data.tds);
        var updateTCS = parseFloat(data.tcs);
        Parlor.findOne({_id: data.parlorId}, {name: 1, address2 :1 , address :1} , function(err , parlor){
            let createObj = {
                    parlorId : parlor._id,
                    parlorName : parlor.name,
                    parlorAddress1 : parlor.address,
                    parlorAddress2 : parlor.address2,
                    monthlyTDS : Math.ceil(updateTDS),
                    monthlyTCS : Math.ceil(updateTCS),
                    month: new Date().getMonth(),
                    year: new Date().getFullYear(),            
                }
            SettlementMonthlyTdsTcs.create(createObj , function(err , tds){
                d.push(tds)
                callback();
                console.log("tds tcs",err)
            })

        })

    }, function all(){
        res.json(d.length)
    })
});


router.post('/holdSettlement', function(req, res) {

    Parlor.update({_id: req.body.parlorId} , {holdPayment : true} , function(err , update){
        SettlementReport.findOne({parlorId: req.body.parlorId , period: req.body.period}, function(err, settlementReport) {
            if (settlementReport) {
                var sDate = settlementReport.startDate
                var eDate = HelperService.getDayEnd(settlementReport.endDate)
                var period = settlementReport.period;
                var parlorId = settlementReport.parlorId;
                SettlementReport.remove({ _id: settlementReport._id }, function(err, data) {
                    SettlementLedger.update({period : period , parlorId : parlorId} , {$pull : {monthWiseDetail : {period : period}}}, function(err , ledgerUpdate){
                        if(ledgerUpdate){
                            SettlementLedger.findOne({parlorId : parlorId , period : period} , function(err , ledger){
                                var ledgerTotalRecoverable = ledger.monthWiseDetail[ledger.monthWiseDetail.length-1].moreAmountToBeAdjusted
                                var ledgerCurrentDue = ledger.monthWiseDetail[ledger.monthWiseDetail.length-1].moreAmountToBeAdjusted

                                SettlementLedger.update({_id: ledger._id} , {totalRecoverable : ledgerTotalRecoverable , currentDue : ledgerCurrentDue , period : period-1}, function(err , updateLedger){ 

                                    Parlor.createSettlementReportv2(sDate, eDate, period, { _id: parlorId }, function(err, data) {
                                        return res.json(CreateObjService.response(false, data));
                                    });
                                })
                            })
                        }
                    })
                });

            } else {
                return res.json(CreateObjService.response(true, "Invalid"));
            }
        });
    })

});


router.get('/getThisMonthProductDiscount' , function(req, res){
    let findMonth = new Date().getMonth() ;
    DisountOnPurchase.find({month : findMonth  , year : new Date().getFullYear() , closing: true }, {parlorName:1 , parlorId :1, discountPaid:1} , function(err , discount){
        if(discount)
            res.json(CreateObjService.response(false , discount))
        else
            res.json(CreateObjService.response(true , "No Data Found"))
    })
});



router.post('/updateProductDiscountInSettlement' , function(req, res){


    let findMonth = new Date(2019, 6, 20).getMonth();
    let thisMonth = (new Date(2019, 6, 20).getMonth()+1) , thisYear = new Date(2019, 6, 20).getFullYear();
    let period = 363



    var uploadData = req.body.data;
    var d = [];
    console.log(uploadData)
    async.each(uploadData , function(data , callback){
        console.log(data.parlorId)
        SettlementReport.findOne({period: period , parlorId: data.parlorId} , function(err , settlement){
                // console.log(settlement)
            if(settlement){
                SettlementReport.update({_id : settlement._id} , {specialPreviousDue : data.balance} , function(err , update){
                    
                    SettlementLedger.findOne({parlorId: data.parlorId, month : thisMonth , year : thisYear} , function(err , ledger){

                        var ledgerUpdateObj = {
                                name : "Product Discount",
                                amountAdjustedInThisSettlement : data.adjustment,
                                amountPaidToSalon : data.discountPaid, 
                                moreAmountToBeAdjusted: data.balance, 
                                netPayableOfThisSettlement : data.discountGenerated,
                                moneySentTime : new Date(),
                                utrNumber: "SENT"
                            };

                        SettlementLedger.update({parlorId : data.parlorId , month : thisMonth, year : thisYear }, {$set : {period : period, currentDue : data.balance , totalRecoverable : data.balance}, $push : {monthWiseDetail :{$each : [ledgerUpdateObj]}}} , function(err, updated){
                            console.log("Ledger Updated")  
                            if(err){
                                console.log("error",err)
                            }else{
                                console.log("updated")
                            }
                            DisountOnPurchase.update({_id: data._id}, {actualAmountPaid : data.discountPaid} , function(err , discountUpdate){

                                callback();
                            })
                        })
                    })
                })
            }else{  
                callback();
            }
        })
    }, function all(){
        res.json(CreateObjService.response(false , "Successfully Updated"))
    })
    
});



router.post('/updateGstInSettlement' , function(req, res){
    let findMonth = new Date().getMonth() ;
    let thisMonth = (new Date().getMonth()) + 1 , thisYear = new Date().getFullYear();

    var uploadData = req.body.data;
    var d = [];
    console.log(uploadData)
    async.each(uploadData , function(data , callback){
        console.log(data.parlorId)
        SettlementReport.findOne({period: 358 , parlorId: data.parlorId} , function(err , settlement){
                // console.log(settlement)
            if(settlement){
                SettlementReport.update({_id : settlement._id} , {specialPreviousDue : data.balance} , function(err , update){
                    
                    SettlementLedger.findOne({parlorId: data.parlorId, month : thisMonth , year : thisYear} , function(err , ledger){
                        var ledgerUpdateObj = {
                                name : "GST Paid",
                                amountAdjustedInThisSettlement : data.adjustment,
                                amountPaidToSalon : data.discountPaid, 
                                moreAmountToBeAdjusted: data.balance, 
                                netPayableOfThisSettlement : data.discountGenerated,
                                moneySentTime : new Date(),
                                utrNumber: "SENT"
                            };

                        SettlementLedger.update({parlorId : data.parlorId , month : thisMonth, year : thisYear }, {$set : {period : 358, currentDue : data.balance , totalRecoverable : data.balance}, $push : {monthWiseDetail :{$each : [ledgerUpdateObj]}}} , function(err, updated){
                            console.log("Ledger Updated")
                                callback();
                        })
                    })
                })
            }else{  
                callback();
            }
        })
    }, function all(){
        res.json(CreateObjService.response(false , "Successfully Updated"))
    })
});



router.post('/transferSubscriptionOfUser' , function(req, res){
    // console.log(req.body)
    User.findOne({phoneNumber : req.body.oldPhoneNumber}, {subscriptionLoyality :1, subscriptionBuyDate :1, subscriptionId:1 , subscriptionValidity :1}, function(err , oldDetails){
        if(oldDetails){
            User.findOne({phoneNumber : req.body.newPhoneNumber}, {subscriptionLoyality :1, subscriptionBuyDate :1, subscriptionId:1 , subscriptionValidity :1}, function(err , newDetails){
                if(newDetails){
                    SubscriptionSale.update({userId : oldDetails._id} , {userId : newDetails._id} , function(err, updateSubs){
                        if(updateSubs){
                            var updateObj = {
                                subscriptionLoyality : oldDetails.subscriptionLoyality, 
                                subscriptionBuyDate : oldDetails.subscriptionBuyDate, 
                                subscriptionId: oldDetails.subscriptionId, 
                                subscriptionValidity : oldDetails.subscriptionValidity
                            }
                            User.update({_id: newDetails._id}, updateObj , function(err , newUserUpdate){
                                if(newUserUpdate){
                                   User.update({_id: oldDetails._id}, {$unset : {subscriptionLoyality :1 , subscriptionBuyDate:1, subscriptionId:1, subscriptionValidity:1} } , function(err , oldUserUpdate){
                                        if(oldUserUpdate){
                                            res.json(CreateObjService.response(false , 'Subscription Transferred Successfully!'))
                                        } else res.json(CreateObjService.response(true , 'Error in Updating Old User!'))
                                    }) 
                                } else res.json(CreateObjService.response(true , 'Error in Updating New User!'))
                            })
                        } else res.json(CreateObjService.response(true , 'Error in Updating Subscription Object!'))
                    })   
                } else res.json(CreateObjService.response(true , 'New User not Found!'))
            })
        } else res.json(CreateObjService.response(true , 'User not Found!'))
    })
});


router.post('/buyOneGetOneSubscription' , function(req, res){
    User.findOne({phoneNumber : req.body.existingSubscriber , subscriptionId: 1} , function(err, existing){
        if(existing){
            User.findOne({phoneNumber : req.body.newSubscriber} , function(err , newUser){
                if(newUser){
                    SubscriptionSale.find({userId: existing._id}).sort({$natural :-1}).exec(function(err , existingSubs){

                        if(existingSubs && existingSubs.length >1){

                            var existingSubscription = existingSubs[0]
                            
                            if(existingSubscription && (existingSubscription.actualPricePaid == 1699 || existingSubscription.actualPricePaid == 1499)){
                                var userUpdate = {
                                    subscriptionId : existing.subscriptionId,
                                    subscriptionLoyality : existing.subscriptionLoyality,
                                    subscriptionBuyDate : new Date(),
                                    subscriptionValidity : existing.subscriptionValidity,
                                    buyOneGetOneSubscriber : true,
                                    buyOneGetOneSubscriberFrom : existing.phoneNumber
                                }
                                User.update({_id: newUser._id}, userUpdate , function(err , userUpdate){
                                    if(userUpdate){
                                        var subsObj = {
                                            userId : newUser._id,
                                            razorPayId : 'BuyOneGetOne'+existingSubscription.razorPayId,
                                            couponCode : 'BUY1GET1',
                                            response : existingSubscription.response,
                                            subscriptionId : existingSubscription.subscriptionId,
                                            createdAt : new Date(),
                                            source : existingSubscription.source,
                                            actualPricePaid : existingSubscription.actualPricePaid,
                                            price : existingSubscription.price,
                                        }

                                        SubscriptionSale.create(subsObj , function(err , createNewSubs){
                                            if(createNewSubs){
                                                Appointment.find({'client.phoneNumber' :  req.body.existingSubscriber, status:3, subscriptionAmount : {$gt : 0} , createdAt:{$gte: HelperService.getDayStart(existing.subscriptionBuyDate)}}, function(err , appointment){
                                                    if(appointment.length == 1){
                                                        Appointment.update({_id: appointment[0]._id} , {payableAmount : (existingSubscription.actualPricePaid * 2)}, function(err , appointmentUpdate){

                                                            res.json(CreateObjService.response(false, 'Subscription added Successfully!'))
                                                        })
                                                    }else res.json(CreateObjService.response(false, 'Error in updating appointment!'))
                                                })
                                       
                                            } else res.json(CreateObjService.response(true, 'Error in adding subscription!'))
                                        })
                                    } else res.json(CreateObjService.response(true, 'Error in updating new user!'))
                                })
                            } else res.json(CreateObjService.response(true, 'Not valid for Buy one Get one!'))

                        } else res.json(CreateObjService.response(true, 'Not a renew customer!'))
                    })
                } else res.json(CreateObjService.response(true, 'This user does not exist!'))
            })
        }
    })
})


router.post('/updateAppointmentLatLongAndType' , function(req, res){
    Appointment.update({_id: req.body.appointmentId}, {$set : {appointmentType :3, bookingMethod : 2, appBooking :2 , latitude : 28.5508015 , longitude: 77.265895}}, function(err , updateAppt){
        if(!err) res.json(CreateObjService.response(false , 'Updated Successfully'))
        else res.json(CreateObjService.response(true , 'Error in Updating'))
    })
})

router.get('/updateAddress', function(req, res){
    QuarterlySalonSupportData.find({}, {parlorId : 1}, function(err, data){
        _.forEach(data, function(d){
            Parlor.findOne({_id : d.parlorId}, {address : 1, address2 : 1}, function(err, parlor){
                QuarterlySalonSupportData.update({_id : d.id}, {address : parlor.address, address2 : parlor.address2}, function(errm , d){
                    console.log("done")
                })
            })
        })
    })
})

router.post('/quarterlySupportData' , function(req, res){
    QuarterlySalonSupportData.find({}, function(err , data){
        if(!err)
            res.json(CreateObjService.response(false , data));
        else
            res.json(CreateObjService.response(true , "There is some error!"));
    })
})


//Customer Care

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

router.post('/facebookQuery', function(req, res) {
    FacebookQuery.find({$and  : [{"appointmentTeam.allotDate" : {$eq : null}}, {"subscriptionTeam.allotDate" : {$eq : null}} ]}).sort({city : -1}).exec(function(er, facebookQueries){
        res.json(facebookQueries)
    })
});

router.post('/facebookQueryByPhoneNumber', function(req, res) {
    Beu.findOne({role : {$in : [10, 13]}, _id : req.body.userId}, {firstName :1 , emailId : 1, phoneNumber  : 1, type : 1, target : 1}, function(err, beu){
        let query = {phoneNumber : {$regex : req.body.phoneNumber}}
        if(beu.type == 2){
            query["subscriptionTeam.customerCareId"] = ObjectId(req.body.userId)
        }else{
            query["appointmentTeam.customerCareId"] = ObjectId(req.body.userId)
        }
        FacebookQuery.find(query).sort({city : -1}).exec(function(er, facebookQueries){
            res.json(facebookQueries)
        })
    })
})

router.post('/customerCareLeadsDashboard', function(req, res) {
    Beu.findOne({role : {$in : [10, 13]}, _id : req.body.userId}, {firstName :1 , emailId : 1, phoneNumber  : 1, type : 1, target : 1}, function(err, beu){
        let data = {
            name : beu.firstName,
            target : beu.target,
            phoneNumber : beu.phoneNumber
        }
        let date = new Date()
        let year = date.getFullYear()
        let month = date.getMonth()
        Async.parallel([
            function(callback){
                let query = {}
                if(beu.type == 2){
                    query["subscriptionTeam.customerCareId"] = ObjectId(req.body.userId)
                    query["subscriptionTeam.allotDate"] = {$gt : HelperService.getCustomMonthStartDate(year, month), $lt : HelperService.getMonthEndDate(year, month)}
                }else{
                    query["appointmentTeam.customerCareId"] = ObjectId(req.body.userId)
                    query["appointmentTeam.allotDate"] = {$gt : HelperService.getCustomMonthStartDate(year, month), $lt : HelperService.getMonthEndDate(year, month)}
                }
                FacebookQuery.count(query, function(er, count){
                    data.thisMonthLeads = count;
                    callback()
                })
            },
            function(callback){
                let query = {}
                if(beu.type == 2){
                    query["subscriptionTeam.customerCareId"] = ObjectId(req.body.userId)
                    query["subscriptionTeam.eligible"] = true
                    query["subscriptionSoldTime"] = {$gt : HelperService.getCustomMonthStartDate(year, month), $lt : HelperService.getMonthEndDate(year, month)}
                }else{
                    query["appointmentTeam.customerCareId"] = ObjectId(req.body.userId)
                    query["appointmentTeam.eligible"] = true
                    query["appointmentBookedDate"] = {$gt : HelperService.getCustomMonthStartDate(year, month), $lt : HelperService.getMonthEndDate(year, month)}
                }
                console.log(query)
                FacebookQuery.find(query, function(er, completedAppointments){
                    let appointmentIds = _.map(completedAppointments, function(c){ return ObjectId(c.appointmentId)})
                    if(beu.type == 3){
                        Appointment.find({_id : {$in : appointmentIds}}, {subtotal : 1}, function(err, sutotals){
                            data.thisMonthCompletedLeads = 0
                            _.forEach(sutotals, function(s){
                                data.thisMonthCompletedLeads += s.subtotal
                            })
                            callback()
                        })   
                    }else{
                        data.thisMonthCompletedLeads = completedAppointments.length
                        callback()
                    }
                })
            },
            function(callback){
                let query = {}
                if(beu.type == 2){
                    query["subscriptionTeam.customerCareId"] = ObjectId(req.body.userId)
                    query["subscriptionTeam.allotDate"] = {$gt : HelperService.getTodayStart(), $lt : HelperService.getTodayEnd()}
                }else{
                    query["appointmentTeam.customerCareId"] = ObjectId(req.body.userId)
                    query["appointmentTeam.allotDate"] = {$gt : HelperService.getTodayStart(), $lt : HelperService.getTodayEnd()}
                }
                FacebookQuery.count(query, function(er, count){
                    data.todaysLeads = count;
                    callback()
                })
            },
            function(callback){
                let query = {status : 1}
                let sortVar;
                if(beu.type == 2){
                    query["subscriptionTeam.customerCareId"] = ObjectId(req.body.userId)
                    sortVar = {"subscriptionTeam.allotDate":-1}
                }else{
                    query["appointmentTeam.customerCareId"] = ObjectId(req.body.userId)
                    sortVar = {"appointmentTeam.allotDate":-1}
                }
                FacebookQuery.find(query).sort(sortVar).exec(function(er, facebookQueries){
                    data.pendingLeads = facebookQueries
                    data.totalPendingLeads = facebookQueries.length
                    callback()
                })
            },
            function(callback){
                let query = {status : {$nin : [1,10]}, isConverted : false, followUpTime : {$lt : HelperService.getTodayEnd()} }
                if(beu.type == 2){
                    query["subscriptionTeam.customerCareId"] = ObjectId(req.body.userId)
                }else{
                    query["appointmentTeam.customerCareId"] = ObjectId(req.body.userId)
                }
                FacebookQuery.find(query, function(er, facebookQueries){
                    data.followUpLeads = facebookQueries
                    data.totalfollowUpLeads = facebookQueries.length
                    callback()
                })
            },
            function(callback){
                let query = {status : {$nin : [1,10]}, isConverted : true}
                if(beu.type == 2){
                    query["subscriptionTeam.customerCareId"] = ObjectId(req.body.userId)
                    query["subscriptionTeam.sharedButNoSubscription"] = true
                }else{
                    query["appointmentTeam.customerCareId"] = ObjectId(req.body.userId)
                    query["appointmentTeam.sharedButNoAppointment"] = true
                }
                FacebookQuery.find(query, function(er, facebookQueries){
                    data.sentButNotCompleted = facebookQueries
                    callback()
                })
            },
            function(callback){
                let query = { isConverted : true}
                if(beu.type == 2){
                    query["subscriptionTeam.customerCareId"] = ObjectId(req.body.userId)
                    query["status"] = 6
                    query["subscriptionSoldTime"] = { $gt : HelperService.getTodayStart(), $lt : HelperService.getTodayEnd()} 
                }else{
                    query["appointmentTeam.customerCareId"] = ObjectId(req.body.userId)
                    query["appointmentBookedDate"] = { $gt : HelperService.getTodayStart(), $lt : HelperService.getTodayEnd()} 
                }
                FacebookQuery.find(query, function(er, completedAppointments){
                    let appointmentIds = _.map(completedAppointments, function(c){ return ObjectId(c.appointmentId)})
                    if(beu.type == 3){
                        Appointment.find({_id : {$in : appointmentIds}}, {subtotal : 1}, function(err, sutotals){
                            data.totalRevenueBooked = 0
                            data.totalTodayRevenueBookedAppointments = sutotals.length
                            _.forEach(sutotals, function(s){
                                data.totalRevenueBooked += s.subtotal
                            })
                            callback()
                        })   
                    }else{
                        data.totalTodayRevenueBookedAppointments = completedAppointments.length
                        data.todayAppointments = completedAppointments
                        callback()
                    }
                })
            },
            function(callback){
                let query = { isConverted : true, appointmentDate : {$gt : HelperService.getTodayStart(), $lt : HelperService.getTodayEnd()} }
                if(beu.type == 2){
                    query["subscriptionTeam.customerCareId"] = ObjectId(req.body.userId)
                }else{
                    query["appointmentTeam.customerCareId"] = ObjectId(req.body.userId)
                }
                FacebookQuery.find(query, function(er, completedAppointments){
                    if(beu.type == 3){
                        let appointmentIds = _.map(completedAppointments, function(c){ return ObjectId(c.appointmentId)})
                        Appointment.find({_id : {$in : appointmentIds}}, {subtotal : 1, client : 1, appointmentStartTime : 1, payableAmount : 1, services : 1, parlorId : 1, parlorName : 1, status : 1}, function(err, appointments){
                            data.todayAppointments = appointments
                            callback()
                        })
                    }else{
                        callback()
                    }
                })
            }
        ], function allDone(){
            res.json(data)
        })
    })
});



router.get('/customerCareMembers', function(req, res) {
    Beu.find({role : {$in : [10, 13]}, active : true, type : req.query.type}, {firstName :1 , emailId : 1}, function(err, beus){
        let data = _.map(beus, function(b){
            return{
                firstName : b.firstName,
                emailId : b.emailId,
                customerCareId : b.id
            }
        })
        res.json(data)
    })
});

router.get('/checkAppointmentAmount', function(req, res) {
    Appointment.aggregate([
        {$match : {"client.phoneNumber" : req.query.phoneNumber, appointmentStartTime : {$gt : HelperService.getBeforeByDay(30)}, status : {$in : [1,3] } }},
        {$project : {subtotal : 1}},
        {$group : {_id : null, total : {$sum : "$subtotal"}}}
    ]).exec(function(err, appointments){
        let total = 0
        console.log("toal",appointments)
        if(appointments.length>0){
            total = appointments[0].total
        }
        res.json(total)
    })
});


router.post('/createNewLeadFacebookQueryFromAppointments', function(req, res) {
    Beu.findOne({_id : req.body.customerCareId}, {firstName : 1, type : 1},  function(err, beu){
        let phoneNumbers = req.body.phoneNumber.constructor === Array ? req.body.phoneNumber : [{phoneNumber : req.body.phoneNumber, name : req.body.name }]
        let message = "Added"
        Async.each(phoneNumbers, function(p, callback){
            let query = {phoneNumber : p.phoneNumber}
            if(beu.type == 3){
                query["appointmentTeam.customerCareId"] = {$exists : true}
            }else{
                query["subscriptionTeam.customerCareId"] = {$exists : true}
            }
            FacebookQuery.findOne(query, function(er, fq){
                if(fq){
                    let name = ""
                    if(beu.type == 3)name = fq.appointmentTeam.customerCareName;
                    else name = fq.subscriptionTeam.customerCareName;
                    message = 'Phone Number Already added for - ' + name;
                    callback()
                }else{
                    FacebookQuery.findOne({phoneNumber : {$regex  : p.phoneNumber}}, function(er, facebookQuerie){
                        let newObj = {name : p.name, phoneNumber : p.phoneNumber, source : "appointment taken"}
                        newObj.subscriptionTeam = {allotDate : new Date(), customerCareName : beu.firstName, customerCareId : ObjectId(beu.id)}
                        if(facebookQuerie){
                            FacebookQuery.update({phoneNumber : {$regex  : p.phoneNumber}},{subscriptionTeam:newObj.subscriptionTeam},function(err,updated){
                                console.log('updated')
                                callback()
                            })
                        }else{
                            User.findOne({phoneNumber : newObj.phoneNumber}, {subscriptionId : 1}, function(er, user){
                                if(user && !user.subscriptionId){
                                    FacebookQuery.create(newObj, function(erm, f){
                                        //console.log(f)
                                        callback()
                                    })
                                }else{
                                    callback()
                                }
                            })
                        }
                    })   
                }
            })
        }, function allDone(){
            res.json(message)
    })
    })
});


router.post('/createNewLeadFacebookQuery', function(req, res) {
    Beu.findOne({_id : req.session.userId}, {firstName : 1, type : 1},  function(err, beu){
        let phoneNumbers = req.body.phoneNumber.constructor === Array ? req.body.phoneNumber : [{phoneNumber : req.body.phoneNumber, name : req.body.name }]
        let message = "Added"
        Async.each(phoneNumbers, function(p, callback){
                let query = {phoneNumber : p.phoneNumber}
                if(beu.type == 3){
                    query["appointmentTeam.customerCareId"] = {$exists : true}
                }else{
                    query["subscriptionTeam.customerCareId"] = {$exists : true}
                }
                FacebookQuery.findOne(query, function(er, fq){
                    if(fq){
                        let name = ""
                        if(beu.type == 3)name = fq.appointmentTeam.customerCareName;
                        else name = fq.subscriptionTeam.customerCareName;
                        message = 'Phone Number Already added for - ' + name;
                        callback()
                    }else{
                        FacebookQuery.findOne({phoneNumber : {$regex  : p.phoneNumber.slice(-10)}}, function(er, facebookQuerie){
                            let newObj = {name : p.name, phoneNumber : p.phoneNumber, source : "self"}
                            if(beu.type == 3){
                                newObj.appointmentTeam = {allotDate : new Date(), customerCareName : beu.firstName, customerCareId : ObjectId(beu.id)}
                            }else{
                                newObj.subscriptionTeam = {allotDate : new Date(), customerCareName : beu.firstName, customerCareId : ObjectId(beu.id)}
                            }
                            if(facebookQuerie){
                                let updateObj = {appointmentTeam : newObj.appointmentTeam, status : 1, isConverted : false}
                                if(beu.type == 3){
                                    FacebookQuery.update({_id : facebookQuerie.id}, updateObj, function(erm, f){
                                        callback()
                                    })   
                                }else{
                                    message = 'Phone Number Already added for Appointment Team';
                                    callback()
                                }
                            }else{
                                FacebookQuery.create(newObj, function(erm, f){
                                    callback()
                                })
                            }
                        })   
                    }
                })
        }, function allDone(){
            res.json(message)
    })
    })
});

router.post('/updateFacebookQuery', function(req, res) {
    let updateObj = {status : req.body.status, statusString : req.body.statusString, $push : {comments : req.body.comment, statusUpdateHistory : {status : req.body.status, statusString : req.body.statusString, createdAt : new Date(), followUpTime : req.body.followUpTime}}}, sendSms = false;
    if(req.body.appointmentId){
        updateObj.appointmentId = req.body.appointmentId
        updateObj.appointmentBookedDate = new Date()
        updateObj.isConverted = true
    }
    if(req.body.followUpTime){
        updateObj.followUpTime = new Date(req.body.followUpTime)
    }
    if(req.body.appointmentId){
        Appointment.findOne({_id : req.body.appointmentId}, {appointmentStartTime : 1}, function(er,a){
            updateObj.appointmentDate = a.appointmentStartTime
            FacebookQuery.update({_id : req.body.queryId}, updateObj, function(er, f){
                res.json('d')
            })
        })
    }else{
        if(req.body.status == 6){
            updateObj.isConverted = true
            updateObj.subscriptionSoldTime = new Date()
            sendSms = true
        }
        FacebookQuery.findOne({_id : req.body.queryId}, function(er, fq){
            FacebookQuery.update({_id : req.body.queryId}, updateObj, function(er, f){
                if(sendSms){
                    sendSubscriptionSms(fq.name, fq.phoneNumber, req.body.amount, function(url){
                        FacebookQuery.update({_id : req.body.queryId}, {paymentLinkUrl : url}, function(er, f){
                            res.json('d')
                        })
                    })
                }else{
                    res.json('d')
                }
            })
        })
    }
});

router.get('/sendCheckSms', function(req, res){
    sendSubscriptionSms("Robbin Singh", "8826345311", 1, function(){
        res.json('done')
    })
})

function sendSubscriptionSms(name, phoneNumber, amount, callback){
    var request = require('request');
    
    var Razorpay = require('razorpay');
    var instance = new Razorpay({
        key_id: "rzp_live_c8wcuzLEGSGlJ5",
        key_secret: "PRhGBpRE8Udk8IMUTwQFPfW6"
    })


    var reqObj = {
        "customer": {
            "name": name,
            "contact": phoneNumber
        },
        "type": "link",
        "amount": parseInt(amount)*100,
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
            'user': "rzp_live_c8wcuzLEGSGlJ5",
            'pass' : "PRhGBpRE8Udk8IMUTwQFPfW6"
          },
        body : JSON.stringify(reqObj)
    }, function(error, response, body) {
        var paymentUrl = JSON.parse(response.body).short_url;
        callback(paymentUrl)
        // sendSMSValueFirst(reqObj.customer.contact, paymentUrl)
    });
}

router.post('/allotFacebookQuery', function(req, res) {
    console.log("req",req.body)
    Beu.findOne({_id : req.body.customerCareId}, {firstName : 1, type : 1},  function(err, beu){
        let queryIds = _.map(req.body.queryIds, function(q){ return ObjectId(q)});
        let updateObj = {}
        if(beu.type == 3){
            updateObj = {
                appointmentTeam : {
                    allotDate : new Date(),
                    customerCareName : beu.firstName,
                    customerCareId : ObjectId(beu.id),
                }
            }
        }
        if(beu.type == 2){
            updateObj = {
                subscriptionTeam : {
                    allotDate : new Date(),
                    customerCareName : beu.firstName,
                    customerCareId : ObjectId(beu.id),
                }
            }
        }
        FacebookQuery.updateMany({_id : {$in : queryIds}}, updateObj, function(err, d){
            console.log(err)
            console.log(d)
            res.json('done')
        })
    })
});


router.post('/allotToSubscriptionTeamFacebookQuery', function(req, res) {
    console.log("req",req.body)
    Beu.findOne({_id : req.body.customerCareId}, {firstName : 1, type : 1},  function(err, beu){
        let userIds = _.map(req.body.userIds, function(q){ return ObjectId(q)});
        User.find({_id : {$in : userIds}}, {firstName : 1, phoneNumber :1}, function(err, users){
            let data = []
            _.forEach(users, function(u){
                if(beu.type==2){
                    data.push({
                        name : u.firstName,
                        phoneNumber : u.phoneNumber,
                        source : "app download",
                        queryType : 1,
                        subscriptionTeam : {
                            allotDate : new Date(),
                            customerCareName : beu.firstName,
                            customerCareId : ObjectId(beu.id),
                        }
                    })
                }
                if(beu.type==3){
                    data.push({
                        name : u.firstName,
                        phoneNumber : u.phoneNumber,
                        source : "app download",
                        queryType : 1,
                        appointmentTeam : {
                            allotDate : new Date(),
                            customerCareName : beu.firstName,
                            customerCareId : ObjectId(beu.id),
                        }
                    })
                }
            })
            User.updateMany({_id : {$in : userIds}}, {isAllotedToSubscriptionTeam : true}, function(err, d){
                FacebookQuery.create(data, function(er, f){
                    res.json('done')
                })
            })
        })
    })
});

router.post('/sendSmsToUser', function(req, res) {
    Beu.findOne({_id : req.body.customerCareId}, {firstName : 1, type : 1},  function(err, beu){
        FacebookQuery.findOne({_id : req.body.queryId}, function(err, fq ){
            var url = ParlorService.getSMSUrl(null, req.body.message, [req.body.phoneNumber], null), http = require("http"),
                response;
                http.get(url, function(res2) {
                    res2.on("data", function(chunk) {
                        response = chunk;
                    });
                    res2.on("end", function() {
                        let updateObj = {subscriptionTeam : fq.subscriptionTeam}
                        if(beu.type == 3){
                            if(fq.appointmentTeam.messageSent){
                                fq.appointmentTeam.messageSent =  fq.appointmentTeam.messageSent + 1
                            }else{
                                fq.appointmentTeam.messageSent = 1
                            }
                            updateObj = {appointmentTeam : fq.appointmentTeam}
                        }else{
                            if(fq.subscriptionTeam.messageSent){
                                fq.subscriptionTeam.messageSent =  fq.subscriptionTeam.messageSent + 1
                            }else{
                                fq.subscriptionTeam.messageSent = 1
                            }
                        }
                        FacebookQuery.update({_id : req.body.queryId}, updateObj, function(err,m ){
                            res.json('done')
                        })
                    });
                }).on('error', function(e) {
                    return res.json(CreateObjService.response(true, 'Error in sending sms'));
                });

        });
    });
});

router.post('/customerCareResultByMonth', function(req, res) {
    let query = {}, query2 = {}
    let year = req.body.year
    let month = req.body.month
    Beu.findOne({_id : req.body.customerCareId}, {firstName : 1, type : 1},  function(err, beu){
        let sort = {subscriptionSoldTime : 1}
        if(beu.type == 2){
            query["subscriptionTeam.customerCareId"] = ObjectId(req.body.customerCareId)
            query["subscriptionTeam.eligible"] = true
            query["subscriptionSoldTime"] = {$gt : HelperService.getCustomMonthStartDate(year, month), $lt : HelperService.getMonthEndDate(year, month)}
            query2["subscriptionTeam.allotDate"] = {$gt : HelperService.getCustomMonthStartDate(year, month), $lt : HelperService.getMonthEndDate(year, month)}
            query2["subscriptionTeam.customerCareId"] = ObjectId(req.body.customerCareId)
        }else{
            query["appointmentTeam.customerCareId"] = ObjectId(req.body.customerCareId)
            query2["appointmentTeam.customerCareId"] = ObjectId(req.body.customerCareId)
            query["appointmentTeam.eligible"] = true
            query["appointmentBookedDate"] = {$gt : HelperService.getCustomMonthStartDate(year, month), $lt : HelperService.getMonthEndDate(year, month)}
            query2["appointmentTeam.allotDate"] = {$gt : HelperService.getCustomMonthStartDate(year, month), $lt : HelperService.getMonthEndDate(year, month)}
            sort = {appointmentDate : 1}
        }
        console.log(query)
        FacebookQuery.aggregate([
                {$match : query},
                {$project : {createdAt : 1,updatedAt : 1,phoneNumber : 1,city : 1,email : 1,queryText : 1,appointmentDate : 1,appointmentBookedDate : 1,subscriptionSoldTime : 1,appointmentId : 1,followUpTime : 1,subscriptionTeam : 1,statusUpdateHistory : 1,appointmentTeam : 1,comments : 1, name : 1,queryType : 1,isConverted : 1,status : 1,statusString : 1,source : 1
                }},
                {$group : {_id : "$phoneNumber", createdAt : {$first : "$createdAt"}, name : {$first : "$name"}, updatedAt : {$first : "$updatedAt"}, phoneNumber : {$first : "$phoneNumber"}, city : {$first : "$city"}, email : {$first : "$email"}, queryText : {$first : "$queryText"}, appointmentDate : {$first : "$appointmentDate"}, appointmentBookedDate : {$first : "$appointmentBookedDate"}, subscriptionSoldTime : {$first : "$subscriptionSoldTime"}, appointmentId : {$first : "$appointmentId"}, followUpTime : {$first : "$followUpTime"}, subscriptionTeam : {$first : "$subscriptionTeam"}, statusUpdateHistory : {$first : "$statusUpdateHistory"}, appointmentTeam : {$first : "$appointmentTeam"}, comments : {$first : "$comments"}, queryType : {$first : "$queryType"}, isConverted : {$first : "$isConverted"}, status : {$first : "$status"}, statusString : {$first : "$statusString"}, source : {$first : "$source"}, 
                 }},
                 {$sort : sort}
        ])
        .exec(function(er, completedAppointments){
            FacebookQuery.aggregate([
                {$match : query2},
                {$project : {source : 1}},
                {$group : {_id : "$source", count : {$sum : 1}, source : {$first : "$source"}}}
            ]).exec(function(err, counts){
                let appointmentIds = _.map(completedAppointments, function(c){ return ObjectId(c.appointmentId)})
                if(beu.type == 3){
                    Appointment.find({_id : {$in : appointmentIds}}, {createdAt : 1, subtotal : 1, appointmentStartTime :1, "client.id" : 1, "client.name" : 1, "client.phoneNumber" : 1}, function(err, subtotals){
                        _.forEach(completedAppointments, function(c){
                            let a = _.filter(subtotals, function(s){ return s.id + "" == c.appointmentId})[0]
                            c.appointmentDetail = a;
                        })
                        res.json({converted : completedAppointments, count : counts})
                    })   
                }else{
                    res.json({converted : completedAppointments, count : counts})
                }
            })
        })
    })

})

router.post('/customerCareAttemptReport', function(req, res) {
    let d = new Date()
    let data = [],Fdata = [], query
    let NotRe=0,NotIn=0,fUp=0,WDrop=0,Abook=0,newClientAttempt=0,unique=0,SSold=0;
    let date1 = new Date(req.body.sdate), date2 = new Date(req.body.edate)
    let dateArray = HelperService.getDateRangeFromStartAndEndDate(date1,date2)
    let customerCareIds = _.map(req.body.customerCareIds, function(c){ return ObjectId(c)})
    
    Beu.findOne({_id : req.body.customerCareId}, {firstName : 1, type : 1, customerCareTeamMembers : 1},  function(err, beu){
        if(beu.type == 2){
            query ={'subscriptionTeam.customerCareId':{$in : customerCareIds}}  
        }else{
            query = {'appointmentTeam.customerCareId':{$in : customerCareIds}}
        }      
        FacebookQuery.aggregate([
            {$match: query},
            {
                $project:{statusUpdateHistory:1}
            }    
        ],(err,response)=>{
            if(err){
                console.log(err)
            }
            //console.log(response)
            console.log(dateArray)
            Async.each(dateArray,(date,cb1)=>{
                NotRe=0,NotIn=0,fUp=0,WDrop=0,Abook=0,newClientAttempt=0,unique=0,SSold=0
                console.log(date)
                Async.each(response,(r,cb)=>{
                    if(r.statusUpdateHistory){

                        if((r.statusUpdateHistory.filter((e)=>{return HelperService.getDayOfYear(e.createdAt)==HelperService.getDayOfYear(date)})).length>0){
                            unique++;
                        }

                        if(HelperService.getDayOfYear(r.statusUpdateHistory[0].createdAt)==HelperService.getDayOfYear(date)){
                            newClientAttempt++;
                        }

                        NotRe = NotRe+(r.statusUpdateHistory.filter((e)=>{return e.statusString=='Number Not Reachable/Ringing' && HelperService.getDayOfYear(e.createdAt)==HelperService.getDayOfYear(date)})).length

                        NotIn = NotIn+(r.statusUpdateHistory.filter((e)=>{return e.statusString=='Not Interested'&&HelperService.getDayOfYear(e.createdAt)==HelperService.getDayOfYear(date)})).length

                        fUp = fUp+ (r.statusUpdateHistory.filter((e)=>{return e.statusString=='Follow Up'&&HelperService.getDayOfYear(e.createdAt)==HelperService.getDayOfYear(date)})).length
                        
                        WDrop = WDrop+(r.statusUpdateHistory.filter((e)=>{return ((e.statusString=='Whats App Dropped') && HelperService.getDayOfYear(e.createdAt)==HelperService.getDayOfYear(date))})).length

                        Abook = Abook+(r.statusUpdateHistory.filter((e)=>{return (e.statusString=='Appointment Booked'&&HelperService.getDayOfYear(e.createdAt)==HelperService.getDayOfYear(date))})).length

                        SSold = SSold +(r.statusUpdateHistory.filter((e)=>{return (e.statusString=='Subscription Sold'&&HelperService.getDayOfYear(e.createdAt)==HelperService.getDayOfYear(date))})).length
                    }
                    cb()
                },()=>{
                    Fdata.push({
                        date : date,
                        data:{
                            uniqueClient :unique,
                            newClientAttempt : newClientAttempt,
                            followUps : unique-newClientAttempt,
                            notInterested : NotIn,
                            followUp : fUp,
                            numberNotReachable : NotRe,
                            whatsAppDrop : WDrop,
                            appointmentBooked : Abook,
                            subscriptionSold : SSold
                        }
                    })
                    console.log('done')
                    cb1();
                })
            },()=>{
                console.log('End')
                res.json(Fdata)
            })
        })
    })  
});

router.post('/customerCareConversionReport', function(req, res) {
    let data = [], Fdata = [], query;
    let converted=0,linkSent=0,attempted=0;
    console.log(req.body.sdate)
    console.log(req.body.edate)
    let date1 = new Date(req.body.sdate), date2 = new Date(req.body.edate)
    let dateArray = HelperService.getDateRangeFromStartAndEndDate(date1,date2)
    let customerCareIds = _.map(req.body.customerCareIds, function(c){ return ObjectId(c)})
    console.log(dateArray)
    Beu.findOne({_id : req.body.customerCareId}, {firstName : 1, type : 1, customerCareTeamMembers : 1},  function(err, beu){
        if(beu.type == 2){
            query ={'subscriptionTeam.customerCareId':{$in : customerCareIds}}  
        }else{
            query = {'appointmentTeam.customerCareId':{$in : customerCareIds}}
        } 
        FacebookQuery.aggregate([
            {$match: query},
            {
                $project:{statusUpdateHistory:1,subscriptionTeam:1,subscriptionSoldTime:1}
            }    
        ],(err,response)=>{
            Async.each(dateArray,(date,cb1)=>{
                converted=0,linkSent=0,attempted=0
                console.log(date)
                Async.each(response,(r,cb)=>{
                    if(r.statusUpdateHistory){
                       // console.log((r.statusUpdateHistory.filter((e)=>{return HelperService.getDayOfYear(e.createdAt)==HelperService.getDayOfYear(date)})).length)
                        if((r.statusUpdateHistory.filter((e)=>{return HelperService.getDayOfYear(e.createdAt)==HelperService.getDayOfYear(date)})).length>0){
                            attempted++;
                        }

                        if((r.statusUpdateHistory.filter((e)=>{return e.statusString=="Subscription Sold"&&HelperService.getDayOfYear(e.createdAt)==HelperService.getDayOfYear(date)})).length>0){ 
                            linkSent++;
                        }
                    }
                    
                    if(r.subscriptionTeam){
                        if(r.subscriptionSoldTime)console.log(r.subscriptionSoldTime)
                        if((r.subscriptionTeam.isVerified==true&&r.subscriptionTeam.eligible==true)&&HelperService.getDayOfYear(r.subscriptionSoldTime)==HelperService.getDayOfYear(date)){
                            converted++;
                        }
                    }
                    
                    cb()
                },()=>{
                    Fdata.push({
                        date : date,
                        data:{
                            attempted : attempted,
                            linkSent : linkSent ,
                            converted : converted
                        }
                    })
                    console.log('done')
                    cb1();
                })
            },()=>{
                console.log('End')
                res.json(Fdata)
            })
        })    
    })    
    // _.forEach([1,2,3,4,5,6,7,8,9,10], function(e){
    //     data.push({
    //         date : new Date(2019, 6, e),
    //         attempted : 100+(e*10),
    //         linkSent : 70 + (e*5),
    //         converted : 30 + (e*5),
    //     })
    // })
    // return res.json(data)
});


router.post('/customerCareResultForTeamLead', function(req, res) {
    let query = {}, query2 = {}
    let year = req.body.year
    let month = req.body.month
    let customerCareIds = _.map(req.body.customerCareIds, function(c){ return ObjectId(c)})
    Beu.findOne({_id : req.body.customerCareId}, {firstName : 1, type : 1, customerCareTeamMembers : 1},  function(err, beus){
        let sort = {subscriptionSoldTime : 1}
        if(beu.type == 2){
            query["subscriptionTeam.customerCareId"] = {$in : customerCareIds}
            query["subscriptionTeam.eligible"] = true
            query["subscriptionSoldTime"] = {$gt : HelperService.getCustomMonthStartDate(year, month), $lt : HelperService.getMonthEndDate(year, month)}
            query2["subscriptionTeam.allotDate"] = {$gt : HelperService.getCustomMonthStartDate(year, month), $lt : HelperService.getMonthEndDate(year, month)}
        }else{
            query["appointmentTeam.customerCareId"] = {$in : customerCareIds}
            query["appointmentTeam.eligible"] = true
            query["appointmentBookedDate"] = {$gt : HelperService.getCustomMonthStartDate(year, month), $lt : HelperService.getMonthEndDate(year, month)}
            query2["appointmentTeam.allotDate"] = {$gt : HelperService.getCustomMonthStartDate(year, month), $lt : HelperService.getMonthEndDate(year, month)}
            sort = {appointmentDate : 1}
        }
    })
})

module.exports = router;