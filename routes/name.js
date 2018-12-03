var express = require('express');
const fs = require('fs');
const util = require('util');

var router = express.Router();

const readFile = util.promisify(fs.readFile);

const jsonPath = 'json/data.json'

router.get('/:name', function(req, res, next) {
	let name = req.params.name
	searchNames(res, name);
});

const getName = (obj, key, val) => {
	// console.log('get names', obj, key, val)
	var objects = [];
    for (var i in obj) {
		// console.log('i', i)
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
			console.log('here 1')

            objects = objects.concat(getName(obj[i], key, val));    
        } else 
        //if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
        if (i == key && obj[i] == val || i == key && val == '') {
			console.log('here 2', i, key, obj[i], val)

            objects.push(obj);
        } else if (obj[i] == val && key == ''){
			console.log('here 3')

            //only add if the object is not already in the array
            if (objects.lastIndexOf(obj) == -1){
                objects.push(obj);
            }
        }
	}
    return objects;
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




const searchNames = async (res, name) => {
	let results = await readFilePromise(jsonPath);
	let result = JSON.parse(results)
	let names = getName(result.pacspending,'payment_amount','100')
	// let names = getName(result.pacspending,'payee','Rick')
	console.log("name", names)
	// console.log(getName(result.pacspending,'payment_amount','100'))
	res.send('respond with a resources');
}

module.exports = router;