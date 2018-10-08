var stateText;

demo.gameOver = function(){};
demo.gameOver.prototype = {
	preload: function(){},
	create: function(){
        game.stage.backgroundColor = '#26b7ad';
        
        //Text stuff
        stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '84px Arial', fill: '#ed0202' });
        stateText.anchor.setTo(0.5, 0.5);
        stateText.visible = false;
    },
	update: function(){
        stateText.text = "Eaten by trash monsters! \nPress \'R\' to restart";
        stateText.visible = true;
        
        if (game.input.keyboard.isDown(Phaser.Keyboard.R)){
            game.state.start('level1');
        }
    }
};