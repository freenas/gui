/**
 * @module ui/volume-dataset-snapshots.reel
 */
var Component = require("montage/ui/component").Component,
    DateConverter = require("montage/core/converter/date-converter").DateConverter;

/**
 * @class VolumeDatasetSnapshots
 * @extends Component
 */
exports.VolumeDatasetSnapshots = Component.specialize(/** @lends VolumeDatasetSnapshots# */ {

    _dateConverter: {
        value: null
    },

    _newSnapshot: {
        value: null
    },

    newSnapshot: {
        get: function() {
            return this._newSnapshot = (this._newSnapshot || {});
        },
        set: function(snapshot) {
            if (this._newSnapshot !== snapshot) {
                this._newSnapshot = snapshot;
            }
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            var self = this;

            if (isFirstTime) {
                this._dateConverter = new DateConverter();
                this._dateConverter.pattern = "MM/dd/yyyy hh:mm:ss tt";

                this.application.storageService.listVolumeSnapshots().then(function(snapshots) {
                    self._snapshots = snapshots;
                    self._snapshots.addRangeChangeListener(self, "snapshots");

                    return self._reset();
                });
            }
        }
    },

    exitDocument: {
        value: function() {
            this.super();
            this.newSnapshot = null;
        }
    },

    handleSnapshotsRangeChange: {
        value: function(plus, minus, index) {
            return this._reset();
        }
    },

    handleCreateAction: {
        value: function(event) {
            var self = this,
                name = this.newSnapshot.name,
                recursive = !!this.newSnapshot.recursive;

            this.newSnapshot = null;

            if (!(name || '').length) {
                return;
            }

            return this.application.storageService.getNewSnapshot().then(function(snapshot) {
                snapshot.name = name;
                snapshot.dataset = self.object.id;
                snapshot.replicable = true;
                snapshot.lifetime = 7 * 24 * 60 * 60; // 7 days by default
                return self.application.storageService.saveSnapshot(snapshot, recursive);
            });
        }
    },

    _reset: {
        value: function() {
            this.snapshots = [];

            for (var i = 0; i < this._snapshots.length; i++) {
                var snapshot = this._snapshots[i],
                    object = {};

                object.name = snapshot.name;
                object.dataset = snapshot.dataset;
                object.used = this.application.storageService.convertBytesToSizeString(snapshot.properties.used.rawvalue);
                if (snapshot.lifetime && snapshot.properties) {
                    object.expire = this._dateConverter.convert(new Date((+snapshot.properties.creation.rawvalue + snapshot.lifetime) * 1000));
                } else {
                    object.expire = 'Never';
                }

                this.snapshots.push(object);
            }

            return Promise.resolve(this.snapshots);
        }
    }

});
