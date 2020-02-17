var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var expenseSchema = new Schema({
    amount : { type: 'number', required: true },    // paid | unpaid
    billNo : { type: 'string', required: true },
    name : { type: 'string', required: true },      // half | full
    createdAt : { type: 'date', defaultsTo: Date.now() },
});

expenseSchema.statics.getNewObj = function(req){
    return {
        amount : req.body.amount,
        billNo : req.body.billNo,
        name : req.body.name,
        createdAt : new Date(),
    };
};


expenseSchema.statics.parseArray = function(data){
    return _.map(data, function(d){
        return {
            amount : d.amount,
            billNo : d.billNo,
            name : d.name,
            createdAt : d.createdAt,
        }
    });
};

var Expense = mongoose.model('expense', expenseSchema);
module.exports = Expense;