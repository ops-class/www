$(function() {
  $("#content a[href$='.pdf']")
    .attr("target","_blank")
    .click(function() {
      ga('send', 'pageview', $(this).attr('href'));
    });

  $('[data-toggle="popover"]').popover();
  $('body').on('click', function (e) {
    $('[data-toggle="popover"]').each(function () {
      if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
        $(this).popover('hide');
      }
    });
  });
  function isMobile() {
    try {
      document.createEvent("TouchEvent");
      return true;
    } catch (e) {
      return false;
    }
  }
  if (isMobile()) {
    $('#content.swipe').swipe({
      swipeLeft: function() {
        if ($("#content").data('next')) {
          window.location.replace($("#content").data('next'));
        }
      },
      swipeRight: function () {
        if ($("#content").data('previous')) {
          window.location.replace($("#content").data('previous'));
        }
      },
      threshold: 150,
      allowPageScroll: "auto"
    });
  }
});
