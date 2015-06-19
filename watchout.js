// Set global register of game values
var gameValues = {
  boardWidth : 800,
  boardHeight : 600,
  highScore : 0,
  currentScore : 0,
  collisions : 0,
  asteroids : [],
  numberOfAsteroids : 20,
  asteroidRadius: 10

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
  for (var i = 0; i < gameValues.numberOfAsteroids; i++) {
    var newAsteroid = {};
    newAsteroid.top = Math.random() * board.attr('height');
    newAsteroid.left = Math.random() * board.attr('width');
    newAsteroid.image = 'url(asteroid.png)';
    gameValues.asteroids.push(newAsteroid);
  }

  //Add the list of asteroid objects to new SVG elements in the DOM board
  board.selectAll('.asteroids').data(gameValues.asteroids).enter().append('circle')
    .attr('class', 'asteroids')
    .attr('cx', function(d){ return d.left})
    .attr('cy', function(d){ return d.top})
    .attr('r', gameValues.asteroidRadius)
    .attr('fill', 'white');

  //Reset the scoreboard
  gameValues.highScore = 0;
  gameValues.currentScore = 0;
  gameValues.collisions = 0;

};

var update = function(){

  for (var i = 0; i < gameValues.numberOfAsteroids; i++) {
    gameValues.asteroids[i].top = Math.random() * board.attr('height');
    gameValues.asteroids[i].left = Math.random() * board.attr('width');
  }

  //var a = d3.selectAll('.asteroids');
  //a.attr("r", Math.random() * 100);

  d3.selectAll('.asteroids').data(gameValues.asteroids).transition()
    .duration(500)
    .attr('cx', function(d){ return d.left})
    .attr('cy', function(d){ return d.top});
};


setup();
setInterval(update, 1000);
