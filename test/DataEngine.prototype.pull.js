'use strict';

var Exception;
var DataEngine;
var JSPromise;
var Url;

Exception = require('../Exception');
DataEngine = require('../');
JSPromise = require('../src/lib/JSPromise');
Url = require('url');

Object.prototype.bug = 42;

module.exports = {
    'Callback should be called with no error': function (test) {

        var ctx;
        var de;
        var e1;

        ctx = {
            z: 5
        };

        de = new DataEngine();

        e1 = new Error();

        de.decl('url', function (result, errors) {

            test.deepEqual(result, {});
            test.deepEqual(errors, {});

            return Url.parse('http://my-url.ru', true);
        });

        de.decl('error', ['url'], function (result, errors) {

            test.deepEqual(result, {
                url: Url.parse('http://my-url.ru', true)
            });

            test.deepEqual(errors, {});

            throw e1;
        });

        de.decl('host', [
            'error',
            'url.tld',
            'url'
        ], function (result, errors) {

            var url;

            url = Url.parse('http://my-url.ru', true);
            url.tld = 'ru';

            test.deepEqual(result, {
                url: url
            });

            test.strictEqual(errors.error, e1);

            return result.url.hostname;
        });

        de.decl('url.tld', ['url'], function (result, errors) {

            test.deepEqual(result, {
                url: Url.parse('http://my-url.ru', true)
            });

            test.deepEqual(errors, {});

            return result.url.hostname.split('.').pop();
        });

        de.decl('conf', 'JUST STRING');

        de.decl('ns.x', 'x');
        de.decl('ns', {
            z: 'z'
        });

        de.pull([
            'host',
            'nonex',
            'conf',
            'ns.x',
            'ns'
        ], function (ex, result, errors) {

            test.strictEqual(ex, null);

            test.strictEqual(ctx, this);

            test.deepEqual(result, {
                host: 'my-url.ru',
                conf: 'JUST STRING',
                ns: {
                    z: 'z',
                    x: 'x'
                }
            });

            test.deepEqual(errors, {});

            test.done();
        }, ctx);
    },

    'DataEngine should be rejected with Exception': function (test) {

        var de;

        de = new DataEngine();

        de.decl('ex', function () {
            throw new Exception('reject that!!!');
        });

        de.decl('dep', ['ex'], function () {
            //  Should not be called
            test.ok(false);
        });

        de.decl('myData', ['dep'], function () {
            //  Should not be called
            test.ok(false);
        });

        de.pull('myData', function (ex, result, errors) {

            test.ok(ex instanceof  Exception);
            test.strictEqual(ex.message, 'reject that!!!');
            test.strictEqual(result, null);
            test.strictEqual(errors, null);
            test.done();
        });
    },

    'Error should be thrown asynchronously': function (test) {
        var de;

        de = new DataEngine();

        de.pull([], function () {

            throw 0;
        });

        process.once('uncaughtException', function (ex) {
            test.strictEqual(ex, 0);
            test.done();
        });
    },

    'Callback should be called in ctx passed as 3rd argument': function (test) {

        var ctx;
        var de;

        ctx = {};

        de = new DataEngine();

        test.strictEqual(de.pull([], function fn () {
            test.strictEqual(this, ctx);
            test.done();
        }, ctx), void 0);
    },

    'Callback should be called in ctx passed as 2nd argument': function (test) {

        var ctx;
        var de;

        ctx = {};

        de = new DataEngine();

        test.strictEqual(de.pull([], ctx, function fn () {
            test.strictEqual(this, ctx);
            test.done();
        }), void 0);
    },

    'Should return promise': function (test) {

        var ctx;
        var de;
        var res;

        ctx = {};

        de = new DataEngine();

        res = de.pull([], ctx);

        res.then(function (value) {
            test.deepEqual(value, {
                result: {},
                errors: {}
            });

            test.done();
        });

        test.ok(res instanceof JSPromise);
    }
};
