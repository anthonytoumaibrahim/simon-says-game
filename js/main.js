const colors = ["blue", "green", "red", "yellow"];
const audioFiles = {
  blue: "./sounds/blue.mp3",
  green: "./sounds/green.mp3",
  red: "./sounds/red.mp3",
  yellow: "./sounds/yellow.mp3",
  wrong: "./sounds/wrong.mp3",
  "game-over": "./sounds/game-over.wav",
  "game-win": "./sounds/game-win.wav",
};
const maxLevel = 12;

const info = document.getElementById("info");
const playButton = document.getElementById("play");
const highScoreContainer = document.getElementById("high-score");
const levelContainer = document.getElementById("level");
const board = document.querySelector(".board");

let highScore = localStorage.getItem("sm-says-high-score") ?? 0;
let level = 0;
let simonSequence = [];
let mySequence = [];

highScoreContainer.innerText = highScore;

playButton.addEventListener("click", () => {
  playButton.classList.add("hidden");
  startNextRound();
});

// Detect tile click
document
  .querySelectorAll("div[data-tile]")
  .forEach((el) =>
    el.addEventListener("click", () => onClickTile(el.dataset.tile))
  );

function startNextRound() {
  level += 1;
  levelContainer.innerText = level;
  info.innerHTML = "Wait...";
  board.classList.add("unclickable");

  simonSequence.push(colors[Math.floor(Math.random() * colors.length)]);

  for (let i = 0; i < simonSequence.length; i++) {
    setTimeout(() => {
      highlightTile(simonSequence[i]);
    }, (i + 1) * 1000);
  }

  setTimeout(() => {
    board.classList.remove("unclickable");
    info.innerText = "Your turn";
  }, level * 1000 + 1000);
}

function startNewGame() {
  level = 0;
  simonSequence = [];
  mySequence = [];
  levelContainer.innerText = level;
  board.classList.add("unclickable");
  playButton.classList.remove("hidden");
  info.innerHTML = `Click <b>play</b> to start! Make it to ${maxLevel} to win!`;
}

function highlightTile(color = "") {
  playSound(color);
  const tile = document.querySelector(`div[data-tile="${color}"]`);
  tile.classList.toggle("inactive", false);
  setTimeout(() => tile.classList.toggle("inactive", true), 500);
}

function onClickTile(tile) {
  highlightTile(tile);
  const index = mySequence.push(tile) - 1;

  if (mySequence[index] !== simonSequence[index]) {
    playSound("wrong");
    setTimeout(() => {
      playSound("game-over");
      alert("Sorry, you lost!");
      startNewGame();
    }, 200);
    return;
  }

  if (mySequence.length === simonSequence.length) {
    // Save high score
    if (mySequence.length > parseInt(highScore)) {
      highScore = mySequence.length;
      localStorage.setItem("sm-says-high-score", highScore);
      highScoreContainer.innerText = highScore;
    }
    if (mySequence.length === maxLevel) {
      playSound("game-win");
      alert("You won!");
      startNewGame();
      return;
    }

    mySequence = [];
    info.innerHTML = "That's right!";
    setTimeout(() => {
      startNextRound();
    }, 1000);
  }
}

function playSound(name) {
  // https://stackoverflow.com/a/18628124
  new Audio(audioFiles[name]).play();
}
