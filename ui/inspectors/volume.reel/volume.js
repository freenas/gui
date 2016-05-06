var Component = require("montage/ui/component").Component;

/**
 * @class Volume
 * @extends Component
 */
exports.Volume = Component.specialize({
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
        value: function() {
            //Fixme: hacky, should use some selection object
            this.application.selectedVolume = this.object;
        }
    },

    exitDocument: {
        value: function() {
            delete this.application.selectedVolume;
        }
    }
});
