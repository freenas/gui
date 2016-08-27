var Montage = require("montage").Montage,
    FreeNASService = require("core/service/freenas-service").FreeNASService,
    BackEndBridgeModule = require("../backend/backend-bridge"),
    Model = require("core/model/model").Model,
    VmDeviceType = require("core/model/enumerations/vm-device-type").VmDeviceType;

var VirtualMachineService = exports.VirtualMachineService = Montage.specialize({
    _instance: {
        value: null
    },

    _dataService: {
        value: null
    },

    _backendBridge: {
        value: null
    },

    createCdromDevice: {
        value: function() {
            return this._createNewDevice(VmDeviceType.CDROM);
        }
    },

    createDiskDevice: {
        value: function() {
            return this._createNewDevice(VmDeviceType.DISK);
        }
    },

    createGraphicsDevice: {
        value: function() {
            return this._createNewDevice(VmDeviceType.GRAPHICS);
        }
    },

    createNicDevice: {
        value: function() {
            return this._createNewDevice(VmDeviceType.NIC);
        }
    },

    createUsbDevice: {
        value: function() {
            return this._createNewDevice(VmDeviceType.USB);
        }
    },

    _createNewDevice: {
        value: function(type) {
            return this._dataService.getNewInstanceForType(Model.VmDevice).then(function(device) {
                device.type = type;
                device._isNewObject = true;
                switch (type) {
                    case VmDeviceType.CDROM:
                        device.properties = {};
                        break;
                    case VmDeviceType.DISK:
                        device.properties = {
                            mode: "AHCI"
                        };
                        break;
                    case VmDeviceType.GRAPHICS:
                        device.properties = {
                            resolution: "1024x768"
                        };
                        break;
                    case VmDeviceType.NIC:
                        device.properties = {
                            mode: "NAT",
                            device: "VIRTIO"
                        };
                        break;
                    case VmDeviceType.USB:
                        device.properties = {
                            device: "tablet"
                        };
                        break;
                }
                return device;
            });
        }
    },

    getTemplates: {
        value: function() {
            var self = this;
            return this._callBackend("vm.template.query", []).then(function(templates) {
                var results = [];
                for (var i = 0, length = templates.data.length; i < length; i++) {
                    results.push(self._dataService.mapRawDataToType(templates.data[i], Model.Vm));
                }
                return Promise.all(results);
            });
        }
    },

    _callBackend: {
        value: function(method, args) {
            return this._backendBridge.send("rpc", "call", {
                method: method,
                args: args
            });
        }
    }
}, {
    instance: {
        get: function() {
            if (!this._instance) {
                this._instance = new VirtualMachineService();
                this._instance._dataService = FreeNASService.instance;
                this._instance._backendBridge = BackEndBridgeModule.defaultBackendBridge;
            }
            return this._instance;
        }
    }
});
