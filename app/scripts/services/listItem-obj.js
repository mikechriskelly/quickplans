define(['./module','angular','ItemMirror'], function (services,angular,ItemMirror) {
  'use strict';

  	services.factory('LI', ['$q', function($q){

  		function LI(parentIM, GUID){

  			this.GUID = GUID || null;

  			this.displayName = null;
  			this.parent = parentIM || null;
  			this.children = null;

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