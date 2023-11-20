var xlsx = require("node-xlsx");
var fs = require('fs');
var file_util = require('./public/file_util');
var path = require('path');
var coder = require('./public/coder')
var fileName = process.argv[2];

//if(fileName){
//var export_dir = "./";
//parseFile(fileName,export_dir);
//}
//表头列说明序号
const NAME = 0; //数据表名称
const VALUE = 0;
const MGR_NAME = 1; //模块名称
const IS_EXPORT_ID = 2; //是否导出ID
const LANG = 2;
const TEMPLATE = 1;
const DATA = 0;

const HEAD = 'head'
const INIT = 'init'
const FUNCTION = 'function'
const IMPORT = 'import'
// console.log(" fileName ",fileName);
var enums = "";
//语言表内容
var langObj = {};
// 索引表的内容


//每个key对应的索引值
var indexOfKey = {}
var template = ''
var managerTemplate = ''
var managerMap = {}

//解析Excel
function praseExcel(list, export_dir) {
	if (list.length <= 0) {
		return;
	}
	console.log("list.length ", list.length);

	var lang_path = path.join(export_dir, 'lang')
	var json_path = path.join(export_dir, 'json')
	//var ts_path = path.join(export_dir,'ts')
	var class_path = path.join(export_dir, 'class')
	//合并文件
	var bigObj = {};
	bigObj["data"] = {};
	var headConfig = list[0].data;
	console.log(" headconfig ", headConfig);

	var bigFileName = headConfig[NAME][VALUE];
	console.log("name is ", NAME, " value ", VALUE, " bigFileName ", bigFileName);
	for (var i = 1; i < list.length; i++) {
		if (!headConfig[i]) {
			continue;
		}
		var managerName = headConfig[i][MGR_NAME]
		console.log('manager name is ', managerName)
		if (managerName && !managerMap[managerName]) {
			managerMap[managerName] = {}
			managerMap[managerName][HEAD] = ''
			managerMap[managerName][INIT] = ''
			managerMap[managerName][FUNCTION] = ''
			managerMap[managerName][IMPORT] = ''
		}
		let export_path = class_path;
		if (managerName) {
			export_path = path.join(class_path, managerName)
		}
		let exportID = headConfig[i][IS_EXPORT_ID]
		
		console.log(' exportID ',exportID)
		//console.log('list[i] ',list[i])
		langObj = {};
		var indexObj = {};
		var result = {}; //每张表的导出内容
		var keys = {}; // id列表，对应内容的索引。
		var excleData = list[i].data;
		var dataArray = [];
		var nameArray = excleData[0]; // 第一行 说明
		var keyArray = excleData[1]; //第二行 名称
		var typeArray = excleData[2]; // 第三行 类型
		var scArray = excleData[3]; // 第四行 导出类别 s 服务器  c 客户端 sc 服务器与客户端。
		var index = 0;

		var sheetName = headConfig[i][VALUE];
		console.log(" i ", i, " sheetname", sheetName);
		var enumName = sheetName.substring(0, 1).toUpperCase() + sheetName.substring(1);

		var enumObj = "export enum " + enumName + "Enum{\n\t%{data}\n}";
		var enums = "";
		var keyIndex = 0;
		var nameList = []
		var typeList = []
		var dbList = []
		for (var k = 1; k < keyArray.length; k++) {
			if (typeArray[k] != 'null') {
				var key = keyArray[k];
				enums += key + ",// " + nameArray[k] + "\n\t";
				nameList[keyIndex] = key
				typeList[keyIndex] = typeArray[k]
				dbList[keyIndex] = scArray[k]
				indexOfKey[key] = keyIndex++
			}
		}

		enumObj = enumObj.replace('%{data}', enums);

		for (var j = 4; j < excleData.length; j++) {
			var curData = excleData[j];
			if (curData.length == 0) continue;
			var item = changeObj(sheetName, curData, typeArray, keyArray, scArray, indexObj);
			keys[curData[0]] = index;
			index++;
			dataArray.push(item);
		}
		// index = 0;
		console.log('enumObj ', enumObj)

		if (dataArray.length > 0) {
			if (exportID) {
				exportClass(export_path, enumName, keyArray, typeArray, nameArray, list[i].name, enumObj, managerMap[managerName],scArray,exportID,keys)
			} else {
				exportClass(export_path, enumName, keyArray, typeArray, nameArray, list[i].name, enumObj, managerMap[managerName],scArray)
			}

			result["data"] = dataArray;
			result["key"] = keys;
			result["type"] = DATA;
			result['nameList'] = nameList
			result['typeList'] = typeList
			result['dbList'] = dbList
			if (indexObj) {
				result["index"] = indexObj;
			}
			// console.log("list[i].name",sheetName);
			if (!bigFileName || bigFileName == "null") { //如果不合并 直接导出
				var filename = path.join(json_path, sheetName + ".json");
				file_util.writeFile(filename, JSON.stringify(coder.pack(result, 1)));
			} else {
				bigObj["data"][sheetName] = result;
			}
			if (langObj) {
				file_util.writeFile(path.join(lang_path, sheetName + "_lang.json"), JSON.stringify(langObj));
			}
			//不用再导出枚举文件了，将枚举直接放到生成的类里边
			// file_util.writeFile(ts_path + enumName + "Enum.ts", enumObj);
		} else {
			console.log("内容为null ");
			console.log(' export file name ', json_path + sheetName + ".json")
		}



	}
	if (bigFileName && bigFileName != "null") {
		var filename = path.join(json_path, bigFileName + ".json");
		bigObj["type"] = TEMPLATE;
		let out = coder.pack(bigObj, 1)
		file_util.writeFile(filename, JSON.stringify(out));
	}
	//导出模型管理器
	for (var i = 1; i < list.length; i++) {
		if (!headConfig[i]) {
			continue;
		}
		var key = headConfig[i][MGR_NAME]
		let value = managerMap[key]
		let export_path = class_path;
		if (key) {
			export_path = path.join(class_path, key)
		}
		if (value) {
			let className = key.replace(key[0], key[0].toUpperCase()) + 'Mgr';
			let classObj = managerTemplate.replace(/%ClassName%/g, className)
			classObj = classObj.replace('%init%', value[INIT])
			classObj = classObj.replace('%head%', value[HEAD])
			classObj = classObj.replace('%function%', value[FUNCTION])
			classObj = classObj.replace('%import%', value[IMPORT])
			file_util.writeFile(path.join(export_path, className + ".ts"), classObj);
		}
	}

	console.log("qqq");
}

function exportClass(class_path, enumName, keyArray, typeArray, nameArray, sheetName, enumObj, manager,scArray,
	keysName, keys) {
	console.log(' class_path ', class_path)
	file_util.createDir(class_path)
	let className = enumName
	let classObj = template.replace('%ClassName%', className)
	classObj = classObj.replace('%ClassName%', className)
	classObj = classObj.replace('%ClassName%', className)
	classObj = classObj.replace('%SheetName%', sheetName)
	classObj = classObj.replace('%enum%', enumObj)
	let exportStr = ''
	for (var k = 1; k < keyArray.length; k++) {
		if (typeArray[k] != 'null') {
			var key = "// " + nameArray[k] + "\n\t"; //说明
			let funcName = keyArray[k].substring(0, 1).toUpperCase() + keyArray[k].substring(1);
			key += 'get' + funcName + "() {\n\t\t"; //getkeyArray[k](){
			key += 'return this.getValue(' + enumName + 'Enum.' + keyArray[k] + ')\n\t';
			key += '}\n\t'
			exportStr += key;
			if(scArray[k]){
				key = ''
				key += 'set' + funcName + "(v:any) {\n\t\t"; //getkeyArray[k](){
				key += 'this.setValue(' + enumName + 'Enum.' + keyArray[k] + ',v)\n\t';
				key += '}\n\t'
				exportStr += key;
			}
			
			
		}
	}
	classObj = classObj.replace('%function%', exportStr)
	if (keysName) {
		var enumObj = "export class " + keysName + "{\n\t%{data}\n}";
		var enums = "";
		for (let key in keys) {
			enums += 'static ' + keysName+ key+' = '+ key+'\n\t'
		}
		enumObj = enumObj.replace('%{data}', enums);
		classObj = classObj.replace('%classid%', enumObj)
	}else{
		classObj = classObj.replace('%classid%', '')
	}
	
	file_util.writeFile(path.join(class_path, className + ".ts"), classObj);
	//整合模型管理器信息
	if (manager) {
		var lowName = className.replace(className[0], className[0].toLowerCase());
		var proName = lowName + 'Mgr'
		manager[IMPORT] += 'import ' + className + ' from "./' + className + '";'
		var head = 'protected ' + proName + ': ModelManager<' + className + '> = new ModelManager()'
		manager[HEAD] += head + '\n\t';
		var init = 'this.' + proName + '.initWithData(ModuleManager.dataManager.get(' + className + '.CLASS_NAME), ' +
			className + ')'
		manager[INIT] += init + '\n\t\t';
		manager[FUNCTION] += 'get' + className + '(id){ return this.' + proName + '.getByID(id)}\n\t\n\t'
		manager[FUNCTION] += 'get' + className + 'List(){ return this.' + proName + '.getList()}\n\t\n\t'
	}
}
//转换数据类型
function changeObj(sheetName, curData, typeArray, keyArray, scArray, indexObj) {
	var id = curData[0];
	var obj = [];
	for (var i = 1; i < curData.length; i++) {
		// console.log("data "+curData[i]+" type "+typeArray[i]+" key "+keyArray[i]+" sc "+scArray[i]);
		//字母 
		if (typeArray[i] != 'null') {
			obj.push(changeValue(curData[i], typeArray[i], sheetName, id, keyArray[i], i - 1, indexObj));
		}

	}
	return obj;
}

function changeValue(value, type, sheetName, id, key, index, indexObj) {

	//console.log(" type ",type," value ",value,' sheetName ',sheetName,' index ',index);
	var start = type.indexOf('[');
	if (start >= 0) {
		if (value == null || value == "null" || value == "") return [];
		value = "" + value;
		var end = type.indexOf(']', type.length - 1);
		var t = type.substring(start + 1, end);
		// console.log(" end ",end," start ",start," t ",t);
		if (type.indexOf('[[') >= 0) {
			var list1 = value.split('|');
			var temp1 = [];
			for (var i = 0; i < list1.length; i++) {
				temp1.push(changeValue(list1[i], t, sheetName, id, key, index));
			}
			return temp1;
		} else {
			var list2 = value.split(',');
			var temp2 = [];
			var t2 = type.substring(start + 1, end);
			for (var i = 0; i < list2.length; i++) {
				temp2.push(changeValue(list2[i], t2, sheetName, id, key));
			}
			return temp2;
		}
	} else {
		switch (type) {
			case 'n':
				if (value == null || value == "null") return 0;
				let v = new Number(value)
				return v
			case 'i':
				if (value == null || value == "null") return 0;
				return parseInt(value);
			case 'f':
				if (value == null || value == "null") return 0.0;
				return parseFloat(value);
			case 's':
				if (value == null || value == "null") return "";
				return value;
			case 'lang': // 根据文件名key 和列名 生成ID并返回生成的ID
				if (value == null || value == "null") return "";
				var langID = sheetName + "_" + key + "_" + id;
				langObj[langID] = value;
				return langID;
			case 'index':
				var idx = indexOfKey[key]
				if (!indexObj[idx]) {
					indexObj[idx] = {}
				}
				if (value >= 0) {
					if (!indexObj[idx][value]) {
						indexObj[idx][value] = []
					}
					//console.log("index  value ",value,' id ',id)
					indexObj[idx][value].push(id);
					return parseInt(value);
				}
				return 0;
			case 'any':
				return value;
			case 'null':
				return ""

		}

	}

	return "";
}

var ignoreFileList = ['脚本数据', 'test']
// 加密算法可以公开  
function encrypt(plainText, key) {
	return plainText ^ key;
}

// 解密算法也可以公开  
function decrypt(cipherText, key) {
	return cipherText ^ key;
}

function parseFile(fileName, exportPath) {
	console.log("parseFile  fileName ", fileName)
	for (var i = 0; i < ignoreFileList.length; i++) {
		if (fileName.indexOf(ignoreFileList[i]) >= 0) {
			return;
		}
	}
	praseExcel(xlsx.parse(fileName), exportPath);
}


function readDir(dir, exportPath) {

	console.log(' readDir ===================')
	var stat = fs.statSync(dir);
	if (!stat.isDirectory()) {
		return;
	}
	var subpaths = fs.readdirSync(dir),
		subpath;
	for (var i = 0; i < subpaths.length; ++i) {
		if (subpaths[i][0] === '.') {
			continue;
		}
		subpath = path.join(dir, subpaths[i]);
		console.log(' readDir   subpath ', subpath)
		stat = fs.statSync(subpath);
		if (stat.isDirectory()) {
			// readDir(subpath, obj);
		} else if (stat.isFile()) {
			// Size in Bytes
			// console.log(" subpath ",subpath);
			parseFile(subpath, exportPath);
		}
	}
}

function init(cur_path) {
	var temp = path.join(cur_path, 'template', 'class.ts')
	console.log(' temp ', temp)
	template = file_util.readFile(temp);
	var manager = path.join(cur_path, 'template', 'manager.ts')
	managerTemplate = file_util.readFile(manager)
}
var test = function() {
	Editor.log(" test ")
}

module.exports.test = test
module.exports.init = init
module.exports.readDir = readDir
