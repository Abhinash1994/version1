/**
 * Created by Nikita on 7/29/2017.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;


var submitbeuFormSchema = new Schema({

    createdAt: { type: 'date' },

    updatedAt: { type : 'date' },

    questionsData : { type  : []},

    opsId : {type : Schema.ObjectId},

    parlorId : {type : Schema.ObjectId},

    oneMonth : { type: 'Boolean'},
    // showOnApp : {type : 'boolean', default : true} ,

});

submitbeuFormSchema.statics.submitNewFormObj =  function(bodyData, item){
    return {
        questionsData : bodyData.data,
        opsId : bodyData.opsId,
        parlorId : bodyData.parlorId,
        oneMonth : bodyData.oneMonth
    }
};

submitbeuFormSchema.statics.createCheckInForm =  function(parlorId, userId, cb){
     var data = [];
    BeUFormQuestions.aggregate([{
            $match: {
                showOnApp: true,
                // role :4
            }
        },
        {
            $unwind: "$categories"
        },
        {
            $group: {
                _id: "$categories.formCategoryId",
                categoryId: { $first: "$categories.formCategoryId" },
                categoryName: { $first: "$categories.categoryName" },
                subCategoryName: { $first: "$categories.subCategoryName" },
                formSubCategoryId: { $first: "$categories.formSubCategoryId" },
                questions: {
                    $push: {
                        questionId: "$_id",
                        formType: "$formType",
                        question: "$question",
                        options: "$options",
                        minRange: "$minRange",
                        maxRange: "$maxRange"
                    }
                }
            }
        }, { $sort: { sortOrder: 1 } }
    ]).exec(function(err, forms) {
        Admin.find({ parlorId: parlorId, active: true /*role:{$in:[4]} */ }, function(err, employee) {
            _.forEach(forms, function(form) {
                if (form.subCategoryName) {
                    // console.log("------------------------")
                    var arr = {}
                    arr.categoryName = form.categoryName,
                        arr.categoryId = form.categoryId,
                        arr.subCategoryName = form.subCategoryName,
                        arr.formSubCategoryId = form.formSubCategoryId,
                        arr.subCategoryData = _.map(employee, function(emp) {
                            return {
                                subCategoryId: emp._id,
                                name: (emp.firstName).toUpperCase(),
                                questions: form.questions
                            }
                        })

                    data.push(arr)

                } else if (!form.subCategoryName) {
                    data.push(form)
                }

            })

            
                SubmitBeuForm.create(SubmitBeuForm.submitNewFormObj({ data: data, opsId: userId, parlorId: parlorId, oneMonth: false }), function(err, submitForm) {
                    if (err) {
                        cb("Something went wrong in fetching form id.", null);
                    } else {
                        cb(null, { formId: submitForm._id, formStatus: "0" });
                    }
                })
            

        })
    })
};

// on every save, add the date
submitbeuFormSchema.pre('save', function(next) {
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

var SubmitBeuForm = mongoose.model('submitbeuform', submitbeuFormSchema);
// make this available to our users in our Node applications

module.exports = SubmitBeuForm;
