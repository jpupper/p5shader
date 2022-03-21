import p5 from 'p5';
import {RenderManager} from './shaderrender'
import {FPS} from './shaderrender'
import {Timeline} from './shaderrender'

class Sketch extends p5{
	constructor() {
		// Unfortunately you still need to pass the function here,
		// otherwise P5 will think that you want the global style
		super(() => {})
	}
	setup(){
		this.createCanvas(this.windowWidth, this.windowHeight);
	}

	preload(){
		this.RM = new RenderManager();
		this.RM.addShader("shaders/generative/fondodesolated.frag", 0);
		this.RM.addShader("shaders/imageprocessing/cgamadness.frag", 1);
		this.fps = new FPS();
		this.timeline = new Timeline();
		// RM.addShader("shaders/imageprocessing/cgamadness.frag",1);
		// this.windowResized()
	}

	draw() {
		const {width, height, mouseX, mouseY} = this
		// this.translate(-width / 2, -height / 2, 0); //this is necesary for setting the point of origin as usual
		this.translate(0 , 0,  0); //this is necesary for setting the point of origin as usual
		this.fps.update();
		this.timeline.update();
		this.RM.draw();
		this.RM.update(this.timeline.getTime());
		//this.ellipse(mouseX, mouseY, 20, 20);
	}

	windowResized() {
		const {windowWidth, windowHeight} = this
		this.resizeCanvas(windowWidth, windowHeight);
		this.RM.resize();
	}
}

new Sketch()
