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


    getUserInterfaceDescriptorForType: {
        value: function (modelType, object) {
            var key = modelType.typeName,
                subType = "";

            //Fixme: should be generic
            if (Model.NetworkInterface === modelType && object && object.type && object.type !== "ETHER") {
                key += +"_" + object.type;
                subType = "-" + object.type.toLowerCase()
            }

            var userInterfaceDescriptorPromise = UserInterfaceDescriptorPromisesMap.get(key);

            if (!userInterfaceDescriptorPromise) {
                userInterfaceDescriptorPromise = new Promise(function (resolve, reject) {
                    var userInterfaceDescriptorPrefix = modelType.typeName.split(/(?=[A-Z])/).join("-").toLowerCase(),
                        objectUserInterfaceDescriptorId = ModelUserInterfaceDescriptorsFolderPath;

                    objectUserInterfaceDescriptorId += userInterfaceDescriptorPrefix + subType + UserInterfaceDescriptorSuffix;

                    require.async(objectUserInterfaceDescriptorId).then(function (userInterfaceDescriptor) {
                        return new Deserializer().init(JSON.stringify(userInterfaceDescriptor), require)
                            .deserializeObject().then(resolve);
                    }, reject);
                });

                UserInterfaceDescriptorPromisesMap.set(key, userInterfaceDescriptorPromise);
            }
            return userInterfaceDescriptorPromise;
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
                userInterfaceDescriptorPromise = this.getUserInterfaceDescriptorForType(modelType, object);
            } else {
                return Promise.reject("no user interface descriptor for object: " + object);
            }

            return userInterfaceDescriptorPromise;
        }
    }

});
