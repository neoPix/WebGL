(function(c){
	c = c || this;

	class Camera{
		constructor(gl){
			this.gl = gl;
			this.mvMatrix = mat4.create();
			this.pMatrix = mat4.create();

			this._mvMatrixStack = [];

			mat4.perspective(45, this.gl.viewportWidth / this.gl.viewportHeight, 0.1, 100.0, this.pMatrix);
			mat4.identity(this.mvMatrix);
			mat4.translate(this.mvMatrix, [0, 0.0, -6]);
		}
		mvPushMatrix() {
			var copy = mat4.create();
			mat4.set(this.mvMatrix, copy);
			this._mvMatrixStack.push(copy);
		}
		mvPopMatrix() {
			if (this._mvMatrixStack.length == 0) {
				throw "Invalid popMatrix!";
			}
			this.mvMatrix = this._mvMatrixStack.pop();
		}
	}

	c.Camera = Camera;

})(window)
