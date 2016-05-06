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
        get: function() {
            return this._totalSize;
        },
        set: function(totalSize) {
            if (this._totalSize != totalSize) {
                this._totalSize = totalSize;
            }

            if (this.isTemplateLoaded) {
                this.setElementWidths();
            }

        }
    },

    setElementWidths: {
        value: function () {
            var parityWidth = Math.floor(100 * this.paritySize / this.totalSize),
                usedWidth = Math.floor(100 * this.usedSize / this.totalSize);
            this.parityBarElement.style.width = parityWidth + '%';
            this.usedBarElement.style.width = usedWidth + '%';
            this.availableBarElement.style.width = (100 - (parityWidth+usedWidth)) + '%';
        }
    },

    templateDidLoad: {
        value: function () {
            this.isTemplateLoaded = true;
            if (this.totalSize) {
                this.setElementWidths();
            }
        }
    }
});
