var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector;

exports.Settings = AbstractInspector.specialize({
    revert: {
        value: function() {
            return this._sectionService.revertSettings();
        }
    },

    save: {
        value: function() {
            return this._sectionService.saveSettings();
        }
    }
});
