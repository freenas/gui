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
                return this._bootEnvironmentService.delete(bootEnvironment);
            }
        }
    },

    handleActivateAction: {
        value: function (event) {
            var nextBootEnvironment = this._findBootEnvironmentFromActionEvent(event);

            if (this._bootEnvironmentService.canActivateBootEnvironment(nextBootEnvironment)) {
                this._bootEnvironmentService.activateBootEnvironment(nextBootEnvironment);
            }
        }
    },

    handleRenameAction: {
        value: function (event) {
            var bootEnvironment = this._findBootEnvironmentFromActionEvent(event);

            if (bootEnvironment) {
                return this._bootEnvironmentService.persistBootEnvironmentRenaming(bootEnvironment);;
            }
        }
    },

    handleCloneAction: {
        value: function (event) {
            var bootEnvironment = this._findBootEnvironmentFromActionEvent(event);

            if (bootEnvironment) {
                var self = this;

                return this._bootEnvironmentService.cloneBootEnvironment(bootEnvironment);
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
