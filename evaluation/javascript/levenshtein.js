// Normalize String
function normalizeString(str) {
    return str
        .toUpperCase()
        .replace(/\W/g, " ")
        .replace(/ +/g, " ")
        .replace(/^ | $/g, "");
    // return str.match(/\b[-?(\w+)?]+\b/gi);
}

// Levenshtein
var levenshtein = function(a, b) {
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

module.exports = levenshtein;