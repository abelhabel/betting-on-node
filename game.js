var prompt = require('sync-prompt').prompt;

var purse = 100;
var totalWin = 0;
var totalBet = 0;
var lastWin = 0;

function askForBet(){
  return parseInt(prompt("How much do you want to bet?"))
}
function askForGuess(){
  return parseInt(prompt("Guess a number between 1 and 10"));
}
function getRandom(){
  return Math.ceil(Math.random() * 10)
}

function evalBet(betInput, guessInput){
  bet = parseInt(betInput) || askForBet();
  guess = parseInt(guessInput) || askForGuess();
  correct = getRandom();
  win = 0;
  if(guess == correct ){
    win = bet * 2;
  }else{
    if(Math.abs(correct - guess) == 1){
      win = bet;
    }
  }
  totalBet = parseInt(totalBet) + bet;
  totalWin = parseInt(totalWin) + win;
  return win;
}

function play() {
  var rand = getRandom();
  console.log(rand);
  var invalidBet = true;
  var bet = 0;
  while(invalidBet) {
    var bet = parseInt(prompt('You have ' + purse + ' dollars to play with.'+
      'How much do you want to bet? '));
    if(bet <= purse && bet > 0)
      invalidBet = false;
  }
  purse -= bet;

  var guess = parseInt(prompt('Guess a number between 1 and 10: '));
  
  if(guess == rand) {
    console.log("You guessed correct");
    purse += bet * 2;
  }else if(Math.abs(guess - rand) == 1) {
    console.log("You were almost correct and got your money back.");
    purse += bet;
  }else{
    console.log("WRONG!")
  }
  console.log("You purse total is: " + purse);
  var playAgain = prompt("Do you want to play again? (y/n): ");
  if(playAgain.toLowerCase() == 'y')
    play();
}

play();
