
/**
 * Created by nikita on 17/02/2018.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userquestionanswerSchema = new Schema({

    createdAt: { type : 'date' },

    updatedAt: { type : 'date' },

    type : { type : 'string' }, // singleSelect ,  multiSelect

    questionCategory : { type : 'string'}, // Hair , Skin

    questionCategoryId : {type : 'number'}, //1- Hair , 2-Skin

    question : { type : 'string' , required:true},

    active: { type : 'boolean' , default : true},

    answers : { 

        type: [{
            
            answer: { type : 'string' }
        }], 

    }
    
})


userquestionanswerSchema.statics.createNewQuesObj = function(req){
     return{
        type : req.body.type,
        question:req.body.question,
        active : req.body.active,
        questionCategory : req.body.questionCategory,
        questionCategoryId : req.body.questionCategoryId,
        answers : _.map(req.body.answers , function(a){
            return {
                answer : a.answer
            }
        })
     }   
};

userquestionanswerSchema.statics.parseObj = function(obj ){
    return { 
        questionId : obj._id,
        type : obj.type,
        question : obj.question,
        questionCategory : obj.questionCategory,
        questionCategoryId : obj.questionCategoryId,
        answers : _.map(obj.answers , function(a){
            return {
                answer : a.answer,
                answerId : a._id 
            }
        })
    }
}


userquestionanswerSchema.pre('save', function(next) {

    var currentDate = new Date();

    this.updatedAt = currentDate;

    if (!this.createdAt)

        this.createdAt = currentDate;

    next();
});

userquestionanswerSchema.pre('update', function(next) {

  this.update({},{ $set: { updatedAt: new Date() } });

  next();

});

var UserQuestionAnswers = mongoose.model('userquestionanswer', userquestionanswerSchema);
module.exports = UserQuestionAnswers;
