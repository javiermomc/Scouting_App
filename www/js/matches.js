/**
 * Created by Javier on 12/2/2016.
 */
var matches=[];
var regional;
var teamMatches=[];
angular.module('starter.matches', [])
  .factory('Matches', function () {
    var updateDatabaseMatches = function(regional){
      matches = [];
      database.ref("/"+regional+"/matches").orderByChild('id').on('child_added', function(data){
        matches.push({
          'id': data.val().id,
          'match': data.val().match,
          'teamNumber': data.val().teamNumber,
          'score': data.val().score,
          'points': data.val().points,
          'auto': data.val().auto,
          'teleop': data.val().teleop,
          'comment': data.val().comment,
          'creator': data.val().creator
        });
      });
    };
    var addDatabaseMatch = function(match, regional){
      delete match.team;
      database.ref('/'+regional+"/matches").child('/'+matches.length).set(match);
      updateDatabaseMatches(regional);
    };
    updateDatabaseMatches(regional);
    return{
      all: function () {updateDatabaseMatches(regional); return matches},
      refresh: function(team){
        updateDatabaseMatches(regional);
        var teamMatches=[];
        var i = 0;
        while(i<matches.length){
          if(matches[i].teamNumber==team.teamNumber){
            teamMatches.push(matches[i]);
          }
          i++;
        }
      },
      add: function(teams, newMatch){
        var i=0, isOk=false;
        var team = teams.all();
        while(i<team.length){
          if(newMatch.team==team[i].teamNumber||newMatch.team==team[i].name){
            newMatch.teamNumber = team[i].teamNumber;
            isOk=true;
          }
          i++;
        }
        if(isOk==true)addDatabaseMatch(newMatch, regional);
        updateDatabaseMatches(regional);
        return isOk;
      },
      match: function(team){
        var i = 0;
        teamMatches = [];
        updateDatabaseMatches(regional);
        while(i<matches.length){
          if(matches[i].teamNumber==team.teamNumber){
            teamMatches.push(matches[i]);
          }
          i++;
        }
        return teamMatches;
      },
      getVal: function (matchId, value) {
        updateDatabaseMatches(regional);
        return matches[matchId][value];
      },
      setVal: function (matchId, value, newScore) {
        updateDatabaseMatches(regional);
        matches[matchId][value] = newScore;
        for(var i = 0; i<matches.length;i++)database.ref("/"+regional+"/matches").child(i).set({
          'id': matches[i].id,
          'match': matches[i].match,
          'teamNumber': matches[i].teamNumber,
          'score': matches[i].score,
          'points': matches[i].points,
          'auto': matches[i].auto,
          'teleop': matches[i].teleop,
          'comment': matches[i].comment,
          'creator': matches[i].creator
        });
        updateDatabaseMatches(regional);
      }
    }
  });
