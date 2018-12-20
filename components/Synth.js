class Synth {
  constructor(audioContext) {
    this.isPlaying = false;
    this.audioContext = audioContext;

    this.K = null;
    this.gain = 0.25;
    this.r = 1;
    this.t = 0;
    this.x = Math.random();

    this.generator = (t, x, r, K) => [0, r, K];
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
      if (this.K === null) {
        this.K = (this.audioContext.sampleRate / 4) * this.r;
        console.log(`K = ${this.K}`);
      }
      this.node = this.audioContext.createScriptProcessor(0, 0, 2);
      this.node.onaudioprocess = event => this._onAudioProcess(event);
    }
  }

  _onAudioProcess(event) {
    let outputBuffer = event.outputBuffer;

    for (let s = 0; s < this.node.bufferSize; s++) {
      const realFreq = 440 * this.r;
      const angularFreq = realFreq * 2 * Math.PI;

      // Calculate value for generator
      const sampleTime = this.t / this.audioContext.sampleRate;
      const sampleAngle = sampleTime * angularFreq;

      // Set current sample on all channels
      for (var c = 0; c < outputBuffer.numberOfChannels; c++) {
        let outputData = outputBuffer.getChannelData(c);

        // Generate sample
        const [o, r, K] = this.generator(sampleAngle, this.x, this.r, this.K);
        outputData[s] = this.gain * o;

        // Update other state variables
        this.r = r;
        this.K = K;
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
