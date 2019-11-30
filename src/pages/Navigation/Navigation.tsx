import React from "react";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";
import SettingsIcon from "@material-ui/icons/Settings";
import {
  AppBar,
  Drawer,
  Hidden,
  IconButton,
  Toolbar,
  Box
} from "@material-ui/core";
import {
  makeStyles,
  useTheme,
  Theme,
  createStyles
} from "@material-ui/core/styles";
import { IProjectRecord, IProjectCreatePartialForm } from "interfaces/project";
import { List } from "immutable";
import { DropResult } from "react-beautiful-dnd";
import DrawerList from "./DrawerList";
import SearchBar from "./SearchBar";

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
      fontSize: "1.3rem",
      fontWeight: 500,
      flexGrow: 1,
      display: "block"
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
        "&:hover": {
          color: "hsla(0,0%,100%,.7)"
        },
        marginLeft: "0px"
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
    },
    drawerList: {},
    drawerListItem: {
      letterSpacing: 1,
      padding: 0,
      fontSize: "1rem",
      height: "40px",
      position: "relative",
      "& button": {
        visibility: "hidden",
        position: "absolute",
        right: 0,
        padding: "6px"
      },
      "&:hover": {
        "& button": {
          visibility: "visible"
        }
      }
    },
    drawerMenu: {
      "& li": {
        minHeight: "36px"
      }
    },
    anchorMenu: {
      fontSize: "0.9rem"
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
    }
  })
);

type Props = {
  handleProjectCreate: (formData: IProjectCreatePartialForm) => void;
  handleProjectUpdate: (newProject: IProjectRecord) => void;
  handleProjectDelete: (project: IProjectRecord) => void;
  handleCurrentProjectChange: (project?: IProjectRecord) => void;
  handleProjectDragEnd: (result: DropResult) => void;
  projectList: List<IProjectRecord>;
  currentProject?: IProjectRecord;
};

const Navigation: React.FC<Props> = ({
  handleProjectCreate,
  handleProjectUpdate,
  handleProjectDelete,
  handleCurrentProjectChange,
  handleProjectDragEnd,
  projectList,
  currentProject
}) => {
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

  const handleCurrentProjectChangeSet = React.useCallback(
    (project: IProjectRecord) => {
      handleCurrentProjectChange(project);
      setMobileOpen(false);
    },
    [handleCurrentProjectChange, setMobileOpen]
  );

  const handleCurrentProjectClearSet = React.useCallback(() => {
    handleCurrentProjectChange();
    setMobileOpen(false);
  }, [handleCurrentProjectChange, setMobileOpen]);

  const drawer = (
    <DrawerList
      classes={classes}
      projectList={projectList}
      currentProject={currentProject}
      handleProjectCreate={handleProjectCreate}
      handleCurrentProjectChange={handleCurrentProjectChangeSet}
      handleCurrentProjectClear={handleCurrentProjectClearSet}
      handleProjectUpdate={handleProjectUpdate}
      handleProjectDelete={handleProjectDelete}
      handleProjectDragEnd={handleProjectDragEnd}
    />
  );

  return (
    <div className={classes.root}>
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
              <Box className={classes.title}>
                {currentProject ? currentProject.name : "All Projects"}
              </Box>
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
                <IconButton color="inherit" aria-label="analysis" edge="start">
                  <SettingsIcon />
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
      <nav className={classes.drawer} aria-label="project folders">
        <Hidden smUp implementation="js">
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
        <Hidden xsDown implementation="js">
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
