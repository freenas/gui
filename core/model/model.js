var Promise = require("montage/core/promise").Promise,
    Services = require("./services").Services,
    ObjectDescriptor = require("montage-data/logic/model/object-descriptor").ObjectDescriptor,
    backendBridge = require("../backend/backend-bridge").defaultBackendBridge,
    modelsMJSON = require("./models.mjson"),

    EMPTY_ARRAY = [];

var MiddlewareClient = require("core/service/middleware-client").MiddlewareClient;

var _Model = null,
    _middlewareClient = null;

Object.defineProperty(exports, "Model", {
    get: function () {
        if (!_Model) {
            _initialize();
        }

        return _Model;
    }
});


function _initialize () {
    _middlewareClient = MiddlewareClient.getInstance();    
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
        var objectDescriptor = _Model[typeof type === "string" ? type : type.typeName];

        if (!objectDescriptor) {
            return Promise.reject(new Error("wrong type given!"));
        }

        if (!objectDescriptor.objectPrototype) {
            // Set objectPrototype to a promise while building it
            // in order to avoid to require for a second time the object Prototype.

            return (objectDescriptor.objectPrototype = require.async(objectDescriptor.modelId).then(function (_exports) {
                var constructor = _exports[objectDescriptor.typeName],
                    objectPrototype = constructor.prototype,
                    classServices = Services.findClassServicesForType(objectDescriptor),
                    instanceServices = Services.findInstanceServicesForType(objectDescriptor);

                if (instanceServices) {
                    _applyServicesOnObject(instanceServices, objectPrototype);
                }

                if (classServices) {
                    _applyServicesOnObject(classServices, constructor);
                }

                constructor.Type = objectPrototype.Type = objectDescriptor;
                objectDescriptor.constructor = constructor;

                return (objectDescriptor.objectPrototype = objectPrototype);
            }));
        } else if (Promise.is(objectDescriptor.objectPrototype)) {
            return objectDescriptor.objectPrototype;
        }

        return Promise.resolve(objectDescriptor.objectPrototype);
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
    if (!object.services) {
        object.services = {};
    }
    Object.defineProperty(object.services, serviceName, {
        value: function () {
            var argumentsLength = arguments.length,
                isTask = !!serviceDescriptor.task,
                args;

            if (argumentsLength) {
                if (argumentsLength === 1) {
                    args = [arguments[0]];
                } else {
                    args = Array.apply(null, arguments);
                }
            }

            if (isTask) {
                args = args ? [serviceDescriptor.task, args] : [serviceDescriptor.task, []];
            } else {
                args = args ? args : EMPTY_ARRAY;
            }

            return _middlewareClient.callRpcMethod(serviceDescriptor.method, args).then(function (response) {
                return response.data;
            }).catch(function (response) {
                console.warn(response.error || response);

                throw response;
            });
        }
    });
}
