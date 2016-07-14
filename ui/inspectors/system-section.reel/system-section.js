var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;

/**
 * @class SystemSection
 * @extends Component
 */
exports.SystemSection = Component.specialize({

    _object: {
        value: null
    },

    object: {
        set: function(object) {
            switch (object.identifier) {
                case "general":
                case "serialConsole":
                case "languageAndRegion":
                case "debug":
                case "hardware":
                    this.canSave = true;
                    this.canRevert = true;
                    break;
                case "updates":
                case "bootPool":
                case "systemInfo":
                    this.canSave = false;
                    this.canRevert = false;
                    break;
            }
            this._object = object;
        },
        get: function() {
            return this._object;
        }
    },

    canSave: {
        value: null
    },

    canRevert: {
        value: null
    }
});
