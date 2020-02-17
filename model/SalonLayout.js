var mongoose = require('mongoose');
var Schema = mongoose.Schema;

 var salonLayoutSchema = new Schema({

    parlorId: { type: Schema.ObjectId, ref: 'parlor', required: true },

    layout : {},

    createdAt : { type: 'date', defaultsTo: Date.now() },

  });


 var SalonLayout = mongoose.model('salonLayout', salonLayoutSchema);
 module.exports = SalonLayout;