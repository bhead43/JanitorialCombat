document.cookie = "level = 0"; 
var y = getCookie('level')

var blockLayer, goalLayer, jan, trash, stateText, villain;
var upChild, downChild, leftChild, rightChild;  //Children for the trash object
var velocity = 300;
var trashVelocity = 500; //Tweak as needed
var dummyCounter = 0;   //Is this at all necessary? I don't even know why this was added in the first place
var monsterCounter = 0;
var broomCounter = 0;
var pullLimit = 40;

var isPushing = false;
var isAttacking = false;
var trashDirection = 0;

//Variable for pausing
var pause;
var isPaused = false;

demo.level0 = function(){};
demo.level0.prototype = {
	preload: function(){
        game.load.tilemap('levelZero', 'assets/LevelZero.json', null, Phaser.Tilemap.TILED_JSON); //New tilemap, smaller, different tileset used
        //game.load.image('Floor Tiles', 'assets/protoTileSet.png');
        game.load.image('Floor Tiles', 'assets/path (38).png');
        //game.load.image('Floor Tiles 2', 'assets/newTiles.png');
        game.load.image('Floor Tiles w Shadows', 'assets/shadow.png');
        //game.load.image('Goal Tiles', 'assets/goalTiles_TOGETHER.png');
        game.load.image('Goal Tiles', 'assets/GOAL.png');
        game.load.image('Block Tiles Ceiling', 'assets/path (34) (5).png');
        game.load.image('Block Tiles Brick', 'assets/brick wall proto.png');
        //game.load.spritesheet('jan', 'assets/characterSpriteSheetNEW.png', 230, 405);
        //game.load.spritesheet('jan', 'assets/Spritesheet_SUPERNEW.png', 98, 102, 20);
        game.load.atlasJSONHash('jan', 'assets/janSpritesheet.png', 'assets/janSpritesheet.json');
        game.load.image('Trash', 'assets/paperBallRESIZED.png');
        game.load.spritesheet('villain', 'assets/villainSpritesheet.png', 300, 300);
        game.load.audio('bgMusic', 'assets/audio/CrEEP.mp3');
        game.load.audio('monSound', 'assets/audio/monsterSound.mp3');
	game.load.audio('hitSound', 'assets/audio/hitSound.mp3');
        
        //Tutorial Sprite
        //game.load.image('Tutorial', 'assets/TutorialSpriteOne.png');
        
        //Placeholder sprite for broom
        game.load.image('broom', 'assets/broom_PLACEHOLDER.png');
        
        //Pause sprite
        game.load.image('pause', 'assets/pauseScreen.png');
		
		
		
    },
    
	create: function(){
        //Start Physics
        game.physics.startSystem(Phaser.Physics.ARCADE);
        isPushing = false;
        isAttacking = false;
        
        //Add tilemap and layers to state
        var map = game.add.tilemap('levelZero');
        map.addTilesetImage('Floor Tiles');
        map.addTilesetImage('Floor Tiles w Shadows');
        map.addTilesetImage('Block Tiles Ceiling');
        map.addTilesetImage('Block Tiles Brick');	
        map.addTilesetImage('Goal Tiles');
        var baseLayer = map.createLayer('Floor');
        blockLayer = map.createLayer('Blocks');
        goalLayer = map.createLayer('Goal');
        
        //Set collision on the 'Blocks' layer
        map.setCollisionBetween(5, 6, true, 'Blocks');
        map.setCollisionBetween(16, 16, true, 'Goal');
        
        // Everything janitor
        //  All done via a function (which can be used in any subsesquent levels as well)
       
        
        // Trash stuff
        //  All handled via an object now (see bottom of file)
        trash = new Trash(200, 150);
        
	    // Everything trash monster
	    // All handled via a function (see bottom of file)
        villain = createMonster(300, 800);
        
        //jan = createJanitor(130, 130) //OLD
        janitor = new Janitor(130, 130);    //NEW
        var jan = janitor.janitor;
		
	    // Audio stuff
	    // Background
        bgMusic = game.add.audio('bgMusic');
        bgMusic.play();
        // Monster sound
	    game.time.events.loop(Phaser.Timer.SECOND * getRandomInt(4,10), playMonSound, this); // starts loop
        monSound = game.add.audio('monSound');
        
        let D = game.input.keyboard.addKey(Phaser.Keyboard.D);
        D.onDown.add(function() {
            if (!isPushing){
                isPushing = true;
                janitor.pushBox.body.enable = true;
                //Set Janitor's velocity to 0 before starting push
                janitor.janitor.body.velocity.setTo(0, 0);
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

                var atkTimer = game.time.create(true);
                atkTimer.add(300, function (){
                    isPushing = false;
                    janitor.pushBox.body.enable = false;
                }, this);
                atkTimer.start();
            }
        });
        
        let A = game.input.keyboard.addKey(Phaser.Keyboard.A);
        A.onDown.add(function() {
            if (!isAttacking){
                isAttacking = true;
                janitor.attackBox.body.enable = true;
                //Set Janitor's velocity to 0 before starting push
                janitor. janitor.body.velocity.setTo(0, 0);
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
                atkTimer.add(300, function (){
                    isAttacking = false;
                    janitor.attackBox.body.enable = false;
                }, this);
                atkTimer.start();
            }
        }, this);
        
        //Callback function to handle pausing
        let P = game.input.keyboard.addKey(Phaser.Keyboard.P);
        P.onDown.add(function() {
            if (!isPaused){
                isPaused = true;
                pause = game.add.sprite(0, 0, 'pause');
            }
            else{
                isPaused = false;
                pause.destroy();
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
//        game.debug.body(trash.trash);
//        game.debug.body(trash.leftChild);
//        game.debug.body(trash.rightChild);
//        game.debug.body(trash.upChild);
//        game.debug.body(trash.downChild);
        
        //game.debug.body(janitor.janitor);
        //game.debug.body(janitor.pushBox);
        //game.debug.body(janitor.attackBox);
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
    monster.body.setSize(175, 175, 40, 75);
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
    var jan = janitor.janitor;
    
    janitor.setBody(janitor.heading);
    //var broom = janitor.broom;
    
    var hitGoal = game.physics.arcade.collide(trash.trash, goalLayer);
    var badHit = game.physics.arcade.collide(villain, jan);
    var hitWall = game.physics.arcade.collide(trash.trash, blockLayer);
    
    
   
    
        
    // Basic collisions
    game.physics.arcade.collide(jan, blockLayer);
    game.physics.arcade.collide(trash.trash, blockLayer);
    game.physics.arcade.collide(trash.trash, goalLayer);
    game.physics.arcade.collide(villain, blockLayer);
    game.physics.arcade.collide(trash.trash, jan);
//    game.physics.arcade.collide(trash.upChild, jan);
//    game.physics.arcade.collide(trash.downChild, jan);
//    game.physics.arcade.collide(trash.leftChild, jan);
//    game.physics.arcade.collide(trash.rightChild, jan);
        
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
    
    //Broom collision with monster
    //var broomMonsterCollide = game.physics.arcade.collide(villain, broom);
    
    //Check to see if we need to push
    if (isPushing && !isPaused){
        //Set the pushBox to go outwards
        switch(janitor.heading){
            case 0:
                janitor.pushBox.body.setSize(64, 64, 28, -15);
                break;
            case 1:
                janitor.pushBox.body.setSize(64, 64, -58, -15);
                break;
            case 2:
                janitor.pushBox.body.setSize(64, 64, -20, -80);
                break;
            case 3:
                janitor.pushBox.body.setSize(64, 64, -20, 40);
                break;
        }
    }
    
    if (isAttacking && !isPaused){
        //Set the pushBox to go outwards
        switch(janitor.heading){
            case 0:
                janitor.attackBox.body.setSize(64, 64, 28, -15);
                break;
            case 1:
                janitor.attackBox.body.setSize(64, 64, -58, -15);
                break;
            case 2:
                janitor.attackBox.body.setSize(64, 64, -20, -80);
                break;
            case 3:
                janitor.attackBox.body.setSize(64, 64, -20, 40);
                break;
        }
    }
    
    
    
    
        //BUGGS HOE!!
        //trying to FIX BUGS
    
    var janHit = game.physics.arcade.collide(blockLayer, jan);
    
    var janX = jan.body.velocity.y = 0;
    var janY = jan.body.velocity.x = 0;
    
    if (!janX && !janY){
        game.physics.arcade.collide(blockLayer, jan);
        }
    
    // Janitor movement
    if (!isPushing && !isAttacking && !isPaused){
        if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
            jan.body.velocity.y = 0;
            jan.body.velocity.x = velocity;
            jan.animations.play('walkRight', 7, false);
            janitor.setHeading(0); 
            //janitor.setBroomDirection(2);
        }
        else if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
            jan.body.velocity.y = 0;
            jan.body.velocity.x = velocity * -1;
            jan.animations.play('walkLeft', 7, false);
            janitor.setHeading(1);
            //janitor.setBroomDirection(0);
        }
        else if(game.input.keyboard.isDown(Phaser.Keyboard.UP)){
            jan.body.velocity.x = 0;
            jan.body.velocity.y = velocity * -1;
            jan.animations.play('walkUp', 7, false);
            janitor.setHeading(2);
            //janitor.setBroomDirection(1);
        }
        else if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
            jan.body.velocity.x = 0;
            jan.body.velocity.y = velocity;
            jan.animations.play('walkDown', 7, false);
            janitor.setHeading(3);
            //janitor.setBroomDirection(3);
        }
        else{
            jan.animations.stop();
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
    //        jan.frame = 0
    //        currentAnim = jan.animations.currentAnim.name;
    //        while (jan.animations.currentAnim.isFinished)
            jan.body.velocity.x = 0;
            jan.body.velocity.y = 0;
        }
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
    
    //Trash movement
    //  --Push
    if (pushTrash && !isPaused){
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
        
    
//    //ATTACKS (!!!)
//    if (game.input.keyboard.isDown(Phaser.Keyboard.A)){
//        if (broomCounter == 0){
//            janitor.attack(janitor.heading);
//            broomCounter = 24;
//        }
//        if (broomMonsterCollide){
//            monsterCounter = 72;
//            console.log('Broom hit!');
//        }
//    }
//    //Reset after attack if needed
//    if (broomCounter > 0){
//        broomCounter--;
//        if (broomCounter == 0){
//            //janitor.returnPush();
//        }
//    }
    
    //Attack
    if(attackHit){
        monsterCounter = 72;
    }
    // PULL
    // Check to see if the 'S' key is pressed...
    if(game.input.keyboard.isDown(Phaser.Keyboard.S) && !isPaused){
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
    //Restarting the Level
    if (game.input.keyboard.isDown(Phaser.Keyboard.R)){
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
    // Moves trash monster continuously towards the janitor
    //Check if the monster should be moving or not
    if (monsterCounter > 0 || isPaused){
        console.log(monsterCounter);
        villain.body.velocity.setTo(0, 0);
        if(!isPaused){
            monsterCounter--;
        }
    }
    if (monsterCounter == 0 && !isPaused){
        //villain.body.velocity = 1;
        game.physics.arcade.moveToObject(villain, jan, 75);        
    }
    
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
        trash.body.immovable = true;
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
//  --Making this into a full fledged object to address issues with the broom. It doesn't have its own hitbox in the old model, which makes things like attacking the monster really clunky (if not straight up impossible)
//  --This works very similarly to the Trash object; there's the main sprite (the janitor) and that has a child attached to it (the broom). Main difference here is that the child is actually visible, as opposed to being an unseen collider like the trash children.
//  --It's worth noting that this uses an entirely new spritesheet for the janitor, as the current sheet has the broom included in the model.
//  --Also worth noting that this will change a lot of the logic in the update loop, as it'll be looking to the broom for reference instead of hte janitor as a whole. This *should* result in a bit more precision with hitboxes, but it could very well break some stuff.
//  --To sum this all up: this is a pretty big change to the game logic, so if things start breaking, look here first.
function Janitor(spawnX, spawnY){
    //Functions to create janitor and broom
    this.createJanitor = function(x, y){
        var jan = game.add.sprite(x, y, 'jan');
        //Set size, enable physics
        jan.anchor.setTo(0.5, 0.5);
        //jan.scale.setTo(0.25, 0.25);    //Shouldn't need any scaling nowadays
        game.physics.enable(jan);
        jan.body.setSize(28, 28, 12, 32);    //Tweak this after setting up animations
        jan.body.collideWorldBounds = true;
        //Add animations v2
        //Walking animations
        jan.animations.add('walkRight', [10, 11]);
        jan.animations.add('walkLeft', [5, 6]);
        jan.animations.add('walkUp', [15, 16]);
        jan.animations.add('walkDown', [0, 1]);
        //Push animations   //Will need to do some fanangling to find out which frames are what now
        jan.animations.add('pushRight', [12, 13]);
        jan.animations.add('pushLeft', [7, 8]);
        jan.animations.add('pushUp', [17, 18]);
        jan.animations.add('pushDown', [2, 3]);
        //Attack animations
        jan.animations.add('attackRight', [14, 10]);
        jan.animations.add('attackLeft', [9, 5]);
        jan.animations.add('attackUp', [19, 15]);
        jan.animations.add('attackDown', [4, 0]);
        return jan;
    }
    
    //Other functions
    this.setHeading = function(num){
        this.heading = num;
    }
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
    
    this.janitor = this.createJanitor(spawnX, spawnY);
    
    //New way to handle hitbox stuff
    this.hitboxes = game.add.group();
    this.hitboxes.enableBody = true;
    //Child the hitboxes group to the janitor
    this.janitor.addChild(this.hitboxes);
    
    //Add in special hitboxes
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
    
    this.heading = 0;   //Variable to hold the 'heading' of the janitor; 0 is facing left, 1 is up, 2 is right, 3 is down
}
