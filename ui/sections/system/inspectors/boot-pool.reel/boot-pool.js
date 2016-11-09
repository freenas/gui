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
    }

});
