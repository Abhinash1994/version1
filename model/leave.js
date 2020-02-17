var mongoose = require('mongoose');
var Schema = mongoose.Schema;

 var leaveSchema = new Schema({
    status : { type: 'string', required: true },    // paid | unpaid
    reason : { type: 'string', required: true },
    leave_type : { type: 'string', required: true },      // half | full
    date : { type: 'date' },
    createdAt : { type: 'date', default: Date.now() },
    user_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'admin'
	},
  });

 var Leave = mongoose.model('leave', leaveSchema);
 module.exports = Leave;