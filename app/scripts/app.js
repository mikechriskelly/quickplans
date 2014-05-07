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

    var IM = {};
      
    IM.connectDropbox = function() {
      var deferred = $q.defer();

      dropboxClient.authenticate(function (error, client) {
        
        console.log('Dropbox object:');
        console.dir(client);

        if (error) { deferred.reject(error); }
        deferred.resolve(client);
      });
      return deferred.promise;
    };

    IM.constructItemMirror = function() {
      var deferred = $q.defer();
      new ItemMirror(itemMirrorOptions[3], function (error, itemMirror) {

        // Save itemMirror object into factory object for reuse
        IM.itemMirror = itemMirror;

        if (error) { deferred.reject(error); }
        deferred.resolve(itemMirror);
      });
      return deferred.promise;
    };

    IM.getAssociationGUIDs = function() {
      var deferred = $q.defer();
      IM.itemMirror.listAssociations(function (error, GUIDs) {

        // Save GUIDs into factory object for reuse
        IM.GUIDs = GUIDs;
     
        if (error) { deferred.reject(error); }
        deferred.resolve(GUIDs);
      });
      return deferred.promise;
    };

    IM.getAssociationName = function(GUID) {
      var deferred = $q.defer();

      IM.itemMirror.getAssociationDisplayText(GUID, function(error, displayText) {

        if (error) { deferred.reject(error); }
        deferred.resolve(displayText);
      });
      return deferred.promise;
    };

    IM.getAssociationNames = function(GUIDs) {

      var promises = GUIDs.map(function(GUID) {
        var deferred  = $q.defer();
        
        IM.itemMirror.getAssociationDisplayText(GUID, function(error, displayText) {
          if (error) { deferred.reject(error); }
          deferred.resolve(displayText);
        });

        return deferred.promise;
      });

      return $q.all(promises);
    };

    return IM;
  });

  app.controller('AppController', function AppController($scope) {
    $scope.name = 'World!';
  });

  app.controller('MainCtrl', function MainCtrl($scope, IM) {
    $scope.status = 'Loading Associations...';

    IM.connectDropbox()
    .then(IM.constructItemMirror)
    .then(IM.getAssociationGUIDs)
    .then(IM.getAssociationNames)
    .then(function(result) {
      // Bind results to scope
      $scope.associations = result;
      $scope.status = 'success';
      $scope.loaded = true;
    }, function(reason) {
      //Catch errors in the chain
      console.log('Failed: ' + reason);
    }, function(update) {
      // Report status update in the chain
      console.log('Got notification: ' + update);
    });
  });

  return app;
});

