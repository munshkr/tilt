import AceEditor from "react-ace";

import "brace/mode/javascript";
import "brace/theme/github";

const style = {
  width: "100vw",
  height: "100vh",
  backgroundColor: "transparent"
};

class Editor extends React.Component {
  state = {
    content: ""
  };

  componentDidMount() {
    let content = this._getLastContent();
    if (!content) {
      content = this.props.defaultContent;
    }
    this.setState({ content: content });
  }

  _getLastContent() {
    return localStorage.getItem("lastContent");
  }

  _setLastContent(content) {
    localStorage.setItem("lastContent", content);
  }

  _onChange = text => {
    this._setLastContent(text);
  };

  render() {
    const { onEval, onStop } = this.props;
    const { content } = this.state;

    return (
      <AceEditor
        mode="javascript"
        theme="github"
        name="editor"
        showGutter={false}
        showPrintMargin={false}
        fontSize={24}
        focus={true}
        value={content}
        style={style}
        onChange={this._onChange}
        editorProps={{ $blockScrolling: true }}
        commands={[
          {
            name: "evaluate",
            bindKey: { win: "Ctrl-Enter", mac: "Command-Enter" },
            exec: onEval
          },
          {
            name: "stop",
            bindKey: { win: "Ctrl-.", mac: "Command-." },
            exec: onStop
          }
        ]}
      />
    );
  }
}

export default Editor;
