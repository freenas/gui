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
    },

    enterDocument: {
        value: function() {
            this._orderAllowedVdevTypes();
        }
    },

    _orderAllowedVdevTypes: {
        value: function () {
            var self = this,
                maxType = this.maxDefaultVdevType || this.maxVdevType;
            this.allowedDefaultVdevTypes = Object.keys(this.vdevTypes)
                .map(function (x) {
                    return self.vdevTypes[x];
                })
                .filter(function (x) {
                    return x.id <= maxType.id;
                })
                .sort(function (a, b) {
                    return a.id < b.id ? 1 : -1;
                });
        }

    }
});
