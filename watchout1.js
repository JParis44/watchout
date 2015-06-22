// Set global register of game values
var gameValues = {
  boardWidth : 1024,
  boardHeight : 768,
  highScore : 0,
  currentScore : 0,
  collisions : 0,
  maxCollisions : 5,
  asteroids : [],
  numberOfAsteroids : 2,
  asteroidRadius: 15,
  playerRadius: 10,
  collided: false, // has player hit asteroid? prevents multi hits
  running: true, // Is game running?
  playerX: 0,
  playerY: 0
};

//Initialize the board
var board = d3.select('#board-container')
  .append('div')
    .attr('class', 'board')
    .style({'width': gameValues.boardWidth + 'px', 'height': gameValues.boardHeight + 'px'})
    .style({'background-color' : 'black'/*, 'cursor' : 'none'*/});

//Add the player
board.append('div').attr('id', 'playerOne')
  .style('position', 'absolute')
  .style({'top': (gameValues.boardHeight/2 - gameValues.playerRadius) + 'px', 'left': (gameValues.boardWidth/2 - gameValues.playerRadius + 'px')})
  .style({'width': gameValues.playerRadius*2+'px', 'height': gameValues.playerRadius*2+'px'})
  .style({'border-radius': gameValues.playerRadius+'px', 'background-color': 'red'});

//Setup the initial board with asteroids and scoreboard
var setup = function(){


  //Empty the lisst of asteroid objects
  gameValues.asteroids.length = 0;

  //Create a list of new asteroid objects
  for (var i = 0; i < gameValues.numberOfAsteroids; i++) {
    var newAsteroid = {};
    newAsteroid.top = Math.random() * (gameValues.boardHeight - (2*gameValues.asteroidRadius));
    newAsteroid.left = Math.random() * (gameValues.boardWidth - (2*gameValues.asteroidRadius));
    newAsteroid.image = 'url(asteroid.png)';
    gameValues.asteroids.push(newAsteroid);
  }

  //Add the list of asteroid objects to new SVG elements in the DOM board
 board.selectAll('.asteroids').data(gameValues.asteroids).enter().append('div')
    .style('position', 'absolute')
    .attr('class', 'asteroids')
    .style('left', function(d){ return d.left + 'px';})
    .style('top', function(d){ return d.top + 'px';})
    .style({'width': gameValues.asteroidRadius*2+'px', 'height': gameValues.asteroidRadius*2+'px'})
    .append('img')
      .attr({'width': gameValues.asteroidRadius*2+'px', 'height': gameValues.asteroidRadius*2+'px'})
      .attr('src', 'asteroid.png');

  //Reset the scoreboard
  gameValues.currentScore = 0;
  gameValues.collisions = 0;

  gameValues.running = true;

};

var update = function(){

  if(gameValues.running) {

    gameValues.collided = false;

    for (var i = 0; i < gameValues.numberOfAsteroids; i++) {
      gameValues.asteroids[i].top = Math.random() * (gameValues.boardHeight - (2*gameValues.asteroidRadius));
      gameValues.asteroids[i].left = Math.random() * (gameValues.boardWidth - (2*gameValues.asteroidRadius));
    }

    d3.selectAll('.asteroids').data(gameValues.asteroids).transition()
      .duration(1000)
      .tween('d', collisionTween)
      .each('end', collisionTween);

    gameValues.currentScore++;

    if(gameValues.currentScore > gameValues.highScore) { gameValues.highScore++; }

    d3.select('#highVal').text(gameValues.highScore);
    d3.select('#currentVal').text(gameValues.currentScore);


  }

};


var collisionDetection = function(x, y, current){
  var radiiSum = gameValues.playerRadius + gameValues.asteroidRadius;
  var distance = Math.sqrt(Math.pow((gameValues.playerX - x), 2) + Math.pow((gameValues.playerY - y), 2));

  if((distance - radiiSum) < 0){
    if(!gameValues.collided){
      gameValues.collisions++;
      d3.select('#collisionsVal').text(gameValues.collisions);
      gameValues.collided = true;
      if (gameValues.collisions >= gameValues.maxCollisions && gameValues.running){
        gameValues.running = false;
        setup();

      }

   //   d3.select("#failMessage").style("display:")
    }
  }
};

var collisionTween = function(asteroid){
  console.log('tween');
  var startX = parseInt(d3.select(this).style('left'), 10);
  var startY = parseInt(d3.select(this).style('top'), 10);
  var current = d3.select(this);
  var interpolatorX = d3.interpolateNumber( startX, asteroid.left);
  var interpolatorY = d3.interpolateNumber( startY, asteroid.top);

  return function(t){
    var x = interpolatorX(t);
    var y = interpolatorY(t);
    collisionDetection(x, y, current);
    d3.select(this).style('left', x + 'px').style('top', y + 'px');
  };
};

gameValues.boardXMax = gameValues.boardWidth - (2*gameValues.playerRadius);
gameValues.boardXMin = -gameValues.playerRadius;
gameValues.boardYMax = gameValues.boardHeight - (2*gameValues.playerRadius);
gameValues.boardYMin = -gameValues.playerRadius;

d3.select('.board').on('mousemove', function(){
  gameValues.playerX = d3.mouse(this)[0];
  gameValues.playerX = (gameValues.playerX > gameValues.boardXMin) ? ((gameValues.playerX < gameValues.boardXMax) ? gameValues.playerX : gameValues.boardXMax) : gameValues.boardXMin;
  gameValues.playerY = d3.mouse(this)[1];
  gameValues.playerY = (gameValues.playerY > gameValues.boardYMin) ? ((gameValues.playerY < gameValues.boardYMax) ? gameValues.playerY : gameValues.boardYMax) : gameValues.boardYMin;

  board.select('#playerOne')
    .style('left', gameValues.playerX + 'px')
    .style('top', gameValues.playerY + 'px');
});

setup();
update();
// setInterval(update, 1000);
/*

d3.selectAll('.asteroids').on('mouseenter', function(){
  console.log("works");
  gameValues.collisions++;
  d3.select('#collisionsVal').text(gameValues.collisions);
  if (gameValues.collisions >= gameValues.maxCollisions) {
    setup();
  }
});*/


