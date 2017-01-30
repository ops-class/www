var metalsmith = require('metalsmith'),
    drafts = require('metalsmith-drafts'),
    filemetadata = require('metalsmith-filemetadata'),
    metadata = require('metalsmith-metadata'),
    branch = require('metalsmith-branch'),
    collections = require('metalsmith-collections'),
    github = require('./lib/github.js'),
    asciidoc = require('./lib/asciidoc.js'),
    updated = require('metalsmith-updated'),
    slides = require('./lib/slides.js'),
    footnotes = require('./lib/footnotes.js'),
    permalinks = require('metalsmith-permalinks'),
    fixpath = require('./lib/fixpath.js'),
    register_partials = require('metalsmith-register-partials'),
    layouts = require('metalsmith-layouts'),
    inplace = require('metalsmith-in-place'),
    decks = require('./lib/decks.js'),
    outline = require('./lib/outline.js'),
    copy = require('metalsmith-copy'),
    path = require('path'),
    asst = require('./lib/asst.js'),
    hacks = require('./lib/hacks.js'),
    sections = require('./lib/sections.js'),
    lessjavascript = require('./lib/lessjavascript.js'),
    concat_convention = require('metalsmith-concat-convention'),
    highlight = require('./lib/highlight.js'),
    msif = require('metalsmith-if'),
    clean_css = require('metalsmith-clean-css'),
    uglify = require('metalsmith-uglify'),
    rename = require('metalsmith-rename'),
    internalize = require('./lib/internalize.js'),
		failmeta = require('./lib/failmeta.js'),
    beautify = require('./lib/beautify.js'),
    spellcheck = require('metalsmith-spellcheck'),
    formatcheck = require('metalsmith-formatcheck'),
    linkcheck = require('metalsmith-linkcheck');

var handlebars = require('handlebars'),
    fs = require('fs'),
    common = require('./lib/common.js');

var argv = require('minimist')(process.argv.slice(2)),
    segfault_handler = require('segfault-handler');
segfault_handler.registerHandler(".crash.log");
var quiet = (argv['quiet'] == true);

handlebars.registerPartial('header', fs.readFileSync('layouts/partials/header.hbt').toString());
handlebars.registerPartial('footer', fs.readFileSync('layouts/partials/footer.hbt').toString());
handlebars.registerPartial('slides', fs.readFileSync('layouts/partials/slides.hbt').toString());
handlebars.registerHelper('format_date', common.format_date);

var slides_pattern = 'slides/**/*.adoc';
var outline_compiled_pattern = 'slides/**/index.html';
var deck_compiled_pattern = 'slides/**/deck.html';
var asst_pattern = 'asst/*.adoc';
var course_pattern = 'courses/**/*.adoc';

var isSlides = function(filename, file, i) {
  return file.slides == true;
};
var isASST = function(filename, file, i) {
  return file.asst == true;
};

metalsmith(__dirname)
  .destination('.build')
  .use(drafts())
  .use(metadata({
    asst: 'asst/videos.yaml'
  }))
  .use(filemetadata([
    {pattern: slides_pattern,
      metadata: {
        'slides': true,
        'doGithub': true,
        'layout': 'slides/slides.adoc'
      },
      preserve: true
    },
  ]))
  .use(branch(isSlides)
    .use(layouts({
      engine: 'handlebars'
    }))
  )
  .use(filemetadata([
    {pattern: asst_pattern,
      metadata: {
        'asst': true,
        'layout': 'assts/asst.adoc'
      },
      preserve: true
    },
  ]))
  .use(branch(isASST)
    .use(layouts({
      engine: 'handlebars'
    }))
  )
  .use(filemetadata([
    {pattern: asst_pattern,
      metadata: {
        'layout': 'assts/asst.hbt'
      },
      preserve: false
    },
    {pattern: asst_pattern,
      metadata: {
        'doSections': true,
        'doGithub': true,
      },
      preserve: true
    },
    {pattern: course_pattern,
      metadata: {
        'course': true,
        'doSections': true,
        'doGithub': true,
        'layout': 'courses/course.hbt'
      },
      preserve: true
    }
  ]))
  .use(branch(isSlides)
    .use(collections({
      slides: {
        pattern: slides_pattern,
        sortBy: 'date',
        reverse: true
      }
    }))
  )
  .use(github())
  .use(asciidoc())
  .use(updated({ignoreKeys: ["draft", "working"], filePatterns: ["**/*.html"]}))
  .use(slides())
  .use(footnotes())
  .use(permalinks({ relative: false }))
  .use(fixpath())
  .use(branch(isSlides)
    .use(copy({
      pattern: 'slides/**/*.html',
      transform: function (file) {
        return path.dirname(file) + "/deck.html";
      }
    }))
  )
  .use(asst())
  .use(branch(isSlides)
    .use(filemetadata([
      {pattern: outline_compiled_pattern, metadata: {'outline': true,
                                                     'doSections': true,
                                                     'layout': 'slides/outline.hbt',
                                                     'extra_css': ["/css/outline.css"]
                                                    }},
      {pattern: deck_compiled_pattern, metadata: {'deck': true, 'layout': 'slides/deck.hbt'}}
    ]))
  )
  .use(decks())
  .use(outline())
  .use(sections())
  .use(inplace({
    pattern: '**/*.html.hbs',
  }))
  .use(failmeta())
  .use(layouts({
    engine: 'handlebars'
  }))
  .use(concat_convention({
    extname: '.concat'
  }))
  .use(lessjavascript())
  .use(highlight())
  .use(hacks())
  .use(inplace({
    pattern: '**/*.hbs',
  }))
  .use(msif((argv['check'] == true), internalize({
    verbose: !quiet
  })))
  .use(msif((argv['check'] == true),
    spellcheck({ dicFile: 'dicts/en_US.dic',
                 affFile: 'dicts/en_US.aff',
                 exceptionFile: 'dicts/spelling_exceptions.json',
                 checkedPart: "div#content",
                 failErrors: false,
                 verbose: !quiet})))
  .use(msif((argv['check'] == true),
    formatcheck({ verbose: !quiet , checkedPart: "div#content", failWithoutNetwork: false })))
  .use(msif((argv['check'] == true),
    linkcheck({ verbose: !quiet , failWithoutNetwork: false })))
  .use(msif((argv['deploy'] == true), clean_css({ files: 'css/*.css' })))
  .use(msif((argv['deploy'] == true), uglify()))
  .use(msif((argv['deploy'] == true), rename([[/\.min\.js$/, ".js"]])))
	.use(msif((argv['deploy'] == true), beautify({'indent_size': 2, 'css': false, 'js': false})))
  .clean(true)
  .build(function throwErr (err) {
    if (err) {
      throw err;
    }
  });

// vim: ts=2:sw=2:et
