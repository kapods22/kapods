let round1 = {
  score: "",
  guess: "",
  answer: ""
}
let round2 = {
  score: "",
  guess: "",
  answer: ""
}
let round3 = {
  score: "",
  guess: "",
  answer: ""
}
let scoreDisplay = document.querySelector(".final-score");

function check(element) {
  if(element.classList.contains("checked")) {
    element.classList.remove("checked");
  } else {
    let list = element.parentElement.parentElement;
    let checkboxes = list.querySelectorAll(".checkbox");
    for (let checkbox of checkboxes) {
      checkbox.classList.remove("checked");
    }
    element.classList.add("checked");
  }
  
  if (round1.guess && round1.answer && round1.guess == round1.answer) {
    round1.score = 1;
  } else if (round1.guess && round1.answer) {
    round1.score = 0;
  } else {
    round1.score = NaN;
  }
  
  if (round2.guess && round2.answer && round2.guess == round2.answer) {
    round2.score = 1;
  } else if (round2.guess && round2.answer) {
    round2.score = 0;
  } else {
    round2.score = NaN;
  }
  
  if (round3.guess && round3.answer && round3.guess == round3.answer) {
    round3.score = 1;
  } else if (round3.guess && round3.answer) {
    round3.score = 0;
  } else {
    round3.score = NaN;
  }
  
  if ((round1.score == 1 || round1.score == 0) && (round2.score == 1 || round2.score == 0) && (round3.score == 1 || round3.score == 0)) {
    scoreDisplay.innerHTML = round1.score + round2.score + round3.score;
  } else {
    scoreDisplay.innerHTML = "";
  }
}

function setGuess(element, round) {
  let guess;
  
  if(!element.classList.contains("checked")) {
    guess = element.nextElementSibling.innerText;
  } else {
    guess = "";
  }
  if (round == 1) {
    round1.guess = guess;
  } else if (round == 2) {
    round2.guess = guess;
  } else if (round == 3) {
    round3.guess = guess;
  }
  
  check(element);
}

function setAnswer(element, round) {
  let answer;
  
  if(!element.classList.contains("checked")) {
    answer = element.nextElementSibling.innerText;
  } else {
    answer = "";
  }
  if (round == 1) {
    round1.answer = answer;
  } else if (round == 2) {
    round2.answer = answer;
  } else if (round == 3) {
    round3.answer = answer;
  }
  
  check(element);
}

function printPage(element) {
  if(confirm("If you print, the scoresheet will be reset. Please confirm that you are okay with that.")) {
    //element.style.display = "none";
    /*let r1Score = round1.score;
    let r1Guess = round1.guess;
    let r1Answer = round1.answer;
    let r2Score = round2.score;
    let r2Guess = round2.guess;
    let r2Answer = round2.answer;
    let r3Score = round3.score;
    let r3Guess = round3.guess;
    let r3Answer = round3.answer;*/
    /* round1.score = NaN;
    round1.guess = "";
    round1.answer = "";
    round2.score = NaN;
    round2.guess = "";
    round2.answer = "";
    round3.score = NaN;
    round3.guess = "";
    round3.answer = "";
    let checkboxes = document.querySelectorAll(".checked");
    for (let checkbox of checkboxes) {
      //checkbox.classList.add("bchecked");
      checkbox.classList.remove("checked");
    }*/
    //scoreDisplay.innerHTML = "";
    let wrapper = document.querySelector(".wrapper");
    wrapper.classList.add("printing");
    window.print();
    wrapper.classList.remove("printing");
    //element.style.display = "block";
    /*console.log(r1Score);
    round1.score = r1Score;
    round1.guess = r1Guess;
    round1.answer = r1Answer;
    round2.score = r2Score;
    round2.guess = r2Guess;
    round2.answer = r2Answer;
    round3.score = r3Score;
    round3.guess = r3Guess;
    round3.answer = r3Answer;
    let bchecks = document.querySelectorAll(".bchecked");
    for (let checkbox of checkboxes) {
      checkbox.classList.add("checked");
      checkbox.classList.remove("bchecked");
    }
    if ((round1.score == 1 || round1.score == 0) && (round2.score == 1 || round2.score == 0) && (round3.score == 1 || round3.score == 0)) {
      scoreDisplay.innerHTML = round1.score + round2.score + round3.score;
    }*/
  }
}
