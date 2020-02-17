/**
 * Created by nikita on 6/28/2018.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var HrSupportDataSchema = new Schema({

    parlorId : { type: Schema.Types.ObjectId},

    createdAt : { type: 'date' },
  
    updatedAt : { type: 'date' },

    month: { type: 'number'},

    year: { type: 'number'},

    employeeName : { type : 'string'},

    position : { type : 'string'}

});



HrSupportDataSchema.pre('save', function(next) {
    var currentDate = new Date();
    this.updatedAt = currentDate;
    if (!this.createdAt)
        this.createdAt = currentDate;
    next();
});

var HrSupportData = mongoose.model('hrsupportdata', HrSupportDataSchema);
module.exports = HrSupportData;
