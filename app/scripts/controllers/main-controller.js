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
  }]);
});

