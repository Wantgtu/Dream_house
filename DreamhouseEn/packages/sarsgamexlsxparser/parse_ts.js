var fs = require('fs');
var path = require('path');
var file_util = require('./public/file_util');

function readDir(moduleName,export_dir) {
	var moduleName = process.argv[2];
	var res_path   = export_dir + "ts/";		
	var exportObj = "";
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
				exportObj += fileData + '\n\r';
			}
		}
	}
	var moduleName = moduleName.substring(0, 1).toUpperCase() + moduleName.substring(1);
	file_util.writeFile(export_dir+moduleName+'EnumConfig.ts', exportObj);
}

module.exports = readDir
