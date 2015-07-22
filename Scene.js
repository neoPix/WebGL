(function(c){
	c = c || this;

	var Scene = function(canvas){
		this.canvas = canvas;
		this.gl = null;
		this.meshs = [];
		this._updateMethods = [];
		this._mvMatrixStack = [];
		this.init();
	};

	Scene.prototype = {
		init : function(){
			this.initGL();

			this.gl.clearColor(0.0, 0, 0.0, 1.0);
        	this.gl.enable(this.gl.DEPTH_TEST);

        	this.mvMatrix = mat4.create();
    		this.pMatrix = mat4.create();
		},
		initGL: function(){
			try{
				this.gl = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl");
				this.updateSize();
			}
			catch(e){
				throw { message: "Cannot create a webGl context for this scene", ex: e };
			}
		},
		getMesh: function(path, shader){
			return new Mesh(this.gl, path, shader);
		},
		getShaderFromId: function(vertexShader, fragmentShader){
			var shader = new Shader(this.gl);
			shader.attachShadersFromId(vertexShader, fragmentShader);
			return shader;
		},
		addMesh: function(mesh){
			this.meshs.push(mesh);
		},
		updateSize: function(){
			this.gl.viewportWidth = this.canvas.width;
			this.gl.viewportHeight = this.canvas.height;
		},
		addUpateMethod: function(method){
			this._updateMethods.push(method);
		},
		removeUpateMethod: function(method){
			var pos = this._updateMethods.indexOf(method);
			if(pos >= 0)
				this._updateMethods.splice(pos, 1);
		},
		update: function(){
			var self = this;
			this.meshs = [];
			this._updateMethods.forEach(function(method){
				method.apply(self);
			});
		},
		mvPushMatrix: function() {
			var copy = mat4.create();
			mat4.set(this.mvMatrix, copy);
			this._mvMatrixStack.push(copy);
		},
		mvPopMatrix: function() {
			if (this._mvMatrixStack.length == 0) {
				throw "Invalid popMatrix!";
			}
			this.mvMatrix = this._mvMatrixStack.pop();
		},
		draw: function(){
			this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
			this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

			mat4.perspective(45, this.gl.viewportWidth / this.gl.viewportHeight, 0.1, 100.0, this.pMatrix);
			mat4.identity(this.mvMatrix);
			mat4.translate(this.mvMatrix, [0, 0.0, -6]);

			var self = this;
			this.meshs.forEach(function(mesh){
				mesh.render(self);
			});
		},
		tick: function(){
			if(!this.__paused){
				window.requestAnimationFrame(this.tick.bind(this));
				this.update();
				this.draw();
			}
		}
	};

	c.Scene = Scene;

})(window)