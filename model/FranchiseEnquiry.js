/**
 * Created by ginger on 7/28/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var franchiseEnquirychema = new Schema({

    name : { type : 'string'},

    phoneNumber : { type : 'string'},

    selectLocation : {type : 'string'},
    
    emailId : {type : 'string'},
    
    message : {type : 'string'},
    
    source : {type : 'string'},

    keyword : {type : 'string'},

    time : {type : 'string'},

    createdAt : { type : 'date'},

});


franchiseEnquirychema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();
    // change the updated_at field to current date
    this.updatedAt = currentDate;
    this.randomize = this.uniqueHash + "" + (currentDate).toString();
    // if created_at doesn't exist, add to that field
    if (!this.createdAt)
        this.createdAt = currentDate;

    next();
});

var FranchiseEnquiry = mongoose.model('franchiseenquiry', franchiseEnquirychema);
module.exports = FranchiseEnquiry;