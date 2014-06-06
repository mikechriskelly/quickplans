define(['./module','angular','ItemMirror'], function (services,angular,ItemMirror) {
  'use strict';

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
    }

    IM.prototype = {

      // Object Properties
      itemMirror : null,
      GUID: null,
      displayName: null,
      priority : 0, // object of association attributes to be assigned to LI

      associations : [],          // object array with title and guid as properties
      associationGUIDs : [],      // string array of all GUIDs
      phantomAssociations: [],    // string array of phantom assoc GUIDs only

      namespaceURI : 'quickplans', // URI for this webapp

      // Use to create first ItemMirror from root or initial folder
      constructItemMirror : function() {
        var self = this;
        var deferred = $q.defer();
        new ItemMirror(this.itemMirrorOptions[3], function (error, itemMirror) {
          if (error) { deferred.reject(error); }
          // Save itemMirror object into factory object for reuse
          self.itemMirror = itemMirror;
          // It's not useful to return an itemMirror, so return IM (self)
          deferred.resolve(self);  
        });
        return deferred.promise;
      },

      // Create an itemMirror object based on a specific GUID
      createItemMirrorForAssociatedGroupingItem : function(GUID) {
        var self = this;
        var deferred = $q.defer();
        this.itemMirror.createItemMirrorForAssociatedGroupingItem(GUID, function(error, itemMirror) {
          if (error) { deferred.reject(error); }
          // Create a new IM object and assign the itemMirror object to it. Return the complete IM object.
          var imObj = new IM(self.dropboxClient);
          imObj.itemMirror = itemMirror;
          deferred.resolve(itemMirror);
        });
      },

      // Return an array of itemMirror objects from an array of GUIDs
      createIMsForGroupingItems : function(GUIDs) {
        var self = this;
        GUIDs = GUIDs.filter(function(e) { return (e===undefined||e===null||e==='')? false : ~e; });
        // Map the GUIDs into an array of promises
        var promises = GUIDs.map(function(GUID) {
          var deferred = $q.defer();
          self.itemMirror.createItemMirrorForAssociatedGroupingItem(GUID, function(error, itemMirror) {
            if (error) { deferred.reject(error); }

            // Create a new IM object and assign the itemMirror object to it. Return the complete IM object.
            var imObj = new IM(self.dropboxClient);
            imObj.itemMirror = itemMirror;
            imObj.GUID = GUID;
            deferred.resolve(imObj);
          });
          return deferred.promise;
        });
        return $q.all(promises);
      },

      // Adds the given attributeName to the association with the given GUID and namespaceURI.
      // Use this to add prev, next, isExpanded attributes to new objects
      addAssociationNamespaceAttribute : function(attributeName, GUID) {
        var deferred = $q.defer();
        this.itemMirror.addAssociationNamespaceAttribute(attributeName, GUID, this.namespaceURI, function(error) {
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
          if (error) { deferred.reject(error); }
          // Store new association in the local array of GUIDs
          self.associationGUIDs.push(GUID);
          console.log(self.associationGUIDs);
          deferred.resolve(GUID);  
        });
        return deferred.promise;
      },

      deleteAssociation : function(GUID) {
        var deferred = $q.defer();
        this.itemMirror.deleteAssociation(GUID, function(error) {
          if (error) { deferred.reject(error); }
          deferred.resolve('Item Deleted from folder');          
        });
        return deferred.promise;
      },

      // Gets array of GUIDs
      getAssociationGUIDs : function() {
        var self = this;
        var deferred = $q.defer();
        this.itemMirror.listAssociations(function (error, GUIDs) {
          if (error) { deferred.reject(error); }
          // Save GUIDs into factory object for reuse
          self.associationGUIDs = GUIDs;
          deferred.resolve(GUIDs);
        });
        return deferred.promise;
      },

      // Gets display names of a GUID array
      getAssociationNames : function(GUIDs) {
        var self = this;
        // If GUIDs is not provided as a param, check for locally stored GUIDs
        GUIDs = GUIDs || this.associationGUIDs;
        var promises = GUIDs.map(function(GUID) {
          var deferred  = $q.defer();
          self.itemMirror.getAssociationDisplayText(GUID, function(error, displayText) {
            if (error) { deferred.reject(error); }
            self.associations.push(displayText);
            deferred.resolve(displayText);
          });
          return deferred.promise;
        });
        return $q.all(promises);
      },

      // Gets display names of a GUID array
      makeAssociationObjects : function(GUIDs) {
        var self = this;
        var promises = GUIDs.map(function(GUID) {
          var deferred  = $q.defer();
          self.itemMirror.getAssociationDisplayText(GUID, function(error, displayText) {
            if (error) { deferred.reject(error); }

            var item;
            item.GUID = GUID;
            item.title = displayText;

            deferred.resolve(item);
          });
          return deferred.promise;
        });
        return $q.all(promises);
      },

      getAssociationNamespaceAttribute : function(attributeName, assocIM) {
        var self = this;
        var deferred = $q.defer();
        var GUID = assocIM.guid;
        this.itemMirror.getAssociationNamespaceAttribute(attributeName, GUID, this.namespaceURI, function(error, associationNamespaceAttribute) {
          if (error) { deferred.reject(error); }
          assocIM[attributeName] = associationNamespaceAttribute || 0;
          deferred.resolve(assocIM);
        });
        return deferred.promise;
      },

      // Gets the name of the itemMirror object
      getDisplayName : function() {
        var self = this;
        var deferred = $q.defer();
        this.itemMirror.getDisplayName(function(error, displayName) {
          if (error) { deferred.reject(error); }
          self.displayName = displayName;
          // Return the whole IM object so this method can be used in chaining
          deferred.resolve(self);
        });
        return deferred.promise;
      },

      // Takes an array of GUIDS and removes non-grouping items from the array
      getGroupingItems : function() {
        var self = this;
        // Map the GUIDs into an array of promises
        var promises = this.associationGUIDs.map(function(GUID) {
          var deferred  = $q.defer();
          self.itemMirror.isAssociatedItemGrouping(GUID, function(error, isGroupingItem) {
            // Removed error handling: resolve errors with a null value
            // Return GUID string only for grouping items
            if(isGroupingItem) { 
              deferred.resolve(GUID); 
            } else {
              // Store GUIDS for phantom assoc in local array so they can be used later
              self.phantomAssociations.push(GUID);
              // Return null value to be filtered out below
              // It's necessary to return some value in order for q.all to succeed
              deferred.resolve(null); 
            }
          });
          return deferred.promise;
        });
        // After promises are resolved, filter out null values and return resulting GUIDs
        return $q.all(promises)
        .then(function(result) { 
          return result.filter(function(val) {
            return (typeof val === 'string');
          });
        });
      },

      isAssociatedItemGrouping : function(GUID) {
        var deferred = $q.defer();
        this.itemMirror.isAssociatedItemGrouping(GUID, function(error, isGroupingItem) {
          if (error) { deferred.reject(error); }
          deferred.resolve(isGroupingItem);
        });
        return deferred.promise;
      },

      listAssociationNamespaceAttributes : function(GUID) {
        var deferred = $q.defer();
        this.itemMirror.listAssociationNamespaceAttributes(GUID, this.namespaceURI, function(error, array) {
          if (error) { deferred.reject(error); }
          deferred.resolve(array);
        });
        return deferred.promise;
      },

      moveAssociation : function(GUID, destinationItemMirror) {
        var deferred = $q.defer();
        console.log(destinationItemMirror);
        this.itemMirror.moveAssociation(GUID, destinationItemMirror, function(error) {
          if (error) { console.log(error); deferred.reject(error); }
          deferred.resolve('Item moved to new folder');
        });
        return deferred.promise;   
      },
      
      // Not yet implemented in the itemMirror library
      renameLocalItem : function(GUID) {
        var deferred = $q.defer();
        this.itemMirror.renameLocalItem(GUID, function(error) {
          if (error) { deferred.reject(error); }
          deferred.resolve('Item renamed');
        });
        return deferred.promise; 
      },

      setAssociationDisplayText : function(GUID, displayText) {
        var deferred = $q.defer();
        this.itemMirror.setAssociationDisplayText(GUID, displayText, function(error) {
          if (error) { deferred.reject(error); }
          deferred.resolve('Display text updated');
        });
        return deferred.promise; 
      },

      setFragmentNamespaceAttribute : function(attributeName, attributeValue, GUID) {
        var deferred = $q.defer();
        this.itemMirror.setFragmentNamespaceAttribute(attributeName, attributeValue, GUID, this.namespaceURI, function(error) {
          if (error) { deferred.reject(error); }
          deferred.resolve(attributeName + ' attribute assigned value ' + attributeValue);
        });
        return deferred.promise; 
      }

    };
    return IM;
  }]);
});
