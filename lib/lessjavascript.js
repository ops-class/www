var async = require('async'),
    cheerio = require('cheerio'),
    common = require('./common.js');

function doLessJavascript(contents, file) {
  var $ = cheerio.load(contents);
  $("a[href^='http://'], a[href^='https://']")
    .attr("target", "_blank");
  $("a[href^='http://'], a[href^='https://']")
    .not(":has(> img:first-child)")
    .not('.noexternal')
    .addClass('external');
  $("a[href^='http://'], a[href^='https://']").each(function () {
    if ($(this).parents('.noexternal').length) {
      $(this).removeClass('external');
    }
  });
  $(".imageblock .title").each(function () {
    $(this).parents('.imageblock').first().addClass('hascaption');
  });
  $("a[href$='.pdf']")
    .not('.nopdf')
    .append(" (PDF)")
    .attr("target", "_blank");
  if (file && file.path) {
    var prefix = file.path.split("/")[0];
    if (prefix) {
      $("#menu-" + prefix).addClass('menu-selected');
      $("title").append(" | " + prefix.charAt(0).toUpperCase() + prefix.slice(1));
    }
    $('span.pullquote').each(function() { 
      var parentParagraph = $(this).parent('p'); 
      parentParagraph.css('position', 'relative'); 
      var pulledQuote = $(this).clone().addClass('pulledquote');
      $(parentParagraph).prepend(pulledQuote);
    });
  }
  return $.html();
};

function lessjavascript(config) {
  return function(files, metalsmith, done) {
    var metadata = metalsmith.metadata();
    async.forEachOf(common.htmlfiles(files), function(file, filename, finished) {
      file.contents = new Buffer(doLessJavascript(file.contents, file));
      finished();
    }, function () {
      done();
    });
  }
};

exports = module.exports = lessjavascript;
exports.doLessJavascript = doLessJavascript;
