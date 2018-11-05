var demo = {};
document.cookie = "level = 0"; 
var y = getCookie('level')

var blockLayer, goalLayer, jan, trash, stateText, villain;
var upChild, downChild, leftChild, rightChild;  //Children for the trash object
var velocity = 300;
var trashVelocity = 500; //Tweak as needed
var dummyCounter = 0;   //Is this at all necessary? I don't even know why this was added in the first place

demo.level0 = function(){};
demo.level0.prototype = {
	preload: function(){
        game.load.tilemap('levelZero', 'assets/tutorialNEW.json', null, Phaser.Tilemap.TILED_JSON); //New tilemap, smaller, different tileset used
        game.load.image('Floor Tiles', 'assets/protoTileSet.png');
        game.load.image('Floor Tiles 2', 'assets/newTiles.png');
        game.load.image('Goal Tiles', 'assets/goalTiles_TOGETHER.png');
        game.load.spritesheet('jan', 'assets/characterSpriteSheetNEW.png', 230, 405);
        game.load.image('Trash', 'assets/paperBallRESIZED.png');
        game.load.spritesheet('villain', 'assets/trashMonsterSpritesheet.png', 300, 300);
        game.load.audio('bgMusic', 'assets/audio/CrEEP.mp3');
        game.load.audio('monSound', 'assets/audio/monsterSound.mp3');
        
        //Tutorial Sprite
        game.load.image('Tutorial', 'assets/TutorialSpriteOne.png');
    },
    
	create: function(){
	   //Start Physics
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        //Add tilemap and layers to state
        var map = game.add.tilemap('levelZero');
        map.addTilesetImage('Floor Tiles');
        map.addTilesetImage('Floor Tiles 2');
        map.addTilesetImage('Goal Tiles');
        var baseLayer = map.createLayer('Floor');
        blockLayer = map.createLayer('Blocks');
        goalLayer = map.createLayer('Goal');
        
        //Set collision on the 'Blocks' layer
        map.setCollisionBetween(2, 7, true, 'Blocks');
        map.setCollisionBetween(4, 4, true, 'Goal');
        
        // Trash stuff
        //  All handled via an object now (see bottom of file)
        trash = new Trash(200, 150);
        
        // Everything trash monster
	    // All handled via a function (see bottom of file)
        villain = createMonster(300, 800);
        
        
        // Everything janitor
        //  All done via a function (which can be used in any subsesquent levels as well)
        jan = createJanitor(130, 130)
        
	    
		
	    // Audio stuff
	    // Background
        bgMusic = game.add.audio('bgMusic');
        bgMusic.play();
        // Monster sound
	    game.time.events.loop(Phaser.Timer.SECOND * getRandomInt(4,10), playMonSound, this); // starts loop
        monSound = game.add.audio('monSound');
        
        //Tutorial Sprite
        var tutorial = game.add.sprite(0, 568, 'Tutorial');
    },
	update: function(){
     	//Variable to hold current animation
        //  --All handled via function now (see bottom of file)
        setupUpdate(jan, trash, villain, blockLayer, goalLayer);
    },
    //DON'T DELETE THIS STUFF! Uncomment it all if you need to check what the trash is doing in regards to collision boxes and all that
    render: function(){
//        game.debug.body(trash.trash);
//        game.debug.body(trash.leftChild);
//        game.debug.body(trash.rightChild);
//        game.debug.body(trash.upChild);
//        game.debug.body(trash.downChild);
    }
};

// Creates janitor
//  --This isn't an object right now, and I don't think it needs to be one, but it might be cleaner if it was? Just a thought
function createJanitor(spawnX, spawnY){
    var jan;
    
    //Create player, set scale and collision
    jan = game.add.sprite(spawnX, spawnY,'jan');
    jan.anchor.setTo(0.5,0.5);
    jan.scale.setTo(0.25, 0.25);
    game.physics.enable(jan);
    jan.body.setSize(128, 128, 50, 270);
    jan.body.collideWorldBounds = true;
    
    //Add animations
    jan.animations.add('walkUp', [16, 15]);
    jan.animations.add('walkDown', [1, 0]);
    jan.animations.add('walkLeft', [6, 5]);
    jan.animations.add('walkRight', [11, 10]);
    jan.animations.add('pushUp', [18]);
    jan.animations.add('pushDown', [3, 4]);
    jan.animations.add('pushLeft', [8, 9]);
    jan.animations.add('pushRight', [13, 14]);
    
    return jan;
}

// Creates villain
function createMonster(spawnX, spawnY){
    var monster;
    
    //Create monster, set scale and collision
    monster = game.add.sprite(spawnX, spawnY, 'villain'); 
    monster.anchor.setTo(0.5,0.5);
    monster.scale.setTo(0.2,0.2);
    game.physics.enable(monster);
    monster.body.setSize(225, 225, 40, 75);
    monster.body.collideWorldBounds = true;
    
    //Add animations
    monster.animations.add('walkRight', [6,7]);
    monster.animations.add('walkLeft', [0,1]);
    monster.animations.add('walkUp', [5]);
    monster.animations.add('walkDown', [2,3,2,4]);
    
    return monster;
}

// Plays monster sounds
function playMonSound(){
 	monSound.play();
}

// Function to get random integers
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

// Update setup function
//  --Should hold damn near everything needed in the update loop
function setupUpdate(jan, trash, villain, blockLayer, goalLayer){
    var hitGoal = game.physics.arcade.collide(trash.trash, goalLayer);
    var badHit = game.physics.arcade.collide(villain, jan);
    var hitWall = game.physics.arcade.collide(trash.trash, blockLayer);
        
    // Basic collisions
    game.physics.arcade.collide(jan, blockLayer);
    game.physics.arcade.collide(trash.trash, blockLayer);
    game.physics.arcade.collide(trash.trash, goalLayer)
    game.physics.arcade.collide(villain, blockLayer)
        
    // Trash collision with player
    var upCollide = game.physics.arcade.collide(jan, trash.upChild); 
    var downCollide = game.physics.arcade.collide(jan, trash.downChild);
    var leftCollide = game.physics.arcade.collide(jan, trash.leftChild);
    var rightCollide = game.physics.arcade.collide(jan, trash.rightChild);
        
    // Trash collision with monster
    var upBadCollide = game.physics.arcade.collide(villain, trash.upChild);
    var downBadCollide = game.physics.arcade.collide(villain, trash.downChild);
    var leftBadCollide = game.physics.arcade.collide(villain, trash.leftChild);
    var rightBadCollide = game.physics.arcade.collide(villain, trash.rightChild);
    
    // Janitor movement
    if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
        jan.body.velocity.y = 0;
        jan.body.velocity.x = velocity;
        jan.animations.play('walkRight', 7, false);
    }
    else if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
        jan.body.velocity.y = 0;
        jan.body.velocity.x = velocity * -1;
        jan.animations.play('walkLeft', 7, false);
    }
    else if(game.input.keyboard.isDown(Phaser.Keyboard.UP)){
        jan.body.velocity.x = 0;
        jan.body.velocity.y = velocity * -1;
        jan.animations.play('walkUp', 7, false);
    }
    else if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
        jan.body.velocity.x = 0;
        jan.body.velocity.y = velocity;
        jan.animations.play('walkDown', 7, false);
    }
    else{
//        jan.animations.stop();
//        jan.frame = 0
//        currentAnim = jan.animations.currentAnim.name;
//        while (jan.animations.currentAnim.isFinished)
        jan.body.velocity.x = 0;
        jan.body.velocity.y = 0;
    }
    
    // Trash monster movement
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
    // Now collisions
        if(upCollide){	// move trash down
            jan.animations.play('pushDown', 1, false); 
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
//        else{
//            jan.animations.play('pushDown', 3, false);
//        }
    }
    
    // PULL
    // Check to see if the 'F' key is pressed...
    if(game.input.keyboard.isDown(Phaser.Keyboard.F)){
        console.log(totalMove)
        if(upCollide && totalMove < 40){	// pull trash up
            trash.trash.position.y = trash.trash.position.y - 5;
            game.physics.arcade.collide(jan, blockLayer);
            totalMove++;
        }
        else if(downCollide && totalMove < 40){	// pull trash down
            trash.trash.position.y = trash.trash.position.y + 5;
            game.physics.arcade.collide(jan, blockLayer);
            totalMove++;
        }
        else if(leftCollide && totalMove < 40){	// pull trash left
            trash.trash.position.x = trash.trash.position.x - 5;
            game.physics.arcade.collide(jan, blockLayer);
            totalMove++;
        }
        else if(rightCollide && totalMove < 40){	// pull trash right
            trash.trash.position.x = trash.trash.position.x + 5;
            game.physics.arcade.collide(jan, blockLayer);
            totalMove++;
        }
    }
    
    // Goal Detection
    // Ends level once the trash ball hits the goal area
    if(hitGoal){
        trash.trash.kill();
        bgMusic.stop();	// stop background music
        totalMove = 0;
        game.state.start('nextLevel');     
    }
    
    // Monster actions
    // Moves trash monster continuously towards the janitor
    game.physics.arcade.moveToObject(villain, jan, 75);
    
    // Check for collision with janitor
    if(badHit){
        jan.kill();
        bgMusic.stop();	// stop background music
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
    else if(leftBadCollide){	// move trash to the right
        trash.trash.body.velocity.x = trashVelocity;
    }
    else if(rightBadCollide){	// move trash to the left
        trash.trash.body.velocity.x = trashVelocity * -1;
    }
}

// Checks overlap between sprites
//  --NOT CURRENTLY BEING USED
function checkOverlap(spriteA, spriteB) {
	var boundsA = spriteA.getBounds();
    	var boundsB = spriteB.getBounds();
	return Phaser.Rectangle.intersects(boundsA, boundsB);
}

// Gets the cookie for level chaning purposes
function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
}

//Objects
//Trash object -- THIS CAN CARRY OVER TO OTHER LEVELS!(!!!)
function Trash(spawnX, spawnY){
    //Functions to create trash and children
    this.createTrash = function(x, y) {
        var trash = game.add.sprite(x, y, 'Trash');
        game.physics.enable(trash);
        trash.body.collideWorldBounds = true;
        
        return trash;
    }
    this.createChild = function(direction, parent) {
        var child;
        switch(direction){
            case 'left':
                child = parent.addChild(game.make.sprite(-35, 0));
                game.physics.enable(child);
                child.body.setSize(10, 15, 26, 5);
                child.body.moves = false;
                break;
            case 'right':
                child = parent.addChild(game.make.sprite(35, 0));
                game.physics.enable(child);
                child.body.setSize(10, 15, -13, 5);
                child.body.moves = false;
                break;
            case 'up':
                child = parent.addChild(game.make.sprite(0, -35));
                game.physics.enable(child);
                child.body.setSize(15, 10, 5, 26);
                child.body.moves = false;
                break;
            case 'down':
                child = parent.addChild(game.make.sprite(0, 35));
                game.physics.enable(child);
                child.body.setSize(15, 10, 5, -13);
                child.body.moves = false;
                break;
            default:
                console.log('Please enter \'up\', \'down\', \'left\', or \'right\'');
        }
        return child;
    }
    //Giving the object actual properties to work with
    this.trash = this.createTrash(spawnX, spawnY);
    this.leftChild = this.createChild('left', this.trash);
    this.rightChild = this.createChild('right', this.trash);
    this.upChild = this.createChild('up', this.trash);
    this.downChild = this.createChild('down', this.trash);
}
