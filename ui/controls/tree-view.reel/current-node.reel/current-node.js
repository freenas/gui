/**
 * @module ui/current-node.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class CurrentNode
 * @extends Component
 */
exports.CurrentNode = Component.specialize(/** @lends CurrentNode# */ {
    _selectedChild: {
        value: null
    },

    selectedChild: {
        get: function() {
            return this._selectedChild;
        },
        set: function(selectedChild) {
            if (selectedChild) {
                this._selectedChild = selectedChild
            }
        }
    },

    prepareForActivationEvents: {
        value: function() {
            this.addRangeAtPathChangeListener('selectedChild', this, 'handleSelectionChange');
        }
    },

    handleSelectionChange: {
        value: function(plus, minus, index) {
            if (plus.length > 0) {
                this.parent = plus[0];
            }
        }
    }
});
