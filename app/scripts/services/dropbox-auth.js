define(['./module','angular'], function (services,angular) {

'use strict';

  services.factory('dropboxAuth', ['$q',function($q) {
    console.log('Dropbox factory');
    var dropboxClientCredentials = {
      key: 'jrt7eykb5odmd98',
      secret: 'ayrxakqedjss46f'
    };

    var dropboxClient = new Dropbox.Client(dropboxClientCredentials);
    var authenticatedClient = null;

    function getClient() {
      return authenticatedClient;
    }

    function connectDropbox() {
      var deferred = $q.defer();

      if(authenticatedClient) {
        console.log('Dropbox already authenticated');
        deferred.resolve(authenticatedClient);
      } else {
        console.log('Dropbox is authenticating');
        dropboxClient.authenticate(function (error, client) {
            if (error) { deferred.reject(error); }
            authenticatedClient = client;
            deferred.resolve(client);

            // Need this redirect to prevent digest from entering an infinite loop
            window.location.href = window.location.href + '#';
        });       
      }
      return deferred.promise;
    }
  
    function disconnectDropbox() {
      dropboxClient.signOut();
    }

    return{
      connectDropbox : connectDropbox,
      disconnectDropbox : disconnectDropbox,
      getClient : getClient
    };

  }]);

});

