import p5 from 'p5';
import {RenderManager} from './shaderrender'
import noiseVert from './shaders/noise.vert'
import noiseFrag from './shaders/noise.frag'

class Sketch extends p5{
	constructor() {
		// Unfortunately you still need to pass the function here,
		// otherwise P5 will think that you want the global style
		super(() => {})
	}
	setup(){
		this.createCanvas(this.windowWidth, this.windowHeight, this.WEBGL);
		this.noiseShader = this.createShader(noiseVert, noiseFrag);
	}

	preload(){
		// this.RM = new RenderManager();
		// this.RM.addShader("shaders/generative/fondodesolated.frag", 0);
		// the vertex shader is called for each vertex



		// RM.addShader("shaders/imageprocessing/cgamadness.frag",1);
		// this.windowResized()
	}

	draw() {
		const {width, height, mouseX, mouseY, rotateX, rotateY, rotateZ, shader, box, frameCount} = this
		// this.translate(-width / 2, -height / 2, 0); //this is necesary for setting the point of origin as usual
		this.push();
		this.translate(-width / 2, -height / 2, 0); //this is necesary for setting the point of origin as usual
		// this.RM.draw();
		// this.RM.update();
		this.ellipse(mouseX, mouseY, 20, 20);
		this.pop();
		this.rotateZ(frameCount * 0.01);
		this.rotateX(frameCount * 0.01);
		this.rotateY(frameCount * 0.01);
		//pass image as texture
		this.shader(this.noiseShader);
		this.box(width / 10);


	}

	windowResized() {
		const {windowWidth, windowHeight} = this
		this.resizeCanvas(windowWidth, windowHeight);
		// this.RM.resize();
	}
}

new Sketch()
