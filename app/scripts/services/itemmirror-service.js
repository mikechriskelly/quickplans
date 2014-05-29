define(['./module','angular','ItemMirror'], function (services,angular,ItemMirror) {
  'use strict';

  // Check if dependencies are in scope
  // console.log('jquery: ' + typeof($));
  // console.log('ItemMirror: ' + typeof(ItemMirror));
  // console.log('Dropbox: ' + typeof(Dropbox));

  services.factory('IM', ['$q',function($q){

    function IM(dropboxClient) {
      this.dropboxClient = dropboxClient;
      this.dropboxXooMLUtility = {
        driverURI: 'DropboxXooMLUtility',
        dropboxClient: this.dropboxClient
      };
      this.dropboxItemUtility = {
        driverURI: 'DropboxItemUtility',
        dropboxClient: this.dropboxClient
      };
      this.mirrorSyncUtility = {
        utilityURI: 'MirrorSyncUtility'
      };

      // Staring folder in Dropbox
      this.groupingItemURI = '/2014-06, HTML5 MSIM IS, shared/final week demonstration';

      // Set up all of the item mirror options, even though
      //chances are the only one you're going to use is case 3
      this.itemMirrorOptions = {
        1: {
          groupingItemURI: this.groupingItemURI,
          xooMLDriver: this.dropboxXooMLUtility,
          itemDriver: this.dropboxItemUtility
        },
        2: {
          groupingItemURI: this.groupingItemURI,
          xooMLDriver: this.dropboxXooMLUtility,
          itemDriver: this.dropboxItemUtility,
          syncDriver: this.mirrorSyncUtility,
          readIfExists: false
        },
        3: {
          groupingItemURI: this.groupingItemURI,
          xooMLDriver: this.dropboxXooMLUtility,
          itemDriver: this.dropboxItemUtility,
          syncDriver: this.mirrorSyncUtility,
          readIfExists: true
        }
      };
      console.log(this);
    }

    IM.prototype = {
      constructItemMirror : function() {
        var self = this;
        var deferred = $q.defer();
        new ItemMirror(this.itemMirrorOptions[3], function (error, itemMirror) {
          // Save itemMirror object into factory object for reuse
          self.itemMirror = itemMirror;
          if (error) { deferred.reject(error); }
          deferred.resolve(itemMirror);  
        });
        return deferred.promise;
      },
      getDisplayName : function() {
        var deferred = $q.defer();
        this.itemMirror.getDisplayName(function(error, displayName) {
          if (error) { deferred.reject(error); }
          deferred.resolve(displayName);
        });
        return deferred.promise;
      },
      getAssociationGUIDs : function() {
        var self = this;
        var deferred = $q.defer();
        this.itemMirror.listAssociations(function (error, GUIDs) {
          // Save GUIDs into factory object for reuse
          self.GUIDs = GUIDs;
          if (error) { deferred.reject(error); }
          deferred.resolve(GUIDs);
        });
        return deferred.promise;
      },
      getAssociationNames : function() {
        var self = this;
        var promises = this.GUIDs.map(function(GUID) {
          var deferred  = $q.defer();
          self.itemMirror.getAssociationDisplayText(GUID, function(error, displayText) {
            if (error) { deferred.reject(error); }
            deferred.resolve(displayText);
          });
          return deferred.promise;
        });

        return $q.all(promises);
      }
    };
    return IM;
  }])
});
