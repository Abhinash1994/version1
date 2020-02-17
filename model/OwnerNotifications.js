var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var async = require('async');

 var ownerNotificationSchema = new Schema({

      ownerId : {type : Schema.ObjectId, default : null},

      parlorId : {type : Schema.ObjectId, default : null},

      action : {type : 'string'}, // dailyReport, productDiscount, billUpload, billReject, settlementReport, subscriptionDraw

      title : {type : 'string'}, 

      role : {type : 'number' }, // 2- manager , 7- owner 

      body : {type : 'string'}, 

      sendingDate : { type: 'date',default:new Date()},

      actionId : {type : 'date'},

      notes : {type: 'string'},

      createdAt : { type: 'date', default:new Date() }
  });



    ownerNotificationSchema.statics.createNotificationObj = function(data , callback){

        let createObj = {
            action : data.type , 
            title : data.title, 
            body : data.body, 
            sendingDate : data.sendingDate , 
            ownerId : data.ownerId, 
            parlorId : data.parlorId , 
            role : data.role,
            actionId : (data.type=='dailySummary') ? new Date() : "",
            notes : data.notes ? data.notes : "",
        }
        OwnerNotifications.create(createObj, function(err , created){
            if(created){

                // sendOwnerNotification(data.firebaseId , data.title, data.body, data.type , function(err , response){
                                
                     return callback();
                // })
                
            }
        })
    };

    ownerNotificationSchema.statics.sendNotifications =function(parlorId ,name, items, orderAmount, date, sendMessage, image, acceptance){
        var firebaseIds = [];
        var firebaseIdIOS = [];
        let phoneNumber = ["9821886534"];
        var receiveDate = date ? date.toDateString() : "";
        var orderAmount = Math.ceil(orderAmount);
        Parlor.findOne({_id: parlorId, parlorType :{$ne : 4}},{name:1},function(err, parlor){
            if(parlor){

                Beu.find({role:{$in : [3,9]}, parlorIds: parlorId}, {firebaseId: 1, phoneNumber: 1, role: 1, firebaseIdIOS: 1} , function(err , beus){

                    Admin.find({role: {$in : [7]} , parlorIds: parlorId}, {firebaseId: 1, phoneNumber: 1, role: 1, firebaseIdIOS: 1} , function(err , salonUsers){
                        
                        _.forEach(beus , function(b){ firebaseIds.push({fId: b.firebaseId , ownerId: b._id , role : b.role}) });

                        _.forEach(beus , function(b){ firebaseIdIOS.push({fId: b.firebaseIdIOS , ownerId: b._id , role : b.role}) });

                        _.forEach(salonUsers , function(s){ firebaseIds.push({fId: s.firebaseId , ownerId: s._id , role : s.role}) });

                        _.forEach(salonUsers , function(s){ firebaseIdIOS.push({fId: s.firebaseIdIOS , ownerId: s._id , role : s.role}) });
                        
                        _.forEach(salonUsers , function(s){ phoneNumber.push(s.phoneNumber) });
                        
                        var message = "Hi, "+parlor.name+" salon your order has been placed successfully."

                        if(items.length>0){
                           let quantity = 0;
                           _.forEach(items, function(i){ quantity += i.orderedQuantity});

                           message = "Hi, "+parlor.name+" salon your order of quantity "+quantity+" of "+name+" has been placed successfully."
                        }
                        if(orderAmount || acceptance){
                            if(acceptance == true && orderAmount > 0){
                                message = "Hi, "+parlor.name+" salon your product bill of "+name+" of amount Rs "+orderAmount+" received on "+receiveDate+", has been approved from Be U."
                            } else if(acceptance == true && orderAmount == 0){
                                message = "Hi, "+parlor.name+" salon your product bill of "+name+" received on "+receiveDate+", has been rejected. For queries please call on 9821886534."
                            } else if(image && orderAmount){
                                message = "Hi, "+parlor.name+" salon your product bill of amount Rs "+orderAmount+" of "+name+" was uploaded successfully."
                            } else{
                                message = "Hi, "+parlor.name+" salon your order of amount Rs "+orderAmount+" of "+name+" has been received. Please upload your bill before month end."
                            }
                        }

                        if(sendMessage == true){
                            var smsMessage = "";
                            if(acceptance == true && orderAmount > 0){
                                smsMessage = "Hi, "+parlor.name+" salon your product bill of "+name+" of amount Rs "+orderAmount+" received on "+receiveDate+", has been approved from Be U."
                            }else if(acceptance == true && orderAmount == 0){
                                smsMessage = "Hi, "+parlor.name+" salon your product bill of "+name+" received on "+receiveDate+", has been rejected. For queries please call on 9821886534."
                            }else{
                                smsMessage = "Hi, "+parlor.name+" salon your order of amount Rs "+orderAmount+" of "+name+" has been received. Please upload your bill before month end.";
                            }

                            _.forEach(phoneNumber , function(p){
                                Appointment.msg91Sms(p, smsMessage, function(e){
                                    
                                })
                            })
                             
                        }

                        if(firebaseIds.length>0){
                            async.each(firebaseIds , function(f , cb){
                                
                                var notiData = {
                                        type: "inventoryBill",
                                        title: "Purchase Order",
                                        body: message,
                                        parlorId : parlorId,
                                        ownerId : f.ownerId,
                                        firebaseId :f.fId,
                                        role :f.role,
                                        sendingDate :new Date(),
                                    };
                                OwnerNotifications.createNotificationObj( notiData , function (d) {
                                        OwnerNotifications.sendOwnerNotification(notiData.firebaseId , notiData.title, notiData.body, notiData.type , function(err , e){
                                            if(e){
                                                cb();
                                            }else
                                                cb();
                                        })
                                    
                                });
                            }, function all(){
                                console.log('done')
                            }) 
                        } 
                        if(firebaseIdIOS.length >0){
                            async.each(firebaseIdIOS , function(f , cb){
                                
                                var notiData = {
                                        type: "inventoryBill",
                                        title: "Purchase Order",
                                        body: message,
                                        parlorId : parlorId,
                                        ownerId : f.ownerId,
                                        firebaseId :f.fId,
                                        role :f.role,
                                        sendingDate :new Date(),
                                    };
                                OwnerNotifications.createNotificationObj( notiData , function (d) {
                                        OwnerNotifications.sendIOSNotificationOnEmployeeApp(notiData.firebaseId , notiData.title, notiData.body, notiData.type , function(err , e){
                                            if(e){
                                                cb();
                                            }else
                                                cb();
                                        })
                                });
                            }, function all(){
                                console.log('done')
                            }) 
                        }
                                       
                    })
                })
            }else{
                console.log("parlorType is affiliate")
            }
        })
    };

    ownerNotificationSchema.statics.sendOwnerNotification= function(firebaseId, title, message, type , callback) {
        console.log("aaya")
        var FCM = require('fcm-push');
        var serverKey = 'AAAA62PmGR4:APA91bG4uTuL789t2XZqDSalketgxqVIRh00ueBnUnCUSuQWNupN-fWTJJhUGG8LfmxNr_M2IYtpBldHLAaeJs_fpjYAxMRGrBhaCcPzah586CohbsIggmXSMstICLkUPIFlqVZabLXh';
        var fcm = new FCM(serverKey);

        var message = {
            to: firebaseId, // required fill with device token or topics
            collapse_key: 'your_collapse_key',
            data: {
                "type": type,
                "title": title,
                "msg": message,
                "targetId": null,
            },

        };

        console.log(message.data.msg)

        fcm.send(message, function(err, response) {
            if (err) {
                console.log("err" ,err)
                return callback(err, null)
            } else {
                console.log("response",response)
                return callback(null, response);
            }
        });
    };

    ownerNotificationSchema.statics.sendIOSNotificationOnEmployeeApp = function(firebaseId , title , body, type , callback){
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
                return callback(null, response);
            }
        });
    };

  
  //  on every save, add the date
  ownerNotificationSchema.pre('save', function(next) {
    var currentDate = new Date();
    this.role = parseInt(this.role);
    this.updatedAt = currentDate;
    if (!this.createdAt)
      this.createdAt = currentDate;
    next();
  });

 var OwnerNotifications = mongoose.model('ownernotification', ownerNotificationSchema);


 module.exports = OwnerNotifications;