/*
 * world -> china in -> shooter -> province -> shooter -> province ... -> china out -> world
 * 
 * 
 * 
 */

(function() {

	/* timing config */
	var Time = {
		worldStay : 5000,
		worldOut : 2000,
		chinaWaitIn : 5000,//5000
		chinaStay : 5000,
		chinaIn : 1000,//1000
		chinaOut : 2000,//2000
		shooterWaitIn : 2000,
		shooterIn : 500,
		shooterMove : 1000,
		shooterOut : 500,
		layerWaitIn : 1000,
		layerIn : 1000,
		layerStay : 3000,
		layerOut : 1000,
		firstProvinceWaitIn : 5000,
		provinceStay : 2000
	};

	/* timing config */

	var chinamap = $("#chinamap");
	var worldmap = $("#worldmap");
	var china = $("#china");
	var dw = document.body.clientWidth,
		dh = document.body.clientHeight;

	var shooter = $("#shooter").css({
		'-webkit-transform' : 'translate3d('+(dw/2)+'px, '+(dh/2)+'px, 0) scale(5)',
		'opacity' : 0
	});

	var floatlayer = $("#float-layer");
	var citytext = $("#city-text");
	var curProvinceImage = $("#cur-province-image");
	Donut.init('donut');
	Column.init('column');
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
	var play = function(){
		//开场动画
		worldmap.find("path").attr("class", "render");
		chinamap.find("path").attr("class", "render");
		//中国地图变大
		chinamap.delay(Time.chinaWaitIn).animate({//5000
			width: 1000,
			height: 840,
			right: 268,
			top: 137
		}, Time.chinaIn, function() {//1000

			//靶位移动
			var posIdx = -1;

			shooter.cssAnim({//2000
				'-webkit-transition' : Time.shooterOut + 'ms',
				'-webkit-transform' : 'translate3d(1000px, 137px, 0) scale(1)',
				'opacity': 1
			}, {
				wait : Time.shooterWaitIn,
				callback : function(){

				}
			});

			var showCities = function(){
				posIdx++;
				if (posIdx >= shooterPositions.length) {
					//中国地图变小
					shooter.cssAnim({
						'-webkit-transition' : Time.shooterIn + 'ms',
						'-webkit-transform' : 'translate3d('+(dw/2)+'px, '+(dh/2)+'px, 0) scale(5)',
						'opacity' : 0
					}, {
						callback : function(){
							chinamap.delay(Time.chinaStay).animate({//5000
								width: 200,
								height: 168,
								right: 302,
								top: 470
							}, Time.chinaOut, function() {//2000
								reset();
							});
						}
					});

					return false;
				}
				var shooterPos = shooterPositions[posIdx];

				var showlayer = function(){
					if (posIdx >= shooterPositions.length) return;

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

					var columnList = (function() {
						var list = [];
						for (var i = 0; i < currentFive.length; i++) {
							list.push(currentFive[i][pro].msg_ack);
						}
						return list;
					})();
					columnList.push(0);
					var time = (new Date()).toTimeString().split(" ")[0];
					var columnData = {
						x: ['', '', '', '', time, ''],
						y: columnList
					};

					//浮层显示和消失的动画
					floatlayer.delay(Time.layerWaitIn).animate({
						width: 1658,
						height: 722
					}, Time.layerIn, function() {
						Donut.update(donutData); //数据有变化直接update
						Column.update(columnData); //数据有变化直接update
						Column.setTotal(columnList[4]); //修改总数
					}).delay(Time.layerStay).animate({
						width: 0,
						height: 0
					}, Time.layerOut);
				}

				shooter.cssAnim({
					'-webkit-transition' : Time.shooterMove + 'ms',
					'-webkit-transform' : 'translate3d(' + (shooterPos.left + 345) + 'px, ' + (shooterPos.top - 170) + 'px, 0)',
				}, {
					// callback : showlayer
				});


				setTimeout(showCities, Time.provinceStay);//15000
			};
			setTimeout(showCities, Time.firstProvinceWaitIn);//5000
		});

		//世界地图同时fadeOut
		worldmap.delay(Time.worldStay).fadeOut(Time.worldOut);
	};
	play();
})();