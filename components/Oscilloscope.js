import PropTypes from 'prop-types';
import React from 'react';
import SynthController from './SynthController';

const FFT_SIZE = 2048;
const CANVAS_HEIGHT = 400;

class Oscilloscope extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isDrawing: false,
    };

    this._tick = this._tick.bind(this);
    this._draw = this._draw.bind(this);
  }

  componentDidMount() {
    const { synth, audioContext } = this.props;

    this.analyser = audioContext.createAnalyser();
    this.analyser.fftSize = FFT_SIZE;

    this.dataArray = new Float32Array(this.analyser.frequencyBinCount);

    synth.connectToSynth(this.analyser);
  }

  componentDidUpdate() {
    const { isDrawing } = this.state;

    if (!isDrawing) {
      // console.log('start ticking');
      this._updateCanvasSize();
      this._tick();
      this._draw();
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ isDrawing: true });
    }
  }

  componentWillUnmount() {
    const { synth } = this.props;

    cancelAnimationFrame(this.tickRafId);
    cancelAnimationFrame(this.drawRafId);
    synth.disconnectFromSynth(this.analyser);
    this.analyser = null;
    this.dataArray = null;
  }

  _updateCanvasSize() {
    if (this.canvas) {
      this.canvas.width = this.dataArray.length;
      this.canvas.height = CANVAS_HEIGHT;
    }
  }

  _tick() {
    this.analyser.getFloatTimeDomainData(this.dataArray);
    this.tickRafId = requestAnimationFrame(this._tick);
  }

  _draw() {
    if (!this.canvas) return;

    const ctx = this.canvas.getContext('2d');

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.beginPath();
    for (let i = 0; i < this.dataArray.length; i += 1) {
      const x = i;
      const y = (0.5 - this.dataArray[i] / 2) * this.canvas.height;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    this.drawRafId = requestAnimationFrame(this._draw);
  }

  render() {
    const { isPlaying } = this.props;

    return (
      <div>
        <canvas
          ref={(c) => {
            this.canvas = c;
          }}
        />
        <style jsx>
          {`
            canvas {
              ${isPlaying ? '' : 'display: none'}
              position: absolute;
              top: 0;
              left: 0;
              width: 100vw;
              height: 100vh;
              z-index: -10;
            }
          `}
        </style>
      </div>
    );
  }
}

Oscilloscope.propTypes = {
  synth: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(SynthController) }),
  ]).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  audioContext: PropTypes.object.isRequired,
  isPlaying: PropTypes.bool,
};

Oscilloscope.defaultProps = {
  isPlaying: false,
};

export default Oscilloscope;
