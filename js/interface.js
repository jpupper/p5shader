class Interface{
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
			if (RM.objts[RM.activeRender].localUniformsNames.length > 0 ) {
				for (let i = 0; i < RM.objts[RM.activeRender].localUniformsNames.length; i++) {
					let sl = new Slider(60, 
										yy, 
										RM.objts[RM.activeRender].localUniformsNames[i], 
										RM.objts[RM.activeRender].localUniformsValues[i],
										w,
										h);
					yy += sepy+5;
					this.sliders.push(sl);
				}
			}
			for (let i = 0; i < RM.objts.length; i++) {
				let x = windowWidth * .45;
				let y =  i * 50 + sepy +marginsepydown;
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

class Cajita {
	constructor(x, y, name, index,isActiveOne) {
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

	constructor(x, y,name,value,w,h) {
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
