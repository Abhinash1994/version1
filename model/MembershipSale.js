/**
 * Offer.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

  // grab the things we need
 var mongoose = require('mongoose');
 var Schema = mongoose.Schema;


 var membershipSaleSchema = new Schema({

    parlorId : { type: Schema.ObjectId, ref : 'parlor' },

    membershipId : { type: Schema.ObjectId, ref : 'Membership' },

    userId : { type: Schema.ObjectId, ref : 'user' },

    employees: {
        type: [
            {
                dist: { type: 'number', required: true },
                name: { type: 'string' },
                employeeId: { type: Schema.ObjectId },
            }
        ], defaultsTo: []
    },

    name : { type: 'string', required: true },

    menuDiscountString : { type: 'string'},

    dealDiscountString : { type: 'string'},

    credits : { type: 'number', defaultsTo: 0 },

    menuDiscount : { type: 'number', defaultsTo: 0 },

    dealDiscount : { type: 'number', defaultsTo: 0 },

    creditsLeft : {type : 'number', defaultsTo : 0},

    expiryDate : {type : 'date' },

    active : {type : 'boolean', default : true},

    price : { type: 'number', defaultsTo: 0, required : true },

    discountPercentage : { type: 'array', defaultsTo: [] },

    firstTimeRedeem:{type:'boolean',default:false},

    paymentMethods: {
        type: [
            {
                value: { type: 'number', required: true },
                name: { type: 'string' },
                amount: { type: 'number' },
            }
        ], defaultsTo: []
    },

    createdAt : { type: 'date' },

    updatedAt : { type: 'date' },

    taxIncluded : {type : 'boolean'},

    // settlementProcessed : { type : 'boolean' , default :false},

  });

  membershipSaleSchema.statics.parse =  function(d, parlorId){
          return {
              membershipSaleId : d.id,
              name : d.name,
              credits : d.credits,
              validFor : d.validFor,
              discount : d.discount,
              price : d.price,
              noOfCustomers : 0
          };
  };

  membershipSaleSchema.statics.parseForUser = function(m, gender){
    return {
        membershipSaleId : m.id,
        name : m.name,
        menuDiscountString : m.menuDiscountString,
        dealDiscountString : m.dealDiscountString,
        credits : m.credits,
        menuDiscount : m.menuDiscount,
        dealDiscount : m.dealDiscount,
        creditsLeft : m.creditsLeft,
        expiryDate : m.expiryDate,
        members : _.map(m.members, function(mem){
          return {
              name : mem.name,
              phoneNumber : mem.phoneNumber, 
              status : mem.status,
          }
        }),
        history : _.map(m.history, function(h){
            return {
                parlorName : h.parlorName,
                parlorAddress : h.parlorAddress,
                name : h.name,
                phoneNumber : h.phoneNumber,
                appointmentDate : h.createdAt,
                creditUsed : h.creditUsed,          
              }
        }),
        freeServices : _.map(m.freeServices, function(f){
            return {
                services : _.map(f.services, function(s){
                    return {
                      serviceId : s.serviceId,
                      gender : s.gender,
                      serviceCode : s.serviceCode,
                      name : s.name,
                    };
                    
                }),
                serviceId : f.services[0].serviceId,
                serviceCode : f.services[0].serviceCode,
                name : f.name,
                quantityAvailed : f.quantityAvailed,
                quantityRemaining : f.quantityRemaining,
            }
        }),
    };
  };

  membershipSaleSchema.statics.createObj = function(req, m){
      return {
        parlorId : req.session.parlorId,
        membershipId : req.body.membershipId,
        userId : req.body.userId,
        employees : _.map(req.body.employees, function(e){
          return{
            dist : e.dist,
            name : e.name,
            employeeId : e.userId,
          }
        }),
        name : m.name,
        credits : m.credits,
        validFor : HelperService.addMonthsToDate(m.validFor),
        discountPercentage : m.discountPercentage,
        price : m.price,
        paymentMethods : _.map(req.body.paymentMethod, function(p){
                return {
                    value : p.value,
                    amount : p.amount,
                    name : p.name
                };
              })
      };
  };

membershipSaleSchema.statics.membershipsSold = function (membership,callback) {
    var data={
        price:membership.price,
        credits:membership.credits,
        paymentMethods:membership.paymentMethods,
        date: (membership.createdAt).toDateString(),
        appointmentData :[]
    };
    // console.log('membership' ,membership)
      if(membership.history && membership.parlorId == "594a359d9856d3158171ea4f" && membership.history.length >0){
        console.log("membership.history" ,membership.history.length)
          var parlorId = membership.history[0].parlorId
      }else if(membership.parlorId == "594a359d9856d3158171ea4f" && membership.history.length == 0 ){
          var parlorId =  membership.parlorId
      }else{
           console.log("aaya3333333333333")
          var parlorId =  membership.parlorId
      }

 
      Parlor.findOne({_id : parlorId},{name:1 , address2:1}, function(err, parlor) {
          if(parlor) {
              data.parlorAddress = parlor.address2;
              data.parlorName = parlor.name;
          }
          User.findOne({_id : membership.userId} , {firstName : 1,phoneNumber:1 ,activeMembership:1}).exec(function(err,user) {
            if(user != null){
              Appointment.find({membershipId : membership.membershipId , status:3,"client.id" : membership.userId, createdAt :{$gte:HelperService.getDayStart(membership.createdAt)}}).exec(function (err,appoints) {
                  if(appoints.length>0) {
                    var len = appoints[appoints.length -1]
                    // console.log
                    // if(membership.history>0){
                      data.creditsLeft = membership.creditsLeft;
                    // }else{
                    //   data.creditsLeft = len.membersipCreditsLeft;
    
                    // }
                      _.forEach(appoints, function (appoint) {
                         // console.log(appoint)
                         var arr={};
                          data.clientName = appoint.client.name;
                          data.clientNo = appoint.client.phoneNumber;
                          
                          arr.servicesName = _.map(appoint.services , function(s){return s.name});
                          arr.appointmentDate = (appoint.appointmentStartTime).toDateString();
                          arr.appointmentparlor = appoint.parlorName;
                          arr.amountRedeemed = appoint.creditUsed;

                          data.appointmentData.push(arr)
                      });
                  }else{
                    console.log("user")
                      data.clientName = user.firstName;
                      data.clientNo = user.phoneNumber;
                  }
                  return callback(err, data);
              });
            }else{
               return callback(err, data);
            }
          })
      })
};


  //  on every save, add the date
  membershipSaleSchema.pre('save', function(next) {
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
// membershipSaleSchema.plugin(autoIncrement.plugin, 'MembershipSale');
  var MembershipSale = mongoose.model('MembershipSale', membershipSaleSchema);

  // make this available to our users in our Node applications
  module.exports = MembershipSale;
