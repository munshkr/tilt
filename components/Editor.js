import AceEditor from "react-ace";

import "brace/mode/javascript";
import "brace/theme/github";

export default ({ onEval }) => (
  <AceEditor
    mode="javascript"
    theme="github"
    name="editor"
    commands={[
      {
        name: "evaluate",
        bindKey: { win: "Ctrl-Enter", mac: "Command-Enter" },
        exec: onEval
      }
    ]}
  />
);
