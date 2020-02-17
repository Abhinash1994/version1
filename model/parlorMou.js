/**
 * Created by ginger on 6/20/2017.
 */


/**
 * Created by ginger on 4/17/2017.
 */


var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var mouStructureSchema = new Schema({

    fileUrl:{type:'String'},

    parlorId : { type: Schema.ObjectId, ref : 'parlor' },

    createdAt : { type: 'date' },

    updatedAt : { type: 'date' }

});

mouStructureSchema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();
    // change the updated_at field to current date
    this.updatedAt = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.createdAt)
        this.createdAt = currentDate;

    next();
});

var ParlorMou = mongoose.model('parlorMou', mouStructureSchema);

module.exports = ParlorMou;
