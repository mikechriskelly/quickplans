define(['angular', 'app'], function(angular, app) {
  'use strict';

  return app.config(['$routeProvider', function($routeProvider) {

    $routeProvider.when('/', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl'
    });
    console.log('routeProvider');
    $routeProvider.otherwise({
      templateUrl: 'views/main.html',
      controller: 'MainCtrl'
    });
    
  }]);
});