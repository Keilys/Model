'use strict';

var Controller;

Controller = require('../Controller');

module.exports = {

    'Should throw a TypeError': function (test) {

        var controller;

        controller = new Controller();

        try {
            controller.setIo(0);

            throw 0;
        } catch (ex) {

            test.ok( ex instanceof TypeError );
        }

        test.done();
    }
};
