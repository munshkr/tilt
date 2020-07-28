/* eslint-disable lines-between-class-members */
/* eslint-disable no-restricted-properties */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */

const BASE_FREQ = 440; // TODO should be a parameter
const SAMPLE_RATE = 44100; // TODO should be a parameter

const PRELUDE = `
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
    if (typeof smooth === "undefined") smooth = 0.05;
    const tp = (t % (K / subdiv)) / (K / subdiv);
    const mult = tp <= smooth ? tp / smooth : 1;
    return Math.pow(1 - tp, curve) * mult;
  };

  const invEnv = (subdiv, curve, smooth) => {
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
`;

class OutputProcessor extends AudioWorkletProcessor {
  constructor() {
    super();

    this._t = 0;
    this._r = 1;
    this._K = (SAMPLE_RATE / 4) * this._r;

    this._generator = (_t, r, K) => [0, r, K];

    this.port.onmessage = event => {
      this._evaluate(event.data);
    };
  }

  process(_inputs, outputs, _parameters) {
    const output = outputs[0];
    const bufferSize = output[0].length;

    for (let s = 0; s < bufferSize; s += 1) {
      const realFreq = BASE_FREQ * this._r;
      const angularFreq = realFreq * 2 * Math.PI;

      // Calculate value for generator
      const sampleTime = this._t / SAMPLE_RATE;
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
            ${PRELUDE};
            ${code};
            return [o, r, K];
        }
    `;

    // eslint-disable-next-line no-eval
    eval(updateGeneratorJs);
  }
}

registerProcessor("output-processor", OutputProcessor);
