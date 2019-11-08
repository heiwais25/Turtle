const path = require("path");

// webpack.config.js
module.exports = [
  {
    mode: "development",
    entry: "./src/electronMain/index.ts",
    target: "electron-main",
    devtool: "inline-source-map",
    watch: true,
    devServer: {
      contentBase: "./dist",
      hot: true
    },
    watchOptions: {
      poll: true,
      ignored: /node_modules/
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "electron.bundle.js"
    },
    module: {
      rules: [
        {
          test: /\.(js|ts)$/,
          exclude: /(node_modules)/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
              plugins: [
                "@babel/proposal-class-properties",
                "@babel/proposal-object-rest-spread"
              ]
            }
          }
        },
        {
          test: /\.ts$/,
          use: [{ loader: "ts-loader" }]
        }
      ]
    }
  }
];
