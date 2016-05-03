mainApp.factory('LoginService', function (localStorageService, $window, Beats, $state) {
  var url = Beats.authorize + '?response_type=token&amp;' + 'redirect_uri=' + Beats.callback + '&amp;client_id=' + Beats.key;
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
