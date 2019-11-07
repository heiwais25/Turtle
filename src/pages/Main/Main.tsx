import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      padding: theme.spacing(3)
    },
    toolbar: theme.mixins.toolbar
  })
);

const Main = () => {
  const classes = useStyles();
  return (
    <React.Fragment>
      <main className={classes.root}>
        <div className={classes.toolbar} />
        hello2233
      </main>
    </React.Fragment>
  );
};

export default Main;
