import { p5i } from 'p5i'
import {RenderManager} from "./shaderrender";
import { Interface } from './interface'
import { Timeline } from './timeline'
import { FPS } from './fps'

const { mount, createCanvas, translate, ellipse } = p5i()

const sketch = {
	setup({windowWidth, windowHeight}){
		createCanvas(windowWidth, windowHeight);
	},

	preload(ctx) {
		this.RM = new RenderManager(ctx);
		this.RM.addShader("shaders/generative/fondodesolated.frag", 0);
		//this.RM.addShader("shaders/imageprocessing/cgamadness.frag", 1);
		//this.fps = new FPS();
		this.timeline = new Timeline(ctx);
		//this.I = new Interface(this.RM);
		// RM.addShader("shaders/imageprocessing/cgamadness.frag",1);
		// this.windowResized()
	},

	draw({mouseX, mouseY}) {
		// this.translate(-width / 2, -height / 2, 0); //this is necesary for setting the point of origin as usual
		translate(0 , 0,  0); //this is necesary for setting the point of origin as usual
		//this.fps.update();
		this.timeline.update();
		this.RM.draw();
		this.RM.update(this.timeline.getTime());
		//this.RM.ellipse(100, 100, 80, 80);
		//this.I.update();
		//this.I.draw();
		ellipse(mouseX, mouseY, 20, 20);
	},

	windowResized({windowWidth, windowHeight}) {
		this.resizeCanvas(windowWidth, windowHeight);
		this.RM.resize();
	}
}

mount(document.getElementById('canvas'), sketch)
