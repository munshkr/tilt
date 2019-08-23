const BASE_FREQ = 440;

class Synth {
  constructor(audioContext) {
    this.isPlaying = false;
    this.audioContext = audioContext;

    this.K = null;
    this.gain = 0.5;
    this.r = 1;
    this.t = 0;

    this.generator = (t, r, K) => [0, r, K];
  }

  _setGainTarget(targetValue) {
    this.gainNode.gain.setTargetAtTime(
      targetValue,
      this.audioContext.currentTime,
      0.015
    );
  }

  play() {
    if (!this.isPlaying) {
      this._initialize();
      this._setGainTarget(this.gain);
      this.isPlaying = true;
      // console.log('play');
    }
  }

  stop() {
    if (this.isPlaying) {
      this._setGainTarget(0);
      this.isPlaying = false;
      // console.log('stop');
    }
  }

  _initialize() {
    if (!this.node && this.audioContext) {
      // console.log(`sampleRate = ${this.audioContext.sampleRate}`);
      if (this.K === null) {
        this.K = (this.audioContext.sampleRate / 4) * this.r;
        // console.log(`K = ${this.K}`);
      }
      this.node = this.audioContext.createScriptProcessor(4096, 0, 2);
      // console.log(`bufferSize = ${this.node.bufferSize}`);
      this.node.onaudioprocess = event => this._onAudioProcess(event);

      this.gainNode = this.audioContext.createGain();
      this.gainNode.value = this.gain;
      this.node.connect(this.gainNode);
      this.gainNode.connect(this.audioContext.destination);
    }
  }

  _onAudioProcess(event) {
    const { outputBuffer } = event;

    for (let s = 0; s < this.node.bufferSize; s += 1) {
      const realFreq = BASE_FREQ * this.r;
      const angularFreq = realFreq * 2 * Math.PI;

      // Calculate value for generator
      const sampleTime = this.t / this.audioContext.sampleRate;
      const sampleAngle = sampleTime * angularFreq;

      // Set current sample on all channels
      for (let c = 0; c < outputBuffer.numberOfChannels; c += 1) {
        const outputData = outputBuffer.getChannelData(c);

        // Generate sample
        const [o, r, K] = this.generator(sampleAngle, this.r, this.K);
        outputData[s] = o * 2 - 1;

        // Update other state variables
        this.r = r;
        this.K = K;
      }

      // Increment counter
      this.t += 1;
    }
  }
}

export default Synth;
