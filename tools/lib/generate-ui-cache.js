var FS = require('./fs-promise');
var Path = require('path');
var Promise = require('montage/core/promise').Promise;
var REQUIRE_TEMPLATE = 'require("<MODULE_ID>");';
var beautify = require('js-beautify').js_beautify;

function _toFileName (name, separator) {
    return name.split(/(?=[A-Z])/).join(separator).toLowerCase();
}

exports.generateUICache = function generateUICache (path, options, modelsPath) {
    return FS.readFileAtPath(Path.join(path, "cache.json")).then(function (raw) {
        var cache = JSON.parse(raw),
            models = cache.MODELS_TO_PRELOAD,
            modules = cache.MODULES_TO_PRELOAD,
            cacheFile = "",
            i , length;

        for (i = 0, length = modules.length; i < length; i++) {
            cacheFile += REQUIRE_TEMPLATE.replace(/<MODULE_ID>/ig, modules[i]);
        }

        for (i = 0, length = models.length; i < length; i++) {
            cacheFile += REQUIRE_TEMPLATE.replace(/<MODULE_ID>/ig, Path.join(modelsPath, _toFileName(models[i], "-")));
        }

        if (options.save) {
            var targetPath = options.target;

            return FS.getAbsolutePath(targetPath).then(function (absoluteTarget) {
                return FS.isDirectoryAtPath(absoluteTarget).then(function (isDirectoryAtPath) {
                    if (isDirectoryAtPath) {
                        targetPath = Path.join(absoluteTarget, "cache.js");
                    }

                    return FS.writeFileAtPathWithData(targetPath, beautify(cacheFile, {
                        space_after_anon_function: true,
                        end_with_newline: true
                    }));
                });
            });
        }

        return Promise.resolve();
    });

};
