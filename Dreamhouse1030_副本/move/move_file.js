let file_util = require('./file_util')
const path = require("path");
var res_path = process.argv[2];

var dest_path = process.argv[3];
console.log(' res_path ', res_path)
console.log(' dest_path ', dest_path)
var copy_files = function (res_path,dest_path) {
    file_util.mkdir(dest_path)
    file_util.copyDir(res_path, dest_path)
}

if(res_path){
	copy_files(res_path,dest_path)
}