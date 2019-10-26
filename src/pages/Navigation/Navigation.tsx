import React from "react";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import CancelIcon from "@material-ui/icons/Cancel";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";
import {
  TextField,
  AppBar,
  CssBaseline,
  Divider,
  Drawer,
  Hidden,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography
} from "@material-ui/core";
import {
  makeStyles,
  useTheme,
  Theme,
  createStyles
} from "@material-ui/core/styles";

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex"
    },
    drawer: {
      [theme.breakpoints.up("sm")]: {
        width: drawerWidth,
        flexShrink: 0
      }
    },
    title: {
      flexGrow: 1,
      display: "none",
      [theme.breakpoints.up("sm")]: {
        display: "block"
      }
    },
    appBar: {
      marginLeft: drawerWidth,
      [theme.breakpoints.up("sm")]: {
        width: `calc(100% - ${drawerWidth}px)`
      }
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up("sm")]: {
        display: "none"
      }
    },
    headerButtonGroup: {
      marginLeft: "auto",
      "& button": {
        marginLeft: theme.spacing(0.25)
      }
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
      width: drawerWidth
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3)
    },
    searchInput: {
      color: "white"
    },
    search: {
      borderBottomColor: "white"
    },
    searchIcon: {
      marginRight: theme.spacing(1)
    }
  })
);

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

    return (
      <React.Fragment>
        <SearchIcon color="primary" className={classes.searchIcon} />
        <TextField
          fullWidth
          placeholder="Search..."
          value={searchText}
          onChange={handleSearchTextChange}
        />
        <IconButton onClick={handleSearchClose}>
          <CancelIcon />
        </IconButton>
      </React.Fragment>
    );
  }
);

interface Props {}

const Navigation: React.FC<Props> = () => {
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);

  const handleDrawerToggle = React.useCallback(() => {
    setMobileOpen(!mobileOpen);
  }, [mobileOpen]);

  const handleSearchOpen = React.useCallback(() => {
    setSearchOpen(true);
  }, []);

  const handleSearchClose = React.useCallback(() => {
    setSearchOpen(false);
  }, []);

  const drawer = (
    <div style={{ position: "relative", height: "100%" }}>
      <div className={classes.toolbar} />
      <Divider />
      <List>
        {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {["All mail", "Trash", "Spam"].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <ListItem button style={{ position: "absolute", bottom: 0 }}>
        hello
      </ListItem>
    </div>
  );

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={classes.appBar}
        style={searchOpen ? { backgroundColor: "white" } : {}}
      >
        <Toolbar>
          {!searchOpen ? (
            <React.Fragment>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                className={classes.menuButton}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap className={classes.title}>
                TURTLE
              </Typography>
              <div className={classes.headerButtonGroup}>
                <IconButton
                  color="inherit"
                  aria-label="search"
                  edge="start"
                  onClick={handleSearchOpen}
                >
                  <SearchIcon />
                </IconButton>
                <IconButton color="inherit" aria-label="analysis" edge="start">
                  <TrendingUpIcon />
                </IconButton>
              </div>
            </React.Fragment>
          ) : (
            <SearchBar
              classes={classes}
              handleSearchClose={handleSearchClose}
            />
          )}
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        <Hidden smUp implementation="css">
          <Drawer
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper
            }}
            ModalProps={{
              keepMounted: true
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
    </div>
  );
};

export default Navigation;
