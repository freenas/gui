var Montage = require("montage/core/core").Montage,
    Promise = require("montage/core/promise").Promise,
    ObjectDescriptor = require("montage-data/logic/model/object-descriptor").ObjectDescriptor,
    ModelDescriptor = require("core/model/model-descriptor").ModelDescriptor,
    modelsMJSON = require("./models.mjson");

//todo: need review with benoit

var _Model = null;


Object.defineProperty(exports, "Model", {
    get: function () {
        if (!_Model) {
            _initialize();
        }

        return _Model;
    }
});


function _initialize () {
    var models = modelsMJSON.models,
        model;

    _Model = Object.create(null);

    if (models) {
        for (var i = 0, length = models.length; i < length; i++) {
            model = models[i];

            _setGetterForType(model.type, model.modelId);
        }
    }

    Object.defineProperties(_Model, {

        getPrototypeForType: {
            value: function (type) {
                var objectDescriptor = this[typeof type === "string" ? type : type.typeName];

                if (!objectDescriptor) {
                    return Promise.reject(new Error("wrong type given!"));
                }

                if (!objectDescriptor.objectPrototype || objectDescriptor.objectPrototype !== Montage) {
                    return ModelDescriptor.getDescriptorWithModelId(objectDescriptor.modelId, require).then(function (descriptor) {
                        return (objectDescriptor.objectPrototype = descriptor.newInstancePrototype());
                    });
                }

                return Promise.resolve(type.objectPrototype);
            }
        },


        getModelIdForType: {
            value: function (type) {
                return this[type].modelId;
            }
        }

    });

    _Model.fetchPrototypeForType = _Model.getPrototypeForType;
}


function _setGetterForType (type, modelId) {
    var types = _Model,
        camelCaseType = type.toCamelCase();

    Object.defineProperty(types, camelCaseType, {
        get: function () {
            var privateType = "_" + camelCaseType,
                objectDescriptor = types[privateType];

            if (!objectDescriptor) {
                objectDescriptor = types[privateType] = new ObjectDescriptor();
                objectDescriptor.typeName = camelCaseType;
                objectDescriptor.modelId = modelId;
            }

            return objectDescriptor;
        }
    });
}
