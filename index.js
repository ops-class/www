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
		slides = require('./lib/slides.js'),
		outline = require('./lib/outline.js'),
		copy = require('metalsmith-copy'),
		path = require('path'),
		asst = require('./lib/asst.js'),
    lessjavascript = require('./lib/lessjavascript.js'),
    concat = require('metalsmith-concat'),
    highlight = require('./lib/highlight.js'),
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
var outline_compiled_pattern = 'slides/**/index.html';
var slides_compiled_pattern = 'slides/**/slides.html';
var asst_pattern = 'asst/*.adoc';

metalsmith(__dirname)
  .use(drafts())
  .use(filemetadata([
    {pattern: slides_pattern, metadata: {'layout': 'slides/slides.adoc'}},
	]))
  .use(layouts({
    engine: 'handlebars',
		pattern: slides_pattern
  }))
  .use(filemetadata([
    {pattern: asst_pattern, metadata: {'asst': true, 'layout': 'asst/asst.hbt'}}
  ]))
  .use(asciidoc())
  .use(updated({ignoreKeys: ["draft", "working"], filePatterns: ["**/*.html"]}))
  .use(footnotes())
  .use(permalinks())
	.use(copy({
		pattern: outline_compiled_pattern,
		transform: function (file) {
			return path.dirname(file) + "/slides.html";
		}
	}))
	.use(asst())
  .use(filemetadata([
    {pattern: outline_compiled_pattern, metadata: {'outline': true, 'layout': 'slides/outline.hbt'}},
    {pattern: slides_compiled_pattern, metadata: {'slides': true, 'layout': 'slides/slides.hbt'}}
  ]))
  .use(layouts({
    engine: 'handlebars'
  }))
	.use(slides())
	.use(outline())
  .use(lessjavascript())
  .use(concat({
    files: 'css/site/*.css',
    output: 'css/site.css'
  }))
  .use(concat({
    files: 'js/site/*.js',
    output: 'js/site.js'
  }))
  .use(concat({
    files: 'css/slides/deck/*.css',
    output: 'css/slides/deck.css'
  }))
  .use(concat({
    files: 'js/slides/deck/*.js',
    output: 'js/slides/deck.js'
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
