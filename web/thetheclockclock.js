$(document).ready(function () {
  
  // Config
  // 
  var config = cfg = {
    "refreshRate": 10 // in seconds
  },
      $list;
      
  
  // Workflow
  //
  // get list
  $list = $("#list");
  
  // runs in loop
  (function workflow() {
    
    getCurrentSlot(function ($slot) {
      
      // highlight it
      $slot.addClass('current');
      smoothScrollTo($slot);

      // loop
      setTimeout(workflow, cfg.refreshRate * 1000);

    });
  }());
  
  // Functions
  // 
  // find the current slot
  function getCurrentSlot(callback) {
    
    var now = (new Date()),
        hour = now.getHours(),
        minute = now.getMinutes(),
        $hourSlots = {},
        $currentSlot = {};
    
    
    function findByHour(h) {
      console.log("h: " + hour);
      return $list.find("[data-hour=\"" + h + "\"]");
    }
    
    function findByMinute(m) {
      console.log("m: " + m);
      return $hourSlots.filter("[data-minute=\"" + m + "\"]");
    }
    
    console.log("runs! " + now);

    // find entries per current hour, 
    $hourSlots = findByHour(hour);
    // and current minute.
    $currentSlot = findByMinute(minute);
    
    // loop back in time if nothing found
    while (!$hourSlots.length || !$currentSlot.length) {
        if (minute > 0) {
          minute = minute - 1;
          $currentSlot = findByMinute(minute);
        }
        else {
          minute = 59;
          // go back 1 hour
          hour = (hour > 0) ? (hour - 1) : 23 ;
          // search from the end of hour (backwards)
          minute = 59;
          $hourSlots = findByHour(hour);
        }
    }
    
    // done
    callback($currentSlot);
  };
  
  // scroll to an $element
  function smoothScrollTo($element) {
    
    $('html,body').animate({
      scrollTop: $element.offset().top
    }, 1000);
    
  };
});