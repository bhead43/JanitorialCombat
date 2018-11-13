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
        
        
        //trash
        trash = new Trash(200, 150);
        
        // Everything janitor
        jan = createJanitor(130, 130);
       
        
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
        //  --Update handled via function now (see level0.js)
        setupUpdate(jan, trash, villain, blockLayer, goalLayer);
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