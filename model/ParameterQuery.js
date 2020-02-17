
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;


var parameterQuerySchema = new Schema({

    createdAt: { type: 'date' },

    updatedAt: { type: 'date' },

    parameter : { type: 'string'},

    query : { type : 'string'},

}); 




parameterQuerySchema.pre('save', function(next) {
    var currentDate = new Date();
    this.role = parseInt(this.role);
    this.updatedAt = currentDate;
    if (!this.createdAt)
        this.createdAt = currentDate;

    next();
});

var ParameterQuery = mongoose.model('parameterquery', parameterQuerySchema);

module.exports = ParameterQuery;
