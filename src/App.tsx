import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import configureStore from "store";
import { RouterContainer } from "pages";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import "./App.css";

// Color pallete referencing https://colorhunt.co/palette/22272

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#00695f"
    },
    secondary: {
      main: "#ff1744"
    }
  },
  mixins: {
    toolbar: {
      height: "48px"
    }
  },
  overrides: {
    MuiListItem: {},
    MuiListItemIcon: {
      root: {
        minWidth: "40px"
      }
    },
    MuiTypography: {
      h6: {
        fontSize: "1.1rem"
      }
    }
  }
});

const store = configureStore();

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <MuiThemeProvider theme={theme}>
          <ThemeProvider
            theme={outerTheme => ({ darkMode: true, ...outerTheme })}
          >
            <RouterContainer />
          </ThemeProvider>
        </MuiThemeProvider>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
