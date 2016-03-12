(function(c){
	c = c || this;

	class Mesh{
		constructor(gl, path, shader){
			this.gl = gl;
			this.object = null;
			this.shader = shader;
			this.position = {x: 0, y: 0, z: 0};
			this.direction = {x: 0, y: 0, z: 0};
			this.textures = {};
			this.init(path);
		}
		init(path){
			var self = this;
			c.Objs.get(path, this.gl).then(function(obj){
				self.object = obj;
			});
			this.setTexture(0, "Textures/white.png");
		}
		setTexture(number, path){
			var self = this;
			c.Texs.get(path, this.gl).then(function(texture){
				self.textures[number] = texture;
			});
		}
		render(scene){
			scene.camera.mvPushMatrix();

			var meshMatrix = mat4.create();
			mat4.identity(meshMatrix);

			mat4.translate(meshMatrix, [this.position.x, this.position.y, this.position.z]);
			mat4.rotateX(meshMatrix, this.direction.x);
			mat4.rotateY(meshMatrix, this.direction.y);
			mat4.rotateZ(meshMatrix, this.direction.z);

			mat4.multiply(scene.camera.mvMatrix, meshMatrix);

			if(this.object && this.object.vertexBuffer && this.shader.shaderProgram.vertexPositionAttribute >= 0){
				this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.object.vertexBuffer);
				this.gl.vertexAttribPointer(this.shader.shaderProgram.vertexPositionAttribute, this.object.vertexBuffer.itemSize, this.gl.FLOAT, false, 0, 0);

				if(this.object.colorBuffer && this.shader.shaderProgram.vertexColorAttribute >= 0){
					this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.object.colorBuffer);
					this.gl.vertexAttribPointer(this.shader.shaderProgram.vertexColorAttribute, this.object.colorBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
				}

				if(this.object.texCordBuffer && this.shader.shaderProgram.textureCoordAttribute >= 0){
					this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.object.texCordBuffer);
					this.gl.vertexAttribPointer(this.shader.shaderProgram.textureCoordAttribute, this.object.texCordBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
				}

				if(this.object.vertexNormalBuffer && this.shader.shaderProgram.vertexNormalAttribute >= 0){
					this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.object.vertexNormalBuffer);
					this.gl.vertexAttribPointer(this.shader.shaderProgram.vertexNormalAttribute, this.object.vertexNormalBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
				}

				for(var index in this.textures){
					this.gl.activeTexture(this.gl['TEXTURE'+index]);
					this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures[index].texture);
				}
				this.gl.uniform1i(this.shader.shaderProgram.colorMapSamplerUniform, 0);
				this.gl.uniform1i(this.shader.shaderProgram.normalMapSamplerUniform, 1);

				this.gl.uniform3f(this.shader.shaderProgram.pointLightingLocationUniform, 0, 0, 1.5);
				this.gl.uniform3f(this.shader.shaderProgram.pointLightingColorUniform, 1, 1, 1);

				this.shader.setmatrixUniform(scene.camera.pMatrix, scene.camera.mvMatrix);
				this.gl.drawArrays(this.gl.TRIANGLES, 0, this.object.vertexBuffer.numItems);
			}
			scene.camera.mvPopMatrix();
		}
	}

	c.Mesh = Mesh;

})(window)
