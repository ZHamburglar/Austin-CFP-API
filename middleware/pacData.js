var express = require('express');
const axios = require('axios');
var path = require('path');
var fs = require('fs');

module.exports = function(){
    checkForJSON();
    updateCheck();
    console.log('this is the middleware');
}

function callCOA () {
	axios.get('https://data.austintexas.gov/resource/asyh-u6ja.json')
	.then(function (response) {
		console.log(response);
	})
	.catch(function (error) {
		console.log(error);
	});
}

function updateCheck () {
    fs.readFile('json/data.json', 'utf-8', function(err, data) {
        if (err) throw err
        var cData = JSON.parse(data)
        lastUpdate = cData.lastUpdated
        console.log(lastUpdate, 'last update')
        if ((Date.now() - lastUpdate) > 1000) {
            console.log('booooooo')
        }
    })
};

function checkForJSON() {
	if (!fs.existsSync('json/data.json')){
		fs.writeFile('json/data.json', '{"lastUpdated":[],"pacspending":[]}', function (err) {
			if (err) throw err;
			console.log('data.json has been created.');
		});
	}
};