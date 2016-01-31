var async = require('async'),
    cheerio = require('cheerio'),
    common = require('./common.js');

function doASST(file) {
	if (!file.asst) {
		return;
	}
  var $ = cheerio.load(file.contents);
	file.sections = [];
	$('h2').each(function (i, elem) {
		var children = [];
		$(elem).parent().find('h3').each(function (i, child) {
			children.push({ text: $(child).text(), id: $(child).attr('id') });
		});
		console.log(children);
		file.sections.push({ text: $(elem).text(), id: $(elem).attr('id'), children: children });
	});
  //file.contents = new Buffer($.html());
	return;
};

module.exports = function(config) {
  return function(files, metalsmith, done) {
    async.forEachOf(common.htmlfiles(files), function(file, filename, finished) {
      doASST(file);
      finished();
    }, function () {
      done();
    });
  }
};

