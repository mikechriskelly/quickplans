define(['./module','angular','ItemMirror'], function (services,angular,ItemMirror) {
	
	'use strict';
  	services.factory('listView', ['$q', function($q){

  		function listView(dropboxClient){
  			this.dropboxClient = dropboxClient;
  			this.itemMirrorList = {};
  			this.listItems = {};
  		}


  		listView.prototype = {

  			'initializeView' : function(dropboxClient){
  				var self = this;
  				var deferred = $q.defer();
  				createItemMirror(pass in dropboxClient)
  				populate all object properties
  				add it to itemMirror array/list

  				defer.promise(itemMirror object)
  				return deferred.promise;
  			},

  			'populateView' : function(itemMirrorObj){
  				if object.listGUIDs is not null
  					then iterate through listGUIDs
  						if association is a groupingItem:
  							create a listItem(object as parentIM and GUID)
  							add it to the listitem array

  							if association is expanded 
  								use the parameter object to create an item mirror with the GUID
									populate the item mirror object using various methods
									add it to itemMirror array

								if parent is root:
									push the listitem element into listitem array
								else:
									find the parent item from the listitem array
										then push the list item as the child property of the parent element

								populateView(pass the new itemmirrror created);

							promises.push(deferred.resolve(listItem));

					return $q.all(promises);
  			},

  			'orderView' : function(){
  				//takes in created listElements

  			}
  		};

  		//return the object, if this class should be written as 
  		return listView;

  	}])


 });