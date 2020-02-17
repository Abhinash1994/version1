var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var request = require('request');
var async = require('async');

 var notificationSchema = new Schema({
      userId : {type : Schema.ObjectId, default : null},

      cityId : {type : 'number', default : 1}, //1- NCR

      action : {type : 'string', default : 'offer'}, // offer, started, review,  freebie, recommendation

      appointmentId : {type : Schema.ObjectId, default : null}, 

      imageUrl1 : {type : 'string', default : null},

      imageUrl2 : {type : 'string', default : null}, 

      title : {type : 'string'}, 

      body : {type : 'string'}, 

      sendSms : {type : 'boolean', default : false},

      smsContent : {type : 'string',default : null},

      sendingDate : { type: 'date',default:new Date()},

      sent : {type : 'boolean', default : true}, 

      active : {type : 'boolean', default : true},

      createdAt : { type: 'date', default:new Date() }
  });


    notificationSchema.statics.getNewObj =  function(req){
        if(req.body.type == "update"){
            return {
                action: req.body.type,
                title: req.body.title,
                body: req.body.text1,
                cityId: 1,
                sent: true,
                active:false,
                sendingDate:new Date(),
                imageUrl1: req.body.sImage,
                imageUrl2: req.body.lImage
            }
        }if(req.body.type == "profile"){
            return {
                action: req.body.type,
                title: req.body.title,
                body: req.body.text1,
                cityId: 1,
                sent: true,
                active:false,
                sendingDate:new Date(),
                imageUrl1: req.body.sImage,
                imageUrl2: req.body.lImage
            }
        }else {
            return {
                action: req.body.type,
                title: req.body.title,
                body: req.body.text1,
                cityId: 1,
                sent: true,
                imageUrl1: req.body.sImage,
                sendingDate:new Date(),
                imageUrl2: req.body.lImage
            };
        }

    };

    notificationSchema.statics.deleteNotificationFromApp = function(date, callback){
        var cDate = new Date((date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear());
        Notification.find({},{sendingDate:1,active:1 , sent:1 , _id:1}, function(err,notify){
            _.forEach(notify , function(n) {
                var nDate = n.sendingDate;
                var timeDiff = Math.abs(cDate.getTime() - nDate.getTime());
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                if ( diffDays > 7 && n.active == true) {
                    Notification.update({_id : n._id},{active:false},function(err,update){
                        if(err)console.log(err)
                        else {
                            console.log(update)
                            return callback(err, update)
                        }
                    })
                }
            })
        })
    };

    notificationSchema.statics.sendCashbackNotification = function(date,callback){
      var data = "";
        data = {type: "freebie",title: "Get 15% Cashback", body: "Get 15% cash back on your next app payment and check out other exciting features too. Hurry and avail now! *T&C Apply"}
         Notification.create({action : 'freebie', title : data.title, body : data.body, sImage:" ",lImage:" ",active:true,cityId:1,sendingDate:new Date()}, function (err, notify) {
            if (notify) {
                data.notificationId = notify.id;
            }
            var d = [];
            var async = require('async');
            var i = 40;
            for (var i = 0; i < 60; i++) {
                User.find({$or: [{firebaseId: {$exists: true}}, {firebaseIdIOS: {$exists: true}}]}, {firebaseId: 1, firebaseIdIOS: 1}).skip(1000 * i).limit(1000).exec(function (err, users) {
                 // User.find({phoneNumber : " "}).exec(function (err, users) {
                    var fbId = [], fbIos = [], emails = [];
                    _.forEach(users, function (user) {
                        if (user.firebaseId) fbId.push(user.firebaseId);
                        if (user.firebaseIdIOS) fbIos.push(user.firebaseIdIOS);
                        // if (user.emailId) emails.push(user.emailId);
                    })
                    async.parallel([
                        function (done) {
                            async.each([1, 2], function (p, callback) {
                                if (p == 1) {
                                    Appointment.sendAppNotificationAdmin(fbId, data, function (err, data) {
                                        d.push(data);
                                        callback();
                                    })
                                    console.log("android")
                                }
                                if (p == 2) {
                                    Appointment.sendAppNotificationIOSAdmin(fbIos, data, function (err, data) {
                                        d.push(data);
                                        callback();
                                    })
                                    console.log("ios")
                                }
                            }, done);
                        }
                    ], function allTaskCompleted() {
                        return callback(d);
                    });
                })
            }
        })
    };


    notificationSchema.statics.sendFreeThreadingNotification = function(){
    //     var counter = 0;
        var sendThreadingNotification = function(skipLim, totalRounds) {
            var skipLim = skipLim;
            var d = [];
            User.find({gender :"F", $and : [{$or : [{firebaseId: {$exists: true}} , {firebaseIdIOS: {$exists: true}}]} , {$or : [{firebaseId: {$ne: null}} , {firebaseIdIOS: {$ne: null}}]}]}, {firebaseId: 1, firebaseIdIOS: 1 }).limit(1000).skip(1000 * (skipLim - 1)).exec(function(err, users) {
                var fbId = [], fbIos = [];
            var data1 = { type: "default", title: "Free Threading For Lifetime", body: "Book through app and get free threading always!", sImage: "", lImage: "" }

            _.forEach(users, function(user) {
                if (user.firebaseId) fbId.push(user.firebaseId);
                if (user.firebaseIdIOS) fbIos.push(user.firebaseIdIOS);
            })
                async.parallel([
                function(done) {
                    async.each([1, 2], function(p, callback) {
                        if (p == 1) {
                            Appointment.sendAppNotificationAdmin(fbId, data1, function(err, data) {
                                d.push(data);
                                callback();
                            })
                        }
                        if (p == 2) {
                            Appointment.sendAppNotificationIOSAdmin(fbIos, data1, function(err, data) {
                                d.push(data);
                                callback();
                            })
                        }
                    }, done);
                }
            ], function allTaskCompleted() {

                    skipLim++;
                    if (skipLim <= totalRounds) {
                        sendThreadingNotification(skipLim, totalRounds);
                    } else {
                        console.log("done")
                    }

                })
            })

        }

        User.find({}).count(function(err, count) {
            var totalUsers = count;
            var totalRounds = Math.round(totalUsers / 1000);
            sendThreadingNotification(1, totalRounds);
        })
    };


  //  on every save, add the date
  notificationSchema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();
    this.role = parseInt(this.role);

    // change the updated_at field to current date
    this.updatedAt = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.createdAt)
      this.createdAt = currentDate;
    next();
  });

 var Notification = mongoose.model('notification', notificationSchema);


 module.exports = Notification;