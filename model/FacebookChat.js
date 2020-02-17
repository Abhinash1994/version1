/**
 * Created by nikita on 6/28/2018.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var async = require('async');
var request = require('request');

var FacebookChatSchema = new Schema({

    createdAt : { type: 'date' },
  
    updatedAt : { type: 'date' },

    senderId : { type : 'string'},

    parlorId : { type : 'string'},

    level : { type : 'string'}, //1_1- appt , 1_2- Query , 2_1- male , 2_2- female , 3_1 - services , 4_1 - Delhi

    text : { type : 'string'},

    city : { type : 'string'},

    cityId : { type : 'number'},

    locality : { type : 'string'},

    latitude: { type: 'number' },

    longitude: { type: 'number' },

    phoneNumber : { type : 'string'},

    appointmentDate : { type : 'date'},

    date : { type : 'date'},

    query : {type: 'boolean'},

    gender : {type  : "string" , default : "N"}, //M- male, F- female , N- not mentioned
});




FacebookChatSchema.statics.createNewObj = function(senderId , level){
    FacebookChat.findOne({senderId : senderId}).sort({$natural:-1}).exec(function(err , chatFound){
        var obj = {
                senderId : senderId, 
                level : level,

            }
            if(chatFound){
                if(level == '2_1')obj.gender = "F";
                else if(level == '2_2')obj.gender = "M";
                else obj.gender = chatFound.gender;
            } else if(level == "3_1_4" || level == "3_1_5" || level == "3_1_6"){
                obj.gender = "F";
            }else{
                obj.gender = "N"
                if(level == "1_2")obj.query = true;
                else if(level == "1_1")obj.query = true;
            }

        FacebookChat.create(obj , function(err , created){
                console.log("created");
        });
    })
};


FacebookChatSchema.statics.getResponseFromPayload = function(senderId , payload){

    var response  = {'text' : 'Thanks for reaching out to us. We will get back to you shortly!'}
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var payloadStr = payload.substring(0, 3);
    if(payload == "get_started"){
      response = {
              "attachment":{
            "type":"image", 
            "payload":{
              "url":"http://i.amz.mshcdn.com/ZzPk8XAA1KBZ8jpc-DL0RzaXwbc=/fit-in/850x850/http%3A%2F%2Fmashable.com%2Fwp-content%2Fgallery%2Fbeyonces-hair-gifs%2Fhair-fix.gif", 
              "is_reusable":true
            }
          },
        }
    }
    else if (payloadStr == "1_1") { 

        response = { "attachment":{
              "type":"template",
              "payload":{
                "template_type":"button",
                "text":"Select Gender",
                "buttons":[
                    {
                      "type": "postback",
                      "title": "Female",
                      "payload": "2_1"
                    },
                    {
                      "type": "postback",
                      "title": "Male",
                      "payload": "2_2"
                    }
                    
                ]
              }
            }
        }
      
      } else if (payloadStr == "1_2") { 

        response = { "text" : "Enter your message and someone will get back to you within the next 24 hours."
        }
        FacebookChat.createAppointmentDetails(senderId , null , null , null , parlorId , payloadStr)
      
      } else if (payloadStr== "2_1") {

        response = { "attachment":{
              "type":"template",
              "payload":{
                "template_type":"button",
                "text":"Select Services",
                "buttons":[
                  {
                      "type": "postback",
                      "title": "Highlights",
                      "payload": "3_1_1"
                    },
                    {
                      "type": "postback",
                      "title": "Global Color",
                      "payload": "3_1_2"
                    },
                    {
                      "type": "postback",
                      "title": "Keratin",
                      "payload": "3_1_3"
                    }
                ]
              }
            }
        }
      }
      else if ( payloadStr == "2_2") {

        response = { "attachment":{
              "type":"template",
              "payload":{
                "template_type":"button",
                "text":"Select Services",
                "buttons":[
                  {
                      "type": "postback",
                      "title": "Hair Cut",
                      "payload": "3_2_1"
                    },
                    {
                      "type": "postback",
                      "title": "Shaving",
                      "payload": "3_2_2"
                    },
                    // {
                    //   "type": "postback",
                    //   "title": "Manicure/Pedicure",
                    //   "payload": "3_2_3"
                    // }
                ]
              }
            }
        }
      }
      else if ( payload == "3_1_1" || payload == "3_1_2" || payload == "3_1_3" || payload == "3_1_4" || payload == "3_1_5" || payload == "3_1_6" || payload == "3_2_1" || payload == "3_2_2") {


        response = { 'text' : 'Please provide us with your Phone Number.'}

       
      }
      else if ( payloadStr == "5_1" || payloadStr == "5_2" ) {

        response = { "text" : "Type your Locality"}
        
      }else if(payloadStr == "5_0"){
            response = { "attachment":{
                  "type":"template",
                  "payload":{
                    "template_type":"button",
                    "text":"Select City",
                    "buttons":[
                      {
                          "type": "postback",
                          "title": "Delhi/NCR",
                          "payload": "5_1"
                        },
                        {
                          "type": "postback",
                          "title": "Bangalore",
                          "payload": "5_2"
                        }
                    ]
                  }
                }
            }
      }

      else if ( payloadStr == "7_1") {
        var parlorId =  payload.substring(6);
        let num = payload.substring(4,5)-1;
        let closeDay = days[num];
        let text ="Date of Appointment";
        FacebookChat.createAppointmentDetails(senderId , null , null , null , parlorId , null)
        if(num > 0 )text = "Date of Appointment (Note- This Salon is Closed on "+closeDay+")"
          response = { "text" : text}
      }
      return response;
      
};


FacebookChatSchema.statics.createAppointmentDetails = function(senderId ,date , phoneNumber , city , parlorId , queryPayload){
    FacebookChat.findOne({senderId : senderId}).sort({$natural : -1}).exec(function(err , fbChat){
        var query = {senderId : senderId};
        var createObj = {level : "" , senderId : senderId , gender : fbChat.gender};
        var updateObj = {};
        if(parlorId){
            query.level = "7_1";
            createObj.parlorId = parlorId;
            createObj.level = "7_1";
            updateObj.parlorId = parlorId; 
        }else if(date){
            query.level = "8_1";
            createObj.date = date;
            createObj.level = "8_1";
            updateObj.date = date;
        } else if(phoneNumber){
            query.level = "4_1";
            createObj.phoneNumber = phoneNumber;
            createObj.level = "4_1";
            updateObj.phoneNumber = phoneNumber;
        } else if(city){
            var cityId = (city == "Delhi")? 1 : 2;
            var level = (city == "Delhi")? "5_1" : "5_2";
            query.city = {$exists : true};
            createObj.city = city;
            createObj.level = level;
            updateObj.level = level;
            updateObj.city = city;
        } else if(queryPayload){
          updateObj.level = queryPayload;
          updateObj.query = true;
        }
        console.log("createObj" , createObj)
        FacebookChat.findOne(query).sort({$natural:-1}).exec(function(err , exists){
            if(exists){
                FacebookChat.update({_id : exists.id}, updateObj , function(err , created){

                })
                
            } else{
                FacebookChat.create(createObj, function(err , created){

                })
                
            }
        })
    });
};

// FacebookChatSchema.statics.createFinalDetails = function(senderId  , phoneNumber , call){
//     if(phoneNumber.length == 10){
//        FacebookChat.findOne({senderId : senderId , parlorId :{$exists: true}}).sort({$natural:-1}).exec(function(err , fbChat){
//             FacebookChat.create({level : "10_1", senderId : senderId , phoneNumber : phoneNumber , gender : fbChat.gender}, function(err , created){
//                 FacebookChat.createAppointment(senderId, fbChat.parlorId , function(c){
//                     if(c){
//                         call(c);
//                     }
//                 });
//          })
//         })
//    } else  call({ "text" : "Please Enter Correct Phone Number"});
// };


FacebookChatSchema.statics.createFinalDetails = function(senderId ,apptDate , call){
    // if(phoneNumber.length == 10){
       FacebookChat.findOne({senderId : senderId , parlorId :{$exists: true}}).sort({$natural:-1}).exec(function(err , fbChat){
            FacebookChat.create({level : "9_1", senderId : senderId , appointmentDate : apptDate , gender : fbChat.gender}, function(err , created){
                FacebookChat.createAppointment(senderId, fbChat.parlorId , function(c){
                    if(c){
                        call(c);
                    }
                });
         })
        })
   // } else  call({ "text" : "Please Enter Correct Phone Number"});
};


FacebookChatSchema.statics.createAppointment = function(senderId, parlorId , callback){
    console.log("createAppointment")
    var req = {
                body : {
                    "accessToken":"", // accessToken
                    "buildNo":1,
                    "buySubscriptionId":0,
                    "datetime":"", // date
                    "latitude":"", //lat
                    "longitude":"", //long
                    "mode":7,
                    "parlorId": parlorId, // parlorId
                    "paymentMethod":5,
                    "services":[
                    {
                        "addition":0,
                        "brandId": "", //brandId
                        "code": 0, //code
                        "frequencyUsed":false,
                        "isFlashService":false,
                        "productId":"", //productId
                        "quantity":1,
                        "serviceCode":0, // serviceCode
                        "serviceId":"", //serviceId
                        "type":"newPackage",
                        "typeIndex":0
                    }],
                 
                    "useLoyalityPoints":false,
                    "useSubscriptionCredits":false,
                    "userId": "" //userId
                }
             }
    FacebookChat.findOne({senderId : senderId , phoneNumber: {$exists: true}},function(err , userPhone){
        FacebookChat.findOne({senderId : senderId , appointmentDate: {$exists: true}},function(err , appointmentDate){
            req.body.datetime = appointmentDate.appointmentDate;
            User.findOne({phoneNumber : userPhone.phoneNumber}, {_id: 1 , phoneNumber :1 , gender :1,  accessToken :1, latitude :1 , longitude:1} , function(err , existing){
                if(existing){
                     req.body.userId = existing._id;
                     req.body.accessToken = existing.accesstoken;
                     req.body.latitude = 20;
                     req.body.longitude = 20;

                     FacebookChat.getServicesForChat(req , senderId , function(data){

                        Appointment.registerAppointment(data, function (result) {

                            if(result.success == true){
                                captureAppt(result , req, function(c){
                                    callback(c);
                                })
                            }
                        })
                     })

                }else{
                    User.createNew({phoneNumber: userPhone.phoneNumber, firstName: "facebookchat", gender: userPhone.gender , accessToken : "123"},function (err,user) {
                             req.body.userId = user._id;
                             req.body.accessToken = user.accessToken;
                             req.body.latitude = 20;
                             req.body.longitude = 20;
                        FacebookChat.getServicesForChat(req , senderId , function(data){
                            Appointment.registerAppointment(data,function (result) {

                                if(result.success == true){
                                    captureAppt(result , req, function(c){
                                        callback(c);
                                    })
                                } 
                            })
                         })
                    })
                }
            })
        })
    })
};


function captureAppt(result , req , callback){
    Appointment.findOne({_id: result.data.appointmentId},{payableAmount: 1,parlorId:1 , parlorName:1, parlorAddress:1,parlorAddress2:1, payableAmount:1, appointmentStartTime:1,'services.serviceName' :1 } , function(err , appt){
      Parlor.findOne({_id: appt.parlorId}, {geoLocation : 1} , function(err , parlorLocation){


          var captureData = {
              body : {
                  "userId": req.body.userId, 
                  "amount": "", 
                  "appointmentId": result.data.appointmentId, 
                  "razorpay_payment_id": "", 
                  "accessToken": req.body.accessToken, 
                  "paymentMethod": "1"
              }

          }
           Appointment.captureAppointment(captureData , function(ca){
              var d = appt.appointmentStartTime;
              var timeOfAppointment = (d.getHours() < 10 ? ('0' + d.getHours()) : d.getHours()) + ':' + (d.getMinutes() < 10 ? ('0' + d.getMinutes()) : d.getMinutes())
              var calculatedMonth = parseInt(d.getMonth()) + 1
              var dateOfAppointmnet = d.getDate() + "/" + calculatedMonth + "/" + d.getFullYear();
              var serviceName = appt.services[0].serviceName;
              if(ca){
                    var url = "http://www.google.com/maps/place/"+parlorLocation.geoLocation[1]+","+parlorLocation.geoLocation[0]+"";
                    var message = "Your appointment is successfully booked for "+serviceName+" at " + appt.parlorName + " on " + dateOfAppointmnet + " for " + timeOfAppointment + " and amount payable is INR " + appt.payableAmount + ". The salon location is "+appt.parlorAddress+" "+appt.parlorAddress2+", you will also receive a message shortly.";
                    var message2 = "The google map location is "+url+"";
                      callback( { 'message1' :{"text" : message} , 'message2' :{"text" : message2}});
                    }
           })
         })
    })
}

FacebookChatSchema.statics.getServicesForChat = function(req , senderId , call){
    console.log("getServicesForChat")
       FacebookChat.find({senderId : senderId},function(err , fbChat){

        _.forEach(fbChat , function(fb){

                if(fb.level == '3_1_1'){
                    req.body.services[0].brandId = "5935646e00868d2da81bb91c";
                    req.body.services[0].code = 98;
                    req.body.services[0].serviceCode = 98;
                    req.body.services[0].productId = "";
                    req.body.services[0].serviceId = "594a359f9856d3158171ea53";

                    call(req);

                } else if(fb.level == '3_1_2' || fb.level == '3_1_5'){
                    req.body.services[0].brandId = "5935646e00868d2da81bb91c";
                    req.body.services[0].code = 96;
                    req.body.services[0].serviceCode = 96;
                    req.body.services[0].productId = "";
                    req.body.services[0].serviceId = "594a359f9856d3158171ea51";

                    call(req);

                } else if(fb.level == '3_1_3'|| fb.level == '3_1_4'){
                    req.body.services[0].brandId = "";
                    req.body.services[0].code = 92;
                    req.body.services[0].serviceCode = 92;
                    req.body.services[0].productId = "";
                    req.body.services[0].serviceId = "594a359f9856d3158171ea72";

                    call(req);

                } else if(fb.level == '3_1_6'){
                    req.body.services[0].brandId = "5935646e00868d2da81bb91c";
                    req.body.services[0].code = 91;
                    req.body.services[0].serviceCode = 91;
                    req.body.services[0].productId = "";
                    req.body.services[0].serviceId = "58707eda0901cc46c44af339";

                    call(req);

                } else if(fb.level == '3_2_1'){
                    req.body.services[0].brandId = "";
                    req.body.services[0].code = 52;
                    req.body.services[0].serviceCode = 52;
                    req.body.services[0].productId = "";
                    req.body.services[0].serviceId = "594a359f9856d3158171ea6f";

                    call(req);

                } else if(fb.level == '3_2_2'){
                    req.body.services[0].brandId = "";
                    req.body.services[0].code = 121;
                    req.body.services[0].serviceCode = 121;
                    req.body.services[0].productId = "";
                    req.body.services[0].serviceId = "594a359f9856d3158171ea7f";

                    call(req);

                } else if(fb.level == '3_2_3'){
                    req.body.services[0].brandId = "594ccab23c61904155d4852a";
                    req.body.services[0].code = 553;
                    req.body.services[0].serviceCode = 553;
                    req.body.services[0].productId = "";
                    req.body.services[0].serviceId = "5b2221941d4f7f094bbdc5f5";

                    call(req);

                }

            })
        })
};



FacebookChatSchema.statics.getLocality = function(senderId , locality , callback){
    console.log("city")
    FacebookChat.findOne({senderId : senderId , city : {$exists: true}}).sort({$natural:-1}).exec(function(err , city){
        if(city){
            FacebookChat.findOne({senderId : senderId , locality : {$exists: true}}).sort({$natural:-1}).exec(function(err , local){
                if(local){
                    FacebookChat.update({_id : local.id} , { locality : locality}, function(err , created){
                        FacebookChat.getLatLong(senderId , city.city , function(d){
                            callback(d);
                        })
                    })
                }else {
                    FacebookChat.create({level : "6_1", senderId : senderId , locality : locality , gender : city.gender}, function(err , created){
                        FacebookChat.getLatLong(senderId , city.city , function(d){
                            callback(d);
                        })
                    })
                }
            })
        } else {
            callback({
            //     "attachment":{
            //   "type":"template",
            //   "payload":{
            //     "template_type":"button",
            //     "text":"What do you want to do next?",
            //     "buttons":[
            //       {
            //           "type": "postback",
            //           "title": "Appointment",
            //           "payload": "1_1"
            //         },
            //         {
            //           "type": "postback",
            //           "title": "Query",
            //           "payload": "1_2"
            //         }
            //     ]
            //   }
            // }
          })
        }
    })
}


FacebookChatSchema.statics.getLatLong = function(senderId , city , callback){
    
    FacebookChat.findOne({senderId : senderId , locality : {$exists: true}}).sort({$natural:-1}).exec(function(err , locality){
        var gender = locality.gender;
        var locality  = locality.locality.replace(" ", "+");
            var url = "https://maps.googleapis.com/maps/api/geocode/json?address="+locality+"+"+city+"&sensor=false&key=AIzaSyDvS7vSQ3GyiwLAOaXooTUWJKwBoxrMK6A",
                response;
            request({
                url: url,
                json: true
            }, function(error, response, body) {
                console.log(error);
                // console.log(response)
                if (!error && response.statusCode === 200) {
                    var geoLocation = response.body.results[0].geometry.location;
                    FacebookChat.findOne({level : "6_1" , latitude : {$exists : true}} , function(err, exists){
                        if(exists){
                            FacebookChat.update({_id: exists.id}, { latitude : geoLocation.lat , longitude : geoLocation.lng}, function( err , updated){
                                FacebookChat.findOne({_id: exists.id} , function(err , geo){
                                    
                                    FacebookChat.getParlors(geo , locality ,function(response){
                                        callback(response);
                                    })
                                })
                            })
                        }else{
                            FacebookChat.create({senderId : senderId , gender : gender , latitude : geoLocation.lat , longitude : geoLocation.lng , level : "6_1"}, function( err , geo){
                                FacebookChat.getParlors(geo , locality , function(response){
                                    callback(response);
                                })
                            })
                        }
                    })
                    
                }
        })
    })
            
}



FacebookChatSchema.statics.getParlors = function(geo, locality , call){
    console.log("getParlors")
    var data = {
                "latitude":geo.latitude,
                "longitude":geo.longitude,
                "page":0,
                "selectedDeals":[
                    {
                        "dealId":0,
                        "quantity":1,
                        "services":[
                            {
                                "serviceCode":0
                            }
                        ]
                    }
                ]
            }
    FacebookChat.getObjectForDeals(geo.senderId , data , function(dealData){

        request.post(
            // 'http://localhost:3000/api/newDealsDetail',
            'https://www.beusalons.com/api/newDealsDetail',
            { json: dealData },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
 
                    createReponseObj(response.body.data.parlors.slice(0,4), locality , function(parlorObj){
                        call(parlorObj)
                    })
                }
            }
        );
    })

};


function createReponseObj(parlors , locality , cb){
    var obj = {
            "attachment":{
                        "type":"template",
                        "payload":{
                                "template_type":"generic",
                                "elements":[]
                        }
            }
        };
    _.forEach(parlors ,function(parl){
        var singleElement = {
                    "title":parl.name+ " "+parl.distance+"km from "+locality,
                    "image_url":parl.images[0].appImageUrl,
                    "subtitle":"Service Total: Rs "+parl.dealPrice,
                    // "default_action": {
                    //   "type": "web_url",
                    //   "url": "https://petersfancybrownhats.com/view?item=103",
                    //   "webview_height_ratio": "tall",
                    // },
                    "buttons":[
                     {
                        "type":"postback",
                        "title":"Book Appointment",
                        "payload": "7_1-"+parl.dayClosed+"-"+parl.parlorId
                      }              
                    ]      
                  }
            obj.attachment.payload.elements.push(singleElement)
    })
    console.log(obj)
    cb(obj);
}


FacebookChatSchema.statics.getObjectForDeals = function(senderId , data , call){
    console.log("getObjectForDeals" , senderId)
       FacebookChat.find({senderId : senderId},function(err , fbChat){
        console.log("nikita",fbChat.length)
        _.forEach(fbChat , function(fb){
                if(fb.level == '3_1_1'){
                    data.selectedDeals[0].dealId = 4;
                    data.selectedDeals[0].services[0].brandId = "5935646e00868d2da81bb91c";
                    data.selectedDeals[0].services[0].serviceCode = 98;

                    call(data);

                } else if(fb.level == '3_1_2' || fb.level == '3_1_5'){
                    data.selectedDeals[0].dealId = 3;
                    data.selectedDeals[0].services[0].brandId = "5935646e00868d2da81bb91c";
                    data.selectedDeals[0].services[0].serviceCode = 96;

                    call(data);

                } else if(fb.level == '3_1_3' || fb.level == '3_1_4'){
                    data.selectedDeals[0].dealId = 2;
                    data.selectedDeals[0].services[0].serviceCode = 92;

                    call(data);

                } else if(fb.level == '3_1_6'){
                    data.selectedDeals[0].dealId = 1;
                    data.selectedDeals[0].services[0].brandId = "5935646e00868d2da81bb91c";
                    data.selectedDeals[0].services[0].serviceCode = 91;

                    call(data);

                } else if(fb.level == '3_2_1'){
                    data.selectedDeals[0].dealId = 37;
                    data.selectedDeals[0].services[0].serviceCode = 52;

                    call(data);

                } else if(fb.level == '3_2_2'){
                    data.selectedDeals[0].dealId = 69;
                    data.selectedDeals[0].services[0].serviceCode = 121;

                    call(data);

                } 
            })
        })
};


function callSendAPI(sender_psid, response) {
    console.log("callSendAPI")
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }
  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": "EAAEumq6snoUBAFGOou0XmFpd55YzUtXebZCkZCnl2ZC0MWK2CTPC1JQebrNLA1eE07LBWb9bBFZC1O2i0PcqSjWYZAF3wP9l4734qtOJTgbKSzuPLWUlM6ZCQtLk6Op2qzZCoqy3z6kQEd7PRKvaXmgt9Wu8ZC7GBI1kuaZC2IS0VgQZDZD" },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  });
};


FacebookChatSchema.statics.typingApi = function(sender_psid, action) {

  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "sender_action": action
  }
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": "EAAEumq6snoUBAFGOou0XmFpd55YzUtXebZCkZCnl2ZC0MWK2CTPC1JQebrNLA1eE07LBWb9bBFZC1O2i0PcqSjWYZAF3wP9l4734qtOJTgbKSzuPLWUlM6ZCQtLk6Op2qzZCoqy3z6kQEd7PRKvaXmgt9Wu8ZC7GBI1kuaZC2IS0VgQZDZD" },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log(action)
    } else {
      console.error("Unable to send message:" + err);
    }
  });
};


FacebookChatSchema.pre('save', function(next) {
    var currentDate = new Date();
    this.updatedAt = currentDate;
    if (!this.createdAt)
        this.createdAt = currentDate;
    next();
});

var FacebookChat = mongoose.model('facebookchat', FacebookChatSchema);
module.exports = FacebookChat;
