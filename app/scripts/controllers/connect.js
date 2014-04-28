'use strict';

define(['app'], function (app) {
  app.register.controller('connect', ['$scope', 'ItemMirror'], function ($scope, ItemMirror) {

    console.log('connectDB working');
        $scope.listItems = 'list';
    
    require(['ItemMirror', 'Dropbox'], function(ItemMirror, Dropbox){
      
      $scope.name = 'Read Me!';

      // Test to make sure objects passed
      //console.dir(ItemMirror);
      //console.dir(Dropbox);

      $scope.connect = function() {
        console.log($scope);
        $scope.itemList = ['Something','else'];
        var
          dropboxClientCredentials,
          dropboxClient,
          dropboxXooMLUtility,
          dropboxItemUtility,
          mirrorSyncUtility,
          groupingItemURI,
          itemMirrorOptions;
          
        dropboxClientCredentials = {
          key: 'jrt7eykb5odmd98',
          secret: 'ayrxakqedjss46f'
        };
        dropboxClient = new Dropbox.Client(dropboxClientCredentials);

        dropboxXooMLUtility = {
          driverURI: 'DropboxXooMLUtility',
          dropboxClient: dropboxClient
        };
        dropboxItemUtility = {
          driverURI: 'DropboxItemUtility',
          dropboxClient: dropboxClient
        };
        mirrorSyncUtility = {
          utilityURI: 'MirrorSyncUtility'
        };
        
        //This is the starting point where the initial item mirror item will be
        //constructed: root. It can also be the name of
        //or path to a folder you want to limit access to
        groupingItemURI = '/'; //"Folder"
        
        //Set up all of the item mirror options, even though
        //chances are the only one you're going to use is case 3
        itemMirrorOptions = {
          1: {
            groupingItemURI: groupingItemURI,
            xooMLDriver: dropboxXooMLUtility,
            itemDriver: dropboxItemUtility
          },
          2: {
            groupingItemURI: groupingItemURI,
            xooMLDriver: dropboxXooMLUtility,
            itemDriver: dropboxItemUtility,
            syncDriver: mirrorSyncUtility,
            readIfExists: false
          },
          3: {
            groupingItemURI: groupingItemURI,
            xooMLDriver: dropboxXooMLUtility,
            itemDriver: dropboxItemUtility,
            syncDriver: mirrorSyncUtility,
            readIfExists: true
          }
        };

        //Authenticate dropbox access and construct your root/initial
        //item mirror object when you're ready
        dropboxClient.authenticate(function (error, client) {
          if (error) {
            throw error;
          }

          console.dir(client);
          


          new ItemMirror(itemMirrorOptions[3], function (error, itemMirror) {
            if (error) { throw error; }
            itemMirror.listAssociations(function (error, GUIDs){
              var length;
              //Limit output to x associations
              var cap = 25;
              itemMirror.getParent(function(error, parent){
                if (parent) {
                  //upOneLevel(parent);
                }
              });
              //make sure length does not exceed cap.
              if (GUIDs.length >= cap) {
                length = cap;
              }else {
                length = GUIDs.length;
              }
              //loop across GUID up to length
                            for (var i=0;i<length;i++){
                itemMirror.getAssociationDisplayText(GUIDs[i], function(error, text){
                  $scope.itemList.push(text);
                    //Check if this Association is a Grouping Item (a folder in the case of dropbox)
                });
                //Print the Association
                //prntAssoc(error, displayText, GUIDs[i], itemMirror);
              }
              if (error) {
                console.log(error);
              }
            });
          });
        });
      };
    });
  });
});