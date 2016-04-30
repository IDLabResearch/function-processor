/**
 * Created by bjdmeest on 22/04/2016.
 */

var path = require("path");
var fs = require("fs");
var N3 = require('n3');
var _ = require("lodash");
var async = require("async");

var Processor = function () {
    this.pluginJsonPath = path.resolve(__dirname, '../plugins/plugins.json');
    this.plugins = JSON.parse(fs.readFileSync(this.pluginJsonPath, 'utf8'));
};

Processor.prototype.constructor = Processor;

function castXSDToValue(string) {
    string = string.replace('http://www.w3.org/2001/XMLSchema#', 'xsd:');
    var match = string.match(/^"([^"]*?)"(\^\^xsd:(.*))?$/);
    if (!match) {
        throw new Error('cannot parse ' + string);
    }
    var value = match[1];
    var datatype = match[3];
    switch (datatype) {
        case 'integer':
            return parseInt(value);
        case 'decimal':
        case 'double':
            return Number(value);
        case 'boolean':
            return value === 'true';
        default :
            throw new Error('cannot work with ' + datatype);
    }
}

Processor.prototype.process = function (ttl, cb) {
    var store = new N3.Store();
    var parser = new N3.Parser();
    var self = this;
    parser.parse(ttl, function (error, triple, prefixes) {
        if (error) {
            throw error;
        }
        if (triple) {
            store.addTriple(triple);
        }
        else {
            var executionQResults = store.find(null, 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 'http://semweb.mmlab.be/ns/function#Execution');
            async.map(executionQResults, function (executionQResult, done) {
                var fnQResults = store.find(executionQResult.subject, 'http://semweb.mmlab.be/ns/function#executes', null);
                if (fnQResults.length === 0) {
                    return done(new Error('Hmmm, no function found in the turtle to be executed'), null);
                }
                if (fnQResults.length > 1) {
                    return done(new Error('Hmmm, multiple functions found in the turtle to be executed'), null);
                }
                var availableFn = _.filter(self.plugins.available, function (obj, key) {
                    if (!obj.label) {
                        obj.label = key;
                    }
                    return obj.id === fnQResults[0].object;
                });
                if (availableFn.length === 0) {
                    return done(new Error('Hmmm, no function definition found in ./plugins'), null);
                }
                var calledFnObj = availableFn[0];

                var paramQResults = store.find(calledFnObj.id, 'http://semweb.mmlab.be/ns/function#expects', null);
                var paramPredicates = [];
                for (var i = 0; i < paramQResults.length; i++) {
                    var paramPQResults = store.find(paramQResults[i].object, 'http://www.w3.org/1999/02/22-rdf-syntax-ns#predicate', null);
                    if (paramPQResults.length !== 1) {
                        return done(new Error('Hmmm, no or too many paramPredicate found for ' + paramQResults[i].object), null);
                    }
                    paramPredicates.push(paramPQResults[0].object);
                }
                paramPredicates.sort(function (a, b) {
                    return calledFnObj.parameters.indexOf(a) - calledFnObj.parameters.indexOf(b);
                });

                var calledFn = require(path.resolve(path.dirname(self.pluginJsonPath), calledFnObj.label));
                if (calledFnObj.call) {
                    calledFn = calledFn[calledFnObj.call];
                }

                var args = [];
                for (var i = 0; i < paramPredicates.length; i++) {
                    var argQResult = store.find(executionQResult.subject, paramPredicates[i], null);
                    if (argQResult.length !== 1) {
                        return done(new Error('Hmmm, no or too many param values found for ' + paramQResults[i].object), null);
                    }
                    args.push(castXSDToValue(argQResult[0].object));
                }
                // todo callback, errors
                var res = calledFn.apply(this, args);

                var returnTtl = executionQResult.subject + ' a <http://semweb.mmlab.be/ns/function#Execution';

                if (calledFnObj.return && res) {
                    returnTtl += ' ;\n  ' + calledFnObj.return + ' "' + res + '"'; // TODO data type find out!
                }

                returnTtl += ' .';

                return done(null, returnTtl);

            }, function (err, outValues) {
                return cb(err, outValues.join('\n\n'));
            });
        }
    });
};

module.exports = Processor;
