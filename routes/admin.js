'use strict'

var express = require('express');
var router = express.Router();


router.post('/member', function (req, res) {
    Beu.create(Beu.getUserObj(req), function(err, createdObj){
        if(err){
            return res.json(CreateObjService.response(true, 'Error in creating member'));
        }
        else{
            return res.json(CreateObjService.response(false, Beu.parse(createdObj)));
        }
    });
});


router.get('/member', function (req, res) {
    Beu.find({}, function(err, beus){
        if(err){
            return res.json(CreateObjService.response(true, 'Error in creating member'));
        }
        else{
            return res.json(CreateObjService.response(false, _.map(beus, function(b){ return Beu.parse(b); })));
        }
    });
});

router.get('/appointmentFromApp', function(req, res, next) {
     Appointment.find({status : { $in : [1,4] }, appointmentType : 3 }).sort({createdAt: 1}).exec( function(err, data){
      if(!err){
          return res.json(CreateObjService.response(false, Appointment.parseArray(data)));
      }
      else{
          return res.json(CreateObjService.response(true, 'Invalid data'));
      }
    });
});


router.put('/updateMember', function (req, res) {
    Beu.update({_id : req.body.userId}, {parlorIds : req.body.parlorIds, beuIds : req.body.beuIds,phoneNumber:req.body.phoneNumber }, function(err, createdObj){
        if(err){
            return res.json(CreateObjService.response(true, 'Error in updating member'));
        }
        else{
            return res.json(CreateObjService.response(false, 'Updated'));
        }
    });
});


module.exports = router;
