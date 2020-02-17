
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;


var opsConcernSchema = new Schema({

    createdAt: { type: 'date' },

    updatedAt: { type: 'date' },

    parlorId : { type : Schema.ObjectId , required : true},

    parameters :[],

    response : { type : 'string'},

}); 




opsConcernSchema.pre('save', function(next) {
    var currentDate = new Date();
    this.role = parseInt(this.role);
    this.updatedAt = currentDate;
    if (!this.createdAt)
        this.createdAt = currentDate;

    next();
});

var OpsConcern = mongoose.model('opsconcern', opsConcernSchema);

module.exports = OpsConcern;
