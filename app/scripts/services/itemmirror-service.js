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
      //console.log(this);
    }

    IM.prototype = {

      // Object Properties
      associationGUIDs : [],
      itemMirror : null,
      namespaceURI : '', // URI for this webapp

      // Use to create first ItemMirror from root or initial folder
      constructItemMirror : function() {
        var self = this;
        var deferred = $q.defer();
        new ItemMirror(this.itemMirrorOptions[3], function (error, itemMirror) {
          // Save itemMirror object into factory object for reuse
          self.itemMirror = itemMirror;
          console.log(itemMirror);
          if (error) { deferred.reject(error); } 
          deferred.resolve(itemMirror);  
        });
        return deferred.promise;
      },

      // Use to create itemMirror object based on a specific GUID
      createItemMirrorForAssociatedGroupingItem : function(GUID) {
        var deferred = $q.defer();
        this.itemMirror.createItemMirrorForAssociatedGroupingItem(GUID, function(error, itemMirror) {
          // Save itemMirror object into factory object for reuse
          self.itemMirror = itemMirror;
          if (error) { deferred.reject(error); }
          deferred.resolve(itemMirror);
        });
      },

      // Adds the given attributeName to the association with the given GUID and namespaceURI.
      // Use this to add prev, next, isExpanded attributes to new objects
      //
      addAssociationNamespaceAttribute : function(attributeName, GUID) {
        var deferred = $q.defer();
        this.itemMirror.addAssociationNamespaceAttribute(attributeName, GUID, namespaceURI, function(error) {
          if (error) { deferred.reject(error); }
          deferred.resolve();
        });
        return deferred.promise;
      },

      createAssociation : function(name) {
        var self = this;
        var deferred = $q.defer();

        var options = {
          displayText: name, // Display text for the association. Required in all cases.
          //itemURI: "", // URI of the item. Required for case 2 & 3.
          //localItemRequested: false, // True if the local item is requested, else false. Required for cases 2 & 3.
          //groupingItemURI: "", // URI of the grouping item. Required for cases 4 & 5.
          //xooMLDriverURI: "", // URI of the XooML driver for the association. Required for cases 4 & 5.
          itemName: name, // URI of the new local non-grouping/grouping item. Required for cases 6 & 7.
          isGroupingItem: 'true' // String? True if the item is a grouping item, else false. Required for cases 6 & 7.]
        };

        this.itemMirror.createAssociation(options, function(error, GUID) {
          // Store new association in the local array of GUIDs
          self.associationGUIDs.push(GUID);
          console.log(self.associationGUIDs);
          if (error) { deferred.reject(error); }
          deferred.resolve(GUID);  
        });
        return deferred.promise;
      },

      deleteAssociation : function(GUID) {
        var deferred = $q.defer();
        this.itemMirror.deleteAssociation(GUID, function(error) {
          if (error) { deferred.reject(error); }
          deferred.resolve();          
        });
      },

      // Gets the name of the itemMirror object
      getDisplayName : function() {
        var deferred = $q.defer();
        this.itemMirror.getDisplayName(function(error, displayName) {
          if (error) { deferred.reject(error); }
          deferred.resolve(displayName);
        });
        return deferred.promise;
      },

      // Gets array of GUIDs
      getAssociationGUIDs : function() {
        var self = this;
        var deferred = $q.defer();
        this.itemMirror.listAssociations(function (error, GUIDs) {
          // Save GUIDs into factory object for reuse
          self.associationGUIDs = GUIDs;
          if (error) { deferred.reject(error); }
          deferred.resolve(GUIDs);
        });
        return deferred.promise;
      },

      // Gets display names of a GUID array
      getAssociationNames : function() {
        var self = this;
        var promises = this.associationGUIDs.map(function(GUID) {
          var deferred  = $q.defer();
          self.itemMirror.getAssociationDisplayText(GUID, function(error, displayText) {
            if (error) { deferred.reject(error); }
            var association = {
              guid : GUID,
              title : displayText,
              items : []
            };
            deferred.resolve(association);
          });
          return deferred.promise;
        });
        return $q.all(promises);
      },

      getAssociationNamespaceAttribute : function(attributeName, GUID) {
        var self = this;
        var deferred = $q.defer();
        this.itemMirror.getAssociationNamespaceAttribute(attributeName, GUID, namespaceURI, function(error, associationNamespaceAttribute) {
          if (error) { deferred.reject(error); }
          deferred.resolve(associationNamespaceAttribute);
        });
        return deferred.promise;
      },

      isAssociatedItemGrouping : function(GUID) {
        var self = this;
        var deferred = $q.defer();
        this.itemMirror.isAssociatedItemGrouping(GUID, function(error, isGroupingItem) {
          if (error) { deferred.reject(error); }
          deferred.resolve(isGroupingItem);
        });
        return deferred.promise;
      },

      listAssociationNamespaceAttributes : function(GUID) {
        var self = this;
        var deferred = $q.defer();
        this.itemMirror.listAssociationNamespaceAttributes(GUID, namespaceURI, function(error, array) {
          if (error) { deferred.reject(error); }
          deferred.resolve(array);
        });
        return deferred.promise;
      },

      moveAssociation : function(GUID, destinationItemMirror) {
        var self = this;
        var deferred = $q.defer();
        this.itemMirror.moveAssociation(GUID, destinationItemMirror, function(error) {
          if (error) { deferred.reject(error); }
          deferred.resolve();
        });
        return deferred.promise;   
      },
      
      // Not yet implemented in the itemMirror library
      renameLocalItem : function(GUID) {
        var self = this;
        var deferred = $q.defer();
        this.itemMirror.renameLocalItem(GUID, function(error) {
          if (error) { deferred.reject(error); }
          deferred.resolve();
        });
        return deferred.promise; 
      },

      setAssociationDisplayText : function(GUID, displayText) {
        var self = this;
        var deferred = $q.defer();
        this.itemMirror.setAssociationDisplayText(GUID, displayText, function(error) {
          if (error) { deferred.reject(error); }
          deferred.resolve();
        });
        return deferred.promise; 
      },

      setFragmentNamespaceAttribute : function(attributeName, attributeValue, GUID) {
        var self = this;
        var deferred = $q.defer();
        this.itemMirror.setFragmentNamespaceAttribute(attributeName, attributeValue, GUID, namespaceURI, function(error) {
          if (error) { deferred.reject(error); }
          deferred.resolve();
        });
        return deferred.promise; 
      }

    };
    return IM;
  }])
});
