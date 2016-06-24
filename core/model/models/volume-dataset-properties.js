var Montage = require("montage/core/core").Montage;
var VolumeDatasetPropertyAtime = require("core/model/models/volume-dataset-property-atime").VolumeDatasetPropertyAtime;
var VolumeDatasetPropertyAvailable = require("core/model/models/volume-dataset-property-available").VolumeDatasetPropertyAvailable;
var VolumeDatasetPropertyCasesensitivity = require("core/model/models/volume-dataset-property-casesensitivity").VolumeDatasetPropertyCasesensitivity;
var VolumeDatasetPropertyCompression = require("core/model/models/volume-dataset-property-compression").VolumeDatasetPropertyCompression;
var VolumeDatasetPropertyCompressratio = require("core/model/models/volume-dataset-property-compressratio").VolumeDatasetPropertyCompressratio;
var VolumeDatasetPropertyDedup = require("core/model/models/volume-dataset-property-dedup").VolumeDatasetPropertyDedup;
var VolumeDatasetPropertyLogicalreferenced = require("core/model/models/volume-dataset-property-logicalreferenced").VolumeDatasetPropertyLogicalreferenced;
var VolumeDatasetPropertyLogicalused = require("core/model/models/volume-dataset-property-logicalused").VolumeDatasetPropertyLogicalused;
var VolumeDatasetPropertyNumclones = require("core/model/models/volume-dataset-property-numclones").VolumeDatasetPropertyNumclones;
var VolumeDatasetPropertyQuota = require("core/model/models/volume-dataset-property-quota").VolumeDatasetPropertyQuota;
var VolumeDatasetPropertyRefcompressratio = require("core/model/models/volume-dataset-property-refcompressratio").VolumeDatasetPropertyRefcompressratio;
var VolumeDatasetPropertyReferenced = require("core/model/models/volume-dataset-property-referenced").VolumeDatasetPropertyReferenced;
var VolumeDatasetPropertyRefquota = require("core/model/models/volume-dataset-property-refquota").VolumeDatasetPropertyRefquota;
var VolumeDatasetPropertyRefreservation = require("core/model/models/volume-dataset-property-refreservation").VolumeDatasetPropertyRefreservation;
var VolumeDatasetPropertyReservation = require("core/model/models/volume-dataset-property-reservation").VolumeDatasetPropertyReservation;
var VolumeDatasetPropertyUsed = require("core/model/models/volume-dataset-property-used").VolumeDatasetPropertyUsed;
var VolumeDatasetPropertyUsedbychildren = require("core/model/models/volume-dataset-property-usedbychildren").VolumeDatasetPropertyUsedbychildren;
var VolumeDatasetPropertyUsedbydataset = require("core/model/models/volume-dataset-property-usedbydataset").VolumeDatasetPropertyUsedbydataset;
var VolumeDatasetPropertyUsedbyrefreservation = require("core/model/models/volume-dataset-property-usedbyrefreservation").VolumeDatasetPropertyUsedbyrefreservation;
var VolumeDatasetPropertyUsedbysnapshots = require("core/model/models/volume-dataset-property-usedbysnapshots").VolumeDatasetPropertyUsedbysnapshots;
var VolumeDatasetPropertyVolblocksize = require("core/model/models/volume-dataset-property-volblocksize").VolumeDatasetPropertyVolblocksize;
var VolumeDatasetPropertyVolsize = require("core/model/models/volume-dataset-property-volsize").VolumeDatasetPropertyVolsize;
var VolumeDatasetPropertyWritten = require("core/model/models/volume-dataset-property-written").VolumeDatasetPropertyWritten;

exports.VolumeDatasetProperties = Montage.specialize({
    _atime: {
        value: null
    },
    atime: {
        set: function (value) {
            if (this._atime !== value) {
                this._atime = value;
            }
        },
        get: function () {
            return this._atime || (this._atime = new VolumeDatasetPropertyAtime());
        }
    },
    _available: {
        value: null
    },
    available: {
        set: function (value) {
            if (this._available !== value) {
                this._available = value;
            }
        },
        get: function () {
            return this._available || (this._available = new VolumeDatasetPropertyAvailable());
        }
    },
    _casesensitivity: {
        value: null
    },
    casesensitivity: {
        set: function (value) {
            if (this._casesensitivity !== value) {
                this._casesensitivity = value;
            }
        },
        get: function () {
            return this._casesensitivity || (this._casesensitivity = new VolumeDatasetPropertyCasesensitivity());
        }
    },
    _compression: {
        value: null
    },
    compression: {
        set: function (value) {
            if (this._compression !== value) {
                this._compression = value;
            }
        },
        get: function () {
            return this._compression || (this._compression = new VolumeDatasetPropertyCompression());
        }
    },
    _compressratio: {
        value: null
    },
    compressratio: {
        set: function (value) {
            if (this._compressratio !== value) {
                this._compressratio = value;
            }
        },
        get: function () {
            return this._compressratio || (this._compressratio = new VolumeDatasetPropertyCompressratio());
        }
    },
    _dedup: {
        value: null
    },
    dedup: {
        set: function (value) {
            if (this._dedup !== value) {
                this._dedup = value;
            }
        },
        get: function () {
            return this._dedup || (this._dedup = new VolumeDatasetPropertyDedup());
        }
    },
    _logicalreferenced: {
        value: null
    },
    logicalreferenced: {
        set: function (value) {
            if (this._logicalreferenced !== value) {
                this._logicalreferenced = value;
            }
        },
        get: function () {
            return this._logicalreferenced || (this._logicalreferenced = new VolumeDatasetPropertyLogicalreferenced());
        }
    },
    _logicalused: {
        value: null
    },
    logicalused: {
        set: function (value) {
            if (this._logicalused !== value) {
                this._logicalused = value;
            }
        },
        get: function () {
            return this._logicalused || (this._logicalused = new VolumeDatasetPropertyLogicalused());
        }
    },
    _numclones: {
        value: null
    },
    numclones: {
        set: function (value) {
            if (this._numclones !== value) {
                this._numclones = value;
            }
        },
        get: function () {
            return this._numclones || (this._numclones = new VolumeDatasetPropertyNumclones());
        }
    },
    _quota: {
        value: null
    },
    quota: {
        set: function (value) {
            if (this._quota !== value) {
                this._quota = value;
            }
        },
        get: function () {
            return this._quota || (this._quota = new VolumeDatasetPropertyQuota());
        }
    },
    _refcompressratio: {
        value: null
    },
    refcompressratio: {
        set: function (value) {
            if (this._refcompressratio !== value) {
                this._refcompressratio = value;
            }
        },
        get: function () {
            return this._refcompressratio || (this._refcompressratio = new VolumeDatasetPropertyRefcompressratio());
        }
    },
    _referenced: {
        value: null
    },
    referenced: {
        set: function (value) {
            if (this._referenced !== value) {
                this._referenced = value;
            }
        },
        get: function () {
            return this._referenced || (this._referenced = new VolumeDatasetPropertyReferenced());
        }
    },
    _refquota: {
        value: null
    },
    refquota: {
        set: function (value) {
            if (this._refquota !== value) {
                this._refquota = value;
            }
        },
        get: function () {
            return this._refquota || (this._refquota = new VolumeDatasetPropertyRefquota());
        }
    },
    _refreservation: {
        value: null
    },
    refreservation: {
        set: function (value) {
            if (this._refreservation !== value) {
                this._refreservation = value;
            }
        },
        get: function () {
            return this._refreservation || (this._refreservation = new VolumeDatasetPropertyRefreservation());
        }
    },
    _reservation: {
        value: null
    },
    reservation: {
        set: function (value) {
            if (this._reservation !== value) {
                this._reservation = value;
            }
        },
        get: function () {
            return this._reservation || (this._reservation = new VolumeDatasetPropertyReservation());
        }
    },
    _used: {
        value: null
    },
    used: {
        set: function (value) {
            if (this._used !== value) {
                this._used = value;
            }
        },
        get: function () {
            return this._used || (this._used = new VolumeDatasetPropertyUsed());
        }
    },
    _usedbychildren: {
        value: null
    },
    usedbychildren: {
        set: function (value) {
            if (this._usedbychildren !== value) {
                this._usedbychildren = value;
            }
        },
        get: function () {
            return this._usedbychildren || (this._usedbychildren = new VolumeDatasetPropertyUsedbychildren());
        }
    },
    _usedbydataset: {
        value: null
    },
    usedbydataset: {
        set: function (value) {
            if (this._usedbydataset !== value) {
                this._usedbydataset = value;
            }
        },
        get: function () {
            return this._usedbydataset || (this._usedbydataset = new VolumeDatasetPropertyUsedbydataset());
        }
    },
    _usedbyrefreservation: {
        value: null
    },
    usedbyrefreservation: {
        set: function (value) {
            if (this._usedbyrefreservation !== value) {
                this._usedbyrefreservation = value;
            }
        },
        get: function () {
            return this._usedbyrefreservation || (this._usedbyrefreservation = new VolumeDatasetPropertyUsedbyrefreservation());
        }
    },
    _usedbysnapshots: {
        value: null
    },
    usedbysnapshots: {
        set: function (value) {
            if (this._usedbysnapshots !== value) {
                this._usedbysnapshots = value;
            }
        },
        get: function () {
            return this._usedbysnapshots || (this._usedbysnapshots = new VolumeDatasetPropertyUsedbysnapshots());
        }
    },
    _volblocksize: {
        value: null
    },
    volblocksize: {
        set: function (value) {
            if (this._volblocksize !== value) {
                this._volblocksize = value;
            }
        },
        get: function () {
            return this._volblocksize || (this._volblocksize = new VolumeDatasetPropertyVolblocksize());
        }
    },
    _volsize: {
        value: null
    },
    volsize: {
        set: function (value) {
            if (this._volsize !== value) {
                this._volsize = value;
            }
        },
        get: function () {
            return this._volsize || (this._volsize = new VolumeDatasetPropertyVolsize());
        }
    },
    _written: {
        value: null
    },
    written: {
        set: function (value) {
            if (this._written !== value) {
                this._written = value;
            }
        },
        get: function () {
            return this._written || (this._written = new VolumeDatasetPropertyWritten());
        }
    }
});
