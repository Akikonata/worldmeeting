(function() {
	//获取当前时间
	var Dt = new Date();
	var hours = Dt.getHours();
	var minutes = Dt.getMinutes() - 1;
	var seconds = Dt.getSeconds();
	var secondsList = [];
	$.ajax({
		url: "data/",
		dataType: 'json',
		success: function(d) {
			console.log(d);
		}
	});
	var worlddots = $("#world-dots")[0];
	var chinadots = $("#china-dots")[0];
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