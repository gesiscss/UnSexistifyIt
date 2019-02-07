// SERVICES

gameApp.service('httpRequestInterceptor', function() {
    return {
        request: function(config) {

            config.headers['My-Custom-Header'] = 'UnSexistifyIt';

            return config;
        }
    };
});

// get a random sentence
gameApp.service("randomSentenceService", [
    "$resource",
    function($resource) {
        return $resource(
            "/sentences/:id", {
                id: "@_id"
            }, {
                update: {
                    method: "PUT"
                }
            }
        );
    }
]);

// get sentence by id 
gameApp.service("sentenceService", [
    "$resource",
    function($resource) {
        return $resource("/sentences/:id", null, {
            update: {
                method: "PUT"
            },
            get: {
                method: "GET"
            }
        });
    }
]);

// get all users
gameApp.service("userService", [
    "$resource",
    function($resource) {
        return $resource("/users/:id", null, {
            update: {
                method: "PUT"
            }
        });
    }
]);

// get all guests
gameApp.service("guestService", [
    "$resource",
    function($resource) {
        return $resource("/users/guests", null, {
            update: {
                method: "PUT"
            }
        });
    }
]);


// get comments
gameApp.service("commentService", [
    "$resource",
    function($resource) {
        return $resource("/comments/:id", null, {
            update: {
                method: "PUT"
            },
            get: {
                method: "GET"
            }
        });
    }
]);

// get a random comment
gameApp.service("randomCommentService", [
    "$resource",
    function($resource) {
        return $resource(
            "/comments/randomcomment/:id", {
                id: "@_id"
            }, {
                update: {
                    method: "PUT"
                }
            }
        );
    }
]);


// get current user
gameApp.service("currentUserService", [
    "$resource",
    function($resource) {
        return $resource(
            "/users/:username", {
                username: "@username"
            }, {
                get: {
                    method: "GET",
                    isArray: false
                },
                update: {
                    method: "PUT"
                }
            }
        );
    }
]);

// get current user
gameApp.service("getUserByIdService", [
    "$resource",
    function($resource) {
        return $resource(
            "/users/:id", {
                id: "@_id"
            }, {
                'get': {
                    method: "GET",
                    isArray: false
                },
                'update': {
                    method: "PUT"
                }
            }
        );
    }
]);

// get current comment
gameApp.service("currentCommentService", [
    "$resource",
    function($resource) {
        return $resource(
            "/comments/:id", {
                id: "@_id"
            }, {
                update: {
                    method: "PUT"
                },
                get: {
                    method: "GET",
                    isArray: false
                }
            }
        );
    }
]);

// Feedback
gameApp.service('feedbackService', ['$resource', function($resource) {
    return $resource('/feedbacks/:id', null, {
        'update': {
            method: 'PUT'
        }
    });
}])

// Authentication
gameApp.service('authService', function($http) {
    var self = this;

    self.register = function(username, password) {
        return $http.post('/users/register', {
            username: username,
            password: password
        });
    }

    self.login = function(username, password) {
        return $http.post('/users/login', {
            username: username,
            password: password
        });
    }

});

// Normalize String
function normalizeString(str) {
    return str
        .toUpperCase()
        .replace(/\W/g, " ")
        .replace(/ +/g, " ")
        .replace(/^ | $/g, "");
    // return str.match(/\b[-?(\w+)?]+\b/gi);
}

// Get number of words
function getNumWords(str) {
    return normalizeString(str).split(" ").length;
}

// Levenshtein
gameApp.service("levenshtein", function() {
    // Compute the edit distance between the two given strings
    this.get = function(a, b) {
        // Split at whitespace and punctuation.
        a = normalizeString(a).split(" ");
        b = normalizeString(b).split(" ");

        if (a.length === 0) return b.length;
        if (b.length === 0) return a.length;

        var matrix = [];
        // var myArr = [];

        // increment along the first column of each row
        var i;
        for (i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }

        // increment each column in the first row
        var j;
        for (j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }

        // Fill in the rest of the matrix
        for (i = 1; i <= b.length; i++) {
            for (j = 1; j <= a.length; j++) {
                //if(b.charAt(i-1) == a.charAt(j-1)){
                if (b[i - 1] == a[j - 1]) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1, // substitution
                        Math.min(
                            matrix[i][j - 1] + 1, // insertion
                            matrix[i - 1][j] + 1
                        )
                    ); // deletion
                    // myArr.push(b[i-1], b[i], a[i-1])
                    // console.log(b[i-1]);
                    // console.log(b[i]);
                    // console.log(a[i-1]);
                }
            }
        }
        // console.log(myArr);
        return matrix[b.length][a.length];
    };
});

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
    var newObj = {};
    angular.forEach(dictA, function(v, i) {
        if (dictA[i] && dictB[i] != v) {
            newObj[i] = dictB[i] - dictA[i];
        }
        if (dictA[i] && !dictB[i]) {
            newObj[i] = dictA[i];
        }
    });

    angular.forEach(dictB, function(v, i) {
        if (dictB[i] && !dictA[i]) {
            newObj[i] = dictB[i];
        }
    });

    return newObj;
}

var numberOfChangedWords = function(obj) {
    var result = 0;
    angular.forEach(obj, function(v, i) {
        result += obj[i];
    });
    return result;
}

gameApp.service("watchKeywords", function() {

    this.get = function(a, b, lst) {
        resultObj = getDiffOfDict(a, b, lst);
        // console.log(resultObj);
        return numberOfChangedWords(resultObj);
    }

});

// diff between just two arrays:
var arrayDiff = function(a, b) {

    a = normalizeString(a).split(" ");
    b = normalizeString(b).split(" ");

    // let difference = a
    //     .filter(x => !b.includes(x))
    //     .concat(b.filter(x => !a.includes(x)));

    // var difference = a.filter(function(x) {
    //     return !b.includes(x);
    // }).concat(b.filter(function(x) {
    //     return !a.includes(x);
    // }));

    var difference = a.filter(function(x) {
        return !b.indexOf(x) !== -1;
    }).concat(b.filter(function(x) {
        return !a.indexOf(x) !== -1;
    }));

    return difference;
}

var splitIntoArrays = function(arr) {
    var genderWordsArr = [];
    var negativeWordsArr = [];
    var otherWordsArr = [];

    // for (var i = 0; i < arr.length; i++) {
    //     if (genderWords.includes(arr[i])) {
    //         genderWordsArr.push(arr[i]);
    //     } else if (notWords.includes(arr[i])) {
    //         negativeWordsArr.push(arr[i]);
    //     } else if (!genderWords.includes(arr[i]) && !notWords.includes(arr[i])) {
    //         otherWordsArr.push(arr[i]);
    //     }
    // }

    for (var i = 0; i < arr.length; i++) {
        if (genderWords.indexOf(arr[i]) !== -1) {
            genderWordsArr.push(arr[i]);
        } else if (notWords.indexOf(arr[i]) !== -1) {
            negativeWordsArr.push(arr[i]);
        } else if ((!genderWords.indexOf(arr[i]) !== -1) && (!notWords.indexOf(arr[i]) !== -1)) {
            otherWordsArr.push(arr[i]);
        }
    }

    return {
        genderWordsArr: genderWordsArr,
        negativeWordsArr: negativeWordsArr,
        otherWordsArr: otherWordsArr
    }
}

gameApp.service("getChangedWordsList", function() {
    this.get = function(a, b) {
        return splitIntoArrays(arrayDiff(a, b));
    }
});

gameApp.service("getOriginalSentenceWordsList", function() {
    this.get = function(a) {
        a = normalizeString(a).split(" ");
        return splitIntoArrays(a);
    }
});

var scoreRestrictedWords = function(genderWordsArr, negativeWordsArr) {
    if ((typeof genderWordsArr != "undefined") && (genderWordsArr.length != 0)) {
        numberOfGenderWords = genderWordsArr.length;
    } else {
        numberOfGenderWords = 0;
    }

    if ((typeof negativeWordsArr != "undefined") && (negativeWordsArr.length != 0)) {
        numberOfNegativeWords = negativeWordsArr.length;
    } else {
        numberOfNegativeWords = 0;
    }

    if ((numberOfGenderWords + numberOfNegativeWords) != 0) {
        return 40 / (numberOfGenderWords + numberOfNegativeWords);
    } else {
        return 0;
    }
}

var scoreOtherWords = function(otherWordsArr) {
    return 60 / otherWordsArr.length
}

var computePenalty = function(seqAlignObj, genderWordsArr, negativeWordsArr, otherWordsArr) {
    var penalty = 0;
    var restrictedWordsArr = genderWords.concat(notWords);
    // console.log(restrictedWordsArr);
    var scoreRestricted = scoreRestrictedWords(genderWordsArr, negativeWordsArr);
    var scoreOther = scoreOtherWords(otherWordsArr);

    for (var i = 0; i < seqAlignObj.insertedList.length; i++) {
        // if (restrictedWordsArr.includes(seqAlignObj.insertedList[i])) {
        if (restrictedWordsArr.indexOf(seqAlignObj.insertedList[i]) !== -1) {
            penalty = penalty - scoreRestricted;
        } else {
            penalty = penalty - scoreOther;
        }
    }

    for (var i = 0; i < seqAlignObj.deletedList.length; i++) {
        // if (restrictedWordsArr.includes(seqAlignObj.deletedList[i])) {
        if ((restrictedWordsArr.indexOf(seqAlignObj.deletedList[i]) !== -1)) {
            penalty = penalty - scoreRestricted;
        } else {
            penalty = penalty - scoreOther;
        }
    }

    for (var i = 0; i < seqAlignObj.substitutedList.length; i++) {
        // if ( (restrictedWordsArr.includes(seqAlignObj.substitutedList[i][0])) || (restrictedWordsArr.includes(seqAlignObj.substitutedList[i][1])) ) {
        if ((restrictedWordsArr.indexOf(seqAlignObj.substitutedList[i][0]) !== -1) || (restrictedWordsArr.indexOf(seqAlignObj.substitutedList[i][1]) !== -1)) {
            penalty = penalty - scoreRestricted;
        } else {
            penalty = penalty - scoreOther;
        }
    }

    // console.log('scoreRestricted', scoreRestricted);
    // console.log('scoreOther', scoreOther);
    return penalty;
}

// Reward
gameApp.service("rewardService", function() {

    this.computeCommentScore = function(seqAlignObj, originalWordsObj) {
        var baseScore = 100;
        var penalty = Math.round(computePenalty(seqAlignObj, originalWordsObj.genderWordsArr, originalWordsObj.negativeWordsArr, originalWordsObj.otherWordsArr));
        // console.log('penalty', penalty);
        commentScore = baseScore + (penalty);
        return commentScore;
    };

    this.computeRateScore = function(rate) {
        if (rate == 1) {
            rateScore = 60;
        } else if (rate == 2) {
            rateScore = 40;
        } else if (rate == 3) {
            rateScore = 20;
        } else if (rate == 4) {
            rateScore = -20;
        } else if (rate == 5) {
            rateScore = -40;
        } else if (rate == -1) {
            rateScore = -60;
        } else {
            rateScore = 0;
        }
        return rateScore;
    }
});


// SEQUENCE ALIGNMENT

// Unit of calculation (Cell)
function Cell() {
    return {
        score: null,
        arrows: []
    };
}

function alignment(s1, s2, params) {
    // Algorithm: Needleman-Wunsch

    //console.log('s1: ' + s1);
    //console.log('s2: ' + s2);

    // Data
    var sRow = s1;
    var sCol = s2;

    // Parameters
    var sMatch = (params && params.sMatch) || 1;
    var sMismatch = (params && params.sMismatch) || -1;
    //var sGapStart = -1;
    var sGapCont = (params && params.sGapCont) || -1;
    var inDelChar = (params && params.inDelChar) || '-';

    // Grid table
    var table = [];

    // Initialize table
    // r: row, c: col
    for (var c = 0; c < sCol.length + 1; c++) {
        table[c] = [];

        for (var r = 0; r < sRow.length + 1; r++) {
            // Column index comes first because it is more human readable when being printed out in console
            table[c][r] = null;

            // Initialize table with Cell instance
            var cell = new Cell();
            if (c === 0 && r === 0) {
                cell.score = 0;
            } else if (r === 0) {
                cell.score = c * sGapCont;
                cell.arrows.push('L');
            } else if (c === 0) {
                cell.score = r * sGapCont;
                cell.arrows.push('A');
            }
            table[c][r] = cell;
        }
    }
    // console.log('Table was created: ' + table[0].length + ' X ' + table.length);
    // printTable(table, false);

    // Note that tring index is different from 1 from r and c
    for (let r = 1; r <= sRow.length; r++) {
        for (let c = 1; c <= sCol.length; c++) {
            let cell = table[c][r];

            //console.log(r + ":" + sRow[r-1] + ' , ' + c + ":" + sCol[c-1]);
            var scoreMatch = table[c - 1][r - 1].score + (sCol[c - 1] == sRow[r - 1] ? sMatch : sMismatch);
            var scoreLeft = table[c - 1][r].score + sGapCont;
            var scoreAbove = table[c][r - 1].score + sGapCont; // TODO: Insert and Delete might be changed

            // TODO: Implement the panelty for InDel continuted!
            var updatedScore = Math.max(scoreMatch, scoreLeft, scoreAbove);
            cell.score = updatedScore;

            if (updatedScore == scoreMatch) {
                cell.arrows.push('D'); // diagonal
            }

            if (updatedScore == scoreLeft) {
                cell.arrows.push('L'); // left
            }

            if (updatedScore == scoreAbove) {
                cell.arrows.push('A'); // above
            }

            //console.log(table[c][r]);
        }
    }

    // console.log(table);
    // printTable(table, true);

    // Track back the arrows to rebuild the aligned strings
    var alignedRow = [];
    var alignedCol = [];

    for (var c = table.length - 1, r = table[0].length - 1; c > 0 || r > 0;) {
        var arrows = table[c][r].arrows;
        //console.log(arrows);

        switch (arrows[0]) { // TODO: Only supports the first path (diagonal path in priority)
            case 'D':
                alignedRow.push(sRow[r - 1]); // PROBLEM!
                alignedCol.push(sCol[c - 1]);
                r -= 1;
                c -= 1;
                break;

            case 'L':
                alignedRow.push(inDelChar);
                alignedCol.push(sCol[c - 1]);
                c -= 1;
                break;

            case 'A':
                alignedRow.push(sRow[r - 1]);
                alignedCol.push(inDelChar);
                r -= 1;
                break;

            default:
                // console.log(c + " , " + r);
                // console.error('Arrow error!');
                process.exit();
                break;

        }

    }

    alignedRow.reverse();
    alignedCol.reverse();

    //console.log(alignedRow);
    //console.log(alignedCol);

    return {
        s1: alignedRow,
        s2: alignedCol
    }
}

function preProcessing(str) {
    // return str
    //     .toUpperCase()
    //     .replace(/\./g, '').replace(/\,/g, '')
    //     .split(' ')
    //     .map((word) => { return word.trim(); });

    return str.toUpperCase().replace(/\./g, '').replace(/\,/g, '').split(' ').map(function(word) {
        return word.trim();
    });
}

gameApp.service("seqAlignService", function() {
    this.get = function(s1, s2) {
        s1 = preProcessing(s1);
        s2 = preProcessing(s2);

        var result = alignment(s1, s2, {
            inDelChar: '-'
        });

        // console.log('=========================================');
        // console.log('Sentence', result.s1);
        // console.log('Comment', result.s2);
        // console.log('=========================================');

        modifiedWordList = [];
        insertedList = [];
        deletedList = [];
        substitutedList = [];

        for (var i = 0; i < result.s1.length; i++) {
            if (result.s1[i] != result.s2[i]) {
                modifiedWordList.push(result.s1[i]);
                modifiedWordList.push(result.s2[i]);

                if (result.s1[i] == '-') {
                    insertedList.push(result.s2[i]);
                } else if (result.s2[i] == '-') {
                    deletedList.push(result.s1[i]);
                } else {
                    substitutedList.push([result.s1[i], result.s2[i]])
                }
            }
        }

        // console.log('modifiedWordList', modifiedWordList);
        // console.log('insertedList', insertedList);
        // console.log('deletedList', deletedList);
        // console.log('substitutedList', substitutedList);

        // return result
        return {
            insertedList: insertedList,
            deletedList: deletedList,
            substitutedList: substitutedList
        }

    }
})


gameApp.service("genderWordsListService", function() {

    return genderWords;
});

gameApp.service("negativeWordsListService", function() {
    return notWords;
});

var genderWords = ['ACTOR', 'ACTORS', 'ACTRESS', 'ACTRESSES', 'ADMINISTRATOR', 'ADMINISTRATORS', 'ADMINISTRATRIX', 'ADMINISTRATRIXES', 'AUNT', 'AUNTS',
    'AUTHOR', 'AUTHORESS', 'AUTHORESSES', 'AUTHORS', 'BACHELOR', 'BACHELORS', 'BOY', 'BOY', 'BOYS', 'BRIDE', 'BRIDEGROOM', 'BRIDEGROOMS', 'BRIDES', 'BROTHER',
    'BROTHERS', 'CONDUCTOR', 'CONDUCTORS', 'CONDUCTRESS', 'CONDUCTRESSES', 'COUNT', 'COUNTESS', 'COUNTESSES', 'COUNTS', 'CZAR', 'CZARINA', 'CZARINAS', 'CZARS',
    'DAD', 'DADDY', 'DADDYS', 'DADS', 'DAUGHTER', 'DAUGHTER-IN-LAW', 'DAUGHTERS', 'DAUGHTERS-IN-LAW', 'DUCHESS', 'DUCHESSES', 'DUKE', 'DUKES', 'EMPEROR',
    'EMPERORS', 'EMPRESS', 'EMPRESSES', 'FATHER', 'FATHER-IN-LAW', 'FATHERS', 'FATHERS-IN-LAW', 'FEMALE', 'FEMALES', 'FEMININE', 'FEMININES', 'FIANCE', 'FIANCEE', 'FIANCEES', 'FIANCES',
    'GENTLEMAN', 'GENTLEMANS', 'GIANT', 'GIANTESS', 'GIANTESSES', 'GIANTS', 'GIRL', 'GIRL', 'GIRLS', 'GOD', 'GODDESS', 'GODDESSES', 'GODS',
    'GOVERNOR', 'GOVERNORS', 'GRANDDAUGHTER', 'GRANDDAUGHTERS', 'GRANDFATHER', 'GRANDFATHERS', 'GRANDMOTHER', 'GRANDMOTHERS', 'GRANDSON', 'GRANDSONS',
    'GUIDE', 'GUIDES', 'HE', 'HEADMASTER', 'HEADMASTERS', 'HEADMISTRESS', 'HEADMISTRESSES', 'HEIR', 'HEIRESS', 'HEIRESSES', 'HEIRS', 'HER', 'HERO',
    'HEROES', 'HEROINE', 'HEROINES', 'HERS', 'HIM', 'HIS', 'HOST', 'HOSTESS', 'HOSTESSES', 'HOSTS', 'HUNTER', 'HUNTERS', 'HUNTRESS', 'HUNTRESSES',
    'HUSBAND', 'HUSBANDS', 'KING', 'KINGS', 'LAD', 'LADS', 'LADY', 'LADY', 'LADYS', 'LADYS', 'LANDLADY', 'LANDLADYS', 'LANDLORD', 'LANDLORDS', 'LASS',
    'LASSES', 'LORD', 'LORDS', 'MADAM', 'MADAMS', 'MAIDSERVANT', 'MAIDSERVANTS', 'MALE', 'MALES', 'MAMA', 'MAMAS', 'MAN', 'MANAGER', 'MANAGERESS',
    'MANAGERESSES', 'MANAGERS', 'MANSERVANT', 'MANSERVANTS', 'MASCULINE', 'MASCULINES', 'MASSEUR', 'MASSEURS', 'MASSEUSE', 'MASSEUSES', 'MASTER', 'MASTERS', 'MATRON', 'MATRONS',
    'MAYOR', 'MAYORESS', 'MAYORESSES', 'MAYORS', 'MEN', 'MILKMAID', 'MILKMAIDS', 'MILKMAN', 'MILKMEN', 'MILLIONAIRE', 'MILLIONAIRES', 'MILLIONAIRESS',
    'MILLIONAIRESSES', 'MISTRESS', 'MISTRESSES', 'MONITOR', 'MONITORS', 'MONITRESS', 'MONITRESSES', 'MONK', 'MONKS', 'MOTHER', 'MOTHER-IN-LAW',
    'MOTHERS', 'MOTHERS-IN-LAW', 'MR', 'MRS', 'MUM', 'MUMMY', 'MUMMYS', 'MUMS', 'MURDERER', 'MURDERERS', 'MURDERESS', 'MURDERESSES', 'NEGRESS',
    'NEGRESSES', 'NEGRO', 'NEGROES', 'NEPHEW', 'NEPHEWS', 'NIECE', 'NIECES', 'NUN', 'NUNS', 'PAPA', 'PAPAS', 'POET', 'POETESS', 'POETESSES',
    'POETS', 'POLICEMAN', 'POLICEMEN', 'POLICEWOMAN', 'POLICEWOMEN', 'POSTMAN', 'POSTMASTER', 'POSTMASTERS', 'POSTMEN', 'POSTMISTRESS',
    'POSTMISTRESSES', 'POSTWOMAN', 'POSTWOMEN', 'PRIEST', 'PRIESTS', 'PRIETESS', 'PRIETESSES', 'PRINCE', 'PRINCES', 'PRINCESS', 'PRINCESSES',
    'PROPHET', 'PROPHETESS', 'PROPHETESSES', 'PROPHETS', 'PROPRIETOR', 'PROPRIETORS', 'PROPRIETRESS', 'PROPRIETRESSES', 'PROSECUTOR',
    'PROSECUTORS', 'PROSECUTRIX', 'PROSECUTRIXES', 'PROTECTOR', 'PROTECTORS', 'PROTECTRESS', 'PROTECTRESSES', 'QUEEN', 'QUEENS', 'SCOUT',
    'SCOUTS', 'SHE', 'SHEPHERD', 'SHEPHERDESS', 'SHEPHERDESSES', 'SHEPHERDS', 'SIR', 'SIRS', 'SISTER', 'SISTERS', 'SON', 'SON-IN-LAW',
    'SONS', 'SONS-IN-LAW', 'SPINSTER', 'SPINSTERS', 'STEP-DAUGHTER', 'STEP-DAUGHTERS', 'STEP-FATHER', 'STEP-FATHERS', 'STEP-MOTHER',
    'STEP-MOTHERS', 'STEP-SON', 'STEP-SONS', 'STEWARD', 'STEWARDESS', 'STEWARDESSES', 'STEWARDS', 'SULTAN', 'SULTANA', 'SULTANAS',
    'SULTANS', 'TAILOR', 'TAILORESS', 'TAILORESSES', 'TAILORS', 'TESTATOR', 'TESTATORS', 'TESTATRIX', 'TESTATRIXES', 'UNCLE', 'UNCLES',
    'USHER', 'USHERETTE', 'USHERETTES', 'USHERS', 'WAITER', 'WAITERS', 'WAITRESS', 'WAITRESSES', 'WASHERMAN', 'WASHERMEN', 'WASHERWOMAN',
    'WASHERWOMEN', 'WIDOW', 'WIDOWER', 'WIDOWERS', 'WIDOWS', 'WIFE', 'WITCH', 'WITCHES', 'WIVES', 'WIZARD', 'WIZARDS', 'WOMAN', 'WOMEN'
]

var notWords = ["NOT", "DON'T", "DOESN'T", "WON'T", "CAN'T", "WOULDN'T", "SHOULDN'T", "COULDN'T", "DIDN'T", "AREN'T", "ISN'T", "HAVEN'T", "HADN'T",
    "NO", "NEVER"
];