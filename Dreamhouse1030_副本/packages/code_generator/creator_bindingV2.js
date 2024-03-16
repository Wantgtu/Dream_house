/**
 * 1. 从根节点的子节点开始遍历
 * 2. 子节点带有脚本的也处理了。
 */
var fs = require('fs');
var path = require('path');
var file_util = require('./file_util');
var constData
var res_path = process.argv[2]
var export_dir = process.argv[3]
var _project_path = process.argv[4]
var _cur_path = process.cwd();


var _prefabS = null;
var propertyMap = {}
var _libraryFolder = null;


//解析预制体文件
function parsePrefab(node, list, scriptObject) {
	parseComponent(node, list, scriptObject)
	var children = node._children
	for (var i = 0; i < children.length; i++) {
		parseNode(children[i], list, scriptObject)
	}
}
//解析节点
function parseNode(indexObj, list, scriptObject) {
	var node = list[indexObj.__id__]
	parseComponent(node, list, scriptObject)
	let script = getScript(node, list)
	if (!script) {
		var children = node._children
		for (var i = 0; i < children.length; i++) {
			parseNode(children[i], list, scriptObject)
		}
	} else {
		var children = node._children
		for (var i = 0; i < children.length; i++) {
			parseNode(children[i], list, script)
		}
	}
}

// }
//解析组件
function parseComponent(node, list, scriptObject) {
	let nodeName = node._name;

	if (!constData.TAG || !constData.LIST) {
		return;
	}
	// let name = ''
	var isList  = false;
	if (nodeName.indexOf(constData.TAG) >= 0) {
		nodeName = nodeName.replace(constData.TAG, '')
	} else if (nodeName.indexOf(constData.LIST) >= 0) {
		nodeName = nodeName.replace(constData.LIST, '')
		isList = true;
	} else {
		return;
	}
	if (nodeName.indexOf('-') >= 0 || nodeName.indexOf(' ') >= 0) {
		nodeName = nodeName.replace(/-/g, '')
		nodeName = nodeName.replace(/ /g, '')
	}
	// var isList = nodeName.indexOf(constData.LIST) >= 0;
	var parsed = false;
	let name = nodeName
	if (node._components && node._components.length > 0) {
		console.log(' node._components count ', node._components.length)
		for (var i = 0; i < node._components.length; i++) {
			let cIndex = node._components[i].__id__
			let c = list[cIndex]
			if (!c) {
				console.log('  c is null cIndex ', cIndex)
				continue;
			}
			let type = c.__type__;
			if (constData.NORMAL_COMP_LIST.indexOf(type) >= 0) {
				parsed = true;
				let name = nodeName + type.split('.')[1]
				//console.log('Label Sprite  name ', name)
				// if (name) {
				if (!isList) {
					scriptObject[name] = {}
					scriptObject[name]["__id__"] = cIndex
				} else {
					if (!propertyMap[name]) {
						scriptObject[name] = []
						propertyMap[name] = 1;
					}

					scriptObject[name].push({
						"__id__": cIndex
					})
				}
				// scriptObject[name] = {}
				// scriptObject[name]["__id__"] = cIndex
				console.log(' name  ', name, ' type ', type, ' cIndex ', cIndex)
				if (type == 'cc.Button') {
					let funcName = 'on' + name + 'Click'
					if (c.clickEvents.length > 0) {
						c.clickEvents.length = 0;
					}
					if (c.clickEvents.length == 0) {

						console.log(' funcName ', funcName)

						list.push({
							"__type__": "cc.ClickEvent",
							"target": {
								"__id__": scriptObject.node.__id__
							},
							"component": "",
							"_componentId": scriptObject.__type__,
							"handler": funcName,
							"customEventData": ""
						})
						let index = list.length - 1;
						c.clickEvents.push({
							"__id__": index
						})
						// rootComponent._prefab.__id__++;
					}
					//  else { //有可能脚本是新生成的，所以更新一下。
					// 	let eventIndex = c.clickEvents[0].__id__;
					// 	let eventData = list[eventIndex]
					// 	if (eventData) {
					// 		eventData._componentId = scriptObject.__type__
					// 		eventData.handler = funcName
					// 		eventData.target.__id__ = scriptObject.node.__id__
					// 	}

					// }
				}
				// }
			} else if (type.length > 20) { //是脚本 如果挂了多个都加上
				let content = file_util.findFileByContent(_libraryFolder, type, 'cc._RF.push(module')
				//console.log('cc._RF.push(module, type ',type)
				if (content) {
					parsed = true;
					let head = 'cc._RF.push(module, '
					let ss = content.substring(content.indexOf(head) + head.length, content.indexOf(');'));
					ss = ss.trim()
					let result = ss.split(',')
					let realType = result[1]
					realType = realType.replace(/'/g, '')
					realType = realType.trim()
					name = nodeName + realType
					if (!isList) {
						scriptObject[name] = {}
						scriptObject[name]["__id__"] = cIndex

					} else {
						if (!propertyMap[name]) {
							scriptObject[name] = []
							propertyMap[name] = 1;
						}

						scriptObject[name].push({
							"__id__": cIndex
						})
					}
					// parsePrefab(node, list, c)
				} else {
					console.log(' content is null type is ', type, ' nodeName is ', nodeName)
				}
			}
		}
	} else {

	}
	if (!parsed) {
		let type = node.__type__;
		let name = nodeName + type.split('.')[1]
		let cIndex = list.indexOf(node)
		if (!isList) {
			scriptObject[name] = {}
			scriptObject[name]["__id__"] = cIndex
		} else {
			if (!propertyMap[name]) {
				scriptObject[name] = []
				propertyMap[name] = 1;
			}

			scriptObject[name].push({
				"__id__": cIndex
			})
		}
	}

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
//设置脚本的自动绑定部分参数
function getScriptObject(list, typeName) {
	var scriptObject = null;

	var init = false;
	for (var i = 0; i < list.length; i++) {
		let c = list[i]
		if (c.__type__ == typeName) {
			//5. 如果存在只是修改
			scriptObject = list[i];
			console.log('  似乎否已有 脚本 ')
			return scriptObject;
		}
	}
	//6. 如果不存在添加并修改
	console.log(' 创建 ')
	scriptObject = JSON.parse(_prefabS)
	scriptObject.__type__ = typeName;
	let nodeIndex = scriptObject.node.__id__
	var root = list[nodeIndex]
	// var prefabIndex = root._prefab.__id__;
	// var prefabInfo = list[prefabIndex]
	// console.log(' list.length1111 ', list.length)

	// list.push(list[index])
	// list.push(scriptObject);
	list.push(scriptObject)
	let index = list.length - 1
	// console.log(' list.length22222 ', list.length)
	// root._prefab.__id__ = list.indexOf(prefabInfo)
	let comps = root._components;
	if (!comps) {
		root._components = []
		comps = root._components
	}
	let have = false;
	for (var j = 0; j < comps.length; j++) {
		let v = comps[j]
		if (v['__id__'] == index) {
			have = true;
			break;
		}
	}
	if (!have) {
		comps.push({
			"__id__": index
		});
	}



	return scriptObject

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
		subpath = res_path + '/' + subpaths[i]
		stat = fs.statSync(subpath);
		//console.log(" subpath ", subpath);
		if (stat.isFile() && subpath.indexOf('.prefab') >= 0 && subpath.indexOf('.meta') < 0) {
			parseFile(subpath, export_dir)
		} else if (stat.isDirectory()) {
			var temp = subpath.replace(res_path, '')
			parseDir(subpath, export_dir + '/' + temp)
		}
	}
}

//解析单个文件
function parseFile(res_path, export_dir) {
	propertyMap = {}
	var fileName = path.basename(res_path).replace('.prefab', '')
	//1. 找到导出脚本文件的meta文件取出uuid
	var exportFileName = export_dir + '/' + fileName + '.ts'
	var metaFileName = exportFileName + '.meta'
	var metaData = file_util.readFile(metaFileName)
	if (metaData) {
		let metaObj = JSON.parse(metaData)
		if (metaObj) {
			let uuid = metaObj.uuid;
			let jsName = uuid + '.js'
			//2. 通过uuid从library中找到脚本对应的js文件。
			let jsPath = file_util.findFile(_libraryFolder, jsName)
			console.log('jsPath ', jsPath)
			if (jsPath) {
				let jsContent = file_util.readFile(jsPath)
				//3. 从这个文件中找到脚本文件中的type
				let result = jsContent.match(new RegExp(`cc\\._RF\\.push\\(module, \\'([^,]*)\\', \\'${fileName}\\'`));
				//console.log(' result ', result)
				let prefabData = file_util.readFile(res_path)
				let prefabObject = JSON.parse(prefabData)
				rootComponent = prefabObject[1]
				//console.log(' prefabObject 66 ', prefabObject[66])
				//4. 通过这个type查找预制体文件中是否存在要绑定的脚本
				parsePrefab(prefabObject[1], prefabObject, getScriptObject(prefabObject, result[1]))

				file_util.writeFile(res_path, JSON.stringify(prefabObject));
			}
		}

	}

}

function refresh() {
	constData = JSON.parse(file_util.readFile(_cur_path + '/code_generator_config.json'));
	constData.NORMAL_COMP_LIST = constData.NORMAL_COMP_LIST.split(',')
}

function init(project_path, cur_path) {
	_project_path = project_path
	_cur_path = cur_path;
	_libraryFolder = project_path + '/library/imports'
	var prefabFileName = cur_path + '/templates/creator_prefab.txt'
	_prefabS = file_util.readFile(prefabFileName);
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

module.exports.parseDir = parseDir;
module.exports.init = init;
module.exports.parseFile = parseFile;
module.exports.refresh = refresh;
