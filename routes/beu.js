'use strict'

var express = require('express');
var router = express.Router();
var request = require('request');
var mongoose = require('mongoose');

/** Facebook **/

router.post('/create', function (req, res) {
    Beu.create(Beu.createNewObj(req), function(err, d){
        if(err) return res.json(CreateObjService.response(true, 'Form Validation Error'));
        else return res.json(CreateObjService.response(false, Beu.parse(d)));
    });
});

module.exports = router;
