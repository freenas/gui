var AbstractRepository = require("core/repository/abstract-repository").AbstractRepository,
    VmDeviceVolumeType = require("core/model/enumerations/vm-device-volume-type").VmDeviceVolumeType,
    VmDao = require("core/dao/vm-dao").VmDao,
    VmTemplateDao = require("core/dao/vm-template-dao").VmTemplateDao,
    VmDeviceDao = require("core/dao/vm-device-dao").VmDeviceDao,
    VmVolumeDao = require("core/dao/vm-volume-dao").VmVolumeDao,
    VmReadmeDao = require("core/dao/vm-readme-dao").VmReadmeDao;

exports.VmRepository = AbstractRepository.specialize({
    init: {
        value: function(vmDao, vmTemplateDao, vmDeviceDao, vmVolumeDao, vmReadmeDao) {
            this._vmDao = vmDao || VmDao.getInstance();
            this._vmTemplateDao = vmTemplateDao || VmTemplateDao.getInstance();
            this._vmDeviceDao = vmDeviceDao || VmDeviceDao.instance;
            this._vmVolumeDao = vmVolumeDao || VmVolumeDao.instance;
            this._vmReadmeDao = vmReadmeDao || VmReadmeDao.instance;

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
                    self.vmsPromises = null;
                    return self._vms = vms;
                });
            }
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
            })
        }
    },

    getNewVmDevice: {
        value: function() {
            return this._vmDeviceDao.getNewInstance();
        }
    },

    initializeNewVmDevice: {
        value: function(device) {
            if (device.type === this.DEVICE_TYPE.VOLUME) {
                device.properties.type = VmDeviceVolumeType.VT9P;
            }
        }
    },

    saveVm: {
        value: function(vm) {
            return this._vmDao.save(vm);
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
