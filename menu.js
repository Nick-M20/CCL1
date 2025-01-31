// Grab references
const startScreen    = document.getElementById("startScreen");
const gameScreen     = document.getElementById("gameScreen");
const optionsScreen  = document.getElementById("optionsScreen");
const finishScreen   = document.getElementById("finishScreen");  

// Buttons
const btnStartGame   = document.getElementById("btnStartGame");
const btnOptions     = document.getElementById("btnOptions");
const btnBack        = document.getElementById("btnBack");
const btnFinishBack  = document.getElementById("btnFinishBack"); 
const btnTryAgain    = document.getElementById("btnTryAgain");   


// START GAME => hide start screen, show game screen
btnStartGame.addEventListener("click", () => {
  // Call resetPuzzle() so we start fresh
  if (typeof resetPuzzle === 'function') {
    resetPuzzle();
  }

  startScreen.style.display   = "none";
  gameScreen.style.display    = "flex";
  optionsScreen.style.display = "none";
  if (finishScreen) finishScreen.style.display = "none";
});

// OPTIONS => hide start screen, show options screen
btnOptions.addEventListener("click", () => {
  startScreen.style.display   = "none";
  gameScreen.style.display    = "none";
  optionsScreen.style.display = "flex";
  if (finishScreen) finishScreen.style.display = "none";
});

// BACK (from Options) => go back to the start screen
btnBack.addEventListener("click", () => {
  startScreen.style.display   = "flex";
  gameScreen.style.display    = "none";
  optionsScreen.style.display = "none";
  if (finishScreen) finishScreen.style.display  = "none";

  // Keep  repeated lines, but rename to avoid scope errors
  const startScreenRef   = document.getElementById("startScreen");
  const gameScreenRef    = document.getElementById("gameScreen");
  const optionsScreenRef = document.getElementById("optionsScreen");
  
  const btnStartGameRef  = document.getElementById("btnStartGame");
  const btnOptionsRef    = document.getElementById("btnOptions");
  const btnBackRef       = document.getElementById("btnBack");
  
  
  
  // Start Game => hide startScreen, show gameScreen
  btnStartGameRef.addEventListener("click", () => {
  
    if (typeof resetPuzzle === 'function') {
      resetPuzzle();
    }
    startScreenRef.style.display   = "none";
    gameScreenRef.style.display    = "flex";
    optionsScreenRef.style.display = "none";
  });
  
  // Options => hide startScreen, show optionsScreen
  btnOptionsRef.addEventListener("click", () => {
    startScreenRef.style.display   = "none";
    gameScreenRef.style.display    = "none";
    optionsScreenRef.style.display = "flex";
  });
  
  // Back => from Options to the Start Screen
  btnBackRef.addEventListener("click", () => {
    startScreenRef.style.display   = "flex";
    gameScreenRef.style.display    = "none";
    optionsScreenRef.style.display = "none";
  });
  
  gameScreenRef.style.display    = "none";
  optionsScreenRef.style.display = "none";
  if (finishScreen) finishScreen.style.display  = "none";
});

// TRY AGAIN => Hide finish screen, reset puzzle, show main screen
if (btnTryAgain) {
  btnTryAgain.addEventListener("click", () => {
    if (finishScreen) finishScreen.style.display = "none";
    gameScreen.style.display    = "none";
    optionsScreen.style.display = "none";
    
    // Reset puzzle so user can do it again
    if (typeof resetPuzzle === 'function') {
      resetPuzzle();
    }
    // Show the main start screen
    startScreen.style.display   = "flex";
  });
}



// Grab the next-level button
const btnNextLevel = document.getElementById("btnNextLevel");

// If it exists, attach an event
if (btnNextLevel) {
  btnNextLevel.addEventListener("click", () => {
    // Hide the finish screen
    document.getElementById("finishScreen").style.display = "none";
    // Show the game screen
    document.getElementById("gameScreen").style.display    = "flex";
    // Finally, call loadLevel2() from laser.js
    if (typeof loadLevel2 === "function") {
      loadLevel2();
    }
  });
}

