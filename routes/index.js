const axios = require('axios')
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  axios.get('https://data.austintexas.gov/resource/asyh-u6ja.json')
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
  res.status(200).send('woooooo');

});

module.exports = router;
