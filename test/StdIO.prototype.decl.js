'use strict';

var StdIO;

StdIO = require('../StdIO');

function provider () {}

module.exports = {

    'Declaration without dependencies': function (test) {

        var io;

        io = new StdIO();

        test.ok( io.decl('my', provider) instanceof StdIO );

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

        io = new StdIO();

        test.ok( io.decl('my', ['dep'], provider) instanceof StdIO );

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
