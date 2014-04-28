'use strict';

angular
  .module('quickplansApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'itemmirror'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
