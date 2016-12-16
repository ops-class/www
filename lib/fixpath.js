var async = require('async');

function doFixPath(file) {
	if (file.path && !file.path.endsWith('/')) {
		file.path = file.path + "/";
	}
};

exports = module.exports = function(config) {
  return function(files, metalsmith, done) {
    async.forEachOf(files, function(file, filename, finished) {
      doFixPath(file);
      finished();
    }, function () {
      done();
    });
  }
};
