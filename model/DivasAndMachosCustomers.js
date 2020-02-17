var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var DivasAndMachosCustomersSchema = new Schema({
    name: {type : 'String'},
    customerId: {type : 'number'},
    emailId: {type : 'String'},
    gender: {type : 'String'},
    phoneNumber: {type : 'String'},
    clientId: { type: Schema.Types.ObjectId},
    createdAt : {type : 'date'},
    updatedAt : {type : 'date'},
    contactHistory : {
        type: [{
            customerCareId : { type: Schema.ObjectId },
            customerCareName : {type : 'String'},
            remark: { type: 'String' },
            callStatus: { type: 'String'},
            contactedOn : { type: 'date' },
            expectedOn : { type : 'date'}
        }]
    }
});

// on every save, add the date
DivasAndMachosCustomersSchema.pre('save', function (next) {
    // get the current date
    var currentDate = new Date();
    // change the updated_at field to current date
    this.updatedAt = currentDate;
    // if created_at doesn't exist, add to that field
    if (!this.createdAt)
        this.createdAt = currentDate;
    next();
});
var DivasAndMachosCustomers = mongoose.model('divasnmachoscustomers', DivasAndMachosCustomersSchema);
module.exports = DivasAndMachosCustomers;
