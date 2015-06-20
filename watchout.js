// Set global register of game values
var gameValues = {
  boardWidth : 1024,
  boardHeight : 768,
  highScore : 0,
  currentScore : 0,
  collisions : 0,
  maxCollisions : 5,
  asteroids : [],
  numberOfAsteroids : 20,
  asteroidRadius: 15,
  playerRadius: 10,
  running: true // Is game running?
}

//Initialize the board
var board = d3.select('#board-container')
  .append('svg')
    .attr('class', 'board')
    .attr('width', gameValues.boardWidth)
    .attr('height', gameValues.boardHeight)
    .style({'background-color' : 'black', 'cursor' : 'none'});

d3.select('svg').append('filter')
    .attr('id', 'image')
    .attr('x', '0px')
    .attr('y', '0px')
    .attr('width', '100%')
    .attr('height', '100%')
  .append('feImage')
    .attr('xlink:href', 'shuriken.gif');


/*  board.select('#image').append('feImage')
    .attr('xlink:href', 'asteroid.png')*/

board.append('circle').attr('id', 'playerOne')
  .attr('cx', gameValues.boardWidth/2)
  .attr('cy', gameValues.boardHeight/2)
  .attr('r', gameValues.playerRadius)
  .attr('fill', 'red');

//Setup the initial board with asteroids and scoreboard
var setup = function(){


  //Empty the lisst of asteroid objects
  gameValues.asteroids.length = 0;

  //Create a list of new asteroid objects
  for (var i = 0; i < gameValues.numberOfAsteroids; i++) {
    var newAsteroid = {};
    newAsteroid.top = Math.random() * board.attr('height');
    newAsteroid.left = Math.random() * board.attr('width');
    newAsteroid.image = 'url(asteroid.png)';
    gameValues.asteroids.push(newAsteroid);
  }

  // board.append('path')
  //   .attr('class', 'star')
  //   .attr('d', 'M 0.000 5.000 L 6.508 13.515 L 3.909 3.117 L 14.624 3.338 L 4.875 -1.113 L 11.727 -9.352 L 2.169 -4.505 L 0.000 -15.000 L -2.169 -4.505 L -11.727 -9.352 L -4.875 -1.113 L -14.624 3.338 L -3.909 3.117 L -6.508 13.515 L 0.000 5.000')
  //   .attr('stroke', 'red')
  //   .attr('stroke-width', '2')
  //   .attr('fill', 'blue');

  //Add the list of asteroid objects to new SVG elements in the DOM board
 board.selectAll('.asteroids').data(gameValues.asteroids).enter().append('circle')
    .attr('class', 'asteroids')
    .attr('cx', function(d){ return d.left})
    .attr('cy', function(d){ return d.top})
    .attr('r', gameValues.asteroidRadius)
    .attr('filter', 'url(#image)')
    .attr('collided', 'false')




  //Add the player to the DOM board
  board.select('#playerOne')
    .attr('r', gameValues.playerRadius);


  //Reset the scoreboard
  gameValues.currentScore = 0;
  gameValues.collisions = 0;

  gameValues.running = true;

};

var update = function(){

  if(gameValues.running) {

    for (var i = 0; i < gameValues.numberOfAsteroids; i++) {
      gameValues.asteroids[i].top = Math.random() * board.attr('height');
      gameValues.asteroids[i].left = Math.random() * board.attr('width');
    }

    d3.selectAll('.asteroids').data(gameValues.asteroids).transition()
      .duration(900)
      .tween('d', function(asteroid){
        var startX = d3.select(this).attr('cx');
        var startY = d3.select(this).attr('cy');
        var current = d3.select(this);
        var interpolatorX = d3.interpolateNumber( startX, asteroid.left);
        var interpolatorY = d3.interpolateNumber( startY, asteroid.top);


        return function(t){
          var x = interpolatorX(t);
          var y = interpolatorY(t);
          collisionDetection(x, y, current);
          d3.select(this).attr('cx', x).attr('cy', y);
        };

      });

    gameValues.currentScore++;

    if(gameValues.currentScore > gameValues.highScore) { gameValues.highScore++; }

    d3.select('#highVal').text(gameValues.highScore);
    d3.select('#currentVal').text(gameValues.currentScore);


  }

};


var collisionDetection = function(x, y, current){
  var radiiSum = gameValues.playerRadius + gameValues.asteroidRadius;
  var distance = Math.sqrt(Math.pow((d3.select('#playerOne').attr('cx') - x), 2) + Math.pow((d3.select('#playerOne').attr('cy') - y), 2));

  if((distance - radiiSum) < 0){
    if(current.attr('collided') === 'false'){
      gameValues.collisions++;
      d3.select('#collisionsVal').text(gameValues.collisions);
      current.attr('collided', 'true');
      if (gameValues.collisions >= gameValues.maxCollisions && gameValues.running){
        gameValues.running = false;
        setup();

      }

   //   d3.select("#failMessage").style("display:")
    }
  }
  else {
    current.attr('collided', 'false');
  }


};




d3.select('.board').on('mousemove', function(){
  var currentX = d3.mouse(this)[0];
  var currentY = d3.mouse(this)[1];

  board.select('#playerOne')
    .attr('cx', currentX)
    .attr('cy', currentY);
});

setup();
setInterval(update, 1000)
/*

d3.selectAll('.asteroids').on('mouseenter', function(){
  console.log("works");
  gameValues.collisions++;
  d3.select('#collisionsVal').text(gameValues.collisions);
  if (gameValues.collisions >= gameValues.maxCollisions) {
    setup();
  }
});*/


