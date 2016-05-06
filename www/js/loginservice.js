mainApp.service('LoginService', function (localStorageService, $window, $state, $cordovaOauth) {


  var redirectUri = 'http://localhost:8100/#/tab/leads';
  var authUrl = 'http://devops.touchbase.tools/oauth/v2/authorize';
  var clientId = '1_1e0aakmbs25ckw0ok8wgwo48cs8w4wckw44w00048swswg8gw0';

  var url = authUrl+"?client_id="+clientId+"&grant_type=authorization_code&redirect_uri="+redirectUri+"&response_type=code&state=UNIQUE_STATE_STRING";

  var loginWindow;
  var parser;
  var params;
  var token;
  return {
    login: function () {

      $cordovaOauth.muatic('', []);

    }
  }

  this.token = false;

});
