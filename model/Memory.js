var mongoose = require('mongoose');
var Schema = mongoose.Schema;

 var MemorySchema = new Schema({
    data : { type: 'string', required: true },    // paid | unpaid
    createdAt : { type: 'date', defaultsTo: Date.now() },
  });

 var Memory = mongoose.model('memory', MemorySchema);
 module.exports = Memory;