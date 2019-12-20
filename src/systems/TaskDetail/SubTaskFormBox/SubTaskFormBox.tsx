import React from "react";
import { ListItem, TextField, Box } from "@material-ui/core";
import useForm from "react-hook-form";
import { ISubTaskRecord } from "interfaces/task";

export type ISubTaskFormProps = {
  _id?: string;
  taskId: string;
  name: string;
};

type ISubTaskFormBoxProps = {
  classes: { [key: string]: string };
  onSubmit: (data: unknown, cb?: Function) => void;
  onBlur: () => void;
  subTask?: ISubTaskRecord;
};

const SubTaskFormBox: React.FC<ISubTaskFormBoxProps> = ({
  classes,
  onSubmit,
  onBlur,
  subTask
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.keyCode === 27) {
      onBlur();
    }
  };
  const defaultValue = subTask ? subTask.name : "";

  const { register, handleSubmit, errors, reset } = useForm();
  return (
    <ListItem className={classes.formTextBox} dense>
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

export default SubTaskFormBox;
