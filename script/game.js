let myCar;
let myCarImage = "./images/myCar.png";
let myCarLeftImage = "./images/myCarLeft.png";
let myCarRightImage = "./images/myCarRight.png";
let myBackground;
let raceTrackImage = "./images/raceTrack.jpg";
let myObstacles = [];
let opponentCarToggle = 0;
let pausePlayToggle = 0;
let muteUnmuteToggle = 0;
let songSpeed = 1;
let gameSpeed = 30;
let gameLevelUpSpeed = 5;
let myCarTurningSpeed = 5;
let opponnentCarPush = 150;
let score = 0;
let touchStartX;
let touchEndX;
let touchStartY;

document
  .getElementById("gameScreen")
  .addEventListener("touchstart", function(e) {
    touchStartX = e.touches[0].clientX;
  });

document
  .getElementById("gameScreen")
  .addEventListener("touchmove", function(e) {
    touchEndX = e.touches[0].clientX;
    if (touchStartX > touchEndX) myCar.slideLeft();
    else myCar.slideRight();
  });

document.getElementById("gameScreen").addEventListener("touchend", function(e) {
  myCar.width = 51;
  myCar.image.src = myCarImage;
});

//get saved highest score from locastorage if there is no localstorage data available assign 0
document.getElementById("highestScore").innerHTML =
  localStorage.getItem("highestScore") || 0;

//level up where game speed will be decreased (frame update rate interval delay) and car sliding speed will increase
function levelUp(gameLevelUpSpeed) {
  gameSpeed = gameSpeed - gameLevelUpSpeed; //frame update function call interval is decreasing
  myCarTurningSpeed = myCarTurningSpeed + 1.5; //car sliding speed increasing
  clearInterval(interval); //clearing interval coz not clearing the interval is not working
  interval = setInterval(updateGameArea, gameSpeed); //setting again
  song.rate((songSpeed = songSpeed + 0.05));
}

function muteUnmuteSound() {
  if (muteUnmuteToggle == 0) {
    masterVolume(0.0); //master voume will be 0
    document.getElementById("muteIcon").className = "fa fa-volume-down";
    document.getElementById("muteText").innerHTML = "Unmute";
    muteUnmuteToggle = 1;
  } else {
    masterVolume(0.6);

    document.getElementById("muteIcon").className = "fa fa-volume-up";
    document.getElementById("muteText").innerHTML = "Mute";
    muteUnmuteToggle = 0;
  }
}

function restartGame() {
  document.location.reload(); //restart button will refresh the page
}

function pausePlay() {
  if (pausePlayToggle == 0) {
    document.getElementById("playPauseIcon").className = "fa fa-play";
    document.getElementById("playPauseText").innerHTML = "Play";
    clearInterval(interval);
    if (muteUnmuteToggle != 1) muteUnmuteSound();
    pausePlayToggle = 1;
  } else {
    document.getElementById("playPauseIcon").className = "fa fa-pause";
    document.getElementById("playPauseText").innerHTML = "Pause";
    interval = setInterval(updateGameArea, gameSpeed);
    if (muteUnmuteToggle != 1) muteUnmuteSound();
    pausePlayToggle = 0;
  }
}

//first this will execute this will start the game and it will call all the function needed to start the game
function startGame() {
  if (window.innerWidth < 600) myCarTurningSpeed = 5; //if touch screen then setting less turning speed
  document.getElementById("cover").style.display = "none"; //cover page will be hidden
  backgroundEffect.play(); //background effect sound car sound will be played in loop
  backgroundEffect.loop(); //background effect sound car sound will be played in loop
  //check if the song is playing or not if playing then stop it and play again
  if (song.isPlaying()) {
    song.stop();
    song.play();
  }
  backgroundEffect.setVolume(0.1); //background effect volume will be less
  song.setVolume(0.5); //song volume will be highest but not full
  tyre.setVolume(0.6); //tyre volume should be audible
  //creating my car
  myCar = new component(51, 120, myCarImage, 10, 350, "image"); // my car image with initial position and size
  //creating the background which is race track
  myBackground = new component(350, 967, raceTrackImage, 0, 0, "background"); // Background component
  //myGameArea component start() function called
  myGameArea.start();
}

let myGameArea = {
  canvas: document.getElementById(
    "gameScreen"
  ) /* getting already created canvas*/,
  start: function() /*second this will execute*/ {
    this.context = this.canvas.getContext("2d");
    this.frameNo = 0;
    interval = setInterval(updateGameArea, gameSpeed);
  },
  clear: function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
};

function component(width, height, imageSource, x, y, type) {
  this.type = type;
  this.image = new Image();
  this.image.src = imageSource;
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.x = x;
  this.y = y;
  this.update = function() {
    ctx = myGameArea.context;
    if (type == "image" || type == "background") {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
      if (type == "background") {
        ctx.drawImage(
          this.image,
          this.x,
          this.y - this.height,
          this.width,
          this.height
        );
      }
    } else {
      ctx.fillStyle = imageSource;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  };
  this.newPos = function() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.type == "background") {
      if (this.y >= this.height) {
        this.y = 0;
      }
    }
  };

  this.slideRight = function() {
    if (this.x < 290) {
      myCar.width = 53;
      myCar.image.src = myCarRightImage;
      this.x += myCarTurningSpeed;
    }
  };

  this.slideLeft = function() {
    if (this.x > 10) {
      myCar.width = 55;
      myCar.image.src = myCarLeftImage;
      this.x -= myCarTurningSpeed;
    }
  };

  this.goUp = function() {
    if (this.y > 10) {
      this.y -= myCarTurningSpeed;
    }
  };

  this.goDown = function() {
    if (this.y < 350) {
      this.y += myCarTurningSpeed;
    }
  };

  this.crashWith = function(otherobj) {
    let myleft = this.x;
    let myright = this.x + this.width;
    let mytop = this.y;
    let mybottom = this.y + this.height;
    let otherleft = otherobj.x;
    let otherright = otherobj.x + otherobj.width;
    let othertop = otherobj.y;
    let otherbottom = otherobj.y + otherobj.height;
    let crash = true;
    if (
      mybottom < othertop + 10 ||
      mytop > otherbottom - 5 ||
      myright < otherleft + 10 ||
      myleft > otherright - 5
    ) {
      crash = false;
    }
    return crash;
  };
}

function updateGameArea() /* third this will execute*/ {
  let x, height, minWidth, maxWidth, minGap, maxGap, oppCar1XPos, oppCar2XPos;
  for (i = 0; i < myObstacles.length; i += 1) {
    if (myCar.crashWith(myObstacles[i])) {
      backgroundEffect.stop();
      song.stop();
      crash.play();
      document.getElementById("playPause").disabled = true;
      clearInterval(interval);
      if (Number(localStorage.getItem("highestScore")) < score)
        localStorage.setItem("highestScore", score);
      document.getElementById("finalScore").innerHTML = score;
      document.getElementById("gameOver").style.display = "block";
      return;
    }
  }
  myGameArea.clear();
  myGameArea.frameNo += 1;
  myBackground.speedY = +4;
  myBackground.newPos();
  myBackground.update();
  if (myGameArea.frameNo == 1 || everyinterval(opponnentCarPush)) {
    document.getElementById("score").innerHTML = ++score;
    if (score % gameLevelUpSpeed == 0) {
      levelUp(gameLevelUpSpeed);
    }
    x = myGameArea.canvas.height;
    minWidth = 4;
    maxWidth = 264;
    height = Math.floor(Math.random() * (maxWidth - minWidth + 1) + minWidth);
    minGap = 5;
    maxGap = 295;
    oppCar1XPos = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
    oppCar2XPos = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
    if (Math.abs(oppCar1XPos - oppCar2XPos) < 55) {
      if (oppCar1XPos - 105 > 5) oppCar1XPos = oppCar1XPos - 105;
      else oppCar2XPos = oppCar2XPos + 105;
    }
    if (opponentCarToggle == 0) {
      myObstacles.push(
        new component(
          51,
          137,
          "images/oppCar1.png",
          oppCar1XPos,
          -140 - oppCar1XPos,
          "image"
        )
      );
      myObstacles.push(
        new component(
          51,
          137,
          "images/oppCar2.png",
          oppCar2XPos,
          -140 - oppCar2XPos,
          "image"
        )
      );
      opponentCarToggle = 1;
    } else {
      myObstacles.push(
        new component(
          51,
          137,
          "images/oppCar3.png",
          oppCar1XPos,
          -140 - oppCar1XPos,
          "image"
        )
      );
      myObstacles.push(
        new component(
          51,
          137,
          "images/oppCar4.png",
          oppCar2XPos,
          -140 - oppCar2XPos,
          "image"
        )
      );
      opponentCarToggle = 0;
    }
  }
  for (i = 0; i < myObstacles.length; i += 1) {
    myObstacles[i].y += 3;
    myObstacles[i].update();
  }
  myCar.newPos();
  myCar.update();
}

function everyinterval(n) {
  if ((myGameArea.frameNo / n) % 1 == 0) {
    return true;
  }
  return false;
}

window.addEventListener("keydown", function(event) {
  if (event.keyCode == 38) myCar.goUp();
  if (event.keyCode == 40) myCar.goDown();
  if (event.keyCode == 37) {
    myCar.slideLeft();
    myCar.image.src = myCarLeftImage;
    myCar.width = 55;
    if (!tyre.isPlaying()) tyre.play();
  }
  if (event.keyCode == 39) {
    myCar.slideRight();
    myCar.image.src = myCarRightImage;
    myCar.width = 53;
    if (!tyre.isPlaying()) tyre.play();
  }
});

window.addEventListener("keyup", function(event) {
  if (
    event.keyCode == 37 ||
    event.keyCode == 38 ||
    event.keyCode == 39 ||
    event.keyCode == 40
  ) {
    myCar.width = 51;
    myCar.image.src = myCarImage;
    tyre.stop();
  }
});
