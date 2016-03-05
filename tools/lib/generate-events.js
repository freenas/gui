var FS = require('./fs-promise');
var Service = require('./backend/service');
var Promise = require('montage/core/promise').Promise;
var Path = require('path');


exports.generateEventTypesForEntities = function generateEventTypesForEntities (options) {
    return Service.findEventTypesForEntities(options).then(function (eventTypesForEntities) {
        if (options.save) {
            return FS.getAbsolutePath(options.target).then(function (absoluteTarget) {
                return FS.isDirectoryAtPath(absoluteTarget).then(function (isDirectoryAtPath) {
                    if (isDirectoryAtPath) {
                        var targetPath = Path.join(absoluteTarget, "events.mjson");

                        if (options.verbose) {
                            console.log(JSON.stringify(eventTypesForEntities, null, 4));
                        }

                        return FS.writeFileAtPathWithData(targetPath, JSON.stringify(eventTypesForEntities, null, 4));
                    } else {
                        throw new Error("not a directory");
                    }
                });
            });
        }

        return Promise.resolve();
    });
};
