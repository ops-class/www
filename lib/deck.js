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
	
		var background = $(elem).find("img").parents("div.background");
		var backgroundImage;
		if (background.length == 1) {
			backgroundImage = $(background).find("img").attr('src');
			$(background).remove();
			$(title).remove();
		}
		$(elem).replaceWith(function() {
			var section = $("<section />");
			section.append($(this).contents());
			section.attr('class', classes);
			section.attr('id', id);
			if (backgroundImage != undefined) {
				section.attr('style', 'background-image: url("' + backgroundImage + '");');
				section.addClass('canvas-image');
			}
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

	$("div.slider.ulist > ul").each(function (i, list) {
		$(list).children("li").each(function (j, item) {
			$(item).addClass("slide");
		});
	});
	$("div.slider.olist > ol").each(function (i, list) {
		$(list).children("li").each(function (j, item) {
			$(item).addClass("slide");
		});
	});

  $('<div class="anim-pause slide" data-what="iframe"></div>').insertAfter('iframe');
  $('<div class="anim-play slide" data-what="iframe"></div>').insertAfter('iframe');

	$("span.icon").each(function (i, elem) {
		var match = /\[(.*?)\]/.exec($(elem).text());
		if (match.length == 2) {
			$(elem).replaceWith('<span class="fa fa-' + match[1] + '"></span>');
		}
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

