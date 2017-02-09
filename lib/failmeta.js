var async = require('async'),
		html_to_text = require('html-to-text'),
    common = require('./common.js');

module.exports = function(config) {
  return function(files, metalsmith, done) {
    async.forEachOf(common.htmlfiles(files), function(file, filename, finished) {
			if (!file.title && !file.no_title) {
				done(new Error('must provide a title for ' + filename));
			} else if (!file.description && !file.no_description) {
				done(new Error('must provide a description for ' + filename));
			}
			if (!file.no_title) {
				file.clean_title = html_to_text.fromString(file.title, {
					wordwrap: false,
					ignoreHref: true,
					ignoreImage: true,
					uppercaseHeadings: false
				}).replace(/<(?:.|\n)*?>/gm, '');
			}
      finished();
    }, function () {
      done();
    });
  }
};

