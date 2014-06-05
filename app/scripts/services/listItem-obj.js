define(['./module','angular','ItemMirror'], function (services,angular,ItemMirror) {
  'use strict';

  	services.factory('LI', ['$q', function($q){

  		function LI(GUID, title, parentIM){

        // Must set parent IM object in order to perform methods
        this.parentIM = parentIM || null;

        // Essential properties for UI tree
  			this.guid = GUID;
  			this.title = title;
  			this.items = [];

        // Association properties from XooML
  			this.isExpanded = false;
  			this.prev=null;
  			this.next=null;
        this.priority = null;
  		};

  		LI.prototype = {	
  			renameItem : function(newTitle) {
          this.parentIM.renameLocalItem(this.guid);
        },

        // Move to a new folder (Shift left or right)
  			moveItem : function(destinationIM){
          this.parentIM.moveAssociation(this.guid, destinationIM.itemMirror)
          .then(function(result) { return result; }, function(error) { console.log(error); });
        },

        // Change order/priority (Shift up or down)
        orderItem : function(destinationGUID){},

  			deleteItem : function(){
          this.parentIM.deleteAssociation(this.guid)
          .then(function(result) { return result; }, function(error) { console.log(error); });
        },

  			

  			toggleExpand : function(){
  				//if sub-folders - createIm, getAssociations, createLIs - set newIm as the parent for li, displayname , prev, next
  			}
  		};

  		return LI;
  	}]);

 });