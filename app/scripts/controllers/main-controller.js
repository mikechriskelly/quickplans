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

    function censor(censor) {
      var i = 0;
      return function(key, value) {
        if(i !== 0 && typeof(censor) === 'object' && typeof(value) == 'object' && censor == value) 
          return '[Circular]'; 
        if(i >= 29) // seems to be a harded maximum of 30 serialized objects?
          return '[Unknown]';
        ++i; // so we know we aren't using the original object anymore
        return value;  
      };
    }


    var timer = false;
    $scope.$watch(function() {
        return JSON.stringify($scope.root, censor($scope.root));
      }, function() {
        console.log('Inside Watch');
        if(timer){
          $timeout.cancel(timer);
        }
        timer = $timeout(function(){
          if($scope.root) { listOp.setPriority($scope.root); }
        },5000);
    });

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
      $scope.status = true;
      console.log($scope.status);

      if(listItem)
      // Simple test: try moving it to root folder
      listItem.moveItem($scope.list[0].parentIM);
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

