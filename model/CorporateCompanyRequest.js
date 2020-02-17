var mongoose = require('mongoose');
var Schema = mongoose.Schema;

 var corporateCompanyRequestSchema = new Schema({

    name : { type: 'string' },

    userId : {type : Schema.ObjectId, ref : 'User'},

    location : { type: 'string'},    
    
    companyName : { type: 'string'},   

    hrEmail : { type: 'string'},    

    updatedAt : { type: 'date', defaultsTo: Date.now() },

    createdAt : { type: 'date', defaultsTo: Date.now() },
    
  });

  //  on every save, add the date
  corporateCompanyRequestSchema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();
    // change the updated_at field to current date
    this.updatedAt = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.createdAt)
      this.createdAt = currentDate;

    next();
  });
// corporateCompanyRequestSchema.plugin(autoIncrement.plugin, 'user');



 var CorporateCompanyRequest = mongoose.model('corporatecompanyrequest', corporateCompanyRequestSchema);
 module.exports = CorporateCompanyRequest;