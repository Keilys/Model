/**
 * @preserve de
 *
 * Copyright (c) 2013 Golyshev Dmitrii (golyshev.dmitry@yandex.ru)
 *
 * @license MIT
 * @version 0.1.5
 * */
'use strict';

var EventEmitter;
var Exception;
var Namespace;
var Promise;

var hasProperty;

EventEmitter = /** @type EventEmitter */ require('events').EventEmitter;
Exception = /** @type Exception */ require('./Exception');
Namespace = /** @type Namespace */ require('./util/Namespace');
Promise = /** @type Promise */ require('./util/Promise');

hasProperty = Object.prototype.hasOwnProperty;

/**
 * @constructor
 * */
function DataEngine () {

    /**
     * @private
     * @memberOf {DataEngine}
     * @property {Object}
     * */
    this.__alias__ = {};

    /**
     * @private
     * @memberOf {DataEngine}
     * @property {Object}
     * */
    this.__decls__ = {};

    this.setEventEmitter( new EventEmitter() );
}

DataEngine.prototype = {

    /**
     * @public
     * @memberOf {DataEngine}
     * @method
     *
     * @param {String} from
     * @param {String} to
     * @returns {DataEngine}
     * */
    alias: function (from, to) {
        this.__alias__[from] = to;

        return this;
    },

    /**
     * @public
     * @memberOf {DataEngine}
     * @method
     *
     * @param {String} id
     * @param {String|String[]|*} [deps]
     * @param {*} [prov]
     *
     * @returns {DataEngine}
     * */
    decl: function (id, deps, prov) {

        if ( 3 > arguments.length ) {

            this.__decls__[id] = {
                prov: deps,
                deps: []
            };

            return this;
        }

        if ( void 0 === deps || null === deps ) {

            this.__decls__[id] = {
                prov: prov,
                deps: []
            };

            return this;
        }

        this.__decls__[id] = {
            prov: prov,
            deps: Array.isArray(deps) ? deps : [deps]
        };

        return this;
    },

    /**
     * @public
     * @memberOf {DataEngine}
     * @method
     *
     * @param {Array<String>|String} provs
     * @param {*} fn
     * @param {*} [ctx]
     *
     * @returns {void|Promise}
     * */
    pull: function (provs, fn, ctx) {

        if ( !Array.isArray(provs) ) {
            provs = [provs];
        }

        if ( 'function' !== typeof fn ) {

            return this.__pull__(provs, fn, {});
        }

        this.__pull__(provs, ctx, {}).done(function (value) {
            fn.call(ctx, null, value.result, value.errors);
        }, function (reason) {
            fn.call(ctx, reason, null, null);
        });

        return void 0;
    },

    /**
     * @private
     * @memberOf {DataEngine}
     * @method
     *
     * @param {Array<String>} provs
     * @param {*} ctx
     * @param {Object} cache
     *
     * @returns {Promise}
     * */
    __pull__: function (provs, ctx, cache) {

        var de;
        var i;
        var id;
        var l;
        var promise;
        var promises;

        de = this;
        promises = {};

        for ( i = 0, l = provs.length; i < l; i += 1) {
            id = provs[i];

            if ( hasProperty.call(cache, id) ) {
                promises[id] = cache[id];

                continue;
            }

            if ( !hasProperty.call(this.__decls__, id) ) {

                continue;
            }

            promise = this.__invoke__(id, ctx, cache);

            promises[id] = promise;
        }

        promise = Promise.allResolved(promises);

        return /** @type {Promise} */ promise.then(function (promises) {

            var id;
            var promise;
            var value;
            var errors;
            var result;

            errors = {};
            result = {};

            for ( id in promises ) {

                if ( hasProperty.call(promises, id) ) {
                    promise = promises[id];

                    value = promise.valueOf();

                    if ( promise.isRejected() ) {

                        if ( value instanceof Exception ) {

                            throw value;
                        }

                        de.__link__(value, id, errors);

                        continue;
                    }

                    de.__link__(value, id, result);
                }
            }

            return {
                errors: errors,
                result: result
            };

        });
    },

    /**
     * @private
     * @memberOf {DataEngine}
     * @method
     *
     * @param {String} id
     * @param {*} ctx
     * @param {Object} cache
     *
     * @returns {Promise}
     * */
    __invoke__: function (id, ctx, cache) {

        var de;
        var promise;

        de = this;

        promise = Promise.when(this.__decls__[id], function (decl) {

            var deps;
            var prov;

            deps = decl.deps;
            prov = decl.prov;

            if ( 0 === deps.length ) {

                return de.__callProv__(prov, {}, {}, ctx);
            }

            return de.__pull__(deps, ctx, cache).then(function (value) {

                return de.__callProv__(prov, value.result, value.errors, ctx);
            });

        });

        cache[id] = promise;

        promise.done(function (value) {
            de.__emitter__.emit(DataEngine.events.DATA_ACCEPTED, id, value);
        }, function (reason) {
            de.__emitter__.emit(DataEngine.events.DATA_REJECTED, id, reason);
        });

        return promise;
    },

    /**
     * @private
     * @memberOf {DataEngine}
     * @method
     *
     * @param {*} prov
     * @param {Object} result
     * @param {Object} errors
     * @param {*} ctx
     *
     * @returns {?}
     * */
    __callProv__: function (prov, result, errors, ctx) {

        if ( 'function' === typeof prov ) {

            return prov.call(ctx, result, errors);
        }

        return prov;
    },

    /**
     * @private
     * @memberOf {DataEngine}
     * @method
     *
     * @param {*} value
     * @param {String} ns
     * @param {Object} root
     *
     * @returns {?}
     * */
    __link__: function (value, ns, root) {

        var exists;
        var i;

        if ( hasProperty.call(this.__alias__, ns) ) {
            ns = this.__alias__[ns];
        }

        exists = Namespace.useOn(root, ns);

        if ( Object(exists) === exists ) {

            for ( i in value ) {

                if ( hasProperty.call(value, i) ) {
                    exists[i] = value[i];
                }
            }

            return;
        }

        Namespace.linkOn(root, ns, value);
    },

    /**
     * @public
     * @memberOf {DataEngine}
     * @method
     *
     * @param {EventEmitter} ee
     *
     * @returns {void}
     * */
    setEventEmitter: function (ee) {

        if ( ee instanceof EventEmitter ) {

            /**
             * @private
             * @memberOf {DataEngine}
             * @property {EventEmitter}
             * */
            this.__emitter__ = ee;

            return;
        }

        throw new TypeError(ee);
    }

};

/**
 * @public
 * @static
 * @memberOf DataEngine
 * @property {Object}
 * */
DataEngine.events = {

    /**
     * @public
     * @static
     * @memberOf DataEngine.events
     * @property {String}
     * */
    DATA_ACCEPTED: 'accepted',

    /**
     * @public
     * @static
     * @memberOf DataEngine.events
     * @property {String}
     * */
    DATA_REJECTED: 'rejected'
};

module.exports = DataEngine;
