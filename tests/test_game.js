var expect = require('chai').expect;
var Game = require('../controller/game');

describe('game', function(){
  it('should be initialized', function(){
    expect(new Game()).to.exist;
  });

  it('should add players', function(){
    var game = new Game();
    game.addPlayer('123');

    expect(game.players['123']).to.exist;
  });

  it('should remove players', function(){
    var game = new Game();
    game.addPlayer('123');
    game.removePlayer('123');

    expect(game.players['123']).to.not.exist;
  });

  it('should loop over players', function(){
    var game = new Game();
    game.addPlayer('123');
    game.addPlayer('456');

    var count = 0;
    game.forEachPlayer(function(player){
      count++;
    });

    expect(count).to.equal(2);
  });

  it('should return state', function(){
    var game = new Game();
    game.addPlayer('123');

    var expected = {'players': [{'id': '123'}]};

    expect(game.state()).to.eql(expected);
  });

  it('should tick', function(){
    var game = new Game();

    expect(game.tick).to.exist; // TODO: Write actual test when tick() has functionality
  });
});