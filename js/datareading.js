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
	var chinactx = chinadots.getContext("2d");
	var worldctx = worlddots.getContext("2d");
	var $onlinecount = $("#onlinecount");
	var $msgcount = $("#msgcount");
	chinactx.fillStyle = '#f69701';
	//chinactx.shadowBlur = 10;
	chinactx.shadowColor = "#f69701";
	worldctx.fillStyle = '#f69701';
	//worldctx.shadowBlur = 10;
	worldctx.shadowColor = "#f69701";
	chinactx.globalCompositeOperation = "lighter";
	worldctx.globalCompositeOperation = "lighter";
	var inited = false; //判断地图是否已经初始化过

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
		if (dataList.length !== 0) {
			var d = dataList.shift(0);
			currentFive.push(d);
			if (currentFive.length > 5) {
				currentFive.shift(0);
			}
			//更新左下角的数据
			$onlinecount.numberFlip(parseInt(d.total_online_count));
			$msgcount.numberFlip(parseInt(d.total_msg_ack_count));
			// $onlinecount.html( addSpan(parseInt(d.total_online_count).toLocaleString()) );
			// $msgcount.html(d.total_msg_ack_count.toLocaleString());
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
			var renderPoints = function(Map, List, ctx, width, height, base) {
				ctx.clearRect(0, 0, width, height);
				//if (!inited) {
				for (var key in Map) {
					var target = Map[key];
					var data = List[key];
					var online_user = parseInt(data.online_user / 10000);
					var range = target.length;
					for (var i = 0; i < online_user; i++) {
						ctx.beginPath();
						var grid = parseInt(Math.random() * range);
						var p = {
							x: target[grid][0] * 10 + Math.random() * 10,
							y: target[grid][1] * 10 + Math.random() * 10,
							size: base,
							color: "#f69701"
						};
						ctx.arc(p.x, p.y, p.size, Math.PI * 2, false);
						ctx.fill();
					}
				}
				//inited = true;
				// } else {

				// }
			};
			renderPoints(Utils.chinaMap, provinceList, chinactx, 1000, 840, 2);
			renderPoints(Utils.worldMap, contryList, worldctx, 1580, 780, 1);
		}
	}, 1000);
})();