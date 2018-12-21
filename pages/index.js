import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";

import SynthController from "../components/SynthController";
//import Oscilloscope from "../components/Oscilloscope";

const Editor = dynamic(() => import("../components/Editor"), { ssr: false });

const DEFAULT_CONTENT = `// Define variable o to set audio output, like this:
o = ( ((t<<1)^((t<<1)+(t>>7)&t>>12))|t>>(4-(1^7&(t>>19)))|t>>7 ) %64/64
`;

const PlayButton = ({ onClick }) => (
  <div>
    <img src="/static/play.svg" onClick={onClick} />
    <style jsx>{`
      img {
        position: absolute;
        right: 1.5em;
        top: 1em;
        width: 32px;
        height: 32px;
        cursor: pointer;
      }
    `}</style>
  </div>
);

class Index extends React.Component {
  state = {
    audioContext: null,
    generator: null
  };

  editorRef = React.createRef();

  constructor(props) {
    super(props);
    this._onEval = this._onEval.bind(this);
    this._onStop = this._onStop.bind(this);
    this._onPlayButtonClick = this._onPlayButtonClick.bind(this);
  }

  _tryEval(content) {
    try {
      // parameters
      var t = 0;
      var x = 0;
      var r = 1;
      var K = 8192;
      // global variables and functions
      var o = 0;
      var s = Math.sin;
      var e = (subdiv, curve) =>
        Math.pow(1 - (t % (K / subdiv)) / (K / subdiv), curve);
      var i = (subdiv, curve) =>
        Math.pow((t % (K / subdiv)) / (K / subdiv), curve);
      var S = (subdiv, longitud) =>
        Math.floor(1 + ((t / (K / subdiv)) % longitud));
      eval(content);
      return true;
    } catch (err) {
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
    this.setState({ isPlaying: false });
  }

  eval(content) {
    if (this._tryEval(content)) {
      var generator = null;
      eval(`generator = function(t, x, r, K) {
            var o = 0;
            var s = Math.sin;
            var e = (subdiv, curve) => Math.pow(1-t%(K/subdiv)/(K/subdiv), curve);
            var i = (subdiv, curve) => Math.pow(t%(K/subdiv)/(K/subdiv), curve);
            var S = (subdiv, length) => Math.floor(1+(t/(K/subdiv)%(length)));
            ${content};
            return [o, r, K];
        }`);
      console.log(`generator: ${generator}`);
      this.setState({ generator: generator });
      this.play();
    }
  }

  _onEval(editor) {
    const content = editor.getValue();
    this.eval(content);
  }

  _onStop() {
    this.stop();
  }

  _onPlayButtonClick() {
    const editor = this.editorRef.current.editor;
    const content = editor.getValue();
    this.eval(content);
  }

  render() {
    const { audioContext, isPlaying, generator } = this.state;

    return (
      <div>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta charSet="utf-8" />
          <title>Tilt</title>
        </Head>

        <Editor
          editorRef={this.editorRef}
          onEval={this._onEval}
          onStop={this._onStop}
          defaultContent={DEFAULT_CONTENT}
        />
        <SynthController
          audioContext={audioContext}
          isPlaying={isPlaying}
          generator={generator}
        />
        <PlayButton onClick={this._onPlayButtonClick} />

        <style global jsx>
          {`
            body {
              background-color: transparent;
              margin: 0;
            }
          `}
        </style>
      </div>
    );
  }
}

export default Index;
