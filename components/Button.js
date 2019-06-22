import PropTypes from 'prop-types';
import React from 'react';

const Button = ({
  src, disabled, onClick, onKeyPress,
}) => (
  <div>
    <div
      onClick={disabled ? null : onClick}
      onKeyPress={disabled ? null : onKeyPress}
      className={`button ${disabled ? 'disabled' : ''}`}
    />
    <style jsx>
      {`
        .button {
          background-color: #000;
          -webkit-mask: url(${src}) no-repeat center;
          mask: url(${src}) no-repeat center;
          -webkit-mask-size: 75%;
          mask-size: 75%;
          width: 48px;
          height: 48px;
          cursor: pointer;
        }
        .button.disabled {
          background-color: #999;
        }
      `}
    </style>
  </div>
);

Button.propTypes = {
  src: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  onKeyPress: PropTypes.func,
};

Button.defaultProps = {
  disabled: false,
  onClick: null,
  onKeyPress: null,
};

export default Button;
