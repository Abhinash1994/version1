module.exports = {

    getAppointmentMonthlyMatchObj: function(req, type, m) {
        var month = req.body.month || [0,1,2, 3, 4, 5];
        if (type == "clientWise") month = [m];
        var range = HelperService.getDateRangeByMonth(month);
        var mongoose = require('mongoose');
        if(type == 'oldNewClient'){
            range = HelperService.getDateRangeByMonth2(month);
        }
        var match = {
            appointmentStartTime: { $gte: range.startDate, $lt: range.endDate },
            status: 3,
        };

        console.log(match)
        if (req.body.parlorId) match.parlorId = ObjectId(req.body.parlorId);
        if (type == 'freeHairCut') {
            match["services.discountMedium"] = "frequency";
            match["$or"] = [ { "services.dealId": null, appointmentStartTime : {$lt : new Date(2017, 8, 1)} }, { appointmentStartTime : {$gt : new Date(2017, 8, 1)} } ];
            match["services.dealPriceUsed"] = true;
        }
        if (type == 'appTransaction') {
            // match["razorPayCaptureResponse.status"] = "captured";
            match["$or"] = [{ "appointmentType": 3 }, { "appBooking": 2 }];
        }
        if (type == 'freebiesOnlinePayment') {
            match['$or'] = [{ 'freebiesThreading': { $gt: 0 } }, { 'freeLoyalityPoints': { $gt: 0 } }, { 'onlinePaymentDiscount': { $gt: 0 } }]
        }
       
        return match;
    },

    getAppointmentMonthlyProjectObj: function(type) {
        var project = {
            year: { $year: "$appointmentStartTime" },
            month: { $month: "$appointmentStartTime" },
            parlorId: 1,

        };
        if (type == 'freebiesHairCut') project['services.loyalityPoints'] = 1;
        if (type == 'revenue') project.serviceRevenue = 1;
        if (type == 'appTransaction') project.payableAmount = 1;
        if (type == 'noOfService') project.noOfService = 1;
        if (type == 'freebiesOnlinePayment') project.onlineDiscount = { $add: ["$freeLoyalityPoints", "$onlinePaymentDiscount"] };
        if (type == 'serviceFrequency') project.count = { $size: "$services" };
        if (type == 'oldNewClient') {
            project.newClientApp = { $cond: { if: { $and : [{ $eq: ["$client.noOfAppointments", 0] }, { $eq: ["$appointmentType", 3] }] }, then: 1, else: 0 } };
            project.newClientCrm = { $cond: { if: { $and : [{ $eq: ["$client.noOfAppointments", 0] }, { $eq: ["$appointmentType", 1] }] }, then: 1, else: 0 } };
            project.oldClientApp = { $cond: { if: { $and : [{ $eq: ["$client.noOfAppointments", 0] }, { $eq: ["$appointmentType", 3] }] }, then: 0, else: 1 } };
            project.oldClientCrm = { $cond: { if: { $and : [{ $eq: ["$client.noOfAppointments", 0] }, { $eq: ["$appointmentType", 1] }] }, then: 0, else: 1 } };

        }
        if (type == 'appTransaction') {
            project.footFall = { $cond: { if: { $and : [{ $eq: ["$paymentMethod", 5] }, { $gt: ["$payableAmount", 0] }] }, then: 1, else: 0 } };
            project.footFallCash = { $cond: { if: { $and : [{ $ne: ["$paymentMethod", 5] }, { $gt: ["$payableAmount", 0] }] }, then: 1, else: 0 } };
            project.payableAmountCash = { $cond: { if: { $eq: ["$paymentMethod", 5] }, then: 0, else: "$serviceRevenue" } };
            project.payableAmountOnline = { $cond: { if: { $eq: ["$paymentMethod", 5] }, then: "$serviceRevenue", else: 0 } };
        }
        if (type == 'departmentWise') {
            project["departmentRevenue.departmentId"] = 1;
            project["departmentRevenue.revenue"] = 1;
            project["departmentRevenue.noOfService"] = 1;
        }
        if (type == 'clientWise') {
            project["client.id"] = 1;
            project["serviceRevenue"] = 1;
        }
        if (type == 'freeHairCutClients') {
            project = {
                'client.id': 1,
                appointmentStartTime: 1,
            };
        }
        return project;
    },

    getFootfall: function(type) {
        return { $sum: "$footFall" };
    },

    getFirstGroup: function(type) {
        var obj = {
            _id: {
                year: "$year",
                month: "$month",
                parlorId: "$parlorId",
            },
            footFall: { $sum: AggregateHelper.getReportValueFootFall(type) },
            reportValue: { $sum: AggregateHelper.getReportValueOnline(type) },
            footFallCash: { $sum: AggregateHelper.getReportValueFootFallCash(type) },
            reportValueCash: { $sum: AggregateHelper.getReportValueCash(type) },
            year: { $first: '$year' },
            month: { $first: '$month' },
            parlorId: { $first: '$parlorId' },
        };
        if (type == 'clientWise') obj._id.client = "$client.id";
        return obj;
    },

    getReportValueFootFall: function(type) {
        if (type == 'appTransaction') return "$footFall";
        else return 1;
    },
    getReportValueOnline: function(type) {
        if (type == 'noOfService') return "$noOfService";
        else if (type == 'revenue') return "$serviceRevenue";
        else if (type == 'appTransaction') return "$payableAmountOnline";
        else if (type == 'clientWise') return "$serviceRevenue";
        else return 1;
    },
    getReportValueFootFallCash: function(type) {
        if (type == 'appTransaction') return "$footFallCash";
        else return 1;
    },
    getReportValueCash: function(type) {
        if (type == 'appTransaction') return "$payableAmountCash";
        else return 1;
    },

};