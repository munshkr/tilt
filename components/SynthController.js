import React from "react";
import Synth from "./Synth";

class SynthController extends React.Component {
  componentDidUpdate() {
    const { audioContext, isPlaying, generator } = this.props;

    if (audioContext) {
      if (!this.synth) {
        this.synth = new Synth(audioContext);
      }

      if (isPlaying) {
        this.synth.play();
      } else {
        this.synth.stop();
      }

      if (generator) {
        this.synth.generator = generator;
      }
    }
  }

  render() {
    return null;
  }
}

export default SynthController;
