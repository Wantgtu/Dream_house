var fs = require('fs');
var path = require('path');
var file_util = require('./file_util');
var NAME = '%name%'
var FUNC_NAME = '%funcName%'
var TYPE = '%type%'
var TS_FILE_NAME = '%TSFileName%'
var PREFAB_FILE_NAME = '%PrefabFileName%'
var propertyS = '/** @prop {name:%name%, tips:"%tips%", type:%type%, default:%default%}*/'
var CLASS_NAME = '%ClassName%'
var propertyB = 'public %name%: Laya.%type% = null;'
//如果属性为无效值，使用代码赋值
var judgeS = 'if(!this.%name%){this.%name% = this.findChild("%name%")}'
//属性名称中有用TAG的才会被导出，如果TAG无效，只要名称有效的都导出
var TAG = ''
var autoBinding = 1;

var funcInit = 'this.registerButtonByNode(this.%name%,this.%funcName%)'
var res_path = process.argv[2]
var export_dir = process.argv[3]
var project_path = process.argv[4]

var cur_path = process.cwd()

//将\\分隔符转换为/
res_path = res_path.replace(/\\/g, '/')
export_dir = export_dir.replace(/\\/g, '/')
project_path = project_path.replace(/\\/g, '/')
cur_path = cur_path.replace(/\\/g, '/')
//去掉目录最后的/
res_path = file_util.removeTail(res_path)
export_dir = file_util.removeTail(export_dir)
project_path = file_util.removeTail(project_path)
cur_path = file_util.removeTail(cur_path)


//代码生成相关
var templateFile = cur_path + '/templates/laya_template.txt'
var template = file_util.readFile(templateFile);
//自动绑定相关
var scriptFile = cur_path + '/templates/laya_prefab.txt'
var scriptS = file_util.readFile(scriptFile);
var scriptObject = null;
var scriptId = 0;
// 索引位置加1
var presetID = 0;
//解析预制体文件
function parsePrefab(jsonObj) {
	let obj = {}
	obj.name = jsonObj.label;
	obj.info = ''
	obj.init = ''
	obj.func = ''
	for (var i = 0; i < jsonObj.child.length; i++) {
		parseNode(jsonObj.child[i], obj)
	}

	return obj;
}

//获得属性声明格式
function getProperty(name, type, defaultValue) {
	let out = ''
	let property = propertyS.replace(NAME, name)
	property = property.replace(TYPE, 'Node')
	property = property.replace('%tips%', name)
	property = property.replace('%default%', defaultValue)
	out += property + '\n\t'
	let pb = propertyB.replace(/%name%/i, name)
	pb = pb.replace(TYPE, type)
	out += pb;
	return out;
}
//解析节点
function parseNode(node, obj) {
	parseComponent(node, obj)

	if (!node.child || node.type == "View") {
		return;
	}
	for (var i = 0; i < node.child.length; i++) {
		var c = node.child[i]
		parseNode(c, obj)
	}
}
//解析组件
function parseComponent(c, obj) {
	let nodeName = c.label
	console.log(' nodeName ', nodeName)
	if (TAG && nodeName.indexOf(TAG) < 0 ||
		nodeName == 'start' ||
		nodeName.indexOf(' ') >= 0 ||
		nodeName.indexOf('-') >= 0 ||
		nodeName.indexOf(')') >= 0) {
		return;
	}
	if (!nodeName) {
		return;
	}

	if (c.type == 'Button') {
		let name = nodeName;
		//console.log('name ',name,c)
		if (name) {
			obj.info += getProperty(name, c.type, null) + '\n\t'
			// let verble = judgeS.replace(/%name%/ig, name)
			// obj.init += verble + '\n\t\t\n\t\t'
			let funcName = 'on' + name + 'Click'
			let temp = funcInit.replace(NAME, name)
			temp = temp.replace(FUNC_NAME, funcName)
			obj.init += temp + '\n\t\t\n\t\t'
			obj.func += funcName + '(){\n\t\n\t}\n\t\n\t'
			if (c.compId > scriptId) {
				scriptId = c.compId;
			}
			scriptObject.props[nodeName] = "@node:" + c.compId
		}
	} else if (c.type == 'Label' || c.type == 'Image' || c.type == "Panel" || c.type == "View") {
		let name = nodeName;
		//console.log('name ',name,c)
		if (name) {
			obj.info += getProperty(name, c.type, null) + '\n\t'
			// let verble = judgeS.replace(/%name%/ig, name)
			// obj.init += verble + '\n\t\t\n\t\t'
			scriptObject.props[nodeName] = "@node:" + c.compId
		}
	}
}

//解析整个目录
function parseDir(res_path, export_dir) {
	file_util.createDir(export_dir)
	console.log(" res_path, export_dir ", res_path, export_dir)
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
		subpath = res_path + '/' + subpaths[i];
		stat = fs.statSync(subpath);
		//console.log(" subpath ", subpath);
		if (stat.isFile() && subpath.indexOf('.prefab') >= 0) {
			parseFile(subpath, export_dir)
		} else if (stat.isDirectory()) {
			var temp = subpath.replace(res_path, '')
			parseDir(subpath, export_dir + '/' + temp)
		}
	}
}
//设置脚本的自动绑定部分参数
function setScriptObject(prefabObject, className) {
	for (var i = 0; i < prefabObject.child.length; i++) {
		let c = prefabObject.child[i]
		if (c.type == "Script" && c.label == className) {
			scriptObject = c;
			scriptObject.props = {}
			scriptObject.props.presetID = i + 1;
			return;
		}
	}
	scriptObject = JSON.parse(scriptS)
}

//解析单个文件
function parseFile(res_path, export_dir) {

	var fileData = file_util.readFile(res_path);
	var fileName = path.basename(res_path).replace('.prefab', '')
	if (fileData) {
		scriptObject = JSON.parse(scriptS)

		scriptId = 0


		var jsonObj = JSON.parse(fileData);

		setScriptObject(jsonObj, fileName)


		scriptObject.nodeParent = jsonObj.compId;
		scriptObject.label = fileName;
		scriptObject.searchKey = "Script," + fileName;
		var obj = parsePrefab(jsonObj)
		console.log(" fileName ", fileName);
		let exportData = template.replace('%info%', obj.info)
		exportData = exportData.replace('%init%', obj.init)
		exportData = exportData.replace('%function%', obj.func)
		exportData = exportData.replace(CLASS_NAME, fileName)
		//console.log('exportData ',exportData)
		var exportFileName = export_dir + '/' + fileName + '.ts'
		//设置自动绑定参数
		scriptObject.props.preset = getPath(res_path, project_path)
		let childLen = jsonObj.child.length
		if (!scriptObject.props.presetID) {
			scriptObject.props.presetID = childLen + 1;
		}
		scriptObject.source = getPath(exportFileName, project_path)
		if (!scriptObject.compId) {
			scriptObject.compId = jsonObj.child[childLen - 1].compId + 1
			jsonObj.child.push(scriptObject)
		}

		console.log(' scriptObject ', scriptObject)
		// 将脚本插入预制体文件
		//先判断是否有有整个脚本，如果有就替换，如果没有就添加

		file_util.writeFile(exportFileName, exportData);
		file_util.writeFile(res_path, JSON.stringify(jsonObj));

	}

}

function getPath(file_path, project_path) {
	let temp = file_path.replace(project_path, '')
	// temp = temp.replace(/\\/g, '/')
	if (temp[0] == '/') {
		temp = temp.substring(1)
	}
	return temp;
}

console.log('res_path,cur_path ', res_path, process.cwd())
if (res_path && export_dir) {
	var stat = fs.statSync(res_path);
	if (stat.isFile() && res_path.indexOf('.prefab') >= 0) {
		file_util.createDir(export_dir)
		parseFile(res_path, export_dir)
	} else {
		parseDir(res_path, export_dir)
	}


}
