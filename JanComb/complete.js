var stateText; 
var counter = 0;
var stateText;

demo.complete = function(){};
demo.complete.prototype = {
	preload: function(){
        game.load.audio('lvlComp', 'assets/audio/completetask.mp3');
        game.load.image('Complete', 'assets/hesDoneIt.png');
	},
	create: function(){
        var nextLevel = game.add.sprite(0, 0, 'Complete');		
		lvlComp = game.add.audio('lvlComp');
        lvlComp.play();
        
        let R = game.input.keyboard.addKey(Phaser.Keyboard.R);
        R.onDown.add(function() {
            //addLevel();
            //var y = getCookie('level');
            //console.log(y)
            game.state.start('titleLevel');            
        });
        
    	},
	update: function(){
//        if(game.input.keyboard.isDown(Phaser.Keyboard.N)){
//            addLevel();
//            var y = getCookie('level')
//            game.state.start('level' + y);
//        };
    }    
   
};

