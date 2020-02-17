    /**
    * Created by ginger on 5/30/2017.
    */

    'use strict'

    var express = require('express');
    var router = express.Router();
    var mongoose = require('mongoose');
    var multer = require('multer');
    var xlstojson = require("xls-to-json-lc");
    var xlsxtojson = require("xlsx-to-json-lc");
    var ObjectId = mongoose.Types.ObjectId;
    var async = require('async');
    var moment = require('moment');


    function getMonthName(number) {
    var num = number - 1
    // ADD MONTHS IN AN ARRAY.
    var months = new Array('January', 'February', 'March',
        'April', 'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December');

    return months[num];
    }

    function getDayName(number) {
    var num = number - 1
    // ADD MONTHS IN AN ARRAY.
    var Day = new Array('Monday', 'Tuesday', 'Wednesday',
        'Thursday', 'Friday', 'Saturday', 'Sunday');

    return Day[num];
    }

    function getWeekName(number) {

        var num=number-1;
    var startOfWeek = moment('2017').startOf('weeks').add(num, 'weeks').format('MMMM-DD-YYYY');
    var endOfWeek = moment('2017').endOf('weeks').add(num, 'weeks').format('MMMM-DD-YYYY');
    // ADD MONTHS IN AN ARRAY.


    return startOfWeek + '-' + endOfWeek;
    }


    function getTimeName(number) {
    var num = number
    // ADD Time IN AN ARRAY.
    var Time = new Array(
        '12AM-1AM',
        '1AM-2AM',
        '2AM-3AM',
        '3AM-4AM',
        '4AM-5AM',
        '5AM-6AM',
        '6AM-7AM',
        '7AM-8AM',
        '9AM-10AM',
        '10AM-11AM',
        '11AM-12PM',
        '12PM-1PM',
        '1PM-2PM',
        '2PM-3PM',
        '3PM-4PM',
        '4PM-5PM',
        '5PM-6PM',
        '6AM-7PM',
        '7PM-8PM',
        '8PM-9PM',
        '9PM-10PM',
        '10PM-11PM',
        '11PM-12AM'
    );

    return Time[num];
    }



    function parlorName(id) {

    var array=[/* 1 */

        {_id:"0W",name:getWeekName(parseInt(id))},
        {_id:"1W",name:getWeekName(parseInt(id))},
        {_id:"2W",name:getWeekName(parseInt(id))},
        {_id:"3W",name:getWeekName(parseInt(id))},
        {_id:"4W",name:getWeekName(parseInt(id))},
        {_id:"5W",name:getWeekName(parseInt(id))},
        {_id:"6W",name:getWeekName(parseInt(id))},
        {_id:"7W",name:getWeekName(parseInt(id))},
        {_id:"8W",name:getWeekName(parseInt(id))},
        {_id:"9W",name:getWeekName(parseInt(id))},
        {_id:"10W",name:getWeekName(parseInt(id))},
        {_id:"11W",name:getWeekName(parseInt(id))},
        {_id:"12W",name:getWeekName(parseInt(id))},
        {_id:"13W",name:getWeekName(parseInt(id))},
        {_id:"14W",name:getWeekName(parseInt(id))},
        {_id:"15W",name:getWeekName(parseInt(id))},
        {_id:"16W",name:getWeekName(parseInt(id))},
        {_id:"17W",name:getWeekName(parseInt(id))},
        {_id:"18W",name:getWeekName(parseInt(id))},
        {_id:"19W",name:getWeekName(parseInt(id))},
        {_id:"20W",name:getWeekName(parseInt(id))},
        {_id:"21W",name:getWeekName(parseInt(id))},
        {_id:"22W",name:getWeekName(parseInt(id))},
        {_id:"23W",name:getWeekName(parseInt(id))},
        {_id:"24W",name:getWeekName(parseInt(id))},
        {_id:"25W",name:getWeekName(parseInt(id))},
        {_id:"26W",name:getWeekName(parseInt(id))},
        {_id:"27W",name:getWeekName(parseInt(id))},
        {_id:"28W",name:getWeekName(parseInt(id))},
        {_id:"29W",name:getWeekName(parseInt(id))},
        {_id:"30W",name:getWeekName(parseInt(id))},
        {_id:"31W",name:getWeekName(parseInt(id))},
        {_id:"32W",name:getWeekName(parseInt(id))},
        {_id:"33W",name:getWeekName(parseInt(id))},
        {_id:"34W",name:getWeekName(parseInt(id))},
        {_id:"35W",name:getWeekName(parseInt(id))},
        {_id:"36W",name:getWeekName(parseInt(id))},
        {_id:"37W",name:getWeekName(parseInt(id))},
        {_id:"38W",name:getWeekName(parseInt(id))},
        {_id:"39W",name:getWeekName(parseInt(id))},
        {_id:"40W",name:getWeekName(parseInt(id))},
        {_id:"41W",name:getWeekName(parseInt(id))},
        {_id:"42W",name:getWeekName(parseInt(id))},
        {_id:"43W",name:getWeekName(parseInt(id))},
        {_id:"44W",name:getWeekName(parseInt(id))},
        {_id:"45W",name:getWeekName(parseInt(id))},
        {_id:"46W",name:getWeekName(parseInt(id))},
        {_id:"47W",name:getWeekName(parseInt(id))},
        {_id:"48W",name:getWeekName(parseInt(id))},
        {_id:"49W",name:getWeekName(parseInt(id))},
        {_id:"50W",name:getWeekName(parseInt(id))},
        {_id:"51W",name:getWeekName(parseInt(id))},
        {_id:"52W",name:getWeekName(parseInt(id))},
        {_id:"53W",name:getWeekName(parseInt(id))},




        {_id:"0H",name:'12AM-1AM'},
        {_id:"1H",name:'1AM-2AM'},
        {_id:"2H",name:'2AM-3AM'},
        {_id:"3H",name:'3AM-4AM'},
        {_id:"4H",name:'4AM-5AM'},
        {_id:"5H",name:'5AM-6AM'},
        {_id:"6H",name:'6AM-7AM'},
        {_id:"7H",name:'7AM-8AM'},
        {_id:"8H",name:'8AM-9AM'},
        {_id:"9H",name:'9AM-10AM'},
        {_id:"10H",name:'10AM-11AM'},
        {_id:"11H",name:'11AM-12PM'},
        {_id:"12H",name:'12PM-1PM'},
        {_id:"13H",name:'1PM-2PM'},
        {_id:"14H",name:'2PM-3PM'},
        {_id:"15H",name:'3PM-4PM'},
        {_id:"16H",name:'4PM-5PM'},
        {_id:"17H",name:'5PM-6PM'},
        {_id:"18H",name:'6PM-7PM'},
        {_id:"19H",name:'7PM-8PM'},
        {_id:"20H",name:'8PM-9PM'},
        {_id:"21",name:'9PM-10PM'},
        {_id:"22",name:'10PM-11PM'},
        {_id:"23",name:'11PM-12PM'},



        {'_id':"1Day",'name':'Monday'},
        {'_id':"2Day",'name':'Tuesday'},
        {'_id':"3Day",'name':'Wednesday'},
        {'_id':"4Day",'name':'Thursday'},
        {'_id':"5Day",'name':'Friday'},
        {'_id':"6Day",'name':'Satrday'}
        ,{'_id':"7Day",'name':'Sunday'},

        {'_id':1,'name':'January'},
        {'_id':2,'name':'February'},
        {'_id':3,'name':'March'},
        {'_id':4,'name':'April'},
        {'_id':5,'name':'May'},
        {'_id':6,'name':'June'}
        ,{'_id':7,'name':'July'}
        ,{'_id':8,'name':'August'}
        ,{'_id':9,'name':'September'}
        ,{'_id':10,'name':'October'},
        {'_id':11,'name':'November'},
        {'_id':12,'name':'December'},
        /* 1 */
        {
          "_id":"1Pay",
          "name":"Cash"
        },{
          "_id":"2Pay",
          "name":"Card"
        },{
          "_id":"3Pay",
          "name":"Advance"
        },{
          "_id":"4Pay",
          "name":"Advance Online"
        },{
          "_id":"5Pay",
          "name":"RazorPay"
        },{
          "_id":"6Pay",
          "name":"Paytm"
        },{
          "_id":"12Pay",
          "name":"Multiple"
        },{
          "_id":"13Pay",
          "name":"NearBuy"
        },{
          "_id":"11Pay",
          "name":"NearBuy"
        },{
          "_id":"10Pay",
          "name":"Be U"
        },

        {
            "_id" : "58707ed90901cc46c44af26c",
            "name" : "Makeup"
        },

        /* 2 */
        {
            "_id" : "58707ed90901cc46c44af26d",
            "name" : "Nail"
        },

        /* 3 */
        {
            "_id" : "58707ed90901cc46c44af26e",
            "name" : "Beauty"
        },

        /* 4 */
        {
            "_id" : "58707ed90901cc46c44af26f",
            "name" : "Hair"
        },

        /* 5 */
        {
            "_id" : "58707ed90901cc46c44af270",
            "name" : "Spa"
        },

        /* 6 */
        {
            "_id" : "58707ed90901cc46c44af271",
            "name" : "Hand & Feet"
        },
        /* 1 */
        {
            "_id" : "587088445c63a33c0af62727",
            "name" : "Aalenes"
        },

        /* 2 */
        {
            "_id" : "588338df51cbc72b34ddba2e",
            "name" : "Head Mistress"
        },

        /* 3 */
        {
            "_id" : "58847c934a1a8735093f1b7e",
            "name" : "The Infusion"
        },

        /* 4 */
        {
            "_id" : "588a0cc3f8169604955dce8d",
            "name" : "Kabi"
        },

        /* 5 */
        {
            "_id" : ObjectId("588998adf8169604955dcd3b"),
            "name" : "Zrika"
        },
        /* 6 */
        {
            "_id" : "58a2f5e13443ec15576228fe",
            "name" : "Master's of Makeovers"
        },

        /* 7 */
        {
            "_id" : "58ca7349def56f322e3f8eae",
            "name" : "Head Housse"
        },

        /* 8 */
        {
            "_id" : "58cb9545cfd3553fa1d0dc68",
            "name" : "Glam Impression"
        },

        /* 9 */
        {
            "_id" : "58de627b81222258641d251f",
            "name" : "The Salon By Ela"
        },

        /* 10 */
        {
            "_id" : "58ded4eb57a5140f302bb4d8",
            "name" : "Layba Salon N Spa"
        },

        /* 11 */
        {
            "_id" : "58ded8be57a5140f302bb555",
            "name" : "Kabi"
        },

        /* 12 */
        {
            "_id" : "58e090ddb81c313ad0c84bba",
            "name" : "Silk N Shine"
        },

        /* 13 */
        {
            "_id" : "58e09a57b81c313ad0c85275",
            "name" : "Manju's Salon"
        },

        /* 14 */
        {
            "_id" : "58e4b018c0d6ca73d3be53f3",
            "name" : "Allure"
        },

        /* 15 */
        {
            "_id" : "58e727cf14328a4b2f3b637c",
            "name" : "Style Code"
        },

        /* 16 */
        {
            "_id" :"58eb783534b17264d444c5df",
            "name" : "Mams"
        },

        /* 17 */
        {
            "_id" : "58ec79be34b17264d444ce22",
            "name" : "Raqs"
        },

        /* 18 */
        {
            "_id" : "58ecc85cce692377f31cf20e",
            "name" : "Brij Kohli Makeovers"
        },

        /* 19 */
        {
            "_id" : "58ede43f50c75b606ccb3062",
            "name" : "Glow Up Studio"
        },

        /* 20 */
        {
            "_id" : "58f1caa2f8bfed2d55a6146b",
            "name" : "Y Studio"
        },

        /* 21 */
        {
            "_id" : "58fdb21486377a619caa18bb",
            "name" : "Siddharth"
        },

        /* 22 */
        {
            "_id" :"590468e49a02b04d81ac0a35",
            "name" : "Gr8"
        },

        /* 23 */
        {
            "_id" : "5905c3732f004c7cad24c3ee",
            "name" : "Verve"
        },

        /* 24 */
        {
            "_id" : "5909c14d4abd267a81dba99a",
            "name" : "Radiant"
        },

        /* 25 */
        {
            "_id" : "590aeffc77bf9c6d320fe407",
            "name" : "Effect wellness Clinic"
        },

        /* 26 */
        {
            "_id" : "590b236d21f5ff22df0fbe40",
            "name" : "Amarante"
        },

        /* 27 */
        {
            "_id" :"590c286a21f5ff22df0fde77",
            "name" : "D' Salon"
        },

        /* 28 */
        {
            "_id" : "590da3214a8649164ba2fb30",
            "name" : "Pallavi Bhatia Makeovers"
        },

        /* 29 */
        {
            "_id" :"59119eb9f5941e5aadde5336",
            "name" : "Beauty Zone"
        },

        /* 30 */
        {
            "_id" : "591418339a12f11bd6a6e548",
            "name" : "Style Redefined"
        },

        /* 31 */
        {
            "_id" : "5923e21de61af441506f14ef",
            "name" : "La Contoure"
        },

        /* 32 */
        {
            "_id" : "59241a94e61af441506f2171",
            "name" : "Enfemme"
        },

        /* 33 */
        {
            "_id" : "59267d599617606d79a7b899",
            "name" : "Aura Looks you Desire"
        },

        /* 34 */
        {
            "_id" : "5926b7579617606d79a7ccda",
            "name" : "Beaute Lounge"
        },

        /* 35 */
        {
            "_id" : "592a8690c5fa213f89e81f7e",
            "name" : "Mirrors"
        },

        /* 36 */
        {
            "_id" : "592ab643c5fa213f89e83257",
            "name" : "Diya"
        },

        /* 37 */
        {
            "_id" : "592bc403c5fa213f89e8621a",
            "name" : "Kudoz"
        },

        /* 38 */
        {
            "_id" : "592c15bee52b257687e8d998",
            "name" : "Shagun"
        },

        /* 39 */
        {
            "_id" : "592c224097c79577a27aacdf",
            "name" : "Shagun Menz"
        },

        /* 40 */
        {
            "_id" : "592e7bf74d3ec30fb8b8898b",
            "name" : "Urban By Indu"
        },

        /* 41 */
        {
            "_id" : "592fb98c1eccf327a862f894",
            "name" : "New Casa Scissors"
        },

        /* 42 */
        {
            "_id" : "592ff5ed8a9b5c12369a7d0e",
            "name" : "Bella Vista"
        },

        /* 43 */
        {
            "_id" : "5931115b1cf42f1af3fd76a9",
            "name" : "IBL Makeovers"
        },

        /* 44 */
        {
            "_id" : "593aa37c4769976f38246cfb",
            "name" : "Makers"
        },

        /* 45 */
        {
            "_id" : "5940eb7d547ca363e25888c1",
            "name" : "NM Fashion Fusion"
        },

        /* 46 */
        {
            "_id" : "594a27e8aa96ec738f58908c",
            "name" : "Studio9"
        },

        /* 47 */
        {
            "_id" : "594cdd793c61904155d48595",
            "name" : "Robbin Blue"
        },

        /* 48 */
        {
            "_id" : "594df14dc5be5d6c0e79eaf8",
            "name" : "Nikita Green"
        },

        /* 49 */
        {
            "_id" : "594dff5c7adea71e4d74c273",
            "name" : "Impact"
        },

        /* 50 */
        {
            "_id" : "594e00aa7adea71e4d74c2e2",
            "name" : "Stella"
        },

        /* 51 */
        {
            "_id" : "587084715c63a33c0af62724",
            "name" : "Mi"
        },

        /* 52 */
        {
            "_id" : "5954c092bb6e1a7dae60f99f",
            "name" : "M Salon"
        },

        /* 53 */
        {
            "_id" : "5954cfdcbb6e1a7dae60feb6",
            "name" : "Absolute Her's"
        },

        /* 54 */
        {
            "_id" : "595ca30144e0ad780f74f313",
            "name" : "The Petals"
        },

        /* 55 */
        {
            "_id" : "594a359d9856d3158171ea4f",
            "name" : "BEU Membership"
        },

        /* 56 */
        {
            "_id" : "596f03f0f49c8a201ceb1d3b",
            "name" : "Makeup Artistrry By RD"
        },

        /* 57 */
        {
            "_id" : "5971b55560925c726cfb0462",
            "name" : "Style Lab"
        },

        /* 58 */
        {
            "_id" : "5971dc4760925c726cfb420e",
            "name" : "Diana's"
        },

        /* 59 */
        {
            "_id" : "5973025360925c726cfb684f",
            "name" : "The Valentine"
        },

        /* 60 */
        {
            "_id" : "5870828f5c63a33c0af62721",
            "name" : "Aalenes"
        },

        /* 61 */
        {
            "_id" : "594dfcd97adea71e4d74c1d7",
            "name" : "Snips"
        }

    ]


    var index = _.filter(array,function (s) {

        return s._id==id
    });
    if(index.length>0){
        return index[0].name;

    }else{
        return id
    }

    }





    router.post('/parlors', function (req, res) {


    Parlor.find({}, {name: 1, _id: 1}, function (err, parlors) {
        res.json(parlors)

    })

    })


    router.post('/graph', function (req, res) {


    function queries(item, mes) {
        var query = []
    // console.log(req.body.date.startDate)
        if (mes == 201) {
            return query = [

                {
                    $match: {
                        parlorId: ObjectId(item._id),
                        status: 3,
                        "appointmentStartTime": {
                            $gte: new Date(req.body.date.startDate),
                            $lt: new Date(req.body.date.endDate)
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        service: {$sum: "$serviceRevenue"},
                        product: {$sum: "$productRevenue"}
                    }
                }, {"$project": {"revenue": {"$add": ["$service", "$product"]}}}]

        } else if (mes == 202) {

            return query = [{
                $match: {
                    parlorId: ObjectId(item._id),
                    status: 3,
                    "appointmentStartTime": {
                        $gte: new Date(req.body.date.startDate),
                        $lt: new Date(req.body.date.endDate)
                    }
                }
            }, {
                $group: {
                    _id: null,
                    service: {$sum: "$serviceRevenue"},
                    product: {$sum: "$productRevenue"}
                }
            }, {"$project": {"revenue": "$service"}}]
        } else if (mes == 203) {
            return query = [{
                $match: {
                    parlorId: ObjectId(item._id),
                    status: 3,
                    "appointmentStartTime": {
                        $gte: new Date(req.body.date.startDate),
                        $lt: new Date(req.body.date.endDate)
                    },
                    loyalityPoints: {$gt: 0}
                }
            }, {
                $group: {
                    _id: null,
                    loyal: {$sum: "$loyalityPoints"},
                    offer: {$sum: "$loyalityOffer"}
                }
            }, {$project: {"revenue": {$subtract: ["$loyal", "$offer"]}}}]
        } else if (mes == 204) {
            return query = [{
                $match: {
                    parlorId: ObjectId(item._id),
                    "appointmentStartTime": {
                        $gte: new Date(req.body.date.startDate),
                        $lt: new Date(req.body.date.endDate)
                    },
                    status: 3
                }
            }, {
                $group: {
                    _id: null,
                    revenue: {$sum: 1}
                }
            }]

        } else if (mes == 205) {
            return query = [{
                $match: {
                    parlorId: ObjectId(item._id),
                    "appointmentStartTime": {
                        $gte: new Date(req.body.date.startDate),
                        $lt: new Date(req.body.date.endDate)
                    },
                    status: 3
                }
            }, {
                $group: {
                    _id: null,
                    service: {$sum: "$serviceRevenue"},
                    product: {$sum: "$productRevenue"}
                }
            }, {"$project": {"revenue": "$product"}}]

        } else if (mes == 206) {

            return query = [{$unwind: "$services"}, {
                $match: {   //unwind
                    parlorId: ObjectId(item._id),
                    "services.discountMedium": "frequency",
                    "services.dealId": null,
                    "services.dealPriceUsed": true,
                    status: 3
                }
            }, {$group: {_id: null, count: {$sum: 1}}}, {"$project": {"revenue": "$count"}}]
        } else if (mes == 207) {
            return query = [{
                $match: {
                    parlorId: ObjectId(item._id),
                    status: 3,
                    "appointmentStartTime": {
                        $gte: new Date(req.body.date.startDate),
                        $lt: new Date(req.body.date.endDate)
                    }
                }
            }, {
                $group: {
                    _id: null,
                    service: {$sum: "$serviceRevenue"},
                    count: {$sum: 1},
                    product: {$sum: "$productRevenue"}
                }
            }, {"$project": {"revenue": {$divide: [{"$add": ["$service", "$product"]}, "$count"]}}}]

        } else {
            return query = [{
                $match: {
                    parlorId: ObjectId(item._id),
                    "services.discountMedium": "frequency",
                    "services.dealId": null,
                    "services.dealPriceUsed": true,
                    status: 3,
                    "appointmentStartTime": {
                        $gte: new Date(req.body.date.startDate),
                        $lt: new Date(req.body.date.endDate)
                    }
                }
            }, {$unwind: "$services"},
                {
                    $group: {
                        _id: null,
                        revenue: {$sum: "$services.price"}
                    }
                }, {$project: {revenue: {$multiply: [75, {$divide: ["$revenue", 100]}]}}}]


        }

    }

    function queries2(match, meas, type, dim) {
        var query = []

        console.log("measssssssssssss", meas)
        if (meas == 201) {
            if (type == 0) {

                return query = [{$match: match}, {
                    $group: {
                        _id: null,
                        service: {$sum: "$serviceRevenue"},
                        product: {$sum: "$productRevenue"}
                    }
                }, {"$project": {"revenue": {"$add": ["$service", "$product"]}}}]
            } else if (type == 3) {

                return query = [{$unwind: "$departmentRevenue"}, {
                    $lookup: {
                        from: "supercategories",
                        localField: "departmentRevenue.departmentId",
                        foreignField: "_id",
                        as: "newData"
                    }
                },
                    {$project: {newData: 1, departmentRevenue: 1}}, {$unwind: "$newData"},
                    {$group: {_id: "$newData.name", revenue: {$sum: "$departmentRevenue.revenue"}}}

                ]


            } else if (type == 4) {


                return query = [{
                    $match: {
                        "appointmentStartTime": {
                            $gte: new Date(req.body.date.startDate),
                            $lt: new Date(req.body.date.endDate)
                        }
                    }
                }, {$unwind: "$services"}, {
                    $lookup: {
                        from: "servicecategories",
                        localField: "services.categoryId",
                        foreignField: "_id",
                        as: "newData"
                    }
                },
                    {$project: {newData: 1, services: 1}}, {$unwind: "$newData"},
                    {$group: {_id: "$newData.name", revenue: {$sum: "$services.revenue"}}}

                ]

            } else if (type == 5) {
                console.log("i am in type 5")

                return query = [{
                    "$match": {
                        "appointmentStartTime": {
                            $gte: new Date(req.body.date.startDate),
                            $lt: new Date(req.body.date.endDate)
                        }
                    }
                },
                    {"$unwind": "$allPaymentMethods"}, {
                        "$group": {
                            "_id": "$allPaymentMethods.name",
                            "revenue": {"$sum": "$allPaymentMethods.amount"}
                        }
                    }];
                //     [{
                //     $match: {
                //         "appointmentStartTime": {
                //             $gte: new Date(req.body.date.startDate),
                //             $lt: new Date(req.body.date.endDate)
                //         }
                //     }
                // }, {"$unwind": "$allPaymentMethods"},
                //     {$match: {"allPaymentMethods.name": "Card"}}
                //     , {$group: {_id: "$allPaymentMethods.name", revenue: {$sum: "$allPaymentMethods.amount"}}}
                // ]
            } else if (type == 6) {

                return query = [{
                    $match: {
                        "appointmentStartTime": {
                            $gte: new Date(req.body.date.startDate),
                            $lt: new Date(req.body.date.endDate)
                        }
                    }
                }, {"$unwind": "$allPaymentMethods"},
                    {$match: {"allPaymentMethods.name": "Cash"}}
                    , {$group: {_id: "$allPaymentMethods.name", revenue: {$sum: "$allPaymentMethods.amount"}}}
                ]
            } else if (type == 7) {


                return query = [{
                    $match: {
                        "appointmentStartTime": {
                            $gte: new Date(req.body.date.startDate),
                            $lt: new Date(req.body.date.endDate)
                        }
                    }
                }, {"$unwind": "$allPaymentMethods"},
                    {$match: {$or: [{"allPaymentMethods.name": "Be U"}, {"allPaymentMethods.name": "beu"}, {"allPaymentMethods.name": "Nearbuy"}]}}
                    , {$group: {_id: null, revenue: {$sum: "$allPaymentMethods.amount"}}}
                ]
            }

        } else if (meas == 202) {

            if (req.body.data[0].data[0].Id == 115) {

                return query = [{
                    $match: {
                        "appointmentStartTime": {
                            $gte: new Date(req.body.date.startDate),
                            $lt: new Date(req.body.date.endDate)
                        }
                    }
                }, {$unwind: "$services"}, {$unwind: "$services.employees"},
                    {
                        $group: {
                            _id: "$services.employees.employeeId",
                            serviceRev: {$sum: "$services.revenue"},
                            distribution: {$sum: "$services.employees.distribution"}
                        }
                    },

                    {
                        $lookup: {
                            from: "owners",
                            localField: "_id",
                            foreignField: "_id",
                            as: "newData"
                        }
                    },
                    {$unwind: "$newData"},
                    {
                        $project: {
                            _id: "$newData.firstName",
                            revenue: {$multiply: [{$divide: ["$serviceRev", 100]}, "$distribution"]}
                        }
                    },

                ]
            } else {

                return query = [{$match: match}, {
                    $group: {
                        _id: null,
                        service: {$sum: "$serviceRevenue"},
                        product: {$sum: "$productRevenue"}
                    }
                }, {"$project": {"revenue": "$service"}}]
            }
        } else if (meas == 203) {
            return query = [{
                $match: match

            }, {
                $group: {
                    _id: null,
                    loyal: {$sum: "$loyalityPoints"},
                    offer: {"$sum": {$ifNull: ["$loyalityOffer", 0]}}
                }
            }, {$project: {"revenue": {$subtract: ["$loyal", "$offer"]}}}]
        } else if (meas == 204) {
            if (type == 0) {

                return query = [{$match: match}, {
                    $group: {
                        _id: null,
                        revenue: {$sum: 1}
                    }
                }]
            } else if (req.body.data[0].data[0].Id == 112) {
                return query = [{
                    $match: {
                        "appointmentStartTime": {
                            $gte: new Date(req.body.date.startDate),
                            $lt: new Date(req.body.date.endDate)
                        }
                    }
                }, {"$unwind": "$allPaymentMethods"}, {$group: {_id: "$allPaymentMethods.name", revenue: {$sum: 1}}}
                ]
            } else if (req.body.data[0].data[0].Id == 115) {
                return query = [{
                    $match: {
                        "appointmentStartTime": {
                            $gte: new Date(req.body.date.startDate),
                            $lt: new Date(req.body.date.endDate)
                        }
                    }
                }, {$unwind: "$services"}, {$unwind: "$services.employees"},
                    {$group: {_id: "$services.employees.employeeId", revenue: {$sum: 1}}},

                    {
                        $lookup: {
                            from: "owners",
                            localField: "_id",
                            foreignField: "_id",
                            as: "newData"
                        }
                    },
                    {$unwind: "$newData"},
                    {$project: {_id: "$newData.firstName", revenue: 1}},

                ]
            }

        } else if (meas == 205) {
            return query = [{$match: match}, {
                $group: {
                    _id: null,
                    service: {$sum: "$serviceRevenue"},
                    product: {$sum: "$productRevenue"}
                }
            }, {"$project": {"revenue": "$product"}}]

        } else if (meas == 206) {

            return query = [{
                $match: match
            }, {$group: {_id: null, count: {$sum: 1}}}, {"$project": {"revenue": "$count"}}]
        } else if (meas == 207) {
            return query = [{$match: match}, {
                $group: {
                    _id: null,
                    service: {$sum: "$serviceRevenue"},
                    count: {$sum: 1},
                    product: {$sum: "$productRevenue"}
                }
            }, {"$project": {"revenue": {$divide: [{"$add": ["$service", "$product"]}, "$count"]}}}]

        } else if (meas == 208) {
            return query = [{
                $match: match
            }, {$unwind: "$services"},
                {
                    $group: {
                        _id: null,
                        revenue: {$sum: "$services.price"}
                    }
                }, {$project: {revenue: {$multiply: [75, {$divide: ["$revenue", 100]}]}}}]

        } else if (meas == 209) {

            console.log("here")
            return query = [{$unwind: "$creditsHistory"}, {
                $match: {
                    $or: [{"creditsHistory.reason": "100% cashback"},
                        {"creditsHistory.reason": "50% cashback"}]
                }
            }, {$group: {_id: null, revenue: {$sum: "$creditsHistory.amount"}}}]

        } else if (meas == 210) {

            console.log("here")
            return query = [{$unwind: "$creditsHistory"}, {$match: {"creditsHistory.reason": "100% cashback"}}, {
                $group: {
                    _id: null,
                    revenue: {$sum: "$creditsHistory.amount"}
                }
            }]

        } else if (meas == 211) {

            console.log("here")
            return query = [{$unwind: "$creditsHistory"}, {$match: {"creditsHistory.reason": "50% cashback"}}, {
                $group: {
                    _id: null,
                    revenue: {$sum: "$creditsHistory.amount"}
                }
            }]

        } else if (meas == 212) {
            return query = [{
                $match: {
                    status: 3,
                    loyalityPoints: {$gt: 0},
                    "appointmentStartTime": {
                        $gte: new Date(req.body.date.startDate),
                        $lt: new Date(req.body.date.endDate)
                    }
                }
            }, {
                $group: {
                    _id: null,
                    loyal: {$sum: "$loyalityPoints"},
                    offer: {"$sum": {$ifNull: ["$loyalityOffer", "$loyalityPoints"]}}
                }
            }, {$project: {"revenue": {$subtract: ["$loyal", "$offer"]}}}]
        } else if (meas == 213) {
            return query = [
                {$unwind: "$services"},
                {$unwind: "$client"},
                {
                    $match: {
                        "appointmentStartTime": {
                            $gte: new Date(req.body.date.startDate),
                            $lt: new Date(req.body.date.endDate)
                        },

                        "services.discountMedium": "frequency",
                        "services.dealId": null,
                        "services.dealPriceUsed": true,
                        status: 3
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "client.id",
                        foreignField: "_id",
                        as: "newData"
                    }
                },

                {
                    $project: {

                        newData: 1,
                        services: 1

                    }
                }
                , {$unwind: "$newData"},
                {$match: {$or: [{"newData.freeHairCutBar": {$eq: 0}, "newData.freeHairCutBar": null}]}},
                {$group: {_id: null, revenue: {$sum: "$services.price"}}}


            ]
        } else if (meas == 214) {
            return query = [
                {$unwind: "$services"},
                {$unwind: "$client"},
                {
                    $match: {

                        "services.discountMedium": "frequency",
                        "services.dealId": null,
                        "services.dealPriceUsed": true,
                        status: 3,
                        "appointmentStartTime": {
                            $gte: new Date(req.body.date.startDate),
                            $lt: new Date(req.body.date.endDate)
                        }
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "client.id",
                        foreignField: "_id",
                        as: "newData"
                    }
                },

                {
                    $project: {

                        newData: 1,
                        services: 1

                    }
                }
                , {$unwind: "$newData"},
                {$match: {"newData.freeHairCutBar": {$gt: 0}}},
                {$group: {_id: null, revenue: {$sum: "$services.price"}}}


            ]
        } else if (meas == 215) {
            return query = [
                {$unwind: "$services"},
                {$unwind: "$client"},
                {
                    $match: {

                        "services.discountMedium": "frequency",
                        "services.dealId": null,
                        "services.dealPriceUsed": true,
                        status: 3,
                        "appointmentStartTime": {
                            $gte: new Date(req.body.date.startDate),
                            $lt: new Date(req.body.date.endDate)
                        }
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "client.id",
                        foreignField: "_id",
                        as: "newData"
                    }
                },

                {
                    $project: {

                        newData: 1,
                        services: 1,
                        loyalityPoints: 1


                    }
                }
                , {$unwind: "$newData"},
                {$match: {"newData.freeHairCutBar": {$gt: 0}}},
                {$group: {_id: null, revenue: {$sum: "$loyalityPoints"}}}


            ]
        } else if (meas == 216) {

            return query = [{$unwind: "$creditsHistory"}, {
                $match: {
                    $or: [{"creditsHistory.reason": "100% cashback"},
                        {"creditsHistory.reason": "50% cashback"},
                        {"creditsHistory.reason": "Referal"},
                        {"creditsHistory.reason": "Referal Service"},
                        {"creditsHistory.reason": "Review"},


                    ]
                }
            }
                , {$group: {_id: null, revenue: {$sum: "$creditsHistory.amount"}}}]

        } else if (meas == 221) {

            return query = [{
                $match: {
                    "razorPayCaptureResponse.status": "captured",
                    paymentMethod: 5
                }
            }, {$group: {_id: "cash", revenue: {$sum: 1}}}]
        }
        else if (meas == 220) {

            return query = [{
                $match: {
                    "razorPayCaptureResponse.status": "captured",
                    paymentMethod: 5
                }
            }, {$group: {_id: "cash", revenue: {$sum: "$payableAmount"}}}]
        }
        else if (meas == 218) {

            return query = [{
                $match: {
                    $or: [{"appointmentType": 3}, {appBooking: 2}],
                    paymentMethod: 1
                }
            }, {$group: {_id: "online", revenue: {$sum: "$payableAmount"}}}]
        }
        else if (meas == 217) {

            return query = [{
                $match: {
                    $or: [{"appointmentType": 3}, {appBooking: 2}],
                    paymentMethod: 1
                }
            }, {$group: {_id: "online", revenue: {$sum: 1}}}]
        } else if (meas == 224) {
            console.log("224")

            return query = [{
                "$match": {
                    "appointmentStartTime": {
                        $gte: new Date(req.body.date.startDate),
                        $lt: new Date(req.body.date.endDate)
                    }
                }
            },
                {"$unwind": "$allPaymentMethods"},
                {
                    "$group": {
                        "_id": "$allPaymentMethods.name",
                        "revenue": {"$sum": "$allPaymentMethods.amount"},
                        "count": {$sum: 1}
                    }
                },
                {$project: {_id: "$_id", revenue: {$divide: ["$revenue", "$count"]}}}]

        } else if (meas == 225) {
            console.log("224")

            return query = [{
                "$match": {
                    "appointmentStartTime": {
                        $gte: new Date(req.body.date.startDate),
                        $lt: new Date(req.body.date.endDate)
                    }
                }
            },
                {"$unwind": "$allPaymentMethods"},
                {
                    "$group": {
                        "_id": "$allPaymentMethods.name",
                        "revenue": {"$sum": {$size: "$services"}},
                        "count": {$sum: 1}
                    }
                },
                {$project: {_id: "$_id", revenue: {$divide: ["$revenue", "$count"]}}}]

        }
    }

    function queries3(group, meas, type, project) {
        var query = []
        var parlorArray = [];
        req.body.parlor.forEach(function (p) {
            parlorArray.push(ObjectId(p))
        })

        console.log("measssssssssssss", meas, project)
        if (meas == 201) {
            if (type == 0) {
                var parlorArray = [];
                req.body.parlor.forEach(function (p) {
                    parlorArray.push(ObjectId(p))
                })


                return query = [{
                    $match: {
                        status: 3,
                        parlorId: {$in: parlorArray},
                        "appointmentStartTime": {
                            $gte: new Date(req.body.date.startDate),
                            $lt: new Date(req.body.date.endDate)
                        }
                    }
                }, {
                    $group: {
                        _id: {$dateToString: {format: "%Y-%m-%d", date: "$appointmentStartTime"}},
                        service: {$sum: "$serviceRevenue"},
                        product: {$sum: "$productRevenue"}
                    }

                }, {$sort: {_id: 1}}, {"$project": {"revenue": {"$add": ["$service", "$product"]}}}]

            } else if (type == 1) {
                var parlorArray = [];
                req.body.parlor.forEach(function (p) {
                    parlorArray.push(ObjectId(p))
                })
                return query = [{
                    $match: {
                        status: 3,
                        parlorId: {$in: parlorArray},
                        "appointmentStartTime": {
                            $gte: new Date(req.body.date.startDate),
                            $lt: new Date(req.body.date.endDate)
                        }
                    }
                },
                    {
                        $project: {
                            [project]: {["$" + project]: "$appointmentStartTime"},
                            serviceRevenue: 1,
                            productRevenue: 1
                        }
                    },
                    {
                        $group: {
                            _id: "$" + project,
                            service: {$sum: "$serviceRevenue"},
                            product: {$sum: "$productRevenue"}
                        }
                    }, {$sort: {_id: 1}}, {"$project": {"revenue": {"$add": ["$service", "$product"]}}}
                ]
            } else if (type == 2) {
                var parlorArray = [];
                req.body.parlor.forEach(function (p) {
                    parlorArray.push(ObjectId(p))
                })

                return query = [{
                    $match: {
                        parlorId: {$in: parlorArray},
                        "appointmentStartTime": {
                            $gte: new Date(req.body.date.startDate),
                            $lt: new Date(req.body.date.endDate)
                        },
                        "appointmentType": 3,
                        appBooking: 2,
                        paymentMethod: 5
                    }
                }, {$group: {_id: "online", revenue: {$sum: "$payableAmount"}}}]
            }
        } else if (meas == 202) {
            if (type == 0) {
                var parlorArray = [];
                req.body.parlor.forEach(function (p) {
                    parlorArray.push(ObjectId(p))
                })
                return query = [{
                    $match: {
                        parlorId: {$in: parlorArray},
                        "appointmentStartTime": {
                            $gte: new Date(req.body.date.startDate),
                            $lt: new Date(req.body.date.endDate)
                        },
                        status: 3
                    }
                }, {
                    $group: {
                        _id: {$dateToString: {format: "%Y-%m-%d", date: "$appointmentStartTime"}},
                        service: {$sum: "$serviceRevenue"},
                        product: {$sum: "$productRevenue"}
                    }
                }, {$sort: {_id: 1}}, {"$project": {"revenue": "$service"}}]
            } else {
                var parlorArray = [];
                req.body.parlor.forEach(function (p) {
                    parlorArray.push(ObjectId(p))
                })
                return query = [{
                    $match: {
                        parlorId: {$in: parlorArray},
                        "appointmentStartTime": {
                            $gte: new Date(req.body.date.startDate),
                            $lt: new Date(req.body.date.endDate)
                        },
                        status: 3
                    }
                },
                    {$project: {[project]: {["$" + project]: "$appointmentStartTime"}, serviceRevenue: 1}},
                    {$group: {_id: "$" + project, revenue: {$sum: "$serviceRevenue"}}}, {$sort: {_id: 1}}
                ]

            }
        } else if (meas == 203) {
            if (type == 0) {
                var parlorArray = [];
                req.body.parlor.forEach(function (p) {
                    parlorArray.push(ObjectId(p))
                })
                return query = [{
                    $match: {
                        parlorId: {$in: parlorArray},
                        "appointmentStartTime": {
                            $gte: new Date(req.body.date.startDate),
                            $lt: new Date(req.body.date.endDate)
                        },
                        status: 3
                    }
                }, {
                    $group: {
                        _id: {$dateToString: {format: "%Y-%m-%d", date: "$appointmentStartTime"}},
                        loyal: {"$sum": {$ifNull: ["$loyalityOffer", 0]}}``,
                        offer: {"$sum": {$ifNull: ["$loyalityOffer", 0]}}
                    }
                }, {$sort: {_id: 1}}, {$project: {"revenue": {$subtract: ["$loyal", "$offer"]}}}]

            } else {
                var parlorArray = [];
                req.body.parlor.forEach(function (p) {
                    parlorArray.push(ObjectId(p))
                })
                return query = [{
                    $match: {
                        parlorId: {$in: parlorArray},
                        "appointmentStartTime": {
                            $gte: new Date(req.body.date.startDate),
                            $lt: new Date(req.body.date.endDate)
                        },
                        status: 3
                    }
                },
                    {
                        $project: {
                            [project]: {["$" + project]: "$appointmentStartTime"},
                            serviceRevenue: 1,
                            loyalityPoints: 1,
                            loyalityOffer: 1
                        }
                    },
                    {
                        $group: {
                            _id: "$" + project, loyal: {$sum: "$loyalityPoints"},
                            offer: {"$sum": {$ifNull: ["$loyalityOffer", "$loyalityPoints"]}}
                        }
                    }, {$sort: {_id: 1}}, {$project: {"revenue": {$subtract: ["$loyal", "$offer"]}}}
                ]


            }

        } else if (meas == 204) {
            if (type == 0) {

                return query = [{
                    $match: {
                        parlorId: {$in: parlorArray},
                        "appointmentStartTime": {
                            $gte: new Date(req.body.date.startDate),
                            $lt: new Date(req.body.date.endDate)
                        },
                        status: 3
                    }
                }, {
                    $group: {
                        _id: {$dateToString: {format: "%Y-%m-%d", date: "$appointmentStartTime"}},
                        revenue: {$sum: 1}
                    }
                }, {$sort: {_id: 1}}]
            } else {
                return query = [{
                    $match: {
                        parlorId: {$in: parlorArray},
                        "appointmentStartTime": {
                            $gte: new Date(req.body.date.startDate),
                            $lt: new Date(req.body.date.endDate)
                        },
                        status: 3
                    }
                },
                    {$project: {[project]: {["$" + project]: "$appointmentStartTime"}, serviceRevenue: 1}},
                    {
                        $group: {
                            _id: "$" + project,
                            revenue: {$sum: 1}


                        }
                    }, {$sort: {_id: 1}}
                ]

            }


        } else if (meas == 205) {   //product revenue
            if (type == 0) {

                return query = [{
                    $match: {
                        parlorId: {$in: parlorArray},
                        "appointmentStartTime": {
                            $gte: new Date(req.body.date.startDate),
                            $lt: new Date(req.body.date.endDate)
                        },
                        status: 3
                    }
                }, {
                    $group: {
                        _id: {$dateToString: {format: "%Y-%m-%d", date: "$appointmentStartTime"}},
                        service: {$sum: "$serviceRevenue"},
                        product: {$sum: "$productRevenue"}
                    }
                }, {$sort: {_id: 1}}, {"$project": {"revenue": "$product"}}]

            } else {

                return query = [{
                    $match: {
                        parlorId: {$in: parlorArray},
                        "appointmentStartTime": {
                            $gte: new Date(req.body.date.startDate),
                            $lt: new Date(req.body.date.endDate)
                        },
                        status: 3
                    }
                },
                    {$project: {[project]: {["$" + project]: "$appointmentStartTime"}, serviceRevenue: 1}},
                    {
                        $group: {
                            _id: "$" + project,

                            service: {$sum: "$serviceRevenue"},
                            product: {$sum: "$productRevenue"}

                        }
                    }, {$sort: {_id: 1}}, {"$project": {"revenue": "$product"}}
                ]

            }


        } else if (meas == 206) {    // no. of appointment
            if (type == 0) {
                return query = [{
                    $match: {
                        parlorId: {$in: parlorArray},
                        "appointmentStartTime": {
                            $gte: new Date(req.body.date.startDate),
                            $lt: new Date(req.body.date.endDate)
                        },
                        status: 3
                    }
                }, {
                    $group: {
                        _id: {$dateToString: {format: "%Y-%m-%d", date: "$appointmentStartTime"}},
                        count: {$sum: 1}
                    }
                }, {$sort: {_id: 1}}, {"$project": {"revenue": "$count"}}]

            } else {
                return query = [{
                    $match: {
                        parlorId: {$in: parlorArray},
                        "appointmentStartTime": {
                            $gte: new Date(req.body.date.startDate),
                            $lt: new Date(req.body.date.endDate)
                        },
                        status: 3
                    }
                },
                    {$project: {[project]: {["$" + project]: "$appointmentStartTime"}, serviceRevenue: 1}},
                    {
                        $group: {
                            _id: "$" + project,
                            count: {$sum: 1}

                        }
                    }, {$sort: {_id: 1}}, {"$project": {"revenue": "$count"}}
                ]
            }

        } else if (meas == 207) { //appointment per bill

            if (type == 0) {

                return query = [{
                    $match: {
                        parlorId: {$in: parlorArray},
                        "appointmentStartTime": {
                            $gte: new Date(req.body.date.startDate),
                            $lt: new Date(req.body.date.endDate)
                        },
                        status: 3
                    }
                }, {
                    $group: {
                        _id: {$dateToString: {format: "%Y-%m-%d", date: "$appointmentStartTime"}},
                        service: {$sum: "$serviceRevenue"},
                        count: {$sum: 1},
                        product: {$sum: "$productRevenue"}
                    }
                }, {$sort: {_id: 1}}, {"$project": {"revenue": {$divide: [{"$add": ["$service", "$product"]}, "$count"]}}}]

            } else {

                return query = [{
                    $match: {
                        parlorId: {$in: parlorArray},
                        "appointmentStartTime": {
                            $gte: new Date(req.body.date.startDate),
                            $lt: new Date(req.body.date.endDate)
                        },
                        status: 3
                    }
                },
                    {$project: {[project]: {["$" + project]: "$appointmentStartTime"}, serviceRevenue: 1}},
                    {
                        $group: {
                            _id: "$" + project,
                            service: {$sum: "$serviceRevenue"},
                            count: {$sum: 1},
                            product: {$sum: "$productRevenue"}


                        }
                    }, {$sort: {_id: 1}}, {"$project": {"revenue": {$divide: [{"$add": ["$service", "$product"]}, "$count"]}}}

                ]


            }


        } else if (meas == 208) { // free hair completed
            if (type == 0) {

                return query = [{
                    $match: {
                        parlorId: {$in: parlorArray},
                        "appointmentStartTime": {
                            $gte: new Date(req.body.date.startDate),
                            $lt: new Date(req.body.date.endDate)
                        },
                        status: 3
                    }
                }, {$unwind: "$services"},
                    {
                        $group: {
                            _id: {$dateToString: {format: "%Y-%m-%d", date: "$appointmentStartTime"}},
                            revenue: {$sum: "$services.price"}
                        }
                    }, {$sort: {_id: 1}}, {$project: {revenue: {$multiply: [75, {$divide: ["$revenue", 100]}]}}}]

            } else {

                return query = [{
                    $match: {
                        parlorId: {$in: parlorArray},
                        "appointmentStartTime": {
                            $gte: new Date(req.body.date.startDate),
                            $lt: new Date(req.body.date.endDate)
                        },
                        status: 3
                    }
                },
                    {$project: {[project]: {["$" + project]: "$appointmentStartTime"}, serviceRevenue: 1, services: 1}},
                    {$unwind: "$services"}, {
                        $group: {
                            _id: "$" + project,
                            revenue: {$sum: "$services.price"}

                        }
                    }, {$sort: {_id: 1}}, {$project: {revenue: {$multiply: [75, {$divide: ["$revenue", 100]}]}}}

                ]
            }


        } else if (meas == 209) {

            if (type == 0) {
                return query = [{$unwind: "$creditsHistory"}, {
                    $match: {
                        $or: [{"creditsHistory.reason": "100% cashback"},
                            {"creditsHistory.reason": "50% cashback"}]
                    }
                }, {
                    $group: {
                        _id: {$dateToString: {format: "%Y-%m-%d", date: "$creditsHistory.createdAt"}}
                        , revenue: {$sum: "$creditsHistory.amount"}
                    }
                }, {$sort: {_id: 1}}]
            } else {

                return query = [{$unwind: "$creditsHistory"}, {
                    $match: {
                        $or: [{"creditsHistory.reason": "100% cashback"},
                            {"creditsHistory.reason": "50% cashback"}]
                    }
                }, {$project: {[project]: {["$" + project]: "$creditsHistory.createdAt"}, creditsHistory: 1}},
                    {
                        $group: {
                            _id: "$" + project
                            , revenue: {$sum: "$creditsHistory.amount"}
                        }
                    }, {$sort: {_id: 1}}]
            }

        } else if (meas == 210) {


            if (type == 0) {

                return query = [{$unwind: "$creditsHistory"}, {$match: {"creditsHistory.reason": "100% cashback"}}, {
                    $group: {
                        _id: {$dateToString: {format: "%Y-%m-%d", date: "$creditsHistory.createdAt"}},
                        revenue: {$sum: "$creditsHistory.amount"}
                    }
                }]
            } else {

                console.log("here")
                return query = [{$unwind: "$creditsHistory"}, {$match: {"creditsHistory.reason": "100% cashback"}},
                    {$project: {[project]: {["$" + project]: "$creditsHistory.createdAt"}, creditsHistory: 1}},
                    {
                        $group: {
                            _id: "$" + project,
                            revenue: {$sum: "$creditsHistory.amount"}
                        }
                    }]


            }


        } else if (meas == 211) {

            if (type == 0) {

                return query = [{$unwind: "$creditsHistory"}, {$match: {"creditsHistory.reason": "50% cashback"}}, {
                    $group: {
                        _id: {$dateToString: {format: "%Y-%m-%d", date: "$creditsHistory.createdAt"}},
                        revenue: {$sum: "$creditsHistory.amount"}
                    }
                }]
            } else {

                return query = [{$unwind: "$creditsHistory"}, {$match: {"creditsHistory.reason": "50% cashback"}},
                    {$project: {[project]: {["$" + project]: "$creditsHistory.createdAt"}, creditsHistory: 1}},
                    {
                        $group: {
                            _id: "$" + project,
                            revenue: {$sum: "$creditsHistory.amount"}
                        }
                    }]

            }


        } else if (meas == 212) {   // cashback redeemed
            if (type == 0) {

                return query = [{
                    $match: {
                        parlorId: {$in: parlorArray},
                        status: 3,
                        loyalityPoints: {$gt: 0},
                        "appointmentStartTime": {
                            $gte: new Date(req.body.date.startDate),
                            $lt: new Date(req.body.date.endDate)
                        }
                    }
                }, {
                    $group: {
                        _id: {$dateToString: {format: "%Y-%m-%d", date: "$appointmentStartTime"}},
                        loyal: {$sum: "$loyalityPoints"},
                        offer: {"$sum": {$ifNull: ["$loyalityOffer", "$loyalityPoints"]}}
                    }
                }, {$sort: {_id: 1}}, {$project: {"revenue": {$subtract: ["$loyal", "$offer"]}}}]
            } else {

                return query = [{
                    $match: {
                        parlorId: {$in: parlorArray},
                        status: 3,
                        loyalityPoints: {$gt: 0},
                        "appointmentStartTime": {
                            $gte: new Date(req.body.date.startDate),
                            $lt: new Date(req.body.date.endDate)
                        }
                    }
                },
                    {
                        $project: {
                            [project]: {["$" + project]: "$appointmentStartTime"},
                            loyalityPoints: 1,
                            loyalityOffer: 1
                        }
                    },
                    {
                        $group: {
                            _id: "$" + project,
                            loyal: {$sum: "$loyalityPoints"},
                            offer: {"$sum": {$ifNull: ["$loyalityOffer", "$loyalityPoints"]}}
                        }
                    }, {$sort: {_id: 1}}, {$project: {"revenue": {$subtract: ["$loyal", "$offer"]}}}]

            }


        } else if (meas == 213) {    // free hair cut without min bill
            if (type == 0) {
                return query = [
                    {$unwind: "$services"},
                    {$unwind: "$client"},
                    {
                        $match: {

                            "services.discountMedium": "frequency",
                            "services.dealId": null,
                            "services.dealPriceUsed": true,
                            status: 3,
                            parlorId: {$in: parlorArray},
                            "appointmentStartTime": {
                                $gte: new Date(req.body.date.startDate),
                                $lt: new Date(req.body.date.endDate)
                            }
                        }
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "client.id",
                            foreignField: "_id",
                            as: "newData"
                        }
                    },

                    {
                        $project: {

                            newData: 1,
                            services: 1,
                            appointmentStartTime: 1

                        }
                    }
                    , {$unwind: "$newData"},
                    {$match: {$or: [{"newData.freeHairCutBar": {$eq: 0}, "newData.freeHairCutBar": null}]}},
                    {
                        $group: {
                            _id: {$dateToString: {format: "%Y-%m-%d", date: "$appointmentStartTime"}},
                            revenue: {$sum: "$services.price"}
                        }
                    }, {$sort: {_id: 1}}


                ]
            } else {
                return query = [
                    {$unwind: "$services"},
                    {$unwind: "$client"},
                    {
                        $match: {
                            parlorId: {$in: parlorArray},
                            "appointmentStartTime": {
                                $gte: new Date(req.body.date.startDate),
                                $lt: new Date(req.body.date.endDate)
                            },

                            "services.discountMedium": "frequency",
                            "services.dealId": null,
                            "services.dealPriceUsed": true,
                            status: 3
                        }
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "client.id",
                            foreignField: "_id",
                            as: "newData"
                        }
                    },

                    {
                        $project: {

                            newData: 1,
                            services: 1,
                            appointmentStartTime: 1

                        }
                    }
                    , {$unwind: "$newData"},
                    {$match: {$or: [{"newData.freeHairCutBar": {$eq: 0}, "newData.freeHairCutBar": null}]}},
                    {
                        $project: {
                            [project]: {["$" + project]: "$appointmentStartTime"},
                            appointmentStartTime: 1,
                            services: 1
                        }
                    },

                    {
                        $group: {
                            _id: "$" + project,
                            revenue: {$sum: "$services.price"}
                        }
                    }, {$sort: {_id: 1}}
                ]
            }
        } else if (meas == 214) {
            if (type == 0) {
                return query = [
                    {$unwind: "$services"},
                    {$unwind: "$client"},
                    {
                        $match: {
                            parlorId: {$in: parlorArray},
                            "appointmentStartTime": {
                                $gte: new Date(req.body.date.startDate),
                                $lt: new Date(req.body.date.endDate)
                            },

                            "services.discountMedium": "frequency",
                            "services.dealId": null,
                            "services.dealPriceUsed": true,
                            status: 3
                        }
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "client.id",
                            foreignField: "_id",
                            as: "newData"
                        }
                    },

                    {
                        $project: {

                            newData: 1,
                            services: 1,
                            appointmentStartTime: 1


                        }
                    }
                    , {$unwind: "$newData"},
                    {$match: {"newData.freeHairCutBar": {$gt: 0}}},
                    {
                        $group: {
                            _id: {$dateToString: {format: "%Y-%m-%d", date: "$appointmentStartTime"}},
                            revenue: {$sum: "$services.price"}
                        }
                    }, {$sort: {_id: 1}}


                ]
            } else {
                return query = [
                    {$unwind: "$services"},
                    {$unwind: "$client"},
                    {
                        $match: {
                            parlorId: {$in: parlorArray},
                            "appointmentStartTime": {
                                $gte: new Date(req.body.date.startDate),
                                $lt: new Date(req.body.date.endDate)
                            },
                            "services.discountMedium": "frequency",
                            "services.dealId": null,
                            "services.dealPriceUsed": true,
                            status: 3
                        }
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "client.id",
                            foreignField: "_id",
                            as: "newData"
                        }
                    },

                    {
                        $project: {

                            newData: 1,
                            services: 1,
                            appointmentStartTime: 1


                        }
                    }
                    , {$unwind: "$newData"},
                    {$match: {"newData.freeHairCutBar": {$gt: 0}}},
                    {
                        $project: {
                            [project]: {["$" + project]: "$appointmentStartTime"},
                            appointmentStartTime: 1,
                            services: 1
                        }
                    },


                    {
                        $group: {
                            _id: "$" + project,
                            revenue: {$sum: "$services.price"}
                        }
                    }, {$sort: {_id: 1}}


                ]
            }
        } else if (meas == 215) {


            if (type == 0) {
                return query = [
                    {$unwind: "$services"},
                    {$unwind: "$client"},
                    {
                        $match: {
                            parlorId: {$in: parlorArray},
                            "appointmentStartTime": {
                                $gte: new Date(req.body.date.startDate),
                                $lt: new Date(req.body.date.endDate)
                            },

                            "services.discountMedium": "frequency",
                            "services.dealId": null,
                            "services.dealPriceUsed": true,
                            status: 3
                        }
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "client.id",
                            foreignField: "_id",
                            as: "newData"
                        }
                    },

                    {
                        $project: {

                            newData: 1,
                            services: 1,
                            loyalityPoints: 1,
                            appointmentStartTime: 1
                        }
                    }
                    , {$unwind: "$newData"},
                    {$match: {"newData.freeHairCutBar": {$gt: 0}}},
                    {
                        $group: {
                            _id: {$dateToString: {format: "%Y-%m-%d", date: "$appointmentStartTime"}},
                            revenue: {$sum: "$loyalityPoints"}
                        }
                    }, {$sort: {_id: 1}}


                ]
            } else {
                return query = [
                    {$unwind: "$services"},
                    {$unwind: "$client"},
                    {
                        $match: {
                            parlorId: {$in: parlorArray},
                            "appointmentStartTime": {
                                $gte: new Date(req.body.date.startDate),
                                $lt: new Date(req.body.date.endDate)
                            },
                            "services.discountMedium": "frequency",
                            "services.dealId": null,
                            "services.dealPriceUsed": true,
                            status: 3
                        }
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "client.id",
                            foreignField: "_id",
                            as: "newData"
                        }
                    },

                    {
                        $project: {

                            newData: 1,
                            services: 1,
                            loyalityPoints: 1,
                            appointmentStartTime: 1


                        }
                    }
                    , {$unwind: "$newData"},
                    {$match: {"newData.freeHairCutBar": {$gt: 0}}},
                    {
                        $project: {
                            [project]: {["$" + project]: "$appointmentStartTime"},
                            appointmentStartTime: 1,
                            services: 1,
                            loyalityPoints: 1
                        }
                    },
                    {
                        $group: {
                            _id: "$" + project,
                            revenue: {$sum: "$loyalityPoints"}
                        }
                    }, {$sort: {_id: 1}}


                ]
            }

        } else if (meas == 216) {

            if (type == 0) {
                return query = [{$unwind: "$creditsHistory"}, {
                    $match: {

                        $or: [{"creditsHistory.reason": "100% cashback"},
                            {"creditsHistory.reason": "50% cashback"},
                            {"creditsHistory.reason": "Referal"},
                            {"creditsHistory.reason": "Referal Service"},
                            {"creditsHistory.reason": "Review"},


                        ]
                    }
                }
                    , {
                        $group: {
                            _id: {$dateToString: {format: "%Y-%m-%d", date: "$creditsHistory.createdAt"}},
                            revenue: {$sum: "$creditsHistory.amount"}
                        }
                    }, {$sort: {_id: 1}}]
            } else {


                return query = [{$unwind: "$creditsHistory"}, {
                    $match: {
                        $or: [{"creditsHistory.reason": "100% cashback"},
                            {"creditsHistory.reason": "50% cashback"},
                            {"creditsHistory.reason": "Referal"},
                            {"creditsHistory.reason": "Referal Service"},
                            {"creditsHistory.reason": "Review"},


                        ]
                    }
                },

                    {$project: {[project]: {["$" + project]: "$creditsHistory.createdAt"}, creditsHistory: 1}},
                    {
                        $group: {
                            _id: "$" + project,
                            revenue: {$sum: "$creditsHistory.amount"}
                        }
                    }
                ]

            }

        } else if (meas == 217) {

            var dt = new Date(2017, 0, 1)
            return query = [
                {
                    $match: {
                        parlorId: {$in: parlorArray},
                        "appointmentStartTime": {$gt: dt},
                        $or: [{"appointmentType": 3}, {appBooking: 2}],
                        paymentMethod: 1
                    }
                },
                {$project: {[project]: {["$" + project]: "$appointmentStartTime"}, count: 1}},
                {$group: {_id: "$" + project, revenue: {$sum: 1}}}, {$sort: {_id: 1}}


            ]

        } else if (meas == 218) {
            var dt = new Date(2017, 0, 1)
            return query = [
                {
                    $match: {
                        parlorId: {$in: parlorArray},
                        "appointmentStartTime": {$gt: dt},
                        $or: [{"appointmentType": 3}, {appBooking: 2}],
                        paymentMethod: 1
                    }
                },
                {$project: {[project]: {["$" + project]: "$appointmentStartTime"}, payableAmount: 1}},
                {$group: {_id: "$" + project, revenue: {$sum: "$payableAmount"}}}, {$sort: {_id: 1}}


            ]

        } else if (meas == 220) {
            var dt = new Date(2017, 0, 1)
            return query = [
                {
                    $match: {
                        parlorId: {$in: parlorArray},
                        "appointmentStartTime": {$gt: dt},
                        "razorPayCaptureResponse.status": "captured",
                        paymentMethod: 5
                    }
                },
                {$project: {[project]: {["$" + project]: "$appointmentStartTime"}, payableAmount: 1}},
                {$group: {_id: "$" + project, revenue: {$sum: "$payableAmount"}}}, {$sort: {_id: 1}}


            ]

        } else if (meas == 221) {
            var dt = new Date(2017, 0, 1)
            return query = [
                {
                    $match: {
                        parlorId: {$in: parlorArray},
                        "appointmentStartTime": {$gt: dt},
                        "razorPayCaptureResponse.status": "captured",
                        paymentMethod: 5
                    }
                },
                {$project: {[project]: {["$" + project]: "$appointmentStartTime"}, payableAmount: 1}},
                {$group: {_id: "$" + project, revenue: {$sum: 1}}}, {$sort: {_id: 1}}


            ]

        }

    }

    function queries4(meas) {
        console.log(meas)

        if (meas == 201) {

            return query = [
                {$unwind: "$creditsHistory"},
                {
                    $match: {
                        $or: [{"creditsHistory.reason": "100% cashback"}, {"creditsHistory.reason": "50% cashback"},
                            {"creditsHistory.reason": "10% cashback"}, {"creditsHistory.reason": "5% cashback"},]
                    }
                },
                {$group: {_id: "$creditsHistory.reason", revenue: {$sum: "$creditsHistory.amount"}, count: {$sum: 1}}}
            ]

        } else if (meas == 207) {
            
            return query = [
                {$unwind: "$creditsHistory"},
                {
                    $match: {
                        $or: [{"creditsHistory.reason": "100% cashback"}, {"creditsHistory.reason": "50% cashback"},
                              {"creditsHistory.reason": "10% cashback"}, {"creditsHistory.reason": "5% cashback"},]
                    }
                },
                {$group: {_id: "$creditsHistory.reason", revenue: {$sum: "$creditsHistory.amount"}, count: {$sum: 1}}},
                {$project:{_id:1,revenue:{$divide:["$revenue",""]}}}
                
            ]

        }

    }

    function queries5(meas, multi) {

        console.log(meas, multi)

        if (meas == 201) {
            if (multi == 1) {


                var dim = '';

                if ((req.body.data[0].data[0].Id == 101 && req.body.data[0].data[1].Id == 105) || (req.body.data[0].data[1].Id == 101 && req.body.data[0].data[0].Id == 105)) {

                    dim = "month";

                } else if ((req.body.data[0].data[0].Id == 101 && req.body.data[0].data[1].Id == 106) || (req.body.data[0].data[1].Id == 101 && req.body.data[0].data[0].Id == 106)) {

                    dim = "isoDayOfWeek";
                } else if ((req.body.data[0].data[0].Id == 101 && req.body.data[0].data[1].Id == 107) || (req.body.data[0].data[1].Id == 101 && req.body.data[0].data[0].Id == 107)) {

                    dim = "hour";
                } else if ((req.body.data[0].data[0].Id == 101 && req.body.data[0].data[1].Id == 108) || (req.body.data[0].data[1].Id == 101 && req.body.data[0].data[0].Id == 108)) {

                    dim = "week";
                }


                return [{
                    $match: {
                        status: 3,
                        "appointmentStartTime": {
                            $gte: new Date(req.body.date.startDate),
                            $lt: new Date(req.body.date.endDate)
                        }
                    }
                },


                    {
                        $project: {
                            [dim]: {["$" + dim]: "$appointmentStartTime"},
                            "parlorId": 1,
                            revenue: {$add: ["$productRevenue", "$serviceRevenue"]}
                        }
                    },

                    {
                        $group: {
                            _id: "$" + dim, data: {
                                $push: {
                                    "parlorId": "$parlorId",
                                    revenue: "$revenue"
                                }
                            }
                        }
                    }

                ]

            } else if (multi == 0) {

                return [
                    {
                        $match: {
                            "status": 3,
                            "appointmentStartTime": {
                                $gte: new Date(req.body.date.startDate),
                                $lt: new Date(req.body.date.endDate)
                            }
                        }
                    },
                    {
                        $project: {
                            subtotal: 1,
                            loyalityPoints: 1,
                            loyalityOffer: 1,
                            payableAmount: 1,
                            serviceRevenue: 1,
                            productRevenue: 1,
                            percentage: {
                                "$multiply": [100, {
                                    $cond: [
                                        {$eq: [{$subtract: ["$subtotal", "$loyalityOffer"]}, 0]},
                                        0,
                                        {"$divide": [{$subtract: ["$loyalityPoints", "$loyalityOffer"]}, {$subtract: ["$subtotal", "$loyalityOffer"]}]}


                                    ]
                                }]
                            }
                        }
                    },

                    {
                        $group: {
                            _id: "$percentage",
                            "subtotal1": {$sum: "$subtotal"},
                            "payableAmount1": {$sum: "$payableAmount"},
                            "loyalityPoints1": {$sum: "$loyalityPoints"},
                            "loyalityOffer1": {$sum: "$loyalityOffer"},
                            "serviceRevenue1": {$sum: "$serviceRevenue"},
                            "productRevenue1": {$sum: "$productRevenue"},


                        }
                    },

                    {
                        $project: {
                            "range": {
                                $concat: [
                                    {$cond: [{$and: [{$gt: ["$_id", 0]}, {$lt: ["$_id", 6]}]}, "0-6%", ""]},
                                    {$cond: [{$and: [{$gte: ["$_id", 6]}, {$lt: ["$_id", 12]}]}, "6-12% ", ""]},
                                    {$cond: [{$and: [{$gte: ["$_id", 12]}, {$lt: ["$_id", 18]}]}, "12 - 18%", ""]},
                                    {$cond: [{$and: [{$gte: ["$_id", 18]}, {$lt: ["$_id", 26]}]}, "18 - 26%", ""]},
                                    {$cond: [{$gte: ["$_id", 26]}, "Over 26%", ""]}
                                ]
                            },
                            "subtotal1": 1,
                            "payableAmount1": 1,
                            "loyalityPoints1": 1,
                            "loyalityOffer1": 1,
                            "serviceRevenue1": 1,
                            "productRevenue1": 1,
                            "freebie": {$subtract: ["$loyalityPoints1", "$loyalityOffer1"]},
                            "revenue": {$add: ["$serviceRevenue1", "$productRevenue1"]}
                        }
                    },

                    {
                        $group: {
                            "_id": "$range",
                            // revenue: {
                            //     $sum: 1
                            // }
                            // "subtotal": {$sum: "$subtotal1"},
                            // "payableAmount": {$sum: "$payableAmount1"},
                            // "loyalityPoints": {$sum: "$loyalityPoints1"},
                            // "loyalityOffer": {$sum: "$loyalityOffer1"},
                            "revenue": {$sum: "$revenue"},
                            // "revenue": {$sum: "$freebie"}

                        }
                    }


                ]

            }
        } else if (meas == 202) {
            if (multi == 1) {
                console.log('called')
                console.log(req.body.data[0].data[1].Id)

                var dim = '';

                if ((req.body.data[0].data[0].Id == 101 && req.body.data[0].data[1].Id == 105) || (req.body.data[0].data[1].Id == 101 && req.body.data[0].data[0].Id == 105)) {

                    dim = "month";

                } else if ((req.body.data[0].data[0].Id == 101 && req.body.data[0].data[1].Id == 106) || (req.body.data[0].data[1].Id == 101 && req.body.data[0].data[0].Id == 106)) {

                    dim = "isoDayOfWeek";
                } else if ((req.body.data[0].data[0].Id == 101 && req.body.data[0].data[1].Id == 107) || (req.body.data[0].data[1].Id == 101 && req.body.data[0].data[0].Id == 107)) {

                    dim = "hour";
                } else if ((req.body.data[0].data[0].Id == 101 && req.body.data[0].data[1].Id == 108) || (req.body.data[0].data[1].Id == 101 && req.body.data[0].data[0].Id == 108)) {

                    dim = "week";
                }


                return [{
                    $match: {
                        status: 3,
                        "appointmentStartTime": {
                            $gte: new Date(req.body.date.startDate),
                            $lt: new Date(req.body.date.endDate)
                        }
                    }
                },


                    {
                        $project: {
                            [dim]: {["$" + dim]: "$appointmentStartTime"},
                            "parlorId": 1,
                            revenue: "$serviceRevenue"
                        }

                    },

                    {
                        $group: {
                            _id: "$" + dim, data: {
                                $push: {
                                    "parlorId": "$parlorId",
                                    revenue: "$revenue"
                                }
                            }
                        }
                    }

                ]

            }


        } else if (meas == 205) {

            if (multi == 1) {
                console.log('called')
                console.log(req.body.data[0].data[1].Id)

                var dim = '';

                if ((req.body.data[0].data[0].Id == 101 && req.body.data[0].data[1].Id == 105) || (req.body.data[0].data[1].Id == 101 && req.body.data[0].data[0].Id == 105)) {

                    dim = "month";

                } else if ((req.body.data[0].data[0].Id == 101 && req.body.data[0].data[1].Id == 106) || (req.body.data[0].data[1].Id == 101 && req.body.data[0].data[0].Id == 106)) {

                    dim = "isoDayOfWeek";
                } else if ((req.body.data[0].data[0].Id == 101 && req.body.data[0].data[1].Id == 107) || (req.body.data[0].data[1].Id == 101 && req.body.data[0].data[0].Id == 107)) {

                    dim = "hour";
                } else if ((req.body.data[0].data[0].Id == 101 && req.body.data[0].data[1].Id == 108) || (req.body.data[0].data[1].Id == 101 && req.body.data[0].data[0].Id == 108)) {

                    dim = "week";
                }


                return [{
                    $match: {
                        status: 3,
                        "appointmentStartTime": {
                            $gte: new Date(req.body.date.startDate),
                            $lt: new Date(req.body.date.endDate)
                        }
                    }
                },


                    {
                        $project: {
                            [dim]: {["$" + dim]: "$appointmentStartTime"},
                            "parlorId": 1,
                            revenue: "$productRevenue"
                        }

                    },

                    {
                        $group: {
                            _id: "$" + dim, data: {
                                $push: {
                                    "parlorId": "$parlorId",
                                    revenue: "$revenue"
                                }
                            }
                        }
                    }

                ]

            }

        } else if (meas == 203) {

            if (multi == 1) {
                console.log('called')
                console.log(req.body.data[0].data[1].Id)

                var dim = '';

                if ((req.body.data[0].data[0].Id == 101 && req.body.data[0].data[1].Id == 105) || (req.body.data[0].data[1].Id == 101 && req.body.data[0].data[0].Id == 105)) {

                    dim = "month";

                } else if ((req.body.data[0].data[0].Id == 101 && req.body.data[0].data[1].Id == 106) || (req.body.data[0].data[1].Id == 101 && req.body.data[0].data[0].Id == 106)) {

                    dim = "isoDayOfWeek";
                } else if ((req.body.data[0].data[0].Id == 101 && req.body.data[0].data[1].Id == 107) || (req.body.data[0].data[1].Id == 101 && req.body.data[0].data[0].Id == 107)) {

                    dim = "hour";
                } else if ((req.body.data[0].data[0].Id == 101 && req.body.data[0].data[1].Id == 108) || (req.body.data[0].data[1].Id == 101 && req.body.data[0].data[0].Id == 108)) {

                    dim = "week";
                }


                return [{
                    $match: {
                        status: 3,
                        "appointmentStartTime": {
                            $gte: new Date(req.body.date.startDate),
                            $lt: new Date(req.body.date.endDate)
                        }
                    }
                },


                    {
                        $project: {
                            [dim]: {["$" + dim]: "$appointmentStartTime"},
                            "parlorId": 1,
                            revenue: "$loyalityPoints"
                        }

                    },

                    {
                        $group: {
                            _id: "$" + dim, data: {
                                $push: {
                                    "parlorId": "$parlorId",
                                    revenue: "$revenue"
                                }
                            }
                        }
                    }

                ]

            }

        } else if (meas == 204) {

            if (multi == 1) {
                console.log('called')
                console.log(req.body.data[0].data[1].Id)

                var dim = '';

                if ((req.body.data[0].data[0].Id == 101 && req.body.data[0].data[1].Id == 105) || (req.body.data[0].data[1].Id == 101 && req.body.data[0].data[0].Id == 105)) {

                    dim = "month";

                } else if ((req.body.data[0].data[0].Id == 101 && req.body.data[0].data[1].Id == 106) || (req.body.data[0].data[1].Id == 101 && req.body.data[0].data[0].Id == 106)) {

                    dim = "isoDayOfWeek";
                } else if ((req.body.data[0].data[0].Id == 101 && req.body.data[0].data[1].Id == 107) || (req.body.data[0].data[1].Id == 101 && req.body.data[0].data[0].Id == 107)) {

                    dim = "hour";
                } else if ((req.body.data[0].data[0].Id == 101 && req.body.data[0].data[1].Id == 108) || (req.body.data[0].data[1].Id == 101 && req.body.data[0].data[0].Id == 108)) {

                    dim = "week";
                }


                return [{
                    $match: {
                        status: 3,
                        "appointmentStartTime": {
                            $gte: new Date(req.body.date.startDate),
                            $lt: new Date(req.body.date.endDate)
                        }
                    }
                },


                    {
                        $project: {
                            [dim]: {["$" + dim]: "$appointmentStartTime"},
                            "parlorId": 1,
                            revenue: {$sum: 1}
                        }

                    },

                    {
                        $group: {
                            _id: "$" + dim, data: {
                                $push: {
                                    "parlorId": "$parlorId",
                                    revenue: "$revenue"
                                }
                            }
                        }
                    }

                ]

            }

        } else if (meas == 206) {

            if (multi == 1) {
                console.log('called')
                console.log(req.body.data[0].data[1].Id)

                var dim = '';

                if ((req.body.data[0].data[0].Id == 101 && req.body.data[0].data[1].Id == 105) || (req.body.data[0].data[1].Id == 101 && req.body.data[0].data[0].Id == 105)) {

                    dim = "month";

                } else if ((req.body.data[0].data[0].Id == 101 && req.body.data[0].data[1].Id == 106) || (req.body.data[0].data[1].Id == 101 && req.body.data[0].data[0].Id == 106)) {

                    dim = "isoDayOfWeek";
                } else if ((req.body.data[0].data[0].Id == 101 && req.body.data[0].data[1].Id == 107) || (req.body.data[0].data[1].Id == 101 && req.body.data[0].data[0].Id == 107)) {

                    dim = "hour";
                } else if ((req.body.data[0].data[0].Id == 101 && req.body.data[0].data[1].Id == 108) || (req.body.data[0].data[1].Id == 101 && req.body.data[0].data[0].Id == 108)) {

                    dim = "week";
                }


                return [

                    {
                        $match: {   //unwind
                            "appointmentStartTime": {
                                $gte: new Date(req.body.date.startDate),
                                $lt: new Date(req.body.date.endDate)
                            },

                            "services.discountMedium": "frequency",
                            "services.dealId": null,
                            "services.dealPriceUsed": true,
                            status: 3
                        }
                    },

                    {
                        "$project": {
                            "month": {["$" + dim]: "$appointmentStartTime"},
                            "parlorId": 1,
                            "revenue": {$sum: 1}
                        }
                    },
                    {"$group": {"_id": "$" + dim, "data": {"$push": {"parlorId": "$parlorId", "revenue": "$revenue"}}}}]

            }

        } else if (meas == 207) {

            if (multi == 1) {
                console.log('called')
                console.log(req.body.data[0].data[1].Id)

                var dim = '';

                if ((req.body.data[0].data[0].Id == 101 && req.body.data[0].data[1].Id == 105) || (req.body.data[0].data[1].Id == 101 && req.body.data[0].data[0].Id == 105)) {

                    dim = "month";

                } else if ((req.body.data[0].data[0].Id == 101 && req.body.data[0].data[1].Id == 106) || (req.body.data[0].data[1].Id == 101 && req.body.data[0].data[0].Id == 106)) {

                    dim = "isoDayOfWeek";
                } else if ((req.body.data[0].data[0].Id == 101 && req.body.data[0].data[1].Id == 107) || (req.body.data[0].data[1].Id == 101 && req.body.data[0].data[0].Id == 107)) {

                    dim = "hour";
                } else if ((req.body.data[0].data[0].Id == 101 && req.body.data[0].data[1].Id == 108) || (req.body.data[0].data[1].Id == 101 && req.body.data[0].data[0].Id == 108)) {

                    dim = "week";
                }


                return [

                    {
                        $match: {
                            status: 3,
                            "appointmentStartTime": {
                                $gte: new Date(req.body.date.startDate),
                                $lt: new Date(req.body.date.endDate)
                            }

                        }
                    },

                    {
                        "$project": {
                            "month": {["$" + dim]: "$appointmentStartTime"},
                            "parlorId": 1,
                            service: {$sum: "$serviceRevenue"},
                            count: {$sum: 1},
                            product: {$sum: "$productRevenue"}
                        }
                    },

                    {
                        "$group": {
                            "_id": "$" + dim,
                            "data": {
                                "$push": {
                                    "parlorId": "$parlorId",
                                    "revenue": {$divide: [{"$add": ["$service", "$product"]}, "$count"]}
                                }
                            }
                        }
                    }]

            }

        } else if (meas == 208) {

            if (multi == 1) {
                console.log('called')
                console.log(req.body.data[0].data[1].Id)

                var dim = '';

                if ((req.body.data[0].data[0].Id == 101 && req.body.data[0].data[1].Id == 105) || (req.body.data[0].data[1].Id == 101 && req.body.data[0].data[0].Id == 105)) {

                    dim = "month";

                } else if ((req.body.data[0].data[0].Id == 101 && req.body.data[0].data[1].Id == 106) || (req.body.data[0].data[1].Id == 101 && req.body.data[0].data[0].Id == 106)) {

                    dim = "isoDayOfWeek";
                } else if ((req.body.data[0].data[0].Id == 101 && req.body.data[0].data[1].Id == 107) || (req.body.data[0].data[1].Id == 101 && req.body.data[0].data[0].Id == 107)) {

                    dim = "hour";
                } else if ((req.body.data[0].data[0].Id == 101 && req.body.data[0].data[1].Id == 108) || (req.body.data[0].data[1].Id == 101 && req.body.data[0].data[0].Id == 108)) {

                    dim = "week";
                }

                return [

                    {
                        $match: {
                            status: 3,
                            "appointmentStartTime": {
                                $gte: new Date(req.body.date.startDate),
                                $lt: new Date(req.body.date.endDate)
                            }

                        }
                    },
                    {"$unwind": "$services"},

                    {
                        "$project": {
                            "month": {["$" + dim]: "$appointmentStartTime"},
                            "parlorId": 1,
                            revenue: {"$sum": "$services.price"},
                            count: {$sum: 1},
                            product: {$sum: "$productRevenue"}
                        }
                    },

                    {
                        "$group": {
                            "_id": "$" + dim, "data": {
                                "$push": {
                                    "parlorId": "$parlorId", "revenue": {
                                        "$multiply": [75, {
                                            "$divide": ["$revenue", 100]
                                        }]
                                    }
                                }
                            }
                        }
                    }]

            }

        } else if (meas == 213) {

            if (multi == 1) {
                console.log('called')
                console.log(req.body.data[0].data[1].Id)

                var dim = '';

                if ((req.body.data[0].data[0].Id == 101 && req.body.data[0].data[1].Id == 105) || (req.body.data[0].data[1].Id == 101 && req.body.data[0].data[0].Id == 105)) {

                    dim = "month";

                } else if ((req.body.data[0].data[0].Id == 101 && req.body.data[0].data[1].Id == 106) || (req.body.data[0].data[1].Id == 101 && req.body.data[0].data[0].Id == 106)) {

                    dim = "isoDayOfWeek";
                } else if ((req.body.data[0].data[0].Id == 101 && req.body.data[0].data[1].Id == 107) || (req.body.data[0].data[1].Id == 101 && req.body.data[0].data[0].Id == 107)) {

                    dim = "hour";
                } else if ((req.body.data[0].data[0].Id == 101 && req.body.data[0].data[1].Id == 108) || (req.body.data[0].data[1].Id == 101 && req.body.data[0].data[0].Id == 108)) {

                    dim = "week";
                }

                // req=[{"$unwind":"$services"},{"$unwind":"$client"},{"$match":{"appointmentStartTime"
                //     :{"$gte":"2017-06-30T18:30:00.000Z","$lt":"2017-07-17T06:18:34.322Z"},"services.
                // discountMedium":"frequency","services.dealId":null,"services.dealPriceUsed":true
                //     ,"status":3}},{"$lookup":{"from":"users","localField":"client.id","foreignField"
                //     :"_id","as":"newData"}},{"$project":{"newData":1,"services":1}},{"$unwind":"$new
                //     Data"},{"$match":{"$or":[{"newData.freeHairCutBar":null}]}},{"$group":{"_id":nul
                //     l,"revenue":{"$sum":"$services.price"}}}]

                return [{"$unwind": "$services"}, {"$unwind": "$client"},

                    {
                        $match: {
                            status: 3,
                            "appointmentStartTime": {
                                $gte: new Date(req.body.date.startDate),
                                $lt: new Date(req.body.date.endDate)
                            },
                            "services.discountMedium": "frequency",
                            "services.dealId": null,
                            "services.dealPriceUsed": true

                        }
                    },
                    {
                        "$lookup": {
                            "from": "users", "localField": "client.id", "foreignField": "_id", "as": "newData"
                        }
                    },

                    {"$project": {"appointmentStartTime": 1, parlorId: 1, "newData": 1, "services": 1}},
                    {"$unwind": "$newData"},
                    {"$match": {"$or": [{"newData.freeHairCutBar": null}]}},

                    {
                        "$project": {
                            "month": {["$" + dim]: "$appointmentStartTime"},
                            "parlorId": 1,
                            revenue: {"$sum": "$services.price"}
                        }
                    },

                    {
                        "$group": {
                            "_id": "$" + dim,
                            "data": {"$push": {"parlorId": "$parlorId", "revenue": {$sum: "$revenue"}}}
                        }
                    }]

            }

        } else if (meas == 214) {

            if (multi == 1) {
                console.log('called')
                console.log(req.body.data[0].data[1].Id)

                var dim = '';

                if ((req.body.data[0].data[0].Id == 101 && req.body.data[0].data[1].Id == 105) || (req.body.data[0].data[1].Id == 101 && req.body.data[0].data[0].Id == 105)) {

                    dim = "month";

                } else if ((req.body.data[0].data[0].Id == 101 && req.body.data[0].data[1].Id == 106) || (req.body.data[0].data[1].Id == 101 && req.body.data[0].data[0].Id == 106)) {

                    dim = "isoDayOfWeek";
                } else if ((req.body.data[0].data[0].Id == 101 && req.body.data[0].data[1].Id == 107) || (req.body.data[0].data[1].Id == 101 && req.body.data[0].data[0].Id == 107)) {

                    dim = "hour";
                } else if ((req.body.data[0].data[0].Id == 101 && req.body.data[0].data[1].Id == 108) || (req.body.data[0].data[1].Id == 101 && req.body.data[0].data[0].Id == 108)) {

                    dim = "week";
                }


                return [{"$unwind": "$services"}, {"$unwind": "$client"},

                    {
                        $match: {
                            status: 3,
                            "appointmentStartTime": {
                                $gte: new Date(req.body.date.startDate),
                                $lt: new Date(req.body.date.endDate)
                            },
                            "services.discountMedium": "frequency",
                            "services.dealId": null,
                            "services.dealPriceUsed": true

                        }
                    },
                    {
                        "$lookup": {
                            "from": "users", "localField": "client.id", "foreignField": "_id", "as": "newData"
                        }
                    },

                    {"$project": {"appointmentStartTime": 1, parlorId: 1, "newData": 1, "services": 1}},
                    {"$unwind": "$newData"},
                    {"$match": {"$or": [{"newData.freeHairCutBar": {"$gt": 0}}]}},

                    {
                        "$project": {
                            "month": {["$" + dim]: "$appointmentStartTime"},
                            "parlorId": 1,
                            revenue: {"$sum": "$services.price"}
                        }
                    },

                    {
                        "$group": {
                            "_id": "$" + dim,
                            "data": {"$push": {"parlorId": "$parlorId", "revenue": {$sum: "$revenue"}}}
                        }
                    }]

            }

        } else if (meas == 222) {
            return [
                {
                    $match: {
                        "status": 3,
                        "appointmentStartTime": {
                            $gte: new Date(req.body.date.startDate),
                            $lt: new Date(req.body.date.endDate)
                        }
                    }
                },
                {
                    $project: {
                        subtotal: 1,
                        loyalityPoints: 1,
                        loyalityOffer: 1,
                        payableAmount: 1,
                        serviceRevenue: 1,
                        productRevenue: 1,
                        percentage: {
                            "$multiply": [100, {
                                $cond: [
                                    {$eq: [{$subtract: ["$subtotal", "$loyalityOffer"]}, 0]},
                                    0,
                                    {"$divide": [{$subtract: ["$loyalityPoints", "$loyalityOffer"]}, {$subtract: ["$subtotal", "$loyalityOffer"]}]}


                                ]
                            }]
                        }
                    }
                },

                {
                    $group: {
                        _id: "$percentage",
                        "subtotal1": {$sum: "$subtotal"},
                        "payableAmount1": {$sum: "$payableAmount"},
                        "loyalityPoints1": {$sum: "$loyalityPoints"},
                        "loyalityOffer1": {$sum: "$loyalityOffer"},
                        "serviceRevenue1": {$sum: "$serviceRevenue"},
                        "productRevenue1": {$sum: "$productRevenue"},


                    }
                },

                {
                    $project: {
                        "range": {
                            $concat: [
                                {$cond: [{$and: [{$gt: ["$_id", 0]}, {$lt: ["$_id", 6]}]}, "0-6%", ""]},
                                {$cond: [{$and: [{$gte: ["$_id", 6]}, {$lt: ["$_id", 12]}]}, "6-12% ", ""]},
                                {$cond: [{$and: [{$gte: ["$_id", 12]}, {$lt: ["$_id", 18]}]}, "12 - 18%", ""]},
                                {$cond: [{$and: [{$gte: ["$_id", 18]}, {$lt: ["$_id", 26]}]}, "18 - 26%", ""]},
                                {$cond: [{$gte: ["$_id", 26]}, "Over 26", ""]}
                            ]
                        },
                        "subtotal1": 1,
                        "payableAmount1": 1,
                        "loyalityPoints1": 1,
                        "loyalityOffer1": 1,
                        "serviceRevenue1": 1,
                        "productRevenue1": 1,
                        "freebie": {$subtract: ["$loyalityPoints1", "$loyalityOffer1"]},
                        "revenue": {$add: ["$serviceRevenue1", "$productRevenue1"]}
                    }
                },

                {
                    $group: {
                        "_id": "$range",
                        revenue: {
                            $sum: 1
                        }
                        // "subtotal": {$sum: "$subtotal1"},
                        // "payableAmount": {$sum: "$payableAmount1"},
                        // "loyalityPoints": {$sum: "$loyalityPoints1"},
                        // "loyalityOffer": {$sum: "$loyalityOffer1"},
                        // "revenue": {$sum: "$revenue"},
                        // "freebie": {$sum: "$freebie"}

                    }
                }


            ]
        } else if (meas == 223) {

            return [
                {
                    $match: {
                        "status": 3,
                        "appointmentStartTime": {
                            $gte: new Date(req.body.date.startDate),
                            $lt: new Date(req.body.date.endDate)
                        }
                    }
                },
                {
                    $project: {
                        subtotal: 1,
                        loyalityPoints: 1,
                        loyalityOffer: 1,
                        payableAmount: 1,
                        serviceRevenue: 1,
                        productRevenue: 1,
                        percentage: {
                            "$multiply": [100, {
                                $cond: [
                                    {$eq: [{$subtract: ["$subtotal", "$loyalityOffer"]}, 0]},
                                    0,
                                    {"$divide": [{$subtract: ["$loyalityPoints", "$loyalityOffer"]}, {$subtract: ["$subtotal", "$loyalityOffer"]}]}


                                ]
                            }]
                        }
                    }
                },

                {
                    $group: {
                        _id: "$percentage",
                        "subtotal1": {$sum: "$subtotal"},
                        "payableAmount1": {$sum: "$payableAmount"},
                        "loyalityPoints1": {$sum: "$loyalityPoints"},
                        "loyalityOffer1": {$sum: "$loyalityOffer"},
                        "serviceRevenue1": {$sum: "$serviceRevenue"},
                        "productRevenue1": {$sum: "$productRevenue"},


                    }
                },

                {
                    $project: {
                        "range": {
                            $concat: [
                                {$cond: [{$and: [{$gt: ["$_id", 0]}, {$lt: ["$_id", 6]}]}, "0-6%", ""]},
                                {$cond: [{$and: [{$gte: ["$_id", 6]}, {$lt: ["$_id", 12]}]}, "6-12% ", ""]},
                                {$cond: [{$and: [{$gte: ["$_id", 12]}, {$lt: ["$_id", 18]}]}, "12 - 18%", ""]},
                                {$cond: [{$and: [{$gte: ["$_id", 18]}, {$lt: ["$_id", 26]}]}, "18 - 26%", ""]},
                                {$cond: [{$gte: ["$_id", 26]}, "Over 26%", ""]}
                            ]
                        },
                        "subtotal1": 1,
                        "payableAmount1": 1,
                        "loyalityPoints1": 1,
                        "loyalityOffer1": 1,
                        "serviceRevenue1": 1,
                        "productRevenue1": 1,
                        "freebie": {$subtract: ["$loyalityPoints1", "$loyalityOffer1"]},
                        "revenue": {$add: ["$serviceRevenue1", "$productRevenue1"]}
                    }
                },

                {
                    $group: {
                        "_id": "$range",
                        // revenue: {
                        //     $sum: 1
                        // }
                        // "subtotal": {$sum: "$subtotal1"},
                        // "payableAmount": {$sum: "$payableAmount1"},
                        // "loyalityPoints": {$sum: "$loyalityPoints1"},
                        // "loyalityOffer": {$sum: "$loyalityOffer1"},
                        // "revenue": {$sum: "$revenue"},
                        "revenue": {$sum: "$freebie"}

                    }
                }


            ]

        }


    }


    console.log(req.body)
    if (req.body.data[0].status == 0) {

        var fData2 = []

        if (req.body.data[0].data[0].Id == 101) {
            console.log("mainnnnnnnnnnnnnnnnnnnnnnnnnn", req.body.data[0].data[0].Id);
            var t = 0;
            async.each(req.body.data[1].Ids, function (meas, callback4) {
                var query = []
                var fData = []
                console.log(meas.id)
                Parlor.find({}, {_id: 1, name: 1}, function (err, parlors1) {

                    async.each(parlors1, function (item, callback) {
                        console.log(item.name);
                        query = queries(item, meas.id)
                        console.log(JSON.stringify(query))
                        Appointment.aggregate(query, function (err, rev) {
                            fData.push({parlorName: item.name, data: rev})
                            console.log(t++)
                            callback()

                        })
                    }, function (done) {

                        console.log("qqqqqqqqqqqqqqqqqqqq", meas)
                        console.log("------------------------------------------")
                        fData2.push({id: meas.id, name: meas.name, data: fData})

                        t = 0;
                        callback4()
                    })
                })


            }, function (norm) {
                var data1 = _.map(fData2, function (t) {
                    return {
                        id: t.id, name: t.name, data: _.orderBy(t.data, function (l) {
                            return l.parlorName
                        })
                    }
                })
                res.json(CreateObjService.response(false, fData2))
            })
        } else if (req.body.data[0].data[0].Id == 102) {
            console.log("entered in 102")

            var query = [];
            var fData = [];

            var parlorArray = [];
            req.body.parlor.forEach(function (p) {
                parlorArray.push(ObjectId(p))
            })


            var match = {
                status: 3,
                parlorId: {$in: parlorArray},
                "appointmentStartTime": {$gte: new Date(req.body.date.startDate), $lt: new Date(req.body.date.endDate)}
            }

            console.log(JSON.stringify(match))
            async.each(req.body.data[1].Ids, function (meas, callback4) {
                query = queries2(match, meas.id, 0)
                console.log(meas.id)

                console.log(JSON.stringify(query))
                if (meas.id == 209 || meas.id == 210 || meas.id == 211 || meas.id == 216) {
                    console.log("entered in 1")
                    User.aggregate(query, function (err, rev) {
                        console.log("data", rev)
                        fData.push({id: meas.id, name: meas.name, data: [{parlorName: "Be U", data: rev}]})
                        callback4()

                    })
                } else {
                    console.log("entered in 2")
                    Appointment.aggregate(query, function (err, rev) {
                        console.log("data", rev)
                        fData.push({id: meas, name: meas.name, data: [{parlorName: "Be U", data: rev}]})
                        callback4()

                    })
                }

            }, function (done) {

                var data1 = _.map(fData, function (t) {
                    return {
                        id: t.id, data: _.orderBy(t.data, function (l) {
                            return l.parlorName
                        })
                    }
                })
                console.log("ggggggggggggggggggg", JSON.stringify(fData))

                res.json(CreateObjService.response(false, fData))

            })

        } else if (req.body.data[0].data[0].Id == 104) {
            console.log("entered in")
            var query = []
            var fData = []

            var group = {}

            async.each(req.body.data[1].Ids, function (meas, callback4) {
                console.log("lllllllllllll", meas)
                query = queries3(group, meas.id, 0);
                console.log(JSON.stringify(query));
                if (meas.id == 209 || meas.id == 210 || meas.id == 211 || meas.id == 216) {
                    console.log("entered in 1")
                    User.aggregate(query, function (err, rev) {
                        console.log("data", rev)
                        var data = _.map(rev, function (l) {

                            return {
                                parlorName: l._id,
                                data: [{revenue: l.revenue}]
                            }

                        })
                        fData.push({id: meas, name: meas.name, data: data})
                        // fData.push({id: meas.id, name: meas.name, data: [{parlorName: "Be U", data: rev}]})
                        callback4()

                    })
                } else {
                    console.log("entered in 2")
                    Appointment.aggregate(query, function (err, rev) {
                        var data = _.map(rev, function (l) {

                            return {
                                parlorName: l._id,
                                data: [{revenue: l.revenue}]
                            }

                        })
                        fData.push({id: meas, name: meas.name, data: data})
                        // res.json(CreateObjService.response(false, fData))

                        callback4()

                    })
                }

            }, function (done) {


                var data1 = _.map(fData, function (t) {
                    return {
                        id: t.id, data: _.orderBy(t.data, function (l) {
                            return l.parlorName
                        })
                    }
                })
                console.log("ggggggggggggggggggg", JSON.stringify(fData))

                res.json(CreateObjService.response(false, fData))

            })


        } else if (req.body.data[0].data[0].Id == 105) {
            console.log("entered in")
            var query = []
            var fData = []

            var group = {}
            group = {
                _id: {$dateToString: {format: "%Y-%m-%d", date: "$appointmentStartTime"}},
                service: {$sum: "$serviceRevenue"},
                product: {$sum: "$productRevenue"}
            }

            async.each(req.body.data[1].Ids, function (meas, callback4) {
                console.log("lllllllllllll", meas)
                query = queries3(group, meas.id, 1, "month")
                console.log(JSON.stringify(query))
                if (meas.id == 209 || meas.id == 210 || meas.id == 211 || meas.id == 216) {
                    console.log("entered in 1")
                    User.aggregate(query, function (err, rev) {
                        console.log("data", rev)
                        var data = _.map(rev, function (l) {
                            return {
                                parlorName: getMonthName(l._id),
                                data: [{revenue: l.revenue}]
                            }

                        })
                        fData.push({id: meas, name: meas.name, data: data})
                        // fData.push({id: meas.id, name: meas.name, data: [{parlorName: "Be U", data: rev}]})
                        callback4()

                    })
                } else {
                    console.log("entered in 2")
                    Appointment.aggregate(query, function (err, rev) {


                        console.log('qqqqqqqqqqq', rev)
                        var data = _.map(rev, function (l) {
                            return {
                                parlorName: getMonthName(l._id),
                                data: [{revenue: l.revenue}]
                            }

                        })

                        fData.push({id: meas, name: meas.name, data: data})
                        // res.json(CreateObjService.response(false, fData))

                        callback4()

                    })
                }

            }, function (done) {


                var data1 = _.map(fData, function (t) {
                    return {
                        id: t.id, data: _.orderBy(t.data, function (l) {
                            return l.parlorName
                        })
                    }
                })
                console.log("ggggggggggggggggggg", JSON.stringify(fData))

                res.json(CreateObjService.response(false, fData))

            })


        } else if (req.body.data[0].data[0].Id == 106) {
            console.log("entered in 106")
            var query = []
            var fData = []


            async.each(req.body.data[1].Ids, function (meas, callback4) {
                console.log("lllllllllllll", meas)
                query = queries3(group, meas.id, 1, "isoDayOfWeek")
                // console.log(query)
                if (meas.id == 209 || meas.id == 210 || meas.id == 211 || meas.id == 216) {
                    console.log("entered in 1")
                    User.aggregate(query, function (err, rev) {
                        console.log("data", rev)
                        var data = _.map(rev, function (l) {
                            return {
                                parlorName: getDayName(l._id),
                                data: [{revenue: l.revenue}]
                            }

                        })
                        fData.push({id: meas, name: meas.name, data: data})
                        // fData.push({id: meas.id, name: meas.name, data: [{parlorName: "Be U", data: rev}]})
                        callback4()

                    })
                } else {
                    console.log("entered in 2")
                    console.log(JSON.stringify(query))
                    Appointment.aggregate(query, function (err, rev) {
                        var data = _.map(rev, function (l) {
                            return {
                                parlorName: getDayName(l._id),
                                data: [{revenue: l.revenue}]
                            }

                        })

                        fData.push({id: meas, name: meas.name, data: data})

                        // res.json(CreateObjService.response(false, fData))

                        callback4()

                    })
                }

            }, function (done) {

                console.log(JSON.stringify(fData))
                var data1 = _.map(fData, function (t) {
                    return {
                        id: t.id, data: _.orderBy(t.data, function (l) {
                            return l.parlorName
                        })
                    }
                })
                console.log("ggggggggggggggggggg", JSON.stringify(fData))

                res.json(CreateObjService.response(false, fData))

            })


        } else if (req.body.data[0].data[0].Id == 107) {
            console.log("entered in 106")
            var query = []
            var fData = []


            async.each(req.body.data[1].Ids, function (meas, callback4) {
                console.log("lllllllllllll", meas)
                query = queries3(group, meas.id, 1, "hour")
                // console.log(query)
                if (meas.id == 209 || meas.id == 210 || meas.id == 211 || meas.id == 216) {
                    console.log("entered in 1")
                    User.aggregate(query, function (err, rev) {
                        console.log("data", rev)
                        var data = _.map(rev, function (l) {
                            return {
                                parlorName: getTimeName(l._id),
                                data: [{revenue: l.revenue}]
                            }

                        })
                        fData.push({id: meas, name: meas.name, data: data})
                        // fData.push({id: meas.id, name: meas.name, data: [{parlorName: "Be U", data: rev}]})
                        callback4()

                    })
                } else {
                    console.log("entered in 2")
                    console.log(JSON.stringify(query))
                    Appointment.aggregate(query, function (err, rev) {
                        var data = _.map(rev, function (l) {
                            return {
                                parlorName: getTimeName(l._id),
                                data: [{revenue: l.revenue}]
                            }

                        })

                        fData.push({id: meas, name: meas.name, data: data})

                        // res.json(CreateObjService.response(false, fData))

                        callback4()

                    })
                }

            }, function (done) {

                console.log(JSON.stringify(fData))
                var data1 = _.map(fData, function (t) {
                    return {
                        id: t.id, data: _.orderBy(t.data, function (l) {
                            return l.parlorName
                        })
                    }
                })
                console.log("ggggggggggggggggggg", JSON.stringify(fData))

                res.json(CreateObjService.response(false, fData))

            })


        } else if (req.body.data[0].data[0].Id == 108) {
            console.log("entered in 106")
            var query = []
            var fData = []


            async.each(req.body.data[1].Ids, function (meas, callback4) {
                console.log("lllllllllllll", meas)
                query = queries3(group, meas.id, 1, "week")
                // console.log(query)
                if (meas.id == 209 || meas.id == 210 || meas.id == 211 || meas.id == 216) {
                    console.log("entered in 1")
                    User.aggregate(query, function (err, rev) {
                        console.log("data", rev)
                        var data = _.map(rev, function (l) {
                            return {
                                parlorName: getWeekName(l._id),
                                data: [{revenue: l.revenue}]
                            }

                        })
                        fData.push({id: meas, name: meas.name, data: data})
                        // fData.push({id: meas.id, name: meas.name, data: [{parlorName: "Be U", data: rev}]})
                        callback4()

                    })
                } else {
                    console.log("entered in 2")
                    console.log(JSON.stringify(query))
                    Appointment.aggregate(query, function (err, rev) {
                        var data = _.map(rev, function (l) {
                            return {
                                parlorName: getWeekName(l._id),
                                data: [{revenue: l.revenue}]
                            }

                        })

                        fData.push({id: meas, name: meas.name, data: data})

                        // res.json(CreateObjService.response(false, fData))

                        callback4()

                    })
                }

            }, function (done) {

                console.log(JSON.stringify(fData))
                var data1 = _.map(fData, function (t) {
                    return {
                        id: t.id, data: _.orderBy(t.data, function (l) {
                            return l.parlorName
                        })
                    }
                })
                console.log("ggggggggggggggggggg", JSON.stringify(fData))

                res.json(CreateObjService.response(false, fData))

            })


        } else if (req.body.data[0].data[0].Id == 109) {
            console.log("entered in 106")
            var query = []
            var fData = []
            async.each(req.body.data[1].Ids, function (meas, callback4) {
                console.log("lllllllllllll", meas)
                query = queries2(group, meas.id, 3, "week")
                // console.log(query)
                if (meas.id == 209 || meas.id == 210 || meas.id == 211 || meas.id == 216) {
                    console.log("entered in 1")
                    User.aggregate(query, function (err, rev) {
                        console.log("data", rev)
                        var data = _.map(rev, function (l) {
                            return {
                                parlorName: l._id,
                                data: [{revenue: l.revenue}]
                            }

                        })
                        fData.push({id: meas.id, name: meas.name, data: data})
                        // fData.push({id: meas.id, name: meas.name, data: [{parlorName: "Be U", data: rev}]})
                        callback4()

                    })
                } else {
                    console.log("entered in 2")
                    console.log(JSON.stringify(query))
                    Appointment.aggregate(query, function (err, rev) {

                        console.log("data get", rev)


                        var data = _.map(rev, function (l) {
                            return {
                                parlorName: l._id,
                                data: [{revenue: l.revenue}]
                            }

                        })

                        fData.push({id: meas.id, name: meas.name, data: data})

                        // res.json(CreateObjService.response(false, fData))

                        callback4()

                    })
                }

            }, function (done) {

                console.log(JSON.stringify(fData))
                var data1 = _.map(fData, function (t) {
                    return {
                        id: t.id, data: _.orderBy(t.data, function (l) {
                            return l.parlorName
                        })
                    }
                })
                console.log("ggggggggggggggggggg", JSON.stringify(fData))

                res.json(CreateObjService.response(false, fData))

            })


        } else if (req.body.data[0].data[0].Id == 110) {
            console.log("entered in 106")
            var query = []
            var fData = []
            async.each(req.body.data[1].Ids, function (meas, callback4) {
                console.log("lllllllllllll", meas)
                query = queries2(group, meas.id, 4, "week")
                // console.log(query)
                if (meas.id == 209 || meas.id == 210 || meas.id == 211 || meas.id == 216) {
                    console.log("entered in 1")
                    User.aggregate(query, function (err, rev) {
                        console.log("data", rev)
                        var data = _.map(rev, function (l) {
                            return {
                                parlorName: l._id,
                                data: [{revenue: l.revenue}]
                            }

                        })
                        fData.push({id: meas.id, name: meas.name, data: data})
                        // fData.push({id: meas.id, name: meas.name, data: [{parlorName: "Be U", data: rev}]})
                        callback4()

                    })
                } else {
                    console.log("entered in 2")
                    console.log(JSON.stringify(query))
                    Appointment.aggregate(query, function (err, rev) {

                        console.log("data get", rev)


                        var data = _.map(rev, function (l) {
                            return {
                                parlorName: l._id,
                                data: [{revenue: l.revenue}]
                            }

                        })

                        fData.push({id: meas.id, name: meas.name, data: data})

                        // res.json(CreateObjService.response(false, fData))

                        callback4()

                    })
                }

            }, function (done) {

                console.log(JSON.stringify(fData))
                var data1 = _.map(fData, function (t) {
                    return {
                        id: t.id, data: _.orderBy(t.data, function (l) {
                            return l.parlorName
                        })
                    }
                })
                console.log("ggggggggggggggggggg", JSON.stringify(fData))

                res.json(CreateObjService.response(false, fData))

            })


        } else if (req.body.data[0].data[0].Id == 112) {
            console.log("entered in 112")
            var query = []
            var fData = []
            var match = ''
            async.each(req.body.data[1].Ids, function (meas, callback4) {
                console.log("lllllllllllll", meas)
                query = queries2(match, meas.id, 5, "week")

                if (meas.id == 209 || meas.id == 210 || meas.id == 211 || meas.id == 216) {
                    console.log("entered in 1")
                    User.aggregate(query, function (err, rev) {
                        console.log("data", rev)
                        var data = _.map(rev, function (l) {
                            return {
                                parlorName: l._id,
                                data: [{revenue: l.revenue}]
                            }

                        })
                        fData.push({id: meas.id, name: meas.name, data: data})
                        // fData.push({id: meas.id, name: meas.name, data: [{parlorName: "Be U", data: rev}]})
                        callback4()

                    })
                } else {
                    console.log("entered in 2")
                    console.log(JSON.stringify(query))
                    Appointment.aggregate(query, function (err, rev) {

                        console.log("data get", rev)


                        var data = _.map(rev, function (l) {
                            return {
                                parlorName: l._id,
                                data: [{revenue: l.revenue}]
                            }

                        });

                        fData.push({id: meas.id, name: meas.name, data: data});

                        // res.json(CreateObjService.response(false, fData))

                        callback4()

                    })
                }

            }, function (done) {

                console.log(JSON.stringify(fData))
                var data1 = _.map(fData, function (t) {
                    return {
                        id: t.id, data: _.orderBy(t.data, function (l) {
                            return l.parlorName
                        })
                    }
                })
                console.log("ggggggggggggggggggg", JSON.stringify(fData))

                res.json(CreateObjService.response(false, fData))

            })


        } else if (req.body.data[0].data[0].Id == 113) {
            console.log("entered in 106")
            var query = []
            var fData = []
            var match = {"allPaymentMethods.name": "Cash"}
            async.each(req.body.data[1].Ids, function (meas, callback4) {
                console.log("lllllllllllll", meas)
                query = queries2(match, meas.id, 6, "week")
                // console.log(query)
                if (meas.id == 209 || meas.id == 210 || meas.id == 211 || meas.id == 216) {
                    console.log("entered in 1")
                    User.aggregate(query, function (err, rev) {
                        console.log("data", rev)
                        var data = _.map(rev, function (l) {
                            return {
                                parlorName: l._id,
                                data: [{revenue: l.revenue}]
                            }

                        })
                        fData.push({id: meas.id, name: meas.name, data: data})
                        // fData.push({id: meas.id, name: meas.name, data: [{parlorName: "Be U", data: rev}]})
                        callback4()

                    })
                } else {
                    console.log("entered in 2")
                    console.log(JSON.stringify(query))
                    Appointment.aggregate(query, function (err, rev) {

                        console.log("data get", rev)


                        var data = _.map(rev, function (l) {
                            return {
                                parlorName: l._id,
                                data: [{revenue: l.revenue}]
                            }

                        })

                        fData.push({id: meas.id, name: meas.name, data: data})

                        // res.json(CreateObjService.response(false, fData))

                        callback4()

                    })
                }

            }, function (done) {

                console.log(JSON.stringify(fData))
                var data1 = _.map(fData, function (t) {
                    return {
                        id: t.id, data: _.orderBy(t.data, function (l) {
                            return l.parlorName
                        })
                    }
                })
                console.log("ggggggggggggggggggg", JSON.stringify(fData))

                res.json(CreateObjService.response(false, fData))

            })


        } else if (req.body.data[0].data[0].Id == 114) {
            console.log("entered in 106")
            var query = []
            var fData = []
            var match = {$or: [{"allPaymentMethods.name": "Be U"}, {"allPaymentMethods.name": "beu"}, {"allPaymentMethods.name": "Nearbuy"}]}


            async.each(req.body.data[1].Ids, function (meas, callback4) {
                console.log("lllllllllllll", meas)
                query = queries2(match, meas.id, 7, "week")
                // console.log(query)
                if (meas.id == 209 || meas.id == 210 || meas.id == 211 || meas.id == 216) {
                    console.log("entered in 1")
                    User.aggregate(query, function (err, rev) {
                        console.log("data", rev)
                        var data = _.map(rev, function (l) {
                            return {
                                parlorName: l._id,
                                data: [{revenue: l.revenue}]
                            }

                        })
                        fData.push({id: meas.id, name: meas.name, data: data})
                        // fData.push({id: meas.id, name: meas.name, data: [{parlorName: "Be U", data: rev}]})
                        callback4()

                    })
                } else {
                    console.log("entered in 2")
                    console.log(JSON.stringify(query))
                    Appointment.aggregate(query, function (err, rev) {

                        console.log("data get", rev)


                        var data = _.map(rev, function (l) {
                            return {
                                parlorName: l._id,
                                data: [{revenue: l.revenue}]
                            }

                        })

                        fData.push({id: meas.id, name: meas.name, data: data})

                        // res.json(CreateObjService.response(false, fData))

                        callback4()

                    })
                }

            }, function (done) {

                console.log(JSON.stringify(fData))
                var data1 = _.map(fData, function (t) {
                    return {
                        id: t.id, data: _.orderBy(t.data, function (l) {
                            return l.parlorName
                        })
                    }
                })
                console.log("ggggggggggggggggggg", JSON.stringify(fData))

                res.json(CreateObjService.response(false, fData))

            })


        }
        else if (req.body.data[0].data[0].Id == 115) {
            console.log("entered in 106")
            var query = []
            var fData = []
            var match = {$or: [{"allPaymentMethods.name": "Be U"}, {"allPaymentMethods.name": "beu"}, {"allPaymentMethods.name": "Nearbuy"}]}


            async.each(req.body.data[1].Ids, function (meas, callback4) {
                console.log("lllllllllllll", meas)
                query = queries2(match, meas.id, 7, "week")
                // console.log(query)
                if (meas.id == 209 || meas.id == 210 || meas.id == 211 || meas.id == 216) {
                    console.log("entered in 1")
                    User.aggregate(query, function (err, rev) {
                        console.log("data", rev)
                        var data = _.map(rev, function (l) {
                            return {
                                parlorName: l._id,
                                data: [{revenue: l.revenue}]
                            }

                        })
                        fData.push({id: meas.id, name: meas.name, data: data})
                        // fData.push({id: meas.id, name: meas.name, data: [{parlorName: "Be U", data: rev}]})
                        callback4()

                    })
                } else {
                    console.log("entered in 2")
                    console.log(JSON.stringify(query))
                    Appointment.aggregate(query, function (err, rev) {

                        console.log("data get", rev)


                        var data = _.map(rev, function (l) {
                            return {
                                parlorName: l._id,
                                data: [{revenue: l.revenue}]
                            }

                        })

                        fData.push({id: meas.id, name: meas.name, data: data})

                        // res.json(CreateObjService.response(false, fData))

                        callback4()

                    })
                }

            }, function (done) {

                console.log(JSON.stringify(fData))
                var data1 = _.map(fData, function (t) {
                    return {
                        id: t.id, data: _.orderBy(t.data, function (l) {
                            return l.parlorName
                        })
                    }
                })
                console.log("ggggggggggggggggggg", JSON.stringify(fData))

                res.json(CreateObjService.response(false, fData))

            })


        } else if (req.body.data[0].data[0].Id == 116) {

            console.log("116")
            var fData = [];
            async.each(req.body.data[1].Ids, function (meas, cb) {

                var query = queries4(meas.id, 0);
                console.log(query)


                User.aggregate(query, function (err, result) {
                    console.log(result)

                    var data = _.map(result, function (l) {
                        return {
                            parlorName: l._id,
                            data: [{revenue: l.revenue}, {count: l.count}]
                        }

                    })


                    fData.push({id: meas.id, name: meas.name, data: data})
                    cb();
                })

            }, function (done) {

                res.json(CreateObjService.response(false, fData))


            })


        } else if (req.body.data[0].data[0].Id == 117) {

            var fData = [];
            async.each(req.body.data[1].Ids, function (meas, cb) {

                var query = queries5(meas.id, 0);
                console.log(query)

                Appointment.aggregate(query, function (err, data) {


                    var data2 = _.map(data, function (l) {
                        return {
                            parlorName: l._id,
                            data: [{revenue: l.revenue}]
                        }

                    })

                    fData.push({id: meas.id, name: meas.name, data: data2})
                    cb();
                })

            }, function (done) {

                res.json(CreateObjService.response(false, fData))


            })

        }
        ;

    // ------------------------------------multi-----------------------
    } else if (req.body.data[0].status == 1) {


        var query=[];

    if (req.body.data[0].data[0].Id == 101 && req.body.data[0].data[1].Id == 104) {
        var dollarRevenue='';
        if(req.body.data[1].Ids[0].id == 201 )dollarRevenue={$add:["$serviceRevenue","$productRevenue"]};
        if(req.body.data[1].Ids[0].id == 202 )dollarRevenue="$serviceRevenue";
        if(req.body.data[1].Ids[0].id == 203 )dollarRevenue={$add:["$loyalityPoints","$loyalityOffer"]};
        if(req.body.data[1].Ids[0].id == 205 )dollarRevenue="$productRevenue";
        if(req.body.data[1].Ids[0].id == 204 )dollarRevenue={$sum:1};
        if(req.body.data[1].Ids[0].id == 207 )dollarRevenue={$add:["$serviceRevenue","$productRevenue"]};
      query=[
         {$match:{status:3,appointmentStartTime:{$gte:new Date(req.body.date.startDate),$lt:new Date(req.body.date.endDate)}}},
         {$project:{time:{$dateToString: {format: "%Y-%m-%d", date: "$appointmentStartTime"}},loyalityPoints:1,loyalityOffer:1,serviceRevenue:1,productRevenue:1,parlorId:1,count:{$sum:1}}},
         {$group:{_id:"$time",data:{$push:{count:{$sum:1},revenue:dollarRevenue,parlorId:"$parlorId"}}}}
     ];

      var groupData='parlorId'
      var revenue='revenue'

    }  if (req.body.data[0].data[0].Id == 101 && req.body.data[0].data[1].Id == 105) {
        var dollarRevenue='';
        if(req.body.data[1].Ids[0].id == 201 )dollarRevenue={$add:["$serviceRevenue","$productRevenue"]};
        if(req.body.data[1].Ids[0].id == 202 )dollarRevenue="$serviceRevenue";
        if(req.body.data[1].Ids[0].id == 205 )dollarRevenue="$productRevenue";
        if(req.body.data[1].Ids[0].id == 204 )dollarRevenue={$sum:1};
        if(req.body.data[1].Ids[0].id == 207 )dollarRevenue={$add:["$serviceRevenue","$productRevenue"]};
      query=[
         {$match:{status:3,appointmentStartTime:{$gte:new Date(req.body.date.startDate),$lt:new Date(req.body.date.endDate)}}},
         {$project:{time:{"$month":"$appointmentStartTime"},loyalityPoints:1,loyalityOffer:1,serviceRevenue:1,productRevenue:1,parlorId:1,count:{$sum:1}}},
         {$group:{_id:"$time",data:{$push:{count:{$sum:1},revenue:dollarRevenue,parlorId:"$parlorId"}}}}
     ];

      var groupData='parlorId'
      var revenue='revenue'

    }if (req.body.data[0].data[0].Id == 101 && req.body.data[0].data[1].Id == 106) {
        var dollarRevenue='';
        if(req.body.data[1].Ids[0].id == 201 )dollarRevenue={$add:["$serviceRevenue","$productRevenue"]};
        if(req.body.data[1].Ids[0].id == 202 )dollarRevenue="$serviceRevenue";
        if(req.body.data[1].Ids[0].id == 205 )dollarRevenue="$productRevenue";
            if(req.body.data[1].Ids[0].id == 207 )dollarRevenue={$add:["$serviceRevenue","$productRevenue"]};
            if(req.body.data[1].Ids[0].id == 204 )dollarRevenue={$sum:1};


            query=[
         {$match:{status:3,appointmentStartTime:{$gte:new Date(req.body.date.startDate),$lt:new Date(req.body.date.endDate)}}},
         {$project:{time:{"$isoDayOfWeek":"$appointmentStartTime"},loyalityPoints:1,loyalityOffer:1,serviceRevenue:1,productRevenue:1,parlorId:1,count:{$sum:1}}},
         {$group:{_id:"$time",data:{$push:{count:{$sum:1},revenue:dollarRevenue,parlorId:"$parlorId"}}}},
          { $project: { _id: { $concat: [{ $substr: [ "$_id", 0, 5 ] },'Day' ]},data:1}}

      ];

      var groupData='parlorId'
      var revenue='revenue'

    }if (req.body.data[0].data[0].Id == 101 && req.body.data[0].data[1].Id == 107) {
        var dollarRevenue='';
        if(req.body.data[1].Ids[0].id == 201 )dollarRevenue={$add:["$serviceRevenue","$productRevenue"]};
        if(req.body.data[1].Ids[0].id == 202 )dollarRevenue="$serviceRevenue";
        if(req.body.data[1].Ids[0].id == 205 )dollarRevenue="$productRevenue";
            if(req.body.data[1].Ids[0].id == 207 )dollarRevenue={$add:["$serviceRevenue","$productRevenue"]};
            if(req.body.data[1].Ids[0].id == 204 )dollarRevenue={$sum:1};


            query=[
         {$match:{status:3,appointmentStartTime:{$gte:new Date(req.body.date.startDate),$lt:new Date(req.body.date.endDate)}}},
         {$project:{time:{"$hour":"$appointmentStartTime"},loyalityPoints:1,loyalityOffer:1,serviceRevenue:1,productRevenue:1,parlorId:1,count:{$sum:1}}},
         {$group:{_id:"$time",data:{$push:{count:{$sum:1},revenue:dollarRevenue,parlorId:"$parlorId"}}}},
          { $project: { _id: { $concat: [{ $substr: [ "$_id", 0, 5 ] },'H' ]},data:1}}

      ];

      var groupData='parlorId'
      var revenue='revenue'

    }if (req.body.data[0].data[0].Id == 101 && req.body.data[0].data[1].Id == 108) {
        var dollarRevenue='';
        if(req.body.data[1].Ids[0].id == 201 )dollarRevenue={$add:["$serviceRevenue","$productRevenue"]};
        if(req.body.data[1].Ids[0].id == 202 )dollarRevenue="$serviceRevenue";
        if(req.body.data[1].Ids[0].id == 205 )dollarRevenue="$productRevenue";
            if(req.body.data[1].Ids[0].id == 207 )dollarRevenue={$add:["$serviceRevenue","$productRevenue"]};
            if(req.body.data[1].Ids[0].id == 204 )dollarRevenue={$sum:1};


            query=[
         {$match:{status:3,appointmentStartTime:{$gte:new Date(req.body.date.startDate),$lt:new Date(req.body.date.endDate)}}},
         {$project:{time:{"$week":"$appointmentStartTime"},loyalityPoints:1,loyalityOffer:1,serviceRevenue:1,productRevenue:1,parlorId:1,count:{$sum:1}}},
         {$group:{_id:"$time",data:{$push:{count:{$sum:1},revenue:dollarRevenue,parlorId:"$parlorId"}}}},
          { $project: { _id: { $concat: [{ $substr: [ "$_id", 0, 5 ] },'W' ]},data:1}}

      ];

      var groupData='parlorId'
      var revenue='revenue'

    }

    if (req.body.data[0].data[0].Id == 104 && req.body.data[0].data[1].Id == 101) {

        var dollarRevenue='';
        if(req.body.data[1].Ids[0].id == 201 )dollarRevenue={$add:["$serviceRevenue","$productRevenue"]};
        if(req.body.data[1].Ids[0].id == 202 )dollarRevenue="$serviceRevenue";
        if(req.body.data[1].Ids[0].id == 205 )dollarRevenue="$productRevenue";
        if(req.body.data[1].Ids[0].id == 207 )dollarRevenue={$add:["$serviceRevenue","$productRevenue"]};
        if(req.body.data[1].Ids[0].id == 204 )dollarRevenue={$sum:1};



        query = [
         {$match:{status:3,appointmentStartTime:{$gte:new Date(req.body.date.startDate),$lt:new Date(req.body.date.endDate)}}},
         {$project: {time: {$dateToString: {format: "%Y-%m-%d", date: "$appointmentStartTime"}},loyalityPoints:1,loyalityOffer:1, serviceRevenue: 1, productRevenue: 1, parlorId: 1}},
         { $group: { _id: "$parlorId", data: {$push: {count:{$sum:1},revenue:dollarRevenue, time: "$time"}}}}];

     var groupData = 'time'
     var revenue='revenue'
    } if (req.body.data[0].data[0].Id == 105 && req.body.data[0].data[1].Id == 101) {

        var dollarRevenue='';
        if(req.body.data[1].Ids[0].id == 201 )dollarRevenue={$add:["$serviceRevenue","$productRevenue"]};
        if(req.body.data[1].Ids[0].id == 202 )dollarRevenue="$serviceRevenue";
        if(req.body.data[1].Ids[0].id == 205 )dollarRevenue="$productRevenue";
        if(req.body.data[1].Ids[0].id == 207 )dollarRevenue={$add:["$serviceRevenue","$productRevenue"]};
        if(req.body.data[1].Ids[0].id == 204 )dollarRevenue={$sum:1};



        query = [
         {$match:{status:3,appointmentStartTime:{$gte:new Date(req.body.date.startDate),$lt:new Date(req.body.date.endDate)}}},
         {$project: {time: {"$month": "$appointmentStartTime"},loyalityPoints:1,loyalityOffer:1, serviceRevenue: 1, productRevenue: 1, parlorId: 1}},
         { $group: { _id: "$parlorId", data: {$push: {count:{$sum:1},revenue:dollarRevenue, time: "$time"}}}}];

     var groupData = 'time'
     var revenue='revenue'
    } if (req.body.data[0].data[0].Id == 106 && req.body.data[0].data[1].Id == 101) {

        var dollarRevenue='';
        if(req.body.data[1].Ids[0].id == 201 )dollarRevenue={$add:["$serviceRevenue","$productRevenue"]};
        if(req.body.data[1].Ids[0].id == 202 )dollarRevenue="$serviceRevenue";
        if(req.body.data[1].Ids[0].id == 205 )dollarRevenue="$productRevenue";
            if(req.body.data[1].Ids[0].id == 207 )dollarRevenue={$add:["$serviceRevenue","$productRevenue"]};
            if(req.body.data[1].Ids[0].id == 204 )dollarRevenue={$sum:1};




            query = [
         {$match:{status:3,appointmentStartTime:{$gte:new Date(req.body.date.startDate),$lt:new Date(req.body.date.endDate)}}},
         {$project: {time:{ $concat: [{ $substr: [ {"$isoDayOfWeek": "$appointmentStartTime"}, 0, 5 ] },'Day' ]}
             ,loyalityPoints:1,loyalityOffer:1, serviceRevenue: 1, productRevenue: 1, parlorId: 1}},
         { $group: { _id: "$parlorId", data: {$push: {count:{$sum:1},revenue:dollarRevenue, time: "$time"}}}},

     ]

     var groupData = 'time'
     var revenue='revenue'
    }if (req.body.data[0].data[0].Id == 107 && req.body.data[0].data[1].Id == 101) {

        var dollarRevenue='';
        if(req.body.data[1].Ids[0].id == 201 )dollarRevenue={$add:["$serviceRevenue","$productRevenue"]};
        if(req.body.data[1].Ids[0].id == 202 )dollarRevenue="$serviceRevenue";
        if(req.body.data[1].Ids[0].id == 205 )dollarRevenue="$productRevenue";
            if(req.body.data[1].Ids[0].id == 207 )dollarRevenue={$add:["$serviceRevenue","$productRevenue"]};
            if(req.body.data[1].Ids[0].id == 204 )dollarRevenue={$sum:1};



            query = [
         {$match:{status:3,appointmentStartTime:{$gte:new Date(req.body.date.startDate),$lt:new Date(req.body.date.endDate)}}},
         {$project: {time: { $concat: [{ $substr: [ {"$hour": "$appointmentStartTime"}, 0, 5 ] },'H' ]},loyalityPoints:1,loyalityOffer:1, serviceRevenue: 1, productRevenue: 1, parlorId: 1}},
         { $group: { _id: "$parlorId", data: {$push: {count:{$sum:1},revenue:dollarRevenue, time: "$time"}}}},

     ];

     var groupData = 'time'
     var revenue='revenue'
    }if (req.body.data[0].data[0].Id == 108 && req.body.data[0].data[1].Id == 101) {

        var dollarRevenue='';
        if(req.body.data[1].Ids[0].id == 201 )dollarRevenue={$add:["$serviceRevenue","$productRevenue"]};
        if(req.body.data[1].Ids[0].id == 202 )dollarRevenue="$serviceRevenue";
        if(req.body.data[1].Ids[0].id == 205 )dollarRevenue="$productRevenue";
            if(req.body.data[1].Ids[0].id == 207 )dollarRevenue={$add:["$serviceRevenue","$productRevenue"]};
            if(req.body.data[1].Ids[0].id == 204 )dollarRevenue={$sum:1};



            query = [
         {$match:{status:3,appointmentStartTime:{$gte:new Date(req.body.date.startDate),$lt:new Date(req.body.date.endDate)}}},
         {$project: {time:{ $concat: [{ $substr: [ {"$week": "$appointmentStartTime"}, 0, 5 ] },'W' ]} ,loyalityPoints:1,loyalityOffer:1, serviceRevenue: 1, productRevenue: 1, parlorId: 1}},
         { $group: { _id: "$parlorId", data: {$push: {count:{$sum:1},revenue:dollarRevenue, time: "$time"}}}},

     ];

     var groupData = 'time'
     var revenue='revenue'
    }
        if (req.body.data[0].data[0].Id == 101 && req.body.data[0].data[1].Id == 109) {
            query = [
                {$match:{status:3,appointmentStartTime:{$gte:new Date(req.body.date.startDate),$lt:new Date(req.body.date.endDate)}}},
                {$project: {parlorId:1, departmentRevenue: 1}},
                {$unwind: "$departmentRevenue"},
                {$group: {_id: "$parlorId", data: {$push: "$departmentRevenue"}}}

            ];
            var groupData = 'departmentId'
            var revenue='revenue'
        }
        if (req.body.data[0].data[0].Id == 109&& req.body.data[0].data[1].Id == 101) {
            query = [
                {$match:{status:3,appointmentStartTime:{$gte:new Date(req.body.date.startDate),$lt:new Date(req.body.date.endDate)}}},
                {$project: {parlorId:1,loyalityPoints:1,loyalityOffer:1, departmentRevenue: 1}},
                {$unwind: "$departmentRevenue"},
                {$group: {_id: "$departmentRevenue.departmentId", data: {$push: {parlorId:"$parlorId",revenue:"$departmentRevenue.revenue"}}}}
            ];

            var groupData = 'parlorId'
            var revenue='revenue'
        }

        if (req.body.data[0].data[0].Id == 112 && req.body.data[0].data[1].Id == 101) {
            query = [
                {$match:{status:3,appointmentStartTime:{$gte:new Date(req.body.date.startDate),$lt:new Date(req.body.date.endDate)}}},
                {
                    $unwind:
                        {
                            path: "$allPaymentMethods",
                            preserveNullAndEmptyArrays: true
                        },
                },
                {$group:{_id:{$cond:["$allPaymentMethods:{$exists:true}","$allPaymentMethods.value","$paymentMethod"]},
                    data:{$push:{"parlorId":"$parlorId",revenue:{$sum:{$cond:["$allPaymentMethods:{$exists:true}","$allPaymentMethods.amount","$payableAmount"]}}}}}},
                { $project: { _id: { $concat: [{ $substr: [ "$_id", 0, 5 ] },'Pay' ]},data:1}}
            ]
            var groupData = 'parlorId'
            var revenue='revenue'
        }
        if (req.body.data[0].data[0].Id == 101 && req.body.data[0].data[1].Id == 112) {
            query = [
                {$match:{status:3,appointmentStartTime:{$gte:new Date(req.body.date.startDate),$lt:new Date(req.body.date.endDate)}}},
                {
                    $unwind:
                        {
                            path: "$allPaymentMethods",
                            preserveNullAndEmptyArrays: true
                        },
                },


                {$group:{_id:"$parlorId",
                    data:{$push:{"payment":{ $concat: [{ $substr: [ {$cond:["$allPaymentMethods:{$exists:true}","$allPaymentMethods.value","$paymentMethod"]}, 0, 5 ] },'Pay' ]},revenue:{$sum:{$cond:["$allPaymentMethods:{$exists:true}","$allPaymentMethods.amount","$payableAmount"]}}}}}},
                { $project: { _id:"$_id",data:1}}
            ]
            var groupData = 'payment'
            var revenue='revenue'
        }





//-----------------------------------------------Be U-------------------------------------------------------------



        if (req.body.data[0].data[0].Id == 102 && req.body.data[0].data[1].Id == 104) {
            var dollarRevenue = '';
            if (req.body.data[1].Ids[0].id == 201) dollarRevenue = {$add: ["$serviceRevenue", "$productRevenue"]};
            if (req.body.data[1].Ids[0].id == 202) dollarRevenue = "$serviceRevenue";
            if (req.body.data[1].Ids[0].id == 205) dollarRevenue = "$productRevenue";
            if (req.body.data[1].Ids[0].id == 204) dollarRevenue = {$sum: 1};
            if (req.body.data[1].Ids[0].id == 207) dollarRevenue = {$add: ["$serviceRevenue", "$productRevenue"]};
            query = [
                {
                    $match: {
                        status: 3,
                        appointmentStartTime: {
                            $gte: new Date(req.body.date.startDate),
                            $lt: new Date(req.body.date.endDate)
                        }
                    }
                },
                {
                    $project: {
                        time: {$dateToString: {format: "%Y-%m-%d", date: "$appointmentStartTime"}},
                        serviceRevenue: 1,
                        productRevenue: 1,
                        loyalityPoints:1,loyalityOffer:1,
                        parlorId: 1,
                        count: {$sum: 1}
                    }
                },
                {$group: {_id: "$time", data: {$push: {count: {$sum: 1}, revenue: dollarRevenue, parlorId: "Be U"}}}}
            ];

            var groupData = 'parlorId'
            var revenue = 'revenue'

        }
        if (req.body.data[0].data[0].Id == 102 && req.body.data[0].data[1].Id == 105) {
            var dollarRevenue='';
            if(req.body.data[1].Ids[0].id == 201 )dollarRevenue={$add:["$serviceRevenue","$productRevenue"]};
            if(req.body.data[1].Ids[0].id == 202 )dollarRevenue="$serviceRevenue";
            if(req.body.data[1].Ids[0].id == 205 )dollarRevenue="$productRevenue";
            if(req.body.data[1].Ids[0].id == 204 )dollarRevenue={$sum:1};
            if(req.body.data[1].Ids[0].id == 207 )dollarRevenue={$add:["$serviceRevenue","$productRevenue"]};
            query=[
                {$match:{status:3,appointmentStartTime:{$gte:new Date(req.body.date.startDate),$lt:new Date(req.body.date.endDate)}}},
                {$project:{time:{"$month":"$appointmentStartTime"},loyalityPoints:1,loyalityOffer:1,serviceRevenue:1,productRevenue:1,parlorId:1,count:{$sum:1}}},
                {$group:{_id:"$time",data:{$push:{count:{$sum:1},revenue:dollarRevenue,parlorId:"Be U"}}}}
            ];

            var groupData='parlorId'
            var revenue='revenue'

        }if (req.body.data[0].data[0].Id == 102 && req.body.data[0].data[1].Id == 106) {
            var dollarRevenue='';
            if(req.body.data[1].Ids[0].id == 201 )dollarRevenue={$add:["$serviceRevenue","$productRevenue"]};
            if(req.body.data[1].Ids[0].id == 202 )dollarRevenue="$serviceRevenue";
            if(req.body.data[1].Ids[0].id == 205 )dollarRevenue="$productRevenue";
            if(req.body.data[1].Ids[0].id == 207 )dollarRevenue={$add:["$serviceRevenue","$productRevenue"]};
            if(req.body.data[1].Ids[0].id == 204 )dollarRevenue={$sum:1};


            query=[
                {$match:{status:3,appointmentStartTime:{$gte:new Date(req.body.date.startDate),$lt:new Date(req.body.date.endDate)}}},
                {$project:{time:{"$isoDayOfWeek":"$appointmentStartTime"},loyalityPoints:1,loyalityOffer:1,serviceRevenue:1,productRevenue:1,parlorId:1,count:{$sum:1}}},
                {$group:{_id:"$time",data:{$push:{count:{$sum:1},revenue:dollarRevenue,parlorId:"Be U"}}}},
                { $project: { _id: { $concat: [{ $substr: [ "$_id", 0, 5 ] },'Day' ]},data:1}}

            ];

            var groupData='parlorId'
            var revenue='revenue'

        }if (req.body.data[0].data[0].Id == 102 && req.body.data[0].data[1].Id == 107) {
            var dollarRevenue='';
            if(req.body.data[1].Ids[0].id == 201 )dollarRevenue={$add:["$serviceRevenue","$productRevenue"]};
            if(req.body.data[1].Ids[0].id == 202 )dollarRevenue="$serviceRevenue";
            if(req.body.data[1].Ids[0].id == 205 )dollarRevenue="$productRevenue";
            if(req.body.data[1].Ids[0].id == 207 )dollarRevenue={$add:["$serviceRevenue","$productRevenue"]};
            if(req.body.data[1].Ids[0].id == 204 )dollarRevenue={$sum:1};


            query=[
                {$match:{status:3,appointmentStartTime:{$gte:new Date(req.body.date.startDate),$lt:new Date(req.body.date.endDate)}}},
                {$project:{time:{"$hour":"$appointmentStartTime"},loyalityPoints:1,loyalityOffer:1,serviceRevenue:1,productRevenue:1,parlorId:1,count:{$sum:1}}},
                {$group:{_id:"$time",data:{$push:{count:{$sum:1},revenue:dollarRevenue,parlorId:"Be U"}}}},
                { $project: { _id: { $concat: [{ $substr: [ "$_id", 0, 5 ] },'H' ]},data:1}}

            ];

            var groupData='parlorId'
            var revenue='revenue'

        }if (req.body.data[0].data[0].Id == 102 && req.body.data[0].data[1].Id == 108) {
            var dollarRevenue='';
            if(req.body.data[1].Ids[0].id == 201 )dollarRevenue={$add:["$serviceRevenue","$productRevenue"]};
            if(req.body.data[1].Ids[0].id == 202 )dollarRevenue="$serviceRevenue";
            if(req.body.data[1].Ids[0].id == 205 )dollarRevenue="$productRevenue";
            if(req.body.data[1].Ids[0].id == 207 )dollarRevenue={$add:["$serviceRevenue","$productRevenue"]};
            if(req.body.data[1].Ids[0].id == 204 )dollarRevenue={$sum:1};


            query=[
                {$match:{status:3,appointmentStartTime:{$gte:new Date(req.body.date.startDate),$lt:new Date(req.body.date.endDate)}}},
                {$project:{time:{"$week":"$appointmentStartTime"},loyalityPoints:1,loyalityOffer:1,serviceRevenue:1,productRevenue:1,parlorId:1,count:{$sum:1}}},
                {$group:{_id:"$time",data:{$push:{count:{$sum:1},revenue:dollarRevenue,parlorId:"Be U"}}}},
                { $project: { _id: { $concat: [{ $substr: [ "$_id", 0, 5 ] },'W' ]},data:1}}

            ];

            var groupData='parlorId'
            var revenue='revenue'

        }

        if (req.body.data[0].data[0].Id == 104 && req.body.data[0].data[1].Id == 102) {

            var dollarRevenue='';
            if(req.body.data[1].Ids[0].id == 201 )dollarRevenue={$add:["$serviceRevenue","$productRevenue"]};
            if(req.body.data[1].Ids[0].id == 202 )dollarRevenue="$serviceRevenue";
            if(req.body.data[1].Ids[0].id == 205 )dollarRevenue="$productRevenue";
            if(req.body.data[1].Ids[0].id == 207 )dollarRevenue={$add:["$serviceRevenue","$productRevenue"]};
            if(req.body.data[1].Ids[0].id == 204 )dollarRevenue={$sum:1};



            query = [
                {$match:{status:3,appointmentStartTime:{$gte:new Date(req.body.date.startDate),$lt:new Date(req.body.date.endDate)}}},
                {$project:{time:{$dateToString: {format: "%Y-%m-%d", date: "$appointmentStartTime"}},loyalityPoints:1,loyalityOffer:1, serviceRevenue: 1, productRevenue: 1, parlorId: 1}},
                { $group: { _id: "Be U", data: {$push: {count:{$sum:1},revenue:dollarRevenue, time: "$time"}}}}];

            var groupData = 'time'
            var revenue='revenue'
        }  if (req.body.data[0].data[0].Id == 105 && req.body.data[0].data[1].Id == 102) {

            var dollarRevenue='';
            if(req.body.data[1].Ids[0].id == 201 )dollarRevenue={$add:["$serviceRevenue","$productRevenue"]};
            if(req.body.data[1].Ids[0].id == 202 )dollarRevenue="$serviceRevenue";
            if(req.body.data[1].Ids[0].id == 205 )dollarRevenue="$productRevenue";
            if(req.body.data[1].Ids[0].id == 207 )dollarRevenue={$add:["$serviceRevenue","$productRevenue"]};
            if(req.body.data[1].Ids[0].id == 204 )dollarRevenue={$sum:1};



            query = [
                {$match:{status:3,appointmentStartTime:{$gte:new Date(req.body.date.startDate),$lt:new Date(req.body.date.endDate)}}},
                {$project: {time: {"$month": "$appointmentStartTime"},loyalityPoints:1,loyalityOffer:1, serviceRevenue: 1, productRevenue: 1, parlorId: 1}},
                { $group: { _id: "Be U", data: {$push: {count:{$sum:1},revenue:dollarRevenue, time: "$time"}}}}];

            var groupData = 'time'
            var revenue='revenue'
        } if (req.body.data[0].data[0].Id == 106 && req.body.data[0].data[1].Id == 102) {

            var dollarRevenue='';
            if(req.body.data[1].Ids[0].id == 201 )dollarRevenue={$add:["$serviceRevenue","$productRevenue"]};
            if(req.body.data[1].Ids[0].id == 202 )dollarRevenue="$serviceRevenue";
            if(req.body.data[1].Ids[0].id == 205 )dollarRevenue="$productRevenue";
            if(req.body.data[1].Ids[0].id == 207 )dollarRevenue={$add:["$serviceRevenue","$productRevenue"]};
            if(req.body.data[1].Ids[0].id == 204 )dollarRevenue={$sum:1};




            query = [
                {$match:{status:3,appointmentStartTime:{$gte:new Date(req.body.date.startDate),$lt:new Date(req.body.date.endDate)}}},
                {$project: {time:{ $concat: [{ $substr: [ {"$isoDayOfWeek": "$appointmentStartTime"}, 0, 5 ] },'Day' ]}
                    ,loyalityPoints:1,loyalityOffer:1, serviceRevenue: 1, productRevenue: 1, parlorId: 1}},
                { $group: { _id: "Be U", data: {$push: {count:{$sum:1},revenue:dollarRevenue, time: "$time"}}}},

            ]

            var groupData = 'time'
            var revenue='revenue'
        }if (req.body.data[0].data[0].Id == 107 && req.body.data[0].data[1].Id == 102) {

            var dollarRevenue='';
            if(req.body.data[1].Ids[0].id == 201 )dollarRevenue={$add:["$serviceRevenue","$productRevenue"]};
            if(req.body.data[1].Ids[0].id == 202 )dollarRevenue="$serviceRevenue";
            if(req.body.data[1].Ids[0].id == 205 )dollarRevenue="$productRevenue";
            if(req.body.data[1].Ids[0].id == 207 )dollarRevenue={$add:["$serviceRevenue","$productRevenue"]};
            if(req.body.data[1].Ids[0].id == 204 )dollarRevenue={$sum:1};



            query = [
                {$match:{status:3,appointmentStartTime:{$gte:new Date(req.body.date.startDate),$lt:new Date(req.body.date.endDate)}}},
                {$project: {time: { $concat: [{ $substr: [ {"$hour": "$appointmentStartTime"}, 0, 5 ] },'H' ]},loyalityPoints:1,loyalityOffer:1, serviceRevenue: 1, productRevenue: 1, parlorId: 1}},
                { $group: { _id: "Be U", data: {$push: {count:{$sum:1},revenue:dollarRevenue, time: "$time"}}}},

            ];

            var groupData = 'time'
            var revenue='revenue'
        }if (req.body.data[0].data[0].Id == 108 && req.body.data[0].data[1].Id == 102) {

            var dollarRevenue='';
            if(req.body.data[1].Ids[0].id == 201 )dollarRevenue={$add:["$serviceRevenue","$productRevenue"]};
            if(req.body.data[1].Ids[0].id == 202 )dollarRevenue="$serviceRevenue";
            if(req.body.data[1].Ids[0].id == 205 )dollarRevenue="$productRevenue";
            if(req.body.data[1].Ids[0].id == 207 )dollarRevenue={$add:["$serviceRevenue","$productRevenue"]};
            if(req.body.data[1].Ids[0].id == 204 )dollarRevenue={$sum:1};



            query = [
                {$match:{status:3,appointmentStartTime:{$gte:new Date(req.body.date.startDate),$lt:new Date(req.body.date.endDate)}}},
                {$project: {time:{ $concat: [{ $substr: [ {"$week": "$appointmentStartTime"}, 0, 5 ] },'W' ]} ,loyalityPoints:1,loyalityOffer:1, serviceRevenue: 1, productRevenue: 1, parlorId: 1}},
                { $group: { _id: "Be U", data: {$push: {count:{$sum:1},revenue:dollarRevenue, time: "$time"}}}},

            ];

            var groupData = 'time'
            var revenue='revenue'
        }
        if (req.body.data[0].data[0].Id == 102 && req.body.data[0].data[1].Id == 109) {
            query = [
                {$match:{status:3,appointmentStartTime:{$gte:new Date(req.body.date.startDate),$lt:new Date(req.body.date.endDate)}}},
                {$project: {parlorId:1, departmentRevenue: 1}},
                {$unwind: "$departmentRevenue"},
                {$group: {_id: "Be U", data: {$push: "$departmentRevenue"}}}

            ];
            var groupData = 'departmentId'
            var revenue='revenue'
        }
        if (req.body.data[0].data[0].Id == 109&& req.body.data[0].data[1].Id == 102) {
            query = [
                {$match:{status:3,appointmentStartTime:{$gte:new Date(req.body.date.startDate),$lt:new Date(req.body.date.endDate)}}},
                {$project: {parlorId:1, departmentRevenue: 1}},
                {$unwind: "$departmentRevenue"},
                {$group: {_id: "$departmentRevenue.departmentId", data: {$push: {parlorId:"Be U",revenue:"$departmentRevenue.revenue"}}}}
            ];

            var groupData = 'parlorId'
            var revenue='revenue'
        }

        if (req.body.data[0].data[0].Id == 112 && req.body.data[0].data[1].Id == 102) {
            query = [
                {$match:{status:3,appointmentStartTime:{$gte:new Date(req.body.date.startDate),$lt:new Date(req.body.date.endDate)}}},
                {
                    $unwind:
                        {
                            path: "$allPaymentMethods",
                            preserveNullAndEmptyArrays: true
                        },
                },
                {$group:{_id:{$cond:["$allPaymentMethods:{$exists:true}","$allPaymentMethods.value","$paymentMethod"]},
                    data:{$push:{"parlorId":"Be U",revenue:{$sum:{$cond:["$allPaymentMethods:{$exists:true}","$allPaymentMethods.amount","$payableAmount"]}}}}}},
                { $project: { _id: { $concat: [{ $substr: [ "$_id", 0, 5 ] },'Pay' ]},data:1}}
            ]
            var groupData = 'parlorId'
            var revenue='revenue'
        }
        if (req.body.data[0].data[0].Id == 102 && req.body.data[0].data[1].Id == 112) {
            query = [
                {$match:{status:3,appointmentStartTime:{$gte:new Date(req.body.date.startDate),$lt:new Date(req.body.date.endDate)}}},
                {
                    $unwind:
                        {
                            path: "$allPaymentMethods",
                            preserveNullAndEmptyArrays: true
                        },
                },


                {$group:{_id:"Be U",
                    data:{$push:{"payment":{ $concat: [{ $substr: [ {$cond:["$allPaymentMethods:{$exists:true}","$allPaymentMethods.value","$paymentMethod"]}, 0, 5 ] },'Pay' ]},revenue:{$sum:{$cond:["$allPaymentMethods:{$exists:true}","$allPaymentMethods.amount","$payableAmount"]}}}}}},
                { $project: { _id:"$_id",data:1}}
            ]
            var groupData = 'payment'
            var revenue='revenue'
        }
// -------------------------------------------------Department----------------------------------------------------

    if (req.body.data[0].data[0].Id == 109 && req.body.data[0].data[1].Id == 104) {

        var dollarRevenue='';
        if(req.body.data[1].Ids[0].id == 201 )dollarRevenue={$add:["$serviceRevenue","$productRevenue"]};
        if(req.body.data[1].Ids[0].id == 202 )dollarRevenue="$serviceRevenue";
        if(req.body.data[1].Ids[0].id == 205 )dollarRevenue="$productRevenue";

     query = [
         {$match:{status:3,appointmentStartTime:{$gte:new Date(req.body.date.startDate),$lt:new Date(req.body.date.endDate)}}},
         {$project: {time:{$dateToString: {format: "%Y-%m-%d", date: "$appointmentStartTime"}}, departmentRevenue: 1}}, {$unwind: "$departmentRevenue"},
         {$group: {_id: "$time", data: {$push: "$departmentRevenue"}}}

     ];

     var groupData = 'departmentId'
     var revenue='revenue'
    } if (req.body.data[0].data[0].Id == 109 && req.body.data[0].data[1].Id == 105) {

        var dollarRevenue='';
        if(req.body.data[1].Ids[0].id == 201 )dollarRevenue={$add:["$serviceRevenue","$productRevenue"]};
        if(req.body.data[1].Ids[0].id == 202 )dollarRevenue="$serviceRevenue";
        if(req.body.data[1].Ids[0].id == 205 )dollarRevenue="$productRevenue";

     query = [
         {$match:{status:3,appointmentStartTime:{$gte:new Date(req.body.date.startDate),$lt:new Date(req.body.date.endDate)}}},
         {$project: {time: {"$month": "$appointmentStartTime"}, departmentRevenue: 1}}, {$unwind: "$departmentRevenue"},
         {$group: {_id: "$time", data: {$push: "$departmentRevenue"}}}

     ];

     var groupData = 'departmentId'
     var revenue='revenue'
    }
 if (req.body.data[0].data[0].Id == 109 && req.body.data[0].data[1].Id == 106) {

        var dollarRevenue='';
        if(req.body.data[1].Ids[0].id == 201 )dollarRevenue={$add:["$serviceRevenue","$productRevenue"]};
        if(req.body.data[1].Ids[0].id == 202 )dollarRevenue="$serviceRevenue";
        if(req.body.data[1].Ids[0].id == 205 )dollarRevenue="$productRevenue";

     query = [
         {$match:{status:3,appointmentStartTime:{$gte:new Date(req.body.date.startDate),$lt:new Date(req.body.date.endDate)}}},
         {$project: {time:{ $concat: [{ $substr: [ {"$isoDayOfWeek": "$appointmentStartTime"}, 0, 5 ] },'Day' ]}, departmentRevenue: 1}}, {$unwind: "$departmentRevenue"},
         {$group: {_id: "$time", data: {$push: "$departmentRevenue"}}}

     ];

     var groupData = 'departmentId'
     var revenue='revenue'
    }
 if (req.body.data[0].data[0].Id == 109 && req.body.data[0].data[1].Id == 107) {

        var dollarRevenue='';
        if(req.body.data[1].Ids[0].id == 201 )dollarRevenue={$add:["$serviceRevenue","$productRevenue"]};
        if(req.body.data[1].Ids[0].id == 202 )dollarRevenue="$serviceRevenue";
        if(req.body.data[1].Ids[0].id == 205 )dollarRevenue="$productRevenue";

     query = [
         {$match:{status:3,appointmentStartTime:{$gte:new Date(req.body.date.startDate),$lt:new Date(req.body.date.endDate)}}},
         {$project: {time: { $concat: [{ $substr: [ {"$hour": "$appointmentStartTime"}, 0, 5 ] },'H' ]}, departmentRevenue: 1}}, {$unwind: "$departmentRevenue"},
         {$group: {_id: "$time", data: {$push: "$departmentRevenue"}}}

     ];

     var groupData = 'departmentId'
     var revenue='revenue'
    }
 if (req.body.data[0].data[0].Id == 109 && req.body.data[0].data[1].Id == 108) {

        var dollarRevenue='';
        if(req.body.data[1].Ids[0].id == 201 )dollarRevenue={$add:["$serviceRevenue","$productRevenue"]};
        if(req.body.data[1].Ids[0].id == 202 )dollarRevenue="$serviceRevenue";
        if(req.body.data[1].Ids[0].id == 205 )dollarRevenue="$productRevenue";

     query = [
         {$match:{status:3,appointmentStartTime:{$gte:new Date(req.body.date.startDate),$lt:new Date(req.body.date.endDate)}}},
         {$project: {time: { $concat: [{ $substr: [ {"$week": "$appointmentStartTime"}, 0, 5 ] },'W' ]}, departmentRevenue: 1}}, {$unwind: "$departmentRevenue"},
         {$group: {_id: "$time", data: {$push: "$departmentRevenue"}}}

     ];

     var groupData = 'departmentId'
     var revenue='revenue'
    }

    if (req.body.data[0].data[0].Id == 104 && req.body.data[0].data[1].Id == 109) {

        var dollarRevenue='';
        if(req.body.data[1].Ids[0].id == 201 )dollarRevenue={$add:["$serviceRevenue","$productRevenue"]};
        if(req.body.data[1].Ids[0].id == 202 )dollarRevenue="$serviceRevenue";
        if(req.body.data[1].Ids[0].id == 205 )dollarRevenue="$productRevenue";

     query = [
         {$match:{status:3,appointmentStartTime:{$gte:new Date(req.body.date.startDate),$lt:new Date(req.body.date.endDate)}}},
         {$project: {time:{$dateToString: {format: "%Y-%m-%d", date: "$appointmentStartTime"}}, departmentRevenue: 1}},
         {$unwind: "$departmentRevenue"},
        {$group: {_id: "$departmentRevenue.departmentId", data: {$push: {time:"$time",revenue:"$departmentRevenue.revenue"}}}}
     ];

     var groupData = 'time'
     var revenue='revenue'
    } if (req.body.data[0].data[0].Id == 105 && req.body.data[0].data[1].Id == 109) {

        var dollarRevenue='';
        if(req.body.data[1].Ids[0].id == 201 )dollarRevenue={$add:["$serviceRevenue","$productRevenue"]};
        if(req.body.data[1].Ids[0].id == 202 )dollarRevenue="$serviceRevenue";
        if(req.body.data[1].Ids[0].id == 205 )dollarRevenue="$productRevenue";

     query = [
         {$match:{status:3,appointmentStartTime:{$gte:new Date(req.body.date.startDate),$lt:new Date(req.body.date.endDate)}}},
         {$project: {time:{"$month": "$appointmentStartTime"}, departmentRevenue: 1}},
         {$unwind: "$departmentRevenue"},
        {$group: {_id: "$departmentRevenue.departmentId", data: {$push: {time:"$time",revenue:"$departmentRevenue.revenue"}}}}
     ];

     var groupData = 'time'
     var revenue='revenue'
    }
    if (req.body.data[0].data[0].Id == 106 && req.body.data[0].data[1].Id == 109) {

        var dollarRevenue='';
        if(req.body.data[1].Ids[0].id == 201 )dollarRevenue={$add:["$serviceRevenue","$productRevenue"]};
        if(req.body.data[1].Ids[0].id == 202 )dollarRevenue="$serviceRevenue";
        if(req.body.data[1].Ids[0].id == 205 )dollarRevenue="$productRevenue";

     query = [
         {$match:{status:3,appointmentStartTime:{$gte:new Date(req.body.date.startDate),$lt:new Date(req.body.date.endDate)}}},
         {$project: {time:{ $concat: [{ $substr: [ {"$isoDayOfWeek": "$appointmentStartTime"}, 0, 5 ] },'Day' ]}, departmentRevenue: 1}},
         {$unwind: "$departmentRevenue"},
        {$group: {_id: "$departmentRevenue.departmentId", data: {$push: {time:"$time",revenue:"$departmentRevenue.revenue"}}}}
     ];

     var groupData = 'time'
     var revenue='revenue'
    }
    if (req.body.data[0].data[0].Id == 107 && req.body.data[0].data[1].Id == 109) {

        var dollarRevenue='';
        if(req.body.data[1].Ids[0].id == 201 )dollarRevenue={$add:["$serviceRevenue","$productRevenue"]};
        if(req.body.data[1].Ids[0].id == 202 )dollarRevenue="$serviceRevenue";
        if(req.body.data[1].Ids[0].id == 205 )dollarRevenue="$productRevenue";

     query = [
         {$match:{status:3,appointmentStartTime:{$gte:new Date(req.body.date.startDate),$lt:new Date(req.body.date.endDate)}}},
         {$project: {time:{ $concat: [{ $substr: [ {"$hour": "$appointmentStartTime"}, 0, 5 ] },'H' ]}, departmentRevenue: 1}},
         {$unwind: "$departmentRevenue"},
        {$group: {_id: "$departmentRevenue.departmentId", data: {$push: {time:"$time",revenue:"$departmentRevenue.revenue"}}}}
     ];

     var groupData = 'time'
     var revenue='revenue'
    }
    if (req.body.data[0].data[0].Id == 108 && req.body.data[0].data[1].Id == 109) {

        var dollarRevenue='';
        if(req.body.data[1].Ids[0].id == 201 )dollarRevenue={$add:["$serviceRevenue","$productRevenue"]};
        if(req.body.data[1].Ids[0].id == 202 )dollarRevenue="$serviceRevenue";
        if(req.body.data[1].Ids[0].id == 205 )dollarRevenue="$productRevenue";

     query = [
         {$match:{status:3,appointmentStartTime:{$gte:new Date(req.body.date.startDate),$lt:new Date(req.body.date.endDate)}}},
         {$project: {time:{ $concat: [{ $substr: [ {"$week": "$appointmentStartTime"}, 0, 5 ] },'W' ]}, departmentRevenue: 1}},
         {$unwind: "$departmentRevenue"},
        {$group: {_id: "$departmentRevenue.departmentId", data: {$push: {time:"$time",revenue:"$departmentRevenue.revenue"}}}}
     ];

     var groupData = 'time'
     var revenue='revenue'
    }


    if (req.body.data[0].data[0].Id == 112 && req.body.data[0].data[1].Id == 101) {
     query = [
         {$match:{status:3,appointmentStartTime:{$gte:new Date(req.body.date.startDate),$lt:new Date(req.body.date.endDate)}}},
         {
             $unwind:
                 {
                     path: "$allPaymentMethods",
                     preserveNullAndEmptyArrays: true
                 },
         },
         {$group:{_id:{$cond:["$allPaymentMethods:{$exists:true}","$allPaymentMethods.value","$paymentMethod"]},
             data:{$push:{"parlorId":"$parlorId",revenue:{$sum:{$cond:["$allPaymentMethods:{$exists:true}","$allPaymentMethods.amount","$payableAmount"]}}}}}},
         { $project: { _id: { $concat: [{ $substr: [ "$_id", 0, 5 ] },'Pay' ]},data:1}}

     ]

     var groupData = 'parlorId'
     var revenue='revenue'
    }

    if (req.body.data[0].data[0].Id == 112 && req.body.data[0].data[1].Id == 104) {

     query = [
         {$match:{status:3,appointmentStartTime:{$gte:new Date(req.body.date.startDate),$lt:new Date(req.body.date.endDate)}}},
         {
             $unwind:
                 {
                     path: "$allPaymentMethods",
                     preserveNullAndEmptyArrays: true
                 },
         },
         {$project: {time: {$dateToString: {format: "%Y-%m-%d", date: "$appointmentStartTime"}},loyalityPoints:1,loyalityOffer:1, allPaymentMethods: 1,paymentMethod:1,payableAmount:1}},
         {$group:{_id:{$cond:["$allPaymentMethods:{$exists:true}","$allPaymentMethods.value","$paymentMethod"]},
             data:{$push:{"time":"$time",revenue:{$sum:{$cond:["$allPaymentMethods:{$exists:true}","$alPaymentMethods.amount","$payableAmount"]}}}}}},
         { $project: { _id: { $concat: [{ $substr: [ "$_id", 0, 5 ] },'Pay' ]},data:1}}

     ]

     var groupData = 'time'
     var revenue='revenue'
    } if (req.body.data[0].data[0].Id == 112 && req.body.data[0].data[1].Id == 105) {

     query = [
         {$match:{status:3,appointmentStartTime:{$gte:new Date(req.body.date.startDate),$lt:new Date(req.body.date.endDate)}}},
         {
             $unwind:
                 {
                     path: "$allPaymentMethods",
                     preserveNullAndEmptyArrays: true
                 },
         },
         {$project: {time: {"$month": "$appointmentStartTime"},loyalityPoints:1,loyalityOffer:1, allPaymentMethods: 1,paymentMethod:1,payableAmount:1}},
         {$group:{_id:{$cond:["$allPaymentMethods:{$exists:true}","$allPaymentMethods.value","$paymentMethod"]},
             data:{$push:{"time":"$time",revenue:{$sum:{$cond:["$allPaymentMethods:{$exists:true}","$alPaymentMethods.amount","$payableAmount"]}}}}}},
         { $project: { _id: { $concat: [{ $substr: [ "$_id", 0, 5 ] },'Pay' ]},data:1}}

     ]

     var groupData = 'time'
     var revenue='revenue'
    }if (req.body.data[0].data[0].Id == 112 && req.body.data[0].data[1].Id == 106) {

     query = [
         {$match:{status:3,appointmentStartTime:{$gte:new Date(req.body.date.startDate),$lt:new Date(req.body.date.endDate)}}},
         {
             $unwind:
                 {
                     path: "$allPaymentMethods",
                     preserveNullAndEmptyArrays: true
                 },
         },

         {$project: {time:{ $concat: [{ $substr: [  {"$isoDayOfWeek": "$appointmentStartTime"}, 0, 5 ] },'Day' ]}, allPaymentMethods: 1,paymentMethod:1,payableAmount:1}},
         {$group:{_id:{$cond:["$allPaymentMethods:{$exists:true}","$allPaymentMethods.value","$paymentMethod"]},
             data:{$push:{"time":"$time",revenue:{$sum:{$cond:["$allPaymentMethods:{$exists:true}","$alPaymentMethods.amount","$payableAmount"]}}}}}},
         { $project: { _id: { $concat: [{ $substr: [ "$_id", 0, 5 ] },'Pay' ]},data:1}}

     ]

     var groupData = 'time'
     var revenue='revenue'
    }if (req.body.data[0].data[0].Id == 112 && req.body.data[0].data[1].Id == 107) {

     query = [
         {$match:{status:3,appointmentStartTime:{$gte:new Date(req.body.date.startDate),$lt:new Date(req.body.date.endDate)}}},
         {
             $unwind:
                 {
                     path: "$allPaymentMethods",
                     preserveNullAndEmptyArrays: true
                 },
         },

         {$project: {time:{ $concat: [{ $substr: [  {"$hour": "$appointmentStartTime"}, 0, 5 ] },'H' ]}, allPaymentMethods: 1,paymentMethod:1,payableAmount:1}},
         {$group:{_id:{$cond:["$allPaymentMethods:{$exists:true}","$allPaymentMethods.value","$paymentMethod"]},
             data:{$push:{"time":"$time",revenue:{$sum:{$cond:["$allPaymentMethods:{$exists:true}","$alPaymentMethods.amount","$payableAmount"]}}}}}},
         { $project: { _id: { $concat: [{ $substr: [ "$_id", 0, 5 ] },'Pay' ]},data:1}}

     ]

     var groupData = 'time'
     var revenue='revenue'
    }if (req.body.data[0].data[0].Id == 112 && req.body.data[0].data[1].Id == 108) {

     query = [
         {$match:{status:3,appointmentStartTime:{$gte:new Date(req.body.date.startDate),$lt:new Date(req.body.date.endDate)}}},
         {
             $unwind:
                 {
                     path: "$allPaymentMethods",
                     preserveNullAndEmptyArrays: true
                 },
         },

         {$project: {time:{ $concat: [{ $substr: [  {"$week": "$appointmentStartTime"}, 0, 5 ] },'W' ]}, allPaymentMethods: 1,paymentMethod:1,payableAmount:1}},
         {$group:{_id:{$cond:["$allPaymentMethods:{$exists:true}","$allPaymentMethods.value","$paymentMethod"]},
             data:{$push:{"time":"$time",revenue:{$sum:{$cond:["$allPaymentMethods:{$exists:true}","$alPaymentMethods.amount","$payableAmount"]}}}}}},
         { $project: { _id: { $concat: [{ $substr: [ "$_id", 0, 5 ] },'Pay' ]},data:1}}

     ]

     var groupData = 'time'
     var revenue='revenue'
    }

    if (req.body.data[0].data[0].Id == 104 && req.body.data[0].data[1].Id == 112) {

     query = [
         {$match:{status:3,appointmentStartTime:{$gte:new Date(req.body.date.startDate),$lt:new Date(req.body.date.endDate)}}},
         {
             $unwind:
                 {
                     path: "$allPaymentMethods",
                     preserveNullAndEmptyArrays: true
                 },
         },

         {$project: {time:{$dateToString: {format: "%Y-%m-%d", date: "$appointmentStartTime"}}, allPaymentMethods: 1,paymentMethod:1,payableAmount:1}},
         {$group:{_id:"$time",
             data:{$push:{"payment":{ $concat: [{ $substr: [ {$cond:["$allPaymentMethods:{$exists:true}","$allPaymentMethods.value","$paymentMethod"]}, 0, 5 ] },'Pay' ]},revenue:{$sum:{$cond:["$allPaymentMethods:{$exists:true}","$alPaymentMethods.amount","$payableAmount"]}}}}}},

     ]

     var groupData = 'payment'
     var revenue='revenue'
    }if (req.body.data[0].data[0].Id == 105 && req.body.data[0].data[1].Id == 112) {

     query = [
         {$match:{status:3,appointmentStartTime:{$gte:new Date(req.body.date.startDate),$lt:new Date(req.body.date.endDate)}}},
         {
             $unwind:
                 {
                     path: "$allPaymentMethods",
                     preserveNullAndEmptyArrays: true
                 },
         },

         {$project: {time:{"$month": "$appointmentStartTime"}, allPaymentMethods: 1,paymentMethod:1,payableAmount:1}},
         {$group:{_id:"$time",
             data:{$push:{"payment":{ $concat: [{ $substr: [ {$cond:["$allPaymentMethods:{$exists:true}","$allPaymentMethods.value","$paymentMethod"]}, 0, 5 ] },'Pay' ]},revenue:{$sum:{$cond:["$allPaymentMethods:{$exists:true}","$alPaymentMethods.amount","$payableAmount"]}}}}}},

     ]

     var groupData = 'payment'
     var revenue='revenue'
    } if (req.body.data[0].data[0].Id == 106 && req.body.data[0].data[1].Id == 112) {

     query = [
         {$match:{status:3,appointmentStartTime:{$gte:new Date(req.body.date.startDate),$lt:new Date(req.body.date.endDate)}}},
         {
             $unwind:
                 {
                     path: "$allPaymentMethods",
                     preserveNullAndEmptyArrays: true
                 },
         },

         {$project: {time:{ $concat: [{ $substr: [  {"$isoDayOfWeek": "$appointmentStartTime"}, 0, 5 ] },'Day' ]}, allPaymentMethods: 1,paymentMethod:1,payableAmount:1}},
         {$group:{_id:"$time",
             data:{$push:{"payment":{ $concat: [{ $substr: [ {$cond:["$allPaymentMethods:{$exists:true}","$allPaymentMethods.value","$paymentMethod"]}, 0, 5 ] },'Pay' ]},revenue:{$sum:{$cond:["$allPaymentMethods:{$exists:true}","$alPaymentMethods.amount","$payableAmount"]}}}}}},

     ]

     var groupData = 'payment'
     var revenue='revenue'
    } if (req.body.data[0].data[0].Id == 107 && req.body.data[0].data[1].Id == 112) {

     query = [
         {$match:{status:3,appointmentStartTime:{$gte:new Date(req.body.date.startDate),$lt:new Date(req.body.date.endDate)}}},
         {
             $unwind:
                 {
                     path: "$allPaymentMethods",
                     preserveNullAndEmptyArrays: true
                 },
         },

         {$project: {time:{ $concat: [{ $substr: [  {"$hour": "$appointmentStartTime"}, 0, 5 ] },'H' ]}, allPaymentMethods: 1,paymentMethod:1,payableAmount:1}},
         {$group:{_id:"$time",
             data:{$push:{"payment":{ $concat: [{ $substr: [ {$cond:["$allPaymentMethods:{$exists:true}","$allPaymentMethods.value","$paymentMethod"]}, 0, 5 ] },'Pay' ]},revenue:{$sum:{$cond:["$allPaymentMethods:{$exists:true}","$alPaymentMethods.amount","$payableAmount"]}}}}}},

     ]

     var groupData = 'payment'
     var revenue='revenue'
    } if (req.body.data[0].data[0].Id == 108 && req.body.data[0].data[1].Id == 112) {

     query = [
         {$match:{status:3,appointmentStartTime:{$gte:new Date(req.body.date.startDate),$lt:new Date(req.body.date.endDate)}}},
         {
             $unwind:
                 {
                     path: "$allPaymentMethods",
                     preserveNullAndEmptyArrays: true
                 },
         },

         {$project: {time:{ $concat: [{ $substr: [  {"$week": "$appointmentStartTime"}, 0, 5 ] },'W' ]}, allPaymentMethods: 1,paymentMethod:1,payableAmount:1}},
         {$group:{_id:"$time",
             data:{$push:{"payment":{ $concat: [{ $substr: [ {$cond:["$allPaymentMethods:{$exists:true}","$allPaymentMethods.value","$paymentMethod"]}, 0, 5 ] },'Pay' ]},revenue:{$sum:{$cond:["$allPaymentMethods:{$exists:true}","$alPaymentMethods.amount","$payableAmount"]}}}}}},

     ]

     var groupData = 'payment'
     var revenue='revenue'
    }if (req.body.data[0].data[0].Id == 101 && req.body.data[0].data[1].Id == 115) {

     query = [

         {$match:{status:3,appointmentStartTime:{$gte:new Date(req.body.date.startDate),$lt:new Date(req.body.date.endDate)}}},
         {$unwind:"$employees"},
         {$group:{_id:"$employees.name",data:{$push:{parlorId:"$parlorId",revenue:"$employees.revenue"}}}}
     ]

     var groupData = 'parlorId'
     var revenue='revenue'
    }
    if (req.body.data[0].data[0].Id == 115 && req.body.data[0].data[1].Id == 105) {

     query = [

         {$match:{status:3,appointmentStartTime:{$gte:new Date(req.body.date.startDate),$lt:new Date(req.body.date.endDate)}}},
         {$unwind:"$employees"},
         {$project:{time:{$dateToString: {format: "%Y-%m-%d", date: "$appointmentStartTime"}},"employees":1}},
         {$group:{_id:"$time",data:{$push:{name:"$employees.name",revenue:"$employees.revenue"}}}}


     ]

     var groupData = 'name'
     var revenue='revenue'
    }  if (req.body.data[0].data[0].Id == 115 && req.body.data[0].data[1].Id == 105) {

     query = [

         {$match:{status:3,appointmentStartTime:{$gte:new Date(req.body.date.startDate),$lt:new Date(req.body.date.endDate)}}},
         {$unwind:"$employees"},
         {$project:{time:{"$month":"$appointmentStartTime"},"employees":1}},
         {$group:{_id:"$time",data:{$push:{name:"$employees.name",revenue:"$employees.revenue"}}}}


     ]

     var groupData = 'name'
     var revenue='revenue'
    } if (req.body.data[0].data[0].Id == 115 && req.body.data[0].data[1].Id == 106) {

     query = [

         {$match:{status:3,appointmentStartTime:{$gte:new Date(req.body.date.startDate),$lt:new Date(req.body.date.endDate)}}},
         {$unwind:"$employees"},
         {$project:{time:{ $concat: [{ $substr: [  {"$isoDayOfWeek": "$appointmentStartTime"}, 0, 5 ] },'Day' ]},"employees":1}},
         {$group:{_id:"$time",data:{$push:{name:"$employees.name",revenue:"$employees.revenue"}}}}


     ]

     var groupData = 'name'
     var revenue='revenue'
    } if (req.body.data[0].data[0].Id == 115 && req.body.data[0].data[1].Id == 107) {

     query = [

         {$match:{status:3,appointmentStartTime:{$gte:new Date(req.body.date.startDate),$lt:new Date(req.body.date.endDate)}}},
         {$unwind:"$employees"},
         {$project:{time:{ $concat: [{ $substr: [  {"$hour": "$appointmentStartTime"}, 0, 5 ] },'H' ]},"employees":1}},
         {$group:{_id:"$time",data:{$push:{name:"$employees.name",revenue:"$employees.revenue"}}}}


     ]

     var groupData = 'name'
     var revenue='revenue'
    } if (req.body.data[0].data[0].Id == 115 && req.body.data[0].data[1].Id == 108) {

     query = [

         {$match:{status:3,appointmentStartTime:{$gte:new Date(req.body.date.startDate),$lt:new Date(req.body.date.endDate)}}},
         {$unwind:"$employees"},
         {$project:{time:{ $concat: [{ $substr: [  {"$week": "$appointmentStartTime"}, 0, 5 ] },'W' ]},"employees":1}},
         {$group:{_id:"$time",data:{$push:{name:"$employees.name",revenue:"$employees.revenue"}}}}


     ]

     var groupData = 'name'
     var revenue='revenue'
    }
        if (req.body.data[0].data[0].Id == 104 && req.body.data[0].data[1].Id == 115) {

            query = [

                {$match:{status:3,appointmentStartTime:{$gte:new Date(req.body.date.startDate),$lt:new Date(req.body.date.endDate)}}},
                {$unwind:"$employees"},
                {$project:{time:{$dateToString: {format: "%Y-%m-%d", date: "$appointmentStartTime"}},"employees":1}},
                {$group:{_id:"$employees.name",data:{$push:{time:"$time",revenue:"$employees.revenue"}}}}


            ]

            var groupData = 'time'
            var revenue='revenue'
        }if (req.body.data[0].data[0].Id == 105 && req.body.data[0].data[1].Id == 115) {

            query = [

                {$match:{status:3,appointmentStartTime:{$gte:new Date(req.body.date.startDate),$lt:new Date(req.body.date.endDate)}}},
                {$unwind:"$employees"},
                {$project:{time:{"$month":"$appointmentStartTime"},"employees":1}},
                {$group:{_id:"$employees.name",data:{$push:{time:"$time",revenue:"$employees.revenue"}}}}


            ]

            var groupData = 'time'
            var revenue='revenue'
        }     if (req.body.data[0].data[0].Id == 106 && req.body.data[0].data[1].Id == 115) {

            query = [

                {$match:{status:3,appointmentStartTime:{$gte:new Date(req.body.date.startDate),$lt:new Date(req.body.date.endDate)}}},
                {$unwind:"$employees"},
                {$project:{time:{ $concat: [{ $substr: [  {"$isoDayOfWeek": "$appointmentStartTime"}, 0, 5 ] },'Day' ]},"employees":1}},
                {$group:{_id:"$employees.name",data:{$push:{time:"$time",revenue:"$employees.revenue"}}}}


            ]

            var groupData = 'time'
            var revenue='revenue'
        }    if (req.body.data[0].data[0].Id == 107 && req.body.data[0].data[1].Id == 115) {

            query = [

                {$match:{status:3,appointmentStartTime:{$gte:new Date(req.body.date.startDate),$lt:new Date(req.body.date.endDate)}}},
                {$unwind:"$employees"},
                {$project:{time:{ $concat: [{ $substr: [  {"$hour": "$appointmentStartTime"}, 0, 5 ] },'H' ]},"employees":1}},
                {$group:{_id:"$employees.name",data:{$push:{time:"$time",revenue:"$employees.revenue"}}}}


            ]

            var groupData = 'time'
            var revenue='revenue'
        }    if (req.body.data[0].data[0].Id == 108 && req.body.data[0].data[1].Id == 115) {

            query = [

                {$match:{status:3,appointmentStartTime:{$gte:new Date(req.body.date.startDate),$lt:new Date(req.body.date.endDate)}}},
                {$unwind:"$employees"},
                {$project:{time:{ $concat: [{ $substr: [  {"$week": "$appointmentStartTime"}, 0, 5 ] },'W' ]},"employees":1}},
                {$group:{_id:"$employees.name",data:{$push:{time:"$time",revenue:"$employees.revenue"}}}}


            ]

            var groupData = 'time'
            var revenue='revenue'
        }

    console.log("Aggregation Query",JSON.stringify(query))
    Appointment.aggregate(query, function (err, rev) {

                    var dataa = _.map(rev, function (s) {
                        var result = s.data.reduce(function (acc, x) {
                            var id = acc[x[groupData]]
                            if (id) {
                                id[revenue] += x[revenue]
                                id['count'] += x['count']

                            } else {
                                acc[x[groupData]] = x
                                delete x[groupData]
                            }
                            return acc
                        }, {});

                        return {
                            _id:s._id,
                            data: result
                            }

                    })




            var dataFinal=_.map(dataa,function (data) {
                var dat=[];
                for(var key in data.data) {
                    dat.push({
                        "label": key,
                        "value": data.data[key].revenue,
                        "sum": data.data[key].count,
                    })
                }

                return {
                       "key":data._id,
                       "values":dat

                }

            })

                var dataSend=_.map(_.sortBy(_.map(dataFinal,function (d) {

                    return {
                            "key":d.key,
                            "values":_.map(_.sortBy(d.values,function (m) {
                                return m.label
                            }),function (s) {

                                if(req.body.data[1].Ids[0].id == 207 ){
                                    var val=s.value/s.sum
                                }else{
                                    var val=s.value
                                }

                                return {
                                    "label": parlorName(s.label),
                                    "value": val,

                                }
                            })
                    }

                }),function (ds) {
                    return ds.key

                }),function (sd) {
                    return {
                        "key":parlorName(sd.key),
                        "values":sd.values
                    }

                })
            res.json(CreateObjService.response(false, dataSend))

                })

    }


    })


    router.post('/getDimension', function (req, res) {

    GraphDimension.find({}, function (err, result) {

        if (err) {
            res.json(CreateObjService.response(true, err))

        } else {


            var groupD = _.groupBy(result, function (y) {

                return y.groupName
            })

            var dimension = _.groupBy(groupD.dimension, function (e) {

                return e.type
            })
            var measures = _.groupBy(groupD.measures, function (e) {

                return e.type
            })

            res.json(CreateObjService.response(false, [dimension, measures]))
        }

    })

    })


    router.post('/add', function (req, res) {


    GraphDimension.create({
        name: req.body.name,
        group: req.body.group,
        groupName: req.body.groupName,
        type: req.body.type,
        show: req.body.show,
        Id: req.body.Id,
    }, function (err, result) {
        res.json(result)

    })

    })


    router.get('/updateService', function (req, res) {

    Appointment.find({}, function (err, appoint) {

        _.forEach(appoint, function (item) {

            async.each(item.services, function (service, callback) {
                var totalRevenue = 0, totalSale = 0, totalCount = 0,
                    serviceLoyalityRevenue = service.loyalityPoints * 0.75;
                if (service.discountMedium == "frequency" && !service.frequencyDiscountUsed) {
                    totalRevenue += 0;
                    totalSale += (service.price + service.additions) * service.quantity - service.discount;
                } else if (service.discountMedium == "frequency" && service.frequencyDiscountUsed) {
                    totalRevenue += ((service.price + service.additions) * service.quantity - (service.membershipDiscount ? service.membershipDiscount : 0));
                    totalSale += (service.price + service.additions) * service.quantity;
                    if (service.loyalityPoints) {
                        totalRevenue -= service.loyalityPoints * 0.25;
                        totalSale -= service.loyalityPoints * 0.25;
                    }
                }
                else {
                    if (service.discount) {
                        totalRevenue += (service.price - service.discount + service.additions) * service.quantity;
                        totalSale += (service.price - service.discount + service.additions) * service.quantity;
                    } else {
                        totalRevenue += (service.price + service.additions) * service.quantity;
                        totalSale += (service.price + service.additions) * service.quantity;
                    }
                    if (service.membershipDiscount) {
                        totalRevenue -= service.membershipDiscount;
                        totalSale -= service.membershipDiscount;
                    }
                    if (service.loyalityPoints) {
                        totalRevenue -= service.loyalityPoints * 0.25;
                        totalSale -= service.loyalityPoints * 0.25;
                    }
                }

                console.log(service._id)
                Appointment.update({"services._id": ObjectId(service._id)}, {$set: {"services.$.revenue": totalRevenue}}, function (err, result) {
                    if (err) console.log(err)
                    callback()


                })

            }, function (done) {
                console.log('done')

            })

        })


    })

    })


    router.get('/getParlorList', function (req, res) {

    Parlor.find({}, {name: 1}, function (err, parlors) {

        var parlorsSend = [];
        _.forEach(parlors, function (s) {
            if ((s._id).toString() == "594dfbba7adea71e4d74c16b") {
                parlorsSend.push({name: "Aalenes2", id: s._id})
            } else if ((s._id).toString() == "58ded8be57a5140f302bb555") {
                parlorsSend.push({name: "kabi2", id: s._id})
            } else {
                parlorsSend.push({name: s.name, id: s._id})

            }
        })

        res.json(parlorsSend)

    })

    })


    module.exports = router;
