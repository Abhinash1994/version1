/**
 * Created by ginger on 5/8/2017.
 */



var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;


var luckyDrawSchema= new Schema({

    parlorId : { type: Schema.ObjectId, ref : 'parlors' },

    parlorName:'String',

    weekName:'String',
    weekNumber:'Number',

    employeesList: [{

        employeeId:{ type: Schema.ObjectId, ref : 'owners' },

        firstName:'String',
        lastName:'String',


    }],

    amount:'String',

    weekDate:'Date',

    createdAt : { type: 'date' },

    updatedAt : { type: 'date' }

});


luckyDrawSchema.statics.postWinners=function (req,callback) {



    console.log("inner",req.body)

var query={

    "employeesList": req.body.employeesList,

    "weekDate":req.body.weekDate


}

    LuckyDraw.create(query,function (err,result) {

                console.log(result)
                console.log("done")
            callback(err,result)

    })

}




luckyDrawSchema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();
    // change the updated_at field to current date
    this.updatedAt = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.createdAt)
        this.createdAt = currentDate;

    next();
});

var LuckyDraw = mongoose.model('luckyDraw', luckyDrawSchema);

module.exports = LuckyDraw;
