var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;


var parlorConcernSchema = new Schema({

    createdAt: { type: 'date' },

    updatedAt: { type: 'date' },

    categoryName: { type: 'string', required: true },

    categoryId: { type: 'number', required: true }, // 0- admin

    priority: { type: 'number', default : 1}, //1- High , 2- Medium , 3- Low

    concernType : { type : 'number' , default : 0} , //0- FAQ , 1- Chat

    question : { type : 'string'},

    answer : { type : 'string'},

    concern: [{

        concernName: { type: 'string', required: true },

        concernDetail: { type: 'string' },
    }],

});




parlorConcernSchema.pre('save', function(next) {
    var currentDate = new Date();
    this.role = parseInt(this.role);
    this.updatedAt = currentDate;
    if (!this.createdAt)
        this.createdAt = currentDate;

    next();
});

var ParlorConcerns = mongoose.model('parlorConcern', parlorConcernSchema);

module.exports = ParlorConcerns;