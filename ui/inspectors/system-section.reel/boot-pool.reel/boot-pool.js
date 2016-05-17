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
                Bindings.defineBinding(loadedComponent, "value", {"<->": "object.realname"});
            }
        }
    }

}, {

    REAL_NAME_COMPONENT_MODULE_ID: {
        value: "blue-shark/ui/text-field.reel"
    }

});
