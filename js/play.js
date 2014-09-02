(function() {
	var dw = document.body.clientWidth,
		dh = document.body.clientHeight;

	var chinamap = $("#chinamap");
	var chinaTwinkle = $("#china-twinkle");
	var worldmap = $("#worldmap");
	var china = $("#china");
	var shooter = $("#shooter").css({
		left: dw / 2 + 'px',
		top: dh / 2 + 'px',
		'tranistion': '500ms',
		'transform': 'scale(5)',
		'opacity': 0
	});
	var floatlayer = $("#float-layer");
	var citytext = $("#city-text");
	var curProvinceImage = $("#cur-province-image");
	Donut.init('donut'); //初始化一次就行
	Column.init('column'); //初始化一次就行
	var shooterPositions = [{
		name: "北京",
		left: 730,
		top: 300,
		background: "url(images/beijing.png)"
	}, {
		name: "上海",
		left: 850,
		top: 500,
		background: "url(images/shanghai.png)"
	}, {
		name: "广东",
		left: 720,
		top: 680,
		background: "url(images/guangdong.png)"
	}, {
		name: "重庆",
		left: 590,
		top: 540,
		background: "url(images/chongqing.png)"
	}, {
		name: "台湾",
		left: 870,
		top: 660,
		background: "url(images/taiwan.png)"
	}, {
		name: "福建",
		left: 800,
		top: 620,
		background: "url(images/fujian.png)"
	}];
	var reset = function() {
		worldmap.find("path").attr("class", "");
		chinamap.find("path").attr("class", "");
		worldmap.fadeIn(0);
		play();
	};
	var play = function() {
		//开场动画
		worldmap.find("path").attr("class", "render");
		chinamap.find("path").attr("class", "render");
		//中国地图变大
		chinaTwinkle.delay(10000).fadeOut(100);
		chinamap.delay(10000).animate({
			width: 1000,
			height: 840,
			right: 268,
			top: 137
		}, 2000, function() {
			chinaTwinkle.fadeIn(200);
			//靶位移动
			shooter.animate({
				left: 1000,
				top: 137,
				scale: 1
			}, 1000);
			var posIdx = -1;
			shooter.delay(2000).css('opacity', 1); //2000
			var showCities = function() {
				posIdx++;
				if (posIdx >= shooterPositions.length) {
					//中国地图变小
					shooter.animate({
						'opacity': 1
					}, 50, function() {
						shooter.css({
							left: dw / 2 + 'px',
							top: dh / 2 + 'px',
							// 'tranistion' : '2000ms',
							'transform': 'scale(5)',
							opacity: 0
						});
						chinamap.delay(5000).animate({
							width: 200,
							height: 168,
							right: 302,
							top: 470
						}, 2000, function() {
							reset();
						});
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
					curProvinceImage.css("backgroundImage", shooterPositions[posIdx].background);
					curProvinceImage.text(Utils.provinces[pro]);
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

					var time = new Date();
					var hoursData = Utils.hoursData;
					var hour = time.getHours();
					var columnList = (function() {
						var list = [];
						for (var i = hour - 4; i <= hour; i++) {
							list.push(hoursData[i][pro].msg_ack);
						}
						return list;
					})();
					columnList.push(0);
					var columnData = {
						x: ['', '', '', '', hour + '时', ''],
						y: columnList
					};
					//浮层显示和消失的动画
					floatlayer.delay(1000).animate({
						// left : 131,
						// right : 131,
						// top : 179,
						// bottom : 179
						width: 1658,
						height: 722
					}, 1000, function() {
						Donut.update(donutData); //数据有变化直接update
						Column.update(columnData); //数据有变化直接update
						Column.setTotal(columnList[4]); //修改总数
					}).delay(10000).animate({
						width: 0,
						height: 0
					}, 1000);
				});
				setTimeout(showCities, 30000); //*****
			};
			setTimeout(showCities, 5000);
		});
		//世界地图同时fadeOut
		worldmap.delay(10000).fadeOut(2000);
	};
	play();
})();