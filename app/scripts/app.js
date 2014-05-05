define(['angular', 'ItemMirror'], function (angular, ItemMirror) {

  'use strict';

  // Check if dependencies are in scope
  // console.log('jquery: ' + typeof($));
  // console.log('ItemMirror: ' + typeof(ItemMirror));
  // console.log('Dropbox: ' + typeof(Dropbox));

  var app = angular.module('app' , ['ngRoute']);

  app.factory('IM', function($q) {

    var dropboxClientCredentials = {
      key: 'jrt7eykb5odmd98',
      secret: 'ayrxakqedjss46f'
    };

    var dropboxClient = new Dropbox.Client(dropboxClientCredentials);

    var dropboxXooMLUtility = {
      driverURI: 'DropboxXooMLUtility',
      dropboxClient: dropboxClient
    };
    var dropboxItemUtility = {
      driverURI: 'DropboxItemUtility',
      dropboxClient: dropboxClient
    };
    var mirrorSyncUtility = {
      utilityURI: 'MirrorSyncUtility'
    };

    // Staring folder in Dropbox
    var groupingItemURI = '/';

    // Set up all of the item mirror options, even though
    //chances are the only one you're going to use is case 3
    var itemMirrorOptions = {
      1: {
        groupingItemURI: groupingItemURI,
        xooMLDriver: dropboxXooMLUtility,
        itemDriver: dropboxItemUtility
      },
      2: {
        groupingItemURI: groupingItemURI,
        xooMLDriver: dropboxXooMLUtility,
        itemDriver: dropboxItemUtility,
        syncDriver: mirrorSyncUtility,
        readIfExists: false
      },
      3: {
        groupingItemURI: groupingItemURI,
        xooMLDriver: dropboxXooMLUtility,
        itemDriver: dropboxItemUtility,
        syncDriver: mirrorSyncUtility,
        readIfExists: true
      }
    };

    return {
      
      connectDropbox : function() {
        var deferred = $q.defer();
        dropboxClient.authenticate(function (error, client) {
          
          console.log('Dropbox object:');
          console.dir(client);

          if (error) { deferred.reject(error); }
          deferred.resolve(client);
        });
        return deferred.promise;
      },

      constructNewItemMirror : function() {
        var deferred = $q.defer();
        new ItemMirror(itemMirrorOptions[3], function (error, itemMirror) {

          console.log('itemMirror object step 1:');
          console.log(itemMirror);

          if (error) { deferred.reject(error); }
          deferred.resolve(itemMirror);
        });
        return deferred.promise;
      },

      listAssoc : function(itemMirror) {
        var deferred = $q.defer();
        itemMirror.listAssociations(function (error, GUIDs) {

          console.log('itemMirror object step 2:');
          console.log(itemMirror);
          console.log('GUIDs: ' + GUIDs);
       
          if (error) { deferred.reject(error); }
          deferred.resolve([itemMirror, GUIDs]);
        });
        return deferred.promise;
      },

      displayAssoc : function(itemMirrorGUID) {
        var deferred = $q.defer();
        var itemMirror = itemMirrorGUID[0];
        var GUID = itemMirrorGUID[1];

        itemMirror.getAssociationDisplayText(GUID[0], function(error, displayText) {

          console.log('itemMirror object step 3:');
          console.log(itemMirror);
          console.log('Text: ' + displayText);

          if (error) { deferred.reject(error); }
          deferred.resolve(displayText);
        });
        return deferred.promise;
      },

      displayAllAssoc : function(itemMirrorGUID) {
        
        var promiseArray = [];
        var itemMirror = itemMirrorGUID[0];
        var GUIDs = itemMirrorGUID[1];

        for(var i = 0; i < GUIDs.length; i++ ) {
          itemMirror.getAssociationDisplayText(GUIDs[i], function(error, displayText) {
            var deferred = $q.defer();
            if (error) { deferred.reject(error); }
            deferred.resolve(displayText);
            promiseArray.push(deferred.promise);
          });
        }
        return $q.all(promiseArray);
      }
    };
  });

  app.controller('AppController', function AppController($scope) {
    $scope.name = 'World!';
  });

  app.controller('MainCtrl', function MainCtrl($scope, IM) {
    $scope.status = 'Loading Associations...';

    IM.connectDropbox()
    .then(IM.constructNewItemMirror)
    .then(function(result) {
      $scope.itemMirror = result;
      return result;
    })
    .then(IM.listAssoc)
    .then(IM.displayAllAssoc)
    .then(function(result) {
      $scope.associations = result;
      $scope.status = 'success';
      $scope.loaded = true;
    });
  });

  return app;
});

