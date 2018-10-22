var stateText;

demo.gameOver = function(){};
demo.gameOver.prototype = {
	preload: function(){},
	create: function(){
        game.stage.backgroundColor = '#26b7ad';
        
        //Text stuff
        stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '84px Arial', fill: '#ed0202' });
        stateText.anchor.setTo(0.5, 0.5);
        stateText.visible = false;
    },
	update: function(){
        stateText.text = "Eaten by trash monsters! \nPress \'R\' to restart";
        stateText.visible = true;
        
        if (game.input.keyboard.isDown(Phaser.Keyboard.R)){
            var y = getCookie('level');
            console.log(y)
            game.state.start('level' + y);
        }
    }
};



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