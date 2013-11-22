$(document).ready(function () {
  
  // Config
  // 
  var config = cfg = {
    "refreshRate": 1, // in seconds
    "navHeight": 60,
    "debug": false
  };
  
  // 'global' set up
  var following = false,  // default is OFF
      runclock = true,
      // (jQuery) Objects
      $list = $("#list"),
      $btns = $("#switch").add("#start"),
      $time = $("#time"),
      $currentSlot = {};
  
  // run UI helpers
  setupButtons();
  setupClockUI();
  appleMobileHelper();
    
  // autostart if location says 'ON'
  if (window.location.hash === '#ON') {
    switchMode();
  }
  
  // Workflow
  //
  // runs in loop
  function follow() {
    
    getCurrentSlot(function ($slot) {
      log('slot', $slot);
      
      if (!$slot.is($currentSlot)) {
        
        if ($currentSlot.lenght) {
          $currentSlot.removeClass('active');
          $currentSlot.prop('id', '');
        }
        
        if ($('#beforeActive')) {
          $('#beforeActive').prop('id', '');
        }
    
        // highlight it
        $slot.prev().prop('id', 'beforeActive')
        $slot.addClass('active');
        
        // on first launch, go there by ID
        // (better mobile performance)
        if (!$currentSlot.lenght) {
          setLocation('beforeActive');
          setLocation('ON');
        }

        // scroll smoothly to element
        smoothScrollTo($slot);
        
        // save slot as currentSlot
        $currentSlot = $slot;

      }
      
      if (following) {
        setTimeout(follow, cfg.refreshRate * 1000);
      }
    
    });
  
  }
  
  // Functions
  // 
  // button setup
  function setupButtons() {
    $btns.click(function (e) {
      e.preventDefault;
      // console.log($(this).prop('href').toString())
      switchMode();
    }).removeClass('hidden');
    
    $('a.navbar-brand').click(function (e) {
      e.preventDefault;
      if (following) {
        switchMode();
      }
      smoothScrollTo($('#intro'));
    });
    
    $('#lightswitch').click(function (e) {
      e.preventDefault;
      $(this).find('.on, .off').toggleClass('hidden');
      lightSwitch();
    });
  }
  
  function setupClockUI() {
    var toggle = false;
    $time.removeClass('hidden');
    
    (function updateTime() {

      var str = (new Date).toTimeString()
        .replace(/(\d\d:\d\d).*$/, '$1')

      if (toggle) {
        str = str.replace(/:/, ' ');
      }
      toggle = !toggle;

      // update UI
      $time.find('kbd').html(str);
      
      // loop
      if (runclock) {
        setTimeout(updateTime, 1000);
      }
      else {
        $time.remove();
      }
    }());
    
  }
  
  // toggle the switch (when button is clicked)
  function switchMode() {
    // if it's OF
    if (!following) {
      // turn it ON
      following = true;
      // rewrite buttons href
      // $btns.prop('href', '#');
      // set window URL
      setLocation('ON');
      // if we've got a target from previous run, 
      if ($currentSlot.length) {
        // scroll to it.
        smoothScrollTo($currentSlot);
      }
      // start the loop
      follow();
    }
    // if it's ON
    else {
      // turn it OFF
      following = false;
      // rewrite buttons href
      // $btns.prop('href', '#follow');
      // set window URL
      setLocation('OFF');
    }
    
    $btns.find('.off').toggleClass('hidden');
    $btns.find('.on').toggleClass('hidden');
    
    $("#switch")
      .toggleClass('btn-default')
      .toggleClass('btn-primary');
      
  }
  
  // find the current slot
  function getCurrentSlot(callback) {
    
    var now = (new Date()),
        hour = now.getHours() || 0,
        minute = now.getMinutes() || 0,
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
  }
  
  // scroll to an $element
  function smoothScrollTo($element) {
    
    $('html,body').animate({
      scrollTop: $element.offset().top - cfg.navHeight
      // scrollTop: $element.offset().top
      //   -(($(window).height()-cfg.navHeight)/2)
      //   -(cfg.navHeight/2)
    }, 1500);
    
  }
  
  function setLocation(str) {
    if (typeof window.location.replace === 'function') {
      window.location.replace('#' + (str || ""));
    }
  }
  
  function appleMobileHelper() {
    if (window && window.navigator && window.navigator.userAgent) {
      var ua = window.navigator.userAgent;
      // if the UA says we are mobile Apple thing, 
      if (ua.match(/iPhone|iPod|iPad/)) {
        // set title to 'Clock' (for home screen), 
        $('head').find('title').html('Clock');
        // also kill the clock.
        runclock = false;
      }
    }
  }
  
  function lightSwitch() {
    $('body').toggleClass('dark');
  }
  
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