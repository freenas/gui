/**
 * @module ui/boot-pool-action.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class BootPoolAction
 * @extends Component
 */
exports.BootPoolAction = Component.specialize({

    enterDocument: {
        value: function (isFirstTime) {
            if(isFirstTime) {
                this.addRangeAtPathChangeListener('selectedRows', this, 'handleSelectedRowsChange');
            }
        }
    },

    handleSelectedRowsChange: {
        value: function (plus,minus,x) {
            if (this.selectedRows.length) {
                var length = this.selectedRows.length;
                if (!this._checkOnRebootPool(this.selectedRows)) {
                    if (length == 1) {
                        this.classList.remove('actions-state-2');
                        this.classList.remove('actions-state-3');
                        this.classList.add('actions-state-1');
                    } else if (length > 1) {
                        this.classList.remove('actions-state-1');
                        this.classList.remove('actions-state-3');
                        this.classList.add('actions-state-2');
                    }
                } else {
                    this.classList.remove('actions-state-1');
                    this.classList.remove('actions-state-2');
                    this.classList.add('actions-state-3');
                }
            } else {
                this.classList.remove('actions-state-1');
                this.classList.remove('actions-state-2');
                this.classList.remove('actions-state-3');
            }
        }
    },

    _checkOnRebootPool: {
        value: function (selectedRows) {
            return selectedRows.some(function(row){
                return row.object.onReboot == true;
            });
        }
    }
});
