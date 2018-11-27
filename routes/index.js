const axios = require('axios');
const fs = require('fs');
var path = require('path');
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	// axios.get('https://data.austintexas.gov/resource/asyh-u6ja.json')
	// .then(function (response) {
	// 	console.log(response);
	// })
	// .catch(function (error) {
	// 	console.log(error);
	// });
	checkForJSON();
	fs.readFile('./json/data.json', 'utf-8', function(err, data) {
		if (err) throw err
		var pacData = JSON.parse(data);
		sendJSON(res);
	})

});

function sendJSON(res) {
	var filePath = './json/data.json'
	var resolvedPath = path.resolve(filePath);
	return res.sendFile(resolvedPath);
}

function checkForJSON() {
	if (!fs.existsSync('./json/data.json')){
		fs.writeFile('./json/data.json', '{"lastUpdated":[],"pacspending":[]}', function (err) {
			if (err) throw err;
			console.log('data.json has been created.');
		});
	}
};

module.exports = router;
