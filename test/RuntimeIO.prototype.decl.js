'use strict';

var RuntimeIO;

RuntimeIO = require('../RuntimeIO');

function provider () {}

module.exports = {

    'Declaration without dependencies': function (test) {

        var io;

        io = new RuntimeIO();

        test.ok( io.decl('my', provider) instanceof RuntimeIO );

        test.deepEqual({
            prov: {
                my: provider
            },
            deps: {
                my: []
            }
        }, {
            prov: io.prov,
            deps: io.deps
        });

        test.done();
    },

    'Declaration with dependencies': function (test) {

        var io;

        io = new RuntimeIO();

        test.ok( io.decl('my', ['dep'], provider) instanceof RuntimeIO );

        test.deepEqual({
            prov: {
                my: provider
            },
            deps: {
                my: ['dep']
            }
        }, {
            prov: io.prov,
            deps: io.deps
        });

        test.done();
    }

};
