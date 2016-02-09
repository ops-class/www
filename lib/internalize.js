var debug = require('debug')('metalsmith-internalize'),
    path = require('path'),
    fs = require('fs'),
    async = require('async'),
    _ = require('underscore'),
    cheerio = require('cheerio'),
    request = require('request'),
    minimatch = require('minimatch'),
    MD5 = require('md5');

request = request.defaults({ jar: request.jar() });

var defaults = {
  'verbose': true,
  'failWithoutNetwork': true,
  'failErrors': true,
	'cacheImages': true,
	'imgDirectory': 'img'
}

function processConfig(config, src) {
  config = config || {};
  config = _.extend(_.clone(defaults), config);
  if (src) {
		config.imgDir = path.join(src, config.imgDirectory);
	}
  return config;
}

function stripURL(url) {
	url = url.split("#")[0];
	url = url.split("?")[0];
	return url;
}

function internalize(config) {
	return function(files, metalsmith, done) {

		config = processConfig(config);
			
		var fileImages = {};
		var allImages = {};
		
		var imgPattern = new RegExp(/((?:http\:|https\:|\/\/).*)/);
		var backgroundPattern = new RegExp(/^url\("((?:http\:|https\:|\/\/).*?)"\)/);
    
		var htmlfiles = _.pick(files, function(file, filename) {
      return (path.extname(filename) === '.html');
    });

		async.series([
				function (callback) {
					request("http://www.google.com", function (error, response, body) {
						if (error || !response || response.statusCode != 200) {
							console.log("metalsmith-internalize: network failure");
							if (config.failWithoutNetwork) {
								removeFiles(files, config);
								done(new Error("network failure"));
								return;
							} else {
								done();
								return;
							}
						} else {
							callback();
						}
					});
				},
				function (callback) {
					async.forEachOf(htmlfiles, function (file, filename, finished) {
						fileImages[filename] = [];
						var $ = cheerio.load(file.contents);
						$('*').each(function (i, elem) {
							if ($(elem).is('img')) {
								var match = imgPattern.exec($(elem).attr('src'));
								if (!match) {
									return;
								}
								fileImages[filename].push(match[1]);
							}

							if ($(elem).css('background-image')) {
								var match = backgroundPattern.exec($(elem).css('background-image'));
								if (!match) {
									return;
								}
								fileImages[filename].push(match[1]);
							}
						});
						finished();
					},
					function() {
						var imageList = [];
						_.each(fileImages, function (images) {
							imageList = _.union(imageList, images);
						});
						_.each(imageList, function (image) {
							var hash = MD5(image);
							var name = stripURL(image);
							var filename = path.join(metalsmith.source(), config.imgDirectory, 'internalize', hash + path.extname(name));
							var getImage = true;
							if (config.cacheImages) {
								try {
									fs.accessSync(filename, fs.R_OK);
									getImage = false;
								} catch (err) {};
							}
							allImages[image] = {
								filename: path.join(config.imgDirectory, 'internalize' , hash + path.extname(name)),
								get: getImage,
								succeeded: !getImage
							}
						});
						callback();
					});
				},
				function (callback) {
					try {
						fs.mkdirSync(path.join(metalsmith.source(), config.imgDirectory, 'internalize'));
					} catch (err) {};
					async.forEachOfLimit(allImages, 8, function (filename, image, finished) {
						if (!filename.get) {
							return;
						}
						if (image.indexOf("//") == 0) {
							image = "http:" + image;
						}
						var options = {
							'uri': image,
							'headers': {
								'User-Agent': "Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410."
							},
							'maxRedirects': 5
						};
						try {
							request(options).pipe(fs.createWriteStream(path.join(metalsmith.source(), filename.filename)));
							filename.succeeded = true;
						} catch (err) {};
						finished();
					});
					callback();
				},
				function (callback) {
					async.forEachOf(htmlfiles, function (file, filename, finished) {
						var $ = cheerio.load(file.contents);
						$('*').each(function (i, elem) {
							if ($(elem).is('img')) {
								var match = imgPattern.exec($(elem).attr('src'));
								if (!match) {
									return;
								}
								if (allImages[match[1]] && allImages[match[1]].succeeded) {
									$(elem).attr('src', "/" + allImages[match[1]].filename);
								}
							}

							if ($(elem).css('background-image')) {
								var match = backgroundPattern.exec($(elem).css('background-image'));
								if (!match) {
									return;
								}
								if (allImages[match[1]].succeeded) {
									$(elem).css('background-image', 'url("/' + allImages[match[1]].filename + '")');
								}
							}
						});
						file.contents = new Buffer($.html());
						finished();
					});
					callback();
				}
		],
		function() {
			done();
		});
	}
};

exports = module.exports = internalize
exports.defaults = defaults;
exports.processConfig = processConfig;
