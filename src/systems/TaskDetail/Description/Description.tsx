import React from "react";
import { Grid, Box, Button } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlignJustify } from "@fortawesome/free-solid-svg-icons";
import { DescriptionFormBox, DescriptionBox } from "systems/TaskDetail";

import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    textField: {},
    textBox: {
      width: "100%",
      alignItems: "top",
      backgroundColor: "white",
      padding: theme.spacing(1, 2),
      margin: theme.spacing(1, 0),
      fontSize: "14px",
      borderRadius: "3px",
      minHeight: "48px",
      lineHeight: 1.5,
      boxShadow: "0 1px 0 rgba(9,30,66,.25)",
      display: "relative",
      "&:hover": {
        "& .editButton": {
          display: "block"
        }
      },
      "& textarea": {
        lineHeight: 1.5
      },
      "& p::before": {
        content: "⚠ "
      }
    }
  })
);

interface Props {
  placeholder: string;
  description?: string;
  handleUpdateDescription: (description: string, cb?: Function) => void;
}

const Description: React.FC<Props> = ({
  placeholder,
  description,
  handleUpdateDescription
}) => {
  const classes = useStyles();
  const [editMode, setEditMode] = React.useState(false);

  function handleAddButtonClick() {
    setEditMode(true);
  }

  function handleEditModeCancel() {
    setEditMode(false);
  }

  function handleSubmit(values: unknown) {
    handleUpdateDescription(
      (values as { description: string }).description,
      handleEditModeCancel
    );
  }

  return (
    <React.Fragment>
      <Grid container alignItems="center">
        <Grid item xs={12}>
          <Box pl={"10px"} fontSize="20px" alignItems="center" display="inline">
            <FontAwesomeIcon icon={faAlignJustify} />
          </Box>
          <Box
            fontWeight={600}
            fontSize="1rem"
            paddingLeft={1.5}
            paddingRight={1}
            alignItems="center"
            display="inline"
          >
            Description
          </Box>
          {!editMode && description && (
            <Button
              variant="contained"
              size="small"
              onClick={handleAddButtonClick}
            >
              Edit
            </Button>
          )}
        </Grid>
      </Grid>
      {editMode ? (
        <DescriptionFormBox
          classes={classes}
          placeholder={placeholder}
          handleCancel={handleEditModeCancel}
          handleSubmit={handleSubmit}
          description={description}
        />
      ) : (
        <DescriptionBox
          classes={classes}
          placeholder={placeholder}
          description={description}
          handleClick={handleAddButtonClick}
        />
      )}
    </React.Fragment>
  );
};

export default Description;
