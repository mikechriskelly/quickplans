require.config({
  baseUrl: '/scripts',
  paths: {
    'jQuery': '//ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min',
    'angular': '//code.angularjs.org/1.2.0-rc.2/angular',
    'angular-route': '../bower_components/angular-route/angular-route.min',
    'Dropbox': '//cdnjs.cloudflare.com/ajax/libs/dropbox.js/0.10.2/dropbox.min',
    'ItemMirror': 'http://keepingfoundthingsfound.com/apps/_shared/ItemMirror.min'
  },
  shim: {
    'angular' : {'exports' : 'angular'},
    'angular-route': ['angular'],
    'jQuery': {'exports' : 'jQuery'},
    'Dropbox' : {'exports': 'Dropbox'},
    //'ItemMirror' : {'exports': 'ItemMirror'}
  }
});

require(['jQuery', 'angular', 'Dropbox', 'ItemMirror', 'app'] , function ($, angular, Dropbox, ItemMirror, app) {
  'use strict';

  // Confirm dependencies
  // console.log('jquery: ' + typeof($));
  // console.log('ItemMirror: ' + typeof(ItemMirror));
  // console.log('Dropbox: ' + typeof(Dropbox));

  $(function () { // using jQuery because it will run this even if DOM load already happened
    angular.bootstrap(document, ['app']);
  });
});