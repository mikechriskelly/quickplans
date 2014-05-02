require.config({
  baseUrl: '/scripts',
  paths: {
    'jQuery': '//ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min',
    'angular': '../bower_components/angular/angular',
    'angular-route': '../bower_components/angular-route/angular-route',
    'Dropbox': '//cdnjs.cloudflare.com/ajax/libs/dropbox.js/0.10.2/dropbox.min',
    'ItemMirror': 'http://keepingfoundthingsfound.com/apps/_shared/ItemMirror.min'
  },
  shim: {
    'angular' : {'exports' : 'angular'},
    'angular-route': ['angular'],
    'jQuery': {'exports' : 'jQuery'},
    'Dropbox' : {'exports': 'Dropbox'},
    //'ItemMirror' : {'exports': 'ItemMirror'}
  },
  priority: ['angular']
});

// Initialize the app
require(['jQuery', 'angular', 'angular-route', 'Dropbox', 'ItemMirror', 'app', 'routes'] , function ($, angular, Dropbox, ItemMirror, app, routes) {
  'use strict';

  // Confirm dependencies
  // console.log('jquery: ' + typeof($));
  // console.log('ItemMirror: ' + typeof(ItemMirror));
  // console.log('Dropbox: ' + typeof(Dropbox));

  $(function () { // using jQuery because it will run this even if DOM load already happened
    angular.bootstrap(document, ['app']);
  });

});