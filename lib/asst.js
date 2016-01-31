var async = require('async'),
    cheerio = require('cheerio'),
    common = require('./common.js');

function doASST(file) {
	if (!file.asst) {
		return;
	}
	var match = file.path.match(/asst\/(\d+)/);
	if (match) {
		file.number = match[1];
	}
  var $ = cheerio.load(file.contents);
	file.sections = [];
	$('h2').each(function (i, elem) {
		var children = [];
		$(elem).parent().find('h3').each(function (i, child) {
			children.push({ text: $(child).text(), id: $(child).attr('id') });
		});
		file.sections.push({ text: $(elem).text(), id: $(elem).attr('id'), children: children });
	});
	$('*').each(function (i, elem) {
		var id = $(elem).attr('id');
		if (!id) {
			return;
		}
		$(elem).before('<a class="anchor" id="' + id + '"></a>');
		$(elem).removeAttr('id');
	});
  file.contents = new Buffer($.html());
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

