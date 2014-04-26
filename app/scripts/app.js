'use strict';

define(['angularAMD', 'angular-route', 'angular-cookies', 'angular-resource', 'angular-sanitize'], function (angularAMD) {
  var app = angular
    .module('quickplansApp', [
      'ngRoute',
      'ngCookies',
      'ngResource',
      'ngSanitize'
    ]);

  app.config(function ($routeProvider) {
    $routeProvider
      .when('/', angularAMD.route({
        templateUrl: 'views/imtest.html',
        controller: 'connect',
        controllerUrl: 'scripts/controllers/connect.js'
      }))
      .otherwise(angularAMD.route({
        redirectTo: '/'
      }));
  });
  angularAMD.bootstrap(app);
  return app;
});