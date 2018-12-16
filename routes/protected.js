var express = require('express');
var router = express.Router();
var request = require("request");

router.post('/', function(req, res, next) {

  var options = { 
  method: 'POST',
  url: 'https://docs.google.com/forms/d/e/1FAIpQLSdwA-6lR5xERMFHPkW77kyJb4-UZFSawCHfyiQOzFZUxxsBzg/formResponse',
  headers: 
   { 'Postman-Token': 'a7a5fa34-d29c-4aa1-8c45-7bd01543e4d0',
     'cache-control': 'no-cache',
     'Content-Type': 'application/x-www-form-urlencoded' },
  form: 
   { 'entry.1929656395': req.body.email,
     'entry.1596879920': req.body.phone,
     'entry.912318726': req.body.parentName,
     'entry.2058139695': req.body.childName,
     'entry.1012257266': req.body.dateOfBirth,
     'entry.1085914342': req.body.pinCode,
     'entry.1958529600': req.body.certificate,
     'entry.488536056': req.body.comment }
  };
  request(options, function (error, response, body) {
    if (error){
      res.json({'success':false, msg:'Error!'})
    } 
    res.json({'success': true, msg: 'Successfully submitted the response'});
  });

});



module.exports = router;
