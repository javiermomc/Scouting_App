// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.teams', 'starter.matches', 'firebase'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  $ionicConfigProvider.tabs.position('bottom');

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    .state('mainScreen', {
      url: '/main',
      templateUrl: 'mainScreen/sign.html',
      controller: 'Sign'
    })
    .state('signIn', {
      url:'/signIn',
      templateUrl: 'mainScreen/signIn.html',
      controller: 'SignIn'
    })
    .state('signUp', {
      url:'/signUp',
      templateUrl: 'mainScreen/signUp.html',
      controller: 'SignUp'
    })
    .state('regional', {
      url:'/regional',
      templateUrl: 'mainScreen/selectRegional.html',
      controller: 'Regional'
    })
  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'teamD/tabs.html'
  })
    .state('tab.addMatch', {
      url: '/addMatch',
      views:{
        'tab-teams':{
          templateUrl: 'teamD/match-add.html',
          controller: 'AddMatchCtrl'
        }
      }
    })
    .state('tab.addTeam', {
      url: '/addTeam',
      views:{
        'tab-details':{
          templateUrl: 'teamD/team-add.html',
          controller: 'AddTeamCtrl'
        }
      }
    })
    .state('tab.teams', {
      url: '/teams',
      views: {
        'tab-teams': {
          templateUrl: 'teamD/tab-teams.html',
          controller: 'TeamsCtrl'
        }
      }
    })
    .state('tab.teamMatch', {
      url: '/teams/match/:teamId',
      views: {
        'tab-teams': {
          templateUrl: 'teamD/teams-matches.html',
          controller: 'TeamsMatchCtrl',
        }
      }
    })
    .state('tab.teams-detail', {
      url: '/details/:teamId',
      views: {
        'tab-details': {
          templateUrl: 'teamD/teams-detail.html',
          controller: 'TeamsDetailCtrl'
        }
      }
    })
    .state('tab.teamsDetailsTab', {
      url: '/details',
      views: {
        'tab-details':{
          templateUrl: 'teamD/tab-teamsDetails.html',
          controller: 'TeamsDetailsTabCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/main');

});
