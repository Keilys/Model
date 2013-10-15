'use strict';

var DataEngine;
var EventEmitter;

DataEngine = require('../');
EventEmitter = require('../src/lib/EventEmitter');

module.exports = {

    'System events should be fired': function (test) {

        var de;
        var ee;
        var result;

        result = {};

        ee = new EventEmitter();

        ee.on(DataEngine.events.DATA_REJECTED, function (id, value) {
            result[id] = value;
        });

        ee.on(DataEngine.events.DATA_ACCEPTED, function (id, value) {
            result[id] = value;
        });

        de = new DataEngine();

        de.setEventEmitter(ee);

        de.decl('error', function () {

            throw 'error';
        });

        de.decl('result', function () {

            return 'result';
        });

        de.pull(['result', 'error'], function () {

            test.deepEqual(result, {
                error: 'error',
                result: 'result'
            });

            test.done();
        });
    },

    'TypeError should be thrown': function (test) {

        var de;

        de = new DataEngine();

        try {
            de.setEventEmitter({});

            throw 0;

        } catch (ex) {
            test.ok(ex instanceof TypeError);
            test.done();
        }
    }

};