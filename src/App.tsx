import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import configureStore from "store";
import { RouterContainer } from "pages";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import "./App.css";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#212121"
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
