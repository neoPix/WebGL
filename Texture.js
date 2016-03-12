(function(c){
	c = c || this;

	class Texture{
		constructor(gl){
			this.gl = gl;
			this.texture = null;
		}
		load(texture, reverse){
			this.texture = texture;
			this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
			if(reverse)this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
			this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, texture.image);
			this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
			this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_NEAREST);
			this.gl.generateMipmap(this.gl.TEXTURE_2D);
			this.gl.bindTexture(this.gl.TEXTURE_2D, null);
		}
	}

	class TextureCache{
		constructor(){
			this.loadedTextures = {};
		}
		get(path, gl){
			var self = this;
			return new Promise(function(resolve, reject){
				if(self.loadedTextures[path]){
					resolve(self.loadedTextures[path]);
				}
				var t = gl.createTexture();
				t.image = new Image();
				t.image.onload = function() {
					var texture = new Texture(gl);
					texture.load(t, path.split('.').pop().toLowerCase() == "gif");
					self.loadedTextures[path] = texture;
					resolve(self.loadedTextures[path]);
				}
				t.image.src = path;
			});
		}
	}

	c.Texture = Texture;
	c.Texs = new TextureCache();

})(window)
