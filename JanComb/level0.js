var demo = {};
document.cookie = "level = 0"; 
var y = getCookie('level')

var blockLayer, goalLayer, jan, trash, stateText, villain;
var upChild, downChild, leftChild, rightChild;  //Children for the trash object
var velocity = 300;
var trashVelocity = 500; //Tweak as needed
var dummyCounter = 0;   //Is this at all necessary? I don't even know why this was added in the first place
var monsterCounter = 0;
var broomCounter = 0;

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
        
        //Placeholder sprite for broom
        game.load.image('broom', 'assets/broom_PLACEHOLDER.png');
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
        
        // Everything janitor
        //  All done via a function (which can be used in any subsesquent levels as well)
        //jan = createJanitor(130, 130) //OLD
        janitor = new Janitor(130, 130);    //NEW
        
        // Trash stuff
        //  All handled via an object now (see bottom of file)
        trash = new Trash(200, 150);
        
	    // Everything trash monster
	    // All handled via a function (see bottom of file)
        villain = createMonster(300, 800);
		
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
        
        game.debug.body(janitor.janitor);
        game.debug.body(janitor.broom);
    }
};

// Creates janitor
//  --This isn't an object right now, and I don't think it needs to be one, but it might be cleaner if it was? Just a thought
//  --NO LONGER IN USE!!! See the Janitor object at the bottom of the file
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
    var jan = janitor.janitor;
    var broom = janitor.broom;
    
    var hitGoal = game.physics.arcade.collide(trash.trash, goalLayer);
    var badHit = game.physics.arcade.collide(villain, jan);
    var hitWall = game.physics.arcade.collide(trash.trash, blockLayer);
        
    // Basic collisions
    game.physics.arcade.collide(jan, blockLayer);
    game.physics.arcade.collide(trash.trash, blockLayer);
    game.physics.arcade.collide(trash.trash, goalLayer);
    game.physics.arcade.collide(villain, blockLayer);
    //game.physics.arcade.collide(trash.trash, jan);
//    game.physics.arcade.collide(trash.upChild, jan);
//    game.physics.arcade.collide(trash.downChild, jan);
//    game.physics.arcade.collide(trash.leftChild, jan);
//    game.physics.arcade.collide(trash.rightChild, jan);
        
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
    
    //Broom collision with monster
    var broomMonsterCollide = game.physics.arcade.collide(villain, broom);
    
    // Janitor movement
    if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
        jan.body.velocity.y = 0;
        jan.body.velocity.x = velocity;
        jan.animations.play('walkRight', 7, false);
        janitor.setHeading(2); 
        janitor.setBroomDirection(2);
    }
    else if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
        jan.body.velocity.y = 0;
        jan.body.velocity.x = velocity * -1;
        jan.animations.play('walkLeft', 7, false);
        janitor.setHeading(0);
        janitor.setBroomDirection(0);
    }
    else if(game.input.keyboard.isDown(Phaser.Keyboard.UP)){
        jan.body.velocity.x = 0;
        jan.body.velocity.y = velocity * -1;
        jan.animations.play('walkUp', 7, false);
        janitor.setHeading(1);
        janitor.setBroomDirection(1);
    }
    else if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
        jan.body.velocity.x = 0;
        jan.body.velocity.y = velocity;
        jan.animations.play('walkDown', 7, false);
        janitor.setHeading(3);
        janitor.setBroomDirection(3);
    }
    else{
        jan.animations.stop();
        if (janitor.heading == 0){
            jan.frame = 5;
        }
        else if (janitor.heading == 1){
            jan.frame = 15;
        }
        else if (janitor.heading == 2){
            jan.frame = 10;
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
//    if(game.input.keyboard.isDown(Phaser.Keyboard.E)){
//    // Now collisions
//        if(upCollide){	// move trash down
//            //jan.animations.play('pushDown', 1, false); 
//  		    trash.trash.body.velocity.y = trashVelocity;
//        }
//        else if(downCollide){	// move trash up
//            //jan.animations.play('pushUp', 3, false);
//            trash.trash.body.velocity.y = trashVelocity * -1;
//        }
//        else if(leftCollide){	// move trash right
//            //jan.animations.play('pushRight', 3, false);
//            trash.trash.body.velocity.x = trashVelocity;
//        }
//        else if(rightCollide){	// move trash left
//            //jan.animations.play('pushLeft', 3, false);
//            trash.trash.body.velocity.x = trashVelocity * -1;
//        }
////        else{
////            jan.animations.play('pushDown', 3, false);
////        }
//    }
    //NEW PUSH SYSTEM
    if (game.input.keyboard.isDown(Phaser.Keyboard.E)){
        //Check if the push hit the trash
        if(upCollide){	// move trash down
            //jan.animations.play('pushDown', 1, false); 
            trash.trash.body.velocity.y = trashVelocity;
        }
        else if(downCollide){	// move trash up
            //jan.animations.play('pushUp', 3, false);
            trash.trash.body.velocity.y = trashVelocity * -1;
        }
        else if(leftCollide){	// move trash right
            //jan.animations.play('pushRight', 3, false);
            trash.trash.body.velocity.x = trashVelocity;
        }
        else if(rightCollide){	// move trash left
            //jan.animations.play('pushLeft', 3, false);
            trash.trash.body.velocity.x = trashVelocity * -1;
        }
    }
    
    //ATTACKS (!!!)
    if (game.input.keyboard.isDown(Phaser.Keyboard.Z)){
        if (broomCounter == 0){
            janitor.attack(janitor.heading);
            broomCounter = 24;
        }
        if (broomMonsterCollide){
            monsterCounter = 72;
            console.log('Broom hit!');
        }
    }
    //Reset after attack if needed
    if (broomCounter > 0){
        broomCounter--;
        if (broomCounter == 0){
            janitor.returnPush();
        }
    }
    
    // PULL
    // Check to see if the 'F' key is pressed...
    if(game.input.keyboard.isDown(Phaser.Keyboard.F)){
        console.log(totalMove)
        if(upCollide && totalMove < 40){	// pull trash up
            trash.trash.position.y = trash.trash.position.y - 5;
            totalMove++;
        }
        else if(downCollide && totalMove < 40){	// pull trash down
            trash.trash.position.y = trash.trash.position.y + 5;
            totalMove++;
        }
        else if(leftCollide && totalMove < 40){	// pull trash left
            trash.trash.position.x = trash.trash.position.x - 5;
            totalMove++;
        }
        else if(rightCollide && totalMove < 40){	// pull trash right
            trash.trash.position.x = trash.trash.position.x + 5;
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
    //Check if the monster should be moving or not
    if (monsterCounter > 0){
        console.log(monsterCounter);
        monsterCounter--;
    }
    if (monsterCounter == 0){
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
        jan.scale.setTo(0.25, 0.25);    //Probably not the best course of action to set size through in engine scaling, but whatever
        game.physics.enable(jan);
        jan.body.setSize(128, 128, 50, 270);    //This will probably be changed when there's a new spritesheet in place, fair warning
        jan.body.collideWorldBounds = true;
        //Add animations
        jan.animations.add('walkUp', [16, 15]);
        jan.animations.add('walkDown', [1, 0]);
        jan.animations.add('walkLeft', [6, 5]);
        jan.animations.add('walkRight', [11, 10]);
        //OBSOLETE ANIMATIONS, DELETE THIS SHIT WHEN THIS ALL WORKS
//        jan.animations.add('pushUp', [18]);
//        jan.animations.add('pushDown', [3, 4]);
//        jan.animations.add('pushLeft', [8, 9]);
//        jan.animations.add('pushRight', [13, 14]);
        
        return jan;
    }
    
    this.createBroom = function(parent){
        var broom;
        broom = parent.addChild(game.add.sprite(0, -64));    //Couple of notes: Those coordinates'll need to be fiddled with, and there'll need to be a third argument for the broom sprite
        game.physics.enable(broom);
        //Fine tune stuff (if needed) down here later
        //broom.body.setSize(25, 75, 10, -50);
        broom.body.moves = false;
        
        console.log('Broom has been created!')
        return broom;
    }
    
    //Other functions
    this.setHeading = function(num){
        this.heading = num;
    }
    
    this.setBroomDirection = function(heading){
        switch(heading){
            case 0:   //Facing LEFT
                this.broom.position.x = -150;
                this.broom.position.y = -64;
                //console.log('Set broom heading to LEFT');
                break;
            case 1:   //Facing UP
                this.broom.position.x = -75;
                this.broom.position.y = -150;
                //console.log('Set broom heading to UP');
                break;
            case 2:   //Facing RIGHT
                this.broom.position.x = 0;
                this.broom.position.y = -64;
                //console.log('Set broom heading to RIGHT');
                break;
            case 3:   //Facing DOWN
                this.broom.position.x = -75;
                this.broom.position.y = 50;
                //console.log('Set broom heading to DOWN');
                break;
        }
        //console.log('The method did get called, by the by');
    }
    
    //New plan: All this'll do is play animations for the broom. Nothing else.
    this.push = function(heading){
        if (this.canPush){
            switch(heading){
                case 0:   //Facing LEFT
                    this.broomOriginalX = this.broom.position.x;
                    this.broom.position.x -= 1500;
                    //Find a way to add a delay here. Or just add animations for the visual effect to not be jarring
                    //this.broom.position.x += 15;
                    break;
                case 1:   //Facing UP
                    this.broomOriginalY = this.broom.position.y;
                    this.broom.position.y -= 15;
                    //this.broom.position.y += 15;
                    break;
                case 2:   //Facing RIGHT
                    this.broomOriginalX = this.broom.position.x;
                    this.broom.position.x += 15;
                    //this.broom.position.x -= 15;
                    break;
                case 3:   //Facing DOWN
                    this.broomOriginalY = this.broom.position.y;
                    this.broom.position.y += 15;
                    //this.broom.position.y -= 15;
                    break;
            }
            //this.canPush = false;
        }
    }
    
    this.returnPush = function(){
        //Needs to return broom to original position.
        this.broom.position.x = this.broomOriginalX;
        this.broom.position.y = this.broomOriginalY;
        //Allow for another push
        //this.canPush = true;
    }
    
    this.attack = function(heading){
        switch(heading){
            case 0:   //Facing LEFT
                //Play some sort of attack animation here
                this.broomOriginalX = this.broom.position.x;
                this.broom.position.x -= 80;
                //Find a way to add a delay here. Or just add animations for the visual effect to not be jarring
                //this.broom.position.x += 15;
                break;
            case 1:   //Facing UP
                this.broomOriginalY = this.broom.position.y;
                this.broom.position.y -= 80;
                //this.broom.position.y += 15;
                break;
            case 2:   //Facing RIGHT
                this.broomOriginalX = this.broom.position.x;
                this.broom.position.x += 80;
                //this.broom.position.x -= 15;
                break;
            case 3:   //Facing DOWN
                this.broomOriginalY = this.broom.position.y;
                this.broom.position.y += 80;
                //this.broom.position.y -= 15;
                break;
        }
    }
    
    this.janitor = this.createJanitor(spawnX, spawnY);
    this.broom = this.createBroom(this.janitor);
    this.broomOriginalX = this.broom.position.x;
    this.broomOriginalY = this.broom.position.y;
    this.heading = 0;   //Variable to hold the 'heading' of the janitor; 0 is facing left, 1 is up, 2 is right, 3 is down
    this.canPush = true;    //Just to make sure you can't break things with the push
}
