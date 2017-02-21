var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector;

exports.VmSnapshot = AbstractInspector.specialize({
    save: {
        value: function () {
            if (!this.object.description) {
                this.object.description = "";
            }
            if (this.object._isNew) {
                return this._sectionService.snapshotVmToName(this.object.parent, this.object.name, this.object.description);
            } else {
                // fixme, these properties shouldn't need to be deleted
                delete this.object.parent.created_at;
                delete this.object.parent.updated_at;
                this.inspector.save();
            }
        }
    },

    handleRollbackAction: {
        value: function() {
            this._sectionService.rollbackToSnapshot(this.object.id);
        }
    }
});
