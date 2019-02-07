'use strict';
const fs = require('fs');

let countWords = require('./countWords.js');
let levenshtein = require('./levenshtein.js');
let lengthDiff = require('./lengthDiff.js');
let sequenceAlignment = require('./sequenceAlignment.js');

let rawData = fs.readFileSync('./evaluation/json_files/prepared_sentences.json');
let data = JSON.parse(rawData);

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

var makeNewFile = function(file) {
	for (var i = 0, keys = Object.keys(file.sentences), l = keys.length; i < l; i++) {
		let lev = levenshtein(file.sentences[i].description, file.sentences[i].comment);
		let gender = countWords(file.sentences[i].description, file.sentences[i].comment, genderWords);
		let not = countWords(file.sentences[i].description, file.sentences[i].comment, notWords);
		let lengDiff = lengthDiff(file.sentences[i].description, file.sentences[i].comment);
		file.sentences[i].levenshtein = lev;
		file.sentences[i].changedGender = gender;
		file.sentences[i].changedNot = not;
		file.sentences[i].lenght_diff = lengDiff;
	}

	return file
}

var makeseq = function(file) {
	for (var i = 0, keys = Object.keys(file.sentences), l = keys.length; i < l; i++) {
		let seqAli = sequenceAlignment(file.sentences[i].description, file.sentences[i].comment);
		file.sentences[i] = seqAli;
	}

	return file
}

// console.log(makeNewFile(test))
let cdf_data = JSON.stringify(makeNewFile(data));
fs.writeFileSync('./evaluation/json_files/cdf_data.json', cdf_data);

let sequence_data = JSON.stringify(makeseq(data));
fs.writeFileSync('./evaluation/json_files/sequence.json', sequence_data);