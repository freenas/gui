var FS = require('./fs-promise');
var Promise = require('montage/core/promise').Promise;

exports.cleanMontageDataCache = function (enumerationsDirectoryPath, descriptorsDirectoryPath, modelsDirectoryPath) {
    return Promise.all([
        FS.removeFolderAtPath(enumerationsDirectoryPath),
        FS.removeFolderAtPath(modelsDirectoryPath),
        FS.removeFolderAtPath(descriptorsDirectoryPath)]).then(function () {

        return Promise.all([
            FS.createDirectoryAtPath(enumerationsDirectoryPath),
            FS.createDirectoryAtPath(modelsDirectoryPath),
            FS.createDirectoryAtPath(descriptorsDirectoryPath)]);
    });
};
