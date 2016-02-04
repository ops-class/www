all: build | silent

build:
	@node index.js $(DEPLOY) $(CHECK)
	@while [ -n "$(find build -depth -type d -empty -print -exec rmdir {} +)" ]; do :; done

deploy: DEPLOY = --deploy
deploy: check build

check: CHECK = --check
check: build

install:
	@npm install

silent:
	@:

run:
	./node_modules/http-server/bin/http-server build

clean:
	@rm -rf build 

statics:
	@wget http://google-analytics.com/ga.js -O assets/js/ga.js 2>/dev/null

.PHONY: run clean silent build
