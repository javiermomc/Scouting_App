angular.module('starter.controllers', [])
  .controller('Sign', function($scope){
    $scope.signInButton = function(){location.href = '#/signIn'};
    $scope.signUpButton = function(){location.href = '#/signUp'};
  })
  .controller('SignIn', function($scope,$rootScope,$ionicHistory,$ionicPopup){
    $scope.data = {};
    $scope.skipSign = function(){location.href = '#/regional'};
    $scope.signIn = function(){
    var email = $scope.data.email; var password= $scope.data.password;
      if(firebase.auth().signInWithEmailAndPassword(email, password).then(function(){location.href = '#/regional'},function(error){
          console.log(error.code);
          console.log(error.message);
        })
      ){
        location.href = '#/regional';
      }
    };
  })
  .controller('SignUp', function($scope, $ionicPopup, $ionicHistory){
    $scope.data = {};
    $scope.skipSign = function(){location.href = '#/regional'};
    $scope.signUp = function(){
      if($scope.data.password != $scope.data.password2) var alertPopup = $ionicPopup.alert({title: 'Passwords don\'t match'});
      else firebase.auth().createUserWithEmailAndPassword($scope.data.email, $scope.data.password).then(function(){
        setUser($scope.data.email, $scope.data.password, $scope.data.name, $scope.data.lastName);
        location.href = '#/regional';
        $ionicHistory.nextViewOptions({
          historyRoot: true
        });
      },function(error){
        console.log(error.code);
        console.log(error.message);
        if (error.code == 'auth/weak-password') {
          $ionicPopup.alert({
            title: 'Authentication Error',
            template: 'Password too weak, at least 6 characters'
        });
        }
        if (error.code == 'auth/email-already-in-use') {
          $ionicPopup.alert({
            title: 'Authentication Error',
            template: 'Email already taken'
          });
        }
        if (error.code == 'auth/invalid-email') {
          $ionicPopup.alert({
            title: 'Authentication Error',
            template: 'Invalid email'
          });
        }
      });
    }
  })
  .controller('Regional', function($scope){
    $scope.mexico = function(){
      regional = 'Mexico';
      regional = 'Mexico';
      location.href ='#/tab/teams';
    };
    $scope.ny = function(){
      regional = 'NY';
      regional = 'NY';
      location.href ='#/tab/teams';
    };
    $scope.laguna = function(){
      regional = 'Laguna';
      regional = 'Laguna';
      location.href ='#/tab/teams';
    };
    $scope.houston = function(){
      regional = 'Houston';
      regional = 'Houston';
      location.href ='#/tab/teams';
    };
  })
  .controller('AddMatchCtrl', function ($scope, Teams, Matches, $ionicPopup, $ionicHistory) {
    $scope.data = {};
    $scope.submitButton = function () {
      if(
        typeof($scope.data.match)!=typeof (0)||
        typeof($scope.data.score)!=typeof (0)||
        typeof($scope.data.points)!=typeof (0)||
        typeof($scope.data.auto)!=typeof (0)||
        typeof($scope.data.teleop)!=typeof (0)
      ) var alertPopup = $ionicPopup.alert({
          title: 'You have to use only numbers!!!'});
      else if (Matches.add(Teams, {
          id: Matches.all().length,
          match: $scope.data.match,
          score: $scope.data.score,
          team: $scope.data.team,
          points: $scope.data.points,
          auto: $scope.data.auto,
          teleop: $scope.data.teleop,
          comment: $scope.data.comment,
          creator: user.name + ' ' + user.lastName
        })
      ) {
        $ionicHistory.goBack();
      } else {
        var alertPopup = $ionicPopup.alert({
          title: 'The team doesn\'t exist!!!',
          template: 'Please create it'
        });
      }
    }
  })
  .controller('AddTeamCtrl', function ($scope, Teams, $ionicPopup, $ionicHistory) {
    $scope.data = {};
    var uri = '';
    var options = {
      width: 800,
      height: 800,
      quality: 50
    };
    $scope.imgPic = function() {
      console.log('Image Picker!!!');
      /*
      try {
      $cordovaImagePicker.getPictures(options)
        .then(function (results) {
          for (var i = 0; i < results.length; i++) {
            console.log('Image URI: ' + results[i]);
          }
        }, function (error) {
          // error getting photos
        });
    }catch(error){
        console.log(error);
      }*/
    };
    $scope.submitButton = function () {
      if(!$scope.data.name||!$scope.data.number) var alertPopup = $ionicPopup.alert({title: 'You can\'t leave blanks!!!'});
      else if(typeof($scope.data.number)!=typeof (0)) var alertPopup = $ionicPopup.alert({title: 'Team number must be a number!!!'});
      else {
        Teams.add($scope.data.name,$scope.data.number, uri);
        $ionicHistory.goBack();
      }
    }

  })
  .controller('TeamsCtrl', function($scope, $http, $ionicHistory, $state, Teams, Matches, firebase, $ionicPopup) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.teams = Teams.all();
    $scope.refresh = function(){
      $http.get('#/tab/teams').success(function(){
        Teams.refresh();
        $scope.teams = Teams.all();
      }).finally($scope.$broadcast('scroll.refreshComplete'));

    };
    $scope.remove = function (team) {
      Teams.remove(team, Matches);
    };
    $scope.addTeams = function (name, teamNumber) {
      Teams.addTeams('name', teamNumber);
    };

  })
  .controller('TeamsDetailCtrl', function ($scope, $stateParams, Teams) {
    $scope.team = Teams.get($stateParams.teamId);
    console.log('TeamsDetailWorking');
  })
  .controller('TeamsMatchCtrl', function ($scope, $stateParams, Teams, $ionicPopup, $state, Matches) {
    console.log($stateParams.teamId);
    $scope.team = Teams.get($stateParams.teamId);
    $scope.matches = Matches.match($scope.team);
    $scope.viewTeam = function (teamToView){
      console.log("View Team starting...");
      location.href = "#/tab/teams/details/"+teamToView;
    };
    $scope.refresh = function(){
      Matches.refresh($scope.team);
      $scope.matches = Matches.match($scope.team);
      $state.go($state.current, {}, {reload: true});
    };
    $scope.editMatchScoreButton = function (matchId) {
      console.log('Function is working!');
      $scope.data = {};


      // An elaborate, custom popup
      var myPopup = $ionicPopup.show({

        template: '<input type="number" ng-model="data.score">',
        title: 'Enter new score',
        scope: $scope,
        buttons: [
          {text: 'Cancel',
          onTap: function(e){
            console.log("Score: "+$scope.data.score);
            console.log("Score var: "+Matches.getVal(matchId, 'score'));
          }
          },
          {
            text: '<b>Done</b>',
            type: 'button-positive',
            onTap: function (e) {
              if (!$scope.data.score) {
                //don't allow the user to close unless he enters wifi password
                e.preventDefault();
                console.log("Score: "+$scope.data.score);
                console.log("Score var: "+Matches.getVal(matchId, 'score'));
              }
              myPopup.then(function () {
                if(typeof(1)==typeof ($scope.data.score))Matches.setVal(matchId, 'score', $scope.data.score);
                  console.log("Score: "+$scope.data.score);
                  console.log("Score var: "+Matches.getVal(matchId, 'score'));
              }
              )
            }
          }]
      });
    };
    $scope.editMatchPointsButton = function (matchId) {
      console.log('Function is working!');
      $scope.data = {};


      // An elaborate, custom popup
      var myPopup = $ionicPopup.show({

        template: '<input type="number" ng-model="data.points">',
        title: 'Enter new points',
        scope: $scope,
        buttons: [
          {text: 'Cancel',
            onTap: function(e){
              console.log("Points: "+$scope.data.points);
              console.log("Points var: "+Matches.getVal(matchId, 'points'));
            }
          },
          {
            text: '<b>Done</b>',
            type: 'button-positive',
            onTap: function (e) {
              if (!$scope.data.points) {
                //don't allow the user to close unless he enters wifi password
                e.preventDefault();
                console.log("Points: "+$scope.data.points);
                console.log("Points var: "+Matches.getVal(matchId, 'points'));
              }
              myPopup.then(function () {
                  if(typeof(1)==typeof ($scope.data.points))Matches.setVal(matchId, 'points', $scope.data.points);
                  console.log("Points: "+$scope.data.points);
                  console.log("Points var: "+Matches.getVal(matchId, 'points'));
                }
              )
            }
          }]
      });
    };
    $scope.editMatchAutoButton = function (matchId) {
      console.log('Function is working!');
      $scope.data = {};


      // An elaborate, custom popup
      var myPopup = $ionicPopup.show({

        template: '<input type="number" ng-model="data.auto">',
        title: 'Enter new auto',
        scope: $scope,
        buttons: [
          {text: 'Cancel',
            onTap: function(e){
              console.log("Auto: "+$scope.data.auto);
              console.log("Auto var: "+Matches.getVal(matchId, 'auto'));
            }
          },
          {
            text: '<b>Done</b>',
            type: 'button-positive',
            onTap: function (e) {
              if (!$scope.data.auto) {
                //don't allow the user to close unless he enters wifi password
                e.preventDefault();
                console.log("Auto: "+$scope.data.auto);
                console.log("Auto var: "+Matches.getVal(matchId, 'auto'));
              }
              myPopup.then(function () {
                  if(typeof(1)==typeof ($scope.data.auto))Matches.setVal(matchId, 'auto', $scope.data.auto);
                  console.log("Auto: "+$scope.data.auto);
                  console.log("Auto var: "+Matches.getVal(matchId, 'auto'));
                }
              )
            }
          }]
      });
    };
    $scope.editMatchTeleopButton = function (matchId) {
      console.log('Function is working!');
      $scope.data = {};


      // An elaborate, custom popup
      var myPopup = $ionicPopup.show({

        template: '<input type="number" ng-model="data.teleop">',
        title: 'Enter new teleop',
        scope: $scope,
        buttons: [
          {text: 'Cancel',
            onTap: function(e){
              console.log("Teleop: "+$scope.data.teleop);
              console.log("Teleop var: "+Matches.getVal(matchId, 'teleop'));
            }
          },
          {
            text: '<b>Done</b>',
            type: 'button-positive',
            onTap: function (e) {
              if (!$scope.data.teleop) {
                //don't allow the user to close unless he enters wifi password
                e.preventDefault();
                console.log("Teleop: "+$scope.data.teleop);
                console.log("Teleop var: "+Matches.getVal(matchId, 'teleop'));
              }
              myPopup.then(function () {
                  if(typeof(1)==typeof ($scope.data.teleop))Matches.setVal(matchId, 'teleop', $scope.data.teleop);
                  console.log("Teleop: "+$scope.data.teleop);
                  console.log("Teleop var: "+Matches.getVal(matchId, 'teleop'));
                }
              )
            }
          }]
      });
    };
    $scope.editMatchCommentButton = function (matchId) {
      $scope.data = {};
      // An elaborate, custom popup
      var myPopup = $ionicPopup.show({

        template: Matches.getVal(matchId, 'comment')+'</br><input type="text" ng-model="data.comment">',
        title: 'Enter new comment',
        scope: $scope,
        buttons: [
          {text: 'Cancel'
          },
          {
            text: '<b>Done</b>',
            type: 'button-positive',
            onTap: function (e) {
              if (!$scope.data.comment) {
                //don't allow the user to close unless he enters wifi password
                e.preventDefault();
              }
              myPopup.then(function () {
                  Matches.setVal(matchId, 'comment', $scope.data.comment);
                }
              )
            }
          }]
      });
    };
  })
  .controller('TeamsDetailsTabCtrl', function($scope, $http, $ionicHistory, $state, Teams, Matches, firebase, $ionicPopup) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.teams = Teams.all();
    $scope.refresh = function(){
      $http.get('#/tab/teams').success(function(){
        Teams.refresh();
        $scope.teams = Teams.all();
      }).finally($scope.$broadcast('scroll.refreshComplete'));

    };
    $scope.remove = function (team) {
      Teams.remove(team, Matches);
    };
    $scope.add = function(){location.href = '#/tab/addTeam'};
    $scope.addTeams = function (name, teamNumber) {
      Teams.addTeams('name', teamNumber);
    };

  });


