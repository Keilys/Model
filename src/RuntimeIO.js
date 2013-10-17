'use strict';

var EventEmitter;
var Namespace;

EventEmitter = /** @type EventEmitter */ require('events').EventEmitter;
Namespace = /** @type Namespace */ require('./util/Namespace');

/**
 * @constructor
 * */
function RuntimeIO () {

    /**
     * @public
     * @memberOf {RuntimeIO}
     * @property {Object}
     * */
    this.aliases = {};

    /**
     * @public
     * @memberOf {RuntimeIO}
     * @property {EventEmitter}
     * */
    this.events = new EventEmitter();

    /**
     * @public
     * @memberOf {RuntimeIO}
     * @property {Object}
     * */
    this.deps = {};

    /**
     * @public
     * @memberOf {RuntimeIO}
     * @property {Object}
     * */
    this.prov = {};
}

RuntimeIO.prototype = {

    /**
     * @public
     * @memberOf {RuntimeIO}
     * @method
     *
     * @param {String} id
     * @param {String|String[]|*} [deps]
     * @param {*} [prov]
     *
     * @returns {RuntimeIO}
     * */
    decl: function (id, deps, prov) {

        if ( 3 > arguments.length ) {

            this.prov[id] = deps;
            this.deps[id] = [];

            return this;
        }

        this.prov[id] = prov;
        this.deps[id] = RuntimeIO.toArray(deps);

        return this;
    },

    /**
     * @public
     * @memberOf {RuntimeIO}
     * @method
     *
     * @param {*} value
     * @param {String} id
     * @param {Object} root
     *
     * @returns {RuntimeIO}
     * */
    link: function (value, id, root) {

        var exists;
        var i;

        if ( this.aliases.hasOwnProperty(id) ) {

            id = this.aliases[id];
        }

        exists = Namespace.useOn(root, id);

        if ( Object(exists) === exists ) {

            for ( i in value ) {

                if ( Object.prototype.hasOwnProperty.call(value, i) ) {
                    exists[i] = value[i];
                }
            }

            return this;
        }

        Namespace.linkOn(root, id, value);

        return this;
    }

};

/**
 * @public
 * @static
 * @memberOf RuntimeIO
 *
 * @param {*} elem
 *
 * @returns {Array}
 * */
RuntimeIO.toArray = function (elem) {

    if ( void 0 === elem || null === elem ) {

        return [];
    }

    if ( Array.isArray(elem) ) {

        return elem;
    }

    return [elem];
};

/**
 * @public
 * @static
 * @memberOf RuntimeIO
 * @property {Object}
 * */
RuntimeIO.events = {

    /**
     * @public
     * @static
     * @memberOf RuntimeIO.events
     * @property {String}
     * */
    DATA_ACCEPTED: 'accepted',

    /**
     * @public
     * @static
     * @memberOf RuntimeIO.events
     * @property {String}
     * */
    DATA_REJECTED: 'rejected'
};

module.exports = RuntimeIO;
