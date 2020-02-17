var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;


var parlorConcernResponseSchema = new Schema({

    createdAt: { type: 'date' },

    updatedAt: { type: 'date' },

    categoryId: { type: 'Number' }, //0-admin

    concernId: { type: Schema.ObjectId },//1admin

    parlorId: { type: Schema.ObjectId, required: true },

    open: { type: 'boolean', default: true }, //true - open , false - close

    status: { type: 'number' , default : 0}, //0-open , 1-requested , 2 - approved

    members: [{
        memberId: { type: Schema.ObjectId, required: true },
        memberName: { type: 'string', default: "" },
        memberRole :{ type: 'number'},
    }],

    response: { type: 'string' },

    raisedBy: { type: Schema.ObjectId },

    raisedByName: { type : "string"},

    raisedByRole: { type : "number"}

});


parlorConcernResponseSchema.pre('save', function(next) {

    var currentDate = new Date();
    this.role = parseInt(this.role);
    this.updatedAt = currentDate;
    if (!this.createdAt)
        this.createdAt = currentDate;

    next();
});

var ParlorConcernResponse = mongoose.model('parlorConcernResponse', parlorConcernResponseSchema);

module.exports = ParlorConcernResponse;