define(['angular', 'ItemMirror'], function (angular, ItemMirror) {

  'use strict';

  // Check if dependencies are in scope
  // console.log('jquery: ' + typeof($));
  // console.log('ItemMirror: ' + typeof(ItemMirror));
  // console.log('Dropbox: ' + typeof(Dropbox));

  return angular.module('app' , ['ngRoute'])

  .controller('AppController', function AppController($scope) {
    $scope.name = 'World!';
  })
  .controller('MainCtrl', function MainCtrl($scope, $q) {
    var
      dropboxClient,
      dropboxClientCredentials,
      dropboxXooMLUtility,
      dropboxItemUtility,
      mirrorSyncUtility,
      groupingItemURI,
      itemMirrorOptions;

    dropboxClientCredentials = {
      key: 'jrt7eykb5odmd98',
      secret: 'ayrxakqedjss46f'
    };

    dropboxClient = new Dropbox.Client(dropboxClientCredentials);

    dropboxXooMLUtility = {
      driverURI: 'DropboxXooMLUtility',
      dropboxClient: dropboxClient
    };
    dropboxItemUtility = {
      driverURI: 'DropboxItemUtility',
      dropboxClient: dropboxClient
    };
    mirrorSyncUtility = {
      utilityURI: 'MirrorSyncUtility'
    };

    //This is the starting point where the initial item mirror item will be
    //constructed: root. It can also be the name of
    //or path to a folder you want to limit access to
    groupingItemURI = '/'; //"Folder"

    //Set up all of the item mirror options, even though
    //chances are the only one you're going to use is case 3
    itemMirrorOptions = {
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


    function connectDropbox() {
      var deferred = $q.defer();
      dropboxClient.authenticate(function (error, client) {
        
        console.log('Dropbox object:');
        console.dir(client);

        if (error) { deferred.reject(error); }
        deferred.resolve(client);
      });
      return deferred.promise;
    }

    function constructNewItemMirror() {
      var deferred = $q.defer();
      new ItemMirror(itemMirrorOptions[3], function (error, itemMirror) {

        console.log('itemMirror object step 1:');
        console.log(itemMirror);

        if (error) { deferred.reject(error); }
        deferred.resolve(itemMirror);
      });
      return deferred.promise;
    }

    function listAssoc(itemMirror) {
      var deferred = $q.defer();
      itemMirror.listAssociations(function (error, GUIDs) {

        console.log('itemMirror object step 2:');
        console.log(itemMirror);
        console.log('GUIDs: ' + GUIDs);
     
        if (error) { deferred.reject(error); }
        deferred.resolve([itemMirror, GUIDs]);
      });
      return deferred.promise;
    }

    function displayAssoc(itemMirrorGUID) {
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
    }

    function logError(error) { console.log(error); }

    $scope.association = connectDropbox()
      .then(constructNewItemMirror)
      .then(listAssoc)
      .then(displayAssoc)
      .then(function(text) {
        $scope.displayText = text;
      })
      .catch(logError);
  });
});
