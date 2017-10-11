
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


// Clear all data in firebase
var firebaseReset = function () {

  dataRef.ref().set({});

}

// Add player into firebase
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

      displayYourId(); // You are Player ....
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

      // Update "turn"
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


// Displaying which you are player 1 or 2
var displayYourId = function() {
  $("#start").empty(); // Remove Start button
  $("#message1").html("<h2>Hi " + name + "! You are Player " + yourPlayerId + "</h2>");
}


// Displaying Rock, Paper and Scissors
var displayOption = function() {
  // Display Options
  // This function requires the target div as displayDiv

  // Empty Divs for the second time on
  $("#player1-option").empty();
  $("#player2-option").empty();
  $("#result-display").empty();

  /*
  var newDiv = document.createElement("div");
  $(displayDiv).append(newDiv);
  $(newDiv).attr("class", "choice");
  $(newDiv).attr("id", "rock");
  $(newDiv).attr("value", "Rock");
  $(newDiv).html("Rock");
  */
  var newDiv = $("<div>")
  newDiv.addClass("choice");
  newDiv.attr("id", "Rock");
  newDiv.attr("value", "Rock");
  newDiv.html("Rock");
  $(displayDiv).append(newDiv);

  var newDiv = $("<div>")
  newDiv.addClass("choice");
  newDiv.attr("id", "Paper");
  newDiv.attr("value", "Paper");
  newDiv.html("Paper");
  $(displayDiv).append(newDiv);

  var newDiv = $("<div>")
  newDiv.addClass("choice");
  newDiv.attr("id", "Scissors");
  newDiv.attr("value", "Scissors");
  newDiv.html("Scissors");
  $(displayDiv).append(newDiv);

}

// In 3 seconds since the result is displayed, go to next game.
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


  //**** Start Button Click ***//
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
      displayYourId(); // You are Player ....
      yourPlayerName = name;
    }

  }); // End of Start button cliked
  
  dataRef.ref().on("child_removed", function(snapshot) {
    console.log("child removed")
    alert("Your player was removed by another window.\n Re-enter your name.");
    location.reload(); // Reload window
  });

  // Listening to firebase and Displaying players, option and border on active div
  dataRef.ref().on("value", function(snapshot) {

    if (snapshot.child("/players/1").exists()) {
      console.log(snapshot.child("/players/1").val().name);
      console.log(snapshot.child("/players/1").val().wins);
      console.log(snapshot.child("/players/1").val().loses);

      $("#player1-name").empty();
      $("#player1-name").html(snapshot.child("/players/1").val().name);
      $("#player1-score").empty();
      $("#player1-score").html("Wins: " + snapshot.child("/players/1").val().wins +
        "  Loses: " + snapshot.child("/players/1").val().loses);
    }

    if (snapshot.child("/players/2").exists()) {
      console.log(snapshot.child("/players/2").val().name);
      console.log(snapshot.child("/players/2").val().wins);
      console.log(snapshot.child("/players/2").val().loses);

      $("#player2-name").empty();
      $("#player2-name").html(snapshot.child("/players/2").val().name);
      $("#player2-score").empty();
      $("#player2-score").html("Wins: " + snapshot.child("/players/2").val().wins +
        "  Loses: " + snapshot.child("/players/2").val().loses);
    }

    if (snapshot.child("turn").exists()) {

      var currentTurn = snapshot.val().turn;

      if (currentTurn === 1) {

        // Display border
        $("#player1-display").css({
          'border-style': 'solid',
          'border-color': 'orange',
          'border-width': 'thick'
        });
        $("#player2-display").css({
          'border': 'none'
        });

        if (yourPlayerId === 1) {
          // When your turn
          console.log("your turn");

          // Display choices and message "It's Your Turn"
          displayDiv = "#player1-option";
          displayOption();

          // Displaying "It's Your Turn!"
          $("#message2").html("It's Your Turn!");

        }
        
        if (yourPlayerId === 2) {
          console.log("player2")
          $("#message2").html("Waiting for " + snapshot.child("/players/1").val().name + " to choose.");
        }

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

        // Display choices only on your window
        if (yourPlayerId === 2) {

          console.log("your turn");

          // Display choices
          displayDiv = "#player2-option";
          displayOption();

          // Displaying "It's Your Turn!"
          $("#message2").html("It's Your Turn!");

        }
        
        if (yourPlayerId === 1) {
          // When not your turn (enemy's turn), display "Waiting for ..."
          $("#message2").html("Waiting for " + snapshot.child("/players/2").val().name + " to choose.");
        }

      }
      else if (currentTurn === 3) { 
        $("#player1-display").css({
          'border': 'none'
        });
        $("#player2-display").css({
          'border': 'none'
        });

        // Display result
        var p1Name = snapshot.child('/players/1').val().name;
        var p1Choice = snapshot.child('/players/1').val().choice;
        var p2Name = snapshot.child('/players/2').val().name;
        var p2Choice = snapshot.child('/players/2').val().choice;
        var result = "";

        console.log(p1Choice);
        console.log(p2Choice);

        if ((p1Choice === "Rock" && p2Choice === "Rock") || (p1Choice === "Paper" && p2Choice === "Paper") || (p1Choice === "Scissors" && p2Choice === "Scissors")) {
          // Tie game
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
      }
    }

  // Handle the errors
  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  }); // End of Watchgin turn and Displaying of choices


  //*** Selecting choice of Player 1 ***//
  $("#player1-option").on("click", ".choice", function(event) {
    event.preventDefault();

    console.log("option selected");

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
  $("#player2-option").on("click", ".choice", function(event) {
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

    //*** Update wins and loses (Read only Once) ***//
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

  }); // End of Selecting choice of Player 2


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


  // Watching and Displaying comment
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


