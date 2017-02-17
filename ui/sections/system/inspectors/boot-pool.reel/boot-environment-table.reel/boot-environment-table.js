var Component = require("montage/ui/component").Component,
    _ = require('lodash');

exports.BootEnvironmentTable = Component.specialize({
    enterDocument: {
        value: function (isFirstTime) {
            if (isFirstTime) {
                this.addEventListener("action", this, false);
            }
        }
    },

    handleDeleteAction: {
        value: function () {
            return this._performAction( this.table.selectedRows,
                                        this.service.deleteBootEnvironment,
                                        this.service);
        }
    },

    handleActivateAction: {
        value: function () {
            this._performAction(this.table.selectedRows,
                                this.service.activateBootEnvironment,
                                this.service);
        }
    },

    handleCloneAction: {
        value: function () {
            this._performAction(this.table.selectedRows,
                                this.service.cloneBootEnvironment,
                                this.service);
        }
    },

    handleKeepOnButtonAction: {
        value: function () {
            this._performAction(this.table.selectedRows,
                                this.service.keepBootEnvironment,
                                this.service);
        }
    },

    handleKeepOffButtonAction: {
        value: function () {
            this._performAction(this.table.selectedRows,
                                this.service.dontKeepBootEnvironment,
                                this.service);
        }
    },

    _performAction: {
        value: function (selectedRows, action, context) {
            if (selectedRows.length) {
                Promise.all(_.map(selectedRows, function(row) {
                    row.object._isLocked = true;
                    return action.call(context, row.object).then(function(submittedTask) {
                        return submittedTask && submittedTask.taskPromise;
                    }).finally(function() {
                        row.object._isLocked = false;
                    });
                }));
            }
        }
    }

});
