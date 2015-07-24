(function(c){
	c = c || this;

	var Mouse = function(){
		this.__keys = {};
		this.__pos = {x: 0, y: 0};
		this.__oldpos = {x: 0, y: 0};
		this.__move = {x: 0, y: 0};
	};

	Mouse.prototype = {
		bind: function(){
			this.mouseupBindedFunction = this.manageMouseUp.bind(this);
			this.mousedownBindedFunction = this.manageMouseDown.bind(this);
			this.mousemoveBindedFunction = this.manageMouseMove.bind(this);

			window.addEventListener('mouseup', this.mouseupBindedFunction);
			window.addEventListener('mousedown', this.mousedownBindedFunction);
			window.addEventListener('mousemove', this.mousemoveBindedFunction);
		},
		unbind: function(){
			window.removeEventListener('mouseup', this.mouseupBindedFunction);
			window.removeEventListener('mousedown', this.mousedownBindedFunction);
			window.removeEventListener('mousemove', this.mousemoveBindedFunction);
		},
		update: function(){
			if(this.frameMove){
				this.__move.x = this.__pos.x - this.__oldpos.x;
				this.__move.y = this.__oldpos.y - this.__pos.y;
				this.frameMove = false;
			}
			else{
				this.__move.x = 0;
				this.__move.y = 0;
			}
		},
		manageMouseMove: function(event){
			this.__oldpos.x = this.__pos.x;
			this.__oldpos.y = this.__pos.y;
			this.__pos.x = event.clientX;
			this.__pos.y = event.clientY;
			this.frameMove = true;
		},
		manageMouseUp: function(event){
			delete this.__keys[event.buttons];
		},
		manageMouseDown: function(event){
			this.__keys[event.buttons] = true;
		},
		b: function(code){
			return this.__keys[code] === true;
		},
		pos: function(scene){
			var vec = {
				x: this.__pos.x - scene.canvas.offsetLeft,
				y: this.__pos.y - scene.canvas.offsetTop
			}

			if(vec.x < 0 || vec .y < 0 || vec.x > scene.canvas.width || vec.y > scene.canvas.height)
				vec = null;

			return vec;
		},
		mv: function(){
			return this.__move;
		}
	};

	c.Mouse = Mouse;
	c.Ms = new Mouse();

})(window)