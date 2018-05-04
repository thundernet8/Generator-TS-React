const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const ora = require('ora');
const chalk = require('chalk');

const appFolder = path.resolve(process.cwd(), 'app');

// 删除archive压缩文件
function removeFile(fileName) {
    return new Promise((resolve, reject) => {
        const filePath = path.resolve(appFolder, `${fileName}.zip`);
        if (fs.existsSync(filePath)) {
            fs.unlink(filePath, function(error) {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        } else {
            resolve();
        }
    });
}

// 压缩文件
function zipFile(fileName) {
    return new Promise((resolve, reject) => {
        exec(`cd app && zip -q -r -o ${fileName}.zip ./${fileName}/`, function(
            error
        ) {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

// git add 文件
function gitAdd() {
    return new Promise((resolve, reject) => {
        exec('git add -A', function(error) {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

const spinner = ora();
spinner.start();
spinner.text = chalk.white('Building...');

(async function() {
    await Promise.all([removeFile('_archive')])
        .then(() => Promise.all([zipFile('_archive')]))
        .then(() => gitAdd())
        .then(() => {
            spinner.stop();
            console.log(chalk.green('Build successfully'));
        })
        .catch(error => {
            spinner.stop();
            console.log(chalk.red(`Build failed: ${error.message}`));
        });
})();
