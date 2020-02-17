var schedule = require('node-schedule');
var localVar = require('../model/localVar');
var async = require("async");
var express = require('express');
var router = express.Router();

//new marketing users model
MarketingUserNew = require('../model/MarketingUsersNew');
Appointment = require('../model/Appointment');
User = require('../model/User');


//schedule.scheduleJob('00 21 * * * *',()=>{
    //console.log('hiiiiiii')
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
        let tdo = new Date(2019, 04, 28);
        console.log('tdo '+tdo)
        console.log(new Date(tdo.getFullYear(), tdo.getMonth(), tdo.getDate()+1))
        let arr  =[]


        
        console.log(arr)
            

        // for(skipLim=1;skipLim<=3;skipLim++){
        //     console.log('skipLim= '+skipLim)
        //     Appointment.aggregate([
        //         //{ $match: { "appointmentStartTime": { $gt: new Date(tdo.getFullYear(), tdo.getMonth(), //tdo.getDate()), $lt: new Date(tdo.getFullYear(), tdo.getMonth(), (tdo.getDate()+1)) }, //status: 3 } },
        //         // { $sort: { appointmentStartTime: 1 } },
        //         { $unwind: "$services" },
        //         {
        //             $group: {
        //                 "_id": "$client.id",
        //                 appointmentCount: { $sum: 1 },
        //                 lastAppointmentDate: { $last: "$appointmentStartTime" },
        //                 lastParlor: { $last: "$parlorName" },
        //                 lastParlorId: { $last: "$parlorId" },
        //                 payableAmount: { $first: '$payableAmount' },
        //                 bill: { $first: '$subtotal' },
        //                 serviceRevenue: { $first: '$serviceRevenue' },
        //                 productRevenue: { $first: '$productRevenue' },
        //                 services: { $push: {price:'$services.price', serviceCode:'$services.serviceCode',serviceId:'$services.servicesId', serviceName:'$services.serviceName', name:'$services.name', isFlashSale:'$services.isFlashSale', categoryId:'$services.categoryId' }},
        //             }
        //         }
        //     ]).allowDiskUse(true).skip(100 * (skipLim - 1)).limit(100).exec((err, apps) => {
        //         console.log("came data");
        //         //console.log(apps);
    
        //         if (err) {
        //             console.log(err)
        //             console.log('{message:"Server Error."}');
        //         } else {
        //             async.each(apps, (client, cb) => {
        //                 //if(client._id=="5c2e1baf2299226f8e9db299")
        //                     //console.log(client)
        //                 MarketingUserNew.findOne({ userId: client._id }, { "userId": 1, updatedAt: 1, "_id": 0, marketingCategories: 1, premiumCustomer: 1, maximumBill: 1, totalRevenue: 1, appointmentCount: 1, latitude: 1, longitude: 1, cityId: 1 }, (err, user) => {
        //                     //console.log("user" , user)
        //                     if (err) {
        //                         counter++;
        //                         console.log(counter);
        //                         cb();
        //                     } else if (user) {
        //                         console.log("else if working")
        //                         var marketingCategories = user.marketingCategories == undefined ? [] : user.marketingCategories;
        //                         var servicesTaken = user.services;
        //                         //console.log(servicesTaken)
        //                         console.log('1111111')
    
        //                             if (client.payableAmount > 3000 || user.appointmentCount > 3) premiumCustomer = true;
    
        //                             if (client.bill > user.maximumBill) user.maximumBill = client.bill;
    
        //                             if (user.totalRevenue) user.totalRevenue = client.totalRevenue + user.totalRevenue;
    
        //                             if (user.latitude != 0 && user.longitude != 0) user.cityId = ConstantService.getCityId(user.latitude, user.longitude);
    
        //                             let c;
        //                             client.services.forEach(s1=>{
        //                                 c=0;
        //                                 user.services.foreach(s2=>{
        //                                     if(s1.serviceId==s2.serviceId)
        //                                         c=1;
        //                                 })
        //                                 if(c==0){
        //                                     servicesTaken.push(s1);
        //                                 }
        //                             })
    
        //                             var setValues = {
        //                                 marketingCategories: marketingCategories,
        //                                 servicesTaken: servicesTaken,
        //                                 appointmentCount: client.appointmentCount + user.appointmentCount,
        //                                 lastAppointmentDate: client.lastAppointmentDate,
        //                                 lastParlor: client.lastParlor,
        //                                 lastParlorId: client.lastParlorId,
        //                                 premiumCustomer: premiumCustomer,
        //                                 maximumBill: user.maximumBill,
        //                                 totalRevenue: user.totalRevenue,
        //                                 cityId: user.cityId,
        //                                 latitude: user.latitude,
        //                                 longitude: user.longitude,
        //                                 subscriptionId: (user.subscriptionId == undefined) ? 0 : user.subscriptionId,
        //                                 androidVersion: user.androidVersion,
        //                                 iosVersion: user.iosVersion
        //                             };
    
        //                             //console.log("setValues" , setValues)
        //                             //console.log("userId" , client.clientId)
                                    
    
        //                             MarketingUserNew.update({ "userId": client.clientId },  setValues , (err, updated) => {
        //                                 if (err) {
        //                                     // console.log(err)
        //                                     console.log("update failed", err);
        //                                     counter++;
        //                                     console.log(counter);
        //                                     cb();
        //                                 } else {
        //                                     console.log("updated" , updated);
        //                                     counter++;
        //                                     //console.log(counter);
        //                                     cb();
        //                                 }
        //                             })
    
        //                     } else {
        //                         //console.log("else")
        //                         var marketingCategories = [];
        //                         var servicesTaken = client.services;
        //                         //console.log(servicesTaken)
                                
        //                         if (client.payableAmount > 3000) premiumCustomer = true;
    
        //                         User.findOne({ "_id": client._id }, { firstName: 1, lastName: 1, emailId: 1, iosVersion: 1, androidVersion: 1, subscriptionId: 1, phoneNumber: 1, gender: 1, loyalityPoints: 1, latitude: 1, longitude: 1, firebaseId: 1, firebaseIdIOS: 1 }, function(err, user) {
        //                             if(err){
        //                                 console.log(err)
        //                                 console.log(client._id)
        //                             }else{
        //                                 if(!user)
        //                                     console.log('sefs  '+client._id)
        //                                 var userDetails = {
        //                                     "userId": client._id,
        //                                     "firstName": user.firstName == undefined ? "" : user.firstName,
        //                                     "lastName": user.lastName == undefined ? "" : user.lastName,
        //                                     "emailId": user.emailId == undefined ? "" : user.emailId,
        //                                     "phoneNumber": user.phoneNumber == undefined ? "" : user.phoneNumber,
        //                                     "lastAppointmentDate": client.lastAppointmentDate,
        //                                     "lastParlor": client.lastParlor,
        //                                     "lastParlorId": client.lastParlorId,
        //                                     "appointmentCount": client.appointmentCount,
        //                                     "gender": ((user.gender).trim() === "" || user.gender == undefined) ? "M" : user.gender,
        //                                     "loyalityPoints": user.loyalityPoints == undefined ? "" : user.loyalityPoints,
        //                                     "latitude": user.latitude,
        //                                     "longitude": user.longitude,
        //                                     "firebaseId": user.firebaseId,
        //                                     "firebaseIdIOS": user.firebaseIdIOS,
        //                                     "iosVersion": user.iosVersion,
        //                                     "subscriptionId": user.subscriptionId == undefined ? 0 : user.subscriptionId,
        //                                     "androidVersion": user.androidVersion,
        //                                     "marketingCategories": marketingCategories,
        //                                     "servicesTaken": servicesTaken,
        //                                     'premiumCustomer': premiumCustomer,
        //                                     'maximumBill': client.bill,
        //                                     'totalRevenue': client.totalRevenue,
        //                                     'cityId': (user.latitude != 0 && user.longitude != 0) ? ConstantService.getCityId(user.latitude, user.longitude) : 1
        //                                 }
        //                                 MarketingUserNew.create(userDetails, (err, created) => {
        //                                     if (err) {
        //                                         console.log("creation failed");
        //                                         counter++;
        //                                         console.log(counter);
        //                                         cb();
        //                                     } else {
        //                                         //console.log("created");
        //                                         counter++;
        //                                         //console.log(counter);
        //                                         cb();
        //                                     }
        //                                 })
        //                             }
        //                         })
        //                     }
        //                 })
                    
        //             }, () => {
        //                 console.log("All done.");
        //             })
        //         }
        //     })
        // }
         
//})




module.exports = router;