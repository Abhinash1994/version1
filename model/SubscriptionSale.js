var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var async = require('async');


var subscriptionsaleSchema = new Schema({

    userId : {type : Schema.ObjectId},

	parlorId : {type : Schema.ObjectId},

	subscriptionId : {type : 'number' },

	razorPayId : {type : 'string' , unique: true},  // nearby..., cash...., razorpayId

    price : { type: 'string', required: true },   

    couponCode : { type: 'string'},   

    actualPricePaid : { type: 'number', default : 0 },    

    createdAt : { type: 'date', defaultsTo: Date.now() },

    referralRefunds :[],

    response : {},

    source : {type: 'string' , default : 'default'}, // salon

    firstParlorId : {type : Schema.ObjectId} ,

    firstApptDate : {type : 'date'},

    paymentMethod : {type : 'number'}, //1- Cash , 2-Card, 3-Online

});



subscriptionsaleSchema.statics.createUserForSubscription = function(user){
     return {
        firstName: user.firstName ? user.firstName : 'subscribedUser',
        emailId: user.emailId ? user.emailId : "",
        phoneNumber: user.phoneNumber,
        gender: user.gender ? user.gender : "F",
    };
};


subscriptionsaleSchema.statics.createSubscriptionAppointment = function(parlorId, subscriptionId, amount, response, paymentType, client, paymentMethod, call){
    Appointment.findOne({ parlorId: parlorId, status: 3 }, {}, { sort: { 'invoiceId': -1 } }, function(err, s) {
        var newInvoiceId = s ? s.invoiceId + 1 : 1;
        Parlor.findOne({_id: parlorId} , {name:1, address:1 , address2:1 , tax :1, parlorType :1, phoneNumber :1, geoLocation :1} , function(err , parlor){
            var createObj = {
                parlorId : parlorId,
                parlorAppointmentId: "4321",
                invoiceId: newInvoiceId,
                parlorName: parlor.name,
                parlorTax: parlor.tax,    
                parlorAddress: parlor.address,
                parlorAddress2: parlor.address2,
                contactNumber: parlor.phoneNumber,
                mode: (paymentType == 1 || paymentType == 2) ? 3 : 1,
                client: {
                    id: client.id,
                    customerId: client.customerId,
                    name: client.firstName,
                    phoneNumber: client.phoneNumber,
                    emailId: client.emailId,
                    gender: client.gender,
                    subscriptionLoyality: client.subscriptionLoyality,
                    noOfAppointments: 0
                },
                parlorType: parlor.parlorType,
                loyalitySubscription: 0,
                appointmentStartTime:new Date(),
                appointmentOriginalStartTime:new Date(),
                appointmentEndTime: new Date(),
                latitude:parlor.geoLocation[1],
                longitude : parlor.geoLocation[0],
                status: 3,
                paymentMethod: paymentMethod,
                appointmentType: 3,
                services:[],
                serviceRevenue: 0,
                allPaymentMethods: [{
                        value: paymentMethod == 5 ? 10 : paymentMethod,
                        name: (paymentMethod == 1 ? 'Cash' : (paymentMethod == 2 ? "Card" : "beu")),
                        amount: amount 
                    }],
                otherCharges: 0,
                subtotal: 0,
                tax: 0,
                buySubscriptionId: subscriptionId,
                subscriptionAmount: amount,
                payableAmount: 0,
                otp: "1234",
                razorPayCaptureResponse: paymentType == 1 ? response : null,
                razorPayObj:  paymentType == 1 ? response : null,
                paytmResponse:  paymentType == 2 ? response : null
            }
            Appointment.create(createObj , function(err , appointmentCreated){
                if(!err){
                    call(false , "done")
                }else{
                    console.log(err)
                    call(true , "error")
                }
            })
        })
    })
}


subscriptionsaleSchema.statics.paymentLinkSubscription = function (req, callback) {
    var request = require('request');
    var RAZORPAY_KEY = localVar.getRazorKey();
    var RAZORPAY_APP_SECRET = localVar.getRazorAppSecret();
    var Razorpay = require('razorpay');
    var instance = new Razorpay({
        key_id: RAZORPAY_KEY,
        key_secret: RAZORPAY_APP_SECRET
    });
    var isEligible = true
    var paymentId = req.body.paymentId;
    instance.payments.fetch(paymentId).then((response) => {
        var number = response.contact
        var phoneNumber = number.substr(3);
        if(response.amount == 169900 || response.amount == 149900 || response.amount == 69900 || response.amount == 119900|| response.amount == 24900|| response.amount == 59900){
            var subscriptionId = (response.amount == 89900) ? 2 : 1;
                User.findOne({phoneNumber : phoneNumber}  , function(err, user){
                    var couponCode = "";
                    if(req.body.code)couponCode = req.body.code
                    else{
                        if(response.amount == 149900)couponCode = "BEUREF"
                        if(response.amount == 69900)couponCode = "JBFKPS"
                        if(response.amount == 119900)couponCode = "GHNLVL"
                        if(response.amount == 24900)couponCode = "1MONTH"
                        if(response.amount == 59900)couponCode = "3MONTH"
                    }
                    if(user){
                        SubscriptionSale.createSubscriptionAppointment("594a359d9856d3158171ea4f", subscriptionId, response.amount/100, response, 1, user,  5, function(err , d){

                            Appointment.addSubscriptionToUser(null, user.id, new Date(), response, response.amount/100, couponCode , 'default', function(re) {
                                return callback(CreateObjService.response(false, 'Successfully Activated'));
                            });
                        })
                    }else{
                        User.find().count(function(err, count) {
                            let user = SubscriptionSale.createUserForSubscription({phoneNumber : phoneNumber , emailId: response.email});
                            user.customerId = ++count;
                            User.create(user, function(err, newUser) {
                                if (err) return callback(CreateObjService.response(true, 'There is some error'));
                                else {
                                     SubscriptionSale.createSubscriptionAppointment("594a359d9856d3158171ea4f", subscriptionId, response.amount/100, response, 1, newUser,  5, function(err , d){
                                        Appointment.addSubscriptionToUser(null, newUser.id, new Date(), response, response.amount/100, couponCode , 'default', function(re) {
                                            return callback(CreateObjService.response(false, 'Successfully Activated'));
                                        });
                                    })
                                }
                            });
                        });
                    }
                })
         }else{
            next();
        }
    }).catch((error) => {
        return callback(CreateObjService.response(true, 'Inavlid RazorPay Id'));
    });
}


subscriptionsaleSchema.statics.subscriptionSoldBySalon = function (parlorId , callback) {
    SubscriptionSale.aggregate([
            {$match :{
                razorPayId :{$regex : parlorId} , 
                source:'salon'
                }
            },
            {$lookup : {
                from: "users" , 
                localField : "userId" , 
                foreignField : "_id" , 
                as : "user"
                }
            },
            {$project : {
                actualPricePaid:1,
                purchaseDate:{$dateToString :{ format: "%Y-%m-%d", date: "$createdAt" }}, 
                subscriptionType:{$cond: [{$eq :['$subscriptionId' , 1]} , 'Gold' , 'Silver']} , 
                userId :1, 
                razorPayId:1 , 
                userName :{$arrayElemAt :['$user.firstName' ,0]},
                phoneNumber :{$arrayElemAt :['$user.phoneNumber' ,0]}
                }
            }
        ] , function(err , subscriptions){
            if(!err && subscriptions.length>0)
                return callback(false ,subscriptions)
            else
                return callback(true, 'No Subscriptions Sold Yet!')
        })
};


subscriptionsaleSchema.statics.getSubscriptionSoldBySalon = function(startDate,endDate, parlorId , callback){

    var match = { createdAt: { $gte: HelperService.getDayStart(startDate), $lt: HelperService.getDayEnd(endDate) } ,razorPayId : { $regex: parlorId }}
   
    SubscriptionSale.aggregate([
        { $match: match},
        { $lookup: { 
            from: "users", 
            localField: "userId", 
            foreignField: "_id", 
            as: "user" } 
        },
        { $project: {
                clientName: {$arrayElemAt :["$user.firstName",0]},
                clientPhoneNumber: {$arrayElemAt :["$user.phoneNumber",0]},
                gender: {$cond: [{$eq : [{$arrayElemAt :["$user.gender",0]} , "F"]}, "Female" , "Male"]},
                subscriptionDate: {$dateToString : {format: "%Y-%m-%d" , date :{$arrayElemAt :["$user.subscriptionBuyDate",0]}}},
                price: "$actualPricePaid",
                razorPayId: "$razorPayId",
                createdAt: {$dateToString : {format: "%Y-%m-%d" , date : "$createdAt"}},
                // purchaseSalon: { $concat: ['$appts.parlorName', '-', '$appts.parlorAddress2'] },
                apptsDetail : [],
                appointmentDate : 'Sold By Salon',
                payableAmount: "$actualPricePaid",
                paymentMethod: {$cond: [{$eq : ['$paymentMethod' , 1]}, "Cash Payment" , "Card Payment"]},
                subscriptionType: {$cond: [{$eq : ["$subscriptionId", 1]} , "Gold" , "Silver"]}
                
            }
        }
    ], function(err , salonSoldSubs){
        // console.log("salonSoldSubs" , salonSoldSubs.length)
        _.forEach(salonSoldSubs, function(s){
            s.difference = 0
        })
        return callback(false, salonSoldSubs);
    })
};


subscriptionsaleSchema.statics.getSubscriptionSoldBySalonWithAppt = function(startDate,endDate, parlorId ,userTypeBeu, callback){
     var match = { "appts.paymentMethod": {$nin :[5,10]},"appts.status": 3, "appts.subscriptionAmount": { $gt: 0 }, $or: [{ 'appts.subscriptionReferralCode': { $eq: null } }, { 'appts.subscriptionReferralCode': { $eq: "" }},{ 'appts.subscriptionReferralCode': { $eq: "EARLYBIRD" }},{ 'appts.subscriptionReferralCode': { $eq: "BEUREF" }} ] };

    SubscriptionSale.aggregate([{ $match: { createdAt: { $gte: HelperService.getDayStart(startDate), $lt: HelperService.getDayEnd(endDate) }, razorPayId: { $not: /^near.*/ }, couponCode: {$ne : 'SALON'} } },
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
        // console.log(app)

                if (app) {
                    // _.forEach(appoint, function(app) {
                    if (app.loyalitySubscription > 0 && HelperService.compareTodayDate(app.appointmentStartTime, subs.createdAt) && parseInt(subs.price) >= 1000) {
                        // if ( HelperService.compareTodayDate(app.appointmentStartTime , subs.createdAt) && parseInt(subs.price) >= 1000) {
                        var subsData = {};
                        subsData.subscriptionType = (parseInt(subs.price) >= 1000) ? "Gold" : "Silver";
                        // subsData.paymentMethod = (res == "cash") ? "Cash Payment" : "Online Payment";
                        subsData.paymentMethod = subs.paymentMethod == 1 ? "Cash Payment" : (subs.paymentMethod == 2 ? "Card Payment" : "Online Payment");
                        subsData.gender = (app.client.gender == "M") ? "Male" : "Female";
                        subsData.purchaseSalon = app.parlorName + " - " + app.parlorAddress2;
                        subsData.clientName = app.client.name;
                        subsData.clientPhoneNumber = app.client.phoneNumber;
                        subsData.subscriptionDate = subs.createdAt.toDateString();
                        subsData.price = subs.price;
                        subsData.difference = HelperService.getNoOfHrsDiff(app.appointmentStartTime, subs.createdAt);
                        subsData.payableAmount = app.payableAmount;
                        subsData.appointmentDate = app.appointmentStartTime.toDateString();
                        subsData.apptsDetail = [];

                        d.push(subsData);
                    }
                    // })
                    call();

                } else {
                    call()
                }
            })
        }, function allTaskCompleted() {
                return callback(false, d)
        })
    })
};


// subscriptionsaleSchema.statics.sendPaytmCashback = function(userId , phoneNumber){

// };


var SubscriptionSale = mongoose.model('subscriptionsale', subscriptionsaleSchema);
module.exports = SubscriptionSale;