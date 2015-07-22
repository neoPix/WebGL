var img = new Image();
		img.src = "logo.png";

		img.onload = function() {
			canvas.height = img.height;
			canvas.width = img.width;

			var imageData = getImageData(img),
				colorArray = [];

			for(var y = 0; y <= img.height; y++){
				var line = [];
				for(var x = 0; x <= img.width; x++){
					line.push(getPixel(imageData, x, y));
				}
				colorArray.push(line);
			}
		}

		function getImageData( image ) {
			var canvas = document.createElement( 'canvas' );
			canvas.width = image.width;
			canvas.height = image.height;

			var context = canvas.getContext( '2d' );
			context.drawImage( image, 0, 0 );

			return context.getImageData( 0, 0, image.width, image.height );
		}

		function getPixel( imagedata, x, y ) {
			var position = ( x + imagedata.width * y ) * 4, data = imagedata.data;
			return { r: data[ position ], g: data[ position + 1 ], b: data[ position + 2 ], a: data[ position + 3 ] };
		}