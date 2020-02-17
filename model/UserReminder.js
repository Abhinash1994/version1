
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userReminder = new Schema({
    type : { type: 'number', required: true }, 
    title : { type: 'string', required: true },
    dueDate : {type : 'date', required : true},
    skiped : {type : 'boolean', default : false},
    isSnoozed : {type : 'boolean', default : false},
    active : { type: 'boolean', required: true, default : true },
	userId: { type: Schema.Types.ObjectId, ref: '' },
    createdAt : { type: 'date', default: Date.now() },
    updatedAt : { type: 'date', default: Date.now() },
});


//  on every save, add the date
userReminder.pre('save', function(next) {
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

var UserReminder = mongoose.model('userReminder', userReminder);
module.exports = UserReminder;