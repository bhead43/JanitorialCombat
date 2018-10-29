demo.level1 = function(){};
demo.level1.prototype = {
	preload: function(){
        //game.load.tilemap('levelOne', 'assets/levelMap.json', null, Phaser.Tilemap.TILED_JSON);   //Old tilemap
        game.load.tilemap('levelOne', 'assets/levelOneNEW.json', null, Phaser.Tilemap.TILED_JSON);  //New tilemap, smaller, different tileset
        game.load.image('Floor Tiles', 'assets/protoTileSet.png');
        game.load.image('Floor Tiles 2', 'assets/newTiles.png');
        game.load.image('Goal Tiles', 'assets/goalTiles_TOGETHER.png');
        //game.load.spritesheet('jan', 'assets/characterSpritesheet.png', 230, 405);    //Old spritesheet
        game.load.spritesheet('jan', 'assets/characterSpriteSheetNEW.png', 230, 405);
        //game.load.image('Trash', 'assets/paperBall.png'); //Old trash ball image
        game.load.image('Trash', 'assets/paperBallRESIZED.png');
        game.load.spritesheet('villain', 'assets/villainSpritesheet.png', 300, 300);
        game.load.audio('bgMusic', 'assets/audio/CrEEP.mp3');
        game.load.audio('monSound', 'assets/audio/monsterSound.mp3');
    },
    
	create: function(){
        //Start Physics
        game.physics.startSystem(Phaser.Physics.ARCADE);
    
        // Sound, works now
        game.time.events.loop(Phaser.Timer.SECOND * getRandomInt(4,10), playMonSound, this);
        
        //Add tilemap and layers to state
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
        
        //janitor sprite creation and size 
        jan = game.add.sprite(130, 130,'jan');
        
        jan.anchor.setTo(0.5, 0.5);
        jan.scale.setTo(0.25, 0.25);
        
        //jan be able to collide
       
        game.physics.enable(jan);
        jan.body.setSize(128, 128, 50, 270);
	    jan.body.collideWorldBounds = true;
        
        //Add animations --- NEW ANIMATIONS, USE WITH characterSpriteSheetNEW.png
        jan.animations.add('walkUp', [16, 15, 17, 15]);
        jan.animations.add('walkDown', [1, 0, 2, 0]);
        jan.animations.add('walkLeft', [6, 5, 7, 5]);
        jan.animations.add('walkRight', [11, 10, 12, 10]);
        jan.animations.add('pushUp', [18]);
        jan.animations.add('pushDown', [3, 4]);
        jan.animations.add('pushLeft', [8, 9]);
        jan.animations.add('pushRight', [13, 14]);
		
	    //play background music	
	    bgMusic = game.add.audio('bgMusic');
        bgMusic.play();
        
        monSound = game.add.audio('monSound');
        
        trash = createTrash(200, 150);
        //Add children to trash
        //  I *think* that these all need to be made like this, as opposed to doing it through a function.
        //  Otherwise, I don't know an easy way to handle collision detection later on
       
        upChild = addChildSprite(trash, 'up');
        downChild = addChildSprite(trash, 'down');
        leftChild = addChildSprite(trash, 'left');
        rightChild = addChildSprite(trash, 'right');
        
        villain = game.add.sprite(300, 800, 'villain');
        
        villain.anchor.setTo(0.5,0.5);
        villain.scale.setTo(0.2,0.2);
        
        game.physics.enable(villain);
        villain.body.setSize(225, 225, 40, 75);
        villain.body.collideWorldBounds = true;
        
        villain.animations.add('walkRight', [4,5]);
        villain.animations.add('walkLeft', [0,1]);
        villain.animations.add('walkUp', [3]);
        villain.animations.add('walkDown', [2]);
        
    //Text stuff
    stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '84px Arial', fill: '#ed0202' });
    stateText.anchor.setTo(0.5, 0.5);
    stateText.visible = false;
        
        
    },
	update: function(){
        villain.frame = 2;
        
        var hitGoal = game.physics.arcade.collide(trash, goalLayer);
        var badHit = game.physics.arcade.collide(villain, jan);
        
        game.physics.arcade.collide(jan, blockLayer);
        game.physics.arcade.collide(trash, blockLayer);
        game.physics.arcade.collide(trash, goalLayer)
        game.physics.arcade.collide(villain, blockLayer)
        
        //Variables to check collision with trash children
        var upCollide = game.physics.arcade.collide(jan, upChild);
        var downCollide = game.physics.arcade.collide(jan, downChild);
        var leftCollide = game.physics.arcade.collide(jan, leftChild);
        var rightCollide = game.physics.arcade.collide(jan, rightChild);
        //More variables to check children collision, but this time with the monster
        var upBadCollide = game.physics.arcade.collide(villain, upChild);
        var downBadCollide = game.physics.arcade.collide(villain, downChild);
        var leftBadCollide = game.physics.arcade.collide(villain, leftChild);
        var rightBadCollide = game.physics.arcade.collide(villain, rightChild);
        
        //Movement stuff
        //  Maybe set x velocity to 0 when moving up/down, and vice versa? Could help with movement weirdness
        if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
			//jan.scale.setTo(0.2, 0.2);
            jan.body.velocity.y = 0;
			jan.body.velocity.x = velocity;
            jan.animations.play('walkRight', 7, true);
	    villain.animations.play('walkRight', 7, true);
		}
		else if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
			//jan.scale.setTo(-0.2, 0.2);
            jan.body.velocity.y = 0;
			jan.body.velocity.x = velocity * -1;
            jan.animations.play('walkLeft', 7, true);
	    villain.animations.play('walkLeft', 7, true);
		}

		else if(game.input.keyboard.isDown(Phaser.Keyboard.UP)){
            //jan.scale.setTo(0.2, 0.2);
            jan.body.velocity.x = 0;
			jan.body.velocity.y = velocity * -1;
            jan.animations.play('walkUp', 7, true);
	    villain.animations.play('walkUp', 7, true);
			
		}
		else if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
            //jan.scale.setTo(0.2, 0.2);
            jan.body.velocity.x = 0;
			jan.body.velocity.y = velocity;
            jan.animations.play('walkDown', 7, true);
	    villain.animations.play('walkDown', 7, true);
		}
	   
        else{
            jan.animations.stop();
            jan.frame = 0
            jan.body.velocity.x = 0;
            jan.body.velocity.y = 0;
        }
		
		
	 if(villain.body.velocity.y > 0){
             villain.animations.play('walkDown', 7, true);
        }
        else if(villain.body.velocity.x < 0){
            villain.animations.play('walkLeft', 7, true);
        } else if(villain.body.velocity.x > 0){
            villain.animations.play('walkRight', 7, true);
        }
        else {
            villain.animations.play('walkUp', 7, true);
        }
        
        //Trash movement!
        //  What *should* happen:
        //      -Only gets moved when you hit a button (making it 'E' for now) while next to the ball
        //      -Direction of movement depends on where you hit it from
        //      -Only ever moves on one axis
        
        //First check to see if the 'E' key is pressed...
        if(game.input.keyboard.isDown(Phaser.Keyboard.E)){
            if(upCollide){
                //Put a pushing animation here! At some point
                //PUSH_DOWN ANIMATION GOES HERE
                jan.animations.play('pushDown', 3, false);
                
                //Move trash down
                trash.body.velocity.y = trashVelocity;
            }
            else if(downCollide){
                //PUSH_UP ANIMATION GOES HERE
                jan.animations.play('pushUp', 3, false);
                
                //Move trash up
                trash.body.velocity.y = trashVelocity * -1;
            }
            else if(leftCollide){
                //PUSH_RIGHT ANIMATION GOES HERE
                jan.animations.play('pushRight', 3, false);
                
                //Move trash to the right
                trash.body.velocity.x = trashVelocity;
            }
            else if(rightCollide){
                //PUSH_LEFT ANIMATION GOES HERE
                jan.animations.play('pushLeft', 3, false);
                
                //Move trash to the left
                trash.body.velocity.x = trashVelocity * -1;
            }
            else{
                //PUSH_BAD ANIMATION GOES HERE
                jan.animations.play('pushDown', 3, false);
            }
        }
        
        //Check to see if the 'F' key is pressed...
        if(game.input.keyboard.isDown(Phaser.Keyboard.F)){
            if(upCollide){
                //Put a pulling animation here! At some point
                //PULL_UP ANIMATION GOES HERE
                
                //Pull trash up
                trash.body.velocity.y = trashVelocity * -1;
            }
            else if(downCollide){
                //PULL_DOWN ANIMATION GOES HERE
                
                //Pull trash down
                trash.body.velocity.y = trashVelocity;
            }
            else if(leftCollide){
                //PULL_LEFT ANIMATION GOES HERE
                
                //Pull trash to the left
                trash.body.velocity.x = trashVelocity * -1;
            }
            else if(rightCollide){
                //PULL_RIGHT ANIMATION GOES HERE
                
                //Pull trash to the right
                trash.body.velocity.x = trashVelocity;
            }
            else{
                //PULL_BAD ANIMATION GOES HERE
            }
        }
        
        //Goal Detection
        //  Ends level once the trash ball hits the goal area
        if(hitGoal){
            trash.kill();
            bgMusic.pause();
            game.state.start('nextLevel');  
        }

        //Enemy movement!
        //  What *should* happen:
        //      -Enemy moves towards the player at all times
        //      -If the enemy collides with the player, deal damage!
        //          --Will probably just be a 'game over' and reset the level on hit for now. Will implement an HP mechanic later on
        //      -If the enemy collides with the ball, it'll move the ball
        //          --Will follow the same rules as the player; if it hits from the bottom, move it up, etc.
        
        //Moves the villain sprite continuously towards the jan sprite
        game.physics.arcade.moveToObject(villain, jan, 75);
        
        
      //  if(jan.body.velocity.y < 0){
         //    villain.animations.play('walkUp', 7, true);
       // }
        //else if(jan.body.velocity.x < 0){
          //  villain.animations.play('walkLeft', 7, true);
        //} else if(jan.body.velocity.x > 0){
          //  villain.animations.play('walkRight', 7, true);
        //}
        //else {
          //  villain.animations.play('walkDown', 7, true);
      //  }       
        
        //Check for collision with the character
        //  --Might just send this to a separate state? Not sure yet
        if(badHit){
            //Once hit, game over! Put some text up and prompt the player to restart the level
            jan.kill();
            bgMusic.pause();
            game.state.start('gameOver');
        }
         
        //Check for collision with trash ball children
        //  --Making these if-else if instead of just 4 if statements to avoid bad things happening if it hits two at once
            if(upBadCollide){
                //Move trash down
                trash.body.velocity.y = trashVelocity;
            }
            else if(downBadCollide){
                //Move trash up
                trash.body.velocity.y = trashVelocity * -1;
            }
            else if(leftBadCollide){
                //Move trash to the right
                trash.body.velocity.x = trashVelocity;
            }
            else if(rightBadCollide){
                //Move trash to the left
                trash.body.velocity.x = trashVelocity * -1;
            }
    }
//    
//    render: function() {
//        //game.debug.bodyInfo(jan, 32, 32);
//        game.debug.body(jan);
//        game.debug.body(trash);
//        game.debug.body(villain);
//        
//        //Every now and then, these don't look like they actually initialize?
//        //  Look into this later! I have no clue what causes this right now.
//        //  Nevermind! Changing the way the children were created fixed this!
//        game.debug.body(upChild);
//        game.debug.body(downChild);
//        game.debug.body(leftChild);
//        game.debug.body(rightChild);
//        
//        game.debug.body(goalLayer);
//    }
};

function playMonSound(){
 	monSound.play();
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

