
 var mongoose = require('mongoose');
 var Schema = mongoose.Schema;
 var ObjectId = mongoose.Types.ObjectId;

 var beuformcategorySchema = new Schema({

    name : { type: 'string' }, // Employee , Owner , Manager ,  Salon 

    createdAt : { type: 'date' },

    updatedAt : { type: 'date' },

    sortOrder :{ type: 'number'},

  });


  beuformcategorySchema.statics.createBeuFormCategories = function(req , item) {
    console.log(req.body)
    return {
        name      : req.body.categoryName,
        sortOrder : req.body.sortOrder

    }

};

  //  on every save, add the date
  beuformcategorySchema.pre('save', function(next) {
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
  var BeUFormCategory = mongoose.model('beuformcategory', beuformcategorySchema);

  // make this available to our users in our Node applications
  module.exports = BeUFormCategory;
