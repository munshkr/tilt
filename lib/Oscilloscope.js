class Oscilloscope {
  constructor(audioContext, fftSize = 2048, canvasHeight = 400) {
    this.audioContext = audioContext;
    this.canvasHeight = canvasHeight;

    this._analyser = audioContext.createAnalyser();
    this._analyser.fftSize = fftSize;
    this._dataArray = new Float32Array(this._analyser.frequencyBinCount);
    this._canvas = null;
  }

  set canvas(elem) {
    this._canvas = elem;
    this._canvas.width = this._dataArray.length;
    this._canvas.height = this.canvasHeight;
  }

  connectToSynth(synth) {
    this._synth = synth;
    this._synth.connect(this._analyser);
  }

  disconnectFromSynth() {
    this._synth.disconnect(this._analyser);
  }

  start() {
    this._tick();
    this._draw();
  }

  stop() {
    cancelAnimationFrame(this._tickRafId);
    cancelAnimationFrame(this._drawRafId);
  }

  release() {
    this.stop();
    this.disconnectFromSynth();
  }

  _tick = () => {
    this._analyser.getFloatTimeDomainData(this._dataArray);
    this._tickRafId = requestAnimationFrame(this._tick);
  };

  _draw = () => {
    if (!this._canvas) return;

    const ctx = this._canvas.getContext("2d");

    ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    ctx.beginPath();
    for (let i = 0; i < this._dataArray.length; i += 1) {
      const x = i;
      const y = (0.5 - this._dataArray[i] / 2) * this._canvas.height;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    this._drawRafId = requestAnimationFrame(this._draw);
  };
}

export default Oscilloscope;
