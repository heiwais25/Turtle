import React from "react";
import { Box, ListItem, ListItemText } from "@material-ui/core";
import { CodeHighlighter } from "components";
import ReactMarkdown from "react-markdown";
import "github-markdown-css";

type IDescriptionBox = {
  classes: { [key: string]: string };
  placeholder: string;
  description?: string;
  handleClick: () => void;
};

const DescriptionBox: React.FC<IDescriptionBox> = ({
  classes,
  placeholder,
  description,
  handleClick
}) => {
  if (!description) {
    return (
      <ListItem button onClick={handleClick} className={classes.textBox} dense>
        <ListItemText>
          <Box fontSize="1rem" display="inline" whiteSpace="pre">
            {placeholder}
          </Box>
        </ListItemText>
      </ListItem>
    );
  }

  return (
    <ListItem className={classes.textBox} dense>
      <ListItemText>
        <div className="markdown-body">
          <ReactMarkdown
            source={description}
            renderers={{ code: CodeHighlighter }}
          />
        </div>
      </ListItemText>
    </ListItem>
  );
};

export default DescriptionBox;
