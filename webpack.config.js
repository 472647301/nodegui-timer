const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const os = require("os");

const plugins = [new CleanWebpackPlugin()];
const iohookPath = "./node_modules/iohook/builds";
if (os.platform() === "win32") {
  plugins.push(
    new CopyPlugin({
      patterns: [
        {
          from: iohookPath + "/node-v83-win32-x64/build/Release/uiohook.dll",
        },
      ],
    })
  );
}

module.exports = {
  mode: process.NODE_ENV || "development",
  entry: "./src/main.tsx",
  target: "node",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
  },
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: { cacheDirectory: true, cacheCompression: false },
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: "file-loader",
            options: { publicPath: "dist" },
          },
        ],
      },
      {
        test: /\.node$/,
        use: [
          {
            loader: "native-addon-loader",
            options: { name: "[name]-[hash].[ext]" },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx", ".json"],
  },
  plugins: plugins,
};
