import p5 from 'p5';
import { genR } from './utils';
let WEBGL_ON = false; //Algunas funcionan con esto otras no. //Si cambia esto cambia e

class RenderManager extends p5{
	//var cosos = [];
	constructor(){
		super(() => {})
		this.pgs = [];//ARRAY DE LOS PGRAPHICS
		this.objts = [];//ARRAY DE LOS OBJETOS
		this.shorojb = []; //ESTO ES PARA QUE SEPA SI TIPO TIENE QUE O ACTUALIZAR EL SHADER O EL OBJETO.
		this.activeRender = 0;
		this.timestamp = null;
		this.filename;
		this.mainShader;
		setTimeout(() => {
			setInterval(() => {
				this.checkTimeStamp();
			}, 200);
		}, 1000)
	}

	setup(){
		this.createCanvas(this.windowWidth, this.windowHeight);
	}

	clean() {
		this.pgs = [];//ARRAY DE LOS PGRAPHICS
		this.objts = [];//ARRAY DE LOS OBJETOS
		this.shorojb = []; //Array que determina si el objeto es un shader o no (?)
	}

	checkTimeStamp() {
		if (this.objts.length > 0) {
			for (var i = 0; i < this.objts.length; i++) {
				if (this.objts[i] != null) {
					let obj = this.objts[i];
					fetch(obj.filename, {cache: 'no-store'}).then(r => {
						var ts = r.headers.get('Last-Modified');
						if (obj.timestamp && ts != obj.timestamp) {
							obj.load(obj.filename + '?version=' + this.random(100));
						}
						obj.timestamp = ts;
					});
				}
			}
		}
	}

	addShader(dir,index,_name){
		this.objts[index] = new ShaderManager(dir);
		this.objts[index].name = _name;
		this.objts[index].filename = dir;
		let auxpg;
	
			auxpg = this.createGraphics(this.windowWidth, this.windowHeight, this.WEBGL);
  
		this.pgs.push(auxpg);
		this.shorojb[index] = 0;
		if (index > this.activeRender) {
			this.activeRender = index;
		}
	}
	addP5draw(obj,index){
		const {WEBGL_ON, QUADCANVAS, windowWidth, windowHeight, WEBGL} = this
		if (WEBGL_ON) {
			this.pgs[index] = createGraphics(windowWidth, windowHeight, WEBGL);
		} else {
			this.pgs[index] = createGraphics(windowWidth, windowHeight);
		}

		this.objts[index] = obj;
		this.shorojb[index] = 1;

		if (index > this.activeRender) {
			this.activeRender = index;
		}

	}
	resizePG(w, h, index) {
		this.pgs[index].resizeCanvas(w,h);
    }
	resize(){
		for (var i =0; i<this.pgs.length; i++){
			console.log("RISIZ "+i);
			this.pgs[i].resizeCanvas(this.windowWidth,this.windowHeight);
		}
	}


	draw(_x,_y,_w,_h){

		let w = this.windowWidth;
		let h = this.windowHeight;

		if (_w) {
			w = _w;
		}

		if (_h) {
			h = _h;
		}

		let x = 0;
		let y = 0;

		if (_x) {
			x = _x;
		}

		if (_y) {
			y = _y;
		}
		this.updateDrawOnBuffers();
		if (this.pgs.length > 0 && this.pgs[this.activeRender] != null) {
			this.image(this.pgs[this.activeRender], x, y, w, h);
		}
	}
	updateDrawOnBuffers() {
		for (var i = 0; i < this.pgs.length; i++) {
			if (this.shorojb[i] == 1) {
				if (this.objts[i] != null) {
					this.objts[i].draw(this.pgs[i]);
				}
			} else if (this.shorojb[i] == 0) {
				if (this.objts[i].loaded) {
					this.pgs[i].shader(this.objts[i].sh);
				}
				this.pgs[i].rect(this.windowWidth, this.windowHeight, 0, 0);
			}
		}
    }
	update(time){
		for (var i =0; i<this.objts.length; i++){		
			if (this.shorojb[i] == 1) {
				if (this.objts[i] != null) {
					this.objts[i].update(null, time);
				}
			}else if(this.shorojb[i] == 0){
				this.objts[i].update(this.pgs[i], time);
			}
		}
		this.updateNONglobalUniforms();
	}
	updateNONglobalUniforms() {
		if (this.objts.length > 0) {
			for (var i = 1; i < this.objts.length; i++) {
				if (this.objts[i] != null && this.shorojb[i] == 0) {
					this.objts[i].sh.setUniform("tx", this.pgs[i - 1]);
				}
			}
		}
	}

	//Bueno que lea todos los nombres y que setee a todos los nombres que coindicen con eso ya fue
	setValue(name,val,gui){
		//No se que tan bien esta que esto lo haga todos los frames pero bueno.
		for (let j = 0; j < this.objts.length; j++) {
			if (this.objts[j] != null) {
				for (let i = 0; i < this.objts[j].localUniformsNames.length; i++) {
					if (this.objts[j].localUniformsNames[i] == name) {
						//RM.objts[j].sh.setUniform(RM.objts[j].localUniformsNames[i], Object.values(uniforms_fxhash)[k]);
						this.objts[j].localUniformsValues[i] = val;
						this.objts[i].sh.setUniform(name,val);
					}
					/*if(!gui){
						for (let u = 0; u < interface.sliders.length; u++) {
							if (interface.sliders[u].name == name) {
								interface.sliders[u].isFxHashControlled = true;
								interface.sliders[u].value = val;
							}
						}
					}*/
				}
			}
		}
	}
}

class ShaderManager extends p5{
	constructor(dir) {
		super(() => {})
		this.load(dir);
	}
	load(dir) {
		this.loaded = false;
		this.reservedWords = ["feedback","resolution","time",
							 "mouse","tx","tx2","tx3","let","mousePressed",
		"tp1","tp2","tp3","tp4","tp5","touchesCount"];


		if (!this.loaded) {
			this.localUniformsNames = [];
			this.localUniformsValues = [];
			this.dir = dir;

			this.name = dir;
			//pasarAarray();
			this.loadStrings(dir, (result) => {
				let localUniformsValues = [];
				let localUniformsNames = [];
				for (let i = 0; i < result.length; i++) {
					let nombreUniform;
					let words = result[i].split(' ');
					//localUniformsNames.push(words[2]);
					//localUniformsValues.push(genR(1));

					let noReservedWord = false;
					for(let k=0; k<this.reservedWords.length; k++){
						if(words[2] == this.reservedWords[k]){
							noReservedWord = true;
						}
					}
					if (result[i].includes("uniform") && !noReservedWord){
						localUniformsNames.push(words[2]);
						localUniformsValues.push(genR(1));
					}
				}
				//console.log("TERMINO EL CALLBACK");
				this.localUniformsNames = localUniformsNames;
				this.localUniformsValues = localUniformsValues;
			});0
			this.sh = this.loadShader('shaders/base.vert', this.dir, () => {
				this.loaded = true;
			});
		}
	}
	setup(){
		this.createCanvas(this.windowWidth, this.windowHeight);
		this.loadAllVariables();
	}
	loadAllVariables(dir) {
		if (!this.loaded) {
			this.localUniformsNames = [];
			this.localUniformsValues = [];
			this.dir = dir;

			this.name = dir;
			//pasarAarray();
			this.loadStrings(dir, (result) => {
				let localUniformsValues = [];
				let localUniformsNames = [];
				for (let i = 0; i < result.length; i++) {
					let nombreUniform;
					let words = result[i].split(' ');
					//localUniformsNames.push(words[2]);
					//localUniformsValues.push(genR(1));

					let noReservedWord = false;
					for(let k=0; k<this.reservedWords.length; k++){
						if(words[2] == this.reservedWords[k]){
							noReservedWord = true;
						}
					}
					if (result[i].includes("uniform") && !noReservedWord){
						localUniformsNames.push(words[2]);
						localUniformsValues.push(genR(1));
					}
				}
				this.localUniformsNames = localUniformsNames;
				this.localUniformsValues = localUniformsValues;
			});
			this.sh = this.loadShader('shaders/base.vert', this.dir, () => {
				this.loaded = true;
			});
		}
	}
	update(_pg, time) {
		const {width, height, mouseX, mouseY, touches, mouseIsPressed} = this;
		//This are the global uniforms. The ones for all shaders
		//Estas son los uniforms globales, las que entran en todos los shaders
		if (this.loaded) {
			this.sh.setUniform("feedback",_pg)
			this.sh.setUniform("resolution", [width, height])
			if (time || time === 0) {
				this.sh.setUniform("time", time);
			} else {
				this.sh.setUniform("time", this.millis()*.001);
			}
			this.sh.setUniform("mouse", [mouseX / width, mouseY / height])
			if (touches.length > 0) {
				this.sh.setUniform("tp1", [touches[0].x / width, touches[0].y / height]);
			}
			if (touches.length > 1) {
				this.sh.setUniform("tp2", [touches[1].x / width, touches[1].y / height]);
			}
			if (touches.length > 2) {
				this.sh.setUniform("tp3", [touches[2].x / width, touches[2].y / height]);
			}
			if (touches.length > 3) {
				this.sh.setUniform("tp4", [touches[3].x / width, touches[3].y / height]);
			}
			if (touches.length > 4) {
				this.sh.setUniform("tp5", [touches[4].x / width, touches[4].y / height]);
			}
			this.sh.setUniform("touchesCount", touches.length);
			if(mouseIsPressed){
				this.sh.setUniform("mousePressed", 1);
			}else{
				this.sh.setUniform("mousePressed", 0);
			}

			for (var i = 0; i < this.localUniformsNames.length; i++) {
				this.sh.setUniform(this.localUniformsNames[i],
								   this.localUniformsValues[i]);
			}
		}
	}
}

export {RenderManager}
