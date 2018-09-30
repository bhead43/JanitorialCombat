var game = new Phaser.Game(960, 960, Phaser.AUTO);
game.state.add('state0', demo.state0);
game.state.add('state1', demo.state1);
game.state.add('state2', demo.state2);
game.state.add('level1', demo.level1);
game.state.start('level1');