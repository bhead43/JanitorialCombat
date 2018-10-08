var game = new Phaser.Game(960, 960, Phaser.AUTO);
game.state.add('level1', demo.level1);
game.state.add('level2', demo.level2);
game.state.add('gameOver', demo.gameOver);
game.state.add('nextLevel', demo.nextLevel); 
game.state.start('level1');