/**
 * @module ui/multiple-select-grid.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class MultipleSelectGrid
 * @extends Component
 */
exports.MultipleSelectGrid = Component.specialize(/** @lends MultipleSelectGrid# */ {

    _sorter: {
        value: null
    },

    _sortedSelection: {
        get: function() {
            if (!this._sorter && this.controller && this.controller.selection && this.controller.selection.length > 0) {
                this._sorter = typeof this.controller.selection[0].index !== 'undefined' ?
                    this.constructor._indexSorter : this.constructor._valueSorter;
            }

            var collection = this.controller && this.controller.selection ?
                this.controller.selection.slice().map(function(x) { return x.value; }) : [];

            return this._sorter ? collection.sort(this._sorter) : collection;
        }
    },

    _selectedValues: {
        value: null
    },

    selectedValues: {
        get: function() {
            return this._sortedSelection;
        }, set: function(selectedValues) {
            this._selectedValues = selectedValues;
            if (selectedValues) {
                if (this.options && this.controller) {
                    this.controller.selection = this.options.filter(function(x) {
                        return selectedValues.indexOf(x.value) != -1;
                    });
                } else {
                    this._needsToSetData = true;
                }
            }
        }
    },

    enterDocument: {
        value: function() {
            if (this._needsToSetData) {
                this.selectedValues = this._selectedValues;
                this._needsToSetData = false;
            }
            this.addPathChangeListener("frequency", this, "_handleFrequencyChange");
            this._cancelSelectionListener = this.addRangeAtPathChangeListener("controller.selection", this, "_handleSelectionChange");
        }
    },

    exitDocument: {
        value: function() {
            if (this.getPathChangeDescriptor("frequency", this)) {
                this.removePathChangeListener("frequency", this);
            }
            if (typeof this._cancelSelectionListener === 'function') {
                this._cancelSelectionListener();
                this._cancelSelectionListener = null;
            }
        }
    },

    handleClearSelectionButtonAction: {
        value: function () {
            this.controller.clearSelection();
            this.frequency = null;
        }
    },

    _handleSelectionChange: {
        value: function() {
            if (this.hasIterator) {
                this.frequency = this._getSelectionFrequency();
            }
            this.dispatchOwnPropertyChange("selectedValues", this._sortedSelection);
        }
    },

    _handleFrequencyChange: {
        value: function() {
            if (this.frequency > 0) {
                if (this._getSelectionFrequency() !== this.frequency) {
                    var options = this.controller.organizedContent,
                        selection = [];
                    for (var i = 0, length = options.length; i < length; i = i + this.frequency) {
                        selection.push(options[i]);
                    }
                    this.controller.selection = selection;
                }
            } else if (typeof this.frequency === 'number') {
                this.frequency = null;
            }
        }
    },

    _getSelectionFrequency: {
        value: function() {
            if (this._selectedIndexes.length > 0 && this._selectedIndexes[0] === 0) {
                if (this._selectedIndexes.length === 1) {
                    return this.options.length;
                } else if (this._selectedIndexes.length > 1) {
                    var i, length,
                        referenceInterval = this._selectedIndexes[1] - this._selectedIndexes[0];
                    for (i = 0, length = this._selectedIndexes.length-1; i < length; i++) {
                        if (this._selectedIndexes[i+1] - this._selectedIndexes[i] !== referenceInterval) {
                            return 0;
                        }
                    }
                    var intervalToEnd = this.options.length - this._selectedIndexes[length];
                    if (intervalToEnd > 1 && intervalToEnd !== referenceInterval) {
                        return 0;
                    }
                    return referenceInterval;
                }
            }
            return 0;
        }
    }


}, {
    _indexSorter: {
        value: function(a, b) {
            return a.index - b.index;
        }
    },
    _valueSorter: {
        value: function(a, b) {
            return a.value < b.value ? -1 :  a.value > b.value ? 1 : 0;
        }
    }
});
