var Component = require("montage/ui/component").Component;

/**
 * @class Volume
 * @extends Component
 */
exports.Volume = Component.specialize({
    _object: {
        value: null
    },

    object: {
        get: function() {
            return this._object;
        },
        set: function(object) {
            if (this._object != object) {
                this._object = object;
            }
            this._calculateParity();
        }
    },
    
    _shares: {
        value: null
    },

    shares: {
        get: function() {
            return this._shares;
        },
        set: function(shares) {
            if (this._shares != shares) {
                this._shares = shares;
                this._shares._meta_data = this.allShares._meta_data;
            }
        }
    },

    _snapshots: {
        value: null
    },

    snapshots: {
        get: function() {
            return this._snapshots;
        },
        set: function(snapshots) {
            if (this._snapshots != snapshots) {
                this._snapshots = snapshots;
                this._snapshots._meta_data = this.allSnapshots._meta_data;
            }
        }
    },

    enterDocument: {
        value: function(isFirsttime) {
            //Fixme: hacky, should use some selection object
            this.application.selectedVolume = this.object;
        }
    },

    exitDocument: {
        value: function() {
            delete this.application.selectedVolume;
        }
    },

    _calculateParity: {
        value: function() {
            if (this._object) {
                var vdevs = this._object.topology.data,
                    vdev, i, length,
                    paritySize = 0;
                for (i = 0, length = vdevs.length; i < length; i++) {
                    vdev = vdevs[i];
                    if (vdev.children) {
                        paritySize += this.application.topologyService.getParitySizeOnAllocated(vdev.children.length, vdev.type, vdev.stats.allocated);
                    }
                }
                this.paritySize = paritySize;
            }
        }
    }
});
