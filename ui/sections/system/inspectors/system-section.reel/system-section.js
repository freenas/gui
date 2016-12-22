var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    Model = require("core/model/model").Model;

/**
 * @class SystemSection
 * @extends Component
 */
exports.SystemSection = AbstractInspector.specialize({

    _object: {
        value: null
    },

    object: {
        set: function(object) {
            switch (object.identifier) {
                case "serialConsole":
                case "languageAndRegion":
                case "debug":
                case "hardware":
                case "WebUI":
                case "alert":
                case "system":
                case "support":
                    this.canSave = true;
                    this.canRevert = true;
                    break;
                case "updates":
                case "bootPool":
                case "overview":
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
    },

    enterDocument: {
        value: function(isFirstTime) {
            this.super(isFirstTime);
            this.classList.toggle(this.object.identifier);
        }
    },

    exitDocument: {
        value: function() {
            this.super();
            this.classList.toggle(this.object.identifier);
        }
    },

    save: {
        value: function() {
            if (this.sectionComponent[this.object.identifier] && typeof this.sectionComponent[this.object.identifier].save === "function") {
                this.sectionComponent[this.object.identifier].save();
            }
        }
    },

    revert: {
        value: function() {
            if (this.sectionComponent[this.object.identifier] && typeof this.sectionComponent[this.object.identifier].revert === "function") {
                this.sectionComponent[this.object.identifier].revert();
            }
        }
    }
});
