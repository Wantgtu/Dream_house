'use strict';
// var path = require('path')
var creator_prefab = require('./creator_prefabV2');
var creator_binding = require('./creator_bindingV2');
let project_path = Editor.Project.path.replace(/\\/g, '/')
const Fs = require('fs');
let cur_path = project_path + '/packages/code_generator/'
let prefab_path = 'resources/prefabs/login'
let export_path = 'Script/game/login/view'

let prefab_refresh = 'db://assets/' + prefab_path
let script_refresh = 'db://assets/' + export_path
const ASSETS = 'assets'
const configFileName = 'code_generator_config.json';
const configFilePath = cur_path + configFileName;
/**
 * 保存配置
 * @param {Object} config 
 */
function saveConfig(config) {
	let object = {};
	
	if (Fs.existsSync(configFilePath)) {
		object = JSON.parse(Fs.readFileSync(configFilePath, 'utf8'));
	}
	// 写入配置
	for (const key in config) {
		object[key] = config[key];
	}
	Fs.writeFileSync(configFilePath, JSON.stringify(object, null, 2));
}

/**
 * 读取配置
 */
function getConfig() {
	Editor.log(' configFilePath ',configFilePath)
	let config = null;
	if (Fs.existsSync(configFilePath)) {
		config = JSON.parse(Fs.readFileSync(configFilePath, 'utf8'));
	}
	return config;
}

function excute() {
	prefab_refresh = 'db://assets/' + prefab_path
	script_refresh = 'db://assets/' + export_path

	let input_path = project_path + '/' + ASSETS + '/' + prefab_path
	let out_path = project_path + '/' + ASSETS + '/' + export_path
	Editor.log("input_path " + input_path);
	Editor.log("out_path " + out_path);
	creator_prefab.refresh();
	creator_binding.refresh();
	if(input_path.indexOf('.prefab') >= 0){
		creator_prefab.parseFile(input_path, out_path)
	}else{
		creator_prefab.parseDir(input_path, out_path)
	}
	
	Editor.log("parseDir")
	Editor.assetdb.refresh(script_refresh, function(err, results) {
		if(input_path.indexOf('.prefab') >= 0){
			creator_binding.parseFile(input_path, out_path)
		}else{
			creator_binding.parseDir(input_path, out_path)
		}
		
		Editor.assetdb.refresh(prefab_refresh, function(err, results) {
			Editor.log("end");
		});
	});

}
module.exports = {
	load() {
		Editor.log('package loaded');
		Editor.log("project_path " + project_path);
		Editor.log("export_path " + export_path);
		Editor.log("cur_path " + cur_path);
		creator_prefab.init(project_path, cur_path)
		creator_binding.init(project_path, cur_path)
	},

	unload() {
		console.log('package unloaded');
	},
	messages: {
		'save-config'(event, config) {
			saveConfig(config);
			Editor.log('保存配置', configFilePath);
			event.reply(null, true);
			prefab_path = config.prefab_path;
			export_path = config.export_path;

			excute();
		},

		'read-config'(event) {
			const config = getConfig();
			if (config) Editor.log('读取本地配置');
			else Editor.log('未找到本地配置文件');
			event.reply(null, config);
		},

		'open-panel'() {
			Editor.Panel.open('code_generator');
		},
		build() {
			excute();
		}
	},
};
