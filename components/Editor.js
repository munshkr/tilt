import AceEditor from "react-ace";

import "brace/mode/javascript";
import "brace/theme/tomorrow";
import "brace/ext/language_tools";

const style = {
  width: "100vw",
  height: "100vh",
  backgroundColor: "transparent"
};

class Editor extends React.Component {
  state = {
    content: ""
  };

  componentWillMount() {
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
    this.setState({ content: text });
  };

  render() {
    const { editorRef, onEval, onStop } = this.props;
    const { content } = this.state;

    return (
      <div>
        <AceEditor
          ref={editorRef}
          mode="javascript"
          theme="tomorrow"
          name="editor"
          showGutter={false}
          showPrintMargin={false}
          wrapEnabled={true}
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
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: false,
            showLineNumbers: false,
            tabSize: 2
          }}
        />
        <style jsx global>{`
          .ace-tomorrow .ace_marker-layer .ace_active-line {
            background: #efefefc0 !important;
          }
          .ace-tomorrow .ace_marker-layer .ace_selection {
            background: #d6d6d6c0 !important;
          }
        `}</style>
      </div>
    );
  }
}

export default Editor;
