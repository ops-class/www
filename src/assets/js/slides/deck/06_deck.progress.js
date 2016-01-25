/*!
Deck JS - deck.progress
Copyright (c) 2014 Rémi Emonet
Dual licensed under the MIT license.
https://github.com/imakewebthings/deck.js/blob/master/MIT-license.txt
*/

/*
This module adds a (current)/(total) style status indicator to the deck.

It is designed to be a drop-in replacement of deck.status, but on steroïds.
Note however, that it does not handle the countNested=true case.
*/
(function($, undefined) {
    var $document = $(document);
    var rootCounter;
    var INITEVENT = "dummyinit";
    var SIZEEVENT = "dummysize";
    
    var updateCurrent = function(event, from, to) {
        var opts = $.deck('getOptions');
        var currentSlideNumber = to + 1;
        var $container = $.deck('getContainer');
        currentSlideNumber = $.deck('getSlide', to).data('rootSlide');
        $(opts.selectors.statusCurrent).text(currentSlideNumber);

        var icur = 0;
        for (; icur < $.deck('getSlides').length; icur++) {
            var top = $.deck('getSlide', icur).data('rootSlide');
            if (top == currentSlideNumber) {
                break;
            }
        }
        var last = null;
        var currentDetail = to;
        var lastDetail = icur;
        for (; icur < $.deck('getSlides').length; icur++) {
            last = $.deck('getSlide', icur).data('rootSlide');
            lastDetail = icur+1;
            if ($.deck('getSlide', icur).filter(opts.selectors.statusFakeEnd).size() > 0) break;
        }
	$(opts.selectors.statusTotal).text(last);

        // handle the data-progress
        var progresses = $('*['+opts.dataProgress+'], *['+opts.dataProgressOnce+'], *['+opts.dataProgressSize+']');
        if (progresses.size() > 0) {
            var visibleSlide = $.deck('getSlide').parentsUntil(opts.selectors.container).addBack().filter(opts.selectors.slides);
            // the eval context
            var slide = visibleSlide.get(0).getBoundingClientRect();
            var screen = {width: $container.innerWidth(), height: $container.innerHeight()};
            var n = currentSlideNumber;
            var N = last;
            var fullTotal = $.deck('getTopLevelSlides').length;
            var detail = {n: currentDetail+1, N: lastDetail, fullTotal: $.deck('getSlides').length};
            var designRatio = Math.max(slide.width / opts.designWidth, slide.height / opts.designHeight);
            var o = opts;
            var p = n/N;
            var pFull = n/fullTotal;
            detail.p = detail.n/detail.N;
            detail.pFull = detail.n/detail.fullTotal;
            // 
            progresses.each(function(i, el) {
                var spe = {
                    bottom: function(fontSize, botByRatio, botFixed) {
                        botFixed = botFixed || 0;
                        $(el).css('font-size', (fontSize * designRatio)+"px");
                        $(el).css('top', (slide.bottom - botFixed - botByRatio*designRatio)+'px');
                    },
                    top: function(fontSize, topByRatio, topFixed) {
                        topFixed = topFixed || 0;
                        $(el).css('font-size', (fontSize * designRatio)+"px");
                        $(el).css('top', (slide.top + topFixed + topByRatio*designRatio)+'px');
                    }
                };
                var att = $(el).attr(event == INITEVENT ? opts.dataProgressOnce : event == SIZEEVENT ? opts.dataProgressSize : opts.dataProgress);
                if (att == null || att.length == 0) return;
                var tasks = att.split(/ *; */);
                for (t in tasks) {
                    var parts = tasks[t].split(/ *: */);
                    if (parts.length != 2) {
                        if (opts.alert.wrongDataProgress) alert(
                            "There seem to be a problem with the following data-progress of\n   '" +tasks[t]+ "'\n");
                    } else {
                        var what = parts[0];
                        var expr = parts[1];
                        var val = eval(expr);
                        if (what == "") {
                            // skip: expected to be some "magic", e.g. custom code or call to helpers
                        } else if (what.substring(0,1) == "@") {
                            // special attribute setting, not css
                            what = what.substring(1);
                            $(el).attr(what, val);
                        } else if (what == "$text") {
                            $(el).text(val);
                        } else if (what == "$html") {
                            $(el).html(val);
                        } else {
                            $(el).css(what, val);
                        }
                    }
                }
            });
        }
    };
    
    var markRootSlides = function() {
        var opts = $.deck('getOptions');
        var slideTest = $.map([
            opts.classes.before,
            opts.classes.previous,
            opts.classes.current,
            opts.classes.next,
            opts.classes.after
        ], function(el, i) {
            return '.' + el;
        }).join(', ');
        
        rootCounter = 0;
        $.each($.deck('getSlides'), function(i, $slide) {
            var $parentSlides = $slide.parentsUntil(
                opts.selectors.container,
                slideTest
            );
            
            if ($parentSlides.length) {
                $slide.data('rootSlide', $parentSlides.last().data('rootSlide'));
            }
            else {
                ++rootCounter;
                $slide.data('rootSlide', rootCounter);
            }
        });
    };
    
    var fireEventOnCurrentSlide = function(ev) {
        var slides = $.deck('getSlides');
        var $currentSlide = $.deck('getSlide');
        var index;
        
        $.each(slides, function(i, $slide) {
            if ($slide === $currentSlide) {
                index = i;
                return false;
            }
        });
        updateCurrent(ev, index, index);
    };
    
    var setTotalSlideNumber = function() {
        var opts = $.deck('getOptions');
        var slides = $.deck('getSlides');
        
        var nSlides = $.deck('getTopLevelSlides').length;
	$(opts.selectors.statusFullTotal).text(nSlides);

    };
    
    /*
      Extends defaults/options.
      
      opts.selectors.statusCurrent
      The element matching this selector displays the current slide number.
      
      opts.selectors.statusTotal
      The element matching this selector displays the total number of slides.
      
      opts.countNested
      If false, only top level slides will be counted in the current and
      total numbers.
    */
    $.extend(true, $.deck.defaults, {
        selectors: {
            statusCurrent: '.deck-status-current',
	    statusTotal: '.deck-status-total',
	    statusFakeEnd: '.deck-status-fake-end',
	    statusFullTotal: '.deck-status-full-total',
	    progress10: '.deck-progress-10'
        },
        alert: {
            wrongDataProgress: true,
            possibleDebounceProblem: true
        },
        dataProgress: "data-progress",
        dataProgressOnce: "data-progress-once",
        dataProgressSize: "data-progress-size",
        progressSizeDebounce: 201 /* somewhat, it should be bigger that the fit debounce */
    });
    
    $document.bind('deck.init', function() {
        var opts = $.deck('getOptions');
        $(opts.selectors.progress10).attr(opts.dataProgressSize, ':spe.bottom(10, 12)')
        markRootSlides();
        fireEventOnCurrentSlide(INITEVENT);
        fireEventOnCurrentSlide(SIZEEVENT);
        setTotalSlideNumber();
    });
    var timer = -1;
    $(window).unbind('resize.deckprogress').bind('resize.deckprogress', function() {
        var opts = $.deck('getOptions');
        if (opts.alert.possibleDebounceProblem && opts.progressSizeDebounce < opts.scaleDebounce + 1) {
            alert(
                "There might be a problem with the respective debounce value:\n   progressSizeDebounce: "+opts.progressSizeDebounce+"\n   scaleDebounce: "+opts.scaleDebounce);

        }
        window.clearTimeout(timer);
        timer = window.setTimeout( function() {
            fireEventOnCurrentSlide(SIZEEVENT);
            fireEventOnCurrentSlide("fire also the update event as some things might also need resizing");
        }, opts.progressSizeDebounce);
    });
    $document.bind('deck.change', updateCurrent);
})(jQuery, 'deck');

