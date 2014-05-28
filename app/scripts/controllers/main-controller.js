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
           .then( function() { return im.getAssociationGUIDs(); })
           .then( function() { return im.getAssociationNames(); })
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

              // $scope.list = [{
              //   "id": 1,
              //   "title": "1. dragon-breath",
              //   "items": []
              // }, {
              //   "id": 2,
              //   "title": "2. moiré-vision",
              //   "items": [{
              //     "id": 21,
              //     "title": "2.1. tofu-animation",
              //     "items": [{
              //       "id": 211,
              //       "title": "2.1.1. spooky-giraffe",
              //       "items": []
              //     }, {
              //       "id": 212,
              //       "title": "2.1.2. bubble-burst",
              //       "items": []
              //     }],
              //   }, {
              //     "id": 22,
              //     "title": "2.2. barehand-atomsplitting",
              //     "items": []
              //   }],
              // }, {
              //   "id": 3,
              //   "title": "3. unicorn-zapper",
              //   "items": []
              // }, {
              //   "id": 4,
              //   "title": "4. romantic-transclusion",
              //   "items": []
              // }];

              $scope.selectedItem = {};

              $scope.options = {
              };

              $scope.remove = function(scope) {
                scope.remove();
              };

              $scope.toggle = function(scope) {
                scope.toggle();
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
    
    $scope.content = "<h2>I'm editable</h2><ul><li>Don't believe me?</li><li>Just click this block and start typing!</li><li>Assuming you just dasdfid, how cool is that?!</li></ul>";

  }]);

});

