var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var paytmPaymentSchema = new Schema({
      userId : { type: Schema.ObjectId, required: true },    
      phoneNumber : { type: 'string', required: true },    
      orderId : { type: 'string', required: true },    
      couponCode : {type : 'string'},
      status : { type: 'number', required: true },    
      amount : { type: 'number', required: true },    
      paymentResponse : {},
      createdAt : { type: 'date', defaultsTo: Date.now() },
  });




 var PaytmPayment = mongoose.model('paytmpayment', paytmPaymentSchema);
 module.exports = PaytmPayment;