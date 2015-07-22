(function(c){
	c = c || this;

	var Mesh = function(gl, path, shader){
		this.gl = gl;
		this.object = null;
		this.shader = shader;
		this.position = {x: 0, y: 0, z: 0};
		this.direction = {x: 0, y: 0, z: 0};
		this.init(path);
	};

	Mesh.prototype = {
		init: function(path){
			var self = this;
			c.Objs.get(path, this.gl).then(function(obj){
				self.object = obj;
			});
		},
		render: function(scene){
			scene.mvPushMatrix();

			mat4.translate(scene.mvMatrix, [this.position.x, this.position.y, this.position.z]);
			mat4.rotateX(scene.mvMatrix, this.direction.x);
			mat4.rotateY(scene.mvMatrix, this.direction.y);
			mat4.rotateZ(scene.mvMatrix, this.direction.z);

			if(this.object && this.object.vertexBuffer){
				this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.object.vertexBuffer);
				this.gl.vertexAttribPointer(this.shader.shaderProgram.vertexPositionAttribute, this.object.vertexBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
				
				if(this.object.colorBuffer){
					this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.object.colorBuffer);
					this.gl.vertexAttribPointer(this.shader.shaderProgram.vertexColorAttribute, this.object.colorBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
				}

				this.shader.setmatrixUniform(scene.pMatrix, scene.mvMatrix);
				this.gl.drawArrays(this.gl.TRIANGLES, 0, this.object.vertexBuffer.numItems);
			}
			scene.mvPopMatrix();
		}
	};

	c.Mesh = Mesh;

})(window)