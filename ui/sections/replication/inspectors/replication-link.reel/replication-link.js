/**
 * @module ui/sections/replication/inspectors/replication-link.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class ReplicationLink
 * @extends Component
 */
exports.ReplicationLink = Component.specialize(/** @lends ReplicationLink# */ {
    _slave: {
        value: null
    },

    slave: {
        get: function() {
            if (!this._slave && this.object.partners) {
                var self = this;
                this._slave = this.object.partners.filter(function(x) {
                    return x != self.object.master;
                })[0];
            }
            return this._slave;
        },
        set: function(slave) {
            if (this._slave !== slave) {
                this._slave = slave;
                this.object.partners = [
                    this.object.master,
                    slave
                ];
            }
        }
    },

    templateDidLoad: {
        value: function() {
            var self = this;
            this.addPathChangeListener("object.partners", this, "_handleAddressChange");
            this.addPathChangeListener("object.master", this, "_handleAddressChange");
            this.application.storageService.listDatasets().then(function(datasets) {
                self.datasets = datasets;
            });
        }
    },

    enterDocument: {
        value: function() {
            if (this.object && this.object._isNew) {
                this.object.replicate_services = false;
                this.object.bidirectional = false;
                this.object.auto_recover = false;
                this.object.partners = this.object.partners || [];
                this.object.datasets = this.object.datasets || [];
            }
        }
    },

    exitDocument: {
        value: function() {
            this._slave = null;
        }
    },

    _handleAddressChange: {
        value: function() {
            this.dispatchOwnPropertyChange("slave", this.slave);
        }
    }
});
