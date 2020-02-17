/**
 * Created by Nikita on 7/27/2017.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;


var beuformAnswerSchema = new Schema({

});

beuformAnswerSchema.statics.submitBeuFormAnswerObj =  function(req, item){
    
};

// on every save, add the date
beuformAnswerSchema.pre('save', function(next) {
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
// opsForm.plugin(autoIncrement.plugin, 'admin');

var BeuFormAnswers = mongoose.model('beuformanswer', beuformAnswerSchema);
// make this available to our users in our Node applications

module.exports = BeuFormAnswers;
