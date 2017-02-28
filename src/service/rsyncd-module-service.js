var Montage = require("montage").Montage,
    RsyncdModuleRepository = require('core/repository/RsyncdModuleRepository').RsyncdModuleRepository;

var RsyncdModuleService = exports.RsyncdModuleService = Montage.specialize({
    _instance: {
        value: null
    },

    _rsycndModules: {
        value: null
    },

    constructor: {
        value: function() {
            this.rsyncdModuleRepository = RsyncdModuleRepository.getInstance();
        }
    },

    list: {
        value: function() {
            var self = this;
            return this.rsyncdModuleRepository.list().then(function(rsyncdModules) {
                return self._rsycndModules = rsyncdModules;
            });
        }
    },

    delete: {
        value: function(rsyncdModule) {
            return this.rsyncdModuleRepository.delete(rsyncdModule);
        }
    }

}, {
    instance: {
        get: function() {
            if (!this._instance) {
                this._instance = new RsyncdModuleService();
            }
            return this._instance;
        }
    }
});
