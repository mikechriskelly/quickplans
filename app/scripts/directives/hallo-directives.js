define(['./module','angular'], function (directives,angular) {

  'use strict';

  // Check if dependencies are in scope
  // console.log('jquery: ' + typeof($));
  // console.log('ItemMirror: ' + typeof(ItemMirror));
  // console.log('Dropbox: ' + typeof(Dropbox));

  directives.directive('hallo', function() {
      return {
          restrict: 'A',
          require: '?ngModel',
          link: function(scope, element, attrs, ngModel) {
              if (!ngModel) {
                  return;
              }

              element.hallo({
                 plugins: {}
              });

              ngModel.$render = function() {
                  element.html(ngModel.$viewValue || '');
              };

              element.on('hallodeactivated', function() {
                  ngModel.$setViewValue(element.html());
                  scope.$apply();
              });

              element.on('keydown', function($event){
                if($event.which === 13) {
                  $event.preventDefault();
                  element.next().focus();
                }
              });
          }
      };
  });
  
});

