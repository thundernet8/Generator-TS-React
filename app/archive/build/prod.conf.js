const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");
const baseConf = require("./base.conf");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const { PUBLIC_ASSETS_URL } = require("../config/env");

const plugins = [
    new webpack.DefinePlugin({
        "process.env": {
            NODE_ENV: JSON.stringify("production")
        }
    }),
    new webpack.optimize.UglifyJsPlugin({
        compress: { warnings: false },
        sourceMap: true
    }),
    new ExtractTextPlugin({
        filename: "css/app.[contenthash:8].css",
        disable: false,
        allChunks: true
    }),
    new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessor: require("cssnano"), // eslint-disable-line global-require
        cssProcessorOptions: { discardComments: { removeAll: true } },
        canPrint: true
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
        name: "manifest",
        minChunks: Infinity
    }),
    // keep module.id stable when vendor modules does not change
    new webpack.HashedModuleIdsPlugin(),
    // enable scope hoisting
    new webpack.optimize.ModuleConcatenationPlugin()
];

const rules = [
    {
        test: /\.css$/,
        include: [/global/, /node_modules/],
        loader: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: "css-loader?sourceMap!postcss-loader"
        })
    },
    {
        test: /\.css$/,
        exclude: [/global/, /node_modules/],
        loader: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use:
                "css-loader?modules&sourceMap&importLoaders=1&localIdentName=__[hash:base64:5]!postcss-loader"
        })
    },
    {
        test: /\.less$/,
        include: [/global/, /node_modules/],
        loader: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: "css-loader?sourceMap!postcss-loader!less-loader"
        })
    },
    {
        test: /\.less$/,
        exclude: [/global/, /node_modules/],
        loader: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use:
                "css-loader?modules&sourceMap&importLoaders=1&localIdentName=__[hash:base64:5]!postcss-loader!less-loader"
        })
    }
];

module.exports = merge(baseConf, {
    entry: {
        app: [path.resolve(__dirname, "../src/app.tsx")]
    },
    output: {
        path: path.resolve(__dirname, "../dist/assets"),
        publicPath: PUBLIC_ASSETS_URL,
        filename: "js/[name].[chunkhash:8].js",
        chunkFilename: "js/[name].[chunkhash:8].chunk.js"
    },
    module: {
        rules
    },
    plugins
});
