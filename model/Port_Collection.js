/**
 * Created by Nikita on 5/11/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var port_collectionSchema = new Schema({

    positionId :{type: 'array' ,required:true},

    catId : {type: 'array'},

    createdAt : { type: 'date', default: Date.now() },

    collName : {type:'string',required:true}

});


port_collectionSchema.statics.getNewCollectionObj =  function(req){
    return {
        positionId:req.body.positionId,
        collName :req.body.name
    }
};


//  on every save, add the date
port_collectionSchema.pre('save', function(next) {
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

var Port_Collection = mongoose.model('port_collection',port_collectionSchema);


module.exports = Port_Collection;
