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
      var im = new IM(client);

      im.constructItemMirror()
      .then(function(rootIM) { return buildTreeRecursive(rootIM, listItems); })
      .then(function(finishedList) { 
        console.log('Finished List');
        console.log(listItems);
        var deferred = $q.defer();
        deferred.resolve(listItems);
        return deferred.promise;
      });
    }

    function buildTreeRecursive(imObj,liObj) {
      console.log('Called buildTreeRecursive');

      return imObj.getAssociationGUIDs()
        .then(function(GUIDs) { return imObj.getGroupingItems(GUIDs); })
        .then(function(GUIDs) { return imObj.createIMsForGroupingItems(GUIDs); })
        //.then(function(GUIDs) { return imObj.getAssociationNames(GUIDs); })
        .then(function(associations) { 
          return $q.all(associations.map(function(assoc) {
            
            // Create an LI and insert it inside the liObj
            var newListItem = new LI(assoc.GUID, 'Untitled', imObj);
            liObj.items.push(newListItem);

            // Recursive call with new IM and LI objects
            // TODO: if isExpanded else return null 
            return buildTreeRecursive(assoc, newListItem);
          }));
        });
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