var async = require('async'),
		path = require('path'),
    _ = require('underscore');

function doGithub(file, filename) {
	file.github = {
		'blob': 'https://github.com/ops-class/www/blob/master/src/' + filename,
		'commits': 'https://github.com/ops-class/www/commits/master/src/' + filename
	}
	return;
};

function githubFiles(files) {
  return _.pick(files, function(file, filename) {
		return file.doGithub;
  });
}

module.exports = function(config) {
  return function(files, metalsmith, done) {
    async.forEachOf(githubFiles(files), function(file, filename, finished) {
      doGithub(file, filename);
      finished();
    }, function () {
      done();
    });
  }
};

