var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector;

exports.ScrubArgs = AbstractInspector.specialize({
    _inspectorTemplateDidLoad: {
        value: function() {
            var self = this;
            this._sectionService.listVolumes().then(function(volumes) {
                self.volumes = volumes;
            });
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            this.super(isFirstTime);
            if (this.isNew) {
                this.object.clear();
                this.object.push('---');
            }
        }
    },

    save: {
        value: function(task) {
            if (task.args && task.args[0] === '---') {
                task.args[0] = null;
            }
            return task.args;
        }
    }
});
