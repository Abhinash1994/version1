/**
 * Created by Nikita on 5/11/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var port_tagsSchema = new Schema({
    positionId :{type: 'array' ,required:true},

    tagName:{type:'string' , defaultsTo:null},

    createdAt : { type: 'date', default: Date.now() }

});


port_tagsSchema.statics.getNewTagsObj =  function(req){
    return {
        positionId:req.body.positionId,
        tagName : req.body.name
    }
};


//  on every save, add the date
port_tagsSchema.pre('save', function(next) {
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

var Port_Tag = mongoose.model('port_tag', port_tagsSchema);


module.exports = Port_Tag;