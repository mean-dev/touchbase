(function() {
  'use strict';

  angular.module('oauth.muatic', ['oauth.utils'])
    .factory('$ngCordovaMuatic', muatic);

  function muatic($q, $http, $cordovaOauthUtility) {
    return { signin: oauthMuatic };

    /*
     * Sign into the Muatic service
     *
     * @param    string clientId
     * @param    array appScope
     * @param    object options
     * @return   promise
     */
    function oauthMuatic(clientId, appScope, options) {
      var deferred = $q.defer();
      if(window.cordova) {
        if($cordovaOauthUtility.isInAppBrowserInstalled()) {
          var redirect_uri = "http://localhost/callback";
          if(options !== undefined) {
            if(options.hasOwnProperty("redirect_uri")) {
              redirect_uri = options.redirect_uri;
            }
          }

          var clientId = '1_1e0aakmbs25ckw0ok8wgwo48cs8w4wckw44w00048swswg8gw0';
          var redirectUri = encodeURIComponent('http://localhost:8000/index.html#/tab/leads');

          var browserRef = window.cordova.InAppBrowser.open('https://test123123.mautic.com/oauth/v2/authorize?client_id=' + clientId + '&redirect_uri=' + redirectUri + '&response_type=code', '_blank', 'location=no,clearsessioncache=yes,clearcache=yes');
          browserRef.addEventListener("loadstart", function(event) {
            if((event.url).indexOf(redirect_uri) === 0) {
              browserRef.removeEventListener("exit",function(event){});
              browserRef.close();
              var callbackResponse = (event.url).split("#")[1];
              var responseParameters = (callbackResponse).split("&");
              var parameterMap = [];
              for(var i = 0; i < responseParameters.length; i++) {
                parameterMap[responseParameters[i].split("=")[0]] = responseParameters[i].split("=")[1];
              }
              if(parameterMap.access_token !== undefined && parameterMap.access_token !== null) {
                deferred.resolve({ access_token: parameterMap.access_token, token_type: parameterMap.token_type, expires_in: parameterMap.expires_in, id_token: parameterMap.id_token });
              } else {
                deferred.reject("Problem authenticating");
              }
            }
          });
          browserRef.addEventListener('exit', function(event) {
            deferred.reject("The sign in flow was canceled");
          });
        } else {
          deferred.reject("Could not find InAppBrowser plugin");
        }
      } else {
        deferred.reject("Cannot authenticate via a web browser");
      }
      return deferred.promise;
    }
  }

  muatic.$inject = ['$q', '$http', '$cordovaOauthUtility'];
})();
