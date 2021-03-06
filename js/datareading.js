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
	chinactx.shadowBlur = 10;
	chinactx.shadowColor = "#f69701";
	worldctx.fillStyle = '#f69701';
	worldctx.shadowBlur = 10;
	worldctx.shadowColor = "#f69701";

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
			d.total_online_count.toLocaleString();
			$onlinecount.text(parseInt(d.total_online_count).toLocaleString());
			$msgcount.text(d.total_msg_ack_count.toLocaleString());
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
			var renderMap = function(mapGrid, width, height, ctx) {

			}
			var chinaMap = Utils.chinaMap;
			chinactx.beginPath();
			for (var key in chinaMap) {
				var province = chinaMap[key];
				var data = provinceList[key];
				var online_user = data.online_user / 10000;
				var range = province.length;
				//绘制点
				for (var i = 0; i < online_user; i++) {
					var grid = parseInt(Math.random() * range);
					var x = Math.random() * 10;
					var y = Math.random() * 10;
					chinactx.moveTo(province[grid][0] * 10 + x - 2, province[grid][1] * 10 + y);
					chinactx.arc(province[grid][0] * 10 + x, province[grid][1] * 10 + y, 2, 0, Math.PI * 2, true);
				}
			}
			chinactx.clearRect(0, 0, 1000, 840);
			chinactx.fill();
			//世界
			var worldMap = Utils.worldMap;
			worldctx.beginPath();
			for (var key in worldMap) {
				var contry = worldMap[key];
				var data = contryList[key];
				var online_user = data.online_user / 10000;
				var range = contry.length;
				//绘制点
				for (var i = 0; i < online_user; i++) {
					var grid = parseInt(Math.random() * range);
					var x = Math.random() * 10;
					var y = Math.random() * 10;
					worldctx.moveTo(contry[grid][0] * 10 + x - 1, contry[grid][1] * 10 + y);
					worldctx.arc(contry[grid][0] * 10 + x, contry[grid][1] * 10 + y, 1, 0, Math.PI * 2, true);
				}
			}
			worldctx.clearRect(0, 0, 1580, 780);
			worldctx.fill();
		}
	}, 1000);
})();