demo.state2 = function(){};
demo.state2.prototype = {
	preload: function(){},
	create: function(){
		game.stage.backgroundColor = '#26b7ad';

		addChangeStateEventListeners();
		
	},
	update: function(){}
};