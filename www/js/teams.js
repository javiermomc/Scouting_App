/**
 * Created by Javier on 11/12/2016.
 */
var teams=[];
angular.module('starter.teams', [])
.factory('Teams', function () {
  var updateDatabaseTeams = function(regional){
    teams = [];
    database.ref("/"+regional+"/teams").orderByChild('id').on('child_added', function(data){
      database.ref('/'+regional+'/teams/'+data.key).set({
        'id': teams.length,
        'teamNumber': data.val().teamNumber
      });
      teams.push({
        'id': teams.length,
        'name': data.key,
        'teamNumber': data.val().teamNumber
      });
    });
    console.log(teams);
  };
  var addDatabaseTeam = function(team, regional){
    updateDatabaseTeams(regional);
    database.ref('/'+regional+"/teams").child('/'+team.name).set({
      'id': teams.length-1,
      'teamNumber': team.teamNumber,
      // 'img': team.img
      });
  };
  return {
    all: function() {
      updateDatabaseTeams(regional);
      return teams;
    },
    refresh: function(){
      updateDatabaseTeams(regional);
    },
    remove: function(team, Matches) {
      teams.splice(teams.indexOf(team),1);
      database.ref('/'+regional+'/teams/'+team.name).remove();
      matches = Matches.all();
      for(var i = 0; i<matches.length; i++){
        if(matches[i].teamNumber==team.teamNumber){
          database.ref('/'+regional+'/matches/'+matches[i].id).remove();
        }
      }
      updateDatabaseTeams(regional);
    },
    get: function(teamId) {
      for (var i = 0; i < teams.length; i++) {
        if (teams[i].id === parseInt(teamId)) {
          return teams[i];
        }
      }
    },
    add: function(name, number, img){
      var team = {
        'id':teams.length,
        'name': name,
        'teamNumber':number
        // 'img': img
      };
      addDatabaseTeam(team, regional);
      updateDatabaseTeams(regional);
    },
    getLength: function(){
      return teams.length.toString();
    }
  };
});
options = {
  // max images to be selected, defaults to 15. If this is set to 1, upon
  // selection of a single image, the plugin will return it.
  maximumImagesCount: 1,

  // max width and height to allow the images to be.  Will keep aspect
  // ratio no matter what.  So if both are 800, the returned image
  // will be at most 800 pixels wide and 800 pixels tall.  If the width is
  // 800 and height 0 the image will be 800 pixels wide if the source
  // is at least that wide.

  // quality of resized image, defaults to 100
  quality: 600
};


