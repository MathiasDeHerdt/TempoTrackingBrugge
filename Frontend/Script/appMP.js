// #region ==== DOM //
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM - Main Page")  

    // #region ===== timer  //

function timeToString(time) {
    let diffInHrs = time / 3600000;
    let hh = Math.floor(diffInHrs);
  
    let diffInMin = (diffInHrs - hh) * 60;
    let mm = Math.floor(diffInMin);
  
    let diffInSec = (diffInMin - mm) * 60;
    let ss = Math.floor(diffInSec);
  
    let diffInMs = (diffInSec - ss) * 100;
    let ms = Math.floor(diffInMs);
  
    let formattedMM = mm.toString().padStart(2, "0");
    let formattedSS = ss.toString().padStart(2, "0");
    let formattedMS = ms.toString().padStart(2, "0");
  
    return `${formattedMM}:${formattedSS}:${formattedMS}`;
  }
  
  // Declare variables to use in our functions below
  
  let startTime;
  let elapsedTime = 0;
  let timerInterval;
  
  // Create function to modify innerHTML
  
  function print(txt) {
    document.getElementById("display").innerHTML = txt;
  }
  
  // Create "start", "pause" and "reset" functions
  
  function start() {
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(function printTime() {
      elapsedTime = Date.now() - startTime;
      print(timeToString(elapsedTime));
    }, 10);
    showButton("PAUSE");
  }
  
  function pause() {
    clearInterval(timerInterval);
    showButton("PLAY");
  }
  
  
  // Create function to display buttons
  
  function showButton(buttonKey) {
    const buttonToShow = buttonKey === "PLAY" ? playButton : pauseButton;
    const buttonToHide = buttonKey === "PLAY" ? pauseButton : playButton;
    buttonToShow.style.display = "block";
    buttonToHide.style.display = "none";
  }
    // Create event listeners
  
  let playButton = document.getElementById("playButton");
  let pauseButton = document.getElementById("pauseButton");
  let retryButton = document.getElementById("Retry_button")
  //let resetButton = document.getElementById("resetButton");
  
  playButton.addEventListener("click", start);
  pauseButton.addEventListener("click", pause);
  //resetButton.addEventListener("click", reset);


    // #endregion

    // #region ===== Buttons  (start and retry)
    function showButtons(){
      let gridButtons = document.getElementById("c-buttons_mainPage");
      gridButtons.classList.remove("o-hide");
      console.log("REVEAL YOURSELF!");
    }

    function Retry(){
      let gridButtons = document.getElementById("c-buttons_mainPage");
      gridButtons.classList.add("o-hide");
      console.log("BEGONE!");

      clearInterval(timerInterval);
      print("00:00:00");
      elapsedTime = 0;
      showButton("PLAY");
    }

    playButton.addEventListener("click",showButtons);
    retryButton.addEventListener("click",Retry);
    //#endregion

    //#region ===== dropdown & HTML generating
    //variables
    let counter = 0
    let wrapperdropdown = document.querySelector(".c-wrapper-dropdown")

    //Dropdown up / down animation
    function dropDown(){
      counter += 1;

      if (counter == 1){
        wrapperdropdown.classList.add("active");
        let arrow = document.querySelector(".c-wrapper-dropdown__arrow")
        arrow.style.transform = "rotate(180deg)"
      }

      if (counter == 2){
        wrapperdropdown.classList.remove("active");
        let arrow = document.querySelector(".c-wrapper-dropdown__arrow")
        arrow.style.transform = "rotate(0deg)"
        counter = 0;
      }
    }
    wrapperdropdown.addEventListener("click",dropDown)

    //Update item once item is clicked and generate specific html if necessary

    var list = [];

    const listItems = document.querySelectorAll('.c-dropdown li');
    for (let i = 0; i <= listItems.length - 1; i++) {
      list.push(listItems[i].id);
    }

    function SelectOption1(){
      let a1 = document.getElementById("a1");
      let a0 = document.getElementById("a0");
      
      if(a0 != a1){
        let savedWord1 = a0.textContent;
        a0.innerHTML = a1.textContent;
        a1.innerHTML = savedWord1;
      }
    }

    function SelectOption2(){
      let a2 = document.getElementById("a2");
      let a0 = document.getElementById("a0");
      
      if(a0 != a2){
        let savedWord2 = a0.textContent;
        a0.innerHTML = a2.textContent;
        a2.innerHTML = savedWord2;
      }
    }
    
    function clickfunction(op){
      let option = document.getElementById(op);

      if(op == "option1"){
        option.addEventListener("click", SelectOption1)
      }

      if(op == "option2"){
        option.addEventListener("click", SelectOption2)
      }
    }

    list.forEach(clickfunction)


    //#endregion

    //#endregion
});

// #endregion
