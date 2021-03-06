/* global sampleRate */
/* eslint-disable lines-between-class-members */
/* eslint-disable no-restricted-properties */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */

const baseFreq = 440; // TODO should be a parameter

const prelude = `
  // constants
  const pi = Math.PI;
  const twoPi = 2 * pi;

  // basic functions
  const { 
    abs, acosh, acos, asinh, asin, atan2, atanh, cbrt, ceil, cosh, cos, exp,
    floor, log2, log, max, min, pow, round, sign, sinh, sin, sqrt, tanh, tan,
    trunc,
  } = Math;

  // waveforms
  const sine = arg => (Math.sin(arg) + 1) / 2;
  const saw = arg => (arg % twoPi) / twoPi;
  const pulse = (arg, width) => saw(arg) > (width || 0.5);
  const square = arg => pulse(arg, 0.5);
  const tri = arg => {
    const r = saw(arg);
    return ((r > 0.5 ? r : 1 - r) - 0.5) * 2;
  };

  // sequences
  const seq = (subdiv, length) => Math.floor((t / (K / subdiv)) % length);
  const seq1 = (subdiv, length) => seq(subdiv, length) + 1;
  const aseq = (subdiv, array) => array[seq(subdiv, array.length)];

  // envelopes
  const env = (subdiv, curve, smooth) => {
    if (typeof curve === "undefined") curve = 1;
    if (typeof smooth === "undefined") smooth = 0.05;
    const tp = (t % (K / subdiv)) / (K / subdiv);
    const mult = tp <= smooth ? tp / smooth : 1;
    return Math.pow(1 - tp, curve) * mult;
  };
  const invEnv = (subdiv, curve, smooth) => {
    if (typeof curve === "undefined") curve = 1;
    if (typeof smooth === "undefined") smooth = 0.05;
    const tp = (t % (K / subdiv)) / (K / subdiv);
    const mult = tp >= 1 - smooth ? (1 - tp) / smooth : 1;
    return Math.pow(tp, curve) * mult;
  };

  // randomness
  const _prime1 = 1120911527;
  const _prime2 = 341225299;
  const _prime3 = 3073422643;
  const random = (n, seed) =>
    (((n + seed) * (n + seed) * _prime1 + (n + seed) * _prime2) % _prime3) /
    _prime3;
  const rand = (subdiv, seed) => {
    if (typeof subdiv === "undefined") subdiv = 1;
    if (typeof seed === "undefined") seed = 0;
    const v = Math.floor(t / (K / subdiv));
    return random(v, seed);
  };
  const randInt = (subdiv, max, seed) => {
    max = Math.floor(max);
    return Math.floor(rand(subdiv, seed) * max);
  };

  // freq and midinote conversions
  const f = freq => t*(freq/440);
  const m = midinote => 2**((midinote-69)/12)*t;
`;

class OutputProcessor extends AudioWorkletProcessor {
  constructor() {
    super();

    this._t = 0;
    this._r = 1;
    this._K = (sampleRate / 4) * this._r;

    this._generatorIsBroken = false;

    this._generator = (_t, r, K) => [0, r, K];

    this.port.onmessage = event => {
      const { type, data } = event.data;
      if (type === "code") {
        this._evaluate(data);
      } else {
        console.error(`[output-processor] Unhandled error in processor: ${type}`);
      }
    };
  }

  process(_inputs, outputs, _parameters) {
    const output = outputs[0];
    const bufferSize = output[0].length;

    for (let s = 0; s < bufferSize; s += 1) {
      const realFreq = baseFreq * this._r;
      const angularFreq = realFreq * 2 * Math.PI;

      // Calculate value for generator
      const sampleTime = this._t / sampleRate;
      const sampleAngle = sampleTime * angularFreq;

      // Set current sample on all channels
      output.forEach(data => {
        // Generate sample
        const [o, r, K] = this._generator(sampleAngle, this._r, this._K);
        data[s] = o * 2 - 1;

        // Update other state variables
        this._r = r;
        this._K = K;
      });

      // Increment counter
      this._t += 1;
    }

    return true;
  }

  // eslint-disable-next-line class-methods-use-this
  _evaluate(code) {
    const updateGeneratorJs = `
      this._generator = (t, r, K) => {
        let o = 0;

        if (!this._generatorIsBroken) {
          try {
            ${prelude};
            ${code};
          } catch (err) {
            this._generatorIsBroken = true;
            this._throwError(err);
          }
        }

        return [o, r, K];
      }
    `;

    this._generatorIsBroken = false;

    try {
      // eslint-disable-next-line no-eval
      eval(updateGeneratorJs);
    } catch (err) {
      this._throwError(err);
    }
  }

  _throwError(err) {
    console.error("[output-processor] Exception:", err);
    this.port.postMessage({ type: "error", data: err });
  }
}

registerProcessor("output-processor", OutputProcessor);
