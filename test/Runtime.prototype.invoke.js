'use strict';

var Runtime;
var StdIO;

Runtime = require('../Runtime');
StdIO = /** @type RuntimeIO */ require('../RuntimeIO');

module.exports = {

    'Should be fulfilled': function (test) {

        var io;
        var runtime;

        io = new StdIO();

        io.decl('r0', [], function (result, errors) {
            test.ok(this instanceof Runtime);
            test.strictEqual(this, runtime);
            test.deepEqual(result, {});
            test.deepEqual(errors, {});

            return 0;
        });

        runtime = new Runtime({
            io: io
        });

        runtime.invoke('r0').then(function (result) {
            test.strictEqual(result, 0);
            test.done();
        });
    },

    'Should be rejected': function (test) {

        var io;
        var runtime;

        io = new StdIO();

        io.decl('config', 42);

        io.decl('r0', ['config'], function (result, errors) {
            test.ok(this instanceof Runtime);
            test.strictEqual(this, runtime);
            test.deepEqual(result, {
                config: 42
            });
            test.deepEqual(errors, {});

            return 0;
        });

        io.decl('e0', ['r0', 'config'], function (result, errors) {
            test.ok(this instanceof Runtime);
            test.strictEqual(this, runtime);
            test.deepEqual(result, {
                r0: 0,
                config: 42
            });
            test.deepEqual(errors, {});

            throw 0;
        });

        runtime = new Runtime({
            io: io
        });

        runtime.invoke('e0').fail(function (reason) {
            test.strictEqual(reason, 0);
            test.done();
        });
    },

    'Should throw an exception': function (test) {

        var ex;
        var io;
        var runtime;

        ex = new Error();
        io = new StdIO();

        io.events.on( StdIO.events.DATA_ACCEPTED, function () {

            throw ex;
        });

        io.decl('config', 42);

        runtime = new Runtime({
            io: io
        });

        runtime.invoke('config');

        process.once('uncaughtException', function (uncaught) {
            test.strictEqual(uncaught, ex);
            test.done();
        });
    }

};
