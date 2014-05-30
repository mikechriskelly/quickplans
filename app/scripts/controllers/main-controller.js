define(['./module','angular'], 
  function (controllers,angular) {

  'use strict';

  // Check if dependencies are in scope
  // console.log('jquery: ' + typeof($));
  // console.log('ItemMirror: ' + typeof(ItemMirror));
  // console.log('Dropbox: ' + typeof(Dropbox));

  controllers.controller('MainCtrl', ['$scope','dropboxAuth','IM', function ($scope, dropboxAuth, IM) {
    $scope.status = 'Loading Associations...';

    dropboxAuth.connectDropbox()
    .then(
      function(result){
       var im = new IM(result);
       im.constructItemMirror()
         .then(function() { return im.getAssociationGUIDs(); })
         .then(function() { return im.getAssociationNames(); })
         .then(function(result){

          $scope.associations = result;
          $scope.list = result;

          $scope.status = 'success';
          $scope.loaded = true;
          $scope.GUIDs = im.GUIDs;


          $scope.selectedItem = {};

          $scope.options = {
          };

          $scope.remove = function(scope) {
            scope.remove();
            var nodeData = scope.$modelValue;
            im.deleteAssociation(nodeData.guid)
              .then(function(result) { console.log(result) }, function(reason) { console.log('Failed: ' + reason); });
          };

          $scope.toggle = function(scope) {
            scope.toggle();
          };

          // Trying to toggle drag. Not working yet.
          $scope.dragEnabled = function(scope) {
            console.log(scope);
            console.log(scope.$parent);
            scope.$parent.dragEnabled();
          };

          $scope.newSubItem = function(scope) {
            var nodeData = scope.$modelValue;
            console.log(nodeData);
            var newTitle = nodeData.title + ' Subitem';
            nodeData.items.push({
              guid: nodeData.id * 10 + nodeData.items.length,
              title: newTitle,
              items: []
            });
            console.log(newTitle);
            im.createAssociation(newTitle)
              .then(function(result) { console.log(result) }, function(reason) { console.log('Failed: ' + reason); });
          };

        }, function(reason) {
         //Catch errors in the chain
         console.log('Failed: ' + reason);
       })
      }
    );
  }]);
});

