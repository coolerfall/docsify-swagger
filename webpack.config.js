const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  context: path.join(__dirname, "src"),
  entry: {
    "docsify-swagger.min": ["./index.js"],
  },
  mode: "production",
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({ include: /\.min\.js$/ }),
    ]
  },
  resolve: {
    extensions: [".js"]
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    libraryTarget: "umd",
    umdNamedDefine: true
  }
};
