const Generator = require("yeoman-generator");
const pkg = require("../package.json");
const chalk = require("chalk");
const prompt = require("prompt");
const fs = require("fs");
const path = require("path");
const mkdir = require("mkdirp");
const prettier = require("prettier");
const vfs = require("vinyl-fs");
const { getInstalledPathSync } = require("get-installed-path");

const prettierConfig = {
    tabWidth: 4,
    useTabs: false,
    singleQuote: false,
    bracketSpacing: true,
    parser: "json"
};

function copyFolder(from, to) {
    from += "/**/*.*";
    vfs.src(from).pipe(vfs.dest(to));
}

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);

        // Next, add your custom code
        this.option("babel"); // This method adds support for a `--babel` flag

        // user options
        this.userOptions = {};
        this.hasError = false;
    }

    info() {
        console.log(chalk.cyan.bold(` ${pkg.name} v${pkg.version}`));
    }

    promptOptions() {
        const that = this;
        const done = this.async();

        prompt.message = chalk.gray(" question");
        prompt.delimiter = ":";
        prompt.start();

        prompt.get(
            {
                properties: {
                    name: {
                        description: chalk.white.bold("name"),
                        type: "string",
                        pattern: /^[a-z0-9-_]+$/,
                        message: "name must be lower-cased letters",
                        hidden: false,
                        replace: "*",
                        default: "",
                        required: true
                    },
                    description: {
                        description: chalk.white.bold("description"),
                        type: "string",
                        default: "",
                        required: false
                    },
                    main: {
                        description: chalk.white.bold("main"),
                        type: "string",
                        default: "index.js",
                        required: false
                    },
                    author: {
                        description: chalk.white.bold("author (name <email>)"),
                        type: "string",
                        default: "",
                        required: false
                    },
                    license: {
                        description: chalk.white.bold("license"),
                        type: "string",
                        default: "MIT",
                        required: false
                    }
                }
            },
            function(err, result) {
                if (err) {
                    if (err.message !== "canceled") throw err;
                }
                that.userOptions = Object.assign(
                    {
                        version: "1.0.0",
                        description: "",
                        main: "index.js",
                        author: "",
                        license: "MIT"
                    },
                    result
                );
                done("");
            }
        );
    }

    writePkg() {
        const folder = this.userOptions.name;
        if (fs.existsSync(folder)) {
            console.log(chalk.red.bold(`\n folder ${folder} was existed`));
            this.hasError = true;
            return false;
        }

        mkdir.sync(folder);

        const templatePkg = require("./archive/package.json");
        const json = Object.assign(templatePkg, this.userOptions);
        fs.writeFileSync(
            path.resolve(process.cwd(), folder + "/package.json"),
            prettier.format(JSON.stringify(json), prettierConfig)
        );
    }

    copyFiles() {
        if (this.hasError) {
            return false;
        }
        const baseDir = path.resolve(process.cwd(), this.userOptions.name);
        const templateFolder = path.resolve(
            getInstalledPathSync(pkg.name),
            "app/archive"
        );

        ["build", "config", "src", "typings"].forEach(function(folder) {
            copyFolder(
                path.resolve(templateFolder, folder),
                path.resolve(baseDir, folder)
            );
        });

        ["postcss.config.js", "tsconfig.json"].forEach(function(file) {
            fs.copyFileSync(
                path.resolve(templateFolder, file),
                path.resolve(baseDir)
            );
        });

        [
            "babelrc",
            "gitignore",
            "prettierrc",
            "stylelintrc",
            "tslintrc.json"
        ].forEach(function(file) {
            fs.copyFileSync(
                path.resolve(templateFolder, file),
                path.resolve(baseDir, "." + file)
            );
        });
    }

    end() {
        if (this.hasError) {
            console.log(
                chalk.red.bold(`\n Fail init project ${this.userOptions.name}`)
            );
        } else {
            console.log(
                chalk.green.bold(
                    `\n Successfully init project ${this.userOptions.name}`
                )
            );
        }
    }
};
