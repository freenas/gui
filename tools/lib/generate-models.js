var FS = require('./fs-promise');
var ModelFactory = require('./factory/model-factory');
var Path = require('path');
var Promise = require('montage/core/promise').Promise;


exports.generateModels = function generateModels (source, options) {
    return FS.listDirectoryAtPath(source).then(function (files) {
        var models = [],
            modelsMap = new Map();

        modelsMap.set("AbstractModel", true);

        return Promise.map(files, function (file) {
            return FS.readFileAtPath(Path.join(source, file)).then(function (data) {
                return JSON.parse(data);
            });
        }).then(function (data) {
            var model, i, length, ii, ll, _require;

            for (i = 0, length = data.length; i < length; i++) {
                model = ModelFactory.createModelWithDescriptor(data[i]);

                if (model) {
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
};
