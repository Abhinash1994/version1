var mongoose = require('mongoose');
var Schema = mongoose.Schema;

 var slabSchema = new Schema({
    
    ranges : {type : [{
          range1 : {type : 'number'},
          range2 : {type : 'number'},
          discount : {type : 'number'},
      }]
    },

    createdAt : { type: 'date', defaultsTo: Date.now() }
  });


 var Slab = mongoose.model('slab', slabSchema);
 module.exports = Slab;