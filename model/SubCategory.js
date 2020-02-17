/**
 * Created by Nikita on 6/8/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var subCategorySchema = new Schema({

    name : {type: 'string'},

    sortOrder : {type: 'number',  default : 0 },

    categoryId : { type: Schema.Types.ObjectId, ref: 'ServiceCategory' },

    createdAt : { type: 'date', default: Date.now() },


});

subCategorySchema.statics.newSubCategory = function(req){
    return {
        name : req.body.name,
        sortOrder : req.body.sortOrder,
        categoryId : req.body.categoryId 
    }

};


  subCategorySchema.statics.subCategoryByCategoryId = function(categoryId, callback){
      SubCategory.find({categoryId : categoryId}).exec(function(err, subCategory){
          subCat = _.map(subCategory, function(s){
              return SubCategory.parse(s);
          });
          return callback(err, subCat);
      });
  };

  subCategorySchema.statics.parse = function(s){
      return {
          categoryId:s.categoryId,
          name : s.name,
          sortOrder : s.sortOrder,
         
      };
  };

//  on every save, add the date
subCategorySchema.pre('save', function(next) {
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

var SubCategory = mongoose.model('subcategory', subCategorySchema);


module.exports = SubCategory;