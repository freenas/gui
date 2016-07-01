/**
 * @module ui/inspectors/calendar-task.reel/snapshot-args.reel
 */
var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;

/**
 * @class SnapshotArgs
 * @extends Component
 */
exports.SnapshotArgs = Component.specialize(/** @lends SnapshotArgs# */ {
    _expirationDate: {
        value: null
    },

    expirationDate: {
        get: function() {
            return this._expirationDate;
        },
        set: function(expirationDate) {
            if (this._expirationDate !== expirationDate) {
                this._expirationDate = expirationDate;
                if (expirationDate) {
                    this._args[2] = Math.round((expirationDate.getTime() - Date.now()) / 1000);
                } else {
                    this._args[2] = null;
                }
            }
        }
    },

    pathDisplayMode: {
        value: null
    },

    enterDocument: {
        value: function() {
            if (!this.args || this.args.length != 5) {
                this.args = [null, false, null, "auto", false];
            }
            if (this.datasetTreeController) {
                this.datasetTreeController.open();
            }
        }
    }

});
