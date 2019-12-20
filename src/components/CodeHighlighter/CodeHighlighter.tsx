import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface Props {
  language?: string;
  value: string;
}

const CodeHighlighter: React.FC<Props> = ({ language, value }) => {
  return (
    <SyntaxHighlighter language={language} style={atomDark} showLineNumbers>
      {value}
    </SyntaxHighlighter>
  );
};

export default CodeHighlighter;
