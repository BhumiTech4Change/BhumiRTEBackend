/*
* Protected route to make a post request to the
* google form based upon the obtained user details
*/
const express = require('express');
const router = express.Router();
const request = require("request");

router.post('/', function (req, res, next) {
  const options = {
    method: 'POST',
    url: 'https://docs.google.com/forms/d/e/1FAIpQLSdwA-6lR5xERMFHPkW77kyJb4-UZFSawCHfyiQOzFZUxxsBzg/formResponse',
    headers: {
      'cache-control': 'no-cache', 'Content-Type': 'application/x-www-form-urlencoded'
    },
    form: {
      'entry.1929656395': req.body.email,
      'entry.1596879920': req.body.phone,
      'entry.912318726': req.body.parentName,
      'entry.2058139695': req.body.childName,
      'entry.1012257266': req.body.dateOfBirth,
      'entry.1085914342': req.body.pinCode,
      'entry.1958529600': req.body.certificate,
      'entry.488536056': req.body.comment
    }
  };

  request(options, function (error) {
    if (error) {
      res.json({'success': false, msg: 'Error!'});
      return;
    }
    res.json({'success': true, msg: 'Successfully submitted the details'});
  });

});

module.exports = router;
