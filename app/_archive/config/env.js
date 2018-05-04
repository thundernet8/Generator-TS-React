exports.IS_NODE =
    typeof global !== "undefined" && new Object().toString.call(global) === "[object global]";

exports.IS_PROD = process.env.NODE_ENV === "production";

// CDN or Local assets url
exports.PUBLIC_ASSETS_URL = exports.IS_PROD ? "/assets/" : "/assets/";

exports.API_BASE = exports.IS_PROD
    ? "https://www.example.com/api/"
    : "http:127.0.0.1:7001";

exports.DEV_HOST = "localhost";

exports.DEV_PORT = 7000;
