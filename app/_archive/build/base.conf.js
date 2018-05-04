const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const pkg = require("../package.json");

const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const vendersConfig = require("../.dll/venders-config.json");

const getPlugins = function() {
    let plugins = [
        new webpack.BannerPlugin(
            `Generated on ${new Date().toString()}\n\nCopyright 2018-present, WuXueqian. All rights reserved.\n\n@package   ${
                pkg.name
            }\n@version   v${pkg.version}\n@author    ${pkg.author}\n`
        ),
        new CopyWebpackPlugin([
            { from: "src/favicon.ico", to: path.resolve(__dirname, "../dist") },
            { from: "src/robots.txt", to: path.resolve(__dirname, "../dist") }
        ]),
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require("../.dll/manifest.json")
        }),
        new HtmlWebpackPlugin({
            filename: path.resolve(__dirname, "../dist/index.html"),
            template: "src/index.html",
            inject: true,
            vendersName: vendersConfig.venders.js,
            meta: "",
            htmlDom: "",
            state: ""
        })
    ];

    if (!!process.env.ANALYZE_ENV) {
        plugins.push(new BundleAnalyzerPlugin());
    }

    return plugins;
};

const getRules = function() {
    let rules = [
        {
            test: /\.jsx?$/,
            loader: "babel-loader",
            exclude: /node_modules/
        },
        {
            test: /\.tsx?$/,
            loader: "babel-loader!ts-loader",
            exclude: /node_modules/
        },
        {
            test: /\.json$/,
            loader: "json-loader",
            exclude: /node_modules/
        },
        {
            test: /\.(png|jpg|gif)$/,
            exclude: /node_modules/,
            loader: "url-loader",
            query: {
                limit: 2000,
                name: "img/[name].[ext]" // 'assets/img/[name].[ext]?[hash:7]'
            }
        },
        {
            test: /\.(woff|woff2|eot|ttf|svg)/, // if /\.(woff|woff2|eot|ttf|svg)$/ the font-awesome with url like xx.woff?v=4.7.0 can not be loaded
            exclude: /node_modules/,
            loader: "url-loader",
            query: {
                limit: 10000,
                name: "fonts/[name].[ext]"
            }
        }
    ];

    return rules;
};

module.exports = {
    node: {
        __filename: false,
        __dirname: false
    },
    resolve: {
        extensions: [".json", ".js", ".jsx", ".ts", ".tsx", ".css", ".less"],
        alias: {
            IMG: path.resolve(__dirname, "../src/assets/images/"),
            STYLES: path.resolve(__dirname, "../src/assets/styles"),
            FONTS: path.resolve(__dirname, "../src/assets/fonts")
        },
        modules: ["node_modules", path.resolve(__dirname, "../src")]
    },
    target: "web",
    module: {
        rules: getRules()
    },
    plugins: getPlugins()
};
