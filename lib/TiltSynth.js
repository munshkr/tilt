class TiltSynth {
  constructor(audioContext) {
    this.audioContext = audioContext;
    this.loaded = false;
    this.isPlaying = false;
    this.callbacks = {};
    this.gain = 0.5;
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

  async loadWorkletModules() {
    await this.audioContext.audioWorklet.addModule("worklets/output-processor.js");
  }

  play() {
    if (!this.isPlaying) {
      this._initialize();
      this._setGainTarget(this.gain);
      this.isPlaying = true;
      this.emit("play");
    }
  }

  eval(code) {
    const msg = { type: "code", data: code };
    if (this.node) {
      this.node.port.postMessage(msg);
    } else {
      this.on("load", () => {
        this.node.port.postMessage(msg);
      });
    }
  }

  stop() {
    if (this.isPlaying) {
      this._setGainTarget(0);
      this.isPlaying = false;
      this.emit("stop");
    }
  }

  connect(node) {
    if (this.gainNode) {
      this.gainNode.connect(node);
    } else {
      this.on("load", synth => {
        synth.gainNode.connect(node);
      });
    }
  }

  disconnect(node) {
    if (this.gainNode) {
      this.gainNode.disconnect(node);
    }
  }

  _initialize() {
    if (!this.loaded) {
      this.gainNode = this.audioContext.createGain();
      this.gainNode.value = this.gain;
      this.gainNode.connect(this.audioContext.destination);

      try {
        this.node = new AudioWorkletNode(this.audioContext, "output-processor");
      } catch (err) {
        console.error("Failed to create audio worklet node!");
        return;
      }

      this.node.port.onmessage = event => {
        const { type, data } = event.data;
        if (type === "error") {
          this.emit("error", data);
        } else {
          throw new Error(`Unhandled message from output processor: ${type}`);
        }
      };

      this.node.onprocessorerror = error => {
        console.error("An error occured in the worklet node processor.");
        this.emit("error", error);
        // TODO Try to revert generator function...
      };

      this.node.connect(this.gainNode);

      this.loaded = true;
      this.emit("load", this);
    }
  }

  _setGainTarget(targetValue) {
    this.gainNode.gain.setTargetAtTime(targetValue, this.audioContext.currentTime, 0.015);
  }
}

export default TiltSynth;
