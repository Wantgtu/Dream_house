let file_util = require('./file_util')
const path = require("path");
var build_path = process.argv[2];
var release_path = process.argv[3];
if(build_path && release_path){
	  file_util.copyDir(build_path, release_path)
	
}