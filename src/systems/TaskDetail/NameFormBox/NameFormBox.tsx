import React from "react";
import { TextField, Box } from "@material-ui/core";
import useForm from "react-hook-form";
import { ITaskRecord } from "../../../interfaces/task";

export type INameFormProps = {
  name: string;
};

type INameFormBoxProps = {
  classes: { [key: string]: string };
  onSubmit: (data: unknown, cb?: Function) => void;
  onBlur: () => void;
  task?: ITaskRecord;
};

const NameFormBox: React.FC<INameFormBoxProps> = ({
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
    <form
      className={classes.titleForm}
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
  );
};

export default React.memo(NameFormBox);
