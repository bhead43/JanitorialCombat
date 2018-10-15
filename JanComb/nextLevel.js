var stateText;
var y = addLevel();  

demo.nextLevel = function(){};
demo.nextLevel.prototype = {
	preload: function(){},
	create: function(){
        game.stage.backgroundColor = '#26b7ad';
        
        //Text stuff
        stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '64px Arial', fill: '#ed0202' });
        stateText.anchor.setTo(0.5, 0.5);
        stateText.visible = false;
    },
	update: function(){
        
        stateText.text = "Level Complete! \nPress \'N\' to Start next Level!";
        stateText.visible = true;
        
        
        if(game.input.keyboard.isDown(Phaser.Keyboard.N)){
            game.state.start('level' + y);
        }
    }    
   
};

function addLevel(){
    var x = getCookie('level');
    x = Number(x);
    x++;
    x = x.toString();
    document.cookie = 'level = ' + x;
    return(x)

}
s
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