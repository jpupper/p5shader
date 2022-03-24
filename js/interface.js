
export class Interface {
	//var cosos = [];
	constructor(RM) {
		this.drawActive = true;
		this.RM = RM;
		this.generateSliders();
	}
	generateSliders() {
		this.cajitas = [];
		this.sliders = [];

		let margintop = 20;
		let sepy = 30;
		let marginsepydown = 10;
		let yy = margintop;
		let w = 150;
		let h = sepy;

		if (this.RM.objts.length > 0 && this.RM.shorojb[this.RM.activeRender] != 1) {
			if (this.RM.objts[this.RM.activeRender].localUniformsNames.length > 0 ) {
				for (let i = 0; i < this.RM.objts[this.RM.activeRender].localUniformsNames.length; i++) {
					let sl = new Slider(60,
										yy,
						this.RM.objts[this.RM.activeRender].localUniformsNames[i],
						this.RM.objts[this.RM.activeRender].localUniformsValues[i],
										w,
										h);
					yy += sepy+5;
					this.sliders.push(sl);
				}
			}
			for (let i = 0; i < this.RM.objts.length; i++) {
				let x = windowWidth * .45;
				let y =  i * 50 + sepy +marginsepydown;
				let isActiveOne = false;
				if (this.RM.activeRender == i) {
					isActiveOne = true;
				}
				if (this.RM.objts[i] != null) {
					this.cajitas.push(new Cajita(x, y, this.RM.objts[i].name, i, isActiveOne));
				}
			}
		}
	}
	update() {
		if (this.sliders.length > 0) {
			for (var i = 0; i < this.RM.objts[RM.activeRender].localUniformsNames.length; i++) {
				if (this.sliders[i].value != null) {
					this.RM.objts[RM.activeRender].localUniformsValues[i] = this.sliders[i].value;
					this.RM.objts[RM.activeRender].sh.setUniform(this.RM.objts[RM.activeRender].localUniformsNames[i], this.sliders[i].value);
				}
			}
		}
	}
	draw() {
		if (this.drawActive) {
			if (this.sliders.length > 0) {
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

		//console.log("asas");
		fill(255,0,0);
		ellipse(mouseX, mouseY, 150, 200);
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

export class Cajita{
	constructor(x, y, name, index, isActiveOne) {

		this.pos = createVector(x, y);
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
		textAlign(this.LEFT, this.CENTER);

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
export class Slider{

	constructor(x, y, name, value, w, h) {
		this.pos = createVector(x, y);
		this.name = name;
		this.w = w;
		this.h = h;
		this.isFxHashControlled = false;
		this.value = value;
    }

	draw() {

		let xx = this.pos.x ;
		let yy = this.pos.y ;
		let mx = mouseX ;
		let my = mouseY ;

		//FONDO
		fill(0);
		rect(xx, yy, this.w, this.h);

		if (this.isFxHashControlled) {
			if (overRect(mx, my, xx, yy, this.w, this.h)) {
				fill(255,0,0);
				if (mouseIsPressed) {
					this.value = map(mx, xx, xx + this.w, 0.0, 1.0);
					console.log(this.value);
				}
			} else {
				fill(150,0,0);
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
		text(this.name, xx+ this.w/2, yy+this.h/2);
	}
}
