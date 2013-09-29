#!/usr/bin/env node
'use strict';

var FS;
var JSON_TARGET_FILE;
var JSON_FIELD;
var TEXT_FILE;
var json;

FS = require('fs');
JSON_TARGET_FILE = 'package.json';
JSON_FIELD = 'readme';
TEXT_FILE = 'README.md';

json = JSON.parse( FS.readFileSync(JSON_TARGET_FILE) + '' );
json[JSON_FIELD] = FS.readFileSync(TEXT_FILE) + '';

FS.writeFileSync(JSON_TARGET_FILE, JSON.stringify(json, null, 4) + '\n' );
