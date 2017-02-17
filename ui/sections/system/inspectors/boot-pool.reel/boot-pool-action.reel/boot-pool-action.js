var Component = require("montage/ui/component").Component;

exports.BootPoolAction = Component.specialize({

    enterDocument: {
        value: function (isFirstTime) {
            if(isFirstTime) {
                this.addRangeAtPathChangeListener('selectedRows', this, 'handleSelectedRowsChange');
            }
        }
    },

    currentState: {
        value: "default"
    },

    handleSelectedRowsChange: {
        value: function () {
            var selection = this.selectedRows,
                length = selection.length;

            if (length) {
                if(length > 1) {
                    if (!this._checkIfCurrentPool(selection) || !this._checkIfNextPool(selection)) {
                        // keep
                        this.currentState = "state-1";
                    } else {
                        this.currentState = "state-2";
                    }
                } else {
                    if (this._checkIfNextPool(selection)) {
                        // clone, keep
                        this.currentState = "state-3";
                    } else if (this._checkIfCurrentPool(selection)) {
                        // clone, keep, activate
                        this.currentState = "state-4";
                    } else {
                        // clone, keep, activate, delete
                        this.currentState = "state-5";
                    }
                }
            } else {
                this.currentState = "default";
            }
        }
    },

    _checkIfCurrentPool: {
        value: function (selectedRows) {
            return selectedRows.some(function(row){
                return row.object.active == true;
            });
        }
    },

    _checkIfNextPool: {
        value: function (selectedRows) {
            return selectedRows.some(function(row){
                return row.object.onReboot == true;
            });
        }
    }
});
