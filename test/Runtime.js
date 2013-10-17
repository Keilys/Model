'use strict';

var Runtime;

Runtime = require('../Runtime');

module.exports = {

    'Should throw a TypeError': function (test) {

        var runtime;


        try {

            runtime = new Runtime({
                io: 5
            });

            throw 0;
        } catch (ex) {

            test.ok( ex instanceof TypeError );
        }

        test.done();
    }
};
