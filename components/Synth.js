class Synth {
  constructor(audioContext) {
    this.isPlaying = false;
    this.audioContext = audioContext;
    this.gain = 0.25;
    this.t = 0;
    this.generator = t => t;
  }

  play() {
    if (!this.isPlaying) {
      this._initialize();
      this.node.connect(this.audioContext.destination);
      this.isPlaying = true;
      console.log("play");
    }
  }

  stop() {
    if (this.isPlaying) {
      this.node.disconnect(this.audioContext.destination);
      this.isPlaying = false;
      console.log("stop");
    }
  }

  _initialize() {
    if (!this.node && this.audioContext) {
      this.node = this.audioContext.createScriptProcessor(0, 0, 2);
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
