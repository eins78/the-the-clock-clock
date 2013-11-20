$(document).ready(function () {
  
  // Config
  // 
  var config = cfg = {
    "refreshRate": 10 // in seconds
  },
      $list = $("#list");
  
  // Workflow
  //
  function workflow() {
    console.log("runs!");
    getCurrentSlot(function ($slot) {
      $slot.addClass('current');
    
      smoothScrollTo($slot);
    });
  }
  
  // Loop
  // 
  var loop = setInterval(workflow, cfg.refreshRate * 1000);
  
  // Functions
  // 
  // find the current slot
  function getCurrentSlot(callback) {
    
    var now = (new Date()),
        hour = now.getHours(),
        minute = now.getMinutes(),
        $hourSlots,
        $currentSlot;
    
    // find entries per current hour, looping back in time
    while (!$hourSlots || !$hourSlots.length ) {
      console.log("h: " + hour);
      $hourSlots = $list.find("[data-hour=\"" + hour + "\"]");
      
      hour = (hour !== 0) ? (hour - 1) : 23 ;
    }
    
    // get current slot per minute, looping back in time
    while (!$currentSlot || !$currentSlot.length) {
      console.log("m: " + minute);
      
      // if the search went back an hour
      if (hour !== now.getHours()) {
        // search from the end (backwards)
        minute = 59;
      }
      
      $currentSlot = $hourSlots.filter("[data-minute=\"" + minute + "\"]");
      minute = (minute !== 0) ? (minute - 1) : 59 ;
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