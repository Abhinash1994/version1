/**
 * Created by ginger on 11/20/2017.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var facebookQuerySchema = new Schema({
    createdAt : { type: 'date' },
    updatedAt : { type: 'date' },
    name : {type : 'String'},
    phoneNumber : {type : 'String', unique : true},
    city : {type : 'String', default : ""},
    email : {type : 'String'},
    paymentLinkUrl : {type : 'String'},
    queryText : {type : 'String'},
    appointmentDate : {type : 'date'},
    appointmentBookedDate : {type : 'date'},
    subscriptionSoldTime : {type : 'date'},
    appointmentId : {type : Schema.ObjectId},
    followUpTime : {type : 'date'},
    subscriptionTeam : {},
    statusUpdateHistory : {},
    appointmentTeam : {}, // allotDate, customerCareName, customerCareId 
    agentResponse : {type : 'String'},
    comments : {type : []},
    queryType : {type : 'number', default : 0}, //0 for website query 1 for subscription query entered by our customer care
    isConverted : {type: 'Boolean', default : false},
    status : {type : 'number', default : 1}, //default 1- not callled 10-closed 5, 3, 6 = Subscription to be sold
    statusString : {type : 'string', default : ""},
    value : {},
    detail : {},
    source : {type: 'String', default : ''}, // facebook, self
    customerCareName : {type : 'string'},
    customerCareId : { type: Schema.ObjectId }

});


facebookQuerySchema.statics.updateConversionsAppointment = function(req, cb) {
    FacebookQuery.find({"appointmentTeam.eligible" : {$ne : true}, $and : [{"appointmentTeam.customerCareId" : {$exists : true}}], status : 3, phoneNumber : {$ne :null}}, function(er, fQueries){
        Async.forEach(fQueries, function(f, callback){
                User.findOne({phoneNumber : f.phoneNumber.slice(-10)}, {firstName : 1}, function(err, user){
                    let saleTime = _.filter(f.statusUpdateHistory, function(h){ return h.status == 3})[0]
                    if(saleTime && user){
                        // saleTime = saleTime.createdAt
                        saleTime = f.appointmentBookedDate
                        Appointment.findOne({_id : f.appointmentId, createdAt : {$lt : new Date(saleTime)}}, function(err, s){
                            f.appointmentTeam.isVerified = true
                            f.appointmentTeam.verifiedTime = new Date()
                            if(s){
                                if(s.status == 3){
                                    f.appointmentTeam.eligible = true
                                    f.appointmentTeam.sharedButNoAppointment = false

                                }else{
                                    f.appointmentTeam.eligible = false
                                    f.appointmentTeam.sharedButNoAppointment = true
                                }
                            }else{
                                f.appointmentTeam.eligible = false
                                f.appointmentTeam.sharedButNoAppointment = true
                            }
                            FacebookQuery.update({_id : f.id}, {appointmentTeam : f.appointmentTeam}, function(er, f){
                                console.log('done')
                                callback()
                            })
                        })   
                    }else{
                        callback()
                    }
                })
            }, function allTask(){
                cb('done')
        })
    })
}

facebookQuerySchema.statics.updateConversionsSubscription = function(req, cb) {
    FacebookQuery.find({"subscriptionTeam.eligible" : {$ne : true}, $and : [{"subscriptionTeam.customerCareId" : {$exists : true}}],  status : 6}, function(er, fQueries){
        Async.forEach(fQueries, function(f, callback){
                User.findOne({phoneNumber : f.phoneNumber.slice(-10)}, {firstName : 1}, function(err, user){
                    let saleTime = _.filter(f.statusUpdateHistory, function(h){ return h.status == 6})[0]
                    if(saleTime){
                        saleTime = saleTime.createdAt
                        if(user){
                             SubscriptionSale.findOne({userId : user.id}).sort({$natural : -1}).exec( function(err, s){
                                f.subscriptionTeam.isVerified = true
                                f.subscriptionTeam.verifiedTime = new Date()
                                if(s){
                                    if(s.createdAt.getTime() > new Date(saleTime).getTime()){
                                        f.subscriptionTeam.eligible = true
                                        f.subscriptionTeam.sharedButNoSubscription = false
                                    }else{
                                        f.subscriptionTeam.eligible = false
                                        f.subscriptionTeam.sharedButNoSubscription = false
                                    }
                                }else{
                                    f.subscriptionTeam.eligible = false
                                    f.subscriptionTeam.sharedButNoSubscription = true
                                }
                                FacebookQuery.update({_id : f.id}, {subscriptionTeam : f.subscriptionTeam}, function(er, f){
                                    console.log('done')
                                    callback()
                                })
                            })
                         }else{
                            f.subscriptionTeam.isVerified = true
                            f.subscriptionTeam.verifiedTime = new Date()
                            FacebookQuery.update({_id : f.id}, {subscriptionTeam : f.subscriptionTeam}, function(er, f){
                                console.log('done')
                                callback()
                            })
                         }
                    }else{
                        callback('invalid')
                    }
                })
            }, function allTask(){
                cb('done')
        })
    })
}

facebookQuerySchema.pre('save', function(next) {
    var currentDate = new Date();
    this.updatedAt = currentDate;
    if (!this.createdAt)
        this.createdAt = currentDate;
    next();
});

facebookQuerySchema.pre('update', function(next) {
  this.update({},{ $set: { updatedAt: new Date() } });
  next();
});

var FacebookQuery = mongoose.model('facebookquery', facebookQuerySchema);
module.exports = FacebookQuery;




