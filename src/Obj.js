export class Obj{
	constructor(gl){
		this.gl = gl;
		this.vertexBuffer = null;
		this.colorBuffer = null;
		this.texCordBuffer = null;
		this.vertexNormalBuffer = null;
	}
	load(data){
		if(data.vertexPositions){
			this.vertexBuffer = this.gl.createBuffer();
			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
			this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data.vertexPositions), this.gl.STATIC_DRAW);
			this.vertexBuffer.itemSize = 3;
			this.vertexBuffer.numItems = data.vertexPositions.length / 3;
		}
		if(data.vertexColors){
			this.colorBuffer = this.gl.createBuffer();
			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
			this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data.vertexColors), this.gl.STATIC_DRAW);
			this.colorBuffer.itemSize = 4;
			this.colorBuffer.numItems = data.vertexColors.length / 4;
		}
		if(data.vertexTextureCoords){
			this.texCordBuffer = this.gl.createBuffer();
			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCordBuffer);
			this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data.vertexTextureCoords), this.gl.STATIC_DRAW);
			this.texCordBuffer.itemSize = 2;
			this.texCordBuffer.numItems = data.vertexTextureCoords.length / 2;
		}
		if(data.vertexNormals){
			this.vertexNormalBuffer = this.gl.createBuffer();
			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexNormalBuffer);
			this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data.vertexNormals), this.gl.STATIC_DRAW);
			this.vertexNormalBuffer.itemSize = 3;
			this.vertexNormalBuffer.numItems = data.vertexNormals.length / 3;
		}
	}
}

class ObjCache{
	constructor(){
		this.loadedObjects = {};
	}
	get(path, gl){
		var self = this;
		return new Promise((resolve, reject) => {
			if(self.loadedObjects[path]){
				resolve(self.loadedObjects[path]);
			}

			var request = new XMLHttpRequest();
			request.open("GET", path);
			request.onreadystatechange = () => {
				if (request.readyState == 4) {
					if(request.status == 200){
						var obj = new Obj(gl);
						obj.load(JSON.parse(request.responseText));
						self.loadedObjects[path] = obj;
						resolve(obj);
					}
					else{
						reject();
					}
				}
			}
			request.send();
		});
	}
}

export const Objs = new ObjCache();
