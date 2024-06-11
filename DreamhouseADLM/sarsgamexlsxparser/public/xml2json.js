var fs = require('fs');
var xml2js = require('xml2js');
var fileName = process.argv[2];
function xml2json(fileName){
	console.log('fileName',fileName)
	//xml2js默认会把子子节点的值变为一个数组, explicitArray设置为false
	var xmlParser = new xml2js.Parser({explicitArray : false, ignoreAttrs : true})	
	let content = fs.readFileSync(fileName, 'utf-8');
	// xml -> json
	xmlParser.parseString(content, function (err, result) {
		//将返回的结果再次格式化
		//console.log(JSON.stringify(result));
		fileName = fileName.split('.')[0]+'.json'
		fs.writeFileSync(fileName, JSON.stringify(result), 'utf-8');
	});
}

function json2xml(fileName){
	
}

if(fileName){
	//xml2json(fileName)
}
module.exports.xml2json = xml2json;
module.exports.json2xml = json2xml;
