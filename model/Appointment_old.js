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
var request=require('request');



var appointmentSchema = new Schema({

    parlorId: { type: Schema.ObjectId, ref: 'parlor', required: true },

    parlorAppointmentId: { type: 'number', required: true },

    parlorName: { type: 'String', default : 'test' },

    parlorAddress: { type: 'String' },

    parlorAddress2: { type: 'String' },

    contactNumber: { type: 'String' },

    mode: { type: 'number', default : 3 }, // 1- android, 2 - ios, 3 - web, 4 - phone call

    client: {

        id : { type: Schema.Types.ObjectId, ref: 'User'},
        customerId : {type : 'number'},
        name: { type: 'String', required: true },
        phoneNumber: { type: 'String', required: true },
        emailId: { type: 'String' },
        gender: { type: 'String' },
        creditsLeft : {type : 'number'},
        noOfAppointments : {type : 'number', default : 0}
    },


    review : {

      userImage : { type: 'string', default: ''},

      text : { type: 'string'},

      rating : { type: 'number'},

      createdAt : { type: 'date'}

    },

    receptionist: {
        userId: { type: Schema.ObjectId },
        name: { type: 'String' },
        phoneNumber: { type: 'String'},
        gender: { type: 'String' }
    },

    freeLoyalityPoints : {type : 'number', default : 0},

    loyalityOffer : {type : 'number', default : 0},

    noOfTimeOtpSend : {type : 'number', default : 0},

    onlinePaymentDiscount : {type : 'number', default : 0},

    editedByCrm : {type : 'number', default : 0},

    cashbackUsed : {type : 'Boolean', default : false},

    latitude : { type: 'number',  default : null },

    longitude : { type: 'number',  default : null },

    appointmentStartTime: { type: 'date', required: true },

    appointmentEndTime: { type: 'date' },

    status: { type: 'number', default: 1 }, // 1 - appointment pending, 2 - declined, 3 - finished, 4 - started

    appointmentType: { type: 'number', default: 1 }, // 1 - walkin , 2 - call, 3 - online

    paymentMethod: { type: 'number', default: 1 }, //1 - cash, 2 - card, 3 - advance cash, 4 - advance online, 5 - razor pay, 6 - paytm, 12- multiple , 13 - nearby , 8 - amex card, 11 - nearby, 10 - beu

    notificationSent: { type: 'number', default: 0 },

    estimatedTime: { type: 'number', default: 0, required: true },

    membersipCreditsLeft: { type: 'number', default: 0 },

    comment: { type: 'string', default: ''},

    services: {
        type: [{

            id: { type: 'number' },

            categoryId: { type: Schema.ObjectId },

            serviceId: { type: Schema.ObjectId },

            serviceCode: {type : 'number'},

            name: { type: 'String', required: true },

            serviceName: { type: 'String', required: true },

            type: { type: 'String' },

            quantity: { type: 'number', required: true },

            discount : {type : 'number', default : 0},

            frequencyDiscountUsed : { type: 'Boolean', default : false},

            membershipDiscount : {type : 'number', default : 0},

            loyalityPoints : {type : 'number', default : 0},

            discountMedium: { type: 'string' },

            additions: { type: 'Number' },

            gstNumber : { type: 'string' },

            gstDescription : {type : 'string'},

            revenue:{type:'Number'},

            typeIndex : {type : 'number', default : null},

            productId : {type : Schema.ObjectId, default : null},

            brandProductDetail : {type : 'String', default : ''},

            productRatio : {type : 'number', default : 1},

            brandId : {type : Schema.ObjectId, default : null},

            brandRatio : {type : 'number', default : null},

            creditsUsed : {type : 'number', default : 0},

            employees: { type : [{
                employeeId : {type : Schema.ObjectId},
                name : {type : 'String'},
                commission : {type : 'number'},
                distribution : {type : 'number'}}]
            },

            employeeId: { type: Schema.ObjectId },

            creditsSource: { type : [{
                parlorId : {type: Schema.ObjectId },
                credits : {type: 'number' }}]
                ,defaultsTo : []
            },

            estimatedTime: { type: 'number' },

            price: { type: 'number', required: true },

            subtotal: { type: 'number', required: true },

            additionIndex: { type: 'number', default : 0 },

            tax: { type: 'number', required: true },

            dealId: { type: Schema.ObjectId},

            frequencyDealFreeService : { type: 'number'},

            frequencyPrice : { type: 'number'},

            dealPriceUsed : {type : 'Boolean', default : false},

            actualPrice: { type: 'number', required: true },

            actualDealPrice : {type : 'number', default : 0},

            clientFirstAppointment : {type : 'Boolean', default : false},

        }], defaultsTo: []
    },

    products: {
        type: [
            {
                productId: {type: 'number'},
                code: {type: 'number'},
                name: {type: 'String'},
                quantity: {type: 'number'},
                price: {type: 'number'},
                tax: {type: 'number'},
                costPrice: {type: 'number'},
                commission: {type : 'number'},
                employeeId: {type: Schema.ObjectId},
                employee: {type: 'String'}
            }
        ], defaultsTo: []
    },

    departmentRevenue: {
        type: [
            {
                departmentId: {type: Schema.ObjectId},
                revenue: {type: 'number', default : 0},
                noOfService: {type: 'number', default: 0},
            }
        ], defaultsTo: []
    },

    noOfService : {type : 'number', default : 0},

    serviceRevenue : {type : 'number', default : 0},

    productRevenue : {type : 'number', default : 0},

    freebiesThreading : {type : 'number', default : 0},

    employees: {
        type: [
            {
                employeeId : {type : Schema.ObjectId},
                name: { type: 'string', required: true },
                estimatedTime: { type: 'number' },
                commission: { type: 'number' },
                revenue: { type: 'number' }
            }
        ], defaultsTo: []
    },

    allPaymentMethods: {
        type: [
            {
                value: { type: 'number', required: true },
                name: { type: 'string' },
                amount: { type: 'number', required: true }
            }
        ], defaultsTo: []
    },

    otherCharges: { type: 'number', required: true },

    productPrice : {type : 'number', required : true, default : 0},

    subtotal: { type: 'number', required: true },

    tax: { type: 'number', required: true },

    discount: { type: 'number', required: true, default:0 },

    couponCode: { type: 'string', default: null },

    discountOnOnlinePayment : {type : 'Boolean', default : false},

    discountMedium : {type : 'string', default : 'none'},

    creditUsed: { type: 'number',  default:0 },

    membershipDiscount: { type: 'number', required: true, default:0 },

    loyalityPoints: { type: 'number', default:0 },

    membershipId: { type: Schema.Types.ObjectId, ref: 'Membership'},

    buyMembershipId: { type: Schema.Types.ObjectId, ref: 'Membership'},

    useMembershipCredits: { type: Schema.Types.ObjectId, ref: 'Membership'},

    membershipAmount : {type : 'number', default : 0},

    closedBy: { type: Schema.Types.ObjectId, default : null},

    membershipType: { type: 'number', required: true, default: 0},

    cashback: { type: 'number', required: true, default:0 },

    payableAmount: { type: 'number', required: true, default:0 },

    advanceCredits: { type: 'number', default:0 },

    oldCredits: { type: 'number', default:0 },

    useAdvanceCredits : {type : 'Boolean', default : false},

    isPaid : {type : 'Boolean', default : false},

    appBooking : {type : 'number', default : 1}, // 1 - crm, 2 - app

    bookingMethod : {type : 'number', default : 1}, // 1 - crm, 2 - website, 3 - android, 4 - ios

    useOldCredits : {type : 'Boolean', default : false},

    otp: { type: 'string', required: false, default:0 },

    createdAt: { type: 'date' },

    updatedAt: { type: 'date' },

    razorPayCaptureResponse : {},

    razorPayObj : {},

    razorRefundObj : {},

    salonEmailId : {type : 'string'}
});

var RAZORPAY_KEY = localVar.getRazorKey();
var RAZORPAY_APP_SECRET = localVar.getRazorAppSecret();

appointmentSchema.statics.refundPayment = function(req, callback){
    var Razorpay = require('razorpay');
    var instance = new Razorpay({
          key_id: RAZORPAY_KEY,
          key_secret: RAZORPAY_APP_SECRET
    });
    Appointment.findOne({_id : req.body.appointmentId, status : 2, paymentMethod : 5}, function(err, appointment){
        if(!appointment){
            return callback(CreateObjService.response(true, 'Invalid appointment Id'));
        }else{
            instance.payments.refund(appointment.razorPayObj.id, appointment.payableAmount, function(error, response){
                Appointment.update({_id : req.body.appointmentId}, {razorRefundObj : response}, function(e, a){
                    return callback(CreateObjService.response(true, 'Amount Refunded'));
                });
            });
        }
    });
};

appointmentSchema.statics.captureRazorPayment = function(instance, obj, callback) {
    instance.payments.fetch(obj.razorpay_payment_id, function(err, appointment){
        console.log(appointment);
        if(!err && appointment.notes.appointmentId){
            Appointment.findOne({_id : appointment.notes.appointmentId, status : {$in:[0,1,4]}}, function(err2, app){
                Appointment.count({'client.id' : app.client.id, status : { $in : [1,3,4] }, paymentMethod : 5, appointmentStartTime : {$gt : HelperService.getTodayStart()} }, function(err, count){
                    if(!err2){
                        if(app){
                            console.log("book by app");
                            var loyalityPoints = 0, loyalityWithoutTax= 0;
                            var discountOnOnlinePayment = ((app.payableAmount - 100 ) * 100 ) == (parseInt(appointment.amount)) ? true : false;
                            if(discountOnOnlinePayment && app.payableAmount> 200 && count < 1){
                                app.payableAmount = app.payableAmount - 100;
                                loyalityWithoutTax = 100;
                            }
                            if(obj.bookByNewApp){
                                console.log(app.payableAmount);
                            }
                            console.log(parseInt(app.payableAmount + app.membershipAmount) * 100)
                            console.log("***************" +parseInt(appointment.amount))
                         //   app.payableAmount = Math.ceil(Math.floor(app.subtotal - app.loyalityPoints - app.creditUsed - app.membershipDiscount)*1.18);
                                    console.log(parseInt(app.payableAmount + app.membershipAmount) * 100)
                            if(parseInt(app.payableAmount + app.membershipAmount) * 100 == parseInt(appointment.amount)){
                                console.log("ifffffffffffffffffffffff")
                                instance.payments.capture(obj.razorpay_payment_id, obj.amount, function(error, response){
                                    console.log(error);
                                    if(!error){
                                        User.findOne({_id : app.client.id}, function(err, user){
                                            Appointment.update({_id : appointment.notes.appointmentId, status : {$in:[0,1,4]}}, {appBooking : 2, paymentMethod : 5, status : 1, razorPayObj : appointment, razorPayCaptureResponse : response, isPaid : true,payableAmount : app.payableAmount, $inc : { loyalityPoints : loyalityPoints},freeLoyalityPoints : loyalityWithoutTax, loyalityOffer : app.loyalityOffer + loyalityPoints, onlinePaymentDiscount : loyalityPoints,
                                                bookingMethod : 2, allPaymentMethods : [{ value :  10, name : 'beu', amount : app.payableAmount}]}, function(err, resp){
                                                Parlor.findOne({_id : app.parlorId}, function(err, parlor){
                                                    var message = {type : "A" , name : app.client.name, amount : app.payableAmount, appointmentId : app.parlorAppointmentId };
                                                    var socketD = 'newOrder';
                                                    if(app.appointmentType != 3) {
                                                        message = {type : "P" , name : app.client.name, amount : app.payableAmount, appointmentId : app.parlorAppointmentId };
                                                        socketD = 'payment';
                                                    }
                                                    io.sockets.in(app.parlorId+"").emit(socketD, {data: message});
                                                        Appointment.findOne({_id : appointment.notes.appointmentId}, function(err, newAppointmentObj){

                                                            if(newAppointmentObj.buyMembershipId){
                                                                Appointment.addMembershipToUser(user.id, newAppointmentObj.buyMembershipId, newAppointmentObj.membershipAmount);
                                                            }
                                                            Appointment.count({'client.id': user.id, status: {$in: [3]}, paymentMethod: 5, cashbackUsed : true}, function (err, cashbackCount) {

                                                            var getFreebies = getFreebiesPoints(5, newAppointmentObj, cashbackCount, false, user.isCorporateUser);
                                                            sendCashbackReferal(getFreebies.loyality, user.id, user.firstName, user.firebaseId, user.firebaseIdIOS, 0);
                                                            Appointment.useLoyalityAndFreeServices(newAppointmentObj, user, function(sss){
                                                                if(sss)
                                                                    return callback(CreateObjService.response(false, 'Appointment Booked'));
                                                                else
                                                                    return callback(CreateObjService.response(true, 'Freebies Not present'));
                                                            });
                                                            });
                                                        })

                                                    });
                                                });
                                                app.paymentMethod = 5;
                                                var usermessage = Appointment.appointmentBookedSms(app, user.firstName, user.phoneNumber);
                                                Appointment.sendSMS(usermessage, function(e){
                                                    Appointment.sendAppointmentMail(app, user.emailId, function(){
                                                        // return callback(CreateObjService.response(false, 'Appointment Booked'));
                                                    });
                                            });
                                        });
                                    }else{
                                        return callback(CreateObjService.response(true, 'Unable to capture transaction'));
                                    }
                                });
                            }else{
                                console.log("invalid amount");
                                return callback(CreateObjService.response(true, 'Invalid amount'));
                            }
                        }else{
                            return callback(CreateObjService.response(true, 'Invalid appointment id captured - ' + appointment.notes.appointmentId));
                        }
                    }else{
                      return callback(CreateObjService.response(true, 'Invalid appointment Id'));
                    }
                });
            });
        }else{
            return callback(CreateObjService.response(true, 'Invalid razor payment Id'));
        }

    });
};

appointmentSchema.statics.addMembershipToUser = function(userId, membershipId, membershipAmount){
    Membership.findOne({_id : membershipId}, function(err, membership){
        var obj =  {
            parlorId : localVar.getMembershipParlorId(),
            membershipId : membership.id,
            userId : userId,
            name : membership.name,
            credits : membership.credits,
            validFor : HelperService.addMonthsToDate(membership.validFor),
            discountPercentage : membership.discountPercentage,
            price : membership.price,
            paymentMethods : [{ value :  10, name : 'beu', amount : membershipAmount}],
        };

        MembershipSale.create(obj, function (err, r) {
                User.update({_id: userId}, {
                    $push: {
                        "activeMembership": {
                            createdAt: new Date(),
                            amount: membership.credits,
                            creditsLeft: membership.credits,
                            type: membership.type,
                            name: membership.name,
                            parlorId : localVar.getMembershipParlorId(),
                            membershipId: membership.id,
                            validTo: HelperService.addMonthsToDate(membership.validFor)
                        }
                    }
                }, function (err, data) {

                });
            });
    });
};

appointmentSchema.statics.registerAppointment = function (req, callback) {
    var registerAppointment = 0;
    User.getOldLoyalityPoints(req.body.userId, function(oldLoyalityPoints){
        User.findOne({_id : req.body.userId}).populate('activeMembership.membershipId').exec(function(err, user){
            User.update({_id : req.body.userId}, {lastCartActivity : new Date()}, function(err, obj){
                var parlorFound = _.some(user.parlors, function(p){ return p.parlorId + "" == req.body.parlorId; });
                if(parlorFound){

                    Appointment.find({'client.id' : user.id, status : {$in : [1, 4]}, creditUsed : {$gt : 0} }, {creditUsed : 1}, function(err, appts){
                            var t = 0;
                            _.forEach(appts, function(a){
                                t += a.creditUsed;
                            });
                            if(user.activeMembership.length>0){
                                user.activeMembership[0].creditsLeft = user.activeMembership[0].creditsLeft - t < 0 ? 0 : user.activeMembership[0].creditsLeft - t;

                            }
                            Appointment.createAppointmentIdForUser(user, req, oldLoyalityPoints, function(response){
                                return callback(response);
                            });
                    });
                }else{
                    var newP = {parlorId : req.body.parlorId, createdBy : req.body.userId, noOfAppointments : 0, createdAt : new Date(), updatedAt : new Date()};
                    User.update({_id : user.id}, {$push : {'parlors' : newP }}, function(err, updte){
                        user.parlors.push(newP);
                        Appointment.createAppointmentIdForUser(user, req,  oldLoyalityPoints, function(response){
                            // return res.json(response);
                            return callback(response);
                        });
                    });
                }
            });
        });
    });
}

appointmentSchema.statics.maximumLoyalityRedeemtion = function(user, appointment, oldLoyalityPoints, paymentMethod){
    var loyalityPointCanBeUsed = 0;
    var redemption = (ParlorService.getFreebiesRedeemedPercentage(appointment.subtotal-appointment.loyalityOffer, paymentMethod))/100;
    var loyalityLimit = user.allow100PercentDiscount ? 1 : redemption;
    var loyalityPointCanBeUsedOldUser = Math.floor(0.25 * (appointment.subtotal-appointment.loyalityOffer));
    if(oldLoyalityPoints > 0){
        if(oldLoyalityPoints >= loyalityPointCanBeUsedOldUser){
            loyalityPointCanBeUsed = loyalityPointCanBeUsedOldUser;
            appointment.subtotal = appointment.loyalityOffer;
        }else{
            loyalityPointsUsed = oldLoyalityPoints;
            appointment.subtotal = appointment.subtotal - parseInt((oldLoyalityPoints * 100)/25) + appointment.loyalityOffer;
        }
    }
    loyalityPointCanBeUsed += Math.floor(loyalityLimit * (appointment.subtotal-appointment.loyalityOffer));
    loyalityPointCanBeUsed = loyalityPointCanBeUsed < 2500 ? loyalityPointCanBeUsed : 2500;
    return user.loyalityPoints > loyalityPointCanBeUsed ? loyalityPointCanBeUsed : user.loyalityPoints;
};


appointmentSchema.statics.captureAppointment = function(req, callback){
    if(req.body.paymentMethod == 5){
          console.log("razer");
          var Razorpay = require('razorpay');
          var instance = new Razorpay({
              key_id: RAZORPAY_KEY,
              key_secret: RAZORPAY_APP_SECRET
          });
          var obj = {
              razorpay_payment_id : req.body.razorpay_payment_id,
              bookByApp : req.body.bookByApp,
              amount : req.body.amount,
              bookByNewApp : req.body.bookByNewApp,
          };
          Appointment.captureRazorPayment(instance, obj, function(response){
              return callback(response);
          });
      }else{
          Appointment.captureCodPayment(req, function(response){
              return callback(response);
          });
      }
};
appointmentSchema.statics.appointmentDetails=function (req, newLoyalityPoints, callback) {

    Appointment.count({
        'client.id': req.body.userId,
        status: {$in: [3]},
        appointmentType: 3,
        cashbackUsed : true,
    }, function (err, count) {
        console.log(count);
        User.findOne({_id: req.body.userId}, function(err, user){
            Appointment.find({'client.id' : user.id, status : {$in : [1, 4]}, creditUsed : {$gt : 0} }, {creditUsed : 1}, function(err, appts){
                var t = 0;
                _.forEach(appts, function(a){
                    t += a.creditUsed;
                });
        Appointment.findOne({
            _id: req.body.appointmentId,
            'client.id': req.body.userId
        }).populate('parlorId').exec(function (err, appointment) {
            if (appointment){
                var obj = Appointment.parseSingleAppointmentForApp(appointment, true);
                var ll = appointment.loyalityPoints - appointment.loyalityOffer;
                var activeMemberships = _.map(user.activeMembership, function(mem){
                    mem.creditsLeft = mem.creditsLeft.toFixed(2);
                    return {
                        name : mem.name,
                        credits : mem.creditsLeft - t < 0 ? 0 : parseFloat((mem.creditsLeft - t).toFixed(2)),
                    };
                });
                obj.usableMembership = activeMemberships;
                obj.usableLoyalityPoints = appointment.status == 1  ? user.loyalityPoints + ll : user.loyalityPoints;
                if(appointment.status == 1 || appointment.status == 4){
                    obj.loyalityPoints = newLoyalityPoints;
                    obj.payableAmount = Math.ceil((appointment.subtotal - obj.loyalityPoints - obj.loyalityOffer)*1.18);
                    obj.tax = Math.ceil((appointment.subtotal - obj.loyalityPoints - obj.loyalityOffer)*0.18);
                }
                var percentage = ParlorService.getPercentageCashback(req.body.paymentMethod, count);
                obj.discountMessage = "Get "+percentage+"% cashback on "+(req.body.paymentMethod == 5 ? "digital " : "cash " ) +" payment!";
                obj.threadingDiscountAvailable = true;
                obj.freebiesTerms =  ParlorService.getFreebiesRedeemedPercentage(appointment.subtotal - appointment.loyalityOffer, req.body.paymentMethod) + "% Of Total Bill Amount Can Be Used As Freebies";
                obj.suggestion = ParlorService.getFreebiesRedeemedPercentageSuggestion(appointment.subtotal - appointment.loyalityOffer, req.body.paymentMethod);
                var getFreebies = getFreebiesPoints(req.body.paymentMethod, appointment, count, true, user.isCorporateUser);
                obj.alertMessage =('Hey ' + appointment.client.name +', ' + getFreebies.loyality + ' freebies ') + ' will be credited to your account post appointment.';
                obj.membershipTax = parseInt(parseInt(appointment.membershipAmount/1.18)*0.18)
                return callback(false,obj);
                // return res.json(CreateObjService.response(false, obj));
            } else {
                return callback(true,'Invalid appointment id');
                // return res.json(CreateObjService.response(true, 'Invalid appointment id'));
            }
        });
        });
    });
    });
}


appointmentSchema.statics.captureCodPayment = function (req, callback) {
    Appointment.findOne({_id : req.body.appointmentId}, function(err, appt){
        appt.payableAmount = Math.ceil(Math.floor(appt.subtotal - appt.loyalityPoints - appt.creditUsed - appt.membershipDiscount)*1.18);

        User.findOne({_id : appt.client.id}, function(err, user2){
            Appointment.useLoyalityAndFreeServices(appt, user2, function(status){
                if(status){
                    Appointment.update({_id : req.body.appointmentId, status: { $in : [0, 1, 4 ]}}, {appBooking : 2, allPaymentMethods : [], paymentMethod : 1, status : 1, isPaid : false, bookingMethod : 2, payableAmount : appt.payableAmount}, function(err, resp){
                        Appointment.findOne({_id : req.body.appointmentId}, function(err, appointment){
                            User.findOne({_id : appointment.client.id}, function(err, user){
                                var message = {type : "A" , name : appointment.client.name, amount : appointment.payableAmount, appointmentId : appointment.parlorAppointmentId };
                                 io.sockets.in(appointment.parlorId+"").emit('newOrder', {data: message});
                                return callback(CreateObjService.response(false, 'Appointment Booked'));
                                var usermessage = Appointment.appointmentBookedSms(appointment, user.firstName, user.phoneNumber);
                                Appointment.sendSMS(usermessage, function(e){
                                    Appointment.sendAppointmentMail(appointment, user.emailId, function(){
                                        // return callback(CreateObjService.response(false, 'Appointment Booked'));
                                    });
                                });
                            });
                        });
                    });
                }else
                    return callback(CreateObjService.response(true, 'Freebies Not present'));

            });
        });
    });
};

appointmentSchema.statics.useLoyalityAndFreeServices = function(appointment, user, callback) {
    var updateObj = {}, allCheck = true;
    if(appointment.loyalityPoints-appointment.loyalityOffer > 0){
        var loyalityPoints = user.loyalityPoints - (appointment.loyalityPoints - appointment.loyalityOffer);
        if(loyalityPoints < 0)allCheck = false;
        updateObj.loyalityPoints = loyalityPoints;
        if(!updateObj.$push) updateObj.$push = {};
            updateObj.$push.creditsHistory = { $each : [ {createdAt: new Date(), amount: -1 * (appointment.loyalityPoints - appointment.loyalityOffer), balance : loyalityPoints, source : appointment.id , reason : 'Used for appointment'} ]} ;
    }

    _.forEach(appointment.services, function(s){
        if(s.type == 'deal'){
            var reimbursed = false;
            allCheck = false;
            user.freeServices = _.forEach(user.freeServices, function(free){
                if(free.serviceId + "" == s.serviceId + ""){
                     if((free.parlorId + "" == appointment.parlorId + "" || free.parlorId == null) && !reimbursed){
                        free.noOfService -= s.quantity;
                        reimbursed = true;
                        if(free.noOfService < 0){
                            allCheck = false;
                        }else allCheck = true;
                     }
                }
            });
            user.freeServices =  _.filter(user.freeServices, function(s) {
                return  s.noOfService > 0;
            });
            updateObj.freeServices = user.freeServices;
        }
    });
    if(allCheck){
        User.update({_id : appointment.client.id}, updateObj, function(err, d){
            return callback(true);
        });
    }else
        return callback(false);
}

appointmentSchema.statics.dailyReport = function (query,date, callback) {
    var data = {
        reports : [],
        payment : [{mode:"Cash", amount: 0}, {mode: "Card", amount: 0},{mode: "Affiliate", amount: 0},{mode: "BeU", amount: 0},{mode: "AMEX", amount: 0},{mode: "Others", amount: 0},{mode: "Total", amount: 0}],
        customers : [{type : "New Customers", number: 0, services:0, amount:0}, {type : "Old Customers", number: 0, services:0, amount:0}],
        totalMembershipSale : 0,
        avgInvoiceSale:0,
        avgServiceSale:0,
        status : [{type : "Cancelled", number: 0, value:2},{type : "Completed", number:0, value:3}],
        employee:[],
        attendance:[{type:"On Time", number:0 },{type:"Late", number:0},{type:"No Show", number:0}],
        totalEmployees:0,
        totalRevenueToday:0,
        totalServiceRevenue:0,
        totalCollectionToday:0,
        totalSalesToday:0,
        totalTaxToday:0,
        totalProductSale : 0,
        totalServiceSale : 0,
        totalMembershipRedeem : 0,
        totalLoyalityPoints: 0,
        totalAdvanceUsed : 0,
        totalAdvanceAdded : 0,
        payableAmount:0,
        avgServicesPerInvoice:0,
        totalAppointments:0,
        totalRedemptionToday:0,
        redemption:[{mode: "Membership", amount: 0},{mode: "Advance", amount: 0},{mode:"Loyalty Redemption", amount: 0},{mode:"Total", amount: 0}],
        salesService:0
    };
    Parlor.findOne(query).exec(function(err, parlor){
        SuperCategory.find({}, function (err, supercategories) {
            _.forEach(supercategories, function (s) {
                data.reports.push({
                    unit: s.name,
                    service: 0,
                    package: 0,
                    product: 0,
                    membership: 0,
                    advance: 0,
                    totalRevenue: 0,
                    totalSale:0,
                    totalTax: 0,
                    membershipCredits : 0,
                    totalCollection:0,
                    parlorName: parlor.name ,
                    parlorAddress:parlor.address2
                });
            });

            Admin.find({parlorId: query._id,active:true, position:{$exists:true}}, function(err, employees) {
                _.forEach(employees, function(e){
                    data.employee.push({
                        employeeId : e.id,
                        name : e.firstName + " " + e.lastName,
                        totalRevenueEmp : 0
                    });
                });

                ServiceCategory.find({}, function (err, categories) {
                Appointment.find({parlorId: query._id, status: 3, appointmentStartTime: {$gte: HelperService.getDayStart(date), $lt: HelperService.getDayEnd(date)}
                }, function (err, appointments) {
                    data.totalAppointments=appointments.length;
                    _.forEach(appointments, function (appointment) {
                        _.forEach(appointment.products,function(prd){
                            data.totalProductSale += (prd.price * prd.quantity);
                                for(var i=0;i<data.employee.length;i++){
                                    if(data.employee[i].employeeId == prd.employeeId) {
                                       data.employee[i].totalRevenueEmp += (prd.price*prd.quantity);
                                    }
                                }
                        });

                        data.totalRevenueToday += appointment.serviceRevenue ;
                        data.totalRevenueToday += appointment.productRevenue;
                        data.totalMembershipRedeem += appointment.creditUsed;
                        data.totalLoyalityPoints += appointment.loyalityPoints;
                        if(appointment.paymentMethod != 4) {
                            if(!_.filter(appointment.allPaymentMethods, function(a){ return a.value == 4})[0])
                                data.payableAmount += appointment.payableAmount;
                        }
                        data.totalAdvanceUsed += appointment.useAdvanceCredits ? appointment.advanceCredits : 0;

                        if(appointment.allPaymentMethods.length>0){
                            _.forEach(appointment.allPaymentMethods, function(pay){
                                if (pay.value == 1){
                                    data.payment[0].amount += pay.amount ;
                                    data.payment[6].amount += pay.amount ;
                                }
                                else if(pay.value == 2) {
                                    data.payment[1].amount += pay.amount;
                                    data.payment[6].amount += pay.amount;
                                }
                                else if(pay.value == 4){
                                    data.redemption[1].amount += pay.amount;
                                    data.redemption[3].amount += pay.amount;
                                    // data.payment[6].amount += pay.amount;
                                }
                                else if(pay.value == 11){
                                    data.payment[2].amount += pay.amount;
                                    data.payment[6].amount += pay.amount;
                                }
                                else if(pay.value == 10 || pay.value == 5){
                                    data.payment[3].amount += pay.amount;
                                    data.payment[6].amount += pay.amount;
                                }
                                else if(pay.value == 8){
                                    data.payment[4].amount += pay.amount;
                                    data.payment[6].amount += pay.amount;
                                }
                                else {
                                    data.payment[5].amount += pay.amount;
                                    data.payment[6].amount += pay.amount;
                                }
                            });
                        }
                        else{
                            if(appointment.paymentMethod == 1){
                                data.payment[0].amount += appointment.payableAmount;
                                data.payment[6].amount += appointment.payableAmount;
                            }
                            else if(appointment.paymentMethod == 2){
                                data.payment[1].amount += appointment.payableAmount;
                                data.payment[6].amount += appointment.payableAmount;
                            }
                            else if(appointment.paymentMethod == 4){
                                data.payment[2].amount += appointment.payableAmount;
                                // data.payment[6].amount += appointment.payableAmount;
                            }
                            else if(appointment.paymentMethod == 11){
                                data.payment[2].amount += appointment.payableAmount;
                                data.payment[6].amount += appointment.payableAmount;
                            }
                            else if(appointment.paymentMethod == 10){
                                data.payment[3].amount += appointment.payableAmount;
                                data.payment[6].amount += appointment.payableAmount;
                            }
                            else if(appointment.paymentMethod == 8){
                                data.payment[4].amount += appointment.payableAmount;
                                data.payment[6].amount += appointment.payableAmount;
                            }
                            else {
                                data.payment[5].amount += appointment.payableAmount;
                                data.payment[6].amount += appointment.payableAmount;
                            }
                        }

                        if (appointment.client.noOfAppointments == 0) {
                            data.customers[0].number++;
                            data.customers[0].services += appointment.services.length;
                            data.customers[0].amount += appointment.payableAmount;
                        }
                        else {
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
                            if(appointment.loyalityPoints){
                                data.redemption[2].amount+=(appointment.loyalityPoints * 0.75);
                                data.redemption[3].amount+=(appointment.loyalityPoints * 0.75);
                            }
                        // });
                        Appointment.populateDepartmentValue(data.reports,categories, parlor.services, appointment, parlor.tax,data.employee);
                        if(appointment.creditUsed!=undefined){
                            data.redemption[0].amount+=appointment.creditUsed;
                            data.redemption[3].amount+=appointment.creditUsed;
                        }
                        if(appointment.useAdvanceCredits){
                            data.redemption[1].amount+=appointment.advanceCredits;
                            data.redemption[3].amount+=appointment.advanceCredits;
                        }
                    });
                    data.reports.forEach(function(dep){
                    data.totalTaxToday += dep.totalTax;
                    // data.totalRevenueToday += dep.totalRevenue ;
                    data.totalServiceSale += dep.totalSale ;
                    });

                    MembershipSale.find({parlorId: query._id, createdAt: {$gt: HelperService.getDayStart(date), $lt: HelperService.getDayEnd(date)}}, function (err, ms) {
                       Advance.find({parlorId: query._id, createdAt: {$gt: HelperService.getDayStart(date), $lt: HelperService.getDayEnd(date)}}, function (err, advance) {
                       _.forEach(advance,function(adv){
                           data.totalAdvanceAdded += adv.amount;
                           data.payment[0].amount += adv.amount;
                           data.payment[6].amount += adv.amount;
                       });
                        _.forEach(ms, function (m) {
                            data.totalMembershipSale += m.price;
                            data.totalTaxToday += m.price*0.18;
                            m.paymentMethods.forEach(function(method){
                                if(method.value==1){
                                    data.payment[0].amount += method.amount ;
                                data.payment[6].amount += method.amount ;}
                                else
                                {
                                    data.payment[1].amount += method.amount;
                                    data.payment[6].amount += method.amount;
                                }
                            })
                        });
                           data.totalSalesToday += data.totalServiceSale + data.totalMembershipSale +data.totalProductSale;
                           // data.totalRevenueToday+=data.totalProductSale;
                           data.avgInvoiceSale = (data.totalRevenueToday ) / appointments.length;
                           data.numberOfInvoice=appointments.length;
                           data.avgServiceSale = (data.customers[0].amount + data.customers[1].amount) / (data.customers[0].services + data.customers[1].services);
                           data.totalServiceRevenue += data.totalRevenueToday - data.totalProductSale
                           data.totalCollectionToday = data.payableAmount + data.totalMembershipSale*1.18 + data.totalAdvanceAdded ;
                        return callback(err, data);
                       });
                    });
                });

            });
                data.totalEmployees = employees.length;
                var min=new Date();
                Attendance.find({employeeId:{$regex:employees.id}, createdAt:{$gte: HelperService.getDayStart(date), $lt: HelperService.getDayEnd(date)}},function(err,attendance){
                    _.forEach(attendance,function(a){
                        if(a.createdAt<=min){
                            min=a.createdAt;
                        }
                    });
                        var time=new Date();
                        min=HelperService.getDayEnd(date);
                        employees.createdAt=min;
                        if(employees.createdAt <=time ) {
                            data.attendance[0].number++;
                        }
                        else if(employees.createdAt > time) {
                            data.attendance[1].number++;
                        }
                        else {
                            data.attendance[2].number++;
                        }
                    })
            });

        });
    });
};
appointmentSchema.statics.weeklyReport = function (parlor,month,callback) {
    var data={
        emp:[],
        weekData:[],
        parlorName:parlor.name,
        parlorAddress:parlor.address2
    };
    var parlorId = parlor.id;
    Appointment.find({parlorId: parlorId, status: 3}, {appointmentStartTime : 1, 'services.discountMedium' : 1, 'services.frequencyDiscountUsed' : 1, 'services.price' : 1,'services.additions' : 1,'services.quantity' : 1,'services.discount' : 1,'services.membershipDiscount' : 1,'services.loyalityPoints' : 1, 'products.quantity' : 1, 'products.price' : 1}, function (err, appointments) {
        var date=new Date();
        var y = date.getFullYear();
        var dates=[{startDate:new Date(y,month,1, 0, 0, 0), endDate:new Date(y,month,7, 23, 59, 59)},
            {startDate:new Date(y,month,8, 0, 0, 0), endDate:new Date(y,month,14, 23, 59, 59)},
            {startDate:new Date(y,month,15, 0, 0, 0), endDate:new Date(y,month,21, 23, 59, 59)},
            {startDate:new Date(y,month,22, 0, 0, 0), endDate:new Date(y,month,28, 23, 59, 59)}];
        if((month!=1)){
            dates.push({startDate:new Date(y,month,29, 0, 0, 0),endDate:HelperService.getLastDateOfMonth(y,month)});
        }
        _.forEach(dates,function(date) {
            var mon = HelperService.getDayStart(date.startDate);
            var mon1 = HelperService.getDayEnd(date.endDate);
            var d1 = mon.getDate() +"/"+ (mon.getMonth()+1) +"/"+ y;
            var d2 = mon1.getDate() +"/"+ (mon.getMonth()+1) +"/"+ y;
            var objTobe={
                startDate: d1,
                endDate:d2,
                productSale:0,
                serviceSale :0,
                totalSale:0
            };
            _.forEach(appointments,function(app){
                if(app.appointmentStartTime.getTime() >= date.startDate.getTime() && app.appointmentStartTime.getTime() < date.endDate.getTime()) {
                    _.forEach(app.services , function(service){
                        service.employees = [];
                        var serviceRevenue = Appointment.serviceFunction(service, data.emp);
                        objTobe.serviceSale += serviceRevenue.totalSale;
                        objTobe.totalSale += serviceRevenue.totalSale;
                    });
                    _.forEach(app.products, function (prd) {
                        objTobe.productSale += (prd.price * prd.quantity);
                        objTobe.totalSale += (prd.price * prd.quantity);
                    });
                }
            });
            data.weekData.push(objTobe);
        });
        return callback(err, data);
    })

};


appointmentSchema.statics.monthlyReport = function (parlor,startDate,endDate,callback) {
        var data = {
            reports : [{unit:"others",totalRevenue:0,totalSale:0,totalTax:0}],
            parlorName: parlor.name,
            parlorAddress: parlor.address2,
            totalProductSale: 0,
            newRevenue:0,
            employee:[]
        };
        var parlorId = parlor.id;
    Parlor.findOne({_id : parlorId}, {_id : 1,services : 1, tax : 1}, function(err, parlor) {
        SuperCategory.find({}).sort({sortOrder:1}).exec( function (err, supercategories) {
            _.forEach(supercategories, function (s) {
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
                    totalAdvanceAdded:0,
                    totalLoyalityPoints: 0,
                    payableAmount: 0,
                    totalAppointments: 0,
                    totalRedemption: 0,

                });
            });
            ServiceCategory.find({}, function (err, categories) {
                Appointment.find({parlorId: parlorId, status: 3, appointmentStartTime: {$gte: HelperService.getDayStart(startDate), $lt: HelperService.getDayEnd(endDate)}
                }, {products : 1, loyalityPoints : 1, payableAmount : 1, services : 1,serviceRevenue:1}, function (err, appointments) {

                    data.reports.totalAppointments = appointments.length;
                    _.forEach(appointments, function (appointment) {
                        data.newRevenue +=appointment.serviceRevenue;
                        _.forEach(appointment.products, function (prd) {
                            data.totalProductSale += (prd.price * prd.quantity);
                        });
                        data.reports.totalLoyalityPoints += appointment.loyalityPoints;
                        if (appointment.paymentMethod != 11) {
                            data.reports.payableAmount += appointment.payableAmount;
                        }

                        Appointment.populateDepartmentValue(data.reports, categories, parlor.services, appointment, parlor.tax, data.employee);
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


/*appointmentSchema.statics.otherServicesWithfreeServices =function(date, callback2){
        Appointment.aggregate
            (
                "$match" : {
                    appointmentStartTime: {$gte: date.date, $lt: HelperService.getDayEnd(date.date)},
                    status : 3,
                    "services.discountMedium" :"frequency",
                    "services.dealId":null,
                    "services.dealPriceUsed" : true,
                },
                ).exec(function(err, appt){
                    var clientIds = _.map(appt, function(a){ return a.client.id; });
                    parlor.freeHairCutCount = appt.length;
                    Appointment.aggregate(
                      {"$match" : {'client.id' : {$in : clientIds}, status : 3}
                      },
                      {
                           "$project": {
                                "services": { "$size": "$services" },
                                subtotal : 1,
                                loyalityPoints : 1,

                            }
                      },
                      { $group : {
                            '_id': null,
                            total: { $sum : {$subtract: [ "$subtotal", "$loyalityPoints" ] }},
                            count: { $sum: "$services"}
                        }
                        }
            ).exec(function(err, response){
                if(response.length == 0)response = [{total : 0, count : 0}];
                parlor.otherServicesRevenue = response[0].total;
                parlor.otherServicesCount = response[0].count - parlor.freeHairCutCount;
                return callback2();
            });
        });
};*/
appointmentSchema.statics.recommendationScheduler = function(e, callback){
    var nodemailer = require('nodemailer');
    var date = new Date();
    var cDate = new Date((date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear());
    Notification.find({action: 'recommendation',sent:false}).exec(function(err,recommend){
        _.forEach(recommend,function(rc){
            var rcDate = rc.sendingDate;
            var rDate = new Date((rcDate.getMonth() + 1) + "/" + rcDate.getDate() + "/" + rcDate.getFullYear());
            if(cDate == rDate){
                var d = [];
                var data1 = {type: "recommendation", title: rc.title, body: rc.body};
                var dataSms= rc.smsContent;
                var async = require('async');
                User.findOne({_id:rc.userId}).exec(function (err, users) {
                    var fbId = [], fbIos = [],  emails = [], phone = [];
                    _.forEach(users, function (user) {
                        if (user.firebaseId) fbId.push(user.firebaseId);
                        if (user.firebaseIdIOS) fbIos.push(user.firebaseIdIOS);
                        if (user.emailId) emails.push(user.emailId);
                        if (user.phoneNumber) phone.push(user.phoneNumber)
                    });
                    async.parallel([
                        function (done) {
                            async.each([ 1, 2], function (p, callback) {
                                if (p == 1) {
                                    Appointment.sendAppNotificationAdmin(fbId, data1, function (err, data) {
                                        d.push(data);
                                        callback();
                                    })
                                }
                                if (p == 2) {
                                    Appointment.sendAppNotificationIOSAdmin(fbIos, data1, function (err, data) {
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
                    Appointment.sendSMS(recommSms, function (e) {
                    });
                    function sendEmail() {
                        var transporter = nodemailer.createTransport('smtps://info@beusalons.com:beusalons@123@smtp.gmail.com');
                        var mailOptions = {
                            from: 'info@beusalons.com', // sender address
                            to: "nikita@beusalons.com",
                            // to: [emails], // list of receivers
                            html:'',
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

    User.find({lastActiveTime:{$lt: new Date((new Date())-1000*60*60*720)}}).exec(function(err,users){
        var data1 = {type: "loginBased", title: 'We Miss You!', body: 'Itâ€™s been a while since we treated you with our nourishing and pampering treatments. Come, say a hi and experience heavenly services at unbelievable prices!'}
        var async = require('async');
        var d = [];
        var fbId = [], fbIos = [],  emails = [];
        _.forEach(users, function (user) {
            if (user.firebaseId) fbId.push(user.firebaseId);
            if (user.firebaseIdIOS) fbIos.push(user.firebaseIdIOS);
            if (user.emailId) emails.push(user.emailId);
        })
        async.parallel([
            function (done) {
                async.each([1, 2], function (p, callback) {
                    if (p == 1) {
                        Appointment.sendAppNotificationAdmin(fbId, data1, function (err, data) {
                            d.push(data);
                            callback();
                        })
                    }
                    if (p == 2) {
                        Appointment.sendAppNotificationIOSAdmin(fbIos, data1, function (err, data) {
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
                html:'',
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
        var number= user.phoneNumber;
        var usermessage = Appointment.ownerSms(number, data);
        Appointment.sendSMS(usermessage, function (e) {
        });
    })
}
appointmentSchema.statics.secondVisitRevenue = function(r, callback){
    Appointment.findOne({'client.id' : r._id, appointmentStartTime : {$gt : HelperService.addDaysToDate(r.date, 1)}}, {serviceRevenue : 1, appointmentStartTime : 1}).sort({'appointmentStartTime': -1}).exec(function(err, appointment){
        if(appointment){
            r.secondVisitDate = appointment.appointmentStartTime;
            r.secondVisitRevenue = appointment.serviceRevenue;
        }else{
        }
        callback();
    });
};

appointmentSchema.statics.otherServicesWithfreeServices =function(date, callback2){
    Async.each(date.parlors, function (parlor, callback) {
        var match  = {
                parlorId : ObjectId(parlor.parlorId), appointmentStartTime: {$gte: date.date, $lt: HelperService.getDayEnd(date.date)}, status: 3, "services.discountMedium" :"frequency" ,"services.dealId": null ,"services.dealPriceUsed" : true};
        Appointment.aggregate(
            {"$unwind" : "$services"},
            {"$match" : match
            },
            {$project : {'client.id'  : 1, 'services.loyalityPoints' : 1}},
            {$group : {
                '_id' : null,
                'clientIds': {$push: '$client.id' },
                'freeRevenue': {$sum: '$services.loyalityPoints' },
            }}
            ).exec(function(err, clients){
                if(clients.length == 0)clients = [{clientIds : [], freeRevenue : 0}];
                parlor.freeHairCutCount = clients[0].clientIds.length;
                Appointment.aggregate(
                  {"$match" : {'client.id' : {$in : clients[0].clientIds}, status : 3, appointmentStartTime: {$gte: date.date, $lt: HelperService.getDayEnd(date.date)}}
                  },
                  {
                       "$project": {
                            "services": { "$size": "$services" },
                            subtotal : 1,
                            loyalityPoints : 1,

                        }
                  },
                  { $group : {
                        '_id': null,
                        total: { $sum : {$subtract: [ "$subtotal", "$loyalityPoints" ] }},
                        count: { $sum: "$services"}
                    }
                    }
            ).exec(function(err, response){
                if(response.length == 0)response = [{total : 0, count : 0, freeRevenue: 0}];
                parlor.otherServicesRevenue = response[0].total;
                parlor.freeHairCutRevenue = clients[0].freeRevenue;
                parlor.otherServicesCount = response[0].count - parlor.freeHairCutCount;
                callback();
            });
        });
        }, function allTaskCompleted() {
            return callback2();
    });
};

appointmentSchema.statics.freeServiceReport =function(parlor,startDate,endDate,callback){
    var data={
        parlorName:parlor.name,
        parlorAddress:parlor.address2,
        amount:0,
        freeServices:0,
        serviceCount:[{type:"Male Hair Cut" , number:0} ,{type:"Female Hair Cut" , number :0} ,{type:"Blow Dry" , number : 0}]
    };
    Appointment.find({parlorId:parlor.id,"services.discountMedium" :"frequency" ,"services.dealId":null ,"services.dealPriceUsed" : true,status:3 ,
        appointmentStartTime: {$gte: HelperService.getDayStart(startDate), $lt: HelperService.getDayEnd(endDate)}},function(err,appt){
        if (appt) {
            data.freeServices = appt.length;
            _.forEach(appt,function(app) {
                _.forEach(app.services, function (ser) {
                    if (ser.serviceId == "58707eda0901cc46c44af2eb" && ser.dealId == null && ser.discountMedium == "frequency" && ser.dealPriceUsed == true ){
                        data.serviceCount[0].number++;
                        data.amount += ser.loyalityPoints
                    }
                    if (ser.serviceId == "58707eda0901cc46c44af417" && ser.dealId == null && ser.discountMedium == "frequency" && ser.dealPriceUsed == true) {
                        data.serviceCount[1].number++;
                        data.amount += ser.loyalityPoints
                    }
                    else if(ser.serviceId == "58707eda0901cc46c44af40f" && ser.dealId == null && ser.discountMedium == "frequency" && ser.dealPriceUsed == true) {
                        data.serviceCount[2].number++;
                        data.amount += ser.loyalityPoints
                    }
                });
            })
            return callback(err, data);
        }
    });
};

appointmentSchema.statics.oldNewAvgVisit = function (parlor,startDate,endDate,callback) {
    var data = {
        parlorName: parlor.name,
        parlorAddress: parlor.address2,
        customers: [{type: "New Guest", serviceNo:0, revenue:0, tickectNo:0, avgTicketSize:0},
                    {type: "Old Guest", serviceNo:0, revenue:0, tickectNo:0, avgTicketSize:0},
                    {type: "Total Guest", serviceNo:0, revenue:0, tickectNo:0, avgTicketSize:0}],
        employee:[]
    };
    var parlorId = parlor.id;
        Appointment.find({parlorId: parlorId, status: 3, appointmentStartTime: {$gte: HelperService.getDayStart(startDate), $lt: HelperService.getDayEnd(endDate)}
        }, { services : 1,client:1}, function (err, appointments) {
            _.forEach(appointments, function (app) {
                data.customers[2].tickectNo++;
                if(app.client.noOfAppointments == 0){
                    data.customers[0].tickectNo++;
                    _.forEach(app.services, function (s) {
                        var servicer = Appointment.serviceFunction(s,data.employee);
                        data.customers[0].serviceNo += s.quantity;
                        data.customers[0].revenue += servicer.totalRevenue;
                        data.customers[2].serviceNo += s.quantity;
                        data.customers[2].revenue += servicer.totalRevenue;
                    })
                }
                else if(app.client.noOfAppointments > 0) {
                    data.customers[1].tickectNo++;
                    _.forEach(app.services, function (s) {
                        var servicer = Appointment.serviceFunction(s,data.employee);
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

appointmentSchema.statics.oldNewBranchSeg = function (parlor,startDate,endDate,callback) {
    var data = {
        reports : [],
        parlorName: parlor.name,
        parlorAddress: parlor.address2,
        employee:[]
    };
    var parlorId = parlor.id;
    Parlor.findOne({_id : parlorId}, {_id : 1,services : 1, tax : 1}, function(err, parlor) {
        SuperCategory.find({}).sort({sortOrder:1}).exec( function (err, supercategories) {
            _.forEach(supercategories, function (s) {
                data.reports.push({
                    unit: s.name,
                    service: 0,
                    totalRevenue: 0,
                    customers: [{type: "New Guest", serviceNo:0, revenue:0},
                        {type: "Old Guest", serviceNo:0, revenue:0},
                        {type: "Total Guest", serviceNo:0, revenue:0}]
                });
            });
            ServiceCategory.find({}, function (err, categories) {
                Appointment.find({parlorId: parlorId, status: 3, appointmentStartTime: {$gte: HelperService.getDayStart(startDate), $lt: HelperService.getDayEnd(endDate)}
                }, { payableAmount: 1, services: 1,client:1}, function (err, appointments) {
                    _.forEach(appointments, function (appointment) {
                            Appointment.populateDepartmentValueCustomer(data.reports, categories, parlor.services, appointment, parlor.tax, data.employee);
                    });
                    return callback(err, data);
                })
            })
        });
    })
};

appointmentSchema.statics.populateDepartmentValueCustomer = function (reports, categories, services, appointment, tax,employee) {
    _.forEach(services, function(s){
        _.forEach(s.prices, function(p){
            _.forEach(appointment.services, function(ser){
                if(p.priceId == ser.id){
                    var category = categories.filter(function (el) {
                        return el.id == s.categoryId;
                    })[0];
                    _.forEach(reports, function(report){
                        if(report.unit == category.superCategory){
                            report.service += ser.quantity ;
                            var serviceRevenue = Appointment.serviceFunction(ser,employee);
                            if(appointment.client.noOfAppointments == 0) {
                                report.customers[0].serviceNo += ser.quantity;
                                report.customers[0].revenue += serviceRevenue.totalRevenue;
                                report.customers[2].serviceNo += ser.quantity;
                                report.customers[2].revenue += serviceRevenue.totalRevenue;
                            }
                            else if(appointment.client.noOfAppointments > 0) {
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

appointmentSchema.statics.monthlyVitalReport = function (parlor,startDate,endDate,callback) {
    var data = {
        reports : [],
        customers : [{type : "New Customers", number: 0, services:0, amount:0}, {type : "Old Customers", number: 0, services:0, amount:0}],
        totalMembershipSale : 0,
        categories:[],
        totalRevenue:0,
        totalServiceRevenue:0,
        totalCollection:0,
        totalProductSale : 0,
        totalServiceSale : 0,
        totalMembershipRedeem : 0,
        totalLoyalityPoints: 0,
        totalAdvanceAdded : 0,
        payableAmount:0,
        avgServicesPerInvoice:0,
        totalAppointments:0,
        totalRedemption:0,
        parlorName: parlor.name,
        parlorAddress: parlor.address2,
        repeatedCustomer:0,
        employee:[],
        totalNoServices:0
    };
    var parlorId = parlor.id;
        Appointment.find({parlorId: parlorId, status: 3, appointmentStartTime: {$gte: HelperService.getDayStart(startDate), $lt: HelperService.getDayEnd(endDate)}
        }, function (err, appointments) {
            data.totalAppointments = appointments.length;
            _.forEach(appointments, function (appointment) {
                _.forEach(appointment.products, function (prd) {data.totalProductSale += (prd.price * prd.quantity);});
                data.totalLoyalityPoints += appointment.loyalityPoints;
                if (appointment.paymentMethod != 11) {
                    data.payableAmount += appointment.payableAmount;
                }
                if (appointment.client.noOfAppointments == 0) {
                    data.customers[0].number++;
                    data.customers[0].services += appointment.services.length;
                    data.customers[0].amount += appointment.payableAmount;
                }
                else {
                    data.customers[1].number++;
                    data.customers[1].services += appointment.services.length;
                    data.customers[1].amount += appointment.payableAmount;
                }
                _.forEach(appointment.services, function (s) {
                    var servicer = Appointment.serviceFunction(s,data.employee);
                    data.totalServiceRevenue += servicer.totalRevenue;
                    data.totalNoServices += s.quantity;

                })
            });
            MembershipSale.find({parlorId: parlorId, createdAt: {$gt: HelperService.getDayStart(startDate), $lt: HelperService.getDayEnd(endDate)}
            }, function (err, ms) {
                Advance.find({parlorId: parlorId, createdAt: {$gt: HelperService.getDayStart(startDate), $lt: HelperService.getDayEnd(endDate)}
                }, function (err, advance) {
                    var query =[
                        {$match:{status:3,parlorId: ObjectId(parlorId),appointmentStartTime: {$gte: HelperService.getDayStart(startDate), $lt: HelperService.getDayEnd(endDate)}}},
                        {$group:{_id:"$client.id",count:{$sum:1}}},
                        {$match:{count:{$gt:1}}},
                        {$group:{_id:null,count:{$sum:1}}}
                        ]
                    Appointment.aggregate(query).exec(function(err,clients){
                        if(clients.length > 0){
                        data.repeatedCustomer = clients[0].count;
                    }
                    _.forEach(advance,function(adv){
                        data.reports.totalAdvanceAdded += adv.amount;
                    });
                    _.forEach(ms, function (m) {
                        data.reports.totalMembershipSale += m.price;
                    });
                    data.totalSales += data.totalServiceSale + data.totalMembershipSale + data.totalProductSale;
                    data.totalRevenue += data.totalProductSale +data.totalServiceRevenue;
                    data.totalCollection +=data.payableAmount + data.totalMembershipSale*1.18 + data.totalAdvanceAdded ;

                        return callback(err, data);
                    })
                });
            });
        });
};


appointmentSchema.statics.employeeSegmentReport = function(employee,startDate,endDate,callback){
    var data={
        employeeId: employee.id,
        name: employee.firstName + " " + employee.lastName,
        position:employee.position,
        totalRevenueEmp: 0,
        parlorName:"",
        parlorAddress:"",
        totalAppointments:0,
        productSale:{
            productNo:0,
            productRevenue:0
        },
        totalProductRevenueEmp:0,
        dep:[]
    };
    var parlorId = employee.parlorId;
    Parlor.findOne({_id : parlorId},{name:1 , address2:1}, function(err, parlor) {
        if(parlor) {
            data.parlorAddress = parlor.address2;
            data.parlorName = parlor.name;
        }
        ServiceCategory.find({}).sort({sort:1}).exec( function (err, categories) {
            _.forEach(categories, function (c) {
                data.dep.push({
                    unit: c.name,
                    serviceNo: 0,
                    totalRevenue: 0
                });
            });
            Appointment.find({parlorId: parlorId, "services.employees.employeeId" : employee.id,status: 3, appointmentStartTime: {$gte: HelperService.getDayStart(startDate), $lt: HelperService.getDayEnd(endDate)}
            }, function (err, appointments) {
                // if(appointments) {
                //     data.totalAppointments = appointments.length;
                // }
                _.forEach(appointments, function (appointment) {
                    data.totalAppointments ++;
                    _.forEach(appointment.products, function (prd) {
                        if(prd.employeeId == data.employeeId) {
                            data.productSale.productNo += prd.quantity;
                            data.productSale.productRevenue += (prd.price * prd.quantity);
                            data.totalProductRevenueEmp += data.productSale.productRevenue
                        }
                    });
                     _.forEach(appointment.services, function (ser) {
                        var category = categories.filter(function (el) {
                            return el.id == ser.categoryId;
                        })[0];
                        _.forEach(data.dep, function(report) {
                            if (report.unit == category.name) {
                                report.serviceNo += ser.quantity;
                                // _.forEach(ser.employees, function (emp) {
                                    var empObj = [{
                                        employeeId : employee.id,
                                        totalRevenueEmp : 0,
                                    }];
                                    var serviceRevenue = Appointment.serviceFunction(ser, empObj);
                                    report.totalRevenue += serviceRevenue.employees[0].totalRevenueEmp;
                                    data.totalRevenueEmp += serviceRevenue.employees[0].totalRevenueEmp;
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
};

 appointmentSchema.statics.employeePerformanceReport = function (employee,month,callback) {
    var data={
        employeeId: employee.id,
        name: employee.firstName + " " + employee.lastName,
        position:employee.position,
        empSalary:employee.salary,
        empTarget:employee.salary*5,
        month:[],
        totalProductRevenueEmp:0,
        totalRevenueEmp: 0,
        parlorName:"",
        parlorAddress:"",
        dep:[]
    };
     var appointmentCount=0;
     var serviceCount=0;
    var parlorId = employee.parlorId;
        Parlor.findOne({_id : parlorId},{name:1 , address2:1}, function(err, parlor) {
            if(parlor) {
                data.parlorAddress = parlor.address2;
                data.parlorName = parlor.name;
            }
                Appointment.find({parlorId: parlorId, "services.employees.employeeId" : employee.id, status: 3}, function (err, appointments) {
                        var date=new Date();
                        var y = date.getFullYear();

                       _.forEach(month,function(m) {
                          var dates={startDate: HelperService.getFirstDateOfMonth(y, m), endDate: HelperService.getLastDateOfMonth(y, m)}

                           data.month.push({
                               month: m,
                               serviceNo: 0,
                               totalRevenue: 0,

                           });
                               _.forEach(appointments, function (app) {
                                   if (app.appointmentStartTime.getTime() >= dates.startDate.getTime() && app.appointmentStartTime.getTime() < dates.endDate.getTime()) {

                                       _.forEach(app.products, function (prd) {
                                        _.forEach(data.month, function (report) {
                                            if(report.month == dates.startDate.getMonth()){
                                           data.totalProductSale += (prd.price * prd.quantity);
                                           if (data.employeeId == prd.employeeId) {
                                               data.totalProductRevenueEmp += (prd.price * prd.quantity);
                                           }
                                       }
                                   });
                                       });

                                       _.forEach(app.services, function (ser) {
                                           serviceCount++;
                                           _.forEach(data.month, function (report) {
                                            if(report.month == dates.startDate.getMonth()){
                                                report.serviceCount+=serviceCount;
                                                report.appointmentCount=appointments.length;
                                                report.serviceNo += ser.quantity;
                                               var empObj = [{
                                                   employeeId: employee.id,
                                                   totalRevenueEmp: 0
                                               }];
                                               var serviceRevenue = Appointment.serviceFunction(ser, empObj);
                                               report.totalRevenue += serviceRevenue.employees[0].totalRevenueEmp;
                                               data.totalRevenueEmp += serviceRevenue.employees[0].totalRevenueEmp;
                                            }
                                           })
                                       });
                                   }
                               });

                       });
                    data.totalRevenueEmp += data.totalProductRevenueEmp;
                    data.averageTicektSize += data.totalRevenueEmp/appointmentCount;
                    data.averageServiceSize += appointmentCount/serviceCount;
                    return callback(err, data);
            })
        })
};


appointmentSchema.statics.employeeIncentiveReport = function(employee,startDate,endDate,callback){
        var data={
            employeeId: employee.id,
            name: employee.firstName + " " + employee.lastName,
            position:employee.position,
            totalRevenueEmp: 0,
            empSalary:employee.salary,
            parlorName:"",
            parlorAddress:"",
            totalAppointments:0,
            product:{
                productNo:0,
                productRevenue:0
            },
            totalProductRevenueEmp:0,
            dep:[]
        };
        var parlorId = employee.parlorId;
        Parlor.findOne({_id : parlorId},{name:1 , address2:1,parlorType:1}, function(err, parlor) {
            // console.log("name" +parlor.name)
            if(parlor) {
                data.parlorAddress = parlor.address2;
                data.parlorName = parlor.name;
            }
            ServiceCategory.find({}).sort({sort:1}).exec( function (err, categories) {
                _.forEach(categories, function (c) {
                    data.dep.push({
                        unit: c.name,
                        unitId:c.id,
                        serviceNo: 0,
                        totalRevenue: 0,
                        totalIncentive:0
                    });
                });
                Appointment.find({parlorId: parlorId, "services.employees.employeeId" : employee.id,status: 3, appointmentStartTime: {$gte: HelperService.getDayStart(startDate), $lt: HelperService.getDayEnd(endDate)}
                }, function (err, appointments) {
                    Appointment.find({parlorId: parlorId, $where : "this.products.length>0" ,status: 3, appointmentStartTime: {$gte: HelperService.getDayStart(startDate), $lt: HelperService.getDayEnd(endDate)}
                    }, function (err, productAppoint) {
                        _.forEach(productAppoint , function(prdApp) {
                            _.forEach(prdApp.products, function (prd) {
                                if (prd.employeeId == employee.id) {
                                    _.forEach(data.product, function (product) {
                                        product.productNo += prd.quantity;
                                        product.productRevenue += (prd.price * prd.quantity);
                                        data.totalProductRevenueEmp += (prd.price * prd.quantity);
                                    });
                                }
                            });
                        })
                        Incentive.find({}, function (err, incentive) {
                            // console.log(incentive)
                            data.totalAppointments = appointments.length;
                            _.forEach(appointments, function (appointment) {
                                _.forEach(appointment.services, function (ser) {
                                    var category = categories.filter(function (el) {
                                        return el.id == ser.categoryId;
                                    })[0];
                                    _.forEach(data.dep, function (report) {
                                        if (report.unit == category.name) {
                                            report.serviceNo += ser.quantity;
                                            var empObj = [{
                                                employeeId: "" + employee.id,
                                                totalRevenueEmp: 0
                                            }];
                                            var serviceRevenue = Appointment.serviceFunction(ser, empObj);
                                            report.totalRevenue += serviceRevenue.employees[0].totalRevenueEmp;
                                            data.totalRevenueEmp += serviceRevenue.employees[0].totalRevenueEmp;
                                            var incentiveRevenue = Appointment.incentiveFunction(incentive, ser, employee, report, parlor.parlorType);
                                            report.totalIncentive = incentiveRevenue.totalIncentive;
                                        }
                                    })
                                })
                            });

                            data.totalRevenueEmp += data.totalProductRevenueEmp;
                            // console.log(data)
                            return callback(err, data);
                        })
                    })
                })
            })
        })
};

appointmentSchema.statics.serviceReportForAdmin =  function(services,  parlors, startDate, endDate, callback){
    var data = _.map(services, function(service){
        return{
        serviceName : service.name,
        serviceId : service.id,
        categoryId : service.categoryId,
        gender:service.gender,
        revenue : 0,
        count : 0,
        parlors : _.map(parlors, function(p){
            return{
                name : p.name,
                parlorId : p.id,
                revenue : 0,
                count : 0
            };
        })
        }
    });
    var query = {status : 3};
    if(startDate)query.appointmentStartTime = { $gt : startDate, $lt : endDate};
    Appointment.find(query, {services: 1, parlorId : 1}).sort({appointmentStartTime: -1}).exec(function(err, appointments){
        _.forEach(appointments, function(appt, key){
           _.forEach(data, function(d){
                _.forEach(d.parlors, function(par){
                    if(par.parlorId +"" == appt.parlorId + ""){
                        _.forEach(appt.services, function(service){
                            if(service.serviceId + "" == d.serviceId + ""){
                                var serviceRevenue = Appointment.serviceFunction(service, []);
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


appointmentSchema.statics.couponCodeListing = function (app, callback) {
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
    _.forEach(app.services, function (ser) {
        data.services.push({service: ser.name})
    });
    return callback(null, data);
};

appointmentSchema.statics.populateDepartmentValue = function (reports, categories, services, appointment, tax,employee) {
    _.forEach(appointment.services, function(ser){
        var found = false;
        _.forEach(services, function(s){
            // _.forEach(Appointment.parseServiceForReport(appointment.services), function(ser){
                if(s.serviceId + "" == ser.serviceId + ""){
                found = true;
                    var category = categories.filter(function (el) {
                            return el.id +"" == s.categoryId +"";
                        })[0];
                    _.forEach(reports, function(report){
                        if(report.unit == category.superCategory){
                             report.service += ser.quantity ;
                            // report.membershipCredits += ser.creditsUsed ;
                            report.totalTax += ((ser.subtotal) * ser.tax )/100;
                            var serviceRevenue = Appointment.serviceFunction(ser,employee);
                            report.totalRevenue += serviceRevenue.totalRevenue;
                            report.totalSale += serviceRevenue.totalSale;
                            // report.totalCollection += ((ser.subtotal) * ser.tax )/100 + ser.subtotal;
                        }
                    });
                }
        });
        if(!found){

            reports[0].service += ser.quantity ;
            reports[0].totalTax += ((ser.subtotal) * ser.tax )/100;
            var serviceRevenue = Appointment.serviceFunction(ser,employee);
            reports[0].totalRevenue += serviceRevenue.totalRevenue;
            reports[0].totalSale += serviceRevenue.totalSale;
        }
    });
};

appointmentSchema.statics.incentiveFunction=function(incentive,ser,empl,report,parlorType) {
    var totalIncentive = 0 , productIncentive=0;
    _.forEach(incentive, function (inc) {
        _.forEach(inc.parlors, function (par) {
            if(par.parlorType == parlorType){
                if (report.unitId == inc.categoryId ) {
                    _.forEach(par.incentives, function (incentive) {
                        if (report.totalRevenue >= incentive.range) {
                            totalIncentive = incentive.incentive;
                        }
                    })
                }
            }
        });
    });

    return {totalIncentive: totalIncentive};
};

appointmentSchema.statics.sendAppNotification = function(firebaseId, title, body, data, notificationId, callback){
    var FCM = require('fcm-push');
    var serverKey = 'AAAArI-Kg28:APA91bEu8Chz7RTT1yQsoHluOVZd5h16YsGtvfBz_xqLBzxy0vreu6PjaTNovMHoN0PzE0WWbYWUZEvHKU8bEwPYn9qz8ITmR81Gej1T5JIrzRpH8n12QE68Kvb5IBjOHEs7lJ65CQvglsn64qzDFH5Q5QgNDvzflA';
    var fcm = new FCM(serverKey);

        data.title=title;
        data.body=body;
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
    fcm.send(message, function(err, response){

        if (err) {
            return callback(err, null)
        } else {
            return callback(null, response);
        }
    });
};
appointmentSchema.statics.sendAppNotificationIOS = function(firebaseId, title, body, appointmentId, type, notificationId, callback){
    var FCM = require('fcm-push');
    var serverKey = 'AAAArI-Kg28:APA91bEu8Chz7RTT1yQsoHluOVZd5h16YsGtvfBz_xqLBzxy0vreu6PjaTNovMHoN0PzE0WWbYWUZEvHKU8bEwPYn9qz8ITmR81Gej1T5JIrzRpH8n12QE68Kvb5IBjOHEs7lJ65CQvglsn64qzDFH5Q5QgNDvzflA';
    var fcm = new FCM(serverKey);
    var message = {
        to: firebaseId, // required fill with device token or topics
        // data: data,
        priority : "high",
        notification: {
            title: title,
            body: body,
            type : type,
            appointmentId : appointmentId,
            notificationId : notificationId,
            sound: "default"
        }
    };
    //callback style
    fcm.send(message, function(err, response){
        console.log(err);
        console.log(response);
        if (err) {
            return callback(err, null)
        } else {
            return callback(null, response);
        }
    });
};
appointmentSchema.statics.sendAppNotificationAdmin = function(id,data, callback){
    var FCM = require('fcm-push');
    var serverKey = 'AAAArI-Kg28:APA91bEu8Chz7RTT1yQsoHluOVZd5h16YsGtvfBz_xqLBzxy0vreu6PjaTNovMHoN0PzE0WWbYWUZEvHKU8bEwPYn9qz8ITmR81Gej1T5JIrzRpH8n12QE68Kvb5IBjOHEs7lJ65CQvglsn64qzDFH5Q5QgNDvzflA';
    var fcm = new FCM(serverKey);
      var message = {
          registration_ids: id, // required fill with device token or topics
          collapse_key: 'your_collapse_key',
          data: data
      };
      fcm.send(message, function(err, response){
          console.log("android "+err)
          console.log("android "+response)
          if (err) {
            return callback(err, null)
          } else {
              return callback(null, 'SuccessAndroid');
          }
      });
};


appointmentSchema.statics.sendAppNotificationIOSAdmin = function(id,data, callback){
    console.log(data)
   var FCM = require('fcm-push');
    var serverKey = 'AAAArI-Kg28:APA91bEu8Chz7RTT1yQsoHluOVZd5h16YsGtvfBz_xqLBzxy0vreu6PjaTNovMHoN0PzE0WWbYWUZEvHKU8bEwPYn9qz8ITmR81Gej1T5JIrzRpH8n12QE68Kvb5IBjOHEs7lJ65CQvglsn64qzDFH5Q5QgNDvzflA';
    var fcm = new FCM(serverKey);
      var message = {
          registration_ids: id, // required fill with device token or topics
          priority : "high",
          notification: {
              title: data.title,
              body: data.body,
              type : data.type,
              notificationId : data.notificationId,
              sound: "default"
          }
      };
      fcm.send(message, function(err, response){
          console.log("ios "+err)
          console.log("ios "+response)
          if (err) {
            return callback(err, null)
          } else {
              return callback(null, 'SucessIOS');
          }
      });
};


appointmentSchema.statics.serviceFunction=function (service, employee) {
    var totalRevenue =0, totalSale = 0 , totalCount=0, serviceLoyalityRevenue = service.loyalityPoints * 0.75;
    if(service.discountMedium == "frequency" && !service.frequencyDiscountUsed) {
        totalRevenue += 0;
        totalSale += (service.price+service.additions)*service.quantity  - service.discount;
    }else if(service.discountMedium == "frequency" && service.frequencyDiscountUsed) {
        totalRevenue += ((service.price + service.additions)*service.quantity - (service.membershipDiscount ? service.membershipDiscount : 0));
        totalSale += (service.price + service.additions)*service.quantity;
        if(service.loyalityPoints){
            totalRevenue -= service.price * 0.25;
            totalSale -= service.loyalityPoints * 0.25;
        }
    }
    else{
        if(service.discount){
            totalRevenue += (service.price - service.discount +service.additions)*service.quantity;
            totalSale += (service.price - service.discount + service.additions)*service.quantity;
        }else {
            totalRevenue += (service.price + service.additions)*service.quantity;
            totalSale += (service.price + service.additions)*service.quantity;
        }
        if (service.membershipDiscount) {
            totalRevenue -= service.membershipDiscount;
            totalSale -= service.membershipDiscount;
        }
        if(service.loyalityPoints){
            totalRevenue -= service.loyalityPoints * 0.25;
            totalSale -= service.loyalityPoints * 0.25;
        }
    }
    service.employees.forEach(function(emp) {
        for (var i = 0; i < employee.length; i++) {
            if (employee[i].employeeId == emp.employeeId) {
                if (service.discountMedium == "frequency" && !service.frequencyDiscountUsed) {
                    employee[i].totalRevenueEmp += 0;
                } else if (service.discountMedium == "frequency" && service.frequencyDiscountUsed) {
                    employee[i].totalRevenueEmp += (((service.price + service.additions)*service.quantity - (service.membershipDiscount ? service.membershipDiscount : 0)) * (emp.distribution / 100));
                }
                else {
                    if (service.discount) {
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
    return {totalRevenue : totalRevenue, totalSale : totalSale, employees : employee, serviceLoyalityRevenue : serviceLoyalityRevenue};
};


appointmentSchema.statics.sendSMS = function(url, callback){
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
                if(error)
                    return callback(false);
                else return callback(true);
            });
}

appointmentSchema.statics.employeeAttendance = function(req,callback){
    var data={
        date:req.body.date,
        parlorName : "",
        openingTime:"",
        closingTime :"",
        shifts :[]
    };
    var emp = req.body.employeeId;
    Attendance.find({employeeId: { $regex: emp} , time:{$gte: HelperService.getDayStart(req.body.date) , $lt: HelperService.getDayEnd(req.body.date)}}).exec(function(err,attendance){
        Admin.findOne({_id: emp},{parlorId : 1} , function(err,admin) {
            Parlor.findOne({_id:admin.parlorId} , {openingTime:1,closingTime:1,name:1,address2:1} , function(err,parlor) {
                data.parlorName += parlor.name +"-"+ parlor.address2;
                data.openingTime += parlor.openingTime;
                data.closingTime += parlor.closingTime;
                    var obj={};
                    if (attendance.length > 0) {
                        for (var i = 0; i < attendance.length; i++) {
                            if(i == 0) {
                                obj = {"from": attendance[i].time};
                                data.shifts.push(obj);
                            }
                           else if ([i + 1] <= attendance.length) {
                                obj = {"to": attendance[i].time};
                                data.shifts.push(obj);
                            }
                        }
                    } else {
                        obj = {"from": attendance.time};
                        data.shifts.push(obj);
                    }
                return callback(err, data);
            })

        })
    })
};

appointmentSchema.statics.collectionReport = function (query,req, callback) {
    var query1 = { status : 3, parlorId: query._id};
    if(req.body.startDate)query1.appointmentStartTime = { $gte : req.body.startDate, $lt : req.body.endDate};
    var query2 = {parlorId: query._id};
    if(req.body.startDate)query2.createdAt = { $gte : req.body.startDate, $lt : req.body.endDate};
    Appointment.find(query1).sort({appointmentStartTime: -1}).exec(function(err, data){
        MembershipSale.find(query2).exec( function (err2, ms) {
            Advance.find(query2).exec(function (err, advance) {
                var appointments = [], noOfAppointments = 0, totalCollection = 0, totalMemberships = 0, totalAdvance = 0,advanceUsed=0 ,membershipUsed=0 ,totalLoyaltyPoints=0 ,loyaltyUsed=0 ,cardPayment=0, cashPayment=0 ,totalOthers =0, totalProducts=0, totalRedemption=0 , beU=0, amex=0;
                var previousDate = null;
                _.forEach(data, function (d) {
                    if (!HelperService.compareTodayDate(previousDate, d.appointmentStartTime) && noOfAppointments > 0) {

                         _.forEach(advance, function (adv) {
                        if (HelperService.compareTodayDate(previousDate, adv.createdAt)) {
                            totalAdvance += adv.amount;
                            if (adv.allPaymentMethods.length > 0) {
                                _.forEach(adv.allPaymentMethods,function (advn) {
                                    if (advn.value == 1) cashPayment += advn.amount;
                                    else cardPayment += advn.amount;
                                })
                            } else cashPayment += adv.amount;
                        }
                    });
                        _.forEach(ms, function (m) {
                        if (HelperService.compareTodayDate(previousDate, m.createdAt) && noOfAppointments > 0) {
                            totalMemberships += m.price;
                            // totalCollection += m.price;
                           _.forEach( m.paymentMethods,function (method) {
                                if (method.value == 1)
                                    cashPayment += method.amount;
                                else
                                    cardPayment += method.amount;
                            })
                        }
                    });
                        console.log(totalMemberships * 1.18 ,totalAdvance , totalCollection,totalOthers)
                        appointments.push({
                            date: previousDate,
                            noOfAppointments: noOfAppointments,
                            totalCollection: totalMemberships * 1.18 + totalAdvance + totalCollection - totalOthers,
                            serviceCollection : totalCollection - totalProducts - totalOthers,
                            productCollection : totalProducts,
                            totalMemberships: totalMemberships * 1.18,
                            totalAdvance: totalAdvance,
                            advanceUsed: advanceUsed,
                            membershipUsed: membershipUsed,
                            totalLoyaltyPoints: totalLoyaltyPoints,
                            loyaltyUsed: loyaltyUsed,
                            cardPayment: cardPayment,
                            cashPayment: cashPayment,
                            totalProducts: totalProducts,
                            totalRedemption: totalRedemption,
                            beU: beU,
                            amex: amex
                        });
                        noOfAppointments = 0;totalCollection = 0;totalMemberships = 0;totalAdvance = 0;advanceUsed = 0;membershipUsed = 0;totalLoyaltyPoints = 0;loyaltyUsed = 0;cardPayment = 0;cashPayment = 0;totalProducts = 0;totalRedemption = 0;beU = 0;amex = 0;totalOthers = 0;
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
                        _.forEach(d.allPaymentMethods, function (pay) {
                            if (pay.value == 1)
                                cashPayment += pay.amount;
                            else if (pay.value == 2)
                                cardPayment += pay.amount;
                            else if (pay.value == 10 || pay.value == 5  || pay.value == 11)
                                beU += pay.amount;
                            else if (pay.value == 8) {
                                amex += pay.amount;
                            }
                            else if (pay.value == 4) {
                                advanceUsed += pay.amount;
                                totalRedemption += pay.amount;
                            }else{
                                totalOthers += pay.amount;
                            }
                        });
                    } else {
                        if (d.paymentMethod == 1) cashPayment += d.payableAmount;
                        else if (d.paymentMethod == 2) cardPayment += d.payableAmount;
                        else if (d.paymentMethod == 10 || d.paymentMethod == 5  || d.paymentMethod== 11) beU += d.payableAmount;
                        else if (d.paymentMethod == 8) amex += d.payableAmount;
                        else if (d.paymentMethod == 3 || d.paymentMethod == 4) {
                            advanceUsed += d.payableAmount;
                            totalRedemption += d.payableAmount;
                        }else{
                                totalOthers += d.payableAmount;
                            }
                    }
                    _.forEach(d.products, function (product) {
                        totalProducts += product.price;
                    });
                    d.services.forEach(function (service) {
                        if (service.loyalityPoints) {
                            loyaltyUsed += (service.loyalityPoints * 0.75);
                            totalRedemption += (service.loyalityPoints * 0.75);
                                                    }
                    });

                });
                totalCollection +=  totalMemberships * 1.18 + totalAdvance +totalProducts;
                 _.forEach(advance, function (adv) {
                        if (HelperService.compareTodayDate(previousDate, adv.createdAt)) {
                            totalAdvance += adv.amount;
                            if (adv.allPaymentMethods.length > 0) {
                                _.forEach(adv.allPaymentMethods,function (advn) {
                                    if (advn.value == 1) cashPayment += advn.amount;
                                    else cardPayment += advn.amount;
                                })
                            } else cashPayment += adv.amount;
                        }
                    });

                    _.forEach(ms, function (m) {
                        if (HelperService.compareTodayDate(previousDate, m.createdAt) && noOfAppointments > 0) {
                            totalMemberships += (m.price);
                           _.forEach( m.paymentMethods,function (method) {
                                if (method.value == 1)
                                    cashPayment += method.amount;
                                else
                                    cardPayment += method.amount;
                            })
                        }
                    });
                console.log(totalOthers);
                appointments.push({
                    date: previousDate,
                    noOfAppointments: noOfAppointments,
                    totalCollection: totalMemberships * 1.18 + totalAdvance + totalCollection - totalOthers,
                    serviceCollection : totalCollection - totalProducts - totalOthers,
                    productCollection : totalProducts,
                    totalMemberships: totalMemberships *  1.18,
                    totalAdvance: totalAdvance,
                    totalOthers : totalOthers,
                    advanceUsed:advanceUsed,
                    membershipUsed:membershipUsed,
                    totalLoyaltyPoints:totalLoyaltyPoints,
                    loyaltyUsed:loyaltyUsed,
                    cardPayment:cardPayment,
                    cashPayment:cashPayment,
                    totalProducts:totalProducts,
                    totalRedemption:totalRedemption,
                    beU:beU,
                    amex:amex,
                    data: data
                });
                return callback(err, appointments);
            });
        })
    });
};


appointmentSchema.statics.parseServiceForReport = function (services) {
    return _.map(services, function(s){
        var revenue = getRevenueSubtotal(s.subtotal, s.type, s.frequencyPrice, s.quantity);
        return{
            id: s.id,
            categoryId: s.categoryId,
            serviceId: s.serviceId,
            name: s.name,
            type: s.type,
            quantity: s.quantity,
            additions: s.additions,
            typeIndex : s.typeIndex,
            creditsUsed : s.creditsUsed,
            employees: s.employees,
            employeeId: s.employeeId,
            estimatedTime: s.estimatedTime,
            price: s.price,
            subtotal: revenue.subtotal,
            additionIndex: s.additionIndex,
            tax: revenue.tax,
            dealId: s.dealId,
            frequencyDealFreeService : s.frequencyDealFreeService,
            frequencyPrice : s.frequencyPrice,
            dealPriceUsed : s.dealPriceUsed,
            actualPrice: s.actualPrice
        };
    })
};

function getRevenueSubtotal(subtotal, type, frequencyPrice, quantity){
    var revenue = 0;
    if(type == 'frequency'){
        if(subtotal == 0) revenue = frequencyPrice * quantity;
        else revenue = 0;
    }else revenue = subtotal;
    tax = parseInt((revenue * 15)/100);
    return {revenue : revenue, tax : tax};
}

appointmentSchema.statics.employeeReport = function (query,req, callback) {
    var query1 = { status : 3, parlorId: query._id};
    if(req.body.startDate)query1.appointmentStartTime = { $gte : req.body.startDate, $lt : req.body.endDate};
    if(req.body.clientIds)query1.clientId = req.body.clientId;
    Parlor.findOne({_id : query._id}, function(err, parlor){
        var dailyParlorHour = parlor.dailyParlorHour ? parlor.dailyParlorHour : 0;
        Admin.find({parlorId: query._id}, function(err, employees){
            var data = [];
            _.forEach(employees, function(e){
                if(!e.breakHr)e.breakHr = 0;
                data.push({
                    employeeId : e.id,
                    name : e.firstName + " " + e.lastName,
                    appointments : 0,
                    totalCustomers : 0,
                    customers : [],
                    returningCustomers : 0,
                    totalRevenue : 0,
                    employeeCommission : 0,
                    leaves : 0,
                    unproductiveHours : (HelperService.getDaysBetweenTwoDates(new Date(req.body.startDate), new Date(req.body.endDate)) * (dailyParlorHour - e.breakHr)) * 60,
                });
            });
            Appointment.find(query1).sort({appointmentStartTime: -1}).exec(function(err, appointments){
                _.forEach(appointments, function(appointment){
                    _.forEach(appointment.employees, function(emp){
                        Appointment.populateEmployeeForReport(appointment.client.id, emp, data, appointment.services );
                    });
                    _.forEach(appointment.products, function(prd) {
                        for(var i=0;i<data.length;i++) {
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

appointmentSchema.statics.populateEmployeeForReport = function (clientId, emp, data, services ) {
    _.forEach(data, function(r){
        if(emp.employeeId == r.employeeId){
            var result = _.some(r.customers, function (c) {
                return c + "" == clientId+"";
            });
            if(result)r.returningCustomers ++;
            else {
                r.customers.push(clientId);
                r.totalCustomers ++;
            }
            r.appointments ++;
            _.forEach(services, function(s){
                 var empObj = [{
                        employeeId : "" + emp.employeeId,
                        totalRevenueEmp : 0
                    }];
                var serviceRevenue = Appointment.serviceFunction(s, empObj);
                r.totalRevenue += serviceRevenue.employees[0].totalRevenueEmp;
            });
            // r.totalRevenue += emp.revenue;
            r.employeeCommission += emp.commission;
            r.unproductiveHours -= emp.estimatedTime;
        }
    });
};

appointmentSchema.statics.revenueReport = function (query,req, callback) {
    var query1 = { status : 3, parlorId: query._id};
    if(req.body.startDate)query1.appointmentStartTime = { $gt : req.body.startDate, $lt : req.body.endDate};
    if(req.body.clientIds)query1.clientId = req.body.clientId;
    var query2 = {parlorId: query._id};
    var employeeIds = req.body.employees ? req.body.employees : [];
    if(req.body.startDate)query2.createdAt = { $gt : req.body.startDate, $lt : req.body.endDate};
    Appointment.find(query1).sort({appointmentStartTime: -1}).exec(function(err, data){
        // console.log(data)
        MembershipSale.find(query2).exec( function (err2, ms) {
            var appointments = [], noOfAppointments = 0, totalRevenue = 0, totalServices = 0, totalProducts = 0,totalTax = 0, totalDeals = 0, totalMemberships =0, totalLoyalityPoints = 0;
            var previousDate = null;
        _.forEach(data, function(d){
            if(Appointment.empPresent(employeeIds, d.employees) || Appointment.empPresentInProducts(employeeIds, d.products)){
                if(!HelperService.compareTodayDate(previousDate, d.appointmentStartTime) && noOfAppointments>0){
                    appointments.push({
                        date : previousDate,
                        noOfAppointments : noOfAppointments,
                        totalRevenue : totalRevenue,
                        totalServices : totalServices,
                        totalProducts : totalProducts,
                        totalTax : totalTax,
                        totalDeals : totalDeals,
                        totalMemberships : totalMemberships,
                        totalLoyalityPoints : totalLoyalityPoints
                    });
                    noOfAppointments =0; totalRevenue =0; totalServices = 0; totalProducts = 0; totalTax =0; totalMemberships =0; totalDeals = 0; totalLoyalityPoints = 0;
                }
                    noOfAppointments ++;
                _.forEach(d.services, function(ser) {
                    var empRevenue = 0;
                    var serviceRevenue = Appointment.serviceFunction(ser, Appointment.getEmployeeList(employeeIds));
                    _.forEach(serviceRevenue.employees, function(e){
                        if(e.totalRevenueEmp){
                            empRevenue += e.totalRevenueEmp;
                        }
                    });
                    totalRevenue += empRevenue;
                    totalServices += empRevenue;
                });
                totalTax += d.tax;
                    totalLoyalityPoints += parseInt(d.loyalityPoints);
                    _.forEach(d.products, function(product){
                        if(_.filter(employeeIds, function(e){ return e + "" == product.employeeId + "";})[0]){
                            totalProducts += (product.price * product.quantity);
                            totalRevenue += (product.price * product.quantity);
                        }
                    });
                previousDate = d.appointmentStartTime;
                _.forEach(ms, function (m) {
                    if(!HelperService.compareTodayDate(previousDate, m.createdAt) && noOfAppointments>0) {
                        totalMemberships += m.price;
                    }
                });
            }

        });
            appointments.push({
                date : previousDate,
                noOfAppointments : noOfAppointments,
                totalRevenue : totalRevenue,
                totalServices : totalServices,
                totalProducts : totalProducts,
                totalTax : totalTax,
                totalMemberships : totalMemberships,
                totalLoyalityPoints : totalLoyalityPoints,
                totalDeals : totalDeals,
                data : data
            });
        return callback(err, appointments);
        });
    });
};


appointmentSchema.statics.dayWiseAdminReport = function (parlors,date,callback) {
    var data={
        totalAppointments : 0,
        totalRevenue : 0
    };
    data.parlorName = parlors.name;
    data.parlorAddress = parlors.address2;
    Appointment.find({parlorId : parlors._id , appointmentStartTime : {$gte : HelperService.getDayStart(date.startDate) , $lt : HelperService.getDayEnd(date.endDate)} ,
        status:3}).exec(function (err,appoint){
        data.totalAppointments = appoint.length;
        _.forEach(appoint , function(app) {
            _.forEach(app.services, function (s) {
                var servicer = Appointment.serviceFunction(s, []);
                data.totalRevenue += servicer.totalRevenue;
            });
            _.forEach(app.products, function (prd) {
                data.totalRevenue += (prd.price * prd.quantity)
            });
        })
        console.log(data)
        return callback(err, data);
    })
};


appointmentSchema.statics.timeWiseAdminReport = function(){

};

appointmentSchema.statics.serviceRepetitionReport = function(){

};

appointmentSchema.statics.employeeRepetitionReport = function(){

};

appointmentSchema.statics.getEmployeeList = function(empIds){
    var d = [];
    _.forEach(empIds, function(e){
        d.push({employeeId : e, totalRevenueEmp : 0});
    });
    return d;
};

appointmentSchema.statics.empPresent = function(empIds, empPre){
    var present = false;
    _.forEach(empIds, function(e){
        _.forEach(empPre, function(emp){
            if(emp.employeeId == e) present = true;
        });
    });
    return present;
};

appointmentSchema.statics.empPresentInProducts = function(empIds, products){
    var present = false;
    _.forEach(empIds, function(e){
        _.forEach(products, function(product){
            if(product.employeeId == e) present = true;
        });
    });
    return present;
};

 appointmentSchema.statics.checkMembership = function (req, callback) {
    Appointment.checkCoupon(req, function (err, couponResponse) {
        User.getActiveMembership(req.body.data.user.phoneNumber, function(user){
            var originalServices = [], services = [], subtotal = 0;
            Deals.getActiveDeals(req.session.parlorId, req.body.data.appointmentTime, function(deals){
                Parlor.findOne({ _id: req.session.parlorId }, function (err, parlor) {
                    originalServices = parlor.services;
                    _.forEach(req.body.data.services, function (service) {
                        if(service.type != "combo"){
                            _.forEach(originalServices, function (pService) {
                                _.forEach(pService.prices, function (oService) {
                                    if (service.code == oService.priceId) {
                                        var subtotal = oService.price * service.quantity;
                                        var type = 'service';
                                        subtotal += service.additions ? service.additions * service.quantity : 0;
                                        if(service.type!= "service"){
                                            var d = _.filter(deals, function(d) {return d.id + "" == service.serviceId + ""; });
                                            if(d.length > 0){
                                                var dealService = d[0];
                                                var newSubtotal = service.type !="chooseOnePer" ? dealService.dealType.price * service.quantity : ( subtotal * dealService.dealType.price)/100;
                                                if(service.type == "frequency"){
                                                    newSubtotal =  dealService.dealType.frequencyRequired * oService.price;
                                                    newSubtotal += service.additions ? service.additions * service.quantity : 0;
                                                 }
                                                subtotal = newSubtotal;
                                                type = 'deal';
                                            }
                                        }
                                        services.push({
                                            categoryId : pService.categoryId,
                                            tax : oService.tax,
                                            subtotal : subtotal,
                                            loyalityPoints : 0,
                                            type : type
                                        });
                                    }
                                });
                            });
                        }else{
                                var dealComb = _.filter(deals, function(d) {return d.id + "" == service.serviceId; });
                                if(dealComb.length > 0){
                                    var dealCombo = dealComb[0];
                                    _.forEach(dealCombo.services, function(ser){
                                        _.forEach(originalServices, function (pService) {
                                            if(pService.serviceCode == ser.serviceCode){
                                                var oService = pService.prices[0];
                                                services.push({
                                                    categoryId : pService.categoryId,
                                                    serviceId : pService.serviceId,
                                                    tax : oService.tax,
                                                    loyalityPoints : 0,
                                                    subtotal : dealCombo.dealType.price/dealCombo.services.length,
                                                });
                                            }
                                        });
                                    });
                                }
                            }
                        });
                    var active = User.compressMembership(user.activeMembership);
                     user.membership = _.filter(active, function(m){
                        return m.membershipId == req.body.data.user.membershipId;
                    });
                     console.log(user)
                    return callback(null, User.getMembershipDiscount(user.membership.length > 0 ? user.membership[0].creditsLeft :0, user.membership, services, [], true, user.loyalityPoints, req.body.data.useLoyalityPoints));
                });
            });
        });
    });
};



appointmentSchema.statics.checkCoupon = function (req, callback) {
    Parlor.findOne({_id : req.session.parlorId}, function(err, parlor){
        Deals.getActiveDeals(req.session.parlorId, req.body.data.appointmentTime, function(deals){
            Offer.findOne({code : req.body.data.couponCode, startDate : { $lt : new Date() }, active: true, endDate : {$gt : new Date()} }, function(err, c){
                if(c){
                    var date = new Date();
                    var day = date.getDay();
                   /* var result = _.some(c.validDays, function (d) {
                        console.log(d);
                        console.log(day);
                        return d === day;
                    });*/
                    var result = 1;
                    if(result){
                        var services = req.body.data.services, total =0;
                        _.forEach(services, function(s){
                            if(s.type != "combo"){
                                parlor.services.forEach(function(parlorServices){
                                    _.forEach(parlorServices.prices, function(ser){
                                        if(s.code == ser.priceId){
                                            s.newServiceId = parlorServices.serviceId;
                                            var subtotal = ser.price * s.quantity;
                                            subtotal += s.additions * s.quantity || 0;
                                            if(s.type != "service"){
                                                var d = _.filter(deals, function(d) {return d.id+ "" == s.serviceId; });
                                                if(d.length>0){
                                                    var dealService = d[0];
                                                    var newSubtotal = s.type !="chooseOnePer" ? dealService.dealType.price * s.quantity : ( subtotal * dealService.dealType.price)/100;
                                                    if(s.type == "frequency"){
                                                        newSubtotal =  dealService.dealType.frequencyRequired * ser.price;
                                                        newSubtotal += s.additions ? s.additions * s.quantity : 0;
                                                    }
                                                    subtotal = newSubtotal;
                                                }
                                            }

                                            total += subtotal;
                                        }
                                    });
                                });
                            }else{
                                    var dealComb = _.filter(deals, function(d) {return d.id + "" == s.serviceId; });
                                    if(dealComb.length > 0){
                                        var dealCombo = dealComb[0];
                                       total += ( s.quantity * dealCombo.dealType.price);
                                    }

                                }
                        });
                        if(total >= c.minAmountReq){
                            var message="Coupon applied Successfully, ", discount =0, cashback =0;
                            var discountServices = [];
                            if(c.offerType == "fixed"){
                                if(c.offerMethod == "cash"){
                                    discount = c.discountAmount;
                                    message += "Discount of Rs "+discount + " applied";
                                }else{
                                    cashback = c.discountAmount;
                                    message += "Layality Points of worth "+cashback + " will be credited in your account after appointment.";
                                }
                            }else if(c.offerType == "percentage") {
                                if(c.offerMethod == "cash"){
                                        discount = (c.discountAmount * total)/100;
                                        message += "Discount of Rs "+discount + " applied";
                                }else{
                                    cashback = (c.discountAmount * total)/100;
                                    message += "Layality Points of worth "+cashback + " will be credited in your account after appointment.";
                                }
                            }else if(c.offerType == "groupon"){
                                var present = _.filter(services, function(s) {return s.parlorDealId + "" == c.dealId+""; })[0];
                                if(present){
                                    if(present.parlorType == 1 && parlor.parlorType != 1){
                                        return callback(true , {discount : discount, cashback : cashback, message : 'Invalid coupon', discountServices : []});
                                    }else{
                                        // var s = _.forEach(present[0].services, function(f){ })
                                        discount = c.discountAmount;
                                        discountServices.push({serviceId : present.newServiceId, amount : c.discountAmount, discountMedium : 'groupon'});
                                        message += "Discount of Rs " + discount + "applied";
                                    }

                                }else{
                                    return callback(true , {discount : discount, cashback : cashback, message : 'Invalid coupon', discountServices : []});
                                }
                            }
                            return callback(true , {discount : discount, cashback : cashback, message : message, discountServices : discountServices});
                        }else{
                            return callback(true , {discount : 0, cashback : 0, message : 'Offer not valid on this amount. Minimum amount shoulb be Rs' + c.minAmountReq, discountServices : []});
                        }
                    }else{
                        return callback(true , {discount : 0, cashback : 0, message : 'Invalid Day, offer not valid on this day', discountServices : []});
                    }

                }else{
                    return callback(true , {discount : 0, cashback : 0, message : 'Invalid Coupon', discountServices : []});
                }
            });
        });
    });
};



appointmentSchema.statics.addEmployeeToAppointment = function(req, appointment, callback){
    var employees = [];
    var preService = {}, prevName = "";
     _.forEach(appointment.services, function (s) {
            if(prevName != s.name) {
                _.forEach(req.body.services, function(service){
                    if(s.id == service.code && s.type == service.type && s.dealId == service.dealId){
                        if(s.type != 'combo' && s.type != 'newCombo')
                            s.employees = getEmployeeData(employees, s, service.employee1);
                        else{
                            var dis = _.filter(service.services, function(c){ return c.serviceCode == s.serviceCode})[0];
                            if(dis){
                                s.employees = getEmployeeData(employees, s, dis.employees);
                            }
                        }
                        preService = service;
                    }
                });
            }else{
                var dis = null;
                _.forEach(req.body.services, function(service){
                        if(!dis)
                            dis   = _.filter(service.services, function(c){ return c.serviceCode == s.serviceCode})[0];
                });
                if(dis){
                    s.employees = getEmployeeData(employees, s, dis.employees);
                }
            }
            if(s.type == "combo" || s.type == "newCombo")
                prevName = s.name;
            else prevName = "asdasd";
        });
     Appointment.update({_id : appointment.id}, {employees : employees, services : appointment.services}, function(err, s){
        return callback(CreateObjService.response(false, 'Updated'));
    });
};


function getEmployeeData(employees, service, serviceEmployees){
    var e = [];
    _.forEach(serviceEmployees, function(employee){
        employee.employeeId = employee.userId;
        employee.commission = 0;
        var found = false;
        var distributedPrice = (service.subtotal * employee.dist)/100;
        _.forEach(employees, function (emp) {
            if (emp.employeeId +"" == employee.employeeId + "") {
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
            employeeId : employee.employeeId,
            name : employee.name,
            commission : (employee.commission * distributedPrice) / 100,
            distribution : employee.dist
        });
    });
    return e;
};

//function to find the most visited grade of salons after passing salon types array e.g [0,0,1,1] based on appointments
var mostFrequentSalonType = function(obj){

var highestKey = "";

var highestValue = 0;

    for(key in obj){
        if(obj[key] >= highestValue){
            highestValue = obj[key];
            highestKey = key;
        }
    }

    return highestKey;

}
//function to find the most visited grade of salons ends

//update favParlor function begins
var updateFavParlor = function(userId){
        Parlor.find({},{parlorType : 1 }, function(err, salonTypeArray){

        var salonAndType = salonTypeArray; //this array is used to get the type of salon 0,1,2

        var numOfAppointmentsSalonWise = {"0" : 0, "1" : 0, "2" : 0};

        User.findOne({"_id" : userId},{"parlors" : 1},function(err, userParlors){
            //for loop to get salon type 0,1,2
            for(var j = 0; j < userParlors.parlors.length; j++){
                for(var k = 0; k < salonAndType.length; k++){
                    if(userParlors.parlors[j]["parlorId"] == salonAndType[k]["_id"]){

                            numOfAppointmentsSalonWise[salonAndType[k]["parlorType"]] += userParlors.parlors[j]["noOfAppointments"];
                    }
                }
            }

            User.update({"_id" : userId}, {$set : {"favParlor" : mostFrequentSalonType(numOfAppointmentsSalonWise)}}, function(err, data){
                console.log("Favorite parler updated");
            });

        });
    });
}
//update favParlor function ends

appointmentSchema.statics.createNewAppointment = function(req, callback){
        Appointment.createNew(req, function (err, newObj, user) {
                if(req.body.data.addAdvanceCredits){
                    Advance.create(Advance.createNew(req, newObj.client.id), function(err, advance){
                        var updateObj = {$set: {'parlors.$.advanceCredits': user.advanceCredits ? user.advanceCredits  + parseInt(req.body.data.addAdvanceCredits) : parseInt(req.body.data.addAdvanceCredits)}};
                        var whereOb = {_id : newObj.client.id, 'parlors.parlorId' : "" + newObj.parlorId};
                        sendAppNotification(user, newObj);
                        User.update(whereOb, updateObj, function (err, doc) {
                            if (err) return callback({error: err});
                            updateFavParlor(user.userId);
                            return callback(CreateObjService.response(false, Appointment.parse(newObj)));
                        });


                    });
                }else{
                        sendAppNotification(user, newObj);
                        updateFavParlor(user.userId);
                        return callback(CreateObjService.response(false, Appointment.parse(newObj)));
                }
        });
};

appointmentSchema.statics.sendPayNotification = function(req, callback){
    Appointment.findOne({_id : req.body.appointmentId}, function(err, appointment){
        User.findOne({_id : appointment.client.id}, function(err, user){
            sendAppNotification(user, appointment);
            return callback();
        });
    });
};

function sendAppNotification(user, appt){
    Appointment.count({
        'client.id': user.id,
        status: {$in: [3]},
        appointmentType: 3,
        cashbackUsed : true,
    }, function (err, count) {
var percentage = (count == 0 ? 100 : 10)
    var title = 'Get '+ (count == 0 ? '100%' : '10%') + '  Cashback On Digital Payment.' ;
    var body = 'Get ' +percentage+ '% Cashback On Your Digital Payment & ' +(percentage/2)+ '% Cashback On Cash Payment Through The App. Check Out Other Exciting Freebies Too.*T&C Apply';
    Notification.create({userId : user.id, action : 'started', title : title, body : body, appointmentId : appt.id}, function(err, n){
        User.findOne({_id : user.id,  $or : [ { firebaseId : {$ne : null } },  { firebaseIdIOS : {$ne : null }} ] } ).exec(function(err, user) {
                if(user) {
                    Appointment.sendAppNotification(user.firebaseId, title, body, {appointmentId: appt.id, type : 'started'},  n.id,function (err, response) {
                    });
                    Appointment.sendAppNotificationIOS(user.firebaseIdIOS, title, body,  appt.id, 'started', n.id, function (err, response) {
                        });
                }
                })
                });
                });
}

appointmentSchema.statics.createNew = function (req, callback) {
    var user = {}, obj = {};
    ParlorItem.items(req.session.parlorId, function(err, parlorItems){
    Slab.find({}, function(err, slabs){
    Service.find({}, {gstDescription : 1, gstNumber : 1}, function(err, allServices){
    Deals.getActiveDeals(req.session.parlorId, req.body.data.appointmentTime,  function(deals){
    Appointment.checkCoupon(req, function (err, couponResponse) {
        Admin.findOne({ _id: req.session.userId }, function (err, recp) {
            var receptionist = {
                name: recp.firstName + " " + recp.lastName,
                userId: recp.id,
                phoneNumber: recp.phoneNumber,
                gender: recp.gender,
            };
            User.findOne({ phoneNumber: req.body.data.user.phoneNumber, 'parlors.parlorId': req.session.parlorId }).populate('activeMembership.membershipId').exec(function (err, u) {
                var servicesId = _.map(req.body.data.services, function (s) { return s.code; });
                var originalServices = [];
                var products = req.body.data.products || [];
                    Appointment.findOne({parlorId : req.session.parlorId}).sort({parlorAppointmentId: -1}).exec( function(err, doc) {
                    var count = doc ? doc.parlorAppointmentId : 0;
                    Parlor.findOne({ _id: req.session.parlorId }, function (err, parlor) {
                        originalServices = parlor.services;
                        if (u) {
                            user = User.parse(u, req.session.parlorId);
                            user.id = user.userId;
                            obj = Appointment.createNewObj(req, user, receptionist, originalServices, products, parlor, couponResponse.discount, couponResponse, deals, parlorItems, slabs, allServices);

                            if(req.body.data.appointmentId){
                                Appointment.findOne({_id : req.body.data.appointmentId}, function(err, appointment){
                                    if(appointment){
                                        obj.isPaid = appointment.isPaid;
                                        obj.paymentMethod = appointment.paymentMethod;
                                        obj.allPaymentMethods = appointment.allPaymentMethods;
                                        obj.editedByCrm = 1;
                                        Appointment.update({_id : req.body.data.appointmentId},obj, function (err, newObj) {
                                            if (err) console.log("error in creating appointment ", err);
                                            return callback(err, obj, user);
                                        });
                                    }
                                });

                            }else{
                                obj.parlorAppointmentId = ++count;
                                Appointment.create(obj, function (err, newObj) {
                                    if (err) console.log("error in creating appointment ", err);
                                    return callback(err, newObj, user);
                                });
                            }
                        } else {
                            User.findOne({phoneNumber : req.body.data.user.phoneNumber}).populate('activeMembership.membershipId').exec( function(err, userFound){
                                    if(!userFound){
                                                        var parlors = [];
                                            parlors.push({parlorId: req.session.parlorId, createdBy : req.session.userId, noOfAppointments : 0, createdAt : new Date()});
                                            User.find().count(function(err, count){
                                                var newUser = {gender : req.body.data.user.gender, emailId:req.body.data.user.emailId,firstName: req.body.data.user.name, phoneNumber: req.body.data.user.phoneNumber, parlors: parlors };
                                                newUser.customerId = ++count;
                                            User.create(newUser, function (err, doc) {
                                                if (err) console.log(err);
                                                var user = {
                                                    id : doc._id,
                                                    name : doc.firstName,
                                                    noOfAppointments : 0,
                                                    emailId: doc.emailId,
                                                    gender : doc.gender,
                                                    phoneNumber : doc.phoneNumber,
                                                    customerId : doc.customerId,
                                                    membership : [],
                                                    loyalityPoints : 0,
                                                }
                                                obj = Appointment.createNewObj(req, user, receptionist, originalServices, products, parlor, couponResponse.discount, couponResponse, deals, parlorItems, slabs, allServices);
                                                obj.parlorAppointmentId = ++count;
                                                Appointment.create(obj, function (err, newObj) {
                                                    return callback(err, newObj, user);
                                                });
                                            });
                                        });
                                        }else{
                                            var newP = {parlorId : req.session.parlorId, createdBy : req.session.userId, noOfAppointments : 0, createdAt : new Date(), updatedAt : new Date()};
                                            userFound.parlors.push(newP);
                                            userFound.save(function(err){
                                                var user = {
                                                    id : userFound._id,
                                                    name : userFound.firstName,
                                                    gender : userFound.gender,
                                                    emailId:userFound.emailId,
                                                    noOfAppointments : 0,
                                                    phoneNumber : userFound.phoneNumber,
                                                    customerId : userFound.customerId,
                                                    membership : [],
                                                    loyalityPoints : 0,
                                                }
                                                obj = Appointment.createNewObj(req, user, receptionist, originalServices, products, parlor, couponResponse.discount, couponResponse, deals, parlorItems, slabs, allServices);
                                                obj.parlorAppointmentId = ++count;
                                                Appointment.create(obj, function (err, newObj) {
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

appointmentSchema.statics.getServiceHome = function (req, callback) {
    var timePeriod = req.query.timePeriod;
    var startTime = HelperService.getLastWeekStart(), endTime = HelperService.getLastWeekEnd();
    if (timePeriod == 1) {
        // startTime = HelperService.getLastDayStart();
        startTime = HelperService.getTodayStart();
        endTime = HelperService.getTodayEnd();
    } else if (timePeriod == 3) {
        startTime = HelperService.getLastMonthStart();
    }
    Admin.getParlorIds(req, function(parlorIds){
    Appointment.find({ parlorId: { $in : parlorIds }, appointmentStartTime: { $gt: startTime, $lt: endTime } }, function (err, appointments) {
        ServiceCategory.find({}, function (err, categories) {
            Parlor.find({ _id: { $in : parlorIds} }, function (err, parlors) {
                var data = [];
                _.forEach(parlors, function(parlor){
                    var newCategories = [];
                    var services = _.map(parlor.services, function (s) {
                    Appointment.populateCategories(newCategories, categories, s);
                        return {
                            categoryId: s.categoryId, prices: [s.prices[0].priceId, s.prices[1].priceId, s.prices[2].priceId], serviceId: s.serviceId, name: s.name, gender: s.gender, total: 0, revenue: 0
                        };
                    });
                    var newAppointments = _.filter(appointments, function(a){ return a.parlorId == parlor.id ; });
                    data.push(Appointment.parseServiceAnalytics(newAppointments, newCategories, services));
                });
                if(data.length == 1)return callback(false, data[0]);
                else{
                    return callback(false, Appointment.populateForMultipleParlors(data));
                }
            });
        });
    });
});
};

appointmentSchema.statics.populateForMultipleParlors = function(data){
    var averageService = 0, popularService = "", popularSubService = "", leastPopularService = "";

    _.forEach(data, function(d){
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

appointmentSchema.statics.parseCluster = function(data){

};



appointmentSchema.statics.parseServiceAnalytics = function (appointments, categories, services) {
    var averageService = 0, popularService = "", popularSubService = "", leastPopularService = "", totalService = 0;
    _.forEach(appointments, function (appointment) {
        if (appointment.status != 2) {
            totalService += appointment.services.length;
            _.forEach(appointment.services, function (ser) {
                _.forEach(services, function (service) {
                    _.forEach(service.prices, function (p) {
                        if (ser.id == p) {
                            _.forEach(categories, function (cat) {
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
    var maxService = -1, minService = 9999999, maxSubservice = -1;
    _.forEach(services, function (service) {
        if (maxSubservice < service.total) {
            maxSubservice = service.total;
            popularSubService = service.name;
        }
    });
    _.forEach(categories, function (cat) {
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
        Admin.getParlorIds(req, function(parlorIds){
                Appointment.find({ parlorId: {$in : parlorIds}, appointmentStartTime: { $gt: HelperService.getTodayStart(), $lt: HelperService.getTodayEnd() }, }, function (err, appointments) {
            var totalRevenue = 0, averageTime = 0 , totalCollection=0 , totalTax=0 , totalLoyalityPoints=0 , openAppointments= 0 , totalAppointments=0;
            _.forEach(appointments, function(a){
                if(a.status == 3){
                    console.log(a.status)
                    totalAppointments++
                    totalTax += a.tax;
                    totalCollection += a.payableAmount;
                    totalLoyalityPoints += (a.loyalityPoints * 0.75);
                }

                if(a.status == 1 || a.status ==4){
                    openAppointments++
                }
                // averageTime += a.estimatedTime;
            });
            if(appointments.length != 0)averageTime = averageTime/appointments.length;
            return callback(false, {
                totalAppointments : totalAppointments,
                totalRevenue : (totalCollection - totalTax + totalLoyalityPoints),
                totalCollection :totalCollection,
                openAppointments:openAppointments
                // averageTime : averageTime
            });
        });

        });

};

appointmentSchema.statics.populateCategories = function (newCategories, categories, service) {
    var found = false, name = "";
    _.forEach(newCategories, function (cat) {
        if (cat.categoryId == "" + service.categoryId) {
            found = true;
        }
    });
    _.forEach(categories, function (cat) {
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

appointmentSchema.statics.createCluster = function (type, categories, services) {
    var cluster = [{ "name": "Services", "children": [{ "name": "Male", "children": [] }, { "name": "Female", "children": [] }] }];
    Appointment.populateClusterByGender("M", type, cluster[0].children[0].children, services, categories);
    Appointment.populateClusterByGender("F", type, cluster[0].children[1].children, services, categories);
    return cluster;
};

appointmentSchema.statics.populateClusterByGender = function (gender, type, children, services, categories) {
    var newServices = services.filter(function (s) { return s.gender == gender; });
    _.forEach(categories, function (cat) {
        var obj = { "name": cat.name, children: [] };
        _.forEach(newServices, function (s) {
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

appointmentSchema.statics.getAppointmentHome = function (req, callback) {
    // var start = new Date(y, m, 1);
    // var end = new Date(y, m, HelperService.getDaysInMonth(m+1, y), 23, 59, 59, 0);
    var userId = req.session.userId;
    if (!userId) callback(null, "Please Login Again !");
    var parlorId = [];
    Admin.findOne({ _id: userId }, function (err, user) {
        if (err) console.log(err);
        else {
            if (user.role == 7) {
                _.forEach(user.parlorIds, function (pid) {
                    parlorId.push(pid);
                });
            }
            else {
                parlorId.push(user.parlorId);
            }
        }
        Appointment.find({ parlorId: { $in: parlorId }, appointmentStartTime: { $gt: HelperService.getTodayStart(), $lt: HelperService.getTodayEnd() }, status : 3 }, function (err, appointments) {
            var todayTotalAppointments = 0, todayTotalBilling = 0, lastWeekBilling = 0, lastWeekAppointments = 0;
            _.forEach(appointments, function (appt) {
                if (appt.status == 3) todayTotalBilling += appt.payableAmount;
                if (appt.status != 2) todayTotalAppointments++;
            });
            Appointment.find({ parlorId: { $in: parlorId }, appointmentStartTime: { $gt: HelperService.getLastWeekStart(), $lt: HelperService.getLastWeekEnd() } }, function (err, appointmentLastWeek) {
                _.forEach(appointmentLastWeek, function (appt) {
                    if (appt.status == 3) lastWeekBilling += appt.payableAmount;
                    if (appt.status != 2) lastWeekAppointments++;
                });
                Appointment.find({ parlorId: { $in: parlorId }, appointmentStartTime: { $gt: HelperService.getLastMonthStart(), $lt: HelperService.getTodayEnd() } }, function (err, allAppt) {
                    var billingValues = [], appointmentsValues = [];
                    var currentDay = 0, currenDate, tempBilling = 0, tempAppointments = 0;
                    _.forEach(allAppt, function (appt) {
                        if (currentDay === 0) { currenDate = appt.appointmentStartTime; currentDay = appt.appointmentStartTime.getDate(); }
                        if (appt.appointmentStartTime.getDate() != currentDay) {
                            if (tempBilling !== 0 || tempAppointments !== 0) {
                                billingValues.push([currenDate.getTime(), tempBilling]);
                                appointmentsValues.push([currenDate.getTime(), tempAppointments]);
                                tempBilling = 0; tempAppointments = 0;
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
                    return callback(null, { todayTotalBilling: todayTotalBilling, todayTotalAppointments: todayTotalAppointments, lastWeekTotalBilling: lastWeekBilling, lastWeekTotalAppointments: lastWeekAppointments, billingValues: billingValues, appointmentsValues: appointmentsValues});
                });
            });
        });
    });
};


appointmentSchema.statics.parseArray = function (appointments) {
    return _.map(appointments, function (a) {
        var obj = Appointment.parse(a);
         obj.parlorName = a.parlorName;
         obj.closedByName=a.closedByName;
        obj.parlorAddress = a.parlorAddress;
        return obj;
    });
};

appointmentSchema.statics.parseForApp = function (appointments, upcomming) {
    return _.map(appointments, function (a) {
        return Appointment.parseSingleAppointmentForApp(a, upcomming);
    });
};



appointmentSchema.statics.parseSingleAppointmentForApp = function(a, upcomming){
    var newSubtotal = parseFloat(parseFloat(parseFloat(a.subtotal) - parseFloat(a.loyalityPoints) - parseFloat(a.creditUsed) - parseFloat(a.membershipDiscount)).toFixed(2));
    var payableAmount = Math.ceil(newSubtotal*1.18);
    var loyalityPoints = parseInt((newSubtotal * 0)/100);

    var obj = Appointment.parseForUser(a);
        obj.parlorName = a.parlorName;
        obj.onlineTax = parseFloat((newSubtotal - loyalityPoints) * 0.18).toFixed(2);
        obj.payableAmountForOnlineDiscount = payableAmount;
        obj.onlineDiscount = loyalityPoints;
        obj.payableAmount = payableAmount;
        obj.freebiesUsed = a.loyalityPoints - a.loyalityOffer;
        obj.parlorAddress = a.parlorAddress;
        obj.review = a.review;
        obj.parlorId = upcomming ? a.parlorId.id : a.parlorId;
        var totalSavings = 0;
        _.forEach(obj.services, function(s){
            var sav = s.actualDealPrice ? s.actualDealPrice : s.actualPrice;
            if(s.type != 'frequency')totalSavings += (sav - (s.price));
            else totalSavings += s.discount;
        });
        obj.totalSaved = parseInt(totalSavings);
        if(upcomming){
            obj.parlorLatitude = a.parlorId.latitude;
            obj.parlorLongitude = a.parlorId.longitude;
            obj.openingTime = a.parlorId.openingTime;
            obj.closingTime = a.parlorId.closingTime;
            obj.latitude = a.parlorId.latitude;
            obj.longitude = a.parlorId.longitude;
        }
    return obj;
};

appointmentSchema.statics.parseForUser = function (a) {
    var pro = _.forEach(a.products, function(p){
        p.employee = p.employeeId;
    });
    var discountFrequency = 0;
    _.forEach(a.services, function(s){
        if(s.type == 'frequency') discountFrequency += s.discount;
    });
    return {
        otherCharges: a.otherCharges || 0,
        subtotal: a.subtotal - discountFrequency,
        discount: a.discount,
        appointmentType: a.appointmentType,
        paymentMethod: a.paymentMethod,
        couponCode: a.couponCode,
        comment : a.comment,
        membershipAmount : a.membershipAmount,
        bookingMethod : a.bookingMethod,
        allPaymentMethods: getAllPaymentMethod(a.allPaymentMethods, a.advanceCredits, a.useAdvanceCredits, a.paymentMethod, a.payableAmount),
        membershipDiscount: a.membershipDiscount.toFixed(2),
        membersipCreditsLeft : a.membersipCreditsLeft.toFixed(2),
        payableAmount: a.payableAmount,
        productPrice: a.productPrice,
        appointmentId: a.id,
        parlorId: a.parlorId,
        loyalityOffer : a.loyalityOffer,
        parlorAppointmentId: a.parlorAppointmentId,
        appointmentStatus: HelperService.getAppointmnetStatusValue(a.status),
        creditUsed : a.creditUsed.toFixed(2),
        tax: a.tax,
        status: a.status,
        isPaid : a.isPaid ? a.isPaid : false,
        startsAt: a.appointmentStartTime,
        appointmentEndTime: a.appointmentEndTime,
        estimatedTime: a.estimatedTime,
        loyalityPoints : a.loyalityPoints,
        services: Appointment.populateServices(a.services),
        products: pro,
        advanceCredits : a.useAdvanceCredits ? a.advanceCredits : 0,
    };
};

function getAllPaymentMethod(all, advanceCredits, useAdvanceCredits, paymentMethod, payableAmount){
    if(advanceCredits && useAdvanceCredits){
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

appointmentSchema.statics.populateServices = function(services){
    var data = [], prevName = "";
    _.forEach(services, function (s) {
            if(prevName != s.name) {
                var price = s.price + s.additions;
                var obj = {
                    name: s.name,
                    price: s.type != 'frequency' ? price * s.quantity : price * (s.quantity - 1),
                    actualPrice: s.type != 'frequency' ? s.actualPrice *s.quantity : s.frequencyPrice * s.quantity,
                    employees: s.employees.slice(),
                    estimatedTime: s.estimatedTime,
                    additions : s.additions,
                    quantity : s.quantity,
                    count : s.quantity,
                    gstNumber : s.gstNumber,
                    gstDescription : s.gstDescription,
                    typeIndex : s.typeIndex,
                    brandId : s.brandId,
                    productId : s.productId,
                    brandProductDetail : s.brandProductDetail,
                    code : s.id,
                    actualDealPrice : (s.actualDealPrice ? s.actualDealPrice : s.actualPrice) * s.quantity,
                    discount : s.discount,
                    tax : s.tax,
                    comboServices : s.type == 'newCombo' || s.type == 'combo' ? [{
                        name : s.serviceName,
                        serviceCode : s.serviceCode,
                        brandProductDetail : s.brandProductDetail,
                        brandId : s.brandId,
                        productId : s.productId,
                        employees : s.employees,
                    }] : [],
                    membershipDiscount : s.membershipDiscount,
                    creditsUsed : s.creditsUsed,
                    dealId : s.dealId,
                    serviceId : s.serviceId,
                    type : s.type,
                    dealPriceUsed : s.dealPriceUsed
                };
                data.push(obj);
            }else{
                Appointment.populateUniqueEmployee(data[data.length-1].employees, s.employees);
                data[data.length-1].price += s.price;
                data[data.length-1].comboServices.push({
                        name : s.serviceName,
                        serviceCode : s.serviceCode,
                        brandProductDetail : s.brandProductDetail,
                        brandId : s.brandId,
                        productId : s.productId,
                        employees : s.employees,
                    });
                data[data.length-1].actualPrice += s.actualPrice;
                data[data.length-1].actualDealPrice += s.actualPrice;
            }
            if(s.type == "combo" || s.type == "newCombo")
                prevName = s.name;
            else prevName = "asdasd";
        });
    return data;
};

appointmentSchema.statics.populateUniqueEmployee = function(employees, serviceEmployees){
    _.forEach(serviceEmployees, function(s){
        if(!_.filter(employees, function(emp){ return emp.employeeId + "" == s.employeeId + ""})[0])
            employees.push(s);
    });
},

appointmentSchema.statics.parse = function(a) {
    var obj =  Appointment.parseForUser(a);
    obj.parlorName = a.parlorName;
    obj.status = a.status;
    obj.otp= a.otp;
    obj.client = a.client;
    obj.receptionist = a.receptionist.name;
    obj.employees = _.map(a.employees, function (e) { return e.employeeId; });
    return obj;
};

appointmentSchema.statics.changePaymentMethod = function (req, callback) {
    Appointment.update({_id : req.body.appointmentId}, {updatedAt : new Date(),  allPaymentMethods : getPaymentMethodObj(req.body.paymentMethod), paymentMethod : checkPaymentMethod(req.body.paymentMethod)}, function(err, status){
            return callback(err, status);
    });
};

function getPaymentMethodObj(methods){
    return _.map(methods, function(m){
        return{
            value : m.value,
            name : m.name,
            amount : m.amount,
        }
    });
}

function checkPaymentMethod(methods){
    if(methods.length > 1) return 12;
    else return methods[0].value;
}

appointmentSchema.statics.changeStatus = function (req, callback) {
        Appointment.findOne({_id : req.body.appointmentId, status : {$in : [1,4]}}, function(err, appointment){
                User.findOne({_id : appointment.client.id}, function(err, user){
                    Appointment.count({'client.id': req.body.userId, status: {$in: [3]}, appointmentType: 3, cashbackUsed : true}, function (err, cashbackCount) {
                    var query = { _id : appointment.client.id, 'parlors.parlorId' : "" + appointment.parlorId };
                    var loyalityPoints = user.loyalityPoints ? user.loyalityPoints : 0;
                    var allCheck = true;
                    var incObj = {'parlors.$.noOfAppointments': 0 };
                    var updateObj = {};
                    var cashbackUsed = cashbackCount == 0 ? false : true;
                    updateObj.$set = {'parlors.$.lastAppointmentDate' : new Date()};
                    var productRevenue = 0;
                    if(req.body.status == 3){
                        incObj = {'parlors.$.noOfAppointments': 1 };
                        if(appointment.creditUsed != 0){
                            updateObj.activeMembership = getNewActiveMembership(user.activeMembership, appointment.creditUsed, appointment.membershipId);
                        }
                        if(appointment.allPaymentMethods.length == 0 && appointment.payableAmount > 0 && appointment.paymentMethod != 5)
                            allCheck = false;
                        if((appointment.allPaymentMethods.length >0) && (_.sum(_.map(appointment.allPaymentMethods, function(pay){ return pay.amount })) != appointment.payableAmount))
                            allCheck = false;
                        if(appointment.useAdvanceCredits){
                            var pac = _.find(user.parlors, {parlorId: "" + appointment.parlorId});
                            var advanceCredits = pac.advanceCredits - appointment.advanceCredits;
                            if(advanceCredits < 0) allCheck = false;
                            incObj = {'parlors.$.noOfAppointments': 1 , 'parlors.$.advanceCredits' : -1 * appointment.advanceCredits};
                        }
                        var appBooking = appointment.appBooking == 2 ? true : false;
                        var getFreebies = getFreebiesPoints(appointment.paymentMethod, appointment, cashbackCount, appBooking, user.isCorporateUser);
                        if(getFreebies.loyality > 0){
                            cashbackUsed = getFreebies.cashbackUsed;
                            loyalityPoints += getFreebies.loyality;
                            updateObj.loyalityPoints = loyalityPoints;
                            if(!updateObj.$push) updateObj.$push = {};
                            if(!updateObj.$push.creditsHistory) updateObj.$push.creditsHistory = {};
                            if(!updateObj.$push.creditsHistory.$each) updateObj.$push.creditsHistory.$each = [];
                            updateObj.$push.creditsHistory.$each.push({createdAt: new Date(), amount: getFreebies.loyality, balance : loyalityPoints, source : appointment.id, reason :  getFreebies.reason});
                        }
                        var totalServicePrice = 0, appointmentLoyalityPoints = appointment.loyalityPoints- appointment.loyalityOffer;

                        var loyalityOffer4 = appointment.loyalityOffer;
                        _.forEach(appointment.services, function(s){
                            if(s.discountMedium == "frequency" && s.subtotal == 0 && loyalityOffer4 > 0){
                                loyalityOffer4 -= s.price;
                            }
                        });

                        _.forEach(appointment.services, function(s){
                            if(_.filter([271,274], function(th){ return s.serviceCode == th})[0] && appointment.paymentMethod == 5 && loyalityOffer4>0){
                                totalServicePrice += 0;
                            }else{
                                if(s.subtotal != 0) totalServicePrice += (s.subtotal);
                            }
                        });

                        _.forEach(appointment.products, function(p){
                            productRevenue += (p.price * p.quantity);
                        });
                        _.forEach(appointment.services, function(s){
                            if(s.subtotal != 0){
                                if(_.filter([271,274], function(th){ return s.serviceCode == th})[0] && appointment.paymentMethod == 5){

                                }else{
                                    s.loyalityPoints = ((s.subtotal - s.creditsUsed - s.membershipDiscount)/totalServicePrice)*appointmentLoyalityPoints;
                                }
                            }
                            if(s.frequencyDealFreeService){
                                if(!updateObj.$push) updateObj.$push = {};
                                updateObj.$push.freeServices = {createdAt: new Date(), categoryId: s.categoryId, serviceId : s.serviceId, code : s.id, dealId : s.dealId, parlorId : appointment.parlorId, noOfService :  s.frequencyDealFreeService, price : s.frequencyPrice, discount : s.discount/ s.frequencyDealFreeService};
                            // }else if(s.type == 'deal' && (s.serviceId + ""  != "58707eda0901cc46c44af2eb") && (s.serviceId + ""  != "58707eda0901cc46c44af417" ) && (s.serviceId + ""  != "59520f3b64cd9509caa273ec" ) ){
                            }else if(s.type == 'deal' && (s.serviceId + ""  != "58707eda0901cc46c44af2eb") && (s.serviceId + ""  != "58707eda0901cc46c44af417" ) ){
                                var reimbursed = false;
                                allCheck = false;
                                user.freeServices = _.forEach(user.freeServices, function(free){
                                    if(free.serviceId + "" == s.serviceId + ""){
                                         if((free.parlorId + "" == appointment.parlorId + "") && !reimbursed){
                                            free.noOfService -= s.quantity;
                                            reimbursed = true;
                                            if(free.noOfService < 0){
                                                allCheck = false;
                                            }else allCheck = true;
                                         }
                                    }
                                });
                                user.freeServices =  _.filter(user.freeServices, function(s) {
                                    return  s.noOfService > 0;
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
                                updateObj.$push.creditsHistory = { $each : [ {createdAt: new Date(), amount: -1 * (appointment.loyalityPoints - appointment.loyalityOffer), balance : loyalityPoints, source : appointment.id , reason : 'Used for appointment'} ]} ;
                        }*/
                    }
                    updateObj.$inc = incObj;
                    console.log(allCheck, "allcheck");
                        if(allCheck){
                             Appointment.update({ _id: req.body.appointmentId, status: { $in : [1,4] } }, {cashbackUsed : cashbackUsed,services : appointment.services, productRevenue : productRevenue , status: req.body.status, appointmentEndTime: new Date(), closedBy : ObjectId.isValid(req.session.userId) ? req.session.userId : null, updatedAt : new Date() }, function (err, status) {
                                if(req.body.status == 3){
                                    Offer.update({code : appointment.couponCode}, {active : false}, function(err, d){
                                        console.log(updateObj);
                                        updateObj.recent = {createdAt : new Date(), parlorId : appointment.parlorId};
                                            User.update(query, updateObj, function(err, newItem){
                                                console.log(newItem);
                                                Appointment.sendAppointmentMail(appointment, user.emailId,function(){})

                                if(appointment.products.length > 0 && parseInt(req.body.status) == 3){
                                    var items = _.map(appointment.products, function(p){ return {amount : -1 * p.quantity, itemId : p.productId }; });
                                    ParlorItem.consumeItem(req, items, true, function (err, newItems) {
                                        updateLoyalityToReferer(getFreebies.loyality, user.referCodeBy, user.id, user.firstName, user.firebaseId, user.firebaseIdIOS, req.body.appointmentId, function(){
                                            return callback(err, {items : newItems});
                                        });
                                    });
                                }
                                else{
                                    updateLoyalityToReferer(getFreebies.loyality, user.referCodeBy, user.id, user.firstName, user.firebaseId, user.firebaseIdIOS, req.body.appointmentId, function(){
                                        return callback(err, status);
                                    });
                                }
                                        });
                                    });

                                }else{
                                    Appointment.refundLoyality(appointment, appointment.client.id, function(err, done){
                                        return callback(err, status);
                                    });
                                }
                             });
                        }else{
                            return callback(true, 'Undefined credits');
                        }
                });
        });
    });
};

appointmentSchema.statics.refundLoyality = function (appointment, userId, callback) {
    var loyalityPointUsed = appointment.loyalityPoints - appointment.loyalityOffer;
    _.forEach(appointment.services , function(ser) {
        if(ser.discountMedium=="frequency"&&ser.dealId==null&&ser.dealPriceUsed==true){
            User.update({_id: userId}, {$push: {freeServices: {createdAt: new Date(), categoryId: ser.categoryId, serviceId : ser.serviceId, code : appointment.client.gender == "F" ? 202 : 52, dealId : null, parlorId : null, noOfService : 1, price : appointment.client.gender == "F" ? 600 : 300, name : ser.name, discount : appointment.client.gender == "F" ? 300 : 150 }}}, function (err, freeService) {
                console.log(err);

            });
        }
        if (loyalityPointUsed > 0) {
            Appointment.refundLoyalityPoints(userId, appointment, 0, function(err, response){
                return callback(err, response);
            })
        } else {
            return callback(null, 'done');
        }
    })
};

appointmentSchema.statics.refundLoyalityPoints = function(userId, appointment, amount, callback){
    var loyalityPointUsed = appointment.loyalityPoints - appointment.loyalityOffer;
    if(amount>0)loyalityPointUsed = -1 * loyalityPointUsed;
    User.find({_id : userId, 'creditsHistory.reason' : amount > 0 ? 'Used for Appointment' : 'Refunded for Appointment', 'creditsHistory.reason' : appointment.id}, function(err, found){
    if(found.length<2 && loyalityPointUsed != 0){
        User.findOne({_id: userId}, function (err, newUserObj) {
                    var userLoyalityPoints = newUserObj.loyalityPoints + loyalityPointUsed;
                    User.update({_id: userId}, {loyalityPoints: userLoyalityPoints , $push: {creditsHistory: {createdAt: new Date(),amount: loyalityPointUsed, balance: userLoyalityPoints, source: appointment.id, reason: 'Refunded for Appointment'}}},function (err, d) {
                return callback(err, d);
            });
        });
    }else{
        return callback(false, null);
    }
    });
};

function updateLoyalityToReferer(loyalityCredited ,referal, userId, firstName, firebaseId, firebaseIdIOS,  appointmentId, callback){
    var referCode = referal ? referal : '9045^&dsGJpCGKOP';
    var loyalityPoints = 200;
    User.findOne({referCode : referCode}, function(err, user2){
    if(user2){
        Appointment.count({'client.id' : userId, status : 3}, function(err, count){
            if(count ==1){
                var loyalityPoints2 = user2.loyalityPoints ? user2.loyalityPoints + loyalityPoints : loyalityPoints;
                  User.update({_id : user2.id}, { loyalityPoints : loyalityPoints2, $push :{creditsHistory :  {  createdAt: new Date(), amount: loyalityPoints, balance : loyalityPoints2, source : appointmentId, reason : 'Referal Service'   }}}, function(e, u){
                    sendReviewNotification(loyalityCredited, userId, firstName, firebaseId, firebaseIdIOS, appointmentId);
                    sendReferalNotification(user2);
                    sendEmployeeNotification(appointmentId);
                    return callback();
                  });
              }else{
                    sendReviewNotification(loyalityCredited, userId, firstName, firebaseId, firebaseIdIOS, appointmentId);
                    sendEmployeeNotification(appointmentId);
                    return callback();
              }
        });
      }else{
            sendReviewNotification(loyalityCredited, userId, firstName, firebaseId, firebaseIdIOS, appointmentId);
            sendEmployeeNotification(appointmentId);
            return callback();
      }
  });
}


function sendEmployeeNotification(appointmentId){
    Appointment.findOne({_id : appointmentId}, {_id  : 1,employees : 1, services : 1}, function(err, appointment){
            var async = require('async');
            async.each(appointment.employees,
                function(emp, callback){
                    Admin.findOne({_id : emp.employeeId}, {firebaseId : 1}, function(err, employee){
                        var revenue = 0;
                        _.forEach(appointment.services, function(s){
                            var obj = [{
                                employeeId : "" + emp.employeeId,
                                totalRevenueEmp : 0,
                            }];
                            var serviceRevenue = Appointment.serviceFunction(s, obj);
                            revenue += serviceRevenue.employees[0].totalRevenueEmp;
                        });
                        var title = 'Appointment has been completed';
                        var body = 'You have earned Revenue of: ' + revenue;
                        var type = 'appointmentRevenue';
        // sendIonicNotification : function(firebaseId, title, body, type, callback){
                        ParlorService.sendIonicNotification(employee.firebaseId, title, body, type,appointmentId, function(){
                            callback();
                        });
                    });
          },
          function(err){
          });
    });
}


function sendReferalNotification(user){
    User.findOne({_id : user.id,  $or : [ { firebaseId : {$ne : null } },  { firebaseIdIOS : {$ne : null }} ] } ).exec(function(err, user) {
                if(user) {
                    var title = '200 Freebie credited';
                    var body = 'Your friend has completed appointment at Be U';
                    Notification.create({userId : user.id, action : 'freebie', title : title, body : body}, function(err, n){
                        Appointment.sendAppNotification(user.firebaseId, title, body, {type : 'freebie'}, n.id, function (err, response) {

                            //empty
                        });
                        Appointment.sendAppNotificationIOS(user.firebaseIdIOS, title, body,  null, 'freebie', n.id, function (err, response) {

                            });
                    });
                }
                });
}

function createRecommendation(appId){
    var title = "Recommended for You";
    Appointment.findOne({_id: appId},{"services.serviceId":1,"services.name":1 , "client" :1, appointmentStartTime:1}).exec(function(err,appointment) {
       var appServiceId =[];
        _.forEach(appointment.services,function(serv){
            appServiceId.push(serv.serviceId);
        });
        Recommendation.find({"services.serviceId" : {$in:appServiceId}}).exec(function(err,recomm){
            _.forEach(recomm ,function(r) {
                var serviceName = "";
                _.forEach(r.services, function(service){
                    var f = _.filter(appointment.services, function(appService){ return appService.serviceId+"" == service.serviceId+""})[0];
                    if(f) serviceName = f.name;
                })
                var str = r.descriptionNotification ,desc1 = str.replace(/%name%/i, ''+appointment.client.name+''),desc = desc1.replace(/%service%/i, ''+serviceName+'');
                var smsStr = r.descriptionSMS , desc2 = smsStr.replace(/%name%/i, ''+appointment.client.name+''), smsDesc = desc2.replace(/%service%/i, ''+serviceName+'');
                var date = (appointment.appointmentStartTime);
                var sDate = HelperService.addDaysToDate(date,r.days);

                Notification.create({userId: appointment.client.id, action: 'recommendation', title: title, body: desc,sent:false,sendingDate:sDate,sendSms:true,smsContent:smsDesc}, function (err, object) {
                    if(object)
                        console.log("done")
                })
            })
        })
    })
}

function sendReviewNotification(loyalityCredited, userId, firstName, firebaseId, firebaseIdIOS, appointmentId){
    var title = "We're all ears";
    var message = 'Have you reviewed our service yet?';
    var serviceRevenue = 0;
    Appointment.findOne({_id : appointmentId}, {services : 1}, function(err, appt){
        _.forEach(appt.services, function(s){
            serviceRevenue += Appointment.serviceFunction(s, []).totalRevenue;
        });
        Appointment.update({_id : appointmentId}, {serviceRevenue : serviceRevenue}, function(err, d){
            if(loyalityCredited>0)sendCashbackReferal(loyalityCredited, userId,firstName, firebaseId, firebaseIdIOS, 1);
            Notification.update({appointmentId : appointmentId, action : 'started'}, {active : false}, function(err, u){
                Notification.create({userId : userId, action : 'review', title : title, body : message, appointmentId : appointmentId}, function(err, n){
                    console.log(err);
                        Appointment.sendAppNotification(firebaseId, title, message, {appointmentId: appointmentId, type : 'review'}, n.id, function (err, response) {

                        });
                        Appointment.sendAppNotificationIOS(firebaseIdIOS, title, message, appointmentId, 'review',n.id ,function (err, response) {

                            });
                        createRecommendation(appointmentId, function (err, response) {

                        });

                });
            });
        });
    });
}


function sendCashbackReferal(loyalityCredited, userId,firstName, firebaseId, firebaseIdIOS, type){
    var title = 'Freebies Points';
    var body = ('Hey ' + firstName +', ') + (type ? ' your ' + loyalityCredited + ' freebie points have been successfully credited to your freebie account.' : ' you have earned ' + loyalityCredited + ' freebie points which will be credited to your freebie account post appointment');
    if(loyalityCredited>0){
        Notification.create({userId : userId, action : 'freebie', title : title, body : body}, function(err, n){
            Appointment.sendAppNotification(firebaseId, title, body, {type : 'freebie'}, n.id, function (err, response) {
                //empty
            });
            Appointment.sendAppNotificationIOS(firebaseIdIOS, title, body,  null, 'freebie', n.id, function (err, response) {

                });
        });
    }
}


function getFreebiesPoints(paymentMethod, appointment, count, type, isCorporate){
    var percentage = ParlorService.getPercentageCashback(paymentMethod, count);
    // if(isCorporate) percentage *= 2;
    var loyality = 0, cashbackUsed= false;
    var reason = '';
    var newSubtotal = parseInt(appointment.subtotal - appointment.loyalityPoints - appointment.membershipDiscount);
    var loyalityPoints = parseInt((newSubtotal * percentage)/100);
    if(paymentMethod == 1)newSubtotal = parseInt((newSubtotal * percentage)/100);
    if(appointment.razorPayCaptureResponse || type){
        if(type || appointment.razorPayCaptureResponse.status == "captured" ){
            loyality = count == 0 ? newSubtotal > 10000 ? 10000 : newSubtotal : loyalityPoints;
            reason = count == 0 ? ( percentage +'% cashback') : (percentage + '% cashback');
            if(appointment.membershipAmount > 0)loyality = parseInt(appointment.membershipAmount/1.18);
        }
    }
    loyality = parseFloat(loyality.toFixed(2));
    if(percentage == 100 || percentage == 50)cashbackUsed = true;
    return {loyality : loyality, reason : reason, cashbackUsed :cashbackUsed};
}


function getNewActiveMembership(activeMembership, creditsUsed, membershipId){
    var data = [];
    _.forEach(activeMembership, function(a){
        if(a.membershipId.equals(membershipId)){
            var left = a.creditsLeft - creditsUsed;
            if(left <= 0){
                creditsUsed -=  a.creditsLeft;
            }else{
                a.creditsLeft -= creditsUsed;
                creditsUsed = 0;
                data.push(a);
            }
        }else{
            data.push(a);
        }

    });
    return data;
}

appointmentSchema.statics.createAppointmentIdForUser = function (u, req, oldLoyalityPoints, callback) {
    // u.activeMembership = [];

    var buyMembershipId = req.body.buyMembershipId || null;
    var useMembershipCredits = req.body.useMembershipCredits;
    var membershipAmount = 0;

    Membership.findOne({_id : buyMembershipId}, function(err, membership){
        if(membership){
            if(u.activeMembership.length != 0){
                return callback(CreateObjService.response(true, 'User Already Have Membership'));
            }
            membershipAmount = parseInt(membership.price + (membership.price * membership.tax)/100);
            u.activeMembership = [{
                amount : membership.price,
                creditsLeft : membership.credits,
                parlorId : localVar.getMembershipParlorId(),
                name : membership.name,
                type : membership.type,
                membershipId : membership,
                validTo : HelperService.getTodayEnd()
            }];
        }
        var user = User.parse(u, req.body.parlorId);
        user.id = user.userId;
        Parlor.findOne({_id : req.body.parlorId}, function(err, parlor){
        Service.find({}, {gstDescription : 1, gstNumber : 1}, function(err, allServices){
            Slab.find({}, function(err, slabs){
                Appointment.findOne({parlorId : req.body.parlorId}).sort({parlorAppointmentId: -1}).exec( function(err, doc) {
                    var count = doc ? doc.parlorAppointmentId : 0;
                    Deals.getActiveDeals(req.body.parlorId, req.body.datetime,  function(deals){
                        var obj = Appointment.getServiceObj(parlor.services, req.body.services, deals, user, req.body.parlorId, req.body.useLoyalityPoints, oldLoyalityPoints, req, slabs, useMembershipCredits, allServices);
                        var appointmentObj = {
                            paymentMethod: 1,
                            parlorName: parlor.name,
                            comment : req.body.comment,
                            parlorAddress: parlor.address,
                            parlorAddress2: parlor.address2,
                            latitude : req.body.latitude || 0,
                            longitude : req.body.longitude || 0,
                            contactNumber: parlor.phoneNumber,
                            appointmentType: 3,
                            parlorId: req.body.parlorId,
                            client: user,
                            receptionist: null,
                            couponCode : null,
                            appointmentStartTime: req.body.datetime,
                            status: 0,
                            estimatedTime: obj.estimatedTime,
                            freebiesThreading : obj.freebiesThreading,
                            loyalityOffer : obj.loyalityOffer,
                            services: obj.services,
                            tax : obj.tax,
                            products: [],
                            employees: [],
                            buyMembershipId : buyMembershipId,
                            membershipAmount : membershipAmount,
                            membersipCreditsLeft : obj.membershipCreditsLeft,
                            creditUsed : obj.creditUsed,
                            membershipId : obj.membershipId,
                            membershipType : obj.membershipType,
                            membershipDiscount: obj.membershipDiscount,
                            otherCharges: 0,
                            loyalityPoints : obj.loyalityPoints,
                            subtotal: obj.subtotal,
                            discount: 0,
                            cashback: 0,
                            mode : req.body.mode || 3,
                            otp : Math.floor(Math.random() * 9000) + 1000,
                            productPrice : 0,
                            payableAmount: Math.ceil(obj.payableAmount),
                            parlorAppointmentId : ++count
                        };
                        console.log(appointmentObj);
                        if(obj.cancelRequest){
                            return callback(CreateObjService.response(true, 'Invalid quantity'));
                        }
                        else if(!req.body.appointmentId){
                            Appointment.create(appointmentObj, function(err, appointment){
                                if(err) return callback(CreateObjService.response(true, 'Data error'));
                                else return callback(CreateObjService.response(false, {appointmentId : appointment.id}));
                            });
                        }else{
                            Appointment.update({_id : req.body.appointmentId},appointmentObj, function(err, appointment){
                                if(err) return callback(CreateObjService.response(true, 'Data error'));
                                else return callback(CreateObjService.response(false, Appointment.parseSingleAppointmentForApp(appointmentObj, false)));
                            });
                        }

                    });
                });
            });
        });
        });
    });
};

appointmentSchema.statics.addThreadingService = function(threadingServices, appointmentServices){
    _.forEach(threadingServices, function(th){
        if(!_.filter(appointmentServices, function(s){ return th.prices[0].priceId == s.code })[0]){
            appointmentServices.push({
                serviceCode : th.serviceCode,
                code : th.prices[0].priceId,
                serviceId : th.serviceId,
                type : 'service',
                quantity : 1,
                addition : 0,
                typeIndex : 0,
                frequencyUsed : false,
            });
        }
    });
};

appointmentSchema.statics.getServiceObj = function(originalServices, appointmentServices, deals, user, parlorId, useLoyalityPoints, oldLoyalityPoints, req, slabs, useMembershipCredits, allServices) {
    // appointmentServices = JSON.parse(appointmentServices);
    _.forEach(appointmentServices, function(as){
        var pser = _.filter(originalServices, function(os){ return os.serviceCode == as.serviceCode})[0];
        if(pser){
            as.code = pser.prices[0].priceId;
        }
    });
    var estimatedTime = 0, services = [], subtotal = 0, loyalityPointsUsed =0, cancelRequest = false, freebiesThreading=0;
    var threadingServices = _.filter(originalServices, function(s){ return s.serviceCode == 271 || s.serviceCode == 274});
    if(req.body.useFreeThreading)Appointment.addThreadingService(threadingServices, appointmentServices);
    _.forEach(appointmentServices, function (service){
        if(service.type != "combo" && service.type != "newCombo"){
            _.forEach(originalServices, function (pService) {
                _.forEach(pService.prices, function (oService) {
                    if (service.code == oService.priceId) {
                        var offerThreading = _.filter(threadingServices, function(th){ return pService.serviceCode == th.serviceCode});
                        service.additions = service.typeIndex != 100 && service.typeIndex ? oService.additions[0].types[service.typeIndex].additions : 0;
                        var tempAdditions = 0;
                        var objAfterDeal = applyOthersDeal(oService, service, pService, deals, user, parlorId, [], req.body.useFreeThreading, offerThreading);
                        loyalityPointsUsed += objAfterDeal.loyalityPoints;
                        freebiesThreading += objAfterDeal.freebiesThreading;
                        subtotal += objAfterDeal.serviceSubtotal;
                        estimatedTime += oService.estimatedTime * service.quantity;
                        if(service.quantity<=0)cancelRequest = true;

                        var oSer = _.filter(allServices, function(aser){ return aser.id + "" == pService.serviceId + ""})[0];
                        services.push({
                            id: service.code,
                            serviceId: pService.serviceId,
                            serviceCode: pService.serviceCode,
                            categoryId: pService.categoryId,
                            estimatedTime: oService.estimatedTime * service.quantity,
                            name: objAfterDeal.name,
                            serviceName : objAfterDeal.name,
                            quantity: service.quantity,
                            tax: objAfterDeal.tax,
                            type: service.type,
                            additions: service.additions,
                            gstNumber : oSer.gstNumber,
                            gstDescription : oSer.gstDescription,
                            typeIndex : service.typeIndex,
                            employees: [],
                            loyalityPoints : objAfterDeal.loyalityPoints,
                            frequencyDiscountUsed : objAfterDeal.frequencyDiscountUsed,
                            price: objAfterDeal.priceUsed,
                            discount: objAfterDeal.discount,
                            discountMedium : objAfterDeal.discountMedium,
                            frequencyDealFreeService : objAfterDeal.frequencyDealFreeService,
                            frequencyPrice : objAfterDeal.frequencyPrice,
                            priceUsed : objAfterDeal.priceUsed,
                            dealPrice: oService.dealPrice,
                            dealId : objAfterDeal.dealId,
                            dealPriceUsed: objAfterDeal.dealPriceUsed,
                            actualPrice:objAfterDeal.menuPrice,
                            actualDealPrice: objAfterDeal.menuPrice,
                            subtotal : objAfterDeal.serviceSubtotal,
                        });
                    }
                });
            });
        }else{
            var dealComb = _.filter(deals, function(d) {return d.id + "" == service.serviceId; });
            if(dealComb.length > 0)
            {
                var comboServices = Appointment.getComboServices(dealComb[0], originalServices, service.quantity, service, deals, slabs);
                estimatedTime += comboServices.estimatedTime;
                subtotal += comboServices.serviceSubtotal;
                _.forEach(comboServices.services, function(cs){
                    var oSer = _.filter(allServices, function(aser){ return aser.id + "" == cs.serviceId + ""})[0];
                    services.push({
                        id: cs.code,
                        serviceId: cs.serviceId,
                        categoryId: cs.categoryId,
                        estimatedTime: cs.estimatedTime * service.quantity,
                        name: comboServices.name,
                        serviceName : cs.serviceName,
                        type : service.type,
                        gstNumber : oSer.gstNumber,
                        gstDescription : oSer.gstDescription,
                        loyalityPoints : 0,
                        brandId : cs.brandId,
                        productId : cs.productId,
                        serviceCode : cs.serviceCode,
                        quantity: service.quantity,
                        tax: cs.tax,
                        brandProductDetail : cs.brandProductDetail,
                        additions: 0,
                        price: Appointment.calculateComboPrice(cs.price, comboServices.realPrice ,comboServices.priceUsed),
                        subtotal : Appointment.calculateComboPrice(cs.price, comboServices.realPrice ,comboServices.serviceSubtotal),
                        employees : cs.employees,
                        dealPriceUsed : comboServices.dealPriceUsed,
                        actualDealPrice: Appointment.calculateComboPrice(cs.price, comboServices.realPrice ,comboServices.priceUsed),
                        actualPrice: cs.price,
                        dealId : comboServices.dealId
                    });
                });
            }
        }
    });
    if(user.loyalityPoints){
        var appointmentObj = {
            subtotal : subtotal,
            loyalityOffer : loyalityPointsUsed
        };
        user.loyalityPoints = Appointment.maximumLoyalityRedeemtion(user, appointmentObj, oldLoyalityPoints, req.body.paymentMethod);
    }

    var totalSum = 0;
    _.forEach(services, function(s){
        totalSum += s.subtotal;
    });

    _.forEach(services, function(s){
        if(s.subtotal != 0 && useLoyalityPoints && s.subtotal != s.loyalityPoints){
            s.loyalityPoints = (s.subtotal/totalSum)*user.loyalityPoints;
        }
    });
    var membershipDiscount = User.getMembershipDiscount(user.membership.length > 0 ? user.membership[0].creditsLeft : 0, user.membership, services, [], parseInt(useMembershipCredits), user.loyalityPoints, useLoyalityPoints);

    return { services : services, estimatedTime : estimatedTime, subtotal : subtotal, tax : membershipDiscount.tax, payableAmount : membershipDiscount.payableAmount, loyalityPoints : membershipDiscount.loyalityPoints + loyalityPointsUsed, cancelRequest: cancelRequest, loyalityOffer : loyalityPointsUsed, freebiesThreading: freebiesThreading, membershipCreditsLeft : membershipDiscount.creditsLeft, creditUsed : membershipDiscount.creditsUsed, membershipId : membershipDiscount.membershipId, membershipType : membershipDiscount.membershipType, membershipDiscount: membershipDiscount.discount };

};


appointmentSchema.statics.createNewObj = function (req, user, receptionist, originalServices, products, parlor, dist, couponResponse, deals, parlorItems, slabs, allServices) {
    var employeeData = {};
    var estimatedTime = 0, services = [], payableAmount = 0, employees = [], subtotal = 0, discount = dist, cashback = couponResponse.cashback,  membershipDiscount = 0, loyalityPointsUsed = 0, paymentMethod = 1, discountMedium = null, bookAppointmnet = true;
    _.forEach(req.body.data.services, function (service) {
        if(service.type != "combo" && service.type != "newCombo"){
        _.forEach(originalServices, function (pService) {
            _.forEach(pService.prices, function (oService) {
                if (service.code == oService.priceId)
                {
                    service.additions = service.typeIndex != 100 && service.typeIndex ? oService.additions[0].types[service.typeIndex].additions : service.additions;
                    var tempAdditions = service.additions;
                    var objAfterDeal = applyOthersDeal(oService, service, pService, deals, user, req.session.parlorId, couponResponse.discountServices, false, []);
                    if(objAfterDeal.discountMedium == "groupon")discountMedium = objAfterDeal.discountMedium;
                    if(services.length!=0 && discountMedium == "groupon")bookAppointmnet = false;
                    paymentMethod = objAfterDeal.paymentMethod;
                    loyalityPointsUsed += objAfterDeal.loyalityPoints;
                    subtotal += objAfterDeal.serviceSubtotal;
                    estimatedTime += oService.estimatedTime * service.quantity;
                    var employees1 = [];
                    _.forEach(service.employee1, function (e) {
                        _.forEach(oService.employees, function(emp){
                            employeeData[emp.userId] = emp.name;
                            if (emp.userId == e.userId) {
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
                    var oSer = _.filter(allServices, function(aser){ return aser.id + "" == pService.serviceId + ""})[0];
                    services.push({
                        id: service.code,
                        serviceId: pService.serviceId,
                        serviceCode: pService.serviceCode,
                        categoryId: pService.categoryId,
                        estimatedTime: oService.estimatedTime * service.quantity,
                        name: objAfterDeal.name,
                        serviceName : objAfterDeal.name,
                        type : service.type,
                        quantity: service.quantity,
                        tax: objAfterDeal.tax,
                        gstNumber : oSer.gstNumber,
                        gstDescription : oSer.gstDescription,
                        loyalityPoints : objAfterDeal.loyalityPoints,
                        additions: service.additions,
                        productId  : objAfterDeal.productId,
                        brandProductDetail : objAfterDeal.brandProductDetail,
                        productRatio : objAfterDeal.productRatio,
                        brandId : objAfterDeal.brandId,
                        brandRatio : objAfterDeal.brandRatio,
                        typeIndex : service.typeIndex,
                        employees: employees1,
                        discount: objAfterDeal.discount,
                        discountMedium : objAfterDeal.discountMedium,
                        price: objAfterDeal.priceUsed,
                        dealPriceUsed : objAfterDeal.dealPriceUsed,
                        actualPrice:objAfterDeal.menuPrice,
                        actualDealPrice: objAfterDeal.menuPrice,
                        subtotal : objAfterDeal.serviceSubtotal,
                        frequencyDiscountUsed : objAfterDeal.frequencyDiscountUsed,
                        frequencyPrice : objAfterDeal.frequencyPrice,
                        frequencyDealFreeService : objAfterDeal.frequencyDealFreeService,
                        dealId : objAfterDeal.dealId
                    });
                }
            });
        });
    }else{
        var dealComb = _.filter(deals, function(d) {return d.id + "" == service.serviceId; });
        if(dealComb.length > 0)
        {
                    var comboServices = Appointment.getComboServices(dealComb[0], originalServices, service.quantity, service, deals, slabs);
                    estimatedTime += comboServices.estimatedTime;
                    subtotal += comboServices.serviceSubtotal;
                    _.forEach(comboServices.services, function(cs){
                        Appointment.populateEmployee(employees, cs.employees, cs.estimatedTime, cs.serviceSubtotal);
                        var oSer = _.filter(allServices, function(aser){ return aser.id + "" == cs.serviceId + ""})[0];
                        services.push({
                            id: cs.code,
                            serviceId: cs.serviceId,
                            serviceCode : cs.serviceCode,
                            categoryId: cs.categoryId,
                            estimatedTime: cs.estimatedTime * service.quantity,
                            name: comboServices.name,
                            serviceName : cs.serviceName,
                            type : service.type,
                            quantity: service.quantity,
                            tax: cs.tax,
                            gstNumber : oSer.gstNumber,
                            gstDescription : oSer.gstDescription,
                            loyalityPoints : 0,
                            additions: 0,
                            brandId : cs.brandId,
                            price: Appointment.calculateComboPrice(cs.price, comboServices.realPrice ,comboServices.priceUsed),
                            employees : cs.employees,
                            productId : cs.productId,
                            brandProductDetail : cs.brandProductDetail,
                            dealPriceUsed : comboServices.dealPriceUsed,
                            actualPrice: cs.price,
                            subtotal : Appointment.calculateComboPrice(cs.price, comboServices.realPrice ,comboServices.serviceSubtotal),
                            dealId : comboServices.dealId
                        });
                    });

    }
}
    });

    var apptProducts = [];
    var productPrice = 0;
    var productTax = 0;
    _.forEach(products, function(product) {
        var  p = _.filter(parlorItems, function(parlorItem){ return parlorItem.itemId == product.code});
        if(p.length > 0){
        var parlorProduct = p[0];
            if(product.code == parlorProduct.itemId){
                productPrice += parlorProduct.sellingPrice * product.quantity;
                productTax += (parlorProduct.sellingPrice * parlorProduct.tax * product.quantity)/100;
                apptProducts.push({
                    productId: product.code,
                    code: product.code,
                    costPrice: parlorProduct.costPrice,
                    name: parlorProduct.name,
                    price: parlorProduct.sellingPrice,
                    tax: (parlorProduct.sellingPrice * parlorProduct.tax)/100,
                    commission: parlorProduct.commission,
                    quantity: product.quantity,
                    employeeId: product.employee,
                    employee: employeeData[product.employee] || ""
                });
            }
        }
    });
    user.membership = _.filter(user.membership, function(m){
        return m.membershipId == req.body.data.user.membershipId;
    });
    membershipDiscount = User.getMembershipDiscount(user.membership.length > 0 ? user.membership[0].creditsLeft : 0, user.membership, services, couponResponse, req.body.data.useMembershipCredits, user.loyalityPoints, req.body.data.useLoyalityPoints);

    payableAmount = membershipDiscount.payableAmount;
    user.creditsLeft = membershipDiscount.creditsLeft;
    payableAmount += (productPrice + productTax);
    subtotal += productPrice;
    payableAmount -= req.body.data.useAdvanceCredits && req.body.data.advanceCredits ? req.body.data.advanceCredits : 0;
    return {
        paymentMethod: paymentMethod,
        appointmentType: req.body.appointmentType,
        parlorId: req.session.parlorId,
        parlorName: parlor.name,
        parlorAddress: parlor.address,
        parlorAddress2: parlor.address2,
        contactNumber: parlor.phoneNumber,
        client: user,
        receptionist: receptionist,
        appointmentStartTime: req.body.data.appointmentTime ? req.body.data.appointmentTime : new Date(),
        status: 1,
        advanceCredits : req.body.data.advanceCredits ? req.body.data.advanceCredits : 0,
        oldCredits : req.body.data.oldCredits ? req.body.data.oldCredits : 0,
        useAdvanceCredits : req.body.data.useAdvanceCredits ? req.body.data.useAdvanceCredits : 0,
        useOldCredits : req.body.data.useOldCredits ? req.body.data.useOldCredits : 0,
        estimatedTime: estimatedTime,
        services: services,
        tax : parseFloat((parseFloat(membershipDiscount.tax) + parseFloat(productTax)).toFixed(2)),
        products: apptProducts,
        productPrice : productPrice,
        employees: employees,
        otherCharges: req.body.otherCharges || 0,
        subtotal: subtotal,
        discount: discount + membershipDiscount.normalDiscount,
        couponCode: discount ? req.body.data.couponCode : null,
        discountMedium : membershipDiscount.discountMedium,
        cashback: cashback,
        otp : req.body.data.otp,
        membersipCreditsLeft : membershipDiscount.creditsLeft,
        creditUsed : membershipDiscount.creditsUsed,
        loyalityPoints : membershipDiscount.loyalityPoints + loyalityPointsUsed,
        loyalityOffer : loyalityPointsUsed,
        membershipId : membershipDiscount.membershipId,
        membershipType : membershipDiscount.membershipType,
        membershipDiscount: membershipDiscount.discount,
        payableAmount: Math.ceil(payableAmount),
    };
};

function applyComboDeal(oService, service, pService, deals, user){

}


function nearByPresent(services, couponResponse, serviceId){
    var nearByPresent = false;
    _.forEach(services, function(s){
        var checkingDiscount = _.filter(couponResponse.discountServices, function(o){ return o.serviceId +"" == serviceId +"" && o.discountMedium == "groupon" })[0];
        if(checkingDiscount){
            nearByPresent = true;
            if(serviceId + "" == checkingDiscount.serviceId) nearByPresent = false;
        }
    });
    return nearByPresent;
}

appointmentSchema.statics.calculateComboPrice = function(price, realPrice ,finalPrice){
    return (price/realPrice)*finalPrice;
}

appointmentSchema.statics.calculatePriceAfterBrandProduct = function(serviceSubtotal, oService, service){
    var subtotal = serviceSubtotal,productId = null, brandProductDetail = "", productRatio = null, brandId = null, brandRatio = null;
    _.forEach(oService.brand.brands, function(brand){
        if(brand.brandId +"" == "" +service.brandId){
            if(oService.brand.brands.length > 1)brandProductDetail += ( oService.brand.title + ": " + brand.name + ", ");
            brandId = brand.brandId;
            subtotal = subtotal* brand.ratio;
            brandRatio = brand.ratio;
            _.forEach(brand.products, function(product){
                if(service.productId + "" == product.productId + ""){
                    brandProductDetail += ( brand.productTitle + ": " + product.name );
                    subtotal = subtotal * product.ratio;
                    productRatio = product.ratio;
                    productId = product.productId;
                }
            });
        }
    });
    return {
        subtotal : Math.ceil(subtotal),
        productId : productId,
        brandProductDetail : brandProductDetail,
        productRatio : productRatio,
        brandId : brandId,
        brandRatio : brandRatio,
    };
}

function applyOthersDeal(oService, service, pService, deals, user, parlorId, discountServices, useFreeThreading, offerThreading){
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
    var tax = oService.tax;
    var paymentMethod = 1;
    var menuPrice = oService.price + (service.additions ? service.additions : 0);
    var productId = null, brandProductDetail = "", productRatio = null, brandId = null, brandRatio = null;

    var checkingDiscount = _.filter(discountServices, function(o){ return o.serviceId +"" == pService.serviceId + "" && o.discountMedium == "groupon" })[0];
    var serviceSubtotal = checkingDiscount ? Math.round(checkingDiscount.amount * 1/1.18) : oService.price * service.quantity;
    var tempAdditions = 0;
    serviceSubtotal += service.additions ? service.additions * service.quantity : 0;
    if(useFreeThreading && offerThreading[0]){
        // serviceSubtotal -= oService.price * 1;
        freebiesThreading += oService.price;
        loyalityPoints = oService.price;
    }

    var newPrice = Appointment.calculatePriceAfterBrandProduct(serviceSubtotal, oService, service);

    serviceSubtotal = newPrice.subtotal;
    priceUsed = newPrice.subtotal/service.quantity;
    menuPrice = newPrice.subtotal/service.quantity;
    if(service.type!= "service"){
        var d = _.filter(deals, function(d) {return d.id + "" == service.serviceId; });
        var applyDeal = true;
        if(d[0]){
            var dealService = JSON.parse(JSON.stringify(d[0]));
            _.forEach(dealService.brands, function(brand){
                if(brand.brandId + "" == newPrice.brandId + ""){
                    applyDeal = true;
                    dealService.menuPrice *= brand.ratio;
                    dealService.dealType.price *= brand.ratio;
                    _.forEach(brand.products, function(product){
                        if(product.productId + "" == productId + ""){
                            dealService.menuPrice *= product.ratio;
                            dealService.dealType.price *= product.ratio;
                        }
                    });
                }
            });

        }
        menuPrice = Math.ceil(menuPrice);
        if(d.length > 0 && applyDeal){
            dealService.dealType.price = Math.ceil(dealService.dealType.price);
            menuPrice = dealService.menuPrice;
            var newSubtotal = service.type !="chooseOnePer" ? dealService.dealType.price * service.quantity : ( serviceSubtotal * (100-dealService.dealType.price))/100;
            dealPriceUsed = true;
            tempAdditions = service.additions;
            service.additions = 0;
            dealId = dealService.id;
            priceUsed = service.type !="chooseOnePer" ? dealService.dealType.price : (( serviceSubtotal * (100 - dealService.dealType.price))/(100 * service.quantity));

            if(checkingDiscount){
                priceUsed = Math.ceil(checkingDiscount.amount * 1/1.18);
                newSubtotal = priceUsed;
                discount = 0;
                if(checkingDiscount.discountMedium == "groupon"){
                    tax = 0;
                    paymentMethod = 11;
                }
                checkingDiscount.amount = 0;
                discountMedium = checkingDiscount.discountMedium;
                service.discount = 0;
            }
            if(service.type == "frequency"){
                var totalService = dealService.dealType.frequencyRequired + dealService.dealType.frequencyFree;
                priceUsed = oService.price;
                dealPriceUsed = false;
                service.quantity = totalService;
                service.additions = tempAdditions;
                newSubtotal = ( priceUsed + service.additions)  * totalService;
                discount = ( oService.price + service.additions)  * dealService.dealType.frequencyFree;
                frequencyDealFreeService = totalService;
                frequencyPrice = Math.round(newSubtotal / totalService);
                discountMedium = "frequency";
                tempAdditions = ( oService.price + service.additions) * (dealService.dealType.frequencyFree + dealService.dealType.frequencyRequired)
            }else if(service.type=="chooseOne" || service.type=="dealPrice"){
                tempAdditions = oService.price
                if(oService.additions.length > 0){
                    tempAdditions+= oService.additions[0].types[oService.additions[0].types.length-1].additions;
                }
            }else if(service.type=="chooseOnePer"){
                tempAdditions = (priceUsed/(1-(dealService.dealType.price/100)))
            }
            serviceSubtotal = newSubtotal;
            name = dealService.name;
        }else if(user.freeServices && service.type == "deal"){
            if(user.freeServices.length >0 && service.frequencyUsed){
                d = _.filter(user.freeServices, function(free){ return (free.serviceId + "" == pService.serviceId + "") && (free.parlorId + "" == parlorId + "" || free.parlorId == null) ;});
                if(d.length >0){
                    var dealFrequencyService = d[0];
                    if(service.quantity <= dealFrequencyService.noOfService){
                        var freeHairCutPrice = 0;
                        menuPrice = oService.price;
                        if(dealFrequencyService.parlorId == null){
                            var femaleHairCut = _.filter(deals, function(d) {return d.dealId == 36 })[0];
                            var maleHairCut = _.filter(deals, function(d) {return d.dealId == 37 })[0];
                            // var classicWaxing = _.filter(deals, function(d) {return d.dealId == 154 })[0];
                            /*if(classicWaxing){
                                var brandInFreeService = _.filter(classicWaxing.brands, function(ba){return ba.brandId + "" == service.brandId})[0];
                                if(brandInFreeService){
                                    femaleHairCut.dealType.price = parseInt(brandInFreeService.ratio * classicWaxing.dealType.price);
                                }
                            }*/
                            // if(femaleHairCut || maleHairCut || classicWaxing)
                            if(femaleHairCut || maleHairCut){
                                freeHairCutPrice = pService.gender == "F" ? femaleHairCut.dealType.price : maleHairCut.dealType.price;
                                menuPrice = pService.gender == "F" ? femaleHairCut.menuPrice : maleHairCut.menuPrice;
                            }
                        }
                        dealPriceUsed = true;
                        service.additions = 0;
                        dealId = dealFrequencyService.dealId;
                        priceUsed = dealFrequencyService.parlorId != null ? (dealFrequencyService.price - ( dealFrequencyService.discount ? dealFrequencyService.discount : 0)) : freeHairCutPrice;
                        discount = priceUsed;
                        discountMedium = "frequency";
                        frequencyDiscountUsed  = true;
                        frequencyPrice = dealFrequencyService.price;
                        serviceSubtotal = priceUsed;
                        tempAdditions = oService.price;
                        if(dealFrequencyService.parlorId == null) {
                            loyalityPoints = priceUsed;
                            frequencyPrice = priceUsed;
                        }
                    }
                }
            }
        }
    }else{
        tempAdditions = serviceSubtotal;
    }
    return {
        serviceSubtotal : serviceSubtotal,
        dealPriceUsed : dealPriceUsed,
        dealId : dealId,
        priceUsed : priceUsed,
        name : name,
        discount : discount,
        loyalityPoints : loyalityPoints,
        frequencyDiscountUsed : frequencyDiscountUsed,
        discountMedium : discountMedium,
        paymentMethod : paymentMethod,
        freebiesThreading : freebiesThreading,
        frequencyDealFreeService : frequencyDealFreeService,
        frequencyPrice : frequencyPrice,
        tax : tax,
        menuPrice : menuPrice,
        tempAdditions:tempAdditions,
        productId  : newPrice.productId,
        brandProductDetail : newPrice.brandProductDetail,
        productRatio : newPrice.productRatio,
        brandId : newPrice.brandId,
        brandRatio : newPrice.brandRatio,
    };
}

appointmentSchema.statics.getComboServices = function (dealCombo, parlorServices, quantity, service, deals, slabs) {
    var comboServices = service.services || dealCombo.services;
    var services = [], estimatedTime = 0, employees = [];
    var name = dealCombo.name;
    var realPrice = 0;
    _.forEach(comboServices, function(s){
        _.forEach(parlorServices, function(ps){
            if(ps.serviceCode == s.serviceCode){
                estimatedTime += ps.prices[0].estimatedTime;
                var temp = Appointment.getServiceRealPrice(ps.prices[0], s, deals);
                var price = temp.price;
                realPrice += price;
                services.push({
                    code : ps.prices[0].priceId,
                    serviceId : ps.serviceId,
                    serviceCode : ps.serviceCode,
                    serviceName : ps.name,
                    categoryId : ps.categoryId,
                    brandId : s.brandId,
                    serviceSubtotal : price,
                    productId : s.productId,
                    estimatedTime : ps.prices[0].estimatedTime,
                    tax : ps.prices[0].tax,
                    price : price,
                    employees : _.map(s.employees || [], function(emp){
                        return{
                            employeeId : emp.employeeId,
                            name : emp.name,
                            commission : 0,
                            distribution : emp.dist,
                        }
                    }),
                    brandProductDetail : temp.brandProductDetail,
                });
            };
        });
    });
    dealCombo.dealType.price = service.services ? Appointment.getComboServicePrice(dealCombo.slabId, realPrice, slabs) : dealCombo.dealType.price;
    var serviceSubtotal = dealCombo.dealType.price * service.quantity;
    var dealPriceUsed = true;
    var dealId = dealCombo.id;
    var priceUsed = dealCombo.dealType.price;
    return {services : services, realPrice : realPrice, estimatedTime : estimatedTime, employees : employees, serviceSubtotal : serviceSubtotal, dealPriceUsed : dealPriceUsed, dealId : dealId, name : name , priceUsed : priceUsed};
};

appointmentSchema.statics.getServiceRealPrice = function (parlorPrice, service, deals) {
    var price = parlorPrice.price;
    var brandProductDetail = "";
    var deals = _.filter(deals, function(obj){ return obj.dealType.name == 'dealPrice' || obj.dealType.name == 'chooseOne' || obj.dealType.name == 'chooseOnePer'; });
    _.forEach(deals, function(s){
        if(_.some(s.services, function (ser) {return ser.serviceCode === service.serviceCode;})){
            var obj = ParlorService.getDealObj2(s);
            if(s.menuPrice >0){
                    price = ParlorService.populateDealRatio(parlorPrice.brand.brands, obj, true, parlorPrice.price);
                  // price = parlorPrice.brand.brands.length == 0 ? obj.dealType.price : parlorPrice.price;
            }
        }
    });
    if(service.brandId){
        _.forEach(parlorPrice.brand.brands, function(brand){
            if(brand.brandId + "" == service.brandId){
                brandProductDetail += ( parlorPrice.brand.title + ": " + brand.name + ", ")
                price = brand.price || brand.ratio * parlorPrice.price;
                _.forEach(brand.products, function(product){
                    if(product.productId + "" == service.productId){
                        price = product.price || product.ratio * parlorPrice.price;
                        brandProductDetail += ( brand.productTitle + ": " + product.name );
                    }
                });
            }
        });
    }
    return {price : price , brandProductDetail : brandProductDetail} ;
};

appointmentSchema.statics.getComboServicePrice = function (slabId, totalPrice, slabs) {
    var slab = _.filter(slabs, function(s){
        return s.id + "" == slabId + "";
    })[0];
    var discount = 0;
    if(slab){
        _.forEach(slab.ranges, function(r){
            if(totalPrice > r.range1)discount = r.discount;
        });
    }
    return Math.ceil(totalPrice - (totalPrice * discount)/100);
};

appointmentSchema.statics.populateEmployee = function (employees, serviceEmployees, estimatedTime, price) {
    _.forEach(serviceEmployees, function(employee){
        var found = false;
        var distributedPrice = (price * employee.distribution)/100;
        _.forEach(employees, function (emp) {
            if (emp.employeeId +"" == employee.employeeId + "") {
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

appointmentSchema.statics.sendAppointmentMail=function (appt, emailId, callback) {
    if(emailId){
        var nodemailer = require('nodemailer');
        var transporter = nodemailer.createTransport('smtps://customercare@beusalons.com:beusalons@123@smtp.gmail.com');
                        var mailOptions = {
                            from: 'customercare@beusalons.com', // sender address
                            to: [emailId], // list of receivers
                            html: Appointment.appointmentBookedMailBody(appt, emailId),
                            subject: 'Summary of your order with Beu Salons - ' +appt.parlorName // Subject line
                        };
        // transporter.sendMail(mailOptions, function (error, info) {
        //     if (error)
        //         return console.log(error);
        //     else
        //         callback();
        // });
    }else{
        callback();
    }
}


appointmentSchema.statics.appointmentBookedSms=function (appt, userName, phoneNumber) {
    var d = appt.appointmentStartTime;
    // d.setHours(d.getHours() + 5); // set Hours to 5 hours later
    // d.setMinutes(d.getMinutes() + 30);
    var timeOfAppointment = (d.getHours() < 10 ? ('0'+d.getHours()) : d.getHours()) + ':' + (d.getMinutes() < 10 ? ('0'+d.getMinutes()) : d.getMinutes())
    var calculatedMonth=parseInt(d.getMonth())+1
    var dateOfAppointmnet=d.getDate()+"/"+calculatedMonth+"/"+d.getFullYear();
    var message = "Hi "+userName+", Your appointment is successfully booked at  "+appt.parlorName+" on "+dateOfAppointmnet+" for "+timeOfAppointment+" and services payable is INR "+appt.payableAmount+". In case of any issue, reach out to us at 91-9821798230/appointments@beusalons.com for further assistance.";
    return getSmsUrl('BEUSLN', message, [phoneNumber], 'T');
};

appointmentSchema.statics.ownerSms = function(num,data){
    var result = data.reports;
    var date2 =  new Date().toDateString();
    for (var i = 0; i < result.length; i++) {
        var parName = '';
        parName +=  result[i].parlorName + ' | ' + result[i].parlorAddress ;
    }
    var records = data.payment ,cash=records[0].amount , card=records[1].amount , aff=records[2].amount;
    var message= "Register Closure for "+date2+": "+parName+" Cash:"+cash+" CC:"+card+" Aff:"+aff+" Total:"+Math.round(data.totalCollectionToday)+" Srv:"+Math.round(data.totalServiceRevenue)+" Prd:"+Math.round(data.totalProductSale)+" Mem:"+data.totalMembershipSale+" Adv:"+data.totalAdvanceAdded+"";
    return getSmsUrl('BEUSLN',message ,num,'T');
};

appointmentSchema.statics.recommSms = function(num,message){

    return getSmsUrl('BEUSLN',message ,num,'T');
};


appointmentSchema.statics.newUserSms = function(num, message){

    return getSmsUrl('BEUSLN',message ,num,'T');
};

appointmentSchema.statics.settlementSms = function(num,message){

    return getSmsUrl('BEUSLN',message ,num,'T');
};

function getSmsUrl(messageId, message, phoneNumbers, type){
    return ParlorService.getSMSUrl(messageId, message, phoneNumbers, type);
}


appointmentSchema.statics.appointmentBookedMailBody = function (appt, email) {
            var d = appt.appointmentStartTime;
            var d2 = appt.createdAt;
            var calculatedMonth=parseInt(d.getMonth())+1;
            var calculatedMonth2=parseInt(d2.getMonth())+1;
            var dateOfAppointmnet=d.getUTCDate() + "/" + calculatedMonth + "/" + d.getFullYear();
            var todaysDate = d2.getUTCDate() + "/" + calculatedMonth2 + "/" + d2.getFullYear();
             var timeApptConvert = appt.appointmentStartTime;
           // timeApptConvert.setHours(timeApptConvert.getHours() - 5); // set Hours to 5 hours later
           // timeApptConvert.setMinutes(timeApptConvert.getMinutes() - 30);
             var appointmnetTime = (timeApptConvert.getHours() < 10 ? ('0'+timeApptConvert.getHours()) : timeApptConvert.getHours()) + ':' + (timeApptConvert.getMinutes() < 10 ? ('0'+timeApptConvert.getMinutes()) : timeApptConvert.getMinutes());
             /*if(timeApptConvert.getHours()>=12){
                appointmnetTime=appointmnetTime+'PM';
            }else{
                appointmnetTime=appointmnetTime+'AM';
            }*/
            var paymentMethodName = '';
            // client.name , client.phoneNumber , client.emailId
            if(appt.paymentMethod == 1){
                paymentMethodName='Cash';
            }else if(appt.paymentMethod == 5 || appt.paymentMethod == 6){
                paymentMethodName='Online';
            }
            //console.log(appt.parlorAppointmentId+" "+dateOfAppointmnet+" "+appt.parlorName+" "+appt.parlorAddress+" "+appt.paymentMethod+" "+appt.services[0].name+"("+appt.services[0].price+" "+appt.services[0].price*appt.services[0].quantity+" "+appt.subtotal+" "+appt.tax+" "+appt.payableAmount)

            var mailBody='<body style="font-size:14px; font-family:helveltica Neue, helveltica,arial, sans-serif; color:#58595b;"><table style="width:100%;"  height="854" cellpadding="0" cellspacing="0">';

            //image part of beusalons + parlorAppointmentId + currentDate + appointmentDate
            mailBody +='<tr><td width="378" height="91"><img src="https://www.monsoonsalon.com/emailler/images/beu-logo.png" width="150" alt="Beu salons" /></td><td width="127">&nbsp;</td> <td width="100">&nbsp;</td><td width="193" align="center"><strong>Invoice #:'+appt.parlorAppointmentId+'&nbsp;&nbsp;</strong><br />Created:'+todaysDate+'<strong>&nbsp;&nbsp;</strong><br /> Due: '+dateOfAppointmnet+'<br/><span>Appointment time:</span>'+appointmnetTime+'</td> </tr>';

            //empty
            mailBody +='<tr> <td height="33">&nbsp;</td>  <td>&nbsp;</td><td>&nbsp;</td> <td>&nbsp;</td></tr>';

            //parlorName + parlorAddress +client(name,email,phoneNumber)
            mailBody +='<tr> <td height="83" style="font-size: 14px;color:#58595b"><strong>&nbsp;&nbsp;</strong>'+appt.parlorName+'<br /><strong>&nbsp;&nbsp;</strong>'+appt.parlorAddress+'<br /><strong>&nbsp;&nbsp;</strong>'+appt.parlorAddress2+'<br/><strong>&nbsp;&nbsp;</strong><span>Contact No.</span>'+appt.contactNumber+'</td> <td>&nbsp;</td> <td>&nbsp;</td><td align="center" ><span style="text-transform: capitalize">'+appt.client.name+'</span><strong>&nbsp;&nbsp;</strong><br />'+appt.client.phoneNumber+'<strong> &nbsp;&nbsp;</strong><br />'+email+'<strong>&nbsp;&nbsp;</strong></td>  </tr>';

            //empty
            mailBody +='<tr><td height="30">&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>';

            //payment method heading thats all which is static (data in the next row)
            mailBody +='<tr><td height="41" style="border-bottom-color: #ddd;border-bottom-style: solid;border-bottom-width: 1px;background-color: #eee;"><strong>&nbsp;&nbsp;Payment Method</strong></td><td style="border-bottom-color: #ddd;border-bottom-style: solid;border-bottom-width: 1px;background-color: #eee;">&nbsp;</td><td style="border-bottom-color: #ddd;border-bottom-style: solid;border-bottom-width: 1px;background-color: #eee;">&nbsp;</td><td align="center" style="border-bottom-color: #ddd;border-bottom-style: solid;border-bottom-width: 1px;background-color: #eee;"><strong>Amount #&nbsp;&nbsp;</strong></td></tr>';

            //payment method-COD , Online and the grandtotal(app.payableAmount)
            mailBody +='<tr><td height="62"><strong>&nbsp;&nbsp;</strong>'+paymentMethodName+'</td><td>&nbsp;</td><td>&nbsp;</td><td align="center">'+appt.payableAmount+'&nbsp;&nbsp;</td></tr>';

            //This is again just the HEADING (services, Unit prices , You save% , Price)
            mailBody +='<tr><td height="51" align="left" style="border-bottom-color: #ddd;border-bottom-style: solid;border-bottom-width: 1px;background-color: #eee;"><strong>Services</strong></td><td align="center" style="border-bottom-color: #ddd;border-bottom-style: solid;border-bottom-width: 1px;background-color: #eee;"><strong>Unit Price</strong></td><td align="center" style="border-bottom-color: #ddd;border-bottom-style: solid;border-bottom-width: 1px;background-color: #eee;"><strong>You Save%</strong></td> <td align="center" style="border-bottom-color: #ddd;border-bottom-style: solid;border-bottom-width: 1px;background-color: #eee;"><strong>Price&nbsp;&nbsp; </strong></td></tr>';

            //Dynamically services rows are made depending upon the services bought by the user
            var rowIndex=0;
            var discount = 0;
            appt.services = Appointment.populateServices(appt.services);
            while(rowIndex<appt.services.length){
                var percentageDiscountPerUnit=(1-(parseInt(appt.services[rowIndex].price)/parseInt(appt.services[rowIndex].actualDealPrice ? appt.services[rowIndex].actualDealPrice : appt.services[rowIndex].actualPrice )))*100;
                discount += (appt.services[rowIndex].discount ? appt.services[rowIndex].discount : 0);
                mailBody +='<tr><td height="105" style="border-bottom-color: #ddd;color:#58595b;border-bottom-style: solid;border-bottom-width: 1px;font-size: 14px;">'+appt.services[rowIndex].name+'</td><td align="center" style="border-bottom-color: #ddd;border-bottom-style: solid;border-bottom-width: 1px;">INR '+appt.services[rowIndex].price+'</td><td align="center" style="border-bottom-color: #ddd;border-bottom-style: solid;border-bottom-width: 1px;">'+ Math.ceil(percentageDiscountPerUnit)+'%</td><td align="center" style="border-bottom-color: #ddd;border-bottom-style: solid;border-bottom-width: 1px;">INR '+appt.services[rowIndex].price*appt.services[rowIndex].quantity+'</td></tr>';
                rowIndex++;
            }

            //this shows the subtotal
            mailBody +='<tr><td height="45" >&nbsp;</td><td >&nbsp;</td><td >&nbsp;</td><td align="center" style="border-bottom-color: #ddd;border-bottom-style: solid;border-bottom-width: 1px;">Total : INR '+appt.subtotal+'</td></tr>';

            //this shows the tax
            mailBody +='<tr><td height="41" >&nbsp;</td><td >&nbsp;</td><td >&nbsp;</td><td align="center" style="border-bottom-color: #ddd;border-bottom-style: solid;border-bottom-width: 1px;">CGST/CGST Tax 18% : INR '+appt.tax+'</td></tr>';

            //this shows the tax
            mailBody +='<tr><td height="41" >&nbsp;</td><td >&nbsp;</td><td >&nbsp;</td><td align="center" style="border-bottom-color: #ddd;border-bottom-style: solid;border-bottom-width: 1px;">Discount (-) : INR '+discount+'</td></tr>';

            //this shows the GRAND TOTAL
            mailBody +='<tr><td height="54" >&nbsp;</td><td >&nbsp;</td><td >&nbsp;</td><td align="center" style="border-bottom-color: #ddd;border-bottom-style: solid;border-bottom-width: 1px;"><strong>Grand Total: INR '+appt.payableAmount+'</strong></td></tr>';

            //End
            mailBody +='<tr><td >&nbsp;</td><td >&nbsp;</td><td >&nbsp;</td><td >&nbsp;</td></tr></table></body>';
            return mailBody;
        }


// on every save, add the date
appointmentSchema.pre('save', function (next) {
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
// appointmentSchema.plugin(autoIncrement.plugin, 'appointment');
var Appointment = mongoose.model('appointment', appointmentSchema);

// make this available to our users in our Node applications
module.exports = Appointment;
