var async = require('async'),
		path = require('path'),
    _ = require('underscore'),
    common = require('./common.js');

function doSlides(file, filename, files) {
	var basename = path.basename(filename, path.extname(filename));
	if (basename !== 'index') {
		var slug = common.format_date(file.date, "file") + "-" + basename;
		var file_path = path.join('slides', slug).replace('\\', '/');
		file.path = file_path;
		file.slug = slug;
		delete files[filename];
		file.slide_path = file_path
		files[path.join(file_path, 'index.html')] = file;
	}
};

module.exports = function(config) {
  return function(files, metalsmith, done) {
    async.forEachOf(common.htmlfiles(files), function(file, filename, finished) {
			if (!(file.slides == true)) {
				finished();
				return;
			}
      doSlides(file, filename, files);
      finished();
    }, function () {
      done();
    });
  }
};

