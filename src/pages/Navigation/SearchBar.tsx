import React from "react";
import SearchIcon from "@material-ui/icons/Search";
import CancelIcon from "@material-ui/icons/Cancel";
import { TextField, IconButton } from "@material-ui/core";

type SearchBarProps = {
  classes: { [key: string]: string };
  handleSearchClose: () => void;
};

const SearchBar: React.FC<SearchBarProps> = React.memo(
  ({ classes, handleSearchClose }) => {
    const [searchText, setSearchText] = React.useState("");
    const handleSearchTextChange = (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      setSearchText(event.currentTarget.value);
    };

    const handleKeyboardEvent = (event: React.KeyboardEvent) => {
      // Capture Escape
      if (event.keyCode === 27) handleSearchClose();
    };

    return (
      <React.Fragment>
        <SearchIcon color="primary" className={classes.searchIcon} />
        <TextField
          autoFocus
          fullWidth
          placeholder="Search..."
          value={searchText}
          onChange={handleSearchTextChange}
          onKeyDown={handleKeyboardEvent}
        />
        <IconButton onClick={handleSearchClose}>
          <CancelIcon />
        </IconButton>
      </React.Fragment>
    );
  }
);

export default SearchBar;
