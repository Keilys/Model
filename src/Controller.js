/**
 * @preserve de
 *
 * Copyright (c) 2013 Golyshev Dmitrii (golyshev.dmitry@yandex.ru)
 *
 * @license MIT
 * @version 0.1.5
 * */
'use strict';

var Runtime;
var StdIO;

Runtime = require('./Runtime');
StdIO = require('./StdIO');

/**
 * @constructor
 * */
function Controller () {

    /**
     * @public
     * @memberOf {Controller}
     * @property {StdIO}
     * */
    this.io = new StdIO();
}

Controller.prototype = {

    /**
     * @public
     * @memberOf {Controller}
     * @constructor
     * */
    Runtime: Runtime,

    /**
     * @public
     * @memberOf {Controller}
     * @method
     *
     * @param {Array<String>|String} provs
     * @param {*} onResolved
     *
     * @returns {void}
     * */
    pull: function (provs, onResolved) {

        var runtime;

        runtime = new this.Runtime({
            io: this.io
        });

        if ( runtime instanceof Runtime ) {

            return runtime.resolve(provs).done(function (value) {
                onResolved.call(runtime, null, value.result, value.errors);
            }, function (reason) {
                onResolved.call(runtime, reason, null, null);
            });
        }

        throw new TypeError(runtime);
    }

};

module.exports = Controller;
