#!/usr/bin/make

.DEFAULT_GOAL := all
NODE_MODULES := node_modules/
BIN := $(NODE_MODULES).bin/
JSHINT := $(BIN)jshint
ISTANBUL := $(BIN)istanbul

all:: hook
all:: lint
all:: cov
all:: readme

cov: $(NODE_MODULES)
	$(ISTANBUL) cover test/utils/runner.js

hook: .git/hooks/pre-commit
.git/hooks/pre-commit: pre-commit
	cp $< $@

lint: $(NODE_MODULES)
	$(JSHINT) lib/
	$(JSHINT) test/

readme:
	./tools/upd-readme.js

test: $(NODE_MODULES)
	$(ISTANBUL) test test/utils/runner.js

$(NODE_MODULES):
	npm install

.PHONY: $(NODE_MODULES) all cov lint test
