import lzwCompress from "lzwcompress";
import getConfig from "next/config";
import dynamic from "next/dynamic";
import Head from "next/head";
import { withRouter } from "next/router";
import PropTypes from "prop-types";
import React from "react";
import Button from "../components/Button";
import ErrorMessage from "../components/ErrorMessage";
import Oscilloscope from "../components/Oscilloscope";
import SynthController from "../components/SynthController";

const { publicRuntimeConfig } = getConfig();
const { assetPrefix } = publicRuntimeConfig;

const URL_VERSION = 1;

const Editor = dynamic(() => import("../components/Editor"), {
  ssr: false,
  loading: () => <span>Loading...</span>
});

const DEFAULT_CONTENT = `// Define variable o to set audio output, like this:
o = ( ((t<<1)^((t<<1)+(t>>7)&t>>12))|t>>(4-(1^7&(t>>19)))|t>>7 ) %64/64
`;

const PlayButton = props => <Button src="play.svg" {...props} />;
const StopButton = props => <Button src="stop.svg" {...props} />;
const ShareButton = props => <Button src="share.svg" {...props} />;

const generateURL = content => {
  const buf = lzwCompress.pack(content);
  const code = btoa(buf);
  return `${assetPrefix}/#v=${URL_VERSION}&c=${code}`;
};

const getHashStringParams = () => {
  const query = window.location.hash;
  return query
    ? (/^[?#]/.test(query) ? query.slice(1) : query).split("&").reduce((params, param) => {
        const newParams = Object.assign({}, params);
        const [key, value] = param.split("=");
        newParams[key] = value ? decodeURIComponent(value.replace(/\+/g, " ")) : "";
        return newParams;
      }, {})
    : {};
};

const getLastContent = () => localStorage.getItem("lastContent");

const setLastContent = content => {
  localStorage.setItem("lastContent", content);
};

class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      audioContext: null,
      content: DEFAULT_CONTENT,
      evalCode: "",
      isPlaying: false,
      isFlashing: false,
      error: null,
      oscSupported: false
    };
  }

  componentDidMount() {
    this.loadContent();
    this.checkOscilloscopeSupport();
  }

  getEditorContent() {
    return this.editor.props.content;
  }

  handleEval = async editor => {
    const evalCode = editor.getValue();
    await this.setState({ evalCode }, () => {
      this.play();
    });
  };

  handleStop = () => {
    this.stop();
  };

  handlePlayButtonClick = () => {
    const content = this.getEditorContent();
    this.eval(content);
  };

  handleStopButtonClick = () => {
    this.stop();
  };

  handleChange = text => {
    setLastContent(text);
    this.setState({ content: text, error: null });
  };

  handleShareButtonClick = () => {
    const { router } = this.props;
    const content = this.getEditorContent();
    const url = generateURL(content);
    router.replace(url, url, { shallow: true });
  };

  checkOscilloscopeSupport() {
    this.setState({ oscSupported: this.isOscSupported() });
  }

  loadContent() {
    let content;

    const query = getHashStringParams();
    // console.log(`query params = ${JSON.stringify(query)}`);

    // If URL contains a "c" param, decode source code
    if (query.c) {
      content = this.decodeCode(query.c);
      // console.log('load code from query params');
    } else {
      // Otherwise, try to get last content from localStorage
      content = getLastContent();
    }

    // If any, set content
    if (content) {
      // console.log('found! set content');
      this.setState({ content });
    }
  }

  // eslint-disable-next-line class-methods-use-this
  isOscSupported() {
    // Looks like iOS does not support something related to canvas...?
    // FIXME: Understand which feature is neeeded for drawing canvas and check
    // for that, instead of sniffing user agent...
    const iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
    return !iOS;
  }

  flash() {
    this.setState({ isFlashing: true });
    setTimeout(() => this.setState({ isFlashing: false }), 500);
  }

  play() {
    let { audioContext } = this.state;
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    this.setState({ audioContext, isPlaying: true });
  }

  stop() {
    const { isPlaying } = this.state;
    if (isPlaying) {
      this.flash();
      this.setState({ isPlaying: false });
    }
  }

  decodeCode(code) {
    try {
      const buf = atob(code)
        .split(",")
        .map(parseFloat);
      return lzwCompress.unpack(buf);
    } catch (err) {
      this.setState({ error: `(Invalid URL) ${err.message}` });
      return null;
    }
  }

  render() {
    const {
      audioContext,
      isPlaying,
      evalCode,
      isFlashing,
      content,
      error,
      oscSupported
    } = this.state;

    return (
      <div className={isFlashing ? "flash" : ""}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta charSet="utf-8" />
          <title>Tilt</title>
        </Head>

        <Editor
          ref={c => {
            this.editor = c;
          }}
          onEval={this.handleEval}
          onStop={this.handleStop}
          onChange={this.handleChange}
          content={content}
        />
        <SynthController
          ref={c => {
            this.synth = c;
          }}
          audioContext={audioContext}
          isPlaying={isPlaying}
          code={evalCode}
        />
        <div className="controls">
          <PlayButton onClick={this.handlePlayButtonClick} />
          <StopButton onClick={this.handleStopButtonClick} disabled={!isPlaying} />
          <ShareButton onClick={this.handleShareButtonClick} />
        </div>

        {oscSupported && audioContext ? (
          <Oscilloscope audioContext={audioContext} synth={this.synth} isPlaying={isPlaying} />
        ) : (
          ""
        )}
        {error ? <ErrorMessage message={error} /> : ""}

        <style global jsx>
          {`
            body {
              background-color: transparent;
              margin: 0;
            }
          `}
        </style>
        <style jsx>
          {`
            .controls {
              position: absolute;
              right: 1.5em;
              bottom: 1em;
              z-index: 2;
            }

            .flash {
              -webkit-animation-name: flash-animation;
              -webkit-animation-duration: 0.2s;
              animation-name: flash-animation;
              animation-duration: 0.2s;
            }

            @-webkit-keyframes flash-animation {
              from {
                background: black;
              }
              to {
                background: default;
              }
            }

            @keyframes flash-animation {
              from {
                background: black;
              }
              to {
                background: default;
              }
            }
          `}
        </style>
      </div>
    );
  }
}

Index.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  router: PropTypes.object.isRequired
};

export default withRouter(Index);
