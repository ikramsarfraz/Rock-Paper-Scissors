localStorage.clear();

// Holds currentPlays
let currentPlays = {
  elementIDOfOpponentPlay: null,
  elementIDOfPlayerPlay: null
};

//Holds wins/draws/losses
let results = {
  wins: 0,
  draws: 0,
  losses: 0
};

//gets the width of the body
function getWidth() {
  return Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
  );
}

// function that handles initial landing page transitions
function landingPageTransitions(element) {
  const widthPage = getWidth();

  document.getElementById("landingPageContainer").style.transform =
    "translateX(" + -1 * widthPage + "px)";

  setTimeout(function() {
    document.getElementById("landingPageContainer").style.visibility = "hidden";
  }, 800);
}

// method that calcluates the result of the game based on the played elements
function calculateResult(playerPlayElement, opponentPlayElement) {
  if (
    (playerPlayElement.id === "playerRock" &&
      opponentPlayElement.id === "opponentRock") ||
    (playerPlayElement.id === "playerPaper" &&
      opponentPlayElement.id === "opponentPaper") ||
    (playerPlayElement.id === "playerScissors" &&
      opponentPlayElement.id === "opponentScissors")
  ) {
    results["draws"] += 1;
    document.getElementById("resultMessage").innerHTML = "It's a DRAW!";
  } else if (
    (playerPlayElement.id === "playerRock" &&
      opponentPlayElement.id === "opponentScissors") ||
    (playerPlayElement.id === "playerPaper" &&
      opponentPlayElement.id === "opponentRock") ||
    (playerPlayElement.id === "playerScissors" &&
      opponentPlayElement.id === "opponentPaper")
  ) {
    results["wins"] += 1;
    document.getElementById("resultMessage").innerHTML = "Player1 WINS!";
    document.getElementById("playerScoreContainer").innerHTML =
      "" + results["wins"] + "";
  } else {
    results["losses"] += 1;
    document.getElementById("resultMessage").innerHTML = "Opponent WINS!";
    document.getElementById("opponentScoreContainer").innerHTML =
      "" + results["losses"] + "";
  }
  localStorage.setItem("results", JSON.stringify(results));
}

// Function that randomly selects a play for the opponent
// It returns the element that was chosen
function opponentPlays() {
  let playsArray = [
    {
      playName: "rock",
      elementID: "opponentRock"
    },
    {
      playName: "paper",
      elementID: "opponentPaper"
    },
    {
      playName: "scissors",
      elementID: "opponentScissors"
    }
  ];
  let rand = Math.floor(Math.random() * 3) + 0;
  // Stores ID of currently Played element of OPPONENT in local storage
  currentPlays["elementIDOfOpponentPlay"] = playsArray[rand]["elementID"];
  localStorage.setItem("currentPlays", JSON.stringify(currentPlays));

  return document.getElementById(playsArray[rand]["elementID"]);
}

// function that works with displaying only the played elements and hiding all the others
function showSelectedPlays(playerPlayedElement, opponentPlayedElement) {
  //gets position of the middle elements of both containers
  let paperPlayerElement = playerPlayedElement.parentElement.childNodes[3].getBoundingClientRect();
  let paperOpponentElement = opponentPlayedElement.parentElement.childNodes[3].getBoundingClientRect();

  // Get the sibling elements of the clicked play
  let playerPlayElementSiblings = playerPlayedElement.parentElement.childNodes;
  let opponentPlayElementSiblings =
    opponentPlayedElement.parentElement.childNodes;

  // hide all other elements and move the clicked element to the middle
  for (let index = 1; index <= 5; index += 2) {
    //Handles the player container elements
    if (playerPlayElementSiblings[index].id != playerPlayedElement.id) {
      playerPlayElementSiblings[index].classList.remove("showPlayContainer");
      playerPlayElementSiblings[index].classList.add("hidePlayContainer");
    } else {
      let currentPlayerElement = playerPlayedElement.parentElement.childNodes[
        index
      ].getBoundingClientRect();

      playerPlayElementSiblings[index].style.transform =
        "translateY(" +
        (paperPlayerElement.top - currentPlayerElement.top) +
        "px)";
    }

    //Handles the opponent container elements
    if (opponentPlayElementSiblings[index].id != opponentPlayedElement.id) {
      opponentPlayElementSiblings[index].classList.remove("showPlayContainer");
      opponentPlayElementSiblings[index].classList.add("hidePlayContainer");
    } else {
      let currentOpponentElement = opponentPlayedElement.parentElement.childNodes[
        index
      ].getBoundingClientRect();

      opponentPlayElementSiblings[index].style.transform =
        "translateY(" +
        (paperOpponentElement.top - currentOpponentElement.top) +
        "px)";
    }
  }
}

// function that stores the current played elements from both players
// adds the currenPlay class to them
// displays the result and the play again button
function playerPlays(currentElement, currentElementID) {
  //disable player Container
  document.getElementById("playerContainer").disabled = true;

  //Remove any previous plays/selections
  let prevPlays = JSON.parse(localStorage.getItem("currentPlays"));
  if (prevPlays) {
    document
      .getElementById(prevPlays["elementIDOfOpponentPlay"])
      .classList.remove("currentPlay");
    document
      .getElementById(prevPlays["elementIDOfPlayerPlay"])
      .classList.remove("currentPlay");
  }

  // Stores current Play of player in local storage
  currentPlays["elementIDOfPlayerPlay"] = currentElementID;
  localStorage.setItem("currentPlays", currentPlays);

  //adds the currentPlay class to both the opponent's played element and to the player's played element
  currentElement.classList.add("currentPlay");
  let opponentPlayElement = opponentPlays();
  opponentPlayElement.classList.add("currentPlay");

  //deals with hiding non-played and showing by moving to the middle the played elements
  showSelectedPlays(currentElement, opponentPlayElement);

  //calculates the result
  calculateResult(currentElement, opponentPlayElement);

  // the message container and the play again button container appears after player plays
  document.getElementById("messageContainer").classList.add("showResults");
  document.getElementById("messageContainer").style.opacity = 1;
  document.getElementById("btnContainer").classList.add("showResults");
  document.getElementById("btnContainer").style.opacity = 1;
  document.getElementById("btnContainer").style.zIndex = 1;
}

// function Resets Game to start another round
function resetGame() {
  // Get the sibling elements of the clicked play
  let playerPlayElementSiblings = document.getElementById("playerContainer")
    .childNodes;
  let opponentPlayElementSiblings = document.getElementById("opponentContainer")
    .childNodes;

  //show all elements and move them back to their original position
  for (let index = 1; index <= 5; index += 2) {
    playerPlayElementSiblings[index].classList.remove("hidePlayContainer");
    playerPlayElementSiblings[index].classList.add("showPlayContainer");
    playerPlayElementSiblings[index].style.transform = "translateY(0)";

    opponentPlayElementSiblings[index].classList.remove("hidePlayContainer");
    opponentPlayElementSiblings[index].classList.add("showPlayContainer");
    opponentPlayElementSiblings[index].style.transform = "translateY(0)";
  }

  // Re-enable the players container
  document.getElementById(
    currentPlays["elementIDOfPlayerPlay"]
  ).parentElement.disabled = false;

  // remove the currentPlay class from both the player and the opponent
  document
    .getElementById(currentPlays["elementIDOfPlayerPlay"])
    .classList.remove("currentPlay");
  document
    .getElementById(currentPlays["elementIDOfOpponentPlay"])
    .classList.remove("currentPlay");

  //Hide the message of the result and the play again button
  document.getElementById("messageContainer").classList.remove("showResults");
  document.getElementById("btnContainer").classList.remove("showResults");
  document.getElementById("messageContainer").style.opacity = 0;
  document.getElementById("btnContainer").style.opacity = 0;
  document.getElementById("btnContainer").style.zIndex = -1;
}

function returnHome() {
  const widthPage = getWidth();
  document.getElementById("landingPageContainer").style.visibility = "visible";

  document.getElementById("landingPageContainer").style.transform =
    "translateX(" + 0 + "px)";

  document.getElementById("playerScoreContainer").innerHTML = "0";
  document.getElementById("opponentScoreContainer").innerHTML = "0";
}

//Play button on the lanfing page is clicked
document.getElementById("playBtn").onclick = function() {
  landingPageTransitions(this);
};

//player's Rock element is clicked
document.getElementById("playerRock").onclick = function() {
  if (!this.parentElement.disabled) {
    playerPlays(this, "playerRock");
  }
};

//player's Paper element is clicked
document.getElementById("playerPaper").onclick = function() {
  if (!this.parentElement.disabled) {
    playerPlays(this, "playerPaper");
  }
};

//player's Scissors element is clicked
document.getElementById("playerScissors").onclick = function() {
  if (!this.parentElement.disabled) {
    playerPlays(this, "playerScissors");
  }
};

//Again button is clicked
document.getElementById("resetBtn").onclick = function() {
  resetGame();
};

//Again button is clicked
document.getElementById("closeBtn").onclick = function() {
  if (document.getElementById("btnContainer").style.opacity != 0) {
    resetGame();
  }
  returnHome();
  localStorage.clear();
};
