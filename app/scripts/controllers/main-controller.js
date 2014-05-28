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
                //Bind results to scope
                console.log(result);
               $scope.associations = result;

               $scope.list = [];
          
               for(var i=0; i < result.length; i++) {
                  var item={};
                  item.id = i;
                  item.title = result[i];
                  item.items = [];
                  $scope.list.push(item);
               }

               console.log($scope.list);


              $scope.selectedItem = {};

              $scope.options = {
              };

              $scope.remove = function(scope) {
                scope.remove();
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
                nodeData.items.push({
                  id: nodeData.id * 10 + nodeData.items.length,
                  title: nodeData.title + '.' + (nodeData.items.length + 1),
                  items: []
                });
              };

               $scope.status = 'success';
               $scope.loaded = true;
               $scope.GUIDs = im.GUIDs;
              }, function(reason) {
               //Catch errors in the chain
               console.log('Failed: ' + reason);
             })
        }
    )
  }]);

});

