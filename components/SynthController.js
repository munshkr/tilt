import PropTypes from 'prop-types';
import React from 'react';
import Synth from './Synth';

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

  connectToSynth(node) {
    if (this.synth) {
      this.synth.gainNode.connect(node);
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
  audioContext: PropTypes.object.isRequired,
  isPlaying: PropTypes.bool,
  generator: PropTypes.func,
};

SynthController.defaultProps = {
  isPlaying: false,
  generator: () => {},
};

export default SynthController;
