import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import AceEditor from "react-ace";

import "ace-builds/src-min-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-tomorrow";

const staticWordCompleter = {
  getCompletions: (_editor, _session, _pos, _prefix, callback) => {
    const wordsByCategory = [
      { name: "variable", words: ["t", "r", "K", "o"] },
      { name: "time-function", words: ["f", "m"] },
      { name: "constant", words: ["pi", "twoPi"] },
      { name: "waveform-function", words: ["sine", "saw", "tri", "square", "pulse"] },
      {
        name: "math-function",
        words: [
          "abs",
          "acosh",
          "acos",
          "asinh",
          "asin",
          "atan2",
          "atanh",
          "cbrt",
          "ceil",
          "cosh",
          "cos",
          "exp",
          "floor",
          "log2",
          "log",
          "max",
          "min",
          "pow",
          "round",
          "sign",
          "sinh",
          "sin",
          "sqrt",
          "tanh",
          "tan",
          "trunc"
        ]
      },
      { name: "sequence-function", words: ["seq", "seq1", "aseq"] },
      { name: "envelope-function", words: ["env", "invEnv"] },
      { name: "random-function", words: ["random", "rand", "randInt"] }
    ];

    const wordList = [];
    wordsByCategory.forEach(category => {
      const { words } = category;
      wordList.push(
        ...words.map(word => ({
          caption: word,
          value: word,
          meta: category.name
        }))
      );
    });

    callback(null, wordList);
  }
};

const Editor = ({ content, onChange, onEval, onStop }) => {
  const style = {
    width: "100vw",
    height: "100vh",
    backgroundColor: "transparent"
  };

  const aceEditor = useRef(null);

  useEffect(() => {
    if (aceEditor.current) {
      console.log("Set static word completer");
      const { editor } = aceEditor.current;
      editor.completers = [staticWordCompleter];
    }
  }, [aceEditor]);

  return (
    <>
      <AceEditor
        ref={aceEditor}
        mode="javascript"
        theme="tomorrow"
        name="editor"
        showGutter={false}
        showPrintMargin={false}
        wrapEnabled
        fontSize={24}
        focus
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
          useWorker: false,
          enableBasicAutocompletion: false,
          enableLiveAutocompletion: true,
          enableSnippets: false,
          showLineNumbers: false,
          tabSize: 2
        }}
      />
      <style jsx global>
        {`
          .ace-tomorrow .ace_marker-layer .ace_active-line {
            background: #efefefc0 !important;
          }
          .ace-tomorrow .ace_marker-layer .ace_selection {
            background: #d6d6d6c0 !important;
          }
        `}
      </style>
    </>
  );
};

Editor.propTypes = {
  content: PropTypes.string,
  onChange: PropTypes.func,
  onEval: PropTypes.func,
  onStop: PropTypes.func
};

Editor.defaultProps = {
  content: "",
  onChange: null,
  onEval: null,
  onStop: null
};

export default Editor;
