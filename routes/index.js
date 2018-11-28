const fs = require('fs');
var path = require('path');
var express = require('express');
var router = express.Router();

// Local Paths
var pacData = require('../middleware/pacData');

router.get('/', function(req, res, next) {
	pacData();
	console.log('test location 2')
	var filePath = './json/data.json';
	var resolvedPath = path.resolve(filePath);
	res.sendFile(resolvedPath);
});


module.exports = router;
