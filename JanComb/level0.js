var demo = {};
document.cookie = "level = 0"; 

var blockLayer, goalLayer, jan, trash, stateText, villain;
var upChild, downChild, leftChild, rightChild;  //Children for the trash object
var velocity = 300;
var trashVelocity = 500; //Tweak as needed
var dummyCounter = 0;   //Is this at all necessary? I don't even know why this was added in the first place

demo.level0 = function(){};
demo.level0.prototype = {
	preload: function(){
        game.load.tilemap('levelZero', 'assets/tutorialLevelMap.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('Tiles', 'assets/protoTileSet.png');
        game.load.spritesheet('jan', 'assets/characterSpritesheet.png', 230, 405);
        //game.load.spritesheet('jan', 'assets/characterSpriteSheetNEW.png', 230, 405);
        game.load.image('Trash', 'assets/paperBall.png'); // for now
        game.load.spritesheet('villain', 'assets/villainSpritesheet.png', 300, 300);
        
        game.load.audio('bgMusic', 'assets/audio/CrEEP.mp3');
	game.load.audio('monSound', 'assets/audio/qubodup-BigMonster01.flac');
        
	game.load.audio('monSound', 'assets/qubodup-BigMonster01.flac');
    },
    
	create: function(){
        //Start Physics
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
	    game.time.events.loop(Phaser.Timer.SECOND * getRandomInt(20,25), playMonSound, this);
        
        //Add tilemap and layers to state
        var map = game.add.tilemap('levelZero');
        map.addTilesetImage('Tiles');
        
        var baseLayer = map.createLayer('Floor');
        blockLayer = map.createLayer('Blocks');
        goalLayer = map.createLayer('Goal');
        
        //Set collision on the 'Blocks' layer
        map.setCollisionBetween(2, 2, true, 'Blocks');
        map.setCollisionBetween(3, 3, true, 'Goal');
        
        //MIGHT need to uncomment this to have some detection when the block hits the goal area
        //map.setCollisonBetween(3, 3, true, 'Goal');
        
        //janitor sprite creation and size 
        jan = game.add.sprite(130, 130,'jan');
        
        jan.anchor.setTo(0.5,0.5);
        jan.scale.setTo(0.25, 0.25);
        
        //letting jan be able to collide
        //  See about either making the player smaller or restricting the hitbox to the feet only.
        //  Latter is probably the better thing to do, but it might also be more of a pain in the ass
        game.physics.enable(jan);
        jan.body.setSize(128, 128, 50, 270);
	    jan.body.collideWorldBounds = true;
        //This kinda break the hitboxes on the trash ball. Maybe rethink how to handle collision detection there entirely? Look into scrapping physics on the trash ball children entirely
        //jan.body.immovable = true;  //maybe this'll not break the pull?
        
        //Add animations
        jan.animations.add('walkRight', [7, 6, 8, 6]);
        jan.animations.add('walkLeft', [4, 3, 5, 3]);
        jan.animations.add('walkUp', [10, 9, 11, 9]);
        jan.animations.add('walkDown', [1, 0, 2, 0]);
        
        //ALL OBSOLETE, HANDLED WITH FUNCTION NOW
        
        //trash = game.add.sprite(500, 100, 'Trash');
	    //trash.scale.setTo(0.5, 0.5);
		
	    // Enable trash physics and stuff
        
        //Trying to make the ball only be moved when you hit a button...
        //  Idea is to surround the ball with empty collision boxes, and enable a 'push' action when you're in one of those boxes
        //  Add empty child sprites to the main trash ball? Also, moving the trash creation to its own function to make things cleaner later
        //game.physics.enable(trash);
        //trash.body.bounce.setTo(0.3);   // Can change later
        //trash.body.collideWorldBounds = true;
        
        bgMusic = game.add.audio('bgMusic');
        bgMusic.play();
        
        //Handles everything done above
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
        //villain.frame = 2;
        
        var hitGoal = game.physics.arcade.collide(trash, goalLayer);
        var badHit = game.physics.arcade.collide(villain, jan);
        
        game.physics.arcade.collide(jan, blockLayer);
        game.physics.arcade.collide(trash, blockLayer);
        //game.physics.arcade.collide(trash, jan);  //Disabling for now, hopefully will be off for the remainder of the project!
        game.physics.arcade.collide(trash, goalLayer)
        game.physics.arcade.collide(villain, blockLayer)
        //game.physics.arcade.collide(villain,trash); //Disabling for now, using the children laid out below to check for collision now
        //game.physics.arcade.collide(villain, goalLayer); //Don't need this one, I think?
        
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
		//villain.animations.play('walkRight', 7, true);
		}
		else if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
			//jan.scale.setTo(-0.2, 0.2);
            jan.body.velocity.y = 0;
			jan.body.velocity.x = velocity * -1;
            jan.animations.play('walkLeft', 7, true);
		//villain.animations.play('walkLeft', 7, true);
		}

		else if(game.input.keyboard.isDown(Phaser.Keyboard.UP)){
            //jan.scale.setTo(0.2, 0.2);
            jan.body.velocity.x = 0;
			jan.body.velocity.y = velocity * -1;
            jan.animations.play('walkUp', 7, true);
	//villain.animations.play('walkUp', 7, true);
			
		}
		else if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
            //jan.scale.setTo(0.2, 0.2);
            jan.body.velocity.x = 0;
			jan.body.velocity.y = velocity;
            jan.animations.play('walkDown', 7, true);
	//villain.animations.play('walkDown', 7, true);
		}
	   
        else{
            jan.animations.stop();
            jan.frame = 0
            jan.body.velocity.x = 0;
            jan.body.velocity.y = 0;
        }
		
	 if(villain.body.velocity.y < 0){
             villain.animations.play('walkUp', 7, true);
        }
        else if(villain.body.velocity.x < 0){
            villain.animations.play('walkLeft', 7, true);
        } else if(villain.body.velocity.x > 0){
            villain.animations.play('walkRight', 7, true);
        }
        else {
            villain.animations.play('walkDown', 7, true);
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
                
                //Move trash down
                trash.body.velocity.y = trashVelocity;
            }
            else if(downCollide){
                //PUSH_UP ANIMATION GOES HERE
                
                //Move trash up
                trash.body.velocity.y = trashVelocity * -1;
            }
            else if(leftCollide){
                //PUSH_RIGHT ANIMATION GOES HERE
                
                //Move trash to the right
                trash.body.velocity.x = trashVelocity;
            }
            else if(rightCollide){
                //PUSH_LEFT ANIMATION GOES HERE
                
                //Move trash to the left
                trash.body.velocity.x = trashVelocity * -1;
            }
            else{
                //PUSH_BAD ANIMATION GOES HERE
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
            bgMusic.stop();
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
        
        //Check for collision with the character
        //  --Might just send this to a separate state? Not sure yet
        if(badHit){
            //Once hit, game over! Put some text up and prompt the player to restart the level
            jan.kill();
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
    },
    
    render: function() {
        //game.debug.bodyInfo(jan, 32, 32);
        game.debug.body(jan);
        game.debug.body(trash);
        game.debug.body(villain);
        
        //Every now and then, these don't look like they actually initialize?
        //  Look into this later! I have no clue what causes this right now.
        //  Nevermind! Changing the way the children were created fixed this!
        game.debug.body(upChild);
        game.debug.body(downChild);
        game.debug.body(leftChild);
        game.debug.body(rightChild);
        
        game.debug.body(goalLayer);
    }
};

function createTrash(spawnX, spawnY){
    var trash;
    
    trash = game.add.sprite(spawnX, spawnY, 'Trash');
    trash.scale.setTo(0.5, 0.5);
    
    game.physics.enable(trash);
    //trash.body.bounce.setTo(0.05);   // Can change later, probably don't want any bounce in the end?
    trash.body.collideWorldBounds = true;
    
    return trash;
}

function playMonSound(){  
  	monSound = game.add.audio('monSound');
 	monSound.play();
}
	
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
//Might need to COPMLETELY rework how this is handled
//  -Currently, these children all have physics enabled to make collision possible
//      -It kind of works, but can be a bit wonky, especially if you're looking at the debug info on the bodies of the children
//      -It straight up breaks once you make the player an immovable object. The bodies on all the objects clash, and you lose the ability to dictate which direction the push will be applied in
//  -Instead, I think that its better to use the isOverlapping (or whatever it's called) function that comes with the sprite object
//      -That'll let us check if the player is overlapping with the child sprite without messing with physics enabled bodies moving everywhere
//      -Mostly, this'll make a pull action more viable, as it'll (hopefully) allow the ball to pass through the player without breaking everything (as it does now)
function addChildSprite(parent, direction){
    var child;
    //I have no clue why I have to fudge these numbers to make it work.
    var currentX = parent.body.x - 208;
    var currentY = parent.body.y - 158;
    
    switch(direction){
        case 'left':
            child = parent.addChild(game.make.sprite(currentX - 62, currentY));
            game.physics.enable(child);
            //Set the body of the child sprite to just barely surround the parent.
            //Might make these even smaller later to make things better
            child.body.setSize(10, 30, 22, 1);
            child.body.moves = false;
            break;
        case 'right':
            child = parent.addChild(game.make.sprite(currentX + 62, currentY));
            game.physics.enable(child);
            child.body.setSize(10, 30, 0, 1);
            child.body.moves = false;
            break;
        case 'up':
            child = parent.addChild(game.make.sprite(currentX, currentY - 62));
            game.physics.enable(child);
            child.body.setSize(30, 10, 1, 22);
            child.body.moves = false;
            break;
        case 'down':
            child = parent.addChild(game.make.sprite(currentX, currentY + 62));
            game.physics.enable(child);
            child.body.setSize(30, 10, 1, 0);
            child.body.moves = false;
            break;
        default:
            console.log('Please enter \'up\', \'down\', \'left\', or \'right\'');
    }
    return child;
}