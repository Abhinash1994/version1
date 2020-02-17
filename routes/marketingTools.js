'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var request=require('request');


router.post('/noApptOneMonth',function(req,res){
    console.log("calling")

    Appointment.find({appointmentStartTime:{$gte:new Date(2017,9,1),$lt:new Date(2017,9,2)}},{_id:1},function(err,data){
        console.log(err)
        console.log(data)
        var count=data;





    })
    
})








module.exports = router;