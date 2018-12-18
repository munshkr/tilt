import React from "react";
import dynamic from "next/dynamic";

import Synth from "../components/Synth";

const Editor = dynamic(() => import("../components/Editor"), { ssr: false });

const DEFAULT_CONTENT = `// Define variable o to set audio output, like this:
o = ( ((t<<1)^((t<<1)+(t>>7)&t>>12))|t>>(4-(1^7&(t>>19)))|t>>7 ) %64/64
`;

class Index extends React.Component {
  constructor(props) {
    super(props);
    this._synth = new Synth();
    this._onEval = this._onEval.bind(this);
    this._onStop = this._onStop.bind(this);
  }

  _tryEval(content) {
    try {
      var t = 0;
      var o = 0;
      var s = Math.sin;
      var x = Math.random();
      eval(content);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  _onEval(editor) {
    console.log("Evaluate!");
    const content = editor.getValue();
    if (this._tryEval(content)) {
      let synth = this._synth;
      eval(`synth.generator = function(t) {
            var o = 0;
            var s = Math.sin;
            var x = Math.random();
            ${content};
            return o;
        }`);
      console.log(synth.generator);
      synth.play();
    }
  }

  _onStop() {
    console.log("Hush!");
    this._synth.stop();
  }

  render() {
    return (
      <div>
        <Editor
          onEval={this._onEval}
          onStop={this._onStop}
          defaultContent={DEFAULT_CONTENT}
        />
      </div>
    );
  }
}

export default Index;
