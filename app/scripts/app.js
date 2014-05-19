define([
  'angular',
  './controllers/index',
  './directives/index',
  './services/index'
  ], function (ng) {

  'use strict';

  // Check if dependencies are in scope
  // console.log('jquery: ' + typeof($));
  // console.log('ItemMirror: ' + typeof(ItemMirror));
  // console.log('Dropbox: ' + typeof(Dropbox));

    return ng.module('app', [
         'app.services',
         'app.controllers',
         'app.directives',
         'ngRoute'
    ]);
});

