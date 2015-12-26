all: build | silent

build:
	@node index.js

install:
	@npm install

silent:
	@:

run: build
	./node_modules/http-server/bin/http-server build

clean:
	@rm -rf build 

statics:
	@wget https://raw.githubusercontent.com/hakimel/reveal.js/master/lib/js/head.min.js -o src/assets/js/slides/slides/head.min.js
	@wget https://raw.githubusercontent.com/hakimel/reveal.js/master/js/reveal.js -o src/assets/js/slides/slides/reveal.js

.PHONY: run clean silent build
