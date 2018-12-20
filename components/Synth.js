class Synth {
  K = 8192;

  constructor(audioContext) {
    this.isPlaying = false;
    this.audioContext = audioContext;

    this.gain = 0.25;
    this.r = 1;
    this.t = 0;
    this.x = Math.random();

    this.generator = (t, x) => [0, this.r];
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
      var realFreq = 440 * this.r;
      var angularFreq = realFreq * 2 * Math.PI;

      // Calculate value for generator
      var sampleTime = this.t / this.audioContext.sampleRate;
      var sampleAngle = sampleTime * angularFreq;

      // Set current sample on all channels
      for (var c = 0; c < outputBuffer.numberOfChannels; c++) {
        var outputData = outputBuffer.getChannelData(c);

        // Generate sample
        var [o, r] = this.generator(sampleAngle, this.x);
        outputData[s] = this.gain * o;

        // Update other state variables
        this.r = r;
      }

      // Increment counter
      this.t++;

      // Reset random variable
      if (this.t % this.K == 0) {
        this.x = Math.random();
      }
    }
  }
}

export default Synth;
