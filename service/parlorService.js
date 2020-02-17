module.exports = {

    getPackages: function(callback) {
        var r = 12345;
        Service.find({}, function(err, services) {
            AllDeals.find({ category: 'Package' }).sort('dealPrice').exec(function(err, data) {
                if (err) {
                    return callback([]);
                } else {
                    var ion = -1;
                    var data = _.map(data, function(d) {
                        return Deals.parse(d);
                    });
                    var d = _.chain(data)
                        .groupBy('category')
                        .map(function(val, key) {
                            return {
                                categoryId: ++r,
                                type: (++ion % 5),
                                name: key,
                                services: _.map(val, function(v) {
                                    var obj = v;
                                    obj.type = (ion % 5);
                                    return obj;
                                }),
                            };
                        })
                        .value();
                    _.forEach(d, function(del) {
                        _.forEach(del.services, function(s) {
                            s.services = ParlorService.getServiceDetail2(s.services, services);
                            s.gender = ParlorService.getDealGender(s.services);
                        });
                    });
                    return callback(d);
                }
            });
        });
    },

    getSMSUrl: function(messageId, message, phoneNumbers, type) {
/*        var param = {},
            request = "";
        param.sender = messageId;
        param.message = message.replace(/&/g, "%26");
        param.numbers = phoneNumbers.toString();
        param.username = type == "P" ? "ivyinfo" : "trivyinfo";
        param.password = type == "P" ? "GRNnjF" : "mVVp4J";
        for (var key in param) {
            request += key + "=" + encodeURI(param[key]) + "&";
        }
        request = encodeURI(request.substr(0, request.length - 1));
        console.log("http://sms99.co.in/pushsms.php?" + request);
        return "http://sms99.co.in/pushsms.php?" + request;
*/
        return "http://api.msg91.com/api/sendhttp.php?sender=BEUSLN&route=4&mobiles=" + phoneNumbers + "&authkey=164034A93iTmJcMu595dd01d&country=91&message=" + encodeURI(message) + "";
    },

    getActiveConnectUrl: function(message,phoneNumber){
        return "http://api.oot.bz/api/v1/send?username=beusalon.trans&password=cVuXd&unicode=false&from=ENTPSD&to="+phoneNumber+"&text="+ encodeURI(message) + "";
    },

     sendSmsByXML: function(numbers, time, message) {
        var builder = require('xmlbuilder');
        var xml = builder.create('MESSAGE')
            .ele('AUTHKEY', '164034A93iTmJcMu595dd01d').up()
            .ele('SENDER', 'BEUSLN').up()
            .ele('ROUTE', 4).up()
            .ele('CAMPAIGN', 'TEST TEST').up()
            .ele('COUNTRY', 91).up()
            .ele("SMS", { 'TEXT': message });

        for (var i = 0; i < numbers.length; i++) {
            var item = xml.ele('ADDRESS');
            item.att('TO', numbers[i]);
        }

        xml = xml.end({ pretty: true });

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

        var req = http.request(options, function(res) {
            var chunks = [];

            res.on("data", function(chunk) {
                chunks.push(chunk);
            });

            res.on("end", function() {
                var body = Buffer.concat(chunks);
                console.log(body.toString());
            });
        });

        req.write(xml);
        req.end();
    },


   sendSmsAfterminutes: function(numbers, time, message) {
        var builder = require('xmlbuilder');
        var xml = builder.create('MESSAGE')
            .ele('AUTHKEY', '164034A93iTmJcMu595dd01d').up()
            .ele('SENDER', 'BEUSLN').up()
            .ele('ROUTE', 4).up()
            .ele('CAMPAIGN', 'TEST TEST').up()
            .ele('SCHEDULEDATETIME', HelperService.getTimeInMsgFormate(time)).up()
            .ele('COUNTRY', 91).up()
            .ele("SMS", { 'TEXT': message });

        for (var i = 0; i < numbers.length; i++) {
            var item = xml.ele('ADDRESS');
            item.att('TO', numbers[i]);
        }

        xml = xml.end({ pretty: true });

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

        var req = http.request(options, function(res) {
            var chunks = [];

            res.on("data", function(chunk) {
                chunks.push(chunk);
            });

            res.on("end", function() {
                var body = Buffer.concat(chunks);
                console.log(body.toString());
            });
        });

        req.write(xml);
        req.end();
    },

    getSMSUrlForOtp: function(messageId, message, phoneNumbers, type, otp, retry) {
        var param = {},
            request = "";
        param.authkey = "164034A93iTmJcMu595dd01d";
        param.mobile = "91" + phoneNumbers.toString();
        param.message = message.replace(/&/g, "%26");
        param.otp = otp;
        param.sender = "BEUSLN";
        for (var key in param) {
            request += key + "=" + encodeURI(param[key]) + "&";
        }
        request = encodeURI(request.substr(0, request.length - 1));
        var retryUrl = "https://control.msg91.com/api/retryotp.php?authkey=164034A93iTmJcMu595dd01d&mobile=91" + phoneNumbers.toString() + "&retrytype=" + retry;
        var realUrl = !retry ? ("https://control.msg91.com/api/sendotp.php?" + request) : retryUrl;
        console.log(realUrl);
        return realUrl;
    },

    getFreebiesRedeemedPercentage: function(subtotal, paymentMethod, tax) {
        if ((subtotal < 423 && tax > 0) || (subtotal < 500 && tax == 0)) return paymentMethod == 5 ? 0 : 0;
        else if ((subtotal <= 847 && tax > 0) || (subtotal < 1000 && tax == 0)) return paymentMethod == 5 ? (5000 / subtotal) : (2500 / subtotal);
        else if ((subtotal <= 1694 && tax > 0) || (subtotal < 2000 && tax == 0)) return paymentMethod == 5 ? (10000 / subtotal) : (5000 / subtotal);
        else if ((subtotal <= 4237 && tax > 0) || (subtotal < 5000 && tax == 0)) return paymentMethod == 5 ? (20000 / subtotal) : (10000 / subtotal);
        else return paymentMethod == 5 ? (50000 / subtotal) : (25000 / subtotal);
    },

    getFreebiesRedeemedPercentageSuggestion: function(subtotal, paymentMethod, tax) {
        var advanceSlab = 0,
            moreNeeded = 0;
        if ((subtotal < 423 && tax > 0) || (subtotal < 500 && tax == 0)) {
            moreNeeded = (tax > 0 ? 423 : 500) - subtotal;
            advanceSlab = paymentMethod == 5 ? "₹ 50" : "₹ 25";
        } else if ((subtotal < 847 && tax > 0) || (subtotal < 1000 && tax == 0)) {
            moreNeeded = (tax > 0 ? 847 : 1000) - subtotal;
            advanceSlab = paymentMethod == 5 ? "₹ 100" : "₹ 50";
        } else if ((subtotal < 1694 && tax > 0) || (subtotal < 2000 && tax == 0)) {
            moreNeeded = (tax > 0 ? 1694 : 2000) - subtotal;
            advanceSlab = paymentMethod == 5 ? "₹ 200" : "₹ 100";
        } else if ((subtotal < 4237 && tax > 0) || (subtotal < 5000 && tax == 0)) {
            moreNeeded = (tax > 0 ? 4237 : 5000) - subtotal;
            advanceSlab = paymentMethod == 5 ? "₹ 500" : "₹ 250";
        }
        if(tax > 0)moreNeeded = moreNeeded * (1+tax/100);
        if (advanceSlab == 0) return "";
        else return "Save " + advanceSlab + " On Your Total Bill By Adding Service Of ₹ " + parseInt(moreNeeded) + "";
    },


    getPercentageCashback: function(paymentMethod, count, isCorporate) {
        var percent = paymentMethod == 5 ? 10 : 5;
        // if (percent == 100 && isCorporate) percent = 200;
        // if (percent == 50 && isCorporate) percent = 100;
        // var secondPercent = paymentMethod == 5 ? 20 : 10;
        return count == 0 ? percent : percent;
    },

    parseUserServiceAvailable: function(s) {
        return {
            expiryDate: s.expiryDate,
            parlorName: s.parlorName,
            parlorAddress: s.parlorAddress,
            parlorRating: s.rating,
            parlorId: s.parlorId,
            type: "paidService",
            services: _.map(s.services, function(se) {
                return {
                    serviceCode: se.serviceCode,
                    name: se.name,
                    serviceName: se.serviceName,
                    quantity: se.quantity,
                    productId: se.productId,
                    brandProductDetail: se.brandProductDetail,
                    brandId: se.brandId,
                    price: se.price,
                    actualPrice: se.actualPrice,
                };
            })
        };
    },

    sendIonicNotification: function(firebaseId, title, body, type, apptId, callback) {
        var FCM = require('fcm-push');
        var serverKey = 'AAAA62PmGR4:APA91bG4uTuL789t2XZqDSalketgxqVIRh00ueBnUnCUSuQWNupN-fWTJJhUGG8LfmxNr_M2IYtpBldHLAaeJs_fpjYAxMRGrBhaCcPzah586CohbsIggmXSMstICLkUPIFlqVZabLXh';
        var fcm = new FCM(serverKey);

        var message = {
            to: firebaseId, // required fill with device token or topics
            collapse_key: 'your_collapse_key',
            data: {
                "type": type,
                "title": title,
                "msg": body,
                "targetId": apptId,
            },

        };

        fcm.send(message, function(err, response) {
            if (err) {
                console.log(err)
                return callback(err, null)
                console.log("notification erroir")
            } else {
                console.log(response)
                return callback(null, response);
                console.log("hurraayyyy succcesssss")
            }
        });
    },

    sendIonicNotification2: function(firebaseId, title, body, type, draw, callback) {
        var FCM = require('fcm-push');
        var serverKey = 'AAAA62PmGR4:APA91bG4uTuL789t2XZqDSalketgxqVIRh00ueBnUnCUSuQWNupN-fWTJJhUGG8LfmxNr_M2IYtpBldHLAaeJs_fpjYAxMRGrBhaCcPzah586CohbsIggmXSMstICLkUPIFlqVZabLXh';
        var fcm = new FCM(serverKey);

        var message = {
            to: firebaseId, // required fill with device token or topics
            collapse_key: 'your_collapse_key',
            data: {
                "type": type,
                "title": title,
                "msg": body,
                // "targetId": apptId,
            },

        };


        fcm.send(message, function(err, response) {
            if (err) {
                console.log(err)
                return callback(err, null)
            } else {
                console.log(response)
                return callback(null, response);
            }
        });
    },
    sendIonicNotificationToMany: function(firebaseId, data, callback) {
        var FCM = require('fcm-push');
        var serverKey = 'AAAA62PmGR4:APA91bG4uTuL789t2XZqDSalketgxqVIRh00ueBnUnCUSuQWNupN-fWTJJhUGG8LfmxNr_M2IYtpBldHLAaeJs_fpjYAxMRGrBhaCcPzah586CohbsIggmXSMstICLkUPIFlqVZabLXh';
        var fcm = new FCM(serverKey);
        var message = {
            to: firebaseId, // required fill with device token or topics
            collapse_key: 'your_collapse_key',
            data: data

        };
        fcm.send(message, function(err, response) {
            if (err) {
                return callback(err, null)
                console.log(err)
            } else {
                return callback(null, response);
                console.log(response)
            }
        });
    },
    sendIonicNotificationAll: function(firebaseId, title, body, apptId, type, callback) {
        var FCM = require('fcm-push');
        var serverKey = 'AAAA62PmGR4:APA91bG4uTuL789t2XZqDSalketgxqVIRh00ueBnUnCUSuQWNupN-fWTJJhUGG8LfmxNr_M2IYtpBldHLAaeJs_fpjYAxMRGrBhaCcPzah586CohbsIggmXSMstICLkUPIFlqVZabLXh';
        var fcm = new FCM(serverKey);
        var message = {
            to: firebaseId, // required fill with device token or topics
            collapse_key: 'your_collapse_key',
            data: {
                "type": type,
                "title": title,
                "msg": body,
                "targetId": apptId,
            },

        };

        fcm.send(message, function(err, response) {
            if (err) {
                return callback(err, null)
            } else {
                return callback(null, response);
            }
        });
    },

    sendAppNotificationOps : function (firebaseId, title, body, type, callback){
        var FCM = require('fcm-push');
        var serverKey = 'AAAAZbPHYWI:APA91bEITFktmuaEPyZHG2lAZ3ERnqYnf2KRIYmaH55zD-5DY8xVRTDZpfhzTznPMwuR-B7dgWB00xa1eUbJdPbWTZqNjPqxBXRL9h2lVt2yQ1khh5T98zUSPm7N6NW2oMBPLTsD1oVz_YYS8mtQ0hm8I_pkTB-0kQ';
        var fcm = new FCM(serverKey);
        console.log("fcmmmm" , fcm)
        var message = {
            registration_ids: firebaseId, // required fill with device token or topics
            collapse_key: 'your_collapse_key',
            data: {
                    "type": type,
                    "title": title,
                    "msg": body
                },
        };
        fcm.send(message, function(err, response) {
            console.log("android " + err)
            console.log("android " + response)
            if (err) {
                return callback(err, null)
            } else {
                return callback(null, 'SuccessAndroid');
            }
        });
    },

    sendIOSNotificationOnEmployeeApp : function(firebaseId , title , body, type , callback){
        var FCM = require('fcm-push');
        var serverKey = 'AAAA62PmGR4:APA91bG4uTuL789t2XZqDSalketgxqVIRh00ueBnUnCUSuQWNupN-fWTJJhUGG8LfmxNr_M2IYtpBldHLAaeJs_fpjYAxMRGrBhaCcPzah586CohbsIggmXSMstICLkUPIFlqVZabLXh';
        var fcm = new FCM(serverKey);
        var message = {
            to: firebaseId, // required fill with device token or topics
            priority: "high",
            notification: {
                title: title,
                body: body,
                type: type,
                sound: "default"
            }
        };
        fcm.send(message, function(err, response) {
           console.log("ios response" + response);
            if (err) {
                return callback(err, null)
            } else {
                return callback(null, 'Success IOS');
            }
        });
    },

    getServiceDetail2: function(ser, parlorServices) {
        var data = _.map(ser, function(s) {
            var parlorService = _.filter(parlorServices, function(ps) { return ps.serviceCode == s.serviceCode })[0];
            if (parlorService) {
                return {
                    serviceCode: s.serviceCode,
                    name: parlorService.name,
                    gender: parlorService.gender,
                };
            } else {
                return null;
            }
        });
        return _.filter(data, function(d) { return !_.isEmpty(d); });
    },

    getSubscriptionStartEndDate(subscriptionBuyDate, subscriptionValidity){
        subscriptionBuyDate.setHours(0)
        subscriptionBuyDate.setMinutes(0)
        subscriptionBuyDate.setSeconds(0)
        var valid = new Date(subscriptionBuyDate);
        var date = subscriptionBuyDate.getDate();
        date = date > 28 ? 28 : date;
        valid.setDate(date-1);
        valid.setHours(23);
        valid.setMinutes(59);
        
        valid = HelperService.addMonthsToGivenDate(valid, subscriptionBuyDate < ConstantService.getSubscriptionModelChangeDate() ?subscriptionValidity - 1 :subscriptionValidity )

        var monthlyBalanceStart = new Date(subscriptionBuyDate);
        let monDiff =  HelperService.getMonthDifferenceBtwDates2(subscriptionBuyDate, new Date())
        if(subscriptionBuyDate.getDate()>new Date().getDate())monDiff -= 1;
        if(subscriptionBuyDate < ConstantService.getSubscriptionModelChangeDate()){
            monthlyBalanceStart.setMonth(new Date().getMonth());
        }else{
            monthlyBalanceStart.setMonth(subscriptionBuyDate.getMonth()+monDiff);
        }
        
        monthlyBalanceStart.setDate(date)

        var monthlyBalanceEnd = new Date(monthlyBalanceStart);

        // monthlyBalanceEnd.setDate(date-1);
        monthlyBalanceEnd.setMonth(monthlyBalanceEnd.getMonth()+1)
        monthlyBalanceEnd = new Date(monthlyBalanceEnd.getTime() - (1  * 1000));

        if(subscriptionBuyDate < ConstantService.getSubscriptionModelChangeDate()){
            monthlyBalanceStart = HelperService.getFirstDateOfByDate(new Date());
            monthlyBalanceEnd = HelperService.getLastDateOfByDate(new Date());
        }

        return {startDate : subscriptionBuyDate, validTill : valid, monthlyBalanceStart : monthlyBalanceStart, monthlyBalanceEnd : monthlyBalanceEnd}
    },

    getDepartmentString: function(gender, allDepartments) {
        var departments = "",
            brands = "LOreal, Sara, O3 Plus",
            key = 0;
        if (gender == 1) {
            if (allDepartments[1].gender == "F") {
                key = 1;
            }
        }
        _.forEach(allDepartments[key].departments, function(d) {
            if (departments != "") departments += ", ";
            departments += d.name;
        });
        return { departments: departments, brands: brands };
    },

    getDealGender: function(ser) {
        var g = "";
        _.forEach(ser, function(s, key) {
            if (key == 0) g = s.gender ? s.gender : "M";
            else if (s.gender != g && g.length == 1) g += s.gender;
        });
        if (g == "FM") g = "MF";
        return g;
    },

    populateServiceDeals: function(gender, allServices, service, deals, realServices) {
        var d = [];
        var realBrand = realServices.prices[0].brand;
        service.dealId = null;
        var basePrice = service.prices[0].price;
        service.price = service.prices[0].price;
        if (service.prices[0].brand.brands.length > 0) service.prices[0].brand.title = realBrand.title;
        _.forEach(service.prices[0].brand.brands, function(b) {
            b.price = parseInt(basePrice * b.ratio);
            service.price = b.price;
            var rbrand = _.filter(realBrand.brands, function(sbrand) { return sbrand.brandId + "" == b.brandId + "" })[0];
            if (rbrand) {
                b.productTitle = rbrand.productTitle;
            } else {
                b.ratio = 0;
            }
            _.forEach(b.products, function(p) {
                p.price = parseInt(basePrice * p.ratio);
                service.price = p.price;
            });
        });
        service.prices[0].brand.brands = _.filter(service.prices[0].brand.brands, function(b) {
            b.products = _.filter(b.products, function(p) { return p.ratio != 0; });
            return b.ratio != 0;
        });
        _.forEach(deals, function(s) {
            if (_.some(s.services, function(ser) { return ser.serviceCode === service.serviceCode; })) {
                var obj = ParlorService.getDealObj2(s);
                if (s.menuPrice > 0) {
                    var isValid = true;
                    if (service.prices[0].additions.length == 0 && obj.dealType.price >= basePrice) isValid = false;
                    if ((obj.dealType.name == 'dealPrice' || obj.dealType.name == 'chooseOne' || obj.dealType.name == 'chooseOnePer') && isValid) {
                        service.dealId = obj.dealId;
                        service.dealType = obj.dealType.name;
                        service.dealPrice = parseInt(obj.dealType.price);
                        service.menuPrice = parseInt(obj.menuPrice);
                        service.dealWeekDay = obj.weekDay;
                        service.price = ParlorService.populateDealRatio(service.prices[0].brand.brands, obj, false, service.prices[0].price);
                    }
                }
            }
        });
        service.prices[0].brand.brands = _.sortBy(service.prices[0].brand.brands, 'price').reverse();
        service.prices[0].additions = ParlorService.populateAdditionsName(gender, service.prices[0].additions);
        return d;
    },

    populateAdditionsName: function(gender, additions) {
        var data = [];
        if (additions.length > 0) {
            if (additions[0].name == 'Length' && gender == "F") {
                data.push({
                    name: 'Length',
                    types: [],
                });
                _.forEach(additions[0].types, function(a, key) {
                    if (key < 5) {
                        data[0].types.push({
                            name: a.name,
                            additions: a.additions,
                            imageUrl: ParlorService.getLengthImageUrl(key, false),
                        });
                    }
                });
            } else if (additions[0].name == 'Color Length') {
                data.push({
                    name: 'Color Length',
                    types: [],
                });
                _.forEach(additions[0].types, function(a, key) {
                    if (key < 2) {
                        data[0].types.push({
                            name: a.name,
                            additions: a.additions,
                            imageUrl: ParlorService.getLengthImageUrl(key, true),
                        });
                    }
                });
            } else if (additions[0].name == 'Shampoo Length') {
                data.push({
                    name: 'Shampoo Length',
                    types: [],
                });
                _.forEach(additions[0].types, function(a, key) {
                    if (key < 2) {
                        data[0].types.push({
                            name: a.name,
                            additions: a.additions,
                            imageUrl: ParlorService.getLengthImageUrl(key + 2, false),
                        });
                    }
                });
            }
        }
        return data;
    },

    getLengthImageUrl: function(key, rootTouchUp) {
        var data = [
            "http://res.cloudinary.com/dyqcevdpm/image/upload/v1498816783/hair_length_vectors_1_ozgqyd.png",
            "http://res.cloudinary.com/dyqcevdpm/image/upload/v1498816857/hair_length_vectors_2_nfnikt.png",
            "http://res.cloudinary.com/dyqcevdpm/image/upload/v1498816910/hair_length_vectors_3_gzrmvt.png",
            "http://res.cloudinary.com/dyqcevdpm/image/upload/v1498817014/hair_length_vectors_4_7_xpn5vx.png",
            "http://res.cloudinary.com/dyqcevdpm/image/upload/v1498817055/hair_length_vectors_5_a3zw66.png",
        ];
        var rootTouchUpImages = ["http://res.cloudinary.com/dyqcevdpm/image/upload/v1498817101/root_touch_up_vectors_1_hzg0cf.png", "http://res.cloudinary.com/dyqcevdpm/image/upload/v1498817160/root_touch_up_vectors_2_ztzjef.png"];
        return rootTouchUp ? rootTouchUpImages[key] : data[key];
    },


    populateDealRatio: function(brands, obj, needPrice, serviceBasePrice) {
        _.forEach(brands, function(brand) {
            var brandInDeals = _.filter(obj.brands, function(b) { return b.brandId + "" == brand.brandId + "" })[0];
            if (brandInDeals) {
                if (!needPrice) brand.dealRatio = brandInDeals.ratio;
                _.forEach(brand.products, function(product) {
                    var productInDeals = _.filter(brandInDeals.products, function(p) { return p.productId + "" == product.productId + "" })[0];
                    if (productInDeals) {
                        if (!needPrice) product.dealRatio = productInDeals.ratio;
                    }
                    if (needPrice) {
                        var serviceProductPrice = Math.ceil(serviceBasePrice * product.ratio);
                        product.price = productInDeals ? ParlorService.calculatePrice(productInDeals.ratio, obj, serviceProductPrice) : serviceProductPrice;
                        product.menuPrice = productInDeals ? parseInt(productInDeals.ratio * obj.menuPrice) : serviceProductPrice;
                    }
                });
            } else {
                _.forEach(brand.products, function(pro) {
                    pro.price = pro.ratio * serviceBasePrice;
                    pro.menuPrice = parseInt(pro.ratio * serviceBasePrice);
                });
            }
            if (needPrice) {
                var servicePrice = Math.ceil(serviceBasePrice * brand.ratio);
                brand.price = brandInDeals ? ParlorService.calculatePrice(brandInDeals.ratio, obj, servicePrice) : servicePrice;
                brand.menuPrice = brandInDeals ? parseInt(brandInDeals.ratio * obj.menuPrice) : servicePrice;
            }
        });
        return brands.length == 0 ? ParlorService.calculatePrice(1, obj, serviceBasePrice) : serviceBasePrice;
    },

    calculatePrice: function(ratio, obj, servicePrice) {
        var perRatio = obj.dealType.price * ratio;
        if (obj.dealType.name == "chooseOnePer") {
            return Math.ceil((servicePrice * (100 - perRatio)) / 100);
        } else return Math.ceil(perRatio);
    },

    populateAllPackages: function(service, combos, deals, allServices) {
        var data = [];
        _.forEach(combos, function(combo) {
            _.forEach(combo.deals, function(c) {
                _.forEach(c.selectors, function(selector) {
                    _.forEach(selector.services, function(s) {
                        if (s.serviceCode == service.serviceCode) {
                            data.push(ParlorService.populatePackagePrice(c, deals, allServices));
                        }
                    });
                });
                if (!c.newCombo) c.newCombo = [];
                _.forEach(c.newCombo, function(combo) {
                    if (_.filter(combo.serviceIds, function(ser) { return ser + "" == service.serviceId + "" })[0]) {
                        data.push(ParlorService.populatePackagePrice(c, deals, allServices));
                    }

                });
            });
        });
        return data;
    },

    populatePackagePrice: function(combo, deals, allServices) {
        _.forEach(combo.selectors, function(selector) {
            _.forEach(selector.services, function(service) {
                ParlorService.populateServicePrice(service, allServices);
                _.forEach(deals, function(s) {
                    if (_.some(s.services, function(ser) { return ser.serviceCode == service.serviceCode; })) {
                        var obj = ParlorService.getDealObj2(s);
                        if (s.menuPrice > 0) {
                            if (obj.dealType.name == 'dealPrice' || obj.dealType.name == 'chooseOne' || obj.dealType.name == 'chooseOnePer') {
                                service.price = ParlorService.populateDealRatio(service.brands, obj, true, service.price);
                                service.menuPrice = parseInt(obj.menuPrice);
                            }
                        }
                    }
                });
            });
            selector.services = _.filter(selector.services, function(s) {
                return s.price;
            });
        });
        return combo;
    },

    populateServicePrice: function(service, allServices) {
        _.forEach(allServices, function(r) {
            var currentService = _.filter(r.services, function(s) { return s.serviceCode == service.serviceCode })[0];
            if (currentService) {
                service.price = currentService.prices[0].price;
                service.menuPrice = currentService.prices[0].price;
                service.employees = _.map(currentService.prices[0].employees || [], function(e) {
                    return {
                        employeeId: e.userId,
                        name: e.name,
                    }
                });
                _.forEach(service.brands, function(brand) {
                    var present = false;
                    _.forEach(currentService.prices[0].brand.brands, function(b) {
                        if (b.brandId + "" == brand.brandId + "") {
                            present = true;
                            brand.ratio = b.ratio;
                            brand.price = Math.ceil(b.ratio * service.price);
                            brand.menuPrice = Math.ceil(b.ratio * service.price);
                            _.forEach(brand.products, function(product) {
                                var productPresent = false;
                                _.forEach(b.products, function(p) {
                                    if (p.productId + "" == product.productId + "") {
                                        productPresent = true;
                                        product.ratio = p.ratio;
                                        product.price = Math.ceil(p.ratio * service.price);
                                        product.menuPrice = Math.ceil(p.ratio * service.price);
                                    }
                                });
                                if (!productPresent) product.ratio = 0;
                            });
                            brand.products = _.filter(brand.products, function(pro) { return pro.ratio });
                        }
                    });
                    if (!present) brand.ratio = 0;
                });
                service.brands = _.filter(service.brands, function(brand) { return brand.ratio });
                service.brands = _.sortBy(service.brands, [function(o) { return o.price; }]).reverse();
            }
        });
    },

    getServiceUpgrades: function(allServices, service) {
        var data = [];
        if (service.upgradeType) {
            if (service.upgradeType == 'service') {
                ParlorService.populateUpgradeByServiceBrand(false, allServices, service, data);
            } else if (service.upgradeType == 'brand') {
                ParlorService.populateUpgradeByServiceBrand(true, allServices, service, data);
            } else if (service.upgradeType == 'subCategory') {
                ParlorService.populateUpgradeBySubcategory(allServices, service, data);
            }
        }
        return data;
    },

    getFinalPackageObj: function(p) {
        return {
            dealId: p.dealId,
            parlorDealId: p.parlorDealId,
            name: p.name,
            description: p.description,
            shortDescription: p.shortDescription,
            menuPrice: p.menuPrice,
            price: p.price,
            gender: p.gender,
            dealSort: p.dealSort,
            dealPrice: p.dealPrice,
            slabId: p.slabId,
            dealType: p.dealType,
            parlorTypes: p.parlorTypes,
            newCombo: p.newCombo,
            selectors: p.selectors,
        };
    },

    parseAllPackage: function(results, isMain, cityId) {
        return _.map(results, function(d) {
            return {
                name: d.name,
                        dealId: d.dealId,
                        parlorDealId: d.parlorDealId,
                        name: d.name,
                        type: d.type,
                        description: d.description,
                        shortDescription: d.shortDescription || d.description,
                        menuPrice: d.menuPrice,
                        price: d.price,
                        gender: d.gender,
                        dealSort: d.dealSort,
                        dealPrice: d.dealPrice,
                        slabId: d.slabId,
                        categoryId : 1,
                        dealType: d.dealType,
                        allHairLength: d.allHairLength,
                        newCombo: isMain ? d.newCombo : [],
                        dealsCategory: d.dealsCategory,
                        selectors: _.sortBy(ParlorService.getServiceSelectors(d.services, d.dealType, null, null, null, [], cityId), [function(o) { return o.showToUser; }])
            };
        });
    },

    parseDealsHomePage: function(results, isMain, cityId) {
        return _.map(results, function(r) {
            return {
                name: r.name,
                categoryId: r.categoryId,
                deals: _.map(r.deals, function(d) {
                    var parlorTypes = []
                    if (d.parlorTypesDetail != null && d.parlorTypesDetail.length > 0) {
                        parlorTypes = ParlorService.parseParlorTypes(d.parlorTypesDetail[0].parlorPrice || []);
                    }
                    return {
                        dealId: d.dealId,
                        categoryId : d.categoryId,
                        parlorDealId: d.parlorDealId,
                        name: d.name,
                        type: d.type,
                        description: d.description,
                        shortDescription: d.shortDescription || d.description,
                        menuPrice: d.menuPrice,
                        price: d.price,
                        gender: d.gender,
                        dealSort: d.dealSort,
                        dealPrice: d.dealPrice,
                        slabId: d.slabId,
                        dealType: d.dealType,
                        allHairLength: d.allHairLength,
                        parlorTypes: parlorTypes,
                        newCombo: isMain ? d.newCombo : [],
                        dealsCategory: d.dealsCategory,
                        selectors: _.sortBy(ParlorService.getServiceSelectors(d.services, d.dealType, null, null, null, parlorTypes, cityId), [function(o) { return o.showToUser; }])
                    }
                }),
            };
        });
    },

    parseParlorTypes: function(parlorTypes) {
        return _.map(parlorTypes, function(p) {
            return {
                type: p.type,
                startAt: p.startAt,
                save: p.percent,
            };
        });
    },

    getServiceSelectors: function(services, dealType, title, type, serviceTitle, parlorTypes, cityId) {
        if (dealType == 'newCombo' && !title) return [];
        if (dealType == 'combo') {
            return _.map(services, function(s) {
                return ParlorService.populateService([s], s.name, type, serviceTitle, parlorTypes, cityId);
            });
        } else {
            var obj = ParlorService.populateService(services, title, type, serviceTitle, parlorTypes, cityId);
            return dealType == 'newCombo' ? obj : [obj];
        }
    },

    getParlorTypesDetailService: function(parlorTypesDetailService, cityId) {
        var obj = [];
        if (parlorTypesDetailService) {
            var cityWisePrice = _.filter(parlorTypesDetailService, function(pp) { return pp.cityId == cityId })[0];
            if (cityWisePrice) {
                obj = _.map(cityWisePrice.parlorPrice, function(p) {
                    return {
                        startAt: p.startAt,
                        type: p.type,
                        save: p.percent,
                    };
                });
            }
        }
        return obj;
    },

    populateService: function(services, title, type, serviceTitle, parlorTypes, cityId) {
        var showToUser = true;
        var serviceTitle2 = "Select Service";
        // var parlorTypes = ParlorService.parseParlorTypes(parlorTypesDetail || []);
        var description = "";
        if (services.length == 1) serviceTitle2 = services[0].name;
        var obj2 = {
            title: title || 'Select Service',
            type: type || 'service',
            serviceTitle: title || 'Select Service',
            showToUser: showToUser,
            description: description,
            services: _.map(services, function(s) {
                description = s.serviceDescription;
                if (!s.brand) s.brand = {};
                var obj = {
                    name: s.name,
                    categoryId: s.categoryId,
                    serviceCode: s.serviceCode,
                    serviceId: s.serviceId,
                    subTitle: s.subTitle || "",
                    brandTitle: s.brand.title || "Brand",
                    brands: [],
                    parlorTypes: ParlorService.getParlorTypesDetailService(s.parlorTypesDetailService, cityId) || [],
                };
                if (s.brand.brands.length > 0) {
                    _.forEach(s.brand.brands, function(o) {
                        var brandParlorTypes = _.filter(o.parlorTypes, function(pr) { return pr.cityId == cityId })
                        var pp = {};
                        var lowest = _.filter(o.lowest, function(pr) { return pr.cityId == cityId })
                        var saveUpto = _.filter(o.saveUpto, function(pr) { return pr.cityId == cityId })
                        
                        if (o.products.length > 0) {
                            pp.productTitle = o.productTitle,
                                pp.brandId = o.brandId,
                                // pp.maxSaving =o.maxSaving,
                                pp.popularChoice = o.popularChoice,
                                pp.brandName = o.name,
                                pp.lowest = lowest[0].startAt || 800,
                                pp.saveUpto = saveUpto[0].percent || 50,
                                pp.parlorTypes = brandParlorTypes[0] ? brandParlorTypes[0].parlorPrice || [] : [],
                                pp.products = []
                            _.forEach(o.products, function(pro) {
                                var productParlorTypes = _.filter(pro.parlorTypes, function(pr) { return pr.cityId == cityId })
                                console.log("=----------" , s.serviceCode)
                                console.log("parlorTypes", parlorTypes)
                                var products = {
                                    productId: pro.productId,
                                    popularChoice: pro.popularChoice,
                                    productName: pro.name,
                                    parlorTypes: productParlorTypes[0].parlorPrice || []
                                };
                                pp.products.push(products)
                            })
                        } else {

                            pp.productTitle = o.productTitle,
                                pp.brandId = o.brandId,
                                // pp.maxSaving =o.maxSaving,
                                pp.popularChoice = o.popularChoice,
                                pp.brandName = o.name,
                                pp.parlorTypes = brandParlorTypes[0] ? brandParlorTypes[0].parlorPrice || [] : [],
                                pp.lowest = lowest[0] ? lowest[0].startAt || 800 : 800,
                                pp.saveUpto = saveUpto[0] ? saveUpto[0].percent || 50 : 50,
                                pp.products = []
                        }
                        obj.brands.push(pp)
                    })

                }
                if (obj.brands.length == 0) showToUser = false;
                if (title) obj.subTitle = s.subTitle
                return obj;
            }),
        };

        obj2.showToUser = obj2.services.length > 1 ? true : showToUser;
        obj2.description = description;
        return obj2;
    },

    populateUpgradeBySubcategory: function(allServices, service, data) {
        _.forEach(allServices, function(aser) {
            var res = _.filter(aser.services, function(s) { return s.serviceId + "" == service.serviceId + "" })[0];
            if (res) {
                ParlorService.populateSelectorByBrands(aser, data, false, service.subTitle, true);
            }
        });
    },

    populateSelectorByBrands: function(aser, data, populateAll, subTitle, populatePrice) {
        var newServices = _.chain(aser.services)
            .groupBy('subTitle')
            .map(function(val, key) {
                return {
                    subTitle: key,
                    services: val
                };
            }).value();
        var found = populateAll ? true : false;
        _.forEach(newServices, function(ser) {
            if (found) {
                ParlorService.addBrandService(ser, data, populateAll, populatePrice);
            }
            if (!found && ser.subTitle == subTitle) found = true;
        });
    },

    addBrandService: function(ser, data, populateAll, populatePrice) {
        var selectors = [];
        var brands = [];
        var price = 0;
        _.forEach(ser.services, function(s) {
            if (populatePrice) price = populateAll ? s.price : s.prices[0];
            if (!populateAll && price.brand.brands.length > 0) {
                ParlorService.updateBrands(price.brand.brands, brands, populateAll, populatePrice);
            } else {
                ParlorService.updateBrands(s.brands, brands, populateAll, populatePrice);
            }
        });
        var realPrice = Math.ceil(ParlorService.populateServiceByBrand(brands, ser, populateAll, populatePrice));
        data.push({
            name: ser.subTitle,
            detail: 'Upgrade to ' + ser.subTitle,
            price: realPrice,
            save: 60,
            selectors: [{
                title: 'Select Brand',
                type: 'subCategory',
                brands: brands,
            }],
        });
    },

    updateBrandParlorTypes: function(brand, serviceParlorTypes) {
        if (brand.parlorTypes) {
            _.forEach(serviceParlorTypes, function(s) {
                var found = false;
                _.forEach(brand.parlorTypes, function(b) {
                    if (b.type == s.type) {
                        found = true;
                        if (b.startAt > s.startAt) {
                            b.startAt = s.startAt;
                            b.save = s.save;
                            b.type = s.type;
                        }
                    }
                });
                if (!found) {
                    brand.parlorTypes.push(s);
                }
            });
        }
    },

    populateServiceByBrand: function(brands, ser, populateAll, populatePrice) {
        var showPrice = 0,
            priceDecided = false;
        _.forEach(ser.services, function(s) {
            var price = populateAll ? s.price : s.prices[0];
            var tax = populateAll ? s.tax : s.prices[0].tax;
            var estimatedTime = populateAll ? s.estimatedTime : s.prices[0].estimatedTime;
            var priceId = populateAll ? s.price : s.prices[0];
            var realPrice = populateAll ? price : price.price;
            var originalPrice = populateAll ? price : price.price;
            if (!priceDecided) showPrice = realPrice;
            var currentServiceBrand = populateAll ? s.brands : price.brand.brands;
            if (!populatePrice) price = {};
            if (currentServiceBrand.length > 0) {
                _.forEach(currentServiceBrand, function(brand) {
                    _.forEach(brands, function(b) {
                        if (b.brandId + "" == brand.brandId + "") {
                            if (brand.products.length > 0) {
                                realPrice = brand.products[0].price;
                            } else {
                                realPrice = brand.price;
                            }
                            if (!priceDecided) {
                                showPrice = s.dealId ? s.dealPrice : realPrice;
                                priceDecided = true;
                            }
                            b.price = s.dealId ? s.dealPrice : realPrice;
                            ParlorService.updateBrandParlorTypes(b, s.parlorTypes);
                            var realP = s.dealId ? s.dealPrice : realPrice;
                            if ((populatePrice && realP) || !populatePrice) {
                                b.products[0].services.push({
                                    name: s.name,
                                    tax: tax,
                                    parlorTypes: s.parlorTypes,
                                    estimatedTime: estimatedTime,
                                    priceId: price ? price.priceId : 1,
                                    menuPrice: s.menuPrice > realPrice ? parseInt(s.menuPrice) : realPrice,
                                    price: s.dealId ? s.dealPrice : realPrice,
                                    dealId: s.dealId,
                                    serviceCode: s.serviceCode,
                                    serviceId: s.serviceId,
                                    categoryId: s.categoryId,
                                    dealType: s.dealType
                                });
                            }
                        }
                    });
                });
            }
        });
        return showPrice;
    },

    // price.brand.brands, brands, populateAll, populatePrice

    updateBrands: function(serviceBrands, brands, populateAll) {
        var popularChoice = false
            // var parlorTypes = ParlorService.parseParlorTypes(d.parlorTypesDetail[0].parlorPrice || []);
        _.forEach(serviceBrands, function(s) {
            var present = _.filter(brands, function(b) { return b.brandId + "" == s.brandId + "" })[0];
            if (!present) {
                var productId = null;
                var productName = null;
                if (s.products.length > 0) {
                    productId = s.products[0].productId;
                    productName = s.products[0].productName;
                    popularChoice = s.products[0].popularChoice;
                    // parlorTypes = parlorTypes;
                }
                brands.push({
                    brandId: s.brandId,
                    maxSaving: s.maxSaving,
                    parlorTypes: [],
                    popularChoice: s.popularChoice,
                    lowest: s.lowest || 800,
                    saveUpto: s.saveUpto || 50,
                    brandName: populateAll ? s.brandName : s.name,
                    price: populateAll ? Math.ceil(s.price) : 0,
                    menuPrice: populateAll ? Math.ceil(s.menuPrice) : 0,
                    productTitle: 'Select Product',
                    products: [{
                        productId: productId,
                        productName: productName,
                        popularChoice: popularChoice,
                        services: [],
                    }]
                });
            }
        });
    },

    populateUpgradeByServiceBrand: function(isBrand, allServices, service, data) {
        var upgradeService;
        _.forEach(service.upgrades, function(upgradeServiceId) {
            _.forEach(allServices, function(aser) {
                var res = _.filter(aser.services, function(s) { return s.serviceId + "" == upgradeServiceId + "" })[0];
                if (res) upgradeService = res;
            });
            if (upgradeService) {
                var brand = '';
                if (isBrand) {
                    if (upgradeService.brand.brands.length > 0) {
                        brand = upgradeService.brand.brands[0].name;
                    }
                }
                /*if (upgradeService.serviceCode == 96)
                    console.log("upgradeService", upgradeService)*/
                data.push({
                    name: upgradeService.name,
                    detail: 'Pay 1000 more and save',
                    price: upgradeService.dealPrice ? upgradeService.dealPrice : parseInt(upgradeService.price),
                    menuPrice: upgradeService.menuPrice ? upgradeService.menuPrice : parseInt(upgradeService.price),
                    save: 60,
                    serviceId: upgradeServiceId,
                });
            }
        });
    },

    getDealObj: function(s) {
        var obj = {
            dealId: s.id,
            parlorDealId: s.dealId,
            name: s.name,
            category: s.category,
            description: s.description,
            shortDescription: s.shortDescription,
            menuPrice: s.menuPrice,
            dealPrice: s.dealPrice,
            tax: s.tax,
            brands: s.brands,
            dealPercentage: s.dealPercentage,
            weekDay: s.weekDay,
            dealType: s.dealType,
        };
        return obj;
    },

    getDealObj2: function(s) {

        var obj = {
            dealId: s.id,
            name: s.name,
            category: s.category,
            weekDay: s.weekDay,
            description: s.description,
            menuPrice: s.menuPrice,
            dealPrice: s.dealPrice,
            dealType: s.dealType,
            brands: s.brands
        };
        return obj;
    },

    getDealObj3: function(s) {

        var obj = {
            dealId: s._id,
            name: s.name,
            category: s.category,
            weekDay: s.weekDay,
            description: s.description,
            menuPrice: s.menuPrice,
            dealPrice: s.dealPrice,
            dealType: s.dealType,
            brands: s.brands
        };
        return obj;
    },



    getDiffForSettlement: function(startDate, endDate, discount) {
        console.log("all Dates for discount and etc...", startDate.getTime(), endDate.getTime(), (new Date(discount)).getTime())
        var days = 0
        if (discount.getTime() < endDate.getTime() && discount.getTime() > startDate.getTime()) {
            console.log("called 1")
            days = endDate.getDate() - discount.getDate() + 1;
        } else if (discount.getTime() < startDate.getTime()) {
            console.log("called 2")
            days = endDate.getDate() - startDate.getDate() + 1;
        } else if (discount.getTime() == startDate.getTime()) {
            console.log("called 3")
            days = endDate.getDate() - startDate.getDate() + 1;
        } 
        // else if (discount.getTime() > endDate.getTime() && discount.getTime() > startDate.getTime()) {
        //     console.log("called 3")
        //     days = endDate.getDate() - startDate.getDate();
        // } 
        else {
            days = 0;
        }
        return days
    },


    sendCheckInNotification: function(apptId) {

        var type = "checkin",
            title = "Tell your friends you're here!",
            body = "Check-in to our salons with Facebook to earn Rs 100 B-Cash & other special offers.";


        Appointment.find({ _id: apptId }, { "client.id": 1, parlorId: 1 }, function(err, appt) {
            console.log("parlorId", appt[0].parlorId)
            User.find({ _id: appt[0].client.id }, { firebaseId: 1, firebaseIdIOS: 1, firstname: 1 }, function(err, user) {
                if (user[0].firebaseId) {
                    Appointment.sendAppNotificationCheckIn(user[0].firebaseId, title, body, type, appt[0].parlorId, function(err, data) {
                        // return
                        console.log("chala")
                    })
                } else if (user[0].firebaseIdIOS) {
                    console.log("sahi aaya")
                    Appointment.sendAppNotificationIOSCheckIn(user[0].firebaseIdIOS, title, body, type, appt[0].parlorId, function(err, data) {
                        // return 
                    })
                }
            })
        })
    },

    sendCheckInNotificationCrm: function(userId, parlorId) {
        // console.log("sahi")

        var type = "checkin",
            title = "Tell your friends you're here!",
            body = "Check-in to our salons with Facebook to earn 100 freebie points & other special offers.";

        User.find({ _id: userId }, { firebaseId: 1, firebaseIdIOS: 1, firstname: 1 }, function(err, user) {
            if (user[0].firebaseId) {
                Appointment.sendAppNotificationCheckIn(user[0].firebaseId, title, body, type, parlorId, function(err, data) {
                    // return
                    // console.log("chala")
                })
            } else if (user[0].firebaseIdIOS) {
                Appointment.sendAppNotificationIOSCheckIn(user[0].firebaseIdIOS, title, body, type, parlorId, function(err, data) {
                    // return 
                })
            }
        })

    },


    sendLuckyDrawNotification: function(firebaseId, title, body, type) {
        var FCM = require('fcm-push');
        var serverKey = 'AAAA62PmGR4:APA91bG4uTuL789t2XZqDSalketgxqVIRh00ueBnUnCUSuQWNupN-fWTJJhUGG8LfmxNr_M2IYtpBldHLAaeJs_fpjYAxMRGrBhaCcPzah586CohbsIggmXSMstICLkUPIFlqVZabLXh';
        var fcm = new FCM(serverKey);

        var message = {
            to: firebaseId, // required fill with device token or topics
            collapse_key: 'your_collapse_key',
            data: {
                "type": type,
                "title": title,
                "msg": body,
                // "targetId": apptId,
            },

        };

        fcm.send(message, function(err, response) {
            if (err) {
                console.log("notification error")
            } else {
                console.log("hurraayyyy succcesssss")
            }
        });
    },

};