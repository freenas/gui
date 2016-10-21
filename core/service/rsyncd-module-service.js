var Montage = require("montage").Montage,
    FreeNASService = require("core/service/freenas-service").FreeNASService,
    Promise = require("montage/core/promise").Promise,
    Model = require("core/model/model").Model;

var RsyncdModuleService = exports.RsyncdModuleService = Montage.specialize({
    _instance: {
        value: null
    },

    _dataService: {
        value: null
    },

    _methods: {
        value: null
    },

    _remoteService: {
        value: null
    },

    _rsycndModules: {
        value: null
    },

    constructor: {
        value: function() {
            var self = this;
            this._dataService = FreeNASService.instance;
            Model.populateObjectPrototypeForType(Model.RsyncdModule).then(function() {
                self._methods = Model.RsyncdModule.objectPrototype.services;
            });
        }
    },

    list: {
        value: function() {
            var self = this;
            return this._dataService.fetchData(Model.RsyncdModule).then(function(rsyncdModules) {
                return self._rsycndModules = rsyncdModules;
            });
        }
    },

    delete: {
        value: function(rsyncdModule) {
            return this._dataService.deleteDataObject(rsyncdModule);
        }
    }

}, {
    instance: {
        get: function() {
            if (!this._instance) {
                this._instance = new RsyncdModuleService();
                this._instance._dataService = FreeNASService.instance
            }
            return this._instance;
        }
    }
});
