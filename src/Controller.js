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
    this.setRuntime( new Runtime({
        io: new StdIO()
    }) );
}

Controller.prototype = {

    /**
     * @public
     * @memberOf {Controller}
     * @method
     *
     * @param {Runtime} runtime
     *
     * @returns {Controller}
     * */
    setRuntime: function (runtime) {

        if ( runtime instanceof Runtime ) {

            /**
             * @private
             * @memberOf {Controller}
             * @property {Runtime}
             * */
            this.__context__ = runtime;

            return this;
        }

        throw new TypeError(runtime);
    },

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

        var context;

        context = this.__context__;

        context.resolve(provs).done(function (value) {
            onResolved.call(context, null, value.result, value.errors);
        }, function (reason) {
            onResolved.call(context, reason, null, null);
        });
    }

};

module.exports = Controller;
