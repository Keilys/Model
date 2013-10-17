'use strict';

function Exception (message) {

    var stack;

    this.message = message;

    stack = ( new Error() ).stack;
    stack = [ this.name ].concat( stack.split('\n').slice(2) ).join('\n');

    this.stack = stack;
}

Exception.prototype = Object.create(Error.prototype);
Exception.prototype.name = 'Exception';

module.exports = Exception;
