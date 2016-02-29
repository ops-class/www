var async = require('async'),
    _ = require('underscore'),
    cheerio = require('cheerio'),
    common = require('./common.js');

function doHacks(file) {
  var $ = cheerio.load(file.contents);
	$("td[rowspan]").each(function (i, elem) {
		$(elem).parent('tr').addClass("has-rowspan");
	});
	$("iframe[src^='http']").each(function (i, elem) {
		$(elem).attr('src', $(elem).attr('src').replace('http:', ''));
		$(elem).attr('src', $(elem).attr('src').replace('https:', ''));
	});
	$(".lazy-iframe").each(function (i, elem) {
		var id = $(this).attr('id');
		if (!id) {
			$(this).attr('id', "_lazy_iframe_" + i);
		}
	});
	$(".embed-responsive").each(function() {
		$(this).addClass('hidden-print');
	});
  file.contents = new Buffer($.html());
};

exports = module.exports = function(config) {
  return function(files, metalsmith, done) {
    async.forEachOf(common.htmlfiles(files), function(file, filename, finished) {
      doHacks(file);
      finished();
    }, function () {
			var metadata = metalsmith.metadata();
			metadata.sitemap = _.map(common.htmlfiles(files), function (file, filename) {
				return {
					filename: filename,
					priority: file.priority,
					updated: file.updated,
					changefreq: file.changefreq
				}
			});
			metadata.sitemap = _.sortBy(metadata.sitemap, function (file) {
				return file.priority || 0;
			}).reverse();
      done();
    });
  }
};
module.exports.doHacks = doHacks
