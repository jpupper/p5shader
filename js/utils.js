

export function genR(min, max) {
	let result = 0;
	if (!max) { result = fxrand() * (min - 0) + 0; } else { result = fxrand() * (max - min) + min; }
	return result;
}
export function mapr(_value, _low2, _high2) {
	let val = _low2 + (_high2 - _low2) * (_value - 0.) / (1.0 - 0.);
	//float val = 0.1;
	return val;
}



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
