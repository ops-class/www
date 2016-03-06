var async = require('async'),
    cheerio = require('cheerio'),
    common = require('./common.js');

module.exports = function(config) {
  return function(files, metalsmith, done) {
    async.forEachOf(common.htmlfiles(files), function(file, filename, finished) {
			if (!file.title) {
				done(new Error('must provide a title for ' + filename));
			} else if (!file.description) {
				done(new Error('must provide a description for ' + filename));
			}
			file.title = file.title.replace(/<(?:.|\n)*?>/gm, '');
      finished();
    }, function () {
      done();
    });
  }
};

