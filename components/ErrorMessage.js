import React from "react";
import PropTypes from "prop-types";

const ErrorMessage = ({ message }) => (
  <div>
    <div className="error">
      <span className="title">Error: </span>
      <span className="message">{message}</span>
    </div>
    <style jsx>
      {`
        .error {
          position: absolute;
          left: 1em;
          bottom: 1em;
          padding: 0.25em;
          font-family: Monaco, Menlo, "Ubuntu Mono", Consolas, source-code-pro;
          color: #fff;
          background-color: #f00;
          z-index: 1;
        }
        .error .title {
          font-weight: bold;
        }
      `}
    </style>
  </div>
);

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired
};

export default ErrorMessage;
