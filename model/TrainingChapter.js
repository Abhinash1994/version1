var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;
var TrainingChapterSchema = new Schema({

    createdAt : { type: 'date' },

    updatedAt : { type: 'date' },

    subCategoryId : {type: Schema.Types.ObjectId},

    chapterName : { type: 'string' },

    duration : {type : 'string'},

    theory : { type: 'Boolean', default: false },

    practical : { type: 'Boolean', default: false },

    sessionTime : { type: 'number', default: 0 },

    });

    TrainingChapterSchema.statics.createChapter = function(req, callback){
        TrainingChapter.create({

            subCategoryId: req.body.subCategoryId,

            chapterName : req.body.chapterName,

            duration : req.body.duration,

            theory : req.body.theory,

            practical : req.body.practical,
            sessionTime : req.body.sessionTime,

        }, function(err, created){
            if(err){
              return callback(CreateObjService.response(false, 'Server Error.'));
            }else{
              return callback(CreateObjService.response(false, 'Created Successfully.'));
            }
        })
    }

    TrainingChapterSchema.statics.getChapter = function(req, callback){
        TrainingChapter.find({subCategoryId: req.body.subCategoryId},{"chapterName": 1,"duration": 1,"practical": 1,"theory": 1}, function(err, data){
            if(err){
              return callback(CreateObjService.response(false, 'Server Error.'));
            }else{
              return callback(CreateObjService.response(false, data));
            }
        })
    }

    TrainingChapterSchema.pre('save', function(next) {
        var currentDate = new Date();
        this.updatedAt = currentDate;
        if (!this.createdAt)
            this.createdAt = currentDate;
        next();
    });

  var TrainingChapter = mongoose.model('trainingchapter', TrainingChapterSchema);
  module.exports = TrainingChapter;
