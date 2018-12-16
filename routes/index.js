var express = require('express');
var router = express.Router();
var User = require('../models/User');
var passport = require('passport');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');

var config = require('../config/database')

router.post('/signin/', function(req, res, next) {
  User.findOne({
    email:req.body.email
  }, function(err,user){
    if (err) throw err;
    if (!user){
      res.status(401).send({success: false, msg: 'Authentication failed. User not found'});
    }else{
      user.comparePassword(req.body.password, function(err, isMatch){
        if (isMatch && !err){
          var token = jwt.sign(user.toObject(), config.secret);
          res.json({success:true, token: token, msg:"Successfully logged in!"});
        }else{
          res.status(401).send({success:false, msg:'Authentication failed. Wrong password'});
        }
      })
    }
  });
});

router.post('/signup/',function(req,res,next){
  if (!req.body.email || !req.body.password){
    res.json({success:false, msg:'Please fill up stuff'});
  }else{
      User.findOne({email:req.body.email},function(err,usr){
	    if (err){
	      res.json({success:false,msg:"Some kind of error"});
	    }
	    else if (usr != null){
	      res.json({success:false,msg:"User already exists"});
	    }else{
	      var newUser = new User({
		      email: req.body.email,
          password:req.body.password,
          mobile: req.body.phone,
          pin: req.body.pin
	      });
	      newUser.save(function(err,success){
		      if(err){
		        res.json({success: false, msg:'email already exists'});
		       }
		      res.json({success:true,msg:'Successfully created new user'});
	        })
	  }});
  }
});

router.post('/forgotPassword', function (req, res, next) {
  if (!req.body.email) {
    res.json({success: false, msg:'Email is necessary'});
  }
  // TODO handle this
});

module.exports = router;
