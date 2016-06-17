/**
 * @module ui/volume-dataset.reel
 */
var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;

/**
 * @class VolumeDataset
 * @extends Component
 */
exports.VolumeDataset = Component.specialize(/** @lends VolumeDataset# */ {

    context: {
        get: function() {
            return this._context;
        },
        set: function(context) {
            if (this._context != context) {
                this._context = context;
            }
            this._loadVolume();
        }
    },

    volume: {
        value: null
    },

    datasetType: {
        value: null
    },

    enterDocument: {
        value: function() {
            this._loadVolume();
            if ( this.object.rname && ( this.object.name === this.object.volume )) {
                this.datasetType = "root";
            } else {
                this.datasetType = "child";
            }
            this._initializeProperties();
            this.object._isNew = !this.object.rname;
        }
    },

    _loadVolume: {
        value: function() {
            this.volume = this._getCurrentVolume();
            if (this.object && this.volume) {
                this.object.volume = this.volume.id;
            }
        }
    },

    _getCurrentVolume: {
        value: function() {
            if (this._context) {
                var currentSelection = this.application.selectionService.getCurrentSelection();
                for (var i = this._context.columnIndex - 1; i >= 0; i--) {
                    if (Object.getPrototypeOf(currentSelection.path[i]).Type == Model.Volume) {
                        return currentSelection.path[i];
                    }
                }
            }
        }
    },

    _initializeProperties: {
        value: function() {
            var self = this,
                dataService = this.application.dataService;
            if (!this.object.properties) {
                dataService.getNewInstanceForType(Model.VolumeDatasetProperties).then(function(newProperties) {
                    self.object.properties = newProperties;

                    dataService.getNewInstanceForType(Model.VolumeDatasetPropertyAtime).then(function(newAtime) {
                        self.object.properties.atime = newAtime;
                        return dataService.getNewInstanceForType(Model.VolumeDatasetPropertyCasesensitivity);
                    }).then(function(newCasesensitivity) {
                        self.object.properties.casesensitivity = newCasesensitivity;
                        return dataService.getNewInstanceForType(Model.VolumeDatasetPropertyCompression);
                    }).then(function(newCompression) {
                        self.object.properties.compression = newCompression;
                        return dataService.getNewInstanceForType(Model.VolumeDatasetPropertyDedup);
                    }).then(function(newDedup) {
                        self.object.properties.dedup = newDedup;
                        return dataService.getNewInstanceForType(Model.VolumeDatasetPropertyQuota);
                    }).then(function(newQuota) {
                        self.object.properties.quota = newQuota;
                        return dataService.getNewInstanceForType(Model.VolumeDatasetPropertyRefquota);
                    }).then(function(newRefquota) {
                        self.object.properties.refquota = newRefquota;
                        return dataService.getNewInstanceForType(Model.VolumeDatasetPropertyVolblocksize);
                    }).then(function(newVolblocksize) {
                        self.object.properties.volblocksize = newVolblocksize;
                        return dataService.getNewInstanceForType(Model.VolumeDatasetPropertyRefReservation);
                    }).then(function(newRefreservation) {
                        self.object.properties.refreservation = newRefreservation;
                        return dataService.getNewInstanceForType(Model.VolumeDatasetPropertyReservation);
                    }).then(function(newReservation) {
                        self.object.properties.reservation = newReservation;
                    });
                });
            }
        }
    },

    save: {
        value: function() {
            this.object._isNew = !this.object.rname;
            this.application.dataService.saveDataObject(this.object);
        }
    },

    delete: {
        value: function() {
            this.object.id = this.object.name;
            this.application.dataService.deleteDataObject(this.object);
        }
    }
});
