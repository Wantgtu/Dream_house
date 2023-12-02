var parse_xlsx = require("./parse_xlsx");
var parse_lang = require("./parse_lang");
var file_util = require("./public/file_util");
var Path = require('path');
var moduleName = process.argv[2];
var data_path = process.argv[3];
var export_path = process.argv[4]
let copy_path = process.argv[5];
let deleteDir = process.argv[6];
var cur_path = process.cwd()


var test = function() {
	Editor.log(" test ")
}


var parseAll = function(moduleName, data_path, export_path, cur_path, copy_path, deleteDir) {
	// console.log(" exportPath ", export_path)
	// console.log(" data_path ", data_path)
	// console.log(" lang_path ", lang_path)
	// console.log(" json_path ", json_path)
	// console.log(" moduleName`11111 ", moduleName)
	// console.log(" export_path ", export_path)

	var lang_path = Path.join(export_path, 'lang')

	var json_path = Path.join(export_path, 'json')



	//创建目录
	var langFile = moduleName + "_lang_zh.json"
	if (deleteDir) {
		file_util.delDir(export_path);
	}
	file_util.mkdir(export_path);
	file_util.mkdir(json_path);
	file_util.mkdir(lang_path);
	// file_util.mkdir(ts_path);
	console.log(" moduleName2222 ", moduleName)
	parse_xlsx.init(cur_path)
	parse_xlsx.readDir(data_path, export_path);
	parse_lang(moduleName, export_path);
	// parse_ts(moduleName, export_path);
	console.log('copy_path  ===', copy_path, " json_path ", json_path, 'langFile', langFile)
	//将json文件复制到项目中
	if (copy_path) {
		file_util.createDir(copy_path)
		file_util.copyDir(json_path, copy_path)
		file_util.copy(Path.join(export_path, langFile), Path.join(copy_path, langFile))
	}
}



if (moduleName && data_path && export_path) {
	parseAll(moduleName, data_path, export_path, cur_path, copy_path, deleteDir);
}

module.exports.test = test;

module.exports.parseAll = parseAll;
