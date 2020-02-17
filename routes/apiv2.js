'use strict'

var express = require('express');
var router = express.Router();


router.use(function timeLog(req, res, next) {
    
      if(req.query.userId != "5b3f0cdcbdda160b4bb48545"){
          next();
      }else{
        return res.sendStatus(403);
      }
});

router.get('/', function(req, res, next) {
    return res.json(CreateObjService.response(false, 'Working'));
});

router.get('/addSubscriptionToUserCureFit', function(req, res, next){
    // parlorId, userId, userCreatedAt, razor, amount, subscriptionReferralCode, source, callback
    let subscriptionPresent = [];
    let phoneNumbers = [{name : "Sumit sudhakar jyotkar", gender : "M", phoneNumber : "9823997013",emailId : "sumit.sudhakar@cultfit.in"}, {name : "Karthik S", gender : "M", phoneNumber : "7598318996",emailId : "karthik.s@cultfit.in"}, {name : "Zonunmawia", gender : "M", phoneNumber : "6361999639",emailId : "zonunmawia@cultfit.in"}]
    

    Async.each(phoneNumbers, function(p, callback){
        User.findOne({phoneNumber : p.phoneNumber}, {subscriptionId : 1}, function(err, user){
            if(user){
                if(user.subscriptionId){
                    subscriptionPresent.push(p.phoneNumber)
                    callback()
                }else{
                    Appointment.addSubscriptionToUser("594a359d9856d3158171ea4f", user.id, new Date(), {id : p.phoneNumber+"curefit"}, 1699, "", p.name, p.phoneNumber, "CureFit", function(){
                        callback()
                    })
                }
            }else{
                User.create({phoneNumber: p.phoneNumber, emailId: p.emailId, firstName: p.name, gender : p.gender }, function(er, u){
                    Appointment.addSubscriptionToUser("594a359d9856d3158171ea4f", u.id, new Date(), {id : p.phoneNumber+"curefit"}, 1699, "", p.name, p.phoneNumber, "CureFit", function(){
                        callback()
                    })
                })
            }
        });
    }, function allDone(){
        console.log('done')
        res.json({message : 'done', subscriptionPresent : subscriptionPresent});
    })
})

router.get('/loginToMirror', function(req, res, next) {
    User.findOne({_id : req.query.userId}, function(err, user){
        BeuMirror.findOne({_id : req.query.mirrorId}, {firebaseId : 1}, function(err, beuMirror){
            Appointment.sendMirrorNotification([beuMirror.firebaseId], {name : user.firstName, image : user.profilePic, userId : user.id, accessToken : user.accesstoken}, function(){
                return res.json(CreateObjService.response(false, 'done'));
            })
        })
    })
})

router.post('/createMirror', async(req, res, next) => {
    let beuMirror = await BeuMirror.findOne({macAddress : req.body.macAddress})
    let parlor = await Parlor.findOne({parlorIdNumeric : req.body.parlorId}, {name : 1, geoLocation : 1})
    let parlorName = parlor.name != "Monsoon" ? ("Be U " + parlor.name) : parlor.name
    let newObj = {parlorIdNumeric : req.body.parlorId, parlorName : parlorName, parlorId : parlor ? parlor.id : "", cityId : req.body.cityId, wifiName : req.body.wifiName, wifiPassword : req.body.wifiPassword, firebaseId : req.body.firebaseId, macAddress : req.body.macAddress}
    if(beuMirror){
        let u = await BeuMirror.update({_id : beuMirror.id}, {firebaseId : req.body.firebaseId})
        newObj.mirrorId = beuMirror.id
    }
    else{
        var newMirroObj = await BeuMirror.create(newObj)
        newObj.mirrorId = newMirroObj.id
        let update = await Parlor.update({_id : parlor.id}, {isMirrorAvailable : true})
    }
    newObj.latitute = parlor.geoLocation[1]
    newObj.longitude = parlor.geoLocation[0]
    return res.json(CreateObjService.response(false, newObj));
})

router.get('/sendOfferToNewUser', function(req, res, next) {
    Appointment.aggregate([
        {
            $match : {
                status : 3,
                appointmentStartTime : {$gt : HelperService.getBeforeByDay(360)}
            },
        },
        {
            $project : {
                clientPhoneNumber : "$client.phoneNumber",
                appointmentStartTime : 1
            },
        },
        {
            $sort : {appointmentStartTime : -1}
        },
        {
            $group : {
                _id : "$clientPhoneNumber",
                appointmentStartTime : {$first : "$appointmentStartTime"},
                clientPhoneNumber : {$first : "$clientPhoneNumber"},
            }
        },
        {
            $match: {
                appointmentStartTime : {$lt : HelperService.getBeforeByDay(60)}
            }
        }
    ]).exec(function(err, clients){
        let numbers = []
        Async.forEach(clients, function(c, callback){
            let obj = {"active" : true,"offPercentage" : 50,"limit" : 500,"code" : "APP50","couponTitle" : "Get 50% Off","couponDescription" : "Use code APP50 for 50% flat","createdAt" : new Date(),"couponType" : 27,"expires_at" : HelperService.addDaysToDate2(1)}
            User.update({phoneNumber : c._id}, {$push : {couponCodeHistory : obj}}, function(er, f){
                numbers.push(c.clientPhoneNumber)
                console.log('done')
                callback()
            })
        }, function allDone(){
            ParlorService.sendSmsAfterminutes(numbers, HelperService.addHrsAfter(0), 'Because we miss you, enjoy 50% discount coupon (max Rs 500) on any services of your choice (Coupon expires in 24 hours). https://beusalons.app.link/Gc7HfpfrXV')
            res.json('done')
        })
    })
});

router.get('/ownerNumberInUser', function(req, res, next) {
    Admin.find({}, {phoneNumber : 1}, function(err, admins){
        let phoneNumbers = _.map(admins, function(a){return a.phoneNumber});
        User.find({phoneNumber : {$in : phoneNumbers}, "couponCodeHistory.couponType": 14}, {phoneNumber : 1}, function(er, f){
            let phoneNumber2 = _.map(f, function(a){return a.phoneNumber});
            User.updateMany({phoneNumber : {$in : phoneNumber2}}, {$pull : { couponCodeHistory: { couponType: 14 } }}, function(er,m){
                res.json('done')
            })
        })
    })
});

// UserReminder
router.get('/serviceReminders', function(req, res, next) {
    ServiceCategory.find({isForReminder : true}, function(err, categories){
        let data = [];
        _.forEach(categories, function(c){
            data.push({
                  title : c.name,
                  type : 1,
                  recommendedDays : c.recommendedDays,
                  serviceCodes : [202],
                  reminders : [
                  {
                    day : 7,
                  },
                  {
                    day : 15,
                  },
                  {
                    day : 30,
                  },
                  {
                    day : 45,
                  },
                  {
                    day : 60,
                  }, 
                  {
                    day : 90,
                  }]
            })
        })
        return res.json(CreateObjService.response(false, data));
    })
});

//latitute, longitute, user, gender, parlorId
router.get('/parlorServiceByCategoryIds', function(req, res, next) {
    console.log(req.query.categoryIds);
    var comboDeals = [], deals = [], allServices = [];
    if(JSON.parse(req.query.categoryIds)[0] == 1){
        Async.parallel([
            function(callback) {
                AggregateService.allPackagesByParlor(req.query.gender, req.query.parlorId, function(comboDeals1){
                    comboDeals = ParlorService.parseAllPackage(comboDeals1, true, 1);
                    callback(null);
                });
            },
            function(callback){
                Deals.find({ parlorId: req.query.parlorId, isDeleted: false, active: 1, 'dealType.name': { $nin: ['combo', 'newCombo'] } }).sort('dealSort').exec(function(err, deals1) {
                        deals = deals1;
                        callback(null);
                });
            },
            function(callback){
                AggregateService.parlorService(req.query.parlorId, [ObjectId("58707ed90901cc46c44af27e"), ObjectId("58707ed90901cc46c44af27d")], req.query.gender, false, function(results1) {
                    allServices = results1;
                    callback(null);
                });
            }
        ],
        function(err, results) {
            _.forEach(comboDeals, function(c){
                if(c.dealType == "combo"){
                    c = ParlorService.populatePackagePrice(c, deals, allServices);
                }
            });
           var cat = _.map([1], function(r) {
                return {
                    name: "Packages",
                    gender : req.query.gender,
                    services: parseInt(req.query.homeServiceOnly) ? [] : comboDeals,
                    categoryId : 1,
                }
            });
            return res.json(CreateObjService.response(false, cat));
        });
    }else{
        var categoryIds = _.map(JSON.parse(req.query.categoryIds), function(c) {return ObjectId(c) });
        ApiHelperService.getServiceByCategory(req, categoryIds, function(categories){
            return res.json(CreateObjService.response(false, categories));
        }); 
    }
});

router.get('/flashSaleImage', function(req, res, next) {
    var query = { starts_at : {$lt : new Date()}, expires_at : {$gt : new Date()}, websiteImageUrl : {$ne : ""} };
    query.active = true;
    FlashCoupon.find(query, {websiteImageUrl : 1, imageUrl : 1}, function(err, flashCoupons) {
        return res.json(CreateObjService.response(false, flashCoupons));
    });
})

router.get('/dealsByCategoryIds', function(req, res, next) {
    console.log(req.query.categoryIds);
    var comboDeals = [], deals = [], allServices = [];
    if(JSON.parse(req.query.categoryIds)[0] == 1){
        let categoryIds = JSON.parse(req.query.categoryIds);
        ApiHelperService.getDealsByCategory(req, categoryIds, function(categories){

        var cat = _.map([1], function(r) {
            if(categories[0]){
                _.forEach(categories[0].deals, function(ce){
                    ce.categoryId = 1;
                })
            }
            return {
                name: "Packages",
                gender : req.query.gender,
                services: categories[0] ? categories[0].deals : [],
                categoryId : 1,
            }
        });
        return res.json(CreateObjService.response(false, cat));
        });
    }else{
        var categoryIds = _.map(JSON.parse(req.query.categoryIds), function(c) {return ObjectId(c) });
        ApiHelperService.getDealsByCategory(req, categoryIds, function(categories){
            categories = _.filter(categories, function(c){ return c.name != "Packages"});
            return res.json(CreateObjService.response(false, ApiHelperService.parseDealsForCategoryIds(categories)));
        });
    }
});

router.get('/dealsByDealId', function(req, res, next) {
    AllDeals.findOne({dealId : req.query.dealId}, function(err, deal){
        req.query.categoryIds = deal.categoryIds
        var categoryIds = _.map(req.query.categoryIds, function(c) {return ObjectId(c) });
        ApiHelperService.getDealsByCategory(req, categoryIds, function(categories){
            categories = _.filter(categories, function(c){ return c.name != "Packages"});
            if(categories.length > 0)categories[0].services = _.filter(categories[0].services, function(s){return s.dealId == req.query.dealId})
            return res.json(CreateObjService.response(false, ApiHelperService.parseDealsForCategoryIds(categories)));
        });    
    })
    
});


//latitute, longitute, user, gender, parlorId
router.post('/parlorServiceByCategoryIds', function(req, res, next) {
    var categoryIds = _.map(req.body.categoryIds, function(c) {return ObjectId(c) });
    ApiHelperService.getServiceByCategory(req, categoryIds, function(categories){
        return res.json(CreateObjService.response(false, categories));
    });
});


router.get('/homePageParlorList', function(req, res, next) {
    if(req.query.page > 3)req.query.page = 100;
    var locationName = "",homeData = [];
    Async.parallel([
            function(callback) {
                var request = require("request");
                if(req.query.locationName == " "){
                    var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + req.query.latitude + "," + req.query.longitude + "&key=AIzaSyDvS7vSQ3GyiwLAOaXooTUWJKwBoxrMK6A",
                        response;
                    if(req.query.page == 1){
                        request({
                            url: url,
                            json: true
                        }, function(error, response, body) {
                            console.log(error);
                            if (!error && response.statusCode === 200) {
                                if(response.body.results.length>0){
                                    locationName = ApiHelperService.getLocationName(response.body.results[0]);
                                }
                                callback(null);
                            }else{
                                callback(null);
                            }
                        })     
                    }else{
                        callback(null);
                    }
                }else{
                    callback(null);
                }
                
            },
            function(callback){
                Parlor.getParlorListOnly(req, function(d) {
                    homeData = d;
                    callback(null);
                });
            }
        ],
        function(err, results) {
            var data = {
                locationName: locationName,
                homeData : homeData,
            };
            return res.json(CreateObjService.response(false, data));
        })
});


router.get('/parlorHome', function(req, res, next) {
    var text = "",
        parlor, playlistCount = 0,
        recentRatings = [],
        reqServices, noOfAppointments = 0,
        noOfReviews = 0,salonLiveViewPresent = false,
        user, flashSale = false, count = 0;
    Async.parallel([
            function(callback) {
                User.findFBFriends(req.query.parlorId, req.query.userId, function(text1) {
                    text = text1;
                    callback(null);
                });
            },
            function(callback) {
                User.findOne({ _id: req.query.userId }, { favourites: 1, gender: 1, subscriptionId : 1 }, function(err, user1) {
                    if (!user1) {
                        user = {};
                    } else {

                        user = user1;

                    }
                    callback(null);
                });
            },
            function(callback) {
                Parlor.findOne({ _id: req.query.parlorId }, {cashPaymentAvailable : 1, isAvailableForHomeService : 1, ambienceRating: 1,earlyBirdOfferType : 1, earlyBirdOfferPresent: 1, appRevenuePercentage: 1, revenueDiscountAvailable: 1, tax: 1, brands: 1, wifiName: 1, wifiPassword: 1, dayClosed: 1, id: 1, name: 1, images: 1, gender: 1, address: 1, address2: 1, landmark: 1, rating: 1, phoneNumber: 1, homeServiceMinimumOrderAmount : 1, latitude: 1, longitude: 1, closingTime: 1, parlorType: 1, createdAt: 1, homeServiceRange : 1, link: 1, openingTime: 1, revenueDiscountSlabDown: 1, isMirrorAvailable: 1 }).exec(function(err, parlor1) {
                    parlor = parlor1;
                    callback(null);
                });
            },
            function(callback){
                SalonLayout.findOne({parlorId : req.query.parlorId}, {parlorId : 1}).exec(function(err, d){
                    // if(d)salonLiveViewPresent = true;    
                    callback(null);
                });
            },
            function(callback) {

                var query = { parlors: { $elemMatch: { parlorId: req.query.parlorId, currentCount: { $gt: 0 } } }, starts_at : {$lt : new Date()}, expires_at : {$gt : new Date()} };
                if (localVar.isServer()) query.active = true;
                else query.active = false;
                FlashCoupon.findOne(query, function(err, flashCoupons2) {
                    if (flashCoupons2) {
                        flashSale = true;
                    }
                    callback(null);
                });
            },
            function(callback) {
                Playlist.count({ parlorId: req.query.parlorId }, function(err, count1) {
                    playlistCount = count1;
                    callback(null);
                });
            },

            function(callback) {
                Appointment.find({ parlorId: req.query.parlorId, review: { $ne: null }, 'review.rating': { $exists: true } }, { 'review.rating': 1 }).sort({ $natural: -1 }).limit(10).exec(function(err, ratings) {
                    recentRatings = _.map(ratings, function(e) { return e.review.rating });
                    callback(null);
                });
            },
            function(callback) {
                Appointment.find({ status: 3, parlorId: req.query.parlorId }).count().exec(function(err, noOfAppointments1) {
                    noOfAppointments = noOfAppointments1;
                    callback(null);
                });
            },
            function(callback) {
                Appointment.find({ status: 3, parlorId: req.query.parlorId, "review.rating": { $ne: null } }).count().exec(function(err, noOfReviews1) {
                    noOfReviews = noOfReviews1;
                    callback(null);
                });
            },
            function(callback) {
                Parlor.parlorDepartments(true, req.query.parlorId, function(reqServices1) {
                    reqServices = reqServices1;
                    console.log(reqServices)
                    callback(null);
                });
            },
            function(callback){
                SubscriptionSale.find({}).count().exec(function(err, count1) {
                    count = count1;
                    callback(null);
                });
            }
        ],
        function(err, results) {
            var parlorType = parseInt(parlor.parlorType);
            var parlorDepBrand = ParlorService.getDepartmentString(parlor.gender, reqServices);
            if (!parlor.images) parlor.images = [{ appImageUrl: "http://www.parlorwayzata.com/images/salon-wide.jpg" }];

            var earlyBirdOfferText = '<div><b>Subscribe For ₹1699 & Enjoy Services Worth ₹'+(parlorType == 4 ? '500' : '500')+'/Month, For 1 Year.</b>';
            if(parlor.earlyBirdOfferPresent)earlyBirdOfferText = '<div><b>Early Bird Offer: Spend Above ₹ '+ConstantService.getEarlyBirdOfferMinimumServiceAmount(parlor.parlorType)+' </b><span>At This Outlet &amp; Get</span><b> SalonPass@₹'+ConstantService.getEarlyBirdOfferGlodSubscriptionPrice(parlor.earlyBirdOfferType)+'<strike> (₹1699)</strike></b></div>';
            if(user.subscriptionId){
                earlyBirdOfferText = parlorType == 4 && (parlor.createdAt < new Date(2018, 11, 1)) ? '<div>Redeem services Worth ₹300/Month at Affiliates<br></div>' : '<div>Redeem services Worth ₹500/Month at any Be U Outlets</div>';
            }
            console.log(user.subscriptionId);
            let happyHourPercent = Parlor.getAppRevenueDiscountPercentange(parlor.appRevenuePercentage, parlor.revenueDiscountAvailable, parlor.revenueDiscountSlabDown);
            var data = {
                name: parlor.name,
                parlorId: parlor.id,
                rating: parlor.rating ? parseFloat(parlor.rating + 0.0) : 3.0,
                images: parlor.images,
                ambienceRating : parlor.ambienceRating,
                flashSale: flashSale,
                flashExpiryDate: "5 May",
                imagesCount: parlor.images.length,
                homeServiceMinimumOrderAmount : parlor.homeServiceMinimumOrderAmount,
                homeServiceRange : parlor.homeServiceRange,
                gender: HelperService.getGenderName(parlor.gender),
                address1: parlor.address,
                address2: parlor.address2,
                cashPaymentAvailable : parlor.cashPaymentAvailable,
                landmark: parlor.landmark,
                salonLiveViewPresent : salonLiveViewPresent,
                happyHourText: Parlor.getAppRevenueDiscountPercentangeIgnoreHr(parlor.appRevenuePercentage, parlor.revenueDiscountAvailable),
                isAvailableForHomeService : parlor.isAvailableForHomeService,
                price: 2,
                phoneNumber: parlor.parlorType == 4 ? "9319619992" : parlor.phoneNumber,
                subscriptions: user.subscriptionId ? ConstantService.getHomePageSubscriberText() : ConstantService.getHomePageSubscriptions2(parlor.earlyBirdOfferType, "F", count, parlorType, parlor.createdAt),
                appRevenueDiscountPercentage: happyHourPercent,
                appRevenueDiscountCouponCode: ConstantService.getAppRevenueDiscountCouponCode(),
                realPhoneNumber: parlor.phoneNumber,
                latitude: parlor.latitude,
                recentRatings: recentRatings,
                longitude: parlor.longitude,
                closingTime: parlor.closingTime,
                freeWifi: parlor.wifiName != "" ? true : false,
                isMirrorAvailable: parlor.isMirrorAvailable || false,
                noOfAppointments: noOfAppointments,
                noOfReviews: noOfReviews,
                dayClosed: parlor.dayClosed,
                wifiName: parlor.wifiName,
                earlyBirdOfferText : earlyBirdOfferText,
                wifiPassword: parlor.wifiPassword,
                parlorType: parlorType,
                favourite: _.filter(user ? user.favourites : [], function(f) { return f.parlorId == parlor.id; })[0] ? true : false,
                openingTime: parlor.openingTime,
                tax: (parlor.tax / 100) + 1,
                music: playlistCount > 0 ? true : false,
                departmentsString: parlorDepBrand.departments,
                brandsString: parlor.brands,
                userFbFriendString: text,
                currentTime: new Date(),

            };
            data.earlyBirdOfferPresent = parlor.earlyBirdOfferPresent;
            data.earlyBirdOfferGlodSubscriptionPrice = ConstantService.getEarlyBirdOfferGlodSubscriptionPrice(parlor.earlyBirdOfferType);
            data.realGlodSubscriptionPrice = ConstantService.getRealGlodSubscriptionPrice();
            data.earlyBirdOfferMinimumServiceAmount = ConstantService.getEarlyBirdOfferMinimumServiceAmount(parlor.parlorType);
            return res.json(CreateObjService.response(false, data));
        });
});

router.get('/dealsCategoryList', function(req, res, next) {
    AggregateService.categoryListByDeals(req, function(reqCategories) {
        var categoryIds = ApiHelperService.getTop2Category(req.query.gender, reqCategories);
        var query ={ starts_at :{$lt : new Date()} ,expires_at :{$gt : new Date()}};
        if(localVar.isServer()){query.active = true}
        else {query = {active : false}};
        FlashCoupon.find(query, function(err, flashCoupons){
            _.forEach(reqCategories, function(c){
                c.categories.splice(0 ,0, ConstantService.getPackagesObj())
                if(c.gender == "F"){
                    if(_.filter(flashCoupons, function(f){return f.gender == "F"})[0]){
                        c.categories.splice(1 ,0, ConstantService.getFlashSaleObj())
                    }
                }
                if(c.gender == "M"){
                    if(_.filter(flashCoupons, function(f){return f.gender == "M"})[0]){
                        c.categories.splice(1 ,0, ConstantService.getFlashSaleObj())
                    }
                }
            });  
            ApiHelperService.getDealsByCategory(req, categoryIds, function(dealsByCategory){
                dealsByCategory = _.filter(dealsByCategory, function(c){ return c.name != "Packages"});
                ApiHelperService.addDealsToCategory(reqCategories, req.query.gender, dealsByCategory);
                ApiHelperService.addFlashSaleCategory(reqCategories, req.query.gender, flashCoupons);
                var data = {
                    genders : reqCategories
                }
                res.json(CreateObjService.response(false, data));
            });
        });
    });
});


router.get('/parlorCategoryList', function(req, res, next) {
    var parlor, genders, user, slabs = [], homeServiceOnly = parseInt(req.query.homeServiceOnly), homeServiceCategoryId = [], flashCoupons = [];
    Async.parallel([
            function(callback2) {
                Slab.find({}, function(err, slabs1) {
                    slabs = _.map(slabs1, function(slab) {
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
                    callback2(null);
                });
            },
            function(callback) {
                User.findOne({ _id: req.query.userId }, { gender: 1, subscriptionId : 1 }, function(err, user1) {
                    user = !user1 ? {} : user1;
                    callback(null);
                });
            },
            function(callback) {
                Parlor.findOne({ _id: req.query.parlorId }, { tax: 1 }).exec(function(err, parlor1) {
                    parlor = parlor1;
                    callback(null);
                });
            },
            function(callback) {
                var query = { parlors: { $elemMatch: { parlorId: req.query.parlorId, currentCount: { $gt: 0 } } }, starts_at : {$lt : new Date()}, expires_at : {$gt : new Date()} };
                if (localVar.isServer()) query.active = true;
                else query.active = false;

                FlashCoupon.find(query, {"serviceCodes.categoryId" : 1, gender  : 1}).exec(function(err, flashCoupons2) {
                    console.log("flashCoupons2");
                    console.log(flashCoupons2);
                    flashCoupons = flashCoupons2;
                    callback(null);
                });
            },
            function(callback) {
                Service.aggregate([
                    {
                        $match : {isAvailableForHomeService : true},  
                    },
                    {
                        $project : {
                            categoryId : 1,
                        }
                    },
                    {
                        $group : {
                            _id : "$categoryId",
                            categoryId : {$first : "$categoryId"}
                        }
                    }
                ]).exec(function(err, d){
                    if(homeServiceOnly)homeServiceCategoryId = _.map(d, function(e){return ObjectId(e.categoryId)});
                    AggregateService.categoryListByParlor(req.query.parlorId, homeServiceOnly, homeServiceCategoryId, function(reqServices1) {
                        genders = reqServices1;
                        var categoryIds = ApiHelperService.getTop2Category(req.query.gender, genders);
                        ApiHelperService.getServiceByCategory(req, categoryIds, function(servicesByCategory){
                            ApiHelperService.addServiceToCategory(genders, req.query.gender, req.query.packageNotRequired,servicesByCategory);
                            callback(null);
                        });
                    });
                });
                
            }
        ],
        function(err, results) {
            ApiHelperService.addFlashSaleVariable(genders, flashCoupons);
            var data = {
                parlorId: parlor.id,
                slabs : { slabs: slabs },
                genders : genders,
                tax: (parlor.tax / 100) + 1,
                isSubscribed : (user.subscriptionId) ? true : false
            };
            return res.json(CreateObjService.response(false, data));
        })
});


module.exports = router;
