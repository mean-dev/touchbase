mainApp.service('LoginService', function (localStorageService, $window, $state) {

  var Beats = {
    'authorize' : 'http://devops.touchbase.tools/oauth/v2/authorize',
    'callback' : 'http://localhost:8100/#/tab/leads'
  };
  
  /*/oauth/v2/authorize?
    client_id=CLIENT_ID
    &grant_type=authorization_code
    &redirect_uri=https%3A%2F%2Fyour-redirect-uri.com%2Fcallback
  &response_type=code
  &state=UNIQUE_STATE_STRING*/

  var url = Beats.authorize + '?response_type=code&amp;' + 'redirect_uri=' + Beats.callback + '&amp;client_id=' + Beats.key;
  var loginWindow;
  var parser;
  var params;
  var token;
  return {
    login: function () {
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
