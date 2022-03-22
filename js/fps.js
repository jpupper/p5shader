import p5 from 'p5';

class FPS extends p5 {
	constructor() {
		super(() => { })
		this.fps = document.createElement('div');
		this.fps.style.position = 'fixed';
		this.fps.style.left = '10px';
		this.fps.style.top = '10px';
		this.fps.style.backgroundColor = 'rgba(0,0,0,.5)';
		this.fps.style.color = 'white';
		this.fps.style.fontSize = '30px';
		this.fps.style.padding = '10px';
		document.body.append(this.fps);
		this.prevFrame = this.millis();
		this.frame = 0;
		this.acum = 0;
		this.rate = 20;
	}

	update() {
		this.frame++;
		let dt = this.millis() - this.prevFrame;
		this.prevFrame = this.millis();
		this.acum += dt;
		if (this.frame % this.rate == 0) {
			this.fps.innerHTML = (1000 / (this.acum / this.frame)).toFixed(1);
			this.frame = 0;
			this.acum = 0;
		}
	}
}
export { FPS }
