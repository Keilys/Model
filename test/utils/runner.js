#!/usr/bin/env node
'use strict';

var FS;
var DIR;
var NODEUNIT;
var PATH;
var tests;

FS = require('fs');
PATH = require('path');
DIR = PATH.join(__dirname, '..');

tests = FS.readdirSync( DIR );

tests = tests.filter(function (test) {
    return FS.statSync( PATH.join(DIR, test) ).isFile();
}).map(function (test) {
        return PATH.join('test', test);
    });

NODEUNIT = require('nodeunit');

NODEUNIT.reporters.default.run(tests, null, function (error) {
    process.exit( +!!error );
});
