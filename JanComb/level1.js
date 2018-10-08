var demo = {};

var blockLayer, goalLayer, jan, trash, stateText, villain;
var upChild, downChild, leftChild, rightChild;  //Children for the trash object
var velocity = 300;
var trashVelocity = 500;    //Tweak as needed

demo.level1 = function(){};
demo.level1.prototype = {
	preload: function(){
        game.load.tilemap('levelOne', 'assets/levelMap.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('Tiles', 'assets/protoTileSet.png');
        game.load.spritesheet('jan', 'assets/characterSpritesheet.png', 230, 405);
        game.load.image('Trash', 'assets/paperBall.png'); // for now
        game.load.spritesheet('villain', 'assets/villainSpritesheet.png', 300,300,6);
        
		
    },
	create: function(){
        //Start Physics
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        //Add tilemap and layers to state
        var map = game.add.tilemap('levelOne');
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
        jan.scale.setTo(0.2, 0.2);
        
        //letting jan be able to collide
        //  See about either making the player smaller or restricting the hitbox to the feet only.
        //  Latter is probably the better thing to do, but it might also be more of a pain in the ass
        game.physics.enable(jan);
        jan.body.setSize(128, 128, 32, 256);
	    jan.body.collideWorldBounds = true;
        
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
        
        //Handles everything done above
        trash = createTrash(200, 100);
        //Add children to trash
        upChild = addChildSprite(trash, 'up');
        downChild = addChildSprite(trash, 'down');
        leftChild = addChildSprite(trash, 'left');
        rightChild = addChildSprite(trash, 'right');
        
        villain = game.add.sprite(300,300,'villain');
        
        villain.anchor.setTo(0.5,0.5);
        villain.scale.setTo(0.2,0.2);
        
        game.physics.enable(villain);
        villain.body.setSize(128,128,32,256);
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
        
        var hitGoal = game.physics.arcade.collide(trash, goalLayer);
        
        game.physics.arcade.collide(jan, blockLayer);
        game.physics.arcade.collide(trash, blockLayer);
        game.physics.arcade.collide(trash, jan);  //Disabling for now, hopefully will be off for the remainder of the project!
        game.physics.arcade.collide(trash, goalLayer)
        game.physics.arcade.collide(villain, jan);
        game.physics.arcade.collide(villain,trash);
        game.physics.arcade.collide(villain, goalLayer);
        
        //Variables to check collision with trash children
        var upCollide = game.physics.arcade.collide(jan, upChild);
        var downCollide = game.physics.arcade.collide(jan, downChild);
        var leftCollide = game.physics.arcade.collide(jan, leftChild);
        var rightCollide = game.physics.arcade.collide(jan, rightChild);
        
        //Movement stuff
        //  Maybe set x velocity to 0 when moving up/down, and vice versa? Could help with movement weirdness
        if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
			//jan.scale.setTo(0.2, 0.2);
            jan.body.velocity.y = 0;
			jan.body.velocity.x = velocity;
            jan.animations.play('walkRight', 7, true);
		}
		else if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
			//jan.scale.setTo(-0.2, 0.2);
            jan.body.velocity.y = 0;
			jan.body.velocity.x = velocity * -1;
            jan.animations.play('walkLeft', 7, true);
		}

		else if(game.input.keyboard.isDown(Phaser.Keyboard.UP)){
            //jan.scale.setTo(0.2, 0.2);
            jan.body.velocity.x = 0;
			jan.body.velocity.y = velocity * -1;
            jan.animations.play('walkUp', 7, true);
			
		}
		else if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
            //jan.scale.setTo(0.2, 0.2);
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
                
                //Moce trash to the left
                trash.body.velocity.x = trashVelocity * -1;
            }
            else{
                //PUSH_BAD ANIMATION GOES HERE
            }
        }
        
        if(hitGoal){
            trash.kill();
            stateText.text = " Level Complete, \n Click to restart";
            stateText.visible = true;
        }
        

    },
    
    render: function() {
        //game.debug.bodyInfo(jan, 32, 32);
        game.debug.body(jan);
        game.debug.body(trash);
        
        //Every now and then, these don't look like they actually initialize?
        //  Look into this later! I have no clue what causes this right now.
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
//    trash.body.bounce.setTo(0.3);   // Can change later, probably don't want any bounce in the end?
    trash.body.collideWorldBounds = true;
    
    return trash;
}

function addChildSprite(parent, direction){
    var child;
    var currentX = parent.x - 208;
    var currentY = parent.y - 110;
    
    switch(direction){
        case 'left':
            child = parent.addChild(game.make.sprite(currentX - 62, currentY));
            game.physics.enable(child);
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



