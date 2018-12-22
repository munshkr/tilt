const Button = ({ src, disabled, onClick }) => (
  <div>
    <div
      onClick={disabled ? () => null : onClick}
      className={`button ${disabled ? "disabled" : ""}`}
    />
    <style jsx>{`
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
    `}</style>
  </div>
);

export default Button;
