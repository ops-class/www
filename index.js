var metalsmith = require('metalsmith'),
    drafts = require('metalsmith-drafts'),
    filemetadata = require('metalsmith-filemetadata'),
    collections = require('metalsmith-collections'),
    asciidoc = require('metalsmith-asciidoc'),
    updated = require('metalsmith-updated'),
    permalinks = require('metalsmith-permalinks'),
    layouts = require('metalsmith-layouts'),
    concat = require('metalsmith-concat'),
    highlight = require('metalsmith-highlight'),
    spellcheck = require('metalsmith-spellcheck'),
    formatcheck = require('metalsmith-formatcheck'),
    linkcheck = require('metalsmith-linkcheck');

var slides_pattern = 'slides/*.adoc';

metalsmith(__dirname)
  .use(drafts())
  .use(filemetadata([
    {pattern: slides_pattern, metadata: {'layout': 'slides/slides.hbt'}}
  ]))
  .use(asciidoc())
  .use(updated({ignoreKeys: ["draft", "working"], filePatterns: ["**/*.html"]}))
  .use(permalinks())
  .use(layouts({
    engine: 'handlebars',
  }))
  .use(concat({
    files: 'assets/js/slides/slides/*.js',
    output: 'assets/js/slides/slides.js'
  }))
  .use(highlight())
  /*
  .use(spellcheck({ dicFile: 'dicts/en_US.dic',
                    affFile: 'dicts/en_US.aff',
                    exceptionFile: 'dicts/spelling_exceptions.json',
                    checkedPart: "div#content",
                    verbose: true}))
  .use(formatcheck({ verbose: true , checkedPart: "div#content", failWithoutNetwork: false }))
  .use(linkcheck({ verbose: true , failWithoutNetwork: false }))
  */
  .clean(true)
  .build(function throwErr (err) { 
    if (err) {
      throw err;
    }
  });
