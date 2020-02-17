var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;


var concernThreadSchema = new Schema({

    createdAt: { type: 'date' },

    updatedAt: { type: 'date' },

    threadId: { type: Schema.ObjectId, required: true },

    senderId: { type: Schema.ObjectId },

    type: { type: 'number', default: 0 }, // 0-undelivered , 1-delivered

    userType: { type: 'number' }, // 0-salon , 1-beu, 2- admin

    members: [{
        memberId: { type: Schema.ObjectId },
        seen: { type: 'boolean', default: true }
    }],
    profilePic: { type: 'string' },

    message: { type: 'string' },

});


concernThreadSchema.pre('save', function(next) {

    var currentDate = new Date();
    this.role = parseInt(this.role);
    this.updatedAt = currentDate;
    if (!this.createdAt)
        this.createdAt = currentDate;

    next();
});

var ConcernThread = mongoose.model('concernThread', concernThreadSchema);

module.exports = ConcernThread;