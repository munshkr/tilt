import React from "react";

const FFT_SIZE = 2048;
const CANVAS_HEIGHT = 400;

const canvasStyle = {
  width: "100vw",
  height: "100vh",
  position: "absolute",
  top: 0,
  left: 0,
  zIndex: -10
};

class Oscilloscope extends React.Component {
  constructor(props) {
    super(props);
    this.state = { audioData: new Float32Array(0) };
    this._tick = this._tick.bind(this);
  }

  componentDidMount() {
    const { synthRef, audioContext } = this.props;

    this.analyser = audioContext.createAnalyser();
    this.analyser.fftSize = FFT_SIZE;

    this.dataArray = new Float32Array(this.analyser.frequencyBinCount);

    synthRef.current.connectToSynth(this.analyser);

    const canvas = this.refs.canvas;
    canvas.width = this.dataArray.length;
    canvas.height = CANVAS_HEIGHT;

    this._tick();
  }

  componentDidUpdate() {
    console.log(`componentDidUpdate`);
    this._draw();
  }

  componentWillUnmount() {
    console.log(`componentWillUnmount`);
    const { synthRef } = this.props;

    cancelAnimationFrame(this.rafId);
    this.analyser.disconnect();
    if (synthRef.current) {
      synthRef.current.disconnectFromSynth(this.analyser);
    }
  }

  render() {
    return <canvas ref="canvas" style={canvasStyle} />;
  }

  _tick() {
    console.log(`tick`);
    this.analyser.getFloatTimeDomainData(this.dataArray);
    this.setState({ audioData: this.dataArray });
    this.rafId = requestAnimationFrame(this._tick);
  }

  _draw() {
    console.log(`draw`);
    const { audioData } = this.state;
    const { canvas } = this.refs;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    for (let i = 0; i < audioData.length; i++) {
      const x = i;
      const y = (0.5 - audioData[i] / 2) * canvas.height;
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
