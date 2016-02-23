var FS = require('./fs-promise');
var Path = require('path');

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

        models.sort(function (a, b) {
            if (a.type > b.type)
                return 1;
            if (a.type < b.type)
                return -1;
            return 0;
        });

        var targetPath = options.target;

        return FS.getAbsolutePath(targetPath).then(function (absoluteTarget) {
            return FS.isDirectoryAtPath(absoluteTarget).then(function (isDirectoryAtPath) {
                if (isDirectoryAtPath) {
                    targetPath = Path.join(absoluteTarget, "models.mjson");
                }

                return FS.writeFileAtPathWithData(targetPath, JSON.stringify(modelsFile, null, 4));
            });
        });

    });
};
