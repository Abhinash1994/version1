// On Transactions
// 1	-App Transaction	Every 5th App Transaction
// 2-Salon Transaction	Every 50th Transaction (Both App and ERP)
// 3	-Customer Review	Above 3 Star Rating
// 4	-Bill Value Above 4000	Bill Value lies in  top 1% Salon Bill Value and Above 4000
// 5	-Bill Service Above 6	Bill Services lies in  top 1%  and Above6 Services per Bill
// 6	-Membership Sold	First Bill after the membership sold via app
//
//
// On Achieving Targets
//
// 7	-Achieved L1 Target	L1 of each and each category employee is touched
// 8-	Achieved L2 Target	L2 of each and each category employee is touched
// 9	-Achieved L3 Target	L3 of each and each category employee is touched
// 10	-Bill Shared Ratio	Maximum Bill Shared Ratio
// 11	-Best Rated Employee	Best Rated Employee
// 15	-Employee Section


/**
 * Created by ginger on 5/8/2017.
 */



var mongoose = require('mongoose');
var _ = require('lodash');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;
var async = require('async');
var request = require('request');
var PAYTM_MERCHANT_MID = 'GinSwa65124226602132';
var PAYTM_MERCHANT_KEY = 'YxIwf0X&_nsXCR8O';
var PAYTM_INDUSTRY_TYPE = 'Retail109';
var MERCHANT_GUID = 'e50c9619-34af-42c6-bb58-d7ef2274b496';

var luckyDrawSchema = new Schema({
    employeeId: { type: Schema.Types.ObjectId, ref: 'owners' },
    employeeName: { type: 'String' },
    clientName: { type: 'String' },
    parlorId: { type: Schema.Types.ObjectId, ref: 'parlors' },
    appointmentId: { type: Schema.Types.ObjectId, ref: 'appointments' },
    categoryId: { type: 'string' }, //17- Subscription Revenue , 18- nonSubsAppTransaction, 19- Skin Co Services , 13- subscription sold , 20-salon incentive serviceRevenue , 21 - salon incentive on product revenue , 22 - salon incentive on total revenue, 13- subs sale, 23- Online Payment, 24- Subscription from Salon
    amount: { type: 'number' },
    billAmount: { type: 'number' },
    role: { type: 'number' },
    reason: { type: 'string' },
    stringToPrintEmployee: { type: 'string' },
    stringToPrintSalon: { type: 'string' },
    paid: { type: 'boolean', default: false },
    status: { type: 'number' }, //0-claimed, 1- not-claimed, 2- initiated to bank, 3- sucessfully processed, 4- Payment Failed , 5-missing detail
    createdAt: { type: 'date' },
    updatedAt: { type: 'date' },
    transferObj : {},
    manualTransfer : {},
    check : {type : 'boolean'},
    settlementDate : {type: 'date'},
    settlementPeriod : {type: 'number'},
});



luckyDrawSchema.statics.incentiveOnlinePayment = function(appointmentId) {
   console.log("here ")
    Appointment.findOne({ _id: appointmentId }, function(err, appt) {

    // Appointment.aggregate([{ $match: { parlorId: ObjectId(appt.parlorId), status: 3, appointmentStartTime: { $gte: new Date(HelperService.getLastMonthStart()) } } },
    //     { $group: { _id: null, serviceRevenue: { $sum: "$serviceRevenue" }, productRevenue: { $sum: "$productRevenue" } } },
    //     { $project: { revenue: { $add: ["$serviceRevenue", "$productRevenue"] } } }
    // ], function(err, totalParlorRevenue) {

        LuckyDrawDynamic.aggregate([{ $match: { status: 0, createdAt: { $gte: new Date(HelperService.getLastMonthStart()) }, parlorId: ObjectId(appt.parlorId) } },
            { $group: { _id: null, amount: { $sum: "$amount" } } }
        ], function(err, drawTotal) {
            console.log(err)

            var drawAmount = 0;
            if (drawTotal.length > 0) {
                drawAmount += drawTotal[0].amount
            }
            Parlor.findOne({ _id: appt.parlorId }, { createdAt: 1, parlorType: 1 }, function(err, parlorDate) {
/*
                var parlorDatesTemp = new Date(parlorDate.createdAt)
                var parlorDates = new Date() - parlorDatesTemp
                var time = Math.round((parlorDates) / (1000 * 60 * 60 * 24));*/
                // console.log("Draw total  amount In last 30 days ", drawAmount)
                // console.log("Parlor total  revenue In last 30 days ", totalParlorRevenue)
                // if (totalParlorRevenue.length > 0) {
                    // var onePercent = totalParlorRevenue[0].revenue * 0.01
                    // console.log("1% of parloar total revenue in last 30 days", onePercent)
                   /* if (time <= 30) {

                        if (parlorDate.parlorType == 0) {
                            onePercent = 3000
                        } else if (parlorDate.parlorType == 1) {
                            onePercent = 2000
                        } else {
                            onePercent = 1000
                        }
                    }*/
                    if (1) {
                    // if (onePercent > drawAmount) {

                        LuckyDrawModel.findOne({ parlorId: appt.parlorId }, {onlinePayment :1}, function(err, draw) {

                                async.each(appt.employees, function(a, cb) {

                                    var amountToGo = 0;
                                    if(appt.payableAmount >= 2000 && appt.payableAmount < 4000){
                                        amountToGo = draw.onlinePayment[0].amount * a.revenue / appt.subtotal;
                                        
                                    }else if(appt.payableAmount >= 4000){
                                        amountToGo = draw.onlinePayment[1].amount * a.revenue / appt.subtotal;
                                    }
                                    amountToGo = parseInt(amountToGo)
                                    Admin.findOne({ _id: a.employeeId }, { firebaseId: 1 }, function(err, emp) {
                                        LuckyDrawDynamic.create({

                                            employeeId: ObjectId(a.employeeId),
                                            employeeName: a.name,
                                            role: a.role,
                                            clientName: appt.client.name,
                                            billAmount: appt.subtotal,
                                            parlorId: appt.parlorId,
                                            appointmentId: appt._id,
                                            categoryId: "23",
                                            amount: amountToGo,
                                            reason: "Online Payment",
                                            stringToPrintEmployee: draw.onlinePayment[0].employeeMessage.replace("{{amount}}", amountToGo),
                                            stringToPrintSalon: draw.onlinePayment[0].salonMessage.replace("{{amount}}", amountToGo),
                                            status: 1
                                        }, function(err, done) {
                                            if (err) {
                                                console.log(err)
                                            } else {
                                                let message = "Hi, "+emp.firstName+" your lucky draw of Rs "+amountToGo+" has been generated. Please claim it within 24 hours."
                                                
                                                if(emp.firebaseId){
                                                    ParlorService.sendIonicNotification2(emp.firebaseId, 'Lucky Draw Generated', message, "luckyDraw", "luckyDraw", function(){
                                                        cb();
                                                    })
                                                } if (emp.firebaseIdIOS){
                                                    ParlorService.sendIOSNotificationOnEmployeeApp(emp.firebaseIdIOS, 'Lucky Draw Generated', message, "luckyDraw", function(){

                                                        aData.push(createObj)
                                                        cb();
                                                    })
                                                }
                                            }
                                        })
                                    })

                                }, function(done) {
                                    
                                })
                            })
                        }
                    // }
                })
            })
        // })

    });
}

luckyDrawSchema.statics.onSalonSubscription = function(employees , parlorId , clientName) {
    console.log("in lucky draw function",parlorId)
    LuckyDrawModel.findOne({ parlorId: parlorId }, {salonSubscription :1}, function(err, draw) {

        async.each(employees, function(a, cb) {

            var amountToGo = draw.salonSubscription[0].amount / employees.length;
            console.log("amountto go ",amountToGo,draw.salonSubscription[0])
            Admin.findOne({ _id: a.userId }, {firebaseIdIOS:1, firebaseId: 1, name :1, role : 1, firstName : 1 }, function(err, emp) {
                LuckyDrawDynamic.create({
                    employeeId: ObjectId(a.userId),
                    employeeName: emp.firstName,
                    role: emp.role,
                    clientName: clientName,
                    billAmount: 1699,
                    parlorId: parlorId,
                    appointmentId: null,
                    categoryId: "24",
                    amount: amountToGo,
                    reason: "Subscription From Salon",
                    stringToPrintEmployee: draw.salonSubscription[0].employeeMessage.replace("{{amount}}", amountToGo).replace("{{name}}", clientName),
                    stringToPrintSalon: draw.salonSubscription[0].salonMessage.replace("{{amount}}", amountToGo).replace("{{name}}", clientName),
                    status: 1
                }, function(err, done) {
                    if (err) {
                        console.log(err)
                    } else {
                        let message = "Hi, "+emp.firstName+" your lucky draw of Rs "+amountToGo+" has been generated. Please claim it within 24 hours."
                        
                        if(emp.firebaseId){
                            ParlorService.sendIonicNotification2(emp.firebaseId, 'Lucky Draw Generated', message, "luckyDraw", "luckyDraw", function(){
                                cb();
                            })
                        } if (emp.firebaseIdIOS){
                            ParlorService.sendIOSNotificationOnEmployeeApp(emp.firebaseIdIOS, 'Lucky Draw Generated', message, "luckyDraw", function(){
                                // aData.push(createObj)
                                cb();
                            })
                        }
                    }
                })
            })

        }, function(done) {
            
        })
    })
}


luckyDrawSchema.statics.findIncentiveType = function(startDate, endDate , settlementPeriod){
    Appointment.aggregate([
                {$match : {
                   parlorId: {$in : [ObjectId("5b5b1dde715b6407d175c383"),ObjectId("5bf8f48f40fdce4d68d83771"),ObjectId("5c063348b0fb9e4f4dec97e5"),ObjectId("5c08cda133e7d52c0b67c922"),ObjectId("5c0f56505e63ee63d6edd9a3"),ObjectId("5c11108c21b2f86fd95ad281"),ObjectId("5c236251c3f2cf6c82c8bfb7"),ObjectId("5ccafc18787e1142a79a4e48"),]},
                    // parlorId: {$in : [ObjectId("5ccafc18787e1142a79a4e48")]},
                    appointmentStartTime: {$gt: startDate , $lte: endDate} , 
                    status :3, 
                    $or:[{serviceRevenue :{$gt:0}}, {productRevenue: {$gt: 0}}]
                }},
                {$group : {_id: '$parlorId'}}
            ], function(err , agg){
                async.each(agg , function(parlor , call){
                    LuckyDrawModel.findOne({parlorId: parlor._id}, {onServiceRevenue :1, onProductRevenue:1, beuIncentiveModel :1} , function(err , model){
                        console.log(model)
                        if(model.onServiceRevenue.length>0){
                            console.log("111111")
                            LuckyDrawDynamic.salonIncentiveThroughBeuSettlementOnServiceRevenue(parlor._id , startDate, endDate, settlementPeriod,"20", function( done){
                                call();
                            })
                            }
                        //     if(model.onProductRevenue.length>0){
                        //     console.log("22222222")
                        //     LuckyDrawDynamic.salonIncentiveThroughBeuSettlementOnProductRevenue(parlor._id ,startDate, endDate, settlementPeriod, "21" , function(done){
                        //         call();
                        //     })
                        // }
                        if(model.beuIncentiveModel.length>0){
                            console.log("3333333")
                            LuckyDrawDynamic.salonIncentiveThroughBeuSettlementOnTotalRevenue(parlor._id, startDate, endDate, settlementPeriod,"22", function(done){

                                call(); 
                            })
                        }else{
                            call();
                        }
                    })
                }, function allTask(){
                    console.log('done')

                })
            })
};


luckyDrawSchema.statics.salonIncentiveThroughBeuSettlementOnServiceRevenue = function(parlorId, startDate, endDate , settlementPeriod, categoryId, callback){
    console.log("serviceFunction")
    var employeeData =[], myData = [];
    Admin.find({ parlorId: parlorId , active: true}, function(err, employees) {
                _.forEach(employees, function(e) {
                    employeeData.push({
                        employeeId: e.id,
                        name: e.firstName + " " + e.lastName,
                        totalRevenueEmp: 0
                    });
                });
     Appointment.aggregate([
        {$match : {parlorId: parlorId, status:3, serviceRevenue:{$gt: 0}, appointmentStartTime: {$gt : startDate, $lte : endDate}}},
        ], function(err, apptData){
            _.forEach(apptData, function(ap ){
                _.forEach(ap.services , function(ser){
                var serviceRevenue = Appointment.serviceFunction(ap.createdAt, ser, employeeData);
                employeeData = serviceRevenue.employees
                })
            })
            console.log(employeeData)
                if(categoryId != 22){
                    Parlor.findOne({_id: parlorId}, {name: 1}, function(err , parlor){
                        LuckyDrawDynamic.salonIncentivefunction(employeeData, parlor._id, parlor.parlorName, settlementPeriod, "20", function(aData){
                            if(aData.length>0){
                                myData.push(aData)
                                callback();
                            }else
                                callback();
                       })
                    }) 
                }else{
                    callback(employeeData);
                }

            
         })
    })
};



luckyDrawSchema.statics.salonIncentiveThroughBeuSettlementOnProductRevenue = function(parlorId, startDate, endDate , settlementPeriod, categoryId , call2){
    console.log("productFunction")
     Appointment.aggregate([
        {
            $match : {
                parlorId: parlorId,
                status : 3,
                productRevenue: {$gt : 0},
                appointmentStartTime : {$gt : startDate, $lte : endDate},
            },
        },
         {
            $project : {
                "products.employeeId" : 1,
                "productRevenue" : 1,
                "parlorId" :1,
                "parlorName" :1,
                empSize : {$size : "$products"}
            }
        },
        { $unwind : "$products" },
        {
            $match : {
                'products.employeeId' : {$exists: true}
            }
        },
        {
            $project : {
                employeeId : "$products.employeeId" , 
                empRevenue : {$divide : ["$productRevenue" , "$empSize"]},
                parlorId: "$parlorId",
                parlorName : "$parlorName"
            }
        },
        {
            $group:{
                _id: "$employeeId",
                employeeId : {$first : "$employeeId"},
                totalRevenueEmp : {$sum : "$empRevenue"},
                parlorId: {$first : "$parlorId"},
                parlorName: {$first : "$parlorName"}}
        },
        // {
        //     $group : {
        //         _id : "$parlorId",
        //         employeeData :{$push :{employeeId :"$employeeId" , revenue:"$revenue"}},
        //         parlorId: {$first : "$parlorId"},
        //         parlorName: {$first : "$parlorName"},
        //     },
        // }
        ]).exec(function(err, data){
            var myData = [];
            if(categoryId != 22){
                // async.each(data, function(a , call) {
                     Parlor.findOne({_id: parlorId}, {name: 1}, function(err , parlor){
                       LuckyDrawDynamic.salonIncentivefunction(data, parlor._id, parlor.parlorName, settlementPeriod, "21", function(aData){
                            if(aData.length>0){
                                myData.push(aData)
                                call2();
                            }else
                                call2();
                       })
                   })

                // }, function allTaskCompleted2(){
                //     // console.log("vjhhhh" , myData.length)
                //     call2(myData);
                // })  
            }else{
                call2(data);
            }
        
    })
};


luckyDrawSchema.statics.salonIncentiveThroughBeuSettlementOnTotalRevenue = function(parlorId , startDate, endDate , settlementPeriod, categoryId, call5){
    console.log("totalFunction")
    var finalData = [];
     LuckyDrawDynamic.salonIncentiveThroughBeuSettlementOnServiceRevenue(parlorId ,startDate, endDate , settlementPeriod, "22", function(serviceData){
        // LuckyDrawDynamic.salonIncentiveThroughBeuSettlementOnProductRevenue(parlorId ,startDate, endDate , settlementPeriod, "22", function(productData){
            
            _.forEach(serviceData , function(ser){
                // _.forEach(productData, function(proEmp){
                //     if(proEmp.employeeId.toString() == ser.employeeId.toString()){
                //         ser.totalRevenueEmp = proEmp.totalRevenueEmp + ser.totalRevenueEmp
                //     }
                // })
                finalData.push(ser)
            })
        Parlor.findOne({_id: parlorId}, {name: 1}, function(err , parlor){
           LuckyDrawDynamic.salonIncentivefunction(finalData, parlor._id, parlor.parlorName, settlementPeriod, "22", function(aData){
                if(aData.length>0){
                    call5();
                }else
                    call5();
           })
         }) 
        // })
     })   
};



luckyDrawSchema.statics.salonIncentivefunction = function(employeeData, parlorId ,parlorName, settlementPeriod, categoryId, call1){
    console.log("incentiveFunction")
    var aData = [];
            async.each(employeeData , function(empData , cb){
                empData.revenue = empData.totalRevenueEmp;
                if(empData.revenue > 1 ){
                  // console.log("lsdhfsdk")
                    Appointment.aggregate([{ $match: { parlorId: ObjectId(parlorId), status: 3, appointmentStartTime: { $gte: new Date(HelperService.getLastMonthStart()) } } },
                        { $group: { _id: null, serviceRevenue: { $sum: "$serviceRevenue" }, productRevenue: { $sum: "$productRevenue" } } },
                        { $project: { revenue: { $add: ["$serviceRevenue", "$productRevenue"] } } }
                    ], function(err, totalParlorRevenue) {
                        LuckyDrawDynamic.aggregate([{ $match: { status: 0, parlorId: ObjectId(parlorId) , categoryId :{$ne : 13} , createdAt : { $gte: new Date(HelperService.getLastMonthStart()) }} },
                            { $group: { _id: null, amount: { $sum: "$amount" } } }
                        ], function(err, drawTotal) {
                            var drawAmount = 0;
                            if (drawTotal.length > 0) {
                                drawAmount += drawTotal[0].amount
                            }
                            var onePercent = totalParlorRevenue[0].revenue * 0.01
                            // if (onePercent > drawAmount) {
                            if (1) {
                                var findCriteria = {}
                                if(categoryId == "20")findCriteria = {onServiceRevenue :1}
                                if(categoryId == "21")findCriteria = {onProductRevenue :1}
                                if(categoryId == "22")findCriteria = {beuIncentiveModel :1}
                                LuckyDrawModel.findOne({ parlorId: parlorId }, findCriteria, function(err, draw) {

                                    Admin.findOne({ _id: empData.employeeId , salonIncentive : true }, function(err, emp) {
                                        if(emp){
                                            var createObj = {
                                                employeeId: ObjectId(empData.employeeId),
                                                employeeName: emp.firstName,
                                                role: emp.role,
                                                parlorId: parlorId,
                                                // parlorName: parlorName,
                                                categoryId: categoryId,
                                                amount: 0,
                                                reason: "Salon Incentive",
                                                stringToPrintEmployee: "",
                                                stringToPrintSalon: "",
                                                status: 1,
                                                settlementDate : new Date(),
                                                settlementPeriod : settlementPeriod
                                            }
                                            var asyncCriteria = {}
                                                if(categoryId == "20")asyncCriteria = draw.onServiceRevenue;
                                                if(categoryId == "21")asyncCriteria = draw.onProductRevenue;
                                                if(categoryId == "22")asyncCriteria = draw.beuIncentiveModel;
                                            async.each(asyncCriteria , function(d, callb){
                                                if(empData.revenue >= d.lowerLimit && empData.revenue < d.upperLimit){
                                                    createObj.amount = d.amount;
                                                    createObj.stringToPrintEmployee = d.employeeMessage;
                                                    createObj.stringToPrintSalon = d.salonMessage;

                                                    console.log(createObj)
                                                    LuckyDrawDynamic.create(createObj ,function(err, done) {

                                                    let message = "Hi, "+emp.firstName+" your lucky draw of Rs "+d.amount+" has been generated. Please claim it within 24 hours."
                                                        // ParlorService.sendLuckyDrawNotification(emp.firebaseId, , message, 'luckyDraw')
                                                        // if(emp.firebaseId){
                                                        //     ParlorService.sendIonicNotification2(emp.firebaseId, 'Lucky Draw Generated', message, "luckyDraw", "luckyDraw", function(){

                                                                aData.push(createObj)
                                                                callb(aData);
                                                        //     })
                                                        // } if (emp.firebaseIdIOS){
                                                        //     ParlorService.sendIOSNotificationOnEmployeeApp(emp.firebaseIdIOS, 'Lucky Draw Generated', message, "luckyDraw", function(){

                                                        //         aData.push(createObj)
                                                        //         callb(aData);
                                                        //     })
                                                        // }
                                                        
                                                    })
                                                    console.log(createObj)

                                                    // callb();
                                                 } else
                                                    callb();

                                            }, function taskComplete(){
                                                cb();
                                            })
                                             
                                        }else
                                            cb();
                                    })

                                })

                            }else
                                cb();

                        })
                    })
                }else
                    cb();
            }, function allTaskCompleted1(){
            
                call1(aData);










                
        });

};



luckyDrawSchema.statics.subscriptionAmount = function(startDate, endDate) {
    console.log("I am in on subscriptionAmount ")
        Appointment.aggregate([
        {
            $match : {
                // parlorId: ObjectId("5bf8f48f40fdce4d68d83771"),
                status : 3,
                appointmentStartTime : {$gt : startDate, $lte : endDate},
                "client.subscriptionLoyality" : {$gt : 0},
                'loyalitySubscription' : {$gt : 0},
            },
        },
            {
                $project : {
                    "employees.revenue" : 1,
                    "employees.employeeId" : 1,
                    "employees.name" : 1,
                    "parlorId" :1,
                    "parlorName" :1,
                }
            },
            {
                $unwind : "$employees"
            },
            {
                $project : {
                    revenue : "$employees.revenue",
                    employeeId : "$employees.employeeId",
                    name : "$employees.name",
                    parlorId: "$parlorId",
                    parlorName: "$parlorName",
                }
            },
            {
                $group : {
                    _id : "$employeeId",
                    employeeId : {$first : "$employeeId"},
                    employeeName : {$first : "$name"},
                    revenue : {$sum : "$revenue"},
                    parlorId: {$first : "$parlorId"},
                    parlorName: {$first : "$parlorName"}
                }
            },
            {
                $group : {
                    _id : "$parlorId",
                    employeeData :{$push :{employeeId :"$employeeId" , employeeName:"$employeeName" , revenue:"$revenue"}},
                    parlorId: {$first : "$parlorId"},
                    parlorName: {$first : "$parlorName"},
                },
            }
        ]).exec(function(err, data){
            var myData = [];
        async.each(data, function(a , call) {
            console.log("parlorId-------------------", a.parlorId)
           LuckyDrawDynamic.subscriptionRevenueFunction(a.employeeData, a.parlorId, a.parlorName, function(aData){
                if(aData.length>0){
                    myData.push(aData)
                    call();
                }else
                    call();
           })

        }, function allTaskCompleted2(){
            console.log("vjh" , myData.length)
            // return callback(myData);
        })  
    })
}


luckyDrawSchema.statics.subscriptionRevenueFunction = function(employeeData, parlorId ,parlorName, call){
    var aData = [];
            async.each(employeeData , function(empData , cb){
console.log("empData" , empData)
                if(empData.revenue >=1000 ){
                  console.log("lsdhfsdk")
                    Appointment.aggregate([{ $match: { parlorId: ObjectId(parlorId), status: 3, appointmentStartTime: { $gte: new Date(HelperService.getLastMonthStart()) } } },
                        { $group: { _id: null, serviceRevenue: { $sum: "$serviceRevenue" }, productRevenue: { $sum: "$productRevenue" } } },
                        { $project: { revenue: { $add: ["$serviceRevenue", "$productRevenue"] } } }
                    ], function(err, totalParlorRevenue) {

                        LuckyDrawDynamic.aggregate([{ $match: { status: 0, parlorId: ObjectId(parlorId) , categoryId :{$ne : 13} , createdAt : { $gte: new Date(HelperService.getLastMonthStart()) }} },
                            { $group: { _id: null, amount: { $sum: "$amount" } } }
                        ], function(err, drawTotal) {
                            
                            var drawAmount = 0;
                            if (drawTotal.length > 0) {
                                drawAmount += drawTotal[0].amount
                            }
                            var onePercent = totalParlorRevenue[0].revenue * 0.01
                            console.log(onePercent , drawAmount)
                            if (onePercent > drawAmount) {
                                console.log("parlorId-------------------" , onePercent , drawAmount)
                                console.log("empData.employeeId-------------------" , empData.employeeName)
                                LuckyDrawModel.findOne({ parlorId: parlorId }, function(err, draw) {

                                        Admin.findOne({ _id: empData.employeeId }, function(err, emp) {

                                            var createObj = {
                                                employeeId: ObjectId(empData.employeeId),
                                                employeeName: emp.firstName,
                                                role: emp.role,
                                                parlorId: parlorId,
                                                // parlorName: parlorName,
                                                categoryId: "17",
                                                amount: 0,
                                                reason: "Subscription Revenue",
                                                stringToPrintEmployee: "",
                                                stringToPrintSalon: "",
                                                status: 1,
                                                settlementDate : new Date()
                                            }

                                            async.each(draw.subsRevenue , function(d, callb){
                                                if(empData.revenue >= d.lowerLimit && empData.revenue < d.upperLimit){
                                                    createObj.amount = d.amount;
                                                    createObj.stringToPrintEmployee = d.employeeMessage;
                                                    createObj.stringToPrintSalon = d.salonMessage;
                                                    LuckyDrawDynamic.create(createObj ,function(err, done) {

                                                    let message = "Hi, "+emp.firstName+" your lucky draw of Rs "+d.amount+" has been generated. Please claim it within 24 hours."
                                                        // ParlorService.sendLuckyDrawNotification(emp.firebaseId, , message, 'luckyDraw')
                                                        if(emp.firebaseId){
                                                            ParlorService.sendIonicNotification2(emp.firebaseId, 'Lucky Draw Generated', message, "luckyDraw", "luckyDraw", function(){

                                                                aData.push(createObj)
                                                                callb(aData);
                                                            })
                                                        } if (emp.firebaseIdIOS){
                                                            ParlorService.sendIOSNotificationOnEmployeeApp(emp.firebaseIdIOS, 'Lucky Draw Generated', message, "luckyDraw", function(){

                                                                aData.push(createObj)
                                                                callb(aData);
                                                            })
                                                        }
                                                        
                                                    })
                                                    console.log(createObj)

                                                    // callb();
                                                 } else
                                                    callb();

                                            }, function taskComplete(){
                                                cb();
                                            })
                                             
                                        })

                                })

                            }else
                                cb();

                        })
                    })
                }else
                    cb();
            }, function allTaskCompleted1(){
            
                return call(aData);
        });

};



luckyDrawSchema.statics.onCustomerReview = function(apptt) {
    Appointment.findOne({ _id: apptt }, function(err, appt) {
        Appointment.aggregate([{ $match: { parlorId: ObjectId(appt.parlorId), status: 3, appointmentStartTime: { $gte: new Date(HelperService.getLastMonthStart()) } } },
            { $group: { _id: null, serviceRevenue: { $sum: "$serviceRevenue" }, productRevenue: { $sum: "$productRevenue" } } },
            { $project: { revenue: { $add: ["$serviceRevenue", "$productRevenue"] } } }
        ], function(err, totalParlorRevenue) {
            LuckyDrawDynamic.aggregate([{ $match: { status: 0, parlorId: ObjectId(appt.parlorId) } },
                { $group: { _id: null, amount: { $sum: "$amount" } } }
            ], function(err, drawTotal) {
                var drawAmount = 0;
                if (drawTotal.length > 0) {
                    drawAmount += drawTotal[0].amount
                }
                var onePercent = totalParlorRevenue * 0.01
                if (onePercent > drawAmount) {
                    LuckyDrawModel.findOne({ parlorId: appt.parlorId }, function(err, draw) {
                        var ratings = draw.customerReview.value
                        console.log("ratings", ratings)
                        if (appt.review.employees.length > 0) {
                            _.forEach(appt.review.employees, function(a) {
                                Admin.findOne({ _id: a.employeeId }, { firstName: 1 }, function(err, emp) {
                                    LuckyDrawDynamic.create({
                                        employeeId: ObjectId(a.employeeId),
                                        employeeName: emp.name,
                                        role: emp.role,
                                        billAmount: appt.subtotal,

                                        clientName: appt.client.name,

                                        parlorId: appt.parlorId,

                                        appointmentId: appt._id,

                                        categoryId: 3,

                                        amount: draw.customerReview.amount,

                                        reason: "Customer Review",

                                        stringToPrintEmployee: draw.customerReview.employeeMessage,
                                        stringToPrintSalon: draw.customerReview.salonMessage,

                                        status: 1


                                    }, function(err, done) {
                                        if (err) {
                                            console.log(err)
                                        } else {
                                            Admin.find({ parlorId: appt.parlorid, role: 2 }, { firstName: 1 }, function(err, admin) {
                                                if (admin.length > 0) {

                                                    LuckyDrawDynamic.create({

                                                        employeeId: ObjectId(admin._id),
                                                        employeeName: admin.firstName,
                                                        role: admin.role,
                                                        clientName: appt.client.name,
                                                        billAmount: appt.subtotal,

                                                        parlorId: appt.parlorId,

                                                        appointmentId: appt._id,

                                                        categoryId: 3,

                                                        amount: draw.billServices.amount,

                                                        reason: "Customer Review",

                                                        stringToPrintEmployee: draw.billServices.employeeMessage,
                                                        stringToPrintSalon: draw.billServices.salonMessage,

                                                        status: 1


                                                    }, function(err, adminDone) {

                                                        console.log("manager created")

                                                    })
                                                }




                                            })
                                        }
                                    })

                                })


                            })

                        }



                    })

                }
            })
        })
    })
}

luckyDrawSchema.statics.onProductPurchase = function(apptt) {
    Appointment.findOne({ _id: apptt }, function(err, appt) {
        if (appt.products.length > 0) {
            Appointment.aggregate([{ $match: { parlorId: ObjectId(appt.parlorId), status: 3, appointmentStartTime: { $gte: new Date(HelperService.getLastMonthStart()) } } },
                { $group: { _id: null, serviceRevenue: { $sum: "$serviceRevenue" }, productRevenue: { $sum: "$productRevenue" } } },
                { $project: { revenue: { $add: ["$serviceRevenue", "$productRevenue"] } } }
            ], function(err, totalParlorRevenue) {

                LuckyDrawDynamic.aggregate([{ $match: { status: 0, createdAt: { $gte: new Date(HelperService.getLastMonthStart()) }, status: 0, parlorId: ObjectId(appt.parlorId) } },
                    { $group: { _id: null, amount: { $sum: "$amount" } } }
                ], function(err, drawTotal) {

                    var drawAmount = 0;
                    if (drawTotal.length > 0) {
                        drawAmount += drawTotal[0].amount
                    }
                    Parlor.findOne({ _id: appt.parlorId }, { createdAt: 1, parlorType: 1 }, function(err, parlorDate) {

                        var parlorDatesTemp = new Date(parlorDate.createdAt)
                        var parlorDates = new Date() - parlorDatesTemp
                        var time = Math.round((parlorDates) / (1000 * 60 * 60 * 24));
                        console.log("time", time)
                        if (totalParlorRevenue.length > 0) {
                            var onePercent = totalParlorRevenue[0].revenue * 0.01
                            if (time <= 30) {

                                if (parlorDate.parlorType == 0) {
                                    onePercent = 3000
                                } else if (parlorDate.parlorType == 1) {
                                    onePercent = 2000
                                } else {
                                    onePercent = 1000
                                }

                            }
                            console.log("product", onePercent, drawAmount)
                            if (onePercent > drawAmount) {

                                var query = [
                                    { $match: { status: 3, parlorId: ObjectId(appt.parlorId) } },
                                    { $unwind: "$products" },
                                    { $group: { _id: null, count: { $sum: 1 } } }
                                ];
                                console.log(JSON.stringify(query))
                                Appointment.aggregate(query, function(err, count) {

                                    LuckyDrawModel.findOne({ parlorId: appt.parlorId }, function(err, draw) {
                                        if (count.length > 0) {
                                            console.log("count[0].count", count[0].count)
                                            var count1 = count[0].count % draw.retailProduct.value
                                        } else {
                                            var count1 = 1 % draw.retailProduct.value
                                        }

                                        console.log("count1  product", count1)

                                        if (count1 == 0) {
                                            console.log(appt.employees)
                                            async.each(appt.products, function(a, cb) {
                                                console.log(a)

                                                Admin.findOne({ _id: ObjectId(a.employeeId) }, { firstName: 1, role: 1 }, function(err, adm) {


                                                    LuckyDrawDynamic.create({

                                                        employeeId: ObjectId(a.employeeId),

                                                        employeeName: adm.firstName,
                                                        role: adm.role,
                                                        billAmount: appt.subtotal,
                                                        clientName: appt.client.name,

                                                        parlorId: appt.parlorId,

                                                        appointmentId: appt._id,

                                                        categoryId: 12,

                                                        amount: draw.retailProduct.amount,

                                                        reason: "Product Sell",

                                                        stringToPrintEmployee: draw.retailProduct.employeeMessage,
                                                        stringToPrintSalon: draw.retailProduct.salonMessage,

                                                        status: 1


                                                    }, function(err, done) {
                                                        if (err) {
                                                            console.log(err)
                                                        } else {
                                                            cb();
                                                        }
                                                    })
                                                })

                                            }, function(done) {


                                                Admin.find({ parlorId: appt.parlorId, role: { $in: [2, 8, 9] }, active: true }, { firstName: 1, role: 12 }, function(err, admin) {
                                                    if (admin.length > 0) {
                                                        async.each(admin, function(ad, cbs) {
                                                            LuckyDrawDynamic.create({

                                                                employeeId: ObjectId(ad._id),
                                                                employeeName: ad.firstName,
                                                                role: ad.role,
                                                                clientName: appt.client.name,
                                                                billAmount: appt.subtotal,

                                                                parlorId: appt.parlorId,

                                                                appointmentId: appt._id,

                                                                categoryId: 12,

                                                                amount: draw.billServices.amount,

                                                                reason: "Product Sell",

                                                                stringToPrintEmployee: draw.retailProduct.employeeMessage,
                                                                stringToPrintSalon: draw.retailProduct.salonMessage,

                                                                status: 1


                                                            }, function(err, adminDone) {
                                                                console.log("manager created")
                                                                LuckyDrawDynamic.notification(ad.firstName, appt.products, appt.parlorId, appt.subtotal, appt.client.name, draw.retailProduct.employeeMessage, draw.retailProduct.salonMessage);
                                                                cbs();

                                                            })
                                                        }, function(done) {



                                                        })


                                                    } else {

                                                        LuckyDrawDynamic.notification("", appt.products, appt.parlorId, appt.subtotal, appt.client.name, draw.retailProduct.employeeMessage, draw.retailProduct.salonMessage);


                                                    }





                                                })

                                            })

                                        } else {


                                        }


                                    })


                                })
                            }
                        }
                    })

                })

            })
        }
    })

}






luckyDrawSchema.statics.onServiceBill = function(apptt) {

    Appointment.findOne({ _id: apptt }, function(err, appt) {

        console.log("HelperService.getLastMonthStart()", HelperService.getLastMonthStart())
        var qu = [{ $match: { parlorId: ObjectId(appt.parlorId), status: 3, appointmentStartTime: { $gte: new Date(HelperService.getLastMonthStart()) } } },
            { $group: { _id: null, serviceRevenue: { $sum: "$serviceRevenue" }, productRevenue: { $sum: "$productRevenue" } } },
            { $project: { revenue: { $add: ["$serviceRevenue", "$productRevenue"] } } }
        ];
        Appointment.aggregate(qu, function(err, totalParlorRevenue) {
            LuckyDrawDynamic.aggregate([{ $match: { status: 0, createdAt: { $gte: new Date(HelperService.getLastMonthStart()) }, status: 0, parlorId: ObjectId(appt.parlorId) } },
                { $group: { _id: null, amount: { $sum: "$amount" } } }
            ], function(err, drawTotal) {
                console.log("-------------------------Service Per Bill--------------------------------")
                console.log("totalParlorRevenue", totalParlorRevenue[0].revenue, "drawTotal", drawTotal)
                var drawTotal1 = 0
                if (drawTotal.length > 1) {
                    drawTotal1 = drawTotal[0].amount
                }


                Parlor.findOne({ _id: appt.parlorId }, { createdAt: 1, parlorType: 1 }, function(err, parlorDate) {

                    var parlorDatesTemp = new Date(parlorDate.createdAt)
                    var parlorDates = new Date() - parlorDatesTemp
                    var time = Math.round((parlorDates) / (1000 * 60 * 60 * 24));
                    console.log("time", time)
                    if (totalParlorRevenue.length > 0) {
                        var onePercent = totalParlorRevenue[0].revenue * 0.01
                        if (time <= 30) {

                            if (parlorDate.parlorType == 0) {
                                onePercent = 3000
                            } else if (parlorDate.parlorType == 1) {
                                onePercent = 2000
                            } else {
                                onePercent = 1000
                            }

                        }

                        if (onePercent > drawTotal1) {
                            Appointment.count({ _id: { $ne: appt._id }, status: 3, parlorId: appt.parlorId }, function(err, count) {
                                LuckyDrawModel.findOne({ parlorId: appt.parlorId }, function(err, draw) {
                                    var limit = Math.floor((count * draw.billServices.value) / 100);
                                    console.log("My limit", limit)
                                    Appointment.count({ status: 3, parlorId: appt.parlorId }, function(err, newCount) {
                                        console.log("old count", count)
                                        console.log("newCount", newCount)
                                        Appointment.aggregate([
                                            { $match: { _id: { $ne: ObjectId(appt._id) }, status: 3, parlorId: ObjectId(appt.parlorId) } },
                                            { $unwind: "$services" },
                                            { $group: { _id: "$_id", count: { $sum: 1 } } },
                                            { $sort: { count: -1 } },
                                            { $limit: limit },
                                            { $group: { _id: null, sum: { $sum: "$count" }, count: { $sum: 1 } } }
                                        ], function(err, appointment) {
                                            if (appointment.length > 0) {



                                                var avgServiceBill = appointment[0].sum / appointment[0].count;
                                                var serviceLength = 0;
                                                _.forEach(appt.services, function(l) {
                                                    serviceLength += l.quantity
                                                })
                                                console.log("avgServicePerBill", avgServiceBill)
                                                console.log("serviceLength", serviceLength)
                                                if (limit > 0 && avgServiceBill <= serviceLength) {



                                                    var newLimit = (newCount * draw.billValue.value) / 100;
                                                    Appointment.aggregate([
                                                        { $match: { status: 3, parlorId: ObjectId(appt.parlorId) } },
                                                        { $unwind: "$services" },
                                                        { $group: { _id: "$_id", count: { $sum: 1 } } },
                                                        { $sort: { count: -1 } },
                                                        { $limit: newLimit },
                                                    ], function(err, allAppt) {
                                                        console.log(avgServiceBill, count, appt.services.length, newCount)
                                                        var newAvgServiceBill = (avgServiceBill * count + appt.services.length) / newCount;
                                                        var billId = []
                                                        _.forEach(allAppt, function(ap) {
                                                            billId.push(ap._id)
                                                        })
                                                        console.log("billId", billId)
                                                        Parlor.update({ _id: appt.parlorId }, {
                                                            topServiceBills: billId,
                                                            avgServiceBill: newAvgServiceBill
                                                        }, function(err, updated) {

                                                            if (err) { console.log(err) } else {

                                                                if ((serviceLength >= avgServiceBill) && (serviceLength >= 2)) {

                                                                    async.each(appt.employees, function(a, cb) {

                                                                        LuckyDrawDynamic.create({

                                                                            employeeId: ObjectId(a.employeeId),
                                                                            employeeName: a.name,
                                                                            role: a.role,
                                                                            clientName: appt.client.name,
                                                                            billAmount: appt.subtotal,



                                                                            parlorId: appt.parlorId,

                                                                            appointmentId: appt._id,

                                                                            categoryId: 5,

                                                                            amount: draw.billServices.amount,

                                                                            reason: "Service bill value",

                                                                            stringToPrintEmployee: draw.billServices.employeeMessage,
                                                                            stringToPrintSalon: draw.billServices.salonMessage,

                                                                            status: 1


                                                                        }, function(err, done) {
                                                                            if (err) {
                                                                                console.log(err)
                                                                            } else {
                                                                                cb();


                                                                            }


                                                                        })
                                                                    }, function(done) {
                                                                        Admin.find({ parlorId: appt.parlorId, role: { $in: [2, 8, 9] }, active: true }, { firstName: 1 }, function(err, admin) {
                                                                            if (admin.length > 0) {
                                                                                async.each(admin, function(ad, cbs) {
                                                                                    LuckyDrawDynamic.create({

                                                                                        employeeId: ObjectId(ad._id),
                                                                                        employeeName: ad.firstName,
                                                                                        role: ad.role,
                                                                                        clientName: appt.client.name,
                                                                                        billAmount: appt.subtotal,

                                                                                        parlorId: appt.parlorId,

                                                                                        appointmentId: appt._id,

                                                                                        categoryId: 5,

                                                                                        amount: draw.billServices.amount,

                                                                                        reason: "Service bill value",

                                                                                        stringToPrintEmployee: draw.billServices.employeeMessage,
                                                                                        stringToPrintSalon: draw.billServices.salonMessage,

                                                                                        status: 1


                                                                                    }, function(err, adminDone) {
                                                                                        LuckyDrawDynamic.notification(ad.firstName, appt.products, appt.parlorId, appt.subtotal, appt.client.name, draw.retailProduct.employeeMessage, draw.retailProduct.salonMessage);

                                                                                        console.log("manager created")
                                                                                        cbs();
                                                                                    })


                                                                                }, function() {



                                                                                })


                                                                            } else {

                                                                                LuckyDrawDynamic.notification("", appt.products, appt.parlorId, appt.subtotal, appt.client.name, draw.retailProduct.employeeMessage, draw.retailProduct.salonMessage);


                                                                            }



                                                                        })

                                                                    })
                                                                }
                                                            }


                                                        })


                                                    })
                                                }
                                            }

                                        })
                                    }).limit(limit)



                                })

                            })
                        }
                    }

                })
            })
        })
    })

}



luckyDrawSchema.statics.onMembershipSold = function(apptt) {
    Appointment.findOne({ _id: apptt }, function(err, appt) {

        var qu = [{ $match: { parlorId: ObjectId(appt.parlorId), status: 3, appointmentStartTime: { $gte: new Date(HelperService.getLastMonthStart()) } } },
            { $group: { _id: null, serviceRevenue: { $sum: "$serviceRevenue" }, productRevenue: { $sum: "$productRevenue" } } },
            { $project: { revenue: { $add: ["$serviceRevenue", "$productRevenue"] } } }
        ];
        Appointment.aggregate(qu, function(err, totalParlorRevenue) {
            LuckyDrawDynamic.aggregate([{ $match: { status: 0, createdAt: { $gte: new Date(HelperService.getLastMonthStart()) }, status: 0, parlorId: ObjectId(appt.parlorId) } },
                { $group: { _id: null, amount: { $sum: "$amount" } } }
            ], function(err, drawTotal) {
                console.log("-------------------------Service Per Bill--------------------------------")
                console.log("totalParlorRevenue", totalParlorRevenue[0].revenue, "drawTotal", drawTotal)
                var drawTotal1 = 0
                if (drawTotal.length > 1) {
                    drawTotal1 = drawTotal[0].amount
                }


                Parlor.findOne({ _id: appt.parlorId }, { createdAt: 1, parlorType: 1 }, function(err, parlorDate) {

                    var parlorDatesTemp = new Date(parlorDate.createdAt)
                    var parlorDates = new Date() - parlorDatesTemp
                    var time = Math.round((parlorDates) / (1000 * 60 * 60 * 24));
                    console.log("time", time)
                    if (totalParlorRevenue.length > 0) {
                        var onePercent = totalParlorRevenue[0].revenue * 0.01
                        if (time <= 30) {

                            if (parlorDate.parlorType == 0) {
                                onePercent = 3000
                            } else if (parlorDate.parlorType == 1) {
                                onePercent = 2000
                            } else {
                                onePercent = 1000
                            }

                        }

                        if (onePercent > drawTotal1) {

                            if (appt.appointmentType == 3 && appt.membershipId) {

                                console.log("appt.membershipId", appt.membershipId)
                                console.log("appt.client.id", appt.client.id)
                                console.log("appt.parlorId", appt.parlorId)
                                MembershipSale.find({ userId: appt.client.id, parlorId: localVar.getMembershipParlorId(), membershipId: appt.membershipId }, function(err, member) {
                                    console.log("_______________________membership_______________________", member)

                                    console.log("member.firstTimeRedeem", member[0].firstTimeRedeem)
                                    if (member[0].firstTimeRedeem == false) {


                                        LuckyDrawModel.findOne({ parlorId: appt.parlorId }, function(err, draw) {
                                            async.each(appt.employees, function(a, cb) {
                                                LuckyDrawDynamic.create({
                                                    employeeId: ObjectId(a.employeeId),

                                                    employeeName: a.name,
                                                    role: a.role,
                                                    clientName: appt.client.name,
                                                    billAmount: appt.subtotal,


                                                    parlorId: appt.parlorId,

                                                    appointmentId: appt._id,

                                                    categoryId: 6,

                                                    amount: draw.membershipSold.amount,

                                                    reason: "Membership Sold",

                                                    stringToPrintEmployee: draw.membershipSold.employeeMessage,
                                                    stringToPrintSalon: draw.membershipSold.salonMessage,

                                                    status: 1


                                                }, function(err, done) {
                                                    if (err) {
                                                        console.log(err)
                                                    } else {

                                                        cb();

                                                    }
                                                })



                                            }, function(done) {

                                                Admin.find({ parlorId: appt.parlorId, role: { $in: [2, 8, 9] }, active: true }, { firstName: 1 }, function(err, admin) {
                                                    if (admin.length > 0) {
                                                        async.each(admin, function(ad, cbs) {

                                                            LuckyDrawDynamic.create({

                                                                employeeId: ObjectId(ad._id),
                                                                employeeName: ad.firstName,
                                                                role: ad.role,
                                                                clientName: appt.client.name,
                                                                billAmount: appt.subtotal,

                                                                parlorId: appt.parlorId,

                                                                appointmentId: appt._id,

                                                                categoryId: 6,

                                                                amount: draw.billServices.amount,

                                                                reason: "Membership Sold",

                                                                stringToPrintEmployee: draw.membershipSold.employeeMessage,
                                                                stringToPrintSalon: draw.membershipSold.salonMessage,

                                                                status: 1


                                                            }, function(err, adminDone) {

                                                                MembershipSale.update({ _id: member[0]._id }, { $set: { firstTimeRedeem: true } }, function(err, member) {
                                                                    LuckyDrawDynamic.notification(ad.firstName, appt.employees, appt.parlorId, appt.subtotal, appt.client.name, draw.membershipSold.employeeMessage, draw.membershipSold.salonMessage);

                                                                    console.log("manager membership created")
                                                                    console.log("membership", member)
                                                                    cbs();

                                                                })

                                                            })
                                                        }, function(done) {


                                                        })
                                                    } else {


                                                        LuckyDrawDynamic.notification("", appt.employees, appt.parlorId, appt.subtotal, appt.client.name, draw.membershipSold.employeeMessage, draw.membershipSold.salonMessage);


                                                    }





                                                })

                                            })



                                        })
                                    }
                                }).sort({ "$natural": -1 })


                            }
                        }
                    }
                })
            })
        })
    })
}

// luckyDrawSchema.statics.onAvgBill = function(apptt) {
//     console.log("I am in on average bill")
//     Appointment.findOne({ _id: apptt }, function(err, appt) {
//         console.log("-------------------------Average  Bill Value--------------------------------")

//         Appointment.aggregate([{ $match: { parlorId: ObjectId(appt.parlorId), status: 3, appointmentStartTime: { $gte: new Date(HelperService.getLastMonthStart()) } } },
//             { $group: { _id: null, serviceRevenue: { $sum: "$serviceRevenue" }, productRevenue: { $sum: "$productRevenue" } } },
//             { $project: { revenue: { $add: ["$serviceRevenue", "$productRevenue"] } } }
//         ], function(err, totalParlorRevenue) {

//             LuckyDrawDynamic.aggregate([{ $match: { status: 0, createdAt: { $gte: new Date(HelperService.getLastMonthStart()) }, status: 0, parlorId: ObjectId(appt.parlorId) } },
//                 { $group: { _id: null, amount: { $sum: "$amount" } } }
//             ], function(err, drawTotal) {
//                 var drawAmount = 0;
//                 if (drawTotal.length > 0) {
//                     drawAmount += drawTotal[0].amount
//                 }


//                 Parlor.findOne({ _id: appt.parlorId }, { createdAt: 1, parlorType: 1 }, function(err, parlorDate) {

//                     var parlorDatesTemp = new Date(parlorDate.createdAt)
//                     var parlorDates = new Date() - parlorDatesTemp
//                     var time = Math.round((parlorDates) / (1000 * 60 * 60 * 24));
//                     console.log("time", time)
//                     if (totalParlorRevenue.length > 0) {
//                         var onePercent = totalParlorRevenue[0].revenue * 0.01
//                         if (time <= 30) {

//                             if (parlorDate.parlorType == 0) {
//                                 onePercent = 3000
//                             } else if (parlorDate.parlorType == 1) {
//                                 onePercent = 2000
//                             } else {
//                                 onePercent = 1000
//                             }

//                         }
//                         if (onePercent > drawAmount) {

//                             Appointment.count({ status: 3, parlorId: ObjectId(appt.parlorId), _id: { $ne: appt._id } }, function(err, count) {
//                                 console.log("This count excluded current", count)
//                                 LuckyDrawModel.findOne({ parlorId: ObjectId(appt.parlorId) }, function(err, draw) {
//                                     console.log(" draw.billValue.value", draw.billValue.value)
//                                     var limit = Math.floor((count * draw.billValue.value) / 100);
//                                     console.log("this is limit", limit)
//                                     var query = [
//                                         { $match: { _id: { $ne: ObjectId(appt._id) }, status: 3, parlorId: ObjectId(appt.parlorId) } },
//                                         { $sort: { subtotal: -1 } },
//                                         { $limit: limit },
//                                         { $group: { _id: null, sum: { $sum: "$subtotal" } } },
//                                     ]
//                                     Appointment.aggregate(query, function(err, sum) {
//                                         console.log(JSON.stringify(query))

//                                         if (limit > 0) {


//                                             var avgBill = sum[0].sum / limit;
//                                             console.log("this average of bill ", avgBill)
//                                             console.log("this bill amount", appt.subtotal)

//                                             if (appt.subtotal > avgBill && appt.subtotal > 800) {
//                                                 console.log("here")
//                                                 async.each(appt.employees, function(a, cb) {
//                                                     LuckyDrawDynamic.create({

//                                                         employeeId: ObjectId(a.employeeId),

//                                                         employeeName: a.name,
//                                                         role: a.role,

//                                                         clientName: appt.client.name,
//                                                         billAmount: appt.subtotal,



//                                                         parlorId: appt.parlorId,

//                                                         appointmentId: appt._id,

//                                                         categoryId: 4,

//                                                         amount: draw.billValue.amount,

//                                                         reason: "Average bill value",

//                                                         stringToPrintEmployee: draw.billValue.employeeMessage,
//                                                         stringToPrintSalon: draw.billValue.salonMessage,

//                                                         status: 1


//                                                     }, function(err, done) {
//                                                         if (err) {
//                                                             console.log(err)
//                                                         } else {


//                                                             Appointment.count({ status: 3, parlorId: appt.parlorId }, function(err, newCount) {
//                                                                 var newLimit = (newCount * draw.billValue.value) / 100;
//                                                                 Appointment.find({ status: 3, parlorId: appt.parlorId }, { subtotal: 1 }, function(err, appointment) {
//                                                                     var topBillId = []

//                                                                     _.forEach(appointment, function(a) {

//                                                                         topBillId.push(a._id)

//                                                                     })
//                                                                     console.log(avgBill, limit, appt.subtotal, newCount)
//                                                                     var avgBillValue = (avgBill * limit + appt.subtotal) / (newCount)
//                                                                     console.log("avgBillValue", avgBillValue)
//                                                                     Parlor.update({ _id: appt.parlorId }, {
//                                                                         topBills: topBillId,
//                                                                         avgBillValue: avgBillValue
//                                                                     }, function(err, updated) {
//                                                                         if (err) {
//                                                                             console.log(err)
//                                                                         } else {
//                                                                             console.log(" Updated")
//                                                                             cb();

//                                                                         }
//                                                                     })

//                                                                 }).limit(newLimit).sort({ subtotal: -1 })
//                                                             })
//                                                             console.log(done)
//                                                         }
//                                                     })

//                                                 }, function(done) {


//                                                     Admin.find({ parlorId: appt.parlorId, role: { $in: [2, 8, 9] }, active: true }, { firstName: 1 }, function(err, admin) {

//                                                         if (admin.length > 0) {

//                                                             async.each(admin, function(ad, cbs) {
//                                                                 LuckyDrawDynamic.create({

//                                                                     employeeId: ObjectId(ad._id),
//                                                                     employeeName: ad.firstName,
//                                                                     role: ad.role,

//                                                                     clientName: appt.client.name,
//                                                                     billAmount: appt.subtotal,

//                                                                     parlorId: appt.parlorId,

//                                                                     appointmentId: appt._id,

//                                                                     categoryId: 4,

//                                                                     amount: draw.billValue.amount,

//                                                                     reason: "Average bill value",

//                                                                     stringToPrintEmployee: draw.billValue.employeeMessage,
//                                                                     stringToPrintSalon: draw.billValue.salonMessage,

//                                                                     status: 1


//                                                                 }, function(err, adminDone) {

//                                                                     console.log("manager created")
//                                                                     LuckyDrawDynamic.notification(ad.firstName, appt.employees, appt.parlorId, appt.subtotal, appt.client.name, draw.billValue.employeeMessage, draw.billValue.salonMessage);
//                                                                     cbs();

//                                                                 })
//                                                             }, function(done) {})



//                                                         } else {

//                                                             LuckyDrawDynamic.notification("", appt.employees, appt.parlorId, appt.subtotal, appt.client.name, draw.billValue.employeeMessage, draw.billValue.salonMessage);


//                                                         }


//                                                     })

//                                                 })



//                                             }
//                                         }

//                                     })




//                                 })
//                             })
//                         }
//                     }
//                 })
//             })
//         })


//     })
// }


luckyDrawSchema.statics.checkin = function(apptt) {
    console.log("I am in on average bill")
    Appointment.findOne({ _id: apptt }, function(err, appt) {
        console.log("-------------------------Average  Bill Value--------------------------------")

        Appointment.aggregate([{ $match: { parlorId: ObjectId(appt.parlorId), status: 3, appointmentStartTime: { $gte: new Date(HelperService.getLastMonthStart()) } } },
            { $group: { _id: null, serviceRevenue: { $sum: "$serviceRevenue" }, productRevenue: { $sum: "$productRevenue" } } },
            { $project: { revenue: { $add: ["$serviceRevenue", "$productRevenue"] } } }
        ], function(err, totalParlorRevenue) {

            LuckyDrawDynamic.aggregate([{ $match: { status: 0, createdAt: { $gte: new Date(HelperService.getLastMonthStart()) }, status: 0, parlorId: ObjectId(appt.parlorId) } },
                { $group: { _id: null, amount: { $sum: "$amount" } } }
            ], function(err, drawTotal) {
                var drawAmount = 0;
                if (drawTotal.length > 0) {
                    drawAmount += drawTotal[0].amount
                }


                Parlor.findOne({ _id: appt.parlorId }, { createdAt: 1, parlorType: 1 }, function(err, parlorDate) {

                    var parlorDatesTemp = new Date(parlorDate.createdAt)
                    var parlorDates = new Date() - parlorDatesTemp
                    var time = Math.round((parlorDates) / (1000 * 60 * 60 * 24));
                    console.log("time", time)
                    if (totalParlorRevenue.length > 0) {
                        var onePercent = totalParlorRevenue[0].revenue * 0.01
                        if (time <= 30) {

                            if (parlorDate.parlorType == 0) {
                                onePercent = 3000
                            } else if (parlorDate.parlorType == 1) {
                                onePercent = 2000
                            } else {
                                onePercent = 1000
                            }

                        }
                        if (onePercent > drawAmount) {

                            Appointment.count({ status: 3, parlorId: ObjectId(appt.parlorId), _id: { $ne: appt._id } }, function(err, count) {
                                console.log("This count excluded current", count)
                                LuckyDrawModel.findOne({ parlorId: ObjectId(appt.parlorId) }, function(err, draw) {
                                    console.log(" draw.billValue.value", draw.checkIn.value)
                                    var limit = Math.floor((count * draw.checkIn.value) / 100);
                                    console.log("this is limit", limit)
                                    var query = [
                                        { $match: { _id: { $ne: ObjectId(appt._id) }, status: 3, parlorId: ObjectId(appt.parlorId) } },
                                        { $sort: { subtotal: -1 } },
                                        { $limit: limit },
                                        { $group: { _id: null, sum: { $sum: "$subtotal" } } },
                                    ]
                                    Appointment.aggregate(query, function(err, sum) {
                                        console.log(JSON.stringify(query))

                                        if (limit > 0) {


                                            var avgBill = sum[0].sum / limit;
                                            console.log("this average of bill ", avgBill)
                                            console.log("this bill amount", appt.subtotal)

                                            if (appt.subtotal > avgBill && appt.subtotal > 800) {
                                                console.log("here")
                                                async.each(appt.employees, function(a, cb) {
                                                    LuckyDrawDynamic.create({

                                                        employeeId: ObjectId(a.employeeId),

                                                        employeeName: a.name,
                                                        role: a.role,

                                                        clientName: appt.client.name,
                                                        billAmount: appt.subtotal,



                                                        parlorId: appt.parlorId,

                                                        appointmentId: appt._id,

                                                        categoryId: 4,

                                                        amount: draw.billValue.amount,

                                                        reason: "Average bill value",

                                                        stringToPrintEmployee: draw.billValue.employeeMessage,
                                                        stringToPrintSalon: draw.billValue.salonMessage,

                                                        status: 1


                                                    }, function(err, done) {
                                                        if (err) {
                                                            console.log(err)
                                                        } else {


                                                            Appointment.count({ status: 3, parlorId: appt.parlorId }, function(err, newCount) {
                                                                var newLimit = (newCount * draw.billValue.value) / 100;
                                                                Appointment.find({ status: 3, parlorId: appt.parlorId }, { subtotal: 1 }, function(err, appointment) {
                                                                    var topBillId = []

                                                                    _.forEach(appointment, function(a) {

                                                                        topBillId.push(a._id)

                                                                    })
                                                                    console.log(avgBill, limit, appt.subtotal, newCount)
                                                                    var avgBillValue = (avgBill * limit + appt.subtotal) / (newCount)
                                                                    console.log("avgBillValue", avgBillValue)
                                                                    Parlor.update({ _id: appt.parlorId }, {
                                                                        topBills: topBillId,
                                                                        avgBillValue: avgBillValue
                                                                    }, function(err, updated) {
                                                                        if (err) {
                                                                            console.log(err)
                                                                        } else {
                                                                            console.log(" Updated")
                                                                            cb();

                                                                        }
                                                                    })

                                                                }).limit(newLimit).sort({ subtotal: -1 })
                                                            })
                                                            console.log(done)
                                                        }
                                                    })

                                                }, function(done) {


                                                    Admin.find({ parlorId: appt.parlorId, role: { $in: [2, 8, 9] }, active: true }, { firstName: 1 }, function(err, admin) {

                                                        if (admin.length > 0) {

                                                            async.each(admin, function(ad, cbs) {
                                                                LuckyDrawDynamic.create({

                                                                    employeeId: ObjectId(ad._id),
                                                                    employeeName: ad.firstName,
                                                                    role: ad.role,

                                                                    clientName: appt.client.name,
                                                                    billAmount: appt.subtotal,

                                                                    parlorId: appt.parlorId,

                                                                    appointmentId: appt._id,

                                                                    categoryId: 4,

                                                                    amount: draw.billValue.amount,

                                                                    reason: "Average bill value",

                                                                    stringToPrintEmployee: draw.billValue.employeeMessage,
                                                                    stringToPrintSalon: draw.billValue.salonMessage,

                                                                    status: 1


                                                                }, function(err, adminDone) {

                                                                    console.log("manager created")
                                                                    LuckyDrawDynamic.notification(ad.firstName, appt.employees, appt.parlorId, appt.subtotal, appt.client.name, draw.billValue.employeeMessage, draw.billValue.salonMessage);
                                                                    cbs();

                                                                })
                                                            }, function(done) {})



                                                        } else {

                                                            LuckyDrawDynamic.notification("", appt.employees, appt.parlorId, appt.subtotal, appt.client.name, draw.billValue.employeeMessage, draw.billValue.salonMessage);


                                                        }


                                                    })

                                                })



                                            }
                                        }

                                    })




                                })
                            })
                        }
                    }
                })
            })
        })


    })
}

luckyDrawSchema.statics.onTransaction = function(apptt) {
    console.log('---------------------------------------------------------------------------------------------')
    console.log("-------------------------On transaction--------------------------------")

    Appointment.findOne({ _id: apptt }, function(err, appt) {
        Appointment.aggregate([{ $match: { parlorId: ObjectId(appt.parlorId), status: 3, appointmentStartTime: { $gte: new Date(HelperService.getLastMonthStart()) } } },
            { $group: { _id: null, serviceRevenue: { $sum: "$serviceRevenue" }, productRevenue: { $sum: "$productRevenue" } } },
            { $project: { revenue: { $add: ["$serviceRevenue", "$productRevenue"] } } }
        ], function(err, totalParlorRevenue) {

            LuckyDrawDynamic.aggregate([{ $match: { status: 0, createdAt: { $gte: new Date(HelperService.getLastMonthStart()) }, status: 0, parlorId: ObjectId(appt.parlorId) } },
                { $group: { _id: null, amount: { $sum: "$amount" } } }
            ], function(err, drawTotal) {
                var drawAmount = 0;
                if (drawTotal.length > 0) {
                    drawAmount += drawTotal[0].amount
                }


                Parlor.findOne({ _id: appt.parlorId }, { createdAt: 1 }, function(err, parlorDate) {
                    if (totalParlorRevenue.length > 0) {
                        var onePercent = totalParlorRevenue[0].revenue * 0.01
                        console.log("total Revenue", totalParlorRevenue[0].revenue)
                        var parlorDatesTemp = new Date(parlorDate.createdAt)
                        var parlorDates = parlorDatesTemp - new Date()
                        var time = (parlorDates) / (1000 * 60 * 60 * 24);
                        if (time <= 30) {

                            if (parlorDate.parlorType == 0) {
                                onePercent = 3000
                            } else if (parlorDate.parlorType == 1) {
                                onePercent = 2000
                            } else {
                                onePercent = 1000
                            }

                        }
                        LuckyDrawModel.findOne({ parlorId: appt.parlorId }, function(err, draw) {
                            if (onePercent > drawAmount) {
                                Appointment.count({ _id: { $ne: appt._id }, parlorId: appt.parlorId, status: 3, appointmentType: 3 }, function(err, result) {
                                    Appointment.count({ _id: { $ne: appt._id }, parlorId: appt.parlorId, status: 3, appointmentType: { $ne: 3 } }, function(err, result1) {
                                        Appointment.count({ parlorId: appt.parlorId, status: 3, appointmentType: 3 }, function(err, result3) {
                                            Appointment.count({ parlorId: appt.parlorId, status: 3, appointmentType: { $ne: 3 } }, function(err, result4) {

                                                console.log("app included", result3)
                                                console.log("salon included", result4)
                                                console.log("app Excluded", result)
                                                console.log("salon Excluded ", result1)


                                                if (result3 - result == 1) {
                                                    var onAppTransaction = result3 % draw.appTransaction.value;
                                                    if (result3 == 0) {
                                                        var onAppTransaction = 1
                                                    }

                                                } else if (result4 - result1 == 1) {
                                                    var onNonAppTransaction = result4 % draw.salonTransaction.value;
                                                    if (result4 == 0) {
                                                        var onNonAppTransaction = 1
                                                    }
                                                } else {
                                                    var onAppTransaction = 1
                                                    var onNonAppTransaction = 1

                                                }

                                                console.log("onAppTransaction", onAppTransaction)
                                                console.log("onNonAppTransaction", onNonAppTransaction)

                                                if (onAppTransaction == 0 || onNonAppTransaction == 0) {
                                                    if (appt.appointmentType == 3) {
                                                        console.log("App Transaction")
                                                        var stringToPrintEmployee = draw.appTransaction.employeeMessage
                                                        var stringToPrintSalon = draw.appTransaction.salonMessage
                                                        var amount = draw.appTransaction.amount
                                                        var reason = "App Transaction"
                                                        var categoryId = 1
                                                    } else {
                                                        console.log("Salon Transaction")
                                                        var stringToPrintEmployee = draw.salonTransaction.employeeMessage
                                                        var stringToPrintSalon = draw.salonTransaction.salonMessage
                                                        var amount = draw.salonTransaction.amount
                                                        var reason = "Salon Transaction"
                                                        var categoryId = 2

                                                    }
                                                    async.each(appt.employees, function(a, cb) {
                                                        Admin.findOne({ _id: a.employeeId }, { firebaseId: 1 }, function(err, empl) {
                                                            LuckyDrawDynamic.create({

                                                                employeeId: ObjectId(a.employeeId),

                                                                employeeName: a.name,

                                                                role: a.role,


                                                                clientName: appt.client.name,

                                                                billAmount: appt.subtotal,



                                                                parlorId: appt.parlorId,

                                                                appointmentId: appt._id,

                                                                categoryId: categoryId,

                                                                amount: amount,

                                                                reason: reason,

                                                                stringToPrintEmployee: stringToPrintEmployee,
                                                                stringToPrintSalon: stringToPrintSalon,

                                                                status: 1


                                                            }, function(err, done) {
                                                                if (err) {
                                                                    console.log(err)
                                                                } else {

                                                                    cb();
                                                                    console.log("-----------------done")
                                                                }
                                                            })
                                                        })

                                                    }, function(done) {
                                                        Admin.find({ parlorId: appt.parlorId, role: { $in: [2, 8, 9] }, active: true }, { firstName: 1 }, function(err, admin) {


                                                            if (admin.length > 0) {
                                                                async.each(admin, function(ad, cbs) {
                                                                    LuckyDrawDynamic.create({

                                                                        employeeId: ObjectId(ad._id),

                                                                        employeeName: ad.firstName,

                                                                        role: ad.role,


                                                                        clientName: appt.client.name,
                                                                        billAmount: appt.subtotal,

                                                                        parlorId: appt.parlorId,

                                                                        appointmentId: appt._id,

                                                                        categoryId: categoryId,

                                                                        amount: amount,

                                                                        reason: reason,

                                                                        stringToPrintEmployee: stringToPrintEmployee,
                                                                        stringToPrintSalon: stringToPrintSalon,

                                                                        status: 1


                                                                    }, function(err, adminDone) {



                                                                        LuckyDrawDynamic.notification(ad.firstName, appt.employees, appt.parlorId, appt.subtotal, appt.client.name, stringToPrintEmployee, stringToPrintSalon);

                                                                        console.log("manager created")
                                                                        cbs();

                                                                    })

                                                                }, function(done) {})



                                                            } else {

                                                                LuckyDrawDynamic.notification(admin.firstName, appt.employees, appt.parlorId, appt.subtotal, appt.client.name, stringToPrintEmployee, stringToPrintSalon);


                                                            }




                                                        })


                                                    })


                                                }


                                                // })
                                            })
                                        })
                                    })
                                })

                            }
                        })
                    }
                })
            })
        })
    })
}



luckyDrawSchema.statics.onSubscription = function(apptt, subscriptionType) {
    console.log("===========================================================>>>>>>>>>>>>onSubscription")
    Appointment.findOne({ _id: apptt }, function(err, appt) {
        var clientId = appt.client.id;
        Appointment.find({ status: 3, "client.id": clientId, loyalitySubscription: { $gt: 0 } }).exec(function(err, appr) {
            SubscriptionSale.findOne({ userId: appr[0].client.id, couponCode:{$ne:"SALON"}}).sort({$natural : -1}).exec(function(err, subs) {
                if (subs && appr.length == 1 && (appr[0]._id).toString() == (apptt).toString()) {
                    
                    if ((new Date(appr[0].createdAt)).getDate() == (new Date(subs.createdAt)).getDate() && !subs.razorPayId.includes('near') && (appr[0].subscriptionReferralCode =='EARLYBIRD' || appr[0].subscriptionReferralCode == null || appr[0].subscriptionReferralCode == '')) {

                        Appointment.aggregate([{ $match: { parlorId: ObjectId(appt.parlorId), status: 3, appointmentStartTime: { $gte: new Date(HelperService.getLastMonthStart()) } } },
                            { $group: { _id: null, serviceRevenue: { $sum: "$serviceRevenue" }, productRevenue: { $sum: "$productRevenue" } } },
                            { $project: { revenue: { $add: ["$serviceRevenue", "$productRevenue"] } } }
                        ], function(err, totalParlorRevenue) {
                            console.log(err)

                            LuckyDrawDynamic.aggregate([{ $match: { status: 0, createdAt: { $gte: new Date(HelperService.getLastMonthStart()) }, parlorId: ObjectId(appt.parlorId) } },
                                { $group: { _id: null, amount: { $sum: "$amount" } } }
                            ], function(err, drawTotal) {
                                console.log(err)

                                var drawAmount = 0;
                                if (drawTotal.length > 0) {
                                    drawAmount += drawTotal[0].amount
                                }
                                Parlor.findOne({ _id: appt.parlorId }, { createdAt: 1, parlorType: 1 }, function(err, parlorDate) {

                                    var parlorDatesTemp = new Date(parlorDate.createdAt)
                                    var parlorDates = new Date() - parlorDatesTemp
                                    var time = Math.round((parlorDates) / (1000 * 60 * 60 * 24));
                                    console.log("Draw total  amount In last 30 days ", drawAmount)
                                    console.log("Parlor total  revenue In last 30 days ", totalParlorRevenue)
                                    if (totalParlorRevenue.length > 0) {
                                        var onePercent = totalParlorRevenue[0].revenue * 0.01
                                        console.log("1% of parloar total revenue in last 30 days", onePercent)
                                        if (time <= 30) {

                                            if (parlorDate.parlorType == 0) {
                                                onePercent = 3000
                                            } else if (parlorDate.parlorType == 1) {
                                                onePercent = 2000
                                            } else {
                                                onePercent = 1000
                                            }

                                        }
                                        if (1) {

                                            LuckyDrawModel.findOne({ parlorId: appt.parlorId }, function(err, draw) {
                                                // console.log("Lucky draw model found for the parlor", draw)
                                                if (subscriptionType == 1) {
                                                    if(appt.subscriptionReferralCode =='EARLYBIRD' )
                                                        var amountToGo = ((draw.subsTransaction[0].amount) / appt.employees.length);
                                                    else 
                                                        var amountToGo = ((draw.subsTransaction[0].amount ) / appt.employees.length);
                                                } else {
                                                    var amountToGo = ((draw.subsTransaction[1].amount) / appt.employees.length);
                                                }
                                                console.log("Subcription typ and amount to given", subscriptionType, amountToGo)
                                                async.each(appt.employees, function(a, cb) {
                                                    Admin.findOne({ _id: ObjectId(a.employeeId) , role: { $nin: [2, 8, 9] } }, { firstName: 1, lastName: 1, role: 1 }, function(err, adm) {

                                                         console.log(amountToGo)
                                                         cb();
                                                        if(adm){
                                                             LuckyDrawDynamic.create({
                                                                 employeeId: ObjectId(a.employeeId),
                                                                 employeeName: adm.firstName + " " + adm.lastName,
                                                                 role: adm.role,
                                                                 billAmount: appt.subtotal,
                                                                 clientName: appt.client.name,
                                                                 parlorId: appt.parlorId,
                                                                 appointmentId: appt._id,
                                                                 categoryId: "13",
                                                                 amount: amountToGo, 
                                                                 reason: "Subscription Sold",
                                                                 stringToPrintEmployee: subscriptionType == 1 ? (draw.subsTransaction[0].employeeMessage).replace("{{amount}}", amountToGo).replace("{{name}}", appt.client.name) : (draw.subsTransaction[1].employeeMessage).replace("{{amount}}", amountToGo).replace("{{name}}", appt.client.name),
                                                                 stringToPrintSalon: subscriptionType == 1 ? draw.subsTransaction[0].salonMessage.replace("{{amount}}", amountToGo).replace("{{name}}", appt.client.name) : draw.subsTransaction[1].salonMessage.replace("{{amount}}", amountToGo).replace("{{name}}", appt.client.name),
                                                                 status: 1
                                                             }, function(err, done) {
                                                                 if (err) {
                                                                     console.log(err)
                                                                 } else {
                                                                     console.log("Employe draw created", adm.firstName)
                                                                    cb();
                                                                 }
                                                             })
                                                        }else{
                                                            cb();
                                                        }
                                                    })

                                                }, function(done) {


                                                    Admin.find({ parlorId: appt.parlorId, role: { $in: [2, 8, 9] }, active: true }, { firstName: 1, lastName: 1, role: 1 }, function(err, admin) {

                                                        if (subscriptionType == 1) {
                                                            var amountToGoManager = Math.round(draw.subsTransaction[0].amount / admin.length);
                                                        } else {
                                                            var amountToGoManager = Math.round(draw.subsTransaction[1].amount / admin.length);
                                                        }

                                                        if (admin.length > 0) {
                                                           
                                                            Parlor.checkIfMonsoonSalon(appt.parlorId , function(checkMonsoon){
                                                                console.log("checkMonsoon" ,checkMonsoon , admin.length)
                                                                if(checkMonsoon == true){
                                                                    if(admin.length>1){
                                                                        amountToGoManager = Math.round(100/admin.length);
                                                                    }else{
                                                                        amountToGoManager = 100;
                                                                    }
                                                                }else amountToGoManager;
                                                                console.log("amountToGoManager" , amountToGoManager)
                                                            async.each(admin, function(ad, cbs) {
                                                                 console.log(amountToGoManager)
                                                                 LuckyDrawDynamic.create({

                                                                     employeeId: ObjectId(ad._id),
                                                                     employeeName: ad.firstName + " " + ad.lastName,
                                                                     role: ad.role,
                                                                     clientName: appt.client.name,
                                                                     billAmount: appt.subtotal,

                                                                     parlorId: appt.parlorId,

                                                                     appointmentId: appt._id,

                                                                     categoryId: "13",

                                                                     amount: amountToGoManager, // divide admin.length

                                                                     reason: "Subscription Sold",

                                                                     stringToPrintEmployee: subscriptionType == 1 ? (draw.subsTransaction[0].employeeMessage).replace("{{amount}}", amountToGoManager).replace("{{name}}", appt.client.name) : (draw.subsTransaction[1].employeeMessage).replace("{{amount}}", amountToGoManager).replace("{{name}}", appt.client.name),
                                                                     stringToPrintSalon: subscriptionType == 1 ? draw.subsTransaction[0].salonMessage.replace("{{amount}}", amountToGoManager).replace("{{name}}", appt.client.name) : draw.subsTransaction[1].salonMessage.replace("{{amount}}", amountToGoManager).replace("{{name}}", appt.client.name),

                                                                     status: 1


                                                                 }, function(err, adminDone) {
                                                                     console.log("manager draw created", ad.firstName)
                                                                     LuckyDrawDynamic.notification(ad.firstName, appt.products, appt.parlorId, appt.subtotal, appt.client.name, draw.retailProduct.employeeMessage, draw.retailProduct.salonMessage);
                                                                    cbs();

                                                                 })
                                                            }, function(done) {

                                                            })
                                                            });
                                                        } else {
                                                            console.log("else")
                                                            LuckyDrawDynamic.notification("", appt.products, appt.parlorId, appt.subtotal, appt.client.name, draw.retailProduct.employeeMessage, draw.retailProduct.salonMessage);

                                                        }
                                                    })
                                                })
                                            })
                                        }
                                    }
                                })

                            })

                        })

                    }
                } else {
                    console.log("In else");
                }
            })
        })

    })

}


luckyDrawSchema.statics.employeeSelection = function(apptt) {
    console.log("===========================================================>>>>>>>>>>>>onEmployeeSelection")
    Appointment.findOne({ _id: apptt, mode: 6 }, function(err, appt) {
        if (appt != null) {


            var clientId = appt.client.id;
            console.log("======================================", clientId)
            console.log("======================================", appt.client.name)

            console.log("============================== Yes this your Employee Section")
            Appointment.aggregate([{ $match: { parlorId: ObjectId(appt.parlorId), status: 3, appointmentStartTime: { $gte: new Date(HelperService.getLastMonthStart()) } } },
                { $group: { _id: null, serviceRevenue: { $sum: "$serviceRevenue" }, productRevenue: { $sum: "$productRevenue" } } },
                { $project: { revenue: { $add: ["$serviceRevenue", "$productRevenue"] } } }
            ], function(err, totalParlorRevenue) {
                console.log(err)

                LuckyDrawDynamic.aggregate([{ $match: { status: 0, createdAt: { $gte: new Date(HelperService.getLastMonthStart()) }, parlorId: ObjectId(appt.parlorId) } },
                    { $group: { _id: null, amount: { $sum: "$amount" } } }
                ], function(err, drawTotal) {
                    console.log(err)

                    var drawAmount = 0;
                    if (drawTotal.length > 0) {
                        drawAmount += drawTotal[0].amount
                    }
                    Parlor.findOne({ _id: appt.parlorId }, { createdAt: 1, parlorType: 1 }, function(err, parlorDate) {

                        var parlorDatesTemp = new Date(parlorDate.createdAt)
                        var parlorDates = new Date() - parlorDatesTemp
                        var time = Math.round((parlorDates) / (1000 * 60 * 60 * 24));
                        console.log("Draw total  amount In last 30 days ", drawAmount)
                        console.log("Parlor total  revenue In last 30 days ", totalParlorRevenue)
                        if (totalParlorRevenue.length > 0) {
                            var onePercent = totalParlorRevenue[0].revenue * 0.01
                            console.log("1% of parloar total revenue in last 30 days", onePercent)
                            if (time <= 30) {

                                if (parlorDate.parlorType == 0) {
                                    onePercent = 3000
                                } else if (parlorDate.parlorType == 1) {
                                    onePercent = 2000
                                } else {
                                    onePercent = 1000
                                }

                            }
                            if (onePercent > drawAmount) {
                                LuckyDrawModel.findOne({ parlorId: appt.parlorId }, function(err, draw) {
                                    console.log("Lucky draw model found for the parlor", draw)

                                    async.each(appt.employees, function(a, cb) {
                                        Admin.findOne({ _id: ObjectId(a.employeeId) }, { firstName: 1, lastName: 1, role: 1 }, function(err, adm) {
                                            // console.log(amountToGo)
                                            // cb();
                                            LuckyDrawDynamic.create({
                                                employeeId: ObjectId(a.employeeId),
                                                employeeName: adm.firstName + " " + adm.lastName,
                                                role: adm.role,
                                                billAmount: appt.subtotal,
                                                clientName: appt.client.name,
                                                parlorId: appt.parlorId,
                                                appointmentId: appt._id,
                                                categoryId: 15,
                                                amount: draw.employeeSection.amount, // divive employee length
                                                reason: "Employee Section",
                                                stringToPrintEmployee: draw.employeeSection.employeeMessage,
                                                stringToPrintSalon: draw.employeeSection.salonMessage,
                                                status: 1
                                            }, function(err, done) {
                                                if (err) {
                                                    console.log(err)
                                                } else {
                                                    console.log("Employe draw created", adm.firstName)
                                                    cb();
                                                }
                                            })
                                        })

                                    }, function(done) {


                                        Admin.find({ parlorId: appt.parlorId, role: { $in: [2, 8, 9] }, active: true }, { firstName: 1, lastName: 1, role: 1 }, function(err, admin) {

                                            if (admin.length > 0) {
                                                // async.each(admin, function(ad, cbs) {
                                                //     // console.log(amountToGoManager)
                                                //     LuckyDrawDynamic.create({

                                                //         employeeId: ObjectId(ad._id),
                                                //         employeeName: ad.firstName + " " + adm.lastName,

                                                //         role: ad.role,
                                                //         clientName: appt.client.name,
                                                //         billAmount: appt.subtotal,

                                                //         parlorId: appt.parlorId,

                                                //         appointmentId: appt._id,

                                                //         categoryId: 15,

                                                //         amount: draw.employeeSection.amount, // divide admin.length

                                                //         reason: "Employee Section",

                                                //         stringToPrintEmployee: draw.employeeSection.employeeMessage,
                                                //         stringToPrintSalon: draw.employeeSection.salonMessage,
                                                //         status: 1
                                                //     }, function(err, adminDone) {
                                                //         console.log("manager draw created", ad.firstName)
                                                //         LuckyDrawDynamic.notification(ad.firstName, appt.employees, appt.parlorId, appt.subtotal, appt.client.name, draw.employeeSection.employeeMessage, draw.employeeSection.salonMessage);
                                                //         cbs();

                                                //     })
                                                // }, function(done) {



                                                // })


                                            } else {

                                                LuckyDrawDynamic.notification("", appt.employees, appt.parlorId, appt.subtotal, appt.client.name, draw.retailProduct.employeeMessage, draw.retailProduct.salonMessage);


                                            }





                                        })

                                    })


                                })

                            }

                        }
                    })

                })

            })

        }
    })

};


luckyDrawSchema.statics.billingApp = function(apptt) {
    console.log("===========================================================>>>>>>>>>>>>onEmployeeSelection")
    Appointment.findOne({ _id: apptt }, function(err, appt) {
        if (appt != null) {


            var clientId = appt.client.id;
            console.log("======================================", clientId)
            console.log("======================================", appt.client.name)

            console.log("============================== Yes this your Employee Section")
            Appointment.aggregate([{ $match: { parlorId: ObjectId(appt.parlorId), status: 3, appointmentStartTime: { $gte: new Date(HelperService.getLastMonthStart()) } } },
                { $group: { _id: null, serviceRevenue: { $sum: "$serviceRevenue" }, productRevenue: { $sum: "$productRevenue" } } },
                { $project: { revenue: { $add: ["$serviceRevenue", "$productRevenue"] } } }
            ], function(err, totalParlorRevenue) {
                console.log(err)

                LuckyDrawDynamic.aggregate([{ $match: { status: 0, createdAt: { $gte: new Date(HelperService.getLastMonthStart()) }, parlorId: ObjectId(appt.parlorId) } },
                    { $group: { _id: null, amount: { $sum: "$amount" } } }
                ], function(err, drawTotal) {
                    console.log(err)

                    var drawAmount = 0;
                    if (drawTotal.length > 0) {
                        drawAmount += drawTotal[0].amount
                    }
                    Parlor.findOne({ _id: appt.parlorId }, { createdAt: 1, parlorType: 1 }, function(err, parlorDate) {

                        var parlorDatesTemp = new Date(parlorDate.createdAt)
                        var parlorDates = new Date() - parlorDatesTemp
                        var time = Math.round((parlorDates) / (1000 * 60 * 60 * 24));
                        console.log("Draw total  amount In last 30 days ", drawAmount)
                        console.log("Parlor total  revenue In last 30 days ", totalParlorRevenue)
                        if (totalParlorRevenue.length > 0) {
                            var onePercent = totalParlorRevenue[0].revenue * 0.01
                            console.log("1% of parloar total revenue in last 30 days", onePercent)
                            if (time <= 30) {

                                if (parlorDate.parlorType == 0) {
                                    onePercent = 3000
                                } else if (parlorDate.parlorType == 1) {
                                    onePercent = 2000
                                } else {
                                    onePercent = 1000
                                }

                            }
                            if (onePercent > drawAmount) {
                                LuckyDrawModel.findOne({ parlorId: appt.parlorId }, function(err, draw) {
                                    console.log("Lucky draw model found for the parlor", draw)

                                    Admin.find({ parlorId: appt.parlorId, role: { $in: [2, 8, 9] }, active: true }, { firstName: 1, lastName: 1, role: 1 }, function(err, admin) {

                                        if (admin.length > 0) {
                                            async.each(admin, function(ad, cbs) {
                                                // console.log(amountToGoManager)
                                                LuckyDrawDynamic.create({

                                                    employeeId: ObjectId(ad._id),
                                                    employeeName: ad.firstName + " " + adm.lastName,

                                                    role: ad.role,
                                                    clientName: appt.client.name,
                                                    billAmount: appt.subtotal,

                                                    parlorId: appt.parlorId,

                                                    appointmentId: appt._id,

                                                    categoryId: 16,

                                                    amount: draw.employeeSection.amount, // divide admin.length

                                                    reason: "Billing App",

                                                    stringToPrintEmployee: draw.employeeSection.employeeMessage,
                                                    stringToPrintSalon: draw.employeeSection.salonMessage,
                                                    status: 1
                                                }, function(err, adminDone) {
                                                    console.log("manager draw created", ad.firstName)
                                                    LuckyDrawDynamic.notification(ad.firstName, appt.employees, appt.parlorId, appt.subtotal, appt.client.name, draw.employeeSection.employeeMessage, draw.employeeSection.salonMessage);
                                                    cbs();

                                                })
                                            }, function(done) {



                                            })


                                        } else {

                                            LuckyDrawDynamic.notification("", appt.employees, appt.parlorId, appt.subtotal, appt.client.name, draw.retailProduct.employeeMessage, draw.retailProduct.salonMessage);


                                        }





                                    })




                                })

                            }

                        }
                    })

                })

            })

        }
    })

}





luckyDrawSchema.statics.notification = function(manager, ids, parlorId, amount, client, stringToPrintEmployee, stringToPrintSalon) {

    var notEqual = [];
    var allnames = [];
    _.forEach(ids, function(e) {
        notEqual.push(e.employeeId)
        allnames.push(e.name)
        var title = 'Employee Lucky Draw';
        var body = stringToPrintEmployee + " " + client + "of Rs." + amount
        var type = 'luckyDraw';
        Admin.findOne({ _id: e.employeeId }, { firebaseId: 1, firstName: 1, firebaseIdIOS :1 }, function(err, eId) {
            console.log("---------------------singl-----------------", eId)
            if(eId.firebaseId){
                ParlorService.sendIonicNotification2(eId.firebaseId, title, body, type, "luckyDraw", function() {

                })
            }
            if(eId.firebaseIdIOS){
                ParlorService.sendIOSNotificationOnEmployeeApp(eId.firebaseIdIOS, title, body, type, function() {

                })
            }

        })
    })

    console.log("nottttttttttttttttttt", notEqual)

    Admin.find({ _id: { $nin: notEqual }, parlorId: parlorId, active: true }, { firebaseId: 1, firebaseIdIOS:1 }, function(err, otherEmployees) {
        console.log("otherEmployees", otherEmployees)
        var title2 = 'Employee Lucky Draw';
        var body2 = manager + "," + allnames + stringToPrintSalon + " " + client + "of Rs." + amount
        var type2 = 'luckyDraw';
        async.each(otherEmployees, function(e, cb) {
            if(e.firebaseId){
                ParlorService.sendIonicNotification2(e.firebaseId, title2, body2, type2, "luckyDraw", function() {
                    cb();
                })
            }
            if(e.firebaseIdIOS){
                ParlorService.sendIOSNotificationOnEmployeeApp(e.firebaseIdIOS, title2, body2, type2, function() {
                    cb();
                })
            }

        })

    })


}
luckyDrawSchema.statics.employeeIncentiveReport = function(employee, startDate, endDate, callback) {
    var data = {
        employeeId: employee.id,
        name: employee.firstName + " " + employee.lastName,
        position: employee.position,
        totalRevenueEmp: 0,
        empSalary: employee.salary,
        parlorName: "",
        parlorAddress: "",
        totalAppointments: 0,
        product: {
            productNo: 0,
            productRevenue: 0
        },
        totalProductRevenueEmp: 0,
        parlorId: employee.parlorId,
        dep: []
    };
    var parlorId = employee.parlorId;
    Parlor.findOne({ _id: parlorId }, { name: 1, address2: 1, parlorType: 1 }, function(err, parlor) {
        // console.log("name" +parlor.name)
        if (parlor) {
            data.parlorAddress = parlor.address2;
            data.parlorName = parlor.name;
        }
        ServiceCategory.find({}).sort({ sort: 1 }).exec(function(err, categories) {
            _.forEach(categories, function(c) {
                data.dep.push({
                    unit: c.name,
                    unitId: c.id,
                    serviceNo: 0,
                    totalRevenue: 0,
                    totalIncentive: 0,
                    id: ''
                });
            });
            Appointment.find({
                parlorId: parlorId,
                "services.employees.employeeId": employee.id,
                status: 3,
                appointmentStartTime: { $gte: HelperService.getDayStart(startDate), $lt: HelperService.getDayEnd(endDate) }
            }, function(err, appointments) {
                Appointment.find({
                    parlorId: parlorId,
                    $where: "this.products.length>0",
                    status: 3,
                    appointmentStartTime: { $gte: HelperService.getDayStart(startDate), $lt: HelperService.getDayEnd(endDate) }
                }, function(err, productAppoint) {
                    _.forEach(productAppoint, function(prdApp) {
                        _.forEach(prdApp.products, function(prd) {
                            if (prd.employeeId == employee.id) {
                                _.forEach(data.product, function(product) {
                                    product.productNo += prd.quantity;
                                    product.productRevenue += (prd.price * prd.quantity);
                                    data.totalProductRevenueEmp += (prd.price * prd.quantity);
                                });
                            }
                        });
                    })
                    Incentive.find({}, function(err, incentive) {
                        // console.log(incentive)
                        data.totalAppointments = appointments.length;
                        _.forEach(appointments, function(appointment) {
                            _.forEach(appointment.services, function(ser) {
                                var category = categories.filter(function(el) {
                                    return el.id == ser.categoryId;
                                })[0];
                                _.forEach(data.dep, function(report) {
                                    if (report.unit == category.name) {
                                        report.serviceNo += ser.quantity;
                                        var empObj = [{
                                            employeeId: "" + employee.id,
                                            totalRevenueEmp: 0
                                        }];
                                        var serviceRevenue = Appointment.serviceFunction(report.createdAt, ser, empObj);
                                        report.totalRevenue += serviceRevenue.employees[0].totalRevenueEmp;
                                        data.totalRevenueEmp += serviceRevenue.employees[0].totalRevenueEmp;
                                        var incentiveRevenue = LuckyDrawDynamic.incentiveFunction(incentive, ser, employee, report, parlor.parlorType);
                                        report.totalIncentive = incentiveRevenue.totalIncentive;
                                        report.id = incentiveRevenue.id;
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


luckyDrawSchema.statics.incentiveFunction = function(incentive, ser, empl, report, parlorType) {
    var totalIncentive = 0,
        productIncentive = 0,
        id = '';
    _.forEach(incentive, function(inc) {
        _.forEach(inc.parlors, function(par) {
            if (par.parlorType == parlorType) {
                if (report.unitId == inc.categoryId) {
                    _.forEach(par.incentives, function(incentive) {
                        console.log("-")
                        if (report.totalRevenue >= incentive.range) {
                            console.log("incentive", incentive)
                            totalIncentive = incentive.incentive;
                            id = incentive._id;
                        } else {

                        }
                    })
                }
            }
        });
    });

    return { totalIncentive: totalIncentive, id: id };
};



luckyDrawSchema.statics.sendLuckyDrawSchedular = function(query){
    var Razorpay = require('razorpay');
   var RAZORPAY_KEY = localVar.getRazorKey();
    var RAZORPAY_APP_SECRET = localVar.getRazorAppSecret();
    var instance = new Razorpay({
        key_id: RAZORPAY_KEY,
        key_secret: RAZORPAY_APP_SECRET
    });
    LuckyDrawDynamic.find(query , function(err , luckyEmp){

        var d = [];
        async.each(luckyEmp, function(le , call){

            Admin.findOne({_id: le.employeeId },{razorPayAccountId :1, firstName:1 , phoneNumber:1 , firebaseId:1 ,  emailId:1, firebaseIdIOS :1}, function(err , employees){
            if(employees && employees.razorPayAccountId){
                    // if(employees.razorPayAccountId){
                          var data = {};
                          data.account = employees.razorPayAccountId;
                          // data.account = "acc_AiY3S8XX3YC8kz"; //test
                          data.amount = Math.round(le.amount) *100;
                          // data.amount = 100; //test
                          data.currency = "INR";
                          console.log(data)
                         
                          instance.transfers.create(data, function(error, response) {
                            if(response){
                                LuckyDrawDynamic.update({ _id : le.id}, {transferObj : response , status : 2 , updatedAt : new Date()}, function(err , update){

                                    if(!error){

                                        let message = "Hi, "+employees.firstName+" your lucky draw of Rs "+le.amount+" has been initiated from Be U."
                                        // ParlorService.sendLuckyDrawNotification(employees.firebaseId, 'Lucky Draw Processed', message, 'luckyDraw')
                                        console.log("notifi" , message)
                                        if(employees.firebaseId){
                                            ParlorService.sendIonicNotification2(employees.firebaseId, 'Lucky Draw Initiated', message, "luckyDraw", "luckyDraw" , function() {
                                                call();
                                            })
                                        } if(employees.firebaseIdIOS){
                                            ParlorService.sendIOSNotificationOnEmployeeApp(employees.firebaseIdIOS, 'Lucky Draw Initiated', message, "luckyDraw" , function() {
                                                call();
                                            })
                                        }
                                    }
                                    else{
                                        call();
                                    }
                                })
                            }else{
                                call();
                            }
                            
                        });
                    
                  }else{
                    LuckyDrawDynamic.update({_id: le.id} , {status : 5}, function(err, update){
                        Admin.findOne({_id: le.employeeId}, {phoneNumber:1, firstName:1}, function(err, employee){
                            let message =  "Hi, "+employees.firstName+" your lucky draw of Rs "+le.amount+" is waiting. Please add your account details to avail it."

                            Appointment.msg91Sms(employee.phoneNumber, message, function(e) {
                                
                            })
                             call();
                        })
                    })
                    
                  }
            })
        }, function c(){

            return(d)
        })
    });
}



luckyDrawSchema.statics.onNonSubscriberAppTransaction = function(startDate , endDate){
    Appointment.aggregate([
        {
            $match : {
                status : 3,
                appointmentStartTime : {$gte :startDate, $lte : endDate},
                'client.subscriptionLoyality' :0,
                'loyalitySubscription' :  0,
                appointmentType: 3
            },
        },
        {
            $project : {
                employees :1,
                parlorId:1 
            }
        },
        {
            $unwind : "$employees"
        },
        {
            $group: {
                _id: "$employees.employeeId" , 
                count:{$sum:1}, 
                employeeName: {$first : "$employees.name"},
                parlorId: {$first : "$parlorId"}
            }
        },
        // {
        //     $match : {count:{$gte:5 }}
        // }   
        ], function(err , appts){
        async.each(appts , function(app , callback){
            if(app){
                createLuckyDrawForNonSubs(app._id , app.parlorId, app.count , function(c){
                    callback();
                });
            } else 
                callback();
        }, function all(){
            console.log("done")
            // return c('done')
        })
    })
}


function createLuckyDrawForNonSubs(employeeId , parlorId , count, cb){
     var aData = [];
    LuckyDrawModel.findOne({ parlorId: parlorId }, function(err, draw) {

        Admin.findOne({ _id: employeeId }, function(err, emp) {

            var createObj = {
                employeeId: ObjectId(employeeId),
                employeeName: emp.firstName,
                role: emp.role,
                parlorId: parlorId,
                categoryId: "18",
                amount: 0,
                reason: "Non-Subscriber App Transaction",
                stringToPrintEmployee: "",
                stringToPrintSalon: "",
                status: 1
            }

            async.each(draw.nonSubsAppTransaction , function(d, callb){
                if(count >= d.lowerLimit && count < d.upperLimit){
                    createObj.amount = d.amount;
                    createObj.stringToPrintEmployee = d.employeeMessage;
                    createObj.stringToPrintSalon = d.salonMessage;
                    LuckyDrawDynamic.create(createObj ,function(err, done) {

                    let message = "Hi, "+emp.firstName+" your lucky draw of Rs "+d.amount+" has been generated. Please claim it within 24 hours."
                        // ParlorService.sendLuckyDrawNotification(emp.firebaseId, , message, 'luckyDraw')
                        if(emp.firebaseId){
                            ParlorService.sendIonicNotification2(emp.firebaseId, 'Lucky Draw Generated', message, "luckyDraw", "luckyDraw", function(){

                                aData.push(createObj)
                                callb(aData);
                            }) 
                        } if(emp.firebaseIdIOS){
                            ParlorService.sendIOSNotificationOnEmployeeApp(emp.firebaseId, 'Lucky Draw Generated', message, "luckyDraw", function(){

                                aData.push(createObj)
                                callb(aData);
                            })
                        }
                    })
                 } else
                    callb();

            }, function taskComplete(){
                cb();
            })
             
        })
    })
}


luckyDrawSchema.statics.luckyDrawOnFacial = function(startDate , endDate){
    Appointment.aggregate([
        {
            $match : {
                status : 3,
                appointmentStartTime : {$gte : startDate, $lte : endDate},
                
            },
        },
        {$project : {parlorId:1, services:1}},
        {$unwind: "$services"},
        {$match :{'services.serviceCode' :{$in : [775,776,777,778,779,780,781,782,783,784,785,786,787,788,789,790,791,792,694,699,704,709,724,729]}}},
       
        {$unwind : "$services.employees"},
        {$group: {_id: "$services.employees.employeeId" , count:{$sum:1},
        employeeName: {$first : "$services.employees.name"},
        employeeId: {$first : "$services.employees.employeeId"},
        parlorId: {$first : "$parlorId"}
        }}
    ], function(err , appts){
        async.each(appts , function(app , callback){
            if(app){
                LuckyDrawModel.findOne({ parlorId: app.parlorId }, function(err, draw) {

                    Admin.findOne({ _id: app.employeeId }, function(err, emp) {

                        var createObj = {
                            employeeId: ObjectId(emp.employeeId),
                            employeeName: emp.firstName,
                            role: emp.role,
                            parlorId: app.parlorId,
                            categoryId: "19",
                            amount: draw.amount * app.count,
                            reason: "Skin Co Services",
                            stringToPrintEmployee: draw.employeeMessage,
                            stringToPrintSalon: draw.salonMessage,
                            status: 1
                        }
                        LuckyDrawDynamic.create(createObj ,function(err, done) {

                        let message= "Hi, "+emp.firstName+" your lucky draw of Rs "+createObj.amount+" has been generated. Please claim it within 24 hours."
                            if(emp.firebaseId){
                                ParlorService.sendIonicNotification2(emp.firebaseId, 'Lucky Draw Generated', message, "luckyDraw", "luckyDraw", function(){
                                        // aData.push(createObj)
                                        callback();
                                })
                            }
                            if(emp.firebaseIdIOS){
                                ParlorService.sendIOSNotificationOnEmployeeApp(emp.firebaseIdIOS, 'Lucky Draw Generated', message, "luckyDraw", function(){
                                    // aData.push(createObj)
                                    callback();
                                })
                            }
                        })
                             
                    })
                })
            } else 
                callback();
        }, function all(){
            console.log("done")
        })
    })
}



luckyDrawSchema.statics.paytmRefund = function(orderId , payeePhoneNumber, amount , callback){
        var checksum = require('../service/paytm/checksum');
        var samarray = new Array();
        samarray = {"request": {
                        "requestType":"NULL",
                        "merchantGuid": MERCHANT_GUID,
                        "merchantOrderId": orderId,
                        "salesWalletGuid": "bb904240-222e-44d1-a6f4-4de98b18986f",
                        "payeePhoneNumber": payeePhoneNumber,
                        "payeeSsoId":"",
                        "appliedToNewUsers":"Y",
                        "amount": amount,
                        "currencyCode":"INR"
                        },
                    "metadata":"Testing Data",
                    "ipAddress":"192.168.1.100",
                    "platformName":"PayTM",
                    "operationType":"SALES_TO_USER_CREDIT"
                }

        var finalstring = JSON.stringify(samarray);
        console.log(finalstring);
         checksum.genchecksumbystring(finalstring, PAYTM_MERCHANT_KEY, function (err, result) 
        {
        request({
        url: 'https://trust-uat.paytm.in/wallet-web/salesToUserCredit', //URL to hit
        method: 'POST',
        headers: {
                'Content-Type': 'application/json',
                 'mid': MERCHANT_GUID,
                 //'merchantGuid':'2c737363-68c3-48c4-b952-997bc758898b',
                 'checksumhash':result
                 },
                
        body: finalstring//Set the body as a string
        }, 
        
        function(error, response, body){
            if(error) {
                console.log(error);
            } else {
                console.log(response.statusCode, body);
                   res.send(body);
            }
        });
           
    });
}


luckyDrawSchema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();
    // change the updated_at field to current date
    this.updatedAt = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.createdAt)
        this.createdAt = currentDate;

    next();
});

var LuckyDrawDynamic = mongoose.model('luckyDrawDynamic', luckyDrawSchema);

module.exports = LuckyDrawDynamic;