'use strict';

var Exception;
var Promise;
var StdIO;

Exception = /** @type Exception */ require('./Exception');
Promise = /** @type Promise */ require('./util/Promise');
StdIO = /** @type StdIO */ require('./StdIO');

/**
 * @constructor
 * */
function Runtime (params) {

    var i;
    
    /**
     * @private
     * @memberOf {Runtime}
     * @property {Object}
     * */
    this.__cache__ = {};
    
    /**
     * @public
     * @memberOf {Runtime}
     * @property {Object}
     * */
    this.params = {};
    
    for ( i in params ) {
        
        if ( Object.prototype.hasOwnProperty.call(params, i) ) {
            this.params[i] = params[i];
        }
    }

    if ( !(this.params.io instanceof StdIO) ) {
        
        throw new TypeError(this.params.io);
    }
}

Runtime.prototype = {

    /**
     * @public
     * @memberOf {Runtime}
     * @method
     *
     * @param {String} id
     *
     * @returns {Promise}
     * */
    invoke: function (id) {

        var io;
        var promise;
        var request;

        if ( this.__cache__.hasOwnProperty(id) ) {

            return this.__cache__[id];
        }

        request = this;

        promise = Promise.when(this.params.io.deps[id], function (deps) {

            deps = StdIO.toArray(deps);

            if ( 0 === deps.length ) {

                return request.__exec__(id, {}, {});
            }

            return request.resolve(deps).then(function (value) {

                return request.__exec__(id, value.result, value.errors);
            });
        });

        io = this.params.io;

        promise.done(function (result) {
            io.emitter.emit(StdIO.events.DATA_ACCEPTED, id, result);
        }, function (reason) {
            io.emitter.emit(StdIO.events.DATA_REJECTED, id, reason);
        });

        this.__cache__[id] = promise;

        return /** @type {Promise} */ promise;
    },

    /**
     * @private
     * @memberOf {Runtime}
     * @method
     *
     * @param {String} id
     * @param {Object} result
     * @param {Object} errors
     *
     * @returns {?}
     * */
    __exec__: function (id, result, errors) {

        var prov;

        prov = this.params.io.prov[id];

        if ( 'function' === typeof prov ) {

            return prov.call(this, result, errors);
        }

        return prov;
    },

    /**
     * @public
     * @memberOf {Runtime}
     * @method
     *
     * @param {Array<String>} ids
     *
     * @returns {Promise}
     * */
    resolve: function (ids) {

        var i;
        var id;
        var io;
        var l;
        var promise;
        var promises;

        io = this.params.io;
        promises = {};

        ids = StdIO.toArray(ids);

        for ( i = 0, l = ids.length; i < l; i += 1 ) {
            id = ids[i];

            if ( io.prov.hasOwnProperty(id) ) {
                promises[id] = this.invoke(id);
            }
        }

        promise = Promise.allResolved(promises);

        return /** @type {Promise} */ promise.then(function (promises) {

            var errors;
            var id;
            var promise;
            var result;
            var value;

            errors = {};
            result = {};

            for ( id in promises ) {

                if ( promises.hasOwnProperty(id) ) {
                    promise = promises[id];
                    value = promise.valueOf();

                    if ( promise.isRejected() ) {

                        if ( value instanceof Exception ) {

                            throw value;
                        }

                        io.link(value, id, errors);

                        continue;
                    }

                    io.link(value, id, result);
                }
            }

            return {
                errors: errors,
                result: result
            };
        });
    }

};

module.exports = Runtime;
