(function($, deck, undefined) {
   $(document).bind('deck.change', function(e, from, to) {
      var $prev = $[deck]('getSlide', to-1),
      $next = $[deck]('getSlide', to+1),
      $oldprev = $[deck]('getSlide', from-1),
      $oldnext = $[deck]('getSlide', from+1);
      
      var direction = "forward";
      if(from > to){
        direction = "reverse";
      }

      $[deck]('getSlide', from).triggerHandler('deck.lostCurrent', [direction, from, to]);
      $[deck]('getSlide', to).triggerHandler('deck.becameCurrent', [direction, from, to]);

      $oldprev && $oldprev.triggerHandler('deck.lostPrevious', [direction, from, to]);
      $oldnext && $oldnext.triggerHandler('deck.lostNext', [direction, from, to]);

      $prev && $prev.triggerHandler('deck.becamePrevious', [direction, from, to]);
      $next && $next.triggerHandler('deck.becameNext', [direction, from, to]);
   });
})(jQuery, 'deck');

