var AbstractSectionService = require("core/service/section/abstract-section-service").AbstractSectionService,
    VmGuestType = require("core/model/enumerations/vm-guest-type").VmGuestType,
    VmConfigBootloader = require("core/model/enumerations/vm-config-bootloader").VmConfigBootloader,
    VmDeviceDiskMode = require("core/model/enumerations/vm-device-disk-mode").VmDeviceDiskMode,
    VmDeviceGraphicsResolution = require("core/model/enumerations/vm-device-graphics-resolution").VmDeviceGraphicsResolution,
    VmDeviceNicDevice = require("core/model/enumerations/vm-device-nic-device").VmDeviceNicDevice,
    VmDeviceNicMode = require("core/model/enumerations/vm-device-nic-mode").VmDeviceNicMode,
    VmDeviceUsbDevice = require("core/model/enumerations/vm-device-usb-device").VmDeviceUsbDevice,
    VmDeviceVolumeType = require("core/model/enumerations/vm-device-volume-type").VmDeviceVolumeType,
    VmRepository = require("core/repository/vm-repository").VmRepository,
    VolumeRepository = require("core/repository/volume-repository").VolumeRepository,
    NetworkRepository = require("core/repository/network-repository").NetworkRepository,
    BytesService = require("core/service/bytes-service").BytesService,
    ConsoleService = require("core/service/console-service").ConsoleService,
    CONSTANTS = require("core/constants"),
    Dict = require("collections/dict").Dict;

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
            return VmDeviceVolumeType.members;
        }
    },

    init: {
        value: function(vmRepository, volumeRepository, networkRepository, bytesService, consoleService) {
            this._vmRepository = vmRepository || VmRepository.instance;
            this._volumeRepository = volumeRepository || VolumeRepository.getInstance();
            this._networkRepository = networkRepository || NetworkRepository.instance;
            this._consoleService = consoleService || ConsoleService.instance;
            this._bytesService = bytesService || BytesService.instance;
        }
    },

    loadEntries: {
        value: function() {
            return this._vmRepository.listVms();
        }
    },

    listVolumes: {
        value: function() {
            return this._volumeRepository.listVolumes();
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

    categorizeDevices: {
        value: function(vm, addedDevices, removedDevices) {
            addedDevices = addedDevices || vm.devices;
            var i, length, device;
            if (Array.isArray(addedDevices)) {
                for (i = 0, length = addedDevices.length; i < length; i++) {
                    device = addedDevices[i];
                    if (!device.id) {
                        device.id = this._vmRepository.DEFAULT_DEVICE_ID;
                    }
                    if (device.type === this._vmRepository.DEVICE_TYPE.VOLUME) {
                        if (vm._volumeDevices.indexOf(device) === -1) {
                            vm._volumeDevices.push(device);
                        }
                    } else {
                        if (vm._nonVolumeDevices.indexOf(device) === -1) {
                            vm._nonVolumeDevices.push(device);
                        }
                    }
                }
            }

            if (Array.isArray(removedDevices)) {
                var deviceIndex;
                for (i = 0, length = removedDevices.length; i < length; i++) {
                    device = removedDevices[i];
                    if (device.type === this._vmRepository.DEVICE_TYPE.VOLUME) {
                        deviceIndex = vm._volumeDevices.indexOf(device);
                        if (deviceIndex !== -1) {
                            vm._volumeDevices.splice(deviceIndex, 1);
                        }
                    } else {
                        deviceIndex = vm._nonVolumeDevices.indexOf(device);
                        if (deviceIndex !== -1) {
                            vm._nonVolumeDevices.splice(deviceIndex, 1);
                        }
                    }
                }
            }
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
            return this._vmRepository.initializeNewVmDevice(device);
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
            vm.config = Object.clone(template.config);
            vm.config.readme = template.template.readme;
            this._setMemoryOnVm(vm);
            vm.guest_type = template.guest_type;
            vm.template = Object.clone(template.template);

            var devicesPromises = [];
            if (Array.isArray(template.devices)) {
                for (var i = 0, length = template.devices.length; i < length; i++) {
                    devicesPromises.push(this._cloneVmDevice(template.devices[i]));
                }
            }
            return Promise.all([
                Promise.all(devicesPromises),
                this.setReadmeOnVm(vm)
            ]).then(function(results) {
                vm.devices = results[0];
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

    getVncConsoleForVm: {
        value: function(vm) {
            return vm.constructor.services.requestWebvncConsole(vm.id);
        }
    },

    getSerialConsoleForVm: {
        value: function(vm) {
            return this._vmRepository.getSerialToken(vm.id).then(function(token) {
                return "/serial-console-app/#" + token;
            });
        }
    },

    startVm: {
        value: function(vm) {
            vm.services.start(vm.id);
        }
    },

    stopVm: {
        value: function(vm, force) {
            vm.services.stop(vm.id, !!force);
        }
    },

    rebootVm: {
        value: function(vm) {
            vm.services.reboot(vm.id);
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
            return this._initializeDevicesOnVm(vm).then(function() {
                if (vm._isNew) {
                    self._initializeNewVm(vm);
                }
                self._setMemoryOnVm(vm);
                vm._bootDevice = vm.config.boot_device;
            });
        }
    },

    _initializeDevicesOnVm: {
        value: function(vm) {
            var promises = [];
            if (!vm.devices) {
                promises.push(
                    this._vmRepository.getNewVmDeviceList().then(function(devices) {
                        return vm.devices = devices;
                    })
                );
            }
            if (!vm._nonVolumeDevices) {
                promises.push(
                    this._vmRepository.getNewVmDeviceList().then(function(devices) {
                        return vm._nonVolumeDevices = devices;
                    })
                );
            }
            if (!vm._volumeDevices) {
                promises.push(
                    this._vmRepository.getNewVmVolumeList().then(function(devices) {
                        return vm._volumeDevices = devices;
                    })
                );
            }
            return Promise.all(promises);
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

    _setMemoryOnVm: {
        value: function(vm) {
            vm._memory = this._bytesService.convertSizeToString(vm.config.memsize, this._bytesService.UNITS.M);
        }
    },

    _isDeviceBootable: {
        value: function(device) {
            return this._vmRepository.BOOTABLE_DEVICE_TYPES.indexOf(device.type) != -1;
        }
    },

    _cloneVmDevice: {
        value: function(device) {
            var self = this;
            return this._vmRepository.getNewVmDevice().then(function(clone) {
                clone.id = self._vmRepository.DEFAULT_CLONE_DEVICE_ID;
                clone._isNew = false;
                clone.type = device.type;
                clone.name = device.name;
                clone.properties = Object.clone(device.properties);
                self._populateDefaultValuesOnVmDevice(clone);
                return clone;
            });
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
    }
});
