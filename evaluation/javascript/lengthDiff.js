var tokenizer = function(str) {
    return str.match(/\b[-?(\w+)?'[^']+\b/gmi);
}

var lengthDiff = function(strA, strB) {
	strA_lenght = tokenizer(strA).length
	strB_lenght = tokenizer(strB).length

	return strA_lenght - strB_lenght
}

module.exports = lengthDiff;