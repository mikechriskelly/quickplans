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

    var deferred = $q.defer();

    var connectDropbox = dropboxClient.authenticate(function (error, client) {
      if (error) {
        deferred.reject(error);
      }

      // console.log('Dropbox object:');
      // console.dir(client);

      // After async calls, call deferred.resolve with the response value
      deferred.resolve(client);
    });

    var constructNewItemMirror = new ItemMirror(itemMirrorOptions[3], function (error, itemMirror) {
      if (error) {
        deferred.reject(error);
      }

      console.log('itemMirror object:');
      console.dir(itemMirror);

      // After async calls, call deferred.resolve with the response value
      deferred.resolve(itemMirror);
    });

    deferred.promise
    .then(connectDropbox)
    .then(constructNewItemMirror)
    .then(function(itemMirror) {
      $scope.itemMirror = itemMirror;
    }, function(errorReason) {
      throw errorReason;
    });
  });
});
