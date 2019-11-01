import React from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@material-ui/core";
import { ProjectListItemData } from "store/modules/project";

type Props = {
  open: boolean;
  editingProejct?: ProjectListItemData;
  projectList: ProjectListItemData[];
  handleClose: () => void;
  handleProjectUpdate: (
    projectName: string,
    editingProject?: ProjectListItemData
  ) => void;
};

const ProjectUpdateDialog: React.FC<Props> = ({
  open,
  handleClose,
  handleProjectUpdate,
  projectList,
  editingProejct
}) => {
  const [projectName, setProjectName] = React.useState("");
  React.useEffect(() => {
    if (editingProejct) {
      setProjectName(editingProejct.name);
    }
  }, [open, editingProejct]);

  const currentProjectNameList = React.useMemo(() => {
    return projectList.map(project => project.name);
  }, [projectList]);

  // Error handle (duplicated project name)
  const [errorMessage, setErrorMessage] = React.useState("");
  const isError = React.useMemo(() => !!errorMessage, [errorMessage]);

  const handleProjectNameUpdate = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (isError) {
      setErrorMessage("");
    }
    setProjectName(e.currentTarget.value);
  };

  const handleSubmit = () => {
    if (!projectName) {
      setErrorMessage("Empty Project Name");
      return;
    }

    // Check the name is already used
    if (
      (!editingProejct || editingProejct.name !== projectName) &&
      currentProjectNameList.includes(projectName)
    ) {
      setErrorMessage("Duplicated Project Name");
      return;
    }

    handleProjectUpdate(projectName, editingProejct);
    handleClose();
    setTimeout(() => setProjectName(""), 100);
  };

  const handleKeyboardEvent = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  const handleCancel = () => {
    handleClose();
    setTimeout(() => setProjectName(""), 100);
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      aria-labelledby="form-dialog-title"
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle id="form-dialog-title">Update Project</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          error={isError}
          helperText={errorMessage}
          margin="dense"
          id="projectName"
          label="Project Name"
          type="string"
          value={projectName}
          onChange={handleProjectNameUpdate}
          onKeyPress={handleKeyboardEvent}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} color="primary" disabled={isError}>
          Save
        </Button>
        <Button onClick={handleCancel} color="secondary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const isEqualProps = (
  prevProps: React.PropsWithChildren<Props>,
  nextProps: React.PropsWithChildren<Props>
) => {
  return prevProps.open === nextProps.open;
};

export default React.memo(ProjectUpdateDialog, isEqualProps);
