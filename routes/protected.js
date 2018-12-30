/*
* Protected route to make a post request to the 
* google form based upon the obtained user details
*/
var express = require('express');
var router = express.Router();
var request = require("request");


// const declarations
const email = 'entry.1929656395',
      phone = 'entry.1596879920',
      parentName = 'entry.912318726',
      childName = 'entry.2058139695',
      dateOfBirth = 'entry.1012257266',
      pinCode = 'entry.1085914342',
      certificate = 'entry.1958529600',
      comment = 'entry.488536056';


router.post('/', function(req, res, next) {

  var options = { 
  method: 'POST',
  url: 'https://docs.google.com/forms/d/e/1FAIpQLSdwA-6lR5xERMFHPkW77kyJb4-UZFSawCHfyiQOzFZUxxsBzg/formResponse',
  headers: 
   { 'cache-control': 'no-cache',
     'Content-Type': 'application/x-www-form-urlencoded' },
  form: 
   { email : req.body.email,
     phone : req.body.phone,
     parentName : req.body.parentName,
     childName : req.body.childName,
     dateOfBirth : req.body.dateOfBirth,
     pinCode : req.body.pinCode,
     certificate : req.body.certificate,
     comment : req.body.comment }
  };
  request(options, function (error, response, body) {
    if (error){
      res.json({'success':false, msg:'Error!'})
    } 
    res.json({'success': true, msg: 'Successfully submitted the details'});
  });

});

module.exports = router;
