define(['./module','angular'], function (directives,angular) {

  'use strict';

  directives.directive('initFocus', function() {
    var timer;
      
    return function(scope, elm, attr) {
      if (timer) clearTimeout(timer);     
      timer = setTimeout(function() {
        elm.focus();
      }, 0);
    };
  });
});

