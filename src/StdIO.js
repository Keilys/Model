'use strict';

var EventEmitter;
var Namespace;

EventEmitter = /** @type EventEmitter */ require('events').EventEmitter;
Namespace = /** @type Namespace */ require('./util/Namespace');

/**
 * @constructor
 * */
function StdIO () {

    /**
     * @public
     * @memberOf {StdIO}
     * @property {Object}
     * */
    this.aliases = {};

    /**
     * @public
     * @memberOf {StdIO}
     * @property {EventEmitter}
     * */
    this.emitter = new EventEmitter();

    /**
     * @public
     * @memberOf {StdIO}
     * @property {Object}
     * */
    this.deps = {};

    /**
     * @public
     * @memberOf {StdIO}
     * @property {Object}
     * */
    this.prov = {};
}

StdIO.prototype = {

    /**
     * @public
     * @memberOf {StdIO}
     * @method
     *
     * @param {String} id
     * @param {String|String[]|*} [deps]
     * @param {*} [prov]
     *
     * @returns {StdIO}
     * */
    decl: function (id, deps, prov) {

        if ( 3 > arguments.length ) {

            this.prov[id] = deps;
            this.deps[id] = [];

            return this;
        }

        this.prov[id] = prov;
        this.deps[id] = StdIO.toArray(deps);

        return this;
    },

    /**
     * @public
     * @memberOf {StdIO}
     * @method
     *
     * @param {*} value
     * @param {String} id
     * @param {Object} root
     *
     * @returns {StdIO}
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
 * @memberOf StdIO
 *
 * @param {*} elem
 *
 * @returns {Array}
 * */
StdIO.toArray = function (elem) {

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
 * @memberOf StdIO
 * @property {Object}
 * */
StdIO.events = {

    /**
     * @public
     * @static
     * @memberOf StdIO.events
     * @property {String}
     * */
    DATA_ACCEPTED: 'accepted',

    /**
     * @public
     * @static
     * @memberOf StdIO.events
     * @property {String}
     * */
    DATA_REJECTED: 'rejected'
};

module.exports = StdIO;
