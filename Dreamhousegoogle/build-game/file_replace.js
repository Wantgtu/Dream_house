let file_util = require('./file_util')
const path = require("path");
var replace = function (release_path) {
	let rep = file_util.readFile('content.txt')
	let file_name = path.join(release_path, 'game.js')
	let content = file_util.readFile(file_name)
	let out = rep + content;
	console.log(' out ' ,out)
	file_util.writeFile(file_name,out)

}

module.exports.replace = replace;
