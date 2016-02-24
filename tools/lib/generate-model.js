var FS = require('./fs-promise');
var Path = require('path');
var Promise = require('montage/core/promise').Promise;
require('json.sortify');

exports.generateModel = function generateModel (path, options) {
    return FS.listDirectoryAtPath(path).then(function (files) {
        var modelsFile = {
                models: []
            },
            models = modelsFile.models,
            file;

        for (var i = 0, length = files.length; i < length; i++) {
            file = files[i];

            var format = Path.parse(file);

            if (format.ext === ".mjson") {
                models.push({
                    type: format.name.toCamelCase(),
                    modelId: options.prefix ? Path.join(options.prefix, file) : file
                });
            }
        }

        if (options.save) {
            var targetPath = options.target;

            return FS.getAbsolutePath(targetPath).then(function (absoluteTarget) {
                return FS.isDirectoryAtPath(absoluteTarget).then(function (isDirectoryAtPath) {
                    if (isDirectoryAtPath) {
                        targetPath = Path.join(absoluteTarget, "models.mjson");
                    }

                    return FS.writeFileAtPathWithData(targetPath, JSON.sortify(modelsFile, null, 4));
                });
            });
        }

        return Promise.resolve();
    });
};
