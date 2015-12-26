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
	@wget https://raw.githubusercontent.com/hakimel/reveal.js/master/lib/js/head.min.js -O src/assets/js/slides/slides/head.min.js 2>/dev/null
	@wget https://raw.githubusercontent.com/hakimel/reveal.js/master/js/reveal.js -O src/assets/js/slides/slides/reveal.js 2>/dev/null
	@wget http://google-analytics.com/ga.js -O src/assets/js/ga.js 2>/dev/null

.PHONY: run clean silent build
