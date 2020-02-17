/**
 * Offer.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

  // grab the things we need
 var mongoose = require('mongoose');
 var Schema = mongoose.Schema;


 var offerSchema = new Schema({

    offerType : { type: 'string', required: true }, // fixed, percentage, groupon

    name : { type: 'string', required: true },

    code : { type: 'string', required: true, unique : true },  //code for normal, groupon - BEU

    discountAmount : { type: 'number', defaultsTo: 0 },

    dealId : { type: 'number',  defaultsTo : null},

    minAmountReq : { type: 'number', defaultsTo: 0 },

    offerMethod : { type: 'string' },

    active : {type : 'boolean', defaultsTo : true},

    services : { type: 'array', defaultsTo: [], },
    
    locations : { type: 'array', defaultsTo: [], },

    isDeleted : { type: 'number', defaultsTo: 0, },

    parlorType : {type : 'number', defaultsTo : 0},

    createdAt : { type: 'date' },

    startDate : { type: 'date' },
    
    endDate : { type: 'date' },

    validDays : { type: 'array', defaultsTo: [] },

    updatedAt : { type: 'date' },
  });

  offerSchema.statics.parse =  function(offer){
      return {
          offerId : offer.id,
          offerType : offer.offerType,
          name : offer.name,
          code : offer.code,
          discountAmount : offer.discountAmount,
          minAmountReq : offer.minAmountReq,
          offerMethod : offer.offerMethod,
          services : offer.services,
          locations : offer.locations,
          startDate : offer.startDate,
          endDate : offer.endDate,
          // validDays : offer.validDays,
          validDays : [0,1,2,3,4,5,6],
      };
  };

  offerSchema.statics.getOfferObj = function(req){
      return {
          offerType : req.body.offerType,
          name : req.body.name,
          code : req.body.code,
          discountAmount : req.body.discountAmount,
          minAmountReq : req.body.minAmountReq,
          offerMethod : req.body.offerMethod,
          services : req.body.services,
          locations : req.body.locations,
          startDate : req.body.startDate,
          endDate : req.body.endDate,
          validDays : req.body.validDays,
      }
  };


  //  on every save, add the date
  offerSchema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();
    this.role = parseInt(this.role);

    // change the updated_at field to current date
    this.updatedAt = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.createdAt)
      this.createdAt = currentDate;
    if (!this.isDeleted)
      this.isDeleted = 0;

    next();
  });
  var Offer = mongoose.model('offer', offerSchema);

  // make this available to our users in our Node applications
  module.exports = Offer;
