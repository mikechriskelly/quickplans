require.config({
  baseUrl: '/scripts',
  paths: {
    'jQuery': '../bower_components/jquery/jquery.min',
    'jQuery-UI': '../bower_components/jquery-ui/ui/jquery-ui',
    'Rangy': '../bower_components/rangy/rangy-core',
    'Hallo': '../bower_components/hallo.js/hallo.min',
    'angular': '../bower_components/angular/angular',
    'angular-route': '../bower_components/angular-route/angular-route',
    'Dropbox': '//cdnjs.cloudflare.com/ajax/libs/dropbox.js/0.10.2/dropbox.min',
    'ItemMirror': 'http://keepingfoundthingsfound.com/apps/_shared/ItemMirror.min'
  },
  shim: {
    'angular' : {'exports' : 'angular'},
    'angular-route': ['angular'],
    'jQuery': {'exports' : 'jQuery'},
    'Rangy' : {'exports' : 'rangy'},
    'Dropbox' : {'exports': 'Dropbox'},
    'Hallo': ['jQuery', 'jQuery-UI' , 'Rangy']
    //'ItemMirror' : {'exports': 'ItemMirror'}
  },
  priority: ['angular']
});

// Initialize the app
require(['jQuery', 'angular', 'angular-route', 'Dropbox', 'ItemMirror', 'Hallo', 'app', 'routes'],
  function ($, angular, Dropbox, ItemMirror, Hallo, app, routes) {
    'use strict';

    // Confirm dependencies
    // console.log('jquery: ' + typeof($));
    // console.log('ItemMirror: ' + typeof(ItemMirror));
    // console.log('Dropbox: ' + typeof(Dropbox));

    $(function () { // using jQuery because it will run this even if DOM load already happened
      angular.bootstrap(document, ['app']);
    });
});