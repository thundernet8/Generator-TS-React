const path = require("path");
const webpack = require("webpack");
const { PUBLIC_ASSETS_URL, IS_PROD } = require("../config/env");
const AssetsPlugin = require("assets-webpack-plugin");

const getPlugins = function() {
    let plugins = [
        new webpack.DllPlugin({
            context: __dirname,
            path: ".dll/manifest.json",
            name: IS_PROD ? "[name]_[chunkhash:8]" : "[name]"
        }),
        new AssetsPlugin({
            filename: "venders-config.json",
            path: ".dll/"
        }),
        new webpack.HashedModuleIdsPlugin()
    ];

    if (IS_PROD) {
        plugins.push(
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                },
                sourceMap: true
            })
        );
    }
    return plugins;
};

const config = {
    entry: {
        venders: [
            "react",
            "react-dom",
            "react-router-dom",
            "mobx",
            "mobx-react",
            "axios",
            "classnames",
            "react-document-meta",
            "moment"
        ]
    },
    output: {
        path: path.resolve(__dirname, "../dist/assets/js"),
        publicPath: IS_PROD ? `${PUBLIC_ASSETS_URL}js/` : "/assets/js/",
        filename: IS_PROD ? "[name].[chunkhash:8].js" : "[name].js",
        library: IS_PROD ? "[name]_[chunkhash:8]" : "[name]"
    },
    resolve: {
        modules: ["node_modules"]
    },
    plugins: getPlugins()
};

if (!IS_PROD) {
    config.devtool = "#source-map"; // '#eval-source-map'
}

module.exports = config;
