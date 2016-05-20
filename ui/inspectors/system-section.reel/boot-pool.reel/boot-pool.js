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
                this.addRangeAtPathChangeListener("bootEnvironments", this, "_handleBootEnvironmentsChange");
                this.addEventListener("action", this, false);
                this.pendingBootEnvironmentNames = [];
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

    _handleBootEnvironmentsChange: {
        value: function (plus, minus) {
            if (plus && plus.length) {
                var bootEnvironment;

                for (var i = 0, length = plus.length; i < length; i++) {
                    bootEnvironment = plus[i];
                    bootEnvironment.onReboot = bootEnvironment.on_reboot;
                }
            }
        }
    },

    _getBootEnvironments: {
        value: function () {
            var self = this;

            return this.application.dataService.fetchData(Model.BootEnvironment).then(function (bootEnvironments) {
                self.bootEnvironments = bootEnvironments;
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

            if (bootEnvironment && !bootEnvironment.onReboot && !bootEnvironment.active) {
                return this.application.dataService.deleteDataObject(bootEnvironment);
            }
        }
    },

    handleActivateAction: {
        value: function (event) {
            var nextBootEnvironment = this._findBootEnvironmentFromActionEvent(event);

            if (nextBootEnvironment && !nextBootEnvironment.onReboot) {
                var currentBootEnvironment = this._findCurrentBootEnvironment();
                nextBootEnvironment.onReboot = true;
                currentBootEnvironment.onReboot = false;

                return Model.BootEnvironment.objectPrototype.activate(nextBootEnvironment.persistedId).then(Function.noop, function () {
                    currentBootEnvironment.onReboot = true;
                    nextBootEnvironment.onReboot = false;
                });
            }
        }
    },

    handleRenameAction: {
        value: function (event) {
            var bootEnvironment = this._findBootEnvironmentFromActionEvent(event);

            if (bootEnvironment) {
                return this.application.dataService.saveDataObject(bootEnvironment).then(function () {
                    // need to be done before we get the entity change event.
                    //Fixme: need new version of the middleware for checking.
                    bootEnvironment.persistedId = bootEnvironment.id;
                });
            }
        }
    },

    handleCloneAction: {
        value: function (event) {
            var bootEnvironment = this._findBootEnvironmentFromActionEvent(event);

            if (bootEnvironment) {
                var cloneName = this._findAvailableBootEnvironmentNameWithName(bootEnvironment.persistedId),
                    self = this;

                return Model.BootEnvironment.objectPrototype.clone(
                    //FIXME: not safe! should be done by the middleware!!
                    cloneName,
                    bootEnvironment.persistedId
                ).finally(function () {
                    self.pendingBootEnvironmentNames.splice(self.pendingBootEnvironmentNames.indexOf(cloneName), 1);
                });
            }
        }
    },

    _findAvailableBootEnvironmentNameWithName: {
        value: function (bootEnvironmentName) {
            var bootEnvironments = this.bootEnvironments,
                regexLastIndex = /(-copy-([0-9]+)$)/,
                dataBootEnvironmentName = regexLastIndex.exec(bootEnvironmentName),
                regexBootEnvironmentName, lastUsedBootEnvironmentIndex;

            if (dataBootEnvironmentName) {
                lastUsedBootEnvironmentIndex = dataBootEnvironmentName[2];
                bootEnvironmentName = bootEnvironmentName.replace(new RegExp(dataBootEnvironmentName[0]), "");
                regexBootEnvironmentName = new RegExp("^" + bootEnvironmentName + "-copy-[0-9]+$");
            } else {
                lastUsedBootEnvironmentIndex = 0;
                regexBootEnvironmentName = new RegExp("^" + bootEnvironmentName);
            }

            lastUsedBootEnvironmentIndex = this._findLastUsedBootEnvironmentIndex(
                bootEnvironments, lastUsedBootEnvironmentIndex, regexLastIndex, regexBootEnvironmentName
            );

            lastUsedBootEnvironmentIndex = this._findLastUsedBootEnvironmentIndex(
                this.pendingBootEnvironmentNames, lastUsedBootEnvironmentIndex, regexLastIndex, regexBootEnvironmentName
            );

            var availableBootEnvironmentNameWithName = bootEnvironmentName + "-copy-" + ++lastUsedBootEnvironmentIndex;
            this.pendingBootEnvironmentNames.push(availableBootEnvironmentNameWithName);

            return availableBootEnvironmentNameWithName;
        }
    },

    _findLastUsedBootEnvironmentIndex: {
        value: function (bootEnvironments, lastUsedBootEnvironmentIndex, regexLastIndex, regexBootEnvironmentName) {
            var bootEnvironmentId, data;

            for (var i = 0, length = bootEnvironments.length; i < length; i++) {
                bootEnvironmentId = bootEnvironments[i].id || bootEnvironments[i];

                if (regexBootEnvironmentName.test(bootEnvironmentId)) {
                    data = regexLastIndex.exec(bootEnvironmentId);

                    if (data && data[2] > lastUsedBootEnvironmentIndex) {
                        lastUsedBootEnvironmentIndex = data[2];
                    }
                }
            }

            return lastUsedBootEnvironmentIndex;
        }
    },

    _findBootEnvironmentFromActionEvent: {
        value: function (actionEvent) {
            var iteration = this.bootEnvironmentTable.findRowIterationContainingElement(actionEvent.target.element);

            return iteration ? iteration.object : null;
        }
    },

    _findCurrentBootEnvironment: {
        value: function () {
            var response;

            if (this.bootEnvironments) {
                for (var i = 0, length = this.bootEnvironments.length; i < length && !response; i++) {
                    response = this.bootEnvironments[i].onReboot ? this.bootEnvironments[i] : null;
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
