var FS = require('./fs-promise');
var ModelFactory = require('./factory/model-factory');
var Path = require('path');
var Promise = require('montage/core/promise').Promise;

function _createFilesConcatPath (path) {
    return function (files) {
        return files.map(function (file) {

            return Path.join(path, file);
        });
    };
}

function isMJsonFile(file) {
    return file.lastIndexOf('.mjson') + '.mjson'.length === file.length;
}

exports.generateModels = function generateModels (paths, options, userDescriptorsPath) {
    if (!Array.isArray(paths)) {
        paths = [paths];
    }

    var userDescriptorsMap = new Map();

    return FS.listDirectoryAtPath(userDescriptorsPath).then(function (userDescriptorFiles) {
        return Promise.map(userDescriptorFiles.filter(isMJsonFile), function (userDescriptorFile) {
            var userDescriptorName = (userDescriptorFile.replace("-user-interface-descriptor.mjson", "")).toCamelCase();

            return FS.readFileAtPath(Path.join(userDescriptorsPath, userDescriptorFile)).then(function (data) {
                userDescriptorsMap.set(userDescriptorName, JSON.parse(data));
            });
        });
    }).then(function () {
        return Promise.map(paths, function (path) {
            return FS.listDirectoryAtPath(path).then(_createFilesConcatPath(path));
        }).then(function (filesFolders) {
            var files = [].concat.apply([], filesFolders),
                models = [],
                modelsMap = new Map();

            modelsMap.set("Montage", true);

            return Promise.map(files.filter(isMJsonFile), function (file) {
                return FS.readFileAtPath(file).then(function (data) {
                    return JSON.parse(data);
                });
            }).then(function (data) {
                var model, i, length, ii, ll, _require;

                for (i = 0, length = data.length; i < length; i++) {
                    model = ModelFactory.createModelWithDescriptor(data[i]);

                    if (model) {
                        if (userDescriptorsMap.has(model.name)) {
                            model.userInterfaceDescriptor = userDescriptorsMap.get(model.name);
                        }

                        models.push(model);
                        modelsMap.set(model.name, true);
                    }
                }

                //filter missing models
                for (i = 0, length = models.length; i < length; i++) {
                    model = models[i];

                    for (ii = 0, ll = model.requires.length; ii < ll; ii++) {
                        _require = model.requires[ii];

                        if (!modelsMap.has(_require.name)) {
                            model.requires.splice(ii, 1);
                            model.requiresMap.delete(_require.name);
                            ii--;
                            ll--;
                        }
                    }
                }

                if (options.save) {
                    return FS.getAbsolutePath(options.target).then(function (targetPath) {
                        return FS.isDirectoryAtPath(targetPath).then(function (isDirectoryAtPath) {
                            if (isDirectoryAtPath) {
                                return ModelFactory.saveModelsAtPath(models, targetPath);
                            }

                            throw new Error("not a directory");
                        });
                    });
                }
            });
        });
    });
};
