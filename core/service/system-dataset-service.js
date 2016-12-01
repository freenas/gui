var Montage = require("montage").Montage,
    SystemRepository = require("core/repository/system-repository").SystemRepository,
    BootPoolRepository = require("core/repository/boot-pool-repository").BootPoolRepository;

var SystemDatasetService = exports.SystemDatasetService = Montage.specialize({

    _instance: {
        value: null
    },

    _dataService: {
        value: null
    },

    _systemDatasetService: {
        value: null
    },

    _backendBridge: {
        value: null
    },

    getBootpoolConfig: {
        value: function() {
            return this._bootPoolRepository.getBootPoolConfig();
        }
    },

    getSystemDatasetPool: {
        value: function() {
            return this._systemRepository.getDataset();
        }
    }

}, {
    instance: {
        get: function() {
            if(!this._instance) {
                this._instance = new SystemDatasetService();
                this._instance._systemDatasetService = SystemDatasetService.instance;
                this._instance._systemRepository = SystemRepository.getInstance()
                this._instance._bootPoolRepository = BootPoolRepository.getInstance()
            }
            return this._instance;
        }
    }
});
