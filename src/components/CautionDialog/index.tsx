import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  Button
} from "@material-ui/core";

type Props = {
  open: boolean;
  title: string;
  contentText: string;
  handleAgree: () => void;
  handleDisagree: () => void;
};

const CautionDialog: React.SFC<Props> = ({
  open,
  title,
  contentText,
  handleAgree,
  handleDisagree
}) => {
  return (
    <Dialog
      open={open}
      onClose={handleDisagree}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {contentText}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleAgree} color="primary" autoFocus>
          Agree
        </Button>
        <Button onClick={handleDisagree} color="secondary">
          Disagree
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CautionDialog;
