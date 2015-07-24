(function(c){
	c = c || this;

	var Keyboard = function(){
		this.__keys = {};
	};

	Keyboard.prototype = {
		bind: function(){
			this.keyupBindedFunction = this.manageKeyUp.bind(this);
			this.keydownBindedFunction = this.manageKeyDown.bind(this);

			window.addEventListener('keyup', this.keyupBindedFunction);
			window.addEventListener('keydown', this.keydownBindedFunction);
		},
		unbind: function(){
			window.removeEventListener('keyup', this.keyupBindedFunction);
			window.removeEventListener('keydown', this.keydownBindedFunction);
		},
		manageKeyUp: function(event){
			this.__keys[event.keyCode] = 4;
		},
		manageKeyDown: function(event){
			this.__keys[event.keyCode] = 1;
		},
		update: function(){
			for(var key in this.__keys){
				if(this.__keys[key] > 4){
					delete this.__keys[key];
					continue;
				}

				if(this.__keys[key] < 3  || this.__keys[key] > 3){
					this.__keys[key]++;
				}
			}
		},
		k: function(code){
			return this.__keys[code] >= 1 && this.__keys[code] <= 4;
		},
		kp: function(code){
			return this.__keys[code] === 2;
		},
		kr: function(code){
			return this.__keys[code] === 4;
		}
	};

	c.Keyboard = Keyboard;
	c.Kb = new Keyboard();

})(window)