var AbstractRepository = require("core/repository/abstract-repository").AbstractRepository,
    VmDeviceVolumeType = require("core/model/enumerations/vm-device-volume-type").VmDeviceVolumeType,
    VmDao = require("core/dao/vm-dao").VmDao,
    VmTemplateDao = require("core/dao/vm-template-dao").VmTemplateDao,
    VmDeviceDao = require("core/dao/vm-device-dao").VmDeviceDao,
    VmVolumeDao = require("core/dao/vm-volume-dao").VmVolumeDao,
    VmReadmeDao = require("core/dao/vm-readme-dao").VmReadmeDao,
    VmConfigDao = require("core/dao/vm-config-dao").VmConfigDao,
    uuid = require("node-uuid"),
    _ = require("lodash");

exports.VmRepository = AbstractRepository.specialize({
    init: {
        value: function() {
            this._vmDao = new VmDao();
            this._vmTemplateDao = new VmTemplateDao();
            this._vmDeviceDao = new VmDeviceDao();
            this._vmVolumeDao = new VmVolumeDao();
            this._vmReadmeDao = new VmReadmeDao();
            this._vmConfigDao = new VmConfigDao();

            this.DEFAULT_VM_CONFIG = this.constructor.DEFAULT_VM_CONFIG;
            this.DEFAULT_DEVICE_PROPERTIES = this.constructor.DEFAULT_DEVICE_PROPERTIES;
            this.DEFAULT_DEVICE_ID = this.constructor.DEFAULT_DEVICE_ID;
            this.BOOTABLE_DEVICE_TYPES = this.constructor.BOOTABLE_DEVICE_TYPES;
            this.DEVICE_TYPE = this.constructor.DEVICE_TYPE;
        }
    },

    listVms: {
        value: function() {
            if (this._vms) {
                return Promise.resolve(this._vms);
            } else if (this._vmsPromise) {
                return this._vmsPromise;
            } else {
                var self = this;
                return this._vmPromise = this._vmDao.list().then(function(vms) {
                    vms.forEach(function(vm) {
                        vm.devices.forEach(function(device) {
                            device.id = uuid.v4();
                        });
                    });
                    self.vmsPromises = null;
                    return self._vms = vms;
                });
            }
        }
    },

    getNewVm: {
        value: function() {
            return this._vmDao.getNewInstance();
        }
    },

    getNewVmVolume: {
        value: function() {
            var self = this;
            return this._vmVolumeDao.getNewInstance().then(function(vmVolume) {
                vmVolume.id = uuid.v4();
                vmVolume.type = self.DEVICE_TYPE.VOLUME;
                return vmVolume;
            });
        }
    },

    listTemplates: {
        value: function() {
            if (this._templates) {
                return Promise.resolve(this._templates);
            } else if (this._templatesPromise && !this._templatesPromise.isRejected()) {
                return this._templatesPromise;
            } else {
                var self = this;
                return this._templatePromise = this._vmTemplateDao.list().then(function(templates) {
                    return self._templates = templates;
                }).finally(function() {
                    self.templatesPromises = null;
                });
            }
        }
    },

    getVmSettings: {
        value: function() {
            var self = this;
            this._vmSettings = {};
            return this._vmConfigDao.get().then(function(config) {
                self._vmSettings.config = config;
                return self._vmSettings;
            });
        }
    },

    saveVmSettings: {
        value: function() {
            return this._vmConfigDao.save(this._vmSettings.config);
        }
    },

    revertVmSettings: {
        value: function() {
            return this._vmConfigDao.revert(this._vmSettings.config);
        }
    },

    getNewVmDeviceList: {
        value: function() {
            return this._vmDeviceDao.getEmptyList();
        }
    },

    getNewVmVolumeList: {
        value: function() {
            return this._vmVolumeDao.getEmptyList();
        }
    },

    getVmReadme: {
        value: function(vm) {
            return this._vmReadmeDao.getNewInstance().then(function(vmReadme) {
                vmReadme.text = vm.config ? vm.config.readme : null;
                return vmReadme;
            });
        }
    },

    getNewVmDevice: {
        value: function() {
            return this._vmDeviceDao.getNewInstance();
        }
    },

    getNewVmDeviceForType: {
        value: function(type) {
            return type !== this.DEVICE_TYPE.VOLUME && this._vmDeviceDao.getNewInstance().then(function(device) {
                device.id = uuid.v4();
                device._tmpId = type;
                device.type = type;
                return device;
            });
        }
    },

    initializeNewVmDevice: {
        value: function(device) {
            if (device.type === this.DEVICE_TYPE.VOLUME) {
                device.properties.type = VmDeviceVolumeType.VT9P;
            }
        }
    },

    startVm: {
        value: function(vm) {
            return this._vmDao.start(vm);
        }
    },

    stopVm: {
        value: function(vm) {
            return this._vmDao.stop(vm);
        }
    },

    rebootVm: {
        value: function(vm) {
            return this._vmDao.reboot(vm);
        }
    },

    saveVm: {
        value: function(vm) {
            var vmPlain = _.toPlainObject(vm);
            if (Array.isArray(vmPlain.devices)) {
                var device;
                for (var i = 0; i < vmPlain.devices.length; i++) {
                    device = _.toPlainObject(vmPlain.devices[i]);
                    if (!device.identifier &&
                        (typeof device.identifier === 'object' || typeof device.identifier === 'object')) {
                        delete device.identifier;
                    }
                    vmPlain.devices[i] = device;
                }
            }
            return this._vmDao.save(vmPlain);
        }
    },

    getSerialToken: {
        value: function(vmId) {
            return this._vmDao.requestSerialConsole(vmId);
        }
    },

    getHardwareCapabilities: {
        value: function() {
            return this._vmDao.getHardwareCapabilities();
        }
    }

}, {
    DEVICE_TYPE: {
        value: {
            CDROM: 'CDROM',
            DISK: 'DISK',
            GRAPHICS: 'GRAPHICS',
            NIC: 'NIC',
            USB: 'USB',
            VOLUME: 'VOLUME'
        }
    },

    BOOTABLE_DEVICE_TYPES: {
        value: [
            'VOLUME',
            'CDROM',
            'DISK'
        ]
    },

    DEFAULT_DEVICE_ID: {
        value: "FAKE_DEVICE_ID"
    },

    DEFAULT_CLONE_DEVICE_ID: {
        value: "TEMPLATE_DEVICE_ID"
    },

    DEFAULT_VM_CONFIG: {
        value: {
            ncpus: '',
            bootloader: "GRUB"
        }
    },

    DEFAULT_DEVICE_PROPERTIES: {
        value: {
            CDROM: {
            },
            DISK: {
                mode: "AHCI"
            },
            GRAPHICS: {
                resolution: "1024x768"
            },
            NIC: {
                mode: "NAT",
                device: "VIRTIO"
            },
            USB: {
                device: "tablet"
            }
        }
    }
});
