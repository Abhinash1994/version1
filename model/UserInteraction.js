/**
 * Created by nikita on 8/02/2018.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userInteractionSchema = new Schema({

    createdAt: { type: 'date' },

    updatedAt: { type: 'date' },

    userId : { type: Schema.Types.ObjectId, ref: 'users',required:true},

    lastInteraction : {type :{
        
        mail: { type: 'date' },

        notification : { type : 'date'},

        sms : { type : 'date'},
    }},



})


userInteractionSchema.statics.createNewObj = function(userId,interactionObj){
    UserInteraction.create({userId : userId , createdAt : new Date() , updatedAt : new Date() , lastInteraction : interactionObj}, function(err, newObj){
       
    })
};


userInteractionSchema.pre('save', function(next) {

    var currentDate = new Date();

    this.updatedAt = currentDate;

    if (!this.createdAt)

        this.createdAt = currentDate;

    next();
});

userInteractionSchema.pre('update', function(next) {

  this.update({},{ $set: { updatedAt: new Date() } });

  next();

});

var UserInteraction = mongoose.model('userInteraction', userInteractionSchema);
module.exports = UserInteraction;
