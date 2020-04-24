const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  context: path.join(__dirname, "example"),
  entry: {
    example: "../src/index.js"
  },
  mode: "development",
  devtool: "source-map",
  resolve: {
    extensions: [".js"]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "index.html"
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    host: "0.0.0.0",
    port: "3000",
    contentBase: path.resolve(__dirname, "example"),
    hot: true
  }
};
