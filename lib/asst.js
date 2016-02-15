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

