define(['./module','angular','ItemMirror'], function (services,angular,ItemMirror) {  
  'use strict';
  
  services.factory('listOp', ['$q','LI','IM', function($q, LI, IM){

    // Private variables
    var client;
    var listItems;

    function buildList(dropboxClient) {
      client = dropboxClient;

      // Create the ListItem for Root (GUID, title [, parentIM])
      // All other list items will be nested in this one
      listItems = new LI('root','root');

      // Create the IM for root and call the recursive helper function to build the whole list
      var deferred = $q.defer();
      var im = new IM(client);
      im.constructItemMirror()
      .then(function(rootIM) { return buildTreeRecursive(rootIM, listItems); })
      .then(function(finishedList) { 
        console.log('Finished List');
        console.log(finishedList);
        deferred.resolve(finishedList);
      }, function(error) {
        console.log('Error');
        console.log(error);
      });

      return deferred.promise;
    }

    function buildTreeRecursive(imObj,liObj){
      console.log('Called buildTreeRecursive');
      // console.log(imObj);
      // console.log(liObj);
      var deferred = $q.defer();

      imObj.getAssociationGUIDs()
      .then(function(GUIDs) { return imObj.getGroupingItems(GUIDs); })
      .then(function(GUIDs) { return imObj.createIMsForGroupingItems(GUIDs); })
      //.then(function(GUIDs) { return imObj.getAssociationNames(GUIDs); })
      .then(function(assoc) { 
        console.log(assoc);
        for(var i=0; i<assoc.length; i++) {
          var newListItem = new LI(assoc[i].GUID, 'Untitled', imObj);
          liObj.items.push(newListItem);
          buildTreeRecursive(assoc[i], newListItem);
        }
        deferred.resolve(listItems);
      });

      return deferred.promise;
    }


    function orderView() {
      //takes in created listElements
    };

    //return the object, if this class should be written as 
    return {
      'buildList' : buildList
    };

  }]);


 });