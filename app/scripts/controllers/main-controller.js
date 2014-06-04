define(['./module','angular'], 
  function (controllers,angular) {

  'use strict';

  // Check if dependencies are in scope
  // console.log('jquery: ' + typeof($));
  // console.log('ItemMirror: ' + typeof(ItemMirror));
  // console.log('Dropbox: ' + typeof(Dropbox));

  controllers.controller('MainCtrl', ['$scope','listOp','dropboxAuth','IM', function ($scope, listOp, dropboxAuth, IM) {
    $scope.status = 'Loading Associations...';

    dropboxAuth.connectDropbox()
    .then(function(result) { return listOp.buildList(result); })
    .then(function(result) {
      // Bind the full listed object to scope for the UI tree
      console.log("Result in Controller");
      console.log(result);
      console.log(result.title);
      console.log(result.items);
      $scope.list = result;
    });
  }]);
});

