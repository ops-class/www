var async = require('async'),
    cheerio = require('cheerio'),
    common = require('./common.js');

function doHacks(file) {
  var $ = cheerio.load(file.contents);
	$("td[rowspan]").each(function (i, elem) {
		$(elem).parent('tr').addClass("has-rowspan");
	});
	$("iframe[src^='http:']").each(function (i, elem) {
		$(elem).attr('src', $(elem).attr('src').replace('http:', 'https:'));
	});
  file.contents = new Buffer($.html());
};

module.exports = function(config) {
  return function(files, metalsmith, done) {
    async.forEachOf(common.htmlfiles(files), function(file, filename, finished) {
      doHacks(file);
      finished();
    }, function () {
      done();
    });
  }
};

