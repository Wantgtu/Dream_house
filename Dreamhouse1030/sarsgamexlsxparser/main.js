'use strict';
var Path = require('path')
const Fs = require('fs');
var xlsx = require('./read_all')
var file_util = require('./public/file_util.js')
let project_path = Editor.Project.path

let cur_path = Path.join(project_path, 'packages', 'sarsgamexlsxparser')

//模块名称
let moduleName = 'game'

//数据表所在目录
let data_path = Path.join(cur_path, 'game', 'data')
//数据表导出位置
let export_path = Path.join(cur_path, 'game', 'export')
//数据拷贝到哪里
let copy_path = Path.join(project_path, 'assets', 'resources', 'data')

let assets_path = Path.join(project_path, 'assets')

module.exports = {
	load() {
		console.log('package loaded');
	},

	unload() {
		console.log('package unloaded');
	},
	messages: {

		build() {
			Editor.log("开始 ");
			let deleteDir = 0;
			xlsx.parseAll(moduleName, data_path, export_path, cur_path, copy_path, deleteDir);
			Editor.log("结束 ", copy_path);
			let refresh_path = 'db://assets/'
			//Editor.assetdb.refresh(refresh_path, function(err, results) {
				//Editor.log("end");
			//});
		}
	},
};
