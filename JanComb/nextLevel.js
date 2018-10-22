var stateText; 
//var y = addLevel();
var counter = 0;

demo.nextLevel = function(){};
demo.nextLevel.prototype = {
	preload: function(){
		 game.load.audio('lvlComp', 'assets/audio/completetask.mp3');
	},
	create: function(){
        	game.stage.backgroundColor = '#26b7ad';
		
        	//Text stuff
        	stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '64px Arial', fill: '#ed0202' });
        	stateText.anchor.setTo(0.5, 0.5);
        	stateText.visible = false;
		
		lvlComp = game.add.audio('lvlComp');
        	lvlComp.play();
		
    	},
	update: function(){
        stateText.text = "Level Complete! \nPress \'N\' to Start next Level!";
        stateText.visible = true;
        
        var N = game.input.keyboard.addKey(Phaser.Keyboard.N);
        
        N.onDown.add(function(){
            if (counter == 0){
                y = addLevel();
            }
            counter++;
            game.state.start('level' + y);
        });
        
//        if(game.input.keyboard.isDown(Phaser.Keyboard.N)){
//            game.state.start('level' + y);
//        }
    }    
   
};

function addLevel(){
    var x = getCookie('level');
    x = Number(x);
    x++;
    x = x.toString();
    document.cookie = 'level = ' + x;
    console.log(x);
    return(x)
}

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
