'use strict';

var DataEngine;

DataEngine = require('../');

function provider () {}

module.exports = {

    'Declaration without dependencies': function (test) {

        var de;
        var result;

        de = new DataEngine();

        result = de.decl('myProvider', provider);

        test.deepEqual(de.__decls__, {
            myProvider: {
                deps: [],
                prov: provider
            }
        });

        test.ok(result instanceof DataEngine);

        test.done();

    },

    'Declaration with undefined as dependencies': function (test) {

        var de;
        var result;

        de = new DataEngine();

        result = de.decl('myProvider', void 0, provider);

        test.deepEqual(de.__decls__, {
            myProvider: {
                deps: [],
                prov: provider
            }
        });

        test.ok(result instanceof DataEngine);

        test.done();
    },

    'Declaration with null as dependencies': function (test) {

        var de;
        var result;

        de = new DataEngine();

        result = de.decl('myProvider', null, provider);

        test.deepEqual(de.__decls__, {
            myProvider: {
                deps: [],
                prov: provider
            }
        });

        test.ok(result instanceof DataEngine);

        test.done();
    },

    'Declaration with one dependence': function (test) {

        var de;
        var result;

        de = new DataEngine();

        result = de.decl('myProvider', 'myDependence', provider);

        test.deepEqual(de.__decls__, {
            myProvider: {
                deps: ['myDependence'],
                prov: provider
            }
        });

        test.ok(result instanceof DataEngine);

        test.done();
    },

    'Declaration with array of dependencies': function (test) {

        var de;
        var result;

        de = new DataEngine();

        result = de.decl('myProvider', [
            'myDependence-1',
            'myDependence-2'
        ], provider);

        test.deepEqual(de.__decls__, {
            myProvider: {
                deps: ['myDependence-1', 'myDependence-2'],
                prov: provider
            }
        });

        test.ok(result instanceof DataEngine);

        test.done();
    }
};
