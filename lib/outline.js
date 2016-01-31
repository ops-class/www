var async = require('async'),
    _ = require('underscore'),
    cheerio = require('cheerio'),
    common = require('./common.js');

function doOutline(file) {
	if (!file.outline) {
		return;
	}
  var $ = cheerio.load(file.contents);
	var sections = $("div.sect1");
	if (sections.length == 0) {
		return;
	}
	$("div.sectionbody").each(function (i, elem) {
		if ($(this).children().length == 0 &&
				(!($(this).text()) || $(this).text().trim() === "")) {
			$(this).remove();
		}
	});
	$("div.sect1").each(function (i, elem) {
		if ($(this).children().length < 2) {
			$(this).remove();
		} else if ($(this).hasClass('nooutline')) {
			$(this).remove();
		}
	});
	$("div.sect1 > h2:first-child").each(function (i, elem) {
		if ($(this).text().trim() == "!") {
			$(this).parent().remove();
			return;
		}
	});
	var last_section;
	$("div.sect1 > h2:first-child").each(function (i, elem) {
		if ($(this).text() && last_section && $(this).text().trim() == $(last_section).text().trim()) {
			var last_section_body = $(last_section).parent().children('.sectionbody').first();
			var this_section_body = $(this).parent().children('.sectionbody').first();
			$(last_section_body).append($(this_section_body).children());
			$(this).parent().remove();
			return;
		}
		last_section = this;
	});
	$("h2 > span.small").each(function (i, elem) {
		$(elem).removeClass('small');
	});
	$("img").parents('.background').remove();
	$("img").each(function (i, elem) {
		var match = /(\d+)%/.exec($(elem).attr('width'));
		if (match && match.length == 2) {
			$(elem).css('width', match[0]);
			$(elem).removeAttr('width');
		}
		var match = /(\d+)%/.exec($(elem).attr('height'));
		if (match && match.length == 2) {
			$(elem).css('height', match[0]);
			$(elem).removeAttr('height');
		}
	});
	$("iframe").each(function (i, elem) {
		$(elem).removeAttr('frameborder');
	});

  file.contents = new Buffer($.html());
	return;
};

module.exports = function(config) {
  return function(files, metalsmith, done) {
    async.forEachOf(common.htmlfiles(files), function(file, filename, finished) {
      doOutline(file);
      finished();
    }, function () {
      done();
    });
  }
};

