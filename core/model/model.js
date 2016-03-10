var Montage = require("montage/core/core").Montage,
    Promise = require("montage/core/promise").Promise,
    Services = require("./services").Services,
    ObjectDescriptor = require("montage-data/logic/model/object-descriptor").ObjectDescriptor,
    ModelDescriptor = require("core/model/model-descriptor").ModelDescriptor,
    modelsMJSON = require("./models.mjson");


//todo: need review with @benoit
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

    _Model.getPrototypeForType = function (type) {
        var objectDescriptor = this[typeof type === "string" ? type : type.typeName];

        if (!objectDescriptor) {
            return Promise.reject(new Error("wrong type given!"));
        }

        if (!objectDescriptor.objectPrototype || objectDescriptor.objectPrototype !== Montage) {
            return ModelDescriptor.getDescriptorWithModelId(objectDescriptor.modelId, require).then(function (descriptor) {
                var objectPrototype = descriptor.newInstancePrototype().prototype,
                    instanceServices = Services.findInstanceServicesForType(type);

                if (instanceServices) {
                    _applyInstanceServicesOnPrototype(instanceServices, objectPrototype);
                }

                objectPrototype.Type = type;

                return (objectDescriptor.objectPrototype = objectPrototype);
            });
        }

        return Promise.resolve(type.objectPrototype);
    };

    _Model.getModelIdForType = function (type) {
        return this[type].modelId;
    };
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
                objectDescriptor.objectPrototype = null; // override default value (Montage.prototype)
            }

            return objectDescriptor;
        }
    });
}


function _applyInstanceServicesOnPrototype (instanceServices, prototype) {
    var instanceServicesKeys = Object.keys(instanceServices),
        instanceServicesKey;

    for (var i = 0, length = instanceServicesKeys.length; i < length; i++) {
        instanceServicesKey = instanceServicesKeys[i];
        _applyInstanceServiceOnPrototype(instanceServicesKey, instanceServices[instanceServicesKey], prototype);
    }
}


function _applyInstanceServiceOnPrototype (serviceName, serviceDescriptor, prototype) {
    Object.defineProperty(prototype, serviceName, {
        value: function () {
            var argumentsLength = arguments.length,
                args;

            if (argumentsLength) {
                args = argumentsLength === 1 ? [arguments[0]] : Array.apply(null, arguments);
            }

            return _Model.backendBridge.send(
                serviceDescriptor.namespace,
                serviceDescriptor.name, {
                    method: serviceDescriptor.method,
                    args:  args ? [serviceDescriptor.task, args] : [serviceDescriptor.task]
                }
            );
        }
    });
}
