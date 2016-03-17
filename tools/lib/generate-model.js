var FS = require('./fs-promise');
var Path = require('path');
var Promise = require('montage/core/promise').Promise;
require('json.sortify');

exports.generateModel = function generateModel (paths, options) {
    if (!Array.isArray(paths)) {
        paths = [paths];
    }

    return Promise.map(paths, function (path) {
        return FS.listDirectoryAtPath(path);

    }).then(function (filesFolders) {
        var modelsFile = {
                models: []
            },
            models = modelsFile.models,
            filesFolder,
            descriptorFolderAbsolutePath,
            file;

        for (var i = 0, length = filesFolders.length; i < length; i++) {
            filesFolder = filesFolders[i];
            descriptorFolderAbsolutePath = paths[i];

            for (var ii = 0, ll = filesFolder.length; ii < ll; ii++) {
                file = filesFolder[ii];

                var format = Path.parse(file);

                if (format.ext === ".mjson") {
                    models.push({
                        type: format.name.toCamelCase(),
                        modelId: Path.join(Path.relative(__dirname, descriptorFolderAbsolutePath).replace(/\.\.\//g, ""), file)
                    });
                }
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
