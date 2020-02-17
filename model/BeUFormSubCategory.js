
 var mongoose = require('mongoose');
 var Schema = mongoose.Schema;
 var ObjectId = mongoose.Types.ObjectId;

 var beuformSubcategorySchema = new Schema({

    name : { type: 'string' }, // Employee , Owner , Manager ,  Salon 

    createdAt : { type: 'date' },

    updatedAt : { type: 'date' }, 

    categoryId : { type: Schema.Types.ObjectId, ref: 'BeUFormCategory' }

  });


  beuformSubcategorySchema.statics.createBeuFormSubCategories = function(req , item) {
    console.log(req.body)
    return {
        name : req.body.subCategoryName,
        categoryId : req.body.categoryId
    }

};

  //  on every save, add the date
  beuformSubcategorySchema.pre('save', function(next) {
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
  var BeUFormSubCategory = mongoose.model('beuformsubcategory', beuformSubcategorySchema);

  // make this available to our users in our Node applications
  module.exports = BeUFormSubCategory;
