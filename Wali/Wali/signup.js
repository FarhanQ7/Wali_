

function myfunc(){

  Email =  document.getElementById("Email");
  Password = document.getElementById("Password");
  Retype = document.getElementById("Retype");


  if(Password.value.length <5){

  Pass_len_err = document.getElementById("Pass_err");
  Pass_len_err.hidden = false;

  }

  if(Password.value.length >= 5){

  Pass_len_err = document.getElementById("Pass_err");
  Pass_len_err.hidden = true;

  }




  if(Password.value != Retype.value ){


      MatchWarning = document.getElementById("Retype_err");
      MatchWarning.hidden = false;

  }
  if(Password.value == Retype.value ){


      MatchWarning = document.getElementById("Retype_err");
      MatchWarning.hidden = true;

  }



      firebase.auth().createUserWithEmailAndPassword(Email.value, Password.value).then(function(user) {
    var user = firebase.auth().currentUser;
    logUser(user); // Optional
}, function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

    document.getElementById("Email_err").innerHTML = errorMessage;
    document.getElementById("Email_err").hidden = false;


});







}
