var back;
 
demo.controls = function(){};
demo.controls.prototype = {
	preload: function(){
        game.load.image('Controls', 'assets/TutorialScreen.png');
        game.load.spritesheet('Back', 'assets/BackSpritesheet.png', 54, 22);
    },
	create: function(){
        var controls = game.add.sprite(0, 0, 'Controls');
        
        back = game.add.button(700, 20, 'Back', showTitle, this, 1, 0);
        
        console.log(game.width, game.height);
	},
    
	update: function(){}
};

function showTitle(){
    game.state.start('titleLevel');
}
