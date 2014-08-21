(function() {
	//循环动画
	var chinamap = $("#chinamap");
	var worldmap = $("#worldmap");
	chinamap.delay(5000).animate({
		width: 1000,
		height: 840,
		right: 268,
		top: 137
	}, 2000);
	worldmap.delay(5000).fadeOut(2000);
	var loop = function() {};
	loop();
})();