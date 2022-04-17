import { resolve, join } from "path";
import { Configuration as WebpackConfiguration } from "webpack";
import { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

const PROD = process.env.NODE_ENV === "production";

const config: Configuration = {
  entry: "./src/index.tsx",
  mode: PROD ? "production" : "development",
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              "@babel/preset-typescript",
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.svg$/,
        use: ["svg-url-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".jsx", ".ts", ".js", ".css"],
  },
  output: {
    path: resolve(__dirname, "build"),
    filename: "bundle.js",
  },
  devServer: {
    static: join(resolve(__dirname), "build"),
    compress: true,
    port: 3000,
    historyApiFallback: true,
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      async: false,
    }),
    new HtmlWebpackPlugin({
      template: join(resolve(__dirname), "public", "index.html"),
      favicon: join(resolve(__dirname), "public", "beefy.ico"),
      logo192: join(resolve(__dirname), "public", "beefy-192.png"),
    }),
  ],
};

export default config;
