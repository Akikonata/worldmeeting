(function() {
	var chinamap = $("#chinamap");
	var worldmap = $("#worldmap");
	var china = $("#china");
	var shooter = $("#shooter");
	var floatlayer = $("#float-layer");
	var citytext = $("#city-text");
	Donut.init('donut'); //初始化一次就行
	Column.init('column'); //初始化一次就行
	var shooterPositions = [{
		name: "北京",
		left: 730,
		top: 300
	}, {
		name: "上海",
		left: 850,
		top: 500
	}, {
		name: "广东",
		left: 720,
		top: 680
	}, {
		name: "重庆",
		left: 590,
		top: 540
	}, {
		name: "台湾",
		left: 870,
		top: 660
	}, {
		name: "福建",
		left: 800,
		top: 620
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
				left: 1000,
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
				var shooterPos = shooterPositions[posIdx];
				shooter.animate({
					left: shooterPos.left + 345,
					top: shooterPos.top - 170
				}, 1000, function() {
					var pro = shooterPositions[posIdx].name;
					citytext.text(pro);
					var currentFive = Utils.currentFive;
					var donutList = currentFive[4][pro].age_distribute;

					var donutData = [{
						label: "18-21",
						value: donutList[1] * 100,
						color: "#ffcf00"
					}, {
						label: "21-35",
						value: donutList[2] * 100,
						color: "#1782fb"
					}, {
						label: "35以上",
						value: donutList[3] * 100,
						color: "#f92a69"
					}];

					Donut.update(donutData); //数据有变化直接update
					var columnList = (function() {
						var list = [];
						for (var i = 0; i < currentFive.length; i++) {
							list.push(currentFive[i].total_msg_ack_count);
						}
						return list;
					})();
					var columnData = {
						x: ['18:06:20', '18:06:30', '18:06:40', '18:06:50', '18:06:50'],
						y: columnList
					};
					Column.update(columnData); //数据有变化直接update
					Column.setTotal(columnList[4]); //修改总数

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
})();