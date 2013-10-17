'use strict';

var RuntimeIO;

RuntimeIO = /** @type RuntimeIO */ require('../RuntimeIO');

module.exports = {

    'Convert undefined to array': function (test) {
        test.deepEqual( RuntimeIO.toArray(void 0), [] );
        test.done();
    },

    'Convert null to array': function (test) {
        test.deepEqual(RuntimeIO.toArray(null), []);
        test.done();
    },

    'Convert array to array': function (test) {

        var array;

        array = [];

        test.strictEqual( RuntimeIO.toArray(array), array );
        test.done();
    },

    'Convert any other type to array': function (test) {
        test.deepEqual( RuntimeIO.toArray(5), [5]);
        test.done();
    }

};
