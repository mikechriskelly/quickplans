define(['./module','angular'], function (services,angular) {

'use strict';

  // Check if dependencies are in scope
  // console.log('jquery: ' + typeof($));
  // console.log('ItemMirror: ' + typeof(ItemMirror));
  // console.log('Dropbox: ' + typeof(Dropbox));

  services.factory('dropboxAuth', ['$q',function($q) {

    var dropboxClientCredentials = {
      key: 'jrt7eykb5odmd98',
      secret: 'ayrxakqedjss46f',
      token: 'FgXq-pbmMH4AAAAAAAABfcc2ZhVM9cQDGgIEHBc-Yz7a1403SpYZXBjqzIfVUAJ5'
    };

    var dropboxClient = new Dropbox.Client(dropboxClientCredentials);

    return{
      connectDropbox : function() {
          var deferred = $q.defer();
          dropboxClient.authenticate(function (error, client) {
              if (error) { deferred.reject(error); }
              deferred.resolve(client);
          });       
          return deferred.promise;
        }
    };

  }]);

});

