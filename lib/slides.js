var async = require('async'),
		path = require('path'),
    _ = require('underscore'),
    common = require('./common.js');

function doSlides(file, filename, files) {
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
		
    var metadata = metalsmith.metadata();
		metadata.slides = _.filter(metadata.slides, function (s) {
			return s.slides == true;
		});
		metadata.slides = metadata.slides.sort(function (s1, s2) {
			s1_date = s1.date.getTime();
			s2_date = s2.date.getTime();
			return s1_date > s2_date ? -1 : s1_date < s2_date ? 1 : 0;
		});

    async.forEachOf(common.htmlfiles(files), function(file, filename, finished) {
			if (!file.slides) {
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

