import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { withRouter } from "next/router";
import getConfig from "next/config";

import lzwCompress from "lzwcompress";

import Button from "../components/Button";
import SynthController from "../components/SynthController";
import Oscilloscope from "../components/Oscilloscope";
import ErrorMessage from "../components/ErrorMessage";

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

const PlayButton = props => <Button src={`static/play.svg`} {...props} />;
const StopButton = props => <Button src={`static/stop.svg`} {...props} />;
const ShareButton = props => <Button src={`static/share.svg`} {...props} />;

const prelude = `
  // constants
  const pi = Math.PI;

  // basic functions
  const sin = arg => (Math.sin(arg) + 1) / 2;
  const abs = Math.abs;
  const floor = Math.floor;
  const ceil = Math.ceil;

  // sequences
  const seq = (subdiv, length) => Math.floor(1+(t/(K/subdiv)%(length)));

  // envelopes
  const expEnv = (subdiv, curve, smooth) => {
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
  const randInt = (max, subdiv, seed) => {
    max = Math.floor(max);
    return Math.floor(rand(subdiv, seed) * max);
  };
`;

class Index extends React.Component {
  state = {
    audioContext: null,
    content: DEFAULT_CONTENT,
    generator: null,
    isPlaying: false,
    isFlashing: false,
    error: null
  };

  editorRef = React.createRef();
  synthRef = React.createRef();

  constructor(props) {
    super(props);
    this._onEval = this._onEval.bind(this);
    this._onStop = this._onStop.bind(this);
    this._onChange = this._onChange.bind(this);
    this._onPlayButtonClick = this._onPlayButtonClick.bind(this);
    this._onStopButtonClick = this._onStopButtonClick.bind(this);
    this._onShareButtonClick = this._onShareButtonClick.bind(this);
  }

  componentDidMount() {
    let content;

    const query = this._getQueryStringParams();
    console.log(`query params = ${JSON.stringify(query)}`);

    // If URL contains a "c" param, decode source code
    if (query.c) {
      content = this._decodeCode(query.c);
      console.log("load code from query params");
    } else {
      // Otherwise, try to get last content from localStorage
      content = this._getLastContent();
    }

    // If any, set content
    if (content) {
      console.log("found! set content");
      this.setState({ content: content });
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
    }
  }

  _getQueryStringParams() {
    const query = window.location.search;
    return query
      ? (/^[?#]/.test(query) ? query.slice(1) : query)
          .split("&")
          .reduce((params, param) => {
            let [key, value] = param.split("=");
            params[key] = value
              ? decodeURIComponent(value.replace(/\+/g, " "))
              : "";
            return params;
          }, {})
      : {};
  }

  _getLastContent() {
    return localStorage.getItem("lastContent");
  }

  _setLastContent(content) {
    localStorage.setItem("lastContent", content);
  }

  _tryEval(content) {
    try {
      // parameters
      var t = 0;
      var r = 1;
      var K = 0;
      // global variables and functions
      var o = 0;
      // content
      eval(
        `${prelude};
        ${content}`
      );
      return true;
    } catch (err) {
      this.setState({ error: err.message });
      console.error(err);
      return false;
    }
  }

  play() {
    let { audioContext } = this.state;
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    this.setState({ audioContext: audioContext, isPlaying: true });
  }

  stop() {
    if (this.state.isPlaying) {
      this._flash();
      this.setState({ isPlaying: false });
    }
  }

  eval(content) {
    if (this._tryEval(content)) {
      var generator = null;
      eval(`generator = (t, r, K) => {
        let o = 0;
        ${prelude};
        ${content};
        return [o, r, K];
      }`);
      this.setState({ generator: generator });
      this._flash();
      this.play();
    }
  }

  _flash() {
    this.setState({ isFlashing: true });
    setTimeout(() => this.setState({ isFlashing: false }), 500);
  }

  _onEval(editor) {
    const content = editor.getValue();
    this.eval(content);
  }

  _onStop() {
    this.stop();
  }

  _onPlayButtonClick() {
    const content = this._getEditorContent();
    this.eval(content);
  }

  _onStopButtonClick() {
    this.stop();
  }

  _onShareButtonClick() {
    const content = this._getEditorContent();
    const url = this._generateURL(content);
    this.props.router.replace(url, url, { shallow: true });
  }

  _generateURL(content) {
    const buf = lzwCompress.pack(content);
    const code = btoa(buf);
    return `${assetPrefix}/?v=${URL_VERSION}&c=${code}`;
  }

  _onChange = text => {
    this._setLastContent(text);
    this.setState({ content: text, error: null });
  };

  _getEditorContent() {
    const editor = this.editorRef.current.editor;
    return editor.getValue();
  }

  render() {
    const { audioContext, isPlaying, generator, isFlashing } = this.state;

    return (
      <div className={isFlashing ? "flash" : ""}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta charSet="utf-8" />
          <title>Tilt</title>
        </Head>

        <Editor
          editorRef={this.editorRef}
          onEval={this._onEval}
          onStop={this._onStop}
          onChange={this._onChange}
          content={this.state.content}
        />
        <SynthController
          ref={this.synthRef}
          audioContext={audioContext}
          isPlaying={isPlaying}
          generator={generator}
        />
        <div className="controls">
          <PlayButton onClick={this._onPlayButtonClick} />
          <StopButton onClick={this._onStopButtonClick} disabled={!isPlaying} />
          <ShareButton onClick={this._onShareButtonClick} />
        </div>
        <Oscilloscope
          audioContext={audioContext}
          synthRef={this.synthRef}
          isPlaying={isPlaying}
        />
        {this.state.error ? <ErrorMessage message={this.state.error} /> : ""}

        <style global jsx>{`
          body {
            background-color: transparent;
            margin: 0;
          }
        `}</style>
        <style jsx>{`
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
        `}</style>
      </div>
    );
  }
}

export default withRouter(Index);
