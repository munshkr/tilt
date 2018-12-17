import React from "react";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("../components/Editor"), { ssr: false });

const DEFAULT_CONTENT = `// Press Ctrl+Enter or Command+Enter to evaluate and hear a sine...
s(t)`;

class Index extends React.Component {
  _onEval = editor => {
    console.log("Evaluate!");
  };

  render() {
    return (
      <div>
        <Editor onEval={this._onEval} defaultContent={DEFAULT_CONTENT} />
      </div>
    );
  }
}

export default Index;
