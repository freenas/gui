/*global require, exports, Error*/
require("./extras/string");

var Deserializer = require("montage/core/serialization/deserializer/montage-deserializer").MontageDeserializer,
    FreeNASService = require("core/service/freenas-service").FreeNASService,
    TopologyService = require("core/service/topology-service").TopologyService,
    SelectionService = require("core/service/selection-service").SelectionService,
    BootEnvironmentService = require("core/service/boot-environment-service").BootEnvironmentService,
    CalendarService = require("core/service/calendar-service").CalendarService,
    StorageService = require("core/service/storage-service").StorageService,
    UpdateService = require("core/service/update-service").UpdateService,
    FilesystemService = require("core/service/filesystem-service").FilesystemService,
    StatisticsService = require("core/service/statistics-service").StatisticsService,
    SystemService = require("core/service/system-service").SystemService,
    SystemInfoService = require("core/service/system-info-service").SystemInfoService,
    SystemDeviceService = require("core/service/system-device-service").SystemDeviceService,
    NetworkInterfaceService = require("core/service/network-interface-service").NetworkInterfaceService,
    ShareService = require("core/service/share-service").ShareService,
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
            app.topologyService = TopologyService.instance;
            app.selectionService = SelectionService.instance;
            app.bootEnvironmentService = BootEnvironmentService.instance;
            app.calendarService = CalendarService.instance;
            app.storageService = StorageService.instance;
            app.updateService = UpdateService.instance;
            app.filesystemService = FilesystemService.instance;
            app.statisticsService = StatisticsService.instance;
            app.systemService = SystemService.instance;
            app.systemInfoService = SystemInfoService.instance;
            app.systemDeviceService = SystemDeviceService.instance;
            app.networkInterfacesSevice = NetworkInterfaceService.instance;
            app.shareService = ShareService.instance;
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

            modelType = modelType || (object ? object.constructor.Type : null);

            if (modelType) {
                userInterfaceDescriptorPromise = this.getUserInterfaceDescriptorForType(modelType, object);
            } else {
                return Promise.reject("no user interface descriptor for object: " + object);
            }

            return userInterfaceDescriptorPromise;
        }
    }

});
