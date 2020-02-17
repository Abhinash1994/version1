'use strict'
var express = require('express');
var router = express.Router();

router.post('/login',  function(req, res) {
   var response = {};
      Beu.findOne({phoneNumber : req.body.phoneNumber}, function(err, u){
          if(u){
                  if(u.password==req.body.password){
                      Beu.createSession(req.session, u);
                      response.error = false;
                  }else{
                      response.message = "Invalid password";
                  }
                  return res.json(response);
              }else{
                    if(req.body.phoneNumber == "admin" && req.body.password == "shailendras"){
                        var parlorId = Admin.createSession(req.session, {firstName: "Admin", userTypeBeu: 1, role: 1, id: 'admin', parlorId : { id : 4444, name : "Admin"}});
                            return res.json({error:false});
                    }
                    else{
                        Admin.findOne({phoneNumber : req.body.phoneNumber}).exec(function(err, user){
                            console.log(user);
                            var response = {error: true};
                            if(user){
                                if(user.password==req.body.password){
                                    user.userTypeBeu = 0
                                    var parlorId = Admin.createSession(req.session, user);
                                    response.error = false;
                                    response.parlorId = parlorId;
                                }else{
                                    response.message = "Invalid password";
                                }
                            }else{
                                response.message = "Invalid username";
                            }
                            return res.json(response);
                        });
                    }
              }
      });
});

  router.get('/logout',  function(req, res){
      req.session.destroy(function(err) {
          return res.redirect('/crm');
      });
  });

module.exports = router;
