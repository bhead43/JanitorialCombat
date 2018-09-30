var demo = {}, centerX = 1500 / 2, centerY = 1000 / 2, carlos, purpleBall, speed = 4, score = 0, scoreText; 

demo.state0 = function(){};
demo.state0.prototype = {
	preload: function(){
		game.load.image('carlos','assets/sprites/carlos.png')
		game.load.image('jungle','assets/backgrounds/jungle.png')
        game.load.image('purpleBall','assets/sprites/purpleBall.png')

	},
	create: function(){
		game.physics.startSystem(Phaser.Physics.ARCADE)
		game.stage.backgroundColor = '#26b7ad';
		addChangeStateEventListeners();
		game.world.setBounds(0, 0, 2813, 1000);
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

		var jungle = game.add.sprite(0, 0,'jungle');

		carlos = game.add.sprite(centerX, centerY, 'carlos');
		carlos.anchor.setTo(0.5, 0.5);
		carlos.scale.setTo(0.9, 0.9);
		game.physics.enable(carlos);
		carlos.body.collideWorldBounds = true;

		game.camera.follow(carlos);
		game.camera.deadzone = new Phaser.Rectangle(centerX - 300, 0, 600, 1000);
        
        
        purpleBall = game.add.group()
        purpleBall.enableBody = true;
        for (var i = 0; i < 7; i++)
        {
        purpleBall.create(i * 450, 800, 'purpleBall');
        }
        
        scoreText = game.add.text(20, 20, 'score: 0', { fontSize: '64px', fill: '#000' });
        

	},


	update: function(){
		if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
			carlos.scale.setTo(0.9, 0.9);
			carlos.x += 4;
		}
		else if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
			carlos.scale.setTo(-0.9, 0.9);
			carlos.x -= 4;
		}

		if(game.input.keyboard.isDown(Phaser.Keyboard.UP)){
			carlos.y -= 4;
			if(carlos.y < 395){
				carlos.y = 395;
			}
		}
		else if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
			carlos.y += 4;
		}
	   
        game.physics.arcade.overlap(carlos, purpleBall, collectBall, null, this)
    
    }
    
};


function changeState(i,stateNum){
	game.state.start('state' + stateNum);
    console.log('state' + stateNum);
    
}


function addKeyCallback(key, fn, args){
	game.input.keyboard.addKey(key).onDown.add(fn, null, null, args)

}

function addChangeStateEventListeners(){
	addKeyCallback(Phaser.Keyboard.ZERO, changeState, 0);
	addKeyCallback(Phaser.Keyboard.ONE, changeState, 1);
	addKeyCallback(Phaser.Keyboard.TWO, changeState, 2);
	addKeyCallback(Phaser.Keyboard.THREE, changeState, 3);
	addKeyCallback(Phaser.Keyboard.FOUR, changeState, 4);
	addKeyCallback(Phaser.Keyboard.FIVE, changeState, 5);
	addKeyCallback(Phaser.Keyboard.SIX, changeState, 6);
	addKeyCallback(Phaser.Keyboard.SEVEN, changeState, 7);
	addKeyCallback(Phaser.Keyboard.EIGHT, changeState, 8);
	addKeyCallback(Phaser.Keyboard.NINE, changeState, 9);

}

function collectBall(carlos,purpleBall){
    purpleBall.kill();
    
    score += 10;
    scoreText.text = 'Score: ' + score; 
    
}







