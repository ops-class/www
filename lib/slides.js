var async = require('async'),
		path = require('path'),
    cheerio = require('cheerio'),
    common = require('./common.js');

function doSlides(file, filename, files) {
	if (!file.slides) {
		return;
	}
	var basename = path.basename(filename, path.extname(filename));
	if (basename !== 'index') {
		var file_path = path.join('slides',
				common.format_date(file.date, "file") + "-" + basename)
			.replace('\\', '/');
		file.path = file_path;
		delete files[filename];
		files[path.join(file_path, 'index.html')] = file;
	}
};

module.exports = function(config) {
  return function(files, metalsmith, done) {
    async.forEachOf(common.htmlfiles(files), function(file, filename, finished) {
      doSlides(file, filename, files);
      finished();
    }, function () {
      done();
    });
  }
};

