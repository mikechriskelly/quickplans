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
      $scope.currentNotes = [];
    });

    $scope.showNotes = function(scope) {
      var listItem = scope.$modelValue;
      // displaytext and associateditem (url)
      listItem.getPhantomNotes()
      .then(function(result) {
        $scope.currentNotes = result;
      }, function(error) { console.log(error); });
    };

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

    $scope.newSubItem = function(scope) {
      // var listItem = scope.$modelValue;
      // listItem.addChildItem();
      var listItem = scope.$modelValue;
      listItem.addChildItem();
    };

  }]);
});

