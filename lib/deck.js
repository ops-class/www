var async = require('async'),
    _ = require('underscore'),
    cheerio = require('cheerio'),
    common = require('./common.js');

function doDeck(file) {
  var $ = cheerio.load(file.contents);
	if ($("div.deck-container").length == 0) {
		return;
	}
	var sections = $("div.sect1");
	if (sections.length == 0) {
		return;
	}
	$(sections).each(function (i, elem) {
		var classes = _.union(_.without($(elem).attr('class').split(/\s+/), 'sect1'), ["slide"]).join(" ");
		var title = $(elem).children().first();
		if (title[0].name != "h2") {
			console.log("Skipping bad section.");
			return;
		}
		var id = title.attr('id');
		title.removeAttr('id');
		$(elem).replaceWith(function() {
			var section = $("<section />");
			section.append($(this).contents());
			section.attr('class', classes);
			section.attr('id', id);
			return section;
		});
	});
	$("div.sectionbody").each(function (i, elem) {
		$(elem).replaceWith(function() {
			return $(this).contents();
		});
	});
	$("div.videoblock").each(function (i, elem) {
		$(elem).children("div.content").each(function (i, elem) {
			$(elem).replaceWith(function() {
				return $(this).contents();
			});
		});
	});
	$("iframe").each(function (i, elem) {
		$(elem).attr('src', $(elem).attr('src') + "&enablejsapi=1");
	});
  file.contents = new Buffer($.html());
	return;
};

module.exports = function(config) {
  return function(files, metalsmith, done) {
    async.forEachOf(common.htmlfiles(files), function(file, filename, finished) {
      doDeck(file);
      finished();
    }, function () {
      done();
    });
  }
};

