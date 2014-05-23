define(['./module','angular'], 
  function (controllers,angular) {

  'use strict';

  // Check if dependencies are in scope
  // console.log('jquery: ' + typeof($));
  // console.log('ItemMirror: ' + typeof(ItemMirror));
  // console.log('Dropbox: ' + typeof(Dropbox));

  controllers.controller('MainCtrl', ['$scope','dropboxAuth','IM', function ($scope, dropboxAuth, IM) {
    $scope.status = 'Loading Associations...';
    //var im = null;
    dropboxAuth.connectDropbox()
    .then(
        function(result){
           var im = new IM(result);
           im.constructItemMirror()
           .then( function(){ console.log(im) })
           .then(im.getAssociationGUIDs)
           .then(im.getAssociationNames)
           .then(function(result){
                //Bind results to scope
               $scope.associations = result;
               $scope.status = 'success';
               $scope.loaded = true;
               $scope.GUIDs = im.GUIDs;
              }, function(reason) {
               //Catch errors in the chain
               console.log('Failed: ' + reason);
             })
        }
    )
    
    $scope.content = "<h2>I'm editable</h2><ul><li>Don't believe me?</li><li>Just click this block and start typing!</li><li>Assuming you just dasdfid, how cool is that?!</li></ul>";

  }]);

});

