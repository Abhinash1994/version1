/**
 * ServiceCategory.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
 // grab the things we need
 var mongoose = require('mongoose');
 var Schema = mongoose.Schema;



 var serviceCategorySchema = new Schema({

    name : { type: 'string' },

    superCategory : { type: 'string' },

    sort : { type: 'number', default : 0  },

    isForReminder : { type: 'boolean', default : false  },

    recommendedDays : {type : 'number', default : 30},

    femaleImage : { type: 'string' , default : ''},

    maleImage : { type: 'string', default : '' },

    createdAt : { type: 'date' },

    updatedAt : { type: 'date' },

  });

  serviceCategorySchema.statics.categories =  function(callback){
      ServiceCategory.find().exec(function(err, categories){
          categories = _.map(categories, function(c){
              return ServiceCategory.parse(c);
          });
          return callback(err, categories);
      });
  };

  serviceCategorySchema.statics.parse = function(c){
      return {
          categoryId : c.id,
          name : c.name,
          sort : c.sort,
          femaleImage : c.femaleImage || '',
          maleImage : c.maleImage || '',
          superCategory : c.superCategory ? c.superCategory : "Unknown",
      };
  };

  //  on every save, add the date
  serviceCategorySchema.pre('save', function(next) {
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
  var ServiceCategory = mongoose.model('serviceCategory', serviceCategorySchema);

  // make this available to our users in our Node applications
  module.exports = ServiceCategory;
