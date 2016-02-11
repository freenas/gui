var Montage = require("montage/core/core").Montage,
    Promise = require("montage/core/promise").Promise,
    ObjectDescriptor = require("montage-data/logic/model/object-descriptor").ObjectDescriptor,
    ModelDescriptor = require("core/model/model-descriptor").ModelDescriptor,
    modelsMJSON = require("./models.mjson");

//todo: need review with benoit
/**
 * @class Models
 * @extends Montage
 */
var Model = exports.Model = Montage.specialize(/* @lends ModelDescriptor# */null, {


    _initialize: {
        value: function () {
            var models = modelsMJSON.models,
                model;

            this._types = Object.create(null);

            if (models) {
                for (var i = 0, length = models.length; i < length; i++) {
                    model = models[i];

                    this._setGetterForType(model.type, model.modelId);
                }
            }
        }
    },


    _types: {
        value: null
    },


    types: {
        get: function () {
            if (!this._types) {
                this._initialize();
            }

            return this._types;
        }
    },


    getPrototypeForType: {
        value: function (type) {
            var objectDescriptor = this.types[typeof type === "string" ? type : type.typeName];

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
            return this.types[type].modelId;
        }
    },


    _setGetterForType: {
        value: function (type, modelId) {
            var types = this._types,
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
    }


});


Model.prototype.fetchPrototypeForType = Model.prototype.getPrototypeForType;
