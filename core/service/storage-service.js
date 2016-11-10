var Montage = require("montage").Montage,
    FreeNASService = require("core/service/freenas-service").FreeNASService,
    Promise = require("montage/core/promise").Promise,
    Model = require("core/model/model").Model;

var StorageService = exports.StorageService = Montage.specialize({

    SCALED_NUMERIC_RE_: {
        value: /^(\d+\.?\d{0,3})([KMGTPEZ]?)?[I]?[B]?$/i
    },

    SIZE_PREFIX_EXPONENTS: {
        value: {
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

    _datasets: {
        value: null
    },

    _datasetsPromise: {
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

    listVolumeSnapshots: {
        value: function() {
            return this._dataService.fetchData(Model.VolumeSnapshot).then(function (snapshots) {
                return snapshots;
            });
        }
    },

    getShareData: {
        value: function() {
            return this._dataService.fetchData(Model.Share).then(function (shares) {
                return shares;
            });
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

    listDatasets: {
        value: function() {
            if (this._datasets) {
                return Promise.resolve(this._datasets);
            } else if (this._datasetsPromise) {
                return this._datasetsPromise;
            } else {
                var self = this;
                return this._datasetsPromise = this._dataService.fetchData(Model.VolumeDataset).then(function(datasets) {
                    return self._datasets = datasets;
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

    initializeDatasetProperties: {
        value: function(dataset) {
            var self = this;
            if (!dataset.properties) {
                this._dataService.getNewInstanceForType(Model.VolumeDatasetProperties).then(function(newProperties) {
                    dataset.properties = newProperties;

                    self._dataService.getNewInstanceForType(Model.VolumeDatasetPropertyAtime).then(function(newAtime) {
                        newAtime.source = "INHERITED";
                        dataset.properties.atime = newAtime;
                        return self._dataService.getNewInstanceForType(Model.VolumeDatasetPropertyCasesensitivity);
                    }).then(function(newCasesensitivity) {
                        newCasesensitivity.source = "INHERITED";
                        dataset.properties.casesensitivity = newCasesensitivity;
                        return self._dataService.getNewInstanceForType(Model.VolumeDatasetPropertyCompression);
                    }).then(function(newCompression) {
                        newCompression.source = "INHERITED";
                        dataset.properties.compression = newCompression;
                        return self._dataService.getNewInstanceForType(Model.VolumeDatasetPropertyDedup);
                    }).then(function(newDedup) {
                        newDedup.source = "INHERITED";
                        dataset.properties.dedup = newDedup;
                        return self._dataService.getNewInstanceForType(Model.VolumeDatasetPropertyQuota);
                    }).then(function(newQuota) {
                        dataset.properties.quota = newQuota;
                        return self._dataService.getNewInstanceForType(Model.VolumeDatasetPropertyRefquota);
                    }).then(function(newRefquota) {
                        dataset.properties.refquota = newRefquota;
                        return self._dataService.getNewInstanceForType(Model.VolumeDatasetPropertyVolblocksize);
                    }).then(function(newVolblocksize) {
                        newVolblocksize.parsed = 512;
                        dataset.properties.volblocksize = newVolblocksize;
                        return self._dataService.getNewInstanceForType(Model.VolumeDatasetPropertyRefreservation);
                    }).then(function(newRefreservation) {
                        dataset.properties.refreservation = newRefreservation;
                        return self._dataService.getNewInstanceForType(Model.VolumeDatasetPropertyReservation);
                    }).then(function(newReservation) {
                        dataset.properties.reservation = newReservation;
                    });
                });
            }
        }
    },

    convertVolumeDatasetSizeProperties: {
        value: function(dataset) {
            if (dataset.type === "FILESYSTEM") {
                dataset.properties.quota.parsed = this.convertSizeStringToBytes(dataset.properties.quota.value);
                dataset.properties.refquota.parsed = this.convertSizeStringToBytes(dataset.properties.refquota.value);
                dataset.properties.reservation.parsed = this.convertSizeStringToBytes(dataset.properties.reservation.value);
                dataset.properties.refreservation.parsed = this.convertSizeStringToBytes(dataset.properties.refreservation.value);
            } else {
                dataset.volsize = this.convertSizeStringToBytes(dataset.volsize);
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
    convertSizeStringToBytes: {
        value: function (size) {
            var input, prefix, value;
            if (typeof size === "string") {
                input = size.match(this.SCALED_NUMERIC_RE_);
                if (input) {
                    prefix = input[2];
                    value = input[1];
                    return parseInt(prefix ? value * Math.pow(1024, this.SIZE_PREFIX_EXPONENTS[prefix.toUpperCase()]) : parseInt(value));
                }
            }
            return null;
        }
    },

    convertBytesToSizeString: {
        value: function(bytes) {
            var result = bytes,
                sizePrefixes = Object.keys(this.SIZE_PREFIX_EXPONENTS),
                prefixIndex = 0;

            if (typeof bytes === "number") {
                while (result % 1024 === 0) {
                    prefixIndex++;
                    result = result / 1024;
                }

                for (var i=1, length = sizePrefixes.length; i<=length; i++) {
                    if (this.SIZE_PREFIX_EXPONENTS[sizePrefixes[i]] === prefixIndex) {
                        result += sizePrefixes[i] + "iB";
                        break;
                    }
                }
                result += "";
            }
            return result;
        }
    },

    isRootDataset: {
        value: function (dataset) {
            return dataset.name === dataset.volume;
        }
    },

    ensureDefaultPermissionsAreSet: {
        value: function(share) {
            if (!share.permissions || !share.permissions.user || !share.permissions.group) {
                var permissionsPromise = share.permissions ?
                    Promise.resolve(share.permissions) : this._dataService.getNewInstanceForType(Model.Permissions);

                return permissionsPromise.then(function (permissions) {
                    if (!permissions.user) {
                        permissions.user = 'root';
                    }
                    if (!permissions.group) {
                        permissions.group = 'wheel';
                    }

                    share.permissions = permissions;
                    return share;
                });
            }
            return Promise.resolve(share);
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
