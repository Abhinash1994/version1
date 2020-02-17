module.exports = {

    createAppointmentForAppUser: function(user, req, oldLoyalityPoints, callback){

    },

    getSubscriptionValidity(amount, referalCode){
        if(referalCode == "1MONTH")return 1;
        else if(referalCode == "3MONTH")return 3;
        else return 12;
    },

    getSubscriptionAmount(amount, referalCode, callback){
        var realAmount = 899;
        User.findOne({referCode : referalCode, subscriptionId : {$in : [1, 2]}}, {referCode : 1}, function(err, user){
            if(user){
                if(amount == 1699 || amount == 899 || amount == ConstantService.getEarlyBirdOfferGlodSubscriptionPriceTypeOne() || amount == ConstantService.getEarlyBirdOfferGlodSubscriptionPriceTypeTwo() )realAmount = amount == 1699 || amount == ConstantService.getEarlyBirdOfferGlodSubscriptionPriceTypeOne() || amount == ConstantService.getEarlyBirdOfferGlodSubscriptionPriceTypeTwo() ? 1699 : 899;
                else realAmount = amount == 1499 ? 1699 : 899;
            }else{
                realAmount = amount == 1699 || amount == ConstantService.getEarlyBirdOfferGlodSubscriptionPriceTypeThree() || amount == ConstantService.getEarlyBirdOfferGlodSubscriptionPriceTypeOne() || amount == ConstantService.getEarlyBirdOfferGlodSubscriptionPriceTypeTwo() ? 1699 : 899;
            }
            if(referalCode == "1MONTH" || referalCode == "3MONTH"){
                realAmount = 1699
            }
            return callback(realAmount);
        });
    },

    getSubscriptionAmountv4(userId, amount, newAppointmentObj, referalCode, callback){
        var realAmount = 899;
        if(referalCode == ConstantService.getSubscriptionPriceLessCoupon()){
            let priceRange = ConstantService.getPriceRangeForSubscriptionPrice()
            let newAmount = newAppointmentObj.subtotal * (1 + newAppointmentObj.parlorTax/100)
            let subscriptionAmount = 1699
            _.forEach(priceRange, function(p){
                if(p.subtotal<=newAmount){
                    subscriptionAmount = p.price
                    return false;
                }
            })
            if(subscriptionAmount == amount)realAmount = 1699
            return callback(realAmount);
        }else if(referalCode == "BEURENEW600" || referalCode == "BEURENEW500"|| referalCode == "BEURENEW200"){
            SubscriptionSale.findOne({userId : userId}).sort({createdAt : -1}).exec(function(err2, pastSubscription){
                let pastImageObj = HelperService.getNewSubscriptionPriceAfterExpire(pastSubscription)
                if(pastImageObj.offReferCode == referalCode){
                    subscriptionAmount = 1699 - pastImageObj.offValue
                }
                if(amount==subscriptionAmount){
                    return callback(1699)
                }else{
                    return callback(899)
                }
            })
        }else{
            User.findOne({referCode : referalCode, subscriptionId : {$in : [1, 2]}}, {referCode : 1}, function(err, user){
                if(user){
                    if(amount == 1699 || amount == 899 || amount == ConstantService.getEarlyBirdOfferGlodSubscriptionPriceTypeOne() || amount == ConstantService.getEarlyBirdOfferGlodSubscriptionPriceTypeTwo() )realAmount = amount == 1699 || amount == ConstantService.getEarlyBirdOfferGlodSubscriptionPriceTypeOne() || amount == ConstantService.getEarlyBirdOfferGlodSubscriptionPriceTypeTwo() ? 1699 : 899;
                    else realAmount = amount == 1499 ? 1699 : 899;
                }else{
                    realAmount = amount == 1699 || amount == ConstantService.getEarlyBirdOfferGlodSubscriptionPriceTypeOne() || amount == ConstantService.getEarlyBirdOfferGlodSubscriptionPriceTypeTwo() ? 1699 : 899;
                }
                return callback(realAmount);
            });
        }
        
    },

    getSubscriptionAmountByReferalCode(amount, referalCode, callback){
        var realAmount = 1699;
        User.findOne({referCode : referalCode.toUpperCase(), subscriptionId : {$in : [1, 2]}}, {referCode : 1}, function(err, user){
            console.log(user)
            if(user && referalCode){
                realAmount =1499;
                
            }else{
                realAmount = amount;
            }
            return callback(realAmount);
        });
    },

    populateAppointmentDetailForApp: function(taxRequired, paymentMethod, activemembership, totalAppointmentCount, user, blockedCredits, appointment, parlor, reed, couponCode) {
            var redeemableSubscriptionLoyality = reed, currentMonth = HelperService.getCurrentMonthNo(), activeMemberships = [];

            var obj = AppointmentHelperService.parseAppointmentForApp(appointment, parlor.tax, parlor, taxRequired);
            obj.homeServiceRange = parlor.homeServiceRange;
            obj.couponError = appointment.couponError;
            obj.flashCouponCode = appointment.flashCouponCode;
            obj.noOfAppointments = appointment.client.noOfAppointments;
            obj.parlorAddress2 = parlor.address2;
            var appointmentObj = {
                subtotal: obj.subtotal,
                loyalityOffer: obj.loyalityOffer,
                tax: obj.tax,
            };
            var redeemableLoyality = Appointment.maximumLoyalityRedeemtion(user, appointmentObj, 0, 5);
            var ll = appointment.loyalityPoints - appointment.loyalityOffer;
            if (appointment.buySubscriptionId && paymentMethod == 5) {
                redeemableSubscriptionLoyality = appointment.subscriptionAmount == 1699 || appointment.subscriptionAmount == 1499  || appointment.subscriptionAmount == 699  || appointment.subscriptionAmount == 1199   ? 500 : 200;
                // if(parlor.parlorType == 4)redeemableSubscriptionLoyality = 300;
            }
            if (activemembership) {
                activemembership.creditsLeft = activemembership.creditsLeft.toFixed(2);
                activeMemberships.push({
                    name: activemembership.name,
                    credits: activemembership.creditsLeft - blockedCredits < 0 ? 0 : activemembership.creditsLeft - blockedCredits,
                });
            } else {
                // obj.membershipSuggestion = HelperService.getMembershipSuggestionObj(obj.subtotal);

            }
            if (!user.subscriptionId && !appointment.buySubscriptionId) {
                
                let newAmount = obj.subtotal * (1 + parlor.tax/100)
                let moreAmountRequired = 0, subscriptionPrice = 1699, subscriptionPrice3 = 1699;
                let priceRange = ConstantService.getPriceRangeForSubscriptionPrice()
                _.forEach(priceRange, function(p, k){
                    if(p.subtotal<newAmount){
                        if(k==0){
                            moreAmountRequired = 0;
                            subscriptionPrice = p.price;
                        }else{
                            moreAmountRequired = parseInt(priceRange[k-1].subtotal - newAmount)
                            subscriptionPrice = priceRange[k-1].price;
                        }
                        subscriptionPrice3 = p.price;
                        return false;
                    }
                })
                obj.subscriptionSuggestion = HelperService.getSubscriptionSuggestionObj2(moreAmountRequired, subscriptionPrice, subscriptionPrice3, obj.subtotal, obj.loyalityPoints, user.createdAt, parlor.tax, parlor.earlyBirdOfferPresent, parlor.earlyBirdOfferType, parlor.parlorType);
            }
            obj.redeemableLoyality = redeemableLoyality;
            obj.usableMembership = activeMemberships;
            obj.redeemableSubscriptionLoyality = redeemableSubscriptionLoyality;
            if(redeemableSubscriptionLoyality){
                if(appointment.subtotal < 2000){
                    obj.subscriptionSpendMessage = 'Spend ₹ '+(2000 - appointment.subtotal)+' more and get 1 month FREE added to your SalonPass.'
                }
            }

            obj.usableLoyalityPoints = appointment.status == 1 ? user.loyalityPoints + ll  : user.loyalityPoints;
            if (appointment.status == 1 || appointment.status == 4) {
                // obj.loyalityPoints = newLoyalityPoints;
                obj.tax = Math.ceil((appointment.subtotal - obj.loyalityPoints) * (parlor.tax / 100));
                obj.payableAmount = Math.ceil((appointment.subtotal - obj.loyalityPoints) * (1 + parlor.tax / 100) - obj.creditUsed);
            }
            var percentage = ParlorService.getPercentageCashback(paymentMethod, totalAppointmentCount, user.isCorporateUser);
            obj.discountMessage = percentage != 0  ? ("Get " + percentage + "% Cashback On Your" + (percentage == 15 ? " Ist" : " ") + " " + (paymentMethod == 5 ? "Digital " : "Cash ") + " Payment!") : "";
            var freebie = Math.ceil(ParlorService.getFreebiesRedeemedPercentage(appointment.subtotal - appointment.loyalityOffer - appointment.couponLoyalityPoints, paymentMethod, appointment.tax) / 100 * (appointment.subtotal - appointment.loyalityOffer))
            obj.freebiesTerms = ((freebie > 0) ? "Use & Save ₹ " + freebie + "" : "");
            obj.suggestion = user.allow100PercentDiscount ? "Maximum 500 Points Can Be Used!" : ParlorService.getFreebiesRedeemedPercentageSuggestion(appointment.subtotal - appointment.loyalityOffer - appointment.couponLoyalityPoints, paymentMethod, appointment.tax);
            var getFreebies = Appointment.getFreebiesPoints(paymentMethod, appointment, totalAppointmentCount, true, user.isCorporateUser);
            
            var weekDate = HelperService.getNewWeekStart(14 , new Date());
            var d = new Date()
            var subscriptionDate = d.getDate()
            var endDate = subscriptionDate > 28 ? 28 : subscriptionDate
            if(appointment.buySubscriptionId){
                obj.subscriptionPopUpText = '<div style="text-align:center"><span style="font-size:1em;color:#757575;"> Your monthly cycle starts every '+HelperService.getNumberInString(subscriptionDate)+' of the month and ends every '+HelperService.getNumberInString(endDate)+' of the following month, <br><span style="font-size:1em;color: #4CAF50;font-weight: 700;">for next 12 months.</span></span></div>' 
            }
            if (user.subscriptionId && !appointment.buySubscriptionId) {
                obj.subscriptionPopUpText = '<div style="text-align:center"><span style="font-size:1em;color:#757575;"> Refer your friends to SalonPass and <br><span style="font-size:1em;color: #4CAF50;font-weight: 700;">earn Rs 200 for every referral.</span></span></div>' 
            }

            if (getFreebies.loyality > 0) {
                obj.alertMessage = ('Hey ' + appointment.client.name+',' + getFreebies.loyality + ' B-Cash') + ' will be credited to your account post appointment.';
            } else {
                obj.alertMessage = ('Hey ' + appointment.client.name + '') + ' thank you for your appointment.';
            }
            obj.membershipTax = parseInt(parseInt(appointment.membershipAmount / (1 + parlor.tax / 100)) * (parlor.tax / 100));
            obj.errorMessage = appointment.errorMessage ||  "";
            return obj;
    },

    parseAppointmentForApp: function(a, tax, parlor, taxRequired) {
        var newSubtotal = parseFloat(parseFloat(parseFloat(a.subtotal) - parseFloat(a.loyalityPoints) - parseFloat(a.creditUsed / (1 + tax / 100)) - parseFloat(a.membershipDiscount / (1 + tax / 100))).toFixed(2));
        var payableAmount = Math.ceil(newSubtotal * (1 + tax / 100));
        var obj = AppointmentHelperService.parseAppointmentServices(a, tax, taxRequired);
        obj.appointmentId = a.id;
        obj.parlorName = a.parlorName;
        // obj.happyHourDiscount = !a.parlorOffer ? parseInt(a.subtotal/(1-(a.appRevenueDiscountPercentage/100)))-a.subtotal : 0;
        obj.happyHourDiscount = a.appRevenueDiscountPercentage ? parseInt(a.subtotal/(1-(a.appRevenueDiscountPercentage/100)))-a.subtotal : 0;
        obj.membershipSuggestion = {};
        obj.payableAmount = payableAmount;
        obj.freebiesUsed = a.loyalityPoints - a.loyalityOffer;
        obj.parlorAddress = a.parlorAddress;
        obj.review = a.review;
        obj.creditUsed = parseFloat(parseFloat(a.creditUsed).toFixed(2));
        obj.parlorId = a.parlorId;
        var totalSavings = 0;
        var menuPrice = 0;
        _.forEach(obj.services, function(s) {
            var sav = s.actualDealPrice ? s.actualDealPrice : s.actualPrice;
            if (s.type != 'frequency') totalSavings += (sav - (s.price));
            else totalSavings += s.discount;
            menuPrice += s.actualPrice;
        });
        obj.totalSaved = parseInt(totalSavings);
        obj.packageDiscount = parseInt((menuPrice - totalSavings) - obj.subtotal);
        obj.parlorLatitude = parlor.latitude;
        obj.parlorLongitude = parlor.longitude;
        obj.openingTime = parlor.openingTime;
        obj.closingTime = parlor.closingTime;
        obj.currentTime = new Date();
        return obj;
    },

    parseAppointmentServices: function(a, tax, taxRequired){
        var discountFrequency = 0;let freeServiceLoyality = 0;
        _.forEach(a.services, function(s) {
            if (s.type == 'frequency') discountFrequency += s.discount;
            if(s.subtotal == 0)freeServiceLoyality += s.loyalityPoints;
        });
        return {
            appointmentId: a.id,
            subtotal: a.subtotal - discountFrequency,
            discount: a.discount,
            parlorTax : tax,
            paymentMethod: a.paymentMethod,
            couponCode: a.couponLoyalityCode,
            couponLoyalityPoints: a.couponLoyalityPoints,
            comment: a.comment,
            membershipAmount: a.membershipAmount,
            subscriptionAmount: a.subscriptionAmount,
            productAmount: a.productAmount,
            loyalitySubscription: taxRequired ? Math.ceil(a.loyalitySubscription * (1 + tax/100)) : a.loyalitySubscription,
            membershipDiscount: a.membershipDiscount.toFixed(2),
            membersipCreditsLeft: a.membersipCreditsLeft.toFixed(2),
            payableAmount: a.payableAmount,
            appointmentId: a.id,
            parlorId: a.parlorId,
            loyalityOffer: a.loyalityOffer-freeServiceLoyality,
            parlorAppointmentId: a.invoiceId,
            appointmentStatus: HelperService.getAppointmnetStatusValue(a.status),
            creditUsed: a.creditUsed.toFixed(2),
            tax: taxRequired ? a.tax + (a.loyalitySubscription * (tax/100)) : a.tax,
            status: a.status,
            isPaid: a.isPaid ? a.isPaid : false,
            startsAt: a.appointmentStartTime,
            estimatedTime: a.estimatedTime,
            loyalityPoints: a.loyalityPoints,
            services: AppointmentHelperService.populateServices(a.services),
            advanceCredits: a.useAdvanceCredits ? a.advanceCredits : 0,
        };
    },
  
    populateServices : function(services){
        var data = [],
            prevName = "";
        _.forEach(services, function(s) {
            if (prevName != s.name) {
                var price = s.price + s.additions;
                var obj = {
                    name: s.name,
                    serviceName: s.serviceName,
                price: s.type != 'frequency' ? price * s.quantity : price * (s.quantity - 1),
                    actualPrice: s.type != 'frequency' ? s.actualPrice * s.quantity : s.frequencyPrice * s.quantity,
                    quantity: s.quantity,
                    brandId: s.brandId,
                    productId: s.productId,
                    brandProductDetail: s.brandProductDetail,
                    serviceCode: s.serviceCode,
                    actualDealPrice: (s.actualDealPrice ? s.actualDealPrice : s.actualPrice) * s.quantity,
                    type: s.type,
                };
                data.push(obj);
            } else {
                data[data.length - 1].price += s.price;
                data[data.length - 1].actualPrice += s.actualPrice;
                data[data.length - 1].actualDealPrice += s.actualPrice;
            }
            if (s.type == "combo" || s.type == "newCombo")
                prevName = s.name;
            else prevName = "asdasd";
        });
        return data;
    },

    getSubscriptionCycleDates(buyDate){
        let d = new Date()
        let month = d.getDate()<buyDate.getDate() ? (d.getMonth()==0? 0:d.getMonth()-1) : (d.getMonth()==0? 0:d.getMonth())
        console.log(month)
        let startDate, endDate
        let syear = d.getMonth()==0? (d.getDate()<buyDate.getDate()?d.getFullYear()-1:d.getFullYear()):d.getFullYear()
        let eyear = d.getMonth()==11? (d.getDate()>buyDate.getDate()?d.getFullYear()+1:d.getFullYear()):d.getFullYear()
        startDate = buyDate.getDate()<=27 ? buyDate.getDate():27
        endDate = buyDate.getDate()<=27 ? buyDate.getDate():26
        if(d.getDate()==28||d.getDate()==29||d.getDate()==30||d.getDate()==31) month = d.getMonth()
        obj = {startDate:new Date(syear,month,startDate),endDate:new Date(eyear,month+1,endDate)}
        return obj
    }
};
