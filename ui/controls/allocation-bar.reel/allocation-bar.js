/**
 * @module ui/allocation-bar.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class AllocationBar
 * @extends Component
 */
exports.AllocationBar = Component.specialize(/** @lends AllocationBar# */ {

    _totalSize: {
        value: null
    },

    totalSize: {
        get: function () {
            return this._totalSize;
        },
        set: function (totalSize) {
            if (this._totalSize !== totalSize) {
                this._totalSize = totalSize;

                if (this._inDocument) {
                    this.needsDraw = true;
                }
            }
        }
    },

    _paritySize: {
        value: null
    },

    paritySize: {
        get: function () {
            return this._paritySize;
        },
        set: function (paritySize) {
            if (this._paritySize !== paritySize) {
                this._paritySize = paritySize;

                if (this._inDocument) {
                    this.needsDraw = true;
                }
            }
        }
    },

    draw: {
        value: function () {
            var parityWidth = Math.floor(100 * this.paritySize / this.totalSize),
                usedWidth = Math.floor(100 * this.usedSize / this.totalSize);

            this.parityBarElement.style.width = parityWidth + '%';
            this.usedBarElement.style.width = usedWidth + '%';
            this.availableBarElement.style.width = (100 - (parityWidth+usedWidth)) + '%';
        }
    }

});
