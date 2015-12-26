var metalsmith = require('metalsmith'),
    drafts = require('metalsmith-drafts'),
    filemetadata = require('metalsmith-filemetadata'),
    collections = require('metalsmith-collections'),
    asciidoc = require('metalsmith-asciidoc'),
    updated = require('metalsmith-updated'),
    permalinks = require('metalsmith-permalinks'),
    register_partials = require('metalsmith-register-partials'),
    layouts = require('metalsmith-layouts'),
    lessjavascript = require('./lib/lessjavascript.js'),
    concat = require('metalsmith-concat'),
    highlight = require('metalsmith-highlight'),
    spellcheck = require('metalsmith-spellcheck'),
    formatcheck = require('metalsmith-formatcheck'),
    linkcheck = require('metalsmith-linkcheck');

var handlebars = require('handlebars'),
    common = require('./lib/common.js');

handlebars.registerHelper('format_date', common.format_date);

var slides_pattern = 'slides/*.adoc';

metalsmith(__dirname)
  .use(drafts())
  .use(filemetadata([
    {pattern: slides_pattern, metadata: {'slides': true, 'layout': 'slides/slides.hbt'}}
  ]))
  .use(asciidoc())
  .use(updated({ignoreKeys: ["draft", "working"], filePatterns: ["**/*.html"]}))
  .use(permalinks())
  .use(lessjavascript())
  .use(layouts({
    engine: 'handlebars',
    partials: 'layouts/partials'
  }))
  .use(concat({
    files: 'assets/css/site/*.css',
    output: 'assets/css/site.css'
  }))
  .use(concat({
    files: 'assets/js/site/*.js',
    output: 'assets/js/site.js'
  }))
  .use(highlight())
  .use(spellcheck({ dicFile: 'dicts/en_US.dic',
                    affFile: 'dicts/en_US.aff',
                    exceptionFile: 'dicts/spelling_exceptions.json',
                    checkedPart: "div#content",
                    failErrors: false,
                    verbose: true}))
  .use(formatcheck({ verbose: true , checkedPart: "div#content", failWithoutNetwork: false }))
  .use(linkcheck({ verbose: true , failWithoutNetwork: false }))
  .clean(true)
  .build(function throwErr (err) { 
    if (err) {
      throw err;
    }
  });
