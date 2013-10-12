#!/usr/bin/make

.DEFAULT_GOAL := all
NODE_MODULES := node_modules/

all:: hook
all:: lint
all:: cov
all:: readme

cov: $(NODE_MODULES)
	./tools/cover

hook: .git/hooks/pre-commit
.git/hooks/pre-commit: pre-commit
	cp $< $@

lint: $(NODE_MODULES)
	./tools/lint

readme:
	./tools/readme

test: $(NODE_MODULES)
	./tools/test

$(NODE_MODULES):
	npm install

.PHONY: $(NODE_MODULES) all cov lint test
