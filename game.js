var prompt = require('sync-prompt').prompt;
var fs = require('fs');

function Player(name) {
  this.name = name;
  this.wins = 0;
  this.purse = 100;
  this.losses = 0;
}

var Game = {
  players: [],
  rounds: 0,
  currentPlayer: 0,
  nextPlayer: function(){
    this.currentPlayer = this.currentPlayer ? 0 : 1;
  },
  getPlayer: function(){
    return this.players[this.currentPlayer];
  },

}

var purse = 100;
var totalWin = 0;
var totalBet = 0;
var lastWin = 0;

function askName(n) {
  return prompt("Player " + n + ", Please input your name: ");
}

function askForBet(){
  return parseInt(prompt(Game.getPlayer().name + ', you have ' + Game.getPlayer().purse + ' dollars to play with.'+
      ' How much do you want to bet? '));
}
function askForGuess(){
  return parseInt(prompt("Guess a number between 1 and 10: "));
}
function getRandom(){
  return Math.ceil(Math.random() * 10)
}

function getPlayer(name) {
  //get player on file based on [name].json
  return JSON.parse(fs.readFileSync("./saves/" + name + ".json"));
}

function putPlayer(player) {
  fs.writeFile("./saves/" + player.name + ".json", JSON.stringify(player), function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
  });
}

function fileExist(fileName) {
  return fs.existsSync(fileName);
}

function getAllPlayers(callback) {
  
  var files = fs.readdirSync("./saves/");
  var players = [];
  files.forEach(function(fileName) {
    players.push(getPlayer(fileName.split('.json')[0]));
  });
  return players;
}

function sortPlayers(players) {
  var sorted = false;
  var sl = players;
  var temp;
  while(!sorted) {
    sorted = true;
    for(var i = 1; i < sl.length; i += 1) {
      if(sl[i].purse < sl[i - 1].purse ) {
        temp = sl[i - 1];
        sl[i - 1] = sl[i];
        sl[i] = temp;
        sorted = false;
      }
    }
  }
  return sl;
}

function showLeaderBoard() {
  var sortedPlayers = sortPlayers(getAllPlayers(sortPlayers));
  console.log("Name | Purse");
  console.log("-----------");
  sortedPlayers.reverse().forEach(function(p){
    console.log(p.name + " | " + p.purse);
  });
  // console.log('leaderboard', sortedPlayers);
}

function doRound() {
  var rand = getRandom();
  console.log(rand);
  var invalidBet = true;
  var bet = 0;
  while(invalidBet) {
    var bet = askForBet();
    if(bet <= Game.getPlayer().purse && bet > 0)
      invalidBet = false;
  }
  Game.getPlayer().purse -= bet;

  var guess = askForGuess();
  
  if(guess == rand) {
    console.log("You guessed correct");
    Game.getPlayer().purse += bet * 2;
  }else if(Math.abs(guess - rand) == 1) {
    console.log("You were almost correct and got your money back.");
    Game.getPlayer().purse += bet;
  }else{
    console.log("WRONG!")
  }
  
  console.log("Your purse total is: " + Game.getPlayer().purse);
}

function play() {
  doRound();
  Game.nextPlayer();
  doRound();
  Game.nextPlayer();
  
  putPlayer(Game.players[0]);
  putPlayer(Game.players[1]);

  var playAgain = prompt("Do you want to play again? (y/n): ");
  if(playAgain.toLowerCase() == 'y') {
    play();
  }

}
showLeaderBoard();
Game.players[0] = new Player(askName(1));
Game.players[1] = new Player(askName(2));
if(fileExist( "./saves/" + Game.players[0].name + ".json")){
  Game.players[0] = getPlayer(Game.players[0].name);
}else{
  putPlayer(Game.players[0]);
}
if(fileExist( "./saves/" + Game.players[1].name + ".json" )){
  Game.players[1] = getPlayer(Game.players[1].name);
}else{
  putPlayer(Game.players[1]);
}
play();






