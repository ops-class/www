var path = require('path'),
    _ = require('underscore'),
    moment = require('moment-timezone');

function htmlfiles(files) {
  return _.pick(files, function(file, filename) {
    return (path.extname(filename) === '.html');
  });
}

function format_date(datetime, format, utc) {
  var common_formats = {
    normal: "M/D/YYYY",
    full: "M/D/YYYY [@] HH:mm [EDT]",
    name: "DD MMM YYYY",
    proposal: "M/YYYY",
    blog: "DD MMM YYYY [at] HH:mm [EDT]",
		xml: "ddd, DD MMM YYYY HH:mm:ss ZZ",
		file: "YYYY-MM-DD"
  };
  format = common_formats[format] || format;
  if (utc === undefined) {
    utc = true;
  }
  if (utc) {
    return moment.utc(datetime).format(format);
  } else {
    return moment.utc(datetime).tz("America/New_York").format(format);
  }
}

exports.htmlfiles = htmlfiles;
exports.format_date = format_date;
