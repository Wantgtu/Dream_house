var fs = require('fs');
var path = require('path');
var file_util = require('./public/file_util');
var moduleName = process.argv[2];
var export_dir = process.argv[3]
var lang = process.argv[4];

function readFile(moduleName, export_dir, lang) {
	var inputFileName = path.join(export_dir, moduleName + '_lang_zh.json')
	var outputFileName = path.join(export_dir, moduleName + '_lang_' + lang + '.json')
	//console.log('outputFileName', outputFileName)
	if (fs.existsSync(inputFileName)) {
		var fileString = file_util.readFile(inputFileName);
		var inputObj = JSON.parse(fileString)
		var exportObj = {}
		if (fs.existsSync(outputFileName)) {
			var exportString = file_util.readFile(outputFileName);
			exportObj = JSON.parse(exportString)
		}
		//console.log('exportObj', exportObj)
		copyContent(exportObj, inputObj)
		let flieName = path.join(export_dir, moduleName + '_lang_' + lang + '.json')
		file_util.writeFile(flieName, JSON.stringify(exportObj));
	} else {
		console.log('not find ', inputFileName)
	}

}

function copyContent(outputObj, inputObj) {
	for (let key in inputObj) {
		let value = inputObj[key]
		//console.log('typeof value ',typeof value)
		if (typeof value == 'object') {
			if (!outputObj[key]) {
				outputObj[key] = {}
			}
			//console.log('copyContent[key] ', key, outputObj[key])
			copyContent(outputObj[key], value)
		} else {
			//console.log('outputObj[key] ', key, outputObj[key])
			if (!outputObj[key]) {
				outputObj[key] = inputObj[key]
			}
		}
	}
}

readFile(moduleName, export_dir, lang)
