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

var problems = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'resources', 'standardFunctions.json'), 'utf8'));

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
