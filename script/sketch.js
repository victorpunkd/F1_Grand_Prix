let backgroundEffect, song, tyre;
let preloadDone = 0,
  checkPreLoad;

//preload() will call automatically when p5.js loads its a predefined function of p5.js to load all the sounds
function preload() {
  backgroundEffect = loadSound(
    "https://victorsfiles.s3.ap-south-1.amazonaws.com/formula1_2.wav"
  );

  song = loadSound(
    "https://victorsfiles.s3.ap-south-1.amazonaws.com/victor.wav"
  );

  tyre = loadSound("https://victorsfiles.s3.ap-south-1.amazonaws.com/tyre.mp3");

  crash = loadSound(
    "https://victorsfiles.s3.ap-south-1.amazonaws.com/crash.wav"
  );
}

//setup() will call next once the preload is done loading all the files, its also a predefined function of p5.js
function setup() {
  preloadDone = 1;
  song.play();
  song.loop();
  song.setVolume(0.2);
}

//once the user clicks on the start the race button in the first page this function will execute
function startGameClicked() {
  //to check that preload is done and setup is called
  if (preloadDone == 1) {
    //once preload is done loading the files and the setup function is called then clear the interval and start the game
    clearInterval(checkPreLoad);
    //here it loads the canvas and starts the game
    startGame();
    //once the game is started i am pausing the game to show the game play instructions
    pausePlay();
    document.getElementById("instructions").style.display = "block";
  }
  //until the preload is done loading the files and setup is not called the function will call itself in every half a second to check that the flag is 1 or not (preload ans setup is done or not)
  else {
    document.getElementById("startGameIcon").className =
      "fa fa-spinner fa-spin";
    document.getElementById("startGameButtonText").innerHTML = "Loading";
    checkPreLoad = setInterval(() => {
      startGameClicked();
    }, 5000);
  }
}
