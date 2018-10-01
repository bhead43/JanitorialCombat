var demo = {};

var blockLayer, goalLayer, jan, trash;
var velocity = 300;

demo.level1 = function(){};
demo.level1.prototype = {
	preload: function(){
        game.load.tilemap('levelOne', 'assets/levelMap.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('Tiles', 'assets/protoTileSet.png');
        game.load.spritesheet('jan', 'assets/characterSpritesheet.png', 230, 405);
        game.load.image('Trash', 'assets/paperBall.png'); // for now
		
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
        
        //walking animation
        jan.animations.add('walk', [0,1,2,3] );
            
        
        
        trash = game.add.sprite(500, 100, 'Trash');
	    trash.scale.setTo(0.5, 0.5);
		
	    // Enable trash physics and stuff
        game.physics.enable(trash);
        trash.body.bounce.setTo(0.3);   // Can change later
        trash.body.collideWorldBounds = true;
        
        
    },
	update: function(){
        
        var hitGoal = game.physics.arcade.collide(trash, goalLayer);
        

        //cant get anything to collide thou........!!
        game.physics.arcade.collide(jan, blockLayer);
        game.physics.arcade.collide(trash, blockLayer);
        game.physics.arcade.collide(trash, jan);
        game.physics.arcade.collide(trash, goalLayer)
        
        
       
            
        
        //Movement stuff
        //  Maybe set x velocity to 0 when moving up/down, and vice versa? Could help with movement weirdness
        if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
			jan.scale.setTo(0.2, 0.2);
            jan.body.velocity.y = 0;
			jan.body.velocity.x = velocity;
            jan.animations.play('walk', 14, true);
		}
		else if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
			jan.scale.setTo(-0.2, 0.2);
            jan.body.velocity.y = 0;
			jan.body.velocity.x = velocity * -1;
            jan.animations.play('walk', 14, true);
		}

		else if(game.input.keyboard.isDown(Phaser.Keyboard.UP)){
            jan.scale.setTo(0.2, 0.2);
            jan.body.velocity.x = 0;
			jan.body.velocity.y = velocity * -1;
			
		}
		else if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
            jan.scale.setTo(0.2, 0.2);
            jan.body.velocity.x = 0;
			jan.body.velocity.y = velocity;
		}
	   
        else{
            jan.animations.stop('walk');
            jan.frame = 0
            jan.body.velocity.x = 0;
            jan.body.velocity.y = 0;
        }
        
        if(hitGoal){
            trash.kill();
        }
        

    },
    
    render: function() {
        game.debug.bodyInfo(jan, 32, 32);
        game.debug.body(jan);
    }  
    

};
