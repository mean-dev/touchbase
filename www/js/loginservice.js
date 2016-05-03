mainApp.service('LoginService', function (localStorageService, $window, $state) {


  var redirectUri = 'http://localhost:8100/#/tab/leads';
  var authUrl = 'http://devops.touchbase.tools/oauth/v2/authorize';
  var clientId = 'CLIENT_ID';

  var url = authUrl+"?client_id="+clientId+"&grant_type=authorization_code&redirect_uri="+redirectUri+"&response_type=code&state=UNIQUE_STATE_STRING";

  var loginWindow;
  var parser;
  var params;
  var token;
  return {
    login: function () {

      window.open = cordova.InAppBrowser.open;

      loginWindow = $window.open(url, '_blank', 'location=no,toolbar=no');
      loginWindow.addEventListener('loadstart', function (evt) {

        parser = $window.document.createElement('a');
        parser.href = evt.url;
        params = parser.search.split('&amp;');

        angular.forEach(params, function (param) {
          if (param.indexOf('access_token') > -1) {
            token = param.substring(13);
            if (token) {
              $window.alert(token);
              loginWindow.close();
              localStorageService.set('beats-token', token);
              $state.transitionTo('app.feed');
            } else {
            }
          }
        });
      });

    }
  }
});
