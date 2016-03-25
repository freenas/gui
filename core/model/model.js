var Montage = require("montage/core/core").Montage,
    Promise = require("montage/core/promise").Promise,
    Services = require("./services").Services,
    ObjectDescriptor = require("montage-data/logic/model/object-descriptor").ObjectDescriptor,
    ModelDescriptor = require("core/model/model-descriptor").ModelDescriptor,
    backendBridge = require("../backend/backend-bridge").defaultBackendBridge,
    NotificationCenterModule = require("../backend/notification-center"),
    modelsMJSON = require("./models.mjson"),

    EMPTY_ARRAY = [];


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

    _Model.populateObjectPrototypeForType = function (type) {
        var objectDescriptor = this[typeof type === "string" ? type : type.typeName];

        if (!objectDescriptor) {
            return Promise.reject(new Error("wrong type given!"));
        }

        if (!objectDescriptor.objectPrototype || objectDescriptor.objectPrototype !== Montage) {
            return ModelDescriptor.getDescriptorWithModelId(objectDescriptor.modelId, require).then(function (descriptor) {
                var constructor = descriptor.newInstancePrototype(),
                    objectPrototype = constructor.prototype,
                    classServices = Services.findClassServicesForType(type),
                    instanceServices = Services.findInstanceServicesForType(type);

                if (instanceServices) {
                    _applyServicesOnObject(instanceServices, objectPrototype);
                }

                if (classServices) {
                    _applyServicesOnObject(classServices, constructor);
                }

                objectPrototype.Type = type;
                objectDescriptor.constructor = constructor;

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


function _applyServicesOnObject (instanceServices, object) {
    var instanceServicesKeys = Object.keys(instanceServices),
        instanceServicesKey;

    for (var i = 0, length = instanceServicesKeys.length; i < length; i++) {
        instanceServicesKey = instanceServicesKeys[i];
        _applyServiceOnPrototype(instanceServicesKey, instanceServices[instanceServicesKey], object);
    }
}


function _applyServiceOnPrototype (serviceName, serviceDescriptor, object) {
    Object.defineProperty(object, serviceName, {
        value: function () {
            var argumentsLength = arguments.length,
                isTask = !!serviceDescriptor.task,
                args;

            if (argumentsLength) {
                args = argumentsLength === 1 ? [arguments[0]] : Array.apply(null, arguments);
            }

            if (isTask) {
                args = args ? [serviceDescriptor.task, args] : [serviceDescriptor.task];
            } else {
                args = args ? args : EMPTY_ARRAY;
            }

            return backendBridge.send(
                serviceDescriptor.namespace,
                serviceDescriptor.name, {
                    method: serviceDescriptor.method,
                    args:  args
                }
            ).then(function (response) {
                if (isTask) {
                    return NotificationCenterModule.defaultNotificationCenter.startTrackingTaskWithTaskAndJobId(
                        isTask ? serviceDescriptor.task : serviceDescriptor.name + "." + serviceDescriptor.method,
                        response.data
                    );
                }

                return response.data;
            }).catch(function (response) {
                console.warn(response.error || response);

                throw response;
            });
        }
    });
}
