(function() {
	var provinceList = (function() {
		var list = {};
		for (var key in Utils.provinces) {
			list[key] = {
				short: Utils.provinces[key]
			}
		}
		return list;
	})();
	var contryList = [];
	var dataList = [];
	var currentFive = Utils.currentFive;
	//初始化绘图所需的canvas
	var worlddots = $("#world-dots")[0];
	var chinadots = $("#china-dots")[0];
	var worldtwinkle = $("#world-twinkle")[0];
	var chinatwinkle = $("#china-twinkle")[0];
	var worldDotList = {};
	var chinaDotList = {};
	//记录闪烁效果
	var worldTwinkleList = [];
	var chinaTwinkleList = [];
	var chinactx = chinadots.getContext("2d");
	var worldctx = worlddots.getContext("2d");
	var worldtwinklectx = worldtwinkle.getContext("2d");
	var chinatwinklectx = chinatwinkle.getContext("2d");
	var $onlinecount = $("#onlinecount");
	var $msgcount = $("#msgcount");
	chinactx.fillStyle = 'rgba(62,80,108,0.7)';
	//chinactx.shadowBlur = 10;
	chinactx.shadowColor = "#f69701";
	worldctx.fillStyle = 'rgba(62,80,108,0.7)';
	//worldctx.shadowBlur = 10;
	worldctx.shadowColor = "#f69701";
	chinactx.globalCompositeOperation = "lighter";
	worldctx.globalCompositeOperation = "lighter";
	worldtwinklectx.globalCompositeOperation = "lighter";
	chinatwinklectx.globalCompositeOperation = "lighter";
	worldtwinklectx.strokeStyle = "#0c45b9";
	chinatwinklectx.lineWidth = 1;
	worldtwinklectx.lineWidth = 1;
	chinatwinklectx.strokeStyle = "#0c45b9";
	worldtwinklectx.fillStyle = "rgba(21,54,113,0.6)";
	chinatwinklectx.fillStyle = "rgba(21,54,113,0.6)";
	var getData = function() {
		var Dt = new Date();
		var hours = Dt.getHours();
		var minutes = Dt.getMinutes() - 1;
		var seconds = Dt.getSeconds();
		minutes += parseInt((seconds + 1) / 60);
		hours += parseInt((minutes + 1) / 60);
		minutes = (minutes + 1) % 60;
		var secondsList = [];
		var hS = hours < 10 ? ('0' + hours) : hours;
		var mS = minutes < 10 ? ('0' + minutes) : minutes;
		//获取当前分钟的数据
		$.ajax({
			url: "data/" + hS + "/" + mS,
			dataType: 'json',
			async: false,
			success: function(d) {
				dataList = dataList.concat(d);
			}
		});
		setTimeout(getData, 60000); //每60秒取一次数据
	};
	getData();
	var renderMap = setInterval(function() {
		worldTwinkleList = [];
		chinaTwinkleList = [];
		if (dataList.length !== 0) {
			var d = dataList.shift(0);
			currentFive.push(d);
			if (currentFive.length > 5) {
				currentFive.shift(0);
			}
			//更新左下角的数据
			$onlinecount.numberFlip( parseInt(d.total_online_count) );
			$msgcount.numberFlip( parseInt(d.total_msg_ack_count) );

			//拆分国内和国外数据
			contryList = {};
			for (var key in d) {
				if (provinceList[key]) {
					var pKey = provinceList[key];
					pKey.age_distribute = d[key].age_distribute;
					pKey.msg_ack = d[key].msg_ack;
					pKey.online_user = d[key].online_user;
				} else {
					contryList[key] = d[key];
				}
			}
			//绘制地图上的点
			var countPoints = function(Map, List, width, height, pointList, twinkleList) {
				var add = {};
				for (var key in Map) {
					var target = Map[key];
					var range = target.length;
					var data = List[key];
					var online_user = data.online_user;
					//计算各省在线用户增量
					if (!pointList[key]) pointList[key] = [];
					add[key] = parseInt(online_user / 10000) - pointList[key].length;
					//增量为正数则新增点，反之则减少点
					if (add[key] >= 0) {
						for (var i = 0; i < add[key]; i++) {
							var grid = parseInt(Math.random() * range);
							pointList[key].push({
								x: parseInt(target[grid][0] * 10 + Math.random() * 10),
								y: parseInt(target[grid][1] * 10 + Math.random() * 10)
							});
						}
					} else {
						for (var j = 0; j < add[key]; j++)
							pointList[key].shift(0);
					}
					//判断是否产生亮点
					var last = currentFive[currentFive.length - 2];
					if (last) {
						//if (last[key].online_user - online_user > 0) {
						var grid = parseInt(Math.random() * range);
						var item = {
							x: parseInt(target[grid][0] * 10 + Math.random() * 10),
							y: parseInt(target[grid][1] * 10 + Math.random() * 10),
							size: last[key].online_user - online_user
						};
						if (last[key].online_user - online_user > 0) {
							item.mode = 'add';
						} else {
							item.mode = 'dec'
						}
						twinkleList.push(item);
					}
				}
			};
			countPoints(Utils.chinaMap, provinceList, 1000, 840, chinaDotList, chinaTwinkleList);
			countPoints(Utils.worldMap, contryList, 1580, 780, worldDotList, worldTwinkleList);
			var drawPoints = function(pointList, twinkleList, ctx, twinklectx, width, height, base) {
				//绘制普通点
				ctx.clearRect(0, 0, width, height);
				for (var key in pointList) {
					var list = pointList[key];
					for (var i = 0; i < list.length; i++) {
						ctx.beginPath();
						var p = list[i];
						//ctx.arc(p.x, p.y, base, Math.PI * 2, false);
						ctx.fillRect(p.x, p.y, base, base);
						ctx.fill();
					}
				}
				//对闪烁数组进行预处理
				for (var i = 0; i < twinkleList.length; i++) {
					var ti = twinkleList[i];
					ti.size = Math.log(Math.abs(twinkleList[i].size)) * 5;
					if (ti.mode === 'add') {
						ti.cursize = 1;
						ti.step = (ti.size - ti.cursize) / 10;
					} else {
						ti.cursize = ti.size;
						ti.step = -ti.size / 10;
					}
				}
				var twinkleCount = 0;
				var renderTwinkle = function() {
					twinklectx.clearRect(0, 0, width, height);
					for (var i = 0; i < twinkleList.length; i++) {
						twinklectx.beginPath();
						var p = twinkleList[i];
						var gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
						gradient.addColorStop(0, "white");
						gradient.addColorStop(0.2, "rgba(21,54,113,1)");
						//gradient.addColorStop(0.2, "#ffcf00"); 
						gradient.addColorStop(0.5, "rgba(21,54,113,0.5)");
						gradient.addColorStop(1, "rgba(21,54,113,1)");
						twinklectx.fillStyle = gradient;
						twinklectx.arc(p.x, p.y, p.cursize, Math.PI * 2, false);
						p.cursize += p.step;
						twinklectx.fill();
						//twinklectx.stroke();
					}
					twinkleCount++;
					if (twinkleCount < 10) setTimeout(renderTwinkle, 90);
				};
				if (twinkleList.length > 0) {
					renderTwinkle();
				}
			};
			drawPoints(chinaDotList, chinaTwinkleList, chinactx, chinatwinklectx, 1000, 840, 2);
			drawPoints(worldDotList, worldTwinkleList, worldctx, worldtwinklectx, 1580, 780, 1);
		}
	}, 1000);
})();