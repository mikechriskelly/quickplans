define(['angular', 'app'], function(angular, app) {
  'use strict';

  return app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    //$locationProvider.html5Mode(true);

    $routeProvider.when('/', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl'
    });
    $routeProvider.when('/ui', {
      templateUrl: 'views/quickplans-ui.html',
      controller: 'MainCtrl'
    });
    $routeProvider.otherwise({redirectTo: '/'});
    
  }]);
});