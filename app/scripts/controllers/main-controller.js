define(['./module','angular'], 
  function (controllers,angular) {

  'use strict';

  controllers.controller('MainCtrl', ['$scope','$timeout','listOp','dropboxAuth', function ($scope, $timeout, listOp, dropboxAuth) {
    dropboxAuth.connectDropbox()
    .then(function(result) { return listOp.buildList(result); })
    .then(function(result) {
      // Bind the full listed object to scope for the UI tree
      console.log(result);
      $scope.root = result;
      $scope.list = result.items;
      $scope.loaded = true;

      $scope.projectTitle = 'Summer Vacation';
      $scope.currentTitle = 'Summer Vacation';
      $scope.currentNotes = [];

      // Test flag
      $scope.status = true;
    });

    // Angular UI Tree Options
    $scope.treeOptions = {
      // Callback function executed after drag-and-drop event
      dragStop: function(event) {
        var targetLI = event.source.nodeScope.$modelValue;

        // Reference the new parent if the item is moved to a sublevel
        var newParentLI = event.dest.nodesScope.$parent.$modelValue;

        // Reference a sibling if the item was moved to root level
        var rootSiblingReference = event.dest.index > 0 ? 0 : 1;
        var newSiblingLI = event.dest.nodesScope.$modelValue[rootSiblingReference];

        if(newParentLI && targetLI.parentIM !== newParentLI.selfIM) {
          
          console.log('Moving to sublevel');
          targetLI.moveItem(newParentLI.selfIM);
          // TODO: Call order view

        } else if(newSiblingLI && targetLI.parentIM !== newSiblingLI.parentIM) {
          console.log('Moving to root');
          targetLI.moveItem(newSiblingLI.parentIM);
          // TODO: Call order view
        }
        // TODO: Else if parents are the same check if index changed 
      }
    };

    $scope.showNotes = function(scope) {

      var listItem = scope.$modelValue;

      $scope.currentTitle = listItem.title;

      // displaytext and associateditem (url)
      listItem.getPhantomNotes()
      .then(function(result) {
        $scope.currentNotes = result;
      }, function(error) { console.log('Error:' + error); });
    };

    $scope.move = function(scope) {
      var listItem = scope.$modelValue;

      //console.log(scope.$modelValue);
      //console.log(scope.$parentNodeScope.$modelValue);
      // Simple test: try moving it to root folder
      //listItem.moveItem($scope.list[0].parentIM);
    };

    $scope.delete = function(scope) {
      var listItem = scope.$modelValue;
      status = true;
      listItem.deleteItem();
      scope.remove();
    };

    $scope.toggle = function(scope) {
      scope.toggle();
    };

    $scope.newSubItem = function(scope) {
      var listItem = scope.$modelValue;
      status = true;
      listItem.addChildItem();
    };


  }]);
});

