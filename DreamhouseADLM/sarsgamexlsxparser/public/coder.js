
var base64zh = require('./Base64zh')
var LzCgw = require('./LzCgw')
var KEY = 'a'


function pack(outObj,isEncode) {
	let obj = {}
	var res = JSON.stringify(outObj);
	// let out = LzCgw.zip(res)
	obj['isEncode'] = isEncode
	if(isEncode){
		let out = base64zh.encode(res)
		obj['data'] = out;
	}else{
		obj['data'] = outObj;
	}

	return obj
}

function zip(list) {
	let obj = {}
	for (var i = 0; i < list.length; i++) {
		let c = list[i]
		if (!obj[c]) {
			obj[c] = []
		}
		obj[c].push(i)
	}
	return obj;
}

function unpack(obj) {
	let list = unzip(obj)
	let str = decode(list)
	return str;
}

function unzip(obj) {
	let out = []
	for (let key in obj) {
		let list = obj[key]
		for (var i = 0; i < list.length; i++) {
			let index = list[i]
			out[index] = key;
		}
	}
	return out;
}

function encode(is) {
	if (KEY) {
		let out = []
		for (var i = 0; i < is.length; i++) {
			var c = is.charCodeAt(i)
			// c = encrypt(c, KEY)
			out[i] = c;
		}
		return out
	} else {
		return is;
	}


}

function decode(out) {
	var ins = ''
	for (var i = 0; i < out.length; i++) {
		let c = out[i]
		// c = decrypt(c, KEY)
		ins += String.fromCharCode(c)
	}
	return ins;

}
// 解密算法也可以公开  
function decrypt(cipherText, key) {
	return cipherText ^ key;
}
module.exports.unpack = unpack;
module.exports.pack = pack;
