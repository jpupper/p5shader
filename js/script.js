import * as p5 from 'p5';
let RM;
const P5 = new p5((sk) => {
	sk.preload = ()=> {
		RM = new RenderManager();
		RM.addShader("shaders/generative/fondodesolated.frag", 0);
		//RM.addShader("shaders/imageprocessing/cgamadness.frag",1);
	}

	sk.setup= ()=> {
		createCanvas(windowWidth, windowHeight, WEBGL);
	}

	sk.draw= ()=> {
		translate(-width / 2, -height / 2, 0); //this is necesary for setting the point of origin as usual
		RM.draw();
		RM.update();
		ellipse(mouseX, mouseY, 20, 20);
	}


	sk.windowResized= ()=> {
		resizeCanvas(windowWidth, windowHeight);
		RM.resize();
	}
})




