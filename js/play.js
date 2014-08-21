(function() {
	var shooterPositions = [{
		name: "北京",
		right: 150,
		top: 300
	}, {
		name: "上海",
		right: 190,
		top: 300
	}, {
		name: "广州",
		right: 290,
		top: 500
	}, {
		name: "深圳",
		right: 350,
		top: 700
	}, {
		name: "台湾",
		right: 150,
		top: 500
	}, {
		name: "香港",
		right: 250,
		top: 700
	}];
	//循环动画
	var chinamap = $("#chinamap");
	var worldmap = $("#worldmap");
	var china = $("#china");
	var shooter = $("#shooter");
	var floatlayer = $("#float-layer");
	var citytext = $("#city-text");
	//中国地图放大
	chinamap.delay(5000).animate({
		width: 1000,
		height: 840,
		right: 268,
		top: 137
	}, 2000, function() {
		//靶位移动
		shooter.css({
			right: 268,
			top: 137
		});
		var posIdx = -1;
		shooter.delay(2000).show();
		var showCities = function() {
			posIdx++;
			if (posIdx >= shooterPositions.length) {
				return false;
			}
			shooter.animate(shooterPositions[posIdx], 1000, function() {
				citytext.text(shooterPositions[posIdx].name);
				floatlayer.delay(1000).animate({
					width: 1658,
					height: 722
				}, 1000).delay(10000).animate({
					width: 0,
					height: 0
				}, 1000);
			});
			setTimeout(showCities, 15000);
		};
		setTimeout(showCities, 5000);
	});
	worldmap.delay(5000).fadeOut(2000);
	// var loop = function() {};
	// loop();
})();