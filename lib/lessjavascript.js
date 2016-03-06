var async = require('async'),
    cheerio = require('cheerio'),
    common = require('./common.js');

function doLessJavascript(contents, file) {
  var $ = cheerio.load(contents);
  $("a[href^='http://'], a[href^='https://'], a[href^='//']")
		.not('.noexternal')
    .attr("target", "_blank");
  $("a[href^='http://'], a[href^='https://'], a[href^='//']")
    .not(":has(> img:first-child)")
    .not('.noexternal')
    .addClass('external');
  $("a[href^='http://'], a[href^='https://'], a[href^='//']").each(function () {
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
      $("#menu-" + prefix).addClass('active');
    }
    $('span.pullquote').each(function() { 
      var parentParagraph = $(this).parent('p'); 
      parentParagraph.css('position', 'relative'); 
      var pulledQuote = $(this).clone().addClass('pulledquote');
      $(parentParagraph).prepend(pulledQuote);
    });
  }
  $("div.tip")
    .addClass("alert alert-success")
    .attr("role", "alert")
    .find("td.icon")
    .replaceWith('<td class="icon"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span></td>');
  
  $("div.warning")
    .addClass("alert alert-warning")
    .attr("role", "alert")
    .find("td.icon")
    .replaceWith('<td class="icon"><span class="glyphicon glyphicon-alert" aria-hidden="true"></span></td>');
  
  $("div.caution")
    .addClass("alert alert-danger")
    .attr("role", "alert")
    .find("td.icon")
    .replaceWith('<td class="icon"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></td>');
	$("div.youtube-container").each(function (i, elem) {
		$(elem).append('<img class="youtube-thumb" src="//i.ytimg.com/vi/' +
				$(elem).data('id') +
				'/mqdefault.jpg" alt="YouTube placeholder"><div class="play-button"><span class="glyphicon glyphicon-play" aria-hidden="true"></span></div>');
	});
	$(".showonclick").each(function (i, elem) {
		$(elem).append('<div class="showonclick-button">Show</div>');
	});
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
