define(['./module','angular','ItemMirror'], function (services,angular,ItemMirror) {
  
  'use strict';
    services.factory('listOp', ['$q','LI','IM', function($q, LI, IM){

      function listOp(dropboxClient){
              this.dropboxClient = dropboxClient;
              this.itemMirrors = [];
              this.listItems = [];
      }

      listOp.prototype.initializeView = function(){
              var self = this;
              var deferred = $q.defer();

              var im = new IM(self.dropboxClient);
              im.constructItemMirror()
                .then(function() { return im.getAssociationGUIDs(); })
                .then(function() { im.getAssociationNames(); })

              //create a root LI element for Root (parentIM, parentLI, GUID, title)
              var li = new LI('root','root','root','root','root');
              self.itemMirrors.push(im);
              self.listItems.push(li);

              deferred.resolve({
                  'rootIM' : im,
                  'rootLI' : li
              });

              return deferred.promise;
        };

      listOp.prototype.buildView = function(imObj,liObj){
              var self = this;        
              var promises = [];

              function buildViewRecursive(imObj,liObj){
                  console.log("Inside recursive");
                  console.log(imObj);
                  var associations = imObj.associations;
                  console.log(associations);
                  if (associations.length != 0){
                       for(var i=0; i < associations.length; i++){
                            var deferred = $q.defer();
                            imObj.isAssociatedItemGrouping(associations[i].guid)
                              .then( function(result){
                                  if (result == true){
                                      imObj.createItemMirrorForAssociatedGroupingItem(associations[i].guid)
                                        .then(function(result){

                                          //imAssoc wil not have the wrapper methods
                                                var imAssoc = result;
                                                for(var j=0; j < imObj.associatedItemMirrors.length; j++){
                                                    if( imObj.associatedItemMirrors[j] == imAssoc){
                                                      imObj.associatedItemMirrors[j] = new IM(self.dropboxClient);
                                                      imObj.associatedItemMirrors[j].itemMirror = imAssoc;
                                                      break;
                                                    }
                                                }

                                                imAssoc = imObj.associatedItemMirrors[j];
                                                imAssoc.getAssociationGUIDs()
                                                  .then(function() { imAssoc.getAssociationNames(); })

                                                //Populates display name for the newly created itemmirror object
                                                imAssoc.getDisplayName();

                                                //push item mirror to itemMirrors array
                                                self.itemMirrors.push(imAssoc);

                                                //formulate the path of the new list element
                                                var liPath = liObj.liPath.concat('.',imAssoc.displayName);

                                                //A new list element is created - parentIM, parentLI, liPath, GUID, displayText
                                                var liAssoc = new LI(imObj,liObj,liPath,associations[i].guid,associations[i].title);

                                                //schema reference 
                                                var schema = self.listItems;

                                                //split the liPath into an array - eg: root.a , root.a.b
                                                var pathList = liPath.split('.');

                                                //iterate to the path
                                                for( var k=0; k<pathList.length-1; k++){
                                                      var elem = pathlist[l];

                                                      //iterate through the listElement array to identify the parent LI
                                                      for( var l=0; l<schema.length ; l++){
                                                          //check to ensure that the parent is root
                                                          if(schema[l].displayName == elem){
                                                              if((pathList.length == 2) || (k == pathList.length-2)){
                                                                  self.listItems[l].children.push(liAssoc);
                                                                  break;                                                               
                                                              }
                                                              else{
                                                                  schema = schema[l].children;
                                                                  break;                                                           
                                                              }

                                                          }

                                                      }
                                                  }

                                                if (imAssoc.associations.length != 0){
                                                    buildViewRecursive(imAssoc,liAssoc);
                                                }
                                                deferred.resolve({
                                                    'ims' : self.itemMirrors,
                                                    'lis' : self.listItems
                                                });
                                          })
                                        promises.push(deferred.promise);
                                        return deferred.promise;
                                    }
                              });
                          }
                      }
                  }

                buildViewRecursive(imObj,liObj);
                return $q.all(promises);
          };

      listOp.prototype.orderView = function(){
          //takes in created listElements

          };

      //return the object, if this class should be written as 
      return listOp;

    }])


 });