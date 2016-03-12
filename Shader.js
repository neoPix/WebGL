(function(c){
	c = c || this;

	const getShader = function(id){
		var shaderScript = document.getElementById(id);
		if (!shaderScript) {
			throw { message: "Could not locate shader with id : " + id, ex: null };
		}

		var str = "";
		var k = shaderScript.firstChild;
		while (k) {
			if (k.nodeType == 3) {
				str += k.textContent;
			}
			k = k.nextSibling;
		}

		var shader;
		if (shaderScript.type == "x-shader/x-fragment") {
			shader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
		} else if (shaderScript.type == "x-shader/x-vertex") {
			shader = this.gl.createShader(this.gl.VERTEX_SHADER);
		} else {
			throw { message: "Could not define the shader type", ex: null };
		}

		this.gl.shaderSource(shader, str);
		this.gl.compileShader(shader);

		if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
			throw { message: "Could not compile shader", ex: this.gl.getShaderInfoLog(shader) };
		}

		return shader;
	}

	class Shader{
		constructor(gl){
			this.gl = gl;
			this.shaderProgram = null;
			this.init();
		}
		init(){
			this.shaderProgram = this.gl.createProgram();
		}
		setmatrixUniform(pMatrix, mvMatrix){
			this.gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, pMatrix);
        	this.gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, mvMatrix);

        	var normalMatrix = mat3.create();
			mat4.toInverseMat3(mvMatrix, normalMatrix);
			mat3.transpose(normalMatrix);
			this.gl.uniformMatrix3fv(this.shaderProgram.nMatrixUniform, false, normalMatrix);
		}
		attachShaders(vshader, fshader){
			this.gl.attachShader(this.shaderProgram, vshader);
			this.gl.attachShader(this.shaderProgram, fshader);
			this.gl.linkProgram(this.shaderProgram);

			if (!this.gl.getProgramParameter(this.shaderProgram, this.gl.LINK_STATUS)) {
				throw { message: "Could not initialize shaders on context", ex: null };
        	}

			this.gl.useProgram(this.shaderProgram);

			this.shaderProgram.vertexPositionAttribute = this.gl.getAttribLocation(this.shaderProgram, "vertexPosition");
			if(this.shaderProgram.vertexPositionAttribute >= 0){
				this.gl.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);
			}

			this.shaderProgram.vertexColorAttribute = this.gl.getAttribLocation(this.shaderProgram, "vertexColor");
			if(this.shaderProgram.vertexColorAttribute >= 0){
				this.gl.enableVertexAttribArray(this.shaderProgram.vertexColorAttribute);
			}

			this.shaderProgram.textureCoordAttribute = this.gl.getAttribLocation(this.shaderProgram, "textureCoord");
			if(this.shaderProgram.textureCoordAttribute >= 0){
				this.gl.enableVertexAttribArray(this.shaderProgram.textureCoordAttribute);
			}

			this.shaderProgram.vertexNormalAttribute = this.gl.getAttribLocation(this.shaderProgram, "vertexNormal");
			if(this.shaderProgram.vertexNormalAttribute >= 0){
				this.gl.enableVertexAttribArray(this.shaderProgram.vertexNormalAttribute);
			}

			this.shaderProgram.pMatrixUniform = this.gl.getUniformLocation(this.shaderProgram, "view");
			this.shaderProgram.mvMatrixUniform = this.gl.getUniformLocation(this.shaderProgram, "world");
			this.shaderProgram.nMatrixUniform = this.gl.getUniformLocation(this.shaderProgram, "normal");

			this.shaderProgram.colorMapSamplerUniform = this.gl.getUniformLocation(this.shaderProgram, "colorMap");
			this.shaderProgram.normalMapSamplerUniform = this.gl.getUniformLocation(this.shaderProgram, "normalMap");

			this.shaderProgram.pointLightingLocationUniform = this.gl.getUniformLocation(this.shaderProgram, "uPointLightingLocation");
        	this.shaderProgram.pointLightingColorUniform = this.gl.getUniformLocation(this.shaderProgram, "uPointLightingColor");
		}
		attachShadersFromId(vertexShaderId, fragmentShaderId){
			this.attachShaders(getShader.apply(this, [vertexShaderId]), getShader.apply(this, [fragmentShaderId]));
		}
	}
	c.Shader = Shader;

})(window)
