import React from "react";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("../components/Editor"), { ssr: false });

class Index extends React.Component {
  _onEval = e => {
    console.log(e);
  };

  render() {
    return (
      <div>
        <Editor onEval={this._onEval} />
      </div>
    );
  }
}

export default Index;
