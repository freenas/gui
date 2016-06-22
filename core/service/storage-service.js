var Montage = require("montage").Montage,
    FreeNASService = require("core/service/freenas-service").FreeNASService,
    Promise = require("montage/core/promise").Promise,
    Model = require("core/model/model").Model;

var StorageService = exports.StorageService = Montage.specialize({
    _instance: {
        value: null
    },

    _dataService: {
        value: null
    },

    _volumes: {
        value: null
    },

    _volumesPromise: {
        value: null
    },

    _disks: {
        value: null
    },

    _disksPromise: {
        value: null
    },

    constructor: {
        value: function() {
            this._dataService = FreeNASService.instance;
        }
    },

    listVolumes: {
        value: function() {
            if (this._volumes) {
                return Promise.resolve(this._volumes);
            } else if (this._volumesPromise) {
                return this._volumesPromise;
            } else {
                var self = this;
                return this._volumesPromise = this._dataService.fetchData(Model.Volume).then(function(volumes) {
                    return self._volumes = volumes;
                });
            }
        }
    },

    listDisks: {
        value: function() {
            if (this._disks) {
                return Promise.resolve(this._disks);
            } else if (this._disksPromise) {
                return this._disksPromise;
            } else {
                var self = this;
                return this._disksPromise = this._dataService.fetchData(Model.Disk).then(function(disks) {
                    return self._disks = disks;
                });
            }
        }
    }

}, {
    instance: {
        get: function() {
            if (!this._instance) {
                this._instance = new StorageService();
            }
            return this._instance;
        }
    }
});
