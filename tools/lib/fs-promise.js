var Path = require('path');
var FS = require("fs");
var rimraf = require("rimraf");
var Promise = require('montage/core/promise').Promise;

var isDirectoryAtPath = exports.isDirectoryAtPath = function isDirectoryAtPath (path) {
    return new Promise(function (resolve, reject) {
        return getAbsolutePath(path).then(function (absolutePath) {
            FS.stat(absolutePath, function (error, stats) {
                if (error) {
                    reject(error);
                    return;
                }

                resolve(stats.isDirectory());
            });
        }, reject);
    });
};


var getAbsolutePath = exports.getAbsolutePath = function getAbsolutePath (path) {
    if (typeof path === "string" && path.length) {
        if (!Path.isAbsolute(path)) {
            path = Path.join(process.cwd(), path);
        }

        return Promise.resolve(path);
    }

    return Promise.resolve(process.cwd());
};


var listDirectoryAtPath = exports.listDirectoryAtPath = function listDirectoryAtPath (path) {
    return new Promise(function (resolve, reject) {
        return isDirectoryAtPath(path).then(function (isDirectory) {
            if (isDirectory) {
                return getAbsolutePath(path).then(function (absolutePath) {
                    return FS.readdir(absolutePath, function (error, files) {
                        if (error) {
                            reject(error);
                            return;
                        }

                        resolve(files);
                    });
                }, reject);
            } else {
                reject(new Error("not a directory"))
            }
        });
    });
};


var writeFileAtPathWithData = exports.writeFileAtPathWithData = function writeFileAtPathWithData (path, data) {
    return new Promise(function (resolve, reject) {
        if (global.verbose) {
            console.log("writing " + path);
        }

        FS.writeFile(path, data, function (error) {
            if (error) {
                reject(error);
            } else {
                resolve(path)
            }
        });
    });
};


exports.removeFolderAtPath = function (path) {
    return new Promise(function (resolve, reject) {
        if (global.verbose) {
            console.log("deleting folder at " + path);
        }

        rimraf(path, function (error) {
            if (error) {
                reject(error);

                return void 0;
            }

            resolve();
        });
    });
};

exports.createDirectoryAtPath = function (path) {
    return new Promise(function (resolve, reject) {
        if (global.verbose) {
            console.log("creating directory at " + path);
        }

        FS.mkdir(path, function (error) {
            if (error) {
                reject(error);
            } else {
                resolve()
            }
        });
    });
};
