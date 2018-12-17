var express = require('express');
var router = express.Router();
var User = require('../models/User');
var passport = require('passport');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');

var config = require('../config/database')

router.get('/', function(req, res, next) {
  res.send("Server is up and running!");
})

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

router.get('/forgotPassword/:email', function (req, res, next) {
  console.log(req.params.email);
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        console.log(token);
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.params.email }, function(err, user) {
        if (!user) {
          res.json({'success': false});
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
          

        User.update({ _id: user._id}, user, {upsert: true} , function (err, user) {
            done(err, token);
        });
      });
    },
    function(token, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: 'bhumirte',
          pass: 'Idontknowmypass123'
        }
      });
      
      var mailOptions = {
        to: req.params.email,
        from: 'passwordreset@bhumirte.com',
        subject: 'Bhumi RTE Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      console.log(mailOptions);
      smtpTransport.sendMail(mailOptions, function(err) {
        // Done sending the mail
        if (err) {
          console.log(err);
        }
        res.send("Sent the data");
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
});

router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      return res.redirect('/forgot');
    }
    
    
  });
});

module.exports = router;
