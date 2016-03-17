/*global require, exports, Error*/
require("./extras/string");

var Deserializer = require("montage/core/serialization/deserializer/montage-deserializer").MontageDeserializer,
    FreeNASService = require("core/service/freenas-service").FreeNASService,
    Model = require("core/model/model").Model,
    Montage = require("montage").Montage;


var ModelUserInterfaceDescriptorsFolderPath = "core/model/user-interface-descriptors/",
    UserInterfaceDescriptorSuffix = "-user-interface-descriptor.mjson",
    UserInterfaceDescriptorPromisesMap = new Map();


exports.ApplicationDelegate = Montage.specialize({


    /**
     * @function
     * @public
     *
     * @description todo
     *
     */
    willFinishLoading: {
        value: function (app) {
            app.dataService = FreeNASService.instance;
        }
    },


    /**
     * @function
     * @public
     *
     * @description todo
     *
     * @return {Promise.<UserInterfaceDescriptor>}
     *
     */
    userInterfaceDescriptorForObject: {
        value: function (object) {
            var userInterfaceDescriptorPromise,
                modelType;

            if (Array.isArray(object)) {
                if (object._meta_data) {
                    modelType = object._meta_data.collectionModelType;
                }

                object = object[0];
            }

            modelType = modelType || (object ? Object.getPrototypeOf(object).Type : null);

            if (modelType) {
                userInterfaceDescriptorPromise = UserInterfaceDescriptorPromisesMap.get(modelType.typeName);

                if (!userInterfaceDescriptorPromise) {
                    userInterfaceDescriptorPromise = new Promise(function (resolve, reject) {
                        var userInterfaceDescriptorPrefix = modelType.typeName.split(/(?=[A-Z])/).join("-").toLowerCase(),
                            objectUserInterfaceDescriptorId = ModelUserInterfaceDescriptorsFolderPath;

                        if (Model.NetworkInterface === modelType) {
                            objectUserInterfaceDescriptorId += userInterfaceDescriptorPrefix +
                                (object && object.type !== "ETHER" ? "-" + object.type.toLowerCase() : "") +
                                UserInterfaceDescriptorSuffix;

                        } else {
                            objectUserInterfaceDescriptorId += userInterfaceDescriptorPrefix +
                                UserInterfaceDescriptorSuffix;
                        }

                        require.async(objectUserInterfaceDescriptorId).then(function (userInterfaceDescriptor) {
                            return new Deserializer().init(JSON.stringify(userInterfaceDescriptor), require)
                                .deserializeObject().then(resolve);
                        }, reject);
                    });

                    UserInterfaceDescriptorPromisesMap.set(modelType.typeName, userInterfaceDescriptorPromise);
                }
            } else {
                return Promise.reject("no user interface descriptor for object: " + object);
            }

            return userInterfaceDescriptorPromise;
        }
    }

});
