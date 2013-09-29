/**
 * @preserve de
 *
 * Copyright (c) 2013 Golyshev Dmitrii (golyshev.dmitry@yandex.ru)
 *
 * @license MIT
 * @version 0.0.1
 * */
'use strict';

/**
 * @constructor
 * */
function Model () {

    /**
     * @private
     * @memberOf {Model}
     * @property {Object}
     * */
    this.__provs__ = {};
}

Model.prototype = {

    /**
     * @public
     * @memberOf {Model}
     * @method
     *
     * @param {String|Object} id
     * @param {String|String[]|*} [deps]
     * @param {Function|*} [prov]
     *
     * @returns {Model}
     * */
    decl: function (id, deps, prov) {

        var decls;
        var decl;
        var hasProperty;

        hasProperty = Object.prototype.hasOwnProperty;

        if ( Object(id) === id ) {
            decls = id;

            for ( id in decls ) {

                if ( hasProperty.call(decls, id) ) {
                    decl = decls[id];

                    if ( Object(decl) !== decl || 'function' === typeof decl ) {

                        this.__provs__[id] = {
                            prov: decl,
                            deps: []
                        };

                        continue;
                    }

                    deps = decl.deps;

                    if ( void 0 === deps || null === deps ) {

                        this.__provs__[id] = {
                            prov: decl.prov,
                            deps: []
                        };

                        continue;
                    }

                    this.__provs__[id] = {
                        prov: decl.prov,
                        deps: Array.isArray(deps) ? deps : [deps]
                    };

                }
            }

            return this;
        }

        if ( 3 > arguments.length ) {

            this.__provs__[id] = {
                prov: deps,
                deps: []
            };

            return this;
        }

        if ( void 0 === deps || null === deps ) {

            this.__provs__[id] = {
                prov: prov,
                deps: []
            };

            return this;
        }

        this.__provs__[id] = {
            prov: prov,
            deps: Array.isArray(deps) ? deps : [deps]
        };

        return this;
    }

};

module.exports = Model;
