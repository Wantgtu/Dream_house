let file_util = require('./file_util')
let file_replace = require('./file_replace')
const path = require("path");
var project_path = process.argv[2];
console.log(' project_path ', project_path)
var copy_files = function (workSpaceDir) {
    var release_path = path.join(workSpaceDir, 'release', 'wxgame')
	file_replace.replace(release_path)
}

if(project_path){
	copy_files(project_path)
	
}
module.exports.copy_files = copy_files;