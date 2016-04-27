/*global require, exports, Error*/
require("./extras/string");

var Deserializer = require("montage/core/serialization/deserializer/montage-deserializer").MontageDeserializer,
    FreeNASService = require("core/service/freenas-service").FreeNASService,
    FilesystemService = require("core/service/filesystem-service").FilesystemService,
    StatisticsService = require("core/service/statistics-service").StatisticsService,
    SystemInfoService = require("core/service/system-info-service").SystemInfoService,
    SystemDeviceService = require("core/service/system-device-service").SystemDeviceService,
    NetworkInterfaceService = require("core/service/network-interface-service").NetworkInterfaceService,
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
            app.filesystemService = FilesystemService.instance;
            app.statisticsService = StatisticsService.instance;
            app.systemInfoService = SystemInfoService.instance;
            app.systemDeviceService = SystemDeviceService.instance;
            app.networkInterfacesSevice = NetworkInterfaceService.instance;
        }
    },


    getUserInterfaceDescriptorForType: {
        value: function (modelType, object) {
            var key = modelType.typeName || modelType,
                subType = "";

            var userInterfaceDescriptorPromise = UserInterfaceDescriptorPromisesMap.get(key);

            if (!userInterfaceDescriptorPromise) {
                userInterfaceDescriptorPromise = new Promise(function (resolve, reject) {
                    var userInterfaceDescriptorPrefix = key.split(/(?=[A-Z])/).join("-").toLowerCase(),
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
