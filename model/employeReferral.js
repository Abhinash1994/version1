/**
 * Created by ginger on 7/18/2017.
 */
/**
 * Created by ginger on 4/17/2017.
 */


var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var referralStructureSchema = new Schema({

    name:{type:'string'},

    phoneNumber:{type:'string'},

    gender : { type: 'string', enum: ["M", "F"], size: 1, default: "M" },

    location:{type:'string'},

    employeeId:{ type: Schema.ObjectId, ref : 'owner' },

    referredContactName:"String",

    referredContactNumber:{type:"string",unique:true},

    address:{type:"string",default:''},

    distance:{type:"number",default:0},

    latitude : { type: 'number' },

    longitude : { type: 'number' },

    area:{type:"boolean",default:false},

    city:{type:"string",default:''},

    salaryMin:{type:"string",default:''},

    salaryMax:{type:"string",default:''},

    experience:{type:"string",default:''},

    department:{type:"string",default:''},

    createdAt : { type: 'date' },

    updatedAt : { type: 'date' }

});







referralStructureSchema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();
    // change the updated_at field to current date
    this.updatedAt = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.createdAt)
        this.createdAt = currentDate;

    next();
});

var EmployeeReferral = mongoose.model('employeeReferral', referralStructureSchema);

module.exports = EmployeeReferral;
