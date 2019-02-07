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

    // return str.toUpperCase().replace(/\./g, '').replace(/\,/g, '').split(' ').map(function(word) {
    //     return word.trim();
    // });
    return str.replace(/\./g, '').replace(/\,/g, '').split(' ').map(function(word) {
        return word.trim();
    });
}

var sequenceAlignment = function(s1, s2) {
    s1 = preProcessing(s1);
    s2 = preProcessing(s2);

    var result = alignment(s1, s2, {
        inDelChar: '-'
    });

    // console.log('=========================================');
    // console.log('Sentence', result.s1.join(" "));
    // console.log('Comment', result.s2.join(" "));
    // console.log('=========================================');

    originalSentence = result.s1.join(" ");
    modifiedSentece = result.s2.join(" ");


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
        originalSentence,
        modifiedSentece,
        // modifiedWordList: modifiedWordList,
        insertedList: insertedList,
        deletedList: deletedList,
        substitutedList: substitutedList
    }

}

module.exports = sequenceAlignment;