const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");
const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin");
const utils = require("./utils");
const baseConf = require("./base.conf");
const { DEV_HOST, DEV_PORT } = require("../config/env");

const plugins = [
    new webpack.DefinePlugin({
        "process.env": {
            NODE_ENV: JSON.stringify("development")
        }
    }),
    new webpack.HotModuleReplacementPlugin(),
    // Log hot updated module path
    new webpack.NamedModulesPlugin(),
    // Add FriendlyErrorsPlugin
    new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
            messages: [`Your application is running here: http://${DEV_HOST}:${DEV_PORT}`]
        },
        onErrors: utils.createNotifierCallback()
    })
];

const rules = [
    {
        test: /\.css$/,
        include: [/global/, /node_modules/],
        loader: "style-loader!css-loader?sourceMap!postcss-loader"
    },
    {
        test: /\.css$/,
        exclude: [/global/, /node_modules/],
        loader:
            "style-loader!css-loader?modules&sourceMap&importLoaders=1&localIdentName=[local]_[name]__[hash:base64:5]!postcss-loader"
    },
    {
        test: /\.less$/,
        include: [/global/, /node_modules/],
        loader: "style-loader!css-loader?sourceMap!postcss-loader!less-loader"
    },
    {
        test: /\.less$/,
        exclude: [/global/, /node_modules/],
        loader:
            "style-loader!css-loader?modules&sourceMap&importLoaders=1&localIdentName=[local]_[name]__[hash:base64:5]!postcss-loader!less-loader"
    }
];

module.exports = merge(baseConf, {
    devtool: "#source-map",
    entry: {
        app: [path.resolve(__dirname, "../src/app.tsx")]
    },
    output: {
        path: path.resolve(__dirname, "../dist/assets"),
        publicPath: "/assets/",
        filename: "js/[name].js",
        chunkFilename: "js/[name].chunk.js"
    },
    module: {
        rules
    },
    plugins,
    devServer: {
        contentBase: path.resolve(__dirname, "../dist"),
        compress: true,
        host: DEV_HOST,
        port: DEV_PORT,
        hot: true,
        open: false,
        quiet: true, // necessary for FriendlyErrorsPlugin
        historyApiFallback: {
            index: "index.html"
        }
        // openPage: "layout.htm"
        // publicPath: "http://localhost:9001/"
    }
});
