const express = require('express');
const axios = require('axios');
const util = require('util');
const path = require('path');
const fs = require('fs');

const existsSync = util.promisify(fs.existsSync);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

var router = express.Router();

// Local Paths
var pacData = require('../middleware/pacData');

const jsonPath = 'json/data.json'

router.get('/', function(req, res, next) {
	const fileExists = fs.existsSync(jsonPath)
	if (!fileExists){
		// If file doesn't exist run this.
		bar(res);
	} else {
		// If file exists run this.
		foo(res);
	}
});

const sendJson = async (res) => {
	var filePath = './json/data.json';
	var resolvedPath = path.resolve(filePath);
	res.sendFile(resolvedPath);
}

const callAPI = async () => {
	return new Promise((resolve, reject) => {
		axios.get('https://data.austintexas.gov/resource/sf6w-qpmi.json?$limit=5&$offset=25000')
		.then(function (response) {
			console.log('API call 1', response.data.length)
			resolve(response.data)
		})
		.catch(function (error) {
			console.log("error!", error);
			reject(error)
		});
	});
}

const readFilePromise = async (filepath) => {
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

const writeFilePromise = async (writePath, textContent) => {
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

const foo = async (res) => {
	let currentJson = await readFilePromise(jsonPath)
	let cData = JSON.parse(currentJson)
	let lastUpdate = cData.lastUpdated
	if ((Date.now() - lastUpdate) > 10000) {
		console.log('File exists. Updating')
		let result = await callAPI()
		let cData = {"lastUpdated":[Date.now()],"pacspending":result}
		await writeFilePromise(jsonPath, JSON.stringify(cData))
		await sendJson(res)
	} else {
		console.log('File exists. Not updating')
		await sendJson(res)
	}
}

const bar = async (res) => {
	console.log('file being created. bar.')
	let result = await callAPI()
	let cData = {"lastUpdated":[Date.now()],"pacspending":result}
	await writeFilePromise(jsonPath, JSON.stringify(cData))
	await sendJson(res)
}

module.exports = router;
