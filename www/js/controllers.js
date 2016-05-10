angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, $state,$http,LoginService,$rootScope, $state) {
	$scope.signIn = function() {

    LoginService.login();

    $rootScope.$on('authorized', function(event, data){
      $state.go("tab.leads");
      LoginService.authdata = data.data;
    });

	};

})

.controller('LeadCtrl', function($scope, $state, $ionicHistory, leads, $http, $rootScope, $filter) {

	$scope.goBack = function() {
    $state.go("tab.leads");
	};
  var lead = $filter('filter')($rootScope.leads, {'id':$state.params['id']})[0];

  $scope.lead = lead;
  console.log(lead);

})

.controller('leadsListCtrl',function($scope, leads, LoginService, $http, $rootScope, $state){

  $scope.items = new Array();

  $scope.curPage = 1;
  $scope.OnPage = 50;
  $scope.totalCount = 0;

  if(LoginService.authdata){

    $http.defaults.headers.common.Authorization = 'Bearer '+LoginService.authdata.access_token;

    var url = 'https://devops.touchbase.tools/mautic/api/leads?start='+(($scope.curPage - 1)*$scope.OnPage)+'&limit='+$scope.OnPage;

    $http.get(url).then(function(e){

        $scope.totalCount = e.data.total;
        $scope.curPage++;

        e.data.leads.forEach(function(value, index){
          $scope.items.push(value);
        });

        $rootScope.leads = $scope.items;

      }, function(e){
        console.log('fail',e);
    });

  };

  $scope.loadMore = function(){

    $http.defaults.headers.common.Authorization = 'Bearer '+LoginService.authdata.access_token;

    var url = 'https://devops.touchbase.tools/mautic/api/leads?start='+(($scope.curPage)*$scope.OnPage)+'&limit='+$scope.OnPage;

    if($scope.curPage*$scope.OnPage < $scope.totalCount){
      $http.get(url).then(function(e){

        $scope.total = e.data.total;

        e.data.leads.forEach(function(value, index){
          $scope.items.push(value);
        });

        $scope.curPage++;
        $scope.$broadcast('scroll.infiniteScrollComplete');

      }, function(e){
        console.log('fail',e);
      });
    }

  };

  $scope.mailLead = function(){
    console.log('qwe');
    $state.go("mail");
  };

})

.controller('listCtrl',function($scope, leads, LoginService, $http, $rootScope){

  $scope.items = new Array();

  if(LoginService.authdata){

    $http.defaults.headers.common.Authorization = 'Bearer '+LoginService.authdata.access_token;

    var url = 'https://devops.touchbase.tools/mautic/api/lists?start='+(($scope.curPage - 1)*$scope.OnPage)+'&limit='+$scope.OnPage;

    $http.get(url).then(function(e){

      $scope.items = new Array();
      $rootScope.lists = $scope.items;

      angular.forEach(e.data, function(value, key) {
        $scope.items.push(value);
      });

      console.log($scope.items);

    }, function(e){
      console.log('fail',e);
    });

  }

  $scope.loadMore = function(){

    $http.defaults.headers.common.Authorization = 'Bearer '+LoginService.authdata.access_token;

    var url = 'https://devops.touchbase.tools/mautic/api/leads?start='+(($scope.curPage)*$scope.OnPage)+'&limit='+$scope.OnPage;

    if($scope.curPage*$scope.OnPage < $scope.totalCount){
      $http.get(url).then(function(e){

        $scope.total = e.data.total;

        e.data.leads.forEach(function(value, index){
          $scope.items.push(value);
        });

        $scope.curPage++;
        $scope.$broadcast('scroll.infiniteScrollComplete');

      }, function(e){
        console.log('fail',e);
      });
    }

  }

})

.controller('MailCtrl',function($scope, leads, LoginService, $http, $rootScope){
  // ...
});
