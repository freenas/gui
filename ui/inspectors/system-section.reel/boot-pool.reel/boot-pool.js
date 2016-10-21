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

    handleDeleteAction: {
        value: function (event) {
            var bootEnvironment = this._findBootEnvironmentFromActionEvent(event);

            if (this._bootEnvironmentService.canDeleteBootEnvironment(bootEnvironment)) {
                return this._performAction(
                    event,
                    this._bootEnvironmentService.delete(bootEnvironment)
                );
            }
        }
    },

    handleActivateAction: {
        value: function (event) {
            var nextBootEnvironment = this._findBootEnvironmentFromActionEvent(event);

            if (this._bootEnvironmentService.canActivateBootEnvironment(nextBootEnvironment)) {
                return this._performAction(
                    event,
                    this._bootEnvironmentService.activateBootEnvironment(nextBootEnvironment)
                );
            }
        }
    },

    handleRenameAction: {
        value: function (event) {
            var bootEnvironment = this._findBootEnvironmentFromActionEvent(event);

            if (bootEnvironment) {
                return this._performAction(
                    event,
                    this._bootEnvironmentService.persistBootEnvironmentRenaming(bootEnvironment)
                );
            }
        }
    },

    handleCloneAction: {
        value: function (event) {
            var bootEnvironment = this._findBootEnvironmentFromActionEvent(event);

            if (bootEnvironment) {
                return this._performAction(
                    event,
                    this._bootEnvironmentService.cloneBootEnvironment(bootEnvironment)
                );
            }
        }
    },

    handleKeepAction: {
        value: function (event) {
            var bootEnvironment = this._findBootEnvironmentFromActionEvent(event);

            if (bootEnvironment) {
                return this._performAction(
                    event,
                    this._bootEnvironmentService.toggleKeepBootEnvironment(bootEnvironment)
                );
            }
        }
    },

    _performAction: {
        value: function (actionEvent, promise) {
            var bootEnvironmentRow = this._findBootEnvironmentRowComponentWithElement(actionEvent.target.element);

            if (bootEnvironmentRow) {
                var className = this.constructor.ROW_PENDING_ACTION_CLASS_NAME;
                bootEnvironmentRow.classList.add(className);

                promise.finally(function () {
                    bootEnvironmentRow.classList.remove(className);
                });
            }

            return promise;
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
    },

    ROW_PENDING_ACTION_CLASS_NAME: {
        value: "is-pending"
    }

});
