(function() {
	var shooterPositions = [{
		right: 150,
		top: 300
	}, {
		right: 190,
		top: 300
	}, {
		right: 290,
		top: 500
	}, {
		right: 350,
		top: 700
	}, {
		right: 150,
		top: 500
	}, {
		right: 250,
		top: 700
	}];
	//循环动画
	var chinamap = $("#chinamap");
	var worldmap = $("#worldmap");
	var china = $("#china");
	var shooter = $("#shooter");
	var floatlayer = $("#float-layer");
	//中国地图放大
	chinamap.delay(5000).animate({
		width: 1000,
		height: 840,
		right: 268,
		top: 137
	}, 2000, function() {
		//靶位移动
		shooter.css(shooterPositions[0]);
		var posIdx = 0;
		shooter.delay(2000).show();
		var showCities = function() {
			posIdx++;
			if (posIdx >= shooterPositions.length) {
				return false;
			}
			shooter.animate(shooterPositions[posIdx], 1000, function() {
				floatlayer.animate({
					width: 1658,
					height: 722
				}).delay(10000).animate({
					width: 200,
					height: 200
				}, function() {
					floatlayer.hide();
				});
			});
			setTimeout(showCities, 200000);
		};
		setTimeout(showCities, 5000);
	});
	worldmap.delay(5000).fadeOut(2000);

	// var loop = function() {};
	// loop();
})();