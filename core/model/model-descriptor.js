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
     * Gets a descriptor from a serialized file at the given model ID
     * @function
     * @param {string} descriptor model ID
     * @param {function} require function
     */
    getDescriptorWithModelId: {
        value: function (modelId, _require) {
            if (modelId.search(/\.mjson/) === -1) {
                throw new Error(modelId + " descriptor module id does not end in '.mjson'");
            }
            if (!_require) {
                throw new Error("Require needed to get descriptor " + modelId);
            }

            var targetRequire;

            var key = _require.location + "#" + modelId;
            if (key in DESCRIPTOR_CACHE) {
                return DESCRIPTOR_CACHE[key];
            }

            return DESCRIPTOR_CACHE[key] = _require.async(modelId)
                .then(function (object) {
                    targetRequire = getModelRequire(_require, modelId);
                    return new Deserializer().init(JSON.stringify(object), targetRequire).deserializeObject();
                }).then(function (blueprint) {
                    blueprint.blueprintInstanceModule = new ModuleReference().initWithIdAndRequire(modelId, _require);

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
function getModelRequire(parentRequire, modelId) {
    var topId = parentRequire.resolve(modelId);
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

