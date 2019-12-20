import React from "react";
import { Grid, Box, Button } from "@material-ui/core";
import { SingleDatePicker } from "react-dates";
import moment, { Moment } from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-regular-svg-icons";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    datePicker: {
      boxShadow: "0 0.5px 0 rgba(9,30,66,.25)",
      "& .DateInput": {
        width: "100px"
      },
      "& input": {
        fontSize: "1rem",
        padding: theme.spacing(0.75, 0, 0.25, 0),
        textAlign: "center"
      },
      "& #buttonGroup": {
        padding: theme.spacing(0, 2, 2, 0)
      },
      "& > div > div > div > button": {
        display: "flex",
        width: "21px"
      }
    },
    datePickerOptions: {
      "& button": {
        marginRight: theme.spacing(1)
      }
    }
  })
);

type Props = {
  dueDate?: Date;
  handleUpadteDueDate: (dueDate?: Date, cb?: Function) => void;
};

const DueDate: React.FC<Props> = ({ dueDate, handleUpadteDueDate }) => {
  const classes = useStyles();
  const [currentDate, setCurrentDate] = React.useState<Moment | null>(null);

  React.useEffect(() => {
    if (dueDate) {
      setCurrentDate(moment(dueDate));
    }
  }, [dueDate]);

  const [pickerFocused, setPickerFocused] = React.useState<boolean | null>(
    false
  );

  function handleCalendarOpen() {
    setPickerFocused(true);
  }

  function handleCalendarClose() {
    setPickerFocused(false);
  }

  function handleFocusChange(arg: { focused: boolean | null }) {
    if (arg.focused) {
      handleCalendarOpen();
    } else {
      handleCalendarClose();
    }
  }

  function handleDateAddButtonClick() {
    handleCalendarOpen();
  }

  function handleAddDays(amount: number) {
    handleDateChange(moment().add(amount, "day"));
  }

  function handleOneDayAddButtonClick() {
    handleAddDays(1);
  }

  function handleTwoDayAddButtonClick() {
    handleAddDays(2);
  }

  function handleDateChange(date: Moment | null) {
    if (!date) {
      // in the case of clear button click
      setCurrentDate(null);
      handleUpadteDueDate(undefined);

      // close the calendar
      handleCalendarClose();
    } else if (date && date !== currentDate) {
      setCurrentDate(date);
      handleUpadteDueDate(date.toDate());
    }
  }

  return (
    <React.Fragment>
      <Grid container alignItems="center">
        <Box pl={"10px"} fontSize="20px" alignItems="center" display="inline">
          <FontAwesomeIcon icon={faCalendarAlt} />
        </Box>
        <Box
          fontWeight={600}
          fontSize="1rem"
          paddingLeft={1.5}
          paddingRight={1}
          alignItems="center"
          display="inline"
        >
          Due Date
        </Box>

        {currentDate || pickerFocused ? (
          <Grid className={classes.datePicker}>
            <SingleDatePicker
              date={currentDate}
              id="datePicker"
              small
              focused={!!pickerFocused}
              onDateChange={handleDateChange}
              onFocusChange={handleFocusChange}
              showClearDate={!!currentDate}
              numberOfMonths={1}
            />
          </Grid>
        ) : (
          <Grid className={classes.datePickerOptions}>
            <Button
              variant="contained"
              size="small"
              onClick={handleDateAddButtonClick}
            >
              Add
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={handleOneDayAddButtonClick}
            >
              +1 Day
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={handleTwoDayAddButtonClick}
            >
              +2 Day
            </Button>
          </Grid>
        )}
      </Grid>
    </React.Fragment>
  );
};

export default React.memo(DueDate);
