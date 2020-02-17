/**
 * Created by ginger on 11/16/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TrainingSessionSchema = new Schema({

    unitId : {type : 'number'},

    superCategoryId : { type: Schema.Types.ObjectId},

    subCategoryId : { type: Schema.Types.ObjectId},

    chapterId : { type: Schema.Types.ObjectId},

    trainerId : { type: Schema.Types.ObjectId},

    parlorId : { type: Schema.Types.ObjectId},

    superCategoryName : { type: 'string'},

    subCategoryName : { type: 'string'},

    chapterName : { type: 'string'},

    trainerName : { type: 'string'},

    parlorName : { type: 'string'},

    theory : { type: 'Boolean', default : false},

    practical : { type: 'Boolean', default : false},

    createdAt : { type: 'date' },
  
    trainingDate : { type: 'date' },

    updatedAt : { type: 'date' },

    month: { type: 'number'},

    year: { type: 'number'},

    employees : [{
      employeeId : { type: Schema.Types.ObjectId},
      rating : {type : 'number'}
    }]

});

TrainingSessionSchema.statics.submitTrainingSession = function(req, callback){

  var unitId = parseInt(req.body.unitId);
  var superCategoryId = req.body.superCategoryId;
  var subCategoryId = req.body.subCategoryId;
  var chapterId = req.body.chapterId;
  var trainerId = req.body.trainerId;
  var parlorId = req.body.parlorId;
  var theory = req.body.theory;
  var practical = req.body.practical;
  var employees = req.body.employees;
  var trainingDate = req.body.date ? req.body.date : new Date();
  var month = req.body.month;
  var year = req.body.year;
  var superCategoryName = req.body.superCategoryName;
  var subCategoryName = req.body.subCategoryName;
  var chapterName = req.body.chapterName;
  var trainerName = req.body.trainerName;
  var parlorName = req.body.parlorName;

  if(theory == false && practical == false){
      return callback({success : false, data : "Please check theory or practical or both."});
  }else if(employees.length == 0){
      return callback({success : false, data : "Please select employees."});
 }else{
   TrainingSession.create({
       unitId : unitId,
       superCategoryId : superCategoryId,
       subCategoryId : subCategoryId,
       chapterId : chapterId,
       trainerId  : trainerId,
       parlorId : parlorId,
       superCategoryName : superCategoryName,
       subCategoryName : subCategoryName,
       chapterName : chapterName,
       trainerName : trainerName,
       parlorName : parlorName,
       theory : theory,
       practical : practical,
       trainingDate:trainingDate,
       employees : employees,
       month : month,
       year : year
   }, function(err, created){
     if(err){
       return callback({success : false, data : "Server Error."});
     }else{
       return callback({success : true, data : "Successfully submitted."});
     }
   })
 }

}

TrainingSessionSchema.pre('save', function(next) {
    var currentDate = new Date();
    this.updatedAt = currentDate;
    if (!this.createdAt)
        this.createdAt = currentDate;
    next();
});

var TrainingSession = mongoose.model('trainingsession', TrainingSessionSchema);
module.exports = TrainingSession;
