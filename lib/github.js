var async = require('async'),
		path = require('path'),
    _ = require('underscore');

function doGithub(file, filename) {
	if (!file.doGithub) {
		return;
	}
	file.github = {
		'blob': 'https://github.com/ops-class/www/blob/master/src/' + filename,
		'commits': 'https://github.com/ops-class/www/commits/master/src/' + filename
	}
	return;
};

function adocfiles(files) {
  return _.pick(files, function(file, filename) {
    return (path.extname(filename) === '.adoc');
  });
}

module.exports = function(config) {
  return function(files, metalsmith, done) {
    async.forEachOf(adocfiles(files), function(file, filename, finished) {
      doGithub(file, filename);
      finished();
    }, function () {
      done();
    });
  }
};

