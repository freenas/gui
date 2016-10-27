/**
 * @module ui/boot-pool.reel
 */
var Component = require("montage/ui/component").Component,
    Bindings = require("montage/core/core").Bindings,
    Promise = require("montage/core/promise").Promise;

/**
 * @class BootPool
 * @extends Component
 */
exports.BootPool = Component.specialize(/** @lends BootPool# */ {

    enterDocument: {
        value: function (isFirstTime) {
            if (isFirstTime) {
                this._bootEnvironmentService = this.application.bootEnvironmentService;
                this.addEventListener("customTableCellLoaded", this, false);
                this.addEventListener("action", this, false);
            }

            this._populateComponentIfNeeded();
        }
    },

    bootEnvironments: {
        value: null
    },

    bootVolume: {
        value: null
    },

    _populatingPromise: {
        value: null
    },

    _populateComponentIfNeeded: {
        value: function () {
            if (!this._populatingPromise && (!this.bootEnvironments || !this.bootVolume)) {
                this._populatingPromise = Promise.all([
                        this._bootEnvironmentService.list(),
                        this._bootEnvironmentService.getBootVolumeConfig()
                ]).bind(this).then(function (data) {
                    this.bootEnvironments = data[0];
                    this.bootVolume = data[1];
                    this._populatingPromise = null;
                });
            }
        }
    },

    handleDeleteAction: {
        value: function () {
            return this._performAction( this.bootEnvironmentTable.selectedRows,
                                        this._bootEnvironmentService.delete,
                                        this._bootEnvironmentService);
        }
    },

    handleActivateAction: {
        value: function () {
            this._performAction(this.bootEnvironmentTable.selectedRows,
                                this._bootEnvironmentService.activateBootEnvironment,
                                this._bootEnvironmentService);
        }
    },

    handleCustomTableCellLoaded: {
        value: function (event) {
            var detail = event.detail,
                columnContext = detail.columnContext,
                loadedComponent = detail.loadedComponent;

            if (columnContext.label === "Name" && !loadedComponent.getBinding("value")) {
                Bindings.defineBinding(loadedComponent, "value", {"<->": "object.id"});
            }
        }
    },

    handleCloneAction: {
        value: function () {
            this._performAction(this.bootEnvironmentTable.selectedRows,
                                this._bootEnvironmentService.cloneBootEnvironment,
                                this._bootEnvironmentService);
        }
    },

    handleKeepAction: {
        value: function (arr) {
            this._performAction(arr,
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

            if(event.target.ownerComponent.identifier == "keep") {
                var bootEnvironment = this._findBootEnvironmentFromActionEvent(event);
                this.handleKeepAction([bootEnvironment]);
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
            var iteration = this.bootEnvironmentTable.rowRepetition._findIterationContainingElement(element);

            if (iteration) {
                return iteration._childComponents[0];
            }
        }
    },

    _findBootEnvironmentFromActionEvent: {
        value: function (actionEvent) {
            var iteration = this.bootEnvironmentTable.findRowIterationContainingElement(actionEvent.target.element);

            return iteration ? iteration.object : null;
        }
    }

}, {

    REAL_NAME_COMPONENT_MODULE_ID: {
        value: "blue-shark/ui/text-field.reel"
    }

});
