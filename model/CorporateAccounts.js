var mongoose = require('mongoose');
var Schema = mongoose.Schema;

 var corporateAccountsSchema = new Schema({

    emailId : { type: 'string', required: true },    

    companyId : { type: Schema.ObjectId, required: true },    

    otp : { type: 'string', required: true },    

    used : { type: 'number', default : 0 },    

    updatedAt : { type: 'date', default: Date.now() },

    createdAt : { type: 'date', default: Date.now() },

  });

  //  on every save, add the date
  corporateAccountsSchema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();
    // change the updated_at field to current date
    this.updatedAt = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.createdAt)
      this.createdAt = currentDate;

    next();
  });
// companySchema.plugin(autoIncrement.plugin, 'user');



 var CorporateAccounts = mongoose.model('corporateaccounts', corporateAccountsSchema);
 module.exports = CorporateAccounts;