
'use strict';


var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var request = require('request');
var USER = {userImage : ''};
var RAZORPAY_KEY = localVar.getRazorKey();
var RAZORPAY_APP_SECRET = localVar.getRazorAppSecret();

var PAYTM_MERCHANT_MID = 'GinSwa65124226602132';  //GINGER09142314726636 - GinSwa65124226602132
var PAYTM_MERCHANT_KEY = 'YxIwf0X&_nsXCR8O';  //n@ahY8JjRettBK@m - YxIwf0X&_nsXCR8O
var PAYTM_INDUSTRY_TYPE = 'Retail109';  //Retail - Retail109

var async = require('async');

let androidVersionNew = '';
let iosVersionNew = '';

router.post('/getAndroidVersion' , function(req, res){
  androidVersionNew = req.body.versionAndroidCode;
  return res.json(CreateObjService.response(false, "updated"));
});


router.post('/getIOSVersion' , function(req, res){
  iosVersionNew = req.body.versionIos;
  return res.json(CreateObjService.response(false, "updated"));
});


router.get('/captureRazorPaymentLink' , function(req, res){
  var Razorpay = require('razorpay');
  var instance = new Razorpay({
          key_id: RAZORPAY_KEY,
          key_secret: RAZORPAY_APP_SECRET
    });
  Appointment.captureRazorPaymentLink(instance, {payment_id :  req.query.payment_id}, function(response){
      res.json(response)
  })
})

router.post('/updateFirebaseId', function(req, res, next) {
    var versionAndroid = req.body.versionAndroid , versionIos = req.body.versionIos;
    var currentAndroidVersion = "1.1.0.24" , currentIosVersion = "2.0.22";
    var showUpdateDialog = true;
    if(versionAndroid == currentAndroidVersion){
        console.log("Android" +versionAndroid)
        showUpdateDialog = false;
    }else if(versionIos == currentIosVersion){
        console.log("IOS" + versionIos)
        showUpdateDialog = false;
    }
    showUpdateDialog = false;
    if(showUpdateDialog == true){
        var userId = req.body.userId;
        sendUpdateNotification(userId);
    }
    var obj = {};
    console.log("fierbase")
    if(req.body.firebaseId){
      obj.androidVersion = req.body.versionAndroid
      obj.firebaseId = req.body.firebaseId
    };
    if(req.body.app == "2"){
      obj = { iosVersion:req.body.versionIos};
      obj.firebaseIdIOS = req.body.firebaseId;
    };
    console.log(obj);
    

    console.log(req.body)
     User.findOne({_id : req.body.userId, accesstoken : req.body.accessToken}, function(err, userWithAccess){
      console.log(userWithAccess)
          var expired = false;
          if(!userWithAccess)expired = true;
          if(userWithAccess){
            obj.campaign = req.body.campaign ? req.body.campaign : userWithAccess.campaign;
            obj.medium = req.body.medium ? req.body.medium : userWithAccess.medium;
            obj.source = req.body.source ? req.body.source : userWithAccess.source;
          }
         User.update({_id : req.body.userId}, obj, function(err, user){
            if(!err){
              MarketingUserNew.find({userId : req.body.userId} , function(err, markUser){
                    if(markUser){
                      MarketingUserNew.update({userId : req.body.userId}, obj, function(err, marketingUpdate){
                            if(!err) return res.json(CreateObjService.response(false, {mess : 'Successfully updated', expired : expired } ));
                            else return res.json(CreateObjService.response(true, {mess : 'User id invalid', expired : expired } ));
                         })
                    }
                    else return res.json(CreateObjService.response(true, {mess : 'User id invalid', expired : expired } ));
                })
            }
            else return res.json(CreateObjService.response(true, {mess : 'User id invalid', expired : expired } ));
         });
    });
});

router.post("/captureEPayLater", function(req, res) {
          var crypto = require('crypto'), algorithm = 'aes-256-cbc', key = '59E17286A2389B2C3F9C5CD3EC1C9831', iv = '7349D67CC4C002F9'
    let epayObj = req.body;
/*
{
    "mCode": "BEUSALONS",
    "marketplaceOrderId": "5c063ea7067e834d8650fc7f",
    "eplOrderId": "638323",
    "amount": "9200.00",
    "currencyCode": "INR",
    "category": "CARE",
    "status": "Success",
    "statusDesc": "Completed successfully",
    "statusCode": "EPL0000"
}
*/
    var decipher = crypto.createDecipheriv(algorithm, key, iv);
    var decrypted = decipher.update(epayObj.encdata, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    decrypted = JSON.parse(decrypted);
    console.log(decrypted)
    if(decrypted.status == "Success"){
      let url = "https://api1.epaylater.in/transaction/v2/"+decrypted.eplOrderId+"/confirmed/"+decrypted.marketplaceOrderId+"?delivered=true";
      request({
            url: url, //URL to hit
            method: 'PUT',
            'Content-Type':'application/json',
            'auth': {
                'bearer': 'secret_ddfd0ad9-3455-4c0b-9b32-27ebec3c27de-fa097417-a3d4-4513'
              }
        }, function(error, re, body) {
            console.log(body);
            console.log(re.body);
            if (error) {
                return res.render('ePayLaterFailure');
            } else {
                Appointment.captureEPayLaterPayment(decrypted.marketplaceOrderId, decrypted, function(response){
                  return res.render('ePayLaterSuccess');
            });
          }
        });
    }else{
        return res.render('ePayLaterFailure');
    }
});


router.get('/capturePayment', function(req, res, next) {
      var Razorpay = require('razorpay');
      var instance = new Razorpay({
          key_id: RAZORPAY_KEY,
          key_secret: RAZORPAY_APP_SECRET
      });
      var obj = {
          razorpay_payment_id : req.query.razorPaymentId,
          bookByApp : 0,
          amount : req.query.amount,
          bookByNewApp : 1,
      };
      Appointment.captureRazorPayment(instance, obj, function(response){
          return res.json(response);
      });
});

router.post('/capturePaytmPayment', function(req, res, next){
  var orderId = req.body.ORDER_ID;
  console.log(orderId);
    var checksum = require('../service/paytm/checksum');
    var paramList = {};
    paramList["MID"] = PAYTM_MERCHANT_MID;
    paramList["ORDER_ID"] = req.body.ORDER_ID;
    checksum.genchecksum(paramList, PAYTM_MERCHANT_KEY, function(err, result) {
        result["CHECKSUMHASH"] = encodeURIComponent(result["CHECKSUMHASH"]);
        console.log(JSON.stringify(result));
        var finalstring = "JsonData=" + JSON.stringify(result);
        console.log(finalstring);
        var SERVER = "https://secure.paytm.in/oltp/HANDLER_INTERNAL/getTxnStatus?"+finalstring
        request({
            url: SERVER, //URL to hit
            method: 'POST',
        }, function(error, response, body) {
            if (error) {
                console.log(error);
                    return res.json(CreateObjService.response(true, 'Invalid ORDERID'));
            } else {
                var response = JSON.parse(body);
                console.log("response");
                console.log(response);
                if (response.STATUS && response.STATUS == 'TXN_SUCCESS' && parseInt(response.TXNAMOUNT) >= 1) {
                    Appointment.capturePaytmPayment(response.ORDERID, response, function(re){
                        return res.json(re);
                    })
                } else {
                    return res.json(CreateObjService.response(true, 'Invalid TXN'));
                }
            }
        });
    });
});

router.post('/selectEmployee', function(req, res, next) {
  console.log("select Employee" , req.body)
    Appointment.findOne({_id : req.body.appointmentId}, {services : 1, parlorId : 1}, function(err, appointment){
        var obj = {services : []};
        var serviceCodes = _.map(appointment.services, function(s){ return s.serviceCode});
        AggregateService.getEmployeeDetailByServiceCode(serviceCodes, appointment.parlorId, function(results){
            var spaDepartmentCategories = ["58707ed90901cc46c44af282","58707ed90901cc46c44af283","58707ed90901cc46c44af281"];
            _.forEach(appointment.services, function(s){
              if(!_.filter(spaDepartmentCategories, function(spa){ return spa == s.categoryId+ ""})[0]){
                  var emp = _.filter(results, function(r){ return r.serviceCode == s.serviceCode})[0];
                  console.log("employee",emp);
                  obj.services.push({
                      serviceCode : s.serviceCode,
                      name : s.name,
                      brandId : s.brandId,
                      productId : s.productId,
                      employees : emp ? _.slice(emp.employees , 0 , 4) : [],
                      // employees : emp ?emp.employees  : [],
                  });
              }
        });
        return res.json(CreateObjService.response(false, obj));
        });
    });
});

router.post('/updateEmployee', function(req, res, next) {
    Appointment.findOne({_id : req.body.appointmentId}, {services : 1, parlorId : 1}, function(err, appointment){
        var employeeIds = _.map(req.body.services, function(s){
            return ObjectId(s.employeeId);
        });
        Admin.find({_id : {$in : employeeIds}}, {firstName : 1}, function(err, realEmployees){
            var employees = [];
            _.forEach(appointment.services, function(s){
                _.forEach(req.body.services, function(rs){
                    if(rs.serviceCode == s.serviceCode && rs.brandId == s.brandId && rs.productId == s.productId){
                        var emp = _.filter(realEmployees, function(re){ return re.id + "" == rs.employeeId})[0];
                        var tempe = {
                            employeeId : rs.employeeId,
                            name : emp.firstName,
                            commission : 0,
                            distribution : 100,
                        };
                        s.employees = [tempe];
                        Appointment.addMainEmployee(employees, tempe, s.price * s.quantity, s.estimatedTime);
                    }
                });
            });
            Appointment.update({_id : appointment.id}, {employees : employees, services : appointment.services ,employeeFromApp: true}, function(err, s){
                return res.json(CreateObjService.response(false, "Done"));
            });
        });
    });
});

router.post('/onGoingAppointmentDetails', function(req, res, next) {
  var salonLiveViewPresent = false;
  Appointment.findOne({_id : req.body.appointmentId}, function(err, appointment){
      Parlor.findOne({_id : appointment.parlorId}, {wifiName : 1,  wifiPassword : 1,name : 1}, function(er, parlor){
          SalonLayout.findOne({parlorId : appointment.parlorId}, {parlorId : 1}).exec(function(err, d){
              InventoryItem.find({itemId : {$in : [2136, 2137]}}, function(er, items){
                  if(d)salonLiveViewPresent = true;    
                  var data = {
                      parlorId : appointment.parlorId,
                      parlorName : parlor.name,
                      appointmentId : req.body.appointmentId,
                      freeWifi: parlor.wifiName != "" ? true : false,
                      wifiName: parlor.wifiName,
                      otp : appointment.otp,
                      isPaid : appointment.isPaid,
                      wifiPassword: parlor.wifiPassword,
                      salonLiveViewPresent : salonLiveViewPresent,
                      serviceTips : [
                        // {
                        //     description : "Do no Wash your hair on the same day",
                        // },
                        // {
                        //     description : "Wash your hair on next day",
                        // }
                      ],
                      products : []
                      /*employeeDetail : {
                        name : "Ashish",
                        noOfAppointmentsDone : 230,
                        rating : 2.4,
                        workingSince : 2009
                      },*/
                      /*products : _.map(items, function(i){
                        return{
                          name : i.name,
                          imageUrl : "http://www.himalayastore.com/images/large/anti-dandruff-shampoo.jpg",
                          detail : "100 ml",
                          price : parseInt(i.sellingPrice * 1.18),
                          menuPrice : 500,
                          itemId : i.itemId,
                        }
                      })*/
                  };
                  return res.json(CreateObjService.response(false, data));
              });
          });
      });
  });
   
});

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log(req.body)
    User.findOne({_id : req.body.userId, accesstoken : req.body.accessToken}, {firstName : 1, isBlocked : 1}, function(err, user){
      if(user && !user.isBlocked){
          next();
      }else{
        return res.sendStatus(403);
      }
    });
});

router.post('/facebookCheckInVerification', function(req, res, next){
      var FB = require('fb'),
      fb = new FB.Facebook({});
      var fbAccessToken = req.body.fbAccessToken;
      User.findOne({_id : req.body.userId}, function(err, user){
          FB.api('me/feed', {access_token: fbAccessToken }, function (response) {
                if(response.data){
                    var present = false, message= '';
                    _.forEach(response.data, function(data, key){
                        if(data.story && key< 6){
                            var s = data.story;
                            console.log(s);
                            var atPosition = s.indexOf('at') + 3;
                            var checkinAt = s.substring(atPosition, s.length).toLowerCase().replace(/ /g,'').indexOf('beusalons');
                            console.log(checkinAt);
                            if(checkinAt != -1){
                              present = true;
                              message = data.story;
                            }
                        }
                    });
                    if(present){
                          if(HelperService.getNoOfDaysDiff(user.fbLastCheckIn, new Date()) > 30 ){
                              var loyalityPoints = user.loyalityPoints ? user.loyalityPoints + 100 : 100;
                              User.update({_id : user.id}, {fbLastCheckIn : new Date(), loyalityPoints : loyalityPoints, $push :{creditsHistory :  {  createdAt: new Date(), amount: 100, balance : loyalityPoints, source : null, reason : 'Facebook Checked In'   }, fbCheckIns : {  createdAt: new Date(), message: message}}} , function(e, u){
                                console.log(e);
                                console.log(u);
                                  return res.json(CreateObjService.response(false, 'Checked In Successfully'));
                              });
                          }else{
                              return res.json(CreateObjService.response(true, 'Already Checked In'));
                          }
                    }else{
                        return res.json(CreateObjService.response(true, 'No Check In Detected'));
                    }
                }else{
                        return res.json(CreateObjService.response(true, 'Invalid fb access token'));
                }
          });
      });
});

router.post('/giftSubscription', function(req, res, next) {
    let referCode = req.body.referCode;
    User.findOne({referCode : referCode, subscriptionId : 1}, {subscriptionId : 1, subscriptionGiftHistory : 1}, function(err, user){
        if(user && user.subscriptionGiftHistory.length<5){
            User.findOne({_id : req.body.userId, $or : [{subscriptionId : 0}, {subscriptionId : {$eq : null}}]}, function(er, user2){
                if(user2){
                    User.update({_id : user.id}, {$push : {subscriptionGiftHistory : {userId : req.body.userId, createdAt : new Date()}}}, function(er, u){
                          Appointment.addSubscriptionToUserForOneMonth("594a359d9856d3158171ea4f", user2.id, new Date(), {id : "GIFT"+user2.id}, 1699, referCode, "GIFT", 0, 1, "",  function(er){
                              return res.json(CreateObjService.response(false, {imageUrl :"https://res.cloudinary.com/dyqcevdpm/image/upload/v1554735021/Claim_subscription_free_service_-_banner_e4gp51.png", buttonText : "Know More"}));
                          })
                    })
                }else{
                    return res.json(CreateObjService.response(true, 'Invalid User'));
                }
            })
        }else{
            return res.json(CreateObjService.response(true, 'Invalid User (Gift)'));
        }
    })
});

router.post('/userServiceAvailable', function(req, res, next) {
    User.findOne({_id : req.body.userId}, {servicesAvailable : 1}, function(err, user){
        var data = [];
        data = _.map(user.servicesAvailable, function(s){
          return ParlorService.parseUserServiceAvailable(s);
        });
        return res.json(CreateObjService.response(false, data));
    });
});

router.post('/membershipDetail', function(req, res, next) {
    User.findOne({_id : req.body.userId}, {freeMembershipServiceAvailed : 1, gender : 1}, function(e, user){
        ActiveMembership.findOne({"members.userId" : req.body.userId, active : true, expiryDate : {$gt : new Date()}}, function(err, m){
            if(m){
                Appointment.find({membershipSaleId : m.id, status : {$in : [1, 4]}, creditUsed : {$gt : 0} }, {creditUsed : 1}, function(err, appts){
                  var t = 0;
                  _.forEach(appts, function(a){
                      t += a.creditUsed;
                  });
                  var reqObj = ActiveMembership.parseForUser(m, user.gender, user.freeMembershipServiceAvailed);
                  reqObj.credits = reqObj.credits - t < 0 ? 0 : parseInt(reqObj.credits - t);
                  reqObj.creditsLeft = reqObj.creditsLeft;
                return res.json(CreateObjService.response(false, reqObj));
              });
            }
            else
              return res.json(CreateObjService.response(true, 'No membership found'));
        });
    });
});

router.post('/addUserToMembership', function(req, res, next) {
  Async.each(req.body.phoneNumber, function(phoneNumber, callback) {
        ActiveMembership.findOne({ _id : req.body.membershipSaleId, userId : req.body.userId , active : true }, function(err, m){
          User.findOne({phoneNumber : phoneNumber}, {firstName : 1}, function(err, user){
              var member = {
                 userId : null,
                 name : '',
                 phoneNumber : phoneNumber,
                 createdAt : new Date(),
                 status : 'Request Sent',
              };
              if(user){
                member.userId = user.id;
                member.name  = user.firstName;
                member.status = "Added";
              }
              if(m && (m.noOfMembersAllowed >= (m.members.length + req.body.phoneNumber.length)) && !_.filter(m.members, function(memMember){return memMember.phoneNumber  == phoneNumber})[0]){
                  ActiveMembership.update({_id : req.body.membershipSaleId}, {$push : {members : member}}, function(e, d){
                      User.update({_id : member.userId}, {activeMembershipId : req.body.membershipSaleId}, function(E, d){
                          callback();
                      });
                  });
              }else callback();
          });
      });
  }, function allTaskCompleted() {
        return res.json(CreateObjService.response(false, 'Updated'));
  });
});

router.post('/availCoupon', function(req, res, next) {
  var loyalityPoints = 0 , hundredPercentRedeemableLoyalityPoints = 0;
    User.findOne({_id : req.body.userId}, function(err, user){

      var couponCode = (req.body.couponCode).toUpperCase().trim();

      var addingLoyalityPoints =0 , newloyalityPoints= 0 , userFinalLoyality = 0, newPayableAmount = 0, newTax = 0;


     FreebiesOffer.findOne({code : couponCode, active : true}, function(err, coupon){
      Appointment.findOne({_id:req.body.appointmentId},function(err,appt){
          if(req.body.couponCode && coupon){
            if(coupon.code.substring(0, 4)=="BULF" || coupon.code.substring(0, 2)=="OC" || coupon.code.substring(0, 2)=="IC" || coupon.code.substring(0, 4)=="SPBU"){

              var limit = (appt.subtotal * coupon.offPercentage / 100);
               addingLoyalityPoints = (limit>500) ? 500 : limit;
               newloyalityPoints = appt.loyalityPoints + addingLoyalityPoints;
               userFinalLoyality = Math.ceil(user.loyalityPoints + addingLoyalityPoints);
               newPayableAmount = (appt.subtotal - newloyalityPoints) * 1.18
               newTax = (appt.subtotal - newloyalityPoints) * 0.18

               var couponCodeHistoryArr=[];
               console.log("addingLoyalityPoints-------------------------" , (appt.subtotal * coupon.offPercentage / 100))
               console.log("newloyalityPoints-------------------------" , (appt.subtotal * coupon.offPercentage / 100))

               couponCodeHistoryArr = user.couponCodeHistory;

               Appointment.update({_id:req.body.appointmentId} ,{tax :newTax, loyalityPoints : newloyalityPoints , payableAmount : newPayableAmount}, function(err,update){
                  if(update){
                    User.update({_id : user.id},{loyalityPoints : userFinalLoyality,
                      $push :{creditsHistory : {  createdAt: new Date(), amount: addingLoyalityPoints, balance : userFinalLoyality, source : appt.id, reason : 'Free bies given by customercare to 90 days customer - ' + coupon.code   } },
                      couponCodeHistory : couponCodeHistoryArr}, function(e, u){
                        return res.json(CreateObjService.response(false, {message : "Coupon Applied Successfully" ,loyalityPoints : loyalityPoints}));
                    })
                  }else{
                    console.log("appt update erreor" ,err)
                  }
              })

                 FreebiesOffer.update({_id : coupon._id}, {active : false , updatedAt : new Date()}, function(err, d){
                  return res.json(CreateObjService.response(false, {message : "Coupon Applied Successfully" ,loyalityPoints : loyalityPoints}));
                    // return res.json(CreateObjService.response(false, {message : 'Freebies updated to ' + loyalityPoints, loyalityPoints : loyalityPoints}));
                });

            } else if(coupon.code =="APPBOOK10" || coupon.code == "APP10"){
              var addingLoyalityPoints=0;
               addingLoyalityPoints = (appt.subtotal * coupon.offPercentage / 100 );
              if(addingLoyalityPoints>100)addingLoyalityPoints =100
              else addingLoyalityPoints

               newloyalityPoints = appt.loyalityPoints + addingLoyalityPoints;
               userFinalLoyality = Math.ceil(user.loyalityPoints + addingLoyalityPoints);
               newPayableAmount = (appt.subtotal - newloyalityPoints) * 1.18
               newTax = (appt.subtotal - newloyalityPoints) * 0.18

              var couponCodeHistoryArr=[];

               couponCodeHistoryArr = user.couponCodeHistory;

               Appointment.update({_id:req.body.appointmentId} ,{tax :newTax, loyalityPoints : newloyalityPoints , payableAmount : newPayableAmount}, function(err,update){
                  if(update){
                    User.update({_id : user.id},{loyalityPoints : userFinalLoyality,
                      $push :{creditsHistory : {  createdAt: new Date(), amount: addingLoyalityPoints, balance : userFinalLoyality, source : appt.id, reason : 'Free bies given by customercare to 90 days customer - ' + coupon.code } },
                      couponCodeHistory : couponCodeHistoryArr}, function(e, u){
                        return res.json(CreateObjService.response(false, {message : "Coupon Applied Successfully" ,loyalityPoints : loyalityPoints}));
                    })
                  }else{
                    console.log("appt update erreor" ,err)
                  }
              })

            } else{
               loyalityPoints = user.loyalityPoints ? user.loyalityPoints + coupon.loyalityPoints : coupon.loyalityPoints;
               hundredPercentRedeemableLoyalityPoints = user.hundredPercentRedeemableLoyalityPoints ? user.hundredPercentRedeemableLoyalityPoints + coupon.hundredPercentRedeemableLoyalityPoints : coupon.hundredPercentRedeemableLoyalityPoints;
                User.update({_id : user.id}, {hundredPercentRedeemableLoyalityPoints : hundredPercentRedeemableLoyalityPoints, loyalityPoints : loyalityPoints,
                  $push :{creditsHistory :  {  createdAt: new Date(), amount: coupon.loyalityPoints, balance : loyalityPoints, source : appt.id, reason : 'Free bies coupon code used - ' + coupon.code   }}
                }, function(e, u){
                    // return res.json(CreateObjService.response(false, {message : 'User updated to ' + loyalityPoints, loyalityPoints : loyalityPoints}));

                    return res.json(CreateObjService.response(false, {message : "Coupon Applied Successfully" , loyalityPoints : loyalityPoints}));
                })
            }
            // if(coupon.code != "APPBOOK10" || coupon.code != "APP10"){

            // }

          }
          // else if(!coupon || req.body.couponCode.substring(0, 4)=="DDDD" || req.body.couponCode.substring(0, 4)=="FIRST"){
          //   console.log("hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
          //   var couponData = HelperService.couponCodeDiscounts(couponCode)
          //      addingLoyalityPoints = (appt.subtotal * couponData.data.offPercentage / 100);
          //      newloyalityPoints = appt.loyalityPoints + addingLoyalityPoints;
          //      userFinalLoyality = Math.ceil(user.loyalityPoints + addingLoyalityPoints);
          //      newPayableAmount = (appt.subtotal - newloyalityPoints) * 1.18
          //      newTax = (appt.subtotal - newloyalityPoints) * 0.18

          //     var creditsHistoryObj = {} ,couponCodeHistoryArr=[];

          //     if(couponCode.substring(0, 4)=="FIRST"){

          //       _.forEach(user.couponCodeHistory,function(uC){

          //         if(uC.code == "FIRSTAPP"){
          //           couponCodeHistoryObj = { active:false , code : uC.code , couponDescription : uC.couponDescription,appointmentId :appt.id, createdAt : uC.createdAt , loyalityPoints : addingLoyalityPoints}
          //           couponCodeHistoryArr.push(couponCodeHistoryObj)
          //        }else couponCodeHistoryArr.push(uC)
          //       })

          //       creditsHistoryObj ={  createdAt: new Date(), amount: addingLoyalityPoints, balance : userFinalLoyality, source : appt.id, reason : 'First App Appointment'}

          //     }else{
          //       couponCodeHistoryArr.push({ createdAt: new Date(), loyalityPoints : addingLoyalityPoints, code: couponCode,appointmentId :appt.id , appointmentId : appt.id , active:false});
          //       creditsHistoryObj = { createdAt: new Date(), amount: addingLoyalityPoints, balance : userFinalLoyality, source : appt.id, reason : 'Free bies given by customercare to 90 days customer - ' + coupon.code};
          //     }
          //     Appointment.update({_id:req.body.appointmentId} ,{tax :newTax, loyalityPoints : newloyalityPoints , payableAmount : newPayableAmount}, function(err,update){
          //       if(update){
          //         User.update({_id : user.id},{loyalityPoints : userFinalLoyality, $push :{creditsHistory : creditsHistoryObj },couponCodeHistory : couponCodeHistoryArr}, function(e, u){
          //             return res.json(CreateObjService.response(false, {message : "Coupon Applied Successfully" ,loyalityPoints : loyalityPoints}));
          //         })
          //       }else{
          //         console.log("appt update erreor" ,err)
          //       }
          //   })
          // }

          else{

              return res.json(CreateObjService.response(true, 'Invalid Coupon Code'));
          }
        })
     });
  });
});

router.post('/getCorporateDetail', function(req, res, next) {
    CorporateCompany.find({}).sort({name:1}).exec(function(err, coms){
        var companies = _.map(coms, function(c){
          return {
            name      : c.name,
            companyId : c.id,
            domain : c.extension
          }
        });
        var corporateDeals = ConstantService.getCorporateDeals();
        var corporateReferalsMale = ConstantService.getCorporateReferalsMale();
        var corporateReferalsFemale = ConstantService.getCorporateReferalsFemale();
        var corporateRegister = ConstantService.getCorporateRegister();
        var corporateTnC = ConstantService.getCorporateTnC();

        return res.json(CreateObjService.response(false, {companies : companies, corporateDeals : corporateDeals, corporateRegister : corporateRegister ,corporateReferalsMale:corporateReferalsMale ,corporateReferalsFemale :corporateReferalsFemale,corporateTnC :corporateTnC}));
    });
});

router.post('/sendCorporateOtp', function(req, res, next) {

 var otp = Math.floor(Math.random() * 9000) + 1000;
User.findOne({corporateEmailId : req.body.emailId, isCorporateUser :true}).exec(function(err,corporateUser){
  if(corporateUser){
    console.log(corporateUser)
    console.log("if")
    return res.json(CreateObjService.response(true, 'This Corporate Id Already Exists'));
  }else{
    console.log("else")
      User.findOne({_id : req.body.userId},{corporateOtp : 1} , function(err,user){

        if(user.corporateOtp){
          otp = user.corporateOtp
           User.update({_id : req.body.userId} ,{corporateOtp : otp ,isCorporateUser:false , companyId : req.body.companyId,corporateCompanyId : req.body.companyId,unverifiedCoroprateEmail:req.body.emailId , corporateRegisterDate:new Date()}).exec(function(err,updatedUser){
            if(updatedUser){
              console.log(updatedUser)
            }
          })
        }else{
          User.update({_id : req.body.userId} ,{corporateOtp : otp , isCorporateUser:false,companyId : req.body.companyId,corporateCompanyId : req.body.companyId,unverifiedCoroprateEmail:req.body.emailId , corporateRegisterDate:new Date()}).exec(function(err,updatedUser){
            if(updatedUser){
              console.log(updatedUser)
            }
          })
        }

    var x = req.body.emailId, y = x.search("@") , extension = x.substr(y);

      CorporateCompany.findOne({_id : req.body.companyId}, function(err, d){

          if(d && d.extension == extension){

              function sendEmail() {
                            var nodemailer = require('nodemailer');
                            var transporter = nodemailer.createTransport('smtps://customercare@beusalons.com:beusalon@123@smtp.gmail.com');
                            var mailOptions = {
                                from: 'Be U Salons <customercare@beusalons.com>', // sender address
                                to: req.body.emailId,
                                // to: [emails], // list of receivers
                                html:'<html><head></head><body><p>Dear Customer,</p><p><b>'+otp+'</b> is the OTP for adding your corporate ID through Be U Salons App.</p><p>This password is only valid for this authentication attempt. Further attempts to use this password will fail. </p><p>Thank You,</p><p style="margin-top:-10px;">Be U Salons Team </p></body></html>',
                                subject: 'Your Requested OTP ' // Subject line
                            };

                             transporter.sendMail(mailOptions, function (error, info) {

                          });
                        }
                        sendEmail();
                         return res.json(CreateObjService.response(false, 'Otp sent to your email id'));

            }
            else{
              return res.json(CreateObjService.response(true, 'Wrong Email Id'));
            }
      });
    });
  }
})

});




router.post('/verifyCorporateOtp', function(req, res, next) {
  console.log(req.body.emailId)
    User.findOne({_id : req.body.userId, isCorporateUser : false}, function(err, d){
        if(d){
            // if(d.otp == req.body.otp && !d.used){
              console.log("verify" +d)
            if(d.corporateOtp == req.body.otp){
              // CorporateAccount.update({_id : d.id}, {used : 0}, function(Err,df){
                User.findOne({_id : req.body.userId},{gender:1},function(err,user){
                  // var freeService=[]
                  var couponCodeHistory = [];

                  for(var i=1;i<4;i++){
                    var now_date=new Date();
                    now_date.setMonth(now_date.getMonth() + i);
                    // freeService.push({ createdAt: new Date(), categoryId: "58707ed90901cc46c44af27b", serviceId : user.gender == "F" ? "58707eda0901cc46c44af417" : "58707eda0901cc46c44af2eb", code : user.gender == "F" ? 202 : 52, dealId : null, parlorId : null, noOfService : 1,
                    //  price : user.gender == "F" ? 600 : 300, name : user.gender == "F" ?  "Female Hair Cut" : "Male Hair Cut", discount : user.gender == "F" ? 300 : 150,source:"corporate",expires_at:now_date ,enableUpgrade : true, availed : i == 1 ? true : false , priceId:user.gender == "F" ? 202 : 52 })
                    // couponCodeHistory.push({active: true, createdAt: new Date(), code: "CORPID15", couponType: 3, expires_at: now_date})
                  }
                User.update({_id : req.body.userId , isCorporateUser : false}, {corporateReferralCount : 0, isCorporateUser : true, companyId : req.body.companyId,corporateCompanyId : d.companyId, freeHairCutBarChangeDate : new Date(),corporateEmailId:req.body.emailId, freeHairCutBar : 0}, function(e, f){
                      var x = req.body.emailId, y = x.search("@") , extension = x.substr(y);
                      console.log(extension)
                      let name = d.firstName
                      if(d.subscriptionId != 1 && (extension == "@beusalons.com" || extension == "@maxposuremedia.in")){
                          Appointment.addSubscriptionToUserForOneMonth("594a359d9856d3158171ea4f", d.id, new Date(), {id : "CORPORATE"+d.id}, 1699, "BEU", "CORPORATE", 1, 12, name, function(er){
                            return res.json(CreateObjService.response(false, 'https://res.cloudinary.com/dyqcevdpm/image/upload/v1556201079/employees_Annual_subscription_trial_pop_up_ubkna0.png'));
                          });
                      }else if(d.subscriptionId != 1){
                          Appointment.addSubscriptionToUserForOneMonth("594a359d9856d3158171ea4f", d.id, new Date(), {id : "CORPORATE"+d.id}, 1699, "BEU", "CORPORATE", 0, 1, name, function(er){
                            return res.json(CreateObjService.response(false,  "https://res.cloudinary.com/dyqcevdpm/image/upload/v1556201292/non_employees_1_month_subscription_trial_pop_up_wlkkt6.png"));
                          });
                      }else{
                          User.update({_id : req.body.userId}, {$inc : {subscriptionValidity : 1}}, function(er, f){
                              return res.json(CreateObjService.response(false, "https://res.cloudinary.com/dyqcevdpm/image/upload/v1556265385/Extra_month_added_-_Annual_subscription_trial_pop_up_wmc3zg.png"));
                          })
                      }
                });

              });
              // });
            }else{
                return res.json(CreateObjService.response(true, 'Invalid Otp'));
            }
        }
        else{
            return res.json(CreateObjService.response(true, 'Email Id not Registered'));
        }

    });
});

router.post('/requestCorporateAccount', function(req, res, next) {
    CorporateCompanyRequest.create({name : req.body.name, userId : req.body.userId, companyName : req.body.companyName, hrEmail : req.body.hrEmail, location : req.body.location}, function(err, d){
        return res.json(CreateObjService.response(false, 'Successfully Requested'));
    });
});

router.post('/profile', function(req, res, next) {
     User.findOne({_id : req.body.userId}, function(err, user){
        if(user){
            return res.json(CreateObjService.response(false, {firstName : user.firstName, userImage : user.profilePic, email : user.emailId, gender : user.gender, phoneNumber : user.phoneNumber, loyalityPoints : user.loyalityPoints, code : user.referCode,
          freeServices : user.freeServices && req.body.parlorId ? _.filter(user.freeServices, function(f){ return f.parlorId +"" == req.body.parlorId || f.parlorId == null}) : []
             }));
        }
        else{
            return res.json(CreateObjService.response(true, 'User id invalid'));
        }
     });
});

router.post('/payableAmountForOnlinePayment', function(req, res, next){
    Appointment.findOne({_id :req.body.appointmentId}, function(err, appt){
        if(appt){
            var newSubtotal = appt.subtotal - appt.loyalityPoints;
            var payableAmount = Math.ceil((newSubtotal - parseInt((newSubtotal * 0)/100))*1.18);
            var loyalityPoints = parseInt((newSubtotal * 0)/100);
              return res.json(CreateObjService.response(true, {payableAmount : payableAmount , discount : loyalityPoints}));
        }else{
              return res.json(CreateObjService.response(true, 'Appointment id invalid'));
        }
    });
});



router.post('/notification', function(req, res, next) {
    Notification.find({ $or: [{userId : req.body.userId, active:true}, {userId : null, active : true}]}).sort({sendingDate:-1}).exec(function(err, notifications){

        var data = _.map(notifications, function(n){
            return{
                action : n.action,
                title : n.title,
                body : n.body,
                imageUrl1 : n.imageUrl1,
                imageUrl2 : n.imageUrl2,
                appointmentId : n.appointmentId,
                notificationId : n.id,
                time : HelperService.getTimeFromToday(n.sendingDate),
            };
        });
        return res.json(CreateObjService.response(false, data));
  });
});

router.post('/favourite', function(req, res, next) {
    User.update({_id : req.body.userId}, {$push : {'favourites' : { createdAt : new Date(), parlorId : req.body.parlorId} } }, function(err, done){
        return res.json(CreateObjService.response(false, 'Successfully Updated'));
    });
});

router.delete('/favourite', function(req, res, next) {
    User.update({_id : req.body.userId}, {$pull : {'favourites' : { parlorId : req.body.parlorId} } }, {multi : true}, function(err, done){
        return res.json(CreateObjService.response(false, 'Successfully Deleted'));
    });
});

router.post('/favourites', function(req, res, next) {
    User.findOne({_id : req.body.userId}, {favourites : 1, recent : 1}, function(err, user){
         Parlor.find({}, {_id : 1, name : 1, address : 1, address2 : 1, parlorType : 1, images : 1, rating : 1,latitude : 1, longitude : 1}, function(err, parlors){
          console.log("parlors");
            var parlors = _.map(parlors, function(p){
                return {
                    name : p.name,
                    parlorId : p.id,
                    address1 : p.address,
                    parlorType : p.parlorType,
                    address2 : p.address2,
                    image : p.images[0] ? p.images[0].imageUrl : '',
                    rating : p.rating,
                    favourite : _.filter(user.favourites, function(f){ return f.parlorId == p.id ;})[0] ? true : false,
                    recent : user.recent ? user.recent.parlorId  == p.id ? true : false : false,
                    distance : HelperService.getDistanceBtwCordinates(req.body.latitude, req.body.longitude, p.latitude, p.longitude),
                };
            });
            var favouriteSalons = _.filter(parlors, function(p){ return p.favourite });
                return res.json(CreateObjService.response(false, favouriteSalons));
         });
    });
});



router.post('/homePage', function(req, res, next) {
  console.log("homepage--------------" )
  var androidVersion = 0 ,iosVersion =0;
  if(req.body.versionAndroid){
    androidVersion =req.body.versionAndroid
  }if(req.body.versionIos){
    iosVersion = req.body.versionIos
  }

  User.update({_id : req.body.userId}, {lastActiveTime : new Date() ,androidVersion : androidVersion , iosVersion : iosVersion ,latitude:req.body.latitude ,longitude:req.body.longitude }, function(err, updated){
      User.findOne({_id : req.body.userId}, {favourites : 1, recent : 1 ,phoneNumber : 1 , gender : 1 , referCode : 1 ,couponCodeHistory:1}, function(err, user){
          Notification.find({ $or: [{userId : req.body.userId}, {cityId : 1} ], active : true}).count(function(err, count){
             Parlor.find({active : true}, {_id : 1, name : 1, address : 1, address2 : 1, parlorType : 1, images : 1, rating : 1,latitude : 1, longitude : 1}, function(err, parlors){
              console.log("parlors");
                var parlors = _.map(parlors, function(p){
                    return {
                        name : p.name,
                        parlorId : p.id,
                        address1 : p.address,
                        parlorType : p.parlorType,
                        address2 : p.address2,
                        image : p.images[0] ? p.images[0].imageUrl : '',
                        rating : p.rating,
                        favourite : _.filter(user.favourites, function(f){ return f.parlorId == p.id ;})[0] ? true : false,
                        recent : user.recent ? user.recent.parlorId  == p.id ? true : false : false,
                        distance : HelperService.getDistanceBtwCordinates(req.body.latitude, req.body.longitude, p.latitude, p.longitude),
                    };
                });
                var deals = ConstantService.getDeals();
                var packages = [];
                ParlorService.getPackages(function(pack){
                    packages = pack;
                    var obj = {
                        deals : deals,
                        carousels : ConstantService.getCarousel(),
                        discountRules : ConstantService.getDiscountRules(),
                        notificationCount : count,
                        referCode : user.phoneNumber ? getReferCode(user.phoneNumber) : null,
                        packages : packages,
                        popularSalons : _.slice(_.sortBy(_.filter(parlors, function(d){ return d.distance < 30}), 'rating'), 0, 8),
                        favouriteSalons : _.filter(parlors, function(p){ return p.favourite || p.recent }),
                        nearBySalons : _.slice(_.filter(_.sortBy(parlors, 'distance'), function(p){ return p.distance < 500 ;}), 0, 6),
                        freebies : ConstantService.getFreeBies(user.referCode ,user.gender),
                    };
                     var cityId = ConstantService.getCityId(req.body.latitude, req.body.longitude)
                     var couponFound = true;
                     couponFound =_.filter(user.couponCodeHistory , function(cc){ return cc.code == "GBCOL" ;})[0] ?true :false;
                    if(cityId == 2 && req.body.userId && couponFound == false){
                        console.log("cityIdddddddddddddddddddddddd" , cityId)
                        var now_date = new Date(2018,0,31,23,59,59);
                        User.update({_id:req.body.userId} ,{$push:{couponCodeHistory :{$each:[{active: true, createdAt: new Date(), code: "GBCOL", couponType: 7, expires_at: now_date}]}}},function(err,userUpdate){
                            console.log("userUpdate" ,userUpdate)
                            return res.json(CreateObjService.response(false, obj));
                        })
                    }
                    else
                      return res.json(CreateObjService.response(false, obj));
                });
             });
          });
      });
  });
});

function sendUpdateNotification(userId){
    var message = 'Get 100% cash back on your next App payment and much more. Update your app now!';
    // var image = '';
    var androidData = {type: "update",title: "App Update Available", body: message, notificationId:"1"};
    var iosData = {type: "update", title: "App Update Available", body: message,notificationId:"1"};
        User.findOne({_id:userId},{firebaseId:1,firebaseIdIOS:1}).exec(function (err, users) {
            var fbId = [], fbIos = [];
                if (users.firebaseId) fbId.push(users.firebaseId);
                if (users.firebaseIdIOS) fbIos.push(users.firebaseIdIOS);
                Appointment.sendAppNotificationAdmin(fbId, androidData, function (err, response) {
                    console.log(response)
                });
                Appointment.sendAppNotificationIOSAdmin(fbIos, iosData,function (err, response) {
                    console.log(response)
                });
        })
}

router.post('/logout', function(req, res, next) {
     User.update({_id : req.body.userId},{firebaseId : null, logoutTime : new Date()}, function(err, u){
        if(!err){
            return res.json(CreateObjService.response(false, 'Successfully logged out!'));
        }
        else{
            return res.json(CreateObjService.response(true, 'Unable to logout'));
        }
     });
});

router.post('/loyalityPoints', function(req, res, next) {
  //macAddress
    var wifiName = "test", wifiPassword = "beu12345";
    var freeServices ;
    var imageUrl = "";
    // var imageUrl = "https://res.cloudinary.com/dyqcevdpm/image/upload/v1554451265/1080-x-854-subscription-renewal---pop-up-banner-for-home_1_adaqgn.png";
    var buttonText = "Know More";
    
    if(req.body.versionAndroid){
      var androidVersion =req.body.versionAndroid
    }if(req.body.versionIos){
      var iosVersion = req.body.versionIos
    }
    var updateObj = {latitude : req.body.latitude, longitude : req.body.longitude, androidVersion : androidVersion , iosVersion : iosVersion};
    if(req.body.firstLogin){
      updateObj = {registerLatitude : req.body.latitude, registerLongitude : req.body.longitude};
    };
      var cityId = ConstantService.getCityId(req.body.latitude , req.body.longitude);
      if(cityId == 1)updateObj.freeHairCutBar = 0;
    console.log(updateObj);
        User.findOne({_id : req.body.userId}, function(err , user){
          User.getSubscriptionLeftByMonthv4(req.body.userId, new Date(), user.subscriptionLoyality,  function(reed){
              console.log("reed", reed)
          var sub=false, subscriptionTotalAmount = 0,remainingSubscriptionAmount =(user.subscriptionId == 1) ? 500 : 200, subscriptionReferMessage ="";
          var subPrice = (user.subscriptionId == 1) ? 1699 : 899;
          var subAmount = (user.subscriptionId == 1)  ? 500 : 200;
          if(user.subscriptionId){
              sub=true;
              subscriptionTotalAmount = (user.subscriptionId == 1) ? 500 : 200;
              subscriptionReferMessage = "Save Rs 200 on your Be U Subscription (pay Rs 1699 & enjoy free services worth Rs 500/month, for 1 full year) purchase by using my referral code @@ ";
          }
          if(user.subscriptionRedeemMonth.amount>0){
            remainingSubscriptionAmount = subscriptionTotalAmount - user.subscriptionRedeemMonth.amount;
          }
          remainingSubscriptionAmount = reed;
            if(!user.referCode){
              updateObj.referCode = getReferCode(user.phoneNumber);
              user.referCode = updateObj.referCode;
            }
              ActiveMembership.findOne({"members.userId" : req.body.userId}, {creditsLeft : 1, name : 1}, function(e, mem){
              if(!mem)mem = {};
            SubscriptionSale.findOne({userId : req.body.userId}).sort({createdAt : -1}).exec(function(err2, subscriptionSale){

            Appointment.find({'membershipSaleId' : mem.id, status : {$in : [1, 4]}, creditUsed : {$gt : 0} }, {creditUsed : 1}, function(err, appts){
                var t = 0;
                _.forEach(appts, function(a){
                    t += a.creditUsed;
                });
                var activeMemberships = [];
                  if(mem.creditsLeft){
                      mem.creditsLeft = mem.creditsLeft.toFixed(2);
                      activeMemberships.push({
                          // name : mem.name,
                          name : ConstantService.getFamilyWalletString(),
                          credits : mem.creditsLeft - t < 0 ? 0 : parseInt(mem.creditsLeft - t),
                      });
                  };

                User.update({_id : req.body.userId}, updateObj, function(err, updateobj){
                    var freebies = ConstantService.getFreeBies(user.referCode);

                    var newFreebies = ConstantService.getFreeBiesNewObject(user.referCode, user.gender, sub , user.allow100PercentDiscount);

                    var corporateReferalMessage = ConstantService.getCorporateReferalMessage(user.referCode);
                    var noramlReferalMessage = ConstantService.getNoramlReferalMessage(user.referCode);

                    freeServices = user.freeServices ? _.filter(user.freeServices, function(f){ return f.source != "corporate"; }) : [];
                    var freeCorporateServices =user.freeServices ? _.filter(user.freeServices, function(f){ return f.source == "corporate"}) : [];


                    _.forEach(freeServices, function(free){
                      free.dealId = free.code == 52 ? 37 : 36;
                      if(free.code == 489)free.dealId = 350;
                      if(free.code == 502)free.dealId = 154;
                    });
                    var freeCorporateServices1=_.map(freeCorporateServices,function(f){
                    var upgrade=[];
                    upgrade=ConstantService.corporateReferralServices(user.gender,user.corporateReferralCount,f.serviceId)
                    var dealId = f.code == 52 ? 37 : 36 , dealType = f.code == 52 ? "dealPrice" : "dealPrice";
                    if(f.code == 489)dealId = 350;
                    
                        if(!f.enableUpgrade){
                            dealId = f.dealId
                            dealType = f.dealType
                        }
                          return{
                                   "id"             : f._id,
                                   "expires_at"     : f.expires_at,
                                   "discount"       : f.discount,
                                   "name"           : f.name,
                                   "price"          : f.price,
                                   "noOfService"    : f.noOfService,
                                   "parlorId"       : f.parlorId,
                                   "dealId"         : dealId ,
                                   "serviceCode"    : f.code,
                                   "serviceId"      : f.serviceId,
                                   "brandId"        : f.brandId,
                                   "productId"      : f.productId,
                                   "services"       : f.services,
                                   "priceId"        : f.priceId == null ? 0 : f.priceId,
                                   "dealType"       : dealType,
                                   "description"    : f.description ? f.description : " ",
                                   "categoryId"     : f.categoryId,
                                   "createdAt"      : f.createdAt,
                                   "source"         : f.source==null ? "" : f.source,
                                   "upgrade"        : upgrade.service,
                                   "enableUpgrade"  : f.enableUpgrade,
                                   "availed"        : f.availed
                                }

                          })
                    var subscriptionReadyToRenew = false;

                     Appointment.find({"client.id" : req.body.userId, status : {$in : [1,3]}, loyalitySubscription : {$gt: 0}}, {loyalitySubscription : 1, parlorTax : 1, tax : 1}, function(er, appointments){
                        
                        var subscriptionHasExpired = appointments.length > 0 && !user.subscriptionId ? true : false;
                        if(user.subscriptionId){
                          var subscriptionDate = ParlorService.getSubscriptionStartEndDate(user.subscriptionBuyDate, user.subscriptionValidity);

                          var noOfMonth  = (new Date().getTime()-subscriptionDate.validTill.getTime())/(1000 * 3600 * 24); //days
                          subscriptionReadyToRenew = noOfMonth >= 0 ? true : false;
                          imageUrl = subscriptionReadyToRenew ? "https://res.cloudinary.com/dyqcevdpm/image/upload/v1554451265/1080-x-854-subscription-renewal---pop-up-banner-for-home_1_adaqgn.png" : ""
                        }
                        if(!user.subscriptionId && subscriptionHasExpired){
                          console.log("herer")
                            let pastImageObj = HelperService.getNewSubscriptionPriceAfterExpire(subscriptionSale)
                            imageUrl = pastImageObj.imageUrl;
                        }
                        if(user.subscriptionRenewDate){
                            subscriptionReadyToRenew = false
                            imageUrl = ""
                        }
                          console.log("herer23123")
                    

                    var obj = {freeAppServiceCode : ConstantService.getFreeThreadingServiceCode(), corporateReferralCount:user.corporateReferralCount,activeMemberships : activeMemberships, freeHairCutBar : user.freeHairCutBar, freebies : freebies,newFreebies : newFreebies, noramlReferalMessage : noramlReferalMessage ,corporateReferalMessage : corporateReferalMessage, points : parseInt(user.loyalityPoints) ? parseInt(user.loyalityPoints) : 0, freeExpiry : user.freebieExpiry ? user.freebieExpiry : null ,code : user.referCode, tnc : ConstantService.getFreeBiesTnC(), wifiName : wifiName, wifiPassword : wifiPassword, freeServices : freeServices,freeCorporateServices:freeCorporateServices1 , corporateEmailId : user.corporateEmailId,isSubscribed:sub,subscriptionReferMessage : subscriptionReferMessage, remainingSubscriptionAmount : remainingSubscriptionAmount, subscriptionHasExpired : subscriptionHasExpired, subscriptionReadyToRenew : subscriptionReadyToRenew, imageUrl : imageUrl, buttonText : buttonText, genderUpdated: user.genderUpdated};

                    if(freeServices.length > 0){
                       AllDeals.findOne({"services.serviceCode" : freeServices[0].code}, {dealId : 1}, function(er, d){
                          if(d){
                              freeServices[0].parlorDealId = d.dealId;
                          }
                          return res.json(CreateObjService.response(false, obj));
                       });
                    }else{
                      return res.json(CreateObjService.response(false, obj));
                    }
                });
                });
                });
                });
            });
    });
});
});


router.post('/updateCorporateServices',function(req,res){

    var userId=req.body.userId
    var freeCorpServiceId=req.body.id
    var upgradeId=req.body.upgradeId
    var index =req.body.index
    User.findOne({_id:userId},{gender:1 , corporateReferralCount : 1},function(err,response){

        if(err) res.json(CreateObjService.response(true,err))
        else {
            console.log(response)
          var upgradeData=ConstantService.corporateReferralServices(response.gender , response.corporateReferralCount , freeCorpServiceId)
            console.log(upgradeData)
          var fetched= _.filter(upgradeData.service,function(u){
                    return  u.id==upgradeId
          })
            User.findOne({_id: userId} , {freeServices : 1 , corporateReferralCount:1,couponCodeHistory :1} , function(err,freeServ){
              var updateReferral = 0;
                var fs = [];
                // var obj = [{
                //             active: true,
                //             createdAt: new Date(),
                //             code: "CORPRF15", //"CORPID15"
                //             couponType: 5,
                //             expires_at: now_date
                //         }];

                        console.log("obj------------------obj----------obj---" ,obj)
                _.forEach(freeServ.freeServices , function(free){
                  var arr={};
                  if(free._id == freeCorpServiceId){
                      arr.createdAt     =   free.createdAt,
                      arr.noOfService   =   free.noOfService,
                      arr.categoryId    =   free.categoryId,
                      arr.serviceId     =   fetched[0].serviceId,
                      arr.dealId        =   fetched[0].dealId,
                      arr.parlorId      =   free.parlorId,
                      arr.code          =   fetched[0].serviceCode,
                      arr.name          =   fetched[0].serviceName,
                      arr.price         =   fetched[0].price,
                      arr.discount      =   free.discount,
                      arr.source        =   free.source,
                      arr.expires_at    =   free.expires_at,
                      arr.dealType      =   fetched[0].dealType,
                      arr.brandId       =   fetched[0].brandId,
                      arr.productId     =   fetched[0].productId,
                      arr.description   =   fetched[0].description,
                      arr.priceId       =   fetched[0].priceId,
                      arr.enableUpgrade =   false,
                      arr.availed       =   true;

                      console.log(arr)
                      fs.push(arr);
                  }else{
                    fs.push(free);
                  }
                })

                User.update({_id:userId},{$push: { couponCodeHistory: {$each : obj}}}).exec(function(err,userUpdated){
                    if(err) {
                      res.json(CreateObjService.response(true,err))
                          console.log(err)
                    }
                    else {
                      updateReferral = (freeServ.corporateReferralCount - fetched[0].referralReduce);
                      console.log("updated Refreal" + updateReferral)
                      User.update({_id:userId} , {corporateReferralCount : updateReferral}).exec(function(err,upd){
                        res.json(CreateObjService.response(false,"done"))
                      })

                    }
                })
            })

        }
    })
});


router.post('/pastAppointments', function(req, res, next) {
      var page = req.body.page ? req.body.page : 1;
      var perPage = 10;
     Appointment.find({ parlorId : { $ne : localVar.getMembershipParlorId() },'client.id' : req.body.userId, status : 3}).populate('parlorId').sort({createdAt: 1}).limit(perPage).skip(perPage * (page-1)).exec( function(err, data){
      if(!err){
          return res.json(CreateObjService.response(false, Appointment.parseForAppUpcomingAppointment(data, true, 18)));
      }
      else{
          return res.json(CreateObjService.response(true, 'User id invalid'));
      }
   });
});



function getReferCode(phoneNumber){
    phoneNumber = parseInt(phoneNumber);
    var reqString = '';
    var beuValue = 36;
    while(parseInt(phoneNumber/beuValue) != 0){
        reqString += getCodeByPlace(phoneNumber%beuValue);
        phoneNumber = parseInt(phoneNumber/beuValue);
    }
    reqString += phoneNumber%beuValue;
    return reverseString(reqString);
}

function getCodeByPlace(index){
    var o = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    // var o = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'];
    return o[index];
}

function reverseString(str) {
  var strArray = str.split("");
  strArray.reverse();
  var strReverse = strArray.join("");
  return strReverse;
}

router.post('/upcomingAppointments', function(req, res, next) {
     Appointment.find({'client.id' : req.body.userId, status : 1}).populate('parlorId').exec(function(err, data){
         console.log("aa" +data)
      if(data){
          return res.json(CreateObjService.response(false, Appointment.parseForAppUpcomingAppointment(data, true, 18)));
      }
      else{
          return res.json(CreateObjService.response(true, 'User id invalid'));
      }
   });
});

router.post('/mirrorAppointments', function(req, res, next) {
     Appointment.find({'client.id' : req.body.userId, status : {$in : [1,3]}}).limit(10).exec(function(err, data){
      if(data){
          return res.json(CreateObjService.response(false, Appointment.parseForMirrorUpcomingAppointment(data, true, 18)));
      }else{
          return res.json(CreateObjService.response(true, 'User id invalid'));
      }
   });
});

router.post('/mirrorUploadImages', function(req, res, next) {
     MirrorImage.create({userId : req.body.userId, imageUrl : 'https://salonpassbeu1.s3.amazonaws.com/mirror/'+req.body.imageUrl, skinScoreObj : req.body.skinScore, type : req.body.type}, function(err, mirrorImage){
          return res.json(CreateObjService.response(false, 'User upload'));
     })
});

router.post('/appointment', function(req, res, next) {

    if(!req.body.parlorId){
        req.body.parlorId = localVar.getMembershipParlorId();
    }
    if(req.body.mobile){
        User.findOne({phoneNumber:req.body.mobile}).exec(function (err,result) {
            if(result){
                req.body.userId=result._id;
                Appointment.registerAppointment(req,function (result) {
                    // console.log(result)
                    return res.json(result);
                })
            }else{
                User.createNew(
                    {phoneNumber:req.body.mobile,
                        firstName:req.body.name,
                        emailId:req.body.email,
                        gender:req.body.gender},function (err,data) {
                        if(err){return res.json(CreateObjService.response(true, 'Unable to create User'))};
                        req.body.userId=data._id;
                        Appointment.registerAppointment(req,function (result) {
                            // console.log(result)
                            return res.json(result);
                        })
                    })
            }
        })
    }else{
        console.log("here");
        Appointment.registerAppointment(req,function (result) {
            return res.json(result);
        })
    }
});

router.post('/appointmentv2', function(req, res, next) {

  console.log("appointmnet" , req.body)


  if(!req.body.parlorId){
        req.body.parlorId = localVar.getMembershipParlorId();
    }
    if(req.body.mobile){
        User.findOne({phoneNumber:req.body.mobile}, {name : 1}).exec(function (err,result) {
            if(result){
                req.body.userId=result._id;
                Appointment.registerAppointment(req,function (result) {
                      if(result.data){
                          req.body.appointmentId = req.body.appointmentId || result.data.appointmentId;
                          Appointment.appointmentDetails(req, 0, function (err,result) {
                                if(err){ return res.json(CreateObjService.response(true, result))}
                                return res.json(CreateObjService.response(false, result));
                            });
                      }else{
                        return res.json(result);
                      }
                })
            }else{
                User.createNew(
                    {phoneNumber:req.body.mobile,
                        firstName:req.body.name,
                        emailId:req.body.email,
                        gender:req.body.gender},function (err,data) {
                        if(err){return res.json(CreateObjService.response(true, 'Unable to create User'))};
                        req.body.userId=data._id;
                        Appointment.registerAppointment(req,function (result) {
                              if(result.data){
                                  req.body.appointmentId = req.body.appointmentId || result.data.appointmentId;
                                  Appointment.appointmentDetails(req, 0, function (err,result) {
                                if(err){ return res.json(CreateObjService.response(true, result))}
                                return res.json(CreateObjService.response(false, result));
                            });
                              }else{
                                return res.json(result);
                              }
                        })
                    })
            }
        })
    }else{
        Appointment.registerAppointment(req,function (result) {
            if(result.data){
              console.log("done");
                req.body.appointmentId = req.body.appointmentId || result.data.appointmentId;
                Appointment.appointmentDetails(req, 0, function (err,result) {
                                if(err){ return res.json(CreateObjService.response(true, result))}
                                return res.json(CreateObjService.response(false, result));
                            });
            }else{
              return res.json(result);
            }
        })
    }
  });


router.post('/appointmentv3', function(req, res, next) {
      Appointment.registerAppAppointment(req,function (result) {
      // Appointment.registerAppointment(req,function (result) {
            if(result.data){
                req.body.appointmentId = req.body.appointmentId || result.data.appointmentId;
                console.time("detail");
                Appointment.appointmentDetailsForApp(req, 0, function (err,result) {
                console.timeEnd("detail");
                                if(err){ return res.json(CreateObjService.response(true, result))}
                                return res.json(CreateObjService.response(false, result));
                            });
            }else{
              return res.json(result);
            }
      })
});


router.post('/appointmentv4', function(req, res, next) {
      Appointment.registerAppAppointmentv4(req,function (result) {
      // Appointment.registerAppointment(req,function (result) {
            if(result.data){
                req.body.appointmentId = req.body.appointmentId || result.data.appointmentId;
                console.time("detail");
                Appointment.appointmentDetailsForAppv4(req, 0, function (err,result) {
                console.timeEnd("detail");
                                if(err){ return res.json(CreateObjService.response(true, result))}
                                return res.json(CreateObjService.response(false, result));
                });
            }else{
              return res.json(result);
            }
      })
});



router.post('/appointmentv5', function(req, res, next) {
      Appointment.registerAppAppointmentv5(req,function (result) {
            if(result.data){
                req.body.appointmentId = req.body.appointmentId || result.data.appointmentId;
                Appointment.appointmentDetailsForAppv4(req, 0, function (err,result) {
                    if(err){ return res.json(CreateObjService.response(true, result))}
                    return res.json(CreateObjService.response(false, result));
                });
            }else{
              return res.json(result);
            }
      })
});


router.post('/appointmentDetailv3', function(req, res, next){
    Appointment.appointmentDetailsForApp(req, 0, function (err,result) {
        if(err){ return res.json(CreateObjService.response(true, result))}
        return res.json(CreateObjService.response(false, result));
    });
});


router.post('/addServicesToUserCart', function (req, res) {
    UserCart.findOne({userId : req.body.userId}, {services : 1 , parlorId:1}, function(err, cart){
        console.log(cart)
        var check = 0;
      var obj = {
                parlorId : req.body.parlorId,
                services : [{
                    code : req.body.serviceCode,
                    time : new Date(),
                    quantity : req.body.quantity,
                }],
                userId : req.body.userId,
                lastServiceAddTime : new Date(),
                createdAt : new Date(),
          };
      if(cart){
          if(cart.services && cart.services.length > 0 && cart.parlorId + "" == req.body.parlorId){

              _.forEach(cart.services, function(s){

                  if(s.code == req.body.serviceCode){
                    s.quantity = s.quantity + req.body.quantity;
                    check=1;
                  }
              });
             if(!check) {

                      cart.services.push({code : req.body.serviceCode,  quantity : req.body.quantity, time : new Date()});
                  }

          }
          else{
              cart.services = obj.services;
          }
          UserCart.update({userId : req.body.userId}, {services : cart.services, parlorId : req.body.parlorId, lastServiceAddTime : new Date()}, function(err, f){
              return res.json(CreateObjService.response(false, 'Done'));
          });
        }else{
          
          UserCart.create(obj,function(err, d){
              return res.json(CreateObjService.response(false, 'Done'));
          });
        }
        
        
    });
});

router.post('/changeAppointmentTime', function (req, res) {
    Appointment.update({_id : req.body.appointmentId, 'client.id' : req.body.userId, status : 1, loyalitySubscription : 0}, {appointmentStartTime : req.body.startAts}, function(err, d){
        return res.json(CreateObjService.response(false, 'Successfully Updated'));
    });
});



router.post('/cancelAppointment', function (req, res) {
  Appointment.findOne({_id : req.body.appointmentId}, function(err, appointment){
    if(appointment.status == 1){
      // Appointment.update({_id : req.body.appointmentId, 'client.id' : req.body.userId, status : 1}, {status : 2}, function(err, d){
        // console.log("D-----" , d)
            Appointment.refundLoyality(appointment, appointment.client.id, function(err, done){
              Appointment.refundPayment(req, function(response){
                if(appointment.couponLoyalityCode != "" && appointment.couponLoyalityCode != null){
                  User.update({phoneNumber : appointment.client.phoneNumber, 'couponCodeHistory.code' : appointment.couponLoyalityCode}, {$set : {'couponCodeHistory.$.active' : true}} , function(err , update){
                      return res.json(response);
                  })
                }else{
                  return res.json(response);
                }
              })
            // });
        });
    }else{
        return res.json(CreateObjService.response(true, 'This Appointment Cannot Be Cancelled'));
    }
        
  });
});


router.put('/appointment', function(req, res, next) {
  console.log("req received");
     User.findOne({_id : req.body.userId}, function(err, user){
        var parlorFound = _.some(user.parlors, function(p){ return p.parlorId + "" == req.body.parlorId; });
        if(parlorFound){
          User.getOldLoyalityPoints(req.body.userId, function(oldLoyalityPoints){
            Appointment.createAppointmentIdForUser(user, req, oldLoyalityPoints, function(response){
                return res.json(response);
            });
          });
        }
     });
});

router.post('/bookAndCapturePayment', function(req, res, next) {
  // http://paywithpaytm.com/developer/paytm_api_doc?target=txn-status-api
  Appointment.findOne({_id : req.body.appointmentId}, function(err, a){
  if(req.body.useLoyalityPoints && a.status != 0){
      User.getOldLoyalityPoints(req.body.userId, function(oldLoyalityPoints){
            Appointment.findOne({_id : req.body.appointmentId}, function(err, appointment){
              if(appointment.paymentMethod != 5){
                Appointment.refundLoyalityPoints(req.body.userId, appointment, 0, function(err, saddsadsa){
                      User.findOne({_id : req.body.userId}, function(err, user){
                            user.loyalityPoints = Appointment.maximumLoyalityRedeemtion(user, appointment, oldLoyalityPoints, req.body.paymentMethod);
                            var payableAmount = Math.ceil((appointment.subtotal - user.loyalityPoints - appointment.loyalityOffer)*1.18);
                            Appointment.update({_id : req.body.appointmentId}, {payableAmount : payableAmount, loyalityPoints : user.loyalityPoints + appointment.loyalityOffer}, function(err, u){
                                    Appointment.captureAppointment(req, function(response){
                                          if(response.success)
                                              return res.json(response);
                                          else{
                                              Appointment.refundLoyalityPoints(req.body.userId, appointment, 1 , function(err, resadsasponse){
                                                  return res.json(response);
                                              });
                                          }
                                    });
                      });
                  });
                                        });
              }else
                  return res.json(CreateObjService.response(true, 'Unable to create'));
          });
      });
  }else{
      Appointment.captureAppointment(req, function(response){
          return res.json(response);
      });
  }
  });
});


router.post('/initOnlinePaymentDiscount', function(req, res, next) {
    Appointment.update({_id : req.body.appointmentId, status : 0, 'client.id' : req.body.userId}, {discountOnOnlinePayment : true}, function(err, appointment){
        return res.json(CreateObjService.response(true, 'Updated Successfully'));
    });
});

router.post('/initPaytmPayment', function(req, res, next) {
  Appointment.findOne({_id : req.body.appointmentId, status : 0, 'client.id' : req.body.userId}, function(err, appointment){
      if(appointment){
          var params = getPaytmParams(appointment);
          console.log(params);
          PaytmService.genchecksum(params, PAYTM_MERCHANT_KEY, function(err, newParams){
              return res.json(CreateObjService.response(false, newParams));
          });
      }else{
          return res.json(CreateObjService.response(true, 'Invalid appointment id'));
      }
  });
});

router.post('/initEPayLaterPayment', function(req, res, next) {
  Appointment.findOne({_id : req.body.appointmentId, status : 0, 'client.id' : req.body.userId}, function(err, appointment){
      if(appointment){
        Appointment.getOrderHistory(appointment.client.id, function(orderHistory){
          var jsonObject = getEPayLaterParams(appointment, orderHistory, req);
          var crypto = require('crypto'), algorithm = 'aes-256-cbc', key = '59E17286A2389B2C3F9C5CD3EC1C9831', iv = '7349D67CC4C002F9'
          var hash = crypto.createHash('sha256');
          hash.update(JSON.stringify(jsonObject));
          var checksum = hash.digest('hex').toUpperCase();
          var cipher = crypto.createCipheriv(algorithm, key, iv);
          var encdata = cipher.update(JSON.stringify(jsonObject), 'utf8', 'base64');
          encdata += cipher.final('base64');
          /*var decipher = crypto.createDecipheriv(algorithm, key, iv);
          var decrypted = decipher.update(encdata, 'base64', 'utf8');
          decrypted += decipher.final('utf8');
          console.log('Base64 decoded and decrypted string : ' + decrypted);*/
          return res.json(CreateObjService.response(false, {checksum : checksum, encdata : encdata}));
        });
      }else{
          return res.json(CreateObjService.response(true, 'Invalid appointment id'));
      }
  });
});

router.post('/captureEPayLaterPayment', function(req, res, next) {
          var crypto = require('crypto'), algorithm = 'aes-256-cbc', key = '59E17286A2389B2C3F9C5CD3EC1C9831', iv = '7349D67CC4C002F9'
          var encdata = "k9B0mWcZDHfk4O5x12RjtKoABT0wO3buI39qmj4LhvNtvp2AEzbps2aa6CxDRjo4j4syEry/Z7JZLl3EGc8uopTvFDVmRlfENVS0taJJauh9w5eXEbfyogwDLtR7YPMpxGH3jdleE3NVJFDP15+Ncwl0ikHfH7usBtvp4Cp0cDVp+yjwnfw1fGNeKu0EW+u13Fv4BBcUF3lVgsjvWJzprlZO4V+C+yjb8l4jbj2UCaqZke4SY2c2qsh2Vpdh+DI1d57K3HF0nkknbP4tpCr5ms3qCKR5ENvWYY3D4DaIGrFTTlOdtqk5WhHqCQx8/ALj";
          var decipher = crypto.createDecipheriv(algorithm, key, iv);
          var decrypted = decipher.update(encdata, 'base64', 'utf8');
          // decrypted += decipher.final('utf8');
          return res.json(CreateObjService.response(false, decrypted));
});



router.post('/appointmentDetail', function(req, res, next) {
  console.log("here");

    if(req.body.mobile){
        User.findOne({phoneNumber:req.body.mobile}).exec(function (err,docs) {
            if(err){return res.json(CreateObjService.response(true, 'user id invalid'))}
            // console.log(req.body.userId);
            req.body.userId=docs._id;
            Appointment.appointmentDetails(req, 0,function (err,result) {
                if(err){return res.json(CreateObjService.response(true, result));}
                return res.json(CreateObjService.response(false, result));
                // return res.json({success:true,message:"data found",data:result});
            })
        })
    }else {
        Appointment.appointmentDetails(req, 0, function (err,result) {
            if(err){ return res.json(CreateObjService.response(true, result))}
            return res.json(CreateObjService.response(false, result));
        })
    }
});

router.post('/useLoyalityPoints', function(req, res, next){
    User.findOne({_id : req.body.userId}, function(err, user){
        User.getOldLoyalityPoints(req.body.userId, function(oldLoyalityPoints){
          user.loyalityPoints = user.loyalityPoints ? user.loyalityPoints : 0;
          Appointment.findOne({_id : req.body.appointmentId}, function(err, appointment){
                user.loyalityPoints = user.loyalityPoints + appointment.loyalityPoints - appointment.loyalityOffer;
                if(req.body.useLoyalityPoints == 1){
                        user.loyalityPoints = Appointment.maximumLoyalityRedeemtion(user, appointment, oldLoyalityPoints, req.body.paymentMethod);
                }else{
                    user.loyalityPoints = 0;
                }
                Appointment.appointmentDetails(req, user.loyalityPoints, function (err,result) {
                    if(err){ return res.json(CreateObjService.response(true, 'Error'))}
                    return res.json(CreateObjService.response(false, result));
                });
          });
        });
    });
});

router.post('/employeeForReview', function(req, res, next){
    Appointment.aggregate([
    {
      $match : {
        _id : ObjectId(req.body.appointmentId)
      }
    },
    {
      $unwind : "$services",
    },
    {
      $project : {
        employees : "$services.employees",
        serviceName : "$services.name",
      }
    },
    {
      $unwind : "$employees"
    },
    {
      $project : {
          employeeId : "$employees.employeeId",
          name : "$employees.name",
          serviceName : 1,
      }
    },
    {
      $group : {
        _id : "$employeeId",
        name : {$first : "$name"},
        employeeId : {$first : "$employeeId"},
        services : {$push : "$serviceName"},
      }
    }
    ]).exec(function(err, d){
          return res.json(CreateObjService.response(false, {employees : _.map(d, function(r) { return {
              name : r.name,
              employeeId : r.employeeId,
              services : r.services,
              text1 : "To Earn 25 B-Cash Add a Review Of Min. 25 Characters.",
              text2 : "Share with us your detailed experience at the salon and grab an awesome free service! *(Free service on 3 featured reviews)"
          }
        })}));
    });
});

router.post('/userReviewedSalons', function(req, res, next) {
    Appointment.find({'client.id' : req.body.userId, review : { $ne : null },'review.rating' : {$exists:true}}).exec(function(err, data){
      if(data){
          return res.json(CreateObjService.response(false, _.map(data, function(r) { return {
              name : r.parlorName ? r.parlorName : 'Text parlor',
              address : r.parlorAddress ? r.parlorAddress : 'Delhi',
              parlorId : r.parlorId,
              reviewedTime : HelperService.getTimeFromToday(r.review.createdAt),
              ratingByUser : r.review.rating,
              reviewContent : r.review.text
            } }) ));
      }
      else{
          return res.json(CreateObjService.response(true, 'Parlor id invalid'));
      }
   });
});

router.post('/addReview', function(req, res, next) {
  var now_date = new Date(); now_date.setMonth(now_date.getMonth() + 1)
  Appointment.findOne({_id : req.body.appointmentId}, function(err, appointment){
      Appointment.count({'client.id' : req.body.userId, status : { $in : [3] }, appointmentStartTime : { $gt : HelperService.getDayStart(appointment.appointmentStartTime), $lt :  HelperService.getDayEnd(appointment.appointmentStartTime) }, "review.rating" : null }, function(err, count){
        User.findOne({_id : req.body.userId}, function(err ,user){
             Appointment.update({_id : req.body.appointmentId, status : 3 , "review.rating" : null, 'client.id' : user.id}, {review : {
              text : req.body.text,
              employees : req.body.employees,
              rating : parseFloat(req.body.rating),
              userImage : user.profilePic,
              createdAt : new Date()
         }}, function(err, updated){
            if(!err && updated.nModified == 1 && updated.n == 1){
              Notification.update({appointmentId : req.body.appointmentId}, {active : false}, function(err, u){
                  if(count < 2 && (req.body.text+ "").length > 25){
                    LuckyDrawDynamic.onCustomerReview(req.body.appointmentId);
                    Parlor.updateSalonRating(appointment.parlorId);
                      var loyalityPoints = user.loyalityPoints ? user.loyalityPoints + 25 : 25;
                      User.update({_id : user.id}, { loyalityPoints : loyalityPoints, freebieExpiry : now_date, $push :{creditsHistory :  {  createdAt: new Date(), amount: 25, balance : loyalityPoints, source : req.body.appointmentId, reason : 'Free bies review updated'   }}}, function(e, u){
                          return res.json(CreateObjService.response(false, 'Review Updated B-Cash credited 25'));
                      });
                  }else{
                    LuckyDrawDynamic.onCustomerReview(req.body.appointmentId);
                    Parlor.updateSalonRating(appointment.parlorId);
                      return res.json(CreateObjService.response(false, 'Review Updated'));
                  }
              });
          }
          else{
              return res.json(CreateObjService.response(true, 'Review already exists'));
          }
         });
           });
      });
  });
});


router.post('/fbCheckIn', function(req,res){
var d=[];
var error= true;
var message = "";

    var FB = require('fb');

    FB.api('me/tagged_places', { access_token: req.body.fbAccessToken }, function (response) {
         console.log("response" ,response)
        User.findOne({_id: req.body.userId} , {phoneNumber : 1, loyalityPoints:1},function(err,user){
          // console.log(user)
            if(response.data.length>0){
                var newResponse = response.data.slice(0,5);
                async.each(newResponse , function(r , cb){

                    var string = r.place.name , substring = "Be U Salons"
                    var d = new Date(r.created_time) , responseDate = d.getFullYear()+'-' + (d.getMonth()+1) + '-'+d.getDate();
                    console.log("responseDate" ,string)
                    console.log("responseDate",responseDate)
                    Appointment.find({"client.id" : req.body.userId , status:{$in:[1,3]} , $where : "this.employees.length>0" , facebookCheckIn :false} ,{appointmentStartTime : 1} , function(err,appts){
                        if(appts.length>0){
                        _.forEach(appts,function(app){
                            var dd = new Date(app.appointmentStartTime) , appDate = dd.getFullYear()+'-' + (dd.getMonth()+1) + '-'+dd.getDate();
                            if(responseDate==appDate && string.indexOf(substring) !== -1){
                              console.log("***********************************")
                                var newLoyalityPoints = user.loyalityPoints + 100;
                                User.update({_id: req.body.userId} ,
                                    {$push : {
                                        fbCheckIns : {
                                            $each :[{message: "Facebook CheckIn" , createdAt : new Date() , freebies : 50 ,appointmentId : app._id}]
                                        } ,
                                        creditsHistory:{
                                          $each:[{createdAt:new Date() , amount:100 , balance :newLoyalityPoints ,source: app._id,reason : "Facebook CheckIn"}]
                                        }
                                    } , $inc : {loyalityPoints : 100} ,$set :{ benefit : "100 Loyalty Points"}
                                } , function(err, userUpdated){
                                    if(userUpdated){

                                      Appointment.update({_id : app._id} ,{facebookCheckIn :true} , function(err,updatedAppointment){
                                          if(updatedAppointment){
                                            error = false;
                                            message = "Check-In Successful. 100 B-Cash Has Been Credited To Your Account."
                                            cb();
                                          }else{
                                            error = true;
                                            message = "Unsuccessful"
                                            cb();
                                          }
                                      })

                                    }else{
                                      error = true;
                                      message = "Unsuccessful"
                                      cb();
                                    }
                                })
                            }
                        })
                      }else{
                        error = true;
                        message = "100 B-Cash To Be Earned Only If You Check-in On The Same Day Of Your Appointment."
                        cb();
                      }

                    })
                },function(done){
                  console.log("all done");
                   return res.json(CreateObjService.response(error, message));
              });
            }else {
                return res.json(CreateObjService.response(true, 'User checkin does not exist'));
            }
        })

    })


});


function getPaytmParams(appointment){
    return {
        // REQUEST_TYPE :  "DEFAULT",
        MOBILE_NO :  appointment.client.phoneNumber,
        EMAIL :  (appointment.client.emailId != null) ? appointment.client.emailId : 'shailendra@beusalons.com' ,
        CALLBACK_URL: 'https://securegw.paytm.in/theia/paytmCallback?ORDER_ID='+appointment.id,
        MID :  PAYTM_MERCHANT_MID,
        ORDER_ID :  appointment.id,
        CUST_ID :  appointment.client.id,
        INDUSTRY_TYPE_ID :  PAYTM_INDUSTRY_TYPE,
        CHANNEL_ID :  "WAP",
        TXN_AMOUNT :  parseInt(appointment.payableAmount + appointment.subscriptionAmount),
        WEBSITE :  'GinSwaWAP'
    };

}

function getEPayLaterParams(appointment, orderHistory, req){
  var currentDate= (appointment.createdAt.toISOString()).substr(0, appointment.createdAt.toISOString().length-5)+"Z";
   console.log("date format",currentDate)
  return {
    "redirectType": "WEBPAGE", 
    "marketplaceOrderId": appointment.id,
    "mCode": "BEUSALONS", 
    "callbackUrl": "http://www.beusalons.com/loggedapi/captureEPayLater", 
    "customerEmailVerified": false, 
    "customerTelephoneNumberVerified": true, 
    "customerLoggedin": true, 
    "amount": parseInt(appointment.payableAmount + appointment.subscriptionAmount)*100, 
    "currencyCode": "INR", 
    "date":currentDate , 
    "category": "FASHION", 
    "customer": {
      "firstName": appointment.client.name,
      "emailAddress": appointment.client.emailId, 
      "telephoneNumber": appointment.client.phoneNumber, 
      "gender": appointment.client.gender == "M" ? "male" : "female", 
    }, 
    "device": {
      "deviceType": "MOBILE", 
      "deviceClient": req.body.deviceClient,
      "deviceId": req.body.deviceId,
      "deviceMake": req.body.deviceMake,
      "deviceModel": req.body.deviceModel,
      "osVersion": req.body.osVersion,
    }, 
    "location": {
      "latitude": appointment.latitude, 
      "longitude": appointment.longitude, 
      "accuracy": "100m" }, 
    "merchant" : {
      "marketplaceMerchantId" : appointment.parlorId, 
      "name" : appointment.parlorName, 
      "address" : {
        "line1" : appointment.parlorAddress} 
    }, 
  "orderHistory": [], 
  "marketplaceSpecificSection": {
    "marketplaceCustomerId": appointment.client.id,
    } 
  };

}

router.post("/updateHelpfulRating", function(req, res) {
    var appId = req.body.appId;
    var userId = req.body.userId;

    Appointment.findOne({"_id" : ObjectId(appId)}, {client : 1}, function(err, clientData){
      if(userId.toString() == (clientData.client.id).toString()){
          return res.json(CreateObjService.response(true, 'Not Allowed'));
      }else{
          if(req.body.isHelpful == true){
            Appointment.update({ "_id": ObjectId(appId) }, { $inc: { "review.isHelpful": 1} }, function(err, updated) {
                if (err) {
                  return res.json(CreateObjService.response(true, 'Server Error'));
                } else {
                  return res.json(CreateObjService.response(false, 'Successfully Updated.'));
                }
            });
          }

          if(req.body.notHelpful == true){
            Appointment.update({ "_id": ObjectId(appId) }, { $inc: { "review.notHelpful": 1} }, function(err, updated) {
                if (err) {
                  return res.json(CreateObjService.response(true, 'Server Error'));
                } else {
                  return res.json(CreateObjService.response(false, 'Successfully Updated.'));
                }
            });
          }
      }
    })
});


router.post('/couponCodes' , function(req,res){
  // console.log(req.body);
  var expiry=30;
  User.findOne({_id : req.body.userId},function(err,user){
    var query ={ starts_at :{$lt : new Date()} ,expires_at :{$gt : new Date()}};
    if(localVar.isServer()){query.active = true}
    else {query = {active : false}};

    FlashCoupon.find(query, function(err, flashCoupons){
      var couponCode = [], flatCoupon = null;
      var inactiveCoupons = [];
      console.log("inside flash");
      var flashCouponDetails = {
          coupons:[],
          title:"Flash Coupons",
          description:"<div>Introducing our new weekly 'Flash Sale' coupons, valid at select outlets every Monday to Thursday. Watch out for this space for new coupons every week.</div>"
      };
      var subscriptionFeatures = {
            heading : "<div style='color: #cc0000'>Subscriber Only Features<div>",
            features : '<div>&#x20B9;500 FREE/Month &#x25CF;FLASH SALE &#x25CF;10% Product Discount WiFi &#x25CF;Music</div>',
          };
      var activeCouponTypes = [];
      var couponCodeTypes= [3,5,8, 14]
      var cityId = ConstantService.getCityId(user.latitude, user.longitude)
      if(cityId == 2)couponCodeTypes.push(7)
      user.couponCodeHistory.push(HelperService.get24HrsCouponCode());
       if(req.body.appointmentId){
          Appointment.findOne({_id:req.body.appointmentId},{subtotal:1, loyalityPoints:1,couponLoyalityPoints:1},function(err,appt){
            // var couponDetails = ConstantService.couponCodeDetails(uC.couponType);
              _.forEach(user.couponCodeHistory,function(uC){
                  var couponDetails = ConstantService.couponCodeDetails(uC.couponType , uC.code);
                  if(uC.couponType == 13 || uC.couponType == 14)couponDetails = ConstantService.couponCodeDetailsForSalon(uC);
                  var maxLimit = couponDetails.limit;
                  // var amt = appt.subtotal - appt.loyalityPoints + appt.couponLoyalityPoints;
                  var amt = appt.subtotal - appt.loyalityPoints + 0;
                  var newAmount = Math.ceil(amt * (couponDetails.offPercentage/100));  
                      if(uC.active == true){
                    couponDetails.newAmount = (couponDetails.code == "GBCOL") ? 700 : ((newAmount > maxLimit) ? maxLimit : newAmount);
                    couponDetails.couponId = uC._id;
                    couponDetails.expiry = (uC.expires_at);
                    if(couponDetails.expiry>new Date() && uC.couponType!= 14){
                      couponCode.push(couponDetails)
                    }

                  }
              });
              var couponDetails2 = ConstantService.couponCodeDetails(2);
              var maxLimit = couponDetails2.limit;
                  couponDetails2.couponId = ConstantService.beforBookingCouponId();
                  var amt = appt.subtotal - appt.loyalityPoints + 0;
                  var newAmount = Math.ceil(amt * (couponDetails2.offPercentage/100));
                  couponDetails2.newAmount = (newAmount > maxLimit) ? maxLimit : newAmount;
                  couponCode.push(couponDetails2);

              var obj = {couponCode : couponCode};
              return res.json(CreateObjService.response(false, obj));
          })
        }else{
        // console.log("flash length",flashCoupons.length)
        if(!req.body.appointmentId && flashCoupons.length >0){

             _.forEach(flashCoupons , function(fcoupon){

              var flashDetails = ConstantService.getFlashCouponDetails(fcoupon);

                flashCouponDetails.coupons.push(flashDetails)

             })
        }
        else{
          flashCouponDetails ={};
        }
            _.forEach(user.couponCodeHistory,function(uC){
              activeCouponTypes.push(uC.couponType)
              if(uC.active == true){

                var couponDetails = ConstantService.couponCodeDetails(uC.couponType, uC.code);
                if(uC.couponType == 13 || uC.couponType == 14)couponDetails = ConstantService.couponCodeDetailsForSalon(uC);
                var maxLimit = couponDetails.limit;
                couponDetails.newAmount = couponDetails.limit;
                couponDetails.couponId = uC._id;
                couponDetails.code = uC.code;
                couponDetails.expiry = (uC.expires_at);
                // console.log("couponDetails" ,couponDetails);
                if(couponDetails.expiry>new Date()){
                  if(uC.couponType == 14){
                    flatCoupon = JSON.parse(JSON.stringify(couponDetails))
                  }else{
                    couponCode.push(couponDetails)
                  }
                }
                
              }
            })
           _.forEach(couponCodeTypes , function(active) {
              if(activeCouponTypes.indexOf(active) == -1){
                var inactiveCouponDetails = ConstantService.couponCodeDetails(active , active.code);
                
                inactiveCoupons.push(ConstantService.getInactiveCoupons(inactiveCouponDetails));
              }
           })
           var obj = {couponCode : couponCode, inactiveCoupons: inactiveCoupons, flashCouponDetails  : flashCouponDetails, subscriptionFeatures: subscriptionFeatures};
           if(flatCoupon)obj.flatCoupon = flatCoupon;
            /*if(user.subscriptionId == 1 || user.subscriptionId == 2){
              obj.couponCode =[];
              obj.inactiveCoupons =[];
            }*/
          
          return res.json(CreateObjService.response(false, obj));
        }

    })

  })
});

/*
totalSavings
annualBalanceLeft
monthlyBalanceLeftDate
isReadyToRenew
*/

router.post('/addServiceReminders', function(req, res, next) {
    let obj = {
        userId : req.body.userId,
        type : 1,
        title : req.body.title,
        dueDate : HelperService.addDaysToDate(new Date(), parseInt(req.body.dueDays)),
        active : true,
    }
    UserReminder.create(obj, function(erm, f){
        return res.json(CreateObjService.response(false, 'done'));
    })
});

router.post('/editServiceReminders', function(req, res, next) {
    let obj = {
        dueDate : HelperService.nextMonthStartDate(),
        active : true,
    }
    UserReminder.findOne({_id : req.body.reminderId}, function(err, r){
        let obj =  {dueDate : HelperService.addDaysToDate(r.dueDate, parseInt(req.body.days))};
        if(req.body.days == 30){
          obj.skiped  = true;
        } else{
          obj.isSnoozed = true;
        }     
        if(req.body.days == 1000){
          UserReminder.remove({_id : req.body.reminderId}, function(erm, f){
             UserReminder.find({userId : req.body.userId}, function(erm, data){
              let newData = _.map(data, function(d){
                return {
                  reminderId : d.id,
                  type : d.type,
                  title : d.title,
                  dueDate : d.dueDate,
                  active : d.active,
                  isSnoozed : d.isSnoozed,
                  skiped : d.skiped,
                  daysLeft : HelperService.getNoOfDaysDiff(d.dueDate , new Date())
                }
              })
        return res.json(CreateObjService.response(false, newData));
    })
          });
        } else{ 
        UserReminder.update({_id : req.body.reminderId}, obj, function(erm, f){
            UserReminder.find({userId : req.body.userId}, function(erm, data){
      let newData = _.map(data, function(d){
        return {
          reminderId : d.id,
          type : d.type,
          title : d.title,
          dueDate : d.dueDate,
          active : d.active,
          isSnoozed : d.isSnoozed,
          skiped : d.skiped,
          daysLeft : HelperService.getNoOfDaysDiff(d.dueDate , new Date())
        }
      })
        return res.json(CreateObjService.response(false, newData));
    })
        }) 
        } 
    })
});

router.post('/serviceReminders', function(req, res, next) {
    UserReminder.find({userId : req.body.userId}, function(erm, data){
      let newData = _.map(data, function(d){
        return {
            reminderId : d.id,
            type : d.type,
            title : d.title,
            dueDate : d.dueDate,
            active : d.active,
            isSnoozed : d.isSnoozed,
            skiped : d.skiped,
            showButton : HelperService.getNoOfDaysDiff(d.dueDate, new Date())<5 ? true : false,
            daysLeft : HelperService.getNoOfDaysDiff(d.dueDate , new Date())
        }
      })
        return res.json(CreateObjService.response(false, newData));
    })
});

//https://res.cloudinary.com/dyqcevdpm/image/upload/v1554451265/1080-x-854-subscription-renewal---pop-up-banner-for-home_1_adaqgn.png
router.post('/showSubscription' , function(req,res) {
  console.log('1')
  var monthNames = ["Jan", "Feb", "Mar", "April", "May", "June","July", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var subscribedData = {name:"" , isEligibleForGivingGift : 1, totalSavings:0, annualBalanceLeft : 0, subscriptionType:"" , validFrom : 0 , validTill : 0,annualBalance:0,monthlyBalance:0, currentMonth:"" ,profilePic:"",friendtext:"Your Friend Also Gets One Month Extension On Their Subscription When They Use Your Referral Code To Buy Our Subscription."};
    var currentPeriod = 1;
    let offValue = 0; let offReferCode = "";let imageUrl = "https://res.cloudinary.com/dyqcevdpm/image/upload/v1554539843/1080-x-632-subscription-renewal-banner-before-expiry-_1_zhr6zj.png";
    User.findOne({ _id : req.body.userId},{subscriptionRenewDate : 1 ,subscriptionGiftHistory : 1, subscriptionRedeemHistory:1,subscriptionValidity :1, referCode:1,profilePic :1,latitude :1, longitude :1, gender :1 ,firstName:1,lastName:1 ,subscriptionId : 1, subscriptionOtp : 1, subscriptionLoyality : 1, subscriptionRedeemMonth : 1 , subscriptionReferalHistory:1, subscriptionBuyDate : 1} , function(err,user){
        console.log('2')
        SubscriptionSale.find({}).count().exec(function( err , count){
          Appointment.find({"client.id" : req.body.userId, status : {$in : [1,3]}, loyalitySubscription : {$gt: 0}}, {loyalitySubscription : 1, parlorTax : 1, tax : 1}, function(er, appointments){
            subscribedData.noOfAppointments = appointments.length;
            let totalSavings = 0;
            _.forEach(appointments, function(a){
                totalSavings += (a.parlorTax > 0 || a.tax > 0 ? a.loyalitySubscription*1.18 : a.loyalitySubscription);
            })
            subscribedData.totalSavings = parseInt(totalSavings);
            if(user){
              var obj = ConstantService.getSubscriptionCard(user ? user.gender : "F" , count);
              obj.selectSubscription.isReadyToRenew = appointments.length> 0 ? true : false;
            SubscriptionSale.findOne({userId : req.body.userId}).sort({createdAt : -1}).exec(function(err2, subscription){
              if(!user.subscriptionId && subscription){
                  let pastImageObj = HelperService.getNewSubscriptionPriceAfterExpire(subscription)
                  imageUrl = pastImageObj.imageUrl;
                  offValue = pastImageObj.offValue;
                  offReferCode = pastImageObj.offReferCode;
              }
              if(subscription){
                    console.log(subscription)
                    subscription.createdAt = user.subscriptionBuyDate;
                    var subscriptionDate = ParlorService.getSubscriptionStartEndDate(subscription.createdAt, user.subscriptionValidity);
                    console.log("subscriptionDate", subscriptionDate)
                    subscription.createdAt = subscriptionDate.startDate;
                    if(subscription){
                        var valid = subscriptionDate.validTill;
                        var startDate = subscriptionDate.startDate;
                        var validTill = valid.getMonth(), validTillYear = valid.getFullYear(), 
                        validFromMonth = monthNames[subscription.createdAt.getMonth()];
                        console.log("valid", valid)
                        let monthDiff = HelperService.getMonthDifferenceBtwDates(new Date(), valid);
                        // monthDiff = monthDiff<0 ? monthDiff*-1 : monthDiff;
                        console.log("monthDiff", monthDiff)
                        
                        if(subscription.createdAt > ConstantService.getSubscriptionModelChangeDate()){
                            monthDiff += 1
                            subscribedData.annualBalanceLeft = (monthDiff)*user.subscriptionLoyality;
                        }else{
                            subscribedData.annualBalanceLeft = (monthDiff)*user.subscriptionLoyality;
                            console.log(subscribedData.annualBalanceLeft)
                        }
                        console.log("monthDiff", monthDiff)
                        var validFromYear = subscription.createdAt.getFullYear(), currentDate = new Date() , currentMonth  = currentDate.getMonth();
                        let validFromText = validFromMonth+" "+validFromYear;
                        let validTillText = monthNames[validTill]+" "+validTillYear;
                        subscribedData.monthlyBalanceLeftDate =  monthNames[subscriptionDate.monthlyBalanceStart.getMonth()];
                        console.log(subscriptionDate)
                        if(subscription.createdAt > ConstantService.getSubscriptionModelChangeDate()){
                            validFromText = subscription.createdAt.getDate() + " " + validFromMonth+" "+validFromYear;
                            validTillText = valid.getDate() + " " +monthNames[validTill]+" "+validTillYear;
                            subscribedData.monthlyBalanceLeftDate =  subscriptionDate.monthlyBalanceStart.getDate() + " " + monthNames[subscriptionDate.monthlyBalanceStart.getMonth()] + " to " +  subscriptionDate.monthlyBalanceEnd.getDate() + " " + monthNames[subscriptionDate.monthlyBalanceEnd.getMonth()];
                        }

                        //renew gift case
                        if(subscription.actualPricePaid == 0){
                            imageUrl = "https://res.cloudinary.com/dyqcevdpm/image/upload/v1556534849/gift-and-earn-banner-app_188_mtwn9d.png"
                        }
                        var subAmount = (user.subscriptionId == 1) ? 500 : 200;
                        let tempBal = subscribedData.annualBalanceLeft;
                        console.log(tempBal, "tempBal")
                        currentPeriod = user.subscriptionValidity - (tempBal-500)/subAmount;
                        if(subscription.createdAt < ConstantService.getSubscriptionModelChangeDate()){
                            currentPeriod -= 1
                        }
                        var monthlyBalance =0;
                        var subPrice = (user.subscriptionId == 1) ? 1699 : 899;

                        var earnAmount = (user.subscriptionId == 1) ? 200 : 100;
                        var createdDate = new Date(subscription.createdAt);
                        var weekDate = HelperService.getNewWeekStart(14 , createdDate);
                        var extraMonth = user.subscriptionValidity -12 , extraBalance = 0;
                        if(user.subscriptionId == 1)extraBalance = subAmount*extraMonth;
                        else extraBalance = 200*extraMonth;

                        subscribedData.name = HelperService.titleCase(user.firstName.toLowerCase());
                        subscribedData.subscriptionType = (user.subscriptionId == 1) ? "SalonPass Gold" : "SalonPass Silver";
                        subscribedData.validFrom = validFromText;
                        subscribedData.noOfSubscriptionGifted = 5-user.subscriptionGiftHistory.length;
                        subscribedData.validTill = validTillText;
                        var noOfMonth  = (new Date().getTime()-valid.getTime())/(1000 * 3600 * 24); //days
                        console.log(noOfMonth, "noOfMonth")
                        subscribedData.isReadyToRenew = noOfMonth >= -30 ? true : false;
                        subscribedData.annualBalance = (user.subscriptionId == 1) ? 6000+extraBalance : 6000+extraBalance;
                        subscribedData.monthlyBalance = monthlyBalance;
                        subscribedData.currentPeriod = HelperService.getNumberInString(currentPeriod);
                        subscribedData.currentMonth = monthNames[currentMonth];
                        subscribedData.profilePic = user.profilePic;
                        subscribedData.referCode = user.referCode;
                        if(subscribedData.isReadyToRenew){
                            if(offValue == 0){
                                offValue = 200
                                offReferCode = "BEURENEW"
                            }
                        }
                        subscribedData.offValue = offValue;
                        subscribedData.renew = {
                              image : imageUrl,
                              title : "Renew before expiring to Rs "+offValue+" off",
                              subtitle : "You Saved Rs "+totalSavings+" over last "+subscribedData.noOfAppointments+" months through your subscription. So don't let your savings spree stop and rather get RS "+offValue+" off by susbscribing before due date."
                        };
                        subscribedData.isEligibleForGivingGift = subscription.actualPricePaid == 0 ? false : true;
                        // subscribedData.isEligibleForReferal = subscription.actualPricePaid == 0 ? false : true;
                        subscribedData.offReferCode = offReferCode;
                        subscribedData.referalUsed = user.subscriptionReferalHistory.length ? user.subscriptionReferalHistory.length :0;
                        subscribedData.spendMore = '<div style="color: #64a422;font-size:.8em;font-weight: 700;text-align:center">Add 1 Free Month To Your SalonPass Subscription Every Time You Shop Above ₹ 3000</div>'
                        subscribedData.renewSubtitle = '<div style="color: #64a422;font-size:.8em;font-weight: 700;text-align:center">Add 1 Free Month To Your SalonPass Subscription Every Time You Shop Above ₹ 3000</div>'
                        // if(new Date() < new Date(weekDate)){
                        //   subscribedData.heading = '<div style="text-align:center"><span style="font-size:1em;"> Refer your friends to Be U Subscription before <span style="font-size:1em;color: #827717;font-weight: 700;">'+weekDate+'</span> and get <span style="font-size:1em;color: #827717;font-weight: 700;">2 months added</span></span><span style="font-size:1em;"> (12 +2) to your subscription, once every user subscribes.</span></div>' ;
                        // }else{
                            subscribedData.earnReferralMessage = 'Hey, Enjoy free services worth Rs 500/month by subscribing to Be U salon’s annual subscription like me. I have gifted you a 1 month free trial, so download the app through this link & activate your free trial now.: '; 
                          subscribedData.heading = 'When your friend buys subscription with your referral code, you both earn/save Rs. '+earnAmount+', on each referral'  ;
                           subscribedData.heading2 = 'Share 1 month subscription with 5 unique friends, where they get Rs. 500 worth free services as a free trial for that month.'  ;
                        // }
                        
                        subscribedData.referMessage = "Save Rs 200 on your Be U Annual Subscription (pay Rs 1699 & enjoy free services worth Rs 500/month, for 1 full year) purchase by using my referral code @@ ";

                        obj.selectSubscription.isSubscribed = user.subscriptionId ? true : false;
                        console.log(obj.selectSubscription.isSubscribed+' subId')
                        if(user.subscriptionRenewDate){
                            subscribedData.isReadyToRenew = false
                        }
                        obj.selectSubscription.isReadyToRenew = subscribedData.isReadyToRenew;
                        subscribedData.renewText =  subscribedData.isReadyToRenew ? 'Renew before expiring to get ₹ 200 off' :  'Renew before expiring to get 1 month extra';

                        obj.selectSubscription.subscribedData = subscribedData;


                       User.getSubscriptionLeftByMonthv4(req.body.userId, new Date(), user.subscriptionLoyality , function(balance) {
                        console.log("balance", balance)
                          if(subscription.createdAt > ConstantService.getSubscriptionModelChangeDate()){
                              obj.selectSubscription.subscribedData.annualBalanceLeft -= subAmount;
                          }

                          obj.selectSubscription.subscribedData.monthlyBalance = balance;
                          obj.selectSubscription.subscribedData.annualBalanceLeft += balance;
                          console.log(obj.selectSubscription.isSubscribed+' subId')
                           return res.json(CreateObjService.response(false, obj));
                       });

                    }else{
                      return res.json(CreateObjService.response(true, "Subscription does not exist"));
                    }
              }else{
                  console.log('1111')
                  return res.json(CreateObjService.response(false, obj));
              }
                  })
          }else{
            console.log('22222')
            return res.json(CreateObjService.response(true, "User does not exist."));
          }
        })
        })
    })
});

router.post('/subscriptionHomePage',(req,res)=>{
  var monthNames = ["Jan", "Feb", "Mar", "April", "May", "June","July", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let data={},d = new Date(),sum=0, buyDate, subscribedData = {}, totalSavings = 0;
    let imageUrl = "https://res.cloudinary.com/dyqcevdpm/image/upload/v1554539843/1080-x-632-subscription-renewal-banner-before-expiry-_1_zhr6zj.png"
    
    async.each([1],(val,cb)=>{
        User.findOne({ _id : req.body.userId},{subscriptionRenewDate : 1 ,subscriptionGiftHistory : 1,subscriptionValidity :1, referCode:1,profilePic :1,latitude :1, longitude :1, gender :1 ,firstName:1,lastName:1 ,subscriptionId : 1, subscriptionLoyality : 1, subscriptionRedeemMonth : 1 , subscriptionReferalHistory:1, subscriptionBuyDate : 1} , function(err,user){
            data = ConstantService.getSubscriptionCardNew(user ? user.gender : "F" , 0);
            buyDate = user.subscriptionBuyDate 
            subscribedData.name = user.firstName + user.lastName
            Appointment.find({"client.id" : req.body.userId, status : {$in : [1,3]}, loyalitySubscription : {$gt: 0}}, {loyalitySubscription : 1, parlorTax : 1, tax : 1}, function(er, appointments){
                subscribedData.noOfAppointments = appointments.length;
                _.forEach(appointments, function(a){
                    totalSavings += (a.parlorTax > 0 || a.tax > 0 ? a.loyalitySubscription*1.18 : a.loyalitySubscription);
                })
                totalSavings = parseInt(totalSavings)
                subscribedData.totalSavings = totalSavings
            })    
            SubscriptionSale.find({userId:req.body.userId},(err,subscription)=>{
                if(subscription.length>0){
                    let last = subscription.length
                    data.selectSubscription.isSubscribed = user.subscriptionId!=0 ? true : false
                    if(data.selectSubscription.isSubscribed){
                        subscribedData.annualBalance = user.subscriptionLoyality*(user.subscriptionValidity)
                        subscribedData.validFrom = buyDate.getDate() + " " + monthNames[buyDate.getMonth()] + " " + buyDate.getFullYear()
                        // subscribedData.validFrom = new Date(buyDate.getFullYear(),buyDate.getMonth(),buyDate.getDate())
                        let year = parseInt(user.subscriptionValidity/12) + buyDate.getFullYear()
                        let month = user.subscriptionValidity%12+buyDate.getMonth()
                        if((user.subscriptionValidity%12+buyDate.getMonth())>11){
                            year = year + 1
                            month = (user.subscriptionValidity%12+buyDate.getMonth()) - 12
                        }
                        subscribedData.validTill = buyDate.getDate() + " " + monthNames[month] + " " +year
                        //subscribedData.validTill = new Date(year,month,buyDate.getDate())
                        subscribedData.subscriptionType = "GOLD"
                        subscribedData.referCode = user.referCode
                        subscribedData.isEligibleForGivingGift  = (subscription[last-1].actualPricePaid>0)&&(user.subscriptionGiftHistory.length<5) ? 1 : 0
                        subscribedData.giftTrialLeft = (user.subscriptionGiftHistory.length<5) ? (5-user.subscriptionGiftHistory.length) : 0
                        let dateObj = AppointmentHelperService.getSubscriptionCycleDates(buyDate)
                        subscribedData.monthStart = dateObj.startDate.getDate() + " " + monthNames[dateObj.startDate.getMonth()] 
                        subscribedData.monthEnd = dateObj.endDate.getDate() + " " + monthNames[dateObj.endDate.getMonth()] 
                        subscribedData.currentMonth = HelperService.getMonthDifferenceBtwDates2(buyDate,dateObj.startDate) + 1
                        subscribedData.displayDetails = ConstantService.getDisplayDetails()
                        subscribedData.isReadyToRenew = (user.subscriptionValidity-subscribedData.currentMonth)==0 ? true:false

                        subscribedData.renewOffValue = 0 
                        subscribedData.offReferCode = ""
                        subscribedData.renew = {image : "",title : "",subtitle : ""};
                        if(subscribedData.isReadyToRenew){
                            subscribedData.renewOffValue = 200
                            imageUrl = subscription[last-1].actualPricePaid!=0 ? "https://res.cloudinary.com/dyqcevdpm/image/upload/v1554539843/1080-x-632-subscription-renewal-banner-before-expiry-_1_zhr6zj.png" : "https://res.cloudinary.com/dyqcevdpm/image/upload/v1556534849/gift-and-earn-banner-app_188_mtwn9d.png"
                            subscribedData.offReferCode = "BEURENEW200"
                            subscribedData.renew = {
                                image : imageUrl,
                                title : "Renew before expiring to Rs "+subscribedData.renewOffValue+" off",
                                subtitle : "You Saved Rs "+totalSavings+" over last "+subscribedData.noOfAppointments+" months through your subscription. So don't let your savings spree stop and rather get RS "+subscribedData.renewOffValue+" off by susbscribing before due date."
                            };
                        }
                        console.log(dateObj.startDate.getMonth())
                        Appointment.find({'client.id':req.body.userId,appointmentStartTime:{$gt:dateObj.startDate,$lt:dateObj.endDate},loyalitySubscription:{$gt:0},status:{$in:[1,3,4]}},(err,appointments)=>{
                            console.log(appointments)
                            appointments.forEach((ap)=>{
                                val = ap.loyalitySubscription
                                if(ap.parlorTax>0||ap.tax>0) {val = ap.loyalitySubscription*1.18}
                                sum=sum+val
                            })
                            sum = parseInt(sum)
                            subscribedData.monthlyBalance = sum>500 ? 0 : (500-sum)
                            subscribedData.annualBalanceLeft = ((user.subscriptionValidity - subscribedData.currentMonth)*500)+subscribedData.monthlyBalance;
                            cb()
                        })
                    }else{
                        subscribedData.isReadyToRenew = true
                        subscribedData.renewOffValue = 200
                        imageUrl = "https://res.cloudinary.com/dyqcevdpm/image/upload/v1554539843/1080-x-632-subscription-renewal-banner-after-expiry-_2_upomsl.png"
                        subscribedData.offReferCode = "BEURENEW200"
                        if(subscription[last-1].actualPricePaid!=0){
                            subscribedData.renewOffValue = 500
                            imageUrl = "https://res.cloudinary.com/dyqcevdpm/image/upload/v1554539843/1080-x-632-subscription-renewal-banner-after-expiry-_3_bc46s5.png"
                            subscribedData.offReferCode = "BEURENEW500"
                        }
                        subscribedData.renew = {
                            image : imageUrl,
                            title : "Renew before expiring to Rs "+subscribedData.renewOffValue+" off",
                            subtitle : "You Saved Rs "+totalSavings+" over last "+subscribedData.noOfAppointments+" months through your subscription. So don't let your savings spree stop and rather get RS "+subscribedData.renewOffValue+" off by susbscribing before due date."
                        };
                        cb()
                    }
                } else{
                    subscribedData.isReadyToRenew = false
                    subscribedData.renewOffValue = 0
                    subscribedData.offReferCode = ""
                    subscribedData.renew = {image : "",title : "",subtitle : ""};
                    cb()
                }
            })
        })
    },()=>{
        data.selectSubscription.subscribedData = subscribedData 
        return res.json(CreateObjService.response(false, data));
    })
})

router.post('/getQuestionAnswers' , function(req,res) {
  console.log("aaya")
    User.findOne({ _id: req.body.userId},{questionAnswers :1}, function(err,user){
       var answerIds = []
       if(user && user.questionAnswers.length>0){
          _.forEach (user.questionAnswers , function(u){
            _.forEach(u.answers , function(a){
              answerIds.push(ObjectId(a));
            })
          })
       }

       UserQuestionAnswers.aggregate([
                  {$match:{active:true}},
                  {$unwind :"$answers"} ,
                  {$project : {
                          "selectedAnswers.isSelected":{$cond: { if: { $in: [ "$answers._id", answerIds] }, then: true, else: false }} , 
                          questionCategoryId:1, questionCategory:1 ,question:1 ,answers:1 ,"selectedAnswers._id" : "$answers._id" , 
                          "selectedAnswers.answer" : "$answers.answer" , type : 1}
                  },
                  {$project : {type:"$type" , questionId:"$_id" ,answers :"$selectedAnswers" ,question:"$question" , questionCategory:"$questionCategory" , questionCategoryId:"$questionCategoryId" }},
                  {$group:{_id:"$questionId" , type: {$first:"$type"}, question:{$first:"$question"} , questionCategory:{$first:"$questionCategory"}, questionCategoryId:{$first :"$questionCategoryId"},
                  answers:{$push:"$answers"} }},
                  {$group:{_id: "$questionCategoryId",questionCategoryId :{$first:"$questionCategoryId"} , questionCategory: {$first:"$questionCategory"} ,
                  questions :{$push :{type: "$type",questionId :"$_id" ,question:"$question" ,answers: "$answers" }}}},
                  {$project :{_id: 0,questionCategoryId: "$questionCategoryId" ,type:"$type", questionCategory:"$questionCategory" , questions : "$questions"}},
                  {$sort :{questionCategoryId: 1}}
            ],function(err,questions){
                if(err){
                    return res.json(CreateObjService.response(true, "There is some Error"));
                }else{
                    return res.json(CreateObjService.response(false, questions));
                }
        })
    }) 
});


router.post('/submitQuestionAnswers' , function(req,res) { 
console.log("submitQuestionAnswers" , req.body)
  var updateObj = req.body.questionAnswers;
  var now_date = new Date(); now_date.setMonth(now_date.getMonth() + 1)

    User.update({_id : req.body.userId} , {questionAnswers : updateObj} , function(err, updatedUser){
      if(updatedUser){
        User.findOne({_id : req.body.userId} , {questionAnswers :1 , couponCodeHistory : 1} , function(err , user){
          var preferCode = "";
          _.forEach(user.couponCodeHistory,function(u){
            if(u.code == "PROFILE15")preferCode = u.code
            else preferCode
          })
        
          if(user.questionAnswers.length == 9 && preferCode != 'PROFILE15'){
            
            User.update({_id : req.body.userId} , { $push: { couponCodeHistory: { $each: [{active: true, createdAt: new Date(),code: "PROFILE15", couponType: 8,  expires_at: now_date}] } } } , function(err, couponUpdated){
              return res.json(CreateObjService.response(false, "Coupon Added Successfully"))
            })
          }else 
            return res.json(CreateObjService.response(false, "Successfully Submitted"))
           
          })
      }
      else
        return res.json(CreateObjService.response(true , "There is some Error"));
    })
});


router.post('/getHomePageBottomSheet' , function(req,res) {
  console.log(req.body)
  console.log("androidVersionNew" , androidVersionNew)
    var type = 0 , subscription = false, curentAppointment = null;
    User.findOne({_id : req.body.userId},{iosVersion : 1, androidVersion:1 , questionAnswers : 1, subscriptionId : 1 , newAndroidVersion:1} , function(err,user){
      if(!user.subscriptionId  || user.subscriptionId == 0)subscription = false
        else subscription = true;
      
      User.update({_id: req.body.userId} , {newAndroidVersion : req.body.versionAndroidCode} , function(err , userUpdate){
        Appointment.findOne({'client.id' : req.body.userId , status:3 , subscriptionAmount : 0 , payableAmount :{$gt : 0}},{parlorName : 1, review : 1 , parlorId : 1}).sort({appointmentStartTime :-1}).limit(1).exec(function(err , appt){
           Appointment.findOne({'client.id' : req.body.userId , status:{$in : [4,1]}, appointmentStartTime : {$lt : new Date()}, subscriptionAmount : 0 , payableAmount :{$gt : 0}},{parlorId : 1}).sort({appointmentStartTime :-1}).limit(1).exec(function(err , curentAppointment){
            console.log(curentAppointment);
            console.log("curentAppointment");

        // else if(subscription == false)type = 6;

       if(req.body.versionAndroid && (req.body.versionAndroid != user.androidVersion && user.androidVersion != "1.1.4.85")){ 
          // if(req.body.versionAndroid && (req.body.versionAndroid != user.androidVersion && user.androidVersion != "1.1.4.52")){ 

          //   type = 2
          // }
          if(req.body.versionAndroidCode &&  req.body.versionAndroidCode > 177){ 

            type = 2
          }
        }
          else if(appt && !appt.review.rating) type = 1;
          else if(req.body.versionIos && (req.body.versionIos != user.iosVersion  && user.iosVersion != "1.57")) {type = 2}
            
          else if(user.questionAnswers.length < 9) type = 5;  
          if(curentAppointment) type = type != 2 ? 7 : 2;
          // else type = 6;

          if(type != 0){
              var bottomSheetData = ConstantService.getHomePageBottomSheet(type , subscription);
              if(type == 7){
                  bottomSheetData.data.appointmentId = curentAppointment._id;
              }
              if(type == 1){  
                  bottomSheetData.data.parlorId = appt.parlorId;
                  bottomSheetData.data.appointmentId = appt._id;
                  bottomSheetData.data.heading1 = "Review Your Experience - at "+appt.parlorName+"";
              }
              return res.json(CreateObjService.response(false, bottomSheetData.data));
          }else{
                return res.json(CreateObjService.response(true, []));
          }
          
        })
        })
    })
});
});


router.post('/subscriptionHistory' , function(req,res){
  var months = ['January', 'February', 'March', 'April', 'May','June', 'July', 'August', 'September','October', 'November', 'December'];
    Appointment.aggregate([{$match :{'client.id' :ObjectId(req.body.userId),status:3,loyalitySubscription:{$gt:0}}},
                          {$project : {month :{$month :"$appointmentStartTime"} , annualBalance :"$client.subscriptionLoyality" , clientName :"$client.name",
                                      date: {'$dateToString': {format: '%m/%d/%Y', date: '$appointmentStartTime'}} , payableAmount:1 ,loyalitySubscription:1, parlorName:1,
                                      parlorAddress2:1,parlorTax:1 ,clientId:'$client.id'}},
                          {$group :{_id:"$month" ,clientId:{$first:"$clientId"},  annualBalance :{$first :"$annualBalance"},clientName :{$first :"$clientName"},
                                      appointments : {$push :{date: "$date",payableAmount:"$payableAmount" ,loyalitySubscription:"$loyalitySubscription",
                                      parlorName :"$parlorName",parlorAddress2:"$parlorAddress2", parlorTax:"$parlorTax"}}}} ,  
                          {$sort:{_id:1}},           
                          {$group:{_id: "$clientId" , annualBalance :{$first :"$annualBalance"} ,clientName :{$first :"$clientName"},months:{$push :{
                                      month:"$_id" , appointments:"$appointments"}}}}
          ], function(err , agg) {
            console.log(agg)
            User.findOne({_id: req.body.userId},{subscriptionValidity: 1}, function(err, user){
              var extraMonth = user.subscriptionValidity -12;
              console.log(extraMonth)
              if(agg){
                _.forEach(agg , function(a){
                   if(a.annualBalance == 200){
                    var extraBalance = 200*extraMonth;
                      a.subscriptionType = "Silver";
                      a.annualBalance = ""+(2400+extraBalance) - (a.annualBalance * a.months.length)+"/"+(2400+extraBalance)+""
                      
                    }else{
                      var extraBalance = 500*extraMonth;
                      a.subscriptionType ="Gold";
                      a.annualBalance = ""+(6000+extraBalance) - (a.annualBalance * a.months.length )+"/"+(6000+extraBalance)+""
                    }
                    _.forEach(a.months , function(mon){
                      mon.month = months[mon.month -1]
                     
                    })
                  
                })

                _.forEach(agg , function(a){
                    _.forEach(a.months , function(m){
                        _.forEach(m.appointments , function(app){
                          if(app.parlorTax != 0)app.loyalitySubscription = Math.ceil(app.loyalitySubscription * (1 + app.parlorTax/100));
                        })
                    })
                })
                return res.json(CreateObjService.response(false , agg))
              }
              else
                return res.json(CreateObjService.response(false , "No Subscription Redemption"))
            })
          })
});


// router.post('/onBottomSheetClose' , function(req, res){
//   User.findOne({_id: req.body.userId}, {parlors: 0}, function(err , user){
    
//   })
// })

router.post('/changeGender', function(req,res){
  User.findOne({_id:req.body.userId},{gender:1,genderUpdated:1},(err,user)=>{
    if(!user.genderUpdated){
      let gender = user.gender=='M'?'F':'M'
      User.update({_id:req.body.userId},{gender:gender,genderUpdated:true},(err,userUpdated)=>{
        if(err)return res.json(CreateObjService.response(false, 'Error in updating'));
        else return res.json(CreateObjService.response(false, 'Gender updated successfully'));
      })
    }else{
      return res.json(CreateObjService.response(false,'Cannot change Gender'));
    }
  })
})

module.exports = router;
