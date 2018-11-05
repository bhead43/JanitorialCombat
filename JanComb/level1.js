var totalMove = 0;

demo.level1 = function(){};
demo.level1.prototype = {
	preload: function(){
        game.load.tilemap('levelOne', 'assets/levelOneNEW.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('Floor Tiles', 'assets/protoTileSet.png');
        game.load.image('Floor Tiles 2', 'assets/newTiles.png');
        game.load.image('Goal Tiles', 'assets/goalTiles_TOGETHER.png');
        game.load.spritesheet('jan', 'assets/characterSpriteSheetNEW.png', 230, 405);
        game.load.image('Trash', 'assets/paperBallRESIZED.png');
        game.load.spritesheet('villain', 'assets/trashMonsterSpritesheet.png', 300, 300);
	    game.load.audio('bgMusic', 'assets/audio/CrEEP.mp3');
        game.load.audio('monSound', 'assets/audio/monsterSound.mp3');
    },
    
	create: function(){
        //Start Physics
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        // Tilemap and layers to state
        map = game.add.tilemap('levelOne');
        map.addTilesetImage('Floor Tiles');
        map.addTilesetImage('Floor Tiles 2');
        map.addTilesetImage('Goal Tiles');
	    baseLayer = map.createLayer('Floor');
        blockLayer = map.createLayer('Blocks');
        goalLayer = map.createLayer('Goal');
        
        //Set collision on the 'Blocks' layer
        map.setCollisionBetween(3, 5, true, 'Blocks');
        map.setCollisionBetween(7, 7, true, 'Goal');
        
        // Everything janitor
        jan = createJanitor(130, 130);
        
        // Trash
        trash = new Trash(200, 150);
        
        // Villain
        villain = createMonster(300, 800);
		
	    // Audio
	    // Background music
	    bgMusic = game.add.audio('bgMusic');
        bgMusic.play();
        // Monster sound effects
	    game.time.events.loop(Phaser.Timer.SECOND * getRandomInt(4,10), playMonSound, this);
        monSound = game.add.audio('monSound'); 
    },
	update: function(){
	    var hitGoal = game.physics.arcade.collide(trash.trash, goalLayer);
        var badHit = game.physics.arcade.collide(villain, jan);
        
	    // Basic collisions
        game.physics.arcade.collide(jan, blockLayer);
        game.physics.arcade.collide(trash.trash, blockLayer);
        game.physics.arcade.collide(trash.trash, goalLayer)
        game.physics.arcade.collide(villain, blockLayer)
		
        // Trash children collision
        var upCollide = game.physics.arcade.collide(jan, trash.upChild);
        var downCollide = game.physics.arcade.collide(jan, trash.downChild);
        var leftCollide = game.physics.arcade.collide(jan, trash.leftChild);
        var rightCollide = game.physics.arcade.collide(jan, trash.rightChild);
        //More variables to check children collision, but this time with the monster
        var upBadCollide = game.physics.arcade.collide(villain, trash.upChild);
        var downBadCollide = game.physics.arcade.collide(villain, trash.downChild);
        var leftBadCollide = game.physics.arcade.collide(villain, trash.leftChild);
        var rightBadCollide = game.physics.arcade.collide(villain, trash.rightChild);
        
        // Janitor movement
        if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
            jan.body.velocity.y = 0;
            jan.body.velocity.x = velocity;
            jan.animations.play('walkRight', 7, true);
	   }
        else if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
            jan.body.velocity.y = 0;
            jan.body.velocity.x = velocity * -1;
            jan.animations.play('walkLeft', 7, true);
        }
        else if(game.input.keyboard.isDown(Phaser.Keyboard.UP)){
            jan.body.velocity.x = 0;
            jan.body.velocity.y = velocity * -1;
            jan.animations.play('walkUp', 7, true);
        }
        else if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
            jan.body.velocity.x = 0;
            jan.body.velocity.y = velocity;
            jan.animations.play('walkDown', 7, true);
        }
        else{
            jan.animations.stop();
            jan.frame = 0
            jan.body.velocity.x = 0;
            jan.body.velocity.y = 0;
        }
		
        // Trash monster movement animations	
        if(villain.body.velocity.y > 0){
            villain.animations.play('walkDown', 7, true);
        }
        else if(villain.body.velocity.x < 0){
            villain.animations.play('walkLeft', 7, true);
        } 
        else if(villain.body.velocity.x > 0){
            villain.animations.play('walkRight', 7, true);
        }
        else {
            villain.animations.play('walkUp', 7, true);
        }
 
	    // Trash movement
	    // PUSH
        // First check to see if the 'E' key is pressed...
        if(game.input.keyboard.isDown(Phaser.Keyboard.E)){
            if(upCollide){	// move trash down
                jan.animations.play('pushDown', 3, false);
                trash.trash.body.velocity.y = trashVelocity;
            }
            else if(downCollide){	// move trash up
                jan.animations.play('pushUp', 3, false);
		        trash.trash.body.velocity.y = trashVelocity * -1;
            }
            else if(leftCollide){	// move trash right
                jan.animations.play('pushRight', 3, false);
                trash.trash.body.velocity.x = trashVelocity;
            }
            else if(rightCollide){	// move trash left
                jan.animations.play('pushLeft', 3, false);
                trash.trash.body.velocity.x = trashVelocity * -1;
            }
            else{
                jan.animations.play('pushDown', 3, false);
            }
        }
        
	    // PULL
        //Check to see if the 'F' key is pressed...
        if(game.input.keyboard.isDown(Phaser.Keyboard.F)){
            console.log(totalMove)
            if(upCollide && totalMove < 20){	// pull trash up
                trash.trash.position.y = trash.trash.position.y - 5;
                totalMove++;
            }
            else if(downCollide && totalMove < 20){	// pull trash down
                trash.trash.position.y = trash.trash.position.y + 5;
                totalMove++;
            }
            else if(leftCollide && totalMove < 20){	// pull trash left
		        trash.trash.position.x = trash.trash.position.x - 5;
                totalMove++;
            }
            else if(rightCollide && totalMove < 20){	// pull trash right
                trash.trash.position.x = trash.trash.position.x + 5;
                totalMove++;
            }
        }
        
        //Goal Detection
        if(hitGoal){
            trash.trash.kill();
            bgMusic.pause();	// pause background music
            totalMove = 0;
            game.state.start('nextLevel');	// move onto next level
        }

        // Moves the villain sprite continuously towards the jan sprite
        game.physics.arcade.moveToObject(villain, jan, 75);
   
        // Check for collision with janitor
        if(badHit){
            // Game over
            jan.kill();
            bgMusic.pause();	// pause background music
            totalMove = 0;
            game.state.start('gameOver');
        }
         
        // Check for collision with trash ball children
        if(upBadCollide){	// move trash down
            trash.trash.body.velocity.y = trashVelocity;
        }
        else if(downBadCollide){	// move trash up
            trash.trash.body.velocity.y = trashVelocity * -1;
        }
        else if(leftBadCollide){ // move trash to the right
            trash.trash.body.velocity.x = trashVelocity;
        }
        else if(rightBadCollide){	// move trash to the left
            trash.trash.body.velocity.x = trashVelocity * -1;
        }
    },
    //DON'T DELETE THIS! Uncomment it all to check collision boxes on stuff
    render: function() {
//        // Mains
//        game.debug.body(jan);
//        game.debug.body(trash);
//        game.debug.body(villain);
//        // trash children
//        game.debug.body(upChild);
//        game.debug.body(downChild);
//        game.debug.body(leftChild);
//        game.debug.body(rightChild);
//	      game.debug.body(goalLayer);
    }
};