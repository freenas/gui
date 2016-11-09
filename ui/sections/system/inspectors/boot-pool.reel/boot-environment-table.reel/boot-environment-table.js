/**
 * @module ui/boot-environment-table.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class BootEnvironmentTable
 * @extends Component
 */
exports.BootEnvironmentTable = Component.specialize({
    enterDocument: {
        value: function (isFirstTime) {
            if (isFirstTime) {
                this.addEventListener("action", this, false);
                this._bootEnvironmentService = this.application.bootEnvironmentService;
            }
        }
    },

    handleDeleteAction: {
        value: function () {
            return this._performAction( this.table.selectedRows,
                                        this._bootEnvironmentService.delete,
                                        this._bootEnvironmentService);
        }
    },

    handleActivateAction: {
        value: function () {
            this._performAction(this.table.selectedRows,
                                this._bootEnvironmentService.activateBootEnvironment,
                                this._bootEnvironmentService);
        }
    },

    handleCloneAction: {
        value: function () {
            this._performAction(this.table.selectedRows,
                                this._bootEnvironmentService.cloneBootEnvironment,
                                this._bootEnvironmentService);
        }
    },

    handleKeepOnButtonAction: {
        value: function () {
            this._performAction(this.table.selectedRows,
                                this._bootEnvironmentService.keepBootEnvironment,
                                this._bootEnvironmentService);
        }
    },

    handleKeepOffButtonAction: {
        value: function () {
            this._performAction(this.table.selectedRows,
                                this._bootEnvironmentService.dontKeepBootEnvironment,
                                this._bootEnvironmentService);
        }
    },

    handleKeepToggleAction: {
        value:function (event) {
            var bootEnvironment = this._findBootEnvironmentFromActionEvent(event);
                this._performAction([bootEnvironment],
                                this._bootEnvironmentService.saveBootEnvironment,
                                this._bootEnvironmentService);
        }
    },

    handleAction: {
        value: function (event) {
            if(event.detail && event.detail.get('eventName') == 'textValueChanged') {
                var bootEnvironment = this._findBootEnvironmentFromActionEvent(event);
                this._performAction([bootEnvironment],
                                this._bootEnvironmentService.saveBootEnvironment,
                                this._bootEnvironmentService);
            }
        }
    },

    _performAction: {
        value: function (selectedRows, action, context) {

            if (selectedRows.length) {
                var promises = [];
                for (i = 0; i < selectedRows.length; i++) {
                    selectedRows[i].object.isProcessing = true;
                    promises.push(action.call(context, selectedRows[i].object));
                }

                Promise.all(promises).then(function(response){
                    for (i = 0; i < selectedRows.length; i++) {
                        selectedRows[i].object.isProcessing = false;
                    }
                });
            }

        }
    },

    _findBootEnvironmentRowComponentWithElement: {
        value: function (element) {
            var iteration = this.table.rowRepetition._findIterationContainingElement(element);

            if (iteration) {
                return iteration._childComponents[0];
            }
        }
    },

    _findBootEnvironmentFromActionEvent: {
        value: function (actionEvent) {
            var iteration = this.table.findRowIterationContainingElement(actionEvent.target.element);

            return iteration ? iteration.object : null;
        }
    }

});
