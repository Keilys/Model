'use strict';

var Exception;
var Runtime;
var StdIO;

Exception = require('../Exception');
Runtime = require('../Runtime');
StdIO = require('../StdIO');

Object.prototype.bug = 42;

module.exports = {

    'Should be fulfilled': function (test) {

        var io;
        var runtime;

        io = new StdIO();

        io.decl('r0', function (result, errors) {
            test.ok(this instanceof Runtime);
            test.strictEqual(this, runtime);
            test.deepEqual(result, {});
            test.deepEqual(errors, {});

            return 0;
        });

        io.decl('r1', ['e0'], function (result, errors) {
            test.ok(this instanceof Runtime);
            test.strictEqual(this, runtime);
            test.deepEqual(result, {});
            test.deepEqual(errors, {
                e0: 0
            });

            return 1;
        });

        io.decl('e0', function (result, errors) {
            test.ok(this instanceof Runtime);
            test.strictEqual(this, runtime);
            test.deepEqual(result, {});
            test.deepEqual(errors, {});

            throw 0;
        });

        io.decl('e1', ['r0'], function (result, errors) {
            test.ok(this instanceof Runtime);
            test.strictEqual(this, runtime);
            test.deepEqual(result, {
                r0: 0
            });
            test.deepEqual(errors, {});

            throw 1;
        });

        runtime = new Runtime();
        runtime.setIo(io);

        runtime.resolve(['e1', 'r1', 'non-existing']).then(function (value) {
            test.deepEqual(value.result, {
                r1: 1
            });
            test.deepEqual(value.errors, {
                e1: 1
            });

            test.done();
        });
    },

    'Should be rejected': function (test) {

        var io;
        var runtime;

        io = new StdIO();

        io.decl('r0', function (result, errors) {
            test.ok(this instanceof Runtime);
            test.strictEqual(this, runtime);
            test.deepEqual(result, {});
            test.deepEqual(errors, {});

            return 0;
        });

        io.decl('r1', ['e0'], function (result, errors) {
            test.ok(this instanceof Runtime);
            test.strictEqual(this, runtime);
            test.deepEqual(result, {});
            test.deepEqual(errors, {
                e0: 0
            });

            return 1;
        });

        io.decl('e0', function (result, errors) {
            test.ok(this instanceof Runtime);
            test.strictEqual(this, runtime);
            test.deepEqual(result, {});
            test.deepEqual(errors, {});

            throw new Exception();
        });

        io.decl('e1', ['r0'], function (result, errors) {
            test.ok(this instanceof Runtime);
            test.strictEqual(this, runtime);
            test.deepEqual(result, {
                r0: 0
            });
            test.deepEqual(errors, {});

            throw 1;
        });

        runtime = new Runtime();
        runtime.setIo(io);

        runtime.resolve(['e1', 'r1', 'non-existing']).fail(function (reason) {

            test.ok( reason instanceof Exception );

            test.done();
        });
    }

};
