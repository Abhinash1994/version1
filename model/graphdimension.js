/**
 * Created by ginger on 5/31/2017.
 */


var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var graphDimensionSchema = new Schema({

    name:'String',
    group:'Number',
    groupName:'String',
    type:'String',
    show:'Number',
    Id:{type:'number',unique:true},
    createdAt : { type: 'date' },

    updatedAt : { type: 'date' }

});


graphDimensionSchema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();
    // change the updated_at field to current date
    this.updatedAt = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.createdAt)
        this.createdAt = currentDate;

    next();
});

var graphDimension = mongoose.model('graphdimension', graphDimensionSchema);

module.exports = graphDimension;
