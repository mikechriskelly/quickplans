define(['./module','angular','ItemMirror'], function (services,angular,ItemMirror) {

  'use strict';

  // Check if dependencies are in scope
  // console.log('jquery: ' + typeof($));
  // console.log('ItemMirror: ' + typeof(ItemMirror));
  // console.log('Dropbox: ' + typeof(Dropbox));

  services.factory('IM', ['$q',function($q) {

    var dropboxClientCredentials = {
      key: 'wsvaq6pyykd3mi8',
      secret: 'fqnw1x9o91han3c',
      token: 'xRhoafCazcIAAAAAAAAAVjksVLK3z90uaU4cMqUErZQsrJfKOI5_vv4jOJGZxvD5'
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

    IM.getDisplayName = function() {
      var deferred = $q.defer();

      IM.itemMirror.getDisplayName(function(error, displayName) {
        if (error) { deferred.reject(error); }
        deferred.resolve(displayName);
      });
      return deferred.promise;
    };

    IM.getAssociationGUIDs = function(itemMirror) {
      var deferred = $q.defer();
      
      // If no param passed use constructed itemMirror object
      itemMirror = itemMirror || IM.itemMirror;
      
      itemMirror.listAssociations(function (error, GUIDs) {

        // Save GUIDs into factory object for reuse
        IM.GUIDs = GUIDs;
     
        if (error) { deferred.reject(error); }
        deferred.resolve(GUIDs);
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

    IM.getChild = function(GUID) {
      var deferred = $q.defer();
      IM.itemMirror.createItemMirrorForAssociatedGroupingItem(GUID, function(error, childItemMirror) {

        // Save itemMirror object into factory object for reuse
        IM.childItemMirror = childItemMirror;
        console.log('Child itemmirror: ');
        console.dir(childItemMirror);

        if (error) { deferred.reject(error); }
        deferred.resolve(childItemMirror);
      });
      return deferred.promise;
    };

    return IM;
  }]);

});

