var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var schedule = require('node-schedule');
var fs = require('fs');
var request = require('request');
var async = require("async");
var nodemailer = require('nodemailer');
var http = require("https");
// var googl = require('goo.gl');
// googl.setKey('AIzaSyDNWjua5ndmlEt4GH9e50odpl64x0TxBj8');

Async = require('async');
ejs = require('ejs');

var device = require('express-device');
var cors = require('cors');
_ = require('lodash');


var mongoose = require('mongoose');
var Schema = mongoose.Schema;
ObjectId = mongoose.Types.ObjectId;

var db = mongoose.connection;
localVar = require('./model/localVar');



// var MongoClient = require('mongodb').MongoClient;
// var uri ="mongodb://beusalons:dhinchek123@cluster0-shard-00-00-xp07j.mongodb.net:27017,cluster0-shard-00-01-xp07j.mongodb.net:27017,cluster0-shard-00-02-xp07j.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin";
// MongoClient.connect(uri, function(err, db) {
//   db.close();
// });


//ps -aef | grep 'node'    // Service stopping get pid   brij 4256

db.on('connecting', function() {
    console.log('connecting to MongoDB...');
});

db.on('error', function(error) {
    console.error('Error in MongoDb connection: ' + error);
    mongoose.disconnect();
});
db.on('connected', function() {
    console.log('MongoDB connected!');
});
db.once('open', function() {
    console.log('MongoDB connection opened!');
});
db.on('reconnected', function() {
    console.log('MongoDB reconnected!');
});
db.on('disconnected', function() {
    console.log('MongoDB disconnected!');
    mongoose.connect(localVar.getDbPath(), { server: { auto_reconnect: true }, sslValidate: false });
});
mongoose.connect(localVar.getDbPath(), { server: { auto_reconnect: true }, sslValidate: false });

const MongoStore = require('connect-mongo')(session);
const compression = require('compression')




FreebiesOffer = require('./model/FreebiesOffer');
SalonPersonalCoupon = require('./model/SalonPersonalCoupon');
Admin = require('./model/Admin');
Sellers = require('./model/Sellers');
UserReminder = require('./model/UserReminder');
LuckyDrawDynamic = require('./model/luckyDrawDynamic');
LuckyDrawModel = require('./model/luckyDrawModel');
DiscountStructure = require('./model/DiscountStructure');
EmployeeReferral = require('./model/employeReferral');
DetectedFaces = require('./model/detectedFaces');
ParlorMou = require('./model/parlorMou');
DisountOnPurchase = require('./model/discountOnPurchase');
LocationTracker = require('./model/locationTracker');
SalonCheckin = require('./model/saloncheckin');
ContactedClients = require('./model/ContactedClients');
TrainingChapter = require('./model/TrainingChapter');
TrainingSession = require('./model/TrainingSession');
TrainingSupercategory = require('./model/TrainingSupercategory');
TrainingSubcategory = require('./model/TrainingSubcategory');
TrainingQuestion = require('./model/TrainingQuestion');
TrainingQuiz = require('./model/TrainingQuiz');
WebsiteQuery = require('./model/WebsiteQuery');
FacebookQuery = require('./model/FacebookQuery');
DivasAndMachosCustomers = require('./model/DivasAndMachosCustomers');
ProductCategories = require('./model/ProductCategories');
ReOrder = require('./model/ReOrder');
LuckyDraw = require('./model/luckyDraw');
GraphDimension = require('./model/graphdimension');
AllDeals = require('./model/AllDeals');
DailyDeal = require('./model/DailyDeal');
UserFbFriend = require('./model/UserFbFriend');
SalonLayout = require('./model/SalonLayout');
MirrorImage = require('./model/MirrorImage');

SalonPassPayments = require('./model/SalonPassPayments');
SignupYearlyInvoice = require('./model/SignupYearlyInvoice');

//Flash Coupons
FlashCoupon = require('./model/FlashCoupon');

Advance = require('./model/Advance');
SalesParlor = require('./model/SalesParlor');
SalesTicket = require('./model/SalesTicket');
ParlorChair = require('./model/ParlorChair')
Appointment = require('./model/Appointment');
Parlor = require('./model/Parlor');
Service = require('./model/Service');
CreateDealJpeg = require('./model/CreateDealJpeg');
Subscription = require('./model/Subscription');
SubscriptionSale = require('./model/SubscriptionSale');
BeuMirror = require('./model/BeuMirror');


Incentive = require('./model/Incentive');
IncentiveCopy = require('./model/IncentiveCopy');
Beacon = require('./model/Beacon');

UserCart = require('./model/UserCart');

AuthorizedPayment = require('./model/AuthorizedPayment');


CorporateCompany = require('./model/Company');
CorporateCompanyRequest = require('./model/CorporateCompanyRequest');
CorporateAccount = require('./model/CorporateAccounts');

SuperCategory = require('./model/SuperCategory');
Notification = require('./model/Notification');
Recommendation = require('./model/Recommendation');
ServiceCategory = require('./model/ServiceCategory');
SalonMasterMenu = require('./model/SalonMasterMenu');
User = require('./model/User');
Offer = require('./model/Offer');
Slab = require('./model/Slab');
Membership = require('./model/Membership');
InventoryItem = require('./model/InventoryItem');
ServiceProduct = require('./model/ServiceProduct');
ServiceBrand = require('./model/ServiceBrand');
MembershipSale = require('./model/MembershipSale');
ActiveMembership = require('./model/ActiveMembership');
Leave = require('./model/leave');
Expense = require('./model/Expense');
ParlorItem = require('./model/ParlorItem');
Sms = require('./model/Sms');
Otp = require('./model/Otp');
Beu = require('./model/Beu');
SettlementReport = require('./model/SettlementReport');
SettlementReportv = require('./model/SettlementReportv');
SettlementMonthlyInvoice = require('./model/SettlementMonthlyInvoice');
Memory = require('./model/Memory');
Deals = require('./model/Deals');
Attendance = require('./model/Attendance');
Song = require('./model/Song');
Playlist = require('./model/Playlist');
FingerPrint = require('./model/FingerPrint');
DailyOffer = require('./model/DailyOffer');
SubCategory = require('./model/SubCategory');

Chapter = require('./model/Chapter');
ChapterTab = require('./model/ChapterTab');

Port_Position = require('./model/Port_Position');
Port_Tag = require('./model/Port_Tag');
Port_Post = require('./model/Port_Post');
Port_Collection = require('./model/Port_Collection');
PortfolioUser = require('./model/PortfolioUser');

PaytmPayment = require('./model/PaytmPayments');

BeUFormQuestions = require('./model/BeUFormQuestions');
BeuFormAnswers = require('./model/BeuFormAnswers');
BeUFormCategory = require('./model/BeUFormCategory');
BeUFormSubCategory = require('./model/BeUFormSubCategory');
SubmitBeuForm = require('./model/SubmitBeuForm');

CreateObjService = require('./service/createObjService');
ConstantService = require('./service/constantService');
HelperService = require('./service/helperService');
ApiHelperService = require('./service/apiHelperService');
AppointmentHelperService = require('./service/appointmentHelperService');
ChartService = require('./service/chartService');
ParlorService = require('./service/parlorService');
PaytmService = require('./service/paytm/checksum');
AggregateHelper = require('./service/aggregateHelperService');
AggregateService = require('./service/aggregateService');

SalesCheckin = require('./model/SalesCheckin');

UserQuestionAnswers = require('./model/UserQuestionAnswers');

SalonManagerIncentive = require('./model/SalonManagerIncentive');
Gsttransfer = require('./model/gstTransfer');
SubsTransfer = require('./model/substransfer');

ParlorConcerns = require('./model/ParlorConcerns');
ParlorConcernResponse = require('./model/ParlorConcernResponse');
ConcernThread = require('./model/ConcernThread');
OpsConcern = require('./model/OpsConcern');
ParameterQuery = require('./model/ParameterQuery');

SalonSupportData = require('./model/SalonSupportData');
QuarterlySalonSupportData = require('./model/QuarterlySalonSupportData');
HrSupportData = require('./model/HrSupportData');

ParlorNameData = require('./model/ParlorNameData');

OwnerNotifications = require('./model/OwnerNotifications');

SalonImages = require('./model/SalonImages');

FranchiseEnquiry = require('./model/FranchiseEnquiry');
//Marketing
MarketingUser = require('./model/MarketingUser');
UserInteraction = require('./model/UserInteraction');
MarketingSchedular = require('./model/MarketingSchedular');
NewSongs = require('./model/newSongs');
DiagnosisReport = require('./model/diagnosisReport');

FacebookChat = require('./model/FacebookChat');

WebhookObject = require('./model/WebhookObject');

SalonCouponSms = require('./model/SalonCouponSms');


SettlementLedger = require('./model/SettlementLedger');

SettlementMonthlyTdsTcs = require('./model/SettlementMonthlyTdsTcs');

var app = express();

//disabling cache for react website
app.disable('view cache');
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private')
  next()
})


app.use(compression({filter: shouldCompress}))

function shouldCompress (req, res) {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false
  }

  // fallback to standard filter function
  return compression.filter(req, res)
}

SMScount = 160;
app.use(bodyParser.json({ limit: '200mb' }));
app.use(bodyParser.urlencoded({limit: "200mb", extended: true, parameterLimit:200000}));
var routes = require('./routes/index')
var user = require('./routes/user');
var role1 = require('./routes/role1');
var role2 = require('./routes/role2');
app.use(function(req, res, next) {
    next();
});
var role3 = require('./routes/role3');
var graphs = require('./routes/graphreport');
var api = require('./routes/api');
var testingApi = require('./routes/testingApi');
var apiv2 = require('./routes/apiv2');
var mp3 = require('./routes/mp3');
var employee = require('./routes/employee');
var employeeApp = require('./routes/employeeApp');
var beuApp = require('./routes/beuApp');
var beu = require('./routes/beu');
var loggedApi = require('./routes/loggedapi');
var admin = require('./routes/admin');
var portfolio = require('./routes/portfolio');
var billing = require('./routes/billing');

//var contact = require('./routes/contact');
// var market = require('./routes/marketingTools');
// grab the user model


//swap memory, heat memory, https://blog.risingstack.com/finding-a-memory-leak-in-node-js/, node js memory profile

var proxy = require('express-http-proxy');
app.use('/blog', proxy('http://35.154.125.175'));
app.use('/wp-admin', proxy('http://35.154.125.175/wp-admin'));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
var conf = {
    db: {
        db: 'admin',
        host: '127.0.0.1:27017',
        username: 'accountUser', // optional
        password: 'password' // optional
    },
    secret: '076ee61d63aa10a125ea872411e433b9'
};


// attendance db - attendance, user - root, password - ToBeChanged123

app.use(logger('dev'));

app.use(cookieParser());
app.use(session({
    secret: conf.secret,
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    maxAge: new Date(Date.now() + 3600000),
    store: new MongoStore({
        url: localVar.getDbPath(),
        autoRemove: 'interval',
        autoRemoveInterval: 10 // In minutes. Default
    })
}));

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});


app.use(express.static(path.join(__dirname, 'public')));
app.use('/node_modules', express.static(__dirname + '/node_modules/'));
// app.use('/build', express.static(__dirname + '/public/build/'));


app.use(device.capture());
app.options('*', cors());
app.use('/user', user);
app.use('/role1', role1);
app.use('/role2', role2);
app.use('/role3', role3);
app.use('/billing', billing);
app.use('/employee', employee);
app.use('/employeeApp', employeeApp);
app.use('/beuapp', beuApp);
app.use('/graphs', graphs);
app.use('/portfolio', portfolio);
app.use('/api', api);
app.use('/apiv2', apiv2);
app.use('/testingApi', testingApi);
app.use('/mp3', mp3);
app.use('/loggedapi', loggedApi);
app.use('/beu', beu);
app.use('/admin', admin);
app.use('/', routes);
//app.use('/contact',contact);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


process.env.NODE_ENV = 'production';

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});



process.on('uncaughtException', function(err) {
    console.log(err);
});

// var server = app.listen(1337);
var server = require('http').Server(app);

// http.listen(1337);

var io = require('socket.io')(server);
server.listen(1337)
io.on('connection', function(socket) {
    console.log("connected");

    // once a client has connected, we expect to get a ping from them saying what room they want to join
    socket.on('room', function(room) {
        socket.join(room);
    });

    socket.on('musicroom', function(room2) {
        socket.join(room2);
        console.log("room joined");
        var roomName = room2;
        var parlorId = room2.substring(0, room2.indexOf("music"));

        console.log("parlor idd.....");

        console.log(parlorId);
        listForApp(parlorId, function(err, list) {
            if (err) {
                console.log("error in fetching list for app");
            } else { //user request accepted submitted to be written
                io.sockets.in(roomName).emit('listForApp', CreateObjService.response(false, list));
            }
        })

        io.sockets.emit('musicRoomJoined', room2);
    });

    socket.on('songs', function(data) {
        Song.find({}, function(err, songs) {
            songs = _.map(songs, function(s) {
                return {
                    name: s.name,
                    songId: s.songId,
                    description: s.description,
                }
            })
            io.sockets.emit('songs', CreateObjService.response(false, { songs: songs }));
        });
    });

    socket.on('playlist', function(data) {
        Playlist.findOne({ parlorId: data.parlorId }, function(err, d) {
            var obj = _.map(d.list, function(l) {
                return l;
            });
            io.sockets.emit('playlist', CreateObjService.response(false, { playlist: obj }));
        });
    });


    socket.on('changePlaylistPlayer', function(data) {

        console.log("change playlist called");

        var roomName = (data.parlorId).toString() + "music";
        var songIds = data.songIds;
        var songs = [];

        _.forEach(songIds, function(songId) {
            songs.push({
                songId: (songId).toString()
            })
        });

        Playlist.find({ parlorId: ObjectId(data.parlorId) }, function(err, playlist) {
            if (err) {
                console.log("err in fetching playlist");
            } else {
                console.log(playlist);
                if (playlist.length == 0) {
                    Playlist.create({ parlorId: ObjectId(data.parlorId), list: songs }, function(err, updated) {
                        if (err) {
                            console.log("err");
                        } else {
                            console.log("success 1");
                        }
                    })
                } else if (playlist.length > 0) {
                    console.log(songs);
                    var list = playlist[0].list;
                    if (data.type == -1) {
                        songs.forEach(function(s, i) {
                            for (var i = 0; i < list.length; i++) {
                                if (list[i].songId == s.songId) {
                                    list.splice((i), 1);
                                }
                            }
                        })
                    } else {
                        songs.forEach(function(s, i) {
                            list.splice((data.index + i), 0, s);
                        })
                    }

                    Playlist.update({ parlorId: ObjectId(data.parlorId) }, { $set: { list: list } }, function(err, updated) {
                        if (err) {
                            console.log("err");
                        } else {
                            console.log("success 2");
                            listForApp(data.parlorId, function(err, list) {
                                if (err) {
                                    console.log("error in fetching list for app");
                                } else {
                                    io.sockets.in(roomName).emit('listForApp', CreateObjService.response(false, list));
                                }
                            })
                        }
                    })
                } else {
                    Playlist.update({ parlorId: ObjectId(data.parlorId) }, { list: { $push: songs } }, function(err, updated) {
                        if (err) {
                            console.log("err");
                        } else {
                            console.log("success 3");
                            listForApp(data.parlorId, function(err, list) {
                                if (err) {
                                    console.log("error in fetching list for app");
                                } else {
                                    io.sockets.in(roomName).emit('listForApp', CreateObjService.response(false, list));
                                }
                            })
                        }
                    })
                }
            }
        })
    })

    socket.on('songChangedPlayer', function(data) {
        var roomName = (data.parlorId).toString() + "music";

        Playlist.aggregate([
            { $match: { parlorId: ObjectId(data.parlorId) } },
            { $project: { _id: 0, listSize: { $size: "$list" } } }
        ], (err, listSize) => {
            if (err) {

            } else if (listSize.length > 0) {
                if (lsitSize[0].listSize > 1) {

                    Playlist.update({ parlorId: ObjectId(data.parlorId) }, { $pull: { list: { active: true, songId: { $ne: data.songId } } } }, function(err, updated) {
                        if (err) {
                            console.log("err in removing active");
                        } else {
                            updatePlaylist(data.userId, data.songId, data.parlorId, function(err, index, requestedBy, songId, resp, requestedByLastIndex) {
                                if (err) {
                                    console.log("error in updating playlist");
                                } else {
                                    listForApp(data.parlorId, function(err, list) {
                                        if (err) {
                                            console.log("error in fetching list for app");
                                        } else {
                                            io.sockets.in(roomName).emit('listForApp', CreateObjService.response(false, list));
                                        }
                                    })
                                }
                            })
                        }
                    });

                } else {

                    updatePlaylist(data.userId, data.songId, parlorId, function(err, index, requestedBy, songId, resp, requestedByLastIndex) {
                        if (err) {
                            console.log("error in updating playlist");
                        } else {
                            listForApp(data.parlorId, function(err, list) {
                                if (err) {
                                    console.log("error in fetching list for app");
                                } else {
                                    io.sockets.in(roomName).emit('listForApp', CreateObjService.response(false, list));
                                }
                            })
                        }
                    })

                }
            } else {

            }
        })

    });

    socket.on('songStarted', function(data) {

        console.log("song started called");

        var roomName = (data.parlorId).toString() + "music";

        Playlist.update({ parlorId: ObjectId(data.parlorId) }, { $pull: { list: { active: true, songId: { $ne: data.songId } } } }, function(err, updated) {
            if (err) {
                console.log("err in removing active");
            } else {
                Playlist.update({ parlorId: ObjectId(data.parlorId), "list.songId": data.songId }, { $set: { "list.$.active": true } }, function(err, updated) {
                    if (err) {
                        console.log("err in setting active");
                    } else {
                        listForApp(data.parlorId, function(err, list) {
                            if (err) {
                                console.log("error in fetching list for app");
                            } else { //user request accepted submitted to be written
                                io.sockets.in(roomName).emit('listForApp', CreateObjService.response(false, list));
                            }
                        })
                    }
                });
            }
        })

    });

    socket.on('getCurrentPlaylist', function(data) {
        var roomName = (data.parlorId).toString() + "music";
        listForApp(data.parlorId, function(err, list) {
            if (err) {
                console.log("error in fetching list for app");
            } else { //user request accepted submitted to be written
                io.sockets.in(roomName).emit('listForApp', CreateObjService.response(false, list));
            }
        })
    });

    socket.on('songRequest', function(data) {
            console.log("Song Requested");

            if (typeof data == 'string') {
                var data = JSON.parse(data);
            }

            console.log(data);
            var roomName = (data.parlorId).toString() + "music";
            User.findOne({ "_id": ObjectId(data.userId) }, { firstName: 1, lastName: 1 }, function(err, user) {
                if (err) {
                    console.log("err fetching user");
                } else {
                    Playlist.update({ parlorId: ObjectId(data.parlorId) }, { $push: { list: { songId: data.songId, requestedById: user._id, createdAt: new Date(), requestedBy: user.firstName } } }, function(err, updated) {
                        if (err) {

                            var userRequestData = {
                                message: "Could not be requested",
                                userId: data.userId
                            }

                            console.log("user req data");
                            console.log(userRequestData);

                            io.sockets.in(roomName).emit('userRequest', userRequestData);
                        } else {

                            updatePlaylist(data.userId, data.songId, data.parlorId, function(err, index, requestedBy, songId, resp, requestedByLastIndex) {
                                if (err) {
                                    console.log("error in updating playlist");
                                } else {

                                    var userRequestData = {
                                        index: index,
                                        songId: songId,
                                        requestedBy: requestedBy,
                                        message: "Requested Successfully",
                                        userId: data.userId,
                                        requestedByLastIndex: requestedByLastIndex
                                    }

                                    console.log("user req data");
                                    console.log(userRequestData);

                                    io.sockets.in(roomName).emit('userRequest', userRequestData);

                                    listForApp(data.parlorId, function(err, list) {
                                        if (err) {
                                            console.log("error in fetching list for app");
                                        } else { //user request accepted submitted to be written

                                            console.log("user req list after callback");

                                            console.log(CreateObjService.response(false, list));

                                            io.sockets.in(roomName).emit('listForApp', CreateObjService.response(false, list));
                                        }
                                    })

                                }
                            });

                        }
                    });
                }
            });
        }) //song request
});

function updatePlaylist(userId, songId, parlorId, callback) {
    console.log("update player called");
    console.log(userId, songId, parlorId);
    Playlist.find({ parlorId: ObjectId(parlorId) }, function(err, playlist) {
        if (err) {
            callback(1, null, null, null);
        } else {
            var list = playlist[0].list;

            var activeSong = _.filter(list, function(s) {
                return s.active == true;
            });

            var requestedSongs = _.filter(list, function(s) {
                return s.requestedBy != null && s.active != true;
            });

            var remainingList = _.filter(list, function(s) {
                return s.active == false && s.requestedBy == null;
            });

            var requestedByLastIndex = activeSong.length + requestedSongs.length;

            var list = activeSong.concat(requestedSongs.sort(function(a, b) { return new Date(a.createdAt) - new Date(b.createdAt) }), remainingList);

            var reqIndex = null;
            var requestedBy = null;

            for (var i = 0; i < list.length; i++) {
                if (list[i].requestedById != undefined && (list[i].requestedById).toString() == userId.toString() && list[i].songId == songId) {
                    reqIndex = i;
                    requestedBy = list[i].requestedBy;
                    break;
                }
            }

            Playlist.update({ parlorId: ObjectId(parlorId) }, { $set: { list: list } }, function(err, updated) {
                if (err) {
                    callback(null, reqIndex, requestedBy, songId, false, requestedByLastIndex);
                } else {
                    callback(null, reqIndex, requestedBy, songId, true, requestedByLastIndex);
                }
            });
        }
    });
}

function getFinalList(listToApp) {
    var fList = listToApp.map(function(o) {
        if (o.requestedBy == null) {
            o.requestedBy = "Salon";
        }
        return o;
    })
    return fList;
}

function listForApp(parlorId, callback) {
    console.log("lis for app called");
    Playlist.aggregate([{ $match: { parlorId: ObjectId(parlorId) } },
        { $unwind: "$list" },
        { $match: { $or: [{ "list.active": true }, { "list.requestedBy": { $ne: null } }] } },
        {
            $lookup: {
                from: "songs",
                localField: "list.songId",
                foreignField: "songId",
                as: "songData"
            }
        },
        { $unwind: "$songData" },
        {
            $group: {
                "_id": "$parlorId",
                list: {
                    $push: {
                        "requestedBy": "$list.requestedBy",
                        "active": "$list.active",
                        "_id": "$list._id",
                        "createdAt": "$list.createdAt",
                        "requestedById": "$list.requestedById",
                        "songId": "$list.songId",
                        "songName": "$songData.name",
                        "imageUrl": "$songData.imageUrl"
                    }
                },
                parlorId: { $first: "$parlorId" },
                playingSongIndex: { $first: "$playingSongIndex" }
            }
        }
    ], function(err, list) {

        if (err) {
            console.log("error in fetching list for app");
            callback(1, null);
        } else {

            console.log(list);

            if (list.length == 0) {

                var activeSong = [];
                var requestedSongs = [];

            } else {
                var list = list[0].list;

                var activeSong = _.filter(list, function(s) {
                    return s.active == true;
                })

                var requestedSongs = _.filter(list, function(s) {
                    return s.active == false;
                })
            }

            if (list.length >= 3) {
                var listToApp = activeSong.concat(requestedSongs.sort(function(a, b) { return new Date(a.createdAt) - new Date(b.createdAt) }));
                callback(null, getFinalList(listToApp));
            } else {







                var listRes = activeSong.concat(requestedSongs.sort(function(a, b) { return new Date(a.createdAt) - new Date(b.createdAt) }));
                var fromLen = listRes.length;
                Playlist.aggregate([{ $match: { parlorId: ObjectId(parlorId) } },
                    { $unwind: "$list" },
                    { $match: { "list.requestedBy": { $eq: null }, "list.active": false } },
                    { $limit: (3 - fromLen) },
                    {
                        $lookup: {
                            from: "songs",
                            localField: "list.songId",
                            foreignField: "songId",
                            as: "songData"
                        }
                    },
                    { $unwind: "$songData" },
                    {
                        $group: {
                            "_id": "$parlorId",
                            list: {
                                $push: {
                                    "requestedBy": "$list.requestedBy",
                                    "active": "$list.active",
                                    "_id": "$list._id",
                                    "createdAt": "$list.createdAt",
                                    "requestedById": "$list.requestedById",
                                    "songId": "$list.songId",
                                    "songName": "$songData.name",
                                    "imageUrl": "$songData.imageUrl"
                                }
                            },
                            parlorId: { $first: "$parlorId" },
                            playingSongIndex: { $first: "$playingSongIndex" }
                        }
                    },
                ], function(err, newList) {

                    if (newList.length == 0) {
                        var listToApp = listRes;
                        callback(null, getFinalList(listToApp));
                    } else {
                        var listToApp = listRes.concat(newList[0].list);
                        callback(null, getFinalList(listToApp));
                    }

                });
            }
        }
    })
}


//  app.listen(1337);


//Schedule function to check and send notification to user if appointment is about to come
// var j = schedule.scheduleJob('*/1 * * * *', function(){

// console.log(process.memoryUsage().heapTotal);
// Appointment.find({status : 1, /*appointmentStartTime : { $lt : }*/}, function(err, data){
//send mail to users about appointments
/*_.forEach(data, function(d){
 if(!d.notificationSent){
 Appointment.update({_id : d.id}, { $set : {notificationSent : 1}}, function(){
 //sending message
 });
 }
 });*/
// });
// });
// load aws sdk
// var aws = require('aws-sdk');

// // load aws config
// aws.config.loadFromPath('config.json');

// // load AWS SES
// var ses = new aws.SES({ apiVersion: '2010-12-01' });

// // send to list
// var to = ['shailendra@beusalons.com', 'avdhesh@beusalons.com']

// // this must relate to a verified SES account
// var from = 'info@beusalons.com'


// this sends the email
// @todo - add HTML version
// ses.sendEmail( {
//    Source: from,
//    Destination: { ToAddresses: to },
//    Message: {
//    Body: {
//     Html: {
//      Charset: "UTF-8",
//      Data: "Yo avdhesh. It can, for example, contain links like this one: <a class=\"ulink\" href=\"http://docs.aws.amazon.com/ses/latest/DeveloperGuide\" target=\"_blank\">Amazon SES Developer Guide</a>."
//     },
//     Text: {
//      Charset: "UTF-8",
//      Data: "This is the message body in text format."
//     }
//    },
//    Subject: {
//     Charset: "UTF-8",
//     Data: "Test email"
//    }
//   },
//    }
// , function(err, data) {
//     if(err) throw err
//         console.log('Email sent:');
//         console.log(data);
//  });


schedule.scheduleJob('00 30 * * * *', function(req, res) {
    var request = require('request');
    var RAZORPAY_KEY = localVar.getRazorKey();
    var RAZORPAY_APP_SECRET = localVar.getRazorAppSecret();
    var Razorpay = require('razorpay');
    var instance = new Razorpay({
        key_id: RAZORPAY_KEY,
        key_secret: RAZORPAY_APP_SECRET
    });
    var async = require('async');
    instance.payments.all({
        from: parseInt(HelperService.get30MinBefore().getTime() / 1000),
    }).then((response) => {
        console.log(HelperService.get30MinBefore());
        console.log(parseInt(HelperService.get30MinBefore().getTime() / 1000));
        async.parallel([
            function(done) {
                async.each(response.items, function(item, callback) {
                    console.log(item);
                    if (item.status == "authorized") {
                        Appointment.findOne({ _id: item.notes.appointmentId }, function(err, appointment) {
                            var discountOnOnlinePayment = ((appointment.payableAmount - 100) * 100) == (parseInt(item.amount)) ? true : false;
                            var obj = {
                                razorpay_payment_id: item.id,
                                bookByApp: discountOnOnlinePayment,
                                amount: item.amount,
                            };
                            Appointment.captureRazorPayment(instance, obj, function(response1) {
                                console.log("authorized payment" + response1);
                                callback();
                            });
                        });
                    }

                }, done);
            }
        ], function allTaskCompleted() {
            console.log('done');
            // return res.json(d);
        });
    }).catch((error) => {
        console.log(error);
    });

});

function formCreateOneMonth(userId, parlorId, cb) {
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

            SubmitBeuForm.create(SubmitBeuForm.submitNewFormObj({ data: data, opsId: userId, parlorId: parlorId, oneMonth: true }), function(err, submitForm) {
                if (err) {
                    cb("Something went wrong in fetching form id.", null);
                } else {
                    cb(null, { formId: submitForm._id, formStatus: "0" });
                }
            })

        })
    })
}

function getLatestDate(clientId, fromWhere, cb) {
    if (fromWhere == 1 || fromWhere == 2) {
        var matchQuery = { $match: { "client.phoneNumber": clientId, status: 3 } }
    } else {
        var matchQuery = { $match: { "client.id": ObjectId(clientId), status: 3 } }
    }

    // Appointment.aggregate([
    //     matchQuery,
    //     { $sort: { appointmentStartTime: 1 } },
    //     { $group: { "_id": "$client.id", latestDate: { $last: "$appointmentStartTime" }, couponLoyalityCode: { $last: "$couponLoyalityCode" }, latestParlor: { $last: "$parlorName" }, latestParlorId: { $last: "$parlorId" } } },
    //     { $project: { latestDate: 1, latestParlor: 1, latestParlorId: 1, couponLoyalityCode: 1, "_id": 0 } }
    // ], function(err, latestDate) {
        Appointment.findOne(matchQuery).sort({appointmentStartTime:-1}, function(err , latest){
            var latestDate ={};
            latestDate.latestDate = latest.appointmentStartTime;
            latestDate.latestParlor = latest.parlorName;
            latestDate.latestParlorId = latest.parlorId;
            latestDate.couponLoyalityCode = latest.couponLoyalityCode;

        if (err) {
            cb(1, null);
        } else {
            cb(null, latestDate);
        }
    })
}

function sendEmail(transporter,mailOptions){
    transporter.sendMail(mailOptions, function (error, info) {
        if (error){
            console.log(error);
        }
        else{
            console.log('Message sent: '); 
        }
    });
}


var websiteQueryClients = schedule.scheduleJob('00 55 02 * * *', function(req, res) {
    if (localVar.isServer() && localVar.getInstanceId() == 1) {
        WebsiteQuery.find({ isConverted: false }, { phoneNumber: 1, createdAt: 1, "_id": 0 }, function(err, numbers) {
            if (err) {
                console.log("Error in fetching");
            } else {
                async.each(numbers, function(num, cb) {
                    getLatestDate(num.phoneNumber, 2, function(err, latestDate) {
                        if (err) {
                            cb();
                        } else if (latestDate.length == 0) {
                            cb();
                        } else {

                            var contactedTime = (new Date(num.createdAt)).getTime();
                            var lastAppointmentTime = (new Date(latestDate[0].latestDate)).getTime();
                            if (lastAppointmentTime > contactedTime) {

                                WebsiteQuery.update({ phoneNumber: num.phoneNumber }, { "$set": { "isConverted": true } }, function(err, updated) {
                                    cb();
                                })

                            } else {
                                cb();
                            }

                        }
                    })
                }, function() {
                    console.log("All done");
                })
            }
        })
    }
})

var updateClients = schedule.scheduleJob('00 00 03 * * *', function(req, res) {

    if (localVar.isServer() && localVar.getInstanceId() == 2) {

        console.log("started");

        ContactedClients.find({ "fromWhere": 1 }, { "clientPhoneNumber": 1, "fromWhere": 1, "createdAt": 1, "_id": 1 }, function(err, clientIds) {

            async.each(clientIds, function(clientId, cb) {

                if (clientId.fromWhere == 1) {
                    getLatestDate(clientId.clientPhoneNumber, 1, function(err, latestDate) {
                        if (err) {
                            cb();
                        } else {

                            if (latestDate.length != 0) {
                                var contactedTime = (new Date(clientId.createdAt)).getTime();
                                var lastAppointmentTime = (new Date(latestDate[0].latestDate)).getTime();
                                var lastCouponCode = latestDate[0].couponLoyalityCode

                                console.log(latestDate);

                                if (lastAppointmentTime > contactedTime) {
                                    ContactedClients.update({ "_id": ObjectId(clientId._id) }, { "$set": { "isConverted": true, couponCode: lastCouponCode, couponUsedDate: lastAppointmentTime } }, function(err1, updated) {
                                        if (err1) {
                                            console.log(err1);
                                            cb();
                                        } else {
                                            console.log("updated");
                                            cb();
                                        }
                                    });
                                } else {
                                    cb();
                                }
                            } else {
                                cb();
                            }

                        }
                    })
                } else {
                    getLatestDate(clientId.clientId, 0, function(err, latestDate) {
                        if (err) {
                            cb();
                        } else {
                            if (latestDate.length == 0) {
                                cb();
                            } else {
                                ContactedClients.update({ "clientId": ObjectId(clientId.clientId) }, { "$set": { "toCompareDate": latestDate[0].latestDate, "latestParlor": latestDate[0].latestParlor, "latestParlorId": latestDate[0].latestParlorId, "isConverted": false } }, function(err1, updated) {
                                    if (err1) {
                                        console.log(err1);
                                        cb();
                                    } else {
                                        console.log("updated");
                                        cb();
                                    }
                                });
                            }
                        }
                    });
                }


            }, function() {
                console.log("All Done");
            })

        })
    }

})

var dayOfYear = function() {
    let now = new Date();
    let start = new Date(now.getFullYear(), 0, 0);
    let diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    let oneDay = 1000 * 60 * 60 * 24;
    let day = Math.floor(diff / oneDay);
    return day;
}

var notificationMale = schedule.scheduleJob('00 00 08 * * *', function(req, res) {
    // console.log("been called out side")

    if (localVar.isServer() && localVar.getInstanceId() == 1) {

        console.log("its called");

        var sendAppNotificationAccToFavParlorMale = function(notificationDataMale, notificationGenderMale, offerDealId, skipLim, maxSkipLim) {

            console.log(notificationDataMale + " " + notificationGenderMale + " " + offerDealId + " " + skipLim + " " + maxSkipLim);

            User.find({ "gender": notificationGenderMale }, { "firebaseId": 1, "firebaseIdIOS": 1, "favParlor": 1, "gender": 1, "parlors": 1, "creditsHistory": 1, "subscriptionId": 1 }, function(err, users) {

                console.log("user length is " + users.length);

                if (!err) {

                    var userAndroidDataMale = [];
                    var userIosDataMale = [];

                    async.each(users, function(user, cb1) {
                        // console.log("async started")

                        var userParlors = [];

                        var offerPercentage = "100";

                        async.each(user.parlors, function(parlor, cb2) { //to push parlors user has went into
                            userParlors.push(parlor.parlorId);
                            cb2();
                        }, function() {

                            async.each(user.creditsHistory, function(creditsHis, cb3) { //to check and set the percentage of offer
                                if (creditsHis.reason == "100% cashback") {
                                    offerPercentage = "10";
                                }
                                cb3();
                            }, function() {


                                Parlor.findOne({ "parlorType": user.favParlor, "_id": { $in: userParlors } }, { "_id": 1 }, function(err, pId) {

                                    if (pId) {
                                        console.log("fav parlor matched ")

                                        var userpId = pId["_id"];

                                        Deals.findOne({ "parlorId": ObjectId(userpId), "dealId": offerDealId, "genders": notificationGenderMale }, { "dealPrice": 1 }, function(err, dealPricing) {
                                            if (dealPricing) {

                                                var dealPriceWithTax = Math.ceil(dealPricing["dealPrice"] * 1.18);
                                                var notificationTitle = notificationDataMale["offerTitle"].replace("{{X}}", dealPriceWithTax).replace("{{Y}}", offerPercentage);

                                                if (offerPercentage == "10") {
                                                    var notificationText = notificationDataMale["alternateText"].replace("{{X}}", dealPriceWithTax).replace("{{Y}}", offerPercentage);
                                                } else {
                                                    var notificationText = notificationDataMale["offerText"].replace("{{X}}", dealPriceWithTax).replace("{{Y}}", offerPercentage);
                                                }

                                                if (user.subscriptionId == 1 || user.subscriptionId == 2) {
                                                    cb1();
                                                } else {

                                                    if (user.firebaseId != undefined || user.firebaseIdIOS != undefined) {
                                                        if (user.firebaseId != undefined && user.firebaseIdIOS != undefined) {
                                                            userAndroidDataMale.push({ "firebaseId": user.firebaseId, "text": notificationTitle + "|" + notificationText });
                                                            userIosDataMale.push({ "firebaseId": user.firebaseIdIOS, "text": notificationTitle + "|" + notificationText });
                                                            cb1();
                                                        } else if (user.firebaseId != undefined && user.firebaseIdIOS == undefined) {
                                                            userAndroidDataMale.push({ "firebaseId": user.firebaseId, "text": notificationTitle + "|" + notificationText });
                                                            cb1();
                                                        } else if (user.firebaseId == undefined && user.firebaseIdIOS != undefined) {
                                                            userIosDataMale.push({ "firebaseId": user.firebaseIdIOS, "text": notificationTitle + "|" + notificationText });
                                                            cb1();
                                                        }
                                                    } else {
                                                        cb1();
                                                    }

                                                }

                                            } else {
                                                cb1();
                                            }

                                        });

                                    } else {
                                        console.log("fav parlor not matched");

                                        Deals.findOne({ "parlorId": ObjectId("594cdd793c61904155d48595"), "dealId": offerDealId, "genders": notificationGenderMale }, { "dealPrice": 1 }, function(err, dealPricing) {

                                            if (err) {
                                                console.log(err);
                                                cb1();
                                            } else {

                                                if (dealPricing) {
                                                    var dealPriceWithTax = Math.ceil(dealPricing["dealPrice"] * 1.18);
                                                    var notificationTitle = notificationDataMale["offerTitle"].replace("{{X}}", dealPriceWithTax).replace("{{Y}}", offerPercentage);

                                                    if (offerPercentage == "10") {
                                                        var notificationText = notificationDataMale["alternateText"].replace("{{X}}", dealPriceWithTax).replace("{{Y}}", offerPercentage);
                                                    } else {
                                                        var notificationText = notificationDataMale["offerText"].replace("{{X}}", dealPriceWithTax).replace("{{Y}}", offerPercentage);
                                                    }


                                                    if (user.subscriptionId == 1 || user.subscriptionId == 2) {
                                                        cb1();
                                                    } else {

                                                        if (user.firebaseId != undefined || user.firebaseIdIOS != undefined) {
                                                            if (user.firebaseId != undefined && user.firebaseIdIOS != undefined) {
                                                                userAndroidDataMale.push({ "firebaseId": user.firebaseId, "text": notificationTitle + "|" + notificationText });
                                                                userIosDataMale.push({ "firebaseId": user.firebaseIdIOS, "text": notificationTitle + "|" + notificationText });
                                                                cb1();
                                                            } else if (user.firebaseId != undefined && user.firebaseIdIOS == undefined) {
                                                                userAndroidDataMale.push({ "firebaseId": user.firebaseId, "text": notificationTitle + "|" + notificationText });
                                                                cb1();
                                                            } else if (user.firebaseId == undefined && user.firebaseIdIOS != undefined) {
                                                                userIosDataMale.push({ "firebaseId": user.firebaseIdIOS, "text": notificationTitle + "|" + notificationText });
                                                                cb1();
                                                            }
                                                        } else {
                                                            cb1();
                                                        }

                                                    }

                                                } else {
                                                    cb1();
                                                }


                                            }

                                        });

                                    }

                                });

                            });

                        });

                    }, function() {

                        var androidGroupByText = _.groupBy(userAndroidDataMale, function(o) { return o.text; });

                        var iosGroupByText = _.groupBy(userIosDataMale, function(o) { return o.text; });

                        for (var key1 in androidGroupByText) {
                            var fbIdsAnd = _.map(androidGroupByText[key1], function(o) {
                                return o.firebaseId;
                            })

                            // console.log(fbIdsAnd);
                            // console.log("andriod ids");

                            var notiData1 = key1.split("|");

                            if (dayOfYear() % 2 == 0) {

                                var notificationDataToParse1 = {
                                    type: "subscription",
                                    title: "Subscribe Now!",
                                    body: "Get Free Services Worth Rs 6,000 Now SUBSCRIBE to Your Favourite Salon Chain, Just Pay Rs 1699 and enjoy free services of Rs 500 per month for 1 year.",
                                    sImage: '',
                                    lImage: '',
                                    notificationId: "1"
                                }

                            } else {
                                var notificationDataToParse1 = { type: "offer", title: notiData1[0], body: notiData1[1], sImage: '', lImage: '', notificationId: "1" };
                            }

                            Appointment.sendAppNotificationAdmin(fbIdsAnd, notificationDataToParse1, function(err, response) {
                                console.log("came here in android noti");
                                console.log(response);
                            });

                        }

                        for (var key2 in iosGroupByText) {
                            var fbIdsIos = _.map(iosGroupByText[key2], function(o) {
                                return o.firebaseId;
                            })

                            // console.log(fbIdsIos);
                            // console.log("was ios");
                            var notiData2 = key2.split("|");

                            if (dayOfYear() % 2 == 0) {

                                var notificationDataToParse2 = {
                                    type: "subscription",
                                    title: "Subscribe Now!",
                                    body: "Get Free Services Worth Rs 6,000 Now SUBSCRIBE to Your Favourite Salon Chain, Just Pay Rs 1699 and enjoy free services of Rs 500 per month for 1 year.",
                                    sImage: '',
                                    lImage: '',
                                    notificationId: "1"
                                }

                            } else {
                                var notificationDataToParse2 = { type: "offer", title: notiData2[0], body: notiData2[1], sImage: '', lImage: '', notificationId: "1" };
                            }

                            // console.log(notificationDataToParse2);

                            Appointment.sendAppNotificationIOSAdmin(fbIdsIos, notificationDataToParse2, function(err, response) {
                                console.log("came here in ios noti")
                                console.log(response);
                            });

                        }

                        console.log("all done");

                        if (skipLim <= (maxSkipLim)) {
                            skipLim += 1;
                            sendAppNotificationAccToFavParlorMale(notificationDataMale, notificationGenderMale, offerDealId, skipLim, maxSkipLim);
                        }

                    });

                } else {
                    console.log(err);
                }

            }).skip((skipLim - 1) * 1000).limit(1000);

        }

        var callSendDealNotificationsMale = function() {

            var maleNotificationData = null;

            var maleDealCount = new Promise(function(resolve, reject) {

                console.log("coming here 1");

                DailyDeal.count({ "offerGender": "M" }, function(err, maleDealCount) {

                    if (err) {
                        console.log(err);
                        resolve(null);
                    } else {

                        console.log("going here");

                        // console.log(femaleDealCount);
                        console.log("daily deal count")
                        resolve(maleDealCount);
                    }

                });

            });


            Promise.all([maleDealCount]).then(values => {

                var maleDay = (365 - dayOfYear()) % (values[0]);

                console.log("male day is " + maleDay);

                var maleDealId = new Promise(function(resolve, reject) {

                    DailyDeal.findOne({ "dealDay": (maleDay + 1), "offerGender": "M" }, function(err, result) {

                        if (err) {
                            console.log(err);
                            resolve(null);
                        } else {

                            maleNotificationData = {
                                "offerTitle": result.offerTitle,
                                "offerText": result.offerText,
                                "alternateText": result.alternateText,
                                "offerGender": "M"
                            };

                            resolve(result.dealId);
                        }

                    });

                });

                Promise.all([maleDealId]).then(values => {

                    console.log(values);

                    User.count({ "gender": "M" }, function(err, userCount) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("coming here");

                            console.log(userCount);

                            var maxSkipLim = Math.floor(userCount / 1000);

                            sendAppNotificationAccToFavParlorMale(maleNotificationData, "M", values[0], 1, maxSkipLim);

                            console.log("came here");

                        }

                    });


                }).catch(reason => {
                    console.log(reason)
                });

            }).catch(reason => {
                console.log(reason)
            });

        }

        callSendDealNotificationsMale();

    }

});

var notificationFemale = schedule.scheduleJob('00 05 08 * * *', function(req, res) {
    if (localVar.isServer() && localVar.getInstanceId() == 2) {

        console.log("been called");

        var sendAppNotificationAccToFavParlorFemale = function(notificationDataFemale, notificationGenderFemale, offerDealId, skipLim, maxSkipLim) {

            console.log(notificationDataFemale + " " + notificationGenderFemale + " " + offerDealId + " " + skipLim + " " + maxSkipLim);
            // console.log(notificationDataFemale);

            User.find({ "gender": notificationGenderFemale }, { "firebaseId": 1, "firebaseIdIOS": 1, "favParlor": 1, "gender": 1, "parlors": 1, "creditsHistory": 1 }, function(err, users) {

                console.log("user length is " + users.length);

                if (!err) {

                    var userAndroidDataFemale = [];
                    var userIosDataFemale = [];

                    async.each(users, function(user, cb1) {
                        console.log("async started")

                        var userParlors = [];

                        var offerPercentage = "100";

                        async.each(user.parlors, function(parlor, cb2) { //to push parlors user has went into
                            userParlors.push(parlor.parlorId);
                            cb2();
                        }, function() {

                            async.each(user.creditsHistory, function(creditsHis, cb3) { //to check and set the percentage of offer
                                if (creditsHis.reason == "100% cashback") {
                                    offerPercentage = "10";
                                }
                                cb3();
                            }, function() {


                                Parlor.findOne({ "parlorType": user.favParlor, "_id": { $in: userParlors } }, { "_id": 1 }, function(err, pId) {

                                    if (pId) {

                                        var userpId = pId["_id"];

                                        Deals.findOne({ "parlorId": ObjectId(userpId), "dealId": offerDealId, "genders": notificationGenderFemale }, { "dealPrice": 1 }, function(err, dealPricing) {
                                            if (dealPricing) {

                                                var dealPriceWithTax = Math.ceil(dealPricing["dealPrice"] * 1.18);
                                                var notificationTitle = notificationDataFemale["offerTitle"].replace("{{X}}", dealPriceWithTax).replace("{{Y}}", offerPercentage);

                                                if (offerPercentage == "10") {
                                                    var notificationText = notificationDataFemale["alternateText"].replace("{{X}}", dealPriceWithTax).replace("{{Y}}", offerPercentage);
                                                } else {
                                                    var notificationText = notificationDataFemale["offerText"].replace("{{X}}", dealPriceWithTax).replace("{{Y}}", offerPercentage);
                                                }

                                                if (user.subscriptionId == 1 || user.subscriptionId == 2) {
                                                    cb1();
                                                } else {

                                                    if (user.firebaseId != undefined || user.firebaseIdIOS != undefined) {
                                                        if (user.firebaseId != undefined && user.firebaseIdIOS != undefined) {
                                                            userAndroidDataMale.push({ "firebaseId": user.firebaseId, "text": notificationTitle + "|" + notificationText });
                                                            userIosDataMale.push({ "firebaseId": user.firebaseIdIOS, "text": notificationTitle + "|" + notificationText });
                                                            cb1();
                                                        } else if (user.firebaseId != undefined && user.firebaseIdIOS == undefined) {
                                                            userAndroidDataMale.push({ "firebaseId": user.firebaseId, "text": notificationTitle + "|" + notificationText });
                                                            cb1();
                                                        } else if (user.firebaseId == undefined && user.firebaseIdIOS != undefined) {
                                                            userIosDataMale.push({ "firebaseId": user.firebaseIdIOS, "text": notificationTitle + "|" + notificationText });
                                                            cb1();
                                                        }
                                                    } else {
                                                        cb1();
                                                    }

                                                }


                                            } else {
                                                cb1();
                                            }

                                        });

                                    } else {

                                        Deals.findOne({ "parlorId": ObjectId("594cdd793c61904155d48595"), "dealId": offerDealId, "genders": notificationGenderFemale }, { "dealPrice": 1 }, function(err, dealPricing) {

                                            if (err) {
                                                console.log(err);
                                                cb1();
                                            } else {

                                                if (dealPricing) {
                                                    var dealPriceWithTax = Math.ceil(dealPricing["dealPrice"] * 1.18);
                                                    var notificationTitle = notificationDataFemale["offerTitle"].replace("{{X}}", dealPriceWithTax).replace("{{Y}}", offerPercentage);

                                                    if (offerPercentage == "10") {
                                                        var notificationText = notificationDataFemale["alternateText"].replace("{{X}}", dealPriceWithTax).replace("{{Y}}", offerPercentage);
                                                    } else {
                                                        var notificationText = notificationDataFemale["offerText"].replace("{{X}}", dealPriceWithTax).replace("{{Y}}", offerPercentage);
                                                    }

                                                    if (user.subscriptionId == 1 || user.subscriptionId == 2) {
                                                        cb1();
                                                    } else {

                                                        if (user.firebaseId != undefined || user.firebaseIdIOS != undefined) {
                                                            if (user.firebaseId != undefined && user.firebaseIdIOS != undefined) {
                                                                userAndroidDataMale.push({ "firebaseId": user.firebaseId, "text": notificationTitle + "|" + notificationText });
                                                                userIosDataMale.push({ "firebaseId": user.firebaseIdIOS, "text": notificationTitle + "|" + notificationText });
                                                                cb1();
                                                            } else if (user.firebaseId != undefined && user.firebaseIdIOS == undefined) {
                                                                userAndroidDataMale.push({ "firebaseId": user.firebaseId, "text": notificationTitle + "|" + notificationText });
                                                                cb1();
                                                            } else if (user.firebaseId == undefined && user.firebaseIdIOS != undefined) {
                                                                userIosDataMale.push({ "firebaseId": user.firebaseIdIOS, "text": notificationTitle + "|" + notificationText });
                                                                cb1();
                                                            }
                                                        } else {
                                                            cb1();
                                                        }

                                                    }


                                                } else {
                                                    cb1();
                                                }


                                            }

                                        });

                                    }

                                });

                            });

                        });

                    }, function() {

                        var androidGroupByText = _.groupBy(userAndroidDataFemale, function(o) { return o.text; });

                        var iosGroupByText = _.groupBy(userIosDataFemale, function(o) { return o.text; });

                        for (var key1 in androidGroupByText) {
                            var fbIdsAnd = _.map(androidGroupByText[key1], function(o) {
                                return o.firebaseId;
                            })

                            var notiData1 = key1.split("|");

                            if (dayOfYear() % 2 == 0) {

                                var notificationDataToParse1 = {
                                    type: "subscription",
                                    title: "Subscribe Now!",
                                    body: "Get Free Services Worth Rs 6,000 Now SUBSCRIBE to Your Favourite Salon Chain, Just Pay Rs 1699 and enjoy free services of Rs 500 per month for 1 year.",
                                    sImage: '',
                                    lImage: '',
                                    notificationId: "1"
                                }

                            } else {
                                var notificationDataToParse1 = { type: "offer", title: notiData1[0], body: notiData1[1], sImage: '', lImage: '', notificationId: "1" };
                            }

                            Appointment.sendAppNotificationAdmin(fbIdsAnd, notificationDataToParse1, function(err, response) {
                                console.log("came here in android noti");
                                console.log(response);
                            });

                        }

                        for (var key2 in iosGroupByText) {
                            var fbIdsIos = _.map(iosGroupByText[key2], function(o) {
                                return o.firebaseId;
                            })

                            console.log(fbIdsIos);

                            var notiData2 = key2.split("|");

                            if (dayOfYear() % 2 == 0) {

                                var notificationDataToParse2 = {
                                    type: "subscription",
                                    title: "Subscribe Now!",
                                    body: "Get Free Services Worth Rs 6,000 Now SUBSCRIBE to Your Favourite Salon Chain, Just Pay Rs 1699 and enjoy free services of Rs 500 per month for 1 year.",
                                    sImage: '',
                                    lImage: '',
                                    notificationId: "1"
                                }

                            } else {
                                var notificationDataToParse2 = { type: "offer", title: notiData2[0], body: notiData2[1], sImage: '', lImage: '', notificationId: "1" };
                            }

                            // console.log(notificationDataToParse2);

                            Appointment.sendAppNotificationIOSAdmin(fbIdsIos, notificationDataToParse2, function(err, response) {
                                console.log("came here in ios noti")
                                console.log(response);
                            });

                        }

                        console.log("all done");

                        if (skipLim <= maxSkipLim) {
                            skipLim += 1;
                            sendAppNotificationAccToFavParlorFemale(notificationDataFemale, notificationGenderFemale, offerDealId, skipLim, maxSkipLim);
                        }
                    });

                } else {
                    console.log(err);
                }

            }).skip((skipLim - 1) * 1000).limit(1000);

        }

        var callSendDealNotificationsFemale = function() {

            var femaleNotificationData = null;

            var femaleDealCount = new Promise(function(resolve, reject) {

                console.log("coming here 1");

                DailyDeal.count({ "offerGender": "F" }, function(err, femaleDealCount) {

                    if (err) {
                        console.log(err);
                        resolve(null);
                    } else {

                        console.log("going here");
                        console.log("daily deal count")
                        resolve(femaleDealCount);

                    }

                });

            });


            Promise.all([femaleDealCount]).then(values => {

                var femaleDay = (365 - dayOfYear()) % (values[0]);

                console.log("female day is " + femaleDay);

                var femaleDealId = new Promise(function(resolve, reject) {

                    DailyDeal.findOne({ "dealDay": (femaleDay + 1), "offerGender": "F" }, function(err, result) {

                        if (err) {
                            console.log(err);
                            resolve(null);
                        } else {

                            femaleNotificationData = {
                                "offerTitle": result.offerTitle,
                                "offerText": result.offerText,
                                "alternateText": result.alternateText,
                                "offerGender": "F"
                            };

                            resolve(result.dealId);
                        }

                    });

                });

                Promise.all([femaleDealId]).then(values => {

                    console.log(values);

                    User.count({ "gender": "F" }, function(err, userCount) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("coming here");

                            console.log(userCount);

                            var maxSkipLim = Math.floor(userCount / 1000);

                            sendAppNotificationAccToFavParlorFemale(femaleNotificationData, "F", values[0], 1, maxSkipLim);

                            console.log("came here");

                        }

                    });


                }).catch(reason => {
                    console.log(reason)
                });

            }).catch(reason => {
                console.log(reason)
            });

        }

        callSendDealNotificationsFemale();

    }

});

var oneMonthForm = schedule.scheduleJob('01 00 00 1 * *', function(req, res) {
    // var oneMonthForm = schedule.scheduleJob('00 48 17 * * *', function(req,res){
    if (localVar.isServer() && localVar.getInstanceId() == 2) {
        var createOneMonthForm = function() {
            Beu.find({}, { parlorIds: 1 }, function(err, ops) {
                async.each(ops, function(o, cb1) {
                    if (o.parlorIds.length > 0) {
                        async.each(o.parlorIds, function(p, cb2) {
                            formCreateOneMonth(o._id, p, function(err, formData) {
                                if (err) {
                                    cb2();
                                }
                                if (formData) {
                                    cb2();
                                }
                            });

                        }, function() {
                            cb1();
                        });
                    } else {
                        cb1();
                    }
                }, function() {
                    console.log("All completed.");
                })
            })
        }
        createOneMonthForm();
    }
})

var updateMarketingCategories = (userId, cb) => {

    let marketingCategoryQuery = (userId, categoriesIds) => {

        return [
            { $match: { "client.id": userId, status: 3 } },
            { $unwind: "$services" },
            { $match: { "services.categoryId": { $in: categoriesIds } } },
            { $group: { "_id": "$client.id", lastAppointmentDate: { $last: "$appointmentStartTime" } } },
            { $project: { "_id": 0, lastAppointmentDate: 1 } }
        ]

    }

    let errorData = (categoryIds, result) => {
        return {
            "categoryIds": categoryIds,
            "lastAppointmentDate": (result.length == 0) ? null : result[0].lastAppointmentDate,
            "lastDate": {
                "mail": null,
                "message": null,
                "notification": null
            }
        }
    }

    let marketingCategoryResult = (userId, categoryIds, result, cb) => {

        if (result.length == 0) {

            let data = {
                "categoryIds": categoryIds,
                "lastAppointmentDate": (result.length == 0) ? null : result[0].lastAppointmentDate,
                "lastDate": {
                    "mail": null,
                    "message": null,
                    "notification": null
                }
            }

            cb(null, data);

        } else {

            MarketingUser.aggregate([
                { $match: { "_id": userId } },
                { $project: { marketingCategories: 1, _id: 0 } },
                { $unwind: "$marketingCategories" },
                { $match: { "marketingCategories.categoryIds": { $all: categoryIds } } },
                { $project: { "marketingCategories.lastDate": 1 } }
            ], (err, lastDateData) => {

                if (err) {
                    cb(1, null);
                } else if (lastDateData.length == 0) {

                    let data = {
                        "categoryIds": categoryIds,
                        "lastAppointmentDate": result[0].lastAppointmentDate,
                        "lastDate": {
                            "mail": null,
                            "message": null,
                            "notification": null
                        }
                    }

                    cb(null, data);

                } else {

                    let data = {
                        "categoryIds": categoryIds,
                        "lastAppointmentDate": result[0].lastAppointmentDate,
                        "lastDate": lastDateData[0].marketingCategories.lastDate
                    }

                    cb(null, data);

                }

            })

        }

    }

    // hair straightening ObjectId("58707ed90901cc46c44af27e") hair color ObjectId("58707ed90901cc46c44af27d")

    var HairStraightening_HairColor = new Promise((resolve, reject) => {

        let categoryIds = [ObjectId("58707ed90901cc46c44af27e"), ObjectId("58707ed90901cc46c44af27d")];
        Appointment.aggregate(marketingCategoryQuery(userId, categoryIds), function(err, result) {
            if (err) {
                reject(err);
            } else {

                marketingCategoryResult(userId, categoryIds, result, (err, categoryData) => {
                    if (err) {

                        resolve(errorData(categoryIds, result));

                    } else {
                        resolve(categoryData);
                    }
                })

            }
        })

    });

    //hair cut ObjectId("58707ed90901cc46c44af27b") root touch up ObjectId("58707ed90901cc46c44af27f") hair spa ObjectId("58707ed90901cc46c44af27c")

    var HairCut_RootTouchUp_HairSpa = new Promise((resolve, reject) => {

        let categoryIds = [ObjectId("58707ed90901cc46c44af27b"), ObjectId("58707ed90901cc46c44af27f"), ObjectId("58707ed90901cc46c44af27c")];
        Appointment.aggregate(marketingCategoryQuery(userId, categoryIds), function(err, result) {
            if (err) {
                reject(err);
            } else {

                marketingCategoryResult(userId, categoryIds, result, (err, categoryData) => {
                    if (err) {
                        resolve(errorData(categoryIds, result));
                    } else {
                        resolve(categoryData);
                    }
                })

            }
        })

    });

    //wax ObjectId("58707ed90901cc46c44af279") facial ObjectId("58707ed90901cc46c44af278")  mani pedi ObjectId("58707ed90901cc46c44af284")

    var Wax_Facial_ManiPedi = new Promise((resolve, reject) => {

        let categoryIds = [ObjectId("58707ed90901cc46c44af279"), ObjectId("58707ed90901cc46c44af278"), ObjectId("58707ed90901cc46c44af284")]
        Appointment.aggregate(marketingCategoryQuery(userId, categoryIds), function(err, result) {
            if (err) {
                reject(err);
            } else {

                marketingCategoryResult(userId, categoryIds, result, (err, categoryData) => {
                    if (err) {
                        resolve(errorData(categoryIds, result));
                    } else {
                        resolve(categoryData);
                    }
                })

            }
        })
    });

    //makeup bridal ObjectId("58707ed90901cc46c44af272") light ObjectId("58707ed90901cc46c44af273") occasion ObjectId("58707ed90901cc46c44af274")

    var Makeup = new Promise((resolve, reject) => {

        let categoryIds = [ObjectId("58707ed90901cc46c44af272"), ObjectId("58707ed90901cc46c44af273"), ObjectId("58707ed90901cc46c44af274")];
        Appointment.aggregate(marketingCategoryQuery(userId, categoryIds), function(err, result) {
            if (err) {
                reject(err);
            } else {

                marketingCategoryResult(userId, categoryIds, result, (err, categoryData) => {
                    if (err) {
                        resolve(errorData(categoryIds, result));
                    } else {
                        resolve(categoryData);
                    }
                })

            }
        })
    });

    //express spa ObjectId("58707ed90901cc46c44af281") scrubs wraps ObjectId("58707ed90901cc46c44af283") massages ObjectId("58707ed90901cc46c44af282")

    var Spa_ScrubsWraps_Massages = new Promise((resolve, reject) => {

        let categoryIds = [ObjectId("58707ed90901cc46c44af281"), ObjectId("58707ed90901cc46c44af283"), ObjectId("58707ed90901cc46c44af282")];
        Appointment.aggregate(marketingCategoryQuery(userId, categoryIds), function(err, result) {
            if (err) {
                reject(err);
            } else {

                marketingCategoryResult(userId, categoryIds, result, (err, categoryData) => {
                    if (err) {
                        resolve(errorData(categoryIds, result));
                    } else {
                        resolve(categoryData);
                    }
                })

            }
        })
    });

    Promise.all([HairStraightening_HairColor, HairCut_RootTouchUp_HairSpa, Wax_Facial_ManiPedi, Makeup, Spa_ScrubsWraps_Massages]).then(values => {
        cb(null, values);
    }).catch(reason => {
        cb(1, null);
    });

}

var updateServicesTaken = (userId, cb) => {
    Appointment.aggregate([
        { $match: { "client.id": ObjectId(userId), status: 3 } },
        { $unwind: "$services" },
        { $group: { "_id": { serviceId: "$services.serviceId" }, lastAppointmentDate: { $last: "$appointmentStartTime" }, count: { $sum: 1 } } },
        { $project: { "serviceId": "$_id.serviceId", lastAppointmentDate: 1, count: 1 } },
        {
            $lookup: {
                from: "services",
                localField: "serviceId",
                foreignField: "_id",
                as: "serviceData"
            }
        },
        { $unwind: "$serviceData" },
        { $project: { "_id": 0, "serviceId": 1, name: "$serviceData.name", lastAppointmentDate: 1, count: 1, repeatDays: "$serviceData.repeatDaysInterval", categoryId: "$serviceData.categoryId", serviceCode: "$serviceData.serviceCode" } }
    ], (err, services) => {
        if (err) {
            cb(1, null);
        } else {
            cb(null, services);
        }
    })
}

var getUserDetails = function(clientId, cb) {

    console.log("clientId", clientId);

    Appointment.aggregate([
        { $match: { "client.id": ObjectId(clientId), status: 3 } },
        { $group: { "_id": "$client.id", appointmentCount: { $sum: 1 }, lastAppointmentDate: { $last: "$appointmentStartTime" }, lastParlor: { $last: "$parlorName" }, lastParlorId: { $last: "$parlorId" } } },
        { $project: { clientId: "$_id", "_id": 0, appointmentCount: 1, lastAppointmentDate: 1, lastParlor: 1, lastParlorId: 1 } }
    ], function(err, ud) {
        if (err) {
            cb(1, null);
        } else {
            cb(null, ud);
        }
    })

}

// var syncMarketingUsers = schedule.scheduleJob('00 15 04 * * *', (req, res) => {

//     console.log("been called");

//     if (localVar.isServer() && localVar.getInstanceId() == 1) {
//         let d = new Date();
//         let date = d.getDate();
//         let month = d.getMonth();
//         let year = d.getFullYear();
//         let tdo = new Date(year, month, date - 3); //three days old date
//         var counter = 0;
//         let query = { createdAt: { $gt: new Date(tdo.getFullYear(), tdo.getMonth(), tdo.getDate()), $lt: new Date(tdo.getFullYear(), tdo.getMonth(), tdo.getDate(), 23, 59, 59) } };
//         let project = { firstName: 1, lastName: 1, emailId: 1, iosVersion: 1, androidVersion: 1, subscriptionId: 1, phoneNumber: 1, gender: 1, loyalityPoints: 1, latitude: 1, longitude: 1, firebaseId: 1, firebaseIdIOS: 1 };

//         User.find(query, project, (err, users) => {
//             console.log("came users ", users.length);
//             if (!err) {
//                 async.each(users, (u, cb) => {
//                     MarketingUser.findOne({ userId: u._id }, (err, user) => {
//                         if (err) {
//                             cb();
//                         } else if (user) {
//                             counter++;
//                             console.log(counter);
//                             console.log("Already there");
//                             cb();
//                         } else {
//                             let marketingCategories = [];
//                             let servicesTaken = [];
//                             getUserDetails(u._id, (err, userDetail) => {
//                                 if (!err) {
//                                     var userDetails = {
//                                         "userId": u._id,
//                                         "firstName": u.firstName == undefined ? "" : u.firstName,
//                                         "lastName": u.lastName == undefined ? "" : u.lastName,
//                                         "emailId": u.emailId == undefined ? "" : u.emailId,
//                                         "phoneNumber": u.phoneNumber == undefined ? "" : u.phoneNumber,
//                                         "lastAppointmentDate": userDetail.length == 0 ? null : userDetail[0].lastAppointmentDate,
//                                         "lastParlor": userDetail.length == 0 ? null : userDetail[0].lastParlor,
//                                         "lastParlorId": userDetail.length == 0 ? null : userDetail[0].lastParlorId,
//                                         "appointmentCount": userDetail.length == 0 ? 0 : userDetail[0].appointmentCount,
//                                         "gender": ((u.gender).trim() === "" || u.gender == undefined) ? "M" : u.gender,
//                                         "loyalityPoints": u.loyalityPoints == undefined ? "" : u.loyalityPoints,
//                                         "latitude": u.latitude,
//                                         "longitude": u.longitude,
//                                         "firebaseId": u.firebaseId,
//                                         "firebaseIdIOS": u.firebaseIdIOS,
//                                         "iosVersion": u.iosVersion,
//                                         "subscriptionId": u.subscriptionId == undefined ? null : u.subscriptionId,
//                                         "androidVersion": u.androidVersion
//                                     }
//                                 } else {
//                                     var userDetails = {
//                                         "userId": u._id,
//                                         "firstName": u.firstName == undefined ? "" : u.firstName,
//                                         "lastName": u.lastName == undefined ? "" : u.lastName,
//                                         "emailId": u.emailId == undefined ? "" : u.emailId,
//                                         "phoneNumber": u.phoneNumber == undefined ? "" : u.phoneNumber,
//                                         "gender": ((u.gender).trim() === "" || u.gender == undefined) ? "M" : u.gender,
//                                         "loyalityPoints": u.loyalityPoints == undefined ? "" : u.loyalityPoints,
//                                         "latitude": u.latitude,
//                                         "longitude": u.longitude,
//                                         "firebaseId": u.firebaseId,
//                                         "firebaseIdIOS": u.firebaseIdIOS,
//                                         "iosVersion": u.iosVersion,
//                                         "subscriptionId": u.subscriptionId == undefined ? null : u.subscriptionId,
//                                         "androidVersion": u.androidVersion
//                                     }
//                                 }

//                                 updateMarketingCategories(u._id, (err, marketingArray) => {
//                                     if (!err) {
//                                         marketingCategories =  marketingArray;
//                                     }
//                                     updateServicesTaken(u._id, (err, servicesArray) => {
//                                         if (!err) {
//                                             servicesTaken = servicesArray;
//                                         }
//                                         userDetails.marketingCategories = marketingCategories;
//                                         userDetails.servicesTaken = servicesTaken;

//                                         console.log(userDetails);

//                                         MarketingUser.create(userDetails, (err, created) => {
//                                             if (err) {
//                                                 counter++;
//                                                 console.log(counter);
//                                                 cb();
//                                             } else {
//                                                 counter++;
//                                                 console.log(counter);
//                                                 cb();
//                                             }
//                                         })
//                                     })
//                                 });
//                             })
//                         }
//                     })
//                 }, () => {
//                     console.log("All done");
//                 })
//             } else {
//                 console.log(err);
//             }
//         })
//     }
// })

var updateMarketingUsers = schedule.scheduleJob('00 46 02 * * *', (req, res) => {
    if (localVar.isServer() && localVar.getInstanceId() == 3) {
        var counter = 0;
        var premiumCustomer = false,
            maximumBill = 0,
            totalRevenue = 0;
        let d = new Date();
        let date = d.getDate();
        let month = d.getMonth();
        let year = d.getFullYear();
        let daysToGoBack = 3;
        let tdo = new Date(year, month, date - daysToGoBack);

        Appointment.aggregate([
            { $match: { "appointmentStartTime": { $gt: new Date(tdo.getFullYear(), tdo.getMonth(), tdo.getDate()), $lt: new Date(tdo.getFullYear(), tdo.getMonth(), tdo.getDate(), 23, 59, 59) }, status: 3 } },
            // { $match: { "appointmentStartTime": { $gte: new Date(2018,9,1), $lte: new Date(2018,11,31,23,59,59)}, status: 3 } },
            // { $match: { status: 3 , _id: ObjectId("5b9e3c3a987b255fa8275dfa")} },
            { $sort: { appointmentStartTime: 1 } },
            {
                $group: {
                    "_id": "$client.id",
                    appointmentCount: { $sum: 1 },
                    lastAppointmentDate: { $last: "$appointmentStartTime" },
                    lastParlor: { $last: "$parlorName" },
                    lastParlorId: { $last: "$parlorId" },
                    payableAmount: { $first: '$payableAmount' },
                    bill: { $first: '$subtotal' },
                    serviceRevenue: { $first: '$serviceRevenue' },
                    productRevenue: { $first: '$productRevenue' }
                }
            },
            { $project: { clientId: "$_id", "_id": 0, appointmentCount: 1, lastAppointmentDate: 1, lastParlor: 1, lastParlorId: 1, payableAmount: 1, bill: 1, totalRevenue: { $add: ['$serviceRevenue', '$productRevenue'] } } }
        ], (err, apps) => {

            console.log("came data");
            console.log(apps.length);

            if (err) {
                res.json("Server Error.");
            } else {
                async.each(apps, (client, cb) => {

                    User.findOne({ _id: client.clientId }, { latitude: 1, longitude: 1, androidVersion: 1, iosVersion: 1, subscriptionId: 1 }, (err, existingUser) => {

                        MarketingUser.findOne({ userId: client.clientId }, { "userId": 1, updatedAt: 1, "_id": 0, marketingCategories: 1, premiumCustomer: 1, maximumBill: 1, totalRevenue: 1, appointmentCount: 1, latitude: 1, longitude: 1, cityId: 1 }, (err, user) => {
                            console.log("user" , user)
                            console.log(existingUser)
                            if (err) {
                                counter++;
                                console.log(counter);
                                cb();
                            } else if (user && existingUser) {
                                console.log("else ifffffffffffff")
                                var marketingCategories = user.marketingCategories == undefined ? [] : user.marketingCategories;
                                var servicesTaken = user.servicesTaken == undefined ? [] : user.servicesTaken;

                                updateMarketingCategories(client.clientId, (err, marketingArray) => {

                                    if (!err) {
                                        marketingCategories = marketingArray;
                                    }

                                    updateServicesTaken(client.clientId, (err, servicesArray) => {

                                        if (!err) {
                                            servicesTaken = servicesArray;
                                        }

                                        if (client.payableAmount > 3000 || user.appointmentCount > 3) premiumCustomer = true;

                                        if (client.bill > user.maximumBill) user.maximumBill = client.bill;

                                        if (user.totalRevenue) user.totalRevenue = client.totalRevenue + user.totalRevenue;

                                        if (user.latitude != 0 && user.longitude != 0) user.cityId = ConstantService.getCityId(user.latitude, user.longitude);

                                        if (user.latitude == 0 && existingUser.latitude != 0) {
                                            user.cityId = ConstantService.getCityId(existingUser.latitude, existingUser.longitude);
                                            user.latitude = existingUser.latitude;
                                            user.longitude = existingUser.longitude;
                                        }

                                        var setValues = {
                                            marketingCategories: marketingCategories,
                                            servicesTaken: servicesTaken,
                                            appointmentCount: client.appointmentCount + user.appointmentCount,
                                            lastAppointmentDate: client.lastAppointmentDate,
                                            lastParlor: client.lastParlor,
                                            lastParlorId: client.lastParlorId,
                                            premiumCustomer: premiumCustomer,
                                            maximumBill: user.maximumBill,
                                            totalRevenue: user.totalRevenue,
                                            cityId: user.cityId,
                                            latitude: user.latitude,
                                            longitude: user.longitude,
                                            subscriptionId: (existingUser.subscriptionId == undefined) ? 0 : existingUser.subscriptionId,
                                            androidVersion: existingUser.androidVersion,
                                            iosVersion: existingUser.iosVersion
                                        };

                                        console.log("setValues" , setValues)
                                        console.log("userId" , client.clientId)

                                        MarketingUser.update({ "userId": client.clientId },  setValues , (err, updated) => {
                                            if (err) {
                                                // console.log(err)
                                                console.log("update failed", err);
                                                counter++;
                                                console.log(counter);
                                                cb();
                                            } else {
                                                console.log("updated" , updated);
                                                counter++;
                                                console.log(counter);
                                                cb();
                                            }
                                        })

                                    });

                                });
                            } else {
                                console.log("else")
                                var marketingCategories = [];
                                var servicesTaken = [];

                                updateMarketingCategories(client.clientId, (err, marketingArray) => {

                                    if (!err) {
                                        marketingCategories = marketingArray;
                                    }

                                    updateServicesTaken(client.clientId, (err, servicesArray) => {

                                        if (!err) {
                                            servicesTaken = servicesArray;
                                        }
                                        if (client.payableAmount > 3000) premiumCustomer = true;

                                        User.findOne({ "_id": client.clientId }, { firstName: 1, lastName: 1, emailId: 1, iosVersion: 1, androidVersion: 1, subscriptionId: 1, phoneNumber: 1, gender: 1, loyalityPoints: 1, latitude: 1, longitude: 1, firebaseId: 1, firebaseIdIOS: 1 }, function(err, newUserDetails) {

                                            var userDetails = {
                                                "userId": client.clientId,
                                                "firstName": newUserDetails.firstName == undefined ? "" : newUserDetails.firstName,
                                                "lastName": newUserDetails.lastName == undefined ? "" : newUserDetails.lastName,
                                                "emailId": newUserDetails.emailId == undefined ? "" : newUserDetails.emailId,
                                                "phoneNumber": newUserDetails.phoneNumber == undefined ? "" : newUserDetails.phoneNumber,
                                                "lastAppointmentDate": client.lastAppointmentDate,
                                                "lastParlor": client.lastParlor,
                                                "lastParlorId": client.lastParlorId,
                                                "appointmentCount": client.appointmentCount,
                                                "gender": ((newUserDetails.gender).trim() === "" || newUserDetails.gender == undefined) ? "M" : newUserDetails.gender,
                                                "loyalityPoints": newUserDetails.loyalityPoints == undefined ? "" : newUserDetails.loyalityPoints,
                                                "latitude": newUserDetails.latitude,
                                                "longitude": newUserDetails.longtude,
                                                "firebaseId": newUserDetails.firebaseId,
                                                "firebaseIdIOS": newUserDetails.firebaseIdIOS,
                                                "iosVersion": newUserDetails.iosVersion,
                                                "subscriptionId": newUserDetails.subscriptionId == undefined ? 0 : newUserDetails.subscriptionId,
                                                "androidVersion": newUserDetails.androidVersion,
                                                "marketingCategories": marketingCategories,
                                                "servicesTaken": servicesTaken,
                                                'premiumCustomer': premiumCustomer,
                                                'maximumBill': client.bill,
                                                'totalRevenue': client.totalRevenue,
                                                'cityId': (newUserDetails.latitude != 0 && newUserDetails.longitude != 0) ? ConstantService.getCityId(newUserDetails.latitude, newUserDetails.longitude) : 1
                                            }

                                            MarketingUser.create(userDetails, (err, created) => {
                                                if (err) {
                                                    console.log("creation failed");
                                                    counter++;
                                                    console.log(counter);
                                                    cb();
                                                } else {
                                                    console.log("created");
                                                    counter++;
                                                    console.log(counter);
                                                    cb();
                                                }
                                            })
                                        })
                                    })
                                });
                            }
                        })
                    })
                }, () => {
                    console.log("All done.");
                })
            }
        })
    }
})


var updateThisMonthAverages = schedule.scheduleJob('00 45 23 * * *', function(req, res) {
    if (localVar.isServer() && localVar.getInstanceId() == 1) {
        var updateThisMonthAverages = function() {

            var thisMonthStart = function() {
                var d = new Date();
                return new Date(d.getFullYear(), d.getMonth(), 1);
            }

            var thisMonthStart = thisMonthStart();

            var appointmentPeriod = { $gte: new Date(thisMonthStart.getFullYear(), thisMonthStart.getMonth(), thisMonthStart.getDate(), 0, 0, 0), $lte: new Date() };

            //{$divide : [{$multiply : ["$services.price", "$services.employees.distribution"]}, 100]}

            Admin.find({ role: { $nin: [7] } }, { _id: 1 }, function(err, employees) {

                async.eachSeries(employees, function(emp, cb) {

                    var avgBillValueThisMonth = 0;
                    var sharedBillRatioThisMonth = 0;
                    var avgServicePerBillThisMonth = 0;
                    var empId = emp._id;

                    Appointment.aggregate([
                        { $match: { status: 3 } },
                        { $unwind: "$employees" },
                        { $match: { "employees.employeeId": ObjectId(empId), "appointmentStartTime": appointmentPeriod } },
                        { $group: { _id: "$employees.employeeId", revenueByEmployee: { $sum: "$employees.revenue" }, totalServices: { $sum: 1 } } }
                    ], function(err, response1) {

                        if (err) {
                            console.log(err);
                            cb();
                        } else {
                            if (response1.length > 0) {

                                avgBillValueThisMonth = (response1[0].revenueByEmployee / response1[0].totalServices);

                                Appointment.aggregate([
                                    { $match: { status: 3 } },
                                    { $unwind: "$services" },
                                    { $unwind: "$services.employees" },
                                    { $match: { "services.employees.employeeId": ObjectId(empId), "appointmentStartTime": appointmentPeriod } },
                                    { $group: { _id: "$services.employees.employeeId", count: { $sum: 1 }, app: { $push: "$_id" } } },
                                    { $unwind: "$app" },
                                    { $group: { _id: "$app", services: { "$first": "$count" } } },
                                    { $group: { _id: null, services: { $first: "$services" }, appt: { $sum: 1 } } }
                                ], function(err, response2) {

                                    if (err) {
                                        console.log(err);
                                        cb();
                                    } else {

                                        if (response2.length > 0) {

                                            avgServicePerBillThisMonth = (response2[0].services / response2[0].appt);

                                            Appointment.aggregate([
                                                { $match: { status: 3 } },
                                                { $unwind: "$services" },
                                                { $match: { "services.employees.employeeId": ObjectId(empId), "appointmentStartTime": appointmentPeriod } }
                                            ], function(err, appts) {

                                                if (err) {
                                                    console.log(err);
                                                    cb();
                                                } else {

                                                    if (appts.length > 0) {

                                                        var revenueByEmployee = 0;
                                                        var revenueByOthers = 0;

                                                        async.each(appts, function(appt, cb1) {

                                                            if (appt.services.loyalityPoints == undefined || appt.services.loyalityPoints == 0) {

                                                                async.each(appt.services.employees, function(emp, cb2) {

                                                                    if ((emp.employeeId).toString() == (empId).toString()) {

                                                                        revenueByEmployee += (appt.services.price) * (emp.distribution / 100);
                                                                        cb2();
                                                                    } else {
                                                                        revenueByOthers += (appt.services.price) * (emp.distribution / 100);
                                                                        cb2();
                                                                    }

                                                                }, function() {
                                                                    cb1();
                                                                });

                                                            } else {

                                                                async.each(appt.services.employees, function(emp, cb2) {

                                                                    if ((emp.employeeId).toString() == (empId).toString()) {
                                                                        revenueByEmployee += (appt.services.price - appt.services.loyalityPoints) * 0.25 * (emp.distribution / 100);
                                                                        cb2();
                                                                    } else {
                                                                        revenueByOthers += (appt.services.price - appt.services.loyalityPoints) * 0.25 * (emp.distribution / 100);
                                                                        cb2();
                                                                    }

                                                                }, function() {
                                                                    cb1();
                                                                });

                                                            }

                                                        }, function() {

                                                            if (revenueByOthers == 0) {
                                                                sharedBillRatioThisMonth = 1;
                                                            } else {
                                                                sharedBillRatioThisMonth = revenueByEmployee / revenueByOthers;

                                                                if (sharedBillRatioThisMonth == 0) {

                                                                } else {

                                                                    var f = new Fraction(sharedBillRatioThisMonth.toFixed(2));

                                                                    sharedBillRatioThisMonth = f.numerator + "/" + f.denominator;

                                                                }

                                                            }

                                                            Admin.update({ "_id": ObjectId(empId) }, { $set: { "avgBillValueThisMonth": avgBillValueThisMonth, "sharedBillRatioThisMonth": sharedBillRatioThisMonth, "avgServicePerBillThisMonth": avgServicePerBillThisMonth } }, function(err, updated) {
                                                                if (err) {
                                                                    console.log(err);
                                                                    cb();
                                                                }
                                                                if (updated) {
                                                                    console.log("updated");
                                                                    cb();
                                                                }
                                                            });

                                                        });
                                                    } else {
                                                        cb();
                                                    }
                                                }
                                            });
                                        } else {

                                            Admin.update({ "_id": ObjectId(empId) }, { $set: { "avgBillValueThisMonth": avgBillValueThisMonth, "sharedBillRatioThisMonth": sharedBillRatioThisMonth, "avgServicePerBillThisMonth": avgServicePerBillThisMonth } }, function(err, updated) {
                                                if (err) {
                                                    console.log(err);
                                                    cb();
                                                }
                                                if (updated) {
                                                    console.log("updated");
                                                    cb();
                                                }
                                            });
                                        }
                                    }

                                });
                            } else {
                                Admin.update({ "_id": ObjectId(empId) }, { $set: { "avgBillValueThisMonth": avgBillValueThisMonth, "sharedBillRatioThisMonth": sharedBillRatioThisMonth, "avgServicePerBillThisMonth": avgServicePerBillThisMonth } }, function(err, updated) {
                                    if (err) {
                                        console.log(err);
                                        cb();
                                    }
                                    if (updated) {
                                        console.log("updated");
                                        cb();
                                    }
                                });
                            }
                        }
                    });
                })
            });
        }

        updateThisMonthAverages();
    }

})

var updateLastMonthAverages = schedule.scheduleJob('00 59 23 * * *', function(req, res) {

    if (localVar.isServer() && localVar.getInstanceId() == 2) {

        var updateLastMonthAverages = function() {

            var lastMonthStart = function() {
                var d = new Date();
                return (new Date(d.getFullYear(), d.getMonth() - 1, 1));

            }

            var lastMonthEnd = function() {
                var d = new Date(); // current date
                d.setDate(1); // going to 1st of the month
                d.setHours(-1);
                d.setMinutes(59);
                d.setSeconds(59);
                return d;
            }

            var lastMonthStart = lastMonthStart();
            var lastMonthEnd = lastMonthEnd();

            var appointmentPeriod = { $gte: new Date(lastMonthStart.getFullYear(), lastMonthStart.getMonth(), lastMonthStart.getDate(), 0, 0, 0), $lt: new Date(lastMonthEnd.getFullYear(), lastMonthEnd.getMonth(), lastMonthEnd.getDate(), 0, 0, 0) };

            Admin.find({ role: { $nin: [7] } }, { _id: 1 }, function(err, employees) {

                async.eachSeries(employees, function(emp, cb) {
                    var avgBillValueLastMonth = 0;
                    var sharedBillRatioLastMonth = 0;
                    var avgServicePerBillLastMonth = 0;
                    var empId = emp._id;

                    Appointment.aggregate([
                        { $match: { status: 3 } },
                        { $unwind: "$employees" },
                        { $match: { "employees.employeeId": ObjectId(empId), "appointmentStartTime": appointmentPeriod } },
                        { $group: { _id: "$employees.employeeId", revenueByEmployee: { $sum: "$employees.revenue" }, totalServices: { $sum: 1 } } }
                    ], function(err, response1) {
                        if (err) {
                            console.log(err);
                            cb();
                        } else {
                            if (response1.length > 0) {

                                avgBillValueLastMonth = (response1[0].revenueByEmployee / response1[0].totalServices);

                                Appointment.aggregate([
                                    { $match: { status: 3 } },
                                    { $unwind: "$services" },
                                    { $unwind: "$services.employees" },
                                    { $match: { "services.employees.employeeId": ObjectId(empId), "appointmentStartTime": appointmentPeriod } },
                                    { $group: { _id: "$services.employees.employeeId", count: { $sum: 1 }, app: { $push: "$_id" } } },
                                    { $unwind: "$app" },
                                    { $group: { _id: "$app", services: { "$first": "$count" } } },
                                    { $group: { _id: null, services: { $first: "$services" }, appt: { $sum: 1 } } }
                                ], function(err, response2) {

                                    if (err) {
                                        console.log(err);
                                        cb();
                                    } else {

                                        if (response2.length > 0) {

                                            avgServicePerBillLastMonth = (response2[0].services / response2[0].appt);

                                            Appointment.aggregate([
                                                { $match: { status: 3 } },
                                                { $unwind: "$services" },
                                                { $match: { "services.employees.employeeId": ObjectId(empId), "appointmentStartTime": appointmentPeriod } }
                                            ], function(err, appts) {

                                                if (err) {
                                                    console.log(err);
                                                    cb();
                                                } else {

                                                    if (appts.length > 0) {

                                                        var revenueByEmployee = 0;
                                                        var revenueByOthers = 0;

                                                        async.each(appts, function(appt, cb1) {

                                                            if (appt.services.loyalityPoints == undefined || appt.services.loyalityPoints == 0) {

                                                                async.each(appt.services.employees, function(emp, cb2) {

                                                                    if ((emp.employeeId).toString() == (empId).toString()) {

                                                                        revenueByEmployee += (appt.services.price) * (emp.distribution / 100);
                                                                        cb2();
                                                                    } else {
                                                                        revenueByOthers += (appt.services.price) * (emp.distribution / 100);
                                                                        cb2();
                                                                    }

                                                                }, function() {
                                                                    cb1();
                                                                });

                                                            } else {

                                                                async.each(appt.services.employees, function(emp, cb2) {

                                                                    if ((emp.employeeId).toString() == (empId).toString()) {
                                                                        revenueByEmployee += (appt.services.price - appt.services.loyalityPoints) * 0.25 * (emp.distribution / 100);
                                                                        cb2();
                                                                    } else {
                                                                        revenueByOthers += (appt.services.price - appt.services.loyalityPoints) * 0.25 * (emp.distribution / 100);
                                                                        cb2();
                                                                    }

                                                                }, function() {
                                                                    cb1();
                                                                });

                                                            }

                                                        }, function() {

                                                            if (revenueByOthers == 0) {
                                                                sharedBillRatioLastMonth = 1;
                                                            } else {
                                                                sharedBillRatioLastMonth = revenueByEmployee / revenueByOthers;

                                                                if (sharedBillRatioLastMonth == 0) {

                                                                } else {

                                                                    var f = new Fraction(sharedBillRatioLastMonth.toFixed(2));

                                                                    sharedBillRatioLastMonth = f.numerator + "/" + f.denominator;

                                                                }


                                                            }

                                                            Admin.update({ "_id": ObjectId(empId) }, { $set: { "avgBillValueLastMonth": avgBillValueLastMonth, "sharedBillRatioLastMonth": sharedBillRatioLastMonth, "avgServicePerBillLastMonth": avgServicePerBillLastMonth } }, function(err, updated) {
                                                                if (err) {
                                                                    console.log(err);
                                                                    cb();
                                                                }
                                                                if (updated) {
                                                                    console.log("updated");
                                                                    cb();
                                                                }
                                                            });

                                                        });
                                                    } else {
                                                        cb();
                                                    }
                                                }
                                            });
                                        } else {

                                            Admin.update({ "_id": ObjectId(empId) }, { $set: { "avgBillValueLastMonth": avgBillValueLastMonth, "sharedBillRatioLastMonth": sharedBillRatioLastMonth, "avgServicePerBillLastMonth": avgServicePerBillLastMonth } }, function(err, updated) {
                                                if (err) {
                                                    console.log(err);
                                                    cb();
                                                }
                                                if (updated) {
                                                    console.log("updated");
                                                    cb();
                                                }
                                            });

                                        }
                                    }

                                });
                            } else {

                                Admin.update({ "_id": ObjectId(empId) }, { $set: { "avgBillValueLastMonth": avgBillValueLastMonth, "sharedBillRatioLastMonth": sharedBillRatioLastMonth, "avgServicePerBillLastMonth": avgServicePerBillLastMonth } }, function(err, updated) {
                                    if (err) {
                                        console.log(err);
                                        cb();
                                    }
                                    if (updated) {
                                        console.log("updated");
                                        cb();
                                    }
                                });

                            }
                        }
                    });
                })
            });
        }

        updateLastMonthAverages();
    }
});


//Daily Report

// var mail = schedule.scheduleJob('00 30 22 * * *', function(req, res) {

//     // var ObjectId = mongoose.Types.ObjectId;
//     Parlor.update({}, { socketId: [] }, { multi: true }, function(err, d) {});
//     if (localVar.isServer() && localVar.getInstanceId() == 1) {
//         Parlor.find({ active: true, _id: "592ab643c5fa213f89e83257" }, { name: 1 }, function(err, parlors) {
//             _.forEach(parlors, function(par) {
//                 var emailId = ["shailendra@beusalons.com"],
//                     number = [],
//                     beuEmail = [],
//                     firebaseId = ["cV6nTUBEWWA:APA91bGS9MF1qC_t2yBv_68qpdoycyy6183y4fiDtghHYX90MmGX40PB6gGg6ommHU31O1ay0HU1w20Pao3d6odmy6aeyY_n9auXNIOIW7koeeZsTBb4_vqh2u5JTW94TDJ4axD1xPYj", "c7th2EjCLmU:APA91bGAs8w1U-WVlmYNavt7K1qUe0zfi61dmVMtJaRiwdzg6XFIn13p5ph0bLsKhnmg98KmkWxK5fX5bWa9ieln00mlOTUOutKJJECHJDH47vbIEkdiSYPrnxNt-W51TjePdHP6k-2u"];
//                 Beu.find({ parlorIds: par._id, role: { $in: [1, 3, 5, 8, 10] } }, { emailId: 1, phoneNumber: 1, firebaseId }, function(err, beu) {
//                     _.forEach(beu, function(b) {
//                         beuEmail.push(b.emailId);
//                         // number.push(b.phoneNumber)
//                         // firebaseId.push(b.firebaseId)
//                     });
//                     Admin.find({ parlorIds: par._id, role: { $in: [2, 7] } }, { emailId: 1, phoneNumber: 1, otherEmailId: 1, otherPhoneNumber: 1, firebaseId }, function(err, admin) {
//                         _.forEach(admin, function(ad) {
//                             if (ad.otherEmailId && ad.otherPhoneNumber) {
//                                 emailId.push(ad.emailId);
//                                 emailId.push(ad.otherEmailId);
//                                 number.push(ad.phoneNumber);
//                                 number.push(ad.otherPhoneNumber);
//                                 // firebaseId.push(ad.firebaseId)

//                             } else {
//                                 emailId.push(ad.emailId);
//                                 number.push(ad.phoneNumber);
//                                 // firebaseId.push(ad.firebaseId)
//                             }
//                         });
//                         var query = { _id: par._id },
//                             date = new Date();
//                         Appointment.dailyReport(query, date, function(err, data) {
//                             var result = data.reports;
//                             var date2 = '<h4>' + new Date().toDateString() + '</h4>';
//                             var table1 = "";
//                             var appoint = "";
//                             appoint += '<h4>Appointments:' + data.totalAppointments + '</h4>';
//                             for (var i = 0; i < result.length; i++) {
//                                 var parName = '';
//                                 parName += '<h4>' + result[i].parlorName + ' | ' + result[i].parlorAddress + '</h4>';
//                                 table1 += '<tr><td>' + result[i].unit + '</td><td>' + result[i].totalRevenue + '</td><td>' + result[i].totalTax + '</td></tr>';
//                             }
//                             var records = data.payment;
//                             var table2 = "";
//                             for (var j = 0; j < records.length; j++) {
//                                 table2 += '<tr><td>' + records[j].mode + '</td><td>' + records[j].amount + '</td></tr>';
//                             }
//                             var records1 = data.customers;
//                             var table3 = "";
//                             for (var n = 0; n < records1.length; n++) {
//                                 table3 += '<tr><td>' + records1[n].type + '</td><td>' + records1[n].number + '</td><td>' + records1[n].services + '</td><td>' + records1[n].amount + '</td></tr>';
//                             }
//                             var records2 = data.redemption;
//                             var table4 = "";
//                             for (var k = 0; k < records2.length; k++) {
//                                 table4 += '<tr><td>' + records2[k].mode + '</td><td>' + records2[k].amount + '</td></tr>';
//                             }
//                             var records3 = data.employee;
//                             var table5 = "";
//                             for (var l = 0; l < records3.length; l++) {
//                                 table5 += '<tr><td>' + records3[l].name + '</td><td>' + records3[l].totalRevenueEmp + '</td></tr>';
//                             }
//                             var records4 = data.status;
//                             var table6 = "";
//                             for (var m = 0; m < records4.length; m++) {
//                                 table6 += '<tr><td>' + records4[m].type + '</td><td>' + records4[m].number + '</td></tr>';
//                             }
//                             // function sendEmail() {
//                             //     var transporter = nodemailer.createTransport('smtps://reports@beusalons.com:wx2t2Tr7pMrqnK2CIqwd3g@smtp.mandrillapp.com');
//                             //     var mailOptions = {
//                             //         from: 'reports@beusalons.com', // sender address
//                             //         // to: "nikita@beusalons.com", // list of receivers
//                             //         to: emailId,
//                             //         cc: beuEmail,
//                             //         html: '<html><head><style>table, th, td{border: 1px solid gray; border-collapse: collapse;text-align:center;}</style></head><body><div style="background-color:#DFDFDF;height:20%;"><div style="float:left;width:200px;margin-top: 2%;margin-left:2%;margin-bottom: 2%;zoom:1.2;"><img src="http://res.cloudinary.com/dyqcevdpm/image/upload/v1491484496/beu-logo_srvetg.png" width="150" alt="Beu salons"/></div><div style="float:right;width:200px;margin-top: 2%;margin-left:2%;margin-bottom: 2%;"><address><p style="line-height:5px;">' + parName + ' </p><p style="line-height:5px;">' + date2 + ' </p><p style="line-height:5px;">' + appoint + ' </p></address></div></div><div style="margin-top:15px"><table style="width:100%"> <tr><th style="background:#DFDFDF;height:40px;">Total Summary</th><th style="background:#DFDFDF;height:40px;">Amount</th> </tr><tr><td>Total Collection Today</td><td>' + Math.round(data.totalCollectionToday) + '</td></tr><tr><td>Total Revenue</td><td>' + Math.round(data.totalRevenueToday) + '</td></tr><tr><td>Total Sale</td><td>' + Math.round(data.totalSalesToday) + '</td></tr><tr><td>Total Advance Added</td><td>' + data.totalAdvanceAdded + '</td></tr></table></div><div style="margin-top:15px"><h3 style="text-align:center;color:#696969">Department Report</h3><table style="width:100%"> <tr><th style="background:#DFDFDF;height:40px;">Business Unit</th><th style="background:#DFDFDF;height:40px;">Total Revenue</th> <th style="background:#DFDFDF;height:40px;">Total Tax</th> </tr>' + table1 + '</table></div><div style="margin-top:15px"><h3 style="text-align:center;color:#696969">Collection</h3><table style="width:100%"> <tr><th style="background:#DFDFDF;height:40px;">Mode</th><th style="background:#DFDFDF;height:40px;">Amount</th> </tr>' + table2 + '</table></div><div style="margin-top:15px"><h3 style="text-align:center;color:#696969">Redemption Distribution</h3><table style="width:100%"> <tr><th style="background:#DFDFDF;height:40px;">Redemption Type</th><th style="background:#DFDFDF;height:40px;">Total Revenue</th> </tr>' + table4 + '</table></div><div style="margin-top:15px"><h3 style="text-align:center;color:#696969">Employee Distribution<h3><table style="width:100%"> <tr><th style="background:#DFDFDF;height:40px;">Therapist Name</th><th style="background:#DFDFDF;height:40px;">Total Revenue</th> </tr>' + table5 + '</table></div><div style="margin-top:15px"><h3 style="text-align:center;color:#696969">Customer Detail</h3><table style="width:100%"> <tr><th style="background:#DFDFDF;height:40px;">Type of Customer</th><th style="background:#DFDFDF;height:40px;">Number</th><th style="background:#DFDFDF;height:40px;">Services</th><th style="background:#DFDFDF;height:40px;">Amount</th> </tr>' + table3 + '</table></div><div style="margin-top:15px"><h3 style="text-align:center;color:#696969">Appointment Status</h3><table style="width:100%"> <tr><th style="background:#DFDFDF;height:40px;">Cancelled</th><th style="background:#DFDFDF;height:40px;">Completed</th> </tr>' + table6 + '</table></div></body></html>',
//                             //         subject: 'Daily Summary' // Subject line
//                             //     };
//                             //     transporter.sendMail(mailOptions, function (error, info) {
//                             //         if (error)
//                             //             console.log(error);
//                             //         else
//                             //             console.log('Message sent: ' + info.response);
//                             //         // return res.json(CreateObjService.response(false, "Mail sent successfully!"));
//                             //     });
//                             // }
//                             // sendEmail();

//                             //     var date2 =  new Date().toDateString();
//                             //     for (var i = 0; i < result.length; i++) {
//                             //         var parName = '';
//                             //         parName +=  result[i].parlorName + ' | ' + result[i].parlorAddress ;
//                             //     }
//                             //     var records = data.payment ,cash=records[0].amount , card=records[1].amount , app=records[3].amount , loyalty = data.totalLoyalityPoints;
//                             //     var message= "Register Closure for "+date2+": "+parName+" Serv Rev:"+Math.round(data.totalServiceRevenue)+" Prod Rev:"+Math.round(data.totalProductSale)+" Cash:"+cash+" Card:"+card+" Be U App: "+app+"Be U Freebie: "+loyalty+"";
//                             // console.log(message)
//                             // console.log(firebaseId)
//                             //     var notiData = {
//                             //         type: "dailySummary",
//                             //         title: "Daily Summary Report",
//                             //         body: message
//                             //     }

//                             //     if(firebaseId.length>0){
//                             //         _.forEach(firebaseId, function (f){
//                             //             ParlorService.sendIonicNotificationToMany(f , notiData , function (err, response) {

//                             //             });
//                             //         })
//                             //     }
//                             // var usermessage = Appointment.ownerSms(number, data);
//                             // Appointment.sendSMS(usermessage, function (e) {
//                             //     return console.log('SMS sent successfully');
//                             // });
//                         });
//                     })
//                 })
//             })
//         })
//     }
// });


//Customer Care update

var appointmentTeam = schedule.scheduleJob('00 00 02 * * *', function(req, res) {
    // console.log("here in schedular")
    if (localVar.isServer() && localVar.getInstanceId() == 1) {
        FacebookQuery.updateConversionsAppointment(req, function(){
            res.json('done')
        })
    }
});


var subscriptionTeam = schedule.scheduleJob('00 00 02 * * *', function(req, res) {
    // console.log("here in schedular")
    if (localVar.isServer() && localVar.getInstanceId() == 2) {
        FacebookQuery.updateConversionsSubscription(req, function(){
            res.json('done')
        })
    }
});

//New User Reminder

var newUserCouponReminder = schedule.scheduleJob('00 00 10 * * *', function(req, res) {
    // console.log("here in schedular")
    if (localVar.isServer() && localVar.getInstanceId() == 1) {
        User.aggregate([
            {
                $match : {
                    "couponCodeHistory.code" : "APP50",
                    createdAt : {$gt : HelperService.getBeforeByDayStart(1),  $lt : HelperService.getBeforeByDayStart(0)}
                },
            },
            {
                $project : {
                    phoneNumber : "$phoneNumber",
                    userId : "$_id"
                },
            }
        ]).exec(function(err, clients){
            let numbers = _.map(clients, function(c){return c.phoneNumber})
            ParlorService.sendSmsByXML(numbers, HelperService.addHrsAfter(1), 'REMINDER - Your 50% coupon expires tonight, so book now https://beusalons.app.link/Gc7HfpfrXV')
        })
    }
});

var newUserAddLoyalityPoints200 = schedule.scheduleJob('00 30 10 * * *', function(req, res) {
    if (localVar.isServer() && localVar.getInstanceId() == 1) {
        let numbers = []
        User.aggregate([
            {
                $match : {
                    createdAt : {$gt : HelperService.getBeforeByDayStart(2),  $lt : HelperService.getBeforeByDayStart(1)},
                },
            },
            {
                $project : {
                    phoneNumber : "$phoneNumber",
                    userId : "$_id"
                },
            }
        ]).exec(function(err, clients){
            Async.forEach(clients, function(c, callback){
                Appointment.findOne({"client.id" : c.userId, status : {$in : [1,3]}}, {parlorId : 1}, function(erm, appointment){
                    if(!appointment){
                        User.update({phoneNumber : c.phoneNumber}, {loyalityPoints : 200, creditsHistory : [{createdAt : new Date(), amount : 200, reason : "200 Gift", balance : 200}], freebieExpiry : HelperService.addDaysToDate2(5)}, function(er, f){
                            numbers.push(c.phoneNumber)
                            callback()
                        })    
                    }else{
                        callback()
                    }
                })
            }, function allDone(){
                ParlorService.sendSmsByXML(numbers, HelperService.addHrsAfter(6), 'Second Chance for you - 200 B-Cash (100% redeemable) have been added to your account. Book within next 7 days. https://beusalons.app.link/Gc7HfpfrXV')
                res.json('done')
            })
        })
    }
});

var loyalityReminders200 = schedule.scheduleJob('00 30 06 * * *', function(req, res) {
    if (localVar.isServer() && localVar.getInstanceId() == 2) {
        let numbers = []
        User.aggregate([
            {
                $match : {
                    createdAt : {$gt : HelperService.getBeforeByDayStart(8),  $lt : HelperService.getBeforeByDayStart(7)},
                    loyalityPoints : 200,
                    phoneNumber : "9695748822",
                    "creditsHistory.reason" : "200 Gift",
                },
            },
            {
                $project : {
                    phoneNumber : "$phoneNumber",
                    userId : "$_id"
                },
            }
        ]).exec(function(err, clients){
            let numbers = _.map(clients, function(c){return c.phoneNumber})
            ParlorService.sendSmsByXML(numbers, HelperService.addHrsAfter(5), 'REMINDER - Your 200 B-Cash expires tonight, so book now https://beusalons.app.link/Gc7HfpfrXV')
            res.json('done')
        })
    }
});

/*var newUserAddLoyalityPoints100 = schedule.scheduleJob('00 00 03 * * *', function(req, res) {
    if (localVar.isServer() && localVar.getInstanceId() == 1) {
        let numbers = []
        User.aggregate([
            {
                $match : {
                    phoneNumber : "9695748822",
                    createdAt : {$gt : HelperService.getBeforeByDayStart(8),  $lt : HelperService.getBeforeByDayStart(7)}
                },
            },
            {
                $project : {
                    phoneNumber : "$phoneNumber",
                    userId : "$_id"
                },
            }
        ]).exec(function(err, clients){
            Async.forEach(clients, function(c, callback){
                Appointment.findOne({"client.phoneNumber" : c.phoneNumber, status : {$in : [1,3]}}, {parlorId : 1}, function(erm, appointment){
                    if(!appointment){
                        User.update({phoneNumber : c.phoneNumber}, {loyalityPoints : 100, freebieExpiry : HelperService.addDaysToDate2(30)}, function(er, f){
                            numbers.push(c.phoneNumber)
                            callback()
                        })
                    }else{
                        callback()
                    }
                })
            }, function allDone(){
                ParlorService.sendSmsAfterminutes(numbers, HelperService.addHrsAfter(8), 'Third Chance for you - 100 B-Cash (100% redeemable) have been added to your account. Book within next 30 days. https://beusalons.app.link/Gc7HfpfrXV')
            })
        })
    }
});*/




/*var loyalityReminders100 = schedule.scheduleJob('00 00 02 * * *', function(req, res) {
    if (localVar.isServer() && localVar.getInstanceId() == 2) {
        let numbers = []
        User.aggregate([
            {
                $match : {
                    createdAt : {$gt : HelperService.getBeforeByDayStart(38),  $lt : HelperService.getBeforeByDayStart(37)},
                    loyalityPoints : 100
                },
            },
            {
                $project : {
                    phoneNumber : "$phoneNumber",
                    userId : "$_id"
                },
            }
        ]).exec(function(err, clients){
            let numbers = _.map(clients, function(c){return c.phoneNumber})
            ParlorService.sendSmsAfterminutes(numbers, HelperService.addHrsAfter(10), 'Your 100 B-Cash expires tonight, so book now https://beusalons.app.link/Gc7HfpfrXV')
            res.json('done')
        })
    }
});
*/

/*var loyalityReminders100 = schedule.scheduleJob('00 00 02 * * *', function(req, res) {
    if (localVar.isServer() && localVar.getInstanceId() == 2) {
        Appointment.aggregate([
            {
                $match : {
                    status : {$in : [1, 3]},
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
                    appointmentStartTime : {$lt : HelperService.getBeforeByDay(90)}
                }
            }
        ]).exec(function(err, clients){
            let numbers = []
            Async.forEach(clients, function(c, callback){
                let obj = {"active" : true,"offPercentage" : 25,"limit" : 500,"code" : "FLATOFFBEU","couponTitle" : "Get 25% Off","couponDescription" : "Use code FLATOFFBEU for 25% flat","createdAt" : new Date(),"couponType" : 14, "expires_at" : HelperService.addDaysToDate2(45)}
                User.update({phoneNumber : c._id}, {$push : {couponCodeHistory : obj}}, function(er, f){
                    numbers.push(c.clientPhoneNumber)
                    console.log('done')
                    callback()
                })
            }, function allDone(){
                ParlorService.sendSmsAfterminutes(numbers, HelperService.addHrsAfter(9), 'Because we miss you, enjoy 25% discount coupon (max Rs 500) on any services of your choice (Coupon expires in 24 hours). https://beusalons.app.link/Gc7HfpfrXV')
                res.json('done')
            })
        })
    }
});
*/
var settlementTesting = schedule.scheduleJob('00 00 12 * * *', function(req, res) {

    if (localVar.isServer() && localVar.getInstanceId() == 1) {
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            day = days[new Date().getDay()];
        if (day == 'Monday' || day == 'Wednesday' || day == 'Friday') {
            console.log(day)
            SettlementReport.find({}, { period: 1, createdAt: 1, endDate: 1 }).sort({ $natural: -1 }).limit(1).exec(function(err, settlement) {
                var tempStartDate = HelperService.addDaysToDate(settlement[0].endDate , 1)
                var startDate = HelperService.getDayStart(tempStartDate);
                var date2 = new Date();
                var yesterday = date2.setDate(date2.getDate() - 1);
                var endDate = HelperService.getDayEnd(yesterday);
                var period = settlement[0].period + 1;
                console.log(period);
                console.log("startDate" , startDate);
                console.log("endDate" ,endDate);
                
                var daysToBeCalculated = HelperService.getDaysBetweenTwoDates(startDate, endDate)
                if(daysToBeCalculated == 1 || daysToBeCalculated == 2 || daysToBeCalculated == 3){
                    // LuckyDrawDynamic.subscriptionAmount(startDate, endDate); 
                    // LuckyDrawDynamic.onNonSubscriberAppTransaction(startDate, endDate); 
                    // LuckyDrawDynamic.luckyDrawOnFacial(startDate, endDate); 
                    LuckyDrawDynamic.findIncentiveType( startDate, endDate , period)
                }
                Parlor.createSettlementReportv2(startDate, endDate, period, { active: true },function(err, report) {
                    console.log("created") 
                });
            })
        }
    }
});






var notificationDelete = schedule.scheduleJob('00 00 02 * * *', function(req, res) {
    if (localVar.isServer() && localVar.getInstanceId() == 2) {
        var date = new Date();
        Notification.deleteNotificationFromApp(date, function(e) {
            return console.log('Deleted successfully');
        });
    }
});

var corporateExpiryDate = schedule.scheduleJob('00 00 00 * * *', function(req, res) {
    if (localVar.isServer() && localVar.getInstanceId() == 1) {
        var date = new Date();

        User.find({ "isCorporateUser": true, "freeServices.expires_at": { $gte: HelperService.getDayStart(date), $lt: HelperService.getDayEnd(date) } }, { freeServices: 1, phoneNumber: 1 }, function(err, users) {
            _.forEach(users, function(u) {
                var fs = [];
                _.forEach(u.freeServices, function(free) {
                    var arr = {};

                    if (free.expires_at && (free.expires_at).getDate() == (date).getDate()) {

                        arr.createdAt = free.createdAt,
                            arr.noOfService = free.noOfService,
                            arr.categoryId = free.categoryId,
                            arr.serviceId = free.serviceId,
                            arr.dealId = free.dealId,
                            arr.parlorId = free.parlorId,
                            arr.code = free.code,
                            arr.name = free.name,
                            arr.price = free.price,
                            arr.discount = free.discount,
                            arr.source = free.source,
                            arr.expires_at = free.expires_at,
                            arr.dealType = free.dealType,
                            arr.brandId = free.brandId,
                            arr.productId = free.productId,
                            arr.description = free.description,
                            arr.priceId = free.priceId,
                            arr.enableUpgrade = false,
                            arr.availed = false;

                        fs.push(arr);
                    } else {
                        fs.push(free);
                    }
                });
                User.update({ phoneNumber: u.phoneNumber, "freeServices.expires_at": { $gte: HelperService.getDayStart(date), $lt: HelperService.getDayEnd(date) } }, { freeServices: fs }).exec(function(err, updated) {
                    if (updated) {
                        return console.log(updated);
                    }
                })
            })
        })
    }
});


var corporateExpiryDate = schedule.scheduleJob('00 05 00 * * *', function(req, res) {
    if (localVar.isServer() && localVar.getInstanceId() == 2) {
        var date = new Date();

        User.find({ "isCorporateUser": true, "freeServices.expires_at": { $gte: HelperService.getDayStart(date), $lt: HelperService.getDayEnd(date) } }, { freeServices: 1, phoneNumber: 1 }, function(err, users) {
            _.forEach(users, function(u) {
                var fs = [];

                _.forEach(u.freeServices, function(free) {
                    var arr = {};
                    console.log("free", free)
                    var date1 = new Date(date);
                    var date2 = new Date(free.expires_at);
                    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
                    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                    console.log(diffDays)
                    if (diffDays == 30) {
                        // if(free.expires_at && (free.expires_at).getDate() > (date).getDate()) {
                        console.log("aayayayayay")

                        arr.createdAt = free.createdAt,
                            arr.noOfService = free.noOfService,
                            arr.categoryId = free.categoryId,
                            arr.serviceId = free.serviceId,
                            arr.dealId = free.dealId,
                            arr.parlorId = free.parlorId,
                            arr.code = free.code,
                            arr.name = free.name,
                            arr.price = free.price,
                            arr.discount = free.discount,
                            arr.source = free.source,
                            arr.expires_at = free.expires_at,
                            arr.dealType = free.dealType,
                            arr.brandId = free.brandId,
                            arr.productId = free.productId,
                            arr.description = free.description,
                            arr.priceId = free.priceId,
                            arr.enableUpgrade = true,
                            arr.availed = true;

                        fs.push(arr);
                    }
                    // }
                    else {
                        fs.push(free);
                    }
                });
                // console.log(fs)
                User.update({ phoneNumber: u.phoneNumber, "freeServices.expires_at": { $gte: HelperService.getDayStart(date), $lt: HelperService.getDayEnd(date) } }, { freeServices: fs }).exec(function(err, updated) {
                    if (updated) {
                        // return res.json(fs);
                        return console.log(updated);
                    }
                })
            })
        })
    }
});

// var corporateExpiryDate = schedule.scheduleJob('00 05 00 * * *', function(req, res) {
//     if (localVar.isServer() && localVar.getInstanceId() == 1) {
//         var date = new Date();

//         User.find({'couponCodeHistory' :{$size: 0}},{_id:1} , function(err,users) {

//         });
//     }
// });


function sendElasticMail(emails, html, subject) {
    var options = {
        url: ' https://api.elasticemail.com/v2/email/send',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        "form": {
            "apikey": "670ce84e-6c56-4424-b3aa-282fbeb642ce",
            "from": "customercare@beusalons.com",
            "fromName": "Be U Salons",
            "to": emails,
            "bodyHtml": html,
            "subject": subject
        }
    };
    request.post(options, function(err, res1, body) {
        if (err) {
            console.log(err)
                // cb(true, "error")
        } else {
            var json = JSON.parse(body);
            // console.log(json)

            // cb(false, json)
        }
    });
};

//Reschedule Appointments for Settlement

var allotReschedule = schedule.scheduleJob('00 00 00 * * *', function(req, res) {
    if (localVar.isServer() && localVar.getInstanceId() == 1) {
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            day = days[new Date().getDay()];
        if (day == 'Monday' || day == 'Wednesday' || day == 'Friday') {
            var today = new Date();
            var newDate = today.setHours(today.getHours() + 14);
            SettlementReport.findOne({}, { createdAt: 1, startDate: 1, endDate: 1 }).sort({ $natural: -1 }).exec(function(err, settlement) {

                if (settlement.createdAt.getDate() <= today.getDate()) {
                    Appointment.updateMany({ 'services.0': { "$exists": true }, appointmentStartTime: { $gte: settlement.startDate, $lt: today }, status: 1, "employees.0": { "$exists": false } }, { appointmentStartTime: newDate }, function(err, appts) {
                        return console.log("Appointment Date Updated")
                    })
                }
            })
        }
    }
});


var expireFreeStuff = schedule.scheduleJob('00 55 23 * * *', function(req, res) {
    // var today = HelperService.addDaysToDate(new Date(), 2)
    var today = new Date()
    console.log(today)
    if (localVar.isServer() && localVar.getInstanceId() == 2) {
        var freeServices;
        Async.parallel([
                function(callback) {
                    User.updateMany({ 'couponCodeHistory.expires_at': { $lte: HelperService.getDayEnd(today) } }, { $pull: { couponCodeHistory: { expires_at: { $lte: HelperService.getDayEnd(today) } } } }, function(err1, coupons) {
                        return console.log("Coupons removed")
                        callback(null)
                    })
                },
                function(callback) {
                    User.updateMany({ 'freebieExpiry': {  $lte: HelperService.getDayEnd(today) } }, { loyalityPoints: 0 }, function(err2, freebie) {
                        return console.log("Loyalty Points removed")
                        callback(null)
                    })
                },
                function(callback) {
                    User.updateMany({ 'freeServices.expires_at': { $lte: HelperService.getDayEnd(today) } }, { $pull: { freeServices: { createdAt: { $lte:HelperService.getDayEnd(today) } } } }, function(err3, freeService) {
                        freeServices = freeService;
                        return console.log("freeServices removed")
                        callback(null)
                    })
                },
            ],
            function(err, results) {
                if (freeServices) {
                    return callback(false, 'Successfully Updated');
                } else {
                    return callback(true, 'Something is wrong');
                }
            });
    }
});




var expireSubscriptionNotification = schedule.scheduleJob('00 00 16 * * *', function(req, res) {

    if (localVar.isServer() && localVar.getInstanceId() == 1) {
        var todayDate = new Date();
        var monthEnd = HelperService.getCurrentMonthLastDate();
        var number = HelperService.getNoOfDaysDiff(monthEnd, todayDate)
        console.log("number", number)

        if (number == 6 || number == 2 || number == 0) {

            User.subscriptionExpiry((number + 1), todayDate)

        }
    }
});

var expireFreebieNotification = schedule.scheduleJob('00 00 10 * * *', function(req, res) {

    if (localVar.isServer() && localVar.getInstanceId() == 2) {
        var todayDate = new Date();
        User.find({ freebieExpiry: { $gte: HelperService.getDayStart(todayDate), $lte: HelperService.addOneWeekDate(7, todayDate) }, loyalityPoints: { $gt: 0 } }, { freebieExpiry: 1, firebaseId: 1, firebaseIdIOS: 1, loyalityPoints: 1 }, function(er, users) {
            async.each(users, function(u, call) {
                var number = HelperService.getNoOfDaysDiff(u.freebieExpiry, todayDate)
                console.log('number', number)
                if (number == 6 || number == 2 || number == 0) {

                    var expiryDate = u.freebieExpiry.toDateString();
                    var data = { type: "freebie", title: "B-Cash Expiry", body: "Your " + u.loyalityPoints + " B-Cash would expire on " + expiryDate + ", so hurry up and book now.", sImage: "", lImage: "" };
                    if (u.firebaseId) {

                        Appointment.sendAppNotificationNew(u.firebaseId, data, function(err, data) {

                            call();
                        })
                        console.log("android")
                    }
                    if (u.firebaseIdIOS) {
                        Appointment.sendAppNotificationIOS(u.firebaseIdIOS, data.title, data.body, "", data.type, "", function(err, data) {

                            call();
                        })
                        console.log("ios")
                    }

                } else {
                    console.log("not in date")
                    call()
                }
            }, function allTaskCompleted() {
                console.log('all done')
            })
        })
    }
});



var expireCouponNotification = schedule.scheduleJob('00 00 14 * * *', function(req, res) {

    if (localVar.isServer() && localVar.getInstanceId() == 1) {
        var todayDate = new Date();
        console.log("HelperServic", HelperService.addOneWeekDate(7, todayDate))
        User.aggregate([{ $match: { $or: [{ subscriptionId: 0 }, { subscriptionId: { $exists: false } }] } },
            { $unwind: "$couponCodeHistory" },
            { $match: { phoneNumber: "8010178215", 'couponCodeHistory.expires_at': { $gte: HelperService.getDayStart(todayDate), $lte: HelperService.addOneWeekDate(7, todayDate) } } },
            { $group: { _id: "$_id", couponCodeHistory: { $first: "$couponCodeHistory" }, firebaseId: { $first: "$firebaseId" }, firebaseIdIOS: { $first: "$firebaseIdIOS" } } }
        ], function(err, users) {
            console.log(users)
            async.each(users, function(u, call) {
                var number = HelperService.getNoOfDaysDiff(u.couponCodeHistory.expires_at, todayDate)
                console.log('number', number)

                if (number == 6 || number == 2 || number == 0) {

                    var daysCount = (number > 1) ? "" + number + " days" : "1 day"
                    var data = { type: "coupon", title: "Coupon Code Expiry", body: "Your Referral Discount Coupon for 30% discount is about to expire in " + daysCount + ", so hurry up and book now.", sImage: "", lImage: "" };

                    if (u.firebaseId) {

                        Appointment.sendAppNotificationNew(u.firebaseId, data, function(err, data) {

                            call();
                        })
                        console.log("android")
                    }
                    if (u.firebaseIdIOS) {
                        Appointment.sendAppNotificationIOS(u.firebaseIdIOS, data.title, data.body, "", data.type, "", function(err, data) {

                            call();
                        })
                        console.log("ios")
                    }

                }
            }, function allTaskCompleted() {
                console.log('all done')
            })
        })
    }
});


var cancelSubscriptionAppointments = schedule.scheduleJob('00 55 11 * * *', function(req, res) {

    if (localVar.isServer() && localVar.getInstanceId() == 2) {

        var todayDate = HelperService.getDayStart(new Date());
        var monthEnd = HelperService.getCurrentMonthLastDate();
        // var monthEnd = HelperService.getDayStart(todayDate);
        console.log("monthEnd", monthEnd)
        console.log("todayDate", todayDate)
        if (todayDate.getDate() == monthEnd.getDate() && todayDate.getMonth() == monthEnd.getMonth() && todayDate.getFullYear() == monthEnd.getFullYear()) {

            Appointment.updateMany({ status: 1, loyalitySubscription: { $gt: 0 }, appointmentStartTime: { $lte: todayDate } }, { status: 2 }, function(err, appointments) {
                if (appointments) {
                    return callback(false, 'Successfully Updated');
                } else {
                    return callback(true, 'Something is wrong');
                }
            });
        }
    }
});


var flashSaleStart = schedule.scheduleJob('00 01 00 * * *', function(req, res) {
    if (localVar.isServer() && localVar.getInstanceId() == 1) {
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            day = days[new Date().getDay()];
        var today = new Date();
       if (day == 'Monday') {

            FlashCoupon.updateMany({ starts_at: { $gte: HelperService.getDayStart(today), $lt: HelperService.getDayEnd(today) } }, { active: true }, function(err, activeCoupon) {
                if (!err) console.log('active success')
                else console.log('active error')
            })

        }
    }
});

var flashSaleEnd = schedule.scheduleJob('00 59 23 * * *', function(req, res) {
    if (localVar.isServer() && localVar.getInstanceId() == 1) {
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            day = days[new Date().getDay()];
        var today = new Date();
        if (day == 'Thursday') {

            FlashCoupon.updateMany({ expires_at: { $gte: HelperService.getDayStart(today), $lte: HelperService.getDayEnd(today) }, active: true }, { active: false }, function(err, inactiveCoupon) {
                Appointment.updateMany({ appointmentStartTime: { $lt: HelperService.getDayEnd(today) }, flashCouponCode: { $ne: null }, status: 1 }, { status: 2 }, function(err, appts) {
                    if (!err) console.log('inactive success')
                    else console.log('inactive error')
                })
            })

        }
    }
});

var sendScheduler = schedule.scheduleJob('00 00 14 * * *', function(req, res) {
    if (localVar.isServer() && localVar.getInstanceId() == 2) {

        var request = require('request');

        request({
            url: "http://beusalons.com/beuApp/sendSchedular",
            method: "POST",
            function(err, res, body) {
                if (!err) {
                    // do your thing
                    console.log("success")
                } else {
                    console.log("error")
                        // handle error
                }
            }
        });
    }

});


function sendElasticMail(emails, html, subject , cb) {
    console.log('elasticemail' , emails)
    var options = {
        url: ' https://api.elasticemail.com/v2/email/send',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        "form": {
            "apikey": "670ce84e-6c56-4424-b3aa-282fbeb642ce",
            "from": "customercare@beusalons.com",
            "fromName": "Be U Salons",
            "to": emails,
            "bodyHtml": html,
            "subject": subject
        }
    };
    console.log(options.form.to)
    request.post(options, function(err, res1, body) {
        if (err) {
            console.log(err)
                cb();
        } else {
            var json = JSON.parse(body);
            console.log(json)
            cb();
        }
    });
};



/*var mgReminderSchedular = schedule.scheduleJob('00 15 16 * * *' , function( req, res){

console.log("mgReminderSchedular")
    if(localVar.isServer() && localVar.getInstanceId() == 2){
    var nodemailer = require('nodemailer');
        var today = new Date();
        // active: true , mainMinimumGuarantee: {$gt: 0}
        // _id: ObjectId("594a359d9856d3158171ea4f")
        Parlor.find({active: true , mainMinimumGuarantee: {$gt: 0} , modelType: {$ne :1}} , {name: 1 , address: 1, address2: 1, mainMinimumGuarantee: 1, discountEndTime: 1}, function(err , parlors){
            console.log(parlors.length)
            async.each(parlors , function(parlor , call){
                var number = (HelperService.getNoOfDaysDiff(parlor.discountEndTime, today) + 1)
                console.log(parlor.name , number , parlor.discountEndTime.toDateString())
                // if(number == 0){
                //     var now_Date = parlor.discountEndTime;
                //     now_Date.setDate(now_Date.getDate() + 5);
                //     Parlor.update({_id: parlor.id} , {discountEndTime : HelperService.getDayEnd(now_Date) , previousDiscountEndTime : parlor.discountEndTime, updatedAt : new Date()} , function(err , updated){
                //         console.log("parlorUpdated" , parlor.id);
                //         call();
                //     })
                // } 
                if(number == 15 || number == 7 || number == 5 || number == 3 || number == 2 || number == 1){
                    var days = (number == 1) ? '1 day' : ''+number+' days';
                    var dicountEndDate = HelperService.getDateFormatForMails(parlor.discountEndTime);
                    var quarterStart = dicountEndDate, quarterEnd =  (HelperService.getDateFormatForMails(HelperService.getNextThreeMonthStartFromDate(parlor.discountEndTime)));
                    var quarterPeriod = quarterStart+' - '+quarterEnd;
                    var payAmount = Math.ceil((parlor.mainMinimumGuarantee * 3) * 1.18);
                    // Parlor.createPaymentLink(payAmount , parlor.name , function(paymentlink){
                    //     var paymentLink = paymentlink;
                    //     if(paymentlink){
                    // console.log(paymentLink)
                    var html = '<h3>Hi '+parlor.name+' Salon,</h3><br>'+
                                    '<div>Your quarterly advance royalty is about to expire<b> in '+days+'</b> on <b>'+dicountEndDate+'</b> and we request you to renew it for the next quarter<b> before the due date '+dicountEndDate+' </b>for uninterrupted support from Be U.</div><br>'+
                                    '<div>Salon Name:<b> '+parlor.name+'</b></div>'+
                                    '<div>Monthly Royalty: <b>₹ '+(parlor.mainMinimumGuarantee * 1.18)+'</b></div>'+
                                    '<div>Quarterly Royalty: <b>₹ '+payAmount+'</b></div>'+
                                    '<div>Quarter Period: <b>'+quarterPeriod+'</b></div>'+
                                    '<div>Due Date:<b>'+dicountEndDate+'</b> </div><br>'+
                                    '<div>Please note that on failure to renew it before the due date, regular functioning of your outlet may get affected on Be U platform as the system would automatically take your outlet offline. </div><br>'+
                                    '<div>If you choose to pay online you can pay via the below link or transfer the due amount to our account below:</div><br>'+
                                    // '<div>Online Payment Link: '+paymentLink+'</div><br>'+
                                    '<div>Be U Salons Bank Details:</div>'+
                                    '<div>COMPANY NAME:<b> GINGERPAN SWAPCART PRIVATE LIMITED </b> </div>'+
                                    '<div>BANK:<b> HDFC Bank</b></div>'+
                                    '<div>A/c No:<b> 50200013283420</b> </div>'+
                                    '<div>IFSC Code:<b> HDFC0000503</b> </div>'+
                                    '<div>BRANCH: <b>SAFDARJUNG ENCLAVE - DEERPARK</b></div><br>'+
                                    '<div>You can contact your Be U representative if you may have any questions on the above.</div><br>'+
                                    '<div>Best,</div><br>'+
                                    '<div style="font-style:italic;">Kindly ignore if already submitted </div>';
                        Beu.find({ parlorIds: parlor.id, role: { $in: [1, 3, 5, 8, 11] } }, { emailId: 1}, function(err, beu) {
                                Admin.find({parlorIds : parlor.id , role: 7} , function(err, owner){
                                    var emailIds = [] , multiEmails = [];
                                        emailIds = _.map(beu , function(b){return b.emailId});
                                        emailIds.push(owner[0].emailId);
                                        // emailIds = ['nikitachauhan@beusalons.com']

                                    function sendEmail() {
                                        var transporter = nodemailer.createTransport('smtps://info@beusalons.com:wx2t2Tr7pMrqnK2CIqwd3g@smtp.mandrillapp.com');
                                        var mailOptions = {
                                            from: 'info@beusalons.com', // sender address
                                            to: emailIds, // list of receivers
                                            html: html,
                                            subject: 'Quarterly Advance Royalty Reminder' // Subject line
                                        };
                                        transporter.sendMail(mailOptions, function (error, info) {
                                            if (error){
                                                console.log(error);
                                                call();
                                            }
                                            else{
                                                console.log('Message sent: ' + info.response);
                                                call();
                                            }
                                        });
                                    }
                                    sendEmail();
                                })
                            });
                        } else call();  
                    // });
                // }else{
                //    call();
                // }
            })

        });
    } 
});*/

// var discountDateSchedular = schedule.scheduleJob('00 56 23 * * *' , function( req, res){

// console.log("discountDateSchedular")
//     if(localVar.isServer() && localVar.getInstanceId() == 2){
//     var nodemailer = require('nodemailer');
//         var today = new Date();
//         Parlor.find({active: true , mainMinimumGuarantee: {$gt: 0}} , { discountEndTime: 1, realDiscountEndTime:1}, function(err , parlors){
//             async.each(parlors , function(parlor , call){
//                 var number = (HelperService.getNoOfDaysDiff(parlor.discountEndTime, today) + 1)
//                 if(parlor.realDiscountEndTime && (HelperService.getNoOfDaysDiff(parlor.discountEndTime, parlor.realDiscountEndTime)+1) == 0){
//                     Parlor.update({_id: parlor.id} , {active : false} , function(err , updated){
//                         console.log("parlorUpdated");
//                         call();
//                     })
//                 }  else if(!parlor.realDiscountEndTime && number == 0){
//                     var now_Date = parlor.discountEndTime;
//                     now_Date.setDate(now_Date.getDate() + 5);
//                     Parlor.update({_id: parlor.id} , {discountEndTime : HelperService.getDayEnd(now_Date) , realDiscountEndTime : parlor.discountEndTime} , function(err , updated){
//                         console.log("parlorUpdated");
//                         call();
//                     })
//                 } else{
//                    call();
//                 }
//             })

//         });
//     }
// });

var productSchedular = schedule.scheduleJob('00 00 16 * * *' , function( req, res){
     if(localVar.isServer() && localVar.getInstanceId() == 1){
        var nodemailer = require('nodemailer');
        var today = new Date();
       var monthEnd = HelperService.getCurrentMonthLastDate();

        if(monthEnd.getMonth() == today.getMonth()){
            var monthStart = HelperService.getLastMonthStart();
            var monthEnd = HelperService.getLastMonthEndDate();
            var closingDate = HelperService.addDaysToDate(monthEnd , 5)
        }else  {
            var monthStart = HelperService.getCurrentMonthFirstDate();
            var closingDate = HelperService.addDaysToDate(monthEnd , 5)
        }

        Parlor.find({active: true} , {name: 1 , address: 1, address2: 1, minimumGurantee: 1, discountEndTime: 1}, function(err , parlors){
            async.each(parlors , function(parlor , call){

                var number = HelperService.getNoOfDaysDiff(closingDate, today) +1;
                console.log(number)
                if(number == 5 || number == 3 || number == 1){
                    var monthName = HelperService.getMonthName(today.getMonth());
                    ReOrder.find({updatedAt : {$gte : monthStart, $lt : monthEnd} , status: 0 , imageUrl: [] , parlorId : parlor.id} , function(err, reorders){
                        if(reorders.length > 0){
                            console.log("fsdfsf")
                            var days = (number == 1) ? '1 day' : ''+number+' days'
                            var html = '<div>Hi '+parlor.name+' Salon,</div><br>'+
                                        '<div>The deadline for submission of your monthly purchase bills is due in <b>'+days+' on 5th '+monthName+' 2018</b>. We request you to submit your bills before the deadline in order to qualify for your discount disbursements.</div><br>'+
                                        '<div><b>Purchase Bill Submission Policy/Procedure:</b></div>'+
                                        '<div>1. Please submit the <b>bills matching the respective POs</b> raised on Be U Purchase module</div>'+
                                        '<div>2. <b>Edit your POs</b> (Add or minus items from your POs)<b> to match the final Bill</b> of the received items</div>'+
                                        '<div>3. Please submit bills which are <b>readable</b> and <b>showing full details</b> written on it</div>'+
                                        '<div>4. Please submit bills of the <b>respective month only</b></div>'+
                                        '<div>5. Please submit bills of purchases done on MRP <b>via Be U Purchase module only</b></div><br>'+
                                        '<div>Please note that on failure to submitting your purchase bills<b> according to the above policy </b> or<b>within the deadline period,</b> your respective purchases would get<b> disqualified</b> from the discount process.</div><br>'+
                                        '<div>You can contact your Be U representative if you may have any questions on the above.</div><br>'+
                                        '<div>Best,</div><br>'+
                                        '<div style="font-style:italic;">Kindly ignore if already submitted </div>';
                            Beu.find({ parlorIds: parlor.id, role: { $in: [1, 3, 5, 8, 11] } }, { emailId: 1}, function(err, beu) {
                                Admin.find({parlorIds : parlor.id , role: 7} , function(err, owner){
                                    var emailIds = [] , multiEmails = [];
                                    emailIds = _.map(beu , function(b){return b.emailId});

                                        emailIds.push(owner[0].emailId);

                                    function sendEmail() {
                                        var transporter = nodemailer.createTransport('smtps://info@beusalons.com:wx2t2Tr7pMrqnK2CIqwd3g@smtp.mandrillapp.com');
                                        var mailOptions = {
                                            from: 'info@beusalons.com', // sender address
                                            to: emailIds, // list of receivers
                                            html: html,
                                            subject: 'Purchase Bill Submission Reminder' // Subject line
                                        };
                                        transporter.sendMail(mailOptions, function (error, info) {
                                            if (error){
                                                console.log(error);
                                                call()
                                            }
                                            else{
                                            // console.log('Message sent: ' + info.response); 
                                                call()
                                            }
                                        });
                                    }
                                    sendEmail();
                                })
                            });
                        }else{
                            call();
                        }
                    });
                }else{
                   call();
                }
            })
        });
    }
});

var createSettlementInvoice = schedule.scheduleJob('00 00 12 * * *' , function( req, res){
    if(localVar.isServer() && localVar.getInstanceId() == 1){
        var today = new Date();
        var month = today.getMonth();
        if(today.getDate() == 3){
            SettlementMonthlyInvoice.createInvoiceByScheduler(month)
        }
    }
});


var createSalonSupport = schedule.scheduleJob('00 15 10 * * *' , function( req, res){
    if(localVar.isServer() && localVar.getInstanceId() == 2){
        var date  = new Date();
        var currentMonth = date.getMonth();
        var year = date.getFullYear();
        var today = date.getDate();
        if(today == 1){
            SalonSupportData.createSupportData(date, currentMonth, year, true)
        }else {
            SalonSupportData.createSupportData(date, currentMonth, year, false)
        }
    }
});


var sendLuckyDraws = schedule.scheduleJob('00 00 12 * * *' , function( req, res){
    if (localVar.isServer() && localVar.getInstanceId() == 2) {
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            day = days[new Date().getDay()];
        if (day == 'Tuesday' || day == 'Thursday' || day == 'Saturday') {
            var date2 = new Date();
            var yesterday = date2.setDate(date2.getDate() - 1);
            let query = {createdAt :{$gte: HelperService.getDayStart(yesterday) , $lte: HelperService.getDayEnd(yesterday)}, status:0, categoryId : {$in :["17" , "18" , "19"]},transferObj: {$exists : false}}

            LuckyDrawDynamic.sendLuckyDrawSchedular(query);
            
        }
    }
});

var sendLuckyDrawsSettlementWise = schedule.scheduleJob('00 15 12 * * *' , function( req, res){
    if (localVar.isServer() && localVar.getInstanceId() == 2) {
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            day = days[new Date().getDay()];
        if (day == 'Tuesday' || day == 'Thursday' || day == 'Saturday') {
            var date2 = new Date();
            SettlementReport.findOne({}, {startDate:1, endDate:1}).sort({$natural:-1}).exec(function(err , sett){

                let query = {createdAt :{$gte: sett.startDate , $lte:sett.endDate}, status:0, categoryId : {$in : ["13" , "23" , "24"]},transferObj: {$exists : false}, manualTransfer: {$exists : false}}
                LuckyDrawDynamic.sendLuckyDrawSchedular(query);
            })
            
        }
    }
});

//Monsoon LuckyDraw
var sendLuckyDrawsThroughBeu = schedule.scheduleJob('00 00 13 * * *' , function( req, res){
    if (localVar.isServer() && localVar.getInstanceId() == 2) {
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            day = days[new Date().getDay()];
        if (day == 'Tuesday' || day == 'Thursday' || day == 'Saturday') {
            var date2 = new Date();
            SettlementReport.findOne({}, {startDate:1, endDate:1, period:1}).sort({$natural:-1}).exec(function(err , sett){

                let query = {settlementPeriod : sett.period, status:0, categoryId : {$in : ["20" , "21" , "22"]}, transferObj: {$exists : false},manualTransfer: {$exists : false}}
                LuckyDrawDynamic.sendLuckyDrawSchedular(query);
            })
            
        }
    }
});



var sendFreeThreadingNotification = schedule.scheduleJob('00 57 12 * * *' , function( req, res){
    if (localVar.isServer() && localVar.getInstanceId() == 2) {
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            day = days[new Date().getDay()];
        if (day == 'Wednesday') {
            Notification.sendFreeThreadingNotification();
        }
    }
});

 
// var sendLuckyDrawsSettlementWise = schedule.scheduleJob('00 30 14 * * *' , function( req, res){
//     if (localVar.isServer() && localVar.getInstanceId() == 2) {
//         var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
//             day = days[new Date().getDay()];
//         if (day == 'Friday') {
//                 let query = {createdAt :{$gte: new Date(2018, 10,5)}, status:0, transferObj: {$exists : false}}
//                 LuckyDrawDynamic.sendLuckyDrawSchedular(query);
            
//         }
//     }
// });



var updateSalonCheckIn = schedule.scheduleJob('00 00 10 * * *' , function( req, res){
    if (localVar.isServer() && localVar.getInstanceId() == 1) {
        SalonCheckin.aggregate([
            {
                $match : {createdAt : {$gt: HelperService.getTodayStart()}, firstCheckInLocationId : {$ne : null}},
            },
            {
                $project : {
                    userId : 1,
                    firstCheckInLocationId : 1,
                    createdAt : 1,
                }
            },
            {
                $sort : { createdAt : -1},
            },
            {
                $group : {
                    _id : "$userId",
                    userId : {$first : "$userId"},
                    checkins : {$push : {locationId : "$firstCheckInLocationId"}}
                }
            }
        ]).exec(function(err, data){
            _.forEach(data, function(d){
                let latitude1, longitude1, latitude2, longitude2, distance = 0;
                LocationTracker.findOne({_id : d.checkins[0].locationId}, function(er, loc){
                    latitude1 = loc.latitude;
                    longitude1 = loc.longitude;
                    Beu.findOne({_id : d.userId}, function(err, user){
                        if(user.latitude){
                            latitude2 = user.latitude;longitude2 = user.longitude;
                            SalonCheckin.getDistanceByRoad(latitude1, longitude1, latitude2, longitude2, function(dd){
                                SalonCheckin.update({firstCheckInLocationId : d.checkins[0].locationId}, {distanceTravelledSalonToHome : dd}, function(er, da){
                                    console.log("done! location salon home");
                                });
                            });
                        }else{
                            console.log("user location not found");
                        }
                    });
                });
            });
        });
    }
});


// var calculateSettlementGst = schedule.scheduleJob('00 05 11 * * *' , function(req , res) {
//     if(localVar.isServer() && localVar.getInstanceId() == 2){

//         SalonSupportData.createSupportData()
//     }
// });



// var marketingServiceMailer = schedule.scheduleJob('00 12 14 * * *', function(req, res) {
//         if (localVar.isServer() && localVar.getInstanceId() == 1) {
//     console.log("mailer")
//     var d=[];
//     var today = new Date();
//     var fiveMonths = HelperService.getLastMonthStartDate(today ,150)
//      var html='<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"><html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"></head><body data-brackets-id="1163"><div data-brackets-id="1164" style="Margin:0;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;min-width:100%;padding:0;text-align:left;width:100%!important"><table data-brackets-id="1165" style="Margin:0;background:#f3f3f3;border-collapse:collapse;border-spacing:0;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;height:100%;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;width:100%"><tbody data-brackets-id="1166"><tr data-brackets-id="1167" style="padding:0;text-align:left;vertical-align:top"><td data-brackets-id="1168" align="center" valign="top" style="Margin:0 auto;border-collapse:collapse!important;color:#0a0a0a;float:none;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;text-align:center;vertical-align:top;word-wrap:break-word"><center data-brackets-id="1169" style="min-width:580px;width:100%"><table data-brackets-id="1170" bgcolor="#8a8a8a" align="center" class="wrapper header float-center" style="Margin:0 auto;background:#FFF;border-collapse:collapse;border-spacing:0;float:none;margin:0 auto;padding:0;text-align:center;vertical-align:top;width:100%"><tbody data-brackets-id="1171"><tr data-brackets-id="1172" style="padding:0;text-align:left;vertical-align:top"><td data-brackets-id="1173" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;padding-top: 1%!important;text-align:left;vertical-align:top;word-wrap:break-word;background-color: #f3f3f3;"><table data-brackets-id="1174" align="center" class="container" style="Margin:0 auto;background: #d2232a;border-collapse:collapse;border-spacing:0;margin:0 auto;padding:0;text-align:inherit;vertical-align:top;width:580px;"><tbody data-brackets-id="1175"><tr data-brackets-id="1176" style="padding:0;text-align:left;vertical-align:top"><td data-brackets-id="1177" style="-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:auto;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word"><table data-brackets-id="1178" class="row collapse" style="border-collapse:collapse;border-spacing:0;display:table;padding:0;position:relative;text-align:left;vertical-align:top;width:100%"><tbody data-brackets-id="1179"><tr data-brackets-id="1180" style="padding:0;text-align:left;vertical-align:top"><th data-brackets-id="1181" class="small-8 large-8 columns first" valign="middle" style="Margin:0 auto;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;padding-bottom:0;padding-left:0;padding-right:0;text-align:left;width:298px"><table data-brackets-id="1182" style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%">' +
//      '<tbody data-brackets-id="1183"><tr data-brackets-id="1184" style="padding:0;text-align:left;vertical-align:top"><th data-brackets-id="1185" style="Margin:0;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left"><img data-brackets-id="1186" src="http://res.cloudinary.com/dyqcevdpm/image/upload/v1513088859/logoWhite_1_otqqfh.png" style="-ms-interpolation-mode:bicubic;clear:both;display:block;max-width:100%;outline:0;text-decoration:none;width:44%!important;padding-left: 2%;padding-top: 2%;"></th></tr></tbody></table></th><th data-brackets-id="1187" class="small-4 large-4 columns last" valign="middle" style="Margin:0 auto;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;padding-bottom:0;padding-left:0;padding-right:0;text-align:left;width:298px"><p data-brackets-id="1188" style="Margin:0;Margin-bottom:10px;color: #fff;font-family:Lato,sans-serif;font-size:.8em;font-weight:400;line-height:1.3;margin:0;margin-bottom:0;padding:0;text-align: right;padding-right: 4%;padding-top: 3%;">Download App</p><span data-brackets-id="1189" style=""><a data-brackets-id="1190" href="https://play.google.com/store/apps/details?id=com.beusalons.android&amp;amp;hl=en" style="Margin:0;color:#2199e8;font-family:Helvetica,Arial,sans-serif;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left;text-decoration:none"><img data-brackets-id="1191" src="http://res.cloudinary.com/dyqcevdpm/image/upload/v1513147617/android_ju6eid.png" style="-ms-interpolation-mode:bicubic;border:none;clear:both;max-width:100%;outline:0;text-decoration:none;width: 6%!important;padding-top: 1%;"></a></span><span data-brackets-id="1192" style="padding-left: 8%;"><a data-brackets-id="1193" href="https://itunes.apple.com/app/id1206326408?mt=8" style="Margin:0;color:#2199e8;font-family:Helvetica,Arial,sans-serif;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left;text-decoration:none"><img data-brackets-id="1194" src="http://res.cloudinary.com/dyqcevdpm/image/upload/v1513147617/apple_icon_umb9z8.png" style="-ms-interpolation-mode:bicubic;border:none;clear:both;max-width:100%;outline:0;text-decoration:none;width: 6%!important;"></a></span></th></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table><table data-brackets-id="1195" align="center" style="Margin:0 auto;background:#fefefe;border-collapse:collapse;border-spacing:0;float:none;margin:0 auto;padding:0;text-align:center;vertical-align:top;width:580px"><tbody data-brackets-id="1196"><tr data-brackets-id="1197" style="padding:0;text-align:left;vertical-align:top"><td data-brackets-id="1198" style="Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word"><table data-brackets-id="1199" style="border-collapse:collapse;border-spacing:0;display:table;padding:0;position:relative;text-align:left;vertical-align:top;width:100%"><tbody data-brackets-id="1200" style="width: 100%;"><tr data-brackets-id="1201" style="padding:0;text-align:left;vertical-align:top">' +
//      '<th data-brackets-id="1202" style="Margin:0 auto;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;text-align:left;"><a href="http://onelink.to/bf45qf"><img data-brackets-id="1203" src="http://res.cloudinary.com/dyqcevdpm/image/upload/v1513248866/flat_price_emailer_lo0ebz.png" alt="text" style="width: 100%;/* padding-bottom: 6%; */"></a></th></tr><tr data-brackets-id="1204" style="padding:0;text-align:left;vertical-align:top"><th data-brackets-id="1205" style="Margin:0 auto;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;text-align:left;"><a href="http://onelink.to/bf45qf"><img data-brackets-id="1206" src="http://res.cloudinary.com/dyqcevdpm/image/upload/v1513248721/family_wallet_mn61tb.png" alt="text" style="width: 100%;/* padding-bottom: 6%; */"></a></th></tr><tr data-brackets-id="1207" style="padding:0;text-align:left;vertical-align:top"><th data-brackets-id="1208" style="Margin:0 auto;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;text-align:left;"><a href="http://onelink.to/bf45qf"><img data-brackets-id="1209" src="http://res.cloudinary.com/dyqcevdpm/image/upload/v1513248719/customise_package_fukzqp.png" alt="text" style="width: 100%;/* padding-bottom: 6%; */"></a></th></tr></tbody></table><table data-brackets-id="1210" style="border-collapse:collapse;border-spacing:0;display:table;padding:0;position:relative;text-align:left;vertical-align:top;width:100%"><tbody data-brackets-id="1211"><tr data-brackets-id="1212" style="padding:0;text-align:left;vertical-align:top"><th data-brackets-id="1213" style="Margin:0 auto;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;padding-bottom:16px;padding-left:16px;padding-right:16px;text-align:left;width:564px"><table data-brackets-id="1214" style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%"><tbody data-brackets-id="1215"><tr data-brackets-id="1216" style="padding:0;text-align:left;vertical-align:top"><td data-brackets-id="1217" height="32px" style="Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:32px;font-weight:400;line-height:32px;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word"></td></tr><tr data-brackets-id="1218" style="padding:0;text-align:left;vertical-align:top"><th data-brackets-id="1219" style="Margin:0;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left"><table data-brackets-id="1220" class="callout" style="Margin-bottom:16px;border-collapse:collapse;border-spacing:0;margin:auto;margin-bottom:16px;padding:0;text-align:left;vertical-align:top;width:30%!important"><tbody data-brackets-id="1221"><tr data-brackets-id="1222" style="padding:0;text-align:left;vertical-align:top"><th data-brackets-id="1223" style="Margin:0 auto;color:#0a0a0a;float:none;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;text-align:left" class="menu-item float-center">' +
//      '<a data-brackets-id="1224" href="https://www.facebook.com/BeUSalons/" style="Margin:0;color:#2199e8;font-family:Helvetica,Arial,sans-serif;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left;text-decoration:none"><img data-brackets-id="1225" src="http://res.cloudinary.com/dyqcevdpm/image/upload/v1291284496/social__ICON_2_dsofvy.png" alt="facebook" width="30" height="30" style="-ms-interpolation-mode:bicubic;border:none;clear:both;display:block;max-width:100%;outline:0;text-decoration:none;width:auto"></a></th><th data-brackets-id="1226" style="Margin:0 auto;color:#0a0a0a;float:none;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;text-align:left" class="menu-item float-center"><a data-brackets-id="1227" href="https://plus.google.com/100683126750126363146" style="Margin:0;color:#2199e8;font-family:Helvetica,Arial,sans-serif;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left;text-decoration:none"><img data-brackets-id="1228" src="http://res.cloudinary.com/dyqcevdpm/image/upload/v1291284496/social__ICON_3_qdqnsk.png" alt="facebook" width="30" height="30" style="-ms-interpolation-mode:bicubic;border:none;clear:both;display:block;max-width:100%;outline:0;text-decoration:none;width:auto"></a></th><th data-brackets-id="1229" style="Margin:0 auto;color:#0a0a0a;float:none;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;text-align:left" class="menu-item float-center"><a data-brackets-id="1230" href="https://www.instagram.com/beusalons/" style="Margin:0;color:#2199e8;font-family:Helvetica,Arial,sans-serif;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left;text-decoration:none"><img data-brackets-id="1231" src="http://res.cloudinary.com/dyqcevdpm/image/upload/v1291284496/social__ICON_4_twk3mc.png" alt="facebook" width="30" height="30" style="-ms-interpolation-mode:bicubic;border:none;clear:both;display:block;max-width:100%;outline:0;text-decoration:none;width:auto"></a></th></tr></tbody></table></th><th data-brackets-id="1232" style="Margin:0;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0!important;text-align:left;width:0"></th></tr><tr data-brackets-id="1233" style="padding:0;text-align:left;vertical-align:top"><th data-brackets-id="1234" style="Margin:0;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left"><table data-brackets-id="1235" style="Margin-bottom:16px;border-collapse:collapse;border-spacing:0;margin-bottom:16px;padding:0;text-align:left;vertical-align:top;width:100%!important"><tbody data-brackets-id="1236"><tr data-brackets-id="1237" style="padding:0;text-align:left;vertical-align:top"><td data-brackets-id="1238" style="Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word"><p data-brackets-id="1239" style="Margin:0;Margin-bottom:10px;color:#58595b!important;font-family:"Open Sans",sans-serif;font-size:.8em!important;font-weight:400;line-height:1.3;margin:0;margin-bottom:10px;padding:0;text-align:left;word-wrap:normal"></p></td></tr></tbody>' +
//      '</table></th><th data-brackets-id="1240" style="Margin:0;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0!important;text-align:left;width:0"></th></tr></tbody></table></th></tr></tbody></table></td></tr></tbody></table></center></td></tr></tbody></table></div></body></html>'

//         var sendMails = function(skipLim, totalRounds){
// console.log("functionnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn")
//             console.log("skipLim" ,skipLim)
//             console.log("totalRounds" ,totalRounds)
//             var skipLim = skipLim;

//         MarketingUser.find({emailId :{$ne:null}},{emailId :1, marketingCategories :1}).skip(1000 * (skipLim - 1)).limit(1000).exec(function(err,marketingUsers){
//             console.log(marketingUsers.length)
//             async.each(marketingUsers, function(mUser , callback){
//                 if(mUser.marketingCategories[0].lastAppointmentDate != null){
//                     console.log("11111111111")
//                     var five = fiveMonths.getTime();
//                     var lastAppointmentTime = mUser.marketingCategories[0].lastAppointmentDate.getTime();
//                     if(lastAppointmentTime < five){
//                         // sendElasticMail(mUser.emailId , html , "Long time, No Hair Service !! Check out latest HAIR DEALS");

// mUser.marketingCategories[0].lastDate.mail = today;
//     console.log("aayaaaaaa")
//     MarketingUser.update({_id : mUser._id} , {marketingCategories : mUser.marketingCategories },function(err,update){
//         // console.log(update)
//     d.push(mUser)
// callback();
// })

// }else{
// sendElasticMail(mUser.emailId , html , "4 Hair Deals to try in 2018!");

// mUser.marketingCategories[0].lastDate.mail = today;

// MarketingUser.update({_id : mUser._id} , {marketingCategories : mUser.marketingCategories },function(err,update){
//     // console.log(update)
// console.log("mmmmmmmmmmmmmmmmmmmm")
// d.push(mUser)
// callback();
// })
// }
// }else{
//                     sendElasticMail(mUser.emailId , html , "4 Hair Deals to try in 2018!");

//                     mUser.marketingCategories[0].lastDate.mail = today;

//                         MarketingUser.update({_id : mUser._id} , {marketingCategories : mUser.marketingCategories },function(err,update){
//                             // console.log(update)
// console.log("ggggggggggggggggggggggggg")
//                             d.push(mUser)
//                             callback();
//                         // })
//                 }
//             },function allTaskCompleted(){
//                 skipLim++;
//                 console.log("skipLim222222222222222222222")
//                 if(skipLim <= totalRounds){
//                 sendMails(skipLim, totalRounds);
//                 }else{
//                     console.log("All done");
//                 }

//             })
//         })

//         }

//         MarketingUser.find({}).count(function(err, count) {
//             var totalUsers = count;
//             var totalRounds = Math.round(totalUsers/1000);
//             sendMails(1, totalRounds);
//         })




//     }

// });


function inventory(req, res) {

    var lastMonthStart = HelperService.lastMonthStart();
    var lastMonthEnd = HelperService.getLastMonthEndDate();
    var emailIds = []

    Parlor.find({}, { name: 1 }, function(err, parlors) {
        async.each(parlors, function(p, cbs) {
            ReOrder.find({ status: 0, parlorId: p._id, $where: "this.imageUrl.length ==0", receivedAt: { $gte: lastMonthStart, $lt: lastMonthEnd } }, { name: 1 }, function(err, reorders) {})
            if (reorders.length > 0) {
                Beu.findOne({ parlorIds: p._id, role: 3 }, { emailId: 1 }, function(err, opsId) {
                    Admin.findOne({ parlorId: p._id, role: 7 }, function(err, owner) {

                        emailIds.push({ ops: opsId.emailId, owner: owner.emailId })
                        cbs();
                    })
                })
            } else {
                cbs();
            }
        })

    }, function() {
        var sentMail = "";
        _.forEach(emailIds, function(d) {

            var transporter = nodemailer.createTransport('smtps://appointments@beusalons.com:wx2t2Tr7pMrqnK2CIqwd3g@smtp.mandrillapp.com');
            var mailOptions = {
                from: 'inventory@beusalons.com', // sender address
                to: d.owner, // list of receivers
                cc: d.ops,
                html: sentMail,
                subject: 'Inventory Bills Not uploaded' // Subject line
            };

            transporter.sendMail(mailOptions, function(error, info) {
                if (error)
                    return console.log(error);
                else
                    console.log(info);
            });
        })


    })

};


var sendMailForInventoryBills = schedule.scheduleJob('00 00 00 01 * *', inventory);
var sendMailForInventoryBills = schedule.scheduleJob('00 00 00 03 * *', inventory);
var sendMailForInventoryBills = schedule.scheduleJob('00 00 00 04 * *', inventory);



var dailySummaryNotification = schedule.scheduleJob('00 30 22 * * *', function(req, res) {
   
    if (localVar.isServer() && localVar.getInstanceId() == 2) {
        Parlor.find({ active: true , parlorType :{$ne : 4}}, { name: 1 }, function(err, parlors) {
            _.forEach(parlors, function(par) {
                var firebaseIds = [];
                var firebaseIdIOS = [];
                    Beu.find({role:3, parlorIds: par._id}, {firebaseId : 1, phoneNumber :1, role:1 , firebaseIdIOS:1} , function(err , beus){
                    Admin.find({ parlorIds: par._id, role: {$in : [2,7]} }, {firebaseId :1 ,phoneNumber :1, role:1 , firebaseIdIOS:1}, function(err, admin) {
                        _.forEach(admin, function(ad) { firebaseIds.push({fId : ad.firebaseId, ownerId : ad._id , role : ad.role}) } );
                        _.forEach(admin, function(ad) { firebaseIdIOS.push({fId : ad.firebaseIdIOS, ownerId : ad._id , role : ad.role}) } );
                        _.forEach(beus , function(b){ firebaseIds.push({fId: b.firebaseId , ownerId: b._id , role : b.role}) });
                        _.forEach(beus , function(b){ firebaseIdIOS.push({fId: b.firebaseIdIOS , ownerId: b._id , role : b.role}) });
                        var query = { _id: par._id },
                            date = new Date();
                        Appointment.dailyReport(query, date, function(err, data) {
                            var result = data.reports;

                                var date2 =  new Date().toDateString();
                                for (var i = 0; i < result.length; i++) {
                                    var parName = '';
                                    parName +=  result[i].parlorName + ' | ' + result[i].parlorAddress ;
                                }
                                var records = data.payment ,cash=records[0].amount , card=records[1].amount , app=records[3].amount , loyalty = data.totalLoyalityPoints;
                                var message= "Register Closure for "+date2+": "+parName+" Serv Rev:"+Math.round(data.totalServiceRevenue)+" Prod Rev:"+Math.round(data.totalProductSale)+" Cash:"+cash+" Card:"+card+" Be U App: "+app+"Be U Freebie: "+loyalty.toFixed(2)+"";

                            if(firebaseIds.length>0){
                                 _.forEach(firebaseIds, function (f){
                                        var notiData = {
                                            type: "dailySummary",
                                            title: "Daily Report",
                                            body: message,
                                            parlorId : par._id,
                                            ownerId : f.ownerId,
                                            firebaseId : f.fId,
                                            role : f.role,
                                            sendingDate : new Date(),
                                        }
                                        OwnerNotifications.createNotificationObj( notiData , function (err, response) {
                                            OwnerNotifications.sendOwnerNotification(notiData.firebaseId , notiData.title, notiData.body, notiData.type , function(err , e){
                                            }) 
                                        });
                                })                                      
                            }
                            if(firebaseIdIOS.length >0){
                                _.forEach(firebaseIdIOS , function(f ){
                                    var notiData = {
                                        type: "dailySummary",
                                        title: "Daily Report",
                                        body: message,
                                        parlorId : par._id,
                                        ownerId : f.ownerId,
                                        firebaseId :f.fId,
                                        role :f.role,
                                        sendingDate :new Date(),
                                    };
                                    OwnerNotifications.createNotificationObj( notiData , function (d) {
                                        OwnerNotifications.sendIOSNotificationOnEmployeeApp(notiData.firebaseId , notiData.title, notiData.body, notiData.type , function(err , e){
                                        })
                                    });
                                }) 
                            }
                        });
                    })
                })
            })
        })
    }
});



var createEmployeeCoupons = schedule.scheduleJob('00 01 00 01 * *' , function( req, res){
    if(localVar.isServer() && localVar.getInstanceId() == 2){
       User.createEmployeeCoupon(new Date());
    }
});



var subscriptionExpiryNotification = schedule.scheduleJob('00 00 16 * * *' , function( req, res){
    if(localVar.isServer() && localVar.getInstanceId() == 2){
        let expiryStartDate = HelperService.getCustomMonthStartDate(new Date().getFullYear() -1 , new Date().getMonth());
        let expiryEndDate = HelperService.getMonthEndDate(new Date().getFullYear() -1 , new Date().getMonth());
        let lastDay = HelperService.getDateFormatForNotification( expiryEndDate)
       
        SubscriptionSale.aggregate([
                {$group : {_id: '$userId' , count:{$sum :1} , createdAt :{$first : "$createdAt"}}},
                {$match : {count: {$eq :1} , createdAt :{$gte: expiryStartDate , $lte :expiryEndDate}}},
                {$lookup : {from : "users" , localField : "_id" , foreignField : "_id" , as : "user"}},
                {$project : {phoneNumber : {$arrayElemAt : ['$user.phoneNumber' , 0]} ,firebaseId : {$arrayElemAt : ['$user.firebaseId' , 0]},
                firebaseIdIOS : {$arrayElemAt : ['$user.firebaseIdIOS' , 0]}}}
        ], function(err, users) {
            // User.find({phoneNumber : {$in : ["8010178215" , "8826345311"]}}, function(err , users){
            console.log(users.length)
            var fbId = [] , fbIos = [];
            var data1 = { type: "subscription", title: "Renew Your Subscription", body: "Your subscription expires on "+lastDay+". Renew your subscription before it expires and get ₹ 200 off.", sImage: "", lImage: "" };

            var data2 = { type: "subscription", title: "Renew Your Subscription", body: "Your subscription expires on "+lastDay+". Renew your subscription before it expires and get ₹ 200 off.", sImage: "", lImage: "" };

            _.forEach(users, function(user) {
                if (user.firebaseId) fbId.push(user.firebaseId);
                if (user.firebaseIdIOS) fbIos.push(user.firebaseIdIOS);
            })
            async.parallel([
                function(done) {
                    async.each([1, 2], function(p, callback) {
                        if (p == 1) {
                            Appointment.sendAppNotificationAdmin(fbId, data1, function(err, data) {
                                
                                callback();
                            })
                        }
                        if (p == 2) {
                            Appointment.sendAppNotificationIOSAdmin(fbIos, data2, function(err, data) {
                                
                                callback();
                            })
                        }
                    }, done);
                }
            ], function allTaskCompleted() {
                console.log('done');
            });
        })
    }
});



var subscriptionExpiryNotificationPerviosMonth = schedule.scheduleJob('00 00 15 * * *' , function( req, res){
    if(localVar.isServer() && localVar.getInstanceId() == 2){
        let expiryStartDate = HelperService.getCustomMonthStartDate(new Date().getFullYear() -1 , new Date().getMonth()-1);
        let expiryEndDate = HelperService.getMonthEndDate(new Date().getFullYear() -1 , new Date().getMonth()-1);
        let lastDay = HelperService.getDateFormatForNotification( expiryEndDate)
       
        SubscriptionSale.aggregate([
                {$group : {_id: '$userId' , count:{$sum :1} , createdAt :{$first : "$createdAt"}}},
                {$match : {count: {$eq :1} , createdAt :{$gte: expiryStartDate , $lte :expiryEndDate}}},
                {$lookup : {from : "users" , localField : "_id" , foreignField : "_id" , as : "user"}},
                {$project : {phoneNumber : {$arrayElemAt : ['$user.phoneNumber' , 0]} ,firebaseId : {$arrayElemAt : ['$user.firebaseId' , 0]},
                firebaseIdIOS : {$arrayElemAt : ['$user.firebaseIdIOS' , 0]}}}
        ], function(err, users) {
            // User.find({phoneNumber : {$in : ["8010178215" , "8826345311"]}}, function(err , users){
            console.log(users.length)
            var fbId = [] , fbIos = [];
            var data1 = { type: "default", title: "Renew Your Subscription", body: "Your subscription expired on "+lastDay+". Renew your subscription and get 1 month extension.", sImage: "", lImage: "" };

            var data2 = { type: "default", title: "Renew Your Subscription", body: "Your subscription expired on "+lastDay+". Renew your subscription and get 1 month extension.", sImage: "", lImage: "" };

            _.forEach(users, function(user) {
                if (user.firebaseId) fbId.push(user.firebaseId);
                if (user.firebaseIdIOS) fbIos.push(user.firebaseIdIOS);
            })
            async.parallel([
                function(done) {
                    async.each([1, 2], function(p, callback) {
                        if (p == 1) {
                            Appointment.sendAppNotificationAdmin(fbId, data1, function(err, data) {
                                
                                callback();
                            })
                        }
                        if (p == 2) {
                            Appointment.sendAppNotificationIOSAdmin(fbIos, data2, function(err, data) {
                                
                                callback();
                            })
                        }
                    }, done);
                }
            ], function allTaskCompleted() {
                console.log('done');
            });
        })
    }
});

var expireSubscriptionYearly = schedule.scheduleJob('00 00 01 01 * *' , function( req, res){
    if(localVar.isServer() && localVar.getInstanceId() == 2){
        var today = new Date().getDate();
        if(today == 1){
            let subscriptionExpiry = HelperService.getMonthEndDate(new Date().getFullYear() -1 , new Date().getMonth());
            User.updateMany({subscriptionBuyDate :{$lte : subscriptionExpiry} , subscriptionId: {$ne : 0}},{subscriptionLoyality: 0, subscriptionId: 0, subscriptionValidity : 0}, function(err , users){
                console.log(users.length)
            })
        }
        User.updateMany({subscriptionId : 1, subscriptionBuyDate : {$lt : HelperService.getLastMonthStartDate(new Date(), 29)}, subscriptionValidity : 1}, {subscriptionId : 0, subscriptionLoyality : 0, subscriptionValidity : 0}, function(er, f){
            console.log('done')
        })
    }
});

var expireSubscriptionDaily = schedule.scheduleJob('00 00 02 01 * *' , function( req, res){
    if(localVar.isServer() && localVar.getInstanceId() == 2){
        var lastMonthStart = HelperService.getLastMonthStart();
        User.updateMany({subscriptionBuyDate :{$lte : lastMonthStart}, subscriptionId: {$ne : 0}, subscriptionValidity : 1},{subscriptionLoyality: 0, subscriptionId: 0, subscriptionValidity : 0}, function(err , users){
            console.log(users.length)
        })
    }
});


var updateLuckyDrawFails = schedule.scheduleJob('00 00 12 * * *' , function( req, res){
    if(localVar.isServer() && localVar.getInstanceId() == 2){
       LuckyDrawDynamic.findOne({updatedAt : {$gte : HelperService.getDayStart(new Date()) , $lte : HelperService.getDayEnd(new Date())} , status:3} , function(err, lucky){
            LuckyDrawDynamic.updateMany({createdAt : {$gte:HelperService.getDayStart(lucky.createdAt) , $lte : HelperService.getDayEnd(lucky.createdAt),status:2 }}, {status :4 , updatedAt : new Date()} ,function(err, updated){
                console.log("done")
            })
       })
    }
});


//scheduler to find average number of clients for every parlor
var averageClientsOfParlor = schedule.scheduleJob('00 00 02 * * *', function( req, res){
    if(localVar.isServer() && localVar.getInstanceId() == 1){
        Parlor.find({active:true},{name:1,active:1}).exec((err,parlors)=>{
            if(err){
                console.log('err')
            }else{
                async.eachSeries(parlors,(parlor,cb)=>{
                    console.log(parlor)
                    Appointment.averageNoOfClientsPerDay(parlor._id)
                    cb();
                })
            }
        })
    }
})

//scheduler to loop through not captured payment in authorized payments
schedule.scheduleJob('19 * * * * *', function( req, res){
    var RAZORPAY_KEY = localVar.getRazorKey();
    var RAZORPAY_APP_SECRET = localVar.getRazorAppSecret();
    var Razorpay = require('razorpay');
    var instance = new Razorpay({
        key_id: RAZORPAY_KEY,
        key_secret: RAZORPAY_APP_SECRET
    });
    if(localVar.isServer() && localVar.getInstanceId() == 1){
        AuthorizedPayment.find({captured:false,createdAt:{$gt:HelperService.get5minBefore(),$lt:HelperService.get30secBefore()}
        },(err,payments)=>{
            if(err){
                console.log('Server error')
            }else{
                console.log(payments)
                async.eachSeries(payments,(payment,cb)=>{
                    let obj = {
                        razorpay_payment_id: payment.razorPaymentId,
                        bookByApp: 0,
                        amount: payment.amount,
                        bookByNewApp : 1,
                    };
                    AuthorizedPayment.update({_id:payment._id},{schedulerUpdatedAt:new Date()},(err,updated)=>{
                        if(!err)console.log('updated')
                    })
                    Appointment.captureRazorPayment(instance, obj, function(response1) {
                        console.log(response1);
                        console.log(!response1.success)
                        payment.schedulerUpdatedAt = new Date()
                        payment.save()
                        if(!response1.success)
                        {
                            Appointment.findOne({_id:payment.appointmentId},{parlorName:1,client:1},(err,appointment)=>{
                                var transporter = nodemailer.createTransport('smtps://reports@beusalons.com:wx2t2Tr7pMrqnK2CIqwd3g@smtp.mandrillapp.com');
                                var mailOptions = {
                                    from: 'info@beusalons.com', // sender address
                                    to: ['shailendra@beusalons.com','meghaagrawal@beusalons.com', 'ranjankumar@beusalons.com' , 'ramjipal@beusalons.com'] ,// list of receivers
                                    html: '<div><div> Payment not captured for appointment Id: '+payment.appointmentId+' At '+appointment.parlorName+'.</div><br><br>'+'Please contact '+appointment.client.name+' at '+appointment.client.phoneNumber+'.</div>',
                                    subject: 'Payment for PaymentId : '+ payment.razorPaymentId+ ' Failed' // Subject line
                                };   
                                sendEmail(transporter,mailOptions);
                            }) 
                            cb()
                        }
                        else{
                            cb();
                        }
                    });
                },()=>{
                    console.log('Done')
                })
            }
            })
    }
})

function appointmentReminder(number){
    var message = "hi%20megha%20,your%20appointment%20has%20been%20booked."
    var options = {
        "method": "POST",
        "hostname": "control.msg91.com",
        "port": null,
        "path": "/api/sendVoiceCall.php?authkey=164034A8OH15qao5d0a1fce&message="+message+"&to="+number+"&from=918826345311",
        "headers": {}
    };
    console.log(options)
    var req = http.request(options, function (res) {
        var chunks = [];
        
        res.on("data", function (chunk) {
            chunks.push(chunk);
        });
        
        res.on("end", function () {
            var body = Buffer.concat(chunks);
            console.log(body.toString());
        });
    });
    
    req.end();
}


schedule.scheduleJob('00 9 * * * *', function(req,res){
    let d = new Date()
    console.log(d)
    Appointment.aggregate([
        {$match:{appointmentStartTime:{$gte:HelperService.get25MinAfter(),$lt:HelperService.get30MinAfter()}}},
        {$project:{
            appointmentStartTime: "$appointmentStartTime",
            parlorId: "$parlorId"
        }}
    ],(err,appointments)=>{
        console.log(appointments)
        async.eachSeries(appointments,(appointment,cb)=>{
            Admin.findOne({role:2,active:true,parlorId:appointment.parlorId},{phoneNumber:1},(err,manager)=>{
                console.log(manager.phoneNumber)
                //appointmentReminder(manager.phoneNumber)
            })
            console.log('if working')
            cb()
        })
    })
})
            


schedule.scheduleJob('00 00 01 * * *', function(req,res){
    if(localVar.isServer() && localVar.getInstanceId() == 1){
        Appointment.updateUsersInMarketingUsers();
    }
})

// var pdfcrowd = require("pdfcrowd");
// var fs = require("fs");

// // create the API client instance
// var client = new pdfcrowd.PdfToPdfClient("shailendra201", "95741ac59b2283562f833d1476ec02d3");

// // configure the conversion
// try {
//     client.addPdfRawData(fs.readFileSync("123.pdf"));
//     client.addPdfRawData(fs.readFileSync("45.pdf"));
// } catch(why) {
//     console.error("Pdfcrowd Error: " + why);
//     console.error("Pdfcrowd Error Code: " + why.getCode());
//     console.error("Pdfcrowd Error Message: " + why.getMessage());
//     process.exit(1);
// }

// // run the conversion and write the result to a file
// client.convertToFile(
//     "final.pdf",
//     function(err, fileName) {
//         if (err) return console.error("Pdfcrowd Error: " + err);
//         console.log("Success: the file was created " + fileName);
//     })


module.exports = app;

