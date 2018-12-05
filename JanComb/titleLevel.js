var demo = {};
var start, controls, credits;
 
demo.titleLevel = function(){};
demo.titleLevel.prototype = {
	preload: function(){
        game.load.image('title', 'assets/titlePage_NEW.png');
        game.load.spritesheet('Start', 'assets/StartSpritesheet.png', 64, 22);
        game.load.spritesheet('Controls', 'assets/ControlsSpritesheet.png', 108, 30);
        game.load.spritesheet('Credits', 'assets/CreditsSpritesheet.png', 82, 26);
    },
	create: function(){
        var title = game.add.sprite(0, 0, 'title');
        
        title.height = game.height;
        title.width = game.width;
        title.smoothed = false;
        
        start = game.add.button(game.world.centerX, 450, 'Start', startGame, this, 1, 0);
        start.anchor.setTo(0.5, 0.5);
        controls = game.add.button(game.world.centerX, 550, 'Controls', showControls, this, 1, 0);
        controls.anchor.setTo(0.5, 0.5);
        credits = game.add.button(game.world.centerX, 650, 'Credits', showCredits, this, 1, 0);
        credits.anchor.setTo(0.5, 0.5);
        
        console.log(game.width, game.height);
	},
    
	update: function(){}
};

function startGame(){
    game.state.start('level0');
}

function showControls(){
    game.state.start('controls');
}

function showCredits(){
    game.state.start('credits');
}