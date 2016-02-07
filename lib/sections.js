var async = require('async'),
    cheerio = require('cheerio'),
    common = require('./common.js');

function doSections(file) {
	if (!file.doSections) {
		return;
	}
  var $ = cheerio.load(file.contents);
	file.sections = [];
	
	var first = true;
	$('h2').each(function (i, elem) {
		var children = [];
		$(elem).parent().find('h3').each(function (i, child) {
			children.push({ text: $(child).text(), id: $(child).attr('id') });
		});
		if (!first) {
			file.sections.push({ text: $(elem).text(), id: $(elem).attr('id'), children: children });
		} else {
			file.sections.push({ text: $(elem).text(), id: "top", children: children });
		}
		first = false;
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
      doSections(file);
      finished();
    }, function () {
      done();
    });
  }
};

