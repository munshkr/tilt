import PropTypes from "prop-types";
import React from "react";
import Synth from "./Synth";

class SynthController extends React.Component {
  componentDidMount() {
    this.nodesToConnect = [];
  }

  async componentDidUpdate() {
    const { audioContext, isPlaying, code } = this.props;

    if (audioContext) {
      if (!this.synth) {
        this.synth = new Synth(audioContext);
        await this.synth.loadWorkletModules();
      }

      if (isPlaying) {
        if (code) this.synth.eval(code);
        this.synth.play();
      } else {
        this.synth.stop();
      }
    }
  }

  connectToSynth(node) {
    if (this.synth.gainNode) {
      this.synth.gainNode.connect(node);
    } else {
      this.synth.on("load", synth => {
        synth.gainNode.connect(node);
      });
    }
  }

  disconnectFromSynth(node) {
    if (this.synth) {
      this.synth.gainNode.disconnect(node);
    }
  }

  render() {
    return null;
  }
}

SynthController.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  audioContext: PropTypes.object,
  isPlaying: PropTypes.bool,
  code: PropTypes.string
};

SynthController.defaultProps = {
  audioContext: null,
  isPlaying: false,
  code: ""
};

export default SynthController;
