/**
 * Service.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

   // grab the things we need
  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;



  var serviceBrandSchema = new Schema({

    name : { type: 'string', required : true, unique : true },

    createdAt : { type: 'date' },

    updatedAt : { type: 'date' },

});

  //  on every save, add the date
  serviceBrandSchema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();
    // change the updated_at field to current date
    this.updatedAt = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.createdAt)
      this.createdAt = currentDate;

    next();
  });
  var ServiceBrand = mongoose.model('ServiceBrand', serviceBrandSchema);

  // make this available to our users in our Node applications
  module.exports = ServiceBrand;
