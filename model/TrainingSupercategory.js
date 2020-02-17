var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var TrainingSupercategorySchema = new Schema({

    createdAt : { type: 'date' },

    updatedAt : { type: 'date' },

    unitId : {type : 'number'},

    superCategoryName : {type: 'String'},

    });

    TrainingSupercategorySchema.statics.createSupercategory = function(req, callback){
        TrainingSupercategory.create({
            unitId: req.body.unitId,
            superCategoryName: req.body.superCategoryName
        }, function(err, created){
            if(err){
              return callback(CreateObjService.response(false, 'Server Error.'));
            }else{
              return callback(CreateObjService.response(false, 'Created Successfully.'));
            }
        })
    }

    TrainingSupercategorySchema.statics.getSupercategory = function(req, callback){
        TrainingSupercategory.find({unitId: req.body.unitId}, {"superCategoryName" : 1}, function(err, data){
            if(err){
              return callback(CreateObjService.response(true, 'Server Error.'));
            }else{
              return callback(CreateObjService.response(false, data));
            }
        })
    }

    TrainingSupercategorySchema.pre('save', function(next) {
        var currentDate = new Date();
        this.updatedAt = currentDate;
        if (!this.createdAt)
            this.createdAt = currentDate;
        next();
    });

  var TrainingSupercategory = mongoose.model('trainingsupercategory', TrainingSupercategorySchema);
  module.exports = TrainingSupercategory;
