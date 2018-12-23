import AceEditor from "react-ace";

import "brace/mode/javascript";
import "brace/theme/tomorrow";

const style = {
  width: "100vw",
  height: "100vh",
  backgroundColor: "transparent"
};

const Editor = ({ editorRef, content, onChange, onEval, onStop }) => (
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
      onChange={onChange}
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
        enableBasicAutocompletion: false,
        enableLiveAutocompletion: false,
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

export default Editor;
