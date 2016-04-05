/**
 * @module ui/topology-item.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class TopologyItem
 * @extends Component
 */
exports.TopologyItem = Component.specialize(/** @lends TopologyItem# */ {
    _totalSize: {
        value: null
    },

    totalSize: {
        get: function() {
            return this._totalSize;
        },
        set: function(totalSize) {
            if (this._totalSize != totalSize) {
                this._totalSize = totalSize;
            }

            var parityWidth = Math.floor(100 * this.paritySize / totalSize),
                usedWidth = Math.floor(100 * this.usedSize / totalSize);

            this.parityBarElement.style.width = parityWidth + '%';
            this.usedBarElement.style.width = usedWidth + '%';
            this.availableBarElement.style.width = (100 - (parityWidth+usedWidth)) + '%';
        }
    },

    editable: {
        value: false
    }
});
