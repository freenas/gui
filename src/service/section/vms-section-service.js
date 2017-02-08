var AbstractSectionService = require("core/service/section/abstract-section-service").AbstractSectionService,
    VmGuestType = require("core/model/enumerations/vm-guest-type").VmGuestType,
    VmConfigBootloader = require("core/model/enumerations/vm-config-bootloader").VmConfigBootloader,
    VmDeviceDiskMode = require("core/model/enumerations/vm-device-disk-mode").VmDeviceDiskMode,
    VmDeviceDiskTargetType = require("core/model/enumerations/vm-device-disk-target-type").VmDeviceDiskTargetType,
    VmDeviceGraphicsResolution = require("core/model/enumerations/vm-device-graphics-resolution").VmDeviceGraphicsResolution,
    VmDeviceNicDevice = require("core/model/enumerations/vm-device-nic-device").VmDeviceNicDevice,
    VmDeviceNicMode = require("core/model/enumerations/vm-device-nic-mode").VmDeviceNicMode,
    VmDeviceUsbDevice = require("core/model/enumerations/vm-device-usb-device").VmDeviceUsbDevice,
    VmDeviceVolumeType = require("core/model/enumerations/vm-device-volume-type").VmDeviceVolumeType,
    VmDatastoreNfsVersion = require("core/model/enumerations/vm-datastore-nfs-version").VmDatastoreNfsVersion,
    VmRepository = require("core/repository/vm-repository").VmRepository,
    VmDatastoreRepository = require("core/repository/VmDatastoreRepository").VmDatastoreRepository,
    VolumeRepository = require("core/repository/volume-repository").VolumeRepository,
    DiskRepository = require("core/repository/disk-repository").DiskRepository,
    NetworkRepository = require("core/repository/network-repository").NetworkRepository,
    BytesService = require("core/service/bytes-service").BytesService,
    ConsoleService = require("core/service/console-service").ConsoleService,
    CONSTANTS = require("core/constants"),
    Dict = require("collections/dict").Dict,
    EventDispatcherService = require("core/service/event-dispatcher-service").EventDispatcherService,
    MiddlewareClient = require("core/service/middleware-client").MiddlewareClient,
    ModelEventName = require("core/model-event-name").ModelEventName,
    Model = require("core/model").Model,
    uuid = require("uuid"),
    _ = require("lodash");

exports.VmsSectionService = AbstractSectionService.specialize({
    DEFAULT_STRING: {
        value: CONSTANTS.DEFAULT_SELECT_STRING
    },

    _guestTypes: {
        value: null
    },

    GUEST_TYPES: {
        get: function() {
            if (!this._guestTypes) {
                var labels = new Dict({
                    "linux32":      "Linux (32-bit)",
                    "linux64":      "Linux (64-bit)",
                    "freebsd32":    "FreeBSD (32-bit)",
                    "freebsd64":    "FreeBSD (64-bit)",
                    "netbsd32":     "NetBSD (32-bit)",
                    "netbsd64":     "NetBSD (64-bit)",
                    "openbsd32":    "OpenBSD (32-bit)",
                    "openbsd64":    "OpenBSD (64-bit)",
                    "windows64":    "Windows (64-bit)",
                    "solaris64":    "Solaris (64-bit)",
                    "other":        "Other",
                    "other32":      "Other (32-bit)",
                    "other64":      "Other (64-bit)"
                });
                this._guestTypes = VmGuestType.members.map(function(x) {
                    return {
                        label: labels.get(x, x),
                        value: x
                    };
                });
            }

            return this._guestTypes;
        }
    },

    BOOTLOADERS: {
        get: function() {
            return VmConfigBootloader.members;
        }
    },

    DISK_MODES: {
        get: function() {
            return VmDeviceDiskMode.members;
        }
    },

    TARGET_TYPES: {
        get: function() {
            return VmDeviceDiskTargetType.members;
        }
    },

    GRAPHICS_RESOLUTIONS: {
        get: function() {
            return VmDeviceGraphicsResolution.members;
        }
    },

    NIC_DEVICES: {
        get: function() {
            return VmDeviceNicDevice.members;
        }
    },

    NIC_MODES: {
        get: function() {
            return VmDeviceNicMode.members;
        }
    },

    USB_DEVICES: {
        get: function() {
            return VmDeviceUsbDevice.members;
        }
    },

    VOLUME_TYPES: {
        get: function() {
            return _.without(VmDeviceVolumeType.members, 'NFS');
        }
    },

    NFS_DATASTORE_VERSIONS: {
        get: function() {
            return VmDatastoreNfsVersion.members;
        }
    },

    init: {
        value: function() {
            this._vmRepository = VmRepository.getInstance();
            this._vmDatastoreRepository = VmDatastoreRepository.getInstance();
            this._volumeRepository = VolumeRepository.getInstance();
            this._diskRepository = DiskRepository.getInstance();
            this._networkRepository = NetworkRepository.getInstance();
            this._consoleService = ConsoleService.instance;
            this._bytesService = BytesService.instance;
            EventDispatcherService.getInstance().addEventListener(ModelEventName.Vm.listChange, this._handleVmsChange.bind(this));
        }
    },

    loadEntries: {
        value: function() {
            var self = this;
            this.entries = [];
            this.entries._objectType = 'Vm';
            return this._vmRepository.listVms().then(function(entries) {
                return _.assign(_.sortBy(entries, 'name' ), { _objectType: 'Vm' });
            }).then(function(entries) {
                return Promise.all(
                    _.map(entries, function(entry) {
                        entry._hasGraphicDevice = _.get(entry, 'devices').some(function (x) {
                            return x.type === self._vmRepository.DEVICE_TYPE.GRAPHICS;
                        });
                        return entry;
                    })
                );
            });
        }
    },

    loadExtraEntries: {
        value: function() {
            return Promise.all([this._vmDatastoreRepository.list()]);
        }
    },

    listVolumes: {
        value: function() {
            return this._volumeRepository.listVolumes();
        }
    },

    listDisks: {
        value: function() {
            return this._vmDatastoreRepository.listDiskTargetsWithType('DISK');
        }
    },

    listBlocksInDatastore: {
        value: function(datastoreId) {
            return this._vmDatastoreRepository.listDiskTargetsWithTypeInDatastore('BLOCK', datastoreId)
        }
    },

    listFilesInDatastore: {
        value: function(datastoreId) {
            return this._vmDatastoreRepository.listDiskTargetsWithTypeInDatastore('FILE', datastoreId)
        }
    },

    listTemplates: {
        value: function() {
            return this._vmRepository.listTemplates();
        }
    },

    getNewVmDeviceList: {
        value: function() {
            return this._vmRepository.getNewVmDeviceList();
        }
    },

    getNewVmVolumeList: {
        value: function() {
            return this._vmRepository.getNewVmVolumeList();
        }
    },

    addDevicesToVm: {
        value: function(vm, devices) {
            var device;
            for (var i = 0, length = devices.length; i < length; i++) {
                device = devices[i];
                if (vm.devices.indexOf(device) === -1) {
                    vm.devices.push(device);
                }
            }
        }
    },

    addNewDeviceToVm: {
        value: function(vm, device) {
            device._isNew = false;
            this.addDevicesToVm(vm, [device]);
        }
    },

    removeDevicesFromVm: {
        value: function(vm, devices) {
            if (Array.isArray(vm.devices)) {
                var deviceIndex;
                for (var i = 0, length = devices.length; i < length; i++) {
                    deviceIndex = vm.devices.indexOf(devices[i]);
                    if (deviceIndex !== -1) {
                        vm.devices.splice(deviceIndex, 1);
                    }
                }
            }
        }
    },

    removeDeviceFromVm: {
        value: function(vm, device) {
            this.removeDevicesFromVm(vm, [device]);
        }
    },

    convertDiskSizeToString: {
        value: function(size) {
            return this._bytesService.convertSizeToString(size, this._bytesService.UNITS.B);
        }
    },

    convertDiskSizeStringToSize: {
        value: function(sizeString) {
            return this._bytesService.convertStringToSize(sizeString, this._bytesService.UNITS.B);
        }
    },

    initializeNewDevice: {
        value: function(device) {
            return VmRepository.initializeNewVmDevice(device);
        }
    },

    setReadmeOnVm: {
        value: function(vm) {
            return this._vmRepository.getVmReadme(vm).then(function(vmReadme) {
                vm._readme = vmReadme;
                return vm;
            });
       }
    },

    populateVmWithTemplate: {
        value: function(vm, template) {
            var self = this;
            vm.config = Object.clone(template.config);
            vm.config.readme = template.template.readme;
            vm.guest_type = template.guest_type;
            vm.template = Object.clone(template.template);

            var devicesPromises = [];
            if (Array.isArray(template.devices)) {
                for (var i = 0, length = template.devices.length; i < length; i++) {
                    devicesPromises.push(this._vmRepository.cloneVmDevice(template.devices[i]));
                }
            }
            return Promise.all([
                Promise.all(devicesPromises),
                this.setReadmeOnVm(vm)
            ]).spread(function(devices) {
                vm.devices = devices;
                return vm;
            });
        }
    },

    clearTemplateFromVm: {
        value: function(vm) {
            vm.template = null;
            return vm;
        }
    },

    updateBootDevices: {
        value: function(vm) {
            var hasChanged = false;
            if (!vm._bootDevices) {
                vm._bootDevices = [];
                hasChanged = true;
            }
            if (vm.devices) {
                var i, length, entry;
                for (i = 0, length = vm.devices.length; i < length; i++) {
                    entry = vm.devices[i];
                    if (this._isDeviceBootable(entry)
                        && vm._bootDevices.filter(function(x) { return x.label === entry.name }).length === 0) {
                        vm._bootDevices.push({
                            label: entry.name,
                            value: entry.name
                        });
                        hasChanged = true;
                    }
                }
                for (i = vm._bootDevices.length - 1; i >= 0; i--) {
                    entry = vm._bootDevices[i];
                    if (vm.devices.filter(function(x) { return x.name === entry.label }).length === 0) {
                        vm._bootDevices.splice(i, 1);
                        hasChanged = true;
                    }
                }
            } else {
                vm._bootDevices = [];
            }
            return hasChanged;
        }
    },

    getGuestInfo: {
        value: function(vm) {
            return this._vmRepository.getGuestInfo(vm);
        }
    },

    getWebVncConsoleUrl: {
        value: function(vm) {
            return this._vmRepository.getWebVncConsoleUrl(vm);
        }
    },

    getSerialConsoleUrl: {
        value: function(vm) {
            return this._vmRepository.getSerialToken(vm).then(function(token) {
                return MiddlewareClient.getRootURL('http') + '/serial-console-app/#' + token;
            });
        }
    },

    startVm: {
        value: function(vm) {
            return this._vmRepository.startVm(vm);
        }
    },

    stopVm: {
        value: function(vm, force) {
            return this._vmRepository.stopVm(vm, !!force);
        }
    },

    rebootVm: {
        value: function(vm) {
            return this._vmRepository.rebootVm(vm);
        }
    },

    saveVm: {
        value: function(vm) {
            vm.config.memsize = this._bytesService.convertStringToSize(vm._memory, this._bytesService.UNITS.M);
            vm.target = vm.target === this.DEFAULT_STRING ? null : vm.target;
            vm.config.readme = vm._readme.text;
            return this._vmRepository.saveVm(vm);
        }
    },

    listNetworkInterfaces: {
        value: function() {
            return this._networkRepository.listNetworkInterfaces();
        }
    },

    initializeVm: {
        value: function(vm) {
            var self = this;
            this._initializeDevicesOnVm(vm);
            if (vm._isNew) {
                self._initializeNewVm(vm);
            }
            vm._bootDevice = vm.config.boot_device;
        }
    },

    loadSettings: {
        value: function() {
            return this._vmRepository.getVmSettings();
        }
    },

    saveSettings: {
        value: function(settings) {
            return this._vmRepository.saveVmSettings(settings);
        }
    },

    revertSettings: {
        value: function() {
            return this._vmRepository.revertVmSettings();
        }
    },

    cloneVmToName: {
        value: function (vmId, name) {
            return this._vmRepository.cloneVmToName(vmId, name);
        }
    },

    _initializeDevicesOnVm: {
        value: function(vm) {
            if (!vm.devices) {
                vm.devices = [];
                vm.devices._objectType = 'VmDevice';
            }
        }
    },

    _initializeNewVm: {
        value: function(vm) {
            vm.config = this._vmRepository.DEFAULT_VM_CONFIG;
            vm.guest_type = "other";
            vm.config.ncpus = 1;
            vm.config.memsize = 512;
            vm.template = {};
        }
    },

    _isDeviceBootable: {
        value: function(device) {
            return this._vmRepository.BOOTABLE_DEVICE_TYPES.indexOf(device.type) != -1;
        }
    },

    _populateDefaultValuesOnVmDevice: {
        value: function(device) {
            var defaults = this._vmRepository.DEFAULT_DEVICE_PROPERTIES[device.type];
            if (defaults) {
                var keys = Object.keys(defaults),
                    key;
                for (var i = 0, length = keys.length; i < length; i++) {
                    key = keys[i];
                    if (!device.properties.hasOwnProperty(key)) {
                        device.properties[key] = defaults[key];
                    }
                }
            }
        }
    },

    _handleVmsChange: {
        value: function(vms) {
            var self = this;
            if (!this.entries) {
                this.entries = [];
            }
            _.forEach(vms.toJS(), function(vm) {
                // DTM
                var entry = _.find(self.entries, {id: _.get(vm, 'id')});
                if (entry) {
                    _.assign(entry, vm);
                    entry._hasGraphicDevice = _.get(vm, 'devices').some(function (x) {
                        return x.type === self._vmRepository.DEVICE_TYPE.GRAPHICS;
                    });
                } else {
                    entry = _.assign(vm, {_objectType: Model.Vm});
                    entry._hasGraphicDevice = _.get(vm, 'devices').some(function (x) {
                        return x.type === self._vmRepository.DEVICE_TYPE.GRAPHICS;
                    });
                    self.entries.push(entry);
                }
            });
            // DTM
            if (this.entries) {
                for (var i = this.entries.length - 1; i >= 0; i--) {
                    if (!vms.has(this.entries[i].id)) {
                        this.entries.splice(i, 1);
                    }
                }
            }
        }
    }
});
