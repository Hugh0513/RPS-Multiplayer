
// Initialize Firebase
var config = {
  apiKey: "AIzaSyDOyecBOYPGKVDWad2kpcM6N7uYbmpByI8",
  authDomain: "multi-rps-c3693.firebaseapp.com",
  databaseURL: "https://multi-rps-c3693.firebaseio.com",
  projectId: "multi-rps-c3693",
  storageBucket: "multi-rps-c3693.appspot.com",
  messagingSenderId: "203688883345"
};
firebase.initializeApp(config);

var dataRef = firebase.database(); 

// Initial Values
var name = "";
var comment = "";
var nPlayer = 0;
var yourPlayerId= 0;
var yourPlayerName = "";
var player1;
var player2;
var wins = 0;
var loses = 0;
var displayDiv; // display target div
var intervalId

var firebaseReset = function () {

  dataRef.ref().set({});

}

      
var addPlayer = function() {
  //*** Set players into firebase ***//
  //*** and Display message("You are player 1/2") and div(name, wins and loses) ***//

  // Read firebase only once to set Players
  dataRef.ref().once("value", function(snapshot) {

    if (!snapshot.child("/players/1").exists()) {
      console.log("player1 doesnt  exists");
      dataRef.ref('/players/1').set({
        name: name,
        wins: wins,
        loses: loses
      });

      player1 = name;
      yourPlayerId = 1;

      displayYourId(); // your are player ....
    }
    else if (!snapshot.child("/players/2").exists()) {
      console.log("player2 doesnt exist");
      dataRef.ref('/players/2').set({
        name: name,
        wins: wins,
        loses: loses
      });

      player2 = name;
      yourPlayerId = 2;

      displayYourId(); // your are player ....

      // update "turn"
      dataRef.ref().update({
        turn: 1
      });

    }
    else {
      alert("Someone is gaming...");
    }

  }, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
  
}

var displayYourId = function() {
  $("#start").empty(); // Remove Start button
  $("#message1").html("<h2>Hi " + name + "! You are Player " + yourPlayerId + "</h2>");
}

var displayPlayerDiv = function() {

}

/*
var displayWaitingMessage = function () {

  var enemy;
  if (yourPlayerId === 1) {
    enemy = snapshot.child('/players/2').val().name;
  }
  else if (yourPlayerId === 2) {
    enemy = snapshot.child('/players/1').val().name;
  }

  $("#message2").html("Waiting for " + enemy + " to choose.");
    
}
*/

var displayOption = function() {
  // Display Options
  // This function gets the target div as displayDiv
  var newDiv = document.createElement("div");
  $(displayDiv).append(newDiv);
  $(newDiv).attr("class", "option");
  $(newDiv).attr("id", "rock");
  $(newDiv).attr("value", "Rock");
  $(newDiv).html("Rock");

  var newDiv = document.createElement("div");
  $(displayDiv).append(newDiv);
  $(newDiv).attr("class", "option");
  $(newDiv).attr("id", "paper");
  $(newDiv).attr("value", "Paper");
  $(newDiv).html("Paper");

  var newDiv = document.createElement("div");
  $(displayDiv).append(newDiv);
  $(newDiv).attr("class", "option");
  $(newDiv).attr("id", "scissors");
  $(newDiv).attr("value", "Scissors");
  $(newDiv).html("Scissors");
}

// In 3 seconds, go to next game.
var nextGame = function() {
  //intervalId = setInterval(goToNext, 1000 * 3);
  setTimeout(goToNext, 1000 * 3);
  console.log("nextGame");
}

var stop = function() {
  clearInterval(intervalId);
}

var goToNext = function() {
  console.log("next");

  // Stop Interval
  stop();

  // Empty Divs on Player2
  $("#player1-option").empty();
  $("#player2-option").empty();
  $("#result-display").empty();

  // Update "turn"
  dataRef.ref().update({
    turn: 1
  });
}

window.onload = function(event) {

  firebaseReset(); // Remove all data from firebase 

  $("#player1-name").html("Waiting for Player 1")
  $("#player2-name").html("Waiting for Player 2")

  // Start Button Click
  $("#add-user").on("click", function(event) {
    event.preventDefault();

    name = $("#name-input").val().trim();
    var wins = 0;
    var loses = 0;

    if (name === "" || name.match( /[^a-zA-Z0-9\s]/ )){
      alert("Input name(number or alphabet)");
    }
    else {
      // Add Player into Firebase and Display user name
      addPlayer();
      yourPlayerName = name;
    }

  }); // End of Start button cliked

  //*** Watching Players in firebase and Displaying Players in Div ***//
  dataRef.ref('/players').on("value", function(childSnapshot) {

    if (childSnapshot.child("/1").exists()) {
      console.log(childSnapshot.child("/1").val().name);
      console.log(childSnapshot.child("/1").val().wins);
      console.log(childSnapshot.child("/1").val().loses);

      $("#player1-name").empty();
      $("#player1-name").html(childSnapshot.child("/1").val().name);
      $("#player1-score").empty();
      $("#player1-score").html("Wins: " + childSnapshot.child("/1").val().wins +
        "  Loses: " + childSnapshot.child("/1").val().loses);
    }

    if (childSnapshot.child("/2").exists()) {
      console.log(childSnapshot.child("/2").val().name);
      console.log(childSnapshot.child("/2").val().wins);
      console.log(childSnapshot.child("/2").val().loses);

      $("#player2-name").empty();
      $("#player2-name").html(childSnapshot.child("/2").val().name);
      $("#player2-score").empty();
      $("#player2-score").html("Wins: " + childSnapshot.child("/2").val().wins +
        "  Loses: " + childSnapshot.child("/2").val().loses);
    }
  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });


  //*** Watching turn in firebase ***//
  //*** and Displaying choices of Rock, Paper and Scissors ***//
  dataRef.ref().on("value", function(snapshot) {

    if (snapshot.child("turn").exists()) {

      console.log(snapshot.val().turn);
      console.log(yourPlayerId);

      var currentTurn = snapshot.val().turn;

      // Displaying options only on your window
      if (currentTurn === yourPlayerId) {
        console.log("your turn");

        // Displaying "It's Your Turn!"
        $("#message2").html("It's Your Turn!");

        if (yourPlayerId === 1) {
          displayDiv = "#player1-option"
        }
        else {
          displayDiv = "#player2-option"
        }

        // Display Rock, Paper and Scissors
        // only when there is no div whose class is option
        var isOption = $(displayDiv + " .option").length;
        if (isOption === 0){

          // Empty Divs on Player1
          $("#player1-option").empty();
          $("#player2-option").empty();
          $("#result-display").empty();
          displayOption();
        }
      }
    }

  // Handle the errors
  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  }); // End of Watchgin turn and Displaying of choices


  // Displaying border on active div
  dataRef.ref().on("value", function(snapshot) {

    if (snapshot.child("turn").exists()) {

      var currentTurn = snapshot.val().turn;

      // Displaying border on active div
      if (currentTurn === 1) {
        $("#player1-display").css({
          'border-style': 'solid',
          'border-color': 'orange',
          'border-width': 'thick'
        });
        $("#player2-display").css({
          'border': 'none'
        });
      }
      else if (currentTurn === 2) {
        $("#player1-display").css({
          'border': 'none'
        });
        $("#player2-display").css({
          'border-style': 'solid',
          'border-color': 'orange',
          'border-width': 'thick'
        });
      }
      else {
        $("#player1-display").css({
          'border': 'none'
        });
        $("#player2-display").css({
          'border': 'none'
        });
      }
    }

  // Handle the errors
  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  }); // End of Watchgin turn and Displaying of choices


  //*** Selecting choice of Player 1 ***//
  $("#player1-option").on("click", ".option", function(event) {
    event.preventDefault();

    // Update "turn"
    dataRef.ref().update({
      turn: 2
    });
    
    // Update choice
    var choice = $(this).attr("value");
    dataRef.ref('/players/1').update({
      choice: choice
    });
    
    $("#player1-option").empty();
    $("#player1-option").append("<h1>" + $(this).attr("value") + "</h1>");

  });

  // Selecting choice of Player 2
  $("#player2-option").on("click", ".option", function(event) {
    event.preventDefault();

    // Update "turn"
    dataRef.ref().update({
      turn: 3
    });

    // Update choice
    var choice = $(this).attr("value");
    dataRef.ref('/players/2').update({
      choice: choice
    });
    
    $("#player2-option").empty();
    $("#player2-option").append("<h1>" + $(this).attr("value") + "</h1>");

    //*** Display result ***//
    dataRef.ref().once("value", function(snapshot) {

      var p1Name = snapshot.child('/players/1').val().name;
      var p1Choice = snapshot.child('/players/1').val().choice;
      var p1Wins = snapshot.child('/players/1').val().wins;
      var p1Loses = snapshot.child('/players/1').val().loses;
      var p2Name = snapshot.child('/players/2').val().name;
      var p2Choice = snapshot.child('/players/2').val().choice;
      var p2Wins = snapshot.child('/players/2').val().wins;
      var p2Loses = snapshot.child('/players/2').val().loses;
      //var result = "";

      console.log(p1Choice);
      console.log(p2Choice);

      if ((p1Choice === "Rock" && p2Choice === "Rock") || (p1Choice === "Paper" && p2Choice === "Paper") || (p1Choice === "Scissors" && p2Choice === "Scissors")) {
        //result = "<h1>Tie</h1><h1>Game!</h1>";
        console.log("Tie");
      }
      else if ((p1Choice === "Rock" && p2Choice === "Scissors") || (p1Choice === "Paper" && p2Choice === "Rock") || (p1Choice === "Scissors" && p2Choice === "Paper")) {
        // Player 1 wins
        //result = "<h1>" + p1Name + "</h1><h1>Wins!</h1>";
        wins = p1Wins + 1;
        loses = p2Loses + 1;
        dataRef.ref('/players/1').update({
          wins: wins
        });
        dataRef.ref('/players/2').update({
          loses: loses
        });
      }
      else if ((p1Choice === "Rock" && p2Choice === "Paper") || (p1Choice === "Paper" && p2Choice === "Scissors") || (p1Choice === "Scissors" && p2Choice === "Rock")) {
        // Player 2 wins
        //result = "<h1>" + p2Name + "</h1><h1>Wins!</h1>";
        wins = p2Wins + 1;
        loses = p1Loses + 1;
        dataRef.ref('/players/1').update({
          loses: loses
        });
        dataRef.ref('/players/2').update({
          wins: wins
        });
      }

      //$("#result-display").html(result);

    // Handle the errors
    }, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
    });

    nextGame(); // Go to next game
    console.log("going next");

  });

  //*** Watching turn and Displaying result ***/
  dataRef.ref().on("value", function(snapshot) {

    if (snapshot.child("turn").exists()) {

      if (snapshot.val().turn === 3) {

        var p1Name = snapshot.child('/players/1').val().name;
        var p1Choice = snapshot.child('/players/1').val().choice;
        var p2Name = snapshot.child('/players/2').val().name;
        var p2Choice = snapshot.child('/players/2').val().choice;
        var result = "";

        console.log(p1Choice);
        console.log(p2Choice);

        if ((p1Choice === "Rock" && p2Choice === "Rock") || (p1Choice === "Paper" && p2Choice === "Paper") || (p1Choice === "Scissors" && p2Choice === "Scissors")) {
          result = "<h1>Tie</h1><h1>Game!</h1>";

        }
        else if ((p1Choice === "Rock" && p2Choice === "Scissors") || (p1Choice === "Paper" && p2Choice === "Rock") || (p1Choice === "Scissors" && p2Choice === "Paper")) {
          // Player 1 wins
          result = "<h1>" + p1Name + "</h1><h1>Wins!</h1>";

        }
        else if ((p1Choice === "Rock" && p2Choice === "Paper") || (p1Choice === "Paper" && p2Choice === "Scissors") || (p1Choice === "Scissors" && p2Choice === "Rock")) {
          // Player 2 wins
          result = "<h1>" + p2Name + "</h1><h1>Wins!</h1>";

        }

        $("#player1-option").html("<h1>" + p1Choice + "</h1>");
        $("#player2-option").html("<h1>" + p2Choice + "</h1>");
        $("#result-display").html(result);
        //nextGame(); // Go to next game

      }
    }

  // Handle the errors
  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });

  // Adding comment
  $("#add-comment").on("click", function(event) {
    event.preventDefault();

    var name = yourPlayerName;
    var comment = $("#comment-input").val().trim();

    if (yourPlayerName !== "") {

      if (comment !== "") {
        dataRef.ref('/chat').push({
          name: name,
          comment: comment,
          dateAdded: firebase.database.ServerValue.TIMESTAMP
        });

        this.form.reset(); // Clear input value

      }
      else {
        alert("Input something");
      }
    }
    else {
      alert("Before comment, please login");
    }

  });

  // Watching comment
  dataRef.ref('/chat').on("child_added", function(childSnapshot) {

    // Log everything that's coming out of snapshot
    console.log(childSnapshot.val().name);
    console.log(childSnapshot.val().comment);

    // full list of items to the well
    $("#comment-display").append("<div>" + childSnapshot.val().name +
      " : " + childSnapshot.val().comment + "</div>");

  // Handle the errors
  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });

} // End of window.onload


