var demo = {};
 
demo.titleLevel = function(){};
demo.titleLevel.prototype = {
	preload: function(){
         game.load.image('title', 'assets/titlePage.png');
    },
	create: function(){
        var title = game.add.sprite(0, 0, 'title');
        
        title.height = game.height;
        title.width = game.width;
        title.smoothed = false;
        
        console.log(game.width, game.height);
        

		
	},
	update: function(){
        
        if (game.input.keyboard.isDown(Phaser.Keyboard.ENTER)){
            game.state.start('level0');
        }
    }
};