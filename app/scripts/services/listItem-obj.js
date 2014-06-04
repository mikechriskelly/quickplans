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
  		};

  		LI.prototype = {	
  			renameItem : function(){},
  			moveItem : function(destinationGUID){},
  			deleteItem : function(){},
  			orderItem : function(destinationGUID){},
  			toggleExpand : function(){
  				//if sub-folders - createIm, getAssociations, createLIs - set newIm as the parent for li, displayname , prev, next
  			}
  		};

  		return LI;
  	}])

 });