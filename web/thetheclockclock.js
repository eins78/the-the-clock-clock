$(document).ready(function () {
  
  // Config
  // 
  var config = cfg = {
    "refreshRate": 10 // in seconds
  };
  
  // Workflow
  //
  function workflow() {
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
        $list = $("#list"),
        $hourSlots,
        $currentSlot;
    
    // find entries per current hour, looping back in time
    while (!$hourSlots || !$hourSlots.length ) {
      $hourSlots = $list.find("[data-hour=\"" + hour + "\"]");
      hour = (hour === 0) ? (hour - 1) : 23 ;
    }
    
    // get current slot per minute, looping back in time
    while (!$currentSlot || !$currentSlot.length) {
      console.log(minute)
      $currentSlot = $hourSlots.filter("[data-minute=\"" + minute + "\"]");
      minute = (minute === 0) ? (minute - 1) : 59 ;
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