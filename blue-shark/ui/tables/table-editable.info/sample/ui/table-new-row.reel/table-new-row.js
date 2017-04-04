/**
 * @module ui/table-new-row.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class TableNewRow
 * @extends Component
 */
exports.TableNewRow = Component.specialize({

    fakeConverter: {
        value: {
            convert: function(value) {
                    return value;
            },
            revert: function(value) {
                if (this.validator(value)) {
                    return value;
                }
            },
            validator: function (value) {
                if (+value === parseInt(value)) {
                    return true;
                }
                else {
                    throw new Error("Value must be an integer.");
                }
            }
        }
    }
});
