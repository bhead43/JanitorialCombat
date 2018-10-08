var stateText;

demo.nextLevel = function(){};
demo.nextLevel.prototype = {
	preload: function(){},
	create: function(){
        game.stage.backgroundColor = '#26b7ad';
        
        //Text stuff
        stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '84px Arial', fill: '#ed0202' });
        stateText.anchor.setTo(0.5, 0.5);
        stateText.visible = false;
    },
	update: function(){
        stateText.text = "Level Complete! \nPress \'N\' to Start next Level!";
        stateText.visible = true;
        
        if (game.input.keyboard.isDown(Phaser.Keyboard.N)){
            game.state.start('level2');
        }
    }
};