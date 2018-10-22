var stateText;
var y = getCookie('level');

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
        
        var R = game.input.keyboard.addKey(Phaser.Keyboard.R);

        R.onDown.add(function(){
        //if (game.input.keyboard.isDown(Phaser.Keyboard.R)){
            var y = getCookie('level');
            console.log(y)
            game.state.start('level' + y);
        });        
//        if (game.input.keyboard.isDown(Phaser.Keyboard.R)){
//            game.state.start('level' + y);
//        }
    }
};

////why the fuck does this return 1 all the time
//function currentLevel(){
//    var x = getCookie('level');
//    x = Number(x);
//    //x++;
//    x = x.toString();
//    document.cookie = 'level = ' + x;
//    console.log(x);
//    console.log(document.cookie);
//    return(x)
//}

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
