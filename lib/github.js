var async = require('async'),
		path = require('path'),
    _ = require('underscore'),
    git = require('git-rev-sync');

function doGithub(file, filename) {
	var commitID = git.short();
	file.github = {
		'blob': 'https://github.com/ops-class/www/blob/master/src/' + filename,
		'commits': 'https://github.com/ops-class/www/commits/master/src/' + filename,
		'commit_id': commitID,
		'commit': 'https://github.com/blue-systems-group/www/commit/' + commitID
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

