import lzwCompress from "lzwcompress";
import getConfig from "next/config";
import dynamic from "next/dynamic";
import Head from "next/head";
import { withRouter } from "next/router";
import PropTypes from "prop-types";
import React from "react";
import Button from "../components/Button";
import ErrorMessage from "../components/ErrorMessage";
import Oscilloscope from "../components/Oscilloscope";
import SynthController from "../components/SynthController";

const { publicRuntimeConfig } = getConfig();
const { assetPrefix } = publicRuntimeConfig;

const URL_VERSION = 1;

const Editor = dynamic(() => import("../components/Editor"), {
  ssr: false,
  loading: () => <span>Loading...</span>
});

const DEFAULT_CONTENT = `// Define variable o to set audio output, like this:
o = ( ((t<<1)^((t<<1)+(t>>7)&t>>12))|t>>(4-(1^7&(t>>19)))|t>>7 ) %64/64
`;

const PlayButton = props => <Button src="static/play.svg" {...props} />;
const StopButton = props => <Button src="static/stop.svg" {...props} />;
const ShareButton = props => <Button src="static/share.svg" {...props} />;

const prelude = `
  // constants
  const pi = Math.PI;
  const two_pi = 2 * pi;

  // basic functions
  const abs = Math.abs;
  const acosh = Math.acosh;
  const acos = Math.acos;
  const asinh = Math.asinh;
  const asin = Math.asin;
  const atan2 = Math.atan2;
  const atanh = Math.atanh;
  const atan = Math.atan;
  const cbrt = Math.cbrt;
  const ceil = Math.ceil;
  const cosh = Math.cosh;
  const cos = Math.cos;
  const exp = Math.exp;
  const floor = Math.floor;
  const log2 = Math.log2;
  const log = Math.log;
  const max = Math.max;
  const min = Math.min;
  const pow = Math.pow;
  const round = Math.round;
  const sign = Math.sign;
  const sinh = Math.sinh;
  const sin = Math.sin;
  const sqrt = Math.sqrt;
  const tanh = Math.tanh;
  const tan = Math.tan;
  const trunc = Math.trunc;

  // waveforms
  const sine = arg => (sin(arg) + 1) / 2;
  const saw = arg => (arg % two_pi) / two_pi;
  const pulse = (arg, width) => (saw(arg) > (width || 0.5));
  const square = arg => pulse(arg, 0.5);
  const triangle = arg => {
    const r = saw(arg);
    return ((r > 0.5 ? r : (1 - r)) - 0.5)*2;
  };

  // sequences
  const seq = (subdiv, length) => Math.floor(1+(t/(K/subdiv)%(length)));

  // envelopes
  const env = (subdiv, curve, smooth) => {
    if (typeof(smooth) === 'undefined') smooth = 0.05;
    var tp = t%(K/subdiv)/(K/subdiv);
    var mult = (tp <= smooth) ? (tp / smooth) : 1;
    return Math.pow(1-tp, curve) * mult;
  };
  const invEnv = (subdiv, curve, smooth) => {
    if (typeof(smooth) === 'undefined') smooth = 0.05;
    var tp = t%(K/subdiv)/(K/subdiv);
    var mult = (tp >= 1-smooth) ? ((1-tp) / smooth) : 1;
    return Math.pow(tp, curve) * mult;
  };

  // randomness
  const prime1 = 1120911527;
  const prime2 = 341225299;
  const prime3 = 3073422643;
  const random = (n, seed) =>
    (((n+seed)*(n+seed)*prime1 + (n+seed)*prime2) % prime3) / prime3;
  const rand = (subdiv, seed) => {
    if (typeof(subdiv) === 'undefined') subdiv = 1;
    if (typeof(seed) === 'undefined') seed = 0;
    const v = Math.floor(t / (K / subdiv));
    return random(v, seed);
  };
  const randInt = (subdiv, max, seed) => {
    max = Math.floor(max);
    return Math.floor(rand(subdiv, seed) * max);
  };
`;

const generateURL = content => {
  const buf = lzwCompress.pack(content);
  const code = btoa(buf);
  return `${assetPrefix}/#v=${URL_VERSION}&c=${code}`;
};

const getHashStringParams = () => {
  const query = window.location.hash;
  return query
    ? (/^[?#]/.test(query) ? query.slice(1) : query)
        .split("&")
        .reduce((params, param) => {
          const newParams = Object.assign({}, params);
          const [key, value] = param.split("=");
          newParams[key] = value
            ? decodeURIComponent(value.replace(/\+/g, " "))
            : "";
          return newParams;
        }, {})
    : {};
};

const getLastContent = () => localStorage.getItem("lastContent");

const setLastContent = content => {
  localStorage.setItem("lastContent", content);
};

class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      audioContext: null,
      content: DEFAULT_CONTENT,
      generator: null,
      isPlaying: false,
      isFlashing: false,
      error: null
    };
  }

  componentDidMount() {
    let content;

    const query = getHashStringParams();
    // console.log(`query params = ${JSON.stringify(query)}`);

    // If URL contains a "c" param, decode source code
    if (query.c) {
      content = this._decodeCode(query.c);
      // console.log('load code from query params');
    } else {
      // Otherwise, try to get last content from localStorage
      content = getLastContent();
    }

    // If any, set content
    if (content) {
      // console.log('found! set content');
      this.setState({ content });
    }
  }

  _onChange = text => {
    setLastContent(text);
    this.setState({ content: text, error: null });
  };

  _onEval = editor => {
    const content = editor.getValue();
    this.eval(content);
  };

  _onStop = () => {
    this.stop();
  };

  _onPlayButtonClick = () => {
    const content = this._getEditorContent();
    this.eval(content);
  };

  _onStopButtonClick = () => {
    this.stop();
  };

  _onShareButtonClick = () => {
    const { router } = this.props;
    const content = this._getEditorContent();
    const url = generateURL(content);
    router.replace(url, url, { shallow: true });
  };

  _flash() {
    this.setState({ isFlashing: true });
    setTimeout(() => this.setState({ isFlashing: false }), 500);
  }

  play() {
    let { audioContext } = this.state;
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    this.setState({ audioContext, isPlaying: true });
  }

  stop() {
    const { isPlaying } = this.state;
    if (isPlaying) {
      this._flash();
      this.setState({ isPlaying: false });
    }
  }

  eval(content) {
    if (this._tryEval(content)) {
      const generator = null;
      // eslint-disable-next-line no-eval
      eval(`generator = (t, r, K) => {
        let o = 0;
        ${prelude};
        ${content};
        return [o, r, K];
      }`);
      this.setState({ generator });
      this._flash();
      this.play();
    }
  }

  _tryEval(content) {
    try {
      // parameters
      // eslint-disable-next-line no-unused-vars
      const t = 0;
      // eslint-disable-next-line no-unused-vars
      const r = 1;
      // eslint-disable-next-line no-unused-vars
      const K = 0;
      // global variables and functions
      // eslint-disable-next-line no-unused-vars
      const o = 0;
      // content
      // eslint-disable-next-line no-eval
      eval(
        `${prelude};
        ${content}`
      );
      return true;
    } catch (err) {
      this.setState({ error: err.message });
      // console.error(err);
      return false;
    }
  }

  _decodeCode(code) {
    try {
      const buf = atob(code)
        .split(",")
        .map(parseFloat);
      return lzwCompress.unpack(buf);
    } catch (err) {
      this.setState({ error: `(Invalid URL) ${err.message}` });
      return null;
    }
  }

  _getEditorContent() {
    return this.editor.props.content;
  }

  render() {
    const {
      audioContext,
      isPlaying,
      generator,
      isFlashing,
      content,
      error
    } = this.state;

    return (
      <div className={isFlashing ? "flash" : ""}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta charSet="utf-8" />
          <title>Tilt</title>
        </Head>

        <Editor
          ref={c => {
            this.editor = c;
          }}
          onEval={this._onEval}
          onStop={this._onStop}
          onChange={this._onChange}
          content={content}
        />
        <SynthController
          ref={c => {
            this.synth = c;
          }}
          audioContext={audioContext}
          isPlaying={isPlaying}
          generator={generator}
        />
        <div className="controls">
          <PlayButton onClick={this._onPlayButtonClick} />
          <StopButton onClick={this._onStopButtonClick} disabled={!isPlaying} />
          <ShareButton onClick={this._onShareButtonClick} />
        </div>

        {error ? <ErrorMessage message={error} /> : ""}

        <style global jsx>
          {`
            body {
              background-color: transparent;
              margin: 0;
            }
          `}
        </style>
        <style jsx>
          {`
            .controls {
              position: absolute;
              right: 1.5em;
              bottom: 1em;
              z-index: 2;
            }

            .flash {
              -webkit-animation-name: flash-animation;
              -webkit-animation-duration: 0.2s;
              animation-name: flash-animation;
              animation-duration: 0.2s;
            }

            @-webkit-keyframes flash-animation {
              from {
                background: black;
              }
              to {
                background: default;
              }
            }

            @keyframes flash-animation {
              from {
                background: black;
              }
              to {
                background: default;
              }
            }
          `}
        </style>
      </div>
    );
  }
}

Index.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  router: PropTypes.object.isRequired
};

export default withRouter(Index);
