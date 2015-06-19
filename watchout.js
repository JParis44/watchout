// Set global register of game values
var gameValues = {
  boardWidth : 800,
  boardHeight : 600,
  highScore : 0,
  currentScore : 0,
  collisions : 0,
  asteroids : [],
  n : 5

}

//Initialize the board
var board = d3.select('#board-container')
  .append('svg')
    .attr('class', 'board')
    .attr('width', gameValues.boardWidth)
    .attr('height', gameValues.boardHeight)
    .style('background-color', 'black');

//Setup the initial board with asteroids and scoreboard
var setup = function(){

  //Empty the lisst of asteroid objects
  gameValues.asteroids.length = 0;

  //Create a list of new asteroid objects
  for (var i = 0; i < gameValues.n; i++) {
    var newAsteroid = {};
    newAsteroid.top = Math.random() * board.attr('height');
    newAsteroid.left = Math.random() * board.attr('width');
    newAsteroid.image = 'url(asteroid.png)';
    gameValues.asteroids.push(newAsteroid);
  }

  //Add the list of asteroid objects to new SVG elements in the DOM board
  board.selectAll('.asteroids').data(gameValues.asteroids).enter().append('circle')
    .attr('cx', function(d){ return d.left})
    .attr('cy', function(d){ return d.top})
    .attr('r', 25)
    .attr('fill', 'white');

  //Reset the scoreboard
  gameValues.highScore = 0;
  gameValues.currentScore = 0;
  gameValues.collisions = 0;

};

setup();
