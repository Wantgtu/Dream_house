function zip(res) {
	console.log('rest ',res)
	var list = []
	var map = {}
	var out = ''
	var i = 0;
	while (i < res.length) {
		var c = res[i]
		count = 0;
		if (map[c] >= 0) {
			let count = 1;
			let index = map[c]
			var j = index;
			while (j < res.length) {
				j++;
				i++;
				var d = res[i]
				if (list[j] == d) {
					count++;
				} else {
					out += '(' + index + ',' + count + ')'
					continue
				}
			}
		} else {
			map[c] = list.length;
			list.push(c)
			i++
		}
	}
	console.log(' out =======  ', list.concat(out))
	return list.concat(out);


}
module.exports.zip = zip;
