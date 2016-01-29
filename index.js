var metalsmith = require('metalsmith'),
    drafts = require('metalsmith-drafts'),
    filemetadata = require('metalsmith-filemetadata'),
    collections = require('metalsmith-collections'),
    asciidoc = require('./lib/asciidoc'),
    updated = require('metalsmith-updated'),
    footnotes = require('./lib/footnotes.js'),
    permalinks = require('metalsmith-permalinks'),
    register_partials = require('metalsmith-register-partials'),
    layouts = require('metalsmith-layouts'),
		deck = require('./lib/deck.js'),
    lessjavascript = require('./lib/lessjavascript.js'),
    concat = require('metalsmith-concat'),
    highlight = require('metalsmith-highlight'),
    beautify = require('metalsmith-beautify'),
    spellcheck = require('metalsmith-spellcheck'),
    formatcheck = require('metalsmith-formatcheck'),
    linkcheck = require('metalsmith-linkcheck');

var handlebars = require('handlebars'),
    fs = require('fs'),
    common = require('./lib/common.js');
  
handlebars.registerPartial('header', fs.readFileSync('layouts/partials/header.hbt').toString());
handlebars.registerPartial('footer', fs.readFileSync('layouts/partials/footer.hbt').toString());
handlebars.registerHelper('format_date', common.format_date);

var slides_pattern = 'slides/*.adoc';
var asst_pattern = 'asst/*.adoc';

metalsmith(__dirname)
  .use(drafts())
  .use(filemetadata([
    {pattern: slides_pattern, metadata: {'slides': true, 'layout': 'slides/slides.adoc'}},
	]))
  .use(layouts({
    engine: 'handlebars',
		pattern: slides_pattern
  }))
  .use(filemetadata([
    {pattern: slides_pattern, metadata: {'slides': true, 'layout': 'slides/slides.hbt'}},
    {pattern: asst_pattern, metadata: {'asst': true, 'layout': 'asst/asst.hbt'}}
  ]))
  .use(asciidoc())
  .use(updated({ignoreKeys: ["draft", "working"], filePatterns: ["**/*.html"]}))
  .use(footnotes())
  .use(permalinks())
  .use(layouts({
    engine: 'handlebars'
  }))
	.use(deck())
  .use(lessjavascript())
  .use(concat({
    files: 'assets/css/site/*.css',
    output: 'assets/css/site.css'
  }))
  .use(concat({
    files: 'assets/js/site/*.js',
    output: 'assets/js/site.js'
  }))
  .use(concat({
    files: 'assets/css/slides/deck/*.css',
    output: 'assets/css/slides/deck.css'
  }))
  .use(concat({
    files: 'assets/js/slides/deck/*.js',
    output: 'assets/js/slides/deck.js'
  }))
  .use(highlight())
	.use(beautify())
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
