import * as React from "react";
import {
  ListItem,
  TextField,
  Grid,
  Box,
  Checkbox,
  ListItemIcon,
  ListItemText,
  IconButton,
  Menu,
  MenuItem
} from "@material-ui/core";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import useForm from "react-hook-form";
import classNames from "classnames";
import AddIcon from "@material-ui/icons/Add";
import { ITask, ITaskRecord } from "interfaces/task";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      padding: theme.spacing(3)
    },
    textBox: {
      backgroundColor: "white",
      padding: theme.spacing(0),
      fontSize: "1rem",
      borderRadius: "3px",
      height: "56px",
      boxShadow: "0 1px 0 rgba(9,30,66,.25)",
      display: "relative",
      "&:hover": {
        "& .editButton": {
          display: "block"
        }
      },
      "& p::before": {
        content: "⚠ "
      }
    },
    icon: {
      marginRight: theme.spacing(1)
    },
    editButton: {
      position: "absolute",
      right: 5,
      display: "none",
      padding: theme.spacing(1),
      "& svg": {
        width: "18px",
        height: "18px"
      }
    },
    form: {
      width: "100%"
    },
    checkbox: {
      padding: "0 5px"
    },
    addIcon: {
      padding: "0 11px"
    },
    errorMessage: {
      position: "absolute",
      right: 10,
      top: 0
    },
    anchorMenuPaper: {
      width: "120px",
      "& ul": {
        padding: theme.spacing(1, 0)
      },
      "& li": {
        height: "30px",
        fontSize: "0.8rem"
      }
    },
    drawerMenu: {
      "& li": {
        minHeight: "36px"
      }
    },
    canceledText: {
      textDecoration: "line-through !important",
      color: "grey"
    }
  })
);

type ITextFieldFormListItemProps = {
  classes: { [key: string]: string };
  onSubmit: (data: unknown, cb?: Function) => void;
  onBlur: () => void;
  task?: ITask;
};

const TextFieldFormListItem: React.FC<ITextFieldFormListItemProps> = ({
  classes,
  onSubmit,
  onBlur,
  task
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.keyCode === 27) {
      onBlur();
    }
  };
  const defaultValue = task ? task.name : "";

  const { register, handleSubmit, errors, reset } = useForm();
  return (
    <ListItem className={classes.textBox} dense>
      <form
        className={classes.form}
        onSubmit={handleSubmit(data => onSubmit(data, reset))}
      >
        <TextField
          name="name"
          inputRef={register({
            required: "this is required"
          })}
          defaultValue={defaultValue}
          fullWidth
          autoFocus
          variant="outlined"
          placeholder="Add New Task"
          onBlur={onBlur}
          onKeyDown={handleKeyDown}
        />
        {errors.name && (
          <Box
            className={classes.errorMessage}
            color="secondary.main"
            display="inline"
            component={"p"}
          >
            {`⚠ ${errors.name.message}`}
          </Box>
        )}
      </form>
    </ListItem>
  );
};

type IAddTextBoxListItemProps = {
  classes: { [key: string]: string };
  handleEditButtonClick: () => void;
};

// In the case of addition of task
const AddTextBoxListItem: React.FC<IAddTextBoxListItemProps> = ({
  classes,
  handleEditButtonClick
}) => {
  return (
    <ListItem
      button
      onClick={handleEditButtonClick}
      className={classes.textBox}
      dense
    >
      <ListItemIcon className={classes.addIcon}>
        <AddIcon />
      </ListItemIcon>
      <ListItemText>
        <Box display="inline" fontSize="1rem">
          Add New Task
        </Box>
      </ListItemText>
    </ListItem>
  );
};

type IDisplayTextBoxLisItemProps = {
  classes: { [key: string]: string };
  handleCheckboxToggle: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  handleEditButtonClick: () => void;
  handleDeleteButtonClick: (cb?: Function) => void;
  handleDoubleClick: () => void;
  task: ITask;
};

const initialState = {
  mouseX: null,
  mouseY: null
};

// Just visualize the information of task
const DisplayTextBoxLisItem: React.FC<IDisplayTextBoxLisItemProps> = ({
  classes,
  task,
  handleCheckboxToggle,
  handleDeleteButtonClick,
  handleEditButtonClick,
  handleDoubleClick
}) => {
  const [state, setState] = React.useState<{
    mouseX: null | number;
    mouseY: null | number;
  }>(initialState);

  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!state.mouseY) {
      setState({
        mouseX: event.clientX - 2,
        mouseY: event.clientY - 4
      });
    } else {
      setState(initialState);
    }
    event.stopPropagation();
    event.preventDefault();
  };
  const handleClose = () => {
    setState(initialState);
  };

  const handleDeleteButtonClickWithCallback = () => {
    handleDeleteButtonClick(handleClose);
  };

  const isChecked = task.process === "done";

  const menu = (
    <Menu
      id="simple-menu"
      keepMounted
      anchorReference="anchorPosition"
      open={state.mouseY !== null}
      onClose={handleClose}
      classes={{
        paper: classes.anchorMenuPaper
      }}
      className={classes.drawerMenu}
      anchorPosition={
        state.mouseY !== null && state.mouseX !== null
          ? { top: state.mouseY, left: state.mouseX }
          : undefined
      }
    >
      <MenuItem onClick={handleEditButtonClick}>
        <ListItemIcon>
          <EditIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Edit" />
      </MenuItem>
      <MenuItem onClick={handleDeleteButtonClickWithCallback}>
        <ListItemIcon>
          <DeleteIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Delete" />
      </MenuItem>
    </Menu>
  );

  return (
    <Grid container onContextMenu={handleContextMenu}>
      <ListItem
        onDoubleClick={handleDoubleClick}
        button
        className={classNames(classes.textBox, {
          [classes.canceledText]: isChecked
        })}
        dense
      >
        <ListItemIcon className={classes.checkbox}>
          <Checkbox onClick={handleCheckboxToggle} checked={isChecked} />
        </ListItemIcon>
        <ListItemText>
          <Box display="inline">{task.name}</Box>
        </ListItemText>
        <IconButton
          className={classNames(classes.editButton, "editButton")}
          onClick={handleEditButtonClick}
        >
          <EditIcon fontSize="small" />
        </IconButton>
      </ListItem>
      {menu}
    </Grid>
  );
};

export type ITaskFormProps = {
  _id?: string;
  name: string;
};

export interface IProps {
  task?: ITaskRecord;
  handleToggle?: (updatedTask: ITaskRecord) => void;
  handleTaskCreate?: (formData: ITaskFormProps, cb?: Function) => void;
  handleTaskUpdate?: (newTask: ITaskRecord, cb?: Function) => void;
  handleTaskDelete?: (task: ITaskRecord, cb?: Function) => void;
  handleTaskDetailLinkClick?: (task: ITaskRecord) => void;
}

function TaskListItem(props: IProps) {
  const {
    task,
    handleToggle,
    handleTaskCreate,
    handleTaskUpdate,
    handleTaskDelete,
    handleTaskDetailLinkClick
  } = props;
  const classes = useStyles();
  const [isEditMode, setEditMode] = React.useState(false);

  const handleEditButtonClick = () => {
    setEditMode(true);
  };
  const handleEditTextfieldBlur = () => {
    setEditMode(false);
  };
  const handleDeleteButtonClick = (cb?: Function) => {
    if (handleTaskDelete && task) {
      handleTaskDelete(task, cb);
    }
  };

  const handleCheckboxToggle = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (task && handleToggle) {
      const prevProcess = task.process;
      let newTask = task;
      if (prevProcess === "done") {
        newTask = task.set("process", "toDo");
      } else {
        newTask = task.set("process", "done");
      }
      handleToggle(newTask);
    }
    event.stopPropagation();
  };

  const handleSubmit = (data: unknown, createCallback?: Function) => {
    const formData: ITaskFormProps = data as ITaskFormProps;
    if (handleTaskCreate) {
      // Create
      handleTaskCreate(formData, () => {
        if (createCallback) createCallback();
      });
    } else if (task && handleTaskUpdate) {
      // Update
      const newTask = task.set("name", formData.name);
      handleTaskUpdate(newTask, () => handleEditTextfieldBlur());
    }
  };

  const handleDoubleClick = () => {
    if (handleTaskDetailLinkClick && task) {
      handleTaskDetailLinkClick(task);
    }
  };

  if (isEditMode) {
    return (
      <Grid container alignItems="center">
        <TextFieldFormListItem
          classes={classes}
          onSubmit={handleSubmit}
          onBlur={handleEditTextfieldBlur}
          task={task}
        />
      </Grid>
    );
  }

  return (
    <Grid container alignItems="center">
      {task ? (
        <DisplayTextBoxLisItem
          classes={classes}
          handleCheckboxToggle={handleCheckboxToggle}
          handleEditButtonClick={handleEditButtonClick}
          handleDeleteButtonClick={handleDeleteButtonClick}
          handleDoubleClick={handleDoubleClick}
          task={task}
        />
      ) : (
        <AddTextBoxListItem
          classes={classes}
          handleEditButtonClick={handleEditButtonClick}
        />
      )}
    </Grid>
  );
}

const isPropsEqual = (
  prevProps: Readonly<IProps>,
  nextProps: Readonly<IProps>
) => {
  return prevProps.task === nextProps.task;
};

export default React.memo(TaskListItem, isPropsEqual);
