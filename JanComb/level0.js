document.cookie = "level = 0"; 
var y = getCookie('level')

var blockLayer, goalLayer, jan, trash, stateText, villain;
var upChild, downChild, leftChild, rightChild;  //Children for the trash object
var velocity = 300;
var trashVelocity = 500; //Tweak as needed
//var dummyCounter = 0;   //Is this at all necessary? I don't even know why this was added in the first place
var monsterCounter = 0;
var broomCounter = 0;
var pullLimit = 40;

//Global variables to help determine when pushes/attacks need to happen
var isPushing = false;
var isAttacking = false;
//Global variable to determine which direction the trash will move in when pushed by the player
var trashDirection = 0;

demo.level0 = function(){};
demo.level0.prototype = {
	preload: function(){
        game.load.tilemap('levelZero', 'assets/tutorialNEW.json', null, Phaser.Tilemap.TILED_JSON); //New tilemap, smaller, different tileset used
        game.load.image('Floor Tiles', 'assets/protoTileSet.png');
        game.load.image('Floor Tiles 2', 'assets/newTiles.png');
        game.load.image('Goal Tiles', 'assets/goalTiles_TOGETHER.png');
        game.load.atlasJSONHash('jan', 'assets/janSpritesheet.png', 'assets/janSpritesheet.json');
        game.load.image('Trash', 'assets/paperBallRESIZED.png');
        game.load.spritesheet('villain', 'assets/villainSpritesheet.png', 300, 300);
        game.load.audio('bgMusic', 'assets/audio/CrEEP.mp3');
        game.load.audio('monSound', 'assets/audio/monsterSound.mp3');
        
        //Tutorial Sprite
        game.load.image('Tutorial', 'assets/TutorialSpriteOne.png');    //NEEDS TO BE REPLACED!!!
    },
    
	create: function(){
        //Set isAttacking and isPushing to false on level creation
        isAttacking = false;
        isPushing = false;
        
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
        
        //Create trash object
        trash = new Trash(200, 150);
        
        //Create monster
        villain = createMonster(300, 800);
        
        //Create janitor object
        janitor = new Janitor(130, 130);    //NEW
        //  --Holds reference to janitor bit of janitor object
        var jan = janitor.janitor;
		
	    //Audio stuff
	    // --Background music
        bgMusic = game.add.audio('bgMusic');
        //bgMusic.play();
        
        //  --Monster sounds
	    game.time.events.loop(Phaser.Timer.SECOND * getRandomInt(4,10), playMonSound, this); // starts loop
        monSound = game.add.audio('monSound');
        
        //Push callback function
        let D = game.input.keyboard.addKey(Phaser.Keyboard.D);
        D.onDown.add(function() {
            if (!isPushing){
                isPushing = true;
                janitor.pushBox.body.enable = true;
                switch (janitor.heading){
                    case 0:
                        jan.animations.play('pushRight', 5, false);
                        trashDirection = 0;
                        break;
                    case 1:
                        jan.animations.play('pushLeft', 5, false);
                        trashDirection = 1;
                        break;
                    case 2:
                        jan.animations.play('pushUp', 5, false);
                        trashDirection = 2;
                        break;
                    case 3:
                        jan.animations.play('pushDown', 5, false);
                        trashDirection = 3;
                        break;
                }

                var pshTimer = game.time.create(true);
                pshTimer.add(300, function (){
                    isPushing = false;
                    janitor.pushBox.body.enable = false;
                    janitor.pushBox.body.reset(0, 0);
                }, this);
                pshTimer.start();
            }
        });
        
        //Attack callback funciton
        let A = game.input.keyboard.addKey(Phaser.Keyboard.A);
        A.onDown.add(function() {
            if (!isAttacking){
                isAttacking = true;
                janitor.attackBox.body.enable = true;
                switch (janitor.heading){
                    case 0:
                        jan.animations.play('attackRight', 5, false);
                        break;
                    case 1:
                        jan.animations.play('attackLeft', 5, false);
                        break;
                    case 2:
                        jan.animations.play('attackUp', 5, false);
                        break;
                    case 3:
                        jan.animations.play('attackDown', 5, false);
                        break;
                }
                
                var atkTimer = game.time.create(true);
                atkTimer.add(300, function(){
                    isAttacking = false;
                    janitor.attackBox.body.enable = false;
                    janitor.attackBox.body.reset(0, 0);
                }, this);
                atkTimer.start();
            }
        });
        
    },
	update: function(){
        //Variable to hold current animation
        //  --All handled via function now (see bottom of file)
        setupUpdate(jan, trash, villain, blockLayer, goalLayer);
    },
    //DON'T DELETE THIS STUFF! Uncomment it all if you need to check what the trash is doing in regards to collision boxes and all that
    render: function(){
        game.debug.body(janitor.janitor);
        game.debug.body(janitor.pushBox);
        game.debug.body(janitor.attackBox);
    }
};

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
    //Holds reference to the janitor part of our janitor
    var jan = janitor.janitor;
    
    //Sets the body of the janitor based on its heading every frame
    //  --Probably really inefficient, but fuck it
    janitor.setBody(janitor.heading);
    
    //Collision stuff
    game.physics.arcade.collide(jan, blockLayer);
    game.physics.arcade.collide(trash.trash, blockLayer);
    game.physics.arcade.collide(trash.trash, goalLayer);
    game.physics.arcade.collide(villain, blockLayer);
    
    //Collision variables
    var hitGoal = game.physics.arcade.collide(trash.trash, goalLayer);
    var badHit = game.physics.arcade.collide(villain, jan);
    var hitWall = game.physics.arcade.collide(trash.trash, blockLayer);
    
    // Trash collision with player
    var upCollide = game.physics.arcade.collide(jan, trash.upChild); 
    var downCollide = game.physics.arcade.collide(jan, trash.downChild);
    var leftCollide = game.physics.arcade.collide(jan, trash.leftChild);
    var rightCollide = game.physics.arcade.collide(jan, trash.rightChild);
    var pushTrash = game.physics.arcade.overlap(janitor.pushBox, trash.trash);
    var attackHit = game.physics.arcade.overlap(janitor.attackBox, villain);
        
    // Trash collision with monster
    var upBadCollide = game.physics.arcade.collide(villain, trash.upChild);
    var downBadCollide = game.physics.arcade.collide(villain, trash.downChild);
    var leftBadCollide = game.physics.arcade.collide(villain, trash.leftChild);
    var rightBadCollide = game.physics.arcade.collide(villain, trash.rightChild);
    
    //Check to see if we need to push
    if (isPushing){
        //Set the pushBox to go outwards in the direciton the janitor is facign
        //  --Will also determing the direction that the trash will be pushed, if it hits
        switch(janitor.heading){
            case 0:
                janitor.pushBox.body.setSize(64, 64, 32, -10);
                trashDirection = 0;
                break;
            case 1:
                janitor.pushBox.body.setSize(64, 64, -64, -10);
                trashDirection = 1;
                break;
            case 2:
                janitor.pushBox.body.setSize(64, 64, -16, -80);
                trashDirection = 2;
                break;
            case 3:
                janitor.pushBox.body.setSize(64, 64, -16, 40);
                trashDirection = 3;
                break;
        }
    }
    
    //Check to see is we need to attack
    if (isAttacking){
        //Set the attackBox to go outwards in the direction that the janitor is facing
        switch(janitor.heading){
            case 0:
                janitor.attackBox.body.setSize(64, 64, 32, -10);
                break;
            case 1:
                janitor.attackBox.body.setSize(64, 64, -64, -10);
                break;
            case 2:
                janitor.attackBox.body.setSize(64, 64, -16, -80);
                break;
            case 3:
                janitor.attackBox.body.setSize(64, 64, -16, 40);
                break;
        }
    }
    
    //Janitor movement
    //  --Only allow movement if not pushing or attacking
    //  --This allows the animations to play out properly
    if (!isAttacking && !isPushing){
        if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
            jan.body.velocity.y = 0;
            jan.body.velocity.x = velocity;
            jan.animations.play('walkRight', 7, false);
            janitor.setHeading(0); 
        }
        else if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
            jan.body.velocity.y = 0;
            jan.body.velocity.x = velocity * -1;
            jan.animations.play('walkLeft', 7, false);
            janitor.setHeading(1);
        }
        else if(game.input.keyboard.isDown(Phaser.Keyboard.UP)){
            jan.body.velocity.x = 0;
            jan.body.velocity.y = velocity * -1;
            jan.animations.play('walkUp', 7, false);
            janitor.setHeading(2);
        }
        else if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
            jan.body.velocity.x = 0;
            jan.body.velocity.y = velocity;
            jan.animations.play('walkDown', 7, false);
            janitor.setHeading(3);
        }
        //  --When there's no movement, set the frame to where the janitor was last facing and zero out velocity
        else{
            if (janitor.heading == 0){
                jan.frame = 10;
            }
            else if (janitor.heading == 1){
                jan.frame = 5;
            }
            else if (janitor.heading == 2){
                jan.frame = 15;
            }
            else if (janitor.heading == 3){
                jan.frame = 0;
            }
            jan.body.velocity.x = 0;
            jan.body.velocity.y = 0;
        }
    }
    
    //Trash movement
    //  --Push
    if (pushTrash){
        switch(trashDirection){
            case 0:
                trash.trash.body.velocity.x = trashVelocity;
                break;
            case 1:
                trash.trash.body.velocity.x = trashVelocity * -1;
                break;
            case 2:
                trash.trash.body.velocity.y = trashVelocity * -1;
                break;
            case 3:
                trash.trash.body.velocity.y = trashVelocity;
                break;
        }
    }
    
    //  --Pull
    if(game.input.keyboard.isDown(Phaser.Keyboard.S)){
        if(upCollide && totalMove < pullLimit){	// pull trash up
            trash.trash.position.y = trash.trash.position.y - 5;
            game.physics.arcade.collide(jan, blockLayer);
            totalMove++;
        }
        else if(downCollide && totalMove < pullLimit){	// pull trash down
            trash.trash.position.y = trash.trash.position.y + 5;
            game.physics.arcade.collide(jan, blockLayer);
            totalMove++;
        }
        else if(leftCollide && totalMove < pullLimit){	// pull trash left
            trash.trash.position.x = trash.trash.position.x - 5;
            game.physics.arcade.collide(jan, blockLayer);
            totalMove++;
        }
        else if(rightCollide && totalMove < pullLimit){	// pull trash right
            trash.trash.position.x = trash.trash.position.x + 5;
            game.physics.arcade.collide(jan, blockLayer);
            totalMove++;
        }
    }
    //Attack
    //  --On monster hit, set monsterCounter to 72
    if (attackHit){
        monsterCounter = 72;
        console.log('Hit detected!');
    }
    

    //Restarting the Level
    if (game.input.keyboard.isDown(Phaser.Keyboard.R)){
        //Set isPushing and isAttacking to false first
        isAttacking = false;
        isPushing = false;
        
        totalMove = 0;
        var x = getCookie("level")
        game.state.start("level"+ x); 
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
    //  --Play animations for monster movement
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
    //  --If the monster gets hit, stop velocity for 72 frames (~3 seconds)
    if (monsterCounter > 0){
        console.log(monsterCounter);
        villain.body.velocity.setTo(0, 0);
        monsterCounter--;
    }
    //  --Move the monster towards the player
    if (monsterCounter == 0){
        game.physics.arcade.moveToObject(villain, jan, 75);        
    }
    
    // Check for collision with janitor
    if(badHit){
        //Set isPushing and isAttacking to false first
        isPushing = false;
        isAttacking = false;
        
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

//Janitor object
function Janitor(spawnX, spawnY){
    //FUNCTIONS
    //Create main janitor sprite
    this.createJanitor = function(x, y){
        //Initialize sprite, enable physics, set collision with world bounds, and center anchor point
        var jan = game.add.sprite(x, y, 'jan');
        jan.anchor.setTo(0.5, 0.5);
        game.physics.enable(jan);
        jan.body.setSize(28, 28, 12, 32);    //Tweak this after setting up animations
        jan.body.collideWorldBounds = true;
        //Add animations v2
        //Walking animations
        jan.animations.add('walkRight', [10, 11]);
        jan.animations.add('walkLeft', [5, 6]);
        jan.animations.add('walkUp', [15, 16]);
        jan.animations.add('walkDown', [0, 1]);
        //Push animations
        jan.animations.add('pushRight', [12, 13]);
        jan.animations.add('pushLeft', [7, 8]);
        jan.animations.add('pushUp', [17, 18]);
        jan.animations.add('pushDown', [2, 3]);
        //Attack animations
        jan.animations.add('attackRight', [10, 14]);
        jan.animations.add('attackLeft', [5, 9]);
        jan.animations.add('attackUp', [15, 19]);
        jan.animations.add('attackDown', [0, 4]);
        return jan;
    }
    //Other functions
    //Sets the 'heading' variable of the janitor
    //  --0 if facing right, 1 left, 2 up, 3 down
    //  --Used to determine which push/attack to use when the button is pressed
    this.setHeading = function(num){
        this.heading = num;
    }
    
    //Sets the body of the janitor sprite based on heading
    //  --Spritesheet is weird, so this makes the hitbox make some amount of sense
    this.setBody = function(heading){
        switch(heading){
            case 0:
                this.janitor.body.setSize(28, 28, 12, 32);
                break;
            case 1:
                this.janitor.body.setSize(28, 28, 8, 32);
                break;
            case 2:
                this.janitor.body.setSize(28, 28, -4, 36);
                break;
            case 3:
                this.janitor.body.setSize(28, 28, -4, 40);
                break;
        }
    }

    //Create janitor sprite
    this.janitor = this.createJanitor(spawnX, spawnY);
    
    //Create hitboxes group
    //  --This houses the pushBox and attackBox
    this.hitboxes = game.add.group();
    this.hitboxes.enableBody = true;
    //Child the hitboxes group to the janitor
    this.janitor.addChild(this.hitboxes);
    //  --Push hitbox
    this.pushBox = this.hitboxes.create(0, 0, null);
    this.pushBox.anchor.setTo(0.5, 0.5);
    this.pushBox.body.onOverlap = new Phaser.Signal();
    this.pushBox.body.enable = false;   //Disable the body by default
    //  --Attack hitbox
    this.attackBox = this.hitboxes.create(0, 0, null);
    this.attackBox.anchor.setTo(0.5, 0.5);
    this.attackBox.body.onOverlap = new Phaser.Signal();
    this.attackBox.body.enable = false;
    
    //Create a 'heading' variable, use to determine directions of actions
    this.heading = 0;

}
