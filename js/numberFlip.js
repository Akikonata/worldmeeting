if($)
	$.fn.numberFlip = function( num, param ){
		param = param || {};
		var width = param.width;
		if(width){
			$(this).width(width).attr('data-width', width || 'auto');
		}else{
			width = width || $(this).attr('data-width');
		}
		

		var numbers;
		if( !$(this).attr('flip-init') ){
			var str = '<span>0</span><span>1</span><span>2</span>' + 
					'<span>3</span><span>4</span><span>5</span>' + 
					'<span>6</span><span>7</span><span>8</span><span>9</span>';
			str += str;

			var spans = '<span>' + num.toLocaleString().split('').join('</span><span>') + '</span>';

			numbers = $(this).html( spans ).find('span').addClass('num-flip').each(function(i, span){
				var num = span.innerHTML;
				if((/[0-9]/g).test( num )){
					$(span).attr('data-num', 0 ).html('0');
				}
			});

			var w = numbers.width(),
				h = numbers.height();

			$(numbers[0]).css({
				'margin-left' : ( width - w*numbers.length ) + 'px'
			});

			numbers.css({
				width : w + 'px',
				height : h + 'px'
			}).each(function(i, number){
				var num = $(number).attr('data-num');
				if(num){
					$(number).html('<span class="numbers">' + str + '</span>').find('span.numbers').css({
						width : w + 'px',
						'-webkit-transform' : 'translate3d(0,'+ (( - num) * h) +'px,0)'
					});
				}

			});

			$(this).attr('flip-init', true);
		}else{
			// TODO: 数字位数变化处理

			// var newNumbers = num.toLocaleString();
			numbers = $(this).find('span.num-flip');

			var w = numbers.width(),
				h = numbers.height();

			// if( numbers.length > newNumbers.length ){
			// 	var diff = numbers.length - newNumbers.length;
			// 	var k = diff;
			// 	while(k--){
			// 		$(numbers[k]).remove();
			// 	}

			// 	$(numbers[diff]).css({
			// 		'margin-left' : ( w*diff ) + 'px'
			// 	});
			// }

			
		}

		var arr = num.toLocaleString().split('');
		var self = this;
		for(var i=0; i<arr.length; i++){

			if( (/[0-9]/g).test( arr[i] ) ){

				(function(i){
					setTimeout(function(){
						var numbers = $('.num-flip', self);
						var last = $(numbers[i]).attr('data-num'),
							num = arr[i],
							offset = Number(arr[i]);

						if( num < last ){
							offset += 10;
						}

						var obj = $(numbers[i]).find('span.numbers');

						obj.css({
							'-webkit-transition' : (param.dur||600) + 'ms ease',
							'-webkit-transform' : 'translate3d( 0,' + (( - offset) * h) + 'px, 0)'
						});
						
						obj[0].removeEventListener("webkitTransitionEnd");
						obj[0].addEventListener("webkitTransitionEnd", function(){
							obj.css({
								'-webkit-transition' : '0s',
								'-webkit-transform' : 'translate3d( 0,' + (( - num) * h) + 'px, 0)'
							});
						}, false);

						$(numbers[i]).attr('data-num', num);

					}, 200 * Math.random());
				})(i)

			}
		}

	}