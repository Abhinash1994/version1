/**
 * Created by Nikita on 2/20/2017.
 */
/**
 * Created by Nikita on 2/18/2017.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;


var customerPhoneSchema = new Schema({

    createdAt: { type: 'date' },

    updatedAt: { type: 'date' },

    phoneNumber : {type : 'string'},
});




// on every save, add the date
customerPhoneSchema.pre('save', function(next) {
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
// customerPhoneSchema.plugin(autoIncrement.plugin, 'admin');

var CustomerPhone = mongoose.model('customerPhone', customerPhoneSchema);
// make this available to our users in our Node applications

module.exports = CustomerPhone;
