/**
 * Created by Nikita on 7/27/2017.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;


var beuFormQuestionsSchema = new Schema({

    createdAt: { type: 'date' },

    updatedAt: { type: 'date' },
        
    formType: {type : 'string'}, //text- Text , checkBox - multi-select , Radio - single-select , range - range ,  dropDown - dropdown

    question : {type : 'string'} , 

    minRange : {type: 'number'},

    maxRange : {type :  'number'},

    options :{

        type:[{

            option : {type:'string'}

        }] , defaultsTo :[]

    },

    categories: {

        type:[{

            formCategoryId : { type: Schema.Types.ObjectId, ref: 'BeUFormCategory' },

            formSubCategoryId : { type: Schema.Types.ObjectId, ref: 'BeUFormSubCategory' },    

            categoryName : {type: 'string'},

            subCategoryName :{type:'string'}

            }

        ]}, 


    // roles :  { type : [ { role : 'number' } ] },  //3 - operation, 4 - sales, 6 - trainner,  9 - cashier,

    roles :[],

    sortOrder :{type:'number'},

    showOnApp : {type : 'boolean', default : true}  ,

    selectedValue : {type : 'string' , default : ""}

});

beuFormQuestionsSchema.statics.createBeuFormObj =  function(req, callback){

   var data= {
        formType : req.body.formType,
        question : req.body.question,
        minRange : req.body.minRange,
        maxRange : req.body.maxRange,
        showOnApp: req.body.showOnApp,
        sortOrder: req.body.sortOrder,
        roles :  [],
        options : _.map(req.body.options , function(opt){
            return {
                option : opt.option
            }
        }),
        categories : _.map(req.body.categories , function(cate){
            return {
               formCategoryId : cate.formCategoryId,
               formSubCategoryId : cate.formSubCategoryId,
               categoryName : cate.categoryName,
               subCategoryName:cate.subCategoryName 
            }
        })
    }


BeUFormQuestions.create(data, function (err,opsForm) { 
    if(err){
        console.log("error aaya")
    }
    else{

        BeUFormQuestions.update({_id:opsForm.id},{$pushAll :{roles: req.body.role}},function(err,updates){
            if(err){
               callback(true , err);
            }else
              callback(false , updates);
        })
    }

    })
};

// on every save, add the date
beuFormQuestionsSchema.pre('save', function(next) {
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
// opsForm.plugin(autoIncrement.plugin, 'admin');

var BeUFormQuestions = mongoose.model('beuformquestions', beuFormQuestionsSchema);
// make this available to our users in our Node applications

module.exports = BeUFormQuestions;
