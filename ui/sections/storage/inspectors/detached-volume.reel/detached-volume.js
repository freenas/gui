var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector;

exports.DetachedVolume = AbstractInspector.specialize({
    _inspectorTemplateDidLoad: {
        value: function() {
            this.topologyType = this._sectionService.TOPOLOGY_TYPE;
        }
    },

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
