let RM;
function preload() {
	RM = new RenderManager();
	RM.addShader("shaders/generative/fondodesolated.frag", 0);
	//RM.addShader("shaders/imageprocessing/cgamadness.frag",1);
}

function setup() {
	createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {
	translate(-width / 2, -height / 2, 0); //this is necesary for setting the point of origin as usual
	RM.draw();
	RM.update();
	ellipse(mouseX, mouseY, 20, 20);
}


function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	RM.resize();
}
