import React from "react";

const FFT_SIZE = 2048;
const CANVAS_HEIGHT = 400;

class Oscilloscope extends React.Component {
  constructor(props) {
    super(props);
    this._tick = this._tick.bind(this);
  }

  componentDidMount() {
    const { synthRef, audioContext } = this.props;

    this.analyser = audioContext.createAnalyser();
    this.analyser.fftSize = FFT_SIZE;

    this.dataArray = new Float32Array(this.analyser.frequencyBinCount);

    synthRef.current.connectToSynth(this.analyser);

    this._updateCanvasSize();
    this._tick();
  }

  _updateCanvasSize() {
    const canvas = this.refs.canvas;
    if (canvas) {
      canvas.width = this.dataArray.length;
      canvas.height = CANVAS_HEIGHT;
    }
  }

  componentDidUpdate() {
    this._updateCanvasSize();
  }

  componentWillUnmount() {
    const { synthRef } = this.props;

    cancelAnimationFrame(this.rafId);
    synthRef.current.disconnectFromSynth(this.analyser);
    this.analyser = null;
    this.dataArray = null;
  }

  render() {
    const { isPlaying } = this.props;

    return isPlaying ? (
      <div>
        <canvas ref="canvas" />
        <style jsx>{`
          canvas {
            position: absolute;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: -10;
          }
        `}</style>
      </div>
    ) : (
      ""
    );
  }

  _tick() {
    this.analyser.getFloatTimeDomainData(this.dataArray);
    this._draw();
    this.rafId = requestAnimationFrame(this._tick);
  }

  _draw() {
    const { canvas } = this.refs;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    for (let i = 0; i < this.dataArray.length; i++) {
      const x = i;
      const y = (0.5 - this.dataArray[i] / 2) * canvas.height;
      if (i == 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
  }
}

export default Oscilloscope;
