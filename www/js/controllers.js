angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, $state,$http,LoginService,$rootScope, $state) {
	$scope.signIn = function() {

    LoginService.login();

    $rootScope.$on('authorized', function(event, data){
      $state.go("tab.leads");
      LoginService.token = data;
    });


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

.controller('LeadCtrl', function($scope, $state, $ionicHistory, leads, $http) {

	$scope.goBack = function() {
		window.location = '/#/tab/leads';
	};

  $scope.history = leads.leads.history($state.params['id']);
  $scope.notes = leads.leads.notes($state.params['id']);

})

.controller('leadsListCtrl',function($scope, leads, LoginService, $http){

  if(LoginService.token){

    var req = {
      method: 'POST',
      url: 'http://example.com',
      headers: {
        'Content-Type': undefined
      },
      data: { test: 'test' }
    };
    $http(req).then(function(){
      /*...*/
    }, function(){
      /*...*/
    });

  }

  //console.log("Token", LoginService.token);

  $scope.items = leads.leads.list();

});
