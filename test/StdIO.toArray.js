'use strict';

var StdIO;

StdIO = /** @type StdIO */ require('../StdIO');

module.exports = {

    'Convert undefined to array': function (test) {
        test.deepEqual( StdIO.toArray(void 0), [] );
        test.done();
    },

    'Convert null to array': function (test) {
        test.deepEqual(StdIO.toArray(null), []);
        test.done();
    },

    'Convert array to array': function (test) {

        var array;

        array = [];

        test.strictEqual( StdIO.toArray(array), array );
        test.done();
    },

    'Convert any other type to array': function (test) {
        test.deepEqual( StdIO.toArray(5), [5]);
        test.done();
    }

};
