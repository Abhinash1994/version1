var mongoose = require('mongoose');
var Schema = mongoose.Schema;

 var companySchema = new Schema({
    name : { type: 'string', required: true },    
    updatedAt : { type: 'date', defaultsTo: Date.now() },
    createdAt : { type: 'date', defaultsTo: Date.now() },
    extension : { type: 'string', required: true},
  });


 companySchema.statics.createNewCompany = function(data , item){
    return{
      name : data.companyName,
      extension : data.extension
    }
 }


  //  on every save, add the date
  companySchema.pre('save', function(next) {
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



 var Company = mongoose.model('corporatecompany', companySchema);
 module.exports = Company;