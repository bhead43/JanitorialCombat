var demo = {};

demo.level1 = function(){};
demo.level1.prototype = {
	preload: function(){
        game.load.tilemap('levelOne', 'assets/levelMap.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('Tiles', 'assets/protoTileSet.png');
    },
	create: function(){
        var map = game.add.tilemap('levelOne');
        map.addTilesetImage('Tiles');
        
        var baseLayer = map.createLayer('Floor');
        var blockLayer = map.createLayer('Blocks');
        var goalLayer = map.createLayer('Goal');
    },
	update: function(){}
};
