/**
 * Created by Nikita on 2/18/2017.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;


var subsSchema = new Schema({

    parlorId: { type: Schema.ObjectId, required: true },

    createdAt: { type: 'date' },

    updatedAt: { type: 'date' },
    paymentDate: { type: 'date' },
    amount: Number,
    time: { type: 'date' },
    transfered: { type: 'boolean', default: false }


});



// on every save, add the date
subsSchema.pre('save', function(next) {
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
// incentiveSchema.plugin(autoIncrement.plugin, 'admin');

var Substransfer = mongoose.model('substransfer', subsSchema);
// make this available to our users in our Node applications

module.exports = Substransfer;