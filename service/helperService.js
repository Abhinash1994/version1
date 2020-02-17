module.exports = {

    parseTime: function(time) {
        return time;
    },

    isOfferDay: function(date) {
        return true;
    },

    getDaysBetweenTwoDates: function(start, end) {
        if (!start) return 0;
        return parseInt((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
    },

    parsePhoneNumber: function(p) {
        if(p.length == 13)return p.substring(3, 13);
        else if(p.length == 11)return p.substring(2, 12);
        else return p;
    },


    getHoursBetweenTwoDates: function(start, end) {
        if (!start) return 0;
        return parseFloat(parseFloat((end.getTime() - start.getTime()) / (1000 * 3600)).toFixed(2));
    },

    getMinutesBetweenTwoDates: function(start, end) {
        if (!start) return 0;
        return parseFloat(parseFloat((end.getTime() - start.getTime()) / (1000 * 60)).toFixed(2));
    },

    getDaysInMonth: function(m, y) {
        return /8|3|5|10/.test(--m) ? 30 : m == 1 ? (!(y % 4) && y % 100) || !(y % 400) ? 29 : 28 : 31;
    },

    getTimeByMonthYear: function(d, m, y) {
        return new Date(y, m, d);
    },

    get24HrsCouponCode: function(){
        return {
            active : true,
            _id : ConstantService.beforBookingCouponId(),
            code : "24HR",
            couponType : 2,
            createdAt : new Date(),
        };
    },

    getDateRangeFromStartAndEndDate: function(sdate,edate){
        let arr = []
        sdate = new Date(sdate.getFullYear(),sdate.getMonth(), (sdate.getDate()),sdate.getHours()+5, sdate.getMinutes()+30, 00)
        edate = new Date(edate.getFullYear(),edate.getMonth(), (edate.getDate()),edate.getHours()+5, edate.getMinutes()+30, 00)
        console.log(sdate)
        while(sdate<=edate){
            arr.push(sdate)
            sdate = new Date(sdate.getFullYear(),sdate.getMonth(), (sdate.getDate()+1),sdate.getHours(), sdate.getMinutes(), 00) 
        }
        return arr;
    },

    getDateRangeByMonth: function(monthArray) {
        var startDate = new Date(2017, 00, 1, 0, 0, 0);
        var startMonth = monthArray.length > 0 ? monthArray[0] : 0;
        var endMonth = monthArray.length > 0 ? monthArray[monthArray.length - 1] : 0;
        return { startDate: new Date(2017, startMonth, 1, 0, 0, 0), endDate: new Date(2019, endMonth + 1, 0, 23, 59, 59) };
    },

    getDateRangeByMonth2: function(monthArray){
        return { startDate: new Date(2019, 0, 1, 0, 0, 0), endDate: new Date(2019, 5, 30, 23, 59, 59) };
    },

    getMonthName: function(monthIndex) {
        var data = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return data[monthIndex];
    },

    getDailyDate: function(startDate, endDate) {
        var dates = [];
        dates.push(HelperService.getDayStart(startDate));
        while (!HelperService.compareTodayDate(startDate, endDate)) {
            startDate = HelperService.addDaysToDate(startDate, 1);
            dates.push(HelperService.getDayStart(startDate));
        }
        return dates;
    },

    getDealActiveDayCode: function(time) {
        console.log(time);
        var d = time ? new Date(time) : new Date();
        console.log(d);
        var day = d.getDay();
        var req = [];
        if (day == 0 || day == 6) req.push(3);
        if (day > 0 && day < 6) req.push(2);
        req.push(1);
        return req;
    },

    getTodayStart: function() {
        var today = new Date();
        return new Date(today.getFullYear(), today.getMonth(), today.getDate());
    },

    getNoOfDaysInMonth: function(year, month) {
        var lastDay = new Date(2017, month + 1, 0, 23, 59, 59);
        console.log(lastDay);
        return lastDay.getDate();
    },

    getTodayEnd: function() {
        var today = new Date();
        return new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
    },

    getDayStart: function(date) {
        var date2 = new Date(date)
        return new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
    },

    getDayEnd: function(date) {
        var date2 = new Date(date)
        return new Date(date2.getFullYear(), date2.getMonth(), date2.getDate(), 23, 59, 59, 999);
    },
    getLastWeekStart: function() {
        var days = 7; // Days you want to subtract
        var date = new Date();
        var last = new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
        return new Date(last.getFullYear(), last.getMonth(), last.getDate());
    },

    getLastDayStart: function() {
        var days = 1; // Days you want to subtract
        var date = new Date();
        var last = new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
        return new Date(last.getFullYear(), last.getMonth(), last.getDate());
    },

    addMonthsToDate: function(m) {
        var date = new Date();
        var newDate = new Date(new Date(date).setMonth(date.getMonth() + m));
        return newDate;
    },

    get5minBefore: function() {
        var d = new Date();
        d.setSeconds(d.getSeconds() - 300);
        console.log(d)
        return d;
    },

    
    addMonthsToGivenDate: function(date, noOfMonth) {
        var newDate = new Date(new Date(date).setMonth(date.getMonth() + noOfMonth));
        return newDate;
    },
    get2HrsBefore: function() {
        var d = new Date();
        d.setHours(d.getHours() - 2);
        return d;
    },

    get2HrsAfter: function() {
        var d = new Date();
        d.setHours(d.getHours() + 2);
        return d;
    },

    getTimeInMsgFormate: function(date){
        return date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()
    },

    addHrsAfter: function(hr) {
        var d = new Date();
        d.setHours(d.getHours() + hr);
        return d;
    },

    addTimeToDate: function(date) {
        var d = new Date(date)
        d.setHours(d.getHours() + 12);
        return d;
    },

    getDateFormat: function(date) {
        // 2016-08-01
        return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
    },


    get30MinBefore: function() {
        var d = new Date();
        d.setMinutes(d.getMinutes() - 30);
        return d;
    },

    get30MinAfter: function() {
        var d = new Date();
        d.setMinutes(d.getMinutes() + 30);
        return d;
    },

    get25MinAfter: function() {
        var d = new Date();
        d.setMinutes(d.getMinutes() + 25);
        return d;
    },

    get24HrsBefore: function() {
        var d = new Date();
        d.setHours(d.getHours() - 24);
        return d;
    },

    getnextDay: function(date) {
        var d = new Date(date);
        d.setHours(d.getHours() + 24);
        return d;
    },

    get3DaysBefore: function() {
        var date = new Date()
        var y = new Date(date.getTime());
        y.setDate(date.getDate() - 3);
        return y;
    },

    getBeforeByDay: function(day) {
        var date = new Date()
        var y = new Date(date.getTime());
        y.setDate(date.getDate() - day);
        return y;
    },

    getBeforeByDayStart: function(day) {
        var y = new Date();
        y.setDate(y.getDate() - day);
        y.setHours(0);
        y.setMinutes(0);
        return y;
    },


    get60secBefore: function() {
        var d = new Date();
        d.setSeconds(d.getSeconds() - 60);
        return d;
    },

    get30secBefore: function() {
        var d = new Date();
        d.setSeconds(d.getSeconds() - 30);
        return d;
    },

    getminBefore: function() {
        var d = new Date();
        d.setSeconds(d.getSeconds() - 300);
        return d;
    },

    getAppointmnetStatusValue: function(a) {
        var data = ['Upcoming', 'Declined', 'Finished', 'OnGoing'];
        return data[a - 1];
    },

    getTotalMembershipSold: function(noOfDays, membershipsSoldArray){
        var total = 0, totalArray = 0, sum = [];
        _.forEach(membershipsSoldArray, function(m, key){
            if(key == 0)sum[key] = m;
            else sum[key] = m + sum[key-1];
        });
        var mod = noOfDays%7;
        return (parseInt(noOfDays/7) * sum[6]) + (sum[mod]);
    },

    compareTodayDate: function(date1, date2) {
        if (date1 == null) return true;
        var day1 = date1.getDate();
        var day2 = date2.getDate();
        var month1 = date1.getMonth();
        var month2 = date2.getMonth();
        var year1 = date2.getFullYear();
        var year2 = date2.getFullYear();
        if (day1 == day2 && month1 == month2 && year1 == year2) return true;
        else return false;
    },

    getSmsUrl: function(){

    },

    getNoOfDaysDiff: function(d1, d2) {
        if (!d1) return 60;
        var diffMs = (d1.getTime() - d2.getTime());
        var diffDays = Math.round(diffMs / 86400000); // days
        return diffDays;
    },

    getNoOfHrsDiff: function(d1, d2) {
        if (!d1) return 0;
        var diffMs = (d1.getTime() - d2.getTime());
        var diffDays = Math.round(diffMs / 3600000); // hrs
        return diffDays;

    },

    getMembershipSuggestionObj: function(subtotal){
        if(subtotal < 846){
            return{
                title : '<span style="color : #037694; font-size: 14px">Shop Through Family Wallet & Get Upto 20% Extra + Free Services</span>',
                subtitle : '<span style="color : #034694;">GET 1100 FAMILY WALLET CREDITS @ ₹ 1000</span>',
                cardUrl : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1510657624/membership_cards_3_pdnz2q.png",
                membershipId : "5a0c0ab57b29161e8469e3d7",
            };
        }else if(subtotal < 3388){
            return{
                title : '<span style="color : #037694; font-size: 14px">Shop Through Family Wallet & Get Upto 20% Extra + Free Services</span>',
                subtitle : '<span style="color : #034694;">GET 4500 FAMILY WALLET CREDITS @ ₹ 4000</span>',
                cardUrl : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1510657220/membership_cards_2_ldsvyg.png",
                membershipId : "5a0c0aed7b29161e8469e74d",
            };
        }else {
            return{
                title : '<span style="color : #037694; font-size: 14px">Shop Through Family Wallet & Get Upto 20% Extra + Free Services</span>',
                subtitle : '<span style="color : #034694;">GET 9600 FAMILY WALLET CREDITS @ ₹ 8000</span>',
                cardUrl : "http://res.cloudinary.com/dyqcevdpm/image/upload/v1510656120/membership_cards_1_srsd54.png",
                membershipId : "5a0c0b397b29161e8469ead8",

            };
        }

    },

    getSubscriptionSuggestionObj: function(subtotal){
        if(subtotal>200){
            return {
                heading1 : '<span style="color : #000;font-size: 14px">Get Free Services Worth ₹ 6000</span>',
                heading2 : '<span style="color : #000">Pay ₹ 1699 & Enjoy <br> Services of ₹ 500/Month Free, For 1 Year</span>',
                tnC : '*Save ₹ 200 by using referral code.',
                suggestion : 'Subscribe & Save ₹ 500 Every Month',
                subscriptionId : 1,
                redemption : 500,
                amount : 1699,
            };

        }else{
            return {
                heading1 : '<span style="color : #000; font-size: 14px">Get Free Services Worth ₹ 2400</span>',
                heading2 : '<span style="color : #000">Pay ₹ 899 & Enjoy <br> Services of ₹ 200/Month Free, For 1 Year</span>',
                tnC : '*Save ₹ 100 by using referral code.',
                suggestion : 'Subscribe & Save ₹ 200 Every Month',
                subscriptionId : 2,
                redemption : 200,
                amount : 899,
            };
        }
        
    },

    getDateInDayMonth: function(d){
        // 20 March
        return d.getDate() +" " +HelperService.getMonthName(d.getMonth());
    },

    getSubscriptionOfferValidity: function(userCreatedAt){
        var offerValidUpTo = HelperService.addDaysToDate(userCreatedAt, 20);
        var offerString = "";
        var offerApplicable = false;
        console.log(HelperService.getNoOfDaysDiff(offerValidUpTo, new Date()));
        // if(HelperService.getNoOfDaysDiff(offerValidUpTo, new Date()) > 0) {
            offerApplicable = false;
            offerString = "Save ₹ 200 by using referral code BEUREF";
        // }
        return {offerApplicable : offerApplicable, offerValidUpTo : offerValidUpTo, text : offerString};
    },

    getNewSubscriptionPriceAfterExpire: function(subscription){
        let subscriptMonthDifference = HelperService.getMonthDifferenceBtwDates(subscription.createdAt, new Date())
        let offValue = 200, imageUrl = "https://res.cloudinary.com/dyqcevdpm/image/upload/v1554539843/1080-x-632-subscription-renewal-banner-after-expiry-_2_upomsl.png", offReferCode = "BEURENEW200";
        console.log(subscriptMonthDifference, "subscriptMonthDifference")
        if(subscriptMonthDifference>14){
              offValue = 1000 
              offReferCode = "BEURENEW600";
              imageUrl = "https://res.cloudinary.com/dyqcevdpm/image/upload/v1554539843/1080-x-632-subscription-renewal-banner-after-expiry-_4_uy5cmz.png";
        }else if(subscriptMonthDifference>13){
              offValue = 500 
              offReferCode = "BEURENEW500"
              imageUrl = "https://res.cloudinary.com/dyqcevdpm/image/upload/v1554539843/1080-x-632-subscription-renewal-banner-after-expiry-_3_bc46s5.png";
        }else if(subscriptMonthDifference>12){
              offValue = 200
              offReferCode = "BEURENEW200"
              imageUrl = "https://res.cloudinary.com/dyqcevdpm/image/upload/v1554539843/1080-x-632-subscription-renewal-banner-after-expiry-_2_upomsl.png";
        }
        return {offValue : offValue, imageUrl : imageUrl, offReferCode : offReferCode}
    },

    getSubscriptionSuggestionObj2: function(moreAmountRequired, subscriptionPrice2, subscriptionPrice3, subtotal, loyalityPoints, userCreatedAt, tax, earlyBirdOfferPresent, earlyBirdOfferType, parlorType){
        var redemableAmount = 0;
        var subscriptionPrice = ConstantService.getRealGlodSubscriptionPrice();
        if(earlyBirdOfferPresent && subtotal >= ConstantService.getEarlyBirdOfferMinimumServiceAmount(parlorType)){
            subscriptionPrice = ConstantService.getEarlyBirdOfferGlodSubscriptionPrice(earlyBirdOfferType);
        }
        var offerString = HelperService.getSubscriptionOfferValidity(userCreatedAt).text;
        // if(subtotal - loyalityPoints >200){
        if(1){
            redemableAmount = subtotal - loyalityPoints > 500 ? 500 : subtotal - loyalityPoints;

            var earlyBirdOfferText = '<div><b>Add services of ₹ '+moreAmountRequired+' more and get subscription @ ₹ '+subscriptionPrice2+'</b></div>';
            if(moreAmountRequired == 0){
                earlyBirdOfferText = '<div><b>Get subscription @ ₹ '+subscriptionPrice2+'</b></div>';
            }
            if(earlyBirdOfferPresent)earlyBirdOfferText = '<div><b>Early Bird Offer: Spend Above ₹ '+ConstantService.getEarlyBirdOfferMinimumServiceAmount(parlorType) +' </b><span>At This Outlet &amp; Get</span><b> SalonPass@₹'+ConstantService.getEarlyBirdOfferGlodSubscriptionPrice(earlyBirdOfferType)+'<strike> (₹1699)</strike></b></div>';

            return {
                heading1 : '<span style="color : #000;font-size: 14px">Get Free Services Worth ₹ 6000</span>',
                heading2 : earlyBirdOfferText,
                tnC : '*Save ₹ 200 by using referral code.',
                suggestion : 'Subscribe & Save ₹ 500 Every Month',
                subscriptionId : 1,
                redemption : 500,
                payableAmount : Math.ceil((subtotal - loyalityPoints - redemableAmount) * (1 + tax/100)) + subscriptionPrice3,
                userSubscriptionOfferTerms : offerString,
                redemableAmount : redemableAmount,
                amount : subscriptionPrice3,
            };

        }else{
            redemableAmount = subtotal - loyalityPoints > 200 ? 200 : subtotal - loyalityPoints;
            return {
                heading1 : '<span style="color : #000; font-size: 14px">Get Free Services Worth ₹ 2400</span>',
                heading2 : '<span style="color : #000">Pay ₹ 899 & Enjoy <br> Services of ₹ 200/Month Free, For 1 Year</span>',
                tnC : '*Save ₹ 100 by using referral code.',
                suggestion : 'Subscribe & Save ₹ 200 Every Month',
                subscriptionId : 2,
                redemption : 200,
                payableAmount : Math.ceil((subtotal - loyalityPoints - redemableAmount) * (1 + tax/100)) + 899,
                userSubscriptionOfferTerms : offerString,
                redemableAmount : redemableAmount,
                amount : 899,
            };
        }
        
    },

    getTimeFromToday: function(time) {
        var d = new Date();
        var diffMs = (d.getTime() - time.getTime());
        var diffDays = Math.round(diffMs / 86400000); // days
        var diffHrs = Math.round((diffMs % 86400000) / 3600000); // hours
        var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
        var months;
        months = (d.getFullYear() - time.getFullYear()) * 12;
        months -= time.getMonth() + 1;
        months += d.getMonth();
        months = months <= 0 ? 0 : months;
        if (months > 0) return months + ' month' + (months > 1 ? 's' : '') + ' ago';
        else if (diffDays > 0) return diffDays + ' day' + (diffDays > 1 ? 's' : '') + ' ago';
        else if (diffHrs > 0) return diffHrs + ' hour' + (diffHrs > 1 ? 's' : '') + ' ago';
        else return diffMins + ' minute' + (diffMins > 1 ? 's' : '') + ' ago';
    },

    getLastWeekEnd: function() {
        var days = 1; // Days you want to subtract
        var date = new Date();
        var last = new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
        return new Date(last.getFullYear(), last.getMonth(), last.getDate(), 23, 59, 59, 999);
    },

    getLastMonthStart: function() {
        var days = HelperService.getDaysInMonth(); // Days you want to subtract
        var date = new Date();
        var last = new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
        return new Date(last.getFullYear(), last.getMonth(), last.getDate());
    },

    getLastTwoMonthStart: function() {
        var days = 60; // Days you want to subtract
        var date = new Date();
        var last = new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
        return new Date(last.getFullYear(), last.getMonth(), last.getDate());
    },

    getCurrentMonthStart: function(date) {
        var days = date.getDate()-1; // Days you want to subtract
        var last = new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
        return new Date(last.getFullYear(), last.getMonth(), last.getDate());
    },

    getCurrentMonthStartDate: function() {
        var last = new Date();
        return new Date(last.getFullYear(), last.getMonth(), 1);
    },

    titleCase(str) {
           var splitStr = str.toLowerCase().split(' ');
           for (var i = 0; i < splitStr.length; i++) {
               // You do not need to check if i is larger than splitStr length, as your for does that for you
               // Assign it back to the array
               splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
           }
           // Directly return the joined string
           return splitStr.join(' '); 
        },

    nextMonthStartDate: function(){
        var date = new Date()
        var days = date.getDate()-1; // Days you want to subtract
        var last = new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
        var thisMonthStart = new Date(last.getFullYear(), last.getMonth(), last.getDate(), 0);
        var newDate = new Date(new Date(thisMonthStart).setMonth(thisMonthStart.getMonth() + 1));
        return newDate;
    },

    getMonthDifferenceBtwDates: function(d1, d2){
        var months;
        console.log(d1)
        console.log(d2)
        months = (d2.getFullYear() - d1.getFullYear()) * 12;
        console.log("month 2", months)
        months -= d1.getMonth()+1;
        console.log("month 2", months)

        months += d2.getMonth()+1;
        console.log("month 2", months)

        return months <= 0 ? 0 : months;
    },

    getMonthDifferenceBtwDates2: function(d1, d2){
        var months;
        months = (d2.getFullYear() - d1.getFullYear()) * 12;
        months -= d1.getMonth() + 1;
        months += d2.getMonth() +1;
        console.log(months)
        return months < 0 ? -1 : months;
    },

    getNumberInString: function(i){
        if(i==1 || i == 0)return "1st";
        if(i==2)return "2nd";
        if(i==3)return "3rd";
        else return i + "th";
    },

    getLastThreeMonthStart: function() {
        var days = 30 * 3; // Days you want to subtract
        var date = new Date();
        var last = new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
        return new Date(last.getFullYear(), last.getMonth(), last.getDate());
    },

    getLastFourMonthStart: function() {
        var days = 30 * 4; // Days you want to subtract
        var date = new Date();
        var last = new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
        return new Date(last.getFullYear(), last.getMonth(), last.getDate());
    },

     getLastThreeMonthStartFromDate: function(date) {
        var days = 30 * 3; // Days you want to subtract
        var last = new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
        return new Date(last.getFullYear(), last.getMonth(), last.getDate());
    },

    getNextThreeMonthStartFromDate: function(date) {
        var month = date.getMonth() +3; // Days you want to subtract
        var day = date.getDate()+1;
        return new Date(date.getFullYear(), month, day);
    },

    getCurrentMonthNo: function() {
        var d = new Date();
        return d.getMonth();
    },

    getCurrentMonthFirstDate: function() {
        var d = new Date();
        return new Date(d.getFullYear(), parseInt(d.getMonth()), 1);
    },

    getCurrentMonthLastDate: function() {
        var d = new Date();
        return new Date(d.getFullYear(), parseInt(d.getMonth()) + 1, 0);
    },

    getMonthLastDate: function(date) {
        return new Date(date.getFullYear(), parseInt(date.getMonth()) + 1, 0);
    },

    getFirstDateOfByDate: function(date){
        var d = new Date(date);
        var month = d.getMonth();
        var year = d.getFullYear();
        return new Date(year, parseInt(month), 1);
    },

    getDayOfYear: function(date){
        var now = new Date(date);
        var start = new Date(now.getFullYear(), 0, 0);
        var diff = now - start;
        var oneDay = 1000 * 60 * 60 * 24;
        var day = Math.floor(diff / oneDay);
        return day;
    },

    getLastDateOfByDate: function(date){
        var d = new Date(date);
        var month = d.getMonth();
        var year = d.getFullYear();
        var newDate = new Date(year, parseInt(month) + 1, 1);
        newDate.setHours(newDate.getHours() - 1);
        return newDate
    },

    getFirstDateOfMonth: function(y, m) {
        return new Date(y, parseInt(m), 1);
    },
    getLastDateOfMonth: function(y, m) {
        return new Date(y, parseInt(m) + 1, 0);
    },
    getLastDateOfMonth1: function(y, m) {
        return new Date(y, parseInt(m) + 1, 1);
    },

    addDaysToDate: function(date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    },

    addDaysToDate2: function(days) {
        var result = new Date();
        result.setDate(result.getDate() + days);
        result.setHours(18);
        return result;
    },

    getGenderName: function(index) {
        if (index == 1) return "UNISEX";
        if (index == 2) return "MALE";
        if (index == 3) return "FEMALE";
    },

    getPaymentMethod: function(index) {
        if (index == 1) return "Cash";
        if (index == 2) return "Card";
        if (index == 3) return "Advance Cash";
        if (index == 4) return "Advance Online";
        if (index == 5) return "Online Credit/ Debit Card, Net banking";
        if (index == 6) return "Paytm";
        if (index == 7) return "Paytm";
        if (index == 8) return "Amex";
        if (index == 9) return "Paytm";
        if (index == 10) return "Beu";
        if (index == 11) return "Nearby";
        if (index == 12) return "Paytm";
    },



   isTodayLastDate: function(date) {
        var today = date;
        var lastDate = new Date(2017, today.getMonth() + 1, 0, 0, 0, 0, 0);
        if (today.getDate() == lastDate.getDate()) {
            console.log("true")
            console.log(today.getDate(), lastDate.getDate());
            return true;
        } else {
            console.log("false")
            return false;
        }

    },

    getLastMonthStartDate: function(date, d) {
        console.log(date)
        var days = d; // Days you want to subtract
        var date = new Date();
        var last = new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
        return new Date(last.getFullYear(), last.getMonth(), last.getDate());

    },

    getDistanceBtwCordinates: function(lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = this.deg2rad(lat2 - lat1); // deg2rad below
        var dLon = this.deg2rad(lon2 - lon1);
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return parseFloat(d.toFixed(4));
    },

    getDistanceBtwCordinates1: function(lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = this.deg2rad(lat2 - lat1); // deg2rad below
        var dLon = this.deg2rad(lon2 - lon1);
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return parseFloat(d.toFixed(4));
    },

    deg2rad: function(deg) {
        return deg * (Math.PI / 180);
    },

    istToDateTime: function(date) {
        var d = new Date(date);
        return d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
    },

    toObjectId: function(arr) {
        var toReturn = [];

        for (var i = 0; i < arr.length; i++) {
            toReturn.push(ObjectId(arr[i]));
        }

        return toReturn;

    },

    getWeekToDate : function(y, w){
        var endDateOfWeek = new Date(Date.UTC(y, 0, (1 + w) * 7));

        return endDateOfWeek;
    },

    getCustomWeekStart: function(date) {
        var days = 6; // Days you want to subtract
        var last = new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
        return new Date(last.getFullYear(), last.getMonth(), last.getDate());
    },

    addOneWeekDate: function(days , date) {
        var days = days; // Days you want to subtract
        var last = new Date(date.getTime() + (days * 24 * 60 * 60 * 1000));
        return new Date(last.getFullYear(), last.getMonth(), last.getDate());
    },

    getNewWeekStart: function(days , date) {

        var date = date; // Days you want to add
        var last = new Date(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var options = { year: "numeric", month: "long", day: "numeric"};
        return last.toLocaleDateString("en-US", options);
    },


    getCustomStart: function(date) {
        var nD = new Date(date)
        var days = 6; // Days you want to subtract
        var last = new Date(nD - (days * 24 * 60 * 60 * 1000));
        return new Date(last);
    },


    getCustomMonthStart: function(m) {
        var date = new Date()
        var newDate = new Date(new Date(date).setMonth(date.getMonth() - m));
        return newDate;
    },


    couponCodeDiscounts:function(couponCode) {
        var data ={limit : 0 , offPercentage: 0} ;

        if(couponCode.substring(0, 4)=="DDDD"){
            data.limit = 300;
            data.offPercentage = 15;

            return data;
        }else if(couponCode.substring(0, 4)=="FIRST"){
            data.limit = 300;
            data.offPercentage = 20;
        }
        else
            return data;

    },
    getWeekNumber : function(d) {
      var target  = new Date(d.valueOf());
      var dayNr   = (d.getDay() + 6) % 7;
      target.setDate(target.getDate() - dayNr + 3);
      var jan4    = new Date(target.getFullYear(), 0, 4);
      var dayDiff = (target - jan4) / 86400000;
      var weekNr = 1 + Math.ceil(dayDiff / 7);
      return weekNr;
    },

    
    getLastMonthEndDate: function() {
       var today = new Date();
       var todayMonth = today.getMonth();
       var year = today.getFullYear();
       var last = new Date(year, todayMonth, 0);
        
        return new Date(last.getFullYear(), last.getMonth(), last.getDate());
    },

    getCustomMonthEndDate: function(year ,month) {
       var date = new Date(year, month , 1);
       var todayMonth = date.getMonth();
       var year = date.getFullYear();
       var last = new Date(year, todayMonth, 0);
        
        return new Date(last.getFullYear(), last.getMonth(), last.getDate(), 23, 59, 59);
    },

    getCustomMonthStartDate: function(year ,month) {
       var date = new Date(year, month , 1);
       var todayMonth = date.getMonth();
       var year = date.getFullYear();
       var last = new Date(year, todayMonth, 1);
        
        return new Date(last.getFullYear(), last.getMonth(), last.getDate());
    },

    getMonthEndDate: function(year ,month) {
       var last = new Date(year, month+ 1, 0);
        return new Date(last.getFullYear(), last.getMonth(), last.getDate() , 23, 59, 59);
    },

    getDateFormatForMails: function(date) {
        var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var month = monthNames[date.getMonth()]
        return ( date.getDate() + ' ' + month + ' ' + date.getFullYear());
    },

    getDateFormatForNotification: function(date) {
        var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var month = monthNames[date.getMonth()]
        return ( date.getDate() + ' ' + month );
    },

    mixDateAndTime: function(date , time) {
        var dateVar = new Date(date);
        var timeVar = new Date(time);
        return new Date(dateVar.getFullYear(), dateVar.getMonth(), dateVar.getDate(), timeVar.getHours(),  timeVar.getMinutes(),  timeVar.getSeconds() );
    },

    convertNumberToWOrds : function(num){
        var a = ['','One ','Two ','Three ','Four ', 'Five ','Six ','Seven ','Eight ','Nine ','Ten ','Eleven ','Twelve ','Thirteen ','Fourteen ','Fifteen ','Sixteen ','Seventeen ','Eighteen ','Nineteen '];
        var b = ['', '', 'Twenty','Thirty','Forty','Fifty', 'Sixty','Seventy','Eighty','Ninety'];

            if ((num = num.toString()).length > 9) return 'overflow';
            n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
            if (!n) return; var str = '';
            str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
            str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
            str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
            str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
            str += (n[5] != 0) ? ((str != '') ? 'And ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'Only ' : '';
            return str;
    },

    getdayName : function(num){
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[num+1];
    },

    getRandomString : function(length) {
        let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    },

      validatePassword: function(password , minNumberofChars , maxNumberofChars) {
         
          var errors = [];
            if (password.length < minNumberofChars) {
                errors.push("Password must contain minimum 8 characters"); 
            }
            if (password.length > maxNumberofChars) {
                errors.push("Password must contain maximum 16 characters"); 
            }
            if (password.search(/[a-z]/) < 0) {
                errors.push("Password must contain at least one letter in lower case.");
            }
            if (password.search(/[A-Z]/) < 0) {
                errors.push("Password must contain at least one letter in upper case.");
            }
            if (password.search(/[0-9]/) < 0) {
                errors.push("Password must contain at least one digit."); 
            }
            if (password.search(/[!@#$%^&*]/) < 0) {
                errors.push("Password must contain at least one special character."); 
            }
            if (errors.length > 0) {
                
                return {error : true , message : errors};
            }
            return {error : false , message : ['Password Accepted']};
      },

      getLastMonthCustomStartDate : function(){
        var currentMonth = new Date().getMonth(); 
        var currentYear = new Date().getFullYear();
        var lastMonth = currentMonth-1;
        var dt = new Date(currentYear, lastMonth ,1);
        return dt;
      },

      

};
