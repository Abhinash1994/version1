/**
 * Created by nikita on 8/02/2018.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var authorizedPaymentSchema = new Schema({

    createdAt: { type: 'date' },

    appointmentId : { type: Schema.Types.ObjectId},

    amount : {type : 'number'},

    captured : {type : 'Boolean', default : false},

    razorPaymentId : {type : 'string'},  

    updatedAt : {type : 'date'},

    schedulerUpdatedAt : {type : 'date'}

})



authorizedPaymentSchema.pre('save', function(next) {

    var currentDate = new Date();

    this.updatedAt = currentDate;

    if (!this.createdAt)

        this.createdAt = currentDate;

    next();
});

authorizedPaymentSchema.pre('update', function(next) {

  this.update({},{ $set: { updatedAt: new Date() } });

  next();

});

var AuthorizedPayment = mongoose.model('authorizedpayment', authorizedPaymentSchema);
module.exports = AuthorizedPayment;
