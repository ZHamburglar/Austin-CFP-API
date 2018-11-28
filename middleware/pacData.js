const express = require('express');
const axios = require('axios');
const util = require('util');
const path = require('path');
const fs = require('fs');

const existsSync = util.promisify(fs.existsSync);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

module.exports = function(){
    checkForJSON();
    // updateCheck();
    console.log('this is the middleware');
}

// function writeUpdate (cData) {
// 	fs.writeFile('json/data.json', JSON.stringify(cData), 'utf-8', function(err) {
// 		if (err) throw err
// 		console.log('JSON Sent!');
// 	});
// }

// function callCOA (cData) {
// 	axios.get('https://data.austintexas.gov/resource/asyh-u6ja.json?$limit=5')
// 	.then(function (response) {
// 		console.log(response.data);
// 		cData.pacspending = response.data;
// 		writeUpdate(cData);
// 	})
// 	.catch(function (error) {
// 		console.log(error);
// 	});
// }

// function updateCheck () {
//     fs.readFile('json/data.json', 'utf-8', function(err, data) {
//         if (err) throw err
//         var cData = JSON.parse(data)
//         lastUpdate = cData.lastUpdated
//         if ((Date.now() - lastUpdate) > 1000) {
// 			cData.lastUpdated = [];
// 			cData.pacspending = [];
// 			cData.lastUpdated.push(Date.now());
// 			callCOA(cData);
//         }
// 	});
// };

function writeFilePromise(writePath, textContent) {
	console.log('writeFilePromise')
	return new Promise((resolve, reject) => {
		fs.writeFile(writePath, textContent, (err) => {
			if (err)
				reject (err);
			else
				resolve();
		})
	})
}

async function checkForJSON() {
	const fileExists = fs.existsSync('json/data.json')
	if (!fileExists){
		await writeFilePromise('json/data.json', '{"lastUpdated":[],"pacspending":[]}')
	}
};
