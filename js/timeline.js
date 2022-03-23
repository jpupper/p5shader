class Timeline {
	constructor(ctx) {
		this.ctx = ctx;
		let that = this;
		this.currentPosition = 0;
		this.playing = true;
		this.playStart = this.ctx.millis();
		this.startTime = 0;
		this.endTime = 60;




		this.container = document.createElement('div');
		this.container.id = "timelinecontainer"
		document.body.append(this.container);


		this.range = document.createElement('input');
		this.range.type = 'range';
		this.range.style.zIndex = 10;
		this.range.style.position = 'fixed';
		this.range.style.bottom = '15px';
		this.range.style.left = '175px';
		let width = window.innerWidth;
		this.range.style.width = (width - 350) + 'px';
		this.range.id = 'timeline';
		this.range.step = 0.5;
		this.range.value = 0;
		this.range.oninput = function () { that.onChange(); }
		this.container.appendChild(this.range);

		this.play = document.createElement('button');
		this.play.style.zIndex = 10;
		this.play.style.position = 'fixed';
		this.play.style.bottom = '10px';
		this.play.style.width = '50px';
		this.play.style.height = '30px';
		this.play.style.left = '10px';
		this.play.id = 'play';
		this.play.innerHTML = '∎';
		this.play.onclick = function () { that.onPlayStop(); }
		this.container.appendChild(this.play);

		this.rewind = document.createElement('button');
		this.rewind.style.zIndex = 10;
		this.rewind.style.position = 'fixed';
		this.rewind.style.bottom = '10px';
		this.rewind.style.width = '50px';
		this.rewind.style.height = '30px';
		this.rewind.style.left = '60px';
		this.rewind.id = 'rewind';
		this.rewind.innerHTML = '⮌';
		this.rewind.onclick = function () { that.onRewind(); }
		this.container.appendChild(this.rewind);

		this.elapsed = document.createElement('input');
		this.elapsed.style.zIndex = 10;
		this.elapsed.style.position = 'fixed';
		this.elapsed.style.bottom = '10px';
		this.elapsed.style.left = '110px';
		this.elapsed.style.width = '60px';
		this.elapsed.style.height = '30px';
		this.elapsed.style.textAlign = 'center';
		this.elapsed.style.fontSize = '15px';
		this.elapsed.style.lineHeight = '30px';
		this.elapsed.style.backgroundColor = 'black';
		this.elapsed.style.color = 'white';
		this.elapsed.id = 'elapsed';
		this.container.appendChild(this.elapsed);

		this.from = document.createElement('input');
		this.from.type = 'number';
		this.from.min = 0;
		this.from.value = this.startTime;
		this.from.style.zIndex = 10;
		this.from.style.bottom = '10px';
		this.from.style.position = 'fixed';
		this.from.style.right = '90px';
		this.from.style.width = '80px';
		this.from.style.height = '30px';
		this.from.style.textAlign = 'center';
		this.from.style.fontSize = '15px';
		this.from.style.lineHeight = '30px';
		this.from.style.backgroundColor = 'black';
		this.from.style.color = 'white';
		this.from.id = 'from';
		this.from.onchange = function () { that.updateRange() }
		this.container.appendChild(this.from);

		this.to = document.createElement('input');
		this.to.type = 'number';
		this.to.min = 0;
		this.to.value = this.endTime;
		this.to.style.zIndex = 10;
		this.to.style.bottom = '10px';
		this.to.style.position = 'fixed';
		this.to.style.right = '10px';
		this.to.style.width = '80px';
		this.to.style.height = '30px';
		this.to.style.textAlign = 'center';
		this.to.style.fontSize = '15px';
		this.to.style.lineHeight = '30px';
		this.to.style.backgroundColor = 'black';
		this.to.style.color = 'white';
		this.to.id = 'from';
		this.to.onchange = function () { that.updateRange() }
		this.container.appendChild(this.to);

		this.updateRange();
	}
	updateRange() {
		console.log(this.to.value);
		this.startTime = parseFloat(this.from.value);
		this.endTime = parseFloat(this.to.value);
		this.range.min = this.startTime;
		this.range.max = this.endTime;
		this.currentPosition = this.startTime;
		this.range.value = this.startTime;
		this.playStart = this.ctx.millis() - this.startTime * 1000;

	}

	update() {
		if (this.playing) {
			this.currentPosition = (this.ctx.millis() - this.playStart) / 1000;
			this.range.value = this.currentPosition;
		}
		if (this.currentPosition > this.endTime) {
			this.currentPosition = this.endTime;
			this.onPlayStop();
		}
		this.elapsed.value = this.currentPosition.toFixed(2);
	}

	onRewind() {
		this.currentPosition = 0;
		this.playStart = this.ctx.millis();
		this.range.value = 0;
	}

	onPlayStop() {
		if (this.playing) {
			this.playing = false;
			this.play.innerHTML = '▶';
		} else {
			this.playing = true;
			this.play.innerHTML = '∎';
			this.playStart = this.ctx.millis() - this.currentPosition * 1000;
		}
	}

	onChange() {
		let val = parseFloat(this.range.value);
		//		this.playStart = val * 1000;
		this.currentPosition = val;
		this.playStart = this.ctx.millis() - this.currentPosition * 1000;
	}

	getTime() {
		return this.currentPosition;
	}
}

export { Timeline }
