define(['./module','angular','ItemMirror'], function (services,angular,ItemMirror) {
  'use strict';

  	services.factory('LI', ['$q', function($q){

  		function LI(GUID, title, parentIM, selfIM){

        // Must set parent IM object in order to perform methods
        this.parentIM = parentIM || null;
        this.selfIM = selfIM || null;

        // Essential properties for UI tree
  			this.guid = GUID;
  			this.title = title;
  			this.items = [];

        // Association properties from XooML
  			this.isExpanded = false;
  			this.prev = null;
  			this.next = null;
        this.priority = null;
  		}

  		LI.prototype = {	

        getPhantomNotes : function() {
          var self = this;
          return this.selfIM.getPhantomDisplayText()
          .then(function(result) { 
            return self.selfIM.notes; 
          }, function(error) { 
            return error; 
          });
        },

  			renameItem : function() {
          return this.parentIM.renameLocalItem(this.guid, this.title)
          .then(function(result) { 
            console.log(result); 
            return result; 
          }, function(error) { 
            return error;
          });
        },

        // Move to a new folder (Shift left or right)
  			moveItem : function(destinationIM){
          console.log(destinationIM);
          console.log(destinationIM.itemMirror);

          return this.parentIM.moveAssociation(this.guid, destinationIM.itemMirror)
          .then(function(result) { 
            console.log(result); 
            return result; 
          }, function(error) { 
            return error; 
          });
        },

        // Change order/priority (Shift up or down)
        orderItem : function(destinationGUID) {

        },

  			deleteItem : function() {
          return this.parentIM.deleteAssociation(this.guid)
          .then(function(result) { 
            return result; 
          }, function(error) { 
            return error; 
          });
        },

  			toggleExpand : function() {
  				//if sub-folders - createIm, getAssociations, createLIs - set newIm as the parent for li, displayname , prev, next
  			},

        addChildItem : function() {
          // TODO work in progress -- selfIM or parentIM?
          //   .then(function(result) { return this.selfIM.createAssociation(newTitle); })
          //   .then(function(result) { return new LI(assoc.GUID, newTitle, imObj); })
          //   .then(function(result) {
          //     listItem.items.push(newListItem);
          //   })
          //   .then(function(result) { console.log(result) }, function(reason) { console.log('Failed: ' + reason); });
          // }            
        }
  		};

  		return LI;
  	}]);

 });