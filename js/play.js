(function() {
	var chinamap = $("#chinamap");
	var worldmap = $("#worldmap");
	var china = $("#china");
	var shooter = $("#shooter");
	var floatlayer = $("#float-layer");
	var citytext = $("#city-text");
	var worlddots = $("#world-dots")[0];
	var chinadots = $("#china-dots")[0];
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
	var reset = function() {
		worldmap.find("path").attr("class", "");
		chinamap.find("path").attr("class", "");
		worldmap.fadeIn(0);
		shooter.hide();
		play();
	};
	var play = function() {
		//开场动画
		worldmap.find("path").attr("class", "render");
		chinamap.find("path").attr("class", "render");
		//渲染数据点

		//中国地图变大
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
					//中国地图变小
					chinamap.delay(5000).animate({
						width: 200,
						height: 168,
						right: 362,
						top: 420
					}, 2000, function() {
						reset();
					});
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
		//世界地图同时fadeOut
		worldmap.delay(5000).fadeOut(2000);
	};
	play();
	var chinactx = chinadots.getContext("2d");
	chinactx.fillStyle = '#f69701';
	chinactx.shadowBlur = 10;
	chinactx.shadowColor = "#f69701";
	//测试代码
	var chinaMap = Utils.chinaMap;
	for (var key in chinaMap) {
		var xizang = chinaMap[key];
		var range = xizang.length;
		for (var i = 0; i < 200; i++) {
			var grid = parseInt(Math.random() * range);
			var x = Math.random() * 10;
			var y = Math.random() * 10;
			chinactx.moveTo(xizang[grid][0] * 10 + x - 1, xizang[grid][1] * 10 + y);
			chinactx.arc(xizang[grid][0] * 10 + x, xizang[grid][1] * 10 + y, 1, 0, Math.PI * 2, true);
		}
	}
	chinactx.fill();
})();