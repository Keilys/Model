'use strict';

var Model;

Model = require('../');

Object.prototype.bug = 42;

module.exports = {

    'Model.prototype.decl': {

        'declaration by decls object': function (test) {

            var model;
            var p0;
            var p1;
            var p2;
            var p3;
            var p4;
            var result;

            model = new Model();

            p0 = function () {};
            p1 = 'SOME_CONFIG';
            p2 = function () {};
            p3 = function () {};
            p4 = function () {};

            result = model.decl({
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

            test.deepEqual( model.__provs__, {
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

            test.ok( result instanceof Model );

            test.done();
        },

        'declaration by separated arguments': function (test) {

            var model;
            var p0;
            var p1;
            var p2;
            var p3;
            var p4;
            var result;

            model = new Model();
            p0 = function () {};
            p1 = function () {};
            p2 = function () {};
            p3 = function () {};
            p4 = function () {};

            result = model.decl('myProvider0', p0);

            test.deepEqual(model.__provs__, {
                myProvider0: {
                    deps: [],
                    prov: p0
                }
            });

            test.ok( result instanceof Model );

            result = model.decl('myProvider1', void 0, p1);

            test.deepEqual(model.__provs__, {
                myProvider0: {
                    deps: [],
                    prov: p0
                },
                myProvider1: {
                    deps: [],
                    prov: p1
                }
            });

            test.ok( result instanceof Model );

            result = model.decl('myProvider2', null, p2);

            test.deepEqual(model.__provs__, {
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

            test.ok( result instanceof Model );

            result = model.decl('myProvider3', 'myProvider1', p3);

            test.deepEqual(model.__provs__, {
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

            test.ok( result instanceof Model );

            result = model.decl('myProvider4', [
                'myProvider1',
                'myProvider2'
            ], p4);

            test.deepEqual(model.__provs__, {
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

            test.ok( result instanceof Model );

            test.done();
        }
    }
};
