/**
 * Created by ginger on 15/12/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TrainingQuizSchema = new Schema({

    createdAt : { type: 'date' },

    updatedAt : { type: 'date' },

    employeeId : { type: Schema.Types.ObjectId},

    sessionId : { type: Schema.Types.ObjectId},

    quiz : [{
      questionId : { type: Schema.Types.ObjectId},
      answer : {type : 'number'}
    }]

});

TrainingQuizSchema.statics.submitQuiz = function(req, callback){

  var employeeId = req.body.employeeId;
  var sessionId = req.body.sessionId;
  var quiz = req.body.quiz;
  TrainingQuiz.create({
    employeeId : employeeId,
    sessionId : sessionId
  }, function(err, created){
      if(err){
        return callback({success : false, data : "Server Error."});
      }else{

        TrainingQuiz.updateOne({"_id" : created._id}, {$push : {quiz : {$each : quiz}}}, function(err, updated){
          if(err){
            return callback({success : false, data : "Server Error."});
          }else{
            return callback({success : true, data : "Successfully Submitted"});
          }
        });

      }
  })

}

TrainingQuizSchema.pre('save', function(next) {
    var currentDate = new Date();
    this.updatedAt = currentDate;
    if (!this.createdAt)
        this.createdAt = currentDate;
    next();
});

var TrainingQuiz = mongoose.model('trainingquiz', TrainingQuizSchema);
module.exports = TrainingQuiz;
