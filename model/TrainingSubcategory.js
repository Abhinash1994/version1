var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var TrainingSubcategorySchema = new Schema({

    createdAt : { type: 'date' },

    updatedAt : { type: 'date' },

    unitId : {type : 'number'},

    superCategoryId : {type: Schema.Types.ObjectId},

    subCategoryName : {type: 'String'},

    });

    TrainingSubcategorySchema.statics.createSubcategory = function(req, callback){
        TrainingSubcategory.create({
            superCategoryId: req.body.superCategoryId,
            subCategoryName: req.body.subCategoryName
        }, function(err, created){
            if(err){
              return callback(CreateObjService.response(false, 'Server Error.'));
            }else{
              return callback(CreateObjService.response(false, 'Created Successfully.'));
            }
        })
    }

    TrainingSubcategorySchema.statics.getSubcategory = function(req, callback){
        TrainingSubcategory.find({superCategoryId: req.body.superCategoryId}, {"subCategoryName" : 1}, function(err, data){
            if(err){
              return callback(CreateObjService.response(true, 'Server Error.'));
            }else{
              return callback(CreateObjService.response(false, data));
            }
        })
    }

    TrainingSubcategorySchema.pre('save', function(next) {
        var currentDate = new Date();
        this.updatedAt = currentDate;
        if (!this.createdAt)
            this.createdAt = currentDate;
        next();
    });

  var TrainingSubcategory = mongoose.model('trainingsubcategory', TrainingSubcategorySchema);
  module.exports = TrainingSubcategory;
