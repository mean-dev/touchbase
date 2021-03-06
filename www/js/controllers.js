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

.controller('LeadCtrl', function($scope, $state, $ionicHistory, leads, $http, $rootScope, $filter, $ionicModal) {

  var lead = $filter('filter')($rootScope.leads, {'id':$state.params['id']})[0];

  $scope.fieldsVisible = false;
  $scope.lead = lead;
  $rootScope.leadname = lead.createdByUser ? lead.createdByUser : "Anonymous";
  $rootScope.leadid = lead.id;

  // get lead history
  var url = 'https://devops.touchbase.tools/api/leads/history?leadId='+lead.id;
  $http.get(url).then(function(e){
    lead.history = e.data;
  }, function(e){
    console.log('fail',e);
  });

  // get lead lists
  url = 'https://devops.touchbase.tools/api/leads/list?leadId='+lead.id;
  $http.get(url).then(function(e){
      lead.lists = e.data.data;
  }, function(e){ console.log('fail',e); });

  // get all available lists
  url = 'https://devops.touchbase.tools/api/lists';
  lead.alllists = [];
  $http.get(url).then(function(e){
      angular.forEach(e.data, function(value,key){
        lead.alllists.push(value);
      });
    console.log(lead.alllists);
  }, function(e){ console.log('fail',e); });


  // get lead campaigns
  url = 'https://devops.touchbase.tools/api/leads/'+lead.id+'/campaigns';
  lead.campaigns = [];
  $http.get(url).then(function(e){
    lead.campaigns = e.data.campaigns;
  }, function(e){ console.log('fail',e); });


  // get all available compaigns
  url = 'https://devops.touchbase.tools/api/campaigns';
  lead.allcompaigns = [];
  $http.get(url).then(function(e){
    lead.allcompaigns = e.data.campaigns;
    console.log("campaigns",e.data);
  }, function(e){ console.log('fail',e); });

  // get notes
  url = 'https://devops.touchbase.tools/api/leads/'+lead.id+'/notes/';
  $http.get(url).then(function(e){
    console.log(url, e.data);
    lead.notes = e.data.notes;
  }, function(e){ console.log('fail',e); });

  $scope.toogle = function(){
    if($scope.fieldsVisible) $scope.fieldsVisible = false;
    else $scope.fieldsVisible = true;
  };

  $scope.saveinfo = function(){

    // get lead history
    var url = 'https://devops.touchbase.tools/api/leads/'+lead.id+'/edit';
    $http.patch(url, lead.fields.all).then(function(e){
      console.log(e.data);
    }, function(e){
      console.log('fail',e);
    });

  };

  $scope.goBack = function() {
    $state.go("tab.leads");
  };

  $scope.removeLeadList = function (lead,list) {
    console.log('Remove from lead -'+lead+' list '+list);
  };

  $scope.removeList = function(id){

    // get lead history
    var url = 'https://devops.touchbase.tools/api/lists/'+id+'/lead/remove/'+lead.id;

    $http.post(url).then(function(e){

      // get lead lists
      url = 'https://devops.touchbase.tools/api/leads/list?leadId='+lead.id;
      $http.get(url).then(function(e){
        lead.lists = e.data.data;
      }, function(e){ console.log('fail',e); });

    }, function(e){
      console.log('fail',e);
    });

    console.log('remove list with id', id);
  };

  $scope.addList = function(){

    var url = 'https://devops.touchbase.tools/api/lists/'+$scope.newlist.id+'/lead/add/'+lead.id;

    $http.post(url).then(function(e){

      // get lead lists
      url = 'https://devops.touchbase.tools/api/leads/list?leadId='+lead.id;
      $http.get(url).then(function(e){
        lead.lists = e.data.data;
      }, function(e){ console.log('fail',e); });

    }, function(e){
      console.log('fail',e);
    });

    console.log('Add list', $scope.newlist, url );
  };

  $scope.deleteCampaign = function(id){

      var url = 'https://devops.touchbase.tools/api/campaigns/'+id+'/lead/remove/'+lead.id;

      $http.post(url).then(function(e){

        // get lead campaigns
        url = 'https://devops.touchbase.tools/api/leads/'+lead.id+'/campaigns';
        $http.get(url).then(function(e){
          lead.campaigns = [];
          lead.campaigns = e.data.campaigns;
        }, function(e){ console.log('fail',e); });

      }, function(e){
        console.log('fail',e);
      });

  };

  $scope.addCampaign = function(){

    var url = 'https://devops.touchbase.tools/api/campaigns/'+$scope.newcompaign.id+'/lead/add/'+lead.id;

    $http.post(url).then(function(e){

      // get lead campaigns
      url = 'https://devops.touchbase.tools/api/leads/'+lead.id+'/campaigns';

      $http.get(url).then(function(e){
        lead.campaigns = [];
        lead.campaigns = e.data.campaigns;
      }, function(e){ console.log('fail',e); });

    }, function(e){
      console.log('fail',e);
    });

  };

  $ionicModal.fromTemplateUrl('confirm-deletion.html', {
      scope: $scope,
      animation: 'slide-in-up'
  }).then(function(modal) {
      $scope.modal = modal;
  });

  $scope.openModal = function() {
      $scope.modal.show();
  };

})

.controller('leadsListCtrl',function($scope, leads, LoginService, $http, $rootScope, $state){

  $scope.items = new Array();
  $scope.curPage = 1;
  $scope.OnPage = 50;
  $scope.totalCount = 99999999;
  $scope.search = "";

  if(LoginService.authdata){

    $http.defaults.headers.common.Authorization = 'Bearer '+LoginService.authdata.access_token;

    if(!$rootScope.currentuid){
      var url = 'https://devops.touchbase.tools/api/u/id';
      $http.get(url).then(function(e){

          $rootScope.currentuid = e.data.userid;
          console.log('Recivied uid', $rootScope.currentuid);

          url = 'https://devops.touchbase.tools/api/leads?start='+(($scope.curPage - 1)*$scope.OnPage)+'&limit='+$scope.OnPage;
          url += '';

          console.log('Url for get leads list', url);

          $http.get(url).then(function(e){
            $scope.totalCount = e.data.total;
            $scope.curPage++;
            e.data.leads.forEach(function(value, index){
              value['lastActive'] = moment(value['lastActive'], "YYYYMMDD").fromNow();
              $scope.items.push(value);
            });
            $rootScope.leads = $scope.items;
          }, function(e){

            console.log('fail',e);

          });

      }, function(e){
          console.log('fail',e);
      });

    }else{

    }

  };

  $scope.deleteLead = function(id){

    // get lead history
    var url = 'https://devops.touchbase.tools/api/leads/'+id+'/delete';

    $http.delete(url).then(function(e){

      $scope.items = new Array();
      $scope.curPage = 1;
      $scope.OnPage = 50;
      $scope.totalCount = 99999999;
      $scope.search = "";

      $scope.loadMore();

    }, function(e){
      console.log('fail',url, e);
    });

  };

  $scope.loadMore = function(){

    console.log('Try to load infinitie');

    $http.defaults.headers.common.Authorization = 'Bearer '+LoginService.authdata.access_token;

    var url = 'https://devops.touchbase.tools/api/leads?start='+(($scope.curPage)*$scope.OnPage)+'&limit='+$scope.OnPage;

    if($scope.search != '') url += '&search='+$scope.search;

    if($scope.curPage*$scope.OnPage < $scope.totalCount){
      $http.get(url).then(function(e){

        $scope.totalCount = e.data.total;

        e.data.leads.forEach(function(value, index){
          value['lastActive'] = moment(value['lastActive'], "YYYYMMDD").fromNow();
          $scope.items.push(value);
        });

        $scope.curPage++;
        $scope.$broadcast('scroll.infiniteScrollComplete');

      }, function(e){
        console.log('fail',e);
      });
    }

  };

  $scope.$on('$stateChangeSuccess', function() {
    $scope.loadMore();
  });

  $scope.mailLead = function(id){
    $state.go("/mail/"+id);
  };

  $scope.$watch('search', function(){

    $scope.curPage = 1;
    $scope.OnPage = 50;
    $scope.totalCount = 99999999;

    $scope.items = Array();

    var url = 'https://devops.touchbase.tools/api/leads?start='+(($scope.curPage - 1)*$scope.OnPage)+'&limit='+$scope.OnPage;
    if($scope.search != '') url += '&search='+$scope.search;

    $http.get(url).then(function(e){

      $scope.totalCount = e.data.total;
      $scope.curPage++;

      console.log('Lead list', e.data);

      e.data.leads.forEach(function(value, index){
        value['lastActive'] = moment(value['lastActive'], "YYYYMMDD").fromNow();
        $scope.items.push(value);
      });

      $rootScope.leads = $scope.items;

    }, function(e){
      console.log('fail',e);
    });


  });

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

  var leadid = $state.params['id'];

  console.log($state.params);

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

  $scope.$watch('template', function(){
    //gettemplate
    var url = 'https://devops.touchbase.tools/api/leads/gettemplate/?templateId='+$scope.template;
    $http.get(url).then(function(e){

      console.log('Try to encode!!!',decodeURI(e.data.subject) );

      $scope.from = e.data.from;
      $scope.subject = decodeURI(e.data.subject);
      $scope.body = decodeURI(e.data.body);

    }, function(e){
      console.log('fail',e);
    });


  });

  $scope.sendMail = function(lead, $ionicHistory){

    var mail = {
      'id' : leadid, // lead id
      'from' : $scope.from, // from
      'subject' : $scope.subject, // mail subject
      'body' : $scope.body // mail body
    };

    $http.post('https://devops.touchbase.tools/api/leads/sendmail', mail).then(function(e){
      console.log('Sended');
    }, function(e){
      console.log('fail', e);
    });

    $scope.cancel = function(){
      $ionicHistory.goBack();
    }

  };

});
