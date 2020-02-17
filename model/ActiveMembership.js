/**
 * Offer.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

  // grab the things we need
 var mongoose = require('mongoose');
 var Schema = mongoose.Schema;


 var activeMembershipSchema = new Schema({

    parlorId : { type: Schema.ObjectId, ref : 'parlor' },

    membershipId : { type: Schema.ObjectId, ref : 'Membership' },

    userId : { type: Schema.ObjectId, ref : 'user' },

    name : { type: 'string', required: true },

    menuDiscountString : { type: 'string'},

    dealDiscountString : { type: 'string'},

    noOfMembersAllowed  : {type : 'number'},

    freeHairCut : {type : 'number'},

    freeThreading : {type : 'number'},

    credits : { type: 'number', defaultsTo: 0 },

    menuDiscount : { type: 'number', defaultsTo: 0 },

    dealDiscount : { type: 'number', defaultsTo: 0 },

    creditsLeft : {type : 'number', defaultsTo : 0},

    expiryDate : {type : 'date' },

    members : {
      type : [
          {
              userId : {type : Schema.ObjectId, },
              name : { type : 'string'},
              phoneNumber : {type : 'string'},
              createdAt : {type : 'date'},
              status : {type : 'string'},
          }

      ], defaultsTo : []
    },

    history : {
      type : [
          {
              userId : {type : Schema.ObjectId, },
              appointmentId : {type : Schema.ObjectId, },
              parlorId:{type : Schema.ObjectId, },
              parlorName : {type : 'string'},
              parlorAddress : {type : 'string'},
              name : { type : 'string'},
              phoneNumber : {type : 'string'},
              createdAt : {type : 'date'},
              appointmentDate : {type : 'date'},
              creditUsed : {type : 'string'},
          }

      ], defaultsTo : []
    },

    active : {type : 'boolean', default : true},

    price : { type: 'number', defaultsTo: 0, required : true },

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

    updatedAt : { type: 'date' }
  });


  activeMembershipSchema.statics.parseForUser = function(m, gender, serviceAvailed){
    var data = {
        membershipSaleId : m.id,
        // name : m.name,
        name : ConstantService.getFamilyWalletString(),
        // menuDiscountString : m.menuDiscountString,
        menuDiscountString : "",
        // dealDiscountString : m.dealDiscountString,
        dealDiscountString : "",
        credits : parseInt(m.credits),
        menuDiscount : m.menuDiscount,
        dealDiscount : m.dealDiscount,
        creditsLeft : parseInt(m.creditsLeft),
        expiryDate : m.expiryDate,
        noOfMembersAllowed : m.noOfMembersAllowed,
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
                creditUsed : parseInt(h.creditUsed),          
              }
        }),
        freeServices : [ConstantService.getThreadingServiceDetail(m.freeThreading)],
    };
    if(!serviceAvailed){
        data.freeServices.push(ConstantService.getFreeHairWaxServiceDetail(gender));
    }
    return data;
  };




  //  on every save, add the date
  activeMembershipSchema.pre('save', function(next) {
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
// activeMembershipSchema.plugin(autoIncrement.plugin, 'MembershipSale');
  var ActiveMembership = mongoose.model('ActiveMembership', activeMembershipSchema);

  // make this available to our users in our Node applications
  module.exports = ActiveMembership;
