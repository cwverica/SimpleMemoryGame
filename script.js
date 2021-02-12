const gameContainer = document.getElementById("game");
let firstClick = true;
let firstChoice = {};
let secondChoice = {};
let gameOn = false;
let gameOver = false;
let gameSize = 0;
let scoreCounter = 0;
let gameScore = Math.POSITIVE_INFINITY;

const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "teal",
  "magenta",
  "olive"
];

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");
    newDiv.style.backgroundColor = "white";

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}


// TODO: Implement this function!
function handleCardClick(event) {
  scoreCounter++;
  document.querySelector("#score").innerHTML = scoreCounter;
  if (!firstClick){
    secondChoice = event.target;
    secondChoice.style.backgroundColor = secondChoice.className;
    firstChoice.addEventListener("click", handleCardClick);
    disableAll();
    if(firstChoice.className == secondChoice.className){
      firstChoice.className = "matched";
      secondChoice.className = "matched";
    }
    setTimeout(resetChoices, 1500)
  }

  if (firstClick){
    firstChoice = event.target;
    firstChoice.style.backgroundColor = firstChoice.className;
    firstChoice.removeEventListener("click", handleCardClick);
    firstClick = false;
  }

}

// removes all event listeners. used to prevent from selecting more than two at once.
function disableAll(){
  let choices = document.querySelectorAll("div#game div");
    for(let choice of choices){
      choice.removeEventListener("click", handleCardClick);
    }
  

}

// checks for matches, resets eventlisteners on unmatched, 
// checks for end of game to compare score with highscore
function resetChoices(){
  gameOver = true;
  let choices = document.querySelectorAll("div#game div");
  for(let choice of choices){
    if(choice.className != "matched"){
      gameOver = false;
      choice.style.backgroundColor = "white";
      choice.addEventListener("click", handleCardClick);
    }
  }
  if(gameOver === true){
    gameScore = scoreCounter;
    if(!localStorage.getItem(gameSize)){
      localStorage.setItem(gameSize, gameScore);
    } else if(localStorage.getItem(gameSize) > gameScore){
      localStorage.setItem(gameSize, gameScore);
    }
    gameScore = Math.POSITIVE_INFINITY;
  }
  firstChoice = {};
  secondChoice = {};
  firstClick = true;
}

// when the DOM loads
document.querySelector("#controls").addEventListener("click", function(e){
  if(e.target.id === "start"){
    if(gameOn === false){
      gameSize = document.querySelector("#size").value;
      if(localStorage.getItem(gameSize)){
      document.querySelector("#highScore").innerHTML = localStorage.getItem(gameSize);
      }
      let shuffledColors = shuffle(COLORS);
      let thisGame = shuffledColors.slice(0, gameSize);
      thisGame = thisGame.concat(thisGame);
      createDivsForColors(shuffle(thisGame));
      gameOn = true;
    }
  }
  if(e.target.id === "reset"){
    document.querySelector("#score").innerHTML = "";
    document.querySelector("#highScore").innerHTML = "";
    gameContainer.innerHTML = "";
    gameOn = false;
    gameScore = Math.POSITIVE_INFINITY;
    scoreCounter = 0;
  }
})

