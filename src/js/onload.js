$(function() {
	// Generate Google Analytics events for PDFs.
  $("#content a[href$='.pdf']")
    .attr("target","_blank")
    .click(function() {
      ga('send', 'pageview', $(this).attr('href'));
    });

	// Turn on popovers and toggle on interior clicks.
  $('[data-toggle="popover"]').popover();
  $('body').on('click', function (e) {
    $('[data-toggle="popover"]').each(function () {
      if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
        $(this).popover('hide');
      }
    });
  });
	
	// Lazy YouTube video loading. The iFrame API has better ways but this is
	// fine for now.
	$("div.youtube-container").click(function() {
		var iframe = document.createElement("iframe");
		iframe.setAttribute("src", "//www.youtube.com/embed/" + this.dataset.id + "?autoplay=1&border=0");
		iframe.setAttribute("allowfullscreen", "1");
		$(this).children("img").first().replaceWith(iframe);
		$(this).children(".play-button").remove();
	});
	
	// Handle showonclick divs.
	$(".showonclick").click(function() {
		$(this).addClass("visible");
		$(this).children(".showonclick-button").remove();
	});
	
	// Handle lazy-iframe's. Great for Google Calendar.
	$('.lazy-iframe').each(function() {
		var waypoint = new Waypoint.Inview({
			element: $(this)[0],
			enter: function(direction) {
				var elem = $("#" + this.element.id);
				$(elem).replaceWith('<iframe src="' + $(elem).data("src") + '"></iframe>');
				this.destroy();
			}
		});
	});
});
