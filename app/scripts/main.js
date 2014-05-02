require.config({
  baseUrl: '/scripts',
  paths: {
    'jQuery': '//ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min',
    'angular': '//code.angularjs.org/1.2.0-rc.2/angular',
    'Dropbox': '//cdnjs.cloudflare.com/ajax/libs/dropbox.js/0.10.2/dropbox.min',
    'requirejs': '//cdnjs.cloudflare.com/ajax/libs/require.js/2.1.8/require'
  },
  shim: {
    'angular' : {'exports' : 'angular'},
    'jQuery': {'exports' : 'jQuery'},
  }
});

require(['jQuery', 'angular', 'Dropbox', 'ItemMirror', 'app'] , function ($, angular, Dropbox, ItemMirror, app) {
  'use strict';
  $(function () { // using jQuery because it will run this even if DOM load already happened
    angular.bootstrap(document, ['app']);
  });
});