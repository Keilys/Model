'use strict';

function Exception () {
    var ex;

    ex = Error.apply(this, arguments);

    this.stack = ex.stack;
    this.name = 'ModelRejectionWayException';
}

Exception.prototype = Object.create(Error.prototype);

module.exports = Exception;
