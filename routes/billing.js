'use strict'
var express = require('express');
var router = express.Router();
var request = require('request');


router.post('/createUser', function(req, res) {
    var user = User.getUserObj2(req);
    User.find().count(function(err, count) {
        user.customerId = ++count;
        User.create(user, function(err, newUser) {
            //sendOfferSms(newUser)
            if (err) return res.json(CreateObjService.response(true, null));
            else {
                return res.json(CreateObjService.response(false, User.parseUserObj(newUser)));
            }
        });
    });
});



router.post('/sendOtpForSubscription', function(req, res) {
    User.findOne({ _id: req.body.userId }, { firstName: 1, subscriptionId: 1, phoneNumber: 1, subscriptionLoyality: 1 }, function(err, user) {
        if (user.subscriptionId) {
            Appointment.findOne({ _id: req.body.appointmentId }, { parlorName: 1 }, function(err, appointment) {
                var subscriptionType = user.subscriptionLoyality == 500 ? "Gold" : "Silver";
                var otp = Math.floor(Math.random() * 9000) + 1000;
                var url = getSmsUrlForOtp("BEUSLN", "Dear " + user.firstName + ", your OTP for transaction via your " + subscriptionType + " Subscription at " + appointment.parlorName + " is " + otp + ". See your detailed transaction history on your app.", [user.phoneNumber], "T", otp, 0),
                    http = require("http"),
                    response;
                request(url, function(error, response, body) {
                    if (error == null) {
                        User.update({ _id: req.body.userId }, { subscriptionOtp: otp }, function(er, f) {
                            return res.json(CreateObjService.response(false, 'Otp Sent!'));
                        })
                    }
                })
            });
        } else {
            return res.json(CreateObjService.response(true, 'Subscription Not Present!'));
        }
    });
});

router.post('/verifyOtpForSubscription', function(req, res) {
    Appointment.findOne({ _id: req.body.appointmentId, loyalitySubscription: 0 }, { appointmentStartTime: 1, loyalitySubscription: 1, subtotal: 1, tax: 1, loyalityPoints: 1, loyalityOffer: 1, paymentMethod: 1 }, function(err, appointment) {
        if (appointment) {
            User.findOne({ _id: req.body.userId }, { subscriptionId: 1, subscriptionOtp: 1, subscriptionLoyality: 1, subscriptionRedeemMonth: 1 }, function(err, user) {
                User.getSubscriptionLeftByMonth(req.body.userId, appointment.appointmentStartTime, user.subscriptionLoyality, function(reed) {
                    var redeemableLoyality = appointment.tax > 0 ? reed/1.18 : reed;
                    console.log(reed);
                    console.log("reed");
                    var pastRedeemed = 0;
                    var currentMonth = HelperService.getCurrentMonthNo();
                    if (user.subscriptionId) {

                        if (redeemableLoyality > 0) {

                            if (req.body.otp == user.subscriptionOtp || req.body.backend) {

                                var updateObj = {};
                                if (!updateObj.$push) updateObj.$push = {};
                                redeemableLoyality = appointment.subtotal - appointment.loyalityPoints > redeemableLoyality ? redeemableLoyality : appointment.subtotal - appointment.loyalityPoints;
                                var obj = {
                                    loyalityOffer: appointment.loyalityOffer + redeemableLoyality,
                                    loyalityPoints: appointment.loyalityPoints + redeemableLoyality,
                                };
                                var taxMultiplier = appointment.tax > 0 ? 1.18 : 1;
                                var payableAmount = Math.ceil((appointment.subtotal - appointment.loyalityPoints - redeemableLoyality) * taxMultiplier);
                                obj.payableAmount = payableAmount;
                                obj.tax = taxMultiplier == 1 ? 0 : ((payableAmount / taxMultiplier) * 0.18);
                                obj.loyalitySubscription = redeemableLoyality;
                                if (appointment.paymentMethod == 5) {
                                    obj.allPaymentMethods = [{ value: 10, name: 'beu', amount: payableAmount }];
                                }
                                updateObj.$push.subscriptionRedeemHistory = {
                                    createdAt: new Date(),
                                    appointmentStartTime: appointment.appointmentStartTime,
                                    appointmentId: appointment.id,
                                    amount: redeemableLoyality,
                                };
                                Appointment.update({ _id: req.body.appointmentId }, obj, function(er, d) {
                                    User.update({ _id: req.body.userId }, updateObj, function(err, f) {
                                        return res.json(CreateObjService.response(false, 'Subscription Used!'));
                                    });
                                });

                            } else {
                                return res.json(CreateObjService.response(true, 'Invalid Otp!'));
                            }
                        } else {
                            return res.json(CreateObjService.response(true, 'Subscription Used For This Month!'));
                        }
                    } else {
                        return res.json(CreateObjService.response(true, 'Subscription Not Present!'));
                    }
                });
            });
        } else {
            return res.json(CreateObjService.response(true, 'Subscription Already Used on this appointment!'));
        }
    });
});


router.post('/login',  function(req, res) {
  var response = {};
  Admin.findOne({phoneNumber : req.body.phoneNumber}).exec(function(err, user){
      if(user){
          if(user.password==req.body.password){
              response.parlorId = user.role == 7 ? user.parlorIds.length > 0 ? user.parlorIds[0] : [] : user.parlorId;
              response.receptionistId = user.id;
              return res.json(CreateObjService.response(false, response));
          }else{
            return res.json(CreateObjService.response(true, 'Invalid password'));
          }
      }else{
            return res.json(CreateObjService.response(true, 'Invalid user'));
      }
      return res.json(response);
  });
});


router.post('/appointment', function(req, res){
  console.log(req.body.services);
    Appointment.registerAppointment(req,function (result) {
        Appointment.addEmployeeToAppointmentServiceFromBillingApp(result.data.appointmentId, result.data.parlorId ,req.body.services, function(d){
            return res.json(result);
        });
    })
});

router.get('/parlorService', function(req, res){
    Parlor.parlorServicesDepartmentWise(true, req.query.parlorId, function(reqServices) {
       Async.each(reqServices, function(departmentByGender, callback) {
              Async.each(departmentByGender.departments, function(department, callback2) {
                    parlorServiceByDepartmentv2(req.query.parlorId, department.departmentId, departmentByGender.gender, function(s){
                        department.services = s;
                        callback2();
                    })
              }, function allTaskCompleted2() {
                      callback();
              });
        }, function allTaskCompleted() {
            Slab.find({}, function(err, slabs){
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
                return res.json(CreateObjService.response(false, {departments : reqServices, slabs : slabs1}));
            })
        });
    });
});


function parlorServiceByDepartmentv2(parlorId, departmentId, gender, cb) {
    var cityId = 1;
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
                Parlor.findOne({ _id: parlorId }, { tax: 1 }, function(err, parlor1) {
                    tax = parlor1.tax;
                    callback2(null);
                });
            },
            function(callback2) {
                SuperCategory.findOne({ _id: departmentId }, function(err, superCategory) {
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
                comboDeals = [], removePackage = false;

            Async.parallel([
                    function(callback) {
                        Service.find({ categoryId: { $in: categoryIds } }, { "prices.brand": 1, id: 1 }, function(s, realServices1) {
                            realServices = realServices1;
                            callback(null);
                        });
                    },
                    function(callback) {
                        AggregateService.parlorService(parlorId, categoryIds, gender, true, function(results1) {
                            results = results1;
                            callback(null);
                        });
                    },
                    function(callback) {
                        Deals.find({ parlorId: parlorId, isDeleted: false, active: 1, 'dealType.name': { $nin: ['combo', 'newCombo'] } }).sort('dealSort').exec(function(err, deals1) {
                            deals = deals1;
                            callback(null);
                        });
                    },
                    function(callback) {
                        AggregateService.dealsByDepartment(gender, categoryIds, parlorId, null, function(comboDeals1) {
                            comboDeals = comboDeals1;
                            callback(null);
                        });
                    }
                ],
                function(err, result2) {
                        comboDeals = ParlorService.parseDealsHomePage(comboDeals, true, cityId);
                        _.forEach(results, function(r) {
                            _.forEach(r.services, function(s) {
                                var rservice = _.filter(realServices, function(resv) { return resv.id + "" == s.serviceId + "" })[0];
                                ParlorService.populateServiceDeals(gender, results, s, deals, rservice);
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
                                s.packages = removePackage ? [] : packageDeals;
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
                                packages: removePackage ? [] : r.packages,
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
                        return cb(categories);
                });
        });
}

router.post('/updateEmployee', function(req, res){
    Parlor.findOne({_id : req.body.parlorId}, {tax : 1} ,function(err, parlor){
      Appointment.addEmployeeToAppointmentServiceFromBillingApp(req.body.appointmentId, req.body.parlorId ,req.body.services, function(d){
          Appointment.findOne({_id : req.body.appointmentId}, function(err, appointment){
                return res.json(CreateObjService.response(false, null));
              // res.json(Appointment.parseSingleAppointmentForApp(appointment, false, parlor.tax));
          })
      });
    });
});

router.post('/changeStatus', function(req, res) {
    Appointment.findOne({_id : req.body.appointmentId}, {parlorId : 1, parlorType : 1, services : 1}, function(er, appt){
        if(appt.parlorType == 4){
            Admin.findOne({$or : [{parlorId : appt.parlorId}, {parlorIds : appt.parlorId}]}, function(err, emp){
                _.forEach(appt.services, function(s){
                    s.employees = [{employeeId : emp.id,dist : 100}]
                })
                Appointment.addEmployeeToAppointmentServiceFromBillingApp(req.body.appointmentId, appt.parlorId ,appt.services, function(d){
                    Appointment.changeStatus(req, function(err, status) {
                        return res.json(CreateObjService.response(false, status));
                    }); 
                })
            })
        }else{
            Appointment.changeStatus(req, function(err, status) {
                return res.json(CreateObjService.response(false, status));
            });        
        }
    })
});

router.post('/changePaymentMethod', function(req, res) {
    Appointment.changePaymentMethod(req, function(err, status) {
        return res.json(CreateObjService.response(false, status));
    });
});

router.post('/user',  function(req, res) {
      User.findOne({ phoneNumber: req.body.phoneNumber }, function(err, user) {

 // User.findOne({ phoneNumber: req.body.phoneNumber, 'parlors.parlorId': req.body.parlorId }, function(err, user) {
      if(user){
          return res.json(CreateObjService.response(false, User.parseUserObj(user)));
      }else{
          return res.json(CreateObjService.response(true, 'Not Found'));
      }
    });
});




router.post('/userName',  function(req, res) {
  User.find({ firstName: {$regex : req.body.substring }, 'parlors.parlorId': req.body.parlorId }).limit(10).exec(function(err, users) {
      if(users.length >0){

        return res.json(CreateObjService.response(false, _.map(users, function(u){ return  User.parseUserObj(u)}) ));

      }else{
        return res.json(CreateObjService.response(true, 'Not Found'));
      }
    });
});

router.post('/currentAppointments',  function(req, res) {
  console.log(req.body.parlorId);
    var queryR = {parlorId : req.body.parlorId, status : {$in : [1, 4]}, "employees.0": { "$exists": true } };
    var perPage = 25;
    var page = req.body.page || 1;
    Appointment.find(queryR).sort({ $natural: -1 }).limit(perPage).skip(perPage * (page - 1)).exec(function(err, data) {
        return res.json(CreateObjService.response(false, Appointment.parseArrayForBillingApp(data)));      
    });
});

router.post('/completedAppointments',  function(req, res) {
    var queryR = {parlorId : req.body.parlorId, status : {$in : [3]}};
    var perPage = 25;
    var page = req.body.page || 1;
    Appointment.find(queryR).sort({ appointmentEndTime: -1 }).limit(perPage).skip(perPage * (page - 1)).exec(function(err, data) {
        return res.json(CreateObjService.response(false, Appointment.parseArrayForBillingApp(data)));      
    });
});

router.post('/unallotedAppointments', function(req, res) {
    var query = {
        parlorId: req.body.parlorId,
        'services.0' :{$exists : true},
        // bookingMethod: { $ne: 1 },
        status: 1,
        $and: [{ "employees.0": { "$exists": false } }, { appointmentType: 3 }]
    };
    Appointment.find(query).sort({ appointmentStartTime: -1 }).exec(function(err, data) {
        if (err) return res.json(CreateObjService.response(true, 'Error in getting previous appointments'));
        else return res.json(CreateObjService.response(false, Appointment.parseArrayForBillingApp(data)));
    });
});


router.post('/employee' , function(req,res){
    var query = { 
        parlorId : ObjectId(req.body.parlorId),
        active:true 
    };

    Admin.aggregate([{$match:query},
            {$unwind:"$categoryIds"},
            {$project:{categoryId :"$categoryIds" , firstName : 1, lastName :1 , employeeId: "$_id"}},
            {$group:{_id:{categoryId:"$categoryId"} , employees:{$push:{employeeId:"$employeeId", name:"$firstName", firstName:"$firstName",lastName:"$lastName"}}}}
            ] , function(err,employees){
              // console.log(employees)
      if (err) return res.json(CreateObjService.response(true, 'Error in getting employee data'));
        else{
          var d= []
          _.forEach(employees, function(a) {
            var obj ={};
            obj.categoryId = a._id.categoryId;
            obj.employees=a.employees
            d.push(obj)
          })
          return res.json(CreateObjService.response(false, d));
        } 
          
    })
});


router.post('/sendSmsOtp', function(req, res) {
  
    Appointment.findOne({ _id: req.body.appointmentId }, { noOfTimeOtpSend: 1 , parlorId :1 , payableAmount :1}, function(err, appointment) {

      var message = req.body.otp + " is the OTP of your transaction for the amount of Rs "+appointment.payableAmount;
    var parlorId = appointment.parlorId;
        if (appointment.noOfTimeOtpSend < 3) {
            var noOfTimeOtpSend = appointment.noOfTimeOtpSend + 1;
            Parlor.findOne({ _id: parlorId }, function(err, parlor) {
                var url = getSmsUrlForOtp(parlor.smscode, message, req.body.numbers, req.body.type, req.body.otp, req.body.retry),
                    http = require("http"),
                    response;
                var calculateSmsCreditToBeUsed = calculateSmsCreditUsed(message, req.body.numbers.length);
                if (calculateSmsCreditToBeUsed < parlor.smsRemaining) {
                    request(url, function(error, response, body) {
                        if (error == null) {
                            Sms.saveSms(parlor, {
                                smsType: req.body.type == "P" ? 2 : 1,
                                creditUsed: calculateSmsCreditToBeUsed,
                                parlorId: req.body.parlorId,
                                phoneNumbers: req.body.numbers,
                                message: message,
                                otp: req.body.otp
                            }, function(err, remains) {
                                Appointment.update({ _id: req.body.appointmentId }, { noOfTimeOtpSend: noOfTimeOtpSend }, function(Er, d) {
                                    return res.json(CreateObjService.response(false, {
                                        smsUsed: calculateSmsCreditToBeUsed,
                                        smsRemaining: remains
                                    }));
                                });
                            });
                        } else {
                            return res.json(CreateObjService.response(true, 'Error in sending sms'));
                        }
                    });
                } else {
                    return res.json(CreateObjService.response(true, 'Not enough SMS Credits, required more = ' + getSMSCreditReqMore(calculateSmsCreditToBeUsed, parlor.smsRemaining)));
                }
            });
        } else {
            return res.json(CreateObjService.response(true, 'Otp Limit Exceeded!'));
        }

    });
});


function getSMSCreditReqMore(credit, smsRemaining) {
    return smsRemaining ? credit - smsRemaining : credit;
}

function calculateSmsCreditUsed(message, noOfPhoneNumbers) {
  console.log("message............",message)
    return Math.ceil(message.length / SMScount) * noOfPhoneNumbers;
}

function getSmsUrlForOtp(messageId, message, phoneNumbers, type, otp, retry) {
    return ParlorService.getSMSUrlForOtp(messageId, message, phoneNumbers, type, otp, retry);
}

module.exports = router;
