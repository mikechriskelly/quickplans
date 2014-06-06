define(['./module','angular'], 
  function (controllers,angular) {

  'use strict';

  controllers.controller('MainCtrl', ['$scope','listOp','dropboxAuth', function ($scope, listOp, dropboxAuth) {
    $scope.status = 'Loading Associations...';

    dropboxAuth.connectDropbox()
    .then(function(result) { return listOp.buildList(result); })
    .then(function(result) {
      // Bind the full listed object to scope for the UI tree
      console.log('Result in Controller');
      console.log(result);
      $scope.list = result.items;
      $scope.status = 'Loaded';
    });

    $scope.move = function(scope) {
      var listItem = scope.$modelValue;
      console.log(listItem);
      // Simple test: try moving it to root folder
      listItem.moveItem($scope.list);
    },

    $scope.delete = function(scope) {
      var listItem = scope.$modelValue;
      console.log(listItem);
      listItem.deleteItem();
      console.log(scope);
      scope.remove();
      console.log(scope);
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

  }]);
});

