all: build | silent

build:
	@node index.js $(DEPLOY) $(CHECK)
	@while [ -n "$(find .build -depth -type d -empty -print -exec rmdir {} +)" ]; do :; done
	@rsync -rlpgoDc --delete .build/ build
	@rm -rf .build

deploy: DEPLOY = --deploy
deploy: check build

check: CHECK = --check
check: build

install:
	@npm install

silent:
	@:

run:
	./node_modules/http-server/bin/http-server build -p 8081

clean:
	@rm -rf build deploy

statics:
	@wget https://www.google-analytics.com/analytics.js -O src/js/analytics.js 2>/dev/null

.PHONY: run clean silent build
