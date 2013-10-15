'use strict';


var DataEngine;

DataEngine = require('../');

module.exports = {

    'A data should be linked as aliased name': function (test) {

        var de;

        de = new DataEngine();

        de.decl('my-system-strange-name', function () {
            return {
                myVal: 42
            };
        });

        de.decl('myPrettyName', {
            superVal: 100500
        });

        de.alias('my-system-strange-name', 'myPrettyName');

        de.pull([
            'my-system-strange-name',
            'myPrettyName'
        ], function (ex, result) {

            test.deepEqual(result, {
                myPrettyName: {
                    myVal: 42,
                    superVal: 100500
                }
            });

            test.done();
        });
    }
};
