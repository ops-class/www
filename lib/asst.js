var async = require('async'),
    cheerio = require('cheerio'),
    common = require('./common.js');

function doASST(file, metadata) {
	if (!file.asst) {
		return;
	}
	var match = file.path.match(/asst\/(\d+)/);
	if (match) {
		file.number = match[1];
		file.videos = metadata.asst.videos[file.number] || [];
		console.log(file.videos.length);
	}
};

module.exports = function(config) {
  return function(files, metalsmith, done) {
		var metadata = metalsmith.metadata();
    async.forEachOf(common.htmlfiles(files), function(file, filename, finished) {
      doASST(file, metadata);
      finished();
    }, function () {
      done();
    });
  }
};

