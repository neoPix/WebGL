(function(c){
	c = c || this;

	var Shader = function(gl){
		this.gl = gl;
		this.shaderProgram = null;
		this.init();
	};

	Shader.prototype = {
		init : function(){
			this.shaderProgram = this.gl.createProgram();
		},
		setmatrixUniform: function(pMatrix, mvMatrix){
			this.gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, pMatrix);
        	this.gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, mvMatrix);
		},
		attachShaders: function(vshader, fshader){
			this.gl.attachShader(this.shaderProgram, vshader);
			this.gl.attachShader(this.shaderProgram, fshader);
			this.gl.linkProgram(this.shaderProgram);

			if (!this.gl.getProgramParameter(this.shaderProgram, this.gl.LINK_STATUS)) {
				throw { message: "Could not initialize shaders on context", ex: null };
        	}

        	this.gl.useProgram(this.shaderProgram);

        	this.shaderProgram.vertexPositionAttribute = this.gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
			this.gl.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);

			this.shaderProgram.vertexColorAttribute = this.gl.getAttribLocation(this.shaderProgram, "aVertexColor");
        	this.gl.enableVertexAttribArray(this.shaderProgram.vertexColorAttribute);

			this.shaderProgram.pMatrixUniform = this.gl.getUniformLocation(this.shaderProgram, "uPMatrix");
			this.shaderProgram.mvMatrixUniform = this.gl.getUniformLocation(this.shaderProgram, "uMVMatrix");
		},
		attachShadersFromId: function(vertexShaderId, fragmentShaderId){
			this.attachShaders(this.__getShader(vertexShaderId), this.__getShader(fragmentShaderId));
		},
		__getShader: function(id){
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
	};

	c.Shader = Shader;

})(window)