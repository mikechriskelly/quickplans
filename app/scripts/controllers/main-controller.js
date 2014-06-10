define(['./module','angular'], 
  function (controllers,angular) {

  'use strict';

  controllers.controller('MainCtrl', ['$scope','listOp','dropboxAuth', function ($scope, listOp, dropboxAuth) {
    dropboxAuth.connectDropbox()
    .then(function(result) { return listOp.buildList(result); })
    .then(function(result) {
      // Bind the full listed object to scope for the UI tree
      console.log('Result in Controller');
      console.log(result);
      $scope.root = result;
      $scope.list = result.items;
      $scope.loaded = true;
    });

    $scope.move = function(scope) {
      var listItem = scope.$modelValue;
      // Simple test: try moving it to root folder
      listItem.moveItem($scope.list[0].parentIM);
    };

    $scope.delete = function(scope) {
      var listItem = scope.$modelValue;
      listItem.deleteItem();
      scope.remove();
    };

    $scope.toggle = function(scope) {
      scope.toggle();
    };

    // $scope.newSubItem = function(scope) {
    //   var listItem = scope.$modelValue;
    //   var newTitle = '';
    //   var newListItem = new LI(assoc.GUID, newTitle, imObj);
    //   listItem.items.push({
    //     guid: nodeData.id * 10 + nodeData.items.length,
    //     title: newTitle,
    //     items: []
    //   });
    //   console.log(newTitle);
    //   im.createAssociation(newTitle)
    //     .then(function(result) { console.log(result) }, function(reason) { console.log('Failed: ' + reason); });
    // };

  }]);
});

