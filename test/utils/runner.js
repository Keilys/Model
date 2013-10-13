#!/usr/bin/env node
'use strict';

var Fs;
var Nodeunit;
var Path;
var tests;

Fs = require('fs');
Path = require('path');
Nodeunit = require('nodeunit');
tests = Fs.readdirSync( Path.join(__dirname, '..') );

tests = tests.filter(function (fileName) {

    return Fs.statSync( Path.join(__dirname, '..', fileName) ).isFile();
}).map(function (fileName) {

        return Path.join('test', fileName);
    });

Nodeunit.reporters.default.run(tests, null, function (error) {
    process.exit( +!!error );
});
