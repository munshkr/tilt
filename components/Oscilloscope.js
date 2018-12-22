import React from "react";

class Oscilloscope extends React.Component {
  componentDidUpdate() {
    const { audioContext, synthRef, isPlaying } = this.props;

    if (!audioContext || !isPlaying) {
      return;
    }

    const analyser = audioContext.createAnalyser();
    this.analyser = analyser;
    analyser.fftSize = 2048;
    synthRef.current.connectToSynth(analyser);

    let waveform = new Float32Array(analyser.frequencyBinCount);
    analyser.getFloatFrequencyData(waveform);

    (function updateWaveform() {
      requestAnimationFrame(updateWaveform);
      analyser.getFloatTimeDomainData(waveform);
    })();

    let canvas = this.refs.canvas;
    canvas.width = waveform.length;
    canvas.height = 400;

    let ctx = canvas.getContext("2d");

    (function drawOscilloscope() {
      requestAnimationFrame(drawOscilloscope);
      analyser.getFloatTimeDomainData(waveform);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      for (let i = 0; i < waveform.length; i++) {
        const x = i;
        const y = (0.5 - waveform[i] / 2) * canvas.height;
        if (i == 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    })();
  }

  componentWillUnmount() {
    const { synthRef } = this.props;

    if (this.analiser) {
      synthRef.current.disconnectFromSynth(this.analyser);
      this.analiser = null;
    }
  }

  render() {
    const { isPlaying } = this.props;
    return isPlaying ? (
      <canvas
        ref="canvas"
        style={{
          width: "100vw",
          height: "100vh",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: -10
        }}
      />
    ) : (
      ""
    );
  }
}

export default Oscilloscope;
