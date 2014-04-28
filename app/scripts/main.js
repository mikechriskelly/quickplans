'use strict';

require.config({
  baseUrl: 'scripts',
  paths: {

    // Locally Hosted Libraries
    'angular': '../bower_components/angular/angular.min',
    'angular-route': '../bower_components/angular-route/angular-route.min',
    'angular-resource': '../bower_components/angular-resource/angular-resource',
    'angular-cookies': '../bower_components/angular-cookies/angular-cookies',
    'angular-sanitize': '../bower_components/angular-sanitize/angular-sanitize',
    'angularAMD': '../bower_components/angularAMD/angularAMD.min',
    'bootstrap': '../bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap',

    // Externally Hosted Libraries
    'itemmirror': '../bower_components/itemmirror/index',
    'Dropbox': '//cdnjs.cloudflare.com/ajax/libs/dropbox.js/0.10.2/dropbox.min'
  },
  shim: {
    'angularAMD': ['angular'],
    'angular-route': ['angular'],
    'angular-cookies': ['angular'],
    'angular-resource': ['angular'],
    'angular-sanitize': ['angular'],
    'itemmirror': {exports: 'ItemMirror', deps: ['angular']},
    'Dropbox': {exports:'Dropbox'}
  },
  deps: ['app']
});