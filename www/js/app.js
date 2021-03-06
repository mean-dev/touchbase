// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var mainApp = angular.module('starter', ['ionic','ionic.service.core', 'starter.controllers','LocalStorageModule', 'ngCordovaOauth', 'ngStorage'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(false);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });

  var push = new Ionic.Push({});

  push.register(function(token) {
    // Log out your device token (Save this!)
    console.log("Got Token:",token.token);
  });


})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  var isAndroid = ionic.Platform.isAndroid();
  if (isAndroid) {
    $ionicConfigProvider.tabs.position('bottom');
    $ionicConfigProvider.tabs.style('standard');
  }
  $ionicConfigProvider.navBar.alignTitle('center');
  $stateProvider

    .state('login', {
    url: "/login",
    //templateUrl: "templates/login.html",
    controller: 'LoginCtrl'
  })

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })

  // Each tab has its own nav history stack:
    .state('tab.leads', {
      url: '/leads',
      views: {
        'tab-leads': {
          templateUrl: 'templates/tab-favorites.html'
        }
      }
    })
    .state('lead-detail', {
        url: '/account/:id',
        templateUrl: 'templates/tab-account.html',
        controller: 'LeadCtrl'
    })
    .state('lead-edit', {
      url: '/editlead/:id',
      templateUrl: 'templates/editlead.html',
      controller: 'LeadCtrl'
    })
    .state('mail', {
      url: '/mail/:id',
      templateUrl: 'templates/mail.html',
      controller: 'MailCtrl'
    })
    .state('tab.lists', {
      url: '/lists',
      views: {
        'tab-lists': {
          templateUrl: 'templates/tab-chats.html'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  //$urlRouterProvider.otherwise('/tab/dash');
  $urlRouterProvider.otherwise('/login');

});

