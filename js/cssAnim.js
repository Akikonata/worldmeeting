if($)
	$.fn.cssAnim = function( attrs, param ){
		var self = this;

		function run(){
			self[0].removeEventListener("webkitTransitionEnd");
			if( param.callback ){
				self[0].addEventListener("webkitTransitionEnd", param.callback, false);
			}
			
			$(self).css(attrs);
		}

		if( param.wait ){
			setTimeout(function(){
				run();
			}, param.wait);
		}else{
			run();
		}
	}