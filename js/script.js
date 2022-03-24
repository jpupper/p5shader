import {RenderManager} from "./shaderrender";
import { Interface } from './interface'
import { Timeline } from './timeline'
import { FPS } from './fps'

window.setup=function(){
		createCanvas(windowWidth, windowHeight);
	}

window.preload=function() {
		this.RM = new RenderManager();
		this.RM.addShader("shaders/generative/fondodesolated.frag", 0, "fondodesolated");
		// this.RM.addShader("shaders/imageprocessing/cgamadness.frag", 1, "cgamadness");
		this.fps = new FPS();
		this.timeline = new Timeline();
		console.log(this.RM)
		this.I = new Interface(this.RM);
		// RM.addShader("shaders/imageprocessing/cgamadness.frag",1);
		// this.windowResized()
	}

window.draw= function () {
		// this.translate(-width / 2, -height / 2, 0); //this is necesary for setting the point of origin as usual
		translate(0 , 0,  0); //this is necesary for setting the point of origin as usual
		this.fps.update();
		this.timeline.update();
		this.RM.draw();
		this.RM.update(this.timeline.getTime());
		//this.RM.ellipse(100, 100, 80, 80);
		this.I.update();
		this.I.draw();
		ellipse(mouseX, mouseY, 20, 20);
	}

window.windowResized = function () {
		this.resizeCanvas(windowWidth, windowHeight);
		this.RM.resize();
	}
