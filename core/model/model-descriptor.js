//FIXME: NEED to merge to descriptor.

var Blueprint = require("montage/core/meta/blueprint").Blueprint;
var Deserializer = require("montage/core/serialization/deserializer/montage-deserializer").MontageDeserializer;
var ModuleReference = require("montage/core/module-reference").ModuleReference;

// Cache all loaded descriptor
var DESCRIPTOR_CACHE = Object.create(null);

/**
 * @class ModelDescriptor
 * @extends Blueprint
 */
var ModelDescriptor = exports.ModelDescriptor = Blueprint.specialize(/* @lends ModelDescriptor# */ null, {

    /**
     * Gets a descriptor from a serialized file at the given module id.
     * @function
     * @param {string} descriptor module id
     * @param {function} require function
     */
    getDescriptorWithModuleId: {
        value: function (moduleId, _require) {
            if (moduleId.search(/\.mjson/) === -1) {
                throw new Error(moduleId + " descriptor module id does not end in '.mjson'");
            }
            if (!_require) {
                throw new Error("Require needed to get descriptor " + moduleId);
            }

            var targetRequire;

            var key = _require.location + "#" + moduleId;
            if (key in DESCRIPTOR_CACHE) {
                return DESCRIPTOR_CACHE[key];
            }

            return DESCRIPTOR_CACHE[key] = _require.async(moduleId)
                .then(function (object) {
                    // Need to get the require from the module, because thats
                    // what all the moduleId references are relative to.
                    targetRequire = getModuleRequire(_require, moduleId);
                    return new Deserializer().init(JSON.stringify(object), targetRequire).deserializeObject();
                }).then(function (blueprint) {
                    blueprint.blueprintInstanceModule = new ModuleReference().initWithIdAndRequire(moduleId, _require);

                    if (blueprint._parentReference) {
                        // Load parent "synchronously" so that all the properties
                        // through the blueprint chain are available
                        return blueprint._parentReference.promise(targetRequire) // MARK
                            .then(function (parentBlueprint) {
                                blueprint._parent = parentBlueprint;
                                return blueprint;
                            });
                    }

                    return blueprint;
                });
        }
    }
});

// Adapted from mr/sandbox
function getModuleRequire(parentRequire, moduleId) {
    var topId = parentRequire.resolve(moduleId);
    var module = parentRequire.getModuleDescriptor(topId);

    while (module.redirect || module.mappingRedirect) {
        if (module.redirect) {
            topId = module.redirect;
        } else {
            parentRequire = module.mappingRequire;
            topId = module.mappingRedirect;
        }
        module = parentRequire.getModuleDescriptor(topId);
    }

    return module.require;
}

