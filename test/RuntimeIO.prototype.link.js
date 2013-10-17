'use strict';

var RuntimeIO;

RuntimeIO = require('../StdIO');

Object.prototype.bug = 42;

module.exports = {

    'Link to alias': function (test) {

        var io;
        var value;

        io = new RuntimeIO();

        io.aliases._a_ = 'a';

        value = {};

        test.ok( io.link(5, '_a_', value) instanceof RuntimeIO );

        test.deepEqual(value, {
            a: 5
        });

        test.done();
    },

    'Link to existing namespace': function (test) {

        var io;
        var value;

        io = new RuntimeIO();

        value = {
            a: {
                b: 42
            }
        };

        test.ok( io.link({
            c: 42
        }, 'a', value) instanceof RuntimeIO );

        test.deepEqual(value, {
            a: {
                b: 42,
                c: 42
            }
        });

        test.done();
    }
};
