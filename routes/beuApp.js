/**
 * Created by ginger on 7/21/2017.
 */
'use strict'

var express = require('express');
var router = express.Router();
var request = require('request');
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var passportJWT = require("passport-jwt");
var async = require("async");
var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;
var geolib = require("geolib");
var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();
jwtOptions.secretOrKey = 'Beusalons)(*&^%$#@!@#$%^&*()_+';

var strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
    console.log('payload received', jwt_payload);
    // usually this would be a database call:
    Beu.findOne({ _id: jwt_payload.id }, { name: 1 }, function(err, user) {
        if (user) {
            next(null, user);
        } else {
            next(null, false);
        }
    })
});

passport.use(strategy);
router.use(passport.initialize());
router.get("/secret", passport.authenticate('jwt', { session: false }), function(req, res) {
    res.json("Success! You can not see this without a token");
});

var makeRequest = function(url, res) {
    request(url, function(error, response, body) {
        if (error == null) {
            res.send("success");
        } else {
            res.send("Something went wrong.");
        }
        console.log('error:', error);
        console.log('statusCode:', response && response.statusCode);
        console.log('body:', body);
    });
}


function getDayName(num) {
    var array = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    return array[num];
}

function priceRating(num) {
    var array = [2, 4, 5]
    console.log(num)
    return array[num];
}

function getRole(num) {
    var array = [{
        role: 7,
        name: "Owner"
    }, {
        role: 2,
        name: "Manager"
    }];
    var get = _.filter(array, function(f) {
        return f.role == num;
    })
    return get[0].name
}

router.post('/updateHomeLocation', function(req, res) {
    var userId = req.body.userId;
    Beu.findOne({_id : req.body.userId}, function(er, beu){
        if(!beu.latitude){
            Beu.update({_id : req.body.userId}, {latitude : req.body.latitude, longitude : req.body.longitude}, function(er, beu){
                return res.json(CreateObjService.response(false, 'Done'));
            });
        }else{
            return res.json(CreateObjService.response(false, 'error'));
        }
    });
});

router.post('/pingLocation', function(req, res){
    var userId = req.body.userId;
    var locationPins = req.body.locationPins;
    Async.each(locationPins, function(location, callback) {
        var timeInInteger = new Date(location.time).getTime();
        LocationTracker.findOne({userId : userId, timeInInteger : timeInInteger}, function(err, d){
            if(!d){
                LocationTracker.create(LocationTracker.getNewObj(userId, location), function(err, l){
                    callback();
                });
            }else{
                callback();
            }
        });
    }, function allTaskCompleted() {
        LocationTracker.updateVisitWithCheckInCheckOut(userId, function(d){
            return res.json(CreateObjService.response(false, {msg :'Updated'}));
        });
    });
});

router.post('/sendOtp', function(req, res) {
    var phoneNumber = req.body.phoneNumber;
    Otp.find({ phoneNumber: phoneNumber, createdAt: { $gt: HelperService.get60secBefore() } }, function(err, otps) {
        if (otps.length > 0)
            return res.json(CreateObjService.response(true, 'Please wait for 45 sec'));
        else {
            Otp.find({
                phoneNumber: phoneNumber,
                createdAt: { $gt: HelperService.get24HrsBefore() }
            }, function(err, data) {
                if (data.length > 1000)
                    return res.json(CreateObjService.response(true, 'Maximum limit exceed for your number'));
                else {
                    Beu.findOne({ phoneNumber: req.body.phoneNumber }, function(err, user) {
                        if (user) {

                            Otp.findOne({
                                phoneNumber: phoneNumber,
                                createdAt: { $gte: HelperService.get5minBefore() }
                            }).sort({ createdAt: -1 }).exec(function(err, oldOtp) {
                                var otp = Math.floor(Math.random() * 9000) + 1000;
                                if (oldOtp) {
                                    otp = oldOtp.otp
                                }
                                if (phoneNumber == "8826345311") otp = 1234;
                                var message = otp + ' is your Be U Salons verification code.'
                                Otp.create({
                                    used: 0,
                                    otp: otp,
                                    userId: user.id,
                                    phoneNumber: phoneNumber,
                                    message: message
                                }, function(err, newOtp) {
                                    var url = "https://control.msg91.com/api/sendotp.php?authkey=164034A93iTmJcMu595dd01d&mobile=91" + phoneNumber + "&message=" + message + "&otp=" + otp + "&sender=BEUSLN";
                                    request(url, function(error, response, body) {
                                        if (error == null) {
                                            return res.json(CreateObjService.response(false, 'Otp has been sent to your number'));
                                        } else {
                                            return res.json(CreateObjService.response(true, 'Error in sending sms'));
                                        }
                                    });

                                });
                            });
                        } else {
                            return res.json(CreateObjService.response(true, 'User Not Registered'));
                        }
                    });
                }
            });
        }
    });
});
router.post('/resendOtp', function(req, res) {
    var phoneNumber = req.body.phoneNumber;
    if (req.body.otpType == 0) {
        var url = "https://control.msg91.com/api/retryotp.php?authkey=164034A93iTmJcMu595dd01d&mobile=91" + phoneNumber + "&retrytype=text";

    } else {
        var url = "https://control.msg91.com/api/retryotp.php?authkey=164034A93iTmJcMu595dd01d&mobile=91" + phoneNumber + "&retrytype=voice";

    }
    request(url, function(error, response, body) {
        if (error == null) {
            return res.json(CreateObjService.response(false, 'Otp has been sent to your number'));

        } else {
            return res.json(CreateObjService.response(true, 'Error in sending sms'));
        }
    });
})

router.post('/verifyOtp', function(req, res) {
    var phoneNumber = req.body.phoneNumber;
    var response = {}
    Otp.find({
        phoneNumber: phoneNumber,
        otp: req.body.otp,
        used: 0,
        createdAt: { $gt: HelperService.get5minBefore() }
    }, function(err, otps) {
        if (otps.length > 0) {
            Otp.update({ phoneNumber: phoneNumber, used: 0 }, { used: 1, verifiedAt: new Date() }, function(err, update) {

                Beu.findOne({ phoneNumber: phoneNumber }, function(err, user) {
                    if (err) {
                        return res.json(CreateObjService.response(true, 'Cannot retrieve data'));
                    }
                    if (user) {
                        var payload = { id: user._id };
                        var token = jwt.sign(payload, jwtOptions.secretOrKey);
                        Beu.update({ phoneNumber: phoneNumber }, { accessToken: token }, function(err, tokeUpdated) {
                            user.accessToken = token;
                            return res.json(CreateObjService.response(false, user));
                        })
                    }
                });
            });
        } else {
            return res.json(CreateObjService.response(true, 'Invalid Otp'));
        }
    });
})


var ObjectId = mongoose.Types.ObjectId;

var monthss = new Array(12);
monthss[0] = "January";
monthss[1] = "February";
monthss[2] = "March";
monthss[3] = "April";
monthss[4] = "May";
monthss[5] = "June";
monthss[6] = "July";
monthss[7] = "August";
monthss[8] = "September";
monthss[9] = "October";
monthss[10] = "November";
monthss[11] = "December";
// 1 - cash, 2 - card, 3 - advance cash, 4 - advance online, 5 - razor pay, 6 - paytm, 12- multiple , 13 - nearby , 8 - amex card, 11 - nearby, 10 - beu
// var mode = new Array(12);
// mode[1] = "cash";
// mode[2] = "card";
// mode[3] = "advance cash";
// mode[4] = "advance online";
// mode[5] = "razor";
// mode[6] = "June";
// mode[7] = "June";
// mode[8] = "June";
// mode[9] = "June";
// mode[10] = "June";
// mode[11] = "June";
// mode[12] = "June";


function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

function calculateByParlor(services, parlorId) {
    var count = 0;
    _.forEach(services, function(s) {
        var p = _.filter(s.parlors, function(sp) {
            return sp.parlorId + "" == parlorId + ""
        })[0];
        if (p) count += p.count;
    });
    return count;
}

function calculateByParlorRevenue(services, parlorId) {
    var count = 0;
    _.forEach(services, function(s) {
        var p = _.filter(s.parlors, function(sp) {
            return sp.parlorId + "" == parlorId + ""
        })[0];
        if (p) count += p.revenue;
    });
    return count;
}

function calculateByParlorRevenueDept(services, parlorId) {
    var count = 0;
    _.forEach(services, function(s) {
        var p = _.filter(s.parlors, function(sp) {
            return sp.parlorId + "" == parlorId + ""
        })[0];
        if (p) count += p.revenue;
    });
    return count;
}

function calculateByParlorDept(services, parlorId) {
    var count = 0;
    _.forEach(services, function(s) {
        var p = _.filter(s.parlors, function(sp) {
            return sp.parlorId + "" == parlorId + ""
        })[0];
        if (p) count += p.count;
    });
    return count;
}

function send(err, status, data) {
    var msg = "";
    if (status == 0) {
        msg = "Success"
    } else if (status == 1) {
        msg = "Failed"
    } else {

        msg = " data Not found"
    }

    return {
        "error": err,
        "message": msg,
        "data": data

    };
}

function dateParse(m) {
    var d = new Date(m);
    var getdata = "";
    var month = new Array();
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";
    return getdata = '' + month[d.getMonth()] + '-' + d.getDate() + '-' + d.getFullYear() + '';
}

function getSmsUrl(messageId, message, phoneNumbers, type) {

    var param = {},
        request = "";
    param.sender = messageId;
    param.message = message;
    param.numbers = phoneNumbers.toString();
    param.username = type == "P" ? "ivyinfo" : "trivyinfo";
    param.password = type == "P" ? "GRNnjF" : "mVVp4J";
    for (var key in param) {
        request += key + "=" + encodeURI(param[key]) + "&";
    }
    request = request.substr(0, request.length - 1);
    return "http://sms99.co.in/pushsms.php?" + request;
}

function getSocialDetails(socialLoginType, accessToken, callback) {
    if (socialLoginType == 1) {
        var FB = require('fb'),
            fb = new FB.Facebook({});
        FB.api('me', { fields: ['id', 'name', 'email', 'picture', 'gender'], access_token: accessToken }, function(res) {
            console.log(res);
            if (!res.error) {
                return callback({
                    id: res.id,
                    name: res.name,
                    emailId: res.email,
                    gender: res.gender == 'male' ? 'M' : 'F',
                    profilePic: res.picture.data.url,
                });
            } else return callback(null);
        });
    } else {
        var request = require("request");
        request({
            url: 'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' + accessToken,
            json: true
        }, function(error, res) {
            console.log(res.body);
            if (res.body.sub) {
                return callback({
                    id: res.body.sub,
                    name: res.body.name,
                    emailId: res.body.email,
                    gender: null,
                    profilePic: res.body.picture,
                });
            } else return callback(null);
        });
    }
}

function getUserRegistrationUrl(name, phoneNumber, freeServices, mobile) {
    if (!mobile)
        return getSmsUrl('BEUSLN', 'Hi ' + name + ', Welcome to the world of Beauty Ninjas. Treat yourself with incredible beauty treatments and much more like never before.', [phoneNumber], 'T');
    else {
        return getSmsUrl('BEUSLN', 'Congrats! Thank you for signing up. You are now entitled to a free Haircut at Be U Salon. Visit your nearest outlet and revamp your look', [phoneNumber], 'T');
    }
}

function projection(r, l, y) {
    return ((l / y) * r)
}
// -------------------------------------Apis----------------------------------------------------

router.get('/search', function(req, res) {
    var response = {};
    var perPage = 10;
    var arr = [];
    var data = {};
    var pid = req.query.pId;
    var val = new RegExp('^' + req.query.search);
    var queryR = { firstName: { $regex: val }, "parlors.parlorId": pid };
    User.find(queryR).limit(10).exec(function(err, data) {
        if (err) {
            return res.json(send(true, 1, ""));
        }
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                arr.push({
                    Id: data[i]._id,
                    name: data[i].firstName
                })
            }
            data = arr;
            return res.json(send(false, 0, data));
        } else {
            return res.json(send(true, 2, ""));
        }
    });
}); //done

router.post('/customer', function(req, res) {
    var response = {};
    var page = req.body.page ? req.body.page : 0;
    User.findOne({ _id: req.body.uId }, function(err, user) {
        if (err) return res.json(CreateObjService.response(true, 'Error'));
        else if (user) {
            response.error = false;
            response.message = "success";
            var membership = _.map(user.activeMembership, function(dt) {
                return {
                    amount: dt.amount,
                    pointleft: dt.creditsLeft,
                    name: dt.name
                }
            });

            Appointment.find({ 'client.id': req.body.uId }).limit(10).skip(10 * page).sort({ appointmentStartTime: -1 }).exec(function(err, appointments) {
                var data = _.map(appointments, function(appointment) {
                    if (appointment.allPaymentMethods.length > 0) {
                        console.log(appointment.allPaymentMethods)
                        var method = _.map(appointment.allPaymentMethods, function(dt) {
                            return dt.name
                        })
                    } else {
                        var method = [];
                        method.push(HelperService.getPaymentMethod(appointment.paymentMethod))

                    }
                    return {
                        services: _.map(appointment.services, function(service) {
                            return service.name
                        }),
                        date: dateParse(appointment.appointmentStartTime),
                        amount: appointment.payableAmount,
                        paymentMode: method,
                        status: appointment.status
                    }
                });

                response.data = {
                    "phoneNumber": user.phoneNumber,
                    "Gender": user.gender,
                    "membership": membership,
                    "appointments": data
                }
                res.json(send(false, 0, response));
            });
        } else {
            res.json(send(true, 1, ""));
        }
    });
}); //done

router.post('/emp', function(req, res) {
    var uid = req.body.pId;
    var eid = req.body.eId;
    var query = { "parlorId": uid, active: true };
    var td = new Date();
    if (eid) query = { _id: eid, active: true };
    var final = {};
    var arr = [];
    if (uid || eid) {
        var f_data = [];
        Admin.find(query).exec(function(err, data) {
            if (data) {
                async.parallel([
                    function(done) {
                        async.each(data, function(employee, callback) {
                            Appointment.find({
                                status: 3,
                                "employees.employeeId": employee._id,
                                "appointmentStartTime": {
                                    $gte: HelperService.getDayStart(td),
                                    $lt: HelperService.getDayEnd(td)
                                }
                            }).sort({ appointmentStartTime: 1 }).exec(function(err, result) {

                                Attendance.find({
                                    employeeId: { $regex: employee._id },
                                    time: { $gte: HelperService.getDayStart(td), $lt: HelperService.getDayEnd(td) }
                                }).sort({ time: -1 }).exec(function(err, resulttt) {
                                    if (resulttt.length > 0) {
                                        var len = (resulttt.length - 1)
                                        console.log("twooooo", resulttt.length, len)
                                        if (len == 0) {
                                            var minutes = "";
                                            if (parseInt(new Date(resulttt[0].time).getMinutes()) < 10) {
                                                minutes = "0" + new Date(resulttt[0].time).getMinutes()
                                            } else {
                                                minutes = new Date(resulttt[0].time).getMinutes()
                                            }
                                            var time1 = new Date(resulttt[0].time).getHours() + ":" + minutes;
                                            var time2 = "Not Available";
                                            var time = { first: time1, last: time2 }
                                        } else {
                                            var minutes = "";
                                            var minutes1 = "";
                                            if (parseInt(new Date(resulttt[0].time).getMinutes()) < 10) {
                                                minutes = "0" + new Date(resulttt[0].time).getMinutes()
                                            } else {
                                                minutes = new Date(resulttt[0].time).getMinutes()
                                            }
                                            if (parseInt(new Date(resulttt[len].time).getMinutes()) < 10) {
                                                minutes1 = "0" + new Date(resulttt[len].time).getMinutes()
                                            } else {
                                                minutes1 = new Date(resulttt[len].time).getMinutes()
                                            }

                                            var time1 = new Date(resulttt[0].time).getHours() + ":" + minutes;
                                            var time2 = new Date(resulttt[len].time).getHours() + ":" + minutes1;
                                            var time = { first: time1, last: time2 }
                                        }

                                    } else {
                                        var time = { first: "Not Available", last: "Not Available" }
                                    }

                                    //                                     if (resulttt.length > 0) {
                                    //                                         console.log(resulttt)
                                    //                                         var len = (resulttt.length - 1)
                                    //                                         var time1 = new Date(resulttt[0].time).getHours() + ":" + new Date(resulttt[0].time).getMinutes();
                                    //                                         var time2 = new Date(resulttt[len].time).getHours() + ":" + new Date(resulttt[len].time).getMinutes();
                                    //                                         var time = {first: time1, last: time2}
                                    //
                                    //                                     } else {
                                    //                                         var time = {first: "Not Available", last: "Not Avialable"}
                                    //                                     }
                                    // =======
                                    console.log(time)


                                    var completedRevenue = 0;
                                    var amount = 0;
                                    var completedcount = 0;
                                    var bookedRevenue = 0;
                                    var bookedcount = 0;
                                    _.forEach(result, function(r) {
                                        amount += r.payableAmount;
                                        if (r.status == 3) completedcount++;
                                        else if (r.status != 2) bookedcount++;
                                        _.forEach(r.services, function(s) {
                                            var obj = [{
                                                employeeId: "" + employee.id,
                                                totalRevenueEmp: 0
                                            }];
                                            var serviceRevenue = Appointment.serviceFunction(r.createdAt, s, obj);
                                            if (r.status == 3) completedRevenue += serviceRevenue.employees[0].totalRevenueEmp;
                                            else if (r.status != 2) bookedRevenue += serviceRevenue.employees[0].totalRevenueEmp;
                                        });
                                    });


                                    f_data.push({
                                        employeeDetails: {
                                            uId: employee._id,
                                            name: employee.firstName + ' (' + employee.position + ')',
                                            phoneNumber: employee.phoneNumber,
                                            salary: employee.salary,
                                            checkIn: time,
                                            position: employee.position,
                                            completedRevenue: amount,
                                            completedcount: completedcount,
                                            bookedRevenue: bookedRevenue,
                                            bookedcount: bookedcount
                                        }
                                    });


                                    callback();


                                });
                            })

                        }, done);
                    }
                ], function allTaskCompleted() {

                    // res.json(send(false,0,f_data));
                    var f_f_data = _.orderBy(f_data, function(g) {
                        return g.employeeDetails.name
                    });
                    // console.log(f_data)
                    res.json(send(false, 0, f_f_data));
                    console.log("done")
                });
            } else {

                return res.json(send(true, 2, ""));
            }

        });

    } else {
        res.json(send(true, 1, ""));
    }

}); //done
router.post('/emp/appointments', function(req, res) {
    var response = {};
    var t = new Date();
    var monthh = req.body.month ? req.body.month : t.getMonth();
    var yearr = req.body.year ? req.body.year : t.getFullYear();
    var startDate = HelperService.getFirstDateOfMonth(yearr, monthh);
    var endDate = HelperService.getLastDateOfMonth(yearr, monthh);
    var td = new Date();
    var page = req.body.page ? req.body.page : 0;
    var eid = req.body.eId;
    Appointment.find({ status: 3, "employees.employeeId": eid }).count(function(err, count) {
        response.count = count;
        var totalPage = Math.ceil(count / 5);
        response.totalPage = totalPage;
        Appointment.find({
            status: 3,
            "employees.employeeId": eid,
            "services.employees.employeeId": eid
        }).limit(5).skip(5 * page).sort({ appointmentStartTime: -1 }).exec(function(err, result) {
            if (result.length > 0) {
                var n = 0;
                var data_1 = Appointment.parseArray(result);
                var data = _.map(data_1, function(f) {

                    var totalR = 0;
                    return {
                        "appointmentId": f.appointmentId,
                        "customerName": f.client.name,
                        // "services": _.map(f.services, function (d) {
                        //     totalR = totalR + Appointment.serviceFunction(d, [{
                        //             "employeeId": eid,
                        //             "totalRevenueEmp": 0
                        //         }]).employees[0].totalRevenueEmp;
                        //     return {
                        //         "name": d.name,
                        //         "revenue": Appointment.serviceFunction(d, [{
                        //             "employeeId": eid,
                        //             "totalRevenueEmp": 0
                        //         }]).employees[0].totalRevenueEmp
                        //     }
                        // }),
                        "startTime": f.startsAt,
                        "status": f.status,
                        // "totalRevenue":totalR,
                        "subtotal": f.payableAmount,
                        "discount": (f.discount + f.membershipDiscount),
                        "loyalityPoints": f.loyalityPoints,
                        "creditUsed": f.creditUsed,
                        "amountPayable": f.payableAmount
                    };
                    n++;
                });
                var sorting = _.orderBy(data, function(o) {
                    return o.time
                })
                response.body = sorting
                res.json(send(false, 0, response));
            } else {
                res.json(response.error = true);
            }
        })
    });
});

router.post('/emp/attendance', function(req, res) {
    // 5870cfc15c63a33c0af65cc4
    var eid = req.body.eId;
    var sdate = req.body.sDate;
    var edate = req.body.eDate;
    if (edate > sdate) {
        var d_date = { $gte: sdate, $lt: edate };
    } else {
        var d_date = { $lte: edate };
    }
    // {employeeId:eid,time:{$gte:"2017-01-07T09:24:55.000Z",$lt:"2017-01-08T09:24:55.000Z"}}

    Attendance.find({ employeeId: { $regex: eid }, time: d_date }).exec(function(err, result) {

        if (result.length > 0) {

            res.json(send(false, 0, result));

        } else {
            res.json(send(true, 2, ""));
        }
    })
}); //done

router.post('/settlement', function(req, res) {
    var pId = req.body.pId;
    var period = req.body.period;
    var data1 = {};
    var pd = '';

    SettlementReport.aggregate({ "$project": { id: 1, startDate: 1, endDate: 1, period: 1 } }, {
        $group: {
            '_id': '$period',
            'startDate': { $first: '$startDate' },
            'endDate': { $first: '$endDate' },
            'period': { $first: '$period' },
        }
    }, { $sort: { period: -1 } }, { $limit: 10 }).exec(function(err, data) {
        data = _.map(data, function(d) {
            return {
                value: d.period,
                date: new Date(d.startDate.getTime() + 1000 * 60 * 5).toString().slice(0, 10) + " - " + d.endDate.toString().slice(0, 10)
            };
        })

        if (period) {
            pd = req.body.period
        } else {

            var temp = _.map(data, function(d) {
                return {
                    range: d.date,
                    period: d.value
                }

            })

            var sortted = [];
            temp.map(function(d) {
                sortted.push(d.period);
            })
            pd = _.max(sortted);
        }

        var query = { parlorId: pId, period: pd };
        SettlementReport.findOne(query).exec(function(err, result) {

            if (result) {

                console.log(temp)
                    // response.
                data1 = {

                    "_id": result._id,
                    "parlorName": result.parlorName,
                    "parlorAddress": result.parlorAddress,
                    "entity": "",
                    "periodOfSettlement": result.period,
                    "netPayable": result.netPayable,
                    "parlorId": result.parlorId,
                    "dateofsettlement": result.endDate,
                    "periods": temp
                };

                data1.servicesRevenue = {
                    "serviceRevenue": result.serviceRevenue,
                    "productRevenue": result.productRevenue,
                    "totalRevenue": result.totalRevenue,

                };

                data1.membershipRevenue = {
                    "membershipSold": result.membershipSold,
                    "membershipPurchased": result.membershipPurchased

                };
                // response.
                data1.collectionSummary = {
                    "totalCollectionByParlor": result.totalCollectionByParlor,
                    "totalCollectionByBeu": result.totalCollectionByBeu,
                    "totalCollection": result.totalCollection,
                    "collectedByLoyalityPoints": result.collectedByLoyalityPoints,
                    "collectedByApp": result.collectedByApp,
                    "collectedByAffiliates": result.collectedByAffiliates
                };
                // response.
                data1.modelSummary = {

                    "royalityPercentageService": result.royalityPercentageService,
                    "royalityPercentageProduct": result.royalityPercentageProduct,
                    "discountPercentage": result.discountPercentage
                }


                // response.
                data1.beuPayout = {
                    "amountPayableToBeu": result.amountPayableToBeu,
                    "lessDiscount": result.lessDiscount,
                    "amountPayableToBeuAfterDiscount": result.amountPayableToBeuAfterDiscount,
                    "serviceTax": result.serviceTax,
                    "amountPayableToBeuAfterTax": result.amountPayableToBeuAfterTax,

                };
                // response.
                data1.salonPayout = {

                    "amountCollectebybeu": result.totalCollectionByBeu * 1.15,

                    "addserviceTax": result.totalCollectionByBeu * 0.15,
                    "grossAmount": result.totalCollectionByBeu

                };

                data1.pendingAmount = {
                    previousPendingAmount: result.previousPendingAmount,
                    pendingAmount: result.pendingAmount,
                    netAmountTransferred: result.netAmountTransferred,
                    netPayable: result.netPayable,
                    reason: result.reason

                };
                data1.all = result
                console.log(data1)
                res.json(send(false, 0, data1));


            } else {
                res.json(send(true, 2, ""));
            }
        })
    });
}); //done
router.post('/getPeriods', function(req, res) {
    SettlementReport.aggregate({ "$project": { id: 1, startDate: 1, endDate: 1, period: 1 } }, {
        $group: {
            '_id': '$period',
            'startDate': { $first: '$startDate' },
            'endDate': { $first: '$endDate' },
            'period': { $first: '$period' },
        }
    }, { $sort: { period: -1 } }, { $limit: 10 }).exec(function(err, data) {
        data = _.map(data, function(d) {
            return {
                value: d.period,
                date: new Date(d.startDate.getTime() + 1000 * 60 * 5).toString().slice(0, 10) + " - " + d.endDate.toString().slice(0, 10)
            };
        })
        var temp = _.map(data, function(d) {
            return {
                range: d.date,
                period: d.value
            }
        })
        return res.json(send(false, 0, temp));
    });
});

router.post('/appointments', function(req, res) {
    var data = {};
    var date = req.body.date;
    var sdate = HelperService.getDayStart(date);
    var edate = HelperService.getDayEnd(date);
    var pid = req.body.pId;
    var eid = req.body.eId;
    var empname = [];
    // var page=req.body.page?req.body.page:0;

    // {"parlorId":pid,"appointmentStartTime":{$gte:sdate,$lt:edate}}
    var query = { "parlorId": pid, status: { $in: [1, 3, 4] }, "appointmentStartTime": { $gte: sdate, $lt: edate } };
    var td = new Date();
    if (eid) query = { "employees.employeeId": eid, status: 3, "appointmentStartTime": { $gte: sdate, $lt: edate } };
    // {"employees.employeeId": eid}
    console.log(query)
    var final = [];
    // var totalPage=0;
    // Appointment.find(query).count(function (err, count) {
    // totalPage = Math.ceil(count / 5);
    // console.log("count",count)
    // console.log("totalpage",totalPage)

    Appointment.find(query).sort({ "appointmentStartTime": 1 }).exec(function(err, result) {
        // res.json(result)
        var n = 0;
        data = Appointment.parseArray(result);
        // res.json(data)
        async.parallel([
            function(done) {
                async.each(data, function(employee, callback2) {
                    async.parallel([function(donee) {
                        async.each(employee.employees, function(emp, callback1) {

                            Admin.find({ _id: emp, active: true }).exec(function(err, result) {

                                // console.log('result',result[0].firstName)
                                empname.push(result[0].firstName);
                                callback1();
                            });

                        }, donee)
                    }], function allTaskCompleted() {

                        console.log(employee)

                        if (employee.status == 2) {


                        } else {
                            final.push({
                                "appointmentId": employee.appointmentId,
                                "clientName": employee.client.name,
                                "time": employee.startsAt,
                                "employees": empname,
                                "status": employee.status,
                                "services": _.map(employee.services, function(f) {
                                    return { "name": f.name }
                                }),
                                "total": employee.payableAmount
                            })
                        }

                        n++;
                        empname = [];
                        // res.json(empname)
                        callback2();

                    });

                }, done);
            }
        ], function allTaskCompleted() {
            var sorting = _.orderBy(final, function(o) {
                return o.time
            });
            res.json(send(false, 0, sorting));
        });
    });
});

router.post('/appointmentDetail', function(req, res) {


    var aid = req.body.aId;
    // var query={_id:aid}
    // if(req.body.eId){query= }
    console.log(aid);
    Appointment.find({ _id: aid }).exec(function(err, result) {
        console.log(result);

        var parser = Appointment.parse(result[0]);


        // if(parser.allPaymentMethods.length>0){
        //     var responseData=parser;
        // }else{
        //     console.log(parser.subtotal)
        //     parser.allPaymentMethods.push({"name":HelperService.getPaymentMethod(parser.paymentMethod),"amount":parser.subtotal})
        //     var responseData=parser
        // }


        res.json(send(false, 0, parser));

    })

});
// --------------------------Report----------------------------------------
router.post('/dailyReport', function(req, res) {
    console.log(req.body)

    // var date = "2017-03-21T10:25:55.956Z";
    var date = req.body.date;
    var pid = req.body.pId;
    var query = {};
    query = { _id: ObjectId(pid) };
    Appointment.dailyReport(query, date, function(err, data) {


        // res.json(data)

        var obj = {
            "distributionReports": _.map(data.reports, function(d) {
                return {
                    "business": d.unit,
                    "product": d.product,
                    "totalRevenue": parseInt(d.totalRevenue)
                }
            }),
            "collection": data.payment,
            "customers": data.customers,
            "appointmentStatus": data.status,
            "employeeDistribution": data.employee,
            "redemptionDistribution": data.redemption,
            "totalCollection": data.totalCollectionToday,
            "totalSales": parseInt(data.totalSalesToday).toFixed(1),
            "totalRevenue": parseInt(data.totalRevenueToday).toFixed(1),
            "totalAdvance": parseInt(data.totalAdvanceAdded).toFixed(1),
            "Sales": [],
            "Sale": {
                "Service": data.totalServiceSale,
                "Product": data.totalProductSale,
                "Membership": data.totalMembershipSale,
                "Total": data.totalSalesToday,
                "Averrage Invoice Sale": data.avgInvoiceSale,
                "Averrage Service Sale": data.avgServiceSale,
                "Averrage Service Per Invoice": data.avgServicesPerInvoice
            }
        };
        for (var key in obj.Sale) {
            obj.Sales.push({ key: key, value: parseInt(obj.Sale[key]) })
        }
        obj.Sale = {};
        return res.json(CreateObjService.response(false, obj));
    })
}); //done

router.post('/dayWiseCollection', function(req, res) {

    var startDate = HelperService.getDayStart(req.body.startDate);
    var endDate = HelperService.getDayEnd(req.body.endDate);

    var query = {};
    query = { _id: req.body.pId };
    var dates = {
        body: {
            startDate: HelperService.getFirstDateOfMonth(req.body.year, req.body.month),
            endDate: HelperService.getLastDateOfMonth(req.body.year, req.body.month)

        }
    };

    Appointment.collectionReport(query, dates, function(err, data) {

        var data11 = [{
                "key": "Card",
                "color": getRandomColor(),
                "values": _.map(data, function(d) {
                    var td = new Date(d.date);
                    var day = td.getDate();
                    return {
                        "label": "Day" + day,
                        "value": (d.cardPayment + d.amex)
                    }

                })
            },
            {
                "key": "Cash",
                "color": getRandomColor(),
                "values": _.map(data, function(d) {
                    var td = new Date(d.date);
                    var day = td.getDate();
                    return {
                        "label": "Day" + day,
                        "value": d.cashPayment
                    }


                })
            },
            {
                "key": "Be U",
                "color": getRandomColor(),
                "values": _.map(data, function(d) {
                    console.log(d)
                    var td = new Date(d.date);
                    var day = td.getDate();
                    return {
                        "label": "Day" + day,
                        "value": d.beU
                    }


                })
            }
        ]

        return res.json(CreateObjService.response(false, data11));
        // res.json(data);

        // var data1 =_.map(data,function (e) {
        //
        //     var td=new Date(e.date);
        //     var day=td.getDate();
        //     console.log(day)
        //     return {
        //         "key": "Day"+day,
        //         "color": getRandomColor(),
        //         "values":_.filter(_.map(e,function (s,key) {
        //             if(key=="date"){
        //             }else{
        //             return{
        //             "label":key,
        //             "value":s
        //                 }
        //             }
        //                 }),null)
        //     }
        //
        //     })

        // return res.json(CreateObjService.response(false, data1));

    });
    // res.json(dat
});
// --------------------------Admin Report-----------------------------------
router.post('/serviceReport', function(req, res) {

    // var startDate = req.body.startDate ? req.body.startDate:new Date(2017, 0, 1, 23, 59, 59);
    // var endDate = req.body.endDate ? req.body.endDate:new Date(2017, 0, 31, 23, 59, 59);

    var startDate = HelperService.getFirstDateOfMonth(req.body.year, req.body.month);
    var endDate = HelperService.getLastDateOfMonth(req.body.year, req.body.month);

    var parlorIds = req.body.pId ? req.body.pId : [];
    var query = {};
    query = { _id: { $in: parlorIds } };
    if (parlorIds.length == 0) query = {};
    SuperCategory.find({}, function(err, superCat) {
        ServiceCategory.find({}).sort({ sort: 1 }).exec(function(err, categories) {
            Service.find({}, function(err, services) {
                Parlor.find(query, { _id: 1, name: 1 }, function(err, parlors) {
                    console.log(parlors);
                    Appointment.serviceReportForAdmin(services, parlors, startDate, endDate, function(err, data) {
                        var objects = _.map(categories, function(ca) {
                            var categoriesObj = _.filter(data, function(d) {
                                return d.categoryId + "" == ca.id + ""
                            });
                            return {
                                category: ca.name,
                                superCategory: ca.superCategory,
                                categoryId: ca.id,
                                // values : categoriesObj,
                                count: _.sum(_.map(categoriesObj, function(c) {
                                    return c.count
                                })),
                                revenue: _.sum(_.map(categoriesObj, function(c) {
                                    return c.revenue
                                })),
                                parlors: _.map(parlors, function(p) {
                                    return {
                                        parlorId: p.id,
                                        count: calculateByParlor(categoriesObj, p.id),
                                        revenue: calculateByParlorRevenue(categoriesObj, p.id)
                                    };
                                })
                            };
                        });
                        var reqData = _.chain(objects)
                            .groupBy('superCategory')
                            .map(function(val, key) {
                                return {
                                    name: key,
                                    values: val,
                                    parlors: _.map(parlors, function(p) {
                                        return {
                                            parlorId: p.id,
                                            count: calculateByParlorDept(val, p.id),
                                            revenue: calculateByParlorRevenueDept(val, p.id),
                                        };
                                    }),
                                    count: _.sum(_.map(val, function(v) {
                                        return v.count
                                    })),
                                    revenue: _.sum(_.map(val, function(v) {
                                        return v.revenue
                                    })),
                                };
                            })
                            .value();

                        var keyId1 = 0;
                        var data1 = _.map(reqData, function(s) {
                            keyId1++;
                            return {
                                "key": s.name,
                                "revenue": s.revenue,
                                // "count" : s.count,
                                "count": s.count,
                                "id": keyId1
                            }

                        })
                        var keyId2 = 0;
                        var data2 = _.map(reqData, function(s) {
                            keyId2++;
                            return {
                                id: keyId2,
                                data: _.map(s.values, function(f) {
                                    return {
                                        "key": f.category,
                                        "revenue": f.revenue,
                                        "count": f.count
                                            // "count": 10
                                    }
                                })
                            }

                        })

                        return res.json(send(false, 0, [data1, data2]));
                    });
                });
            });
        });
    });
});

router.post('/weeklyReport', function(req, res) {
    var month = req.body.month;
    var d = [];
    var pid = req.body.pId;
    Parlor.find({ _id: pid }).exec(function(err, parlor) {
        Appointment.weeklyReport(parlor[0], month, function(err, data) {
            var d = data.weekData;
            var s = [];
            var service = {
                key: "Service Revenue",
                color: "#00bcd4",
                values: [],
            };
            var product = {
                key: "Product Revenue",
                color: "darkBlue",
                values: [],
            };
            var total = {
                key: "Total Revenue",
                color: "#E53935",
                values: [],
            };
            _.forEach(d, function(s, key) {
                service.values.push({
                    label: "Week" + (key + 1),
                    value: s.serviceSale,
                });
                product.values.push({
                    label: "Week" + (key + 1),
                    value: s.productSale,
                });
                total.values.push({
                    label: "Week" + (key + 1),
                    value: s.productSale + s.serviceSale,
                });
            });
            s.push(service);
            s.push(product);
            s.push(total);
            data.weekData = [];
            data.weeklyReport = s;
            res.json(s);
        });
    });
});
router.post('/adminIncentiveReport', function(req, res) {
    var d = [];
    var startDate = req.body.startDate ? req.body.startDate : new Date(2017, 0, 1, 23, 59, 59);
    var endDate = req.body.endDate ? req.body.endDate : new Date(2017, 1, 22, 23, 59, 59);
    var parlorIds = req.body.parlorId ? req.body.parlorId : [];
    var query = { parlorId: { $in: parlorIds } };
    if (parlorIds.length == 0) query = { parlorId: { $ne: null }, active: true };
    var async = require('async');
    Admin.find(query).exec(function(err, employees) {
        async.parallel([
            function(done) {
                async.each(employees, function(employee, callback) {
                    console.log(employee.firstName);
                    Appointment.employeeIncentiveReport(employee, startDate, endDate, function(err, data) {
                        d.push(data);
                        console.log("getting data success for " + employee.firstName);
                        callback();
                    })
                }, done);
            }
        ], function allTaskCompleted() {
            console.log('done');
            return res.json(d);
        });
    });
});
router.post('/parlorList', function(req, res) {
    Admin.find({ role: 2, active: true }).populate('parlorId').exec(function(err, managers) {
        console.log();
        managers = _.map(managers, function(m) {
            if (m.parlorId) {
                return {
                    parlorId: m.id,
                    name: m.parlorId.name,
                    tax: m.parlorId.tax,
                    smscode: m.parlorId.smscode,
                    latitude: m.parlorId.latitude,
                    longitude: m.parlorId.longitude,
                    gender: m.parlorId.gender,
                    smsCredits: m.parlorId.smsRemaining,
                    logo: m.parlorId.logo,
                    ownerName: "",
                    ownerPhoneNumber: "",
                    parlorIde: m.parlorId.id,
                    address: m.parlorId.address,
                    managerName: m.firstName,
                    managerPhone: m.phoneNumber,
                    managerEmail: m.emailId,
                    managerPassword: m.password,
                };
            } else return null;

        });
        managers = _.filter(managers, function(d) {
            return !_.isEmpty(d);
        });

        managers = _.uniqBy(managers, function(e) {
            return e.parlorId;
        });
        Admin.find({ role: 7, active: true }, function(err, owners) {
            _.forEach(owners, function(owner) {
                _.forEach(owner.parlorIds, function(parlorId) {
                    _.forEach(managers, function(m) {
                        if (m.parlorId == parlorId) {
                            m.ownerName = owner.firstName + " " + owner.lastName;
                            m.ownerPhoneNumber = owner.phoneNumber;
                        }
                    });
                });
            });
            return res.json({ error: false, data: managers });
        });
    });
});
router.post('/employeePerformanceReport', function(req, res) {

    var dt = new Date();
    var parlorIds = req.body.pId ? req.body.pId : [];
    var query = { parlorId: { $in: parlorIds }, active: true };
    if (parlorIds.length == 0) query = { parlorId: { $ne: null }, active: true };
    var d = [];
    var month = req.body.month;
    if (month == null) {
        month = dt.getMonth()
    }
    console.log(month)
    var m_t = month;
    var m_t2 = parseInt(month);
    var buf = [];
    if (month > 1) {
        for (var i = 0; i < 3; i++) {
            buf.push(m_t2);
            m_t2--;
        }
    } else if (month == 1) {
        for (var i = 0; i < 2; i++) {
            buf.push(m_t2);
            m_t2--;
        }
    } else if (month == 0) {
        buf.push(0);
    }
    console.log(buf);


    var responseData = [];

    var final = [];
    var data2 = [];
    var data3 = [];
    var data4 = [];
    var my_array = [];
    var final_data = [];
    var n = 0;
    // function months() {

    Admin.find(query).exec(function(err, employees) {
        async.parallel([
            function(done) {
                async.each(employees, function(employee, callback) {
                    // console.log(employee.firstName,bufdata);
                    Appointment.employeePerformanceReport(employee, buf, function(err, data) {
                        d.push(data);
                        // console.log("getting data success for " + employee.firstName+"and"+bufdata );
                        callback();
                    })
                }, done);
            }
        ], function allTaskCompleted() {


            _.map(d, function(s) {

                _.map(s.month, function(l) {

                    my_array.push({
                        name: s.name.substr(0, s.name.indexOf(' ')),
                        salary: s.empSalary,
                        month: l.month,
                        totalRevenue: l.totalRevenue
                    })
                })
            })


            var group_data = _.groupBy(my_array, function(p) {
                return p.month

            })


            var mapped = _.map(buf, function(q) {

                final_data.push({
                    "key": monthss[q],
                    "color": getRandomColor(),
                    "values": _.orderBy(_.map(group_data[q], function(f) {
                        var z = 0;
                        if (isFinite((f.salary / f.totalRevenue)) == true) {
                            z = (f.salary / f.totalRevenue).toFixed(1)
                        } else {
                            z = 0
                        }
                        return {
                            label: f.name,
                            value: z
                        }

                    }), function(t) {
                        return t.label
                    })
                })

            })

            res.json(send(false, 0, final_data));

        });
    })
});
router.post('/VitalReport', function(req, res) {
    console.log(req.body)
    console.log(new Date())
    var sdate = HelperService.getFirstDateOfMonth(req.body.year, req.body.month);
    var edate = HelperService.getLastDateOfMonth1(req.body.year, req.body.month);
    console.log(sdate)
    console.log(edate)
    var d = [];
    var pid = req.body.pId;

    var datas = {
        reports: [],
        customers: [{ type: "New Customers", number: 0, services: 0, amount: 0 }, { type: "Old Customers", number: 0, services: 0, amount: 0 }],
        totalMembershipSale: 0,
        categories: [],
        totalRevenue: 0,
        totalServiceRevenue: 0,
        totalCollection: 0,
        totalProductSale: 0,
        totalServiceSale: 0,
        totalMembershipRedeem: 0,
        totalLoyalityPoints: 0,
        totalAdvanceAdded: 0,
        payableAmount: 0,
        avgServicesPerInvoice: 0,
        totalAppointments: 0,
        totalRedemption: 0,
        parlorName: '',
        parlorAddress: '',
        employee: [],
        totalNoServices: 0
    };

    Appointment.aggregate({ $match: { parlorId: ObjectId(pid), status: 3, appointmentStartTime: { $gte: sdate, $lte: edate } } }, { $project: { serviceRevenue: 1, productRevenue: 1, client: 1, services: 1 } }, {
            $group: {
                _id: null,
                service: { $sum: "$serviceRevenue" },
                product: { $sum: "$productRevenue" },
                count: { $sum: 1 },
                other: { $push: { client: "$client", service: "$services" } }
            }
        }, { $project: { other: 1, count: 1, revenue: { $add: ["$service", "$product"] } } }

        ,
        function(err, vital) {

            var data = vital[0]

            var newClient = 0;
            var oldClient = 0;
            var services = 0;

            if (data.other.length > 0) {
                _.forEach(data.other, function(p) {

                    if (p.client.noOfAppointments == 0) {
                        newClient++
                    } else {

                        oldClient++;
                    }

                })


                _.forEach(data.other, function(p) {
                    _.forEach(p.service, function(o) {
                        services += o.quantity
                    })

                })
            }



            console.log(data.revenue)
            Appointment.aggregate([

                { $match: { parlorId: ObjectId(pid), status: 3, appointmentStartTime: { $gte: sdate, $lte: edate } } },
                { $group: { _id: "$client.id", count: { $sum: 1 } } },
                { $match: { count: { $gt: 1 } } },
                { $group: { _id: null, count: { $sum: 1 } } }
            ], function(err, repeated) {
                var rep = 0
                if (repeated.length > 0) {
                    rep = repeated[0].count
                }

                datas.totalAppointments = data.count;
                datas.totalRevenue = data.revenue;
                datas.totalNoServices = services;
                datas.repeated = rep;
                datas.customers[0].number = newClient;
                datas.customers[1].number = oldClient;
                res.json(datas)


            })

        })

});


router.post('/depReport', function(req, res) {
    var startDate = req.body.startDate;
    var endDate = req.body.endDate;
    var d = [];
    var parlorIds = req.body.pId ? req.body.pId : [];
    var query = { _id: { $in: parlorIds } };
    if (parlorIds.length == 0) query = {};
    var async = require('async');

    Parlor.find(query, { _id: 1, name: 1, address2: 1 }, function(err, parlors) {

        if (parlors) {
            async.parallel([
                function(done) {
                    async.each(parlors, function(parlor, callback) {
                        console.log(parlor.name);
                        Appointment.monthlyReport(parlor, startDate, endDate, function(err, data) {
                            d.push(data);
                            console.log("getting data success for " + parlor.name);
                            callback();
                        })
                    }, done);
                }
            ], function allTaskCompleted() {
                console.log('done');
                return res.json(send(false, 0, d));
            });

        } else if (err) {
            return res.json(send(true, 1, err));
        }

    });

});
router.post('/firebase', function(req, res) {

    var token = req.body.token;
    var eid = req.body.eId;

    console.log("firebase")
    Beu.findOne({ _id: eid }).exec(function(err, result1) {

        if (result1) {

            Beu.update({ _id: eid }, { firebaseId: token }).exec(function(err, result) {
                if (err) {
                    res.json(send(true, 1, result));
                }
                res.json(send(false, 0, result));
            })
        } else {
            Admin.findOne({ _id: eid }).exec(function(err, result2) {
                if (result2) {

                    Admin.update({ _id: eid }, { firebaseId: token }).exec(function(err, resultt) {
                        res.json(send(false, 0, result2));
                    });
                } else {

                    res.json(send(true, 1, result2));
                }
            })
        }
    })


});

router.post('/dashboard', function(req, res) {
    var ObjectId = require('mongodb').ObjectID;
    var td = new Date();
    var eid = req.body.eId
    var parlorId = req.body.pId;
    var todayStartDate = HelperService.getDayStart(td);
    var todayEndDate = HelperService.getDayEnd(td);
    var monthFirstDate = HelperService.getFirstDateOfMonth(td.getFullYear(), td.getMonth());
    var monthLastDate = HelperService.getLastDateOfMonth(td.getFullYear(), td.getMonth());
    var ytd = new Date(td - 864e5);
    var data = [];
    var parlorData = [];
    var role = req.body.role ? req.body.role : 4;
    var finalData = {
        trd: 0,
        tpd: 0,
        trdp: 0,
        tpdp: 0,
        trm: 0,
        trmp: 0,
        tpm: 0,
        tpmp: 0,
        "collections": {}
    }

    var showParlorData = 0;



    Beu.findOne({ _id: eid }, function(err, found) {
        if (found) {

            showParlorData = 1
            console.log("showing", showParlorData)
            callDashboard()
        } else {
            Admin.findOne({ _id: eid }, function(err, found2) {

                showParlorData = 0
                console.log("showing", showParlorData)
                callDashboard()
            })
        }

    })


    function callDashboard() {
        if (role == 7 || showParlorData == 1) {
            data.push({
                name: "2",
                query: {
                    "status": 3,
                    "parlorId": ObjectId(parlorId),
                    appointmentStartTime: { $gte: monthFirstDate, $lt: monthLastDate }
                }
            })
            data.push({
                name: "1",
                query: {
                    "status": 3,
                    "parlorId": ObjectId(parlorId),
                    appointmentStartTime: { $gte: todayStartDate, $lt: todayEndDate }
                }
            })
        } else {
            data.push({
                name: "2",
                query: {
                    "status": 3,
                    "parlorId": ObjectId(parlorId),
                    "employees.employeeId": ObjectId(eid),
                    appointmentStartTime: { $gte: monthFirstDate, $lt: monthLastDate }
                }
            })
            data.push({
                name: "1",
                query: {
                    "status": 3,
                    "parlorId": ObjectId(parlorId),
                    "employees.employeeId": ObjectId(eid),
                    appointmentStartTime: { $gte: todayStartDate, $lt: todayEndDate }
                }
            })
        }
        async.each(data, function(item, callback) {
            if (role == 7 || showParlorData == 1) {
                Appointment.aggregate([{ $match: item.query },
                    {
                        $group: {
                            "_id": null,
                            serviceRevenue: { "$sum": "$serviceRevenue" },
                            productRevenue: { "$sum": "$productRevenue" }
                        }
                    }
                ]).exec(function(err, resp1) {

                    parlorData.push({ name: item.name, data: resp1[0] })
                    callback()
                })
            } else {
                console.log(item.query)
                Appointment.aggregate([{ $unwind: "$employees" }, { $match: item.query },
                    {
                        $group: {
                            "_id": null,
                            serviceRevenue: { "$sum": "$employees.revenue" }

                        }
                    }
                ]).exec(function(err, resp1) {

                    // resp1[0].productRevenue=0;
                    console.log(resp1)
                    parlorData.push({ name: item.name, data: resp1[0] })
                    callback()
                })
            }


        }, function(err, done) {
            var pData = _.sortBy(parlorData, [function(o) {
                return o.name;
            }]);
            if (pData[0].data != undefined) {
                finalData.trd = pData[0].data.serviceRevenue
                finalData.tpd = pData[0].data.productRevenue

            } else {
                finalData.trd = 0
                finalData.tpd = 0
            }

            if (pData[1].data != undefined) {
                finalData.trm = pData[1].data.serviceRevenue
                finalData.tpm = pData[1].data.productRevenue
                finalData.trmp = projection(pData[1].data.serviceRevenue, monthLastDate.getDate(), ytd.getDate())
                finalData.tpmp = projection(pData[1].data.productRevenue, monthLastDate.getDate(), ytd.getDate())
            } else {
                finalData.trm = 0
                finalData.tpm = 0
                finalData.trmp = 0
                finalData.tpmp = 0
            }
            // finalData.trm = pData[1].data.serviceRevenue
            // finalData.tpm = pData[1].data.productRevenue



            if (role == 7 || showParlorData == 1) {
                var queries = [{ name: "Day", date: { $gte: todayStartDate, $lt: todayEndDate } }, {
                    name: "Month",
                    date: { $gte: monthFirstDate, $lt: monthLastDate }
                }]
                var collectionData = [];


                async.each(queries, function(item, callback) {
                    Appointment.aggregate(
                        [{
                                $match: {
                                    status: 3,
                                    parlorId: ObjectId(parlorId),
                                    "appointmentStartTime": item.date
                                }
                            },
                            {
                                $project: {
                                    paymentMethod: 1,
                                    allPaymentMethods: 1,
                                    payableAmount: 1,
                                    creditUsed: 1,
                                    loyalityPoints: 1,
                                    advanceCredits: 1
                                }
                            }, { $unwind: { path: "$allPaymentMethods", preserveNullAndEmptyArrays: true } }, {
                                $group: {
                                    _id: "$allPaymentMethods.value",
                                    data: {
                                        $push: {

                                            paymentMethod: "$paymentMethod",
                                            allPaymentMethods: "$allPaymentMethods",
                                            payableAmount: "$payableAmount",
                                            creditUsed: "$creditUsed",
                                            loyalityPoints: "$loyalityPoints",
                                            advanceCredits: "$advanceCredits"
                                        }
                                    },
                                    sum: { "$sum": "$allPaymentMethods.amount" }
                                }
                            }
                        ]
                    ).exec(function(err, result) {

                        MembershipSale.aggregate([{
                            $match: {
                                parlorId: ObjectId(parlorId),
                                createdAt: item.date
                            }
                        }, { $project: { paymentMethods: 1, price: 1 } }, {
                            $unwind: {
                                path: "$paymentMethods",
                                preserveNullAndEmptyArrays: true
                            }
                        }, {
                            $group: {
                                _id: "$paymentMethods.name",
                                sum: { "$sum": "$paymentMethods.amount" },
                                add: { $sum: "$price" }
                            }
                        }], function(err, result1) {

                            Advance.aggregate([{
                                $match: {
                                    parlorId: ObjectId(parlorId),
                                    createdAt: item.date
                                }
                            }, { $project: { paymentMethods: 1 } }, {
                                $unwind: {
                                    path: "$paymentMethods",
                                    preserveNullAndEmptyArrays: true
                                }
                            }, {
                                $group: {
                                    _id: "$paymentMethods.name",
                                    sum: { "$sum": "$paymentMethods.amount" }
                                }
                            }], function(err, result2) {

                                collectionData.push({ name: item.name, data: result, ms: result1, ad: result2 })
                                callback()
                            })

                        })


                    });

                }, function(done) {

                    var monthData = []
                    var dayData = []
                    if (collectionData[1].name == "Month") {

                        monthData = collectionData[1].data
                        dayData = collectionData[0].data
                    } else {
                        monthData = collectionData[0].data
                        dayData = collectionData[1].data

                    }


                    var cashPayment = 0,
                        cardPayment = 0,
                        beU = 0,
                        amex = 0,
                        advanceUsed = 0,
                        totalRedemption = 0,
                        totalOthers = 0;
                    _.forEach(monthData, function(d) {
                        console.log(d._id)

                        if (d._id == 1)
                            cashPayment += d.sum;
                        else if (d._id == 2)
                            cardPayment += d.sum;
                        else if (d._id == 10 || d._id == 5 || d._id == 11)
                            beU += d.sum;
                        else if (d._id == 8) {
                            amex += d.sum;
                        } else if (d._id == 4) {
                            advanceUsed += d.sum;
                            totalRedemption += d.sum;
                        } else {
                            totalOthers += d.sum;
                        }
                    })

                    _.forEach(collectionData[1].ms, function(p) {
                        console.log("pppp", p)
                        totalOthers += p.add
                        if (p._id == 1)
                            cashPayment += p.sum;
                        else
                            cardPayment += p.sum;
                    })
                    _.forEach(collectionData[1].ad, function(p) {

                        if (p._id == 1)
                            cashPayment += p.sum;
                        else
                            cardPayment += p.sum;
                    })

                    var ntotalOthers = 0
                    monthData.forEach(function(m) {
                        if (m._id == null) {

                            m.data.forEach(function(s) {
                                console.log(s.payableAmount)
                                if (s.paymentMethod == 1) cashPayment += s.payableAmount;
                                else if (s.paymentMethod == 2) cardPayment += s.payableAmount;
                                else if (s.paymentMethod == 10 || s.paymentMethod == 5 || s.paymentMethod == 11) beU += s.payableAmount;
                                else if (s.paymentMethod == 8) amex += s.payableAmount;
                                else if (s.paymentMethod == 3 || s.paymentMethod == 4) {
                                    advanceUsed += s.payableAmount;
                                    totalRedemption += s.payableAmount;
                                } else {
                                    totalOthers += s.payableAmount;
                                }
                            })
                        }
                    })

                    finalData.collections.monthCollection = []


                    finalData.collections.monthCollection.push({ mode: "Card", amount: cardPayment }, { mode: "Cash", amount: cashPayment }, { mode: "Be U", amount: beU + amex }, { mode: "Others", amount: totalOthers * 1.15 }, { mode: "Total", amount: totalOthers * 1.15 + cardPayment + cashPayment + beU + amex + advanceUsed })


                    var cashPayment = 0,
                        cardPayment = 0,
                        beU = 0,
                        amex = 0,
                        advanceUsed = 0,
                        totalRedemption = 0,
                        totalOthers = 0;
                    _.forEach(dayData, function(d) {
                        console.log(d._id)

                        if (d._id == 1)
                            cashPayment += d.sum;
                        else if (d._id == 2)
                            cardPayment += d.sum;
                        else if (d._id == 10 || d._id == 5 || d._id == 11)
                            beU += d.sum;
                        else if (d._id == 8) {
                            amex += d.sum;
                        } else if (d._id == 4) {
                            advanceUsed += d.sum;
                            totalRedemption += d.sum;
                        } else {
                            totalOthers += d.sum;
                        }
                    })

                    _.forEach(collectionData[0].ms, function(p) {
                        totalOthers += p.add
                        if (p._id == 1)
                            cashPayment += p.sum;
                        else
                            cardPayment += p.sum;
                    })
                    _.forEach(collectionData[0].ad, function(p) {

                        if (p._id == 1)
                            cashPayment += p.sum;
                        else
                            cardPayment += p.sum;
                    })

                    var ntotalOthers = 0
                    dayData.forEach(function(m) {
                        if (m._id == null) {

                            m.data.forEach(function(s) {
                                console.log(s.payableAmount)
                                if (s.paymentMethod == 1) cashPayment += s.payableAmount;
                                else if (s.paymentMethod == 2) cardPayment += s.payableAmount;
                                else if (s.paymentMethod == 10 || s.paymentMethod == 5 || s.paymentMethod == 11) beU += s.payableAmount;
                                else if (s.paymentMethod == 8) amex += s.payableAmount;
                                else if (s.paymentMethod == 3 || s.paymentMethod == 4) {
                                    advanceUsed += s.payableAmount;
                                    totalRedemption += s.payableAmount;
                                } else {
                                    totalOthers += s.payableAmount;
                                }
                            })
                        }
                    })

                    finalData.collections.dayCollection = [];


                    finalData.collections.dayCollection.push({ mode: "Card", amount: cardPayment }, { mode: "Cash", amount: cashPayment }, { mode: "Be U", amount: beU + amex }, { mode: "Others", amount: totalOthers * 1.15 }, { mode: "Total", amount: totalOthers * 1.15 + cardPayment + cashPayment + beU + amex + advanceUsed })


                    res.json(finalData)
                })

            } else {
                finalData.collections.dayCollection = []
                finalData.collections.monthCollection = []
                res.json(finalData)

            }




        })

    }

});

router.post('/employeeAccountDetails', function(req, res) {

    console.log(req.body);
    Admin.update({ "_id": req.body.uid }, { "$set": { "ifscCode": req.body.ifscCode, "accountNumber": req.body.accountNumber } }, function(err, result) {

        if (err) console.log(err)

        res.json(result)

    })
})
router.get('/employeeAccountDetails', function(req, res) {
    Admin.findOne({ "_id": req.query.uid }, function(err, result) {
        var sendData = { "accountNumber": '', "ifscCode": '' };
        console.log(result)
        if (result.accountNumber && result.ifscCode) {
            sendData.accountNumber = result.accountNumber;
            sendData.ifscCode = result.ifscCode;
        }
        res.json(sendData)

    })
});

//
// address:req.body.address,
//     distance:req.body.distance,
//     area:req.body.area,
//     city:req.body.city,
//     salaryMin:req.body.salaryMin,
//     salaryMax:req.body.salaryMax,
//     experience:req.body.experience,
//     department:req.body.department

router.post('/employeeReferral', function(req, res) {

    async.each(req.body.contactArray, function(item, cb) {

        EmployeeReferral.create({
            name: req.body.name,
            phoneNumber: req.body.phoneNumber,
            location: req.body.location,
            employeeId: req.body.employeeId,
            referredContactName: item.name,
            referredContactNumber: item.number
        }, function(err, response) {
            cb();
        })
    }, function(done) {

        res.json("done")

    })


})


router.post('/report/empAttendance', function(req, res) {

    console.log([1 + 1])


    console.log(req.body)

    var t = new Date();
    var monthh = req.body.month ? req.body.month : t.getMonth();
    var yearr = req.body.year ? req.body.year : t.getFullYear();

    var startDate = HelperService.getFirstDateOfMonth(yearr, monthh);
    var endDate = HelperService.getLastDateOfMonth(yearr, monthh);
    var sdate = HelperService.getDayStart(req.body.startDate);
    var edate = HelperService.getDayEnd(req.body.endDate);
    console.log()
    console.log(endDate)
    var att = [];
    var data = { shifts: [] };

    var final = [];
    var shifts = [];
    var eid = req.body.eId;
    console.log(req.body.page)

    if (req.body.page == 0) {
        var query = {
            "employeeId": { $regex: eid },
            "time": { $gte: startDate, $lt: new Date(Date.parse(startDate) + (10 * 24 * 3600 * 1000)) }
        }
    } else if (req.body.page == 1) {
        var query = {
            "employeeId": eid,
            "time": {
                $gte: new Date(Date.parse(startDate) + (10 * 24 * 3600 * 1000)),
                $lt: new Date(Date.parse(startDate) + (20 * 24 * 3600 * 1000))
            }
        }

    } else {
        var query = {
            "employeeId": eid,
            "time": { $gte: new Date(Date.parse(startDate) + (20 * 24 * 3600 * 1000)), $lt: endDate }
        }


    }
    // var  query= {"centerId":"kabi122018","employeeId":"588a10ebf8169604955dce95","time":{$gte:sdate,$lt:edate}}
    // var  query= {"employeeId":eid,"time":{$gte:startDate,$lt:endDate}}


    console.log(query)


    //         Attendance.aggregate( [ { $match : query },{ $sort : { time:1 } },{$group:{_id:"$centerId",data: { $push:  { time: "$time", centerId: "$centerId" } }}}]).exec(function (err,result) {
    // =======
    Attendance.aggregate([{ $match: query }, { $sort: { time: 1 } }, {
        $group: {
            _id: {
                $dateToString: {
                    format: "%Y-%m-%d",
                    date: "$time"
                }
            },
            data: { $push: { time: "$time", centerId: "$centerId" } }
        }
    }]).exec(function(err, result) {

        if (result.length > 0) {


            console.log(result[3])
            result.map(function(d) {
                var obj = { "from": '', "to": '', "centerName": '' };


                console.log("Punch")
                console.log("data length", d.data.length)
                var len = d.data.length - 1;
                if (len == 0) {

                    obj.from = d.data[0].time
                    obj.to = "Not Available"
                    obj.centerId = d.data[0].centerId
                } else {

                    obj.from = d.data[0].time
                    obj.to = d.data[len].time
                    obj.centerId = d.data[0].centerId
                }


                att.push(obj)

                // for (var i = 0; i < d.data.length; i++) {
                //
                //     if (i % 2 == 0) {
                //         obj.from = d.data[i].time;
                //         obj.centerName = d.data[i].centerId
                //         // att.push({"from":d.data[i].time}) ;
                //     } else if (i % 2 == 1) {
                //         obj.to = d.data[i].time;
                //         // att.push({"to":d.data[i].time});
                //         att.push(obj);
                //         obj = {"from": '', "to": '', "centerName": ''};
                //
                //     }
                // }

            });

            //  var l=_.sortBy(att,function (r) {
            //      return r.from
            //
            // })
            res.json(send(false, 0, att));
        } else {
            res.json(send(true, 1, ""));
        }

    });


});

function lDate(l) {
    var x = new Date(l)
    var someDate = new Date(l);
    return someDate.setDate(x.getDate() + 7);

}
router.post('/report/empAttendance1', function(req, res) {

    console.log([1 + 1])


    console.log(req.body)
    var t = new Date();
    var monthh = req.body.month ? req.body.month : t.getMonth();
    var yearr = req.body.year ? req.body.year : t.getFullYear();

    var startDate = HelperService.getFirstDateOfMonth(yearr, monthh);
    var endDate = HelperService.getLastDateOfMonth(yearr, monthh);
    var sdate = HelperService.getDayStart(req.body.startDate);
    var edate = HelperService.getDayEnd(req.body.endDate);
    console.log()
    console.log(endDate)
    var att = [];
    var data = { shifts: [] };

    var final = [];
    var shifts = [];
    var eid = req.body.eId;
    console.log(req.body.page)

    if (req.body.page == 0) {
        var query = {
            "employeeId": eid,
            "time": { $gte: startDate, $lt: new Date(Date.parse(startDate) + (10 * 24 * 3600 * 1000)) }
        }
    } else if (req.body.page == 1) {
        var query = {
            "employeeId": eid,
            "time": {
                $gte: new Date(Date.parse(startDate) + (10 * 24 * 3600 * 1000)),
                $lt: new Date(Date.parse(startDate) + (20 * 24 * 3600 * 1000))
            }
        }

    } else {
        var query = {
            "employeeId": eid,
            "time": { $gte: new Date(Date.parse(startDate) + (20 * 24 * 3600 * 1000)), $lt: endDate }
        }

    }
    // var  query= {"centerId":"kabi122018","employeeId":"588a10ebf8169604955dce95","time":{$gte:sdate,$lt:edate}}
    // var  query= {"employeeId":eid,"time":{$gte:startDate,$lt:endDate}}


    console.log(query)

    Attendance.aggregate([{ $match: query }, { $sort: { time: 1 } }, {
        $group: {
            _id: "$centerId",
            data: { $push: { time: "$time", centerId: "$centerId" } }
        }
    }]).exec(function(err, result) {


        if (result.length > 0) {
            result.map(function(d) {
                var obj = { "from": '', "to": '', "centerName": '' };


                for (var i = 0; i < d.data.length; i++) {

                    if (i % 2 == 0) {
                        obj.from = d.data[i].time;
                        obj.centerName = d.data[i].centerId
                            // att.push({"from":d.data[i].time}) ;
                    } else if (i % 2 == 1) {
                        obj.to = d.data[i].time;
                        // att.push({"to":d.data[i].time});
                        att.push(obj);
                        obj = { "from": '', "to": '', "centerName": '' };

                    }
                }

            });

            //  var l=_.sortBy(att,function (r) {
            //      return r.from
            //
            // })
            res.json(send(false, 0, att));
        } else {
            res.json(send(true, 1, ""));
        }

    });


}); // Don't rename this Api
// ---------------------------new-----------------------------
router.post('/getParlorAndWeek', function(req, res) {
    function weekDates(l) {
        var curr = new Date(l);
        var firstday = new Date(curr.setDate(curr.getDate() - curr.getDay() + 1));
        var firstday1 = new Date(firstday.getFullYear(), firstday.getMonth(), firstday.getDate());
        var lastday = new Date(curr.setDate(curr.getDate() - curr.getDay() + 7));
        var lastday1 = new Date(lastday.getFullYear(), lastday.getMonth(), lastday.getDate(), 23, 59, 59, 999);
        return { firstDate: firstday1, lastDate: lastday1 }
    }

    LuckyDraw.findOne({}, { weekNumber: 1 }, { sort: { 'weekNumber': -1 } }, function(err, w) {
        LuckyDraw.findOne({}, { weekDate: 1 }, { sort: { 'weekDate': -1 } }, function(err, d) {

            var weekNumber = w ? w.weekNumber + 1 : 1;
            var weekDate = d ? d.weekDate : new Date();



            var newDate = new Date(lDate(weekDate))

            console.log("newwwwwwwwwwwwwwwww", newDate)


            Parlor.find({}, { name: 1 }, function(err, result) {

                var dataToSend = {

                    weekweekData: { name: weekDates(newDate), weekNumber: weekNumber },
                    parlorList: result,
                    weekDate: weekDate

                }
                res.json(CreateObjService.response(false, dataToSend))
            })

        })
    });


})


router.post('/saveLuckyDraw1', function(req, res) {

    async.each(req.body, function(draw, callback) {

        console.log(new Date(lDate(draw.weekDate)))
        var query = {

            parlorId: draw.parlorId,

            parlorName: draw.parlorName,

            weekNumber: parseInt(draw.weekNumber),

            amount: draw.amount,

            employeesList: _.map(draw.employees, function(m) {

                return {

                    employeeId: m.eId,

                    firstName: m.name,
                    lastName: m.lastName
                }
            }),

            weekDate: new Date(lDate(draw.weekDate))

        }


        console.log(query)


        LuckyDraw.create(query, function(err, reult) {

            if (err) {
                console.log(err)

                res.json(CreateObjService.response(true, reult))
                callback()

            } else {

                callback()

            }

        })


    }, function(done) {


        res.json(CreateObjService.response(false, 'done'))


    })


})


router.post('/getdrawForApp', function(req, res) {


    function weekD(l) {
        var curr = new Date(l);
        var firstday = new Date(curr.setDate(curr.getDate() - curr.getDay() + 1));
        var firstday1 = new Date(firstday.getFullYear(), firstday.getMonth(), firstday.getDate());
        var lastday = new Date(curr.setDate(curr.getDate() - curr.getDay() + 7));
        var lastday1 = new Date(lastday.getFullYear(), lastday.getMonth(), lastday.getDate(), 23, 59, 59, 999);
        return { firstDate: firstday1, lastDate: lastday1 }
    }


    LuckyDraw.findOne({}, { weekNumber: 1 }, { sort: { 'weekNumber': -1 } }, function(err, week) {

        // console.log(week)

        var query = {};

        query = { weekNumber: week.weekNumber }
        if (req.body.weekNumber) query = { weekNumber: req.body.weekNumber }
        console.log(query)


        LuckyDraw.aggregate([{
            $group: {
                _id: "$weekNumber",
                date: { $push: { date: "$weekDate" } }
            }
        }, { "$sort": { "_id": 1 } }], function(err, resulta) {

            LuckyDraw.aggregate([{ $match: query }, {
                $group: {
                    _id: "$weekNumber",
                    data: {
                        $push: {

                            "parlorId": "$parlorId",
                            "parlorName": "$parlorName",
                            "weekNumber": "$weekNumber",
                            "amount": "$amount",
                            "weekDate": "$weekDate",
                            "employeesList": "$employeesList"


                        }
                    },
                    date: { $push: { date: "$weekDate" } }
                }
            }, { "$sort": { "_id": 1 } }], function(err, result) {

                // console.log(result)
                var weekList = [];


                for (var i = 0; i < resulta.length; i++) {

                    var dateCatch = weekD(resulta[i].date[0].date);
                    var string = "" + (dateCatch.firstDate).toDateString() + "-" + (dateCatch.lastDate).toDateString() + ""
                    weekList.push({ weekNumber: resulta[i]._id, name: string })
                    console.log(weekList)

                }
                // console.log(result)
                console.log(weekList)

                if (err) {
                    res.json(CreateObjService.response(true, err))

                } else {


                    res.json(CreateObjService.response(false, { weekList: weekList, data: result }))

                }


            })
        })

    })


})

router.post('/getdrawForApp1', function(req, res) {


        function weekD(l) {
            var curr = new Date(l);
            var firstday = new Date(curr.setDate(curr.getDate() - curr.getDay() + 1));
            var firstday1 = new Date(firstday.getFullYear(), firstday.getMonth(), firstday.getDate());
            var lastday = new Date(curr.setDate(curr.getDate() - curr.getDay() + 7));
            var lastday1 = new Date(lastday.getFullYear(), lastday.getMonth(), lastday.getDate(), 23, 59, 59, 999);
            return { firstDate: firstday1, lastDate: lastday1 }
        }


        LuckyDraw.findOne({}, { weekNumber: 1 }, { sort: { 'weekNumber': -1 } }, function(err, week) {

            // console.log(week)

            var query = {};

            query = { weekNumber: week.weekNumber }
            if (req.body.weekNumber) query = { weekNumber: req.body.weekNumber }
            LuckyDraw.find(query, {}, { sort: { 'weekNumber': -1 } }, function(err, result) {

                console.log(result)
                var weekList = [];

                for (var i = 1; i <= result[0].weekNumber; i++) {
                    weekList.push({ weekNumber: i })

                }

                if (err) {
                    res.json(CreateObjService.response(true, err))

                } else {

                    res.json(CreateObjService.response(false, { weekList: weekList, data: result }))

                }


            })

        })


    })
    // --------------------------------------------------------------------


router.post('/getWeeks', function(req, res) {


    var weeks = [];

    var today = new Date();
    var mfd = HelperService.getFirstDateOfMonth(today.getFullYear(), today.getMonth())
    var mld = HelperService.getLastDateOfMonth(today.getFullYear(), today.getMonth())

    var FirstWeekDates = {
        name: "1st Week",
        firstdate: new Date(today.getFullYear(), today.getMonth(), mfd.getDay() - ((mfd.getDay() - 1)), 0, 0, 0, 0),
        lastDate: new Date(today.getFullYear(), today.getMonth(), mfd.getDay() + (7 - mfd.getDay()), 23, 59, 59, 0)
    }

    function lDate(l) {
        var someDate = new Date();
        return someDate.setDate(l + 7);

    }

    var SecondWeekDates = {
        name: "2nd Week",
        firstdate: FirstWeekDates.lastDate,
        lastDate: new Date(lDate(FirstWeekDates.lastDate.getDate()))
    }
    var ThirdWeekDates = {
        name: "3rd Week",
        firstdate: SecondWeekDates.lastDate,
        lastDate: new Date(lDate(SecondWeekDates.lastDate.getDate()))
    }
    var FourthWeekDates = {
        name: "4th Week",
        firstdate: ThirdWeekDates.lastDate,
        lastDate: new Date(lDate(ThirdWeekDates.lastDate.getDate()))
    }
    var FifthWeekDates = {
        name: "5th Week",
        firstdate: FourthWeekDates.lastDate,
        lastDate: new Date(lDate(FourthWeekDates.lastDate.getDate()))
    }


    weeks.push({
        name: "1st Week",
        range: FirstWeekDates
    }, {
        name: "2nd Week",
        range: SecondWeekDates
    }, {
        name: "3rd Week",
        range: ThirdWeekDates
    }, {
        name: "4th Week",
        range: FourthWeekDates
    }, {
        name: "5th Week",
        range: FifthWeekDates
    })


    res.json(CreateObjService.response(false, weeks))

    console.log(weeks)

})


router.post('/getParlorFromWeeks', function(req, res) {


    var sDate = req.body.sdate
    var lDate = req.body.ldate

    console.log(sDate, lDate)

    var parlorList = [];
    var blackList = [];

    LuckyDraw.find({ weekDate: { $gte: sDate, $lt: lDate } }, { parlorId: 1, parlorName: 1 }).exec(function(err, result) {


        console.log(result)

        Parlor.find({}, { name: 1 }).exec(function(err, result1) {


            result.forEach(function(l) {
                blackList.push({ "_id": l.parlorId, "name": l.parlorName })
            })


            console.log(blackList)

            var result3 = _(result1)
                .differenceBy(blackList, '_id', 'name')
                .map(_.partial(_.pick, _, '_id', 'name'))
                .value();


            res.json(CreateObjService.response(false, result3))


        })


    })


})


router.post('/saveluckyDraw', function(req, res) {


    async.each(req.body, function(item) {

        var query = {
            parlorId: item.parlorId,

            parlorName: item.parlorName,

            weekName: item.weekRange.name,

            employeesList: _.map(item.employees, function(s) {

                return {
                    employeeId: s.eId,
                    firstName: s.name,
                    lastName: s.lastName
                }
            }),
            weekDate: item.weekRange.firstdate
        }

        LuckyDraw.create(query, function(err, result) {

            res.json(CreateObjService.response(false, result))

        })

    })

})


router.post('/luckyDrawWeeks', function(req, res) {

    Date.prototype.getWeek = function() {
        var onejan = new Date(this.getFullYear(), 0, 1);
        return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
    }

    var today = new Date;

    function weekDates() {
        var curr = new Date;
        var firstday = new Date(curr.setDate(curr.getDate() - curr.getDay() + 1));
        var firstday1 = new Date(firstday.getFullYear(), firstday.getMonth(), firstday.getDate());
        var lastday = new Date(curr.setDate(curr.getDate() - curr.getDay() + 7));
        var lastday1 = new Date(lastday.getFullYear(), lastday.getMonth(), lastday.getDate(), 23, 59, 59, 999);
        return { firstDate: firstday1, lastDate: lastday1, weekNumber: Math.ceil(curr.getDate() / 7) }
    }

    var query = {
        weekDate: { $gte: weekDates().firstDate, $lt: weekDates().lastDate }
    }


    LuckyDraw.find(query).exec(function(err, result) {
        var week
        if (result.length > 0) {
            if (weekDates().weekNumber == 1) {
                week = [{ week: weekDates().weekNumber + 1, name: "2nd week" }, {
                    week: weekDates().weekNumber + 2,
                    name: "3rd week"
                }, {
                    week: weekDates().weekNumber + 3,
                    name: "4th week"
                }]
            } else if (weekDates().weekNumber == 2) {
                week = [{ week: weekDates().weekNumber + 1, name: "3rd week" }, {
                    week: weekDates().weekNumber + 2,
                    name: "4th week"
                }]
            } else if (weekDates().weekNumber == 3) {
                week = [{
                    week: weekDates().weekNumber + 1,
                    name: "4th week"
                }]
            }
            console.log(week)
        } else {

            week = [{ week: 1, name: "1st week" }, { week: 2, name: "2nd week" }, {
                week: 3,
                name: "3rd week"
            }, {
                week: 4,
                name: "4th week"
            }]

        }


        Parlor.find({}, { name: 1 }).exec(function(err, results) {


            res.json(CreateObjService.response(false, { weeklist: week, parlorlist: results }))


        })


    })

})


router.post('/getLuckyDrawData', function(req, res) {

    LuckyDraw.find({}).exec(function(err, result) {

        res.json(CreateObjService.response(false, result))


    })


})


router.post('/getEmployees', function(req, res) {


    var pId = req.body.pId;

    console.log(pId)
    Admin.find({ parlorId: pId, active: true }, { firstName: 1, lastName: 1 }).exec(function(err, result) {

        res.json(CreateObjService.response(false, result))


    })


})


router.post('/postLuckyDraw', function(req, res) {

})


router.post('/sendNotification', function(req, res) {

    var resp = [];

    Admin.find({ firebaseId: { $exists: true }, active: true }, { firebaseId: 1 }, function(err, result) {

        async.each(result, function(item, callback) {
            ParlorService.sendIonicNotificationAll(item.firebaseId, req.body.tittle, req.body.message, null, function(err, response) {

                if (err) console.log(err)
                resp.push(response)
                callback()
            })

        }, function(done) {


            Beu.find({ firebaseId: { $exists: true } }, { firebaseId: 1 }, function(err, result2) {

                async.each(result2, function(item, callback2) {
                    ParlorService.sendIonicNotificationAll(item.firebaseId, req.body.tittle, req.body.message, null, function(err, response) {

                        if (err) console.log(err)
                        resp.push(response)
                        callback2()
                    })

                }, function(done2) {
                    res.json(resp)

                })
            })

        })
    })
})




router.post('/getParlorIdForUser', function(req, res) {
    var userId = req.body.userId
    var active = req.body.active
    console.log(userId)
    var parlorid = []
    var query = {}


    if (active == 0) {
        query.active = true
    } else if (active == 1) {
        query.active = false
    } else {

    }
    console.log(active)
    console.log(query)
    Beu.findOne({ _id: userId }, function(err, beu) {
        if (beu) {
            console.log(beu.parlorIds)
            if (beu.parlorIds.length > 0) {
                parlorid = beu.parlorIds
            } else {
                parlorid.push(beu.parlorId)
            }
            query._id = { $in: parlorid };

            Parlor.find(query, { name: 1 }, function(err, parl) {
                if (err) return console.log(err)
                console.log(parl)
                var sendD = _.sortBy(_.map(parl, function(k) {
                    return {
                        parlorid: k._id,
                        parlorName: k.name,

                    }

                }), function(p) {
                    return p.parlorName
                })
                res.json(CreateObjService.response(false, sendD))


            })
        } else {
            Admin.findOne({ _id: userId }, function(err, admin) {
                console.log(admin)
                if (admin.parlorIds.length > 0) {
                    parlorid = admin.parlorIds
                } else {
                    parlorid.push(admin.parlorId)
                }
                Parlor.find({ _id: { $in: parlorid } }, { name: 1 }, function(err, parl) {
                    var sendD = _.map(parl, function(k) {
                        return {
                            parlorid: k._id,
                            parlorName: k.name,

                        }

                    })
                    res.json(CreateObjService.response(false, sendD))

                })
            })
        }


    })

});



router.post('/macAddress', function(req, res) {


    Admin.update({ _id: req.body.employeeId }, { $set: { macAddress: req.body.macAddress } }, function(err, result) {
        if (err) {
            res.json(CreateObjService.response(true, "error in "))
        } else {
            res.json(CreateObjService.response(false, result))
        }
    })
})

router.post('/salonList', function(req, res) {
    var query = {}
    if (localVar.isServer() )query.active = true;
    else query.active = false;
    var empLat = req.body.latitude;
    var empLong = req.body.longitude;
    Parlor.find(query, { name: 1, phoneNumber: 1, latitude: 1, longitude: 1 }, function(err, parlor) {
        parlor.push({
            _id: "594a359d9856d3158171ea4f",
            name: "Be U Headquarters",
            contactNo: "1234567890",
            latitude: 28.549599,
            longitude: 77.2673984
        })
        var data = _.sortBy(_.map(parlor, function(p) {
            var parlorDistance = HelperService.getDistanceBtwCordinates(p.latitude, p.longitude, empLat, empLong);
            return {
                parlorId: p._id,
                name: p.name,
                contactNo: p.phoneNumber,
                latitude: p.latitude,
                longitude: p.longitude,
                parlorDistance: parlorDistance
            }
        }), function(s) {
            return s.parlorDistance;
        })

        return res.json(CreateObjService.response(false, data));
    })
})

router.post('/salonDetail', function(req, res) {

    var userId = req.body.userId;
    var parlorId = req.body.parlorId;

    Parlor.findOne({ _id: parlorId }, function(err, parlor) {

        if (((parlor.dayClosed + 1) - 2) == -1) { 
            var endDay = 6
        } else {
            endDay = (parlor.dayClosed + 1) - 2
        }

        var closingPeriod = getDayName(parlor.dayClosed + 1) + " to " + getDayName(endDay)

        var service = [];
        parlor.services.forEach(function(s) {
            service.push(s.categoryId)
        })

        var Departments = [];
        ServiceCategory.find({ _id: { $in: service } }, function(err, cat) {
            cat.forEach(function(c) {
                Departments.push(c.superCategory);
            })
            var unique = Departments.filter(function(elem, index, self) {
                return index == self.indexOf(elem);
            })

            Admin.find({ parlorId: req.body.parlorId, role: { $in: [7, 2] }, active: true }, function(err, admin) {
                var contacts = [];
                admin.forEach(function(s) {
                    contacts.push({
                        id: s._id,
                        firstName: s.firstName,
                        lastName: s.lastName,
                        emailId: s.emailId,
                        phoneNumber: s.phoneNumber,
                        position: s.position
                    })
                })

                var sendObj = {
                    name: parlor.name,
                    inParlor: false,
                    salonRating: parlor.rating,
                    closingTime: parlor.closingTime,
                    openingTime: parlor.openingTime,
                    latitude: parlor.latitude,
                    longitude: parlor.longitude,
                    dayClosed: getDayName(parlor.dayClosed),
                    closingPeriod: closingPeriod,
                    departments: unique,
                    brands: ["Loreal"],
                    salonType: parlor.parlorType,
                    priceRating: parlor.budget,
                    images: parlor.images,
                    contacts: contacts,
                    editSavedForm : false,
                };
                SalonCheckin.findOne({ userId : userId, parlorId : req.body.parlorId, "checkIncheckOuts.checkIn" : {$gt : HelperService.getTodayStart()}}, function(err, d){
                    if(d){
                        sendObj.inParlor = true;
                        if(d.formSubmitted)sendObj.editSavedForm = true;
                    }
                    console.log(sendObj);
                    return res.json(CreateObjService.response(false, sendObj));
                });

            })
        })
    })
})

router.post('/salesCheckin', function(req, res) {

    SalesCheckin.create({
        userId: req.body.userId,
        parlorName: req.body.parlorName,
        parlorPhoneNumber: req.body.parlorPhoneNumber,
        longitude: req.body.longitude,
        latitude: req.body.latitude
    }, function(err, response) {

        if (!err) {
            return res.json({ "success": true, "message": "Checked In Successfully." });
        } else {
            console.log(err)
            return res.json({ "success": false, "message": "Something went wrong try again." });
        }


    })

});

router.post("/getForm", function(req, res) {

    var formId = req.body.formId;

    console.log("form id is.....");

    console.log(formId);

    SubmitBeuForm.findOne({ "_id": ObjectId(formId) }, function(err, formData) {

        if (err) {
            return res.json(CreateObjService.response(true, "Something went wrong."));
        } else {
            return res.json(CreateObjService.response(false, formData));
        }

    });

});


router.post("/updateForm", function(req, res) {



    var questionsData = req.body.questionsData;

    console.log("id is " + req.body._id);

    var incomplete = null;

    for (var i = 0; i < questionsData.length; i++) {

        if (questionsData[i].subCategoryData) {

            for (var v = 0; v < questionsData[i].subCategoryData.length; v++) {

                for (var y = 0; y < questionsData[i].subCategoryData[v].questions.length; y++) {

                    if (questionsData[i].subCategoryData[v].questions[y].formType == "checkbox") {

                        var selected = null;

                        for (var l = 0; l < questionsData[i].subCategoryData[v].questions[y].options.length; l++) {

                            if (questionsData[i].subCategoryData[v].questions[y].options[l].selectedValue === undefined) {

                            } else {
                                selected = 1;
                            }
                        }

                        if (!selected) {
                            incomplete = 1;
                            // console.log("Checkbox Not selected");
                        }

                    }

                    if (questionsData[i].subCategoryData[v].questions[y].formType == "radio") {

                        // console.log("radio here");

                        var selected = null;

                        for (var l = 0; l < questionsData[i].subCategoryData[v].questions[y].options.length; l++) {

                            if (questionsData[i].subCategoryData[v].questions[y].options[l].selectedValue === undefined) {

                            } else {

                                // console.log("coming in else");

                                selected = 1;
                            }
                        }

                        console.log(selected);

                        if (!selected) {
                            incomplete = 1;
                            // console.log("Radio Not selected");
                        }

                    }

                    if (questionsData[i].subCategoryData[v].questions[y].formType == "dropDown") {

                        // console.log("dropdown here");

                        var selected = null;

                        for (var l = 0; l < questionsData[i].subCategoryData[v].questions[y].options.length; l++) {

                            if (questionsData[i].subCategoryData[v].questions[y].options[l].selectedValue === undefined) {

                            } else {

                                // console.log("coming in else");

                                selected = 1;
                            }
                        }

                        console.log(selected);

                        if (!selected) {
                            incomplete = 1;
                            // console.log("dropdown Not selected");
                        }

                    }

                    if (questionsData[i].subCategoryData[v].questions[y].formType == "text") {

                        var selected = null;

                        if (questionsData[i].subCategoryData[v].questions[y].selectedValue === undefined) {

                        } else {
                            selected = 1;
                        }

                        if (!selected) {
                            incomplete = 1;
                            // console.log("Text not filled");
                        }

                    }

                    if (questionsData[i].subCategoryData[v].questions[y].formType == "range") {

                        var selected = null;

                        if (questionsData[i].subCategoryData[v].questions[y].selectedValue === undefined) {

                        } else {
                            selected = 1;
                        }

                        if (!selected) {
                            incomplete = 1;
                            // console.log("Range not filled");
                        }

                    }

                }
            }

        } else {


            for (var k = 0; k < questionsData[i].questions.length; k++) {


                if (questionsData[i].questions[k].formType == "checkbox") {

                    var selected = null;

                    for (var l = 0; l < questionsData[i].questions[k].options.length; l++) {

                        if (questionsData[i].questions[k].options[l].selectedValue === undefined) {

                        } else {
                            selected = 1;
                        }
                    }

                    if (!selected) {
                        incomplete = 1;
                        // console.log("Checkbox Not selected");
                    }

                }

                if (questionsData[i].questions[k].formType == "radio") {

                    // console.log("radio here");

                    var selected = null;

                    for (var l = 0; l < questionsData[i].questions[k].options.length; l++) {

                        if (questionsData[i].questions[k].options[l].selectedValue === undefined) {

                        } else {

                            // console.log("coming in else");

                            selected = 1;
                        }
                    }

                    console.log(selected);

                    if (!selected) {
                        incomplete = 1;
                        // console.log("Radio Not selected");
                    }

                }

                if (questionsData[i].questions[k].formType == "dropDown") {

                    // console.log("dropdown here");

                    var selected = null;

                    for (var l = 0; l < questionsData[i].questions[k].options.length; l++) {

                        if (questionsData[i].questions[k].options[l].selectedValue === undefined) {

                        } else {

                            // console.log("coming in else");

                            selected = 1;
                        }
                    }

                    console.log(selected);

                    if (!selected) {
                        incomplete = 1;
                        // console.log("dropdown Not selected");
                    }

                }

                if (questionsData[i].questions[k].formType == "text") {

                    var selected = null;

                    if (questionsData[i].questions[k].selectedValue === undefined) {

                    } else {
                        selected = 1;
                    }

                    if (!selected) {
                        incomplete = 1;
                        // console.log("Text not filled");
                    }

                }

                if (questionsData[i].questions[k].formType == "range") {

                    var selected = null;

                    if (questionsData[i].questions[k].selectedValue === undefined) {

                    } else {
                        selected = 1;
                    }

                    if (!selected) {
                        incomplete = 1;
                        // console.log("Range not filled");
                    }

                }

            } //for till here

        }

    }

    if (incomplete) {
        console.log("incomplete")

        SubmitBeuForm.update({ "_id": req.body._id }, req.body, function(err, updated) {
            if (err) {
                return res.json(CreateObjService.response(true, "Form could not be updated."));
            } else {
                return res.json(CreateObjService.response(true, "Form updated."))
            }
        });

    } else {
console.log("complete")
        // SalonCheckin.findOne({ "formId": req.body._id }, { "_id": 1 }, function(err, response) {
            // if (err) {
                // return res.json(CreateObjService.response(true, "Form could not be updated."));
            // } else {

                // SalonCheckin.update({ "_id": ObjectId(response._id) }, { $set: { formStatus: "1" } }, function(err1, up) {
                    // if (err1) {
                        // return res.json(CreateObjService.response(true, "Form could not be updated."));
                    // } else {

                        SubmitBeuForm.update({ "_id": req.body._id }, req.body, function(err2, updated) {

                            if (err2) {
                                return res.json(CreateObjService.response(true, "Form could not be updated."));
                            } else {
                                console.log(req.body);
                                SalonCheckin.update({checkInFormId : req.body._id}, {formSubmitted : true}, function(er, f){
                                    console.log(f);
                                    console.log("f");
                                    return res.json(CreateObjService.response(true, "Form updated"))
                                })
                            }
                        });
                    // }
                // })
            // }
        // }).sort({ "$natural": -1 })
    }

});

router.post('/checkOut', function(req, res) {
    SalonCheckin.findOne({parlorId : req.body.parlorId,"checkIncheckOuts.checkIn" : {$gt : HelperService.getTodayStart() }}, function(err, f){
        if(f){
            return res.json(CreateObjService.response(false, { "formId": f.checkInFormId, "formStatus": f.formSubmitted, "message": " Opening form" }));
        }else{
            return res.json(CreateObjService.response(true, "No form Found"));
        }
    })
})

router.post('/createOwner', function(req, res) {
    var query = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        emailId: req.body.emailId,
        password: req.body.password,
        gender: req.body.gender,
        parlorId: req.body.parlorId,
        position: "Owner",
        type: 1,
        role: 7
    };

    Admin.create(query, function(err, response) {
        if (err) {

            return res.json(CreateObjService.response(true, "Data cannot be submit"));
        } else {
            return res.json(CreateObjService.response(false, "Submitted"));
        }


    })

})

router.post('/editContact', function(req, res) {
    Admin.update({ _id: req.body.memberId }, {
        $set: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            emailId: req.body.emailId,
            phoneNumber: req.body.phoneNumber
        }
    }, function(err, response) {
        if (err) {

            return res.json(CreateObjService.response(true, "Error in Updating"));
        } else {
            return res.json(CreateObjService.response(false, "Successfully Updated"));
        }


    })

});

router.post('/showQuestionsOnApp', function(req, res) {
    var data = [];
    var role = req.body.role;
    BeUFormQuestions.aggregate([{
            $match: {
                showOnApp: true,
                // role :
            }
        },
        {
            $unwind: "$categories"
        },
        {
            $group: {
                _id: "$categories.formCategoryId",
                categoryId: { $first: "$categories.formCategoryId" },
                categoryName: { $first: "$categories.categoryName" },
                subCategoryName: { $first: "$categories.subCategoryName" },
                formSubCategoryId: { $first: "$categories.formSubCategoryId" },
                questions: {
                    $push: {
                        questionId: "$_id",
                        formType: "$formType",
                        question: "$question",
                        options: "$options",
                        minRange: "$minRange",
                        maxRange: "$maxRange"
                    }
                }
            }
        }
    ]).exec(function(err, forms) {
        Admin.find({ parlorId: ObjectId("599a83cb28a9761b0de6d11a"), role: { $in: [4] } }, function(err, employee) {
            _.forEach(forms, function(form) {
                if (form.subCategoryName) {
                    var arr = {}
                    arr.categoryName = form.categoryName,
                        arr.categoryId = form.categoryId,
                        arr.subCategoryName = form.subCategoryName,
                        arr.formSubCategoryId = form.formSubCategoryId,
                        arr.subCategoryData = _.map(employee, function(emp) {
                            return {
                                subCategoryId: emp._id,
                                name: emp.firstName,
                                questions: form.questions
                            }
                        })

                    data.push(arr)

                } else {
                    data.push(form)
                }
            })
            return res.json(CreateObjService.response(false, data));
        })
    })
});

router.post('/showQuestionsOnApp2b', function(req, res) {
    var category = req.body.categoryId
        // var data=[]
    var allData = [];
    Admin.find({ parlorId: req.body.parlorId, role: { $in: [4] }, active: true }, function(err, employee) {
        async.each(employee, function(emp, cb) {
            BeUFormQuestions.aggregate([
                { $match: { showOnApp: true } },
                { $project: { formType: 1, question: 1, options: 1, minRange: 1, maxRange: 1, 'categories.categoryName': 1 } }, { $unwind: "$categories" },
                { $group: { _id: "$categories.categoryName", questions: { $push: { formType: "$formType", question: "$question", options: "$options", minRange: "$minRange", maxRange: "$maxRange" } } } }
            ]).exec(function(err, forms) {
                allData.push({ employeeId: emp._id, name: emp.firstName, form: forms[0] })
                cb();
            })
        }, function(done) {
            return res.json(CreateObjService.response(false, allData));
        })
    }).limit(4)

});

router.post('/createBeuFormCategory', function(req, res) {
    BeUFormCategory.create(BeUFormCategory.createBeuFormCategories(req), function(err, formCategory) {
        if (err) {
            console.log(err);
            console.log("error in creating new object");
            response.message = 'Error in creating new object';
            return res.json("can't create");
        } else {
            return res.json('successfully created');
        }
    })
});

router.post('/createBeuFormSubCategory', function(req, res) {
    BeUFormSubCategory.create(BeUFormSubCategory.createBeuFormSubCategories(req), function(err, formCategory) {
        if (err) {
            console.log(err);
            console.log("error in creating new object");
            response.message = 'Error in creating new object';
            return res.json("can't create");
        } else {
            return res.json('successfully created');
        }
    })
});

function formCreate(userId, parlorId, cb) {

    // console.log("coming here in form create");

    var data = [];
    BeUFormQuestions.aggregate([{
            $match: {
                showOnApp: true,
                // role :4
            }
        },
        {
            $unwind: "$categories"
        },
        {
            $group: {
                _id: "$categories.formCategoryId",
                categoryId: { $first: "$categories.formCategoryId" },
                categoryName: { $first: "$categories.categoryName" },
                subCategoryName: { $first: "$categories.subCategoryName" },
                formSubCategoryId: { $first: "$categories.formSubCategoryId" },
                questions: {
                    $push: {
                        questionId: "$_id",
                        formType: "$formType",
                        question: "$question",
                        options: "$options",
                        minRange: "$minRange",
                        maxRange: "$maxRange"
                    }
                }
            }
        }, { $sort: { sortOrder: 1 } }
    ]).exec(function(err, forms) {
        Admin.find({ parlorId: parlorId, active: true /*role:{$in:[4]} */ }, function(err, employee) {
            _.forEach(forms, function(form) {
                if (form.subCategoryName) {
                    // console.log("------------------------")
                    var arr = {}
                    arr.categoryName = form.categoryName,
                        arr.categoryId = form.categoryId,
                        arr.subCategoryName = form.subCategoryName,
                        arr.formSubCategoryId = form.formSubCategoryId,
                        arr.subCategoryData = _.map(employee, function(emp) {
                            return {
                                subCategoryId: emp._id,
                                name: (emp.firstName).toUpperCase(),
                                questions: form.questions
                            }
                        })

                    data.push(arr)

                } else if (!form.subCategoryName) {
                    data.push(form)
                }

            })

            SalonCheckin.find({ "parlorId": ObjectId(parlorId), "userId": userId, /*"checkOut" : {$eq : null},*/ "formId": { $exists: true } }, function(err, submitForm) {
                if (err) {
                    cb("Something went wrong in fetching form id.", null);
                } else {
                    if (submitForm.length > 0) {

                        var createdAt = (new Date(submitForm[0].createdAt)).getDate();
                        var today = (new Date()).getDate();

                        console.log("diff is " + createdAt + " " + today);

                        if (today >= createdAt) {
                            cb(null, { formId: submitForm[0].formId, formStatus: submitForm[0].formStatus });
                        } else {
                            SubmitBeuForm.create(SubmitBeuForm.submitNewFormObj({ data: data, opsId: userId, parlorId: parlorId, oneMonth: false }), function(err, submitForm) {
                                if (err) {
                                    cb("Something went wrong in fetching form id.", null);
                                } else {
                                    cb(null, { formId: submitForm._id, formStatus: "0" });
                                }
                            })

                        }

                    } else {
                        SubmitBeuForm.create(SubmitBeuForm.submitNewFormObj({ data: data, opsId: userId, parlorId: parlorId, oneMonth: false }), function(err, submitForm) {
                            if (err) {
                                cb("Something went wrong in fetching form id.", null);
                            } else {
                                cb(null, { formId: submitForm._id, formStatus: "0" });
                            }
                        })
                    }

                }

            }).sort({ "$natural": -1 }).limit(1);

        })
    })
}

var returnTrackerObj = function(userId, visitId, lat, long, parlorId, time, checkInCheckout, count) {

    console.log("----------------------Times are ---------", (new Date(time)).getMinutes(), (new Date(time)).getMilliseconds())

    if (parlorId == null) {
        return { userId: userId, VisitId: visitId, latitude: lat, longitude: long, macAddress: "", parlorId: parlorId, count: count, time: time, checkInCheckout: checkInCheckout, uniqueHash: ((userId).toString() + "" + (new Date(time)).getDate() + "" + (new Date(time)).getMonth() + "" + (new Date(time)).getFullYear() + "" + (new Date(time)).getHours() + "" + (new Date(time)).getMinutes() + "" + (new Date(time)).getSeconds() + "" + (new Date(time)).getMilliseconds() + "" + checkInCheckout.toString()) };
    } else {
        return { userId: userId, VisitId: visitId, latitude: lat, longitude: long, macAddress: "", parlorId: parlorId, time: time, count: count, checkInCheckout: checkInCheckout, uniqueHash: ((userId).toString() + "" + (parlorId).toString() + "" + (new Date(time)).getDate() + "" + (new Date(time)).getMonth() + "" + (new Date(time)).getFullYear() + "" + (new Date(time)).getHours() + "" + (new Date(time)).getMinutes() + "" + (new Date(time)).getSeconds() + "" + (new Date(time)).getMilliseconds() + "" + checkInCheckout.toString()) };
    }
}

var returnCheckinObj = function(userId, time, checkOut, lat, long, parlorId, creationFlag) {
    return { userId: userId, checkIn: new Date(time), checkOut: checkOut, latitude: lat, longitude: long, parlorId: parlorId, creationFlag: creationFlag, uniqueHash: ((userId).toString() + "" + (parlorId).toString() + "" + (new Date(time)).getDate() + "" + (new Date(time)).getMonth() + "" + (new Date(time)).getFullYear() + "" + (new Date(time)).getHours() + "" + (new Date(time)).getMinutes()) };
}

router.post("/checkIn", function(req, res) {

    console.log(new Date());

    var lat = req.body.latitude;
    var long = req.body.longitude;
    var time = req.body.time;
    console.log("time is ");
    console.log(time);
    var userId = req.body.userId;
    var parlorIdbyApp = req.body.parlorId;
    var parlorId = null;
    var parlorName = null;
    var ct = new Date();
    var tc = new Date(time);
    var ctd = ct.getDate(),
        ctm = ct.getMonth(),
        cty = ct.getFullYear(),
        tcd = tc.getDate(),
        tcm = tc.getMonth(),
        tcy = tc.getFullYear();

    if ((tcy < cty) || (tcm < ctm) || (tcd < ctd)) {
        return res.json(CreateObjService.response(true, "Can not check in on past date"));
    }

    Parlor.find({ $or: [{ "active": true }, { "_id": "594a359d9856d3158171ea4f" }] }, { name: 1, latitude: 1, longitude: 1 }, function(err, parlors) {
        parlors.forEach(function(p) {
            var distance = HelperService.getDistanceBtwCordinates1(p.latitude, p.longitude, lat, long);
            var value = (distance * 100)
            console.log("dis is " + value);
            if (value <= 20) {
                parlorId = p._id;
                parlorName = p.name;
            }
        })

        if (parlorId) {

            console.log("got a parlor");

            console.log(parlorId);

            if (parlorId && (parlorId).toString() == (parlorIdbyApp).toString()) {

                console.log("coming here.....");

                SalonCheckin.find({ userId: userId }, function(err, prev) {
                    if ((prev.length > 0) && (prev[0].checkOut == null)) {
                        if ((prev[0].parlorId).toString() == (parlorId).toString()) {
                            var pt = new Date(prev[0].checkIn);
                            var ptd = pt.getDate(),
                                ptm = pt.getMonth(),
                                pty = pt.getFullYear();
                            if ((pty < tcy) || (ptm < tcm) || (ptd < tcd)) {
                                LocationTracker.create(returnTrackerObj(userId, prev[0]._id, lat, long, prev[0].parlorId, time, 1), function(err, locator1) {
                                    if (err && err.code != 11000) {
                                        return res.json(CreateObjService.response(true, "Server Error"));
                                    } else if (locator1) {
                                        LocationTracker.create(returnTrackerObj(userId, null, lat, long, null, time, 2), function(err, locator2) {
                                            if (err && err.code != 11000) {
                                                return res.json(CreateObjService.response(true, "Server Error"));
                                            } else if (locator2) {
                                                SalonCheckin.find({ "userId": userId }, function(err, prev) {
                                                    if (err) {
                                                        return res.json(CreateObjService.response(true, "Server Error"));
                                                    }
                                                    if (prev.length > 0) {
                                                        if (prev[0].checkOut == null && prev[0].parlorId != null) {
                                                            LocationTracker.find({ "userId": userId, parlorId: prev[0].parlorId, checkInCheckout: 0 }, { time: 1 }, function(err, obj) {
                                                                if (err) {
                                                                    return res.json(CreateObjService.response(true, "Server Error"));
                                                                } else {
                                                                    var checkOutTime = time;
                                                                    if (obj.length > 0) {
                                                                        checkOutTime = obj[0].time;
                                                                    }
                                                                    SalonCheckin.update({ _id: prev[0]._id }, { $set: { checkOut: checkOutTime } }, function(err, updated) {
                                                                        if (err) {
                                                                            return res.json(CreateObjService.response(true, "Server Error"));
                                                                        } else {
                                                                            SalonCheckin.create({
                                                                                userId: userId,
                                                                                checkIn: time,
                                                                                checkOut: null,
                                                                                latitude: lat,
                                                                                longitude: long,
                                                                                parlorId: parlorId,
                                                                                checkinFlag: true,
                                                                                uniqueHash: ((userId).toString() + "" + (parlorId).toString() + "" + (new Date(time)).getDate() + "" + (new Date(time)).getMonth() + "" + (new Date(time)).getFullYear() + "" + (new Date(time)).getHours() + "" + (new Date(time)).getMinutes())
                                                                            }, function(err, created) {
                                                                                console.log("------------------" , created)
                                                                                if (err) {
                                                                                    return res.json(CreateObjService.response(true, "Server Error"));
                                                                                } else {
                                                                                    LocationTracker.create(returnTrackerObj(userId, created._id, lat, long, created.parlorId, time, 0), function(err, locator) {
                                                                                        if (err && err.code != 11000) {
                                                                                            return res.json(CreateObjService.response(true, "Server Error"));
                                                                                        } else {
                                                                                            formCreate(userId, parlorId, function(err, formData) {
                                                                                                if (err) {
                                                                                                    return res.json(CreateObjService.response(true, "Server Error"));
                                                                                                }
                                                                                                if (formData) {
                                                                                                console.log("aay#############################")
                                                                                                    SalonCheckin.update({ _id: ObjectId(created._id) }, { $set: { formId: formData.formId, formStatus: formData.formStatus } }, function(err, updated) {
                                                                                                        if (err) {
                                                                                                            return res.json(CreateObjService.response(true, "Server Error"));
                                                                                                        }
                                                                                                         if (updated) {
                                                                                                            return res.json(CreateObjService.response(false, { "formId": formData.formId, "formStatus": formData.formStatus, "message": "Checked in successfully" }));
                                                                                                        }
                                                                                                    });
                                                                                                }
                                                                                            });
                                                                                        }
                                                                                    })
                                                                                }
                                                                            })
                                                                        }
                                                                    })
                                                                }
                                                            }).sort({ $natural: -1 }).limit(1);
                                                        } else {
                                                            SalonCheckin.create({
                                                                userId: userId,
                                                                checkIn: time,
                                                                checkOut: null,
                                                                latitude: lat,
                                                                longitude: long,
                                                                parlorId: parlorId,
                                                                checkinFlag: true,
                                                                uniqueHash: ((userId).toString() + "" + (parlorId).toString() + "" + (new Date(time)).getDate() + "" + (new Date(time)).getMonth() + "" + (new Date(time)).getFullYear() + "" + (new Date(time)).getHours() + "" + (new Date(time)).getMinutes())
                                                            }, function(err, created) {
                                                                if (err) {
                                                                    return res.json(CreateObjService.response(true, "Server Error"));
                                                                } else {
                                                                    LocationTracker.create(returnTrackerObj(userId, created._id, lat, long, created.parlorId, time, 0), function(err, locator) {
                                                                        if (err && err.code != 11000) {
                                                                            return res.json(CreateObjService.response(true, "Server Error"));
                                                                        } else {
                                                                            formCreate(userId, parlorId, function(err, formData) {
                                                                                if (err) {
                                                                                    return res.json(CreateObjService.response(true, "Server Error"));
                                                                                }
                                                                                if (formData) {
                                                                                    SalonCheckin.update({ _id: ObjectId(created._id) }, { $set: { formId: formData.formId, formStatus: formData.formStatus } }, function(err, updated) {
                                                                                        if (err) {
                                                                                            return res.json(CreateObjService.response(true, "Server Error"));
                                                                                        }
                                                                                        if (updated) {
                                                                                            return res.json(CreateObjService.response(false, { "formId": formData.formId, "formStatus": formData.formStatus, "message": "Checked In Successfully" }));
                                                                                        }
                                                                                    });
                                                                                }
                                                                            });
                                                                        }
                                                                    })
                                                                }
                                                            })
                                                        }
                                                    } else {
                                                        SalonCheckin.create({
                                                            userId: userId,
                                                            checkIn: time,
                                                            checkOut: null,
                                                            latitude: lat,
                                                            longitude: long,
                                                            parlorId: parlorId,
                                                            checkinFlag: true,
                                                            uniqueHash: ((userId).toString() + "" + (parlorId).toString() + "" + (new Date(time)).getDate() + "" + (new Date(time)).getMonth() + "" + (new Date(time)).getFullYear() + "" + (new Date(time)).getHours() + "" + (new Date(time)).getMinutes())
                                                        }, function(err, created) {
                                                            if (err && err.code != 11000) {
                                                                return res.json(CreateObjService.response(true, "Server Error"));
                                                            } else {
                                                                LocationTracker.create(returnTrackerObj(userId, created._id, lat, long, created.parlorId, time, 0), function(err, locator) {
                                                                    if (err && err.code != 11000) {
                                                                        return res.json(CreateObjService.response(true, "Server Error"));
                                                                    } else {
                                                                        formCreate(userId, parlorId, function(err, formData) {
                                                                            if (err) {
                                                                                return res.json(CreateObjService.response(true, "Server Error"));
                                                                            }
                                                                            if (formData) {
                                                                                SalonCheckin.update({ _id: ObjectId(created._id) }, { $set: { formId: formData.formId, formStatus: formData.formStatus } }, function(err, updated) {
                                                                                    if (err) {
                                                                                        return res.json(CreateObjService.response(true, "Server Error"));
                                                                                    }
                                                                                    if (updated) {
                                                                                        return res.json(CreateObjService.response(false, { "formId": formData.formId, "formStatus": formData.formStatus, "message": "Checked In Successfully" }));
                                                                                    }
                                                                                });
                                                                            }
                                                                        });
                                                                    }
                                                                })
                                                            }
                                                        })
                                                    }
                                                }).sort({ $natural: -1 }).limit(1);
                                            }
                                        })
                                    }
                                })
                            } else {
                                LocationTracker.create(returnTrackerObj(userId, prev[0]._id, lat, long, prev[0].parlorId, time, 0), function(err, location) {
                                    if (err && err.code != 11000) {
                                        return res.json(CreateObjService.response(true, "Server Error"));
                                    }
                                    if (location) {
                                        formCreate(userId, parlorId, function(err, formData) {
                                            if (err) {
                                                return res.json(CreateObjService.response(true, "Form could not be updated."));
                                            }
                                            if (formData) {
                                                SalonCheckin.update({ _id: ObjectId(prev[0]._id) }, { $set: { formId: formData.formId, formStatus: formData.formStatus } }, function(err, updated) {
                                                    if (err) {
                                                        return res.json(CreateObjService.response(true, "Checked In and form could not be updated."));
                                                    }
                                                    if (updated) {
                                                        return res.json(CreateObjService.response(false, { "formId": formData.formId, "formStatus": formData.formStatus, "message": "Already checked in at " + (new Date(prev[0].checkIn)).getHours() + ":" + (new Date(prev[0].checkIn)).getMinutes() }));
                                                    }
                                                });
                                            }
                                        });
                                    }
                                })
                            }
                        } else {
                            LocationTracker.create(returnTrackerObj(userId, prev[0]._id, lat, long, prev[0].parlorId, time, 1), function(err, locator1) {
                                if (err && err.code != 11000) {
                                    return res.json(CreateObjService.response(true, "Server Error"));
                                } else if (locator1) {
                                    LocationTracker.create(returnTrackerObj(userId, null, lat, long, null, time, 2), function(err, locator2) {
                                        if (err && err.code != 11000) {
                                            return res.json(CreateObjService.response(true, "Server Error"));
                                        } else if (locator2) {
                                            SalonCheckin.find({ "userId": userId }, function(err, prev) {
                                                if (err) {
                                                    return res.json(CreateObjService.response(true, "Server Error"));
                                                }
                                                if (prev.length > 0) {
                                                    if (prev[0].checkOut == null && prev[0].parlorId != null) {
                                                        LocationTracker.find({ "userId": userId, parlorId: prev[0].parlorId, checkInCheckout: 0 }, { time: 1 }, function(err, obj) {
                                                            if (err) {
                                                                return res.json(CreateObjService.response(true, "Server Error"));
                                                            } else {
                                                                var checkOutTime = time;
                                                                if (obj.length > 0) {
                                                                    checkOutTime = obj[0].time;
                                                                }
                                                                SalonCheckin.update({ _id: prev[0]._id }, { $set: { checkOut: checkOutTime } }, function(err, updated) {
                                                                    if (err) {
                                                                        return res.json(CreateObjService.response(true, "Server Error"));
                                                                    } else {
                                                                        SalonCheckin.create({
                                                                            userId: userId,
                                                                            checkIn: time,
                                                                            checkOut: null,
                                                                            latitude: lat,
                                                                            longitude: long,
                                                                            parlorId: parlorId,
                                                                            checkinFlag: true,
                                                                            uniqueHash: ((userId).toString() + "" + (parlorId).toString() + "" + (new Date(time)).getDate() + "" + (new Date(time)).getMonth() + "" + (new Date(time)).getFullYear() + "" + (new Date(time)).getHours() + "" + (new Date(time)).getMinutes())
                                                                        }, function(err, created) {
                                                                            if (err && err.code != 11000) {
                                                                                return res.json(CreateObjService.response(true, "Server Error"));
                                                                            } else {
                                                                                LocationTracker.create(returnTrackerObj(userId, created._id, lat, long, created.parlorId, time, 0), function(err, locator) {
                                                                                    if (err && err.code != 11000) {
                                                                                        return res.json(CreateObjService.response(true, "Server Error"));
                                                                                    } else {
                                                                                        formCreate(userId, parlorId, function(err, formData) {
                                                                                            if (err) {
                                                                                                return res.json(CreateObjService.response(true, "Server Error"));
                                                                                            }
                                                                                            if (formData) {
                                                                                                SalonCheckin.update({ _id: ObjectId(created._id) }, { $set: { formId: formData.formId, formStatus: formData.formStatus } }, function(err, updated) {
                                                                                                    if (err) {
                                                                                                        return res.json(CreateObjService.response(true, "Server Error"));
                                                                                                    }
                                                                                                    if (updated) {
                                                                                                        return res.json(CreateObjService.response(false, { "formId": formData.formId, "formStatus": formData.formStatus, "message": "Checked in successfully" }));
                                                                                                    }
                                                                                                });
                                                                                            }
                                                                                        });
                                                                                    }
                                                                                })
                                                                            }
                                                                        })
                                                                    }
                                                                })
                                                            }
                                                        }).sort({ $natural: -1 }).limit(1);
                                                    } else {
                                                        SalonCheckin.create({
                                                            userId: userId,
                                                            checkIn: time,
                                                            checkOut: null,
                                                            latitude: lat,
                                                            longitude: long,
                                                            parlorId: parlorId,
                                                            checkinFlag: true,
                                                            uniqueHash: ((userId).toString() + "" + (parlorId).toString() + "" + (new Date(time)).getDate() + "" + (new Date(time)).getMonth() + "" + (new Date(time)).getFullYear() + "" + (new Date(time)).getHours() + "" + (new Date(time)).getMinutes())
                                                        }, function(err, created) {
                                                            if (err && err.code != 11000) {
                                                                return res.json(CreateObjService.response(true, "Server Error"));
                                                            } else {
                                                                LocationTracker.create(returnTrackerObj(userId, created._id, lat, long, created.parlorId, time, 0), function(err, locator) {
                                                                    if (err && err.code != 11000) {
                                                                        return res.json(CreateObjService.response(true, "Server Error"));
                                                                    } else {
                                                                        formCreate(userId, parlorId, function(err, formData) {
                                                                            if (err) {
                                                                                return res.json(CreateObjService.response(true, "Server Error"));
                                                                            }
                                                                            if (formData) {
                                                                                SalonCheckin.update({ _id: ObjectId(created._id) }, { $set: { formId: formData.formId, formStatus: formData.formStatus } }, function(err, updated) {
                                                                                    if (err) {
                                                                                        return res.json(CreateObjService.response(true, "Server Error"));
                                                                                    }
                                                                                    if (updated) {
                                                                                        return res.json(CreateObjService.response(false, { "formId": formData.formId, "formStatus": formData.formStatus, "message": "Checked In Successfully" }));
                                                                                    }
                                                                                });
                                                                            }
                                                                        });
                                                                    }
                                                                })
                                                            }
                                                        })
                                                    }
                                                } else {
                                                    SalonCheckin.create({
                                                        userId: userId,
                                                        checkIn: time,
                                                        checkOut: null,
                                                        latitude: lat,
                                                        longitude: long,
                                                        parlorId: parlorId,
                                                        checkinFlag: true,
                                                        uniqueHash: ((userId).toString() + "" + (parlorId).toString() + "" + (new Date(time)).getDate() + "" + (new Date(time)).getMonth() + "" + (new Date(time)).getFullYear() + "" + (new Date(time)).getHours() + "" + (new Date(time)).getMinutes())
                                                    }, function(err, created) {
                                                        if (err && err.code != 11000) {
                                                            return res.json(CreateObjService.response(true, "Server Error"));
                                                        } else {
                                                            LocationTracker.create(returnTrackerObj(userId, created._id, lat, long, created.parlorId, time, 0), function(err, locator) {
                                                                if (err && err.code != 11000) {
                                                                    return res.json(CreateObjService.response(true, "Server Error"));
                                                                } else {
                                                                    formCreate(userId, parlorId, function(err, formData) {
                                                                        if (err) {
                                                                            return res.json(CreateObjService.response(true, "Server Error"));
                                                                        }
                                                                        if (formData) {
                                                                            SalonCheckin.update({ _id: ObjectId(created._id) }, { $set: { formId: formData.formId, formStatus: formData.formStatus } }, function(err, updated) {
                                                                                if (err) {
                                                                                    return res.json(CreateObjService.response(true, "Server Error"));
                                                                                }
                                                                                if (updated) {
                                                                                    return res.json(CreateObjService.response(false, { "formId": formData.formId, "formStatus": formData.formStatus, "message": "Checked In Successfully" }));
                                                                                }
                                                                            });
                                                                        }
                                                                    });
                                                                }
                                                            })
                                                        }
                                                    })
                                                }
                                            }).sort({ $natural: -1 }).limit(1);
                                        }
                                    })
                                }
                            })
                        }
                    } else {
                        SalonCheckin.create({
                            userId: userId,
                            checkIn: time,
                            checkOut: null,
                            latitude: lat,
                            longitude: long,
                            parlorId: parlorId,
                            checkinFlag: true,
                            uniqueHash: ((userId).toString() + "" + (parlorId).toString() + "" + (new Date(time)).getDate() + "" + (new Date(time)).getMonth() + "" + (new Date(time)).getFullYear() + "" + (new Date(time)).getHours() + "" + (new Date(time)).getMinutes())
                        }, function(err, created) {
                            if (err && err.code != 11000) {
                                return res.json(CreateObjService.response(true, "Server Error"));
                            }
                            if (created) {
                                LocationTracker.create(returnTrackerObj(userId, created._id, lat, long, created.parlorId, time, 0), function(err, location) {
                                    if (err && err.code != 11000) {
                                        return res.json(CreateObjService.response(true, "Server Error"));
                                    } else {
                                        formCreate(userId, parlorId, function(err, formData) {
                                            if (err) {
                                                console.log("Form data could not be updated!");
                                                return false;
                                            }
                                            if (formData) {

                                                SalonCheckin.update({ _id: ObjectId(created._id) }, { $set: { formId: formData.formId, formStatus: formData.formStatus } }, function(err, updated) {
                                                    if (err) {
                                                        return res.json(CreateObjService.response(true, "Checked In and form could not be updated."));
                                                    }
                                                    if (updated) {
                                                        return res.json(CreateObjService.response(false, { "formId": formData.formId, "formStatus": formData.formStatus, "message": "Checked in successfully." }));
                                                    }
                                                });
                                            }
                                        });
                                    }
                                })
                            }
                        })
                    }
                }).sort({ $natural: -1 }).limit(1);
            } else {
                return res.json(CreateObjService.response(true, "You are too away to check in."));
            }
        } else {

            console.log("outside parlor");

            SalonCheckin.find({ userId: userId }, {}, function(err, prev) {
                if (err) {
                    console.log("coming here 1");
                    return res.json(CreateObjService.response(true, "Server Error"));
                }
                if (prev.length > 0) {
                    if (prev[0].checkOut == null) {
                        LocationTracker.find({ "userId": userId, parlorId: prev[0].parlorId, checkInCheckout: 0 }, { time: 1 }, function(err, obj) {
                            if (err) {
                                console.log("coming here 2");
                                return res.json(CreateObjService.response(true, "Server Error"));
                            } else {
                                var checkOutTime = time;
                                if (obj.length > 0) {
                                    checkOutTime = obj[0].time;
                                }

                                SalonCheckin.update({ _id: ObjectId(prev[0]._id) }, { $set: { checkOut: checkOutTime } }, function(err, updated) {
                                    if (err) {
                                        console.log("coming here 3");
                                        return res.json(CreateObjService.response(true, "Server Error"));
                                    }
                                    if (updated) {
                                        LocationTracker.find({
                                            userId: userId
                                        }, function(err, locationinParlor) {
                                            if (locationinParlor.length > 0) {
                                                if (locationinParlor[0].checkInCheckout == 0) {
                                                    LocationTracker.create(returnTrackerObj(userId, prev[0]._id, lat, long, prev[0].parlorId, time, 1), function(err, locator1) {
                                                        if (err && err.code != 11000) {
                                                            console.log("coming here 4");
                                                            return res.json(CreateObjService.response(true, "Server Error"));
                                                        }
                                                        if (locator1) {
                                                            LocationTracker.create(returnTrackerObj(userId, null, lat, long, null, time, 2), function(err, locator2) {
                                                                if (err && err.code != 11000) {
                                                                    console.log("coming here 5");
                                                                    return res.json(CreateObjService.response(true, "Server Error"));
                                                                }
                                                                if (locator2) {
                                                                    return res.json(CreateObjService.response(true, "You are too away to check in."));
                                                                }
                                                            })
                                                        }
                                                    })
                                                } else if (locationinParlor[0].checkInCheckout == 1) {
                                                    LocationTracker.create(returnTrackerObj(userId, null, lat, long, null, time, 2), function(err, locator) {
                                                        if (err && err.code != 11000) {
                                                            console.log("coming here 6");
                                                            return res.json(CreateObjService.response(true, "Server Error"));
                                                        }
                                                        if (locator) {
                                                            return res.json(CreateObjService.response(true, "You are too away to check in."));
                                                        }

                                                    })
                                                } else {
                                                    LocationTracker.create(returnTrackerObj(userId, null, lat, long, null, time, 2), function(err, locator2) {
                                                        if (err && err.code != 11000) {
                                                            console.log("coming here 7");
                                                            return res.json(CreateObjService.response(true, "Server Error"));
                                                        }
                                                        if (locator2) {
                                                            return res.json(CreateObjService.response(true, "You are too away to check in."));
                                                        }
                                                    })
                                                }
                                            } else {
                                                LocationTracker.create(returnTrackerObj(userId, null, lat, long, null, time, 2), function(err, locator2) {
                                                    if (err && err.code != 11000) {
                                                        console.log("coming here 8");
                                                        return res.json(CreateObjService.response(true, "Server Error"));
                                                    }
                                                    if (locator2) {
                                                        return res.json(CreateObjService.response(true, "You are too away to check in."));
                                                    }
                                                })
                                            }
                                        }).sort({ $natural: -1 }).limit(1);
                                    }
                                });
                            }
                        })
                    } else {
                        LocationTracker.create(returnTrackerObj(userId, null, lat, long, null, time, 2), function(err, locator) {
                            if (err && err.code != 11000) {
                                console.log("coming here 9");
                                return res.json(CreateObjService.response(true, "Server Error"));
                            }
                            if (locator) {
                                return res.json(CreateObjService.response(true, "You are too away to check in."));
                            }
                        })
                    }
                } else {
                    console.log(time);
                    console.log(new Date(time));
                    LocationTracker.create(returnTrackerObj(userId, null, lat, long, null, time, 2), function(err, locator2) {
                        console.log(returnTrackerObj(userId, null, lat, long, null, time, 2));
                        if (err && err.code != 11000) {
                            console.log("coming here 10");
                            console.log(err);
                            return res.json(CreateObjService.response(true, "Server Error"));
                        }
                        if (locator2) {
                            return res.json(CreateObjService.response(true, "You are too away to check in."));
                        }
                    })
                }
            }).sort({ $natural: -1 }).limit(1);
        }
    })
});

router.post("/locationTracker", function(req, res) {


    async.eachSeries(req.body, function(location, cb) {
        var lat = location.latitude;
        var long = location.longitude;
        var time = location.time;
        var userId = location.userId;
        var parlorId = null;
        var parlorName = null;
        Beu.findOne({
            _id: userId
        }, function(err, employee) {
            Parlor.find({ $or: [{ "active": true }, { "_id": "594a359d9856d3158171ea4f" }] }, {
                name: 1,
                latitude: 1,
                longitude: 1
            }, function(err, parlors) {
                _.forEach(parlors, function(parlor) {
                        var distance = HelperService.getDistanceBtwCordinates1(parlor.latitude, parlor.longitude, lat, long);
                        var value = (distance * 100)
                        if (value <= 20) {
                            parlorId = parlor._id;
                            parlorName = parlor.name;
                        }
                    }) //foreach ends
                var updateCheckin = function(id, formId, formStatus) {
                    SalonCheckin.update({ _id: ObjectId(id) }, { $set: { formId: formId, formStatus: formStatus } }, function(err, updated) {
                        if (err) {
                            cb();
                        }
                        if (updated) {
                            cb();
                        }
                    });
                }
                if (parlorId) {
                    LocationTracker.find({ "userId": userId }, function(err, prevloc) {
                        if (prevloc.length > 0) {
                            if (prevloc[0].checkInCheckout == 0) {
                                if ((parlorId).toString() == (prevloc[0].parlorId).toString()) {
                                    SalonCheckin.find({ "userId": userId }, function(err, prev) {
                                        if (err) {
                                            cb()
                                        } else if (prev.length > 0) {
                                            if ((prev[0].parlorId).toString() == (parlorId).toString()) {
                                                var checkedAt = (new Date(prev[0].checkIn)).getDate();
                                                var today = (new Date()).getDate();
                                                if (today > checkedAt) {
                                                    LocationTracker.create(returnTrackerObj(userId, prev[0]._id, lat, long, prev[0].parlorId, time, 1), function(err, locator1) {
                                                        if (err && err.code != 11000) {
                                                            console.log("here 1")
                                                            cb()
                                                        } else if (locator1) {
                                                            LocationTracker.create(returnTrackerObj(userId, null, lat, long, null, time, 2), function(err, locator2) {
                                                                if (err) {
                                                                    console.log("here 2")
                                                                    cb()
                                                                } else if (locator2) {
                                                                    SalonCheckin.find({ "userId": userId }, function(err, prev) {
                                                                        if (err) {
                                                                            console.log("here 3")
                                                                            cb()
                                                                        }
                                                                        if (prev.length > 0) {
                                                                            if (prev[0].checkOut == null && prev[0].parlorId != null) {
                                                                                LocationTracker.find({ "userId": userId, parlorId: prev[0].parlorId, checkInCheckout: 0 }, { time: 1 }, function(err, obj) {
                                                                                    if (err) {
                                                                                        console.log("here 4")
                                                                                        cb();
                                                                                    } else {
                                                                                        var checkOutTime = time;
                                                                                        if (obj.length > 0) {
                                                                                            checkOutTime = obj[0].time;
                                                                                        }
                                                                                        SalonCheckin.update({ _id: prev[0]._id }, { $set: { checkOut: checkOutTime } }, function(err, updated) {
                                                                                            if (err) {
                                                                                                console.log("here 5")
                                                                                                cb();
                                                                                            } else {
                                                                                                SalonCheckin.create(returnCheckinObj(userId, time, null, lat, long, parlorId, 1), function(err, created) {
                                                                                                    if (err) {
                                                                                                        console.log("here 6")
                                                                                                        cb();
                                                                                                    } else {
                                                                                                        LocationTracker.create(returnTrackerObj(userId, created._id, lat, long, created.parlorId, time, 0), function(err, locator) {
                                                                                                            if (err && err.code != 11000) {
                                                                                                                console.log("here 7")
                                                                                                                cb()
                                                                                                            } else { //vv
                                                                                                                formCreate(userId, parlorId, function(err, formData) {
                                                                                                                    if (err) {
                                                                                                                        console.log("here 8")
                                                                                                                        cb();
                                                                                                                    }
                                                                                                                    if (formData) {
                                                                                                                        updateCheckin(created._id, formData.formId, formData.formStatus);
                                                                                                                    }
                                                                                                                });
                                                                                                            }
                                                                                                        })
                                                                                                    }
                                                                                                })
                                                                                            } //else ends here
                                                                                        })
                                                                                    }
                                                                                }).sort({ $natural: -1 }).limit(1);
                                                                            } else { //checkout not null
                                                                                SalonCheckin.create(returnCheckinObj(userId, time, null, lat, long, parlorId, 2), function(err, created) {
                                                                                    if (err) {
                                                                                        cb();
                                                                                    } else {
                                                                                        LocationTracker.create(returnTrackerObj(userId, created._id, lat, long, created.parlorId, time, 0), function(err, locator) {
                                                                                            if (err && err.code != 11000) {
                                                                                                console.log("here 9")
                                                                                                cb()
                                                                                            } else {
                                                                                                formCreate(userId, parlorId, function(err, formData) {
                                                                                                    if (err) {
                                                                                                        console.log("here 10")
                                                                                                        cb();
                                                                                                    }
                                                                                                    if (formData) {
                                                                                                        updateCheckin(created._id, formData.formId, formData.formStatus);
                                                                                                    }
                                                                                                });
                                                                                            }
                                                                                        })
                                                                                    }
                                                                                })
                                                                            }
                                                                        } else {
                                                                            SalonCheckin.create(returnCheckinObj(userId, time, null, lat, long, parlorId, 3), function(err, created) {
                                                                                if (err) {
                                                                                    console.log("here 11")
                                                                                    cb();
                                                                                } else {
                                                                                    LocationTracker.create(returnTrackerObj(userId, created._id, lat, long, created.parlorId, time, 0), function(err, locator) {
                                                                                        if (err && err.code != 11000) {
                                                                                            console.log("here 12")
                                                                                            cb()
                                                                                        } else {
                                                                                            formCreate(userId, parlorId, function(err, formData) {
                                                                                                if (err) {
                                                                                                    console.log("here 13")
                                                                                                    cb();
                                                                                                }
                                                                                                if (formData) {
                                                                                                    updateCheckin(created._id, formData.formId, formData.formStatus);
                                                                                                }
                                                                                            });
                                                                                        }
                                                                                    })
                                                                                }
                                                                            })
                                                                        }
                                                                    }).sort({ $natural: -1 }).limit(1);
                                                                }
                                                            })
                                                        }
                                                    })
                                                } else {
                                                    LocationTracker.create(returnTrackerObj(userId, prev[0]._id, lat, long, parlorId, time, 0), function(err, locator) {
                                                        cb();
                                                    })
                                                }
                                            } else {
                                                LocationTracker.create(returnTrackerObj(userId, prev[0]._id, lat, long, prev[0].parlorId, time, 1), function(err, locator1) {
                                                    if (err && err.code != 11000) {
                                                        cb()
                                                    } else if (locator1) {
                                                        LocationTracker.create(returnTrackerObj(userId, null, lat, long, null, time, 2), function(err, locator2) {
                                                            if (err) {
                                                                cb()
                                                            } else if (locator2) {
                                                                SalonCheckin.find({ "userId": userId }, function(err, prev) {
                                                                    if (err) {
                                                                        cb()
                                                                    }
                                                                    if (prev.length > 0) {
                                                                        if (prev[0].checkOut == null && prev[0].parlorId != null) {
                                                                            LocationTracker.find({ "userId": userId, parlorId: prev[0].parlorId, checkInCheckout: 0 }, { time: 1 }, function(err, obj) {
                                                                                if (err) {
                                                                                    cb();
                                                                                } else {
                                                                                    var checkOutTime = time;
                                                                                    if (obj.length > 0) {
                                                                                        checkOutTime = obj[0].time;
                                                                                    }
                                                                                    SalonCheckin.update({ _id: prev[0]._id }, { $set: { checkOut: checkOutTime } }, function(err, updated) {
                                                                                        if (err) {
                                                                                            cb();
                                                                                        } else {
                                                                                            SalonCheckin.create(returnCheckinObj(userId, time, null, lat, long, parlorId, 1), function(err, created) {
                                                                                                if (err) {
                                                                                                    cb();
                                                                                                } else {
                                                                                                    LocationTracker.create(returnTrackerObj(userId, created._id, lat, long, created.parlorId, time, 0), function(err, locator) {
                                                                                                        if (err && err.code != 11000) {
                                                                                                            cb()
                                                                                                        } else { //vv
                                                                                                            formCreate(userId, parlorId, function(err, formData) {
                                                                                                                if (err) {
                                                                                                                    cb();
                                                                                                                }
                                                                                                                if (formData) {
                                                                                                                    updateCheckin(created._id, formData.formId, formData.formStatus);
                                                                                                                }
                                                                                                            });
                                                                                                        }
                                                                                                    })
                                                                                                }
                                                                                            })
                                                                                        } //else ends here
                                                                                    })
                                                                                }
                                                                            }).sort({ $natural: -1 }).limit(1);
                                                                        } else { //checkout not null
                                                                            SalonCheckin.create(returnCheckinObj(userId, time, null, lat, long, parlorId, 2), function(err, created) {
                                                                                if (err) {
                                                                                    cb();
                                                                                } else {
                                                                                    LocationTracker.create(returnTrackerObj(userId, created._id, lat, long, created.parlorId, time, 0), function(err, locator) {
                                                                                        if (err && err.code != 11000) {
                                                                                            cb()
                                                                                        } else {
                                                                                            formCreate(userId, parlorId, function(err, formData) {
                                                                                                if (err) {
                                                                                                    cb();
                                                                                                }
                                                                                                if (formData) {
                                                                                                    updateCheckin(created._id, formData.formId, formData.formStatus);
                                                                                                }
                                                                                            });
                                                                                        }
                                                                                    })
                                                                                }
                                                                            })
                                                                        }
                                                                    } else {
                                                                        SalonCheckin.create(returnCheckinObj(userId, time, null, lat, long, parlorId, 3), function(err, created) {
                                                                            if (err) {
                                                                                cb();
                                                                            } else {
                                                                                LocationTracker.create(returnTrackerObj(userId, created._id, lat, long, created.parlorId, time, 0), function(err, locator) {
                                                                                    if (err && err.code != 11000) {
                                                                                        cb()
                                                                                    } else {
                                                                                        formCreate(userId, parlorId, function(err, formData) {
                                                                                            if (err) {
                                                                                                cb();
                                                                                            }
                                                                                            if (formData) {
                                                                                                updateCheckin(created._id, formData.formId, formData.formStatus);
                                                                                            }
                                                                                        });
                                                                                    }
                                                                                })
                                                                            }
                                                                        })
                                                                    }
                                                                }).sort({ $natural: -1 }).limit(1);
                                                            }
                                                        })
                                                    }
                                                })
                                            }
                                        }
                                    }).sort({ $natural: -1 }).limit(1);

                                } else {
                                    LocationTracker.create(returnTrackerObj(userId, prevloc[0].VisitId, lat, long, prevloc[0].parlorId, time, 1), function(err, locator1) {
                                        if (err && err.code != 11000) {
                                            cb()
                                        } else if (locator1) {
                                            LocationTracker.create(returnTrackerObj(userId, null, lat, long, null, time, 2), function(err, locator2) {
                                                if (err && err.code != 11000) {
                                                    cb()
                                                } else if (locator2) {
                                                    SalonCheckin.find({ "userId": userId }, function(err, prev) {
                                                        if (err) {
                                                            cb()
                                                        }
                                                        if (prev.length > 0) {
                                                            if (prev[0].checkOut == null && prev[0].parlorId != null) {
                                                                LocationTracker.find({ "userId": userId, parlorId: prev[0].parlorId, checkInCheckout: 0 }, { time: 1 }, function(err, obj) {
                                                                    if (err) {
                                                                        cb();
                                                                    } else {
                                                                        var checkOutTime = time;
                                                                        if (obj.length > 0) {
                                                                            checkOutTime = obj[0].time;
                                                                        }
                                                                        SalonCheckin.update({ _id: prev[0]._id }, { $set: { checkOut: checkOutTime } }, function(err, updated) {
                                                                            if (err) {
                                                                                cb();
                                                                            } else {
                                                                                SalonCheckin.create(returnCheckinObj(userId, time, null, lat, long, parlorId, 4), function(err, created) {
                                                                                    if (err) {
                                                                                        cb();
                                                                                    } else {
                                                                                        LocationTracker.create(returnTrackerObj(userId, created._id, lat, long, created.parlorId, time, 0), function(err, locator) {
                                                                                            if (err && err.code != 11000) {
                                                                                                cb()
                                                                                            } else {
                                                                                                formCreate(userId, parlorId, function(err, formData) {
                                                                                                    if (err) {
                                                                                                        cb();
                                                                                                    }
                                                                                                    if (formData) {
                                                                                                        updateCheckin(created._id, formData.formId, formData.formStatus);
                                                                                                    }
                                                                                                });
                                                                                            }
                                                                                        })
                                                                                    }
                                                                                })
                                                                            } //else ends here
                                                                        })
                                                                    }
                                                                }).sort({ $natural: -1 }).limit(1);
                                                            } else { //checkout not null
                                                                SalonCheckin.create(returnCheckinObj(userId, time, null, lat, long, parlorId, 5), function(err, created) {
                                                                    if (err) {
                                                                        cb();
                                                                    } else {
                                                                        LocationTracker.create(returnTrackerObj(userId, created._id, lat, long, created.parlorId, time, 0), function(err, locator) {
                                                                            if (err && err.code != 11000) {
                                                                                cb()
                                                                            } else {
                                                                                formCreate(userId, parlorId, function(err, formData) {
                                                                                    if (err) {
                                                                                        cb();
                                                                                    }
                                                                                    if (formData) {
                                                                                        updateCheckin(created._id, formData.formId, formData.formStatus);
                                                                                    }
                                                                                });
                                                                            }
                                                                        })
                                                                    }
                                                                })
                                                            }
                                                        } else {
                                                            SalonCheckin.create(returnCheckinObj(userId, time, null, lat, long, parlorId, 6), function(err, created) {
                                                                if (err) {
                                                                    cb();
                                                                } else {
                                                                    LocationTracker.create(returnTrackerObj(userId, created._id, lat, long, created.parlorId, time, 0), function(err, locator) {
                                                                        if (err && err.code != 11000) {
                                                                            cb()
                                                                        } else {
                                                                            formCreate(userId, parlorId, function(err, formData) {
                                                                                if (err) {
                                                                                    cb();
                                                                                }
                                                                                if (formData) {
                                                                                    updateCheckin(created._id, formData.formId, formData.formStatus);
                                                                                }
                                                                            });
                                                                        }
                                                                    })
                                                                }
                                                            })
                                                        }
                                                    }).sort({ $natural: -1 }).limit(1);
                                                }
                                            })
                                        }
                                    })
                                } //else ends here
                            } else if (prevloc[0].checkInCheckout == 1) {
                                if ((parlorId).toString() == (prevloc[0].parlorId).toString()) {
                                    SalonCheckin.create(returnCheckinObj(userId, time, null, lat, long, parlorId, 10), function(err, created) {
                                        if (err) {
                                            cb();
                                        } else {
                                            LocationTracker.create(returnTrackerObj(userId, created._id, lat, long, created.parlorId, time, 0), function(err, locator) {
                                                if (err && err.code != 11000) {
                                                    cb()
                                                } else {
                                                    formCreate(userId, parlorId, function(err, formData) {
                                                        if (err) {
                                                            cb();
                                                        }
                                                        if (formData) {
                                                            updateCheckin(created._id, formData.formId, formData.formStatus);
                                                        }
                                                    });
                                                }
                                            });
                                        } //else ends here
                                    })
                                } else {
                                    LocationTracker.create(returnTrackerObj(userId, null, lat, long, null, time, 2), function(err, locator) {
                                        if (err && err.code != 11000) {
                                            cb();
                                        } else {
                                            SalonCheckin.create(returnCheckinObj(userId, time, null, lat, long, parlorId, 7), function(err, created) {
                                                if (err) {
                                                    cb();
                                                } else {
                                                    LocationTracker.create(returnTrackerObj(userId, created._id, lat, long, created.parlorId, time, 0), function(err, locator) {
                                                        if (err && err.code != 11000) {
                                                            cb()
                                                        } else {
                                                            formCreate(userId, parlorId, function(err, formData) {
                                                                if (err) {
                                                                    cb();
                                                                }
                                                                if (formData) {
                                                                    updateCheckin(created._id, formData.formId, formData.formStatus);
                                                                }
                                                            });
                                                        }
                                                    });
                                                } //else ends here
                                            })
                                        }
                                    })
                                }
                            } else if (prevloc[0].checkInCheckout == 2) {
                                if ((prevloc[0].parlorId != null) && (parlorId).toString() == (prevloc[0].parlorId).toString()) {
                                    LocationTracker.create(returnTrackerObj(userId, null, lat, long, null, time, 2), function(err, locator) {
                                        cb();
                                    })
                                } else {
                                    SalonCheckin.create(returnCheckinObj(userId, time, null, lat, long, parlorId, 8), function(err, created) {
                                        if (err) {
                                            cb();
                                        } else {
                                            LocationTracker.create(returnTrackerObj(userId, created._id, lat, long, created.parlorId, time, 0), function(err, locator) {
                                                if (err && err.code != 11000) {
                                                    cb()
                                                } else {
                                                    formCreate(userId, parlorId, function(err, formData) {
                                                        if (err) {
                                                            cb();
                                                        }
                                                        if (formData) {
                                                            updateCheckin(created._id, formData.formId, formData.formStatus);
                                                        }
                                                    });
                                                }
                                            })
                                        } //else ends here
                                    })
                                }
                            }
                        } else {
                            SalonCheckin.create(returnCheckinObj(userId, time, null, lat, long, parlorId, 9), function(err, created) {

                                console.log("this checkin obj is going in......");

                                console.log(returnCheckinObj(userId, time, null, lat, long, parlorId, 9));

                                console.log("coming here in 9");

                                if (err) {
                                    cb();
                                } else {

                                    console.log("coming here in else");

                                    LocationTracker.create(returnTrackerObj(userId, created._id, lat, long, created.parlorId, time, 0), function(err, locator) {

                                        console.log(returnTrackerObj(userId, created._id, lat, long, created.parlorId, time, 0));

                                        if (err && err.code != 11000) {
                                            cb()
                                        } else {


                                            console.log("coming here in form create");

                                            formCreate(userId, parlorId, function(err, formData) {
                                                if (err) {
                                                    cb();
                                                }
                                                if (formData) {

                                                    console.log(formData);

                                                    console.log("update done");

                                                    updateCheckin(created._id, formData.formId, formData.formStatus);
                                                }
                                            });
                                        }
                                    })
                                }
                            })
                        }
                    }).sort({ $natural: -1 }).limit(1);
                } else { //not in parlor
                    console.log("coming in else");

                    LocationTracker.find({ "userId": userId }, function(err, prevloc) {
                        if (err) {
                            cb();
                        }
                        if (prevloc.length > 0) {
                            if (prevloc[0].checkInCheckout == 0) {
                                SalonCheckin.find({ "userId": userId }, function(err, prev) {
                                    if (prev.length > 0) {
                                        if (prev[0].checkOut == null && prev[0].parlorId != null) {
                                            if ((prevloc[0].parlorId).toString() == (prev[0].parlorId).toString()) {
                                                var checkOutTime = prevloc[0].time;
                                            } else {
                                                checkOutTime = time;
                                            }
                                            SalonCheckin.update({ "_id": prev[0]._id }, { $set: { checkOut: checkOutTime } }, function(err, updated) {
                                                if (err) {
                                                    cb();
                                                } else if (updated) {
                                                    LocationTracker.create(returnTrackerObj(userId, prev[0]._id, lat, long, prev[0].parlorId, time, 1), function(err, locator) {
                                                        cb();
                                                    })
                                                } else {
                                                    cb();
                                                }
                                            })
                                        } else {
                                            LocationTracker.create(returnTrackerObj(userId, prev[0]._id, lat, long, prev[0].parlorId, time, 1), function(err, locator) {
                                                cb();
                                            })
                                        }
                                    } else {
                                        LocationTracker.create(returnTrackerObj(userId, null, lat, long, null, time, 2), function(err, locator) {
                                            cb();
                                        })
                                    }
                                }).sort({ $natural: -1 }).limit(1);
                            } else if (prevloc[0].checkInCheckout == 1) {
                                LocationTracker.create(returnTrackerObj(userId, null, lat, long, null, time, 2), function(err, locator) {
                                    cb();
                                })
                            } else if (prevloc[0].checkInCheckout == 2) {
                                LocationTracker.create(returnTrackerObj(userId, null, lat, long, null, time, 2), function(err, locator) {
                                    cb();
                                })
                            }
                        } else {
                            LocationTracker.create(returnTrackerObj(userId, null, lat, long, null, time, 2), function(err, locator) {
                                cb();
                            })
                        }
                    }).sort({ $natural: -1 }).limit(1);
                } //outside parlor ends
            })
        })
    }, function(done) {
        return res.json(CreateObjService.response(false, "done"));
    })
});

router.post('/submitBeUForm', function(req, res) {
    var bodyData = req.body
    SubmitBeuForm.create(SubmitBeuForm.submitNewFormObj(bodyData), function(err, submitForm) {
        if (err) {
            return res.json(CreateObjService.response(false, "Error"));
        } else {
            return res.json(CreateObjService.response(false, "done"));
        }
    })
});

router.get('/listBeuFormCategories', function(req, res) {
    BeUFormCategory.find({}, { name: 1, sortOrder: 1 }, function(err, category) {
        return res.json(CreateObjService.response(false, category));
    })
});

router.post('/listBeuFormSubCategories', function(req, res) {
    console.log(req.body)
    var category = req.body[0].categoryId
    console.log(category)
    BeUFormSubCategory.find({ categoryId: category }, { name: 1, categoryId: 1 }, function(err, category) {
        return res.json(CreateObjService.response(false, category));
    })
});

router.post('/createBeuFormQuestions', function(req, res) {
    BeUFormQuestions.createBeuFormObj(req, function(err, opsForm) {
        if (err) {

            return res.json(CreateObjService.response(true, "Error"));

        } else {

            return res.json(CreateObjService.response(false, "Successfully Created"));
        }
    })
});

router.post('/listFormQuestions', function(req, res) {

    if (req.body.action == "edit") {
        var questionId = req.body.questionId;
        console.log(req.body.data)
        BeUFormQuestions.update({ _id: questionId }, req.body.data, function(err, updated) {
            if (updated) {
                return res.json('Successfully updated');
            }
        })
    } else if (req.body.action == "delete") {
        var questionId = req.body.questionId;
        BeUFormQuestions.update({ _id: questionId }, { showOnApp: false }, function(err, updated) {
            if (updated) {
                return res.json('The Question is no more visible on App');
            }
        })
    } else if (req.body.action == "undo") {
        var questionId = req.body.questionId;
        BeUFormQuestions.update({ _id: questionId }, { showOnApp: true }, function(err, updated) {
            if (updated) {
                return res.json('The Question is visible on App');
            }
        })
    } else {
        var data = []
        BeUFormQuestions.find({}).sort({ sortOrder: 1 }).exec(function(err, questions) {
            _.forEach(questions, function(question) {
                var arr = {};
                arr.questionId = question._id,
                    arr.formType = question.formType,
                    arr.question = question.question,
                    arr.showOnApp = question.showOnApp,
                    arr.categories = question.categories,
                    arr.options = question.options,
                    arr.minRange = question.minRange,
                    arr.maxRange = question.maxRange,
                    arr.role = question.roles,
                    arr.sortOrder = question.sortOrder

                data.push(arr);
            })
            return res.json(CreateObjService.response(false, data));
        })
    }
});

router.post('/deleteCategory', function(req, res) {
    var categoryId = req.body.categoryId;
    BeUFormCategory.remove({ _id: categoryId }, function(err, beuCategory) {
        if (beuCategory) {
            return res.json(CreateObjService.response(false, "Deleted successfully"));
        }
    })
});

router.post("/previousCheckins", function(req, res) {

    if (req.body.date != undefined) {
        var d = new Date(req.body.date);
    } else {
        var d = new Date();
    }

    var userId = req.body.userId;

    var atDate = { "$gte": new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0), "$lt": new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59) }

    SalonCheckin.aggregate([{ $match: { "userId": ObjectId(userId), checkIn: atDate, formId: { $exists: true } } },
        {
            $lookup: {
                from: "parlors",
                localField: "parlorId",
                foreignField: "_id",
                as: "parlorData"
            }
        }

    ], function(err, checkins) {

        console.log(err);

        if (err) {
            console.log("came here");
            return res.json("Something went wrong!");
        }

        if (checkins.length > 0) {

            var data = _.map(checkins, function(f) {

                var checkout = null;
                if (f.checkOut) {
                    checkout = (new Date(f.checkOut).getHours()) + ':' + Math.abs((new Date(f.checkOut).getMinutes()))
                }
                var checkin = (new Date(f.checkIn).getHours()) + ':' + Math.abs((new Date(f.checkIn).getMinutes()))


                console.log("checkin is : ");
                console.log(checkin);

                return {
                    "userId": f.userId,
                    "checkIn": (new Date(f.checkIn).getHours() > 12 ? ((new Date(f.checkIn).getHours()) - 12) + ":" + ((new Date(f.checkIn).getMinutes())) + " PM" : ((new Date(f.checkIn).getHours())) + ":" + ((new Date(f.checkIn).getMinutes())) + " AM"),
                    "checkOut": checkout ? (new Date(f.checkOut).getHours() > 12 ? ((new Date(f.checkOut).getHours()) - 12) + ":" + ((new Date(f.checkOut).getMinutes())) + " PM" : ((new Date(f.checkOut).getHours())) + ":" + ((new Date(f.checkOut).getMinutes())) + " AM") : "",
                    "latitude": f.latitude,
                    "longitude": f.longitude,
                    "parlorName": f.parlorData[0].name,
                    "formStatus": f.formStatus,
                    "formId": f.formId,
                    "parlorId": f.parlorId
                }

            })
            return res.json(CreateObjService.response(false, data));
        } else {
            return res.json(CreateObjService.response(true, "No checkins found."));
        }

    })

});

router.post('/testSalonCheckin', function(req, res) {
    var parlorId = null;
    var parlorName = null;
    var lat = 28.549536;
    var long = 77.2674433;
    var userId = '58e10665b81c313ad0c862ea'
    Parlor.find({}, {
        name: 1,
        latitude: 1,
        longitude: 1
    }, function(err, parlors) {
        _.forEach(parlors, function(parlor) {
            var distance = HelperService.getDistanceBtwCordinates1(parlor.latitude, parlor.longitude, lat, long);
            var value = (distance * 100)
            console.log(value)
            if (value <= 20) {
                console.log(value)
                parlorId = parlor._id;
                console.log(parlor._id)
                parlorName = parlor.name;
            }
        })
        if (parlorId) {
            SalonCheckin.create({
                userId: userId,
                checkIn: new Date(),
                checkOut: null,
                latitude: lat,
                longitude: long,
                parlorId: parlorId,
                parlorName: parlorName
            }, function(err, result) {
                if (err) {
                    console.log(err)
                    return res.json(CreateObjService.response(true, err));
                } else {
                    return res.json(CreateObjService.response(false, result));
                }
            })
        } else {
            return res.json(CreateObjService.response(true, "not allowed"));
        }
    })
})

router.post("/parlorRatings", function(req, res) {
    var parlorId = req.body.parlorId;
    var data = {};
    var counts = {
        "one": 0,
        "two": 0,
        "three": 0,
        "four": 0,
        "five": 0

    };
    var percentage = {
        "one": 0,
        "two": 0,
        "three": 0,
        "four": 0,
        "five": 0

    };
    var numToString = function(num) {
        var r = '';
        switch (num) {
            case 1:
                r = "one";
                break;
            case 2:
                r = "two";
                break;
            case 3:
                r = "three";
                break;
            case 4:
                r = "four";
                break;
            case 5:
                r = "five";
                break;
        }
        return r;
    }
    var ratingTotal = 0;
    var revCount = 0;
    Appointment.aggregate({ $match: { "parlorId": ObjectId(parlorId), "review.rating": { $exists: true } } }, { $group: { "_id": "$review.rating", rating: { $first: "$review.rating" }, count: { $sum: 1 } } }, { $project: { rating: 1, count: 1, _id: 0 } }, function(err, reviews) {
        if (reviews) {
            async.each(reviews, function(rev, cb) {
                counts[numToString(rev.rating)] = rev.count;
                revCount += rev.count;
                ratingTotal += (rev.count * rev.rating);
                cb();
            });
            async.each(reviews, function(rev, cb) {
                percentage[numToString(rev.rating)] = ((rev.count / revCount) * 100).toFixed(2);
                cb();
            });
            var avgRating = (ratingTotal / revCount).toFixed(2);
            data.total = revCount;
            data.counts = counts;
            data.avgRating = avgRating;
            data.percentage = percentage;
            return res.json({ success: true, data });
        } else {
            return res.json({ success: false, data: "No Data." });
        }
    });
});

router.post("/parlorReviews", function(req, res) {
    var parlorId = req.body.parlorId;
    var filter = req.body.filter;
    var page = req.body.page;
    var numReviews = 10;
    var data = [];
    var query;
    if (filter == 0) {
        query = { parlorId: ObjectId(parlorId), review: { $exists: true }, "review.rating": { $exists: true }, review: { $ne: null } };
    } else {
        query = { parlorId: ObjectId(parlorId), review: { $exists: true }, "review.rating": { $exists: true }, review: { $ne: null }, "review.rating": filter };
    }
    Appointment.find(query, { review: 1, "client.phoneNumber": 1, "client.name": 1, _id: 0 }, function(err, reviews) {
        if (reviews.length > 0) {
            async.each(reviews, function(rev, cb) {
                var d = new Date(rev.review.createdAt);
                var obj = {};
                obj.text = rev.review.text;
                obj.rating = rev.review.rating;
                obj.createdAt = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
                obj.userImage = rev.review.userImage;
                obj.phoneNumber = rev.client.phoneNumber;
                obj.name = rev.client.name;
                data.push(obj);
            });
            return res.json({ success: true, data });
        } else {
            return res.json({ success: false, data: "No More Reviews." });
        }
    }).sort({ "review.createdAt": -1 }).skip((page - 1) * numReviews).limit(page * numReviews);

});

var empActiveSince = function(d) {
    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    if (d == null) {
        return "NA";
    } else {
        var date = new Date(d);
        return monthNames[date.getMonth()] + " " + date.getFullYear();
    }

}

router.post("/fetchParlorEmployees", function(req, res) {
    var parlorId = req.body.parlorId;
    var date = new Date();
    Admin.find({ parlorId: ObjectId(parlorId), role: { $nin: [7] }, active: true }, {}, function(err, employees) {
        var data = [];
        async.each(employees, function(emp, cb) {
            var avgData = {};
            Attendance.findOne({ "employeeId": emp._id, "time": { "$gte": new Date(date.getFullYear(), date.getMonth(), date.getDate()), "$lt": new Date(date.getFullYear(), date.getMonth(), (date.getDate() + 1)) } }, function(err, att) {
                var onDuty = 0;
                if (err) {
                    onDuty = 0
                } else {
                    if (att) {
                        onDuty = 1;
                    } else {
                        onDuty = 0;
                    }
                }
                avgData._id = emp._id;
                avgData.firstName = emp.firstName;
                avgData.lastName = emp.lastName;
                avgData.salary = emp.salary;
                avgData.role = emp.role;
                avgData.gender = emp.gender;
                avgData.phoneNumber = emp.phoneNumber;
                avgData.role = emp.role;
                avgData.activeSince = empActiveSince(emp.joiningDate);
                avgData.onDuty = onDuty;
                avgData.rating = 4;
                avgData.position = emp.position;
                avgData.avgBillValueLastMonth = emp.avgBillValueLastMonth;
                avgData.avgServicePerBillLastMonth = emp.avgServicePerBillLastMonth;
                avgData.sharedBillRatioLastMonth = emp.sharedBillRatioLastMonth;
                avgData.avgBillValueThisMonth = emp.avgBillValueThisMonth;
                avgData.avgServicePerBillThisMonth = emp.avgServicePerBillThisMonth;
                avgData.sharedBillRatioThisMonth = emp.sharedBillRatioThisMonth;
                data.push(avgData);
                cb();
            });
        }, function() {
            if (data.length > 0) {
                return res.json(CreateObjService.response(false, data));
            } else {
                return res.json(CreateObjService.response(true, "No Employees"));
            }
        })
    });
});

router.get('/bucketOpening', function(req, res) {


    DisountOnPurchase.find({ purchase: null, createdAt: { $gte: new Date("2017-11-07T11:47:00.616Z") } }, function(err, discount) {

        async.each(discount, function(dis, cb) {

            var data = {

                "parlorId": dis.parlorId,

                "parlorName": dis.parlorName,

                "sellerName": "November Opening Balance",

                "purchaseTillDate": 0,

                "targetRevenue": dis.targetRevenue > dis.revenueBookedInErp ? dis.targetRevenue - dis.revenueBookedInErp : 0,

                "discountBucket": dis.discountBucket,

                "revenueBookedInErp": 0,

                "time": new Date()

            }

            DisountOnPurchase.create(data, function(err, data) {
                if (err) console.log(err)
                else
                    console.log(data)

                cb();
            })

        }, function(done) {

            console.log("all done")

        })



    })




})

router.get("/updateBucket", function(req, res) {
    ReOrder.find({ status: 0, receivedAt: { $gte: new Date(2017, 10, 1), $lt: new Date(2017, 10, 20, 23, 59, 59) } }, { parlorId: 1, name: 1, sellerId: 1, orderAmount: 1, receivedAt: 1, createdAt: 1, updatedAt: 1 }, function(err, reorders) {
        if (err) {
            console.log(err);
        } else {
            if (reorders) {
                async.eachSeries(reorders, function(reo, cb) {
                    console.log("-------------------------->", reo)
                    Parlor.findOne({ "_id": ObjectId(reo.parlorId) }, { "name": 1 }, function(err2, parlor) {
                        if (err2) {
                            console.log(err2);
                        } else {
                            if (parlor) {
                                var parlorName = parlor.name;
                                var sellerId = reo.sellerId;
                                var name = reo.name;
                                var orderAmount = reo.orderAmount;
                                var parlorId = reo.parlorId;
                                DiscountStructure.findOne({ "sellerId": ObjectId(sellerId) }, { "slabs": 1, sellerName: 1, sellerId: 1 }, function(err1, discountData) {
                                    console.log(discountData)
                                    if (err1) {
                                        console.log(err1);
                                        cb();
                                    } else {
                                        var totalDiscount = discountData.slabs[0].totalDiscount;
                                        DisountOnPurchase.find({ "parlorId": ObjectId(parlorId) }, function(err6, prevData) {
                                            if (err6) {
                                                console.log("coming here");
                                                console.log(err6);
                                                cb();
                                            } else {
                                                if (prevData.length > 0) {
                                                    console.log("total Discount", totalDiscount, discountData.sellerName)
                                                    DisountOnPurchase.create({
                                                        parlorId: parlorId,
                                                        parlorName: parlorName,
                                                        sellerId: sellerId,
                                                        sellerName: name,
                                                        purchase: orderAmount,
                                                        discount: totalDiscount,
                                                        orderId: reo._id,
                                                        time: reo.receivedAt,
                                                        discountBucket: (((orderAmount * (totalDiscount)) / 100) + prevData[0].discountBucket),
                                                        purchaseTillDate: (orderAmount + prevData[0].purchaseTillDate),
                                                        targetRevenue: ((orderAmount * 5) + prevData[0].targetRevenue)
                                                    }, function(err4, created) {
                                                        if (err) {
                                                            console.log(err4)
                                                            cb();
                                                        } else {
                                                            // console.log(reo)
                                                            console.log((new Date(reo.receivedAt)).toDateString(), (new Date(reo.receivedAt)).toDateString());
                                                            cb();
                                                        }
                                                    })
                                                } else {
                                                    DisountOnPurchase.create({
                                                        parlorId: parlorId,
                                                        parlorName: parlorName,
                                                        sellerId: sellerId,
                                                        sellerName: name,
                                                        purchase: orderAmount,
                                                        purchaseTillDate: orderAmount,
                                                        discount: totalDiscount,
                                                        orderId: reo._id,
                                                        time: reo.receivedAt,
                                                        discountBucket: ((orderAmount * (totalDiscount)) / 100),
                                                        targetRevenue: (orderAmount * 5)
                                                    }, function(err4, created) {
                                                        if (err) {
                                                            cb();
                                                        } else {
                                                            cb();
                                                        }
                                                    })
                                                }
                                            }
                                        }).sort({ $natural: -1 }).limit(1);
                                    }
                                })
                            }
                        }
                    })
                }, function(done) {
                    res.json("success")
                });
            } else {
                console.log("No reorders.")
            }
        }
    })
})

router.post('/monthEndBucket', function(req, res) {
    Parlor.find({ active: true }, { name: 1 }, function(err, parlors) {
        async.each(parlors, function(parlor, cb) {
            var query = [
                { $match: { status: 3, parlorId: ObjectId(parlor._id), appointmentStartTime: { $gte: new Date(2017, 8, 1), $lt: new Date(2017, 8, 30, 23, 59, 59) } } },
                { $group: { _id: null, serviceRevenue: { $sum: "$serviceRevenue" }, productRevenue: { $sum: "$productRevenue" } } },
                { $project: { revenue: { $add: ["$serviceRevenue", "$productRevenue"] } } }
            ]
            console.log(JSON.stringify(query))
            Appointment.aggregate(query, function(err, revenue) {

                DisountOnPurchase.find({
                    $or: [
                        { "sellerName": "Month Opening Balance", parlorId: ObjectId(parlor._id) },
                        {
                            purchase: { $exists: true },
                            time: { $gte: new Date(2017, 8, 1), $lt: new Date(2017, 8, 30, 23, 59, 59) },
                            parlorId: ObjectId(parlor._id)
                        }
                    ]
                }, function(err, discount) {
                    if (discount.length > 0) {
                        console.log(revenue)
                        console.log(discount)
                        if (revenue[0].revenue < discount[0].targetRevenue) {
                            var discountPaid = (revenue[0].revenue / discount[0].targetRevenue) * discount[0].discountBucket
                            console.log(discount[0].targetRevenue, revenue[0].revenue, discount[0].discountBucket)
                            DisountOnPurchase.create({
                                parlorId: discount[0].parlorId,
                                parlorName: discount[0].parlorName,
                                purchaseTillDate: discount[0].purchaseTillDate,
                                discountBucket: discount[0].discountBucket - discountPaid,
                                revenueBookedInErp: revenue[0].revenue,
                                discountPaid: discountPaid,
                                targetRevenue: discount[0].targetRevenue,
                                "sellerName": "September Closing Balance"
                            }, function(err, data) {
                                cb();
                            })
                        } else {
                            DisountOnPurchase.create({
                                parlorId: discount[0].parlorId,
                                parlorName: discount[0].parlorName,
                                purchaseTillDate: discount[0].purchaseTillDate,
                                discountBucket: discount[0].discountBucket - discount[0].discountBucket,
                                revenueBookedInErp: revenue[0].revenue,
                                discountPaid: discount[0].discountBucket,
                                targetRevenue: discount[0].targetRevenue,
                                "sellerName": "September Closing Balance"
                            }, function(err, data) {
                                cb();
                            })
                        }
                    }
                }).sort({ $natural: -1 }).limit(1)
            })
        }, function(done) {
            console.log("done")

        })
    })
})

router.get("/getTravelingOps", function(req, res) {
    LocationTracker.aggregate([{
            $lookup: {
                from: "beus",
                localField: "userId",
                foreignField: "_id",
                as: "userData"
            }
        },
        { $unwind: "$userData" },
        { $group: { "_id": "$userId", firstName: { $first: "$userData.firstName" }, lastName: { $first: "$userData.lastName" } } }
    ], function(err, travelingOps) {
        return res.json(CreateObjService.response(false, travelingOps));
    });
});

router.post("/plotMapFull", function(req, res) {
    if (req.body.userIds === undefined) {
        var userIds = [ObjectId("5912b70c6faefc49017bf47f")];
    } else {
        var userIds = HelperService.toObjectId(req.body.userIds);
    }
    if (req.body.startTime === undefined || req.body.endTime === undefined) {
        var atDates = { "$gte": new Date(2017, 8, 3), "$lt": new Date(2017, 8, 7, 23, 59, 59) };
    } else {
        var startDate = new Date(req.body.startTime);
        var endDate = new Date(req.body.endTime);
        var atDates = { "$gte": startDate, "$lt": endDate };
    }
    LocationTracker.find({ "time": atDates, "parlorId": { $ne: null }, "userId": { $in: userIds }, "checkInCheckout": 0 }).distinct("parlorId", function(err, ids) {
        if (err) {
            res.json({ "success": false, "data": "Something went wrong" });
        } else {
            Parlor.find({ "active": true, "_id": { $in: ids } }, { latitude: 1, longitude: 1, name: 1, _id: 0 }, function(err, parlors) {
                if (err) {
                    return res.json(CreateObjService.response(false, "Something went wrong."));
                } else {
                    LocationTracker.aggregate([
                        { $match: { "userId": { $in: userIds }, "time": atDates } },
                        {
                            $lookup: {
                                from: "beus",
                                localField: "userId",
                                foreignField: "_id",
                                as: "userData"
                            }
                        },
                        { $unwind: "$userData" },
                        { $sort: { userId: 1, time: 1 } },
                        { $group: { "_id": "$userId", firstName: { $first: "$userData.firstName" }, lastName: { $first: "$userData.lastName" }, travelData: { $push: { latitude: "$latitude", longitude: "$longitude", time: "$time", checkInCheckout: "$checkInCheckout" } } } }
                    ], function(err, travelingOps) {
                        var data = [];
                        async.each(travelingOps, function(t, cb2) {
                            var onePath = [];
                            var oneData = {};
                            var coords = [];
                            async.each(t.travelData, function(m, cb) {
                                coords.push({ "latitude": m.latitude, "longitude": m.longitude });
                                onePath.push({ "latitude": m.latitude, "longitude": m.longitude });
                                cb();
                            }, function() {
                                oneData.userId = t._id;
                                oneData.firstName = t.firstName;
                                oneData.lastName = t.lastName;
                                oneData.distanceCovered = (geolib.getPathLength(coords) / 1000).toFixed(2) + " Km";
                                oneData.path = onePath;
                                data.push(oneData);
                                cb2();
                            });
                        }, function() {
                            var parlorArray = [];
                            async.each(parlors, function(p, cb3) {
                                parlorArray.push({ name: p.name, coords: { "latitude": p.latitude, "longitude": p.longitude } })
                                cb3();
                            }, function(done) {
                                return res.json({ "success": true, parlors: parlorArray, data: data });
                            });
                        });
                    });
                }
            })
        }
    });
});

router.post("/mapTable", function(req, res) {
    var startDate = new Date(req.body.startTime);
    var endDate = new Date(req.body.endTime);
    var atDates = { "$gte": startDate, "$lt": endDate };

    var userIds = HelperService.toObjectId(req.body.userIds);
    var data = [];
    SalonCheckin.aggregate([
        { $match: { "userId": { $in: userIds }, "checkIn": atDates, formId: { $exists: true } } },
        {
            $lookup: {
                from: "beus",
                localField: "userId",
                foreignField: "_id",
                as: "userData"
            }
        },
        {
            $lookup: {
                from: "parlors",
                localField: "parlorId",
                foreignField: "_id",
                as: "parlorData"
            }
        },
        { $unwind: "$userData" },
        { $unwind: "$parlorData" },
        { $group: { "_id": { userId: "$userId", date: { $dateToString: { format: "%d/%m/%Y", date: "$checkIn" } } }, userId: { $first: "$userId" }, firstName: { $first: "$userData.firstName" }, lastName: { $first: "$userData.lastName" }, travelData: { $push: { time: "$checkIn", checkIn: "$checkIn", checkOut: "$checkOut", parlorId: "$parlorData._id", parlorName: "$parlorData.name", formId: "$formId" } }, atDate: { $first: "$checkIn" } } },
        { $group: { "_id": "$userId", firstName: { $first: "$firstName" }, lastName: { $first: "$lastName" }, travelData: { $push: { travelData: "$travelData", atDate: "$atDate" } } } }
    ], function(err, travelingOps) {

        async.each(travelingOps, function(t, cb) {
            var oneData = {};
            SalonCheckin.find({ "checkIn": atDates, "parlorId": { $ne: null }, "userId": t._id }).distinct("parlorId", function(err, ids) {
                if (err) {
                    cb();
                } else {
                    oneData._id = t._id;
                    oneData.name = t.firstName + " " + (t.lastName ? t.lastName : "");
                    oneData.date = t.atDate;
                    oneData.visitData = t.travelData;
                    oneData.parlorsVisited = ids.length;
                    data.push(oneData);
                    cb();
                }
            });
        }, function(done) {
            res.json({ "success": true, data: data });
        })
    });
});

router.post('/updateSettlementOnPurchase', function(req, res) {

    SettlementReport.find({ period: 71 }, { period: 1, parlorId: 1 }, function(err, settlement) {
        async.each(settlement, function(set, cb) {

            DisountOnPurchase.findOne({ purchase: { $exists: false }, "parlorId": ObjectId(set.parlorId) }, function(err, dis) {
                if (dis) {
                    SettlementReport.update({ _id: set._id }, { discountOnPurchase: dis.discountPaid }, function(err, updated) {
                        if (!err) console.log("updated")
                        cb();
                    })

                }


            })
        }, function(done) {
            console.log("done")

        })
    })
})


router.get("/getOps", function(req, res) {
    Beu.find({}, { firstName: 1, lastName: 1 }, function(err, ops) {
        if (err) {
            res.json(CreateObjService.response(false, "Something went wrong please try again."));
        } else {
            res.json(CreateObjService.response(false, ops));
        }
    })
});

router.get("/getParlors", function(req, res) {
    Parlor.find({ "active": true }, { name: 1 }, function(err, parlors) {
        if (err) {
            res.json(CreateObjService.response(false, "Something went wrong please try again."));
        } else {
            res.json(CreateObjService.response(false, parlors));
        }
    });
})

router.get("/getParlorsWithAddress", function(req, res) {
    Parlor.find({ "active": true }, { name: 1, address2: 1 }, function(err, parlors) {
        var names = [];
        if (err) {
            res.json(CreateObjService.response(false, "Something went wrong please try again."));
        } else {

            _.forEach(parlors, function(p) {
                names.push({ name: p.name + " - " + p.address2, _id: p._id });
            })

            res.json(CreateObjService.response(false, names));
        }
    });
})

router.get("/getAllParlors", function(req, res) {
    Parlor.find({}, { name: 1 }, function(err, parlors) {
        if (err) {
            res.json(CreateObjService.response(false, "Something went wrong please try again."));
        } else {
            res.json(CreateObjService.response(false, parlors));
        }
    });
})

router.post("/getFormDetails", function(req, res) {
    var parlorIds = HelperService.toObjectId(req.body.parlorIds),
        userIds = HelperService.toObjectId(req.body.userIds),
        startTime = req.body.startTime,
        endTime = req.body.endTime;
    var startDate = new Date(startTime);
    var endDate = new Date(endTime);
    SalonCheckin.aggregate([
        { $match: { parlorId: { $in: parlorIds }, userId: { $in: userIds }, formId: { $exists: true }, checkIn: { $gte: startDate, $lt: endDate } } },
        {
            $lookup: {
                from: "beus",
                localField: "userId",
                foreignField: "_id",
                as: "userData"
            }
        },
        {
            $lookup: {
                from: "parlors",
                localField: "parlorId",
                foreignField: "_id",
                as: "parlorData"
            }
        },
        { $unwind: "$userData" },
        { $unwind: "$parlorData" },
        { $project: { formId: "$formId", formStatus: "$formStatus", dateTime: "$checkIn", name: { $concat: ["$userData.firstName", " ", "$userData.lastName"] }, parlorName: "$parlorData.name" } },
        { $match: { name: { $ne: null }, formId: { $ne: null } } }
    ], function(err, response) {
        if (err) {
            res.json(CreateObjService.response(true, "Something went wrong please try again."));
        } else {
            res.json(CreateObjService.response(false, response));
        }
    });
});

var replaceMonth = function(m, df) {

    if (df == "m/y") {

        var y = m.substr(5, 7);
        var m = m.substr(0, 2);

        switch (m) {
            case "01":
                m = "Jan";
                break;
            case "02":
                m = "Feb";
                break;
            case "03":
                m = "Mar";
                break;
            case "04":
                m = "Apr";
                break;
            case "05":
                m = "May";
                break;
            case "06":
                m = "Jun";
                break;
            case "07":
                m = "Jul";
                break;
            case "08":
                m = "Aug";
                break;
            case "09":
                m = "Sep";
                break;
            case "10":
                m = "Oct";
                break;
            case "11":
                m = "Nov";
                break;
            case "12":
                m = "Dec";
                break;
        }

        return m + " " + y;

    }

    if (df == "d/m/y") {

        var y = m.substr(8, 2);
        var o = m.substr(3, 2);

        switch (o) {
            case "01":
                o = "Jan";
                break;
            case "02":
                o = "Feb";
                break;
            case "03":
                o = "Mar";
                break;
            case "04":
                o = "Apr";
                break;
            case "05":
                o = "May";
                break;
            case "06":
                o = "Jun";
                break;
            case "07":
                o = "Jul";
                break;
            case "08":
                o = "Aug";
                break;
            case "09":
                o = "Sep";
                break;
            case "10":
                o = "Oct";
                break;
            case "11":
                o = "Nov";
                break;
            case "12":
                o = "Dec";
                break;
        }

        return m.substr(0, 2) + " " + o + " " + y;

    }

    if (df == "y/m/d") {

        var y = m.substr(2, 2);
        var o = m.substr(5, 2);

        switch (o) {
            case "01":
                o = "Jan";
                break;
            case "02":
                o = "Feb";
                break;
            case "03":
                o = "Mar";
                break;
            case "04":
                o = "Apr";
                break;
            case "05":
                o = "May";
                break;
            case "06":
                o = "Jun";
                break;
            case "07":
                o = "Jul";
                break;
            case "08":
                o = "Aug";
                break;
            case "09":
                o = "Sep";
                break;
            case "10":
                o = "Oct";
                break;
            case "11":
                o = "Nov";
                break;
            case "12":
                o = "Dec";
                break;
        }

        return m.substr(8, 10) + " " + o + " " + y;

    }

}

var dateToMonth = function(arr, df) {

    if (df == "m/y") {
        arr.map(function(a) {
            return a.month = replaceMonth(a.month, "m/y");
        });
    }

    if (df == "d/m/y") {
        arr.map(function(a) {
            return a.day = replaceMonth(a.day, "d/m/y");
        });
    }

    if (df == "y/m/d") {
        arr.map(function(a) {
            return a.date = replaceMonth(a.date, "y/m/d");
        });
    }

    return arr;
}

var dateSort = function(arr, dayOrMonth) {
    arr.sort(function(a, b) {
        if (dayOrMonth == "month") {
            var aDate = a["month"];
            var bDate = b["month"];
        }

        if (dayOrMonth == "day") {
            var aDate = a["day"];
            var bDate = b["day"];
        }

        var aD = aDate.split("/");
        var bD = bDate.split("/");

        if (aD[0].length == 1) {
            aD[0] = "0" + aD[0].toString();
        }

        if (bD[0].length == 1) {
            bD[0] = "0" + bD[0].toString();
        }

        var aD = aD.reverse().join(),
            bD = bD.reverse().join();
        aD = aD.replace(/\,/g, "");
        bD = bD.replace(/\,/g, "");
        aD = parseInt(aD);
        bD = parseInt(bD);
        return aD < bD ? 1 : (aD > bD ? -1 : 0);

    });
    return arr;
}

router.post("/getEmployeeReport", function(req, res) {
    var empId = req.body.employeeId;
    var month = req.body.month;
    var year = req.body.year;
    var data = {};
    var Revenue = new Promise(function(resolve, reject) {
        Appointment.aggregate([
            { $match: { "employees.employeeId": ObjectId(empId), appointmentStartTime: { "$gte": new Date(year, (month - 3), 1, 0, 0, 0), "$lt": new Date(year, (month), 1, 0, 0, 1) } } },
            { $unwind: "$employees" },
            {
                $lookup: {
                    from: "owners",
                    localField: "employees.employeeId",
                    foreignField: "_id",
                    as: "employeeData"
                }
            },
            { $unwind: "$employeeData" },
            {
                $group: {
                    "_id": { date: { $dateToString: { format: "%m/%Y", date: "$appointmentStartTime" } } },
                    revenue: { $sum: "$employees.revenue" },
                    salary: { $first: "$employeeData.salary" },
                }
            },
            { $project: { month: "$_id.date", _id: 0, revenue: { $trunc: "$revenue" }, salary: "$salary", range: { $floor: { $divide: ["$revenue", "$salary"] } } } },
            {
                $project: {
                    month: "$month",
                    revenue: "$revenue",
                    salary: "$salary",
                    range: "$range",
                    "rangeColor": {
                        $cond: {
                            if: { $and: [{ $gte: ["$range", 0] }, { $lt: ["$range", 3] }] },
                            then: 1,
                            else: {
                                $cond: {
                                    if: { $and: [{ $gte: ["$range", 3] }, { $lt: ["$range", 5] }] },
                                    then: 2,
                                    else: {
                                        $cond: {
                                            if: { $gte: ["$range", 5] },
                                            then: 3,
                                            else: ""
                                        }
                                    }

                                }
                            }
                        }
                    },
                    "rangeLabel": {
                        $cond: {
                            if: { $and: [{ $gte: ["$range", 0] }, { $lt: ["$range", 3] }] },
                            then: "0 - 3*Salary",
                            else: {
                                $cond: {
                                    if: { $and: [{ $gte: ["$range", 3] }, { $lt: ["$range", 5] }] },
                                    then: "3 - 5*Salary",
                                    else: {
                                        $cond: {
                                            if: { $gte: ["$range", 5] },
                                            then: ">=5*Salary",
                                            else: ""
                                        }
                                    }

                                }
                            }
                        }
                    }
                }
            }
        ], function(err, revenueTotal) {
            if (err) {
                reject(err);
            } else {
                resolve(dateToMonth(dateSort(revenueTotal, "month"), "m/y"));
            }
        });
    })

    var Draws = new Promise(function(resolve, reject) {
        LuckyDrawDynamic.aggregate([
            { $match: { "employeeId": ObjectId(empId), createdAt: { "$gte": new Date(year, (month - 3), 1, 0, 0, 0), "$lt": new Date(year, (month), 1, 0, 0, 1) } } },
            {
                $group: {
                    "_id": { date: { $dateToString: { format: "%m/%Y", date: "$createdAt" } } },
                    drawsTotal: { $sum: "$amount" }
                }
            },
            { $project: { month: "$_id.date", _id: 0, drawsTotal: { $trunc: "$drawsTotal" } } },
            { $sort: { month: -1 } }
        ], function(err, drawsRevenue) {
            if (err) {
                reject(err);
            } else {
                resolve(dateToMonth(dateSort(drawsRevenue, "month"), "m/y"));
            }
        })
    });

    var Report = new Promise(function(resolve, reject) {
        Appointment.aggregate([
            { $unwind: "$services" },
            { $unwind: "$services.employees" },
            { $match: { "services.employees.employeeId": ObjectId(empId), createdAt: { "$gte": new Date(year, (month - 3), 1, 0, 0, 0), "$lt": new Date(year, (month), 1, 0, 0, 1) } } },
            {
                $lookup: {
                    from: "servicecategories",
                    localField: "services.categoryId",
                    foreignField: "_id",
                    as: "categoryData"
                }
            },
            { $unwind: "$categoryData" },
            { $group: { "_id": { serviceCategory: "$categoryData.superCategory", service: "$categoryData.name", month: { $dateToString: { format: "%m/%Y", date: "$createdAt" } } }, count: { $sum: 1 }, services: { $push: "$services" }, revenue: { $sum: { $multiply: ["$services.price", { $divide: ["$services.employees.distribution", 100] }] } } } },
            { $group: { "_id": "$_id.month", services: { $push: { serviceCategory: "$_id.serviceCategory", name: "$_id.service", count: "$count", revenue: "$revenue" } } } },
            { $project: { services: 1, month: "$_id", "_id": 0 } },
            { $unwind: "$services" },
            { $group: { "_id": { month: "$month", serviceCategory: "$services.serviceCategory" }, services: { $push: { name: "$services.name", count: { $sum: "$services.count" }, revenue: { $trunc: { $sum: "$services.revenue" } } } } } },
            { $project: { month: "$_id.month", serviceCategory: "$_id.serviceCategory", services: 1, "_id": 0 } },
            { $group: { "_id": "$month", services: { $push: { count: { $sum: "$services.count" }, revenue: { $trunc: { $sum: "$services.revenue" } }, serviceCategory: "$serviceCategory", servicesDone: "$services" } } } },
            { $project: { month: "$_id", services: 1, "_id": 0 } },
            { $sort: { month: -1 } }
        ], function(err, serviceReport) {
            if (err) {
                reject(err);
            } else {
                resolve(dateToMonth(dateSort(serviceReport, "month"), "m/y"));
            }
        });
    });

    var empClientReport = new Promise(function(resolve, reject) {
        Appointment.aggregate([
            { $match: { status: 3, "employees.employeeId": ObjectId(empId), appointmentStartTime: { "$gte": new Date(year, (month - 3), 1, 0, 0, 0), "$lt": new Date(year, (month), 1, 0, 0, 0) } } },
            { $group: { "_id": { clientId: "$client.id", month: { $dateToString: { format: "%m/%Y", date: "$appointmentStartTime" } } }, "noOfAppointments": { $sum: "$client.noOfAppointments" }, "serviceRevenue": { $sum: "$serviceRevenue" }, services: { $push: "$services" } } },
            { $project: { clientId: "$_id.clientId", month: "$_id.month", "noOfAppointments": "$noOfAppointments", "serviceRevenue": "$serviceRevenue", "_id": 0, numberOfServices: { $size: "$services" } } },
            { $group: { "_id": { month: "$month" }, clientData: { $push: { clientId: "$clientId", noOfAppointments: { $sum: "$noOfAppointments" }, serviceRevenue: { $sum: "$serviceRevenue" }, numberOfServices: "$numberOfServices" } } } },
            { $project: { month: "$_id.month", clientData: 1, _id: 0 } },
            { $unwind: "$clientData" },
            {
                $group: {
                    "_id": "$month",
                    newEmployeeServiceCount: { $sum: { $cond: [{ $eq: ['$clientData.noOfAppointments', 0] }, '$clientData.numberOfServices', 0] } },
                    newEmployeeRevenue: { $sum: { $cond: [{ $eq: ['$clientData.noOfAppointments', 0] }, '$clientData.serviceRevenue', 0] } },
                    newEmployeeAppointmentCount: { $sum: { $cond: [{ $eq: ['$clientData.noOfAppointments', 0] }, 1, 0] } },
                    oldEmployeeServiceCount: { $sum: { $cond: [{ $ne: ['$clientData.noOfAppointments', 0] }, '$clientData.numberOfServices', 0] } },
                    oldEmployeeRevenue: { $sum: { $cond: [{ $ne: ['$clientData.noOfAppointments', 0] }, '$clientData.serviceRevenue', 0] } },
                    oldEmployeeAppointmentCount: { $sum: { $cond: [{ $ne: ['$clientData.noOfAppointments', 0] }, 1, 0] } }
                }
            },
            {
                $group: {
                    "_id": { month: "$_id" },
                    reports: {
                        $push: {
                            newEmployeeServiceCount: "$newEmployeeServiceCount",
                            newEmployeeRevenue: { $trunc: "$newEmployeeRevenue" },
                            "newEmployeeAppointmentCount": "$newEmployeeAppointmentCount",
                            newEmployeeBillValue: { $trunc: { $divide: ["$newEmployeeRevenue", "$newEmployeeAppointmentCount"] } },
                            oldEmployeeServiceCount: "$oldEmployeeServiceCount",
                            "oldEmployeeRevenue": { $trunc: "$oldEmployeeRevenue" },
                            "oldEmployeeAppointmentCount": "$oldEmployeeAppointmentCount",
                            oldEmployeeBillValue: { $trunc: { $divide: ["$oldEmployeeRevenue", "$oldEmployeeAppointmentCount"] } }
                        }
                    }
                }
            },
            { $project: { month: "$_id.month", reports: 1, "_id": 0 } }
        ], function(err, employeeClientReport) {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(dateToMonth(dateSort(employeeClientReport, "month"), "m/y"));
            }
        });
    });

    var empClientReportAppNonapp = new Promise(function(resolve, reject) {
        Appointment.aggregate([
            { $match: { "employees.employeeId": ObjectId(empId), appointmentStartTime: { "$gte": new Date(year, (month - 3), 1, 0, 0, 0), "$lt": new Date(year, (month), 1, 0, 0, 0) } } },
            { $group: { "_id": { clientId: "$client.id", month: { $dateToString: { format: "%m/%Y", date: "$appointmentStartTime" } }, "appointmentType": "$appointmentType" }, "noOfAppointments": { $sum: "$client.noOfAppointments" }, "serviceRevenue": { $sum: "$serviceRevenue" }, services: { $push: "$services" } } },
            { $project: { clientId: "$_id.clientId", month: "$_id.month", "noOfAppointments": "$noOfAppointments", "serviceRevenue": "$serviceRevenue", appointmentType: "$_id.appointmentType", "_id": 0, numberOfServices: { $size: "$services" } } },
            { $group: { "_id": { month: "$month" }, clientData: { $push: { clientId: "$clientId", noOfAppointments: { $sum: "$noOfAppointments" }, serviceRevenue: { $sum: "$serviceRevenue" }, appointmentType: "$appointmentType", numberOfServices: "$numberOfServices" } } } },
            { $project: { month: "$_id.month", clientData: 1, _id: 0 } },
            { $unwind: "$clientData" },
            {
                $group: {
                    "_id": "$month",
                    appServiceCount: { $sum: { $cond: [{ $eq: ['$clientData.appointmentType', 3] }, '$clientData.numberOfServices', 0] } },
                    appRevenue: { $sum: { $cond: [{ $eq: ['$clientData.appointmentType', 3] }, '$clientData.serviceRevenue', 0] } },
                    appAppointmentCount: { $sum: { $cond: [{ $eq: ['$clientData.appointmentType', 3] }, 1, 0] } },
                    nonAppServiceCount: { $sum: { $cond: [{ $ne: ['$clientData.appointmentType', 3] }, '$clientData.numberOfServices', 0] } },
                    nonAppRevenue: { $sum: { $cond: [{ $ne: ['$clientData.appointmentType', 3] }, '$clientData.serviceRevenue', 0] } },
                    nonAppAppointmentCount: { $sum: { $cond: [{ $ne: ['$clientData.appointmentType', 3] }, 1, 0] } },
                }
            },
            { $group: { "_id": { month: "$_id" }, reports: { $push: { appServiceCount: "$appServiceCount", appRevenue: { $trunc: "$appRevenue" }, appAppointmentCount: "$appAppointmentCount", appBillValue: { $trunc: { $divide: ["$appRevenue", "$appAppointmentCount"] } }, nonAppServiceCount: "$nonAppServiceCount", "nonAppRevenue": { $trunc: "$nonAppRevenue" }, "nonAppAppointmentCount": "$nonAppAppointmentCount", nonAppBillValue: { $trunc: { $divide: ["$nonAppRevenue", "$nonAppAppointmentCount"] } } } } } },
            { $project: { month: "$_id.month", reports: 1, "_id": 0 } }
        ], function(err, appNonAppReport) {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(dateToMonth(dateSort(appNonAppReport, "month"), "m/y"));
            }
        });
    });

    Promise.all([Revenue, Draws, Report, empClientReport, empClientReportAppNonapp]).then(values => {
        data.revenue = values[0];
        data.draws = values[1];
        data.serviceReport = values[2];
        data.employeeClientReport = values[3];
        data.employeeClientReportAppNonapp = values[4];
        if (values[0].length == 0) {
            Admin.findOne({ "_id": ObjectId(empId) }, { salary: 1 }, function(err, salary) {
                data.salary = salary.salary;
                data.target = (salary.salary * 5);
                res.json(CreateObjService.response(false, data));
            });
        } else {
            data.salary = values[0][0]["salary"];
            data.target = (values[0][0]["salary"] * 5);
            res.json(CreateObjService.response(false, data));
        }
    }).catch(reason => {
        res.json(CreateObjService.response(true, "Something went wrong please try again."));
    });

})

router.post("/creditsUsed", function(req, res) {
    User.aggregate([{ $unwind: "$creditsHistory" },
        { $match: { "creditsHistory.amount": { $lt: 0 } } },
        { $group: { "_id": { month: { $dateToString: { format: "%m/%Y", date: "$creditsHistory.createdAt" } } }, "used": { $sum: "$creditsHistory.amount" } } },
        { $project: { month: "$_id.month", creditsUsed: "$used", "_id": 0 } }
    ], function(err, response) {
        res.json(dateSort(response, "month"));
    });
});

router.post("/creditsGiven", function(req, res) {
    User.aggregate([{ $unwind: "$creditsHistory" },
        { $match: { "creditsHistory.amount": { $gt: 0 } } },
        { $group: { "_id": { month: { $dateToString: { format: "%m/%Y", date: "$creditsHistory.createdAt" } } }, "given": { $sum: "$creditsHistory.amount" } } },
        { $project: { month: "$_id.month", creditsGiven: "$given", "_id": 0 } }
    ], function(err, response) {
        res.json(dateSort(response, "month"));
    });
});

router.post("/appointmentsCount", function(req, res) {
    Appointment.aggregate([{ $match: { status: 3 } },
        { $group: { "_id": { month: { $dateToString: { format: "%m/%Y", date: "$appointmentStartTime" } } }, count: { $sum: 1 } } },
        { $project: { month: "$_id.month", count: 1, "_id": 0 } }
    ], function(err, resp) {
        if (err) {
            res.json("Something went wrong please try again.")
        } else {
            res.json(dateSort(resp, "month"));
        }
    })
})

router.post("/cohortReport", function(req, res) {
    var data = [];
    Parlor.find({ active: true }, { name: 1, parlorLiveDate: 1 }, function(err, par) {
        async.each(par, function(p, cb) {
            var cohortData = [];
            var parlorData = {};
            Appointment.find({ "parlorId": p._id, "status": 3 }, { "appointmentStartTime": 1, "_id": 0 }, function(err, res) {
                if (res.length <= 0 || err) {
                    cb();
                } else {
                    var d = new Date(res[0].appointmentStartTime);
                    var yea = d.getFullYear();
                    var mon = d.getMonth();
                    var day = d.getDate();
                    var just = [];
                    for (var i = mon; i < 11; i++) {
                        just.push(i);
                    }
                    parlorData.parlorName = p.name;
                    parlorData.parlorId = p._id;
                    parlorData.firstAppointmentDate = d;
                    parlorData.parlorLiveDate = p.parlorLiveDate;
                    async.each(just, function(i, cb1) {
                        var atDates = { "$gte": new Date(2017, i, day), "$lt": new Date(2017, i + 1, (day), 23, 59, 59) };
                        var oneData = {};
                        Appointment.aggregate([
                            { $match: { "appointmentStartTime": atDates, "parlorId": p._id, "status": 3 } },
                            {
                                $group: {
                                    "_id": p._id,
                                    serviceRevenues: { $push: "$serviceRevenue" },
                                    revenue: { $sum: "$serviceRevenue" },
                                    count: { $sum: 1 },
                                    "Total Revenue < 400": { $sum: { $cond: [{ $lt: ["$serviceRevenue", 400] }, "$serviceRevenue", 0] } },
                                    "Total Revenue >= 400": { $sum: { $cond: [{ $gte: ["$serviceRevenue", 400] }, "$serviceRevenue", 0] } },
                                    "Total Revenue < 400 Count": { $sum: { $cond: [{ $lt: ["$serviceRevenue", 400] }, 1, 0] } },
                                    "Total Revenue >= 400 Count": { $sum: { $cond: [{ $gte: ["$serviceRevenue", 400] }, 1, 0] } },
                                }
                            },
                            { $project: { revenue: 1, count: 1, "Total Revenue < 400": 1, "Total Revenue >= 400": 1, "Total Revenue < 400 Count": 1, "Total Revenue >= 400 Count": 1 } }
                        ], function(err, rev) {
                            if (rev.length > 0) {
                                oneData["Revenue"] = (rev[0].revenue).toFixed(2);
                                oneData["Footfall"] = rev[0].count;
                                oneData["ATV"] = (rev[0].revenue / rev[0].count).toFixed(2);
                                oneData["Revenue < 400"] = (rev[0]["Total Revenue < 400"]).toFixed(2);
                                oneData["Revenue < 400 Count"] = (rev[0]["Total Revenue < 400 Count"]);
                                oneData["Revenue < 400 Percentage"] = ((rev[0]["Total Revenue < 400 Count"] / rev[0].count) * 100).toFixed(2);
                                if (rev[0]["Total Revenue < 400"] > 0) {
                                    oneData["Revenue < 400 ATV"] = ((rev[0]["Total Revenue < 400"]) / (rev[0]["Total Revenue < 400 Count"])).toFixed(2);
                                } else {
                                    oneData["Revenue < 400 ATV"] = 0;
                                }
                                oneData["Revenue >= 400"] = (rev[0]["Total Revenue >= 400"]).toFixed(2);
                                oneData["Revenue >= 400 Count"] = (rev[0]["Total Revenue >= 400 Count"]);
                                oneData["Revenue >= 400 Percentage"] = ((rev[0]["Total Revenue >= 400 Count"] / rev[0].count) * 100).toFixed(2);
                                if (rev[0]["Total Revenue >= 400"] > 0) {
                                    oneData["Revenue >= 400 ATV"] = ((rev[0]["Total Revenue >= 400"]) / (rev[0]["Total Revenue >= 400 Count"])).toFixed(2);
                                } else {
                                    oneData["Revenue >= 400 ATV"] = 0;
                                }
                                oneData["Month"] = i;
                                cohortData.push(oneData);
                                cb1();
                            } else {
                                cb1();
                            }
                        })
                    }, function() {
                        parlorData.cohortData = cohortData.sort(function(a, b) { return a.Month - b.Month });
                        data.push(parlorData);
                        cb();
                    });
                }
            }).limit(1);
        }, function() {
            res.json(data);
        });
    })
})

router.post("/revenueCohort", function(req, res) {
    Appointment.aggregate([
        { $match: { status: 3, "appointmentStartTime": { $lt: new Date(2017, 9, 1) } } },
        { $group: { "_id": { month: { $dateToString: { format: "%m/%Y", date: "$appointmentStartTime" } }, parlorId: "$parlorId" }, "revenue": { $sum: "$serviceRevenue" } } },
        { $project: { month: "$_id.month", parlorId: "$_id.parlorId", revenue: "$revenue", "_id": 0 } },
        { $group: { "_id": "$parlorId", months: { $push: { month: "$month", revenue: "$revenue" } } } },
        { $project: { parlorId: "$_id", months: 1, "_id": 0 } }
    ], function(err, result) {
        if (err) {
            res.json("Something went wrong please try again.")
        } else {
            var data = [];
            async.each(result, function(p, cb) {
                Parlor.findOne({ "_id": ObjectId(p.parlorId) }, { parlorLiveDate: 1, name: 1, _id: 0 }, function(err, par) {
                    if (err || par == null) {
                        cb();
                    } else {
                        p.name = par.name;
                        p.parlorLiveDate = par.parlorLiveDate;
                        p.months = dateSort(p.months, "month");
                        if (p.parlorLiveDate == undefined) {
                            cb();
                        } else {
                            Appointment.find({ "parlorId": p.parlorId }, { "appointmentStartTime": 1, "_id": 0 }, function(err, res) {
                                if (err) {
                                    cb();
                                } else {
                                    var d = new Date(res[0].appointmentStartTime);
                                    var yea = d.getFullYear();
                                    var mon = d.getMonth();
                                    var day = d.getDate();
                                    var atDates = { "$gte": new Date(yea, mon, day), "$lt": new Date(yea, mon, (day + 6), 23, 59, 59) };
                                    Appointment.aggregate([
                                        { $match: { "appointmentStartTime": atDates, "parlorId": p.parlorId, "status": 3 } },
                                        { $group: { "_id": p.parlorId, revenue: { $sum: "$serviceRevenue" } } },
                                        { $project: { revenue: 1 } }
                                    ], function(err, rev) {
                                        if (err) {
                                            console.log(err);
                                            cb();
                                        } else {
                                            if (rev.length > 0) {
                                                console.log(rev[0].revenue);
                                                p.avgRevenue = (rev[0].revenue) * (30 / 7);
                                                data.push(p);
                                                cb();
                                            } else {
                                                data.push(p);
                                                cb();
                                            }
                                        }
                                    });
                                }
                            }).limit(1);
                        }
                    }
                })
            }, function() {
                console.log("All done.");
                res.json(data);
            });
        }
    })
});

router.post("/billValueCohort", function(req, res) {
    var data = [];
    Parlor.find({}, { name: 1 }, function(err, par) {
        async.each(par, function(p, cb) {
            var oneData = {};
            Appointment.find({ "parlorId": p._id, "status": 3 }, { "appointmentStartTime": 1, "_id": 0 }, function(err, res) {
                if (res.length <= 0 || err) {
                    cb();
                } else {
                    var d = new Date(res[0].appointmentStartTime);
                    var yea = d.getFullYear();
                    var mon = d.getMonth();
                    var day = d.getDate();
                    var atDates = { "$gte": new Date(yea, mon, day), "$lt": new Date(yea, mon, (day + 6), 23, 59, 59) };
                    oneData.parlorName = p.name;
                    oneData.parlorId = p._id;
                    Appointment.aggregate([
                        { $match: { status: 3, "appointmentStartTime": atDates, parlorId: p._id } },
                        { $group: { "_id": p._id, revenue: { $sum: "$serviceRevenue" }, count: { $sum: 1 } } },
                        { $project: { billValueFirstWeek: { $divide: ["$revenue", "$count"] }, revenue: 1, count: 1 } }
                    ], function(err, response) {
                        oneData.billValueFirstWeek = response[0].billValueFirstWeek;
                        oneData.billValueFirstWeekCount = response[0].count;
                        oneData.billValueFirstWeekRevenue = response[0].revenue;
                        data.push(oneData);
                        console.log(oneData);
                        cb();
                    })
                }
            }).limit(1);
        }, function() {
            console.log("All done");
            res.json(data);
        })
    })
})

var monthsDiff = function(day1, day2) {
    var d1 = day1,
        d2 = day2;
    if (day1 < day2) {
        d1 = day2;
        d2 = day1;
    }
    var m = (d1.getFullYear() - d2.getFullYear()) * 12 + (d1.getMonth() - d2.getMonth());
    if (d1.getDate() < d2.getDate()) --m;
    return m;
}

router.post("/revenueCohort2", function(req, res) {
    var data = [];
    Parlor.find({ active: true }, { name: 1, parlorLiveDate: 1 }, function(err, par) {
        async.each(par, function(p, cb) {
            var parlorData = {};
            var cohortData = [];
            var d = new Date(p.parlorLiveDate);
            var yea = d.getFullYear();
            var mon = d.getMonth();
            var day = d.getDate();
            var atDates = { "$gte": new Date(yea, mon, day), "$lt": new Date(yea, mon, (day + 6), 23, 59, 59) };
            parlorData.parlorName = p.name;
            parlorData.parlorId = p._id;
            Appointment.aggregate([
                { $match: { "appointmentStartTime": atDates, "parlorId": p._id, "status": 3 } },
                { $group: { "_id": p._id, serviceRev: { $sum: "$serviceRevenue" }, productRev: { $sum: "$productRevenue" }, count: { $sum: 1 } } },
                { $project: { "_id": 0, "revenue": { $add: ["$serviceRev", "$productRev"] }, count: 1 } }
            ], function(err, resp) {

                if (resp.length == 0) {

                    Appointment.find({ status: 3, parlorId: p._id }, { appointmentStartTime: 1 }, function(err, firstBilling) {
                        if (err) {
                            cb();
                        } else if (firstBilling.length == 0) {
                            cb();
                        } else {
                            var f_d = new Date(firstBilling[0].appointmentStartTime);
                            var f_yea = f_d.getFullYear();
                            var f_mon = f_d.getMonth();
                            var f_day = f_d.getDate();
                            var f_atDates = { "$gte": new Date(f_yea, f_mon, f_day), "$lt": new Date(f_yea, f_mon, (f_day + 4), 23, 59, 59) };

                            Appointment.aggregate([
                                { $match: { "appointmentStartTime": f_atDates, "parlorId": p._id, "status": 3 } },
                                { $group: { "_id": p._id, serviceRev: { $sum: "$serviceRevenue" }, productRev: { $sum: "$productRevenue" }, count: { $sum: 1 } } },
                                { $project: { "_id": 0, "revenue": { $add: ["$serviceRev", "$productRev"] }, count: 1 } }
                            ], function(err, first_resp) {

                                if (err) {
                                    cb();
                                } else if (first_resp.length == 0) {
                                    parlorData.firstWeekRevenue = 0;
                                    parlorData.firstWeekApps = 0;
                                    parlorData.parlorLiveDate = p.parlorLiveDate;
                                } else {
                                    parlorData.firstWeekRevenue = first_resp[0].revenue;
                                    parlorData.firstWeekApps = first_resp[0].count;
                                    parlorData.parlorLiveDate = p.parlorLiveDate;
                                }

                                var toStartDate = new Date(yea, mon, (day + 6), 23, 59, 59);
                                var totalMonths = monthsDiff(new Date(), toStartDate);
                                var just = [];
                                for (var i = 0; i < totalMonths; i++) {
                                    just.push(i);
                                }
                                async.each(just, function(i, cb2) {
                                    var startDate = toStartDate.setMonth(toStartDate.getMonth() + i);
                                    toStartDate = new Date(yea, mon, (day + 6), 23, 59, 59);
                                    var endDate = toStartDate.setMonth(toStartDate.getMonth() + (i + 1));
                                    toStartDate = new Date(yea, mon, (day + 6), 23, 59, 59);
                                    var atDates = { "$gte": new Date(startDate), "$lt": new Date(endDate) };
                                    Appointment.aggregate([
                                        { $match: { "appointmentStartTime": atDates, "parlorId": p._id, "status": 3 } },
                                        { $group: { "_id": p._id, serviceRev: { $sum: "$serviceRevenue" }, productRev: { $sum: "$productRevenue" }, count: { $sum: 1 } } },
                                        { $project: { "_id": 0, "revenue": { $add: ["$serviceRev", "$productRev"] }, count: 1 } }
                                    ], function(err, rev) {
                                        if (err) {
                                            cb2();
                                        } else {
                                            if (rev.length > 0) {
                                                var oneData = {};
                                                oneData["Revenue"] = rev[0].revenue;
                                                oneData["Apps"] = rev[0].count;
                                                oneData["monthStart"] = new Date(startDate);
                                                oneData["monthEnd"] = new Date(endDate);
                                                oneData["Month"] = i;
                                                cohortData.push(oneData);
                                                cb2();
                                            } else {
                                                cb2();
                                            }
                                        }
                                    })
                                }, function() {
                                    parlorData.cohortData = cohortData.sort(function(a, b) { return a.Month - b.Month });
                                    data.push(parlorData);
                                    cb();
                                });

                            })

                        }
                    }).limit(1);

                } else {
                    parlorData.firstWeekRevenue = resp[0].revenue;
                    parlorData.firstWeekApps = resp[0].count;
                    parlorData.parlorLiveDate = p.parlorLiveDate;

                    var toStartDate = new Date(yea, mon, (day + 6), 23, 59, 59);
                    var totalMonths = monthsDiff(new Date(), toStartDate);
                    var just = [];
                    for (var i = 0; i < totalMonths; i++) {
                        just.push(i);
                    }
                    async.each(just, function(i, cb2) {
                        var startDate = toStartDate.setMonth(toStartDate.getMonth() + i);
                        toStartDate = new Date(yea, mon, (day + 6), 23, 59, 59);
                        var endDate = toStartDate.setMonth(toStartDate.getMonth() + (i + 1));
                        toStartDate = new Date(yea, mon, (day + 6), 23, 59, 59);
                        var atDates = { "$gte": new Date(startDate), "$lt": new Date(endDate) };
                        Appointment.aggregate([
                            { $match: { "appointmentStartTime": atDates, "parlorId": p._id, "status": 3 } },
                            { $group: { "_id": p._id, serviceRev: { $sum: "$serviceRevenue" }, productRev: { $sum: "$productRevenue" }, count: { $sum: 1 } } },
                            { $project: { "_id": 0, "revenue": { $add: ["$serviceRev", "$productRev"] }, count: 1 } }
                        ], function(err, rev) {
                            if (err) {
                                cb2();
                            } else {
                                if (rev.length > 0) {
                                    var oneData = {};
                                    oneData["Revenue"] = rev[0].revenue;
                                    oneData["Apps"] = rev[0].count;
                                    oneData["monthStart"] = new Date(startDate);
                                    oneData["monthEnd"] = new Date(endDate);
                                    oneData["Month"] = i;
                                    cohortData.push(oneData);
                                    cb2();
                                } else {
                                    cb2();
                                }
                            }
                        })
                    }, function() {
                        parlorData.cohortData = cohortData.sort(function(a, b) { return a.Month - b.Month });
                        data.push(parlorData);
                        cb();
                    });

                }

            })
        }, function() {
            res.json(data);
        });
    })
})

router.post("/revenueReport", (req, res) => {

    var data = [];

    Parlor.find({}, { name: 1, parlorLiveDate: 1 }, function(err, par) {
        async.each(par, function(p, cb) {
            var parlorData = {};
            var monthlyData = [];

            var d = new Date(req.body.startDate);
            var yea = d.getFullYear();
            var mon = d.getMonth();
            var day = d.getDate();
            var toStartDate = new Date(yea, mon, day);

            var endingDate = new Date(req.body.endDate);
            endingDate.setDate(endingDate.getDate() + 1);

            // var toStartDate = new Date(req.body.startDate);
            // var yea = toStartDate.getFullYear();
            // var mon = toStartDate.getMonth();
            // var day = toStartDate.getDate();


            var totalMonths = monthsDiff(endingDate, new Date(req.body.startDate));
            // var totalMonths = monthsDiff(new Date(), toStartDate);

            if (totalMonths > 0) {

                var just = [];
                for (var i = 0; i < totalMonths; i++) {
                    just.push(i);
                }

                async.each(just, function(i, cb2) {
                    var startDate = toStartDate.setMonth(toStartDate.getMonth() + i);
                    toStartDate = new Date(yea, mon, day);
                    var endDate = toStartDate.setMonth(toStartDate.getMonth() + (i + 1));
                    toStartDate = new Date(yea, mon, day);
                    var atDates = { "$gte": new Date(startDate), "$lt": new Date(endDate) };
                    Appointment.aggregate([
                        { $match: { "appointmentStartTime": atDates, "parlorId": p._id, "status": 3 } },
                        { $group: { "_id": p._id, serviceRev: { $sum: "$serviceRevenue" }, productRev: { $sum: "$productRevenue" }, count: { $sum: { $size: "$services" } } } },
                        { $project: { "_id": 0, serviceRevenue: "$serviceRev", productRevenue: "$productRev", "totalRevenue": { $add: ["$serviceRev", "$productRev"] }, count: 1 } }
                    ], function(err, rev) {
                        if (err) {
                            cb2();
                        } else {
                            if (rev.length > 0) {
                                var oneData = {};
                                oneData["parlorLiveDate"] = p.parlorLiveDate;
                                oneData["name"] = p.name;
                                oneData["serviceRevenue"] = rev[0].serviceRevenue;
                                oneData["productRevenue"] = rev[0].productRevenue;
                                oneData["totalRevenue"] = rev[0].totalRevenue;
                                oneData["Apps"] = rev[0].count;
                                oneData["monthStart"] = new Date(startDate);
                                oneData["monthEnd"] = new Date(endDate);
                                oneData["Month"] = i;
                                monthlyData.push(oneData);
                                cb2();
                            } else {
                                var oneData = {};
                                oneData["parlorLiveDate"] = p.parlorLiveDate;
                                oneData["name"] = p.name;
                                oneData["serviceRevenue"] = 0;
                                oneData["productRevenue"] = 0;
                                oneData["totalRevenue"] = 0;
                                oneData["Apps"] = 0;
                                oneData["monthStart"] = new Date(startDate);
                                oneData["monthEnd"] = new Date(endDate);
                                oneData["Month"] = i;
                                monthlyData.push(oneData);
                                cb2();
                            }
                        }
                    })
                }, function() {
                    parlorData.name = p.name;
                    parlorData.parlorLiveDate = p.parlorLiveDate;
                    parlorData.parlorId = p._id;
                    parlorData.monthlyData = monthlyData.sort(function(a, b) { return a.Month - b.Month })
                    data.push(parlorData);
                    cb();
                });

            } else { //if no month is formed

                console.log("no month formed");

                Appointment.aggregate([
                    { $match: { "appointmentStartTime": { $gte: new Date(req.body.startDate), $lt: new Date(req.body.endDate) }, "parlorId": p._id, "status": 3 } },
                    { $group: { "_id": p._id, serviceRev: { $sum: "$serviceRevenue" }, productRev: { $sum: "$productRevenue" }, count: { $sum: { $size: "$services" } } } },
                    { $project: { "_id": 0, serviceRevenue: "$serviceRev", productRevenue: "$productRev", "totalRevenue": { $add: ["$serviceRev", "$productRev"] }, count: 1 } }
                ], function(err, rev) {
                    if (err) {
                        cb();
                    } else {
                        if (rev.length > 0) {
                            var oneData = {};
                            oneData["parlorLiveDate"] = p.parlorLiveDate;
                            oneData["name"] = p.name;
                            oneData["serviceRevenue"] = rev[0].serviceRevenue;
                            oneData["productRevenue"] = rev[0].productRevenue;
                            oneData["totalRevenue"] = rev[0].totalRevenue;
                            oneData["Apps"] = rev[0].count;
                            oneData["monthStart"] = new Date(req.body.startDate);
                            oneData["monthEnd"] = new Date(req.body.endDate);
                            monthlyData.push(oneData);
                            parlorData.name = p.name;
                            parlorData.parlorLiveDate = p.parlorLiveDate;
                            parlorData.parlorId = p._id;
                            parlorData.monthlyData = monthlyData;
                            data.push(parlorData);
                            cb();
                        } else {
                            var oneData = {};
                            oneData["parlorLiveDate"] = p.parlorLiveDate;
                            oneData["name"] = p.name;
                            oneData["serviceRevenue"] = 0;
                            oneData["productRevenue"] = 0;
                            oneData["totalRevenue"] = 0;
                            oneData["Apps"] = 0;
                            oneData["monthStart"] = new Date(req.body.startDate);
                            oneData["monthEnd"] = new Date(req.body.endDate);
                            monthlyData.push(oneData);
                            parlorData.name = p.name;
                            parlorData.parlorLiveDate = p.parlorLiveDate;
                            parlorData.parlorId = p._id;
                            parlorData.monthlyData = monthlyData;
                            data.push(parlorData);
                            cb();
                        }
                    }
                })

            } //if ends here

        }, function() {
            res.json(data);
        })

    });
})

router.post("/revenueCohort3", function(req, res) {
    var data = [];
    Parlor.find({ "active": true }, { name: 1, parlorLiveDate: 1 }, function(err, par) {
        async.each(par, function(p, cb) {
            var parlorData = {};
            var cohortData = [];
            var d = new Date(2017, 0, 1);
            var yea = d.getFullYear();
            var mon = d.getMonth();
            var day = d.getDate();
            var atDates = { "$gte": new Date(yea, mon, day), "$lt": new Date(yea, mon, (day + 6), 23, 59, 59) };
            var toStartDate = new Date(yea, mon, (day), 23, 59, 59);
            parlorData.parlorName = p.name;
            parlorData.parlorId = p._id;
            Appointment.aggregate([
                { $match: { "appointmentStartTime": atDates, "parlorId": p._id, "status": 3 } },
                { $group: { "_id": p._id, serviceRev: { $sum: "$serviceRevenue" }, productRev: { $sum: "$productRevenue" }, count: { $sum: { $size: "$services" } } } },
                { $project: { "_id": 0, "revenue": { $add: ["$serviceRev", "$productRev"] }, count: 1 } }
            ], function(err, resp) {
                if (resp.length == 0) {
                    parlorData.firstWeekRevenue = 0;
                    parlorData.firstWeekApps = 0;
                    parlorData.parlorLiveDate = p.parlorLiveDate;
                } else {
                    parlorData.firstWeekRevenue = resp[0].revenue;
                    parlorData.firstWeekApps = resp[0].count;
                    parlorData.parlorLiveDate = p.parlorLiveDate;
                }
                var totalMonths = monthsDiff(new Date(), toStartDate);
                var just = [];
                for (var i = 0; i < totalMonths; i++) {
                    just.push(i);
                }

                async.each(just, function(i, cb2) {
                    var startDate = toStartDate.setMonth(toStartDate.getMonth() + i);
                    toStartDate = new Date(yea, mon, (day), 23, 59, 59);
                    var endDate = toStartDate.setMonth(toStartDate.getMonth() + (i + 1));
                    toStartDate = new Date(yea, mon, (day), 23, 59, 59);
                    var atDates = { "$gte": new Date(startDate), "$lt": new Date(endDate) };
                    Appointment.aggregate([
                        { $match: { "appointmentStartTime": atDates, "parlorId": p._id, "status": 3 } },
                        { $group: { "_id": p._id, serviceRev: { $sum: "$serviceRevenue" }, productRev: { $sum: "$productRevenue" }, count: { $sum: { $size: "$services" } } } },
                        { $project: { "_id": 0, "revenue": { $add: ["$serviceRev", "$productRev"] }, count: 1 } }
                    ], function(err, rev) {
                        if (err) {
                            cb2();
                        } else {
                            if (rev.length > 0) {
                                var oneData = {};
                                oneData["Revenue"] = rev[0].revenue;
                                oneData["Apps"] = rev[0].count;
                                oneData["monthStart"] = new Date(startDate);
                                oneData["monthEnd"] = new Date(endDate);
                                oneData["Month"] = i;
                                cohortData.push(oneData);
                                cb2();
                            } else {
                                cb2();
                            }
                        }
                    })
                }, function() {
                    parlorData.cohortData = cohortData.sort(function(a, b) { return a.Month - b.Month });
                    data.push(parlorData);
                    cb();
                });
            })
        }, function() {
            console.log("all done");
            res.json(data);
        });
    })
})

function totalIncentiveOneMonth(parlorId, month, year, cb) {
    var parlorId = parlorId;
    var month = month;
    var year = year;
    Parlor.findOne({ "_id": parlorId, "active": true }, { name: 1, L1: 1, L2: 1, L3: 1 }, function(err1, response1) {
        if (err1 || response1 == null || response1.length <= 0) {
            cb(1, null, null, null, null, null);
        } else {
            Appointment.aggregate([
                { $match: { "parlorId": ObjectId(parlorId), appointmentStartTime: { "$gte": new Date(year, month, 1, 0, 0, 0), "$lt": new Date(year, (month + 1), 1, 0, 0, 0) } } },
                { $group: { "_id": "$parlorId", serviceRevenue: { $sum: "$serviceRevenue" }, productRevenue: { $sum: "$productRevenue" } } },
                { $project: { totalRevenue: { $sum: ["$serviceRevenue", "$productRevenue"] }, "_id": 0 } }
            ], function(err2, response2) {
                if (err2) {
                    cb("Something went wrong please try again.", null);
                } else {
                    if (response2.length > 0) {
                        cb(null, response1.name, response1.L1, response1.L2, response1.L3, response2[0].totalRevenue);
                    } else {
                        cb(null, response1.name, response1.L1, response1.L2, response1.L3, 0);
                    }
                }
            });
        }
    });
}

function getIncentive(role, level, parlorName, cb) {
    var incentive = 0;
    var incentiveData = ConstantService.opsIncentive();
    var incentiveArray = [];
    if (level == 0 || level == 1 || level == 2) {
        var levelData = incentiveData.incentive.levels[level].incentives;
        async.each(levelData, function(l, cb1) {
            if (l.role == role) {
                incentive = l.incentive;
                cb1();
            } else {
                cb1();
            }
        }, function() {
            async.each(incentiveData.incentive.levels, function(v, cb2) {
                async.each(v.incentives, function(vi, cb3) {
                    if (vi.role == role) {
                        incentiveArray.push(vi.incentive);
                        cb3();
                    } else {
                        cb3();
                    }
                }, function() {
                    cb2();
                })
            }, function() {
                cb(incentive, incentiveArray);
            });

        })
    } else {
        async.each(incentiveData.incentive.levels, function(v, cb2) {
            async.each(v.incentives, function(vi, cb3) {
                if (vi.role == role) {
                    incentiveArray.push(vi.incentive);
                    cb3();
                } else {
                    cb3();
                }
            }, function() {
                cb2();
            })
        }, function() {
            cb(0, incentiveArray);
        });
    }
}

router.post("/opsIncentive", function(req, res) {
    var opsId = req.body.opsId;
    var month = req.body.month;
    var year = req.body.year;
    var totalIncentive = 0;
    var data = [];
    Beu.findOne({ "_id": opsId }, { parlorIds: 1, role: 1, firstName: 1, lastName: 1 }, function(err, result) {
        if (err) {
            res.json(CreateObjService.response(true, "Something went wrong please try again."));
        } else {
            var createOneData = function(parlorName, totalParlorRevenue, incentive, message, L1, L2, L3, incentiveArray) {
                var oneData = {};
                oneData.type = parlorName;
                oneData.incentiveModel = [{ "range": L1, "incentive": (L1 == 0 ? 0 : incentiveArray[0]), "_id": "" },
                    { "range": L2, "incentive": (L2 == 0 ? 0 : incentiveArray[1]), "_id": "" },
                    { "range": L3, "incentive": (L3 == 0 ? 0 : incentiveArray[2]), "_id": "" }
                ]
                oneData.totalRevenue = totalParlorRevenue;
                oneData.totalIncentive = incentive;
                var ttoday = new Date();
                var day = ttoday.getDate();
                var y = ttoday.getFullYear()
                var m = ttoday.getMonth() + 1;
                var p = 0;
                if (month == ttoday.getMonth() && daysInMonth(m, y) != day) {
                    p = (message.target / (daysInMonth(m, y) - day)).toFixed(1)
                } else if (daysInMonth(m, y) == day) {
                    p = message.target;
                }
                oneData.runRate = p;
                oneData.diff = message;
                return oneData;
            }

            async.each(result.parlorIds, function(pId, cb) {
                totalIncentiveOneMonth(pId, month, year, function(err, parlorName, L1, L2, L3, totalParlorRevenue) {
                    if (err) {
                        cb();
                    } else {
                        var oneData = {};
                        if (totalParlorRevenue == 0) {
                            getIncentive(result.role, null, parlorName, function(incentive, incentiveArray) {
                                totalIncentive += incentive;
                                var message = { target: (L1 - totalParlorRevenue), incentive: incentiveArray[0] };
                                data.push(createOneData(parlorName, totalParlorRevenue, incentive, message, L1, L2, L3, incentiveArray));
                                cb();
                            });
                        } else {
                            if (totalParlorRevenue < L1) {
                                getIncentive(result.role, null, parlorName, function(incentive, incentiveArray) {
                                    totalIncentive += incentive;
                                    var message = { target: (L1 - totalParlorRevenue), incentive: incentiveArray[0] };
                                    data.push(createOneData(parlorName, totalParlorRevenue, incentive, message, L1, L2, L3, incentiveArray));
                                    cb();
                                });
                            }
                            if (totalParlorRevenue >= L1 && totalParlorRevenue < L2) {
                                getIncentive(result.role, 0, parlorName, function(incentive, incentiveArray) {
                                    totalIncentive += incentive;
                                    var message = { target: (L2 - totalParlorRevenue), incentive: incentiveArray[1] };
                                    data.push(createOneData(parlorName, totalParlorRevenue, incentive, message, L1, L2, L3, incentiveArray));
                                    cb();
                                });
                            }
                            if (totalParlorRevenue >= L2 && totalParlorRevenue < L3) {
                                getIncentive(result.role, 1, parlorName, function(incentive, incentiveArray) {
                                    totalIncentive += incentive;
                                    var message = { target: (L3 - totalParlorRevenue), incentive: incentiveArray[2] };
                                    data.push(createOneData(parlorName, totalParlorRevenue, incentive, message, L1, L2, L3, incentiveArray));
                                    cb();
                                });
                            }
                            if (totalParlorRevenue >= L3) {
                                getIncentive(result.role, 2, parlorName, function(incentive, incentiveArray) {
                                    totalIncentive += incentive;
                                    var message = { target: 0, incentive: 0 };
                                    data.push(createOneData(parlorName, totalParlorRevenue, incentive, message, L1, L2, L3, incentiveArray));
                                    cb();
                                });
                            }
                        }
                    }
                })
            }, function() {
                console.log("All done");
                res.json(CreateObjService.response(false, { employeeId: result._id, name: result.firstName + " " + result.lastName, totalIncentive: totalIncentive, details: data }));
            })
        }
    })
});

router.post("/billingConcerns", function(req, res) {

    var parlorId = req.body.parlorId;
    var d = new Date();
    var day = d.getDate();
    var y = d.getFullYear();
    var m = d.getMonth();

    Appointment.aggregate([{
            $match: {
                parlorId: ObjectId(parlorId),
                appointmentStartTime: { "$gte": new Date(y, m, (day - 7), 0, 0, 0), "$lt": new Date(y, m, (day), 0, 0, 0) },
                status: 3,
            }
        },
        {
            $group: {
                _id: {
                    $dateToString: {
                        format: "%d/%m/%Y",
                        date: "$appointmentStartTime"
                    }
                },
                appData: { $push: { serviceRevenue: "$serviceRevenue", appointmentType: "$appointmentType" } },
            }
        },
        { $unwind: "$appData" },
        { $group: { "_id": null, totalRevenue: { $sum: "$appData.serviceRevenue" }, dayWise: { $push: { day: "$_id", appData: "$appData" } } } },
        { $project: { "_id": 0, totalRevenue: 1, dayWise: 1 } },
        { $unwind: "$dayWise" },
        {
            $group: {
                "_id": "$dayWise.day",
                totalRevenue: { $first: "$totalRevenue" },
                appRevenue: { $sum: { $cond: [{ $eq: ['$dayWise.appData.appointmentType', 3] }, '$dayWise.appData.serviceRevenue', 0] } },
                nonAppRevenue: { $sum: { $cond: [{ $ne: ['$dayWise.appData.appointmentType', 3] }, '$dayWise.appData.serviceRevenue', 0] } },
                dayRevenue: { $sum: '$dayWise.appData.serviceRevenue' },
            }
        },
        { $project: { "day": "$_id", "_id": 0, totalRevenue: 1, appRevenue: 1, nonAppRevenue: 1, dayRevenue: 1 } },
        {
            $group: {
                "_id": "$totalRevenue",
                app: { $push: { day: "$day", revenue: { $trunc: "$appRevenue" } } },
                nonapp: { $push: { day: "$day", revenue: { $trunc: "$nonAppRevenue" } } },
                total: { $push: { day: "$day", revenue: { $trunc: "$dayRevenue" } } }
            }
        },
        { $project: { totalRevenue: { $trunc: "$_id" }, app: 1, nonapp: 1, total: 1, "_id": 0 } }
    ], function(err, billingData) {
        if (err) {
            res.json(CreateObjService.response(true, "Something went wrong please try again."));
        } else {
            billingData[0].app = dateToMonth(dateSort(billingData[0].app, "day"), "d/m/y");
            billingData[0].nonapp = dateToMonth(dateSort(billingData[0].nonapp, "day"), "d/m/y");
            billingData[0].total = dateToMonth(dateSort(billingData[0].total, "day"), "d/m/y");

            // dateToMonth(dateSort(revenueTotal, "month"), "m/y")
            res.json(CreateObjService.response(false, billingData));
        }
    });
})

router.post("/inventoryConcerns", function(req, res) {
    var opsId = req.body.opsId;
    Beu.findOne({ "_id": opsId }, { parlorIds: 1, _id: 0 }, function(err, result) {
        if (err) {
            res.json(CreateObjService.response(true, "Something went wrong please try again."));
        } else {
            var opsParlors = result.parlorIds;
            ReOrder.aggregate([
                { $match: { status: 1, parlorId: { $in: opsParlors } } },
                {
                    $lookup: {
                        from: "sellers",
                        localField: "sellerId",
                        foreignField: "_id",
                        as: "sellerData"
                    }
                },
                { $unwind: "$sellerData" },
                { $group: { "_id": "$parlorId", notReceived: { $push: { "placedOn": "$createdAt", "name": "$name", "contactNumber": "$sellerData.contactNumber" } } } },
                { $project: { parlorId: "$_id", notReceived: 1, "_id": 0 } },
                {
                    $lookup: {
                        from: "parlors",
                        localField: "parlorId",
                        foreignField: "_id",
                        as: "parlorData"
                    }
                },
                { $unwind: "$parlorData" },
                { $project: { parlorName: "$parlorData.name", parlorId: 1, notReceived: 1 } },
                { $sort: { "parlorName": 1 } }
            ], function(err, notReceived) {
                if (err) {
                    res.json(CreateObjService.response(true, "Something went wrong please try again."));
                } else {
                    res.json(CreateObjService.response(false, notReceived));
                }
            });
        }
    });
});

router.get("/billingConcernParlors", function(req, res) {
    var d = new Date();
    var day = d.getDate();
    var y = d.getFullYear();
    var m = d.getMonth();
    console.log({ "$gte": new Date(y, m, (day - 1), 0, 0, 0), "$lt": new Date(y, m, day, 0, 0, 0) });
    Appointment.aggregate([{
            $match: {
                appointmentStartTime: { "$gte": new Date(y, m, (day - 1), 0, 0, 0), "$lt": new Date(y, m, day, 0, 0, 0) }
            }
        },
        { $group: { "_id": { parlorId: "$parlorId", parlorName: "$parlorName" }, "parlorRevenue": { $sum: "$serviceRevenue" }, "paymentMethod": { $push: "$paymentMethod" } } },
        { $project: { parlorId: "$_id.parlorId", parlorName: "$_id.parlorName", parlorRevenue: 1, paymentMethod: 1, _id: 0 } },
        { $match: { $or: [{ parlorRevenue: { $eq: 0 } }, { paymentMethod: { $nin: [1, 2] } }] } },
        { $project: { paymentMethod: 0, parlorRevenue: 0 } }
    ], function(err, parlors) {
        if (err) {
            res.json(CreateObjService.response(true, "Something went wrong please try again."));
        } else {
            res.json(CreateObjService.response(false, parlors));
        }
    });
});

router.post("/onlineAppointmentPattern", function(req, res) {
    var date = req.body.date;
    var d = (date == undefined) ? new Date() : new Date(date);
    var y = d.getFullYear();
    var m = d.getMonth();
    var day = d.getDate();
    var dayOfWeek = d.getDay() + 1;
    Appointment.aggregate([
        { $match: { "status": 3, "razorPayCaptureResponse.status": { $eq: "captured" }, appointmentStartTime: { $lte: new Date(y, m, day, 23, 59, 59) } } },
        { $project: { dayOfWeek: { $dayOfWeek: "$appointmentStartTime" }, serviceRevenue: 1, productRevenue: 1, appointmentStartTime: 1 } },
        { $match: { dayOfWeek: { $eq: dayOfWeek } } },
        {
            $group: {
                "_id": { day: { $dateToString: { format: "%d/%m/%Y", date: "$appointmentStartTime" } } },
                appointmentStartTime: { $first: "$appointmentStartTime" },
                revenueData: { $push: { amount: { $trunc: { $sum: ["$serviceRevenue", "$productRevenue"] } } } },
                num: { $sum: 1 },
                serviceRevenue: { $sum: "$serviceRevenue" },
                productRevenue: { $sum: "$productRevenue" }
            }
        },
        { $sort: { "appointmentStartTime": -1 } },
        { $limit: 4 },
        { $project: { day: "$_id.day", revenueData: 1, num: 1, amount: { $trunc: { $sum: ["$serviceRevenue", "$productRevenue"] } }, "_id": 0 } },
        { $unwind: "$revenueData" },
        {
            $group: {
                "_id": "$day",
                num: { $first: "$num" },
                amount: { $first: "$amount" },
                "0-500": { $sum: { $cond: [{ $and: [{ $gte: ["$revenueData.amount", 0] }, { $lt: ["$revenueData.amount", 500] }] }, 1, 0] } },
                "500-2000": { $sum: { $cond: [{ $and: [{ $gte: ["$revenueData.amount", 500] }, { $lt: ["$revenueData.amount", 2000] }] }, 1, 0] } },
                "2000-5000": { $sum: { $cond: [{ $and: [{ $gte: ["$revenueData.amount", 2000] }, { $lt: ["$revenueData.amount", 5000] }] }, 1, 0] } },
                "5000-10000": { $sum: { $cond: [{ $and: [{ $gte: ["$revenueData.amount", 5000] }, { $lt: ["$revenueData.amount", 10000] }] }, 1, 0] } },
                " > 10000": { $sum: { $cond: [{ $gte: ["$revenueData.amount", 10000] }, 1, 0] } },
            }
        },
        { $project: { day: "$_id", amount: 1, num: 1, "0-500": 1, "500-2000": 1, "2000-5000": 1, "5000-10000": 1, " > 10000": 1, _id: 0 } }
    ], function(err, result) {
        if (err) {
            return res.json(CreateObjService.response(false, "Something went wrong please try again."));
        } else {
            return res.json(CreateObjService.response(false, dateSort(result, "day")));
        }
    })
})

var getDaysInMonth = function(month, year) {
    return new Date(year, month, 0).getDate();
};

function totalWorkDaysInMonth(parlorId, month, year, cb) {
    var parlorId = parlorId;
    var month = month;
    var year = year;
    Parlor.findOne({ "_id": parlorId }, { dayClosed: 1 }, function(err, response) {
        if (err) {
            cb("Something went wrong please try again.", null);
        } else {
            cb(null, (getDaysInMonth(month + 1, year) - response.dayClosed));
        }
    })
}

function totalPayDays(month, year, employeeId, cb) {
    Attendance.aggregate([
        { $match: { "employeeId": { '$regex': new RegExp(employeeId, "i") }, createdAt: { "$gte": new Date(year, month, 1, 0, 0, 0), "$lt": new Date(year, (month + 1), 1, 0, 0, 0) } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } } } },
        { $group: { "_id": null, payDays: { $sum: 1 } } },
        { $project: { _id: 0, payDays: 1 } }
    ], function(err, payDays) {
        if (err) {
            cb("Something went wrong please try again.", null);
        } else {
            if (payDays.length > 0) {
                cb(null, (payDays[0].payDays));
            } else {
                cb(null, ("N/A"));
            }
        }
    })
}

router.post("/salarySheet", function(req, res) {
    var parlorId = req.body.parlorId;
    var month = req.body.month;
    var year = req.body.year;
    var data = [];
    totalWorkDaysInMonth(parlorId, month, year, function(err, totalWorkingdays) {
        if (err) {
            res.json("Something went wrong.");
        } else {
            Admin.aggregate([
                { $match: { parlorId: ObjectId(parlorId), "active": true } },
                { $project: { parlorId: "$parlorId", employeeId: "$_id", employeeName: { $concat: ["$firstName", " ", "$lastName"] }, dateOfJoining: "$joiningDate", designation: "$position", accountNumber: "$accountNumber", ifscCode: "$ifscCode", salary: "$salary" } },
            ], function(err, response) {
                async.each(response, function(e, cb) {
                    var oneData = {};
                    totalPayDays(month, year, e.employeeId, function(err1, payDays) {
                        if (err1) {
                            cb();
                        } else {
                            oneData.parlorId = e.parlorId;
                            oneData.employeeId = e.employeeId;
                            oneData.employeeName = e.employeeName;
                            oneData.dateOfJoining = e.dateOfJoining;
                            oneData.designation = e.designation;
                            oneData.ifscCode = e.ifscCode;
                            oneData.salary = e.salary;
                            oneData.workingDays = totalWorkingdays;
                            oneData.payDays = payDays;
                            data.push(oneData);
                            cb();
                        }
                    })
                }, function() {
                    res.json(data);
                });
            })
        }
    })
});

router.post('/incentiveModel', function(req, res) {
    Admin.findOne({ _id: req.body.eId }, { _id: 1, parlorId: 1 }, function(err, dat) {
        Parlor.findOne({ _id: dat.parlorId }, { _id: 1, parlorType: 1 }, function(err, parlor) {
            Incentive.find({}).sort({ sort: 1 }).exec(function(err, incentives) {
                var t = new Date();
                var incentive = [];
                _.forEach(incentives, function(inc) {
                    var incentiveData = _.filter(inc.parlors, function(s) {
                        return s.parlorType == parlor.parlorType
                    })
                    if (incentiveData.length > 0) {
                        incentive.push({
                            name: inc.name,
                            incentive: incentiveData[0].incentives,
                            categoryId: inc.categoryId
                        });
                    } else {
                        incentive.push({
                            name: inc.name,
                            incentive: 0,
                            categoryId: inc.categoryId
                        });
                    }

                });
                var d = [];
                var details = [];
                var data = {};
                var final = [];
                var month = req.body.month ? req.body.month : t.getMonth();
                var year = req.body.year ? req.body.year : t.getFullYear();
                var startDate = HelperService.getFirstDateOfMonth(year, month);
                var endDate = HelperService.getLastDateOfMonth(year, month);
                var eid = req.body.eId;
                Admin.find({ _id: eid }).exec(function(err, employees) {
                    Appointment.employeeIncentiveReport(employees[0], startDate, endDate, function(err, data) {
                        for (var j = 0; j < data.dep.length; j++) {
                            for (var k = 0; k < incentive.length; k++) {
                                if (incentive[k].categoryId == data.dep[j].unitId) {
                                    for (var m = 0; m < incentive[k].incentive.length; m++) {
                                        if (incentive[k].incentive[m].range >= data.dep[j].totalRevenue) {
                                            console.log('range', incentive[k].incentive[m].range);
                                            var dif = {};
                                            dif.target = (incentive[k].incentive[m].range - data.dep[j].totalRevenue);
                                            dif.incentive = incentive[k].incentive[m].incentive;
                                            console.log(dif);
                                            break;
                                        }
                                    }
                                    var today = new Date();
                                    var day = today.getDate();
                                    var y = today.getFullYear()
                                    var m = today.getMonth() + 1;

                                    if (month == today.getMonth()) {
                                        var p = (dif.target / (daysInMonth(m, y) - day)).toFixed(1)
                                    } else {
                                        var p = 0;
                                    }
                                    if (data.dep[j].totalRevenue == 0) {
                                        console.log("skip")
                                    } else {
                                        if (isFinite(p) === true) {
                                            final.push({
                                                type: data.dep[j].unit,
                                                incentiveModel: incentive[k].incentive,
                                                totalRevenue: data.dep[j].totalRevenue,
                                                totalIncentive: data.dep[j].totalIncentive,
                                                diff: dif,
                                                runRate: p
                                            });
                                        } else {
                                            final.push({
                                                type: data.dep[j].unit,
                                                incentiveModel: incentive[k].incentive,
                                                totalRevenue: data.dep[j].totalRevenue,
                                                totalIncentive: data.dep[j].totalIncentive,
                                                diff: dif,
                                                runRate: (dif.target / 1).toFixed(1)
                                            });
                                        }
                                    }
                                }
                            }
                        }
                        var totalIncentive = 0;
                        _.forEach(final, function(f) {
                            totalIncentive += f.totalIncentive
                        })
                        var data = {
                            employeeId: data.employeeId,
                            name: data.name,
                            totalRevenueEmp: data.totalRevenueEmp,
                            empSalary: data.empSalary,
                            parlorName: data.parlorName,
                            parlorAddress: data.parlorAddress,
                            totalAppointments: data.totalAppointments,
                            totalProductRevenueEmp: data.totalProductRevenueEmp,
                            position: data.position,
                            details: final,
                            totalIncentive: totalIncentive
                        };
                        res.json(send(false, 0, [data]));
                    });
                });
            });
        })
    });
});

router.post("/purchaseOrderDetails", function(req, res) {
    ReOrder.aggregate([
        { $match: { parlorId: ObjectId(req.body.parlorId) } },
        {
            $lookup: {
                from: "sellers",
                localField: "sellerId",
                foreignField: "_id",
                as: "sellerData"
            }
        },
        { $unwind: "$sellerData" },
        { $group: { "_id": "$parlorId", orders: { $push: { "placedOn": "$createdAt", "name": "$name", "contactNumber": "$sellerData.contactNumber", "receivedAt": { $ifNull: ["$receivedAt", "Not Received"] }, "items": "$items" } } } },
        { $project: { parlorId: "$_id", orders: 1, "_id": 0 } },
        {
            $lookup: {
                from: "parlors",
                localField: "parlorId",
                foreignField: "_id",
                as: "parlorData"
            }
        },
        { $unwind: "$parlorData" },
        { $project: { parlorName: "$parlorData.name", parlorId: 1, orders: 1 } },
        { $sort: { "orders.receivedAt": -1 } }
    ], function(err, notReceived) {
        if (err) {
            res.json(CreateObjService.response(true, "Something went wrong please try again."));
        } else {
            res.json(CreateObjService.response(false, notReceived));
        }
    });
})

router.get("/salonsWithoutGST", function(req, res) {
    Parlor.find({ $or: [{ "gstNumber": { $exists: false } }, { "gstNumber": "" }], "active": true }, { "name": 1, "address": 1, "address2": 1, "phoneNumber": 1 }, function(err, result) {
        if (err) {
            res.json({ "success": false, data: "Please try again." });
        } else {
            res.json({ "success": true, data: result });
        }
    });
});

router.get("/salonsWithInactiveWifi", function(req, res) {
    Parlor.find({ $or: [{ "wifiName": { $exists: false } }, { "wifiPassword": { $exists: false } }, { "wifiPassword": "" }, { "wifiName": "" }], "active": true }, { "name": 1, "address": 1, "address2": 1, "phoneNumber": 1 }, function(err, result) {
        if (err) {
            res.json({ "success": false, data: "Please try again." });
        } else {
            res.json({ "success": true, data: result });
        }
    });
});

router.get("/loggedInCustomerCare", function(req, res) {
    try {
        var userName = req.session.userName;
        var userId = req.session.userId;
        return res.json({ "success": true, data: { userId: userId, userName: userName } });
    } catch (err) {
        return res.json({ "success": false, "data": "Session Expired Relogin." });
    }
})

router.post("/couponContact", function(req, res) {

    console.log(req.body);

    var historyObject = {
        customerCareId: req.body.customerCareId,
        customerCareName: req.body.customerCareName,
        remark: req.body.remark
    }

    ContactedClients.find({ "clientPhoneNumber": req.body.clientPhoneNumber }, { "clientId": 1 }, function(err, c) {

        if (c.length > 0) {
            ContactedClients.update({ "clientPhoneNumber": req.body.clientPhoneNumber }, { $push: { 'contactHistory': historyObject } }, function(err, created) {
                if (err) {
                    return res.json(CreateObjService.response(true, "Please Try Again"));
                } else {
                    if (Object.keys(created).length > 0) {
                        return res.json(CreateObjService.response(false, "Updated Successfully"));
                    } else {
                        return res.json(CreateObjService.response(true, "Please Try Again"));
                    }
                }
            });
        } else {
            var createObject = {
                clientPhoneNumber: req.body.clientPhoneNumber,
                clientName: req.body.clientName,
                fromWhere: 1,
                contactHistory: historyObject
            }
            ContactedClients.create(createObject, function(err, created) {
                if (err) {
                    return res.json(CreateObjService.response(true, "Please Try Again"));
                } else {
                    if (created) {
                        return res.json(CreateObjService.response(false, "Updated Successfully"));
                    } else {
                        return res.json(CreateObjService.response(true, "Please Try Again"));
                    }
                }
            });
        }
    });
})

router.post("/contactClient", function(req, res) {
    var historyObject = {
        customerCareId: req.body.customerCareId,
        customerCareName: req.body.customerCareName,
        remark: req.body.remark,
        callStatus: req.body.callStatus,
        contactedOn: new Date(),
        expectedOn: ((req.body.expectedOn == "") ? "" : req.body.expectedOn)
    }
    ContactedClients.find({ "clientId": req.body.clientId }, { "clientId": 1 }, function(err, c) {
        if (c.length > 0) {
            ContactedClients.update({ "clientId": ObjectId(req.body.clientId) }, { $push: { 'contactHistory': historyObject } }, function(err, created) {
                if (err) {
                    return res.json(CreateObjService.response(true, "Please Try Again"));
                } else {
                    if (Object.keys(created).length > 0) {
                        return res.json(CreateObjService.response(false, "Updated Successfully"));
                    } else {
                        return res.json(CreateObjService.response(true, "Please Try Again"));
                    }
                }
            });
        } else {
            var createObject = {
                clientId: req.body.clientId,
                clientPhoneNumber: req.body.clientPhoneNumber,
                clientName: req.body.clientName,
                lastVisitedParlorName: req.body.lastVisitedParlorName,
                lastVisitedParlorId: req.body.lastVisitedParlorId,
                lastVisited: req.body.lastVisited,
                toCompareDate: req.body.lastVisited,
                contactHistory: historyObject
            }
            ContactedClients.create(createObject, function(err, created) {
                if (err) {
                    return res.json(CreateObjService.response(true, "Please Try Again"));
                } else {
                    if (created) {
                        return res.json(CreateObjService.response(false, "Updated Successfully"));
                    } else {
                        return res.json(CreateObjService.response(true, "Please Try Again"));
                    }
                }
            });
        }
    });
});

router.post("/contactedClients", function(req, res) {
    var page = req.body.page;
    var fromWhere = req.body.fromWhere !== undefined ? req.body.fromWhere : 0;
    var skipLim = 20;
    var data = {};

    if (fromWhere == 1) {

        var contactedClients = new Promise(function(resolve, reject) {
            ContactedClients.aggregate([
                { $match: { fromWhere: fromWhere } },
                { $skip: ((page - 1) * skipLim) },
                { $limit: skipLim },
                { $sort: { "createdAt": -1 } }
            ], function(err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            })
        });

        var contactedClientsCount = new Promise(function(resolve, reject) {
            ContactedClients.aggregate([
                { $match: { fromWhere: fromWhere } },
                { $group: { "_id": null, totalCount: { $sum: 1 } } }
            ], function(err, totalCount) {
                if (err) {
                    reject(err);
                } else {
                    if (totalCount.length < 1) {
                        resolve(0);
                    } else {
                        resolve(totalCount[0].totalCount);
                    }
                }
            })
        });

        Promise.all([contactedClients, contactedClientsCount]).then(values => {
            data.clients = values[0];
            data.total_count = values[1];
            res.json(CreateObjService.response(false, data));
        }).catch(reason => {
            console.log(reason);
            res.json(CreateObjService.response(true, "Server error please try again."));
        });

    } else {

        var callStatus = req.body.callStatus;
        var startDate = req.body.startDate;
        var endDate = req.body.endDate;
        var contactedBy = req.body.contactedBy;
        var contactOnMatchObject = { $match: {} };
        var latestCallStatusMatchObject = { $match: {} };
        var latestContactedByMatchObject = { $match: {} };
        if (callStatus == undefined || callStatus == null || callStatus == "") {} else {
            latestCallStatusMatchObject = { $match: { latestCallStatus: { $eq: callStatus } } };
        }
        if (startDate == "" || endDate == "" || startDate == undefined || endDate == undefined || startDate == "" || endDate == "" || startDate == null || endDate == null) {} else {
            contactOnMatchObject = { $match: { lastContactedOn: { $gte: new Date(startDate), $lt: new Date(endDate) } } };
        }
        if (contactedBy == undefined || contactedBy == null || contactedBy == "") {} else {
            latestContactedByMatchObject = { $match: { lastContactedBy: { $eq: contactedBy } } };
        }
        var contactedClients = new Promise(function(resolve, reject) {
            ContactedClients.aggregate([
                { $match: { fromWhere: fromWhere } },
                { $project: { createdAt: 1, clientId: 1, clientName: 1, lastVisitedParlorName: 1, lastVisitedDate: "$toCompareDate", clientPhoneNumber: 1, contactHistory: 1, lastVisited: 1, diffDate: { "$subtract": ["$toCompareDate", "$lastVisited"] }, contactHistorySize: { $size: "$contactHistory" } } },
                {
                    $project: {
                        createdAt: 1,
                        clientId: 1,
                        clientName: 1,
                        lastVisitedParlorName: 1,
                        clientPhoneNumber: 1,
                        lastVisitedDate: 1,
                        contactHistory: 1,
                        lastVisited: 1,
                        diffDate: 1,
                        latestCallStatus: { $arrayElemAt: ['$contactHistory.callStatus', { $subtract: ["$contactHistorySize", 1] }] },
                        lastContactedOn: { $arrayElemAt: ['$contactHistory.contactedOn', { $subtract: ["$contactHistorySize", 1] }] },
                        lastContactedBy: { $arrayElemAt: ['$contactHistory.customerCareName', { $subtract: ["$contactHistorySize", 1] }] }
                    }
                },
                { $project: { createdAt: 1, clientId: 1, diffDate: 1, clientName: 1, lastVisitedParlorName: 1, clientPhoneNumber: 1, lastVisitedDate: 1, contactHistory: 1, lastVisited: 1, latestCallStatus: 1, lastContactedOn: 1, lastContactedBy: 1 } },
                { $match: { diffDate: { $lte: 0 } } },
                { $project: { diffDate: 0 } },
                contactOnMatchObject,
                latestCallStatusMatchObject,
                latestContactedByMatchObject,
                { $project: { lastContactedOn: 0 } },
                { $skip: ((page - 1) * skipLim) },
                { $limit: skipLim },
                { $sort: { "createdAt": -1 } }
            ], function(err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            })
        });
        var contactedClientsCount = new Promise(function(resolve, reject) {
            ContactedClients.aggregate([
                { $match: { fromWhere: fromWhere } },
                { $project: { contactHistory: 1, diffDate: { "$subtract": ["$toCompareDate", "$lastVisited"] }, contactHistorySize: { $size: "$contactHistory" } } },
                {
                    $project: {
                        contactHistory: 1,
                        diffDate: 1,
                        latestCallStatus: { $arrayElemAt: ['$contactHistory.callStatus', { $subtract: ["$contactHistorySize", 1] }] },
                        lastContactedOn: { $arrayElemAt: ['$contactHistory.contactedOn', { $subtract: ["$contactHistorySize", 1] }] },
                        lastContactedBy: { $arrayElemAt: ['$contactHistory.customerCareName', { $subtract: ["$contactHistorySize", 1] }] }
                    }
                },
                { $project: { diffDate: 1, contactHistory: 1, latestCallStatus: 1, lastContactedOn: 1, lastContactedBy: 1 } },
                { $match: { diffDate: { $lte: 0 } } },
                { $project: { diffDate: 0 } },
                contactOnMatchObject,
                latestCallStatusMatchObject,
                latestContactedByMatchObject,
                { $group: { "_id": null, totalCount: { $sum: 1 } } }
            ], function(err, totalCount) {
                if (err) {
                    reject(err);
                } else {
                    if (totalCount.length < 1) {
                        resolve(0);
                    } else {
                        resolve(totalCount[0].totalCount);
                    }
                }
            })
        });
        Promise.all([contactedClients, contactedClientsCount]).then(values => {
            data.clients = values[0];
            data.total_count = values[1];
            res.json(CreateObjService.response(false, data));
        }).catch(reason => {
            console.log(reason);
            res.json(CreateObjService.response(true, "Server error please try again."));
        });

    } //else ends

});

router.post("/websiteQueryConverts", function(req, res) {
    var data = {};
    WebsiteQuery.find({ "isConverted": true, "queryType": 0 }).count(function(err, total_count) {
        if (err) {
            res.json(CreateObjService.response(true, "Server error."));
        } else {
            WebsiteQuery.aggregate([
                { $match: { "isConverted": true, "queryType": 0 } },
                {
                    $lookup: {
                        from: "users",
                        localField: "phoneNumber",
                        foreignField: "phoneNumber",
                        as: "userData"
                    }
                },
                { $unwind: "$userData" },
                {
                    $project: {
                        clientId: "$userData._id",
                        clientName: "$name",
                        clientPhoneNumber: "$phoneNumber",
                        contactHistory: [{ remark: "$agentResponse", contactedOn: "$createdAt" }]
                    }
                } //, email : 1, queryText : 1, agentResponse : 1}}
            ], function(err, clients) {
                if (err) {
                    res.json(CreateObjService.response(true, "Server error."));
                } else {
                    data.clients = clients;
                    data.total_count = total_count;
                    res.json(CreateObjService.response(false, data));
                }
            })
        }
    })
});

router.post("/convertedClients", function(req, res) {
    var page = req.body.page;
    var fromWhere = req.body.fromWhere !== undefined ? req.body.fromWhere : 0;
    var skipLim = 20;
    var lastParlorId = req.body.lastParlorId;
    var data = {};

    if (fromWhere == 1) {
        var convertedClients = new Promise(function(resolve, reject) {
            ContactedClients.aggregate([
                { $match: { isConverted: true } },
                { $sort: { createdAt: -1 } },
                { $project: { "clientPhoneNumber": 1, "clientName": 1, "contactHistory": 1, "couponCode": 1, "couponUsedDate": 1 } },
                { $project: { "clientPhoneNumber": 1, "clientName": 1, "contactHistory": 1, "couponUsedDate": 1, "couponCode": { $ifNull: ["$couponCode", " "] } } },
                { $project: { "clientName": { $concat: ["$clientName", "(", "$couponCode", ")"] }, "couponUsedDate": 1, "clientPhoneNumber": 1, "contactHistory": 1 } },
                { $skip: ((page - 1) * skipLim) },
                { $limit: skipLim }
            ], function(err, clients) {
                if (err) {
                    reject(err);
                } else {
                    resolve(clients);
                }
            })
        })

        var convertedClientsCount = new Promise(function(resolve, reject) {
            ContactedClients.aggregate([
                { $match: { isConverted: true } },
                { $group: { "_id": null, totalCount: { $sum: 1 } } }
            ], function(err, totalCount) {
                if (err) {
                    reject(err);
                } else {
                    if (totalCount.length == 0) {
                        resolve(0);
                    } else {
                        resolve(totalCount[0].totalCount);
                    }
                }
            })
        })

        Promise.all([convertedClients, convertedClientsCount]).then(values => {
            data.clients = values[0];
            data.total_count = values[1];
            res.json(CreateObjService.response(false, data));
        }).catch(reason => {
            res.json(CreateObjService.response(true, "Server error please try again."));
        });

    } else {

        var previousParlorId = req.body.previousParlorId;
        var previousParlorMatch = { $match: {} };
        var lastParlorMatch = { $match: {} };

        if (previousParlorId != "all" && previousParlorId != undefined) {
            previousParlorMatch = { $match: { "lastVisitedParlorId": ObjectId(previousParlorId) } };
        }

        if (lastParlorId != "all" && lastParlorId != undefined) {
            lastParlorMatch = { $match: { "latestParlorId": ObjectId(lastParlorId) } };
        }

        var convertedClients = new Promise(function(resolve, reject) {
            ContactedClients.aggregate([
                { $match: { fromWhere: fromWhere } },
                { $project: { createdAt: 1, clientId: 1, lastVisitedParlorId: 1, clientName: 1, lastVisitedParlorName: 1, latestParlorId: 1, latestParlor: 1, lastVisitedDate: "$toCompareDate", clientPhoneNumber: 1, contactHistory: 1, lastVisited: 1, diffDate: { "$subtract": ["$toCompareDate", "$lastVisited"] }, contactHistorySize: { $size: "$contactHistory" } } },
                {
                    $project: {
                        createdAt: 1,
                        clientId: 1,
                        clientName: 1,
                        lastVisitedParlorName: 1,
                        lastVisitedParlorId: 1,
                        clientPhoneNumber: 1,
                        lastVisitedDate: 1,
                        latestParlor: 1,
                        latestParlorId: 1,
                        contactHistory: 1,
                        lastVisited: 1,
                        diffDate: 1,
                        latestCallStatus: { $arrayElemAt: ['$contactHistory.callStatus', { $subtract: ["$contactHistorySize", 1] }] },
                        lastContactedOn: { $arrayElemAt: ['$contactHistory.contactedOn', { $subtract: ["$contactHistorySize", 1] }] },
                        lastContactedBy: { $arrayElemAt: ['$contactHistory.customerCareName', { $subtract: ["$contactHistorySize", 1] }] }
                    }
                },
                { $project: { createdAt: 1, clientId: 1, latestParlor: 1, latestParlorId: 1, diffDate: 1, clientName: 1, lastVisitedParlorName: 1, lastVisitedParlorId: 1, clientPhoneNumber: 1, lastVisitedDate: 1, contactHistory: 1, lastVisited: 1, latestCallStatus: 1, lastContactedOn: 1, lastContactedBy: 1 } },
                { $match: { diffDate: { $gt: 0 } } },
                previousParlorMatch,
                lastParlorMatch,
                { $project: { diffDate: 0 } },
                { $skip: ((page - 1) * skipLim) },
                { $limit: skipLim },
                {
                    $lookup: {
                        from: "parlors",
                        localField: "lastVisitedParlorId",
                        foreignField: "_id",
                        as: "lastParlorData"
                    }
                },
                {
                    $lookup: {
                        from: "parlors",
                        localField: "latestParlorId",
                        foreignField: "_id",
                        as: "latestParlorData"
                    }
                },
                { $unwind: "$lastParlorData" },
                { $unwind: "$latestParlorData" },
                { $project: { createdAt: 1, clientId: 1, latestParlorId: 1, latestParlor: 1, lastParlorActive: "$lastParlorData.active", latestParlorActive: "$latestParlorData.active", diffDate: 1, clientName: 1, lastVisitedParlorName: 1, lastVisitedParlorId: 1, clientPhoneNumber: 1, lastVisitedDate: 1, contactHistory: 1, lastVisited: 1, latestCallStatus: 1, lastContactedOn: 1, lastContactedBy: 1 } },
                { $sort: { "lastVisitedDate": -1 } }
            ], function(err, clients) {
                if (err) {
                    reject(err);
                } else {
                    resolve(clients);
                }
            })
        })

        var convertedClientsCount = new Promise(function(resolve, reject) {
            ContactedClients.aggregate([
                { $match: { fromWhere: fromWhere } },
                { $project: { lastVisitedParlorId: 1, latestParlorId: 1, contactHistory: 1, diffDate: { "$subtract": ["$toCompareDate", "$lastVisited"] }, contactHistorySize: { $size: "$contactHistory" } } },
                {
                    $project: {
                        lastVisitedParlorId: 1,
                        latestParlorId: 1,
                        contactHistory: 1,
                        diffDate: 1,
                        latestCallStatus: { $arrayElemAt: ['$contactHistory.callStatus', { $subtract: ["$contactHistorySize", 1] }] },
                        lastContactedOn: { $arrayElemAt: ['$contactHistory.contactedOn', { $subtract: ["$contactHistorySize", 1] }] },
                        lastContactedBy: { $arrayElemAt: ['$contactHistory.customerCareName', { $subtract: ["$contactHistorySize", 1] }] }
                    }
                },
                { $project: { diffDate: 1, latestParlorId: 1, lastVisitedParlorId: 1, contactHistory: 1, latestCallStatus: 1, lastContactedOn: 1, lastContactedBy: 1 } },
                { $match: { diffDate: { $gt: 0 } } },
                previousParlorMatch,
                lastParlorMatch,
                { $project: { diffDate: 0 } },
                { $group: { "_id": null, totalCount: { $sum: 1 } } }
            ], function(err, totalCount) {
                if (err) {
                    reject(err);
                } else {
                    if (totalCount.length == 0) {
                        resolve(0);
                    } else {
                        resolve(totalCount[0].totalCount);
                    }
                }
            })
        })
        Promise.all([convertedClients, convertedClientsCount]).then(values => {
            data.clients = values[0];
            data.total_count = values[1];
            res.json(CreateObjService.response(false, data));
        }).catch(reason => {
            res.json(CreateObjService.response(true, "Server error please try again."));
        });

    }

});

router.post("/getServices", function(req, res) {
    var clientId = req.body.clientId;
    Appointment.aggregate([
        { $match: { "client.id": ObjectId(clientId), status: 3 } },
        { $unwind: "$services" },
        { $group: { "_id": "client.id", services: { $push: { serviceName: "$services.name", servicePrice: "$services.price" } } } },
        { $project: { "_id": 0, services: 1 } }
    ], function(err, services) {
        if (err) {
            res.json(CreateObjService.response(true, "Server error please try again."));
        } else {
            res.json(CreateObjService.response(false, services));
        }
    });
});

router.post("/lastServiceTotal", function(req, res) {
    var clientId = req.body.clientId;
    Appointment.aggregate([
        { $match: { "client.id": ObjectId(clientId), status: 3 } },
        { $group: { "_id": "$client.id", services: { $last: "$services" } } },
        { $project: { "_id": 0, services: 1 } },
        { $unwind: "$services" },
        { $group: { "_id": null, lastServiceTotal: { $sum: "$services.price" } } }
    ], function(err, services) {
        if (err) {
            res.json(CreateObjService.response(true, "Server error please try again."));
        } else {
            res.json(CreateObjService.response(false, services[0].lastServiceTotal));
        }
    });
});

router.post("/notVisitedFromThreeMonths", function(req, res) {
    var page = req.body.page;
    var skipLim = 20;
    var data = {};
    var d = new Date();
    d.setDate(d.getDate() - 90);
    var parlorId = req.body.parlorId;
    var startDate = req.body.startDate;
    var endDate = req.body.endDate;
    var firstMatchObject = { $match: { status: 3 } };
    var lastMatchObject = { $match: { lastVisited: { "$lt": new Date(d) } } };
    if (parlorId != "all" && (startDate == "undefined" || endDate == "undefined" || startDate == "" || endDate == "" || startDate == null || endDate == null)) {
        firstMatchObject = { $match: { status: 3, parlorId: ObjectId(parlorId) } };
    } else if ((parlorId == "all") && (startDate !== undefined && endDate !== undefined && startDate != "" && endDate != "" && startDate != null && endDate != null)) {
        lastMatchObject = { $match: { lastVisited: { $gte: new Date(startDate), $lt: new Date(endDate) } } };
    } else if ((parlorId != "all") && (startDate !== undefined && endDate !== undefined && startDate != "" && endDate != "" && startDate != null && endDate != null)) {
        firstMatchObject = { $match: { status: 3, parlorId: ObjectId(parlorId) } };
        lastMatchObject = { $match: { lastVisited: { $gte: new Date(startDate), $lt: new Date(endDate) } } };
    }
    var notVisited = new Promise(function(resolve, reject) {
        Appointment.aggregate([
            firstMatchObject,
            { $project: { client: 1, parlorId: 1, parlorName: 1, appointmentStartTime: 1 } },
            { $sort: { appointmentStartTime: 1 } },
            { $group: { "_id": "$client.id", clientName: { $first: "$client.name" }, lastVisited: { $last: "$appointmentStartTime" }, phoneNumber: { $first: "$client.phoneNumber" }, lastVisitedParlorId: { $last: "$parlorId" }, parlorName: { $last: "$parlorName" } } },
            { $project: { clientId: "$_id", "_id": 1, clientName: 1, lastVisitedParlorId: 1, phoneNumber: 1, parlorName: 1, lastVisited: 1 } },
            lastMatchObject,
            {
                $lookup: {
                    from: "contactedclients",
                    localField: "clientId",
                    foreignField: "clientId",
                    as: "clientData"
                }
            },
            { $project: { _id: 1, clientId: 1, clientName: 1, lastVisitedParlorId: 1, parlorName: 1, phoneNumber: 1, lastVisited: 1, isContacted: { $size: "$clientData" } } },
            { $match: { isContacted: 0 } },
            { $project: { isContacted: 0 } },
            { $sort: { "lastVisited": -1 } },
            { $skip: ((page - 1) * skipLim) },
            { $limit: skipLim }
        ], {allowDiskUse: true}, function(err, notVisitedFromThreeMonths) {
            if (err) {
                reject(err);
                console.log(err);
            } else {
                resolve(notVisitedFromThreeMonths)
            }
        })
    });
    var totalClients = new Promise(function(resolve, reject) {
        Appointment.aggregate([
            firstMatchObject,
            { $sort: { appointmentStartTime: 1 } },
            { $group: { "_id": "$client.id", lastVisited: { $last: "$appointmentStartTime" } } },
            { $project: { clientId: "$_id", lastVisited: 1 } },
            lastMatchObject,
            {
                $lookup: {
                    from: "contactedclients",
                    localField: "_id",
                    foreignField: "clientId",
                    as: "clientData"
                }
            },
            { $project: { lastVisited: "$lastVisited", isContacted: { $size: "$clientData" } } },
            { $match: { isContacted: 0 } },
            { $group: { "_id": null, totalCount: { $sum: 1 } } }
        ], function(err, totalCount) {
            if (err) {
                reject(err);
            } else {
                if (totalCount.length < 1) {
                    resolve(0);
                } else {
                    resolve(totalCount[0].totalCount);
                }
            }
        })
    });
    Promise.all([notVisited, totalClients]).then(values => {
        data.notVisitedFromThreeMonths = values[0];
        data.total_count = values[1];
        res.json(CreateObjService.response(false, data));
    }).catch(reason => {
        res.json(CreateObjService.response(true, "Server error please try again."));
    });
});

function getActiveEmployees(parlorId, cb) {
    Admin.find({ "parlorId": ObjectId(parlorId), "active": true }).count(function(err, activeEmployees) {
        if (err) {
            cb(1, null);
        } else {
            cb(null, activeEmployees);
        }
    });
}

function reasonWiseTotalLuckyDraw(m, y, cb) {
    LuckyDrawDynamic.aggregate([
        { $match: { status: 0, createdAt: { "$gte": new Date(y, (m), 1, 0, 0, 0), "$lt": new Date(y, (m + 1), 1, 0, 0, 0) } } },
        { $group: { "_id": "$reason", amount: { $sum: "$amount" }, count: { $sum: 1 } } },
        { $project: { _id: 0, reason: "$_id", amount: 1, count: 1 } },
        {
            $group: {
                "_id": "null",
                "appTransactionTotal": { $sum: { $cond: [{ $eq: ["$reason", "App Transaction"] }, "$amount", 0] } },
                "customerReviewTotal": { $sum: { $cond: [{ $eq: ["$reason", "Customer Review"] }, "$amount", 0] } },
                "averageBillValueTotal": { $sum: { $cond: [{ $eq: ["$reason", "Average bill value"] }, "$amount", 0] } },
                "salonTransactionTotal": { $sum: { $cond: [{ $eq: ["$reason", "Salon Transaction"] }, "$amount", 0] } },
                "serviceBillValueTotal": { $sum: { $cond: [{ $eq: ["$reason", "Service bill value"] }, "$amount", 0] } },
                "productSellTotal": { $sum: { $cond: [{ $eq: ["$reason", "Product Sell"] }, "$amount", 0] } },
                "membershipSoldTotal": { $sum: { $cond: [{ $eq: ["$reason", "Membership Sold"] }, "$amount", 0] } },
                "allTotal": { $sum: "$amount" },
                "appTransactionCount": { $sum: { $cond: [{ $eq: ["$reason", "App Transaction"] }, "$count", 0] } },
                "customerReviewCount": { $sum: { $cond: [{ $eq: ["$reason", "Customer Review"] }, "$count", 0] } },
                "averageBillValueCount": { $sum: { $cond: [{ $eq: ["$reason", "Average bill value"] }, "$count", 0] } },
                "salonTransactionCount": { $sum: { $cond: [{ $eq: ["$reason", "Salon Transaction"] }, "$count", 0] } },
                "serviceBillValueCount": { $sum: { $cond: [{ $eq: ["$reason", "Service bill value"] }, "$count", 0] } },
                "productSellCount": { $sum: { $cond: [{ $eq: ["$reason", "Product Sell"] }, "$count", 0] } },
                "membershipSoldCount": { $sum: { $cond: [{ $eq: ["$reason", "Membership Sold"] }, "$count", 0] } },
                "allCount": { $sum: "$count" }
            }
        },
        {
            $project: {
                "_id": 0
            }
        }
    ], function(err, totalRow) {
        if (err) {
            cb(1, null)
        } else {
            cb(null, totalRow);
        }
    });
}

function oneMonthRevenue(parlorId, m, y, cb) {
    Appointment.aggregate([
        { $match: { "parlorId": ObjectId(parlorId), status: 3, appointmentStartTime: { "$gte": new Date(y, (m), 1, 0, 0, 0), "$lt": new Date(y, (m + 1), 1, 0, 0, 0) } } },
        { $project: { serviceRevenue: 1, productRevenue: 1 } },
        {
            $group: {
                _id: null,
                serviceRevenue: { $sum: "$serviceRevenue" },
                productRevenue: { $sum: "$productRevenue" },
                count: { $sum: 1 }
            }
        },
        { $project: { totalRevenue: { $add: ["$serviceRevenue", "$productRevenue"] } } }
    ], function(err, revenueOfSalon) {
        if (err) {
            cb(1, null);
        } else {
            if (revenueOfSalon.length == 0) {
                cb(null, 0);
            } else {
                cb(null, revenueOfSalon[0].totalRevenue);
            }
        }
    })
}

router.post("/employeeLuckyDrawReport", function(req, res) {
    var m = req.body.month;
    var y = req.body.year;
    var allSalonRevenue = 0;
    var totalActiveEmployees = 0;
    var data = [];
    LuckyDrawDynamic.aggregate([
        { $match: { status: 0, createdAt: { "$gte": new Date(y, (m), 1, 0, 0, 0), "$lt": new Date(y, (m + 1), 1, 0, 0, 0) } } },
        {
            $group: {
                "_id": { reason: "$reason", month: { $dateToString: { format: "%m/%Y", date: "$createdAt" } }, parlorId: "$parlorId" },
                categoryAmount: { $sum: "$amount" },
                categoryCount: { $sum: 1 }
            }
        },
        { $project: { _id: 0, categoryName: "$_id.reason", month: "$_id.month", parlorId: "$_id.parlorId", categoryAmount: "$categoryAmount", categoryCount: "$categoryCount" } },
        {
            $lookup: {
                from: "luckydrawmodels",
                localField: "parlorId",
                foreignField: "parlorId",
                as: "frequencyData"
            }
        },
        {
            $lookup: {
                from: "parlors",
                localField: "parlorId",
                foreignField: "_id",
                as: "parlorData"
            }
        },
        { $unwind: "$frequencyData" },
        { $unwind: "$parlorData" },
        {
            $group: {
                "_id": { parlorId: "$parlorId", month: "$month" },
                "parlorName": { $first: "$parlorData.name" },
                "appTransactionAmount": { $sum: { $cond: [{ $eq: ["$categoryName", "App Transaction"] }, "$categoryAmount", 0] } },
                "customerReviewAmount": { $sum: { $cond: [{ $eq: ["$categoryName", "Customer Review"] }, "$categoryAmount", 0] } },
                "averageBillValueAmount": { $sum: { $cond: [{ $eq: ["$categoryName", "Average bill value"] }, "$categoryAmount", 0] } },
                "salonTransactionAmount": { $sum: { $cond: [{ $eq: ["$categoryName", "Salon Transaction"] }, "$categoryAmount", 0] } },
                "serviceBillValueAmount": { $sum: { $cond: [{ $eq: ["$categoryName", "Service bill value"] }, "$categoryAmount", 0] } },
                "productSellAmount": { $sum: { $cond: [{ $eq: ["$categoryName", "Product Sell"] }, "$categoryAmount", 0] } },
                "membershipSoldAmount": { $sum: { $cond: [{ $eq: ["$categoryName", "Membership Sold"] }, "$categoryAmount", 0] } },
                "totalAmount": { $sum: "$categoryAmount" },
                "appTransactionCount": { $sum: { $cond: [{ $eq: ["$categoryName", "App Transaction"] }, "$categoryCount", 0] } },
                "customerReviewCount": { $sum: { $cond: [{ $eq: ["$categoryName", "Customer Review"] }, "$categoryCount", 0] } },
                "averageBillValueCount": { $sum: { $cond: [{ $eq: ["$categoryName", "Average bill value"] }, "$categoryCount", 0] } },
                "salonTransactionCount": { $sum: { $cond: [{ $eq: ["$categoryName", "Salon Transaction"] }, "$categoryCount", 0] } },
                "serviceBillValueCount": { $sum: { $cond: [{ $eq: ["$categoryName", "Service bill value"] }, "$categoryCount", 0] } },
                "productSellCount": { $sum: { $cond: [{ $eq: ["$categoryName", "Product Sell"] }, "$categoryCount", 0] } },
                "membershipSoldCount": { $sum: { $cond: [{ $eq: ["$categoryName", "Membership Sold"] }, "$categoryCount", 0] } },
                "totalCount": { $sum: "$categoryCount" },
                "frequencyData": { $first: "$frequencyData" }
            }
        },
        {
            $project: {
                "_id": 0,
                "month": "$_id.month",
                "parlorId": "$_id.parlorId",
                "parlorName": 1,
                "appTransactionAmount": 1,
                "customerReviewAmount": 1,
                "averageBillValueAmount": 1,
                "salonTransactionAmount": 1,
                "serviceBillValueAmount": 1,
                "productSellAmount": 1,
                "membershipSoldAmount": 1,
                "totalAmount": 1,
                "appTransactionCount": 1,
                "customerReviewCount": 1,
                "averageBillValueCount": 1,
                "salonTransactionCount": 1,
                "serviceBillValueCount": 1,
                "productSellCount": 1,
                "membershipSoldCount": 1,
                "totalCount": 1,
                "appTransactionFrequency": "$frequencyData.appTransaction.value",
                "customerReviewFrequency": "$frequencyData.customerReview.value",
                "averageBillValueFrequency": "$frequencyData.billValue.value",
                "salonTransactionFrequency": "$frequencyData.salonTransaction.value",
                "serviceBillValueFrequency": "$frequencyData.billServices.value",
                "productSellFrequency": "$frequencyData.retailProduct.value",
                "membershipSoldFrequency": "$frequencyData.membershipSold.value",
                "appTransactionAmountHeader": "$frequencyData.appTransaction.amount",
                "customerReviewAmountHeader": "$frequencyData.customerReview.amount",
                "averageBillValueAmountHeader": "$frequencyData.billValue.amount",
                "salonTransactionAmountHeader": "$frequencyData.salonTransaction.amount",
                "serviceBillValueAmountHeader": "$frequencyData.billServices.amount",
                "productSellAmountHeader": "$frequencyData.retailProduct.amount",
                "membershipSoldAmountHeader": "$frequencyData.membershipSold.amount",
            }
        }
    ], function(err, result) {
        if (err) {
            res.json(CreateObjService.response(true, "Server Error"));
        } else {
            async.each(result, function(v, cb) {
                getActiveEmployees(v.parlorId, function(err, activeEmployeesCount) {
                    if (err) {
                        oneMonthRevenue(v.parlorId, m, y, function(err, salonRevenue) {
                            if (err) {
                                data.push(v);
                                cb();
                            } else {
                                v.salonRevenue = salonRevenue;
                                allSalonRevenue += salonRevenue;
                                data.push(v);
                                cb();
                            }
                        })
                        data.push(v);
                        cb();
                    } else {
                        oneMonthRevenue(v.parlorId, m, y, function(err, salonRevenue) {
                            if (err) {
                                v.activeEmployees = activeEmployeesCount;
                                totalActiveEmployees += activeEmployeesCount;
                                data.push(v);
                                cb();
                            } else {
                                v.salonRevenue = salonRevenue;
                                v.activeEmployees = activeEmployeesCount;
                                allSalonRevenue += salonRevenue;
                                totalActiveEmployees += activeEmployeesCount;
                                data.push(v);
                                cb();
                            }
                        })
                    }
                });
            }, function() {
                reasonWiseTotalLuckyDraw(m, y, function(err, totalRow) {
                    if (err) {
                        var finalData = _.groupBy(data, function(o) { return o.month; });
                        res.json({ "success": true, data: finalData, totalrow: [] });
                    } else {
                        totalRow[0].allSalonRevenue = allSalonRevenue;
                        totalRow[0].totalActiveEmployees = totalActiveEmployees;
                        var finalData = _.groupBy(data, function(o) { return o.month; });
                        res.json({ "success": true, data: finalData, totalrow: totalRow });
                    }
                })
            });
        }
    })
})

router.post("/distinctEmployees", function(req, res) {
    var atDates = { "$gte": new Date(2017, 9, 1, 0, 0, 0), "$lt": new Date(2017, 9, 31, 23, 59, 59) }
    LuckyDrawDynamic.find({ "status": 0, "createdAt": atDates }).distinct("employeeId", function(err, emps) {
        res.json(emps.length);
    });
})

router.post("/totalContacted", function(req, res) {
    var appDates = { "$gte": new Date(req.body.startTime), "$lt": new Date(req.body.endTime) };
    ContactedClients.aggregate([
        { $match: { createdAt: appDates } },
        { $group: { "_id": "$clientId", contactHistory: { $first: "$contactHistory" } } },
        {
            $project: {
                clientId: "$_id",
                "_id": 0,
                contactedById: { $arrayElemAt: ['$contactHistory.customerCareId', 0] },
                contactedByName: { $arrayElemAt: ['$contactHistory.customerCareName', 0] },
            }
        },
        { $group: { "_id": "$contactedById", total: { $sum: 1 }, customerCareName: { $first: "$contactedByName" } } },
        { $project: { "_id": 0 } }
    ], function(err, data) {
        if (err) {
            res.json(CreateObjService.response(true, "Server Error."));
        } else {
            res.json(CreateObjService.response(false, data));
        }
    });
})

router.post("/customerCareReport", function(req, res) {
    var appDates = { "$gte": new Date(req.body.startTime), "$lt": new Date(req.body.endTime) };
    var TotalConversions = new Promise(function(resolve, reject) {
        ContactedClients.aggregate([
            { $project: { contactHistory: 1, diffDate: { "$subtract": ["$toCompareDate", "$lastVisited"] }, contactHistorySize: { $size: "$contactHistory" } } },
            {
                $project: {
                    contactHistory: 1,
                    diffDate: 1,
                    lastContactedBy: { $arrayElemAt: ['$contactHistory.customerCareName', { $subtract: ["$contactHistorySize", 1] }] },
                    lastContactedById: { $arrayElemAt: ['$contactHistory.customerCareId', { $subtract: ["$contactHistorySize", 1] }] }
                }
            },
            { $project: { diffDate: 1, lastContactedById: 1, lastContactedBy: 1 } },
            { $match: { diffDate: { $gt: 0 } } },
            { $project: { diffDate: 0 } },
            { $group: { "_id": "$lastContactedById", customerCareName: { $first: "$lastContactedBy" }, convertedCount: { $sum: 1 } } }
        ], function(err, report) {
            if (err) {
                reject(err);
            } else {
                resolve(report);
            }
        })
    })

    var TotalCalls = new Promise(function(resolve, reject) {
        ContactedClients.aggregate([
            { $unwind: "$contactHistory" },
            { $match: { "contactHistory.contactedOn": appDates } },
            { $group: { "_id": "$contactHistory.customerCareId", customerCareName: { $first: "$contactHistory.customerCareName" }, totalCalls: { $sum: 1 } } },
        ], function(err, report) {
            if (err) {
                reject(err);
            } else {
                resolve(report);
            }
        })
    });

    Promise.all([TotalCalls, TotalConversions]).then(values => {
        var data = [];
        for (var i = 0; i < values[0].length; i++) {
            var oneData = {};
            oneData.customerCareName = values[0][i].customerCareName;
            oneData.totalCalls = values[0][i].totalCalls,
                oneData.totalConversions = 0;
            for (var j = 0; j < values[1].length; j++) {
                if ((values[0][i]._id).toString() == (values[1][j]._id).toString()) {
                    oneData.totalConversions = values[1][j].convertedCount;
                    break;
                }
            }
            data.push(oneData);
        }
        res.json(data);
    }).catch(reason => {
        console.log(reason);
        res.json(CreateObjService.response(true, "Something went wrong please try again."));
    });

})

router.post("/websiteQuery", function(req, res) {
    var name = req.body.name;
    var phoneNumber = req.body.phoneNumber;
    var email = req.body.email;
    var queryText = req.body.queryText;
    var queryType = req.body.queryType == undefined ? 0 : req.body.queryType;

    var createObject = {
        name: name,
        phoneNumber: phoneNumber,
        email: email,
        queryText: queryText,
        queryType: queryType
    }

    if (queryType == 1) {
        createObject.customerCareName = req.body.customerCareName;
        createObject.customerCareId = req.body.customerCareId;
    }

    WebsiteQuery.create(createObject, function(err, created) {

        console.log(err);
        console.log(created);

        if (err) {
            res.json(CreateObjService.response(true, "Server Error."));
        } else {
            res.json(CreateObjService.response(false, "Successfully submitted."));
        }
    })
})

router.post("/websiteQueryResponse", function(req, res) {
    var queryId = req.body.queryId;
    var agentResponse = req.body.agentResponse;
    WebsiteQuery.update({ "_id": ObjectId(queryId) }, { $set: { "agentResponse": agentResponse } }, function(err, updated) {
        if (err) {
            res.json(CreateObjService.response(true, "Server Error."));
        } else {
            res.json(CreateObjService.response(false, "Successfully submitted."));
        }
    })
})

router.post("/getWebsiteQueries", function(req, res) {
    var page = req.body.page;
    var data = {};
    var skipLim = 20;
    WebsiteQuery.find({ queryType: 0 }).count(function(err, count) {
        data.total_count = count;
        WebsiteQuery.aggregate([
            { $match: { queryType: 0 } },
            { $project: { name: 1, createdAt: 1, phoneNumber: 1, email: 1, date: "$createdAt", customerQuery: "$queryText", agentResponse: "$agentResponse" } },
            { $sort: { "createdAt": -1 } },
            { $skip: ((page - 1) * skipLim) },
            { $limit: skipLim }
        ], function(err, queries) {
            if (err) {
                res.json(CreateObjService.response(true, "Server Error."));
            } else {
                data.queries = queries;
                res.json(CreateObjService.response(false, data));
            }
        })
    })
});

router.post("/getSubscriptionQueries", function(req, res) {
    var page = req.body.page;
    var data = {};
    var skipLim = 20;

    var subscriptionCustomers = new Promise(function(resolve, reject) {
        WebsiteQuery.aggregate([
            { $match: { queryType: 1, customerCareId: { $exists: true } } },
            {
                $lookup: {
                    from: "users",
                    localField: "phoneNumber",
                    foreignField: "phoneNumber",
                    as: "userData"
                }
            },
            { $match: { "userData.subscriptionId": { $nin: [1, 2] } } },
            { $project: { name: 1, createdAt: 1, customerCareName: 1, phoneNumber: 1, email: 1, date: "$createdAt", customerQuery: "$queryText", agentResponse: "$agentResponse" } },
            { $sort: { "createdAt": -1 } },
            { $skip: ((page - 1) * skipLim) },
            { $limit: skipLim }
        ], function(err, subscriptionCustomers) {
            if (err) {
                reject(err);
                console.log(err);
            } else {
                resolve(subscriptionCustomers);
            }
        })
    });

    var subscriptionCount = new Promise(function(resolve, reject) {
        WebsiteQuery.aggregate([
            { $match: { queryType: 1, customerCareId: { $exists: true } } },
            {
                $lookup: {
                    from: "users",
                    localField: "phoneNumber",
                    foreignField: "phoneNumber",
                    as: "userData"
                }
            },
            { $match: { "userData.subscriptionId": { $nin: [1, 2] } } },
            { $group: { "_id": null, count: { $sum: 1 } } }
        ], function(err, subscriptionCount) {
            if (err) {
                reject(err);
                console.log(err);
            } else {
                resolve(subscriptionCount[0].count);
            }
        })
    });

    Promise.all([subscriptionCustomers, subscriptionCount]).then(values => {
        data.clients = values[0];
        data.total_count = values[1];
        res.json(CreateObjService.response(false, data));
    }).catch(reason => {
        res.json(CreateObjService.response(true, "Something went wrong please try again."));
    });

})

function getLatestDate(clientId, cb) {
    Appointment.aggregate([
        { $match: { "client.id": ObjectId(clientId), status: 3 } },
        { $group: { "_id": "$client.id", latestDate: { $max: "$appointmentStartTime" } } },
        { $project: { latestDate: 1, "_id": 0 } }
    ], function(err, latestDate) {
        if (err) {
            cb(1, null);
        } else {
            cb(null, latestDate);
        }
    })
}

router.post("/updateClients", function(req, res) {
    ContactedClients.find({ toCompareDate: { $exists: false } }, { "clientId": 1, "_id": 0 }, function(err, clientIds) {
        async.each(clientIds, function(clientId, cb) {
            getLatestDate(clientId.clientId, function(err, latestDate) {
                if (err) {
                    cb();
                } else {
                    if (latestDate.length == 0) {
                        cb();
                    } else {
                        ContactedClients.update({ "clientId": ObjectId(clientId.clientId) }, { "$set": { "toCompareDate": new Date(latestDate[0].latestDate), "isConverted": false } }, function(err1, updated) {
                            if (err1) {
                                console.log(err1);
                                cb();
                            } else {
                                console.log(updated);

                                console.log("updated");
                                cb();
                            }
                        });
                    }
                }
            });
        }, function() {
            console.log("All Done");
        })
    })

})

router.post("/createTrainingSupercategory", function(req, res) {
    TrainingSupercategory.createSupercategory(req, function(response) {
        res.json(response);
    });
});

router.post("/createTrainingSubcategory", function(req, res) {
    TrainingSubcategory.createSubcategory(req, function(response) {
        res.json(response);
    });
});

router.post("/createTrainingChapter", function(req, res) {
    TrainingChapter.createChapter(req, function(response) {
        res.json(response);
    });
});

router.get("/getUnits", function(req, res) {
    res.json(CreateObjService.response(false, ConstantService.units()));
});

router.post("/getActiveEmployees", function(req, res) {
    var parlorId = req.body.parlorId;
    if (parlorId == undefined) {
        res.json(CreateObjService.response(true, "Server Error."));
    } else {
        Admin.find({ parlorId: parlorId, active: true }, { firstName: 1, lastName: 1 }, function(err, employees) {
            if (err) {
                console.log(err);
                res.json(CreateObjService.response(true, "Server Error."));
            } else {
                res.json(CreateObjService.response(false, employees));
            }
        })
    }
});

router.post("/getTrainingSupercategory", function(req, res) {
    TrainingSupercategory.getSupercategory(req, function(response) {
        res.json(response);
    });
});

router.post("/getTrainingSubcategory", function(req, res) {
    TrainingSubcategory.getSubcategory(req, function(response) {
        res.json(response);
    });
});

router.post("/getTrainingChapter", function(req, res) {
    TrainingChapter.getChapter(req, function(response) {
        res.json(response);
    });
});

router.post("/submitTrainingSession", function(req, res) {
    TrainingSession.submitTrainingSession(req, function(response) {
        res.json(response);
    });
});

router.post("/dateWiseCheckins", function(req, res) {
    var userId = req.body.userId;
    var startDate = req.body.startDate;
    var endDate = req.body.endDate;
    SalonCheckin.aggregate([{ $match: { "userId": ObjectId(userId), "checkIn": { "$gte": new Date(startDate), "$lt": new Date(endDate) } } },
        { $project: { checkIn: 1, checkOut: 1, parlorId: 1 } },
        { $sort: { "checkIn": 1 } },
        {
            $lookup: {
                from: "parlors",
                localField: "parlorId",
                foreignField: "_id",
                as: "parlorData"
            }
        },
        { $unwind: "$parlorData" },
        { $project: { parlorName: "$parlorData.name", checkIn: 1, checkOut: 1 } },
        {
            $group: {
                _id: {
                    $dateToString: {
                        format: "%Y-%m-%d",
                        date: "$checkIn"
                    }
                },
                checkInSalon: { $first: "$parlorName" },
                checkInTime: { $first: "$checkIn" },
                checkOutSalon: { $last: "$parlorName" },
                checkOutTime: { $last: "$checkOut" }
            }
        },
        {
            $project: {
                "date": "$_id",
                checkInSalon: 1,
                checkInTime: 1,
                checkOutSalon: 1,
                "_id": 0,
                checkOutTime: {
                    $cond: {
                        if: { $eq: ["$checkOutTime", null] },
                        then: "-",
                        else: "$checkOutTime"
                    }
                }
            }
        }
    ], function(err, checkins) {
        if (err) {
            res.json(CreateObjService.response(true, "Server Error."));
        } else if (checkins.length == 0) {
            res.json(CreateObjService.response(true, "No checkins found."));
        } else {
            res.json(CreateObjService.response(false, dateToMonth(checkins.sort(function(a, b) {
                a = new Date(a.date);
                b = new Date(b.date);
                return a > b ? -1 : a < b ? 1 : 0;
            }), "y/m/d")));
        }
    })
});

router.get("/salonDeals", function(req, res) {
    var data = [];
    async.eachSeries(ConstantService.salondeals(), function(d, cb) {
        AllDeals.findOne({ dealId: d.dealId }, { dealPrice: 1, description: 1, menuPrice: 1, name: 1 }, function(err, deal) {
            if (err) {
                cb();
            } else {
                data.push({
                    image1: "/images/percent.png",
                    name: deal.name,
                    description: deal.description,
                    discount: "Save " + Math.floor((deal.dealPrice / deal.menuPrice) * 100) + "%",
                    price: deal.menuPrice,
                    cutPrice: deal.dealPrice,
                    dealImage: d.dealImage,
                    totalLikes: Math.floor((Math.random()) + 200 + (Math.random() * 300))
                })
                cb();
            }
        })
    }, function() {
        res.json(CreateObjService.response(false, data));
    });
})

router.post("/trainingsGivenDayWise", function(req, res) {
    var trainerId = req.body.trainerId;
    TrainingSession.aggregate([
        { $match: { trainerId: ObjectId(trainerId) } },
        {
            $project: {
                "createdAt": 1,
                "superCategoryId": 1,
                "subCategoryId": 1,
                "chapterId": 1,
                "parlorId": 1,
                "practical": 1,
                "theory": 1,
            }
        },
        {
            $lookup: {
                from: "parlors",
                localField: "parlorId",
                foreignField: "_id",
                as: "parlorData"
            }
        },
        {
            $lookup: {
                from: "trainingsupercategories",
                localField: "superCategoryId",
                foreignField: "_id",
                as: "superCategoryData"
            }
        },
        {
            $lookup: {
                from: "trainingsubcategories",
                localField: "subCategoryId",
                foreignField: "_id",
                as: "subCategoryData"
            }
        },
        {
            $lookup: {
                from: "trainingchapters",
                localField: "chapterId",
                foreignField: "_id",
                as: "chapterData"
            }
        },
        { $unwind: "$chapterData" },
        { $unwind: "$superCategoryData" },
        { $unwind: "$subCategoryData" },
        { $unwind: "$parlorData" },
        {
            $project: {
                createdAt: 1,
                chapterId: 1,
                practical: 1,
                theory: 1,
                chapterName: "$chapterData.chapterName",
                superCategoryName: "$superCategoryData.superCategoryName",
                subCategoryName: "$subCategoryData.subCategoryName",
                parlorName: "$parlorData.name",
            }
        },
        { $group: { "_id": "$_id", theory: { $first: "$theory" }, practical: { $first: "$practical" }, createdAt: { $first: "$createdAt" }, parlorName: { $first: "$parlorName" }, chapterName: { $first: "$chapterName" }, superCategoryName: { $first: "$superCategoryName" }, subCategoryName: { $first: "$subCategoryName" } } },
        {
            $project: {
                "_id": 0,
                sessionId: "$_id",
                parlorName: 1,
                theory: 1,
                practical: 1,
                chapterName: 1,
                superCategoryName: 1,
                subCategoryName: 1,
                date: {
                    $dateToString: {
                        format: "%Y-%m-%d",
                        date: "$createdAt"
                    }
                }
            }
        }
    ], function(err, trainings) {
        if (err) {
            res.json(CreateObjService.response(true, "Server Error."));
        } else if (trainings.length == 0) {
            res.json(CreateObjService.response(true, "No trainings found."));
        } else {
            res.json(CreateObjService.response(false, dateToMonth(trainings.sort(function(a, b) {
                a = new Date(a.date);
                b = new Date(b.date);
                return a > b ? -1 : a < b ? 1 : 0;
            }), "y/m/d")));

        }
    })
})

function employeeScore(employeeId, sessionId, callback) {
    var employeeId = employeeId;
    var sessionId = sessionId;
    var totalQues = 0;
    var rightAns = 0;
    TrainingQuiz.findOne({ employeeId: ObjectId(employeeId), sessionId: ObjectId(sessionId) }, { "quiz.answer": 1, "quiz.questionId": 1, _id: 0 }, function(err, q) {
        if (err) {
            callback(1, null);
        } else {
            if (q == null) {
                callback(null, "N/A");
            } else {
                async.each(q.quiz, function(o, cb) {
                    totalQues++;
                    TrainingQuestion.findOne({ "_id": ObjectId(o.questionId) }, { answer: 1 }, function(err, ans) {
                        if (ans.answer == o.answer) {
                            rightAns++;
                            cb();
                        } else {
                            cb();
                        }
                    })
                }, function() {
                    callback(null, (rightAns).toString() + "/" + (totalQues).toString());
                })
            }
        }
    })
}

router.post("/sessionScores", function(req, res) {
    var sessionId = req.body.sessionId;
    var data = {};
    var ownerRatings = [];
    TrainingSession.findOne({ "_id": ObjectId(sessionId) }, { parlorId: 1, employees: 1 }, function(err1, result1) {
        if (err1) {
            res.json(CreateObjService.response(true, "Server Error."));
        } else {
            Admin.find({ parlorIds: result1.parlorId, role: 7, active: { $ne: false } }, { firstName: 1, lastName: 1, "_id": 1 }, function(err2, result2) {
                if (err2) {
                    res.json(CreateObjService.response(true, "Server Error."));
                } else {
                    async.each(result2, function(a, cb1) {
                        for (var i = 0; i < result1.employees.length; i++) {
                            if ((result1.employees[i].employeeId).toString() == (a._id).toString()) {
                                ownerRatings.push({
                                    name: a.firstName + " " + a.lastName,
                                    rating: (result1.employees[i].rating == undefined) ? "N/A" : result1.employees[i].rating
                                })
                            }
                        }
                        if (ownerRatings.length == 0) {
                            ownerRatings.push({
                                name: a.firstName + " " + a.lastName,
                                rating: "N/A"
                            })
                        }
                        cb1();
                    }, function() {
                        data.ownerRatings = ownerRatings;
                        TrainingSession.aggregate([
                            { $match: { "_id": ObjectId(sessionId) } },
                            { $unwind: "$employees" },
                            {
                                $lookup: {
                                    from: "owners",
                                    localField: "employees.employeeId",
                                    foreignField: "_id",
                                    as: "employeeData"
                                }
                            },
                            { $unwind: "$employeeData" },
                            {
                                $project: {
                                    "_id": 0,
                                    employeeName: { $concat: ["$employeeData.firstName", " ", "$employeeData.lastName"] },
                                    employeeId: "$employeeData._id"
                                }
                            },
                        ], function(err3, result3) {
                            if (err3) {
                                res.json(CreateObjService.response(true, "Server Error."));
                            } else {
                                data.employeeList = [];
                                async.each(result3, function(e, cb2) {
                                    var employeeId = e.employeeId;
                                    employeeScore(employeeId, sessionId, function(err4, score) {

                                        if (err4) {
                                            data.employeeList.push({
                                                employeeName: e.employeeName,
                                                score: "N/A"
                                            })
                                            cb2();
                                        } else {
                                            data.employeeList.push({
                                                employeeName: e.employeeName,
                                                score: score
                                            })
                                            cb2();
                                        }
                                    })
                                }, function() {
                                    res.json(CreateObjService.response(false, data));
                                })
                            }
                        });
                    })
                }
            })
        }
    });
})

router.get("/trainingStatics", function(req, res) {
    var units = ConstantService.units();
    var data = [];
    async.eachSeries(units, function(a, cb1) {
        var oneData = {};
        oneData.unitId = a.id;
        TrainingSupercategory.find({ unitId: a.id }, { superCategoryName: 1 }, function(err1, superCat) {
            var superCategories = [];
            async.each(superCat, function(b, cb2) {
                var sup = {};
                sup._id = b._id;
                sup.superCategoryName = b.superCategoryName;
                TrainingSubcategory.find({ superCategoryId: b._id }, { subCategoryName: 1 }, function(err2, subCat) {
                    var subCategories = [];
                    async.each(subCat, function(c, cb3) {
                        var sub = {};
                        sub._id = c._id;
                        sub.subCategoryName = c.subCategoryName;
                        TrainingChapter.find({ subCategoryId: c._id }, { chapterName: 1 }, function(err3, chapters) {
                            var chap = [];
                            async.each(chapters, function(d, cb4) {
                                chap.push({
                                    chapterId: d._id,
                                    chapterName: d.chapterName,
                                })
                                cb4();
                            }, function() {
                                sub.chapters = chap;
                                subCategories.push(sub);
                                cb3();
                            })
                        })
                    }, function() {
                        sup.subCategories = subCategories;
                        superCategories.push(sup);
                        cb2();
                    })
                })
            }, function() {
                oneData.superCategories = superCategories;
                data.push(oneData);
                cb1();
            })
        });
    }, function() {
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < ConstantService.units().length; j++) {
                if (data[i].unitId == ConstantService.units()[j].id) {
                    data[i].unitName = ConstantService.units()[j].unitName;
                    break;
                }
            }
        }
        res.json(CreateObjService.response(false, data));
    })
})

router.post("/chapterWiseTrainings", function(req, res) {
    var trainerId = req.body.trainerId;
    var chapterId = req.body.chapterId;
    TrainingSession.aggregate([
        { $match: { trainerId: ObjectId(trainerId), chapterId: ObjectId(chapterId) } },
        { $project: { parlorId: 1, theory: 1, practical: 1, createdAt: 1 } },
        {
            $lookup: {
                from: "parlors",
                localField: "parlorId",
                foreignField: "_id",
                as: "parlorData"
            }
        },
        { $unwind: "$parlorData" },
        {
            $project: {
                parlorName: "$parlorData.name",
                parlorId: 1,
                theory: 1,
                practical: 1,
                date: {
                    $dateToString: {
                        format: "%Y-%m-%d",
                        date: "$createdAt"
                    }
                }
            }
        },
        { $group: { "_id": null, parlorIds: { $push: "$parlorId" }, data: { $push: { parlorName: "$parlorName", parlorId: "$parlorId", theory: "$theory", practical: "$practical", date: "$date" } } } },
        { $project: { "_id": 0 } }
    ], function(err, trainings) {
        if (trainings.length == 0) {
            var trainedParlors = [];
        } else {
            var trainedParlors = trainings[0].parlorIds;
        }
        Beu.aggregate([
            { $match: { "_id": ObjectId(trainerId) } },
            { $project: { parlorIds: 1, "_id": 0 } },
            { $unwind: "$parlorIds" },
            { $match: { parlorIds: { $nin: trainedParlors } } },
            {
                $lookup: {
                    from: "parlors",
                    localField: "parlorIds",
                    foreignField: "_id",
                    as: "parlorData"
                }
            },
            { $unwind: "$parlorData" },
            { $project: { parlorName: "$parlorData.name", parlorId: "$parlorIds" } }
        ], function(err, incompleteParlors) {
            if (err) {
                res.json(CreateObjService.response(true, "Server Error."));
            } else {
                var data = {};
                if (trainings.length == 0) {
                    data.visitedParlors = [];
                } else {
                    data.visitedParlors = dateToMonth(trainings[0].data.sort(function(a, b) {
                        a = new Date(a.date);
                        b = new Date(b.date);
                        return a > b ? -1 : a < b ? 1 : 0;
                    }), "y/m/d");
                }
                data.incompleteParlors = incompleteParlors;
                res.json(CreateObjService.response(false, data));
            }
        })
    })
})

router.post("/avgTrainingRating", function(req, res) {
    var data = [];
    var trainerId = req.body.trainerId;
    TrainingSession.aggregate([
        { $match: { trainerId: ObjectId(trainerId) } },
        { $unwind: "$employees" },
        { $match: { "employees.rating": { $exists: true } } },
        {
            $project: {
                createdAt: 1,
                unitId: 1,
                superCategoryId: 1,
                rating: "$employees.rating",
            }
        },
        {
            $group: {
                "_id": "$unitId",
                superCategories: {
                    $addToSet: "$superCategoryId",
                },
                unitRatingSum: { $sum: "$rating" },
                unitRatingCount: { $sum: 1 }
            }
        },
        { $project: { unitId: "$_id", "_id": 0, superCategories: 1, avgUnitRating: { $divide: ["$unitRatingSum", "$unitRatingCount"] } } },
        {
            $project: {
                unitId: 1,
                superCategories: 1,
                avgUnitRating: {
                    $divide: [{
                            $subtract: [
                                { $multiply: ['$avgUnitRating', 100] },
                                { $mod: [{ $multiply: ['$avgUnitRating', 100] }, 1] }
                            ]
                        },
                        100
                    ]
                }
            }
        }
    ], function(err1, avgUnitRating) {
        if (err1) {
            res.json(CreateObjService.response(true, "Server Error."));
        } else if (avgUnitRating.length == 0) {
            res.json(CreateObjService.response(true, "No previous trainings."));
        } else {
            async.each(avgUnitRating, function(a, cb1) {
                var oneData = {};
                oneData.unitId = a.unitId;
                oneData.avgUnitRating = a.avgUnitRating;
                TrainingSession.aggregate([
                    { $match: { trainerId: ObjectId(trainerId), superCategoryId: { $in: a.superCategories } } },
                    { $unwind: "$employees" },
                    { $match: { "employees.rating": { $exists: true } } },
                    { $project: { superCategoryId: 1, subCategoryId: 1, rating: "$employees.rating" } },
                    {
                        $lookup: {
                            from: "trainingsupercategories",
                            localField: "superCategoryId",
                            foreignField: "_id",
                            as: "superCategoryData"
                        }
                    },
                    { $unwind: "$superCategoryData" },
                    {
                        $group: {
                            "_id": "$superCategoryId",
                            superCategoryName: { "$first": "$superCategoryData.superCategoryName" },
                            subCategories: {
                                $addToSet: "$subCategoryId",
                            },
                            superCategorySum: { $sum: "$rating" },
                            superCategoryCount: { $sum: 1 }

                        }
                    },
                    { $project: { "_id": 0, superCategoryName: 1, subCategories: 1, avgSuperCategoryRating: { $divide: ["$superCategorySum", "$superCategoryCount"] } } },
                    {
                        $project: {
                            superCategoryName: 1,
                            subCategories: 1,
                            avgSuperCategoryRating: {
                                $divide: [{
                                        $subtract: [
                                            { $multiply: ['$avgSuperCategoryRating', 100] },
                                            { $mod: [{ $multiply: ['$avgSuperCategoryRating', 100] }, 1] }
                                        ]
                                    },
                                    100
                                ]
                            }
                        }
                    }
                ], function(err2, avgSuperCategoryRating) {
                    oneData.superCategory = avgSuperCategoryRating;
                    async.each(avgSuperCategoryRating, function(b, c2) {
                        TrainingSession.aggregate([
                            { $match: { trainerId: ObjectId(trainerId), subCategoryId: { $in: b.subCategories } } },
                            { $unwind: "$employees" },
                            { $match: { "employees.rating": { $exists: true } } },
                            { $project: { subCategoryId: 1, chapterId: 1, rating: "$employees.rating" } },
                            {
                                $lookup: {
                                    from: "trainingsubcategories",
                                    localField: "subCategoryId",
                                    foreignField: "_id",
                                    as: "subCategoryData"
                                }
                            },
                            { $unwind: "$subCategoryData" },
                            {
                                $group: {
                                    "_id": "$subCategoryId",
                                    subCategoryName: { "$first": "$subCategoryData.subCategoryName" },
                                    trainingChapters: {
                                        $addToSet: "$chapterId",
                                    },
                                    subCategorySum: { $sum: "$rating" },
                                    subCategoryCount: { $sum: 1 }
                                }
                            },
                            { $project: { "_id": 0, subCategoryName: 1, trainingChapters: 1, avgSubCategoryRating: { $divide: ["$subCategorySum", "$subCategoryCount"] } } },
                            {
                                $project: {
                                    subCategoryName: 1,
                                    trainingChapters: 1,
                                    avgSubCategoryRating: {
                                        $divide: [{
                                                $subtract: [
                                                    { $multiply: ['$avgSubCategoryRating', 100] },
                                                    { $mod: [{ $multiply: ['$avgSubCategoryRating', 100] }, 1] }
                                                ]
                                            },
                                            100
                                        ]
                                    }
                                }
                            }
                        ], function(err3, avgSubCategoryRating) {
                            oneData.superCategory[avgSuperCategoryRating.indexOf(b)].subCategory = avgSubCategoryRating;
                            async.each(oneData.superCategory[avgSuperCategoryRating.indexOf(b)].subCategory, function(c, c3) {
                                TrainingSession.aggregate([
                                    { $match: { trainerId: ObjectId(trainerId), chapterId: { $in: c.trainingChapters } } },
                                    { $unwind: "$employees" },
                                    { $match: { "employees.rating": { $exists: true } } },
                                    { $project: { subCategoryId: 1, chapterId: 1, rating: "$employees.rating" } },
                                    {
                                        $lookup: {
                                            from: "trainingchapters",
                                            localField: "chapterId",
                                            foreignField: "_id",
                                            as: "chapterData"
                                        }
                                    },
                                    { $unwind: "$chapterData" },
                                    {
                                        $group: {
                                            "_id": "$chapterId",
                                            chapterName: { "$first": "$chapterData.chapterName" },
                                            chapterSum: { $sum: "$rating" },
                                            chapterCount: { $sum: 1 }
                                        }
                                    },
                                    { $project: { "_id": 0, chapterName: 1, avgChapterRating: { $divide: ["$chapterSum", "$chapterCount"] } } },
                                    {
                                        $project: {
                                            chapterName: 1,
                                            avgChapterRating: {
                                                $divide: [{
                                                        $subtract: [
                                                            { $multiply: ['$avgChapterRating', 100] },
                                                            { $mod: [{ $multiply: ['$avgChapterRating', 100] }, 1] }
                                                        ]
                                                    },
                                                    100
                                                ]
                                            }
                                        }
                                    }
                                ], function(err, avgChapterRating) {
                                    oneData.superCategory[avgSuperCategoryRating.indexOf(b)].subCategory[avgSubCategoryRating.indexOf(c)].chapters = avgChapterRating;
                                    c3();
                                })
                            }, function() {
                                c2();
                            });
                        })
                    }, function() {
                        data.push(oneData);
                        cb1();
                    })
                })
            }, function() {
                for (var i = 0; i < data.length; i++) {
                    for (var j = 0; j < ConstantService.units().length; j++) {
                        if (data[i].unitId == ConstantService.units()[j].id) {
                            data[i].unitName = ConstantService.units()[j].unitName;
                            break;
                        }
                    }
                }
                res.json(CreateObjService.response(false, data));
            });
        }
    })
})

router.post("/trainerSalons", function(req, res) {
    var trainerId = req.body.trainerId;
    Beu.aggregate([
        { $match: { "_id": ObjectId(trainerId) } },
        { $project: { parlorIds: 1, "_id": 0 } },
        { $unwind: "$parlorIds" },
        {
            $lookup: {
                from: "parlors",
                localField: "parlorIds",
                foreignField: "_id",
                as: "parlorData"
            }
        },
        { $unwind: "$parlorData" },
        { $project: { parlorId: "$parlorIds", parlorName: "$parlorData.name" } },
        { $sort: { parlorName: 1 } }
    ], function(err, parlors) {
        if (err) {
            res.json(CreateObjService.response(true, "Server Error"));
        } else if (parlors.length == 0) {
            res.json(CreateObjService.response(true, "No Data."));
        } else {
            res.json(CreateObjService.response(false, parlors));
        }
    })
})

router.post("/salonWiseTrainings", function(req, res) {
    var trainerId = req.body.trainerId;
    var parlorId = req.body.parlorId;
    var units = ConstantService.units();
    var data = [];
    async.eachSeries(units, function(a, cb1) {
        var oneData = {};
        TrainingSession.find({ unitId: a.id, parlorId: ObjectId(parlorId), trainerId: ObjectId(trainerId) }).count(function(err1, count1) {
            oneData.unitId = a.id;
            oneData.count = count1;
            TrainingSupercategory.find({ unitId: a.id }, { superCategoryName: 1 }, function(err1, superCat) {
                var superCategories = [];
                async.each(superCat, function(b, cb2) {
                    var sup = {};
                    sup._id = b._id;
                    sup.superCategoryName = b.superCategoryName;
                    TrainingSession.find({ superCategoryId: b._id, parlorId: ObjectId(parlorId), trainerId: ObjectId(trainerId) }).count(function(err2, count2) {
                        sup.count = count2;
                        TrainingSubcategory.find({ superCategoryId: b._id }, { subCategoryName: 1 }, function(err2, subCat) {
                            var subCategories = [];
                            async.each(subCat, function(c, cb3) {
                                var sub = {};
                                sub._id = c._id;
                                sub.subCategoryName = c.subCategoryName;
                                TrainingSession.find({ subCategoryId: c._id, parlorId: ObjectId(parlorId), trainerId: ObjectId(trainerId) }).count(function(err3, count3) {
                                    sub.count = count3;
                                    TrainingChapter.find({ subCategoryId: c._id }, { chapterName: 1 }, function(err3, chapters) {
                                        var chap = [];
                                        async.each(chapters, function(d, cb4) {
                                            TrainingSession.find({ chapterId: d._id, parlorId: ObjectId(parlorId), trainerId: ObjectId(trainerId) }).count(function(err4, count4) {
                                                chap.push({
                                                    chapterId: d._id,
                                                    chapterName: d.chapterName,
                                                    count: count4
                                                })
                                                cb4();
                                            })
                                        }, function() {
                                            sub.chapters = chap;
                                            subCategories.push(sub);
                                            cb3();
                                        })
                                    })
                                })
                            }, function() {
                                sup.subCategories = subCategories;
                                superCategories.push(sup);
                                cb2();
                            })
                        })
                    })
                }, function() {
                    oneData.superCategories = superCategories;
                    data.push(oneData);
                    cb1();
                })
            });
        })
    }, function() {
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < ConstantService.units().length; j++) {
                if (data[i].unitId == ConstantService.units()[j].id) {
                    data[i].unitName = ConstantService.units()[j].unitName;
                    break;
                }
            }
        }
        res.json(CreateObjService.response(false, data));
    })
})

router.post("/chapterDetails", function(req, res) {
    var trainerId = req.body.trainerId;
    var chapterId = req.body.chapterId;
    var parlorId = req.body.parlorId;

    TrainingSession.aggregate([
        { $match: { parlorId: ObjectId(parlorId), trainerId: ObjectId(trainerId), chapterId: ObjectId(chapterId) } },
        { $unwind: "$employees" },
        {
            $lookup: {
                from: "owners",
                localField: "employees.employeeId",
                foreignField: "_id",
                as: "employeeData"
            }
        },
        { $unwind: "$employeeData" },
        { $project: { createdAt: 1, theory: 1, practical: 1, employees: 1, name: { $concat: ["$employeeData.firstName", " ", "$employeeData.lastName"] } } },
        {
            $group: {
                "_id": "$_id",
                date: { $first: "$createdAt" },
                theory: { $first: "$theory" },
                practical: { $first: "$practical" },
                employees: { $push: { employeeId: "$employees.employeeId", name: "$name", rating: { $cond: [{ $and: [{ $gt: ["$employees.rating", 0] }, { $lte: ["$employees.rating", 10] }] }, "$employees.rating", "N/A"] } } }
            }
        },
        { $project: { "_id": 0, date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, theory: 1, practical: 1, employees: 1 } }
    ], function(err, details) {
        if (err) {
            res.json(CreateObjService.response(true, "Server Error."));
        } else if (details.length == 0) {
            res.json(CreateObjService.response(true, "No Data."));
        } else {
            res.json(CreateObjService.response(false, dateToMonth(details.sort(function(a, b) {
                a = new Date(a.date);
                b = new Date(b.date);
                return a > b ? -1 : a < b ? 1 : 0;
            }), "y/m/d")));
        }
    })
})

router.post("/createTrainingQuestion", function(req, res) {
    TrainingQuestion.createQuestion(req, function(response) {
        res.json(response);
    });
});

router.post("/submitTrainingQuiz", function(req, res) {
    TrainingQuiz.submitQuiz(req, function(response) {
        res.json(response);
    });
});

router.post("/takeTrainingQuiz", function(req, res) {
    var chapterId = req.body.chapterId;
    var employeeId = req.body.employeeId;
    var sessionId = req.body.sessionId;

    TrainingQuiz.findOne({ "employeeId": ObjectId(employeeId), sessionId: ObjectId(sessionId) }, { employeeId: 1 }, function(err, emp) {
        if (err) {
            res.json(CreateObjService.response(true, "Server Error."));
        } else if (emp) {
            res.json(CreateObjService.response(true, "Quiz submitted already."));
        } else {
            TrainingQuestion.find({ chapterId: ObjectId(chapterId) }, { question: 1, "options.option": 1 }, function(err, questions) {
                if (err) {
                    res.json(CreateObjService.response(true, "Server Error."));
                } else if (questions.length == 0) {
                    res.json(CreateObjService.response(true, "No quiz found."));
                } else {
                    res.json(CreateObjService.response(false, questions));
                }
            });
        }
    })

})

router.post("/dmCustomers", function(req, res) {
    var page = parseInt(req.body.page);
    var data = {};
    DivasAndMachosCustomers.find({ contactHistory: { $exists: false } }).count(function(err, count) {
        DivasAndMachosCustomers.find({ contactHistory: { $exists: false } }, { name: 1, emailId: 1, gender: 1, phoneNumber: 1, clientId: 1, contactHistory: 1, _id: 0 }, function(err, clients) {
            data.clients = clients;
            data.total_count = count;
            res.json(CreateObjService.response(false, data));
        }).skip((page - 1) * 20).limit(20);
    })
});

router.post("/dmContactClient", function(req, res) {
    var historyObject = {
        customerCareId: req.body.customerCareId,
        customerCareName: req.body.customerCareName,
        remark: req.body.remark,
        callStatus: req.body.callStatus,
        contactedOn: new Date(),
        expectedOn: ((req.body.expectedOn == "") ? "" : req.body.expectedOn)
    }
    if (req.body.phoneNumber == undefined) {

        DivasAndMachosCustomers.find({ "clientId": ObjectId(req.body.clientId) }, { "clientId": 1 }, function(err, c) {
            DivasAndMachosCustomers.update({ "clientId": ObjectId(req.body.clientId) }, { $push: { 'contactHistory': historyObject } }, function(err, created) {
                if (err) {
                    return res.json(CreateObjService.response(true, "Please Try Again"));
                } else {
                    if (Object.keys(created).length > 0) {
                        return res.json(CreateObjService.response(false, "Updated Successfully"));
                    } else {
                        return res.json(CreateObjService.response(true, "Please Try Again"));
                    }
                }
            });
        });
    } else {
        DivasAndMachosCustomers.find({ "phoneNumber": req.body.phoneNumber }, { "phoneNumber": 1 }, function(err, c) {
            DivasAndMachosCustomers.update({ "phoneNumber": req.body.phoneNumber }, { $push: { 'contactHistory': historyObject } }, function(err, created) {
                if (err) {
                    return res.json(CreateObjService.response(true, "Please Try Again"));
                } else {
                    if (Object.keys(created).length > 0) {
                        return res.json(CreateObjService.response(false, "Updated Successfully"));
                    } else {
                        return res.json(CreateObjService.response(true, "Please Try Again"));
                    }
                }
            });
        });
    }
})

router.post("/dmContacted", function(req, res) {
    var page = parseInt(req.body.page);
    var data = {};
    DivasAndMachosCustomers.find({ contactHistory: { $exists: true } }).count(function(err, count) {
        DivasAndMachosCustomers.find({ contactHistory: { $exists: true } }, { name: 1, emailId: 1, gender: 1, phoneNumber: 1, clientId: 1, contactHistory: 1, _id: 0 }, function(err, clients) {
            data.clients = clients;
            data.total_count = count;
            res.json(CreateObjService.response(false, data));
        }).skip((page - 1) * 20).limit(20);
    })
})

function uncompletedCountAndCollection(parlorId, date, cb) {

    Appointment.aggregate([
        { $match: { parlorId: ObjectId(parlorId), status: 1, appointmentStartTime: { $gte: HelperService.getDayStart(date), $lt: HelperService.getDayEnd(date) } } },
        { $group: { "_id": "$parlorId", count: { $sum: 1 }, payableAmount: { $sum: "$payableAmount" } } }
    ], function(err, data) {
        if (err) {
            cb(1, null);
        } else {
            cb(null, data);
        }
    });

}

router.post('/dailyReportWhatsApp', function(req, res) {
    var date = req.body.date;
    var parlorId = req.body.parlorId;

    console.log(req.body);

    Parlor.findOne({ "_id": ObjectId(parlorId) }, { name: 1, address: 1, address2: 1 }, function(err, parlor) {
        if (err) {
            return res.json(CreateObjService.response(true, "Server Error."));
        } else {
            var query = { _id: parlor._id };
            Appointment.dailyReport(query, date, function(err1, d) {

                if (err1) {
                    return res.json(CreateObjService.response(true, "Server Error."));
                } else {

                    var data = {};
                    data.parlorName = parlor.name;
                    data.parlorAddress = parlor.address + " " + parlor.address2;
                    data.revenue = d.totalRevenue;
                    data.cash = d.payment[0].amount;
                    data.card = d.payment[1].amount;
                    data.affiliate = d.payment[2].amount;
                    data.beU = d.payment[3].amount;
                    data.loyaltyRedemption = d.redemption[3].amount;
                    data.totalRevenue = d.totalRevenueToday;
                    data.totalServiceRevenue = d.totalServiceRevenue;
                    data.totalCollection = d.totalCollectionToday;

                    Appointment.find({ parlorId: ObjectId(parlorId), appointmentStartTime: { $gte: HelperService.getDayStart(date), $lt: HelperService.getDayEnd(date) }, "razorPayCaptureResponse.status": "captured" }).count(function(err2, count1) {
                        if (err2) {
                            return res.json(CreateObjService.response(true, "Server Error."));
                        } else {
                            data.appDigitalPayment = count1;

                            Appointment.find({ parlorId: ObjectId(parlorId), paymentMethod: { $nin: [5, 10] }, appointmentStartTime: { $gte: HelperService.getDayStart(date), $lt: HelperService.getDayEnd(date) }, appBooking: 2, appointmentType: 3 }).count(function(err3, count2) {
                                if (err2) {
                                    return res.json(CreateObjService.response(true, "Server Error."));
                                } else {
                                    data.appCashPayment = count2;

                                    uncompletedCountAndCollection(parlorId, date, function(err, uccc) {
                                        if (err) {
                                            data.uncompletedAppCollection = "N/A";
                                            data.uncompletedAppCount = "N/A";
                                            return res.json(CreateObjService.response(false, data));
                                        } else if (uccc.length == 0) {
                                            data.uncompletedAppCollection = 0;
                                            data.uncompletedAppCount = 0;
                                            return res.json(CreateObjService.response(false, data));
                                        } else {
                                            data.uncompletedAppCollection = uccc[0].payableAmount;
                                            data.uncompletedAppCount = uccc[0].count;
                                            return res.json(CreateObjService.response(false, data));
                                        }
                                    });
                                }
                            })
                        }
                    })
                }
            })
        }
    })
});

router.post("/randomConversion", function(req, res) {

    var year = req.body.year;
    var month = req.body.month;
    var d = new Date(year, month - 3, 1);
    var toCompareDate = new Date(year, month, 1);
    var days = new Date(year, month + 1, 0).getDate();
    var skipLim = 20;
    var page = req.body.page;
    var lastParlorId = req.body.lastParlorId;
    var previousParlorId = req.body.previousParlorId;
    var data = {};
    var previousParlorMatch = { $match: {} };
    var lastParlorMatch = { $match: {} };

    if (previousParlorId != "all" && previousParlorId != undefined) {
        previousParlorMatch = { $match: { "previousVisitedParlorId": ObjectId(previousParlorId) } };
    }

    if (lastParlorId != "all" && lastParlorId != undefined) {
        lastParlorMatch = { $match: { "lastVisitedParlorId": ObjectId(lastParlorId) } };
    }

    var Clients = new Promise(function(resolve, reject) {
        Appointment.aggregate([
            { $match: { status: 3 } },
            { $project: { client: 1, parlorId: 1, parlorName: 1, appointmentStartTime: 1 } },
            { $sort: { appointmentStartTime: 1 } },
            { $group: { "_id": "$client.id", clientName: { $first: "$client.name" }, appointmentDates: { $push: "$appointmentStartTime" }, allParlors: { $push: { parlorName: "$parlorName", parlorId: "$parlorId" } }, phoneNumber: { $first: "$client.phoneNumber" }, lastVisitedParlorId: { $last: "$parlorId" }, lastVisitedParlor: { $last: "$parlorName" } } },
            { $project: { clientId: "$_id", "_id": 0, clientName: 1, lastVisitedParlorId: 1, phoneNumber: 1, visitedParlorSize: { $size: "$allParlors" }, lastVisitedParlor: 1, allParlors: 1, appointmentDates: 1, appointmentDatesSize: { $size: "$appointmentDates" } } },
            {
                $project: {
                    clientId: 1,
                    clientName: 1,
                    lastVisitedParlorId: 1,
                    lastVisitedParlor: 1,
                    phoneNumber: 1,
                    previousVisitedParlorId: { $arrayElemAt: ['$allParlors.parlorId', { $subtract: ["$visitedParlorSize", 2] }] },
                    previousVisitedParlor: { $arrayElemAt: ['$allParlors.parlorName', { $subtract: ["$visitedParlorSize", 2] }] },
                    parlorName: 1,
                    previousVisitDate: { $arrayElemAt: ['$appointmentDates', { $subtract: ["$appointmentDatesSize", 2] }] },
                    lastVisitDate: { $arrayElemAt: ['$appointmentDates', { $subtract: ["$appointmentDatesSize", 1] }] }
                }
            },
            { $match: { previousVisitDate: { "$lt": d }, lastVisitDate: { "$gt": toCompareDate, "$lt": new Date(year, month, days, 23, 59, 59) } } },
            previousParlorMatch,
            lastParlorMatch,
            { $sort: { "lastVisitDate": -1 } },
            { $skip: ((page - 1) * skipLim) },
            { $limit: skipLim },
            {
                $lookup: {
                    from: "parlors",
                    localField: "previousVisitedParlorId",
                    foreignField: "_id",
                    as: "previousParlorData"
                }
            },
            {
                $lookup: {
                    from: "parlors",
                    localField: "lastVisitedParlorId",
                    foreignField: "_id",
                    as: "lastParlorData"
                }
            },
            { $unwind: "$previousParlorData" },
            { $unwind: "$lastParlorData" },
            { $project: { clientId: 1, clientName: 1, lastVisitedParlorId: 1, lastVisitedParlor: 1, phoneNumber: 1, previousVisitedParlorId: 1, previousVisitedParlor: 1, parlorName: 1, previousVisitDate: 1, lastVisitDate: 1, previousActive: "$previousParlorData.active", lastActive: "$lastParlorData.active" } }
        ], function(err, clients) {
            if (err) {
                reject(err);
            } else {
                resolve(clients);
            }
        });
    });

    var Count = new Promise(function(resolve, reject) {
        Appointment.aggregate([
            { $match: { status: 3 } },
            { $project: { client: 1, parlorId: 1, parlorName: 1, appointmentStartTime: 1 } },
            { $sort: { appointmentStartTime: 1 } },
            { $group: { "_id": "$client.id", appointmentDates: { $push: "$appointmentStartTime" }, allParlors: { $push: { parlorName: "$parlorName", parlorId: "$parlorId" } }, lastVisitedParlorId: { $last: "$parlorId" } } },
            { $project: { clientId: "$_id", appointmentDates: 1, appointmentDatesSize: { $size: "$appointmentDates" }, allParlors: 1, lastVisitedParlorId: 1, visitedParlorSize: { $size: "$allParlors" } } },
            { $project: { clientId: 1, previousVisitedParlorId: { $arrayElemAt: ['$allParlors.parlorId', { $subtract: ["$visitedParlorSize", 2] }] }, lastVisitedParlorId: 1, previousVisitDate: { $arrayElemAt: ['$appointmentDates', { $subtract: ["$appointmentDatesSize", 2] }] }, lastVisitDate: { $arrayElemAt: ['$appointmentDates', { $subtract: ["$appointmentDatesSize", 1] }] } } },
            { $match: { previousVisitDate: { "$lt": d }, lastVisitDate: { "$gt": toCompareDate, "$lt": new Date(year, month, days, 23, 59, 59) } } },
            previousParlorMatch,
            lastParlorMatch,
            { $group: { _id: null, total_count: { $sum: 1 } } }
        ], function(err, count) {
            if (err) {
                reject(err);
            } else if (count.length == 0) {
                resolve(0);
            } else {
                resolve(count[0].total_count);
            }
        });
    });

    Promise.all([Clients, Count]).then(values => {
        data.clients = values[0];
        data.total_count = values[1];
        res.json(CreateObjService.response(false, data));
    }).catch(reason => {
        res.json(CreateObjService.response(true, "Something went wrong please try again."));
    });

});

var getServiceDetails = function(serviceId, parlorId, callback) {
    var serviceName = "";
    Service.findOne({ "_id": ObjectId(serviceId) }, { name: 1, "_id": 0, categoryId: 1 }, function(err, service) {
        if (err) {
            callback(1, null);
        } else {
            ServiceCategory.findOne({ "_id": service.categoryId }, { name: 1 }, function(err, categoryName) {
                if (err) {
                    callback(1, null)
                } else {
                    Parlor.aggregate([
                        { $match: { "_id": parlorId } },
                        { $unwind: "$services" },
                        { $match: { "services.serviceId": ObjectId(serviceId) } },
                        { $project: { parlorName: "$name", serviceBasePrice: "$services.basePrice", parlorAddress: "$address2", "_id": 0 } }
                    ], function(err, serviceDetails) {
                        if (err) {
                            callback(1, null);
                        } else {
                            if (serviceDetails.length == 0) {
                                callback(null, serviceDetails);
                            } else {
                                serviceDetails[0].serviceName = service.name + "(" + categoryName.name + ")";
                                callback(null, serviceDetails);
                            }
                        }
                    })
                }
            })
        }
    });
}

var nearByParlor = function(longitude, latitude, serviceId, callback) {
    Parlor.find({
        geoLocation: {
            $near: {
                $geometry: { type: "Point", coordinates: [longitude, latitude] },
                $minDistance: 0,
                $maxDistance: 10000
            }
        },
        active: true,
        "services.serviceId": ObjectId(serviceId)
    }, { "_id": 1 }, function(err, parlors) {
        if (err) {
            callback(1, null);
        } else {
            var parlorIds = _.map(parlors, function(p) {
                return ObjectId(p._id);
            })
            callback(null, parlorIds);
        }
    }).limit(1);
}

router.get("/inactiveParlors", function(req, res) {
    Parlor.find({ active: false }, { name: 1 }, function(err, parlors) {
        if (err) {
            res.json(CreateObjService.response(true, "Server Error."));
        } else {
            res.json(CreateObjService.response(true, parlors));
        }
    })
})

router.post("/razorPayNoSusbriptionContact", (req, res) => {

    var historyObject = {
        customerCareId: req.body.customerCareId,
        customerCareName: req.body.customerCareName,
        remark: req.body.remark,
        callStatus: req.body.callStatus,
        contactedOn: new Date(),
        expectedOn: ((req.body.expectedOn == "") ? "" : req.body.expectedOn)
    }

    ContactedClients.find({ "clientId": req.body.clientId }, { "clientId": 1 }, function(err, c) {
        if (c.length > 0) {
            ContactedClients.update({ "clientId": ObjectId(req.body.clientId) }, { $push: { 'contactHistory': historyObject } }, function(err, created) {
                if (err) {
                    return res.json(CreateObjService.response(true, "Please Try Again"));
                } else {
                    if (Object.keys(created).length > 0) {
                        return res.json(CreateObjService.response(false, "Updated Successfully"));
                    } else {
                        return res.json(CreateObjService.response(true, "Please Try Again"));
                    }
                }
            });
        } else {
            var createObject = {
                clientId: req.body.clientId,
                clientPhoneNumber: req.body.clientPhoneNumber,
                clientName: req.body.clientName,
                contactHistory: historyObject,
                fromWhere: 2
            }
            ContactedClients.create(createObject, function(err, created) {
                if (err) {
                    return res.json(CreateObjService.response(true, "Please Try Again"));
                } else {
                    if (created) {
                        return res.json(CreateObjService.response(false, "Updated Successfully"));
                    } else {
                        return res.json(CreateObjService.response(true, "Please Try Again"));
                    }
                }
            });
        }
    });

})

router.post("/razorPayNoSubscription", (req, res) => {

    let page = req.body.page;
    let skipLim = 20;
    let data = {};

    let totalCustomers = new Promise((resolve, reject) => {
        Appointment.aggregate([
            { $match: { "razorPayCaptureResponse.status": "captured", "appointmentStartTime": { $gte: new Date(req.body.startDate), $lt: new Date(req.body.endDate) }, status: 3 } },
            { $sort: { appointmentStartTime: 1 } },
            { $group: { "_id": "$client.id", userId: { $first: "$client.id" }, appointmentDate: { $last: "$appointmentStartTime" }, phoneNumber: { $first: "$client.phoneNumber" }, name: { $first: "$client.name" } } },
            { $project: { "_id": 0 } },
            { $sort: { "appointmentDate": -1 } },
            { $skip: ((page - 1) * skipLim) },
            { $limit: skipLim }
        ], (err, clients) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(clients);
            }
        })
    })

    let totalCount = new Promise((resolve, reject) => {
        Appointment.aggregate([
            { $match: { "razorPayCaptureResponse.status": "captured", "appointmentStartTime": { $gte: new Date(req.body.startDate), $lt: new Date(req.body.endDate) }, status: 3 } },
            { $sort: { appointmentStartTime: 1 } },
            { $group: { "_id": "$client.id" } },
            { $group: { "_id": null, count: { $sum: 1 } } }
        ], (err, count) => {
            if (err) {
                reject(err);
            } else {
                resolve(count[0].count);
            }
        })
    })

    Promise.all([totalCustomers, totalCount]).then(values => {
        data.clients = values[0];
        data.total_count = values[1];
        res.json(CreateObjService.response(false, data));
    }).catch(reason => {
        res.json(CreateObjService.response(true, "Something went wrong please try again."));
    });

})

var returnWeekSets = (startDate, endDate) => {
console.log(startDate , '--------', endDate)
    var weeks = {};
    var startDateYear = startDate.getFullYear();
    var endDateYear = endDate.getFullYear();

    if (startDateYear == endDateYear) {

        console.log("came here in if");

        var wStart = HelperService.getWeekNumber(startDate);
        var wEnd = HelperService.getWeekNumber(endDate);

        for (var x = wStart; x < wEnd; x++) {

            if (x < 10) {
                var y = "0" + x;
                weeks[y + "/" + startDateYear.toString()] = null;
            } else {
                var y = x.toString();

                weeks[y + "/" + startDateYear.toString()] = null;
            }

        }

        return weeks;

    } else {

        var wStart = HelperService.getWeekNumber(startDate);
        var wEnd = HelperService.getWeekNumber(endDate);
        // console.log(wStart, "=====" , wEnd)

        for (var x = wStart; x <= 52; x++) {

            if (x < 10) {
                var y = "0" + x;
                weeks[y + "/2018"] = null;
                console.log("11111" ,y)
            } else {
                var y = x.toString();
                weeks[y + "/2018"] = null;
                console.log("22222-----" ,y)
            }

        }

        for (var x = 1; x <= wEnd; x++) {

            if (x < 10) {
                var y = "0" + x;
                weeks[y + "/2019"] = null;
            } else {
                var y = x.toString();
                weeks[y + "/2019"] = null;
            }

        }

        // console.log(weeks);

        return weeks;

    }

}

var getEmployeeAnalysis = (empId, startDate, endDate, cb) => {

    var weekSet = returnWeekSets(new Date(startDate), new Date(endDate));

    Admin.findOne({ _id: empId }, { _id: 0, firstName: 1, lastName: 1, position: 1 }, (err, employee) => {
        if (err) {
            cb(1, null, null);
        } else {

            Appointment.aggregate([{ $match: { "services.employees.employeeId": empId, status: 3, "appointmentStartTime": { $gte: new Date(startDate), $lt: new Date(endDate) } } },
                { $unwind: "$employees" },
                { $unwind: "$services" },
                { $unwind: "$services.employees" },
                { $match: { "employees.employeeId": empId, "services.employees.employeeId": empId } },
                { $group: { "_id": "$_id", employees: { $first: "$employees" }, services: { $first: "$services" }, appointmentStartTime: { $first: "$appointmentStartTime" } } },
                {
                    $group: {
                        _id: {
                            week: {
                                $dateToString: {
                                    format: "%V/%Y",
                                    date: "$appointmentStartTime"
                                }
                            },
                            serviceCategory: "$services.categoryId"
                        },
                        numberOfServices: { $sum: 1 },
                        totalRevenue: { $sum: "$employees.revenue" }
                    }
                },
                { $project: { week: "$_id.week", serviceCategory: "$_id.serviceCategory", numberOfServices: 1, totalRevenue: 1, _id: 0 } },
                {
                    $lookup: {
                        from: "servicecategories",
                        localField: "serviceCategory",
                        foreignField: "_id",
                        as: "serviceData"
                    }
                },
                { $unwind: "$serviceData" },
                { $project: { week: 1, serviceName: "$serviceData.name", serviceCategory: 1, numberOfServices: 1, totalRevenue: 1, _id: 0 } },
                { $group: { "_id": "$week", services: { $push: { serviceCategory: "$serviceCategory", serviceName: "$serviceName", numberOfServices: { $sum: "$numberOfServices" }, totalRevenue: { $trunc: { $sum: "$totalRevenue" } } } } } },
                { $project: { week: "$_id", "_id": 0, services: 1 } },
            ], (err, analysis) => {
                if (err) {
                    cb(1, null, null);
                } else if (analysis.length == 0) {
                    cb(null, null, []);
                } else {

                    var empData = {
                        name: employee.firstName + " " + employee.lastName,
                        position: employee.position
                    }

                    for (var a = 0; a < analysis.length; a++) {
                        weekSet[analysis[a].week] = analysis[a].services;
                    }

                    cb(null, empData, weekSet);
                }
            })
        }
    });
}

router.post("/employeeAnalysis", (req, res) => {
    var parlorId = req.body.parlorId;
    var data = [];

    Admin.find({ parlorId: ObjectId(parlorId), active: true }, { _id: 1 }, (err, employees) => {
        if (err) {
            res.json(CreateObjService.response(true, "Server Error"))
        } else {
            var employeeIds = employees.map(emp => ObjectId(emp._id));
            async.each(employeeIds, (empId, cb) => {
                getEmployeeAnalysis(empId, req.body.startDate, req.body.endDate, (err, empData, weeks) => {
                    if (err) {
                        cb();
                    } else if (weeks.length == 0) {
                        cb();
                    } else {
                        var userData = {};
                        userData.name = empData.name;
                        userData.position = empData.position;
                        userData.analysis = weeks;
                        data.push(userData);
                        cb();
                    }
                });
            }, () => {
                res.json(data);
            })
        }
    });
});

function revenueBetweenDates(parlorId, betweenDates, cb) {

    console.log("Between dates are");
    console.log(betweenDates);

    var query = [
        { $match: { "appointmentStartTime": betweenDates, "parlorId": ObjectId(parlorId), "status": 3 } },
        { $group: { "_id": "$parlorId", serviceRev: { $sum: "$serviceRevenue" }, productRev: { $sum: "$productRevenue" }, count: { $sum: 1 } } },
        { $project: { "_id": 0, "revenue": { $add: ["$serviceRev", "$productRev"] }, count: 1 } }
    ];

    Appointment.aggregate(query, function(err, revenueData) {
        if (err) {
            cb(1, null);
        } else {
            cb(null, revenueData);
        }
    })

}

function checkGstNumber(parlorId, cb) {
    Parlor.findOne({ active: true, parlorId: ObjectId(parlorId) }, { gstNumber: 1 }, function(err, gstNumber) {
        if (err) {
            console.log("Server Error.");
            cb(1, null);
        } else if (gstNumber == null || gstNumber.trim() === "") {
            console.log("No GST is there.");
            cb(null, false);
        } else {
            console.log("GST is there.");
            cb(null, true);
        }
    })
}

function monthOnMonthSaleRatio(parlorId, cb) {

    var yesterdayDate = new Date(new Date().setDate(new Date().getDate() - 1))
    var thirtyDaysOldDate = new Date(new Date().setDate(new Date().getDate() - 30));
    var sixtyDaysOldDate = new Date(new Date().setDate(new Date().getDate() - 60));

    var lastThirtyDays = {
        "$gte": new Date(thirtyDaysOldDate.getFullYear(), thirtyDaysOldDate.getMonth(), thirtyDaysOldDate.getDate()),
        "$lt": new Date(yesterdayDate.getFullYear(), yesterdayDate.getMonth(), yesterdayDate.getDate(), 23, 59, 59)
    };
    var lastThirtyToSixtyDays = {
        "$gte": new Date(sixtyDaysOldDate.getFullYear(), sixtyDaysOldDate.getMonth(), sixtyDaysOldDate.getDate()),
        "$lt": new Date(thirtyDaysOldDate.getFullYear(), thirtyDaysOldDate.getMonth(), thirtyDaysOldDate.getDate())
    };

    revenueBetweenDates(parlorId, lastThirtyDays, function(err, lastThirtyDaysData) {
        if (err) {
            cb(1, null);
        } else {
            revenueBetweenDates(parlorId, lastThirtyToSixtyDays, function(err, lastThirtyToSixtyDaysData) {
                if (err) {
                    cb(1, null);
                } else {

                    var lastThirtyDaysRevenue = lastThirtyDaysData[0].revenue;
                    var lastThirtyToSixtyDaysRevenue = lastThirtyToSixtyDaysData[0].revenue;
                    var monthOnMonthSaleRatio = (lastThirtyDaysRevenue / lastThirtyToSixtyDaysRevenue);

                    cb(null, monthOnMonthSaleRatio);
                }
            })
        }
    })

}

function weekOnWeekSaleRatio(parlorId, cb) {
    var yesterdayDate = new Date(new Date().setDate(new Date().getDate() - 1))
    var sevenDaysOldDate = new Date(new Date().setDate(new Date().getDate() - 7));
    var fourteenDaysOldDate = new Date(new Date().setDate(new Date().getDate() - 14));

    var lastSevenDays = {
        "$gte": new Date(sevenDaysOldDate.getFullYear(), sevenDaysOldDate.getMonth(), sevenDaysOldDate.getDate()),
        "$lt": new Date(yesterdayDate.getFullYear(), yesterdayDate.getMonth(), yesterdayDate.getDate(), 23, 59, 59)
    };
    var lastSevenToFourteenDays = {
        "$gte": new Date(fourteenDaysOldDate.getFullYear(), fourteenDaysOldDate.getMonth(), fourteenDaysOldDate.getDate()),
        "$lt": new Date(sevenDaysOldDate.getFullYear(), sevenDaysOldDate.getMonth(), sevenDaysOldDate.getDate())
    };

    revenueBetweenDates(parlorId, lastSevenDays, function(err, lastSevenDaysData) {
        if (err) {
            cb(1, null);
        } else {
            revenueBetweenDates(parlorId, lastSevenToFourteenDays, function(err, lastSevenToFourteenDaysData) {
                if (err) {
                    cb(1, null);
                } else {

                    var lastSevenDaysRevenue = lastSevenDaysData[0].revenue;
                    var lastSevenToFourteenDaysRevenue = lastSevenToFourteenDaysData[0].revenue;
                    var weekOnWeekSaleRatio = (lastSevenDaysRevenue / lastSevenToFourteenDaysRevenue);

                    cb(null, weekOnWeekSaleRatio);
                }
            })
        }
    })

}

function staffClaimingLuckyDraw(parlorId, cb) {

    Admin.find({ active: true, $or: [{ parlorIds: { $in: [ObjectId(parlorId)] } }, { parlorId: ObjectId(parlorId) }] }).distinct("_id", function(err, employeeIds) {
        if (err) {
            cb(1, null);
        } else {
            LuckyDrawDynamic.find({ employeeId: { $in: employeeIds }, parlorId: ObjectId(parlorId) }).distinct("employeeId", function(err, luckyDrawIds) {
                if (err) {
                    cb(1, null);
                } else {
                    cb(null, (luckyDrawIds.length / employeeIds.length))
                }
            })
        }
    });

}

router.post("/checkConcerns", function(req, res) {

    var parlorId = req.body.parlorId;
    staffClaimingLuckyDraw(parlorId, function(err, staffClaimingLuckyDraw) {
        if (err) {
            console.log("Error");
        } else {
            res.json(Math.trunc(staffClaimingLuckyDraw * 100));
        }
    });
});

router.get("/getSubscriptionCustomerCare", (req, res) => {
    WebsiteQuery.aggregate([
        { $match: { queryType: 1, customerCareName: { $exists: true } } },
        { $group: { "_id": "$customerCareName" } },
        { $project: { customerCareName: "$_id", _id: 0 } }
    ], (err, customerCareNames) => {
        if (err) {

        } else {
            res.json(customerCareNames);
        }
    })
});

router.post("/subscriptionConverted", function(req, res) {
    var page = parseInt(req.body.page);
    var customerCareName = req.body.customerCareName;
    var lastMatchQuery = { $match: {} };

    if (customerCareName != undefined) {
        lastMatchQuery = { $match: { contactedBy: customerCareName } }
    }


    var data = {};
    var skipLim = 20;
    var subscriptionConverted = new Promise(function(resolve, reject) {
        WebsiteQuery.aggregate([
            { $match: { queryType: 1, customerCareId: { $exists: true } } },
            {
                $lookup: {
                    from: "users",
                    localField: "phoneNumber",
                    foreignField: "phoneNumber",
                    as: "userData"
                }
            },
            { $unwind: "$userData" },
            { $match: { "userData.subscriptionId": { $in: [1, 2] } } },
            {
                $lookup: {
                    from: "subscriptionsales",
                    localField: "userData._id",
                    foreignField: "userId",
                    as: "subscriptionData"
                }
            },
            { $unwind: "$subscriptionData" },
            { $project: { "_id": 0, createdAt: "$createdAt", contactedBy: "$customerCareName", "subscriptionDate": "$subscriptionData.createdAt", diffDate: { "$subtract": ["$createdAt", "$subscriptionData.createdAt"] }, "contactedOn": "$createdAt", queryText: "$queryText", firstName: "$userData.firstName", subscriptionType: "$userData.subscriptionId", phoneNumber: "$userData.phoneNumber" } },
            { $group: { "_id": "$phoneNumber", createdAt: { $first: "$createdAt" }, contactedBy: { $first: "$contactedBy" }, subscriptionDate: { $first: "$subscriptionDate" }, diffDate: { $first: "$diffDate" }, contactedOn: { $first: "$contactedOn" }, queryText: { $first: "$queryText" }, firstName: { $first: "$firstName" }, subscriptionType: { $first: "$subscriptionType" }, phoneNumber: { $first: "$phoneNumber" } } },
            { $match: { diffDate: { $lt: 0 } } },
            lastMatchQuery,
            { $project: { diffDate: 0 } },
            { $sort: { "createdAt": -1 } },
            { $skip: ((page - 1) * skipLim) },
            { $limit: skipLim }
        ], function(err, subscriptionConvertedCustomers) {

            console.log(subscriptionConvertedCustomers);
            if (err) {
                reject(err);
                console.log(err);
            } else {
                resolve(subscriptionConvertedCustomers);
            }
        })
    });

    var subscriptionConvertedCount = new Promise(function(resolve, reject) {
        WebsiteQuery.aggregate([
            { $match: { queryType: 1, customerCareId: { $exists: true } } },
            {
                $lookup: {
                    from: "users",
                    localField: "phoneNumber",
                    foreignField: "phoneNumber",
                    as: "userData"
                }
            },
            { $unwind: "$userData" },
            { $match: { "userData.subscriptionId": { $in: [1, 2] } } },
            {
                $lookup: {
                    from: "subscriptionsales",
                    localField: "userData._id",
                    foreignField: "userId",
                    as: "subscriptionData"
                }
            },
            { $unwind: "$subscriptionData" },
            { $project: { "_id": 0, contactedBy: "$customerCareName", "subscriptionDate": "$subscriptionData.createdAt", diffDate: { "$subtract": ["$createdAt", "$subscriptionData.createdAt"] }, "contactedOn": "$createdAt", queryText: "$queryText", firstName: "$userData.firstName", subscriptionType: "$userData.subscriptionId", phoneNumber: "$userData.phoneNumber" } },
            { $group: { "_id": "$phoneNumber", createdAt: { $first: "$createdAt" }, contactedBy: { $first: "$contactedBy" }, subscriptionDate: { $first: "$subscriptionDate" }, diffDate: { $first: "$diffDate" }, contactedOn: { $first: "$contactedOn" }, queryText: { $first: "$queryText" }, firstName: { $first: "$firstName" }, subscriptionType: { $first: "$subscriptionType" }, phoneNumber: { $first: "$phoneNumber" } } },
            { $match: { diffDate: { $lt: 0 } } },
            lastMatchQuery,
            { $group: { "_id": null, count: { $sum: 1 } } }
        ], function(err, subscriptionConvertedCount) {
            if (err) {
                reject(err);
                console.log(err);
            } else {
                resolve(subscriptionConvertedCount[0].count);
            }
        })
    });

    Promise.all([subscriptionConverted, subscriptionConvertedCount]).then(values => {
        data.clients = values[0];
        data.total_count = values[1];
        res.json(CreateObjService.response(false, data));
    }).catch(reason => {
        res.json(CreateObjService.response(true, "Something went wrong please try again."));
    });

})

router.post("/copyFromUsers", (req, res) => {

    var copyUser = (skipLim, totalRounds) => {

        console.log("skipLim is ", skipLim, " totalRounds are ", totalRounds);

        MarketingUser.find({ longitude: { $eq: null }, latitude: { $ne: null } }, { "userId": 1 }, (err, users) => {
            if (!err) {
                async.each(users, (u, cb) => {
                    User.findOne({ "_id": u.userId }, { longitude: 1 }, (err, user) => {
                        if (err) {
                            cb();
                        } else if (user) {
                            MarketingUser.update({ userId: u.userId }, { $set: { longitude: user.longitude } },
                                (err, created) => {
                                    console.log("updated");
                                    cb();
                                }
                            )
                        } else {
                            cb();
                        }
                    })
                }, () => {

                    if (skipLim <= maxSkipLim) {
                        skipLim += 1;
                        copyUser(skipLim, totalRounds);
                    }

                })
            }
        }).skip((skipLim - 1) * 1000).limit(1000);
    }

    var maxSkipLim = Math.ceil(3000 / 1000);

    copyUser(1, maxSkipLim);

})

router.post("/userInteraction", (req, res) => {

    let daysAfter = (daysToAdd) => {
        let dateToSet = new Date((new Date()).setDate((new Date()).getDate() + daysToAdd));
        dateToSet.setHours(10);
        dateToSet.setMinutes(0);
        dateToSet.setSeconds(0);
        return dateToSet;
    }

    let marketingschedularFunction = (t) => {

        MarketingUser.aggregate([
            // { $match : {"servicesTaken.0" : {$exists : true}}},
            { $match: { phoneNumber: "8010178215" } },
            { $project: { _id: 0, emailId: 1, phoneNumber: 1, firebaseId: 1, firebaseIdIOS: 1, userId: 1, servicesTaken: 1 } },
            // { $limit : 100},
            { $unwind: "$servicesTaken" },
            // { $match : {"servicesTaken.categoryId" : ObjectId("58707ed90901cc46c44af27b") } },
            { $group: { "_id": "$phoneNumber", emailId: { $first: "$emailId" }, phoneNumber: { $first: "$phoneNumber" }, firebaseId: { $first: "$firebaseId" }, firebaseIdIOS: { $first: "$firebaseIdIOS" }, userId: { $first: "$userId" }, servicesTaken: { $push: "$servicesTaken" } } },
            { $project: { "_id": 0 } }
        ], (err, data) => {

            if (data.length > 0) {
                async.each(data, (d, cb) => {
                    let daysToAdd = 1;

                    MarketingSchedular.aggregate([
                        { $match: { userId: d.userId, status: 0 } },
                        { $sort: { sendTime: 1 } },
                        { $group: { "_id": null, lastDate: { $last: "$sendTime" } } }
                    ], (err, greatestDate) => {

                        if (!err && greatestDate.length > 0) {
                            let diff = (HelperService.getNoOfDaysDiff(new Date(greatestDate[0].lastDate), daysAfter(0)));
                            if (diff > 0) {
                                daysToAdd = diff + 1;
                            }
                        }

                        async.each(d.servicesTaken, (s, cb2) => {
                            Service.findOne({ _id: s.serviceId }, { smsContent: 1, notificationTitle: 1, notificationContent: 1, serviceRepeatDay: 1, repeatDaysInterval: 1 }, (err, serviceDetails) => {
                                if (err) {
                                    cb2();
                                } else {

                                    let daysDiff = HelperService.getNoOfDaysDiff(new Date(), new Date(s.lastAppointmentDate));

                                    if (daysDiff > serviceDetails.serviceRepeatDay) {

                                        MarketingSchedular.findOne({ userId: d.userId, serviceId: serviceDetails._id, status: 0 }, (err, found) => {
                                            if (err) {
                                                cb2();
                                            } else if (found) {
                                                cb2();
                                            } else {

                                                let obj = {
                                                    userId: d.userId,
                                                    type: t,
                                                    serviceId: serviceDetails._id,
                                                    sendTime: daysAfter(daysToAdd),
                                                    phoneNumber: d.phoneNumber,
                                                    firebaseId: d.firebaseId,
                                                    firebaseIdIOS: d.firebaseIdIOS,
                                                    emailId: d.emailId,
                                                    smsContent: serviceDetails.smsContent,
                                                    notificationTitle: serviceDetails.notificationTitle,
                                                    notificationContent: serviceDetails.notificationContent
                                                }

                                                daysToAdd++;

                                                MarketingSchedular.create(obj, (err, created) => {
                                                    cb2();
                                                });

                                            }
                                        })

                                    } else {
                                        cb2();
                                    }
                                }
                            })
                        }, () => {
                            cb();
                        })

                    })

                }, () => {
                    console.log("All Done.");
                })
            } else {
                console.log("No data came.");
            }

        })

    }

    marketingschedularFunction(2);

})

router.post("/sendSchedular", (req, res) => {

    let d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth();
    let day = d.getDate();


    // let sendSms =(phoneNumber, text, cb) => {
    //     let url = "http://api.msg91.com/api/sendhttp.php?sender=BEUSLN&route=4&mobiles="+phoneNumber+"&authkey=164034A93iTmJcMu595dd01d&country=91&message="+text;
    //     request(url, (error, response, body) => {
    //       if(error){
    //         console.log("Message Sending Failed to "+phoneNumber);
    //         cb(true, null);
    //       }else{
    //         console.log("Message Sent Successfully to "+phoneNumber);
    //         cb(false, body);
    //       }
    //     });
    // }
    console.log({ $lt: new Date(year, month, day, 23, 59, 1), $gt: new Date(year, month, day, 0, 0, 0) });
    // MarketingSchedular.aggregate([
    //     {$match : {sendTime : {$lt : new Date(year, month, day, 23, 59, 1), $gt : new  Date(year, month, day, 0, 0, 0)}, status : 0}},
    //     {$project : {userId : 1, serviceId : 1, type : 1, phoneNumber : 1, firebaseId : 1, firebaseIdIOS : 1, repeatDaysInterval : 1, smsContent : 1, notificationTitle : 1, notificationContent : 1, emailId : 1}}
    // ], (err, users) => {
    MarketingSchedular.aggregate([
        { $match: { userId: ObjectId("5ad7c23a05431333f42cb715"), status: 0 } },
        { $project: { userId: 1, serviceId: 1, type: 1, phoneNumber: 1, firebaseId: 1, firebaseIdIOS: 1, repeatDaysInterval: 1, smsContent: 1, notificationTitle: 1, notificationContent: 1, emailId: 1 } }
    ], (err, users) => {
        async.each(users, (u, cb) => {
            if (u.notificationTitle != "NOTIFICATION TITLE" && u.notificationContent != "NOTIFICATION CONTENT") {
                if (u.type == 1) {
                    cb();
                } else if (u.type == 2) {
                    // console.log("type is 2");
                    // console.log("sms content is ",u.smsContent);

                    // sendSms(u.phoneNumber, u.smsContent, (err, succeed) => {
                    //   MarketingSchedular.update({_id : u._id}, {$set : {status : 1}}, (err, updated) => {
                    cb();
                    //   })
                    // })

                } else if (u.type == 3) {

                    let notificationData = {
                        type: "offer",
                        title: u.notificationTitle,
                        body: u.notificationContent,
                        sImage: '',
                        lImage: '',
                        notificationId: "1"
                    }

                    if (u.firebaseId == null && u.firebaseIdIOS == null) {
                        console.log("both null");
                        cb();
                    } else if (u.firebaseId != null && u.firebaseIdIOS == null) {
                        Appointment.sendAppNotificationAdmin([u.firebaseId], notificationData, function(err, response) {
                            console.log("came here in android noti");
                            console.log(response);

                            MarketingSchedular.update({ _id: u._id }, { $set: { sendTime: HelperService.addDaysToDate(new Date(), u.repeatDaysInterval), status: 0 } }, (err, updated) => {
                                console.log(err);
                                cb();
                            })

                        });
                    } else if (u.firebaseId == null && u.firebaseIdIOS != null) {
                        Appointment.sendAppNotificationIOSAdmin([u.firebaseIdIOS], notificationData, function(err, response) {
                            console.log("came here in ios noti")
                            console.log(response);

                            MarketingSchedular.update({ _id: u._id }, { $set: { sendTime: HelperService.addDaysToDate(new Date(), u.repeatDaysInterval), status: 0 } }, (err, updated) => {
                                cb();
                            })

                        });
                    }
                }
            } else {
                console.log("empty notification title")
            }
        }, () => {
            res.json("All Done");
        })
    })
})


router.post("/sendUsingXML", (req, res) => {

    var numbers = ["8527372926", "8750397739", "8826488277"];

    var builder = require('xmlbuilder');
    var xml = builder.create('MESSAGE')
        .ele('AUTHKEY', '164034A93iTmJcMu595dd01d').up()
        .ele('SENDER', 'BEUSLN').up()
        .ele('ROUTE', 4).up()
        .ele('CAMPAIGN', 'TEST TEST').up()
        .ele('COUNTRY', 91).up()
        .ele("SMS", { 'TEXT': 'This is the message text' });

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

})

router.get("/subscribedUsers", (req, res) => {

    User.find({ subscriptionId: { $in: [1, 2] } }, { firstName: 1, phoneNumber: 1 }, (err, users) => {
        res.json(users);
    });

});

// router.post("/updateParlorImages", (req, res) => {
//
//   Parlor.find({active : false}, {images : 1}, (err, parlors) =>{
//
//     if(err){
//       console.log("error in fetching parlors");
//     }else{
//       async.each(parlors, (p, cb)=>{
//
//         var imagesToUpdate = [];
//
//         Parlor.findOne({_id : p._id}, {images : 1}, (err, parlor) => {
//           if(err){
//             cb();
//           }else if(parlor){
//
//             (parlor.images).forEach(function(i){
//               var i = i.toJSON();
//               if(i.hasOwnProperty('appImageUrl')){
//                 imagesToUpdate.push(i);
//               }
//             })
//
//             console.log(imagesToUpdate);
//             console.log("-------------");
//
//             Parlor.update({_id : p._id}, {$set : {images : imagesToUpdate}}, (err, updated) => {
//               cb();
//             });
//
//           }else{
//             console.log("do nothing");
//             cb();
//           }
//
//         })
//
//       }, () => {
//         console.log("All done");
//       })
//     }
//
//   });
//
// });

function monthRange(startDate, endDate) {
    var start = startDate.split('-');
    var end = endDate.split('-');
    var startYear = parseInt(start[0]);
    var endYear = parseInt(end[0]);
    var dates = [];

    for (var i = startYear; i <= endYear; i++) {
        var endMonth = i != endYear ? 11 : parseInt(end[1]) - 1;
        var startMon = i === startYear ? parseInt(start[1]) - 1 : 0;
        for (var j = startMon; j <= endMonth; j = j > 12 ? j % 12 || 11 : j + 1) {
            var month = j + 1;
            var displayMonth = month < 10 ? '0' + month : month;
            dates.push([i, displayMonth].join('-'));
        }
    }
    return dates;
}

router.post("/revenueReport2", (req, res) => {

    var startDate = new Date(req.body.startDate);
    var endDate = new Date(req.body.endDate);
    var months = monthRange(startDate.getFullYear() + "-" + (startDate.getMonth() + 1) + "-" + startDate.getDate(), endDate.getFullYear() + "-" + (endDate.getMonth() + 1) + "-" + endDate.getDate())

    console.log(months);

    Appointment.aggregate([
        { $match: { "status": 3, appointmentStartTime: { $gt: new Date(startDate), $lt: new Date(endDate) } } },
        {
            $group: {
                _id: {
                    month: {
                        $dateToString: {
                            format: "%Y-%m",
                            date: "$appointmentStartTime"
                        }
                    },
                    parlorId: "$parlorId"
                },
                serviceRev: { $sum: "$serviceRevenue" },
                productRev: { $sum: "$productRevenue" },
                count: { $sum: { $size: "$services" } }
            }
        },
        { $project: { _id: 0, month: "$_id.month", parlorId: "$_id.parlorId", serviceRev: 1, productRev: 1, count: 1 } },
        { $group: { "_id": "$parlorId", monthlyData: { $push: { serviceRevenue: "$serviceRev", productReveue: "$productRev", totalRevenue: { $add: ["$serviceRev", "$productRev"] }, month: "$month", count: "$count" } } } },
        {
            $lookup: {
                from: "parlors",
                localField: "_id",
                foreignField: "_id",
                as: "parlorData"
            }
        },
        { $unwind: "$parlorData" },
        { $project: { _id: 0, monthlyData: 1, name: "$parlorData.name", parlorLiveDate: "$parlorData.parlorLiveDate" } }
    ], (err, revenueReport) => {
        var finalReport = revenueReport.map(function(r) {
            var monthlyData = r.monthlyData;
            months.forEach(function(m) {
                var notThere = true;
                (r.monthlyData).forEach(function(rm) {
                    if (rm.month == m) {
                        notThere = false;
                    }
                });
                if (notThere) {
                    monthlyData.push({
                        "serviceRevenue": 0,
                        "productRevenue": 0,
                        "totalRevenue": 0,
                        "month": m,
                        "count": 0
                    })
                }
            });
            r.monthlyData = (monthlyData).sort(function(a, b) {
                var aD = parseInt((a.month).split("-").join(""));
                var bD = parseInt((b.month).split("-").join(""));
                return aD < bD ? -1 : (aD > bD ? 1 : 0);
            })
            return r;
        });
        res.json(finalReport);
    })
})

router.get("/updateClientServed", function(req, res) {

    Admin.find({}, { _id: 1 }, (err, emps) => {
        async.each(emps, (e, cb) => {

            Appointment.find({ status: 3, "employees.employeeId": e._id }).count(function(err, count) {

                Admin.update({ "_id": e._id }, { $set: { clientServed: count } }, (err, updated) => {
                    console.log("successfully updated");
                    cb();
                })

            })

        }, () => {
            console.log("All done");
        })

    })

});

router.get("/updateEmployeeRating", function(req, res) {

    Admin.find({}, { _id: 1 }, (err, emps) => {
        async.each(emps, (e, cb) => {

            Appointment.aggregate([
                { $match: { status: 3, "review.rating": { $exists: true }, "review.employees.employeeId": e._id } },
                { $group: { "_id": null, count: { $sum: 1 }, reviewTotal: { $sum: "$review.rating" } } },
                { $project: { avgRating: { $divide: ["$reviewTotal", "$count"] } } }
            ], (err, avgRating) => {
                if (err) {
                    cb();
                } else if (avgRating.length == 0) {

                    console.log("coming here");

                    Admin.update({ "_id": e._id }, { $set: { rating: null } }, (err, updated) => {
                        console.log("successfully updated null");
                        cb();
                    })

                } else {

                    Admin.update({ "_id": e._id }, { $set: { rating: avgRating[0].avgRating } }, (err, updated) => {
                        console.log("successfully updated successfully");
                        cb();
                    })

                }

            })

        }, () => {
            console.log("All done");
        })
    });

});



router.get('/callApi', function(req, res) {
    console.log("right")
    return res.json('done')
});

router.get('/getHistoryOfContactedClients' , function(req, res){
    console.log("phoneNumber" , req.query.phoneNumber)
    ContactedClients.findOne({clientPhoneNumber: req.query.phoneNumber}, {contactHistory:1}, function(err, contactHistory){
        return res.json(contactHistory);

    })
});

// router.post("/locationTracker", function(req, res) {
//     console.log(req.body)
//     async.eachSeries(req.body, function(location, cb) {
//             var lat = location.latitude;
//             var long = location.longitude;
//             var time = new Date(location.time);
//             console.log("time is --------------------------->", time)
//             var userId = location.userId;
//             var parlorId = null;
//             var parlorName = null;
//             var today = new Date();
//             var todayMonth = today.getMonth();
//             var todayDate = today.getDate();
//             Beu.findOne({
//                 _id: userId
//             }, function(err, employee) {
//                 Parlor.find({ $or: [{ "active": true }, { "_id": "594a359d9856d3158171ea4f" }] }, {
//                     name: 1,
//                     latitude: 1,
//                     longitude: 1
//                 }, function(err, parlors) {
//                     _.forEach(parlors, function(parlor) {
//                         var distance = HelperService.getDistanceBtwCordinates1(parlor.latitude, parlor.longitude, lat, long);
//                         var value = (distance * 100)
//                         if (value <= 20) {
//                             parlorId = parlor._id;
//                             parlorName = parlor.name;
//                         }
//                     }); //foreach ends

//                     if (parlorId) { // inside the parlor

//                         LocationTracker.find({ "userId": userId, parlorId: parlorId }, function(err, prevloc) {

//                             if (prevloc.length > 0) {

//                                 if (prevloc[0].count < 3) {
//                                     console.log("In Parlor previous locaion is less than 3")
//                                     var obj = returnTrackerObj(userId, null, lat, long, parlorId, time, 0, (prevloc[0].count + 1));

//                                     LocationTracker.create(obj, function(err, loc) {
//                                         if (err) console.log("---------err-----------", err);
//                                         cb();
//                                     });
//                                 } else {
//                                     SalonCheckin.find({ userId: userId }, function(err, previousCheckin) {
//                                         if (previousCheckin.length > 0) {
//                                             console.log("In Parlor previous salon checkin is greater than 3")
//                                             var P_checkIn = previousCheckin[0];
//                                             if ((P_checkIn.parlorId).toString() == (parlorId).toString() && todayDate == (new Date(previousCheckin[0].time)).getDate()) {
//                                                 console.log("Previous login exisit and in the same parlor as just min before")
//                                                 if (P_checkIn.formId) {
//                                                     console.log("Form already exists----------")

//                                                     LocationTracker.find({ userId: userId, parlorId: P_checkIn.parlorId }, function(err, thisLoc) {
//                                                         var obj = returnTrackerObj(userId, P_checkIn._id, lat, long, parlorId, time, 0, (prevloc[0].count + 1));
//                                                         console.log("----------------------------------------------------------------------", obj)
//                                                         LocationTracker.create(obj, function(err, loc) {
//                                                             if (err) console.log("---------err-----------");
//                                                             cb();

//                                                         })

//                                                     }).sort({ createdAt: -1 }).limit(1);
//                                                 } else {
//                                                     console.log("Creating new form----------")

//                                                     formCreate(userId, parlorId, function(err, formData) {
//                                                         if (err) {
//                                                             console.log("Form data could not be updated!");
//                                                             return false;
//                                                         }
//                                                         if (formData) {

//                                                             SalonCheckin.update({ _id: ObjectId(P_checkIn._id) }, { $set: { formId: formData.formId, formStatus: formData.formStatus } }, function(err, updated) {
//                                                                 cb();
//                                                             });
//                                                         }
//                                                     });
//                                                 }


//                                             } else {

//                                                 if (P_checkIn.checkOut == null) {
//                                                     console.log("If the tracker location is in a parlor and the previous checkin parlor doesn't match with " +
//                                                         +"this parlor then checking for prev chekin has checkout")
//                                                     LocationTracker.find({ userId: userId, parlorId: P_checkIn.parlorId }, function(err, thisLoc) {
//                                                         SalonCheckin.update({ _id: P_checkIn._id }, { $set: { checkOut: thisLoc.time } }, function(err, salonUpdated) {
//                                                             var obj = returnTrackerObj(userId, null, lat, long, parlorId, time, 1, (prevloc[0].count + 1));
//                                                             console.log("----------------------------------------------------------------------", obj)
//                                                             LocationTracker.create(obj, function(err, loc) {
//                                                                 if (err) console.log("---------err-----------");
//                                                                 cb();
//                                                             });
//                                                         })

//                                                     }).sort({ createdAt: -1 }).limit(1);
//                                                 } else {
//                                                     console.log("If the tracker location is in a parlor and the previous checkin parlor doesn't match with " +
//                                                         +"this parlor then creating new salon checkin")
//                                                     var obj = returnTrackerObj(userId, null, lat, long, parlorId, time, 0, (prevloc[0].count + 1));
//                                                     LocationTracker.create(obj, function(err, loc) {
//                                                         if (err) console.log("---------err-----------");
//                                                         var chkObj = returnCheckinObj(userId, time, null, lat, long, parlorId, 0)
//                                                         SalonCheckin.create(chkObj, function(err, chekCreated) {
//                                                             console.log("!11!!!!!!!!!!!!!!!!!!!!!!!!!!!!!salon checkin err", err)
//                                                             cb();
//                                                         })
//                                                     });


//                                                 }

//                                             }

//                                         } else {

//                                             console.log("If the previous checkin doesn't exisits, very new checkin");
//                                             LocationTracker.find({ userId: userId, parlorId: parlorId }, function(err, thisLoc) {
//                                                 var obj = returnTrackerObj(userId, null, lat, long, parlorId, time, 0, (thisLoc[0].count + 1));
//                                                 LocationTracker.create(obj, function(err, loc) {
//                                                     if (err) console.log("---------err-----------");
//                                                     var chkObj = returnCheckinObj(userId, time, null, lat, long, parlorId, 0)
//                                                     SalonCheckin.create(chkObj, function(err, chekCreated) {
//                                                         console.log("!11!!!!!!!!!!!!!!!!!!!!!!!!!!!!!salon checkin err", err)
//                                                         cb();
//                                                     })

//                                                 });
//                                             }).sort({ createdAt: -1 }).limit(1)
//                                         }
//                                         console.log("greater ho gya h")
//                                     }).sort({ createdAt: -1 }).limit(1);
//                                 }

//                             } else {
//                                 console.log("In Parlor previous locaion is doesn't exists")

//                                 var obj = returnTrackerObj(userId, null, lat, long, parlorId, time, 0, 1);

//                                 console.log("----------------------------------------------------------------------", obj)
//                                 LocationTracker.create(obj, function(err, loc) {
//                                     if (err) console.log("---------err-----------");
//                                     cb();
//                                 });
//                             }
//                         }).sort({ createdAt: -1 }).limit(1)



//                     } else { // outside the parlor

//                         console.log("I am Outside the  Parlor")
//                         var obj = returnTrackerObj(userId, null, lat, long, null, time, 2, 1);
//                         LocationTracker.create(obj, function(err, loc) {
//                             console.log(err)
//                             cb();
//                         });

//                     }
//                 })
//             })
//         },
//         function(done) {
//             return res.json(CreateObjService.response(false, "done"));
//         })
// });


module.exports = router;