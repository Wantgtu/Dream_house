var fs = require('fs');
var sys_path = require('path')
var createDir = function (path) {
	//console.log('mkdir path ',path)
	if (path.indexOf('/') >= 0) {
		let list = path.split('/')
		let dir = list[0]
		for (let i = 1; i < list.length; i++) {
			if (list[i].indexOf('./') >= 0) {
				return dir;
			}
			dir = dir + '/' + list[i]
			let stat = fs.existsSync(dir);
			//console.log('dir', dir)
			if (!stat) {
				try {
					fs.mkdirSync(dir);
					// console.log("createDir dir ",dir)
				} catch (e) {
					if (e.code != 'EEXIST') throw e;
				}
			}

		}
	}
	console.log('error')
	return ''
}
var mkdir = function (path) {
	try {
		fs.mkdirSync(path);
	} catch (e) {
		if (e.code != 'EEXIST') throw e;
	}
}
var rmdir = function (path) {
	try {
		fs.rmdirSync(path);
	} catch (e) {
		if (e.code != 'EEXIST') throw e;
	}
}
var copy = function copy(src, dst) {
	fs.writeFileSync(dst, fs.readFileSync(src));
	// fs.copyFileSync(src,dst);
}
//同步写文件
var writeFile = function (fileName, data) {
	fs.writeFileSync(fileName, data, 'utf-8');
}
var readFile = function (fileName) {
	try {
		return fs.readFileSync(fileName, 'utf-8');
	} catch (e) {
		return null;
	}

}
var deleteFile = function (fileName) {
	fs.unlinkSync(fileName); //删除文件
}
var remove = function (_src) {
	if (fs.statSync(_src).isDirectory()) {
		delDir(_src);
	} else {
		deleteFile(_src);
	}
}
var copyDir = function (src, dst) {
	let paths = fs.readdirSync(src); //同步读取当前目录
	paths.forEach(function (path) {
		var _src = src + '/' + path;
		var _dst = dst + '/' + path;
		console.log('_src', _src)
		console.log('_dst', _dst)
		if (fs.statSync(_src).isDirectory()) {
			if (!fs.existsSync(_dst)) {
				mkdir(_dst)
			}
			copyDir(_src, _dst);
		} else {
			copy(_src, _dst);
		}
	});
}

function delDir(path) {
	let files = [];
	if (fs.existsSync(path)) {
		files = fs.readdirSync(path);
		files.forEach((file, index) => {
			let curPath = path + '/' + file;
			if (fs.statSync(curPath).isDirectory()) {
				delDir(curPath); //递归删除文件夹
			} else {
				fs.unlinkSync(curPath); //删除文件
			}
		});
		fs.rmdirSync(path);
	}
}

function findFileByContent(res_path, content1, content2) {
	let fn = ''
	var stat = fs.statSync(res_path);
	if (!stat.isDirectory()) {
		return fn;
	}
	var subpaths = fs.readdirSync(res_path),
		subpath;
	for (var i = 0; i < subpaths.length; ++i) {
		if (subpaths[i][0] === '.') {
			continue;
		}
		subpath = res_path + '/' + subpaths[i];
		stat = fs.statSync(subpath);

		if (stat.isFile()) {
			var fileData = readFile(subpath)
			if (fileData) {
				if (fileData.indexOf(content1) >= 0 && fileData.indexOf(content2) >= 0) {
					fn = fileData;
					return fn;
				}
			}

		} else if (stat.isDirectory()) {
			fn = findFileByContent(subpath, content1, content2)
			if (fn) {
				return fn;
			}
		}
	}
	return fn;
}


function findFile(res_path, fileName) {
	let fn = ''
	var stat = fs.statSync(res_path);
	// if (stat.isFile() && res_path.indexOf(fileName) >= 0) {
	// 	return res_path;
	// }

	if (!stat.isDirectory()) {
		return fn;
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
		//console.log(" fileName ", fileName);
		//console.log('_-------------------------------')
		if (stat.isFile() && subpath.indexOf(fileName) >= 0) {
			fn = subpath;
			return fn;
		} else if (stat.isDirectory()) {
			fn = findFile(subpath, fileName)
			if (fn) {
				return fn;
			}
		}
	}
	return fn;
}

function join() {
	var length = arguments.length;
	if (length >= 1) {
		var r = arguments[0]
		for (var i = 1; i < length; i++) {
			// console.log(arguments[i]);
			r += '/' + arguments[i]
		}
		return r;
	}

	return '';
}

function removeTail(_cur_path) {
	let index = _cur_path.lastIndexOf('/');
	if (index == _cur_path.length - 1) {
		_cur_path = _cur_path.substring(0, index)
	}
	return _cur_path;
}

function removeHead(_cur_path) {
	let index = _cur_path.indexOf('/');
	if (index == 0) {
		_cur_path = _cur_path.substring(1)
	}
	return _cur_path;
}
/**
 * @param {Object} path1 源类路径
 * @param {Object} path2 要导入的类的路径
 */
function getRelativePath(path1, path2) {

	path1 = removeHead(path1)
	path1 = removeTail(path1)
	path2 = removeHead(path2)
	path2 = removeTail(path2)

	let list1 = path1.split('/')
	let list2 = path2.split('/')
	console.log(' list1.length 1111 ', list1.length)
	while (list1.length > 0) {
		if (list1[0] == list2[0]) {
			list1.shift()
			list2.shift()
		} else {
			break;
		}
	}
	if (list1.length == 0) {
		let r = './'
		for (var i = 0; i < list2.length; i++) {
			r += list2[i] + '/'
		}
		return r;
	} else {
		console.log(' list1.length 222 ', list1.length)
		let r = ''
		for (var i = 0; i < list1.length; i++) {
			r += '../'
		}
		for (var i = 0; i < list2.length; i++) {
			r += list2[i] + '/'
		}
		return r;
	}
}
module.exports.join = join;
module.exports.delDir = delDir;
module.exports.mkdir = mkdir;
module.exports.copyDir = copyDir;
module.exports.writeFile = writeFile;
module.exports.createDir = createDir;
module.exports.readFile = readFile;
module.exports.copy = copy;
module.exports.rmdir = rmdir;
module.exports.findFile = findFile;
module.exports.findFileByContent = findFileByContent;
module.exports.removeTail = removeTail;
module.exports.getRelativePath = getRelativePath;