var back;
 
demo.credits = function(){};
demo.credits.prototype = {
	preload: function(){
        game.load.image('Credits', 'assets/CreditsScreen.png');
        game.load.spritesheet('Back', 'assets/BackSpritesheet.png', 54, 22);
    },
	create: function(){
        var controls = game.add.sprite(0, 0, 'Credits');
        
        back = game.add.button(700, 20, 'Back', showTitle, this, 1, 0);
        
        console.log(game.width, game.height);
	},
    
	update: function(){}
};

function showTitle(){
    game.state.start('titleLevel');
}
