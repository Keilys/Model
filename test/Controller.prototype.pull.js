'use strict';

var Controller;
var Exception;
var Runtime;
var StdIO;

Controller = require('../DataEngine');
Exception = require('../Exception');
Runtime = require('../Runtime');
StdIO = require('../StdIO');

module.exports = {

    'Should be called with no error': function (test) {

        var controller;

        controller = new Controller();

        controller.pull([], function (ex, result, errors) {

            test.strictEqual(ex, null);
            test.deepEqual(result, {});
            test.deepEqual(errors, {});

            test.done();
        });

    },

    'Should be called with error': function (test) {

        var controller;
        var io;
        var runtime;

        controller = new Controller();
        runtime = new Runtime();
        io = new StdIO();

        io.decl('ex', function () {

            throw new Exception();
        });

        runtime.setIo( io );
        controller.setRuntime( runtime );

        controller.pull('ex', function (ex, result, errors) {

            test.ok(ex instanceof Exception);
            test.deepEqual(result, null);
            test.deepEqual(errors, null);

            test.done();
        });
    },

    'Should throw an exception': function (test) {

        var controller;

        controller = new Controller();

        controller.pull([], function () {

            throw 42;
        });

        process.once('uncaughtException', function (ex) {
            test.strictEqual(ex, 42);
            test.done();
        });
    }

};
