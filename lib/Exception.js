'use strict';

function Exception (message) {

    var stack;

    this.message = message;
    this.name = Exception.__NAME__;

    stack = ( new Error() ).stack;
    stack = [ this.name ].concat( stack.split('\n').slice(2) ).join('\n');

    this.stack = stack;
}

Exception.__NAME__ = 'Exception';

Exception.prototype = Object.create(Error.prototype);

module.exports = Exception;
