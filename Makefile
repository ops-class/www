all: build | silent

build: node_modules
	@node index.js $(DEPLOY) $(CHECK)
	@while [ -n "$$(find .build -depth -type d -empty -print -exec rmdir {} +)" ]; do :; done
	@rsync -rlpgoDc --delete .build/ build
	@rm -rf .build

install: node_modules
	@node index.js . --check --deploy --quiet
	@while [ -n "$$(find .build -depth -type d -empty -print -exec rmdir {} +)" ]; do :; done

deploy: DEPLOY = --deploy
deploy: check build

check: CHECK = --check
check: build

node_modules: package.json
	@npm install --progress=false

silent:
	@:

run:
	./node_modules/http-server/bin/http-server build -p 8081

clean:
	@rm -rf .build build

statics:
	@wget https://www.google-analytics.com/analytics.js -O src/js/analytics.js 2>/dev/null

findspace:
	find src -type f -exec egrep -Il " +$$" {} \;

.PHONY: run clean silent build install
