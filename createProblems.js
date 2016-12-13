/**
 * Created by bjdmeest on 25/04/2016.
 */

var fs = require('fs'),
    path = require('path');

var paramMap = {
    'string': 'xsd:string',
    'date': 'xsd:dateTime',
    'duration': 'xsd:duration',
    'integer': 'xsd:integer',
    'list': 'rdf:List',
    'error': 'fns:Error',
    'bool': 'xsd:boolean',
    'property': 'rdf:Property',
    'resource': 'rdf:Resource',
    'class': 'rdf:Class'
};

var problems = {
    date: {
        description: "Handling date objects",
        problems: [
            {
                label: 'timezone',
                description: 'Getting the timezone of a string.',
                functions: [{
                    parameter: ['string'],
                    parameterNames: ['Duration String'],
                    return: ['duration']
                }, {
                    label: 'tz',
                    parameter: ['string'],
                    parameterNames: ['Timezone String'],
                    return: ['string']
                }]
            },
            {
                label: 'day',
                description: 'Extracting the day from a date/time literal.',
                functions: [{
                    parameter: ['dateTime'],
                    parameterNames: ['DateTime'],
                    return: ['integer']
                }]
            },
            {
                label: 'month',
                description: 'Extracting the month from a date/time literal.',
                functions: [{
                    parameter: ['dateTime'],
                    parameterNames: ['DateTime'],
                    return: ['integer']
                }]
            },
            {
                label: 'hours',
                description: 'Extracting the hours from a date/time literal.',
                functions: [{
                    parameter: ['dateTime'],
                    parameterNames: ['DateTime'],
                    return: ['integer']
                }]
            },
            {
                label: 'seconds',
                description: 'Extracting the seconds from a date/time literal.',
                functions: [{
                    parameter: ['dateTime'],
                    parameterNames: ['DateTime'],
                    return: ['integer']
                }]
            },
            {
                label: 'minutes',
                description: 'Extracting the minutes from a date/time literal.',
                functions: [{
                    parameter: ['dateTime'],
                    parameterNames: ['DateTime'],
                    return: ['integer']
                }]
            },
            {
                label: 'year',
                description: 'Extracting the year from a date/time literal.',
                functions: [{
                    parameter: ['dateTime'],
                    parameterNames: ['DateTime'],
                    return: ['integer']
                }]
            },
            {
                label: 'now',
                description: 'Getting the current date and time.',
                functions: [{
                    return: ['dateTime']
                }]
            }
        ]
    },
    crypto: {
        problems: [
            {
                label: 'sha1',
                description: 'Calculating the SHA1 checksum.',
                functions: [{
                    parameter: ['string'],
                    parameterNames: ['Input String'],
                    return: ['string']
                }]
            },
            {
                label: 'sha512',
                description: 'Calculating the SHA512 checksum.',
                functions: [{
                    parameter: ['string'],
                    parameterNames: ['Input String'],
                    return: ['string']
                }]
            },
            {
                label: 'sha384',
                description: 'Calculating the SHA384 checksum.',
                functions: [{
                    parameter: ['string'],
                    parameterNames: ['Input String'],
                    return: ['string']
                }]
            },
            {
                label: 'sha256',
                description: 'Calculating the SHA256 checksum.',
                functions: [{
                    parameter: ['string'],
                    parameterNames: ['Input String'],
                    return: ['string']
                }]
            },
            {
                label: 'md5',
                description: 'Calculating the md5 checksum.',
                functions: [{
                    parameter: ['string'],
                    parameterNames: ['Input String'],
                    return: ['string']
                }]
            }
        ]
    },
    mathematical: {
        problems: [
            {
                label: 'floor',
                description: 'Returning the largest (closest to positive infinity) number with no fractional part that is not greater than the given value.',
                functions: [{
                    parameter: ['number'],
                    parameterNames: ['Input Number'],
                    return: ['result']
                }]
            },
            {
                label: 'abs',
                description: 'Returning the absolute value of the given value.',
                functions: [{
                    parameter: ['number'],
                    parameterNames: ['Input Number'],
                    return: ['result']
                }]
            },
            {
                label: 'add',
                description: 'Returning the sum of the given values.',
                functions: [{
                    parameter: ['number', 'number'],
                    parameterNames: ['Input Number 1', 'Input Number 2'],
                    return: ['number']
                }]
            },
            {
                label: 'unaryMinus',
                description: 'Returning the given value with the sign reversed.',
                functions: [{
                    parameter: ['number'],
                    parameterNames: ['Input Number'],
                    return: ['number']
                }]
            },
            {
                label: 'sub',
                description: 'Returning the arithmetic difference of the given values.',
                functions: [{
                    parameter: ['number', 'number'],
                    parameterNames: ['Input Number 1', 'Input Number 2'],
                    return: ['number']
                }]
            },
            {
                label: 'mul',
                description: 'Returning the arithmetic product of the given values.',
                functions: [{
                    parameter: ['number', 'number'],
                    parameterNames: ['Input Number 1', 'Input Number 2'],
                    return: ['number']
                }]
            },
            {
                label: 'max',
                description: 'Returning the largest value of the input.',
                functions: [{
                    parameter: ['number', 'number'],
                    parameterNames: ['Input Number 1', 'Input Number 2'],
                    return: ['number']
                }]
            },
            {
                label: 'min',
                description: 'Returning the smallest value of the input.',
                functions: [{
                    parameter: ['number', 'number'],
                    parameterNames: ['Input Number', 'Input Number'],
                    return: ['number']
                }]
            },
            {
                label: 'divide',
                description: 'Returning the arithmetic quotient of the given values.',
                functions: [{
                    parameter: ['number', 'number'],
                    parameterNames: ['Input Number 1', 'Input Number 2'],
                    return: ['number']
                }]
            },
            {
                label: 'rand',
                description: 'Returns a number between 0 (inclusive) and 1.0e0 (exclusive). Different numbers can be produced every time this function is invoked. Numbers should be produced with approximately equal probability.',
                functions: [{
                    return: ['number']
                }]
            },
            {
                label: 'round',
                description: 'Returning the number with no fractional part that is closest to the argument. If there are two such numbers, then the one that is closest to positive infinity is returned.',
                functions: [{
                    parameter: ['number'],
                    parameterNames: ['Input Number'],
                    return: ['number']
                }]
            },
            {
                label: 'ceil',
                description: 'Returning the smallest (closest to negative infinity) number with no fractional part that is not less than the value of arg.',
                functions: [{
                    parameter: ['number'],
                    parameterNames: ['Input Number'],
                    return: ['number']
                }]
            }
        ]
    },
    composition: {
        problems: [
            {
                label: 'if',
                description: 'Doing an if-statement.',
                functions: [{
                    parameter: ['eval', 'true', 'false'],
                    parameterNames: ['Evaluation Function', 'Value if True', 'Value if False'],
                    return: ['result']
                }]
            }
        ]
    },
    misc: {
        problems: [
            {
                label: 'eval',
                description: 'Evaluating a statement',
                functions: [{
                    parameter: ['string'],
                    parameterNames: ['Statement String'],
                    return: ['result']
                }]
            },
            {
                label: 'coalesce',
                description: 'Returning the first bound argument.',
                functions: [{
                    parameter: ['list'],
                    parameterNames: ['Input List'],
                    return: ['result']
                }]
            }
        ]
    },
    ontology: {
        problems: [
            {
                label: 'subPropertyOf',
                description: 'Checking whether a given property is a (transitive) sub-property of another property.',
                functions: [{
                    parameter: ['property', 'property'],
                    parameterNames: ['Sub-Property', 'Parent Property'],
                    return: ['bool']
                }]
            },
            {
                label: 'objectCount',
                description: 'Getting the number of values of a given property (?arg2) at a given subject (?arg1). The result is the number of matches of (?arg1, ?arg2, ?object).',
                functions: [{
                    parameter: ['resource', 'property'],
                    parameterNames: ['Subject', 'Predicate'],
                    return: ['integer']
                }]
            },
            {
                label: 'subjectCount',
                description: 'Getting the number of values of a given property (?arg1) at a given object (?arg2). The result is the number of matches of (?subject, ?arg1, ?arg2).',
                functions: [{
                    parameter: ['property', 'resource'],
                    parameterNames: ['Predicate', 'Object'],
                    return: ['integer']
                }]
            },
            {
                label: 'object',
                description: 'Getting the object of a given subject (?arg1) / predicate (?arg2) combination. Note that if multiple values are present then the result might be unpredictably random.',
                functions: [{
                    parameter: ['resource', 'property'],
                    parameterNames: ['Subject', 'Predicate'],
                    return: ['resource']
                }]
            },
            {
                label: 'objectInGraph',
                description: 'Gets the object of a given subject (?arg1) / predicate (?arg2) combination in a given graph ?arg3. Note that if multiple values are present then the result might be unpredictably random.',
                functions: [{
                    parameter: ['resource', 'property', 'graph'],
                    parameterNames: ['Subject', 'Predicate', 'Graph'],
                    return: ['resource']
                }]
            },
            {
                label: 'objectSubProp',
                description: 'Getting the object of a given subject (?arg1) / predicate (?arg2) combination, also taking the sub-properties of ?arg2 into account. Note that if multiple values are present then the result might be unpredictably random.',
                functions: [{
                    parameter: ['resource', 'property'],
                    parameterNames: ['Subject', 'Predicate'],
                    return: ['resource']
                }]
            },
            {
                label: 'strdt',
                description: 'Constructing a literal with lexical form and type as specified by the arguments.',
                functions: [{
                    parameter: ['string', 'iri'],
                    parameterNames: ['Input String', 'Data Type IRI'],
                    return: ['literal']
                }]
            },
            {
                label: 'bnode',
                description: 'Constructing a blank node that is distinct from all blank nodes in the dataset being queried and distinct from all blank nodes created by calls to this constructor for other query solutions. If the no argument form is used, every call results in a distinct blank node. If the form with a simple literal is used, every call results in distinct blank nodes for different simple literals, and the same blank node for calls with the same simple literal within expressions for one solution mapping.',
                functions: [{
                    parameter: ['literal'],
                    parameterNames: ['Literal to Derive Blank Node from'],
                    return: ['resource']
                }]
            },
            {
                label: 'IRI',
                description: 'Creating a IRI resource (node) from a given IRI string',
                functions: [{
                    parameter: ['string'],
                    parameterNames: ['IRI String'],
                    return: ['resource']
                }]
            },
            {
                label: 'datatype',
                description: 'Returning the datatype IRI of argument ?arg1; returns xsd:string if the parameter is a simple literal.',
                functions: [{
                    parameter: ['string'],
                    parameterNames: ['Input String'],
                    return: ['class']
                }]
            },
            {
                label: 'subClassOf',
                description: 'Checks whether a given class (?arg1) is a (transitive) sub-class of another class (?arg2).',
                functions: [{
                    parameter: ['class', 'class'],
                    parameterNames: ['Sub Class', 'Parent Class'],
                    return: ['bool']
                }]
            },
            {
                label: 'subject',
                description: 'Gets the \'first\' subject of a given predicate (?arg1)/object (?arg2) combination. Note that if multiple values are present then the result might be unpredictably random.',
                functions: [{
                    parameter: ['property', 'resource'],
                    parameterNames: ['Predicate', 'Object'],
                    return: ['resource']
                }]
            }
        ]
    },
    bool: {
        problems: [
            {
                label: 'lt',
                description: 'Returning true if ?arg1 < ?arg2.',
                functions: [{
                    parameter: ['input', 'input'],
                    parameterNames: ['Input 1', 'Input 2'],
                    return: ['bool']
                }]
            },
            {
                label: 'not',
                description: 'Returning the boolean negation of the argument.',
                functions: [{
                    parameter: ['input'],
                    parameterNames: ['Input'],
                    return: ['bool']
                }]
            },
            {
                label: 'ne',
                description: 'Returning true if ?arg1 != ?arg2.',
                functions: [{
                    parameter: ['input', 'input'],
                    parameterNames: ['Input 1', 'Input 2'],
                    return: ['bool']
                }]
            },
            {
                label: 'le',
                description: 'Returning true if ?arg1 <= ?arg2.',
                functions: [{
                    parameter: ['input', 'input'],
                    parameterNames: ['Input 1', 'Input 2'],
                    return: ['bool']
                }]
            },
            {
                label: 'ge',
                description: 'Returning true if ?arg1 >= ?arg2.',
                functions: [{
                    parameter: ['input', 'input'],
                    parameterNames: ['Input 1', 'Input 2'],
                    return: ['bool']
                }]
            },
            {
                label: 'isURI',
                description: 'Checking whether a node is a URI.',
                functions: [{
                    parameter: ['input'],
                    parameterNames: ['Input 1'],
                    return: ['bool']
                }]
            },
            {
                label: 'eq',
                description: 'Returning true if ?arg1 == ?arg2.',
                functions: [{
                    parameter: ['input', 'input'],
                    parameterNames: ['Input 1', 'Input 2'],
                    return: ['bool']
                }]
            },
            {
                label: 'and',
                description: 'Returning the logical AND between two (boolean) operands.',
                functions: [{
                    parameter: ['input', 'input'],
                    parameterNames: ['Input 1', 'Input 2'],
                    return: ['bool']
                }]
            },
            {
                label: 'or',
                description: 'Returning the logical OR between two (boolean) operands.',
                functions: [{
                    parameter: ['input', 'input'],
                    parameterNames: ['Input 1', 'Input 2'],
                    return: ['bool']
                }]
            }
        ]
    },
    string: {
        problems: [
            {
                label: 'encode_for_uri',
                description: 'encoding for a URI',
                functions: [{
                    parameter: ['string'],
                    parameterNames: ['Input String'],
                    return: ['string']
                }]
            },
            {
                label: 'contains',
                description: 'Whether a string contains another string',
                functions: [{
                    parameter: ['string', 'string'],
                    parameterNames: ['Haystack String', 'Needle String'],
                    return: ['bool']
                }]
            },
            {
                label: 'strends',
                description: 'Whether a string ends another string',
                functions: [{
                    parameter: ['string', 'string'],
                    parameterNames: ['Haystack String', 'Needle String'],
                    return: ['bool']
                }]
            },
            {
                label: 'ucase',
                description: 'Converting a string to upper case characters.',
                functions: [{
                    parameter: ['string'],
                    parameterNames: ['Input String'],
                    return: ['string']
                }]
            },
            {
                label: 'lcase',
                description: 'Converting a string to lower case characters.',
                functions: [{
                    parameter: ['string'],
                    parameterNames: ['Input String'],
                    return: ['string']
                }]
            },
            {
                label: 'strstarts',
                description: 'Whether a string starts another string',
                functions: [{
                    parameter: ['string', 'string'],
                    parameterNames: ['Haystack String', 'Needle String'],
                    return: ['bool']
                }]
            },
            {
                label: 'substr',
                description: 'Getting the sub-string of a given string',
                functions: [{
                    parameter: ['string', 'integer', 'integer'],
                    parameterNames: ['Input String', 'Starting Index', 'Length'],
                    return: ['string']
                }]
            },
            {
                label: 'strlen',
                description: 'Computing the length of a given input string.',
                functions: [{
                    parameter: ['string'],
                    parameterNames: ['Input String'],
                    return: ['integer']
                }]
            },
            {
                label: 'strafter',
                description: 'Returning a literal of the same kind (simple literal, plain literal same language tag, xsd:string) as the first argument arg1. The lexical form of the result is the substring of the value of arg1 that proceeds in arg1 the first occurrence of the lexical form of arg2; otherwise the lexical form of the result is the empty string. If the lexical form of arg2 is the empty string, the lexical form of the result is the emprty string.',
                functions: [{
                    parameter: ['string', 'string'],
                    parameterNames: ['HayStack String', 'Needle String'],
                    return: ['string']
                }]
            },
            {
                label: 'replace',
                description: 'Replacing each non-overlapping occurrence of a regular expression pattern with a replacement string. Regular expession matching may involve modifier flags.',
                functions: [{
                    parameter: ['string', 'string', 'string', 'string'],
                    parameterNames: ['Input String', 'Search String', 'Replacement String', 'Flags'],
                    return: ['string']
                }]
            },
            {
                label: 'strbefore',
                description: 'Returning a literal of the same kind (simple literal, plain literal same language tag, xsd:string) as the first argument arg1. The lexical form of the result is the substring of the value of arg1 that precedes in arg1 the first occurrence of the lexical form of arg2; otherwise the lexical form of the result is the empty string. If the lexical form of arg2 is the empty string, the lexical form of the result is the emprty string.',
                functions: [{
                    parameter: ['string', 'string'],
                    parameterNames: ['HayStack String', 'Needle String'],
                    return: ['string']
                }]
            },
            {
                label: 'concat',
                description: 'Creating a single string by concatenating all arguments from left to right. Note that if any one of the arguments is unbound (null) then the whole result string will be unbound.',
                functions: [{
                    parameter: ['string', 'string'],
                    parameterNames: ['Input String 1', 'Input String 2'],
                    return: ['string']
                }]
            },
            {
                label: 'regex',
                description: 'Returning true if a string (?arg1) matches the regular expression supplied as a pattern (?arg2) as influenced by the value of flags (?arg3), otherwise returns false.',
                functions: [{
                    parameter: ['string', 'string', 'string'],
                    parameterNames: ['Input String', 'Regular Expression String', 'Flags'],
                    return: ['bool']
                }]
            }
        ]
    },
    rdf: {
        description: "Handling RDF resources",
        problems: []

    },
};

var spinNarrows = [
    [':prob_URI', ':prob_IRI'],
    [':fn_objectInGraph', ':fn_object'],

    ['<https://www.w3.org/TR/sparql11-query/#func-floor>', ':fn_floor'],
    ['<https://www.w3.org/TR/sparql11-query/#func-abs>', ':fn_abs'],
    ['<https://www.w3.org/TR/sparql11-query/#idp2130040>', ':fn_rand'],
    ['<https://www.w3.org/TR/sparql11-query/#func-round>', ':fn_round'],
    ['<https://www.w3.org/TR/sparql11-query/#func-ceil>', ':fn_ceil'],

    ['<https://www.w3.org/TR/sparql11-query/#func-strdt>', ':fn_strdt'],
    ['<https://www.w3.org/TR/sparql11-query/#func-bnode>', ':fn_bnode'],

    ['<https://www.w3.org/TR/sparql11-query/#func-sha1>', ':fn_sha1'],
    ['<https://www.w3.org/TR/sparql11-query/#func-sha512>', ':fn_sha512'],
    ['<https://www.w3.org/TR/sparql11-query/#func-sha384>', ':fn_sha384'],
    ['<https://www.w3.org/TR/sparql11-query/#func-sha256>', ':fn_sha256'],
    ['<https://www.w3.org/TR/sparql11-query/#func-md5>', ':fn_md5'],

    ['<https://www.w3.org/TR/sparql11-query/#func-timezone>', ':fn_timezone'],

    ['<https://www.w3.org/TR/sparql11-query/#func-contains>', ':fn_contains'],
    ['<https://www.w3.org/TR/sparql11-query/#func-substr>', ':fn_substr'],
    ['<https://www.w3.org/TR/sparql11-query/#func-strends>', ':fn_strends'],
    ['<https://www.w3.org/TR/sparql11-query/#func-strstarts>', ':fn_strstarts'],
    ['<https://www.w3.org/TR/sparql11-query/#func-strafter>', ':fn_strafter'],
    ['<https://www.w3.org/TR/sparql11-query/#func-strbefore>', ':fn_strbefore'],
    ['<https://www.w3.org/TR/sparql11-query/#func-strlen>', ':fn_strlen'],
    ['<https://www.w3.org/TR/sparql11-query/#func-replace>', ':fn_replace'],
    ['<https://www.w3.org/TR/sparql11-query/#func-regex>', ':fn_regex'],
    ['<https://www.w3.org/TR/sparql11-query/#func-ucase>', ':fn_ucase'],
    ['<https://www.w3.org/TR/sparql11-query/#func-lcase>', ':fn_lcase'],

    ['<https://www.w3.org/TR/sparql11-query/#func-coalesce>', ':fn_coalesce'],

    ['<https://www.w3.org/TR/sparql11-query/#func-strlen>', '<http://www.w3.org/TR/xpath-functions/#func-string-length>'],
];

var extraTriples = [
    '<https://www.w3.org/TR/sparql11-query/#func-strlen> skos:related <http://www.w3.org/TR/xpath-functions/#func-string-length>',
    '<https://www.w3.org/TR/sparql11-query/#func-substr> skos:related <http://www.w3.org/TR/xpath-functions/#func-substring>',
    '<https://www.w3.org/TR/sparql11-query/#func-ucase> skos:related <http://www.w3.org/TR/xpath-functions/#func-upper-case>',
    '<https://www.w3.org/TR/sparql11-query/#func-lcase> skos:related <http://www.w3.org/TR/xpath-functions/#func-lower-case>',
    '<https://www.w3.org/TR/sparql11-query/#func-strstarts> skos:related <http://www.w3.org/TR/xpath-functions/#func-starts-with>',
    '<https://www.w3.org/TR/sparql11-query/#func-strends> skos:related <http://www.w3.org/TR/xpath-functions/#func-ends-with>',
    '<http://www.w3.org/TR/xpath-functions/#func-string-length> fno:solves :prob_strlen',
    '<http://www.w3.org/TR/xpath-functions/#func-substring> fno:solves :prob_substr',
    '<http://www.w3.org/TR/xpath-functions/#func-upper-case> fno:solves :prob_ucase',
    '<http://www.w3.org/TR/xpath-functions/#func-lower-case> fno:solves :prob_lcase',
    '<http://www.w3.org/TR/xpath-functions/#func-starts-with> fno:solves :prob_strstarts',
    '<http://www.w3.org/TR/xpath-functions/#func-ends-with> fno:solves :prob_strends',
];

var problemTemplate = '' +
    '<problemId> a fno:Problem ;\n' +
    '  fno:name "The <label> problem"^^xsd:string ;\n' +
    '  dcterms:description "<description>"^^xsd:string .\n';

var parameterTemplate = '[ a fno:Parameter; fno:predicate <predicate> <label>]';

var outputTemplate = ' ;\n' +
    '  fno:output [\n' +
    '    a fno:Output;\n' +
    '    fno:predicate <predicate>\n' +
    '  ]';

var rangeTemplate = '' +
    '<predicate> fno:type <range> .\n';

var functionTemplate = '' +
    '<fnId> a fno:Function ;\n' +
    '  fno:solves <problem>' +
    '<parameters>' +
    '<outputs> .\n';

var now = new Date();
var nowString = now.getFullYear() + '-' + now.getMonth() + '-' + now.getDay();

var totalTtl = fs.readFileSync(path.resolve(__dirname, './resources/problemsTemplate.ttl'), 'utf8').replace(/%%modified%%/g, nowString);

for (var key in problems) {
    if (!problems.hasOwnProperty(key)) {
        continue;
    }
    var problemId = createProblem({label: key});
    for (var i = 0; i < problems[key].problems.length; i++) {
        var specificProblemId = createProblem(problems[key].problems[i]);
        spinNarrows.push([specificProblemId, problemId]);
        for (var j = 0; j < problems[key].problems[i].functions.length; j++) {
            var label = problems[key].problems[i].functions[j].label || problems[key].problems[i].label;
            createFunction(problems[key].problems[i].functions[j], specificProblemId, label);
        }
    }
}
createRanges();
createSkos();

totalTtl += extraTriples.join(' .\n') + ' .\n';

console.log(totalTtl);

function createProblem(problem) {
    problem.label = problem.label || Math.floor(Math.random() * 1000);
    problem.description = problem.description || '';
    var id = ':prob_' + problem.label;
    var str = problemTemplate.replace('<problemId>', id);
    str = str.replace('<label>', problem.label);
    str = str.replace('<description>', problem.description);

    totalTtl += str + '\n';

    return id;
}

function createFunction(functionObj, problemId, problemLabel) {
    var parameters = [];
    var returns = [];
    var argn = 1;
    var outn = 1;

    if (functionObj.parameter) {
        for (var i = 0; i < functionObj.parameter.length; i++) {
            var param = parameterTemplate.replace('<predicate>', ':pred_' + functionObj.parameter[i]);
            if (functionObj.parameterNames) {
                param = param.replace('<label>', '; rdfs:label "' + functionObj.parameterNames[i] + '"^^xsd:string ');
            }
            else {
                param = param.replace('<label>', '');
            }
            parameters.push(param);
            argn++;
        }
    }
    for (var i = 0; i < functionObj.return.length; i++) {
        returns.push(outputTemplate.replace('<predicate>', ':pred_' + functionObj.return[i]));
        outn++;
    }
    var str = functionTemplate.replace('<parameters>', ' ;\n  fno:expects (' + parameters.join(' ') + ')');
    str = str.replace('<outputs>', returns.join(''));
    var id = ':fn_' + problemLabel;
    str = str.replace('<fnId>', id);
    str = str.replace('<problem>', problemId);

    totalTtl += str;

    return id;
}

function createSkos() {
    totalTtl += '\n';
    for (var i = 0; i < spinNarrows.length; i++) {
        totalTtl += spinNarrows[i][0] + ' skos:broader ' + spinNarrows[i][1] + ' .\n';
    }
}

function createRanges() {
    totalTtl += '\n';
    for (var key in paramMap) {
        if (paramMap.hasOwnProperty(key)) {
            totalTtl += ':pred_' + key + ' fno:type ' + paramMap[key] + ' .\n';
        }
    }
}
