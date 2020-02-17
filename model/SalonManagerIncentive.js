/**
 * Created by Nikita on 9/12/2017.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;


var salonManagerIncentiveSchema = new Schema({
    
    createdAt: { type: 'date' },

    updatedAt: { type: 'date' },

    parlorType: {type: 'number' ,required:true},

    levels:{
        type:[
            {
                level :{type: 'string', required: true},

                incentives:{
                    type:[
                        {
                            role : {type : 'number' , required :true},
                            incentive : {type: 'number' , required:true}
                        }
                    ],defaultsTo: []
                }
            }
        ], defaultsTo: []
    }

});




salonManagerIncentiveSchema.statics.createManagerIncentiveObj =  function(req, item){
    return {
        categoryId: req.body.categoryId,
         parlorType : req.body.parlorType,
        levels: _.map(req.body.levels, function (level) {
            return{
                level: level.level,
                incentives : _.map(level.incentives,  function (incentive) {
                    return{
                        role : incentive.role,
                        incentive :parseInt(incentive.incentive)
                    }
                })
            }
        })
    };

};


// on every save, add the date
salonManagerIncentiveSchema.pre('save', function(next) {
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
// salonManagerIncentiveSchema.plugin(autoIncrement.plugin, 'admin');

var SalonManagerIncentive = mongoose.model('salonmanagerincentive', salonManagerIncentiveSchema);
// make this available to our users in our Node applications

module.exports = SalonManagerIncentive;
