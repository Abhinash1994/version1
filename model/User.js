/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var async = require('async');
var nodemailer = require('nodemailer');


var userSchema = new Schema({

    emailId: { type: 'string', size: 50 },

    firebaseId: { type: 'string', default: null },

    firebaseIdIOS: { type: 'string', default: null },

    customerId: { type: 'number' },

    credits: { type: 'number', default: 0 },

    campaign: { type: 'string', default: null },

    medium: { type: 'string', default: null },

    source: { type: 'string', default: null },

    sourceType : {type : 'string', default : null},

    firstTimeVerified: { type: 'number', default: 0 },

    accesstoken: { type: 'String', default: "dsasdasda" },

    isAllotedToSubscriptionTeam : {type : 'Boolean', default : false},

    subscriptionId : { type : 'number' , default :0},

    subscriptionOtp : {type : 'number'},

    subscriptionLoyality : { type : 'number', default : 0 },

    subscriptionValidity : {type : 'number' , default :12},

    subscriptionBuyDate : { type : 'date', default : null},

    subscriptionRenewDate : { type : 'date', default : null},

    subscriptionRenewValidity : {type : 'number', default : 0},

    isEligibleForGivingGift : {type : 'Boolean', default : true},

    subscriptionRedeemMonth : { 
        
        amount : {type : 'number', default : 0},

        month : {type : 'number', default : -1 },   
    },

    marketingSource:{
        adName:{ type: 'string', default: null },
        campaignName:{ type: 'string', default: null },
        adSetname:{ type: 'string', default: null },
        source:{ type: 'string', default: null },
    },

    subscriptionReferalHistory: {
        type: [{
            createdAt: { type: 'date' },
            userId: { type: Schema.ObjectId },
        }],
        defaultsTo: []
    },

    subscriptionGiftHistory: {
        type: [{
            createdAt: { type: 'date' },
            userId: { type: Schema.ObjectId },
        }],
        defaultsTo: []
    },

    subscriptionRedeemHistory: {
        type: [{
            createdAt: { type: 'date' },
            appointmentStartTime: { type: 'date' },
            appointmentId: { type: Schema.ObjectId },
            amount: { type: 'number' },
        }],
        defaultsTo: []
    },

    freebieExpiry : { type : 'date'},

    sourceBeu : {type : 'number'},

    profilePic: { type: 'String', default: "https://www.buira.net/assets/images/shared/default-profile.png" },

    creditsHistory: {
        type: [{
            createdAt: { type: 'date' },
            amount: { type: 'number' },
            reason: { type: 'string' },
            source: { type: Schema.ObjectId },
            balance: { type: 'number' }
        }],
        defaultsTo: []
    },

    freeServices: {
        type: [{
            createdAt: { type: 'date' },
            noOfService: { type: 'number' },
            categoryId: { type: Schema.ObjectId },
            serviceId: { type: Schema.ObjectId },
            brandId: { type: 'string', default: '' },
            productId: { type: Schema.ObjectId },
            priceId: { type: 'number' },
            dealId: { type: 'number' },
            parlorId: { type: Schema.ObjectId },
            code: { type: 'number' },
            name: { type: 'string' },
            price: { type: 'number' },
            discount: { type: 'number' },
            source: { type: 'string', default: '' },
            dealType: { type: 'string' },
            expires_at: { type: 'date' },
            enableUpgrade: { type: 'Boolean' },
            description: { type: 'string', default: '' },
            availed: { type: 'Boolean' },
        }],
        defaultsTo: []
    },

    servicesInCart: { type: [{
        parlorId : {type : Schema.ObjectId, default : null},
        time : {type : 'date'},
        serviceCodes : {type : [{
            code : { type : 'number'},
            time : {type : 'date'},
        }], defaultsTo : []},
    }], defaultsTo: [] },

    lastServiceAddTime: { type: 'date' },

    servicesAvailable: { type: [], defaultsTo: [] },

    activeMembershipId : { type : Schema.ObjectId, default : null },

    freeMembershipServiceAvailed : { type : "Boolean", default : false },

    contactedForUserQuestions : { type : "Boolean", default : false },

    activeMembership: {
        type: [{
            createdAt: { type: 'date' },
            amount: { type: 'number' },
            creditsLeft: { type: 'number' },
            name: { type: 'string' },
            parlorId: { type: Schema.ObjectId, ref: 'Parlor' },
            type: { type: 'number' },
            membershipWithTax : {type : 'Boolean', default : false},
            membershipId: { type: Schema.ObjectId, ref: 'Membership' },
            membershipSaleId: { type: Schema.ObjectId, },
            validTo: { type: 'date' }
        }],
        defaultsTo: []
    },

    favourites: {
        type: [{
            createdAt: { type: 'date' },
            parlorId: { type: Schema.ObjectId },
        }],
        defaultsTo: []
    },

    recent: {
        createdAt: { type: 'date' },
        parlorId: { type: Schema.ObjectId },
    },

    freeHairCutBar: { type: 'number', default: 0 },

    password: { type: 'string' },

    favParlor: { type: 'number' },

    phoneNumber: { type: 'string', unique: true, required: true },

    phoneVerification: { type: 'number', default: 0 },

    freebiesTrackMonth: { type: 'number', default: 0 },

    allow100PercentDiscount: { type: 'Boolean', default: false },

    isCorporateUser: { type: 'Boolean', default: false },

    corporateCompanyId: { type: Schema.ObjectId },

    corporateEmailId: { type: 'string' },

    companyId: { type: 'string' },

    corporateOtp: { type: 'number' },

    realOtp: { type: 'number' },

    freeHairCutBarChangeDate: { type: 'date' },

    registerLatitude: { type: 'number', default: 0 },

    latitude: { type: 'number', default: 0 },

    registerLongitude: { type: 'number', default: 0 },

    longitude: { type: 'number', default: 0 },

    loyalityPoints: { type: 'number', default: 0 },

    hundredPercentRedeemableLoyalityPoints: { type: 'number', default: 0 },

    referalLoyalityPoints: { type: 'number', default: 0 },

    firstName: { type: 'string', required: true },

    lastName: { type: 'string', default: '' },

    userType: { type: 'Boolean' },

    isBlocked: { type: 'Boolean', default : false }, //block user

    buyOneGetOneSubscriber: { type: 'Boolean'}, 

    buyOneGetOneSubscriberFrom: { type: 'string'}, 

    gender: { type: 'string', enum: ["M", "F"], size: 1, default: "M" },

    genderUpdated: { type: 'Boolean', default:false},

    parlors: {
        type: [{
            createdAt: { type: 'date' },
            parlorId: { type: 'string' },
            createdBy: { type: Schema.ObjectId },
            lastAppointmentDate: { type: 'date' },
            name: { type: 'string' },
            noOfAppointments: { type: 'number', default: 0 },
            advanceCredits: { type: 'number', default: 0 },
            oldAdvanceCredits: { type: 'number', default: 0 }
        }],
        defaultsTo: []
    },

    streetLine1: { type: 'string', default: '' },

    streetLine2: { type: 'string', default: '' },

    googleId: { type: 'string' },

    mobile: { type: 'number', default: 0 },

    corporateReferralCount: { type: 'number', default: 0 },

    messageSent: { type: 'number', default: 0 },

    facebookId: { type: 'string' },

    referCode: { type: 'string', default: null },

    referCodeBy: { type: 'string', default: null },

    city: { type: 'string' },

    loginTime: { type: 'date' },

    lastActiveTime: { type: 'date' },

    lastCartActivity: { type: 'date' },

    fbLastCheckIn: { type: 'date' },

    fbCheckIns: {
        type: [{
            createdAt: { type: 'date' },
            message: { type: 'string' },
            freebies: { type: 'number' },
            appointmentId: { type: 'string' },
        }],
        defaultsTo: []
    },

    logoutTime: { type: 'date' },

    createdAt: { type: 'date' },

    appRegistrationDate: { type: 'date' },

    updatedAt: { type: 'date' },

    androidVersion: { type: 'string', default: null },

    iosVersion: { type: 'string', default: null },

    benefit: { type: 'string' },

    corporateRegisterDate :{type : 'date'},

    unverifiedCoroprateEmail :{ type: 'string' },

    newAndroidVersion : {type : 'number'},

    closeBottomSheet : {
        type :[{
            type: {type : 'number'},
            closeTill: {type: 'date'},
            closeCount : {type :'number'},
        }]
    },

    sendSubscriptionSms :{ type: 'Boolean' },

    couponCodeHistory : {
        type: [{
            active : {type: 'Boolean' , default:true},
            couponDescription : {type : 'string'},
            couponTitle : {type : 'string'},
            createdAt : { type: 'date' },
            code : { type: 'string' },
            extraDiscountCoupon : {type : 'Boolean'},
            couponType:{type:'number'}, //1- App Download, 2- 24hrs Advance,  3 - corporate, 4 - customer Care coupons, 11- Employee, 13-custom
            loyalityPoints : { type: 'number' },
            appointmentId : { type: Schema.ObjectId },
            parlorId : { type: Schema.ObjectId },
            offPercentage : {type:'number' , default : 0},
            limit : {type: 'number', default :0},
            // imageUrl : {type:'string'},
            expires_at : { type: 'date' },
        }],
        defaultsTo: []
    },

    questionAnswers : {
        type: [{
            questionId: {type: Schema.ObjectId },
            answers: [{ type: Schema.ObjectId}],
        }],
        defaultsTo: []
    },

    firstAppointmentSource : {type : "number"}, //0-crm, 1- app

});





userSchema.statics.findFBFriends = function(parlorId, userId, callback) {
    var text = "";
    var elseCount = 0;
    UserFbFriend.find({ userId: userId }, { facebookId: 1 }, function(err, friends) {
        var facebookIds = _.map(friends, function(f) { return f.facebookId });
        Appointment.find({ status: 3, facebookId: { $in: facebookIds }, parlorId: parlorId }, { "client.name": 1 }, function(err, d) {
            _.forEach(d, function(e, key) {
                if (key < 2) {
                    text += e.client.name;
                    if (key != 1) text += ", ";
                } else {
                    elseCount++;
                }
            });
            if (elseCount != 0) text += " and " + elseCount + " more.";
            if (text != "") text += " has been here.";
            return callback(text);
        });
    });
};

userSchema.statics.getUsersForMarketing = function(req, callback) {
    var match = {
            "parlors.parlorId" : req.session.parlorId
        };
    if(req.query.gender){
        match.gender = req.query.gender;
    }
    User.aggregate([
        {
            $match : match
        },
        {
            $project : {
                phoneNumber : 1
            }
        }
    ]).exec(function(err, users){
        return callback(users);
    });
};

function titleCase(str) {
    return str.toLowerCase().split(' ').map(function(word) {
        return word.replace(word[0], word[0].toUpperCase());
    }).join(' ');
}


userSchema.statics.getSubscriptionLeftByMonth = function(userId, appointmentStartTime, userSubscriptionAmount,  callback) {
     User.findOne({_id : userId}, {subscriptionValidity : 1, subscriptionBuyDate : 1}, function(er, user){
        var subscriptionDate = AppointmentHelperService.getSubscriptionCycleDates(user.subscriptionBuyDate);
        var queryDate =  {$gt : HelperService.getFirstDateOfByDate(appointmentStartTime), $lt : HelperService.getLastDateOfByDate(appointmentStartTime) };
        if(user.subscriptionBuyDate > ConstantService.getSubscriptionModelChangeDate()){
            queryDate = {$gt : subscriptionDate.startDate , $lt : subscriptionDate.endDate}
        }
        Appointment.aggregate([
        {
            $match : {"client.id" : ObjectId(userId)}
        },
        {
            $match : {
                "appointmentStartTime" : queryDate , status : {$in : [1,3,4]}, loyalitySubscription : {$gt : 0}
            }
        },
        {
            $project : {
                loyalitySubscription : 1,
            }
        },
        {
            $group : {
                _id : null,
                loyalityUsed : {$sum : "$loyalitySubscription"}
            }
        }
        ]).exec(function(err, user){
            console.log(err);
            console.log(user);
            if(user.length==0)return callback(userSubscriptionAmount);
            var sub = user[0].loyalityUsed;
            return callback(parseInt(userSubscriptionAmount - sub));
        });
    });
    
};

userSchema.statics.getSubscriptionLeftByMonthv4 = function(userId, appointmentStartTime, userSubscriptionAmount,  callback) {
    User.findOne({_id : userId}, {subscriptionId :1 , subscriptionValidity : 1, subscriptionBuyDate : 1}, function(er, user){
        if(user.subscriptionId){
        var subscriptionDate = AppointmentHelperService.getSubscriptionCycleDates(user.subscriptionBuyDate);
        var queryDate =  {$gt : HelperService.getFirstDateOfByDate(appointmentStartTime), $lt : HelperService.getLastDateOfByDate(appointmentStartTime) };
        if(user.subscriptionBuyDate > ConstantService.getSubscriptionModelChangeDate() && new Date() > user.subscriptionBuyDate){
            queryDate = {$gt : subscriptionDate.startDate , $lt : subscriptionDate.endDate}
        }
        Appointment.aggregate([
        {
            $match : {"client.id" : ObjectId(userId)}
        },
        {
            $match : {
                "appointmentStartTime" : queryDate, status : {$in : [1,3,4]}, loyalitySubscription : {$gt : 0}
            }
        },
        {
            $project : {
                loyalitySubscription : 1,
                parlorTax: 1,
                parlorId : 1,
                parlorType: 1,
            }
        }
        ]).exec(function(err, user){
            if(user.length==0)return callback(userSubscriptionAmount);
            var sub = 0;
            var parlorIds = _.map(user, function(u){return u.parlorId});
            Parlor.find({_id : {$in : parlorIds}}, {createdAt : 1}, function(err, parlors){
                _.forEach(user, function(u){
                    let pa = _.filter(parlors, function(p){return p.id+ "" == u.parlorId + ""})[0];
                    if(!u.parlorTax && u.parlorTax!=0)u.parlorTax = 18;
                    if(!u.parlorType)u.parlorType = 0;
                    // sub += ( u.loyalitySubscription * (1 + parseInt(u.parlorTax)/100 ) * (u.parlorType == 4 && (pa.createdAt < new Date(2018, 11, 1)) ? 1.67 : 1) );
                    sub += ( u.loyalitySubscription * (1 + parseInt(u.parlorTax)/100 ) * (u.parlorType == 4 ? 1 : 1) );
                });
                if(sub>userSubscriptionAmount)sub = userSubscriptionAmount;
                return callback(parseInt(userSubscriptionAmount - sub));
            });
        });
        }else{
            return callback(0);
        }
    });
    
};

userSchema.statics.getActiveMembership = function(phoneNumber, cb) {

    User.findOne({ phoneNumber: phoneNumber }).populate('activeMembership.membershipId').exec(function(err, user) {
        // console.log(user)
        if (user) {
            var removeCredits = 0;
            var active = _.filter(user.activeMembership, function(r) {
                // console.log("userMember" , r)
                if ((r.validTo.getTime() - new Date().getTime()) < 0) removeCredits += r.creditsLeft;
                return (r.validTo.getTime() - new Date().getTime()) > 0 && r.membershipId;
            });
            if (active.length != user.activeMembership.length) {
                User.update({ _id: user.id }, { activeMembership: active, credits: user.credits - removeCredits, $push: { "creditsHistory": { createdAt: new Date(), amount: -1 * removeCredits, balance: user.credits - removeCredits } } }, function(err, data) {
                    user.credits = user.credits - removeCredits;
                    user.activeMembership = active;
                    return cb(user);
                });
            } else {
                return cb(user);
            }
        } else {
            return cb({ parlors: [] });
        }
    });
};

userSchema.statics.compressMembership = function(memberships, parlorId) {
    var data = [];
    _.forEach(memberships, function(m) {
        var result = _.some(data, function(mem) {
            return m.membershipId == mem.membershipId;
        });
        if (!result) {
            var d = {
                creditsLeft: 0,
                name: m.name,
                parlorId: m.parlorId || parlorId,
                type: m.type,
                membershipId: m.membershipId,
                membershipDiscount: m.membershipId
            };
            _.forEach(memberships, function(mem) {
                d.creditsLeft += mem.creditsLeft;
                d.id = mem.membershipSaleId;
            });
            data.push(d);
        }
    });
    return data;

};

userSchema.statics.compressMembership2 = function(memberships, parlorId) {
    var data = [];
    _.forEach(memberships, function(m) {
        var result = _.some(data, function(mem) {
            return m.membershipId.id == mem.membershipId;
        });
        if (!result) {
            var d = {
                creditsLeft: m.creditsLeft,
                name: m.name,
                parlorId: m.parlorId || parlorId,
                type: m.type,
                membershipId: m.membershipId.id,
                dealDiscount: m.membershipId.dealDiscount,
                menuDiscount: m.membershipId.menuDiscount,
                id : m.membershipSaleId,
                membershipWithTax : m.membershipWithTax,

            };
            /*_.forEach(memberships, function(mem) {
                d.creditsLeft += mem.creditsLeft;
                d.id = mem.membershipSaleId;
                d.membershipWithTax = mem.membershipWithTax;
            });*/
            data.push(d);
        }
    });
    return data;
};

userSchema.statics.getUserObj = function(req) {
    return {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        emailId: req.body.emailId,
        phoneNumber: req.body.phoneNumber,
        gender: req.body.gender,
        parlors: [{ parlorId: req.session.parlorId, createdBy: req.session.userId, noOfAppointments: 0, createdAt: new Date(), updatedAt: new Date() }],
        streetLine1: req.body.streetLine1,
        streetLine2: req.body.streetLine2,
        city: req.body.city
    };
};


userSchema.statics.getUserObj2 = function(req) {
    return {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        emailId: req.body.emailId,
        phoneNumber: req.body.phoneNumber,
        gender: req.body.gender,
        parlors: [],
    };
};


userSchema.statics.getMembershipDiscount = function(totalCredits, memberships, services, offerDiscount, useMembership, loyalityPoints, useLoyalityPoints, parlorTax) {
    console.log(memberships);
    var creditsLeft = totalCredits;
    var membershipWithTax = false;
    if(memberships.length > 0){
        if(memberships[0].membershipSaleId){
            memberships[0].creditsLeft /= (parlorTax/100 + 1);
        }
        else if(memberships[0].membershipWithTax){
            membershipWithTax  = true;
            memberships[0].creditsLeft /= (parlorTax/100 + 1);
        }
        creditsLeft =  memberships[0].creditsLeft;
    }
    var payableAmount = 0,
        membershipDiscount = 0,
        creditsUsed = 0,
        membershipSaleId = null,
        tax = 0,
        membershipId = null,
        membershipType = 0,
        loyalityPointsUsed = 0,
        normalDiscount = 0,
        discountMedium = '',
        membershipParlorId = null;
    _.forEach(services, function(service) {
        service.creditsUsed = 0;
        service.subtotal += service.additions || 0
        var checkingDiscount = _.filter(offerDiscount.discountServices, function(o) { return o.serviceId + "" == service.serviceId })[0];
        if (checkingDiscount) {
            service.subtotal -= checkingDiscount.amount;
            service.discount = checkingDiscount.amount;
            service.discountMedium = checkingDiscount.discountMedium;
            discountMedium = checkingDiscount.discountMedium;
        } else if (service.discount) {
            normalDiscount += service.discount;
            service.subtotal -= service.discount;
        }
        service.sub = service.subtotal != 0 ? service.subtotal - service.loyalityPoints : service.subtotal;
        if (memberships.length > 0 && useMembership == 1 && service.sub > 0) {
            _.forEach(memberships, function(m) {
                membershipType = m.membershipId + "" == "5c209894a94e5e7ebc00933a" ? 2 : 1;
                membershipId = m.membershipId;
                membershipSaleId = m.membershipWithTax ? "594a359d9856d3158171ea4f" : m.membershipSaleId;
                membershipParlorId = m.parlorId;
                console.log("membershipParlorId", membershipParlorId);
                var discount = getDiscountForToday(service.categoryId, m.dealDiscount, m.menuDiscount, service.type);
                var subtotal = service.subtotal != 0 ? service.subtotal - service.loyalityPoints : service.subtotal;
                if (membershipType==1) {
                    var credits = m.creditsLeft;
                    var discountAvailable = membershipId+ "" == "5c20add9a94e5e7ebc066d36" ? (subtotal * discount) / 100 : ((credits * 100) / (100-discount)) - credits;
                    if (m.creditsLeft != 0 && subtotal != 0) {
                        if ((discountAvailable + credits) >= (subtotal)) {
                            console.log("herer1--------");
                            creditsLeft -= subtotal - (subtotal * discount) / 100;
                            service.sub = 0;
                            membershipDiscount += (subtotal * discount) / 100;
                            creditsUsed += (subtotal - (subtotal * discount) / 100);
                            service.creditsUsed += (subtotal - (subtotal * discount) / 100);
                            service.membershipDiscount = ((subtotal * discount) / 100);
                            m.creditsLeft = credits - (subtotal - (subtotal * discount) / 100);
                            console.log(creditsUsed);
                        } else {
                            console.log("herer");
                            service.sub = subtotal - (credits + discountAvailable);
                            creditsUsed += m.creditsLeft;
                            service.creditsUsed += m.creditsLeft;
                            creditsLeft -= m.creditsLeft;
                            service.membershipDiscount = (discountAvailable);
                            m.creditsLeft = 0;
                            membershipDiscount += discountAvailable;
                        }
                    }
                } else {
                    var credits = m.creditsLeft;
                    var discountAvailable =  membershipId+ "" == "5c209894a94e5e7ebc00933a" ? (subtotal * discount) / 100 : credits;
                    if (m.creditsLeft != 0 && subtotal != 0) {
                        if ((discountAvailable) >= (subtotal * discount) / 100) {
                            creditsLeft -= (subtotal * discount) / 100;
                            service.sub = subtotal - ((subtotal * discount) / 100);
                            service.creditsUsed += (subtotal * discount) / 100;
                            // membershipDiscount += (subtotal * discount) / 100;
                            membershipDiscount += 0;
                            creditsUsed += (subtotal * discount) / 100;
                            m.creditsLeft = credits - ((subtotal * discount) / 100);
                            console.log(m.creditsLeft);
                        } else {
                            service.sub = subtotal - (discountAvailable);
                            creditsUsed += m.creditsLeft;
                            service.creditsUsed += discountAvailable;
                            m.creditsLeft = 0;
                            // membershipDiscount += discountAvailable;
                            membershipDiscount += 0;
                        }
                    }

                }

            });
        } else {

        }
    });
    tax = creditsUsed * (membershipSaleId ? parlorTax/100  : 0);
    // payableAmount += tax;
    _.forEach(services, function(s) {
        subtotal = s.sub;
        if (s.creditsUsed > 0) {
            s.creditsSource = [{
                parlorId: membershipParlorId,
                credits: s.creditsUsed,
            }];
        }
        if (useLoyalityPoints) {
            loyalityPointsUsed = loyalityPoints;
        }
        payableAmount += subtotal + (subtotal * parlorTax) / 100;
        tax += (subtotal * parlorTax) / 100;
    });
    var taxMultiplier = membershipSaleId ? (parlorTax/100 + 1) : 1;
    taxMultiplier = membershipWithTax ? 1 : taxMultiplier;
    return { payableAmount: payableAmount < 0 ? 0 : payableAmount, creditsLeft: (creditsLeft * taxMultiplier), discount: membershipDiscount*taxMultiplier, creditsUsed: (creditsUsed * taxMultiplier), tax: parseFloat(tax).toFixed(2), membershipType: membershipType, loyalityPoints: loyalityPointsUsed, membershipId: membershipId, normalDiscount: normalDiscount, membershipSaleId : membershipSaleId };
};

function getDiscountForToday(categoryId, dealDiscount, menuDiscount, serviceType) {
    var discount = 0;
    if (serviceType == 'service')
        discount = menuDiscount;
    else
        discount = dealDiscount;
    return discount;
}


function getDiscountByDays(memberships) {
    return _.map(memberships, function(m) {
        return {
            membershipType: m.type,
            membershipId: m.membershipId,
            creditsLeft: m.creditsLeft,
            parlorId: m.parlorId,
            discountPercentage: _.map(m.membershipDiscount.discountPercentage, function(d) {
                return {
                    categoryIds: d.categoryIds,
                    discount: _.filter(d.days, function(day) { return day.dayIndex == new Date().getDay() })[0].discount,
                    dealDiscount: _.filter(d.days, function(day) { return day.dayIndex == new Date().getDay() })[0].dealDiscount
                }
            })
        };
    });
}



userSchema.statics.findAppointmentsByParlor = function(parlorIds, userId, callback) {
    Appointment.aggregate([
        {
            $match : { parlorId : {$in : parlorIds}, "client.id" : ObjectId(userId), status : 3 },
        },
        {
            $project : {
                payableAmount: 1,
                appointmentStartTime : 1,
                appointmentId : "$_id",
                parlorId : 1,
            }
        },
        {
            $sort : {
                appointmentStartTime : -1
            }
        },
        {
            $group : {
                _id : {
                    parlorId : "$parlorId",
                },
                appointments : { $push : {parlorId : "$parlorId", amount : "$payableAmount", appointmentId : "$appointmentId", date : "$appointmentStartTime" } },
            }
        },
        {
            $project : {
                appointments : { $slice : ["$appointments", 3] }
            }
        },
        {
            $unwind : "$appointments"
        },
        {
            $project : {
                amount : "$appointments.amount",
                appointmentId : "$appointments.appointmentId",
                date : "$appointments.date",
                parlorId : "$appointments.parlorId",
            }
        }
    ]).exec(function(err, data){
        data = _.map(data, function(d){
            return {
                amount : d.amount,
                appointmentId : d.appointmentId,
                date : d.date,
                parlorId : d.parlorId
            }
        });
        return callback(data);
    })
},

userSchema.statics.parseEditUser = function(req) {
    return {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        emailId: req.body.emailId,
        phoneNumber: req.body.phoneNumber,
        gender: req.body.gender,
        streetLine1: req.body.streetLine1,
        streetLine2: req.body.streetLine2,
        city: req.body.city
    };
};

userSchema.statics.parseUserObj = function(user) {
    return {
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailId: user.emailId,
        phoneNumber: user.phoneNumber,
        gender: user.gender,
        userType: user.userType,
        credits: user.credits,
        subscriptionId : user.subscriptionId,
        streetLine1: user.streetLine1,
        streetLine2: user.streetLine2,
        city: user.city
    };
};


userSchema.statics.getUserObjApp = function(user) {
    return {
        userId: user.id,
        name: user.firstName + ' ' + (user.lastName != undefined ? user.lastName : ''),
        emailId: user.emailId,
        gender: user.gender,
        phoneNumber: user.phoneNumber,
        userType: user.userType,
        accessToken: user.phoneVerification == 1 ? user.accesstoken : '',
        phoneVerification: user.phoneVerification ? user.phoneVerification : 0,
        profilePic: user.profilePic ? user.profilePic : 'https://www.buira.net/assets/images/shared/default-profile.png',
        isCorporateUser: user.isCorporateUser,
    };
};

userSchema.statics.getUserObjPofoApp = function(user) {
    return {
        userId: user.id,
        accessToken:  user.accesstoken,
    };
};

userSchema.statics.getOldLoyalityPoints = function(userId, callback) {
    return callback(0);
};

userSchema.statics.parse = function(user, parlorId) {
    user.parlors = _.filter(user.parlors, function(p) { return p.parlorId + "" == parlorId });
    return {
        name: user.firstName + " " + (user.lastName || ""),
        customerId: user.customerId ? user.customerId : 1,
        userId: user.id,
        freeHairCutBar: user.freeHairCutBar,
        emailId: user.emailId,
        allow100PercentDiscount: user.allow100PercentDiscount,
        gender: user.gender,
        freeMembershipServiceAvailed : user.freeMembershipServiceAvailed,
        credits: user.credits,
        loyalityPoints: user.loyalityPoints ? user.loyalityPoints : 0,
        advanceCredits: user.parlors[0] ? user.parlors[0].advanceCredits ? user.parlors[0].advanceCredits : 0 : 0,
        address: user.streetLine1 + " " + user.streetLine2,
        phoneNumber: user.phoneNumber,
        subscriptionId : user.subscriptionId,
        subscriptionLoyality : user.subscriptionLoyality,
        subscriptionRedeemMonth : user.subscriptionRedeemMonth,
        freeServices: user.freeServices ? _.filter(user.freeServices, function(f) { return f.parlorId + "" == parlorId || f.parlorId == null }) : [],
        createdAt: !user.appRegistrationDate ? user.createdAt : user.appRegistrationDate,
        noOfAppointments: user.parlors[0] ? user.parlors[0].noOfAppointments : 0,
        lastAppointmentDate: user.parlors[0] ? user.parlors[0].lastAppointmentDate ? user.parlors[0].lastAppointmentDate : null : 0,
        membership: user.activeMemberships || [],
    };
};

userSchema.statics.parseShort = function(user, parlorId ) {
    // user.parlors = _.filter(user.parlors, function(p){ return p.parlorId + "" == parlorId});

            return {
                name: user.firstName + " " + (user.lastName || ""),
                // customerId : user.customerId ? user.customerId : 1,
                userId: user.id,
                // advanceCredits : user.parlors[0].advanceCredits ? user.parlors[0].advanceCredits : 0,
                phoneNumber: user.phoneNumber,
                loyalityPoints : user.loyalityPoints,
            };

};

userSchema.statics.subscriptionExpiry = function(number , today){
    console.log("subscriptionExpiry")
    var d = [];
    // console.log(query)
    User.find({subscriptionId: { $in: [1, 2] } }, {subscriptionRedeemHistory:1, firebaseId: 1, firebaseIdIOS: 1, phoneNumber: 1}, function(err, subscribers) {
        console.log("subscribers" ,subscribers.length)
        var fbId = [],
            fbIos = [];
            var daysCount = (number > 1) ? ""+number+" days" : "1 day"
        var data1 = { type: "subscription", title: "Your Be U Subscription Balance", body: "Your Be U subscription balance for this month expires in "+daysCount+", so hurry up and book now.", sImage: "", lImage: "" };

        var data2 = { type: "subscription", title: "Your Be U Subscription Balance", body: "Your Be U subscription balance for this month expires in "+daysCount+", so hurry up and book now.", sImage: "", lImage: "" };
        var users =[];
        async.each(subscribers , function(subs , c){
            Appointment.find({'client.id': subs.id, loyalitySubscription :{$gt :0} , status:3 , appointmentStartTime:{$gte : HelperService.getCurrentMonthStart(today)}},{appointmentStartTime:1} , function (err, appts){
                if(appts.length>0){
                    console.log("if")
                    c();
                }else{
                    console.log('else')
                    users.push(subs)
                    c();
                }
            })
        }, function allTaskCompleted(){
            console.log("userssssssssssssss",users.length)
            _.forEach(users, function(user) {
                if (user.firebaseId) fbId.push(user.firebaseId);
                if (user.firebaseIdIOS) fbIos.push(user.firebaseIdIOS);
            })

           sendNotificationsInBulk(fbId , fbIos , data1 ,data2);
        })
        
    })
};


userSchema.statics.freebieExpiry = function(nextWeekDate){

     var d = [];
     var expiryDate = nextWeekDate.toDateString();
     var query = {freebieExpiry :  {$gte : HelperService.getDayStart(nextWeekDate) ,$lte: HelperService.getDayEnd(nextWeekDate) } };
     console.log("query2222" , query)
        // for (var i = 0; i < 144; i++) {
        // User.find({freebieExpiry :  {$gte : HelperService.getDayStart(nextWeekDate) ,$lte: HelperService.getDateEnd(nextWeekDate) }},
    User.find(query, { firebaseId: 1, firebaseIdIOS: 1, phoneNumber: 1, firstName: 1, loyalityPoints: 1 }).exec(function(err, users) {
            console.log(users.length)

            async.parallel([
                function(done) {
                    async.each(users, function(u, call) {
                        var data = { type: "coupon", title: "B-Cash Expiry", body: "Your " + u.loyalityPoints + " B-Cash would expire on "+expiryDate+", so hurry up and book now.", sImage: "", lImage: "" };
                        if (u.firebaseId) {

                            Appointment.sendAppNotificationNew(u.firebaseId, data, function(err, data) {
                                d.push("1");
                                call();
                            })
                            console.log("android")
                        }
                        if (u.firebaseIdIOS) {
                            Appointment.sendAppNotificationIOS(u.firebaseIdIOS, data.title, data.body, "", data.type, "", function(err, data) {
                                d.push("2");
                                call();
                            })
                            console.log("ios")
                        }
                    }, done);
                }
            ], function allTaskCompleted() {
                console.log('done');
            });
        })
};



userSchema.statics.couponCodeExpiry = function(nextWeekDate){
     console.log("couponCodeExpiry")
     var query = { 'couponCodeHistory.expires_at': {$gte : HelperService.getDayStart(nextWeekDate) ,$lte: HelperService.getDayEnd(nextWeekDate) } }
     console.log("query333" , query)
     var d = [];
    for (var i = 0; i < 144; i++) {
        User.find(query,
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
            sendNotificationsInBulk(fbId , fbIos , data1 ,data2);
            
        })
    }
};

function sendNotificationsInBulk(fbId , fbIos , data1 ,data2){
  var d= [];
    async.parallel([
          function(done) {
              async.each([1, 2], function(p, cb) {
                  if (p == 1) {
                      Appointment.sendAppNotificationAdmin(fbId, data1, function(err, data) {
                          d.push(1);
                          cb();
                      })
                      console.log("android")
                  }
                  if (p == 2) {
                      Appointment.sendAppNotificationIOSAdmin(fbIos, data2, function(err, data) {
                          d.push(2);
                          cb();
                      })
                      console.log("ios")
                  }
              }, done);
          }
      ], function allTaskCompleted() {
          console.log('done');
        
      });
}


userSchema.statics.sendSmsToUsers = function(numbers, smsText){

    var builder = require('xmlbuilder');
    var xml = builder.create('MESSAGE')
      .ele('AUTHKEY', '164034A93iTmJcMu595dd01d').up()
      .ele('SENDER', 'BEUSLN').up()
      .ele('ROUTE', 4).up()
      .ele('CAMPAIGN', "subscription").up()
      .ele('COUNTRY', 91).up()
      .ele("SMS", {'TEXT': smsText});

      for(var i = 0; i < numbers.length; i++){

        var item = xml.ele('ADDRESS');
        item.att('TO', numbers[i]);
      }

      xml = xml.end({pretty: true});
      console.log(xml)

      var http = require("https");

      var options = {
        "method": "POST",
        "hostname": "control.msg91.com",
        "port": null,
        "path": "/api/postsms.php",
        "headers": {
          "content-type": "application/xml"
        }
      };

     var req = http.request(options, function (res) {
     var chunks = [];

        res.on("data", function (chunk) {
          chunks.push(chunk);
        });

        res.on("end", function () {
          var body = Buffer.concat(chunks);
          console.log(body.toString());
        });
      });

        req.write(xml);
        req.end();
};
    
userSchema.statics.createEmployeeCoupon = function(date){
    User.find({corporateEmailId :{$regex : "@beusalons.com"}},{phoneNumber:1 , corporateEmailId:1, firstName:1}).exec(function(err , beuEmployees){

        let now_date = date;
        now_date.setMonth(now_date.getMonth() + 1);
        let d= [];
        async.each(beuEmployees , function(emp , call){
            let random = HelperService.getRandomString(5);
            let coupon = "EMP"+random;
            User.update({phoneNumber : emp.phoneNumber} , {$push : {couponCodeHistory : { createdAt: new Date(), active: true, couponType: 11, expires_at: now_date, code: coupon }}}, function(err , update){
                if(err) call();
                else{
                    function sendEmail() {
                        var transporter = nodemailer.createTransport('smtps://info@beusalons.com:wx2t2Tr7pMrqnK2CIqwd3g@smtp.mandrillapp.com');
                        var mailOptions = {
                            from: 'info@beusalons.com', // sender address
                            to: [emp.corporateEmailId], // list of receivers
                            html: '<div>Hi '+emp.firstName+', new coupon for this month has been generated. Use the code '+coupon+' to avail 25% Discount in your nearest Be U outlet. The Coupon expires on '+now_date.toDateString()+'.</div>',
                            subject: 'Be U Coupon Code' // Subject line
                        };
                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error){
                                console.log(error);
                            }
                            else{
                                console.log(info);
                            }
                        });
                    }
                    sendEmail();
                  d.push(update);
                  call();  
                } 
            })
        }, function allDone(){
            console.log(d.length);
        })
    })
};

userSchema.statics.createNew = function(data, callback) {
        User.create(data, function(err, doc) {
            callback(err, doc);
        });
    }
    //  on every save, add the date
userSchema.pre('save', function(next) {
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

userSchema.pre('update', function(next) {
  this.update({},{ $set: { updatedAt: new Date() } });
  next();
});

// userSchema.plugin(autoIncrement.plugin, 'user');

var User = mongoose.model('user', userSchema);

// make this available to our users in our Node applications
module.exports = User;