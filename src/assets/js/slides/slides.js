$(function() {
  $('<div class="anim-pause slide" data-what="iframe"></div>').insertAfter('iframe');
  $('<div class="anim-play slide" data-what="iframe"></div>').insertAfter('iframe');
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
