import p5 from 'p5';

let cargoArchivo = true;
let WEBGL_ON = false; //Algunas funcionan con esto otras no. //Si cambia esto cambia e
let QUADCANVAS = false;
var dropzone;

function initdropzone() {

	dropzone = select('#defaultCanvas0');
	dropzone.dragOver(highlight);
	dropzone.dragLeave(unhighlight);
	dropzone.drop(processFile, unhighlight);
}
function updateNONglobalUniforms() {
	if (RM.objts.length > 0) {
		for (var i = 1; i < RM.objts.length; i++) {
			if (RM.objts[i] != null && RM.shorojb[i] == 0) {
				RM.objts[i].sh.setUniform("tx", RM.pgs[i - 1]);
			}
		}
	}
}
function highlight() {
	//console.log("HIGHLIGHT");
}
function unhighlight() {
	//console.log("UNHIGHLIGHT");
}
function processFile(file) {
	console.log("processfile");
	console.log(file.name);
	let coso;


	if (file.name.includes(".frag")) {


		/*if (RM.objts.length == 0) {
			RM.addShader(file.data, RM.activeRender + 1);
		} else {
		}*/
		interface2.drawActive = false;
		interface2.cleanSliders();
		console.log(file.data);
		RM.addShader(file.data, RM.activeRender + 1, file.name);

	} else if (file.name.includes(".json")) {
		loadJSONjp(file.data);
	}
}
function loadJSONjp(filedata) {

	RM.clean();
	let k = 0;

	let GlocalNames = [];
	let GlocalValues = [];

	for (let key in filedata) {
		if (filedata.hasOwnProperty(key)) {
			RM.addShader(filedata[key].dir, k, filedata[key].name);
			let localNames = [];
			let localValues = [];
			let l = 0;
			for (let [key2, value] of Object.entries(filedata[key])) {
				if (l != 0) {
					localNames.push(key2);
					localValues.push(value);
				}
				l++;
			}
			setTimeout(() => {
				if (!disableDrawInterface) {
					interface2.cleanSliders();
				}
				for (let i = 0; i < RM.objts.length; i++) {
					for (let o = 0; o < RM.objts[i].localUniformsNames.length; o++) {

						RM.objts[i].localUniformsNames[o] = GlocalNames[i][o + 1];
						//Le pongo el +1 para que no me tome el name como uno de los parametros del shader.
						RM.objts[i].localUniformsValues[o] = GlocalValues[i][o + 1];
						/*console.log(RM.objts[i].localUniformsNames[o]);
						console.log(RM.objts[i].localUniformsValues[o]);
						console.log(GlocalNames[i][o]);
						console.log(GlocalValues[i][o]);*/
					}
				}
				console.log("TERMINO DE SETEAR LOS ARCHIVOS ")
				RM.activeRender = RM.objts.length - 1;
				cargoArchivo = true;
			}, 500);
			GlocalNames.push(localNames);
			GlocalValues.push(localValues);
		}
		k++;
	}
}
function loadJSONonStart(filedata) {
	let coso = loadJSON(filedata, () => {
		loadJSONjp(coso);
	});
}
function loadSaveFile(data) {
	console.log(data);
}
function saveToJson() {
	let json = {}
	for (var k = 0; k < RM.objts.length; k++) {
		json["box" + k] = {};
		json["box" + k].dir = RM.objts[k].dir;
		json["box" + k].name = RM.objts[k].name;
		for (var i = 0; i < RM.objts[k].localUniformsNames.length; i++) {
			json["box" + k][RM.objts[k].localUniformsNames[i]] = RM.objts[k].localUniformsValues[i];
		}
		if (json["box" + k]["data"]) {
			delete json["box" + k]["data"];
		}
	}
	saveJSON(json, 'savefile1.json');
}
function touchStarted() {
	return false;
}
function touchEnded() {
	return false;
}
class Interface {
	//var cosos = [];
	constructor(RM) {
		this.generateSliders();
		this.drawActive = true;
	}
	generateSliders() {
		this.cajitas = [];
		this.sliders = [];
		this.rm = RM;
		let margintop = 20;
		let sepy = 30;
		let marginsepydown = 10;
		let yy = margintop;

		let w = 150;
		let h = sepy;
		if (RM.objts.length > 0 && RM.shorojb[RM.activeRender] != 1) {
			if (RM.objts[RM.activeRender].localUniformsNames.length > 0) {
				for (let i = 0; i < RM.objts[RM.activeRender].localUniformsNames.length; i++) {
					let sl = new Slider(60,
						yy,
						RM.objts[RM.activeRender].localUniformsNames[i],
						RM.objts[RM.activeRender].localUniformsValues[i],
						w,
						h);
					yy += sepy + 5;
					this.sliders.push(sl);
				}
			}
			for (let i = 0; i < RM.objts.length; i++) {
				let x = this.windowWidth * .45;
				let y = i * 50 + sepy + marginsepydown;
				//var cajita = ;

				let isActiveOne = false;

				if (RM.activeRender == i) {
					isActiveOne = true;
				}

				if (RM.objts[i] != null) {
					this.cajitas.push(new Cajita(x, y, RM.objts[i].name, i, isActiveOne));
				}
			}
		}
	}
	update() {
		if (this.sliders.length > 0) {
			for (var i = 0; i < RM.objts[RM.activeRender].localUniformsNames.length; i++) {
				if (this.sliders[i].value != null) {
					RM.objts[RM.activeRender].localUniformsValues[i] = this.sliders[i].value;
					RM.objts[RM.activeRender].sh.setUniform(RM.objts[RM.activeRender].localUniformsNames[i], this.sliders[i].value);
				}
			}
		}
	}
	draw() {
		if (this.drawActive) {
			if (this.sliders.length > 0) {


				//fill(255,0,0);
				//rect(this.sliders[0].pos.x, this.sliders[0].pos.y, 200 * 2., this.sliders[this.sliders.length - 1].pos.y + 20 * this.sliders.length);
				for (var i = 0; i < this.sliders.length; i++) {
					this.sliders[i].draw();
				}
			}

			if (this.cajitas.length > 0) {
				for (var i = 0; i < this.cajitas.length; i++) {
					this.cajitas[i].draw();
				}
			}
		}
	}
	cleanSliders() {
		this.cajitas = [];
		this.sliders = [];
	}
	randomizeValues() {
		for (var i = 0; i < this.sliders.length; i++) {
			this.sliders[i].value = random(0, 1);
		}

	}
}

class Cajita extends p5{
	constructor(x, y, name, index, isActiveOne) {
		super(() => {})
		this.pos = this.createVector(x, y);
		this.name = name;
		this.index = index;
		this.w = 200;
		this.h = 30;
		this.active = isActiveOne;
	}


	draw() {
		let txt = this.name + " " + this.index;

		if (this.active) {
			fill(255);
		} else {
			fill(0);
		}
		rect(this.pos.x, this.pos.y, textWidth(txt), this.h);
		textAlign(LEFT, CENTER);

		if (this.active) {
			fill(0);
		} else {
			fill(255);
		}
		text(txt, this.pos.x, this.pos.y + 15);
		//rect(mouseX - windowWidth/2,mouseY - windowHeight/2, 200, 400);
	}
	update() {

	}
}
class Slider {

	constructor(x, y, name, value, w, h) {
		this.pos = createVector(x, y);
		this.name = name;
		this.w = w;
		this.h = h;
		this.isFxHashControlled = false;
		this.value = value;
	}

	draw() {

		let xx = this.pos.x;
		let yy = this.pos.y;
		let mx = mouseX;
		let my = mouseY;

		//FONDO
		fill(0);
		rect(xx, yy, this.w, this.h);

		if (this.isFxHashControlled) {
			if (overRect(mx, my, xx, yy, this.w, this.h)) {
				fill(255, 0, 0);
				if (mouseIsPressed) {
					this.value = map(mx, xx, xx + this.w, 0.0, 1.0);
					console.log(this.value);
				}
			} else {
				fill(150, 0, 0);
			}
		} else {
			if (overRect(mx, my, xx, yy, this.w, this.h)) {
				fill(255);
				if (mouseIsPressed) {
					this.value = map(mx, xx, xx + this.w, 0.0, 1.0);
					console.log(this.value);
				}
			} else {
				fill(150);
			}
		}
		//RECT SUPERIOR:
		rect(xx, yy, map(this.value, 0., 1., 0, this.w), this.h);
		fill(255);
		textSize(20);
		textAlign(CENTER, CENTER);
		text(this.name, xx + this.w / 2, yy + this.h / 2);
	}

}


class RenderManager extends p5{
	//var cosos = [];
	constructor(){
		super(() => {})
		this.pgs = [];//ARRAY DE LOS PGRAPHICS
		this.objts = [];//ARRAY DE LOS OBJETOS
		this.shorojb = []; //ESTO ES PARA QUE SEPA SI TIPO TIENE QUE O ACTUALIZAR EL SHADER O EL OBJETO.
		this.activeRender = 0;
	}

	setup(){
		this.createCanvas(this.windowWidth, this.windowHeight);
	}

	clean() {
		this.pgs = [];//ARRAY DE LOS PGRAPHICS
		this.objts = [];//ARRAY DE LOS OBJETOS
		this.shorojb = []; //Array que determina si el objeto es un shader o no (?)
	}

	addShader(dir,index,_name){
		this.objts[index] = new ShaderManager(dir);
		this.objts[index].name = _name;

		let auxpg;
		if (QUADCANVAS) {
			auxpg = this.createGraphics(windowHeight, windowHeight, this.WEBGL);
		} else {
			auxpg = this.createGraphics(this.windowWidth, this.windowHeight, this.WEBGL);
        }


		this.pgs.push(auxpg);
		this.shorojb[index] = 0;

		if (index > this.activeRender) {
			this.activeRender = index;
		}

	}
	addP5draw(obj,index){
		const {WEBGL_ON, QUADCANVAS, windowWidth, windowHeight, WEBGL} = this
		if (WEBGL_ON) {
			if (QUADCANVAS) {
				this.pgs[index] = createGraphics(windowHeight, windowHeight, WEBGL);
			} else {
				this.pgs[index] = createGraphics(windowWidth, windowHeight, WEBGL);
			}
		} else {
			if (QUADCANVAS) {
				this.pgs[index] = createGraphics(windowHeight, windowHeight);
			} else {
				this.pgs[index] = createGraphics(windowWidth, windowHeight);
			}
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
	update(){
		for (var i =0; i<this.objts.length; i++){
			if (this.shorojb[i] == 1) {
				if (this.objts[i] != null) {
					this.objts[i].update();
				}
			}else if(this.shorojb[i] == 0){
				this.objts[i].update(this.pgs[i]);
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
			});
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
	update(_pg) {
		const {width, height, mouseX, mouseY, touches, mouseIsPressed} = this;
		//This are the global uniforms. The ones for all shaders
		//Estas son los uniforms globales, las que entran en todos los shaders
		if (this.loaded) {
			this.sh.setUniform("feedback",_pg)
			this.sh.setUniform("resolution", [width, height])
			this.sh.setUniform("time", this.millis()*.001)
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

class ManagerTemplate {
	constructor(name) {

		this.name = name;
		this.dir = name;
		this.duration = 300;
		this.lasttime = 0;
		this.localUniformsNames = [];
		this.localUniformsValues = [];
		this.loaded = false;
		this.generate = true;
	}
}


//TEMPLATE PARTICLE FOR POSITION SPEED AND ALL
class Particle {

	constructor(_p,
		_sp,
		_ac,
		_speedlimit) {

		this.p = _p;
		this.sp = _sp;

		this.lifespeed = 0.7;
		this.life = 255;
		//this.sp = createVector(random(-10,10),random(-10,10));
		this.ac = _ac;
		this.speedlimit = _speedlimit;

		//	this.prevp = createVector(0,0);
	}

	display(_ps) {
		if (!_ps) {
			ellipse(this.p.x, this.p.y, 10, 10);
		} else {
			_ps.ellipse(this.p.x, this.p.y, 10, 10);
		}
	}
	update() {
		this.sp.add(this.ac);
		this.sp.limit(this.speedlimit);
		this.p.add(this.sp);

		this.life -= this.lifespeed;

		if (this.p.x > width) {
			this.p.x = 0;
		}
		if (this.p.x < 0) {
			this.p.x = width;
		}
		if (this.p.y > height) {
			this.p.y = 0;
		}
		if (this.p.y < 0) {
			this.p.y = height;
		}
	}
	applyForce(f) {
		this.ac.add(f);
		this.sp.add(this.ac);
		this.ac.mult(0);
	}
	seek(target) {
		let desired = p5.Vector.sub(target, this.p);
		desired.setMag(this.speedlimit);
		let steering = p5.Vector.sub(desired, this.sp);
		this.applyForce(steering);
	}


}



function getFromPalette(index) {

	palettec1 = [
		color(246, 80, 80),
		color(200, 229, 221),
		color(248, 233, 205),
		color(25, 200, 210, 255),
		color(29, 85, 212, 255),
		color(241, 246, 254),
		color(234, 178, 152),
		color(247, 181, 105),
		color(0),
		color(236, 47, 88),
		color('#5F4B8BFF'),
		color('#00203FFF'),
		color('#101820FF'),
		color('#101820FF')
	]

	palettec2 = [
		color(217, 185, 88),
		color(13, 155, 230),
		color(108, 51, 223),
		color(225, 35, 40, 255),
		color(183, 189, 74, 255),
		color(144, 50, 40),
		color(47, 114, 199),
		color(2, 106, 113),
		color(255, 255),
		color(50, 66, 110),
		color('#E69A8DFF'),
		color('#ADEFD1FF'),
		color('#FEE715FF'),
		color(100, 255, 100)

	]
	let indx = 0;

	if (!index) {
		indx = floor(genR(palettec1.length));
	} else {
		indx = index;
	}
	console.log(genR(10));


	//	indx = 13
	//console.log(palettec1[0]);

	return cmanager = {
		c1: palettec1[indx],
		c2: palettec2[indx],
		index: indx
	};
}

function genR(min, max) {
	let result = 0;
	if (!max) { result = fxrand() * (min - 0) + 0; } else { result = fxrand() * (max - min) + min; }
	return result;
}
function mapr(_value, _low2, _high2) {
	let val = _low2 + (_high2 - _low2) * (_value - 0.) / (1.0 - 0.);
	//float val = 0.1;
	return val;
}
function star(x, y, radius1, radius2, npoints) {
	let angle = TWO_PI / npoints;
	let halfAngle = angle / 2.0;
	beginShape();
	for (let a = 0; a < TWO_PI; a += angle) {
		let sx = x + cos(a) * radius2;
		let sy = y + sin(a) * radius2;
		vertex(sx, sy);
		sx = x + cos(a + halfAngle) * radius1;
		sy = y + sin(a + halfAngle) * radius1;
		vertex(sx, sy);
	}
	endShape(CLOSE);
}

function star2(x, y, radius1, radius2, npoints, _ps) {
	if (_ps) {
		let angle = TWO_PI / npoints;
		let halfAngle = angle / 2.0;
		_ps.beginShape();
		for (let a = 0; a < TWO_PI; a += angle) {
			let sx = x + cos(a) * radius2;
			let sy = y + sin(a) * radius2;
			_ps.vertex(sx, sy);
			sx = x + cos(a + halfAngle) * radius1;
			sy = y + sin(a + halfAngle) * radius1;
			_ps.vertex(sx, sy);
		}
		_ps.endShape(CLOSE);
	} else {
		let angle = TWO_PI / npoints;
		let halfAngle = angle / 2.0;
		beginShape();
		for (let a = 0; a < TWO_PI; a += angle) {
			let sx = x + cos(a) * radius2;
			let sy = y + sin(a) * radius2;
			vertex(sx, sy);
			sx = x + cos(a + halfAngle) * radius1;
			sy = y + sin(a + halfAngle) * radius1;
			vertex(sx, sy);
		}
		endShape(CLOSE);
	}


}


//CORNER OVERRECT :
function overRect(mx, my, x, y, w, h) {
	if (mx > x && mx < x + w && my > y && my < y + h) {
		return true;
	} else {
		return false;
	}
}

function shuffle(array) {
	var i = array.length,
		j = 0,
		temp;
	while (i--) {

		j = Math.floor(fxrand() * (i + 1));

		// swap randomly chosen element with current element
		temp = array[i];
		array[i] = array[j];
		array[j] = temp;

	}
	return array;
}


class imgManager {
	constructor(px, py, dir, cnt, w, h, _index) {
		//this.imgs = [];
		this.pos = createVector(px, py);
		this.index = 0;
		this.dir = dir;
		if (_index != null) {
			this.index = _index;
		} else {
			this.index = floor(genR(cnt))
		}
		let dir2 = dir + (1 + this.index).toString() + ".png";

		this.img = loadImage(dir2);
		this.w = w;
		this.h = h;
		this.flipx = false;
	}


	setIndex(_index) {
		this.index = _index;
		let dir2 = this.dir + (1 + this.index).toString() + ".png";

		this.img = loadImage(dir2);
	}
	display() {
		push();
		if (this.flipx) {
			scale(-1, 1)
			this.image(this.img, -this.pos.x - this.w / 2, this.pos.y, this.w, this.h);
		} else {
			this.image(this.img, this.pos.x, this.pos.y, this.w, this.h);
		}
		pop();
	}
	setPos(x, y) {
		this.pos.x = x;
		this.pos.y = y;
	}
	setW(w) {
		this.w = w;
	}
	setH(h) {
		this.h = h;
	}

	imgW() {
		return this.img.width;
	}
	imgH() {
		return this.img.height;
	}
}

//Esta es para levantar la de ride
class imgManager2 {
	constructor(px, py, dir, w, h, _index) {
		//this.imgs = [];
		this.pos = createVector(px, py);

		let dir2 = dir + ".png";

		this.img = loadImage(dir2);
		this.w = w;
		this.h = h;
		this.flipx = false;
	}

	display() {
		push();
		if (this.flipx) {
			scale(-1, 1)
			this.image(this.img, -this.pos.x - this.w / 2, this.pos.y, this.w, this.h);
		} else {
			this.image(this.img, this.pos.x, this.pos.y, this.w, this.h);
		}
		pop();
	}
	setPos(x, y) {
		this.pos.x = x;
		this.pos.y = y;
	}
	setW(w) {
		this.w = w;
	}
	setH(h) {
		this.h = h;
	}

	imgW() {
		return this.img.width;
	}
	imgH() {
		return this.img.height;
	}
}

class AnimatedLine {
	constructor(x1, y1, x2, y2, segmentLength, spaceLength, size) {
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
		this.segmentLength = segmentLength;
		this.spaceLength = spaceLength;
		this.size = size;
		// Calculate length
		this.L = sqrt(
			pow((this.x1 - this.x2), 2) +
			pow((this.y1 - this.y2), 2));
		//  console.log(this.L)

		// calculate angle
		this.S = atan2(this.y2 - this.y1, this.x2 - this.x1)

		// calculate number of segments
		this.numS = this.L / (this.segmentLength + this.spaceLength)

		this.beginningLength = 0;
	}

	move(rate) {
		this.beginningLength += rate
		if (this.beginningLength >= this.segmentLength + this.spaceLength) {
			this.beginningLength = 0;
		}
	}


	display() {
		if (this.beginningLength > this.spaceLength) {

			this.webGLline(this.x1,
				this.y1,
				this.x1 + (this.beginningLength - this.spaceLength) * cos(this.S),
				this.y1 + (this.beginningLength - this.spaceLength) * sin(this.S)
			)
		}

		for (let i = 0; i < this.numS; i++) {

			var distCheck = sqrt(
				pow(
					(this.segmentLength + this.spaceLength) * (i + 1)
					* cos(this.S) - this.spaceLength * cos(this.S)
					+ this.beginningLength * cos(this.S), 2)
				+ pow((this.segmentLength + this.spaceLength) * (i + 1)
					* sin(this.S) - this.spaceLength * sin(this.S)
					+ this.beginningLength * sin(this.S), 2))

			if (distCheck <= this.L) {
				this.webGLline(
					this.x1 + (this.segmentLength + this.spaceLength) * i
					* cos(this.S) + this.beginningLength * cos(this.S),
					this.y1 + (this.segmentLength + this.spaceLength) * i
					* sin(this.S) + this.beginningLength * sin(this.S),
					this.x1 + (this.segmentLength + this.spaceLength) * (i + 1)
					* cos(this.S) - this.spaceLength * cos(this.S)
					+ this.beginningLength * cos(this.S),
					this.y1 + (this.segmentLength + this.spaceLength) * (i + 1)
					* sin(this.S) - this.spaceLength * sin(this.S)
					+ this.beginningLength * sin(this.S)
				)
			} else {


				var distCheck =
					sqrt(
						pow((this.segmentLength + this.spaceLength) * i
							* cos(this.S) + this.beginningLength * cos(this.S), 2)
						+ pow((this.segmentLength + this.spaceLength) * i
							* sin(this.S) + this.beginningLength * sin(this.S), 2))

				if (distCheck < this.L) {
					this.webGLline(
						this.x1 + (this.segmentLength + this.spaceLength) * i
						* cos(this.S) + this.beginningLength * cos(this.S),
						this.y1 + (this.segmentLength + this.spaceLength) * i
						* sin(this.S) + this.beginningLength * sin(this.S),
						this.x2, this.y2
					)
				}
			}
		}
	}
	webGLline(_x1, _y1, _x2, _y2) {

		push();
		translate(_x1, _y1);
		rotate(atan2(_y1 - _y2, _x1 - _x2));
		rect(0, 0, this.size, 2);
		pop();

	}
}
export {RenderManager}
