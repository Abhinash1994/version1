module.exports = {

    getLocationName: function(location){
        var locationName = "";
        _.forEach(location.address_components, function(l){
            if(_.filter(l.types, function(lo){ return lo == "route" || lo == "sublocality" || lo == "locality"})[0]){
                locationName += (locationName.length!=0 ?  ", " + l.long_name : l.long_name);
            }
        });
        return locationName;
    },

	getTop2Category: function(gender, genders){
		var categoryIds = [];
		_.forEach(genders, function(c){
            if(c.gender == gender){
                c.categories.forEach(function(category, key){
                    if(key<2)categoryIds.push(category.categoryId);
                });
            }
        });
		return categoryIds;
	},

    
    addDealsToCategory: function(reqCategories, gender, dealsByCategory){
        _.forEach(reqCategories, function(c){
            if(c.gender == gender){
                c.categories.forEach(function(category){
                    _.forEach(dealsByCategory, function(categoryDeal){
                        if(category.categoryId + "" == categoryDeal.categoryId + ""){
                            category.services = categoryDeal.deals;
                        }
                    });
                });
            }
        });
    },

    addFlashSaleCategory: function(reqCategories, gender, flasCoupons){
        _.forEach(reqCategories, function(c){
            if(c.gender == gender){
                c.categories.forEach(function(category){
                        if(category.categoryId == ConstantService.getFlashCouponCategoryId()){
                            category.services = [];
                            _.forEach(flasCoupons, function(f){
                                if(f.gender == c.gender){
                                    category.services.push(ConstantService.getFlashCouponDetailsForDeal(f));
                                }                                
                            })
                        }
                });
            }
        });
    },

     parseDealsForCategoryIds: function(categories){
        var data = [];
        _.forEach(categories, function(c){
            data.push({
                name : c.name,
                categoryId : c.categoryId,
                services : c.deals,
            });
        });
        return data;
    },

	addServiceToCategory: function(genders, gender, packageNotRequired, servicesByCategory){
		_.forEach(genders, function(c){
            if(c.gender == gender){
                c.categories.forEach(function(category){
                    _.forEach(servicesByCategory, function(categoryService){
                        if(category.categoryId + "" == categoryService.categoryId + ""){
                            category.services = categoryService.services;
                        }
                    });
                });
            }
        });
        if(!packageNotRequired){
            _.forEach(genders, function(c){
                c.categories.splice(0 ,0, ConstantService.getPackagesObj())
            });    
        }
        
	},

    getDealsByCategory: function(req, categoryIds, cb){
        if (!req.query.package) req.query.package = 1;
        var cityId = ConstantService.getCityId(req.query.latitude, req.query.longitude);
        var packageRequired = parseInt(req.query.package);
        AggregateService.dealsByDepartment(req.query.gender, categoryIds, null, null, function(results) {
            _.forEach(results, function(re){
                _.forEach(re.deals, function(deal){
                    var brandsToPresent = [];
                    _.forEach(deal.brands, function(brand){
                        if(brand.parlorLatLongs && brand.parlorLatLongs.length>0){
                            _.forEach(brand.parlorLatLongs, function(city){
                                if(city.cityId == cityId){
                                    _.forEach(city.latlongs, function(l){
                                        if(HelperService.getDistanceBtwCordinates(l.latitude, l.longitude, req.query.latitude, req.query.longitude)<5){
                                                if(!_.filter(brandsToPresent, function(b){ return b + "" == brand.brandId + ""})[0]){
                                                    brandsToPresent.push(brand.brandId);
                                                }
                                            }
                                    });
                                }
                            });
                        }
                    });
                    if(brandsToPresent.length>0){
                        _.forEach(deal.services, function(ser){
                            if(ser.brand.brands && ser.brand.brands.length>0){
                                if(!_.filter(brandsToPresent, function(bb){ return bb + "" == ser.brand.brands[0].brandId + ""})[0]){
                                    ser.removeThisService = true;
                                }
                            }
                        })
                        deal.services = _.filter(deal.services, function(ser){ return !ser.removeThisService});
                    }
                });
                re.deals = _.filter(re.deals, function(de){ return de.services.length > 0});
            });
            // res.json(results)
            if (!packageRequired) results = _.filter(results, function(r) { return r.name != "Packages" });
            results = ParlorService.parseDealsHomePage(results, false, cityId);
            _.forEach(results, function(r) {
                _.forEach(r.deals, function(d) {
                    if (d.parlorTypes) {
                        d.parlorTypes = _.filter(d.parlorTypes, function(pt) { return pt.save != 0 });
                    }
                    var l = ApiHelperService.getLowestPrice(d.parlorTypes);
                    if (l) {
                        d.startAt = l.startAt;
                        d.save = l.save;
                    }
                    if (parseInt(req.query.brandType)) {
                        if (d.type == 'subCategory') {
                            var newData = [];
                            d.services = d.selectors[0].services;
                            ParlorService.populateSelectorByBrands(d, newData, true, null, false, []);
                            d.selectors[0].brands = newData.length > 0 ? newData[0].selectors[0].brands : [];
                            d.selectors[0].type = "subCategory";
                            d.selectors[0].services = [];
                            d.services = [];
                        }
                    } else {
                        d.type = "service";
                    }
                });
            });
            return cb(results);
        });
    },

    getLowestPrice: function(parlorTypes) {
        var d = null,
            lowest = 99999;
        _.forEach(parlorTypes, function(p) {
            if (p.startAt < lowest) {
                lowest = p.startAt;
                d = p;
            }
        });
        return d;
    },

    addFlashSaleVariable: function(genders, flashCoupons){
         _.forEach(genders, function(c){
            _.forEach(flashCoupons, function(f){
                if(f.gender == c.gender){
                    _.forEach(c.categories, function(category){
                        if(_.filter(f.serviceCodes, function(sc){ return sc.categoryId + "" == category.categoryId + ""})[0]){
                            category.flashSalePresent = true;
                        }    
                    })
                }
            });
        });
    },

	getServiceByCategory: function(req, categoryIds, cb){
		var cityId = ConstantService.getCityId(req.query.latitude, req.query.longitude);
        var categories = [],
            flashCouponsServiceCode = [],
            user, tax, parlor = {};
            var realServices = [],
                results = [],
                homeServiceFactor = 1,
                deals = [],
                comboDeals = [], pItems = [];

            Async.parallel([
                    function(callback2) {
                        Parlor.findOne({ _id: req.query.parlorId }, { tax: 1, homeServiceFactor : 1}, function(err, parlor1) {
                            tax = parlor1.tax;
                            homeServiceFactor = parlor1.homeServiceFactor;
                            callback2(null);
                        });
                    },
                    function(callback) {
                        Service.find({ categoryId: { $in: categoryIds } }, { "prices.brand": 1, id: 1, inventoryItemId : 1 }, function(s, realServices1) {
                            var itemIds = [];
                            _.forEach(realServices1, function(s){if(s.inventoryItemId)itemIds.push(s.inventoryItemId)});
                            /*ParlorItem.find({parlorId : req.query.parlorId, inventoryItemId : {$in : itemIds}}, {actualUnits : 1, inventoryItemId : 1}, function(er, pItems1){*/
                                    realServices = realServices1;
                                    pItems = [];
                                    callback(null);
                            // });
                        });
                    },
                    function(callback) {
                        AggregateService.parlorServiceByCategoryIds(req.query.parlorId, categoryIds, req.query.gender, parseInt(req.query.homeServiceOnly), function(results1) {
                            results = results1;
                            callback(null);
                        });
                    },
                    function(callback) {
                        var query = { parlors: { $elemMatch: { parlorId: req.query.parlorId, currentCount: { $gt: 0 } } }, starts_at : {$lt : new Date()}, expires_at : {$gt : new Date()} };
                        if (localVar.isServer()) query.active = true;
                        else query.active = false;
                        FlashCoupon.find(query, function(err, coupons2) {
                            _.forEach(coupons2, function(c) {
                                _.forEach(c.serviceCodes, function(sc) {
                                    var price = _.filter(c.cityPrice, function(cp) { return cp.cityId == cityId })[0];
                                    var par = _.filter(c.parlors, function(cp) { return cp.parlorId + "" == "" + req.query.parlorId })[0];
                                    flashCouponsServiceCode.push({
                                        serviceCode: sc.serviceCode,
                                        brandId: sc.brandId,
                                        productId: sc.productId,
                                        price: price ? price.price : 5000,
                                        flashCouponRemaining: par.currentCount,
                                        flashCouponExpiry: c.expires_at,
                                        code: c.code,
                                    });
                                });
                            });
                            callback(null);
                        });
                    },
                    function(callback) {
                        Deals.find({ parlorId: req.query.parlorId, isDeleted: false, active: 1, 'dealType.name': { $nin: ['combo', 'newCombo'] } }, {services : 1, menuPrice:1, name:1, category:1, weekDay: 1, description: 1, dealPrice : 1, dealType : 1, brands : 1}).sort('dealSort').exec(function(err, deals1) {
                            deals = deals1;
                            callback(null);
                        });
                    },
                    function(callback) {
                        AggregateService.dealsByDepartment(req.query.gender, categoryIds, req.query.parlorId, null, function(comboDeals1) {
                            comboDeals = comboDeals1;
                            callback(null);
                        });
                    },
                    function(callback) {
                        User.findOne({ _id: req.query.userId }, function(err, user1) {
                            if (!user1) {
                                user = {};
                            } else {
                                user = user1;
                            }
                            callback(null);
                        });
                    }

                ],
                function(err, result2) {
                    SubscriptionSale.find({}).count().exec(function(err, count) {
                        comboDeals = ParlorService.parseDealsHomePage(comboDeals, true, cityId);
                        _.forEach(results, function(r) {
                            _.forEach(r.services, function(s) {
                                var flashSale = _.filter(flashCouponsServiceCode, function(f) { return f.serviceCode == s.serviceCode })[0];
                                var rservice = _.filter(realServices, function(resv) { return resv.id + "" == s.serviceId + "" })[0];
                                s.actualUnits = 1;
                                /*if(!rservice.inventoryItemId){
                                    s.actualUnits = 1;
                                }else{
                                    let invItem = _.filter(pItems, function(pI){ return pI.inventoryItemId + "" == rservice.inventoryItemId + ""})[0];
                                    s.actualUnits = invItem && invItem.actualUnits > 0 ? 1 : 0;
                                }*/
                                ParlorService.populateServiceDeals(req.query.gender || s.gender, results, s, deals, rservice);
                                s.packages = [];
                                if (s.prices[0].brand.brands.length > 0) {
                                    _.forEach(s.prices[0].brand.brands, function(brand) {
                                        brand.products = [];
                                    });
                                }
                                if(s.serviceCode == ConstantService.getFreeThreadingServiceCode()){
                                    s.prices[0].dealPrice = 0;
                                    s.dealPrice = 0;
                                    s.dealId = "594a359d9856d3158171ea4f";
                                    s.dealType = "dealPrice";
                                    s.menuPrice = 80;
                                    s.dealWeekDay = 1;
                                }
                                if(parseInt(req.query.homeServiceOnly)) flashSale = null;
                                if (flashSale) {
                                    var flashPrice = parseInt(flashSale.price / (1 + tax / 100));
                                    s.flashSalePrice = flashPrice;
                                    s.couponCode = flashSale.code;
                                    s.expiryDate = flashSale.flashCouponExpiry;
                                    s.couponLeft = flashSale.flashCouponRemaining;
                                    s.flashSale = true;
                                    if (s.flashSale) {
                                        console.log(s);
                                        if (s.prices[0].brand.brands.length > 0) {
                                            _.forEach(s.prices[0].brand.brands, function(brand) {
                                                if (brand.brandId + "" == flashSale.brandId) {
                                                    if(brand.dealRatio){    
                                                    console.log("console here ------------------",(JSON.stringify(brand.dealRatio)));
                                                    brand.originalRatio = JSON.parse(JSON.stringify(brand.dealRatio));
                                                    brand.dealRatio = flashPrice / s.dealPrice;
                                                    }
                                                }
                                                if (brand.products.length > 0) {
                                                    _.forEach(brand.products, function(product) {
                                                        product.dealRatio = flashPrice / s.dealPrice;
                                                        product.originalRatio = JSON.parse(JSON.stringify(product.dealRatio));
                                                    });
                                                }

                                            })
                                        }
                                    }
                                }
                                if(parseInt(req.query.homeServiceOnly)){
                                    s.menuPrice = parseInt(s.menuPrice*homeServiceFactor);
                                    s.dealPrice = parseInt(s.dealPrice*homeServiceFactor);
                                    s.price = parseInt(s.price*homeServiceFactor);
                                    s.flashSale = false;
                                }
                            });
                        });
                        _.forEach(results, function(r) {
                            var packageDeals = [];
                            r.packages = [];
                            _.forEach(r.services, function(s) {
                                s.upgrades = ParlorService.getServiceUpgrades(results, s);
                                packageDeals = ParlorService.populateAllPackages(s, comboDeals, deals, results);
                                _.forEach(packageDeals, function(p) { p.newCombo = [] });
                                s.packages = req.query.removePackage ? [] : packageDeals;
                                _.forEach(packageDeals, function(d) {
                                    if (!_.filter(r.packages, function(pac) { return pac.dealId == d.dealId })[0])
                                        r.packages.push(d)
                                });
                            });
                        });

                        var categories = _.map(results, function(r) {
                            return {
                                name: r.name,
                                gender : req.query.gender,
                                services: _.filter(r.services, function(s){return s.actualUnits}),
                                categoryId : r.categoryId,
                            }
                        });
                        return cb(categories);
                    });
                });
	}

};