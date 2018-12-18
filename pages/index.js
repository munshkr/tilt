import React from "react";
import dynamic from "next/dynamic";

import SynthController from "../components/SynthController";
//import Oscilloscope from "../components/Oscilloscope";

const Editor = dynamic(() => import("../components/Editor"), { ssr: false });

const DEFAULT_CONTENT = `// Define variable o to set audio output, like this:
o = ( ((t<<1)^((t<<1)+(t>>7)&t>>12))|t>>(4-(1^7&(t>>19)))|t>>7 ) %64/64
`;

class Index extends React.Component {
  state = {
    audioContext: null,
    generator: null
  };

  constructor(props) {
    super(props);
    this._onEval = this._onEval.bind(this);
    this._onStop = this._onStop.bind(this);
  }

  _tryEval(content) {
    try {
      var K = 8000;
      var t = 0;
      var o = 0;
      var s = Math.sin;
      var x = Math.random();
      var e = function(subdiv, curve) { return Math.pow(1-t%(K/subdiv)/(K/subdiv), curve) };
      var i = function(subdiv, curve) { return Math.pow(t%(K/subdiv)/(K/subdiv), curve) };
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

  _onEval(editor) {
    console.log("Evaluate!");
    const content = editor.getValue();
    if (this._tryEval(content)) {
      var generator = null;
      eval(`generator = function(t) {
            var K = 8000;
            var o = 0;
            var s = Math.sin;
            var x = Math.random();
            var e = function(subdiv, curve) { return Math.pow(1-t%(K/subdiv)/(K/subdiv), curve) };
            var i = function(subdiv, curve) { return Math.pow(t%(K/subdiv)/(K/subdiv), curve) };
            ${content};
            return o;
        }`);
      console.log(`generator: ${generator}`);
      this.setState({ generator: generator });
      this.play();
    }
  }

  _onStop() {
    console.log("Hush!");
    this.stop();
  }

  render() {
    const { audioContext, isPlaying, generator } = this.state;

    return (
      <div>
        <Editor
          onEval={this._onEval}
          onStop={this._onStop}
          defaultContent={DEFAULT_CONTENT}
        />
        <SynthController
          audioContext={audioContext}
          isPlaying={isPlaying}
          generator={generator}
        />
        {/*<Oscilloscope audioContext={audioContext}>
        </Oscilloscope>*/}
        <style global jsx>
          {`
            body {
              background-color: transparent;
            }
          `}
        </style>
      </div>
    );
  }
}

export default Index;
