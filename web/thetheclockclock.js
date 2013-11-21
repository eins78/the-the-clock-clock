$(document).ready(function () {
  
  // Config
  // 
  var config = cfg = {
    "refreshRate": 1, // in seconds
    "navHeight": 60,
    "debug": true
  };
  
  // Workflow
  //
  // set up
  var following = false,
      started   = false,
      $list = $("#list"),
      $btns = $("#switch").add("#start");
  
  // buttons handlers
  setupButtons();
  
  // runs in loop
  function follow() {
    
    if (following) {
      
      getCurrentSlot(function ($slot) {
        log('slot', $slot);
      
        // highlight it
        $list.find('.active').removeClass('active');
      
        $slot.addClass('active');
        smoothScrollTo($slot);

        loop();
      });
      
    }
    else {
      loop();
    }
    
  }
  
  // Functions
  // 
  // loop
  function loop(argument) {
    started = true;
    setTimeout(follow, cfg.refreshRate * 1000);
  }
  
  function setupButtons() {
    $btns.click(function (event) {
      event.preventDefault;
      switchMode();
    });
    $('a.navbar-brand').click(function () {
      if (following) {
        switchMode();
        // if (scrollTo) {
        //   scrollTo(0);
        // }
        return true;
      }
    });
  }
  
  // toggle the switch
  function switchMode() {
    if (!started) {
      loop();
    }
    following = !following;
    $btns.find('.off').toggleClass('hidden');
    $btns.find('.on').toggleClass('hidden');
    
    $("#switch")
      .toggleClass('btn-default')
      .toggleClass('btn-primary');
  }
  
  // find the current slot
  function getCurrentSlot(callback) {
    
    var now = (new Date()),
        hour = now.getHours(),
        minute = now.getMinutes(),
        $hourSlots = {},
        $currentSlot = {};
    
    
    function findByHour(h) {
      log("h", hour);
      return $list.find("[data-hour=\"" + h + "\"]");
    }
    
    function findByMinute(m) {
      log("m", m);
      return $hourSlots.filter("[data-minute=\"" + m + "\"]");
    }
    
    log("runs! " + now);

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
      scrollTop: $element.offset().top - cfg.navHeight
    }, 1500);
    
  };
  
  function log(str, obj) {
    var data;
    if (cfg.debug) {
      if (obj) {
        try {
          data = JSON.stringify(obj);
        }
        catch (err){
          // console.log(err)
        }
      }
      console.log(str + (data ? ": " + data : ""), obj ? obj : null);
    }
  }
});