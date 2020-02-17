/**
 * ServiceCategory.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
 // grab the things we need
 var mongoose = require('mongoose');
 var Schema = mongoose.Schema;



 var superCategorySchema = new Schema({

    name : { type: 'string' },

    sortOrder : { type: 'number' },

    maleImage : { type: 'string' },

    femaleImage : { type: 'string' },

    maleDescription : { type: 'string' },

    femaleDescription : { type: 'string' },

    createdAt : { type: 'date' },

    updatedAt : { type: 'date' },
  });

  superCategorySchema.statics.categories =  function(callback){
      SuperCategory.find().exec(function(err, categories){
          categories = _.map(categories, function(c){
              return SuperCategory.parse(c);
          });
          return callback(err, categories);
      });
  };

  superCategorySchema.statics.parse = function(categories){
      var data = [];
      _.forEach(categories, function(c){
          data.push({name : c.name, superCategoryId : c.id, sortOrder : c.sortOrder, maleImage : c.maleImage, femaleImage : c.femaleImage, maleDescription : c.maleDescription, femaleDescription : c.femaleDescription});
      });
      return data;
  };

  //  on every save, add the date
  superCategorySchema.pre('save', function(next) {
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
  var SuperCategory = mongoose.model('superCategory', superCategorySchema);

  // make this available to our users in our Node applications
  module.exports = SuperCategory;
