var highlight = require('highlight.js'),
		async = require('async'),
    _ = require('underscore'),
    cheerio = require('cheerio'),
    common = require('./common.js');

function doHighlight(file) {
	var $ = cheerio.load(file.contents);
	
	$('div.listingblock pre').each(function (i, elem) {
		var code = $(elem).children('code');
		if ($(code).length == 0) {
			code = elem;
		}
		var classes = $(code).attr('class') || "";
		var match = classes.match(/(?:^|\w)language-(.+)(?:$|\w)/);
		if (match) {
			$(code).addClass('lang-' + match[1]);
			result = highlight.highlight(match[1], $(code).text(), true);
		} else if ($(this).parents('.noautohighlight').length) {
			return;
		} else {
			result = highlight.highlightAuto($(code).text());
			if (result.language) {
				$(code).addClass('lang-' + result.language);
			}
		}
		$(code).html(result.value);
	});

  file.contents = new Buffer($.html());
	return;
};

exports = module.exports = function(options) {
  highlight.configure(options);
  return function(files, metalsmith, done) {
		async.forEachOf(common.htmlfiles(files), function (file, filename, finished) {
			doHighlight(file);
			finished();
		}, function () {
			done();
		});
  }
}
module.exports.doHighlight = doHighlight;
