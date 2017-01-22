/**
 * Created by Javier on 12/20/2016.
 */
var config = {
  apiKey: "AIzaSyCn4vqWkFKPfPb4KtVz-srr1RMJUQ8ySFk",
  authDomain: "scouting-app-8a895.firebaseapp.com",
  databaseURL: "https://scouting-app-8a895.firebaseio.com",
  storageBucket: "scouting-app-8a895.appspot.com",
  messagingSenderId: "485081648732"
};
firebase.initializeApp(config);
var database = firebase.database();
var user = firebase.auth().currentUser;
var isOk=false;
if (user != null) {
  name = user.displayName;
  email = user.email;
  uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                   // this value to authenticate with your backend server, if
                   // you have one. Use User.getToken() instead.
}
var checkIfExists = function(username){
  var exists = false;
  database.ref('/users').on('child_added', function(data){
    if(data.key==username){
      exists = true;
    }
  });
  return exists;
};
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}
var setUser = function(email, password, name, lastName){
  var exists = checkIfExists(email);
  sleep(100);
  if(!exists){
    database.ref('/users').child('/'+name+lastName).set({
      'username': email,
      'password': password,
      'name': name,
      'lastName': lastName
    });
    user ={
      'username': email,
      'name': name,
      'lastName': lastName
    };
    return true;
  }else return false;
};
