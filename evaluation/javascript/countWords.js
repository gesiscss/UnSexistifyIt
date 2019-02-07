let forEach = require('./forEach.js');

var countWordsNumberInArray = function(arr, query) {
    var count = 0;
    for (let i = 0; i < arr.length; i++)
        if (arr[i] == query)
            count++;
    return count;
}

var tokenizer = function(str) {
    return str.match(/\b[-?(\w+)?'[^']+\b/gmi);
}

var makeWordsDict = function(str, lst) {
    str = str.toUpperCase();
    var keywordsDict = {}
    for (var i = 0; i < lst.length; i++) {
        if (str.match("\\b" + lst[i] + "\\b")) {
            keywordsDict[lst[i]] = countWordsNumberInArray(tokenizer(str), lst[i]);
        }
    }
    return keywordsDict;
}

var getDiffOfDict = function(strA, strB, lst) {
    dictA = makeWordsDict(strA, lst);
    dictB = makeWordsDict(strB, lst);

    // var newObj = difference(dictA, dictB)
    
    var newObj = {}

    forEach(dictA, function(v, i) {
        if (dictA[i] && dictB[i] != v) {
            newObj[i] = dictA[i] - dictB[i];
        }
        if (dictA[i] && !dictB[i]) {
            newObj[i] = dictA[i];
        }
    });

    forEach(dictB, function(v, i) {
        if (dictB[i] && !dictA[i]) {
            newObj[i] = -dictB[i];
        }
    });

    return newObj;
}

var numberOfChangedWords = function(obj) {
    var result = 0;

    forEach(obj, function(v, i) {
        result += obj[i];
    });
    return result;
}

var countWords = function(a, b, lst) {
    resultObj = getDiffOfDict(a, b, lst);
    return numberOfChangedWords(resultObj);
};

module.exports = countWords;