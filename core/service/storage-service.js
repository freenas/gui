var Montage = require("montage").Montage,
    FreeNASService = require("core/service/freenas-service").FreeNASService,
    Promise = require("montage/core/promise").Promise,
    Model = require("core/model/model").Model;

var StorageService = exports.StorageService = Montage.specialize({

    _SCALED_NUMERIC_RE_: {
        value: /^(\d+\.?\d{0,3})([k,K,M,G,T,P,E,Z]?)?[iI]?[bB]?$/
    },

    _SIZE_PREFIX_EXPONENTS: {
        value: {
            k: 1,
            K: 1,
            M: 2,
            G: 3,
            T: 4,
            P: 5,
            E: 6,
            Z: 7
        }
    },

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
    },

    /* First shalt thou identify the Holy Prefix, then shalt thou multiply by a
       power of 1024, no more, no less. 1024 shall be the number thou shalt
       exponentiate, and the number of the exponentiation shall be 1024. 1000
       shalt thou not exponentiate, neither multiply thou 2, excepting that thou
       then proceed to 1024. 1012 is right out. Once the number 1024, being the
       correct base, be exponentiated, then multipliest thou the Holy Result of
       FreeNAS by thy desired value, which being parsed from user input, shall
       first be confirmed to be a number.
    */
    _convertVolumeDatasetSizeProperty: {
        value: function (size) {
            if (typeof size === "string") {
                var input = size.match(this._SCALED_NUMERIC_RE_),
                    prefix = input[2],
                    value = input[1];
                return parseInt(prefix ? value * Math.pow(1024, this._SIZE_PREFIX_EXPONENTS[prefix]) : parseInt(value));
            }
            return null;
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
