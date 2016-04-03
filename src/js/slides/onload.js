$(function() {
	$("iframe[src^='//www.youtube.com']").each(function () {
		var attrs = $(this).attr('src').split("?")[1].split("&");
		var root = location.protocol + '//' + location.host;
		if (location.protocol == 'https:' && attrs.indexOf("enablejsapi=1") != -1) {
			$(this).attr('src', $(this).attr('src') + "&origin=" + root);
		}
	});
  $('iframe').each(function (e) {

    $(this)[0].pause = function () {
      if (!($(this).parents('body').hasClass('has-clones'))) {
        $(this)[0].contentWindow.postMessage('{"event": "command", "func": "pauseVideo", "args":""}', '*');
      }
    };
    $(this)[0].play = function () {
      if (!($(this).parents('body').hasClass('has-clones'))) {
        $(this)[0].contentWindow.postMessage('{"event": "command", "func": "playVideo", "args":""}', '*');
      }
    };
  });
  $.deck({dummy: ""});
});
