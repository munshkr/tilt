const BASE_FREQ = 440;

class Synth {
  constructor(audioContext) {
    this.audioContext = audioContext;

    this.loaded = false;
    this.isPlaying = false;
    this.callbacks = {};

    this.K = null;
    this.gain = 0.5;
    this.r = 1;
    this.t = 0;

    this.generator = (t, r, K) => [0, r, K];
  }

  on(event, cb) {
    if (!this.callbacks[event]) this.callbacks[event] = [];
    this.callbacks[event].push(cb);
  }

  emit(event, data) {
    const cbs = this.callbacks[event];
    if (cbs) {
      cbs.forEach(cb => cb(data));
    }
  }

  _setGainTarget(targetValue) {
    this.gainNode.gain.setTargetAtTime(targetValue, this.audioContext.currentTime, 0.015);
  }

  async loadWorkletModules() {
    await this.audioContext.audioWorklet.addModule("worklets/output-processor.js");
  }

  play() {
    if (!this.isPlaying) {
      this._initialize();
      this._setGainTarget(this.gain);
      this.isPlaying = true;
      this.emit("play");
      // console.log('play');
    }
  }

  stop() {
    if (this.isPlaying) {
      this._setGainTarget(0);
      this.isPlaying = false;
      this.emit("stop");
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

      this.gainNode = this.audioContext.createGain();
      this.gainNode.value = this.gain;
      this.gainNode.connect(this.audioContext.destination);

      // this.node = this.audioContext.createScriptProcessor(4096, 0, 2);
      this.node = new AudioWorkletNode(this.audioContext, "output-processor");
      // this.node.onaudioprocess = event => this._onAudioProcess(event);
      // console.log(`bufferSize = ${this.node.bufferSize}`);
      this.node.connect(this.gainNode);

      this.loaded = true;
      this.emit("load", this);
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
