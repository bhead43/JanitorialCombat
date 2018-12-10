var stateText;
var y = getCookie('level');

demo.gameOver = function(){};
demo.gameOver.prototype = {
	preload: function(){
        game.load.image('GameOver', 'assets/GameOverScreen.png');
      
	create: function(){
        
        
        var gameOver = game.add.sprite(0, 0, 'GameOver');
        
        let R = game.input.keyboard.addKey(Phaser.Keyboard.R);
        R.onDown.add(function(){
            var y = getCookie('level');
            console.log(y)
            game.state.start('level' + y);
        }); 
    },
	update: function(){}
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
