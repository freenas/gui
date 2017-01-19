var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector;

exports.VmCloneCreator = AbstractInspector.specialize({
    save: {
        value: function () {
            return this._sectionService.cloneVmToName(this.object.parent, this.object.name);
        }
    }
});
