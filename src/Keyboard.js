export class Keyboard{
	constructor(){
		this.__keys = {};
	}
	bind(){
		this.keyupBindedFunction = this.manageKeyUp.bind(this);
		this.keydownBindedFunction = this.manageKeyDown.bind(this);

		window.addEventListener('keyup', this.keyupBindedFunction);
		window.addEventListener('keydown', this.keydownBindedFunction);
	}
	unbind(){
		window.removeEventListener('keyup', this.keyupBindedFunction);
		window.removeEventListener('keydown', this.keydownBindedFunction);
	}
	manageKeyUp(event){
		this.__keys[event.keyCode] = 4;
	}
	manageKeyDown(event){
		this.__keys[event.keyCode] = 1;
	}
	update(){
		for(var key in this.__keys){
			if(this.__keys[key] > 4){
				delete this.__keys[key];
				continue;
			}

			if(this.__keys[key] < 3  || this.__keys[key] > 3){
				this.__keys[key]++;
			}
		}
	}
	k(code){
		return this.__keys[code] >= 1 && this.__keys[code] <= 4;
	}
	kp(code){
		return this.__keys[code] === 2;
	}
	kr(code){
		return this.__keys[code] === 4;
	}
}

export const Kb = new Keyboard();
