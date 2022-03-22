import { genR } from './utils';

let WEBGL_ON = false; //Algunas funcionan con esto otras no. //Si cambia esto cambia e

export class RenderManager{
	//var cosos = [];
	constructor(ctx){
		this.ctx = ctx;

		this.pgs = [];//ARRAY DE LOS PGRAPHICS
		this.objts = [];//ARRAY DE LOS OBJETOS
		this.shorojb = []; //ESTO ES PARA QUE SEPA SI TIPO TIENE QUE O ACTUALIZAR EL SHADER O EL OBJETO.
		this.activeRender = 0;
	}

	clean() {
		this.pgs = [];//ARRAY DE LOS PGRAPHICS
		this.objts = [];//ARRAY DE LOS OBJETOS
		this.shorojb = []; //Array que determina si el objeto es un shader o no (?)
	}

	addShader(dir,index,_name){
		this.objts[index] = new ShaderManager(dir,  this.ctx);
		this.objts[index].name = _name;
		const {createGraphics, windowWidth, windowHeight, WEBGL} = this.ctx
		let auxpg;
			auxpg = createGraphics(windowWidth, windowHeight, WEBGL);


		this.pgs.push(auxpg);
		this.shorojb[index] = 0;

		if (index > this.activeRender) {
			this.activeRender = index;
		}

	}
	addP5draw(obj,index){
		const {createGraphics, windowWidth, windowHeight, WEBGL} = this.ctx
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
			this.pgs[i].resizeCanvas(this.ctx.windowWidth,this.ctx.windowHeight);
		}
	}


	// draw(_x,_y,_w,_h){
	draw(_x,_y,_w,_h){
		let w = this.ctx.windowWidth;
		let h = this.ctx.windowHeight;

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
			this.ctx.image(this.pgs[this.activeRender], x, y, w, h);
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
				this.pgs[i].rect(this.ctx.windowWidth, this.ctx.windowHeight, 0, 0);
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

class ShaderManager{
	constructor(dir, ctx) {
		this.ctx = ctx

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
			this.ctx.loadStrings(dir, (result) => {
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
			this.sh = this.ctx.loadShader('shaders/base.vert', this.dir, () => {
				this.loaded = true;
			});
		}
	}
	setup(){
		this.loadAllVariables();
	}
	loadAllVariables(dir) {
		if (!this.loaded) {
			this.localUniformsNames = [];
			this.localUniformsValues = [];
			this.dir = dir;

			this.name = dir;
			//pasarAarray();
			loadStrings(dir, (result) => {
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
			this.sh = loadShader('shaders/base.vert', this.dir, () => {
				this.loaded = true;
			});
		}
	}
	update(_pg, time) {
		//This are the global uniforms. The ones for all shaders
		//Estas son los uniforms globales, las que entran en todos los shaders
		const {width, height, mouseIsPressed, mouseX, mouseY, touches, millis} = this.ctx
		if (this.loaded) {
			this.sh.setUniform("feedback",_pg)
			this.sh.setUniform("resolution", [width, height])
			if (time || time === 0) {
				this.sh.setUniform("time", time);
			} else {
				this.sh.setUniform("time", millis()*.001);
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

// export {RenderManager}
