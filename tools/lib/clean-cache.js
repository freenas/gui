var FS = require('./fs-promise');
var Promise = require('montage/core/promise').Promise;

exports.cleanMontageDataCache = function (enumerationsDirectoryPath, descriptorsDirectoryPath) {
    return Promise.all([
        FS.removeFolderAtPath(enumerationsDirectoryPath),
        FS.removeFolderAtPath(descriptorsDirectoryPath)]).then(function () {

        return Promise.all([
            FS.createDirectoryAtPath(enumerationsDirectoryPath),
            FS.createDirectoryAtPath(descriptorsDirectoryPath)]);
    });
};
