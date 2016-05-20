angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, $state,$http,LoginService,$rootScope, $state, $ionicPlatform, $localStorage, $sessionStorage) {
	//$scope.signIn = function() {

    $ionicPlatform.ready(function() {

      $scope.$storage = $localStorage;

      LoginService.login();

      $rootScope.$on('authorized', function(event, data){
        $state.go("tab.leads");
        LoginService.authdata = data.data;

        //window.localStorage.set({'authdata': JSON.stringify(data.data)});
        //console.log(window.localStorage.get('authdata'));

      });
    });

	//};

})

.controller('LeadCtrl', function($scope, $state, $ionicHistory, leads, $http, $rootScope, $filter) {

	$scope.goBack = function() {
    $state.go("tab.leads");
	};
  var lead = $filter('filter')($rootScope.leads, {'id':$state.params['id']})[0];

  $scope.fieldsVisible = false;
  $scope.lead = lead;
  $rootScope.leadname = lead.createdByUser ? lead.createdByUser : "Anonymous";
  $rootScope.leadid = lead.id;

  $scope.toogle = function(){
    if($scope.fieldsVisible) $scope.fieldsVisible = false;
    else $scope.fieldsVisible = true;
  }

})

.controller('leadsListCtrl',function($scope, leads, LoginService, $http, $rootScope, $state){

  $scope.items = new Array();

  $scope.curPage = 1;
  $scope.OnPage = 50;
  $scope.totalCount = 0;

  if(LoginService.authdata){

    $http.defaults.headers.common.Authorization = 'Bearer '+LoginService.authdata.access_token;

    var url = 'https://devops.touchbase.tools/api/leads?start='+(($scope.curPage - 1)*$scope.OnPage)+'&limit='+$scope.OnPage;

    $http.get(url).then(function(e){

        $scope.totalCount = e.data.total;
        $scope.curPage++;

        e.data.leads.forEach(function(value, index){

          value['lastActive'] = moment(value['lastActive'], "YYYYMMDD").fromNow();

          $scope.items.push(value);
          console.log(value['lastActive']);
        });

        $rootScope.leads = $scope.items;

      }, function(e){
        console.log('fail',e);
    });

  };

  $scope.loadMore = function(){

    $http.defaults.headers.common.Authorization = 'Bearer '+LoginService.authdata.access_token;

    var url = 'https://devops.touchbase.tools/api/leads?start='+(($scope.curPage)*$scope.OnPage)+'&limit='+$scope.OnPage;

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
    $state.go("mail");
  };

})

.controller('listCtrl',function($scope, leads, LoginService, $http, $rootScope){

  $scope.items = new Array();

  if(LoginService.authdata){

    $http.defaults.headers.common.Authorization = 'Bearer '+LoginService.authdata.access_token;

    var url = 'https://devops.touchbase.tools/api/lists?start='+(($scope.curPage - 1)*$scope.OnPage)+'&limit='+$scope.OnPage;

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

.controller('MailCtrl',function($scope, $state, leads, LoginService, $http, $rootScope){

  $scope.goBack = function(){
    $state.go("tab.leads");
  };

  $scope.templates = [];

  /**
   * Get templates list
   * @type {string}
     */
  var url = 'https://devops.touchbase.tools/api/leads/getusertemplates';
  $http.get(url).then(function(e){
    $scope.templates = e.data.templates.en;
  }, function(e){
    console.log('fail',e);
  });

  $scope.sendMail = function(lead){

    var mail = {
      'id' : lead, // lead id
      'from' : $scope.from, // from
      'subject' : $scope.subject, // mail subject
      'body' : $scope.body // mail body
    };

    $http.post('https://devops.touchbase.tools/api/leads/sendmail', mail).then(function(e){
      console.log('success', e);
    }, function(e){
      console.log('fail', e);
    });

  };

});
