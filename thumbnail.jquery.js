// Usage: $("#id").thumbnail({src: 'image.jpg', dest: 'thumb', width: 50, height: 50});
//
// #id is id of canvas tag (source image)
// src (required) is source image
// dest (required) is id of <image> tag where thumbnail is displayed
// width (optional) is width of thumbnail, default 100
// height (optional) is height of thumbnail, default 100
// fit (optional) is yes/no, fits canvas to image, default yes
//   
// Jeff Zemla, 5-26-2010
// jeffzemla@gmail.com

(function($){
	$.fn.thumbnail = function(options) { 
		
		$.fn.thumbnail.defaults = {
			width: 100,
			height: 100,
			fit: 'yes'
		};
		
		var options = $.extend($.fn.thumbnail.defaults, options);

		// Break if required src or dest arguments are missing
		if (!options.src || !options.dest) { return this; }		
		
		return this.each(function() {
			var $element = $(this);
			var element_id = $element.attr('id');
					
			var rad_x = options.width / 2;
			var rad_y = options.height / 2;
					
			var ctx = document.getElementById(element_id).getContext('2d');  
			var img = new Image();
			img.src = options.src; 
			
			img.onload = function(){  
				// Fit canvas to image if applicable
				if (options.fit == "yes") {
					document.getElementById(element_id).width = img.width;
					document.getElementById(element_id).height = img.height;
				}
				// Draw image
				ctx.drawImage(img,0,0);
			}  

			$element.mousemove(function(event) {
				var x = event.pageX - document.getElementById(element_id).offsetLeft;
				var y = event.pageY - document.getElementById(element_id).offsetTop;
				
				// Make sure overlay stays in canvas
				if (x < rad_x) { x = rad_x; }
				if (y < rad_y) { y = rad_y; }
				if (x > ($element.width() - rad_x)) { x = $element.width() - rad_x; }
				if (y > ($element.height() - rad_y)) { y = $element.height() - rad_y; }
				
				// Reset canvas
				ctx.drawImage(img,0,0);

				//Draw overlay
				ctx.fillStyle = "rgba(200,200,200,.5)";
				ctx.fillRect(x-rad_x,y-rad_y,options.width,options.height);
			});
			
			$element.mouseout(function() {
				ctx.drawImage(img,0,0);
			});
			
			$element.click(function(event) {
				var thumbnail = document.createElement('canvas');
					thumbnail.width = options.width;
					thumbnail.height = options.height;
				var thumbnailx = thumbnail.getContext('2d');  
				
				var x = event.pageX - document.getElementById(element_id).offsetLeft;
				var y = event.pageY - document.getElementById(element_id).offsetTop;
				var source_x = x - rad_x;
				var source_y = y - rad_y;
				
				// Protect edges
				if (source_x < 0) { source_x = 0; }
				if (source_y < 0) { source_y = 0; }
				if (source_x > ($element.width() - options.width)) { source_x = $element.width() - options.width; }
				if (source_y > ($element.height() - options.height)) { source_y = $element.height() - options.height; }
				
				// Create thumbnail on invisible canvas
				thumbnailx.drawImage(img, source_x, source_y, options.width, options.height, 0, 0, options.width, options.height);
	
				// Display thumbnail as PNG
				var thumb_png = thumbnail.toDataURL();
				$("#" + options.dest).attr('src',thumb_png);
				$("#" + options.dest).show();
			});
		});
	};
})(jQuery);
