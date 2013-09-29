'use strict';

var EventEmitter;
var Exception;
var DataEngine;
var Url;

EventEmitter = require('../lib/EventEmitter');
Exception = require('../Exception');
DataEngine = require('../');
Url = require('url');

Object.prototype.bug = 42;

module.exports = {

    'DataEngine.prototype.decl': {

        'declaration by decls object': function (test) {

            var de;
            var p0;
            var p1;
            var p2;
            var p3;
            var p4;
            var result;

            de = new DataEngine();

            p0 = function () {};
            p1 = 'SOME_CONFIG';
            p2 = function () {};
            p3 = function () {};
            p4 = function () {};

            result = de.decl({
                myProvider0: p0,
                myProvider1: p1,
                myProvider2: {
                    deps: ['myProvider1'],
                    prov: p2
                },
                myProvider3: {
                    prov: p3
                },
                myProvider4: {
                    deps: 'myProvider1',
                    prov: p4
                }
            });

            test.deepEqual( de.__decls__, {
                myProvider0: {
                    deps: [],
                    prov: p0
                },
                myProvider1: {
                    deps: [],
                    prov: p1
                },
                myProvider2: {
                    deps: ['myProvider1'],
                    prov: p2
                },
                myProvider3: {
                    deps: [],
                    prov: p3
                },
                myProvider4: {
                    deps: ['myProvider1'],
                    prov: p4
                }
            });

            test.ok( result instanceof DataEngine );

            test.done();
        },

        'declaration by separated arguments': function (test) {

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
        }
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

            de.decl({
                url: function (result, errors) {

                    test.deepEqual(result, {});
                    test.deepEqual(errors, {});

                    return Url.parse('http://my-url.ru', true);
                },

                error: {
                    deps: ['url'],
                    prov: function (result, errors) {

                        test.deepEqual(result, {
                            url: Url.parse('http://my-url.ru', true)
                        });

                        test.deepEqual(errors, {});

                        throw e1;
                    }
                },
                host: {
                    deps: ['error', 'url.tld', 'url'],
                    prov: function (result, errors) {

                        var url;

                        url = Url.parse('http://my-url.ru', true);
                        url.tld = 'ru';

                        test.deepEqual(result, {
                            url: url
                        });

                        test.strictEqual(errors.error, e1);

                        return result.url.hostname;
                    }
                },

                'url.tld': {
                    deps: ['url'],
                    prov: function (result, errors) {

                        test.deepEqual(result, {
                            url: Url.parse('http://my-url.ru', true)
                        });

                        test.deepEqual(errors, {});

                        return result.url.hostname.split('.').pop();
                    }
                },

                conf: {
                    prov: 'JUST STRING'
                },

                'ns.x': {
                    prov: 'x'
                },

                'ns': {
                    prov: {
                        z: 'z'
                    }
                }
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

            de.decl({

                'ex': function () {
                    throw new Exception();
                },

                'dep': {
                    deps: ['ex'],
                    prov: function () {
                        //  Should not be called
                        test.ok(false);
                    }
                },

                'myData': {
                    deps: ['dep'],
                    prov: function () {
                        //  Should not be called
                        test.ok(false);
                    }
                }
            });

            de.pull('myData', function (ex, result, errors) {

                test.ok(ex instanceof  Exception);
                test.strictEqual(result, null);
                test.strictEqual(errors, null);
                test.done();

            });

        }
    }
};
