/**
 * Created by bjdmeest on 22/04/2016.
 */

var fs = require('fs'),
    path = require('path'),
    Processor = require('../lib/Processor'),
    expect = require('chai').expect;

var processor = new Processor();

describe('Processor', function () {
    it('should work', function (done) {
        var desc = fs.readFileSync(path.resolve(__dirname, '../resources/fnDesc.ttl'), 'utf8');

        processor.process(desc, function (err, resTtl) {
            expect(err).to.be.null;
            console.log(resTtl);
            done();
        });

    });
});
