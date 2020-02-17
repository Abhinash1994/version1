/**
 * Created by ginger on 15/12/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TrainingQuestionSchema = new Schema({

    createdAt : { type: 'date' },

    updatedAt : { type: 'date' },

    unitId : {type : 'number'},

    superCategoryId : { type: Schema.Types.ObjectId},

    subCategoryId : { type: Schema.Types.ObjectId},

    chapterId : { type: Schema.Types.ObjectId},

    question : {type : 'String'},

    options : [{
          option : {type : 'String'},
          isAnswer : {type : 'Boolean', default : false}
        }],

    answer : {type : 'number'}

});

TrainingQuestionSchema.statics.createQuestion = function(req, callback){

  var unitId = parseInt(req.body.unitId);
  var superCategoryId = req.body.superCategoryId;
  var subCategoryId = req.body.subCategoryId;
  var chapterId = req.body.chapterId;
  var question = req.body.question;
  var options = req.body.options;
  var answer = parseInt(req.body.answer);

  TrainingQuestion.create({
    unitId : parseInt(unitId),
    superCategoryId : superCategoryId,
    subCategoryId : subCategoryId,
    question : question,
    chapterId : chapterId,
    answer : parseInt(answer)
  }, function(err, created){
      if(err){
        return callback({success : false, data : "Server Error."});
      }else{

        TrainingQuestion.updateOne({"_id" : created._id}, {$push : {options : {$each : options}}}, function(err, updated){
          if(err){
            return callback({success : false, message : "Server Error."});
          }else{
            return callback({success : true, data : "Successfully Created"});
          }
        });

      }
  })

}

TrainingQuestionSchema.pre('save', function(next) {
    var currentDate = new Date();
    this.updatedAt = currentDate;
    if (!this.createdAt)
        this.createdAt = currentDate;
    next();
});

var TrainingQuestion = mongoose.model('trainingquestions', TrainingQuestionSchema);
module.exports = TrainingQuestion;
