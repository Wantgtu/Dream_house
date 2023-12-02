/**
 * 1. 从根节点的子节点开始遍历
 * 2. 子节点带有脚本的就不用处理了。
 */
var fs = require('fs');
var path = require('path');
var file_util = require('./file_util');
var constData
var propertyS = '@property({type: %type%, displayName: "%tips%"})'

var propertySList = '@property({type: [%type%], displayName: "%tips%"})'

var propertyB = '%name%: %type% = null;\n\t'
var propertyBList = '%name%: %type%[] = [];\n\t'

var IMPORT = '%import%'
var judgeComp = 'if(!this.%name%){this.%name% = this.findChild("%nodeName%").getComponent(%type%)}'
var judgeNode = 'if(!this.%name%){this.%name% = this.findChild("%nodeName%")}'
var res_path = process.argv[2]

var export_dir = process.argv[3]

var _project_path = process.argv[4]

var _cur_path = process.cwd()


var importMap = {}
var propertyMap = {}

var _libraryFolder = null;
var template = null;
var _exportFileName = null;
//解析预制体文件
function parsePrefab(jsonObj, content) {
	// console.log(' jsonObj length ', jsonObj.length)
	let obj = {}
	obj.name = jsonObj[1]._name;
	obj.info = ''
	obj.init = ''
	obj.func = ''
	obj.impt = ''
	var children = jsonObj[1]._children
	console.log(' children count ', children.length)
	for (var i = 0; i < children.length; i++) {
		parseNode(children[i], jsonObj, obj, content)
	}
	return obj;
}
//获得属性声明格式
function getProperty(name, type, defaultValue) {
	let out = ''
	let property = ''
	let isList = name.indexOf(constData.LIST) >= 0;
	if (isList) {
		name = name.replace(constData.LIST, '')
		if (propertyMap[name]) {
			return out;
		}
		property = propertySList.replace('%tips%', name)
		property = property.replace('%type%', type)

		// property = property.replace('%tips%', name)
		out += property + '\n\t'
		propertyMap[name] = 1;

		let pb = propertyBList.replace(/%name%/i, name)
		pb = pb.replace('%type%', type)
		out += pb;

		return out + '\n\t';
	} else {
		name = name.replace(constData.TAG, '')
		property = propertyS.replace('%displayName%', name)
		property = property.replace('%type%', type)
		property = property.replace('%tips%', name)
		// property = property.replace('%default%', defaultValue)
		out += property + '\n\t'
		let pb = propertyB.replace(/%name%/i, name)
		pb = pb.replace('%type%', type)
		out += pb;
		return out + '\n\t';
	}




}
//解析节点
function parseNode(indexObj, list, obj, content) {
	var node = list[indexObj.__id__]

	parseComponent(node, list, obj, content)

	if (getScript(node, list) == null) {
		var children = node._children
		for (var i = 0; i < children.length; i++) {
			parseNode(children[i], list, obj, content)
		}
	}

	// if (node.__type__ == 'cc.Node') {

	// }

}
//是否挂有脚本
function getScript(node, list) {
	if (node._components) {
		for (var i = 0; i < node._components.length; i++) {
			let cIndex = node._components[i].__id__
			// console.log('  _components cIndex ', cIndex)
			let c = list[cIndex]
			if (!c) {
				console.log('  c is null cIndex ', cIndex)
				continue;
			}
			if (c.__type__.length > 20) { //是脚本 如果挂了多个都加上
				return c;
			}

		}
	}
	return null;
}
//解析组件
function parseComponent(node, list, obj, content) {
	let nodeName = node._name;
	console.log('parseComponent nodeName ', nodeName)


	if (constData.TAG && nodeName.indexOf(constData.TAG) < 0 && constData.LIST && nodeName.indexOf(constData.LIST) < 0) {
		return;
	}
	if (nodeName.indexOf('-') >= 0 || nodeName.indexOf(' ') >= 0) {
		nodeName = nodeName.replace(/-/g, '')
		nodeName = nodeName.replace(/ /g, '')
	}
	// var isList = nodeName.indexOf(constData.LIST) >= 0;

	var temp = {}
	var parsed = false;
	if (node._components) {
		for (var i = 0; i < node._components.length; i++) {
			let cIndex = node._components[i].__id__
			// console.log('  _components cIndex ', cIndex)
			let c = list[cIndex]
			if (!c) {
				console.log('  c is null cIndex ', cIndex)
				continue;
			}
			let type = c.__type__;
			if (constData.NORMAL_COMP_LIST.indexOf(type) >= 0) {
				let name = nodeName + type.split('.')[1]
				// let name = nodeName + type.split('.')[1]
				// console.log('Label Sprite  name ', name)
				parsed = true;

				setProperty(obj, name, type, content)

			} else if (type.length > 20) { //是脚本 如果挂了多个都加上


				let content = file_util.findFileByContent(_libraryFolder, type, 'cc._RF.push(module')
				console.log(' type ', type, ' content ', content)
				if (content) {
					//cc._RF.push(module, 'dc933YdqsxGSYipLZNDjBSI', 'TestView');
					let head = 'cc._RF.push(module, '
					let ss = content.substring(content.indexOf(head) + head.length, content.indexOf(');'));
					ss = ss.trim()
					// console.log('ss  ',ss)
					let result = ss.split(',')

					let realType = result[1] //类名 如LoginView

					realType = realType.replace(/'/g, '')
					realType = realType.trim()
					console.log(' realType ', realType)
					// let sss = 'Script/'
					if (!importMap[type]) {
						let type_path = content.substring(content.indexOf('//') + 2, content.indexOf('.ts'))
						type_path = type_path.trim()
						type_path = type_path.substring(0, type_path.lastIndexOf('/'))
						// type_path = type_path.replace(sss,'')
						// type_path = 'assets' + path.sep + type_path
						// console.log(' type_path ', type_path)
						let filePath = _exportFileName.replace(_project_path, '')
						console.log(' filePath 1111', filePath)
						filePath = filePath.replace('assets/', '')
						filePath = filePath.substring(0, filePath.lastIndexOf('/'))
						// console.log(' filePath ', filePath)
						let imp = file_util.getRelativePath(filePath, type_path)
						console.log(' filePath imp ', imp)
						imp = 'import ' + realType + ' from ' + '"' + imp + realType + '"'
						console.log(' imp ', imp)
						obj.impt += imp + '\n';
						importMap[type] = 1;
					}
					let name = nodeName + realType

					setProperty(obj, name, realType, content)
					// parsed = true;


					parsed = true;
				}
			}
		}
	}
	if (!parsed) {
		let type = node.__type__;
		let name = nodeName + type.split('.')[1]

		setProperty(obj, name, type, nodeName, judgeNode)

	}

}



function setProperty(obj, name, type, content) {
	var property = name;
	if (property.indexOf(constData.LIST) >= 0) {
		property = property.replace(constData.LIST, '')
	} else {
		property = property.replace(constData.TAG, '')
	}
	if (!content || content.indexOf(property) < 0) {

		obj.info += getProperty(name, type, null)

		if (type == 'cc.Button') {

			let funcName = 'on' + property + 'Click'
			if (obj.func.indexOf(funcName) < 0) {
				obj.init += 'this.registerButtonByNode(this.' + property + ',this.' + funcName + ')\n\t\t\n\t\t'
				obj.func += funcName + '(){\n\t\n\t}\n\t\n\t'
			}

		}

	}

	// let verble = judgeS.replace(/%name%/ig, name)
	// verble = verble.replace('%type%', type)
	// verble = verble.replace('%nodeName%', nodeName)
	// obj.init += verble + '\n\t\t\n\t\t'
}

//解析整个目录
function parseDir(res_path, export_dir) {
	file_util.createDir(export_dir)
	// console.log(" res_path, export_dir ", res_path, export_dir)
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
		subpath = file_util.join(res_path, subpaths[i])
		stat = fs.statSync(subpath);
		if (stat.isFile() && subpath.indexOf('.prefab') >= 0 && subpath.indexOf('.meta') < 0) {
			parseFile(subpath, export_dir)
		} else if (stat.isDirectory()) {
			var temp = subpath.replace(res_path, '')
			parseDir(subpath, file_util.join(export_dir, temp))
		}
	}
}

function getConcat(str, index, content) {
	let head = str.substring(0, index)
	let tail = str.substring(index)
	return head.concat(content, tail)
}

//解析单个文件
function parseFile(res_path, export_dir) {
	importMap = {}
	propertyMap = {}
	var fileData = file_util.readFile(res_path);
	var fileName = path.basename(res_path).replace('.prefab', '')

	if (fileData) {
		_exportFileName = file_util.join(export_dir, fileName)
		var fName = _exportFileName + '.ts'
		var content = file_util.readFile(fName)
		var jsonObj = JSON.parse(fileData);
		var obj = parsePrefab(jsonObj, content)
		let exportData = null;
		if (content) {
			exportData = content;
			if (obj.info) {
				let index = exportData.indexOf('onLoad()')
				exportData = getConcat(exportData, index, obj.info)
				let tail = exportData.lastIndexOf('}')
				exportData = getConcat(exportData, tail, obj.func)
			}

		} else {
			exportData = template.replace('%info%', obj.info)
			exportData = exportData.replace('%init%', obj.init)
			exportData = exportData.replace('%function%', obj.func)
			exportData = exportData.replace('%ClassName%', fileName)
			exportData = exportData.replace('%SuperClass%', constData.SUPER_CLASS)
			exportData = exportData.replace(IMPORT, obj.impt)
		}

		file_util.writeFile(fName, exportData);
	} else {
	}

}

function refresh() {
	constData = JSON.parse(file_util.readFile(_cur_path + '/code_generator_config.json'));
	constData.NORMAL_COMP_LIST = constData.NORMAL_COMP_LIST.split(',')
}

function init(project_path, cur_path) {
	_project_path = project_path
	_cur_path = cur_path
	_libraryFolder = _project_path + '/library/imports'
	var templateFile = _cur_path + '/templates/creator_template.txt'
	template = file_util.readFile(templateFile);
}


// if (res_path && export_dir && _project_path) {

// 	res_path = res_path.replace(/\\/g, '/')
// 	export_dir = export_dir.replace(/\\/g, '/')
// 	_project_path = _project_path.replace(/\\/g, '/')
// 	_cur_path = _cur_path.replace(/\\/g, '/')

// 	init(_project_path, _cur_path)
// 	refresh();
// 	var stat = fs.statSync(res_path);
// 	if (stat.isFile() && res_path.indexOf('.prefab') >= 0) {
// 		file_util.createDir(export_dir)
// 		parseFile(res_path, export_dir)
// 	} else {
// 		res_path = file_util.removeTail(res_path)
// 		export_dir = file_util.removeTail(export_dir)
// 		_project_path = file_util.removeTail(_project_path)
// 		_cur_path = file_util.removeTail(_cur_path)
// 		parseDir(res_path, export_dir)
// 	}
// }




module.exports.init = init;
module.exports.parseDir = parseDir;
module.exports.parseFile = parseFile;
module.exports.refresh = refresh;
