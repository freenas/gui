var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector;

exports.DetachedVolume = AbstractInspector.specialize({
    enterDocument: {
        value: function() {
            this.object.topology._isDetached = this.object._isDetached;
        }
    },

    delete: {
        value: function() {
            this._sectionService.deleteDetachedVolume(this.object);
        }
    },

    handleImportAction: {
        value: function () {
            this._sectionService.importDetachedVolume(this.object);
        }
    }
});
