var demo = {};

var blockLayer, goalLayer, trash;

demo.level1 = function(){};
demo.level1.prototype = {
	preload: function(){
        game.load.tilemap('levelOne', 'assets/levelMap.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('Tiles', 'assets/protoTileSet.png');
	game.load.image('Trash', 'assets/paperBall.png'); // for now
        //Also load in the character sprite sheet and something to be the trash block for now
        //  (There should be a paperBall.png in the assets folder that you could use)
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
		
	// Just making some trash
	trash = game.add.sprite(centerX, centerY, 'Trash');
	game.physics.arcade.enable(trash);
	trash.body.bounce.setTo(0.3); // Can change later
	trash.body.collideWorldBounds;
        
        //MIGHT need to uncomment this to have some detection when the block hits the goal area
        //map.setCollisonBetween(3, 3, true, 'Goal');
    },
	update: function(){
        //Fill these in with actual variables instead of the placeholders in there now
        //----------------------------------------------------------------------------
        //game.physics.arcade.collide(PLAYER_VARIABLE_HERE, blockLayer);
        game.physics.arcade.collide(trash, blockLayer);
        
    }
};
