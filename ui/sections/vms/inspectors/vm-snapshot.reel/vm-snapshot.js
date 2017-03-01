var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    _ = require("lodash");

exports.VmSnapshot = AbstractInspector.specialize({
    enterDocument: {
        value: function() {
            var self = this;
            if (!this.object._parent) {
                this._sectionService.loadEntries().then(function(vms) {
                    self.object._parent = _.find(vms, function (vm) {
                        if (self.object.parent.id) {
                            return vm.id === self.object.parent.id;
                        }
                    });
                });
            }
        }
    },

    save: {
        value: function () {
            var self = this;
            if (!this.object.description) {
                this.object.description = "";
            }
            if (this.inspector.needSaveConfirmation) {
                this._sectionService.stopVm(this.object._parent, false).then(function(taskSubmission) {
                    return taskSubmission.taskPromise;
                }).then(function() {
                    return self._sectionService.snapshotVmToName(self.object.parent, self.object.name, self.object.description
                    ).then(function(taskSubmission) {
                        return taskSubmission.taskPromise;
                    }).then(function() {
                        return self._sectionService.startVm(self.object._parent);
                    });
                });
            } else if (this.object._isNew) {
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
