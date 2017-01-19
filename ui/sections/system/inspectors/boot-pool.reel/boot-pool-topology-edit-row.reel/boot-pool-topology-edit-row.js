/**
 * @module ui/boot-pool-topology-edit-row.reel
 */
var Component = require("montage/ui/component").Component,
    _ = require('lodash');

/**
 * @class BootPoolTopologyEditRow
 * @extends Component
 */
exports.BootPoolTopologyEditRow = Component.specialize({

    _selectedPath: {
        value: null
    },

    selectedPath: {
        get: function() {
            return this._selectedPath;
        },
        set: function(selectedPath) {
            if (this._selectedPath !== selectedPath) {
                this._selectedPath = selectedPath;
                if (selectedPath) {
                    this.object = _.find(this._availableDisks, {path: selectedPath});
                }
            }
        }
    },

    _availableDisks: {
        value: null
    },

    availableDisks: {
        get: function() {
            return this._availableDisks;
        },
        set: function(availableDisks) {
            if (this._availableDisks !== availableDisks) {
                this._availableDisks = availableDisks;
                if (availableDisks) {
                    this._diskOptions = _.map(this._availableDisks, function(disk) {
                        return {
                            label: disk.name,
                            value: disk.path
                        }
                    });
                }
            }
        }
    }
    
});
