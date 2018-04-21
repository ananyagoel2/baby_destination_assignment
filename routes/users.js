var express = require('express');
var jwt = require("jsonwebtoken");

var router = express.Router();

var user = require('../models/user').user_model;

router.post('/register', function(req, res) {

  user.forge(
      'email',req.body.email
  ).fetch()
      .then(function (user_response) {
          if(user_response === null){
            var new_user = new user({
                email: req.body.email,
                password: req.body.password,
                full_name: req.body.full_name
            })
              new_user.save().then(function (new_user_data, error) {
                  var new_user_data_json = new_user_data.toJSON();
                  res.send({
                      user_id: new_user_data_json.id,
                      success:true
                  })
              }).catch(function (error) {
                  console.error(error);
                  res.send(error.data)
              })
          }else{
              console.log("error: Not a unique user");
              return res.status(409).json({
                  message: "Not a unique user",
                  success:false
              });
          }
      }).catch(function (error) {
      console.error(error)
      return res.status(400).json({
          message: error,
          success:false
      });
  })

});

router.post('/log', function (req,res) {
    user.forge(
        "email", req.body.email
    ).fetch()
        .then(function (user_response) {
            if(user_response !== null)
            {
                user_response.authenticate(req.body.password)
                    .then(function (user_data, error) {
                        if(user_data){
                            var user_json = user_data.toJSON();
                            var token = jwt.sign({
                                user_id: user_json.id,
                                full_name: user_json.full_name
                            }, "secret", {
                                expiresIn: '10m'
                            });
                            return res.status(200).json({
                                token : token,
                                success: true
                            });
                        }
                        else {
                            console.error(error)
                            return res.status(400).json({
                                message: error,
                                success:false
                            });
                        }
                    }).catch(function (error) {
                    console.error(error);
                    return res.status(400).json({
                        message: error,
                        success:false
                    });
                })
            }
            else
            {
                return res.status(400).json({
                    message: "record not found",
                    success:false
                });
            }

        })
});

router.put('/profile', function (req, res) {
    var token = req.body.token || req.query.token || req.headers["x-access-token"] || req.query.state;
    if (token) {
        jwt.verify(token, "secret", function (err, decoded) {
            if (err) {
                console.error(err);
                res.status(200).send({
                    success: false,
                    message:"invalid_token"
                });
            } else {
                if(req.body.full_name){
                    user.forge(
                        "id", decoded.user_id
                    ).fetch()
                        .then(function (user_data, error) {
                            if(user_data=== null){
                                return res.status(400).json({
                                    message: "record not found",
                                    success:false
                                });
                            }
                            else{
                                user_data.save({ full_name: req.body.full_name }, { method: "update" })
                                    .then(function () {
                                        return res.status(200).json({
                                            message : "updated",
                                            success: true
                                        });
                                    })
                            }
                        })
                }
                else{
                    res.json({ success: false, message: "name missing" });
                }
                            }
        });
    } else {
        return res.json({ success: false, message: "token missing" });
    }
})

module.exports = router;
