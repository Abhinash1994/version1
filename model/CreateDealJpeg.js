var mongoose = require('mongoose');
var Schema = mongoose.Schema;

 var createDealJpegSchema = new Schema({

    parlorId: { type: Schema.ObjectId, ref: 'parlor', required: true },

    data : {},

    createdAt : { type: 'date', defaultsTo: Date.now() },

  });


 var CreateDealJpeg = mongoose.model('createdealjpeg', createDealJpegSchema);
 module.exports = CreateDealJpeg;