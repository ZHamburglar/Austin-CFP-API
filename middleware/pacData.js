const express = require('express');
const axios = require('axios');
const util = require('util');
const path = require('path');
const fs = require('fs');

const existsSync = util.promisify(fs.existsSync);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const jsonPath = 'json/data.json'

module.exports = function(){
	checkForJSON(jsonPath)
		.then(updateCheck(jsonPath))
		.catch(handleErrors)
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

function handleErrors(error) {
	console.log('Error: ', error)
}

function readFilePromise(filepath) {
	console.log('readFilePromise')
	return new Promise((resolve, reject) => {
        fs.readFile(filepath, function(err, data) {
			if (err)
				reject (err);
			else
				resolve(data);
		})
	})
}

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

async function updateCheck (jsonPath) {
	let current = await readFilePromise(jsonPath)
	let cData = JSON.parse(current)
	lastUpdate = cData.lastUpdated
	if ((Date.now() - lastUpdate) > 1000) {
		cData.lastUpdated = [];
		cData.pacspending = [];
		cData.lastUpdated.push(Date.now());
		console.log('update check function', jsonPath, cData)
		await writeFilePromise(jsonPath, JSON.stringify(cData))
	}
};

async function checkForJSON(jsonPath) {
	const fileExists = fs.existsSync(jsonPath)
	if (!fileExists){
		await writeFilePromise(jsonPath, '{"lastUpdated":[],"pacspending":[]}')
	}
};
