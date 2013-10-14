'use strict';

var EventEmitter;
var Exception;
var DataEngine;
var JSPromise;
var Url;

EventEmitter = require('../src/lib/EventEmitter');
Exception = require('../Exception');
DataEngine = require('../');
JSPromise = require('../src/lib/JSPromise');
Url = require('url');

Object.prototype.bug = 42;

module.exports = {

    'DataEngine.prototype.decl': function (test) {

        var de;
        var p0;
        var p1;
        var p2;
        var p3;
        var p4;
        var result;

        de = new DataEngine();
        p0 = function () {};
        p1 = function () {};
        p2 = function () {};
        p3 = function () {};
        p4 = function () {};

        result = de.decl('myProvider0', p0);

        test.deepEqual(de.__decls__, {
            myProvider0: {
                deps: [],
                prov: p0
            }
        });

        test.ok( result instanceof DataEngine );

        result = de.decl('myProvider1', void 0, p1);

        test.deepEqual(de.__decls__, {
            myProvider0: {
                deps: [],
                prov: p0
            },
            myProvider1: {
                deps: [],
                prov: p1
            }
        });

        test.ok( result instanceof DataEngine );

        result = de.decl('myProvider2', null, p2);

        test.deepEqual(de.__decls__, {
            myProvider0: {
                deps: [],
                prov: p0
            },
            myProvider1: {
                deps: [],
                prov: p1
            },
            myProvider2: {
                deps: [],
                prov: p2
            }
        });

        test.ok( result instanceof DataEngine );

        result = de.decl('myProvider3', 'myProvider1', p3);

        test.deepEqual(de.__decls__, {
            myProvider0: {
                deps: [],
                prov: p0
            },
            myProvider1: {
                deps: [],
                prov: p1
            },
            myProvider2: {
                deps: [],
                prov: p2
            },
            myProvider3: {
                deps: ['myProvider1'],
                prov: p3
            }
        });

        test.ok( result instanceof DataEngine );

        result = de.decl('myProvider4', [
            'myProvider1',
            'myProvider2'
        ], p4);

        test.deepEqual(de.__decls__, {
            myProvider0: {
                deps: [],
                prov: p0
            },
            myProvider1: {
                deps: [],
                prov: p1
            },
            myProvider2: {
                deps: [],
                prov: p2
            },
            myProvider3: {
                deps: ['myProvider1'],
                prov: p3
            },
            myProvider4: {
                deps: ['myProvider1', 'myProvider2'],
                prov: p4
            }
        });

        test.ok( result instanceof DataEngine );

        test.done();
    },

    'DataEngine.prototype.pull': {
        'accepting': function (test) {

            var ctx;
            var de;
            var e1;
            var ee;

            ee = new EventEmitter();

//            ee.on(DataEngine.events.DATA_ACCEPTED, function (id) {
//                console.log('OK:', id);
//            });
//
//            ee.on(DataEngine.events.DATA_REJECTED, function (id) {
//                console.log('ERROR:', id);
//            });

            ctx = {
                z: 5
            };

            de = new DataEngine();


            try {
                de.setEventEmitter({});

                throw 0;

            } catch (ex) {
                test.ok( ex instanceof TypeError );
            }

            de.setEventEmitter(ee);

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

            de.pull(['host', 'nonex', 'conf', 'ns.x', 'ns'],
                function (ex, result, errors) {

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

        'rejecting': function (test) {

            var de;
            var ee;

            ee = new EventEmitter();

//            ee.on(DataEngine.events.DATA_REJECTED, function (id) {
//                console.log('ERROR:', id);
//            });

            de = new DataEngine();

            de.setEventEmitter(ee);

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
        }
    },

    'DataEngine.prototype.alias': function (test) {

        var de;

        de = new DataEngine();

        de.decl('my-pv-0', function () {
            return {
                myVal: 42
            };
        });

        de.decl('xxx', {
            superVal: 100500
        });

        de.alias('my-pv-0', 'xxx');

        de.pull(['my-pv-0', 'xxx'], function (ex, result) {

            test.deepEqual(result, {
                xxx: {
                    myVal: 42,
                    superVal: 100500
                }
            });

            test.done();
        });

    },

    'Callback exception': function (test) {
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

    'Pull method polymorphism': {

        'test (1)': function (test) {

            var ctx;
            var de;

            ctx = {};

            de = new DataEngine();

            test.strictEqual(de.pull([], function fn () {
                test.strictEqual(this, ctx);
                test.done();
            }, ctx), void 0);
        },

        'test (2)': function (test) {

            var ctx;
            var de;

            ctx = {};

            de = new DataEngine();

            test.strictEqual(de.pull([], ctx, function fn () {
                test.strictEqual(this, ctx);
                test.done();
            }), void 0);
        },

        'test (3)': function (test) {

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

            test.ok( res instanceof JSPromise );
        }

    }

};
