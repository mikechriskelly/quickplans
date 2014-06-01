define(['./module','angular','ItemMirror'], function (services,angular,ItemMirror) {
  'use strict';

  	services.factory('LI', ['$q', function($q){

  		function LI(parentIM, parentLI, liPath, GUID, title){

  			this.GUID = GUID;

  			this.displayName = title;
  			this.parentIM = parentIM;
        this.parentLI = parentLI;
        this.liPath = liPath;
  			this.children = [];

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