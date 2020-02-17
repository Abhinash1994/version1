'use strict'

var express = require('express');
var router = express.Router();
var path = require('path');
var async = require('async');
var mongoose = require('mongoose');
var request = require('request');
// middleware that is specific to this router
var ObjectId = mongoose.Types.ObjectId;


// ---------------------------Route protection------------------------------------
router.use('/api', function timeLog(req, res, next) {
    User.findOne({ _id: req.body.userId, accesstoken: req.body.accessToken }, function(err, user) {
        if (user) {
            next();
        } else {
            return res.sendStatus(403);
        }
    });
});

// ---------------------------------------------Custom Functions-------------------------------------

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

var replaceMonth = function(m, df) {
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
    if (df == "y/m/d") {
        arr.map(function(a) {
            return a.date = replaceMonth(a.date, "y/m/d");
        });
    }
    return arr;
}

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
};

function calculateByParlorRevenue(services, parlorId) {
    var count = 0;
    _.forEach(services, function(s) {
        var p = _.filter(s.parlors, function(sp) {
            return sp.parlorId + "" == parlorId + ""
        })[0];
        if (p) count += p.revenue;
    });
    return count;
};

function calculateByParlorRevenueDept(services, parlorId) {
    var count = 0;
    _.forEach(services, function(s) {
        var p = _.filter(s.parlors, function(sp) {
            return sp.parlorId + "" == parlorId + ""
        })[0];
        if (p) count += p.revenue;
    });
    return count;
};

function calculateByParlorDept(services, parlorId) {
    var count = 0;
    _.forEach(services, function(s) {
        var p = _.filter(s.parlors, function(sp) {
            return sp.parlorId + "" == parlorId + ""
        })[0];
        if (p) count += p.count;
    });
    return count;
};

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
    // return month[d.getMonth()];
    // return month[d.getMonth()];
    // return d.getFullYear();
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
router.post('/login', function(req, res) {
    console.log('value is ,', JSON.stringify(req.body.password));
    var response = {};
    if (req.body.phoneNumber != undefined) {
        Beu.findOne({ phoneNumber: req.body.phoneNumber }, function(err, user) {
            // console.log(user);

            if (user != null) {
                if (user.password == req.body.password) {
                    console.log("entered");
                    if (user.parlorId != undefined) {

                        Parlor.findOne({ "_id": user.parlorId }, { "name": 1 }).exec(function(err, result) {
                            if (err) {
                                console.log(err)
                            }
                            // console.log(result);
                            if (result) {
                                console.log("first", result)
                                var m = [];
                                async.parallel([
                                    function(done) {
                                        async.each(user.parlorIds, function(employee, callback) {
                                            Parlor.findOne({ "_id": employee }, { "name": 1 }).exec(function(err, result) {
                                                console.log("2nd", result);
                                                if (result == null) {
                                                    callback();
                                                } else {
                                                    m.push({ parlorid: result._id, parlorName: result.name });
                                                    callback();
                                                }
                                            });
                                        }, done);
                                    }
                                ], function allTaskCompleted() {
                                    console.log(m)
                                    response.error = false;
                                    response.body = {
                                        fname: user.firstName,
                                        lname: user.lastName,
                                        phoneNumber: user.phoneNumber,
                                        uId: user._id,
                                        role: user.role,
                                        uType: 1,
                                        myProfilePic: user.myProfilePic,
                                        parlorIds: m
                                    };

                                    console.log("done");

                                    return res.json(response);
                                })

                            } else {
                                response.error = false;
                                response.body = {

                                    fname: user.firstName,
                                    lname: user.lastName,
                                    phoneNumber: user.phoneNumber,
                                    uId: user._id,
                                    role: user.role,
                                    myProfilePic: user.myProfilePic,
                                    uType: 1,
                                    parlorIds: [{
                                        parlorId: user.parlorId,
                                        parlorName: result.name
                                    }]
                                };
                                console.log("done");
                                return res.json(response);
                            }
                        });
                    } else {
                        response.error = false;
                        response.body = {
                            fname: user.firstName,
                            lname: user.lastName,
                            phoneNumber: user.phoneNumber,
                            uid: user._id,
                            role: user.role,
                            uType: 1,
                            parlorIds: user.parlorIds,
                            myProfilePic: user.myProfilePic,


                        };

                        return res.json(response);
                    }
                    // return res.json(response);


                } else {
                    response.message = "Invalid password";
                    response.error = true;
                    return res.json(response);
                }

            } else {
                Admin.findOne({ phoneNumber: req.body.phoneNumber }).exec(function(err, user) {
                    console.log(user);
                    var response = { error: true };
                    if (user) {
                        if (user.password == req.body.password) {
                            console.log("entered");

                            Parlor.findOne({ "_id": user.parlorId }, { "name": 1 }).exec(function(err, result) {
                                if (user.parlorIds.length > 0) {
                                    // res.json(user.parlorIds);
                                    var m = [];

                                    async.parallel([
                                        function(done) {
                                            async.each(user.parlorIds, function(employee, callback) {
                                                // console.log(employee);
                                                Parlor.findOne({ "_id": employee }, { "name": 1 }).exec(function(err, resultt) {
                                                    console.log('result', resultt);
                                                    if (resultt == null) {
                                                        callback();
                                                    } else {
                                                        m.push({ parlorid: resultt._id, parlorName: resultt.name });
                                                        callback();
                                                    }
                                                });
                                            }, done);
                                        }
                                    ], function allTaskCompleted() {

                                        response.body = {
                                            fname: user.firstName,
                                            lname: user.lastName,
                                            phoneNumber: user.phoneNumber,
                                            token: user.accessToken,
                                            uId: user._id,
                                            role: user.role,
                                            myProfilePic: user.myProfilePic,

                                            uType: 0,
                                            parlorIds: m
                                        };
                                        response.error = false;
                                        console.log("done1");
                                        return res.json(response);
                                    })

                                } else {
                                    response.body = {
                                        fname: user.firstName,
                                        lname: user.lastName,
                                        phoneNumber: user.phoneNumber,
                                        token: user.accessToken,
                                        uId: user._id,
                                        role: user.role,
                                        myProfilePic: user.myProfilePic,

                                        uType: 0,
                                        parlorIds: [{
                                            parlorId: user.parlorId,
                                            parlorName: result.name
                                        }]
                                    };
                                    console.log("done2");
                                    response.error = false;
                                    return res.json(response);
                                }
                            });

                            // return res.json(response);


                        } else {
                            response.message = "Invalid password";
                            response.error = true;
                            return res.json(response);
                        }
                    } else {
                        response.message = "Invalid username";
                        response.error = true;
                        return res.json(response);
                    }
                });
            }
        });
    } else {
        res.json(send(true, 2, ""));

    }

}); //done
router.post('/sendOtp', function(req, res) {


    console.log("calling")
    var phoneNumber = req.body.phoneNumber;
    var resetPassword = req.body.resetPassword;
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

                            Otp.findOne({ phoneNumber: phoneNumber, createdAt: { $gte: HelperService.get5minBefore() } }).sort({ createdAt: -1 }).exec(function(err, oldOtp) {
                                var otp = Math.floor(Math.random() * 9000) + 1000;

                                if (oldOtp) {
                                    otp = oldOtp.otp
                                }
                                if (phoneNumber == "8826345311") otp = 1234;
                                var message = Otp.getMessage(otp);
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


                                    // http.get(url, function (res2) {
                                    //     res2.on("data", function (chunk) {
                                    //         response = chunk;
                                    //     });
                                    //     res2.on("end", function () {
                                    //         if (resetPassword == 1) {
                                    //             Beu.update({phoneNumber: phoneNumber}, {
                                    //                 password: '',
                                    //                 accesstoken: '',
                                    //                 phoneVerification: 0
                                    //             }, function (err, u) {
                                    //                 return res.json(CreateObjService.response(false, 'Otp has been sent to your number'));
                                    //             });
                                    //         } else
                                    //             return res.json(CreateObjService.response(false, 'Otp has been sent to your number'));
                                    //     });
                                    // }).on('error', function (e) {
                                    //     return res.json(CreateObjService.response(true, 'Error in sending sms'));
                                    // });
                                });
                            });
                        } else {
                            Admin.findOne({ phoneNumber: req.body.phoneNumber }, function(err, user) {
                                console.log(user)
                                if (user) {
                                    var otp = Math.floor(Math.random() * 9000) + 1000;
                                    var message = Otp.getMessage(otp);
                                    Otp.create({
                                        used: 0,
                                        otp: otp,
                                        userId: user.id,
                                        phoneNumber: phoneNumber,
                                        message: message
                                    }, function(err, newOtp) {
                                        var url = "https://control.msg91.com/api/sendotp.php?authkey=164034A93iTmJcMu595dd01d&mobile=91" + phoneNumber + "&message=" + message + "&otp=" + otp;
                                        request(url, function(error, response, body) {
                                            if (error == null) {
                                                return res.json(CreateObjService.response(false, 'Otp has been sent to your number'));
                                            } else {
                                                return res.json(CreateObjService.response(true, 'Error in sending sms'));
                                            }
                                        });
                                    });
                                } else {
                                    return res.json(CreateObjService.response(true, 'User not registered'));
                                }
                            })
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
        var url = "https://control.msg91.com/api/retryotp.php?authkey=164034A93iTmJcMu595dd01d&mobile=91" + phoneNumber + "&retrytype=text&sender=BEUSLN";

    } else {
        var url = "https://control.msg91.com/api/retryotp.php?authkey=164034A93iTmJcMu595dd01d&mobile=91" + phoneNumber + "&retrytype=voice&sender=BEUSLN";
    }
    request(url, function(error, response, body) {
        if (error == null) {
            return res.json(CreateObjService.response(false, 'Otp has been sent to your number'));

        } else {
            return res.json(CreateObjService.response(true, 'Error in sending sms'));
        }
    });


})
router.post('/verifyOtp1', function(req, res) {
    var phoneNumber = req.body.phoneNumber;
    Otp.find({
        phoneNumber: phoneNumber,
        otp: req.body.otp,
        used: 0,
        createdAt: { $gt: HelperService.get5minBefore() }
    }, function(err, otps) {
        if (otps.length > 0) {
            Otp.update({ phoneNumber: phoneNumber, used: 0 }, { used: 1, verifiedAt: new Date() }, function(err, update) {
                var accessToken = require('crypto').createHash('sha1').update('sadd%^^^^sdasdsd3423F$TTTGGasd' + (new Date()).valueOf().toString()).digest('hex');
                var updateObj = { phoneVerification: 1, accesstoken: accessToken, messageSent: 1 };
                if (req.body.newPassword != 0) updateObj.password = req.body.newPassword;
                Beu.findOne({ phoneNumber: phoneNumber }, function(err, user1) {
                    var mobile = 0;
                    if (user1.mobile && !user1.messageSent) mobile = 1;
                    getSocialDetails(req.body.socialLoginType, req.body.accessToken, function(userData) {
                        if (userData) {
                            updateObj.name = userData.name;
                            updateObj.gender = req.body.socialLoginType == 1 ? userData.gender : req.body.gender;
                            updateObj.emailId = userData.emailId;
                            updateObj.profilePic = userData.profilePic;
                            if (req.body.socialLoginType == 2)
                                updateObj.googleId = userData.id;
                            else
                                updateObj.facebookId = userData.id;
                            updateObj.password = req.body.accessToken.substring(0, 10);
                        }
                        Beu.update({ phoneNumber: phoneNumber }, updateObj, function(err, u) {
                            Beu.findOne({ phoneNumber: phoneNumber }, function(err, user) {
                                var usermessage = getUserRegistrationUrl(user.firstName, user.phoneNumber, user.freeServices, mobile);
                                if (mobile) {
                                    Appointment.sendSMS(usermessage, function(e) {

                                    });
                                }
                                return res.json(CreateObjService.response(false, User.getUserObjApp(user)));
                            });
                        });

                    });

                });
            });
        } else {
            return res.json(CreateObjService.response(true, 'Invalid otp'));
        }
    });
});
router.post('/verifyOtp', function(req, res) {
    var phoneNumber = req.body.phoneNumber;
    var response = {}
        // res.json({p:phoneNumber,o:req.body.otp});
    Otp.find({
        phoneNumber: phoneNumber,
        otp: req.body.otp,
        used: 0,
        createdAt: { $gt: HelperService.get5minBefore() }
    }, function(err, otps) {
        if (otps.length > 0) {
            Otp.update({ phoneNumber: phoneNumber, used: 0 }, { used: 1, verifiedAt: new Date() }, function(err, update) {
                var accessToken = require('crypto').createHash('sha1').update('sadd%^^^^sdasdsd3423F$TTTGGasd' + (new Date()).valueOf().toString()).digest('hex');
                var updateObj = { phoneVerification: 1, accesstoken: accessToken, messageSent: 1 };
                Beu.findOne({ phoneNumber: phoneNumber }, function(err, user) {
                    if (err) {
                        res.json(err)
                    }
                    if (user) {
                        // var response={}
                        Parlor.find({}, { "_id": 1 }).exec(function(err, result2) {
                            //     if (err) {
                            //         console.log(err)
                            //     }
                            // console.log(result);
                            if (result2.length > 0) {
                                // console.log("first",result)
                                var m = [];
                                async.parallel([
                                    function(done) {
                                        async.each(result2, function(employee, callback) {
                                            Parlor.findOne({ "_id": employee }, { "name": 1 }).exec(function(err, result) {
                                                console.log("2nd", result);
                                                if (result == null) {
                                                    callback();
                                                } else {
                                                    m.push({ parlorid: result._id, parlorName: result.name });
                                                    callback();
                                                }
                                            });
                                        }, done);
                                    }
                                ], function allTaskCompleted() {
                                    console.log(m)
                                    response.error = false;
                                    response.body = {
                                        fname: user.firstName,
                                        lname: user.lastName,
                                        phoneNumber: user.phoneNumber,
                                        uId: user._id,
                                        role: user.role,
                                        myProfilePic: user.myProfilePic,

                                        uType: 1,
                                        parlorIds: m
                                    };

                                    console.log(response);

                                    return res.json(response);
                                })

                            } else {

                                Parlor.findOne({ "_id": user.parlorId }, { "name": 1 }).exec(function(err, result) {

                                    response.error = false;
                                    response.body = {

                                        fname: user.firstName,
                                        lname: user.lastName,
                                        phoneNumber: user.phoneNumber,
                                        uId: user._id,
                                        role: user.role,
                                        myProfilePic: user.myProfilePic,

                                        uType: 1,
                                        parlorIds: [{
                                            parlorid: result._id,
                                            parlorName: result.name
                                        }]
                                    };
                                    console.log(response);
                                    return res.json(response);
                                })
                            }
                        });


                    } else {
                        Admin.findOne({ phoneNumber: phoneNumber }, function(err, user) {


                            console.log(req.body);

                            Admin.update({ _id: user._id }, { $set: { macAddress: req.body.macAddress } }, function(err, result) {
                                //     if (err) {
                                //         console.log(err)
                                //     }
                                // console.log(result);
                                if (user.parlorIds.length > 0) {
                                    // console.log("ids",user.parlorIds)

                                    var m = [];

                                    async.parallel([
                                        function(done) {
                                            async.each(user.parlorIds, function(employee, callback) {
                                                console.log(employee);
                                                Parlor.findOne({ "_id": employee }, { "name": 1 }).exec(function(err, result) {

                                                    console.log("2nd", result);
                                                    if (result == null) {
                                                        callback();
                                                    } else {
                                                        m.push({ parlorid: result._id, parlorName: result.name });
                                                        callback();
                                                    }
                                                });
                                            }, done);
                                        }
                                    ], function allTaskCompleted() {
                                        console.log(m)
                                        response.error = false;
                                        response.body = {
                                            fname: user.firstName,
                                            lname: user.lastName,
                                            phoneNumber: user.phoneNumber,
                                            uId: user._id,
                                            myProfilePic: user.myProfilePic,

                                            role: user.role,
                                            uType: 0,
                                            parlorIds: m
                                        };

                                        console.log("done");

                                        return res.json(response);
                                    })

                                } else {

                                    Parlor.findOne({ "_id": user.parlorId }, { "name": 1 }).exec(function(err, result) {
                                        if (err) {
                                            res.json(send(true, 1, ""))
                                        }
                                        response.error = false;
                                        response.body = {

                                            fname: user.firstName,
                                            lname: user.lastName,
                                            phoneNumber: user.phoneNumber,
                                            uId: user._id,
                                            role: user.role,
                                            myProfilePic: user.myProfilePic,

                                            uType: 0,
                                            parlorIds: [{
                                                parlorid: result._id,
                                                parlorName: result.name
                                            }]
                                        };
                                        console.log("done");
                                        return res.json(response);

                                    })
                                }
                            });
                        })
                    }

                });
            });
        } else {
            return res.json({ error: true, message: 'Invalid Otp' });
        }
    });
});
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
            //user = User.parse(user, req.session.parlorId);
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
                // res.json(appointments);
                var data = _.map(appointments, function(appointment) {
                    // console.log(appointment.allPaymentMethods.length)
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

                // response.appointments=data;
                res.json(send(false, 0, response));
                // return res.json(CreateObjService.response(false, data));
            });
        } else {
            res.json(send(true, 1, ""));
        }
    });


}); //done
router.post('/emp', function(req, res) {
    console.log(req.body)

    Admin.findOne({ _id: req.body.userId }, { role: 1, parlorId: 1, parlorIds: 1 }, function(err, adminRole) {
        console.log("===============================", req.body);
        // 587088445c63a33c0af62727
        var uid = req.body.pId;
        var eid = req.body.eId;
        var query = { "parlorId": uid, active: true };

        var td = new Date();
        console.log(HelperService.getDayStart(td));
        console.log(HelperService.getDayEnd(td));

        console.log(adminRole)
        if (adminRole) {
            if (adminRole.role == 2) {
                var query = { "parlorId": adminRole.parlorId, active: true };
            } else if (adminRole.role == 8) {
                var query = { "parlorId": adminRole.parlorId, active: true, role: { $ne: 2 } };
            } else if (adminRole.role == 9) {
                var query = { "parlorId": adminRole.parlorId, active: true, $and: [{ "role": { "$ne": 8 } }, { role: { $ne: 2 } }] };
            } else {
                if (adminRole.parlorIds.length > 0) {
                    var query = { "parlorId": { $in: adminRole.parlorIds }, active: true };
                } else {
                    var query = { "parlorId": adminRole.parlorId, active: true };
                }
            }
        }
        if (eid) query = { _id: eid };
        console.log("myn qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq", JSON.stringify(query))
        var final = {};
        var arr = [];
        if (uid || eid) {
            var f_data = [];
            Admin.find(query).exec(function(err, data) {
                console.log("----------", data)
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
                                            // console.log(resulttt)
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
                                                bookedcount: bookedcount,
                                                role: employee.role
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
    })
}); //done
router.post('/emp/appointments', function(req, res) {
    var response = {};


    var t = new Date();
    var monthh = req.body.month ? req.body.month : t.getMonth();
    var yearr = req.body.year ? req.body.year : t.getFullYear();

    var startDate = HelperService.getFirstDateOfMonth(yearr, monthh);
    var endDate = HelperService.getLastDateOfMonth(yearr, monthh);

    var td = new Date();
    console.log(HelperService.getDayStart(td));
    console.log(HelperService.getDayEnd(td));
    // .skip(10*page)
    var page = req.body.page ? req.body.page : 0;
    var eid = req.body.eId;
    // ,"appointmentStartTime":{$gte:HelperService.getDayStart(td),$lt:HelperService.getDayEnd(td)}
    // {"employees.employeeId":employee._id,"appointmentStartTime":{$gte:HelperService.getDayStart(td),$lt:HelperService.getDayEnd(td)}}
    Appointment.find({ status: 3, "employees.employeeId": eid }).count(function(err, count) {
        response.count = count;
        var totalPage = Math.ceil(count / 5);
        response.totalPage = totalPage;
        Appointment.find({
            status: 3,
            "employees.employeeId": eid,
            "services.employees.employeeId": eid
        }).limit(5).skip(5 * page).sort({ appointmentStartTime: -1 }).exec(function(err, result) {
            // var pageValue = 0;
            if (result.length > 0) {
                // if (result.length > 4) {
                //     pageValue = 1;
                // }
                var n = 0;
                var data_1 = Appointment.parseArray(result);


                // res.json(result);
                // result[n]._id
                var data = _.map(data_1, function(f) {

                    var totalR = 0;
                    return {
                        "appointmentId": f.appointmentId,
                        "customerName": f.client.name,
                        "services": _.map(f.services, function(d) {
                            totalR = totalR + Appointment.serviceFunction(f.createdAt, d, [{
                                "employeeId": eid,
                                "totalRevenueEmp": 0
                            }]).employees[0].totalRevenueEmp;
                            return {
                                "name": d.name,
                                "revenue": Appointment.serviceFunction(f.createdAt, d, [{
                                    "employeeId": eid,
                                    "totalRevenueEmp": 0
                                }]).employees[0].totalRevenueEmp
                            }
                        }),
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


                console.log("data", data)

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


}); //done
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

    console.log(d_date);

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
        if (data.length > 0) {
            data = _.map(data, function(d) {
                return {
                    value: d.period,
                    date: new Date(d.startDate.getTime() + 1000 * 60 * 5).toString().slice(0, 10) + " - " + d.endDate.toString().slice(0, 10)
                };
            })



            // console.log(ConstantService.periods());


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
            console.log(pd);

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

                    // response.
                    data1.servicesRevenue = {
                        "serviceRevenue": result.serviceRevenue,
                        "productRevenue": result.productRevenue,
                        "totalRevenue": result.totalRevenue,

                    };
                    // response.
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

        }

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
    console.log(sdate);
    var edate = HelperService.getDayEnd(date);
    console.log(edate);
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

                            Admin.find({ _id: emp }).exec(function(err, result) {

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
            console.log("done")
        });

    });

    // });


});



router.post('/incentiveModel', function(req, res) {
    console.log(req.body)
    Admin.findOne({ _id: req.body.uId }, { _id: 1, parlorId: 1, role: 1, parlorIds: 1 }, function(err, dat) {
        Admin.findOne({ _id: req.body.eId }, { _id: 1, parlorId: 1, role: 1, parlorIds: 1, firstName: 1 }, function(err, dat1) {
            var dat2 = {};
            if (dat) {
                dat2 = dat

                var salonParlorId = (dat.parlorIds.length > 0) ? dat.parlorIds[0] : dat.parlorId;
            }
            if (dat == null) {
                dat2.role = 2
            }

            console.log("dat1", dat1)

            console.log(dat2)


            Admin.find({ $or: [{ parlorIds: { $in: [dat1.parlorId] } }, { parlorId: dat1.parlorId }], active: true }, function(err, totalEmployees) {

                Parlor.findOne({ _id: dat1.parlorId }, { _id: 1, parlorType: 1, L1: 1, L2: 1, L3: 1 }, function(err, parlor) {

                    Incentive.findOne({ parlorId: parlor._id }).exec(function(err, incentives) {

                        SalonManagerIncentive.find({}, function(err, salonIncentive) {

                            var t = new Date();
                            var incentive = [];
                            _.forEach(incentives.categories, function(inc) {

                                // var incentiveData = _.filter(inc.parlors, function(s) {
                                //     return s.parlorType == parlor.parlorType
                                // })

                                incentive.push({
                                    name: inc.categoryName,
                                    incentive: inc.incentives,
                                    categoryId: inc.categoryId
                                });
                            });
                            var d = [];
                            var details = [];
                            var data = {};
                            var final = [];
                            var asyncArray = [];
                            var allEmployeesRevenue = 0;

                            var monthh = req.body.month != null ? req.body.month : t.getMonth();
                            var yearr = req.body.year != null ? req.body.year : t.getFullYear();
                            console.log("req.body.month", monthh)
                            console.log("req.body.year", yearr)
                            var startDate = HelperService.getFirstDateOfMonth(yearr, monthh);
                            var endDate = HelperService.getLastDateOfMonth(yearr, monthh);
                            var eid = req.body.eId;
                            var ttoday = new Date();
                            var day = ttoday.getDate();
                            var y = ttoday.getFullYear()
                            var m = ttoday.getMonth() + 1;

                            Admin.find({ _id: eid }).exec(function(err, employees) {

                                async.parallel([
                                    function(done) {
                                        async.each(totalEmployees, function(tE, callback) {
                                            Appointment.employeeIncentiveReport(tE, startDate, endDate, function(err, data2) {
                                                // console.log("---------------------------------", data2)
                                                asyncArray.push(data2.totalRevenueEmp)
                                                callback();
                                            })
                                        }, done);
                                    }
                                ], function allTaskCompleted() {

                                    _.forEach(asyncArray, function(dRevenue) { allEmployeesRevenue += dRevenue });

                                    // _.forEach(mainRoles , function(mR){
                                    var managerIncentiveModel = [];
                                    _.forEach(salonIncentive, function(ss) {
                                        if (ss.parlorType == parlor.parlorType) {
                                            _.forEach(ss.levels, function(lev) {
                                                _.forEach(lev.incentives, function(inc) {
                                                    if (inc.role == dat1.role) {
                                                        var arr = {};
                                                        if (lev.level == "L1") {
                                                            arr.range = parlor.L1;
                                                            arr.incentive = inc.incentive;
                                                            managerIncentiveModel.push(arr)
                                                        }
                                                        if (lev.level == "L2") {
                                                            arr.range = parlor.L2;
                                                            arr.incentive = inc.incentive;
                                                            managerIncentiveModel.push(arr)
                                                        }
                                                        if (lev.level == "L3") {
                                                            arr.range = parlor.L3;
                                                            arr.incentive = inc.incentive;
                                                            managerIncentiveModel.push(arr)
                                                        }
                                                    }
                                                });
                                            });
                                        }
                                    });
                                    console.log("managerIncentiveModel", managerIncentiveModel)
                                    var nameType = "";
                                    if (dat1.role == 2) { nameType = dat1.firstName + " (Salon Manager)" };
                                    if (dat1.role == 8) { nameType = dat1.firstName + " (Salon Head)" };
                                    if (dat1.role == 9) { nameType = dat1.firstName + " (Assistant Manager)" };
                                    _.forEach(salonIncentive, function(sal) {
                                        if (sal.parlorType == parlor.parlorType) {
                                            _.forEach(sal.levels, function(lev) {
                                                _.forEach(lev.incentives, function(inc) {
                                                    var dif = {};
                                                    dif.target = 0;
                                                    dif.incentive = inc.incentive;
                                                    if (inc.role == dat1.role) {
                                                        if (allEmployeesRevenue >= parlor.L3 && lev.level == "L3") {
                                                            dif.incentive = 0;

                                                            if (monthh == ttoday.getMonth()) {
                                                                var p = (dif.target / (daysInMonth(m, y) - day)).toFixed(1)
                                                            } else {
                                                                var p = 0;
                                                            }
                                                            final.push({
                                                                type: nameType,
                                                                incentiveModel: managerIncentiveModel,
                                                                totalRevenue: allEmployeesRevenue,
                                                                totalIncentive: allEmployeesRevenue * (inc.incentive) / 100,
                                                                diff: dif,
                                                                runRate: p
                                                            });
                                                        }
                                                        if (allEmployeesRevenue < parlor.L3 && allEmployeesRevenue >= parlor.L2 && lev.level == "L2") {
                                                            // var dif = {};
                                                            dif.target = (parlor.L3 - allEmployeesRevenue);;

                                                            if (monthh == ttoday.getMonth()) {
                                                                var p = (dif.target / (daysInMonth(m, y) - day)).toFixed(1)
                                                            } else {
                                                                var p = 0;
                                                            }
                                                            final.push({
                                                                type: nameType,
                                                                incentiveModel: managerIncentiveModel,
                                                                totalRevenue: allEmployeesRevenue,
                                                                totalIncentive: allEmployeesRevenue * (inc.incentive) / 100,
                                                                diff: dif,
                                                                runRate: p
                                                            });
                                                        }
                                                        if (allEmployeesRevenue < parlor.L2 && allEmployeesRevenue >= parlor.L1 && lev.level == "L1") {
                                                            // var dif = {};
                                                            dif.target = (parlor.L2 - allEmployeesRevenue);

                                                            if (monthh == ttoday.getMonth()) {
                                                                var p = (dif.target / (daysInMonth(m, y) - day)).toFixed(1)
                                                            } else {
                                                                var p = 0;
                                                            }
                                                            final.push({
                                                                type: nameType,
                                                                incentiveModel: managerIncentiveModel,
                                                                totalRevenue: allEmployeesRevenue,
                                                                totalIncentive: allEmployeesRevenue * (inc.incentive) / 100,
                                                                diff: dif,
                                                                runRate: p
                                                            });
                                                        }
                                                        if (allEmployeesRevenue < parlor.L1 && lev.level == "L1") {
                                                            // var dif = {};
                                                            dif.target = (parlor.L1 - allEmployeesRevenue);

                                                            if (monthh == ttoday.getMonth()) {
                                                                var p = (dif.target / (daysInMonth(m, y) - day)).toFixed(1)
                                                            } else {
                                                                var p = 0;
                                                            }
                                                            final.push({
                                                                type: nameType,
                                                                incentiveModel: managerIncentiveModel,
                                                                totalRevenue: allEmployeesRevenue,
                                                                totalIncentive: 0,
                                                                diff: dif,
                                                                runRate: p
                                                            });
                                                        }
                                                    }
                                                })
                                            })
                                        }
                                    });
                                    // })
                                    // console.log("employees[0]", employees[0])
                                    console.log("startDate", startDate)
                                    console.log("endDate", endDate)
                                    Appointment.employeeIncentiveReport(employees[0], startDate, endDate, function(err, data) {
                                        console.log("dataaaaaaaaaaaaaa", data)
                                        for (var j = 0; j < data.dep.length; j++) {

                                            for (var k = 0; k < incentive.length; k++) {
                                                if (incentive[k].categoryId == data.dep[j].unitId) {
                                                    for (var m = 0; m < incentive[k].incentive.length; m++) {

                                                        if (incentive[k].incentive[m].range >= data.dep[j].totalRevenue) {
                                                            console.log('range', incentive[k].incentive[m].range);
                                                            // console.log('rev', data.dep[j].totalRevenueEmp);
                                                            var dif = {};
                                                            dif.target = (incentive[k].incentive[m].range - data.dep[j].totalRevenue);
                                                            dif.incentive = incentive[k].incentive[m].incentive;
                                                            console.log(dif);
                                                            break;
                                                        }
                                                    }

                                                    var ttoday = new Date();
                                                    var day = ttoday.getDate();
                                                    var y = ttoday.getFullYear()
                                                    var m = ttoday.getMonth() + 1;;

                                                    if (monthh == ttoday.getMonth()) {
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
                                            if (dat1.role == 2 || dat1.role == 8 || dat1.role == 9) {
                                                console.log(f)
                                                totalIncentive = f.totalIncentive
                                            } else {
                                                totalIncentive += f.totalIncentive
                                            }
                                        })

                                        var dataa = {
                                            employeeId: data.employeeId,
                                            name: data.name,
                                            totalRevenueEmp: data.totalRevenueEmp,
                                            totalAllEmpRevenue: allEmployeesRevenue,
                                            empSalary: data.empSalary,
                                            parlorName: data.parlorName,
                                            parlorAddress: data.parlorAddress,
                                            totalAppointments: data.totalAppointments,
                                            totalProductRevenueEmp: data.totalProductRevenueEmp,
                                            position: data.position,
                                            details: final,
                                            totalIncentive: totalIncentive

                                        };

                                        res.json(send(false, 0, [dataa]));
                                    });
                                })
                            });
                        });
                    })

                });
            })
        })
    })
});


// router.post('/incentiveModel', function (req, res) {

//     Admin.findOne({_id:req.body.eId},{_id : 1, parlorId : 1}, function(err, dat){
//         Parlor.findOne({_id:dat.parlorId},{_id : 1, parlorType : 1}, function(err, parlor) {

//             console.log("ppppppppppppppppppppp", parlor.parlorType)
//             Incentive.find({}).sort({sort: 1}).exec(function (err, incentives) {

//                 // var r="";


//                 // getFirstDateOfMonth:function(y,m){
//                 //     return new Date(y,parseInt(m),1);
//                 // },
//                 // getLastDateOfMonth:function(y,m){
//                 //     return new Date(y,parseInt(m)+1,0);
//                 // },

//                 var t = new Date();


//                 // res.json(incentives)

//                 var incentive = [];
//                 _.forEach(incentives, function (inc) {

//                     var incentiveData = _.filter(inc.parlors, function (s) {
//                         return s.parlorType == parlor.parlorType
//                     })
//                     console.log("Incentives",incentiveData[0])

//                     incentive.push(
//                         {
//                             name: inc.name,
//                             incentive: incentiveData[0].incentives,
//                             categoryId: inc.categoryId
//                         }
//                     );
//                 });
//                 var d = [];
//                 var details = [];
//                 var data = {};
//                 var final = [];
//                 // = req.body.startDate ? req.body.startDate:new Date(2017, 0, 1, 23, 59, 59);
//                 // req.body.endDate ? req.body.endDate:new Date(2017, 1, 22, 23, 59, 59);

//                 var monthh = req.body.month ? req.body.month : t.getMonth();
//                 var yearr = req.body.year ? req.body.year : t.getFullYear();

//                 var startDate = HelperService.getFirstDateOfMonth(yearr, monthh);
//                 var endDate = HelperService.getLastDateOfMonth(yearr, monthh);
//                 var eid = req.body.eId;
//                 // console.log(eid);
//                 // res.json(incentive)

//                 // console.log(incentive);
//                 Admin.find({_id: eid}).exec(function (err, employees) {
//                     console.log(employees);
//                     Appointment.employeeIncentiveReport(employees[0], startDate, endDate, function (err, data) {
//                         // d.push(data);
//                         // console.log("getting data success for " + JSON.stringify(data));
//                         // res.json(data);
//                         //
//                         for (var j = 0; j < data.dep.length; j++) {
//                             //     //
//                             for (var k = 0; k < incentive.length; k++) {
//                                 if (incentive[k].categoryId == data.dep[j].unitId) {
//                                     for (var m = 0; m < incentive[k].incentive.length; m++) {

//                                         if (incentive[k].incentive[m].range >= data.dep[j].totalRevenue) {
//                                             console.log('range', incentive[k].incentive[m].range);
//                                             // console.log('rev', data.dep[j].totalRevenueEmp);
//                                             var dif = {};
//                                             dif.target = (incentive[k].incentive[m].range - data.dep[j].totalRevenue);
//                                             dif.incentive = incentive[k].incentive[m].incentive;
//                                             console.log(dif);
//                                             break;
//                                         }
//                                     }


//                                     var ttoday = new Date();
//                                     var day = ttoday.getDate();
//                                     var y = ttoday.getFullYear()
//                                     var m = ttoday.getMonth() + 1;
//                                     ;

//                                     if (monthh == ttoday.getMonth()) {
//                                         var p = (dif.target / (daysInMonth(m, y) - day)).toFixed(1)
//                                     } else {
//                                         var p = 0;
//                                     }

//                                     if (data.dep[j].totalRevenue == 0) {
//                                         console.log("skip")
//                                     } else {

//                                         if (isFinite(p) === true) {
//                                             final.push({
//                                                 type: data.dep[j].unit,
//                                                 incentiveModel: incentive[k].incentive,
//                                                 totalRevenue: data.dep[j].totalRevenue,
//                                                 totalIncentive: data.dep[j].totalIncentive,
//                                                 diff: dif,
//                                                 runRate: p
//                                             });

//                                         } else {
//                                             final.push({
//                                                 type: data.dep[j].unit,
//                                                 incentiveModel: incentive[k].incentive,
//                                                 totalRevenue: data.dep[j].totalRevenue,
//                                                 totalIncentive: data.dep[j].totalIncentive,
//                                                 diff: dif,
//                                                 runRate: (dif.target / 1).toFixed(1)

//                                             });

//                                         }


//                                     }
//                                 }
//                             }
//                         }


//                         // res.json(final);
//                           var totalIncentive=0;
//                           _.forEach(final,function(f){

//                             totalIncentive+=f.totalIncentive
//                           })

//                         var dataa = {
//                             employeeId: data.employeeId,
//                             name: data.name,
//                             totalRevenueEmp: data.totalRevenueEmp,
//                             empSalary: data.empSalary,
//                             parlorName: data.parlorName,
//                             parlorAddress: data.parlorAddress,
//                             totalAppointments: data.totalAppointments,
//                             totalProductRevenueEmp: data.totalProductRevenueEmp,
//                             position: data.position,
//                             details: final,
//                             totalIncentive:totalIncentive

//                         };

//                         res.json(send(false, 0, [dataa]));


//                     });
//                 });


//             });
//         })
//     });
// }); //done

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
    query = { _id: pid };
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




    // console.log(req.body)
    // console.log(req.body)
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
        // return res.json(data)

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


        console.log("all dates", dates.body.startDate.toString());
        console.log("all dates", dates.body.endDate.toString());

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
    var query = { active: true };
    query = { _id: { $in: parlorIds }, active: true };
    if (parlorIds.length == 0) query = { active: true };
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
    if (parlorIds.length == 0) query = { parlorId: { $ne: null } };
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
    Admin.find({ role: 2 }).populate('parlorId').exec(function(err, managers) {
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
        Admin.find({ role: 7 }, function(err, owners) {
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
    var query = { parlorId: { $in: parlorIds } };
    if (parlorIds.length == 0) query = { parlorId: { $ne: null } };
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
                        if (isFinite((f.totalRevenue / f.salary)) == true) {
                            z = (f.totalRevenue / f.salary).toFixed(1)
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

            if (data) {


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

            }



            Appointment.aggregate([

                { $match: { parlorId: ObjectId(pid), status: 3, appointmentStartTime: { $gte: sdate, $lte: edate } } },
                { $group: { _id: "$client.id", count: { $sum: 1 } } },
                { $match: { count: { $gt: 1 } } },
                { $group: { _id: null, count: { $sum: 1 } } }
            ], function(err, repeated) {

                var qu = [{ $match: { parlorId: ObjectId(pid), appointmentType: 3, status: 3 } },
                    { $group: { _id: null, amount: { $sum: "$serviceRevenue" }, count: { $sum: 1 } } },
                    { $project: { avgBillApp: { $divide: ["$amount", "$count"] } } }
                ];
                console.log(JSON.stringify(qu))
                Appointment.aggregate(qu, function(err, top) {
                    var rep = 0
                    if (repeated.length > 0) {
                        rep = repeated[0].count
                    }
                    var dCount = 0
                    var dRevenue = 0
                    if (data) {
                        dCount = data.count;
                        dRevenue = data.revenue
                    }
                    datas.totalAppointments = dCount;
                    datas.totalRevenue = dRevenue;
                    datas.totalNoServices = services;
                    datas.repeated = rep;
                    datas.customers[0].number = newClient;
                    datas.customers[1].number = oldClient;
                    datas.averageBillValueThroughApp = top[0].avgBillApp
                    res.json(datas)


                })

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
    Admin.find({ parlorId: pId }, { firstName: 1, lastName: 1 }).exec(function(err, result) {

        res.json(CreateObjService.response(false, result))


    })


})


router.post('/postLuckyDraw', function(req, res) {

})


router.post('/sendNotification', function(req, res) {

    var resp = [];

    Admin.find({ firebaseId: { $exists: true } }, { firebaseId: 1 }, function(err, result) {

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
    query.active = true
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

router.post('/createParlorModelDraw', function(req, res) {

    async.each(req.body.parlorIds, function(parlor, cb) {


        var data = req.body.data;
        data.parlorId = ObjectId(parlor);

        console.log(data)
        LuckyDrawModel.createNew(data, function(err, response) {
            if (err) {
                // console.log(err)
                cb();
            } else {
                cb();
            }
        })

    }, function(done) {
        res.json(CreateObjService.response(false, "done"))
    })
})

router.post('/editParlorModelDraw', function(req, res) {

    LuckyDrawModel.editModel(req, function(err, response) {
        if (err) {
            res.json(CreateObjService.response(true, response))
        } else {
            res.json(CreateObjService.response(false, response))
        }
    })
})

router.post('/getParlorModelDraw', function(req, res) {

    LuckyDrawModel.findOne({ parlorId: req.body.parlorId }, function(err, response) {
        if (err) {
            res.json(CreateObjService.response(true, response))
        } else {
            res.json(CreateObjService.response(false, response))
        }
    })
})


router.get('/getMyDraw', function(req, res) {
    console.log(req.query.employeeId)

    LuckyDrawDynamic.find({ employeeId: req.query.employeeId }, function(err, response) {

        if (err) {
            res.json(CreateObjService.response(true, err))
        } else {

            var sendData = _.map(response, function(r) {

                return {
                    _id: r._id,
                    employeeId: r.employeeId,
                    parlorId: r.parlorId,
                    appointmentId: r.appointmentId,
                    categoryId: r.categoryId,
                    clientName: r.clientName,
                    billAmount: Math.ceil(r.billAmount),
                    amount: r.amount,
                    reason: r.reason,
                    stringToPrint: r.stringToPrintEmployee,
                    status: r.status,
                    paid: r.paid,
                    createdAt: r.createdAt,
                    updatedAt: r.updatedAt
                }


            })

            res.json(CreateObjService.response(false, sendData))
        }


    }).sort({ $natural: -1 })


})

router.get('/getSalonDraw', function(req, res) {
    console.log(req.query.parlorId)

    LuckyDrawDynamic.find({ parlorId: req.query.parlorId }, function(err, response) {
        console.log(response)
        if (err) {
            console.log(err)
            res.json(CreateObjService.response(true, err))
        } else {



            var sendData = _.groupBy(response, function(s, key) {

                return s.appointmentId

            })

            var finalData = [];

            for (var key in sendData) {

                var data2 = _.groupBy(sendData[key], function(s) {
                    return s.categoryId
                })

                for (var key2 in data2) {
                    var names = ''
                    var ids = ''
                    _.forEach(data2[key2], function(d) {

                        names += "" + d.employeeName + ","
                        ids += "" + d._id + ","
                    })
                    var d = {
                        "_id": ids,
                        "createdAt": data2[key2][0].createdAt,
                        "updatedAt": data2[key2][0].updatedAt,
                        "employeeName": names,
                        "clientName": data2[key2][0].clientName,
                        "billAmount": data2[key2][0].billAmount,
                        "parlorId": data2[key2][0].parlorId,
                        "appointmentId": data2[key2][0].appointmentId,
                        "categoryId": data2[key2][0].categoryId,
                        "amount": data2[key2][0].amount,
                        "reason": data2[key2][0].reason,
                        "stringToPrint": data2[key2][0].stringToPrintSalon,
                        "status": data2[key2][0].status,
                    }

                    finalData.push(d)
                }


            }
            //             var finaldata2=[]

            // for()
            // for(var key in finalData){

            //     finaldata2.push(finalData[key])

            // }

            res.json(CreateObjService.response(false, finalData))
        }
    }).sort({ $natural: -1 })

    // })



})




router.get('/editMyDraw', function(req, res) {

    LuckyDrawDynamic.findOne({ _id: req.query.id }, function(err, d) {

        if (err) {
            res.json(CreateObjService.response(true, err))

        } else {

            var datee = new Date(d.createdAt)
            console.log(datee)
            var time = 24 - ((Math.abs(datee - new Date())) / 36e5);
            console.log((Math.abs(datee - new Date())) / 36e5)
            if (time >= 0) {
                LuckyDrawDynamic.update({ _id: req.query.id }, { status: 0 }, function(err, response) {

                    if (err) {
                        console.log(err)
                        res.json(CreateObjService.response(true, err))
                    } else {
                        console.log(response)
                        res.json(CreateObjService.response(false, response))
                    }


                })
            } else {
                res.json(CreateObjService.response(true, ""))
            }
        }


    })

})






router.get('/getDrawRules', function(req, res) {

    var rule1 = "<div>" +

        "<span style='font-size:200%;color:blue'> <b>Winner has to claim the prize within <b>24</b> hours of winning</b></span>" +
        "<p>Each employee of the salon to get notification whenever anyone wins from their salon</p>" +
        "<p>Incentives to be transferred every alternate day to employee bank accounts (employees with wrong or no account to not get incentives)</p>"
    var rule4 = "<p> Win <b>Rs 500</b> for Shared Bill Ratio <br>" +
        "<b>Try to involve more employees on your bill to win. In 1 bill, Employee with higher number of other employees can win.</b>" + "</p>" + "<p>Win Rs 200 for Best Rated Employee by Be U.<br>" +
        "Rating will be given <b>Be U Trainers/Ops</b> Team based on your performance."

    var rule2 = "<h3 style:'color:blue'><b>Check Targets:</b> Employee App -> Employees -> Select Your Name - >List of call targets in each category.</h3>" +

        "<p> 1.Win <b>Rs 25</b> for achieving L1 target for any category<br>" +
        "<b>When you achieve your incentive target Level 1 (L1) of your category, you can win addition Rs 25.</b></p>" +

        "<p> 2.Win <b>Rs 50</b> for achieving L2 target for any category<br>" +
        "<b>When you achieve your incentive target Level 2 (L2) of your category, you can win addition Rs 50.</b></p>" +
        "<p>3.Win <b>Rs 100</b> for achieving L3 target for any category<br>" +
        "<b>When you achieve your incentive target Level 3(L3) of your category, you can win addition Rs 100.</b>";
    var rule3 = "<h3 style:'color:blue'><b>Each Employee and Manager On Bill Wins</b></h3>" +

        "<p> 1.Win <b>Rs 10</b> on Random App Transactions><br>" +
        "<b>Push More clients for App Transaction to win</b></p>" +

        "<p>2.Win <b>Rs 5</b> on Random non- App Transactions<br><b> Ensure every non- App customer is booked through ERP to win</b></p>" +

        "<p>3.Win <b>Rs 20</b> for Randomly selected bills of Higher Bill Value(High Bill Value = When Bill Amount of customer is High )<br><b>Keep customer bill value higher than Rs 2000 to win</b></p>" +

        "<p>4.Win <b>Rs 20</b> for Randomly selected bills of Higher Number of Services Per Bill(High Number of service per bill = In 1 bill number of services are high)<br>" +
        "<b>Keep number of services availed by customer in 1 bill higher than 4 services</b></p>" +

        "<p>5.Win <b>Rs 25</b> Randomly for Selling Memberships through the App<br>" +
        "<b>Try to sell membership to customer through App to win.</b></p>" +

        "<p>6.Win <b>Rs 25</b> for Selling Retail Products<br>" +
        "<b>Try to sell retail products to customers to win.</b></p>" +

        "<p>7.Win <b>Rs 25</b> Customer Review On Employee" +
        " <b>Customer after service will provide review about each employee and employee will win if rating from customer is good.<b><br>" +
        "<p>8.Win Rs 50 per bill on each 1699 subscription sold" +
        "<p>9.Win Rs 25 per Bill on each 899 subscription sold";

    res.json(CreateObjService.response(false, { rule1: rule1, rule2: rule2, rule3: rule3, rule4: rule4 }))





})






router.post('/onAppt', function(req, res) {

    var id = req.body.id;
    LuckyDrawDynamic.onProductPurchase(id);


})
router.post('/onIncentive', function(req, res) {

    Admin.findOne({ _id: "59a6629b735066586d9ec5df" }, function(err, employee) {

        console.log(employee)
        LuckyDrawDynamic.employeeIncentiveReport(employee, new Date(2017, 5, 1), new Date(2017, 9, 30), function(err, data) {

            console.log("here", data)

            var data1 = _.filter(data.dep, function(f) {

                return f.id != ''

            })

            _.forEach(data1, function(d) {
                Incentive.aggregate([{ $match: { "parlors.incentives._id": d.id } },
                    { $unwind: "$parlors" },
                    { $match: { "parlors.incentives._id": d.id } }
                ], function(err, inc) {
                    // console.log(inc)
                    var index = 0;
                    _.forEach(inc[0].parlors.incentives, function(i, key) {
                        if (i._id == d.id) {
                            index = key
                        }
                    })
                    console.log(index)
                })
            })

        })

    })


});






router.get('/activeParlorList', function(req, res) {


    Parlor.find({ active: true }, { name: 1 }, function(err, parlors) {


        if (err) {

            res.json(CreateObjService.response(true, err))


        } else {

            res.json(CreateObjService.response(false, parlors))

        }

    })


})
var Client = require('node-rest-client').Client;

var client = new Client();
router.get('/getIt', function(req, res) {


})

router.post('/getLuckyDrawForAdmin', function(req, res) {

    var startDate = HelperService.getDayStart(req.body.date)
    var endDate = HelperService.getDayEnd(req.body.date)
    console.log(startDate, endDate)
    LuckyDrawDynamic.find({ createdAt: { $gte: startDate, $lt: endDate } }, function(err, data) {

        var dataToSend = [];

        async.each(data, function(d, cb) {

            Parlor.findOne({ _id: d.parlorId }, { name: 1 , address2 :1}, function(err, parlor) {


                Admin.findOne({ _id: d.employeeId }, {razorPayAccountId:1, accountNo: 1, ifscCode: 1 }, function(err, employee) {


                    var newData = {}
                    if (employee) {
                        newData.accountNo = employee.accountNo ? employee.accountNo : "N/A"
                        newData.ifscCode = employee.ifscCode ? employee.ifscCode : "N/A";
                        newData.employeeId = d.employeeId
                        newData.ifscCode = employee.razorPayAccountId ? employee.razorPayAccountId : "N/A";
                    }
                    if (employee.ifscCode == "N/A") {
                       // 0-claimed, 1- not-claimed, 2- initiated to bank, 3- sucessfully processed, 4- Payment Failed , 5-missing detail
                        if(d.status==0) newData.status="Claimed"
                        if(d.status==1) newData.status="Not Claimed"
                        if(d.status==2) newData.status="initiated to bank"
                        if(d.status==3) newData.status="sucessfully processed"
                        if(d.status==4) newData.status="Payment Failed"
                        if(d.status==5) newData.status="missing detail" 
                        newData._id = d._id
                        newData.ifsc = null
                        newData.parlorName = parlor.name+" - "+parlor.address2
                        newData.employeeName = d.employeeName
                        newData.clientName = d.clientName
                        newData.amount = d.amount
                        newData.paid = d.paid
                        newData.employeeId = d.employeeId
        
                        newData.reason = d.reason
                        newData.date = d.createdAt

                        // console.log(newData)
                        dataToSend.push(newData);

                        cb();
                    } else {
                        client.get("https://ifsc.razorpay.com/" + newData.ifscCode, function(data, response) {
                            // parsed response body as js object
                            // console.log(data);
                            // raw response
                            // console.log(response);

                            if(d.status==0) newData.status="Claimed"
                            if(d.status==1) newData.status="Not Claimed"
                            if(d.status==2) newData.status="initiated to bank"
                            if(d.status==3) newData.status="sucessfully processed"
                            if(d.status==4) newData.status="Payment Failed"
                            if(d.status==5) newData.status="missing detail" 
                            newData._id = d._id
                            newData.ifsc = data
                            newData.parlorName = parlor.name+" - "+parlor.address2
                            newData.employeeId = d.employeeId
                            newData.employeeName = d.employeeName
                            newData.clientName = d.clientName
                            newData.amount = d.amount
                            newData.paid = d.paid
                        
                            newData.reason = d.reason
                            newData.date = d.createdAt

                            // console.log(newData)
                            dataToSend.push(newData);

                            cb();


                        });
                    }


                })
            })
        }, function(done) {

            var data = _.sortBy(dataToSend, function(d) {
                return d.date
            })
            res.json(data)
        })


    })


})


router.post('/getLuckyDrawForAdminv2', function(req, res) {

    var startDate = new Date(req.body.startDate);
    var endDate = HelperService.getDayEnd(req.body.endDate)
    console.log(startDate, endDate)
    LuckyDrawDynamic.aggregate([{$match : {status: 0, createdAt: { $gte: startDate, $lt: endDate } }} , 
                                {$group :{_id: "$employeeId" , 
                                            amount :{$sum : "$amount"} , employeeName:{$first :"$employeeName"},employeeId:{$first :"$employeeId"},
                                            clientName:{$first :"$clientName"} , paid:{$first :"$paid"} , status:{$first :"$status"} , 
                                            reason:{$first :"$reason"} , createdAt:{$first :"$createdAt"} , parlorId:{$first :"$parlorId"} , count:{$sum :1}}}
                                ], function(err, data) {

        var dataToSend = [];

        async.each(data, function(d, cb) {

            Parlor.findOne({ _id: d.parlorId }, { name: 1 }, function(err, parlor) {


                Admin.findOne({ _id: d.employeeId }, { accountNo: 1, ifscCode: 1 }, function(err, employee) {


                    var newData = {}
                    if (employee) {
                        newData.accountNo = employee.accountNo ? employee.accountNo : "N/A"
                        newData.ifscCode = employee.ifscCode ? employee.ifscCode : "N/A"
                    }
                    if (employee.ifscCode == "N/A") {
                        if(d.status==0) newData.status="Claimed"
                        if(d.status==1) newData.status="Not Claimed"
                        if(d.status==2) newData.status="initiated to bank"
                        if(d.status==3) newData.status="sucessfully processed"
                        if(d.status==4) newData.status="Payment Failed"
                        if(d.status==5) newData.status="missing detail" 
                        newData._id = d._id
                        newData.ifsc = null
                        newData.parlorName = parlor.name
                        newData.employeeName = d.employeeName
                        newData.clientName = d.clientName
                        newData.amount = d.amount
                        newData.paid = d.paid
                        
                        newData.reason = d.reason
                        newData.date = d.createdAt

                        // console.log(newData)
                        dataToSend.push(newData);

                        cb();
                    } else {
                        client.get("https://ifsc.razorpay.com/" + newData.ifscCode, function(data, response) {
                            // parsed response body as js object
                            // console.log(data);
                            // raw response
                            // console.log(response);
                            if(d.status==0) newData.status="Claimed"
                            if(d.status==1) newData.status="Not Claimed"
                            if(d.status==2) newData.status="initiated to bank"
                            if(d.status==3) newData.status="sucessfully processed"
                            if(d.status==4) newData.status="Payment Failed"
                            if(d.status==5) newData.status="missing detail" 
                            newData._id = d._id
                            newData.ifsc = data
                            newData.parlorName = parlor.name
                            newData.employeeName = d.employeeName
                            newData.clientName = d.clientName
                            newData.amount = d.amount
                            newData.paid = d.paid
                            newData.status = d.status == 1 ? "Yet to claim" : "Claimed"
                            newData.reason = d.reason
                            newData.date = d.createdAt

                            // console.log(newData)
                            dataToSend.push(newData);

                            cb();


                        });
                    }


                })
            })
        }, function(done) {

            var data = _.sortBy(dataToSend, function(d) {
                return d.date
            })
            res.json(data)
        })


    })


})



router.get('/testMe', function(req, res) {
    LuckyDrawDynamic.onServiceBill("59aeaa1bdb56a610f03178ec");


})



router.get('/getD', function(req, res) {

    LuckyDrawDynamic.aggregate([
        { $group: { _id: "$appointmentId", count: { $sum: 1 } } }
    ], function(err, data) {

        console.log(data.length)
        res.json(data)

    })

})

router.get('/logout', function(req, res) {
    req.session.destroy(function(err) {
        return res.redirect('/crm');
    });
});
var formidable = require('formidable');
var cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'dyqcevdpm',
    api_key: '462926544224169',
    api_secret: 'r6zC4y6Gh8-jd1Y_iNPmx__Hg00'
});
router.post('/uploadImage', function(req, res) {
    var form = new formidable.IncomingForm();
    form.maxFieldsSize = 100 * 1024 * 1024;

    form.parse(req, function(err, fields, files) {
        console.log(err)
        console.log(fields)
        console.log(files)

        require("fs").writeFile("out.png", fields.file, 'base64', function(err) {
            console.log(err);




            cloudinary.uploader.upload("out.png", function(result) {

                var url = result.url
                console.log(url)
                var id = fields.orderId
                console.log(id)
                ReOrder.update({ _id: fields.orderId }, {
                    $push: {
                        imageUrl: { image: url }
                    },
                    $set: { billUploadDate: new Date() }
                }, function(err, order) {
                    console.log(err)
                    console.log(order)
                    res.json("done")
                })

            });


        });
        //  res.writeHead(200, {'content-type': 'text/plain'});
        //  res.write('received upload:\n\n');
        //  res.end(util.inspect({fields: fields, files: files}));
    });
});


router.get('/getreorder', function(req, res) {

    var parlorId = req.query.parlorId;
    console.log(parlorId)
    var month = req.query.month
    var year = req.query.year

    var startDate = HelperService.getFirstDateOfMonth(year, month)
    var endDate = HelperService.getLastDateOfMonth1(year, month)
    ReOrder.find({ parlorId: parlorId, receivedAt: { $gte: startDate, $lt: endDate } }, function(err, data) {

        res.json(data)

    }).sort({ $natural: -1 })

})

router.post('/expenseProfitLoss', function(req, res) {
    var today = new Date()
    var d = []
    var parlorId = req.body.parlorId
    var month = req.body.month
    var year = req.body.year
    var startDate = HelperService.getFirstDateOfMonth(year, month)
    var endDate = HelperService.getLastDateOfMonth(year, month)

    console.log(startDate, endDate)

    Admin.find({ parlorId: parlorId, active: true }).exec(function(err, employees) {
        async.series([
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
            var salary = 0
            var incentive = 0
            _.map(d, function(k) {
                salary += k.empSalary
                _.map(k.dep, function(o) {
                    incentive += o.totalIncentive
                })
            })


            Appointment.aggregate({
                    "$match": {
                        parlorId: ObjectId(parlorId),
                        "createdAt": { "$gte": startDate, "$lt": endDate }
                    }
                }, {
                    "$group": {
                        "_id": null,
                        "service": { $sum: "$serviceRevenue" },
                        "product": { $sum: "$productRevenue" }
                    }
                }
                // ,
                // { "$project": { "revenue": { "$add": [ "$service", "$product" ] } } }

                ,
                function(err, rev) {
                    console.log("----------------", rev)
                    SettlementReport.aggregate({
                        $match: {
                            parlorId: ObjectId(parlorId),
                            createdAt: { $gte: startDate, $lt: endDate }
                        }
                    }, {
                        $group: {
                            _id: null,
                            beushare: { $sum: "$amountPayableToBeu" }

                        }
                    }, function(err, pay2beu) {

                        if (err) console.log(err)
                        console.log(rev)
                        console.log(pay2beu)
                        var beushare = 0;

                        ParlorItem.aggregate({ $unwind: "$addHistory" }, {
                            $match: {
                                parlorId: ObjectId(parlorId),
                                "addHistory.quantity": { $lt: 0 },
                                "addHistory.addedOn": { $gte: startDate, $lt: endDate }
                            }
                        }, {
                            $group: {
                                _id: null,
                                sum: { $sum: "$addHistory.quantity" },
                                cost: { $sum: "$addHistory.costPrice" }
                            }
                        }, function(err, consumed) {

                            if (pay2beu.length > 0) {
                                beushare = pay2beu[0].beushare
                            }


                            Expense.aggregate({
                                $match: {
                                    createdAt: {
                                        $gte: startDate,
                                        $lt: endDate
                                    }
                                }
                            }, { $group: { _id: "$name", sum: { $sum: "$amount" } } }, function(err, indirectExp) {
                                ParlorItem.aggregate({ $unwind: "$addHistory" }, {
                                    $match: {
                                        parlorId: ObjectId(parlorId),
                                        "addHistory.quantity": { $gt: 0 },
                                        "addHistory.addedOn": { $lt: startDate }
                                    }
                                }, {
                                    $group: {
                                        _id: null,
                                        positive: { $sum: "$addHistory.quantity" },
                                        positivePrice: { $sum: "$addHistory.costPrice" }
                                    }
                                }, function(err, positive) {
                                    console.log
                                    ParlorItem.aggregate({ $unwind: "$addHistory" }, {
                                        $match: {
                                            parlorId: ObjectId(parlorId),
                                            "addHistory.quantity": { $lt: 0 },
                                            "addHistory.addedOn": { $lt: startDate }
                                        }
                                    }, {
                                        $group: {
                                            _id: null,
                                            negetive: { $sum: "$addHistory.quantity" },
                                            negetiveCost: { $sum: "$addHistory.costPrice" }
                                        }
                                    }, function(err, negetive) {


                                        // consosle.log()
                                        ParlorItem.aggregate({ $unwind: "$addHistory" }, {
                                            $match: {
                                                parlorId: ObjectId(parlorId),
                                                "addHistory.quantity": { $gt: 0 },
                                                "addHistory.addedOn": { $gte: startDate, $lt: endDate }
                                            }
                                        }, {
                                            $group: {
                                                _id: null,
                                                sum: { $sum: "$addHistory.quantity" },
                                                cost: { $sum: "$addHistory.costPrice" }
                                            }
                                        }, function(err, monthPurchase) {

                                            var pos = 0;
                                            var neg = 0;
                                            var service = 0;
                                            var cost = 0;
                                            var sum = 0;
                                            var product = 0;
                                            var monthPurchase1 = 0;
                                            console.log(positive)
                                            if (positive.length > 0) {
                                                pos = positive[0].positivePrice
                                            }
                                            if (negetive.length > 0) {
                                                neg = negetive[0].negetiveCost
                                            }
                                            if (rev.length > 0) {
                                                service = rev[0].service
                                                product = rev[0].product
                                            }
                                            if (consumed.length > 0) {
                                                cost = consumed[0].cost
                                                sum = consumed[0].sum


                                            }
                                            if (monthPurchase.length > 0) {
                                                monthPurchase1 = monthPurchase[0].cost

                                            }
                                            console.log("monthpurchase", monthPurchase1)

                                            var itemOnFirstDay = pos + neg;
                                            var closeStock = itemOnFirstDay + (monthPurchase1 + cost)
                                            console.log("----------->>>>", neg, pos, consumed)
                                            return res.json({
                                                "cog": {
                                                    itemOnFirstDay: itemOnFirstDay,
                                                    monthPurchase: monthPurchase1,
                                                    consumed: cost,
                                                    closeStock: closeStock
                                                },
                                                "salary": salary,
                                                "incentive": incentive,
                                                "service": service,
                                                "product": product,
                                                "beushare": beushare,
                                                "consumed": (service) * .2,
                                                indirect: indirectExp
                                            });



                                        })
                                    })
                                })


                            })


                        })


                    })

                })


            console.log('done');

        });
    });
});

router.post("/updateAppDigital", function(req, res) {
    console.log("been called");

    SettlementReport.aggregate([{ $match: { period: { $gte: 85, $lte: 91 } } },
        { $project: { period: 1, _id: 0, parlorId: 1, refundAppDigitalOnline: 1, refundAppDigitalCash: 1 } },
        { $group: { "_id": "$parlorId", refundAppDigitalOnline: { $sum: "$refundAppDigitalOnline" }, refundAppDigitalCash: { $sum: "$refundAppDigitalCash" } } },
        { $project: { parlorId: "$_id", refundAppDigitalOnline: 1, refundAppDigitalCash: 1, _id: 0 } }
    ], function(err, result) {
        if (err) {
            res.json(err);
        } else {

            async.each(result, function(r, cb) {
                SettlementReport.update({ "parlorId": ObjectId(r.parlorId), period: 91 }, { "$set": { "refundAppDigitalOnlineMTD": r.refundAppDigitalOnline, "refundAppDigitalCashMTD": r.refundAppDigitalCash } }, function(err, updated) {
                    if (err) {
                        console.log("err on " + r.parlorId);
                        cb();
                    } else {
                        console.log(r.parlorId);
                        cb();
                    }
                });
            }, function() {
                res.json("All Done")
            });


        }
    });
})

router.get("/getMTD", function(req, res) {
    SettlementReport.find({ period: 92 }, { refundAppDigitalOnlineMTD: 1, refundAppDigitalCashMTD: 1, parlorId: 1, _id: 0 }, function(err, response) {
        res.json(response);
    })
})



router.post('/getIncentiveLevel', function(req, res) {

    var d = [];
    var startDate = req.body.startDate
    var endDate = req.body.endDate
        // var parlorIds = req.body.parlorId ? req.body.parlorId : [];

    Parlor.find({ active: true }, { name: 1 }, function(err, parlorIds) {
        var query = { active: true, parlorId: { $in: parlorIds } };
        if (parlorIds.length == 0) query = { active: true, parlorId: { $ne: null } };
        var async = require('async');
        Admin.find(query, function(err, employees) {
            async.parallel([
                function(done) {
                    async.each(employees, function(employee, callback) {
                        console.log(employee.firstName);
                        employeeIncentiveReport(employee, startDate, endDate, function(err, data) {
                            d.push(data);
                            // console.log("getting data success for " + employee.firstName);
                            callback();
                        })
                    }, done);
                }
            ], function allTaskCompleted() {


                async.each(d, function(a, cbs) {

                    async.each(a.dep, function(de, cbm) {
                        if (de.totalIncentive == 1) {

                            LuckyDrawDynamic.create({
                                employeeId: ObjectId(a.employeeId),
                                employeeName: a.name,
                                clientName: null,
                                billAmount: null,
                                parlorId: a.parlorId,
                                appointmentId: null,
                                categoryId: 7,
                                amount: 25,
                                reason: de.unit,
                                stringToPrintEmployee: "Congratulations! You Have Won Rs. 25 For Achieving Level 1 Target In",
                                stringToPrintSalon: "Has Won Rs. 25 For Achieving Level 1 Target In",
                                status: 1
                            }, function(err, done) {
                                if (err) {
                                    console.log(err)
                                    cbm();

                                } else {
                                    cbm();


                                }
                            })

                        } else if (de.totalIncentive == 2) {
                            LuckyDrawDynamic.create({
                                employeeId: ObjectId(a.employeeId),
                                employeeName: a.name,
                                clientName: null,
                                billAmount: null,
                                parlorId: a.parlorId,
                                appointmentId: null,
                                categoryId: 8,
                                amount: 50,
                                reason: de.unit,
                                stringToPrintEmployee: "Congratulations! You Have Won Rs. 50 For Achieving Level 2 Target In",
                                stringToPrintSalon: "Has Won Rs. 50 For Achieving Level 2 Target In",
                                status: 1
                            }, function(err, done) {
                                if (err) {
                                    console.log(err)
                                    cbm();

                                } else {
                                    cbm();


                                }
                            })
                        } else if (de.totalIncentive == 3) {
                            LuckyDrawDynamic.create({
                                employeeId: ObjectId(a.employeeId),
                                employeeName: a.name,
                                clientName: null,
                                billAmount: null,
                                parlorId: a.parlorId,
                                appointmentId: null,
                                categoryId: 9,
                                amount: 100,
                                reason: de.unit,
                                stringToPrintEmployee: "Congratulations! You Have Won Rs. 100 For Achieving Level 3 Target In",
                                stringToPrintSalon: "Has Won Rs. 100 For Achieving Level 3 Target In",
                                status: 1
                            }, function(err, done) {
                                if (err) {
                                    console.log(err)
                                    cbm();

                                } else {
                                    cbm();


                                }
                            })
                        } else {
                            cbm();
                        }

                    }, function(done) {

                        cbs();

                    })

                }, function() {


                    console.log('done');
                    return res.json(d);


                })




            });
        });

    })


})


function employeeIncentiveReport(employee, startDate, endDate, callback) {
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
            productRevenue: 0,
            productIncentive: 0
        },
        totalProductRevenueEmp: 0,
        totalIncentive: 0,
        parlorId: employee.parlorId,
        dep: []
    };
    var parlorId = employee.parlorId;

    Parlor.findOne({ _id: parlorId }, { name: 1, address2: 1, parlorType: 1 }, function(err, parlor) {
        // console.log("name" +parlor.name)
        if (parlor) {
            data.parlorAddress = parlor.address2;
            data.parlorName = parlor.name;

            ServiceCategory.find({}).sort({ sort: 1 }).exec(function(err, categories) {
                _.forEach(categories, function(c) {
                    data.dep.push({
                        unit: c.name,
                        unitId: c.id,
                        serviceNo: 0,
                        totalRevenue: 0,
                        totalIncentive: 0
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
                                    // _.forEach(data.product, function (product) {
                                    data.totalProductRevenueEmp += (prd.price * prd.quantity);

                                    data.product.productNo += prd.quantity;
                                    data.product.productRevenue += (prd.price * prd.quantity);

                                    data.product.productIncentive = Appointment.productIncentiveFunction(data.totalProductRevenueEmp);
                                    // });
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
                                            var serviceRevenue = Appointment.serviceFunction(appointment.createdAt, ser, empObj);
                                            report.totalRevenue += serviceRevenue.employees[0].totalRevenueEmp;
                                            data.totalRevenueEmp += serviceRevenue.employees[0].totalRevenueEmp;
                                            var myrange = incentiveFunction(incentive, ser, employee, report, parlor.parlorType);
                                            report.totalIncentive = myrange.myrange;

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
        } else {
            return callback(err, data);
        }
    })
};



function incentiveFunction(incentive, ser, empl, report, parlorType) {
    var totalIncentive = 0;
    var myrange = 0;
    var myrange2 = 0;

    _.forEach(incentive, function(inc) {
        _.forEach(inc.parlors, function(par) {
            if (par.parlorType == parlorType) {
                if (report.unitId == inc.categoryId) {
                    _.forEach(par.incentives, function(incentive, key) {
                        if (report.totalRevenue >= incentive.range) {
                            myrange = key + 1
                        }
                    })


                }
            }
        });
    });

    return { myrange: myrange };
}



router.get('/updateLuckyModel', function(req, res) {

    Parlor.find({}, { name: 1 }, function(err, parlors) {


        async.each(parlors, function(parlor, cbs) {

            LuckyDrawModel.update({ parlorId: parlor._id }, {
                $set: {
                    "appTransaction.value": 2,
                    "appTransaction.amount": 10,
                    "salonTransaction.value": 3,
                    "salonTransaction.amount": 5,
                    "billValue.value": 4000,
                    "billValue.amount": 20,
                    "billServices.value": 6,
                    "billServices.amount": 20
                }
            }, function(err, updated) {
                console.log(updated)
                cbs();

            })
        }, function(done) {

            res.json("done")

        })



    })






})

router.post("/employeeChapterWiseTrainings", function(req, res) {
    var employeeId = req.body.employeeId;
    TrainingSession.aggregate([
        { $match: { "employees.employeeId": ObjectId(employeeId) } },
        { $unwind: "$employees" },
        { $match: { "employees.employeeId": ObjectId(employeeId) } },
        {
            $lookup: {
                from: "beus",
                localField: "trainerId",
                foreignField: "_id",
                as: "trainerData"
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
        { $unwind: "$trainerData" },
        { $unwind: "$superCategoryData" },
        { $unwind: "$subCategoryData" },
        { $unwind: "$chapterData" },
        {
            $project: {
                "createdAt": 1,
                "_id": 0,
                sessionId: "$_id",
                superCategoryName: "$superCategoryData.superCategoryName",
                subCategoryName: "$subCategoryData.subCategoryName",
                trainerName: { $concat: ["$trainerData.firstName", " ", "$trainerData.lastName"] },
                chapterName: "$chapterData.chapterName",
                duration: "$chapterData.duration",
                theory: "$chapterData.theory",
                practical: "$chapterData.practical"
            }
        },
        { $sort: { createdAt: -1 } }
    ], function(err, trainings) {
        if (err) {
            res.json(CreateObjService.response(true, "Server Error."));
        } else {
            res.json(CreateObjService.response(false, trainings));
        }
    })
});

router.post("/employeeDayWiseTrainings", function(req, res) {
    var employeeId = req.body.employeeId;
    TrainingSession.aggregate([
        { $match: { "employees.employeeId": ObjectId(employeeId) } },
        { $unwind: "$employees" },
        { $match: { "employees.employeeId": ObjectId(employeeId) } },
        {
            $lookup: {
                from: "beus",
                localField: "trainerId",
                foreignField: "_id",
                as: "trainerData"
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
        { $unwind: "$trainerData" },
        { $unwind: "$superCategoryData" },
        { $unwind: "$subCategoryData" },
        { $unwind: "$chapterData" },
        {
            $project: {
                createdAt: 1,
                sessionId: "$_id",
                superCategoryName: "$superCategoryData.superCategoryName",
                subCategoryName: "$subCategoryData.subCategoryName",
                trainerName: { $concat: ["$trainerData.firstName", " ", "$trainerData.lastName"] },
                chapterName: "$chapterData.chapterName",
                duration: "$chapterData.duration",
                theory: "$chapterData.theory",
                practical: "$chapterData.practical"
            }
        },
        {
            $group: {
                _id: {
                    date: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt"
                        }
                    },
                    chapterId: "$chapterId"
                },
                training: {
                    $push: {
                        sessionId: "$sessionId",
                        superCategoryName: "$superCategoryName",
                        subCategoryName: "$subCategoryName",
                        trainerName: "$trainerName",
                        chapterName: "$chapterName",
                        duration: "$duration",
                        theory: "$theory",
                        practical: "$practical"
                    }
                }
            }
        },
        { $project: { "_id": 0, date: "$_id.date", training: 1 } }
    ], function(err, trainings) {
        if (err) {
            res.json(CreateObjService.response(true, "Server Error."));
        } else {
            res.json(CreateObjService.response(false, dateToMonth(trainings.sort(function(a, b) {
                a = new Date(a.date);
                b = new Date(b.date);
                return a > b ? -1 : a < b ? 1 : 0;
            }), "y/m/d")));
        }
    })
});

router.post("/rateTrainingSession", function(req, res) {
    var sessionId = req.body.sessionId;
    var employeeId = req.body.employeeId;
    var rating = parseInt(req.body.rating);
    TrainingSession.update({ "_id": ObjectId(sessionId), "employees.employeeId": ObjectId(employeeId) }, { "employees.$.rating": rating }, function(err, updated) {
        if (err) {
            res.json(CreateObjService.response(true, "Server Error."));
        } else {
            res.json(CreateObjService.response(false, "Successfully submitted."));
        }
    })
})

router.post("/ownerTrainingChapterWise", function(req, res) {
    var parlorId = req.body.parlorId;
    TrainingSession.aggregate([
        { $match: { parlorId: ObjectId(parlorId) } },
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
                "sessionId": "$_id",
                "createdAt": 1,
                "superCategoryId": 1,
                "subCategoryId": 1,
                "trainerId": 1,
                "chapterId": 1,
                "practical": 1,
                "theory": 1,
                "employeeName": { $concat: ["$employeeData.firstName", " ", "$employeeData.lastName"] }
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
        {
            $project: {
                "sessionId": 1,
                "createdAt": 1,
                "superCategoryId": 1,
                "subCategoryId": 1,
                "trainerId": 1,
                "chapterId": 1,
                "practical": 1,
                "theory": 1,
                "employeeName": 1,
                "chapterName": "$chapterData.chapterName",
                "duration": "$chapterData.duration"
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
                from: "beus",
                localField: "trainerId",
                foreignField: "_id",
                as: "trainerData"
            }
        },
        { $unwind: "$superCategoryData" },
        { $unwind: "$subCategoryData" },
        { $unwind: "$trainerData" },
        {
            $group: {
                "_id": "$chapterId",
                "sessionId": { $first: "$sessionId" },
                "createdAt": { $first: "$createdAt" },
                chapterName: { $first: "$chapterName" },
                trainerName: { $first: { $concat: ["$trainerData.firstName", " ", "$trainerData.lastName"] } },
                subCategoryName: { $first: "$subCategoryData.subCategoryName" },
                superCategoryName: { $first: "$superCategoryData.superCategoryName" },
                employees: { $push: { "employeeName": "$employeeName" } }
            }
        },
        {
            $project: {
                chapterId: "$_id",
                "createdAt": 1,
                _id: 0,
                sessionId: 1,
                chapterName: 1,
                trainerName: 1,
                subCategoryName: 1,
                superCategoryName: 1,
                employees: 1
            }
        }
    ], function(err, trainings) {
        if (err) {
            res.json(CreateObjService.response(true, "Server Error."));
        } else {
            res.json(CreateObjService.response(false, trainings));
        }
    })
});

router.post("/ownerTrainingDayWise", function(req, res) {
    var parlorId = req.body.parlorId;
    TrainingSession.aggregate([
        { $match: { parlorId: ObjectId(parlorId) } },
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
                "sessionId": "$_id",
                "createdAt": 1,
                "superCategoryId": 1,
                "subCategoryId": 1,
                "trainerId": 1,
                "chapterId": 1,
                "parlorId": 1,
                "practical": 1,
                "theory": 1,
                "employeeName": { $concat: ["$employeeData.firstName", " ", "$employeeData.lastName"] }
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
        {
            $project: {
                "createdAt": 1,
                "sessionId": 1,
                "superCategoryId": 1,
                "subCategoryId": 1,
                "trainerId": 1,
                "chapterId": 1,
                "parlorId": 1,
                "practical": 1,
                "theory": 1,
                "employeeName": 1,
                "chapterName": "$chapterData.chapterName",
                "duration": "$chapterData.duration"
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
                from: "beus",
                localField: "trainerId",
                foreignField: "_id",
                as: "trainerData"
            }
        },
        { $unwind: "$superCategoryData" },
        { $unwind: "$subCategoryData" },
        { $unwind: "$trainerData" },
        {
            $group: {
                "_id": {
                    date: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt"
                        }
                    }
                },
                sessionId: { $first: "$sessionId" },
                chapterName: { $first: "$chapterName" },
                trainerFirstName: { $first: "$trainerData.firstName" },
                trainerLastName: { $first: "$trainerData.lastName" },
                superCategoryName: { $first: "$superCategoryData.superCategoryName" },
                subCategoryName: { $first: "$subCategoryData.subCategoryName" },
                chapterId: { $first: "$chapterId" },
                employees: { $push: { "employeeName": "$employeeName" } }
            }
        },
        {
            $project: {
                "_id": 0,
                "sessionId": 1,
                "date": "$_id.date",
                "trainerName": { $concat: ["$trainerFirstName", " ", "$trainerLastName"] },
                "chapterName": 1,
                "superCategoryName": 1,
                "subCategoryName": 1,
                "chapterId": 1,
                "employees": 1
            }
        }
    ], function(err, trainings) {
        if (err) {
            res.json(CreateObjService.response(true, "Server Error."));
        } else {
            res.json(CreateObjService.response(false, dateToMonth(trainings.sort(function(a, b) {
                a = new Date(a.date);
                b = new Date(b.date);
                return a > b ? -1 : a < b ? 1 : 0;
            }), "y/m/d")));
        }
    })
});


router.get('/bucketOpening', function(req, res) {



    DisountOnPurchase.find({ purchase: null, createdAt: { $gte: new Date("2018-04-10T08:15:03.253Z") } }, function(err, discount) {
        var allParlorIds = [];
        async.each(discount, function(dis, cb) {

            var data = {

                "parlorId": dis.parlorId,

                "parlorName": dis.parlorName,

                "sellerName": "April Opening Balance",

                "purchaseTillDate": 0,

                "targetRevenue": dis.targetRevenue > dis.revenueBookedInErp ? dis.targetRevenue - dis.revenueBookedInErp : 0,

                "discountBucket": dis.discountBucket,

                "revenueBookedInErp": 0,

                "time": new Date()

            }

            DisountOnPurchase.create(data, function(err, data) {
                allParlorIds.push(ObjectId(dis.parlorId))
                cb();
            })

        }, function(done) {
            console.log("All parlors---------------", allParlorIds.length)
            Parlor.find({ _id: { $nin: allParlorIds } }, { name: 1 }, function(err, nonparlors) {
                console.log("non parlors -----------------------------", nonparlors.length)
                async.each(nonparlors, function(p, cbs) {

                    var data = {

                        "parlorId": p._id,

                        "parlorName": p.name,

                        "sellerName": "April Opening Balance",

                        "purchaseTillDate": 0,

                        "targetRevenue": 0,

                        "discountBucket": 0,

                        "revenueBookedInErp": 0,

                        "time": new Date()

                    }

                    DisountOnPurchase.create(data, function(err, data) {
                        cbs();
                    })

                }, function() {
                    console.log("all done")
                    res.json("all done")

                })
            })

        })



    })




})

router.get("/updateBucket", function(req, res) {

    ReOrder.find({ status: 0, receivedAt: { $gte: new Date(2018, 3, 1), $lt: new Date(2018, 3, 30, 23, 59, 59) } }, { parlorId: 1, name: 1, sellerId: 1, orderAmount: 1, receivedAt: 1, createdAt: 1, updatedAt: 1, newOrderAmount: 1 }, function(err, reorders) {
        if (err) {
            console.log(err);
        } else {
            console.log(reorders)
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
                                var orderAmount = reo.newOrderAmount;
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

router.get('/monthEndBucket', function(req, res) {
    Parlor.find({}, { name: 1 }, function(err, parlors) {
        async.each(parlors, function(parlor, cb) {
            var query = [

                { $match: { status: 3, parlorId: ObjectId(parlor._id), appointmentStartTime: { $gte: new Date(2018, 3, 1), $lt: new Date(2018, 3, 30, 23, 59, 59) } } },
                { $group: { _id: null, serviceRevenue: { $sum: "$serviceRevenue" }, productRevenue: { $sum: "$productRevenue" } } },
                { $project: { revenue: { $add: ["$serviceRevenue", "$productRevenue"] } } }
            ]
            console.log(JSON.stringify(query))
            Appointment.aggregate(query, function(err, revenue) {
                console.log(revenue)
                DisountOnPurchase.find({
                    $or: [

                        {
                            purchase: { $exists: true },

                            time: { $gte: new Date(2018, 3, 1), $lt: new Date(2018, 3, 30, 23, 59, 59) },
                            parlorId: ObjectId(parlor._id)
                        },
                        { "sellerName": "April Opening Balance", parlorId: ObjectId(parlor._id) }
                    ]
                }, function(err, discount) {
                    console.log(discount)
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
                                "sellerName": "April Closing Balance"
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
                                "sellerName": "April Closing Balance"
                            }, function(err, data) {
                                console.log(err)
                                cb();
                            })
                        }
                    }
                }).sort({ $natural: -1 }).limit(1)
            })
        }, function(done) {
            res.json("done")
            console.log("done")

        })
    })
})

router.post('/attendance', function(req, res, next) {
    Attendance.find({ employeeId: req.body.employeeId }, function(err, data) {
        console.log(err);
        if (!err) {
            return res.json(CreateObjService.response(false, data));
        } else {
            return res.json(CreateObjService.response(true, 'Invalid data'));
        }
    });
});

router.post('/uploadProfileImage', function(req, res) {
    var form = new formidable.IncomingForm();
    form.maxFieldsSize = 100 * 1024 * 1024;
    form.parse(req, function(err, fields, files) {
        require("fs").writeFile("out1.png", fields.file, 'base64', function(err) {
            cloudinary.uploader.upload("out1.png", function(result) {
                var url = result.url
                var id = fields.userId;
                Beu.findOne({ _id: id }, function(err, beus) {

                    if (beus) {
                        Beu.update({ _id: id }, { $set: { myProfilePic: url } }, function(err, beus) {
                            if (err) {
                                res.json(CreateObjService.response(true, "Error while updating pic"))

                            } else {
                                res.json(CreateObjService.response(false, "Profile pic Updated"))
                            }

                        })

                    } else {
                        Admin.findOne({ _id: id }, function(err, admin) {

                            if (admin) {
                                Admin.update({ _id: id }, { $set: { myProfilePic: url } }, function(err, admin) {
                                    if (err) {
                                        res.json(CreateObjService.response(true, "Error while updating pic"))

                                    } else {
                                        res.json(CreateObjService.response(false, "Profile pic Updated"))
                                    }
                                })
                            } else {
                                res.json(CreateObjService.response(true, "User Not found"))
                            }
                        })
                    }
                })
            });
        });

    });
});



router.get('/checkMyPic', function(req, res) {

    Beu.findOne({ _id: req.query.id }, function(err, user) {
        if (user) {
            res.json(CreateObjService.response(false, "pic found"))
        } else {
            Admin.findOne({ _id: req.query.id, myProfilePic: { $ne: null } }, function(err, admin) {

                if (admin) {

                    res.json(CreateObjService.response(false, admin.myProfilePic))
                } else {
                    res.json(CreateObjService.response(true, "pic not  found"))
                }


            })
        }





    })



})
router.get('/updatePO', function(rea, res) {

    ReOrder.update({ receivedAt: { $gte: new Date(2018, 1, 1) }, status: 0 }, { $set: { status: 1 } }, { multi: true }, function(err, update) {
        console.log(err)
        console.log(update)
        res.json("done")

    })
})

router.get('/checkActive', function(req, res) {

    var id = req.query.id;

    Beu.findOne({ _id: id }, function(err, beu) {

        if (beu) {
            res.json(CreateObjService.response(false, "User is Active"))

        } else {

            Admin.findOne({ _id: id, $or: [{ active: true }, { role: 7 }] }, function(err, admin) {
                if (admin) {

                    res.json(CreateObjService.response(false, "User is Active"))
                } else {
                    res.json(CreateObjService.response(true, "User not Active"))

                }

            })
        }
    })

})

router.get('/getSubs', function(req, res) {
    var ids = ObjectId("5a899563bb5bfd4b3f8eafbf")
    LuckyDrawDynamic.onSubscription(ids, 1);
    res.json("done")



})

router.get('/updateSome', function(req, res) {

    ReOrder.update({ _id: { $in: [ObjectId("5a5f41b11143ba426e431763"), ObjectId("5a5f3f6c1143ba426e4315c4"), ObjectId("5a61d7bd04ab385bd194ca28"), ObjectId("5a61d76204ab385bd194ca14"), ObjectId("5a61d4bc04ab385bd194c9a0"), ObjectId("5a61d10c04ab385bd194c8c8"), ObjectId("5a4f584512e4d41f074bce58"), ObjectId("5a4ddc6ee8f6f9025ed2aec2"), ObjectId("5a4cca6dba88cb393b030483"), ObjectId("5a4cca4fba88cb393b030470"), ObjectId("5a6f08dc72f87f4328207023"), ObjectId("5a6323e8e581df1be671d785"), ObjectId("5a60d6aa360cd468635626f4"), ObjectId("5a6d9431998ee45a84d18cfb"), ObjectId("5a5c9465c7d5b21a1ac3db31"), ObjectId("5a58c6f36cfac53c6fe99218"), ObjectId("5a58c51b6cfac53c6fe991d1"), ObjectId("5a44faf0db10b734458897f4"), ObjectId("5a22e835bc73da698c90c7b7"), ObjectId("5a5b12136622ad3dc1a22bb5"), ObjectId("5a5211942dfd417dabad4152"), ObjectId("5a4ca7feba88cb393b02fd01"), ObjectId("5a72b71e7ef5977f17bf1a27"), ObjectId("5a63407523b82628d5f6ec50"), ObjectId("5a63357f23b82628d5f6e6c5"), ObjectId("5a6192fb767df42dc85ac37d"), ObjectId("5a6039710768b915e9eafedc"), ObjectId("5a52279a2dfd417dabad49ce"), ObjectId("5a4f343b12e4d41f074bc78e"), ObjectId("5a4f299205a12e126b55ec41"), ObjectId("5a4f297f05a12e126b55ec39"), ObjectId("5a4f294f05a12e126b55ec24"), ObjectId("5a4f868912e4d41f074bdb2b"), ObjectId("5a62347004ab385bd194dd07"), ObjectId("5a59cd3b6cfac53c6fe9a660")] } }, { $set: { status: 1 } }, { multi: true }, function(err, done) {


        res.json(done)

    })



})
router.get('/updateParlorItem', function(req, res) {

    // ParlorItem.update({ parlorId: ObjectId("59fd7dbcbd0a022154619103"), sellerId: ObjectId("59d4e04a7e1f833c33a539d6") }, { $set: { orderedStatus: 0 } }, { multi: true }, function(err, done) {
    ParlorItem.update({}, { $set: { orderedStatus: 0 } }, { multi: true }, function(err, done) {

        res.json(done)

    })
})

router.get('/onSubscription', function(req, res) {
    LuckyDrawDynamic.onSubscription(ObjectId("5a9269307334835ce62dd9b4"), 2);
    res.json("called")
})
router.get('/copyNewOrderAmount', function(req, res) {

    // ReOrder.find({ receivedAt: { $gte: new Date(2018, 2, 1), $lt: new Date(2018, 2, 31, 23, 59, 59) } }, function(err, orders) {



    ReOrder.find({ receivedAt: { $gte: new Date(startDate), $lt: new Date(endDate) } }, function(err, orders) {

        console.log(orders)
        orders.forEach(function(f) {


            ReOrder.update({ _id: f._id }, { $set: { newOrderAmount: f.orderAmount } }, function(err, done) {
                console.log(f._id)

            })

        })


    })
    res.json("called")
})
module.exports = router;