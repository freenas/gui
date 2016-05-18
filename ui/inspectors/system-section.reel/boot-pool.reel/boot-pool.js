/**
 * @module ui/boot-pool.reel
 */
var Component = require("montage/ui/component").Component,
    Bindings = require("montage/core/core").Bindings,
    Promise = require("montage/core/promise").Promise,
    Model = require("core/model/model").Model;

/**
 * @class BootPool
 * @extends Component
 */
exports.BootPool = Component.specialize(/** @lends BootPool# */ {

    enterDocument: {
        value: function (isFirstTime) {
            if (isFirstTime) {
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
                this._populatingPromise = Promise.all([this._getBootEnvironments(), this._getBootVolume()]).bind(this).then(function () {
                    this._populatingPromise = null;
                });
            }
        }
    },

    _getBootEnvironments: {
        value: function () {
            var self = this;

            return this.application.dataService.fetchData(Model.BootEnvironment).then(function (bootEnvironment) {
                self.bootEnvironments = bootEnvironment;
            });
        }
    },

    _getBootVolume: {
        value: function () {
            var self = this;

            return this.application.dataService.callBackend("boot.pool.get_config").then(function (bootVolume) {
                self.bootVolume = bootVolume.data;
            });
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

            if (bootEnvironment && !bootEnvironment.on_reboot && !bootEnvironment.active) {
                var self = this;

                return this.application.dataService.deleteDataObject(bootEnvironment).then(function () {
                    // fixme: it seems like there is no event raised from the middleware,
                    // when a boot Environment is modified.
                    self.bootEnvironments.splice(self.bootEnvironments.indexOf(bootEnvironment), 1);
                });
            }
        }
    },

    handleActivateAction: {
        value: function (event) {
            var nextBootEnvironment = this._findBootEnvironmentFromActionEvent(event);

            if (nextBootEnvironment && !nextBootEnvironment.on_reboot) {
                var currentBootEnvironment = this._findCurrentBootEnvironment();
                nextBootEnvironment.on_reboot = true;
                currentBootEnvironment.on_reboot = false;

                return this._saveBootEnvironment(nextBootEnvironment).then(Function.noop, function () {
                    // fixme: it seems like there is no event raised from the middleware,
                    // when a boot Environment is modified.
                    currentBootEnvironment.on_reboot = true;
                    nextBootEnvironment.on_reboot = false;
                });
            }
        }
    },

    handleUpdateAction: {
        value: function (event) {
            var bootEnvironment = this._findBootEnvironmentFromActionEvent(event);

            if (bootEnvironment) {
                return this._saveBootEnvironment(bootEnvironment);
            }
        }
    },

    handleCloneAction: {
        value: function (event) {
            var bootEnvironment = this._findBootEnvironmentFromActionEvent(event);

            if (bootEnvironment) {
                // fixme: it seems like there is no event raised from the middleware,
                // when a boot Environment is modified.
                return Model.BootEnvironment.objectPrototype.clone(
                    this._findAvailableBootEnvironmentNameWithName(bootEnvironment.id),
                    bootEnvironment.id
                );
            }
        }
    },

    _findAvailableBootEnvironmentNameWithName: {
        value: function (bootEnvironmentName) {
            var bootEnvironments = this.bootEnvironments,
                regexLastIndex = /(-copy-([0-9]+)$)/,
                dataBootEnvironmentName = regexLastIndex.exec(bootEnvironmentName),
                regex, lastUsedBootEnvironmentIndex, bootEnvironment, i, length, tmpName,
                availableBootEnvironmentName, data, bootEnvironmentId;

            if (dataBootEnvironmentName) {
                lastUsedBootEnvironmentIndex = dataBootEnvironmentName[2];
                bootEnvironmentName = bootEnvironmentName.replace(new RegExp(dataBootEnvironmentName[0]), "");
                regex = new RegExp("^" + bootEnvironmentName + "-copy-[0-9]+$");
            } else {
                lastUsedBootEnvironmentIndex = 0;
                regex = new RegExp("^" + bootEnvironmentName)
            }

            for (i = 0, length = bootEnvironments.length; i < length; i++) {
                bootEnvironmentId = bootEnvironments[i].id;

                if (regex.test(bootEnvironmentId)) {
                    data = regexLastIndex.exec(bootEnvironmentId);

                    if (data && data[2] > lastUsedBootEnvironmentIndex) {
                        lastUsedBootEnvironmentIndex = data[2];
                    }
                }
            }

            return bootEnvironmentName + "-copy-" + ++lastUsedBootEnvironmentIndex;
        }
    },

    _findBootEnvironmentFromActionEvent: {
        value: function (actionEvent) {
            var iteration = this.bootEnvironmentTable.findRowIterationContainingElement(actionEvent.target.element);

            return iteration ? iteration.object : null;
        }
    },


    _saveBootEnvironment: {
        value: function (bootEnvironment) {
            return this.application.dataService.saveDataObject(bootEnvironment);
        }
    },

    _findCurrentBootEnvironment: {
        value: function () {
            var response;

            if (this.bootEnvironments) {
                for (var i = 0, length = this.bootEnvironments.length; i < length && !response; i++) {
                    response = this.bootEnvironments[i].on_reboot ? this.bootEnvironments[i] : null;
                }
            }

            return response;
        }
    }

}, {

    REAL_NAME_COMPONENT_MODULE_ID: {
        value: "blue-shark/ui/text-field.reel"
    }

});
