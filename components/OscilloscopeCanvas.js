import PropTypes from "prop-types";
import React from "react";

const OscilloscopeCanvas = React.forwardRef(({ isPlaying }, ref) => (
  <div>
    <canvas ref={ref} />
    <style jsx>
      {`
        canvas {
          ${isPlaying ? "" : "display: none"}
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
));

OscilloscopeCanvas.propTypes = {
  isPlaying: PropTypes.bool
};

OscilloscopeCanvas.defaultProps = {
  isPlaying: false
};

export default OscilloscopeCanvas;
