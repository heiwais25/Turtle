import React, { useRef } from "react";
import useForm from "react-hook-form";
import {
  Grid,
  Button,
  ListItem,
  ListItemText,
  TextField
} from "@material-ui/core";

type IDescriptionFormBox = {
  classes: { [key: string]: string };
  placeholder: string;
  description?: string;
  handleCancel: () => void;
  handleSubmit: (values: unknown) => void;
};

const DescriptionFormBox: React.FC<IDescriptionFormBox> = ({
  classes,
  placeholder,
  handleCancel,
  handleSubmit,
  description
}) => {
  const formRef = useRef<HTMLFormElement>(null);

  const { handleSubmit: handleFormSubmit, register, getValues } = useForm({
    defaultValues: { description: description }
  });

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.ctrlKey && event.keyCode === 13) {
      handleSubmit(getValues());
    } else if (event.keyCode === 27) {
      handleCancel();
    }
  };

  return (
    <form ref={formRef} onSubmit={handleFormSubmit(handleSubmit)}>
      <Grid>
        <ListItem className={classes.textBox} dense>
          <ListItemText className={classes.textField}>
            <TextField
              name="description"
              inputRef={register}
              multiline
              fullWidth
              autoFocus
              InputProps={{
                placeholder
              }}
              onKeyDown={onKeyDown}
            />
          </ListItemText>
        </ListItem>
      </Grid>
      <Grid container justify="flex-end" spacing={1}>
        <Grid item>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="small"
          >
            Save
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleCancel}
            size="small"
          >
            Cancel
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default DescriptionFormBox;
