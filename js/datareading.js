(function() {
	var provinceList = Utils.provinces;
	var dataList = [];
	//初始化绘图所需的canvas
	var worlddots = $("#world-dots")[0];
	var chinadots = $("#china-dots")[0];
	var chinactx = chinadots.getContext("2d");
	var $onlinecount = $("#onlinecount");
	var $msgcount = $("#msgcount");
	chinactx.fillStyle = '#f69701';
	chinactx.shadowBlur = 10;
	chinactx.shadowColor = "#f69701";
	//获取当前时间
	var getData = function() {
		var Dt = new Date();
		var hours = Dt.getHours();
		var minutes = Dt.getMinutes() - 1;
		var seconds = Dt.getSeconds();
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
	};

	getData();
	setInterval(function() {
		if (dataList.length !== 0) {
			var d = dataList.shift(0);
			//更新左下角的数据
			d.total_online_count.toLocaleString();
			$onlinecount.text(parseInt(d.total_online_count).toLocaleString());
			$msgcount.text(d.total_msg_ack_count.toLocaleString());
			//拆分国内和国外数据
			// var chinaMap = Utils.chinaMap;
			// for (var key in chinaMap) {
			// 	var xizang = chinaMap[key];
			// 	var range = xizang.length;
			// 	for (var i = 0; i < 10; i++) {
			// 		var grid = parseInt(Math.random() * range);
			// 		var x = Math.random() * 10;
			// 		var y = Math.random() * 10;
			// 		chinactx.moveTo(xizang[grid][0] * 10 + x - 1, xizang[grid][1] * 10 + y);
			// 		chinactx.arc(xizang[grid][0] * 10 + x, xizang[grid][1] * 10 + y, 1, 0, Math.PI * 2, true);
			// 	}
			// }
			chinactx.fill();
		} else {
			//getData();
		}
	}, 1000);
})();