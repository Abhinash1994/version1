var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var advanceSchema = new Schema({
    amount : {type :'number'},
    userId : { type: Schema.ObjectId, ref : 'user' },
    parlorId : { type: Schema.ObjectId, ref : 'parlor' },
    
    allPaymentMethods: {
        type: [
            {
                value: { type: 'number', required: true },
                name: { type: 'string' },
                amount: { type: 'number' }
            }
        ], defaultsTo: []
    },
    createdAt : {type : 'date'},
    verifiedAt : {type : 'date'},
});


advanceSchema.statics.createNew = function(req, userId){
    return {
        amount : req.body.data.addAdvanceCredits,
        userId : userId,
        parlorId : req.session.parlorId,
        allPaymentMethods : getPaymentMethodObj(req.body.data.advancePaymentMethods),
    };
};


function getPaymentMethodObj(methods){
    return _.map(methods, function(m){
        return{
            value : m.value,
            name : m.name,
            amount : m.amount,
        }
    });
}


// on every save, add the date
advanceSchema.pre('save', function (next) {
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
var Advance = mongoose.model('advance', advanceSchema);
module.exports = Advance;