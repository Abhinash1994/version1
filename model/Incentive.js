/**
 * Created by Nikita on 2/18/2017.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;


var incentiveSchema = new Schema({

    // categoryId: { type: Schema.ObjectId ,required: true},

    createdAt: { type: 'date' },

    updatedAt: { type: 'date' },

    parlorName: {type: 'string' , required : true},

    parlorAddress: {type: 'string' , required : true},

    parlorActive: { type: 'boolean', default: true },

    // sort: {type: 'number', required :true},

    // name: {type: 'string' , required : true},

    // parlors:{
    //     type:[
    //         {
    //             // parlorId: { type: Schema.ObjectId, ref: 'parlor', required: true },
    //             parlorType: {type: 'number' ,required:true},

    //             active :{type: 'number', required: true},

    //             type: {type: 'string' , required: true},

    //             incentives:{
    //                 type:[
    //                     {
    //                         range : {type:'number', required : true},
    //                         incentive : {type: 'number' , required:true}
    //                     }
    //                 ],defaultsTo: []
    //             }
    //         }
    //     ], defaultsTo: []
    // },

    parlorId : { type : Schema.ObjectId ,required: true, unique: true},

    parlorType: {type: 'number' ,required:true},

    categories : { 
        type : [
                {
                    categoryId : { type: Schema.ObjectId ,required: true},

                    categoryName: {type: 'string' , required : true},

                    sort: {type: 'number', required :true},

                    incentives:{
                        type:[
                            {
                                range : {type:'number', required : true},
                                incentive : {type: 'number' , required:true}
                            }
                        ],defaultsTo: []
                    }
                }

        ], defaultsTo:[]
    },

});


//NEW

incentiveSchema.statics.getNewIncentiveObj =  function(data, item){

    return { 
        parlorId : data.parlorId,
        parlorType : data.parlorType,
        parlorName : data.parlorName,
        parlorAddress : data.parlorAddress,
        updatedAt : new Date(),
        parlorActive : data.parlorActive,
        categories : _.map(data.categories, function (category) {
            return{
                categoryId : category.categoryId,
                categoryName : category.categoryName,
                sort : category.sort,
                incentives : _.map(category.incentives,  function (incentive) {
                    return{
                        range : parseInt(incentive.range),
                        incentive : parseInt(incentive.incentive)
                    }
                })
            }
        })
    };

};

//OLD

// incentiveSchema.statics.getNewIncentiveObj =  function(req, item){
//     (console.log("ayaaaaaaaaaaaa"))
//     return {
//         categoryId: req.body.categoryId,
//         name:req.body.name,
//         sort:req.body.sort,
//         parlors: _.map(req.body.parlors, function (parlor) {
//             return{
//                 parlorType : parlor.parlorType,
//                 active: parseInt(parlor.active),
//                 type:parlor.type,
//                 incentives : _.map(parlor.incentives,  function (incentive) {
//                     return{
//                         range : parseInt(incentive.range),
//                         incentive :parseInt(incentive.incentive)
//                     }
//                 })
//             }
//         })
//     };

// };


// on every save, add the date
incentiveSchema.pre('save', function(next) {
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
// incentiveSchema.plugin(autoIncrement.plugin, 'admin');

var Incentive = mongoose.model('incentive', incentiveSchema);
// make this available to our users in our Node applications

module.exports = Incentive;