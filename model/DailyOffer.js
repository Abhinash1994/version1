/**
 * Created by Nikita on 5/23/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dailyOfferSchema = new Schema({
    userId : {type : Schema.ObjectId, default : null},

    cityId : {type : 'number', default : 100}, //1- NCR

    action : {type : 'string', default : 'offer'}, // offer, started, review,  freebie, recommendation

    appointmentId : {type : Schema.ObjectId, default : null},

    imageUrl1 : {type : 'string', default : null},

    imageUrl2 : {type : 'string', default : null},

    title : {type : 'string'},

    body : {type : 'string'},

    sendSms : {type : 'boolean', default : false},

    smsContent : {type : 'string',default : null},

    sendingDate : { type: 'date', default: Date.now() },

    sent : {type : 'boolean', default : true},

    active : {type : 'boolean', default : true},

    createdAt : { type: 'date', default: Date.now() },

    gender:{type:'string'} , // M-Male , F-Female

    type : {type:'number'}, //User Type - Red , Blue , Green , Undefined

    dealId:{type:'number'}
});


dailyOfferSchema.statics.getNewObjDailyOffer =  function(userData,req){
    Parlor.find({active:true},{name:1,parlorType:1},function(err,parlors){
    var d = []
        var async = require('async');
           async.parallel([
                function (done) {
                    async.each(userData, function (uD, callback) {
                        if (uD._id.gender == "M") {
                            _.forEach(uD.parlors,function(par){
                                var uAndroidId=[], uIosId=[];
                                _.forEach(parlors, function(parl){ 
                                    var androidId=[] , iosId=[];
                                    if(par.parlorId.length>0){
                                        _.forEach(par.parlorId,function(pp){
                                            if(pp.parlorId == parl.id){
                                                _.forEach(par.fire,function(f){
                                                    if(f.firebaseId)androidId.push(f.firebaseId)
                                                    else iosId.push(f.firebaseIdIOS)
                                                })
                                            }
                                        })
                                        DailyOffer.find({gender:"M" , type:parl.parlorType},{title:1,body:1,sendingDate:1,type:1,action:1,gender:1,dealId:1},function(err,dailyOffer) {
                                            _.forEach(dailyOffer,function(d){
                                                Deals.aggregate([{$match : {dealId : d.dealId}},{$group : {_id:"$dealId" ,minPrice:{$min:"$dealPrice"}}}]).exec(function(err,deal){
                                                    var str = d.title ,priceTitle = str.replace(/X/i, ''+deal[0].minPrice+'');
                                                    var str2 = d.body ,priceBody = str2.replace(/X/i, ''+deal[0].minPrice+'');
                                                    var data ={type: "offer",title: priceTitle, body: priceBody}
                                                     
                                                    async.parallel([
                                                        function (done) {
                                                            async.each([1, 2], function (p, callback) {
                                                                if (p == 1) {
                                                                    Appointment.sendAppNotificationAdmin(androidId,data , function (err, data) {
                                                                        d.push(data);
                                                                        callback();
                                                                    })
                                                                }
                                                                if (p == 2) {
                                                                    Appointment.sendAppNotificationIOSAdmin(iosId, data, function (err, data) {
                                                                        d.push(data);
                                                                        callback();
                                                                    })
                                                                }
                                                            }, done);
                                                        }
                                                    ], function allTaskCompleted() {
                                                        return res.json(d);
                                                        console.log('done');
                                                    });
                                                })
                                            })
                                        })
                                    }else{
                                        _.forEach(par.fire,function(f){
                                            if(f.firebaseId)uAndroidId.push(f.firebaseId)
                                            else uIosId.push(f.firebaseIdIOS)
                                        })
                                        DailyOffer.find({gender:"M" , type:3},{title:1,body:1,sendingDate:1,type:1,action:1,gender:1,dealId:1},function(err,dailyOffer) {
                                            _.forEach(dailyOffer,function(d){
                                                Deals.aggregate([{$match : {dealId : d.dealId}},{$group : {_id:"$dealId" ,minPrice:{$min:"$dealPrice"}}}]).exec(function(err,deal){
                                                    var str = d.title ,priceTitle = str.replace(/X/i, ''+deal[0].minPrice+'');
                                                    var str2 = d.body ,priceBody = str2.replace(/X/i, ''+deal[0].minPrice+'');
                                                    var data ={type: "offer",title: priceTitle, body: priceBody}
                                                    async.parallel([
                                                        function (done) {
                                                            async.each([1, 2], function (p, callback) {
                                                                if (p == 1) {
                                                                    Appointment.sendAppNotificationAdmin(uAndroidId,data , function (err, data) {
                                                                        d.push(data);
                                                                        callback();
                                                                    })
                                                                }
                                                                if (p == 2) {
                                                                    Appointment.sendAppNotificationIOSAdmin(uIosId, data, function (err, data) {
                                                                        d.push(data);
                                                                        callback();
                                                                    })
                                                                }
                                                            }, done);
                                                        }
                                                    ], function allTaskCompleted() {
                                                        return res.json(d);
                                                        console.log('done');
                                                    });
                                                })
                                            })
                                        })
                                    }
                                })
                            })
                        }
                        if (uD._id.gender == "F") {
                             _.forEach(uD.parlors,function(par){
                                var uAndroidId=[], uIosId=[];
                                _.forEach(parlors, function(parl){ 
                                    var androidId=[], iosId=[];
                                    if(par.parlorId.length>0){
                                        _.forEach(par.parlorId,function(pp){
                                            if(pp == parl.id){
                                                _.forEach(par.fire,function(f){
                                                    if(f.firebaseId)androidId.push(f.firebaseId)
                                                    else iosId.push(f.firebaseIdIOS)
                                                })
                                            }
                                        })
                                        DailyOffer.find({gender:"F" , type:parl.parlorType},{title:1,body:1,sendingDate:1,type:1,action:1,gender:1,dealId:1},function(err,dailyOffer) {
                                            _.forEach(dailyOffer,function(d){
                                                Deals.aggregate([{$match : {dealId : d.dealId}},{$group : {_id:"$dealId" ,minPrice:{$min:"$dealPrice"}}}]).exec(function(err,deal){
                                                    var str = d.title ,priceTitle = str.replace(/X/i, ''+deal[0].minPrice+'');
                                                    var str2 = d.body ,priceBody = str2.replace(/X/i, ''+deal[0].minPrice+'');
                                                    var data ={type: "offer",title: priceTitle, body: priceBody}
                                                     var d2= [];
                                                    async.parallel([
                                                        function (done) {
                                                            async.each([1, 2], function (p, callback) {
                                                                if (p == 1) {
                                                                    Appointment.sendAppNotificationAdmin(androidId,data , function (err, data) {
                                                                        d.push(data);
                                                                        callback();
                                                                    })
                                                                }
                                                                if (p == 2) {
                                                                    Appointment.sendAppNotificationIOSAdmin(iosId, data, function (err, data) {
                                                                        d.push(data);
                                                                        callback();
                                                                    }) 
                                                                }
                                                            }, done);
                                                        }
                                                    ], function allTaskCompleted() {
                                                        return res.json(d);
                                                        console.log('done');
                                                    });
                                                })
                                            })
                                        })
                                    }else{
                                        _.forEach(par.fire,function(f){
                                            if(f.firebaseId)uAndroidId.push(f.firebaseId)
                                            else uIosId.push(f.firebaseIdIOS)
                                        })
                                        DailyOffer.find({gender:"F" , type:3},{title:1,body:1,sendingDate:1,type:1,action:1,gender:1,dealId:1},function(err,dailyOffer) {
                                            _.forEach(dailyOffer,function(d){
                                                Deals.aggregate([{$match : {dealId : d.dealId}},{$group : {_id:"$dealId" ,minPrice:{$min:"$dealPrice"}}}]).exec(function(err,deal){
                                                    var str = d.title ,priceTitle = str.replace(/X/i, ''+deal[0].minPrice+'');
                                                    var str2 = d.body ,priceBody = str2.replace(/X/i, ''+deal[0].minPrice+'');
                                                    var data ={type: "offer",title: priceTitle, body: priceBody,sImage: "", lImage: ""}
                                                     var d1 = [];
                                                    async.parallel([
                                                        function (done) {
                                                            async.each([1, 2], function (p, callback) {
                                                                if (p == 1) {
                                                                    Appointment.sendAppNotificationAdmin(uAndroidId,data , function (err, data) {
                                                                        d.push(data);
                                                                        callback();
                                                                    })
                                                                }
                                                                if (p == 2) {
                                                                    Appointment.sendAppNotificationIOSAdmin(uIosId, data, function (err, data) {
                                                                        d.push(data);
                                                                        callback();
                                                                    })
                                                                }
                                                            }, done);
                                                        }
                                                    ], function allTaskCompleted() {
                                                        return res.json(d);
                                                        console.log('done');
                                                    });
                                                })
                                            })
                                        })
                                    }
                                })
                            })
                        }
                    }, done);
                }
            ], function allTaskCompleted() {
                console.log('done');
                // return res.json(d);
            }); 
        // sendNotification(notificationData,date)
        console.log("done")
        return callback();
    }) 
};


//  on every save, add the date
dailyOfferSchema.pre('save', function(next) {
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

var DailyOffer = mongoose.model('dailyOffer', dailyOfferSchema);


module.exports = DailyOffer;