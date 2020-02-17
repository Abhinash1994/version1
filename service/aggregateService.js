module.exports = {

    appointmentFreeHairCutClients: function(req, callback){
        Appointment.aggregate([
        {
            $unwind : "$services"
        },
        {
            $match : AggregateHelper.getAppointmentMonthlyMatchObj(req, 'freeHairCut'),
        },
        {
            $project : AggregateHelper.getAppointmentMonthlyProjectObj('freeHairCutClients'),
        },
        {
            $group : {
                '_id' : '$client.id',
                'date': {$first: '$appointmentStartTime'}, 
            }
        }
        ]).exec(function(err, results){
            var results = _.map(results, function(r){                     
                return{
                    clientId : r._id,
                    date : r.date,
                    secondVisitRevenue : 0
                };
            });
            return callback(results);
        });
    },

    // all other services /hair b s  20 > green, 10 - 20 orange, red

    parlorRecommendation: function(pId, callback){
        var employeesRevenueRatio = [], otherReports = [];
        let parlorId = ObjectId(pId);
        Async.parallel([
            function(callback) {
                Admin.find({parlorId : parlorId, active : true}, {firstName: 1, lastName: 1, salary: 1}, function(er, admins){
                    var employeeIds = _.map(admins, function(emp){return ObjectId(emp.id)});
                    Appointment.aggregate([
                    {$match : {status : 3,appointmentStartTime : {$gt : HelperService.getLastThreeMonthStart()},parlorId : parlorId,},
                    },
                    {
                        $project :{"employees.employeeId" : 1,"employees.revenue" : 1,}
                    },
                    {
                        $unwind : "$employees"
                    },
                    {
                        $match : {"employees.employeeId" : {$in : employeeIds}},
                    },
                    {
                        $group : {_id : "$employees.employeeId",employeeId : {$first : "$employees.employeeId"},revenue : {$sum : "$employees.revenue"}}
                    }
                    ]).exec(function(er, data){
                        employeesRevenueRatio = _.map(admins, function(a){
                            let r = _.filter(data, function(em){ return em.employeeId + "" == a.id +""})[0];
                            let revenue = r ? parseInt(r.revenue) : 0;
                            return{
                                name : a.firstName,
                                salary : a.salary*3,
                                revenue : revenue,
                                ratio : parseFloat((revenue/(a.salary*3)).toFixed(2))
                            }
                        });
                        employeesRevenueRatio = _.filter(employeesRevenueRatio, function(e){return e.ratio<3});
                        callback();
                    })
                });
            },
            function(callback){
                AggregateService.getCountByCategoryByParlor(parlorId, "58707ed90901cc46c44af27d", function(data){
                    AggregateService.getCountByCategoryByParlor(parlorId, 202, function(data2){
                        let ratio = parseInt((data[1]/data2[1])*100);
                        let ratio2 = parseInt((data[0]/data2[0])*100);
                        otherReports.push({
                            name : "Hair Straightening/ Hair Cut(F)",
                            ratio : ratio,
                            previousRatio : ratio2,
                            sort : 1,
                            color : ratio > 30 ? "green" : ratio < 20 ? "red" : "orange"
                        });
                        callback()
                    });
                });
            },
            function(callback){
                AggregateService.getCountByCategoryByParlor(parlorId, "58707ed90901cc46c44af27e", function(data){
                    AggregateService.getCountByCategoryByParlor(parlorId, 202, function(data2){
                        let ratio = parseInt((data[1]/data2[1])*100);
                        let ratio2 = parseInt((data[0]/data2[0])*100);
                        otherReports.push({
                            name : "Hair Color/ Hair Cut(F)",
                            ratio : ratio,
                            previousRatio : ratio2,
                            sort : 2,
                            color : ratio > 30 ? "green" : ratio < 20 ? "red" : "orange"
                        });
                        callback()
                    });
                });
            },
            function(callback){
                AggregateService.getCountByCategoryByParlor(parlorId, "58707ed90901cc46c44af27d", function(data){
                    AggregateService.getCountByCategoryByParlor(parlorId, "58707ed90901cc46c44af27c", function(data2){
                        let ratio = parseInt((data[1]/data2[1])*100);
                        let ratio2 = parseInt((data[0]/data2[0])*100);
                        otherReports.push({
                            name : "Hair Straightening/ Hair Spa",
                            ratio : ratio,
                            previousRatio : ratio2,
                            sort : 3,
                            color : ratio > 50 ? "green" : ratio < 30 ? "red" : "orange"
                        });
                        callback()
                    });
                });
            },
             function(callback){
                AggregateService.getCountByCategoryByParlor(parlorId, "58707ed90901cc46c44af27e", function(data){
                    AggregateService.getCountByCategoryByParlor(parlorId, "58707ed90901cc46c44af27f", function(data2){
                        let ratio = parseInt((data[1]/data2[1])*100);
                        let ratio2 = parseInt((data[0]/data2[0])*100);
                        otherReports.push({
                            name : "Hair Color/ Color Touch Up",
                            ratio : ratio,
                            previousRatio : ratio2,
                            sort : 4,
                            color : ratio > 50 ? "green" : ratio < 30 ? "red" : "orange"
                        });
                        callback()
                    });
                });
            },
            function(callback){
                AggregateService.getCountByCategoryByParlor(parlorId, "58707ed90901cc46c44af278", function(data){
                    AggregateService.getCountByCategoryByParlor(parlorId, "58707ed90901cc46c44af27a", function(data2){
                        let ratio = parseInt((data[1]/data2[1])*100);
                        let ratio2 = parseInt((data[0]/data2[0])*100);
                        otherReports.push({
                            name : "Facial/ Threading",
                            ratio : ratio,
                            previousRatio : ratio2,
                            sort : 5,
                            color : ratio > 25 ? "green" : ratio < 15 ? "red" : "orange"
                        });
                        callback()
                    });
                });
            },
            function(callback){
                AggregateService.getCountByCategoryByParlor(parlorId, "58707ed90901cc46c44af279", function(data){
                    AggregateService.getCountByCategoryByParlor(parlorId, "58707ed90901cc46c44af27a", function(data2){
                        let ratio = parseInt((data[1]/data2[1])*100);
                        let ratio2 = parseInt((data[0]/data2[0])*100);
                        otherReports.push({
                            name : "Body Wax/ Threading",
                            ratio : ratio,
                            previousRatio : ratio2,
                            sort : 6,
                            color : ratio > 40 ? "green" : ratio < 25 ? "red" : "orange"
                        });
                        callback()
                    });
                });
            },
            function(callback){
                AggregateService.getCountByCategoryByParlor(parlorId, "58707ed90901cc46c44af284", function(data){
                    AggregateService.getCountByCategoryByParlor(parlorId, 201, function(data2){
                        let ratio = parseInt((data[1]/data2[1])*100);
                        let ratio2 = parseInt((data[0]/data2[0])*100);
                        otherReports.push({
                            name : "Mani - Pedi/ Total Female Clients",
                            ratio : ratio,
                            previousRatio : ratio2,
                            sort : 7,
                            color : ratio > 40 ? "green" : ratio < 25 ? "red" : "orange"
                        });
                        callback()
                    });
                });
            },
            function(callback){
                AggregateService.getCountByServiceCodesByParlor(parlorId, {$in : [11,12,21,15,18,46,58,19,22,30,56,43,16,20,70,23,28,53,42,54,13,17,9,55,57,36,51,119,135,136,130,131,116,133,118,124,206,210,225,78,122,126,127,129,376,125,132,103,377,112,134,117,77,496,309,375,87,494,308,86,312,419,93,307,414,102,421,314,95,109,492,493,85,460,310,412,490,495,447,488,88,491,528,519,529,531,549,551,553,555,557,559,573,575,591,592,609,610,629,637,645,664,694,704,724,758,760,762,775,777,779,781,783,785,788,789,791] }, function(data){
                    AggregateService.getCountByServiceCodesByParlor(parlorId,{$in :  [52, 121, 14] }, function(data2){
                        let ratio = parseInt((data[1]/data2[1])*100);
                        let ratio2 = parseInt((data[0]/data2[0])*100);
                        otherReports.push({
                            name : "All Service Male/ Hair Cut(M), Beard Trimming, Shaving",
                            ratio : ratio,
                            previousRatio : ratio2,
                            sort : 8,
                            color : ratio > 20 ? "green" : ratio < 10 ? "red" : "orange"
                        });
                        callback()
                    });
                });
            },
        ],
        function(err, results) {
            otherReports = _.orderBy(otherReports, 'sort', 'asc');
            return callback({employeesRevenueRatio : employeesRevenueRatio, otherReports : otherReports});
        });
    },

    getCountByServiceCodesByParlor: function(parlorId, serviceCodes, callback){
        AggregateService.getCountByServiceCodesAndTimeByParlor(parlorId, serviceCodes, HelperService.getLastFourMonthStart() , HelperService.getLastMonthStart(), function(d1){
            AggregateService.getCountByServiceCodesAndTimeByParlor(parlorId, serviceCodes, HelperService.getLastThreeMonthStart(), new Date(), function(d2){
                return callback([d1, d2]);
            });
        });
    },


    getCountByCategoryByParlor: function(parlorId, categoryId, callback){
        AggregateService.getCountByCategoryAndTimeByParlor(parlorId, categoryId,HelperService.getLastFourMonthStart() , HelperService.getLastMonthStart(), function(d1){
            AggregateService.getCountByCategoryAndTimeByParlor(parlorId, categoryId, HelperService.getLastThreeMonthStart(), new Date(), function(d2){
                return callback([d1, d2]);
            });
        });
    },

    getCountByServiceCodesAndTimeByParlor: function(parlorId, serviceCodes, date1, date2, callback){
        let match = {"services.serviceCode" : serviceCodes};
        Appointment.aggregate([
            {
                $match : {
                    parlorId : parlorId,
                    status : 3,
                    appointmentStartTime : {$gt : date1, $lt : date2},
                }
            },
            {
                $project : {
                    "services.serviceCode" : 1,
                    "services.categoryId" : 1,
                }
            },
            {
                $unwind : "$services"
            },
            {
                $match : match
            },
            {
                $group : {
                    _id : null,
                    count : {$sum : 1},
                }
            }
        ]).exec(function(er, data){
            return callback(data.length > 0 ? parseInt(data[0].count) : 0);
        });
    },

    getCountByCategoryAndTimeByParlor: function(parlorId, categoryId, date1, date2, callback){
        let match = {
            "services.categoryId" : ObjectId(categoryId)
        };
        if(categoryId == 202){
            match = { "services.serviceCode" : 202 }
        }
        if(categoryId != 201){
            Appointment.aggregate([
                {
                    $match : {
                        parlorId : parlorId,
                        status : 3,
                        appointmentStartTime : {$gt : date1, $lt : date2},
                    }
                },
                {
                    $project : {
                        "services.serviceCode" : 1,
                        "services.categoryId" : 1,
                    }
                },
                {
                    $unwind : "$services"
                },
                {
                    $match : match
                },
                {
                    $group : {
                        _id : null,
                        count : {$sum : 1},
                    }
                }
            ]).exec(function(er, data){
                return callback(data.length > 0 ? parseInt(data[0].count) : 0);
            });
        }else{
            Appointment.aggregate([
                {
                    $match : {
                        parlorId : parlorId,
                        status : 3,
                        // "client.gender" : "F",
                        appointmentStartTime : {$gt : date1,  $lt : date2},
                    }
                },
                {
                    $project :{
                        "client.id" : 1
                    }
                },
                {
                    $lookup : {
                        from : "users",
                        localField : "client.id",
                        foreignField : "_id",
                        as : "user",
                    }
                },
                {
                    $project : {
                        clientId : "$client.id",
                        gender : { $arrayElemAt: [ "$user.gender", 0 ] },
                    }
                },
                {
                    $match : {
                        gender : "F"
                    }
                },
                {
                    $group : {
                        _id : "$clientId",
                        clientId :{$first :  "$clientId" },
                    }
                },
                {
                    $group : {
                        _id : null,
                        count : {$sum : 1}
                    }
                }
            ]).exec(function(err, data){
                return callback(data.length > 0 ? parseInt(data[0].count) : 0);
            });
        }
    },

    repeatCustomerPattern: function(callback){
        var dateRange = { $gt : new Date(2017, 0, 1) };
        Appointment.aggregate([
        {
            $match : {
                status : 3,
                parlorId : {$nin : [ObjectId("587084715c63a33c0af62724"), ObjectId("5870828f5c63a33c0af62721"), ObjectId("594dfcd97adea71e4d74c1d7")]},
                // appointmentType : {$in : [1,2]},
            }
        },
        {
            $project : {
                clientId : "$client.id",
                appointmentStartTime : "$appointmentStartTime",
                appointmentType : 1,
                payableAmount : 1,
            }
        },
        {
            $sort : { appointmentStartTime : 1},
        },
        {
            $group : {
                _id : {
                    clientId : "$clientId",
                },
                dates : {$push : "$appointmentStartTime"},
                clientId : {$first : "$clientId"},
                firstDate : {$first : "$appointmentStartTime"},
                firstAppointmentType : {$first : "$appointmentType"},
                payableAmount2 : {$first : "$payableAmount"},

            }
        },
        {
            $match : {
                "firstDate" : {$gt : new Date(2017, 0, 1), $lt : new Date(2017, 0, 31)},
                // "firstAppointmentType" : {$in : [1,2,3]},
                // payableAmount2 : {$gt : 100},
            }
        },
        {
            $group : {
                _id : null,
                previousData : {$push : {dates : "$dates", clientId : "$clientId"}},
                noOfClientsFirstTime : {$sum : 1},
            }
        },
        {
            $unwind : "$previousData",
        },
        {
            $project : {
                clientId : "$previousData.clientId",
                dates : "$previousData.dates",
                noOfClientsFirstTime : 1,
            }
        },
        {
            $unwind : "$dates",
        },
        {
            $match : {
                "dates" : {$gt : new Date(2017, 1, 1), $lt : new Date(2017, 8, 16)}
            }
        },
        {
            $group : {
                _id : {
                    clientId : "$clientId",
                },
                clientId : {$first : "$clientId"},
                dates : {$push : "$dates"},
                noOfClientsFirstTime : {$first : "$noOfClientsFirstTime"},
            }
        }/*,
        {
            $project : {
                clientId : 1,
                noOfTime : {$sum : "$dates" },
                noOfClientsFirstTime : 1,
            }
        },
        {
            $group : {
                _id : null,
                noOfClientsSecondTime : {$sum : 1},
                noOfClientsFirstTime : {$push : "$noOfClientsFirstTime"},
            }
        }*/
        ]).exec(function(err, results){
            console.log(err);
            return callback(results);
        });
    },

    thousandCashbackSpend: function(callback){
        User.aggregate([
        {
            $unwind : "$creditsHistory"
        },
        {
            $match : {
                createdAt : {$gt : new Date(2017, 4, 1)},
                "creditsHistory.reason" : "Used for appointment",
            }
        },
        {
            $group : {
                _id : {
                    userId : "$_id",
                },
                appointments : {$push : "$creditsHistory.source"}
            }
        },
        {
            $project : {
                appointmentId : {$arrayElemAt: ["$appointments", 0]}
            }
        },
        {
            $match : {
                appointmentId : {$ne : null}
            }
        },
        {
            $lookup : {
                from : "appointments",
                localField : "appointmentId",
                foreignField : "_id",
                as : "appointment",
            }
        },
        {
            $project : {
                subtotal : {$arrayElemAt: [ "$appointment.subtotal", 0 ] },
            }
        },
        {
            $group : {
                _id : {
                    mod : {$floor : { $divide : [ "$subtotal" , 500 ]} }
                },
                count : { $sum : 1},
            }
        },
        {
            $project : {
                mod : "$_id.mod",
                count : 1,
            }
        },
        {
            $match : {mod : {$ne : null}}
        },
        {
            $sort : {mod : 1}
        }
        ]).exec(function(err, results){
            return callback(results);
        });
    },

    cashOnlineReport: function(req, count, withFreeHair ,callback){
        var match = {
                status : 3,
                appointmentStartTime: {$gte: new Date(2017, 4, 1)},
            };
        if(!withFreeHair)match.payableAmount = {$ne : 0};
        Appointment.aggregate([
        {
            $match : match
        },
        {
            $project : {
                clientId : "$client.id",
                serviceRevenue : 1,
                paymentMethod : {$cond: { if: { $eq: [ "$appointmentType", 3 ] }, then: 5, else: 1 }},
            }
        },
        {
            $group : {
                _id : {
                    paymentMethod : "$paymentMethod",
                    clientId : "$clientId",
                },
                paymentMethod : { $first : "$paymentMethod"},
                serviceRevenue : {$push : "$serviceRevenue"},
                count : {$sum : 1},
            }
        },
        {
            $match : {
                count : {$eq : count},
            }
        },
        {
            $project : {
                paymentMethod : 1,
                serviceRevenue : {$arrayElemAt: ["$serviceRevenue", (count-1)]},
            }
        },
        {
            $group : {
                _id : {
                    paymentMethod : "$paymentMethod",
                },
                noOfAppointments : {$sum : 1},
                revenue : {$sum : "$serviceRevenue"},
                zero : {$sum : {$cond: { if: { $lte: [ "$serviceRevenue", 500 ] }, then: "$serviceRevenue", else: 0 }} },
                zeroCount : {$sum : {$cond: { if: { $lte: [ "$serviceRevenue", 500 ] }, then: 1, else: 0 }} },
                fiveHundred : {$sum : {$cond: { if: { $lte: [ "$serviceRevenue", 1000 ] }, then: { $cond: { if: { $gt: [ "$serviceRevenue", 500 ] }, then: "$serviceRevenue", else: 0 } }, else: 0 }} },
                fiveHundredCount : {$sum : {$cond: { if: { $lte: [ "$serviceRevenue", 1000 ] }, then: { $cond: { if: { $gt: [ "$serviceRevenue", 500 ] }, then: 1, else: 0 } }, else: 0 }} },
                thousand : {$sum : {$cond: { if: { $lte: [ "$serviceRevenue", 2000 ] }, then: { $cond: { if: { $gt: [ "$serviceRevenue", 1000 ] }, then: "$serviceRevenue", else: 0 } }, else: 0 }} },
                thousandCount : {$sum : {$cond: { if: { $lte: [ "$serviceRevenue", 2000 ] }, then: { $cond: { if: { $gt: [ "$serviceRevenue", 1000 ] }, then: 1, else: 0 } }, else: 0 }} },
                twoThousand : {$sum : {$cond: { if: { $gt: [ "$serviceRevenue", 2000 ] }, then: "$serviceRevenue", else: 0 }} },
                twoThousandCount : {$sum : {$cond: { if: { $gt: [ "$serviceRevenue", 2000 ] }, then: 1, else: 0 }} },
                paymentMethod : {$first : "$paymentMethod"},

            }
        }
        ]).exec(function(err, results){
            return callback({results : results , count : count});
        });
    },

    newComboDeals: function(dealId, parlorId, callback){
        var aggregateArray = [];
        var match = {
            dealId : dealId ? parseInt(dealId) : {$nin : []},
            // dealId : 126,
            "dealType.name" : "newCombo",
            active : 1,
            isDeleted : false,
        };
        if(parlorId)match.parlorId = ObjectId(parlorId);
        var otherArregateValue = [
        {
            $match : match,
        },
        {
            $unwind : "$newCombo"
        },
        {
            $unwind : "$newCombo.serviceIds"
        },
        {
            $project : {
                dealId : "$_id",
                dealType : "$dealType.name",
                slabId : "$slabId",
                title : "$newCombo.title",
                type : "$newCombo.type",
                serviceId : "$newCombo.serviceIds",
                parlorTypesDetail : 1,
                name : 1,
                description : 1,
                menuPrice : 1,
                dealPrice  :1,
                weekDay : 1,
                categoryIds : 1,
            }
        },
        {
            $lookup :  {
                from : "services",
                localField : "serviceId",
                foreignField : "_id",
                as : "service",
            }
        },
        {
            $project : {
                serviceName : {$arrayElemAt: [ "$service.name", 0 ] },
                serviceSort : {$arrayElemAt: [ "$service.sort", 0 ] },
                serviceCode : {$arrayElemAt: [ "$service.serviceCode", 0 ] },
                gender : {$arrayElemAt: [ "$service.gender", 0 ] },
                serviceBrand : { $arrayElemAt: [ {$arrayElemAt: [ "$service.prices", 0 ] } , 0 ] },
                serviceDescription : {$arrayElemAt: [ "$service.description", 0 ] },
                categoryId : {$arrayElemAt: [ "$service.categoryId", 0 ] },
                dealId : 1,
                dealType : 1,
                slabId : 1,
                title : 1,
                type : 1,
                serviceId : 1,
                name : 1,
                description : 1,
                shortDescription : 1,
                menuPrice : 1,
                dealPrice  :1,
                weekDay : 1,
                dealsCategory : "$categoryIds",
                parlorTypesDetail : 1,
            }
        },
        {
            $group : {
                    _id :   {
                        dealId : "$dealId",
                        title : "$title"
                    },
                services : { $push : {
                        name : '$serviceName',
                        serviceCode : '$serviceCode',
                        brand : "$serviceBrand.brand",
                        serviceCode : '$serviceCode',
                        serviceId : '$serviceId',
                        subTitle : "$subTitle",
                        serviceDescription:"$serviceDescription",
                        categoryId : "$categoryId",
                    }
                },
                
                title : { $first : "$title" },
                type : { $first : "$type" },
                gender : { $first : "$gender" },
                dealId :{ $first:  "$dealId" },
                dealType : { $first : "$dealType" },
                slabId  : { $first : "$slabId" },
                name : { $first : "$name"},
                description : { $first : "$description"},
                shortDescription : { $first : "$shortDescription"},
                menuPrice : { $first : "$menuPrice"},
                dealPrice  :{ $first : "$dealPrice"},
                weekDay : { $first : "$weekDay"},
                dealsCategory : { $first : "$dealsCategory"},
                parlorTypesDetail : {$first : "$parlorTypesDetail"},
            }
        }
        ];
        _.forEach(otherArregateValue, function(v){ aggregateArray.push(v)});
        if(!dealId){
            aggregateArray.push({
                    $group : {
                        _id : {
                            dealId : "$dealId",
                        },
                        selectors : { $push : {
                                services : "$services",
                                title : "$title",
                                type : "$type",
                                dealType : "$dealType",
                            }
                        },
                        dealId : {$first : "$dealId"},
                        dealType : {$first : "$dealType"},
                        slabId : {$first : "$slabId"},
                        name : { $first : "$name"},
                        gender : { $first : "$gender"},
                        description : { $first : "$description"},
                        shortDescription : { $first : "$shortDescription"},
                        menuPrice : { $first : "$menuPrice"},
                        dealPrice  :{ $first : "$dealPrice"},
                        weekDay : { $first : "$weekDay"},
                        dealsCategory : { $first : "$dealsCategory"},
                        parlorTypesDetail : {$first : "$parlorTypesDetail"},
                    }
                }
            );
        }
        if(parlorId){
            Deals.aggregate(aggregateArray).exec(function(err, results){
                return callback(results);
            });
        }else{
            AllDeals.aggregate(aggregateArray).exec(function(err, results){
                return callback(results);
            });
        }
            
    },

    comboNewComboParlors: function(dealIds , parlorId, callback){
        var match = {
            'dealType.name' : {$in : ["combo", "newCombo"] },
            dealId : {$in : dealIds },
        };
        if(parlorId)match.parlorId = ObjectId(parlorId);
        Deals.aggregate([
        {
            $match : match
        },
        {
            $project : {
                parlorId : 1,
                dealId : 1,
                slabId : 1,
                parlorDealId : "$_id",
            }
        },
        {
            $group : {
                _id : {
                    dealId : "$dealId",
                },
                parlors : {
                    $push : {
                        parlorId : "$parlorId",
                        dealId : "$parlorDealId",
                    }
                },
                dealId : {$first : "$dealId"},
                slabId : {$first : "$slabId"},
            }
        }
        ]).exec(function(err, deals){
            return callback(deals);
        });
    },

    allPackagesByParlor: function(gender, parlorId, callback){
        var aggregateArray = [];
        var newGender = gender;
        var match = {
            genders : gender,
            active : 1,
            isDeleted : false,
        };
        var dealTypes = ["combo","newCombo"];
        aggregateArray.push({
            $project : {
                dealId : 1,
                "brands.parlorLatLongs" : 1,
                "brands.brandId" : 1,
                name : 1,
                parlorDealId : "$_id",
                description : 1,
                shortDescription : 1,
                menuPrice : 1,
                active : 1,
                isDeleted : 1,
                dealPrice : 1,
                newCombo : 1,
                sort : 1,
                dealSort : 1,
                dealType : 1,
                slabId : 1,
                services : 1,
                parlorId : 1,
                genders : 1,
                allHairLength:1,
            }
        });
        
        if(parlorId){
            match.parlorId = ObjectId(parlorId);
            match["dealType.name"] = {$in : dealTypes};
        }
        aggregateArray.push({
            $match : match
        });
        var otherArregateValue = [
            {
                $unwind : {
                    path: "$services",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $group : {
                    _id : {
                        dealId : "$dealId",
                        services : "$services.serviceCode",
                    },
                    dealId : {$first : "$dealId"},
                    parlorDealId : {$first : "$parlorDealId"},
                    name : {$first : "$name"},
                    description : {$first : "$description"},
                    shortDescription : {$first : "$shortDescription"},
                    menuPrice : {$first : "$menuPrice"},
                    dealPrice : {$first : "$dealPrice"},
                    newCombo : {$first : "$newCombo"},
                    slabId : {$first : "$slabId"},
                    sort : {$first : "$sort"},
                    dealSort : {$first : "$dealSort"},
                    dealType : {$first : "$dealType"},
                    services : {$first : "$services"},
                    brands : {$first : "$brands"},
                    allHairLength :{$first :"$allHairLength"},
                }
            },
            {
                $lookup :  {
                    from : "services",
                    localField : "services.serviceCode",
                    foreignField : "serviceCode",
                    as : "service",
                }
            },
            {
                $project : {
                    serviceName : {$arrayElemAt: [ "$service.name", 0 ] },
                    serviceSort : {$arrayElemAt: [ "$service.sort", 0 ] },
                    gender : { $ifNull : [ {$arrayElemAt: [ "$service.gender", 0 ] }, gender]},
                    serviceCode : {$arrayElemAt: [ "$service.serviceCode", 0 ] },
                    serviceId : {$arrayElemAt: [ "$service._id", 0 ] },
                    serviceBrand : { $arrayElemAt: [ {$arrayElemAt: [ "$service.prices", 0 ] } , 0 ] },
                    subCategoryId : {$arrayElemAt: [ "$service.subCategoryId", 0 ] },
                    subTitle : {$arrayElemAt: [ "$service.subTitle", 0 ] },
                    dealId : 1,
                    parlorDealId : 1,
                    name : 1,
                    brands : 1,
                    description : 1,
                    shortDescription : 1,
                    menuPrice : 1,
                    slabId :  1,
                    price : "$dealPrice",
                    allHairLength :1,
                    sort : 1,
                    dealSort : 1,
                    newCombo : 1,
                    dealPrice : "$dealType.price",
                    dealType : "$dealType.name",
                    categoryIds : 1,
                }
            },
            {
                $match : { gender : gender },
            },
            {
                $group : {
                    _id : {
                        dealId : "$dealId"
                    },
                    name : { $first : '$name'},
                    description : { $first : '$description'},
                    shortDescription : { $first : '$shortDescription'},
                    menuPrice : { $first : '$menuPrice'},
                    price : { $first : '$price'},
                    parlorTypesDetail : {$first : '$parlorTypesDetail'},
                    allHairLength : {$first : '$allHairLength'},
                    dealId : { $first : '$dealId'},
                    parlorDealId : { $first : '$parlorDealId'},
                    dealPrice : { $first : '$dealPrice'},
                    sort : { $first : '$sort'},
                    type : {$first : "$subCategoryId"},
                    dealSort : {$first : "$dealSort"},
                    newCombo : {$first : "$newCombo"},
                    slabId : {$first : "$slabId"},
                    brands : {$first : "$brands"},
                    dealType : { $first : '$dealType'},
                    gender : { $first : '$gender'},
                    categoryIds : { $first : '$categoryIds'},
                    dealsCategory : {$first : '$dealsCategory'},
                    services : { $push : {
                            name : '$serviceName',
                            serviceCode : '$serviceCode',
                            brand : "$serviceBrand.brand",
                            serviceCode : '$serviceCode',
                            serviceId : '$serviceId',         
                            categoryId : '$categoryId',         
                            subTitle : "$subTitle",
                            parlorTypesDetailService : "$parlorTypesDetailService",
                        }
                    }
                }
            },
            {
                $sort : {
                    dealSort : 1,
                    sort : 1,
                }
            }
        ];
        _.forEach(otherArregateValue, function(v){ aggregateArray.push(v)});
        Deals.aggregate(aggregateArray).exec(function(err, results){
            console.log(err);
            return callback(results);
        });
    },

    categoryListByDeals: function(req, callback){
        AllDeals.aggregate([
            {
                $match : {
                    active : 1,
                    isDeleted : false,
                    hideOnMainPageApp : false,
                    "dealType.name" : {$nin : ["combo", "newCombo"] },
                }
            },
            {
                $project : {
                    categoryIds : 1,
                    genders : 1,
                    sort : 1,
                    dealSort : 1,
                }
            },
            {
                $unwind : {
                    path: "$genders",
                }
            },
            {
                $unwind : {
                    path: "$categoryIds",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project : {
                    gender : "$genders",
                    categoryId : "$categoryIds",
                    sort : 1,
                    dealSort : 1,
                }
            },
            {
                $lookup: {
                    from : "servicecategories",
                    localField : "categoryId",
                    foreignField : "_id",
                    as : "category",
                }
            },
            {
                $project : {
                    name : {$arrayElemAt: [ "$category.name", 0 ] },
                    gender : 1,
                    categoryId : "$categoryId",
                    sort : {$arrayElemAt: [ "$category.sort", 0 ] },
                    maleImage : {$arrayElemAt: [ "$category.maleImage", 0 ] },
                    femaleImage : {$arrayElemAt: [ "$category.femaleImage", 0 ] },
                }
            },
            {
                $project : {
                    image : {$cond: { if: { $eq: [ "$gender", "M" ] }, then: "$maleImage", else: "$femaleImage" }},
                    name : 1,
                    gender : 1,
                    categoryId : 1,
                    sort : 1,
                }
            },
            {
                $match : {
                    image : {$ne : null},
                }
            },
            {
                $group : {
                    _id : {
                        categoryId : "$categoryId",
                        gender : "$gender",
                    },
                    gender : {$first : "$gender"},
                    name : {$first : "$name"},
                    categoryId : {$first : "$categoryId"},
                    image : {$first : "$image"},
                    sort : {$first : "$sort"},
                }
            },
            {
                $sort : {
                    sort : 1,
                }
            },
            {
                $group : {
                    _id : "$gender",
                    gender : {$first : "$gender"},
                    categories : {$push : {name : "$name", categoryId : "$categoryId", image : "$image"}},
                }
            },
            {
                $sort : {
                    gender : 1,
                }
            }
        ]).exec(function(err, deals){
            return callback(deals);
        });
    },

    dealsByDepartment: function(gender, categoryIds, parlorId, comboOnly, callback){
        var aggregateArray = [];
        var newGender = gender;
        if(gender instanceof Array){
            gender = { $in : gender };
            newGender = "F";
        }
        var match = {
            genders : gender,
            active : 1,
            isDeleted : false,
        };
        var dealTypes = ["combo"];
        if(!comboOnly)dealTypes.push("newCombo");
        if(categoryIds.length > 0){
            if(categoryIds[0]==1){
                match["dealType.name"] = {$in : dealTypes};
            }else{
                match.categoryIds = { $in : categoryIds };
            }
        }
        
        aggregateArray.push({
            $project : {
                dealId : comboOnly ? "$_id" : 1,
                "brands.parlorLatLongs" : 1,
                "brands.brandId" : 1,
                name : 1,
                parlorDealId : "$_id",
                description : 1,
                shortDescription : 1,
                menuPrice : 1,
                active : 1,
                isDeleted : 1,
                dealPrice : 1,
                newCombo : 1,
                sort : 1,
                dealSort : 1,
                dealType : 1,
                slabId : 1,
                categoryIds : 1,
                dealsCategory : "$categoryIds",
                services : 1,
                parlorId : 1,
                genders : 1,
                parlorTypesDetail : 1,
                allHairLength:1,
            }
        });
        aggregateArray.push({$unwind : "$categoryIds"});
        aggregateArray.push({$unwind : "$genders"});
        
        if(parlorId){
            match.parlorId = ObjectId(parlorId);
            match["dealType.name"] = {$in : dealTypes};
        }
        aggregateArray.push({
            $match : match
        });
        var otherArregateValue = [
            {
                $unwind : {
                    path: "$services",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $group : {
                    _id : {
                        dealId : "$dealId",
                        services : "$services.serviceCode",
                    },
                    dealId : {$first : "$dealId"},
                    parlorDealId : {$first : "$parlorDealId"},
                    name : {$first : "$name"},
                    description : {$first : "$description"},
                    shortDescription : {$first : "$shortDescription"},
                    menuPrice : {$first : "$menuPrice"},
                    dealPrice : {$first : "$dealPrice"},
                    parlorTypesDetail : {$first : "$parlorTypesDetail"},
                    newCombo : {$first : "$newCombo"},
                    slabId : {$first : "$slabId"},
                    sort : {$first : "$sort"},
                    dealSort : {$first : "$dealSort"},
                    dealType : {$first : "$dealType"},
                    categoryIds : {$first : "$categoryIds"},
                    dealsCategory : {$first : "$dealsCategory"},
                    services : {$first : "$services"},
                    brands : {$first : "$brands"},
                    allHairLength :{$first :"$allHairLength"},
                }
            },
            {
                $lookup :  {
                    from : "services",
                    localField : "services.serviceCode",
                    foreignField : "serviceCode",
                    as : "service",
                }
            },
            {
                $project : {
                    serviceName : {$arrayElemAt: [ "$service.name", 0 ] },
                    serviceSort : {$arrayElemAt: [ "$service.sort", 0 ] },
                    gender : { $ifNull : [ {$arrayElemAt: [ "$service.gender", 0 ] }, newGender]},
                    serviceCode : {$arrayElemAt: [ "$service.serviceCode", 0 ] },
                    serviceId : {$arrayElemAt: [ "$service._id", 0 ] },
                    categoryId : {$arrayElemAt: [ "$service.categoryId", 0 ] },
                    serviceBrand : { $arrayElemAt: [ {$arrayElemAt: [ "$service.prices", 0 ] } , 0 ] },
                    subCategoryId : {$arrayElemAt: [ "$service.subCategoryId", 0 ] },
                    subTitle : {$arrayElemAt: [ "$service.subTitle", 0 ] },
                    parlorTypesDetailService : "$services.parlorTypesDetail" ,
                    dealId : 1,
                    parlorDealId : 1,
                    name : 1,
                    brands : 1,
                    description : 1,
                    shortDescription : 1,
                    menuPrice : 1,
                    slabId :  1,
                    dealsCategory : 1,
                    price : "$dealPrice",
                    parlorTypesDetail : 1,
                    allHairLength :1,
                    sort : 1,
                    dealSort : 1,
                    newCombo : 1,
                    dealPrice : "$dealType.price",
                    dealType : "$dealType.name",
                    categoryIds : 1,
                }
            },
            {
                $match : { gender : gender },
            },
            {
                $group : {
                    _id : {
                        dealId : "$dealId"
                    },
                    name : { $first : '$name'},
                    description : { $first : '$description'},
                    shortDescription : { $first : '$shortDescription'},
                    menuPrice : { $first : '$menuPrice'},
                    price : { $first : '$price'},
                    parlorTypesDetail : {$first : '$parlorTypesDetail'},
                    allHairLength : {$first : '$allHairLength'},
                    dealId : { $first : '$dealId'},
                    parlorDealId : { $first : '$parlorDealId'},
                    dealPrice : { $first : '$dealPrice'},
                    sort : { $first : '$sort'},
                    type : {$first : "$subCategoryId"},
                    dealSort : {$first : "$dealSort"},
                    newCombo : {$first : "$newCombo"},
                    slabId : {$first : "$slabId"},
                    brands : {$first : "$brands"},
                    dealType : { $first : '$dealType'},
                    gender : { $first : '$gender'},
                    categoryIds : { $first : '$categoryIds'},
                    dealsCategory : {$first : '$dealsCategory'},
                    services : { $push : {
                            name : '$serviceName',
                            serviceCode : '$serviceCode',
                            brand : "$serviceBrand.brand",
                            serviceCode : '$serviceCode',
                            serviceId : '$serviceId',         
                            categoryId : '$categoryId',         
                            subTitle : "$subTitle",
                            parlorTypesDetailService : "$parlorTypesDetailService",
                        }
                    }
                }
            },
            {
                $sort : {
                    dealSort : 1,
                    sort : 1,
                }
            },
            {
                $lookup :  {
                    from : "servicecategories",
                    localField : "categoryIds",
                    foreignField : "_id",
                    as : "category",
                }
            },
            {
                $project : {
                    category : { $cond: { if: { $eq: [ "$dealType", "combo" ] }, then: "Packages", else: { $cond: { if: { $eq: [ "$dealType", "newCombo" ] }, then: "Packages", else: {$arrayElemAt: [ "$category.name", 0 ] } } }  } },
                    name : 1,
                    sort : { $cond: { if: { $eq: [ "$dealType", "combo" ] }, then: 1000, else: { $cond: { if: { $eq: [ "$dealType", "newCombo" ] }, then: 1000, else: {$arrayElemAt: [ "$category.sort", 0 ] } } }  } },
                    description : 1,
                    dealSort : 1,
                    shortDescription : 1,
                    menuPrice : 1,
                    price : 1,
                    type : { $cond: { if: { $eq: [ "$type", null ] }, then: "", else: "subCategory" } },
                    parlorTypesDetail :1,
                    allHairLength:1,
                    dealId : 1,
                    parlorDealId : 1,
                    dealPrice : 1,
                    slabId : 1,
                    gender : 1,
                    newCombo : 1,
                    brands : 1,
                    dealType : 1,
                    categoryIds : 1,
                    dealsCategory : 1,
                    services : 1
                }
            },
            {
                $group : {
                    _id :{
                        category : "$category"
                    },
                    name : { $first : "$category" },
                    sort : { $first : "$sort" },
                    categoryId : { $first : "$categoryIds" },
                    deals : { $push : {
                            name : "$name",
                            categoryId : "$categoryIds",
                            dealId : "$dealId",
                            parlorDealId : "$parlorDealId",
                            description : "$description",
                            shortDescription : "$shortDescription",
                            menuPrice : "$menuPrice",
                            price : "$price",
                            brands : "$brands",
                            dealSort : "$dealSort",
                            newCombo : "$newCombo",
                            gender : "$gender",
                            slabId : "$slabId",
                            type : "$type",
                            parlorTypesDetail : "$parlorTypesDetail",
                            allHairLength:"$allHairLength",
                            dealPrice : "$dealPrice",
                            dealType : "$dealType",
                            services : "$services",
                            dealsCategory : "$dealsCategory",
                        }
                    }
                },
            },
            {
                $sort : {
                    sort : 1,
                }
            },
        ];
        _.forEach(otherArregateValue, function(v){ aggregateArray.push(v)});
        if(!parlorId){
            AllDeals.aggregate(aggregateArray).exec(function(err, results){
                console.log("err");
                console.log(err);
                return callback(results);
            });
        }else{
            Deals.aggregate(aggregateArray).exec(function(err, results){
                console.log(err);
                return callback(results);
            });
        }
    },

    allDealsServiceByCode: function(serviceCodes, parlorId, callback){
       var match = {
                'dealType.name' : {$nin : ["combo", "newCombo"] },
                'active'  : 1,
            };
       if(parlorId)match.parlorId = ObjectId(parlorId);
        Deals.aggregate([
        {
            $match : match
        },
        {
            $unwind : "$services",
        },
        {
            $match : {
                "services.serviceCode"  : {$in : serviceCodes},
            }
        },
        {
            $project : {
                parlorId : 1,
                parlorDealId : "$_id",
                dealId : 1,
                menuPrice:1,
                serviceCode : "$services.serviceCode",
                dealType : "$dealType.name",
                dealPrice : "$dealType.price",
                'brands.brandId' : 1,
                'brands.ratio' : 1,
                'brands.products.ratio' : 1,
                'brands.products.productId' : 1,
            }
        },
        {
            $group : {
                _id : {
                    dealId : "$dealId",
                },
                parlors : {
                    $push : {
                        parlorId : "$parlorId",
                        dealPrice : "$dealPrice",
                        menuPrice : "$menuPrice",
                        brands : "$brands",
                        dealId : "$parlorDealId",
                    }
                },
                dealId : {$first : "$dealId"},
                dealType : {$first : "$dealType"},
                serviceCode : {$first : "$serviceCode" },
            }
        }
        ]).exec(function(err, deals){
            return callback(deals);
        });
    },

   allParlorServiceByCode: function(serviceCodes, parlorId, callback){
        var match = {
            "services.serviceCode" : {$in : serviceCodes},
            active : true,
                // _id : ObjectId("587088445c63a33c0af62727")
        };
        var present = false;
        _.forEach(serviceCodes, function(s){
            if(s == 502 || s == 52){
                present = true;
            }
        })
        if(present)match.parlorType = {$in : [0,1,2]}
        if(parlorId)match._id = ObjectId(parlorId);

        Parlor.aggregate([
        {
            $unwind : "$services",
        },
        {
            $match : match
        },
        {
            $project : {
                _id : 1,
                name : 1,
                images:1,
                address : 1,
                address2 : 1,
                closingTime:1,
                parlorType :1,
                link : 1,
                openingTime:1,
                rating:1,
                tax  : 1,
                budget:1,
                latitude:1,
                longitude:1,
                'services.serviceId' : 1,
                'services.serviceCode' : 1,
                'services.prices.brand.brands.brandId' : 1,
                'services.prices.brand.brands.ratio' : 1,
                'services.prices.brand.brands.products.ratio' : 1,
                'services.prices.brand.brands.products.productId' : 1,
                'services.prices.price' : 1,
                'services.prices.tax' : 1,
                'services.prices.categoryId' : 1,
            }
        },
        {
            $project : {
                parlorId : "$_id",
                name : "$name",
                parlorImage: "$images",
                parlorAddress1 : "$address",
                parlorAddress2 : "$address2",
                closingTime:"$closingTime",
                parlorType :"$parlorType",
                link : "$link",
                openingTime:"$openingTime",
                rating:"$rating",
                budget:"$budget",
                latitude:"$latitude",
                longitude:"$longitude",
                serviceId : "$services.serviceId",
                categoryId : "$services.categoryId",
                serviceCode : "$services.serviceCode",
                price : {$arrayElemAt: [ '$services.prices.price', 0 ] },
                tax : "$tax",
                brands : {$arrayElemAt: [ '$services.prices.brand.brands', 0 ] },
            }
        },
        {
            $match : {
                'price' : { $gt  : 0 },
            }
        },
        {
            $group : {
                _id : {
                    parlorId : "$parlorId"
                },
                services : { $push : {
                        serviceId : '$serviceId',
                        serviceCode : '$serviceCode',
                        price : '$price',
                        tax : '$tax',
                        brands : '$brands',
                        
                    }
                },
                count : {$sum : 1},
                tax : {$first : "$tax"},
                parlorId : {$first : "$parlorId"},
                /*name : {$first :"$name"},
                parlorImage: {$first :"$parlorImage"},
                parlorAddress1 : {$first :"$parlorAddress1"},
                parlorAddress2 : {$first :"$parlorAddress2"},
                closingTime:{$first :"$closingTime"},
                parlorType :{$first :"$parlorType"},
                link : {$first :"$link"},
                openingTime: {$first :"$openingTime"},
                rating: {$first :"$rating"},
                budget: {$first :"$budget"},
                latitude: {$first :"$latitude"},
                longitude: {$first :"$longitude"}*/
            },
        },
        {
            $match : {
                count : serviceCodes.length
            }
        }
        ]).exec(function(err, parlors){
            return callback(parlors);
        });
    },
    // allParlorServiceByCode: function(serviceCodes, callback){
    //     Parlor.aggregate([
    //     {
    //         $unwind : "$services",
    //     },
    //     {
    //         $match : {
    //             "services.serviceCode" : {$in : serviceCodes},
    //             // active : true,
    //         }
    //     },
    //     {
    //         $project : {
    //             _id : 1,
    //             'services.serviceId' : 1,
    //             'services.serviceCode' : 1,
    //             'services.prices.brand.brands.brandId' : 1,
    //             'services.prices.brand.brands.ratio' : 1,
    //             'services.prices.brand.brands.products.ratio' : 1,
    //             'services.prices.brand.brands.products.productId' : 1,
    //             'services.prices.price' : 1,
    //             'services.prices.tax' : 1,
    //         }
    //     },
    //     {
    //         $project : {
    //             parlorId : "$_id",
    //             serviceId : "$services.serviceId",
    //             serviceCode : "$services.serviceCode",
    //             price : {$arrayElemAt: [ '$services.prices.price', 0 ] },
    //             tax : {$arrayElemAt: [ '$services.prices.tax', 0 ] },
    //             brands : {$arrayElemAt: [ '$services.prices.brand.brands', 0 ] },
    //         }
    //     },
    //     {
    //         $match : {
    //             'price' : { $gt  : 0 },
    //         }
    //     },
    //     {
    //         $group : {
    //             _id : {
    //                 parlorId : "$parlorId"
    //             },
    //             services : { $push : {
    //                     serviceId : '$serviceId',
    //                     serviceCode : '$serviceCode',
    //                     price : '$price',
    //                     tax : '$tax',
    //                     brands : '$brands',
                        
    //                 }
    //             },
    //             parlorId : {$first : "$parlorId"},
    //         },
    //     }
    //     ]).exec(function(err, parlors){
    //         return callback(parlors);
    //     });
    // },

    getEmployeeDetailByServiceCode : function(serviceCodes, parlorId, callback){
        Parlor.aggregate([
          {
              $match : {_id : parlorId },
          },
          {
              $unwind : "$services",
          },
          {
            $project : {
                serviceCode : "$services.serviceCode",
                employees : {$arrayElemAt: [ '$services.prices.employees', 0 ] },
            }
          },
          {
              $match : {serviceCode : {$in : serviceCodes}},
          },
          {
              $unwind : "$employees",
          },
          {
              $lookup :  {
                  from : "owners",
                  localField : "employees.userId",
                  foreignField : "_id",
                  as : "employee",
              }
          },
          {
              $project : {
                  serviceCode : 1,
                  name : {$arrayElemAt: [ "$employee.firstName", 0 ] },
                  employeeId : {$arrayElemAt: [ "$employee._id", 0 ] },
                  artistId : {$arrayElemAt: [ "$employee.artistId", 0 ] },
                  image : {$arrayElemAt: [ "$employee.image", 0 ] },
                  active : {$arrayElemAt: [ "$employee.active", 0 ] },
                  rating :{$arrayElemAt: [ "$employee.rating", 0 ] },
                  clientServed : {$arrayElemAt: [ "$employee.clientServed", 0 ] },
              }
          },
          {
            $match : {
                active : true
            }
          },
          {
            $sort : {clientServed : -1}
          },
          {
            $group : {
                _id : {
                    serviceCode : "$serviceCode",
                },
                serviceCode : {$first : "$serviceCode"},
                employees : {$push : {
                        name : "$name",
                        employeeId : "$employeeId",
                        artistId : "$artistId",
                        image : "$image",
                        rating : "$rating",
                        clientServed : "$clientServed",
                    }
                },
            }
          }
        ]).exec(function(err, results){
            return callback(results);
        });
    },

    parlorServiceByCategoryIds: function(parlorId, categoryIds, gender, homeServiceOnly, callback){
        var dontShowInApp = false;
        var project = {
            'services.serviceId' : 1,
            'services.categoryId' : 1,
            'services.prices.priceId' : 1,
            'services.prices.name' : 1,
            'services.prices.brand.title' : 1,
            'services.prices.brand.brands.name' : 1,
            'services.prices.brand.brands.brandId' : 1,
            'services.prices.brand.brands.productTitle' : 1,
            'services.prices.brand.brands.ratio' : 1,
            'services.prices.brand.brands.products.name' : 1,
            'services.prices.brand.brands.products.ratio' : 1,
            'services.prices.brand.brands.products.productId' : 1,
            'services.prices.price' : 1,
            'services.prices.tax' : 1,
            'services.prices.estimatedTime' : 1,
            'services.prices.additions.name' : 1,
            'services.prices.additions.types.name' : 1,
            'services.prices.additions.types.additions' : 1,
        };
        if(!gender){
            gender = {$in : ["M", "F"] };
            dontShowInApp = {$in : [false, true ]};

        }
        
        project['services.productCheckRequired'] = { $ifNull: [ "$services.productCheckRequired", false ] };
        project['services.actualUnits'] = { $ifNull: [ "$services.actualUnits", 0 ] };
        project['services.gender'] = 1;
        project['services.basePrice'] = 1;
        let match2 = {
            name : {$ne : null },
            dontShowInApp : dontShowInApp,
        };
        if(homeServiceOnly){
            match2.isAvailableForHomeService = true;
        }
        Parlor.aggregate([
        {
            $match : {
                _id : ObjectId(parlorId),
            }
        },
        {
            $unwind : "$services",
        },
        {
            $project : project
        },
        {
            $match : {
                'services.categoryId' : { $in : categoryIds },
                'services.gender' : gender,
                'services.basePrice' : { $gt : 0},
                $or: [ {$and: [ { "services.productCheckRequired": true }, { "services.actualUnits": { $gt: 0 } } ]}, { "services.productCheckRequired" : false } ]
            }
        },
        {
            $project : project
        },
        {
            $project : {
                categoryId : "$services.categoryId",
                serviceId : "$services.serviceId",
                prices : "$services.prices",
            }
        },
        {
            $lookup :  {
                from : "services",
                localField : "serviceId",
                foreignField : "_id",
                as : "service",
            }
        },
        {
            $project : {
                categoryId : 1,
                serviceId : 1,
                prices : 1,
                name : {$arrayElemAt: [ "$service.nameOnApp", 0 ] },
                gender : {$arrayElemAt: [ "$service.gender", 0 ] },
                upgrades : {$arrayElemAt: [ "$service.upgrades", 0 ] },
                upgradeType : {$arrayElemAt: [ "$service.upgradeType", 0 ] },
                sort : {$arrayElemAt: [ "$service.sort", 0 ] },
                subTitle : {$arrayElemAt: [ "$service.subTitle", 0 ] },
                isAvailableForHomeService : {$arrayElemAt: [ "$service.isAvailableForHomeService", 0 ] },
                serviceCode : {$arrayElemAt: [ "$service.serviceCode", 0 ] },
                dontShowInApp : {$arrayElemAt: [ "$service.dontShowInApp", 0 ] },
                description : {$arrayElemAt: [ "$service.description", 0 ] },
                estimatedTime : {$arrayElemAt: [ "$service.estimatedTime", 0 ] },
            }
        },
        {
            $sort : {
                subCategoryIdSort : -1,
                sort : 1,
            }
        },
        {
            $match : match2
        },
        {
            $group : {
                _id : {
                    categoryId : "$categoryId"
                },
                categoryId : { $first : '$categoryId'},
                services : { $push : {
                        name : '$name',
                        gender : '$gender',
                        prices : '$prices',
                        subTitle : '$subTitle',
                        subCategoryIdSort : '$subCategoryIdSort',
                        serviceCode : '$serviceCode',
                        serviceId : '$serviceId',
                        upgrades : '$upgrades',
                        upgradeType : '$upgradeType',
                        description : "$description",
                        estimatedTime : "$estimatedTime",
                        categoryId : '$categoryId'
                    }
                }
            },
        },
        {
            $lookup :  {
                from : "servicecategories",
                localField : "categoryId",
                foreignField : "_id",
                as : "category",
            }
        },
        {
            $project : {
                name : {$arrayElemAt: [ "$category.name", 0 ] },
                sort : {$arrayElemAt: [ "$category.sort", 0 ] },
                categoryId : 1,
                services : 1,
            }
        },
        {
            $match : {
                name : {$ne : null},
            }
        },
        {
            $sort : {
                sort : 1,
            }
        },
        ]).exec(function(err, results){
            return callback(results);
        });
    },

    parlorService: function(parlorId, categoryIds, gender, needEmployee, callback){
        var dontShowInApp = false;
        var project = {
            'services.serviceId' : 1,
            'services.categoryId' : 1,
            'services.prices.priceId' : 1,
            'services.prices.name' : 1,
            'services.prices.brand.title' : 1,
            'services.prices.brand.brands.name' : 1,
            'services.prices.brand.brands.brandId' : 1,
            'services.prices.brand.brands.productTitle' : 1,
            'services.prices.brand.brands.ratio' : 1,
            'services.prices.brand.brands.products.name' : 1,
            'services.prices.brand.brands.products.ratio' : 1,
            'services.prices.brand.brands.products.productId' : 1,
            'services.prices.price' : 1,
            'services.prices.tax' : 1,
            'services.prices.estimatedTime' : 1,
            'services.prices.additions.name' : 1,
            'services.prices.additions.types.name' : 1,
            'services.prices.additions.types.additions' : 1,
        };
        if(!gender){
            gender = {$in : ["M", "F"] };
            dontShowInApp = {$in : [false, true ]};

        }
        if(parseInt(needEmployee) === 2){
            dontShowInApp = {$in : [false, true ]};
        }
        if(needEmployee){
            project['services.prices.employees'] = 1;
        }
        project['services.productCheckRequired'] = { $ifNull: [ "$services.productCheckRequired", false ] };
        project['services.actualUnits'] = { $ifNull: [ "$services.actualUnits", 0 ] };
        project['services.gender'] = 1;
        project['services.basePrice'] = 1;
        Parlor.aggregate([
        {
            $match : {
                _id : ObjectId(parlorId),
            }
        },
        {
            $unwind : "$services",
        },
        {
            $project : project
        },
        {
            $match : {
                'services.categoryId' : { $in : categoryIds },
                'services.gender' : gender,
                'services.basePrice' : { $gt : 0},
                $or: [ {$and: [ { "services.productCheckRequired": true }, { "services.actualUnits": { $gt: 0 } } ]}, { "services.productCheckRequired" : false } ]
            }
        },
        {
            $project : project
        },
        {
            $project : {
                categoryId : "$services.categoryId",
                serviceId : "$services.serviceId",
                prices : "$services.prices",
            }
        },
        {
            $lookup :  {
                from : "services",
                localField : "serviceId",
                foreignField : "_id",
                as : "service",
            }
        },
        {
            $project : {
                categoryId : 1,
                serviceId : 1,
                prices : 1,
                name : {$arrayElemAt: [ "$service.nameOnApp", 0 ] },
                gender : {$arrayElemAt: [ "$service.gender", 0 ] },
                upgrades : {$arrayElemAt: [ "$service.upgrades", 0 ] },
                upgradeType : {$arrayElemAt: [ "$service.upgradeType", 0 ] },
                sort : {$arrayElemAt: [ "$service.sort", 0 ] },
                subTitle : {$arrayElemAt: [ "$service.subTitle", 0 ] },
                serviceCode : {$arrayElemAt: [ "$service.serviceCode", 0 ] },
                dontShowInApp : {$arrayElemAt: [ "$service.dontShowInApp", 0 ] },
                description : {$arrayElemAt: [ "$service.description", 0 ] },
                estimatedTime : {$arrayElemAt: [ "$service.estimatedTime", 0 ] },
            }
        },
        {
            $sort : {
                subCategoryIdSort : -1,
                sort : 1,
            }
        },
        {
            $match : {
                name : {$ne : null },
                dontShowInApp : dontShowInApp,
            },
        },
        {
            $group : {
                _id : {
                    categoryId : "$categoryId"
                },
                categoryId : { $first : '$categoryId'},
                services : { $push : {
                        name : '$name',
                        gender : '$gender',
                        prices : '$prices',
                        subTitle : '$subTitle',
                        subCategoryIdSort : '$subCategoryIdSort',
                        serviceCode : '$serviceCode',
                        serviceId : '$serviceId',
                        upgrades : '$upgrades',
                        upgradeType : '$upgradeType',
                        description : "$description",
                        estimatedTime : "$estimatedTime",
                        categoryId : '$categoryId'
                    }
                }
            },
        },
        {
            $lookup :  {
                from : "servicecategories",
                localField : "categoryId",
                foreignField : "_id",
                as : "category",
            }
        },
        {
            $project : {
                name : {$arrayElemAt: [ "$category.name", 0 ] },
                sort : {$arrayElemAt: [ "$category.sort", 0 ] },
                categoryId : 1,
                services : 1,
            }
        },
        {
            $match : {
                name : {$ne : null},
            }
        },
        {
            $sort : {
                sort : 1,
            }
        },
        ]).exec(function(err, results){
            return callback(results);
        });
    },

    parlorDepartment: function(parlorId, callback){
        var aggregateArray = [];
        aggregateArray.push({
            $match : {
                _id : ObjectId(parlorId)
            }
        });
        aggregateArray.push({
            $unwind : "$services"
        });
        aggregateArray.push({
            $project : {
                gender : '$services.gender',
                categoryId : '$services.categoryId',
            }
        });
        var otherArregateValue = [
        {
            $group : {
                _id : {
                        gender : "$gender",
                        categoryId : "$categoryId",
                    },
                    gender : { $first: '$gender' },
                    categoryId : { $first: '$categoryId' },
            }
        },
        {
            $lookup: {
                from : "servicecategories",
                localField : "categoryId",
                foreignField : "_id",
                as : "category",
            }
        },
        {
            $project : {
                name : {$arrayElemAt: [ "$category.name", 0 ] },
                gender : 1,
                superCategory : {$arrayElemAt: [ "$category.superCategory", 0 ] },
            }
        },
        {
            $match : {
                name : {$ne : null } 
            },
        },
        {
            $group : {
                _id : {
                        gender : "$gender",
                        superCategory : "$superCategory",
                    },
                    gender : { $first: '$gender' },
                    superCategory : { $first: '$superCategory' },
            }
        },
        {
            $lookup : {
                from : "supercategories",
                localField : "superCategory",
                foreignField : "name",
                as : "superCategory",
            }
        },
        {
            $project : {
                department : {$arrayElemAt: [ "$superCategory.name", 0 ] },
                sortOrder : {$arrayElemAt: [ "$superCategory.sortOrder", 0 ] },
                gender : 1
            }
        },
        {
            $sort : { 
                sortOrder : 1,
            },
        },
        {
            $group : {
                _id : {
                    gender : '$gender'
                },
                departments : {
                    $push : {
                        name : '$department',
                    }
                },
                gender : {$first : '$gender'}
            }
        }
        ];
        _.forEach(otherArregateValue, function(v){ aggregateArray.push(v)});
        Parlor.aggregate(aggregateArray).exec(function(err, results){
            return callback(results);
        });
    },

    categoryListByParlor: function(parlorId, homeServiceOnly, homeServiceCategoryId, callback){
        var aggregateArray = [
            {
                $match :{
                    _id : ObjectId(parlorId),
                }
            },
            {
                $unwind : "$services"
            },
            {
                $project : {
                    gender : '$services.gender',
                    categoryId : '$services.categoryId',
                }
            }
        ];
        if(homeServiceOnly){
            aggregateArray.push({
                $match : {categoryId : {$in : homeServiceCategoryId}}
            });
        }
        var otherArregateValue = [
            {
                $group : {
                    _id : {
                            gender : "$gender",
                            categoryId : "$categoryId",
                        },
                        gender : { $first: '$gender' },
                        categoryId : { $first: '$categoryId' },
                }
            },
            {
                $lookup: {
                    from : "servicecategories",
                    localField : "categoryId",
                    foreignField : "_id",
                    as : "category",
                }
            },
            {
                $project : {
                    name : {$arrayElemAt: [ "$category.name", 0 ] },
                    gender : 1,
                    categoryId : 1,
                    sort : {$arrayElemAt: [ "$category.sort", 0 ] },
                    maleImage : {$arrayElemAt: [ "$category.maleImage", 0 ] },
                    femaleImage : {$arrayElemAt: [ "$category.femaleImage", 0 ] },
                }
            },
            {
                $project : {
                    image : {$cond: { if: { $eq: [ "$gender", "M" ] }, then: "$maleImage", else: "$femaleImage" }},
                    name : 1,
                    gender : 1,
                    categoryId : 1,
                    sort : 1,
                }
            },
            {
                $match : {
                    image : {$ne : null},
                }
            },
            {
                $sort : {
                    sort : 1,
                }
            },
            {
                $group : {
                    _id : "$gender",
                    gender : {$first : "$gender"},
                    categories : {$push : {name : "$name", categoryId : "$categoryId", image : "$image"}},
                }
            },
            {
                $sort : {
                    gender : 1,
                }
            }];
        _.forEach(otherArregateValue, function(v){ aggregateArray.push(v)});
        Parlor.aggregate(aggregateArray).exec(function(err, categories){
            return callback(categories);
        });
    },

    serviceByDepartment: function(parlorService, parlorId, callback){
        var aggregateArray = [];
        if(parlorService == 1){
            aggregateArray.push({
                $match : {
                    _id : ObjectId(parlorId)
                }
            });
            aggregateArray.push({
                $unwind : "$services"
            });
            aggregateArray.push({
                $project : {
                    gender : '$services.gender',
                    categoryId : '$services.categoryId',
                }
            });
        }else if(parlorService == 2){
            aggregateArray.push({
                $match : {
                    isDeleted : false,
                    active : 1,
                }
            });
            aggregateArray.push({
                $unwind : "$categoryIds"
            });
            aggregateArray.push({
                $unwind : "$genders"
            });
            aggregateArray.push({
                $project : {
                    gender : "$genders",
                    categoryId : "$categoryIds",
                },
            });
        }
        else{
            aggregateArray.push({
                $project : {
                    gender : 1,
                    categoryId : 1
                },
            });
        }


        var otherArregateValue = [
        {
            $group : {
                _id : {
                        gender : "$gender",
                        categoryId : "$categoryId",
                    },
                    gender : { $first: '$gender' },
                    categoryId : { $first: '$categoryId' },
            }
        },
        {
            $lookup: {
                from : "servicecategories",
                localField : "categoryId",
                foreignField : "_id",
                as : "category",
            }
        },
        {
            $project : {
                name : {$arrayElemAt: [ "$category.name", 0 ] },
                gender : 1,
                categoryId : 1,
                femaleImage : {$arrayElemAt: [ "$category.femaleImage", 0 ] },
                superCategory : {$arrayElemAt: [ "$category.superCategory", 0 ] },
                maleImage : {$arrayElemAt: [ "$category.maleImage", 0 ] },
                sort : {$arrayElemAt: [ "$category.sort", 0 ] },
            }
        },
        {
            $match : {
                name : {$ne : null } 
            },
        },
        {
            $sort : {
                sort : 1,
            }
        },
        {
            $group : {
                _id : {
                        gender : "$gender",
                        superCategory : "$superCategory",
                    },
                    gender : { $first: '$gender' },
                    superCategory : { $first: '$superCategory' },
                    categories : {$push : {
                            name : '$name',
                            categoryId : '$categoryId',
                            image : {
                                $cond: { if: { $eq: [ "$gender", "M" ] }, then: "$maleImage", else: "$femaleImage" }
                            }
                        }
                    }
            }
        },
        {
            $lookup : {
                from : "supercategories",
                localField : "superCategory",
                foreignField : "name",
                as : "superCategory",
            }
        },
        {
            $project : {
                department : {$arrayElemAt: [ "$superCategory.name", 0 ] },
                maleImage : {$arrayElemAt: [ "$superCategory.maleImage", 0 ] },
                femaleImage : {$arrayElemAt: [ "$superCategory.femaleImage", 0 ] },
                maleDescription : {$arrayElemAt: [ "$superCategory.maleDescription", 0 ] },
                femaleDescription : {$arrayElemAt: [ "$superCategory.femaleDescription", 0 ] },
                sortOrder : {$arrayElemAt: [ "$superCategory.sortOrder", 0 ] },
                departmentId : {$arrayElemAt: [ "$superCategory._id", 0 ] },
                categories : 1,
                gender : 1
            }
        },
        {
            $sort : { 
                sortOrder : 1,
            },
        },
        {
            $group : {
                _id : {
                    gender : '$gender'
                },
                departments : {
                    $push : {
                        categories : '$categories',
                        departmentId : '$departmentId',
                        name : '$department',
                        image : {
                            $cond: { if: { $eq: [ "$gender", "M" ] }, then: "$maleImage", else: "$femaleImage" }
                        },
                        description : {
                            $cond: { if: { $eq: [ "$gender", "M" ] }, then: "$maleDescription", else: "$femaleDescription" }
                        },
                    }
                },
                gender : {$first : '$gender'}
            }
        }
        ];
        var arr={name:"Shailendra"};
        _.forEach(otherArregateValue, function(v){ aggregateArray.push(v)});
        if(parlorService == 1){
            Parlor.aggregate(aggregateArray).exec(function(err, results){
                return callback(results);
            });
        }else if(parlorService == 2){
            AllDeals.aggregate(aggregateArray).exec(function(err, results){
                console.log(results[0].departments);
                //results.push(arr);
                return callback(results);
            });
        }
        else{
            Service.aggregate(aggregateArray).exec(function(err, results){
                return callback(results);
            });
        }
    },

    freebiesHairCut: function(req, callback){
        Appointment.aggregate([
        {
            $unwind : "$services",
        },
        {
            $match : AggregateHelper.getAppointmentMonthlyMatchObj(req, 'freeHairCut'),
        },
        {
            $project : AggregateHelper.getAppointmentMonthlyProjectObj('freebiesHairCut'),
        },
        {
            $group : {
                    _id : {
                        year : "$year",
                        month : "$month",
                    },
                    freeHairCutFreebies : {$sum : "$services.loyalityPoints"},
                    year : { $first: '$year' },
                    month : { $first: '$month' },
                }
        },
        {
            $sort : { 
                year : 1,
                month : 1,
            }
        },
        ]).exec(function(err, results){
            return callback(results);
        });
    },

    freebiesOnlinePaymentThreading : function(req, callback){
        Appointment.aggregate([
        {
            $match : AggregateHelper.getAppointmentMonthlyMatchObj(req, 'freebiesOnlinePayment'),
        },
        {
            $project : AggregateHelper.getAppointmentMonthlyProjectObj('freebiesOnlinePayment'),
        },
        {
            $group : {
                    _id : {
                        year : "$year",
                        month : "$month",
                    },
                    onlineDiscountFreebies : {$sum : "$onlineDiscount"},
                    threadingFreebies : {$sum : '$freebiesThreading'},
                    year : { $first: '$year' },
                    month : { $first: '$month' },
                }
        },
        {
            $sort : { 
                year : 1,
                month : 1,
            }
        },
        ]).exec(function(err, results){
            return callback(results);
        });
    },

    serviceComboReport : function(serviceId, callback){
        Appointment.aggregate([
        {
            $match : {
                status : 3,
                'services.serviceId' : ObjectId(serviceId),
            },
        },
        {
            $unwind : "$services",
        },
        {
            $project : {
                'services.serviceId' : 1,
            },
        },
        {
            $group : {
                _id : {
                    serviceId : "$services.serviceId",
                },
                count : {$sum : 1},
                serviceId : {$first : "$services.serviceId"},
            }
        },
        {
            $sort : { 
                count : -1,
            }
        },
        {
            $limit : 5
        },
        {
            $lookup: {
                from : "services",
                localField : "serviceId",
                foreignField : "_id",
                as : "service",
            }
        },
        {
            $project : {
                name : {$arrayElemAt: [ "$service.name", 0 ] },
                gender : {$arrayElemAt: [ "$service.gender", 0 ] },
                count : 1
            }
        },
        {
            $match : {name : {$ne : null}},
        },
        {
            $group : {
                "_id" : null,
                topServices : { $push : {
                                    name : '$name',
                                    count : '$count',
                                    gender : '$gender',
                            }
                    },
                name : {$first : "$name"},
                count : {$first : "$count"},
                gender : {$first : "$gender"},
            }
        },
        {
            $project : {
                topServices: { $slice: [ "$topServices", 1, 3] },
                name : 1,
                count : 1,
                gender : 1,
            }
        },
        {
            $sort : {
                name : 1,
            }
        }
        ]).exec(function(err, results){
            if(results.length > 0)
                delete results[0]['_id'];
            return callback(results.length > 0 ? results[0] : null);
        });
    },

    otherFreebies : function(req, callback){
        User.aggregate([
        {
            $unwind : "$creditsHistory",
        },
        {
            $match : { "creditsHistory.reason" : { $in : ["Referal", "Free bies review updated", "Referal Service"] } },
        },
        {
            $project : {
                year: { $year: "$creditsHistory.createdAt" },
                month: { $month: "$creditsHistory.createdAt" },
                referalFreebies : {
                    $cond: { if: { $eq: [ "$creditsHistory.reason", "Referal" ] }, then: "$creditsHistory.amount", else: 0 }
                },
                reviewFreebies : {
                    $cond: { if: { $eq: [ "$creditsHistory.reason", "Free bies review updated" ] }, then: "$creditsHistory.amount", else: 0 }
                },
                referalServiceFreebies : {
                    $cond: { if: { $eq: [ "$creditsHistory.reason", "Referal Service" ] }, then: "$creditsHistory.amount", else: 0 }
                },
                freebies : { $sum: "$creditsHistory.amount" }
            },
        },
        {
            $group : {
                    _id : {
                        year : "$year",
                        month : "$month",
                    },
                    otherFreebies : {$sum : "$freebies"},
                    referalFreebies : {$sum : "$referalFreebies"},
                    reviewFreebies : {$sum : "$reviewFreebies"},
                    referalServiceFreebies : {$sum : "$referalServiceFreebies"},
                    year : { $first: '$year' },
                    month : { $first: '$month' },
                }
        },
        {
            $sort : { 
                year : 1,
                month : 1,
            }
        },
        ]).exec(function(err, results){
            return callback(results);
        });
    },

    serviceFrequencyReport: function(req, type, callback){
        var match = AggregateHelper.getAppointmentMonthlyMatchObj(req, type), project = AggregateHelper.getAppointmentMonthlyProjectObj(type), aggregateArray = [];
        var otherArregateValue = [
            {
                $match : match
            },
            {
                $project : project
            },
            {   $group : {
                    _id : {
                        year : "$year",
                        month : "$month",
                        parlorId : "$parlorId"
                    },
                    one : {$sum : {$cond: { if: { $eq: [ "$count", 1 ] }, then: 1, else: 0 }}},
                    two : {$sum : {$cond: { if: { $eq: [ "$count", 2 ] }, then: 1, else: 0 }}},
                    three : {$sum : {$cond: { if: { $eq: [ "$count", 3 ] }, then: 1, else: 0 }}},
                    four : {$sum : {$cond: { if: { $eq: [ "$count", 4 ] }, then: 1, else: 0 }}},
                    five : {$sum : {$cond: { if: { $eq: [ "$count", 5 ] }, then: 1, else: 0 }}},
                    moreThanFive : {$sum : {$cond: { if: { $gt: [ "$count", 5 ] }, then: 1, else: 0 }}},
                    year : { $first: '$year' },
                    month : { $first: '$month' },
                    parlorId : { $first: '$parlorId' },
                }
            },
            {
                $lookup:{
                    from: "parlors",
                    localField: "parlorId",
                    foreignField: "_id",
                    as: "parlor"
                }
            },
            {
                $project : {
                    year: 1,
                    month: 1,
                    one : 1,
                    two : 1,
                    three : 1,
                    four : 1,
                    five : 1,
                    moreThanFive : 1,
                    parlorType : { $ifNull : [{$arrayElemAt: [ "$parlor.parlorType", 0 ] }, 0]},
                }
            },
            {   $group : {
                    _id : {
                        parlorType : "$parlorType",
                        year : "$year",
                        month : "$month",
                    },
                    one : {$sum : "$one"},
                    two : {$sum : "$two"},
                    three : {$sum : "$three"},
                    four : {$sum : "$four"},
                    five : {$sum : "$five"},
                    moreThanFive : {$sum : "$moreThanFive"},
                    noOfSalons : {$sum : 1},
                    year : { $first: '$year' },
                    month : { $first: '$month' },
                    parlorType : { $first: '$parlorType' },
                }
            },
            {
                $sort : { 
                    year : 1,
                    month : 1,
                    parlorType : 1,
                }
            },
            {   $group : {
                    _id : {
                        year : "$year",
                        month : "$month",
                    },
                    one : {$sum : "$one"},
                    two : {$sum : "$two"},
                    three : {$sum : "$three"},
                    four : {$sum : "$four"},
                    five : {$sum : "$five"},
                    moreThanFive : {$sum : "$moreThanFive"},
                    noOfSalons : {$sum : "$noOfSalons"},
                    year : { $first: '$year' },
                    month : { $first: '$month' },
                    parlors : { $push: {
                                    parlorType : '$parlorType',
                                    noOfSalons : '$noOfSalons',
                                    one : "$one",
                                    two : "$two",
                                    three : "$three",
                                    four : "$four",
                                    five : "$five",
                                    moreThanFive : "$moreThanFive",
                                }
                            },
                }
            },
            {
                $sort : { 
                    year : 1,
                    month : 1,
                }
            },
        ];
        _.forEach(otherArregateValue, function(v){ aggregateArray.push(v)});
        Appointment.aggregate(aggregateArray).exec(function(err, result){
            return callback(result);
        });
    },

    appointmentReportDepartmentType: function(req, type, callback){
        var match = AggregateHelper.getAppointmentMonthlyMatchObj(req, type), project = AggregateHelper.getAppointmentMonthlyProjectObj(type), aggregateArray = [];
        aggregateArray.push({$unwind : "$departmentRevenue"});
        var otherArregateValue = [
            {
                $match : match
            },
            {
                $project : project
            },
            {
                $group : {
                    _id : {
                        year : "$year",
                        month : "$month",
                        departmentId : "$departmentRevenue.departmentId",
                        parlorId : "$parlorId",
                    },
                    revenue : {$sum : "$departmentRevenue.revenue"},
                    noOfService : {$sum : "$departmentRevenue.noOfService"},
                    year : { $first: '$year' },
                    month : { $first: '$month' },
                    departmentId : { $first: '$departmentRevenue.departmentId' },
                    parlorId : { $first : '$parlorId' } ,
                }
            },
            {
                $lookup : {
                    from : "supercategories",
                    localField : "departmentId",
                    foreignField : "_id",
                    as : "department",
                }
            },
            {
                $project : {
                    year : 1,
                    month : 1,
                    parlorId : 1,
                    department : {$arrayElemAt: [ "$department.name", 0 ] },
                    revenue : 1,
                    noOfService : 1,

                }
            },
            {
                $lookup:{
                    from: "parlors",
                    localField: "parlorId",
                    foreignField: "_id",
                    as: "parlor"
                }
            },
            {
                $project : {
                    year: 1,
                    month: 1,
                    department : 1,
                    revenue : 1,
                    noOfService : 1,
                    parlorType : { $ifNull : [{$arrayElemAt: [ "$parlor.parlorType", 0 ] }, 0]},
                }
            },
            {
                $sort : { 
                    year : 1,
                    month : 1,
                    parlorType : 1,
                }
            },
            {   $group : {
                    _id : {
                        year : "$year",
                        month : "$month",
                        department : "$department",
                        parlorType : "$parlorType",
                    },
                    revenue : {$sum : "$revenue"},
                    noOfService : {$sum : "$noOfService"},
                    year : { $first: '$year' },
                    parlorType : {$first : '$parlorType'},
                    month : { $first: '$month' },
                    department : { $first: '$department' },
                }
            },
            {   $group : {
                    _id : {
                        department : "$department",
                        year : "$year",
                        month : "$month",
                    },
                    revenue : {$sum : "$revenue"},
                    redRevenue : {$sum : {$cond: { if: { $eq: [ "$parlorType", 0 ] }, then: "$revenue", else: 0 }}},
                    blueRevenue : {$sum : {$cond: { if: { $eq: [ "$parlorType", 1 ] }, then: "$revenue", else: 0 }}},
                    greenRevenue : {$sum : {$cond: { if: { $eq: [ "$parlorType", 2 ] }, then: "$revenue", else: 0 }}},
                    noOfService : {$sum : "$noOfService"},
                    redNoOfService : {$sum : {$cond: { if: { $eq: [ "$parlorType", 0 ] }, then: "$noOfService", else: 0 }}},
                    blueNoOfService : {$sum : {$cond: { if: { $eq: [ "$parlorType", 1 ] }, then: "$noOfService", else: 0 }}},
                    greenNoOfService : {$sum : {$cond: { if: { $eq: [ "$parlorType", 2 ] }, then: "$noOfService", else: 0 }}},
                    department : { $first: '$department' },
                    year : { $first: '$year' },
                    month : { $first: '$month' },
                    parlors : { $push: {
                                    parlorType : '$parlorType',
                                    noOfService : '$noOfService',
                                    revenue : '$revenue',
                                } },
                }
            },
            {
                $project : {
                    revenue : 1,
                    redRevenue : 1,
                    blueRevenue : 1,
                    greenRevenue : 1,
                    noOfService : 1,
                    redNoOfService : 1,
                    blueNoOfService : 1,
                    greenNoOfService : 1,
                    department : 1,
                    year : 1,
                    month : 1,
                    parlors : 1,
                }
            },
            {
                $sort : { 
                    year : 1,
                    month : 1,
                    department : 1,
                }
            },
            {   $group : {
                    _id : {
                        year : "$year",
                        month : "$month",
                    },
                    revenue : {$sum : "$revenue"},
                    redRevenue : {$sum : "$redRevenue"},
                    blueRevenue : {$sum : "$blueRevenue"},
                    greenRevenue : {$sum : "$greenRevenue"},
                    noOfService : {$sum : "$noOfService"},
                    redNoOfService : {$sum : "$redNoOfService"},
                    blueNoOfService : {$sum : "$blueNoOfService"},
                    greenNoOfService : {$sum : "$greenNoOfService"},
                    year : { $first: '$year' },
                    month : { $first: '$month' },
                    departments : { $push: {
                                    parlors : '$parlors',
                                    revenue : '$revenue',
                                    noOfService : '$noOfService',
                                    department : '$department',
                                } },
                }
            },
            {
                $sort : { 
                    year : 1,
                    month : 1,
                }
            },
        ];
        _.forEach(otherArregateValue, function(v){ aggregateArray.push(v)});
        Appointment.aggregate(aggregateArray).exec(function(err, result){
            return callback(result);
        });

    },

    oldNewClientReport: function(req, type, callback){
        var match = AggregateHelper.getAppointmentMonthlyMatchObj(req, type), project = AggregateHelper.getAppointmentMonthlyProjectObj(type), aggregateArray = [];
        console.log(match)
        Appointment.aggregate([
            {
                $match : match,
            },
            {
                $project : project,
            },
            {
                $group : {
                    _id : {
                        parlorId : "$parlorId",
                        year : "$year",
                        month : "$month",
                    },
                    newClientApp : {$sum : "$newClientApp"},
                    newClientCrm : {$sum : "$newClientCrm"},
                    oldClientApp : {$sum : "$oldClientApp"},
                    oldClientCrm : {$sum : "$oldClientCrm"},
                    year : { $first: '$year' },
                    month : { $first: '$month' },
                    parlorId : { $first: '$parlorId' },
                }
            },
            {
                $sort : { 
                    month : 1,
                    year : 1,
                }
            },
            {
                $group : {
                        _id : {
                        parlorId : "$parlorId",
                    },
                    newClientApp : {$sum : "$newClientApp" },
                    newClientCrm : {$sum : "$newClientCrm" },
                    oldClientApp : {$sum : "$oldClientApp" },
                    oldClientCrm : {$sum : "$oldClientCrm" },
                    parlorId : {$first : "$parlorId"},
                    months : {
                        $push : {
                            month : "$month",
                            year : "$year",
                            newClientApp : "$newClientApp",
                            newClientCrm : "$newClientCrm",
                            oldClientApp : "$oldClientApp",
                            oldClientCrm : "$oldClientCrm",
                        }
                    }
                }
            },
            {
                $lookup:{
                    from: "parlors",
                    localField: "parlorId",
                    foreignField: "_id",
                    as: "parlor"
                }
            },
            {
                $project : {
                    year: 1,
                    month: 1,
                    newClientApp : 1,
                    newClientCrm : 1,
                    oldClientApp : 1,
                    oldClientCrm : 1,
                    months : 1,
                    name : {$arrayElemAt: [ "$parlor.name", 0 ] },
                }
            },
            {
                $match : {
                    name : {$ne : null}
                }
            },
            ]).exec(function(err, results){
            return callback(results);
        });
    },

    lowSubscribersAttendanceUsers: function(req, callback){
        SubscriptionSale.aggregate([
        {
            $project : {
                userId : 1,
                createdAt : 1,
            },
        },
        {
            $lookup:{
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $project : {
                createdAt: 1,
                userId : {$arrayElemAt: ["$user._id", 0]},
                phoneNumber : {$arrayElemAt: ["$user.phoneNumber", 0]},
                name : {$arrayElemAt: ["$user.firstName", 0]},
            }
        },
        {
            $match : {
                userId : {$ne : null},
            }
        },
        {
            $project:{
                subscriptionBuyYear: { $year: "$createdAt" },
                subscriptionBuyMonth: { $month: "$createdAt" },
                userId : 1,
                phoneNumber : 1,
                name : 1,
            }
        },
        {
           $lookup:{
                from: "appointments",
                localField: "userId",
                foreignField: "client.id",
                as: "appointments"
            } 
        },
        {
            $project : {
                userId : 1,
                subscriptionBuyMonth : 1,
                subscriptionBuyYear : 1,
                "appointments.loyalitySubscription" : 1,
                "appointments.status" : 1,
                "appointments.appointmentStartTime" : 1,
                name : 1,
                phoneNumber : 1,
            }
        },
        {
            $unwind : {
                path: "$appointments",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $match: {
                "appointments.status" : 3,
                "appointments.loyalitySubscription" : {$gt : 0},
            }
        },
        {
            $project : {
                userId : 1,
                name : 1,
                phoneNumber : 1,
                subscriptionBuyYear : 1,
                subscriptionBuyMonth : 1,
                appointmentStartTime : "$appointments.appointmentStartTime",
                year: { $year: "$appointments.appointmentStartTime" },
                month: { $month: "$appointments.appointmentStartTime" },
            }
        },
        {
            $group : {
                _id : {
                    userId : "$userId",
                    year : "$year",
                    month : "$month",
                },
                userId : {$first : "$userId"},
                phoneNumber : {$first : "$phoneNumber"},
                name : {$first : "$name"},
                subscriptionBuyYear : {$first : "$subscriptionBuyYear"},
                subscriptionBuyMonth : {$first : "$subscriptionBuyMonth"},
            }
        },
        {
            $group :{
                _id : "$userId",
                userId : {$first : "$userId"},
                phoneNumber : {$first : "$phoneNumber"},
                name : {$first : "$name"},
                subscriptionBuyMonth : {$first : "$subscriptionBuyMonth"},
                subscriptionBuyYear : {$first : "$subscriptionBuyYear"},
                appointmentCount : {$sum : 1},
            }
        },
        {
            $project : {
                userId : 1,
                phoneNumber : 1,
                name : 1,
                subscriptionBuyMonth : 1,
                subscriptionBuyYear : 1,
                appointmentCount : 1,
                actualCount : {$add : [{$subtract : [10, "$subscriptionBuyMonth"]}, 1]}
            }
        },
        {
            $match : {
                actualCount : {$gt : 1}
            }
        },
        {
            $project : {
                userId : 1,
                name : 1,
                phoneNumber : 1,
                percentage : {$divide : ["$appointmentCount", "$actualCount"]}
            }
        },
        {
            $match : {
                percentage : {$lt : .6}
            }
        }
        ]).exec(function(err, f){
            return callback(f);
        });
    },

    subscribersAttendanceTrends: function(req, callback){
        SubscriptionSale.aggregate([
        {
            $project : {
                userId : 1,
                createdAt : 1,
            },
        },
        {
            $lookup:{
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $project : {
                createdAt: 1,
                userId : {$arrayElemAt: ["$user._id", 0]},
            }
        },
        {
            $match : {
                userId : {$ne : null},
            }
        },
        {
            $project:{
                subscriptionBuyYear: { $year: "$createdAt" },
                subscriptionBuyMonth: { $month: "$createdAt" },
                userId : 1,
            }
        },
        {
           $lookup:{
                from: "appointments",
                localField: "userId",
                foreignField: "client.id",
                as: "appointments"
            } 
        },
        {
            $project : {
                userId : 1,
                subscriptionBuyMonth : 1,
                subscriptionBuyYear : 1,
                "appointments.loyalitySubscription" : 1,
                "appointments.status" : 1,
                "appointments.appointmentStartTime" : 1,
            }
        },
        {
            $unwind : {
                path: "$appointments",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $match: {
                "appointments.status" : 3,
                "appointments.loyalitySubscription" : {$gt : 0},
            }
        },
        {
            $project : {
                userId : 1,
                subscriptionBuyYear : 1,
                subscriptionBuyMonth : 1,
                appointmentStartTime : "$appointments.appointmentStartTime",
                year: { $year: "$appointments.appointmentStartTime" },
                month: { $month: "$appointments.appointmentStartTime" },
            }
        },
        {
            $group : {
                _id : {
                    userId : "$userId",
                    year : "$year",
                    month : "$month",
                },
                userId : {$first : "$userId"},
                subscriptionBuyYear : {$first : "$subscriptionBuyYear"},
                subscriptionBuyMonth : {$first : "$subscriptionBuyMonth"},
            }
        },
        {
            $group :{
                _id : "$userId",
                userId : {$first : "$userId"},
                subscriptionBuyMonth : {$first : "$subscriptionBuyMonth"},
                subscriptionBuyYear : {$first : "$subscriptionBuyYear"},
                appointmentCount : {$sum : 1},
            }
        },
        {
            $project : {
                userId : 1,
                subscriptionBuyMonth : 1,
                subscriptionBuyYear : 1,
                appointmentCount : 1,
                actualCount : {$add : [{$subtract : [10, "$subscriptionBuyMonth"]}, 1]}
            }
        },
        {
            $match : {
                actualCount : {$gt : 1}
            }
        },
        {
            $project : {
                userId : 1,
                percentage : {$divide : ["$appointmentCount", "$actualCount"]}
            }
        },
        {
            $project :{
                userId : 1,
                percentSlab : { $cond: { if: { $gte: ["$percentage", .9] }, then: 7, else: { $cond: { if: { $gte: ["$percentage", .8] }, then: 6, else: { $cond: { if: { $gte: ["$percentage", .7] }, then: 5, else: { $cond: { if: { $gte: ["$percentage", .6] }, then: 4, else: { $cond: { if: { $gte: ["$percentage", .4] }, then: 3, else: { $cond: { if: { $gte: ["$percentage", .2] }, then: 2, else: 1 } } } } } } } } } } } }
            }
        },
        {
            $group : {
                _id : "$percentSlab",
                slabId : {$first : "$percentSlab"},
                count : {$sum : 1}
            }
        },
        {
            $sort: {_id: 1}
        }
        ]).exec(function(err, f){
            return callback(f);
        });
    },

    clientFirstAppointment : function(parlorId, callback){
        Appointment.aggregate([
        {
            $match : {
                status : 3,
                serviceRevenue : {$gt : 0},
                parlorId : ObjectId(parlorId),
            }
        },
        {
            $project : {
                clientId : "$client.id",
                appointmentStartTime : 1,
            }
        },
        {
            $sort : {appointmentStartTime : 1},
        },
        {
            $group : {
                _id : "$clientId",
                appointmentStartTime : {$first : "$appointmentStartTime"},
                clientId : {$first : "$clientId"}
            }
        },
        {
            $sort : {appointmentStartTime : 1},
        }
        ]).exec(function(err, data){
            return callback(data);
        })
    },

    clientSubscriptionBuyDate: function(parlorId, callback){
        Appointment.aggregate([
        {
            $match : {
                status : 3,
                "client.subscriptionLoyality" : {$gt : 0},
                "appointmentStartTime" : {$gt : new Date(2018, 0, 1)},
                "serviceRevenue" : {$gt : 0},
            }
        },
        {
            $project : {
                parlorId : 1,
                clientId : "$client.id",
                appointmentStartTime : 1,
            }
        },
        {
            $sort : {appointmentStartTime : 1},
        },
        {
            $group : {
                _id : "$clientId",
                parlorId : {$first : "$parlorId"},
                clientId : {$first : "$clientId"},
                appointmentStartTime : {$first : "$appointmentStartTime"},
            }
        },
        {
            $match : {
                parlorId : ObjectId(parlorId),
            }
        }
        ]).exec(function(err, data){
            return callback(data);
        })
    },


    monthWiseSubscriptionSoldBySalon: function(parlorId, callback){
        Appointment.aggregate([
        {
            $match : {
                status : 3,
                "client.subscriptionLoyality" : {$gt : 0},
                "appointmentStartTime" : {$gt : new Date(2018, 0, 1)},
                "serviceRevenue" : {$gt : 0},
            }
        },
        {
            $project : {
                parlorId : 1,
                clientId : "$client.id",
                appointmentStartTime : 1,
            }
        },
        {
            $sort : {appointmentStartTime : 1},
        },
        {
            $group : {
                _id : {
                    clientId : "$clientId"
                },
                parlorId : {$first : "$parlorId"},
                clientId : {$first : "$clientId"},
                appointmentStartTime : {$first : "$appointmentStartTime"},
            }
        },
        {
            $match : {
                parlorId : ObjectId(parlorId),
            }
        },
        {
            $project : {
                clientId : "$client",
                year: { $year: "$appointmentStartTime" },
                month: { $month: "$appointmentStartTime" },
                parlorId : 1,
            }
        },
        {
            $group : {
                _id : {
                    year : "$year",
                    month : "$month",
                },
                year : {$first : "$year"},
                month : {$first : "$month"},
                noOfNewSubscriber : {$sum : 1},

            }
        },
        {
            $sort : {year : 1, month : 1}
        }
        ]).exec(function(err, data){
            return callback(data);
        })
    },

    salonWiseSubscriptionSold: function(req, callback){
        Appointment.aggregate([
        {
            $match : {
                status : 3,
                "client.subscriptionLoyality" : {$gt : 0},
                "appointmentStartTime" : {$gt : new Date(2018, 0, 1)},
                "serviceRevenue" : {$gt : 0},
            }
        },
        {
            $project : {
                parlorId : 1,
                parlorName : 1,
                parlorAddress : 1,
                clientId : "$client.id",
                appointmentStartTime : 1,
            }
        },
        {
            $sort : {appointmentStartTime : 1},
        },
        {
            $group : {
                _id : {
                    clientId : "$clientId"
                },
                parlorId : {$first : "$parlorId"},
                parlorName : {$first : "$parlorName"},
                parlorAddress : {$first : "$parlorAddress"},
                clientId : {$first : "$clientId"},
            }
        },
        {
            $group : {
                _id : "$parlorId",
                noOfSubscriptionSold : {$sum : 1},
                parlorName : {$first : "$parlorName"},
                parlorAddress : {$first : "$parlorAddress"}
            }
        },
        {
            $sort : {noOfSubscriptionSold : -1}
        }
        ]).exec(function(err, data){
            return callback(data);
        })
    },

    noOfActiveVisitsRevenueOfSubscriber: function(parlorId, callback){
        var match = {
            status : 3,
            "client.subscriptionLoyality" : {$gt : 0},
            "appointmentStartTime" : {$gt : new Date(2018, 0, 1)}
        };
        if(parlorId)match.parlorId = ObjectId(parlorId);
        Appointment.aggregate([
        {
            $match : match
        },
        {
            $project : {
                clientId : "$client.id",
                year: { $year: "$appointmentStartTime" },
                month: { $month: "$appointmentStartTime" },
                serviceRevenue : 1,
            }
        },
        {
            $group : {
                _id : {
                    year : "$year",
                    month : "$month",
                    clientId : "$clientId",
                },
                clientId : {$first : "$clientId"},
                year : {$first : "$year"},
                month : {$first : "$month"},
                revenue : {$sum : "$serviceRevenue"},
            }
        },
        {
            $group : {
                _id : {
                    year : "$year",
                    month : "$month",
                },
                year : {$first : "$year"},
                month : {$first : "$month"},
                noOfVisit : {$sum : 1},
                revenue : {$sum : "$revenue"},
            }
        },
        {
            $sort : {year : 1, month : 1}
        }
        ]).exec(function(err, data){
            return callback(data);
        });
    },

    newclientSecondServices: function(req, callback){
        Appointment.aggregate([
        {
            $match : {
                "client.noOfAppointments" : 0,
                status : 3,
            },
        },
        {
            $project : {
                "services.name" : 1,
                "services.serviceCode" : 1,
                "appointmentStartTime"  :1,
                "clientId" : "$client.id",
            }
        },
        {
            $sort : {appointmentStartTime : 1}
        },
        {
            $group :{
                _id : "$clientId",
                clientId : {$first : "$clientId"},
                appointmentStartTime : {$first : "$appointmentStartTime"},
                services : {$first : "$services"},
                allServices : {$push : "$services"},
            }
        },
        {
            $unwind : "$services"
        },
        {
            $project : {
                serviceName : "$services.name",
                serviceCode : "$services.serviceCode",
                clientId : "$clientId",
            }
        },
        {
            $match : {serviceCode : {$ne : null}}
        },
        {
            $match : {serviceCode : {$in : [91,92]}}
        },
        {
            $group : {
                _id : "$clientId",
                clientId : {$first : "$clientId"},
            }
        }
        ]).exec(function(err, results){
            var clientIds  = _.map(results, function(r){ return ObjectId(r.clientId)});
            Appointment.aggregate([
            {
                $match : {
                    "client.id" : {$in : clientIds},
                    status : 3
                },
            },
                {
                    $project :{
                        status : 1,
                        phoneNumber : "$client.phoneNumber",
                        clientId : "$client.id"
                    }
                },
                {
                    $group : {
                        _id : "$clientId",
                        clientId : {$first : "$clientId" },
                        phoneNumber : {$first : "$phoneNumber" },
                        count : {$sum : 1},
                    }
                },
                {
                    $match : {count : {$eq : 1}}
                }
            ]).exec(function(er, data){
                return callback(data);
            })
        })
    },

    getCustomerByParlorId: function(req, callback){
        User.aggregate([
        {
            $match :{
                "parlors.parlorId" : req.query.parlorId,
                "parlors.noOfAppointments" : {$gt : 0},    
            }
        },
        {
            $project :{
                userId : "$_id",
                phoneNumber : 1,
                "parlors.parlorId" : 1,
                "parlors.noOfAppointments" : 1,
            }
        },
        {
            $unwind : "$parlors"
        },
        {
            $match : {
                "parlors.noOfAppointments" : {$gt : 0}
            }
        },
        {
            $group:{
                _id : "$userId",
                userId : {$first : "$userId"},
                phoneNumber : {$first : "$phoneNumber"},
                parlors : {$push : {parlorId : "$parlors.parlorId"}}
            }
        },
        {
            $match : {
                "parlors.parlorId" : req.query.parlorId
            }
        },
        {
            $project : {
                userId : 1,
                phoneNumber : 1,
                parlorsSize : {$size : "$parlors" }
            }
        },
        {
            $match : {
                parlorsSize : {$eq : 1}
            }
        }
        ]).exec(function(er, users){
            return callback(users);
        });
    },

    customersNoShow3Months: function(req, callback){
        Appointment.aggregate([
        {
            $match :{
                appointmentStartTime : {$gt : new Date(2018, 0, 1)},
                status : 3
            }
        },
        {
            $project : {
                appointmentStartTime : 1,
                phoneNumber : "$client.phoneNumber",
            }
        },
        {
            $sort : {
                appointmentStartTime : -1
            }
        },
        {
            $group : {
                _id : "$phoneNumber",
                phoneNumber : {$first : "$phoneNumber"},
                lastAppointmentDate : {$first : "$appointmentStartTime"},
            }
        },
        {
            $match : {
                lastAppointmentDate : {$lt : new Date(2018, 8, 1)}
            }
        },
        {
            $project : {
                phoneNumber : "$phoneNumber"
            }
        }
        ]).exec(function(er, data){
            return callback(data);
        });
    },

    customersNoShow3MonthsByParlor: function(req, callback){
        Appointment.aggregate([
        {
            $match :{
                appointmentStartTime : {$gt : new Date(2018, 0, 1)},
                status : 3,
                parlorId : ObjectId(req.query.parlorId)
            }
        },
        {
            $project : {
                appointmentStartTime : 1,
                review : "$review.text",
                rating : "$review.rating",
                "services.name" : 1,
                "services.employees.name" : 1,
                phoneNumber : "$client.phoneNumber",
                name : "$client.name",
            }
        },
        {
            $sort : {
                appointmentStartTime : -1
            }
        },
        {
            $group : {
                _id : "$phoneNumber",
                phoneNumber : {$first : "$phoneNumber"},
                name : {$first : "$name"},
                lastAppointmentDate : {$first : "$appointmentStartTime"},
                rating : {$first : "$rating"},
                review : {$first : "$review"},
                services : {$first : "$services"},
            }
        },
        {
            $match : {
                lastAppointmentDate : {$lt : HelperService.getLastTwoMonthStart()}
            }
        },
        {
            $sort : {lastAppointmentDate : -1}
        }
        ]).exec(function(er, data){
            return callback(data);
        });
    },

    repeatBeuClientSalonWise: function(req, callback){
        User.aggregate([
        {
            $match : {
                userType : true,
                "parlors.noOfAppointments" : {$gt : 0},
            }
        },
        {
            $unwind : "$parlors"
        },
        {
            $project : {
                userId : "$_id",
                parlorId : "$parlors.parlorId",
                parlorName : "$parlors.name",
                noOfAppointments : "$parlors.noOfAppointments",
            }
        },
        {
            $group : {
                _id : "$parlorId",
                parlorId : {$first : "$parlorId"},
                parlorName : {$first : "$parlorName"},
                totalBeuUsers : {$sum : 1},
                totalRepeatClients : {$sum : { $cond: { if: { $gt: [ "$noOfAppointments", 1 ] }, then: 1, else: 0 } }}
            }
        }
        ]).exec(function(err, data){
            return callback(data);
        });
    },

    newclientServices: function(req, callback){
        Appointment.aggregate([
        {
            $match : {
                "client.noOfAppointments" : 0,
                status : 3,
            },
        },
        {
            $project : {
                "services.name" : 1,
                "services.serviceCode" : 1,
                "appointmentStartTime"  :1,
                "clientId" : "$client.id",
            }
        },
        {
            $sort : {appointmentStartTime : 1}
        },
        {
            $group :{
                _id : "$clientId",
                clientId : {$first : "$clientId"},
                appointmentStartTime : {$first : "$appointmentStartTime"},
                services : {$first : "$services"},
            }
        },
        {
            $unwind : "$services"
        },
        {
            $project : {
                serviceName : "$services.name",
                serviceCode : "$services.serviceCode",
                clientId : "$clientId",
            }
        },
        {
            $match : {serviceCode : {$ne : null}}
        },
        {
            $group :{
                _id : "$serviceCode",
                serviceCode : {$first: "$serviceCode"},
                serviceName : {$first: "$serviceName"},
                count : {$sum : 1},
            }
        },
        {
            $sort : {count : -1}
        }
        ]).exec(function(err, results){
            return callback(results);
        })
    },

    subscribersPaymentTrends: function(req, callback){
        Appointment.aggregate([
        {
             $match : {
                status : 3,
                "client.subscriptionLoyality" : {$gt : 0},
                "appointmentStartTime" : {$gt : new Date(2018, 0, 1)},
                serviceRevenue : {$gt : 0},
            } 
        },
        {
            $project : {
                clientId : "$client.id",
                year: { $year: "$appointmentStartTime" },
                month: { $month: "$appointmentStartTime" },
                day : { $dayOfMonth : "$appointmentStartTime" },
                paymentMethod : 1,
                appointmentStartTime :1,
                appBooking : 1,
            }
        },
        {
            $sort : {appointmentStartTime : 1},
        },
        {
            $group : {
                _id : {
                    year : "$year",
                    month : "$month",
                    day : "$day",
                    clientId : "$clientId",
                },
                paymentMethod : {$first : "$paymentMethod"},
                clientId : {$first : "$clientId"},
                appBooking : {$first : "$appBooking"},
                appointmentStartTime : {$first : "$appointmentStartTime"},
            }
        },
        {
            $sort : {appointmentStartTime : 1},
        },
        {
            $group : {
                _id : "$clientId",
                clientId : {$first : "$clientId"},
                appointments : {$push : {paymentMethod : "$paymentMethod", appBooking : "$appBooking" }}
            },
        },
        { 
            $unwind: { path: "$appointments", includeArrayIndex: "arrayIndex" } 
        },
        {
            $match : {arrayIndex : {$lte : 4}}
        },
        {
            $project : {
                visitIndex : "$arrayIndex",
                paymentMethod : "$appointments.paymentMethod",
                appBooking : "$appointments.appBooking",
            }
        },
        {
            $group : {
                _id : "$visitIndex",
                appOnline : {$sum : {$cond: { if: { $and: [ { $eq: [ "$paymentMethod", 5 ] }, { $eq: [ "$appBooking", 2 ] } ] }, then: 1, else: 0 }} },
                appCash : {$sum : {$cond: { if: { $and: [ { $ne: [ "$paymentMethod", 5 ] }, { $eq: [ "$appBooking", 2 ] } ] }, then: 1, else: 0 }} },
                crm : {$sum : {$cond: { if: { $and: [{ $eq: [ "$appBooking", 1 ] } ] }, then: 1, else: 0 }} },
                visitIndex : {$first : "$visitIndex"},
            }
        },
        {
            $sort : {visitIndex : 1},
        }
        ]).exec(function(err, data){
            return callback(data);
        });
    },

    noOfSubscriberAddedMonthWise: function(req, callback){
        SubscriptionSale.aggregate([
        {
            $project : {
                userId : 1,
                createdAt : 1,
            },
        },
        {
            $lookup:{
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $project : {
                createdAt: 1,
                userId : {$arrayElemAt: ["$user._id", 0]},
            }
        },
        {
            $match : {
                userId : {$ne : null},
            }
        },
        {
            $project:{
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
            }
        },
        {
            $group : {
                _id :{
                    year : "$year",
                    month : "$month",
                },
                year : {$first : "$year"},
                month : {$first : "$month"},
                count : {$sum : 1},
            }
        },
        {
            $sort : {year: 1, month : 1}
        }
        ]).exec(function(err, f){
            return callback(f);
        });
    },

    appointmentReportParlorType: function(req, type, callback, month){
        var match = AggregateHelper.getAppointmentMonthlyMatchObj(req, type, month), project = AggregateHelper.getAppointmentMonthlyProjectObj(type), aggregateArray = [];
        if(type == 'freeHairCut')aggregateArray.push({$unwind : "$services"});
        var otherArregateValue = [
            {
                $match : match
            },
            {
                $project : project
            },
            {   
                $group : AggregateHelper.getFirstGroup(type),
            }
        ];
        if(type == 'clientWise')
            otherArregateValue.push({
                $group : AggregateHelper.getFirstGroup('dsa'),
            });

        var otherArregate2 = [
            {
                $lookup:{
                    from: "parlors",
                    localField: "parlorId",
                    foreignField: "_id",
                    as: "parlor"
                }
            },
            {
                $project : {
                    year: 1,
                    month: 1,
                    footFall : 1,
                    reportValue : 1,
                    footFallCash : 1,
                    reportValueCash : 1,
                    parlorType : { $ifNull : [{$arrayElemAt: [ "$parlor.parlorType", 0 ] }, 0]},
                }
            },
            {   $group : {
                    _id : {
                        parlorType : "$parlorType",
                        year : "$year",
                        month : "$month",
                    },
                    footFall : AggregateHelper.getFootfall(type),
                    footFallCash : {$sum:"$footFallCash"},
                    reportValueCash : {$sum : "$reportValueCash"},
                    reportValue : {$sum : "$reportValue"},
                    noOfSalons : {$sum : 1},
                    year : { $first: '$year' },
                    month : { $first: '$month' },
                    parlorType : { $first: '$parlorType' },
                }
            },
            {
                $sort : { 
                    year : 1,
                    month : 1,
                    parlorType : 1,
                }
            },
            {   $group : {
                    _id : {
                        year : "$year",
                        month : "$month",
                    },
                    footFall : {$sum : "$footFall"},
                    reportValue : {$sum : "$reportValue"},
                    footFallCash : {$sum:"$footFallCash"},
                    reportValueCash : {$sum : "$reportValueCash"},
                    noOfSalons : {$sum : "$noOfSalons"},
                    year : { $first: '$year' },
                    month : { $first: '$month' },
                    parlors : { $push: {
                                    parlorType : '$parlorType',
                                    noOfSalons : '$noOfSalons',
                                    footFall : '$footFall',
                                    reportValue : '$reportValue',
                                    footFallCash : "$footFallCash",
                                    reportValueCash :"$reportValueCash",
                                }
                            },
                }
            },
            {
                $sort : { 
                    year : 1,
                    month : 1,
                }
            },
        ];
        _.forEach(otherArregateValue, function(v){ aggregateArray.push(v)});
        _.forEach(otherArregate2, function(v){ aggregateArray.push(v)});
        Appointment.aggregate(aggregateArray).exec(function(err, result){
            return callback(result);
        });
    },

    parseResultForSubscribersPaymentTrends: function(results){
        return _.map(results, function(r){
            var total = r.appOnline + r.appCash + r.crm;
            return{
                visitIndex : r.visitIndex + 1,
                /*appCash : r.appCash,
                appOnline : r.appOnline,
                crm : r.crm,*/
                appOnlinePercent : parseInt((r.appOnline/total)*100),
                appCashPercent : parseInt((r.appCash/total)*100),
                crmPercent : parseInt((r.crm/total)*100),
            }
        });
    },

    parseClientFirstAppointmentAndSubscriptionBuyDate: function(results){
        var clientFirstAppointments = results[0];
        console.log(clientFirstAppointments[0]);
        var data = [{type : "0", count : 0}, {type : "1-5", count : 0}, {type : "6-12", count : 0}, {type : ">12", count : 0}];
        _.forEach(results[1], function(r){
            let n = _.filter(clientFirstAppointments, function(c){return c.clientId + "" == r.clientId + ""})[0];
            let firstAppointmentDate = n ? n.appointmentStartTime : r.appointmentStartTime;
            let differenceInMonth = HelperService.getNoOfDaysDiff(r.appointmentStartTime, firstAppointmentDate)/30;
            if(differenceInMonth == 0){
                data[0].count ++;
            }else if(differenceInMonth <= 5){
                data[1].count ++;
            }else if(differenceInMonth <= 12){
                data[2].count ++;
            }else{
                data[3].count ++;
            }
        });
        return data;
    },

    parseResultForAppointmentReport: function(results){
        return _.map(results, function(r){
            return{
                month : HelperService.getMonthName(r.month-1),
                noOfDays : HelperService.getNoOfDaysInMonth(r.year, r.month-1),
                footFall : r.footFall,
                noOfSalons : r.noOfSalons,
                reportValue : r.reportValue,
                footFallCash : r.footFallCash,
                reportValueCash : r.reportValueCash,
                year : r.year,    
                parlors : r.parlors,
            }
            
        });
    },

    parseResultForFreebiesReport: function(results){
        return data = _.map(results[0], function(r){
            var freebiesOnlinePaymentThreading = _.filter(results[1], function(th){ return th.month == r.month})[0];
            var onlineDiscountFreebies = freebiesOnlinePaymentThreading ? freebiesOnlinePaymentThreading.onlineDiscountFreebies: 0; 
            var threadingFreebies = freebiesOnlinePaymentThreading ? freebiesOnlinePaymentThreading.threadingFreebies : 0;

            var otherFreebiesObj = _.filter(results[2], function(th){ return th.month == r.month})[0];
            var otherFreebies = otherFreebiesObj ? otherFreebiesObj.otherFreebies : 0;
            var referalFreebies = otherFreebiesObj ? otherFreebiesObj.referalFreebies : 0;
            var reviewFreebies = otherFreebiesObj ? otherFreebiesObj.reviewFreebies : 0;
            var referalServiceFreebies = otherFreebiesObj ? otherFreebiesObj.referalServiceFreebies : 0;
            return{
                month : HelperService.getMonthName(r.month-1),
                noOfDays : HelperService.getNoOfDaysInMonth(r.year, r.month-1),
                year : r.year,
                totalFreebies : r.freeHairCutFreebies + onlineDiscountFreebies + threadingFreebies + otherFreebies,
                freeHairCutFreebies : r.freeHairCutFreebies,
                onlineDiscountFreebies : onlineDiscountFreebies,
                threadingFreebies : threadingFreebies,
                referalFreebies : referalFreebies,
                reviewFreebies : reviewFreebies,
                referalServiceFreebies : referalServiceFreebies,
            };
        });
    },

    dailyofferNotification: function(req,callback){
        User.aggregate([
            {
                $match:
                    {$or:[
                        {firebaseId: {$ne: null}},
                        {firebaseIdIOS: {$ne: null}}
                    ] 
                }
            },
            // {$unwind:"$parlors"},
            {
                $project:{
                    parlorId:"$parlors.parlorId",
                    firebaseId:1,
                    firebaseIdIOS:1,
                    gender:1
                }
            },
            {
                $group:{
                    _id:{
                        parlorId:"$parlorId",
                        gender:"$gender"
                    },
                    parlorId:{$first:"$parlorId"},
                    gender:{$first:"$gender"},
                    firebase:{
                        $push:{
                            firebaseIdIOS:"$firebaseIdIOS",
                            firebaseId:"$firebaseId"
                        }
                    }
                }
            },
            {$group : {
                    _id : {
                        gender : "$gender",
                    },
                    parlors:{
                        $push:{
                            parlorId:"$parlorId",
                            fire:"$firebase"
                        }
                    }
                }
            },
            
        ]).exec(function(err,data){
            console.log(err)
                return callback(err,data)
        })
    },

    dailyOnlinePaymentReport: function(req,callback){
        var startDate = req.body.startDate;
        var endDate = req.body.endDate;
        Appointment.aggregate([
            {
                $match : {
                    status:3,
                    $or:[{"appointmentType":3} , {"appBooking" : 2}],
                    appointmentStartTime: {$gte: HelperService.getDayStart(startDate), $lt: HelperService.getDayEnd(endDate)}
                }
            },
            {
                $project:{
                    payableAmount:1,
                    isPaid:1,
                    paymentMethod:1,
                    appointmentType:1,
                    appointmentStartTime:1,
                    parlorId:1,
                    parlorName:1,
                    parlorAddress:1,
                    razorAmount:1,
                    cashAmount:1,
                    razorCount:1,
                    cashCount:1,
                    date: {'$dateToString': {format: '%m/%d/%Y', date: '$appointmentStartTime'}},
                }
            },
            {
                $group:{
                    _id:{
                        parlor:"$parlorId",
                        date:"$date",
                    },
                    parlorName:{$first:"$parlorName"},
                    parlorId:{$first:"$parlorId"},
                    parlorAddress:{$first:"$parlorAddress"},
                    date:{$first : "$date"},
                    razorCount :{$sum: {$cond: { if: { $eq: [ "$paymentMethod",5 ] }, then: 1, else: 0 }}},
                    cashCount:{$sum:{$cond: { if: { $eq: [ "$paymentMethod", 5 ] }, then: 0, else: 1 }}},
                    razorAmount:{$sum: {$cond: { if: { $eq: [ "$paymentMethod",5 ] }, then: "$payableAmount", else: 0 }}},
                    cashAmount:{$sum:  { $cond: { if: { $eq: [ "$paymentMethod", 5 ] }, then: 0, else: "$payableAmount" }}},
                }
            },
            {
                $sort:{
                    '_id.date': 1,
                }
            },
            {
                $group:{
                    _id:{
                        parlorId:"$parlorId",
                        // name:"$parlorName"
                    },
                    parlorName : {$first:"$parlorName"},
                    parlorAddress:{$first:"$parlorAddress"},
                    values:{
                        $push:{
                            date:"$date",
                            cashCount:{$sum : "$cashCount"},
                            razorCount:{$sum : "$razorCount"},
                            razorAmount:{$sum : "$razorAmount"},
                            cashAmount:{$sum : "$cashAmount"}                           
                        }
                    }
                }
            }
        ]).exec(function(err,data){
            console.log(err)
            console.log(data[0].values)
            return callback(err,data)
        })
    },

    parseResultForSubscriberCountRevenueReport: function(results){
        var countReport = results[0];
        var revenueReport = results[1];
        var total = 0;
        var data = _.map(countReport, function(c){
            total += c.count;
            var temp = _.filter(revenueReport, function(e){ return e.month == c.month && e.year == c.year})[0];
            return{
                month : HelperService.getMonthName(c.month-1),
                newSubscriber : c.count,
                totalSubscriber : total,
                activeVisits : temp ? temp.noOfVisit : 0,
                activeVisitsRevenue : temp ? parseInt(temp.revenue) : 0,
            };
        });
        return data;
    },

    parseResultForSubscriberCountRevenueSalon: function(results){
        var countReport = results[0];
        var revenueReport = results[1];
        var total = 0;
        var data = _.map(countReport, function(c){
            total += c.noOfNewSubscriber;
            var temp = _.filter(revenueReport, function(e){ return e.month == c.month && e.year == c.year})[0];
            return{
                month : HelperService.getMonthName(c.month-1),
                newSubscriber : c.noOfNewSubscriber,
                totalSubscriber : total,
                activeVisits : temp ? temp.noOfVisit : 0,
                activeVisitsRevenue : temp ? parseInt(temp.revenue) : 0,
            };
        });
        return data;
    },
    
    parseResultForCashOnlineReport: function(results){
        var data = [];
        results = _.sortBy(results, 'count');
        _.forEach(results, function(r){
            data.push({
                customerCount : r.count,
                results : _.map(r.results, function(re){
                    return {
                        noOfAppointments : re.noOfAppointments,
                        revenue : parseFloat(re.revenue.toFixed(2)),
                        zero : parseFloat(re.zero.toFixed(2)),
                        zeroCount : re.zeroCount,
                        fiveHundred : parseFloat(re.fiveHundred.toFixed(2)),
                        fiveHundredCount : re.fiveHundredCount,
                        thousand : parseFloat(re.thousand.toFixed(2)),
                        thousandCount : re.thousandCount,
                        twoThousand : parseFloat(re.twoThousand.toFixed(2)),
                        twoThousandCount : re.twoThousandCount,
                        paymentMethod : re.paymentMethod
                    };
                })
            })
        });
        return {data : data};
    },

    findUsersInParlors:function(req,callback){
        User.aggregate([{$unwind:"$parlors"},
                    {$project:{parlorId:"$parlors.parlorId",phoneNumber:1}},
                    {$group:{_id:{parlorId:"$parlorId"},parlorId:{$first:"$parlorId"},phone:
                    {$push:"$phoneNumber"}}}
                    
                ]).exec(function(err,data){
                    console.log(err)
                    Parlor.find({},{name:1},function(err,parlors){
                        _.forEach(parlors,function(p){
                            _.forEach(data,function(d){
                                if(p.id == d.parlorId){
                                    d.parlorName = p.name
                                }  
                            })                  
                        })
                        data = _.map(data,function(e){
                            return{
                                parlorName:e.parlorName,
                            phone:e.phone 
                            }
                           
                        })
                        return callback(err,data)
                    })
                })
        },

        
};

