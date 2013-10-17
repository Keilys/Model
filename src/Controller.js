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

Runtime = /** @type Runtime */ require('./Runtime');
StdIO = /** @type StdIO */ require('./StdIO');

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
     * @param {*} [context]
     *
     * @returns {void}
     * */
    pull: function (provs, onResolved, context) {

        var i;
        var params;
        var runtime;

        params = {
            io: this.io
        };

        for ( i in context ) {

            if ( Object.prototype.hasOwnProperty.call(context, i) ) {
                params[i] = context[i];
            }
        }

        runtime = new this.Runtime(params);

        if ( runtime instanceof Runtime ) {

            runtime.resolve(provs).done(function (value) {
                onResolved.call(runtime, null, value.result, value.errors);
            }, function (reason) {
                onResolved.call(runtime, reason, null, null);
            });

            return;
        }

        throw new TypeError(runtime);
    }

};

module.exports = Controller;
