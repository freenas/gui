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
            if (!this.object || this.object.length != 1) {
                this.object = ['---'];
                this.object.length = 1;
            }
        }
    }
});
