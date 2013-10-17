'use strict';

var AbstractController;
var Exception;
var Runtime;
var RuntimeIO;

AbstractController = /** @type Controller */ require('../Controller');
Exception = require('../Exception');
Runtime = require('../Runtime');
RuntimeIO = require('../RuntimeIO');

Object.prototype.bug = 42;

function Controller () {
    AbstractController.apply(this, arguments);
}

Controller.prototype = Object.create(AbstractController.prototype);
Controller.prototype.Runtime = Runtime;

module.exports = {

    'Should be called with no error': function (test) {

        var controller;

        controller = new Controller();

        controller.pull([], function (ex, result, errors) {
            test.ok( this instanceof Runtime );
            test.strictEqual(this.params.myParam, 42);
            test.strictEqual(ex, null);
            test.deepEqual(result, {});
            test.deepEqual(errors, {});

            test.done();
        }, {
            myParam: 42
        });

    },

    'Should be called with error': function (test) {

        var controller;

        controller = new Controller();

        controller.io.decl('ex', function () {

            throw new Exception();
        });

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
    },

    'Should throw a TypeError': function (test) {

        var controller;

        controller = new Controller();

        controller.Runtime = function () {};

        try {
            controller.pull([], function () {});

            throw 0;
        } catch (ex) {

            test.ok( ex instanceof TypeError );
        }

        test.done();
    }

};
