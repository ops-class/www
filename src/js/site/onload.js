function processPage() {
  if ($('div#content').length == 0 || $('div#content').hasClass('processed')) {
    return;
  }
  $('div#content').addClass('processed');

  $('body').scrollspy({ target: '#scrollspy' });

  // Turn on popovers and toggle on interior clicks.
  $('[data-toggle="popover"]').popover();
  $('body').on('click', function (e) {
    $('[data-toggle="popover"]').each(function () {
      if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
        $(this).popover('hide');
      }
    });
  });

  // Autoplay doesn't work on mobile devices, so convert youtube-containers
  // to lazy-iframes.
  if ($.browser.mobile) {
    $("div.youtube-container").each(function() {
      $(this).replaceWith('<div class="lazy-iframe" id="__lazy_iframe_' + $(this).data('id') + '" data-src="https://www.youtube.com/embed/' + $(this).data('id') + '?border=0"></div>');
    });
  }
  // Lazy YouTube video loading. The iFrame API has better ways but this is
  // fine for now.
  $("div.youtube-container").click(function() {
    var iframe = $('<iframe src="//www.youtube.com/embed/' +
        $(this).data('id') + '?border=0&autoplay=1" allowfullscreen></iframe>');
    $(iframe).load(function () {
      $(iframe).click();
    });
    $(this).children("img").first().replaceWith(iframe);
    $(this).children(".play-button").remove();
    $(this).unbind('mouseenter mouseleave');
  });
  $("div.youtube-container").hover(function() {
    var element = $(this).children(".play-button").first();
    $(element).addClass("hover");
    $(element).animate({ opacity: 1.0 }, 50);
  }, function () {
    var element = $(this).children(".play-button").first();
    $(element).removeClass("hover");
    $(element).css("opacity", 0.6);
  });

  // Handle showonclick divs.
  $(".showonclick").click(function() {
    $(this).addClass("visible");
    $(this).children(".showonclick-button").remove();
  });

  var throbbers = {};
  // Handle lazy-iframe's. Great for Google Calendar.
  $('.lazy-iframe').each(function() {
    var waypoint = new Waypoint.Inview({
      element: $(this)[0],
      enter: function(direction) {
        var elem = $("#" + this.element.id);
        var iframeID = this.element.id + '_iframe';
        var parentDiv = $(elem).closest('div.embed-responsive');
        var width = $(parentDiv).outerWidth();
        var height = $(parentDiv).outerHeight();
        if (width > 0 && height > 0) {
          var size = width / 5;
          if (height / 5 < size) {
            size = height / 5;
          }
          var throb = Throbber({
            color: 'black',
            size: size,
            fallback: '/img/ajax-loader.gif'
          });
          throb.appendTo($(parentDiv).get(0));
          var canvas = $(parentDiv).find('canvas').first();
          $(canvas).css('margin-left', 'auto');
          $(canvas).css('margin-right', 'auto');
          $(canvas).css('margin-top', (height - size) / 2 + 'px');
          throbbers[iframeID] = throb;
          throb.start();
        }
        $(elem).replaceWith('<iframe id="' + iframeID +
            '" src="' + $(elem).data("src") + '" allowfullscreen></iframe>');
        $('#' + iframeID).on("load", function() {
          if (throbbers[$(this).attr('id')]) {
            throbbers[$(this).attr('id')].stop();
          }
        });
        this.destroy();
      }
    });
  });

  // Load Google Analytics
  $.getScript("/js/analytics.js", function () {
    window.ga = window.ga || function() {
      (ga.q=ga.q || []).push(arguments)
    };
    ga.l =+ new Date;

    ga('create', 'UA-71773451-1', 'auto');
    ga('send', 'pageview');

    $("#content a[href$='.pdf']")
      .attr("target","_blank")
      .click(function() {
        ga('send', 'pageview', $(this).attr('href'));
      });
  });
}
$(processPage);

// vim: ts=2:sw=2:et
