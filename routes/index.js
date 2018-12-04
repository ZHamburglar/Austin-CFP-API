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

const callAPI = async (x) => {
	return new Promise((resolve, reject) => {
		let response = []
		axios.get('https://data.austintexas.gov/resource/sf6w-qpmi.json?$limit=100&$offset=' + x)
		.then( function (response) {
			resolve(response.data);
		})
		.catch(function (error) {
			reject(error)
		});
	});
}

const readFilePromise = async (filepath) => {
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
	return new Promise((resolve, reject) => {
		fs.writeFile(writePath, textContent, (err) => {
			if (err)
				reject (err);
			else
				resolve();
		})
	})
}

//364
const foo = async (res) => {
	let currentJson = await readFilePromise(jsonPath)
	let cData = JSON.parse(currentJson)
	let lastUpdate = cData.lastUpdated
	if ((Date.now() - lastUpdate) > 10000) {
		let result = []
		let offset = 0
		console.log('result.length', result.length, (await callAPI(offset)).length)
		while ((await callAPI(offset)).length > 99 && offset < 1001){
			result = result.concat(await callAPI(offset))
			offset += 100;
		}
		// if the result.length is less than the increment then move on to the writeFilePromise
		let cData = {"lastUpdated":[Date.now()],"pacspending":result}
		await writeFilePromise(jsonPath, JSON.stringify(cData))
		await sendJson(res)
	} else {
		await sendJson(res)
	}
}

const bar = async (res) => {
	let result = await callAPI(0)
	let cData = {"lastUpdated":[Date.now()],"pacspending":result}
	await writeFilePromise(jsonPath, JSON.stringify(cData))
	await sendJson(res)
}

module.exports = router;
