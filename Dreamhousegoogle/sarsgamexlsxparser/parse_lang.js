var fs = require('fs');
var path = require('path');
var file_util = require('./public/file_util');
var coder = require('./public/coder')
var TEXT = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890 "!`?.,;:()[]{}<>|/@\^$-%+=#_&~*'

function readDir(moduleName, export_dir) {
	var res_path = path.join(export_dir, 'lang')
	var langObj = {};
	langObj["data"] = {};
	langObj["type"] = 2;
	var stat = fs.statSync(res_path);
	if (!stat.isDirectory()) {
		return;
	}
	var subpaths = fs.readdirSync(res_path),
		subpath;
	for (var i = 0; i < subpaths.length; ++i) {
		if (subpaths[i][0] === '.') {
			continue;
		}
		subpath = path.join(res_path, subpaths[i]);
		stat = fs.statSync(subpath);
		if (stat.isFile()) {
			// Size in Bytes
			// console.log(" subpath ", subpath);
			var fileData = file_util.readFile(subpath);
			if (fileData) {
				var jsonObj = JSON.parse(fileData);
				for (var key in jsonObj) {
					// console.log(' key ',key,' value ',jsonObj[key]);
					langObj["data"][key] = jsonObj[key];
				}
			}
			// console.log(" fileData ",fileData);
		}
	}
	let datas = langObj["data"];
	let textMap = {}
	let exports = '\uFEFF'
	for (let i = 0; i < TEXT.length; i++) {
		textMap[TEXT[i]] = TEXT[i];
	}
	for (var key in datas) {
		// console.log(' key ',key,' value ',jsonObj[key]);
		let ss = datas[key];
		for (let i = 0; i < ss.length; i++) {
			textMap[ss[i]] = ss[i];
		}

	}
	for (var key in textMap) {
		exports += textMap[key]
	}
	file_util.writeFile(path.join(export_dir, moduleName + '_font.txt'), exports);
	file_util.writeFile(path.join(export_dir, moduleName + '_lang_zh.json'), JSON.stringify(coder.pack(langObj, 0)));
}

module.exports = readDir
