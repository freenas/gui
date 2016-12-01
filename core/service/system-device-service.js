var Montage = require("montage").Montage,
    SystemRepository = require("core/repository/system-repository").SystemRepository;

var SystemDeviceService = exports.SystemDeviceService = Montage.specialize({
    _NAMESPACE: {
        value: 'system.device.'
    },

    _instance: {
        value: null
    },

    _backendBridge: {
        value: null
    },

    getDisks: {
        value: function() {
            return this._systemRepository.getDevices('disk');
        }
    },

    getSerialPorts: {
        value: function() {
            return this._systemRepository.getDevices('serial_port');
        }
    }

}, {
    instance: {
        get: function() {
            if (!this._instance) {
                this._instance = new SystemDeviceService();
                this._instance._systemRepository = SystemRepository.getInstance();
            }
            return this._instance;
        }
    }
});
