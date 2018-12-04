const express = require('express');
const fs = require('fs');
const moment = require ('moment');

var router = express.Router();

// Middlewares
// var checkUpdate = require('../middleware/checkUpdate');

// Local Paths
const jsonPath = 'json/data.json';

router.get('/:name', async (req, res, next) => {
	let name = req.params.name;
	searchNames(res, name);
});

const getName = (obj, key, val) => {
	
	var objects = [];
	for (var i in obj) {
		if (!obj.hasOwnProperty(i)) continue;
		// This splits up the objects in the JSON into lower levels
		if (typeof obj[i] == 'object') {
			objects = objects.concat(getName(obj[i], key, val));   
		// Once JSON is split, search through each key-value pair 
		} else if (typeof obj[i] !== 'object') {
			//if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
			var regex = new RegExp('' + val + '', 'i');
			// at this point, the line above is the same as: var regex = /${val}/i;

			if (i == key && val == '') {
				objects.push(obj);
			}
			else if (i == key && obj[i].search(regex) != -1) {
				let newObj;
				newObj = Object.assign({});
				newObj.date_reported = moment(obj.date_reported).format('MM-DD-YYYY');
				newObj.expenditure_type = obj.expenditure_type;
				newObj.expense_description = obj.expense_description;
				newObj.paid_by = obj.paid_by;
				newObj.payee = obj.payee;
				newObj.payee_address = obj.payee_address + ', ' + obj.city_state_zip;
				newObj.payee_type = obj.payee_type;
				newObj.payment_amount = obj.payment_amount;
				newObj.payment_date = moment(obj.payment_date).format('MM-DD-YYYY');
				newObj.view_report = obj.view_report;
				objects.push(newObj);
			} else if (obj[i] == val && key == ''){	
				//only add if the object is not already in the array
				if (objects.lastIndexOf(obj) == -1){
					objects.push(obj);
				}
			}
		}
	}
	return objects;
};

const readFilePromise = async (filepath) => {
	return new Promise((resolve, reject) => {
		fs.readFile(filepath, function(err, data) {
			if (err)
				reject (err);
			else
				resolve(data);
		});
	});
};

const searchNames = async (res, name) => {
	let results = await readFilePromise(jsonPath);
	let result = JSON.parse(results);
	let names = getName(result.pacspending, 'payee', name);
	res.send(names);
};

module.exports = router;