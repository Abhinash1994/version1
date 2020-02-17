/**
 * Offer.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

  // grab the things we need
 var mongoose = require('mongoose');
 var Schema = mongoose.Schema;


 var freebiesOfferSchema = new Schema({

    active : {type : 'boolean', default : true},

    loyalityPoints : { type: 'number', default : 0, },

    hundredPercentRedeemableLoyalityPoints : {type : 'number', default : 0},
    
    code : { type: 'string', unique : true},

    isDeleted : { type: 'number', default: 0, },

    createdAt : { type: 'date' },

    updatedAt : { type: 'date' },

    offPercentage :{type : 'number' ,default : 0},

    userId : {type : Schema.ObjectId},

  });


  //  on every save, add the date
  freebiesOfferSchema.pre('save', function(next) {
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
  var FreebiesOffer = mongoose.model('freebiesoffer', freebiesOfferSchema);

  // make this available to our users in our Node applications
  module.exports = FreebiesOffer;
