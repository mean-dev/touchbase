angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, $state,$http,LoginService) {
	$scope.signIn = function() {

    LoginService.login();

    //$state.go('tab.leads');

    /*$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

    $http.post('http://devops.touchbase.tools/oauth/v2/', {
          'client_id': 123123,
          'client_secret': 123123123123,
          'grant_type': 'password',
          'username': 'user',
          'password': 'password',

          withCredentials: true,
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
    })
      .success(function(data) {
          accessToken = data.access_token;
          $location.path("/secure");
      })
      .error(function(data, status) {
          alert("ERROR: " + data);
      });
      */
    ///

	};
})

.controller('LeadCtrl', function($scope, $state, $ionicHistory) {

	$scope.goBack = function() {
		window.location = '/#/tab/leads';
	};

});
