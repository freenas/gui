/**
 * @module ui/table-row-volume.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class TableRowVolume
 * @extends Component
 */
exports.TableRowVolume = Component.specialize({

    enterDocument: {
        value: function (firstTime) {
            if (firstTime) {
                this.addPathChangeListener("selectedType", this, "handleSelectedTypeChange")
            }
        }
    },

    handleSelectedTypeChange: {
        value: function (value) {
            if (this.object && value && !this.object.isLocked) {
                this.object.host_path = "";
            }
        }
    }

});
