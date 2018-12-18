class Synth {
  constructor() {
    this.audioCtx = null;
    this.t = 0;
    this.gain = 0.25;
    this.generator = t => t;
  }

  play() {
    this._initialize();
    this.node.connect(this.audioCtx.destination);
    console.log("play");
  }

  stop() {
    if (this.node) {
      this.node.disconnect(this.audioCtx.destination);
    }
    console.log("stop");
  }

  _initialize() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      this.node = this.audioCtx.createScriptProcessor(0, 0, 2);
      this.node.onaudioprocess = event => this._onAudioProcess(event);
    }
  }

  _onAudioProcess(event) {
    var outputBuffer = event.outputBuffer;

    for (var s = 0; s < this.node.bufferSize; s++) {
      for (var c = 0; c < outputBuffer.numberOfChannels; c++) {
        var outputData = outputBuffer.getChannelData(c);
        outputData[s] = this.gain * this.generator(this.t / 16);
      }
      this.t++;
    }
  }
}

export default Synth;
