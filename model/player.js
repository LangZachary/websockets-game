var Team = require('./team');
var Projectile = require('./projectile');
var Random = require('./random');
var Physics = require('physicsjs');

// Constructor
function Player(id, team) {
  this.id = id;
  this.team = team;
  this.team.addPlayer();
  this.name = this.team.nextName;
  this.ammo = 3;
  this.maxAmmo = 5;
  this.acceleration = 0.005;
  this.alive = true;
  this.body = Physics.body('player', {
    x: this.team.coordinates.x + Random.rangedRandomFloat(-40, 40),
    y: this.team.coordinates.y + Random.rangedRandomFloat(-40, 40),
    owner: this
  });
}

// Instance methods
Player.prototype.toState = function() {
  return {
    id: this.id,
    color: (this.alive) ? this.team.aliveColor.string() : this.team.deadColor.string(),
    name: this.name,
    type: this.body.type,
    radius: this.body.radius,
    position: this.body.state.pos.values()
  };
}
Player.prototype.delete = function() {
  this.team.removePlayer();
  this.body._world.remove(this.body);
}
Player.prototype.addProjectile = function(x, y) {
  if(this.ammo>0 && this.alive){
    this.ammo--;
    var projectile = new Projectile(this);
    projectile.accelerate(x, y);
    return projectile;
  }
}
Player.prototype.accelerate = function(x, y) {
  if(this.alive){
    this.body.applyForce(Physics.vector(x, y).clamp(Physics.vector(-1, -1), Physics.vector(1, 1)).mult(this.acceleration*this.body.mass));
    this.body.sleep(false);
  }
}

// Class methods
Player.extension = function() {
  Physics.body('player', 'circle', function(parent) {
    return {
      init: function(options) {
        Physics.util.extend(options, {
          radius: 20,
          restitution: 0.2,
          maxSpeed: 0.2,
          mass: 10
        });
        parent.init.call(this, options);
      }
    }
  });
}

// Export class
module.exports = Player;
