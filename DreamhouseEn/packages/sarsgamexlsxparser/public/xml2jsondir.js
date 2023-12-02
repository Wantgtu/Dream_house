var xml2json = require('./xml2json.js')
var fs = require('fs');
var path = require('path');
var dir = process.argv[2];
function readDir(dir) {
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
		stat = fs.statSync(subpath);
		if (stat.isDirectory()) {
			// readDir(subpath, obj);
		} else if (stat.isFile()) {
			// Size in Bytes
			
			if(subpath.indexOf('.xml') >= 0){
				console.log(" subpath ",subpath);
				xml2json.xml2json(subpath);
			}
			
		}
	}
}

readDir(dir)