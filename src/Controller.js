/**
 * @preserve de
 *
 * Copyright (c) 2013 Golyshev Dmitrii (golyshev.dmitry@yandex.ru)
 *
 * @license MIT
 * @version 1.0.0
 * */
'use strict';

var Runtime;
var RuntimeIO;

Runtime = /** @type Runtime */ require('./Runtime');
RuntimeIO = /** @type RuntimeIO */ require('./RuntimeIO');

/**
 * @constructor
 * */
function Controller () {
    this.setIo( new RuntimeIO() );
}

Controller.prototype = {

    /**
     * @public
     * @memberOf {RuntimeIO}
     * @method
     *
     * @param {RuntimeIO} io
     *
     * @returns {Controller}
     * */
    setIo: function (io) {

        if ( io instanceof RuntimeIO ) {

            /**
             * @public
             * @memberOf {Controller}
             * @property {RuntimeIO}
             * */
            this.io = io;

            return this;
        }

        throw new TypeError(io);
    },

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
