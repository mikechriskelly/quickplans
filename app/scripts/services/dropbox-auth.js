define(['./module','angular'], function (services,angular) {

'use strict';

  // Check if dependencies are in scope
  // console.log('jquery: ' + typeof($));
  // console.log('ItemMirror: ' + typeof(ItemMirror));
  // console.log('Dropbox: ' + typeof(Dropbox));

  services.factory('dropboxAuth', ['$q',function($q) {

    var dropboxClientCredentials = {
      key: 'wsvaq6pyykd3mi8',
      secret: 'fqnw1x9o91han3c',
      token: 'xRhoafCazcIAAAAAAAAAVjksVLK3z90uaU4cMqUErZQsrJfKOI5_vv4jOJGZxvD5'
    };

    var dropboxClient = new Dropbox.Client(dropboxClientCredentials);

    return{
      connectDropbox = function() {
          var deferred = $q.defer();

          dropboxClient.authenticate(function (error, client) {
          
              console.log('Dropbox object:');
              console.dir(client);

              if (error) { deferred.reject(error); }
              deferred.resolve(client);
          });
          
          return deferred.promise;
        }
    };

  }]);

});

