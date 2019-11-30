import React from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@material-ui/core";
import { List } from "immutable";
import { IProjectRecord } from "interfaces/project";
import useForm from "react-hook-form";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      width: "100%"
    }
  })
);

type Props = {
  open: boolean;
  editingProejct?: IProjectRecord;
  projectList: List<IProjectRecord>;
  onSubmit: (data: unknown, cb?: Function) => void;
  handleClose: () => void;
};

export type IProjectFormProps = {
  name: string;
};

const ProjectUpdateDialog: React.FC<Props> = ({
  open,
  onSubmit,
  handleClose,
  projectList,
  editingProejct
}) => {
  const classes = useStyles();
  const { register, handleSubmit, errors, reset } = useForm();

  const defaultValue = editingProejct ? editingProejct.name : "";

  const currentProjectNameList = React.useMemo(() => {
    return projectList.map(project => project.name);
  }, [projectList]);

  const handleCancel = () => {
    handleClose();
    setTimeout(() => reset(), 100);
  };

  const validateName = (name: string) => {
    let validated: boolean | string = true;
    if (
      (!editingProejct || editingProejct.name !== name) &&
      currentProjectNameList.includes(name)
    ) {
      validated = "Duplicated name";
    }
    return validated;
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      aria-labelledby="form-dialog-title"
      fullWidth
      maxWidth="xs"
    >
      <form
        className={classes.form}
        onSubmit={handleSubmit(data => onSubmit(data, handleCancel))}
      >
        <DialogTitle id="form-dialog-title">Update Project</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            name="name"
            inputRef={register({
              required: "this is required",
              validate: value => validateName(value)
            })}
            margin="dense"
            defaultValue={defaultValue}
            label="Project Name"
            error={!!errors.name}
            helperText={
              errors.name && errors.name.message ? errors.name.message : ""
            }
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button type="submit" color="primary">
            Save
          </Button>
          <Button onClick={handleCancel} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProjectUpdateDialog;
